import React from 'react';
import { UserProfile } from '../../types';
import { X, ShieldCheck, ShieldAlert, GraduationCap, BookOpen, Clock, Target, Calendar, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { getSlotLabel, getAvailabilitySummary } from '../../data/subjectsCatalog';

interface PublicProfileModalProps {
  isOpen: boolean;
  profile: UserProfile | null;
  currentUser?: UserProfile | null;
  onClose: () => void;
  onSendInvite?: (profile: UserProfile) => void;
  hasSentInvite?: boolean;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  isOpen,
  profile,
  currentUser,
  onClose,
  onSendInvite,
  hasSentInvite = false
}) => {
  if (!isOpen || !profile) return null;

  // Tìm các ca rảnh trùng nhau nếu có currentUser
  const sharedSlots = currentUser
    ? profile.free_slots.filter(s => currentUser.free_slots.includes(s))
    : [];

  const availabilitySummary = getAvailabilitySummary(profile.free_slots);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#F8F5EE] border border-[#365C4A]/20 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Cover Banner with Matcha Theme */}
        <div className="h-28 bg-gradient-to-r from-[#365C4A] via-[#2F5242] to-[#A7B99A] relative p-4 flex items-start justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold">
            <span>☕ Hồ sơ bạn học StudyMatch</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 pt-0 relative space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Avatar & Main Identity Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            
            {/* Avatar with Ring */}
            <div className="flex items-end gap-3.5">
              <div className="relative">
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={profile.display_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl bg-white"
                />
                {profile.is_edu_verified && (
                  <div
                    className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow"
                    title="Sinh viên đã xác thực email trường (.edu.vn)"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-[#365C4A] tracking-tight">
                    {profile.display_name}
                  </h3>
                  {profile.is_edu_verified ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      .edu.vn
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-medium">
                      Trải nghiệm
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#553F35]/80 font-medium">
                  {profile.university}
                </p>
                {profile.major && (
                  <p className="text-xs text-[#365C4A] font-semibold flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{profile.major}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Top Send Invite CTA */}
            {onSendInvite && (
              <button
                type="button"
                disabled={hasSentInvite}
                onClick={() => onSendInvite(profile)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                  hasSentInvite
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                    : 'bg-[#365C4A] hover:bg-[#2B4A3B] text-white shadow-[#365C4A]/25'
                }`}
              >
                {hasSentInvite ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã gửi lời mời</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi lời mời học cùng</span>
                  </>
                )}
              </button>
            )}

          </div>

          {/* Personal Bio */}
          {profile.bio ? (
            <div className="p-4 rounded-2xl bg-white border border-[#365C4A]/15 shadow-sm text-xs text-[#553F35] leading-relaxed relative">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#365C4A] block mb-1">
                Giới thiệu bản thân
              </span>
              <p className="italic font-normal">"{profile.bio}"</p>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-white/60 border border-dashed border-[#365C4A]/20 text-xs text-[#553F35]/60 italic text-center">
              Bạn học chưa cập nhật lời giới thiệu bản thân.
            </div>
          )}

          {/* Subjects & Competency Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#365C4A] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#365C4A]" />
              <span>Hồ sơ môn học & Bù trừ kiến thức</span>
            </h4>

            {profile.subjects_detail && profile.subjects_detail.length > 0 ? (
              <div className="space-y-2.5">
                {profile.subjects_detail.map(sub => (
                  <div key={sub.subject_id} className="p-3.5 rounded-2xl bg-white border border-[#365C4A]/15 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#365C4A]/10 text-[#365C4A] font-bold text-xs">
                          {sub.code}
                        </span>
                        <span className="font-bold text-xs text-[#553F35]">{sub.name}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A7B99A]/20 text-[#365C4A]">
                        {sub.proficiency === 3 ? 'Khá giỏi ôn sâu' : sub.proficiency === 2 ? 'Cơ bản vững' : 'Mất gốc cần kéo'}
                      </span>
                    </div>

                    {/* Strong */}
                    {sub.strong_topics.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 text-[11px]">
                        <span className="text-emerald-700 font-semibold">Nắm chắc:</span>
                        {sub.strong_topics.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ✓ {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Weak */}
                    {sub.weak_topics.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 text-[11px]">
                        <span className="text-rose-700 font-semibold">Đang yếu:</span>
                        {sub.weak_topics.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
                            ! {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-white border border-[#365C4A]/15 text-xs text-[#553F35]">
                <div className="font-bold text-[#365C4A] mb-1">Môn ưu tiên: {profile.priority_subject}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.strong_topics.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200">
                      ✓ {t}
                    </span>
                  ))}
                  {profile.weak_topics.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 text-[11px] border border-rose-200">
                      ! {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Goal & Learning Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#365C4A]/15 shadow-sm text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#365C4A] flex items-center gap-1 mb-1">
                <Target className="w-3.5 h-3.5 text-[#365C4A]" />
                Mục tiêu học tập
              </span>
              <p className="font-bold text-[#553F35]">{profile.learning_goal}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#365C4A]/15 shadow-sm text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#365C4A] flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-[#365C4A]" />
                Phong cách học
              </span>
              <p className="font-bold text-[#553F35]">{profile.learning_style}</p>
            </div>
          </div>

          {/* Availability Information */}
          <div className="p-4 rounded-2xl bg-white border border-[#365C4A]/15 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#365C4A] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#365C4A]" />
                Lịch rảnh trong tuần
              </span>
              {sharedSlots.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#A7B99A]/20 text-[#365C4A] font-bold text-[10px]">
                  ★ Trùng {sharedSlots.length} ca với bạn
                </span>
              )}
            </div>

            <p className="text-xs text-[#553F35] italic">
              {availabilitySummary}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.free_slots.map(s => {
                const isShared = sharedSlots.includes(s);
                return (
                  <span
                    key={s}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${
                      isShared
                        ? 'bg-[#365C4A] text-white font-bold shadow-sm'
                        : 'bg-[#F8F5EE] text-[#553F35] border border-[#365C4A]/15'
                    }`}
                  >
                    {isShared && '★ '}{getSlotLabel(s)}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Privacy Protection Banner */}
          <div className="p-3 rounded-2xl bg-[#A7B99A]/15 border border-[#A7B99A]/30 text-[11px] text-[#365C4A] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#365C4A] shrink-0" />
            <span>
              <strong>Bảo mật tài khoản:</strong> Email Google và thông tin riêng tư được ẩn tự động để bảo vệ người dùng StudyMatch.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
