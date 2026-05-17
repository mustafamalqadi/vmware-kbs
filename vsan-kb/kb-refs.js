/**
 * vSAN KB — Official VMware / Broadcom Reference Links
 * Auto-injects "Official References" section into each KB entry.
 * Include this script at the bottom of every phase HTML file.
 *
 * Sources:
 *   Broadcom TechDocs  → https://techdocs.broadcom.com/...
 *   Broadcom KB         → https://knowledge.broadcom.com/external/article/...
 *   VMware HCL          → https://www.vmware.com/resources/compatibility/...
 */
(function () {
    var TD = 'https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/';
    var KB = 'https://knowledge.broadcom.com/external/article?legacyId=';
    var BKB = 'https://knowledge.broadcom.com/external/article?articleNumber=';
    var HCL = 'https://www.vmware.com/resources/compatibility/search.php';
    var IOM = 'https://interopmatrix.vmware.com/';

    // Reference types: td=TechDocs, kb=Broadcom KB (legacy), bkb=Broadcom KB (article#), hcl=HCL, iom=Interop, link=direct URL
    var refs = {

        /* ═══════ PHASE 1 — Top 10 Common Issues ═══════ */

        1: [
            { s:'Broadcom KB 315537',  t:'vSAN Health — Physical Disk Health retrieval',              u:BKB+'315537' },
            { s:'TechDocs',            t:'Troubleshooting vSAN Disk Groups',                          u:TD+'vsan-monitoring-and-troubleshooting-80/troubleshooting-vsan-disk-groups.html' },
            { s:'TechDocs',            t:'Managing Disk Groups and Devices in vSAN',                  u:TD+'vsan-administration-80/managing-disk-groups-and-devices-in-vsan.html' },
            { s:'VMware HCL',          t:'vSAN Hardware Compatibility List — Storage Controllers',    u:HCL+'?deviceCategory=sas' }
        ],
        2: [
            { s:'Broadcom KB 326823',  t:'vSAN Health — Network Ping Test & MTU Check',               u:BKB+'326823' },
            { s:'TechDocs',            t:'Troubleshooting vSAN Network Issues',                       u:TD+'vsan-monitoring-and-troubleshooting-80/troubleshooting-vsan-network-issues.html' },
            { s:'TechDocs',            t:'vSAN Network Design Guide',                                 u:TD+'vsan-network-design-80.html' },
            { s:'Broadcom KB 318546',  t:'Multihoming on ESXi — VMkernel Networking',                 u:BKB+'318546' }
        ],
        3: [
            { s:'TechDocs',            t:'Monitoring Object Health in vSAN',                          u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-object-health-in-vsan.html' },
            { s:'TechDocs',            t:'vSAN Object Repair and Resync',                             u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-resync-in-vsan.html' },
            { s:'Broadcom KB',         t:'vSAN Objects Inaccessible After Failure',                   u:KB+'2077185' }
        ],
        4: [
            { s:'TechDocs',            t:'Monitoring Resync Operations in vSAN',                      u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-resync-in-vsan.html' },
            { s:'TechDocs',            t:'vSAN Proactive Rebalance and Repair',                       u:TD+'vsan-administration-80/managing-vsan-resync-operations.html' },
            { s:'Broadcom KB',         t:'vSAN Resync Does Not Complete',                             u:KB+'2106752' }
        ],
        5: [
            { s:'TechDocs',            t:'Creating a vSAN Cluster',                                   u:TD+'vsan-planning-and-deployment-80/creating-a-vsan-cluster.html' },
            { s:'TechDocs',            t:'Adding Hosts to a vSAN Cluster',                            u:TD+'vsan-administration-80/adding-a-host-to-a-vsan-cluster.html' },
            { s:'Broadcom KB',         t:'Host Fails to Join vSAN Cluster',                           u:KB+'2058168' },
            { s:'Broadcom KB 326823',  t:'vSAN Health — Network Connectivity Check',                  u:BKB+'326823' }
        ],
        6: [
            { s:'TechDocs',            t:'Deploying vSAN Stretched Cluster',                          u:TD+'vsan-stretched-clusters-80.html' },
            { s:'TechDocs',            t:'Configuring the vSAN Witness Appliance',                    u:TD+'vsan-stretched-clusters-80/configuring-the-witness-host.html' },
            { s:'Broadcom KB',         t:'vSAN Stretched Cluster Deployment Guide',                   u:KB+'2058992' },
            { s:'Broadcom KB',         t:'vSAN Witness Appliance Deployment',                         u:KB+'2131355' }
        ],
        7: [
            { s:'TechDocs',            t:'vSAN Data-at-Rest Encryption',                              u:TD+'vsan-administration-80/using-encryption-on-a-vsan-cluster.html' },
            { s:'TechDocs',            t:'Managing Key Management Servers for vSAN',                  u:TD+'vsan-administration-80/configuring-kms-for-vsan-encryption.html' },
            { s:'Broadcom KB',         t:'vSAN Encryption FAQ',                                       u:KB+'2110040' }
        ],
        8: [
            { s:'TechDocs',            t:'Monitoring vSAN Performance',                               u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-vsan-performance.html' },
            { s:'TechDocs',            t:'Using the vSAN Performance Service',                        u:TD+'vsan-monitoring-and-troubleshooting-80/using-the-vsan-performance-service.html' },
            { s:'TechDocs',            t:'vSAN Health Check Overview',                                u:TD+'vsan-monitoring-and-troubleshooting-80/using-the-vsan-health-service.html' }
        ],
        9: [
            { s:'TechDocs',            t:'Upgrading vSAN — Pre-Checks and Procedures',               u:TD+'vsan-administration-80/upgrading-vsan.html' },
            { s:'TechDocs',            t:'vSAN On-Disk Format Upgrade',                               u:TD+'vsan-administration-80/upgrading-the-vsan-disk-format.html' },
            { s:'Interop Matrix',      t:'VMware Product Interoperability Matrix',                    u:IOM }
        ],
        10: [
            { s:'TechDocs',            t:'Placing a Host in Maintenance Mode — vSAN',                u:TD+'vsan-administration-80/placing-hosts-in-maintenance-mode.html' },
            { s:'TechDocs',            t:'Understanding vSAN Data Evacuation Options',               u:TD+'vsan-administration-80/data-evacuation-options-for-vsan.html' },
            { s:'TechDocs',            t:'Monitoring Resync During Maintenance',                     u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-resync-in-vsan.html' }
        ],

        /* ═══════ PHASE 2 — Day-2 Operations ═══════ */

        11: [
            { s:'TechDocs',            t:'vSAN Express Storage Architecture Overview',               u:TD+'vsan-administration-80/vsan-express-storage-architecture.html' },
            { s:'TechDocs',            t:'Managing Storage Devices in ESA',                          u:TD+'vsan-administration-80/managing-storage-pools-in-esa.html' },
            { s:'VMware HCL',          t:'vSAN HCL — NVMe Devices',                                 u:HCL+'?deviceCategory=ssd' }
        ],
        12: [
            { s:'TechDocs',            t:'Configuring vSAN File Services',                           u:TD+'vsan-administration-80/configuring-vsan-file-services.html' },
            { s:'TechDocs',            t:'Managing vSAN File Service Domains',                       u:TD+'vsan-administration-80/managing-file-service-domains.html' }
        ],
        13: [
            { s:'TechDocs',            t:'Configuring vSAN HCI Mesh',                               u:TD+'vsan-administration-80/configuring-vsan-hci-mesh.html' },
            { s:'TechDocs',            t:'vSAN HCI Mesh Architecture and Requirements',             u:TD+'vsan-planning-and-deployment-80/vsan-hci-mesh-requirements.html' }
        ],
        14: [
            { s:'TechDocs',            t:'Performing vSAN Encryption Key Rotation',                  u:TD+'vsan-administration-80/performing-encryption-key-rotation.html' },
            { s:'TechDocs',            t:'Deep Rekey vs Shallow Rekey in vSAN',                     u:TD+'vsan-administration-80/deep-rekey-operations-in-vsan.html' },
            { s:'Broadcom KB',         t:'vSAN Encryption FAQ',                                      u:KB+'2110040' }
        ],
        15: [
            { s:'TechDocs',            t:'Using the vSAN Skyline Health Service',                   u:TD+'vsan-monitoring-and-troubleshooting-80/using-the-vsan-health-service.html' },
            { s:'TechDocs',            t:'vSAN Health Check Descriptions',                          u:TD+'vsan-monitoring-and-troubleshooting-80/vsan-health-check-descriptions.html' }
        ],
        16: [
            { s:'TechDocs',            t:'Space Efficiency — Dedup and Compression',                u:TD+'vsan-administration-80/using-deduplication-and-compression.html' },
            { s:'TechDocs',            t:'Enabling Dedup and Compression on vSAN',                  u:TD+'vsan-administration-80/enabling-deduplication-and-compression.html' }
        ],
        17: [
            { s:'TechDocs',            t:'Monitoring vSAN Capacity',                                u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-vsan-capacity.html' },
            { s:'TechDocs',            t:'vSAN Capacity Planning',                                  u:TD+'vsan-planning-and-deployment-80/vsan-capacity-planning.html' },
            { s:'TechDocs',            t:'Understanding vSAN Capacity Thresholds',                  u:TD+'vsan-monitoring-and-troubleshooting-80/understanding-capacity-thresholds.html' }
        ],
        18: [
            { s:'TechDocs',            t:'Managing vSAN with vSphere Lifecycle Manager',            u:TD+'vsan-administration-80/managing-vsan-with-lifecycle-manager.html' },
            { s:'TechDocs',            t:'vLCM Image-Based Management for Clusters',                u:TD+'vsphere-lifecycle-manager-80/creating-and-managing-cluster-images.html' },
            { s:'Interop Matrix',      t:'VMware Product Interoperability Matrix',                   u:IOM }
        ],
        19: [
            { s:'TechDocs',            t:'Understanding vSAN Storage Policies',                     u:TD+'vsan-administration-80/using-vsan-storage-policies.html' },
            { s:'TechDocs',            t:'Creating vSAN Storage Policies',                          u:TD+'vsan-administration-80/creating-a-vsan-storage-policy.html' },
            { s:'TechDocs',            t:'SPBM Policy Compliance Checking',                         u:TD+'vsan-monitoring-and-troubleshooting-80/checking-vsan-policy-compliance.html' }
        ],
        20: [
            { s:'TechDocs',            t:'Configuring vSAN iSCSI Target Service',                   u:TD+'vsan-administration-80/configuring-vsan-iscsi-target-service.html' },
            { s:'TechDocs',            t:'Managing vSAN iSCSI LUNs and Targets',                   u:TD+'vsan-administration-80/managing-iscsi-targets-and-luns.html' }
        ],

        /* ═══════ PHASE 3 — DR & Data Protection ═══════ */

        21: [
            { s:'TechDocs',            t:'Troubleshooting ESXi Host Failures',                      u:TD+'vsan-monitoring-and-troubleshooting-80/troubleshooting-host-failures.html' },
            { s:'Broadcom KB',         t:'Interpreting ESXi PSOD Logs and Backtraces',              u:KB+'2145


' },
            { s:'TechDocs',            t:'Collecting Diagnostic Information for ESXi',              u:TD+'vsan-monitoring-and-troubleshooting-80/collecting-diagnostic-information.html' }
        ],
        22: [
            { s:'TechDocs',            t:'Working with Virtual Machine Snapshots in vSAN',          u:TD+'vsan-administration-80/working-with-vm-snapshots.html' },
            { s:'TechDocs',            t:'Snapshot Consolidation Best Practices',                   u:TD+'vsan-administration-80/consolidating-snapshots.html' }
        ],
        23: [
            { s:'TechDocs',            t:'vSAN Stretched Cluster Failure Scenarios',                u:TD+'vsan-stretched-clusters-80/failure-scenarios-in-vsan-stretched-clusters.html' },
            { s:'TechDocs',            t:'Site Failover and Recovery in Stretched Clusters',        u:TD+'vsan-stretched-clusters-80/site-failover-and-recovery.html' },
            { s:'Broadcom KB',         t:'vSAN Stretched Cluster Guide',                            u:KB+'2058992' }
        ],
        24: [
            { s:'TechDocs',            t:'vSAN Native Snapshots in ESA',                            u:TD+'vsan-administration-80/using-vsan-native-snapshots.html' },
            { s:'TechDocs',            t:'Benefits of vSAN Native Snapshots',                       u:TD+'vsan-administration-80/vsan-native-snapshot-architecture.html' }
        ],
        25: [
            { s:'TechDocs',            t:'vSAN Data Integrity and Checksum Verification',           u:TD+'vsan-monitoring-and-troubleshooting-80/vsan-data-integrity-checks.html' },
            { s:'Broadcom KB 315537',  t:'vSAN Health — Physical Disk Health',                      u:BKB+'315537' }
        ],
        26: [
            { s:'TechDocs',            t:'Recovering vCenter Server from vSAN Datastore',           u:TD+'vsan-administration-80/recovering-vcenter-from-vsan.html' },
            { s:'TechDocs',            t:'vSAN Bootstrap and Recovery Procedures',                  u:TD+'vsan-monitoring-and-troubleshooting-80/recovering-from-failures.html' }
        ],
        27: [
            { s:'TechDocs',            t:'Configuring Host Isolation Response in vSAN',             u:TD+'vsan-administration-80/configuring-host-isolation-response.html' },
            { s:'TechDocs',            t:'vSphere HA and vSAN Integration',                        u:TD+'vsan-administration-80/vsan-and-vsphere-ha.html' }
        ],
        28: [
            { s:'TechDocs',            t:'Configuring Proactive HA with vSAN',                     u:TD+'vsan-administration-80/configuring-proactive-ha.html' },
            { s:'TechDocs',            t:'Hardware Health Providers for Proactive HA',              u:TD+'vsan-administration-80/hardware-health-providers.html' }
        ],
        29: [
            { s:'TechDocs',            t:'Shutting Down a vSAN Cluster',                            u:TD+'vsan-administration-80/shutting-down-a-vsan-cluster.html' },
            { s:'TechDocs',            t:'Restarting a vSAN Cluster After Shutdown',                u:TD+'vsan-administration-80/restarting-a-vsan-cluster.html' }
        ],
        30: [
            { s:'TechDocs',            t:'Configuring Fault Domains in vSAN',                      u:TD+'vsan-administration-80/configuring-fault-domains.html' },
            { s:'TechDocs',            t:'vSAN Fault Domain Design Considerations',                u:TD+'vsan-planning-and-deployment-80/designing-fault-domains.html' }
        ],

        /* ═══════ PHASE 4 — VCF Integration ═══════ */

        31: [
            { s:'TechDocs',            t:'VCF SDDC Manager Bring-Up Guide',                        u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-admin-guide-52/deploying-management-domain.html' },
            { s:'TechDocs',            t:'VCF Cloud Builder Deployment',                            u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-getting-started-guide-52.html' }
        ],
        32: [
            { s:'TechDocs',            t:'Expanding VCF Workload Domains',                         u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-admin-guide-52/adding-and-removing-hosts.html' },
            { s:'TechDocs',            t:'Commissioning Hosts in SDDC Manager',                    u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-admin-guide-52/commissioning-hosts.html' }
        ],
        33: [
            { s:'TechDocs',            t:'VCF Lifecycle Management — Bundle Operations',            u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-lifecycle-management-52.html' },
            { s:'TechDocs',            t:'Downloading and Applying VCF Updates',                   u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-lifecycle-management-52/downloading-bundles.html' }
        ],
        34: [
            { s:'TechDocs',            t:'NSX Transport Node Configuration in VCF',                u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-admin-guide-52/managing-nsx.html' },
            { s:'TechDocs',            t:'vSAN Network Design — Separating Traffic Types',         u:TD+'vsan-network-design-80/separating-vsan-traffic.html' },
            { s:'Broadcom KB 326823',  t:'vSAN Network Health Check',                               u:BKB+'326823' }
        ],
        35: [
            { s:'TechDocs',            t:'VCF Stretched Cluster Deployment',                        u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-admin-guide-52/stretched-clusters.html' },
            { s:'TechDocs',            t:'vSAN Stretched Cluster Architecture',                    u:TD+'vsan-stretched-clusters-80.html' }
        ],
        36: [
            { s:'TechDocs',            t:'vLCM Image Management in VCF',                           u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-lifecycle-management-52/managing-vlcm-images.html' },
            { s:'TechDocs',            t:'vSphere Lifecycle Manager — Cluster Images',             u:TD+'vsphere-lifecycle-manager-80/creating-and-managing-cluster-images.html' }
        ],
        37: [
            { s:'TechDocs',            t:'Aria Operations for vSAN Monitoring',                    u:'https://techdocs.broadcom.com/us/en/vmware-cis/aria/aria-operations/8-18.html' },
            { s:'TechDocs',            t:'vSAN Performance Monitoring Integration',                u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-vsan-performance.html' }
        ],
        38: [
            { s:'TechDocs',            t:'VCF Management Domain Recovery',                         u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-admin-guide-52/management-domain-recovery.html' },
            { s:'TechDocs',            t:'vSAN Bootstrap Recovery Procedures',                     u:TD+'vsan-monitoring-and-troubleshooting-80/recovering-from-failures.html' }
        ],
        39: [
            { s:'TechDocs',            t:'vSAN HCI Mesh in VCF Workload Domains',                 u:'https://techdocs.broadcom.com/us/en/vmware-cis/private-cloud/vmware-cloud-foundation/5-2/vcf-admin-guide-52/vsan-hci-mesh.html' },
            { s:'TechDocs',            t:'Configuring vSAN HCI Mesh',                              u:TD+'vsan-administration-80/configuring-vsan-hci-mesh.html' }
        ],
        40: [
            { s:'TechDocs',            t:'Certificate Management for vSAN Encryption',             u:TD+'vsan-administration-80/managing-certificates-for-encryption.html' },
            { s:'TechDocs',            t:'Key Provider Configuration and Trust',                   u:TD+'vsan-administration-80/configuring-kms-for-vsan-encryption.html' },
            { s:'Broadcom KB',         t:'vSAN Encryption FAQ',                                     u:KB+'2110040' }
        ],

        /* ═══════ PHASE 5 — ESA Deep Dive ═══════ */

        41: [
            { s:'TechDocs',            t:'vSAN ESA Architecture Overview',                         u:TD+'vsan-administration-80/vsan-express-storage-architecture.html' },
            { s:'TechDocs',            t:'ESA vs OSA Comparison',                                  u:TD+'vsan-planning-and-deployment-80/comparing-esa-and-osa.html' },
            { s:'TechDocs',            t:'vSAN ESA Requirements',                                  u:TD+'vsan-planning-and-deployment-80/vsan-esa-requirements.html' }
        ],
        42: [
            { s:'TechDocs',            t:'Managing Storage Pools in ESA',                          u:TD+'vsan-administration-80/managing-storage-pools-in-esa.html' },
            { s:'TechDocs',            t:'Replacing Devices in vSAN ESA',                          u:TD+'vsan-administration-80/replacing-devices-in-esa.html' },
            { s:'VMware HCL',          t:'vSAN HCL — NVMe Compatibility',                         u:HCL+'?deviceCategory=ssd' }
        ],
        43: [
            { s:'TechDocs',            t:'Migrating from OSA to ESA',                              u:TD+'vsan-administration-80/migrating-from-osa-to-esa.html' },
            { s:'TechDocs',            t:'vSAN ESA Requirements and Planning',                     u:TD+'vsan-planning-and-deployment-80/vsan-esa-requirements.html' },
            { s:'VMware HCL',          t:'vSAN ESA Hardware Compatibility',                        u:HCL+'?deviceCategory=ssd' }
        ],
        44: [
            { s:'TechDocs',            t:'Designing vSAN ESA Storage Policies — RAID-5/6',         u:TD+'vsan-administration-80/esa-storage-policy-design.html' },
            { s:'TechDocs',            t:'Creating vSAN Storage Policies',                         u:TD+'vsan-administration-80/creating-a-vsan-storage-policy.html' }
        ],
        45: [
            { s:'TechDocs',            t:'vSAN Native Snapshots in ESA',                           u:TD+'vsan-administration-80/using-vsan-native-snapshots.html' },
            { s:'TechDocs',            t:'Native Snapshot Architecture',                           u:TD+'vsan-administration-80/vsan-native-snapshot-architecture.html' }
        ],
        46: [
            { s:'TechDocs',            t:'ESA Deduplication and Compression',                      u:TD+'vsan-administration-80/esa-deduplication-and-compression.html' },
            { s:'TechDocs',            t:'Monitoring Space Efficiency in vSAN',                    u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-space-efficiency.html' }
        ],
        47: [
            { s:'TechDocs',            t:'ESA Storage Pool Management',                            u:TD+'vsan-administration-80/managing-storage-pools-in-esa.html' },
            { s:'TechDocs',            t:'vSAN Proactive Rebalance',                               u:TD+'vsan-administration-80/managing-vsan-resync-operations.html' }
        ],
        48: [
            { s:'TechDocs',            t:'Firmware Updates for vSAN ESA Devices',                  u:TD+'vsan-administration-80/updating-firmware-for-esa-devices.html' },
            { s:'TechDocs',            t:'vLCM Hardware Support and Firmware',                     u:TD+'vsphere-lifecycle-manager-80/managing-host-firmware.html' },
            { s:'VMware HCL',          t:'vSAN HCL — NVMe Firmware Compatibility',                u:HCL+'?deviceCategory=ssd' }
        ],
        49: [
            { s:'TechDocs',            t:'Troubleshooting ESA Storage Failures',                   u:TD+'vsan-monitoring-and-troubleshooting-80/troubleshooting-esa-failures.html' },
            { s:'TechDocs',            t:'vSAN Component States and Recovery',                     u:TD+'vsan-monitoring-and-troubleshooting-80/understanding-component-states.html' }
        ],
        50: [
            { s:'TechDocs',            t:'vSAN ESA Performance Best Practices',                    u:TD+'vsan-administration-80/esa-performance-best-practices.html' },
            { s:'TechDocs',            t:'Using the vSAN Performance Service',                     u:TD+'vsan-monitoring-and-troubleshooting-80/using-the-vsan-performance-service.html' }
        ],

        /* ═══════ PHASE 6 — Performance & Capacity ═══════ */

        51: [
            { s:'TechDocs',            t:'Understanding vSAN Congestion',                          u:TD+'vsan-monitoring-and-troubleshooting-80/understanding-vsan-congestion.html' },
            { s:'TechDocs',            t:'Monitoring vSAN Performance Counters',                   u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-vsan-performance.html' },
            { s:'TechDocs',            t:'vSAN Backpressure Mechanisms',                           u:TD+'vsan-monitoring-and-troubleshooting-80/vsan-backpressure-mechanisms.html' }
        ],
        52: [
            { s:'TechDocs',            t:'Managing vSAN Resync Operations',                        u:TD+'vsan-administration-80/managing-vsan-resync-operations.html' },
            { s:'TechDocs',            t:'Monitoring Resync in vSAN',                              u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-resync-in-vsan.html' },
            { s:'Broadcom KB',         t:'vSAN Resync Completion Issues',                          u:KB+'2106752' }
        ],
        53: [
            { s:'TechDocs',            t:'vSAN Capacity Planning and Sizing',                      u:TD+'vsan-planning-and-deployment-80/vsan-capacity-planning.html' },
            { s:'TechDocs',            t:'Understanding vSAN Storage Consumption',                 u:TD+'vsan-monitoring-and-troubleshooting-80/understanding-storage-consumption.html' },
            { s:'TechDocs',            t:'vSAN Sizing Utility',                                    u:'https://vsansizer.vmware.com/' }
        ],
        54: [
            { s:'TechDocs',            t:'Using esxtop for vSAN Performance Analysis',             u:TD+'vsan-monitoring-and-troubleshooting-80/using-esxtop-for-vsan.html' },
            { s:'TechDocs',            t:'Key vSAN Performance Metrics',                           u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-vsan-performance.html' }
        ],
        55: [
            { s:'TechDocs',            t:'Troubleshooting vSAN Write Latency',                     u:TD+'vsan-monitoring-and-troubleshooting-80/troubleshooting-write-latency.html' },
            { s:'TechDocs',            t:'Understanding vSAN Cache Tier Destage',                  u:TD+'vsan-monitoring-and-troubleshooting-80/understanding-cache-destage.html' },
            { s:'TechDocs',            t:'vSAN Performance Service',                               u:TD+'vsan-monitoring-and-troubleshooting-80/using-the-vsan-performance-service.html' }
        ],
        56: [
            { s:'TechDocs',            t:'Troubleshooting vSAN Read Latency',                      u:TD+'vsan-monitoring-and-troubleshooting-80/troubleshooting-read-latency.html' },
            { s:'TechDocs',            t:'Cache Sizing Considerations for OSA',                    u:TD+'vsan-planning-and-deployment-80/cache-sizing-for-osa.html' }
        ],
        57: [
            { s:'TechDocs',            t:'IOPS Limits in vSAN Storage Policies',                   u:TD+'vsan-administration-80/configuring-iops-limits.html' },
            { s:'TechDocs',            t:'vSAN Storage Policy Rule Sets',                          u:TD+'vsan-administration-80/using-vsan-storage-policies.html' }
        ],
        58: [
            { s:'TechDocs',            t:'vSAN ReadyNode Planning Guide',                          u:TD+'vsan-planning-and-deployment-80/vsan-readynode-planning.html' },
            { s:'VMware HCL',          t:'vSAN ReadyNode Configurator',                            u:HCL+'?deviceCategory=vsan' },
            { s:'TechDocs',            t:'vSAN Sizing and Design Considerations',                  u:TD+'vsan-planning-and-deployment-80/vsan-capacity-planning.html' }
        ],
        59: [
            { s:'TechDocs',            t:'Witness Appliance Sizing and Requirements',              u:TD+'vsan-stretched-clusters-80/witness-appliance-requirements.html' },
            { s:'TechDocs',            t:'Deploying the vSAN Witness Appliance',                   u:TD+'vsan-stretched-clusters-80/configuring-the-witness-host.html' },
            { s:'Broadcom KB',         t:'vSAN Witness Appliance Deployment',                      u:KB+'2131355' }
        ],
        60: [
            { s:'TechDocs',            t:'TRIM/UNMAP Support in vSAN',                             u:TD+'vsan-administration-80/enabling-trim-unmap.html' },
            { s:'TechDocs',            t:'Monitoring vSAN Capacity',                               u:TD+'vsan-monitoring-and-troubleshooting-80/monitoring-vsan-capacity.html' }
        ],

        /* ═══════ PHASE 7 — Networking ═══════ */

        61: [
            { s:'TechDocs',            t:'Configuring VMkernel Adapters for vSAN',                 u:TD+'vsan-network-design-80/configuring-vmkernel-for-vsan.html' },
            { s:'Broadcom KB 318546',  t:'Multihoming on ESXi — VMkernel Networking',              u:BKB+'318546' },
            { s:'Broadcom KB 326823',  t:'vSAN Network Connectivity Health Check',                 u:BKB+'326823' }
        ],
        62: [
            { s:'TechDocs',            t:'Configuring MTU for vSAN Network',                       u:TD+'vsan-network-design-80/configuring-mtu-for-vsan.html' },
            { s:'Broadcom KB 326823',  t:'vSAN Health — Network Ping & MTU Check',                 u:BKB+'326823' },
            { s:'TechDocs',            t:'vSAN Network Design Best Practices',                    u:TD+'vsan-network-design-80.html' }
        ],
        63: [
            { s:'TechDocs',            t:'NIC Teaming Policies for vSAN',                          u:TD+'vsan-network-design-80/nic-teaming-for-vsan.html' },
            { s:'TechDocs',            t:'vSAN Network Redundancy Design',                        u:TD+'vsan-network-design-80/network-redundancy-design.html' }
        ],
        64: [
            { s:'TechDocs',            t:'vSAN Unicast Communication Mode',                       u:TD+'vsan-administration-80/vsan-unicast-configuration.html' },
            { s:'TechDocs',            t:'Migrating vSAN from Multicast to Unicast',              u:TD+'vsan-administration-80/migrating-to-unicast.html' }
        ],
        65: [
            { s:'TechDocs',            t:'Troubleshooting vSAN Network Partitions',                u:TD+'vsan-monitoring-and-troubleshooting-80/troubleshooting-vsan-network-issues.html' },
            { s:'Broadcom KB 326823',  t:'vSAN Health — Network Connectivity Check',               u:BKB+'326823' },
            { s:'TechDocs',            t:'vSAN Network Design Guide',                              u:TD+'vsan-network-design-80.html' }
        ],
        66: [
            { s:'TechDocs',            t:'Migrating vSAN to vSphere Distributed Switch',          u:TD+'vsan-network-design-80/migrating-to-vds.html' },
            { s:'TechDocs',            t:'vDS Configuration for vSAN',                             u:TD+'vsan-network-design-80/vds-configuration-for-vsan.html' }
        ],
        67: [
            { s:'TechDocs',            t:'vSAN over RDMA — RoCE v2 Configuration',                u:TD+'vsan-network-design-80/configuring-vsan-over-rdma.html' },
            { s:'TechDocs',            t:'RDMA Network Requirements for vSAN',                    u:TD+'vsan-network-design-80/rdma-network-requirements.html' },
            { s:'VMware HCL',          t:'vSAN HCL — RDMA NICs',                                  u:HCL+'?deviceCategory=io' }
        ],
        68: [
            { s:'TechDocs',            t:'Stretched Cluster Network Requirements',                 u:TD+'vsan-stretched-clusters-80/network-requirements-for-stretched-clusters.html' },
            { s:'TechDocs',            t:'Inter-Site Networking for vSAN Stretched Cluster',       u:TD+'vsan-stretched-clusters-80/inter-site-networking.html' },
            { s:'Broadcom KB',         t:'vSAN Stretched Cluster Guide',                           u:KB+'2058992' }
        ],
        69: [
            { s:'TechDocs',            t:'vSAN Port and Protocol Requirements',                    u:TD+'vsan-network-design-80/vsan-ports-and-protocols.html' },
            { s:'TechDocs',            t:'ESXi Firewall Configuration for vSAN',                  u:TD+'vsan-network-design-80/firewall-configuration-for-vsan.html' },
            { s:'Broadcom KB',         t:'Required Ports for vSAN Communication',                  u:KB+'2075392' }
        ],
        70: [
            { s:'TechDocs',            t:'High-Bandwidth Network Design for ESA',                  u:TD+'vsan-network-design-80/high-bandwidth-design-for-esa.html' },
            { s:'TechDocs',            t:'vSAN ESA NIC Requirements',                              u:TD+'vsan-planning-and-deployment-80/vsan-esa-requirements.html' },
            { s:'VMware HCL',          t:'vSAN HCL — Network Adapters',                            u:HCL+'?deviceCategory=io' }
        ]
    };

    // ── Inject references into KB entries ──
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !refs[kbId]) return;

            var items = refs[kbId];
            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;

            var section = document.createElement('div');
            section.className = 'ref-section';
            var html = '<div class="section-label" style="margin-top:1.5rem;">Official VMware / Broadcom References</div>';
            html += '<div class="ref-links">';
            items.forEach(function (r) {
                html += '<a href="' + r.u + '" target="_blank" rel="noopener noreferrer" class="ref-link">';
                html += '<span class="ref-source">' + r.s + '</span>';
                html += '<span class="ref-title">' + r.t + '</span>';
                html += '<svg class="ref-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
                html += '</a>';
            });
            html += '</div>';
            section.innerHTML = html;
            body.appendChild(section);
        });
    });

    // ── Inject CSS ──
    var style = document.createElement('style');
    style.textContent =
        '.ref-links{display:flex;flex-direction:column;gap:0.5rem;margin-top:0.5rem;}' +
        '.ref-link{display:flex;align-items:center;gap:0.75rem;padding:0.6rem 1rem;' +
        'border-radius:8px;background:rgba(0,180,216,0.04);border:1px solid rgba(0,180,216,0.12);' +
        'text-decoration:none;transition:all 0.2s;overflow:hidden;}' +
        '.ref-link:hover{background:rgba(0,180,216,0.1);border-color:rgba(0,180,216,0.3);transform:translateX(3px);}' +
        '.ref-source{flex-shrink:0;font-size:0.7rem;font-weight:700;padding:0.2rem 0.55rem;' +
        'border-radius:5px;background:rgba(0,180,216,0.12);color:#48cae4;white-space:nowrap;letter-spacing:0.3px;}' +
        '.ref-title{font-size:0.82rem;color:#8fa3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
        '.ref-link:hover .ref-title{color:#e8edf2;}' +
        '.ref-ext{width:14px;height:14px;flex-shrink:0;margin-left:auto;color:#5c7a94;opacity:0.6;}' +
        '.ref-link:hover .ref-ext{opacity:1;color:#48cae4;}' +
        '@media(max-width:600px){.ref-source{font-size:0.65rem;}.ref-title{font-size:0.75rem;}}';
    document.head.appendChild(style);
})();
