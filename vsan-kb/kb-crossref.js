/**
 * vSAN KB Cross-Reference System
 * Auto-injects "Related KBs" sections into each KB entry on every phase page.
 * Include this script at the bottom of every phase HTML file.
 */
(function () {
    // ── KB metadata: id → { title, type, file } ──
    const kbMeta = {
        1:  { t:"Disk Group Absent / Degraded",             ty:"break", f:"phase1.html" },
        2:  { t:"Network Partition",                        ty:"break", f:"phase1.html" },
        3:  { t:"Objects Inaccessible After Failure",       ty:"break", f:"phase1.html" },
        4:  { t:"Resync Stalled / Not Progressing",         ty:"fix",   f:"phase1.html" },
        5:  { t:"Host Fails to Join vSAN Cluster",          ty:"break", f:"phase1.html" },
        6:  { t:"Stretched Cluster Witness Failure",        ty:"break", f:"phase1.html" },
        7:  { t:"KMS / Encryption Key Issues",              ty:"break", f:"phase1.html" },
        8:  { t:"Performance Degradation Diagnosis",        ty:"fix",   f:"phase1.html" },
        9:  { t:"vSAN Upgrade Failure",                     ty:"break", f:"phase1.html" },
        10: { t:"Maintenance Mode Stuck",                   ty:"fix",   f:"phase1.html" },
        11: { t:"ESA NVMe Device Drop",                     ty:"break", f:"phase2.html" },
        12: { t:"File Services Failure",                    ty:"break", f:"phase2.html" },
        13: { t:"HCI Mesh Configuration",                   ty:"fix",   f:"phase2.html" },
        14: { t:"Encryption Key Rotation",                  ty:"fix",   f:"phase2.html" },
        15: { t:"Skyline Health Alerts",                    ty:"fix",   f:"phase2.html" },
        16: { t:"Dedup & Compression Tuning",               ty:"fix",   f:"phase2.html" },
        17: { t:"Capacity Full Emergency",                  ty:"break", f:"phase2.html" },
        18: { t:"vLCM Update Workflow",                     ty:"fix",   f:"phase2.html" },
        19: { t:"SPBM Policy Mismatch",                    ty:"break", f:"phase2.html" },
        20: { t:"iSCSI Target Service",                     ty:"fix",   f:"phase2.html" },
        21: { t:"PSOD Recovery",                            ty:"break", f:"phase3.html" },
        22: { t:"Snapshot Sprawl",                          ty:"break", f:"phase3.html" },
        23: { t:"Stretched Cluster Site Failure",           ty:"break", f:"phase3.html" },
        24: { t:"vSAN 8 Native Snapshots",                  ty:"fix",   f:"phase3.html" },
        25: { t:"Checksum / Data Integrity Errors",         ty:"break", f:"phase3.html" },
        26: { t:"vCenter Recovery from vSAN",               ty:"fix",   f:"phase3.html" },
        27: { t:"Host Isolation Response",                  ty:"fix",   f:"phase3.html" },
        28: { t:"Proactive HA Configuration",               ty:"fix",   f:"phase3.html" },
        29: { t:"Cluster Shutdown / Startup Procedure",     ty:"fix",   f:"phase3.html" },
        30: { t:"Fault Domain Misconfiguration",            ty:"break", f:"phase3.html" },
        31: { t:"SDDC Manager Bring-Up Failure",            ty:"break", f:"phase4.html" },
        32: { t:"Workload Domain Expansion",                ty:"fix",   f:"phase4.html" },
        33: { t:"VCF Bundle Download & Apply",              ty:"fix",   f:"phase4.html" },
        34: { t:"NSX-T Transport Node Breaks vSAN",         ty:"break", f:"phase4.html" },
        35: { t:"Stretched Cluster in VCF",                 ty:"fix",   f:"phase4.html" },
        36: { t:"vLCM Image-Based Mgmt in VCF",            ty:"fix",   f:"phase4.html" },
        37: { t:"Aria Operations vSAN Metrics",             ty:"fix",   f:"phase4.html" },
        38: { t:"Management Domain vSAN Recovery",          ty:"break", f:"phase4.html" },
        39: { t:"HCI Mesh Cross-Domain in VCF",             ty:"fix",   f:"phase4.html" },
        40: { t:"Certificate Rotation Breaks Encryption",   ty:"break", f:"phase4.html" },
        41: { t:"ESA vs OSA Architecture Comparison",       ty:"fix",   f:"phase5.html" },
        42: { t:"ESA NVMe Failure Recovery",                ty:"break", f:"phase5.html" },
        43: { t:"OSA to ESA Migration",                     ty:"fix",   f:"phase5.html" },
        44: { t:"ESA RAID-5/6 Policy Design",               ty:"fix",   f:"phase5.html" },
        45: { t:"ESA Native Snapshots Deep Dive",           ty:"fix",   f:"phase5.html" },
        46: { t:"ESA Dedup & Compression",                  ty:"fix",   f:"phase5.html" },
        47: { t:"ESA Storage Pool Imbalance",               ty:"break", f:"phase5.html" },
        48: { t:"ESA NVMe Firmware Updates",                ty:"fix",   f:"phase5.html" },
        49: { t:"ESA LSOM2 Crash & Recovery",               ty:"break", f:"phase5.html" },
        50: { t:"ESA Performance Tuning",                   ty:"fix",   f:"phase5.html" },
        51: { t:"vSAN Congestion / Backpressure",           ty:"break", f:"phase6.html" },
        52: { t:"Resync Throttle Balancing",                ty:"fix",   f:"phase6.html" },
        53: { t:"Capacity Planning & Sizing",               ty:"fix",   f:"phase6.html" },
        54: { t:"esxtop Deep Dive for vSAN",                ty:"fix",   f:"phase6.html" },
        55: { t:"High Write Latency — Cache Destage",       ty:"break", f:"phase6.html" },
        56: { t:"Read Latency — Cache Miss Storm",          ty:"break", f:"phase6.html" },
        57: { t:"VM Storage Policy IOPS Limiting",          ty:"fix",   f:"phase6.html" },
        58: { t:"ReadyNode Sizing & Hardware Selection",    ty:"fix",   f:"phase6.html" },
        59: { t:"Witness Appliance Resource Exhaustion",    ty:"break", f:"phase6.html" },
        60: { t:"Capacity Reclaim — TRIM/UNMAP",            ty:"break", f:"phase6.html" },
        61: { t:"VMkernel Adapter Misconfiguration",        ty:"break", f:"phase7.html" },
        62: { t:"MTU / Jumbo Frame Mismatch",               ty:"break", f:"phase7.html" },
        63: { t:"NIC Teaming & Failover",                   ty:"fix",   f:"phase7.html" },
        64: { t:"Multicast to Unicast Migration",           ty:"fix",   f:"phase7.html" },
        65: { t:"Network Partition — Split Brain",          ty:"break", f:"phase7.html" },
        66: { t:"vDS Migration Pitfalls",                   ty:"break", f:"phase7.html" },
        67: { t:"vSAN over RDMA (RoCE v2)",                ty:"fix",   f:"phase7.html" },
        68: { t:"Stretched Cluster Networking",             ty:"fix",   f:"phase7.html" },
        69: { t:"Firewall & Port Requirements",             ty:"break", f:"phase7.html" },
        70: { t:"25/100GbE Network Design for ESA",         ty:"fix",   f:"phase7.html" }
    };

    // ── Cross-reference map: KB# → [related KB#s] ──
    const xref = {
        1:  [11, 42, 49, 21, 29],
        2:  [61, 62, 65, 69, 27],
        3:  [1, 4, 51, 30, 52],
        4:  [3, 10, 52, 51],
        5:  [61, 69, 62, 64],
        6:  [59, 68, 23, 35, 30],
        7:  [14, 40, 19],
        8:  [51, 54, 55, 56, 37],
        9:  [18, 33, 36, 43, 48],
        10: [4, 29, 52, 32],
        11: [1, 42, 48, 49],
        12: [19, 13],
        13: [39, 12],
        14: [7, 40],
        15: [37, 28],
        16: [46, 55, 60],
        17: [53, 60, 22],
        18: [9, 33, 36, 48],
        19: [7, 44, 57],
        20: [13],
        21: [1, 29, 26, 49],
        22: [24, 45, 17, 60],
        23: [6, 68, 35, 27],
        24: [22, 45],
        25: [1, 49, 42],
        26: [21, 38, 29],
        27: [2, 23, 65, 28],
        28: [15, 27, 37],
        29: [10, 21, 26, 38],
        30: [6, 3, 23, 44],
        31: [38, 34],
        32: [10, 5, 36],
        33: [9, 18, 36],
        34: [2, 61, 62, 65],
        35: [6, 23, 68],
        36: [18, 33, 48],
        37: [15, 8, 53],
        38: [26, 29, 31],
        39: [13, 32],
        40: [7, 14],
        41: [43, 50, 55, 56],
        42: [1, 11, 48, 49, 25],
        43: [41, 9, 55],
        44: [19, 53, 30, 57],
        45: [22, 24],
        46: [16, 60],
        47: [1, 52, 53],
        48: [11, 42, 36, 18],
        49: [21, 42, 25, 1],
        50: [8, 51, 54, 67, 70],
        51: [52, 54, 55, 56, 8, 57],
        52: [4, 51, 10, 47],
        53: [17, 58, 60, 37, 44],
        54: [51, 55, 56, 8, 50],
        55: [51, 54, 43, 56, 16],
        56: [55, 51, 54, 41],
        57: [19, 51, 44],
        58: [53, 70, 41],
        59: [6, 68, 23, 35],
        60: [17, 53, 22, 46, 16],
        61: [2, 62, 65, 5, 66, 69],
        62: [61, 65, 70, 66, 34],
        63: [70, 66, 67],
        64: [5, 65, 69],
        65: [2, 61, 62, 69, 27, 34],
        66: [61, 62, 63],
        67: [70, 50, 63],
        68: [6, 23, 59, 35, 62],
        69: [5, 65, 61, 64],
        70: [62, 67, 63, 58, 50]
    };

    // ── Inject cross-reference sections ──
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            // Extract KB number from the .kb-number element
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !xref[kbId]) return;

            var related = xref[kbId];
            if (related.length === 0) return;

            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;

            // Build the Related KBs section
            var section = document.createElement('div');
            section.className = 'xref-section';
            section.innerHTML =
                '<div class="section-label" style="margin-top:1.5rem;">Related KB Entries</div>' +
                '<div class="xref-links">' +
                related.map(function (rid) {
                    var m = kbMeta[rid];
                    if (!m) return '';
                    var cls = m.ty === 'break' ? 'xref-break' : 'xref-fix';
                    return '<a href="' + m.f + '" class="xref-link ' + cls + '" title="' + m.t + '">' +
                        '<span class="xref-num">#' + rid + '</span> ' +
                        '<span class="xref-title">' + m.t + '</span>' +
                        '</a>';
                }).join('') +
                '</div>';

            body.appendChild(section);
        });
    });

    // ── Inject CSS for cross-reference links ──
    var style = document.createElement('style');
    style.textContent =
        '.xref-links { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }' +
        '.xref-link { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.75rem;' +
        ' border-radius: 6px; text-decoration: none; font-size: 0.78rem; font-weight: 500;' +
        ' transition: all 0.2s; max-width: 100%; }' +
        '.xref-link:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }' +
        '.xref-break { background: rgba(230,57,70,0.08); border: 1px solid rgba(230,57,70,0.2);' +
        ' color: #ff6b6b; }' +
        '.xref-break:hover { background: rgba(230,57,70,0.15); border-color: rgba(230,57,70,0.4); }' +
        '.xref-fix { background: rgba(46,196,182,0.08); border: 1px solid rgba(46,196,182,0.2);' +
        ' color: #52d6c8; }' +
        '.xref-fix:hover { background: rgba(46,196,182,0.15); border-color: rgba(46,196,182,0.4); }' +
        '.xref-num { font-weight: 800; font-size: 0.75rem; opacity: 0.85; }' +
        '.xref-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
        '@media (max-width: 600px) { .xref-link { font-size: 0.72rem; padding: 0.3rem 0.6rem; } }';
    document.head.appendChild(style);
})();
