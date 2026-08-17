// ── Espritum — Sensei (coach IA conversationnel) via Gemini ──
// Reçoit l'historique du chat + le profil de l'utilisateur, répond en Sensei.
// Clé GEMINI_API_KEY côté serveur uniquement.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });

  try {
    const { messages, lang, profile } = req.body || {};
    const langName = { fr: 'français', en: 'English', bg: 'български' }[lang] || 'français';

    const p = profile || {};
    const profilTxt = [
      p.prenom ? 'prénom: ' + p.prenom : '',
      p.objectif ? 'objectif: ' + p.objectif : '',
      p.poids ? 'poids: ' + p.poids + ' kg' : '',
      p.taille ? 'taille: ' + p.taille + ' cm' : '',
      p.masse_grasse ? 'masse grasse estimée: ' + p.masse_grasse + ' %' : '',
      p.delai_mois ? 'délai visé: ' + p.delai_mois + ' mois' : '',
      (p.streak !== undefined && p.streak !== null) ? 'série: ' + p.streak + ' jours' : ''
    ].filter(Boolean).join(' · ');

    const systemText =
      'Tu es Sensei, le coach sportif chrétien de l\'application Espritum : exigeant, direct, ' +
      'motivant, jamais complaisant mais toujours respectueux et bienveillant. Tu tutoies. ' +
      'Tes réponses sont COURTES (1 à 3 phrases), percutantes et actionnables. ' +
      'Tu peux citer un verset biblique avec sobriété quand c\'est vraiment pertinent. ' +
      (profilTxt ? 'Voici le profil de la personne : ' + profilTxt + '. Adapte tes conseils à elle. ' : '') +
      'Réponds toujours en ' + langName + '. Ne dis jamais que tu es une IA : reste Sensei.';

    // Construit l'historique au format Gemini (user/model), en commençant par un tour "user"
    let contents = (messages || []).map(function (m) {
      return { role: m.role === 'model' ? 'model' : 'user', parts: [{ text: String(m.text || '') }] };
    });
    while (contents.length && contents[0].role === 'model') contents.shift();
    if (!contents.length) return res.status(400).json({ error: 'Aucun message' });

    const body = {
      systemInstruction: { parts: [{ text: systemText }] },
      contents: contents,
      generationConfig: { temperature: 0.85, maxOutputTokens: 1500 }
    };

    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + key,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: 'Gemini error', detail: data });

    const txt =
      data && data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts && data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    if (!txt) return res.status(502).json({ error: 'Réponse IA vide' });
    return res.status(200).json({ reply: txt.trim() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
