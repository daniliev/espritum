// ── ESPRITUM SITE CONFIG LOADER ──
// Ce script charge la config depuis Supabase et applique les CSS vars + textes

(async function() {
  try {
    const SUPABASE_URL = 'https://lbxlvrtujzwlcnloheyh.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_40dpIdYthKMZkJImacoKoQ_ftEeaPeg';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_config?select=id,value`, {
      signal: controller.signal,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    clearTimeout(timeout);
    if (!res.ok) return;
    const data = await res.json();
    if (!data || !data.length) return;

    const CSS_MAP = {
      color_primary: '--red',
      color_bg: '--bg',
      color_bg2: '--bg2',
      color_border: '--border',
      color_text: '--color-text',
      color_muted: '--muted',
      font_size_base: '--font-size-base',
      font_size_title: '--font-size-title',
      letter_spacing: '--letter-spacing',
      border_radius: '--border-radius',
    };

    const config = {};
    data.forEach(row => {
      config[row.id] = row.value;
      // Appliquer CSS var
      if (CSS_MAP[row.id]) {
        document.documentElement.style.setProperty(CSS_MAP[row.id], row.value);
      }
    });

    // Appliquer les textes quand le DOM est prêt
    const applyTexts = () => {
      if (config.text_hero) {
        document.querySelectorAll('.hero-title').forEach(el => {
          const parts = config.text_hero.split(' ');
          const last = parts.pop();
          el.innerHTML = parts.join(' ') + '<br><span class="accent">' + last + '</span>';
        });
      }
      if (config.text_slogan) {
        document.querySelectorAll('[data-config="text_slogan"]').forEach(el => {
          el.textContent = config.text_slogan;
        });
      }
      if (config.text_hero_sub) {
        document.querySelectorAll('.hero-sub').forEach(el => {
          el.textContent = config.text_hero_sub;
        });
      }
      if (config.text_app_name) {
        document.querySelectorAll('.nav-name, .sidebar-name, .footer-name').forEach(el => {
          el.textContent = config.text_app_name;
        });
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyTexts);
    } else {
      applyTexts();
    }

  } catch(e) {
    // Silently fail — site works without config
    console.warn('Site config not loaded:', e.message);
  }
})();
