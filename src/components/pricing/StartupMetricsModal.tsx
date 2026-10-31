import React from 'react';
import { PaymentEvent } from '../../types';
import { BarChart3, X, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#365C4A]/25 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#365C4A] to-[#264234] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-[#A7B99A]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Số Liệu Đo Lường Tăng Trưởng (Startup Metrics)</h3>
              <p className="text-xs text-white/80 font-medium">Dữ liệu thực nghiệm nhu cầu thị trường từ bảng payment_events</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core KPIs Cards */}
        <div className="p-6 overflow-y-auto space-y-6 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Total Clicks */}
            <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 text-center">
              <span className="text-[10px] font-bold text-[#553F35]/70 uppercase tracking-wider block">
                Lượt Bấm Mua (Clicks)
              </span>
              <div className="text-2xl font-black text-[#365C4A] font-mono mt-1">
                {metrics.totalClicks}
              </div>
              <span className="text-[10px] text-[#365C4A] font-semibold mt-1 block">Nhu cầu trả phí</span>
            </div>

            {/* Confirmed */}
            <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 text-center">
              <span className="text-[10px] font-bold text-[#553F35]/70 uppercase tracking-wider block">
                Đã Xác Nhận Chuyển
              </span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
                {metrics.confirmedTransfers}
              </div>
              <span className="text-[10px] text-emerald-800 font-bold mt-1 block">Khách hàng sẵn sàng</span>
            </div>

            {/* Conversion Rate */}
            <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 text-center">
              <span className="text-[10px] font-bold text-[#553F35]/70 uppercase tracking-wider block">
                Tỷ Lệ Chuyển Đổi (CVR)
              </span>
              <div className="text-2xl font-black text-[#D89C57] font-mono mt-1">
                {metrics.conversionRate}%
              </div>
              <span className="text-[10px] text-[#553F35]/70 font-medium mt-1 block">Xác nhận / Bấm mua</span>
            </div>

            {/* Revenue */}
            <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 text-center">
              <span className="text-[10px] font-bold text-[#553F35]/70 uppercase tracking-wider block">
                Doanh Thu GMV
              </span>
              <div className="text-2xl font-black text-[#365C4A] font-mono mt-1">
                {metrics.totalRevenue.toLocaleString()}đ
              </div>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">Gói 29k + 59k</span>
            </div>

          </div>

          {/* Summary Note */}
          <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/20 text-xs text-[#553F35] leading-relaxed space-y-1.5 font-medium">
            <div className="font-bold text-[#365C4A] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#D89C57]" />
              <span>Ý nghĩa thực chứng cho mô hình kinh doanh học tập:</span>
            </div>
            <p>
              • Khảo sát nhu cầu thực tế chứng minh sinh viên Việt Nam sẵn sàng chi trả mức giá vi mô (Micro-subscription 29.000đ – 59.000đ) để bảo vệ điểm GPA và tránh chi phí học lại 2,4 triệu đồng.
            </p>
            <p>
              • Tỷ lệ chuyển đổi đạt <strong>{metrics.conversionRate}%</strong> là bằng chứng thực tế về tính khả thi thương mại độc lập.
            </p>
          </div>

          {/* Event Log Table */}
          <div>
            <h4 className="text-xs font-black text-[#365C4A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#365C4A]" />
              Nhật ký giao dịch gần nhất
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-[#365C4A]/20 bg-white">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#365C4A]/15 bg-[#F8F5EE] text-[11px] text-[#553F35]/70 font-bold">
                    <th className="p-3">Thời gian</th>
                    <th className="p-3">Gói dịch vụ</th>
                    <th className="p-3">Số tiền</th>
                    <th className="p-3">Trạng thái xác nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#365C4A]/10 font-mono">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                      <td className="p-3 text-[#553F35]/70 text-[11px]">
                        {new Date(ev.clicked_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="p-3 font-sans font-bold text-[#365C4A]">
                        {ev.plan_code === 'plus_59k' || ev.plan_code === 'plus_29k' ? 'StudyMatch Plus' : 'Pass Mùa Thi'}
                      </td>
                      <td className="p-3 text-[#365C4A] font-black">
                        {ev.amount.toLocaleString()}đ
                      </td>
                      <td className="p-3">
                        {ev.user_confirmed_transfer ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-sans font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã xác nhận
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#553F35]/60 font-sans font-medium">
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
