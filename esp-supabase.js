// ── Espritum — Client Supabase + helpers d'authentification ──
// À charger APRÈS le CDN supabase-js (window.supabase).
// La clé utilisée est la clé PUBLIQUE (publishable) — sans danger côté navigateur :
// c'est la RLS (règles de sécurité) qui protège les données.

(function () {
  var SUPA_URL = 'https://lbxlvrtujzwlcnloheyh.supabase.co';
  var SUPA_KEY = 'sb_publishable_40dpIdYthKMZkJImacoKoQ_ftEeaPeg';

  if (!window.supabase || !window.supabase.createClient) {
    console.error('[Espritum] supabase-js non chargé avant esp-supabase.js');
    return;
  }

  var sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
  window.espSB = sb;

  window.EspAuth = {
    client: sb,

    // Inscription : crée le compte Auth + le profil dans public.users
    signUp: function (o) {
      return sb.auth.signUp({ email: o.email, password: o.password }).then(function (res) {
        if (res.error) return { error: res.error.message };
        var user = res.data.user;
        var session = res.data.session;
        if (user && session) {
          var prof = { id: user.id, email: o.email };
          if (o.prenom) prof.prenom = o.prenom;
          if (o.pays) prof.pays = o.pays;
          if (o.ville) prof.ville = o.ville;
          if (o.langue) prof.langue = o.langue;
          return sb.from('users').upsert(prof, { onConflict: 'id' }).then(
            function () { return { user: user, session: session }; },
            function () { return { user: user, session: session }; } // profil non bloquant
          );
        }
        // pas de session = confirmation e-mail requise
        return { user: user, session: session, needsConfirm: !session };
      });
    },

    // Connexion
    login: function (o) {
      return sb.auth.signInWithPassword({ email: o.email, password: o.password }).then(function (res) {
        if (res.error) return { error: res.error.message };
        return { user: res.data.user, session: res.data.session };
      });
    },

    logout: function () { return sb.auth.signOut(); },

    getSession: function () {
      return sb.auth.getSession().then(function (r) { return r.data.session; });
    },

    // Protège une page : redirige vers la connexion si pas de session
    requireAuth: function (redirect) {
      return sb.auth.getSession().then(function (r) {
        if (!r.data.session) { window.location.replace(redirect || 'compte.html?mode=login'); return null; }
        return r.data.session.user;
      });
    },

    // Profil de l'utilisateur connecté
    getProfile: function () {
      return sb.auth.getUser().then(function (u) {
        if (!u.data.user) return null;
        return sb.from('users').select('*').eq('id', u.data.user.id).single().then(function (r) {
          return r.data || null;
        });
      });
    }
  };
})();
