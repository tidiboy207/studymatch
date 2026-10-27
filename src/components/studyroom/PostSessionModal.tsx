import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  Users,
  Repeat,
  Flame,
  Wallet,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { StudySession, UserProfile } from '../../types';

interface PostSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: StudySession;
  currentUser: UserProfile;
  onCompleteSession: (retentionChoice: 'keep' | 'change') => Promise<void>;
  onReportMissed: () => Promise<void>;
}

export const PostSessionModal: React.FC<PostSessionModalProps> = ({
  isOpen,
  onClose,
  session,
  currentUser,
  onCompleteSession,
  onReportMissed
}) => {
  if (!isOpen) return null;

  const [retentionChoice, setRetentionChoice] = useState<'keep' | 'change'>('keep');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMissedMode, setIsMissedMode] = useState(false);
  const [missedResult, setMissedResult] = useState<{ penalty: number; compensatedToPartner: number } | null>(null);

  const partnerName = session.partner_profile?.display_name || 'Bạn học ghép cặp';

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Trigger festive confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      await onCompleteSession(retentionChoice);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateMissed = async () => {
    setIsSubmitting(true);
    try {
      await onReportMissed();
      setMissedResult({ penalty: 10000, compensatedToPartner: 5000 });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Normal Completion View */}
        {!isMissedMode ? (
          <div>
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/40 border-b border-slate-800 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Buổi học hoàn thành xuất sắc
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                Kỷ Luật Tạo Nên Sự Xuất Sắc!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Hai bạn đã giữ vững cam kết và cùng vượt qua các bài tập trọng tâm.
              </p>
            </div>

            {/* Rewards Breakdown */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                
                {/* 100% Deposit Refund */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Wallet className="w-4 h-4" />
                    <span>Hoàn 100% Cọc</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    +50.000đ
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">Học miễn phí hoàn toàn</span>
                </div>

                {/* Streak Increment */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>Chuỗi Kỷ Luật</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    +{currentUser.streak_days + 1} Ngày
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">+25 phút tự học tích lũy</span>
                </div>

              </div>

              {/* Retention Survey Question */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-200">
                  Khảo sát đo lường: Bạn có muốn giữ bạn học này ({partnerName}) cho buổi tiếp theo?
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRetentionChoice('keep')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                      retentionChoice === 'keep'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Giữ bạn học này</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRetentionChoice('change')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                      retentionChoice === 'change'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Repeat className="w-4 h-4 text-amber-400" />
                    <span>Đổi bạn học mới</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang lưu đối soát...' : 'Xác Nhận & Trở Về Bảng Tin'}</span>
                </button>

                {/* Simulated Missed Session Button for Testing */}
                <button
                  onClick={() => setIsMissedMode(true)}
                  className="text-[11px] text-slate-500 hover:text-rose-400 text-center py-1 transition-colors"
                >
                  [Kiểm thử giám khảo] Mô phỏng tình huống "Báo vắng / Bùng học" trừ cọc
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Missed Session Penalty Simulation View */
          <div>
            <div className="p-6 bg-rose-950/40 border-b border-rose-900/60 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400 mb-2">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Mô Phỏng Xử Lý Bùng Học</h3>
              <p className="text-xs text-rose-300 mt-1">
                Cơ chế chế tài Quỹ Cam Kết Kỷ Luật theo nghiên cứu của Kahneman & Tversky
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300">
              <p>
                Nếu sinh viên không vào phòng học hoặc tự ý hủy hẹn không lý do, hệ thống tự động trừ <strong className="text-white">10.000đ</strong> tiền cọc:
              </p>
              
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span>Trừ tiền cọc vi phạm:</span>
                  <span className="font-mono font-bold text-rose-400">-10.000đ</span>
                </div>
                <div className="flex justify-between text-slate-400 pl-3">
                  <span>↳ Đền bù bạn học bị leo cây (50%):</span>
                  <span className="font-mono text-emerald-400">+5.000đ</span>
                </div>
                <div className="flex justify-between text-slate-400 pl-3">
                  <span>↳ Phí vận hành hệ thống (50%):</span>
                  <span className="font-mono text-indigo-400">+5.000đ</span>
                </div>
              </div>

              {missedResult && (
                <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-500 text-rose-200">
                  ✓ Đã ghi nhận trừ 10.000đ và chuyển đền bù cho đối phương thành công!
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMissedMode(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleSimulateMissed}
                  disabled={isSubmitting || Boolean(missedResult)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/25 transition-all"
                >
                  {isSubmitting ? 'Đang trừ cọc...' : 'Kích hoạt trừ cọc 10.000đ'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
