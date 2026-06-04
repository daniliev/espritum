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

      function applyAvatar(el, avatarUrl, initiale) {
        if (!el) return;
        if (avatarUrl) {
          el.style.backgroundImage = `url('${avatarUrl}')`;
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
          el.style.backgroundColor = 'transparent';
          el.style.color = 'transparent';
          el.style.fontSize = '0';
          el.textContent = '';
        } else {
          el.textContent = initiale;
        }
      }

      const initiale = (profile.prenom || '?').charAt(0).toUpperCase();

      // Topbar pill
      if (profile.avatar_url) pill.classList.add('has-photo');
      applyAvatar(pill, profile.avatar_url, initiale);

      // Ma position dans le classement (global + amis)
      applyAvatar(document.getElementById('my-pos-avatar'), profile.avatar_url, initiale);
      applyAvatar(document.getElementById('friends-my-avatar'), profile.avatar_url, initiale);

      // Sidebar avatar (si présent)
      applyAvatar(document.getElementById('sidebar-avatar'), profile.avatar_url, initiale);

    } catch (e) { /* silencieux */ }
  }

  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndInject);
  } else {
    loadAndInject();
  }
})();
