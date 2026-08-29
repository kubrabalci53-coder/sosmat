import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Crown,
  BookOpen,
  Calculator,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { dbService, sanitizeInput } from '../utils/supabaseClient';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface AuthProps {
  onLoginSuccess: (user: AuthUser) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const AuthModalOrScreen: React.FC<AuthProps> = ({
  onLoginSuccess,
  currentUser,
  onLogout,
}) => {
  // 'login' (Kırmızı Tema) or 'register' (Pembe Tema)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login Role: 'teacher' or 'student'
  const [loginRole, setLoginRole] = useState<UserRole>('student');

  // Form states
  const [teacherUsername, setTeacherUsername] = useState('sevgi demir');
  const [teacherPassword, setTeacherPassword] = useState('12345');
  const [studentLoginPassword, setStudentLoginPassword] = useState('');
  const [studentRegisterPassword, setStudentRegisterPassword] = useState('');
  const [studentRegisterPasswordConfirm, setStudentRegisterPasswordConfirm] = useState('');

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Security brute force rate limiter (client-side protection)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;
    setErrorMessage(null);
    setLoading(true);

    const cleanUser = sanitizeInput(teacherUsername);
    const cleanPass = sanitizeInput(teacherPassword);

    const result = await dbService.loginTeacher(cleanUser, cleanPass);
    setLoading(false);

    if (result.success && result.user) {
      soundManager.playCorrect();
      confetti({ particleCount: 80, spread: 70 });
      onLoginSuccess(result.user);
    } else {
      soundManager.playWrong();
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutTimer(30);
        setErrorMessage('Güvenlik Kilidi: 5 hatalı deneme yapıldı. Lütfen 30 saniye bekleyiniz.');
      } else {
        setErrorMessage(result.error || 'Giriş başarısız!');
      }
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;
    setErrorMessage(null);
    setLoading(true);

    const cleanPass = sanitizeInput(studentLoginPassword);
    const result = await dbService.loginStudent(cleanPass);
    setLoading(false);

    if (result.success && result.user) {
      soundManager.playCorrect();
      confetti({ particleCount: 70, spread: 60 });
      onLoginSuccess(result.user);
    } else {
      soundManager.playWrong();
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutTimer(30);
        setErrorMessage('Güvenlik Kilidi: 5 hatalı deneme. Lütfen 30 saniye bekleyiniz.');
      } else {
        setErrorMessage(result.error || 'Bu şifreye ait öğrenci bulunamadı. Lütfen kayıt sekmesinden oluşturunuz!');
      }
    }
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const pass1 = sanitizeInput(studentRegisterPassword);
    const pass2 = sanitizeInput(studentRegisterPasswordConfirm);

    if (!pass1) {
      setErrorMessage('Lütfen bir öğrenci şifresi belirleyiniz!');
      return;
    }

    if (pass1.length < 3) {
      setErrorMessage('Şifre en az 3 karakterden oluşmalıdır!');
      return;
    }

    if (pass1 !== pass2) {
      setErrorMessage('Girdiğiniz şifreler birbiriyle eşleşmiyor!');
      return;
    }

    setLoading(true);
    const result = await dbService.registerStudent(pass1);
    setLoading(false);

    if (result.success && result.user) {
      soundManager.playBadgeUnlock();
      confetti({ particleCount: 100, spread: 80 });
      
      // Clear register fields
      setStudentRegisterPassword('');
      setStudentRegisterPasswordConfirm('');

      // Pre-fill student login password for smooth login experience
      setStudentLoginPassword(pass1);
      
      // Redirect to Login Screen (Kırmızı Tema) as requested
      setAuthMode('login');
      setLoginRole('student');
      setSuccessMessage(`🎉 Kaydınız başarıyla tamamlandı! Oluşturulan Öğrenci Rumuzunuz: "${result.user.studentName}". Lütfen şifreniz ile giriş yapınız.`);
    } else {
      soundManager.playWrong();
      setErrorMessage(result.error || 'Kayıt işlemi başarısız!');
    }
  };

  // Background mathematical & historical symbols collection
  const mathSymbols = [
    { symbol: '∑ (n=1..∞)', top: '8%', left: '4%', size: 'text-2xl', delay: '0s' },
    { symbol: 'π ≈ 3.14159', top: '24%', left: '88%', size: 'text-xl', delay: '1s' },
    { symbol: '√x² + y²', top: '75%', left: '6%', size: 'text-2xl', delay: '2s' },
    { symbol: '∫ f(x)dx', top: '85%', left: '85%', size: 'text-3xl', delay: '1.5s' },
    { symbol: 'x = (-b ± √Δ)/2a', top: '15%', left: '78%', size: 'text-sm', delay: '2.5s' },
    { symbol: 'a² + b² = c²', top: '65%', left: '90%', size: 'text-base', delay: '0.5s' },
    { symbol: '📐 90° Tümler & 180° Bütünler', top: '42%', left: '2%', size: 'text-xs', delay: '3s' },
    { symbol: 'lim x→∞ (1 + 1/x)ˣ = e', top: '92%', left: '40%', size: 'text-xs', delay: '2s' },
    { symbol: 'sin²θ + cos²θ = 1', top: '4%', left: '45%', size: 'text-sm', delay: '1s' },
  ];

  const historicalSultans = [
    { 
      name: 'Fatih Sultan Mehmet', 
      title: 'İstanbul\'un Fatihi (1453)', 
      top: '12%', 
      left: '14%', 
      motif: '👑 1453 Fetih Tuğrası' 
    },
    { 
      name: 'Kanuni Sultan Süleyman', 
      title: 'Muhteşem Kanun & Adalet Çağı', 
      top: '20%', 
      left: '70%', 
      motif: '⚖️ Adalet Divanı' 
    },
    { 
      name: 'Bilge Kağan & Tonyukuk', 
      title: 'Orhun Kitabeleri & Türk Tarihi', 
      top: '70%', 
      left: '75%', 
      motif: '🏛️ Göktürk Damgası' 
    },
    { 
      name: 'Sümerler & Kral Hamurabi', 
      title: 'Çivi Yazısı & İlk Kanunlar', 
      top: '78%', 
      left: '18%', 
      motif: '📜 Ziggurat & Çivi Yazısı' 
    },
    { 
      name: 'Lidyalılar & Kral Yolu', 
      title: 'İlk Paranın İcadı & Ticaret', 
      top: '48%', 
      left: '86%', 
      motif: '🪙 Kral Yolu Ticareti' 
    },
  ];

  const isLogin = authMode === 'login';

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center p-4 transition-colors duration-700 font-sans ${
      isLogin 
        ? 'bg-gradient-to-br from-red-950 via-slate-950 to-rose-950 text-slate-100' 
        : 'bg-gradient-to-br from-pink-950 via-slate-950 to-purple-950 text-slate-100'
    }`}>
      {/* BACKGROUND FLOATING MATH SYMBOLS */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20">
        {mathSymbols.map((item, idx) => (
          <div
            key={idx}
            className={`absolute font-mono font-bold ${item.size} text-amber-300/60 animate-pulse`}
            style={{ top: item.top, left: item.left, animationDelay: item.delay }}
          >
            {item.symbol}
          </div>
        ))}

        {/* BACKGROUND HISTORICAL SULTANS & CIVILIZATION BADGES */}
        {historicalSultans.map((sultan, idx) => (
          <div
            key={`sultan-${idx}`}
            className="absolute hidden md:flex flex-col items-center bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-3 rounded-2xl shadow-xl text-center max-w-[200px]"
            style={{ top: sultan.top, left: sultan.left }}
          >
            <span className="text-sm font-bold text-amber-300">{sultan.motif}</span>
            <span className="text-xs font-extrabold text-white mt-1">{sultan.name}</span>
            <span className="text-[10px] text-slate-400">{sultan.title}</span>
          </div>
        ))}
      </div>

      {/* AMBIENT GLOW ORBS */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700 ${
        isLogin ? 'bg-red-600' : 'bg-pink-600'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700 ${
        isLogin ? 'bg-rose-700' : 'bg-fuchsia-600'
      }`} />

      {/* MAIN AUTH CARD */}
      <div className={`relative z-10 w-full max-w-md rounded-3xl backdrop-blur-xl border p-6 sm:p-8 shadow-2xl transition-all duration-500 ${
        isLogin 
          ? 'bg-slate-900/90 border-red-500/40 shadow-red-950/50' 
          : 'bg-slate-900/90 border-pink-500/40 shadow-pink-950/50'
      }`}>
        
        {/* TOP BRAND HEADER */}
        <div className="text-center space-y-2 pb-5 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold mb-1">
            <span className="text-amber-400">📐 SOS-MAT</span>
            <span className="text-slate-400">•</span>
            <span className={isLogin ? 'text-red-400 font-extrabold' : 'text-pink-400 font-extrabold'}>
              {isLogin ? 'GİRİŞ KAPISI (KIRMIZI)' : 'KAYIT KAPISI (PEMBE)'}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            Sosyal & Matematik Portalı
          </h1>
          <p className="text-xs text-slate-400">
            MEB Müfredatı, Canlı Mesajlaşma, Süper Uygulamalar ve Güvenli Veritabanı
          </p>
        </div>

        {/* MODE TOGGLE SWITCH (GİRİŞ - KIRMIZI VS KAYIT - PEMBE) */}
        <div className="grid grid-cols-2 gap-2 my-5 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
              isLogin 
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Giriş Yap (Kırmızı)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
              !isLogin 
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Öğrenci Kayıt (Pembe)</span>
          </button>
        </div>

        {/* ERROR / SUCCESS ALERTS */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {lockoutTimer > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Güvenlik kilidi aktif: {lockoutTimer} saniye sonra tekrar deneyiniz.</span>
          </div>
        )}

        {/* ----------------- LOGIN VIEW (KIRMIZI TEMA) ----------------- */}
        {isLogin && (
          <div className="space-y-4">
            {/* ROLE SELECTOR: ÖĞRETMEN (YÖNETİCİ) VS ÖĞRENCİ */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('student');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  loginRole === 'student'
                    ? 'bg-red-600/30 border border-red-500 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>Öğrenci Girişi (Sadece Şifre)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginRole('teacher');
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  loginRole === 'teacher'
                    ? 'bg-red-600/30 border border-red-500 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Öğretmen / Yönetici</span>
              </button>
            </div>

            {/* STUDENT LOGIN FORM (ONLY PASSWORD AS REQUESTED) */}
            {loginRole === 'student' && (
              <form onSubmit={handleStudentLogin} className="space-y-4 pt-1">
                <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-2xl text-[11px] text-slate-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Öğrenciler için ad, soyad veya mail gerekmez. Sadece belirlediğiniz şifrenizle giriş yapabilirsiniz.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                    <span>Öğrenci Giriş Şifresi</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={studentLoginPassword}
                      onChange={(e) => setStudentLoginPassword(e.target.value)}
                      placeholder="Öğrenci şifrenizi giriniz..."
                      className="w-full bg-slate-950 border border-red-900/60 focus:border-red-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || lockoutTimer > 0}
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Giriş Yapılıyor...' : 'ÖĞRENCİ PORTALINA GİRİŞ YAP'}</span>
                </button>

                {/* Not registered prompt */}
                <div className="pt-2 text-center">
                  <div className="p-3 bg-pink-950/30 border border-pink-500/30 rounded-2xl flex flex-col items-center gap-1.5">
                    <span className="text-xs text-pink-200 font-medium">Sisteme henüz kayıtlı değil misiniz?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 hover:text-white border border-pink-500/50 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <span>Buradan Hemen Kayıt Olun (Pembe Ekran)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TEACHER / ADMIN LOGIN FORM (sevgi demir / 12345) */}
            {loginRole === 'teacher' && (
              <form onSubmit={handleTeacherLogin} className="space-y-4 pt-1">
                <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Yönetici Öğretmen: Kullanıcı adı: <strong>sevgi demir</strong>, Şifre: <strong>12345</strong></span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Öğretmen Kullanıcı Adı</label>
                  <input
                    type="text"
                    required
                    value={teacherUsername}
                    onChange={(e) => setTeacherUsername(e.target.value)}
                    placeholder="sevgi demir"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none transition font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Yönetici Şifresi</label>
                  <input
                    type="password"
                    required
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    placeholder="12345"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none transition font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || lockoutTimer > 0}
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Crown className="w-4 h-4" />
                  <span>{loading ? 'Yetkilendiriliyor...' : 'YÖNETİCİ & ÖĞRETMEN GİRİŞİ'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ----------------- REGISTER VIEW (PEMBE TEMA) ----------------- */}
        {!isLogin && (
          <form onSubmit={handleStudentRegister} className="space-y-4">
            <div className="p-3 bg-pink-950/50 border border-pink-500/30 rounded-2xl text-[11px] text-pink-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <span>
                Öğrenci Kaydı: <strong>İsim, soyisim veya e-posta istenmez!</strong> Sadece aklınızda tutacağınız bir şifre belirleyin. Sistem size otomatik bir öğrenci kimliği atar.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                <span>Yeni Öğrenci Şifrenizi Belirleyin</span>
              </label>
              <input
                type="password"
                required
                value={studentRegisterPassword}
                onChange={(e) => setStudentRegisterPassword(e.target.value)}
                placeholder="Örn: 2026mat, ali123 vb."
                className="w-full bg-slate-950 border border-pink-900/60 focus:border-pink-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Şifrenizi Tekrar Giriniz (Doğrulama)</span>
              </label>
              <input
                type="password"
                required
                value={studentRegisterPasswordConfirm}
                onChange={(e) => setStudentRegisterPasswordConfirm(e.target.value)}
                placeholder="Şifreyi tekrar yazınız..."
                className="w-full bg-slate-950 border border-pink-900/60 focus:border-pink-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-rose-400 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-pink-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Hesap Açılıyor...' : 'ÖĞRENCİ HESABIMI HEMEN OLUŞTUR'}</span>
            </button>

            {/* Already registered prompt */}
            <div className="pt-2 text-center">
              <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-2xl flex flex-col items-center gap-1.5">
                <span className="text-xs text-red-200 font-medium">Zaten bir hesabınız veya şifreniz var mı?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginRole('student');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 hover:text-white border border-red-500/50 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-red-400" />
                  <span>Giriş Ekranına Dön (Kırmızı Ekran)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* BOTTOM SECURITY & FOOTER BADGE */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase TLS & RLS Korumalı</span>
          </div>

          <span className="font-mono text-slate-500">v3.2 Real-time SOS-MAT</span>
        </div>
      </div>
    </div>
  );
};
