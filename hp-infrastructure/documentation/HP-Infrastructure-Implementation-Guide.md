# HP Infrastructure Implementation Guide

## Overview

This guide provides comprehensive instructions for deploying HP corporate infrastructure including servers, storage, networking, and management platforms.

## Table of Contents

1. [Infrastructure Components](#infrastructure-components)
2. [Prerequisites](#prerequisites)
3. [Deployment Process](#deployment-process)
4. [Configuration Details](#configuration-details)
5. [Automation Scripts](#automation-scripts)
6. [Validation and Testing](#validation-and-testing)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Infrastructure Components

### HP ProLiant Servers
- **Models**: DL380 Gen10, DL360 Gen10, DL560 Gen10
- **Management**: HP iLO 5
- **BIOS**: Configured for optimal performance and virtualization
- **OS Support**: VMware ESXi, RHEL, Windows Server

### HP Storage Systems
- **3PAR StoreServ**: Enterprise SAN storage
- **Nimble Storage**: Hybrid flash arrays
- **StoreVirtual**: Software-defined storage

### HP Networking
- **Aruba CX Series**: Core and access switches
- **Aruba Wireless**: Controllers and access points
- **VSX**: Virtual Switching Extension for redundancy

### HP Management
- **OneView**: Infrastructure lifecycle management
- **iLO Advanced**: Remote server management
- **InfoSight**: Predictive analytics

## Prerequisites

### Software Requirements
- Python 3.8+
- HP RESTful Interface Tool (iLOREST)
- HP OneView Python SDK
- jq (JSON processor)
- curl

### Network Requirements
- Management network configured
- VLANs created and trunked
- DNS and NTP services available
- RADIUS/LDAP authentication configured

### Credentials Required
- iLO administrator credentials
- Storage array admin credentials
- Network equipment admin credentials
- OneView administrator credentials

## Deployment Process

### 1. Infrastructure Planning

```bash
# Copy and customize the inventory template
cp inventory-template.json inventory.json
# Edit inventory.json with your environment details
```

### 2. Run Master Deployment Script

```bash
# Execute the master deployment script
./hp-deploy-master.sh
```

The script will:
1. Create directory structure
2. Deploy ProLiant servers
3. Configure storage arrays
4. Setup networking equipment
5. Initialize HP OneView
6. Validate deployment
7. Generate deployment report

### 3. Individual Component Deployment

#### Deploy Servers Only
```bash
# Configure iLO
./ilo5-config.sh <ilo_ip> <username> <password> configure

# Apply BIOS settings
ilorest login <ilo_ip> -u <username> -p <password>
ilorest load -f proliant-gen10-bios.json
ilorest commit
ilorest logout
```

#### Deploy Storage Only
```bash
# Configure 3PAR
python3 3par-storage-config.py --array <ip> --user <username> --password <password>

# Configure Nimble
python3 nimble-config.py --array <ip> --user <username> --password <password>
```

#### Deploy Networking Only
```bash
# Configure Aruba CX
python3 aruba-cx-config.py --switch <ip> --user <username> --password <password>
```

#### Deploy OneView Only
```bash
# Configure OneView
python3 oneview-config.py --oneview <ip> --user <username> --password <password>
```

## Configuration Details

### Server BIOS Settings

Key settings for optimal performance:
- **Boot Mode**: UEFI
- **Power Profile**: Maximum Performance
- **Turbo Boost**: Enabled
- **Virtualization**: Intel VT-x and VT-d enabled
- **NUMA**: Enabled
- **Security**: Secure Boot enabled

### Storage Configuration

#### 3PAR Best Practices
- **CPGs**: Create separate CPGs for different workloads
- **RAID Levels**: 
  - RAID 6 for capacity
  - RAID 5 for performance
  - RAID 1 for critical data
- **Thin Provisioning**: Enable for efficient capacity usage
- **Compression**: Enable for suitable workloads

#### Volume Layout
```
FC_r6 CPG:
  - ESXi_Datastore_01 (2TB)
  - ESXi_Datastore_02 (2TB)

SSD_r5 CPG:
  - SQL_Data_01 (1TB)
  - SQL_Logs_01 (512GB)

NL_r6 CPG:
  - Backup_01 (8TB)
```

### Network Configuration

#### VLAN Design
- VLAN 10: Management (10.10.0.0/16)
- VLAN 20: Production (10.20.0.0/16)
- VLAN 30: Storage (10.30.0.0/16)
- VLAN 40: vMotion (10.40.0.0/16)
- VLAN 50: Users (10.50.0.0/16)
- VLAN 60: Voice (10.60.0.0/16)
- VLAN 100: DMZ (10.100.0.0/16)

#### VSX Configuration
- Primary: ARUBA-CX-CORE-01
- Secondary: ARUBA-CX-CORE-02
- Keepalive: Management network
- ISL: 100G LAG

### OneView Configuration

#### Resource Hierarchy
```
Datacenter
  └── Racks
      └── Enclosures
          └── Server Hardware
              └── Server Profiles
```

#### Profile Templates
- ESXi-Host-Template
- Database-Server-Template
- Web-Server-Template

## Automation Scripts

### Directory Structure
```
hp-infrastructure/
├── servers/
│   ├── bios-configs/
│   ├── firmware/
│   └── os-deployment/
├── storage/
│   ├── 3par/
│   ├── nimble/
│   └── storevirtual/
├── networking/
│   ├── aruba-switches/
│   ├── aruba-wireless/
│   └── aruba-controllers/
├── management/
│   └── oneview/
├── automation/
│   ├── hp-deploy-master.sh
│   └── inventory.json
└── documentation/
```

### Script Descriptions

1. **hp-deploy-master.sh**: Master orchestration script
2. **ilo5-config.sh**: iLO configuration and management
3. **3par-storage-config.py**: 3PAR array configuration
4. **aruba-cx-config.py**: Aruba CX switch configuration
5. **oneview-config.py**: HP OneView setup and configuration

## Validation and Testing

### Connectivity Tests
```bash
# Test iLO connectivity
for ip in $(jq -r '.servers[].ilo_ip' inventory.json); do
    ping -c 1 $ip && echo "$ip: OK" || echo "$ip: FAILED"
done

# Test storage connectivity
for ip in $(jq -r '.storage[].management_ip' inventory.json); do
    ping -c 1 $ip && echo "$ip: OK" || echo "$ip: FAILED"
done
```

### Configuration Validation
```bash
# Validate iLO configuration
curl -k -u admin:password https://<ilo_ip>/redfish/v1/Systems/1

# Validate storage configuration
python3 -c "from hp3par_client import HP3ParClient; client = HP3ParClient('<ip>'); client.login('<user>', '<pass>'); print(client.getStorageSystemInfo())"

# Validate network configuration
ssh admin@<switch_ip> "show version"
```

## Troubleshooting

### Common Issues

#### iLO Connection Failed
- Verify network connectivity
- Check iLO IP configuration
- Ensure iLO is not in maintenance mode
- Reset iLO if necessary: `ssh <ilo_ip> "reset /map1"`

#### Storage Array Unreachable
- Verify management network configuration
- Check array controller status
- Validate credentials
- Review array logs

#### OneView Discovery Failed
- Ensure iLO Advanced license is installed
- Verify network connectivity between OneView and devices
- Check firewall rules
- Review OneView logs: `/var/log/HPOneView/`

### Debug Commands

```bash
# Enable iLO debug logging
ilorest --debug login <ilo_ip> -u <user> -p <pass>

# 3PAR CLI access
ssh <3par_ip> -l <username>
cli> showsys

# Aruba CX debug
ssh admin@<switch_ip>
switch# show tech-support
```

## Best Practices

### Security
1. Use strong passwords (12+ characters)
2. Enable two-factor authentication where supported
3. Configure LDAP/AD integration
4. Enable audit logging
5. Use encrypted protocols (HTTPS, SSH)
6. Regular firmware updates

### Performance
1. Configure appropriate RAID levels for workloads
2. Enable jumbo frames for storage networks
3. Use LAG for redundancy and bandwidth
4. Configure QoS for critical traffic
5. Monitor resource utilization

### High Availability
1. Deploy redundant components
2. Configure VSX for network redundancy
3. Use remote replication for critical data
4. Implement proper backup strategies
5. Test failover scenarios regularly

### Monitoring
1. Configure SNMP for all devices
2. Enable syslog forwarding
3. Set up email alerts for critical events
4. Use HP InfoSight for predictive analytics
5. Regular health checks

## Maintenance

### Regular Tasks
- Weekly: Review system logs and alerts
- Monthly: Validate backup operations
- Quarterly: Firmware update assessment
- Annually: Disaster recovery testing

### Firmware Updates
```bash
# Check current firmware versions
ilorest firmwareupdate --list

# Download and stage firmware
ilorest firmwareupdate --download <firmware_url>

# Apply firmware updates
ilorest firmwareupdate --apply
```

## Support Resources

- HP Support Center: https://support.hpe.com
- HP OneView Documentation: https://support.hpe.com/hpesc/public/docDisplay?docId=a00111822en_us
- Aruba Support Portal: https://asp.arubanetworks.com
- HP Community Forums: https://community.hpe.com

## Conclusion

This implementation guide provides a comprehensive framework for deploying HP infrastructure. Follow the deployment process, use the provided automation scripts, and adhere to best practices for a successful implementation.

For additional support or customization requirements, consult HP Professional Services or certified HP partners.