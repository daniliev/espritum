// ── Espritum — Cache Buster ──
// Ajoute ?v=VERSION dans l'URL pour forcer le navigateur à recharger les fichiers.
(function () {
  var APP_VERSION = 130;
  var params = new URLSearchParams(window.location.search);
  if (params.get('v') !== String(APP_VERSION)) {
    params.set('v', APP_VERSION);
    // Remplace l'URL avec la version — force un rechargement propre sans boucle
    window.location.replace(window.location.pathname + '?' + params.toString() + (window.location.hash || ''));
  }
})();

// ── Espritum — Page Loader ──
// Portail width:0/height:0 → position:fixed viewport → ZERO impact layout.
(function () {
  'use strict';

  var GIF_DURATION  = 2400; // 1 tour complet = 2.4s (24 frames)

  var shownAt       = null;
  var portalEl      = null;  // div conteneur width:0 height:0
  var overlayEl     = null;  // div plein écran #212121
  var hideScheduled = false;

  // ── Créer portail + overlay ──────────────────────────────────────
  function buildLoader() {
    var p = document.createElement('div');
    p.id  = 'esp-portal';
    p.style.cssText =
      'position:fixed;top:0;left:0;' +
      'width:0;height:0;overflow:visible;' +
      'z-index:2147483647;pointer-events:none;';

    var ov = document.createElement('div');
    ov.style.cssText =
      'position:fixed;top:0;left:0;right:0;bottom:0;' +
      'background:#202020;' +
      'display:flex;align-items:center;justify-content:center;' +
      'opacity:1;transition:opacity .4s ease;pointer-events:all;';

    var img = document.createElement('img');
    img.src           = 'espritum-loader.gif';
    img.style.cssText = 'width:100px;height:100px;object-fit:contain;display:block;';

    ov.appendChild(img);
    p.appendChild(ov);

    return { portal: p, overlay: ov };
  }

  // ── Masquer et supprimer ─────────────────────────────────────────
  function hideLoader() {
    if (!overlayEl) return;
    var ov = overlayEl;
    var p  = portalEl;
    overlayEl = null;
    portalEl  = null;

    ov.style.opacity = '0';
    setTimeout(function () {
      if (p && p.parentNode) p.parentNode.removeChild(p);
    }, 450);
  }

  function scheduleHide() {
    if (hideScheduled) return;
    hideScheduled = true;
    var elapsed   = Date.now() - shownAt;
    // Toujours attendre la fin du cycle GIF en cours (min 1 tour complet)
    var remaining = GIF_DURATION - (elapsed % GIF_DURATION);
    setTimeout(hideLoader, remaining + 60);
  }

  // ── Montage ──────────────────────────────────────────────────────
  function mount() {
    if (document.getElementById('esp-portal')) return;

    shownAt = Date.now();

    var els   = buildLoader();
    portalEl  = els.portal;
    overlayEl = els.overlay;  // ← correctement assigné

    document.body.appendChild(portalEl);

    // Si window.load a déjà eu lieu (page très rapide), cache immédiatement
    if (document.readyState === 'complete') {
      scheduleHide();
    } else {
      window.addEventListener('load', scheduleHide);
    }
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }

  // ── Overlay de navigation entre pages ────────────────────────────
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href ||
        href.charAt(0) === '#' ||
        href.indexOf('javascript') === 0 ||
        href.indexOf('http')       === 0 ||
        href.indexOf('mailto')     === 0 ||
        a.target === '_blank') return;

    var current = window.location.pathname.split('/').pop() || 'index.html';
    if (href === current) return;

    e.preventDefault();

    var els2       = buildLoader();
    var navPortal  = els2.portal;
    var navOverlay = els2.overlay;
    navOverlay.style.opacity = '0'; // démarre invisible
    document.body.appendChild(navPortal);

    var target = href;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        navOverlay.style.opacity = '1';
        // Navigue après le fade-in + un peu de marge
        setTimeout(function () {
          window.location.href = target;
        }, 450);
      });
    });
  }, true);

})();
