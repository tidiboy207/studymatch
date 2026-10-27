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
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Bộ Mô Phỏng Trọng Số Ghép Đôi (Interactive Weight Sliders)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Thời gian thực
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Công thức: <code className="text-indigo-300 font-mono">S = w_c*C + w_t*T + w_g*G + w_l*L</code>
            </p>
          </div>
        </div>

        <button
          onClick={onResetWeights}
          disabled={isDefault}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-40 flex items-center gap-1.5 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại chuẩn (35-30-20-15)</span>
        </button>
      </div>

      {/* 4 Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        
        {/* C: Môn học & Chủ đề bù trừ */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-rose-300">C: Môn & Bù trừ yếu</span>
            <span className="font-mono font-bold text-white bg-rose-500/20 px-1.5 py-0.2 rounded text-[11px]">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Ưu tiên người giỏi phần bạn đang yếu
          </p>
        </div>

        {/* T: Lịch rảnh trùng nhau */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-indigo-300">T: Lịch rảnh trùng nhau</span>
            <span className="font-mono font-bold text-white bg-indigo-500/20 px-1.5 py-0.2 rounded text-[11px]">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Khớp ca rảnh buổi tối trong tuần
          </p>
        </div>

        {/* G: Mục tiêu học tập */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-emerald-300">G: Mục tiêu học tập</span>
            <span className="font-mono font-bold text-white bg-emerald-500/20 px-1.5 py-0.2 rounded text-[11px]">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Cùng làm bài tập hoặc luyện đề A/A+
          </p>
        </div>

        {/* L: Phong cách học */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-amber-300">L: Phong cách học</span>
            <span className="font-mono font-bold text-white bg-amber-500/20 px-1.5 py-0.2 rounded text-[11px]">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Pomodoro yên lặng hoặc thảo luận
          </p>
        </div>

      </div>
    </div>
  );
};
