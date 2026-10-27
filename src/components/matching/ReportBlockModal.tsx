import React, { useState } from 'react';
import { MatchCandidate } from '../../types';
import { ShieldAlert, X, AlertTriangle, Ban, Flag } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>An Toàn Cộng Đồng & Kỷ Luật</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-xs text-slate-300">
            Bạn đang thao tác với tài khoản: <strong className="text-white">{candidate.profile.display_name}</strong> ({candidate.profile.university})
          </div>

          {/* Action selection */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActionType('block')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                actionType === 'block'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Chặn ghép đôi</span>
            </button>

            <button
              type="button"
              onClick={() => setActionType('report')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                actionType === 'report'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Báo cáo vi phạm</span>
            </button>
          </div>

          {/* Reason options */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lý do chính</label>
            <div className="space-y-1.5">
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                    reason === r
                      ? 'bg-indigo-600/20 border border-indigo-500/50 text-white'
                      : 'bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {reason === r ? `● ${r}` : `○ ${r}`}
                </button>
              ))}
            </div>
          </div>

          {/* Custom detail */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ghi chú bổ sung (tùy chọn)</label>
            <textarea
              value={customDetail}
              onChange={(e) => setCustomDetail(e.target.value)}
              placeholder="Mô tả cụ thể sự việc để ban quản trị xử lý..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang gửi...' : actionType === 'block' ? 'Xác nhận Chặn' : 'Gửi Báo Cáo'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
