import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  BookOpen,
  Users,
  Compass,
  Video,
  BarChart3,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';

export type NavTab = 'dashboard' | 'matching' | 'resources' | 'studyroom' | 'pricing' | 'profile';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  isSupabaseLive: boolean;
  onOpenProfile: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  isSupabaseLive,
  onOpenProfile,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: Compass },
    { id: 'matching', label: 'Tìm bạn học', icon: Users, badge: 'Smart' },
    { id: 'resources', label: 'Thư viện môn', icon: BookOpen, badge: '15+' },
    { id: 'studyroom', label: 'Phòng Pomodoro', icon: Video, badge: 'Live' },
    { id: 'pricing', label: 'Tiến độ & Gói', icon: BarChart3 },
    { id: 'profile', label: 'Hồ sơ học tập', icon: User },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#365C4A] text-white shadow-md border-b border-[#2B4A3B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 p-0.5 shadow-md flex items-center justify-center">
              <span className="font-black text-lg tracking-wider text-white">
                SM
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-white font-sans">StudyMatch</span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-[#A7B99A]/25 text-[#FAEFDF] border border-white/20">
                  MATCHA VIBE
                </span>
              </div>
              <p className="text-[11px] text-white/80 hidden sm:block">Study Café & Peer Learning</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-[#264234] text-white shadow-inner border border-white/15'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#A7B99A]' : 'text-white/80'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                      item.id === 'studyroom'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-white/20 text-[#FAEFDF]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Area: User Badge & Logout (No Demo Switcher) */}
          <div className="flex items-center gap-3">
            
            {/* User Profile Pill */}
            <div
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer transition-all shadow-sm"
              title="Bấm để xem và chỉnh sửa Hồ sơ cá nhân"
            >
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.display_name}
                  className="w-7 h-7 rounded-full object-cover border border-white shadow-sm"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#A7B99A] text-[#254235] flex items-center justify-center text-xs font-black shadow">
                  {currentUser.display_name.charAt(0)}
                </div>
              )}

              <div className="hidden xl:block text-left text-xs">
                <div className="flex items-center gap-1 font-bold text-white">
                  <span className="truncate max-w-[110px]">{currentUser.display_name}</span>
                  {currentUser.is_edu_verified && (
                    <span title="Sinh viên đã xác thực email trường">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#A7B99A] shrink-0" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/80">
                  <span className="flex items-center text-[#D89C57] font-bold">
                    <Flame className="w-3 h-3 mr-0.5 fill-[#D89C57]" />
                    {currentUser.streak_days}d
                  </span>
                  <span className="text-[#A7B99A] font-mono font-bold">
                    {currentUser.commitment_deposit.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/30 text-white/80 hover:text-white transition-colors border border-white/15"
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/15 bg-[#2B4A3B] px-4 pt-3 pb-5 space-y-1.5 animate-in slide-in-from-top">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-bold ${
                  isActive
                    ? 'bg-[#1E372C] text-white border border-white/20'
                    : 'text-white/85 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#A7B99A]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold text-rose-200 hover:bg-rose-500/20 pt-2 border-t border-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất khỏi hệ thống</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
