import React, { useState } from 'react';
import { UserSubjectDetail } from '../../types';
import { SUBJECTS_CATALOG, SELF_LEVELS } from '../../data/subjectsCatalog';
import { X, BookOpen, Check, AlertCircle, Trash2, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface SubjectDetailModalProps {
  isOpen: boolean;
  subject: UserSubjectDetail | null;
  onClose: () => void;
  onSave: (updatedSubject: UserSubjectDetail) => void;
  onDelete: (subjectCode: string) => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  isOpen,
  subject,
  onClose,
  onSave,
  onDelete
}) => {
  if (!isOpen || !subject) return null;

  const [proficiency, setProficiency] = useState<1 | 2 | 3>(subject.proficiency || 1);
  const [strongTopics, setStrongTopics] = useState<string[]>(subject.strong_topics || []);
  const [weakTopics, setWeakTopics] = useState<string[]>(subject.weak_topics || []);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Tìm danh sách chủ đề có sẵn trong catalog
  const catalogItem = SUBJECTS_CATALOG.find(s => s.code === subject.code || s.fullName === subject.fullName);
  const availableTopics = catalogItem ? catalogItem.topics : [
    ...new Set([...strongTopics, ...weakTopics, 'Chương 1', 'Chương 2', 'Chương 3'])
  ];

  // Logic ràng buộc: Không thể vừa mạnh vừa yếu
  const toggleStrong = (topic: string) => {
    if (strongTopics.includes(topic)) {
      setStrongTopics(strongTopics.filter(t => t !== topic));
    } else {
      setStrongTopics([...strongTopics, topic]);
      // Tự động bỏ chọn ở bên Yếu nếu có
      setWeakTopics(weakTopics.filter(t => t !== topic));
    }
  };

  const toggleWeak = (topic: string) => {
    if (weakTopics.includes(topic)) {
      setWeakTopics(weakTopics.filter(t => t !== topic));
    } else {
      setWeakTopics([...weakTopics, topic]);
      // Tự động bỏ chọn ở bên Mạnh nếu có
      setStrongTopics(strongTopics.filter(t => t !== topic));
    }
  };

  const handleAddCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customTopicInput.trim();
    if (!clean) return;
    if (!availableTopics.includes(clean)) {
      availableTopics.push(clean);
    }
    // Mặc định thêm vào weak
    toggleWeak(clean);
    setCustomTopicInput('');
  };

  const handleSave = () => {
    onSave({
      ...subject,
      proficiency,
      strong_topics: strongTopics,
      weak_topics: weakTopics
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#365C4A]/20 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Modal - Matcha Forest Accent */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#365C4A] to-[#2B4A3B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5 text-[#A7B99A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/20 text-[#FAEFDF] font-bold">
                  {subject.code}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {subject.name}
                </h3>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Thiết lập trình độ & chủ đề mạnh/yếu riêng biệt cho môn này
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-[#F8F5EE]/40">
          
          {/* 1. Trình độ tự đánh giá riêng cho môn này */}
          <div>
            <label className="block text-xs font-bold text-[#365C4A] uppercase tracking-wider mb-2">
              1. Trình độ tự đánh giá của riêng môn này
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SELF_LEVELS.map((item) => {
                const isSelected = proficiency === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setProficiency(item.level as 1 | 2 | 3)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#365C4A] border-[#365C4A] text-white shadow-md shadow-[#365C4A]/20'
                        : 'bg-white border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-extrabold uppercase tracking-wide ${isSelected ? 'text-[#A7B99A]' : 'text-[#365C4A]'}`}>
                        Cấp {item.level}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#A7B99A]" />}
                    </div>
                    <div className="font-bold text-sm mt-1">{item.title}</div>
                    <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-[#553F35]/70'}`}>
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chủ đề đang yếu & cần hỗ trợ */}
          <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                2. Chủ đề đang yếu (Cần bạn học hỗ trợ)
              </span>
              <span className="text-[11px] text-rose-600 font-semibold">
                Đã chọn: {weakTopics.length}
              </span>
            </div>
            <p className="text-[11px] text-[#553F35]/70">
              Chọn các phần bạn đang bị hổng kiến thức để hệ thống ghép bạn học giỏi phần này:
            </p>

            <div className="flex flex-wrap gap-2">
              {availableTopics.map(topic => {
                const isWeak = weakTopics.includes(topic);
                const isStrong = strongTopics.includes(topic);
                return (
                  <button
                    key={`weak-${topic}`}
                    type="button"
                    onClick={() => toggleWeak(topic)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isWeak
                        ? 'bg-rose-500 text-white shadow-sm'
                        : isStrong
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-pointer opacity-60'
                        : 'bg-rose-50/70 border border-rose-200 text-rose-800 hover:bg-rose-100'
                    }`}
                  >
                    {isWeak ? `✓ ${topic}` : `+ ${topic}`}
                    {isStrong && ' (Đang ở bên Mạnh)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Chủ đề nắm vững & có thể kèm bạn */}
          <div className="p-4 rounded-2xl bg-white border border-[#365C4A]/20 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#365C4A] flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-[#365C4A]" />
                3. Chủ đề nắm vững (Có thể kèm / giải bài cho bạn)
              </span>
              <span className="text-[11px] text-[#365C4A] font-semibold">
                Đã chọn: {strongTopics.length}
              </span>
            </div>
            <p className="text-[11px] text-[#553F35]/70">
              Chọn các dạng bài bạn tự tin làm tốt để giúp đỡ bạn học bù trừ:
            </p>

            <div className="flex flex-wrap gap-2">
              {availableTopics.map(topic => {
                const isStrong = strongTopics.includes(topic);
                const isWeak = weakTopics.includes(topic);
                return (
                  <button
                    key={`strong-${topic}`}
                    type="button"
                    onClick={() => toggleStrong(topic)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isStrong
                        ? 'bg-[#365C4A] text-white shadow-sm'
                        : isWeak
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-pointer opacity-60'
                        : 'bg-[#A7B99A]/15 border border-[#A7B99A]/40 text-[#365C4A] hover:bg-[#A7B99A]/30'
                    }`}
                  >
                    {isStrong ? `✓ ${topic}` : `+ ${topic}`}
                    {isWeak && ' (Đang ở bên Yếu)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Thêm chủ đề tùy chỉnh */}
          <form onSubmit={handleAddCustomTopic} className="flex gap-2">
            <input
              type="text"
              value={customTopicInput}
              onChange={e => setCustomTopicInput(e.target.value)}
              placeholder="Thêm chuyên đề / dạng bài khác của môn này..."
              className="flex-1 px-4 py-2 rounded-xl bg-white border border-[#365C4A]/25 text-xs text-[#365C4A] placeholder-[#553F35]/40 focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#365C4A]/10 hover:bg-[#365C4A]/20 text-[#365C4A] text-xs font-bold flex items-center gap-1 border border-[#365C4A]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm</span>
            </button>
          </form>

          {/* Delete subject confirmation */}
          {showDeleteConfirm ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-rose-800">Xác nhận xóa môn này khỏi hồ sơ?</p>
                <p className="text-[11px] text-rose-600">Bạn có thể thêm lại môn này bất cứ lúc nào.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-300 text-gray-700"
                >
                  Không
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(subject.code);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                >
                  Xóa ngay
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa môn học này khỏi hồ sơ học tập</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-[#365C4A]/15 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#553F35]/70 hover:text-[#553F35] hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-bold shadow-lg shadow-[#365C4A]/20 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Lưu thay đổi môn học</span>
          </button>
        </div>

      </div>
    </div>
  );
};
