#!/bin/bash
# HP Security Infrastructure Deployment Script
# One-click deployment of comprehensive HP security controls

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/deployment_$(date +%Y%m%d_%H%M%S).log"

# Logging function
log() {
    echo -e "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

log_success() {
    log "${GREEN}✓ $1${NC}"
}

log_error() {
    log "${RED}✗ $1${NC}"
}

log_warning() {
    log "${YELLOW}⚠ $1${NC}"
}

log_info() {
    log "${BLUE}ℹ $1${NC}"
}

# Header
clear
echo -e "${BLUE}"
echo "============================================================"
echo "       HP Infrastructure Security Deployment"
echo "       Version 2.0 - Enterprise Security Suite"
echo "============================================================"
echo -e "${NC}"

# Pre-flight checks
log_info "Starting pre-flight checks..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   log_error "This script must be run as root"
   exit 1
fi

# Check required tools
REQUIRED_TOOLS=("python3" "ansible" "jq" "curl" "openssl")
for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! command -v "$tool" &> /dev/null; then
        log_error "Required tool '$tool' is not installed"
        exit 1
    fi
done
log_success "All required tools are installed"

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
if [[ $(echo "$PYTHON_VERSION < 3.8" | bc) -eq 1 ]]; then
    log_error "Python 3.8 or higher is required (found $PYTHON_VERSION)"
    exit 1
fi
log_success "Python version $PYTHON_VERSION is supported"

# Environment setup
log_info "Setting up environment..."

# Check for .env file
if [ ! -f "${SCRIPT_DIR}/.env" ]; then
    log_warning ".env file not found. Creating from template..."
    cat > "${SCRIPT_DIR}/.env" << 'EOF'
# HP Security Environment Configuration
# Please update these values before deployment

# iLO Credentials
ILO_AUDIT_USER=audit_user
ILO_AUDIT_PASS=changeme

# Storage Credentials
STORAGE_AUDIT_USER=storage_audit
STORAGE_AUDIT_PASS=changeme

# ClearPass API
CLEARPASS_API_TOKEN=your_api_token_here

# KMIP Server
KMIP_SERVER=10.0.100.60
DEVICE_INSIGHT_KEY=your_key_here
MDM_API_KEY=your_mdm_key

# Notification Settings
SECURITY_EMAIL=security-team@hp.com
SIEM_HEC_TOKEN=your_splunk_token
WEBHOOK_TOKEN=your_webhook_token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# ServiceNow Integration
SNOW_USERNAME=snow_user
SNOW_PASSWORD=changeme

# Jira Integration
JIRA_USERNAME=jira_user
JIRA_API_TOKEN=your_jira_token

# Vulnerability Scanner
VULN_SCANNER_USER=qualys_user
VULN_SCANNER_PASS=changeme
EOF
    log_error "Please update .env file with your credentials before continuing"
    exit 1
fi

# Source environment variables
source "${SCRIPT_DIR}/.env"
log_success "Environment variables loaded"

# Create required directories
log_info "Creating directory structure..."
DIRECTORIES=(
    "/var/log/hp-security"
    "/var/lib/hp-security/reports"
    "/etc/hp-security/certs"
    "/opt/hp-security/scripts"
)

for dir in "${DIRECTORIES[@]}"; do
    mkdir -p "$dir"
    chmod 750 "$dir"
done
log_success "Directory structure created"

# Install Python dependencies
log_info "Installing Python dependencies..."
pip3 install -q -r "${SCRIPT_DIR}/requirements.txt" || {
    log_error "Failed to install Python dependencies"
    exit 1
}
log_success "Python dependencies installed"

# Deploy configurations
log_info "Deploying security configurations..."

# Copy configuration files
cp -r "${SCRIPT_DIR}/server/configs/"* /etc/hp-security/
cp -r "${SCRIPT_DIR}/storage/configs/"* /etc/hp-security/
cp -r "${SCRIPT_DIR}/network/configs/"* /etc/hp-security/
cp -r "${SCRIPT_DIR}/management/configs/"* /etc/hp-security/
log_success "Configuration files deployed"

# Deploy scripts
log_info "Deploying security scripts..."
cp "${SCRIPT_DIR}/server/scripts/"*.sh /opt/hp-security/scripts/
cp "${SCRIPT_DIR}/management/scripts/"*.py /opt/hp-security/scripts/
chmod +x /opt/hp-security/scripts/*
log_success "Security scripts deployed"

# Set up cron jobs
log_info "Setting up scheduled tasks..."
cat > /etc/cron.d/hp-security << 'EOF'
# HP Security Automated Tasks
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# Daily compliance check at 2 AM
0 2 * * * root /opt/hp-security/scripts/automated_compliance_check.sh

# Hourly security monitoring
0 * * * * root /usr/bin/python3 /opt/hp-security/scripts/security_audit.py -c /etc/hp-security/audit_config.yml -o /var/lib/hp-security/reports/hourly_audit.json

# Weekly detailed audit (Sundays at 3 AM)
0 3 * * 0 root /usr/bin/python3 /opt/hp-security/scripts/security_audit.py -c /etc/hp-security/audit_config.yml -o /var/lib/hp-security/reports/weekly_audit.json --detailed

# Certificate expiration check (daily at 9 AM)
0 9 * * * root /opt/hp-security/scripts/check_certificates.sh

# Log rotation
0 0 * * * root /usr/sbin/logrotate -f /etc/logrotate.d/hp-security
EOF
log_success "Scheduled tasks configured"

# Deploy with Ansible (if inventory exists)
if [ -f "${SCRIPT_DIR}/deployment/ansible/inventory/production" ]; then
    log_info "Running Ansible deployment playbook..."
    cd "${SCRIPT_DIR}/deployment/ansible"
    ansible-playbook -i inventory/production hp_security_playbook.yml --check || {
        log_warning "Ansible dry-run completed with warnings. Run without --check to deploy."
    }
else
    log_warning "Ansible inventory not found. Skipping automated deployment."
fi

# Start monitoring dashboard
log_info "Starting security monitoring dashboard..."
if command -v systemctl &> /dev/null; then
    # Create systemd service
    cat > /etc/systemd/system/hp-security-dashboard.service << EOF
[Unit]
Description=HP Security Monitoring Dashboard
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${SCRIPT_DIR}
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/python3 ${SCRIPT_DIR}/monitoring/security_dashboard.py -c /etc/hp-security/audit_config.yml
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    systemctl daemon-reload
    systemctl enable hp-security-dashboard.service
    systemctl start hp-security-dashboard.service
    log_success "Security dashboard service started"
else
    log_warning "Systemd not available. Start dashboard manually."
fi

# Run initial security audit
log_info "Running initial security audit..."
/usr/bin/python3 "${SCRIPT_DIR}/management/scripts/security_audit.py" \
    -c /etc/hp-security/audit_config.yml \
    -o "/var/lib/hp-security/reports/initial_audit_$(date +%Y%m%d_%H%M%S).json" || {
    log_warning "Initial audit completed with findings. Review the report."
}

# Generate deployment summary
log_info "Generating deployment summary..."
cat > "/var/lib/hp-security/deployment_summary_$(date +%Y%m%d).txt" << EOF
HP Security Infrastructure Deployment Summary
============================================
Date: $(date)
Hostname: $(hostname)
Deployed By: $(whoami)

Components Deployed:
- Server Security (iLO, UEFI, OS Hardening)
- Storage Security (Encryption, Key Management)
- Network Security (ClearPass NAC, 802.1X)
- Monitoring Dashboard (http://$(hostname -I | awk '{print $1}'):5000)
- Automated Compliance Checking
- Security Audit Tools

Configuration Files:
- /etc/hp-security/

Scripts:
- /opt/hp-security/scripts/

Logs:
- /var/log/hp-security/

Reports:
- /var/lib/hp-security/reports/

Next Steps:
1. Review initial audit report
2. Update credentials in /etc/hp-security/
3. Configure SIEM integration
4. Test alert notifications
5. Schedule security training

Support:
- Documentation: ${SCRIPT_DIR}/README.md
- Security Team: security-team@hp.com
EOF

log_success "Deployment summary generated"

# Display completion message
echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN}       HP Security Deployment Completed Successfully!       ${NC}"
echo -e "${GREEN}============================================================${NC}\n"

log_info "Dashboard URL: http://$(hostname -I | awk '{print $1}'):5000"
log_info "Initial audit report: /var/lib/hp-security/reports/"
log_info "Deployment log: ${LOG_FILE}"

echo -e "\n${YELLOW}IMPORTANT NEXT STEPS:${NC}"
echo "1. Review the initial security audit report"
echo "2. Address any critical findings immediately"
echo "3. Configure integration with your SIEM platform"
echo "4. Test alert notifications"
echo "5. Schedule security awareness training"

echo -e "\n${BLUE}Thank you for securing your HP infrastructure!${NC}\n"

# Set restrictive permissions on sensitive files
chmod 600 /etc/hp-security/*.yml
chmod 600 "${SCRIPT_DIR}/.env"

log_success "Deployment completed at $(date)"

exit 0