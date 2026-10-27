import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, AlertTriangle, Volume2, Clock, CheckCircle2, Zap } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface AntiAfkMonitorProps {
  sessionId: string;
  afkAlertCount: number;
  onAfkAlert: () => void;
}

export const AntiAfkMonitor: React.FC<AntiAfkMonitorProps> = ({
  sessionId,
  afkAlertCount,
  onAfkAlert
}) => {
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const [hiddenSeconds, setHiddenSeconds] = useState(0);
  const [isAlerting, setIsAlerting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [testCountdown, setTestCountdown] = useState(0);

  const hiddenTimerRef = useRef<any>(null);

  // Phát âm thanh cảnh báo xao nhãng bằng Web Audio API
  const playDisciplinarySiren = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      playTone(440, now, 0.25);
      playTone(660, now + 0.3, 0.25);
      playTone(880, now + 0.6, 0.4);
    } catch (e) {
      console.warn('AudioContext error', e);
    }
  };

  // Lắng nghe Browser Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      const hidden = document.hidden;
      setIsTabVisible(!hidden);

      if (hidden) {
        // Sinh viên vừa chuyển sang tab khác (Facebook, TikTok...)
        const start = Date.now();
        hiddenTimerRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - start) / 1000);
          setHiddenSeconds(elapsed);

          // Nếu rời tab quá 3 phút (180 giây) -> Kích hoạt cảnh báo AFK
          if (elapsed >= 180) {
            triggerAfkViolation();
          }
        }, 1000);
      } else {
        // Sinh viên đã quay lại tab học
        if (hiddenTimerRef.current) {
          clearInterval(hiddenTimerRef.current);
          hiddenTimerRef.current = null;
        }
        setHiddenSeconds(0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (hiddenTimerRef.current) clearInterval(hiddenTimerRef.current);
    };
  }, [sessionId]);

  const triggerAfkViolation = async () => {
    setIsAlerting(true);
    playDisciplinarySiren();
    await dataService.logAfkAlert(sessionId);
    onAfkAlert();

    setTimeout(() => {
      setIsAlerting(false);
    }, 6000);
  };

  // Nút Demo nhanh AFK (5 giây) dành cho ban giám khảo
  const handleStart5sTest = () => {
    setTestMode(true);
    setTestCountdown(5);

    const interval = setInterval(() => {
      setTestCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTestMode(false);
          triggerAfkViolation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isAlerting
        ? 'bg-rose-950/80 border-rose-500 shadow-2xl shadow-rose-600/30 animate-pulse'
        : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Giám sát Kỷ luật Anti-AFK</span>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
          afkAlertCount > 0
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        }`}>
          {afkAlertCount} Vi phạm
        </span>
      </div>

      {/* Visibility Status */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Trạng thái màn hình:</span>
          {isTabVisible ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Đang tập trung trong phòng
            </span>
          ) : (
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              Đang ở tab khác ({hiddenSeconds}s)
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Tự động phát hiện khi chuyển sang Facebook/TikTok quá 3 phút để phát chuông nhắc nhở và ghi nhận điểm kỷ luật.
        </p>
      </div>

      {/* Alert Warning Active Banner */}
      {isAlerting && (
        <div className="mt-3 p-3 rounded-xl bg-rose-900/60 border border-rose-500 text-xs text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
          <div>
            <strong className="text-white block font-bold">CẢNH BÁO XAO NHÃNG:</strong>
            Bạn đã rời phòng học! Hãy tập trung hoàn thành bài tập cùng bạn học.
          </div>
        </div>
      )}

      {/* Quick 5s Demo Test Button for Judges */}
      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="text-[10px] text-slate-500">Demo hội đồng:</div>
        <button
          onClick={handleStart5sTest}
          disabled={testMode || isAlerting}
          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{testMode ? `Đếm ngược ${testCountdown}s...` : 'Test nhanh AFK (5 giây)'}</span>
        </button>
      </div>
    </div>
  );
};
