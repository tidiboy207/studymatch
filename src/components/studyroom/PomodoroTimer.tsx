import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Volume2 } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface PomodoroTimerProps {
  sessionId: string;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ sessionId }) => {
  const [durationMode, setDurationMode] = useState<25 | 50>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Phát âm thanh báo khi hết giờ bằng Web Audio API
  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('AudioContext error', e);
    }
  };

  // Đồng bộ qua BroadcastChannel giữa 2 tab cùng máy
  useEffect(() => {
    const unsub = dataService.subscribeToBroadcast((ev) => {
      if (ev.type === 'POMODORO_SYNC' && ev.sessionId === sessionId) {
        setIsRunning(ev.isRunning);
        setTimeLeft(ev.timeLeft);
        setDurationMode(ev.durationMode);
      }
    });
    return unsub;
  }, [sessionId]);

  // Bộ đếm đếm ngược
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playChimeSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleRun = () => {
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    dataService.broadcastEvent({
      type: 'POMODORO_SYNC',
      sessionId,
      isRunning: nextRunning,
      timeLeft,
      durationMode
    });
  };

  const resetTimer = (mode: 25 | 50 = durationMode) => {
    setIsRunning(false);
    setDurationMode(mode);
    const newSeconds = mode * 60;
    setTimeLeft(newSeconds);
    dataService.broadcastEvent({
      type: 'POMODORO_SYNC',
      sessionId,
      isRunning: false,
      timeLeft: newSeconds,
      durationMode: mode
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((durationMode * 60 - timeLeft) / (durationMode * 60)) * 100;

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#365C4A]/20 shadow-md">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#365C4A]/10">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#365C4A] uppercase tracking-wider">
          <Clock className="w-4 h-4 text-[#D89C57]" />
          <span>Đồng hồ Pomodoro Kỷ luật</span>
        </div>
        
        {/* Chuyển chế độ 25m / 50m */}
        <div className="flex rounded-full bg-[#F8F5EE] p-0.5 border border-[#365C4A]/15 text-[11px] font-bold">
          <button
            onClick={() => resetTimer(25)}
            className={`px-3 py-1 rounded-full transition-all ${
              durationMode === 25 ? 'bg-[#365C4A] text-white shadow-sm' : 'text-[#553F35]/70 hover:text-[#365C4A]'
            }`}
          >
            25m
          </button>
          <button
            onClick={() => resetTimer(50)}
            className={`px-3 py-1 rounded-full transition-all ${
              durationMode === 50 ? 'bg-[#365C4A] text-white shadow-sm' : 'text-[#553F35]/70 hover:text-[#365C4A]'
            }`}
          >
            50m
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center py-2 relative">
        <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-[#365C4A]">
          {formattedTime}
        </div>
        <p className="text-[11px] text-[#553F35]/75 mt-1 font-medium">
          {isRunning ? '⏳ Đang tập trung cao độ — Không chuyển tab' : '⏸ Đang tạm dừng'}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-[#F8F5EE] rounded-full h-2 mt-3 overflow-hidden border border-[#365C4A]/15">
          <div
            className="bg-gradient-to-r from-[#A7B99A] to-[#365C4A] h-full transition-all duration-1000 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[#365C4A]/10">
        <button
          onClick={toggleRun}
          className={`px-5 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
            isRunning
              ? 'bg-[#D89C57] hover:bg-[#c28642] text-white shadow-[#D89C57]/25'
              : 'bg-[#365C4A] hover:bg-[#2B4A3B] text-white shadow-[#365C4A]/25'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          <span>{isRunning ? 'Tạm Dừng' : 'Bắt Đầu Hiệp'}</span>
        </button>

        <button
          onClick={() => resetTimer(durationMode)}
          className="p-2 rounded-full bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#553F35] border border-[#365C4A]/15 transition-all"
          title="Đặt lại đồng hồ"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={playChimeSound}
          className="p-2 rounded-full bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#553F35] border border-[#365C4A]/15 transition-all"
          title="Thử âm thanh chuông"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
