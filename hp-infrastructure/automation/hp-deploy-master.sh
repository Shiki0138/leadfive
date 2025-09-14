#!/bin/bash
# HP Infrastructure Master Deployment Script
# Purpose: Orchestrate complete HP infrastructure deployment

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_section() {
    echo -e "\n${BLUE}==== $1 ====${NC}\n"
}

# Configuration
DEPLOYMENT_ROOT="/opt/hp-deployment"
LOG_DIR="${DEPLOYMENT_ROOT}/logs"
CONFIG_DIR="${DEPLOYMENT_ROOT}/configs"
SCRIPTS_DIR="${DEPLOYMENT_ROOT}/scripts"
INVENTORY_FILE="${CONFIG_DIR}/inventory.json"
DEPLOYMENT_LOG="${LOG_DIR}/deployment-$(date +%Y%m%d-%H%M%S).log"

# Create directory structure
create_directories() {
    log_section "Creating Directory Structure"
    
    local dirs=(
        "${DEPLOYMENT_ROOT}"
        "${LOG_DIR}"
        "${CONFIG_DIR}"
        "${SCRIPTS_DIR}"
        "${DEPLOYMENT_ROOT}/certificates"
        "${DEPLOYMENT_ROOT}/firmware"
        "${DEPLOYMENT_ROOT}/backups"
        "${DEPLOYMENT_ROOT}/reports"
    )
    
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log_info "Created directory: $dir"
        fi
    done
}

# Deploy HP ProLiant Servers
deploy_proliant_servers() {
    log_section "Deploying HP ProLiant Servers"
    
    # Read server inventory
    if [ ! -f "${INVENTORY_FILE}" ]; then
        log_error "Inventory file not found: ${INVENTORY_FILE}"
        return 1
    fi
    
    # Extract server list from inventory
    local servers=$(jq -r '.servers[] | @base64' "${INVENTORY_FILE}")
    
    for server_data in $servers; do
        # Decode server data
        local server=$(echo "$server_data" | base64 -d)
        local hostname=$(echo "$server" | jq -r '.hostname')
        local ilo_ip=$(echo "$server" | jq -r '.ilo_ip')
        local ilo_user=$(echo "$server" | jq -r '.ilo_user')
        local ilo_pass=$(echo "$server" | jq -r '.ilo_password')
        
        log_info "Configuring server: $hostname ($ilo_ip)"
        
        # Configure iLO
        if [ -x "${SCRIPTS_DIR}/ilo5-config.sh" ]; then
            "${SCRIPTS_DIR}/ilo5-config.sh" "$ilo_ip" "$ilo_user" "$ilo_pass" configure 2>&1 | tee -a "$DEPLOYMENT_LOG"
            
            # Configure iLO federation
            "${SCRIPTS_DIR}/ilo5-config.sh" "$ilo_ip" "$ilo_user" "$ilo_pass" federation "HP-Federation" "FederationKey123" 2>&1 | tee -a "$DEPLOYMENT_LOG"
            
            # Configure directory integration
            "${SCRIPTS_DIR}/ilo5-config.sh" "$ilo_ip" "$ilo_user" "$ilo_pass" directory 2>&1 | tee -a "$DEPLOYMENT_LOG"
        else
            log_error "iLO configuration script not found"
        fi
        
        # Apply BIOS settings using RESTful Interface Tool
        if command -v ilorest &> /dev/null; then
            log_info "Applying BIOS configuration to $hostname"
            ilorest login "$ilo_ip" -u "$ilo_user" -p "$ilo_pass"
            ilorest load -f "${CONFIG_DIR}/proliant-gen10-bios.json"
            ilorest commit
            ilorest logout
        else
            log_warn "iLOREST tool not found - skipping BIOS configuration"
        fi
        
        # Deploy OS if needed
        local os_type=$(echo "$server" | jq -r '.os_type // "none"')
        if [ "$os_type" != "none" ]; then
            deploy_os_to_server "$hostname" "$ilo_ip" "$os_type"
        fi
    done
}

# Deploy OS to server
deploy_os_to_server() {
    local hostname=$1
    local ilo_ip=$2
    local os_type=$3
    
    log_info "Deploying $os_type to $hostname"
    
    case $os_type in
        "esxi")
            deploy_esxi "$hostname" "$ilo_ip"
            ;;
        "rhel")
            deploy_rhel "$hostname" "$ilo_ip"
            ;;
        "windows")
            deploy_windows "$hostname" "$ilo_ip"
            ;;
        *)
            log_warn "Unknown OS type: $os_type"
            ;;
    esac
}

