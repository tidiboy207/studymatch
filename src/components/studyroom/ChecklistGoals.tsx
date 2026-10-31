import React, { useState } from 'react';
import { SessionGoal, StudySession } from '../../types';
import { CheckSquare, Square, Target } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface ChecklistGoalsProps {
  session: StudySession;
  onGoalToggle: (goalId: string) => Promise<void>;
}

export const ChecklistGoals: React.FC<ChecklistGoalsProps> = ({ session, onGoalToggle }) => {
  const [newGoalText, setNewGoalText] = useState('');
  const goals = session.goals_checklist || [];

  const completedCount = goals.filter(g => g.completed).length;

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal: SessionGoal = {
      id: `goal-${Date.now()}`,
      text: newGoalText.trim(),
      completed: false
    };

    const nextGoals = [...goals, newGoal];
    const sessions = dataService.getLocalSessions();
    const s = sessions.find(item => item.id === session.id);
    if (s) {
      s.goals_checklist = nextGoals;
      localStorage.setItem('studymatch_sessions_v1', JSON.stringify(sessions));
      dataService.broadcastEvent({ type: 'GOALS_UPDATED', sessionId: session.id, goals: nextGoals });
    }
    setNewGoalText('');
  };

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#365C4A]/20 shadow-md">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#365C4A]/10">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#365C4A]" />
          <h4 className="text-xs font-black text-[#365C4A] uppercase tracking-wider">
            Checklist 3 Mục Tiêu Bài Tập Trong Buổi Học
          </h4>
        </div>
        <span className="text-xs font-mono font-bold text-[#365C4A] bg-[#A7B99A]/20 px-2.5 py-0.5 rounded-full border border-[#A7B99A]/40">
          {completedCount} / {goals.length} Đã Xong
        </span>
      </div>

      {/* Goals list */}
      <div className="space-y-2">
        {goals.map((g) => (
          <div
            key={g.id}
            onClick={() => onGoalToggle(g.id)}
            className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
              g.completed
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 line-through'
                : 'bg-[#F8F5EE] border-[#365C4A]/15 text-[#553F35] hover:border-[#365C4A]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {g.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <span className="flex-1 select-none leading-relaxed font-medium">{g.text}</span>
          </div>
        ))}
      </div>

      {/* Add extra goal */}
      {goals.length < 5 && (
        <form onSubmit={handleAddGoal} className="mt-3.5 flex items-center gap-2">
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="+ Thêm bài tập / mục tiêu ôn tập..."
            className="flex-1 px-3.5 py-2 rounded-full bg-[#F8F5EE] border border-[#365C4A]/20 text-xs text-[#553F35] placeholder-[#553F35]/50 focus:outline-none focus:border-[#365C4A]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-bold shrink-0 shadow-sm"
          >
            Thêm
          </button>
        </form>
      )}
    </div>
  );
};
