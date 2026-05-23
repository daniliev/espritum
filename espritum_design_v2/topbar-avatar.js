// ── Topbar Avatar Pill — affiche la photo de profil dans le pill de droite ──
(function() {
  const STYLE = `
    .topbar-avatar-pill.has-photo {
      background-image: var(--avatar-url);
      background-size: cover;
      background-position: center;
      background-color: #111;
      color: transparent !important;
      font-size: 0;
    }
  `;

  function injectStyles() {
    if (document.getElementById('topbar-avatar-styles')) return;
    const s = document.createElement('style');
    s.id = 'topbar-avatar-styles';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  async function loadAndInject() {
    try {
      const supabase = window.sb;
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase
        .from('users')
        .select('prenom, avatar_url')
        .eq('id', session.user.id)
        .single();
      if (!profile) return;

      // Cibler le pill de droite par sa classe spécifique (évite le conflit avec l'avatar gauche)
      const pill = document.querySelector('.topbar-avatar-pill')
                || document.getElementById('topbar-avatar');
      if (!pill) return;

      if (profile.avatar_url) {
        // Afficher la photo dans le pill
        pill.style.backgroundImage = `url('${profile.avatar_url}')`;
        pill.style.backgroundSize = 'cover';
        pill.style.backgroundPosition = 'center';
        pill.style.backgroundColor = 'transparent';
        pill.classList.add('has-photo');
        pill.textContent = '';
        pill.style.color = 'transparent';
        pill.style.fontSize = '0';
      } else {
        // Fallback : initiale du prénom
        pill.textContent = (profile.prenom || '?').charAt(0).toUpperCase();
      }
    } catch (e) { /* silencieux */ }
  }

  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndInject);
  } else {
    loadAndInject();
  }
})();
