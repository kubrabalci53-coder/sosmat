import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Crown, 
  Flame, 
  Calculator, 
  Compass, 
  Eye, 
  CheckCircle2, 
  Shapes, 
  MapPin, 
  Gift, 
  Lock,
  Zap,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, Badge } from '../types';
import { badgesList } from '../mockData';
import { soundManager } from '../utils/soundEffects';

interface BadgeRewardProps {
  student: Student;
  onClaimDailyReward: () => void;
  onClaimBadge: (badgeId: string) => void;
}

export const BadgeRewardSystem: React.FC<BadgeRewardProps> = ({
  student,
  onClaimDailyReward,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [claimedChest, setClaimedChest] = useState(false);

  const levelTiers = [
    { lvl: 1, title: 'Çırak Öğrenci', minXp: 0, reward: 'Giriş Rozeti' },
    { lvl: 2, title: 'Meraklı Kaşif', minXp: 400, reward: 'Ödev Çift XP Bonusu' },
    { lvl: 3, title: 'Gelişen Araştırmacı', minXp: 800, reward: 'Gümüş Rozet Çerçevesi' },
    { lvl: 4, title: 'Kaşif Matematikçi', minXp: 1200, reward: 'Altın Başarı Tacı' },
    { lvl: 5, title: 'Sosyal Bilgiler Dehası', minXp: 1800, reward: 'Özel Avatar Çerçevesi' },
    { lvl: 6, title: 'Büyük Bilge / Sos-Mat Efsanesi', minXp: 2500, reward: 'Efsanevi Kupa' },
  ];

  const handleOpenChest = () => {
    if (claimedChest) return;
    setClaimedChest(true);
    soundManager.playBadgeUnlock();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    onClaimDailyReward();
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return Calculator;
      case 'Compass': return Compass;
      case 'Eye': return Eye;
      case 'CheckCircle2': return CheckCircle2;
      case 'MapPin': return MapPin;
      case 'Shapes': return Shapes;
      case 'Crown': return Crown;
      default: return Award;
    }
  };

  const filteredBadges = badgesList.filter(b => {
    if (filterCategory === 'all') return true;
    return b.category === filterCategory;
  });

  const xpProgressPercent = Math.min(100, Math.round((student.xp / student.nextLevelXp) * 100));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">
                SOS-MAT Rozet ve Seviye Ödül Merkezi
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Seviye {student.level} • {student.levelTitle}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ders videolarını izledikçe, ödev yaptıkça ve oyun kazandıkça XP kazan, rozetleri aç!
            </p>
          </div>
        </div>

        {/* Daily Reward Chest Button */}
        <button
          onClick={handleOpenChest}
          disabled={claimedChest}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2.5 transition shadow-lg ${
            claimedChest 
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-slate-950 hover:brightness-110 shadow-amber-500/30 animate-pulse'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span>{claimedChest ? 'Günlük Sandık Açıldı ✓' : 'GÜNLÜK ÖDÜL SANDIĞINI AÇ (+100 XP)'}</span>
        </button>
      </div>

      {/* Level Progress & XP Track */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 fill-current" />
              Mevcut Deneyim (XP) ve Seviye İlerlemesi
            </h3>
            <p className="text-xs text-slate-400">Bir sonraki seviyeye {student.nextLevelXp - student.xp} XP kaldı</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-extrabold text-amber-400">
              {student.xp} / {student.nextLevelXp} XP
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              %{xpProgressPercent}
            </span>
          </div>
        </div>

        {/* Level Track Horizontal Map */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {levelTiers.map((tier) => {
            const isPassed = student.level >= tier.lvl;
            const isCurrent = student.level === tier.lvl;
            return (
              <div 
                key={tier.lvl}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isCurrent 
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10 scale-105'
                    : isPassed
                    ? 'bg-slate-800/80 border-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex justify-center mb-1.5">
                  {isPassed ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <h4 className="text-xs font-extrabold text-white">Seviye {tier.lvl}</h4>
                <p className="text-[11px] font-semibold text-amber-300 truncate mt-0.5">{tier.title}</p>
                <span className="text-[10px] text-slate-400 block mt-1">{tier.minXp} XP</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Tüm Başarı Rozetleri Koleksiyonu
            </h3>
            <p className="text-xs text-slate-400">
              Kazanılan: {student.unlockedBadgeIds.length} / {badgesList.length} Rozet
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'matematik', label: '📐 Matematik' },
              { id: 'sosyal', label: '🌍 Sosyal' },
              { id: 'odak', label: '👁️ Odak' },
              { id: 'devam', label: '📅 Devam' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterCategory === cat.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => {
            const isUnlocked = student.unlockedBadgeIds.includes(badge.id);
            const Icon = getBadgeIcon(badge.iconName);

            let rarityStyle = 'bg-amber-600/20 text-amber-300 border-amber-500/40';
            if (badge.rarity === 'gumus') rarityStyle = 'bg-slate-300/20 text-slate-200 border-slate-400/40';
            if (badge.rarity === 'bronz') rarityStyle = 'bg-amber-800/20 text-amber-500 border-amber-700/40';
            if (badge.rarity === 'efsane') rarityStyle = 'bg-purple-600/30 text-purple-300 border-purple-500/50';

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  isUnlocked
                    ? 'bg-slate-900 border-slate-700/90 shadow-xl hover:border-amber-500/60'
                    : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-amber-500/30 to-purple-500/30 border-amber-500/50 text-amber-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${rarityStyle}`}>
                      {badge.rarity}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      {badge.name}
                      {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </h4>
                    <p className="text-[11px] font-semibold text-indigo-400 mt-0.5">{badge.title}</p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{badge.description}</p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px]">
                  {isUnlocked ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Kazanıldı ({badge.unlockedAt || 'Mart 2026'})
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      {badge.xpRequired} XP Gereklidir
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
