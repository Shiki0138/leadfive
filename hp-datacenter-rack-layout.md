# HP Data Center Rack Layout Design

## Overview
This document details the physical rack layout for HP enterprise infrastructure across primary and secondary data centers.

## Primary Data Center - Rack Layout

### Row A - Compute Infrastructure

#### Rack A1-A2: HPE Synergy Frame 1
```
U42-U45: Top Frame Link Module & Management
U41: HPE Synergy Image Streamer
U37-U40: HPE Virtual Connect SE 100Gb F32 Module (Primary)
U33-U36: HPE Virtual Connect SE 100Gb F32 Module (Secondary)
U29-U32: HPE Synergy 660 Gen10 Plus (GPU Module 1)
U25-U28: HPE Synergy 660 Gen10 Plus (GPU Module 2)
U21-U24: HPE Synergy 480 Gen10 Plus (Compute 1)
U17-U20: HPE Synergy 480 Gen10 Plus (Compute 2)
U13-U16: HPE Synergy 480 Gen10 Plus (Compute 3)
U09-U12: HPE Synergy 480 Gen10 Plus (Compute 4)
U05-U08: HPE Synergy Composer (Primary & Secondary)
U01-U04: Power Distribution & Frame Management
```

#### Rack A3-A4: HPE Synergy Frame 2
```
U42-U45: Top Frame Link Module & Management
U41: HPE Synergy Image Streamer
U37-U40: HPE Virtual Connect SE 100Gb F32 Module (Primary)
U33-U36: HPE Virtual Connect SE 100Gb F32 Module (Secondary)
U29-U32: HPE Synergy 660 Gen10 Plus (GPU Module 3)
U25-U28: HPE Synergy 660 Gen10 Plus (GPU Module 4)
U21-U24: HPE Synergy 480 Gen10 Plus (Compute 5)
U17-U20: HPE Synergy 480 Gen10 Plus (Compute 6)
U13-U16: HPE Synergy 480 Gen10 Plus (Compute 7)
U09-U12: HPE Synergy 480 Gen10 Plus (Compute 8)
U05-U08: Redundant Composers & D3940 Storage Module
U01-U04: Power Distribution & Frame Management
```

#### Rack A5: Management & Edge Servers
```
U41-U42: HPE KVM Console G3
U39-U40: Blank
U37-U38: HPE ProLiant DL380 Gen10 Plus (vCenter)
U35-U36: HPE ProLiant DL380 Gen10 Plus (Backup)
U33-U34: HPE ProLiant DL380 Gen10 Plus (Management)
U31-U32: HPE ProLiant DL380 Gen10 Plus (Monitoring)
U29-U30: HPE ProLiant DL360 Gen10 Plus (AD/DNS 1)
U27-U28: HPE ProLiant DL360 Gen10 Plus (AD/DNS 2)
U25-U26: Blank
U21-U24: HPE FlexNetwork 5940 (Distribution Switch 1)
U17-U20: HPE FlexNetwork 5940 (Distribution Switch 2)
U13-U16: APC Smart-UPS SRT 5000VA
U09-U12: APC Smart-UPS SRT 5000VA
U05-U08: HPE G2 Metered PDU (Primary)
U01-U04: HPE G2 Metered PDU (Secondary)
```

### Row B - Storage Infrastructure

#### Rack B1: HPE Primera A670 (Primary)
```
U39-U42: HPE Primera A670 Controller Node 0 & 1
U35-U38: HPE Primera A670 Controller Node 2 & 3
U31-U34: HPE Primera A670 24-SSD Enclosure 1
U27-U30: HPE Primera A670 24-SSD Enclosure 2
U23-U26: HPE Primera A670 24-SSD Enclosure 3
U19-U22: HPE Primera A670 24-SSD Enclosure 4
U15-U18: Blank (Future Expansion)
U11-U14: HPE SN6600B 32Gb Fibre Channel Switch (Primary)
U07-U10: HPE SN6600B 32Gb Fibre Channel Switch (Secondary)
U03-U06: HPE G2 Metered PDU (Dual)
U01-U02: Cable Management
```

#### Rack B2: HPE Primera A670 (Secondary)
```
[Mirror configuration of Rack B1 for redundancy]
```

#### Rack B3-B4: HPE Nimble Storage
```
U37-U42: HPE Nimble HF40 Controller Shelf 1
U31-U36: HPE Nimble ES3 Expansion Shelf 1
U25-U30: HPE Nimble ES3 Expansion Shelf 2
U19-U24: HPE Nimble HF40 Controller Shelf 2
U13-U18: HPE Nimble ES3 Expansion Shelf 3
U07-U12: HPE Nimble ES3 Expansion Shelf 4
U03-U06: HPE G2 Metered PDU (Dual)
U01-U02: Cable Management
```

#### Rack B5-B6: HPE StoreOnce & Object Storage
```
U37-U42: HPE StoreOnce 5260 Base System
U31-U36: HPE StoreOnce 5260 Expansion
U25-U30: HPE StoreOnce 5260 Expansion
U19-U24: HPE Apollo 4200 Gen10 Plus (Object Storage 1)
U15-U18: HPE Apollo 4200 Gen10 Plus (Object Storage 2)
U11-U14: HPE Apollo 4200 Gen10 Plus (Object Storage 3)
U07-U10: Network Switches for Object Storage
U03-U06: HPE G2 Metered PDU (Dual)
U01-U02: Cable Management
```

### Row C - Network Infrastructure

