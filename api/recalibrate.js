// ── Espritum — Recalibrage hebdomadaire via Gemini ──
// Reçoit la nouvelle photo de scan + le profil (analyse précédente),
// renvoie la nouvelle estimation + le plan réécrit + les changements.

import { guardPrompt, GUARD_FIELDS, GUARD_REQUIRED, checkImage } from '../lib/image-guard.js';
import { callGemini, parseGemini } from '../lib/gemini.js';

export const config = { maxDuration: 60 };

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
      guardPrompt('body', langName) +
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
            ...GUARD_FIELDS,
            bodyFatCurrent: { type: 'number' },
            caloriesTarget: { type: 'number' },
            proteinTarget: { type: 'number' },
            sessionsPerWeek: { type: 'number' },
            changes: { type: 'array', items: { type: 'string' } }
          },
          required: GUARD_REQUIRED.concat(['bodyFatCurrent', 'caloriesTarget', 'proteinTarget', 'sessionsPerWeek', 'changes'])
        }
      }
    };

    const call = await callGemini(key, payload);
    if (!call.ok) {
      // Surcharge passagère du modèle : on le dit, au lieu de laisser croire
      // que la photo est en cause.
      if (call.busy) return res.status(503).json({ error: 'busy' });
      return res.status(call.status || 502).json({ error: 'Gemini error', detail: call.data });
    }

    const parsed = parseGemini(call.data);
    if (!parsed) return res.status(502).json({ error: 'Réponse IA inexploitable' });

    // Photo qui n'est pas un corps → on refuse. Sans ça le modèle rendait une
    // masse grasse crédible sur n'importe quelle image, et le plan était réécrit.
    const rejected = checkImage('body', parsed, lang);
    if (rejected) return res.status(422).json(rejected);

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
