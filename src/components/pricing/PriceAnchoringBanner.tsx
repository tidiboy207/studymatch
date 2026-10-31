import React from 'react';
import { AlertOctagon, ShieldCheck, Sparkles } from 'lucide-react';

export const PriceAnchoringBanner: React.FC = () => {
  return (
    <div className="rounded-3xl bg-white border border-[#365C4A]/20 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#A7B99A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D89C57]/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left text */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold mb-3 shadow-sm">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span>Chiến Lược Neo Giá Học Thuật (Price Anchoring)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#365C4A] tracking-tight leading-snug">
            Trượt 1 môn đại cương tốn <span className="text-rose-600 underline decoration-rose-400">2.400.000đ</span> học lại.
            <br className="hidden sm:inline" /> Gói bảo hiểm qua môn chỉ từ <span className="text-[#365C4A] bg-[#A7B99A]/30 px-2 py-0.5 rounded-lg border border-[#A7B99A]">29.000đ</span>.
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-[#553F35]/85 leading-relaxed font-medium">
            Tại ĐH Bách khoa Hà Nội và các trường kỹ thuật, tỷ lệ trượt môn Giải tích, Đại số dao động từ <strong>25% – 35%</strong> kèm nguy cơ <strong>Cảnh cáo học vụ Mức 1</strong> (bị khóa trần còn 14 tín chỉ). Chi phí gói StudyMatch chỉ tương đương <strong className="text-[#365C4A]">1,2% tiền học lại</strong> — chưa bằng một cốc trà sữa hoặc suất cơm bụi sinh viên.
          </p>
        </div>

        {/* Right comparison visual cards */}
        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
          
          {/* Card Rủi ro: Học lại */}
          <div className="flex-1 lg:w-44 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center shadow-sm">
            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
              Thiệt Hại Học Lại
            </span>
            <div className="text-2xl font-black text-rose-700 font-mono mt-1">
              2.400.000đ
            </div>
            <div className="text-[11px] text-rose-800 font-medium mt-1">
              + Nguy cơ Cảnh cáo Mức 1
            </div>
          </div>

          <div className="text-[#553F35]/60 font-black text-xs uppercase">VS</div>

          {/* Card Giải pháp: StudyMatch */}
          <div className="flex-1 lg:w-48 p-4 rounded-2xl bg-gradient-to-br from-[#365C4A] to-[#264234] border border-[#A7B99A] text-center shadow-xl text-white">
            <span className="text-[10px] uppercase font-black text-[#A7B99A] tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D89C57]" />
              Gói Pass Mùa Thi
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              29.000đ
            </div>
            <div className="text-[11px] text-[#A7B99A] font-bold mt-1">
              Chỉ bằng ~1,2% chi phí!
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