# Deploy ESXi
deploy_esxi() {
    local hostname=$1
    local ilo_ip=$2
    
    log_info "Deploying VMware ESXi to $hostname"
    
    # Mount ISO via iLO virtual media
    curl -k -u "${ilo_user}:${ilo_pass}" \
        -H "Content-Type: application/json" \
        -X POST \
        -d '{
            "Image": "http://deployment.local/isos/VMware-ESXi-7.0U3.iso",
            "Inserted": true,
            "WriteProtected": true
        }' \
        "https://${ilo_ip}/redfish/v1/Managers/1/VirtualMedia/2/Actions/VirtualMedia.InsertMedia"
    
    # Set one-time boot to CD
    curl -k -u "${ilo_user}:${ilo_pass}" \
        -H "Content-Type: application/json" \
        -X PATCH \
        -d '{
            "Boot": {
                "BootSourceOverrideEnabled": "Once",
                "BootSourceOverrideTarget": "Cd"
            }
        }' \
        "https://${ilo_ip}/redfish/v1/Systems/1"
    
    # Power cycle server
    curl -k -u "${ilo_user}:${ilo_pass}" \
        -H "Content-Type: application/json" \
        -X POST \
        -d '{"ResetType": "ForceRestart"}' \
        "https://${ilo_ip}/redfish/v1/Systems/1/Actions/ComputerSystem.Reset"
    
    log_info "ESXi deployment initiated for $hostname"
}

# Deploy HP Storage
deploy_hp_storage() {
    log_section "Deploying HP Storage Systems"
    
    # Read storage inventory
    local storage_systems=$(jq -r '.storage[] | @base64' "${INVENTORY_FILE}")
    
    for storage_data in $storage_systems; do
        local storage=$(echo "$storage_data" | base64 -d)
        local type=$(echo "$storage" | jq -r '.type')
        local ip=$(echo "$storage" | jq -r '.management_ip')
        local username=$(echo "$storage" | jq -r '.username')
        local password=$(echo "$storage" | jq -r '.password')
        
        case $type in
            "3par")
                deploy_3par_storage "$ip" "$username" "$password"
                ;;
            "nimble")
                deploy_nimble_storage "$ip" "$username" "$password"
                ;;
            "storevirtual")
                deploy_storevirtual "$ip" "$username" "$password"
                ;;
            *)
                log_warn "Unknown storage type: $type"
                ;;
        esac
    done
}

# Deploy 3PAR storage
deploy_3par_storage() {
    local ip=$1
    local username=$2
    local password=$3
    
    log_info "Configuring HP 3PAR at $ip"
    
    if [ -x "${SCRIPTS_DIR}/3par-storage-config.py" ]; then
        python3 "${SCRIPTS_DIR}/3par-storage-config.py" --array "$ip" --user "$username" --password "$password" 2>&1 | tee -a "$DEPLOYMENT_LOG"
    else
        log_error "3PAR configuration script not found"
    fi
}

# Deploy HP Networking
deploy_hp_networking() {
    log_section "Deploying HP Networking Equipment"
    
    # Read network inventory
    local switches=$(jq -r '.networking.switches[] | @base64' "${INVENTORY_FILE}")
    
    for switch_data in $switches; do
        local switch=$(echo "$switch_data" | base64 -d)
        local type=$(echo "$switch" | jq -r '.type')
        local ip=$(echo "$switch" | jq -r '.management_ip')
        local username=$(echo "$switch" | jq -r '.username')
        local password=$(echo "$switch" | jq -r '.password')
        
        case $type in
            "aruba-cx")
                deploy_aruba_cx "$ip" "$username" "$password"
                ;;
            "aruba-os")
                deploy_aruba_os "$ip" "$username" "$password"
                ;;
            *)
                log_warn "Unknown switch type: $type"
                ;;
        esac
    done
}

# Deploy Aruba CX switches
deploy_aruba_cx() {
    local ip=$1
    local username=$2
    local password=$3
    
    log_info "Configuring Aruba CX switch at $ip"
    
    if [ -x "${SCRIPTS_DIR}/aruba-cx-config.py" ]; then
        python3 "${SCRIPTS_DIR}/aruba-cx-config.py" --switch "$ip" --user "$username" --password "$password" 2>&1 | tee -a "$DEPLOYMENT_LOG"
    else
        log_error "Aruba CX configuration script not found"
    fi
}

# Deploy HP OneView
deploy_hp_oneview() {
    log_section "Deploying HP OneView"
    
    # Read OneView configuration
    local oneview_ip=$(jq -r '.management.oneview.ip' "${INVENTORY_FILE}")
    local oneview_user=$(jq -r '.management.oneview.username' "${INVENTORY_FILE}")
    local oneview_pass=$(jq -r '.management.oneview.password' "${INVENTORY_FILE}")
    
    if [ "$oneview_ip" != "null" ]; then
        log_info "Configuring HP OneView at $oneview_ip"
        
        if [ -x "${SCRIPTS_DIR}/oneview-config.py" ]; then
            python3 "${SCRIPTS_DIR}/oneview-config.py" --oneview "$oneview_ip" --user "$oneview_user" --password "$oneview_pass" 2>&1 | tee -a "$DEPLOYMENT_LOG"
        else
            log_error "OneView configuration script not found"
        fi
    else
        log_warn "OneView configuration not found in inventory"
    fi
}

