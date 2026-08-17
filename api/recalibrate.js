// ── Espritum — Recalibrage hebdomadaire via Gemini ──
// Reçoit la nouvelle photo de scan + le profil (analyse précédente),
// renvoie la nouvelle estimation + le plan réécrit + les changements.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });

  try {
    const { current, profile, lang } = req.body || {};
    if (!current) return res.status(400).json({ error: 'Photo manquante' });

    const langName = { fr: 'français', en: 'English', bg: 'български' }[lang] || 'français';
    const p = profile || {};
    const ctx = [
      p.objectif ? 'objectif: ' + p.objectif : '',
      p.poids ? 'poids: ' + p.poids + ' kg' : '',
      p.taille ? 'taille: ' + p.taille + ' cm' : '',
      (p.masse_grasse != null) ? 'masse grasse SEMAINE PRÉCÉDENTE: ' + p.masse_grasse + ' %' : '',
      p.delai_mois ? 'délai visé: ' + p.delai_mois + ' mois' : '',
      p.calories_objectif ? 'calories cibles actuelles: ' + p.calories_objectif : '',
      p.proteines_objectif ? 'protéines cibles actuelles: ' + p.proteines_objectif + ' g' : ''
    ].filter(Boolean).join(' · ');

    const prompt =
      'Tu es Sensei, coach sportif chrétien exigeant de l\'app Espritum. ' +
      'On te donne la photo du SCAN HEBDOMADAIRE de l\'utilisateur (son corps aujourd\'hui). ' +
      'Contexte : ' + ctx + '. ' +
      'Estime sa masse grasse actuelle (bodyFatCurrent). ' +
      'Recalibre son plan pour la semaine à venir en fonction de sa progression : ' +
      'calories cibles (caloriesTarget), protéines en g (proteinTarget), nombre de séances par semaine (sessionsPerWeek). ' +
      'Donne exactement 3 changements CONCRETS à appliquer cette semaine (changes) — entraînement, nutrition, discipline. ' +
      'Écris les 3 changements en ' + langName + ', courts et directs. Ne dis jamais que tu es une IA.';

    const payload = {
      contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: current } }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2000,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            bodyFatCurrent: { type: 'number' },
            caloriesTarget: { type: 'number' },
            proteinTarget: { type: 'number' },
            sessionsPerWeek: { type: 'number' },
            changes: { type: 'array', items: { type: 'string' } }
          },
          required: ['bodyFatCurrent', 'caloriesTarget', 'proteinTarget', 'sessionsPerWeek', 'changes']
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
