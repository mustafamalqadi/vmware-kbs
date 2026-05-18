/**
 * vSphere KB — Version Applicability Matrix
 * Auto-injects a version compatibility grid into each KB entry showing
 * which vSphere versions apply: 6.5–6.7, 7.0, 7.0U1–U3, 8.0, 8.0U1+.
 * Include after kb-timeline.js in every phase HTML file.
 */
(function () {
    var cols = ['6.5–6.7','7.0','7.0 U1–U3','8.0','8.0 U1+'];

    // y=yes(applies), n=no, p=partial, f=fixed(resolved in this ver)
    var mx = {
        /* ═══ Phase 1 ═══ */
        1:  ['y','y','y','y','y'],   // HA failover
        2:  ['y','y','y','y','y'],   // DRS balancing
        3:  ['y','y','y','y','y'],   // vMotion failure
        4:  ['y','y','y','y','y'],   // Host disconnected
        5:  ['y','y','y','y','y'],   // PSOD
        6:  ['y','y','y','y','y'],   // VM power-on
        7:  ['y','y','y','y','y'],   // vpxd crash
        8:  ['y','y','y','y','y'],   // Snapshot consolidation
        9:  ['y','y','y','y','y'],   // Maintenance mode
        10: ['y','y','y','y','y'],   // Alarm storm

        /* ═══ Phase 2 ═══ */
        11: ['y','y','y','y','y'],   // Certificate/STS
        12: ['n','y','y','y','y'],   // vLCM — 7.0+ only
        13: ['y','y','y','y','y'],   // Backup/restore
        14: ['y','y','y','y','y'],   // Log bundle
        15: ['y','y','y','y','y'],   // SSH hardening
        16: ['y','y','y','y','y'],   // SSO issues
        17: ['y','y','y','y','y'],   // NTP drift
        18: ['y','y','y','y','y'],   // Syslog
        19: ['y','y','y','y','y'],   // Host profiles
        20: ['y','y','y','y','y'],   // esxtop

        /* ═══ Phase 3 ═══ */
        21: ['y','y','y','y','y'],   // Admission control
        22: ['y','y','y','y','y'],   // Master election
        23: ['y','y','y','y','y'],   // Heartbeat DS
        24: ['y','y','y','y','y'],   // FDM crash
        25: ['p','y','y','y','y'],   // VMCP — limited in 6.x
        26: ['y','y','y','y','y'],   // Fault Tolerance
        27: ['y','y','y','y','y'],   // HA split brain
        28: ['n','y','y','y','y'],   // Proactive HA — 7.0+
        29: ['y','y','y','y','y'],   // Isolation response
        30: ['y','y','y','y','y'],   // Restart priority

        /* ═══ Phase 4 ═══ */
        31: ['y','y','y','y','y'],   // Affinity conflicts
        32: ['y','y','y','y','y'],   // Resource pools
        33: ['y','y','y','y','y'],   // DRS threshold
        34: ['y','y','y','y','y'],   // EVC mode
        35: ['y','y','y','y','y'],   // VM-host rules
        36: ['y','y','y','y','y'],   // NUMA
        37: ['y','y','y','y','y'],   // Ballooning
        38: ['y','y','y','y','y'],   // Storage DRS
        39: ['y','y','y','y','y'],   // DRS faults
        40: ['p','y','y','y','y'],   // Latency sensitivity — 6.x limited

        /* ═══ Phase 5 ═══ */
        41: ['y','y','y','y','y'],   // VCSA disk full
        42: ['y','y','y','y','y'],   // vpxd crash deep
        43: ['y','y','y','y','y'],   // PostgreSQL
        44: ['y','y','y','y','y'],   // STS cert
        45: ['p','y','y','y','y'],   // Content Library — basic in 6.x
        46: ['n','y','y','n','n'],   // PSC convergence — only relevant for 7.0 (8.0 has no external PSC)
        47: ['p','y','y','y','y'],   // VAMI backup — limited in 6.x
        48: ['y','y','y','y','y'],   // Plugin issues
        49: ['y','y','y','y','y'],   // Lookup service
        50: ['y','y','y','y','y'],   // VC sizing

        /* ═══ Phase 6 ═══ */
        51: ['y','y','y','y','y'],   // VMFS unmount
        52: ['y','y','y','y','y'],   // APD/PDL
        53: ['y','y','y','y','y'],   // Multipathing
        54: ['y','y','y','y','y'],   // NFS issues
        55: ['y','y','y','y','f'],   // VMFS heap — improved/fixed in 8.0U1+
        56: ['y','y','y','y','y'],   // Storage vMotion
        57: ['p','y','y','y','y'],   // Thin prov — 6.5 limited UNMAP
        58: ['y','y','y','y','y'],   // iSCSI/FC
        59: ['y','y','y','y','y'],   // VAAI
        60: ['y','y','y','y','y'],   // SDRS

        /* ═══ Phase 7 ═══ */
        61: ['y','y','y','y','y'],   // vDS disconnect
        62: ['y','y','y','y','y'],   // vMotion network
        63: ['y','y','y','y','y'],   // MTU mismatch
        64: ['y','y','y','y','y'],   // NIC teaming
        65: ['y','y','y','y','y'],   // VLAN config
        66: ['y','y','y','y','y'],   // vSS to vDS
        67: ['p','y','y','y','y'],   // NIOC — 6.x limited v2
        68: ['p','y','y','y','y'],   // TCP/IP stacks — limited in 6.x
        69: ['y','y','y','y','y'],   // Firewall ports
        70: ['p','y','y','y','y']    // SR-IOV — broader support in 7.0+
    };

    var labels = { y:'Applies', n:'N/A', p:'Partial', f:'Fixed' };

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kb-entry').forEach(function (entry) {
            var numEl = entry.querySelector('.kb-number');
            if (!numEl) return;
            var kbId = parseInt(numEl.textContent.trim(), 10);
            if (!kbId || !mx[kbId]) return;
            var body = entry.querySelector('.kb-entry-body');
            if (!body) return;

            var row = mx[kbId];
            var html = '<div class="version-section">';
            html += '<div class="section-label" style="margin-top:1.5rem;">Version Applicability</div>';
            html += '<div class="vm-grid">';
            for (var i = 0; i < cols.length; i++) {
                var v = row[i];
                html += '<div class="vm-cell vm-' + v + '"><div class="vm-ver">' + cols[i] + '</div>';
                html += '<span class="vm-badge vm-badge-' + v + '">' + labels[v] + '</span></div>';
            }
            html += '</div></div>';
            var section = document.createElement('div');
            section.innerHTML = html;
            body.appendChild(section);
        });
    });

    var style = document.createElement('style');
    style.textContent =
        '.vm-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0.4rem;margin-top:0.5rem;}' +
        '.vm-cell{display:flex;flex-direction:column;align-items:center;gap:0.3rem;padding:0.5rem 0.3rem;border-radius:6px;border:1px solid #30363d;text-align:center;}' +
        '.vm-ver{font-size:0.65rem;color:#6e7681;font-weight:600;letter-spacing:0.3px;line-height:1.2;}' +
        '.vm-badge{font-size:0.68rem;font-weight:700;padding:0.2rem 0.5rem;border-radius:5px;letter-spacing:0.3px;}' +
        '.vm-badge-y{background:rgba(63,185,80,0.12);color:#56d364;border:1px solid rgba(63,185,80,0.25);}' +
        '.vm-badge-n{background:rgba(110,118,129,0.08);color:#6e7681;border:1px solid rgba(110,118,129,0.15);}' +
        '.vm-badge-p{background:rgba(210,153,34,0.12);color:#e3b341;border:1px solid rgba(210,153,34,0.25);}' +
        '.vm-badge-f{background:rgba(88,166,255,0.12);color:#79c0ff;border:1px solid rgba(88,166,255,0.25);}' +
        '.vm-y{background:rgba(63,185,80,0.03);}' +
        '.vm-n{background:rgba(110,118,129,0.02);opacity:0.6;}' +
        '.vm-p{background:rgba(210,153,34,0.03);}' +
        '.vm-f{background:rgba(88,166,255,0.03);}' +
        '@media(max-width:768px){.vm-grid{grid-template-columns:repeat(3,1fr);}.vm-ver{font-size:0.6rem;}.vm-badge{font-size:0.62rem;padding:0.15rem 0.4rem;}}' +
        '@media(max-width:480px){.vm-grid{grid-template-columns:repeat(2,1fr);}}';
    document.head.appendChild(style);
})();
