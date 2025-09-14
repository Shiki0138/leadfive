#!/usr/bin/env python3
"""
HP OneView Configuration Script
Purpose: Configure HP OneView infrastructure management platform
"""

import json
import time
import logging
from typing import Dict, List, Optional, Any
from hpOneView.oneview_client import OneViewClient
from hpOneView.exceptions import HPOneViewException

class HPOneViewConfig:
    """HP OneView Configuration Manager"""
    
    def __init__(self, oneview_ip: str, username: str, password: str):
        self.oneview_ip = oneview_ip
        self.config = {
            "ip": oneview_ip,
            "credentials": {
                "userName": username,
                "password": password
            },
            "api_version": 2000  # OneView 5.x API version
        }
        self.client = OneViewClient(self.config)
        self.logger = self._setup_logging()
        
    def _setup_logging(self) -> logging.Logger:
        """Setup logging configuration"""
        logger = logging.getLogger('HPOneView')
        logger.setLevel(logging.INFO)
        handler = logging.FileHandler('oneview_config.log')
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger
    
    def create_datacenter(self, name: str, width: int = 600, depth: int = 1200,
                         cooling_capacity: int = 350, electrical_capacity: int = 50) -> Optional[Dict]:
        """Create datacenter"""
        datacenter_data = {
            "name": name,
            "width": width,
            "depth": depth,
            "contents": [],
            "coolingCapacity": cooling_capacity,
            "costPerKilowattHour": 0.10,
            "currency": "USD",
            "deratingType": "NaJp",
            "deratingPercentage": 20.0,
            "defaultPowerLineVoltage": 220,
            "coolingMultiplier": 1.5,
            "electricalDerating": 80
        }
        
        try:
            datacenter = self.client.datacenters.create(datacenter_data)
            self.logger.info(f"Created datacenter: {name}")
            return datacenter
        except HPOneViewException as e:
            self.logger.error(f"Failed to create datacenter: {str(e)}")
            return None
    
    def add_rack(self, datacenter_name: str, rack_name: str, height: int = 42,
                model: str = "HP 42U Rack", serial: str = "") -> Optional[Dict]:
        """Add rack to datacenter"""
        rack_data = {
            "name": rack_name,
            "serialNumber": serial,
            "height": height,
            "model": model,
            "depth": 1200,
            "width": 600,
            "partNumber": "BW946A",
            "uHeight": height
        }
        
        try:
            rack = self.client.racks.create(rack_data)
            
            # Add rack to datacenter
            datacenter = self.client.datacenters.get_by_name(datacenter_name)
            if datacenter:
                datacenter['contents'].append({
                    "resourceUri": rack['uri'],
                    "x": 0,
                    "y": 0,
                    "rotation": 0
                })
                self.client.datacenters.update(datacenter)
                
            self.logger.info(f"Added rack {rack_name} to datacenter {datacenter_name}")
            return rack
        except HPOneViewException as e:
            self.logger.error(f"Failed to add rack: {str(e)}")
            return None
    
    def add_enclosure(self, enclosure_ip: str, username: str, password: str,
                     enclosure_group_name: str, licensing_intent: str = "OneView") -> Optional[Dict]:
        """Add server enclosure"""
        enclosure_data = {
            "hostname": enclosure_ip,
            "username": username,
            "password": password,
            "enclosureGroupUri": self.client.enclosure_groups.get_by_name(enclosure_group_name)['uri'],
            "licensingIntent": licensing_intent,
            "force": False
        }
        
        try:
            enclosure = self.client.enclosures.add(enclosure_data)
            self.logger.info(f"Added enclosure: {enclosure_ip}")
            return enclosure
        except HPOneViewException as e:
            self.logger.error(f"Failed to add enclosure: {str(e)}")
            return None
    
    def create_enclosure_group(self, name: str, lig_names: List[str]) -> Optional[Dict]:
        """Create enclosure group"""
        # Get LIG URIs
        lig_uris = []
        for lig_name in lig_names:
            lig = self.client.logical_interconnect_groups.get_by_name(lig_name)
            if lig:
                lig_uris.append(lig['uri'])
        
        enclosure_group_data = {
            "name": name,
            "interconnectBayMappings": [
                {
                    "interconnectBay": 1,
                    "logicalInterconnectGroupUri": lig_uris[0] if len(lig_uris) > 0 else None
                },
                {
                    "interconnectBay": 2,
                    "logicalInterconnectGroupUri": lig_uris[0] if len(lig_uris) > 0 else None
                }
            ],
            "stackingMode": "Enclosure",
            "enclosureCount": 1,
            "powerMode": "RedundantPowerFeed"
        }
        
        try:
            enclosure_group = self.client.enclosure_groups.create(enclosure_group_data)
            self.logger.info(f"Created enclosure group: {name}")
            return enclosure_group
        except HPOneViewException as e:
            self.logger.error(f"Failed to create enclosure group: {str(e)}")
            return None
    
    def create_logical_interconnect_group(self, name: str, interconnect_type: str) -> Optional[Dict]:
        """Create logical interconnect group"""
        # Get interconnect type
        ic_type = self.client.interconnect_types.get_by_name(interconnect_type)
        
        lig_data = {
            "name": name,
            "interconnectMapTemplate": {
                "interconnectMapEntryTemplates": [
                    {
                        "logicalLocation": {
                            "locationEntries": [
                                {
                                    "type": "Bay",
                                    "relativeValue": 1
                                },
                                {
                                    "type": "Enclosure",
                                    "relativeValue": 1
                                }
                            ]
                        },
                        "enclosureIndex": 1,
                        "permittedInterconnectTypeUri": ic_type['uri'] if ic_type else None
                    }
                ]
            },
            "enclosureType": "C7000",
            "uplinkSets": [],
            "ethernetSettings": {
                "type": "EthernetInterconnectSettingsV4",
                "enableIgmpSnooping": True,
                "igmpIdleTimeoutInterval": 260,
                "enableFastMacCacheFailover": True,
                "macRefreshInterval": 5,
                "enableNetworkLoopProtection": True,
                "enablePauseFloodProtection": True,
                "enableRichTLV": False,
                "enableTaggedLldp": False,
                "dependentResourceUri": None,
                "name": "ethernetSettings"
            }
        }
        
        try:
            lig = self.client.logical_interconnect_groups.create(lig_data)
            self.logger.info(f"Created logical interconnect group: {name}")
            return lig
        except HPOneViewException as e:
            self.logger.error(f"Failed to create LIG: {str(e)}")
            return None
    
    def create_uplink_set(self, lig_name: str, uplink_name: str, 
                         network_names: List[str], uplink_ports: List[Dict]) -> bool:
        """Create uplink set in logical interconnect group"""
        # Get LIG
        lig = self.client.logical_interconnect_groups.get_by_name(lig_name)
        if not lig:
            self.logger.error(f"LIG not found: {lig_name}")
            return False
        
        # Get network URIs
        network_uris = []
        for network_name in network_names:
            network = self.client.ethernet_networks.get_by_name(network_name)
            if network:
                network_uris.append(network['uri'])
        
        uplink_set = {
            "name": uplink_name,
            "mode": "Auto",
            "networkType": "Ethernet",
            "ethernetNetworkType": "Tagged",
            "networkUris": network_uris,
            "logicalPortConfigInfos": uplink_ports,
            "primaryPort": None,
            "nativeNetworkUri": None
        }
        
        # Add uplink set to LIG
        lig['uplinkSets'].append(uplink_set)
        
        try:
            updated_lig = self.client.logical_interconnect_groups.update(lig)
            self.logger.info(f"Created uplink set {uplink_name} in LIG {lig_name}")
            return True
        except HPOneViewException as e:
            self.logger.error(f"Failed to create uplink set: {str(e)}")
            return False
    
    def create_network(self, name: str, vlan_id: int, network_type: str = "Ethernet",
                      purpose: str = "General", private: bool = False) -> Optional[Dict]:
        """Create network"""
        network_data = {
            "name": name,
            "vlanId": vlan_id,
            "ethernetNetworkType": "Tagged",
            "purpose": purpose,
            "smartLink": True,
            "privateNetwork": private,
            "connectionTemplateUri": None,
            "type": network_type + "NetworkV4"
        }
        
        try:
            if network_type == "Ethernet":
                network = self.client.ethernet_networks.create(network_data)
            elif network_type == "FCoe":
                network = self.client.fcoe_networks.create(network_data)
            else:
                self.logger.error(f"Unsupported network type: {network_type}")
                return None
                
            self.logger.info(f"Created network: {name} (VLAN {vlan_id})")
            return network
        except HPOneViewException as e:
            self.logger.error(f"Failed to create network: {str(e)}")
            return None
    
    def create_network_set(self, name: str, network_names: List[str]) -> Optional[Dict]:
        """Create network set"""
        # Get network URIs
        network_uris = []
        for network_name in network_names:
            network = self.client.ethernet_networks.get_by_name(network_name)
            if network:
                network_uris.append(network['uri'])
        
        network_set_data = {
            "name": name,
            "networkUris": network_uris,
            "nativeNetworkUri": None,
            "connectionTemplateUri": None,
            "type": "network-setV4"
        }
        
        try:
            network_set = self.client.network_sets.create(network_set_data)
            self.logger.info(f"Created network set: {name}")
            return network_set
        except HPOneViewException as e:
            self.logger.error(f"Failed to create network set: {str(e)}")
            return None
    
    def create_server_profile_template(self, name: str, server_hardware_type: str,
                                     enclosure_group: str, connections: List[Dict]) -> Optional[Dict]:
        """Create server profile template"""
        # Get URIs
        sht = self.client.server_hardware_types.get_by_name(server_hardware_type)
        eg = self.client.enclosure_groups.get_by_name(enclosure_group)
        
        template_data = {
            "name": name,
            "serverHardwareTypeUri": sht['uri'] if sht else None,
            "enclosureGroupUri": eg['uri'] if eg else None,
            "serialNumberType": "Virtual",
            "macType": "Virtual",
            "wwnType": "Virtual",
            "connectionSettings": {
                "connections": connections
            },
            "boot": {
                "manageBoot": True,
                "order": ["HardDisk"],
                "bootMode": {
                    "mode": "UEFI",
                    "pxeBootPolicy": "Auto",
                    "secureBoot": "Enabled"
                }
            },
            "firmware": {
                "manageFirmware": False,
                "forceInstallFirmware": False,
                "firmwareActivationType": "Immediate"
            },
            "localStorage": {
                "controllers": []
            },
            "sanStorage": {
                "hostOSType": "VMware (ESXi)",
                "manageSanStorage": False,
                "volumeAttachments": []
            },
            "bios": {
                "manageBios": True,
                "overriddenSettings": [
                    {
                        "id": "PowerProfile",
                        "value": "MaxPerf"
                    },
                    {
                        "id": "MinProcIdlePower",
                        "value": "NoCStates"
                    },
                    {
                        "id": "ProcTurbo",
                        "value": "Enabled"
                    }
                ]
            }
        }
        
        try:
            template = self.client.server_profile_templates.create(template_data)
            self.logger.info(f"Created server profile template: {name}")
            return template
        except HPOneViewException as e:
            self.logger.error(f"Failed to create server profile template: {str(e)}")
            return None
    
    def create_server_profile(self, name: str, template_name: str, 
                            server_hardware: Optional[str] = None) -> Optional[Dict]:
        """Create server profile from template"""
        template = self.client.server_profile_templates.get_by_name(template_name)
        if not template:
            self.logger.error(f"Template not found: {template_name}")
            return None
        
        profile_data = {
            "serverProfileTemplateUri": template['uri'],
            "name": name
        }
        
        # Assign to specific hardware if provided
        if server_hardware:
            hw = self.client.server_hardware.get_by_name(server_hardware)
            if hw:
                profile_data["serverHardwareUri"] = hw['uri']
        
        try:
            profile = self.client.server_profiles.create(profile_data)
            self.logger.info(f"Created server profile: {name}")
            return profile
        except HPOneViewException as e:
            self.logger.error(f"Failed to create server profile: {str(e)}")
            return None
    
    def configure_alerts(self, email_config: Dict, filters: List[Dict]) -> bool:
        """Configure alert notifications"""
        # Configure email settings
        email_settings = {
            "alertEmailEnabled": True,
            "alertEmailFilters": filters,
            "smtpServer": email_config["smtp_server"],
            "smtpPort": email_config.get("smtp_port", 25),
            "emailSender": email_config["sender"],
            "password": email_config.get("password", ""),
            "smtpConnectionSecurity": email_config.get("security", "None")
        }
        
        try:
            self.client.appliance_configuration.update_alert_configuration(email_settings)
            self.logger.info("Configured alert email notifications")
            return True
        except HPOneViewException as e:
            self.logger.error(f"Failed to configure alerts: {str(e)}")
            return False
    
    def create_firmware_bundle(self, spp_file_path: str) -> Optional[Dict]:
        """Upload firmware bundle (SPP)"""
        try:
            # Upload SPP ISO
            firmware_bundle = self.client.firmware_bundles.upload(spp_file_path)
            self.logger.info(f"Uploaded firmware bundle: {spp_file_path}")
            return firmware_bundle
        except HPOneViewException as e:
            self.logger.error(f"Failed to upload firmware bundle: {str(e)}")
            return None
    
    def create_backup(self, remote_server: str, remote_path: str, 
                     username: str, password: str) -> bool:
        """Create OneView backup"""
        backup_config = {
            "type": "BACKUP",
            "schedulerDisabled": False,
            "remoteServerName": remote_server,
            "remoteServerDir": remote_path,
            "protocol": "SFTP",
            "userName": username,
            "password": password,
            "scheduleInterval": "DAILY",
            "scheduleDays": ["SUN"],
            "scheduleTime": "02:00"
        }
        
        try:
            self.client.backups.create(backup_config)
            self.logger.info("Configured OneView backup")
            return True
        except HPOneViewException as e:
            self.logger.error(f"Failed to configure backup: {str(e)}")
            return False
    
    def create_scope(self, name: str, description: str, resources: List[Dict]) -> Optional[Dict]:
        """Create scope for resource organization"""
        scope_data = {
            "name": name,
            "description": description,
            "addedResourceUris": [r['uri'] for r in resources]
        }
        
        try:
            scope = self.client.scopes.create(scope_data)
            self.logger.info(f"Created scope: {name}")
            return scope
        except HPOneViewException as e:
            self.logger.error(f"Failed to create scope: {str(e)}")
            return None
    
    def configure_time_locale(self, timezone: str = "America/New_York", 
                            ntp_servers: List[str] = None) -> bool:
        """Configure time and locale settings"""
        time_config = {
            "timezone": timezone,
            "ntpServers": ntp_servers or ["0.pool.ntp.org", "1.pool.ntp.org"],
            "locale": "en_US.UTF-8"
        }
        
        try:
            self.client.appliance_time_and_locale_configuration.update(time_config)
            self.logger.info("Configured time and locale settings")
            return True
        except HPOneViewException as e:
            self.logger.error(f"Failed to configure time/locale: {str(e)}")
            return False


