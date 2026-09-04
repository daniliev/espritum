// ── Espritum — Analyse corporelle (Vercel Serverless Function) ──
// Reçoit 2 photos (corps actuel + corps de rêve) + le questionnaire + le délai,
// appelle Gemini, et renvoie un résultat structuré.
// La clé GEMINI_API_KEY reste ICI (variable d'env Vercel), jamais côté navigateur.

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
      guardPrompt('body', langName) +
      'Tu es Sensei, le coach sportif chrétien de l\'application Espritum : exigeant, direct, ' +
      'motivant, jamais complaisant mais toujours respectueux. ' +
      'On te donne deux photos : la PREMIÈRE est le corps ACTUEL de l\'utilisateur, ' +
      'la SECONDE (si présente) est son corps de RÊVE (objectif). ' +
      'VALIDATION D\'ABORD (essentiel) : ' +
      'currentUsable = true UNIQUEMENT si la première photo montre clairement le CORPS d\'une personne (torse/buste ou corps entier) exploitable pour estimer la composition corporelle. ' +
      'Mets currentUsable = false si c\'est un simple visage/selfie de tête, un objet, un animal, un paysage, de la nourriture, un écran, ou toute image qui n\'est pas un corps humain analysable. ' +
      'goalUsable = true seulement si la seconde photo montre un PHYSIQUE humain (un corps de référence à atteindre) ; false si ce n\'est pas un corps (photo random, objet, scène, etc.). S\'il n\'y a pas de seconde photo, goalUsable = true. ' +
      'Si currentUsable est false, renvoie bodyFatCurrent 0, aiMonths 0, un verdict vide et un tableau advice vide, et explique le souci dans "issue" (en ' + langName + '). NE FABRIQUE JAMAIS une analyse crédible sur une photo qui n\'est pas un corps. ' +
      'Profil de l\'utilisateur : ' + profile + '. ' +
      'Si (et seulement si) currentUsable est true : analyse la première photo : estime son pourcentage de masse grasse (bodyFatCurrent) et sa morphologie. ' +
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
        maxOutputTokens: 2500,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            ...GUARD_FIELDS,
            currentUsable: { type: 'boolean' },
            goalUsable: { type: 'boolean' },
            issue: { type: 'string' },
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
          required: GUARD_REQUIRED.concat(['currentUsable', 'goalUsable', 'bodyFatCurrent', 'aiMonths', 'verdict', 'advice'])
        }
      }
    };

    const call = await callGemini(key, payload);
    if (!call.ok) {
      // Quota Gemini atteint : distinct d'une panne, et l'attente est connue
      if (call.quota) return res.status(429).json({ error: 'quota', retryAfter: call.retryAfter });
      if (call.busy) return res.status(503).json({ error: 'busy', reason: call.reason });
      return res.status(call.status || 502).json({ error: 'Gemini error', detail: call.data });
    }

    const parsed = parseGemini(call.data);
    if (!parsed) return res.status(502).json({ error: 'Réponse IA inexploitable' });

    // Photo qui n'est pas un corps → on refuse. Le champ currentUsable existait
    // déjà mais sa consigne était noyée dans le prompt : une montre passait.
    const rejected = checkImage('body', parsed, lang);
    if (rejected) return res.status(422).json(rejected);

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
