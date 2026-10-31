import React from 'react';
import { MatchingWeights } from '../../types';
import { Sliders, RotateCcw, Info, Sparkles } from 'lucide-react';
import { DEFAULT_WEIGHTS } from '../../services/matchingEngine';

interface WeightSlidersProps {
  weights: MatchingWeights;
  onChangeWeights: (newWeights: MatchingWeights) => void;
  onResetWeights: () => void;
}

export const WeightSliders: React.FC<WeightSlidersProps> = ({
  weights,
  onChangeWeights,
  onResetWeights
}) => {
  const handleChange = (key: keyof MatchingWeights, val: number) => {
    onChangeWeights({
      ...weights,
      [key]: val / 100
    });
  };

  const isDefault =
    Math.round(weights.c * 100) === 35 &&
    Math.round(weights.t * 100) === 30 &&
    Math.round(weights.g * 100) === 20 &&
    Math.round(weights.l * 100) === 15;

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#365C4A]/20 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#365C4A]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#365C4A]/10 text-[#365C4A] flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#365C4A] flex items-center gap-2">
              Bộ Tinh Chỉnh Trọng Số Ghép Đôi
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#A7B99A]/20 text-[#365C4A] font-bold border border-[#A7B99A]/40">
                Thời gian thực
              </span>
            </h3>
            <p className="text-xs text-[#553F35]/70">
              Công thức thuật toán: <code className="text-[#365C4A] font-bold font-mono">S = w_c*C + w_t*T + w_g*G + w_l*L</code>
            </p>
          </div>
        </div>

        <button
          onClick={onResetWeights}
          disabled={isDefault}
          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#365C4A] transition-all disabled:opacity-40 flex items-center gap-1.5 border border-[#365C4A]/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại chuẩn (35-30-20-15)</span>
        </button>
      </div>

      {/* 4 Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        
        {/* C: Môn học & Chủ đề bù trừ */}
        <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-rose-800">C: Môn & Bù trừ yếu</span>
            <span className="font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full text-xs">
              {Math.round(weights.c * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.c * 100)}
            onChange={(e) => handleChange('c', Number(e.target.value))}
            className="w-full h-2 bg-[#EBE8DF] rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <p className="text-[11px] text-[#553F35]/70 mt-1.5 font-medium">
            Ưu tiên người giỏi phần bạn đang yếu
          </p>
        </div>

        {/* T: Lịch rảnh trùng nhau */}
        <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-[#365C4A]">T: Trùng ca rảnh</span>
            <span className="font-mono font-bold text-[#365C4A] bg-[#A7B99A]/30 px-2 py-0.5 rounded-full text-xs">
              {Math.round(weights.t * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.t * 100)}
            onChange={(e) => handleChange('t', Number(e.target.value))}
            className="w-full h-2 bg-[#EBE8DF] rounded-lg appearance-none cursor-pointer accent-[#365C4A]"
          />
          <p className="text-[11px] text-[#553F35]/70 mt-1.5 font-medium">
            Khớp ca rảnh học tập trong tuần
          </p>
        </div>

        {/* G: Mục tiêu học tập */}
        <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-emerald-800">G: Mục tiêu học tập</span>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-xs">
              {Math.round(weights.g * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.g * 100)}
            onChange={(e) => handleChange('g', Number(e.target.value))}
            className="w-full h-2 bg-[#EBE8DF] rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <p className="text-[11px] text-[#553F35]/70 mt-1.5 font-medium">
            Cùng làm bài tập hoặc ôn thi A/A+
          </p>
        </div>

        {/* L: Phong cách học */}
        <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-[#D89C57]">L: Phong cách học</span>
            <span className="font-mono font-bold text-[#D89C57] bg-[#D89C57]/20 px-2 py-0.5 rounded-full text-xs">
              {Math.round(weights.l * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.l * 100)}
            onChange={(e) => handleChange('l', Number(e.target.value))}
            className="w-full h-2 bg-[#EBE8DF] rounded-lg appearance-none cursor-pointer accent-[#D89C57]"
          />
          <p className="text-[11px] text-[#553F35]/70 mt-1.5 font-medium">
            Pomodoro yên tĩnh hoặc thảo luận sôi nổi
          </p>
        </div>

      </div>
    </div>
  );
};
