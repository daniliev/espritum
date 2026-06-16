// ── Espritum — Switcher de langue FR/EN (pages marketing uniquement) ──
// Indépendant de l'app. Traduit les éléments marqués data-en="..." (texte anglais).
// Le contenu HTML par défaut = français. data-en peut contenir du HTML.
// Placeholders : data-en-ph="...". Re-rendu dynamique : window.onEspLangChange(lang).
(function () {
  function getLang() { return localStorage.getItem('esp_lang') === 'en' ? 'en' : 'fr'; }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.hasAttribute('data-fr')) el.setAttribute('data-fr', el.innerHTML);
      el.innerHTML = (lang === 'en') ? el.getAttribute('data-en') : el.getAttribute('data-fr');
    });

    document.querySelectorAll('[data-en-ph]').forEach(function (el) {
      if (!el.hasAttribute('data-fr-ph')) el.setAttribute('data-fr-ph', el.getAttribute('placeholder') || '');
      el.setAttribute('placeholder', (lang === 'en') ? el.getAttribute('data-en-ph') : el.getAttribute('data-fr-ph'));
    });

    document.querySelectorAll('.esp-lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-l') === lang);
    });

    window.espLang = lang;
    if (typeof window.onEspLangChange === 'function') {
      try { window.onEspLangChange(lang); } catch (e) {}
    }
  }

  window.espSetLang = function (lang) {
    localStorage.setItem('esp_lang', lang);
    apply(lang);
  };
  window.espGetLang = getLang;

  function buildToggle() {
    document.querySelectorAll('#esp-lang, [data-lang-switch]').forEach(function (h) {
      if (h.querySelector('.esp-lang-btn')) return;
      h.classList.add('esp-lang');
      h.innerHTML =
        '<button type="button" class="esp-lang-btn" data-l="fr" onclick="espSetLang(\'fr\')">FR</button>' +
        '<span class="esp-lang-sep">/</span>' +
        '<button type="button" class="esp-lang-btn" data-l="en" onclick="espSetLang(\'en\')">EN</button>';
    });
  }

  var css =
    '.esp-lang{display:inline-flex;align-items:center;gap:1px;vertical-align:middle;}' +
    '.esp-lang-btn{background:none;border:none;color:#888;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:1px;cursor:pointer;padding:4px 5px;text-transform:uppercase;transition:color .2s;line-height:1;}' +
    '.esp-lang-btn.active{color:#fff;}' +
    '.esp-lang-btn:hover{color:#c82828;}' +
    '.esp-lang-sep{color:#444;font-size:12px;}' +
    '@media (max-width:560px){.brand span,.topbar-name,.nav-name{display:none;}}';
  var st = document.createElement('style');
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  function init() { buildToggle(); apply(getLang()); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
