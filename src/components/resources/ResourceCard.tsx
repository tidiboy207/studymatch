import React from 'react';
import { ResourceItem } from '../../types';
import {
  ShieldCheck,
  Bookmark,
  Paperclip,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight,
  FileCheck
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
    'Ghi chú': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Bài tập': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Đề ôn tập': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-5 shadow-xl transition-all flex flex-col justify-between group">
      <div>
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${typeColors[resource.resource_type]}`}>
              {resource.resource_type}
            </span>
            {resource.copyright_verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Đã kiểm duyệt bản quyền
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleBookmark(resource.id)}
            className={`p-1.5 rounded-lg transition-all ${
              resource.is_saved
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={resource.is_saved ? 'Bỏ lưu' : 'Lưu tài liệu yêu thích'}
          >
            <Bookmark className={`w-4 h-4 ${resource.is_saved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetail(resource)}
          className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
        >
          {resource.title}
        </h3>

        {/* Subject & Topic */}
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">{resource.subject}</span>
          <span>•</span>
          <span className="text-emerald-400">{resource.topic}</span>
        </div>

        {/* Formula Preview Pill */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-300 line-clamp-1">
          <span className="text-indigo-400 mr-1.5 font-sans font-semibold">Công thức:</span>
          {resource.formula_summary}
        </div>

        {/* Micro Counters */}
        <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            {resource.flashcards?.length || 0} Flashcards
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-emerald-400" />
            {resource.mini_quiz?.length || 0} Câu trắc nghiệm
          </span>
        </div>

      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onAttachToSession(resource.id)}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
            isAttached
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
          }`}
          title="Gắn tài liệu này vào buổi học sắp tới để hai bạn cùng làm chung"
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>{isAttached ? 'Đã gắn vào phòng' : 'Gắn vào buổi học'}</span>
        </button>

        <button
          onClick={() => onOpenDetail(resource)}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
        >
          <span>Học ngay</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
