// ── Espritum — Portail d'accès Admin ──
// Verrou côté navigateur : 1 nom d'utilisateur + 3 mots de passe + 1 bouton caché
// à cliquer 3 fois AVANT de valider. À inclure dans le <head> de chaque page admin :
//   <script src="admin-auth.js"></script>
//
// ⚠️ Sécurité : ce verrou décourage les visiteurs, mais la vraie protection des
// données reste les règles RLS de Supabase. Ne le considère pas comme inviolable.
//
// ───────────────────────────────────────────────────────────────────────────
//  PERSONNALISER tes identifiants :
//   1) Choisis ton nom d'utilisateur ci-dessous (USERNAME).
//   2) Pour changer un mot de passe : ouvre la console (F12) sur la page admin,
//      tape  espHash('TON_NOUVEAU_MOT_DE_PASSE')  → copie l'empreinte affichée,
//      et remplace la valeur correspondante dans PASS_HASHES.
// ───────────────────────────────────────────────────────────────────────────
(function () {
  'use strict';

  // ===================== CONFIG =====================
  var USERNAME = 'espritum-admin';
  // Empreintes SHA-256 des 3 mots de passe (dans l'ordre demandé à la connexion)
  // Par défaut : « Esprit2026 », « NotJustFlesh », « ButSpirit »
  var PASS_HASHES = [
    '4c3d07b6ec4e0c2f21b7cc6171c50abc8fa0a5b0f8e6608eff3110ecc926c9ed',
    '64c3e37f6739067a154b411f68b343bcb3b304c975cb2a91e189f7700be3f9aa',
    'bef1a22d65772829d1d2db0c10d55be177b8d76716b3c9d597fae9d98733c542'
  ];
  var REQUIRED_CLICKS = 3;      // nombre de clics sur le bouton caché
  var SALT = 'esp::';           // sel ajouté avant le hachage
  // =================================================

  var SESSION_KEY = 'esp_admin_session';
  var SESSION_TOKEN = 'unlocked-v1';

  // Helper de hachage exposé pour générer de nouvelles empreintes en console
  async function espHash(pw) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(SALT + pw));
    var hex = Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    console.log('Empreinte pour « ' + pw + ' » :\n' + hex);
    return hex;
  }
  window.espHash = espHash;

  // Déjà authentifié dans cette session → on laisse passer
  if (sessionStorage.getItem(SESSION_KEY) === SESSION_TOKEN) return;

  // Masque la page tant qu'on n'est pas connecté
  var lock = document.createElement('style');
  lock.id = 'esp-admin-lock';
  lock.textContent = 'html{overflow:hidden !important;} body > *:not(#esp-gate){ visibility:hidden !important; }';
  (document.head || document.documentElement).appendChild(lock);

  function buildGate() {
    if (document.getElementById('esp-gate')) return;

    var cssText = [
      "#esp-gate{position:fixed;inset:0;z-index:2147483646;background:#060606;display:flex;align-items:center;justify-content:center;overflow:hidden;font-family:'acumin-pro-condensed','Barlow Semi Condensed',sans-serif;}",
      "#esp-gate *{box-sizing:border-box;}",
      ".eg-grid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(auto-fill,56px);grid-auto-rows:56px;justify-content:end;align-content:end;z-index:1;}",
      ".eg-cell{border-right:1px solid rgba(255,255,255,.035);border-bottom:1px solid rgba(255,255,255,.035);}",
      ".eg-cell.secret{cursor:pointer;transition:background .15s;}",
      ".eg-cell.secret:hover{background:rgba(200,40,40,.16);}",
      ".eg-cell.flash{background:rgba(200,40,40,.5);}",
      ".eg-card{position:relative;z-index:2;width:380px;max-width:92vw;background:#0a0a0a;border:1px solid #181818;border-radius:14px;padding:34px 30px;box-shadow:0 30px 80px rgba(0,0,0,.65);animation:egIn .4s ease;}",
      "@keyframes egIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}",
      ".eg-shake{animation:egShake .4s;}",
      "@keyframes egShake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-8px);}40%,80%{transform:translateX(8px);}}",
      ".eg-tag{font-size:10px;letter-spacing:4px;color:#c82828;text-transform:uppercase;font-weight:700;margin-bottom:8px;text-align:center;}",
      ".eg-title{font-family:'acumin-pro-extra-condensed','Bebas Neue',sans-serif;font-size:34px;letter-spacing:2px;text-transform:uppercase;color:#fff;text-align:center;line-height:1;margin-bottom:26px;}",
      ".eg-label{font-size:9px;letter-spacing:2px;color:#555;text-transform:uppercase;font-weight:700;display:block;margin:14px 0 6px;}",
      ".eg-input{width:100%;padding:12px 14px;background:#0f0f0f;border:1px solid #1e1e1e;border-radius:7px;color:#fff;font-family:inherit;font-size:14px;letter-spacing:3px;outline:none;transition:border-color .2s;-webkit-text-security:disc;text-security:disc;}",
      ".eg-input.user{-webkit-text-security:none;text-security:none;letter-spacing:0;}",
      ".eg-input:focus{border-color:rgba(200,40,40,.5);}",
      ".eg-btn{width:100%;margin-top:24px;padding:14px;background:#c82828;border:none;border-radius:7px;color:#fff;font-family:inherit;font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:background .2s;}",
      ".eg-btn:hover{background:#d93030;}",
      ".eg-err{color:#ef5350;font-size:12px;text-align:center;margin-top:14px;min-height:16px;}"
    ].join('');
    var style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);

    // Attributs pour empêcher l'auto-remplissage des navigateurs / gestionnaires
    var IGN = 'autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" data-lpignore="true" data-1p-ignore data-form-type="other"';

    var gate = document.createElement('div');
    gate.id = 'esp-gate';
    gate.innerHTML =
      '<div class="eg-grid" id="eg-grid"></div>' +
      '<div class="eg-card" id="eg-card">' +
        '<div class="eg-tag">Zone restreinte</div>' +
        '<div class="eg-title">Accès Admin</div>' +
        '<label class="eg-label">Nom d\'utilisateur</label>' +
        '<input class="eg-input user" id="eg-user" type="text" name="eg_field_a" ' + IGN + '>' +
        '<label class="eg-label">Mot de passe 1</label>' +
        '<input class="eg-input" id="eg-p1" type="text" name="eg_field_b" ' + IGN + '>' +
        '<label class="eg-label">Mot de passe 2</label>' +
        '<input class="eg-input" id="eg-p2" type="text" name="eg_field_c" ' + IGN + '>' +
        '<label class="eg-label">Mot de passe 3</label>' +
        '<input class="eg-input" id="eg-p3" type="text" name="eg_field_d" ' + IGN + '>' +
        '<button class="eg-btn" id="eg-go">Valider</button>' +
        '<div class="eg-err" id="eg-err"></div>' +
      '</div>';
    document.body.appendChild(gate);

    // ── Grille décorative : la case en bas à droite est le bouton secret ──
    var clicks = 0;
    function onSecretClick(e) {
      clicks++;
      var cell = e.currentTarget;
      cell.classList.add('flash');
      setTimeout(function () { cell.classList.remove('flash'); }, 150);
    }
    function buildGrid() {
      var grid = document.getElementById('eg-grid');
      var size = 56;
      var cols = Math.max(1, Math.floor(window.innerWidth / size));
      var rows = Math.ceil(window.innerHeight / size) + 1;
      var total = cols * rows;
      var html = '';
      for (var i = 0; i < total; i++) html += '<div class="eg-cell"></div>';
      grid.innerHTML = html;
      var last = grid.lastChild;            // case bas-droite
      last.className = 'eg-cell secret';
      last.id = 'eg-secret';
      last.addEventListener('click', onSecretClick);
    }
    buildGrid();
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { clicks = 0; buildGrid(); }, 200);
    });

    function fail(msg) {
      var card = document.getElementById('eg-card');
      var err = document.getElementById('eg-err');
      err.textContent = msg || 'Identifiants incorrects.';
      card.classList.remove('eg-shake');
      void card.offsetWidth;
      card.classList.add('eg-shake');
      clicks = 0; // réinitialise la séquence du bouton secret
    }

    async function espHashSilent(pw) {
      var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(SALT + pw));
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    async function validate() {
      var user = document.getElementById('eg-user').value.trim();
      var p1 = document.getElementById('eg-p1').value;
      var p2 = document.getElementById('eg-p2').value;
      var p3 = document.getElementById('eg-p3').value;

      if (clicks < REQUIRED_CLICKS) { fail('Accès refusé.'); return; }
      if (user !== USERNAME) { fail('Accès refusé.'); return; }

      var h1 = await espHashSilent(p1);
      var h2 = await espHashSilent(p2);
      var h3 = await espHashSilent(p3);
      if (h1 === PASS_HASHES[0] && h2 === PASS_HASHES[1] && h3 === PASS_HASHES[2]) {
        sessionStorage.setItem(SESSION_KEY, SESSION_TOKEN);
        var l = document.getElementById('esp-admin-lock');
        if (l) l.remove();
        gate.remove();
      } else {
        fail('Accès refusé.');
      }
    }

    document.getElementById('eg-go').addEventListener('click', validate);
    gate.addEventListener('keydown', function (e) { if (e.key === 'Enter') validate(); });
    document.getElementById('eg-user').focus();
  }

  if (document.body) buildGate();
  else document.addEventListener('DOMContentLoaded', buildGate);
})();
