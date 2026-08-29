import React, { useState } from 'react';
import { 
  FilePieChart, 
  Printer, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Award, 
  Brain, 
  Compass, 
  Calculator, 
  Eye, 
  Calendar,
  Layers,
  BookOpen,
  Share2,
  RefreshCw
} from 'lucide-react';
import { Student, TeacherProfile } from '../types';
import { soundManager } from '../utils/soundEffects';

interface ReportProps {
  student: Student;
  allStudents: Student[];
  teacher: TeacherProfile;
}

export const ParticipationReport: React.FC<ReportProps> = ({
  student,
  allStudents,
  teacher,
}) => {
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [customTeacherNote, setCustomTeacherNote] = useState(
    `${student.name}, Sosyal Bilgiler ve Matematik derslerinde son derece yüksek bir aktif katılım sergilemektedir. Özellikle video derslerdeki %${student.activeFocusScore} odaklanma oranı ve kontrol sorularındaki hızlı kavrayışı dikkat çekicidir. Sayısal problem çözme ile tarihsel empati yeteneğini harmanlayarak çok yönlü bir başarı yakalamıştır.`
  );

  const handleGenerateAiReport = () => {
    setIsGeneratingAi(true);
    soundManager.playCheckpointBeep();

    setTimeout(() => {
      setIsGeneratingAi(false);
      soundManager.playBadgeUnlock();
      const generated = `[SOS-MAT PEDAGOJİK GELİŞİM ANALİZİ - ${new Date().toLocaleDateString('tr-TR')}]\n` +
        `Öğrenci: ${student.name} (${student.classGrade} - No: ${student.studentNumber})\n` +
        `Matematik Başarısı: %${student.mathSuccessRate} | Sosyal Bilgiler Başarısı: %${student.socialSuccessRate}\n\n` +
        `1. DİKKAT VE VİDEO İZLEME PERFORMANSI:\n` +
        `Toplam ${student.totalVideoWatchMinutes} dakika izleme ve %${student.activeFocusScore} aktif odak puanı ile sınıf ortalamasının (%82) belirgin şekilde üzerindedir. Sekmeden ayrılma oranı düşüktür.\n\n` +
        `2. ALANSAL YETKİNLİK ANALİZİ:\n` +
        `- Matematik: Rasyonel sayılar ve cebirsel modelleme kazanımlarında üst düzey kavrayış sergilemektedir.\n` +
        `- Sosyal Bilgiler: Anadolu & Mezopotamya uygarlıkları, Kral Yolu ticareti ve fiziki harita okuma becerileri mükemmel düzeydedir.\n\n` +
        `3. GELİŞİM ÖNERİSİ:\n` +
        `Geometri ve açı avcısı etkinliklerine ağırlık verilmesi, matematiksel ispat ve mantık yürütme derinliğini daha da artıracaktır.`;
      setCustomTeacherNote(generated);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Class averages
  const avgMath = Math.round(allStudents.reduce((a, b) => a + b.mathSuccessRate, 0) / allStudents.length);
  const avgSocial = Math.round(allStudents.reduce((a, b) => a + b.socialSuccessRate, 0) / allStudents.length);
  const avgWatch = Math.round(allStudents.reduce((a, b) => a + b.totalVideoWatchMinutes, 0) / allStudents.length);
  const avgFocus = Math.round(allStudents.reduce((a, b) => a + b.activeFocusScore, 0) / allStudents.length);

  const compList = [
    { label: 'Problem Çözme Becerisi', val: student.competencies.problemSolving, icon: Calculator, color: 'text-blue-400', bg: 'bg-blue-500' },
    { label: 'Mantıksal Akıl Yürütme', val: student.competencies.logicalReasoning, icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500' },
    { label: 'Tarihsel ve Sosyal Empati', val: student.competencies.historicalEmpathy, icon: Compass, color: 'text-amber-400', bg: 'bg-amber-500' },
    { label: 'Harita ve Mekan Okuryazarlığı', val: student.competencies.mapLiteracy, icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500' },
    { label: 'Ders İçi Aktif Katılım', val: student.competencies.classParticipation, icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500' },
    { label: 'Ödev & Çalışma Disiplini', val: student.competencies.homeworkDiscipline, icon: BookOpen, color: 'text-pink-400', bg: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FilePieChart className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">
                Ders Katılımı ve Öğrenci Başarı Analiz Raporu
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Sos-Mat Pedagojik Modül
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {student.name} • {student.classGrade} Şubesi • Hazırlayan: {teacher.name} ({teacher.title})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleGenerateAiReport}
            disabled={isGeneratingAi}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isGeneratingAi ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAi ? 'Rapor Hazırlanıyor...' : 'AI Analizini Yenile'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Resmi Raporu Yazdır</span>
          </button>
        </div>
      </div>

      {/* Student vs Class Benchmark Comparative Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Matematik Yetkinliği</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-blue-400 font-mono">%{student.mathSuccessRate}</span>
            <span className="text-xs text-slate-400">Sınıf Ort: %{avgMath}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${student.mathSuccessRate}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sosyal Bilgiler Yetkinliği</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">%{student.socialSuccessRate}</span>
            <span className="text-xs text-slate-400">Sınıf Ort: %{avgSocial}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${student.socialSuccessRate}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Video İzleme Süresi</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">{student.totalVideoWatchMinutes} dk</span>
            <span className="text-xs text-slate-400">Sınıf Ort: {avgWatch} dk</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, (student.totalVideoWatchMinutes / 500) * 100)}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Aktif Odaklanma Başarısı</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">%{student.activeFocusScore}</span>
            <span className="text-xs text-slate-400">Sınıf Ort: %{avgFocus}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${student.activeFocusScore}%` }} />
          </div>
        </div>
      </div>

      {/* 6 Key Competencies Breakdown Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Sosyal ve Matematik Yetkinlik Analizi
              </h3>
              <p className="text-xs text-slate-400">Temel bilişsel ve derse katılım beceri düzeyleri</p>
            </div>
            <span className="text-xs font-bold text-emerald-400">6 Yetkinlik</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {compList.map((comp, idx) => {
              const Icon = comp.icon;
              return (
                <div key={idx} className="space-y-1.5 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-200">
                      <Icon className={`w-4 h-4 ${comp.color}`} />
                      <span>{comp.label}</span>
                    </div>
                    <span className="font-extrabold font-mono text-white">%{comp.val}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${comp.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${comp.val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Development Areas */}
        <div className="lg:col-span-6 space-y-4">
          {/* Strengths */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Öğrencinin Öne Çıkan Güçlü Yönleri
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                <span><strong>Lazer Odak ve Video Verimliliği:</strong> Video konu anlatımlarında %{student.activeFocusScore} dikkat puanı ile video içi kontrol sorularının %90'ından fazlasını ilk denemede doğru yanıtlıyor.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0" />
                <span><strong>Matematiksel Modelleme:</strong> Rasyonel sayılar, cebirsel örüntüler ve işlem önceliği alıştırmalarında sıfır hata ile ilerliyor.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                <span><strong>Tarihsel ve Coğrafi Algı:</strong> İlk Türk devletleri ve Anadolu uygarlıklarının insanlık mirasına katkılarını somutlaştırabiliyor.</span>
              </div>
            </div>
          </div>

          {/* Development Areas */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Desteklenmesi ve Geliştirilmesi Önerilen Alanlar
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                <span><strong>Geometrik Açı Avcılığı:</strong> Paralel doğrularda Z ve U kurallarında görselleştirme pratikleri artırılabilir.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
                <span><strong>Harita Lejant Okuma:</strong> Türkiye fiziki haritasındaki yükselti renk basamakları üzerinde pekiştirme yapılabilir.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher / AI Comprehensive Evaluation Note Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">
              Öğretmen Pedagojik Değerlendirme ve Dönem Sonu Raporu
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Resmi Karne ve Veli Bilgilendirme Formatı
          </span>
        </div>

        <div className="relative">
          <textarea 
            value={customTeacherNote}
            onChange={(e) => setCustomTeacherNote(e.target.value)}
            rows={7}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono leading-relaxed text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Zümre Başkanı / Öğretmen:</span>
            <span>{teacher.name} ({teacher.title})</span>
          </div>
          <div className="font-mono text-[11px] text-emerald-400 font-bold">
            ✓ E-Okul & SOS-MAT Sistemi İle Uyumlu
          </div>
        </div>
      </div>
    </div>
  );
};
