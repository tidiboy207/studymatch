import React from 'react';
import { X, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface UpgradeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planCode: 'plus_59k' | 'sprint_29k' | 'plus_29k' | 'sprint_19k', amount: number) => void;
}

export const UpgradeLimitModal: React.FC<UpgradeLimitModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#365C4A]/25 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A7B99A]/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#365C4A] to-[#264234] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-[#D89C57]">
              <Zap className="w-6 h-6 animate-pulse fill-current" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-[#A7B99A] border border-white/20">
                Đã dùng hết 3 lượt Free
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                Mở Khóa Lời Mời Học Không Giới Hạn
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#553F35]/85 leading-relaxed font-medium">
            Bạn đã sử dụng hết <strong className="text-[#365C4A]">3 lượt gửi lời mời miễn phí</strong> của tài khoản Cơ bản.
            Để bảo vệ chất lượng kết nối và tránh spam trong cộng đồng sinh viên, hãy chọn một trong hai gói sau với chi phí chỉ bằng một cốc trà sữa:
          </p>

          {/* Pricing Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            
            {/* Sprint Pass */}
            <div className="p-4 rounded-2xl bg-[#FDFCF9] border-2 border-[#D89C57] flex flex-col justify-between shadow-sm">
              <div>
                <div className="text-xs font-black text-[#D89C57] uppercase tracking-wider">Pass Mùa Thi</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#365C4A] font-mono">19.000đ</span>
                  <span className="text-[11px] text-[#553F35]/70">/ 2 tuần</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-[11px] text-[#553F35] font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Ưu tiên ghép bạn giỏi trong 3 phút</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Thêm 10 lời mời gửi trực tiếp</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onSelectPlan('sprint_19k', 19000)}
                className="mt-4 w-full py-2.5 rounded-full bg-[#D89C57] hover:bg-[#c28642] text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#D89C57]/20 active:scale-95"
              >
                <span>Chọn 19.000đ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* StudyMatch Plus */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#365C4A] to-[#264234] border-2 border-[#A7B99A] text-white flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#A7B99A] text-[9px] font-black text-[#1E372C] uppercase tracking-wider shadow">
                Khuyên Dùng
              </div>
              <div>
                <div className="text-xs font-black text-[#A7B99A] uppercase tracking-wider">StudyMatch Plus</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white font-mono">29.000đ</span>
                  <span className="text-[11px] text-white/80">/ tháng</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-[11px] text-white/95 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A7B99A] shrink-0" />
                    <span><strong>Không giới hạn</strong> lời mời ghép</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A7B99A] shrink-0" />
                    <span>Bảo vệ chuỗi Streak Freeze</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A7B99A] shrink-0" />
                    <span>Mở khóa Pomodoro 50 phút</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onSelectPlan('plus_29k', 29000)}
                className="mt-4 w-full py-2.5 rounded-full bg-[#A7B99A] hover:bg-[#b8c9ab] text-[#1E372C] font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-black/20 active:scale-95"
              >
                <span>Nâng Cấp 29.000đ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 text-[11px] text-[#553F35]/80 text-center font-medium">
            💡 So với học phí học lại 1 môn 3 tín chỉ tại đại học là <strong className="text-rose-600">2.400.000đ</strong>, chi phí gói chỉ tương đương <strong>1,2%</strong>.
          </div>
        </div>

      </div>
    </div>
  );
};
