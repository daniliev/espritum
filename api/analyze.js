// ── Espritum — Analyse corporelle (Vercel Serverless Function) ──
// Reçoit 2 photos (corps actuel + corps de rêve) + le questionnaire + le délai,
// appelle Gemini, et renvoie un résultat structuré.
// La clé GEMINI_API_KEY reste ICI (variable d'env Vercel), jamais côté navigateur.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });

  try {
    const { current, goal, quiz, months, lang } = req.body || {};
    if (!current) return res.status(400).json({ error: 'Photo actuelle manquante' });

    const langName = { fr: 'français', en: 'English', bg: 'български' }[lang] || 'français';

    const q = quiz || {};
    const profile = [
      'sexe: ' + (q.sex || '?'),
      'âge: ' + (q.age || '?'),
      'taille(cm): ' + (q.height || '?'),
      'poids(kg): ' + (q.weight || '?'),
      'zone de gras: ' + (q.fat || '?'),
      'objectif: ' + (q.goal || '?'),
      'niveau d\'activité: ' + (q.activity || '?'),
      'séances par semaine: ' + (q.freq || '?'),
      'délai souhaité (mois): ' + (months || '?')
    ].join(' · ');

    const prompt =
      'Tu es Sensei, le coach sportif chrétien de l\'application Espritum : exigeant, direct, ' +
      'motivant, jamais complaisant mais toujours respectueux. ' +
      'On te donne deux photos : la PREMIÈRE est le corps ACTUEL de l\'utilisateur, ' +
      'la SECONDE (si présente) est son corps de RÊVE (objectif). ' +
      'Profil de l\'utilisateur : ' + profile + '. ' +
      'Analyse la première photo : estime son pourcentage de masse grasse (bodyFatCurrent) et sa morphologie. ' +
      'Compare à l\'objectif et au profil, puis calcule un délai RÉALISTE en mois (aiMonths) pour atteindre ce corps ' +
      '(sois honnête : c\'est souvent différent du délai souhaité). ' +
      'Rédige un "verdict" percutant façon Sensei (2 à 3 phrases). ' +
      'Donne exactement 3 conseils personnalisés (advice) : chacun avec un titre court (title) et une explication (body), ' +
      'couvrant entraînement, nutrition et discipline. ' +
      'Écris TOUT (verdict, titres, explications) en ' + langName + '. ' +
      'Ne dis jamais que tu es une IA, reste dans le personnage de Sensei.';

    const parts = [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: current } }];
    if (goal) parts.push({ inlineData: { mimeType: 'image/jpeg', data: goal } });

    const payload = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            bodyFatCurrent: { type: 'number' },
            aiMonths: { type: 'number' },
            verdict: { type: 'string' },
            advice: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  body: { type: 'string' }
                },
                required: ['title', 'body']
              }
            }
          },
          required: ['bodyFatCurrent', 'aiMonths', 'verdict', 'advice']
        }
      }
    };

    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: 'Gemini error', detail: data });

    const txt =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    if (!txt) return res.status(502).json({ error: 'Réponse IA vide', detail: data });

    let parsed;
    try {
      parsed = JSON.parse(txt);
    } catch (e) {
      return res.status(502).json({ error: 'JSON invalide de l\'IA', raw: txt });
    }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
