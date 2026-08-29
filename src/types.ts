export type SubjectType = 'matematik' | 'sosyal' | 'genel';

export type HomeworkStatus = 'tamamlandi' | 'bekliyor' | 'gecikti';

export interface AttendanceRecord {
  date: string;
  type: 'tam' | 'yarim' | 'mazeretli' | 'mevcut';
  subject?: string;
  reason?: string;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: SubjectType;
  unit: string;
  assignedDate: string;
  dueDate: string;
  status: HomeworkStatus;
  score?: number;
  maxScore: number;
  feedback?: string;
  description: string;
}

export interface VideoCheckpoint {
  timeSec: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export interface LessonTopic {
  id: string;
  title: string;
  subject: 'matematik' | 'sosyal';
  unit: string;
  gradeLevel: string;
  durationMinutes: number;
  videoDurationSec: number;
  thumbnailGradient: string;
  summary: string;
  keyFacts: string[];
  formulasOrConcepts: string[];
  checkpoints: VideoCheckpoint[];
  quizQuestions: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

export interface YearlyPlanWeek {
  week: number;
  month: string;
  subject: 'matematik' | 'sosyal';
  unit: string;
  topic: string;
  learningOutcomes: string[]; // MEB Kazanımları
  suggestedActivity: string;
  isCompleted: boolean;
}

export interface Badge {
  id: string;
  name: string;
  title: string;
  description: string;
  iconName: string;
  category: 'matematik' | 'sosyal' | 'odak' | 'devam' | 'odev' | 'seviye';
  rarity: 'bronz' | 'gumus' | 'altin' | 'efsane';
  xpRequired: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface DailyWatchData {
  day: string;
  minutes: number;
  activeFocusRate: number; // 0 - 100
}

export interface Student {
  id: string;
  name: string;
  studentNumber: string;
  classGrade: string; // örn: 6-A
  avatar: string;
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  dailyStreak: number;
  // Devamsızlık
  totalSchoolDays: number;
  attendedDays: number;
  absentDays: number;
  excusedDays: number;
  attendanceHistory: AttendanceRecord[];
  // Video & İstatistik
  totalVideoWatchMinutes: number;
  todayWatchMinutes: number;
  activeFocusScore: number; // 0-100% (videoda odaklanma skoru)
  videoCompletionRate: number; // %
  lastWatchedTopicId?: string;
  weeklyWatchHistory: DailyWatchData[];
  // Başarı & Notlar
  mathSuccessRate: number; // %
  socialSuccessRate: number; // %
  overallSuccessRate: number; // %
  // Ödevler
  homeworks: HomeworkItem[];
  // Rozetler
  unlockedBadgeIds: string[];
  // Katılım Yetkinlikleri (0-100)
  competencies: {
    problemSolving: number; // Problem Çözme
    logicalReasoning: number; // Mantıksal Akıl Yürütme
    historicalEmpathy: number; // Tarihsel ve Sosyal Empati
    mapLiteracy: number; // Harita ve Mekan Okuryazarlığı
    classParticipation: number; // Ders İçi Aktif Katılım
    homeworkDiscipline: number; // Ödev & Çalışma Disiplini
  };
  gameHighScores: {
    matRoket: number;
    tarihDedektifi: number;
    aciAvcisi: number;
    haritaFatihi: number;
    bilgiCarki: number;
  };
}

export interface TeacherProfile {
  name: string;
  title: string;
  department: string;
  school: string;
  avatar: string;
  selectedBranch: string;
  branches: string[];
}

export type UserRole = 'teacher' | 'student';

export interface AuthUser {
  id: string;
  role: UserRole;
  username?: string; // For teacher: 'sevgi demir'
  studentPin?: string; // For student: password only
  studentName?: string;
  studentNumber?: string;
  classGrade?: string;
  avatar?: string;
  level?: number;
  xp?: number;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_role: UserRole;
  sender_name: string;
  receiver_id: string; // 'teacher' or studentId
  receiver_role: UserRole;
  message: string;
  created_at: string;
  is_read: boolean;
  reply_to_id?: string;
  reply_text?: string;
}

export interface EducationalApp {
  id: string;
  title: string;
  category: 'matematik' | 'sosyal' | 'oyun' | 'arac' | 'video' | 'kaynak';
  description: string;
  icon: string;
  link_url?: string;
  target_tab?: string;
  is_active: boolean;
  added_by: string;
  created_at: string;
  views_count: number;
}

export interface StudentActivityLog {
  id: string;
  student_id: string;
  student_name: string;
  student_class: string;
  target_type: 'app' | 'video' | 'homework' | 'game' | 'resource';
  target_id: string;
  target_title: string;
  action: 'click' | 'view' | 'complete' | 'start';
  duration_seconds?: number;
  created_at: string;
}

export type NavTab = 
  | 'dashboard' 
  | 'attendance' 
  | 'homework' 
  | 'lessons' 
  | 'yearly_plan' 
  | 'games' 
  | 'reporting' 
  | 'badges'
  | 'messages'
  | 'analytics'
  | 'app_manager'
  | 'sql_guide';
