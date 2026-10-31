import React from 'react';
import { Sparkles, X, ShieldAlert, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface UpgradeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planCode: 'plus_59k' | 'sprint_29k', amount: number) => void;
}

export const UpgradeLimitModal: React.FC<UpgradeLimitModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/30 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Đã đạt giới hạn Gói Free
              </span>
              <h3 className="text-lg font-extrabold text-white mt-1">
                Mở Khóa Lời Mời Học Không Giới Hạn
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Bạn đã sử dụng hết <strong className="text-white">3 lượt gửi lời mời miễn phí</strong> của tài khoản Free.
            Để bảo vệ chất lượng kết nối và tránh spam trong cộng đồng sinh viên, hãy nâng cấp một trong hai gói sau với chi phí chỉ bằng một cốc trà đá/suất cơm bụi:
          </p>

          {/* Pricing Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            
            {/* Sprint Pass */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition-all flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Pass Mùa Thi</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white font-mono">29.000đ</span>
                  <span className="text-[11px] text-slate-400">/ 2 tuần</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Ưu tiên ghép bạn giỏi trong 3 phút</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Thêm 10 lời mời gửi trực tiếp</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onSelectPlan('sprint_29k', 29000)}
                className="mt-4 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <span>Chọn 29.000đ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* StudyMatch Plus */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-950 border border-indigo-500/50 hover:border-indigo-400 transition-all flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-[9px] font-extrabold text-slate-950 uppercase tracking-wider">
                Khuyên Dùng
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">StudyMatch Plus</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white font-mono">59.000đ</span>
                  <span className="text-[11px] text-slate-400">/ tháng</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Không giới hạn</strong> lời mời ghép</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Bảo vệ chuỗi Streak Freeze</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Mở khóa phòng Pomodoro 50 phút</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onSelectPlan('plus_59k', 59000)}
                className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <span>Nâng Cấp 59.000đ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-center">
            💡 So với học phí học lại 1 môn 3 tín chỉ tại HUST là <strong className="text-rose-400">2.400.000đ</strong>, chi phí gói chỉ tương đương <strong>0,8%</strong>.
          </div>
        </div>

      </div>
    </div>
  );
};
