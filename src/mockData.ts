import { Student, LessonTopic, YearlyPlanWeek, Badge, TeacherProfile } from './types';

export const initialTeacher: TeacherProfile = {
  name: 'Sevgi Demir',
  title: 'Uzman Öğretmen',
  department: 'Sosyal Bilgiler & Matematik Zümre Başkanı',
  school: 'SOS-MAT Bilim ve Sanat Akademisi',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
  selectedBranch: '6-A',
  branches: ['6-A', '6-B', '7-A', '7-B'],
};

export const badgesList: Badge[] = [
  {
    id: 'b1',
    name: 'Matematik Kurdu',
    title: 'Sayıların Efendisi',
    description: 'Matematik konu anlatımlarının %80\'ini ve 5 ödevi eksiksiz tamamladı.',
    iconName: 'Calculator',
    category: 'matematik',
    rarity: 'altin',
    xpRequired: 500,
    isUnlocked: true,
    unlockedAt: '15 Mart 2026',
  },
  {
    id: 'b2',
    name: 'Tarih Kaşifi',
    title: 'Medeniyetlerin İzinde',
    description: 'Sosyal Bilgiler ilk medeniyetler ve kültür mirası etkinliklerini bitirdi.',
    iconName: 'Compass',
    category: 'sosyal',
    rarity: 'altin',
    xpRequired: 450,
    isUnlocked: true,
    unlockedAt: '18 Mart 2026',
  },
  {
    id: 'b3',
    name: 'Lazer Odak',
    title: 'Aktif İzleme Şampiyonu',
    description: 'Video izlerken %95 üzerinde dikkat ve aktif odak puanına ulaştı.',
    iconName: 'Eye',
    category: 'odak',
    rarity: 'gumus',
    xpRequired: 300,
    isUnlocked: true,
    unlockedAt: '22 Mart 2026',
  },
  {
    id: 'b4',
    name: 'Ödev Canavarı',
    title: 'Zamanında ve Kusursuz',
    description: 'Son 4 haftadaki tüm ödevleri gününden önce teslim etti.',
    iconName: 'CheckCircle2',
    category: 'odev',
    rarity: 'bronz',
    xpRequired: 200,
    isUnlocked: true,
    unlockedAt: '25 Mart 2026',
  },
  {
    id: 'b5',
    name: 'Harita Fatihi',
    title: 'Coğrafya Dehası',
    description: 'Harita ve coğrafya oyununda 1000 puana ulaştı.',
    iconName: 'MapPin',
    category: 'sosyal',
    rarity: 'gumus',
    xpRequired: 400,
    isUnlocked: false,
  },
  {
    id: 'b6',
    name: 'Açı Ustası',
    title: 'Geometri Uzmanı',
    description: 'Açı Avcısı ve Geometri Lab etkinliğinde sıfır hatayla seviyeyi geçti.',
    iconName: 'Shapes',
    category: 'matematik',
    rarity: 'altin',
    xpRequired: 600,
    isUnlocked: false,
  },
  {
    id: 'b7',
    name: 'Sıfır Devamsızlık',
    title: 'Dersin Direği',
    description: 'Tüm dönem boyunca sıfır devamsızlık ve tam katılım gösterdi.',
    iconName: 'Award',
    category: 'devam',
    rarity: 'altin',
    xpRequired: 500,
    isUnlocked: true,
    unlockedAt: '20 Mart 2026',
  },
  {
    id: 'b8',
    name: 'Sos-Mat Efsanesi',
    title: 'Büyük Bilge',
    description: '10. Seviyeye ulaşarak tüm Sosyal ve Matematik alanlarını fethetti.',
    iconName: 'Crown',
    category: 'seviye',
    rarity: 'efsane',
    xpRequired: 2500,
    isUnlocked: false,
  },
];

