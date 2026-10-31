import React from 'react';
import { ResourceItem } from '../../types';
import {
  ShieldCheck,
  Bookmark,
  Paperclip,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ResourceCardProps {
  resource: ResourceItem;
  onOpenDetail: (res: ResourceItem) => void;
  onToggleBookmark: (resId: string) => void;
  onAttachToSession: (resId: string) => void;
  isAttached?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onOpenDetail,
  onToggleBookmark,
  onAttachToSession,
  isAttached = false
}) => {
  const typeColors = {
    'Ghi chú': 'bg-[#A7B99A]/25 text-[#365C4A] border-[#A7B99A]',
    'Bài tập': 'bg-[#D89C57]/20 text-[#9C682A] border-[#D89C57]/40',
    'Đề ôn tập': 'bg-[#365C4A]/10 text-[#365C4A] border-[#365C4A]/30',
  };

  return (
    <div className="rounded-3xl bg-white border border-[#365C4A]/15 hover:border-[#365C4A] p-5 sm:p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
      <div>
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${typeColors[resource.resource_type]}`}>
              {resource.resource_type}
            </span>
            {resource.copyright_verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Kiểm duyệt chuẩn
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleBookmark(resource.id)}
            className={`p-1.5 rounded-xl transition-all ${
              resource.is_saved
                ? 'text-[#D89C57] bg-[#D89C57]/15'
                : 'text-gray-400 hover:text-[#365C4A] hover:bg-[#F8F5EE]'
            }`}
            title={resource.is_saved ? 'Bỏ lưu' : 'Lưu tài liệu yêu thích'}
          >
            <Bookmark className={`w-4 h-4 ${resource.is_saved ? 'fill-[#D89C57]' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetail(resource)}
          className="text-sm font-black text-[#365C4A] group-hover:underline transition-colors cursor-pointer line-clamp-2 leading-snug"
        >
          {resource.title}
        </h3>

        {/* Subject & Topic */}
        <div className="flex items-center gap-2 mt-2 text-xs text-[#553F35]">
          <span className="font-bold text-[#365C4A]">{resource.subject}</span>
          <span>•</span>
          <span className="text-[#553F35]/70 font-semibold">{resource.topic}</span>
        </div>

        {/* Formula Preview Pill */}
        <div className="mt-3.5 p-3 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 text-[11px] font-mono text-[#553F35] line-clamp-1">
          <span className="text-[#365C4A] mr-1.5 font-sans font-bold">Công thức:</span>
          {resource.formula_summary}
        </div>

        {/* Micro Counters */}
        <div className="flex items-center gap-3 mt-3 text-[11px] text-[#553F35]/80 font-medium">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D89C57]" />
            {resource.flashcards?.length || 0} Flashcards
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#365C4A]" />
            {resource.mini_quiz?.length || 0} Câu trắc nghiệm
          </span>
        </div>

      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-[#365C4A]/10 flex items-center justify-between gap-2">
        <button
          onClick={() => onAttachToSession(resource.id)}
          className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
            isAttached
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#553F35] border-[#365C4A]/20'
          }`}
          title="Gắn tài liệu này vào buổi học sắp tới để hai bạn cùng làm chung"
        >
          <Paperclip className="w-3.5 h-3.5 text-[#365C4A]" />
          <span>{isAttached ? 'Đã gắn vào phòng' : 'Gắn vào buổi học'}</span>
        </button>

        <button
          onClick={() => onOpenDetail(resource)}
          className="px-4 py-2 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-[#365C4A]/20 active:scale-95"
        >
          <span>Học ngay</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#A7B99A]" />
        </button>
      </div>

    </div>
  );
};
