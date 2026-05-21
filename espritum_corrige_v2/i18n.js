// ── ESPRITUM i18n — FR / EN / BG ──
const TRANSLATIONS = {
  fr: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_nutrition: 'Nutrition',
    nav_training: 'Entraînement',
    nav_progression: 'Progression',
    nav_bodyfat: 'Estimation',
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
    dash_today: "aujourd'hui",
    dash_proteins: 'Protéines',
    dash_carbs: 'Glucides',
    dash_fats: 'Lipides',
    dash_verse: 'Verset du jour',
    dash_calories_day: 'Calories du jour',
    dash_add: '+ Ajouter',
    // Nutrition
    nutr_title: 'Nutrition',
    nutr_today: "Aujourd'hui",
    nutr_breakfast: 'Petit-déjeuner',
    nutr_lunch: 'Déjeuner',
    nutr_snack: 'Collation',
    nutr_dinner: 'Dîner',
    nutr_calories: 'Calories du jour',
    nutr_macros: 'Macronutriments',
    nutr_objective: 'Objectif',
    nutr_remaining: 'Restantes',
    // Training
    train_title: 'Entraînement',
    train_choose: 'Choisir une séance',
    train_exercises: 'Exercices',
    train_series: 'Séries validées',
    train_volume: 'Volume total',
    train_duration: 'Durée',
    train_timer: 'Chronomètre',
    train_start: '▶ Démarrer',
    train_validate_all: '✓ Valider toutes les séries',
    train_change: '← Changer de séance',
    // Profil
    profil_title: 'Profil',
    profil_save: 'Sauvegarder',
    profil_logout: 'Déconnexion',
    // Plans
    plan_free: 'Gratuit',
    plan_warrior: '⚔️ Guerrier',
    plan_champion: '🛡️ Champion',
    plan_elite: '👑 Élite',
    // Tarifs
    free_tag: '— Toujours gratuit',
    free_title: 'COMMENCE SANS PAYER.',
    free_desc: "Découvre Espritum gratuitement avec la fonctionnalité phare : l'estimation de ta masse grasse par caméra. Pas de carte bancaire requise.",
    free_f1: 'Estimation masse grasse (caméra)',
    free_f2: 'Verset biblique du jour',
    free_f3: 'Dashboard basique',
    free_f4: "1 plan d'entraînement fixe",
    free_f5: 'Suivi poids simple',
    plan_included: 'Inclus dans ce plan',
    price_period: 'par mois',
    warrior_desc: 'Pour celui qui fait ses premiers pas dans la discipline. Les fondations sont posées.',
    warrior_cta: 'Rejoindre Guerrier →',
    champion_desc: "Pour le guerrier sérieux. L'IA devient ton mentor personnel, disponible 24h/24.",
    champion_cta: 'Rejoindre Champion →',
    elite_desc: 'Pour ceux qui refusent la médiocrité. Une expérience entièrement sur-mesure.',
    elite_cta: 'Rejoindre Élite →',
    wf1: 'Tout du plan gratuit', wf2: 'Suivi nutrition complet (calories + macros)',
    wf3: "3 plans d'entraînement personnalisés", wf4: 'Historique 30 jours',
    wf5: 'Badges & système de niveaux', wf6: 'Coach IA Sensei', wf7: 'Scan repas caméra',
    cf1: 'Tout du plan Guerrier', cf2: 'Coach IA Sensei (illimité)',
    cf3: 'Scan de repas par caméra', cf4: 'Suivi mensurations complet',
    cf5: 'Photos progression avant/après', cf6: 'Classement communautaire',
    cf7: 'Prières & citations bibliques premium',
    ef1: 'Tout du plan Champion', ef2: 'Plan nutrition 100% IA personnalisé',
    ef3: 'Analyse morphologique avancée', ef4: 'Accès prioritaire nouvelles fonctionnalités',
    ef5: 'Badge Élite exclusif', ef6: 'Support direct prioritaire',
    // FAQ
    faq_q1b: "Comment fonctionne l'estimation de masse grasse par caméra ?",
    faq_a1b: "L'IA analyse ta silhouette via la caméra de ton téléphone et estime ton taux de masse grasse. Ce n'est pas une mesure médicale, mais une estimation fiable. Disponible gratuitement.",
    faq_q2: 'Puis-je changer de plan à tout moment ?',
    faq_a2: 'Oui, tu peux upgrader ou downgrader ton plan depuis ton profil. Le changement prend effet immédiatement.',
    faq_q3b: 'Le contenu chrétien est-il obligatoire ?',
    faq_a3b: 'Non. Les versets, prières et citations bibliques sont optionnels. Espritum accueille tout le monde.',
    faq_q4: 'Comment fonctionne le Coach IA Sensei ?',
    faq_a4: "Sensei est alimenté par l'IA Claude d'Anthropic. Disponible sur Champion et Élite.",
    faq_q5: "L'application est-elle disponible sur iPhone ?",
    faq_a5: "Espritum est une PWA accessible via le navigateur sur iOS et Android. Sur iPhone, ajoute-la à ton écran d'accueil depuis Safari.",
    faq_q6: 'Mes données sont-elles sécurisées ?',
    faq_a6: 'Oui. Toutes tes données sont chiffrées et stockées de manière sécurisée.',
    faq_q7: "Y a-t-il une période d'essai ?",
    faq_a7: 'Le plan gratuit est permanent. Pour les plans payants, nous offrons une garantie satisfait ou remboursé de 7 jours.',
    // Landing
    landing_slogan: 'NOT JUST FLESH, BUT SPIRIT.',
    landing_connect: 'Connexion',
    landing_signup: "S'inscrire",
    landing_hero: 'CHOISIS TON ARMURE.',
    landing_sub: "Chaque plan est une étape vers une meilleure version de toi-même. Commence gratuitement, monte en puissance quand tu es prêt.",
    landing_about: 'À propos',
    landing_features: 'Fonctionnalités',
    landing_pricing: 'Tarifs',
    landing_faq: 'FAQ',
    faq_title: 'Questions fréquentes',
    landing_monthly: 'Mensuel',
    landing_yearly: 'Annuel',
    landing_save: '-20%',
    landing_verse_tag: '— Verset du jour',
    landing_verse: '"Ne sais-tu pas ? L\'Éternel donne de la force à celui qui est fatigué."',
    landing_verse_ref: 'Ésaïe 40 : 28-29',
    feat_bodyfat_title: 'Masse grasse par caméra',
    feat_bodyfat_desc: "L'IA analyse ta silhouette et estime ton taux de masse grasse en quelques secondes. Disponible gratuitement.",
    feat_coach_title: 'Coach IA Sensei',
    feat_coach_desc: "Un mentor alimenté par l'IA, disponible 24h/24. Conseils nutrition, entraînement et motivation dans le style anime.",
    feat_nutrition_title: 'Suivi nutrition',
    feat_nutrition_desc: "Calories, macros, scan de code-barre et repas favoris. Tout pour maîtriser ton alimentation au quotidien.",
    feat_training_title: "Plans d'entraînement",
    feat_training_desc: "Des programmes générés selon ton profil, ton objectif et ton niveau. Mis à jour automatiquement chaque semaine.",
    feat_progress_title: 'Progression corporelle',
    feat_progress_desc: "Photos avant/après, mensurations, poids — tout est tracé avec des graphiques clairs semaine après semaine.",
    feat_faith_title: 'Motivation chrétienne',
    feat_faith_desc: "Un verset biblique chaque matin, des prières avant l'entraînement et des citations de figures bibliques pour tenir le cap.",
    footer_rights: '© 2025 Espritum — Tous droits réservés',
    plan_popular: 'Le plus populaire',
    plan_start: 'Commencer gratuitement →',
    // Onboarding
    onboard_homme: 'Homme',
    onboard_femme: 'Femme',
    onboard_perte: 'Perte de gras',
    onboard_masse: 'Prise de masse',
    onboard_endurance: 'Endurance',
    onboard_equilibre: 'Rééquilibrage',
    onboard_continue: 'Continuer →',
    onboard_start: 'Commencer →',
  },

  en: {
    nav_dashboard: 'Dashboard',
    nav_nutrition: 'Nutrition',
    nav_training: 'Training',
    nav_progression: 'Progress',
    nav_bodyfat: 'Estimation',
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
    dash_verse: 'Verse of the day',
    dash_calories_day: "Today's calories",
    dash_add: '+ Add',
    nutr_title: 'Nutrition',
    nutr_today: 'Today',
    nutr_breakfast: 'Breakfast',
    nutr_lunch: 'Lunch',
    nutr_snack: 'Snack',
    nutr_dinner: 'Dinner',
    nutr_calories: "Today's calories",
    nutr_macros: 'Macronutrients',
    nutr_objective: 'Goal',
    nutr_remaining: 'Remaining',
    train_title: 'Training',
    train_choose: 'Choose a session',
    train_exercises: 'Exercises',
    train_series: 'Validated sets',
    train_volume: 'Total volume',
    train_duration: 'Duration',
    train_timer: 'Stopwatch',
    train_start: '▶ Start',
    train_validate_all: '✓ Validate all sets',
    train_change: '← Change session',
    profil_title: 'Profile',
    profil_save: 'Save',
    profil_logout: 'Logout',
    plan_free: 'Free',
    plan_warrior: '⚔️ Warrior',
    plan_champion: '🛡️ Champion',
    plan_elite: '👑 Elite',
        // Tarifs complets
    free_tag: '— Always free',
    free_title: 'START WITHOUT PAYING.',
    free_desc: 'Discover Espritum for free with our flagship feature: body fat estimation by camera. No credit card required.',
    free_f1: 'Body fat estimation (camera)',
    free_f2: 'Daily Bible verse',
    free_f3: 'Basic dashboard',
    free_f4: '1 fixed training plan',
    free_f5: 'Simple weight tracking',
    plan_included: 'Included in this plan',
    price_period: 'per month',
    warrior_desc: 'For those taking their first steps into discipline. The foundations are laid.',
    warrior_cta: 'Join Warrior →',
    champion_desc: 'For the serious warrior. AI becomes your personal mentor, available 24/7.',
    champion_cta: 'Join Champion →',
    elite_desc: 'For those who refuse mediocrity. A fully tailored experience.',
    elite_cta: 'Join Elite →',
    wf1: 'Everything in the free plan',
    wf2: 'Full nutrition tracking (calories + macros)',
    wf3: '3 personalized training plans',
    wf4: '30-day history',
    wf5: 'Badges & level system',
    wf6: 'Sensei AI Coach',
    wf7: 'Meal scan (camera)',
    cf1: 'Everything in the Warrior plan',
    cf2: 'Sensei AI Coach (unlimited)',
    cf3: 'Meal scan by camera',
    cf4: 'Full body measurements tracking',
    cf5: 'Before/after progress photos',
    cf6: 'Community leaderboard',
    cf7: 'Premium prayers & Bible quotes',
    ef1: 'Everything in the Champion plan',
    ef2: '100% AI-personalized nutrition plan',
    ef3: 'Advanced morphological analysis',
    ef4: 'Priority access to new features',
    ef5: 'Exclusive Elite badge',
    ef6: 'Priority direct support',
    // FAQ complète
    faq_q1b: 'How does body fat estimation by camera work?',
    faq_a1b: 'AI analyzes your silhouette through your phone\'s camera and estimates your body fat percentage using computer vision algorithms. It\'s not a medical measurement, but a reliable estimate to track your progress over time. This feature is available for free.',
    faq_q2: 'Can I change my plan at any time?',
    faq_a2: 'Yes, you can upgrade or downgrade your plan at any time from your profile. The change takes effect immediately and billing is prorated for the current month.',
    faq_q3b: 'Is the Christian content mandatory?',
    faq_a3b: 'No. The daily verse, prayers, and Bible quotes are features you can freely enable or disable in your settings. Espritum welcomes everyone, whatever your faith.',
    faq_q4: 'How does the Sensei AI Coach work?',
    faq_a4: 'Sensei is powered by Anthropic\'s Claude AI. It analyzes your nutritional data and performance to give you personalized advice in a style inspired by the anime universe — direct, deep, and motivating. Available on Champion and Elite plans.',
    faq_q5: 'Is the app available on iPhone?',
    faq_a5: 'Espritum is a PWA (Progressive Web App), accessible via the browser on iOS and Android. On Android, you can install it from the Play Store. On iPhone, you can add it to your home screen from Safari.',
    faq_q6: 'Is my data secure?',
    faq_a6: 'Yes. All your body, nutrition, and personal data is encrypted and securely stored. We never share your information with third parties. You can request the deletion of your account at any time.',
    faq_q7: 'Is there a trial period?',
    faq_a7: 'The free plan is permanent — no time limit. For paid plans, we offer a 7-day money-back guarantee. If you\'re not satisfied, contact us and we\'ll refund you in full.',
    // Landing sections
    landing_about: 'About',
    landing_features: 'Features',
    landing_pricing: 'Pricing',
    landing_faq: 'FAQ',
    faq_title: 'Frequently asked questions',
    landing_monthly: 'Monthly',
    landing_yearly: 'Yearly',
    landing_save: '-20%',
    landing_verse_tag: '— Verse of the day',
    landing_verse: '"Do you not know? The Lord gives strength to the weary."',
    landing_verse_ref: 'Isaiah 40:28-29',
    feat_bodyfat_title: 'Body fat by camera',
    feat_bodyfat_desc: 'AI analyzes your silhouette and estimates your body fat percentage in seconds. Available for free.',
    feat_coach_title: 'Sensei AI Coach',
    feat_coach_desc: 'An AI-powered mentor, available 24/7. Nutrition advice, training tips, and motivation in anime style.',
    feat_nutrition_title: 'Nutrition tracking',
    feat_nutrition_desc: 'Calories, macros, barcode scanning, and favorite meals. Everything you need to master your daily nutrition.',
    feat_training_title: 'Training plans',
    feat_training_desc: 'Programs generated based on your profile, goal, and level. Automatically updated every week.',
    feat_progress_title: 'Body progress',
    feat_progress_desc: 'Before/after photos, measurements, weight — everything tracked with clear charts week after week.',
    feat_faith_title: 'Christian motivation',
    feat_faith_desc: 'A Bible verse every morning, pre-workout prayers, and quotes from biblical figures to stay on course.',
    // Slogan & hero
    landing_slogan: 'NOT JUST FLESH, BUT SPIRIT.',
    landing_connect: 'Log in',
    landing_signup: 'Sign up',
    landing_hero: 'CHOOSE YOUR ARMOR.',
    landing_sub: 'Every plan is a step toward a better version of yourself. Start free, level up when you\'re ready.',
    footer_rights: '© 2025 Espritum — All rights reserved',
    plan_popular: 'Most popular',
    plan_start: 'Start for free →',
    onboard_homme: 'Male',
    onboard_femme: 'Female',
    onboard_perte: 'Fat loss',
    onboard_masse: 'Muscle gain',
    onboard_endurance: 'Endurance',
    onboard_equilibre: 'Rebalancing',
    onboard_continue: 'Continue →',
    onboard_start: 'Start →',
  },

  bg: {
    nav_dashboard: 'Начало',
    nav_nutrition: 'Хранене',
    nav_training: 'Тренировка',
    nav_progression: 'Прогрес',
    nav_bodyfat: 'Оценка',
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
    dash_verse: 'Стих на деня',
    dash_calories_day: 'Калории за деня',
    dash_add: '+ Добави',
    nutr_title: 'Хранене',
    nutr_today: 'Днес',
    nutr_breakfast: 'Закуска',
    nutr_lunch: 'Обяд',
    nutr_snack: 'Закуска',
    nutr_dinner: 'Вечеря',
    nutr_calories: 'Калории за деня',
    nutr_macros: 'Макронутриенти',
    nutr_objective: 'Цел',
    nutr_remaining: 'Оставащи',
    train_title: 'Тренировка',
    train_choose: 'Избери тренировка',
    train_exercises: 'Упражнения',
    train_series: 'Завършени серии',
    train_volume: 'Общ обем',
    train_duration: 'Продължителност',
    train_timer: 'Хронометър',
    train_start: '▶ Старт',
    train_validate_all: '✓ Потвърди всички серии',
    train_change: '← Смени тренировка',
    profil_title: 'Профил',
    profil_save: 'Запази',
    profil_logout: 'Изход',
    plan_free: 'Безплатен',
    plan_warrior: '⚔️ Воин',
    plan_champion: '🛡️ Шампион',
    plan_elite: '👑 Елит',
        // Tarifs complets
    free_tag: '— Винаги безплатно',
    free_title: 'ЗАПОЧНИ БЕЗ ДА ПЛАЩАШ.',
    free_desc: 'Открий Espritum безплатно с нашата водеща функция: оценка на телесни мазнини чрез камера. Не се изисква кредитна карта.',
    free_f1: 'Оценка на телесни мазнини (камера)',
    free_f2: 'Библейски стих на деня',
    free_f3: 'Базово табло',
    free_f4: '1 фиксиран тренировъчен план',
    free_f5: 'Просто проследяване на теглото',
    plan_included: 'Включено в този план',
    price_period: 'на месец',
    warrior_desc: 'За този, който прави първите си стъпки в дисциплината. Основите са положени.',
    warrior_cta: 'Присъедини се към Воин →',
    champion_desc: 'За сериозния воин. ИИ става твой личен ментор, достъпен 24/7.',
    champion_cta: 'Присъедини се към Шампион →',
    elite_desc: 'За тези, които отказват посредствеността. Изцяло персонализирано изживяване.',
    elite_cta: 'Присъедини се към Елит →',
    wf1: 'Всичко от безплатния план',
    wf2: 'Пълно проследяване на храненето (калории + макроси)',
    wf3: '3 персонализирани тренировъчни плана',
    wf4: '30-дневна история',
    wf5: 'Значки и система от нива',
    wf6: 'ИИ Треньор Сенсей',
    wf7: 'Сканиране на ястия (камера)',
    cf1: 'Всичко от плана Воин',
    cf2: 'ИИ Треньор Сенсей (неограничено)',
    cf3: 'Сканиране на ястия чрез камера',
    cf4: 'Пълно проследяване на телесни измервания',
    cf5: 'Снимки на прогреса преди/след',
    cf6: 'Общностна класация',
    cf7: 'Премиум молитви и библейски цитати',
    ef1: 'Всичко от плана Шампион',
    ef2: '100% ИИ персонализиран хранителен план',
    ef3: 'Разширен морфологичен анализ',
    ef4: 'Приоритетен достъп до нови функции',
    ef5: 'Ексклузивна значка Елит',
    ef6: 'Приоритетна директна поддръжка',
    // FAQ
    faq_q1b: 'Как работи оценката на телесни мазнини чрез камера?',
    faq_a1b: 'ИИ анализира силуета ти чрез камерата на телефона и оценява процента телесни мазнини чрез алгоритми за компютърно зрение. Това не е медицинско измерване, а надеждна оценка за проследяване на прогреса ти. Тази функция е достъпна безплатно.',
    faq_q2: 'Мога ли да променя плана си по всяко време?',
    faq_a2: 'Да, можеш да надградиш или понижиш плана си по всяко време от профила си. Промяната влиза в сила веднага и таксуването се пресмята пропорционално за текущия месец.',
    faq_q3b: 'Задължително ли е християнското съдържание?',
    faq_a3b: 'Не. Стихът на деня, молитвите и библейските цитати са функции, които можеш свободно да активираш или деактивираш в настройките. Espritum приветства всички, независимо от вярата ти.',
    faq_q4: 'Как работи ИИ Треньорът Сенсей?',
    faq_a4: 'Сенсей е задвижван от ИИ Claude на Anthropic. Анализира хранителните ти данни и представянето ти, за да ти дава персонализирани съвети в аниме стил — директен, дълбок и мотивиращ. Достъпен в плановете Шампион и Елит.',
    faq_q5: 'Налично ли е приложението на iPhone?',
    faq_a5: 'Espritum е PWA, достъпно през браузъра на iOS и Android. На Android можеш да го инсталираш от Play Store. На iPhone можеш да го добавиш към началния екран чрез Safari.',
    faq_q6: 'Данните ми сигурни ли са?',
    faq_a6: 'Да. Всички твои телесни, хранителни и лични данни са криптирани и съхранявани сигурно. Никога не споделяме информацията ти с трети страни. Можеш да поискаш изтриване на акаунта си по всяко време.',
    faq_q7: 'Има ли пробен период?',
    faq_a7: 'Безплатният план е постоянен — без времево ограничение. За платените планове предлагаме 7-дневна гаранция за връщане на парите. Ако не си доволен, свържи се с нас и ще ти върнем парите изцяло.',
    // Landing sections
    landing_about: 'За нас',
    landing_features: 'Функции',
    landing_pricing: 'Цени',
    landing_faq: 'Въпроси',
    faq_title: 'Често задавани въпроси',
    landing_monthly: 'Месечно',
    landing_yearly: 'Годишно',
    landing_save: '-20%',
    landing_verse_tag: '— Стих на деня',
    landing_verse: '"Не знаеш ли? Господ дава сила на уморения."',
    landing_verse_ref: 'Исая 40:28-29',
    feat_bodyfat_title: 'Телесни мазнини чрез камера',
    feat_bodyfat_desc: 'ИИ анализира силуета ти и оценява процента телесни мазнини за секунди. Достъпно безплатно.',
    feat_coach_title: 'ИИ Треньор Сенсей',
    feat_coach_desc: 'Ментор, задвижван от ИИ, достъпен 24/7. Съвети за хранене, тренировки и мотивация в аниме стил.',
    feat_nutrition_title: 'Проследяване на храненето',
    feat_nutrition_desc: 'Калории, макроси, сканиране на баркод и любими ястия. Всичко, което ти трябва, за да овладееш ежедневното си хранене.',
    feat_training_title: 'Тренировъчни планове',
    feat_training_desc: 'Програми, генерирани според твоя профил, цел и ниво. Автоматично обновявани всяка седмица.',
    feat_progress_title: 'Телесен прогрес',
    feat_progress_desc: 'Снимки преди/след, измервания, тегло — всичко проследено с ясни графики седмица след седмица.',
    feat_faith_title: 'Християнска мотивация',
    feat_faith_desc: 'Библейски стих всяка сутрин, молитви преди тренировка и цитати от библейски фигури, за да останеш на верния път.',
    // Slogan & hero
    landing_slogan: 'НЕ САМО ПЛЪТ, А ДУХ.',
    landing_connect: 'Вход',
    landing_signup: 'Регистрация',
    landing_hero: 'ИЗБЕРИ СВОЯТА БРОНЯ.',
    landing_sub: 'Всеки план е стъпка към по-добрата версия на теб самия. Започни безплатно, издигни се когато си готов.',
    footer_rights: '© 2025 Espritum — Всички права запазени',
    plan_popular: 'Най-популярен',
    plan_start: 'Започни безплатно →',
    onboard_homme: 'Мъж',
    onboard_femme: 'Жена',
    onboard_perte: 'Загуба на мазнини',
    onboard_masse: 'Натрупване на мускули',
    onboard_endurance: 'Издръжливост',
    onboard_equilibre: 'Баланс',
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
      const parts = val.split(' ');
      const last = parts.pop();
      el.innerHTML = parts.join(' ') + '<br><span>' + last + '</span>';
    } else {
      el.textContent = val;
    }
  });

  // Direct class mapping
  const directMap = {
    '.free-tag': 'free_tag',
    '.free-title': 'free_title',
    '.free-desc': 'free_desc',
    '.free-cta': 'plan_start',
    '.featured-badge': 'plan_popular',
    '#lbl-monthly': 'landing_monthly',
    '#lbl-yearly': 'landing_yearly',
    '.save-badge': 'landing_save',
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

  // Free features by index
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

  // Plan descriptions
  ['warrior_desc','champion_desc','elite_desc'].forEach((key, i) => {
    const val = T[key] || TRANSLATIONS['fr'][key];
    if (val) document.querySelectorAll('.plan-desc')[i] && (document.querySelectorAll('.plan-desc')[i].textContent = val);
  });

  // Plan CTAs
  ['warrior_cta','champion_cta','elite_cta'].forEach((key, i) => {
    const val = T[key] || TRANSLATIONS['fr'][key];
    if (val && document.querySelectorAll('.plan-cta')[i]) document.querySelectorAll('.plan-cta')[i].textContent = val;
  });

  // Plan included label
  const incl = T['plan_included'] || TRANSLATIONS['fr']['plan_included'];
  if (incl) document.querySelectorAll('.features-label').forEach(el => el.textContent = incl);

  // Plan features by card
  const featureGroups = [
    ['wf1','wf2','wf3','wf4','wf5','wf6','wf7'],
    ['cf1','cf2','cf3','cf4','cf5','cf6','cf7'],
    ['ef1','ef2','ef3','ef4','ef5','ef6'],
  ];
  document.querySelectorAll('.plan-card').forEach((card, ci) => {
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

  // Feat titles & descs
  ['feat_bodyfat_title','feat_coach_title','feat_nutrition_title','feat_training_title','feat_progress_title','feat_faith_title']
    .forEach((key, i) => {
      const val = T[key] || TRANSLATIONS['fr'][key];
      if (val && document.querySelectorAll('.feat-title')[i]) document.querySelectorAll('.feat-title')[i].textContent = val;
    });

  ['feat_bodyfat_desc','feat_coach_desc','feat_nutrition_desc','feat_training_desc','feat_progress_desc','feat_faith_desc']
    .forEach((key, i) => {
      const val = T[key] || TRANSLATIONS['fr'][key];
      if (val && document.querySelectorAll('.feat-desc')[i]) document.querySelectorAll('.feat-desc')[i].textContent = val;
    });

  // FAQ
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

  // Section headings
  ['landing_about','landing_features','landing_pricing','faq_title'].forEach((key, i) => {
    const val = T[key] || TRANSLATIONS['fr'][key];
    if (val && document.querySelectorAll('.section-heading')[i]) document.querySelectorAll('.section-heading')[i].textContent = val;
  });

  // Verse
  if (T['landing_verse_tag']) document.querySelectorAll('.verse-tag').forEach(el => el.textContent = T['landing_verse_tag']);
  if (T['landing_verse']) document.querySelectorAll('.verse-text').forEach(el => el.textContent = T['landing_verse']);
  if (T['landing_verse_ref']) document.querySelectorAll('.verse-ref').forEach(el => el.textContent = T['landing_verse_ref']);

  // Hero sub + slogan
  if (T['landing_sub']) document.querySelectorAll('.hero-sub').forEach(el => el.textContent = T['landing_sub']);
  if (T['landing_slogan']) document.querySelectorAll('[data-i18n="landing_slogan"]').forEach(el => el.textContent = T['landing_slogan']);

  // Nav buttons
  if (T['landing_connect']) document.querySelectorAll('[data-i18n="landing_connect"]').forEach(el => el.textContent = T['landing_connect']);
  if (T['landing_signup']) document.querySelectorAll('[data-i18n="landing_signup"]').forEach(el => el.textContent = T['landing_signup']);

  // Nav links
  const navLinks = document.querySelectorAll('.nav-links a');
  ['landing_about','landing_features','landing_pricing','landing_faq'].forEach((key, i) => {
    const val = T[key] || TRANSLATIONS['fr'][key];
    if (val && navLinks[i]) navLinks[i].textContent = val;
  });

  // Footer
  const footer = T['footer_rights'];
  if (footer) document.querySelectorAll('[data-i18n="footer_rights"]').forEach(el => el.textContent = footer);

  document.documentElement.lang = lang;
}

function updateFlagButtons(lang) {
  const FLAGS = { fr: '🇫🇷', en: '🇬🇧', bg: '🇧🇬' };
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  const currentFlag = document.getElementById('lang-current-flag');
  if (currentFlag) currentFlag.textContent = FLAGS[lang];
  const appFlag = document.getElementById('app-lang-flag');
  if (appFlag) appFlag.textContent = FLAGS[lang];
  document.querySelectorAll('.lang-option').forEach(btn => {
    const onclick = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', onclick.includes(`'${lang}'`));
  });
}

function initI18n() {
  const lang = getLang();
  applyTranslations(lang);
  updateFlagButtons(lang);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyTranslations(lang);
      updateFlagButtons(lang);
    });
  }
}

function translateDynamic(key) {
  return t(key);
}