export const sampleStudents: Student[] = [
  {
    id: 'stu-1',
    name: 'Ahmet Yılmaz',
    studentNumber: '601',
    classGrade: '6-A',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    level: 4,
    levelTitle: 'Kaşif Matematikçi',
    xp: 840,
    nextLevelXp: 1200,
    dailyStreak: 6,
    totalSchoolDays: 78,
    attendedDays: 76,
    absentDays: 1,
    excusedDays: 1,
    attendanceHistory: [
      { date: '2026-03-27', type: 'mevcut', subject: 'Matematik & Sosyal' },
      { date: '2026-03-26', type: 'mevcut', subject: 'Matematik & Sosyal' },
      { date: '2026-03-25', type: 'mevcut', subject: 'Sosyal Bilgiler' },
      { date: '2026-03-24', type: 'mazeretli', reason: 'Sağlık Raporu - Diş Tedavisi' },
      { date: '2026-03-21', type: 'mevcut', subject: 'Matematik' },
      { date: '2026-03-14', type: 'tam', reason: 'Mazeretsiz Devamsızlık' },
    ],
    totalVideoWatchMinutes: 342,
    todayWatchMinutes: 38,
    activeFocusScore: 94,
    videoCompletionRate: 88,
    lastWatchedTopicId: 'm1',
    weeklyWatchHistory: [
      { day: 'Pzt', minutes: 45, activeFocusRate: 92 },
      { day: 'Sal', minutes: 60, activeFocusRate: 96 },
      { day: 'Çar', minutes: 30, activeFocusRate: 88 },
      { day: 'Per', minutes: 55, activeFocusRate: 95 },
      { day: 'Cum', minutes: 70, activeFocusRate: 98 },
      { day: 'Cmt', minutes: 44, activeFocusRate: 90 },
      { day: 'Paz', minutes: 38, activeFocusRate: 94 },
    ],
    mathSuccessRate: 92,
    socialSuccessRate: 89,
    overallSuccessRate: 91,
    homeworks: [
      {
        id: 'hw-1',
        title: 'Rasyonel Sayılarla Dört İşlem Alıştırmaları',
        subject: 'matematik',
        unit: '2. Ünite: Rasyonel Sayılar',
        assignedDate: '2026-03-22',
        dueDate: '2026-03-28',
        status: 'tamamlandi',
        score: 95,
        maxScore: 100,
        feedback: 'İşlemler çok düzenli yapılmış, sadece 4. sorudaki sadeleştirmeye dikkat edilmeli.',
        description: 'Ders kitabındaki sayfa 84-86 arasındaki 15 soruluk test ve problem çözümü.',
      },
      {
        id: 'hw-2',
        title: 'İpek Yolu ve İlk Türk Devletleri Harita Çizimi',
        subject: 'sosyal',
        unit: '3. Ünite: İpek Yolunda Türkler',
        assignedDate: '2026-03-24',
        dueDate: '2026-03-30',
        status: 'bekliyor',
        maxScore: 100,
        description: 'Tarihi ticaret yollarının geçtiği coğrafyaları renklendirerek önemli durakları işaretleyiniz.',
      },
      {
        id: 'hw-3',
        title: 'Cebirsel İfadelerde Sadeleştirme & Modelleme',
        subject: 'matematik',
        unit: '3. Ünite: Cebirsel İfadeler',
        assignedDate: '2026-03-18',
        dueDate: '2026-03-23',
        status: 'tamamlandi',
        score: 100,
        maxScore: 100,
        feedback: 'Kusursuz çalışma! Tebrikler Ahmet.',
        description: 'Verilen cebirsel karo modellerine uygun ifadeleri yazıp çarpanlara ayırınız.',
      },
      {
        id: 'hw-4',
        title: 'Türkiye\'nin İklim Tipleri ve Bitki Örtüsü Araştırması',
        subject: 'sosyal',
        unit: '2. Ünite: Ülkemizin Coğrafyası',
        assignedDate: '2026-03-10',
        dueDate: '2026-03-16',
        status: 'tamamlandi',
        score: 88,
        maxScore: 100,
        feedback: 'Karadeniz ve Akdeniz iklimi çok güzel özetlenmiş, Karasal iklim biraz daha detaylandırılabilirdi.',
        description: '3 temel iklim tipinin insan yaşamına ve tarıma etkilerini açıklayınız.',
      },
    ],
    unlockedBadgeIds: ['b1', 'b2', 'b3', 'b4', 'b7'],
    competencies: {
      problemSolving: 94,
      logicalReasoning: 90,
      historicalEmpathy: 88,
      mapLiteracy: 86,
      classParticipation: 95,
      homeworkDiscipline: 96,
    },
    gameHighScores: {
      matRoket: 1450,
      tarihDedektifi: 1280,
      aciAvcisi: 980,
      haritaFatihi: 890,
      bilgiCarki: 1620,
    },
  },
  {
    id: 'stu-2',
    name: 'Zeynep Kaya',
    studentNumber: '608',
    classGrade: '6-A',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    level: 5,
    levelTitle: 'Sosyal Bilgiler Dehası',
    xp: 1350,
    nextLevelXp: 1800,
    dailyStreak: 12,
    totalSchoolDays: 78,
    attendedDays: 78,
    absentDays: 0,
    excusedDays: 0,
    attendanceHistory: [
      { date: '2026-03-27', type: 'mevcut', subject: 'Matematik & Sosyal' },
      { date: '2026-03-26', type: 'mevcut', subject: 'Matematik & Sosyal' },
      { date: '2026-03-25', type: 'mevcut', subject: 'Sosyal Bilgiler' },
      { date: '2026-03-24', type: 'mevcut', subject: 'Matematik & Sosyal' },
    ],
    totalVideoWatchMinutes: 480,
    todayWatchMinutes: 52,
    activeFocusScore: 98,
    videoCompletionRate: 96,
    lastWatchedTopicId: 's1',
    weeklyWatchHistory: [
      { day: 'Pzt', minutes: 65, activeFocusRate: 98 },
      { day: 'Sal', minutes: 80, activeFocusRate: 97 },
      { day: 'Çar', minutes: 70, activeFocusRate: 99 },
      { day: 'Per', minutes: 75, activeFocusRate: 98 },
      { day: 'Cum', minutes: 85, activeFocusRate: 100 },
      { day: 'Cmt', minutes: 55, activeFocusRate: 96 },
      { day: 'Paz', minutes: 50, activeFocusRate: 98 },
    ],
    mathSuccessRate: 95,
    socialSuccessRate: 98,
    overallSuccessRate: 97,
    homeworks: [
      {
        id: 'hw-1',
        title: 'Rasyonel Sayılarla Dört İşlem Alıştırmaları',
        subject: 'matematik',
        unit: '2. Ünite: Rasyonel Sayılar',
        assignedDate: '2026-03-22',
        dueDate: '2026-03-28',
        status: 'tamamlandi',
        score: 100,
        maxScore: 100,
        feedback: 'Harika bir çözüm mantığı!',
        description: 'Ders kitabındaki sayfa 84-86 arasındaki 15 soruluk test.',
      },
      {
        id: 'hw-2',
        title: 'İpek Yolu ve İlk Türk Devletleri Harita Çizimi',
        subject: 'sosyal',
        unit: '3. Ünite: İpek Yolunda Türkler',
        assignedDate: '2026-03-24',
        dueDate: '2026-03-30',
        status: 'tamamlandi',
        score: 98,
        maxScore: 100,
        feedback: 'Renkler ve tarihi notlar çok zenginleştirilmiş.',
        description: 'Tarihi ticaret yollarının geçtiği coğrafyaları renklendiriniz.',
      },
    ],
    unlockedBadgeIds: ['b1', 'b2', 'b3', 'b4', 'b5', 'b7'],
    competencies: {
      problemSolving: 96,
      logicalReasoning: 95,
      historicalEmpathy: 99,
      mapLiteracy: 97,
      classParticipation: 98,
      homeworkDiscipline: 100,
    },
    gameHighScores: {
      matRoket: 1680,
      tarihDedektifi: 1950,
      aciAvcisi: 1420,
      haritaFatihi: 1850,
      bilgiCarki: 2100,
    },
  },
  {
    id: 'stu-3',
    name: 'Elif Demir',
    studentNumber: '614',
    classGrade: '6-A',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    level: 3,
    levelTitle: 'Gelişen Araştırmacı',
    xp: 620,
    nextLevelXp: 800,
    dailyStreak: 3,
    totalSchoolDays: 78,
    attendedDays: 72,
    absentDays: 4,
    excusedDays: 2,
    attendanceHistory: [
      { date: '2026-03-27', type: 'mevcut', subject: 'Matematik & Sosyal' },
      { date: '2026-03-26', type: 'tam', reason: 'Mazeretsiz Devamsızlık' },
      { date: '2026-03-25', type: 'mevcut', subject: 'Sosyal Bilgiler' },
    ],
    totalVideoWatchMinutes: 210,
    todayWatchMinutes: 18,
    activeFocusScore: 78,
    videoCompletionRate: 65,
    lastWatchedTopicId: 'm2',
    weeklyWatchHistory: [
      { day: 'Pzt', minutes: 25, activeFocusRate: 75 },
      { day: 'Sal', minutes: 30, activeFocusRate: 80 },
      { day: 'Çar', minutes: 20, activeFocusRate: 72 },
      { day: 'Per', minutes: 40, activeFocusRate: 82 },
      { day: 'Cum', minutes: 45, activeFocusRate: 79 },
      { day: 'Cmt', minutes: 30, activeFocusRate: 77 },
      { day: 'Paz', minutes: 20, activeFocusRate: 78 },
    ],
    mathSuccessRate: 74,
    socialSuccessRate: 82,
    overallSuccessRate: 78,
    homeworks: [
      {
        id: 'hw-1',
        title: 'Rasyonel Sayılarla Dört İşlem Alıştırmaları',
        subject: 'matematik',
        unit: '2. Ünite: Rasyonel Sayılar',
        assignedDate: '2026-03-22',
        dueDate: '2026-03-28',
        status: 'bekliyor',
        maxScore: 100,
        description: 'Ders kitabındaki sayfa 84-86 arasındaki 15 soruluk test.',
      },
    ],
    unlockedBadgeIds: ['b3', 'b4'],
    competencies: {
      problemSolving: 72,
      logicalReasoning: 75,
      historicalEmpathy: 85,
      mapLiteracy: 80,
      classParticipation: 78,
      homeworkDiscipline: 76,
    },
    gameHighScores: {
      matRoket: 820,
      tarihDedektifi: 950,
      aciAvcisi: 640,
      haritaFatihi: 710,
      bilgiCarki: 890,
    },
  },
  {
    id: 'stu-4',
    name: 'Emre Çelik',
    studentNumber: '622',
    classGrade: '6-A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    level: 4,
    levelTitle: 'Strateji Ustası',
    xp: 990,
    nextLevelXp: 1200,
    dailyStreak: 8,
    totalSchoolDays: 78,
    attendedDays: 75,
    absentDays: 2,
    excusedDays: 1,
    attendanceHistory: [
      { date: '2026-03-27', type: 'mevcut' },
      { date: '2026-03-26', type: 'mevcut' },
    ],
    totalVideoWatchMinutes: 385,
    todayWatchMinutes: 42,
    activeFocusScore: 91,
    videoCompletionRate: 85,
    weeklyWatchHistory: [
      { day: 'Pzt', minutes: 50, activeFocusRate: 90 },
      { day: 'Sal', minutes: 55, activeFocusRate: 92 },
      { day: 'Çar', minutes: 40, activeFocusRate: 88 },
      { day: 'Per', minutes: 65, activeFocusRate: 93 },
      { day: 'Cum', minutes: 70, activeFocusRate: 95 },
      { day: 'Cmt', minutes: 60, activeFocusRate: 89 },
      { day: 'Paz', minutes: 45, activeFocusRate: 91 },
    ],
    mathSuccessRate: 88,
    socialSuccessRate: 86,
    overallSuccessRate: 87,
    homeworks: [],
    unlockedBadgeIds: ['b1', 'b3', 'b4', 'b7'],
    competencies: {
      problemSolving: 89,
      logicalReasoning: 87,
      historicalEmpathy: 84,
      mapLiteracy: 88,
      classParticipation: 90,
      homeworkDiscipline: 86,
    },
    gameHighScores: {
      matRoket: 1320,
      tarihDedektifi: 1150,
      aciAvcisi: 1040,
      haritaFatihi: 1210,
      bilgiCarki: 1400,
    },
  },
];

