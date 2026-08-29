import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  ShieldCheck, 
  Terminal, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2,
  Key,
  Layers,
  FileCode2,
  Lock
} from 'lucide-react';
import { SUPABASE_SQL_MIGRATION } from '../utils/supabaseClient';
import { soundManager } from '../utils/soundEffects';

export const SupabaseSqlGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
    setCopied(true);
    soundManager.playCorrect();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Supabase Veritabanı & SQL Kurulum Rehberi</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SQL Şeması & RLS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Portalınızın arkasında çalışan Supabase tabloları, güvenlik politikaları ve yetkilendirme kodları
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition self-start md:self-auto"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Tüm SQL Kodu Kopyalandı!' : 'Tüm SQL Kodunu Kopyala'}</span>
        </button>
      </div>

      {/* QUICK INSTRUCTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h4 className="text-xs font-extrabold text-white">Supabase SQL Editor'ı Açın</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Supabase kontrol panelinize gidin ve sol menüden <strong>SQL Editor</strong> seçeneğine tıklayın.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h4 className="text-xs font-extrabold text-white">Kodu Yapıştırın & Çalıştırın</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sağ üstteki yeşil butondan kodu kopyalayıp SQL Editor içine yapıştırın ve <strong>Run (Çalıştır)</strong> butonuna basın.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h4 className="text-xs font-extrabold text-white">Otomatik Senkronizasyon</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Tablolar ve RLS güvenlik kuralları anında aktifleşir. Öğrenci ve öğretmen verileri bulut veritabanına kaydedilir.
          </p>
        </div>
      </div>

      {/* SQL CODE VIEWER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200">schema_sosmat_supabase.sql</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-xl transition border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
        </div>

        <div className="p-5 bg-slate-950 font-mono text-xs text-emerald-400/90 overflow-x-auto max-h-[500px] leading-relaxed select-all">
          <pre>{SUPABASE_SQL_MIGRATION}</pre>
        </div>
      </div>
    </div>
  );
};
