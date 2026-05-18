/**
 * vSphere KB — Impact Timeline & Recovery Estimates
 * Auto-injects an "Impact & Recovery Timeline" section into each KB entry.
 * Include after kb-crossref.js and kb-refs.js in every phase HTML file.
 */
(function () {
    var data = {
        /* ═══ Phase 1 — Top 10 ═══ */
        1: {
            severity:'critical', detect:'0–5 min', impact:'VMs not restarted after host failure — application outage', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'Host failure detected; HA should trigger VM restart'},
                {t:'1–2 min',  d:'FDM master detects missing heartbeats from failed host'},
                {t:'5 min',    d:'Check fdm.log for failover decisions and any blocked VMs'},
                {t:'10 min',   d:'Verify HA enabled, admission control, isolation address, heartbeat DS'},
                {t:'15 min',   d:'Fix root cause: reconfigure HA on cluster if needed'},
                {t:'15–45 min',d:'VMs restart on surviving hosts; verify application recovery'}
            ]
        },
        2: {
            severity:'high', detect:'5–30 min', impact:'VMs concentrated on few hosts — performance degradation', rto:'15–30 min',
            steps:[
                {t:'0 min',    d:'Monitoring detects uneven CPU/memory distribution across hosts'},
                {t:'5 min',    d:'Check DRS automation level and migration threshold'},
                {t:'10 min',   d:'Review DRS faults, affinity rules, VM overrides'},
                {t:'15 min',   d:'Adjust threshold or remove conflicting rules'},
                {t:'15–30 min',d:'DRS runs and rebalances VMs across cluster'}
            ]
        },
        3: {
            severity:'critical', detect:'0–5 min', impact:'VM migration fails — maintenance or load balancing blocked', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'vMotion fails with timeout or error in vpxd.log'},
                {t:'5 min',    d:'Test vMotion VMkernel: vmkping -I vmkN -d -s 8972'},
                {t:'10 min',   d:'Check EVC mode, CPU compatibility, MTU, firewall ports'},
                {t:'15 min',   d:'Fix network or EVC issue; retry migration'},
                {t:'15–60 min',d:'vMotion succeeds; maintenance or DRS unblocked'}
            ]
        },
        4: {
            severity:'high', detect:'0–2 min', impact:'Host unmanaged — no DRS, HA protection, or monitoring', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'Host shows Disconnected/Not Responding in vCenter'},
                {t:'2 min',    d:'Verify management network connectivity from host console'},
                {t:'5 min',    d:'Restart vpxa: /etc/init.d/vpxa restart'},
                {t:'10 min',   d:'Check DNS, certificates, firewall (443/902)'},
                {t:'10–30 min',d:'Host reconnects; HA reconfigures, DRS resumes'}
            ]
        },
        5: {
            severity:'critical', detect:'Immediate', impact:'Host down — all VMs on host affected', rto:'30–120 min',
            steps:[
                {t:'0 min',    d:'Host crashes with Purple Screen of Death'},
                {t:'1 min',    d:'HA restarts VMs on other hosts (if HA enabled)'},
                {t:'5 min',    d:'Collect zdump/coredump from ESXi boot volume'},
                {t:'15 min',   d:'Analyze backtrace — match against VMware KB articles'},
                {t:'30 min',   d:'Update driver/firmware if known issue; reboot host'},
                {t:'30–120 min',d:'Host returns to cluster; monitor for recurrence'}
            ]
        },
        6: {
            severity:'high', detect:'Immediate', impact:'VM cannot start — application unavailable', rto:'5–20 min',
            steps:[
                {t:'0 min',    d:'Power-on fails with "Insufficient resources" error'},
                {t:'2 min',    d:'Check HA admission control, resource reservations'},
                {t:'5 min',    d:'Verify datastore space, swap file location, memory overhead'},
                {t:'10 min',   d:'Adjust admission control or free resources'},
                {t:'5–20 min', d:'VM powers on successfully'}
            ]
        },
        7: {
            severity:'critical', detect:'0–5 min', impact:'vCenter unavailable — no management plane', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'vCenter UI/API unreachable; vpxd service down'},
                {t:'2 min',    d:'SSH to VCSA; check disk space with df -h'},
                {t:'5 min',    d:'service-control --status; review vpxd.log'},
                {t:'10 min',   d:'Fix root cause: clear logs, fix certs, restart service'},
                {t:'15–60 min',d:'vpxd running; vCenter fully operational'}
            ]
        },
        8: {
            severity:'high', detect:'5–30 min', impact:'VM performance degraded; disk locked warnings', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'Consolidation needed warning appears on VM'},
                {t:'5 min',    d:'Check for active backups or snapshot operations'},
                {t:'10 min',   d:'Attempt consolidation via vSphere Client'},
                {t:'15 min',   d:'If locked, identify process holding lock; abort stale backup'},
                {t:'15–60 min',d:'Consolidation completes; VM runs on base disk'}
            ]
        },
        9: {
            severity:'high', detect:'Immediate', impact:'Host cannot be patched or evacuated', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'Enter maintenance mode hangs or fails'},
                {t:'2 min',    d:'Check for powered-off VMs, HA reconfiguration tasks'},
                {t:'5 min',    d:'Review DRS evacuation progress and resource constraints'},
                {t:'10 min',   d:'Manually migrate or power off blocking VMs'},
                {t:'10–30 min',d:'Host enters maintenance mode successfully'}
            ]
        },
        10: {
            severity:'medium', detect:'0–5 min', impact:'Alert fatigue — critical alarms may be missed', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'Hundreds of alarms firing simultaneously'},
                {t:'2 min',    d:'Identify the trigger: host failure, network event, or misconfigured alarm'},
                {t:'5 min',    d:'Reset triggered alarms; disable non-critical noisy alarms'},
                {t:'10 min',   d:'Review alarm definitions; add appropriate filters'},
                {t:'5–15 min', d:'Alarm noise reduced; monitoring returns to normal'}
            ]
        },

        /* ═══ Phase 2 — Day-2 Operations ═══ */
        11: {
            severity:'critical', detect:'0–5 min', impact:'All SSO-based logins fail — complete vCenter lockout', rto:'30–90 min',
            steps:[
                {t:'0 min',    d:'Login to vSphere Client fails with SSO error'},
                {t:'5 min',    d:'SSH to VCSA; check STS cert expiry: dir-cli trustedcert list'},
                {t:'10 min',   d:'Run certificate-manager or fixsts.sh to renew STS cert'},
                {t:'30 min',   d:'Restart all vCenter services'},
                {t:'30–90 min',d:'SSO logins restored; verify all solution user certs'}
            ]
        },
        12: { severity:'medium', detect:'N/A', impact:'Patching delayed — security exposure', rto:'30–120 min',
            steps:[
                {t:'0 min',    d:'Plan: create cluster image with desired ESXi build + firmware'},
                {t:'10 min',   d:'Check compliance; identify non-compliant hosts'},
                {t:'20 min',   d:'Pre-check: VIB conflicts, boot device space, HA admission'},
                {t:'30 min',   d:'Remediate hosts in rolling fashion (one at a time)'},
                {t:'30–120 min',d:'All hosts patched and compliant; verify cluster health'}
            ]
        },
        13: { severity:'medium', detect:'N/A', impact:'No vCenter backup — risk of total loss', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'Configure backup schedule in VAMI (port 5480)'},
                {t:'5 min',    d:'Select protocol: FTP/SFTP/SMB; test connectivity'},
                {t:'10 min',   d:'Run manual backup to verify success'},
                {t:'10–30 min',d:'Schedule daily backup; set retention policy'}
            ]
        },
        14: { severity:'medium', detect:'N/A', impact:'Delayed troubleshooting without proper logs', rto:'5–30 min',
            steps:[
                {t:'0 min',    d:'Issue occurs — need to collect diagnostic bundle'},
                {t:'2 min',    d:'ESXi: vm-support; vCenter: vc-support'},
                {t:'5 min',    d:'Download bundle; identify key logs: vpxd, hostd, vmkernel, fdm'},
                {t:'5–30 min', d:'Analyze logs; correlate timestamps with event'}
            ]
        },
        15: { severity:'medium', detect:'N/A', impact:'Security hardening — reduce attack surface', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'Configure idle timeout: UserVars.ESXiShellTimeOut'},
                {t:'2 min',    d:'Set account lockout: Security.AccountLockFailures'},
                {t:'5 min',    d:'Enable/disable SSH as needed; suppress warning if authorized'},
                {t:'5–15 min', d:'Verify host profile compliance with security baseline'}
            ]
        },
        16: {
            severity:'high', detect:'0–5 min', impact:'Users cannot log in — AD/LDAP auth broken', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'AD/LDAP authentication fails for all domain users'},
                {t:'5 min',    d:'Test AD DC connectivity from VCSA: nslookup, ldapsearch'},
                {t:'10 min',   d:'Check bind account credentials, password expiry'},
                {t:'15 min',   d:'Re-configure identity source or update bind password'},
                {t:'15–45 min',d:'AD authentication restored; verify user group mappings'}
            ]
        },
        17: {
            severity:'high', detect:'5–30 min', impact:'Certificate failures, Kerberos auth breaks at >5 min drift', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'Time drift detected on one or more hosts'},
                {t:'5 min',    d:'Check: esxcli system ntp get; compare with vCenter time'},
                {t:'10 min',   d:'Configure NTP: esxcli system ntp set -e true -s pool.ntp.org'},
                {t:'10–20 min',d:'Time synchronized; verify cert validation and AD auth work'}
            ]
        },
        18: { severity:'medium', detect:'N/A', impact:'No centralized logging', rto:'5–10 min',
            steps:[
                {t:'0 min',    d:'Configure syslog forwarding on ESXi hosts'},
                {t:'2 min',    d:'esxcli system syslog config set --loghost=udp://syslog:514'},
                {t:'5 min',    d:'Verify logs appearing on remote syslog server'},
                {t:'5–10 min', d:'Configure VCSA forwarding in VAMI'}
            ]
        },
        19: { severity:'medium', detect:'5–30 min', impact:'Host configuration drift — inconsistency risk', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'Host profile compliance check shows drift'},
                {t:'5 min',    d:'Review non-compliant settings in profile comparison'},
                {t:'10 min',   d:'Handle answer file prompts for host-specific values'},
                {t:'15 min',   d:'Remediate host; may require maintenance mode'},
                {t:'15–45 min',d:'Host compliant with reference profile'}
            ]
        },
        20: { severity:'medium', detect:'N/A', impact:'Performance visibility — enables troubleshooting', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'Launch esxtop on ESXi host via SSH'},
                {t:'2 min',    d:'Switch views: c (CPU), m (memory), n (network), d (disk)'},
                {t:'5 min',    d:'Identify key metrics: %RDY, %CSTP, KAVG, GAVG, SWCUR'},
                {t:'5–15 min', d:'Correlate findings with VM performance complaints'}
            ]
        },

        /* ═══ Phase 3 — HA & FT ═══ */
        21: { severity:'high', detect:'Immediate', impact:'VM power-on blocked — HA admission control', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'Power-on rejected by HA admission control'},
                {t:'2 min',    d:'Check current admission control policy and failover capacity'},
                {t:'5 min',    d:'Adjust: lower host failures to tolerate or switch to percentage'},
                {t:'5–15 min', d:'VM powers on; verify HA still provides intended protection'}
            ]
        },
        22: { severity:'critical', detect:'0–2 min', impact:'Cluster unprotected — no HA master to coordinate', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'HA health shows no master; cluster unprotected'},
                {t:'2 min',    d:'Check fdm.log for election failures on each host'},
                {t:'5 min',    d:'Verify management network connectivity between all hosts'},
                {t:'10 min',   d:'Restart management agents; reconfigure HA on cluster'},
                {t:'10–30 min',d:'Master elected; HA protection restored'}
            ]
        },
        23: { severity:'high', detect:'5–15 min', impact:'HA relies on network heartbeat only — higher false-positive risk', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'HA warning: insufficient heartbeat datastores'},
                {t:'5 min',    d:'Check current heartbeat DS count (need ≥2)'},
                {t:'10 min',   d:'Add shared datastores or manually select heartbeat DS'},
                {t:'5–15 min', d:'HA heartbeat configuration verified'}
            ]
        },
        24: { severity:'high', detect:'0–5 min', impact:'Host HA agent unreachable — host may be unprotected', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'HA shows agent unreachable on host'},
                {t:'5 min',    d:'SSH to host; check /var/log/fdm.log'},
                {t:'10 min',   d:'Restart FDM: /etc/init.d/fdm restart'},
                {t:'15 min',   d:'If persistent, reconfigure HA on entire cluster'},
                {t:'10–30 min',d:'FDM agent running; host protected by HA'}
            ]
        },
        25: { severity:'medium', detect:'N/A', impact:'VMs unprotected against storage failures without VMCP', rto:'5–10 min',
            steps:[
                {t:'0 min',    d:'Configure VMCP in cluster HA settings'},
                {t:'2 min',    d:'Set APD response: Issue events, Power off & restart, or Disabled'},
                {t:'5 min',    d:'Set PDL response: Issue events, Power off & restart, or Disabled'},
                {t:'5–10 min', d:'VMCP active; VMs protected against APD/PDL conditions'}
            ]
        },
        26: { severity:'medium', detect:'N/A', impact:'FT provides zero-downtime protection', rto:'15–30 min',
            steps:[
                {t:'0 min',    d:'Configure FT on critical VM'},
                {t:'5 min',    d:'Verify requirements: FT logging network, compatible CPUs, no snapshots'},
                {t:'10 min',   d:'Enable FT; secondary VM created on another host'},
                {t:'15–30 min',d:'FT active; primary failure causes instant secondary takeover'}
            ]
        },
        27: { severity:'critical', detect:'0–2 min', impact:'Multiple HA masters — VMs may run on both partitions', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'Management network partitioned; multiple masters elected'},
                {t:'2 min',    d:'Identify partition boundary: check fdm.log for partition events'},
                {t:'5 min',    d:'Trace physical network: switches, VLANs, cables'},
                {t:'15 min',   d:'Restore network connectivity between partitions'},
                {t:'15–45 min',d:'Cluster reconverges; single master; verify no duplicate VMs'}
            ]
        },
        28: { severity:'medium', detect:'N/A', impact:'Automated evacuation before hardware failure', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'Configure Proactive HA health providers (IPMI/iLO/iDRAC)'},
                {t:'5 min',    d:'Set failure conditions and automation level'},
                {t:'10 min',   d:'Test with simulated sensor alert'},
                {t:'10–20 min',d:'Proactive HA active; DRS migrates VMs on health warning'}
            ]
        },
        29: { severity:'medium', detect:'N/A', impact:'Controls VM behavior on host isolation', rto:'5–10 min',
            steps:[
                {t:'0 min',    d:'Review isolation response setting in HA cluster'},
                {t:'2 min',    d:'Options: Power off, Shut down, Leave powered on'},
                {t:'5 min',    d:'Configure das.isolationAddress for custom ping targets'},
                {t:'5–10 min', d:'Isolation response configured; test with network disconnect'}
            ]
        },
        30: { severity:'medium', detect:'N/A', impact:'Controls VM restart order after failure', rto:'5–10 min',
            steps:[
                {t:'0 min',    d:'Set default restart priority for cluster'},
                {t:'2 min',    d:'Configure VM overrides for critical VMs (DCs, DBs first)'},
                {t:'5 min',    d:'Set readiness conditions: heartbeat, timeout, app monitoring'},
                {t:'5–10 min', d:'Priority order configured and tested'}
            ]
        },

        /* ═══ Phase 4 — DRS & Resources ═══ */
        31: { severity:'high', detect:'5–15 min', impact:'DRS cannot place VMs — rules deadlock', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'DRS faults indicate conflicting affinity rules'},
                {t:'5 min',    d:'List all VM-VM and VM-Host rules; identify conflicts'},
                {t:'10 min',   d:'Must-rules override should-rules; remove or relax conflicts'},
                {t:'10–20 min',d:'DRS operates normally; VMs placed correctly'}
            ]
        },
        32: { severity:'high', detect:'5–30 min', impact:'VMs starved — resources trapped in nested pools', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'VMs in child pools showing resource contention'},
                {t:'5 min',    d:'Review pool hierarchy; check reservations vs actual usage'},
                {t:'10 min',   d:'Flatten hierarchy; use shares instead of fixed reservations'},
                {t:'10–20 min',d:'Resource allocation corrected; VMs get fair share'}
            ]
        },
        33: { severity:'medium', detect:'N/A', impact:'Balance DRS aggression vs stability', rto:'5–10 min',
            steps:[
                {t:'0 min',    d:'Review DRS migration threshold (1=aggressive, 5=conservative)'},
                {t:'2 min',    d:'Check recent DRS recommendations and applied migrations'},
                {t:'5 min',    d:'Adjust threshold based on workload requirements'},
                {t:'5–10 min', d:'DRS behavior tuned; monitor for 24h cycle'}
            ]
        },
        34: { severity:'high', detect:'Immediate', impact:'vMotion blocked — host incompatible with EVC', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'EVC error: CPU features not compatible with baseline'},
                {t:'5 min',    d:'Compare host CPU to cluster EVC mode in vSphere Client'},
                {t:'10 min',   d:'Lower EVC baseline or remove incompatible host'},
                {t:'10–30 min',d:'EVC consistent; vMotion unblocked'}
            ]
        },
        35: { severity:'medium', detect:'N/A', impact:'Pin VMs to hosts for licensing/compliance', rto:'5–10 min',
            steps:[
                {t:'0 min',    d:'Create VM group and Host group'},
                {t:'2 min',    d:'Create VM-Host affinity rule (must or should)'},
                {t:'5 min',    d:'Verify rule does not conflict with HA failover needs'},
                {t:'5–10 min', d:'Rule active; DRS respects placement constraints'}
            ]
        },
        36: { severity:'medium', detect:'5–30 min', impact:'VM performance degraded from remote NUMA access', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'VM showing high remote memory access in esxtop'},
                {t:'5 min',    d:'Check vCPU count vs cores per NUMA node'},
                {t:'10 min',   d:'Right-size VM or configure NUMA affinity'},
                {t:'10–20 min',d:'NUMA-optimal; VM performance improved'}
            ]
        },
        37: { severity:'high', detect:'5–15 min', impact:'VMs experiencing balloon/swap — severe latency', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'esxtop shows MCTLSZ (ballooning) or SWCUR (swap) > 0'},
                {t:'5 min',    d:'Identify which VMs are affected; check cluster memory utilization'},
                {t:'10 min',   d:'Options: add physical memory, reduce VM count, right-size VMs'},
                {t:'15–45 min',d:'Memory pressure relieved; balloon/swap returns to 0'}
            ]
        },
        38: { severity:'medium', detect:'5–30 min', impact:'Storage imbalanced — some datastores full', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'SDRS recommendation or datastore space alert'},
                {t:'5 min',    d:'Review datastore cluster settings: automation, thresholds'},
                {t:'10 min',   d:'Apply SDRS recommendations or manually Storage vMotion'},
                {t:'10–30 min',d:'Storage balanced; alerts cleared'}
            ]
        },
        39: { severity:'high', detect:'5–15 min', impact:'DRS not applying recommendations — cluster imbalanced', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'DRS faults in cluster Monitor tab'},
                {t:'5 min',    d:'Check VM overrides, resource constraints, vMotion errors'},
                {t:'10 min',   d:'Fix underlying constraint; clear VM-level overrides'},
                {t:'10–20 min',d:'DRS recommendations apply successfully'}
            ]
        },
        40: { severity:'medium', detect:'N/A', impact:'Optimizes for ultra-low-latency workloads', rto:'5–10 min',
            steps:[
                {t:'0 min',    d:'Set VM latency sensitivity to High'},
                {t:'2 min',    d:'Configure full memory reservation (required for High)'},
                {t:'5 min',    d:'Verify ballooning disabled for this VM'},
                {t:'5–10 min', d:'VM running with exclusive CPU/memory — minimal jitter'}
            ]
        },

        /* ═══ Phase 5 — vCenter & PSC ═══ */
        41: { severity:'critical', detect:'0–5 min', impact:'vCenter services stop — management unavailable', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'vCenter services stop; disk full alarm'},
                {t:'2 min',    d:'SSH to VCSA: df -h to identify full partitions'},
                {t:'5 min',    d:'Clean /storage/log, /storage/db temp files'},
                {t:'10 min',   d:'Expand disk via VAMI if needed'},
                {t:'15–45 min',d:'Services restarted; vCenter operational'}
            ]
        },
        42: { severity:'critical', detect:'0–5 min', impact:'vCenter down — no management plane', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'vpxd crash loop detected'},
                {t:'5 min',    d:'Check vpxd.log and vpxd-profiler.log for root cause'},
                {t:'10 min',   d:'Common: DB pool exhausted, plugin conflict, cert chain error'},
                {t:'15 min',   d:'Fix root cause; restart vpxd service'},
                {t:'15–60 min',d:'vpxd stable; monitor for recurrence'}
            ]
        },
        43: { severity:'high', detect:'5–30 min', impact:'Slow vCenter UI, timeouts, inventory issues', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'vSphere Client slow; tasks timing out'},
                {t:'5 min',    d:'Check DB: psql -U postgres VCDB; high connections, bloat'},
                {t:'10 min',   d:'Run VACUUM FULL ANALYZE on large tables'},
                {t:'15 min',   d:'Tune max_connections if needed'},
                {t:'15–60 min',d:'Database performance restored; UI responsive'}
            ]
        },
        44: { severity:'critical', detect:'0–5 min', impact:'SSO completely broken — all logins fail', rto:'30–90 min',
            steps:[
                {t:'0 min',    d:'STS signing certificate expired'},
                {t:'5 min',    d:'Verify: dir-cli trustedcert list (check expiry dates)'},
                {t:'10 min',   d:'Run fixsts.sh or certificate-manager to renew'},
                {t:'30 min',   d:'Restart all services: service-control --stop --all; --start --all'},
                {t:'30–90 min',d:'SSO logins working; verify solution user registrations'}
            ]
        },
        45: { severity:'medium', detect:'5–30 min', impact:'Template distribution blocked', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'Subscribed library shows sync failure'},
                {t:'5 min',    d:'Check HTTPS connectivity to publisher; verify proxy settings'},
                {t:'10 min',   d:'Update SSL thumbprint if publisher cert changed'},
                {t:'10–20 min',d:'Library sync completed successfully'}
            ]
        },
        46: { severity:'medium', detect:'N/A', impact:'Migrate from deprecated external PSC', rto:'30–60 min',
            steps:[
                {t:'0 min',    d:'Plan convergence: verify all services healthy'},
                {t:'10 min',   d:'Run cmsso-util unregister for decommission prep'},
                {t:'20 min',   d:'Execute converge-topology tool on VCSA'},
                {t:'30–60 min',d:'Embedded PSC active; decommission old external PSC'}
            ]
        },
        47: { severity:'medium', detect:'N/A', impact:'Automated backup provides recovery capability', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'Navigate to VAMI (https://vcsa:5480) → Backup'},
                {t:'5 min',    d:'Configure protocol (FTP/SFTP/SMB), location, credentials'},
                {t:'10 min',   d:'Run manual backup; verify file created on target'},
                {t:'10–30 min',d:'Schedule daily backup; set 5-day retention'}
            ]
        },
        48: { severity:'medium', detect:'5–30 min', impact:'UI slow or broken due to misbehaving plugin', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'vSphere Client slow, errors, or blank pages'},
                {t:'5 min',    d:'Check vsphere-ui logs for plugin errors'},
                {t:'10 min',   d:'Unregister broken plugin via MOB (https://vcsa/mob)'},
                {t:'10–20 min',d:'UI responsive; re-register plugin if fixed version available'}
            ]
        },
        49: { severity:'high', detect:'5–15 min', impact:'Services cannot discover each other — broken registration', rto:'15–30 min',
            steps:[
                {t:'0 min',    d:'Services failing to register or discover endpoints'},
                {t:'5 min',    d:'Check lstool.py list for stale registrations'},
                {t:'10 min',   d:'Re-register solution users; restart services'},
                {t:'15–30 min',d:'Lookup Service healthy; all services registered'}
            ]
        },
        50: { severity:'medium', detect:'N/A', impact:'Right-size VCSA for inventory scale', rto:'15–30 min',
            steps:[
                {t:'0 min',    d:'Review VCSA sizing: Tiny (10), Small (100), Medium (400), Large (2000) hosts'},
                {t:'5 min',    d:'Check current vCPU/RAM allocation vs recommended'},
                {t:'10 min',   d:'Resize VCSA VM if undersized; shutdown required'},
                {t:'15–30 min',d:'VCSA running at correct size; UI performance improved'}
            ]
        },

        /* ═══ Phase 6 — Storage ═══ */
        51: { severity:'high', detect:'Immediate', impact:'Cannot remove stale datastore', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'Unmount fails — active I/O or HA heartbeat on datastore'},
                {t:'5 min',    d:'Evacuate VMs; remove HA heartbeat designation'},
                {t:'10 min',   d:'esxcli storage filesystem unmount on all hosts'},
                {t:'10–30 min',d:'Datastore unmounted and detached from all hosts'}
            ]
        },
        52: { severity:'critical', detect:'0–5 min', impact:'VMs paused or killed depending on policy', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'Storage path failure: APD (temporary) or PDL (permanent)'},
                {t:'2 min',    d:'Check esxcli storage nmp path list for dead paths'},
                {t:'5 min',    d:'APD: wait 140s for auto-recovery; PDL: storage team engagement'},
                {t:'15 min',   d:'VMCP policy triggers configured response'},
                {t:'15–60 min',d:'Storage restored; VMs recovered per VMCP policy'}
            ]
        },
        53: { severity:'medium', detect:'N/A', impact:'Optimize storage path selection', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'Review current PSP: Fixed, MRU, or Round Robin'},
                {t:'2 min',    d:'Round Robin for active-active; Fixed for active-passive'},
                {t:'5 min',    d:'Change PSP: esxcli storage nmp satp rule add'},
                {t:'5–15 min', d:'Path policy active; I/O distributed optimally'}
            ]
        },
        54: { severity:'high', detect:'0–5 min', impact:'NFS datastore unavailable — VMs paused', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'NFS datastore shows inaccessible'},
                {t:'2 min',    d:'Test: vmkping NFS-server-IP from VMkernel'},
                {t:'5 min',    d:'Check exports, permissions, NFS VMkernel tag'},
                {t:'10 min',   d:'Fix connectivity or NFS server issue'},
                {t:'10–30 min',d:'NFS datastore accessible; VMs resume'}
            ]
        },
        55: { severity:'critical', detect:'5–15 min', impact:'Cannot open disk errors — VMs may not start', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'Errors: "Cannot open disk" or "Failed to lock file"'},
                {t:'5 min',    d:'Check MaxHeapSizeMB; review active VMDKs count'},
                {t:'10 min',   d:'Consolidate datastores; reduce open file count'},
                {t:'15 min',   d:'Increase heap if within safe limits'},
                {t:'15–60 min',d:'Heap pressure relieved; VMs operational'}
            ]
        },
        56: { severity:'high', detect:'0–5 min', impact:'VM disk migration fails — blocks maintenance', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'Storage vMotion fails mid-transfer'},
                {t:'5 min',    d:'Check vpxd.log for relocate errors'},
                {t:'10 min',   d:'Verify: no snapshots, 2x free space on target, no locks'},
                {t:'15 min',   d:'Consolidate snapshots first; retry migration'},
                {t:'15–60 min',d:'VM disks relocated successfully'}
            ]
        },
        57: { severity:'medium', detect:'N/A', impact:'Reclaim space from thin-provisioned disks', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'Thin disks growing but not shrinking after deletions'},
                {t:'2 min',    d:'Check VAAI UNMAP support on storage array'},
                {t:'5 min',    d:'Enable automated UNMAP (vSphere 6.5+)'},
                {t:'5–15 min', d:'Space reclaimed; datastore utilization accurate'}
            ]
        },
        58: { severity:'medium', detect:'N/A', impact:'Storage connectivity for iSCSI/FC', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'Configure software iSCSI or verify FC HBA'},
                {t:'5 min',    d:'esxcli iscsi adapter list; esxcli storage san fc list'},
                {t:'10 min',   d:'Configure targets, CHAP, zoning as needed'},
                {t:'10–30 min',d:'Storage connectivity verified; rescan completed'}
            ]
        },
        59: { severity:'medium', detect:'N/A', impact:'Offload storage operations to array', rto:'5–10 min',
            steps:[
                {t:'0 min',    d:'Verify VAAI support: ATS, Clone Blocks, Zero Blocks, UNMAP'},
                {t:'2 min',    d:'Check per-device VAAI status'},
                {t:'5 min',    d:'Enable VAAI if disabled; verify array firmware supports it'},
                {t:'5–10 min', d:'VAAI active; clone/zero/lock operations offloaded'}
            ]
        },
        60: { severity:'medium', detect:'5–30 min', impact:'Storage load unbalanced across datastores', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'SDRS recommendations pending or not applying'},
                {t:'5 min',    d:'Check SDRS automation level and affinity rules'},
                {t:'10 min',   d:'Adjust thresholds; resolve anti-affinity blocks'},
                {t:'10–20 min',d:'SDRS balancing storage load across datastore cluster'}
            ]
        },

        /* ═══ Phase 7 — Networking ═══ */
        61: { severity:'critical', detect:'0–2 min', impact:'Host unreachable — management network lost', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'Host disconnected after vDS change'},
                {t:'2 min',    d:'Access host via DCUI or direct console'},
                {t:'5 min',    d:'Restore vSS with esxcli network vswitch standard'},
                {t:'10 min',   d:'Migrate management VMkernel back to vSS'},
                {t:'15–45 min',d:'Host reconnected; carefully re-plan vDS migration'}
            ]
        },
        62: { severity:'high', detect:'0–5 min', impact:'vMotion fails — DRS and maintenance blocked', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'vMotion fails; check vmkernel interface'},
                {t:'5 min',    d:'Verify vMotion tag on VMkernel; test vmkping -d -s 8972'},
                {t:'10 min',   d:'Fix VLAN, MTU, or firewall blocking vMotion traffic'},
                {t:'10–30 min',d:'vMotion network operational; migrations succeed'}
            ]
        },
        63: { severity:'high', detect:'5–15 min', impact:'Packet drops, vMotion fails at 32%', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'Large packets dropped; vMotion stalls'},
                {t:'5 min',    d:'Test: vmkping -d -s 8972 -I vmkN'},
                {t:'10 min',   d:'Set MTU 9000 on vmk, vDS/vSS, and physical switch'},
                {t:'10–20 min',d:'MTU consistent end-to-end; jumbo frames working'}
            ]
        },
        64: { severity:'medium', detect:'5–30 min', impact:'Uneven traffic or failover gaps', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'Review NIC teaming policy on port group'},
                {t:'2 min',    d:'IP hash requires LAG on switch; physical NIC for most setups'},
                {t:'5 min',    d:'Set appropriate load balancing and failover order'},
                {t:'5–15 min', d:'Teaming policy optimal; verify failover test'}
            ]
        },
        65: { severity:'high', detect:'0–5 min', impact:'VMs cannot communicate — wrong VLAN', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'VM network connectivity lost'},
                {t:'2 min',    d:'Check port group VLAN ID: 0 (none), 1-4094 (specific), 4095 (trunk)'},
                {t:'5 min',    d:'Match with physical switch access/trunk port config'},
                {t:'5–15 min', d:'VLAN corrected; VM connectivity restored'}
            ]
        },
        66: { severity:'medium', detect:'N/A', impact:'Controlled migration from vSS to vDS', rto:'30–60 min',
            steps:[
                {t:'0 min',    d:'Plan migration: map vSS port groups to vDS port groups'},
                {t:'10 min',   d:'Migrate one NIC at a time; keep one on vSS as fallback'},
                {t:'20 min',   d:'Verify connectivity after first NIC migration'},
                {t:'30–60 min',d:'All NICs on vDS; vSS removed; verify all services'}
            ]
        },
        67: { severity:'medium', detect:'N/A', impact:'Prioritize network traffic types', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'Configure NIOC on distributed switch'},
                {t:'2 min',    d:'Set shares and reservations per traffic type'},
                {t:'5 min',    d:'Traffic types: vMotion, Management, VM, NFS, iSCSI'},
                {t:'5–15 min', d:'NIOC active; traffic prioritized under contention'}
            ]
        },
        68: { severity:'medium', detect:'N/A', impact:'Separate routing for vMotion, provisioning', rto:'5–15 min',
            steps:[
                {t:'0 min',    d:'Create custom TCP/IP stack for vMotion or provisioning'},
                {t:'2 min',    d:'Assign VMkernel adapter to custom stack'},
                {t:'5 min',    d:'Configure gateway and routing for stack'},
                {t:'5–15 min', d:'Traffic isolated to custom stack routing table'}
            ]
        },
        69: { severity:'medium', detect:'5–15 min', impact:'Services blocked by firewall rules', rto:'5–10 min',
            steps:[
                {t:'0 min',    d:'Service connectivity fails to ESXi host'},
                {t:'2 min',    d:'Check: esxcli network firewall ruleset list'},
                {t:'5 min',    d:'Enable required ruleset: esxcli network firewall ruleset set -e true -r name'},
                {t:'5–10 min', d:'Firewall rules updated; service connectivity restored'}
            ]
        },
        70: { severity:'medium', detect:'N/A', impact:'Maximum performance with DirectPath I/O', rto:'10–20 min',
            steps:[
                {t:'0 min',    d:'Configure SR-IOV on ESXi host'},
                {t:'5 min',    d:'Enable VT-d/AMD-Vi in BIOS; create Virtual Functions'},
                {t:'10 min',   d:'Assign VF to VM; note: no vMotion, no snapshots, no FT'},
                {t:'10–20 min',d:'VM using SR-IOV; near-native network performance'}
            ]
        },
        /* ═══ Phase 8 — Advanced & Extended ═══ */
        71: { severity:'high', detect:'1–24 hrs', impact:'vSphere+ cloud management plane lost; subscription license may warn', rto:'30–60 min',
            steps:[
                {t:'0 min',    d:'Cloud Console shows gateway "Disconnected"'},
                {t:'5 min',    d:'SSH to gateway; check proxy, DNS, connectivity to cloud endpoints'},
                {t:'15 min',   d:'Fix proxy/firewall; verify NTP sync'},
                {t:'30 min',   d:'Re-register gateway with new activation token if expired'},
                {t:'30–60 min',d:'Gateway reconnects; inventory syncs; subscription validated'}
            ]
        },
        72: { severity:'critical', detect:'0–5 min', impact:'Encrypted VMs cannot power on; potential permanent data loss if keys lost', rto:'30–90 min',
            steps:[
                {t:'0 min',    d:'Encrypted VM power-on fails with crypto error'},
                {t:'5 min',    d:'Check Key Provider status; verify KMS connectivity'},
                {t:'15 min',   d:'Re-establish KMS trust; renew STS certificate if expired'},
                {t:'30 min',   d:'Restore Native Key Provider from backup (.p12) if needed'},
                {t:'30–90 min',d:'Keys pushed to hosts; encrypted VMs power on successfully'}
            ]
        },
        73: { severity:'high', detect:'N/A', impact:'GPU-accelerated VMs unavailable; VDI/AI workloads impacted', rto:'20–60 min',
            steps:[
                {t:'0 min',    d:'VM fails to power on with GPU passthrough / vGPU error'},
                {t:'5 min',    d:'Verify IOMMU/VT-d enabled in BIOS'},
                {t:'15 min',   d:'Install/update NVIDIA vGPU Manager VIB; reboot host'},
                {t:'30 min',   d:'Assign vGPU profile to VM; set EFI firmware and memory reservation'},
                {t:'30–60 min',d:'Guest driver installed; GPU acceleration validated'}
            ]
        },
        74: { severity:'critical', detect:'0–2 min', impact:'Stateless hosts offline; cluster capacity reduced; all hosts at risk on reboot', rto:'30–90 min',
            steps:[
                {t:'0 min',    d:'Host fails PXE boot or boots unconfigured'},
                {t:'5 min',    d:'Check DHCP options 66/67; verify TFTP reachability'},
                {t:'15 min',   d:'Verify Auto Deploy (rbd) service running on vCenter'},
                {t:'30 min',   d:'Fix deploy rules; validate image profile and host profile'},
                {t:'30–90 min',d:'Host PXE boots successfully; joins cluster configured'}
            ]
        },
        75: { severity:'high', detect:'10–30 min', impact:'Hosts unpatched; known vulnerabilities remain; firmware drift', rto:'60–180 min',
            steps:[
                {t:'0 min',    d:'Cluster image compliance shows Non-Compliant'},
                {t:'10 min',   d:'Check depot sync status; verify proxy and URL accessibility'},
                {t:'20 min',   d:'Resolve VIB conflicts; reconnect Hardware Support Manager'},
                {t:'30 min',   d:'Stage image to hosts; verify boot device space'},
                {t:'60–180 min',d:'Sequential remediation completes; all hosts compliant'}
            ]
        },
        76: { severity:'high', detect:'5–60 min', impact:'DR readiness compromised; RPO violated; potential data loss in failover', rto:'60–240 min',
            steps:[
                {t:'0 min',    d:'RPO violation alert in vSphere Replication'},
                {t:'10 min',   d:'Check VR appliance health; verify bandwidth and latency'},
                {t:'30 min',   d:'Fix CBT resets; clear target datastore space'},
                {t:'60 min',   d:'Force full resync during off-peak window'},
                {t:'60–240 min',d:'Replication catches up; RPO within target; SRM plan validated'}
            ]
        },
        77: { severity:'critical', detect:'5–15 min', impact:'Kubernetes workloads cannot deploy; developer namespaces unavailable', rto:'30–120 min',
            steps:[
                {t:'0 min',    d:'Workload Management shows Error or supervisor VMs not deploying'},
                {t:'10 min',   d:'Check WCP service; review logs for networking/resource errors'},
                {t:'20 min',   d:'Validate NSX-T/HAProxy prerequisites; fix content library sync'},
                {t:'40 min',   d:'Ensure sufficient resources; re-enable Workload Management'},
                {t:'40–120 min',d:'Supervisor cluster running; TKC clusters provision successfully'}
            ]
        },
        78: { severity:'high', detect:'10–60 min', impact:'Cross-vCenter visibility lost; global permissions broken; SSO issues', rto:'30–60 min',
            steps:[
                {t:'0 min',    d:'Linked vCenter not visible in inventory'},
                {t:'10 min',   d:'Check vmdir replication status with vdcrepadmin'},
                {t:'20 min',   d:'Verify DNS (forward+reverse) and NTP between vCenters'},
                {t:'30 min',   d:'Clean stale lookup service entries; re-establish cert trust'},
                {t:'30–60 min',d:'Linked mode restored; both inventories visible; SSO working'}
            ]
        },
        79: { severity:'high', detect:'N/A', impact:'Without coredump config, PSOD root cause analysis is impossible', rto:'15–30 min',
            steps:[
                {t:'0 min',    d:'Review coredump configuration on host'},
                {t:'5 min',    d:'Configure coredump partition or file on VMFS'},
                {t:'10 min',   d:'Set up network dump collector on VCSA'},
                {t:'15 min',   d:'Test dump collector; validate with esxcli commands'},
                {t:'15–30 min',d:'Coredump configured; next PSOD will capture crash data for analysis'}
            ]
        },
        80: { severity:'medium', detect:'24–48 hrs', impact:'Proactive health insights lost; no early warning of vulnerabilities', rto:'15–30 min',
            steps:[
                {t:'0 min',    d:'Skyline Advisor shows no recent data'},
                {t:'5 min',    d:'Check collector connectivity and vCenter credentials'},
                {t:'10 min',   d:'Update proxy settings; fix disk space; renew certificates'},
                {t:'15 min',   d:'Force collection and upload cycle'},
                {t:'15–30 min',d:'Skyline data flowing; findings refreshed in Advisor portal'}
            ]
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !data[kbId]) return;
            var d = data[kbId];
            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;

            var sevColor = d.severity === 'critical' ? '#f85149' : d.severity === 'high' ? '#d29922' : '#3fb950';
            var html = '<div class="timeline-section">';
            html += '<div class="section-label" style="margin-top:1.5rem;">Impact & Recovery Timeline</div>';
            html += '<div class="tl-meta">';
            html += '<span class="tl-badge" style="border-color:' + sevColor + ';color:' + sevColor + ';">' + d.severity.toUpperCase() + '</span>';
            html += '<span class="tl-stat"><strong>Detect:</strong> ' + d.detect + '</span>';
            html += '<span class="tl-stat"><strong>RTO:</strong> ' + d.rto + '</span>';
            html += '</div>';
            html += '<div class="tl-impact">' + d.impact + '</div>';
            html += '<div class="tl-steps">';
            d.steps.forEach(function (s) {
                html += '<div class="tl-step"><span class="tl-time">' + s.t + '</span><span class="tl-desc">' + s.d + '</span></div>';
            });
            html += '</div></div>';
            var section = document.createElement('div');
            section.innerHTML = html;
            body.appendChild(section);
        });
    });

    var style = document.createElement('style');
    style.textContent =
        '.tl-meta{display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-top:0.5rem;}' +
        '.tl-badge{font-size:0.68rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:5px;border:1px solid;background:transparent;letter-spacing:0.3px;}' +
        '.tl-stat{font-size:0.78rem;color:#8b949e;}' +
        '.tl-stat strong{color:#e6edf3;}' +
        '.tl-impact{font-size:0.82rem;color:#d29922;margin:0.5rem 0 0.75rem;padding:0.5rem 0.75rem;background:rgba(210,153,34,0.06);border-left:2px solid rgba(210,153,34,0.3);border-radius:0 4px 4px 0;}' +
        '.tl-steps{display:flex;flex-direction:column;gap:0.3rem;}' +
        '.tl-step{display:flex;align-items:flex-start;gap:0.6rem;padding:0.4rem 0.6rem;border-radius:4px;font-size:0.78rem;border-left:2px solid #30363d;background:rgba(22,27,34,0.5);}' +
        '.tl-step:hover{background:rgba(22,27,34,0.8);border-left-color:#58a6ff;}' +
        '.tl-time{font-weight:700;color:#58a6ff;white-space:nowrap;min-width:65px;font-size:0.72rem;}' +
        '.tl-desc{color:#8b949e;}' +
        '@media(max-width:600px){.tl-step{flex-direction:column;gap:0.15rem;}.tl-time{min-width:auto;}}';
    document.head.appendChild(style);
})();
