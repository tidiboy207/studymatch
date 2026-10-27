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
    <div className="rounded-2xl bg-slate-900 border border-indigo-500/30 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Lời mời ghép bạn đang chờ duyệt ({invites.length})
          </h3>
        </div>
        <span className="text-xs text-indigo-300">
          Chấp nhận sẽ tự động tạo buổi học nháp
        </span>
      </div>

      <div className="space-y-3">
        {invites.map((req) => {
          const sender = req.sender_profile;
          return (
            <div
              key={req.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-sm font-extrabold text-white shrink-0 shadow">
                  {sender?.display_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{sender?.display_name || 'Sinh viên'}</span>
                    {sender?.is_edu_verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" /> .edu.vn
                      </span>
                    )}
                    <span className="text-xs text-slate-400">• {sender?.university}</span>
                  </div>

                  <p className="text-xs text-indigo-300 font-medium mt-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{req.match_reason}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <span>Môn: <strong className="text-slate-200">{sender?.priority_subject}</strong></span>
                    <span>•</span>
                    <span>Mục tiêu: <strong className="text-slate-200">{sender?.learning_goal}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onReject(req.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Từ chối</span>
                </button>
                <button
                  onClick={() => onAccept(req.id)}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
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
