import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, UserSubjectDetail } from '../../types';
import {
  Camera,
  Trash2,
  Edit3,
  Check,
  X,
  Plus,
  BookOpen,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Target,
  Clock,
  Calendar,
  AlertCircle,
  HelpCircle,
  Mail,
  User,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import {
  SUBJECTS_CATALOG,
  MAJORS_CATALOG,
  UNIVERSITIES_CATALOG,
  LEARNING_GOALS,
  LEARNING_STYLES,
  getAvailabilitySummary
} from '../../data/subjectsCatalog';
import { WeeklyAvailabilityEditor } from './WeeklyAvailabilityEditor';
import { SubjectDetailModal } from './SubjectDetailModal';

interface ProfilePageProps {
  currentUser: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => Promise<void>;
  onNavigateToMatching?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onSaveProfile,
  onNavigateToMatching
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState(currentUser.display_name);
  const [university, setUniversity] = useState(currentUser.university);
  const [major, setMajor] = useState(currentUser.major || 'Khoa học dữ liệu & Trí tuệ nhân tạo (Data Science & AI)');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url || '');
  const [learningGoal, setLearningGoal] = useState(currentUser.learning_goal);
  const [learningStyle, setLearningStyle] = useState(currentUser.learning_style);
  const [freeSlots, setFreeSlots] = useState<string[]>(currentUser.free_slots || []);

  // Subjects Detail Management
  const [subjectsDetail, setSubjectsDetail] = useState<UserSubjectDetail[]>(() => {
    if (currentUser.subjects_detail && currentUser.subjects_detail.length > 0) {
      return currentUser.subjects_detail;
    }
    // Fallback nếu chưa có subjects_detail
    return [
      {
        subject_id: 'MI1111',
        code: 'MI1111',
        name: 'Giải tích 1',
        fullName: currentUser.priority_subject || 'MI1111 - Giải tích 1',
        proficiency: currentUser.self_level || 1,
        strong_topics: currentUser.strong_topics || ['Giới hạn & Liên tục'],
        weak_topics: currentUser.weak_topics || ['Tích phân suy rộng']
      }
    ];
  });

  // Modal edit single subject
  const [selectedSubjectToEdit, setSelectedSubjectToEdit] = useState<UserSubjectDetail | null>(null);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Search filter for University & Major
  const [uniFilter, setUniFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [isUniDropdownOpen, setIsUniDropdownOpen] = useState(false);
  const [isMajorDropdownOpen, setIsMajorDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Đồng bộ khi currentUser thay đổi
  useEffect(() => {
    setDisplayName(currentUser.display_name);
    setUniversity(currentUser.university);
    setMajor(currentUser.major || 'Khoa học dữ liệu & Trí tuệ nhân tạo (Data Science & AI)');
    setBio(currentUser.bio || '');
    setAvatarUrl(currentUser.avatar_url || '');
    setLearningGoal(currentUser.learning_goal);
    setLearningStyle(currentUser.learning_style);
    setFreeSlots(currentUser.free_slots || []);
    if (currentUser.subjects_detail && currentUser.subjects_detail.length > 0) {
      setSubjectsDetail(currentUser.subjects_detail);
    }
  }, [currentUser]);

  // Upload Avatar handler (chuyển sang Base64)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
  };

  // Cập nhật subject sau khi sửa trong modal
  const handleSaveSubjectDetail = (updated: UserSubjectDetail) => {
    const next = subjectsDetail.map(s => (s.code === updated.code ? updated : s));
    setSubjectsDetail(next);
  };

  const handleDeleteSubject = (code: string) => {
    setSubjectsDetail(prev => prev.filter(s => s.code !== code));
  };

  const handleAddSubjectFromCatalog = (catalogCode: string) => {
    const catalogItem = SUBJECTS_CATALOG.find(c => c.code === catalogCode);
    if (!catalogItem) return;

    // Kiểm tra trùng
    if (subjectsDetail.some(s => s.code === catalogItem.code)) {
      alert('Môn học này đã có trong danh sách của bạn!');
      return;
    }

    const newSub: UserSubjectDetail = {
      subject_id: catalogItem.code,
      code: catalogItem.code,
      name: catalogItem.name,
      fullName: catalogItem.fullName,
      proficiency: 2, // Cơ bản
      strong_topics: catalogItem.topics.slice(0, 1),
      weak_topics: catalogItem.topics.slice(1, 2)
    };

    setSubjectsDetail(prev => [...prev, newSub]);
    setIsAddSubjectOpen(false);
  };

  // Lưu toàn bộ hồ sơ
  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      alert('Tên hiển thị không được để trống');
      return;
    }

    setIsSubmitting(true);
    try {
      // Tổng hợp weak và strong topics từ subjectsDetail cho priority_subject
      const mainSubject = subjectsDetail[0] || null;
      const combinedWeak = mainSubject ? mainSubject.weak_topics : [];
      const combinedStrong = mainSubject ? mainSubject.strong_topics : [];
      const combinedLevel = mainSubject ? mainSubject.proficiency : 1;

      await onSaveProfile({
        display_name: displayName,
        university,
        major,
        bio,
        avatar_url: avatarUrl,
        subjects_detail: subjectsDetail,
        priority_subject: mainSubject ? mainSubject.fullName : currentUser.priority_subject,
        weak_topics: combinedWeak,
        strong_topics: combinedStrong,
        self_level: combinedLevel,
        learning_goal: learningGoal,
        learning_style: learningStyle,
        free_slots: freeSlots,
        is_onboarded: true
      });

      setIsEditMode(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3500);
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu hồ sơ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset lại từ currentUser
    setDisplayName(currentUser.display_name);
    setUniversity(currentUser.university);
    setMajor(currentUser.major || '');
    setBio(currentUser.bio || '');
    setAvatarUrl(currentUser.avatar_url || '');
    setLearningGoal(currentUser.learning_goal);
    setLearningStyle(currentUser.learning_style);
    setFreeSlots(currentUser.free_slots || []);
    if (currentUser.subjects_detail) {
      setSubjectsDetail(currentUser.subjects_detail);
    }
    setIsEditMode(false);
  };

  const availabilitySummary = getAvailabilitySummary(freeSlots);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Toast báo lưu thành công */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Đã cập nhật Không Gian Định Danh Học Tập của bạn và đồng bộ thuật toán ghép đôi!</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(false)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          HERO CARD: PERSONAL STUDY IDENTITY (ĐỊNH DANH HỌC TẬP CÁ NHÂN)
         ========================================================================= */}
      <div className="rounded-3xl bg-white border border-[#365C4A]/20 shadow-xl overflow-hidden relative">
        
        {/* Banner Cover */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-[#365C4A] via-[#2F5242] to-[#A7B99A] p-6 relative flex items-start justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold">
            <span>☕ KHÔNG GIAN ĐỊNH DANH HỌC TẬP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D89C57]" />
          </div>

          {/* Mode Switch Button */}
          {!isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border border-white/25 active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa hồ sơ</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-3.5 py-2 rounded-xl bg-black/25 hover:bg-black/40 text-white text-xs font-semibold transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#D89C57] hover:bg-[#C68B45] text-[#254235] text-xs font-black shadow-lg transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Đang lưu...' : 'Lưu hồ sơ'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Identity Row: Avatar + Name + University + Major + Bio */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-14 sm:-mt-16">
            
            {/* Avatar block */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              <div className="relative group">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'}
                  alt={displayName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-2xl bg-[#EBE8DF]"
                />
                
                {/* Upload overlay when in edit mode */}
                {isEditMode && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-full bg-white text-[#365C4A] shadow"
                      title="Tải ảnh mới"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="mt-1 p-1 rounded-full bg-rose-600 text-white shadow"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>

              {/* Text Info */}
              <div className="text-center sm:text-left space-y-1">
                {!isEditMode ? (
                  <>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-2xl sm:text-3xl font-black text-[#365C4A] tracking-tight">
                        {displayName}
                      </h2>
                      {currentUser.is_edu_verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Sinh viên .edu.vn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          Tài khoản trải nghiệm
                        </span>
                      )}
                      {currentUser.is_email_verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          Email đã xác thực
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#553F35]">
                      {university}
                    </p>
                    <p className="text-xs text-[#365C4A] font-bold flex items-center justify-center sm:justify-start gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{major}</span>
                    </p>
                  </>
                ) : (
                  <div className="space-y-3 w-full max-w-md pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#365C4A] uppercase tracking-wider block mb-1">
                        Tên hiển thị / Biệt danh
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="VD: Tuấn Anh (HUST)"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8F5EE] border border-[#365C4A]/25 text-sm font-semibold text-[#365C4A] focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30"
                      />
                    </div>

                    {/* University select */}
                    <div className="relative">
                      <label className="text-[11px] font-bold text-[#365C4A] uppercase tracking-wider block mb-1">
                        Trường Đại học (Tìm kiếm hoặc tự nhập)
                      </label>
                      <input
                        type="text"
                        value={university}
                        onChange={e => {
                          setUniversity(e.target.value);
                          setUniFilter(e.target.value);
                          setIsUniDropdownOpen(true);
                        }}
                        onFocus={() => setIsUniDropdownOpen(true)}
                        placeholder="Chọn hoặc nhập tên trường..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8F5EE] border border-[#365C4A]/25 text-xs text-[#553F35] focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30"
                      />
                      {isUniDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-white border border-[#365C4A]/20 rounded-xl shadow-xl">
                          {UNIVERSITIES_CATALOG.filter(u => u.toLowerCase().includes((uniFilter || '').toLowerCase())).map(u => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => {
                                setUniversity(u);
                                setIsUniDropdownOpen(false);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-[#553F35] hover:bg-[#A7B99A]/20 transition-colors"
                            >
                              {u}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setIsUniDropdownOpen(false)}
                            className="w-full text-center py-1.5 text-[11px] text-[#365C4A] font-bold bg-[#F8F5EE] border-t"
                          >
                            Đóng danh sách
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Major select */}
                    <div className="relative">
                      <label className="text-[11px] font-bold text-[#365C4A] uppercase tracking-wider block mb-1">
                        Ngành học (Trường bắt buộc mới)
                      </label>
                      <input
                        type="text"
                        value={major}
                        onChange={e => {
                          setMajor(e.target.value);
                          setMajorFilter(e.target.value);
                          setIsMajorDropdownOpen(true);
                        }}
                        onFocus={() => setIsMajorDropdownOpen(true)}
                        placeholder="Chọn hoặc nhập ngành học..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8F5EE] border border-[#365C4A]/25 text-xs text-[#553F35] focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30"
                      />
                      {isMajorDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-white border border-[#365C4A]/20 rounded-xl shadow-xl">
                          {MAJORS_CATALOG.filter(m => m.toLowerCase().includes((majorFilter || '').toLowerCase())).map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => {
                                setMajor(m);
                                setIsMajorDropdownOpen(false);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-[#553F35] hover:bg-[#A7B99A]/20 transition-colors"
                            >
                              {m}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setIsMajorDropdownOpen(false)}
                            className="w-full text-center py-1.5 text-[11px] text-[#365C4A] font-bold bg-[#F8F5EE] border-t"
                          >
                            Đóng danh sách
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats or Private Account Section */}
            <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 sm:w-72 space-y-2 text-xs text-[#553F35]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#365C4A] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#365C4A]" />
                Tài khoản riêng tư (Chỉ bạn thấy)
              </span>
              <p className="font-mono text-xs text-[#365C4A] truncate font-semibold">
                {currentUser.email || 'student@studymatch.edu.vn'}
              </p>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#365C4A]/10">
                <span>Quỹ cam kết kỷ luật:</span>
                <strong className="text-emerald-700 font-mono font-bold">
                  {currentUser.commitment_deposit.toLocaleString()}đ
                </strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Chuỗi học (Streak):</span>
                <strong className="text-amber-700 font-bold">{currentUser.streak_days} ngày</strong>
              </div>
            </div>

          </div>

          {/* Personal Bio */}
          <div className="mt-6 pt-5 border-t border-[#365C4A]/10">
            <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider flex items-center justify-between mb-2">
              <span>Giới thiệu bản thân (Personal Bio)</span>
              {isEditMode && (
                <span className={`text-[11px] ${bio.length > 280 ? 'text-rose-600 font-bold' : 'text-[#553F35]/60'}`}>
                  {bio.length} / 300 ký tự
                </span>
              )}
            </label>

            {!isEditMode ? (
              bio ? (
                <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#D89C57]/30 text-xs sm:text-sm text-[#553F35] leading-relaxed italic">
                  "{bio}"
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#F8F5EE]/60 border border-dashed border-[#365C4A]/20 text-xs text-[#553F35]/60 italic flex items-center justify-between">
                  <span>Chưa có lời giới thiệu bản thân. Hãy bấm "Chỉnh sửa hồ sơ" để viết vài dòng ngắn giới thiệu về bản thân và phong cách học!</span>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="text-[#365C4A] hover:underline font-bold text-xs"
                  >
                    + Thêm bio
                  </button>
                </div>
              )
            ) : (
              <div>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Mình là sinh viên năm 2 ngành Data Science & AI. Thích học nhóm, giải bài tập và trao đổi kiến thức. Đang tìm bạn ôn Giải tích và Xác suất cùng nhau!"
                  className="w-full p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/25 text-xs sm:text-sm text-[#553F35] placeholder-[#553F35]/40 focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30 resize-none"
                />
                <p className="text-[11px] text-[#553F35]/60 mt-1">
                  💡 Lời giới thiệu tự nhiên giúp các bạn học cùng gu dễ dàng bắt chuyện và mở phòng học hơn.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* =========================================================================
          LEARNING PROFILE: SUBJECT MANAGEMENT & PER-SUBJECT CONTROLS
         ========================================================================= */}
      <div className="rounded-3xl bg-white border border-[#365C4A]/20 shadow-xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#365C4A]/10 pb-4">
          <div>
            <h3 className="text-lg font-black text-[#365C4A] tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#365C4A]" />
              <span>Quản lý Môn học Tương tác Sâu (Per-Subject Management)</span>
            </h3>
            <p className="text-xs text-[#553F35]/70 mt-0.5">
              Mỗi môn học sở hữu trình độ, chủ đề mạnh và chủ đề yếu hoàn toàn độc lập
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddSubjectOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm môn học</span>
            </button>
          </div>
        </div>

        {/* Dropdown thêm môn học từ Catalog */}
        {isAddSubjectOpen && (
          <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#365C4A] uppercase tracking-wider">
                Chọn môn học cần thêm vào hồ sơ:
              </span>
              <button
                type="button"
                onClick={() => setIsAddSubjectOpen(false)}
                className="text-xs text-[#553F35]/70 hover:text-[#553F35]"
              >
                Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SUBJECTS_CATALOG.map(item => {
                const isAlreadyAdded = subjectsDetail.some(s => s.code === item.code);
                return (
                  <button
                    key={item.code}
                    type="button"
                    disabled={isAlreadyAdded}
                    onClick={() => handleAddSubjectFromCatalog(item.code)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isAlreadyAdded
                        ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                        : 'bg-white border-[#365C4A]/20 hover:border-[#365C4A] hover:shadow-sm'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold text-[#365C4A]">{item.code}</div>
                    <div className="font-semibold text-xs text-[#553F35] mt-0.5">{item.name}</div>
                    <p className="text-[10px] text-[#553F35]/60 mt-1 line-clamp-1">{item.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Danh sách thẻ môn học */}
        {subjectsDetail.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#553F35]/60 rounded-2xl bg-[#F8F5EE] border border-dashed border-[#365C4A]/20 space-y-3">
            <BookOpen className="w-8 h-8 text-[#365C4A]/40 mx-auto" />
            <p className="font-bold text-[#365C4A]">Bạn chưa chọn môn học nào trong hồ sơ!</p>
            <p>Bấm nút "+ Thêm môn học" ở trên để chọn môn đại cương hoặc chuyên ngành cần tìm bạn học.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectsDetail.map((sub, idx) => {
              const levelText = sub.proficiency === 3 ? 'Khá giỏi ôn sâu' : sub.proficiency === 2 ? 'Cơ bản vững' : 'Mất gốc cần kéo';
              const levelColor = sub.proficiency === 3 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : sub.proficiency === 2 ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-rose-100 text-rose-800 border-rose-300';

              return (
                <div
                  key={sub.code}
                  onClick={() => setSelectedSubjectToEdit(sub)}
                  className="p-5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 hover:border-[#365C4A] hover:shadow-md cursor-pointer transition-all space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#365C4A] text-white">
                          {sub.code}
                        </span>
                        <h4 className="text-sm font-bold text-[#365C4A]">
                          {sub.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#553F35]/70 mt-1">
                        Bấm để xem và chỉnh sửa chủ đề mạnh/yếu của môn này
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${levelColor}`}>
                      {levelText}
                    </span>
                  </div>

                  {/* Strong topics chips */}
                  {sub.strong_topics.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-emerald-700 font-bold text-[11px]">Nắm chắc:</span>
                      {sub.strong_topics.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Weak topics chips */}
                  {sub.weak_topics.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-rose-700 font-bold text-[11px]">Đang yếu:</span>
                      {sub.weak_topics.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-medium">
                          ! {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#365C4A]/10 flex items-center justify-between text-[11px] text-[#365C4A] font-bold group-hover:underline">
                    <span>Chỉnh sửa chi tiết môn học</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* =========================================================================
          WEEKLY AVAILABILITY: LỊCH RẢNH CỦA TÔI
         ========================================================================= */}
      <WeeklyAvailabilityEditor
        freeSlots={freeSlots}
        onChange={setFreeSlots}
        readOnly={!isEditMode}
      />

      {/* =========================================================================
          LEARNING GOALS & STUDY STYLE
         ========================================================================= */}
      <div className="rounded-3xl bg-white border border-[#365C4A]/20 shadow-xl p-6 sm:p-8 space-y-6">
        
        <div>
          <h3 className="text-lg font-black text-[#365C4A] tracking-tight">
            Mục tiêu học tập & Phong cách học
          </h3>
          <p className="text-xs text-[#553F35]/70 mt-0.5">
            Dữ liệu được thuật toán phân bổ 20% (Mục tiêu) và 15% (Phong cách) trong điểm tương thích S
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mục tiêu học tập */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#365C4A]" />
              <span>Mục tiêu học tập ưu tiên</span>
            </label>

            <div className="space-y-2">
              {LEARNING_GOALS.map(goal => {
                const isSelected = learningGoal === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    disabled={!isEditMode}
                    onClick={() => setLearningGoal(goal)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between text-xs font-semibold ${
                      isSelected
                        ? 'bg-[#365C4A] border-[#365C4A] text-white shadow-md shadow-[#365C4A]/20'
                        : 'bg-[#F8F5EE] border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]/40'
                    } ${!isEditMode ? 'cursor-default' : 'cursor-pointer active:scale-98'}`}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#A7B99A]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phong cách học */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#365C4A] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#365C4A]" />
              <span>Phong cách học ưu thích</span>
            </label>

            <div className="space-y-2">
              {LEARNING_STYLES.map(style => {
                const isSelected = learningStyle === style;
                return (
                  <button
                    key={style}
                    type="button"
                    disabled={!isEditMode}
                    onClick={() => setLearningStyle(style)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between text-xs font-semibold ${
                      isSelected
                        ? 'bg-[#365C4A] border-[#365C4A] text-white shadow-md shadow-[#365C4A]/20'
                        : 'bg-[#F8F5EE] border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]/40'
                    } ${!isEditMode ? 'cursor-default' : 'cursor-pointer active:scale-98'}`}
                  >
                    <span>{style}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#A7B99A]" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Floating Save Bar in Edit Mode */}
      {isEditMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#365C4A] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-4 border-2 border-white/30 animate-in slide-in-from-bottom">
          <span className="text-xs font-bold hidden sm:inline">Bạn đang ở chế độ chỉnh sửa hồ sơ</span>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-semibold"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSubmitting}
            className="px-5 py-1.5 rounded-full bg-[#D89C57] hover:bg-[#C68B45] text-[#254235] text-xs font-black shadow"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      )}

      {/* Modal chỉnh sửa môn học chi tiết */}
      <SubjectDetailModal
        isOpen={Boolean(selectedSubjectToEdit)}
        subject={selectedSubjectToEdit}
        onClose={() => setSelectedSubjectToEdit(null)}
        onSave={handleSaveSubjectDetail}
        onDelete={handleDeleteSubject}
      />

    </div>
  );
};
