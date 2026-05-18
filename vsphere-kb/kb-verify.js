/**
 * vSphere KB — Verify Fix Validation
 * Auto-injects a "Verify the Fix" checklist into each KB entry with
 * specific CLI commands and vSphere Client checks to confirm remediation.
 * Include after kb-version.js in every phase HTML file.
 */
(function () {
    var vfy = {
        /* ═══ Phase 1 ═══ */
        1: { title:'Verify HA Failover', steps:[
            { cmd:'vim-cmd vmsvc/getallvms', note:'VMs restarted on surviving hosts' },
            { txt:'Cluster → Monitor → vSphere HA → Summary', note:'HA enabled, all hosts protected, master shown' },
            { cmd:'cat /var/log/fdm.log | grep -i "failover"', note:'Failover events logged successfully' }
        ]},
        2: { title:'Verify DRS Balance', steps:[
            { txt:'Cluster → Monitor → DRS → Recommendations', note:'No pending recommendations; load balanced' },
            { cmd:'esxtop (c view)', note:'%PCPU usage roughly equal across hosts' },
            { txt:'Cluster → Monitor → DRS → CPU/Memory Utilization', note:'Hosts within 10-15% of each other' }
        ]},
        3: { title:'Verify vMotion Connectivity', steps:[
            { cmd:'vmkping -I vmk1 <target-host-ip> -d -s 8972', note:'Jumbo frame ping succeeds (0% loss)' },
            { txt:'Migrate a test VM between hosts', note:'vMotion completes without errors' },
            { cmd:'esxcli network ip interface list | grep -i vmotion', note:'vMotion VMkernel enabled with correct IP' }
        ]},
        4: { title:'Verify Host Reconnection', steps:[
            { txt:'vSphere Client → Host status shows Connected', note:'Host no longer Disconnected/Not Responding' },
            { cmd:'/etc/init.d/vpxa status', note:'vpxa service is running' },
            { cmd:'esxcli network ip connection list | grep 443', note:'Active connection to vCenter on port 443' }
        ]},
        5: { title:'Verify Post-PSOD Recovery', steps:[
            { cmd:'esxcli system boot device get', note:'Host booted successfully from correct device' },
            { txt:'vSphere Client → Host → Monitor → Events', note:'No new PSOD events since recovery' },
            { cmd:'ls /var/core/', note:'Core dump preserved for analysis (or sent to dump collector)' }
        ]},
        6: { title:'Verify VM Power-On', steps:[
            { txt:'VM powered on successfully in vSphere Client', note:'VM running and accessible on network' },
            { cmd:'vim-cmd vmsvc/power.getstate <vmid>', note:'Shows "Powered on"' },
            { txt:'Check HA admission control still allows failover', note:'Cluster has sufficient failover capacity' }
        ]},
        7: { title:'Verify vpxd Service Health', steps:[
            { cmd:'service-control --status', note:'All services running, especially vpxd' },
            { txt:'vSphere Client accessible and responsive', note:'UI loads, inventory visible' },
            { cmd:'tail -100 /var/log/vmware/vpxd/vpxd.log', note:'No crash loops or repeated errors' }
        ]},
        8: { title:'Verify Snapshot Consolidation', steps:[
            { txt:'VM → Snapshot → Snapshot Manager', note:'No "Consolidate" warning; only one snapshot point or none' },
            { cmd:'ls /vmfs/volumes/<ds>/<vm>/', note:'No unexpected delta VMDK files' },
            { txt:'VM performance normal', note:'Disk I/O latency returned to baseline' }
        ]},
        9: { title:'Verify Maintenance Mode Exit', steps:[
            { cmd:'esxcli system maintenanceMode get', note:'Returns "Disabled" (not in maintenance mode)' },
            { txt:'Host shows normal status in vSphere Client', note:'Connected, not in maintenance' },
            { txt:'VMs can be powered on or migrated to this host', note:'DRS places workloads on host' }
        ]},
        10: { title:'Verify Alarm Normalization', steps:[
            { txt:'Triggered Alarms panel shows manageable count', note:'No alarm flood; only actionable alerts' },
            { txt:'Review alarm definitions', note:'Noisy alarms disabled or thresholds adjusted' },
            { txt:'Email/notification log', note:'Alert fatigue resolved; only critical notifications sent' }
        ]},

        /* ═══ Phase 2 ═══ */
        11: { title:'Verify Certificate Health', steps:[
            { cmd:'for i in $(/usr/lib/vmware-vmafd/bin/vecs-cli store list); do echo "--- $i ---"; /usr/lib/vmware-vmafd/bin/vecs-cli entry list --store $i --text | grep -A2 "Not After"; done', note:'No expired certificates' },
            { txt:'vSphere Client login works for all users', note:'SSO authentication functioning' },
            { cmd:'service-control --status', note:'All services running after cert renewal' }
        ]},
        12: { title:'Verify Patch Compliance', steps:[
            { txt:'Cluster → Updates → Hosts → Compliance', note:'All hosts show Compliant' },
            { cmd:'esxcli system version get', note:'Build number matches target patch level' },
            { txt:'Cluster health: HA, DRS operating normally post-patch', note:'No degraded cluster functions' }
        ]},
        13: { title:'Verify Backup Success', steps:[
            { txt:'VAMI → Backup → Activity', note:'Last backup shows Succeeded' },
            { txt:'Check backup target (FTP/SFTP/SMB)', note:'Backup files present with expected size' },
            { txt:'Schedule shows next run time', note:'Automated schedule configured' }
        ]},
        14: { title:'Verify Log Collection', steps:[
            { cmd:'ls -la /tmp/vm-support*.tgz', note:'Support bundle file exists with recent timestamp' },
            { txt:'Bundle contains relevant time period', note:'Logs cover the incident window' }
        ]},
        15: { title:'Verify SSH Hardening', steps:[
            { cmd:'esxcli system settings advanced list -o /UserVars/ESXiShellTimeOut', note:'Timeout value set (e.g., 900 seconds)' },
            { cmd:'esxcli system settings advanced list -o /Security/AccountLockFailures', note:'Lock policy configured (e.g., 5 attempts)' }
        ]},
        16: { title:'Verify SSO/AD Authentication', steps:[
            { txt:'Log in with AD domain credentials', note:'Login succeeds without errors' },
            { txt:'Administration → SSO → Identity Sources', note:'AD source shows Connected status' },
            { cmd:'ldapsearch -x -H ldap://<dc> -b "dc=domain,dc=com"', note:'LDAP bind successful from VCSA' }
        ]},
        17: { title:'Verify NTP Synchronization', steps:[
            { cmd:'esxcli system ntp get', note:'NTP enabled, servers configured, stratum reasonable' },
            { cmd:'date; ssh vcsa date', note:'Time difference between hosts and vCenter < 1 second' },
            { txt:'Kerberos/AD authentication working', note:'No time-related auth failures' }
        ]},
        18: { title:'Verify Syslog Forwarding', steps:[
            { cmd:'esxcli system syslog config get', note:'Remote loghost configured' },
            { txt:'Check remote syslog server for ESXi entries', note:'Logs arriving from all hosts' },
            { cmd:'esxcli system syslog reload', note:'Service reloaded without error' }
        ]},
        19: { title:'Verify Host Profile Compliance', steps:[
            { txt:'Host → Configure → Host Profile → Compliance', note:'Host shows Compliant' },
            { txt:'Compare host settings to reference profile', note:'No deviations detected' }
        ]},
        20: { title:'Verify Performance Data Collection', steps:[
            { cmd:'esxtop', note:'Displays real-time data across CPU/memory/network/disk views' },
            { txt:'vCenter → Monitor → Performance', note:'Real-time and historical charts populated' }
        ]},

        /* ═══ Phase 3 ═══ */
        21: { title:'Verify Admission Control', steps:[
            { txt:'VM powers on without admission control error', note:'Sufficient failover capacity' },
            { txt:'Cluster → Configure → vSphere HA → Admission Control', note:'Policy matches intended protection level' }
        ]},
        22: { title:'Verify HA Master', steps:[
            { txt:'Cluster → Monitor → vSphere HA', note:'Master host identified; all hosts protected' },
            { cmd:'cat /var/log/fdm.log | grep "elected"', note:'Clean master election in logs' }
        ]},
        23: { title:'Verify Heartbeat Datastores', steps:[
            { txt:'Cluster → Configure → vSphere HA → Heartbeat Datastores', note:'≥2 datastores selected' },
            { txt:'Cluster → Monitor → vSphere HA → Heartbeat', note:'All heartbeat datastores active' }
        ]},
        24: { title:'Verify FDM Agent', steps:[
            { cmd:'/etc/init.d/fdm status', note:'FDM service running' },
            { txt:'Host shows "Protected" in HA status', note:'Agent connected to HA master' },
            { cmd:'tail -50 /var/log/fdm.log', note:'No error or crash messages' }
        ]},
        25: { title:'Verify VMCP Configuration', steps:[
            { txt:'Cluster → Configure → vSphere HA → Failures and Responses → Datastore', note:'APD and PDL responses configured' }
        ]},
        26: { title:'Verify Fault Tolerance', steps:[
            { txt:'VM → Fault Tolerance → Status', note:'FT enabled; secondary running on different host' },
            { txt:'FT latency within acceptable range', note:'< 10ms FT logging latency' }
        ]},
        27: { title:'Verify Network Partition Resolved', steps:[
            { txt:'Cluster → Monitor → vSphere HA', note:'Single master; all hosts in same partition' },
            { cmd:'vmkping <all-host-mgmt-ips>', note:'All management IPs reachable from each host' }
        ]},
        28: { title:'Verify Proactive HA', steps:[
            { txt:'Cluster → Configure → vSphere DRS → Proactive HA', note:'Providers registered; automation level set' }
        ]},
        29: { title:'Verify Isolation Response', steps:[
            { txt:'Cluster → Configure → vSphere HA → Advanced Options', note:'das.isolationAddress configured' },
            { txt:'Test: isolate host temporarily', note:'VM behavior matches configured response' }
        ]},
        30: { title:'Verify Restart Priority', steps:[
            { txt:'Cluster → Configure → vSphere HA → VM Overrides', note:'Critical VMs set to Highest priority' },
            { txt:'Simulate failover (test)', note:'VMs restart in expected order' }
        ]},

        /* ═══ Phase 4 ═══ */
        31: { title:'Verify Affinity Rules', steps:[
            { txt:'Cluster → Configure → VM/Host Rules', note:'No conflicting must-rules; DRS faults cleared' },
            { txt:'DRS Monitor tab shows no faults', note:'All recommendations can be applied' }
        ]},
        32: { title:'Verify Resource Pools', steps:[
            { txt:'Resource pool tree shows flat or intentional hierarchy', note:'No trapped resources in deep nesting' },
            { txt:'VMs getting expected CPU/memory allocation', note:'esxtop shows no unexpected %RDY' }
        ]},
        33: { title:'Verify DRS Threshold', steps:[
            { txt:'Cluster → Configure → DRS → Automation', note:'Migration threshold at desired level' },
            { txt:'Monitor DRS migrations over 24h', note:'Migration frequency matches expectations' }
        ]},
        34: { title:'Verify EVC Mode', steps:[
            { txt:'Cluster → Configure → VMware EVC', note:'All hosts compatible with set baseline' },
            { txt:'vMotion between all host pairs succeeds', note:'No EVC compatibility errors' }
        ]},
        35: { title:'Verify VM-Host Rules', steps:[
            { txt:'VMs running on intended hosts', note:'Affinity rule being respected' },
            { txt:'HA can still failover VMs if rule is should-rule', note:'HA not blocked by affinity' }
        ]},
        36: { title:'Verify NUMA Optimization', steps:[
            { cmd:'esxtop → m view → check NUMA stats', note:'VM memory local to NUMA node (N%L high)' },
            { txt:'VM vCPU ≤ cores per NUMA node', note:'No cross-NUMA scheduling' }
        ]},
        37: { title:'Verify Memory Pressure Resolved', steps:[
            { cmd:'esxtop → m view', note:'MCTLSZ = 0 (no ballooning), SWCUR = 0 (no swap)' },
            { txt:'Cluster memory utilization < 80%', note:'Sufficient headroom for workloads' }
        ]},
        38: { title:'Verify Storage DRS', steps:[
            { txt:'Datastore Cluster → Monitor → Storage DRS', note:'Recommendations applying; space balanced' },
            { txt:'No datastore space alerts', note:'All datastores within threshold' }
        ]},
        39: { title:'Verify DRS Faults Cleared', steps:[
            { txt:'Cluster → Monitor → DRS → Faults', note:'No active DRS faults' },
            { txt:'DRS recommendations being applied', note:'Automation working as expected' }
        ]},
        40: { title:'Verify Latency Sensitivity', steps:[
            { txt:'VM → Edit Settings → Advanced → Latency Sensitivity', note:'Set to High' },
            { txt:'VM has full memory reservation', note:'Reservation = configured memory' },
            { txt:'Performance: low jitter observed', note:'Latency consistent under load' }
        ]},

        /* ═══ Phase 5 ═══ */
        41: { title:'Verify VCSA Disk Space', steps:[
            { cmd:'df -h', note:'All partitions below 80% usage' },
            { cmd:'service-control --status', note:'All services running' },
            { txt:'VAMI → Monitor → Disks', note:'No disk alarms' }
        ]},
        42: { title:'Verify vpxd Stability', steps:[
            { cmd:'service-control --status vpxd', note:'vpxd running' },
            { cmd:'tail -100 /var/log/vmware/vpxd/vpxd.log', note:'No crash loops' },
            { txt:'vSphere Client responsive', note:'Inventory loads, tasks complete' }
        ]},
        43: { title:'Verify Database Health', steps:[
            { cmd:'psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;" VCDB', note:'Connection count reasonable' },
            { txt:'vSphere Client → tasks complete quickly', note:'No timeouts' }
        ]},
        44: { title:'Verify STS Certificate', steps:[
            { cmd:'/usr/lib/vmware-vmafd/bin/dir-cli trustedcert list', note:'STS cert expiry > 1 year away' },
            { txt:'All SSO logins working', note:'No certificate-related errors' }
        ]},
        45: { title:'Verify Content Library', steps:[
            { txt:'Content Library → subscribed library → Last Sync', note:'Sync completed successfully, recent timestamp' }
        ]},
        46: { title:'Verify PSC Convergence', steps:[
            { cmd:'/usr/lib/vmware-vmdir/bin/vdcrepadmin -f showpartners', note:'Embedded replication healthy' },
            { txt:'All services registered in Lookup Service', note:'No stale external PSC entries' }
        ]},
        47: { title:'Verify VAMI Backup', steps:[
            { txt:'VAMI → Backup → Schedule', note:'Next backup scheduled' },
            { txt:'Last backup status: Succeeded', note:'Files on target with correct size' }
        ]},
        48: { title:'Verify Plugin Health', steps:[
            { txt:'vSphere Client loads without errors', note:'No blank pages or plugin exceptions' },
            { txt:'Extensions → all plugins show healthy', note:'MOB: ExtensionManager shows clean list' }
        ]},
        49: { title:'Verify Lookup Service', steps:[
            { cmd:'/usr/lib/vmware-lookupsvc/tools/lstool.py list --url https://localhost/lookupservice/sdk', note:'All services registered' },
            { txt:'SSO, vpxd, and other services communicating', note:'No registration errors in logs' }
        ]},
        50: { title:'Verify vCenter Sizing', steps:[
            { txt:'VAMI → Monitor → CPU/Memory', note:'Utilization within normal range for deployment size' },
            { txt:'vSphere Client response time acceptable', note:'Tasks complete within expected time' }
        ]},

        /* ═══ Phase 6 ═══ */
        51: { title:'Verify Datastore Unmount', steps:[
            { cmd:'esxcli storage filesystem list', note:'Datastore no longer listed on any host' },
            { txt:'No VMs referencing the old datastore', note:'Clean removal completed' }
        ]},
        52: { title:'Verify Storage Path Recovery', steps:[
            { cmd:'esxcli storage nmp path list', note:'All paths active; no dead paths' },
            { txt:'VMs operational; no paused or killed VMs', note:'VMCP response completed correctly' }
        ]},
        53: { title:'Verify Multipathing', steps:[
            { cmd:'esxcli storage nmp device list', note:'Correct PSP applied to all devices' },
            { cmd:'esxcli storage nmp path list', note:'Multiple active paths visible' }
        ]},
        54: { title:'Verify NFS Connectivity', steps:[
            { cmd:'esxcli storage nfs list', note:'NFS datastore mounted and accessible' },
            { cmd:'vmkping <nfs-server-ip>', note:'NFS server reachable from VMkernel' }
        ]},
        55: { title:'Verify VMFS Heap', steps:[
            { txt:'VMs power on without "Cannot open disk" errors', note:'Heap sufficient for open files' },
            { cmd:'vmkfstools -D /vmfs/volumes/<ds>/<vm>/<vmdk>', note:'File descriptor open without error' }
        ]},
        56: { title:'Verify Storage vMotion', steps:[
            { txt:'VM disks on target datastore', note:'Relocation completed' },
            { txt:'No consolidation warnings', note:'Clean disk state post-migration' }
        ]},
        57: { title:'Verify Space Reclamation', steps:[
            { cmd:'esxcli storage vmfs unmap -l <datastore>', note:'UNMAP issued without error' },
            { txt:'Array shows reclaimed free space', note:'Physical storage freed' }
        ]},
        58: { title:'Verify iSCSI/FC Paths', steps:[
            { cmd:'esxcli iscsi adapter list', note:'iSCSI adapter online' },
            { cmd:'esxcli storage core path list', note:'Paths active to storage targets' }
        ]},
        59: { title:'Verify VAAI Status', steps:[
            { cmd:'esxcli storage core device vaai status get -d <naa.id>', note:'VAAI primitives supported and enabled' }
        ]},
        60: { title:'Verify SDRS', steps:[
            { txt:'Datastore Cluster → space utilization balanced', note:'No overloaded datastores' },
            { txt:'SDRS recommendations applying', note:'Automation level set correctly' }
        ]},

        /* ═══ Phase 7 ═══ */
        61: { title:'Verify vDS Recovery', steps:[
            { txt:'Host shows Connected in vSphere Client', note:'Management network restored' },
            { cmd:'esxcli network vswitch dvs vmware list', note:'vDS port groups visible' }
        ]},
        62: { title:'Verify vMotion Network', steps:[
            { cmd:'vmkping -I <vmotion-vmk> <target-ip> -d -s 8972', note:'Jumbo ping succeeds' },
            { txt:'Test vMotion between hosts', note:'Migration completes successfully' }
        ]},
        63: { title:'Verify MTU Configuration', steps:[
            { cmd:'esxcli network vswitch dvs vmware list | grep MTU', note:'MTU 9000 on vDS' },
            { cmd:'vmkping -d -s 8972 -I vmk1 <target>', note:'Large packet ping succeeds end-to-end' }
        ]},
        64: { title:'Verify NIC Teaming', steps:[
            { txt:'Port group → Teaming and Failover', note:'Load balancing policy matches switch config' },
            { txt:'Disconnect one NIC; verify failover', note:'Traffic continues on remaining NIC' }
        ]},
        65: { title:'Verify VLAN Configuration', steps:[
            { txt:'VM can ping default gateway and other VMs on same VLAN', note:'Layer 2 connectivity confirmed' },
            { cmd:'esxcli network vswitch standard portgroup list', note:'Correct VLAN ID assigned' }
        ]},
        66: { title:'Verify vDS Migration', steps:[
            { txt:'All hosts showing connected; VMs communicating', note:'Migration to vDS successful' },
            { txt:'No vSS port groups remaining (unless intentional)', note:'Clean migration' }
        ]},
        67: { title:'Verify NIOC', steps:[
            { txt:'vDS → Configure → Resource Allocation', note:'Traffic types have correct shares/reservations' },
            { txt:'Under contention, priority traffic gets bandwidth', note:'NIOC functioning' }
        ]},
        68: { title:'Verify TCP/IP Stacks', steps:[
            { cmd:'esxcli network ip netstack list', note:'Custom stacks visible' },
            { cmd:'esxcli network ip route ipv4 list -N <stack>', note:'Correct routing for stack' }
        ]},
        69: { title:'Verify Firewall Rules', steps:[
            { cmd:'esxcli network firewall ruleset list', note:'Required rulesets enabled' },
            { txt:'Service connectivity works', note:'No firewall blocks' }
        ]},
        70: { title:'Verify SR-IOV', steps:[
            { txt:'VM → Edit Settings → Network adapter', note:'SR-IOV adapter assigned' },
            { cmd:'esxcli network sriovnic list', note:'Virtual Functions allocated' }
        ]}
    };

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !vfy[kbId]) return;
            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;
            var d = vfy[kbId];
            var html = '<div class="verify-section">';
            html += '<div class="section-label" style="margin-top:1.5rem;">Verify the Fix</div>';
            html += '<div class="vfy-title">' + d.title + '</div>';
            html += '<div class="vfy-steps">';
            d.steps.forEach(function (s, i) {
                html += '<div class="vfy-step">';
                html += '<span class="vfy-num">' + (i + 1) + '</span>';
                if (s.cmd) html += '<code class="vfy-cmd">' + s.cmd + '</code>';
                else html += '<span class="vfy-txt">' + s.txt + '</span>';
                html += '<span class="vfy-note">' + s.note + '</span>';
                html += '</div>';
            });
            html += '</div></div>';
            var section = document.createElement('div');
            section.innerHTML = html;
            body.appendChild(section);
        });
    });

    var style = document.createElement('style');
    style.textContent =
        '.vfy-title{font-size:0.82rem;font-weight:600;color:#e6edf3;margin:0.4rem 0;}' +
        '.vfy-steps{display:flex;flex-direction:column;gap:0.4rem;}' +
        '.vfy-step{display:flex;align-items:flex-start;gap:0.5rem;padding:0.5rem 0.6rem;border-radius:6px;background:rgba(22,27,34,0.5);border:1px solid #30363d;font-size:0.78rem;}' +
        '.vfy-step:hover{border-color:rgba(63,185,80,0.3);}' +
        '.vfy-num{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:800;background:rgba(63,185,80,0.1);color:#56d364;border:1px solid rgba(63,185,80,0.25);flex-shrink:0;}' +
        '.vfy-cmd{font-family:"JetBrains Mono",monospace;font-size:0.72rem;background:#0d1117;padding:0.2rem 0.5rem;border-radius:4px;color:#79c0ff;border:1px solid #21262d;word-break:break-all;flex:1;}' +
        '.vfy-txt{color:#e6edf3;font-weight:500;flex:1;}' +
        '.vfy-note{color:#8b949e;font-size:0.72rem;font-style:italic;flex:1;min-width:0;}' +
        '@media(max-width:600px){.vfy-step{flex-direction:column;gap:0.25rem;}.vfy-note{font-size:0.68rem;}}';
    document.head.appendChild(style);
})();
