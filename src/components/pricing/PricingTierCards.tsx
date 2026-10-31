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

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TIER 1: FREE */}
        <div className={`rounded-3xl bg-white border p-6 flex flex-col justify-between transition-all shadow-md ${
          currentTier === 'free' ? 'border-[#365C4A]/40 ring-2 ring-[#365C4A]/10' : 'border-[#365C4A]/15 opacity-95'
        }`}>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#553F35]/70">Gói Cơ Bản</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black text-[#365C4A] font-mono">0đ</span>
              <span className="text-xs text-[#553F35]/70">/ mãi mãi</span>
            </div>
            <p className="text-xs text-[#553F35]/80 mt-2 font-medium">
              Dành cho sinh viên muốn trải nghiệm tự học và kiểm tra thuật toán ghép đôi.
            </p>

            <div className="my-5 pt-4 border-t border-[#365C4A]/10 space-y-2.5 text-xs text-[#553F35]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Giới hạn <strong>tối đa 3 lời mời ghép</strong> ({freeInvitesUsed}/3 đã dùng)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Phòng học P2P Pomodoro 25 phút</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bảng trắng Canvas giải bài</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Xem 15 tài liệu và Flashcards</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              disabled
              className="w-full py-2.5 rounded-full bg-[#F8F5EE] border border-[#365C4A]/20 text-[#553F35] text-xs font-bold cursor-default shadow-sm"
            >
              {currentTier === 'free' ? '✓ Gói hiện tại của bạn' : 'Gói Miễn Phí'}
            </button>
          </div>
        </div>

        {/* TIER 2: SPRINT PASS (29.000đ / 2 tuần) */}
        <div className={`rounded-3xl bg-[#FDFCF9] border-2 p-6 flex flex-col justify-between transition-all relative shadow-xl hover:shadow-2xl ${
          currentTier === 'sprint' ? 'border-[#D89C57] ring-2 ring-[#D89C57]/20' : 'border-[#D89C57]'
        }`}>
          <div className="absolute -top-3 left-6 px-3.5 py-0.5 rounded-full bg-[#D89C57] text-[10px] font-black text-white uppercase tracking-wider shadow">
            CẤP TỐC MÙA THI
          </div>

          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#D89C57]">PASS MÙA THI (SPRINT)</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black text-[#365C4A] font-mono">29.000đ</span>
              <span className="text-xs text-[#553F35]/70">/ 2 tuần cao điểm</span>
            </div>
            <p className="text-xs text-[#553F35]/90 mt-2 font-medium">
              Bảo hiểm qua môn hoàn hảo cho 2 tuần ôn thi Giữa kỳ hoặc Cuối kỳ.
            </p>

            <div className="my-5 pt-4 border-t border-[#D89C57]/20 space-y-2.5 text-xs text-[#553F35]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Ưu tiên ghép bạn giỏi</strong> trong 3 phút</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tặng thêm <strong>10 lời mời gửi trực tiếp</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tải toàn bộ đề ôn tập và đáp án chi tiết</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Được đối soát hoàn cọc cam kết ưu tiên</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectPlan('sprint_29k', 29000)}
              className="w-full py-3 rounded-full bg-[#D89C57] hover:bg-[#c28642] text-white text-xs font-black transition-all shadow-md shadow-[#D89C57]/30 flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>{currentTier === 'sprint' ? 'Gia hạn gói 29.000đ' : 'Đăng Ký Pass Mùa Thi (29k)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* TIER 3: STUDYMATCH PLUS (59.000đ / tháng) */}
        <div className={`rounded-3xl bg-gradient-to-b from-[#365C4A] to-[#264234] border-2 border-[#A7B99A] p-6 flex flex-col justify-between transition-all relative shadow-2xl text-white`}>
          <div className="absolute -top-3 left-6 px-3.5 py-0.5 rounded-full bg-[#A7B99A] text-[10px] font-black text-[#1E372C] uppercase tracking-wider shadow">
            KHUYÊN DÙNG NHẤT
          </div>

          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#A7B99A]">STUDYMATCH PLUS</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono">59.000đ</span>
              <span className="text-xs text-white/80">/ tháng (~1.900đ/ngày)</span>
            </div>
            <p className="text-xs text-white/90 mt-2 font-medium">
              Dành cho sinh viên quyết tâm đạt GPA 3.2+ để săn học bổng khuyến khích.
            </p>

            <div className="my-5 pt-4 border-t border-white/15 space-y-2.5 text-xs text-white">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A7B99A] shrink-0" />
                <span><strong>Không giới hạn</strong> lời mời ghép đôi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A7B99A] shrink-0" />
                <span><strong>Bảo vệ chuỗi Streak Freeze</strong> khi bận thi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A7B99A] shrink-0" />
                <span>Mở khóa phòng học Pomodoro 50 phút</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A7B99A] shrink-0" />
                <span>Chứng nhận Peer Mentor hỗ trợ bạn học</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectPlan('plus_59k', 59000)}
              className="w-full py-3 rounded-full bg-[#A7B99A] hover:bg-[#b8c9ab] text-[#1E372C] font-black text-xs transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 text-[#1E372C] fill-current" />
              <span>{currentTier === 'plus' ? 'Gia hạn Gói Plus' : '⚡ Đăng Ký Gói Plus (59k) →'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
