// ── Espritum — Scan repas (Vercel Serverless Function) ──
// Reçoit une photo d'assiette, appelle Gemini Vision, renvoie les aliments détectés
// avec grammes estimés + calories + macros. Clé GEMINI_API_KEY côté serveur uniquement.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });

  try {
    const { image, lang } = req.body || {};
    if (!image) return res.status(400).json({ error: 'Photo manquante' });

    const langName = { fr: 'français', en: 'English', bg: 'български' }[lang] || 'français';

    const prompt =
      'Tu es le moteur nutritionnel de l\'app Espritum. On te donne la photo d\'un repas (une assiette). ' +
      'Identifie chaque aliment visible et estime, pour la portion réellement présente sur la photo : ' +
      'les grammes (grams), les calories (kcal), les protéines (protein), glucides (carbs) et lipides (fat) en grammes. ' +
      'Nomme chaque aliment de façon courte et claire en ' + langName + '. ' +
      'Sois réaliste et prudent dans tes estimations. Si l\'image ne montre pas de nourriture, renvoie une liste vide.';

    const payload = {
      contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: image } }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  grams: { type: 'number' },
                  kcal: { type: 'number' },
                  protein: { type: 'number' },
                  carbs: { type: 'number' },
                  fat: { type: 'number' }
                },
                required: ['name', 'grams', 'kcal', 'protein', 'carbs', 'fat']
              }
            }
          },
          required: ['items']
        }
      }
    };

    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + key,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: 'Gemini error', detail: data });

    const txt =
      data && data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts && data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;
    if (!txt) return res.status(502).json({ error: 'Réponse IA vide', detail: data });

    let parsed;
    try { parsed = JSON.parse(txt); } catch (e) { return res.status(502).json({ error: 'JSON invalide', raw: txt }); }
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
