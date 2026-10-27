import React from 'react';
import { StudySession, UserProfile } from '../../types';
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Video,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface HeroTodayCardProps {
  session: StudySession | null;
  currentUser: UserProfile;
  onEnterRoom: () => void;
  onConfirmAttendance: () => void;
  onFindPartner: () => void;
}

export const HeroTodayCard: React.FC<HeroTodayCardProps> = ({
  session,
  currentUser,
  onEnterRoom,
  onConfirmAttendance,
  onFindPartner
}) => {
  if (!session) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Lộ trình Kỷ luật Cá nhân
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bạn chưa có buổi học cam kết nào hôm nay
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Môn ưu tiên của bạn hiện tại là <span className="font-semibold text-indigo-300">{currentUser.priority_subject}</span>.
            Hãy để thuật toán ghép bạn với bạn học bù trừ năng lực ngay để kích hoạt buổi học 25/50 phút!
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onFindPartner}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Tìm bạn học bù trừ ngay</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isUserA = session.user_a_id === currentUser.id;
  const isConfirmed = isUserA ? session.user_a_confirmed : session.user_b_confirmed;
  const partnerConfirmed = isUserA ? session.user_b_confirmed : session.user_a_confirmed;
  const partnerName = session.partner_profile?.display_name || 'Bạn học ghép cặp';
  const partnerUni = session.partner_profile?.university || 'Đại học Bách khoa Hà Nội';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/40 p-6 sm:p-8 shadow-2xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Banner Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PHIÊN HỌC ĐÃ LÊN LỊCH
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Thời lượng: <strong className="text-white">{session.duration_minutes} phút Pomodoro</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Trạng thái điểm danh:</span>
          {isConfirmed ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> Bạn đã xác nhận
            </span>
          ) : (
            <button
              onClick={onConfirmAttendance}
              className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-lg border border-amber-500/40 transition-all animate-bounce"
            >
              <AlertCircle className="w-3.5 h-3.5" /> Xác nhận tham gia ngay
            </button>
          )}

          {partnerConfirmed ? (
            <span className="text-indigo-300 text-[11px] bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800">
              Bạn học đã xác nhận
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Chờ bạn học xác nhận...
            </span>
          )}
        </div>
      </div>

      {/* 3 Việc Quan Trọng Nhất */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* 1. Hôm nay học gì */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              1. Hôm nay học gì?
            </div>
            <div className="text-base font-bold text-white mt-1">{session.subject}</div>
            <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <span>Chủ đề trọng tâm:</span>
              <span className="underline decoration-emerald-500/50">{session.topic}</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {session.goals_checklist.length} mục tiêu bài tập đã thiết lập
          </div>
        </div>

        {/* 2. Học cùng ai */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              <User className="w-4 h-4" />
              2. Học cùng ai?
            </div>
            <div className="text-base font-bold text-white mt-1 flex items-center gap-1.5">
              <span>{partnerName}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1">{partnerUni}</div>
          </div>
          <div className="mt-3 text-[11px] text-indigo-300 font-medium">
            Ghép bù trừ năng lực • Ẩn SĐT/Email
          </div>
        </div>

        {/* 3. Buổi tiếp theo lúc nào */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              3. Buổi tiếp theo lúc nào?
            </div>
            <div className="text-base font-bold text-white mt-1">{session.scheduled_slot}</div>
            <div className="text-xs text-amber-300/80 mt-1 flex items-center gap-1">
              <span>Khóa cọc cam kết:</span>
              <strong className="text-white font-mono">50.000đ</strong>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400">
            Hoàn 100% khi vào đúng giờ
          </div>
        </div>

      </div>

      {/* Action Button: Vào Phòng Học */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Phòng học P2P WebRTC đã sẵn sàng • Không mở ứng dụng ngoài</span>
        </div>

        <button
          onClick={onEnterRoom}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2.5 group"
        >
          <Video className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
          <span>VÀO PHÒNG HỌC CAM KẾT NGAY</span>
          <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
