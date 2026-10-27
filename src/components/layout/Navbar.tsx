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
  Wallet,
  ShieldCheck,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  UserCheck
} from 'lucide-react';

export type NavTab = 'dashboard' | 'matching' | 'resources' | 'studyroom' | 'pricing';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  onSwitchRole: (role: 'A' | 'B') => void;
  isSupabaseLive: boolean;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onSwitchRole,
  isSupabaseLive,
  onOpenProfile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: Compass },
    { id: 'matching', label: 'Tìm bạn học', icon: Users, badge: 'Smart' },
    { id: 'resources', label: 'Thư viện môn', icon: BookOpen, badge: '15+' },
    { id: 'studyroom', label: 'Phòng học P2P', icon: Video, badge: 'Live' },
    { id: 'pricing', label: 'Tiến độ & Gói', icon: BarChart3 },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                  SM
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">StudyMatch</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Ghép đôi bạn học & Phòng học kỷ luật</p>
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1 py-0.2 rounded font-semibold ${
                      item.id === 'studyroom'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Area: Role Switcher & User Badge */}
          <div className="flex items-center gap-2.5">
            <RoleSwitcher
              currentUser={currentUser}
              onSwitchRole={onSwitchRole}
              isSupabaseLive={isSupabaseLive}
            />

            {/* User Profile Pill */}
            <div
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
              title="Bấm để xem/chỉnh sửa nhanh hồ sơ học tập"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
                {currentUser.display_name.charAt(0)}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <div className="flex items-center gap-1 font-semibold text-slate-200">
                  <span className="truncate max-w-[110px]">{currentUser.display_name}</span>
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
                  <span className="text-emerald-400 font-mono">
                    {currentUser.commitment_deposit.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
