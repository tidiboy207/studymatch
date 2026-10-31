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
  AlertCircle,
  Sparkles
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
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#365C4A]/20 p-6 sm:p-8 shadow-lg">
        {/* Decorative soft circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#A7B99A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#D89C57]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A7B99A]/20 text-[#365C4A] border border-[#A7B99A]/40 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#365C4A]" />
            <span>Lộ trình Kỷ luật & Đồng hành Học tập</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#365C4A] tracking-tight">
            Bạn chưa có buổi học cam kết nào hôm nay
          </h2>

          <p className="mt-2 text-sm text-[#553F35]/80 leading-relaxed font-medium">
            Môn học ưu tiên hiện tại của bạn là <span className="font-bold text-[#365C4A] underline decoration-[#A7B99A]">{currentUser.priority_subject}</span>.
            Hãy để thuật toán ghép đôi tìm người bạn cùng chuyên ngành có kiến thức bù trừ để mở phòng học Pomodoro 25/50 phút ngay!
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onFindPartner}
              className="px-6 py-3 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] active:scale-98 text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#365C4A]/25 transition-all flex items-center gap-2"
            >
              <span>Tìm bạn học bù trừ ngay</span>
              <ArrowRight className="w-4 h-4" />
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
    <div className="relative overflow-hidden rounded-3xl bg-white border border-[#365C4A]/20 p-6 sm:p-8 shadow-xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#A7B99A]/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Banner Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#365C4A]/15">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-[#365C4A]/10 text-[#365C4A] border border-[#365C4A]/25 text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#365C4A] animate-pulse" />
            PHIÊN HỌC ĐÃ LÊN LỊCH
          </span>
          <span className="text-xs text-[#553F35]/80 font-semibold">
            Thời lượng: <strong className="text-[#365C4A] font-bold">{session.duration_minutes} phút Pomodoro</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#553F35]/70">Điểm danh:</span>
          {isConfirmed ? (
            <span className="text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bạn đã xác nhận
            </span>
          ) : (
            <button
              onClick={onConfirmAttendance}
              className="text-[#553F35] font-bold flex items-center gap-1 bg-[#D89C57]/20 hover:bg-[#D89C57]/30 px-3 py-1 rounded-full border border-[#D89C57] transition-all"
            >
              <AlertCircle className="w-3.5 h-3.5 text-[#D89C57]" /> Xác nhận tham gia ngay
            </button>
          )}

          {partnerConfirmed ? (
            <span className="text-[#365C4A] text-xs font-semibold bg-[#A7B99A]/20 px-2.5 py-1 rounded-full border border-[#A7B99A]/40">
              Bạn học đã xác nhận
            </span>
          ) : (
            <span className="text-[#553F35]/60 text-xs italic">
              Chờ bạn học xác nhận...
            </span>
          )}
        </div>
      </div>

      {/* 3 Việc Quan Trọng Nhất */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* 1. Hôm nay học gì */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-[#365C4A] text-xs font-extrabold mb-1 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#365C4A]" />
              <span>1. Hôm nay học gì?</span>
            </div>
            <div className="text-base font-bold text-[#365C4A] mt-1">{session.subject}</div>
            <div className="text-xs font-semibold text-[#553F35] mt-1 flex items-center gap-1">
              <span>Chủ đề:</span>
              <span className="underline decoration-[#365C4A]/40">{session.topic}</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#553F35]/70 font-medium">
            {session.goals_checklist.length} mục tiêu bài tập đã thiết lập
          </div>
        </div>

        {/* 2. Học cùng ai */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-[#365C4A] text-xs font-extrabold mb-1 uppercase tracking-wider">
              <User className="w-4 h-4 text-[#365C4A]" />
              <span>2. Học cùng ai?</span>
            </div>
            <div className="text-base font-bold text-[#365C4A] mt-1 flex items-center gap-1.5">
              <span>{partnerName}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs text-[#553F35]/80 mt-1">{partnerUni}</div>
          </div>
          <div className="mt-3 text-[11px] text-[#365C4A] font-bold">
            Ghép bù trừ năng lực • Bảo mật liên hệ
          </div>
        </div>

        {/* 3. Buổi tiếp theo lúc nào */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-[#D89C57] text-xs font-extrabold mb-1 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#D89C57]" />
              <span>3. Lịch hẹn lúc nào?</span>
            </div>
            <div className="text-base font-bold text-[#365C4A] mt-1">{session.scheduled_slot}</div>
            <div className="text-xs text-[#553F35] mt-1 flex items-center gap-1">
              <span>Tiền cọc cam kết:</span>
              <strong className="text-[#365C4A] font-mono font-bold">50.000đ</strong>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-700 font-bold">
            ✓ Hoàn trả 100% khi vào đúng giờ
          </div>
        </div>

      </div>

      {/* Action Button: Vào Phòng Học */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="text-xs text-[#553F35]/80 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A7B99A] animate-pulse" />
          <span>Phòng học P2P Pomodoro đã sẵn sàng • Giữ tập trung tối đa</span>
        </div>

        <button
          onClick={onEnterRoom}
          className="px-6 py-3.5 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#365C4A]/25 transition-all flex items-center gap-2.5 group"
        >
          <Video className="w-5 h-5 text-[#A7B99A] group-hover:scale-110 transition-transform" />
          <span>VÀO PHÒNG HỌC CAM KẾT NGAY</span>
          <ArrowRight className="w-4 h-4 text-[#A7B99A] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
