// supabase-client.js
// ── Client Supabase partagé par toutes les pages Espritum.
// Une seule source de vérité pour l'URL + la clé publique.
// Pour rotate la clé : modifie uniquement ce fichier.
//
// Prérequis : le script @supabase/supabase-js doit être chargé AVANT celui-ci.
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="supabase-client.js"></script>

(function() {
  const SUPABASE_URL = 'https://lbxlvrtujzwlcnloheyh.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_40dpIdYthKMZkJImacoKoQ_ftEeaPeg';

  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.error('[supabase-client] La lib Supabase n\'est pas chargée. Ajoute le <script> CDN avant ce fichier.');
    return;
  }

  // Client partagé (session persistée dans localStorage par défaut)
  window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Constantes exposées pour les appels fetch directs (Edge Functions)
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
})();
