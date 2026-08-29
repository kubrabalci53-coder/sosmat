import { createClient } from '@supabase/supabase-js';
import { AuthUser, ChatMessage, EducationalApp, StudentActivityLog } from '../types';

// Safely access env vars
const envObj = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const SUPABASE_URL = envObj.VITE_SUPABASE_URL || 'https://dvqttbxualpcuxrakdtc.supabase.co';
const SUPABASE_ANON_KEY = envObj.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cXR0Ynh1YWxwY3V4cmFrZHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NzkwNDksImV4cCI6MjEwMzU1NTA0OX0.PuJdMkYnUicwnvx4TWdoaB4QTIl-JkTvI29-Jt6Ip_E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Initial mock educational apps
export const defaultEducationalApps: EducationalApp[] = [
  {
    id: 'app-1',
    title: 'Mat-Roket Uzay Görevi',
    category: 'oyun',
    description: 'Hızlı zihinden işlemler, üslü sayılar ve denklem çözme roket oyunu.',
    icon: 'Rocket',
    target_tab: 'games',
    is_active: true,
    added_by: 'sevgi demir',
    created_at: new Date().toISOString(),
    views_count: 142,
  },
  {
    id: 'app-2',
    title: 'Tarih Dedektifi & Medeniyetler',
    category: 'sosyal',
    description: 'Mezopotamya, Anadolu uygarlıkları ve ilk Türk devletleri eser eşleştirme.',
    icon: 'Compass',
    target_tab: 'games',
    is_active: true,
    added_by: 'sevgi demir',
    created_at: new Date().toISOString(),
    views_count: 98,
  },
  {
    id: 'app-3',
    title: 'Açı Avcısı & Geometri Laboratuvarı',
    category: 'matematik',
    description: 'Tümler (90°), Bütünler (180°) ve Z kuralı açı hesaplama simülasyonu.',
    icon: 'Shapes',
    target_tab: 'games',
    is_active: true,
    added_by: 'sevgi demir',
    created_at: new Date().toISOString(),
    views_count: 115,
  },
  {
    id: 'app-4',
    title: 'Türkiye İklim & Ticaret Yolları Haritası',
    category: 'sosyal',
    description: 'Bölgeler, iklim özellikleri, İpek ve Baharat Yolu interaktif harita harikası.',
    icon: 'MapPin',
    target_tab: 'games',
    is_active: true,
    added_by: 'sevgi demir',
    created_at: new Date().toISOString(),
    views_count: 87,
  },
  {
    id: 'app-5',
    title: 'MEB Haftalık Kazanım ve Yıllık Plan',
    category: 'kaynak',
    description: '36 haftalık Sosyal Bilgiler & Matematik MEB müfredat takip aracı.',
    icon: 'CalendarRange',
    target_tab: 'yearly_plan',
    is_active: true,
    added_by: 'sevgi demir',
    created_at: new Date().toISOString(),
    views_count: 210,
  },
  {
    id: 'app-6',
    title: 'Sos-Mat Bilgi Çarkı & Düello',
    category: 'oyun',
    description: 'Süreye karşı karışık Matematik ve Tarih soruları yarışma arenası.',
    icon: 'Sparkles',
    target_tab: 'games',
    is_active: true,
    added_by: 'sevgi demir',
    created_at: new Date().toISOString(),
    views_count: 176,
  }
];

