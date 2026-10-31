import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Users, Headphones, GraduationCap, Calendar, Check, AlertCircle } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { UserProfile } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('duccoi4321@gmail.com');
  const [password, setPassword] = useState('123456');
  const [displayName, setDisplayName] = useState('Đức Còi');
  const [university, setUniversity] = useState('Đại học Bách khoa Hà Nội (HUST)');
  const [major, setMajor] = useState('Khoa học máy tính (Computer Science)');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Xử lý đăng nhập Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await dataService.loginWithGoogle();
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Đăng nhập Google thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng nhập email hoặc tạo tài khoản
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Vui lòng nhập địa chỉ email');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (isRegisterMode) {
        const res = await dataService.registerWithEmail(email, displayName, university, major);
        if (res.success) {
          onLoginSuccess(res.user);
        }
      } else {
        const res = await dataService.loginWithCredentials(email, password);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra trong quá trình xử lý');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#EBE8DF] via-[#F3F0E6] to-[#F8F5EE] relative overflow-hidden font-sans select-none">
      
      {/* Background Ambient Decorative Circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#A7B99A]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-96 h-96 rounded-full bg-[#D89C57]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-48 h-48 rounded-full bg-[#365C4A]/10 blur-2xl pointer-events-none" />

      {/* Main Login Card (Match reference 100%) */}
      <div className="max-w-5xl w-full rounded-[28px] shadow-[0_25px_60px_-15px_rgba(54,92,74,0.35)] overflow-hidden bg-white relative flex flex-col md:flex-row border border-[#DCD6C8]/70 z-10">
        
        {/* Floating Coffee Cup Illustration peeking at top-left */}
        <div className="absolute -top-3.5 left-8 z-30 pointer-events-none hidden sm:block">
          <div className="relative">
            {/* Cup Body */}
            <div className="w-11 h-8 bg-[#F8F5EE] border-2 border-[#365C4A]/30 rounded-b-xl shadow-md flex items-center justify-center">
              {/* Coffee liquid */}
              <div className="w-7 h-4 bg-[#553F35] rounded-b-lg opacity-85" />
            </div>
            {/* Cup Handle */}
            <div className="absolute top-1 -right-2.5 w-3.5 h-4 border-2 border-[#365C4A]/30 rounded-r-full" />
            {/* Steam lines */}
            <div className="absolute -top-3 left-2.5 flex gap-1">
              <span className="w-0.5 h-2.5 bg-[#A7B99A] rounded-full animate-pulse opacity-70" />
              <span className="w-0.5 h-3.5 bg-[#D89C57] rounded-full animate-pulse delay-100 opacity-80" />
              <span className="w-0.5 h-2.5 bg-[#A7B99A] rounded-full animate-pulse delay-200 opacity-70" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            CỘT BÊN TRÁI: DEEP FOREST GREEN #365C4A + HIỆU ỨNG ĐỐM SÁNG VÀNG ẤM
           ========================================================================= */}
        <div className="md:w-1/2 p-7 sm:p-10 lg:p-11 bg-gradient-to-br from-[#365C4A] via-[#2F5242] to-[#254235] text-white relative flex flex-col justify-between overflow-hidden">
          
          {/* Subtle warm golden ambient dots */}
          <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-[#D89C57]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-10 left-6 w-28 h-28 bg-[#A7B99A]/20 rounded-full blur-xl pointer-events-none" />

          {/* Top Area: Badge & Brand Header */}
          <div className="relative z-10">
            {/* Badge: ☕ STUDY CAFÉ & PEER LEARNING • */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold tracking-wide text-white/95 shadow-sm">
              <span>☕ STUDY CAFÉ & PEER LEARNING</span>
              <span className="w-2 h-2 rounded-full bg-[#D89C57] ml-0.5 inline-block" />
            </div>

            {/* Brand Title: StudyMatch */}
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-5 drop-shadow-sm font-sans">
              StudyMatch
            </h1>

            {/* Sub-quote */}
            <p className="text-sm sm:text-base text-[#F8F5EE]/90 italic font-light mt-1.5 tracking-wide">
              “Một góc học tập ấm áp, một người bạn đồng hành phù hợp”
            </p>
          </div>

          {/* Center Area: 2 Glassmorphism Feature Cards */}
          <div className="relative z-10 my-7 space-y-3.5">
            
            {/* Feature Card 1: Ghép đôi thông minh 1-1 */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-lg transition-transform hover:-translate-y-0.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0 text-white">
                  <Users className="w-5 h-5 text-[#C3D4B7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Ghép đôi thông minh 1-1 ✨
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold tracking-wider text-white border border-white/20 shrink-0">
                      AI MATCH
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
                    Đồng bộ lịch rảnh tự động, tìm ca cùng chuyên ngành để luyện giải đề & ôn thi hiệu quả.
                  </p>
                  
                  {/* Metric chips */}
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-4 text-[11px] text-[#FAEFDF] font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D89C57]" />
                      Khớp lịch rảnh 98%
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#D89C57]" />
                      45+ Đại học
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2: Phòng học Pomodoro chung */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-lg transition-transform hover:-translate-y-0.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D89C57]/25 border border-[#D89C57]/40 flex items-center justify-center shrink-0 text-[#D89C57]">
                  <Headphones className="w-5 h-5 text-[#D89C57]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">
                      Phòng học Pomodoro chung
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#D89C57] text-[#254235] text-[10px] font-extrabold tracking-wider shrink-0 shadow-sm">
                      LOFI LIVE
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
                    Chu kỳ tập trung 25/5 phút kết hợp âm thanh quán cà phê mưa rơi & nhạc lofi thư giãn.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Left Footer Note */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-white/85 pt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D89C57] shrink-0 animate-pulse" />
            <span>Không gian học tập hàng đầu cho sinh viên Việt Nam</span>
          </div>

        </div>

        {/* =========================================================================
            MULTI-LAYERED ORGANIC WAVY SVG DIVIDER (Ngăn cách 2 cột)
           ========================================================================= */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -ml-6 w-12 z-20 pointer-events-none">
          <svg
            className="w-full h-full text-[#F8F5EE] fill-current"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            {/* Layer 1 - Matcha soft wave shadow */}
            <path
              d="M0,0 C30,150 15,350 45,500 C75,650 30,850 60,1000 L100,1000 L100,0 Z"
              fill="#A7B99A"
              fillOpacity="0.25"
            />
            {/* Layer 2 - Cream dark soft wave */}
            <path
              d="M15,0 C45,180 25,380 55,520 C85,670 40,860 70,1000 L100,1000 L100,0 Z"
              fill="#EBE8DF"
            />
            {/* Layer 3 - Warm Cream main front wave */}
            <path
              d="M30,0 C65,190 35,400 70,540 C100,680 50,880 85,1000 L100,1000 L100,0 Z"
              fill="#F8F5EE"
            />
          </svg>
        </div>

        {/* =========================================================================
            CỘT BÊN PHẢI: WARM CREAM #F8F5EE + FORM ĐĂNG NHẬP CHUẨN MẪU
           ========================================================================= */}
        <div className="md:w-1/2 p-7 sm:p-10 lg:p-12 bg-[#F8F5EE] text-[#553F35] flex flex-col justify-between relative z-10">
          
          {/* Top Right Badge */}
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE8DF] border border-[#D89C57]/40 text-xs font-semibold text-[#553F35] shadow-sm">
              <span>✨ Học kỳ Mới • Matcha Vibe</span>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="my-auto py-4 max-w-sm w-full mx-auto">
            
            {/* Title Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-[#365C4A] tracking-wider uppercase">
                {isRegisterMode ? 'CREATE ACCOUNT' : 'USER LOGIN'}
              </h2>
              <p className="text-xs text-[#553F35]/75 mt-1 font-medium">
                {isRegisterMode ? 'Bắt đầu hành trình tìm bạn học ăn ý' : 'Welcome to the website'}
              </p>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isRegisterMode && (
                <>
                  {/* Họ tên */}
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Họ và tên hoặc biệt danh"
                      className="w-full px-5 py-3 rounded-full bg-white border border-[#365C4A]/25 text-[#365C4A] placeholder-[#553F35]/40 text-xs sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30 focus:border-[#365C4A] transition-all"
                    />
                  </div>
                  {/* Trường */}
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={university}
                      onChange={e => setUniversity(e.target.value)}
                      placeholder="Trường Đại học (VD: HUST, FTU, NEU...)"
                      className="w-full px-5 py-3 rounded-full bg-white border border-[#365C4A]/25 text-[#365C4A] placeholder-[#553F35]/40 text-xs sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30 focus:border-[#365C4A] transition-all"
                    />
                  </div>
                  {/* Ngành */}
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={major}
                      onChange={e => setMajor(e.target.value)}
                      placeholder="Ngành học (VD: Data Science & AI)"
                      className="w-full px-5 py-3 rounded-full bg-white border border-[#365C4A]/25 text-[#365C4A] placeholder-[#553F35]/40 text-xs sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30 focus:border-[#365C4A] transition-all"
                    />
                  </div>
                </>
              )}

              {/* Ô nhập Email: Pill shape rounded-full, Mail icon */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#365C4A]/70 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="duccoi4321@gmail.com"
                  className="w-full pl-11 pr-5 py-3 rounded-full bg-white border border-[#365C4A]/25 text-[#365C4A] font-medium placeholder-[#553F35]/40 text-xs sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30 focus:border-[#365C4A] transition-all"
                />
              </div>

              {/* Ô nhập Mật khẩu: Pill shape rounded-full, Lock icon, Eye toggle */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#365C4A]/70 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="w-full pl-11 pr-11 py-3 rounded-full bg-white border border-[#365C4A]/25 text-[#365C4A] placeholder-[#553F35]/40 text-xs sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#365C4A]/30 focus:border-[#365C4A] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#365C4A]/60 hover:text-[#365C4A] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Utilities row: Remember & Forgot password */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#553F35]/90 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-full text-[#365C4A] border-gray-300 focus:ring-[#365C4A] accent-[#365C4A]"
                  />
                  <span>Remember</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Vui lòng dùng tài khoản demo hoặc đăng nhập bằng Google OAuth!'); }}
                  className="text-[#553F35]/80 hover:text-[#365C4A] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Nút Đăng nhập bằng Form (Tùy chọn) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-[#365C4A]/10 hover:bg-[#365C4A]/20 text-[#365C4A] text-xs font-bold transition-all border border-[#365C4A]/20"
              >
                {isLoading ? 'Đang xử lý...' : (isRegisterMode ? 'Tạo Tài Khoản Mới' : 'Đăng nhập với Email')}
              </button>

              {/* Divider Or */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#365C4A]/15 w-full" />
                <span className="bg-[#F8F5EE] px-2 text-[11px] text-[#553F35]/60 uppercase font-semibold">hoặc</span>
                <div className="border-t border-[#365C4A]/15 w-full" />
              </div>

              {/* Nút hành động chính chuẩn mẫu: LOGIN WITH GOOGLE (Pill shape, Deep Forest Green #365C4A, Google logo circle, text, arrow) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3 px-3 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] active:scale-[0.99] text-white shadow-xl shadow-[#365C4A]/25 transition-all flex items-center justify-between group"
              >
                {/* Google Logo in White Circle */}
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>

                {/* Text Centered */}
                <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white uppercase text-center flex-1">
                  LOGIN WITH GOOGLE
                </span>

                {/* Right Arrow */}
                <div className="w-8 h-8 flex items-center justify-center text-white/80 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

            </form>

            {/* Switch Mode: Create Account */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMsg(null);
                }}
                className="text-xs font-semibold text-[#365C4A] hover:text-[#254235] underline decoration-[#365C4A]/40 underline-offset-4 transition-colors"
              >
                {isRegisterMode ? 'Already have an account? Login' : 'Create Account'}
              </button>
            </div>

          </div>

          {/* Right Bottom Footer Microcopy */}
          <div className="text-center text-[11px] text-[#553F35]/60 pt-2">
            Matcha Vibe Edition • Bản quyền StudyMatch 2026
          </div>

        </div>

      </div>

    </div>
  );
};
