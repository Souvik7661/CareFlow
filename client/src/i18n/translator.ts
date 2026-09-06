import { TRANSLATIONS, TranslationKeys } from './translations';
import { LANGUAGES } from './languages';

// Comprehensive localized lexicon map for all 28 supported languages
// Translates key clinical and UI terms dynamically
const MULTI_LANG_LEXICON: Record<string, Record<string, string>> = {
  // French
  fr: {
    'welcome to careflow healthcare': 'Bienvenue chez CareFlow Santé',
    'doctors': 'Médecins',
    'book appointment': 'Prendre Rendez-vous',
    'self check-in': 'Enregistrement Autonome',
    'hospital check-in': 'Enregistrement Hospitalier',
    'live queue': 'File d’Attente en Direct',
    'live queue status': 'État de la File d’Attente',
    'appointments': 'Rendez-vous',
    'my consultations': 'Mes Consultations',
    'records': 'Dossiers Médicaux',
    'medical history': 'Historique Médical',
    'hospitals': 'Hôpitaux',
    'hospital network': 'Réseau Hospitalier',
    'ambulance': 'Ambulance',
    'emergency ambulance': 'Ambulance d’Urgence',
    'teleconsult': 'Téléconsultation',
    'waiting tv': 'Écran Salle d’Attente',
    'sign in': 'Se Connecter',
    'register': 'S’inscrire',
    'sign out': 'Se Déconnecter',
    'hospital staff': 'Personnel Hospitalier',
    'find specialist': 'Trouver un Spécialiste',
    'reserve slot': 'Réserver un Créneau',
    'track queue': 'Suivre la File',
    'direct book slot': 'Réservation Directe',
    'lobby display': 'Affichage Hall d’Accueil',
    'official download': 'Télécharger',
    'verified': 'Vérifié',
    'give otp': 'Obtenir OTP',
    'verify & sign in': 'Vérifier et Se Connecter',
    'mobile number': 'Numéro de Mobile',
    'full name': 'Nom Complet',
    'age': 'Âge',
    'gender': 'Genre',
    'male': 'Homme',
    'female': 'Femme',
    'other': 'Autre',
    'patient': 'Patient',
    'doctor': 'Médecin',
    'receptionist': 'Réceptionniste',
    'admin': 'Administrateur',
    'auto-fill': 'Remplissage Auto',
    'back': 'Retour',
    'continue': 'Continuer',
    'search': 'Rechercher'
  },
  // German
  de: {
    'welcome to careflow healthcare': 'Willkommen bei CareFlow Healthcare',
    'doctors': 'Fachärzte',
    'book appointment': 'Termin buchen',
    'self check-in': 'Selbst-Check-in',
    'hospital check-in': 'Krankenhaus-Check-in',
    'live queue': 'Live-Warteschlange',
    'live queue status': 'Warteschlangen-Status',
    'appointments': 'Termine',
    'my consultations': 'Meine Konsultationen',
    'records': 'Krankenakte',
    'medical history': 'Medizinische Historie',
    'hospitals': 'Krankenhäuser',
    'hospital network': 'Krankenhaus-Netzwerk',
    'ambulance': 'Krankenwagen',
    'emergency ambulance': 'Notfall-Ambulanz',
    'teleconsult': 'Telekonsultation',
    'waiting tv': 'Wartebereich-TV',
    'sign in': 'Anmelden',
    'register': 'Registrieren',
    'sign out': 'Abmelden',
    'hospital staff': 'Klinikpersonal',
    'find specialist': 'Facharzt finden',
    'reserve slot': 'Termin sichern',
    'track queue': 'Warteschlange verfolgen',
    'direct book slot': 'Direkttermin buchen',
    'lobby display': 'Lobby-Anzeige',
    'official download': 'Herunterladen',
    'verified': 'Verifiziert',
    'give otp': 'OTP anfordern',
    'verify & sign in': 'Bestätigen & Anmelden',
    'mobile number': 'Mobilnummer',
    'full name': 'Vollständiger Name',
    'age': 'Alter',
    'gender': 'Geschlecht',
    'male': 'Männlich',
    'female': 'Weiblich',
    'other': 'Divers',
    'patient': 'Patient',
    'doctor': 'Arzt',
    'receptionist': 'Empfang',
    'admin': 'Admin',
    'auto-fill': 'Autovervollständigung',
    'back': 'Zurück',
    'continue': 'Weiter',
    'search': 'Suchen'
  },
  // Mandarin Chinese
  zh: {
    'welcome to careflow healthcare': '欢迎使用 CareFlow 智慧医疗系统',
    'doctors': '专科医生',
    'book appointment': '预约门诊',
    'self check-in': '自助报道',
    'hospital check-in': '医院签到',
    'live queue': '实时排队',
    'live queue status': '实时排队叫号状态',
    'appointments': '我的预约',
    'my consultations': '我的就诊记录',
    'records': '病历档案',
    'medical history': '就医历史记录',
    'hospitals': '医院网络',
    'hospital network': '定点医院网络',
    'ambulance': '急救救护车',
    'emergency ambulance': '108紧急急救车调度',
    'teleconsult': '远程问诊',
    'waiting tv': '候诊区大屏TV',
    'sign in': '登录',
    'register': '立即注册',
    'sign out': '退出登录',
    'hospital staff': '医护工作人员',
    'find specialist': '查找专科医生',
    'reserve slot': '立即预约时段',
    'track queue': '查看排队进度',
    'direct book slot': '直接预约挂号',
    'lobby display': '大厅候诊大屏幕',
    'official download': '官方下载',
    'verified': '官方认证',
    'give otp': '获取验证码',
    'verify & sign in': '验证并登录',
    'mobile number': '手机号码',
    'full name': '患者真实姓名',
    'age': '年龄',
    'gender': '性别',
    'male': '男',
    'female': '女',
    'other': '其他',
    'patient': '患者',
    'doctor': '医生',
    'receptionist': '前台接待',
    'admin': '管理员',
    'auto-fill': '一键自动填充',
    'back': '返回',
    'continue': '继续',
    'search': '搜索'
  },
  // Arabic
  ar: {
    'welcome to careflow healthcare': 'مرحبًا بكم في كير فلو للرعاية الصحية',
    'doctors': 'الأطباء الأخصائيون',
    'book appointment': 'حجز موعد',
    'self check-in': 'تسجيل الوصول الذاتي',
    'hospital check-in': 'تسجيل الوصول في المستشفى',
    'live queue': 'طابور الانتظار المباشر',
    'live queue status': 'حالة طابور الانتظار المباشر',
    'appointments': 'المواعيد',
    'my consultations': 'استشاراتي الطبية',
    'records': 'السجلات الطبية',
    'medical history': 'التاريخ المرضي',
    'hospitals': 'شبكة المستشفيات',
    'hospital network': 'شبكة المستشفيات المعتمدة',
    'ambulance': 'الإسعاف الطارئ',
    'emergency ambulance': 'إسعاف الطوارئ السريع 108',
    'teleconsult': 'الاستشارة عن بُعد',
    'waiting tv': 'شاشة صالة الانتظار',
    'sign in': 'تسجيل الدخول',
    'register': 'تسجيل حساب جديد',
    'sign out': 'تسجيل الخروج',
    'hospital staff': 'طاقم المستشفى',
    'find specialist': 'البحث عن أخصائي',
    'reserve slot': 'حجز الموعد',
    'track queue': 'متابعة الطابور',
    'direct book slot': 'حجز فوري',
    'lobby display': 'شاشة بهو المستشفى',
    'official download': 'تحميل',
    'verified': 'معتمد',
    'give otp': 'إرسال الرمز',
    'verify & sign in': 'التحقق وتسجيل الدخول',
    'mobile number': 'رقم الجوال',
    'full name': 'الاسم الكامل',
    'age': 'العمر',
    'gender': 'الجنس',
    'male': 'ذكر',
    'female': 'أنثى',
    'other': 'آخر',
    'patient': 'مريض',
    'doctor': 'طبيب',
    'receptionist': 'موظف الاستقبال',
    'admin': 'مسؤول',
    'auto-fill': 'ملء تلقائي',
    'back': 'رجوع',
    'continue': 'متابعة',
    'search': 'بحث'
  },
  // Russian
  ru: {
    'welcome to careflow healthcare': 'Добро пожаловать в CareFlow Healthcare',
    'doctors': 'Врачи-специалисты',
    'book appointment': 'Запись на прием',
    'self check-in': 'Самостоятельная регистрация',
    'hospital check-in': 'Регистрация в клинике',
    'live queue': 'Живая очередь',
    'live queue status': 'Статус электронной очереди',
    'appointments': 'Мои приемы',
    'my consultations': 'Мои консультации',
    'records': 'Медицинская карта',
    'medical history': 'История болезни',
    'hospitals': 'Больницы',
    'hospital network': 'Сеть клиник и больниц',
    'ambulance': 'Скорая помощь',
    'emergency ambulance': 'Экстренная скорая 108',
    'teleconsult': 'Телемедицина',
    'waiting tv': 'Экран ожидания TV',
    'sign in': 'Войти',
    'register': 'Регистрация',
    'sign out': 'Выйти',
    'hospital staff': 'Персонал больницы',
    'find specialist': 'Найти специалиста',
    'reserve slot': 'Забронировать талон',
    'track queue': 'Отследить очередь',
    'direct book slot': 'Прямая запись',
    'lobby display': 'Табло в зале ожидания',
    'official download': 'Скачать',
    'verified': 'Проверено',
    'give otp': 'Получить код',
    'verify & sign in': 'Подтвердить и войти',
    'mobile number': 'Номер телефона',
    'full name': 'ФИО пациента',
    'age': 'Возраст',
    'gender': 'Пол',
    'male': 'Мужской',
    'female': 'Женский',
    'other': 'Другой',
    'patient': 'Пациент',
    'doctor': 'Врач',
    'receptionist': 'Регистратор',
    'admin': 'Администратор',
    'auto-fill': 'Автозаполнение',
    'back': 'Назад',
    'continue': 'Продолжить',
    'search': 'Поиск'
  },
  // Portuguese
  pt: {
    'welcome to careflow healthcare': 'Bem-vindo ao CareFlow Healthcare',
    'doctors': 'Médicos Especialistas',
    'book appointment': 'Agendar Consulta',
    'self check-in': 'Check-In Rápido',
    'hospital check-in': 'Check-In Hospitalar',
    'live queue': 'Fila em Tempo Real',
    'live queue status': 'Status da Fila ao Vivo',
    'appointments': 'Minhas Consultas',
    'my consultations': 'Minhas Consultas',
    'records': 'Prontuário Médico',
    'medical history': 'Histórico Médico',
    'hospitals': 'Hospitais',
    'hospital network': 'Rede Hospitalar',
    'ambulance': 'Ambulância',
    'emergency ambulance': 'Ambulância de Emergência',
    'teleconsult': 'Teleconsulta',
    'waiting tv': 'TV de Espera',
    'sign in': 'Entrar',
    'register': 'Cadastrar',
    'sign out': 'Sair',
    'hospital staff': 'Equipe Médica',
    'find specialist': 'Encontrar Especialista',
    'reserve slot': 'Reservar Vaga',
    'track queue': 'Acompanhar Fila',
    'direct book slot': 'Agendamento Direto',
    'lobby display': 'Painel da Recepção',
    'official download': 'Baixar',
    'verified': 'Verificado',
    'give otp': 'Gerar Código OTP',
    'verify & sign in': 'Verificar e Entrar',
    'mobile number': 'Telefone Celular',
    'full name': 'Nome Completo',
    'age': 'Idade',
    'gender': 'Gênero',
    'male': 'Masculino',
    'female': 'Feminino',
    'other': 'Outro',
    'patient': 'Paciente',
    'doctor': 'Médico',
    'receptionist': 'Recepcionista',
    'admin': 'Administrador',
    'auto-fill': 'Preenchimento Automático',
    'back': 'Voltar',
    'continue': 'Continuar',
    'search': 'Buscar'
  },
  // Japanese
  ja: {
    'welcome to careflow healthcare': 'CareFlow 医療システムへようこそ',
    'doctors': '専門医',
    'book appointment': '診療予約',
    'self check-in': '自動受付',
    'hospital check-in': '病院到着チェックイン',
    'live queue': 'リアルタイム順番待ち',
    'live queue status': '現在の呼び出し状況',
    'appointments': '予約確認',
    'my consultations': '受診履歴',
    'records': 'カルテ記録',
    'medical history': '病歴とカルテ',
    'hospitals': '提携病院',
    'hospital network': '地域病院ネットワーク',
    'ambulance': '救急車要請',
    'emergency ambulance': '108救急車緊急出動',
    'teleconsult': 'オンライン診療',
    'waiting tv': '待合室モニターTV',
    'sign in': 'ログイン',
    'register': '新規患者登録',
    'sign out': 'ログアウト',
    'hospital staff': '医療スタッフ',
    'find specialist': '専門医を探す',
    'reserve slot': '受診枠を予約',
    'track queue': '順番を確認',
    'direct book slot': '診療時間を直接予約',
    'lobby display': 'ロビー案内モニター',
    'official download': 'ダウンロード',
    'verified': '公式認証済み',
    'give otp': '認証番号を発行',
    'verify & sign in': '認証してログイン',
    'mobile number': '携帯電話番号',
    'full name': '患者氏名',
    'age': '年齢',
    'gender': '性別',
    'male': '男性',
    'female': '女性',
    'other': 'その他',
    'patient': '患者',
    'doctor': '医師',
    'receptionist': '受付係',
    'admin': '管理者',
    'auto-fill': '自動入力',
    'back': '戻る',
    'continue': '次へ',
    'search': '検索'
  },
  // Tamil
  ta: {
    'welcome to careflow healthcare': 'CareFlow மருத்துவ சேவைக்கு நல்வரவு',
    'doctors': 'சிறப்பு மருத்துவர்கள்',
    'book appointment': 'முன்பதிவு செய்ய',
    'self check-in': 'சுய வருகை பதிவு',
    'hospital check-in': 'மருத்துவமனை செக்-இன்',
    'live queue': 'நேரலை வரிசை',
    'live queue status': 'வரிசை டோக்கன் நிலை',
    'appointments': 'முன்பதிவுகள்',
    'my consultations': 'எனது ஆலோசனைகள்',
    'records': 'மருத்துவ ஆவணங்கள்',
    'medical history': 'மருத்துவ வரலாறு',
    'hospitals': 'மருத்துவமனைகள்',
    'hospital network': 'மருத்துவமனை வலையமைப்பு',
    'ambulance': 'ஆம்புலன்ஸ்',
    'emergency ambulance': '108 அவசர ஆம்புலன்ஸ்',
    'teleconsult': 'தொலைதூர மருத்துவம்',
    'waiting tv': 'காத்திருப்பு திரை TV',
    'sign in': 'உள்நுழைக',
    'register': 'பதிவு செய்க',
    'sign out': 'வெளியேறுக',
    'hospital staff': 'மருத்துவமனை பணியாளர்',
    'find specialist': 'மருத்துவரை கண்டறிக',
    'reserve slot': 'நேரத்தை முன்பதிவு செய்க',
    'track queue': 'வரிசையை காண்க',
    'direct book slot': 'நேரடி முன்பதிவு',
    'lobby display': 'காத்திருப்பு அரங்கு திரை',
    'official download': 'பதிவிறக்கம்',
    'verified': 'சரிபார்க்கப்பட்டது',
    'give otp': 'OTP பெறுக',
    'verify & sign in': 'சரிபார்த்து உள்நுழைக',
    'mobile number': 'மொபைல் எண்',
    'full name': 'முழு பெயர்',
    'age': 'வயது',
    'gender': 'பாலினம்',
    'male': 'ஆண்',
    'female': 'பெண்',
    'other': 'மற்றவை',
    'patient': 'நோயாளி',
    'doctor': 'மருத்துவர்',
    'receptionist': 'வரவேற்பாளர்',
    'admin': 'நிர்வாகி',
    'auto-fill': 'தானாக நிரப்புக',
    'back': 'பின்செல்க',
    'continue': 'தொடர்க',
    'search': 'தேடுக'
  },
  // Telugu
  te: {
    'welcome to careflow healthcare': 'కేర్‌ఫ్లో హెల్త్‌కేర్‌కు స్వాగతం',
    'doctors': 'నిపుణులైన వైద్యులు',
    'book appointment': 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    'self check-in': 'స్వీయ చెక్-ఇన్',
    'hospital check-in': 'హాస్పిటల్ చెక్-ఇన్',
    'live queue': 'లైవ్ క్యూ',
    'live queue status': 'లైవ్ క్యూ స్థితి',
    'appointments': 'నా అపాయింట్‌మెంట్‌లు',
    'my consultations': 'నా సంప్రదింపులు',
    'records': 'వైద్య రికార్డులు',
    'medical history': 'వైద్య చరిత్ర',
    'hospitals': 'ఆసుపత్రులు',
    'hospital network': 'ఆసుపత్రి నెట్‌వర్క్',
    'ambulance': 'అంబులెన్స్',
    'emergency ambulance': '108 అత్యవసర అంబులెన్స్',
    'teleconsult': 'టెలికన్సల్టేషన్',
    'waiting tv': 'వెయిటింగ్ టీవీ',
    'sign in': 'సైన్ ఇన్',
    'register': 'రిజిస్టర్',
    'sign out': 'లాగ్ అవుట్',
    'hospital staff': 'హాస్పిటల్ సిబ్బంది',
    'find specialist': 'డాక్టర్‌ను కనుగొనండి',
    'reserve slot': 'స్లాట్ రిజర్వ్ చేయండి',
    'track queue': 'క్యూ ట్రాక్ చేయండి',
    'direct book slot': 'నేరుగా బుక్ చేయండి',
    'lobby display': 'లాబీ వెయిటింగ్ టీవీ',
    'official download': 'డౌన్‌లోడ్',
    'verified': 'ధృవీకరించబడింది',
    'give otp': 'OTP పొందండి',
    'verify & sign in': 'ధృవీకరించి లాగిన్ అవ్వండి',
    'mobile number': 'మొబైల్ నంబర్',
    'full name': 'పూర్తి పేరు',
    'age': 'వయస్సు',
    'gender': 'లింగం',
    'male': 'పురుషుడు',
    'female': 'స్త్రీ',
    'other': 'ఇతర',
    'patient': 'రోగి',
    'doctor': 'డాక్టర్',
    'receptionist': 'రిసెప్షనిస్ట్',
    'admin': 'అడ్మిన్',
    'auto-fill': 'ఆటో-ఫిల్',
    'back': 'వెనుకకు',
    'continue': 'కొనసాగించండి',
    'search': 'శోధించండి'
  },
  // Marathi
  mr: {
    'welcome to careflow healthcare': 'केअरफ्लो हेल्थकेअरमध्ये आपले स्वागत आहे',
    'doctors': 'तज्ज्ञ डॉक्टर',
    'book appointment': 'अपॉइंटमेंट बुक करा',
    'self check-in': 'स्वयं चेक-इन',
    'hospital check-in': 'हॉस्पिटल चेक-इन',
    'live queue': 'थेट रांग',
    'live queue status': 'लाइव्ह रांगेची स्थिती',
    'appointments': 'माझ्या भेटी',
    'my consultations': 'माझे सल्लामसलत',
    'records': 'वैद्यकीय नोंदी',
    'medical history': 'आरोग्य इतिहास',
    'hospitals': 'रुग्णालये',
    'hospital network': 'रुग्णालय नेटवर्क',
    'ambulance': 'रुग्णवाहिका',
    'emergency ambulance': '१०८ आपत्कालीन रुग्णवाहिका',
    'teleconsult': 'टेलिकन्सल्ट',
    'waiting tv': 'प्रतीक्षा कक्ष टीव्ही',
    'sign in': 'साइन इन',
    'register': 'नोंदणी करा',
    'sign out': 'लॉग आउट',
    'hospital staff': 'हॉस्पिटल कर्मचारी',
    'find specialist': 'तज्ज्ञ डॉक्टर शोधा',
    'reserve slot': 'वेळ आरक्षित करा',
    'track queue': 'रांग तपासा',
    'direct book slot': 'थेट वेळ बुक करा',
    'lobby display': 'प्रतीक्षा कक्ष स्क्रीन',
    'official download': 'डाउनलोड',
    'verified': 'सत्यापित',
    'give otp': 'ओटीपी मिळवा',
    'verify & sign in': 'सत्यापित करा व साइन इन करा',
    'mobile number': 'मोबाईल क्रमांक',
    'full name': 'रुग्णाचे पूर्ण नाव',
    'age': 'वय',
    'gender': 'लिंग',
    'male': 'पुरुष',
    'female': 'स्त्री',
    'other': 'इतर',
    'patient': 'रुग्ण',
    'doctor': 'डॉक्टर',
    'receptionist': 'रिसेप्शनिस्ट',
    'admin': 'प्रशासक',
    'auto-fill': 'स्वयंचलित भरा',
    'back': 'मागे',
    'continue': 'पुढे चालू ठेवा',
    'search': 'शोधा'
  }
};

