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
    1: { text: 'Mất gốc cục bộ', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    2: { text: 'Cơ bản vững', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    3: { text: 'Khá giỏi săn A/A+', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
  };

  const currentLevelInfo = levelLabels[profile.self_level] || levelLabels[1];

  return (
    <div className="relative rounded-3xl bg-white border border-[#365C4A]/15 hover:border-[#365C4A] hover:shadow-xl p-5 sm:p-6 shadow-md transition-all flex flex-col justify-between group">
      
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
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-[#365C4A]/30 shadow-md group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#365C4A] via-[#2F5242] to-[#A7B99A] flex items-center justify-center text-base font-extrabold text-white shadow-md">
                  {profile.display_name.charAt(0)}
                </div>
              )}
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#365C4A] text-white text-[10px] font-black flex items-center justify-center shadow">
                #{rank}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4
                  onClick={() => onViewProfile && onViewProfile(profile)}
                  className="text-base font-black text-[#365C4A] tracking-tight cursor-pointer hover:underline transition-colors"
                >
                  {profile.display_name}
                </h4>
                {profile.is_edu_verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300" title="Sinh viên đã xác thực email trường">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    .edu.vn
                  </span>
                )}
              </div>
              <p className="text-xs text-[#553F35]/80 font-medium mt-0.5">{profile.university}</p>
              {profile.major && (
                <p className="text-[11px] text-[#365C4A] font-bold flex items-center gap-1 mt-0.5 truncate max-w-[210px]">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span>{profile.major}</span>
                </p>
              )}
            </div>
          </div>

          {/* Compatibility Score Circle */}
          <div className="text-right shrink-0">
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-[#A7B99A]/20 border border-[#A7B99A]/50 text-[#365C4A] font-black text-sm font-mono shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D89C57]" />
              <span>{scoreDetails.totalScore}% HỢP</span>
            </div>
            <div className="text-[10px] text-[#553F35]/70 mt-1 font-semibold">
              Độ tương thích S
            </div>
          </div>
        </div>

        {/* Bio Preview Snippet if available */}
        {profile.bio && (
          <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/10 text-xs text-[#553F35] italic mb-3.5 line-clamp-2 leading-relaxed">
            "{profile.bio}"
          </div>
        )}

        {/* Explicit Match Reason Banner */}
        <div className="p-3.5 rounded-2xl bg-[#A7B99A]/15 border border-[#A7B99A]/30 text-xs text-[#365C4A] mb-4 flex items-start gap-2 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#D89C57] shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">
            <strong className="font-bold text-[#365C4A]">Lý do ghép tối ưu:</strong> {scoreDetails.reason}
          </div>
        </div>

        {/* Detailed Competency Breakdown */}
        <div className="space-y-2.5 text-xs text-[#553F35]">
          
          {/* Priority Subject & Level */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#553F35]/70 flex items-center gap-1 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-[#365C4A]" /> Môn:
            </span>
            <span className="font-bold text-[#365C4A] bg-[#F8F5EE] px-2.5 py-0.5 rounded-lg border border-[#365C4A]/15">
              {profile.priority_subject}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-bold border text-[11px] ${currentLevelInfo.color}`}>
              {currentLevelInfo.text}
            </span>
          </div>

          {/* Strong Topics (Có thể kèm cho bạn) */}
          {profile.strong_topics.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-emerald-700 font-bold">Nắm chắc:</span>
              {profile.strong_topics.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                  ✓ {t}
                </span>
              ))}
            </div>
          )}

          {/* Weak Topics (Cần bù trừ) */}
          {profile.weak_topics.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-rose-700 font-bold">Đang yếu:</span>
              {profile.weak_topics.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold">
                  ! {t}
                </span>
              ))}
            </div>
          )}

          {/* Matched Time Slots */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[#553F35]/70 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#D89C57]" /> Ca rảnh:
            </span>
            {profile.free_slots.slice(0, 3).map(s => {
              const isMatched = scoreDetails.matchedSlots.includes(s);
              return (
                <span
                  key={s}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                    isMatched
                      ? 'bg-[#A7B99A]/30 text-[#365C4A] border border-[#A7B99A]'
                      : 'bg-[#F8F5EE] text-[#553F35]/70 border border-[#365C4A]/10'
                  }`}
                >
                  {isMatched && '★ '}{getSlotLabel(s)}
                </span>
              );
            })}
          </div>

          {/* Learning Style & Goal */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#553F35]/80">
            <span>Mục tiêu: <strong className="text-[#365C4A]">{profile.learning_goal}</strong></span>
            <span>•</span>
            <span>Phong cách: <strong className="text-[#365C4A]">{profile.learning_style}</strong></span>
          </div>

        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-5 pt-4 border-t border-[#365C4A]/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onReportOrBlock(candidate)}
            className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs flex items-center gap-1"
            title="Báo cáo tài khoản hoặc Chặn ghép đôi"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chặn</span>
          </button>

          {onViewProfile && (
            <button
              onClick={() => onViewProfile(profile)}
              className="px-3 py-1.5 rounded-xl text-[#365C4A] hover:bg-[#A7B99A]/20 transition-all text-xs font-bold flex items-center gap-1"
              title="Xem hồ sơ chi tiết bạn học"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#365C4A]" />
              <span>Xem hồ sơ</span>
            </button>
          )}
        </div>

        <button
          onClick={() => onSendInvite(candidate)}
          disabled={isSending || hasSent}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
            hasSent
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-[#365C4A] hover:bg-[#2B4A3B] text-white shadow-[#365C4A]/20 active:scale-95'
          }`}
        >
          {hasSent ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
