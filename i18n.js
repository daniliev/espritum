// ── ESPRITUM i18n — FR / EN / BG ──
const TRANSLATIONS = {
  fr: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_nutrition: 'Nutrition',
    nav_training: 'Entraînement',
    nav_progression: 'Progression',
    nav_bodyfat: 'Estimation corporelle',
    nav_coach: 'Coach Sensei',
    nav_classement: 'Classement',
    nav_profil: 'Profil',
    nav_abonnement: 'Abonnement',
    // Dashboard
    dash_greeting: 'Bonjour',
    dash_calories: 'Calories',
    dash_weight: 'Poids',
    dash_bodyfat: 'Masse grasse',
    dash_meals: 'Repas',
    dash_objective: 'Objectif',
    dash_remaining: 'restantes',
    dash_today: 'aujourd\'hui',
    dash_proteins: 'Protéines',
    dash_carbs: 'Glucides',
    dash_fats: 'Lipides',
    dash_week: 'Cette semaine',
    dash_verse: 'Verset du jour',
    dash_body3d: 'Corps 3D',
    dash_meals_today: 'Repas du jour',
    dash_add_meal: '+ Ajouter un repas',
    dash_see_all: 'Voir tout',
    dash_calories_day: 'Calories du jour',
    dash_add: '+ Ajouter',
    // Nutrition
    nutr_title: 'Nutrition',
    nutr_add: '+ Ajouter',
    nutr_today: 'Aujourd\'hui',
    nutr_breakfast: 'Petit-déjeuner',
    nutr_lunch: 'Déjeuner',
    nutr_snack: 'Collation',
    nutr_dinner: 'Dîner',
    nutr_calories: 'Calories du jour',
    nutr_macros: 'Macronutriments',
    nutr_7days: 'Calories — 7 jours',
    nutr_food_name: 'Nom de l\'aliment',
    nutr_quantity: 'Quantité (g)',
    nutr_add_food: 'Ajouter',
    nutr_cancel: 'Annuler',
    // Entrainement
    train_title: 'Entraînement',
    train_choose: 'Choisir une séance',
    train_exercises: 'Exercices',
    train_series: 'Séries validées',
    train_volume: 'Volume total',
    train_duration: 'Durée',
    train_timer: 'Chronomètre',
    train_start: '▶ Démarrer',
    train_pause: '⏸ Pause',
    train_reset: '↺ Reset',
    train_validate_all: '✓ Valider toutes les séries',
    train_change: '← Changer de séance',
    // Profil
    profil_title: 'Profil',
    profil_personal: 'Infos personnelles',
    profil_objectives: 'Objectifs & Corps',
    profil_notifications: 'Notifications',
    profil_security: 'Sécurité',
    profil_save: 'Sauvegarder',
    profil_logout: 'Déconnexion',
    // Plans
    plan_free: 'Gratuit',
    plan_warrior: '⚔️ Guerrier',
    plan_champion: '🛡️ Champion',
    plan_elite: '👑 Élite',
    // Landing
    landing_slogan: 'NOT JUST FLESH, BUT SPIRIT.',
    landing_connect: 'Connexion',
    landing_signup: 'S\'inscrire',
    landing_hero: 'CHOISIS TON ARMURE.',
    landing_sub: 'Commence gratuitement, monte en puissance quand tu es prêt.',
    // Onboarding
    onboard_genre: 'Tu es qui, toi ?',
    onboard_genre_sub: 'Ça nous aide à personnaliser ton expérience.',
    onboard_homme: 'Homme',
    onboard_femme: 'Femme',
    onboard_objectif: 'Ton objectif.',
    onboard_objectif_sub: 'Sois honnête avec toi-même — c\'est la base de tout.',
    onboard_perte: 'Perte de gras',
    onboard_masse: 'Prise de masse',
    onboard_endurance: 'Endurance',
    onboard_equilibre: 'Rééquilibrage',
    onboard_plan: 'Choisis ton armure.',
    onboard_plan_sub: 'Commence gratuitement. Monte en puissance quand tu es prêt.',
    onboard_continue: 'Continuer →',
    onboard_start: 'Commencer →',
  },

  en: {
    nav_dashboard: 'Dashboard',
    nav_nutrition: 'Nutrition',
    nav_training: 'Training',
    nav_progression: 'Progress',
    nav_bodyfat: 'Body Analysis',
    nav_coach: 'Coach Sensei',
    nav_classement: 'Leaderboard',
    nav_profil: 'Profile',
    nav_abonnement: 'Subscription',
    dash_greeting: 'Hello',
    dash_calories: 'Calories',
    dash_weight: 'Weight',
    dash_bodyfat: 'Body Fat',
    dash_meals: 'Meals',
    dash_objective: 'Goal',
    dash_remaining: 'remaining',
    dash_today: 'today',
    dash_proteins: 'Protein',
    dash_carbs: 'Carbs',
    dash_fats: 'Fats',
    dash_week: 'This week',
    dash_verse: 'Verse of the day',
    dash_body3d: '3D Body',
    dash_meals_today: 'Today\'s meals',
    dash_add_meal: '+ Add meal',
    dash_see_all: 'See all',
    dash_calories_day: 'Today\'s calories',
    dash_add: '+ Add',
    nutr_title: 'Nutrition',
    nutr_add: '+ Add',
    nutr_today: 'Today',
    nutr_breakfast: 'Breakfast',
    nutr_lunch: 'Lunch',
    nutr_snack: 'Snack',
    nutr_dinner: 'Dinner',
    nutr_calories: 'Today\'s calories',
    nutr_macros: 'Macronutrients',
    nutr_7days: 'Calories — 7 days',
    nutr_food_name: 'Food name',
    nutr_quantity: 'Quantity (g)',
    nutr_add_food: 'Add',
    nutr_cancel: 'Cancel',
    train_title: 'Training',
    train_choose: 'Choose a session',
    train_exercises: 'Exercises',
    train_series: 'Validated sets',
    train_volume: 'Total volume',
    train_duration: 'Duration',
    train_timer: 'Stopwatch',
    train_start: '▶ Start',
    train_pause: '⏸ Pause',
    train_reset: '↺ Reset',
    train_validate_all: '✓ Validate all sets',
    train_change: '← Change session',
    profil_title: 'Profile',
    profil_personal: 'Personal info',
    profil_objectives: 'Goals & Body',
    profil_notifications: 'Notifications',
    profil_security: 'Security',
    profil_save: 'Save',
    profil_logout: 'Logout',
    plan_free: 'Free',
    plan_warrior: '⚔️ Warrior',
    plan_champion: '🛡️ Champion',
    plan_elite: '👑 Elite',
    landing_slogan: 'NOT JUST FLESH, BUT SPIRIT.',
    landing_connect: 'Login',
    landing_signup: 'Sign up',
    landing_hero: 'CHOOSE YOUR ARMOR.',
    landing_sub: 'Start for free, level up when you\'re ready.',
    onboard_genre: 'Who are you?',
    onboard_genre_sub: 'This helps us personalize your experience.',
    onboard_homme: 'Male',
    onboard_femme: 'Female',
    onboard_objectif: 'Your goal.',
    onboard_objectif_sub: 'Be honest — this is the foundation of everything.',
    onboard_perte: 'Fat loss',
    onboard_masse: 'Muscle gain',
    onboard_endurance: 'Endurance',
    onboard_equilibre: 'Rebalancing',
    onboard_plan: 'Choose your armor.',
    onboard_plan_sub: 'Start for free. Level up when you\'re ready.',
    onboard_continue: 'Continue →',
    onboard_start: 'Start →',
  },

  bg: {
    nav_dashboard: 'Начало',
    nav_nutrition: 'Хранене',
    nav_training: 'Тренировка',
    nav_progression: 'Прогрес',
    nav_bodyfat: 'Анализ на тялото',
    nav_coach: 'Треньор Сенсей',
    nav_classement: 'Класация',
    nav_profil: 'Профил',
    nav_abonnement: 'Абонамент',
    dash_greeting: 'Здравей',
    dash_calories: 'Калории',
    dash_weight: 'Тегло',
    dash_bodyfat: 'Телесни мазнини',
    dash_meals: 'Хранения',
    dash_objective: 'Цел',
    dash_remaining: 'оставащи',
    dash_today: 'днес',
    dash_proteins: 'Протеини',
    dash_carbs: 'Въглехидрати',
    dash_fats: 'Мазнини',
    dash_week: 'Тази седмица',
    dash_verse: 'Стих на деня',
    dash_body3d: '3D Тяло',
    dash_meals_today: 'Хранения днес',
    dash_add_meal: '+ Добави хранене',
    dash_see_all: 'Виж всички',
    dash_calories_day: 'Калории за деня',
    dash_add: '+ Добави',
    nutr_title: 'Хранене',
    nutr_add: '+ Добави',
    nutr_today: 'Днес',
    nutr_breakfast: 'Закуска',
    nutr_lunch: 'Обяд',
    nutr_snack: 'Закуска',
    nutr_dinner: 'Вечеря',
    nutr_calories: 'Калории за деня',
    nutr_macros: 'Макронутриенти',
    nutr_7days: 'Калории — 7 дни',
    nutr_food_name: 'Название на храната',
    nutr_quantity: 'Количество (г)',
    nutr_add_food: 'Добави',
    nutr_cancel: 'Отказ',
    train_title: 'Тренировка',
    train_choose: 'Избери тренировка',
    train_exercises: 'Упражнения',
    train_series: 'Завършени серии',
    train_volume: 'Общ обем',
    train_duration: 'Продължителност',
    train_timer: 'Хронометър',
    train_start: '▶ Старт',
    train_pause: '⏸ Пауза',
    train_reset: '↺ Нулиране',
    train_validate_all: '✓ Потвърди всички серии',
    train_change: '← Смени тренировка',
    profil_title: 'Профил',
    profil_personal: 'Лична информация',
    profil_objectives: 'Цели и тяло',
    profil_notifications: 'Известия',
    profil_security: 'Сигурност',
    profil_save: 'Запази',
    profil_logout: 'Изход',
    plan_free: 'Безплатен',
    plan_warrior: '⚔️ Войн',
    plan_champion: '🛡️ Шампион',
    plan_elite: '👑 Елит',
    landing_slogan: 'NOT JUST FLESH, BUT SPIRIT.',
    landing_connect: 'Вход',
    landing_signup: 'Регистрация',
    landing_hero: 'ИЗБЕРИ СВОЯТА БРОНЯ.',
    landing_sub: 'Започни безплатно, качи нивото когато си готов.',
    onboard_genre: 'Кой си ти?',
    onboard_genre_sub: 'Това ни помага да персонализираме твоя опит.',
    onboard_homme: 'Мъж',
    onboard_femme: 'Жена',
    onboard_objectif: 'Твоята цел.',
    onboard_objectif_sub: 'Бъди честен — това е основата на всичко.',
    onboard_perte: 'Загуба на мазнини',
    onboard_masse: 'Натрупване на мускули',
    onboard_endurance: 'Издръжливост',
    onboard_equilibre: 'Баланс',
    onboard_plan: 'Избери своята броня.',
    onboard_plan_sub: 'Започни безплатно. Качи нивото когато си готов.',
    onboard_continue: 'Продължи →',
    onboard_start: 'Начало →',
  }
};

// Langue par défaut
function getLang() {
  return localStorage.getItem('espritum_lang') || 'fr';
}

function setLang(lang) {
  localStorage.setItem('espritum_lang', lang);
  applyTranslations(lang);
  updateFlagButtons(lang);
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS['fr'][key] || key;
}

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS['fr'][key];
    if (val) el.textContent = val;
  });
}

function updateFlagButtons(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

function initI18n() {
  const lang = getLang();
  applyTranslations(lang);
  updateFlagButtons(lang);
}

// HTML du sélecteur de drapeaux
function getLangSelectorHTML() {
  return `
    <div class="lang-selector">
      <button class="lang-btn" data-lang="fr" onclick="setLang('fr')" title="Français">🇫🇷</button>
      <button class="lang-btn" data-lang="en" onclick="setLang('en')" title="English">🇬🇧</button>
      <button class="lang-btn" data-lang="bg" onclick="setLang('bg')" title="Български">🇧🇬</button>
    </div>`;
}
