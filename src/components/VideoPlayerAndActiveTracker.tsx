import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Award, 
  HelpCircle, 
  Volume2, 
  Clock, 
  BookOpen, 
  Layers,
  Sparkles,
  ArrowRight,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonTopic, Student, VideoCheckpoint } from '../types';
import { soundManager } from '../utils/soundEffects';

interface VideoPlayerProps {
  topics: LessonTopic[];
  activeStudent: Student;
  onUpdateWatchStats: (minutesAdded: number, focusScore: number, xpEarned: number) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export const VideoPlayerAndActiveTracker: React.FC<VideoPlayerProps> = ({
  topics,
  activeStudent,
  onUpdateWatchStats,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<LessonTopic>(topics[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeCheckpoint, setActiveCheckpoint] = useState<VideoCheckpoint | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [passedCheckpoints, setPassedCheckpoints] = useState<number[]>([]);
  const [tabFocusLostCount, setTabFocusLostCount] = useState(0);
  const [isTabFocused, setIsTabFocused] = useState(true);
  const [sessionWatchSeconds, setSessionWatchSeconds] = useState(0);
  const [focusScore, setFocusScore] = useState(activeStudent.activeFocusScore || 94);
  const [showSummaryTab, setShowSummaryTab] = useState<'video' | 'summary' | 'formula'>('video');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect tab visibility changes for active watch monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabFocused(false);
        setTabFocusLostCount(prev => prev + 1);
        setFocusScore(prev => Math.max(45, prev - 4));
        if (isPlaying) {
          setIsPlaying(false);
        }
      } else {
        setIsTabFocused(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  // Video timer simulation
  useEffect(() => {
    if (isPlaying && !activeCheckpoint) {
      timerRef.current = setInterval(() => {
        setCurrentTimeSec(prev => {
          const nextTime = prev + 1 * playbackSpeed;
          
          // Check for checkpoints
          const triggeredCheckpoint = selectedTopic.checkpoints.find(
            cp => Math.floor(cp.timeSec) === Math.floor(nextTime) && !passedCheckpoints.includes(cp.timeSec)
          );

          if (triggeredCheckpoint) {
            setIsPlaying(false);
            setActiveCheckpoint(triggeredCheckpoint);
            setSelectedAnswer(null);
            setAnswerSubmitted(false);
            soundManager.playCheckpointBeep();
            return triggeredCheckpoint.timeSec;
          }

          if (nextTime >= selectedTopic.videoDurationSec) {
            setIsPlaying(false);
            soundManager.playBadgeUnlock();
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            return selectedTopic.videoDurationSec;
          }

          return nextTime;
        });

        setSessionWatchSeconds(prev => {
          const updated = prev + 1;
          // Every 60 seconds of watched video, update student state
          if (updated % 60 === 0) {
            onUpdateWatchStats(1, focusScore, 25);
          }
          return updated;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeCheckpoint, playbackSpeed, selectedTopic, passedCheckpoints, focusScore, onUpdateWatchStats]);

  const handleTogglePlay = () => {
    if (currentTimeSec >= selectedTopic.videoDurationSec) {
      setCurrentTimeSec(0);
      setPassedCheckpoints([]);
    }
    setIsPlaying(!isPlaying);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !activeCheckpoint) return;
    setAnswerSubmitted(true);

    if (selectedAnswer === activeCheckpoint.correctIdx) {
      soundManager.playCorrect();
      setFocusScore(prev => Math.min(100, prev + 3));
      confetti({ particleCount: 40, spread: 50 });
      // add checkpoint to passed
      setPassedCheckpoints(prev => [...prev, activeCheckpoint.timeSec]);
      // reward XP
      onUpdateWatchStats(0, focusScore, 15);
    } else {
      soundManager.playWrong();
      setFocusScore(prev => Math.max(50, prev - 5));
    }
  };

  const handleContinueVideo = () => {
    if (activeCheckpoint && selectedAnswer === activeCheckpoint.correctIdx) {
      setActiveCheckpoint(null);
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentTimeSec / selectedTopic.videoDurationSec) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner: Video Active Watch Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Active Eye Status */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isTabFocused && isPlaying
            ? 'bg-emerald-950/40 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
            : isTabFocused
            ? 'bg-slate-800/80 border-slate-700/80'
            : 'bg-rose-950/50 border-rose-500/50 animate-pulse'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Aktif İzleme Algılama</span>
            {isTabFocused ? (
              <Eye className={`w-5 h-5 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            ) : (
              <EyeOff className="w-5 h-5 text-rose-400" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-base font-extrabold ${isTabFocused ? (isPlaying ? 'text-emerald-400' : 'text-slate-200') : 'text-rose-400'}`}>
              {isTabFocused ? (isPlaying ? 'CANLI İZLENİYOR' : 'HAZIRDA BEKLİYOR') : 'DİKKAT DAĞILDI!'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isTabFocused 
              ? 'Sekme odağı ve öğrenci ekran takibi aktif.' 
              : 'Öğrenci başka bir sekmeye geçti, video duraklatıldı!'}
          </p>
        </div>

        {/* Focus Score Gauge */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Odaklanma Skoru</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400">%{focusScore}</span>
            <span className="text-xs text-slate-400 font-medium">
              {focusScore >= 90 ? 'Mükemmel ⚡' : focusScore >= 75 ? 'İyi Odak 👍' : 'Geliştirilmeli ⚠️'}
            </span>
          </div>
          <div className="w-full bg-slate-700/60 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-amber-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${focusScore}%` }}
            />
          </div>
        </div>

        {/* Total & Session Watched Minutes */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">İzlenen Süre</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-300">
              {activeStudent.totalVideoWatchMinutes} <span className="text-sm font-normal text-slate-400">dk</span>
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              (+{Math.floor(sessionWatchSeconds / 60)} dk bu oturum)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bugün: {activeStudent.todayWatchMinutes} dakika tamamlandı</p>
        </div>

        {/* Checkpoint & Question Success */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Video İçi Kontrol</span>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-cyan-400">
              {passedCheckpoints.length} / {selectedTopic.checkpoints.length}
            </span>
            <span className="text-xs text-slate-400">Nokta Geçildi</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Video içi anlık dikkat soruları</p>
        </div>
      </div>

      {/* Main Video & Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive Video Player Simulator */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Simulated Video Canvas / Screen */}
            <div className={`relative aspect-video w-full bg-gradient-to-br ${selectedTopic.thumbnailGradient} flex flex-col justify-between p-6 select-none overflow-hidden`}>
              {/* Background ambient geometry */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              {/* Top Video Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide ${
                    selectedTopic.subject === 'matematik' ? 'bg-blue-500 text-white shadow' : 'bg-amber-500 text-slate-950 shadow'
                  }`}>
                    {selectedTopic.subject === 'matematik' ? '📐 MATEMATİK' : '🌍 SOSYAL BİLGİLER'}
                  </span>
                  <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-200 border border-white/10">
                    {selectedTopic.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-white border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  {formatTime(currentTimeSec)} / {formatTime(selectedTopic.videoDurationSec)}
                </div>
              </div>

              {/* Center Lecture Visual Graphic Animation */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center my-4">
                {selectedTopic.subject === 'matematik' ? (
                  <div className="space-y-3 bg-slate-950/70 backdrop-blur-md p-5 rounded-2xl border border-white/15 max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center items-center gap-4 text-3xl font-extrabold text-blue-300 font-mono">
                      <span className="p-2 bg-blue-600/30 rounded-xl border border-blue-400/40">- 3/4</span>
                      <span className="text-xl text-amber-300">&lt;</span>
                      <span className="p-2 bg-emerald-600/30 rounded-xl border border-emerald-400/40">0</span>
                      <span className="text-xl text-amber-300">&lt;</span>
                      <span className="p-2 bg-purple-600/30 rounded-xl border border-purple-400/40">+ 5/2</span>
                    </div>
                    <div className="text-xs text-slate-200 font-medium">
                      Sayı Doğrusu Modeli: Sol negatif, sağ pozitif rasyonel sayılar
                    </div>
                    <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-purple-500 rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-slate-950/70 backdrop-blur-md p-5 rounded-2xl border border-white/15 max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center items-center gap-3 text-2xl font-extrabold text-amber-300">
                      <span>🏛️ Mezopotamya</span>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                      <span>📜 Anadolu</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      Sümerler Çivi Yazısı (M.Ö. 3200) • Hititler Kadeş Antlaşması • Lidyalılar İlk Para
                    </p>
                    <div className="flex justify-center gap-2">
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">Kral Yolu</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Ziggurat</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Pankuş Meclisi</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Video Overlays */}
              <div className="relative z-10">
                <h3 className="text-lg font-extrabold text-white drop-shadow-md">{selectedTopic.title}</h3>
                <p className="text-xs text-slate-300 font-medium line-clamp-1">{selectedTopic.summary}</p>
              </div>

              {/* Video Active Checkpoint Modal OVERLAY (Burada mısın? / Soru Kontrolü) */}
              {activeCheckpoint && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex items-center justify-center p-6 animate-in zoom-in-95 duration-200">
                  <div className="max-w-md w-full bg-slate-900 border border-indigo-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <HelpCircle className="w-5 h-5" />
                        <span className="font-extrabold text-xs uppercase tracking-wider">Aktif İzleme Kontrol Sorusu</span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        +15 XP
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {activeCheckpoint.question}
                    </h4>

                    <div className="space-y-2">
                      {activeCheckpoint.options.map((opt, idx) => {
                        let btnStyle = 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700';
                        if (answerSubmitted) {
                          if (idx === activeCheckpoint.correctIdx) {
                            btnStyle = 'bg-emerald-600/30 text-emerald-200 border-emerald-500 font-bold';
                          } else if (selectedAnswer === idx) {
                            btnStyle = 'bg-rose-600/30 text-rose-200 border-rose-500';
                          }
                        } else if (selectedAnswer === idx) {
                          btnStyle = 'bg-indigo-600/30 text-indigo-200 border-indigo-500 font-bold';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => !answerSubmitted && setSelectedAnswer(idx)}
                            className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition ${btnStyle}`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + idx)})</span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {answerSubmitted && (
                      <div className={`p-3 rounded-xl text-xs font-medium ${
                        selectedAnswer === activeCheckpoint.correctIdx
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                      }`}>
                        <div className="font-bold flex items-center gap-1.5 mb-1">
                          {selectedAnswer === activeCheckpoint.correctIdx ? '🎉 Harika! Doğru Cevap' : '⚠️ Dikkat! Açıklama:'}
                        </div>
                        <p>{activeCheckpoint.explanation}</p>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end gap-2">
                      {!answerSubmitted ? (
                        <button
                          disabled={selectedAnswer === null}
                          onClick={handleAnswerSubmit}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Cevabı Onayla & Devam Et
                        </button>
                      ) : (
                        <button
                          onClick={handleContinueVideo}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Videoyu Oynatmaya Devam Et
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
              {/* Progress Timeline */}
              <div className="relative">
                <div 
                  className="w-full h-2 bg-slate-800 rounded-full cursor-pointer overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    setCurrentTimeSec(pct * selectedTopic.videoDurationSec);
                  }}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Checkpoint Markers on Timeline */}
                {selectedTopic.checkpoints.map((cp, idx) => {
                  const leftPct = (cp.timeSec / selectedTopic.videoDurationSec) * 100;
                  const isPassed = passedCheckpoints.includes(cp.timeSec);
                  return (
                    <div
                      key={idx}
                      title={`Kontrol Sorusu ${idx + 1}`}
                      className={`absolute top-0 -translate-y-1/4 w-3 h-3 rounded-full border-2 border-slate-900 z-10 transition-transform ${
                        isPassed ? 'bg-emerald-400 scale-110' : 'bg-amber-400'
                      }`}
                      style={{ left: `calc(${leftPct}% - 6px)` }}
                    />
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-xs"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Durdur' : 'Oynat'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTimeSec(0);
                      setPassedCheckpoints([]);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs"
                    title="Başa Dön"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Türkçe Seslendirme</span>
                  </div>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {[1, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                        playbackSpeed === speed
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Video Lesson Key Summary & Concept Notes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSummaryTab('video')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    showSummaryTab === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                  Konu Özeti
                </button>
                <button
                  onClick={() => setShowSummaryTab('formula')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    showSummaryTab === 'formula' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 inline mr-1" />
                  {selectedTopic.subject === 'matematik' ? 'Formüller & Kurallar' : 'Tarihi & Coğrafi Kavramlar'}
                </button>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {selectedTopic.gradeLevel}
              </span>
            </div>

            {showSummaryTab === 'video' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">{selectedTopic.summary}</p>
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Kritik MEB Bilgileri:
                  </h5>
                  <ul className="space-y-1">
                    {selectedTopic.keyFacts.map((fact, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedTopic.formulasOrConcepts.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl text-xs text-indigo-200 font-mono flex items-center justify-between">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Topic Playlist & Active Watch Logs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <PlaySquareIcon className="w-4 h-4 text-indigo-400" />
                Ders Konuları Listesi
              </h4>
              <span className="text-[11px] font-semibold text-slate-400">{topics.length} Ders</span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {topics.map((topic) => {
                const isCurrent = topic.id === selectedTopic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setCurrentTimeSec(0);
                      setIsPlaying(false);
                      setPassedCheckpoints([]);
                      setActiveCheckpoint(null);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start gap-3 ${
                      isCurrent 
                        ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md' 
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg font-bold text-xs shrink-0 ${
                      topic.subject === 'matematik' ? 'bg-blue-600 text-white' : 'bg-amber-600 text-slate-950'
                    }`}>
                      {topic.subject === 'matematik' ? 'MAT' : 'SOS'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isCurrent ? 'text-indigo-300' : 'text-white'}`}>
                        {topic.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>⏱️ {topic.durationMinutes} dk</span>
                        <span>•</span>
                        <span>{topic.checkpoints.length} Kontrol</span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1 animate-pulse"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Watch Telemetry Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Aktiflik & Dikkat Kayıtları
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <span className="text-slate-400">Sekmeden Ayrılma Sayısı:</span>
                <span className={`font-bold ${tabFocusLostCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {tabFocusLostCount} kez
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <span className="text-slate-400">Canlı Odak Başarısı:</span>
                <span className="font-extrabold text-amber-400">%{focusScore}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <span className="text-slate-400">Kazanılan XP:</span>
                <span className="font-extrabold text-indigo-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  +{passedCheckpoints.length * 15 + Math.floor(sessionWatchSeconds / 60) * 25} XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function PlaySquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
    </svg>
  );
}
