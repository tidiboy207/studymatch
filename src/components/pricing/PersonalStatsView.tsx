import React from 'react';
import { StudySession, UserProfile } from '../../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Repeat,
  Wallet,
  ShieldCheck,
  User,
  ArrowRight
} from 'lucide-react';

interface PersonalStatsViewProps {
  currentUser: UserProfile;
  sessions: StudySession[];
  onBookNext: (partnerId: string) => void;
  onFindReplacement: () => void;
}

export const PersonalStatsView: React.FC<PersonalStatsViewProps> = ({
  currentUser,
  sessions,
  onBookNext,
  onFindReplacement
}) => {
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const missedSessions = sessions.filter(s => s.status === 'missed');
  const totalMinutes = currentUser.total_study_minutes;
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Group partners studied with
  const partnerMap = new Map<string, { profile: UserProfile; count: number; lastTopic: string }>();
  sessions.forEach(s => {
    if (s.partner_profile) {
      const existing = partnerMap.get(s.partner_profile.id);
      if (existing) {
        existing.count += 1;
      } else {
        partnerMap.set(s.partner_profile.id, {
          profile: s.partner_profile,
          count: 1,
          lastTopic: s.topic
        });
      }
    }
  });

  const uniquePartners = Array.from(partnerMap.values());

  return (
    <div className="space-y-6">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Hours */}
        <div className="p-5 rounded-3xl bg-white border border-[#365C4A]/15 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#553F35]/70 uppercase tracking-wider">
              Tổng Giờ Tự Học
            </span>
            <div className="text-3xl font-black text-[#365C4A] font-mono mt-1">
              {totalHours}h
            </div>
            <span className="text-[11px] text-[#365C4A] font-semibold mt-1 block">
              {totalMinutes} phút Pomodoro
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#365C4A]/10 border border-[#365C4A]/20 flex items-center justify-center text-[#365C4A]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Sessions */}
        <div className="p-5 rounded-3xl bg-white border border-[#365C4A]/15 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#553F35]/70 uppercase tracking-wider">
              Buổi Đã Hoàn Thành
            </span>
            <div className="text-3xl font-black text-emerald-700 font-mono mt-1">
              {completedSessions.length}
            </div>
            <span className="text-[11px] text-emerald-800 font-bold mt-1 block">
              100% Hoàn cọc cam kết
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Missed Sessions */}
        <div className="p-5 rounded-3xl bg-white border border-[#365C4A]/15 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#553F35]/70 uppercase tracking-wider">
              Buổi Bỏ Lỡ / Vắng
            </span>
            <div className="text-3xl font-black text-rose-700 font-mono mt-1">
              {missedSessions.length}
            </div>
            <span className="text-[11px] text-rose-700 font-medium mt-1 block">
              Đã bị trừ 10.000đ/lần
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Commitment Fund Balance */}
        <div className="p-5 rounded-3xl bg-white border border-[#365C4A]/15 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#553F35]/70 uppercase tracking-wider">
              Số Dư Quỹ Kỷ Luật
            </span>
            <div className="text-3xl font-black text-[#D89C57] font-mono mt-1">
              {currentUser.commitment_deposit.toLocaleString()}đ
            </div>
            <span className="text-[11px] text-[#D89C57] font-semibold mt-1 block">
              Đang bảo chứng các buổi hẹn
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#D89C57]/15 border border-[#D89C57]/30 flex items-center justify-center text-[#D89C57]">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* History of Study Partners & Retention Options */}
      <div className="p-6 rounded-3xl bg-white border border-[#365C4A]/20 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-[#365C4A] flex items-center gap-2">
              <User className="w-4 h-4 text-[#365C4A]" />
              <span>Danh Sách Bạn Đã Học Cùng & Quyết Định Duy Trì</span>
            </h3>
            <p className="text-xs text-[#553F35]/70 font-medium">
              Quản lý mạng lưới học tập ngang hàng: Giữ lại học tiếp hoặc Tìm bạn thay thế
            </p>
          </div>

          <button
            onClick={onFindReplacement}
            className="px-4 py-2 rounded-full bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#365C4A] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#365C4A]/20"
          >
            <Repeat className="w-3.5 h-3.5 text-[#365C4A]" />
            <span>Tìm Bạn Học Thay Thế</span>
          </button>
        </div>

        {uniquePartners.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#553F35]/60 border border-dashed border-[#365C4A]/20 rounded-2xl bg-[#F8F5EE]">
            Chưa có lịch sử bạn học. Hãy hoàn thành phiên học đầu tiên ngay hôm nay!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uniquePartners.map(({ profile, count, lastTopic }) => (
              <div
                key={profile.id}
                className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 hover:border-[#365C4A]/40 transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#365C4A] text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                    {profile.display_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#365C4A]">{profile.display_name}</span>
                      {profile.is_edu_verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-[#553F35]/80 font-medium">{profile.university}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#553F35]">
                      <span>Đã học cùng: <strong className="text-[#365C4A]">{count} buổi</strong></span>
                      <span>•</span>
                      <span>Chủ đề: <strong className="text-emerald-700">{lastTopic}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#365C4A]/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onBookNext(profile.id)}
                    className="px-4 py-2 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-[#365C4A]/20 active:scale-98"
                  >
                    <span>Đặt lịch học tiếp</span>
                    <ArrowRight className="w-3 h-3 text-[#A7B99A]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
