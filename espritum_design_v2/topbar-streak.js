// ── Topbar Streak Pill — injecte l'icône streak sur toutes les pages ──
(function() {
  const STYLE = `
    .topbar-streak-pill {
      background: #111;
      border: 2px solid var(--red, #c82828);
      border-radius: 99px;
      padding: 6px 14px;
      font-family: var(--font-display, 'Bebas Neue', sans-serif);
      font-size: 17px;
      letter-spacing: 1px;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
    }
    .si {
      height: 0.8em;
      width: auto;
      vertical-align: -0.15em;
      display: inline-block;
      margin-right: 2px;
    }
    .topbar-right {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  `;

  function injectStyles() {
    if (document.getElementById('topbar-streak-styles')) return;
    const s = document.createElement('style');
    s.id = 'topbar-streak-styles';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function getScriptBase() {
    // Trouver le chemin de base pour les assets (icons/)
    const scripts = document.querySelectorAll('script[src]');
    for (const s of scripts) {
      if (s.src.includes('topbar-streak.js')) {
        return s.src.replace('topbar-streak.js', '');
      }
    }
    return '';
  }

  function renderPill(streak) {
    const base = getScriptBase();
    return `<img class="si" src="${base}icons/streak-icon.png" alt="streak"> ${streak}`;
  }

  async function loadAndInject() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    // Trouver ou créer le conteneur droit
    let right = topbar.querySelector('.topbar-right');
    if (!right) {
      right = document.createElement('div');
      right.className = 'topbar-right';
      topbar.appendChild(right);
    }

    // Injecter le pill s'il n'existe pas encore
    let pill = document.getElementById('topbar-streak');
    if (!pill) {
      pill = document.createElement('div');
      pill.className = 'topbar-streak-pill';
      pill.id = 'topbar-streak';
      // Insérer AVANT l'avatar pill s'il existe
      const avatarPill = right.querySelector('.topbar-avatar-pill, #topbar-avatar-pill');
      if (avatarPill) {
        right.insertBefore(pill, avatarPill);
      } else {
        right.appendChild(pill);
      }
    }
    // Mettre l'icône IMMÉDIATEMENT (évite le flash de l'emoji 🔥)
    pill.innerHTML = renderPill(pill.textContent.trim().replace(/\D/g,'') || 0);

    // Charger le streak depuis Supabase
    try {
      const supabase = window.sb;
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase
        .from('users')
        .select('streak')
        .eq('id', session.user.id)
        .single();
      const streak = profile?.streak || 0;
      pill.innerHTML = renderPill(streak);
    } catch (e) { /* silencieux */ }
  }

  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndInject);
  } else {
    loadAndInject();
  }
})();
