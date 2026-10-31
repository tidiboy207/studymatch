import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { RoleSwitcher } from './RoleSwitcher';
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
  onSwitchRole: (role: 'A' | 'B') => void;
  isSupabaseLive: boolean;
  onOpenProfile: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onSwitchRole,
  isSupabaseLive,
  onOpenProfile,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: Compass },
    { id: 'matching', label: 'Tìm bạn học', icon: Users, badge: 'Smart' },
    { id: 'resources', label: 'Thư viện môn', icon: BookOpen, badge: '15+' },
    { id: 'studyroom', label: 'Phòng học P2P', icon: Video, badge: 'Live' },
    { id: 'pricing', label: 'Tiến độ & Gói', icon: BarChart3 },
    { id: 'profile', label: 'Hồ sơ học tập', icon: User, badge: 'Mới' },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#14221B]/95 backdrop-blur-xl border-b border-[#365C4A]/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#365C4A] via-[#A7B99A] to-[#D89C57] p-0.5 shadow-lg shadow-[#365C4A]/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#14221B] rounded-[10px] flex items-center justify-center">
                <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#A7B99A] to-[#D89C57]">
                  SM
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">StudyMatch</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-[#A7B99A]/20 text-[#A7B99A] border border-[#A7B99A]/30">
                  MATCHA
                </span>
              </div>
              <p className="text-[11px] text-[#A7B99A]/80 hidden sm:block">Study Café & Peer Learning</p>
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
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-[#365C4A] text-white border border-[#A7B99A]/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#A7B99A]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      item.id === 'studyroom'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : item.id === 'profile'
                        ? 'bg-[#D89C57] text-[#14221B] font-black'
                        : 'bg-white/10 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Area: Role Switcher & User Badge & Logout */}
          <div className="flex items-center gap-2.5">
            <RoleSwitcher
              currentUser={currentUser}
              onSwitchRole={onSwitchRole}
              isSupabaseLive={isSupabaseLive}
            />

            {/* User Profile Pill */}
            <div
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1b2f25] border border-[#365C4A]/60 hover:border-[#A7B99A] cursor-pointer transition-all"
              title="Bấm để xem và chỉnh sửa Hồ sơ cá nhân"
            >
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.display_name}
                  className="w-7 h-7 rounded-full object-cover border border-[#A7B99A]/50"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#365C4A] to-[#A7B99A] flex items-center justify-center text-xs font-bold text-white shadow">
                  {currentUser.display_name.charAt(0)}
                </div>
              )}

              <div className="hidden xl:block text-left text-xs">
                <div className="flex items-center gap-1 font-semibold text-slate-200">
                  <span className="truncate max-w-[100px]">{currentUser.display_name}</span>
                  {currentUser.is_edu_verified ? (
                    <span title="Đã xác thực Sinh viên (.edu.vn)">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </span>
                  ) : (
                    <span title="Tài khoản Trải nghiệm">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="flex items-center text-amber-400">
                    <Flame className="w-3 h-3 mr-0.5 fill-amber-400" />
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
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/30"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#1b2f25] border border-[#365C4A]/50 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#365C4A]/40 bg-[#14221B] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-[#365C4A] text-white border border-[#A7B99A]/40'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#A7B99A]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-semibold">
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
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
