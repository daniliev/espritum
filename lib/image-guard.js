// ── Espritum — Garde-fou d'image, partagé par les analyses Gemini ──
//
// Sans ce garde-fou, le modèle « réussit » toujours : donne-lui une photo de
// chien à analyser comme un corps et il rend une estimation de masse grasse
// parfaitement crédible, qui va ensuite réécrire le plan de l'utilisateur.
// On lui fait donc d'abord qualifier l'image, et on refuse tout ce qui n'est
// pas le sujet attendu.
//
// Contrat : l'endpoint répond 422 avec { rejected: true, reason: "…" }.

export const SUBJECTS = {
  body: {
    expects: "le CORPS d'une personne (torse, buste ou corps entier), exploitable pour estimer la composition corporelle",
    rejects: "un simple visage ou selfie de tête, un objet, un animal, un paysage, de la nourriture, un écran, un dessin, une capture, ou toute image qui n'est pas un corps humain analysable",
    fallback: {
      fr: "Cette photo ne montre pas un corps analysable. Reprends-la de face, en pied ou à mi-corps.",
      en: "This photo doesn't show an analysable body. Retake it facing the camera, full or half body.",
      bg: "Тази снимка не показва тяло за анализ. Направи я отпред, в цял ръст или до кръста."
    }
  },
  meal: {
    expects: "de la NOURRITURE ou une BOISSON destinée à être consommée (assiette, plat, aliment, verre, bol…)",
    rejects: "une personne, un animal, un objet, un paysage, un écran, un texte, un emballage vide, ou toute image sans aliment identifiable",
    fallback: {
      fr: "Cette photo ne montre pas de repas. Cadre ton assiette et reprends la photo.",
      en: "This photo doesn't show a meal. Frame your plate and take the photo again.",
      bg: "Тази снимка не показва хранене. Кадрирай чинията и снимай отново."
    }
  }
};

// Instructions à coller AVANT le reste du prompt : la qualification doit primer
// sur la tâche, sinon le modèle se précipite sur l'analyse.
export function guardPrompt(kind, langName) {
  const s = SUBJECTS[kind];
  return 'VALIDATION DE L\'IMAGE, AVANT TOUT LE RESTE : ' +
    'mets imageOk = true UNIQUEMENT si la photo montre clairement ' + s.expects + '. ' +
    'Mets imageOk = false si c\'est ' + s.rejects + '. ' +
    'Dans le doute, mets imageOk = false. ' +
    'Quand imageOk = false, explique le problème en une phrase courte dans imageIssue, en ' + langName + ', ' +
    'et remplis le reste de la réponse avec des valeurs vides ou nulles. ' +
    'NE FABRIQUE JAMAIS une analyse crédible sur une image qui n\'est pas le sujet attendu. ';
}

// Champs à fusionner dans le responseSchema de l'appel Gemini.
export const GUARD_FIELDS = {
  imageOk: { type: 'boolean' },
  imageIssue: { type: 'string' }
};
export const GUARD_REQUIRED = ['imageOk'];

// Renvoie null si l'image est acceptée, sinon le corps JSON à retourner en 422.
export function checkImage(kind, parsed, lang) {
  if (!parsed || parsed.imageOk !== false) return null;
  const s = SUBJECTS[kind];
  const issue = typeof parsed.imageIssue === 'string' ? parsed.imageIssue.trim() : '';
  return {
    rejected: true,
    subject: kind,
    reason: issue || s.fallback[lang] || s.fallback.en
  };
}
