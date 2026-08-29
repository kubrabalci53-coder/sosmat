import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Rocket, 
  Compass, 
  Shapes, 
  MapPin, 
  HelpCircle, 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Zap,
  ArrowRight,
  ShieldAlert,
  Play,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { soundManager } from '../utils/soundEffects';

interface GamesProps {
  student: Student;
  onGameWin: (gameKey: string, score: number, xpEarned: number) => void;
}

type ActiveGameType = 'hub' | 'matRoket' | 'tarihDedektifi' | 'aciAvcisi' | 'haritaFatihi' | 'bilgiCarki';

export const GamesAndActivities: React.FC<GamesProps> = ({
  student,
  onGameWin,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGameType>('hub');

  // Mat-Roket Game State
  const [roketScore, setRoketScore] = useState(0);
  const [roketAltitude, setRoketAltitude] = useState(0); // 0 to 100
  const [roketStreak, setRoketStreak] = useState(0);
  const [roketQuestion, setRoketQuestion] = useState<{ q: string; ans: number; options: number[] }>({
    q: '3/4 + 2/4 = ?',
    ans: 1.25,
    options: [1.25, 1.5, 0.75, 2.0]
  });
  const [roketGameOver, setRoketGameOver] = useState(false);

  // Tarih Dedektifi State
  const [tarihScore, setTarihScore] = useState(0);
  const [tarihStep, setTarihStep] = useState(0);
  const tarihQuestions = [
    {
      civilization: 'Sümerler',
      fact: 'M.Ö. 3200\'de çivi yazısını ve tekerleği icat eden Mezopotamya uygarlığı.',
      options: ['Sümerler', 'Babiller', 'Hititler', 'Lidyalılar'],
      hint: 'Ziggurat tapınakları ile ünlüdür.'
    },
    {
      civilization: 'Lidyalılar',
      fact: 'Ticarette takas usulüne son verip parayı (sikke) icat eden ve Kral Yolu\'nu kullanan Anadolu medeniyeti.',
      options: ['Frigler', 'Lidyalılar', 'Urartular', 'İyonlar'],
      hint: 'Başkentleri Sardes (Manisa) şehridir.'
    },
    {
      civilization: 'Hititler',
      fact: 'Tarihteki ilk yazılı antlaşma olan Kadeş Antlaşması\'nı imzalayan ve Pankuş meclisine sahip devlet.',
      options: ['Hititler', 'Sümerler', 'Asurlar', 'Frigler'],
      hint: 'Başkentleri Hattuşaş (Çorum) şehridir.'
    },
    {
      civilization: 'Frigler',
      fact: 'Tarımı korumak için çok sert kanunlar koyan, Fibula adı verilen çengelli iğneleri üreten medeniyet.',
      options: ['Frigler', 'Urartular', 'Babiller', 'Lidyalılar'],
      hint: 'Kral Midas ile tanınırlar.'
    },
    {
      civilization: 'Uygurlar',
      fact: 'Yerleşik hayata geçen, matbaa ve kağıdı kullanan ilk Türk devleti.',
      options: ['Uygurlar', 'Hunlar', 'Göktürkler', 'Avarlar'],
      hint: 'Maniheizm dinini benimsemişlerdir.'
    }
  ];

  // Açı Avcısı State
  const [aciScore, setAciScore] = useState(0);
  const [aciStep, setAciStep] = useState(0);
  const aciQuestions = [
    {
      type: 'Tümler Açı',
      given: 38,
      target: 90,
      question: 'Ölçüsü 38° olan bir açının TÜMLERİ kaç derecedir? (Toplam = 90°)',
      answer: 52,
      options: [52, 142, 62, 42]
    },
    {
      type: 'Bütünler Açı',
      given: 115,
      target: 180,
      question: 'Ölçüsü 115° olan bir açının BÜTÜNLERİ kaç derecedir? (Toplam = 180°)',
      answer: 65,
      options: [65, 75, 85, 55]
    },
    {
      type: 'Üçgen İç Açıları',
      given: [60, 70],
      target: 180,
      question: 'Bir üçgenin iki iç açısı 60° ve 70° ise üçüncü bilinmeyen açısı kaç derecedir?',
      answer: 50,
      options: [50, 60, 40, 70]
    },
    {
      type: 'Z-Kuralı (İç Ters Açı)',
      given: 45,
      target: 45,
      question: 'Paralel iki doğru arasında Z kuralına göre iç açılardan biri 45° ise diğeri kaçtır?',
      answer: 45,
      options: [45, 135, 90, 60]
    }
  ];

  // Harita Fatihi State
  const [haritaScore, setHaritaScore] = useState(0);
  const [haritaStep, setHaritaStep] = useState(0);
  const haritaQuestions = [
    {
      region: 'Karadeniz Bölgesi',
      question: 'Her mevsim yağışlı geçen, doğal bitki örtüsü gür ormanlar olan ve çay/fındık tarımı yapılan iklim tipi hangisidir?',
      answer: 'Karadeniz İklimi',
      options: ['Karadeniz İklimi', 'Akdeniz İklimi', 'Karasal İklim', 'Muson İklimi']
    },
    {
      region: 'İç Anadolu & Doğu Anadolu',
      question: 'Yazları sıcak ve kurak, kışları soğuk ve kar yağışlı, bitki örtüsü bozkır olan geniş iklim tipi hangisidir?',
      answer: 'Karasal İklim',
      options: ['Karasal İklim', 'Akdeniz İklimi', 'Ekvatoral İklim', 'Karadeniz İklimi']
    },
    {
      region: 'Tarihi Ticaret Yolu',
      question: 'Çin\'den başlayıp Orta Asya üzerinden Anadolu ve Avrupa\'ya uzanan dünyaca ünlü kervan yolu hangisidir?',
      answer: 'İpek Yolu',
      options: ['İpek Yolu', 'Baharat Yolu', 'Kral Yolu', 'Kürk Yolu']
    }
  ];

  // Bilgi Çarkı State
  const [carkiIsSpinning, setCarkiIsSpinning] = useState(false);
  const [carkiQuestion, setCarkiQuestion] = useState<{ subject: string; q: string; ans: string; options: string[] } | null>(null);
  const [carkiScore, setCarkiScore] = useState(0);

  // Generate random Mat-Roket problem
  const generateRoketQuestion = () => {
    const types = ['add', 'sub', 'mult', 'power'];
    const selected = types[Math.floor(Math.random() * types.length)];
    let q = '';
    let ans = 0;

    if (selected === 'add') {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 20) + 5;
      q = `${a} + ${b} = ?`;
      ans = a + b;
    } else if (selected === 'sub') {
      const a = Math.floor(Math.random() * 30) + 20;
      const b = Math.floor(Math.random() * 15) + 5;
      q = `${a} - ${b} = ?`;
      ans = a - b;
    } else if (selected === 'mult') {
      const a = Math.floor(Math.random() * 9) + 4;
      const b = Math.floor(Math.random() * 9) + 3;
      q = `${a} × ${b} = ?`;
      ans = a * b;
    } else {
      const base = Math.floor(Math.random() * 4) + 2;
      const exp = Math.floor(Math.random() * 2) + 2; // 2^2, 3^2, 2^3 vb.
      q = `${base}^${exp} (Üslü Sayı) = ?`;
      ans = Math.pow(base, exp);
    }

    const wrong1 = ans + (Math.random() > 0.5 ? 2 : -2);
    const wrong2 = ans + (Math.random() > 0.5 ? 5 : -4);
    const wrong3 = ans + 10;
    const opts = [ans, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);

    setRoketQuestion({ q, ans, options: opts });
  };

  const handleRoketAnswer = (selectedOpt: number) => {
    if (selectedOpt === roketQuestion.ans) {
      soundManager.playCorrect();
      const nextAltitude = Math.min(100, roketAltitude + 20);
      const nextScore = roketScore + 100 + roketStreak * 20;
      const nextStreak = roketStreak + 1;
      setRoketAltitude(nextAltitude);
      setRoketScore(nextScore);
      setRoketStreak(nextStreak);

      if (nextAltitude >= 100) {
        setRoketGameOver(true);
        soundManager.playBadgeUnlock();
        confetti({ particleCount: 100, spread: 80 });
        onGameWin('matRoket', nextScore, 100);
      } else {
        generateRoketQuestion();
      }
    } else {
      soundManager.playWrong();
      setRoketStreak(0);
      setRoketAltitude(prev => Math.max(0, prev - 10));
    }
  };

  const handleTarihAnswer = (opt: string) => {
    const currentQ = tarihQuestions[tarihStep];
    if (opt === currentQ.civilization) {
      soundManager.playCorrect();
      const nextScore = tarihScore + 150;
      setTarihScore(nextScore);

      if (tarihStep + 1 < tarihQuestions.length) {
        setTarihStep(tarihStep + 1);
      } else {
        soundManager.playBadgeUnlock();
        confetti({ particleCount: 80, spread: 70 });
        onGameWin('tarihDedektifi', nextScore, 120);
      }
    } else {
      soundManager.playWrong();
    }
  };

  const handleAciAnswer = (opt: number) => {
    const currentQ = aciQuestions[aciStep];
    if (opt === currentQ.answer) {
      soundManager.playCorrect();
      const nextScore = aciScore + 120;
      setAciScore(nextScore);

      if (aciStep + 1 < aciQuestions.length) {
        setAciStep(aciStep + 1);
      } else {
        soundManager.playBadgeUnlock();
        confetti({ particleCount: 80, spread: 70 });
        onGameWin('aciAvcisi', nextScore, 100);
      }
    } else {
      soundManager.playWrong();
    }
  };

  const handleHaritaAnswer = (opt: string) => {
    const currentQ = haritaQuestions[haritaStep];
    if (opt === currentQ.answer) {
      soundManager.playCorrect();
      const nextScore = haritaScore + 150;
      setHaritaScore(nextScore);

      if (haritaStep + 1 < haritaQuestions.length) {
        setHaritaStep(haritaStep + 1);
      } else {
        soundManager.playBadgeUnlock();
        confetti({ particleCount: 80, spread: 70 });
        onGameWin('haritaFatihi', nextScore, 110);
      }
    } else {
      soundManager.playWrong();
    }
  };

  const spinCarki = () => {
    if (carkiIsSpinning) return;
    setCarkiIsSpinning(true);
    soundManager.playCheckpointBeep();

    setTimeout(() => {
      setCarkiIsSpinning(false);
      const isMath = Math.random() > 0.5;
      if (isMath) {
        setCarkiQuestion({
          subject: '📐 Matematik Çarkı',
          q: '3x + 12 = 27 denkleminde x kaçtır?',
          ans: '5',
          options: ['3', '5', '7', '9']
        });
      } else {
        setCarkiQuestion({
          subject: '🌍 Sosyal Bilgiler Çarkı',
          q: 'İlk düzenli posta teşkilatını kuran ve kütüphane inşa eden Mezopotamya uygarlığı hangisidir?',
          ans: 'Asurlar',
          options: ['Asurlar', 'Babiller', 'Hititler', 'Urartular']
        });
      }
    }, 1200);
  };

  const handleCarkiAnswer = (opt: string) => {
    if (!carkiQuestion) return;
    if (opt === carkiQuestion.ans) {
      soundManager.playCorrect();
      const nextScore = carkiScore + 200;
      setCarkiScore(nextScore);
      confetti({ particleCount: 50, spread: 60 });
      onGameWin('bilgiCarki', nextScore, 80);
      setCarkiQuestion(null);
    } else {
      soundManager.playWrong();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">
                SOS-MAT Eğitsel Oyunlar & Etkinlik Arenası
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                5 İnteraktif Oyun
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Matematik ve Sosyal Bilgiler kazanımlarını pekiştiren, XP ve rozet kazandıran dinamik etkinlikler
            </p>
          </div>
        </div>

        {activeGame !== 'hub' && (
          <button
            onClick={() => setActiveGame('hub')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 self-start md:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Oyun Menüsüne Dön</span>
          </button>
        )}
      </div>

      {/* GAME HUB MENU */}
      {activeGame === 'hub' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Game 1: Mat-Roket */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-indigo-500/60 transition shadow-xl group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  📐 Matematik
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">Mat-Roket: Uzay Uçuşu</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Hızlı zihinden işlemler, üslü sayılar ve denklemleri doğru çözerek roketi aya ulaştır!
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-bold">En Yüksek: {student.gameHighScores.matRoket} Puan</span>
              <button
                onClick={() => {
                  setActiveGame('matRoket');
                  setRoketAltitude(0);
                  setRoketScore(0);
                  setRoketGameOver(false);
                  generateRoketQuestion();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Oyna</span>
              </button>
            </div>
          </div>

          {/* Game 2: Tarih Dedektifi */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-amber-500/60 transition shadow-xl group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  🌍 Sosyal Bilgiler
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">Tarih Dedektifi</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Mezopotamya, Anadolu uygarlıkları ve ilk Türk devletleri eser/olay eşleştirme dedektifliği.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-bold">En Yüksek: {student.gameHighScores.tarihDedektifi} Puan</span>
              <button
                onClick={() => {
                  setActiveGame('tarihDedektifi');
                  setTarihStep(0);
                  setTarihScore(0);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Oyna</span>
              </button>
            </div>
          </div>

          {/* Game 3: Açı Avcısı */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-500/60 transition shadow-xl group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition">
                <Shapes className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  📐 Geometri & Açı
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">Açı Avcısı & Geometri Lab</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tümler (90°), Bütünler (180°), Z kuralı ve üçgen açılarında kayıp açıları avla!
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-bold">En Yüksek: {student.gameHighScores.aciAvcisi} Puan</span>
              <button
                onClick={() => {
                  setActiveGame('aciAvcisi');
                  setAciStep(0);
                  setAciScore(0);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Oyna</span>
              </button>
            </div>
          </div>

          {/* Game 4: Harita Fatihi */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-cyan-500/60 transition shadow-xl group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  🌍 Coğrafya
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">Harita ve İklim Fatihi</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Türkiye iklim tipleri, bitki örtüleri ve tarihi ticaret yollarını harita üzerinde keşfet!
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-bold">En Yüksek: {student.gameHighScores.haritaFatihi} Puan</span>
              <button
                onClick={() => {
                  setActiveGame('haritaFatihi');
                  setHaritaStep(0);
                  setHaritaScore(0);
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Oyna</span>
              </button>
            </div>
          </div>

          {/* Game 5: Sos-Mat Bilgi Çarkı */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-purple-500/60 transition shadow-xl group flex flex-col justify-between md:col-span-2 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      ⚡ Karışık Düello
                    </span>
                    <h3 className="text-lg font-extrabold text-white">Sos-Mat Bilgi Çarkı & Hızlı Düello</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Çarkı çevir, şansına gelen Matematik veya Sosyal Bilgiler sorusuna süreli cevap verip 2 kat XP kazan!
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveGame('bilgiCarki');
                  setCarkiScore(0);
                  setCarkiQuestion(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Çarkı Çevir & Başla</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME 1: MAT-ROKET PLAY AREA */}
      {activeGame === 'matRoket' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Rocket className="w-6 h-6 text-indigo-400 animate-bounce" />
              <div>
                <h3 className="text-base font-extrabold text-white">Mat-Roket: Ay Görevi</h3>
                <p className="text-xs text-slate-400">Soruları çözdükçe roket atmosferi geçer!</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-amber-400 font-bold">Puan: {roketScore}</span>
              <span className="text-emerald-400 font-bold">Seri: {roketStreak}x 🔥</span>
            </div>
          </div>

          {/* Rocket Altitude Visual Track */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-bold">
              <span>Yer Seviyesi (0 km)</span>
              <span className="text-indigo-400">Atmosfer (%{roketAltitude})</span>
              <span>🌕 Ay Yüzeyi (Hedef)</span>
            </div>
            <div className="w-full bg-slate-800 h-6 rounded-full overflow-hidden relative flex items-center p-1">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${roketAltitude}%` }}
              />
              <span 
                className="absolute text-sm transition-all duration-500"
                style={{ left: `calc(${roketAltitude}% - 12px)` }}
              >
                🚀
              </span>
            </div>
          </div>

          {!roketGameOver ? (
            <div className="space-y-6 max-w-lg mx-auto text-center">
              <div className="bg-slate-800/80 border border-indigo-500/30 p-6 rounded-2xl shadow-xl">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest block mb-2">
                  Matematik Roket Yakıt Sorusu:
                </span>
                <h4 className="text-3xl font-extrabold text-white font-mono">{roketQuestion.q}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {roketQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRoketAnswer(opt)}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-indigo-600/80 border border-slate-700 hover:border-indigo-400 text-white font-extrabold text-lg transition shadow-lg active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-extrabold text-white">🎉 TEBRİKLER! ROKET AYA ULAŞTI!</h3>
              <p className="text-sm text-slate-300">
                Toplam Puan: <strong className="text-amber-400 font-mono text-base">{roketScore}</strong> (+100 XP ve Rozet İlerlemesi!)
              </p>
              <button
                onClick={() => {
                  setRoketAltitude(0);
                  setRoketScore(0);
                  setRoketGameOver(false);
                  generateRoketQuestion();
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
              >
                Yeniden Oyna
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: TARİH DEDEKTİFİ PLAY AREA */}
      {activeGame === 'tarihDedektifi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Compass className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-base font-extrabold text-white">Tarih Dedektifi</h3>
                <p className="text-xs text-slate-400">Soru: {tarihStep + 1} / {tarihQuestions.length}</p>
              </div>
            </div>
            <span className="text-amber-400 font-mono font-bold text-xs">Puan: {tarihScore}</span>
          </div>

          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-slate-800/80 border border-amber-500/30 p-6 rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>İpucu: {tarihQuestions[tarihStep].hint}</span>
              </div>
              <h4 className="text-base font-bold text-white leading-relaxed">
                "{tarihQuestions[tarihStep].fact}"
              </h4>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 block text-center">
                Bu tarihi bilgi hangi medeniyete aittir?
              </span>
              <div className="grid grid-cols-2 gap-3">
                {tarihQuestions[tarihStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTarihAnswer(opt)}
                    className="p-3.5 rounded-xl bg-slate-800 hover:bg-amber-600 hover:text-slate-950 border border-slate-700 text-white font-bold text-xs transition shadow"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAME 3: AÇI AVCISI PLAY AREA */}
      {activeGame === 'aciAvcisi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Shapes className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-base font-extrabold text-white">Açı Avcısı & Geometri Lab</h3>
                <p className="text-xs text-slate-400">Açı Meydan Okuması {aciStep + 1} / {aciQuestions.length}</p>
              </div>
            </div>
            <span className="text-emerald-400 font-mono font-bold text-xs">Puan: {aciScore}</span>
          </div>

          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-slate-800/80 border border-emerald-500/30 p-6 rounded-2xl shadow-xl space-y-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {aciQuestions[aciStep].type}
              </span>
              <h4 className="text-base font-bold text-white leading-relaxed">
                {aciQuestions[aciStep].question}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {aciQuestions[aciStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAciAnswer(opt)}
                  className="p-4 rounded-xl bg-slate-800 hover:bg-emerald-600 border border-slate-700 text-white font-extrabold text-base transition shadow"
                >
                  {opt}°
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GAME 4: HARİTA VE İKLİM FATİHİ PLAY AREA */}
      {activeGame === 'haritaFatihi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="text-base font-extrabold text-white">Harita ve İklim Fatihi</h3>
                <p className="text-xs text-slate-400">Keşif {haritaStep + 1} / {haritaQuestions.length}</p>
              </div>
            </div>
            <span className="text-cyan-400 font-mono font-bold text-xs">Puan: {haritaScore}</span>
          </div>

          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-slate-800/80 border border-cyan-500/30 p-6 rounded-2xl shadow-xl space-y-2">
              <span className="text-xs font-bold text-cyan-300 block">
                Konum / Bölge: {haritaQuestions[haritaStep].region}
              </span>
              <h4 className="text-base font-bold text-white leading-relaxed">
                {haritaQuestions[haritaStep].question}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {haritaQuestions[haritaStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHaritaAnswer(opt)}
                  className="p-3.5 rounded-xl bg-slate-800 hover:bg-cyan-600 hover:text-white border border-slate-700 text-white font-bold text-xs transition shadow"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GAME 5: SOS-MAT BİLGİ ÇARKI */}
      {activeGame === 'bilgiCarki' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl text-center">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Sos-Mat Bilgi Çarkı
            </h3>
            <span className="text-purple-400 font-mono font-bold text-xs">Toplam Puan: {carkiScore}</span>
          </div>

          {!carkiQuestion ? (
            <div className="space-y-6 py-6 max-w-sm mx-auto">
              <div className={`w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 p-2 flex items-center justify-center shadow-2xl ${
                carkiIsSpinning ? 'animate-spin' : ''
              }`}>
                <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-white font-extrabold text-xs">
                  <span>📐 MAT</span>
                  <span>⚡ VS ⚡</span>
                  <span>🌍 SOS</span>
                </div>
              </div>

              <button
                disabled={carkiIsSpinning}
                onClick={spinCarki}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-purple-600/30 transition"
              >
                {carkiIsSpinning ? 'Çark Dönüyor...' : 'ÇARKI ÇEVİR!'}
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-5 text-left bg-slate-800/80 p-6 rounded-2xl border border-purple-500/30">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {carkiQuestion.subject}
              </span>
              <h4 className="text-sm font-bold text-white">{carkiQuestion.q}</h4>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {carkiQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleCarkiAnswer(opt)}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-purple-600 text-white font-bold text-xs border border-slate-700 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
