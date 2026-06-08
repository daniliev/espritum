// ── Espritum — Waitlist API ──
// 1. Enregistre l'inscription dans Supabase (table waitlist)
// 2. Envoie une notification email à info.espritum@gmail.com via Resend
//
// Variables d'environnement requises (Vercel Dashboard → Settings → Env Vars) :
//   RESEND_API_KEY  → resend.com (gratuit, 3 000 emails/mois)
//   (SUPABASE_SERVICE_KEY est optionnel — la clé publique suffit pour les inserts)

const SUPABASE_URL = 'https://lbxlvrtujzwlcnloheyh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_40dpIdYthKMZkJImacoKoQ_ftEeaPeg';
const NOTIFY_EMAIL = 'info.espritum@gmail.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prenom, nom, email, telephone, lang, source } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  // ── 1. Insert Supabase (best-effort, ne bloque pas la notif email) ──
  // On tente d'enregistrer en base, mais un échec DB ne doit JAMAIS faire
  // perdre le lead : la notification email part quoi qu'il arrive.
  const sbKey = process.env.SUPABASE_SERVICE_KEY || SUPABASE_KEY;
  let dbOk = false;
  let dbDuplicate = false;

  try {
    const sbResp = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': sbKey,
        'Authorization': `Bearer ${sbKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email:     email.toLowerCase().trim(),
        prenom:    prenom  || '',
        nom:       nom     || '',
        telephone: telephone || '',
        lang:      lang    || 'fr',
        source:    source  || 'hero'
      })
    });

    if (sbResp.status === 409) {
      dbDuplicate = true;
    } else if (sbResp.ok) {
      dbOk = true;
    } else {
      const errText = await sbResp.text();
      console.error('Supabase insert error:', sbResp.status, errText);
    }
  } catch (e) {
    console.error('Supabase fetch error:', e.message);
  }

  // ── 2. Email notification via Resend ───────────────────────────────
  const RESEND_KEY = process.env.RESEND_API_KEY;
  let emailOk = false;

  if (RESEND_KEY) {
    const fullName = [prenom, nom].filter(Boolean).join(' ') || '—';
    const now = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const dbBadge = dbOk
      ? ''
      : `<div style="background:#fff3cd;color:#856404;padding:10px 32px;font-size:12px;">⚠️ Non enregistré en base${dbDuplicate ? ' (email déjà présent)' : ' (vérifie la table Supabase)'} — pense à copier ce lead.</div>`;

    const html = `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;background:#f5f5f5;border-radius:10px;overflow:hidden;">
        <div style="background:#c82828;padding:28px 32px;">
          <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:2px;text-transform:uppercase;">🔥 Nouvelle inscription</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Liste d'attente Espritum</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:12px 0;color:#888;font-weight:600;width:130px;">Prénom</td>
              <td style="padding:12px 0;color:#111;font-weight:500;">${prenom || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:12px 0;color:#888;font-weight:600;">Nom</td>
              <td style="padding:12px 0;color:#111;font-weight:500;">${nom || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:12px 0;color:#888;font-weight:600;">Email</td>
              <td style="padding:12px 0;"><a href="mailto:${email}" style="color:#c82828;font-weight:600;text-decoration:none;">${email}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:12px 0;color:#888;font-weight:600;">Téléphone</td>
              <td style="padding:12px 0;color:#111;font-weight:500;">${telephone || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:12px 0;color:#888;font-weight:600;">Plan visé</td>
              <td style="padding:12px 0;color:#111;font-weight:500;text-transform:capitalize;">${source || 'hero'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:12px 0;color:#888;font-weight:600;">Langue</td>
              <td style="padding:12px 0;color:#111;">${(lang || 'fr').toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#888;font-weight:600;">Date</td>
              <td style="padding:12px 0;color:#111;">${now}</td>
            </tr>
          </table>
        </div>
        ${dbBadge}
        <div style="padding:16px 32px;background:#f5f5f5;text-align:center;">
          <p style="margin:0;font-size:11px;color:#aaa;letter-spacing:1px;text-transform:uppercase;">Espritum — Not Just Flesh But Spirit</p>
        </div>
      </div>
    `;

    try {
      const mailResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_KEY}`
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Espritum <onboarding@resend.dev>',
          to: [NOTIFY_EMAIL],
          subject: `🔥 ${fullName} rejoint la liste d'attente Espritum`,
          html
        })
      });
      if (mailResp.ok) {
        emailOk = true;
      } else {
        console.error('Resend error:', mailResp.status, await mailResp.text());
      }
    } catch (emailErr) {
      console.error('Resend error:', emailErr.message);
    }
  } else {
    console.warn('RESEND_API_KEY not set — email notification skipped');
  }

  // ── 3. Réponse ─────────────────────────────────────────────────────
  // Doublon connu → 409 (l'UX affiche "déjà inscrit").
  if (dbDuplicate) {
    return res.status(409).json({ message: 'Already registered' });
  }
  // Succès si on a capturé le lead par AU MOINS un canal (base ou email).
  if (dbOk || emailOk) {
    return res.status(201).json({ success: true });
  }
  // Les deux canaux ont échoué → vraie erreur.
  console.error('Lead lost — DB and email both failed for:', email);
  return res.status(502).json({ error: 'Capture failed' });
}
