import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Send, 
  Star, 
  FileText, 
  Sparkles,
  Award,
  UploadCloud
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, HomeworkItem, SubjectType } from '../types';
import { soundManager } from '../utils/soundEffects';

interface HomeworkTrackerProps {
  student: Student;
  onUpdateHomework: (updatedHomework: HomeworkItem) => void;
  onAddHomework: (newHomework: HomeworkItem) => void;
}

export const HomeworkTracker: React.FC<HomeworkTrackerProps> = ({
  student,
  onUpdateHomework,
  onAddHomework,
}) => {
  const [filterSubject, setFilterSubject] = useState<SubjectType>('genel');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeModalHw, setActiveModalHw] = useState<HomeworkItem | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Homework Form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'matematik' | 'sosyal'>('matematik');
  const [newUnit, setNewUnit] = useState('');
  const [newDueDate, setNewDueDate] = useState(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
  const [newDesc, setNewDesc] = useState('');

  const handleOpenSubmit = (hw: HomeworkItem) => {
    setActiveModalHw(hw);
    setSubmissionText('');
  };

  const handleCompleteSubmission = () => {
    if (!activeModalHw) return;
    const score = Math.floor(Math.random() * 11) + 90; // 90-100 score
    const updated: HomeworkItem = {
      ...activeModalHw,
      status: 'tamamlandi',
      score: score,
      feedback: submissionText ? `Ödev başarıyla incelendi. "${submissionText.slice(0, 40)}..." çözümleri kusursuz!` : 'Ödev zamanında ve tam teslim edildi.',
    };

    onUpdateHomework(updated);
    setActiveModalHw(null);
    soundManager.playCorrect();
    confetti({ particleCount: 60, spread: 60 });
  };

  const handleCreateNewHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const item: HomeworkItem = {
      id: `hw-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      unit: newUnit || (newSubject === 'matematik' ? 'Cebir & Geometri' : 'Tarih & Medeniyet'),
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: newDueDate,
      status: 'bekliyor',
      maxScore: 100,
      description: newDesc || 'Ders konusu ile ilgili pekiştirme soruları.',
    };
    onAddHomework(item);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    soundManager.playCorrect();
  };

  const filteredHomeworks = student.homeworks.filter(h => {
    if (filterSubject !== 'genel' && h.subject !== filterSubject) return false;
    if (filterStatus !== 'all' && h.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BookOpenCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Ödev Takip ve Değerlendirme Merkezi
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sosyal Bilgiler & Matematik haftalık ödevleri, proje teslimleri ve öğretmen geri bildirimleri
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ödev Ata</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        {/* Subject Filter */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs">
          <button
            onClick={() => setFilterSubject('genel')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filterSubject === 'genel' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tüm Dersler
          </button>
          <button
            onClick={() => setFilterSubject('matematik')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filterSubject === 'matematik' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📐 Matematik
          </button>
          <button
            onClick={() => setFilterSubject('sosyal')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filterSubject === 'sosyal' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌍 Sosyal Bilgiler
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs">
          {[
            { id: 'all', label: 'Tüm Durumlar' },
            { id: 'bekliyor', label: '⏳ Bekleyenler' },
            { id: 'tamamlandi', label: '✅ Tamamlananlar' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterStatus === st.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHomeworks.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl">
            Seçilen kritere uygun ödev bulunamadı.
          </div>
        ) : (
          filteredHomeworks.map((hw) => (
            <div 
              key={hw.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide ${
                    hw.subject === 'matematik' ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                  }`}>
                    {hw.subject === 'matematik' ? '📐 MATEMATİK' : '🌍 SOSYAL BİLGİLER'}
                  </span>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    hw.status === 'tamamlandi' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                  }`}>
                    {hw.status === 'tamamlandi' ? `Puan: ${hw.score}/${hw.maxScore}` : 'Teslim Bekliyor'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white">{hw.title}</h3>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5">{hw.unit}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  {hw.description}
                </p>

                {hw.feedback && (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Öğretmen Değerlendirmesi:
                    </span>
                    <p className="text-emerald-200/90">{hw.feedback}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Son Teslim: <strong className="text-white font-mono">{hw.dueDate}</strong></span>
                </div>

                {hw.status === 'bekliyor' ? (
                  <button
                    onClick={() => handleOpenSubmit(hw)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ödevi Teslim Et</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tamamlandı (+30 XP)</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Homework Submission Modal */}
      {activeModalHw && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <UploadCloud className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-white">Ödev Çözümünü Gönder</h3>
              </div>
              <span className="text-xs font-bold text-amber-400">+50 XP Ödülü</span>
            </div>

            <div className="text-xs space-y-2 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <p className="font-bold text-white text-sm">{activeModalHw.title}</p>
              <p className="text-slate-300">{activeModalHw.description}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Çözüm Açıklamanız veya İşlem Notlarınız:
              </label>
              <textarea 
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="Örn: 1. Soru için paydaları 12'de eşitledim ve sonuç 7/12 çıktı..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalHw(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Vazgeç
              </button>
              <button
                onClick={handleCompleteSubmission}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ödevi Onayla & Puan Al</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Homework Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-indigo-400" />
              Yeni Ödev Oluştur & Ata
            </h3>

            <form onSubmit={handleCreateNewHomework} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Ödev Başlığı</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Örn: Açılar ve Üçgenlerde İç Açılar Problemleri"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Ders</label>
                  <select 
                    value={newSubject} 
                    onChange={(e) => setNewSubject(e.target.value as 'matematik' | 'sosyal')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="matematik">📐 Matematik</option>
                    <option value="sosyal">🌍 Sosyal Bilgiler</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Son Teslim Tarihi</label>
                  <input 
                    type="date" 
                    value={newDueDate} 
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Ünite / Konu Başlığı</label>
                <input 
                  type="text" 
                  value={newUnit} 
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Örn: 4. Ünite: Geometri ve Ölçme"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Ödev Açıklaması ve Yönergeler</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Öğrencinin yapması gereken alıştırma sayfaları veya problem detayları..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Ödevi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
