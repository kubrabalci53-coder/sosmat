import React, { useState, useEffect } from 'react';
import { 
  Student, 
  TeacherProfile, 
  NavTab, 
  SubjectType, 
  LessonTopic, 
  AttendanceRecord, 
  HomeworkItem, 
  YearlyPlanWeek,
  AuthUser 
} from './types';
import { 
  sampleStudents, 
  initialTeacher, 
  sampleLessonTopics, 
  yearlyCurriculumPlan 
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { VideoPlayerAndActiveTracker } from './components/VideoPlayerAndActiveTracker';
import { AttendanceTracker } from './components/AttendanceTracker';
import { HomeworkTracker } from './components/HomeworkTracker';
import { LessonLectures } from './components/LessonLectures';
import { YearlyPlanView } from './components/YearlyPlanView';
import { GamesAndActivities } from './components/GamesAndActivities';
import { ParticipationReport } from './components/ParticipationReport';
import { BadgeRewardSystem } from './components/BadgeRewardSystem';
import { AuthModalOrScreen } from './components/AuthModalOrScreen';
import { MessagingSystem } from './components/MessagingSystem';
import { EducationalAppManager } from './components/EducationalAppManager';
import { StudentInteractionAnalytics } from './components/StudentInteractionAnalytics';
import { SupabaseSqlGuide } from './components/SupabaseSqlGuide';
import { soundManager } from './utils/soundEffects';
import { dbService } from './utils/supabaseClient';
import confetti from 'canvas-confetti';

export default function App() {
  // Authentication State - Always starts at Login & Register Screen on app open
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sosmat_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return sampleStudents;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(sampleStudents[0].id);
  const [teacher, setTeacher] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem('sosmat_teacher');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialTeacher;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('genel');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [yearlyPlan, setYearlyPlan] = useState<YearlyPlanWeek[]>(yearlyCurriculumPlan);
  const [topics, setTopics] = useState<LessonTopic[]>(sampleLessonTopics);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  // Sync Auth User to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sosmat_auth_user', JSON.stringify(currentUser));
      // Poll unread messages
      const checkMessages = async () => {
        const msgs = await dbService.getMessagesForUser(currentUser);
        if (currentUser.role === 'teacher') {
          const unread = msgs.filter(m => !m.reply_text).length;
          setUnreadMsgCount(unread);
        } else {
          const replied = msgs.filter(m => m.reply_text && !m.is_read).length;
          setUnreadMsgCount(replied);
        }
      };
      checkMessages();
      const interval = setInterval(checkMessages, 12000);
      return () => clearInterval(interval);
    } else {
      localStorage.removeItem('sosmat_auth_user');
    }
  }, [currentUser]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('sosmat_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sosmat_teacher', JSON.stringify(teacher));
  }, [teacher]);

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  // Helper to update current active student
  const updateActiveStudent = (updater: (prev: Student) => Student) => {
    setStudents(prevStudents =>
      prevStudents.map(s => (s.id === activeStudent.id ? updater(s) : s))
    );
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'teacher') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    soundManager.playCorrect();
    setCurrentUser(null);
    localStorage.removeItem('sosmat_auth_user');
  };

  // Watch stats update handler
  const handleUpdateWatchStats = async (minutesAdded: number, focusScore: number, xpEarned: number) => {
    if (currentUser) {
      await dbService.logActivity({
        student_id: currentUser.id,
        student_name: currentUser.studentName || currentUser.username || 'Öğrenci',
        student_class: currentUser.classGrade || '6-A',
        target_type: 'video',
        target_id: 'video-lecture',
        target_title: 'Aktif Video Dersi İzleme',
        action: 'view',
        duration_seconds: minutesAdded * 60,
      });
    }

    updateActiveStudent(prev => {
      const newTotal = prev.totalVideoWatchMinutes + minutesAdded;
      const newToday = prev.todayWatchMinutes + minutesAdded;
      const newXp = prev.xp + xpEarned;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;
      let newTitle = prev.levelTitle;

      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        newNextXp = Math.round(prev.nextLevelXp * 1.5);
        if (newLevel === 2) newTitle = 'Meraklı Kaşif';
        if (newLevel === 3) newTitle = 'Gelişen Araştırmacı';
        if (newLevel === 4) newTitle = 'Kaşif Matematikçi';
        if (newLevel === 5) newTitle = 'Sosyal Bilgiler Dehası';
        if (newLevel >= 6) newTitle = 'Sos-Mat Efsanesi';
        soundManager.playBadgeUnlock();
        confetti({ particleCount: 100, spread: 80 });
      }

      return {
        ...prev,
        totalVideoWatchMinutes: newTotal,
        todayWatchMinutes: newToday,
        activeFocusScore: focusScore,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextXp,
        levelTitle: newTitle,
      };
    });
  };

  // Attendance record handler
  const handleAddAttendanceRecord = (record: AttendanceRecord) => {
    updateActiveStudent(prev => {
      const isAbsent = record.type === 'tam' || record.type === 'yarim';
      const isExcused = record.type === 'mazeretli';
      return {
        ...prev,
        absentDays: isAbsent ? prev.absentDays + 1 : prev.absentDays,
        excusedDays: isExcused ? prev.excusedDays + 1 : prev.excusedDays,
        attendedDays: record.type === 'mevcut' ? Math.min(prev.totalSchoolDays, prev.attendedDays + 1) : prev.attendedDays,
        attendanceHistory: [record, ...prev.attendanceHistory],
      };
    });
  };

  // Homework update & add
  const handleUpdateHomework = async (updatedHw: HomeworkItem) => {
    if (currentUser) {
      await dbService.logActivity({
        student_id: currentUser.id,
        student_name: currentUser.studentName || currentUser.username || 'Öğrenci',
        student_class: currentUser.classGrade || '6-A',
        target_type: 'homework',
        target_id: updatedHw.id,
        target_title: updatedHw.title,
        action: 'complete',
        duration_seconds: 300,
      });
    }

    updateActiveStudent(prev => {
      const newHomeworks = prev.homeworks.map(h => (h.id === updatedHw.id ? updatedHw : h));
      return {
        ...prev,
        homeworks: newHomeworks,
        xp: prev.xp + 40,
      };
    });
  };

  const handleAddHomework = (newHw: HomeworkItem) => {
    updateActiveStudent(prev => ({
      ...prev,
      homeworks: [newHw, ...prev.homeworks],
    }));
  };

  // Yearly plan week toggle
  const handleToggleWeekCompletion = (weekNum: number) => {
    setYearlyPlan(prev =>
      prev.map(item =>
        item.week === weekNum ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  // Game win handler
  const handleGameWin = async (gameKey: string, score: number, xpEarned: number) => {
    if (currentUser) {
      await dbService.logActivity({
        student_id: currentUser.id,
        student_name: currentUser.studentName || currentUser.username || 'Öğrenci',
        student_class: currentUser.classGrade || '6-A',
        target_type: 'game',
        target_id: gameKey,
        target_title: `Oyun: ${gameKey} (Skor: ${score})`,
        action: 'complete',
        duration_seconds: 180,
      });
    }

    updateActiveStudent(prev => {
      const currentHigh = prev.gameHighScores[gameKey as keyof typeof prev.gameHighScores] || 0;
      const newHighScores = {
        ...prev.gameHighScores,
        [gameKey]: Math.max(currentHigh, score),
      };

      const newXp = prev.xp + xpEarned;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;
      let newTitle = prev.levelTitle;

      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        newNextXp = Math.round(prev.nextLevelXp * 1.5);
        if (newLevel >= 5) newTitle = 'Sos-Mat Efsanesi';
      }

      return {
        ...prev,
        gameHighScores: newHighScores,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextXp,
        levelTitle: newTitle,
      };
    });
  };

  // Daily chest claim
  const handleClaimDailyReward = () => {
    updateActiveStudent(prev => ({
      ...prev,
      xp: prev.xp + 100,
      dailyStreak: prev.dailyStreak + 1,
    }));
  };

  // Unlock badge
  const handleUnlockBadge = (badgeId: string) => {
    updateActiveStudent(prev => {
      if (prev.unlockedBadgeIds.includes(badgeId)) return prev;
      return {
        ...prev,
        unlockedBadgeIds: [...prev.unlockedBadgeIds, badgeId],
        xp: prev.xp + 150,
      };
    });
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Genel İstatistik & Gösterge Paneli';
      case 'lessons': return 'Konu Anlatımları & Video Oynatıcı';
      case 'attendance': return 'Öğrenci Devamsızlık Takibi';
      case 'homework': return 'Ödev Takibi & Teslimatı';
      case 'yearly_plan': return 'MEB Yıllık Plan & Kazanımlar';
      case 'games': return 'Eğitsel Oyunlar & Etkinlikler';
      case 'reporting': return 'Kapsamlı Katılım & Analiz Raporu';
      case 'badges': return 'Rozetler & Seviye Ödülleri';
      case 'messages': return currentUser?.role === 'teacher' ? 'Öğrenci Mesajlaşma Merkezi' : 'Öğretmene Soru Sor & Mesaj';
      case 'app_manager': return 'Eğitsel Uygulama & Araç Havuzu';
      case 'analytics': return 'Öğrenci Etkileşim & Uygulama Analitiği';
      case 'sql_guide': return 'Supabase Veritabanı & SQL Kurulumu';
      default: return 'SOS-MAT Portalı';
    }
  };

  // If user is not logged in, render the Red (Login) / Pink (Register) Auth Screen
  if (!currentUser) {
    return (
      <AuthModalOrScreen
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeStudent={activeStudent}
        allStudents={students}
        onSelectStudent={(stu) => setActiveStudentId(stu.id)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        unreadMessageCount={unreadMsgCount}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        {/* Sticky Header with Teacher Name on Top Right (Sevgi Demir) */}
        <Header
          teacher={teacher}
          onUpdateTeacher={setTeacher}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          pageTitle={getPageTitle()}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <StatsDashboard
              student={activeStudent}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'lessons' && (
            <VideoPlayerAndActiveTracker
              topics={topics}
              activeStudent={activeStudent}
              onUpdateWatchStats={handleUpdateWatchStats}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {currentTab === 'messages' && (
            <MessagingSystem
              currentUser={currentUser}
            />
          )}

          {currentTab === 'app_manager' && (
            <EducationalAppManager
              currentUser={currentUser}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'analytics' && (
            <StudentInteractionAnalytics
              currentUser={currentUser}
            />
          )}

          {currentTab === 'sql_guide' && (
            <SupabaseSqlGuide />
          )}

          {currentTab === 'attendance' && (
            <AttendanceTracker
              student={activeStudent}
              onAddAttendanceRecord={handleAddAttendanceRecord}
            />
          )}

          {currentTab === 'homework' && (
            <HomeworkTracker
              student={activeStudent}
              onUpdateHomework={handleUpdateHomework}
              onAddHomework={handleAddHomework}
            />
          )}

          {currentTab === 'yearly_plan' && (
            <YearlyPlanView
              planData={yearlyPlan}
              onToggleWeekCompletion={handleToggleWeekCompletion}
            />
          )}

          {currentTab === 'games' && (
            <GamesAndActivities
              student={activeStudent}
              onGameWin={handleGameWin}
            />
          )}

          {currentTab === 'reporting' && (
            <ParticipationReport
              student={activeStudent}
              allStudents={students}
              teacher={teacher}
            />
          )}

          {currentTab === 'badges' && (
            <BadgeRewardSystem
              student={activeStudent}
              onClaimDailyReward={handleClaimDailyReward}
              onClaimBadge={handleUnlockBadge}
            />
          )}
        </main>
      </div>
    </div>
  );
}
