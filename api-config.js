// ── Espritum Free API Helper ──
// Groq (LLM) + Gemini Vision — 100% gratuit, aucune carte bancaire
// Clés stockées dans localStorage, jamais envoyées à nos serveurs.

(function() {
  'use strict';

  // Clés pré-configurées (remplaçables via le modal de configuration)
  var _preset = {
    groq:   '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',
    gemini: 'AIzaSyDLpX4rxlWq2TY_13EI8lXNctuyhPLOUz8'
  };

  // Auto-init au chargement : si pas encore de clé, on pose la valeur par défaut
  Object.keys(_preset).forEach(function(svc) {
    if (!localStorage.getItem('espritum_api_' + svc)) {
      localStorage.setItem('espritum_api_' + svc, _preset[svc]);
    }
  });

  window.EspritumAPI = {

    // ── Gestion des clés ──────────────────────────────────────────
    getKey: function(service) {
      return localStorage.getItem('espritum_api_' + service) || _preset[service] || '';
    },
    setKey: function(service, val) {
      localStorage.setItem('espritum_api_' + service, val.trim());
    },
    clearKey: function(service) {
      localStorage.removeItem('espritum_api_' + service);
    },

    // ── Groq API (LLM gratuit) ────────────────────────────────────
    // Inscription gratuite : console.groq.com
    // Modèle : llama-3.3-70b-versatile · 6 000 req/jour
    groq: async function(systemPrompt, messages, maxTokens) {
      maxTokens = maxTokens || 512;
      var key = this.getKey('groq');
      if (!key) {
        var err = new Error('NO_KEY');
        err.service = 'groq';
        throw err;
      }
      var resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + key
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: systemPrompt }].concat(messages),
          temperature: 0.75,
          max_tokens: maxTokens
        })
      });
      if (!resp.ok) {
        var errData = {};
        try { errData = await resp.json(); } catch(e) {}
        // Clé invalide → effacer
        if (resp.status === 401 || resp.status === 403) {
          this.clearKey('groq');
          var e401 = new Error('INVALID_KEY');
          e401.service = 'groq';
          throw e401;
        }
        throw new Error(errData.error && errData.error.message ? errData.error.message : 'Groq HTTP ' + resp.status);
      }
      var result = await resp.json();
      return result.choices[0].message.content;
    },

    // ── Gemini Vision (gratuit) ───────────────────────────────────
    // Inscription gratuite : aistudio.google.com
    // Modèle : gemini-1.5-flash · 1 500 req/jour
    geminiVision: async function(base64data, mimeType, prompt, maxTokens) {
      maxTokens = maxTokens || 400;
      var key = this.getKey('gemini');
      if (!key) {
        var err = new Error('NO_KEY');
        err.service = 'gemini';
        throw err;
      }
      var resp = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inlineData: { mimeType: mimeType, data: base64data } },
                { text: prompt }
              ]
            }],
            generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens }
          })
        }
      );
      if (!resp.ok) {
        var errData = {};
        try { errData = await resp.json(); } catch(e) {}
        if (resp.status === 400 || resp.status === 401 || resp.status === 403) {
          this.clearKey('gemini');
          var e401 = new Error('INVALID_KEY');
          e401.service = 'gemini';
          throw e401;
        }
        throw new Error(errData.error && errData.error.message ? errData.error.message : 'Gemini HTTP ' + resp.status);
      }
      var result = await resp.json();
      if (!result.candidates || !result.candidates[0]) throw new Error('Gemini: pas de réponse');
      return result.candidates[0].content.parts[0].text;
    },

    // ── Modal de configuration ────────────────────────────────────
    showSetup: function(service, onSave) {
      var existing = document.getElementById('espritum-api-modal');
      if (existing) existing.remove();

      var isGroq = service === 'groq';
      var title    = isGroq ? 'Clé API Groq' : 'Clé API Google Gemini';
      var link     = isGroq ? 'https://console.groq.com' : 'https://aistudio.google.com/app/apikey';
      var linkText = isGroq ? 'console.groq.com' : 'aistudio.google.com';
      var ph       = isGroq ? 'gsk_...' : 'AIza...';
      var badge    = isGroq
        ? '✓ Gratuit · Sans CB · 6 000 req/jour'
        : '✓ Gratuit · Sans CB · 1 500 req/jour';
      var step1 = isGroq
        ? 'Crée un compte gratuit sur <a href="' + link + '" target="_blank" style="color:#c82828;">' + linkText + '</a>'
        : 'Va sur <a href="' + link + '" target="_blank" style="color:#c82828;">' + linkText + '</a>';
      var step2 = isGroq
        ? 'Clique sur <b>API Keys</b> → <b>Create API Key</b>'
        : 'Clique sur <b>Get API key</b> → <b>Create API key in new project</b>';

      var modal = document.createElement('div');
      modal.id = 'espritum-api-modal';
      modal.style.cssText = [
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.93)',
        'z-index:9999',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'padding:20px',
        'font-family:var(--font-body,"Barlow Semi Condensed",sans-serif)'
      ].join(';');

      modal.innerHTML = '\
        <div style="background:#0d0d0d;border:1px solid #222;border-radius:10px;padding:36px 32px;width:100%;max-width:460px;text-align:center;">\
          <div style="font-size:40px;margin-bottom:16px;">🔑</div>\
          <div style="font-family:var(--font-display,\'Bebas Neue\',sans-serif);font-size:30px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;color:#fff;">' + title + '</div>\
          <div style="font-size:13px;color:#555;margin-bottom:6px;">' + badge + '</div>\
          <div style="background:#111;border:1px solid #1e1e1e;border-radius:6px;padding:14px 16px;margin-bottom:20px;text-align:left;">\
            <div style="font-size:12px;color:#aaa;margin-bottom:8px;line-height:1.7;">\
              <span style="color:#c82828;font-weight:700;">① </span>' + step1 + '<br>\
              <span style="color:#c82828;font-weight:700;">② </span>' + step2 + '<br>\
              <span style="color:#c82828;font-weight:700;">③ </span>Copie la clé ci-dessous\
            </div>\
          </div>\
          <input id="espritum-api-input" type="text" placeholder="' + ph + '" autocomplete="off" autocorrect="off" spellcheck="false"\
            style="width:100%;padding:13px 16px;background:#111;border:1px solid #2a2a2a;border-radius:4px;color:#fff;font-family:monospace;font-size:13px;outline:none;margin-bottom:14px;box-sizing:border-box;">\
          <button id="espritum-api-save" style="width:100%;padding:15px;background:#c82828;border:none;border-radius:4px;color:#fff;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;cursor:pointer;margin-bottom:10px;">\
            ✓ Sauvegarder et continuer\
          </button>\
          <div style="font-size:11px;color:#333;cursor:pointer;padding:4px;" id="espritum-api-cancel">Annuler</div>\
          <div style="font-size:10px;color:#222;margin-top:12px;letter-spacing:1px;">Clé stockée localement sur ton appareil uniquement</div>\
        </div>';

      document.body.appendChild(modal);

      var input = document.getElementById('espritum-api-input');
      input.focus();

      // Entrée clavier
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') document.getElementById('espritum-api-save').click();
      });

      document.getElementById('espritum-api-cancel').onclick = function() {
        modal.remove();
      };

      document.getElementById('espritum-api-save').onclick = function() {
        var val = input.value.trim();
        if (!val) {
          input.style.borderColor = '#c82828';
          input.focus();
          return;
        }
        EspritumAPI.setKey(service, val);
        modal.remove();
        if (typeof onSave === 'function') onSave(val);
      };
    }
  };

})();
