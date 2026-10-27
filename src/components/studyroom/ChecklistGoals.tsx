import React, { useState } from 'react';
import { SessionGoal, StudySession } from '../../types';
import { CheckSquare, Square, Plus, Trash2, Target, CheckCircle2 } from 'lucide-react';
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
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Checklist 3 Mục Tiêu Bài Tập Trong Buổi Học
          </h4>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          {completedCount} / {goals.length} Đã Xong
        </span>
      </div>

      {/* Goals list */}
      <div className="space-y-2">
        {goals.map((g) => (
          <div
            key={g.id}
            onClick={() => onGoalToggle(g.id)}
            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
              g.completed
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 line-through'
                : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {g.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <span className="flex-1 select-none leading-relaxed">{g.text}</span>
          </div>
        ))}
      </div>

      {/* Add extra goal */}
      {goals.length < 5 && (
        <form onSubmit={handleAddGoal} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="+ Thêm bài tập / mục tiêu ôn tập..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shrink-0"
          >
            Thêm
          </button>
        </form>
      )}
    </div>
  );
};
