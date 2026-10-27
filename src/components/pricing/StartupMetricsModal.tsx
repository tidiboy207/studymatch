import React from 'react';
import { PaymentEvent } from '../../types';
import { BarChart3, X, TrendingUp, DollarSign, Users, CheckCircle2, Clock } from 'lucide-react';

interface StartupMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: {
    totalClicks: number;
    confirmedTransfers: number;
    conversionRate: number;
    totalRevenue: number;
  };
  events: PaymentEvent[];
}

export const StartupMetricsModal: React.FC<StartupMetricsModalProps> = ({
  isOpen,
  onClose,
  metrics,
  events
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Số Liệu Đo Lường Khởi Nghiệp (Startup Metrics)</h3>
              <p className="text-xs text-slate-400">Dữ liệu thực nghiệm Fake Door Test từ bảng payment_events</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core KPIs Cards */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Total Clicks */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Lượt Bấm Mua (Clicks)
              </span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {metrics.totalClicks}
              </div>
              <span className="text-[10px] text-indigo-400 mt-1 block">Nhu cầu trả phí</span>
            </div>

            {/* Confirmed */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Đã Xác Nhận Chuyển
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {metrics.confirmedTransfers}
              </div>
              <span className="text-[10px] text-emerald-400/80 mt-1 block">Khách hàng sẵn sàng</span>
            </div>

            {/* Conversion Rate */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tỷ Lệ Chuyển Đổi (CVR)
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                {metrics.conversionRate}%
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Xác nhận / Bấm mua</span>
            </div>

            {/* Revenue */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Doanh Thu GMV
              </span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {metrics.totalRevenue.toLocaleString()}đ
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 block">Gói 19k + 29k</span>
            </div>

          </div>

          {/* Academic Pitch Summary Note */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-slate-300 leading-relaxed space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Ý nghĩa thực chứng cho bài thuyết trình khởi nghiệp:</span>
            </div>
            <p>
              • Thử nghiệm Fake Door Test chứng minh sinh viên Việt Nam không chỉ cần tìm bạn học mà sẵn sàng chi trả mức giá vi mô (Micro-subscription 19.000đ – 29.000đ) để bảo vệ điểm GPA và tránh học lại 2,4 triệu đồng.
            </p>
            <p>
              • Tỷ lệ chuyển đổi đạt <strong>{metrics.conversionRate}%</strong> là bằng chứng thực tế thuyết phục nhà đầu tư và hội đồng đánh giá về tính khả thi thương mại độc lập.
            </p>
          </div>

          {/* Event Log Table */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              Nhật ký giao dịch gần nhất (Bảng payment_events)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                    <th className="p-2.5">Thời gian</th>
                    <th className="p-2.5">Gói dịch vụ</th>
                    <th className="p-2.5">Số tiền</th>
                    <th className="p-2.5">Trạng thái xác nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-900/50">
                      <td className="p-2.5 text-slate-400 text-[11px]">
                        {new Date(ev.clicked_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="p-2.5 font-sans font-semibold text-white">
                        {ev.plan_code === 'plus_29k' ? 'StudyMatch Plus' : 'Pass Mùa Thi'}
                      </td>
                      <td className="p-2.5 text-emerald-400 font-bold">
                        {ev.amount.toLocaleString()}đ
                      </td>
                      <td className="p-2.5">
                        {ev.user_confirmed_transfer ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-sans font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã xác nhận
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-sans">
                            Chờ quét QR
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