// Helper to sanitize input strings
export function sanitizeInput(input: string): string {
  return input.replace(/[<>'"`;]/g, '').trim();
}

// Complete SQL Migration Script for Supabase SQL Editor
export const SUPABASE_SQL_MIGRATION = `-- =========================================================================
-- SOS-MAT EĞİTİM PORTALI - SUPABASE VERİTABANI KURULUM ŞEMASI
-- Yönetici Öğretmen: Sevgi Demir (sevgi demir / 12345)
-- Öğrenci Girişleri: Sadece Şifre ile Kayıt & Giriş
-- =========================================================================

-- 1. KULLANICILAR TABLOSU (portal_users)
CREATE TABLE IF NOT EXISTS public.portal_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  username TEXT UNIQUE, -- Öğretmen için 'sevgi demir'
  student_pin TEXT UNIQUE, -- Öğrenci için sadece şifre
  student_name TEXT, -- Otomatik üretilen öğrenci rumuzu
  student_number TEXT,
  class_grade TEXT DEFAULT '6-A',
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  level INT DEFAULT 1,
  xp INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Varsayılan Yönetici Öğretmeni Ekle
INSERT INTO public.portal_users (role, username, student_pin, student_name, class_grade)
VALUES ('teacher', 'sevgi demir', '12345', 'Sevgi Demir (Uzman Öğretmen)', 'Tüm Şubeler')
ON CONFLICT (username) DO NOTHING;

-- 2. MESAJLAŞMA TABLOSU (portal_messages)
CREATE TABLE IF NOT EXISTS public.portal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('teacher', 'student')),
  sender_name TEXT NOT NULL,
  receiver_id TEXT NOT NULL, -- 'teacher' veya öğrenci ID'si
  receiver_role TEXT NOT NULL CHECK (receiver_role IN ('teacher', 'student')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  reply_to_id UUID REFERENCES public.portal_messages(id) ON DELETE SET NULL,
  reply_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EĞİTSEL UYGULAMALAR & ÖDEV / OYUN ARAÇLARI (educational_apps)
CREATE TABLE IF NOT EXISTS public.educational_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('matematik', 'sosyal', 'oyun', 'arac', 'video', 'kaynak')),
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Sparkles',
  link_url TEXT,
  target_tab TEXT DEFAULT 'games',
  is_active BOOLEAN DEFAULT TRUE,
  added_by TEXT DEFAULT 'sevgi demir',
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ÖĞRENCİ ETKİLEŞİM & AKTİVİTE LOGLARI (student_activity_logs)
CREATE TABLE IF NOT EXISTS public.student_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_class TEXT DEFAULT '6-A',
  target_type TEXT NOT NULL CHECK (target_type IN ('app', 'video', 'homework', 'game', 'resource')),
  target_id TEXT NOT NULL,
  target_title TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('click', 'view', 'complete', 'start')),
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GÜVENLİK (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activity_logs ENABLE ROW LEVEL SECURITY;

-- Güvenlik Politikaları (Anonim & Genel Erişim)
CREATE POLICY "Herkes kullanıcıları okuyabilir" ON public.portal_users FOR SELECT USING (true);
CREATE POLICY "Öğrenci kaydı yapılabilir" ON public.portal_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Kullanıcı profil güncelleyebilir" ON public.portal_users FOR UPDATE USING (true);

CREATE POLICY "Mesajları okuma izni" ON public.portal_messages FOR SELECT USING (true);
CREATE POLICY "Mesaj gönderme izni" ON public.portal_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Mesaj yanıtlama/güncelleme izni" ON public.portal_messages FOR UPDATE USING (true);

CREATE POLICY "Uygulamaları herkes görebilir" ON public.educational_apps FOR SELECT USING (true);
CREATE POLICY "Öğretmen uygulama ekleyebilir" ON public.educational_apps FOR INSERT WITH CHECK (true);
CREATE POLICY "Uygulama düzenleme/silme" ON public.educational_apps FOR ALL USING (true);

CREATE POLICY "Aktivite kayıtlarını herkes görebilir" ON public.student_activity_logs FOR SELECT USING (true);
CREATE POLICY "Aktivite logu ekleme" ON public.student_activity_logs FOR INSERT WITH CHECK (true);

-- İndeksler (Hızlı Sorgulama İçin)
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.portal_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.portal_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_activity_student ON public.student_activity_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.student_activity_logs(created_at DESC);
`;

// Local Storage Fallback Keys
const LOCAL_STORAGE_USERS = 'sosmat_supabase_users';
const LOCAL_STORAGE_MESSAGES = 'sosmat_supabase_messages';
const LOCAL_STORAGE_APPS = 'sosmat_supabase_apps';
const LOCAL_STORAGE_LOGS = 'sosmat_supabase_logs';

export const dbService = {
  // --- AUTH SERVICES ---
  async loginTeacher(username: string, pin: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const cleanUser = username.trim().toLowerCase();
    const cleanPin = pin.trim();

    if (cleanUser === 'sevgi demir' && cleanPin === '12345') {
      const teacherUser: AuthUser = {
        id: 'teacher-sevgi-demir',
        role: 'teacher',
        username: 'sevgi demir',
        studentName: 'Sevgi Demir (Uzman Öğretmen)',
        classGrade: 'Tüm Şubeler',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        level: 10,
        xp: 9999,
      };
      return { success: true, user: teacherUser };
    }

    // Try Supabase check
    try {
      const { data, error } = await supabase
        .from('portal_users')
        .select('*')
        .eq('role', 'teacher')
        .ilike('username', cleanUser)
        .eq('student_pin', cleanPin)
        .maybeSingle();

      if (data && !error) {
        return {
          success: true,
          user: {
            id: data.id,
            role: 'teacher',
            username: data.username,
            studentName: data.student_name || 'Sevgi Demir',
            classGrade: data.class_grade || 'Tüm Şubeler',
            avatar: data.avatar,
            level: data.level || 10,
            xp: data.xp || 9999,
          }
        };
      }
    } catch {
      // ignore
    }

    return { success: false, error: 'Yönetici kullanıcı adı veya şifre hatalı! (Kullanıcı: sevgi demir, Şifre: 12345)' };
  },

  async registerStudent(password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const cleanPin = password.trim();
    if (!cleanPin || cleanPin.length < 3) {
      return { success: false, error: 'Şifre en az 3 karakter olmalıdır!' };
    }

    // Check if student password already exists locally or in Supabase
    const existing = await this.findStudentByPassword(cleanPin);
    if (existing) {
      return { success: false, error: 'Bu şifre ile kayıtlı bir öğrenci zaten var! Lütfen giriş yapınız veya farklı bir şifre belirleyiniz.' };
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const studentNames = ['Ali', 'Zeynep', 'Ayşe', 'Kerem', 'Elif', 'Burak', 'Mert', 'Selin', 'Deniz', 'Emre', 'Yağmur', 'Can'];
    const assignedName = `Öğrenci #${randomNum} (${studentNames[Math.floor(Math.random() * studentNames.length)]})`;
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    ];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newStudent: AuthUser = {
      id: `student-${Date.now()}-${randomNum}`,
      role: 'student',
      studentPin: cleanPin,
      studentName: assignedName,
      studentNumber: String(randomNum),
      classGrade: '6-A',
      avatar,
      level: 1,
      xp: 150,
    };

    // Save to Supabase
    try {
      await supabase.from('portal_users').insert([{
        id: newStudent.id,
        role: 'student',
        student_pin: cleanPin,
        student_name: assignedName,
        student_number: String(randomNum),
        class_grade: '6-A',
        avatar,
        level: 1,
        xp: 150,
      }]);
    } catch {
      // fallback
    }

    // Save locally
    const localUsers = this.getLocalUsers();
    localUsers.push(newStudent);
    localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(localUsers));

    return { success: true, user: newStudent };
  },

  async loginStudent(password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const cleanPin = password.trim();
    if (!cleanPin) {
      return { success: false, error: 'Lütfen şifrenizi giriniz!' };
    }

    // Try finding student
    const student = await this.findStudentByPassword(cleanPin);
    if (student) {
      return { success: true, user: student };
    }

    return { success: false, error: 'Bu şifreye ait öğrenci hesabı bulunamadı. Lütfen kayıt sekmesinden yeni hesap açınız!' };
  },

  async findStudentByPassword(pin: string): Promise<AuthUser | null> {
    const cleanPin = pin.trim();

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('portal_users')
        .select('*')
        .eq('role', 'student')
        .eq('student_pin', cleanPin)
        .maybeSingle();

      if (data && !error) {
        return {
          id: data.id,
          role: 'student',
          studentPin: data.student_pin,
          studentName: data.student_name,
          studentNumber: data.student_number,
          classGrade: data.class_grade || '6-A',
          avatar: data.avatar,
          level: data.level || 1,
          xp: data.xp || 100,
        };
      }
    } catch {
      // fallback
    }

    // 2. Try LocalStorage
    const localUsers = this.getLocalUsers();
    const found = localUsers.find(u => u.role === 'student' && u.studentPin === cleanPin);
    return found || null;
  },

  getLocalUsers(): AuthUser[] {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  // --- MESSAGING SERVICES ---
  async sendMessage(msg: Omit<ChatMessage, 'id' | 'created_at' | 'is_read'>): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    // Save to Supabase
    try {
      await supabase.from('portal_messages').insert([newMsg]);
    } catch {
      // fallback
    }

    // Save locally
    const local = this.getLocalMessages();
    local.push(newMsg);
    localStorage.setItem(LOCAL_STORAGE_MESSAGES, JSON.stringify(local));

    return newMsg;
  },

  async getMessagesForUser(user: AuthUser): Promise<ChatMessage[]> {
    let supabaseMessages: ChatMessage[] = [];

    try {
      if (user.role === 'teacher') {
        const { data, error } = await supabase
          .from('portal_messages')
          .select('*')
          .order('created_at', { ascending: true });
        if (data && !error) supabaseMessages = data;
      } else {
        const { data, error } = await supabase
          .from('portal_messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: true });
        if (data && !error) supabaseMessages = data;
      }
    } catch {
      // ignore
    }

    if (supabaseMessages.length > 0) {
      return supabaseMessages;
    }

    // Fallback to local
    const local = this.getLocalMessages();
    if (user.role === 'teacher') {
      return local;
    }
    return local.filter(m => m.sender_id === user.id || m.receiver_id === user.id);
  },

  async replyToMessage(msgId: string, replyText: string): Promise<boolean> {
    try {
      await supabase
        .from('portal_messages')
        .update({ is_read: true, reply_text: replyText })
        .eq('id', msgId);
    } catch {
      // fallback
    }

    const local = this.getLocalMessages();
    const updated = local.map(m => m.id === msgId ? { ...m, is_read: true, reply_text: replyText } : m);
    localStorage.setItem(LOCAL_STORAGE_MESSAGES, JSON.stringify(updated));
    return true;
  },

  getLocalMessages(): ChatMessage[] {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MESSAGES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Seed initial message
    return [
      {
        id: 'msg-seed-1',
        sender_id: 'student-demo',
        sender_role: 'student',
        sender_name: 'Öğrenci #104 (Ali)',
        receiver_id: 'teacher-sevgi-demir',
        receiver_role: 'teacher',
        message: 'Öğretmenim, rasyonel sayılarda sıralama konusundaki ödevin 3. sorusunda takıldım, yardımcı olabilir misiniz?',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        is_read: true,
        reply_text: 'Harika bir soru Ali! Rasyonel sayıları sıralarken önce paydaları eşitlemeyi veya ondalık gösterime çevirmeyi deneyebilirsin. Yarın derste birlikte üzerinden geçelim!',
      }
    ];
  },

  // --- EDUCATIONAL APPS SERVICES ---
  async getEducationalApps(): Promise<EducationalApp[]> {
    try {
      const { data, error } = await supabase
        .from('educational_apps')
        .select('*')
        .order('created_at', { ascending: false });
      if (data && !error && data.length > 0) {
        return data;
      }
    } catch {
      // fallback
    }

    try {
      const local = localStorage.getItem(LOCAL_STORAGE_APPS);
      if (local) return JSON.parse(local);
    } catch {
      // ignore
    }

    return defaultEducationalApps;
  },

  async addEducationalApp(app: Omit<EducationalApp, 'id' | 'created_at' | 'views_count'>): Promise<EducationalApp> {
    const newApp: EducationalApp = {
      ...app,
      id: `app-${Date.now()}`,
      created_at: new Date().toISOString(),
      views_count: 0,
    };

    try {
      await supabase.from('educational_apps').insert([newApp]);
    } catch {
      // fallback
    }

    const current = await this.getEducationalApps();
    const updated = [newApp, ...current];
    localStorage.setItem(LOCAL_STORAGE_APPS, JSON.stringify(updated));
    return newApp;
  },

  async deleteEducationalApp(appId: string): Promise<boolean> {
    try {
      await supabase.from('educational_apps').delete().eq('id', appId);
    } catch {
      // fallback
    }
    const current = await this.getEducationalApps();
    const updated = current.filter(a => a.id !== appId);
    localStorage.setItem(LOCAL_STORAGE_APPS, JSON.stringify(updated));
    return true;
  },

  // --- STUDENT ACTIVITY TRACKING SERVICES ---
  async logActivity(log: Omit<StudentActivityLog, 'id' | 'created_at'>): Promise<void> {
    const newLog: StudentActivityLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    // Increment view in Supabase & insert log
    try {
      await supabase.from('student_activity_logs').insert([newLog]);
      if (log.target_type === 'app') {
        await supabase.rpc('increment_app_view', { app_id: log.target_id });
      }
    } catch {
      // fallback
    }

    // Save locally
    const currentLogs = this.getLocalLogs();
    currentLogs.unshift(newLog);
    // Keep max 500 logs locally
    const trimmed = currentLogs.slice(0, 500);
    localStorage.setItem(LOCAL_STORAGE_LOGS, JSON.stringify(trimmed));
  },

  async getActivityLogs(): Promise<StudentActivityLog[]> {
    try {
      const { data, error } = await supabase
        .from('student_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(150);
      if (data && !error && data.length > 0) {
        return data;
      }
    } catch {
      // fallback
    }

    return this.getLocalLogs();
  },

  getLocalLogs(): StudentActivityLog[] {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Seed initial mock logs for analytics
    return [
      {
        id: 'log-1',
        student_id: 'stu-1',
        student_name: 'Öğrenci #104 (Ali)',
        student_class: '6-A',
        target_type: 'app',
        target_id: 'app-1',
        target_title: 'Mat-Roket Uzay Görevi',
        action: 'click',
        duration_seconds: 180,
        created_at: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: 'log-2',
        student_id: 'stu-2',
        student_name: 'Öğrenci #205 (Zeynep)',
        student_class: '6-A',
        target_type: 'game',
        target_id: 'app-2',
        target_title: 'Tarih Dedektifi & Medeniyetler',
        action: 'complete',
        duration_seconds: 240,
        created_at: new Date(Date.now() - 35 * 60000).toISOString(),
      },
      {
        id: 'log-3',
        student_id: 'stu-3',
        student_name: 'Öğrenci #312 (Kerem)',
        student_class: '6-B',
        target_type: 'video',
        target_id: 'lesson-1',
        target_title: 'Rasyonel Sayılar ve Sayı Doğrusu',
        action: 'view',
        duration_seconds: 450,
        created_at: new Date(Date.now() - 90 * 60000).toISOString(),
      },
      {
        id: 'log-4',
        student_id: 'stu-1',
        student_name: 'Öğrenci #104 (Ali)',
        student_class: '6-A',
        target_type: 'homework',
        target_id: 'hw-1',
        target_title: 'Rasyonel Sayılar Çalışma Yaprağı',
        action: 'complete',
        duration_seconds: 600,
        created_at: new Date(Date.now() - 140 * 60000).toISOString(),
      },
    ];
  }
};
