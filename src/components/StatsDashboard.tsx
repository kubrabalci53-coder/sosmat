import React from 'react';
import { 
  Clock, 
  TrendingUp, 
  Eye, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  Play, 
  Gamepad2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Student, NavTab } from '../types';

interface StatsDashboardProps {
  student: Student;
  onNavigateTab: (tab: NavTab) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  student,
  onNavigateTab,
}) => {
  const maxWeeklyMinutes = Math.max(...student.weeklyWatchHistory.map(w => w.minutes), 80);

  const completedHomeworksCount = student.homeworks.filter(h => h.status === 'tamamlandi').length;
  const homeworkRate = student.homeworks.length > 0
    ? Math.round((completedHomeworksCount / student.homeworks.length) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Welcome & Student Status Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={student.avatar} 
              alt={student.name} 
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {student.classGrade} • Öğrenci No: {student.studentNumber}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Seviye {student.level} {student.levelTitle}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Hoş Geldin, <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">{student.name}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sos-Mat Akademisi öğrenme serüveninde bugün {student.todayWatchMinutes} dk video ve {student.dailyStreak} günlük seri tamamladın.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('lessons')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Video İzlemeye Başla</span>
            </button>
            <button
              onClick={() => onNavigateTab('games')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>Eğitsel Oyun Oyna</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Core KPI Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Video Watch Duration (Kaç dk video izliyor) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Video İzleme</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{student.totalVideoWatchMinutes}</span>
            <span className="text-sm font-semibold text-slate-400">dakika</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Bugün: <strong className="text-emerald-400">{student.todayWatchMinutes} dk</strong></span>
            <span className="text-indigo-400 font-medium">Haftalık: {student.weeklyWatchHistory.reduce((a, b) => a + b.minutes, 0)} dk</span>
          </div>
        </div>

        {/* KPI 2: Overall & Subject Success Rate (Başarı Oranı) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Genel Başarı Oranı</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">%{student.overallSuccessRate}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Üstün</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>📐 Mat: <strong className="text-blue-400">%{student.mathSuccessRate}</strong></span>
            <span>🌍 Sosyal: <strong className="text-amber-400">%{student.socialSuccessRate}</strong></span>
          </div>
        </div>

        {/* KPI 3: Active Video Focus Rate (Videoyu aktif izleme yapıyor mu) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktif Video Odak Skoru</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">%{student.activeFocusScore}</span>
            <span className="text-xs font-semibold text-slate-300">
              {student.activeFocusScore >= 90 ? 'Lazer Dikkat ⚡' : 'Normal Odak'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Sekme Takibi Açık
            </span>
            <span className="text-cyan-300 font-medium">Tamamlama: %{student.videoCompletionRate}</span>
          </div>
        </div>

        {/* KPI 4: Attendance & Discipline (Devamsızlık Bilgisi) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Devam & Yoklama</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-300 font-mono">
              {student.attendedDays}<span className="text-sm text-slate-400">/{student.totalSchoolDays}</span>
            </span>
            <span className="text-xs font-semibold text-slate-300">Gün</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Devamsız: <strong className="text-rose-400">{student.absentDays} Gün</strong></span>
            <span>Mazeretli: <strong className="text-yellow-400">{student.excusedDays} Gün</strong></span>
          </div>
        </div>
      </div>

      {/* Middle Section: Weekly Video Watch & Active Engagement Bar Chart + Homework Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Video Watch Statistics Weekly Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Haftalık Video İzleme ve Aktiflik Dağılımı
              </h3>
              <p className="text-xs text-slate-400">
                Günlük izlenen dakika ve video başındaki aktif odak yüzdesi
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <div className="w-3 h-3 rounded bg-indigo-500" />
                <span>İzleme Süresi (dk)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <div className="w-3 h-3 rounded bg-amber-400" />
                <span>Aktif Odak (%)</span>
              </div>
            </div>
          </div>

          {/* SVG/HTML Bar Chart */}
          <div className="grid grid-cols-7 gap-3 pt-4 items-end min-h-[220px]">
            {student.weeklyWatchHistory.map((item, idx) => {
              const heightPct = Math.round((item.minutes / maxWeeklyMinutes) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="text-[11px] font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition duration-150">
                    {item.minutes} dk
                  </div>

                  {/* Dual Bars container */}
                  <div className="w-full flex items-end justify-center gap-1.5 h-44 bg-slate-800/40 rounded-xl p-1.5 relative">
                    {/* Minutes bar */}
                    <div 
                      className="w-1/2 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-lg transition-all duration-500 hover:brightness-125"
                      style={{ height: `${heightPct}%` }}
                      title={`${item.day}: ${item.minutes} Dakika`}
                    />
                    {/* Focus score bar */}
                    <div 
                      className="w-1/2 bg-gradient-to-t from-amber-600 to-amber-400 rounded-lg transition-all duration-500 hover:brightness-125"
                      style={{ height: `${item.activeFocusRate}%` }}
                      title={`${item.day} Odak Skoru: %${item.activeFocusRate}`}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-300">{item.day}</span>
                </div>
              );
            })}
          </div>

          {/* Footer insight */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-start gap-3 text-xs">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Pedagojik Aktif İzleme Notu:</span>
              <p className="text-slate-300 mt-0.5">
                Öğrenci en yüksek video odaklanma oranına (%98) Cuma günleri ulaşmıştır. Video içi kontrol sorularına verilen doğru cevap oranı %92 olup konuyu kavrama hızı müfredat ortalamasının üzerindedir.
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Homework & Attendance Status Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Homework Tracker Mini Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Ödev Durumu
              </h4>
              <button 
                onClick={() => onNavigateTab('homework')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Tümü <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {student.homeworks.slice(0, 3).map((hw) => (
                <div key={hw.id} className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white line-clamp-1">{hw.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      hw.status === 'tamamlandi'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : hw.status === 'bekliyor'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {hw.status === 'tamamlandi' ? 'Puan: ' + hw.score : 'Bekliyor'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize">{hw.subject === 'matematik' ? '📐 Matematik' : '🌍 Sosyal'}</span>
                    <span>Teslim: {hw.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Tamamlanma Oranı</span>
                <span className="font-bold text-emerald-400">%{homeworkRate}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${homeworkRate}%` }} />
              </div>
            </div>
          </div>

          {/* Badges Preview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                Kazanılan Rozetler
              </h4>
              <button 
                onClick={() => onNavigateTab('badges')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Rozetler ({student.unlockedBadgeIds.length}) <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {['b1', 'b2', 'b3', 'b7'].map((badgeId, i) => (
                <div key={i} className="flex-1 bg-slate-800/80 border border-slate-700/80 p-2.5 rounded-xl text-center flex flex-col items-center justify-center gap-1 group hover:border-amber-500/50 transition">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 truncate w-full">
                    {badgeId === 'b1' ? 'Mat Kurdu' : badgeId === 'b2' ? 'Tarih Kaşifi' : badgeId === 'b3' ? 'Lazer Odak' : 'Sıfır Devam'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
