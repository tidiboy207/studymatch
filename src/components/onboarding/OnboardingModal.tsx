import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  SUBJECTS_CATALOG,
  DAYS_OF_WEEK,
  SHIFTS,
  LEARNING_GOALS,
  LEARNING_STYLES,
  SELF_LEVELS
} from '../../data/subjectsCatalog';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => Promise<void>;
  isMandatory?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  isMandatory = false
}) => {
  if (!isOpen) return null;

  const [displayName, setDisplayName] = useState(currentUser.display_name);
  const [university, setUniversity] = useState(currentUser.university);
  const [prioritySubject, setPrioritySubject] = useState(currentUser.priority_subject || SUBJECTS_CATALOG[0].fullName);
  const [weakTopics, setWeakTopics] = useState<string[]>(currentUser.weak_topics || []);
  const [strongTopics, setStrongTopics] = useState<string[]>(currentUser.strong_topics || []);
  const [selfLevel, setSelfLevel] = useState<1 | 2 | 3>(currentUser.self_level || 1);
  const [learningGoal, setLearningGoal] = useState(currentUser.learning_goal || LEARNING_GOALS[0]);
  const [learningStyle, setLearningStyle] = useState(currentUser.learning_style || LEARNING_STYLES[0]);
  const [freeSlots, setFreeSlots] = useState<string[]>(currentUser.free_slots || ['T2_TOI', 'T4_TOI', 'T6_TOI']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy danh sách chương của môn hiện tại
  const currentSubjectItem = SUBJECTS_CATALOG.find(s => s.fullName === prioritySubject) || SUBJECTS_CATALOG[0];

  const handleSubjectChange = (subjectFullName: string) => {
    setPrioritySubject(subjectFullName);
    // Reset weak và strong topics khi đổi môn
    setWeakTopics([]);
    setStrongTopics([]);
  };

  const toggleWeakTopic = (topic: string) => {
    if (weakTopics.includes(topic)) {
      setWeakTopics(weakTopics.filter(t => t !== topic));
    } else {
      setWeakTopics([...weakTopics, topic]);
      // Nếu đã có ở strong thì gỡ bỏ
      setStrongTopics(strongTopics.filter(t => t !== topic));
    }
  };

  const toggleStrongTopic = (topic: string) => {
    if (strongTopics.includes(topic)) {
      setStrongTopics(strongTopics.filter(t => t !== topic));
    } else {
      setStrongTopics([...strongTopics, topic]);
      // Nếu đã có ở weak thì gỡ bỏ
      setWeakTopics(weakTopics.filter(t => t !== topic));
    }
  };

  const toggleSlot = (slotCode: string) => {
    if (freeSlots.includes(slotCode)) {
      setFreeSlots(freeSlots.filter(s => s !== slotCode));
    } else {
      setFreeSlots([...freeSlots, slotCode]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSaveProfile({
        display_name: displayName,
        university,
        priority_subject: prioritySubject,
        weak_topics: weakTopics,
        strong_topics: strongTopics,
        self_level: selfLevel,
        learning_goal: learningGoal,
        learning_style: learningStyle,
        free_slots: freeSlots
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900/40 via-slate-900 to-emerald-950/30 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Thiết lập Hồ sơ Học tập 60 Giây
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Không thi đầu vào
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hệ thống dùng thuật toán bù trừ kiến thức để ghép bạn học ăn ý nhất
              </p>
            </div>
          </div>
          {!isMandatory && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* 1. Tên hiển thị & Trường */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Tên hiển thị / Biệt danh
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="VD: Tuấn Anh (HUST)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Trường Đại học
              </label>
              <input
                type="text"
                required
                value={university}
                onChange={e => setUniversity(e.target.value)}
                placeholder="VD: Đại học Bách khoa Hà Nội"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* 2. Chọn Môn học ưu tiên */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Môn học ưu tiên cần tìm bạn học
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SUBJECTS_CATALOG.map((subject) => {
                const isSelected = prioritySubject === subject.fullName;
                return (
                  <button
                    key={subject.code}
                    type="button"
                    onClick={() => handleSubjectChange(subject.fullName)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-indigo-300">{subject.code}</div>
                    <div className="font-medium text-xs text-white">{subject.name}</div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{subject.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Đánh dấu Phần Đang Yếu & Phần Nắm Vững theo chương */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Phần kiến thức đang yếu (Cần bạn học hỗ trợ)
                </span>
                <span className="text-[11px] text-slate-400">Chọn ít nhất 1 phần</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentSubjectItem.topics.map((topic) => {
                  const isWeak = weakTopics.includes(topic);
                  return (
                    <button
                      key={`weak-${topic}`}
                      type="button"
                      onClick={() => toggleWeakTopic(topic)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isWeak
                          ? 'bg-rose-500/20 border border-rose-500/60 text-rose-200'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isWeak ? `✓ ${topic}` : `+ ${topic}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Phần kiến thức nắm vững (Có thể kèm / giải thích cho bạn)
                </span>
                <span className="text-[11px] text-slate-400">Tùy chọn</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentSubjectItem.topics.map((topic) => {
                  const isStrong = strongTopics.includes(topic);
                  return (
                    <button
                      key={`strong-${topic}`}
                      type="button"
                      onClick={() => toggleStrongTopic(topic)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isStrong
                          ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-200'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isStrong ? `✓ ${topic}` : `+ ${topic}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Trình độ tự đánh giá (1, 2, 3) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Trình độ tự đánh giá môn này
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SELF_LEVELS.map((item) => {
                const isSelected = selfLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setSelfLevel(item.level as 1 | 2 | 3)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-indigo-300">Cấp {item.level}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <div className="font-bold text-sm text-white mt-0.5">{item.title}</div>
                    <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Mục tiêu học tập & Phong cách học */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                Mục tiêu học tập
              </label>
              <div className="space-y-1.5">
                {LEARNING_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setLearningGoal(goal)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                      learningGoal === goal
                        ? 'bg-indigo-600/20 border border-indigo-500 text-white'
                        : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {learningGoal === goal ? `● ${goal}` : `○ ${goal}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Phong cách học
              </label>
              <div className="space-y-1.5">
                {LEARNING_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setLearningStyle(style)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                      learningStyle === style
                        ? 'bg-emerald-600/20 border border-emerald-500 text-white'
                        : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {learningStyle === style ? `● ${style}` : `○ ${style}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Lưới chọn nhanh Lịch rảnh trong tuần: 3 ca x 7 ngày */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Lưới chọn Lịch rảnh trong tuần (3 Ca × 7 Ngày)
              </label>
              <span className="text-[11px] text-indigo-300 font-mono">
                Đã chọn: {freeSlots.length} ca
              </span>
            </div>

            <div className="overflow-x-auto pb-1">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="p-1.5 text-slate-400 font-medium text-left text-[11px]">Ca / Ngày</th>
                    {DAYS_OF_WEEK.map(d => (
                      <th key={d.key} className="p-1.5 text-slate-300 font-semibold text-[11px]">
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SHIFTS.map(shift => (
                    <tr key={shift.key} className="border-t border-slate-800/60">
                      <td className="p-1.5 text-left text-slate-400 font-medium text-[11px]">
                        <div>{shift.label}</div>
                        <div className="text-[9px] text-slate-500">{shift.time}</div>
                      </td>
                      {DAYS_OF_WEEK.map(day => {
                        const code = `${day.key}_${shift.key}`;
                        const isChecked = freeSlots.includes(code);
                        return (
                          <td key={code} className="p-1">
                            <button
                              type="button"
                              onClick={() => toggleSlot(code)}
                              className={`w-full py-1.5 rounded transition-all text-[11px] font-semibold ${
                                isChecked
                                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                                  : 'bg-slate-950 text-slate-600 hover:bg-slate-800 hover:text-slate-300'
                              }`}
                            >
                              {isChecked ? '✓' : '—'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-start gap-2.5 text-xs text-indigo-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Cam kết bảo mật:</strong> StudyMatch tuyệt đối không công khai số điện thoại hoặc email của bạn. Bạn học chỉ nhìn thấy tên hiển thị, trường, môn học và ca rảnh.
            </p>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {!isMandatory && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || weakTopics.length === 0}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Hoàn tất & Kích hoạt Hồ sơ'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
