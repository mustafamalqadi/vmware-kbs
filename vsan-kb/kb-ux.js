/**
 * vSAN KB — UX Polish Layer
 * All 15 UI/UX professional enhancements in a single self-contained file.
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

    /* ─────────────────────────────────────
       Helpers
       ───────────────────────────────────── */
    function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
    function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
    function ce(tag, cls, html) {
        var el = document.createElement(tag);
        if (cls) el.className = cls;
        if (html) el.innerHTML = html;
        return el;
    }

    /* Detect page type */
    var loc = location.pathname.split('/').pop() || 'index.html';
    var isDashboard = loc === 'index.html';
    var isDecisionTree = loc === 'decision-tree.html';
    var isPhase = !isDashboard && !isDecisionTree;

    /* Page meta for breadcrumbs */
    var pageMeta = {
        'phase1.html':          { label: 'Phase 1 — Top 10 Common Issues', phase: 1 },
        'phase2.html':         { label: 'Phase 2 — Day-2 Operations', phase: 2 },
        'phase3.html':         { label: 'Phase 3 — DR & Data Protection', phase: 3 },
        'phase4.html':         { label: 'Phase 4 — VCF Integration', phase: 4 },
        'phase5.html':         { label: 'Phase 5 — ESA Deep Dive', phase: 5 },
        'phase6.html':         { label: 'Phase 6 — Performance & Capacity', phase: 6 },
        'phase7.html':         { label: 'Phase 7 — Networking', phase: 7 },
        'index.html':      { label: 'Dashboard', phase: 0 },
        'decision-tree.html':  { label: 'Decision Tree', phase: 0 }
    };
    var meta = pageMeta[loc] || { label: document.title, phase: 0 };

    document.addEventListener('DOMContentLoaded', function () {

        /* ═══════════════════════════════════════════
           15. Favicon + Meta Tags (runs first)
           ═══════════════════════════════════════════ */
        (function injectMeta() {
            /* Inline SVG favicon — vSAN shield icon */
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
                '<rect width="32" height="32" rx="6" fill="%230f1923"/>' +
                '<path d="M16 4 L28 10 V18 C28 24 22 28 16 30 C10 28 4 24 4 18 V10 Z" ' +
                'fill="none" stroke="%2300b4d8" stroke-width="1.5"/>' +
                '<path d="M10 16 L14 20 L22 12" stroke="%232ec4b6" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
                '</svg>';
            var link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/svg+xml';
            link.href = 'data:image/svg+xml,' + encodeURIComponent(svg.replace(/%23/g, '#'));
            document.head.appendChild(link);

            /* OG meta */
            var metas = [
                { property: 'og:title', content: document.title },
                { property: 'og:description', content: 'VMware vSAN Knowledge Base — 70 fix & break scenarios with official Broadcom/VMware remediation' },
                { property: 'og:type', content: 'website' },
                { name: 'theme-color', content: '#0f1923' }
            ];
            metas.forEach(function (m) {
                var tag = document.createElement('meta');
                if (m.property) tag.setAttribute('property', m.property);
                if (m.name) tag.setAttribute('name', m.name);
                tag.setAttribute('content', m.content);
                document.head.appendChild(tag);
            });
        })();

        /* ═══════════════════════════════════════════
           2. Scroll Progress Bar
           ═══════════════════════════════════════════ */
        var progressBar = ce('div', 'ux-progress');
        document.body.prepend(progressBar);

        function updateProgress() {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
            progressBar.style.width = pct + '%';
        }
        window.addEventListener('scroll', updateProgress, { passive: true });

        /* ═══════════════════════════════════════════
           3. Back-to-Top Button
           ═══════════════════════════════════════════ */
        var btt = ce('button', 'ux-btt', '&#8679;');
        btt.title = 'Back to top';
        btt.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(btt);
        btt.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        function toggleBTT() {
            btt.classList.toggle('visible', window.scrollY > 400);
        }
        window.addEventListener('scroll', toggleBTT, { passive: true });

        /* ═══════════════════════════════════════════
           6. Dark / Light Theme Toggle
           ═══════════════════════════════════════════ */
        (function themeToggle() {
            var saved = localStorage.getItem('vsan-kb-theme') || 'dark';
            var btn = ce('button', 'ux-theme-btn', saved === 'dark' ? '&#9788;' : '&#9790;');
            btn.title = 'Toggle light/dark theme';
            btn.setAttribute('aria-label', 'Toggle theme');

            /* Find header to insert button */
            var headerInner = qs('.header-inner') || qs('.hero');
            if (headerInner) {
                /* Wrap existing badges + theme btn */
                var badges = qs('.header-badges', headerInner) || qs('.hero-badges');
                if (badges) {
                    badges.appendChild(btn);
                } else {
                    headerInner.appendChild(btn);
                }
            } else {
                document.body.appendChild(btn);
            }

            function applyTheme(t) {
                var r = document.documentElement.style;
                if (t === 'light') {
                    r.setProperty('--bg-primary', '#f0f2f5');
                    r.setProperty('--bg-secondary', '#e4e7eb');
                    r.setProperty('--bg-card', '#ffffff');
                    r.setProperty('--bg-card-hover', '#f5f7fa');
                    r.setProperty('--text-primary', '#1a2733');
                    r.setProperty('--text-secondary', '#4a5e73');
                    r.setProperty('--text-muted', '#7a8da0');
                    r.setProperty('--border', '#d0d7de');
                    r.setProperty('--code-bg', '#eef1f5');
                    r.setProperty('--shadow', '0 4px 24px rgba(0,0,0,0.08)');
                    document.body.classList.add('ux-light');
                    btn.innerHTML = '&#9790;';
                } else {
                    r.removeProperty('--bg-primary');
                    r.removeProperty('--bg-secondary');
                    r.removeProperty('--bg-card');
                    r.removeProperty('--bg-card-hover');
                    r.removeProperty('--text-primary');
                    r.removeProperty('--text-secondary');
                    r.removeProperty('--text-muted');
                    r.removeProperty('--border');
                    r.removeProperty('--code-bg');
                    r.removeProperty('--shadow');
                    document.body.classList.remove('ux-light');
                    btn.innerHTML = '&#9788;';
                }
            }
            applyTheme(saved);

            btn.addEventListener('click', function () {
                var current = localStorage.getItem('vsan-kb-theme') || 'dark';
                var next = current === 'dark' ? 'light' : 'dark';
                localStorage.setItem('vsan-kb-theme', next);
                applyTheme(next);
            });
        })();

        /* ═══════════════════════════════════════════
           14. Mobile Hamburger Menu
           ═══════════════════════════════════════════ */
        (function hamburger() {
            /* Find the nav — inline <nav> in phase1.html or .phase-nav in others */
            var nav = qs('nav') || qs('.phase-nav');
            if (!nav) return;
            nav.classList.add('ux-nav');

            var burger = ce('button', 'ux-burger', '&#9776;');
            burger.setAttribute('aria-label', 'Toggle navigation');
            burger.title = 'Menu';

            /* Insert burger before nav */
            nav.parentNode.insertBefore(burger, nav);

            burger.addEventListener('click', function () {
                nav.classList.toggle('ux-nav-open');
                burger.innerHTML = nav.classList.contains('ux-nav-open') ? '&#10005;' : '&#9776;';
            });

            /* Close on link click */
            qsa('a', nav).forEach(function (a) {
                a.addEventListener('click', function () {
                    nav.classList.remove('ux-nav-open');
                    burger.innerHTML = '&#9776;';
                });
            });
        })();

        /* ═══════════════════════════════════════════
           10. Breadcrumb Navigation
           ═══════════════════════════════════════════ */
        (function breadcrumb() {
            if (isDashboard) return; /* Dashboard is top-level */
            var container = qs('.container') || qs('.search-bar') || qs('.search-section');
            if (!container) return;

            var bc = ce('nav', 'ux-breadcrumb');
            bc.setAttribute('aria-label', 'Breadcrumb');
            var items = [
                '<a href="index.html">Dashboard</a>',
                '<span class="ux-bc-sep">›</span>',
                '<span class="ux-bc-current">' + meta.label + '</span>'
            ];
            bc.innerHTML = items.join('');
            container.parentNode.insertBefore(bc, container);
        })();

        /* ═══════════════════════════════════════════
           1. Toast Notifications on Copy
           ═══════════════════════════════════════════ */
        var toastContainer = ce('div', 'ux-toast-container');
        document.body.appendChild(toastContainer);

        function showToast(msg, type) {
            var t = ce('div', 'ux-toast ux-toast-' + (type || 'success'), msg);
            toastContainer.appendChild(t);
            requestAnimationFrame(function () { t.classList.add('show'); });
            setTimeout(function () {
                t.classList.remove('show');
                setTimeout(function () { t.remove(); }, 300);
            }, 2000);
        }

        /* Intercept all copy buttons (existing code-copy + verify-copy) */
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.copy-btn, .vfy-copy, [onclick*="clipboard"]');
            if (btn) {
                setTimeout(function () { showToast('&#10003; Copied to clipboard'); }, 50);
            }
        });

        /* ═══════════════════════════════════════════
           4. Smooth Scroll Anchoring
           ═══════════════════════════════════════════ */
        (function smoothAnchors() {
            /* Handle hash on page load (deep link from dashboard) */
            if (location.hash) {
                setTimeout(function () {
                    var target = qs(location.hash);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        target.classList.add('ux-highlight-entry');
                        setTimeout(function () { target.classList.remove('ux-highlight-entry'); }, 2500);
                    }
                }, 400);
            }
            /* Smooth scroll for all anchor links */
            document.addEventListener('click', function (e) {
                var a = e.target.closest('a[href^="#"]');
                if (!a) return;
                var target = qs(a.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        })();

        /* ═══════════════════════════════════════════
           5. Collapsible Enrichment Sections
           ═══════════════════════════════════════════ */
        (function collapsibleSections() {
            if (!isPhase) return;
            /* Target section labels inside kb-entry-body */
            qsa('.kb-entry-body .section-label').forEach(function (label) {
                label.classList.add('ux-collapsible');
                var chevron = ce('span', 'ux-sec-chev', '&#9660;');
                label.appendChild(chevron);
                /* Find the next sibling(s) until next section-label */
                label.addEventListener('click', function () {
                    var collapsed = label.classList.toggle('ux-collapsed');
                    var sib = label.nextElementSibling;
                    while (sib && !sib.classList.contains('section-label')) {
                        sib.style.display = collapsed ? 'none' : '';
                        sib = sib.nextElementSibling;
                    }
                });
            });
        })();

        /* ═══════════════════════════════════════════
           7. Bookmark / Mark-as-Read
           ═══════════════════════════════════════════ */
        (function bookmarks() {
            if (!isPhase) return;
            var KEY = 'vsan-kb-read';
            function getRead() {
                try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
            }
            function setRead(obj) { localStorage.setItem(KEY, JSON.stringify(obj)); }

            qsa('.kb-entry').forEach(function (entry) {
                var numEl = qs('.kb-number', entry);
                if (!numEl) return;
                var kbId = numEl.textContent.trim();

                var btn = ce('button', 'ux-bookmark', '');
                btn.title = 'Mark as read';
                btn.setAttribute('aria-label', 'Toggle read status for KB #' + kbId);

                var readMap = getRead();
                if (readMap[kbId]) {
                    btn.classList.add('ux-read');
                    btn.innerHTML = '&#10003;';
                    entry.classList.add('ux-entry-read');
                } else {
                    btn.innerHTML = '&#9734;';
                }

                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var rm = getRead();
                    if (rm[kbId]) {
                        delete rm[kbId];
                        btn.classList.remove('ux-read');
                        btn.innerHTML = '&#9734;';
                        entry.classList.remove('ux-entry-read');
                        showToast('KB #' + kbId + ' unmarked');
                    } else {
                        rm[kbId] = Date.now();
                        btn.classList.add('ux-read');
                        btn.innerHTML = '&#10003;';
                        entry.classList.add('ux-entry-read');
                        showToast('&#10003; KB #' + kbId + ' marked as read');
                    }
                    setRead(rm);
                });

                /* Insert into header, before chevron */
                var header = qs('.kb-entry-header', entry);
                var chevron = qs('.kb-chevron', entry);
                if (header && chevron) {
                    header.insertBefore(btn, chevron);
                }
            });
        })();

        /* ═══════════════════════════════════════════
           12. Reading Time Estimate
           ═══════════════════════════════════════════ */
        (function readTime() {
            if (!isPhase) return;
            qsa('.kb-entry').forEach(function (entry) {
                var body = qs('.kb-entry-body', entry);
                if (!body) return;
                var words = (body.textContent || '').split(/\s+/).length;
                var mins = Math.max(1, Math.round(words / 200));
                var badge = ce('span', 'ux-read-time', '&#9201; ~' + mins + ' min read');
                var tags = qs('.kb-entry-tags', entry);
                if (tags) tags.appendChild(badge);
            });
        })();

        /* ═══════════════════════════════════════════
           8. Keyboard Shortcuts
           ═══════════════════════════════════════════ */
        (function shortcuts() {
            /* Show shortcut hint */
            var searchInput = qs('#searchInput') || qs('.search-box input') || qs('#globalSearch');
            var hint = ce('div', 'ux-shortcut-hint',
                '<span><kbd>Ctrl+K</kbd> or <kbd>/</kbd> Search</span>' +
                '<span><kbd>Esc</kbd> Clear</span>' +
                '<span><kbd>T</kbd> Theme</span>' +
                '<span><kbd>↑</kbd> Top</span>'
            );
            if (searchInput && searchInput.parentNode) {
                searchInput.parentNode.appendChild(hint);
            }

            document.addEventListener('keydown', function (e) {
                var tag = (e.target.tagName || '').toLowerCase();
                var inInput = tag === 'input' || tag === 'textarea' || tag === 'select';

                /* Ctrl+K or / — focus search */
                if ((e.ctrlKey && e.key === 'k') || (!inInput && e.key === '/')) {
                    e.preventDefault();
                    if (searchInput) { searchInput.focus(); searchInput.select(); }
                }

                /* Esc — blur & clear search */
                if (e.key === 'Escape' && searchInput) {
                    searchInput.value = '';
                    searchInput.blur();
                    if (typeof filterEntries === 'function') filterEntries();
                    if (typeof filterKBIndex === 'function') filterKBIndex();
                }

                /* T — toggle theme (when not in input) */
                if (!inInput && e.key === 't') {
                    var tb = qs('.ux-theme-btn');
                    if (tb) tb.click();
                }

                /* Home — scroll to top */
                if (!inInput && e.key === 'Home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        })();

        /* ═══════════════════════════════════════════
           11. Search Term Highlighting
           ═══════════════════════════════════════════ */
        (function searchHighlight() {
            var searchInput = qs('#searchInput') || qs('#globalSearch');
            if (!searchInput || !isPhase) return;

            var origHTML = {};
            qsa('.kb-entry').forEach(function (e, i) {
                origHTML[i] = qs('.kb-entry-title', e) ? qs('.kb-entry-title', e).innerHTML : '';
            });

            searchInput.addEventListener('input', function () {
                var term = searchInput.value.trim().toLowerCase();
                qsa('.kb-entry').forEach(function (entry, i) {
                    var titleEl = qs('.kb-entry-title', entry);
                    if (!titleEl) return;
                    if (!term || term.length < 2) {
                        titleEl.innerHTML = origHTML[i];
                        return;
                    }
                    var orig = origHTML[i];
                    var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                    titleEl.innerHTML = orig.replace(regex, '<mark class="ux-search-mark">$1</mark>');
                });
            });
        })();

        /* ═══════════════════════════════════════════
           13. Page Load Animations (stagger fade-in)
           ═══════════════════════════════════════════ */
        (function loadAnim() {
            var entries = qsa('.kb-entry, .phase-card, .stat-card, .dt-category');
            entries.forEach(function (el, i) {
                el.classList.add('ux-fade-in');
                el.style.animationDelay = Math.min(i * 0.06, 0.6) + 's';
            });
        })();

        /* ═══════════════════════════════════════════
           9. Print / Export-Friendly CSS
           — injected as @media print in <style>
           ═══════════════════════════════════════════ */
        /* (handled in CSS block below) */

    }); /* end DOMContentLoaded */


    /* ═══════════════════════════════════════════════
       CSS — All enhancements
       ═══════════════════════════════════════════════ */
    var style = document.createElement('style');
    style.textContent =
        /* 2. Progress bar */
        '.ux-progress{position:fixed;top:0;left:0;height:3px;width:0;' +
        'background:linear-gradient(90deg,var(--accent),var(--accent-light),var(--success));' +
        'z-index:9999;transition:width 0.1s linear;border-radius:0 2px 2px 0;' +
        'box-shadow:0 0 8px rgba(0,180,216,0.4);}' +

        /* 3. Back-to-top */
        '.ux-btt{position:fixed;bottom:2rem;right:2rem;width:44px;height:44px;border-radius:50%;' +
        'background:var(--accent);color:#fff;border:none;font-size:1.4rem;cursor:pointer;' +
        'opacity:0;visibility:hidden;transform:translateY(10px);transition:all 0.3s;' +
        'z-index:9000;display:flex;align-items:center;justify-content:center;' +
        'box-shadow:0 4px 16px rgba(0,180,216,0.3);}' +
        '.ux-btt.visible{opacity:1;visibility:visible;transform:translateY(0);}' +
        '.ux-btt:hover{background:var(--accent-light);transform:translateY(-2px) scale(1.05);}' +

        /* 6. Theme toggle button */
        '.ux-theme-btn{background:rgba(143,163,184,0.1);border:1px solid rgba(143,163,184,0.2);' +
        'color:var(--text-secondary);border-radius:20px;padding:0.35rem 0.85rem;cursor:pointer;' +
        'font-size:1rem;transition:all 0.3s;display:inline-flex;align-items:center;gap:0.3rem;}' +
        '.ux-theme-btn:hover{border-color:var(--accent);color:var(--accent-light);background:rgba(0,180,216,0.1);}' +

        /* Light theme overrides */
        '.ux-light .header,.ux-light .hero{background:linear-gradient(135deg,#e8edf2 0%,#f0f2f5 50%,#e4e7eb 100%) !important;}' +
        '.ux-light .header h1{-webkit-text-fill-color:unset !important;color:var(--accent) !important;' +
        'background:none !important;}' +
        '.ux-light .header h1 span{-webkit-text-fill-color:unset !important;color:var(--text-secondary) !important;}' +
        '.ux-light .hero h1{-webkit-text-fill-color:unset !important;color:var(--accent) !important;background:none !important;}' +
        '.ux-light code,.ux-light .vfy-cmd{background:rgba(0,0,0,0.05) !important;color:#1a2733 !important;}' +
        '.ux-light pre{background:#eef1f5 !important;color:#1a2733 !important;}' +

        /* 14. Hamburger / Mobile nav */
        '.ux-burger{display:none;background:var(--bg-card);border:1px solid var(--border);' +
        'color:var(--text-primary);font-size:1.4rem;padding:0.4rem 0.8rem;border-radius:8px;' +
        'cursor:pointer;position:relative;z-index:200;margin:0.5rem 2rem 0;}' +
        '@media(max-width:768px){' +
        '.ux-burger{display:block;}' +
        '.ux-nav{display:none !important;flex-direction:column !important;' +
        'position:absolute;top:100%;left:0;right:0;background:var(--bg-secondary);' +
        'border-bottom:1px solid var(--border);padding:1rem !important;z-index:150;' +
        'box-shadow:0 8px 24px rgba(0,0,0,0.4);}' +
        '.ux-nav.ux-nav-open{display:flex !important;}' +
        '.ux-nav a{width:100% !important;text-align:center !important;}' +
        '.header-inner{flex-wrap:wrap;}' +
        '}' +

        /* 10. Breadcrumb */
        '.ux-breadcrumb{max-width:1400px;margin:0 auto;padding:0.75rem 2rem 0;font-size:0.78rem;' +
        'display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;}' +
        '.ux-breadcrumb a{color:var(--accent-light);text-decoration:none;transition:color 0.2s;}' +
        '.ux-breadcrumb a:hover{color:var(--accent);text-decoration:underline;}' +
        '.ux-bc-sep{color:var(--text-muted);font-size:0.9rem;}' +
        '.ux-bc-current{color:var(--text-secondary);font-weight:600;}' +

        /* 1. Toast container */
        '.ux-toast-container{position:fixed;bottom:5rem;right:2rem;z-index:10000;' +
        'display:flex;flex-direction:column-reverse;gap:0.5rem;pointer-events:none;}' +
        '.ux-toast{padding:0.65rem 1.2rem;border-radius:10px;font-size:0.82rem;font-weight:600;' +
        'color:#fff;opacity:0;transform:translateX(20px);transition:all 0.3s;pointer-events:auto;' +
        'box-shadow:0 4px 16px rgba(0,0,0,0.3);}' +
        '.ux-toast.show{opacity:1;transform:translateX(0);}' +
        '.ux-toast-success{background:linear-gradient(135deg,#2ec4b6,#1fa89c);}' +
        '.ux-toast-info{background:linear-gradient(135deg,#00b4d8,#0096b7);}' +

        /* 4. Highlight entry on deep link */
        '.ux-highlight-entry{animation:ux-pulse 2.5s ease-out;}' +
        '@keyframes ux-pulse{0%{box-shadow:0 0 0 4px rgba(0,180,216,0.5);}100%{box-shadow:none;}}' +

        /* 5. Collapsible enrichment sections */
        '.ux-collapsible{cursor:pointer;user-select:none;display:flex;align-items:center;' +
        'justify-content:space-between;padding-right:0.5rem;transition:color 0.2s;}' +
        '.ux-collapsible:hover{color:var(--accent-light);}' +
        '.ux-sec-chev{font-size:0.6rem;transition:transform 0.3s;margin-left:auto;' +
        'color:var(--text-muted);padding-left:0.5rem;}' +
        '.ux-collapsed .ux-sec-chev{transform:rotate(-90deg);}' +

        /* 7. Bookmark button */
        '.ux-bookmark{background:rgba(143,163,184,0.08);border:1px solid rgba(143,163,184,0.15);' +
        'color:var(--text-muted);border-radius:8px;width:36px;height:36px;font-size:1.1rem;' +
        'cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;' +
        'flex-shrink:0;}' +
        '.ux-bookmark:hover{border-color:var(--accent);color:var(--accent-light);background:rgba(0,180,216,0.1);}' +
        '.ux-bookmark.ux-read{border-color:var(--success);color:var(--success-light);' +
        'background:rgba(46,196,182,0.1);}' +
        '.ux-entry-read{border-left:3px solid var(--success) !important;}' +

        /* 12. Read time badge */
        '.ux-read-time{font-size:0.65rem;padding:0.15rem 0.5rem;border-radius:4px;' +
        'background:rgba(143,163,184,0.08);color:var(--text-muted);border:1px solid rgba(143,163,184,0.12);' +
        'margin-left:0.25rem;}' +

        /* 8. Shortcut hint */
        '.ux-shortcut-hint{display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:0.5rem;' +
        'justify-content:center;opacity:0.5;font-size:0.7rem;color:var(--text-muted);}' +
        '.ux-shortcut-hint span{display:inline-flex;align-items:center;gap:0.3rem;}' +
        '.ux-shortcut-hint kbd{background:var(--bg-card);border:1px solid var(--border);' +
        'border-radius:4px;padding:0.1rem 0.4rem;font-family:inherit;font-size:0.65rem;' +
        'color:var(--text-secondary);}' +

        /* 11. Search highlight */
        '.ux-search-mark{background:rgba(0,180,216,0.3);color:var(--text-primary);' +
        'padding:0 2px;border-radius:2px;}' +

        /* 13. Fade-in animation */
        '.ux-fade-in{opacity:0;animation:ux-fadeUp 0.5s ease forwards;}' +
        '@keyframes ux-fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}' +

        /* 9. Print styles */
        '@media print{' +
        'body{background:#fff !important;color:#000 !important;font-size:11pt;}' +
        '.header,.hero,.ux-progress,.ux-btt,.ux-burger,.ux-theme-btn,.ux-breadcrumb,' +
        '.ux-bookmark,.ux-shortcut-hint,.ux-toast-container,.search-bar,.search-section,' +
        '.stats-bar,.stats-section,.nav-tabs,.phase-nav,nav,.filter-tabs,.filter-section,' +
        '.search-box,.search-hint{display:none !important;}' +
        '.kb-entry{break-inside:avoid;border:1px solid #ccc !important;margin-bottom:1rem;page-break-inside:avoid;}' +
        '.kb-entry-body{display:block !important;border-top:1px solid #ccc;}' +
        '.kb-entry .kb-chevron{display:none;}' +
        'code,pre{background:#f5f5f5 !important;color:#000 !important;border:1px solid #ddd;}' +
        '.tag,.badge{border:1px solid #999 !important;background:#f5f5f5 !important;color:#333 !important;}' +
        'a{color:#0066cc !important;text-decoration:underline;}' +
        '.container{max-width:100% !important;padding:0 1rem !important;}' +
        '}';

    document.head.appendChild(style);
})();
