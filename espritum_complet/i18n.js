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
    // Stats entraînement
    train_today: 'aujourd\'hui',
    train_planned: 'prévues',
    train_sets_x_reps: 'séries × reps × poids',
    train_stopwatch: 'chronomètre',
    train_session: 'Séance',
    train_week: 'Semaine',
    train_progress: 'Progression séance',
    // Nutrition labels
    nutr_objective: 'Objectif',
    nutr_remaining: 'Restantes',
    nutr_7days_chart: 'Calories — 7 jours',
    nutr_add_repas: '+ Ajouter',
    // Common
    common_save: 'Sauvegarder',
    common_cancel: 'Annuler',
    common_add: 'Ajouter',
    common_delete: 'Supprimer',
    common_edit: 'Modifier',
    common_close: 'Fermer',
    // Tarifs complets
    free_tag: '— Toujours gratuit',
    free_title: 'COMMENCE SANS PAYER.',
    free_desc: 'Découvre Espritum gratuitement avec la fonctionnalité phare : l\'estimation de ta masse grasse par caméra. Pas de carte bancaire requise.',
    free_f1: 'Estimation masse grasse (caméra)',
    free_f2: 'Verset biblique du jour',
    free_f3: 'Dashboard basique',
    free_f4: 'Plan d\'entraînement fixe',
    free_f5: 'Suivi poids simple',
    plan_included: 'Inclus dans ce plan',
    price_period: 'par mois',
    warrior_desc: 'Pour celui qui fait ses premiers pas dans la discipline. Les fondations sont posées.',
    warrior_cta: 'Rejoindre Guerrier →',
    champion_desc: 'Pour le guerrier sérieux. L\'IA devient ton mentor personnel, disponible 24h/24.',
    champion_cta: 'Rejoindre Champion →',
    elite_desc: 'Pour ceux qui refusent la médiocrité. Une expérience entièrement sur-mesure.',
    elite_cta: 'Rejoindre Élite →',
    wf1: 'Tout du plan gratuit', wf2: 'Suivi nutrition complet (calories + macros)',
    wf3: '3 plans d\'entraînement personnalisés', wf4: 'Historique 30 jours',
    wf5: 'Badges & système de niveaux', wf6: 'Coach IA Sensei', wf7: 'Scan repas caméra',
    cf1: 'Tout du plan Guerrier', cf2: 'Coach IA Sensei (illimité)',
    cf3: 'Scan de repas par caméra', cf4: 'Suivi mensurations complet',
    cf5: 'Photos progression avant/après', cf6: 'Classement communautaire',
    cf7: 'Prières & citations bibliques premium',
    ef1: 'Tout du plan Champion', ef2: 'Plan nutrition 100% IA personnalisé',
    ef3: 'Analyse morphologique avancée', ef4: 'Accès prioritaire nouvelles fonctionnalités',
    ef5: 'Badge Élite exclusif', ef6: 'Support direct prioritaire',
    // FAQ complète
    faq_q1b: 'Comment fonctionne l\'estimation de masse grasse par caméra ?',
    faq_a1b: 'L\'IA analyse ta silhouette et estime ton taux de masse grasse. Ce n\'est pas une mesure médicale, mais une estimation fiable pour suivre ta progression. Disponible gratuitement.',
    faq_q2: 'Puis-je changer de plan à tout moment ?',
    faq_a2: 'Oui, tu peux upgrader ou downgrader ton plan depuis ton profil. Le changement prend effet immédiatement.',
    faq_q3b: 'Le contenu chrétien est-il obligatoire ?',
    faq_a3b: 'Non. Les versets, prières et citations bibliques sont optionnels. Espritum accueille tout le monde.',
    faq_q4: 'Comment fonctionne le Coach IA Sensei ?',
    faq_a4: 'Sensei est alimenté par l\'IA Claude d\'Anthropic. Il analyse tes données et donne des conseils personnalisés. Disponible sur Champion et Élite.',
    faq_q5: 'L\'application est-elle disponible sur iPhone ?',
    faq_a5: 'Espritum est une PWA accessible via le navigateur sur iOS et Android. Sur iPhone, ajoute-la à ton écran d\'accueil depuis Safari.',
    faq_q6: 'Mes données sont-elles sécurisées ?',
    faq_a6: 'Oui. Toutes tes données sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais tes informations.',
    faq_q7: 'Y a-t-il une période d\'essai ?',
    faq_a7: 'Le plan gratuit est permanent. Pour les plans payants, nous offrons une garantie satisfait ou remboursé de 7 jours.',
    // Landing — sections
    landing_about: 'À propos',
    landing_features: 'Fonctionnalités',
    landing_pricing: 'Tarifs',
    landing_faq: 'FAQ',
    landing_monthly: 'Mensuel',
    landing_yearly: 'Annuel',
    landing_save: 'Économise 20%',
    landing_verse_tag: '— Verset du jour',
    landing_verse: '"Ne sais-tu pas ? L\'Éternel donne de la force à celui qui est fatigué."',
    landing_verse_ref: 'Ésaïe 40 : 28-29',
    // Features
    feat_bodyfat_title: 'Masse grasse par caméra',
    feat_bodyfat_desc: 'L\'IA analyse ta silhouette et estime ton taux de masse grasse en quelques secondes.',
    feat_coach_title: 'Coach IA Sensei',
    feat_coach_desc: 'Un mentor alimenté par l\'IA, disponible 24h/24. Conseils nutrition et entraînement.',
    feat_nutrition_title: 'Suivi nutrition',
    feat_nutrition_desc: 'Calories, macros et repas favoris. Tout pour maîtriser ton alimentation.',
    feat_training_title: 'Plans d\'entraînement',
    feat_training_desc: 'Des programmes selon ton profil, ton objectif et ton niveau.',
    feat_progress_title: 'Progression corporelle',
    feat_progress_desc: 'Photos, mensurations, poids — tout tracé avec des graphiques clairs.',
    feat_faith_title: 'Motivation chrétienne',
    feat_faith_desc: 'Un verset biblique chaque matin pour tenir le cap.',
    // Plans
    plan_free_desc: 'Estimation masse grasse · Verset du jour · Dashboard',
    plan_warrior_desc: 'Nutrition complète · Entraînements · Historique 30j',
    plan_champion_desc: 'Scan repas · Mensurations · Classement',
    plan_elite_desc: 'Plan IA 100% · Analyse morphologique · Support prioritaire',
    plan_free_price: 'Gratuit',
    plan_popular: '⭐ Populaire',
    plan_start: 'Commencer gratuitement →',
    plan_choose: 'Choisir ce plan →',
    // FAQ
    faq_title: 'Questions fréquentes',
    faq_q1: 'Est-ce que je peux changer de plan à tout moment ?',
    faq_a1: 'Oui, tu peux upgrader ou downgrader ton plan quand tu veux. Les changements prennent effet immédiatement.',
    faq_q2: 'L\'application fonctionne-t-elle sans connexion internet ?',
    faq_a2: 'Les données de base sont accessibles hors ligne. Le coach IA et la synchronisation nécessitent une connexion.',
    faq_q3: 'Mes données sont-elles sécurisées ?',
    faq_a3: 'Oui. Toutes les données sont chiffrées et hébergées sur des serveurs sécurisés (Supabase).',
    // Footer
    footer_rights: '© 2025 Espritum — Tous droits réservés',
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
    train_today: 'today',
    train_planned: 'planned',
    train_sets_x_reps: 'sets × reps × weight',
    train_stopwatch: 'stopwatch',
    train_session: 'Session',
    train_week: 'Week',
    train_progress: 'Session progress',
    nutr_objective: 'Goal',
    nutr_remaining: 'Remaining',
    nutr_7days_chart: 'Calories — 7 days',
    nutr_add_repas: '+ Add',
    common_save: 'Save',
    common_cancel: 'Cancel',
    common_add: 'Add',
    common_delete: 'Delete',
    common_edit: 'Edit',
    common_close: 'Close',
    landing_about: 'About',
    landing_features: 'Features',
    landing_pricing: 'Pricing',
    landing_faq: 'FAQ',
    landing_monthly: 'Monthly',
    landing_yearly: 'Yearly',
    landing_save: 'Save 20%',
    landing_verse_tag: '— Verse of the day',
    landing_verse: '"Don\'t you know? The Lord gives strength to the weary."',
    landing_verse_ref: 'Isaiah 40 : 28-29',
    feat_bodyfat_title: 'Body fat camera',
    feat_bodyfat_desc: 'AI analyzes your silhouette and estimates your body fat percentage in seconds.',
    feat_coach_title: 'AI Coach Sensei',
    feat_coach_desc: 'An AI-powered mentor, available 24/7. Nutrition and training advice.',
    feat_nutrition_title: 'Nutrition tracking',
    feat_nutrition_desc: 'Calories, macros and favorite meals. Master your diet daily.',
    feat_training_title: 'Training plans',
    feat_training_desc: 'Programs based on your profile, goal and level.',
    feat_progress_title: 'Body progress',
    feat_progress_desc: 'Photos, measurements, weight — all tracked with clear charts.',
    feat_faith_title: 'Christian motivation',
    feat_faith_desc: 'A Bible verse every morning to keep you on track.',
    plan_free_desc: 'Body fat estimate · Verse of the day · Dashboard',
    plan_warrior_desc: 'Full nutrition · Workouts · 30-day history',
    plan_champion_desc: 'Meal scan · Measurements · Leaderboard',
    plan_elite_desc: '100% AI plan · Morphological analysis · Priority support',
    plan_free_price: 'Free',
    plan_popular: '⭐ Popular',
    plan_start: 'Start for free →',
    plan_choose: 'Choose this plan →',
    faq_title: 'Frequently asked questions',
    faq_q1: 'Can I change my plan at any time?',
    faq_a1: 'Yes, you can upgrade or downgrade your plan whenever you want. Changes take effect immediately.',
    faq_q2: 'Does the app work without internet?',
    faq_a2: 'Basic data is accessible offline. The AI coach and sync require a connection.',
    faq_q3: 'Is my data secure?',
    faq_a3: 'Yes. All data is encrypted and hosted on secure servers (Supabase).',
    footer_rights: '© 2025 Espritum — All rights reserved',
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
    train_today: 'днес',
    train_planned: 'планирани',
    train_sets_x_reps: 'серии × повторения × тегло',
    train_stopwatch: 'хронометър',
    train_session: 'Тренировка',
    train_week: 'Седмица',
    train_progress: 'Напредък',
    nutr_objective: 'Цел',
    nutr_remaining: 'Оставащи',
    nutr_7days_chart: 'Калории — 7 дни',
    nutr_add_repas: '+ Добави',
    common_save: 'Запази',
    common_cancel: 'Отказ',
    common_add: 'Добави',
    common_delete: 'Изтрий',
    common_edit: 'Редактирай',
    common_close: 'Затвори',
    landing_about: 'За нас',
    landing_features: 'Функции',
    landing_pricing: 'Цени',
    landing_faq: 'Въпроси',
    landing_monthly: 'Месечно',
    landing_yearly: 'Годишно',
    landing_save: 'Спести 20%',
    landing_verse_tag: '— Стих на деня',
    landing_verse: '"Не знаеш ли? Господ дава сила на уморения."',
    landing_verse_ref: 'Исая 40 : 28-29',
    feat_bodyfat_title: 'Телесни мазнини с камера',
    feat_bodyfat_desc: 'ИИ анализира силуета ти и изчислява процента телесни мазнини за секунди.',
    feat_coach_title: 'ИИ Треньор Сенсей',
    feat_coach_desc: 'ИИ ментор, достъпен 24/7. Съвети за хранене и тренировки.',
    feat_nutrition_title: 'Проследяване на хранене',
    feat_nutrition_desc: 'Калории, макроси и любими ястия. Контролирай диетата си.',
    feat_training_title: 'Планове за тренировка',
    feat_training_desc: 'Програми според твоя профил, цел и ниво.',
    feat_progress_title: 'Телесен прогрес',
    feat_progress_desc: 'Снимки, мерки, тегло — всичко с ясни графики.',
    feat_faith_title: 'Християнска мотивация',
    feat_faith_desc: 'Библейски стих всяка сутрин, за да устоиш.',
    plan_free_desc: 'Оценка на мазнини · Стих на деня · Начало',
    plan_warrior_desc: 'Пълно хранене · Тренировки · История 30 дни',
    plan_champion_desc: 'Сканиране на ястия · Мерки · Класация',
    plan_elite_desc: '100% ИИ план · Морфологичен анализ · Приоритетна поддръжка',
    plan_free_price: 'Безплатно',
    plan_popular: '⭐ Популярен',
    plan_start: 'Започни безплатно →',
    plan_choose: 'Избери план →',
    faq_title: 'Често задавани въпроси',
    faq_q1: 'Мога ли да сменя плана по всяко време?',
    faq_a1: 'Да, можеш да надградиш или понижиш плана си когато искаш.',
    faq_q2: 'Работи ли приложението без интернет?',
    faq_a2: 'Основните данни са достъпни офлайн. ИИ треньорът изисква връзка.',
    faq_q3: 'Данните ми сигурни ли са?',
    faq_a3: 'Да. Всички данни са криптирани и хоствани на сигурни сървъри.',
    footer_rights: '© 2025 Espritum — Всички права запазени',
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
  // Recharger la page avec la nouvelle langue — garantit que TOUT est traduit
  window.location.reload();
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS['fr'][key] || key;
}

