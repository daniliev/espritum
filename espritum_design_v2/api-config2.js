// ── Espritum Free API Helper ──
// Groq (LLM) + Gemini Vision
// Mode proxy : les appels passent par /api/ai (clé serveur, aucune config utilisateur)
// Mode perso : si l'user a sa propre clé dans localStorage, elle est utilisée en priorité

(function() {
  'use strict';

  // Clés perso stockées localement (optionnel — le proxy fonctionne sans)
  var _personal = {
    groq:   '',
    gemini: ''
  };

  // Proxy URL (Vercel serverless function)
  var PROXY_URL = '/api/ai';

  window.EspritumAPI = {

    // ── Gestion des clés perso (optionnel) ───────────────────────────
    getKey: function(service) {
      var stored = localStorage.getItem('espritum_api_' + service);
      if (stored === null) return _personal[service] || '';
      return stored;
    },
    setKey: function(service, val) {
      localStorage.setItem('espritum_api_' + service, val.trim());
    },
    clearKey: function(service) {
      localStorage.setItem('espritum_api_' + service, '');
    },

    // ── Groq (LLM) ───────────────────────────────────────────────────
    // Tente d'abord la clé perso, sinon passe par le proxy serveur
    groq: async function(systemPrompt, messages, maxTokens) {
      maxTokens = maxTokens || 512;
      var personalKey = this.getKey('groq');

      // ── Mode clé perso ──
      if (personalKey) {
        var resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + personalKey
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
          if (resp.status === 401 || resp.status === 403) {
            this.clearKey('groq');
            // Fallback vers proxy
            return this._groqProxy(systemPrompt, messages, maxTokens);
          }
          throw new Error(errData.error && errData.error.message ? errData.error.message : 'Groq HTTP ' + resp.status);
        }
        var result = await resp.json();
        return result.choices[0].message.content;
      }

      // ── Mode proxy (défaut) ──
      return this._groqProxy(systemPrompt, messages, maxTokens);
    },

    _groqProxy: async function(systemPrompt, messages, maxTokens) {
      var resp = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'groq',
          systemPrompt: systemPrompt,
          messages: messages,
          maxTokens: maxTokens || 512
        })
      });
      if (!resp.ok) {
        var errData = {};
        try { errData = await resp.json(); } catch(e) {}
        throw new Error(errData.error || 'Proxy error ' + resp.status);
      }
      var result = await resp.json();
      return result.choices[0].message.content;
    },

    // ── Gemini Vision (photo) ─────────────────────────────────────────
    // Tente d'abord la clé perso, sinon passe par le proxy serveur
    geminiVision: async function(base64data, mimeType, prompt, maxTokens) {
      maxTokens = maxTokens || 400;
      var personalKey = this.getKey('gemini');

      // ── Mode clé perso ──
      if (personalKey) {
        var resp = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + personalKey,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [
                { inlineData: { mimeType: mimeType, data: base64data } },
                { text: prompt }
              ]}],
              generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens }
            })
          }
        );
        if (!resp.ok) {
          var errData = {};
          try { errData = await resp.json(); } catch(e) {}
          if (resp.status === 401 || resp.status === 403 || resp.status === 429) {
            this.clearKey('gemini');
            // Fallback vers proxy
            return this._geminiProxy(base64data, mimeType, prompt, maxTokens);
          }
          throw new Error(errData.error && errData.error.message ? errData.error.message : 'Gemini HTTP ' + resp.status);
        }
        var result = await resp.json();
        if (!result.candidates || !result.candidates[0]) throw new Error('Gemini: pas de réponse');
        return result.candidates[0].content.parts[0].text;
      }

      // ── Mode proxy (défaut) ──
      return this._geminiProxy(base64data, mimeType, prompt, maxTokens);
    },

    _geminiProxy: async function(base64data, mimeType, prompt, maxTokens) {
      var resp = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'gemini',
          imageBase64: base64data,
          imageMime: mimeType,
          prompt: prompt,
          maxTokens: maxTokens || 400
        })
      });
      if (!resp.ok) {
        var errData = {};
        try { errData = await resp.json(); } catch(e) {}
        throw new Error(errData.error || 'Proxy error ' + resp.status);
      }
      var result = await resp.json();
      if (!result.candidates || !result.candidates[0]) throw new Error('Gemini: pas de réponse');
      return result.candidates[0].content.parts[0].text;
    },

    // ── Modal de configuration (affiché uniquement si proxy indispo) ──
    showSetup: function(service, onSave) {
      var existing = document.getElementById('espritum-api-modal');
      if (existing) existing.remove();

      var isGroq = service === 'groq';
      var title    = isGroq ? 'Clé API Groq' : 'Clé API Google Gemini';
      var link     = isGroq ? 'https://console.groq.com' : 'https://aistudio.google.com/app/apikey';
      var linkText = isGroq ? 'console.groq.com' : 'aistudio.google.com';
      var ph       = isGroq ? 'gsk_...' : 'AIza...';
      var badge    = isGroq ? '✓ Gratuit · Sans CB · 6 000 req/jour' : '✓ Gratuit · Sans CB · 1 500 req/jour';

      var modal = document.createElement('div');
      modal.id = 'espritum-api-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:var(--font-body,"Barlow Semi Condensed",sans-serif)';

      modal.innerHTML = '\
        <div style="background:#0d0d0d;border:1px solid #222;border-radius:10px;padding:36px 32px;width:100%;max-width:460px;text-align:center;">\
          <div style="font-size:40px;margin-bottom:16px;">🔑</div>\
          <div style="font-family:var(--font-display,\'Bebas Neue\',sans-serif);font-size:30px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;color:#fff;">' + title + '</div>\
          <div style="font-size:13px;color:#555;margin-bottom:20px;">' + badge + '</div>\
          <input id="espritum-api-input" type="text" placeholder="' + ph + '" autocomplete="off" autocorrect="off" spellcheck="false"\
            style="width:100%;padding:13px 16px;background:#111;border:1px solid #2a2a2a;border-radius:4px;color:#fff;font-family:monospace;font-size:16px;outline:none;margin-bottom:14px;box-sizing:border-box;">\
          <button id="espritum-api-save" style="width:100%;padding:15px;background:#c82828;border:none;border-radius:4px;color:#fff;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;cursor:pointer;margin-bottom:10px;">✓ Sauvegarder</button>\
          <div style="font-size:11px;color:#333;cursor:pointer;padding:4px;" id="espritum-api-cancel">Annuler</div>\
        </div>';

      document.body.appendChild(modal);
      var input = document.getElementById('espritum-api-input');
      input.focus();
      input.addEventListener('keydown', function(e) { if (e.key === 'Enter') document.getElementById('espritum-api-save').click(); });
      document.getElementById('espritum-api-cancel').onclick = function() { modal.remove(); };
      document.getElementById('espritum-api-save').onclick = function() {
        var val = input.value.trim();
        if (!val) { input.style.borderColor = '#c82828'; input.focus(); return; }
        EspritumAPI.setKey(service, val);
        modal.remove();
        if (typeof onSave === 'function') onSave(val);
      };
    }
  };

})();
