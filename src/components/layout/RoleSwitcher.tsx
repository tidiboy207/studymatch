import React from 'react';
import { UserProfile } from '../../types';
import { STUDENT_A_ID, STUDENT_B_ID } from '../../data/mockProfiles';
import { Users, Sparkles, AlertCircle } from 'lucide-react';

interface RoleSwitcherProps {
  currentUser: UserProfile;
  onSwitchRole: (role: 'A' | 'B') => void;
  isSupabaseLive: boolean;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentUser,
  onSwitchRole,
  isSupabaseLive
}) => {
  const isStudentA = currentUser.id === STUDENT_A_ID;

  return (
    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 rounded-full p-1 pl-2.5 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mr-1">
        <Users className="w-3.5 h-3.5 text-indigo-400" />
        <span className="hidden sm:inline">Chuyển vai Demo:</span>
      </div>

      <button
        onClick={() => onSwitchRole('A')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
          isStudentA
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
        title="Sinh viên A: Mất gốc, hay trì hoãn, cần tìm bạn học kéo"
      >
        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
        <span>SV A (Mất gốc)</span>
      </button>

      <button
        onClick={() => onSwitchRole('B')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
          !isStudentA
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
        title="Sinh viên B: Khá giỏi săn học bổng A/A+, ôn tập qua giảng giải"
      >
        <Sparkles className="w-3 h-3 text-emerald-400" />
        <span>SV B (Săn A/A+)</span>
      </button>

      {/* Chế độ Live vs Demo pill */}
      <div className="hidden lg:flex items-center pl-2 pr-1 border-l border-slate-700/80 text-[11px]">
        {isSupabaseLive ? (
          <span className="flex items-center gap-1 text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Supabase Live
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-400 font-mono" title="Chạy trên kho dữ liệu mô phỏng LocalStorage 0-config">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Demo Mode (0-Config)
          </span>
        )}
      </div>
    </div>
  );
};