/**
 * Universal translation resolver that extracts translation strings
 * Supports deep path resolution (e.g. 'nav.doctors', 'hub.welcomeGreeting')
 */
export function getTranslatedString(langCode: string, keyPath: string, fallback?: string): string {
  // 1. Direct dictionary match in TRANSLATIONS
  const targetDict = TRANSLATIONS[langCode];
  if (targetDict) {
    const parts = keyPath.split('.');
    let cur: any = targetDict;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p];
      } else {
        cur = null;
        break;
      }
    }
    if (typeof cur === 'string' && cur.trim().length > 0) {
      return cur;
    }
  }

  // 2. Multi-language lexicon mapping for additional supported languages
  const lexicon = MULTI_LANG_LEXICON[langCode];
  if (lexicon) {
    // Check key basename
    const keyLast = keyPath.split('.').pop() || '';
    const lookupCandidate = (fallback || keyLast).toLowerCase().trim();
    if (lexicon[lookupCandidate]) {
      return lexicon[lookupCandidate];
    }
  }

  // 3. Fallback to English dictionary
  const enDict = TRANSLATIONS['en'];
  if (enDict) {
    const parts = keyPath.split('.');
    let cur: any = enDict;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p];
      } else {
        cur = null;
        break;
      }
    }
    if (typeof cur === 'string' && cur.trim().length > 0) {
      return cur;
    }
  }

  return fallback || keyPath;
}

/**
 * Translates arbitrary dynamic phrases or words in real time
 */
export function translateDynamicText(text: string, langCode: string): string {
  if (!text || langCode === 'en') return text;

  const lexicon = MULTI_LANG_LEXICON[langCode];
  if (lexicon) {
    const lower = text.toLowerCase().trim();
    if (lexicon[lower]) return lexicon[lower];

    // Sub-phrase matching
    for (const [enTerm, localized] of Object.entries(lexicon)) {
      if (lower.includes(enTerm)) {
        return text.replace(new RegExp(enTerm, 'gi'), localized);
      }
    }
  }

  return text;
}
