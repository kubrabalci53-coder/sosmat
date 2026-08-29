import React, { useState } from 'react';
import { 
  CalendarCheck2, 
  CalendarX2, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Calendar,
  FileCheck,
  Search,
  Filter
} from 'lucide-react';
import { Student, AttendanceRecord } from '../types';

interface AttendanceTrackerProps {
  student: Student;
  onAddAttendanceRecord: (record: AttendanceRecord) => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  student,
  onAddAttendanceRecord,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newType, setNewType] = useState<'tam' | 'yarim' | 'mazeretli' | 'mevcut'>('mazeretli');
  const [newReason, setNewReason] = useState('');
  const [newSubject, setNewSubject] = useState('Matematik & Sosyal Bilgiler');
  const [filterType, setFilterType] = useState<string>('all');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAttendanceRecord({
      date: newDate,
      type: newType,
      reason: newReason || (newType === 'mazeretli' ? 'Sağlık İzni' : newType === 'tam' ? 'Mazeretsiz' : 'Ders Katılımı'),
      subject: newSubject,
    });
    setShowAddModal(false);
    setNewReason('');
  };

  const attendanceRate = Math.round((student.attendedDays / student.totalSchoolDays) * 100);

  const filteredHistory = student.attendanceHistory.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CalendarCheck2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Öğrenci Devamsızlık ve Devam Takip Modülü
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {student.name} ({student.classGrade}) • Sosyal Bilgiler ve Matematik dersleri devam durumu
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Devamsızlık / İzin Ekle</span>
        </button>
      </div>

      {/* 4 Cards Attendance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Toplam İş Günü</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{student.totalSchoolDays}</span>
            <span className="text-xs text-slate-400">Gün</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Dönemlik toplam eğitim süresi</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Devam Edilen Gün</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{student.attendedDays}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              %{attendanceRate}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Düzenli katılım başarısı</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mazeretsiz Devamsızlık</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 font-mono">{student.absentDays}</span>
            <span className="text-xs text-slate-400">Gün (Sınır: 10 Gün)</span>
          </div>
          <p className="text-[11px] text-rose-400/80 mt-2 font-medium">MEB yasal devamsızlık sınırının oldukça altında</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mazeretli / Raporlu</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">{student.excusedDays}</span>
            <span className="text-xs text-slate-400">Gün</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Sağlık raporu ve veli izinli günler</p>
        </div>
      </div>

      {/* Attendance History Table & Calendar Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" />
              Devamsızlık & Yoklama Kayıt Geçmişi
            </h3>
            <p className="text-xs text-slate-400">Tarih bazlı katılım ve mazeret detayları</p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'mevcut', label: 'Mevcut' },
              { id: 'mazeretli', label: 'Mazeretli' },
              { id: 'tam', label: 'Mazeretsiz' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterType === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Tarih</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4">İlgili Ders</th>
                <th className="py-3 px-4">Açıklama / Mazeret Notu</th>
                <th className="py-3 px-4 text-right">Sistem Kaydı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Seçilen filtrede devamsızlık kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-white flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {rec.date}
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.type === 'mevcut' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[11px]">
                          <CheckCircle className="w-3 h-3" /> Mevcut
                        </span>
                      )}
                      {rec.type === 'mazeretli' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[11px]">
                          <Clock className="w-3 h-3" /> Mazeretli İzinli
                        </span>
                      )}
                      {rec.type === 'tam' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 text-[11px]">
                          <CalendarX2 className="w-3 h-3" /> Mazeretsiz (1 Gün)
                        </span>
                      )}
                      {rec.type === 'yarim' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30 text-[11px]">
                          Yarım Gün
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {rec.subject || 'Sosyal Bilgiler & Matematik'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {rec.reason || (rec.type === 'mevcut' ? 'Derslere tam katılım sağlandı' : 'Kayıt girilmedi')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono">
                      Öğretmen Onaylı
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Attendance Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-indigo-400" />
              Yeni Devamsızlık / Yoklama Kaydı
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tarih</label>
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Devamsızlık Durumu</label>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value as 'tam' | 'yarim' | 'mazeretli' | 'mevcut')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="mevcut">Mevcut (Ders Katılımı)</option>
                  <option value="mazeretli">Mazeretli / Sağlık Raporu</option>
                  <option value="tam">Tam Gün Mazeretsiz</option>
                  <option value="yarim">Yarım Gün</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">İlgili Ders</label>
                <select 
                  value={newSubject} 
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Matematik & Sosyal Bilgiler">Matematik & Sosyal Bilgiler (Tüm Gün)</option>
                  <option value="Matematik">Yalnızca Matematik</option>
                  <option value="Sosyal Bilgiler">Yalnızca Sosyal Bilgiler</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Mazeret Açıklaması</label>
                <textarea 
                  value={newReason} 
                  onChange={(e) => setNewReason(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Örn: Doktor muayenesi ve veli dilekçesi..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
