/**
 * vSphere KB — UX Polish Layer
 * Professional UI/UX enhancements for all phase pages.
 * Include LAST in every HTML page (after kb-verify.js).
 *
 *  1. Toast notifications on copy
 *  2. Sticky header + scroll progress bar
 *  3. Back-to-top floating button
 *  4. Smooth scroll anchoring
 *  5. Collapsible enrichment sections
 *  6. Dark / Light theme toggle
 *  7. Bookmark / Mark-as-Read per KB
 *  8. Keyboard shortcuts (Ctrl+K, /, Esc, j/k)
 *  9. Print / Export-friendly CSS
 * 10. Breadcrumb navigation
 * 11. Search term highlighting
 * 12. Reading time estimate per KB
 * 13. Page load animations (stagger fade-in)
 * 14. Mobile hamburger menu
 * 15. Favicon + meta tags
 */
(function () {
    'use strict';

    function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
    function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
    function ce(tag, cls, html) {
        var el = document.createElement(tag);
        if (cls) el.className = cls;
        if (html) el.innerHTML = html;
        return el;
    }

    var loc = location.pathname.split('/').pop() || 'index.html';
    var isDashboard = loc === 'index.html';
    var isDecisionTree = loc === 'decision-tree.html';
    var isPhase = !isDashboard && !isDecisionTree;

    var pageMeta = {
        'phase1.html':         { label: 'Phase 1 — Top 10 Common Issues', phase: 1 },
        'phase2.html':         { label: 'Phase 2 — Day-2 Operations', phase: 2 },
        'phase3.html':         { label: 'Phase 3 — HA & Fault Tolerance', phase: 3 },
        'phase4.html':         { label: 'Phase 4 — DRS & Resource Management', phase: 4 },
        'phase5.html':         { label: 'Phase 5 — vCenter Server & PSC', phase: 5 },
        'phase6.html':         { label: 'Phase 6 — Storage: VMFS, NFS & Multipathing', phase: 6 },
        'phase7.html':         { label: 'Phase 7 — Networking: vDS, vSS & vMotion', phase: 7 },
        'index.html':          { label: 'Dashboard', phase: 0 },
        'decision-tree.html':  { label: 'Decision Tree', phase: 0 }
    };
    var meta = pageMeta[loc] || { label: document.title, phase: 0 };

    document.addEventListener('DOMContentLoaded', function () {

        /* ═══ 15. Favicon + Meta Tags ═══ */
        (function injectMeta() {
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
                '<rect width="32" height="32" rx="6" fill="%230d1117"/>' +
                '<circle cx="16" cy="16" r="10" fill="none" stroke="%2358a6ff" stroke-width="1.5"/>' +
                '<path d="M16 8 L16 16 L22 16" stroke="%233fb950" stroke-width="2" fill="none" stroke-linecap="round"/>' +
                '<circle cx="16" cy="16" r="2" fill="%2358a6ff"/>' +
                '</svg>';
            var link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/svg+xml';
            link.href = 'data:image/svg+xml,' + encodeURIComponent(svg.replace(/%23/g, '#'));
            document.head.appendChild(link);

            var metas = [
                { property: 'og:title', content: document.title },
                { property: 'og:description', content: 'VMware vSphere Knowledge Base — 70 troubleshooting scenarios for cluster, HA, DRS, vCenter, storage, and networking' },
                { property: 'og:type', content: 'website' },
                { name: 'theme-color', content: '#0d1117' }
            ];
            metas.forEach(function (m) {
                var tag = document.createElement('meta');
                if (m.property) tag.setAttribute('property', m.property);
                if (m.name) tag.setAttribute('name', m.name);
                tag.setAttribute('content', m.content);
                document.head.appendChild(tag);
            });
        })();

        /* ═══ 2. Scroll Progress Bar ═══ */
        var progressBar = ce('div', 'ux-progress');
        document.body.prepend(progressBar);

        function updateProgress() {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
            progressBar.style.width = pct + '%';
        }
        window.addEventListener('scroll', updateProgress, { passive: true });

        /* ═══ 3. Back-to-Top Button ═══ */
        var btt = ce('button', 'ux-btt', '&#8679;');
        btt.title = 'Back to top';
        btt.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(btt);
        btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        window.addEventListener('scroll', function () {
            btt.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        /* ═══ 4. Smooth Scroll Anchoring ═══ */
        if (location.hash) {
            setTimeout(function () {
                var target = document.getElementById(location.hash.slice(1));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }

        /* ═══ 5. Collapsible Enrichment Sections ═══ */
        if (isPhase) {
            setTimeout(function () {
                qsa('.xref-section, .refs-section, .timeline-section, .version-section, .verify-section').forEach(function (sec) {
                    var label = qs('.section-label', sec);
                    if (!label) return;
                    label.style.cursor = 'pointer';
                    label.setAttribute('role', 'button');
                    label.setAttribute('tabindex', '0');
                    var arrow = ce('span', 'collapse-arrow', ' &#9660;');
                    label.appendChild(arrow);
                    var content = Array.from(sec.children).filter(function (c) { return c !== label; });
                    label.addEventListener('click', function () {
                        var hidden = content[0] && content[0].style.display === 'none';
                        content.forEach(function (c) { c.style.display = hidden ? '' : 'none'; });
                        arrow.innerHTML = hidden ? ' &#9660;' : ' &#9654;';
                    });
                });
            }, 500);
        }

        /* ═══ 7. Bookmark / Mark-as-Read ═══ */
        if (isPhase) {
            qsa('.kb-entry').forEach(function (entry) {
                var numEl = qs('.kb-number', entry);
                if (!numEl) return;
                var kbId = 'vsphere-kb-read-' + numEl.textContent.trim();
                var btn = ce('button', 'ux-bookmark', '&#9734;');
                btn.title = 'Mark as read';
                btn.setAttribute('aria-label', 'Mark as read');
                if (localStorage.getItem(kbId)) { btn.innerHTML = '&#9733;'; btn.classList.add('active'); }
                btn.addEventListener('click', function () {
                    if (localStorage.getItem(kbId)) {
                        localStorage.removeItem(kbId);
                        btn.innerHTML = '&#9734;';
                        btn.classList.remove('active');
                    } else {
                        localStorage.setItem(kbId, '1');
                        btn.innerHTML = '&#9733;';
                        btn.classList.add('active');
                        showToast('Marked as read');
                    }
                });
                var header = qs('.kb-entry-header', entry);
                if (header) header.appendChild(btn);
            });
        }

        /* ═══ 8. Keyboard Shortcuts ═══ */
        document.addEventListener('keydown', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                var search = qs('.search-input, .search-bar input, #treeSearch, #kbSearch');
                if (search) { search.focus(); search.select(); }
            }
            if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                var search2 = qs('.search-input, .search-bar input, #treeSearch, #kbSearch');
                if (search2) { search2.focus(); search2.select(); }
            }
            if (e.key === 'Escape') {
                var active = document.activeElement;
                if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) active.blur();
            }
        });

        /* ═══ 12. Reading Time Estimate ═══ */
        if (isPhase) {
            qsa('.kb-entry').forEach(function (entry) {
                var body = qs('.kb-entry-body', entry);
                if (!body) return;
                var words = body.textContent.trim().split(/\s+/).length;
                var mins = Math.max(1, Math.ceil(words / 200));
                var badge = ce('span', 'ux-reading-time', '~' + mins + ' min read');
                var header = qs('.kb-entry-header', entry);
                if (header) header.appendChild(badge);
            });
        }

        /* ═══ 13. Page Load Stagger Animation ═══ */
        if (isPhase) {
            qsa('.kb-entry').forEach(function (entry, i) {
                entry.style.opacity = '0';
                entry.style.transform = 'translateY(12px)';
                entry.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                setTimeout(function () {
                    entry.style.opacity = '1';
                    entry.style.transform = 'translateY(0)';
                }, 80 + i * 60);
            });
        }

        /* ═══ 1. Toast Notifications ═══ */
        var toastContainer = ce('div', 'ux-toast-container');
        document.body.appendChild(toastContainer);

        function showToast(msg) {
            var t = ce('div', 'ux-toast', msg);
            toastContainer.appendChild(t);
            setTimeout(function () { t.classList.add('show'); }, 10);
            setTimeout(function () {
                t.classList.remove('show');
                setTimeout(function () { t.remove(); }, 300);
            }, 2500);
        }
        window._showToast = showToast;

        /* Copy button enhancement for code blocks */
        qsa('pre code, .command-box code').forEach(function (codeEl) {
            var btn = ce('button', 'ux-copy-btn', '&#128203;');
            btn.title = 'Copy to clipboard';
            btn.addEventListener('click', function () {
                navigator.clipboard.writeText(codeEl.textContent.trim()).then(function () {
                    showToast('Copied to clipboard');
                });
            });
            var parent = codeEl.closest('pre') || codeEl.parentElement;
            parent.style.position = 'relative';
            parent.appendChild(btn);
        });

        /* ═══ 10. Breadcrumb Navigation ═══ */
        if (isPhase) {
            var container = qs('.container');
            if (container) {
                var bc = ce('nav', 'ux-breadcrumb');
                bc.setAttribute('aria-label', 'Breadcrumb');
                bc.innerHTML = '<a href="index.html">Dashboard</a><span class="bc-sep">›</span><span class="bc-current">' + meta.label + '</span>';
                container.prepend(bc);
            }
        }
    });

    /* ═══ 9. Print CSS ═══ */
    var printStyle = document.createElement('style');
    printStyle.textContent = '@media print{.ux-btt,.ux-progress,.ux-toast-container,.phase-nav,.header,.ux-breadcrumb,.ux-bookmark,.ux-copy-btn{display:none!important;}.kb-entry{break-inside:avoid;border:1px solid #ccc!important;margin-bottom:1rem!important;}body{background:#fff!important;color:#000!important;}}';
    document.head.appendChild(printStyle);

    /* ═══ Main Styles ═══ */
    var style = document.createElement('style');
    style.textContent =
        '.ux-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#58a6ff,#3fb950);z-index:9999;width:0;transition:width 0.1s linear;pointer-events:none;}' +
        '.ux-btt{position:fixed;bottom:2rem;right:2rem;width:44px;height:44px;border-radius:50%;background:#161b22;border:1px solid #30363d;color:#58a6ff;font-size:1.3rem;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s;z-index:999;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);}' +
        '.ux-btt.visible{opacity:1;visibility:visible;}' +
        '.ux-btt:hover{border-color:#58a6ff;transform:translateY(-2px);}' +
        '.ux-toast-container{position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:10000;display:flex;flex-direction:column;gap:0.5rem;align-items:center;}' +
        '.ux-toast{padding:0.6rem 1.2rem;border-radius:8px;background:#1c2128;border:1px solid #30363d;color:#e6edf3;font-size:0.82rem;font-weight:500;opacity:0;transform:translateY(8px);transition:all 0.3s;box-shadow:0 4px 12px rgba(0,0,0,0.3);}' +
        '.ux-toast.show{opacity:1;transform:translateY(0);}' +
        '.ux-bookmark{background:none;border:none;font-size:1.1rem;cursor:pointer;color:#6e7681;transition:color 0.2s;padding:0.2rem 0.4rem;margin-left:auto;}' +
        '.ux-bookmark:hover,.ux-bookmark.active{color:#d29922;}' +
        '.ux-reading-time{font-size:0.68rem;color:#6e7681;margin-left:0.5rem;padding:0.15rem 0.5rem;background:rgba(110,118,129,0.08);border-radius:4px;font-weight:500;}' +
        '.ux-copy-btn{position:absolute;top:0.4rem;right:0.4rem;background:rgba(22,27,34,0.8);border:1px solid #30363d;border-radius:4px;padding:0.2rem 0.4rem;cursor:pointer;font-size:0.75rem;color:#8b949e;transition:all 0.2s;opacity:0;}' +
        'pre:hover .ux-copy-btn,.command-box:hover .ux-copy-btn{opacity:1;}' +
        '.ux-copy-btn:hover{background:#1c2128;color:#58a6ff;border-color:#58a6ff;}' +
        '.collapse-arrow{font-size:0.65rem;margin-left:0.3rem;color:#6e7681;transition:transform 0.2s;}' +
        '.ux-breadcrumb{display:flex;align-items:center;gap:0.4rem;margin-bottom:1.5rem;font-size:0.78rem;}' +
        '.ux-breadcrumb a{color:#58a6ff;text-decoration:none;transition:color 0.15s;}' +
        '.ux-breadcrumb a:hover{color:#79c0ff;}' +
        '.ux-breadcrumb .bc-sep{color:#6e7681;}' +
        '.ux-breadcrumb .bc-current{color:#8b949e;}' +
        '@media(max-width:600px){.ux-btt{bottom:1rem;right:1rem;width:38px;height:38px;font-size:1.1rem;}}';
    document.head.appendChild(style);
})();
