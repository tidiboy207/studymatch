import React from 'react';
import { PlanTier } from '../../types';
import { Check, Zap, Sparkles, ArrowRight } from 'lucide-react';

interface PricingTierCardsProps {
  currentTier: PlanTier;
  freeInvitesUsed: number;
  onSelectPlan: (planCode: 'plus_59k' | 'sprint_29k' | 'plus_29k' | 'sprint_19k', amount: number) => void;
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
          <h2 className="text-xl sm:text-2xl font-black text-[#365C4A] tracking-tight">
            Bảng Giá Dịch Vụ & Đo Lường Nhu Cầu Sinh Viên
          </h2>
          <p className="text-xs text-[#553F35]/70 mt-0.5 font-medium">
            Mô hình kinh doanh vi mô (Micro-subscription) đồng hành bảo hiểm qua môn và săn học bổng
          </p>
        </div>

        <button
          onClick={onOpenStartupMetrics}
          className="px-4 py-2 rounded-2xl bg-white hover:bg-[#F8F5EE] text-[#365C4A] border border-[#365C4A]/25 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D89C57]" />
          <span>Số Liệu Đo Lường Tăng Trưởng (Startup Metrics)</span>
        </button>
      </div>

      {/* 3 Pricing Cards Grid matching exact design from image */}
      <div className="bg-[#050814] rounded-3xl p-5 sm:p-7 border border-slate-800/90 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* TIER 1: GÓI CƠ BẢN (0đ / mãi mãi) */}
          <div className="rounded-2xl bg-[#0B101E] border border-slate-800/80 p-6 flex flex-col justify-between transition-all">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">GÓI CƠ BẢN</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono tracking-tight">0đ</span>
                <span className="text-xs text-slate-400 font-medium">/ mãi mãi</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                Dành cho sinh viên muốn trải nghiệm tự học và kiểm tra thuật toán ghép đôi.
              </p>

              <div className="my-6 pt-4 border-t border-slate-800/80 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Giới hạn <strong>tối đa 3 lời mời ghép</strong> ({freeInvitesUsed}/3 đã dùng)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Phòng học P2P Pomodoro 25 phút</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bảng trắng Canvas giải bài</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Xem 15 tài liệu và Flashcards</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-[#131b2e] border border-slate-700/60 text-slate-300 text-xs font-bold cursor-default text-center"
              >
                {currentTier === 'free' ? '✓ Gói hiện tại của bạn' : 'Gói Cơ Bản Miễn Phí'}
              </button>
            </div>
          </div>

          {/* TIER 2: PASS MÙA THI (SPRINT) - 19.000đ / 2 tuần cao điểm */}
          <div className="rounded-2xl bg-[#0B101E] border border-indigo-900/50 p-6 flex flex-col justify-between transition-all relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#4F46E5] text-[10px] font-black text-white uppercase tracking-wider shadow-lg shadow-indigo-600/30 whitespace-nowrap">
              CẤP TỐC MÙA THI
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-wider text-indigo-400">PASS MÙA THI (SPRINT)</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono tracking-tight">19.000đ</span>
                <span className="text-xs text-slate-400 font-medium">/ 2 tuần cao điểm</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                Bảo hiểm qua môn hoàn hảo cho 2 tuần ôn thi Giữa kỳ hoặc Cuối kỳ.
              </p>

              <div className="my-6 pt-4 border-t border-slate-800/80 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Ưu tiên ghép bạn giỏi</strong> trong 3 phút</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tặng thêm <strong>10 lời mời gửi trực tiếp</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tải toàn bộ đề ôn tập và đáp án chi tiết</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Được đối soát hoàn cọc cam kết ưu tiên</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onSelectPlan('sprint_19k', 19000)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white text-xs font-black transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>{currentTier === 'sprint' ? 'Gia hạn gói 19.000đ' : 'Đăng Ký Pass Mùa Thi (19k)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* TIER 3: STUDYMATCH PLUS - 29.000đ / tháng (~900đ/ngày) */}
          <div className="rounded-2xl bg-[#0B101E] border-2 border-[#059669] p-6 flex flex-col justify-between transition-all relative shadow-2xl shadow-emerald-950/40">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#059669] text-[10px] font-black text-[#022c22] uppercase tracking-wider shadow-lg shadow-emerald-600/30 whitespace-nowrap">
              KHUYÊN DÙNG NHẤT
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#34D399]">STUDYMATCH PLUS</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono tracking-tight">29.000đ</span>
                <span className="text-xs text-slate-400 font-medium">/ tháng (~900đ/ngày)</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                Dành cho sinh viên quyết tâm đạt GPA 3.2+ để săn học bổng khuyến khích.
              </p>

              <div className="my-6 pt-4 border-t border-slate-800/80 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Không giới hạn</strong> lời mời ghép đôi</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Bảo vệ chuỗi Streak Freeze</strong> khi bận thi</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mở khóa phòng học Pomodoro 50 phút</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Chứng nhận Peer Mentor hỗ trợ bạn học</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onSelectPlan('plus_29k', 29000)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white text-xs font-black transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Zap className="w-3.5 h-3.5 text-white fill-current" />
                <span>{currentTier === 'plus' ? 'Gia hạn Gói Plus (29k)' : 'Đăng Ký Gói Plus (29k)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
