import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Flame, Wallet, ShieldAlert, Award, ArrowUpRight, HelpCircle } from 'lucide-react';

interface StreakFundBadgeProps {
  currentUser: UserProfile;
  onTopUpDeposit: (amount: number) => Promise<void>;
}

export const StreakFundBadge: React.FC<StreakFundBadgeProps> = ({
  currentUser,
  onTopUpDeposit
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);

  const handleTopUp = async (amt: number) => {
    setIsToppingUp(true);
    try {
      await onTopUpDeposit(amt);
    } finally {
      setIsToppingUp(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* 1. Chuỗi Ngày Học Liên Tiếp (Streak) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
              Chuỗi Ngày Học Kỷ Luật (Streak)
            </span>
            <span className="text-xs text-slate-400">
              {currentUser.total_study_minutes} phút tự học tích lũy
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {currentUser.streak_days}
            </span>
            <span className="text-base font-semibold text-slate-400">ngày liên tiếp</span>
          </div>

          <p className="mt-1 text-xs text-slate-300">
            {currentUser.streak_days >= 7
              ? '🔥 Bạn đang giữ phong độ cực kỳ ấn tượng! Tiếp tục duy trì để bảo toàn phản xạ.'
              : '🌱 Hãy duy trì ít nhất 1 phiên học 25 phút mỗi ngày để tạo lập thói quen.'}
          </p>
        </div>

        {/* 7-Day Visual Mini Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Tiến độ tuần này</span>
            <span className="text-amber-400 font-mono font-semibold">
              {Math.min(currentUser.streak_days, 7)} / 7 ngày
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, idx) => {
              const active = idx < currentUser.streak_days;
              return (
                <div
                  key={d}
                  className={`h-2 rounded-full transition-all ${
                    active ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-slate-800'
                  }`}
                  title={`${d}: ${active ? 'Đã hoàn thành' : 'Chưa học'}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Quỹ Cam Kết Kỷ Luật (Financial Commitment Contract) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              Quỹ Cam Kết Kỷ Luật
            </span>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Cơ chế hoàn cọc?</span>
            </button>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {currentUser.commitment_deposit.toLocaleString()}
            </span>
            <span className="text-base font-semibold text-emerald-400">VNĐ</span>
          </div>

          <p className="mt-1 text-xs text-slate-300">
            Số dư cọc tự nguyện dùng để ép bản thân vào kỷ luật.
            <strong className="text-emerald-300 ml-1">Vào phòng đúng giờ được giữ nguyên 100%.</strong>
          </p>
        </div>

        {/* Explanation dropdown / Top up buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          {showExplanation ? (
            <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300 space-y-1.5 border border-slate-800">
              <div className="font-semibold text-white flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Cơ chế "Sợ mất tiền" (Loss Aversion):
              </div>
              <p>• <strong>Học đúng giờ:</strong> Hoàn trả 100% số tiền cọc (Học hoàn toàn miễn phí).</p>
              <p>• <strong>Bùng học không lý do:</strong> Trừ 10.000đ/lần (50% = 5.000đ đền bù cho bạn học bị leo cây, 50% = 5.000đ phí vận hành hệ thống).</p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">Nạp thêm tiền cọc thử nghiệm:</span>
              <div className="flex gap-2">
                <button
                  disabled={isToppingUp}
                  onClick={() => handleTopUp(20000)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  +20.000đ
                </button>
                <button
                  disabled={isToppingUp}
                  onClick={() => handleTopUp(50000)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all"
                >
                  +50.000đ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
