import React, { useState } from 'react';
import { PaymentEvent } from '../../types';
import { QrCode, X, CheckCircle2, ShieldCheck, Copy, Check, ArrowRight } from 'lucide-react';

interface PaymentQrModalProps {
  paymentEvent: PaymentEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (eventId: string) => Promise<void>;
}

export const PaymentQrModal: React.FC<PaymentQrModalProps> = ({
  paymentEvent,
  isOpen,
  onClose,
  onConfirmPayment
}) => {
  if (!isOpen || !paymentEvent) return null;

  const [isConfirming, setIsConfirming] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const planName = (paymentEvent.plan_code === 'plus_59k' || paymentEvent.plan_code === 'plus_29k')
    ? 'StudyMatch Plus (1 Tháng • 59.000đ)'
    : 'Pass Mùa Thi - Sprint (2 Tuần • 29.000đ)';
  const transferContent = `SM ${paymentEvent.plan_code.toUpperCase()} ${paymentEvent.id.slice(-6)}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirmPayment(paymentEvent.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Thanh Toán & Kích Hoạt Gói</h3>
              <p className="text-[11px] text-emerald-400 font-semibold">{planName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body with QR Mock & Details */}
        <div className="p-6 space-y-4">
          
          {/* Simulated VietQR Box */}
          <div className="p-4 rounded-2xl bg-white text-slate-950 flex flex-col items-center justify-center text-center shadow-lg">
            <div className="text-[10px] uppercase font-black tracking-widest text-indigo-900 mb-1">
              VietQR • Chuyển Khoản Nhanh 24/7
            </div>

            {/* Stylized QR SVG */}
            <div className="w-44 h-44 bg-slate-100 rounded-xl p-2.5 border-2 border-indigo-600 flex flex-col justify-between my-1 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                {/* QR Pattern Representation */}
                <rect x="5" y="5" width="28" height="28" fill="#1e1b4b" rx="4" />
                <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="13" y="13" width="12" height="12" fill="#4f46e5" rx="1" />

                <rect x="67" y="5" width="28" height="28" fill="#1e1b4b" rx="4" />
                <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="75" y="13" width="12" height="12" fill="#4f46e5" rx="1" />

                <rect x="5" y="67" width="28" height="28" fill="#1e1b4b" rx="4" />
                <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="13" y="75" width="12" height="12" fill="#4f46e5" rx="1" />

                {/* Random Matrix Dots */}
                <rect x="38" y="10" width="8" height="8" fill="#1e1b4b" />
                <rect x="50" y="10" width="8" height="8" fill="#1e1b4b" />
                <rect x="38" y="24" width="8" height="8" fill="#4f46e5" />
                <rect x="50" y="24" width="8" height="8" fill="#1e1b4b" />
                <rect x="38" y="38" width="24" height="24" fill="#1e1b4b" rx="4" />
                <rect x="42" y="42" width="16" height="16" fill="#10b981" rx="2" />
                <rect x="10" y="38" width="8" height="8" fill="#1e1b4b" />
                <rect x="24" y="38" width="8" height="8" fill="#4f46e5" />
                <rect x="67" y="38" width="8" height="8" fill="#1e1b4b" />
                <rect x="81" y="38" width="8" height="8" fill="#4f46e5" />
                <rect x="38" y="68" width="8" height="8" fill="#1e1b4b" />
                <rect x="50" y="80" width="8" height="8" fill="#4f46e5" />
                <rect x="67" y="68" width="24" height="24" fill="#1e1b4b" />
                <rect x="72" y="73" width="14" height="14" fill="#ffffff" />
                <rect x="76" y="77" width="6" height="6" fill="#1e1b4b" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-extrabold text-indigo-700 shadow border border-indigo-200">
                  SM QR
                </span>
              </div>
            </div>

            <div className="text-sm font-black font-mono text-indigo-950 mt-1">
              {paymentEvent.amount.toLocaleString()} VNĐ
            </div>
          </div>

          {/* Transfer Info Fields */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Ngân hàng:</span>
              <strong className="text-white">MBBank (Quân Đội)</strong>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Số tài khoản:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-white">03498888999</span>
                <button
                  type="button"
                  onClick={() => handleCopy('03498888999', 'stk')}
                  className="text-slate-500 hover:text-white"
                >
                  {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Chủ tài khoản:</span>
              <strong className="text-white">STUDYMATCH VIETNAM</strong>
            </div>

            <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Nội dung chuyển khoản:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-emerald-400">{transferContent}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(transferContent, 'content')}
                  className="text-slate-500 hover:text-white"
                >
                  {copiedField === 'content' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-1">
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isConfirming ? 'Đang kích hoạt...' : 'Tôi Đã Xác Nhận Đăng Ký / Chuyển Khoản'}</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Hệ thống sẽ ghi nhận chuyển đổi ngay lập tức vào bảng payment_events.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
