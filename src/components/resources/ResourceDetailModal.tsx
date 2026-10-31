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
  ShieldCheck
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
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx
    }));
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#365C4A]/25 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#365C4A] to-[#264234] text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#A7B99A] border border-white/20 text-[10px] font-black uppercase tracking-wider">
                {resource.resource_type}
              </span>
              <span className="text-xs text-[#A7B99A] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Bản quyền học thuật chuẩn
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
              {resource.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-white/80">
              <span className="font-bold">{resource.subject}</span>
              <span>•</span>
              <span className="text-[#A7B99A] font-semibold">{resource.topic}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onAttachToSession(resource.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isAttached
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-white hover:bg-gray-100 text-[#365C4A]'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAttached ? 'Đã gắn vào phòng' : 'Gắn vào buổi học'}</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Interactive Mode Tabs */}
        <div className="flex border-b border-[#365C4A]/15 bg-[#F8F5EE] px-5 gap-3 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'notes'
                ? 'border-[#365C4A] text-[#365C4A]'
                : 'border-transparent text-[#553F35]/70 hover:text-[#365C4A]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#365C4A]" />
            <span>(1) Ghi chú & Bảng công thức</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'flashcards'
                ? 'border-[#365C4A] text-[#365C4A]'
                : 'border-transparent text-[#553F35]/70 hover:text-[#365C4A]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D89C57]" />
            <span>(2) Flashcards ({flashcards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'quiz'
                ? 'border-[#365C4A] text-[#365C4A]'
                : 'border-transparent text-[#553F35]/70 hover:text-[#365C4A]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#365C4A]" />
            <span>(3) Mini-Quiz ({resource.mini_quiz?.length || 0} câu)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          
          {/* TAB 1: GHI CHÚ TÓM TẮT & CÔNG THỨC */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Formula banner */}
              <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/20 shadow-sm">
                <div className="text-xs font-bold text-[#365C4A] uppercase tracking-wider mb-1">
                  Bảng tóm tắt công thức cốt lõi:
                </div>
                <div className="font-mono text-sm text-[#365C4A] font-bold">
                  {resource.formula_summary}
                </div>
              </div>

              {/* Markdown note body */}
              <div className="p-5 rounded-2xl bg-[#FDFCF9] border border-[#365C4A]/15 text-[#553F35] text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {resource.content_markdown}
              </div>
            </div>
          )}

          {/* TAB 2: FLASHCARDS LẬT 2 MẶT */}
          {activeTab === 'flashcards' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-2">
              <div className="flex items-center justify-between w-full max-w-lg text-xs text-[#553F35]/70 font-semibold">
                <span>Thẻ {currentCardIndex + 1} / {flashcards.length}</span>
                <span className="text-[#365C4A] flex items-center gap-1 font-bold">
                  <RotateCw className="w-3.5 h-3.5" /> Bấm vào thẻ để lật
                </span>
              </div>

              {/* 3D Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-lg h-64 rounded-3xl cursor-pointer perspective-1000"
              >
                <div
                  className={`relative w-full h-full rounded-3xl shadow-xl transition-transform duration-500 transform-style-3d border ${
                    isFlipped ? 'rotate-y-180 border-[#A7B99A]' : 'border-[#365C4A]/30'
                  }`}
                >
                  {/* Mặt trước (Front) */}
                  <div className="absolute inset-0 backface-hidden rounded-3xl bg-[#F8F5EE] p-6 flex flex-col justify-between border border-[#365C4A]/20">
                    <span className="text-[11px] font-black text-[#365C4A] uppercase tracking-wider">
                      MẶT TRƯỚC: CÂU HỎI / KHÁI NIỆM
                    </span>
                    <div className="text-base sm:text-lg font-bold text-[#553F35] text-center px-4">
                      {currentCard?.front}
                    </div>
                    <div className="text-center text-xs text-[#553F35]/60 font-medium">
                      Chạm để xem công thức / đáp án ↻
                    </div>
                  </div>

                  {/* Mặt sau (Back) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-[#365C4A] to-[#264234] text-white p-6 flex flex-col justify-between border border-[#A7B99A]">
                    <span className="text-[11px] font-black text-[#A7B99A] uppercase tracking-wider">
                      MẶT SAU: LỜI GIẢI / CÔNG THỨC CHÍNH XÁC
                    </span>
                    <div className="text-base sm:text-lg font-bold text-[#FAEFDF] text-center px-4 font-mono">
                      {currentCard?.back}
                    </div>
                    <div className="text-center text-xs text-[#A7B99A] font-bold">
                      Đã ghi nhớ kiến thức này!
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrevCard}
                  className="px-4 py-2 rounded-full bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#365C4A] text-xs font-bold flex items-center gap-1.5 transition-all border border-[#365C4A]/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Thẻ trước</span>
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-5 py-2 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#365C4A]/20"
                >
                  <RotateCw className="w-4 h-4 text-[#A7B99A]" />
                  <span>Lật thẻ</span>
                </button>
                <button
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-full bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#365C4A] text-xs font-bold flex items-center gap-1.5 transition-all border border-[#365C4A]/20"
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
                <div className="p-5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#553F35]">Kết quả bài trắc nghiệm:</div>
                    <div className="text-2xl font-black text-[#365C4A] font-mono mt-0.5">
                      {calculateQuizScore()} / {resource.mini_quiz.length} câu đúng
                    </div>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-bold transition-all shadow-md shadow-[#365C4A]/20"
                  >
                    Làm lại bài
                  </button>
                </div>
              )}

              {resource.mini_quiz.map((q, qIdx) => {
                const selectedOpt = userAnswers[qIdx];
                const isChosen = selectedOpt !== undefined;

                return (
                  <div key={qIdx} className="p-5 rounded-3xl bg-[#F8F5EE] border border-[#365C4A]/15 space-y-3 shadow-sm">
                    <div className="text-sm font-bold text-[#365C4A] flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#365C4A] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
                        {qIdx + 1}
                      </span>
                      <span className="pt-0.5">{q.question}</span>
                    </div>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const optChosen = selectedOpt === optIdx;
                        const isCorrect = q.correctIndex === optIdx;

                        let style = 'bg-white border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]';
                        if (submittedQuiz) {
                          if (isCorrect) style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          else if (optChosen && !isCorrect) style = 'bg-rose-50 border-rose-500 text-rose-900';
                        } else if (optChosen) {
                          style = 'bg-[#365C4A] border-[#365C4A] text-white font-bold shadow-md';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between shadow-sm ${style}`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {submittedQuiz && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {submittedQuiz && optChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {submittedQuiz && (
                      <div className="p-3.5 rounded-2xl bg-white border border-[#365C4A]/20 text-xs text-[#553F35] mt-2 leading-relaxed">
                        <strong className="text-emerald-700">Giải thích: </strong>
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
                    className="px-6 py-3 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white font-bold text-xs shadow-xl shadow-[#365C4A]/25 disabled:opacity-50 transition-all active:scale-98"
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
