import React, { useState } from 'react';
import { ResourceItem } from '../../types';
import {
  X,
  BookOpen,
  Sparkles,
  HelpCircle,
  Paperclip,
  CheckCircle2,
  XCircle,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bookmark
} from 'lucide-react';

interface ResourceDetailModalProps {
  resource: ResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAttachToSession: (resId: string) => void;
  isAttached?: boolean;
}

type TabMode = 'notes' | 'flashcards' | 'quiz';

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  isOpen,
  onClose,
  onAttachToSession,
  isAttached = false
}) => {
  if (!isOpen || !resource) return null;

  const [activeTab, setActiveTab] = useState<TabMode>('notes');

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const flashcards = resource.flashcards || [];
  const currentCard = flashcards[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submittedQuiz) return;
    setUserAnswers({ ...userAnswers, [qIdx]: optIdx });
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmittedQuiz(false);
  };

  const calculateQuizScore = () => {
    let score = 0;
    resource.mini_quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score += 1;
    });
    return score;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                {resource.resource_type}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Bản quyền học thuật chuẩn
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {resource.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span>{resource.subject}</span>
              <span>•</span>
              <span className="text-emerald-400">{resource.topic}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onAttachToSession(resource.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isAttached
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAttached ? 'Đã gắn vào phòng' : 'Gắn vào buổi học'}</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Interactive Mode Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 gap-4">
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>(1) Ghi chú & Bảng công thức</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'flashcards'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>(2) Flashcards lật 2 mặt ({flashcards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>(3) Mini-Quiz Trắc nghiệm ({resource.mini_quiz?.length || 0} câu)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: GHI CHÚ TÓM TẮT & CÔNG THỨC */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Formula banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/40 shadow-inner">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Bảng tóm tắt công thức cốt lõi:
                </div>
                <div className="font-mono text-sm text-emerald-300 font-semibold">
                  {resource.formula_summary}
                </div>
              </div>

              {/* Markdown note body */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {resource.content_markdown}
              </div>
            </div>
          )}

          {/* TAB 2: FLASHCARDS LẬT 2 MẶT */}
          {activeTab === 'flashcards' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-2">
              <div className="flex items-center justify-between w-full max-w-lg text-xs text-slate-400">
                <span>Thẻ {currentCardIndex + 1} / {flashcards.length}</span>
                <span className="text-indigo-400 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> Bấm vào thẻ để lật
                </span>
              </div>

              {/* 3D Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-lg h-64 rounded-2xl cursor-pointer perspective-1000"
              >
                <div
                  className={`relative w-full h-full rounded-2xl shadow-2xl transition-transform duration-500 transform-style-3d border ${
                    isFlipped ? 'rotate-y-180 border-emerald-500/50' : 'border-indigo-500/50'
                  }`}
                >
                  {/* Mặt trước (Front) */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 p-6 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                      MẶT TRƯỚC: CÂU HỎI / KHÁI NIỆM
                    </span>
                    <div className="text-base sm:text-lg font-bold text-white text-center px-4">
                      {currentCard?.front}
                    </div>
                    <div className="text-center text-xs text-slate-500">
                      Chạm để xem công thức / đáp án ↻
                    </div>
                  </div>

                  {/* Mặt sau (Back) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 p-6 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      MẶT SAU: LỜI GIẢI / CÔNG THỨC CHÍNH XÁC
                    </span>
                    <div className="text-base sm:text-lg font-bold text-emerald-300 text-center px-4 font-mono">
                      {currentCard?.back}
                    </div>
                    <div className="text-center text-xs text-emerald-400/60">
                      Đã ghi nhớ kiến thức này!
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrevCard}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Thẻ trước</span>
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Lật thẻ</span>
                </button>
                <button
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>Thẻ tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MINI-QUIZ TRẮC NGHIỆM */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {submittedQuiz && (
                <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-indigo-300">Kết quả bài trắc nghiệm:</div>
                    <div className="text-2xl font-black text-white font-mono mt-0.5">
                      {calculateQuizScore()} / {resource.mini_quiz.length} câu đúng
                    </div>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                  >
                    Làm lại bài
                  </button>
                </div>
              )}

              {resource.mini_quiz.map((q, qIdx) => {
                const selectedOpt = userAnswers[qIdx];
                return (
                  <div key={qIdx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-sm font-bold text-white flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-300 text-xs flex items-center justify-center shrink-0 border border-indigo-500/40">
                        {qIdx + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        const isCorrect = q.correctIndex === optIdx;

                        let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80';
                        if (submittedQuiz) {
                          if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold';
                          else if (isChosen && !isCorrect) style = 'bg-rose-500/20 border-rose-500 text-rose-200';
                        } else if (isChosen) {
                          style = 'bg-indigo-600/30 border-indigo-500 text-white font-semibold shadow-sm';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${style}`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {submittedQuiz && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {submittedQuiz && isChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {submittedQuiz && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 mt-2">
                        <strong className="text-emerald-400">Giải thích: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {!submittedQuiz && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSubmittedQuiz(true)}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all"
                  >
                    Chấm điểm bài trắc nghiệm
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
