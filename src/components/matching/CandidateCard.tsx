import React from 'react';
import { MatchCandidate, UserProfile } from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Send,
  Flag,
  Calendar,
  Target,
  Clock,
  BookOpen,
  GraduationCap,
  User,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { getSlotLabel } from '../../data/subjectsCatalog';

interface CandidateCardProps {
  candidate: MatchCandidate;
  rank: number;
  onSendInvite: (candidate: MatchCandidate) => void;
  onReportOrBlock: (candidate: MatchCandidate) => void;
  onViewProfile?: (profile: UserProfile) => void;
  isSending?: boolean;
  hasSent?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  rank,
  onSendInvite,
  onReportOrBlock,
  onViewProfile,
  isSending = false,
  hasSent = false
}) => {
  const { profile, scoreDetails } = candidate;

  // Level badge info
  const levelLabels = {
    1: { text: 'Mất gốc cục bộ', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    2: { text: 'Cơ bản vững', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    3: { text: 'Khá giỏi săn A/A+', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
  };

  const currentLevelInfo = levelLabels[profile.self_level] || levelLabels[1];

  return (
    <div className="relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-[#A7B99A]/50 p-5 sm:p-6 shadow-xl transition-all flex flex-col justify-between group">
      
      {/* Top Banner: Rank & Score */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="relative cursor-pointer"
              onClick={() => onViewProfile && onViewProfile(profile)}
              title="Bấm để xem hồ sơ công khai"
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#A7B99A]/40 shadow-md group-hover:ring-2 group-hover:ring-[#A7B99A] transition-all"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#365C4A] via-[#2F5242] to-[#A7B99A] flex items-center justify-center text-base font-extrabold text-white shadow-md">
                  {profile.display_name.charAt(0)}
                </div>
              )}
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-slate-950 border border-[#A7B99A] text-[10px] font-bold text-[#A7B99A] flex items-center justify-center">
                #{rank}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4
                  onClick={() => onViewProfile && onViewProfile(profile)}
                  className="text-base font-bold text-white tracking-tight cursor-pointer hover:text-[#A7B99A] transition-colors"
                >
                  {profile.display_name}
                </h4>
                {profile.is_edu_verified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" title="Sinh viên đã xác thực email .edu.vn">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    .edu.vn
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Trải nghiệm
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{profile.university}</p>
              {profile.major && (
                <p className="text-[11px] text-[#A7B99A] font-semibold flex items-center gap-1 mt-0.5 truncate max-w-[210px]">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span>{profile.major}</span>
                </p>
              )}
            </div>
          </div>

          {/* Compatibility Score Circle */}
          <div className="text-right shrink-0">
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#365C4A]/40 to-[#A7B99A]/30 border border-[#A7B99A]/40 text-[#A7B99A] font-extrabold text-sm font-mono shadow-sm">
              <Sparkles className="w-4 h-4 text-[#A7B99A]" />
              <span>{scoreDetails.totalScore}% HỢP</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Độ tương thích S
            </div>
          </div>
        </div>

        {/* Bio Preview Snippet if available */}
        {profile.bio && (
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 italic mb-3.5 line-clamp-2">
            "{profile.bio}"
          </div>
        )}

        {/* Explicit Match Reason Banner */}
        <div className="p-3 rounded-xl bg-[#365C4A]/25 border border-[#365C4A]/50 text-xs text-slate-200 mb-4 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#A7B99A] shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Lý do ghép tối ưu:</strong> {scoreDetails.reason}
          </div>
        </div>

        {/* Detailed Competency Breakdown */}
        <div className="space-y-2.5 text-xs">
          
          {/* Priority Subject & Level */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#A7B99A]" /> Môn:
            </span>
            <span className="font-semibold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {profile.priority_subject}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-semibold border text-[11px] ${currentLevelInfo.color}`}>
              {currentLevelInfo.text}
            </span>
          </div>

          {/* Strong Topics (Có thể kèm cho bạn) */}
          {profile.strong_topics.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-emerald-400 font-medium">Nắm chắc:</span>
              {profile.strong_topics.map(t => (
                <span key={t} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px]">
                  ✓ {t}
                </span>
              ))}
            </div>
          )}

          {/* Weak Topics (Cần bù trừ) */}
          {profile.weak_topics.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-rose-400 font-medium">Đang yếu:</span>
              {profile.weak_topics.map(t => (
                <span key={t} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[11px]">
                  ! {t}
                </span>
              ))}
            </div>
          )}

          {/* Matched Time Slots */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D89C57]" /> Ca rảnh:
            </span>
            {profile.free_slots.slice(0, 3).map(s => {
              const isMatched = scoreDetails.matchedSlots.includes(s);
              return (
                <span
                  key={s}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    isMatched
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {isMatched && '★ '}{getSlotLabel(s)}
                </span>
              );
            })}
          </div>

          {/* Learning Style & Goal */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span>Mục tiêu: <strong className="text-slate-200">{profile.learning_goal}</strong></span>
            <span>•</span>
            <span>Phong cách: <strong className="text-slate-200">{profile.learning_style}</strong></span>
          </div>

        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onReportOrBlock(candidate)}
            className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
            title="Báo cáo tài khoản hoặc Chặn ghép đôi"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chặn</span>
          </button>

          {onViewProfile && (
            <button
              onClick={() => onViewProfile(profile)}
              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
              title="Xem hồ sơ chi tiết bạn học"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#A7B99A]" />
              <span className="hidden sm:inline">Hồ sơ</span>
            </button>
          )}
        </div>

        <button
          onClick={() => onSendInvite(candidate)}
          disabled={isSending || hasSent}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
            hasSent
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-[#365C4A] to-[#2F5242] hover:from-[#2F5242] hover:to-[#254235] text-white shadow-[#365C4A]/30 active:scale-95'
          }`}
        >
          {hasSent ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đã gửi lời mời</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 text-[#A7B99A]" />
              <span>{isSending ? 'Đang gửi...' : 'Gửi lời mời học cùng'}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
