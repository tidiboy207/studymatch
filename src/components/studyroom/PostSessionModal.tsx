import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  Users,
  Repeat,
  Flame,
  Wallet,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#365C4A]/25 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A7B99A]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Normal Completion View */}
        {!isMissedMode ? (
          <div>
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-[#365C4A] to-[#264234] text-white text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto text-[#A7B99A] mb-3 shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-[#A7B99A] border border-white/20">
                Buổi học hoàn thành xuất sắc
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                Kỷ Luật Tạo Nên Sự Xuất Sắc!
              </h3>
              <p className="text-xs text-white/80 mt-1 font-medium">
                Hai bạn đã giữ vững cam kết và cùng vượt qua các bài tập trọng tâm.
              </p>
            </div>

            {/* Rewards Breakdown */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                
                {/* 100% Deposit Refund */}
                <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Wallet className="w-4 h-4 text-emerald-700" />
                    <span>Hoàn 100% Cọc</span>
                  </div>
                  <div className="text-2xl font-black text-[#365C4A] font-mono mt-1">
                    +50.000đ
                  </div>
                  <span className="text-[10px] text-[#553F35]/70 mt-1 font-semibold">Học miễn phí hoàn toàn</span>
                </div>

                {/* Streak Increment */}
                <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D89C57]">
                    <Flame className="w-4 h-4 fill-[#D89C57] text-[#D89C57]" />
                    <span>Chuỗi Kỷ Luật</span>
                  </div>
                  <div className="text-2xl font-black text-[#365C4A] font-mono mt-1">
                    +{currentUser.streak_days + 1} Ngày
                  </div>
                  <span className="text-[10px] text-[#553F35]/70 mt-1 font-semibold">+25 phút tự học tích lũy</span>
                </div>

              </div>

              {/* Retention Survey Question */}
              <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 space-y-2">
                <label className="block text-xs font-bold text-[#365C4A]">
                  Khảo sát đo lường: Bạn có muốn giữ bạn học này ({partnerName}) cho buổi tiếp theo?
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRetentionChoice('keep')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      retentionChoice === 'keep'
                        ? 'bg-[#365C4A] border-[#365C4A] text-white shadow-md'
                        : 'bg-white border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Giữ bạn học này</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRetentionChoice('change')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      retentionChoice === 'change'
                        ? 'bg-[#365C4A] border-[#365C4A] text-white shadow-md'
                        : 'bg-white border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]'
                    }`}
                  >
                    <Repeat className="w-4 h-4" />
                    <span>Đổi bạn học mới</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white font-black text-xs shadow-xl shadow-[#365C4A]/25 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#A7B99A]" />
                  <span>{isSubmitting ? 'Đang lưu đối soát...' : 'Xác Nhận & Trở Về Bảng Tin'}</span>
                </button>

                {/* Missed session report button */}
                <button
                  onClick={() => setIsMissedMode(true)}
                  className="text-[11px] text-[#553F35]/70 hover:text-rose-600 text-center py-1 transition-colors font-medium"
                >
                  Báo cáo đối phương vắng mặt (Xử lý trừ cọc)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Missed Session Penalty View */
          <div>
            <div className="p-6 bg-rose-50 border-b border-rose-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center mx-auto text-rose-600 mb-2">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-rose-900">Xử Lý Bùng Học / Vắng Mặt</h3>
              <p className="text-xs text-rose-800 mt-1 font-medium">
                Cơ chế chế tài Quỹ Cam Kết Kỷ Luật bảo vệ sinh viên nghiêm túc
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs text-[#553F35]">
              <p className="leading-relaxed">
                Nếu sinh viên không vào phòng học hoặc tự ý hủy hẹn không lý do, hệ thống tự động trừ <strong className="text-rose-700">10.000đ</strong> tiền cọc:
              </p>
              
              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 space-y-2 font-medium">
                <div className="flex justify-between">
                  <span>Trừ tiền cọc vi phạm:</span>
                  <span className="font-mono font-black text-rose-600">-10.000đ</span>
                </div>
                <div className="flex justify-between text-[#553F35]/80 pl-3">
                  <span>↳ Đền bù bạn học bị leo cây (50%):</span>
                  <span className="font-mono font-bold text-emerald-700">+5.000đ</span>
                </div>
                <div className="flex justify-between text-[#553F35]/80 pl-3">
                  <span>↳ Phí vận hành hệ thống (50%):</span>
                  <span className="font-mono font-bold text-[#365C4A]">+5.000đ</span>
                </div>
              </div>

              {missedResult && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 font-bold">
                  ✓ Đã ghi nhận trừ 10.000đ và chuyển đền bù cho đối phương thành công!
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMissedMode(false)}
                  className="px-4 py-2 text-xs text-[#553F35]/70 hover:text-[#365C4A] font-bold"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleSimulateMissed}
                  disabled={isSubmitting || Boolean(missedResult)}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
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
