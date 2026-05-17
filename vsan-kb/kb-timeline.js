/**
 * vSAN KB — Impact Timeline & Recovery Estimates
 * Auto-injects an "Impact & Recovery Timeline" section into each KB entry.
 * Shows: detection time, impact window, recovery steps timeline, total RTO.
 * Include after kb-crossref.js and kb-refs.js in every phase HTML file.
 */
(function () {

    // severity: critical|high|medium  —  used for color coding
    // detect: how long until the issue is noticed
    // impact: how long until data loss / service degradation if unresolved
    // rto: realistic recovery time objective (hands-on fix)
    // steps: ordered timeline steps [{t:time, d:description}]
    var data = {

        /* ═══════ PHASE 1 — Top 10 ═══════ */

        1: {
            severity:'critical', detect:'0–5 min', impact:'Immediate — VMs on affected disk group become inaccessible', rto:'30–90 min',
            steps:[
                {t:'0 min',    d:'vSAN Health alarm triggers — disk group marked ABSENT or DEGRADED'},
                {t:'1–2 min',  d:'CLOM detects missing components, starts 60-minute repair timer'},
                {t:'5 min',    d:'Admin alerted — check esxcli vsan storage list & vobd.log'},
                {t:'10 min',   d:'Identify root cause: SSD/HDD failure, controller reset, or cable'},
                {t:'15–30 min',d:'Replace failed hardware or reseat controller; re-add disk group'},
                {t:'30–90 min',d:'vSAN resync rebuilds missing components to restore FTT compliance'}
            ]
        },
        2: {
            severity:'critical', detect:'0–2 min', impact:'Cluster split — risk of data divergence & loss', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'CMMDS detects partition; health alarm fires immediately'},
                {t:'1 min',    d:'Objects may become inaccessible depending on partition size'},
                {t:'5 min',    d:'Identify partition via esxcli vsan cluster get — compare sub-cluster UUIDs'},
                {t:'10 min',   d:'Trace physical network path — check switch, NIC, cable, VLAN'},
                {t:'15–30 min',d:'Restore L2/L3 connectivity between all hosts'},
                {t:'30–60 min',d:'Cluster reconverges; stale components are reconciled automatically'}
            ]
        },
        3: {
            severity:'critical', detect:'0–5 min', impact:'VMs paused or unavailable — application outage', rto:'30 min – 4 hr',
            steps:[
                {t:'0 min',    d:'VM I/O stalls; vSphere Client shows objects as Inaccessible'},
                {t:'5 min',    d:'Run esxcli vsan debug object health summary — identify missing components'},
                {t:'10 min',   d:'Determine root cause: host failure, disk failure, or network partition'},
                {t:'15 min',   d:'If host/disk recoverable — bring back online; if permanent failure — wait for CLOM repair'},
                {t:'60 min',   d:'CLOM repair timer expires; automatic rebuild begins'},
                {t:'1–4 hr',   d:'Resync completes — objects return to compliant state'}
            ]
        },
        4: {
            severity:'high', detect:'5–15 min', impact:'Cluster remains vulnerable — reduced fault tolerance', rto:'1–8 hr',
            steps:[
                {t:'0 min',    d:'Resync initiated after failure or maintenance but stalls at 0% or partial'},
                {t:'5 min',    d:'Check vSAN resync dashboard — note stalled component count'},
                {t:'15 min',   d:'Verify no bandwidth throttle: VSAN.ResyncThrottleThreshold setting'},
                {t:'30 min',   d:'Check for congestion (esxtop VSCSI) blocking resync I/O'},
                {t:'1 hr',     d:'If disk is failing, replace and let CLOM re-create components'},
                {t:'1–8 hr',   d:'Resync completes after bottleneck removed — verify via health check'}
            ]
        },
        5: {
            severity:'high', detect:'Immediate', impact:'Host cannot contribute storage — reduced capacity & FTT', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'Host added to cluster but vSAN membership rejected'},
                {t:'2 min',    d:'Check vSAN health — look for network, time sync, or license errors'},
                {t:'5 min',    d:'Verify VMkernel adapter: correct vSAN tag, unique subnet, no multihoming'},
                {t:'10 min',   d:'Check firewall ports (2233, 12321) and NTP sync (< 1 min drift)'},
                {t:'15 min',   d:'Fix identified misconfiguration; host joins cluster'},
                {t:'15–45 min',d:'vSAN begins placing components on new host; rebalance may follow'}
            ]
        },
        6: {
            severity:'critical', detect:'0–1 min', impact:'Stretched cluster loses quorum — all objects on minority site go read-only or inaccessible', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'Witness unreachable; vSAN health alarm fires'},
                {t:'1 min',    d:'Objects lose quorum vote — behavior depends on site affinity rules'},
                {t:'5 min',    d:'Verify witness appliance: ping, SSH, check vsanmgmtd service'},
                {t:'10 min',   d:'If witness VM crashed — restart from host client or redeploy'},
                {t:'15 min',   d:'Restore witness network path and verify CMMDS convergence'},
                {t:'30–60 min',d:'Objects regain quorum; stretched cluster fully operational'}
            ]
        },
        7: {
            severity:'critical', detect:'0–5 min', impact:'Encrypted disk groups cannot unlock — VMs inaccessible', rto:'30–120 min',
            steps:[
                {t:'0 min',    d:'Host fails to unlock encrypted disks during boot or rekey'},
                {t:'5 min',    d:'Check KMS connectivity from each host (port 5696 KMIP)'},
                {t:'10 min',   d:'Verify STS token validity and KMS trust establishment'},
                {t:'20 min',   d:'If KMS unreachable — restore KMS server or failover to backup'},
                {t:'30 min',   d:'Re-establish trust; host unlocks disk groups'},
                {t:'60–120 min',d:'If deep rekey was interrupted — resume rekey operation and monitor resync'}
            ]
        },
        8: {
            severity:'high', detect:'5–30 min', impact:'VM latency increases — application SLA breached', rto:'30 min – 2 hr',
            steps:[
                {t:'0 min',    d:'Users report slow application response; monitoring triggers latency alert'},
                {t:'5 min',    d:'Open vSAN Performance Service — identify high-latency hosts/disks'},
                {t:'15 min',   d:'Run esxtop — check KAVG, DAVG, GAVG, congestion counters'},
                {t:'30 min',   d:'Isolate root cause: hot VM, failing disk, network, or capacity'},
                {t:'45 min',   d:'Apply fix: Storage vMotion hot VM, replace disk, or tune policy'},
                {t:'1–2 hr',   d:'Performance returns to baseline; verify via Performance Service'}
            ]
        },
        9: {
            severity:'high', detect:'Immediate', impact:'Cluster stuck at old version — missing security patches & features', rto:'2–8 hr',
            steps:[
                {t:'0 min',    d:'Upgrade pre-check fails or rolling upgrade halts mid-cluster'},
                {t:'10 min',   d:'Review pre-check report — identify blocking issues'},
                {t:'30 min',   d:'Resolve blockers: HCL violations, disk format, incompatible VIBs'},
                {t:'1 hr',     d:'Retry upgrade on blocked host — monitor vSAN health during rolling update'},
                {t:'2–6 hr',   d:'Complete rolling upgrade across all hosts (one at a time)'},
                {t:'6–8 hr',   d:'Upgrade on-disk format if needed; verify all health checks green'}
            ]
        },
        10: {
            severity:'high', detect:'Immediate', impact:'Host cannot be patched or serviced — blocks maintenance window', rto:'30 min – 4 hr',
            steps:[
                {t:'0 min',    d:'Enter maintenance mode stalls — evacuation percentage stuck'},
                {t:'5 min',    d:'Check vSAN data migration mode: Full / Ensure Accessibility / No Action'},
                {t:'10 min',   d:'If full evacuation, verify cluster has capacity for all components'},
                {t:'15 min',   d:'If blocked by non-compliant objects — switch to Ensure Accessibility'},
                {t:'30 min',   d:'If resync in progress — wait or cancel resync, then retry'},
                {t:'1–4 hr',   d:'Host enters maintenance; proceed with patching or hardware work'}
            ]
        },

        /* ═══════ PHASE 2 — Day-2 Operations ═══════ */

        11: {
            severity:'critical', detect:'0–2 min', impact:'ESA storage pool loses device — reduced capacity & RAID resilience', rto:'30–90 min',
            steps:[
                {t:'0 min',    d:'NVMe device disappears from ESA pool; health alarm fires'},
                {t:'2 min',    d:'Check dmesg and vmkernel.log for NVMe controller reset errors'},
                {t:'10 min',   d:'Verify firmware version against HCL; check physical seating'},
                {t:'20 min',   d:'If device recoverable — NVMe reset; if failed — initiate replacement'},
                {t:'30 min',   d:'Insert replacement NVMe; vSAN auto-claims into storage pool'},
                {t:'30–90 min',d:'Component rebuild completes; pool returns to full resilience'}
            ]
        },
        12: {
            severity:'high', detect:'5–15 min', impact:'NFS/SMB shares unavailable — file workloads interrupted', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'File service clients report mount failures or I/O errors'},
                {t:'5 min',    d:'Check File Service Domain health in vSphere Client'},
                {t:'10 min',   d:'Verify agent VMs are running; check DNS and network config'},
                {t:'15 min',   d:'If agent VM crashed — restart; if DNS wrong — correct and redeploy'},
                {t:'30 min',   d:'File service domain stabilizes; re-mount shares from clients'},
                {t:'60 min',   d:'Verify all shares accessible; check data integrity'}
            ]
        },
        13: {
            severity:'medium', detect:'N/A (config task)', impact:'Remote datastore mount fails — workloads cannot use shared capacity', rto:'30–60 min',
            steps:[
                {t:'0 min',    d:'HCI Mesh mount operation initiated'},
                {t:'5 min',    d:'If mount fails — check network connectivity between clusters'},
                {t:'10 min',   d:'Verify vSAN version compatibility and license requirements'},
                {t:'15 min',   d:'Ensure no existing mount conflicts or stale entries'},
                {t:'30 min',   d:'Re-attempt mount; verify datastore visible on consumer cluster'},
                {t:'60 min',   d:'Workloads deployed on remote datastore; monitor latency'}
            ]
        },
        14: {
            severity:'high', detect:'N/A (planned)', impact:'During deep rekey — elevated I/O latency from full data rewrite', rto:'2–48 hr',
            steps:[
                {t:'0 min',    d:'Key rotation initiated (shallow = KEK only, deep = full DEK rewrite)'},
                {t:'5 min',    d:'Shallow rekey completes almost instantly — verify in KMS audit log'},
                {t:'If deep',  d:'Full disk rewrite begins — significant I/O and capacity overhead'},
                {t:'1–24 hr',  d:'Monitor resync progress; do not initiate other maintenance'},
                {t:'24–48 hr', d:'Deep rekey completes on large clusters; verify all disk groups'},
                {t:'Post',     d:'Confirm new DEKs active; old keys can be retired from KMS'}
            ]
        },
        15: {
            severity:'medium', detect:'Passive (advisory)', impact:'Unaddressed alerts may indicate developing hardware or config issues', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'Skyline Health alert appears in vSphere Client or Skyline Advisor'},
                {t:'5 min',    d:'Review finding details — severity, affected component, recommendation'},
                {t:'10 min',   d:'Cross-reference with vSAN health checks and recent changes'},
                {t:'15 min',   d:'Apply recommended remediation (KB article, config change, patch)'},
                {t:'30 min',   d:'Re-run health check to verify alert clears'},
                {t:'60 min',   d:'If false positive — silence with documented justification'}
            ]
        },
        16: {
            severity:'medium', detect:'5–30 min', impact:'Unexpected space consumption or performance impact during destage', rto:'1–4 hr',
            steps:[
                {t:'0 min',    d:'Dedup/compression ratios lower than expected or destage latency spikes'},
                {t:'15 min',   d:'Check cluster-level dedup/compression savings in vSphere Client'},
                {t:'30 min',   d:'Analyze workload characteristics — random vs sequential, block size'},
                {t:'1 hr',     d:'If OSA: check cache tier health and destage rates via esxtop'},
                {t:'2 hr',     d:'Adjust expectations based on workload; consider ESA for better inline dedup'},
                {t:'4 hr',     d:'Stabilize; document actual savings ratios for capacity planning'}
            ]
        },
        17: {
            severity:'critical', detect:'0–5 min', impact:'VMs may pause / stall — no new writes accepted above 95%', rto:'30 min – 4 hr',
            steps:[
                {t:'0 min',    d:'Capacity alarm: datastore ≥80% warning, ≥94% critical'},
                {t:'5 min',    d:'Identify largest consumers: snapshots, swap files, thick disks'},
                {t:'15 min',   d:'Emergency: delete stale snapshots, remove orphaned VMDKs'},
                {t:'30 min',   d:'Storage vMotion VMs to other datastores if available'},
                {t:'1 hr',     d:'Enable TRIM/UNMAP to reclaim deleted blocks'},
                {t:'2–4 hr',   d:'Add hosts/disks to expand capacity; resync redistributes objects'}
            ]
        },
        18: {
            severity:'medium', detect:'Immediate', impact:'Host stuck in non-compliant state — blocks further updates', rto:'1–4 hr',
            steps:[
                {t:'0 min',    d:'vLCM remediation fails — host shows non-compliant image'},
                {t:'10 min',   d:'Review remediation logs in vLCM and esxupdate.log on host'},
                {t:'20 min',   d:'Identify blocker: incompatible VIB, driver conflict, or staging error'},
                {t:'30 min',   d:'Remove conflicting VIBs or update image depot'},
                {t:'1 hr',     d:'Retry remediation; host enters maintenance, updates, reboots'},
                {t:'2–4 hr',   d:'Complete rolling update across cluster; verify health green'}
            ]
        },
        19: {
            severity:'high', detect:'5–15 min', impact:'VMs show non-compliant policy — reduced protection or wrong config', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'SPBM compliance check shows non-compliant for one or more VMs'},
                {t:'5 min',    d:'Review policy details: FTT, FTM, stripe width, site affinity'},
                {t:'10 min',   d:'Check if cluster topology supports the assigned policy'},
                {t:'15 min',   d:'Edit policy to match available resources, or add hosts/fault domains'},
                {t:'30 min',   d:'Reapply policy; vSAN begins reconfiguring objects'},
                {t:'30–60 min',d:'Objects reach compliant state; verify via health check'}
            ]
        },
        20: {
            severity:'medium', detect:'5–10 min', impact:'Physical workloads lose block storage access', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'iSCSI initiator reports target unreachable or LUN path down'},
                {t:'5 min',    d:'Verify vSAN iSCSI target service is running on designated host'},
                {t:'10 min',   d:'Check iSCSI network binding and CHAP authentication config'},
                {t:'15 min',   d:'If target host failed — service floats to another host; verify IP'},
                {t:'20 min',   d:'Reconnect initiator to new target IP; verify LUN access'},
                {t:'30–45 min',d:'Restore multipath if configured; verify I/O from physical server'}
            ]
        },

        /* ═══════ PHASE 3 — DR & Data Protection ═══════ */

        21: {
            severity:'critical', detect:'0 min (host down)', impact:'Host offline — VMs lost, objects degraded', rto:'30 min – 2 hr',
            steps:[
                {t:'0 min',    d:'ESXi PSOD — host crashes with purple diagnostic screen'},
                {t:'1 min',    d:'vSphere HA restarts VMs on surviving hosts (if capacity exists)'},
                {t:'5 min',    d:'Collect vmkernel-zdump from crashed host (coredump partition)'},
                {t:'15 min',   d:'Analyze backtrace — identify faulting module / driver'},
                {t:'30 min',   d:'Cross-reference with VMware KB for known PSOD issues'},
                {t:'1–2 hr',   d:'Apply fix (driver update, patch); host rejoins; resync completes'}
            ]
        },
        22: {
            severity:'high', detect:'15–60 min', impact:'Snapshot chain consuming capacity; consolidation may cause long stun', rto:'1–8 hr',
            steps:[
                {t:'0 min',    d:'Discovery: large snapshot chains found during audit or capacity alert'},
                {t:'15 min',   d:'Inventory all snapshots: age, size, parent VM, backup integration'},
                {t:'30 min',   d:'Delete/consolidate snapshots during maintenance window'},
                {t:'1–2 hr',   d:'Monitor consolidation I/O — VMs may experience brief stun'},
                {t:'2–6 hr',   d:'Large delta disks merge into base; verify no orphans remain'},
                {t:'8 hr',     d:'Capacity reclaimed; implement snapshot age policy and monitoring'}
            ]
        },
        23: {
            severity:'critical', detect:'0–1 min', impact:'Entire site down — VMs failover or become unavailable depending on affinity', rto:'5 min – 2 hr',
            steps:[
                {t:'0 min',    d:'Preferred or secondary site loses all connectivity'},
                {t:'1 min',    d:'Witness + surviving site form majority — objects accessible there'},
                {t:'5 min',    d:'HA restarts affected VMs on surviving site (if resources exist)'},
                {t:'15 min',   d:'Verify all critical VMs running; check witness health'},
                {t:'30–60 min',d:'Failed site recovers; hosts rejoin cluster'},
                {t:'1–2 hr',   d:'Full resync between sites; stretched cluster fully operational'}
            ]
        },
        24: {
            severity:'medium', detect:'N/A (config)', impact:'Incorrect snapshot config can cause unexpected behavior', rto:'15–30 min',
            steps:[
                {t:'0 min',    d:'Native snapshot operation initiated on ESA cluster'},
                {t:'2 min',    d:'If failure — check VM compatibility (CBT, change block tracking)'},
                {t:'5 min',    d:'Verify ESA cluster is vSAN 8.0 U1+ with compatible storage policy'},
                {t:'10 min',   d:'Check snapshot tree depth limits and available capacity'},
                {t:'15 min',   d:'Reconfigure if needed; retry snapshot operation'},
                {t:'30 min',   d:'Snapshot completes; verify via vSphere Client snapshot manager'}
            ]
        },
        25: {
            severity:'critical', detect:'5–30 min', impact:'Silent data corruption if undetected — data loss risk', rto:'1–8 hr',
            steps:[
                {t:'0 min',    d:'vSAN health check reports checksum mismatch on components'},
                {t:'10 min',   d:'Identify affected objects and hosting disk/host'},
                {t:'20 min',   d:'vSAN auto-repairs from healthy mirror (if FTT > 0)'},
                {t:'30 min',   d:'If repair succeeds — monitor for recurring errors (failing disk)'},
                {t:'1 hr',     d:'If recurring — replace suspected disk; rebuild components'},
                {t:'2–8 hr',   d:'Full rebuild completes; run manual scrub to verify all objects'}
            ]
        },
        26: {
            severity:'critical', detect:'Immediate', impact:'No vCenter management — cluster runs headless', rto:'30 min – 2 hr',
            steps:[
                {t:'0 min',    d:'vCenter VM unavailable — cannot manage cluster via GUI'},
                {t:'5 min',    d:'Connect to ESXi host client directly (https://host-ip/ui)'},
                {t:'10 min',   d:'Browse vSAN datastore — locate vCenter VM files'},
                {t:'15 min',   d:'Re-register vCenter VM on a healthy host'},
                {t:'30 min',   d:'Power on vCenter; wait for services to initialize'},
                {t:'1–2 hr',   d:'If VM corrupted — deploy fresh VCSA and restore from backup'}
            ]
        },
        27: {
            severity:'high', detect:'0–2 min', impact:'Isolated host may power off VMs depending on response policy', rto:'5–30 min',
            steps:[
                {t:'0 min',    d:'Host loses all heartbeat and isolation addresses'},
                {t:'30 sec',   d:'HA declares host isolated; triggers configured response'},
                {t:'1 min',    d:'If response=powerOff — VMs shut down; HA restarts on other hosts'},
                {t:'5 min',    d:'Identify isolation cause: NIC failure, switch, upstream network'},
                {t:'15 min',   d:'Restore connectivity; host exits isolation state'},
                {t:'30 min',   d:'Verify all VMs running on correct hosts; review isolation policy'}
            ]
        },
        28: {
            severity:'medium', detect:'1–5 min', impact:'Premature vMotion of VMs may cause brief downtime', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'Hardware health provider triggers Proactive HA event'},
                {t:'1 min',    d:'DRS initiates vMotion of VMs off the flagged host'},
                {t:'5 min',    d:'Review sensor data — determine if reading is transient or real'},
                {t:'10 min',   d:'If false positive — tune provider sensitivity or silence alert'},
                {t:'15 min',   d:'If real hardware issue — schedule maintenance for affected host'},
                {t:'30 min',   d:'VMs rebalanced; Proactive HA configuration verified'}
            ]
        },
        29: {
            severity:'high', detect:'N/A (planned)', impact:'Incorrect sequence causes data loss or failed restart', rto:'30 min – 2 hr',
            steps:[
                {t:'Pre',      d:'Document host order, verify no active resync, snapshot vCenter'},
                {t:'0 min',    d:'Shut down all VMs gracefully; shut down vCenter last'},
                {t:'15 min',   d:'Power off ESXi hosts (no specific order needed for shutdown)'},
                {t:'Restart',  d:'Power on ALL hosts simultaneously or within a few minutes'},
                {t:'+10 min',  d:'Wait for vSAN cluster to form; do NOT power on VMs yet'},
                {t:'+20 min',  d:'Power on vCenter first; once up, verify health, then start VMs'}
            ]
        },
        30: {
            severity:'high', detect:'5–15 min', impact:'Objects violate FTT — reduced availability during failure', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'Health check shows objects non-compliant due to fault domain layout'},
                {t:'5 min',    d:'Review fault domain assignments in vSphere Client'},
                {t:'10 min',   d:'Identify misplaced hosts or uneven FD distribution'},
                {t:'15 min',   d:'Reassign hosts to correct fault domains'},
                {t:'30 min',   d:'vSAN reconfigures object placement to honor FD boundaries'},
                {t:'30–60 min',d:'All objects compliant; verify with health check'}
            ]
        },

        /* ═══════ PHASE 4 — VCF Integration ═══════ */

        31: {
            severity:'critical', detect:'Immediate', impact:'Management domain not deployed — entire VCF stack unavailable', rto:'2–8 hr',
            steps:[
                {t:'0 min',    d:'Cloud Builder or SDDC Manager reports bring-up failure'},
                {t:'15 min',   d:'Review bring-up logs: /var/log/vmware/vcf/bringup/'},
                {t:'30 min',   d:'Identify blocker: DNS, NTP, network pool, host preparation'},
                {t:'1 hr',     d:'Fix underlying issue (typically network or DNS misconfiguration)'},
                {t:'2 hr',     d:'Retry bring-up or resume from last checkpoint'},
                {t:'4–8 hr',   d:'Management domain fully deployed; validate all services'}
            ]
        },
        32: {
            severity:'medium', detect:'Immediate', impact:'Workload domain cannot scale — new VMs cannot be deployed', rto:'30 min – 2 hr',
            steps:[
                {t:'0 min',    d:'Host commission or domain expansion fails in SDDC Manager'},
                {t:'10 min',   d:'Check host preparation status and network pool assignment'},
                {t:'20 min',   d:'Verify HCL compliance and vSAN license availability'},
                {t:'30 min',   d:'Resolve issue; retry host commission'},
                {t:'1 hr',     d:'Host added successfully; vSAN claims disks'},
                {t:'1–2 hr',   d:'Rebalance completes; expanded capacity available'}
            ]
        },
        33: {
            severity:'high', detect:'Immediate', impact:'Cluster stuck at old version — security patches missing', rto:'2–6 hr',
            steps:[
                {t:'0 min',    d:'SDDC Manager bundle download or apply fails'},
                {t:'10 min',   d:'Check depot connectivity and bundle compatibility matrix'},
                {t:'20 min',   d:'Review SDDC Manager logs: /var/log/vmware/vcf/lcm/'},
                {t:'30 min',   d:'Fix depot access or download bundle manually'},
                {t:'1 hr',     d:'Run pre-check; resolve any blocking health issues'},
                {t:'2–6 hr',   d:'Apply update bundle; rolling upgrade across workload domain'}
            ]
        },
        34: {
            severity:'critical', detect:'0–5 min', impact:'vSAN storage traffic disrupted — VMs become unresponsive', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'NSX-T transport node config applied; vSAN traffic interrupted'},
                {t:'2 min',    d:'VMs report I/O errors; vSAN health shows network issues'},
                {t:'5 min',    d:'Identify VMkernel adapter conflict with NSX overlay'},
                {t:'10 min',   d:'Separate vSAN VMkernel from NSX transport zone'},
                {t:'15 min',   d:'Rollback NSX config if needed; restore vSAN connectivity'},
                {t:'30–45 min',d:'vSAN cluster reconverges; verify all objects accessible'}
            ]
        },
        35: {
            severity:'medium', detect:'N/A (config)', impact:'Incorrect config leads to split-brain risk in production', rto:'1–4 hr',
            steps:[
                {t:'0 min',    d:'Stretched cluster deployment initiated in SDDC Manager'},
                {t:'15 min',   d:'Validate network requirements: RTT ≤5ms, bandwidth, witness path'},
                {t:'30 min',   d:'If validation fails — fix network or witness placement'},
                {t:'1 hr',     d:'Configure site affinity rules and preferred site assignment'},
                {t:'2 hr',     d:'Deploy stretched cluster; verify witness connectivity'},
                {t:'4 hr',     d:'Test failover; validate HA behavior; document runbook'}
            ]
        },
        36: {
            severity:'medium', detect:'Immediate', impact:'Hosts non-compliant — blocks coordinated VCF updates', rto:'1–3 hr',
            steps:[
                {t:'0 min',    d:'vLCM image compliance check fails in VCF environment'},
                {t:'10 min',   d:'Compare desired image with host baseline in SDDC Manager'},
                {t:'20 min',   d:'Identify async patch or driver mismatch'},
                {t:'30 min',   d:'Update image or depot to include correct components'},
                {t:'1 hr',     d:'Remediate via SDDC Manager lifecycle workflow'},
                {t:'2–3 hr',   d:'All hosts compliant; VCF update workflow unblocked'}
            ]
        },
        37: {
            severity:'medium', detect:'15–60 min', impact:'Missing visibility — cannot proactively detect degradation', rto:'30–60 min',
            steps:[
                {t:'0 min',    d:'Aria Operations dashboards show stale or missing vSAN metrics'},
                {t:'10 min',   d:'Check Aria adapter for vSAN — connectivity and credentials'},
                {t:'20 min',   d:'Verify vSAN Performance Service is enabled on cluster'},
                {t:'30 min',   d:'Reconfigure adapter; force collection cycle'},
                {t:'45 min',   d:'Metrics populate; verify dashboards and alert rules'},
                {t:'60 min',   d:'Configure proactive alerts for key vSAN health metrics'}
            ]
        },
        38: {
            severity:'critical', detect:'0–5 min', impact:'Total management plane failure — vCenter, SDDC Manager, NSX all down', rto:'2–8 hr',
            steps:[
                {t:'0 min',    d:'Management domain vSAN failure detected; all management VMs affected'},
                {t:'5 min',    d:'Connect to ESXi host client directly for emergency access'},
                {t:'15 min',   d:'Assess vSAN health — determine if recoverable or needs rebuild'},
                {t:'30 min',   d:'Follow SDDC Manager recovery runbook precisely'},
                {t:'1–4 hr',   d:'Restore vCenter from backup; rebuild SDDC Manager if needed'},
                {t:'4–8 hr',   d:'Management domain restored; verify all workload domain connectivity'}
            ]
        },
        39: {
            severity:'medium', detect:'N/A (config)', impact:'Cross-domain capacity sharing fails — workloads cannot expand', rto:'30–60 min',
            steps:[
                {t:'0 min',    d:'HCI Mesh mount between VCF workload domains fails'},
                {t:'10 min',   d:'Verify network connectivity between domains'},
                {t:'15 min',   d:'Check SDDC Manager HCI Mesh prerequisites and licensing'},
                {t:'20 min',   d:'Ensure no firewall blocking cross-domain vSAN traffic'},
                {t:'30 min',   d:'Retry mount; verify datastore visible on consumer domain'},
                {t:'60 min',   d:'Deploy test workload; validate performance and latency'}
            ]
        },
        40: {
            severity:'critical', detect:'0–15 min', impact:'Encrypted disk groups cannot unlock after cert renewal', rto:'1–4 hr',
            steps:[
                {t:'0 min',    d:'Certificate rotation completed; vSAN encryption stops working'},
                {t:'10 min',   d:'Hosts report KMS trust failure with new certificates'},
                {t:'20 min',   d:'Re-establish KMS trust with renewed certificates'},
                {t:'30 min',   d:'Re-register key provider in vCenter'},
                {t:'1 hr',     d:'Verify all hosts can unlock disk groups'},
                {t:'2–4 hr',   d:'If deep rekey needed — initiate and monitor to completion'}
            ]
        },

        /* ═══════ PHASE 5 — ESA Deep Dive ═══════ */

        41: {
            severity:'medium', detect:'N/A (informational)', impact:'Wrong architecture choice affects long-term performance & cost', rto:'N/A',
            steps:[
                {t:'Planning',  d:'Evaluate workload profile: IOPS, throughput, capacity needs'},
                {t:'Assessment',d:'Check HCL for ESA-compatible NVMe devices (all-NVMe required)'},
                {t:'Comparison',d:'Review ESA benefits: single tier, native snapshots, inline dedup'},
                {t:'Decision',  d:'OSA for mixed media / budget; ESA for high performance & scale'},
                {t:'Migration', d:'If moving to ESA — plan new cluster + Storage vMotion migration'},
                {t:'Validation',d:'Run pilot workloads on ESA; validate performance before cutover'}
            ]
        },
        42: {
            severity:'critical', detect:'0–2 min', impact:'ESA pool loses device — rebuild starts immediately', rto:'30 min – 2 hr',
            steps:[
                {t:'0 min',    d:'NVMe device fails; ESA storage pool detects missing device'},
                {t:'1 min',    d:'Automatic rebuild begins using remaining devices in pool'},
                {t:'5 min',    d:'Check vmkernel.log for NVMe error details'},
                {t:'15 min',   d:'Hot-swap replacement NVMe drive (if supported by hardware)'},
                {t:'30 min',   d:'New device auto-claimed; pool rebalances'},
                {t:'1–2 hr',   d:'Full rebuild completes; pool back to designed resilience level'}
            ]
        },
        43: {
            severity:'medium', detect:'N/A (planned migration)', impact:'Extended maintenance window — VMs migrated between clusters', rto:'4–24 hr',
            steps:[
                {t:'Pre',      d:'Validate all NVMe hardware on HCL for ESA; check firmware'},
                {t:'0 min',    d:'Build new ESA cluster alongside existing OSA cluster'},
                {t:'1–2 hr',   d:'Configure ESA cluster: storage policies, networking, vSAN settings'},
                {t:'2–4 hr',   d:'Begin Storage vMotion migration of VMs from OSA to ESA'},
                {t:'4–20 hr',  d:'Migration continues — bandwidth limited by network and disk I/O'},
                {t:'20–24 hr', d:'All VMs migrated; decommission OSA cluster; reclaim hardware'}
            ]
        },
        44: {
            severity:'medium', detect:'N/A (design)', impact:'Wrong RAID policy wastes capacity or provides insufficient protection', rto:'N/A',
            steps:[
                {t:'Planning',  d:'Define FTT requirements based on failure domain count'},
                {t:'Design',    d:'RAID-5 (FTT=1): 33% overhead; RAID-6 (FTT=2): 50% overhead'},
                {t:'Compare',   d:'vs Mirroring: RAID-1 (FTT=1): 100% overhead — less efficient'},
                {t:'Test',      d:'Deploy test VMs with candidate policies; measure performance'},
                {t:'Apply',     d:'Assign final policy; vSAN creates objects with chosen RAID layout'},
                {t:'Monitor',   d:'Verify compliance and performance under production workloads'}
            ]
        },
        45: {
            severity:'medium', detect:'N/A (informational)', impact:'Legacy snapshot overhead eliminated with native snapshots', rto:'N/A',
            steps:[
                {t:'Benefit',   d:'ESA native snapshots avoid redo-log chain — no performance penalty'},
                {t:'Prereq',    d:'Requires vSAN 8.0 U1+ on ESA with compatible storage policy'},
                {t:'Create',    d:'Snapshot creation is near-instantaneous (metadata-only operation)'},
                {t:'Delete',    d:'Deletion is fast — no consolidation I/O required'},
                {t:'Integrate', d:'Works with backup solutions via VADP/CBT integration'},
                {t:'Monitor',   d:'Track snapshot count and space via vSAN capacity dashboard'}
            ]
        },
        46: {
            severity:'medium', detect:'N/A (tuning)', impact:'Sub-optimal space savings if misconfigured', rto:'30–60 min',
            steps:[
                {t:'Baseline',  d:'ESA dedup/compression always-on by default — no separate enable'},
                {t:'Measure',   d:'Check current savings ratio in vSphere Client capacity view'},
                {t:'Analyze',   d:'Compare against workload type: DBs ~1.5x, VDI ~2-4x, general ~1.3x'},
                {t:'Tune',      d:'Adjust compression-only vs dedup+compress per storage policy'},
                {t:'Monitor',   d:'Track savings trend over time; correlate with workload changes'},
                {t:'Report',    d:'Document actual ratios for capacity planning accuracy'}
            ]
        },
        47: {
            severity:'high', detect:'5–15 min', impact:'Uneven wear & capacity — some devices fill faster than others', rto:'1–4 hr',
            steps:[
                {t:'0 min',    d:'Health check shows storage pool imbalance warning'},
                {t:'10 min',   d:'Check per-device usage: esxcli vsan storage list'},
                {t:'20 min',   d:'Verify all NVMe devices are same capacity and firmware'},
                {t:'30 min',   d:'If auto-rebalance running — monitor progress (do not interrupt)'},
                {t:'1 hr',     d:'If not auto-rebalancing — trigger proactive rebalance'},
                {t:'2–4 hr',   d:'Pool reaches balanced state; verify even distribution'}
            ]
        },
        48: {
            severity:'high', detect:'N/A (planned)', impact:'Outdated firmware risks device failure or performance issues', rto:'1–4 hr',
            steps:[
                {t:'Pre',      d:'Download firmware from vendor; verify against vSAN HCL'},
                {t:'0 min',    d:'If online update supported — apply via vLCM firmware bundle'},
                {t:'30 min',   d:'First host enters maintenance; firmware applied; host reboots'},
                {t:'1 hr',     d:'Verify NVMe device recognized at new firmware version'},
                {t:'2 hr',     d:'Repeat for remaining hosts in rolling fashion'},
                {t:'3–4 hr',   d:'All hosts updated; verify health check green across cluster'}
            ]
        },
        49: {
            severity:'critical', detect:'0–2 min', impact:'Components on crashed LSOM2 instance marked absent — rebuild needed', rto:'30 min – 2 hr',
            steps:[
                {t:'0 min',    d:'LSOM2 panic detected in vmkernel.log; components go absent'},
                {t:'2 min',    d:'vSAN health alarm triggers; affected objects degrade'},
                {t:'5 min',    d:'Analyze panic trace — identify triggering condition'},
                {t:'15 min',   d:'If device-related — replace NVMe; if software — check for patches'},
                {t:'30 min',   d:'Apply fix; LSOM2 reinitializes on host'},
                {t:'1–2 hr',   d:'Component rebuild completes; objects return to healthy state'}
            ]
        },
        50: {
            severity:'medium', detect:'N/A (tuning)', impact:'ESA not delivering expected throughput', rto:'1–4 hr',
            steps:[
                {t:'Baseline',  d:'Establish performance baseline with vSAN Performance Service'},
                {t:'Measure',   d:'Run esxtop — check NVMe queue depth, IOPS, latency per device'},
                {t:'NUMA',      d:'Verify NUMA-aware placement — VMs should use local NVMe devices'},
                {t:'Interrupts',d:'Check interrupt coalescing and RSS configuration'},
                {t:'Network',   d:'Verify 25GbE+ NIC throughput — no drops or congestion'},
                {t:'Tune',      d:'Apply optimizations; re-measure to confirm improvement'}
            ]
        },

        /* ═══════ PHASE 6 — Performance & Capacity ═══════ */

        51: {
            severity:'critical', detect:'0–5 min', impact:'VM I/O throttled — applications experience high latency', rto:'30 min – 2 hr',
            steps:[
                {t:'0 min',    d:'VMs report high latency; esxtop shows VSCSI congestion values > 0'},
                {t:'5 min',    d:'Identify congestion source: SSD queue depth, DOM owner, network'},
                {t:'15 min',   d:'Check for hot spots: single disk or host handling too much I/O'},
                {t:'30 min',   d:'Rebalance workloads: Storage vMotion hot VMs to less loaded hosts'},
                {t:'1 hr',     d:'If disk-level congestion — check SSD health and endurance'},
                {t:'1–2 hr',   d:'Congestion resolves; verify via Performance Service'}
            ]
        },
        52: {
            severity:'high', detect:'5–15 min', impact:'Resync consuming excess bandwidth — production I/O affected', rto:'30 min – 2 hr',
            steps:[
                {t:'0 min',    d:'Resync running after failure; production VMs report latency'},
                {t:'5 min',    d:'Check resync bandwidth via vSAN Performance Service'},
                {t:'10 min',   d:'Review VSAN.ResyncThrottleThreshold (default ~80 IOPS)'},
                {t:'15 min',   d:'Lower throttle to prioritize production; or raise to speed resync'},
                {t:'30 min',   d:'Rebalance takes effect; production latency improves'},
                {t:'1–2 hr',   d:'Resync completes at adjusted rate; restore default throttle'}
            ]
        },
        53: {
            severity:'medium', detect:'N/A (planning)', impact:'Under-sizing leads to capacity emergencies; over-sizing wastes budget', rto:'N/A',
            steps:[
                {t:'Collect',   d:'Gather current usage, growth rate, and workload projections'},
                {t:'Calculate', d:'Account for FTT overhead, slack space (25-30%), and swap'},
                {t:'Validate',  d:'Use VMware vSAN Sizer tool for official recommendations'},
                {t:'Plan',      d:'Build 12-18 month capacity plan with expansion milestones'},
                {t:'Monitor',   d:'Set alerts at 70% and 80% usage thresholds'},
                {t:'Review',    d:'Quarterly review of actuals vs projections; adjust plan'}
            ]
        },
        54: {
            severity:'medium', detect:'N/A (diagnostic)', impact:'Without esxtop data, root cause analysis is guesswork', rto:'15–30 min',
            steps:[
                {t:'Connect',   d:'SSH to ESXi host; run esxtop in batch or interactive mode'},
                {t:'Navigate',  d:'Press "u" for disk device view; "v" for VM virtual disk view'},
                {t:'Identify',  d:'Key fields: CMDS/s, READS/s, WRITES/s, DAVG, KAVG, GAVG'},
                {t:'Interpret', d:'DAVG > 20ms = device issue; KAVG > 2ms = kernel queue; GAVG = guest'},
                {t:'Correlate', d:'Match high latency devices with specific VMs and objects'},
                {t:'Action',    d:'Feed findings into remediation plan for identified bottleneck'}
            ]
        },
        55: {
            severity:'critical', detect:'0–5 min', impact:'Write I/O stalls — application commits timeout', rto:'30 min – 2 hr',
            steps:[
                {t:'0 min',    d:'VMs report write timeout; esxtop shows high KAVG on write path'},
                {t:'5 min',    d:'Check cache tier (OSA): SSD write endurance, queue depth, destage rate'},
                {t:'15 min',   d:'If cache SSD failing — plan immediate replacement'},
                {t:'30 min',   d:'If destage backlog — check capacity tier health and throughput'},
                {t:'1 hr',     d:'Replace failing SSD or resolve capacity tier bottleneck'},
                {t:'1–2 hr',   d:'Write latency returns to normal; verify via Performance Service'}
            ]
        },
        56: {
            severity:'high', detect:'5–15 min', impact:'Read-heavy VMs experience latency spikes', rto:'30 min – 4 hr',
            steps:[
                {t:'0 min',    d:'VMs report read latency; esxtop shows high read DAVG'},
                {t:'10 min',   d:'Determine if working set exceeds read cache capacity (OSA)'},
                {t:'20 min',   d:'Identify hot VMs with large active data footprint'},
                {t:'30 min',   d:'Short-term: Storage vMotion hot VMs to distribute load'},
                {t:'1 hr',     d:'Medium-term: Increase cache tier or adjust storage policy'},
                {t:'2–4 hr',   d:'Long-term: Consider ESA migration for single-tier performance'}
            ]
        },
        57: {
            severity:'medium', detect:'5–30 min', impact:'VM IOPS artificially capped — application under-performs', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'VM latency stable but throughput capped below expected level'},
                {t:'5 min',    d:'Check assigned storage policy for IOPS limit setting'},
                {t:'10 min',   d:'Review if limit was intentional (multi-tenant) or accidental'},
                {t:'15 min',   d:'Edit policy: remove or increase IOPS limit as appropriate'},
                {t:'20 min',   d:'Reapply policy to affected VMs'},
                {t:'30 min',   d:'Verify VM now achieves expected throughput'}
            ]
        },
        58: {
            severity:'medium', detect:'N/A (planning)', impact:'Wrong hardware selection leads to performance or compatibility issues', rto:'N/A',
            steps:[
                {t:'Profile',   d:'Define workload: IOPS, throughput, capacity, growth rate'},
                {t:'Select',    d:'Choose ReadyNode config from VMware HCL: AF vs hybrid, NVMe vs SAS'},
                {t:'Validate',  d:'Run through vSAN Sizer with workload profile'},
                {t:'Verify',    d:'Confirm all components (NIC, SSD, HBA) on vSAN HCL'},
                {t:'Order',     d:'Procure ReadyNode; verify firmware bundle availability for vLCM'},
                {t:'Deploy',    d:'Rack, stack, configure, join to vSAN cluster'}
            ]
        },
        59: {
            severity:'critical', detect:'0–5 min', impact:'Witness cannot serve quorum — stretched cluster at risk', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'Witness appliance unresponsive; health alarm triggers'},
                {t:'5 min',    d:'Check appliance: CPU, memory, disk usage via console or SSH'},
                {t:'10 min',   d:'If OOM — increase memory; if disk full — expand witness VMDK'},
                {t:'15 min',   d:'Check component count vs appliance limits (Tiny/Medium/Large)'},
                {t:'20 min',   d:'Restart vsanmgmtd or reboot appliance if needed'},
                {t:'30–60 min',d:'Witness stabilizes; verify quorum for all stretched objects'}
            ]
        },
        60: {
            severity:'high', detect:'15–60 min', impact:'Deleted data not reclaiming space — capacity appears full', rto:'1–4 hr',
            steps:[
                {t:'0 min',    d:'Capacity not recovering after VM deletions or disk shrink'},
                {t:'15 min',   d:'Check EnableBlockDelete setting (must be 1 for auto-UNMAP)'},
                {t:'30 min',   d:'Verify guest OS supports TRIM (Linux: fstrim; Windows: Optimize-Volume)'},
                {t:'1 hr',     d:'If manual UNMAP needed — run esxcli vsan storage unmap'},
                {t:'2 hr',     d:'UNMAP processing completes; capacity begins recovering'},
                {t:'3–4 hr',   d:'Full reclaim; verify via vSAN capacity dashboard'}
            ]
        },

        /* ═══════ PHASE 7 — Networking ═══════ */

        61: {
            severity:'critical', detect:'0–5 min', impact:'vSAN traffic misrouted or blocked — objects inaccessible', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'Host vSAN communication fails; health check shows network error'},
                {t:'2 min',    d:'Verify VMkernel adapter: esxcli vsan network list'},
                {t:'5 min',    d:'Check vSAN traffic tag, subnet, VLAN, and port group'},
                {t:'10 min',   d:'Fix misconfiguration: correct VLAN, subnet, or vmknic tag'},
                {t:'15 min',   d:'Test with vmkping; verify connectivity to all cluster hosts'},
                {t:'20–30 min',d:'vSAN cluster reconverges; all objects accessible'}
            ]
        },
        62: {
            severity:'critical', detect:'0–10 min', impact:'Packet drops causing I/O errors and performance degradation', rto:'15–45 min',
            steps:[
                {t:'0 min',    d:'Large ping test fails; I/O errors or high latency reported'},
                {t:'5 min',    d:'Test: vmkping ++netstack=vsan -d -s 8972 <target-host>'},
                {t:'10 min',   d:'Identify MTU mismatch: vmknic, vSwitch, physical switch, or ISL'},
                {t:'15 min',   d:'Configure consistent MTU across entire path (1500 or 9000)'},
                {t:'20 min',   d:'Re-test large ping; verify no fragmentation with -d flag'},
                {t:'30–45 min',d:'Health check green; I/O errors resolve'}
            ]
        },
        63: {
            severity:'high', detect:'5–30 min', impact:'Uneven traffic distribution or failover gaps', rto:'15–30 min',
            steps:[
                {t:'0 min',    d:'Network performance inconsistent; some paths underutilized'},
                {t:'5 min',    d:'Review NIC teaming policy on vSAN port group'},
                {t:'10 min',   d:'Verify active/standby or LACP configuration matches switch side'},
                {t:'15 min',   d:'Adjust teaming policy: Route based on physical NIC load recommended'},
                {t:'20 min',   d:'Test failover by disconnecting one uplink'},
                {t:'30 min',   d:'Verify traffic redistributes properly; restore uplink'}
            ]
        },
        64: {
            severity:'medium', detect:'N/A (planned)', impact:'Multicast dependency on physical switches removed', rto:'30–60 min',
            steps:[
                {t:'Pre',      d:'Verify cluster is vSAN 7.0 U1+ (unicast supported natively)'},
                {t:'0 min',    d:'Disable multicast via esxcli vsan cluster unicastagent'},
                {t:'10 min',   d:'Verify CMMDS communication over unicast — no partitions'},
                {t:'15 min',   d:'Clean up multicast IGMP snooping config on physical switches'},
                {t:'30 min',   d:'Run health check — confirm all hosts communicating via unicast'},
                {t:'60 min',   d:'Document new config; update network runbook'}
            ]
        },
        65: {
            severity:'critical', detect:'0–2 min', impact:'Cluster split into sub-clusters — data divergence risk', rto:'15–60 min',
            steps:[
                {t:'0 min',    d:'CMMDS detects partition; two or more sub-clusters form'},
                {t:'1 min',    d:'Objects lose majority vote; some become inaccessible'},
                {t:'5 min',    d:'Run esxcli vsan cluster get on multiple hosts — compare UUIDs'},
                {t:'10 min',   d:'Trace physical path between partitioned hosts'},
                {t:'15 min',   d:'Fix network: switch, cable, NIC, or VLAN misconfiguration'},
                {t:'30–60 min',d:'Cluster reconverges; stale components reconciled'}
            ]
        },
        66: {
            severity:'high', detect:'0–5 min', impact:'Migration interrupts vSAN connectivity temporarily', rto:'15–45 min',
            steps:[
                {t:'Pre',      d:'Plan rollback: document current vSS config before migration'},
                {t:'0 min',    d:'Begin vSS → vDS migration; move VMkernel adapters'},
                {t:'5 min',    d:'If connectivity lost — immediately rollback to vSS'},
                {t:'10 min',   d:'Verify vSAN VMkernel on correct vDS port group with proper VLAN'},
                {t:'15 min',   d:'Test connectivity: vmkping all hosts on vSAN network'},
                {t:'30–45 min',d:'Migration complete; verify health check green; remove old vSS'}
            ]
        },
        67: {
            severity:'medium', detect:'5–15 min', impact:'RDMA not initializing — falls back to TCP with reduced performance', rto:'30–60 min',
            steps:[
                {t:'0 min',    d:'vSAN over RDMA enabled but not achieving expected throughput'},
                {t:'5 min',    d:'Verify NIC firmware supports RoCE v2 — check vendor release notes'},
                {t:'10 min',   d:'Check switch PFC (Priority Flow Control) and ECN configuration'},
                {t:'15 min',   d:'Verify lossless traffic class assignment matches NIC and switch'},
                {t:'30 min',   d:'Fix PFC/ECN config; restart vSAN network stack if needed'},
                {t:'45–60 min',d:'RDMA active; verify with esxcli rdma — confirm zero-copy transfers'}
            ]
        },
        68: {
            severity:'high', detect:'N/A (design/verify)', impact:'Inadequate ISL bandwidth or latency causes performance issues', rto:'1–4 hr',
            steps:[
                {t:'Measure',  d:'Verify inter-site RTT ≤5ms with vmkping -c 100'},
                {t:'Bandwidth',d:'Ensure ISL handles 2x write throughput (mirrored across sites)'},
                {t:'Witness',  d:'Verify witness has ≤200ms RTT to both sites'},
                {t:'Routing',  d:'Check no asymmetric routing for vSAN traffic'},
                {t:'Test',     d:'Run sustained I/O test; measure cross-site replication latency'},
                {t:'Optimize', d:'Tune if needed: QoS marking, dedicated VLAN, jumbo frames'}
            ]
        },
        69: {
            severity:'critical', detect:'0–5 min', impact:'Hosts cannot communicate — cluster formation fails', rto:'10–30 min',
            steps:[
                {t:'0 min',    d:'Host cannot join cluster or shows network partition'},
                {t:'2 min',    d:'Check esxcli network firewall ruleset list | grep vsan'},
                {t:'5 min',    d:'Verify ports: 2233 (data), 12321 (CMMDS), 8080 (HTTP)'},
                {t:'10 min',   d:'Check external firewalls and security groups in path'},
                {t:'15 min',   d:'Open required ports; test with nc or vmkping'},
                {t:'20–30 min',d:'Connectivity restored; host joins cluster; health green'}
            ]
        },
        70: {
            severity:'medium', detect:'N/A (design)', impact:'Under-specced network limits ESA performance potential', rto:'N/A',
            steps:[
                {t:'Design',   d:'ESA requires minimum 25GbE; 100GbE recommended for large clusters'},
                {t:'NIC',      d:'Select NICs from vSAN HCL with RDMA/RoCE v2 support preferred'},
                {t:'Switch',   d:'Configure spine-leaf topology; ensure non-blocking fabric'},
                {t:'Cable',    d:'Use DAC for <5m; AOC or fiber for longer runs; test signal quality'},
                {t:'RSS/IRQ',  d:'Configure Receive Side Scaling and interrupt affinity'},
                {t:'Validate', d:'Run throughput test; verify 25Gbps+ per host achieved'}
            ]
        }
    };

    // ── Inject timeline sections ──
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !data[kbId]) return;

            var d = data[kbId];
            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;

            var sevColor = d.severity === 'critical' ? '#e63946' : d.severity === 'high' ? '#f4a261' : '#00b4d8';
            var sevBg = d.severity === 'critical' ? 'rgba(230,57,70,0.1)' : d.severity === 'high' ? 'rgba(244,162,97,0.1)' : 'rgba(0,180,216,0.1)';
            var sevBorder = d.severity === 'critical' ? 'rgba(230,57,70,0.25)' : d.severity === 'high' ? 'rgba(244,162,97,0.25)' : 'rgba(0,180,216,0.25)';

            var html = '<div class="section-label" style="margin-top:1.5rem;">Impact &amp; Recovery Timeline</div>';

            // Summary bar
            html += '<div class="tl-summary">';
            html += '<div class="tl-stat"><span class="tl-stat-label">Severity</span><span class="tl-stat-value" style="color:' + sevColor + ';background:' + sevBg + ';border:1px solid ' + sevBorder + ';">' + d.severity.toUpperCase() + '</span></div>';
            html += '<div class="tl-stat"><span class="tl-stat-label">Detection</span><span class="tl-stat-value tl-neutral">' + d.detect + '</span></div>';
            html += '<div class="tl-stat"><span class="tl-stat-label">Recovery (RTO)</span><span class="tl-stat-value tl-neutral">' + d.rto + '</span></div>';
            html += '</div>';

            // Impact statement
            html += '<div class="tl-impact"><strong>Impact:</strong> ' + d.impact + '</div>';

            // Timeline steps
            html += '<div class="tl-steps">';
            d.steps.forEach(function (s, i) {
                var isLast = i === d.steps.length - 1;
                html += '<div class="tl-step">';
                html += '<div class="tl-step-marker"><div class="tl-dot" style="background:' + sevColor + '"></div>';
                if (!isLast) html += '<div class="tl-line"></div>';
                html += '</div>';
                html += '<div class="tl-step-content">';
                html += '<span class="tl-time">' + s.t + '</span>';
                html += '<span class="tl-desc">' + s.d + '</span>';
                html += '</div></div>';
            });
            html += '</div>';

            var section = document.createElement('div');
            section.className = 'tl-section';
            section.innerHTML = html;
            body.appendChild(section);
        });
    });

    // ── CSS ──
    var style = document.createElement('style');
    style.textContent =
        '.tl-summary{display:flex;gap:1rem;flex-wrap:wrap;margin:0.75rem 0;}' +
        '.tl-stat{display:flex;flex-direction:column;gap:0.25rem;}' +
        '.tl-stat-label{font-size:0.7rem;color:#5c7a94;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;}' +
        '.tl-stat-value{display:inline-block;padding:0.25rem 0.7rem;border-radius:6px;font-size:0.78rem;font-weight:700;white-space:nowrap;}' +
        '.tl-neutral{background:rgba(143,163,184,0.1);border:1px solid rgba(143,163,184,0.2);color:#8fa3b8;}' +
        '.tl-impact{font-size:0.82rem;color:#8fa3b8;padding:0.6rem 0.9rem;border-radius:8px;background:rgba(143,163,184,0.05);border:1px solid rgba(143,163,184,0.1);margin:0.75rem 0;line-height:1.5;}' +
        '.tl-impact strong{color:#e8edf2;}' +
        '.tl-steps{display:flex;flex-direction:column;margin:0.75rem 0 0.25rem;}' +
        '.tl-step{display:flex;gap:0.75rem;min-height:2.2rem;}' +
        '.tl-step-marker{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:16px;}' +
        '.tl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px;}' +
        '.tl-line{width:2px;flex:1;background:rgba(143,163,184,0.15);margin:2px 0;}' +
        '.tl-step-content{display:flex;gap:0.6rem;align-items:baseline;padding-bottom:0.6rem;flex:1;min-width:0;}' +
        '.tl-time{flex-shrink:0;font-size:0.72rem;font-weight:700;color:#48cae4;min-width:65px;white-space:nowrap;}' +
        '.tl-desc{font-size:0.8rem;color:#8fa3b8;line-height:1.4;}' +
        '@media(max-width:600px){.tl-summary{flex-direction:column;gap:0.5rem;}.tl-time{min-width:50px;font-size:0.68rem;}.tl-desc{font-size:0.75rem;}}';
    document.head.appendChild(style);
})();
