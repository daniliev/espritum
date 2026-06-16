// ── Espritum — Suggestions d'articles en bas de blog ──
// Affiche automatiquement les autres articles dans #blog-suggestions
// (exclut l'article courant). Bilingue via data-en + lang.js.
(function () {
  var POSTS = [
    { f: 'comment-perdre-du-ventre-homme.html', img: 'blog-ventre-hero.jpg', cat: 'Perte de gras', cat_en: 'Fat loss', title: 'Comment perdre du ventre (homme)', title_en: 'How to lose belly fat (men)' },
    { f: 'exercice-pour-perdre-du-ventre-homme.html', img: 'blog-exercice-hero.jpg', cat: 'Entraînement', cat_en: 'Training', title: 'Quel exercice pour perdre du ventre', title_en: 'Which exercise to lose belly fat' },
    { f: 'quoi-manger-pour-perdre-du-ventre-homme.html', img: 'blog-alimentation-hero.jpg', cat: 'Nutrition', cat_en: 'Nutrition', title: 'Quoi manger pour perdre du ventre', title_en: 'What to eat to lose belly fat' },
    { f: 'perdre-du-ventre-rapidement-homme.html', img: 'blog-rapide-hero.jpg', cat: 'Mindset', cat_en: 'Mindset', title: 'Perdre du ventre rapidement', title_en: 'Lose belly fat fast' },
    { f: 'comment-mesurer-sa-graisse-abdominale.html', img: 'blog-mesurer-hero.jpg', cat: 'Composition corporelle', cat_en: 'Body composition', title: 'Mesurer sa graisse abdominale', title_en: 'Measure your belly fat' }
  ];

  function init() {
    var host = document.getElementById('blog-suggestions');
    if (!host) return;

    var current = (location.pathname.split('/').pop() || '').toLowerCase();
    var others = POSTS.filter(function (p) { return p.f.toLowerCase() !== current; }).slice(0, 3);
    if (!others.length) return;

    var cards = others.map(function (p) {
      return '<a class="sg-card" href="' + p.f + '">' +
        '<img class="sg-thumb" src="' + p.img + '" alt="" loading="lazy">' +
        '<div class="sg-body">' +
          '<div class="sg-cat" data-en="' + p.cat_en + '">' + p.cat + '</div>' +
          '<div class="sg-title" data-en="' + p.title_en + '">' + p.title + '</div>' +
        '</div></a>';
    }).join('');

    host.innerHTML =
      '<h2 class="sg-heading" data-en="More articles to read">D\'autres articles à lire</h2>' +
      '<div class="sg-grid">' + cards + '</div>';

    if (!document.getElementById('sg-style')) {
      var st = document.createElement('style');
      st.id = 'sg-style';
      st.textContent =
        "#blog-suggestions{max-width:720px;margin:0 auto;padding:42px 22px 10px;border-top:1px solid var(--border,#1e1e1e);}" +
        ".sg-heading{font-family:var(--font-display,'Bebas Neue'),sans-serif;font-size:26px;letter-spacing:1px;text-transform:uppercase;color:#fff;margin-bottom:20px;}" +
        ".sg-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}" +
        ".sg-card{background:var(--bg2,#0d0d0d);border:1px solid var(--border,#1e1e1e);border-radius:12px;overflow:hidden;text-decoration:none;display:flex;flex-direction:column;transition:border-color .2s,transform .2s;}" +
        ".sg-card:hover{border-color:rgba(200,40,40,.45);transform:translateY(-3px);}" +
        ".sg-thumb{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;border-bottom:1px solid var(--border,#1e1e1e);}" +
        ".sg-body{padding:14px 14px 16px;}" +
        ".sg-cat{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;color:var(--red,#c82828);margin-bottom:7px;}" +
        ".sg-title{font-family:var(--font-display,'Bebas Neue'),sans-serif;font-size:17px;letter-spacing:.5px;text-transform:uppercase;color:#fff;line-height:1.1;}" +
        "@media(max-width:620px){.sg-grid{grid-template-columns:1fr;}.sg-card{flex-direction:row;align-items:stretch;}.sg-thumb{width:110px;aspect-ratio:1;border-bottom:none;border-right:1px solid var(--border,#1e1e1e);flex-shrink:0;}.sg-body{flex:1;display:flex;flex-direction:column;justify-content:center;}}";
      document.head.appendChild(st);
    }

    // Applique la langue courante aux nouvelles cartes
    if (window.espGetLang && window.espSetLang) window.espSetLang(window.espGetLang());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
