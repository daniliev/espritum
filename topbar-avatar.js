// ── Topbar Avatar — injects user avatar on the left of every page title ──
(function() {
  const STYLE = `
    .topbar-avatar {
      width: 42px; height: 42px;
      border-radius: 50%;
      background: #1a1a1a;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display, 'Bebas Neue', sans-serif);
      font-size: 17px;
      color: #ddd;
      flex-shrink: 0;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      text-decoration: none;
    }
    .topbar-avatar:hover {
      transform: scale(1.06);
      box-shadow: 0 0 0 2px rgba(255,255,255,0.08);
    }
    .topbar-avatar.has-photo { color: transparent; }
    .topbar-with-avatar {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 16px !important;
    }
    .topbar-with-avatar > .topbar-titles {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    @media (max-width: 768px) {
      .topbar-avatar { width: 36px; height: 36px; font-size: 15px; }
      .topbar-with-avatar { gap: 12px !important; }
    }
  `;

  function injectStyles() {
    if (document.getElementById('topbar-avatar-styles')) return;
    const s = document.createElement('style');
    s.id = 'topbar-avatar-styles';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function getInitial(name) {
    if (!name) return '?';
    return name.trim().charAt(0).toUpperCase();
  }

  async function loadAndInject() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;
    if (topbar.querySelector('.topbar-avatar')) return;

    // Group avatar + existing left content (title) into a single flex row
    let leftGroup = topbar.querySelector('.topbar-left');
    if (!leftGroup) {
      // No .topbar-left? Wrap the topbar's first text-bearing child
      leftGroup = topbar.querySelector('.topbar-title') || topbar.firstElementChild;
    }

    // Wrap titles inside .topbar-titles container
    const titlesWrap = document.createElement('div');
    titlesWrap.className = 'topbar-titles';
    while (leftGroup.firstChild) titlesWrap.appendChild(leftGroup.firstChild);

    // Create avatar
    const a = document.createElement('a');
    a.className = 'topbar-avatar';
    a.id = 'topbar-avatar';
    a.href = 'profil.html';
    a.title = 'Mon profil';
    a.textContent = '?';

    leftGroup.classList.add('topbar-with-avatar');
    leftGroup.appendChild(a);
    leftGroup.appendChild(titlesWrap);

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
      a.textContent = getInitial(profile.prenom);
      if (profile.avatar_url) {
        a.classList.add('has-photo');
        a.style.backgroundImage = `url('${profile.avatar_url}')`;
        a.textContent = '';
      }
    } catch (e) { /* silencieux — fallback initiale "?" */ }
  }

  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndInject);
  } else {
    loadAndInject();
  }
})();
