/**
 * vSAN KB — Version Applicability Matrix
 * Auto-injects a version compatibility grid into each KB entry showing
 * which vSAN versions (6.x, 7.0, 7.0U1-U3, 8.0 OSA, 8.0 ESA, 8.0U1+ ESA) apply.
 * Include after kb-timeline.js in every phase HTML file.
 */
(function () {

    // Version columns
    var cols = ['6.5–6.7','7.0','7.0 U1–U3','8.0 OSA','8.0 ESA','8.0 U1+ ESA'];

    // Applicability: y=yes(applies), n=no, p=partial, f=fixed(resolved in this ver)
    // Order matches cols above: [6.5-6.7, 7.0, 7.0U1-U3, 8.0OSA, 8.0ESA, 8.0U1+ESA]
    var mx = {
        /* ═══ Phase 1 ═══ */
        1:  ['y','y','y','y','n','n'],   // Disk group absent — OSA only, ESA has storage pools
        2:  ['y','y','y','y','y','y'],   // Network partition — all versions
        3:  ['y','y','y','y','y','y'],   // Objects inaccessible
        4:  ['y','y','y','y','y','y'],   // Resync stalled
        5:  ['y','y','y','y','y','y'],   // Host fails to join
        6:  ['n','y','y','y','y','y'],   // Stretched cluster — 6.x had limited support
        7:  ['p','y','y','y','y','y'],   // Encryption — 6.6+ only
        8:  ['y','y','y','y','y','y'],   // Performance degradation
        9:  ['y','y','y','y','y','y'],   // Upgrade failure
        10: ['y','y','y','y','y','y'],   // Maintenance mode stuck

        /* ═══ Phase 2 ═══ */
        11: ['n','n','n','n','y','y'],   // ESA NVMe drop — ESA only
        12: ['n','y','y','y','y','y'],   // File services — 7.0+
        13: ['n','n','y','y','y','y'],   // HCI Mesh — 7.0 U1+
        14: ['p','y','y','y','y','y'],   // Key rotation — encryption 6.6+
        15: ['p','y','y','y','y','y'],   // Skyline — limited in 6.x
        16: ['y','y','y','y','y','y'],   // Dedup & compression — OSA all; ESA inline
        17: ['y','y','y','y','y','y'],   // Capacity full
        18: ['n','y','y','y','y','y'],   // vLCM — 7.0+
        19: ['y','y','y','y','y','y'],   // SPBM policy
        20: ['p','y','y','y','y','y'],   // iSCSI target — 6.5+ limited, 7.0+ full

        /* ═══ Phase 3 ═══ */
        21: ['y','y','y','y','y','y'],   // PSOD
        22: ['y','y','y','y','p','p'],   // Snapshot sprawl — ESA has native snaps (less relevant)
        23: ['n','y','y','y','y','y'],   // Stretched site failure — 7.0+ full support
        24: ['n','n','n','n','n','y'],   // vSAN 8 native snapshots — 8.0 U1 ESA only
        25: ['y','y','y','y','y','y'],   // Checksum / data integrity
        26: ['y','y','y','y','y','y'],   // vCenter recovery
        27: ['y','y','y','y','y','y'],   // Host isolation response
        28: ['p','y','y','y','y','y'],   // Proactive HA — 6.5+ limited
        29: ['y','y','y','y','y','y'],   // Cluster shutdown/startup
        30: ['y','y','y','y','y','y'],   // Fault domain misconfig

        /* ═══ Phase 4 ═══ */
        31: ['n','n','y','y','y','y'],   // SDDC Manager — VCF 4.x+ (vSAN 7.0U1+)
        32: ['n','n','y','y','y','y'],   // Workload domain expansion
        33: ['n','n','y','y','y','y'],   // VCF bundle
        34: ['n','n','y','y','y','y'],   // NSX-T breaks vSAN
        35: ['n','n','y','y','y','y'],   // Stretched in VCF
        36: ['n','n','y','y','y','y'],   // vLCM image in VCF
        37: ['n','n','y','y','y','y'],   // Aria Operations
        38: ['n','n','y','y','y','y'],   // Mgmt domain recovery
        39: ['n','n','y','y','y','y'],   // HCI Mesh cross-domain
        40: ['n','n','y','y','y','y'],   // Cert rotation + encryption

        /* ═══ Phase 5 ═══ */
        41: ['n','n','n','n','y','y'],   // ESA vs OSA — ESA context
        42: ['n','n','n','n','y','y'],   // ESA NVMe recovery
        43: ['n','n','n','n','y','y'],   // OSA→ESA migration
        44: ['n','n','n','n','y','y'],   // ESA RAID-5/6
        45: ['n','n','n','n','n','y'],   // ESA native snapshots deep dive — 8.0U1+
        46: ['n','n','n','n','y','y'],   // ESA dedup & compression
        47: ['n','n','n','n','y','y'],   // ESA pool imbalance
        48: ['n','n','n','n','y','y'],   // ESA NVMe firmware
        49: ['n','n','n','n','y','y'],   // ESA LSOM2 crash
        50: ['n','n','n','n','y','y'],   // ESA performance tuning

        /* ═══ Phase 6 ═══ */
        51: ['y','y','y','y','y','y'],   // Congestion / backpressure
        52: ['y','y','y','y','y','y'],   // Resync throttle
        53: ['y','y','y','y','y','y'],   // Capacity planning
        54: ['y','y','y','y','y','y'],   // esxtop
        55: ['y','y','y','y','n','n'],   // Write latency cache destage — OSA cache tier
        56: ['y','y','y','y','n','n'],   // Read latency cache miss — OSA cache tier
        57: ['p','y','y','y','y','y'],   // IOPS limiting — 6.5+ limited
        58: ['y','y','y','y','y','y'],   // ReadyNode sizing
        59: ['n','y','y','y','y','y'],   // Witness exhaustion — stretched 7.0+
        60: ['p','y','y','y','y','y'],   // TRIM/UNMAP — 6.7U1+ improved

        /* ═══ Phase 7 ═══ */
        61: ['y','y','y','y','y','y'],   // VMkernel misconfig
        62: ['y','y','y','y','y','y'],   // MTU mismatch
        63: ['y','y','y','y','y','y'],   // NIC teaming
        64: ['n','p','y','y','y','y'],   // Multicast→unicast — 7.0U1+ native
        65: ['y','y','y','y','y','y'],   // Network partition split brain
        66: ['y','y','y','y','y','y'],   // vDS migration
        67: ['n','n','n','n','y','y'],   // RDMA RoCE v2 — ESA only
        68: ['n','y','y','y','y','y'],   // Stretched networking — 7.0+
        69: ['y','y','y','y','y','y'],   // Firewall & ports
        70: ['n','n','n','n','y','y']    // 25/100GbE for ESA
    };

    // Labels for matrix values
    var labels = { y:'Applies', n:'N/A', p:'Partial', f:'Fixed' };
    var tips   = {
        y:'This issue applies to this vSAN version',
        n:'Not applicable — feature or architecture not available in this version',
        p:'Partially applicable — limited support or different behavior in this version',
        f:'Issue was resolved / fixed in this version'
    };

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !mx[kbId]) return;

            var row = mx[kbId];
            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;

            var html = '<div class="section-label" style="margin-top:1.5rem;">Version Applicability</div>';
            html += '<div class="vm-grid">';
            for (var i = 0; i < cols.length; i++) {
                var v = row[i];
                html += '<div class="vm-cell vm-' + v + '" title="' + tips[v] + '">';
                html += '<span class="vm-ver">' + cols[i] + '</span>';
                html += '<span class="vm-badge vm-badge-' + v + '">' + labels[v] + '</span>';
                html += '</div>';
            }
            html += '</div>';

            var section = document.createElement('div');
            section.className = 'vm-section';
            section.innerHTML = html;
            body.appendChild(section);
        });
    });

    // CSS
    var style = document.createElement('style');
    style.textContent =
        '.vm-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:0.4rem;margin:0.75rem 0;}' +
        '.vm-cell{display:flex;flex-direction:column;align-items:center;gap:0.3rem;padding:0.5rem 0.3rem;' +
        'border-radius:8px;border:1px solid rgba(143,163,184,0.1);text-align:center;transition:all 0.2s;}' +
        '.vm-cell:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.2);}' +
        '.vm-ver{font-size:0.65rem;color:#5c7a94;font-weight:600;letter-spacing:0.3px;line-height:1.2;}' +
        '.vm-badge{font-size:0.68rem;font-weight:700;padding:0.2rem 0.5rem;border-radius:5px;letter-spacing:0.3px;}' +
        '.vm-badge-y{background:rgba(46,196,182,0.12);color:#52d6c8;border:1px solid rgba(46,196,182,0.25);}' +
        '.vm-badge-n{background:rgba(92,122,148,0.08);color:#5c7a94;border:1px solid rgba(92,122,148,0.15);}' +
        '.vm-badge-p{background:rgba(244,162,97,0.12);color:#f4c089;border:1px solid rgba(244,162,97,0.25);}' +
        '.vm-badge-f{background:rgba(0,180,216,0.12);color:#48cae4;border:1px solid rgba(0,180,216,0.25);}' +
        '.vm-y{background:rgba(46,196,182,0.03);}' +
        '.vm-n{background:rgba(92,122,148,0.02);opacity:0.6;}' +
        '.vm-p{background:rgba(244,162,97,0.03);}' +
        '.vm-f{background:rgba(0,180,216,0.03);}' +
        '@media(max-width:768px){.vm-grid{grid-template-columns:repeat(3,1fr);}.vm-ver{font-size:0.6rem;}.vm-badge{font-size:0.62rem;padding:0.15rem 0.4rem;}}' +
        '@media(max-width:480px){.vm-grid{grid-template-columns:repeat(2,1fr);}}';
    document.head.appendChild(style);
})();