# Validate deployment
validate_deployment() {
    log_section "Validating Deployment"
    
    local validation_passed=true
    
    # Validate server connectivity
    log_info "Validating server connectivity..."
    local servers=$(jq -r '.servers[].ilo_ip' "${INVENTORY_FILE}")
    for ilo_ip in $servers; do
        if ping -c 1 -W 2 "$ilo_ip" &> /dev/null; then
            log_info "✓ Server iLO reachable: $ilo_ip"
        else
            log_error "✗ Server iLO unreachable: $ilo_ip"
            validation_passed=false
        fi
    done
    
    # Validate storage connectivity
    log_info "Validating storage connectivity..."
    local storage_ips=$(jq -r '.storage[].management_ip' "${INVENTORY_FILE}")
    for storage_ip in $storage_ips; do
        if ping -c 1 -W 2 "$storage_ip" &> /dev/null; then
            log_info "✓ Storage reachable: $storage_ip"
        else
            log_error "✗ Storage unreachable: $storage_ip"
            validation_passed=false
        fi
    done
    
    # Validate network connectivity
    log_info "Validating network equipment connectivity..."
    local switch_ips=$(jq -r '.networking.switches[].management_ip' "${INVENTORY_FILE}")
    for switch_ip in $switch_ips; do
        if ping -c 1 -W 2 "$switch_ip" &> /dev/null; then
            log_info "✓ Switch reachable: $switch_ip"
        else
            log_error "✗ Switch unreachable: $switch_ip"
            validation_passed=false
        fi
    done
    
    if [ "$validation_passed" = true ]; then
        log_info "Deployment validation passed!"
    else
        log_error "Deployment validation failed!"
        return 1
    fi
}

# Generate deployment report
generate_report() {
    log_section "Generating Deployment Report"
    
    local report_file="${DEPLOYMENT_ROOT}/reports/deployment-report-$(date +%Y%m%d-%H%M%S).html"
    
    cat > "$report_file" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>HP Infrastructure Deployment Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #0096D6; }
        h2 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #0096D6; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
    </style>
</head>
<body>
    <h1>HP Infrastructure Deployment Report</h1>
    <p>Generated: $(date)</p>
    
    <h2>Deployment Summary</h2>
    <table>
        <tr>
            <th>Component</th>
            <th>Count</th>
            <th>Status</th>
        </tr>
        <tr>
            <td>ProLiant Servers</td>
            <td>$(jq '.servers | length' "${INVENTORY_FILE}")</td>
            <td class="success">Deployed</td>
        </tr>
        <tr>
            <td>Storage Systems</td>
            <td>$(jq '.storage | length' "${INVENTORY_FILE}")</td>
            <td class="success">Configured</td>
        </tr>
        <tr>
            <td>Network Switches</td>
            <td>$(jq '.networking.switches | length' "${INVENTORY_FILE}")</td>
            <td class="success">Configured</td>
        </tr>
    </table>
    
    <h2>Server Details</h2>
    <table>
        <tr>
            <th>Hostname</th>
            <th>Model</th>
            <th>iLO IP</th>
            <th>Status</th>
        </tr>
EOF

    # Add server details to report
    jq -r '.servers[] | "<tr><td>\(.hostname)</td><td>\(.model)</td><td>\(.ilo_ip)</td><td class=\"success\">Deployed</td></tr>"' "${INVENTORY_FILE}" >> "$report_file"
    
    cat >> "$report_file" << 'EOF'
    </table>
    
    <h2>Deployment Log</h2>
    <pre>
EOF

    # Add last 100 lines of deployment log
    tail -n 100 "$DEPLOYMENT_LOG" >> "$report_file"
    
    cat >> "$report_file" << 'EOF'
    </pre>
</body>
</html>
EOF

    log_info "Deployment report generated: $report_file"
}

# Main execution
main() {
    log_info "Starting HP Infrastructure Deployment"
    log_info "Deployment log: $DEPLOYMENT_LOG"
    
    # Create directory structure
    create_directories
    
    # Check for required tools
    log_section "Checking Prerequisites"
    local required_tools=("jq" "curl" "python3")
    for tool in "${required_tools[@]}"; do
        if command -v "$tool" &> /dev/null; then
            log_info "✓ $tool is installed"
        else
            log_error "✗ $tool is not installed"
            exit 1
        fi
    done
    
    # Deploy components
    deploy_proliant_servers
    deploy_hp_storage
    deploy_hp_networking
    deploy_hp_oneview
    
    # Validate deployment
    validate_deployment
    
    # Generate report
    generate_report
    
    log_info "HP Infrastructure Deployment completed!"
}

# Execute main function
main "$@" 2>&1 | tee -a "$DEPLOYMENT_LOG"