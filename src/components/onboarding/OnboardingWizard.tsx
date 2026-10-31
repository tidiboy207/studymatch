import React, { useState } from 'react';
import { UserProfile, UserSubjectDetail } from '../../types';
import {
  SUBJECTS_CATALOG,
  MAJORS_CATALOG,
  UNIVERSITIES_CATALOG,
  LEARNING_GOALS,
  LEARNING_STYLES,
  SELF_LEVELS,
  DAYS_OF_WEEK,
  SHIFTS,
  getAvailabilitySummary
} from '../../data/subjectsCatalog';
import {
  Sparkles,
  User,
  BookOpen,
  Calendar,
  Target,
  Clock,
  Check,
  ArrowRight,
  ArrowLeft,
  Camera,
  GraduationCap,
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';
import { WeeklyAvailabilityEditor } from '../profile/WeeklyAvailabilityEditor';

interface OnboardingWizardProps {
  currentUser: UserProfile;
  onComplete: (updated: Partial<UserProfile>) => Promise<void>;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentUser,
  onComplete
}) => {
  // Step: 1 = Personal Identity, 2 = Subjects & Topics, 3 = Goal & Style, 4 = Availability, 5 = Review
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState(currentUser.display_name || '');
  const [university, setUniversity] = useState(currentUser.university || 'Đại học Bách khoa Hà Nội (HUST)');
  const [major, setMajor] = useState(currentUser.major || 'Khoa học dữ liệu & Trí tuệ nhân tạo (Data Science & AI)');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url || '');

  // Subjects
  const [selectedSubjects, setSelectedSubjects] = useState<UserSubjectDetail[]>(() => {
    if (currentUser.subjects_detail && currentUser.subjects_detail.length > 0) {
      return currentUser.subjects_detail;
    }
    const defaultItem = SUBJECTS_CATALOG[0];
    return [
      {
        subject_id: defaultItem.code,
        code: defaultItem.code,
        name: defaultItem.name,
        fullName: defaultItem.fullName,
        proficiency: 1,
        strong_topics: [defaultItem.topics[0]],
        weak_topics: [defaultItem.topics[2]]
      }
    ];
  });

  const [activeSubjectCode, setActiveSubjectCode] = useState(selectedSubjects[0]?.code || 'MI1111');
  const [learningGoal, setLearningGoal] = useState(currentUser.learning_goal || LEARNING_GOALS[0]);
  const [learningStyle, setLearningStyle] = useState(currentUser.learning_style || LEARNING_STYLES[0]);
  const [freeSlots, setFreeSlots] = useState<string[]>(currentUser.free_slots?.length ? currentUser.free_slots : ['T2_TOI', 'T4_TOI', 'T6_TOI']);

  // Active subject item
  const currentEditingSubject = selectedSubjects.find(s => s.code === activeSubjectCode) || selectedSubjects[0];
  const catalogItem = SUBJECTS_CATALOG.find(c => c.code === currentEditingSubject?.code);

  const toggleSubjectTopic = (type: 'strong' | 'weak', topic: string) => {
    if (!currentEditingSubject) return;

    let nextStrong = [...currentEditingSubject.strong_topics];
    let nextWeak = [...currentEditingSubject.weak_topics];

    if (type === 'strong') {
      if (nextStrong.includes(topic)) {
        nextStrong = nextStrong.filter(t => t !== topic);
      } else {
        nextStrong.push(topic);
        nextWeak = nextWeak.filter(t => t !== topic);
      }
    } else {
      if (nextWeak.includes(topic)) {
        nextWeak = nextWeak.filter(t => t !== topic);
      } else {
        nextWeak.push(topic);
        nextStrong = nextStrong.filter(t => t !== topic);
      }
    }

    const updated = selectedSubjects.map(s =>
      s.code === currentEditingSubject.code
        ? { ...s, strong_topics: nextStrong, weak_topics: nextWeak }
        : s
    );
    setSelectedSubjects(updated);
  };

  const handleSetProficiency = (level: 1 | 2 | 3) => {
    if (!currentEditingSubject) return;
    const updated = selectedSubjects.map(s =>
      s.code === currentEditingSubject.code ? { ...s, proficiency: level } : s
    );
    setSelectedSubjects(updated);
  };

  const handleAddSubject = (catalogCode: string) => {
    const item = SUBJECTS_CATALOG.find(c => c.code === catalogCode);
    if (!item || selectedSubjects.some(s => s.code === item.code)) return;

    const newSub: UserSubjectDetail = {
      subject_id: item.code,
      code: item.code,
      name: item.name,
      fullName: item.fullName,
      proficiency: 2,
      strong_topics: item.topics.slice(0, 1),
      weak_topics: item.topics.slice(1, 2)
    };

    setSelectedSubjects(prev => [...prev, newSub]);
    setActiveSubjectCode(item.code);
  };

  const handleRemoveSubject = (code: string) => {
    if (selectedSubjects.length <= 1) {
      alert('Bạn cần giữ ít nhất 1 môn học để hệ thống ghép đôi!');
      return;
    }
    const filtered = selectedSubjects.filter(s => s.code !== code);
    setSelectedSubjects(filtered);
    setActiveSubjectCode(filtered[0].code);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const primary = selectedSubjects[0];
      await onComplete({
        display_name: displayName,
        university,
        major,
        bio,
        avatar_url: avatarUrl,
        subjects_detail: selectedSubjects,
        priority_subject: primary.fullName,
        weak_topics: primary.weak_topics,
        strong_topics: primary.strong_topics,
        self_level: primary.proficiency,
        learning_goal: learningGoal,
        learning_style: learningStyle,
        free_slots: freeSlots,
        is_onboarded: true
      });
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi lưu hồ sơ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Định danh cá nhân' },
    { num: 2, label: 'Môn học & Kiến thức' },
    { num: 3, label: 'Mục tiêu & Phong cách' },
    { num: 4, label: 'Lịch rảnh trong tuần' },
    { num: 5, label: 'Xem lại & Kích hoạt' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBE8DF] via-[#F3F0E6] to-[#F8F5EE] py-8 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-[#365C4A]/15 overflow-hidden flex flex-col my-4">
        
        {/* Top Header - Matcha Vibe */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-[#365C4A] via-[#2F5242] to-[#254235] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-[#A7B99A]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-[#FAEFDF]">
                  Thiết lập lần đầu • 60 Giây
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  Tạo Không Gian Học Tập Của Bạn
                </h1>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs text-white/70">Bước {step} trên 5</div>
              <div className="text-xs font-bold text-[#A7B99A]">{stepsList[step - 1].label}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 w-full bg-white/15 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#A7B99A] to-[#D89C57] transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          {/* Step markers */}
          <div className="hidden sm:flex justify-between items-center mt-3 text-[11px] text-white/70 font-semibold">
            {stepsList.map(s => (
              <span
                key={s.num}
                className={`transition-colors ${step === s.num ? 'text-white font-bold' : ''}`}
              >
                {s.num}. {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Wizard Form Content */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 bg-[#F8F5EE]/40">
          
          {/* =========================================================================
              BƯỚC 1: ĐỊNH DANH CÁ NHÂN (Avatar + Name + University + Major + Bio)
             ========================================================================= */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-[#365C4A]">1. Định danh cá nhân & Giới thiệu</h3>
                <p className="text-xs text-[#553F35]/70">Thông tin này giúp bạn học khác nhận diện và hiểu phong cách của bạn</p>
              </div>

              {/* Avatar Selector */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#365C4A]/15 shadow-sm">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'}
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#365C4A]"
                />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#365C4A]">Ảnh đại diện</div>
                  <p className="text-[11px] text-[#553F35]/70">Dùng ảnh từ Google hoặc chọn một trong các hình mẫu bên dưới:</p>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
                    ].map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${avatarUrl === url ? 'border-[#365C4A] ring-2 ring-[#365C4A]/40' : 'border-gray-300'}`}
                      >
                        <img src={url} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tên & Trường */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider block mb-1.5">
                    Tên hiển thị / Biệt danh *
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="VD: Tuấn Anh (HUST)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#365C4A]/25 text-xs sm:text-sm text-[#365C4A] focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider block mb-1.5">
                    Trường Đại học *
                  </label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    placeholder="VD: Đại học Bách khoa Hà Nội"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#365C4A]/25 text-xs sm:text-sm text-[#553F35] focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30"
                  />
                </div>
              </div>

              {/* Ngành học (Bắt buộc mới) */}
              <div>
                <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider block mb-1.5">
                  Ngành học (Field of Study) *
                </label>
                <select
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#365C4A]/25 text-xs sm:text-sm text-[#365C4A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30"
                >
                  {MAJORS_CATALOG.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Giới thiệu bản thân */}
              <div>
                <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider flex items-center justify-between mb-1.5">
                  <span>Giới thiệu bản thân (Bio - Tùy chọn)</span>
                  <span className="text-[11px] text-[#553F35]/60">{bio.length}/300</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Mình là sinh viên năm 2 ngành Data Science & AI. Thích học nhóm, giải bài tập và trao đổi kiến thức. Đang tìm bạn ôn Giải tích và Xác suất cùng nhau!"
                  className="w-full p-3.5 rounded-xl bg-white border border-[#365C4A]/25 text-xs sm:text-sm text-[#553F35] placeholder-[#553F35]/40 focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30 resize-none"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              BƯỚC 2: MÔN HỌC & KIẾN THỨC THEO TỪNG MÔN
             ========================================================================= */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-[#365C4A]">2. Quản lý Môn học & Điểm mạnh/yếu</h3>
                <p className="text-xs text-[#553F35]/70">
                  Thuật toán StudyMatch sẽ tìm người giỏi đúng phần bạn đang yếu để bù trừ năng lực
                </p>
              </div>

              {/* Subject Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#365C4A]/10 pb-3">
                {selectedSubjects.map(sub => (
                  <button
                    key={sub.code}
                    type="button"
                    onClick={() => setActiveSubjectCode(sub.code)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      activeSubjectCode === sub.code
                        ? 'bg-[#365C4A] text-white shadow-md'
                        : 'bg-white border border-[#365C4A]/20 text-[#553F35]'
                    }`}
                  >
                    <span>{sub.name}</span>
                    {selectedSubjects.length > 1 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSubject(sub.code);
                        }}
                        className="text-white/60 hover:text-white"
                      >
                        ×
                      </span>
                    )}
                  </button>
                ))}

                {/* Add more subjects */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddSubject(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#A7B99A]/20 text-[#365C4A] font-bold text-xs border border-[#A7B99A]/40"
                >
                  <option value="">+ Thêm môn học</option>
                  {SUBJECTS_CATALOG.filter(c => !selectedSubjects.some(s => s.code === c.code)).map(c => (
                    <option key={c.code} value={c.code}>+ {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Editing Area for Active Subject */}
              {currentEditingSubject && (
                <div className="space-y-4 p-5 rounded-2xl bg-white border border-[#365C4A]/15 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#365C4A]">{currentEditingSubject.code}</span>
                      <h4 className="font-bold text-sm text-[#553F35]">{currentEditingSubject.name}</h4>
                    </div>
                  </div>

                  {/* Level for this subject */}
                  <div>
                    <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider block mb-2">
                      Trình độ tự đánh giá môn này:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {SELF_LEVELS.map(item => (
                        <button
                          key={item.level}
                          type="button"
                          onClick={() => handleSetProficiency(item.level as 1 | 2 | 3)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            currentEditingSubject.proficiency === item.level
                              ? 'bg-[#365C4A] text-white border-[#365C4A] shadow-sm'
                              : 'bg-[#F8F5EE] border-[#365C4A]/15 text-[#553F35]'
                          }`}
                        >
                          <div className="font-bold text-xs">{item.title}</div>
                          <p className="text-[10px] opacity-75 mt-0.5 truncate">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weak Topics */}
                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                    <span className="text-xs font-bold text-rose-700 block">
                      ● Phần kiến thức đang yếu (Cần bạn học giải thích):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(catalogItem ? catalogItem.topics : currentEditingSubject.weak_topics).map(topic => {
                        const isWeak = currentEditingSubject.weak_topics.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => toggleSubjectTopic('weak', topic)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              isWeak
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-100'
                            }`}
                          >
                            {isWeak ? `✓ ${topic}` : `+ ${topic}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Strong Topics */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <span className="text-xs font-bold text-emerald-800 block">
                      ● Phần kiến thức tự tin (Có thể hỗ trợ bạn học):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(catalogItem ? catalogItem.topics : currentEditingSubject.strong_topics).map(topic => {
                        const isStrong = currentEditingSubject.strong_topics.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => toggleSubjectTopic('strong', topic)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              isStrong
                                ? 'bg-[#365C4A] text-white shadow-sm'
                                : 'bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            }`}
                          >
                            {isStrong ? `✓ ${topic}` : `+ ${topic}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              BƯỚC 3: MỤC TIÊU HỌC TẬP & PHONG CÁCH HỌC
             ========================================================================= */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-[#365C4A]">3. Mục tiêu & Phong cách học tập</h3>
                <p className="text-xs text-[#553F35]/70">Chọn phong cách phù hợp nhất với thói quen của bạn</p>
              </div>

              {/* Mục tiêu */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#365C4A]" />
                  <span>Mục tiêu học tập ưu tiên</span>
                </label>
                <div className="space-y-2">
                  {LEARNING_GOALS.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setLearningGoal(goal)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between text-xs font-bold ${
                        learningGoal === goal
                          ? 'bg-[#365C4A] border-[#365C4A] text-white shadow-md'
                          : 'bg-white border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]/40'
                      }`}
                    >
                      <span>{goal}</span>
                      {learningGoal === goal && <Check className="w-4 h-4 text-[#A7B99A]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phong cách */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#365C4A]" />
                  <span>Phong cách học ưa thích</span>
                </label>
                <div className="space-y-2">
                  {LEARNING_STYLES.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setLearningStyle(style)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between text-xs font-bold ${
                        learningStyle === style
                          ? 'bg-[#365C4A] border-[#365C4A] text-white shadow-md'
                          : 'bg-white border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]/40'
                      }`}
                    >
                      <span>{style}</span>
                      {learningStyle === style && <Check className="w-4 h-4 text-[#A7B99A]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              BƯỚC 4: LỊCH RẢNH TRONG TUẦN
             ========================================================================= */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-[#365C4A]">4. Lịch rảnh của tôi trong tuần</h3>
                <p className="text-xs text-[#553F35]/70">Chọn các buổi bạn có thể mở phòng học Pomodoro cùng bạn</p>
              </div>

              <WeeklyAvailabilityEditor
                freeSlots={freeSlots}
                onChange={setFreeSlots}
              />
            </div>
          )}

          {/* =========================================================================
              BƯỚC 5: XEM LẠI & KÍCH HOẠT HỒ SƠ
             ========================================================================= */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-[#365C4A]">5. Xem lại hồ sơ trước khi kích hoạt</h3>
                <p className="text-xs text-[#553F35]/70">Mọi thông tin đều có thể chỉnh sửa lại dễ dàng trong trang Profile</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#365C4A]/20 shadow-sm space-y-4 text-xs">
                {/* Identity preview */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#365C4A]/10">
                  <img src={avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-[#365C4A]" />
                  <div>
                    <h4 className="text-base font-black text-[#365C4A]">{displayName}</h4>
                    <p className="text-[#553F35] font-semibold">{university}</p>
                    <p className="text-[#365C4A] font-bold">{major}</p>
                  </div>
                </div>

                {/* Bio preview */}
                {bio && (
                  <p className="italic text-[#553F35]/80 bg-[#F8F5EE] p-3 rounded-xl border border-[#365C4A]/10">
                    "{bio}"
                  </p>
                )}

                {/* Subjects preview */}
                <div>
                  <span className="font-bold text-[#365C4A] block mb-1">Môn học đã chọn ({selectedSubjects.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSubjects.map(s => (
                      <span key={s.code} className="px-2.5 py-1 rounded-lg bg-[#365C4A]/10 text-[#365C4A] font-bold">
                        {s.code} - {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Goal & Style */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[#553F35]/70 block">Mục tiêu:</span>
                    <strong className="text-[#365C4A]">{learningGoal}</strong>
                  </div>
                  <div>
                    <span className="text-[#553F35]/70 block">Phong cách:</span>
                    <strong className="text-[#365C4A]">{learningStyle}</strong>
                  </div>
                </div>

                {/* Schedule preview */}
                <div className="pt-1">
                  <span className="text-[#553F35]/70 block">Lịch rảnh:</span>
                  <strong className="text-[#365C4A] italic">{getAvailabilitySummary(freeSlots)}</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation */}
        <div className="px-6 sm:px-8 py-4 bg-white border-t border-[#365C4A]/15 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#553F35]/70 hover:text-[#553F35] hover:bg-gray-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !displayName.trim()) {
                  alert('Vui lòng nhập tên hiển thị!');
                  return;
                }
                setStep((step + 1) as any);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-bold shadow-md shadow-[#365C4A]/25 flex items-center gap-2"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#365C4A] to-[#2B4A3B] hover:from-[#2B4A3B] hover:to-[#1E372C] text-white text-xs font-black shadow-lg shadow-[#365C4A]/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#A7B99A]" />
              <span>{isSubmitting ? 'Đang kích hoạt...' : 'Hoàn tất & Vào Dashboard'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
