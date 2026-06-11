// ── Espritum — AI Proxy (Vercel Serverless Function) ──
// Proxyfie les appels Groq et Gemini Vision côté serveur.
// Les clés API ne sont JAMAIS exposées côté client.
//
// Variables d'environnement requises (Vercel Dashboard → Settings → Environment Variables) :
//   GROQ_API_KEY   → console.groq.com
//   GEMINI_API_KEY → aistudio.google.com/app/apikey

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { service, systemPrompt, messages, maxTokens, imageBase64, imageMime, prompt } = req.body || {};

  // ── GROQ (LLM texte) ──────────────────────────────────────────────
  if (service === 'groq') {
    const key = process.env.GROQ_API_KEY;
    if (!key) return res.status(503).json({ error: 'GROQ_API_KEY not configured on server' });

    try {
      // model par défaut (texte) — peut être surchargé (ex: modèle vision pour comparer des photos)
      const model = req.body.model || 'llama-3.3-70b-versatile';
      // si systemPrompt fourni, on le préfixe ; sinon on prend messages tel quel (peut contenir des images)
      const allMessages = systemPrompt
        ? [{ role: 'system', content: systemPrompt }].concat(messages || [])
        : (messages || []);
      const payload = {
        model,
        messages: allMessages,
        temperature: (typeof req.body.temperature === 'number') ? req.body.temperature : 0.75,
        max_tokens: maxTokens || 512
      };
      if (req.body.responseFormat) payload.response_format = req.body.responseFormat;

      const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + key
        },
        body: JSON.stringify(payload)
      });
      const data = await upstream.json();
      if (!upstream.ok) return res.status(upstream.status).json(data);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── GEMINI VISION (photo + texte) ─────────────────────────────────
  if (service === 'gemini') {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });

    try {
      const parts = [];
      if (imageBase64 && imageMime) {
        parts.push({ inlineData: { mimeType: imageMime, data: imageBase64 } });
      }
      parts.push({ text: prompt || '' });

      const upstream = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens || 400 }
          })
        }
      );
      const data = await upstream.json();
      if (!upstream.ok) return res.status(upstream.status).json(data);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: 'Unknown service. Use "groq" or "gemini".' });
}
