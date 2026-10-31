import React, { useState } from 'react';
import { MatchCandidate } from '../../types';
import { X, AlertTriangle, Ban, Flag } from 'lucide-react';

interface ReportBlockModalProps {
  candidate: MatchCandidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (targetUserId: string, action: 'report' | 'block', reason: string) => Promise<void>;
}

export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSubmit
}) => {
  if (!isOpen || !candidate) return null;

  const [actionType, setActionType] = useState<'report' | 'block'>('block');
  const [reason, setReason] = useState('Thái độ không phù hợp hoặc bùng hẹn');
  const [customDetail, setCustomDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Thái độ không phù hợp hoặc bùng hẹn',
    'Tài khoản spam hoặc quảng cáo ngoài lề',
    'Thông tin môn học / trình độ không trung thực',
    'Không bật camera hoặc chuyển tab liên tục trong giờ học'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fullReason = customDetail ? `${reason}: ${customDetail}` : reason;
      await onSubmit(candidate.profile.id, actionType, fullReason);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#365C4A]/25 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>An Toàn Cộng Đồng & Kỷ Luật</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-rose-100 text-rose-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-xs text-[#553F35]">
            Bạn đang thao tác với tài khoản: <strong className="text-[#365C4A] font-bold">{candidate.profile.display_name}</strong> ({candidate.profile.university})
          </div>

          {/* Action selection */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActionType('block')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                actionType === 'block'
                  ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-sm'
                  : 'bg-[#F8F5EE] border-[#365C4A]/15 text-[#553F35]'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Chặn ghép đôi</span>
            </button>

            <button
              type="button"
              onClick={() => setActionType('report')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                actionType === 'report'
                  ? 'bg-[#D89C57]/20 border-[#D89C57] text-[#D89C57] shadow-sm'
                  : 'bg-[#F8F5EE] border-[#365C4A]/15 text-[#553F35]'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Báo cáo vi phạm</span>
            </button>
          </div>

          {/* Reason options */}
          <div>
            <label className="block text-xs font-bold text-[#365C4A] mb-1.5">Lý do chính</label>
            <div className="space-y-1.5">
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all font-medium ${
                    reason === r
                      ? 'bg-[#365C4A] text-white font-bold'
                      : 'bg-[#F8F5EE] border border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]'
                  }`}
                >
                  {reason === r ? `● ${r}` : `○ ${r}`}
                </button>
              ))}
            </div>
          </div>

          {/* Custom detail */}
          <div>
            <label className="block text-xs font-bold text-[#365C4A] mb-1.5">Ghi chú bổ sung (tùy chọn)</label>
            <textarea
              value={customDetail}
              onChange={(e) => setCustomDetail(e.target.value)}
              placeholder="Mô tả cụ thể sự việc để ban quản trị xử lý..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/20 text-[#553F35] text-xs placeholder-[#553F35]/50 focus:outline-none focus:border-[#365C4A]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#553F35]/70 hover:text-[#365C4A]"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-black rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/25 disabled:opacity-50 transition-all active:scale-95"
            >
              {isSubmitting ? 'Đang gửi...' : actionType === 'block' ? 'Xác nhận Chặn' : 'Gửi Báo Cáo'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
