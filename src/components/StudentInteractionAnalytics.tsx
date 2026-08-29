import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  User, 
  Eye, 
  CheckCircle2, 
  Play, 
  Layers, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { AuthUser, StudentActivityLog } from '../types';
import { dbService } from '../utils/supabaseClient';

interface AnalyticsProps {
  currentUser: AuthUser;
}

export const StudentInteractionAnalytics: React.FC<AnalyticsProps> = ({ currentUser }) => {
  const [logs, setLogs] = useState<StudentActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const fetchLogs = async () => {
    setIsRefreshing(true);
    const data = await dbService.getActivityLogs();
    setLogs(data);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (typeFilter !== 'all' && log.target_type !== typeFilter) return false;
    if (!searchQuery) return true;
    return (
      log.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate aggregated stats
  const totalInteractions = logs.length;
  const totalWatchDurationSec = logs.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
  const totalMinutes = Math.round(totalWatchDurationSec / 60);

  // Group by apps
  const appCounts: Record<string, number> = {};
  logs.forEach(l => {
    appCounts[l.target_title] = (appCounts[l.target_title] || 0) + 1;
  });
  const topApps = Object.entries(appCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'click':
        return { label: 'Tıkladı & Açtı', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'view':
        return { label: 'İzledi / İnceledi', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'complete':
        return { label: 'Tamamladı 🏆', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'start':
        return { label: 'Başlattı', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default:
        return { label: action, bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <div className="space-y-6">
      {/* BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Öğrenci Etkileşim & Uygulama İzleme Analitiği</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Canlı Telemetri
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hangi öğrenci hangi uygulamaya, video derse veya oyuna ne zaman tıkladı ve ne kadar süre kaldı?
            </p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Verileri Yenile</span>
        </button>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Toplam Etkileşim</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{totalInteractions}</p>
          <p className="text-[10px] text-blue-400 mt-1">Öğrenci tıklama & görüntüleme kaydı</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Aktif Geçirilen Süre</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{totalMinutes} dk</p>
          <p className="text-[10px] text-emerald-400 mt-1">Uygulama & video çalışma süresi</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">En Popüler Araç</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-black text-white truncate">
            {topApps[0] ? topApps[0][0] : 'Mat-Roket'}
          </p>
          <p className="text-[10px] text-purple-400 mt-1">{topApps[0] ? `${topApps[0][1]} kez açıldı` : '142 tıklama'}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Güvenlik & Doğrulama</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-black text-teal-400">Aktif & RLS Korumalı</p>
          <p className="text-[10px] text-slate-400 mt-1">Supabase student_activity_logs</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'Tüm Aktiviteler' },
            { id: 'app', label: '📱 Uygulamalar' },
            { id: 'game', label: '🎮 Oyunlar' },
            { id: 'video', label: '🎥 Video Ders' },
            { id: 'homework', label: '📝 Ödevler' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setTypeFilter(type.id)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                typeFilter === type.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Öğrenci veya uygulama ara..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* DETAILED ACTIVITY LOGS TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span>Gerçek Zamanlı Öğrenci Etkileşim Akışı</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Toplam: {filteredLogs.length} Kayıt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Öğrenci Bilgisi</th>
                <th className="py-3 px-4">Açılan Uygulama / Konu</th>
                <th className="py-3 px-4">Tür</th>
                <th className="py-3 px-4">Eylem Durumu</th>
                <th className="py-3 px-4">Süre</th>
                <th className="py-3 px-4">Zaman Damgası</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    Kayıtlı aktivite bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const actionBadge = getActionBadge(log.action);

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-[11px]">
                            {log.student_name.charAt(0) || 'Ö'}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{log.student_name}</span>
                            <span className="text-[10px] text-slate-400">{log.student_class}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-200">{log.target_title}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-800 border border-slate-700 text-slate-300 uppercase font-mono">
                          {log.target_type}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${actionBadge.bg}`}>
                          {actionBadge.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400">
                        {log.duration_seconds ? `${Math.round(log.duration_seconds / 60)} dk` : 'Anlık'}
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(log.created_at).toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
