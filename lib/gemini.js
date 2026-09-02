// ── Espritum — Appel Gemini avec reprise sur surcharge ──
//
// Le modèle renvoie régulièrement 503 « This model is currently experiencing
// high demand ». Sans reprise, l'utilisateur voit « l'analyse a échoué » sur une
// photo parfaitement valide et croit que c'est sa photo le problème.
//
// Renvoie { ok, data } en cas de succès, sinon { ok:false, status, data, busy }
// où busy distingue une surcharge passagère d'une vraie erreur.

const RETRYABLE = [429, 500, 502, 503, 504];
const MODEL = 'gemini-3.6-flash';
// Délai par tentative. Gemini ne répond pas toujours 503 : il lui arrive de
// PENDRE. Sans cette borne, la fonction tournait jusqu'à sa limite de 60 s et
// l'utilisateur attendait une minute pour rien.
const ATTEMPT_MS = 12000;

function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

export async function callGemini(key, payload, opts) {
  const tries = (opts && opts.tries) || 3;
  const model = (opts && opts.model) || MODEL;
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + key;
  let last = { status: 0, data: null };

  for (let i = 0; i < tries; i++) {
    let resp;
    const ctrl = new AbortController();
    const timer = setTimeout(function () { ctrl.abort(); }, (opts && opts.attemptMs) || ATTEMPT_MS);
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal
      });
    } catch (e) {
      clearTimeout(timer);
      last = { status: 0, data: { error: { message: e.name === 'AbortError' ? 'timeout' : e.message } } };
      if (i === tries - 1) break;
      await wait(700 * Math.pow(2, i));
      continue;
    }
    clearTimeout(timer);

    const data = await resp.json().catch(function () { return null; });
    if (resp.ok) return { ok: true, data: data };

    last = { status: resp.status, data: data };
    if (RETRYABLE.indexOf(resp.status) < 0 || i === tries - 1) break;
    await wait(700 * Math.pow(2, i));   // 0,7 s puis 1,4 s
  }

  return {
    ok: false,
    status: last.status,
    data: last.data,
    busy: last.status === 0 || RETRYABLE.indexOf(last.status) >= 0
  };
}

// Extrait le JSON de la réponse Gemini, ou null.
export function parseGemini(data) {
  const txt = data && data.candidates && data.candidates[0] && data.candidates[0].content &&
    data.candidates[0].content.parts && data.candidates[0].content.parts[0] &&
    data.candidates[0].content.parts[0].text;
  if (!txt) return null;
  try { return JSON.parse(txt); } catch (e) { return null; }
}
