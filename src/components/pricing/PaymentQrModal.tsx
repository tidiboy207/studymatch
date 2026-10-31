import React, { useState } from 'react';
import { PaymentEvent } from '../../types';
import { QrCode, X, CheckCircle2, Copy, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#365C4A]/25 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A7B99A]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#365C4A] to-[#264234] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-[#A7B99A]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Thanh Toán & Kích Hoạt Gói</h3>
              <p className="text-[11px] text-[#A7B99A] font-bold">{planName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body with QR Mock & Details */}
        <div className="p-6 space-y-4">
          
          {/* VietQR Box */}
          <div className="p-4 rounded-3xl bg-[#F8F5EE] border border-[#365C4A]/15 text-[#365C4A] flex flex-col items-center justify-center text-center shadow-sm">
            <div className="text-[10px] uppercase font-black tracking-widest text-[#365C4A] mb-1">
              VietQR • Chuyển Khoản Nhanh 24/7
            </div>

            {/* Stylized QR SVG */}
            <div className="w-44 h-44 bg-white rounded-2xl p-2.5 border-2 border-[#365C4A] flex flex-col justify-between my-1 relative shadow-inner">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#365C4A]">
                {/* QR Pattern Representation */}
                <rect x="5" y="5" width="28" height="28" fill="#365C4A" rx="4" />
                <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="13" y="13" width="12" height="12" fill="#365C4A" rx="1" />

                <rect x="67" y="5" width="28" height="28" fill="#365C4A" rx="4" />
                <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="75" y="13" width="12" height="12" fill="#365C4A" rx="1" />

                <rect x="5" y="67" width="28" height="28" fill="#365C4A" rx="4" />
                <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="13" y="75" width="12" height="12" fill="#365C4A" rx="1" />

                {/* Matrix Dots */}
                <rect x="38" y="10" width="8" height="8" fill="#365C4A" />
                <rect x="50" y="10" width="8" height="8" fill="#365C4A" />
                <rect x="38" y="24" width="8" height="8" fill="#A7B99A" />
                <rect x="50" y="24" width="8" height="8" fill="#365C4A" />
                <rect x="38" y="38" width="24" height="24" fill="#365C4A" rx="4" />
                <rect x="42" y="42" width="16" height="16" fill="#D89C57" rx="2" />
                <rect x="10" y="38" width="8" height="8" fill="#365C4A" />
                <rect x="24" y="38" width="8" height="8" fill="#A7B99A" />
                <rect x="67" y="38" width="8" height="8" fill="#365C4A" />
                <rect x="81" y="38" width="8" height="8" fill="#A7B99A" />
                <rect x="38" y="68" width="8" height="8" fill="#365C4A" />
                <rect x="50" y="80" width="8" height="8" fill="#A7B99A" />
                <rect x="67" y="68" width="24" height="24" fill="#365C4A" />
                <rect x="72" y="73" width="14" height="14" fill="#ffffff" />
                <rect x="76" y="77" width="6" height="6" fill="#365C4A" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="px-2 py-0.5 rounded-full bg-white text-[9px] font-black text-[#365C4A] shadow border border-[#365C4A]/20">
                  SM QR
                </span>
              </div>
            </div>

            <div className="text-base font-black font-mono text-[#365C4A] mt-1.5">
              {paymentEvent.amount.toLocaleString()} VNĐ
            </div>
          </div>

          {/* Transfer Info Fields */}
          <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#553F35]">
              <span>Ngân hàng:</span>
              <strong className="text-[#365C4A] font-bold">MBBank (Quân Đội)</strong>
            </div>

            <div className="flex justify-between items-center text-[#553F35]">
              <span>Số tài khoản:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-[#365C4A]">03498888999</span>
                <button
                  type="button"
                  onClick={() => handleCopy('03498888999', 'stk')}
                  className="text-gray-400 hover:text-[#365C4A]"
                >
                  {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[#553F35]">
              <span>Chủ tài khoản:</span>
              <strong className="text-[#365C4A] font-bold">STUDYMATCH VIETNAM</strong>
            </div>

            <div className="flex justify-between items-center text-[#553F35] pt-1.5 border-t border-[#365C4A]/10">
              <span>Nội dung chuyển khoản:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-emerald-700">{transferContent}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(transferContent, 'content')}
                  className="text-gray-400 hover:text-[#365C4A]"
                >
                  {copiedField === 'content' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-1">
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="w-full py-3.5 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white font-black text-xs shadow-xl shadow-[#365C4A]/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4 text-[#A7B99A]" />
              <span>{isConfirming ? 'Đang kích hoạt...' : 'Tôi Đã Xác Nhận Đăng Ký / Chuyển Khoản'}</span>
            </button>
            <p className="text-[10px] text-[#553F35]/70 text-center mt-2 font-medium">
              Hệ thống sẽ ghi nhận chuyển đổi ngay lập tức và tự động nâng cấp quyền lợi.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
