import React, { useState } from 'react';
import { 
  Menu, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Edit3, 
  School,
  CheckCircle2
} from 'lucide-react';
import { TeacherProfile, SubjectType } from '../types';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  teacher: TeacherProfile;
  onUpdateTeacher: (updated: TeacherProfile) => void;
  selectedSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  onOpenMobileMenu: () => void;
  pageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  teacher,
  onUpdateTeacher,
  selectedSubject,
  onSelectSubject,
  onOpenMobileMenu,
  pageTitle,
}) => {
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [teacherNameInput, setTeacherNameInput] = useState(teacher.name);
  const [teacherTitleInput, setTeacherTitleInput] = useState(teacher.title);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    if (!next) {
      soundManager.playCorrect();
    }
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacher({
      ...teacher,
      name: teacherNameInput.trim() || 'Kübra Balcı',
      title: teacherTitleInput.trim() || 'Uzman Öğretmen',
    });
    setIsEditingTeacher(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          aria-label="Menüyü Aç"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight">{pageTitle}</h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Canlı Sistem
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">Sosyal Bilgiler & Matematik Entegre Öğrenci Takip Sistemi</p>
        </div>
      </div>

      {/* Middle: Subject Filter Pills */}
      <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
        <button
          onClick={() => onSelectSubject('genel')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedSubject === 'genel'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tüm Alanlar
        </button>
        <button
          onClick={() => onSelectSubject('matematik')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
            selectedSubject === 'matematik'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-blue-300'
          }`}
        >
          <span>📐</span> Matematik
        </button>
        <button
          onClick={() => onSelectSubject('sosyal')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
            selectedSubject === 'sosyal'
              ? 'bg-amber-600 text-white shadow'
              : 'text-slate-400 hover:text-amber-300'
          }`}
        >
          <span>🌍</span> Sosyal Bilgiler
        </button>
      </div>

      {/* Right Section: Teacher Info (Sağ Üst Öğretmen Adı Soyadı) & Controls */}
      <div className="flex items-center gap-3">
        {/* Sound toggle */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          className={`p-2 rounded-xl border transition ${
            isMuted 
              ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' 
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Branch Selector */}
        <div className="hidden xl:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/60 text-xs">
          <School className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Şube:</span>
          <select 
            value={teacher.selectedBranch}
            onChange={(e) => onUpdateTeacher({ ...teacher, selectedBranch: e.target.value })}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
          >
            {teacher.branches.map(b => (
              <option key={b} value={b} className="bg-slate-800 text-white">{b}</option>
            ))}
          </select>
        </div>

        {/* Teacher Card (Sağ Üste Öğretmenin Adı Soyadı) */}
        <div className="relative">
          <div 
            onClick={() => setIsEditingTeacher(!isEditingTeacher)}
            className="flex items-center gap-3 bg-gradient-to-r from-slate-800/90 to-slate-800/60 hover:from-slate-800 hover:to-slate-700/80 border border-slate-700/80 hover:border-indigo-500/50 px-3 py-1.5 rounded-xl cursor-pointer transition shadow-sm group"
          >
            <div className="relative">
              <img 
                src={teacher.avatar} 
                alt={teacher.name} 
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/40 group-hover:ring-indigo-400 transition"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition flex items-center gap-1">
                  {teacher.name}
                  <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span className="font-medium text-indigo-400">{teacher.title}</span>
                <span>•</span>
                <span className="text-slate-400 font-semibold">{teacher.selectedBranch}</span>
              </div>
            </div>
          </div>

          {/* Teacher Quick Edit Modal Dropdown */}
          {isEditingTeacher && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-3 border-b border-slate-700/60 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Öğretmen Bilgisini Düzenle
                </span>
                <span className="text-[10px] text-slate-400">Sağ Üst Profil</span>
              </div>
              <form onSubmit={handleSaveTeacher} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Ad Soyad</label>
                  <input 
                    type="text" 
                    value={teacherNameInput}
                    onChange={(e) => setTeacherNameInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-indigo-500"
                    placeholder="Öğretmen Adı Soyadı"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Ünvan / Branş</label>
                  <input 
                    type="text" 
                    value={teacherTitleInput}
                    onChange={(e) => setTeacherTitleInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-indigo-500"
                    placeholder="Örn: Uzman Öğretmen"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingTeacher(false)}
                    className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
