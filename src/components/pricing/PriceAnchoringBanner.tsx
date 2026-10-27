import React from 'react';
import { AlertOctagon, ShieldCheck, Sparkles, TrendingDown, ArrowRight } from 'lucide-react';

export const PriceAnchoringBanner: React.FC = () => {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left text */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-bold mb-3">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Chiến Lược Neo Giá Học Thuật (Price Anchoring)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Trượt 1 môn đại cương tốn <span className="text-rose-400 underline decoration-rose-500/50">2.400.000đ</span> học lại.
            <br className="hidden sm:inline" /> Gói bảo hiểm qua môn chỉ từ <span className="text-emerald-400">19.000đ</span>.
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tại ĐH Bách khoa Hà Nội và các trường kỹ thuật, tỷ lệ trượt môn Giải tích, Đại số dao động từ <strong>25% – 35%</strong> kèm nguy cơ <strong>Cảnh cáo học vụ Mức 1</strong> (bị khóa trần còn 14 tín chỉ). Chi phí gói StudyMatch chỉ tương đương <strong className="text-emerald-300">0,8% tiền học lại</strong> — chưa bằng một suất cơm bụi sinh viên.
          </p>
        </div>

        {/* Right comparison visual cards */}
        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
          
          {/* Card Rủi ro: Học lại */}
          <div className="flex-1 lg:w-44 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-center">
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
              Thiệt Hại Học Lại
            </span>
            <div className="text-2xl font-black text-rose-300 font-mono mt-1">
              2.400.000đ
            </div>
            <div className="text-[11px] text-rose-300/80 mt-1">
              + Nguy cơ Cảnh cáo Mức 1
            </div>
          </div>

          <div className="text-slate-600 font-bold text-xs uppercase">VS</div>

          {/* Card Giải pháp: StudyMatch */}
          <div className="flex-1 lg:w-48 p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-emerald-500/50 text-center shadow-lg">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gói Pass Mùa Thi
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              19.000đ
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1">
              Chỉ bằng ~0,8% chi phí!
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
