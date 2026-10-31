import React from 'react';
import { PlanTier } from '../../types';
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface PricingTierCardsProps {
  currentTier: PlanTier;
  freeInvitesUsed: number;
  onSelectPlan: (planCode: 'plus_59k' | 'sprint_29k', amount: number) => void;
  onOpenStartupMetrics: () => void;
}

export const PricingTierCards: React.FC<PricingTierCardsProps> = ({
  currentTier,
  freeInvitesUsed,
  onSelectPlan,
  onOpenStartupMetrics
}) => {
  return (
    <div className="space-y-6">
      
      {/* Title & Conversion Metrics Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Bảng Giá Dịch Vụ & Đo Lường Fake Door Test
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mô hình kinh doanh vi mô (Micro-subscription) đánh trúng tâm lý vượt qua kỳ thi của sinh viên
          </p>
        </div>

        <button
          onClick={onOpenStartupMetrics}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-2 shadow"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Số Liệu Đo Lường Khởi Nghiệp (Startup Metrics)</span>
        </button>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* TIER 1: FREE */}
        <div className={`rounded-3xl bg-slate-900 border p-6 flex flex-col justify-between transition-all ${
          currentTier === 'free' ? 'border-slate-700 shadow-lg' : 'border-slate-800 opacity-90'
        }`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Gói Cơ Bản</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono">0đ</span>
              <span className="text-xs text-slate-400">/ mãi mãi</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Dành cho sinh viên muốn trải nghiệm tự học và kiểm tra thuật toán ghép đôi.
            </p>

            <div className="my-5 pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Giới hạn <strong>tối đa 3 lời mời ghép</strong> ({freeInvitesUsed}/3 đã dùng)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Phòng học P2P Pomodoro 25 phút</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bảng trắng Canvas giải bài</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Xem 15 tài liệu và Flashcards</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold cursor-default"
            >
              {currentTier === 'free' ? '✓ Gói hiện tại của bạn' : 'Gói Miễn Phí'}
            </button>
          </div>
        </div>

        {/* TIER 2: SPRINT PASS (29.000đ / 2 tuần) */}
        <div className={`rounded-3xl bg-slate-900 border p-6 flex flex-col justify-between transition-all relative ${
          currentTier === 'sprint' ? 'border-[#5B46F6] shadow-xl shadow-indigo-500/10' : 'border-[#5B46F6]/40 hover:border-[#5B46F6]'
        }`}>
          <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#5B46F6] text-[10px] font-extrabold text-white uppercase tracking-wider shadow">
            CẤP TỐC MÙA THI
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">PASS MÙA THI (SPRINT)</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono">29.000đ</span>
              <span className="text-xs text-slate-400">/ 2 tuần cao điểm</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Bảo hiểm qua môn hoàn hảo cho 2 tuần ôn thi Giữa kỳ hoặc Cuối kỳ.
            </p>

            <div className="my-5 pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Ưu tiên ghép bạn giỏi</strong> trong 3 phút</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tặng thêm <strong>10 lời mời gửi trực tiếp</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tải toàn bộ đề ôn tập và đáp án chi tiết</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Được đối soát hoàn cọc cam kết ưu tiên</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectPlan('sprint_29k', 29000)}
              className="w-full py-2.5 rounded-xl bg-[#5B46F6] hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>{currentTier === 'sprint' ? 'Gia hạn gói 29.000đ' : 'Đăng Ký Pass Mùa Thi (29k)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* TIER 3: STUDYMATCH PLUS (59.000đ / tháng) */}
        <div className={`rounded-3xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border p-6 flex flex-col justify-between transition-all relative shadow-2xl ${
          currentTier === 'plus' ? 'border-[#10B981] ring-2 ring-emerald-500/20' : 'border-[#10B981]/50 hover:border-emerald-400'
        }`}>
          <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#10B981] text-[10px] font-black text-slate-950 uppercase tracking-wider shadow">
            KHUYÊN DÙNG NHẤT
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">STUDYMATCH PLUS</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono">59.000đ</span>
              <span className="text-xs text-slate-400">/ tháng (~1.900đ/ngày)</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Dành cho sinh viên quyết tâm đạt GPA 3.2+ để săn học bổng khuyến khích.
            </p>

            <div className="my-5 pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-white">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Không giới hạn</strong> lời mời ghép đôi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Bảo vệ chuỗi Streak Freeze</strong> khi bận thi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mở khóa phòng học Pomodoro 50 phút</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Chứng nhận Peer Mentor hỗ trợ bạn học</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectPlan('plus_59k', 59000)}
              className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950 fill-current" />
              <span>{currentTier === 'plus' ? 'Gia hạn Gói Plus' : '⚡ Đăng Ký Gói Plus (59k) →'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
