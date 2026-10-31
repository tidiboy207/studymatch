import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, AlertTriangle, Zap } from 'lucide-react';
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

  // Nút kiểm tra cơ chế cảnh báo AFK
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
    <div className={`p-5 rounded-3xl border transition-all ${
      isAlerting
        ? 'bg-rose-50 border-rose-500 shadow-xl shadow-rose-600/20 animate-pulse'
        : 'bg-white border-[#365C4A]/20 shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#365C4A]/10">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#365C4A]">
          <ShieldAlert className="w-4 h-4 text-[#D89C57]" />
          <span>Giám Sát Kỷ Luật Anti-AFK</span>
        </div>

        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
          afkAlertCount > 0
            ? 'bg-rose-100 text-rose-800 border border-rose-300'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
        }`}>
          {afkAlertCount} Vi phạm
        </span>
      </div>

      {/* Visibility Status */}
      <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#365C4A]/15 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#553F35]/70 font-semibold">Trạng thái màn hình:</span>
          {isTabVisible ? (
            <span className="text-emerald-800 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Đang tập trung trong phòng
            </span>
          ) : (
            <span className="text-rose-700 font-black flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              Đang ở tab khác ({hiddenSeconds}s)
            </span>
          )}
        </div>

        <p className="text-[11px] text-[#553F35]/80 leading-relaxed font-medium">
          Tự động phát hiện khi chuyển sang Facebook/TikTok quá 3 phút để phát chuông nhắc nhở và ghi nhận điểm kỷ luật.
        </p>
      </div>

      {/* Alert Warning Active Banner */}
      {isAlerting && (
        <div className="mt-3 p-3.5 rounded-2xl bg-rose-100 border border-rose-300 text-xs text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 animate-bounce" />
          <div>
            <strong className="text-rose-950 block font-black">CẢNH BÁO XAO NHÃNG:</strong>
            Bạn đã rời phòng học! Hãy quay lại tập trung hoàn thành bài tập cùng bạn học.
          </div>
        </div>
      )}

      {/* Quick Test Button */}
      <div className="mt-3 pt-2.5 border-t border-[#365C4A]/10 flex items-center justify-between gap-2">
        <div className="text-[10px] text-[#553F35]/60 font-medium">Kiểm tra cảm biến:</div>
        <button
          onClick={handleStart5sTest}
          disabled={testMode || isAlerting}
          className="px-3 py-1.5 rounded-full bg-[#F8F5EE] hover:bg-[#EBE8DF] text-[#365C4A] border border-[#365C4A]/20 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 text-[#D89C57]" />
          <span>{testMode ? `Đếm ngược ${testCountdown}s...` : 'Kiểm tra chuông AFK'}</span>
        </button>
      </div>
    </div>
  );
};