export const sampleLessonTopics: LessonTopic[] = [
  {
    id: 'm1',
    title: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterim',
    subject: 'matematik',
    unit: '2. Ünite: Sayılar ve İşlemler',
    gradeLevel: '6. & 7. Sınıf',
    durationMinutes: 18,
    videoDurationSec: 180, // simulation duration
    thumbnailGradient: 'from-blue-600 to-indigo-900',
    summary: 'Rasyonel sayılar, a ve b tam sayı (b ≠ 0) olmak üzere a/b biçiminde yazılabilen sayılardır. Negatif rasyonel sayılar, devirli ondalık açılımlar ve sayı doğrusunda konumlandırma kuralları detaylı incelenir.',
    keyFacts: [
      'Her tam sayı paydası 1 olan bir rasyonel sayıdır (Örn: -5 = -5/1).',
      'Paydası 0 olan kesirler tanımsızdır (a/0 tanımsızdır).',
      'Negatif kesirlerde eksi işareti paya, paydaya veya kesir çizgisinin önüne konabilir: -3/4 = (-3)/4 = 3/(-4).'
    ],
    formulasOrConcepts: [
      'Rasyonel Sayı: Q = { a/b | a, b ∈ Z ve b ≠ 0 }',
      'Devirli Ondalık Sayıyı Kesre Çevirme: (Tüm Sayı - Devretmeyen Kısım) / (Devreden kadar 9, Devretmeyen kadar 0)',
      'Sayı Doğrusu Kuralı: Sol taraf daima daha küçük, sağ taraf daima daha büyüktür.'
    ],
    checkpoints: [
      {
        timeSec: 35,
        question: 'Video Odak Kontrolü: 0 sayısı bir rasyonel sayı mıdır?',
        options: ['Evet, 0/1 şeklinde yazılabilir.', 'Hayır, sıfır rasyonel olamaz.', 'Sadece pozitifse evet.', 'Bilinemez.'],
        correctIdx: 0,
        explanation: '0/1 = 0 olup payda sıfırdan farklı olduğu için sıfır rasyonel bir sayıdır.'
      },
      {
        timeSec: 90,
        question: 'Aktif İzleme Sorusu: -7/8 rasyonel sayısı sayı doğrusunda hangi iki tam sayı arasındadır?',
        options: ['0 ile 1 arasında', '-1 ile 0 arasında', '-2 ile -1 arasında', '-8 ile -7 arasında'],
        correctIdx: 1,
        explanation: '-7/8 basit negatif kesirdir ve -1 ile 0 tam sayıları arasında yer alır.'
      },
      {
        timeSec: 145,
        question: 'Dikkat Kontrolü: Devirli ondalık 0.333... kesir olarak neye eşittir?',
        options: ['1/3', '3/10', '3/99', '33/100'],
        correctIdx: 0,
        explanation: '3/9 sadeleştiğinde 1/3 elde edilir.'
      }
    ],
    quizQuestions: [
      {
        question: 'Aşağıdaki sayılardan hangisi bir rasyonel sayı DEĞİLDİR?',
        options: ['-4/5', '0', '7/0', '2 tam 1/3'],
        correct: 2,
        explanation: 'Paydası sıfır olan kesirler tanımsızdır, rasyonel sayı belirtmez.'
      },
      {
        question: '-3/5 ile 2/5 sayıları arasında kaç tane tam sayı vardır?',
        options: ['0', '1', '2', 'Sonsuz'],
        correct: 1,
        explanation: '-3/5 ile 2/5 arasında yalnızca "0" tam sayısı bulunur.'
      }
    ]
  },
  {
    id: 's1',
    title: 'Anadolu ve Mezopotamya Medeniyetleri',
    subject: 'sosyal',
    unit: '2. Ünite: Kültür ve Miras',
    gradeLevel: '6. Sınıf',
    durationMinutes: 20,
    videoDurationSec: 180,
    thumbnailGradient: 'from-amber-600 to-orange-950',
    summary: 'Tarihin başladığı topraklar olan Mezopotamya (Sümerler, Babiller, Asurlar) ve Anadolu medeniyetleri (Hititler, Frigler, Lidyalılar, İyonlar, Urartular) insanlık tarihine yazı, tekerlek, para, kanun ve mimari gibi devasa miraslar bırakmıştır.',
    keyFacts: [
      'Sümerler M.Ö. 3200\'de çivi yazısını ve tekerleği icat ederek tarihi çağları başlatmıştır.',
      'Hititler ilk yazılı antlaşma olan Kadeş Antlaşması\'nı Mısırlılar ile imzalamıştır.',
      'Lidyalılar ticarette takas usulüne son vererek parayı (sikke) icat etmiştir.',
      'Frigler tarımı korumak için sert kanunlar çıkarmış (öküz öldürenin cezası ölüm) ve Fibula (çengelli iğne) yapmıştır.'
    ],
    formulasOrConcepts: [
      'Mezopotamya Medeniyetleri: Sümerler (Ziggurat/Yazı), Babiller (Hammurabi Kanunları/Asma Bahçeleri), Asurlar (Kütüphane/Karum Ticareti)',
      'Anadolu Medeniyetleri: Hititler (Hattuşaş/Pankuş/Anal Yıllıkları), Frigler (Gordion/Tapates/Midas), Lidyalılar (Sardes/Kral Yolu/Para), İyonlar (Efes/Milet/Özgür Düşünce), Urartular (Tuşpa/Şamran Kanalı)'
    ],
    checkpoints: [
      {
        timeSec: 40,
        question: 'Video Aktiflik Kontrolü: Tarihte ilk yazıyı (çivi yazısı) hangi medeniyet icat etmiştir?',
        options: ['Sümerler', 'Hititler', 'Lidyalılar', 'Frigler'],
        correctIdx: 0,
        explanation: 'Sümerler zigguratlardaki tahıl kayıtlarını tutmak için M.Ö. 3200 civarında çivi yazısını bulmuştur.'
      },
      {
        timeSec: 100,
        question: 'Dikkat Sorusu: Parayı icat ederek Kral Yolu ticaretini geliştiren Anadolu medeniyeti hangisidir?',
        options: ['İyonlar', 'Urartular', 'Lidyalılar', 'Babiller'],
        correctIdx: 2,
        explanation: 'Lidyalılar Sardes başkentli olup parayı bularak takas dönemini bitirmiştir.'
      }
    ],
    quizQuestions: [
      {
        question: 'Hitit krallarının tanrılara hesap vermek amacıyla yazdığı tarafsız yıllıklar (Anal) tarihte neyin başlangıcı sayılır?',
        options: ['Objektif (Tarafsız) Tarih Yazıcılığı', 'İlk Alfabe', 'İlk Bankacılık', 'İlk Anayasa'],
        correct: 0,
        explanation: 'Hititler tanrılardan korktukları için zaferlerin yanında yenilgilerini de dürüstçe Anal yıllıklarına yazmıştır.'
      }
    ]
  },
  {
    id: 'm2',
    title: 'Cebirsel İfadeler ve Örüntüler',
    subject: 'matematik',
    unit: '3. Ünite: Cebir',
    gradeLevel: '6. & 7. Sınıf',
    durationMinutes: 22,
    videoDurationSec: 180,
    thumbnailGradient: 'from-emerald-600 to-teal-950',
    summary: 'İçinde en az bir bilinmeyen (değişken) ve işlem bulunan ifadelere cebirsel ifade denir. Terim, katsayı, sabit terim, benzer terim kavramları ve günlük yaşam problemlerinin cebirsel dille ifade edilmesi öğretilir.',
    keyFacts: [
      'Değişken (Bilinmeyen): x, y, a, b gibi harflerle gösterilen sayısal değerlerdir.',
      'Sabit Terim: Yanında değişken bulunmayan tek başına duran sayıdır.',
      'Benzer Terim: Değişkeni ve değişkeninin kuvveti aynı olan terimlerdir (Örn: 3x ile -5x benzerdir, 3x ile 3y benzer değildir).'
    ],
    formulasOrConcepts: [
      'Genel İfade: a · x + b',
      'Örüntü Kuralı Bulma: Adım farkı × n + (1. adıma ulaşmak için gereken sayı)',
      'Cebirsel Modelleme: Pozitif ve negatif karo modelleriyle işlem toplama/çıkarma.'
    ],
    checkpoints: [
      {
        timeSec: 45,
        question: 'Video Odak: "Bir sayının 3 katının 5 eksiği" ifadesinin cebirsel karşılığı nedir?',
        options: ['3x - 5', '3(x - 5)', 'x/3 - 5', '5x - 3'],
        correctIdx: 0,
        explanation: 'Önce 3 ile çarpılır (3x), ardından 5 çıkarılır: 3x - 5.'
      },
      {
        timeSec: 110,
        question: 'Aktif İzleme: 4x + 7y - 9 ifadesindeki sabit terim nedir?',
        options: ['-9', '9', '4', '7'],
        correctIdx: 0,
        explanation: 'İşaretiyle birlikte alındığında sabit terim -9 dur.'
      }
    ],
    quizQuestions: [
      {
        question: '3n + 4 kuralına sahip bir sayı örüntüsünün 8. adımı kaçtır?',
        options: ['24', '28', '32', '35'],
        correct: 1,
        explanation: 'n yerine 8 konulur: 3 × 8 + 4 = 24 + 4 = 28.'
      }
    ]
  },
  {
    id: 's2',
    title: 'Türkiye\'nin Fiziki Coğrafyası ve İklim Haritası',
    subject: 'sosyal',
    unit: '3. Ünite: İnsanlar, Yerler ve Çevreler',
    gradeLevel: '6. Sınıf',
    durationMinutes: 19,
    videoDurationSec: 180,
    thumbnailGradient: 'from-cyan-600 to-sky-950',
    summary: 'Ülkemizin yer şekilleri, dağları, ovaları, platoları, 3 ana iklim tipi (Akdeniz, Karadeniz, Karasal) ve bu iklimlerin bitki örtüsü, konut tipleri, tarım ürünleri ve nüfus dağılışına doğrudan etkileri incelenir.',
    keyFacts: [
      'Türkiye batıdan doğuya gidildikçe yükseltisi artan ve sıcaklık ortalaması düşen bir ülkedir.',
      'Karadeniz İklimi: Her mevsim yağışlı, bitki örtüsü orman, konut tipi ahşaptır.',
      'Akdeniz İklimi: Yazlar sıcak ve kurak, kışlar ılık ve yağışlı, bitki örtüsü maki, konut tipi taştır.',
      'Karasal İklim: Yazlar sıcak ve kurak, kışlar soğuk ve kar yağışlı, bitki örtüsü bozkır (step), konut tipi kerpiçtir.'
    ],
    formulasOrConcepts: [
      'Yükselti - Sıcaklık İlişkisi: Her 200 metre yükseldikçe sıcaklık 1°C azalır.',
      'Fiziki Harita Renkleri: Yeşil (0-500m), Sarı (500-1000m), Kahverengi (1000m+ Dağlık alanlar).'
    ],
    checkpoints: [
      {
        timeSec: 50,
        question: 'Video Kontrol: Fiziki haritada yeşil renk neyi gösterir?',
        options: ['Ormanları', 'Deniz seviyesine yakın alçak yerleri (0-500m)', 'Tarımsal arazileri', 'Maki bitki örtüsünü'],
        correctIdx: 1,
        explanation: 'Fiziki haritadaki renkler bitki örtüsünü değil, sadece deniz seviyesinden yüksekliği (yükselti basamaklarını) belirtir.'
      }
    ],
    quizQuestions: [
      {
        question: 'İç Anadolu bölgesinde yaygın olan ve yaz kuraklığı ile sararan kısa boylu ot topluluğu (bitki örtüsü) hangisidir?',
        options: ['Maki', 'Bozkır', 'Tayga Ormanları', 'Tundra'],
        correct: 1,
        explanation: 'Karasal iklimin doğal bitki örtüsü ilkbaharda yeşerip yazın sararan bozkırdır.'
      }
    ]
  },
  {
    id: 'm3',
    title: 'Açılar, Doğruda Açılar ve Geometrik Şekiller',
    subject: 'matematik',
    unit: '4. Ünite: Geometri ve Ölçme',
    gradeLevel: '6. & 7. Sınıf',
    durationMinutes: 25,
    videoDurationSec: 180,
    thumbnailGradient: 'from-violet-600 to-purple-950',
    summary: 'Tümler açılar (toplamı 90°), bütünler açılar (toplamı 180°), komşu açılar, ters açılar ve paralel iki doğruyu kesen bir doğrunun oluşturduğu yöndeş, iç ters, dış ters açılar ile Z, U, M kuralı pratik yöntemleri.',
    keyFacts: [
      'Tümler iki açının ölçüleri toplamı 90 derecedir.',
      'Bütünler iki açının ölçüleri toplamı 180 derecedir.',
      'Kesişen iki doğrunun oluşturduğu zıt yönlü ters açıların ölçüleri birbirine eşittir.',
      'Paralel doğrularda Z kuralında iç açılar birbirine eşittir, U kuralında ardışık açılar toplamı 180°dir.'
    ],
    formulasOrConcepts: [
      'Tümler Açı: a + b = 90°',
      'Bütünler Açı: a + b = 180°',
      'Z Kuralı: Sol açı = Sağ açı',
      'M Kuralı: Aynı yöne bakan açıların toplamı = Zıt yöne bakan açı'
    ],
    checkpoints: [
      {
        timeSec: 40,
        question: 'Aktif İzleme: Ölçüsü 35° olan bir açının tümleri kaç derecedir?',
        options: ['55°', '145°', '65°', '45°'],
        correctIdx: 0,
        explanation: '90° - 35° = 55° dir.'
      }
    ],
    quizQuestions: [
      {
        question: 'Bütünler iki açıdan biri diğerinin 3 katı ise küçük açı kaç derecedir?',
        options: ['30°', '45°', '60°', '90°'],
        correct: 1,
        explanation: 'x + 3x = 180 => 4x = 180 => x = 45° dir.'
      }
    ]
  }
];

