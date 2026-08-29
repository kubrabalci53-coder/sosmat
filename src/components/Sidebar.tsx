import React from 'react';
import { 
  BarChart3, 
  CalendarCheck2, 
  BookOpenCheck, 
  PlaySquare, 
  CalendarRange, 
  Gamepad2, 
  FilePieChart, 
  Award, 
  ChevronRight, 
  Flame, 
  GraduationCap, 
  Sparkles,
  Users,
  MessageSquare,
  Layers,
  Activity,
  Database,
  LogOut,
  Crown,
  ShieldCheck
} from 'lucide-react';
import { Student, NavTab, AuthUser } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeStudent: Student;
  allStudents: Student[];
  onSelectStudent: (student: Student) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  unreadMessageCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeStudent,
  allStudents,
  onSelectStudent,
  isMobileOpen,
  onCloseMobile,
  currentUser,
  onLogout,
  unreadMessageCount = 0,
}) => {
  const [showStudentMenu, setShowStudentMenu] = React.useState(false);
  const isTeacher = currentUser?.role === 'teacher';

  const menuItems: { 
    id: NavTab; 
    label: string; 
    icon: React.ComponentType<{ className?: string }>; 
    badge?: string; 
    badgeColor?: string;
    teacherOnly?: boolean;
  }[] = [
    { id: 'dashboard', label: 'Genel İstatistik Paneli', icon: BarChart3 },
    { id: 'lessons', label: 'Konu Anlatımları & Video', icon: PlaySquare, badge: 'Aktif İzleme', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'app_manager', label: 'Uygulama & Araç Havuzu', icon: Layers, badge: 'Hub', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'messages', label: isTeacher ? 'Gelen Öğrenci Mesajları' : 'Öğretmene Soru & Mesaj', icon: MessageSquare, badge: unreadMessageCount > 0 ? `${unreadMessageCount} Yeni` : 'Canlı', badgeColor: unreadMessageCount > 0 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { id: 'attendance', label: 'Devamsızlık Bilgisi', icon: CalendarCheck2, badge: `${activeStudent.attendedDays}/${activeStudent.totalSchoolDays} Gün`, badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'homework', label: 'Ödev Takibi', icon: BookOpenCheck, badge: `${activeStudent.homeworks.filter(h => h.status === 'bekliyor').length} Bekleyen`, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'yearly_plan', label: 'Yıllık Plan (MEB)', icon: CalendarRange },
    { id: 'games', label: 'Oyunlar & Etkinlikler', icon: Gamepad2, badge: '5 Oyun', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'reporting', label: 'Kapsamlı Katılım Raporu', icon: FilePieChart, badge: 'Analiz', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { id: 'badges', label: 'Rozet & Ödül Sistemi', icon: Award, badge: `Lvl ${activeStudent.level}`, badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    // Teacher Specific Tabs
    { id: 'analytics', label: 'Öğrenci Tıklama Analitiği', icon: Activity, badge: 'Yönetici', badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30', teacherOnly: true },
    { id: 'sql_guide', label: 'Supabase SQL Şeması', icon: Database, badge: 'Veritabanı', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', teacherOnly: true },
  ];

  const handleItemClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const xpProgressPercent = Math.min(100, Math.round((activeStudent.xp / activeStudent.nextLevelXp) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  SOS-MAT
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {isTeacher ? 'Yönetici' : 'Öğrenci'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Sosyal & Matematik Portalı</p>
            </div>
          </div>
        </div>

        {/* User / Student Profile Card (Sol Taraf Öğrenci Adı ve Bilgisi) */}
        <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/60 relative">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 flex items-center justify-between">
            <span>{isTeacher ? 'Yönetici Öğretmen' : 'Aktif Öğrenci'}</span>
            {!isTeacher && (
              <button 
                onClick={() => setShowStudentMenu(!showStudentMenu)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[10px] font-semibold transition"
              >
                <Users className="w-3 h-3" />
                <span>Değiştir</span>
              </button>
            )}
          </div>

          <div 
            onClick={() => !isTeacher && setShowStudentMenu(!showStudentMenu)}
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 transition ${
              !isTeacher ? 'cursor-pointer hover:bg-slate-800' : ''
            }`}
          >
            <div className="relative">
              <img 
                src={isTeacher ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' : activeStudent.avatar} 
                alt={isTeacher ? 'Sevgi Demir' : activeStudent.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/40"
              />
              {isTeacher ? (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full border border-slate-900">
                  <Crown className="w-2.5 h-2.5" />
                </div>
              ) : (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1 rounded-full border-2 border-slate-900 flex items-center gap-0.5">
                  <Flame className="w-2 h-2 fill-current" />
                  {activeStudent.dailyStreak}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate">
                  {isTeacher ? 'Sevgi Demir' : (currentUser?.studentName || activeStudent.name)}
                </h4>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-700/60 px-1 py-0.5 rounded">
                  {isTeacher ? 'Tüm Şubeler' : activeStudent.classGrade}
                </span>
              </div>
              <p className="text-[11px] text-indigo-300 font-medium truncate flex items-center gap-1 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                {isTeacher ? 'Uzman Öğretmen' : activeStudent.levelTitle}
              </p>
            </div>
          </div>

          {/* XP Level Bar for Student */}
          {!isTeacher && (
            <div className="mt-2.5 px-1">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-semibold text-amber-300">Seviye {activeStudent.level}</span>
                <span>{activeStudent.xp} / {activeStudent.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Dropdown student switcher */}
          {showStudentMenu && !isTeacher && (
            <div className="absolute left-3 right-3 top-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-1 backdrop-blur-lg">
              <div className="text-[10px] font-semibold text-slate-400 px-2 py-1">Sınıf Öğrencileri</div>
              {allStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => {
                    onSelectStudent(student);
                    setShowStudentMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left text-xs transition ${
                    student.id === activeStudent.id ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-bold' : 'hover:bg-slate-700/50 text-slate-300'
                  }`}
                >
                  <img src={student.avatar} alt={student.name} className="w-6 h-6 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-xs">{student.name}</p>
                  </div>
                  <span className="text-[9px] text-amber-400 font-bold">Lvl {student.level}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
          <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Modüller & Araçlar
          </div>

          {menuItems.map((item) => {
            if (item.teacherOnly && !isTeacher) return null;

            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1 rounded-lg transition ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-indigo-300'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                      isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Auth / Logout Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] truncate max-w-[120px]">
              {isTeacher ? 'Sevgi Demir' : (currentUser?.studentName || 'Öğrenci')}
            </span>
          </div>

          <button
            onClick={onLogout}
            title="Çıkış Yap / Hesap Değiştir"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-300 text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Çıkış</span>
          </button>
        </div>
      </aside>
    </>
  );
};
