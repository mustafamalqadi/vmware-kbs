/**
 * vSphere KB Cross-Reference System
 * Auto-injects "Related KBs" sections into each KB entry on every phase page.
 * Include this script at the bottom of every phase HTML file.
 */
(function () {
    const kbMeta = {
        1:  { t:"HA Failover Not Triggering",               ty:"break", f:"phase1.html" },
        2:  { t:"DRS Not Balancing VMs",                    ty:"break", f:"phase1.html" },
        3:  { t:"vMotion Failure",                          ty:"break", f:"phase1.html" },
        4:  { t:"Host Disconnected from vCenter",           ty:"break", f:"phase1.html" },
        5:  { t:"PSOD Recovery",                            ty:"break", f:"phase1.html" },
        6:  { t:"VM Power-On Failure",                      ty:"break", f:"phase1.html" },
        7:  { t:"vpxd Service Crash",                       ty:"break", f:"phase1.html" },
        8:  { t:"Snapshot Consolidation Failure",           ty:"fix",   f:"phase1.html" },
        9:  { t:"Maintenance Mode Stuck",                   ty:"fix",   f:"phase1.html" },
        10: { t:"Alarm Storm Triage",                       ty:"fix",   f:"phase1.html" },
        11: { t:"Certificate / STS Expiry",                 ty:"break", f:"phase2.html" },
        12: { t:"vLCM Patching Workflow",                   ty:"fix",   f:"phase2.html" },
        13: { t:"vCenter Backup & Restore (VAMI)",          ty:"fix",   f:"phase2.html" },
        14: { t:"Log Bundle Collection",                    ty:"fix",   f:"phase2.html" },
        15: { t:"SSH / Shell Hardening",                    ty:"fix",   f:"phase2.html" },
        16: { t:"SSO / Identity Source Issues",             ty:"break", f:"phase2.html" },
        17: { t:"NTP Configuration & Time Drift",           ty:"break", f:"phase2.html" },
        18: { t:"Syslog & Log Forwarding",                  ty:"fix",   f:"phase2.html" },
        19: { t:"Host Profile Compliance",                  ty:"fix",   f:"phase2.html" },
        20: { t:"Performance Monitoring (esxtop)",          ty:"fix",   f:"phase2.html" },
        21: { t:"HA Admission Control",                     ty:"break", f:"phase3.html" },
        22: { t:"HA Master Election Failure",               ty:"break", f:"phase3.html" },
        23: { t:"Heartbeat Datastore Issues",               ty:"break", f:"phase3.html" },
        24: { t:"FDM Agent Crash",                          ty:"break", f:"phase3.html" },
        25: { t:"VM Component Protection (VMCP)",           ty:"fix",   f:"phase3.html" },
        26: { t:"Fault Tolerance Setup",                    ty:"fix",   f:"phase3.html" },
        27: { t:"HA Split Brain",                           ty:"break", f:"phase3.html" },
        28: { t:"Proactive HA with DRS",                    ty:"fix",   f:"phase3.html" },
        29: { t:"Isolation Response Policy",                ty:"fix",   f:"phase3.html" },
        30: { t:"VM Restart Priority",                      ty:"fix",   f:"phase3.html" },
        31: { t:"Affinity / Anti-Affinity Conflicts",       ty:"break", f:"phase4.html" },
        32: { t:"Resource Pool Misconfiguration",           ty:"break", f:"phase4.html" },
        33: { t:"DRS Migration Threshold",                  ty:"fix",   f:"phase4.html" },
        34: { t:"EVC Mode CPU Mismatch",                    ty:"break", f:"phase4.html" },
        35: { t:"VM-Host Affinity Rules",                   ty:"fix",   f:"phase4.html" },
        36: { t:"NUMA Optimization",                        ty:"fix",   f:"phase4.html" },
        37: { t:"Memory Ballooning Crisis",                 ty:"break", f:"phase4.html" },
        38: { t:"Storage DRS & Datastore Clusters",         ty:"fix",   f:"phase4.html" },
        39: { t:"DRS Faults Not Applied",                   ty:"break", f:"phase4.html" },
        40: { t:"Latency Sensitivity Tuning",               ty:"fix",   f:"phase4.html" },
        41: { t:"VCSA Disk Space Full",                     ty:"break", f:"phase5.html" },
        42: { t:"vpxd Crash & Recovery (Deep)",             ty:"break", f:"phase5.html" },
        43: { t:"PostgreSQL Database Issues",               ty:"break", f:"phase5.html" },
        44: { t:"STS Certificate Renewal",                  ty:"break", f:"phase5.html" },
        45: { t:"Content Library Sync Failure",             ty:"fix",   f:"phase5.html" },
        46: { t:"PSC Convergence",                          ty:"fix",   f:"phase5.html" },
        47: { t:"VAMI Backup & Recovery",                   ty:"fix",   f:"phase5.html" },
        48: { t:"Plugin / UI Extension Issues",             ty:"fix",   f:"phase5.html" },
        49: { t:"Lookup Service Registration",              ty:"break", f:"phase5.html" },
        50: { t:"vCenter Sizing & Performance",             ty:"fix",   f:"phase5.html" },
        51: { t:"VMFS Unmount / Detach",                    ty:"break", f:"phase6.html" },
        52: { t:"APD / PDL on VMFS",                        ty:"break", f:"phase6.html" },
        53: { t:"Multipathing (PSP) Config",                ty:"fix",   f:"phase6.html" },
        54: { t:"NFS Connectivity & Performance",           ty:"break", f:"phase6.html" },
        55: { t:"VMFS Heap Exhaustion",                     ty:"break", f:"phase6.html" },
        56: { t:"Storage vMotion Failure",                  ty:"break", f:"phase6.html" },
        57: { t:"Thin Provisioning & UNMAP",                ty:"fix",   f:"phase6.html" },
        58: { t:"iSCSI / FC HBA Troubleshooting",          ty:"fix",   f:"phase6.html" },
        59: { t:"VAAI Offload & Acceleration",              ty:"fix",   f:"phase6.html" },
        60: { t:"SDRS Troubleshooting",                     ty:"fix",   f:"phase6.html" },
        61: { t:"vDS Disconnect Recovery",                  ty:"break", f:"phase7.html" },
        62: { t:"vMotion Network Troubleshooting",          ty:"break", f:"phase7.html" },
        63: { t:"MTU / Jumbo Frames Mismatch",             ty:"break", f:"phase7.html" },
        64: { t:"NIC Teaming & Failover",                   ty:"fix",   f:"phase7.html" },
        65: { t:"VLAN Configuration Issues",                ty:"break", f:"phase7.html" },
        66: { t:"vSS to vDS Migration",                     ty:"fix",   f:"phase7.html" },
        67: { t:"NIOC — Traffic Shaping",                   ty:"fix",   f:"phase7.html" },
        68: { t:"TCP/IP Stack & VMkernel Routing",          ty:"fix",   f:"phase7.html" },
        69: { t:"ESXi Firewall & Ports",                    ty:"fix",   f:"phase7.html" },
        70: { t:"SR-IOV & DirectPath I/O",                  ty:"fix",   f:"phase7.html" },
        71: { t:"vSphere+ Cloud Gateway",                   ty:"break", f:"phase8.html" },
        72: { t:"VM Encryption & vTPM",                     ty:"break", f:"phase8.html" },
        73: { t:"vGPU & DirectPath I/O",                    ty:"fix",   f:"phase8.html" },
        74: { t:"Auto Deploy & Stateless ESXi",             ty:"break", f:"phase8.html" },
        75: { t:"vLCM Image-Based Updates",                 ty:"fix",   f:"phase8.html" },
        76: { t:"vSphere Replication & RPO",                ty:"break", f:"phase8.html" },
        77: { t:"Tanzu / Workload Management",              ty:"break", f:"phase8.html" },
        78: { t:"Enhanced Linked Mode",                     ty:"fix",   f:"phase8.html" },
        79: { t:"ESXi Coredump & PSOD Analysis",            ty:"fix",   f:"phase8.html" },
        80: { t:"Skyline Health & Proactive Support",       ty:"fix",   f:"phase8.html" }
    };

    const xref = {
        1:  [21, 22, 23, 24, 27, 29],
        2:  [31, 33, 34, 39, 37],
        3:  [62, 63, 34, 56, 70],
        4:  [61, 17, 11, 69],
        5:  [14, 12, 9],
        6:  [21, 37, 32, 1],
        7:  [42, 41, 43, 11, 44],
        8:  [56, 55, 51],
        9:  [2, 28, 12, 5],
        10: [18, 14, 50],
        11: [44, 16, 7, 49],
        12: [19, 15, 9],
        13: [47, 41, 43],
        14: [18, 5, 20],
        15: [69, 12, 17],
        16: [11, 44, 49],
        17: [11, 15, 4],
        18: [14, 10, 20],
        19: [12, 15, 35],
        20: [14, 37, 36, 40],
        21: [1, 6, 30, 22],
        22: [1, 27, 24, 23],
        23: [1, 22, 52, 25],
        24: [1, 22, 27],
        25: [52, 23, 29],
        26: [3, 62, 70],
        27: [22, 29, 1, 4],
        28: [2, 39, 9],
        29: [27, 1, 25, 30],
        30: [21, 29, 6],
        31: [35, 2, 39],
        32: [37, 2, 36],
        33: [2, 39, 31],
        34: [3, 62, 36],
        35: [31, 19, 2],
        36: [37, 40, 20, 32],
        37: [32, 36, 20, 6],
        38: [56, 60, 51, 53],
        39: [2, 31, 33, 28],
        40: [36, 20, 37],
        41: [43, 42, 7, 47],
        42: [7, 41, 43, 48],
        43: [41, 42, 50],
        44: [11, 16, 49, 7],
        45: [47, 46],
        46: [44, 49, 16],
        47: [13, 41, 45],
        48: [42, 49, 50],
        49: [44, 16, 46, 48],
        50: [43, 42, 20],
        51: [52, 55, 8, 56],
        52: [25, 51, 53, 1],
        53: [52, 58, 54, 59],
        54: [53, 63, 51],
        55: [51, 8, 56],
        56: [3, 8, 51, 55, 38],
        57: [59, 51, 60],
        58: [53, 54, 59],
        59: [57, 53, 58],
        60: [38, 56, 57],
        61: [4, 66, 65, 69],
        62: [3, 63, 68, 34],
        63: [62, 3, 64, 67],
        64: [63, 66, 61, 67],
        65: [61, 64, 66, 69],
        66: [61, 64, 65, 67],
        67: [64, 63, 66, 68],
        68: [62, 67, 69, 3],
        69: [4, 15, 61, 65],
        70: [26, 3, 62, 36],
        71: [11, 17, 80, 75],
        72: [44, 11, 6, 15],
        73: [70, 36, 40, 6],
        74: [19, 12, 75, 9],
        75: [12, 74, 19, 80],
        76: [56, 52, 25, 1],
        77: [45, 75, 32, 61],
        78: [49, 16, 44, 11],
        79: [5, 14, 20, 80],
        80: [71, 75, 79, 12]
    };

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !xref[kbId]) return;
            var related = xref[kbId];
            if (related.length === 0) return;
            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;
            var section = document.createElement('div');
            section.className = 'xref-section';
            section.innerHTML =
                '<div class="section-label" style="margin-top:1.5rem;">Related KB Entries</div>' +
                '<div class="xref-links">' +
                related.map(function (rid) {
                    var m = kbMeta[rid];
                    if (!m) return '';
                    var cls = m.ty === 'break' ? 'xref-break' : 'xref-fix';
                    return '<a href="' + m.f + '#kb-' + rid + '" class="xref-link ' + cls + '" title="' + m.t + '">' +
                        '<span class="xref-num">#' + rid + '</span> ' +
                        '<span class="xref-title">' + m.t + '</span></a>';
                }).join('') +
                '</div>';
            body.appendChild(section);
        });
    });

    var style = document.createElement('style');
    style.textContent =
        '.xref-links{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem;}' +
        '.xref-link{display:inline-flex;align-items:center;gap:0.4rem;padding:0.35rem 0.75rem;border-radius:6px;text-decoration:none;font-size:0.78rem;font-weight:500;transition:all 0.2s;max-width:100%;}' +
        '.xref-link:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.3);}' +
        '.xref-break{background:rgba(248,81,73,0.08);border:1px solid rgba(248,81,73,0.2);color:#ff7b72;}' +
        '.xref-break:hover{background:rgba(248,81,73,0.15);border-color:rgba(248,81,73,0.4);}' +
        '.xref-fix{background:rgba(63,185,80,0.08);border:1px solid rgba(63,185,80,0.2);color:#56d364;}' +
        '.xref-fix:hover{background:rgba(63,185,80,0.15);border-color:rgba(63,185,80,0.4);}' +
        '.xref-num{font-weight:800;font-size:0.75rem;opacity:0.85;}' +
        '.xref-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
        '@media(max-width:600px){.xref-link{font-size:0.72rem;padding:0.3rem 0.6rem;}}';
    document.head.appendChild(style);
})();
