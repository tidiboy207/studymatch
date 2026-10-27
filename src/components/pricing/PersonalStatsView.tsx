import React from 'react';
import { StudySession, UserProfile } from '../../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Repeat,
  Calendar,
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
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tổng Giờ Tự Học
            </span>
            <div className="text-3xl font-black text-white font-mono mt-1">
              {totalHours}h
            </div>
            <span className="text-[11px] text-indigo-400 mt-1 block">
              {totalMinutes} phút Pomodoro
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Sessions */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Buổi Đã Hoàn Thành
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
              {completedSessions.length}
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-1 block">
              100% Hoàn cọc cam kết
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Missed Sessions */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Buổi Bỏ Lỡ / Vắng
            </span>
            <div className="text-3xl font-black text-rose-400 font-mono mt-1">
              {missedSessions.length}
            </div>
            <span className="text-[11px] text-rose-400/80 mt-1 block">
              Đã bị trừ 10.000đ/lần
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Commitment Fund Balance */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Số Dư Quỹ Kỷ Luật
            </span>
            <div className="text-3xl font-black text-white font-mono mt-1">
              {currentUser.commitment_deposit.toLocaleString()}đ
            </div>
            <span className="text-[11px] text-amber-400 mt-1 block">
              Đang bảo chứng các buổi hẹn
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* History of Study Partners & Retention Options */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Danh Sách Bạn Đã Học Cùng & Quyết Định Duy Trì</span>
            </h3>
            <p className="text-xs text-slate-400">
              Quản lý mạng lưới học tập ngang hàng: Giữ lại học tiếp hoặc Tìm bạn thay thế
            </p>
          </div>

          <button
            onClick={onFindReplacement}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Tìm Bạn Học Thay Thế</span>
          </button>
        </div>

        {uniquePartners.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            Chưa có lịch sử bạn học. Hãy hoàn thành phiên học đầu tiên ngay hôm nay!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uniquePartners.map(({ profile, count, lastTopic }) => (
              <div
                key={profile.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-sm shrink-0">
                    {profile.display_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">{profile.display_name}</span>
                      {profile.is_edu_verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{profile.university}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-300">
                      <span>Đã học cùng: <strong className="text-indigo-400">{count} buổi</strong></span>
                      <span>•</span>
                      <span>Chủ đề: <strong className="text-emerald-400">{lastTopic}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onBookNext(profile.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow"
                  >
                    <span>Đặt lịch học tiếp</span>
                    <ArrowRight className="w-3 h-3" />
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
