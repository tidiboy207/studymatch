import React from 'react';
import { SUBJECTS_CATALOG } from '../../data/subjectsCatalog';
import { Filter, BookOpen, Layers, FileText } from 'lucide-react';

interface ResourceFilterProps {
  selectedSubject: string;
  selectedTopic: string;
  selectedType: string;
  onSelectSubject: (sub: string) => void;
  onSelectTopic: (top: string) => void;
  onSelectType: (type: string) => void;
}

export const ResourceFilter: React.FC<ResourceFilterProps> = ({
  selectedSubject,
  selectedTopic,
  selectedType,
  onSelectSubject,
  onSelectTopic,
  onSelectType
}) => {
  const currentSubjectObj = SUBJECTS_CATALOG.find(s => s.fullName === selectedSubject);
  const availableTopics = currentSubjectObj ? currentSubjectObj.topics : [];

  const types = ['ALL', 'Ghi chú', 'Bài tập', 'Đề ôn tập'];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#365C4A]/20 shadow-xl space-y-4">
      <div className="flex items-center gap-2 text-xs font-black text-[#365C4A] uppercase tracking-wider pb-3 border-b border-[#365C4A]/10">
        <Filter className="w-4 h-4 text-[#D89C57]" />
        <span>Bộ Lọc 3 Cấp Độ: Môn Học → Chương → Loại Tài Liệu</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Cấp 1: Môn học */}
        <div>
          <label className="block text-[11px] font-bold text-[#553F35] mb-1.5 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#365C4A]" />
            1. Môn học
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              onSelectSubject(e.target.value);
              onSelectTopic('ALL');
            }}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/20 text-[#553F35] text-xs font-bold focus:outline-none focus:border-[#365C4A]"
          >
            <option value="ALL">Tất cả môn học</option>
            {SUBJECTS_CATALOG.map(s => (
              <option key={s.code} value={s.fullName}>{s.fullName}</option>
            ))}
          </select>
        </div>

        {/* Cấp 2: Chủ đề / Chương */}
        <div>
          <label className="block text-[11px] font-bold text-[#553F35] mb-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#365C4A]" />
            2. Chương / Chủ đề
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => onSelectTopic(e.target.value)}
            disabled={selectedSubject === 'ALL'}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/20 text-[#553F35] text-xs font-bold focus:outline-none focus:border-[#365C4A] disabled:opacity-50"
          >
            <option value="ALL">Tất cả các chương</option>
            {availableTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Cấp 3: Loại tài liệu */}
        <div>
          <label className="block text-[11px] font-bold text-[#553F35] mb-1.5 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#D89C57]" />
            3. Định dạng tài liệu
          </label>
          <div className="flex gap-1.5">
            {types.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => onSelectType(t)}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  selectedType === t
                    ? 'bg-[#365C4A] text-white shadow-md shadow-[#365C4A]/20'
                    : 'bg-[#F8F5EE] text-[#553F35]/70 hover:text-[#365C4A] border border-[#365C4A]/15'
                }`}
              >
                {t === 'ALL' ? 'Tất cả' : t}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
