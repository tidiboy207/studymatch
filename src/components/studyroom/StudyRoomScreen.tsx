import React, { useState } from 'react';
import { StudySession, UserProfile, ResourceItem } from '../../types';
import { PomodoroTimer } from './PomodoroTimer';
import { P2PCameraMesh } from './P2PCameraMesh';
import { CollaborativeWhiteboard } from './CollaborativeWhiteboard';
import { ChecklistGoals } from './ChecklistGoals';
import { AntiAfkMonitor } from './AntiAfkMonitor';
import { InRoomChat } from './InRoomChat';
import { PostSessionModal } from './PostSessionModal';
import {
  CheckCircle2,
  Video,
  FileText,
  AlertTriangle,
  Award,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { dataService } from '../../services/dataService';

interface StudyRoomScreenProps {
  session: StudySession;
  currentUser: UserProfile;
  attachedResource: ResourceItem | null;
  onBackToDashboard: () => void;
  onGoalToggle: (goalId: string) => Promise<void>;
  onConfirmAttendance: () => Promise<void>;
  onSessionFinished: () => void;
}

export const StudyRoomScreen: React.FC<StudyRoomScreenProps> = ({
  session,
  currentUser,
  attachedResource,
  onBackToDashboard,
  onGoalToggle,
  onConfirmAttendance,
  onSessionFinished
}) => {
  const [mobileTab, setMobileTab] = useState<'video' | 'board' | 'chat'>('board');
  const [centerTab, setCenterTab] = useState<'whiteboard' | 'resource'>('whiteboard');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const isUserA = session.user_a_id === currentUser.id;
  const isConfirmed = isUserA ? session.user_a_confirmed : session.user_b_confirmed;
  const partnerName = session.partner_profile?.display_name || 'Bạn học ghép cặp';

  const handleComplete = async (retentionChoice: 'keep' | 'change') => {
    await dataService.completeSession(session.id, retentionChoice);
    onSessionFinished();
  };

  const handleReportMissed = async () => {
    await dataService.reportMissedSession(session.id);
    onSessionFinished();
  };

  return (
    <div className="space-y-4">
      
      {/* Top Session Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Quay lại Bảng tin"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Phòng Học Cam Kết Kỷ Luật
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold font-mono">
                {session.duration_minutes} Phút
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Môn: <strong className="text-slate-200">{session.subject}</strong> • Chủ đề: <strong className="text-emerald-400">{session.topic}</strong>
            </p>
          </div>
        </div>

        {/* Attendance & Complete Action Buttons */}
        <div className="flex items-center gap-2">
          {!isConfirmed ? (
            <button
              onClick={onConfirmAttendance}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 animate-bounce"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Xác nhận có mặt</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Đã xác nhận có mặt
            </span>
          )}

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Hoàn thành buổi học</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Selector (Chỉ hiện trên màn hình nhỏ) */}
      <div className="flex lg:hidden rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
        <button
          onClick={() => setMobileTab('video')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'video' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Cam & Timer</span>
        </button>
        <button
          onClick={() => setMobileTab('board')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'board' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Bảng & Bài tập</span>
        </button>
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Kỷ luật & Chat</span>
        </button>
      </div>

      {/* 3-Column Standard Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* =========================================================================
            CỘT TRÁI (30% ~ 4 cols): Đồng hồ Pomodoro & Camera P2P WebRTC
           ========================================================================= */}
        <div className={`lg:col-span-4 space-y-4 ${
          mobileTab !== 'video' ? 'hidden lg:block' : 'block'
        }`}>
          <PomodoroTimer sessionId={session.id} />
          <P2PCameraMesh currentUser={currentUser} session={session} />
        </div>

        {/* =========================================================================
            CỘT GIỮA (45% ~ 5 cols): Checklist 3 Mục tiêu & Bảng trắng HTML5 Canvas
           ========================================================================= */}
        <div className={`lg:col-span-5 space-y-4 ${
          mobileTab !== 'board' ? 'hidden lg:block' : 'block'
        }`}>
          <ChecklistGoals session={session} onGoalToggle={onGoalToggle} />

          {/* Center Tabs: Whiteboard vs Attached Resource */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setCenterTab('whiteboard')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                centerTab === 'whiteboard'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bảng Trắng Giải Bài Đồng Bộ (Canvas P2P)
            </button>
            <button
              onClick={() => setCenterTab('resource')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                centerTab === 'resource'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tài Liệu Đã Gắn ({attachedResource ? '1' : '0'})</span>
            </button>
          </div>

          {centerTab === 'whiteboard' ? (
            <CollaborativeWhiteboard sessionId={session.id} />
          ) : (
            /* Attached Resource Direct Viewer in room */
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-h-[380px] overflow-y-auto">
              {attachedResource ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-white">{attachedResource.title}</h3>
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {attachedResource.topic}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800">
                    {attachedResource.formula_summary}
                  </div>
                  <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                    {attachedResource.content_markdown}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  Chưa gắn tài liệu nào từ Thư viện môn học. Bạn có thể sang tab "Thư viện" để gắn tài liệu vào phòng!
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            CỘT PHẢI (25% ~ 3 cols): Giám sát Kỷ luật Anti-AFK & Khung Chat Nội Bộ
           ========================================================================= */}
        <div className={`lg:col-span-3 space-y-4 ${
          mobileTab !== 'chat' ? 'hidden lg:block' : 'block'
        }`}>
          <AntiAfkMonitor
            sessionId={session.id}
            afkAlertCount={session.afk_alert_count || 0}
            onAfkAlert={() => {}}
          />
          <InRoomChat
            sessionId={session.id}
            currentUser={currentUser}
            partnerName={partnerName}
          />
        </div>

      </div>

      {/* Post Session Modal */}
      <PostSessionModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        session={session}
        currentUser={currentUser}
        onCompleteSession={handleComplete}
        onReportMissed={handleReportMissed}
      />

    </div>
  );
};
