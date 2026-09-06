export const EUROPEAN_TRANSLATIONS: Record<string, any> = {
  // French
  fr: {
    common: {
      back: 'Retour',
      continue: 'Continuer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      search: 'Rechercher',
      loading: 'Chargement...',
      default: 'Par défaut',
      language: 'Langue',
      selectLanguage: 'Choisir la langue',
      selectLanguageSubtitle: 'Sélectionnez votre langue préférée pour le portail médical CareFlow',
      applyLanguage: 'Appliquer la langue',
      searchLanguagePlaceholder: 'Rechercher une langue...',
      englishDefault: 'Anglais (Par défaut)',
      noLanguagesFound: 'Aucune langue trouvée'
    },
    nav: {
      services: 'Services',
      doctors: 'Médecins',
      bookAppointment: 'Prendre Rendez-vous',
      checkIn: 'Enregistrement',
      liveQueue: 'File en Direct',
      myAppointments: 'Mes Rendez-vous',
      medicalHistory: 'Historique Médical',
      nearestHospitals: 'Hôpitaux Proches',
      emergencyAmbulance: 'Ambulance d’Urgence',
      teleconsultation: 'Téléconsultation',
      waitingTv: 'Écran Salle d’Attente',
      signIn: 'Connexion',
      register: 'S’inscrire',
      logout: 'Déconnexion',
      hospitalStaff: 'Personnel Hospitalier'
    },
    hub: {
      welcomeGreeting: 'Bienvenue chez CareFlow Santé',
      subGreeting: 'Triage clinique intelligent, prise de rendez-vous et suivi de file d’attente en direct',
      specialistCardTitle: 'Consulter un Spécialiste',
      specialistCardDesc: 'Analysez vos symptômes avec l’IA et trouvez le bon département médical.',
      findSpecialistAction: 'Trouver un Médecin',
      bookCardTitle: 'Prendre un Rendez-vous',
      bookCardDesc: 'Réservez votre créneau et obtenez votre numéro de token instantanément.',
      bookSlotAction: 'Réserver un Créneau',
      supportCardTitle: 'Urgence & Ambulance 108',
      supportCardDesc: 'Assistance d’urgence rapide et centres de traumatologie les plus proches.',
      supportAction: 'Demander de l’Aide',
      activeTokenBanner: 'Pass Token Actif',
      clickToViewToken: 'Cliquez pour voir les détails de votre token',
      viewTokenBadge: 'Voir le Token',
      quickHospitalActions: 'Actions Hospitalières Rapides',
      instantSelfService: 'Libre-Service Instantané',
      hospitalCheckIn: 'Enregistrement à l’Hôpital',
      arrivalVerification: 'Confirmation d’Arrivée',
      liveQueueStatus: 'État de la File d’Attente',
      waitTimesAndTurns: 'Temps d’Attente & Numéro de Tour',
      hospitalNetwork: 'Réseau Hospitalier',
      nearbyIcuOpd: 'Soins Intensifs & Consultations',
      myConsultations: 'Mes Consultations',
      bookedPasses: 'Pass Réservés',
      directBookSlot: 'Réservation Directe'
    },
    auth: {
      loginTitle: 'Connexion Patient',
      registerTitle: 'Nouvelle Inscription Patient',
      patientLogin: 'Téléphone Patient (OTP)',
      staffLogin: 'Personnel Hospitalier',
      mobileNumber: 'Numéro de Mobile Enregistré',
      giveOtp: 'Obtenir OTP & Se Connecter',
      enterOtp: 'Entrez le code OTP à 6 chiffres',
      verifyAndLogin: 'Vérifier OTP & Accéder au Portail',
      resendOtp: 'Renvoyer le code OTP',
      fullName: 'Nom Complet',
      email: 'Adresse E-mail',
      password: 'Mot de Passe',
      age: 'Âge',
      gender: 'Genre',
      bloodGroup: 'Groupe Sanguin',
      allergies: 'Allergies Connues',
      medicalHistory: 'Antécédents Médicaux',
      medications: 'Médicaments Actuels',
      completeRegistration: 'Terminer l’Inscription',
      autoFill: 'Remplissage Auto',
      keepSignedIn: 'Rester connecté sur cet appareil',
      role: 'Rôle'
    },
    mascot: {
      greeting: 'Bonjour ! Je suis Dr. CareFlow AI. Comment puis-je vous aider aujourd’hui ?',
      helpPrompt: 'Posez-moi des questions sur vos symptômes, votre file d’attente ou vos rendez-vous.',
      howCanIHelp: 'Comment puis-je vous assister ?',
      suggestedTitle: 'Suggestions Rapides :',
      optionExplain: 'Cliquez pour en savoir plus',
      quickTip: 'Conseil santé : veuillez effectuer votre check-in dès votre arrivée.',
      knowledgeBase: {
        'find doctor': {
          title: 'Trouver un Médecin Spécialiste',
          category: 'Orientation Médicale',
          description: 'L’IA évalue vos symptômes et vous oriente vers le bon spécialiste.'
        },
        'book appointment': {
          title: 'Prise de Rendez-vous Directe',
          category: 'Réservation',
          description: 'Choisissez votre médecin et obtenez un token numérique avec heure de passage.'
        },
        'hospital check-in': {
          title: 'Check-In Hospitalier',
          category: 'Vérification',
          description: 'Confirmez votre présence physique à l’hôpital pour avertir votre médecin.'
        },
        'live queue status': {
          title: 'File d’Attente en Direct',
          category: 'Moniteur en Temps Réel',
          description: 'Visualisez l’estimation du temps d’attente et le token en cours de consultation.'
        },
        'emergency ambulance': {
          title: 'Ambulance d’Urgence 108',
          category: 'Soins d’Urgence',
          description: 'Service d’intervention rapide avec géolocalisation GPS en temps réel.'
        },
        'sign in': {
          title: 'Portail Patient Sécurisé',
          category: 'Accès Compte',
          description: 'Consultez vos ordonnances et votre historique médical chiffré.'
        }
      }
    },
    triage: {
      title: 'Triage Clinique IA & Orientation Spécialisée',
      subtitle: 'Décrivez vos symptômes en quelques mots pour une analyse instantanée',
      describeSymptoms: 'Signaler vos Symptômes',
      symptomPlaceholder: 'ex. maux de tête sévères, douleur thoracique, fièvre...',
      severityLabel: 'Niveau de Gravité',
      mild: 'Léger',
      moderate: 'Modéré',
      severe: 'Sévère',
      commonSymptoms: 'Symptômes Courants',
      analyzeButton: 'Analyser les Symptômes',
      analyzingText: 'Analyse IA en cours...',
      confidenceScore: 'Indice de Confiance IA',
      recommendedSpecialist: 'Spécialiste Recommandé',
      bookConsultation: 'Réserver la Consultation'
    },
    queue: {
      title: 'File d’Attente Consultations en Direct',
      subtitle: 'Appels de tokens synchronisés et estimation des temps d’attente',
      yourToken: 'Votre Numéro de Token',
      currentServing: 'Numéro en Cours',
      estimatedWait: 'Temps d’Attente Estimé',
      departmentWing: 'Département & Aile',
      roomNo: 'Cabinet Médical',
      doctorOnDuty: 'Médecin de Garde',
      statusWaiting: 'En Attente de l’Appel',
      statusInProgress: 'En Consultation avec le Médecin'
    }
  },

  // German
  de: {
    common: {
      back: 'Zurück',
      continue: 'Weiter',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      search: 'Suchen',
      loading: 'Laden...',
      default: 'Standard',
      language: 'Sprache',
      selectLanguage: 'Sprache wählen',
      selectLanguageSubtitle: 'Wählen Sie Ihre bevorzugte Sprache für das CareFlow-Portal',
      applyLanguage: 'Sprache anwenden',
      searchLanguagePlaceholder: 'Sprache suchen...',
      englishDefault: 'Englisch (Standard)',
      noLanguagesFound: 'Keine Sprachen gefunden'
    },
    nav: {
      services: 'Dienste',
      doctors: 'Fachärzte',
      bookAppointment: 'Termin buchen',
      checkIn: 'Klinik-Check-in',
      liveQueue: 'Live-Warteschlange',
      myAppointments: 'Meine Termine',
      medicalHistory: 'Krankenakte',
      nearestHospitals: 'Kliniken in der Nähe',
      emergencyAmbulance: 'Notfall-Ambulanz',
      teleconsultation: 'Videosprechstunde',
      waitingTv: 'Warteraum-TV',
      signIn: 'Anmelden',
      register: 'Registrieren',
      logout: 'Abmelden',
      hospitalStaff: 'Klinikpersonal'
    },
    hub: {
      welcomeGreeting: 'Willkommen bei CareFlow Healthcare',
      subGreeting: 'Intelligente klinische Triage, schnelle Terminbuchung und Live-Warteschlangenüberwachung',
      specialistCardTitle: 'Facharzt konsultieren',
      specialistCardDesc: 'Analysieren Sie Symptome mit KI und finden Sie die richtige Fachabteilung.',
      findSpecialistAction: 'Facharzt finden',
      bookCardTitle: 'Termin vereinbaren',
      bookCardDesc: 'Sichern Sie sich sofort Ihre Wartenummer und Ihren Zeitslot.',
      bookSlotAction: 'Termin buchen',
      supportCardTitle: 'Notdienst & Rettungswagen',
      supportCardDesc: 'Schneller Notrufdienst 108 und nahegelegene Traumazentren.',
      supportAction: 'Hilfe anfordern',
      activeTokenBanner: 'Aktiver Token-Pass',
      clickToViewToken: 'Klicken Sie für Token-Details',
      viewTokenBadge: 'Token ansehen',
      quickHospitalActions: 'Klinik-Schnellaktionen',
      instantSelfService: 'Sofortiger Selbstservice',
      hospitalCheckIn: 'Klinik-Check-in',
      arrivalVerification: 'Ankunft bestätigen',
      liveQueueStatus: 'Live-Warteschlangenstatus',
      waitTimesAndTurns: 'Wartezeiten & Wartenummer',
      hospitalNetwork: 'Kliniknetzwerk',
      nearbyIcuOpd: 'Intensivstation & Ambulanz',
      myConsultations: 'Meine Sprechstunden',
      bookedPasses: 'Gebuchte Termine',
      directBookSlot: 'Direktbuchung'
    },
    auth: {
      loginTitle: 'Patienten-Login',
      registerTitle: 'Neue Patienten-Registrierung',
      patientLogin: 'Patiententelefon (OTP)',
      staffLogin: 'Klinikpersonal',
      mobileNumber: 'Registrierte Mobilnummer',
      giveOtp: 'OTP anfordern & Anmelden',
      enterOtp: '6-stelligen OTP-Code eingeben',
      verifyAndLogin: 'OTP bestätigen & Anmelden',
      resendOtp: 'OTP erneut senden',
      fullName: 'Vollständiger Name',
      email: 'E-Mail-Adresse',
      password: 'Passwort',
      age: 'Alter',
      gender: 'Geschlecht',
      bloodGroup: 'Blutgruppe',
      allergies: 'Bekannte Allergien',
      medicalHistory: 'Vorerkrankungen',
      medications: 'Aktuelle Medikamente',
      completeRegistration: 'Registrierung abschließen',
      autoFill: 'Autovervollständigung',
      keepSignedIn: 'Auf diesem Gerät angemeldet bleiben',
      role: 'Rolle'
    },
    mascot: {
      greeting: 'Guten Tag! Ich bin Dr. CareFlow AI. Wie kann ich Ihnen heute helfen?',
      helpPrompt: 'Fragen Sie mich nach Symptomen, Warteschlangenstatus oder Terminen.',
      howCanIHelp: 'Wie kann ich Ihnen behilflich sein?',
      suggestedTitle: 'Vorschläge für Sie:',
      optionExplain: 'Klicken für Erklärung',
      quickTip: 'Gesundheitstipp: Bitte checken Sie direkt bei Ankunft in der Klinik ein.',
      knowledgeBase: {
        'find doctor': {
          title: 'Facharzt finden',
          category: 'Medizinische Orientierung',
          description: 'Die KI gleicht Ihre Symptome ab und empfiehlt den besten Facharzt.'
        },
        'book appointment': {
          title: 'Direktbuchung',
          category: 'Terminvergabe',
          description: 'Buchen Sie Ihren Termin mit digitalem Aufruf-Token.'
        },
        'hospital check-in': {
          title: 'Klinik-Check-in',
          category: 'Verifizierung',
          description: 'Bestätigen Sie Ihr Eintreffen vor Ort für Ihren behandelnden Arzt.'
        },
        'live queue status': {
          title: 'Live-Warteschlangenstatus',
          category: 'Echtzeit-Monitor',
          description: 'Erfahren Sie geschätzte Wartezeiten und den aktuellen Aufruf.'
        },
        'emergency ambulance': {
          title: 'Notfall-Ambulanz 108',
          category: 'Notfallversorgung',
          description: 'Schneller Rettungsdienst mit Live-GPS-Tracking.'
        },
        'sign in': {
          title: 'Patientenportal',
          category: 'Kontozugriff',
          description: 'Melden Sie sich an für Rezepte und Ihre verschlüsselte Krankenakte.'
        }
      }
    },
    triage: {
      title: 'Klinische KI-Triage & Facharzt-Matching',
      subtitle: 'Beschreiben Sie Ihre Symptome für eine sofortige ärztliche Empfehlung',
      describeSymptoms: 'Symptome angeben',
      symptomPlaceholder: 'z.B. starke Kopfschmerzen, Brustschmerzen, Fieber...',
      severityLabel: 'Schweregrad',
      mild: 'Leicht',
      moderate: 'Mittel',
      severe: 'Schwer',
      commonSymptoms: 'Häufige Symptome',
      analyzeButton: 'Symptome analysieren',
      analyzingText: 'KI analysiert Symptome...',
      confidenceScore: 'KI-Konfidenz',
      recommendedSpecialist: 'Empfohlener Facharzt',
      bookConsultation: 'Termin buchen'
    },
    queue: {
      title: 'Echtzeit-Ambulanz-Warteschlange',
      subtitle: 'Synchronisierte Token-Aufrufe und präzise Wartezeit-Prognosen',
      yourToken: 'Ihre Wartenummer',
      currentServing: 'Aktuell aufgerufen',
      estimatedWait: 'Geschätzte Wartezeit',
      departmentWing: 'Abteilung & Flügel',
      roomNo: 'Behandlungsraum',
      doctorOnDuty: 'Diensthabender Arzt',
      statusWaiting: 'Wartet auf Aufruf',
      statusInProgress: 'In ärztlicher Behandlung'
    }
  },

  // Italian
  it: {
    common: {
      back: 'Indietro',
      continue: 'Continua',
      cancel: 'Annulla',
      confirm: 'Conferma',
      search: 'Cerca',
      loading: 'Caricamento...',
      default: 'Predefinito',
      language: 'Lingua',
      selectLanguage: 'Seleziona Lingua',
      selectLanguageSubtitle: 'Scegli la tua lingua preferita per il portale CareFlow',
      applyLanguage: 'Applica Lingua',
      searchLanguagePlaceholder: 'Cerca lingua...',
      englishDefault: 'Inglese (Predefinito)',
      noLanguagesFound: 'Nessuna lingua trovata'
    },
    nav: {
      services: 'Servizi',
      doctors: 'Medici',
      bookAppointment: 'Prenota Visita',
      checkIn: 'Check-In Ospedale',
      liveQueue: 'Coda in Tempo Reale',
      myAppointments: 'I Miei Appuntamenti',
      medicalHistory: 'Cartella Clinica',
      nearestHospitals: 'Ospedali Vicini',
      emergencyAmbulance: 'Ambulanza di Emergenza',
      teleconsultation: 'Teleconsulto',
      waitingTv: 'Schermo Sala d’Attesa',
      signIn: 'Accedi',
      register: 'Registrati',
      logout: 'Esci',
      hospitalStaff: 'Personale Ospedaliero'
    },
    hub: {
      welcomeGreeting: 'Benvenuto in CareFlow Healthcare',
      subGreeting: 'Triage clinico con IA, prenotazioni intelligenti e monitoraggio code in tempo reale',
      specialistCardTitle: 'Consulta uno Specialista',
      specialistCardDesc: 'Analizza i tuoi sintomi con l’IA e trova il medico più adatto alle tue esigenze.',
      findSpecialistAction: 'Trova Medico',
      bookCardTitle: 'Prenota una Visita',
      bookCardDesc: 'Ottieni subito il tuo numero di chiamata e la fascia oraria della visita.',
      bookSlotAction: 'Prenota Orario',
      supportCardTitle: 'Emergenze & Ambulanza',
      supportCardDesc: 'Servizio di emergenza 108 e centri traumatologici più vicini.',
      supportAction: 'Richiedi Aiuto',
      activeTokenBanner: 'Pass Token Attivo',
      clickToViewToken: 'Clicca per visualizzare i dettagli del token',
      viewTokenBadge: 'Vedi Token',
      quickHospitalActions: 'Azioni Rapide Ospedale',
      instantSelfService: 'Self-Service Immediato',
      hospitalCheckIn: 'Check-In Ospedaliero',
      arrivalVerification: 'Verifica Arrivo',
      liveQueueStatus: 'Stato Coda in Tempo Reale',
      waitTimesAndTurns: 'Tempi di Attesa & Numero Turno',
      hospitalNetwork: 'Rete Ospedaliera',
      nearbyIcuOpd: 'Pronto Soccorso & Ambulatori',
      myConsultations: 'Le Mie Visite',
      bookedPasses: 'Pass Prenotati',
      directBookSlot: 'Prenotazione Diretta'
    },
    auth: {
      loginTitle: 'Accesso Paziente',
      registerTitle: 'Registrazione Nuovo Paziente',
      patientLogin: 'Telefono Paziente (OTP)',
      staffLogin: 'Personale Ospedaliero',
      mobileNumber: 'Numero di Cellulare Registrato',
      giveOtp: 'Richiedi OTP & Accedi',
      enterOtp: 'Inserisci codice OTP a 6 cifre',
      verifyAndLogin: 'Verifica OTP & Entra nel Portale',
      resendOtp: 'Invia di nuovo OTP',
      fullName: 'Nome Completo',
      email: 'Indirizzo E-mail',
      password: 'Password',
      age: 'Età',
      gender: 'Genere',
      bloodGroup: 'Gruppo Sanguigno',
      allergies: 'Allergie Note',
      medicalHistory: 'Condizioni Mediche Pregresse',
      medications: 'Farmaci Attuali',
      completeRegistration: 'Completa Registrazione',
      autoFill: 'Completamento Automatico',
      keepSignedIn: 'Rimani connesso su questo dispositivo',
      role: 'Ruolo'
    },
    mascot: {
      greeting: 'Ciao! Sono il Dr. CareFlow AI. Come posso aiutarti oggi?',
      helpPrompt: 'Chiedimi informazioni su sintomi, stato della coda o prenotazioni.',
      howCanIHelp: 'Come posso esserti utile?',
      suggestedTitle: 'Suggerimenti Rapidi:',
      optionExplain: 'Clicca per dettagli',
      quickTip: 'Consiglio utile: effettua il check-in non appena arrivi in ospedale.',
      knowledgeBase: {
        'find doctor': {
          title: 'Trova Specialista',
          category: 'Guida Medica',
          description: 'L’IA analizza i sintomi ed individua il miglior medico specialista.'
        },
        'book appointment': {
          title: 'Prenotazione Visita',
          category: 'Prenotazioni',
          description: 'Riserva il tuo appuntamento con orario e token digitale.'
        },
        'hospital check-in': {
          title: 'Check-In Ospedale',
          category: 'Verifica',
          description: 'Conferma il tuo arrivo in ospedale per essere inserito nella lista visite.'
        },
        'live queue status': {
          title: 'Stato della Coda',
          category: 'Tempo Reale',
          description: 'Monitora la tua posizione e la stima del tempo di attesa rimanente.'
        },
        'emergency ambulance': {
          title: 'Ambulanza 108',
          category: 'Pronto Intervento',
          description: 'Soccorso medico immediato con tracciamento GPS in tempo reale.'
        },
        'sign in': {
          title: 'Portale Paziente',
          category: 'Accesso',
          description: 'Accedi per consultare ricette, referti e la tua cartella clinica.'
        }
      }
    },
    triage: {
      title: 'Triage Clinico con IA & Scelta Specialista',
      subtitle: 'Descrivi i tuoi sintomi per ricevere una raccomandazione medica immediata',
      describeSymptoms: 'Segnala i tuoi Sintomi',
      symptomPlaceholder: 'es. forte mal di testa, oppressione toracica, febbre...',
      severityLabel: 'Livello di Gravità',
      mild: 'Lieve',
      moderate: 'Moderato',
      severe: 'Grave',
      commonSymptoms: 'Sintomi Comuni',
      analyzeButton: 'Analizza Sintomi',
      analyzingText: 'Analisi IA in corso...',
      confidenceScore: 'Affidabilità IA',
      recommendedSpecialist: 'Specialista Suggerito',
      bookConsultation: 'Prenota Visita'
    },
    queue: {
      title: 'Coda Ambulatoriale in Tempo Reale',
      subtitle: 'Chiamata turni sincronizzata e tempi di attesa stimati',
      yourToken: 'Il Tuo Token',
      currentServing: 'Attualmente Servito',
      estimatedWait: 'Tempo di Attesa Stimato',
      departmentWing: 'Reparto & Ala',
      roomNo: 'Stanza Visite',
      doctorOnDuty: 'Medico di Turno',
      statusWaiting: 'In Attesa di Chiamata',
      statusInProgress: 'In Visita con il Medico'
    }
  },

  // Portuguese
  pt: {
    common: {
      back: 'Voltar',
      continue: 'Continuar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      search: 'Pesquisar',
      loading: 'Carregando...',
      default: 'Padrão',
      language: 'Idioma',
      selectLanguage: 'Selecionar Idioma',
      selectLanguageSubtitle: 'Escolha o seu idioma de preferência para o portal CareFlow',
      applyLanguage: 'Aplicar Idioma',
      searchLanguagePlaceholder: 'Buscar idioma...',
      englishDefault: 'Inglês (Padrão)',
      noLanguagesFound: 'Nenhum idioma encontrado'
    },
    nav: {
      services: 'Serviços',
      doctors: 'Médicos',
      bookAppointment: 'Agendar Consulta',
      checkIn: 'Check-In Hospitalar',
      liveQueue: 'Fila ao Vivo',
      myAppointments: 'Minhas Consultas',
      medicalHistory: 'Histórico Médico',
      nearestHospitals: 'Hospitais Próximos',
      emergencyAmbulance: 'Ambulância de Emergência',
      teleconsultation: 'Teleconsulta',
      waitingTv: 'TV Sala de Espera',
      signIn: 'Entrar',
      register: 'Cadastre-se',
      logout: 'Sair',
      hospitalStaff: 'Equipe Hospitalar'
    },
    hub: {
      welcomeGreeting: 'Bem-vindo ao CareFlow Saúde',
      subGreeting: 'Triagem clínica com IA, agendamento inteligente e fila de espera em tempo real',
      specialistCardTitle: 'Consultar Especialista',
      specialistCardDesc: 'Analise sintomas com IA e encontre a especialidade médica recomendada.',
      findSpecialistAction: 'Encontrar Médico',
      bookCardTitle: 'Agendar Consulta',
      bookCardDesc: 'Garanta seu número de token digital e horário de atendimento imediatamente.',
      bookSlotAction: 'Reservar Horário',
      supportCardTitle: 'Emergência & Ambulância',
      supportCardDesc: 'Atendimento de emergência 108 e centros de trauma mais próximos.',
      supportAction: 'Pedir Ajuda',
      activeTokenBanner: 'Passe de Token Ativo',
      clickToViewToken: 'Clique para ver detalhes do token',
      viewTokenBadge: 'Ver Token',
      quickHospitalActions: 'Ações Rápidas do Hospital',
      instantSelfService: 'Autoatendimento Imediato',
      hospitalCheckIn: 'Check-In Hospitalar',
      arrivalVerification: 'Confirmação de Chegada',
      liveQueueStatus: 'Status da Fila ao Vivo',
      waitTimesAndTurns: 'Tempo de Espera & Número de Vez',
      hospitalNetwork: 'Rede Hospitalar',
      nearbyIcuOpd: 'UTI & Atendimento Ambulatorial',
      myConsultations: 'Minhas Consultas',
      bookedPasses: 'Passes Agendados',
      directBookSlot: 'Agendamento Direto'
    },
    auth: {
      loginTitle: 'Login do Paciente',
      registerTitle: 'Cadastro de Novo Paciente',
      patientLogin: 'Celular do Paciente (OTP)',
      staffLogin: 'Equipe Hospitalar',
      mobileNumber: 'Número de Celular Cadastrado',
      giveOtp: 'Obter OTP & Entrar',
      enterOtp: 'Digite o código OTP de 6 dígitos',
      verifyAndLogin: 'Verificar OTP & Acessar Portal',
      resendOtp: 'Reenviar código OTP',
      fullName: 'Nome Completo',
      email: 'Endereço de E-mail',
      password: 'Senha',
      age: 'Idade',
      gender: 'Gênero',
      bloodGroup: 'Tipo Sanguíneo',
      allergies: 'Alergias Conhecidas',
      medicalHistory: 'Histórico de Doenças Prévias',
      medications: 'Medicamentos em Uso',
      completeRegistration: 'Concluir Cadastro & Acessar',
      autoFill: 'Preenchimento Automático',
      keepSignedIn: 'Manter conectado neste dispositivo',
      role: 'Função'
    },
    mascot: {
      greeting: 'Olá! Sou o Dr. CareFlow AI. Como posso te ajudar hoje?',
      helpPrompt: 'Pergunte-me sobre sintomas, fila de espera ou agendamento de consultas.',
      howCanIHelp: 'Como posso te auxiliar?',
      suggestedTitle: 'Sugestões Rápidas:',
      optionExplain: 'Clique para ver explicação',
      quickTip: 'Dica de saúde: realize seu check-in assim que chegar ao hospital.',
      knowledgeBase: {
        'find doctor': {
          title: 'Encontrar Especialista',
          category: 'Orientação Médica',
          description: 'A IA analisa seus sintomas e recomenda o melhor especialista disponível.'
        },
        'book appointment': {
          title: 'Agendar Consulta',
          category: 'Agendamentos',
          description: 'Escolha seu médico e receba um token digital com estimativa de atendimento.'
        },
        'hospital check-in': {
          title: 'Check-In no Hospital',
          category: 'Confirmação',
          description: 'Confirme sua chegada física para que o médico seja notificado.'
        },
        'live queue status': {
          title: 'Fila ao Vivo',
          category: 'Monitor em Tempo Real',
          description: 'Acompanhe seu tempo de espera e a chamada de senhas ao vivo.'
        },
        'emergency ambulance': {
          title: 'Ambulância de Emergência 108',
          category: 'Urgência',
          description: 'Despacho rápido com rastreamento GPS e conexão direta ao hospital.'
        },
        'sign in': {
          title: 'Portal do Paciente',
          category: 'Acesso à Conta',
          description: 'Acesse receitas, exames e seu prontuário médico criptografado.'
        }
      }
    },
    triage: {
      title: 'Triagem Clínica IA & Encaminhamento Médico',
      subtitle: 'Descreva seus sintomas para recomendação médica imediata',
      describeSymptoms: 'Informe seus Sintomas',
      symptomPlaceholder: 'ex. dor de cabeça intensa, dor no peito, febre alta...',
      severityLabel: 'Nível de Gravidade',
      mild: 'Leve',
      moderate: 'Moderado',
      severe: 'Grave',
      commonSymptoms: 'Sintomas Comuns',
      analyzeButton: 'Analisar Sintomas',
      analyzingText: 'IA Analisando Sintomas...',
      confidenceScore: 'Confiança da IA',
      recommendedSpecialist: 'Especialista Recomendado',
      bookConsultation: 'Agendar Consulta'
    },
    queue: {
      title: 'Fila Ambulatorial em Tempo Real',
      subtitle: 'Chamada de senhas sincronizada e estimativa precisa de espera',
      yourToken: 'Seu Número de Token',
      currentServing: 'Atendimento Atual',
      estimatedWait: 'Tempo de Espera Estimado',
      departmentWing: 'Departamento & Ala',
      roomNo: 'Consultório',
      doctorOnDuty: 'Médico de Plantão',
      statusWaiting: 'Aguardando Chamada',
      statusInProgress: 'Em Consulta com o Médico'
    }
  },

  // Russian
  ru: {
    common: {
      back: 'Назад',
      continue: 'Продолжить',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      search: 'Поиск',
      loading: 'Загрузка...',
      default: 'По умолчанию',
      language: 'Язык',
      selectLanguage: 'Выберите язык',
      selectLanguageSubtitle: 'Выберите предпочитаемый язык для медицинского портала CareFlow',
      applyLanguage: 'Применить язык',
      searchLanguagePlaceholder: 'Поиск языка...',
      englishDefault: 'Английский (По умолчанию)',
      noLanguagesFound: 'Языки не найдены'
    },
    nav: {
      services: 'Услуги',
      doctors: 'Врачи',
      bookAppointment: 'Запись на прием',
      checkIn: 'Регистрация прибытия',
      liveQueue: 'Онлайн очередь',
      myAppointments: 'Мои записи',
      medicalHistory: 'Медицинская карта',
      nearestHospitals: 'Ближайшие клиники',
      emergencyAmbulance: 'Скорая помощь',
      teleconsultation: 'Телемедицина',
      waitingTv: 'Экран зала ожидания',
      signIn: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      hospitalStaff: 'Сотрудники клиники'
    },
    hub: {
      welcomeGreeting: 'Добро пожаловать в CareFlow',
      subGreeting: 'Клинический ИИ-триаж, онлайн-запись к врачам и мониторинг очередей в реальном времени',
      specialistCardTitle: 'Консультация специалиста',
      specialistCardDesc: 'Оцените симптомы с помощью ИИ и запишитесь к нужному врачу.',
      findSpecialistAction: 'Найти врача',
      bookCardTitle: 'Записаться на прием',
      bookCardDesc: 'Мгновенное бронирование талона и точного времени приема.',
      bookSlotAction: 'Выбрать время',
      supportCardTitle: 'Скорая помощь и неотложка',
      supportCardDesc: 'Служба экстренной помощи 108 и ближайшие травмпункты.',
      supportAction: 'Вызвать помощь',
      activeTokenBanner: 'Активный электронный талон',
      clickToViewToken: 'Нажмите, чтобы открыть информацию о талоне',
      viewTokenBadge: 'Открыть талон',
      quickHospitalActions: 'Быстрые действия',
      instantSelfService: 'Быстрое самообслуживание',
      hospitalCheckIn: 'Регистрация в клинике',
      arrivalVerification: 'Подтверждение прибытия',
      liveQueueStatus: 'Статус живой очереди',
      waitTimesAndTurns: 'Время ожидания и номер в очереди',
      hospitalNetwork: 'Сеть клиник',
      nearbyIcuOpd: 'Отделения реанимации и поликлиники',
      myConsultations: 'Мои приемы',
      bookedPasses: 'Забронированные талоны',
      directBookSlot: 'Прямая запись'
    },
    auth: {
      loginTitle: 'Вход для пациентов',
      registerTitle: 'Регистрация нового пациента',
      patientLogin: 'Телефон пациента (OTP)',
      staffLogin: 'Персонал больницы',
      mobileNumber: 'Номер мобильного телефона',
      giveOtp: 'Получить OTP и войти',
      enterOtp: 'Введите 6-значный код из SMS',
      verifyAndLogin: 'Подтвердить код и войти',
      resendOtp: 'Отправить код повторно',
      fullName: 'ФИО полностью',
      email: 'Электронная почта',
      password: 'Пароль',
      age: 'Возраст',
      gender: 'Пол',
      bloodGroup: 'Группа крови',
      allergies: 'Аллергические реакции',
      medicalHistory: 'Хронические заболевания',
      medications: 'Принимаемые препараты',
      completeRegistration: 'Завершить регистрацию',
      autoFill: 'Автозаполнение',
      keepSignedIn: 'Оставаться в системе на этом устройстве',
      role: 'Роль'
    },
    mascot: {
      greeting: 'Здравствуйте! Я доктор CareFlow AI. Чем могу помочь вам сегодня?',
      helpPrompt: 'Спросите меня о симптомах, состоянии очереди или записи к врачу.',
      howCanIHelp: 'Чем я могу вам помочь?',
      suggestedTitle: 'Популярные вопросы:',
      optionExplain: 'Нажмите для подробностей',
      quickTip: 'Медицинский совет: не забудьте пройти электронную регистрацию по прибытии.',
      knowledgeBase: {
        'find doctor': {
          title: 'Поиск узкого специалиста',
          category: 'Медицинская помощь',
          description: 'ИИ сопоставляет симптомы и рекомендует лучшего профильного врача.'
        },
        'book appointment': {
          title: 'Запись на прием',
          category: 'Бронирование',
          description: 'Выберите врача и получите электронный талон с указанием времени.'
        },
        'hospital check-in': {
          title: 'Регистрация прибытия',
          category: 'Подтверждение',
          description: 'Подтвердите присутствие в клинике, чтобы уведомить врача.'
        },
        'live queue status': {
          title: 'Очередь в реальном времени',
          category: 'Монитор приема',
          description: 'Следите за номером вызываемого талона и примерным временем ожидания.'
        },
        'emergency ambulance': {
          title: 'Скорая помощь 108',
          category: 'Неотложная помощь',
          description: 'Срочный вызов бригады с отслеживанием по GPS.'
        },
        'sign in': {
          title: 'Кабинет пациента',
          category: 'Доступ к данным',
          description: 'Вход для просмотра назначений, рецептов и медицинской карты.'
        }
      }
    },
    triage: {
      title: 'Клинический триаж с ИИ и подбор врача',
      subtitle: 'Опишите ваши симптомы простыми словами для мгновенной оценки',
      describeSymptoms: 'Опишите симптомы',
      symptomPlaceholder: 'например, острая головная боль, давящая боль в груди, температура...',
      severityLabel: 'Тяжесть состояния',
      mild: 'Легкая',
      moderate: 'Умеренная',
      severe: 'Тяжелая',
      commonSymptoms: 'Частые симптомы',
      analyzeButton: 'Анализировать симптомы',
      analyzingText: 'ИИ анализирует жалобы...',
      confidenceScore: 'Точность ИИ',
      recommendedSpecialist: 'Рекомендуемый специалист',
      bookConsultation: 'Записаться к врачу'
    },
    queue: {
      title: 'Электронная очередь поликлиники',
      subtitle: 'Вызов талонов в режиме реального времени и прогноз ожидания',
      yourToken: 'Номер вашего талона',
      currentServing: 'Сейчас на приеме',
      estimatedWait: 'Примерное время ожидания',
      departmentWing: 'Отделение и крыло',
      roomNo: 'Кабинет',
      doctorOnDuty: 'Принимающий врач',
      statusWaiting: 'Ожидание вызова',
      statusInProgress: 'Идет прием у врача'
    }
  },

  // Dutch
  nl: {
    common: {
      back: 'Terug',
      continue: 'Doorgaan',
      cancel: 'Annuleren',
      confirm: 'Bevestigen',
      search: 'Zoeken',
      loading: 'Laden...',
      default: 'Standaard',
      language: 'Taal',
      selectLanguage: 'Kies Taal',
      selectLanguageSubtitle: 'Selecteer uw voorkeurstaal voor het CareFlow-zorgportaal',
      applyLanguage: 'Taal toepassen',
      searchLanguagePlaceholder: 'Zoek een taal...',
      englishDefault: 'Engels (Standaard)',
      noLanguagesFound: 'Geen talen gevonden'
    },
    nav: {
      services: 'Diensten',
      doctors: 'Artsen',
      bookAppointment: 'Afspraak Maken',
      checkIn: 'Inchecken',
      liveQueue: 'Live Wachtrij',
      myAppointments: 'Mijn Afspraken',
      medicalHistory: 'Medisch Dossier',
      nearestHospitals: 'Dichtstbijzijnde Ziekenhuizen',
      emergencyAmbulance: 'Spoedambulance',
      teleconsultation: 'Teleconsult',
      waitingTv: 'Wachtkamer TV',
      signIn: 'Inloggen',
      register: 'Registreren',
      logout: 'Uitloggen',
      hospitalStaff: 'Ziekenhuispersoneel'
    },
    hub: {
      welcomeGreeting: 'Welkom bij CareFlow Gezondheidszorg',
      subGreeting: 'Intelligente klinische triage, eenvoudig afspraken boeken en live wachtrijbeheer',
      specialistCardTitle: 'Raadpleeg een Specialist',
      specialistCardDesc: 'Analyseer symptomen met AI en vind direct de juiste medische afdeling.',
      findSpecialistAction: 'Vind een Arts',
      bookCardTitle: 'Afspraak Boeken',
      bookCardDesc: 'Ontvang direct uw digitale wachtnummer en gereserveerde tijd.',
      bookSlotAction: 'Tijdslot Boeken',
      supportCardTitle: 'Spoedhulp & Ambulance',
      supportCardDesc: '108 spoedhulpdienst en dichtstbijzijnde traumacentra.',
      supportAction: 'Hulp Inroepen',
      activeTokenBanner: 'Actieve Afspraakpas',
      clickToViewToken: 'Klik om wachtnummer en details te bekijken',
      viewTokenBadge: 'Bekijk Nummer',
      quickHospitalActions: 'Snelle Ziekenhuisacties',
      instantSelfService: 'Directe Zelfservice',
      hospitalCheckIn: 'Ziekenhuis Inchecken',
      arrivalVerification: 'Aankomstbevestiging',
      liveQueueStatus: 'Live Wachtrijstatus',
      waitTimesAndTurns: 'Wachttijd & Huidige Beurt',
      hospitalNetwork: 'Ziekenhuisnetwerk',
      nearbyIcuOpd: 'Intensieve Zorg & Polikliniek',
      myConsultations: 'Mijn Consulten',
      bookedPasses: 'Geboekte Afspraken',
      directBookSlot: 'Direct Boeken'
    },
    auth: {
      loginTitle: 'Patiënt Inloggen',
      registerTitle: 'Nieuwe Patiënt Registratie',
      patientLogin: 'Patiënt Telefoon (OTP)',
      staffLogin: 'Ziekenhuispersoneel',
      mobileNumber: 'Geregistreerd Mobiel Nummer',
      giveOtp: 'Ontvang OTP & Inloggen',
      enterOtp: 'Voer de 6-cijferige OTP-code in',
      verifyAndLogin: 'Verifieer & Open Portaal',
      resendOtp: 'Stuur OTP opnieuw',
      fullName: 'Volledige Naam',
      email: 'E-mailadres',
      password: 'Wachtwoord',
      age: 'Leeftijd',
      gender: 'Geslacht',
      bloodGroup: 'Bloedgroep',
      allergies: 'Bekende Allergieën',
      medicalHistory: 'Eerdere Medische Aandoeningen',
      medications: 'Huidige Medicatie',
      completeRegistration: 'Voltooi Registratie',
      autoFill: 'Automatisch invullen',
      keepSignedIn: 'Aangemeld blijven op dit apparaat',
      role: 'Rol'
    },
    mascot: {
      greeting: 'Hallo! Ik ben Dr. CareFlow AI. Hoe kan ik u vandaag helpen?',
      helpPrompt: 'Vraag mij gerust over symptomen, wachttijden of afspraken.',
      howCanIHelp: 'Waarmee kan ik u van dienst zijn?',
      suggestedTitle: 'Aanbevolen Hulp:',
      optionExplain: 'Klik voor uitleg',
      quickTip: 'Gezondheidstip: vergeet niet in te checken zodra u in het ziekenhuis aankomt.',
      knowledgeBase: {
        'find doctor': {
          title: 'Specialist Vinden',
          category: 'Medische Richtlijn',
          description: 'AI analyseert uw klachten en koppelt u aan de meest geschikte specialist.'
        },
        'book appointment': {
          title: 'Afspraak Plannen',
          category: 'Boekingen',
          description: 'Reserveer uw tijd en ontvang direct een digitaal oproepnummer.'
        },
        'hospital check-in': {
          title: 'Inchecken in Ziekenhuis',
          category: 'Bevestiging',
          description: 'Bevestig uw fysieke aanwezigheid zodat de arts weet dat u er bent.'
        },
        'live queue status': {
          title: 'Live Wachtrijstatus',
          category: 'Realtime Monitor',
          description: 'Bekijk wachttijden en welk nummer momenteel aan de beurt is.'
        },
        'emergency ambulance': {
          title: 'Noodambulance 108',
          category: 'Spoedhulp',
          description: 'Snelle ambulance-inzet met actuele GPS-tracering.'
        },
        'sign in': {
          title: 'Patiëntenportaal',
          category: 'Toegang',
          description: 'Inloggen voor recepten, afspraken en uw beveiligd medisch dossier.'
        }
      }
    },
    triage: {
      title: 'Klinische AI-Triage & Specialist Matching',
      subtitle: 'Beschrijf uw symptomen in duidelijke taal voor direct medisch advies',
      describeSymptoms: 'Meld uw Symptomen',
      symptomPlaceholder: 'bijv. zware hoofdpijn, drukkende pijn op de borst, koorts...',
      severityLabel: 'Ernst van de Klachten',
      mild: 'Mild',
      moderate: 'Matig',
      severe: 'Ernstig',
      commonSymptoms: 'Veelvoorkomende Symptomen',
      analyzeButton: 'Analyseer Symptomen',
      analyzingText: 'AI analyseert gegevens...',
      confidenceScore: 'AI-Betrouwbaarheid',
      recommendedSpecialist: 'Aanbevolen Specialist',
      bookConsultation: 'Afspraak Boeken'
    },
    queue: {
      title: 'Realtime Poliklinische Wachtrij',
      subtitle: 'Gesynchroniseerde oproepen en actuele wachttijdindicaties',
      yourToken: 'Uw Wachtnummer',
      currentServing: 'Nu aan de Beurt',
      estimatedWait: 'Geschatte Wachttijd',
      departmentWing: 'Afdeling & Vleugel',
      roomNo: 'Spreekkamer',
      doctorOnDuty: 'Dienstdoende Arts',
      statusWaiting: 'Wachten op Oproep',
      statusInProgress: 'In Consult bij Arts'
    }
  },

  // Polish
  pl: {
    common: {
      back: 'Wstecz',
      continue: 'Dalej',
      cancel: 'Anuluj',
      confirm: 'Potwierdź',
      search: 'Szukaj',
      loading: 'Ładowanie...',
      default: 'Domyślny',
      language: 'Język',
      selectLanguage: 'Wybierz Język',
      selectLanguageSubtitle: 'Wybierz preferowany język dla portalu medycznego CareFlow',
      applyLanguage: 'Zastosuj Język',
      searchLanguagePlaceholder: 'Szukaj języka...',
      englishDefault: 'Angielski (Domyślny)',
      noLanguagesFound: 'Nie znaleziono języków'
    },
    nav: {
      services: 'Usługi',
      doctors: 'Lekarze',
      bookAppointment: 'Zarezerwuj Wizytę',
      checkIn: 'Rejestracja w Szpitalu',
      liveQueue: 'Kolejka na Żywo',
      myAppointments: 'Moje Wizyty',
      medicalHistory: 'Historia Medyczna',
      nearestHospitals: 'Najbliższe Szpitale',
      emergencyAmbulance: 'Pogotowie Ratunkowe',
      teleconsultation: 'Teleporada',
      waitingTv: 'Ekran Poczekalni',
      signIn: 'Zaloguj się',
      register: 'Zarejestruj się',
      logout: 'Wyloguj',
      hospitalStaff: 'Personel Medyczny'
    },
    hub: {
      welcomeGreeting: 'Witamy w CareFlow Healthcare',
      subGreeting: 'Inteligentny triage medyczny, wygodna rejestracja wizyt i kolejka w czasie rzeczywistym',
      specialistCardTitle: 'Skonsultuj się ze Specjalistą',
      specialistCardDesc: 'Opisz objawy za pomocą AI i znajdź odpowiedniego lekarza.',
      findSpecialistAction: 'Znajdź Lekarza',
      bookCardTitle: 'Zarezerwuj Wizytę',
      bookCardDesc: 'Otrzymaj natychmiast numer biletu oraz godzinę przyjęcia.',
      bookSlotAction: 'Wybierz Termin',
      supportCardTitle: 'Pogotowie i Pomoc Doraźna',
      supportCardDesc: 'Karetka ratunkowa 108 i najbliższe oddziały ratunkowe.',
      supportAction: 'Wezwij Pomoc',
      activeTokenBanner: 'Aktywny Bilet Kolejkowy',
      clickToViewToken: 'Kliknij, aby sprawdzić szczegóły biletu',
      viewTokenBadge: 'Pokaż Bilet',
      quickHospitalActions: 'Szybkie Akcje',
      instantSelfService: 'Szybka Samoobsługa',
      hospitalCheckIn: 'Odprawa w Szpitalu',
      arrivalVerification: 'Potwierdzenie Przybycia',
      liveQueueStatus: 'Status Kolejki na Żywo',
      waitTimesAndTurns: 'Czas Oczekiwania i Aktualny Bilet',
      hospitalNetwork: 'Sieć Szpitali',
      nearbyIcuOpd: 'OIOM i Przychodnie',
      myConsultations: 'Moje Konsultacje',
      bookedPasses: 'Zarezerwowane Przepustki',
      directBookSlot: 'Szybka Rezerwacja'
    },
    auth: {
      loginTitle: 'Logowanie Pacjenta',
      registerTitle: 'Rejestracja Nowego Pacjenta',
      patientLogin: 'Telefon Pacjenta (OTP)',
      staffLogin: 'Personel Szpitala',
      mobileNumber: 'Zarejestrowany Numer Telefonu',
      giveOtp: 'Pobierz OTP i Zaloguj',
      enterOtp: 'Wpisz 6-cyfrowy kod z SMS',
      verifyAndLogin: 'Zweryfikuj OTP i Wejdź',
      resendOtp: 'Wyślij kod ponownie',
      fullName: 'Imię i Nazwisko',
      email: 'Adres E-mail',
      password: 'Hasło',
      age: 'Wiek',
      gender: 'Płeć',
      bloodGroup: 'Grupa Krwi',
      allergies: 'Znane Alergie',
      medicalHistory: 'Wcześniejsze Choroby',
      medications: 'Przyjmowane Leki',
      completeRegistration: 'Zakończ Rejestrację',
      autoFill: 'Wypełnij Automatycznie',
      keepSignedIn: 'Zapamiętaj mnie na tym urządzeniu',
      role: 'Rola'
    },
    mascot: {
      greeting: 'Dzień dobry! Jestem Dr. CareFlow AI. W czym mogę dziś pomóc?',
      helpPrompt: 'Zapytaj mnie o objawy, kolejkę lub rezerwację wizyty.',
      howCanIHelp: 'Jak mogę Ci pomóc?',
      suggestedTitle: 'Proponowane tematy:',
      optionExplain: 'Kliknij, aby przeczytać wyjaśnienie',
      quickTip: 'Wskazówka medyczna: zgłoś swoje przybycie w recepcji natychmiast po wejściu.',
      knowledgeBase: {
        'find doctor': {
          title: 'Znajdź Lekarza Specjalistę',
          category: 'Pomoc Medyczna',
          description: 'AI dopasowuje objawy i wskazuje odpowiedniego lekarza specjalistę.'
        },
        'book appointment': {
          title: 'Rezerwacja Wizyty',
          category: 'Zapisy',
          description: 'Wybierz dogodny termin i odbierz elektroniczny bilet z numerem.'
        },
        'hospital check-in': {
          title: 'Odprawa w Szpitalu',
          category: 'Weryfikacja',
          description: 'Potwierdź swoją obecność w placówce, aby poinformować lekarza.'
        },
        'live queue status': {
          title: 'Kolejka na Żywo',
          category: 'Podgląd w Czasie Rzeczywistym',
          description: 'Sprawdź orientacyjny czas oczekiwania i aktualnie obsługiwany numer.'
        },
        'emergency ambulance': {
          title: 'Pogotowie Ratunkowe 108',
          category: 'Nagłe Przypadki',
          description: 'Szybkie wezwanie karetki z podglądem lokalizacji GPS.'
        },
        'sign in': {
          title: 'Portal Pacjenta',
          category: 'Dostęp do Konta',
          description: 'Zaloguj się, aby zobaczyć e-recepty i swoją historię leczenia.'
        }
      }
    },
    triage: {
      title: 'Kliniczny Triage AI i Wybór Lekarza',
      subtitle: 'Opisz objawy własnymi słowami, aby otrzymać natychmiastową rekomendację',
      describeSymptoms: 'Podaj Objawy',
      symptomPlaceholder: 'np. silny ból głowy, ucisk w klatce piersiowej, gorączka...',
      severityLabel: 'Stopień Nasilenia',
      mild: 'Łagodny',
      moderate: 'Umiarkowany',
      severe: 'Ciężki',
      commonSymptoms: 'Typowe Objawy',
      analyzeButton: 'Przeanalizuj Objawy',
      analyzingText: 'AI analizuje dane...',
      confidenceScore: 'Pewność AI',
      recommendedSpecialist: 'Rekomendowany Specjalista',
      bookConsultation: 'Umów Wizytę'
    },
    queue: {
      title: 'Kolejka Ambulatoryjna na Żywo',
      subtitle: 'Bieżące wywołania biletów i szacowany czas oczekiwania',
      yourToken: 'Twój Numer Biletu',
      currentServing: 'Aktualnie Przyjmowany',
      estimatedWait: 'Szacowany Czas Oczekiwania',
      departmentWing: 'Oddział i Skrzydło',
      roomNo: 'Gabinet',
      doctorOnDuty: 'Lekarz Przyjmujący',
      statusWaiting: 'Oczekiwanie na Wywołanie',
      statusInProgress: 'W Gabinecie Lekarskim'
    }
  },

  // Swedish
  sv: {
    common: {
      back: 'Tillbaka',
      continue: 'Fortsätt',
      cancel: 'Avbryt',
      confirm: 'Bekräfta',
      search: 'Sök',
      loading: 'Laddar...',
      default: 'Standard',
      language: 'Språk',
      selectLanguage: 'Välj Språk',
      selectLanguageSubtitle: 'Välj ditt föredragna språk för CareFlow-portalen',
      applyLanguage: 'Tillämpa Språk',
      searchLanguagePlaceholder: 'Sök språk...',
      englishDefault: 'Engelska (Standard)',
      noLanguagesFound: 'Inga språk hittades'
    },
    nav: {
      services: 'Tjänster',
      doctors: 'Läkare',
      bookAppointment: 'Boka Tid',
      checkIn: 'Checka In',
      liveQueue: 'Livekö',
      myAppointments: 'Mina Bokningar',
      medicalHistory: 'Journal & Historik',
      nearestHospitals: 'Närmaste Sjukhus',
      emergencyAmbulance: 'Akutambulans',
      teleconsultation: 'Videomöte',
      waitingTv: 'Väntrums-TV',
      signIn: 'Logga In',
      register: 'Registrera Dig',
      logout: 'Logga Ut',
      hospitalStaff: 'Sjukhuspersonal'
    },
    hub: {
      welcomeGreeting: 'Välkommen till CareFlow Hälso- och Sjukvård',
      subGreeting: 'Intelligent medicinsk bedömning, enkel bokning och köövervakning i realtid',
      specialistCardTitle: 'Rådgör med Specialist',
      specialistCardDesc: 'Analysera dina symtom med AI och få remiss till rätt avdelning.',
      findSpecialistAction: 'Hitta Läkare',
      bookCardTitle: 'Boka Läkartid',
      bookCardDesc: 'Få ditt könummer och din besökstid direkt.',
      bookSlotAction: 'Välj Tid',
      supportCardTitle: 'Akuthjälp & Ambulans',
      supportCardDesc: '108 larmtjänst och närmaste akutmottagningar.',
      supportAction: 'Begär Hjälp',
      activeTokenBanner: 'Aktivt Könummer',
      clickToViewToken: 'Klicka för att se detaljer om din bokning',
      viewTokenBadge: 'Visa Nummer',
      quickHospitalActions: 'Snabbval Sjukhus',
      instantSelfService: 'Snabb Självbetjäning',
      hospitalCheckIn: 'Sjukhusincheckning',
      arrivalVerification: 'Ankomstbekräftelse',
      liveQueueStatus: 'Liveköstatus',
      waitTimesAndTurns: 'Väntetid & Aktuellt Nummer',
      hospitalNetwork: 'Sjukhusnätverk',
      nearbyIcuOpd: 'Intensivvård & Mottagningar',
      myConsultations: 'Mina Läkarbesök',
      bookedPasses: 'Bokade Besök',
      directBookSlot: 'Direktbokning'
    },
    auth: {
      loginTitle: 'Patientinloggning',
      registerTitle: 'Ny Patientregistrering',
      patientLogin: 'Mobilnummer (OTP)',
      staffLogin: 'Sjukhuspersonal',
      mobileNumber: 'Registrerat Mobilnummer',
      giveOtp: 'Hämta OTP & Logga In',
      enterOtp: 'Ange 6-siffrig engångskod',
      verifyAndLogin: 'Verifiera & Öppna Portalen',
      resendOtp: 'Skicka koden igen',
      fullName: 'Fullständigt Namn',
      email: 'E-postadress',
      password: 'Lösenord',
      age: 'Ålder',
      gender: 'Kön',
      bloodGroup: 'Blodgrupp',
      allergies: 'Kända Allergier',
      medicalHistory: 'Tidigare Sjukdomar',
      medications: 'Nuvarande Medicinering',
      completeRegistration: 'Slutför Registrering',
      autoFill: 'Fyll i Automatiskt',
      keepSignedIn: 'Håll mig inloggad på denna enhet',
      role: 'Roll'
    },
    mascot: {
      greeting: 'Hej! Jag är Dr. CareFlow AI. Hur kan jag hjälpa dig idag?',
      helpPrompt: 'Fråga mig om symtom, köstatus eller hur du bokar tid.',
      howCanIHelp: 'Hur kan jag bistå dig?',
      suggestedTitle: 'Förslag på frågor:',
      optionExplain: 'Klicka för förklaring',
      quickTip: 'Hälsotips: checka in direkt när du anländer till sjukhuset.',
      knowledgeBase: {
        'find doctor': {
          title: 'Hitta Specialistläkare',
          category: 'Medicinsk Vägledning',
          description: 'AI analyserar dina symtom och rekommenderar rätt specialist.'
        },
        'book appointment': {
          title: 'Boka Läkartid',
          category: 'Tidsbokning',
          description: 'Välj tid och få en digital nummerlapp med beräknad tid.'
        },
        'hospital check-in': {
          title: 'Checka In på Sjukhuset',
          category: 'Ankomst',
          description: 'Bekräfta din ankomst så att läkaren vet att du är på plats.'
        },
        'live queue status': {
          title: 'Liveköstatus',
          category: 'Realtidskö',
          description: 'Se aktuellt uppropat nummer och beräknad väntetid.'
        },
        'emergency ambulance': {
          title: 'Akutambulans 108',
          category: 'Akutvård',
          description: 'Snabb utryckning med GPS-spårning i realtid.'
        },
        'sign in': {
          title: 'Patientportal',
          category: 'Konto',
          description: 'Logga in för att se recept, provsvar och krypterad journal.'
        }
      }
    },
    triage: {
      title: 'Klinisk AI-Bedömning & Läkarmatchning',
      subtitle: 'Beskriv dina symtom med egna ord för omedelbar medicinsk vägledning',
      describeSymptoms: 'Beskriv Symtom',
      symptomPlaceholder: 't.ex. svår huvudvärk, tryck över bröstet, hög feber...',
      severityLabel: 'Svårighetsgrad',
      mild: 'Mild',
      moderate: 'Måttlig',
      severe: 'Svår',
      commonSymptoms: 'Vanliga Symtom',
      analyzeButton: 'Analysera Symtom',
      analyzingText: 'AI analyserar dina svar...',
      confidenceScore: 'AI-Säkerhet',
      recommendedSpecialist: 'Rekommenderad Läkare',
      bookConsultation: 'Boka Besök'
    },
    queue: {
      title: 'Realtidskö Mottagning',
      subtitle: 'Synkroniserade upprop och uppdaterade väntetider',
      yourToken: 'Ditt Könummer',
      currentServing: 'Betjänas Just Nu',
      estimatedWait: 'Beräknad Väntetid',
      departmentWing: 'Avdelning & Flygel',
      roomNo: 'Mottagningsrum',
      doctorOnDuty: 'Tjänstgörande Läkare',
      statusWaiting: 'Väntar på Upprop',
      statusInProgress: 'Hos Läkaren'
    }
  },

  // Turkish
  tr: {
    common: {
      back: 'Geri',
      continue: 'Devam Et',
      cancel: 'İptal',
      confirm: 'Onayla',
      search: 'Ara',
      loading: 'Yükleniyor...',
      default: 'Varsayılan',
      language: 'Dil',
      selectLanguage: 'Dil Seçin',
      selectLanguageSubtitle: 'CareFlow sağlık portalı için tercih ettiğiniz dili seçin',
      applyLanguage: 'Dili Uygula',
      searchLanguagePlaceholder: 'Dil ara...',
      englishDefault: 'İngilizce (Varsayılan)',
      noLanguagesFound: 'Dil bulunamadı'
    },
    nav: {
      services: 'Hizmetler',
      doctors: 'Doktorlar',
      bookAppointment: 'Randevu Al',
      checkIn: 'Hastane Giriş (Check-In)',
      liveQueue: 'Canlı Sıra',
      myAppointments: 'Randevularım',
      medicalHistory: 'Tıbbi Geçmiş',
      nearestHospitals: 'En Yakın Hastaneler',
      emergencyAmbulance: 'Acil Ambulans',
      teleconsultation: 'Telekonsültasyon',
      waitingTv: 'Bekleme Salonu TV',
      signIn: 'Giriş Yap',
      register: 'Kayıt Ol',
      logout: 'Çıkış Yap',
      hospitalStaff: 'Hastane Personeli'
    },
    hub: {
      welcomeGreeting: 'CareFlow Sağlık Hizmetlerine Hoş Geldiniz',
      subGreeting: 'Yapay zeka destekli klinik triyaj, hızlı randevu ve canlı sıra takibi',
      specialistCardTitle: 'Uzman Doktora Danışın',
      specialistCardDesc: 'Belirtilerinizi yapay zeka ile analiz edip doğru polikliniği bulun.',
      findSpecialistAction: 'Doktor Bul',
      bookCardTitle: 'Randevu Oluşturun',
      bookCardDesc: 'Sıra numaranızı ve randevu saatinizi anında belirleyin.',
      bookSlotAction: 'Saat Seçin',
      supportCardTitle: 'Acil Yardım & Ambulans',
      supportCardDesc: '108 acil çağrı ve en yakın travma merkezleri.',
      supportAction: 'Yardım Çağır',
      activeTokenBanner: 'Aktif Sıra Bileti',
      clickToViewToken: 'Bilet ayrıntılarını görmek için tıklayın',
      viewTokenBadge: 'Bileti Gör',
      quickHospitalActions: 'Hızlı Hastane İşlemleri',
      instantSelfService: 'Anında Kendi Kendine İşlem',
      hospitalCheckIn: 'Hastane Girişi',
      arrivalVerification: 'Varış Onayı',
      liveQueueStatus: 'Canlı Sıra Durumu',
      waitTimesAndTurns: 'Bekleme Süresi ve Sıra Numarası',
      hospitalNetwork: 'Hastane Ağı',
      nearbyIcuOpd: 'Yoğun Bakım ve Poliklinikler',
      myConsultations: 'Muayenelerim',
      bookedPasses: 'Alınan Randevular',
      directBookSlot: 'Doğrudan Randevu'
    },
    auth: {
      loginTitle: 'Hasta Girişi',
      registerTitle: 'Yeni Hasta Kaydı',
      patientLogin: 'Hasta Telefonu (OTP)',
      staffLogin: 'Hastane Personeli',
      mobileNumber: 'Kayıtlı Cep Telefonu',
      giveOtp: 'OTP İste & Giriş Yap',
      enterOtp: '6 haneli SMS kodunu girin',
      verifyAndLogin: 'Doğrula & Portala Gir',
      resendOtp: 'Kodu Tekrar Gönder',
      fullName: 'Ad Soyad',
      email: 'E-posta Adresi',
      password: 'Şifre',
      age: 'Yaş',
      gender: 'Cinsiyet',
      bloodGroup: 'Kan Grubu',
      allergies: 'Bilinen Alerjiler',
      medicalHistory: 'Geçmiş Hastalıklar',
      medications: 'Kullanılan İlaçlar',
      completeRegistration: 'Kaydı Tamamla',
      autoFill: 'Otomatik Doldur',
      keepSignedIn: 'Bu cihazda oturumu açık tut',
      role: 'Rol'
    },
    mascot: {
      greeting: 'Merhaba! Ben Dr. CareFlow AI. Bugün size nasıl yardımcı olabilirim?',
      helpPrompt: 'Belirtileriniz, sıra durumunuz veya randevularınız hakkında soru sorabilirsiniz.',
      howCanIHelp: 'Size nasıl destek olabilirim?',
      suggestedTitle: 'Önerilen Konular:',
      optionExplain: 'Açıklama için tıklayın',
      quickTip: 'Sağlık İpucu: Hastaneye vardığınızda lütfen hemen check-in yapın.',
      knowledgeBase: {
        'find doctor': {
          title: 'Uzman Doktor Bul',
          category: 'Tıbbi Yönlendirme',
          description: 'Yapay zeka şikayetlerinize en uygun uzmanı önerir.'
        },
        'book appointment': {
          title: 'Randevu Alma',
          category: 'Randevular',
          description: 'Dijital sıra numarası ile randevunuzu kolayca planlayın.'
        },
        'hospital check-in': {
          title: 'Hastane Girişi (Check-In)',
          category: 'Onay',
          description: 'Geldiğinizi doğrulayarak doktorunuza haber verin.'
        },
        'live queue status': {
          title: 'Canlı Sıra Durumu',
          category: 'Canlı Ekran',
          description: 'Sıranızın ne zaman geleceğini ve tahmini bekleme süresini öğrenin.'
        },
        'emergency ambulance': {
          title: 'Acil Ambulans 108',
          category: 'Acil Durum',
          description: 'Canlı GPS takipli en hızlı ambulans yönlendirme.'
        },
        'sign in': {
          title: 'Hasta Portalı',
          category: 'Hesap Erişimi',
          description: 'Reçetelerinizi ve şifrelenmiş tıbbi geçmişinizi görün.'
        }
      }
    },
    triage: {
      title: 'Klinik Yapay Zeka Triyajı & Doktor Eşleştirme',
      subtitle: 'Anında yönlendirme için şikayetlerinizi kendi kelimelerinizle yazın',
      describeSymptoms: 'Şikayetlerinizi Belirtin',
      symptomPlaceholder: 'örn. şiddetli baş ağrısı, göğüste baskı, ateş...',
      severityLabel: 'Şiddet Derecesi',
      mild: 'Hafif',
      moderate: 'Orta',
      severe: 'Şiddetli',
      commonSymptoms: 'Yaygın Belirtiler',
      analyzeButton: 'Şikayetleri Analiz Et',
      analyzingText: 'Yapay zeka inceliyor...',
      confidenceScore: 'Yapay Zeka Güven Oranı',
      recommendedSpecialist: 'Önerilen Uzmanlık',
      bookConsultation: 'Randevu Al'
    },
    queue: {
      title: 'Canlı Poliklinik Sırası',
      subtitle: 'Senkronize sıra çağrıları ve anlık bekleme tahminleri',
      yourToken: 'Sıra Numaranız',
      currentServing: 'Muayenedeki Numara',
      estimatedWait: 'Tahmini Bekleme Süresi',
      departmentWing: 'Bölüm ve Kanat',
      roomNo: 'Oda No',
      doctorOnDuty: 'Nöbetçi Doktor',
      statusWaiting: 'Çağrı Bekleniyor',
      statusInProgress: 'Doktor ile Muayenede'
    }
  }
};
