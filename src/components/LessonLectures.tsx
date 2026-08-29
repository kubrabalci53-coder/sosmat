import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  Clock, 
  ChevronRight,
  Flame,
  Award,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonTopic, SubjectType, Student } from '../types';
import { soundManager } from '../utils/soundEffects';

interface LessonLecturesProps {
  topics: LessonTopic[];
  student: Student;
  onOpenVideoTopic: (topic: LessonTopic) => void;
  onEarnXp: (xp: number) => void;
}

export const LessonLectures: React.FC<LessonLecturesProps> = ({
  topics,
  student,
  onOpenVideoTopic,
  onEarnXp,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('genel');
  const [activeQuizTopic, setActiveQuizTopic] = useState<LessonTopic | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredTopics = topics.filter(t => {
    if (selectedSubject === 'genel') return true;
    return t.subject === selectedSubject;
  });

  const handleStartQuiz = (topic: LessonTopic) => {
    setActiveQuizTopic(topic);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuizTopic) return;
    setQuizSubmitted(true);
    let correctCount = 0;
    activeQuizTopic.quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correctCount++;
    });

    if (correctCount === activeQuizTopic.quizQuestions.length) {
      soundManager.playBadgeUnlock();
      confetti({ particleCount: 70, spread: 70 });
      onEarnXp(50);
    } else {
      soundManager.playCorrect();
      onEarnXp(25);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">
                Konu Anlatımları & Dijital Ders Kütüphanesi
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Aktif İzleme Destekli
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              MEB müfredatına uygun Sosyal Bilgiler & Matematik video dersleri, kavram haritaları ve konu sonu testleri
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setSelectedSubject('genel')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedSubject === 'genel' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tüm Dersler
          </button>
          <button
            onClick={() => setSelectedSubject('matematik')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedSubject === 'matematik' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📐 Matematik
          </button>
          <button
            onClick={() => setSelectedSubject('sosyal')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedSubject === 'sosyal' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌍 Sosyal Bilgiler
          </button>
        </div>
      </div>

      {/* Lesson Topics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => (
          <div 
            key={topic.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide ${
                  topic.subject === 'matematik' 
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                    : 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                }`}>
                  {topic.subject === 'matematik' ? '📐 MATEMATİK' : '🌍 SOSYAL BİLGİLER'}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{topic.durationMinutes} Dakika</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white">{topic.title}</h3>
                <p className="text-xs text-indigo-400 font-semibold mt-0.5">{topic.unit} • {topic.gradeLevel}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
                {topic.summary}
              </p>

              {/* Key Concept Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Önemli Kavramlar & Kazanımlar:
                </span>
                <div className="space-y-1">
                  {topic.keyFacts.map((fact, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleStartQuiz(topic)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>Pekiştirme Testi ({topic.quizQuestions.length} Soru)</span>
              </button>

              <button
                onClick={() => onOpenVideoTopic(topic)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Aktif Video İzle</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {activeQuizTopic && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                  Konu Pekiştirme Testi
                </h3>
                <p className="text-xs text-slate-400">{activeQuizTopic.title}</p>
              </div>

              <span className="text-xs font-bold text-amber-400">+50 XP</span>
            </div>

            <div className="space-y-4">
              {activeQuizTopic.quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                  <h4 className="text-xs font-bold text-white leading-relaxed">
                    <span className="text-indigo-400 mr-1.5">{qIdx + 1}.</span>
                    {q.question}
                  </h4>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      let btnStyle = 'bg-slate-900 hover:bg-slate-750 text-slate-300 border-slate-800';
                      if (quizSubmitted) {
                        if (optIdx === q.correct) {
                          btnStyle = 'bg-emerald-600/30 text-emerald-200 border-emerald-500 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-600/30 text-rose-200 border-rose-500';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-600/30 text-indigo-200 border-indigo-500 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition ${btnStyle}`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)})</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <strong>Çözüm:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveQuizTopic(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Kapat
              </button>
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Testi Tamamla & Puan Al
                </button>
              ) : (
                <button
                  onClick={() => setActiveQuizTopic(null)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  Tamamlandı ✓
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
