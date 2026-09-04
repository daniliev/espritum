// ── Espritum — Diagnostic Gemini (TEMPORAIRE) ──
// Répond à deux questions qu'on ne peut pas poser autrement depuis l'extérieur :
// quels modèles la clé peut-elle utiliser, et que répond exactement celui qui
// est configuré. Ne renvoie jamais la clé.
// À supprimer une fois le problème de modèle réglé.

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'GEMINI_API_KEY absente' });

  const configured = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const out = { configured, models: null, listError: null, test: null };

  // 1) Modèles réellement accessibles à cette clé
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key + '&pageSize=200');
    const d = await r.json();
    if (!r.ok) {
      out.listError = { status: r.status, message: d && d.error && d.error.message };
    } else {
      out.models = (d.models || [])
        .filter(function (m) { return (m.supportedGenerationMethods || []).indexOf('generateContent') >= 0; })
        .map(function (m) { return String(m.name).replace('models/', ''); });
    }
  } catch (e) {
    out.listError = { status: 0, message: e.message };
  }

  // 2) Appel de test sur le modèle demandé (?model=), avec image si ?image=1 :
  //    c'est la vision qui échoue, pas le texte.
  const target = (req.query && req.query.model) || configured;
  const withImage = !!(req.query && req.query.image);
  out.tested = target;
  out.withImage = withImage;
  const PIXEL = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const parts = withImage
    ? [{ text: 'Que vois-tu ?' }, { inlineData: { mimeType: 'image/png', data: PIXEL } }]
    : [{ text: 'ping' }];
  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + target + ':generateContent?key=' + key,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: parts }], generationConfig: { maxOutputTokens: 5 } })
      }
    );
    const d = await r.json();
    out.test = {
      status: r.status,
      ok: r.ok,
      message: r.ok ? 'ok' : (d && d.error && d.error.message),
      code: !r.ok && d && d.error && d.error.status
    };
  } catch (e) {
    out.test = { status: 0, ok: false, message: e.message };
  }

  return res.status(200).json(out);
}
