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

    // Vrai si l'utilisateur connecté est premium (abonné ou en essai)
    isPremium: function () {
      return sb.auth.getUser().then(function (u) {
        if (!u.data.user) return false;
        return sb.from('users').select('plan').eq('id', u.data.user.id).single().then(
          function (r) { return !!(r.data && r.data.plan === 'premium'); },
          function () { return false; }
        );
      });
    },

    // Protège une page PREMIUM : connexion requise, et si pas premium → page d'abonnement
    requirePremium: function (redirect) {
      return sb.auth.getSession().then(function (r) {
        if (!r.data.session) { window.location.replace('compte.html?mode=login'); return false; }
        return sb.from('users').select('plan').eq('id', r.data.session.user.id).single().then(
          function (rr) {
            if (!rr.data || rr.data.plan !== 'premium') { window.location.replace(redirect || 'abonnement.html?upgrade=1'); return false; }
            return true;
          },
          function () { window.location.replace(redirect || 'abonnement.html?upgrade=1'); return false; }
        );
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
    },

    // Sauvegarde les données du tunnel (questionnaire, délai, résultat IA) sur le profil + 1ère mesure
    saveOnboarding: function () {
      return sb.auth.getUser().then(function (u) {
        if (!u.data.user) return;
        var uid = u.data.user.id;
        function ls(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
        var quiz = ls('espritum.quiz');
        var deadline = ls('espritum.deadline');
        var res = ls('espritum.analysis');
        var upd = {};
        if (quiz) {
          upd.questionnaire = quiz;
          if (quiz.weight) upd.poids = parseFloat(quiz.weight);
          if (quiz.height) upd.taille = parseFloat(quiz.height);
          if (quiz.goal) upd.objectif = quiz.goal;
          if (quiz.activity) upd.niveau_activite = quiz.activity;
        }
        if (deadline && deadline.months) upd.delai_mois = deadline.months;
        if (res) {
          upd.resultat_ia = res;
          if (res.bodyFatCurrent) upd.masse_grasse = res.bodyFatCurrent;
        }
        var updP = Object.keys(upd).length ? sb.from('users').update(upd).eq('id', uid) : Promise.resolve();
        return Promise.resolve(updP).then(function () {
          var m = {};
          if (quiz && quiz.weight) m.poids = parseFloat(quiz.weight);
          if (res && res.bodyFatCurrent) m.masse_grasse = res.bodyFatCurrent;
          if (Object.keys(m).length) { m.user_id = uid; return sb.from('measurements').insert(m); }
        });
      });
    },

    // Upload des photos (corps actuel + objectif) dans le Storage privé
    uploadScanPhotos: function () {
      return sb.auth.getUser().then(function (u) {
        if (!u.data.user) return;
        var uid = u.data.user.id;
        function ss(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
        var cur = ss('espritum.photo.current');
        var goal = ss('espritum.photo.goal');
        var tasks = [];
        if (cur) tasks.push(dataUrlToScaledBlob(cur, 1080).then(function (b) {
          if (!b) return;
          var path = uid + '/current.jpg';
          return sb.storage.from('scans').upload(path, b, { contentType: 'image/jpeg', upsert: true }).then(function () {
            // relie la photo à la mesure la plus récente (le scan initial)
            return sb.from('measurements').select('id').eq('user_id', uid).order('created_at', { ascending: false }).limit(1).then(function (r) {
              if (r.data && r.data[0]) return sb.from('measurements').update({ photo_url: path }).eq('id', r.data[0].id);
            });
          });
        }));
        if (goal) tasks.push(dataUrlToScaledBlob(goal, 1080).then(function (b) {
          if (!b) return;
          var path = uid + '/goal.jpg';
          return sb.storage.from('scans').upload(path, b, { contentType: 'image/jpeg', upsert: true }).then(function () {
            return sb.from('users').update({ photo_objectif: path }).eq('id', uid);
          });
        }));
        return Promise.all(tasks);
      });
    },

    // URL signée temporaire (1h) pour afficher une photo privée
    getSignedUrl: function (path) {
      if (!path) return Promise.resolve(null);
      return sb.storage.from('scans').createSignedUrl(path, 3600).then(function (r) {
        return (r.data && r.data.signedUrl) || null;
      }, function () { return null; });
    },

    // Tous les scans (mesures) de l'utilisateur, du plus ancien au plus récent
    listScans: function () {
      return sb.auth.getUser().then(function (u) {
        if (!u.data.user) return [];
        return sb.from('measurements').select('id,created_at,masse_grasse,photo_url')
          .eq('user_id', u.data.user.id).order('created_at', { ascending: true })
          .then(function (r) { return r.data || []; }, function () { return []; });
      });
    },

    // Dernier scan enregistré (mesure la plus récente) — sert de « semaine précédente »
    lastScan: function () {
      return sb.auth.getUser().then(function (u) {
        if (!u.data.user) return null;
        return sb.from('measurements').select('id,created_at,masse_grasse,photo_url')
          .eq('user_id', u.data.user.id).order('created_at', { ascending: false }).limit(1)
          .then(function (r) { return (r.data && r.data[0]) || null; }, function () { return null; });
      });
    },

    // Enregistre un scan hebdomadaire : nouvelle mesure + photo + plan recalibré sur le profil
    saveWeeklyScan: function (result, profile) {
      if (!result) return Promise.resolve();
      return sb.auth.getUser().then(function (u) {
        if (!u.data.user) return;
        var uid = u.data.user.id;
        var bf = (result.bodyFatCurrent != null) ? Number(result.bodyFatCurrent) : null;

        // 1. Recalibre les cibles sur le profil
        var upd = {};
        if (bf != null) upd.masse_grasse = bf;
        if (result.caloriesTarget) upd.calories_objectif = Math.round(result.caloriesTarget);
        if (result.proteinTarget) upd.proteines_objectif = Math.round(result.proteinTarget);
        if (result.sessionsPerWeek && profile && profile.questionnaire) {
          var q = {}; for (var k in profile.questionnaire) q[k] = profile.questionnaire[k];
          q.freq = result.sessionsPerWeek; upd.questionnaire = q;
        }
        var updP = Object.keys(upd).length ? sb.from('users').update(upd).eq('id', uid) : Promise.resolve();

        // 2. Nouvelle mesure (le scan de cette semaine) + photo attachée
        return Promise.resolve(updP).then(function () {
          var m = { user_id: uid };
          if (bf != null) m.masse_grasse = bf;
          return sb.from('measurements').insert(m).select('id').single();
        }).then(function (r) {
          var id = r && r.data && r.data.id;
          var cur = null; try { cur = sessionStorage.getItem('espritum.photo.current'); } catch (e) {}
          if (!id || !cur) return;
          return dataUrlToScaledBlob(cur, 1080).then(function (b) {
            if (!b) return;
            var path = uid + '/m-' + id + '.jpg';
            return sb.storage.from('scans').upload(path, b, { contentType: 'image/jpeg', upsert: true }).then(function () {
              return sb.from('measurements').update({ photo_url: path }).eq('id', id);
            });
          });
        });
      });
    }
  };

  // data-URL → Blob JPEG redimensionné (max px sur le plus grand côté)
  function dataUrlToScaledBlob(dataUrl, max) {
    return new Promise(function (resolve) {
      if (!dataUrl) { resolve(null); return; }
      var img = new Image();
      img.onload = function () {
        var w = img.width, h = img.height, s = Math.min(1, max / Math.max(w, h));
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(w * s));
        c.height = Math.max(1, Math.round(h * s));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        try { c.toBlob(function (b) { resolve(b); }, 'image/jpeg', 0.85); } catch (e) { resolve(null); }
      };
      img.onerror = function () { resolve(null); };
      img.src = dataUrl;
    });
  }
})();