#### Rack C1-C2: Core Network
```
U37-U42: HPE FlexFabric 12900E (Core Switch 1)
U31-U36: HPE FlexFabric 12900E (Core Switch 2)
U25-U30: HPE FlexFabric 12900E (Core Switch 3)
U19-U24: HPE FlexFabric 12900E (Core Switch 4)
U15-U18: Blank (Cable Management)
U11-U14: HPE Intelligent Management Center Appliance
U07-U10: Out-of-Band Management Network
U03-U06: HPE G2 Metered PDU (Dual)
U01-U02: Fiber Patch Panel
```

#### Rack C3: WAN & Security
```
U39-U42: ISP1 Router & Firewall
U35-U38: ISP2 Router & Firewall
U31-U34: HPE Aruba 7240XM Mobility Controller
U27-U30: HPE Aruba ClearPass C3000
U23-U26: Load Balancer Appliances
U19-U22: WAN Optimization Appliances
U15-U18: Blank
U11-U14: Terminal Server for Console Access
U07-U10: Environmental Monitoring System
U03-U06: HPE G2 Metered PDU (Dual)
U01-U02: Cable Management
```

### Row D - High-Performance Computing

#### Rack D1-D4: HPE Apollo 6500 Gen10 Plus
```
U37-U45: HPE Apollo 6500 Chassis 1
  - 8x NVIDIA A100 80GB GPUs
  - HDR200 InfiniBand Adapters
  - Redundant 3000W Power Supplies
U28-U36: HPE Apollo 6500 Chassis 2
  - 8x NVIDIA A100 80GB GPUs
  - HDR200 InfiniBand Adapters
  - Redundant 3000W Power Supplies
U19-U27: HPE Apollo 6500 Chassis 3
  - 8x NVIDIA A100 80GB GPUs
  - HDR200 InfiniBand Adapters
  - Redundant 3000W Power Supplies
U10-U18: HPE Apollo 6500 Chassis 4
  - 8x NVIDIA A100 80GB GPUs
  - HDR200 InfiniBand Adapters
  - Redundant 3000W Power Supplies
U05-U09: InfiniBand HDR Switch
U01-U04: HPE G2 High Capacity PDU (3-Phase)
```

## Cable Management Standards

### Power Cabling
- **Red**: Primary Power (A-Feed)
- **Blue**: Secondary Power (B-Feed)
- **Green**: Ground Cables
- **Orange**: High-Voltage 3-Phase

### Network Cabling
- **Yellow**: 1GbE Ethernet
- **Orange**: 10GbE Ethernet
- **Red**: 25GbE Ethernet
- **Purple**: 40/100GbE Ethernet
- **Blue**: Fibre Channel
- **Green**: InfiniBand
- **White**: Management Network
- **Gray**: Console/Serial

## Environmental Specifications

### Cooling Requirements
- **Total Heat Load**: 285 kW
- **Cooling Capacity**: 342 kW (N+1)
- **CRAC Units**: 6x 60kW units
- **Hot Aisle Containment**: All rows
- **Cold Aisle Temperature**: 20-22°C
- **Hot Aisle Temperature**: 35-38°C

### Power Requirements
- **Total Power**: 320 kW
- **UPS Capacity**: 400 kW (N+1)
- **Power Distribution**: Dual A/B feeds
- **PDU Rating**: 30A/208V per rack
- **Generator Backup**: 500 kW

### Physical Space
- **Rack Count**: 26 racks
- **Floor Space**: 2,800 sq ft
- **Raised Floor**: 24 inches
- **Ceiling Height**: 12 feet
- **Load Rating**: 2,000 lbs per tile

## Rack Elevation Standards

### Front-to-Back Airflow
- All equipment mounted with front facing cold aisle
- Blanking panels in all unused spaces
- Perforated tiles in cold aisles only
- Brush grommets for cable pass-through

### Equipment Mounting
- Heavy equipment (>100 lbs) in lower third
- Frequently accessed equipment at eye level
- KVM and management at top of rack
- PDUs vertically mounted (0U)

### Cable Management
- Vertical cable managers between racks
- Horizontal cable management every 12U
- Service loops maintained at patch panels
- Velcro ties only (no zip ties)

## Redundancy Matrix

| Component | Primary | Secondary | Redundancy Type |
|-----------|---------|-----------|-----------------|
| Power | A-Feed | B-Feed | 2N |
| Cooling | CRAC 1-3 | CRAC 4-6 | N+1 |
| Network Core | Switch 1-2 | Switch 3-4 | Active-Active |
| Storage | Primera A | Primera B | Active-Active |
| Compute | Synergy Frame 1 | Synergy Frame 2 | N+1 |
| WAN | ISP1 | ISP2 | Active-Passive |

## Growth Planning

### Phase 1 (Current)
- 26 racks deployed
- 60% capacity utilized
- 320 kW power consumption

### Phase 2 (Year 2)
- Add 6 racks for expansion
- Additional Synergy frame
- Expand object storage
- 400 kW projected power

### Phase 3 (Year 3-5)
- Add second row of racks
- Upgrade core network to 400GbE
- Add quantum computing resources
- 500 kW projected power

## Compliance Considerations

### Fire Suppression
- FM-200 clean agent system
- VESDA early warning detection
- Zone-based suppression
- 30-minute fire rating

### Security
- Biometric access control
- 24/7 CCTV monitoring
- Mantrap entry
- Rack-level locking

### Monitoring
- DCIM software integration
- Environmental sensors per rack
- Power monitoring per circuit
- Automated alerting system