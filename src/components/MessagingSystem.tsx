import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  CheckCheck, 
  Clock, 
  Crown, 
  GraduationCap, 
  User, 
  Sparkles, 
  RefreshCw, 
  CornerDownRight, 
  Search, 
  Filter,
  CheckCircle2,
  Shield,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { AuthUser, ChatMessage } from '../types';
import { dbService, sanitizeInput } from '../utils/supabaseClient';
import { soundManager } from '../utils/soundEffects';

interface MessagingProps {
  currentUser: AuthUser;
}

export const MessagingSystem: React.FC<MessagingProps> = ({ currentUser }) => {
  const isTeacher = currentUser.role === 'teacher';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // For Student: New message input
  const [newMessageText, setNewMessageText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<'matematik' | 'sosyal' | 'odev' | 'genel'>('matematik');

  // For Teacher: Reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const fetchMessages = async () => {
    setIsRefreshing(true);
    const msgs = await dbService.getMessagesForUser(currentUser);
    setMessages(msgs);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 8000); // Polling real-time update
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleStudentSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = sanitizeInput(newMessageText);
    if (!cleanText) return;

    const formattedMessage = `[${selectedTopic.toUpperCase()}] ${cleanText}`;

    const sent = await dbService.sendMessage({
      sender_id: currentUser.id,
      sender_role: 'student',
      sender_name: currentUser.studentName || 'Öğrenci',
      receiver_id: 'teacher-sevgi-demir',
      receiver_role: 'teacher',
      message: formattedMessage,
    });

    // Log activity
    await dbService.logActivity({
      student_id: currentUser.id,
      student_name: currentUser.studentName || 'Öğrenci',
      student_class: currentUser.classGrade || '6-A',
      target_type: 'resource',
      target_id: 'teacher-chat',
      target_title: `Öğretmene Mesaj: ${cleanText.substring(0, 30)}...`,
      action: 'start',
    });

    soundManager.playCorrect();
    setNewMessageText('');
    setMessages(prev => [...prev, sent]);
  };

  const handleTeacherReply = async (msgId: string) => {
    const cleanReply = sanitizeInput(replyText);
    if (!cleanReply) return;

    await dbService.replyToMessage(msgId, cleanReply);
    soundManager.playLevelUp();
    setReplyingToId(null);
    setReplyText('');
    fetchMessages();
  };

  const filteredMessages = messages.filter(m => {
    if (unreadOnly && m.is_read) return false;
    if (!searchFilter) return true;
    return (
      m.sender_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.message.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (m.reply_text && m.reply_text.toLowerCase().includes(searchFilter.toLowerCase()))
    );
  });

  const quickReplyTemplates = [
    "Harika bir soru! Yarın derste birlikte inceleyelim.",
    "Tebrikler, ödevindeki çözümlerin çok başarılı!",
    "Lütfen videodaki 2. kontrol sorusunu tekrar izleyip yanıtını kontrol et.",
    "Sosyal bilgiler harita etkinliğinde gösterdiğin performans çok iyi.",
    "Formülü adım adım yazıp bana tekrar gönderebilirsin."
  ];

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                {isTeacher ? 'Öğretmen Mesajlaşma & Destek Merkezi' : 'Öğretmene Soru Sor & Mesaj Gönder'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Canlı & Güvenli
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isTeacher 
                ? 'Öğrencilerinizden gelen ders soruları, ödev yardımı ve danışma talepleri'
                : 'Sevgi Demir öğretmeninize Matematik veya Sosyal Bilgiler ile ilgili sorularınızı doğrudan iletin'}
            </p>
          </div>
        </div>

        <button
          onClick={fetchMessages}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Yenile</span>
        </button>
      </div>

      {/* STUDENT VIEW: WRITE MESSAGE & VIEW CONVERSATION */}
      {!isTeacher && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SEND MESSAGE BOX */}
          <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Send className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-extrabold text-white">Yeni Mesaj Gönder</h3>
            </div>

            <form onSubmit={handleStudentSendMessage} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Ders / Konu Başlığı</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTopic('matematik')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedTopic === 'matematik'
                        ? 'bg-blue-600/30 border border-blue-500 text-blue-200'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span>📐 Matematik</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTopic('sosyal')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedTopic === 'sosyal'
                        ? 'bg-amber-600/30 border border-amber-500 text-amber-200'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span>🌍 Sosyal Bilgiler</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTopic('odev')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedTopic === 'odev'
                        ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-200'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span>📝 Ödev Takibi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTopic('genel')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedTopic === 'genel'
                        ? 'bg-purple-600/30 border border-purple-500 text-purple-200'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span>💬 Genel Danışma</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Mesajınız / Sorunuz</label>
                <textarea
                  required
                  rows={5}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Öğretmenim, bu konuyu ya da soruyu anlamadım..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none transition leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ÖĞRETMENE İLET</span>
              </button>
            </form>

            <div className="p-3 bg-indigo-950/40 border border-indigo-900/50 rounded-2xl text-[11px] text-indigo-300 flex items-start gap-2">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Gönderdiğiniz mesajları yalnızca Sevgi Demir öğretmeniniz görebilir. Yanıt geldiğinde burada listelenir.</span>
            </div>
          </div>

          {/* CONVERSATION HISTORY */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Öğretmenim ile Mesaj Geçmişim</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                  {messages.length} Mesaj
                </span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <MessageSquare className="w-12 h-12 text-slate-700 mb-2" />
                  <p className="text-xs font-medium">Henüz öğretmeninize mesaj göndermediniz.</p>
                  <p className="text-[11px] text-slate-600 mt-1">Sol panelden ilk sorunuzu yazıp gönderebilirsiniz.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    {/* Student Message */}
                    <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center text-blue-300 shrink-0 text-xs font-bold">
                        Ö
                      </div>
                      <div className="bg-gradient-to-br from-indigo-900/80 to-blue-900/70 border border-indigo-700/40 rounded-2xl rounded-tr-none p-3.5 text-white shadow-md">
                        <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-indigo-300 font-bold">
                          <span>{msg.sender_name}</span>
                          <span>{new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs leading-relaxed">{msg.message}</p>
                      </div>
                    </div>

                    {/* Teacher Reply */}
                    {msg.reply_text ? (
                      <div className="flex items-start gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
                          <Crown className="w-4 h-4" />
                        </div>
                        <div className="bg-slate-800/90 border border-amber-500/40 rounded-2xl rounded-tl-none p-3.5 text-slate-100 shadow-md">
                          <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-amber-400 font-extrabold">
                            <span className="flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-400" />
                              Sevgi Demir (Öğretmen)
                            </span>
                            <span className="text-slate-400">Yanıtlandı</span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-200">{msg.reply_text}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-end text-[10px] text-amber-400/80 italic pr-11">
                        <Clock className="w-3 h-3" />
                        <span>Öğretmenin yanıtı bekleniyor...</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TEACHER VIEW: ALL STUDENT MESSAGES & RESPONSE HUB */}
      {isTeacher && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Öğrenci veya mesaj ara..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setUnreadOnly(!unreadOnly)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  unreadOnly
                    ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Yalnızca Yanıt Bekleyenler</span>
              </button>
            </div>
          </div>

          {/* MESSAGES LIST */}
          <div className="grid grid-cols-1 gap-4">
            {filteredMessages.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-300">Harika! Bekleyen mesaj bulunmuyor.</p>
                <p className="text-xs text-slate-500 mt-1">Öğrencilerden yeni soru veya mesaj geldiğinde burada görüntülenecektir.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isReplying = replyingToId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`bg-slate-900/90 border rounded-3xl p-5 shadow-xl transition-all ${
                      msg.reply_text ? 'border-slate-800' : 'border-amber-500/40 shadow-amber-950/20'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-extrabold text-xs">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white">{msg.sender_name}</span>
                            {!msg.reply_text && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Yanıt Bekliyor
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(msg.created_at).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isReplying && (
                          <button
                            onClick={() => {
                              setReplyingToId(msg.id);
                              setReplyText(msg.reply_text || '');
                            }}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                          >
                            <CornerDownRight className="w-3.5 h-3.5" />
                            <span>{msg.reply_text ? 'Cevabı Düzenle' : 'Cevap Yaz'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* STUDENT MESSAGE CONTENT */}
                    <div className="my-3 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                      {msg.message}
                    </div>

                    {/* EXISTING TEACHER REPLY */}
                    {msg.reply_text && !isReplying && (
                      <div className="mt-3 p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl flex items-start gap-3">
                        <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-bold text-amber-400 block mb-1">Verdiğiniz Yanıt:</span>
                          <span className="text-slate-200 leading-relaxed">{msg.reply_text}</span>
                        </div>
                      </div>
                    )}

                    {/* INLINE REPLY EDITOR */}
                    {isReplying && (
                      <div className="mt-4 space-y-3 p-4 bg-slate-950 rounded-2xl border border-indigo-500/40 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                            <CornerDownRight className="w-3.5 h-3.5" />
                            <span>Öğrenciye Cevabınızı Yazın:</span>
                          </span>

                          <button
                            onClick={() => setReplyingToId(null)}
                            className="text-xs text-slate-500 hover:text-slate-300"
                          >
                            İptal
                          </button>
                        </div>

                        {/* Quick Templates */}
                        <div className="flex flex-wrap gap-1.5">
                          {quickReplyTemplates.map((tpl, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setReplyText(tpl)}
                              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-2 py-1 rounded-lg transition"
                            >
                              {tpl.substring(0, 35)}...
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Öğrencinize açıklama veya yönlendirmenizi yazınız..."
                          className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setReplyingToId(null)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                          >
                            Vazgeç
                          </button>
                          <button
                            onClick={() => handleTeacherReply(msg.id)}
                            disabled={!replyText.trim()}
                            className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-extrabold shadow-md transition disabled:opacity-40"
                          >
                            Cevabı Gönder
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