def main():
    """Main execution"""
    # Configuration
    config = {
        "oneview_ip": "10.10.100.10",
        "username": "administrator",
        "password": "OneViewPassword123!",
        "datacenter": {
            "name": "HP-Datacenter-01",
            "width": 20000,  # mm
            "depth": 30000,  # mm
            "cooling_capacity": 500,  # kW
            "electrical_capacity": 300  # kW
        },
        "racks": [
            {"name": "Rack-01", "height": 42},
            {"name": "Rack-02", "height": 42},
            {"name": "Rack-03", "height": 48}
        ],
        "networks": [
            {"name": "Management", "vlan": 10, "purpose": "Management"},
            {"name": "Production", "vlan": 20, "purpose": "General"},
            {"name": "Storage", "vlan": 30, "purpose": "ISCSI"},
            {"name": "vMotion", "vlan": 40, "purpose": "VirtualMachineManager"},
            {"name": "DMZ", "vlan": 100, "purpose": "General"}
        ],
        "network_sets": [
            {"name": "ESXi-Networks", "networks": ["Production", "Storage", "vMotion"]}
        ],
        "alert_config": {
            "smtp_server": "smtp.company.com",
            "smtp_port": 25,
            "sender": "oneview-alerts@company.com",
            "filters": [
                {
                    "emails": ["infrastructure-team@company.com"],
                    "filter": "Critical",
                    "userQueryFilter": None,
                    "scopeQuery": None
                }
            ]
        },
        "backup": {
            "server": "backup.company.com",
            "path": "/backups/oneview",
            "username": "backup_user",
            "password": "BackupPassword123!"
        },
        "ntp_servers": ["10.10.10.1", "10.10.10.2"]
    }
    
    # Initialize OneView client
    oneview = HPOneViewConfig(
        config["oneview_ip"], 
        config["username"], 
        config["password"]
    )
    
    try:
        # Configure time and locale
        oneview.configure_time_locale("America/New_York", config["ntp_servers"])
        
        # Create datacenter
        dc = oneview.create_datacenter(
            config["datacenter"]["name"],
            config["datacenter"]["width"],
            config["datacenter"]["depth"],
            config["datacenter"]["cooling_capacity"],
            config["datacenter"]["electrical_capacity"]
        )
        
        # Add racks
        for rack in config["racks"]:
            oneview.add_rack(
                config["datacenter"]["name"],
                rack["name"],
                rack["height"]
            )
        
        # Create networks
        for network in config["networks"]:
            oneview.create_network(
                network["name"],
                network["vlan"],
                "Ethernet",
                network["purpose"]
            )
        
        # Create network sets
        for netset in config["network_sets"]:
            oneview.create_network_set(netset["name"], netset["networks"])
        
        # Configure alerts
        oneview.configure_alerts(
            config["alert_config"],
            config["alert_config"]["filters"]
        )
        
        # Configure backup
        oneview.create_backup(
            config["backup"]["server"],
            config["backup"]["path"],
            config["backup"]["username"],
            config["backup"]["password"]
        )
        
        print("HP OneView configuration completed successfully")
        
    except Exception as e:
        print(f"Error during configuration: {str(e)}")


if __name__ == "__main__":
    main()