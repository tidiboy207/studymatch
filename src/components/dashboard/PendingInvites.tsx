import React from 'react';
import { MatchRequest } from '../../types';
import { Check, X, ShieldCheck, Sparkles, MessageSquare, Clock } from 'lucide-react';

interface PendingInvitesProps {
  invites: MatchRequest[];
  onAccept: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export const PendingInvites: React.FC<PendingInvitesProps> = ({
  invites,
  onAccept,
  onReject
}) => {
  if (invites.length === 0) return null;

  return (
    <div className="rounded-3xl bg-white border border-[#365C4A]/20 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#365C4A]/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D89C57] animate-pulse" />
          <h3 className="text-sm font-extrabold text-[#365C4A] uppercase tracking-wider">
            Lời mời ghép bạn đang chờ duyệt ({invites.length})
          </h3>
        </div>
        <span className="text-xs text-[#553F35]/70 font-medium">
          Chấp nhận sẽ tự động mở phòng học nháp
        </span>
      </div>

      <div className="space-y-3.5">
        {invites.map((req) => {
          const sender = req.sender_profile;
          return (
            <div
              key={req.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 hover:border-[#365C4A]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                {sender?.avatar_url ? (
                  <img
                    src={sender.avatar_url}
                    alt={sender.display_name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#365C4A] shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#365C4A] to-[#A7B99A] flex items-center justify-center text-sm font-extrabold text-white shrink-0 shadow">
                    {sender?.display_name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-[#365C4A]">{sender?.display_name || 'Sinh viên'}</span>
                    {sender?.is_edu_verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> .edu.vn
                      </span>
                    )}
                    <span className="text-xs text-[#553F35]/70 font-medium">• {sender?.university}</span>
                  </div>

                  <p className="text-xs text-[#553F35] font-semibold mt-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D89C57] shrink-0" />
                    <span>{req.match_reason}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-[#553F35]/80">
                    <span>Môn: <strong className="text-[#365C4A]">{sender?.priority_subject}</strong></span>
                    <span>•</span>
                    <span>Mục tiêu: <strong className="text-[#365C4A]">{sender?.learning_goal}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onReject(req.id)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-gray-100 text-[#553F35] border border-gray-300 transition-all flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                  <span>Từ chối</span>
                </button>
                <button
                  onClick={() => onAccept(req.id)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#365C4A] hover:bg-[#2B4A3B] text-white shadow-md shadow-[#365C4A]/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#A7B99A]" />
                  <span>Chấp nhận học cùng</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
