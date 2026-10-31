import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  Calendar,
  BookOpen,
  Headphones,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  X,
  CheckCircle2,
  MailCheck,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  RefreshCw,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserProfile, SimulatedEmailMessage } from '../../types';
import { dataService } from '../../services/dataService';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [isRegisterModal, setIsRegisterModal] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');

  // Email Verification States (OTP & Magic Link)
  const [isOtpModal, setIsOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [simulatedEmail, setSimulatedEmail] = useState<SimulatedEmailMessage | null>(null);
  const [showSimulatedInbox, setShowSimulatedInbox] = useState(true);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Check Magic Link verification from URL query (?verify_token=...&email=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get('verify_token');
    const verifyEmailParam = urlParams.get('email');
    if (verifyToken) {
      setIsLoading(true);
      showNotification('Đang xác thực liên kết Magic Link từ email... 🍵');
      dataService.verifyMagicLink(verifyToken, verifyEmailParam || undefined).then((res) => {
        if (res.success && res.user) {
          showNotification(`Xác thực thành công! Chào mừng ${res.user.display_name} 🍵`);
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => onLoginSuccess(res.user!), 600);
        } else {
          showNotification(res.error || 'Liên kết xác thực không hợp lệ hoặc đã quá hạn!');
        }
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, []);

  // Timer countdown for resending verification code
  useEffect(() => {
    let timer: any;
    if (isOtpModal && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpModal, resendCooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim() || 'duccoi4321@gmail.com';
    setIsLoading(true);
    try {
      const result = await dataService.loginWithCredentials(
        targetEmail,
        password || '123456'
      );
      if (result.success && result.user) {
        showNotification(`Chào mừng ${result.user.display_name} đến với góc học tập StudyMatch! 🍵`);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 500);
      } else {
        showNotification(result.error || 'Đăng nhập không thành công, vui lòng thử lại!');
      }
    } catch (err: any) {
      showNotification('Lỗi kết nối máy chủ!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const targetEmail = email.trim();
    showNotification('Đang đồng bộ lịch học & hồ sơ qua Google Sinh viên... 🍵');
    try {
      const result = await dataService.loginWithGoogle(targetEmail);
      if (result.success && result.user) {
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 600);
      }
    } catch (err: any) {
      showNotification('Đăng nhập Google thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Kích hoạt quy trình xác thực email khi người dùng bấm tạo tài khoản
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = registerEmail.trim() || email.trim();
    if (!targetEmail) {
      showNotification('Vui lòng nhập địa chỉ email của bạn!');
      return;
    }
    setIsLoading(true);
    try {
      const result = await dataService.initiateEmailRegistration(
        targetEmail,
        registerName.trim() || targetEmail.split('@')[0]
      );

      if (!result.success) {
        showNotification(result.error || 'Không thể gửi mã xác thực!');
        return;
      }

      if (!result.isNew) {
        // Tài khoản đã có sẵn và đã xác thực -> Chuyển sang đăng nhập
        showNotification('Email này đã được kích hoạt trước đó! Đang đăng nhập... 🍵');
        const loginRes = await dataService.loginWithCredentials(targetEmail);
        if (loginRes.user) onLoginSuccess(loginRes.user);
        return;
      }

      // Đóng modal đăng ký và mở modal nhập mã OTP
      setIsRegisterModal(false);
      setOtpEmail(targetEmail);
      setOtpDigits(['', '', '', '', '', '']);
      setResendCooldown(60);
      setSimulatedEmail(result.simulatedEmail || null);
      setShowSimulatedInbox(true);
      setIsOtpModal(true);
      showNotification(`Mã xác thực 6 số đã được gửi tới ${targetEmail}! ✉️`);
    } catch (err: any) {
      showNotification('Đăng ký không thành công, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Digits Handling (auto-focus next input, paste support)
  const handleDigitChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto focus next
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }

    // Auto submit if 6 digits complete
    if (digit && index === 5 && newDigits.every(d => d !== '')) {
      handleVerifyOtpSubmit(newDigits.join(''));
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        handleVerifyOtpSubmit(pasted);
      }
    }
  };

  // Xác thực OTP
  const handleVerifyOtpSubmit = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 6) {
      showNotification('Vui lòng nhập đủ 6 chữ số mã OTP!');
      return;
    }
    setIsLoading(true);
    try {
      const result = await dataService.verifyOtp(otpEmail, code);
      if (result.success && result.user) {
        setIsOtpModal(false);
        showNotification(`Xác thực email thành công! Chào mừng ${result.user.display_name} 🍵`);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 500);
      } else {
        showNotification(result.error || 'Mã xác thực không hợp lệ!');
      }
    } catch (err: any) {
      showNotification('Lỗi xác thực, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    try {
      const res = await dataService.resendOtp(otpEmail);
      if (res.success) {
        setResendCooldown(60);
        setSimulatedEmail(res.simulatedEmail || null);
        showNotification(`Đã gửi lại mã OTP mới đến ${otpEmail}! 📬`);
      } else {
        showNotification(res.error || 'Không thể gửi lại mã!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xác thực qua Magic Link 1-click
  const handleMagicLinkClick = async (token: string) => {
    setIsLoading(true);
    showNotification('Đang kích hoạt bằng liên kết Magic Link... 🍵');
    try {
      const res = await dataService.verifyMagicLink(token, otpEmail);
      if (res.success && res.user) {
        setIsOtpModal(false);
        showNotification(`Kích hoạt tài khoản thành công! 🍵`);
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 500);
      } else {
        showNotification(res.error || 'Liên kết không hợp lệ!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full min-w-[1140px] overflow-x-auto overflow-y-hidden bg-[#EFECE6] flex items-center justify-center p-8 select-none">
      
      {/* Dynamic Keyframes & Specific Styles matching the Google Sites embed 100% */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap');

        .font-display {
          font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;
        }
        .font-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-7px) rotate(0.6deg);
          }
        }

        @keyframes floatDelayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes steamWave {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.88;
          }
          50% {
            transform: translateY(-8px) translateX(4px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes aromaRise {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.45;
          }
          50% {
            transform: translateY(-12px) scale(1.08);
            opacity: 0.85;
          }
        }

        .animate-cup-float {
          animation: floatSlow 6.5s ease-in-out infinite;
        }
        .animate-card-float-1 {
          animation: floatSlow 5.5s ease-in-out infinite;
        }
        .animate-card-float-2 {
          animation: floatDelayed 6.2s ease-in-out 1.2s infinite;
        }
        .animate-steam {
          animation: steamWave 7s ease-in-out infinite;
        }
        .animate-aroma {
          animation: aromaRise 5s ease-in-out infinite;
        }

        /* Multi-layered 3D Main Card Shadow */
        .main-card-3d-shadow {
          box-shadow:
            0 45px 95px -20px rgba(24, 43, 33, 0.34),
            0 25px 50px -15px rgba(44, 74, 60, 0.22),
            0 8px 20px -5px rgba(22, 38, 29, 0.12),
            0 0 0 1px rgba(255, 255, 255, 0.65);
        }

        /* High-end Glassmorphism Cards on Matcha Left Side */
        .glass-feature-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.17) 0%,
            rgba(255, 255, 255, 0.06) 100%
          );
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.28);
          box-shadow:
            0 18px 36px -10px rgba(14, 29, 21, 0.35),
            0 4px 12px -2px rgba(14, 29, 21, 0.18),
            inset 0 1px 1px rgba(255, 255, 255, 0.42);
        }
        .glass-feature-card:hover {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.24) 0%,
            rgba(255, 255, 255, 0.10) 100%
          );
          border-color: rgba(255, 255, 255, 0.48);
          transform: translateY(-4px) scale(1.015);
          box-shadow:
            0 24px 42px -10px rgba(14, 29, 21, 0.44),
            inset 0 1px 2px rgba(255, 255, 255, 0.55);
        }

        /* Recessed Pill Inputs (#EFECE3) */
        .pill-input-recessed {
          background-color: #EFECE3;
          box-shadow:
            inset 0 2px 5px rgba(44, 62, 52, 0.11),
            inset 0 1px 2px rgba(44, 62, 52, 0.07),
            0 1px 0 rgba(255, 255, 255, 0.95);
        }
        .pill-input-recessed:focus-within {
          background-color: #F4F1E9;
          box-shadow:
            inset 0 1px 3px rgba(44, 62, 52, 0.05),
            0 0 0 2.5px rgba(54, 92, 74, 0.32),
            0 10px 22px -6px rgba(54, 92, 74, 0.15);
        }

        /* 3D Matcha CTA Button with Multi-layer Shadow */
        .matcha-cta-button {
          background: linear-gradient(135deg, #365C4A 0%, #3F5E4F 52%, #2C4A3C 100%);
          box-shadow:
            0 14px 28px -6px rgba(44, 74, 60, 0.45),
            0 6px 14px -3px rgba(44, 74, 60, 0.28),
            inset 0 1px 1px rgba(255, 255, 255, 0.32);
        }
        .matcha-cta-button:hover {
          background: linear-gradient(135deg, #3D6753 0%, #486B5A 52%, #325444 100%);
          box-shadow:
            0 20px 34px -6px rgba(44, 74, 60, 0.55),
            0 8px 18px -4px rgba(44, 74, 60, 0.34),
            inset 0 1px 2px rgba(255, 255, 255, 0.45);
          transform: translateY(-2px);
        }
        .matcha-cta-button:active {
          transform: translateY(0px);
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#EFECE6]">
        <div
          className="absolute -top-36 -left-32 w-[620px] h-[620px] rounded-full blur-[120px] opacity-75"
          style={{
            background: 'radial-gradient(circle, rgba(54, 92, 74, 0.28) 0%, rgba(82, 121, 101, 0.12) 55%, transparent 75%)'
          }}
        />
        <div
          className="absolute -bottom-32 left-[8%] w-[520px] h-[520px] rounded-full blur-[130px] opacity-70"
          style={{
            background: 'radial-gradient(circle, rgba(230, 161, 92, 0.26) 0%, rgba(245, 158, 11, 0.10) 55%, transparent 75%)'
          }}
        />
        <div
          className="absolute -top-28 right-[5%] w-[480px] h-[480px] rounded-full blur-[125px] opacity-65"
          style={{
            background: 'radial-gradient(circle, rgba(230, 161, 92, 0.22) 0%, rgba(216, 226, 220, 0.15) 60%, transparent 75%)'
          }}
        />
        <div
          className="absolute -bottom-36 -right-24 w-[580px] h-[580px] rounded-full blur-[130px] opacity-70"
          style={{
            background: 'radial-gradient(circle, rgba(63, 94, 79, 0.22) 0%, rgba(132, 169, 140, 0.10) 55%, transparent 75%)'
          }}
        />

        {/* Ambient SVG Waves on entire screen background */}
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full opacity-55"
        >
          <path
            d={`M 0,0 L 790,0
               C 740,95 825,180 765,275
               C 705,370 785,465 710,565
               C 635,665 540,750 585,900
               L 0,900 Z`}
            fill="#E2DFD7"
          />
          <path
            d={`M 0,0 L 745,0
               C 695,110 775,205 715,305
               C 655,405 735,500 660,605
               C 585,710 495,785 535,900
               L 0,900 Z`}
            fill="#D5DDD7"
            fillOpacity="0.45"
          />
        </svg>

        {/* Floating Aroma / Dust Bubbles in outer space */}
        <div className="absolute top-[12%] left-[7%] w-20 h-20 rounded-full bg-[#365C4A]/10 blur-[1px] border border-white/40 animate-aroma" />
        <div className="absolute bottom-[14%] right-[8%] w-14 h-14 rounded-full bg-[#E6A15C]/12 blur-[1px] border border-white/40 animate-cup-float" />
      </div>

      {/* Toast Notification Pill */}
      {toast && (
        <div className="fixed top-6 z-50 flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#264235]/95 text-[#FAF7F2] backdrop-blur-md border border-white/25 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <span className="text-lg">🍵</span>
          <span className="text-sm font-semibold tracking-wide font-body">{toast}</span>
        </div>
      )}

      {/* =========================================================================
          MAIN 3D CARD (w-[1100px] h-[640px] rounded-[32px])
         ========================================================================= */}
      <div className="relative z-10 w-[1100px] h-[640px] shrink-0 rounded-[32px] main-card-3d-shadow overflow-hidden flex flex-row bg-[#FAF7F2]">
        
        {/* Visual Background Layer across Card with Deep Matcha & Multi-Layer Wave SVG */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{
            background: 'linear-gradient(140deg, #365C4A 0%, #3F5E4F 48%, #2C4A3C 100%)'
          }}
        >
          {/* Internal soft glows */}
          <div
            className="absolute -top-20 -left-16 w-80 h-80 rounded-full blur-[70px] opacity-45"
            style={{ background: 'radial-gradient(circle, #74A88E 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-8 left-[28%] w-72 h-72 rounded-full blur-[65px] opacity-35"
            style={{ background: 'radial-gradient(circle, #E6A15C 0%, transparent 70%)' }}
          />

          {/* SVG Complex Layer: Organic wavy divider, coffee cup on coaster, foam & steam */}
          <svg
            viewBox="0 0 1100 640"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="sageSteamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#65937C" stopOpacity="0.42" />
                <stop offset="50%" stopColor="#8AB39E" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#D8E2DC" stopOpacity="0.25" />
              </linearGradient>

              <linearGradient id="creamFoamGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CBE0D4" stopOpacity="0.65" />
                <stop offset="55%" stopColor="#E6EFEA" stopOpacity="0.78" />
                <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="aromaWispGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0.42" />
                <stop offset="45%" stopColor="#D8E2DC" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.0" />
              </linearGradient>

              <radialGradient id="warmLampOrb" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#365C4A" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="ceramicCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF7F2" />
                <stop offset="65%" stopColor="#EAE5DC" />
                <stop offset="100%" stopColor="#D2CCC0" />
              </linearGradient>

              <linearGradient id="matchaLiquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4B7F65" />
                <stop offset="55%" stopColor="#659B7E" />
                <stop offset="100%" stopColor="#3D6B54" />
              </linearGradient>

              <linearGradient id="woodCoasterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C89B6E" />
                <stop offset="50%" stopColor="#DFB387" />
                <stop offset="100%" stopColor="#A67B51" />
              </linearGradient>

              <filter id="waveShadow3D" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="-10" dy="4" stdDeviation="12" floodColor="#182C22" floodOpacity="0.26" />
              </filter>

              <filter id="cupShadow3D" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="14" stdDeviation="10" floodColor="#14261D" floodOpacity="0.38" />
              </filter>
            </defs>

            {/* Warm lamp orbs */}
            <circle cx="110" cy="490" r="85" fill="url(#warmLampOrb)" />
            <circle cx="430" cy="115" r="55" fill="url(#warmLampOrb)" />

            {/* Sparkle clusters */}
            <g fill="#FAF7F2">
              <circle cx="65" cy="145" r="2" fillOpacity="0.35" />
              <circle cx="480" cy="65" r="2.2" fillOpacity="0.4" />
              <circle cx="515" cy="165" r="1.8" fillOpacity="0.35" />
              <circle cx="85" cy="365" r="2" fillOpacity="0.3" />
              <circle cx="290" cy="540" r="1.6" fillOpacity="0.35" />
            </g>

            <g fill="#FCD34D">
              <circle cx="385" cy="82" r="2.2" fillOpacity="0.55" />
              <circle cx="465" cy="245" r="2" fillOpacity="0.5" />
              <circle cx="340" cy="445" r="2.4" fillOpacity="0.6" />
            </g>

            {/* Animated aroma & steam paths */}
            <path
              className="animate-steam"
              d={`M 428,495
                 C 395,435 455,375 495,325
                 C 535,275 510,190 565,120
                 L 615,155
                 C 565,225 575,305 530,360
                 C 485,415 465,460 455,500 Z`}
              fill="url(#aromaWispGrad)"
            />
            <path
              d={`M 455,505
                 C 485,455 525,425 555,375
                 C 585,325 565,255 605,205
                 L 635,245
                 C 595,305 605,365 565,420
                 C 525,475 495,495 470,512 Z`}
              fill="url(#aromaWispGrad)"
            />

            {/* Layer 1: Sage Steam Divider */}
            <path
              className="animate-steam"
              d={`M 565,0
                 C 520,38 538,95 575,128
                 C 528,165 532,235 578,272
                 C 522,315 518,388 565,432
                 C 508,468 478,522 512,568
                 C 475,595 482,625 505,640
                 L 1100,640 L 1100,0 Z`}
              fill="url(#sageSteamGrad)"
            />

            {/* Floating aroma bubbles along divider */}
            <circle cx="532" cy="75" r="11" fill="#D8E2DC" fillOpacity="0.38" className="animate-aroma" />
            <circle cx="522" cy="202" r="15" fill="#FAF7F2" fillOpacity="0.32" className="animate-cup-float" />
            <circle cx="512" cy="355" r="18" fill="#FAF7F2" fillOpacity="0.38" className="animate-aroma" />
            <circle cx="482" cy="402" r="9" fill="#D8E2DC" fillOpacity="0.45" />
            <circle cx="478" cy="592" r="13" fill="#FAF7F2" fillOpacity="0.35" />

            {/* Layer 2: Cream Foam Divider */}
            <path
              d={`M 592,0
                 C 548,40 562,96 598,130
                 C 552,168 558,238 602,275
                 C 548,318 545,390 590,435
                 C 535,472 508,526 540,572
                 C 505,598 512,626 532,640
                 L 1100,640 L 1100,0 Z`}
              fill="url(#creamFoamGrad)"
            />

            {/* Layer 3: Solid Warm Cream Front Wave Divider */}
            <path
              filter="url(#waveShadow3D)"
              d={`M 615,0
                 C 572,42 585,98 620,132
                 C 575,170 582,240 624,278
                 C 572,320 570,392 612,438
                 C 560,476 535,530 565,575
                 C 532,600 538,628 556,640
                 L 1100,640 L 1100,0 Z`}
              fill="#FAF7F2"
            />

            {/* 3D Ceramic Coffee / Matcha Cup on Wooden Coaster */}
            <g className="animate-cup-float" filter="url(#cupShadow3D)" transform="translate(435, 535)">
              <ellipse cx="0" cy="36" rx="58" ry="14" fill="url(#woodCoasterGrad)" />
              <ellipse cx="0" cy="33" rx="52" ry="11" fill="#E9C39B" fillOpacity="0.55" />
              <path
                d="M 38,-6 C 58,-6 58,22 34,24"
                fill="none"
                stroke="#EAE5DC"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d={`M -44,-16
                   C -44,24 -26,35 0,35
                   C 26,35 44,24 44,-16
                   Z`}
                fill="url(#ceramicCupGrad)"
              />
              <path
                d={`M -43,-12
                   Q -22,-2 0,-8
                   T 43,-10
                   L 44,-16 L -44,-16 Z`}
                fill="#4E7A63"
                fillOpacity="0.45"
              />
              <ellipse cx="0" cy="-16" rx="44" ry="13" fill="#FFFFFF" />
              <ellipse cx="0" cy="-16" rx="40" ry="11" fill="url(#matchaLiquidGrad)" />
              {/* Latte art heart */}
              <path
                d={`M 0,-12
                   C -8,-18 -16,-14 -10,-9
                   C -6,-6 0,-4 0,-4
                   C 0,-4 6,-6 10,-9
                   C 16,-14 8,-18 0,-12 Z`}
                fill="#FAF7F2"
                fillOpacity="0.92"
              />
              <ellipse cx="-18" cy="-17" rx="4" ry="2" fill="#FAF7F2" fillOpacity="0.6" />
              {/* Fresh tea leaf garnish */}
              <path
                d="M -50,28 C -64,20 -66,8 -52,12 C -42,15 -42,25 -50,28 Z"
                fill="#68A385"
              />
              <path
                d="M -46,30 C -54,28 -60,22 -56,16"
                stroke="#365C4A"
                strokeWidth="1.2"
                fill="none"
              />
            </g>
          </svg>
        </div>

        {/* =========================================================================
            LEFT COLUMN (52% width): BRANDING & FLOATING GLASS FEATURE CARDS
           ========================================================================= */}
        <div className="relative z-20 w-[52%] h-full px-12 py-10 flex flex-col justify-between">
          
          {/* Top Brand Pill & Headings */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/14 backdrop-blur-md border border-white/30 shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
              <span className="text-base leading-none">🍵</span>
              <span className="font-body text-xs font-semibold tracking-wider uppercase text-[#F2F7F4]">
                Study Café & Peer Learning
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6A15C]" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-[48px] font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_6px_18px_rgba(14,29,21,0.32)]">
                StudyMatch
              </h1>
              <p className="font-body text-[15px] text-[#E6F0EA]/95 font-medium leading-relaxed max-w-[420px]">
                “Một góc học tập ấm áp, một người bạn đồng hành phù hợp”
              </p>
            </div>
          </div>

          {/* Interactive Floating Glass Feature Cards */}
          <div className="space-y-4 my-auto pr-10">
            
            {/* Feature Card 1 */}
            <div
              onClick={() => {
                setActiveFeature(1);
                showNotification('Ghép đôi 1-1: Đã tìm thấy 18 bạn học cùng lịch rảnh & mục tiêu giải đề! 🤝✨');
              }}
              className={`glass-feature-card animate-card-float-1 rounded-2xl p-4 transition-all duration-300 cursor-pointer group max-w-[410px] ${
                activeFeature === 1 ? 'ring-2 ring-amber-300/60' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/18 border border-white/35 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-[#E8F8F0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-[15px] text-white flex items-center gap-1.5">
                      <span>Ghép đôi thông minh 1-1</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#FCD34D] shrink-0" />
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-[#E8F8F0] border border-white/20">
                      AI Match
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#DFECE5]/90 leading-relaxed mt-1">
                    Đồng bộ lịch rảnh tự động, tìm cạ cứng cùng chuyên ngành để luyện giải đề & ôn thi hiệu quả.
                  </p>
                  <div className="flex items-center gap-3 mt-2.5 text-[11px] text-[#CBE2D6] font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#FCD34D]" /> Khớp lịch rảnh 98%
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#A7F3D0]" /> 45+ Đại học
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div
              onClick={() => {
                setActiveFeature(2);
                showNotification('Phòng học Pomodoro: Đang phát nhạc Matcha Lofi Chill cùng 340 sinh viên! 🎧🍵');
              }}
              className={`glass-feature-card animate-card-float-2 rounded-2xl p-4 transition-all duration-300 cursor-pointer group max-w-[395px] ml-4 ${
                activeFeature === 2 ? 'ring-2 ring-amber-300/60' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#E6A15C]/25 border border-[#FCD34D]/40 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5 text-[#FDE68A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-[15px] text-white">
                      Phòng học Pomodoro chung
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-200 border border-amber-300/35">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
                      LOFI LIVE
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#DFECE5]/90 leading-relaxed mt-1">
                    Chu kỳ tập trung 25/5 phút kết hợp âm thanh quán cà phê mưa rơi & nhạc lofi thư giãn.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Left Footer Tagline */}
          <div className="flex items-center gap-2.5 pt-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E0B] shadow-[0_0_10px_#F59E0B]" />
            </span>
            <span className="font-body text-xs font-medium text-[#EBF5EE]/95 tracking-wide drop-shadow-xs">
              Không gian học tập hàng đầu cho sinh viên Việt Nam
            </span>
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN (48% width): WARM CREAM FORM WITH 3D PILL BUTTONS
           ========================================================================= */}
        <div className="relative z-20 w-[48%] h-full pl-12 pr-14 py-12 flex flex-col justify-between items-center">
          
          {/* Top Right Term Pill Badge */}
          <div className="w-full flex justify-end">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFECE3] border border-[#E2DDD2] text-[11px] font-medium text-[#5A7063]">
              <span>✨</span>
              <span>Học kỳ Mới • Matcha Vibe</span>
            </div>
          </div>

          {/* Center Form Section */}
          <div className="w-full max-w-[350px] my-auto space-y-6">
            
            {/* Header Titles */}
            <div className="text-center space-y-1.5">
              <h2 className="font-display text-[28px] font-extrabold tracking-[0.14em] text-[#2C4A3C] uppercase">
                USER LOGIN
              </h2>
              <p className="font-body text-sm text-[#76897E] font-medium tracking-wide">
                Welcome to the website
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              
              {/* Recessed Pill Input: Email */}
              <div className="pill-input-recessed rounded-full px-4 py-3.5 flex items-center gap-3.5 transition-all duration-200 border border-[#E2DED3]">
                <div className="w-7 h-7 rounded-full bg-white text-[#365C4A] flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-3.5 h-3.5 stroke-[2.3]" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email sinh viên / Hồ sơ học tập"
                  className="w-full bg-transparent text-[#253D31] placeholder-[#8A9990] text-[13.5px] font-medium focus:outline-none font-body"
                />
              </div>

              {/* Recessed Pill Input: Password */}
              <div className="pill-input-recessed rounded-full px-4 py-3.5 flex items-center gap-3.5 transition-all duration-200 border border-[#E2DED3]">
                <div className="w-7 h-7 rounded-full bg-white text-[#365C4A] flex items-center justify-center shrink-0 shadow-xs">
                  <Lock className="w-3.5 h-3.5 stroke-[2.3]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="w-full bg-transparent text-[#253D31] placeholder-[#8A9990] text-[13.5px] font-medium focus:outline-none font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#7E9086] hover:text-[#365C4A] transition-colors focus:outline-none cursor-pointer pr-1"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between px-1.5 pt-0.5 text-xs font-body">
                <label
                  onClick={() => setRemember(!remember)}
                  className="inline-flex items-center gap-2 cursor-pointer select-none text-[#5F7368] hover:text-[#2C4A3C] transition-colors"
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                      remember ? 'bg-[#365C4A] text-white shadow-xs' : 'bg-[#E6E2D8] border border-[#C5C0B4] text-transparent'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span className="font-semibold">Remember</span>
                </label>

                <button
                  type="button"
                  onClick={() => showNotification('Đã gửi hướng dẫn đặt lại mật khẩu vào hộp thư sinh viên của bạn! 📩')}
                  className="font-semibold text-[#6A7E73] hover:text-[#365C4A] hover:underline transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Action Button: LOGIN WITH GOOGLE (With Google multi-color G logo & arrow) */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                  className="matcha-cta-button w-full rounded-2xl p-2 pr-5 flex items-center justify-between text-white font-display font-bold text-[13px] tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer group disabled:opacity-70"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                      />
                    </svg>
                  </div>
                  <span className="flex-1 text-center">
                    {isLoading ? 'ĐANG KẾT NỐI...' : 'LOGIN WITH GOOGLE'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#CBE4D6] opacity-85 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>

            {/* Optional Form Login direct trigger */}
            {email.trim() && (
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="text-xs text-[#365C4A] hover:underline font-bold"
                >
                  Hoặc đăng nhập trực tiếp với mật khẩu →
                </button>
              </div>
            )}

          </div>

          {/* Bottom Link: Create Account */}
          <div className="w-full text-center pb-1">
            <button
              type="button"
              onClick={() => setIsRegisterModal(true)}
              className="font-body text-[13px] font-semibold text-[#54695D] hover:text-[#2C4A3C] border-b border-dotted border-[#54695D] hover:border-[#2C4A3C] pb-0.5 transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================================
          CREATE ACCOUNT MODAL (Matching exact embedded popup)
         ========================================================================= */}
      {isRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border border-white/80 rounded-3xl max-w-md w-full p-7 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🍵</span>
                <h3 className="font-display font-bold text-lg text-[#264235]">
                  Tạo hồ sơ học tập StudyMatch
                </h3>
              </div>
              <button
                onClick={() => setIsRegisterModal(false)}
                className="p-1 rounded-full text-[#4E6157] hover:bg-[#E2DFD5] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-body text-xs text-[#5E7368] leading-relaxed">
              Đăng ký nhanh bằng email sinh viên (<span className="font-semibold text-[#365C4A]">@edu.vn</span>) hoặc tài khoản Google để tìm bạn đồng hành học tập & tham gia phòng Pomodoro Lofi!
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 pt-1">
              <div className="pill-input-recessed rounded-full px-4 py-3 flex items-center gap-3 border border-[#E2DED3]">
                <Users className="w-4 h-4 text-[#365C4A]" />
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Họ và tên hoặc biệt danh của bạn..."
                  className="w-full bg-transparent text-xs text-[#23382E] focus:outline-none font-body"
                />
              </div>

              <div className="pill-input-recessed rounded-full px-4 py-3 flex items-center gap-3 border border-[#E2DED3]">
                <Mail className="w-4 h-4 text-[#365C4A]" />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="Nhập email của bạn (ví dụ: student@hust.edu.vn)..."
                  required
                  className="w-full bg-transparent text-xs text-[#23382E] focus:outline-none font-body"
                />
              </div>

              <button
                type="submit"
                className="matcha-cta-button w-full py-3.5 rounded-2xl text-white font-display font-bold text-xs tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Gửi mã xác thực về Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EMAIL VERIFICATION OTP & MAGIC LINK MODAL
         ========================================================================= */}
      {isOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border border-white/90 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#365C4A]/10 border border-[#365C4A]/20 flex items-center justify-center text-[#365C4A]">
                  <MailCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#365C4A]/10 text-[#365C4A]">
                    Bảo mật danh tính sinh viên
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#264235] mt-1">
                    Xác Thực Email Học Tập
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOtpModal(false)}
                className="p-1 rounded-full text-[#4E6157] hover:bg-[#E2DFD5] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction description */}
            <div className="space-y-1">
              <p className="font-body text-xs text-[#5E7368] leading-relaxed">
                Mã xác thực gồm <strong>6 chữ số</strong> đã được gửi tới địa chỉ email:
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#365C4A]/20 text-xs font-bold text-[#365C4A]">
                <Mail className="w-3.5 h-3.5" />
                <span>{otpEmail}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpModal(false);
                    setIsRegisterModal(true);
                  }}
                  className="text-[11px] font-medium text-[#D89C57] hover:underline ml-1"
                >
                  (Đổi)
                </button>
              </div>
            </div>

            {/* 6-Digit OTP Box Grid */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-[#365C4A] uppercase tracking-wider">
                Nhập mã OTP 6 số:
              </label>
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-digit-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleDigitPaste : undefined}
                    className="h-14 rounded-2xl bg-[#EFECE3] border border-[#365C4A]/25 text-center text-2xl font-black font-mono text-[#365C4A] focus:outline-none focus:ring-2 focus:ring-[#365C4A] shadow-inner transition-all"
                  />
                ))}
              </div>
              <p className="text-[10px] text-[#553F35]/65 font-medium">
                💡 Mẹo: Bạn có thể copy mã 6 số và dán (Ctrl+V) thẳng vào ô đầu tiên.
              </p>
            </div>

            {/* Verification Action Button */}
            <button
              type="button"
              onClick={() => handleVerifyOtpSubmit()}
              disabled={isLoading || otpDigits.join('').length < 6}
              className={`matcha-cta-button w-full py-3.5 rounded-2xl text-white font-display font-bold text-xs tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                otpDigits.join('').length < 6 ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang kiểm tra mã...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Thực & Kích Hoạt Tài Khoản</span>
                </>
              )}
            </button>

            {/* Resend Cooldown and Action */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#365C4A]/10 font-body">
              <span className="text-[#5E7368]">Chưa nhận được mã OTP?</span>
              {resendCooldown > 0 ? (
                <span className="font-semibold text-[#553F35]/70 flex items-center gap-1.5 font-mono">
                  <RefreshCw className="w-3 h-3 animate-spin text-[#D89C57]" />
                  Gửi lại sau {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-bold text-[#365C4A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Gửi lại mã OTP</span>
                </button>
              )}
            </div>

            {/* Simulated Mailbox Preview (Hộp thư đến giả lập để trải nghiệm thực tế ngay lập tức) */}
            {simulatedEmail && (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 space-y-3 text-xs text-[#264235]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <span className="text-base">📬</span>
                    <span>Hộp thư sinh viên (Bản xem trước thư vừa gửi tới)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSimulatedInbox(!showSimulatedInbox)}
                    className="text-emerald-700 hover:text-emerald-900 text-[11px] font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    {showSimulatedInbox ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showSimulatedInbox && (
                  <div className="space-y-3 pt-1 border-t border-emerald-200">
                    <div className="space-y-1 text-[11px]">
                      <div><strong>Người gửi:</strong> {simulatedEmail.sender}</div>
                      <div><strong>Tiêu đề:</strong> {simulatedEmail.subject}</div>
                      <div><strong>Thời gian:</strong> {simulatedEmail.sentAt}</div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center space-y-2 shadow-sm">
                      <div className="text-[11px] text-[#553F35]/80 font-medium">
                        Mã OTP xác nhận quyền sở hữu email của bạn:
                      </div>
                      <div className="text-3xl font-black font-mono tracking-widest text-[#365C4A] bg-[#FAF7F2] py-2 rounded-lg border border-[#365C4A]/20">
                        {simulatedEmail.otp}
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const digits = simulatedEmail.otp.split('');
                            setOtpDigits(digits);
                            handleVerifyOtpSubmit(simulatedEmail.otp);
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#365C4A] hover:bg-[#2A4839] text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Điền & Xác thực nhanh</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const match = simulatedEmail.magicLink.match(/verify_token=([^&]+)/);
                            if (match && match[1]) {
                              handleMagicLinkClick(match[1]);
                            }
                          }}
                          className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-100 text-[#365C4A] border border-[#365C4A]/30 text-[11px] font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Bấm Link xác thực (Magic Link)</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-emerald-800/80 leading-relaxed italic">
                      * Lưu ý: Trong môi trường triển khai thực tế (Production), bức thư này được gửi thẳng từ máy chủ email Supabase/SMTP vào Inbox hoặc thư mục Spam của email sinh viên.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