function applyTranslations(lang) {
  const T = TRANSLATIONS[lang] || TRANSLATIONS['fr'];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = T[key] || TRANSLATIONS['fr'][key];
    if (!val) return;

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else if (key === 'landing_hero') {
      const words = val.split(' ');
      const last = words.pop();
      el.innerHTML = words.join(' ') + '<br><span class="accent">' + last + '</span>';
    } else if (key === 'free_title') {
      // Titre gratuit avec span rouge
      const parts = val.split(' ');
      const last = parts.pop();
      el.innerHTML = parts.join(' ') + '<br><span>' + last + '</span>';
    } else {
      el.textContent = val;
    }
  });

  // Forcer aussi les éléments sans data-i18n via leurs classes CSS
  // (pour les éléments qui auraient le tag mais pas détectés)
  const directMap = {
    '.free-tag':    'free_tag',
    '.free-title':  'free_title', 
    '.free-desc':   'free_desc',
    '.free-cta':    'plan_start',
    '.featured-badge': 'plan_popular',
    '#lbl-monthly': 'landing_monthly',
    '#lbl-yearly':  'landing_yearly',
    '.save-badge':  'landing_save',
    '.price-period': 'price_period',
  };

  for (const [selector, key] of Object.entries(directMap)) {
    const val = T[key] || TRANSLATIONS['fr'][key];
    if (!val) continue;
    document.querySelectorAll(selector).forEach(el => {
      if (key === 'free_title') {
        const parts = val.split(' ');
        const last = parts.pop();
        el.innerHTML = parts.join(' ') + '<br><span>' + last + '</span>';
      } else {
        el.textContent = val;
      }
    });
  }

  // Features du plan gratuit (par index)
  const freeFeats = ['free_f1','free_f2','free_f3','free_f4','free_f5'];
  document.querySelectorAll('.free-feature').forEach((el, i) => {
    if (freeFeats[i]) {
      const val = T[freeFeats[i]] || TRANSLATIONS['fr'][freeFeats[i]];
      if (val) {
        const dot = el.querySelector('.free-dot');
        el.innerHTML = '';
        if (dot) el.appendChild(dot);
        el.appendChild(document.createTextNode(val));
      }
    }
  });

  // Plan descriptions par index
  const planDescs = ['warrior_desc','champion_desc','elite_desc'];
  document.querySelectorAll('.plan-desc').forEach((el, i) => {
    if (planDescs[i]) {
      const val = T[planDescs[i]] || TRANSLATIONS['fr'][planDescs[i]];
      if (val) el.textContent = val;
    }
  });

  // Plan CTAs par index
  const planCtas = ['warrior_cta','champion_cta','elite_cta'];
  document.querySelectorAll('.plan-cta').forEach((el, i) => {
    if (planCtas[i]) {
      const val = T[planCtas[i]] || TRANSLATIONS['fr'][planCtas[i]];
      if (val) el.textContent = val;
    }
  });

  // Plan "Inclus dans ce plan"
  const incl = T['plan_included'] || TRANSLATIONS['fr']['plan_included'];
  if (incl) document.querySelectorAll('.features-label').forEach(el => el.textContent = incl);

  // Features par clé wf1-wf7, cf1-cf7, ef1-ef6
  const allFeatureKeys = [
    'wf1','wf2','wf3','wf4','wf5','wf6','wf7',
    'cf1','cf2','cf3','cf4','cf5','cf6','cf7',
    'ef1','ef2','ef3','ef4','ef5','ef6'
  ];
  document.querySelectorAll('.feature span[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = T[key] || TRANSLATIONS['fr'][key];
    if (val) el.textContent = val;
  });

  // Features sans data-i18n — par ordre dans les listes .features
  const planCards = document.querySelectorAll('.plan-card');
  const featureGroups = [
    ['wf1','wf2','wf3','wf4','wf5','wf6','wf7'],
    ['cf1','cf2','cf3','cf4','cf5','cf6','cf7'],
    ['ef1','ef2','ef3','ef4','ef5','ef6'],
  ];
  planCards.forEach((card, ci) => {
    const keys = featureGroups[ci];
    if (!keys) return;
    card.querySelectorAll('.feature').forEach((li, fi) => {
      if (keys[fi]) {
        const val = T[keys[fi]] || TRANSLATIONS['fr'][keys[fi]];
        if (val) {
          const check = li.querySelector('.check');
          li.innerHTML = '';
          if (check) li.appendChild(check);
          li.appendChild(document.createTextNode(val));
        }
      }
    });
  });

  // Feat descriptions par ordre
  const featDescKeys = [
    'feat_bodyfat_desc','feat_coach_desc','feat_nutrition_desc',
    'feat_training_desc','feat_progress_desc','feat_faith_desc'
  ];
  document.querySelectorAll('.feat-desc').forEach((el, i) => {
    if (featDescKeys[i]) {
      const val = T[featDescKeys[i]] || TRANSLATIONS['fr'][featDescKeys[i]];
      if (val) el.textContent = val;
    }
  });

  // Feat titles
  const featTitleKeys = [
    'feat_bodyfat_title','feat_coach_title','feat_nutrition_title',
    'feat_training_title','feat_progress_title','feat_faith_title'
  ];
  document.querySelectorAll('.feat-title').forEach((el, i) => {
    if (featTitleKeys[i]) {
      const val = T[featTitleKeys[i]] || TRANSLATIONS['fr'][featTitleKeys[i]];
      if (val) el.textContent = val;
    }
  });

  // FAQ questions et réponses par ordre
  const faqQKeys = ['faq_q1b','faq_q2','faq_q3b','faq_q4','faq_q5','faq_q6','faq_q7'];
  const faqAKeys = ['faq_a1b','faq_a2','faq_a3b','faq_a4','faq_a5','faq_a6','faq_a7'];
  document.querySelectorAll('.faq-q').forEach((el, i) => {
    if (faqQKeys[i]) {
      const val = T[faqQKeys[i]] || TRANSLATIONS['fr'][faqQKeys[i]];
      if (val) {
        const arrow = el.querySelector('.faq-arrow');
        el.innerHTML = '';
        el.appendChild(document.createTextNode(val));
        if (arrow) el.appendChild(arrow);
      }
    }
  });
  document.querySelectorAll('.faq-a').forEach((el, i) => {
    if (faqAKeys[i]) {
      const val = T[faqAKeys[i]] || TRANSLATIONS['fr'][faqAKeys[i]];
      if (val) el.textContent = val;
    }
  });

  // Nav links landing
  const navLinks = document.querySelectorAll('.nav-links a');
  const navKeys = ['landing_about','landing_features','landing_pricing','landing_faq'];
  navLinks.forEach((el, i) => {
    if (navKeys[i]) {
      const val = T[navKeys[i]] || TRANSLATIONS['fr'][navKeys[i]];
      if (val) el.textContent = val;
    }
  });

  // Hero sub + slogan
  const heroSub = T['landing_sub'] || TRANSLATIONS['fr']['landing_sub'];
  if (heroSub) document.querySelectorAll('.hero-sub').forEach(el => el.textContent = heroSub);

  const slogan = T['landing_slogan'] || TRANSLATIONS['fr']['landing_slogan'];
  if (slogan) document.querySelectorAll('[data-i18n="landing_slogan"]').forEach(el => el.textContent = slogan);

  // Boutons nav
  const btnConnect = T['landing_connect'] || TRANSLATIONS['fr']['landing_connect'];
  const btnSignup = T['landing_signup'] || TRANSLATIONS['fr']['landing_signup'];
  document.querySelectorAll('[data-i18n="landing_connect"]').forEach(el => { if(btnConnect) el.textContent = btnConnect; });
  document.querySelectorAll('[data-i18n="landing_signup"]').forEach(el => { if(btnSignup) el.textContent = btnSignup; });

  // Verset
  const verseTag = T['landing_verse_tag'];
  const verseText = T['landing_verse'];
  const verseRef = T['landing_verse_ref'];
  if (verseTag) document.querySelectorAll('.verse-tag').forEach(el => el.textContent = verseTag);
  if (verseText) document.querySelectorAll('.verse-text').forEach(el => el.textContent = verseText);
  if (verseRef) document.querySelectorAll('.verse-ref').forEach(el => el.textContent = verseRef);

  // Section headings par ordre
  const headingKeys = ['landing_about','landing_features','landing_pricing','faq_title'];
  document.querySelectorAll('.section-heading').forEach((el, i) => {
    if (headingKeys[i]) {
      const val = T[headingKeys[i]] || TRANSLATIONS['fr'][headingKeys[i]];
      if (val) el.textContent = val;
    }
  });

  // Footer
  const footer = T['footer_rights'];
  if (footer) document.querySelectorAll('[data-i18n="footer_rights"]').forEach(el => el.textContent = footer);

  document.documentElement.lang = lang;
}

// Traduire aussi les textes dynamiques
function translateDynamic(key) {
  return t(key);
}

function updateFlagButtons(lang) {
  const FLAGS = { fr: '🇫🇷', en: '🇬🇧', bg: '🇧🇬' };
  
  // Anciens boutons lang-btn
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Dropdown landing page
  const currentFlag = document.getElementById('lang-current-flag');
  if (currentFlag) currentFlag.textContent = FLAGS[lang];

  // Dropdown app mobile
  const appFlag = document.getElementById('app-lang-flag');
  if (appFlag) appFlag.textContent = FLAGS[lang];

  // Options actives dans les menus
  document.querySelectorAll('.lang-option').forEach(btn => {
    const onclick = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', onclick.includes(`'${lang}'`));
  });
}

function initI18n() {
  const lang = getLang();
  applyTranslations(lang);
  updateFlagButtons(lang);
  // Appliquer aussi après que le DOM soit complètement chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyTranslations(lang);
      updateFlagButtons(lang);
    });
  }
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