export const yearlyCurriculumPlan: YearlyPlanWeek[] = [
  {
    week: 1,
    month: 'Eylül',
    subject: 'sosyal',
    unit: '1. Ünite: Birey ve Toplum',
    topic: 'Sosyal Rollerimiz ve Değişen Roller',
    learningOutcomes: ['SB.6.1.1. Sosyal rollerin zaman içerisindeki değişimini ve hak/sorumluluk dengesini analiz eder.'],
    suggestedActivity: 'Rol Haritası Oluşturma ve Aile İçi Rol Dağılımı Projesi',
    isCompleted: true
  },
  {
    week: 2,
    month: 'Eylül',
    subject: 'matematik',
    unit: '1. Ünite: Sayılar ve İşlemler',
    topic: 'Doğal Sayılarla İşlemler ve Üslü İfadeler',
    learningOutcomes: ['M.6.1.1.1. Bir doğal sayının kendisiyle tekrarlı çarpımını üslü ifade olarak yazar ve değerini hesaplar.'],
    suggestedActivity: 'Üs-Bulmaca Yarışması ve Piramit Hesaplama',
    isCompleted: true
  },
  {
    week: 3,
    month: 'Ekim',
    subject: 'sosyal',
    unit: '1. Ünite: Birey ve Toplum',
    topic: 'Kültürel Değerlerimiz ve Ön Yargılar',
    learningOutcomes: ['SB.6.1.2. Toplumsal birlikteliğin oluşmasında kültürün ve ön yargıların kırılmasının önemini kavrar.'],
    suggestedActivity: 'Ön Yargı Duvarını Yıkalım Drama Etkinliği',
    isCompleted: true
  },
  {
    week: 4,
    month: 'Ekim',
    subject: 'matematik',
    unit: '1. Ünite: Sayılar ve İşlemler',
    topic: 'İşlem Önceliği ve Dağılma Özelliği',
    learningOutcomes: ['M.6.1.1.2. İşlem önceliğini dikkate alarak doğal sayılarla dört işlem yapar.'],
    suggestedActivity: 'Hedef 24 Kart Oyunu ve Dağılma Alanı Modelleme',
    isCompleted: true
  },
  {
    week: 5,
    month: 'Ekim',
    subject: 'matematik',
    unit: '1. Ünite: Sayılar ve İşlemler',
    topic: 'Çarpanlar ve Katlar, Asal Sayılar',
    learningOutcomes: ['M.6.1.2.1. Doğal sayıların çarpanlarını ve katlarını belirler, asal sayı kavramını açıklar.'],
    suggestedActivity: 'Eratosthenes Kalburu ile Asal Sayı Keşfi',
    isCompleted: true
  },
  {
    week: 6,
    month: 'Kasım',
    subject: 'sosyal',
    unit: '2. Ünite: Kültür ve Miras',
    topic: 'Anadolu ve Mezopotamya Medeniyetleri',
    learningOutcomes: ['SB.6.2.1. Anadolu ve Mezopotamya’da yaşamış ilk uygarlıkların insanlık tarihine katkılarını açıklar.'],
    suggestedActivity: 'Çivi Yazılı Kil Tablet Yapımı & Sanal Müze Gezisi',
    isCompleted: true
  },
  {
    week: 7,
    month: 'Kasım',
    subject: 'matematik',
    unit: '2. Ünite: Rasyonel Sayılar',
    topic: 'Rasyonel Sayıları Tanıma ve Sayı Doğrusu',
    learningOutcomes: ['M.7.1.3.1. Rasyonel sayıları tanır ve sayı doğrusunda gösterir.'],
    suggestedActivity: 'Dev Rasyonel Halı Üzerinde Sayı Doğrusu Adımlama',
    isCompleted: true
  },
  {
    week: 8,
    month: 'Aralık',
    subject: 'sosyal',
    unit: '3. Ünite: İpek Yolunda Türkler',
    topic: 'İlk Türk Devletleri ve Yaşam Tarzı',
    learningOutcomes: ['SB.6.2.2. Orta Asya’da kurulan ilk Türk devletlerinin coğrafi, askeri ve kültürel özelliklerini kavrar.'],
    suggestedActivity: 'Kurultay Canlandırması ve Çadır Kültürü Maketi',
    isCompleted: true
  },
  {
    week: 9,
    month: 'Aralık',
    subject: 'matematik',
    unit: '2. Ünite: Rasyonel Sayılar',
    topic: 'Rasyonel Sayılarla Dört İşlem',
    learningOutcomes: ['M.7.1.3.2. Rasyonel sayılarla toplama, çıkarma, çarpma ve bölme işlemlerini yapar.'],
    suggestedActivity: 'Kesir Pastası ve Rasyonel Market Alışveriş Simülasyonu',
    isCompleted: true
  },
  {
    week: 10,
    month: 'Ocak',
    subject: 'sosyal',
    unit: '4. Ünite: Dünyamız ve İklim',
    topic: 'Türkiye’nin İklimi ve Bitki Örtüsü',
    learningOutcomes: ['SB.6.3.1. Konum ile iklim ve bitki örtüsü arasındaki neden-sonuç ilişkisini kurar.'],
    suggestedActivity: '3 Boyutlu Türkiye Fiziki ve İklim Kabartma Haritası',
    isCompleted: false
  },
  {
    week: 11,
    month: 'Şubat',
    subject: 'matematik',
    unit: '3. Ünite: Cebirsel İfadeler',
    topic: 'Cebirsel İfadeler ve Örüntüler',
    learningOutcomes: ['M.7.2.1.1. Cebirsel ifadelerin değerini değişkenin alacağı değerlere göre hesaplar.'],
    suggestedActivity: 'Cebir Karoları ile Denklem Terazisi Oyunu',
    isCompleted: false
  },
  {
    week: 12,
    month: 'Mart',
    subject: 'matematik',
    unit: '4. Ünite: Geometri',
    topic: 'Doğruda Açılar ve Tümler/Bütünler',
    learningOutcomes: ['M.7.3.1.1. Bir açıya eş açı çizer, komşu, tümler, bütünler ve ters açıların özelliklerini kullanır.'],
    suggestedActivity: 'Lazer & Ayna ile Açı Yakalama Deneyi',
    isCompleted: false
  },
  {
    week: 13,
    month: 'Nisan',
    subject: 'sosyal',
    unit: '5. Ünite: Üretim, Dağıtım, Tüketim',
    topic: 'Kaynaklarımız ve Ekonomik Faaliyetler',
    learningOutcomes: ['SB.6.5.1. Ülkemizin kaynakları ile ekonomik faaliyetlerini ilişkilendirir.'],
    suggestedActivity: 'Girişimcilik ve Ürün Geliştirme Fuarı',
    isCompleted: false
  }
];
