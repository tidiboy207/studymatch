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
  Award,
  Layers,
  BookOpen,
  ArrowLeft,
  AlertTriangle
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white border border-[#365C4A]/20 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-2xl bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#365C4A] border border-[#365C4A]/15 transition-all"
            title="Quay lại Bảng tin"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="text-sm sm:text-base font-black text-[#365C4A]">
                Phòng Học Cam Kết Kỷ Luật
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#A7B99A]/20 text-[#365C4A] border border-[#A7B99A]/40 font-bold font-mono">
                {session.duration_minutes} Phút
              </span>
            </div>
            <p className="text-xs text-[#553F35]/80 mt-0.5 font-medium">
              Môn: <strong className="text-[#365C4A]">{session.subject}</strong> • Chủ đề: <strong className="text-emerald-700">{session.topic}</strong>
            </p>
          </div>
        </div>

        {/* Attendance & Complete Action Buttons */}
        <div className="flex items-center gap-2">
          {!isConfirmed ? (
            <button
              onClick={onConfirmAttendance}
              className="px-3.5 py-2 rounded-full bg-[#D89C57]/20 hover:bg-[#D89C57]/30 text-[#D89C57] border border-[#D89C57] text-xs font-bold transition-all flex items-center gap-1.5 animate-bounce"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Xác nhận có mặt</span>
            </button>
          ) : (
            <span className="px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Đã xác nhận có mặt
            </span>
          )}

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-5 py-2 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-black transition-all shadow-md shadow-[#365C4A]/20 flex items-center gap-1.5 active:scale-98"
          >
            <Award className="w-4 h-4 text-[#A7B99A]" />
            <span>Hoàn thành buổi học</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Selector (Chỉ hiện trên màn hình nhỏ) */}
      <div className="flex lg:hidden rounded-2xl bg-[#F8F5EE] p-1 border border-[#365C4A]/15 text-xs">
        <button
          onClick={() => setMobileTab('video')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'video' ? 'bg-[#365C4A] text-white shadow-sm' : 'text-[#553F35]/70'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Cam & Timer</span>
        </button>
        <button
          onClick={() => setMobileTab('board')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'board' ? 'bg-[#365C4A] text-white shadow-sm' : 'text-[#553F35]/70'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Bảng & Bài tập</span>
        </button>
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'chat' ? 'bg-[#365C4A] text-white shadow-sm' : 'text-[#553F35]/70'
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
          <div className="flex rounded-2xl bg-[#F8F5EE] p-1 border border-[#365C4A]/15 text-xs">
            <button
              onClick={() => setCenterTab('whiteboard')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                centerTab === 'whiteboard'
                  ? 'bg-[#365C4A] text-white shadow-sm'
                  : 'text-[#553F35]/70 hover:text-[#365C4A]'
              }`}
            >
              Bảng Trắng Giải Bài Đồng Bộ (Canvas P2P)
            </button>
            <button
              onClick={() => setCenterTab('resource')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                centerTab === 'resource'
                  ? 'bg-[#365C4A] text-white shadow-sm'
                  : 'text-[#553F35]/70 hover:text-[#365C4A]'
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
            <div className="p-6 rounded-3xl bg-white border border-[#365C4A]/20 space-y-3 min-h-[380px] overflow-y-auto shadow-md">
              {attachedResource ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-[#365C4A]/10">
                    <h3 className="font-black text-sm text-[#365C4A]">{attachedResource.title}</h3>
                    <span className="text-[10px] text-[#365C4A] font-bold px-2.5 py-0.5 rounded-full bg-[#A7B99A]/20 border border-[#A7B99A]/40">
                      {attachedResource.topic}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F8F5EE] font-mono text-xs text-[#365C4A] font-bold border border-[#365C4A]/15">
                    {attachedResource.formula_summary}
                  </div>
                  <div className="text-xs text-[#553F35] whitespace-pre-wrap leading-relaxed font-sans">
                    {attachedResource.content_markdown}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs text-[#553F35]/60">
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
