import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Gamepad2, 
  Calculator, 
  Compass, 
  Layers, 
  Video, 
  BookOpen, 
  Eye, 
  CheckCircle2,
  Search,
  Filter,
  Play,
  Share2,
  Crown
} from 'lucide-react';
import { AuthUser, EducationalApp, NavTab } from '../types';
import { dbService, defaultEducationalApps, sanitizeInput } from '../utils/supabaseClient';
import { soundManager } from '../utils/soundEffects';

interface AppManagerProps {
  currentUser: AuthUser;
  onNavigateTab: (tab: NavTab) => void;
}

export const EducationalAppManager: React.FC<AppManagerProps> = ({
  currentUser,
  onNavigateTab,
}) => {
  const isTeacher = currentUser.role === 'teacher';

  const [apps, setApps] = useState<EducationalApp[]>(defaultEducationalApps);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New App Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'matematik' | 'sosyal' | 'oyun' | 'arac' | 'video' | 'kaynak'>('matematik');
  const [newDescription, setNewDescription] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newTargetTab, setNewTargetTab] = useState<string>('games');

  const fetchApps = async () => {
    const list = await dbService.getEducationalApps();
    setApps(list);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = sanitizeInput(newTitle);
    const cleanDesc = sanitizeInput(newDescription);
    const cleanLink = newLinkUrl.trim();

    if (!cleanTitle || !cleanDesc) return;

    await dbService.addEducationalApp({
      title: cleanTitle,
      category: newCategory,
      description: cleanDesc,
      icon: newCategory === 'matematik' ? 'Calculator' : newCategory === 'sosyal' ? 'Compass' : 'Gamepad2',
      link_url: cleanLink || undefined,
      target_tab: newTargetTab,
      is_active: true,
      added_by: currentUser.username || 'sevgi demir',
    });

    soundManager.playLevelUp();
    setIsAddingNew(false);
    setNewTitle('');
    setNewDescription('');
    setNewLinkUrl('');
    fetchApps();
  };

  const handleDeleteApp = async (appId: string) => {
    if (confirm('Bu uygulamayı silmek istediğinizden emin misiniz?')) {
      await dbService.deleteEducationalApp(appId);
      soundManager.playCorrect();
      fetchApps();
    }
  };

  const handleLaunchApp = async (app: EducationalApp) => {
    soundManager.playCorrect();

    // Log tracking in Supabase
    await dbService.logActivity({
      student_id: currentUser.id,
      student_name: currentUser.studentName || currentUser.username || 'Öğrenci',
      student_class: currentUser.classGrade || '6-A',
      target_type: app.category === 'oyun' ? 'game' : 'app',
      target_id: app.id,
      target_title: app.title,
      action: 'click',
      duration_seconds: 120,
    });

    // If internal tab
    if (app.target_tab && app.target_tab !== 'external') {
      onNavigateTab(app.target_tab as NavTab);
    } else if (app.link_url) {
      window.open(app.link_url, '_blank');
    }
  };

  const filteredApps = apps.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    return (
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'matematik':
        return { label: 'Matematik', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'sosyal':
        return { label: 'Sosyal Bilgiler', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'oyun':
        return { label: 'Eğitici Oyun', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'arac':
        return { label: 'Etkileşimli Araç', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'video':
        return { label: 'Video Ders', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      default:
        return { label: 'Kaynak', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-800/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Eğitsel Uygulama & Araç Havuzu</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Sos-Mat Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Öğretmen tarafından eklenen interaktif oyunlar, simülasyonlar, harita ve geometri araçları
            </p>
          </div>
        </div>

        {isTeacher && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-purple-600/30 transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Uygulama / Araç Ekle</span>
          </button>
        )}
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'matematik', label: '📐 Matematik' },
            { id: 'sosyal', label: '🌍 Sosyal Bilgiler' },
            { id: 'oyun', label: '🎮 Oyunlar' },
            { id: 'kaynak', label: '📚 Kaynaklar' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Uygulama ara..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* ADD NEW APP MODAL */}
      {isAddingNew && (
        <div className="p-6 bg-slate-900/95 border border-purple-500/40 rounded-3xl shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Öğretmen Paneli: Portala Yeni Uygulama / Etkinlik Ekle</span>
            </h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Kapat
            </button>
          </div>

          <form onSubmit={handleCreateApp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Uygulama / Etkinlik Başlığı</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Örn: 3D Anadolu Medeniyetleri Sanal Müzesi"
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Kategori</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="matematik">📐 Matematik</option>
                <option value="sosyal">🌍 Sosyal Bilgiler</option>
                <option value="oyun">🎮 Eğitici Oyun</option>
                <option value="arac">⚙️ İnteraktif Araç</option>
                <option value="video">🎥 Video Ders</option>
                <option value="kaynak">📖 Müfredat & Kaynak</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-300">Açıklama & Kazanım Notu</label>
              <input
                type="text"
                required
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Öğrencilerin bu uygulamada ne öğreneceğini ve hedeflenen kazanımı yazınız..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Yönlendirilecek Portal Modülü</label>
              <select
                value={newTargetTab}
                onChange={(e) => setNewTargetTab(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="games">🎮 Oyunlar & Etkinlikler Modülü</option>
                <option value="lessons">🎥 Video & Konu Anlatımları Modülü</option>
                <option value="yearly_plan">📅 Yıllık Plan & MEB Kazanımları</option>
                <option value="homework">📝 Ödev & Çalışma Kağıtları</option>
                <option value="external">🌐 Dış Bağlantı (URL)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Dış Bağlantı Linki (İsteğe bağlı)</label>
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-md transition"
              >
                Kaydet ve Yayınla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* APPS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredApps.map((app) => {
          const badge = getCategoryBadge(app.category);

          return (
            <div
              key={app.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-5 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                    {badge.label}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>{app.views_count || 45} tıklama</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-purple-300 transition line-clamp-1 mb-1">
                  {app.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {app.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleLaunchApp(app)}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Uygulamayı Başlat</span>
                </button>

                {isTeacher && (
                  <button
                    onClick={() => handleDeleteApp(app.id)}
                    title="Uygulamayı Sil"
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
