/**
 * vSAN KB — Verify Fix Validation
 * Auto-injects a "Verify the Fix" checklist into each KB entry with
 * specific esxcli / vSphere Client / CLI commands to confirm remediation.
 * Include after kb-version.js in every phase HTML file.
 */
(function () {

    var vfy = {
        /* ═══════════════════════════════════════════
           Phase 1 — Top 10 Common Fix & Break Issues
           ═══════════════════════════════════════════ */
        1: {
            title: 'Verify Disk Group Recovery',
            steps: [
                { cmd: 'esxcli vsan storage list', note: 'Confirm all disk groups show "In CMMDS: true" and status "MOUNTED"' },
                { cmd: 'esxcli vsan health cluster list', note: 'Check "vSAN Disk Balance" and "Disk group" tests pass' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Disk Management', note: 'All disk groups visible with green health status' },
                { cmd: 'esxcli vsan debug disk overview', note: 'Verify no "absent" or "error" state disks' }
            ]
        },
        2: {
            title: 'Verify Network Partition Resolution',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: 'All nodes show "Node State: MASTER" or "AGENT" — no BACKUP partitions' },
                { cmd: 'esxcli network ip interface list | grep -i vsan', note: 'vSAN VMkernel adapter is enabled and has IP' },
                { cmd: 'vmkping -I vmk1 <remote-host-vsan-ip> -s 8972 -d', note: 'Jumbo frame ping succeeds to all vSAN hosts (0% packet loss)' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health → Network', note: 'All network health checks pass, "Network Partition" shows green' }
            ]
        },
        3: {
            title: 'Verify Object Accessibility',
            steps: [
                { cmd: 'esxcli vsan health cluster list --include-obj-uuids', note: 'No "inaccessible" objects reported' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Virtual Objects', note: 'All objects show "Healthy" compliance status' },
                { cmd: 'python /usr/lib/vmware/vsan/bin/vsan-health-check.pyc', note: 'Object health check returns 0 inaccessible objects (VCSA)' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'Inaccessible count = 0, reduced-availability = 0' }
            ]
        },
        4: {
            title: 'Verify Resync Completion',
            steps: [
                { cmd: 'esxcli vsan debug resync summary get', note: '"Objects to resync: 0" and "Bytes remaining: 0"' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Resyncing Components', note: 'Table is empty — no active resync operations' },
                { cmd: 'esxcli vsan health cluster list', note: '"Resync operations" health check passes' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'No "active resync" or "stale" objects' }
            ]
        },
        5: {
            title: 'Verify Host Joined Cluster',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: 'Host appears in cluster membership with correct Sub-Cluster UUID' },
                { cmd: 'esxcli vsan storage list', note: 'Host disk groups are mounted and contributing storage' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health → Cluster', note: '"Hosts with connectivity issues" check is green' },
                { cmd: 'esxcli vsan health cluster list', note: '"vSAN cluster member" and "Host connectivity" tests pass' }
            ]
        },
        6: {
            title: 'Verify Stretched Cluster Health',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: 'Shows "Stretched Cluster" = true, preferred & secondary fault domains visible' },
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Fault Domains', note: 'Both sites + witness host displayed with correct host assignments' },
                { cmd: 'esxcli vsan health cluster list', note: '"Witness host" and "Site connectivity" checks pass' },
                { cmd: 'vmkping -I vmk1 <witness-vsan-ip>', note: 'Witness host reachable from both sites with <10ms latency' }
            ]
        },
        7: {
            title: 'Verify Encryption Status',
            steps: [
                { cmd: 'esxcli vsan encryption info get', note: '"Encryption Enabled: true", "KMS status: Connected"' },
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Services → Encryption', note: 'Encryption shows "Enabled", key provider status "Connected"' },
                { cmd: 'esxcli vsan health cluster list', note: '"Encryption" health checks all pass (KMS connectivity, key status)' },
                { cmd: 'esxcli vsan storage list | grep -i encrypt', note: 'All disk groups show encryption enabled' }
            ]
        },
        8: {
            title: 'Verify Performance Recovery',
            steps: [
                { cmd: 'esxtop (press u for vSAN)', note: 'Latency columns (GAVG) < 5ms for read, < 10ms for write under normal load' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Performance → Cluster', note: 'IOPS, throughput, latency graphs return to baseline levels' },
                { cmd: 'esxcli vsan health cluster list', note: '"Performance service" health check is green' },
                { cmd: 'esxcli vsan debug disk overview', note: 'No disks showing congestion values > 0' }
            ]
        },
        9: {
            title: 'Verify Post-Upgrade Health',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: 'All hosts on expected target build number' },
                { cmd: 'esxcli vsan health cluster list', note: 'All health checks pass — no "upgrade" warnings' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'No degraded, inaccessible, or reduced-availability objects' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health', note: 'vSAN disk format version matches target; no "disk format upgrade needed"' },
                { cmd: 'esxcli system version get', note: 'Build number matches patch/upgrade target' }
            ]
        },
        10: {
            title: 'Verify Host Exited Maintenance Mode',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: 'Host shows "Node State: AGENT" or "MASTER" (not "DECOMMISSIONED")' },
                { cmd: 'esxcli vsan storage list', note: 'All host disk groups are "MOUNTED" and "In CMMDS: true"' },
                { cmd: 'esxcli vsan debug resync summary get', note: 'Resync from maintenance exit completing (bytes remaining decreasing)' },
                { txt: 'vSphere Client → Host → Summary', note: 'Host shows "Connected" state, not "Maintenance Mode"' }
            ]
        },

        /* ═══════════════════════════════════════════
           Phase 2 — Day-2 Operations
           ═══════════════════════════════════════════ */
        11: {
            title: 'Verify ESA NVMe Device Recovery',
            steps: [
                { cmd: 'esxcli nvme device list', note: 'All NVMe devices listed with "Online" status' },
                { cmd: 'esxcli vsan storage list', note: 'Storage pool shows all expected NVMe devices contributing' },
                { cmd: 'esxcli vsan health cluster list', note: '"Physical disk health" check passes — no "degraded" warnings' },
                { txt: 'vSphere Client → Host → Monitor → vSAN → Physical Disks', note: 'All NVMe disks show green health, no error count anomalies' }
            ]
        },
        12: {
            title: 'Verify File Services Health',
            steps: [
                { txt: 'vSphere Client → Cluster → Configure → vSAN → File Service', note: 'File service shows "Enabled" with all file server VMs running' },
                { cmd: 'esxcli vsan health cluster list', note: '"File service" health checks all pass' },
                { cmd: 'nslookup <file-server-fqdn>', note: 'File service DNS entries resolve correctly' },
                { txt: 'From client: mount -t nfs <file-share-ip>:/share /mnt', note: 'NFS/SMB share mounts and read/write operations succeed' }
            ]
        },
        13: {
            title: 'Verify HCI Mesh Configuration',
            steps: [
                { txt: 'vSphere Client → Cluster → Configure → vSAN → HCI Mesh', note: 'Remote datastore mounted, capacity visible from client cluster' },
                { cmd: 'esxcli vsan health cluster list', note: '"HCI Mesh" health checks pass — connectivity to server cluster confirmed' },
                { txt: 'vSphere Client → Client Cluster → Monitor → vSAN → Capacity', note: 'Remote capacity shows expected usable storage from server cluster' },
                { cmd: 'esxcli vsan debug object list | grep remote', note: 'Objects placed on remote datastore are accessible' }
            ]
        },
        14: {
            title: 'Verify Encryption Key Rotation',
            steps: [
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Services → Encryption', note: 'Key provider shows "Connected", last rekey timestamp updated' },
                { cmd: 'esxcli vsan encryption info get', note: '"KEK ID" matches the new key ID after rotation' },
                { cmd: 'esxcli vsan health cluster list', note: '"Encryption" health group passes — no key mismatch warnings' },
                { cmd: 'esxcli vsan health cluster list', note: '"Physical disk encryption status" shows all disks using new key' }
            ]
        },
        15: {
            title: 'Verify Skyline Health Reporting',
            steps: [
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health', note: 'Skyline Health shows online status, last check timestamp < 60 min ago' },
                { cmd: 'esxcli vsan health cluster list', note: 'All checks run successfully with timestamps showing recent execution' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health → Online health', note: '"Online health connectivity" shows green status' },
                { txt: 'Skyline Advisor portal → vSAN section', note: 'Active findings and recommendations populating for the cluster' }
            ]
        },
        16: {
            title: 'Verify Dedup & Compression',
            steps: [
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Capacity', note: 'Dedup & Compression ratio displayed (e.g., "2.1x"), savings shown in GB' },
                { cmd: 'esxcli vsan debug disk overview', note: 'Disk group shows "Dedup Scope" and "Compression" as "enabled"' },
                { cmd: 'esxcli vsan health cluster list', note: '"Space efficiency" health checks pass' },
                { cmd: 'esxcli vsan storage list', note: 'Disk groups show expected dedup/compression configuration' }
            ]
        },
        17: {
            title: 'Verify Capacity Recovery',
            steps: [
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Capacity', note: 'Used capacity below 80% threshold, free space matches expected reclaim' },
                { cmd: 'esxcli vsan debug disk overview', note: 'No disks at 95%+ usage; all show adequate free space' },
                { cmd: 'esxcli vsan health cluster list', note: '"vSAN capacity" health check green — no "critical" or "warning"' },
                { cmd: 'esxcli vsan storage list', note: 'Total capacity and free space match expected values post-cleanup' }
            ]
        },
        18: {
            title: 'Verify vLCM Image Compliance',
            steps: [
                { txt: 'vSphere Client → Cluster → Updates → Image', note: 'All hosts show "Compliant" with the desired image' },
                { cmd: 'esxcli system version get', note: 'ESXi build matches the vLCM cluster image specification' },
                { txt: 'vSphere Client → Cluster → Updates → Hosts → Check Compliance', note: 'Compliance check returns no drifted hosts' },
                { cmd: 'esxcli software vib list | Select-String <driver-name>', note: 'Expected driver/firmware VIBs installed at correct version' }
            ]
        },
        19: {
            title: 'Verify Storage Policy Compliance',
            steps: [
                { txt: 'vSphere Client → VM → Configure → Policies and Profiles', note: 'VM storage policy shows "Compliant" status' },
                { cmd: 'esxcli vsan policy getdefault', note: 'Default policy matches cluster configuration (FTT, stripe, etc.)' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Virtual Objects', note: 'Objects show correct placement and compliance with assigned policy' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'No "policy non-compliant" objects reported' }
            ]
        },
        20: {
            title: 'Verify iSCSI Target Service',
            steps: [
                { txt: 'vSphere Client → Cluster → Configure → vSAN → iSCSI Target Service', note: 'Service "Enabled", targets and LUNs listed with "Online" status' },
                { cmd: 'esxcli vsan health cluster list', note: '"iSCSI target service" health checks pass' },
                { cmd: 'esxcli vsan iscsi target list', note: 'Target IQN listed with expected LUN mappings' },
                { txt: 'From initiator: iscsiadm -m session', note: 'iSCSI session established; LUNs visible and I/O succeeds' }
            ]
        },

        /* ═══════════════════════════════════════════
           Phase 3 — DR & Data Protection
           ═══════════════════════════════════════════ */
        21: {
            title: 'Verify Host Recovery After PSOD',
            steps: [
                { cmd: 'esxcli system version get', note: 'Host booted successfully — build number and uptime confirm restart' },
                { cmd: 'esxcli vsan cluster get', note: 'Host rejoined vSAN cluster with correct membership' },
                { cmd: 'esxcli vsan debug resync summary get', note: 'Resync in progress or complete — no stale components' },
                { txt: 'vSphere Client → Host → Monitor → Logs → vmkernel.log', note: 'Confirm root cause of PSOD addressed (patch, driver, firmware)' },
                { cmd: 'esxcli vsan health cluster list', note: 'All host and disk health checks pass' }
            ]
        },
        22: {
            title: 'Verify Snapshot Cleanup',
            steps: [
                { txt: 'vSphere Client → VM → Snapshots → Manage Snapshots', note: 'Snapshot tree is empty or only expected snapshots remain' },
                { cmd: 'find /vmfs/volumes/vsanDatastore/ -name "*.delta.vmdk" | wc -l', note: 'Delta disk count matches expected snapshot count (ideally 0)' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Capacity', note: 'Capacity freed after snapshot consolidation visible in usage graph' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'No "snapshot consolidation needed" warnings' }
            ]
        },
        23: {
            title: 'Verify Stretched Cluster Site Recovery',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: 'Both fault domains visible, all hosts in correct domain membership' },
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Fault Domains', note: 'Preferred and secondary sites show all hosts, witness connected' },
                { cmd: 'esxcli vsan health cluster list', note: '"Site connectivity" and "Witness host" checks green' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'No "inaccessible" objects — components distributed across both sites' }
            ]
        },
        24: {
            title: 'Verify vSAN 8 Native Snapshots',
            steps: [
                { txt: 'vSphere Client → VM → Snapshots → Manage Snapshots', note: 'Native snapshots created/listed with expected timestamps' },
                { cmd: 'esxcli vsan debug object list --type=snapshot', note: 'Snapshot objects healthy, linked to parent VM objects' },
                { txt: 'vSphere Client → VM → Snapshots → Revert', note: 'Revert to snapshot completes successfully; VM runs correctly' },
                { cmd: 'esxcli vsan health cluster list', note: '"Object health" checks pass — no snapshot-related warnings' }
            ]
        },
        25: {
            title: 'Verify Data Integrity (Checksum)',
            steps: [
                { cmd: 'esxcli vsan health cluster list', note: '"Data integrity" health check passes — no checksum mismatch found' },
                { cmd: 'esxcli vsan debug object health summary get', note: '0 objects with data integrity errors' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health → Data', note: '"Checksum errors" counter shows 0 or stable (not increasing)' },
                { cmd: 'esxcli vsan debug disk overview', note: 'No disks flagged with media errors or bad sectors' }
            ]
        },
        26: {
            title: 'Verify vCenter Recovery',
            steps: [
                { txt: 'https://<vcenter-fqdn>/ui — Login', note: 'vSphere Client loads; authentication succeeds' },
                { cmd: 'vmon-cli -s vsphere-client', note: 'On VCSA: vSphere Client service "STARTED" state' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health', note: 'vSAN health data populates — cluster visible and managed' },
                { cmd: 'service-control --status --all', note: 'All VCSA services running (on VCSA CLI)' }
            ]
        },
        27: {
            title: 'Verify Host Isolation Response',
            steps: [
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Advanced Options', note: 'Host isolation response set as expected (Power Off / Leave Powered On)' },
                { cmd: 'esxcli vsan cluster get', note: 'Host in correct "Node State" — not in isolated partition' },
                { cmd: 'vmkping -I vmk0 <isolation-address>', note: 'Default gateway or isolation address reachable from all hosts' },
                { cmd: 'esxcli vsan health cluster list', note: '"Host connectivity" and "Network partition" checks pass' }
            ]
        },
        28: {
            title: 'Verify Proactive HA Configuration',
            steps: [
                { txt: 'vSphere Client → Cluster → Configure → vSphere Availability → Proactive HA', note: 'Proactive HA "Enabled", provider configured and reporting healthy' },
                { txt: 'vSphere Client → Cluster → Monitor → vSphere HA → Summary', note: 'No "quarantined" or "degraded" hosts flagged by provider' },
                { cmd: 'esxcli vsan health cluster list', note: 'vSAN health checks pass — hosts healthy post-migration' },
                { txt: 'vSphere Client → Host → Monitor → Hardware Health', note: 'Hardware sensors show normal (no alerts triggering provider action)' }
            ]
        },
        29: {
            title: 'Verify Cluster Startup Sequence',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: 'All hosts joined cluster — SubCluster Master present, all nodes AGENT' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'Objects transitioning from "reduced availability" to "healthy"' },
                { cmd: 'esxcli vsan debug resync summary get', note: 'Resync running and progressing (or complete if all hosts were up)' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health', note: 'All health checks pass; no "absent" or "inaccessible" warnings' }
            ]
        },
        30: {
            title: 'Verify Fault Domain Configuration',
            steps: [
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Fault Domains', note: 'Correct number of FDs (≥3 for FTT=1), each with expected hosts' },
                { cmd: 'esxcli vsan cluster get', note: 'Fault domain IDs assigned correctly to each host' },
                { cmd: 'esxcli vsan health cluster list', note: '"Fault domain" configuration check passes' },
                { cmd: 'esxcli vsan debug object list', note: 'Object components placed across different fault domains as expected by policy' }
            ]
        },

        /* ═══════════════════════════════════════════
           Phase 4 — VCF Integration
           ═══════════════════════════════════════════ */
        31: {
            title: 'Verify SDDC Manager Connectivity',
            steps: [
                { txt: 'SDDC Manager UI → Dashboard', note: 'All workload domains show "Active" status with green indicators' },
                { txt: 'SDDC Manager → Inventory → Clusters', note: 'vSAN cluster visible with correct host count and health' },
                { cmd: 'curl -sk https://<sddc-mgr>/v1/system/health | python -m json.tool', note: 'API returns "status": "ACTIVE" for all components' },
                { txt: 'SDDC Manager → Lifecycle Management', note: 'No pending failed tasks blocking further operations' }
            ]
        },
        32: {
            title: 'Verify Workload Domain Expansion',
            steps: [
                { txt: 'SDDC Manager → Inventory → Workload Domains → <domain>', note: 'New hosts appear in cluster, status "Active"' },
                { cmd: 'esxcli vsan cluster get', note: 'New hosts show in vSAN cluster membership' },
                { cmd: 'esxcli vsan storage list', note: 'New host disk groups mounted and contributing capacity' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Capacity', note: 'Total capacity increased by expected amount; resync complete' }
            ]
        },
        33: {
            title: 'Verify VCF Bundle Update',
            steps: [
                { txt: 'SDDC Manager → Lifecycle Management → Bundle Management', note: 'Bundle status shows "Applied" or "Completed" for target version' },
                { cmd: 'esxcli system version get', note: 'ESXi build matches VCF BOM for target release' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health', note: 'All post-upgrade health checks pass; no format version warnings' },
                { txt: 'SDDC Manager → Dashboard', note: 'Domain health green; no failed upgrade tasks in activity log' }
            ]
        },
        34: {
            title: 'Verify NSX-T & vSAN Coexistence',
            steps: [
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health → Network', note: 'All network checks pass — no MTU or teaming conflicts' },
                { txt: 'NSX Manager → System → Fabric → Transport Nodes', note: 'All hosts show "Success" configuration state in NSX' },
                { cmd: 'esxcli network ip interface list', note: 'vSAN VMkernel and NSX TEP interfaces coexist on correct vDS portgroups' },
                { cmd: 'vmkping -I vmk1 <remote-vsan-ip> -s 8972 -d', note: 'vSAN traffic passes correctly with jumbo frames despite NSX overlay' }
            ]
        },
        35: {
            title: 'Verify Stretched Cluster in VCF',
            steps: [
                { txt: 'SDDC Manager → Inventory → <Stretched Domain>', note: 'Both sites listed under domain with correct host assignment' },
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Fault Domains', note: 'Preferred site, secondary site, and witness host configured and healthy' },
                { cmd: 'esxcli vsan health cluster list', note: '"Stretched cluster" and "Witness host" health checks pass' },
                { cmd: 'esxcli vsan cluster get', note: 'Stretched = true, both fault domains populated' }
            ]
        },
        36: {
            title: 'Verify vLCM Image in VCF',
            steps: [
                { txt: 'SDDC Manager → Lifecycle Management → Image Management', note: 'Desired cluster image shows all hosts "Compliant"' },
                { txt: 'vSphere Client → Cluster → Updates → Image', note: 'No drifted hosts; image baseline current' },
                { cmd: 'esxcli software vib list | head -20', note: 'VIBs match the VCF BOM / vLCM image specification' },
                { cmd: 'esxcli vsan health cluster list', note: 'No "build recommendation" or "version mismatch" warnings' }
            ]
        },
        37: {
            title: 'Verify Aria Operations Integration',
            steps: [
                { txt: 'Aria Operations → Dashboards → vSAN', note: 'vSAN cluster objects discovered, metrics populating in dashboards' },
                { txt: 'Aria Operations → Alerts → Active', note: 'No critical vSAN alerts; stale alerts cleared after fix' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health → Online Health', note: 'Online health connectivity to cloud analytics shows green' },
                { txt: 'Aria Operations → Environment → vSAN Clusters', note: 'Capacity, performance, and health metrics updating within collection interval' }
            ]
        },
        38: {
            title: 'Verify Management Domain Recovery',
            steps: [
                { txt: 'SDDC Manager UI → Dashboard', note: 'Management domain shows "Active" status, all services green' },
                { cmd: 'service-control --status --all', note: 'All VCSA services running on management vCenter' },
                { cmd: 'esxcli vsan cluster get', note: 'Management cluster vSAN membership complete' },
                { txt: 'SDDC Manager → Lifecycle Management', note: 'Lifecycle operations available; no orphaned or failed tasks' },
                { cmd: 'esxcli vsan health cluster list', note: 'Management vSAN cluster health all-green' }
            ]
        },
        39: {
            title: 'Verify HCI Mesh Cross-Domain',
            steps: [
                { txt: 'vSphere Client → Client Cluster → Datastores', note: 'Remote vSAN datastore from server domain mounted and accessible' },
                { cmd: 'esxcli vsan health cluster list', note: '"HCI Mesh" health checks pass for cross-domain connectivity' },
                { txt: 'vSphere Client → Client Cluster → Monitor → vSAN → Capacity', note: 'Remote capacity reflected in available storage' },
                { txt: 'SDDC Manager → Inventory → Workload Domains', note: 'Both client and server domains show healthy status' }
            ]
        },
        40: {
            title: 'Verify Certificate Rotation with Encryption',
            steps: [
                { txt: 'vSphere Client → Administration → Certificate Management', note: 'Certificates show updated "Valid From" date, status "Good"' },
                { cmd: 'esxcli vsan encryption info get', note: 'Encryption still enabled; KMS connectivity intact post-cert rotation' },
                { cmd: 'esxcli vsan health cluster list', note: '"Encryption" and "Certificate" health checks pass' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health', note: 'No "certificate expiring" or "KMS unreachable" warnings' }
            ]
        },

        /* ═══════════════════════════════════════════
           Phase 5 — ESA Deep Dive
           ═══════════════════════════════════════════ */
        41: {
            title: 'Verify ESA Architecture Active',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: '"Storage Architecture: ESA" confirmed in output' },
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Services', note: 'Architecture shows "Express Storage Architecture (ESA)"' },
                { cmd: 'esxcli vsan storage list', note: 'Storage pool layout (no cache/capacity tier distinction — single pool)' },
                { cmd: 'esxcli vsan health cluster list', note: 'ESA-specific health checks pass' }
            ]
        },
        42: {
            title: 'Verify ESA NVMe Drive Recovery',
            steps: [
                { cmd: 'esxcli nvme device list', note: 'Replaced/recovered NVMe device shows "Online" status' },
                { cmd: 'esxcli vsan storage list', note: 'New NVMe device claimed by vSAN in storage pool' },
                { cmd: 'esxcli vsan debug resync summary get', note: 'Resync progressing/complete after drive replacement' },
                { cmd: 'esxcli vsan health cluster list', note: '"Physical disk" and "ESA disk" health checks green' }
            ]
        },
        43: {
            title: 'Verify OSA to ESA Migration',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: '"Storage Architecture: ESA" — migration complete' },
                { cmd: 'esxcli vsan storage list', note: 'Single-tier NVMe storage pool (no cache/capacity split)' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'All objects healthy post-migration — no data loss' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health', note: 'Full health green; ESA features (native snapshots, compression) available' }
            ]
        },
        44: {
            title: 'Verify ESA RAID-5/6 Erasure Coding',
            steps: [
                { txt: 'vSphere Client → VM → Configure → Policies', note: 'VM policy shows RAID-5 or RAID-6 with "Compliant" status' },
                { cmd: 'esxcli vsan debug object list --type=vdisk', note: 'Object layout shows erasure coding components (4+1 or 6+2)' },
                { cmd: 'esxcli vsan health cluster list', note: '"Object health" and "Policy compliance" checks pass' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Virtual Objects', note: 'Objects show correct RAID configuration and healthy placement' }
            ]
        },
        45: {
            title: 'Verify ESA Native Snapshots (8.0 U1+)',
            steps: [
                { txt: 'vSphere Client → VM → Snapshots → Manage Snapshots', note: 'Native snapshots listed — no legacy redo logs, near-instant creation' },
                { cmd: 'esxcli vsan debug object list --type=snapshot', note: 'Snapshot objects show ESA native format, healthy status' },
                { txt: 'vSphere Client → VM → Snapshots → Revert to snapshot', note: 'Revert completes instantly; VM data consistent' },
                { cmd: 'esxcli vsan health cluster list', note: 'Object health checks pass — no snapshot-related warnings' }
            ]
        },
        46: {
            title: 'Verify ESA Inline Dedup & Compression',
            steps: [
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Capacity', note: 'Dedup+Compression ratio > 1.0x; savings visible in capacity overview' },
                { cmd: 'esxcli vsan storage list', note: 'Storage pool shows dedup/compression enabled (ESA inline)' },
                { cmd: 'esxcli vsan health cluster list', note: '"Space efficiency" health checks green' },
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Services', note: 'Space efficiency shows "Enabled" for ESA cluster' }
            ]
        },
        47: {
            title: 'Verify ESA Storage Pool Balance',
            steps: [
                { cmd: 'esxcli vsan debug disk overview', note: 'All NVMe devices show similar usage percentage (variance < 10%)' },
                { cmd: 'esxcli vsan health cluster list', note: '"Disk balance" check passes — no imbalanced disks' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Physical Disks', note: 'Capacity usage evenly distributed across pool members' },
                { cmd: 'esxcli vsan storage list', note: 'All devices in storage pool contributing similar capacity' }
            ]
        },
        48: {
            title: 'Verify NVMe Firmware Update',
            steps: [
                { cmd: 'esxcli nvme device list', note: 'Firmware version matches target release for each NVMe device' },
                { cmd: 'esxcli vsan storage list', note: 'All NVMe disks "MOUNTED", no errors post-firmware update' },
                { cmd: 'esxcli vsan health cluster list', note: '"Physical disk" health green; no firmware mismatch warnings' },
                { txt: 'vSphere Client → Host → Monitor → Hardware Health → Storage', note: 'NVMe drives show correct firmware version, healthy status' }
            ]
        },
        49: {
            title: 'Verify ESA LSOM2 Recovery',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: 'Host rejoined cluster after LSOM2 crash recovery' },
                { cmd: 'esxcli vsan storage list', note: 'Storage pool online — all NVMe devices contributing' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'No "permanently lost" or "inaccessible" objects' },
                { cmd: 'esxcli vsan health cluster list', note: 'All ESA-specific health checks pass post-recovery' },
                { cmd: 'esxcli vsan debug resync summary get', note: 'Resync complete — 0 bytes remaining' }
            ]
        },
        50: {
            title: 'Verify ESA Performance Tuning',
            steps: [
                { cmd: 'esxtop (press u for vSAN)', note: 'IOPS and latency meeting expected baseline for ESA (read latency < 2ms)' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Performance', note: 'Performance metrics show improvement post-tuning, stable trend' },
                { cmd: 'esxcli vsan health cluster list', note: '"Performance service" health check green' },
                { cmd: 'esxcli vsan debug disk overview', note: 'No NVMe devices showing queue congestion or high latency' }
            ]
        },

        /* ═══════════════════════════════════════════
           Phase 6 — Performance & Capacity
           ═══════════════════════════════════════════ */
        51: {
            title: 'Verify Congestion Cleared',
            steps: [
                { cmd: 'esxtop (press u for vSAN)', note: 'Congestion (CONGSTN) column shows 0 for all components' },
                { cmd: 'esxcli vsan debug disk overview', note: 'No disks reporting congestion values > 0' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Performance', note: 'Backend latency and congestion graph returns to baseline' },
                { cmd: 'esxcli vsan health cluster list', note: '"Congestion" health check passes' }
            ]
        },
        52: {
            title: 'Verify Resync Throttle Configuration',
            steps: [
                { cmd: 'esxcli vsan policy getdefault', note: 'Resync throttle settings match desired value' },
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Advanced Options', note: 'Resync throttle parameter set as configured' },
                { cmd: 'esxcli vsan debug resync summary get', note: 'Resync rate (bytes/sec) consistent with configured throttle' },
                { cmd: 'esxtop (press u for vSAN)', note: 'VM I/O latency acceptable during active resync (within SLA)' }
            ]
        },
        53: {
            title: 'Verify Capacity Planning Baseline',
            steps: [
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Capacity', note: 'Current usage, dedup/compression savings, and slack space all visible' },
                { cmd: 'esxcli vsan storage list', note: 'Total and free capacity match expected calculation' },
                { cmd: 'esxcli vsan health cluster list', note: '"Capacity" health check green — no warnings' },
                { txt: 'vSAN Sizer (online tool)', note: 'Cross-reference actual usage with sizer recommendation for growth' }
            ]
        },
        54: {
            title: 'Verify esxtop Monitoring Setup',
            steps: [
                { cmd: 'esxtop -b -d 5 -n 3 > /tmp/esxtop_check.csv', note: 'Batch mode capture runs without errors; CSV created' },
                { cmd: 'esxtop (press u for vSAN disk stats)', note: 'vSAN device stats visible: IOPS, latency, congestion columns populate' },
                { cmd: 'esxtop (press v for vSAN VM stats)', note: 'Per-VM vSAN stats visible: read/write IOPS, latency per VMDK' },
                { txt: 'Copy CSV to workstation and open in Excel/vscsiStats', note: 'Performance data parseable; baseline metrics captured for comparison' }
            ]
        },
        55: {
            title: 'Verify Cache Destage Recovery (OSA)',
            steps: [
                { cmd: 'esxtop (press u for vSAN)', note: 'Cache tier destage rate (DESTAGEMD) back to normal; write latency < 10ms' },
                { cmd: 'esxcli vsan debug disk overview', note: 'Cache disk usage < 40%; no "write buffer full" conditions' },
                { cmd: 'esxcli vsan health cluster list', note: '"Disk health — cache tier" check green' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Performance → Backend', note: 'Write latency trend stable and within acceptable range' }
            ]
        },
        56: {
            title: 'Verify Cache Hit Ratio (OSA)',
            steps: [
                { cmd: 'esxtop (press u for vSAN)', note: 'Read cache hit ratio (RCMISS) low — cache serving reads effectively' },
                { cmd: 'esxcli vsan debug disk overview', note: 'Cache disk active; read cache populated' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Performance', note: 'Read latency returned to expected range (< 5ms under normal workload)' },
                { cmd: 'esxcli vsan health cluster list', note: '"Disk health" and "Performance" checks green' }
            ]
        },
        57: {
            title: 'Verify IOPS Limits / QoS',
            steps: [
                { txt: 'vSphere Client → VM → Configure → Policies and Profiles', note: 'IOPS limit value set in storage policy; "Compliant" status' },
                { cmd: 'esxtop (press v for VM stats)', note: 'VM IOPS constrained at configured limit — no bursts above threshold' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Performance → VM', note: 'Per-VM IOPS graph shows throttling at configured ceiling' },
                { cmd: 'esxcli vsan health cluster list', note: 'No "policy compliance" warnings related to IOPS limits' }
            ]
        },
        58: {
            title: 'Verify ReadyNode Sizing Compliance',
            steps: [
                { txt: 'VMware Compatibility Guide → vSAN ReadyNode', note: 'Server model listed as certified ReadyNode for target vSAN version' },
                { cmd: 'esxcli vsan health cluster list', note: '"HCL" health checks pass — controller, disk, NIC all on HCL' },
                { txt: 'vSphere Client → Host → Monitor → Hardware Health', note: 'Hardware sensors normal; memory and CPU match ReadyNode spec' },
                { cmd: 'esxcli vsan storage list', note: 'Disk count and size match ReadyNode configuration spec' }
            ]
        },
        59: {
            title: 'Verify Witness Resource Health',
            steps: [
                { txt: 'vSphere Client → Witness Host → Summary', note: 'Witness appliance powered on, connected, resource usage within limits' },
                { cmd: 'esxcli vsan health cluster list', note: '"Witness host" health checks pass — no resource exhaustion warnings' },
                { cmd: 'esxcli vsan cluster get', note: 'Witness appears in cluster membership for stretched/2-node topology' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health → Stretched Cluster', note: 'Witness connectivity and witness component placement healthy' }
            ]
        },
        60: {
            title: 'Verify TRIM/UNMAP Reclamation',
            steps: [
                { cmd: 'esxcli vsan debug disk overview', note: 'Post-UNMAP: free space on capacity disks increased' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Capacity', note: 'Used capacity decreased after TRIM/UNMAP; reclaimed space visible' },
                { cmd: 'esxcli vsan health cluster list', note: '"Capacity" check reflects updated free space' },
                { txt: 'vSphere Client → Cluster → Configure → vSAN → Advanced Options', note: 'UNMAP/TRIM settings enabled at cluster level (EnableSWTrim=1)' }
            ]
        },

        /* ═══════════════════════════════════════════
           Phase 7 — Networking for vSAN
           ═══════════════════════════════════════════ */
        61: {
            title: 'Verify VMkernel Network Config',
            steps: [
                { cmd: 'esxcli network ip interface list | grep -i vsan', note: 'vSAN VMkernel adapter enabled with correct IP/VLAN' },
                { cmd: 'esxcli vsan network list', note: 'vSAN network interface listed with correct traffic type tag' },
                { cmd: 'vmkping -I vmk1 <all-other-vsan-hosts>', note: 'Connectivity to all vSAN hosts confirmed (0% packet loss)' },
                { cmd: 'esxcli vsan health cluster list', note: '"Network health" checks all pass' }
            ]
        },
        62: {
            title: 'Verify MTU Configuration',
            steps: [
                { cmd: 'esxcli network ip interface list', note: 'vSAN VMkernel MTU shows 9000 (or configured value)' },
                { cmd: 'vmkping -I vmk1 <remote-vsan-ip> -s 8972 -d', note: 'Jumbo frame ping succeeds — full path MTU correct' },
                { cmd: 'esxcli network vswitch dvs vmware list', note: 'vDS MTU set to 9000 matching VMkernel configuration' },
                { cmd: 'esxcli vsan health cluster list', note: '"vSAN: MTU check (large packet size)" passes on all hosts' }
            ]
        },
        63: {
            title: 'Verify NIC Teaming Configuration',
            steps: [
                { cmd: 'esxcli network vswitch dvs vmware list', note: 'vDS portgroup shows correct teaming policy (Route based on physical NIC load)' },
                { cmd: 'esxcli network nic list', note: 'All physical NICs show "Up" link status, expected speed (10/25/100 GbE)' },
                { cmd: 'esxcli network ip interface list', note: 'vSAN VMkernel bound to correct portgroup with teaming active' },
                { cmd: 'esxcli vsan health cluster list', note: '"Network" health checks pass — no single point of failure warnings' }
            ]
        },
        64: {
            title: 'Verify Unicast Transport (Multicast-Free)',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: '"Transport Mode: Unicast" confirmed (no multicast dependency)' },
                { cmd: 'esxcli vsan cluster get', note: 'All hosts in single partition — unicast communication healthy' },
                { cmd: 'esxcli vsan health cluster list', note: '"Multicast assessment" check passes or not applicable (7.0U1+)' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health → Network', note: 'Network health green — no multicast-related failures' }
            ]
        },
        65: {
            title: 'Verify Network Partition Resolved',
            steps: [
                { cmd: 'esxcli vsan cluster get', note: 'Single Sub-Cluster UUID — all hosts in same partition' },
                { cmd: 'vmkping -I vmk1 <each-vsan-host-ip>', note: 'All vSAN hosts reachable from every other host' },
                { cmd: 'esxcli vsan health cluster list', note: '"Network partition" health check shows green — no split-brain' },
                { cmd: 'esxcli vsan debug object health summary get', note: 'No "inaccessible" objects due to partition' }
            ]
        },
        66: {
            title: 'Verify vDS Migration',
            steps: [
                { cmd: 'esxcli network vswitch dvs vmware list', note: 'vSAN portgroup on target vDS; VMkernel adapter connected' },
                { cmd: 'esxcli vsan network list', note: 'vSAN interface references correct vDS portgroup' },
                { cmd: 'vmkping -I vmk1 <remote-vsan-ip> -s 8972 -d', note: 'vSAN traffic flows correctly on new vDS (jumbo frames pass)' },
                { cmd: 'esxcli vsan health cluster list', note: '"Network" health checks pass — no connectivity issues post-migration' }
            ]
        },
        67: {
            title: 'Verify RDMA / RoCE v2 Configuration',
            steps: [
                { cmd: 'esxcli rdma device list', note: 'RDMA devices listed with "Active" status' },
                { cmd: 'esxcli vsan network list', note: 'vSAN network interface shows RDMA transport type' },
                { cmd: 'esxcli vsan health cluster list', note: '"RDMA" and "Network" health checks pass' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Performance', note: 'Network throughput and latency consistent with RDMA expectations (< 100μs)' }
            ]
        },
        68: {
            title: 'Verify Stretched Cluster Networking',
            steps: [
                { cmd: 'vmkping -I vmk1 <remote-site-vsan-ip> -s 8972 -d', note: 'Cross-site jumbo ping succeeds with RTT < 5ms (stretched cluster req)' },
                { cmd: 'vmkping -I vmk1 <witness-ip>', note: 'Witness reachable from both sites' },
                { cmd: 'esxcli vsan health cluster list', note: '"Site connectivity" and "Witness network" checks pass' },
                { txt: 'vSphere Client → Cluster → Monitor → vSAN → Health → Stretched Cluster', note: 'All stretched cluster network validations green' }
            ]
        },
        69: {
            title: 'Verify Firewall & Port Configuration',
            steps: [
                { cmd: 'esxcli network firewall ruleset list | grep vsan', note: 'vSAN firewall rulesets (vsanvp, vsanEncryption, etc.) enabled' },
                { cmd: 'esxcli network firewall ruleset allowedip list --ruleset-id vsanvp', note: 'Allowed IPs match vSAN network range' },
                { cmd: 'nc -z <remote-vsan-ip> 2233', note: 'vSAN data port (2233) reachable; port 2244 (transport) also open' },
                { cmd: 'esxcli vsan health cluster list', note: '"Network" health pass — no firewall blocking vSAN traffic' }
            ]
        },
        70: {
            title: 'Verify 25/100 GbE NIC for ESA',
            steps: [
                { cmd: 'esxcli network nic list', note: 'NICs show 25000/100000 Mbps link speed; driver loaded correctly' },
                { cmd: 'esxcli vsan health cluster list', note: '"HCL" check passes — NIC model on vSAN HCL for ESA' },
                { cmd: 'esxcli network nic stats get -n vmnic0', note: 'TX/RX packet counts incrementing; no CRC or frame errors' },
                { txt: 'vSphere Client → Host → Monitor → Performance → Network', note: 'Throughput utilizes 25/100 GbE bandwidth; no bottleneck' }
            ]
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !vfy[kbId]) return;

            var d = vfy[kbId];
            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;

            var html = '<div class="section-label" style="margin-top:1.5rem;">&#9989; Verify the Fix</div>';
            html += '<div class="vfy-title">' + d.title + '</div>';
            html += '<ol class="vfy-steps">';
            for (var i = 0; i < d.steps.length; i++) {
                var s = d.steps[i];
                html += '<li class="vfy-step">';
                if (s.cmd) {
                    html += '<div class="vfy-cmd-wrap">';
                    html += '<code class="vfy-cmd">' + escapeHTML(s.cmd) + '</code>';
                    html += '<button class="vfy-copy" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent).then(function(){});" title="Copy command">&#128203;</button>';
                    html += '</div>';
                } else if (s.txt) {
                    html += '<div class="vfy-ui"><span class="vfy-ui-icon">&#128421;</span> ' + escapeHTML(s.txt) + '</div>';
                }
                html += '<div class="vfy-note">' + escapeHTML(s.note) + '</div>';
                html += '</li>';
            }
            html += '</ol>';

            var section = document.createElement('div');
            section.className = 'vfy-section';
            section.innerHTML = html;
            body.appendChild(section);
        });
    });

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // CSS
    var style = document.createElement('style');
    style.textContent =
        '.vfy-section{margin-top:0.5rem;}' +
        '.vfy-title{font-size:0.82rem;font-weight:700;color:#48cae4;margin:0.5rem 0 0.6rem;letter-spacing:0.3px;}' +
        '.vfy-steps{list-style:none;counter-reset:vfy;padding:0;margin:0;}' +
        '.vfy-step{position:relative;padding:0.65rem 0.8rem 0.65rem 2.6rem;margin-bottom:0.5rem;' +
        'background:rgba(30,45,61,0.5);border-radius:8px;border-left:3px solid rgba(72,202,228,0.3);}' +
        '.vfy-step::before{counter-increment:vfy;content:counter(vfy);position:absolute;left:0.7rem;top:0.65rem;' +
        'width:1.3rem;height:1.3rem;border-radius:50%;background:rgba(72,202,228,0.12);color:#48cae4;' +
        'font-size:0.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;}' +
        '.vfy-cmd-wrap{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem;}' +
        '.vfy-cmd{font-family:"Fira Code","Cascadia Code",monospace;font-size:0.75rem;color:#a8d8ea;' +
        'background:rgba(0,0,0,0.3);padding:0.3rem 0.6rem;border-radius:5px;flex:1;word-break:break-all;}' +
        '.vfy-copy{background:rgba(72,202,228,0.1);border:1px solid rgba(72,202,228,0.2);color:#48cae4;' +
        'border-radius:4px;padding:0.2rem 0.4rem;cursor:pointer;font-size:0.7rem;transition:all 0.2s;flex-shrink:0;}' +
        '.vfy-copy:hover{background:rgba(72,202,228,0.25);transform:scale(1.05);}' +
        '.vfy-ui{font-size:0.75rem;color:#a8d8ea;margin-bottom:0.3rem;padding:0.3rem 0.5rem;' +
        'background:rgba(244,162,97,0.06);border-radius:5px;border:1px solid rgba(244,162,97,0.12);}' +
        '.vfy-ui-icon{margin-right:0.3rem;}' +
        '.vfy-note{font-size:0.72rem;color:#8fa3b8;line-height:1.5;padding-left:0.1rem;}' +
        '@media(max-width:600px){.vfy-step{padding-left:2.2rem;}.vfy-cmd{font-size:0.68rem;}}';
    document.head.appendChild(style);
})();
