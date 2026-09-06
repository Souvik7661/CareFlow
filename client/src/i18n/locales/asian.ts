export const ASIAN_TRANSLATIONS: Record<string, any> = {
  // Mandarin Chinese
  zh: {
    common: {
      back: '返回',
      continue: '继续',
      cancel: '取消',
      confirm: '确认',
      search: '搜索',
      loading: '加载中...',
      default: '默认',
      language: '语言',
      selectLanguage: '选择语言',
      selectLanguageSubtitle: '为 CareFlow 智慧医疗选择您的首选语言',
      applyLanguage: '应用语言',
      searchLanguagePlaceholder: '搜索语言...',
      englishDefault: '英语 (默认)',
      noLanguagesFound: '未找到语言'
    },
    nav: {
      services: '医疗服务',
      doctors: '医生列表',
      bookAppointment: '预约挂号',
      checkIn: '到院签到',
      liveQueue: '实时排队',
      myAppointments: '我的预约',
      medicalHistory: '就诊病历',
      nearestHospitals: '附近医院',
      emergencyAmbulance: '急救救护车',
      teleconsultation: '远程会诊',
      waitingTv: '候诊大屏',
      signIn: '登录',
      register: '注册',
      logout: '退出登录',
      hospitalStaff: '医护入口'
    },
    hub: {
      welcomeGreeting: '欢迎使用 CareFlow 智慧医疗系统',
      subGreeting: 'AI 临床智能分诊、极速挂号与实时排队叫号系统',
      specialistCardTitle: '智能专家分诊',
      specialistCardDesc: '智能解析您的症状，快速匹配最合适的科室与专家。',
      findSpecialistAction: '查找医生',
      bookCardTitle: '预约挂号就医',
      bookCardDesc: '实时锁定就诊排队号码与准确时间段。',
      bookSlotAction: '预约时段',
      supportCardTitle: '紧急救援与救护车',
      supportCardDesc: '108 急救调度中心与就近创伤急救中心联动。',
      supportAction: '呼叫救援',
      activeTokenBanner: '当前生效的就诊排队号',
      clickToViewToken: '点击查看排队详情与当前就诊进度',
      viewTokenBadge: '查看排队号',
      quickHospitalActions: '快捷就医服务',
      instantSelfService: '自助快捷通道',
      hospitalCheckIn: '到院扫码签到',
      arrivalVerification: '确认已到院',
      liveQueueStatus: '排队叫号大屏',
      waitTimesAndTurns: '预计等候时间与当前号码',
      hospitalNetwork: '医联体网络',
      nearbyIcuOpd: '急诊与门诊中心',
      myConsultations: '我的挂号记录',
      bookedPasses: '就诊凭证',
      directBookSlot: '快捷挂号'
    },
    auth: {
      loginTitle: '患者登录',
      registerTitle: '新患者建档注册',
      patientLogin: '手机验证码登录 (OTP)',
      staffLogin: '医护人员通道',
      mobileNumber: '注册手机号码',
      giveOtp: '获取验证码并登录',
      enterOtp: '请输入 6 位短信验证码',
      verifyAndLogin: '验证并进入就诊大厅',
      resendOtp: '重新发送验证码',
      fullName: '患者姓名',
      email: '电子邮箱',
      password: '密码',
      age: '年龄',
      gender: '性别',
      bloodGroup: '血型',
      allergies: '过敏史',
      medicalHistory: '既往病史',
      medications: '当前服用药物',
      completeRegistration: '完成建档并进入系统',
      autoFill: '自动填入',
      keepSignedIn: '在此设备上保持登录状态',
      role: '身份角色'
    },
    mascot: {
      greeting: '您好！我是 CareFlow 智能医疗助手。请问今天有什么可以帮您？',
      helpPrompt: '您可以向我咨询身体症状、科室分诊、排队进度或就医预约。',
      howCanIHelp: '我能为您提供什么帮助？',
      suggestedTitle: '快捷咨询指引：',
      optionExplain: '点击查看详情',
      quickTip: '就医提示：到达医院后，请务必先前往自助机或手机完成到院签到。',
      knowledgeBase: {
        'find doctor': {
          title: '查找专科医生',
          category: '就医分诊',
          description: 'AI 根据您的主诉症状智能推荐最佳出诊专家。'
        },
        'book appointment': {
          title: '预约挂号就医',
          category: '在线预约',
          description: '选择出诊专家并获取带有就诊时间段的电子排队号。'
        },
        'hospital check-in': {
          title: '到院签到登记',
          category: '就诊确认',
          description: '确认您已到达门诊候诊区，通知主治医生排号。'
        },
        'live queue status': {
          title: '实时叫号进度',
          category: '门诊大屏',
          description: '查看当前叫号、排队顺位及预计剩余等候时间。'
        },
        'emergency ambulance': {
          title: '108 急救救护车',
          category: '紧急呼叫',
          description: 'GPS 实时定位调度急救救护车直达创伤急诊中心。'
        },
        'sign in': {
          title: '患者健康中心',
          category: '个人账户',
          description: '查看您的电子病历、处方流转及检验检查报告。'
        }
      }
    },
    triage: {
      title: 'AI 临床智能分诊与专家匹配',
      subtitle: '请简单描述您的身体不适，系统将即刻提供智能就医指引',
      describeSymptoms: '请描述您的主要症状',
      symptomPlaceholder: '例如：严重头痛伴恶心、胸闷气短、高烧两天...',
      severityLabel: '症状严重程度',
      mild: '轻微',
      moderate: '中度',
      severe: '严重',
      commonSymptoms: '常见症状参考',
      analyzeButton: '开始智能分诊分析',
      analyzingText: 'AI 正在分析医学数据...',
      confidenceScore: 'AI 临床置信度',
      recommendedSpecialist: '推荐挂号科室与专家',
      bookConsultation: '立即预约专家门诊'
    },
    queue: {
      title: '门诊实时排队叫号',
      subtitle: '全院诊室同步叫号与精准候诊时间预估',
      yourToken: '您的排队号码',
      currentServing: '当前叫号诊疗中',
      estimatedWait: '预计候诊时间',
      departmentWing: '科室与就诊诊区',
      roomNo: '诊室号',
      doctorOnDuty: '坐诊医生',
      statusWaiting: '候诊等待叫号',
      statusInProgress: '正在诊室就诊'
    }
  },

  // Japanese
  ja: {
    common: {
      back: '戻る',
      continue: '次へ',
      cancel: 'キャンセル',
      confirm: '確認',
      search: '検索',
      loading: '読み込み中...',
      default: 'デフォルト',
      language: '言語',
      selectLanguage: '言語を選択',
      selectLanguageSubtitle: 'CareFlow ヘルスケアポータルの希望言語を選択してください',
      applyLanguage: '言語を適用',
      searchLanguagePlaceholder: '言語を検索...',
      englishDefault: '英語 (デフォルト)',
      noLanguagesFound: '言語が見つかりません'
    },
    nav: {
      services: '医療サービス',
      doctors: '医師一覧',
      bookAppointment: '診療予約',
      checkIn: '来院チェックイン',
      liveQueue: 'リアルタイム順番待ち',
      myAppointments: '予約履歴',
      medicalHistory: '診療記録・カルテ',
      nearestHospitals: '近くの病院',
      emergencyAmbulance: '救急車要請',
      teleconsultation: 'オンライン診療',
      waitingTv: '待合室モニター',
      signIn: 'ログイン',
      register: '新規患者登録',
      logout: 'ログアウト',
      hospitalStaff: '病院スタッフ'
    },
    hub: {
      welcomeGreeting: 'CareFlow スマート医療へようこそ',
      subGreeting: 'AI臨床トリアージ、スマート診療予約、リアルタイム順番待ち案内',
      specialistCardTitle: '専門医を探す',
      specialistCardDesc: 'AIが症状を分析し、最適な診療科と専門医をマッチングします。',
      findSpecialistAction: '医師を探す',
      bookCardTitle: '診療を予約する',
      bookCardDesc: '待ち時間なしで電子受付番号と時間を即座に確保します。',
      bookSlotAction: '日時を予約',
      supportCardTitle: '緊急サポート・救急車',
      supportCardDesc: '108緊急通報と最寄りの救命救急センター連携。',
      supportAction: '救急要請',
      activeTokenBanner: '有効な受付番号',
      clickToViewToken: 'タップして受付番号の詳細を表示',
      viewTokenBadge: '番号を見る',
      quickHospitalActions: 'クイックメニュー',
      instantSelfService: 'セルフサービス',
      hospitalCheckIn: '来院チェックイン',
      arrivalVerification: '到着確認',
      liveQueueStatus: '待合室状況',
      waitTimesAndTurns: '予想待ち時間・現在のお呼び出し',
      hospitalNetwork: '病院ネットワーク',
      nearbyIcuOpd: 'ICU・外来診療科',
      myConsultations: '診察券一覧',
      bookedPasses: '予約済みチケット',
      directBookSlot: 'ダイレクト予約'
    },
    auth: {
      loginTitle: '患者ログイン',
      registerTitle: '新規患者カルテ作成',
      patientLogin: '携帯電話番号認証 (OTP)',
      staffLogin: '病院スタッフログイン',
      mobileNumber: '登録電話番号',
      giveOtp: 'ワンタイム暗証番号を取得',
      enterOtp: '6桁の認証番号を入力',
      verifyAndLogin: '認証してログイン',
      resendOtp: '再送する',
      fullName: '氏名（フルネーム）',
      email: 'メールアドレス',
      password: 'パスワード',
      age: '年齢',
      gender: '性別',
      bloodGroup: '血液型',
      allergies: 'アレルギー歴',
      medicalHistory: '既往歴・持病',
      medications: '現在服用中の薬',
      completeRegistration: '登録を完了して入る',
      autoFill: '自動入力',
      keepSignedIn: 'ログイン状態を維持',
      role: '役割'
    },
    mascot: {
      greeting: 'こんにちは！私は Dr. CareFlow AI です。本日のご体調はいかがですか？',
      helpPrompt: '症状のご相談、順番待ち状況、診療予約についてお気軽にご質問ください。',
      howCanIHelp: 'どのようなサポートが必要ですか？',
      suggestedTitle: 'おすすめの質問：',
      optionExplain: 'タップして解説を表示',
      quickTip: '医療ワンポイント：病院に到着されたら、まず受付チェックインを完了してください。',
      knowledgeBase: {
        'find doctor': {
          title: '専門医を探す',
          category: '医療トリアージ',
          description: '症状から最適な診療科と医師をAIが提案します。'
        },
        'book appointment': {
          title: '診察予約',
          category: '事前予約',
          description: '希望日時を選んで電子整理券を事前に発行します。'
        },
        'hospital check-in': {
          title: '来院受付',
          category: 'チェックイン',
          description: '病院到着を通知し、先生の呼出待ちリストへ入ります。'
        },
        'live queue status': {
          title: '呼出状況モニター',
          category: '順番確認',
          description: '現在の呼出番号と診察までの待ち時間をリアルタイム表示します。'
        },
        'emergency ambulance': {
          title: '救急要請 108',
          category: '緊急出動',
          description: 'GPS追跡による救急車の即時手配を行います。'
        },
        'sign in': {
          title: 'マイポータル',
          category: 'カルテ管理',
          description: '処方箋や過去の診療記録を安全に確認できます。'
        }
      }
    },
    triage: {
      title: 'AI臨床トリアージ・診療科マッチング',
      subtitle: '症状をわかりやすくご入力いただくと、AIが的確な診療科をご案内します',
      describeSymptoms: '自覚症状を入力',
      symptomPlaceholder: '例: 激しい頭痛、胸の圧迫感、38度以上の発熱...',
      severityLabel: '症状の重さ',
      mild: '軽度',
      moderate: '中等度',
      severe: '重度',
      commonSymptoms: 'よくある症状',
      analyzeButton: 'AI症状分析を開始',
      analyzingText: 'AIが臨床データを解析中...',
      confidenceScore: 'AI信頼度',
      recommendedSpecialist: '推奨される診療科・医師',
      bookConsultation: 'この内容で予約する'
    },
    queue: {
      title: 'リアルタイム外来呼出モニター',
      subtitle: '診察室と同期したリアルタイムお呼び出し案内',
      yourToken: 'あなたの受付番号',
      currentServing: '現在診察中の番号',
      estimatedWait: '診察までの待ち時間目安',
      departmentWing: '診療科・ブロック',
      roomNo: '診察室',
      doctorOnDuty: '担当医',
      statusWaiting: '呼出をお待ちください',
      statusInProgress: '診察中'
    }
  },

  // Korean
  ko: {
    common: {
      back: '뒤로',
      continue: '계속하기',
      cancel: '취소',
      confirm: '확인',
      search: '검색',
      loading: '로딩 중...',
      default: '기본값',
      language: '언어',
      selectLanguage: '언어 선택',
      selectLanguageSubtitle: 'CareFlow 의료 포털에서 사용할 언어를 선택하세요',
      applyLanguage: '언어 적용',
      searchLanguagePlaceholder: '언어 검색...',
      englishDefault: '영어 (기본값)',
      noLanguagesFound: '언어를 찾을 수 없습니다'
    },
    nav: {
      services: '진료 서비스',
      doctors: '의료진',
      bookAppointment: '진료 예약',
      checkIn: '병원 접수 (체크인)',
      liveQueue: '실시간 대기 현황',
      myAppointments: '나의 진료 예약',
      medicalHistory: '진료 및 처방 기록',
      nearestHospitals: '주변 병원',
      emergencyAmbulance: '응급 구급차',
      teleconsultation: '비대면 진료',
      waitingTv: '대기실 전광판',
      signIn: '로그인',
      register: '신규 환자 등록',
      logout: '로그아웃',
      hospitalStaff: '병원 의료진'
    },
    hub: {
      welcomeGreeting: 'CareFlow 스마트 헬스케어에 오신 것을 환영합니다',
      subGreeting: 'AI 임상 트리아지, 간편한 예약 및 실시간 대기 순번 알림',
      specialistCardTitle: '전문 의료진 상담',
      specialistCardDesc: 'AI 증상 분석을 통해 가장 적합한 전문 진료과를 추천합니다.',
      findSpecialistAction: '의사 찾기',
      bookCardTitle: '진료 예약하기',
      bookCardDesc: '대기 번호표와 진료 시간을 즉시 발급받으세요.',
      bookSlotAction: '시간 예약',
      supportCardTitle: '응급 서비스 & 구급차',
      supportCardDesc: '108 긴급 구조 및 가장 가까운 권역외상센터 연계.',
      supportAction: '응급 지원',
      activeTokenBanner: '진행 중인 진료 번호표',
      clickToViewToken: '대기 번호표 세부 정보를 보려면 클릭하세요',
      viewTokenBadge: '번호표 보기',
      quickHospitalActions: '병원 바로가기',
      instantSelfService: '스마트 셀프 서비스',
      hospitalCheckIn: '병원 도착 접수',
      arrivalVerification: '도착 확인',
      liveQueueStatus: '실시간 대기 순번',
      waitTimesAndTurns: '예상 대기 시간 및 현재 번호',
      hospitalNetwork: '협력 병원 네트워크',
      nearbyIcuOpd: '중환자실 및 외래 진료',
      myConsultations: '내 진료 내역',
      bookedPasses: '예약된 티켓',
      directBookSlot: '간편 예약'
    },
    auth: {
      loginTitle: '환자 로그인',
      registerTitle: '신규 환자 등록',
      patientLogin: '환자 휴대폰 번호 인증 (OTP)',
      staffLogin: '병원 의료진/직원',
      mobileNumber: '등록된 휴대폰 번호',
      giveOtp: '인증번호 받기 & 로그인',
      enterOtp: '6자리 인증번호를 입력하세요',
      verifyAndLogin: '인증 완료 및 입장',
      resendOtp: '인증번호 재전송',
      fullName: '환자 성명',
      email: '이메일 주소',
      password: '비밀번호',
      age: '연령',
      gender: '성별',
      bloodGroup: '혈액형',
      allergies: '알레르기 반응',
      medicalHistory: '과거 병력 및 기저질환',
      medications: '현재 복용 중인 약물',
      completeRegistration: '등록 완료하고 시작하기',
      autoFill: '자동 입력',
      keepSignedIn: '이 기기에서 로그인 상태 유지',
      role: '권한'
    },
    mascot: {
      greeting: '안녕하세요! 저는 Dr. CareFlow AI입니다. 오늘 어떤 도움이 필요하신가요?',
      helpPrompt: '증상 상담, 대기 순번 확인, 진료 예약에 대해 언제든 물어보세요.',
      howCanIHelp: '무엇을 도와드릴까요?',
      suggestedTitle: '추천 질문 목록:',
      optionExplain: '자세한 설명을 보려면 클릭하세요',
      quickTip: '의료 팁: 병원에 도착하시면 먼저 키오스크나 모바일로 접수를 완료해주세요.',
      knowledgeBase: {
        'find doctor': {
          title: '전문 의사 찾기',
          category: '의료 가이드',
          description: '증상에 맞춰 가장 적합한 전문의를 AI가 매칭합니다.'
        },
        'book appointment': {
          title: '진료 예약',
          category: '예약 서비스',
          description: '원하는 시간대를 선택하고 스마트 대기표를 발급받으세요.'
        },
        'hospital check-in': {
          title: '병원 도착 접수',
          category: '접수 확인',
          description: '병원에 도착했음을 알리고 담당 의사의 진료 목록에 등록됩니다.'
        },
        'live queue status': {
          title: '실시간 대기 순번',
          category: '대기실 모니터',
          description: '현재 진료 중인 번호와 내 차례까지 남은 시간을 확인하세요.'
        },
        'emergency ambulance': {
          title: '응급 구급차 108',
          category: '응급 이송',
          description: '실시간 GPS 추적으로 신속하게 구급차를 호출합니다.'
        },
        'sign in': {
          title: '환자 포털',
          category: '내 계정',
          description: '처방전 및 암호화된 진료 기록을 안전하게 확인하세요.'
        }
      }
    },
    triage: {
      title: 'AI 임상 트리아지 & 전문 진료과 매칭',
      subtitle: '현재 겪고 계신 증상을 편안하게 작성해주시면 AI가 진료과를 추천합니다',
      describeSymptoms: '증상 입력',
      symptomPlaceholder: '예: 심한 편두통, 가슴 통증, 고열 지속...',
      severityLabel: '증상 중증도',
      mild: '경증',
      moderate: '중등도',
      severe: '중증',
      commonSymptoms: '자주 호소하는 증상',
      analyzeButton: 'AI 증상 분석 시작',
      analyzingText: 'AI가 임상 데이터를 분석 중입니다...',
      confidenceScore: 'AI 신뢰도',
      recommendedSpecialist: '추천 진료과 및 전문의',
      bookConsultation: '진료 예약하기'
    },
    queue: {
      title: '실시간 외래 진료 대기열',
      subtitle: '진료실과 연동된 실시간 순번 호출 및 예상 대기 시간',
      yourToken: '나의 대기 번호',
      currentServing: '현재 진료 중인 번호',
      estimatedWait: '예상 대기 시간',
      departmentWing: '진료과 및 위치',
      roomNo: '진료실',
      doctorOnDuty: '담당 의료진',
      statusWaiting: '호출 대기 중',
      statusInProgress: '진료실 입장 / 진료 중'
    }
  },

  // Arabic (RTL)
  ar: {
    common: {
      back: 'رجوع',
      continue: 'متابعة',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      search: 'بحث',
      loading: 'جاري التحميل...',
      default: 'افتراضي',
      language: 'اللغة',
      selectLanguage: 'اختر اللغة',
      selectLanguageSubtitle: 'اختر لغتك المفضلة لبوابة CareFlow للرعاية الصحية',
      applyLanguage: 'تطبيق اللغة',
      searchLanguagePlaceholder: 'بحث عن لغة...',
      englishDefault: 'الإنجليزية (افتراضي)',
      noLanguagesFound: 'لم يتم العثور على لغات'
    },
    nav: {
      services: 'الخدمات',
      doctors: 'الأطباء',
      bookAppointment: 'حجز موعد',
      checkIn: 'تسجيل الوصول',
      liveQueue: 'قائمة الانتظار المباشرة',
      myAppointments: 'مواعيدي',
      medicalHistory: 'السجل الطبي',
      nearestHospitals: 'أقرب المستشفيات',
      emergencyAmbulance: 'إسعاف طوارئ',
      teleconsultation: 'استشارة عن بُعد',
      waitingTv: 'شاشة صالة الانتظار',
      signIn: 'تسجيل الدخول',
      register: 'إنشاء حساب جديد',
      logout: 'تسجيل الخروج',
      hospitalStaff: 'طاقم المستشفى'
    },
    hub: {
      welcomeGreeting: 'مرحباً بكم في كيرفلو للرعاية الصحية',
      subGreeting: 'الفرز الطبي الذكي، حجز المواعيد الفوري ومتابعة أدوار الانتظار مباشرة',
      specialistCardTitle: 'استشر طبيباً متخصصاً',
      specialistCardDesc: 'حلل أعراضك بواسطة الذكاء الاصطناعي وحدد القسم الطبي المناسب.',
      findSpecialistAction: 'ابحث عن طبيب',
      bookCardTitle: 'حجز موعد طبي',
      bookCardDesc: 'احصل على تذكرة الموعد الإلكترونية والوقت المحدد فوراً.',
      bookSlotAction: 'حجز وقت',
      supportCardTitle: 'الطوارئ والإسعاف',
      supportCardDesc: 'خدمة الإسعاف الطارئ 108 وأقرب مراكز علاج الإصابات.',
      supportAction: 'طلب المساعدة',
      activeTokenBanner: 'تذكرة الموعد الحالية',
      clickToViewToken: 'انقر لعرض تفاصيل التذكرة ورقم الدور',
      viewTokenBadge: 'عرض التذكرة',
      quickHospitalActions: 'إجراءات سريعة في المستشفى',
      instantSelfService: 'الخدمة الذاتية الفورية',
      hospitalCheckIn: 'تسجيل الوصول في المستشفى',
      arrivalVerification: 'تأكيد الحضور',
      liveQueueStatus: 'حالة الطابور المباشرة',
      waitTimesAndTurns: 'وقت الانتظار المتوقع ورقم الدور',
      hospitalNetwork: 'شبكة المستشفيات',
      nearbyIcuOpd: 'العناية المركزة والعيادات الخارجية',
      myConsultations: 'استشاراتي السابقة',
      bookedPasses: 'تذاكر المواعيد',
      directBookSlot: 'حجز فوري'
    },
    auth: {
      loginTitle: 'تسجيل دخول المريض',
      registerTitle: 'تسجيل مريض جديد',
      patientLogin: 'هاتف المريض (رمز OTP)',
      staffLogin: 'طاقم المستشفى',
      mobileNumber: 'رقم الهاتف المسجل',
      giveOtp: 'طلب الرمز وتسجيل الدخول',
      enterOtp: 'أدخل رمز التحقق المكون من 6 أرقام',
      verifyAndLogin: 'تأكيد الرمز والدخول للمنظومة',
      resendOtp: 'إعادة إرسال الرمز',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      age: 'العمر',
      gender: 'الجنس',
      bloodGroup: 'فصيلة الدم',
      allergies: 'الحساسية المعروفة',
      medicalHistory: 'التاريخ المرضي السابق',
      medications: 'الأدوية الحالية',
      completeRegistration: 'إتمام التسجيل والدخول',
      autoFill: 'ملء تلقائي',
      keepSignedIn: 'البقاء متصلاً على هذا الجهاز',
      role: 'الصفة'
    },
    mascot: {
      greeting: 'أهلاً بك! أنا الدكتور كيرفلو للذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟',
      helpPrompt: 'يمكنك سؤالي عن الأعراض المرضية، حالة الانتظار، أو حجز المواعيد.',
      howCanIHelp: 'كيف يمكنني خدمتك؟',
      suggestedTitle: 'إرشادات مقترحة:',
      optionExplain: 'انقر للتفاصيل',
      quickTip: 'نصيحة طبية: يرجى إتمام تسجيل الحضور فور وصولك إلى مبنى العيادات.',
      knowledgeBase: {
        'find doctor': {
          title: 'ابحث عن طبيب متخصص',
          category: 'الإرشاد الطبي',
          description: 'يحلل الذكاء الاصطناعي حالتك ويوجهك إلى الطبيب الأكثر كفاءة.'
        },
        'book appointment': {
          title: 'حجز موعد إلكتروني',
          category: 'المواعيد',
          description: 'اختر الطبيب واحصل على رقم دور رقمي مع موعد تقديري دقيق.'
        },
        'hospital check-in': {
          title: 'تسجيل الحضور بالمستشفى',
          category: 'تأكيد الوصول',
          description: 'أكد وصولك الفعلي إلى المستشفى لإخطار الطبيب باستعدادك للدخول.'
        },
        'live queue status': {
          title: 'شاشة الطابور المباشرة',
          category: 'متابعة الدور',
          description: 'تابع رقم الدور المنادى حالياً والوقت المتبقي حتى يحين دورك.'
        },
        'emergency ambulance': {
          title: 'إسعاف الطوارئ 108',
          category: 'خدمة عاجلة',
          description: 'توجيه سيارات الإسعاف بسرعة مع التتبع المباشر عبر نظام GPS.'
        },
        'sign in': {
          title: 'بوابة المريض',
          category: 'ملفي الطبي',
          description: 'تسجيل الدخول للاطلاع على الوصفات والتقارير الطبية المشفرة.'
        }
      }
    },
    triage: {
      title: 'الفرز السريري بالذكاء الاصطناعي وتحديد الاختصاص',
      subtitle: 'صف أعراضك الطبية بكلمات بسيطة للحصول على توجيه سريري فوري',
      describeSymptoms: 'أدخل الأعراض التي تشعر بها',
      symptomPlaceholder: 'مثال: صداع حاد مصحوب بألم في الصدر، ارتفاع درجة الحرارة...',
      severityLabel: 'شدة الأعراض',
      mild: 'طفيفة',
      moderate: 'متوسطة',
      severe: 'شديدة',
      commonSymptoms: 'أعراض شائعة',
      analyzeButton: 'تحليل الأعراض',
      analyzingText: 'الذكاء الاصطناعي يحلل الحالة...',
      confidenceScore: 'دقة التحليل الطبي',
      recommendedSpecialist: 'التخصص الطبي الموصى به',
      bookConsultation: 'تأكيد حجز الاستشارة'
    },
    queue: {
      title: 'شاشة العيادات الخارجية المباشرة',
      subtitle: 'نداء الأدوار في الوقت الفعلي والتوقيت التقديري لكل مريض',
      yourToken: 'رقم دورك',
      currentServing: 'الدور قيد الفحص الآن',
      estimatedWait: 'وقت الانتظار المتوقع',
      departmentWing: 'القسم والجناح',
      roomNo: 'غرفة الكشف',
      doctorOnDuty: 'الطبيب المعالج',
      statusWaiting: 'بانتظار النداء',
      statusInProgress: 'داخل عيادة الطبيب'
    }
  },

  // Vietnamese
  vi: {
    common: {
      back: 'Quay lại',
      continue: 'Tiếp tục',
      cancel: 'Hủy bỏ',
      confirm: 'Xác nhận',
      search: 'Tìm kiếm',
      loading: 'Đang tải...',
      default: 'Mặc định',
      language: 'Ngôn ngữ',
      selectLanguage: 'Chọn Ngôn ngữ',
      selectLanguageSubtitle: 'Chọn ngôn ngữ ưu tiên cho cổng y tế CareFlow',
      applyLanguage: 'Áp dụng Ngôn ngữ',
      searchLanguagePlaceholder: 'Tìm ngôn ngữ...',
      englishDefault: 'Tiếng Anh (Mặc định)',
      noLanguagesFound: 'Không tìm thấy ngôn ngữ'
    },
    nav: {
      services: 'Dịch vụ',
      doctors: 'Bác sĩ',
      bookAppointment: 'Đặt lịch khám',
      checkIn: 'Check-in Bệnh viện',
      liveQueue: 'Hàng chờ trực tiếp',
      myAppointments: 'Lịch hẹn của tôi',
      medicalHistory: 'Lịch sử bệnh án',
      nearestHospitals: 'Bệnh viện gần nhất',
      emergencyAmbulance: 'Xe cứu thương khẩn cấp',
      teleconsultation: 'Khám từ xa',
      waitingTv: 'Màn hình phòng chờ',
      signIn: 'Đăng nhập',
      register: 'Đăng ký',
      logout: 'Đăng xuất',
      hospitalStaff: 'Nhân viên y tế'
    },
    hub: {
      welcomeGreeting: 'Chào mừng đến với Y tế Thông minh CareFlow',
      subGreeting: 'Phân loại bệnh lâm sàng AI, đặt khám tức thì và theo dõi số thứ tự trực tiếp',
      specialistCardTitle: 'Khám với Bác sĩ Chuyên khoa',
      specialistCardDesc: 'AI phân tích triệu chứng để gợi ý đúng chuyên khoa và bác sĩ phù hợp.',
      findSpecialistAction: 'Tìm Bác sĩ',
      bookCardTitle: 'Đặt Lịch Khám Bệnh',
      bookCardDesc: 'Nhận số thứ tự khám điện tử và khung giờ khám ngay lập tức.',
      bookSlotAction: 'Chọn Khung Giờ',
      supportCardTitle: 'Hỗ trợ Khẩn cấp & Cấp cứu',
      supportCardDesc: 'Xe cấp cứu 108 và kết nối ngay với trung tâm chấn thương gần nhất.',
      supportAction: 'Gọi Cứu Hộ',
      activeTokenBanner: 'Phiếu Khám Đang Hoạt Động',
      clickToViewToken: 'Bấm để xem chi tiết số thứ tự khám',
      viewTokenBadge: 'Xem Số Khám',
      quickHospitalActions: 'Tiện ích Bệnh viện',
      instantSelfService: 'Tự phục vụ Nhanh',
      hospitalCheckIn: 'Check-in Bệnh viện',
      arrivalVerification: 'Xác nhận đã đến',
      liveQueueStatus: 'Trạng thái Hàng chờ',
      waitTimesAndTurns: 'Thời gian chờ & Số đang khám',
      hospitalNetwork: 'Mạng lưới Bệnh viện',
      nearbyIcuOpd: 'Hồi sức cấp cứu & Khám ngoại trú',
      myConsultations: 'Lịch sử Khám',
      bookedPasses: 'Phiếu Đã Đặt',
      directBookSlot: 'Đặt Khám Nhanh'
    },
    auth: {
      loginTitle: 'Đăng nhập Bệnh nhân',
      registerTitle: 'Đăng ký Hồ sơ Bệnh nhân',
      patientLogin: 'Số điện thoại Bệnh nhân (OTP)',
      staffLogin: 'Nhân viên Bệnh viện',
      mobileNumber: 'Số điện thoại đã đăng ký',
      giveOtp: 'Nhận mã OTP & Đăng nhập',
      enterOtp: 'Nhập mã OTP gồm 6 chữ số',
      verifyAndLogin: 'Xác thực OTP & Vào Hệ thống',
      resendOtp: 'Gửi lại mã OTP',
      fullName: 'Họ và tên bệnh nhân',
      email: 'Địa chỉ Email',
      password: 'Mật khẩu',
      age: 'Tuổi',
      gender: 'Giới tính',
      bloodGroup: 'Nhóm máu',
      allergies: 'Tiền sử dị ứng',
      medicalHistory: 'Bệnh lý nền trước đây',
      medications: 'Thuốc đang sử dụng',
      completeRegistration: 'Hoàn tất Đăng ký',
      autoFill: 'Tự động điền',
      keepSignedIn: 'Duy trì đăng nhập trên thiết bị này',
      role: 'Vai trò'
    },
    mascot: {
      greeting: 'Xin chào! Tôi là Bác sĩ AI CareFlow. Tôi có thể giúp gì cho sức khỏe của bạn hôm nay?',
      helpPrompt: 'Hãy hỏi tôi về triệu chứng, tình trạng hàng đợi hoặc cách đặt lịch khám.',
      howCanIHelp: 'Tôi có thể hỗ trợ gì cho bạn?',
      suggestedTitle: 'Chủ đề gợi ý:',
      optionExplain: 'Bấm để xem chi tiết',
      quickTip: 'Lời khuyên y tế: Hãy thực hiện check-in ngay khi đến sảnh bệnh viện.',
      knowledgeBase: {
        'find doctor': {
          title: 'Tìm Bác sĩ Chuyên khoa',
          category: 'Định hướng Y tế',
          description: 'AI đối chiếu triệu chứng và giới thiệu chuyên gia y tế phù hợp nhất.'
        },
        'book appointment': {
          title: 'Đặt Lịch Khám Bệnh',
          category: 'Đặt chỗ',
          description: 'Lựa chọn bác sĩ và lấy số thứ tự điện tử cùng giờ khám dự kiến.'
        },
        'hospital check-in': {
          title: 'Check-in Đến Viện',
          category: 'Xác nhận',
          description: 'Xác nhận bạn đã có mặt tại phòng chờ để bác sĩ chuẩn bị thăm khám.'
        },
        'live queue status': {
          title: 'Theo dõi Hàng chờ Trực tiếp',
          category: 'Theo dõi thời gian thực',
          description: 'Xem số đang được gọi vào khám và thời gian ước tính đến lượt bạn.'
        },
        'emergency ambulance': {
          title: 'Cấp cứu 108',
          category: 'Cấp cứu',
          description: 'Điều phối xe cứu thương khẩn cấp với định vị GPS trực tiếp.'
        },
        'sign in': {
          title: 'Cổng Bệnh nhân',
          category: 'Tài khoản',
          description: 'Đăng nhập để xem đơn thuốc và hồ sơ bệnh án được bảo mật.'
        }
      }
    },
    triage: {
      title: 'Phân loại Lâm sàng AI & Kết nối Chuyên gia',
      subtitle: 'Mô tả triệu chứng bằng lời tự nhiên để nhận khuyến nghị y khoa tức thì',
      describeSymptoms: 'Khai báo Triệu chứng',
      symptomPlaceholder: 'ví dụ: đau đầu dữ dội, tức ngực khó thở, sốt cao...',
      severityLabel: 'Mức độ Nghiêm trọng',
      mild: 'Nhẹ',
      moderate: 'Vừa phải',
      severe: 'Nghiêm trọng',
      commonSymptoms: 'Triệu chứng Thường gặp',
      analyzeButton: 'Phân tích Triệu chứng',
      analyzingText: 'AI đang phân tích dữ liệu lâm sàng...',
      confidenceScore: 'Độ tin cậy AI',
      recommendedSpecialist: 'Chuyên khoa Đề xuất',
      bookConsultation: 'Đặt Khám Ngay'
    },
    queue: {
      title: 'Hàng chờ Khám Ngoại trú Trực tiếp',
      subtitle: 'Đồng bộ hóa gọi số thứ tự và thời gian chờ ước tính',
      yourToken: 'Số Khám của Bạn',
      currentServing: 'Đang Khám Số',
      estimatedWait: 'Thời gian Chờ Ước tính',
      departmentWing: 'Khoa & Khu vực',
      roomNo: 'Phòng khám',
      doctorOnDuty: 'Bác sĩ Phụ trách',
      statusWaiting: 'Đang chờ gọi tên',
      statusInProgress: 'Đang trong phòng khám'
    }
  },

  // Indonesian
  id: {
    common: {
      back: 'Kembali',
      continue: 'Lanjutkan',
      cancel: 'Batal',
      confirm: 'Konfirmasi',
      search: 'Cari',
      loading: 'Memuat...',
      default: 'Default',
      language: 'Bahasa',
      selectLanguage: 'Pilih Bahasa',
      selectLanguageSubtitle: 'Pilih bahasa preferensi Anda untuk portal CareFlow Healthcare',
      applyLanguage: 'Terapkan Bahasa',
      searchLanguagePlaceholder: 'Cari bahasa...',
      englishDefault: 'Inggris (Default)',
      noLanguagesFound: 'Bahasa tidak ditemukan'
    },
    nav: {
      services: 'Layanan',
      doctors: 'Dokter',
      bookAppointment: 'Buat Janji Temu',
      checkIn: 'Check-In Rumah Sakit',
      liveQueue: 'Antrean Langsung',
      myAppointments: 'Janji Temu Saya',
      medicalHistory: 'Riwayat Medis',
      nearestHospitals: 'Rumah Sakit Terdekat',
      emergencyAmbulance: 'Ambulans Darurat',
      teleconsultation: 'Telekonsultasi',
      waitingTv: 'Layar Ruang Tunggu',
      signIn: 'Masuk',
      register: 'Daftar Akun',
      logout: 'Keluar',
      hospitalStaff: 'Staf Rumah Sakit'
    },
    hub: {
      welcomeGreeting: 'Selamat Datang di CareFlow Healthcare',
      subGreeting: 'Triase klinis AI cerdas, pendaftaran dokter cepat dan pantauan antrean langsung',
      specialistCardTitle: 'Konsultasi Dokter Spesialis',
      specialistCardDesc: 'Analisis gejala Anda dengan AI dan temukan dokter spesialis yang tepat.',
      findSpecialistAction: 'Cari Dokter',
      bookCardTitle: 'Pesan Janji Temu',
      bookCardDesc: 'Dapatkan nomor antrean digital dan jam periksa secara instan.',
      bookSlotAction: 'Pilih Jam Janji Temu',
      supportCardTitle: 'Layanan Darurat & Ambulans',
      supportCardDesc: 'Bantuan darurat 108 dan rujukan cepat ke pusat trauma terdekat.',
      supportAction: 'Panggil Bantuan',
      activeTokenBanner: 'Tiket Antrean Aktif',
      clickToViewToken: 'Klik untuk melihat rincian tiket antrean Anda',
      viewTokenBadge: 'Lihat Tiket',
      quickHospitalActions: 'Menu Cepat Rumah Sakit',
      instantSelfService: 'Layanan Mandiri',
      hospitalCheckIn: 'Check-In di Rumah Sakit',
      arrivalVerification: 'Konfirmasi Kedatangan',
      liveQueueStatus: 'Status Antrean Langsung',
      waitTimesAndTurns: 'Estimasi Waktu Tunggu & Nomor Giliran',
      hospitalNetwork: 'Jaringan Rumah Sakit',
      nearbyIcuOpd: 'IGD & Poliklinik',
      myConsultations: 'Riwayat Konsultasi',
      bookedPasses: 'Tiket Terjadwal',
      directBookSlot: 'Pendaftaran Langsung'
    },
    auth: {
      loginTitle: 'Masuk Pasien',
      registerTitle: 'Pendaftaran Pasien Baru',
      patientLogin: 'Nomor Ponsel Pasien (OTP)',
      staffLogin: 'Staf Medis / Dokter',
      mobileNumber: 'Nomor Ponsel Terdaftar',
      giveOtp: 'Minta Kode OTP & Masuk',
      enterOtp: 'Masukkan 6 digit kode OTP',
      verifyAndLogin: 'Verifikasi & Masuk ke Portal',
      resendOtp: 'Kirim Ulang OTP',
      fullName: 'Nama Lengkap Pasien',
      email: 'Alamat Email',
      password: 'Kata Sandi',
      age: 'Usia',
      gender: 'Jenis Kelamin',
      bloodGroup: 'Golongan Darah',
      allergies: 'Riwayat Alergi',
      medicalHistory: 'Riwayat Penyakit Dahulu',
      medications: 'Obat yang Sedang Dikonsumsi',
      completeRegistration: 'Selesaikan Pendaftaran',
      autoFill: 'Isi Otomatis',
      keepSignedIn: 'Tetap masuk di perangkat ini',
      role: 'Peran'
    },
    mascot: {
      greeting: 'Halo! Saya Dokter CareFlow AI. Ada yang bisa saya bantu hari ini?',
      helpPrompt: 'Tanyakan kepada saya tentang gejala penyakit, status antrean, atau jadwal dokter.',
      howCanIHelp: 'Bagaimana saya bisa membantu Anda?',
      suggestedTitle: 'Pertanyaan yang Disarankan:',
      optionExplain: 'Klik untuk membaca penjelasan',
      quickTip: 'Tips Medis: Lakukan konfirmasi check-in begitu Anda tiba di rumah sakit.',
      knowledgeBase: {
        'find doctor': {
          title: 'Cari Dokter Spesialis',
          category: 'Panduan Medis',
          description: 'AI menganalisis keluhan Anda dan merekomendasikan dokter terbaik.'
        },
        'book appointment': {
          title: 'Daftar Janji Temu',
          category: 'Pendaftaran',
          description: 'Pilih jadwal dan dapatkan tiket antrean digital dengan jam estimasi.'
        },
        'hospital check-in': {
          title: 'Check-In Rumah Sakit',
          category: 'Konfirmasi',
          description: 'Konfirmasikan kehadiran Anda agar dokter tahu Anda sudah siap di ruang tunggu.'
        },
        'live queue status': {
          title: 'Status Antrean Langsung',
          category: 'Monitor Real-Time',
          description: 'Ketahui nomor yang sedang diperiksa dan perkiraan waktu giliran Anda.'
        },
        'emergency ambulance': {
          title: 'Ambulans Darurat 108',
          category: 'Layanan Darurat',
          description: 'Penugasan ambulans cepat dengan pelacakan lokasi GPS langsung.'
        },
        'sign in': {
          title: 'Portal Pasien',
          category: 'Akses Akun',
          description: 'Masuk untuk melihat resep obat, jadwal, dan rekam medis terenkripsi.'
        }
      }
    },
    triage: {
      title: 'Triase Klinis AI & Pencocokan Spesialis',
      subtitle: 'Tuliskan keluhan Anda dengan bahasa sehari-hari untuk saran medis langsung',
      describeSymptoms: 'Laporkan Gejala Anda',
      symptomPlaceholder: 'contoh: sakit kepala hebat, dada terasa tertekan, demam tinggi...',
      severityLabel: 'Tingkat Keparahan',
      mild: 'Ringan',
      moderate: 'Sedang',
      severe: 'Parah',
      commonSymptoms: 'Gejala Umum',
      analyzeButton: 'Analisis Gejala',
      analyzingText: 'AI sedang menganalisis data klinis...',
      confidenceScore: 'Tingkat Kepercayaan AI',
      recommendedSpecialist: 'Dokter Spesialis Rekomendasi',
      bookConsultation: 'Buat Janji Sekarang'
    },
    queue: {
      title: 'Antrean Poliklinik Real-Time',
      subtitle: 'Panggilan nomor antrean tersinkronisasi dan perkiraan waktu tunggu',
      yourToken: 'Nomor Antrean Anda',
      currentServing: 'Sedang Diperiksa',
      estimatedWait: 'Estimasi Waktu Tunggu',
      departmentWing: 'Departemen & Sayap',
      roomNo: 'Ruang Praktik',
      doctorOnDuty: 'Dokter yang Bertugas',
      statusWaiting: 'Menunggu Panggilan',
      statusInProgress: 'Sedang Berkonsultasi'
    }
  },

  // Thai
  th: {
    common: {
      back: 'ย้อนกลับ',
      continue: 'ดำเนินการต่อ',
      cancel: 'ยกเลิก',
      confirm: 'ยืนยัน',
      search: 'ค้นหา',
      loading: 'กำลังโหลด...',
      default: 'ค่าเริ่มต้น',
      language: 'ภาษา',
      selectLanguage: 'เลือกภาษา',
      selectLanguageSubtitle: 'เลือกภาษาที่คุณต้องการสำหรับระบบ CareFlow',
      applyLanguage: 'นำภาษาไปใช้',
      searchLanguagePlaceholder: 'ค้นหาภาษา...',
      englishDefault: 'อังกฤษ (ค่าเริ่มต้น)',
      noLanguagesFound: 'ไม่พบภาษา'
    },
    nav: {
      services: 'บริการ',
      doctors: 'แพทย์',
      bookAppointment: 'นัดหมายแพทย์',
      checkIn: 'เช็คอินโรงพยาบาล',
      liveQueue: 'คิวสดออนไลน์',
      myAppointments: 'การนัดหมายของฉัน',
      medicalHistory: 'ประวัติการรักษา',
      nearestHospitals: 'โรงพยาบาลใกล้เคียง',
      emergencyAmbulance: 'รถพยาบาลฉุกเฉิน',
      teleconsultation: 'พบแพทย์ออนไลน์',
      waitingTv: 'จอห้องรอตรวจ',
      signIn: 'เข้าสู่ระบบ',
      register: 'ลงทะเบียนผู้ป่วย',
      logout: 'ออกจากระบบ',
      hospitalStaff: 'เจ้าหน้าที่โรงพยาบาล'
    },
    hub: {
      welcomeGreeting: 'ยินดีต้อนรับสู่ CareFlow Healthcare',
      subGreeting: 'ระบบคัดกรองอาการด้วย AI จองคิวตรวจ และติดตามคิวแบบเรียลไทม์',
      specialistCardTitle: 'ปรึกษาแพทย์เฉพาะทาง',
      specialistCardDesc: 'วิเคราะห์อาการด้วย AI เพื่อแนะนำแผนกและแพทย์ที่ตรงกับอาการของคุณที่สุด',
      findSpecialistAction: 'ค้นหาแพทย์',
      bookCardTitle: 'จองคิวนัดหมายแพทย์',
      bookCardDesc: 'รับหมายเลขคิวอิเล็กทรอนิกส์และช่วงเวลานัดตรวจได้ทันที',
      bookSlotAction: 'เลือกเวลานัด',
      supportCardTitle: 'สายด่วนฉุกเฉิน & รถพยาบาล',
      supportCardDesc: 'บริการรถพยาบาลฉุกเฉิน 108 และศูนย์อุบัติเหตุใกล้บ้านคุณ',
      supportAction: 'ขอความช่วยเหลือ',
      activeTokenBanner: 'บัตรคิวที่กำลังใช้งาน',
      clickToViewToken: 'คลิกเพื่อดูรายละเอียดหมายเลขคิวของคุณ',
      viewTokenBadge: 'ดูบัตรคิว',
      quickHospitalActions: 'เมนูลัดโรงพยาบาล',
      instantSelfService: 'บริการตนเองด่วน',
      hospitalCheckIn: 'เช็คอินโรงพยาบาล',
      arrivalVerification: 'ยืนยันการมาถึง',
      liveQueueStatus: 'สถานะคิวตรวจสด',
      waitTimesAndTurns: 'เวลารอโดยประมาณ & คิวปัจจุบัน',
      hospitalNetwork: 'เครือข่ายโรงพยาบาล',
      nearbyIcuOpd: 'แผนกฉุกเฉิน & แผนกผู้ป่วยนอก',
      myConsultations: 'ประวัติการตรวจ',
      bookedPasses: 'บัตรนัดที่จองไว้',
      directBookSlot: 'จองคิวด่วน'
    },
    auth: {
      loginTitle: 'เข้าสู่ระบบผู้ป่วย',
      registerTitle: 'ลงทะเบียนผู้ป่วยใหม่',
      patientLogin: 'เบอร์มือถือผู้ป่วย (รหัส OTP)',
      staffLogin: 'บุคลากรทางการแพทย์',
      mobileNumber: 'หมายเลขโทรศัพท์มือถือที่ลงทะเบียน',
      giveOtp: 'ขอรับรหัส OTP & เข้าสู่ระบบ',
      enterOtp: 'กรอกรหัส OTP 6 หลัก',
      verifyAndLogin: 'ยืนยันรหัส & เข้าสู่ระบบ',
      resendOtp: 'ส่งรหัสอีกครั้ง',
      fullName: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      age: 'อายุ',
      gender: 'เพศ',
      bloodGroup: 'หมู่เลือด',
      allergies: 'ประวัติแพ้ยา / แพ้อาหาร',
      medicalHistory: 'โรคประจำตัวหรือการผ่าตัดในอดีต',
      medications: 'ยาที่กำลังรับประทานอยู่',
      completeRegistration: 'ลงทะเบียนให้เสร็จสิ้น',
      autoFill: 'กรอกอัตโนมัติ',
      keepSignedIn: 'คงการเข้าสู่ระบบไว้บนอุปกรณ์นี้',
      role: 'สถานะ'
    },
    mascot: {
      greeting: 'สวัสดีครับ! ผมคือ ดร. CareFlow AI มีเรื่องสุขภาพอะไรให้ผมช่วยดูแลวันนี้ไหมครับ?',
      helpPrompt: 'สอบถามเรื่องอาการป่วย คิวตรวจ หรือการจองนัดหมายแพทย์ได้เลยครับ',
      howCanIHelp: 'ผมสามารถช่วยเหลืออะไรคุณได้บ้าง?',
      suggestedTitle: 'คำถามที่พบบ่อย:',
      optionExplain: 'คลิกเพื่อดูคำอธิบาย',
      quickTip: 'เคล็ดลับสุขภาพ: เมื่อเดินทางมาถึงโรงพยาบาลแล้ว กรุณากดเช็คอินทันทีเพื่อยืนยันคิวตรวจ',
      knowledgeBase: {
        'find doctor': {
          title: 'ค้นหาแพทย์เฉพาะทาง',
          category: 'คำแนะนำการแพทย์',
          description: 'AI ช่วยประเมินอาการและแนะนำแพทย์ผู้เชี่ยวชาญที่เหมาะสม'
        },
        'book appointment': {
          title: 'จองคิวตรวจ',
          category: 'การจองนัด',
          description: 'เลือกแพทย์และรับบัตรคิวดิจิทัลพร้อมเวลานัดหมายล่วงหน้า'
        },
        'hospital check-in': {
          title: 'เช็คอินที่โรงพยาบาล',
          category: 'ยืนยันตัวตน',
          description: 'ยืนยันว่าคุณมาถึงแล้วเพื่อให้แพทย์และพยาบาลเตรียมพร้อมตรวจ'
        },
        'live queue status': {
          title: 'สถานะคิวตรวจแบบสด',
          category: 'ติดตามคิว',
          description: 'ตรวจสอบคิวที่กำลังตรวจและเวลาที่ต้องรอแบบเรียลไทม์'
        },
        'emergency ambulance': {
          title: 'รถพยาบาลฉุกเฉิน 108',
          category: 'เหตุฉุกเฉิน',
          description: 'เรียกรถพยาบาลฉุกเฉินพร้อมระบบติดตามพิกัด GPS ทันที'
        },
        'sign in': {
          title: 'ระบบผู้ป่วย',
          category: 'บัญชีผู้ใช้',
          description: 'เข้าสู่ระบบเพื่อดูใบสั่งยาและประวัติการรักษาที่ปลอดภัย'
        }
      }
    },
    triage: {
      title: 'ระบบคัดกรองอาการ AI & จับคู่แพทย์เฉพาะทาง',
      subtitle: 'บอกเล่าอาการของคุณด้วยภาษาทั่วไปเพื่อรับคำแนะนำเบื้องต้นทันที',
      describeSymptoms: 'ระบุอาการของคุณ',
      symptomPlaceholder: 'เช่น ปวดศีรษะรุนแรง แน่นหน้าอก หายใจไม่อิ่ม มีไข้สูง...',
      severityLabel: 'ระดับความรุนแรง',
      mild: 'เล็กน้อย',
      moderate: 'ปานกลาง',
      severe: 'รุนแรง',
      commonSymptoms: 'อาการที่พบบ่อย',
      analyzeButton: 'เริ่มวิเคราะห์อาการ',
      analyzingText: 'AI กำลังประมวลผลข้อมูลการรักษา...',
      confidenceScore: 'ความแม่นยำของ AI',
      recommendedSpecialist: 'แพทย์เฉพาะทางที่แนะนำ',
      bookConsultation: 'จองคิวตรวจตอนนี้'
    },
    queue: {
      title: 'คิวตรวจผู้ป่วยนอกสด (OPD Live Queue)',
      subtitle: 'ระบบเรียกคิวตรวจเชื่อมต่อกับห้องตรวจโดยตรง พร้อมประเมินเวลารอ',
      yourToken: 'หมายเลขคิวของคุณ',
      currentServing: 'กำลังตรวจคิวที่',
      estimatedWait: 'เวลารอโดยประมาณ',
      departmentWing: 'แผนกและอาคาร',
      roomNo: 'ห้องตรวจ',
      doctorOnDuty: 'แพทย์ผู้ตรวจ',
      statusWaiting: 'กำลังรอเรียกตรวจ',
      statusInProgress: 'กำลังพบแพทย์ในห้องตรวจ'
    }
  }
};
