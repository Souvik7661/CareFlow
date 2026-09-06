import { INDIC_TRANSLATIONS } from './locales/indic';
import { EUROPEAN_TRANSLATIONS } from './locales/european';
import { ASIAN_TRANSLATIONS } from './locales/asian';

export interface TranslationKeys {
  common: {
    back: string;
    continue: string;
    cancel: string;
    confirm: string;
    search: string;
    loading: string;
    default: string;
    language: string;
    selectLanguage: string;
    selectLanguageSubtitle: string;
    applyLanguage: string;
    searchLanguagePlaceholder: string;
    englishDefault: string;
    noLanguagesFound: string;
  };
  nav: {
    services: string;
    doctors: string;
    bookAppointment: string;
    checkIn: string;
    liveQueue: string;
    myAppointments: string;
    medicalHistory: string;
    nearestHospitals: string;
    emergencyAmbulance: string;
    teleconsultation: string;
    waitingTv: string;
    signIn: string;
    register: string;
    logout: string;
    hospitalStaff: string;
  };
  hub: {
    welcomeGreeting: string;
    subGreeting: string;
    specialistCardTitle: string;
    specialistCardDesc: string;
    findSpecialistAction: string;
    bookCardTitle: string;
    bookCardDesc: string;
    bookSlotAction: string;
    supportCardTitle: string;
    supportCardDesc: string;
    supportAction: string;
    activeTokenBanner: string;
    clickToViewToken: string;
    viewTokenBadge: string;
    quickHospitalActions: string;
    instantSelfService: string;
    hospitalCheckIn: string;
    arrivalVerification: string;
    liveQueueStatus: string;
    waitTimesAndTurns: string;
    hospitalNetwork: string;
    nearbyIcuOpd: string;
    myConsultations: string;
    bookedPasses: string;
    directBookSlot: string;
    chooseDoctorDate: string;
    emergencyAmbulance: string;
    gpsDispatch: string;
    lobbyDisplay: string;
    publicWaitingTv: string;
    nativeInstallersTitle: string;
    nativeInstallersSubtitle: string;
    androidApk: string;
    iosConfig: string;
    windowsApp: string;
    macOsApp: string;
    officialDownload: string;
    verifiedPackage: string;
    emergencyBanner: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    loginSubtitle: string;
    registerSubtitle: string;
    mobileNumber: string;
    enterMobilePlaceholder: string;
    giveOtp: string;
    requestOtp: string;
    carrierGatewayTitle: string;
    deliveredTo: string;
    careFlowSecurityMsg: string;
    validFor5Mins: string;
    autoFill: string;
    verifyAndLogin: string;
    completeRegistration: string;
    fullName: string;
    fullNamePlaceholder: string;
    age: string;
    gender: string;
    selectGender: string;
    male: string;
    female: string;
    other: string;
    selectRole: string;
    patient: string;
    doctor: string;
    receptionist: string;
    admin: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    loginNow: string;
    registerNow: string;
    patientLogin?: string;
    staffLogin?: string;
    password?: string;
    bloodGroup?: string;
    allergies?: string;
    medicalHistory?: string;
    medications?: string;
    keepSignedIn?: string;
    role?: string;
    enterOtp?: string;
  };
  mascot: {
    defaultSpeech: string;
    defaultSpeechName: string;
    companionName: string;
    statusActive: string;
    statusSleeping: string;
    wakeUpTooltip: string;
    clickToAsk: string;
    greeting?: string;
    helpPrompt?: string;
    howCanIHelp?: string;
    suggestedTitle?: string;
    optionExplain?: string;
    quickTip?: string;
    knowledgeBase?: Record<string, { title: string; category: string; description: string }>;
    options: Record<string, { title: string; category: string; description: string }>;
  };
  triage: {
    title: string;
    subtitle: string;
    describeSymptoms: string;
    symptomPlaceholder: string;
    severityLabel: string;
    mild: string;
    moderate: string;
    severe: string;
    commonSymptoms: string;
    analyzeButton: string;
    analyzingText: string;
    confidenceScore: string;
    recommendedSpecialist: string;
    bookConsultation: string;
  };
  queue: {
    title: string;
    subtitle: string;
    yourToken: string;
    currentServing: string;
    estimatedWait: string;
    departmentWing: string;
    roomNo: string;
    doctorOnDuty: string;
    statusWaiting: string;
    statusInProgress: string;
  };
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const BASE_TRANSLATIONS: Record<string, TranslationKeys> = {
  en: {
    common: {
      back: 'Back',
      continue: 'Continue',
      cancel: 'Cancel',
      confirm: 'Confirm',
      search: 'Search',
      loading: 'Loading...',
      default: 'Default',
      language: 'Language',
      selectLanguage: 'Select Your Preferred Language',
      selectLanguageSubtitle: 'Choose your language for clinical consultations, triage & Dr. AI guidance',
      applyLanguage: 'Apply & Continue',
      searchLanguagePlaceholder: 'Search language (e.g. Hindi, English, Español, বাংলা)...',
      englishDefault: 'English (Default)',
      noLanguagesFound: 'No matching languages found'
    },
    nav: {
      services: 'Services Hub',
      doctors: 'Specialists',
      bookAppointment: 'Book Slot',
      checkIn: 'Self Check-In',
      liveQueue: 'Live Queue',
      myAppointments: 'Appointments',
      medicalHistory: 'Records',
      nearestHospitals: 'Hospitals',
      emergencyAmbulance: 'Ambulance',
      teleconsultation: 'Teleconsult',
      waitingTv: 'Waiting TV',
      signIn: 'Sign In',
      register: 'Register',
      logout: 'Sign Out',
      hospitalStaff: 'Hospital Staff'
    },
    hub: {
      welcomeGreeting: 'Welcome to CareFlow Healthcare',
      subGreeting: 'Intelligent Clinical Triage, Seamless Queueing & Specialist Care',
      specialistCardTitle: 'Doctors',
      specialistCardDesc: 'AI Clinical Diagnosis & Specialist Recommendation',
      findSpecialistAction: 'Find Specialist',
      bookCardTitle: 'Book Appointment',
      bookCardDesc: 'Direct OPD Specialist Consultation & Time Slots',
      bookSlotAction: 'Reserve Slot',
      supportCardTitle: 'Live Queue & Token',
      supportCardDesc: 'Real-Time OPD Token Tracking & Wait Times',
      supportAction: 'Track Queue',
      activeTokenBanner: 'Active Verified Token Session',
      clickToViewToken: 'Click here or tap the CareFlow logo anytime to view your live token',
      viewTokenBadge: 'View Token →',
      quickHospitalActions: 'Quick Hospital Actions',
      instantSelfService: 'Instant self-service tools',
      hospitalCheckIn: 'Hospital Check-In',
      arrivalVerification: 'Arrival verification',
      liveQueueStatus: 'Live Queue Status',
      waitTimesAndTurns: 'Wait times & turns',
      hospitalNetwork: 'Hospital Network',
      nearbyIcuOpd: 'Nearby ICU & OPD',
      myConsultations: 'My Consultations',
      bookedPasses: 'Booked passes & history',
      directBookSlot: 'Direct Book Slot',
      chooseDoctorDate: 'Choose doctor & date',
      emergencyAmbulance: 'Emergency Ambulance',
      gpsDispatch: 'GPS dispatch & 108',
      lobbyDisplay: 'Lobby Display',
      publicWaitingTv: 'Public waiting TV',
      nativeInstallersTitle: 'Official Native Installers & Packages',
      nativeInstallersSubtitle: 'Direct device packages (.apk • .mobileconfig • .dmg • .exe)',
      androidApk: 'Android APK',
      iosConfig: 'iOS WebClip',
      windowsApp: 'Windows App',
      macOsApp: 'macOS Bundle',
      officialDownload: 'Download',
      verifiedPackage: 'Verified',
      emergencyBanner: 'Medical Emergency? Instant 108 Ambulance Hotline'
    },
    auth: {
      loginTitle: 'Welcome Back to CareFlow',
      registerTitle: 'Create Digital Patient Profile',
      loginSubtitle: 'Enter mobile number for secure OTP verification',
      registerSubtitle: 'Fast digital health onboarding & consultation passes',
      mobileNumber: 'Mobile Number',
      enterMobilePlaceholder: 'Enter 10-digit mobile number',
      giveOtp: 'Give OTP',
      requestOtp: 'Request OTP',
      carrierGatewayTitle: 'SMS CARRIER GATEWAY (REAL-TIME)',
      deliveredTo: 'Delivered to',
      careFlowSecurityMsg: 'CareFlow Security: Your login OTP is',
      validFor5Mins: 'Valid for 5 mins.',
      autoFill: 'Auto-Fill',
      verifyAndLogin: 'Verify & Sign In',
      completeRegistration: 'Register Patient Profile',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter patient full name',
      age: 'Age',
      gender: 'Gender',
      selectGender: 'Select Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      selectRole: 'Account Type',
      patient: 'Patient',
      doctor: 'Doctor',
      receptionist: 'Receptionist',
      admin: 'Admin',
      alreadyHaveAccount: 'Already have a profile?',
      dontHaveAccount: 'New patient to hospital?',
      loginNow: 'Sign In',
      registerNow: 'Register Profile'
    },
    mascot: {
      defaultSpeech: "Hello there! 👋 I am Dr. AI, your clinical companion. Select any service below and I'll guide your hospital care visit!",
      defaultSpeechName: "Hello {name}! 👋 I am Dr. AI, your clinical companion. Select any service below and I'll guide your hospital care visit!",
      companionName: 'Dr. AI',
      statusActive: 'Active Clinical Guide',
      statusSleeping: 'Resting (Click to wake)',
      wakeUpTooltip: 'Wake up Dr. AI',
      clickToAsk: 'Ask Dr. AI a question',
      options: {
        'services': {
          title: 'Hospital Services Hub',
          category: 'Care Directory',
          description: 'Explore all clinical care services, emergency facilities, OPD clinics, and diagnostic labs across the hospital.'
        },
        'doctors': {
          title: 'Specialist Physician Directory',
          category: 'Medical Staff',
          description: 'Browse verified hospital specialist physicians, view qualifications, ratings, OPD consultation timings, and real-time availability.'
        },
        'book appointment': {
          title: 'OPD Appointment Scheduling',
          category: 'Direct Booking',
          description: 'Select your preferred doctor, date, and morning/evening consultation time slot with instant digital confirmation.'
        },
        'hospital check-in': {
          title: 'Hospital Self Check-In',
          category: 'Arrival Verification',
          description: 'Verify physical arrival using Patient ID or QR pass to immediately notify the OPD doctor and secure queue turn.'
        },
        'live queue status': {
          title: 'Live Queue & Token Status',
          category: 'Real-Time Monitor',
          description: 'Check real-time estimated wait times, queue token counts, and current doctor consultation progress before entering.'
        },
        'emergency ambulance': {
          title: '108 Emergency Ambulance Dispatch',
          category: 'Critical Dispatch',
          description: 'Rapid 1-tap emergency dispatch with GPS tracking, direct 108 hotline linking, and priority hospital trauma triage.'
        },
        'sign in': {
          title: 'Patient Portal Sign In',
          category: 'Account Access',
          description: 'Log in with your verified mobile number to access digital passes, prescriptions, and synchronized medical history.'
        }
      }
    },
    triage: {
      title: 'AI Clinical Triage & Specialist Match',
      subtitle: 'Describe your symptoms in natural words for real-time doctor recommendation',
      describeSymptoms: 'Report Your Symptoms',
      symptomPlaceholder: 'e.g., severe headache, chest tightness, fever for 2 days...',
      severityLabel: 'Symptom Severity',
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
      commonSymptoms: 'Common Symptoms',
      analyzeButton: 'Analyze Clinical Symptoms',
      analyzingText: 'AI Analyzing Clinical Data...',
      confidenceScore: 'AI Match Confidence',
      recommendedSpecialist: 'Recommended Specialist',
      bookConsultation: 'Book Specialist Consultation'
    },
    queue: {
      title: 'Real-Time Hospital OPD Queue',
      subtitle: 'Synchronized live token calls and estimated waiting time',
      yourToken: 'Your Token',
      currentServing: 'Now Serving in OPD',
      estimatedWait: 'Estimated Wait Time',
      departmentWing: 'Department & Wing',
      roomNo: 'Consultation Room',
      doctorOnDuty: 'Attending Doctor',
      statusWaiting: 'Waiting for Call',
      statusInProgress: 'Currently with Doctor'
    }
  },

  hi: {
    common: {
      back: 'वापस जाएं',
      continue: 'जारी रखें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      search: 'खोजें',
      loading: 'लोड हो रहा है...',
      default: 'डिफ़ॉल्ट',
      language: 'भाषा',
      selectLanguage: 'अपनी पसंदीदा भाषा चुनें',
      selectLanguageSubtitle: 'चिकित्सा परामर्श, ट्राइएज और डॉ. एआई मार्गदर्शन के लिए अपनी भाषा चुनें',
      applyLanguage: 'लागू करें और आगे बढ़ें',
      searchLanguagePlaceholder: 'भाषा खोजें (उदा. हिन्दी, English, বাংলা, Español)...',
      englishDefault: 'English (Default)',
      noLanguagesFound: 'कोई भाषा नहीं मिली'
    },
    nav: {
      services: 'सेवा केंद्र',
      doctors: 'विशेषज्ञ डॉक्टर',
      bookAppointment: 'अपॉइंटमेंट लें',
      checkIn: 'स्वयं चेक-इन',
      liveQueue: 'लाइव कतार',
      myAppointments: 'मेरी नियुक्तियां',
      medicalHistory: 'चिकित्सा रिकॉर्ड',
      nearestHospitals: 'निकटतम अस्पताल',
      emergencyAmbulance: 'एम्बुलेंस',
      teleconsultation: 'टेली-परामर्श',
      waitingTv: 'वेटिंग टीवी',
      signIn: 'साइन इन',
      register: 'पंजीकरण करें',
      logout: 'लॉग आउट',
      hospitalStaff: 'अस्पताल स्टाफ'
    },
    hub: {
      welcomeGreeting: 'केयरफ्लो हेल्थकेयर में आपका स्वागत है',
      subGreeting: 'इंटेलिजेंट क्लिनिकल ट्राइएज, सहज कतार और विशेषज्ञ स्वास्थ्य सेवा',
      specialistCardTitle: 'विशेषज्ञ डॉक्टर',
      specialistCardDesc: 'एआई क्लिनिकल निदान और विशेषज्ञ डॉक्टर की सिफारिश',
      findSpecialistAction: 'डॉक्टर खोजें',
      bookCardTitle: 'अपॉइंटमेंट बुक करें',
      bookCardDesc: 'सीधा ओपीडी विशेषज्ञ परामर्श और समय स्लॉट चुनें',
      bookSlotAction: 'स्लॉट बुक करें',
      supportCardTitle: 'लाइव कतार और टोकन',
      supportCardDesc: 'रीयल-टाइम ओपीडी टोकन ट्रैकिंग और प्रतीक्षा समय',
      supportAction: 'कतार ट्रैक करें',
      activeTokenBanner: 'सक्रिय सत्यापित टोकन सत्र',
      clickToViewToken: 'अपना लाइव टोकन देखने के लिए यहां क्लिक करें या केयरफ्लो लोगो दबाएं',
      viewTokenBadge: 'टोकन देखें →',
      quickHospitalActions: 'त्वरित अस्पताल कार्य',
      instantSelfService: 'त्वरित स्व-सेवा उपकरण',
      hospitalCheckIn: 'अस्पताल चेक-इन',
      arrivalVerification: 'आगमन सत्यापन',
      liveQueueStatus: 'लाइव कतार स्थिति',
      waitTimesAndTurns: 'प्रतीक्षा समय और बारी',
      hospitalNetwork: 'अस्पताल नेटवर्क',
      nearbyIcuOpd: 'नजदीकी आईसीयू और ओपीडी',
      myConsultations: 'मेरे परामर्श',
      bookedPasses: 'बुक किए गए पास और इतिहास',
      directBookSlot: 'सीधा स्लॉट बुक करें',
      chooseDoctorDate: 'डॉक्टर और तारीख चुनें',
      emergencyAmbulance: 'आपातकालीन एम्बुलेंस',
      gpsDispatch: 'जीपीएस प्रेषण और 108 सेवा',
      lobbyDisplay: 'लॉबी डिस्प्ले टीवी',
      publicWaitingTv: 'सार्वजनिक वेटिंग टीवी',
      nativeInstallersTitle: 'आधिकारिक ऐप पैकेज',
      nativeInstallersSubtitle: 'सीधे डिवाइस पैकेज (.apk • .mobileconfig • .dmg • .exe)',
      androidApk: 'एंड्रॉइड एपीके',
      iosConfig: 'आईओएस ऐप',
      windowsApp: 'विंडोज ऐप',
      macOsApp: 'मैक ऐप',
      officialDownload: 'डाउनलोड करें',
      verifiedPackage: 'सत्यापित',
      emergencyBanner: 'चिकित्सा आपातकाल? तत्काल 108 एम्बुलेंस हेल्पलाइन'
    },
    auth: {
      loginTitle: 'केयरफ्लो में पुनः स्वागत है',
      registerTitle: 'डिजिटल मरीज प्रोफाइल बनाएं',
      loginSubtitle: 'सुरक्षित ओटीपी सत्यापन के लिए मोबाइल नंबर दर्ज करें',
      registerSubtitle: 'त्वरित डिजिटल स्वास्थ्य ऑनबोर्डिंग और परामर्श पास',
      mobileNumber: 'मोबाइल नंबर',
      enterMobilePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें',
      giveOtp: 'ओटीपी प्राप्त करें',
      requestOtp: 'ओटीपी का अनुरोध करें',
      carrierGatewayTitle: 'एसएमएस गेटवे (रीयल-टाइम)',
      deliveredTo: 'भेजा गया',
      careFlowSecurityMsg: 'केयरफ्लो सुरक्षा: आपका लॉगिन ओटीपी है',
      validFor5Mins: '5 मिनट के लिए वैध।',
      autoFill: 'स्वतः भरें',
      verifyAndLogin: 'सत्यापित करें और साइन इन करें',
      completeRegistration: 'मरीज प्रोफाइल पंजीकृत करें',
      fullName: 'पूरा नाम',
      fullNamePlaceholder: 'मरीज का पूरा नाम दर्ज करें',
      age: 'उम्र',
      gender: 'लिंग',
      selectGender: 'लिंग चुनें',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      selectRole: 'खाता प्रकार',
      patient: 'मरीज',
      doctor: 'डॉक्टर',
      receptionist: 'रिसेप्शनिस्ट',
      admin: 'एडमिन',
      alreadyHaveAccount: 'क्या पहले से प्रोफाइल है?',
      dontHaveAccount: 'अस्पताल में नए मरीज हैं?',
      loginNow: 'साइन इन करें',
      registerNow: 'प्रोफाइल बनाएं'
    },
    mascot: {
      defaultSpeech: 'नमस्ते! 👋 मैं डॉ. एआई हूं, आपका क्लिनिकल साथी। नीचे दी गई किसी भी सेवा को चुनें और मैं आपके अस्पताल दौरे में मार्गदर्शन करूंगा!',
      defaultSpeechName: 'नमस्ते {name}! 👋 मैं डॉ. एआई हूं, आपका क्लिनिकल साथी। नीचे दी गई सेवा चुनें और मैं मार्गदर्शन करूंगा!',
      companionName: 'डॉ. एआई',
      statusActive: 'सक्रिय क्लिनिकल गाइड',
      statusSleeping: 'विश्राम में (जगाने के लिए क्लिक करें)',
      wakeUpTooltip: 'डॉ. एआई को जगाएं',
      clickToAsk: 'डॉ. एआई से सवाल पूछें',
      options: {
        'services': {
          title: 'अस्पताल सेवा केंद्र',
          category: 'देखभाल निर्देशिका',
          description: 'अस्पताल भर में सभी क्लिनिकल सेवाएं, आपातकालीन सुविधाएं, ओपीडी क्लीनिक और प्रयोगशालाएं देखें।'
        },
        'doctors': {
          title: 'विशेषज्ञ डॉक्टर निर्देशिका',
          category: 'चिकित्सा स्टाफ',
          description: 'सत्यापित विशेषज्ञ डॉक्टरों को खोजें, उनकी योग्यता, रेटिंग, ओपीडी समय और लाइव उपलब्धता देखें।'
        },
        'book appointment': {
          title: 'ओपीडी अपॉइंटमेंट शेड्यूलिंग',
          category: 'सीधी बुकिंग',
          description: 'तत्काल डिजिटल पुष्टि के साथ अपने पसंदीदा डॉक्टर, तिथि और सुबह/शाम का परामर्श स्लॉट चुनें।'
        },
        'hospital check-in': {
          title: 'अस्पताल स्वयं चेक-इन',
          category: 'आगमन सत्यापन',
          description: 'ओपीडी डॉक्टर को तुरंत सूचित करने और कतार में बारी सुरक्षित करने के लिए मरीज आईडी से चेक-इन करें।'
        },
        'live queue status': {
          title: 'लाइव कतार स्थिति',
          category: 'रीयल-टाइम मॉनिटर',
          description: 'अंदर जाने से पहले रीयल-टाइम अनुमानित प्रतीक्षा समय, टोकन संख्या और डॉक्टर की प्रगति देखें।'
        },
        'emergency ambulance': {
          title: '108 आपातकालीन एम्बुलेंस',
          category: 'आपातकालीन प्रेषण',
          description: 'जीपीएस ट्रैकिंग, सीधी 108 हेल्पलाइन और प्राथमिकता अस्पताल ट्रॉमा ट्राइएज के साथ त्वरित प्रेषण।'
        },
        'sign in': {
          title: 'मरीज पोर्टल साइन इन',
          category: 'खाता पहुंच',
          description: 'डिजिटल पास, नुस्खे और सिंक्रनाइज़ किए गए मेडिकल रिकॉर्ड तक पहुंचने के लिए लॉगिन करें।'
        }
      }
    },
    triage: {
      title: 'एआई क्लिनिकल ट्राइएज और विशेषज्ञ मिलान',
      subtitle: 'रीयल-टाइम डॉक्टर सिफारिश के लिए अपने लक्षणों का सरल शब्दों में वर्णन करें',
      describeSymptoms: 'अपने लक्षण बताएं',
      symptomPlaceholder: 'उदा. तेज सिरदर्द, छाती में जकड़न, 2 दिनों से बुखार...',
      severityLabel: 'लक्षणों की गंभीरता',
      mild: 'हल्का',
      moderate: 'मध्यम',
      severe: 'गंभीर',
      commonSymptoms: 'सामान्य लक्षण',
      analyzeButton: 'लक्षणों का विश्लेषण करें',
      analyzingText: 'एआई विश्लेषण कर रहा है...',
      confidenceScore: 'एआई मिलान सटीकता',
      recommendedSpecialist: 'अनुशंसित विशेषज्ञ',
      bookConsultation: 'विशेषज्ञ परामर्श बुक करें'
    },
    queue: {
      title: 'रीयल-टाइम अस्पताल ओपीडी कतार',
      subtitle: 'सिंक्रनाइज़ किए गए लाइव टोकन कॉल और अनुमानित प्रतीक्षा समय',
      yourToken: 'आपका टोकन',
      currentServing: 'वर्तमान में ओपीडी में',
      estimatedWait: 'अनुमानित प्रतीक्षा समय',
      departmentWing: 'विभाग और विंग',
      roomNo: 'परामर्श कक्ष',
      doctorOnDuty: 'उपस्थित डॉक्टर',
      statusWaiting: 'बुलावे की प्रतीक्षा',
      statusInProgress: 'डॉक्टर के साथ परामर्श में'
    }
  },

  bn: {
    common: {
      back: 'ফিরে যান',
      continue: 'এগিয়ে যান',
      cancel: 'বাতিল করুন',
      confirm: 'নিশ্চিত করুন',
      search: 'অনুসন্ধান করুন',
      loading: 'লোড হচ্ছে...',
      default: 'ডিফল্ট',
      language: 'ভাষা',
      selectLanguage: 'আপনার পছন্দের ভাষা নির্বাচন করুন',
      selectLanguageSubtitle: 'চিকিৎসা পরামর্শ, ট্রায়াজ এবং ডাঃ এআই নির্দেশিকার জন্য ভাষা বেছে নিন',
      applyLanguage: 'প্রয়োগ করুন এবং এগিয়ে যান',
      searchLanguagePlaceholder: 'ভাষা অনুসন্ধান করুন (যেমন: বাংলা, English, हिन्दी, Español)...',
      englishDefault: 'English (Default)',
      noLanguagesFound: 'কোনো ভাষা পাওয়া যায়নি'
    },
    nav: {
      services: 'পরিষেবা কেন্দ্র',
      doctors: 'বিশেষজ্ঞ ডাক্তার',
      bookAppointment: 'অ্যাপয়েন্টমেন্ট নিন',
      checkIn: 'স্বয়ং চেক-ইন',
      liveQueue: 'লাইভ সারি',
      myAppointments: 'আমার অ্যাপয়েন্টমেন্ট',
      medicalHistory: 'চিকিৎসা ইতিহাস',
      nearestHospitals: 'হাসপাতালসমূহ',
      emergencyAmbulance: 'অ্যাম্বুলেন্স',
      teleconsultation: 'টেলিকনসাল্ট',
      waitingTv: 'ওয়েটিং টিভি',
      signIn: 'সাইন ইন',
      register: 'নিবন্ধন করুন',
      logout: 'লগ আউট',
      hospitalStaff: 'হাসপাতাল স্টাফ'
    },
    hub: {
      welcomeGreeting: 'কেয়ারফ্লো হেলথকেয়ারে স্বাগতম',
      subGreeting: 'ইন্টেলিজেন্ট ক্লিনিকাল ট্রায়াজ, লাইভ কিউ ও বিশেষজ্ঞ সেবা',
      specialistCardTitle: 'বিশেষজ্ঞ চিকিৎসক',
      specialistCardDesc: 'এআই ক্লিনিকাল রোগনির্ণয় এবং বিশেষজ্ঞ ডাক্তারের সুপারিশ',
      findSpecialistAction: 'ডাক্তার খুঁজুন',
      bookCardTitle: 'সাক্ষাৎকার বুক করুন',
      bookCardDesc: 'সরাসরি ওপিডি বিশেষজ্ঞ পরামর্শ ও সময় বেছে নিন',
      bookSlotAction: 'স্লট বুক করুন',
      supportCardTitle: 'লাইভ কিউ ও টোকেন',
      supportCardDesc: 'রিয়েল-টাইম ওপিডি টোকেন ট্র্যাকিং এবং অপেক্ষার সময়',
      supportAction: 'কিউ ট্র্যাক করুন',
      activeTokenBanner: 'সক্রিয় যাচাইকৃত টোকেন সেশন',
      clickToViewToken: 'আপনার লাইভ টোকেন দেখতে এখানে ক্লিক করুন বা কেয়ারফ্লো লোগো চাপুন',
      viewTokenBadge: 'টোকেন দেখুন →',
      quickHospitalActions: 'হাসপাতালের দ্রুত কাজসমূহ',
      instantSelfService: 'তাত্ক্ষণিক স্ব-পরিষেবা টুল',
      hospitalCheckIn: 'হাসপাতাল চেক-ইন',
      arrivalVerification: 'উপস্থিতি যাচাই',
      liveQueueStatus: 'লাইভ কিউ স্ট্যাটাস',
      waitTimesAndTurns: 'অপেক্ষার সময় ও ক্রম',
      hospitalNetwork: 'হাসপাতাল নেটওয়ার্ক',
      nearbyIcuOpd: 'নিকটবর্তী আইসিইউ ও ওপিডি',
      myConsultations: 'আমার পরামর্শসমূহ',
      bookedPasses: 'বুক করা পাস ও ইতিহাস',
      directBookSlot: 'সরাসরি বুকিং',
      chooseDoctorDate: 'ডাক্তার ও তারিখ বেছে নিন',
      emergencyAmbulance: 'জরুরী অ্যাম্বুলেন্স',
      gpsDispatch: 'জিপিএস ট্র্যাকিং ও ১০৮ সেবা',
      lobbyDisplay: 'লবি ডিসপ্লে টিভি',
      publicWaitingTv: 'পাবলিক ওয়েটিং টিভি',
      nativeInstallersTitle: 'অফিসিয়াল অ্যাপ প্যাকেজ',
      nativeInstallersSubtitle: 'সরাসরি ডিভাইস প্যাকেজ (.apk • .mobileconfig • .dmg • .exe)',
      androidApk: 'অ্যান্ড্রয়েড এপিকে',
      iosConfig: 'আইওএস অ্যাপ',
      windowsApp: 'উইন্ডোজ অ্যাপ',
      macOsApp: 'ম্যাক অ্যাপ',
      officialDownload: 'ডাউনলোড',
      verifiedPackage: 'যাচাইকৃত',
      emergencyBanner: 'মেডিকেল জরুরী অবস্থা? সরাসরি ১০৮ অ্যাম্বুলেন্স হটলাইন'
    },
    auth: {
      loginTitle: 'কেয়ারফ্লোতে পুনরায় স্বাগতম',
      registerTitle: 'ডিজিটাল পেশেন্ট প্রোফাইল তৈরি করুন',
      loginSubtitle: 'নিরাপদ ওটিপি যাচাইকরণের জন্য মোবাইল নম্বর দিন',
      registerSubtitle: 'দ্রুত ডিজিটাল হেলথ অনবোর্ডিং এবং পরামর্শ পাস',
      mobileNumber: 'মোবাইল নম্বর',
      enterMobilePlaceholder: '১০-সংখ্যার মোবাইল নম্বর দিন',
      giveOtp: 'ওটিপি নিন',
      requestOtp: 'ওটিপির অনুরোধ করুন',
      carrierGatewayTitle: 'এসএমএস গেটওয়ে (রিয়েল-টাইম)',
      deliveredTo: 'প্রেরিত নম্বর',
      careFlowSecurityMsg: 'কেয়ারফ্লো সিকিউরিটি: আপনার লগইন ওটিপি হলো',
      validFor5Mins: '৫ মিনিটের জন্য বৈধ।',
      autoFill: 'স্বয়ংক্রিয় পূরণ',
      verifyAndLogin: 'যাচাই করুন ও সাইন ইন করুন',
      completeRegistration: 'প্রোফাইল নিবন্ধন সম্পন্ন করুন',
      fullName: 'পুরো নাম',
      fullNamePlaceholder: 'রোগীর পুরো নাম লিখুন',
      age: 'বয়স',
      gender: 'লিঙ্গ',
      selectGender: 'লিঙ্গ নির্বাচন করুন',
      male: 'পুরুষ',
      female: 'মহিলা',
      other: 'অন্যান্য',
      selectRole: 'অ্যাকাউন্টের ধরন',
      patient: 'রোগী',
      doctor: 'ডাক্তার',
      receptionist: 'রিসেপশনিস্ট',
      admin: 'অ্যাডমিন',
      alreadyHaveAccount: 'ইতিমধ্যে প্রোফাইল আছে?',
      dontHaveAccount: 'হাসপাতালে নতুন রোগী?',
      loginNow: 'সাইন ইন করুন',
      registerNow: 'প্রোফাইল তৈরি করুন'
    },
    mascot: {
      defaultSpeech: 'নমস্কার! 👋 আমি ডাঃ এআই, আপনার ক্লিনিকাল সঙ্গী। নিচের যেকোনো সেবা নির্বাচন করুন এবং আমি হাসপাতালে আপনার গাইড হিসেবে সহায়তা করব!',
      defaultSpeechName: 'নমস্কার {name}! 👋 আমি ডাঃ এআই, আপনার ক্লিনিকাল সঙ্গী। নিচের সেবা নির্বাচন করুন এবং আমি সহায়তা করব!',
      companionName: 'ডাঃ এআই',
      statusActive: 'সক্রিয় ক্লিনিকাল গাইড',
      statusSleeping: 'বিশ্রামে আছেন (জাগাতে ক্লিক করুন)',
      wakeUpTooltip: 'ডাঃ এআই-কে জাগিয়ে তুলুন',
      clickToAsk: 'ডাঃ এআই-কে প্রশ্ন করুন',
      options: {
        'services': {
          title: 'হাসপাতাল পরিষেবা কেন্দ্র',
          category: 'যত্ন ডিরেক্টরি',
          description: 'হাসপাতাল জুড়ে সমস্ত চিকিৎসা সেবা, জরুরী বিভাগ, ওপিডি ক্লিনিক এবং পরীক্ষাগার দেখুন।'
        },
        'doctors': {
          title: 'বিশেষজ্ঞ চিকিৎসক তালিকা',
          category: 'মেডিকেল টিম',
          description: 'যাচাইকৃত বিশেষজ্ঞ ডাক্তার খুঁজুন, তাদের যোগ্যতা, রেটিং, ওপিডি সময়সূচি ও প্রাপ্যতা দেখুন।'
        },
        'book appointment': {
          title: 'ওপিডি অ্যাপয়েন্টমেন্ট বুকিং',
          category: 'সরাসরি বুকিং',
          description: 'তাত্ক্ষণিক ডিজিটাল নিশ্চিতকরণের সাথে আপনার পছন্দের ডাক্তার, তারিখ এবং সময় স্লট বেছে নিন।'
        },
        'hospital check-in': {
          title: 'হাসপাতাল সেলফ চেক-ইন',
          category: 'উপস্থিতি যাচাই',
          description: 'ডাক্তারকে অবিলম্বে জানাতে এবং লাইনে আপনার অবস্থান নিশ্চিত করতে পেশেন্ট আইডি দিয়ে চেক-ইন করুন।'
        },
        'live queue status': {
          title: 'লাইভ কিউ স্ট্যাটাস',
          category: 'রিয়েল-টাইম মনিটর',
          description: 'প্রবেশ করার আগে আনুমানিক অপেক্ষার সময়, টোকেন নম্বর এবং ডাক্তারের অগ্রগতি দেখুন।'
        },
        'emergency ambulance': {
          title: '১০৮ জরুরী অ্যাম্বুলেন্স সার্ভিস',
          category: 'জরুরী সেবা',
          description: 'জিপিএস ট্র্যাকিং ও দ্রুত ১০৮ হটলাইনের সাথে জরুরি অ্যাম্বুলেন্স কল করুন।'
        },
        'sign in': {
          title: 'পেশেন্ট পোর্টাল সাইন ইন',
          category: 'অ্যাকাউন্ট অ্যাক্সেস',
          description: 'ডিজিটাল পাস, প্রেসক্রিপশন ও সংরক্ষিত মেডিকেল হিস্ট্রি দেখতে লগইন করুন।'
        }
      }
    },
    triage: {
      title: 'এআই ক্লিনিকাল ট্রায়াজ ও বিশেষজ্ঞ নির্বাচন',
      subtitle: 'ডাক্তারের পরামর্শের জন্য আপনার লক্ষণসমূহ সহজ ভাষায় বর্ণনা করুন',
      describeSymptoms: 'আপনার লক্ষণ জানান',
      symptomPlaceholder: 'যেমন: প্রচণ্ড মাথাব্যথা, বুকে চাপ, ২ দিন ধরে জ্বর...',
      severityLabel: 'লক্ষণ তীব্রতা',
      mild: 'মৃদু',
      moderate: 'মাঝারি',
      severe: 'মারাত্মক',
      commonSymptoms: 'সাধারণ লক্ষণসমূহ',
      analyzeButton: 'লক্ষণ বিশ্লেষণ করুন',
      analyzingText: 'এআই বিশ্লেষণ করছে...',
      confidenceScore: 'এআই ম্যাচ স্কোর',
      recommendedSpecialist: 'প্রস্তাবিত বিশেষজ্ঞ',
      bookConsultation: 'বিশেষজ্ঞের পরামর্শ নিন'
    },
    queue: {
      title: 'রিয়েল-টাইম হাসপাতাল ওপিডি কিউ',
      subtitle: 'লাইভ টোকেন কল এবং আনুমানিক অপেক্ষার সময়',
      yourToken: 'আপনার টোকেন',
      currentServing: 'বর্তমানে ওপিডিতে চলছে',
      estimatedWait: 'আনুমানিক অপেক্ষার সময়',
      departmentWing: 'বিভাগ ও উইং',
      roomNo: 'পরামর্শ কক্ষ',
      doctorOnDuty: 'উপস্থিত ডাক্তার',
      statusWaiting: 'ডাকার অপেক্ষা',
      statusInProgress: 'ডাক্তারের সাথে সাক্ষাতে'
    }
  },

  es: {
    common: {
      back: 'Atrás',
      continue: 'Continuar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      search: 'Buscar',
      loading: 'Cargando...',
      default: 'Predeterminado',
      language: 'Idioma',
      selectLanguage: 'Seleccione su idioma preferido',
      selectLanguageSubtitle: 'Elija su idioma para consultas médicas, triaje y orientación de Dr. AI',
      applyLanguage: 'Aplicar y Continuar',
      searchLanguagePlaceholder: 'Buscar idioma (ej. Español, English, Hindi, Français)...',
      englishDefault: 'English (Default)',
      noLanguagesFound: 'No se encontraron idiomas coincidentes'
    },
    nav: {
      services: 'Centro de Servicios',
      doctors: 'Especialistas',
      bookAppointment: 'Reservar Cita',
      checkIn: 'Auto Check-In',
      liveQueue: 'Cola en Vivo',
      myAppointments: 'Mis Citas',
      medicalHistory: 'Historial',
      nearestHospitals: 'Hospitales',
      emergencyAmbulance: 'Ambulancia',
      teleconsultation: 'Teleconsulta',
      waitingTv: 'TV de Espera',
      signIn: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión',
      hospitalStaff: 'Personal del Hospital'
    },
    hub: {
      welcomeGreeting: 'Bienvenido a CareFlow Healthcare',
      subGreeting: 'Triaje clínico inteligente, colas sin esperas y atención médica especializada',
      specialistCardTitle: 'Doctores',
      specialistCardDesc: 'Diagnóstico clínico con IA y recomendación de especialistas',
      findSpecialistAction: 'Buscar Especialista',
      bookCardTitle: 'Reservar Cita',
      bookCardDesc: 'Consulta ambulatoria directa con especialistas y horarios',
      bookSlotAction: 'Reservar Horario',
      supportCardTitle: 'Cola en Vivo y Ficha',
      supportCardDesc: 'Seguimiento de fichas en tiempo real y tiempos de espera',
      supportAction: 'Ver Cola',
      activeTokenBanner: 'Sesión de Ficha Activa Verificada',
      clickToViewToken: 'Haga clic aquí o toque el logo de CareFlow para ver su ficha en vivo',
      viewTokenBadge: 'Ver Ficha →',
      quickHospitalActions: 'Acciones Rápidas del Hospital',
      instantSelfService: 'Herramientas instantáneas de autoservicio',
      hospitalCheckIn: 'Check-In Hospitalario',
      arrivalVerification: 'Verificación de llegada',
      liveQueueStatus: 'Estado de la Cola',
      waitTimesAndTurns: 'Tiempos de espera y turnos',
      hospitalNetwork: 'Red Hospitalaria',
      nearbyIcuOpd: 'UCI y consultas cercanas',
      myConsultations: 'Mis Consultas',
      bookedPasses: 'Pases reservados e historial',
      directBookSlot: 'Reserva Directa',
      chooseDoctorDate: 'Elija doctor y fecha',
      emergencyAmbulance: 'Ambulancia de Emergencia',
      gpsDispatch: 'Despacho GPS y línea 108',
      lobbyDisplay: 'Pantalla de Sala',
      publicWaitingTv: 'TV pública de espera',
      nativeInstallersTitle: 'Instaladores Oficiales',
      nativeInstallersSubtitle: 'Paquetes directos (.apk • .mobileconfig • .dmg • .exe)',
      androidApk: 'Android APK',
      iosConfig: 'App iOS',
      windowsApp: 'App Windows',
      macOsApp: 'App macOS',
      officialDownload: 'Descargar',
      verifiedPackage: 'Verificado',
      emergencyBanner: '¿Emergencia médica? Línea directa de ambulancia 108'
    },
    auth: {
      loginTitle: 'Bienvenido de nuevo a CareFlow',
      registerTitle: 'Crear Perfil Digital de Paciente',
      loginSubtitle: 'Ingrese su número de móvil para verificación OTP segura',
      registerSubtitle: 'Acceso digital rápido a salud y pases de consulta',
      mobileNumber: 'Número de Móvil',
      enterMobilePlaceholder: 'Ingrese número móvil de 10 dígitos',
      giveOtp: 'Obtener OTP',
      requestOtp: 'Solicitar OTP',
      carrierGatewayTitle: 'PASARELA SMS (TIEMPO REAL)',
      deliveredTo: 'Entregado a',
      careFlowSecurityMsg: 'Seguridad CareFlow: Su código OTP es',
      validFor5Mins: 'Válido por 5 minutos.',
      autoFill: 'Auto-Rellenar',
      verifyAndLogin: 'Verificar e Iniciar Sesión',
      completeRegistration: 'Registrar Perfil',
      fullName: 'Nombre Completo',
      fullNamePlaceholder: 'Nombre completo del paciente',
      age: 'Edad',
      gender: 'Género',
      selectGender: 'Seleccione género',
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
      selectRole: 'Tipo de Cuenta',
      patient: 'Paciente',
      doctor: 'Doctor',
      receptionist: 'Recepcionista',
      admin: 'Administrador',
      alreadyHaveAccount: '¿Ya tiene perfil?',
      dontHaveAccount: '¿Nuevo paciente?',
      loginNow: 'Iniciar Sesión',
      registerNow: 'Registrarse'
    },
    mascot: {
      defaultSpeech: '¡Hola! 👋 Soy Dr. AI, su compañero clínico. ¡Seleccione un servicio abajo y lo guiaré en su visita al hospital!',
      defaultSpeechName: '¡Hola {name}! 👋 Soy Dr. AI, su compañero clínico. ¡Seleccione un servicio y lo guiaré!',
      companionName: 'Dr. AI',
      statusActive: 'Guía Clínico Activo',
      statusSleeping: 'Descansando (Toque para despertar)',
      wakeUpTooltip: 'Despertar a Dr. AI',
      clickToAsk: 'Preguntar a Dr. AI',
      options: {
        'services': {
          title: 'Centro de Servicios Médicos',
          category: 'Directorio',
          description: 'Explore todos los servicios clínicos, urgencias, consultas y laboratorios del hospital.'
        },
        'doctors': {
          title: 'Directorio de Médicos Especialistas',
          category: 'Personal Médico',
          description: 'Consulte médicos especialistas certificados, horarios, calificaciones y disponibilidad en vivo.'
        },
        'book appointment': {
          title: 'Programación de Citas Médicas',
          category: 'Reserva Directa',
          description: 'Seleccione doctor, fecha y horario de consulta con confirmación digital instantánea.'
        },
        'hospital check-in': {
          title: 'Auto Check-In en Hospital',
          category: 'Verificación',
          description: 'Confirme su llegada física con ID de paciente para notificar al doctor y asegurar su turno.'
        },
        'live queue status': {
          title: 'Estado de Cola en Vivo',
          category: 'Monitor en Tiempo Real',
          description: 'Vea tiempos estimados de espera y número de turno actual antes de ingresar.'
        },
        'emergency ambulance': {
          title: 'Ambulancia de Emergencia 108',
          category: 'Urgencias',
          description: 'Despacho rápido con rastreo GPS y conexión directa con el centro de trauma hospitalario.'
        },
        'sign in': {
          title: 'Ingreso al Portal del Paciente',
          category: 'Acceso a Cuenta',
          description: 'Inicie sesión para acceder a pases de consulta, recetas e historial médico sincronizado.'
        }
      }
    },
    triage: {
      title: 'Triaje Clínico con IA y Asignación Médica',
      subtitle: 'Describa sus síntomas en palabras sencillas para recomendación médica en tiempo real',
      describeSymptoms: 'Reporte sus Síntomas',
      symptomPlaceholder: 'ej. dolor de cabeza fuerte, presión en el pecho, fiebre...',
      severityLabel: 'Gravedad del Síntoma',
      mild: 'Leve',
      moderate: 'Moderado',
      severe: 'Grave',
      commonSymptoms: 'Síntomas Comunes',
      analyzeButton: 'Analizar Síntomas',
      analyzingText: 'IA Analizando Datos Clínicos...',
      confidenceScore: 'Confianza de la IA',
      recommendedSpecialist: 'Especialista Recomendado',
      bookConsultation: 'Reservar Consulta'
    },
    queue: {
      title: 'Cola Ambulatoria en Tiempo Real',
      subtitle: 'Llamados de turnos sincronizados y tiempos de espera',
      yourToken: 'Su Turno',
      currentServing: 'Atendiendo Ahora',
      estimatedWait: 'Tiempo Estimado de Espera',
      departmentWing: 'Departamento y Ala',
      roomNo: 'Consultorio',
      doctorOnDuty: 'Doctor de Turno',
      statusWaiting: 'Esperando Llamado',
      statusInProgress: 'En Consulta con Doctor'
    }
  }
};

function deepMerge<T extends Record<string, any>>(target: T, source: any): T {
  const output: any = { ...target };
  if (!source || typeof source !== 'object') return output;
  for (const key of Object.keys(source)) {
    if (source[key] !== undefined && source[key] !== null) {
      if (
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        typeof output[key] === 'object' &&
        !Array.isArray(output[key])
      ) {
        output[key] = deepMerge(output[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
}

const mergedTranslations: Record<string, TranslationKeys> = {
  ...BASE_TRANSLATIONS,
};

// Merge Indic translations
for (const [code, pack] of Object.entries(INDIC_TRANSLATIONS)) {
  mergedTranslations[code] = deepMerge(BASE_TRANSLATIONS.en, pack);
}

// Merge European translations
for (const [code, pack] of Object.entries(EUROPEAN_TRANSLATIONS)) {
  mergedTranslations[code] = deepMerge(BASE_TRANSLATIONS.en, pack);
}

// Merge Asian translations
for (const [code, pack] of Object.entries(ASIAN_TRANSLATIONS)) {
  mergedTranslations[code] = deepMerge(BASE_TRANSLATIONS.en, pack);
}

export const TRANSLATIONS: Record<string, TranslationKeys> = mergedTranslations;

