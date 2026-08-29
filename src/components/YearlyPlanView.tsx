import React, { useState } from 'react';
import { 
  CalendarRange, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Layers, 
  Printer, 
  Search,
  BookOpen,
  Compass
} from 'lucide-react';
import { YearlyPlanWeek, SubjectType } from '../types';
import { soundManager } from '../utils/soundEffects';

interface YearlyPlanProps {
  planData: YearlyPlanWeek[];
  onToggleWeekCompletion: (weekNum: number) => void;
}

export const YearlyPlanView: React.FC<YearlyPlanProps> = ({
  planData,
  onToggleWeekCompletion,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<SubjectType>('genel');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const months = ['all', 'Eylül', 'Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];

  const filteredPlan = planData.filter(item => {
    if (subjectFilter !== 'genel' && item.subject !== subjectFilter) return false;
    if (selectedMonth !== 'all' && item.month !== selectedMonth) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.topic.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.learningOutcomes.some(o => o.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalWeeks = planData.length;
  const completedWeeks = planData.filter(w => w.isCompleted).length;
  const completionRate = Math.round((completedWeeks / totalWeeks) * 100);

  const handleToggle = (week: number) => {
    onToggleWeekCompletion(week);
    soundManager.playCorrect();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CalendarRange className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">
                MEB Müfredatına Uygun Yıllık Plan & Kazanım Takvimi
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Sosyal & Matematik
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Haftalık ders kazanımları, pedagojik etkinlik önerileri ve müfredat tamamlama izleme modülü
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition self-start md:self-auto"
        >
          <Printer className="w-4 h-4 text-slate-300" />
          <span>Yıllık Planı Yazdır / PDF</span>
        </button>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Yıllık Müfredat İlerleme Durumu:
            </span>
            <span className="text-xs font-extrabold text-emerald-400">
              %{completionRate} Tamamlandı ({completedWeeks}/{totalWeeks} Hafta)
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            Milli Eğitim Bakanlığı Temel Eğitim Genel Müdürlüğü Müfredat Standartları
          </span>
        </div>

        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setSubjectFilter('genel')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                subjectFilter === 'genel' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSubjectFilter('matematik')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                subjectFilter === 'matematik' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📐 Matematik
            </button>
            <button
              onClick={() => setSubjectFilter('sosyal')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                subjectFilter === 'sosyal' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌍 Sosyal Bilgiler
            </button>
          </div>

          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
          >
            {months.map(m => (
              <option key={m} value={m}>
                {m === 'all' ? 'Tüm Aylar' : m}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kazanım veya konu ara..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Yearly Plan Weeks List */}
      <div className="space-y-3">
        {filteredPlan.map((week) => (
          <div 
            key={week.week}
            className={`p-5 rounded-2xl border transition-all ${
              week.isCompleted 
                ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(week.week)}
                  className={`mt-0.5 p-1 rounded-xl transition ${
                    week.isCompleted ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={week.isCompleted ? 'Tamamlandı işaretini kaldır' : 'Tamamlandı olarak işaretle'}
                >
                  {week.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      {week.week}. HAFTA ({week.month})
                    </span>

                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      week.subject === 'matematik' 
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' 
                        : 'bg-amber-600/30 text-amber-300 border border-amber-500/30'
                    }`}>
                      {week.subject === 'matematik' ? '📐 MATEMATİK' : '🌍 SOSYAL BİLGİLER'}
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                      {week.unit}
                    </span>
                  </div>

                  <h3 className={`text-base font-extrabold ${week.isCompleted ? 'text-white line-through opacity-80' : 'text-white'}`}>
                    {week.topic}
                  </h3>

                  {/* Outcomes */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      MEB Kazanımları:
                    </span>
                    <ul className="space-y-1">
                      {week.learningOutcomes.map((outc, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <span>{outc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Activity */}
                  <div className="mt-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center gap-2 text-xs text-amber-300 font-medium">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Önerilen Etkinlik: <strong>{week.suggestedActivity}</strong></span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-end justify-between gap-2 border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  week.isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {week.isCompleted ? 'İşlendi ✓' : 'Bekliyor'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
