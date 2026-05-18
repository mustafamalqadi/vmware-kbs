/**
 * vSphere KB — Official VMware / Broadcom Reference Links
 * Auto-injects "Official References" section into each KB entry.
 * Include this script at the bottom of every phase HTML file.
 */
(function () {
    var TD = 'https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/';
    var KB = 'https://knowledge.broadcom.com/external/article?legacyId=';
    var BKB = 'https://knowledge.broadcom.com/external/article?articleNumber=';

    var refs = {
        /* ═══ Phase 1 — Top 10 ═══ */
        1: [
            { s:'TechDocs', t:'Creating and Configuring a vSphere HA Cluster',   u:TD+'vsphere-availability-80/creating-and-configuring-a-vsphere-ha-cluster.html' },
            { s:'Broadcom KB', t:'vSphere HA Failover Does Not Occur',           u:KB+'1033


' },
            { s:'TechDocs', t:'How vSphere HA Works',                            u:TD+'vsphere-availability-80/how-vsphere-ha-works.html' }
        ],
        2: [
            { s:'TechDocs', t:'Creating a DRS Cluster',                          u:TD+'vsphere-resource-management-80/creating-a-drs-cluster.html' },
            { s:'TechDocs', t:'DRS Troubleshooting',                             u:TD+'vsphere-resource-management-80/monitoring-drs.html' },
            { s:'Broadcom KB', t:'DRS Not Migrating Virtual Machines',           u:KB+'1005562' }
        ],
        3: [
            { s:'TechDocs', t:'vMotion Requirements',                            u:TD+'vsphere-vcenter-esxi-management-80/migrating-virtual-machines.html' },
            { s:'Broadcom KB', t:'vMotion Fails with Timeout',                   u:KB+'2054


' },
            { s:'TechDocs', t:'Troubleshooting vMotion',                         u:TD+'vsphere-vcenter-esxi-management-80/troubleshooting-vmotion.html' }
        ],
        4: [
            { s:'Broadcom KB', t:'ESXi Host Disconnected from vCenter',          u:KB+'1


' },
            { s:'TechDocs', t:'Reconnecting Hosts to vCenter',                   u:TD+'vsphere-vcenter-esxi-management-80/reconnecting-hosts.html' }
        ],
        5: [
            { s:'Broadcom KB', t:'Interpreting PSOD Backtrace',                  u:KB+'1


' },
            { s:'TechDocs', t:'Collecting ESXi Core Dumps',                      u:TD+'vsphere-esxi-80/configuring-esxi-core-dump.html' }
        ],
        6: [
            { s:'TechDocs', t:'vSphere HA Admission Control',                    u:TD+'vsphere-availability-80/vsphere-ha-admission-control.html' },
            { s:'Broadcom KB', t:'Insufficient Resources to Power On VM',        u:KB+'1


' }
        ],
        7: [
            { s:'TechDocs', t:'vCenter Server Service Health',                   u:TD+'vsphere-vcenter-configuration-80/vcenter-server-service-health.html' },
            { s:'Broadcom KB', t:'vpxd Service Crashes or Fails to Start',       u:KB+'1


' }
        ],
        8: [
            { s:'TechDocs', t:'Managing Snapshots',                              u:TD+'vsphere-vcenter-esxi-management-80/managing-snapshots.html' },
            { s:'Broadcom KB', t:'Snapshot Consolidation Fails',                 u:KB+'2


' }
        ],
        9: [
            { s:'TechDocs', t:'Placing a Host in Maintenance Mode',              u:TD+'vsphere-vcenter-esxi-management-80/place-host-in-maintenance-mode.html' },
            { s:'Broadcom KB', t:'Host Stuck in Maintenance Mode',               u:KB+'1


' }
        ],
        10: [
            { s:'TechDocs', t:'Working with Alarms',                             u:TD+'vsphere-vcenter-esxi-management-80/working-with-alarms.html' }
        ],

        /* ═══ Phase 2 — Day-2 Operations ═══ */
        11: [
            { s:'TechDocs', t:'vCenter Certificate Management',                  u:TD+'vsphere-authentication-80/managing-vsphere-certificates.html' },
            { s:'Broadcom KB', t:'STS Certificate Expiry Symptoms and Fix',      u:BKB+'318506' }
        ],
        12: [
            { s:'TechDocs', t:'vSphere Lifecycle Manager',                       u:TD+'vsphere-lifecycle-manager-80/vsphere-lifecycle-manager.html' },
            { s:'TechDocs', t:'Creating Images for Clusters',                    u:TD+'vsphere-lifecycle-manager-80/managing-cluster-images.html' }
        ],
        13: [
            { s:'TechDocs', t:'File-Based Backup and Restore of vCenter',        u:TD+'vsphere-vcenter-configuration-80/file-based-backup-and-restore.html' }
        ],
        14: [
            { s:'TechDocs', t:'Collecting ESXi Log Bundles',                     u:TD+'vsphere-esxi-80/collecting-esxi-log-bundles.html' }
        ],
        15: [
            { s:'TechDocs', t:'ESXi Security Best Practices',                    u:TD+'vsphere-security-80/securing-esxi-hosts.html' }
        ],
        16: [
            { s:'TechDocs', t:'Configuring Identity Sources for vCenter',         u:TD+'vsphere-authentication-80/configuring-identity-sources.html' },
            { s:'Broadcom KB', t:'SSO Login Fails After AD Password Change',     u:KB+'2


' }
        ],
        17: [
            { s:'TechDocs', t:'Configuring NTP on ESXi',                         u:TD+'vsphere-esxi-80/configuring-ntp-on-esxi.html' },
            { s:'Broadcom KB', t:'Verifying Time Synchronization on ESXi',       u:KB+'1


' }
        ],
        18: [
            { s:'TechDocs', t:'Configuring Syslog on ESXi',                      u:TD+'vsphere-esxi-80/configuring-syslog-on-esxi.html' }
        ],
        19: [
            { s:'TechDocs', t:'Host Profiles',                                   u:TD+'vsphere-esxi-80/host-profiles.html' }
        ],
        20: [
            { s:'TechDocs', t:'Monitoring ESXi Performance with esxtop',          u:TD+'vsphere-resource-management-80/using-esxtop.html' }
        ],

        /* ═══ Phase 3 — HA & Fault Tolerance ═══ */
        21: [
            { s:'TechDocs', t:'vSphere HA Admission Control Policies',           u:TD+'vsphere-availability-80/vsphere-ha-admission-control.html' }
        ],
        22: [
            { s:'TechDocs', t:'HA Master Election Process',                      u:TD+'vsphere-availability-80/how-vsphere-ha-works.html' }
        ],
        23: [
            { s:'TechDocs', t:'Configuring Heartbeat Datastores',                u:TD+'vsphere-availability-80/configuring-heartbeat-datastores.html' }
        ],
        24: [
            { s:'Broadcom KB', t:'FDM Agent Troubleshooting',                    u:KB+'2


' },
            { s:'TechDocs', t:'FDM Log Files',                                   u:TD+'vsphere-availability-80/fdm-log-files.html' }
        ],
        25: [
            { s:'TechDocs', t:'VM Component Protection',                          u:TD+'vsphere-availability-80/vm-component-protection.html' }
        ],
        26: [
            { s:'TechDocs', t:'Providing Fault Tolerance for VMs',                u:TD+'vsphere-availability-80/providing-fault-tolerance-for-virtual-machines.html' }
        ],
        27: [
            { s:'TechDocs', t:'HA Network Partition Behavior',                    u:TD+'vsphere-availability-80/network-partition-handling.html' }
        ],
        28: [
            { s:'TechDocs', t:'Proactive HA',                                    u:TD+'vsphere-resource-management-80/proactive-ha.html' }
        ],
        29: [
            { s:'TechDocs', t:'Host Isolation Response',                          u:TD+'vsphere-availability-80/host-isolation-response.html' }
        ],
        30: [
            { s:'TechDocs', t:'VM Restart Priority',                              u:TD+'vsphere-availability-80/vm-restart-priority.html' }
        ],

        /* ═══ Phase 4 — DRS & Resource Management ═══ */
        31: [
            { s:'TechDocs', t:'DRS Affinity Rules',                              u:TD+'vsphere-resource-management-80/using-drs-affinity-rules.html' }
        ],
        32: [
            { s:'TechDocs', t:'Resource Pools',                                  u:TD+'vsphere-resource-management-80/resource-pools.html' }
        ],
        33: [
            { s:'TechDocs', t:'DRS Automation Levels and Migration Thresholds',  u:TD+'vsphere-resource-management-80/drs-automation-levels.html' }
        ],
        34: [
            { s:'TechDocs', t:'Enhanced vMotion Compatibility',                  u:TD+'vsphere-vcenter-esxi-management-80/enhanced-vmotion-compatibility.html' },
            { s:'Broadcom KB', t:'EVC Requirements and Troubleshooting',         u:KB+'1


' }
        ],
        35: [
            { s:'TechDocs', t:'VM-Host Affinity Rules',                          u:TD+'vsphere-resource-management-80/using-drs-affinity-rules.html' }
        ],
        36: [
            { s:'TechDocs', t:'NUMA and CPU Scheduling',                         u:TD+'vsphere-resource-management-80/numa-support.html' }
        ],
        37: [
            { s:'TechDocs', t:'Memory Overcommitment Techniques',                u:TD+'vsphere-resource-management-80/memory-overcommitment.html' }
        ],
        38: [
            { s:'TechDocs', t:'Datastore Clusters and Storage DRS',              u:TD+'vsphere-storage-80/using-storage-drs.html' }
        ],
        39: [
            { s:'TechDocs', t:'Monitoring DRS',                                  u:TD+'vsphere-resource-management-80/monitoring-drs.html' }
        ],
        40: [
            { s:'TechDocs', t:'Latency Sensitivity',                             u:TD+'vsphere-resource-management-80/latency-sensitivity.html' }
        ],

        /* ═══ Phase 5 — vCenter & PSC ═══ */
        41: [
            { s:'TechDocs', t:'VCSA Disk Space Management',                      u:TD+'vsphere-vcenter-configuration-80/vcsa-disk-space.html' }
        ],
        42: [
            { s:'TechDocs', t:'Troubleshooting vCenter Services',                u:TD+'vsphere-vcenter-configuration-80/troubleshooting-vcenter-services.html' }
        ],
        43: [
            { s:'TechDocs', t:'vCenter Server Database',                          u:TD+'vsphere-vcenter-configuration-80/vcenter-database.html' }
        ],
        44: [
            { s:'TechDocs', t:'Managing STS Certificates',                       u:TD+'vsphere-authentication-80/managing-vsphere-certificates.html' },
            { s:'Broadcom KB', t:'STS Signing Certificate Renewal',              u:BKB+'318506' }
        ],
        45: [
            { s:'TechDocs', t:'Content Library Administration',                  u:TD+'vsphere-vcenter-esxi-management-80/content-libraries.html' }
        ],
        46: [
            { s:'TechDocs', t:'Converging External PSC to Embedded',             u:TD+'vsphere-vcenter-configuration-80/topology-convergence.html' }
        ],
        47: [
            { s:'TechDocs', t:'VCSA Backup and Restore',                         u:TD+'vsphere-vcenter-configuration-80/file-based-backup-and-restore.html' }
        ],
        48: [
            { s:'TechDocs', t:'Managing vCenter Plugins',                        u:TD+'vsphere-vcenter-configuration-80/managing-vcenter-plugins.html' }
        ],
        49: [
            { s:'TechDocs', t:'Lookup Service Architecture',                     u:TD+'vsphere-authentication-80/lookup-service.html' }
        ],
        50: [
            { s:'TechDocs', t:'VCSA Sizing and Requirements',                    u:TD+'vsphere-vcenter-configuration-80/vcsa-sizing.html' }
        ],

        /* ═══ Phase 6 — Storage ═══ */
        51: [
            { s:'TechDocs', t:'Unmounting VMFS Datastores',                      u:TD+'vsphere-storage-80/unmounting-vmfs-datastores.html' }
        ],
        52: [
            { s:'TechDocs', t:'Storage APD and PDL',                             u:TD+'vsphere-availability-80/vm-component-protection.html' },
            { s:'Broadcom KB', t:'Understanding APD/PDL Conditions',             u:KB+'2


' }
        ],
        53: [
            { s:'TechDocs', t:'Managing Storage Path Selection',                  u:TD+'vsphere-storage-80/managing-storage-paths.html' }
        ],
        54: [
            { s:'TechDocs', t:'NFS Storage Configuration',                       u:TD+'vsphere-storage-80/configuring-nfs-datastores.html' }
        ],
        55: [
            { s:'TechDocs', t:'VMFS Datastore Management',                       u:TD+'vsphere-storage-80/vmfs-datastore-management.html' }
        ],
        56: [
            { s:'TechDocs', t:'Storage vMotion',                                 u:TD+'vsphere-vcenter-esxi-management-80/storage-vmotion.html' }
        ],
        57: [
            { s:'TechDocs', t:'Thin Provisioning and Space Reclamation',          u:TD+'vsphere-storage-80/thin-provisioning.html' }
        ],
        58: [
            { s:'TechDocs', t:'iSCSI and FC Storage',                            u:TD+'vsphere-storage-80/configuring-iscsi-adapters.html' }
        ],
        59: [
            { s:'TechDocs', t:'VAAI Storage Offloading',                         u:TD+'vsphere-storage-80/vaai-storage-acceleration.html' }
        ],
        60: [
            { s:'TechDocs', t:'Storage DRS',                                     u:TD+'vsphere-storage-80/using-storage-drs.html' }
        ],

        /* ═══ Phase 7 — Networking ═══ */
        61: [
            { s:'TechDocs', t:'Distributed Switch Configuration',                u:TD+'vsphere-networking-80/configuring-distributed-switches.html' },
            { s:'Broadcom KB', t:'Recovering from vDS Misconfiguration',         u:KB+'1


' }
        ],
        62: [
            { s:'TechDocs', t:'vMotion Networking Requirements',                  u:TD+'vsphere-networking-80/vmotion-networking.html' }
        ],
        63: [
            { s:'TechDocs', t:'Configuring MTU on ESXi',                         u:TD+'vsphere-networking-80/configuring-mtu.html' }
        ],
        64: [
            { s:'TechDocs', t:'NIC Teaming and Failover Policies',               u:TD+'vsphere-networking-80/nic-teaming-and-failover.html' }
        ],
        65: [
            { s:'TechDocs', t:'VLAN Configuration on vSwitches',                 u:TD+'vsphere-networking-80/configuring-vlan.html' }
        ],
        66: [
            { s:'TechDocs', t:'Migrating from Standard to Distributed Switch',   u:TD+'vsphere-networking-80/migrating-to-distributed-switch.html' }
        ],
        67: [
            { s:'TechDocs', t:'Network I/O Control',                             u:TD+'vsphere-networking-80/network-io-control.html' }
        ],
        68: [
            { s:'TechDocs', t:'TCP/IP Stacks on ESXi',                           u:TD+'vsphere-networking-80/tcpip-stacks.html' }
        ],
        69: [
            { s:'TechDocs', t:'ESXi Firewall Configuration',                     u:TD+'vsphere-security-80/esxi-firewall.html' }
        ],
        70: [
            { s:'TechDocs', t:'SR-IOV and DirectPath I/O',                       u:TD+'vsphere-networking-80/sriov-and-directpath.html' }
        ],
        /* ═══ Phase 8 — Advanced & Extended ═══ */
        71: [
            { s:'Broadcom KB', t:'vSphere+ Cloud Gateway Troubleshooting',       u:BKB+'344299' },
            { s:'TechDocs', t:'vSphere+ Getting Started',                        u:'https://docs.vmware.com/en/VMware-vSphere+/services/vsphereplus-getting-started/GUID-landing.html' }
        ],
        72: [
            { s:'TechDocs', t:'vSphere VM Encryption',                           u:TD+'vsphere-security-80/virtual-machine-encryption.html' },
            { s:'TechDocs', t:'Configuring Key Providers',                        u:TD+'vsphere-security-80/configuring-key-providers.html' },
            { s:'Broadcom KB', t:'VM Encryption Troubleshooting',                 u:KB+'2149947' }
        ],
        73: [
            { s:'TechDocs', t:'Configuring SR-IOV Passthrough',                  u:TD+'vsphere-networking-80/sriov-and-directpath.html' },
            { s:'Broadcom KB', t:'NVIDIA vGPU on VMware vSphere',                 u:BKB+'314  772' }
        ],
        74: [
            { s:'TechDocs', t:'Using vSphere Auto Deploy',                       u:TD+'vsphere-lifecycle-manager-80/using-vsphere-auto-deploy.html' },
            { s:'Broadcom KB', t:'Auto Deploy Troubleshooting',                   u:KB+'2000


' }
        ],
        75: [
            { s:'TechDocs', t:'vSphere Lifecycle Manager',                        u:TD+'vsphere-lifecycle-manager-80/introducing-vsphere-lifecycle-manager.html' },
            { s:'Broadcom KB', t:'vLCM Image-Based Update Issues',                u:KB+'2147


' }
        ],
        76: [
            { s:'TechDocs', t:'vSphere Replication Administration',                u:'https://docs.vmware.com/en/vSphere-Replication/8.7/vsphere-replication-admin/GUID-landing.html' },
            { s:'Broadcom KB', t:'vSphere Replication RPO Violations',            u:BKB+'321


' }
        ],
        77: [
            { s:'TechDocs', t:'vSphere with Tanzu Configuration',                  u:'https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-with-tanzu-concepts-planning/GUID-landing.html' },
            { s:'Broadcom KB', t:'Troubleshooting Workload Management',           u:KB+'2148


' }
        ],
        78: [
            { s:'TechDocs', t:'vCenter Enhanced Linked Mode',                      u:TD+'vsphere-vcenter-esxi-management-80/vcenter-server-and-host-management.html' },
            { s:'Broadcom KB', t:'vmdir Replication Troubleshooting',             u:KB+'2


127


' }
        ],
        79: [
            { s:'TechDocs', t:'ESXi Core Dump Configuration',                      u:TD+'vsphere-vcenter-esxi-management-80/configuring-esxi-coredump.html' },
            { s:'Broadcom KB', t:'Analyzing PSOD Core Dumps',                     u:KB+'1


004


250


' }
        ],
        80: [
            { s:'TechDocs', t:'VMware Skyline Advisor',                             u:'https://docs.vmware.com/en/VMware-Skyline/services/skyline-user-guide/GUID-landing.html' },
            { s:'Broadcom KB', t:'Skyline Collector Troubleshooting',             u:BKB+'342811' }
        ]
    };

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !refs[kbId]) return;
            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;
            var links = refs[kbId];
            if (links.length === 0) return;
            var section = document.createElement('div');
            section.className = 'refs-section';
            section.innerHTML =
                '<div class="section-label" style="margin-top:1.5rem;">Official References</div>' +
                '<div class="refs-links">' +
                links.map(function (r) {
                    return '<a href="' + r.u + '" target="_blank" rel="noopener" class="ref-link" title="' + r.t + '">' +
                        '<span class="ref-source">' + r.s + '</span>' +
                        '<span class="ref-title">' + r.t + '</span>' +
                        '<svg class="ref-ext" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 1H11v7.5M11 1 1 11"/></svg>' +
                        '</a>';
                }).join('') +
                '</div>';
            body.appendChild(section);
        });
    });

    var style = document.createElement('style');
    style.textContent =
        '.refs-links{display:flex;flex-direction:column;gap:0.4rem;margin-top:0.5rem;}' +
        '.ref-link{display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0.85rem;border-radius:6px;text-decoration:none;font-size:0.78rem;background:rgba(88,166,255,0.04);border:1px solid rgba(88,166,255,0.12);transition:all 0.2s;}' +
        '.ref-link:hover{background:rgba(88,166,255,0.1);border-color:rgba(88,166,255,0.3);transform:translateX(2px);}' +
        '.ref-source{font-weight:700;font-size:0.7rem;color:#58a6ff;white-space:nowrap;min-width:90px;}' +
        '.ref-title{color:#8b949e;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
        '.ref-ext{width:10px;height:10px;color:#6e7681;flex-shrink:0;}' +
        '@media(max-width:600px){.ref-source{min-width:70px;font-size:0.65rem;}.ref-link{font-size:0.72rem;padding:0.4rem 0.65rem;}}';
    document.head.appendChild(style);
})();
