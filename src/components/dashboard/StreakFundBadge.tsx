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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      
      {/* 1. Chuỗi Ngày Học Liên Tiếp (Streak) */}
      <div className="p-6 rounded-3xl bg-white border border-[#365C4A]/20 shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D89C57]/15 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#D89C57] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-[#D89C57] text-[#D89C57] animate-bounce" />
              Chuỗi Ngày Học Kỷ Luật (Streak)
            </span>
            <span className="text-xs text-[#553F35]/70 font-medium">
              {currentUser.total_study_minutes} phút tự học tích lũy
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#365C4A] tracking-tight">
              {currentUser.streak_days}
            </span>
            <span className="text-sm font-bold text-[#553F35]">ngày liên tiếp</span>
          </div>

          <p className="mt-1 text-xs text-[#553F35]/80 leading-relaxed">
            {currentUser.streak_days >= 7
              ? '🔥 Bạn đang giữ phong độ cực kỳ ấn tượng! Tiếp tục duy trì để bảo toàn thói quen phản xạ.'
              : '🌱 Hãy duy trì ít nhất 1 phiên học Pomodoro 25 phút mỗi ngày để tạo dựng kỷ luật bền vững.'}
          </p>
        </div>

        {/* 7-Day Visual Mini Bar */}
        <div className="mt-5 pt-3.5 border-t border-[#365C4A]/10">
          <div className="flex items-center justify-between text-[11px] text-[#553F35]/70 mb-2 font-medium">
            <span>Tiến độ tuần này</span>
            <span className="text-[#365C4A] font-mono font-bold">
              {Math.min(currentUser.streak_days, 7)} / 7 ngày
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, idx) => {
              const active = idx < currentUser.streak_days;
              return (
                <div
                  key={d}
                  className={`h-2.5 rounded-full transition-all ${
                    active ? 'bg-[#365C4A] shadow-sm' : 'bg-[#EBE8DF]'
                  }`}
                  title={`${d}: ${active ? 'Đã hoàn thành' : 'Chưa học'}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Quỹ Cam Kết Kỷ Luật (Financial Commitment Contract) */}
      <div className="p-6 rounded-3xl bg-white border border-[#365C4A]/20 shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#A7B99A]/20 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#365C4A] uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#365C4A]" />
              Quỹ Cam Kết Kỷ Luật
            </span>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-[#553F35]/70 hover:text-[#365C4A] flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Cơ chế hoàn cọc?</span>
            </button>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#365C4A] tracking-tight font-mono">
              {currentUser.commitment_deposit.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-[#365C4A]">VNĐ</span>
          </div>

          <p className="mt-1 text-xs text-[#553F35]/80 leading-relaxed">
            Số dư cọc tự nguyện giúp bạn thắng cơn trì hoãn.
            <strong className="text-emerald-800 ml-1 font-bold">Vào phòng đúng giờ được bảo toàn 100%.</strong>
          </p>
        </div>

        {/* Explanation dropdown / Top up buttons */}
        <div className="mt-5 pt-3.5 border-t border-[#365C4A]/10">
          {showExplanation ? (
            <div className="p-3.5 rounded-2xl bg-[#F8F5EE] text-xs text-[#553F35] space-y-1.5 border border-[#365C4A]/15 animate-in fade-in">
              <div className="font-bold text-[#365C4A] flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D89C57]" />
                Cơ chế "Sợ mất tiền" (Loss Aversion):
              </div>
              <p>• <strong>Học đúng giờ:</strong> Hoàn trả 100% tiền cọc (Học hoàn toàn miễn phí).</p>
              <p>• <strong>Bùng học không lý do:</strong> Trừ 10.000đ/lần (5.000đ đền bù cho bạn học bị leo cây, 5.000đ phí vận hành hệ thống).</p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#553F35]/70 font-medium">Nạp thêm tiền cọc kỷ luật:</span>
              <div className="flex gap-2">
                <button
                  disabled={isToppingUp}
                  onClick={() => handleTopUp(20000)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#365C4A] border border-[#365C4A]/20 transition-all"
                >
                  +20.000đ
                </button>
                <button
                  disabled={isToppingUp}
                  onClick={() => handleTopUp(50000)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#365C4A] hover:bg-[#2B4A3B] text-white shadow-sm transition-all"
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
