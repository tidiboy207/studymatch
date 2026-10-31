import React, { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  StudySession,
  MatchCandidate,
  MatchRequest,
  ResourceItem,
  MatchingWeights,
  PaymentEvent
} from './types';
import { dataService } from './services/dataService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { DEFAULT_WEIGHTS } from './services/matchingEngine';

// Components
import { Navbar, NavTab } from './components/layout/Navbar';
import { Toast, ToastMessage } from './components/layout/Toast';
import { LoginPage } from './components/auth/LoginPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { ProfilePage } from './components/profile/ProfilePage';
import { PublicProfileModal } from './components/profile/PublicProfileModal';

// Dashboard Components
import { HeroTodayCard } from './components/dashboard/HeroTodayCard';
import { StreakFundBadge } from './components/dashboard/StreakFundBadge';
import { PendingInvites } from './components/dashboard/PendingInvites';

// Matching Components
import { WeightSliders } from './components/matching/WeightSliders';
import { CandidateCard } from './components/matching/CandidateCard';
import { ReportBlockModal } from './components/matching/ReportBlockModal';
import { UpgradeLimitModal } from './components/matching/UpgradeLimitModal';

// Resource Components
import { ResourceFilter } from './components/resources/ResourceFilter';
import { ResourceCard } from './components/resources/ResourceCard';
import { ResourceDetailModal } from './components/resources/ResourceDetailModal';

// Study Room Component
import { StudyRoomScreen } from './components/studyroom/StudyRoomScreen';

// Pricing Components
import { PriceAnchoringBanner } from './components/pricing/PriceAnchoringBanner';
import { PricingTierCards } from './components/pricing/PricingTierCards';
import { PaymentQrModal } from './components/pricing/PaymentQrModal';
import { StartupMetricsModal } from './components/pricing/StartupMetricsModal';
import { PersonalStatsView } from './components/pricing/PersonalStatsView';

import { Sparkles, Users, BookOpen, Video, BarChart3, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  // Authentication & Onboarding state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => dataService.isUserLoggedIn());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isSupabaseLive] = useState<boolean>(isSupabaseConfigured());

  // Public Profile Modal State (khi bấm xem chi tiết bạn học từ Smart Match / Tin nhắn)
  const [selectedPublicProfile, setSelectedPublicProfile] = useState<UserProfile | null>(null);

  // Sessions & Invites
  const [upcomingSession, setUpcomingSession] = useState<StudySession | null>(null);
  const [allSessions, setAllSessions] = useState<StudySession[]>([]);
  const [pendingInvites, setPendingInvites] = useState<MatchRequest[]>([]);

  // Matching
  const [weights, setWeights] = useState<MatchingWeights>(DEFAULT_WEIGHTS);
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [sentInviteIds, setSentInviteIds] = useState<string[]>([]);
  const [selectedCandidateForSafety, setSelectedCandidateForSafety] = useState<MatchCandidate | null>(null);
  const [isUpgradeLimitModalOpen, setIsUpgradeLimitModalOpen] = useState(false);

  // Resources
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedResourceDetail, setSelectedResourceDetail] = useState<ResourceItem | null>(null);

  // Pricing & Metrics (29k / 59k)
  const [activePaymentEvent, setActivePaymentEvent] = useState<PaymentEvent | null>(null);
  const [isPaymentQrOpen, setIsPaymentQrOpen] = useState(false);
  const [isStartupMetricsOpen, setIsStartupMetricsOpen] = useState(false);
  const [startupMetrics, setStartupMetrics] = useState({
    totalClicks: 0,
    confirmedTransfers: 0,
    conversionRate: 0,
    totalRevenue: 0
  });
  const [paymentEvents, setPaymentEvents] = useState<PaymentEvent[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const user = await dataService.getCurrentUser();
      setCurrentUser(user);

      const [session, sessionsList, invites, resList, metrics, pEvents] = await Promise.all([
        dataService.getUpcomingSession(),
        dataService.getAllSessions(),
        dataService.getPendingInvites(),
        dataService.getResources(selectedSubject, selectedTopic, selectedType),
        dataService.getStartupMetrics(),
        dataService.getLocalPaymentEvents()
      ]);

      setUpcomingSession(session);
      setAllSessions(sessionsList);
      setPendingInvites(invites);
      setResources(resList);
      setStartupMetrics(metrics);
      setPaymentEvents(pEvents);
    } catch (err) {
      console.error('Error loading initial data', err);
    }
  }, [selectedSubject, selectedTopic, selectedType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load candidates when user or weights change
  useEffect(() => {
    if (currentUser) {
      dataService.getMatchingCandidates(weights).then(setCandidates);
    }
  }, [currentUser, weights]);

  // Login handler
  const handleLoginSuccess = async (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    addToast('success', `Chào mừng ${user.display_name} đến với StudyMatch Matcha Vibe!`);
    await loadData();
  };

  // Logout handler
  const handleLogout = async () => {
    await dataService.logout();
    setIsLoggedIn(false);
    addToast('info', 'Bạn đã đăng xuất khỏi hệ thống.');
  };

  // Onboarding complete handler
  const handleOnboardingComplete = async (updated: Partial<UserProfile>) => {
    const user = await dataService.updateProfile({ ...updated, is_onboarded: true });
    setCurrentUser(user);
    addToast('success', 'Thiết lập hồ sơ học tập thành công! Bạn đã sẵn sàng ghép đôi.');
    setCurrentTab('dashboard');
    await loadData();
  };


  // Profile Save
  const handleSaveProfile = async (updated: Partial<UserProfile>) => {
    const user = await dataService.updateProfile(updated);
    setCurrentUser(user);
    addToast('success', 'Đã cập nhật hồ sơ học tập và đồng bộ thuật toán ghép đôi!');
    const nextCandidates = await dataService.getMatchingCandidates(weights);
    setCandidates(nextCandidates);
  };

  // Top up deposit simulation
  const handleTopUpDeposit = async (amt: number) => {
    if (!currentUser) return;
    const user = await dataService.updateProfile({
      commitment_deposit: currentUser.commitment_deposit + amt
    });
    setCurrentUser(user);
    addToast('success', `Đã nạp thêm ${amt.toLocaleString()}đ vào Quỹ Cam Kết Kỷ Luật thành công!`);
  };

  // Matching actions
  const handleSendInvite = async (candidate: MatchCandidate) => {
    if (!currentUser) return;

    const result = await dataService.sendMatchInvite(
      candidate.profile.id,
      candidate.scoreDetails.totalScore,
      candidate.scoreDetails.reason
    );

    if (result.limitReached) {
      setIsUpgradeLimitModalOpen(true);
      return;
    }

    if (result.success) {
      setSentInviteIds(prev => [...prev, candidate.profile.id]);
      addToast(
        'success',
        `Đã gửi lời mời học cùng cho ${candidate.profile.display_name}! (Đã dùng ${currentUser.free_invites_used + 1}/3 lượt Free)`
      );
      const updatedUser = await dataService.getCurrentUser();
      setCurrentUser(updatedUser);
    } else if (result.error) {
      addToast('error', result.error);
    }
  };

  // Accept pending invite from dashboard
  const handleAcceptInvite = async (requestId: string) => {
    const newSession = await dataService.respondToInvite(requestId, true);
    if (newSession) {
      setUpcomingSession(newSession);
      addToast('success', 'Đã chấp nhận lời mời học cùng! Hệ thống đã tạo phiên học nháp.');
      setPendingInvites(prev => prev.filter(r => r.id !== requestId));
      setCurrentTab('studyroom');
    }
  };

  const handleRejectInvite = async (requestId: string) => {
    await dataService.respondToInvite(requestId, false);
    setPendingInvites(prev => prev.filter(r => r.id !== requestId));
    addToast('info', 'Đã từ chối lời mời.');
  };

  // Safety report / block
  const handleReportOrBlockSubmit = async (targetUserId: string, action: 'report' | 'block', reason: string) => {
    await dataService.reportOrBlockUser(targetUserId, action, reason);
    addToast(
      'info',
      action === 'block'
        ? 'Đã chặn bạn học này khỏi kết quả ghép đôi.'
        : 'Đã gửi báo cáo vi phạm đến ban quản trị.'
    );
    const nextCandidates = await dataService.getMatchingCandidates(weights);
    setCandidates(nextCandidates);
  };

  // Resource actions
  const handleToggleBookmark = async (resId: string) => {
    const isSaved = await dataService.toggleBookmarkResource(resId);
    setResources(prev =>
      prev.map(r => (r.id === resId ? { ...r, is_saved: isSaved } : r))
    );
    addToast(isSaved ? 'success' : 'info', isSaved ? 'Đã lưu tài liệu vào mục yêu thích!' : 'Đã bỏ lưu tài liệu.');
  };

  const handleAttachResource = async (resId: string) => {
    if (!upcomingSession) {
      addToast('error', 'Bạn chưa có buổi học sắp tới nào để gắn tài liệu!');
      return;
    }
    await dataService.attachResourceToSession(upcomingSession.id, resId);
    setUpcomingSession({ ...upcomingSession, resource_id: resId });
    addToast('success', 'Đã gắn tài liệu này vào buổi học tiếp theo thành công!');
  };

  // Study room actions
  const handleConfirmAttendance = async () => {
    if (!upcomingSession || !currentUser) return;
    const userKey = upcomingSession.user_a_id === currentUser.id ? 'user_a' : 'user_b';
    const updated = await dataService.confirmAttendance(upcomingSession.id, userKey);
    setUpcomingSession(updated);
    addToast('success', 'Đã xác nhận có mặt! Tiền cọc cam kết được bảo toàn.');
  };

  const handleGoalToggle = async (goalId: string) => {
    if (!upcomingSession) return;
    const updated = await dataService.toggleSessionGoal(upcomingSession.id, goalId);
    setUpcomingSession(updated);
  };

  // Pricing actions: Sprint 19k/29k, Plus 29k/59k
  const handleSelectPlan = async (planCode: 'plus_59k' | 'sprint_29k' | 'plus_29k' | 'sprint_19k', amount: number) => {
    setIsUpgradeLimitModalOpen(false);
    const event = await dataService.trackPaymentClick(planCode, amount);
    setActivePaymentEvent(event);
    setIsPaymentQrOpen(true);

    const [m, evs] = await Promise.all([
      dataService.getStartupMetrics(),
      dataService.getLocalPaymentEvents()
    ]);
    setStartupMetrics(m);
    setPaymentEvents(evs);
  };

  const handleConfirmPayment = async (eventId: string) => {
    await dataService.confirmPayment(eventId);
    addToast('success', 'Đã xác nhận thanh toán thành công! Gói dịch vụ của bạn đã được nâng cấp.');
    const updatedUser = await dataService.getCurrentUser();
    setCurrentUser(updatedUser);

    const [m, evs] = await Promise.all([
      dataService.getStartupMetrics(),
      dataService.getLocalPaymentEvents()
    ]);
    setStartupMetrics(m);
    setPaymentEvents(evs);
  };

  // =========================================================================
  // ROUTE GUARD: BƯỚC 1 — ĐĂNG NHẬP (LOGIN PAGE)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  // Loading state
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EBE8DF] via-[#F4F1E8] to-[#F8F5EE] text-[#365C4A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#365C4A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#365C4A]">Đang khởi tạo không gian StudyMatch Matcha Vibe...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ROUTE GUARD: BƯỚC 2 — ONBOARDING WIZARD CHO TÀI KHOẢN MỚI
  // =========================================================================
  if (currentUser.is_onboarded === false) {
    return (
      <>
        <OnboardingWizard
          currentUser={currentUser}
          onComplete={handleOnboardingComplete}
        />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  // Find attached resource for study room if present
  const attachedResourceItem = upcomingSession?.resource_id
    ? resources.find(r => r.id === upcomingSession.resource_id) || null
    : null;

  // =========================================================================
  // ROUTE GUARD: BƯỚC 3 — DASHBOARD & CÁC PHÂN HỆ
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#EBE8DF] via-[#F4F1E8] to-[#F8F5EE] text-[#553F35] selection:bg-[#365C4A] selection:text-white relative overflow-x-hidden font-sans">
      
      {/* Background Ambient Decorative Circles */}
      <div className="fixed top-12 left-10 w-96 h-96 rounded-full bg-[#A7B99A]/15 blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 rounded-full bg-[#D89C57]/12 blur-3xl pointer-events-none" />

      {/* 1. Global Navigation Bar with Matcha Theme (Không còn Demo Mode) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        isSupabaseLive={isSupabaseLive}
        onOpenProfile={() => setCurrentTab('profile')}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        
        {/* =========================================================================
            PHÂN HỆ 1: DASHBOARD & TỔNG QUAN (MATCHA VIBE STUDY CAFÉ)
           ========================================================================= */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            <HeroTodayCard
              session={upcomingSession}
              currentUser={currentUser}
              onEnterRoom={() => setCurrentTab('studyroom')}
              onConfirmAttendance={handleConfirmAttendance}
              onFindPartner={() => setCurrentTab('matching')}
            />

            <PendingInvites
              invites={pendingInvites}
              onAccept={handleAcceptInvite}
              onReject={handleRejectInvite}
            />

            <StreakFundBadge
              currentUser={currentUser}
              onTopUpDeposit={handleTopUpDeposit}
            />

            {/* Quick Matching Teaser in Matcha Vibe */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#365C4A]/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
              <div>
                <h3 className="text-base font-black text-[#365C4A] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D89C57]" />
                  <span>Thuật Toán Ghép Đôi Bù Trừ Năng Lực Sẵn Sàng</span>
                </h3>
                <p className="text-xs text-[#553F35]/80 mt-1 font-medium leading-relaxed">
                  Đã tính toán độ tương thích với {candidates.length} sinh viên cùng môn {currentUser.priority_subject}.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('matching')}
                className="px-6 py-3 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] active:scale-98 text-white text-xs font-bold transition-all shadow-xl shadow-[#365C4A]/25 shrink-0 flex items-center gap-2"
              >
                <span>Xem Top Ứng Viên Phù Hợp</span>
                <span className="font-mono text-xs bg-[#264234] text-[#A7B99A] px-2 py-0.5 rounded-full font-bold">
                  {candidates.slice(0, 3).length}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHÂN HỆ 2: GHÉP BẠN HỌC TỰ ĐỘNG (SMART MATCH)
           ========================================================================= */}
        {currentTab === 'matching' && (
          <div className="space-y-6">
            <WeightSliders
              weights={weights}
              onChangeWeights={setWeights}
              onResetWeights={() => setWeights(DEFAULT_WEIGHTS)}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#365C4A]" />
                  <h3 className="text-base font-black text-[#365C4A] tracking-tight">
                    Top Ứng Viên Bù Trừ Kiến Thức Tốt Nhất ({Math.min(candidates.length, 3)})
                  </h3>
                </div>
                <span className="text-xs text-[#553F35]/70 font-semibold font-mono">
                  Sắp xếp theo Điểm Tương Thích S giảm dần
                </span>
              </div>

              {candidates.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#553F35]/70 rounded-3xl bg-white border border-[#365C4A]/20 shadow-md">
                  Không tìm thấy ứng viên phù hợp hoặc bạn đã chặn toàn bộ danh sách.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {candidates.slice(0, 3).map((candidate, idx) => (
                    <CandidateCard
                      key={candidate.profile.id}
                      candidate={candidate}
                      rank={idx + 1}
                      onSendInvite={handleSendInvite}
                      onReportOrBlock={setSelectedCandidateForSafety}
                      onViewProfile={(p) => setSelectedPublicProfile(p)}
                      hasSent={sentInviteIds.includes(candidate.profile.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            PHÂN HỆ 3: THƯ VIỆN MÔN HỌC (RESOURCES)
           ========================================================================= */}
        {currentTab === 'resources' && (
          <div className="space-y-6">
            <ResourceFilter
              selectedSubject={selectedSubject}
              selectedTopic={selectedTopic}
              selectedType={selectedType}
              onSelectSubject={setSelectedSubject}
              onSelectTopic={setSelectedTopic}
              onSelectType={setSelectedType}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#365C4A]" />
                  <h3 className="text-base font-black text-[#365C4A] tracking-tight">
                    Tài Liệu Học Tập & Ngân Hàng Quiz Chuẩn Hóa ({resources.length})
                  </h3>
                </div>
                <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  100% Đã kiểm duyệt bản quyền
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resources.map((res) => (
                  <ResourceCard
                    key={res.id}
                    resource={res}
                    onOpenDetail={setSelectedResourceDetail}
                    onToggleBookmark={handleToggleBookmark}
                    onAttachToSession={handleAttachResource}
                    isAttached={upcomingSession?.resource_id === res.id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHÂN HỆ 4: PHÒNG HỌC CAM KẾT NỘI BỘ (STUDY ROOM)
           ========================================================================= */}
        {currentTab === 'studyroom' && (
          <div>
            {upcomingSession ? (
              <StudyRoomScreen
                session={upcomingSession}
                currentUser={currentUser}
                attachedResource={attachedResourceItem}
                onBackToDashboard={() => setCurrentTab('dashboard')}
                onGoalToggle={handleGoalToggle}
                onConfirmAttendance={handleConfirmAttendance}
                onSessionFinished={loadData}
              />
            ) : (
              <div className="p-10 sm:p-12 rounded-3xl bg-white border border-[#365C4A]/20 text-center max-w-lg mx-auto space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-[#365C4A]/10 border border-[#365C4A]/25 flex items-center justify-center mx-auto text-[#365C4A]">
                  <Video className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-[#365C4A]">Chưa Có Phiên Học Nào Sẵn Sàng</h3>
                <p className="text-xs text-[#553F35]/80 leading-relaxed font-medium">
                  Hãy vào mục "Tìm bạn học" để gửi lời mời ghép đôi hoặc chấp nhận lời mời từ bạn học ở Bảng tin để tự động mở phòng học.
                </p>
                <button
                  onClick={() => setCurrentTab('matching')}
                  className="px-6 py-2.5 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white text-xs font-bold transition-all shadow-md shadow-[#365C4A]/20"
                >
                  Tìm bạn học ngay
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PHÂN HỆ 5: TIẾN ĐỘ & BẢNG GIÁ DOANH THU (PROGRESS & PRICING: 0đ, 19k, 29k)
           ========================================================================= */}
        {currentTab === 'pricing' && (
          <div className="space-y-8">
            <PriceAnchoringBanner />

            <PricingTierCards
              currentTier={currentUser.plan_tier}
              freeInvitesUsed={currentUser.free_invites_used}
              onSelectPlan={handleSelectPlan}
              onOpenStartupMetrics={() => setIsStartupMetricsOpen(true)}
            />

            <PersonalStatsView
              currentUser={currentUser}
              sessions={allSessions}
              onBookNext={(_partnerId) => {
                addToast('success', 'Đã đặt lịch hẹn học tiếp cho tuần tới!');
                setCurrentTab('studyroom');
              }}
              onFindReplacement={() => setCurrentTab('matching')}
            />
          </div>
        )}

        {/* =========================================================================
            PHÂN HỆ 6: HỒ SƠ HỌC TẬP CÁ NHÂN (PROFILE: VIEW & EDIT MODE)
           ========================================================================= */}
        {currentTab === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onSaveProfile={handleSaveProfile}
            onNavigateToMatching={() => setCurrentTab('matching')}
          />
        )}

      </main>

      {/* 3. Global Footer (Matcha Vibe Production) */}
      <footer className="border-t border-[#365C4A]/15 bg-[#F8F5EE] py-6 text-center text-xs text-[#553F35]/80 space-y-1">
        <p className="font-bold text-[#365C4A]">StudyMatch © 2026 — Nền tảng học tập cộng tác & phòng học Pomodoro cam kết kỷ luật cho sinh viên Việt Nam.</p>
        <p className="text-[11px] text-[#553F35]/60">
          Phong cách Study Café & Matcha Vibe • Bảo mật định danh học thuật • Đồng hành qua môn & săn học bổng
        </p>
      </footer>

      {/* 4. Global Modals */}
      <PublicProfileModal
        isOpen={Boolean(selectedPublicProfile)}
        profile={selectedPublicProfile}
        currentUser={currentUser}
        onClose={() => setSelectedPublicProfile(null)}
        onSendInvite={(p) => {
          setSelectedPublicProfile(null);
          const cand = candidates.find(c => c.profile.id === p.id);
          if (cand) handleSendInvite(cand);
        }}
        hasSentInvite={selectedPublicProfile ? sentInviteIds.includes(selectedPublicProfile.id) : false}
      />

      <ResourceDetailModal
        resource={selectedResourceDetail}
        isOpen={Boolean(selectedResourceDetail)}
        onClose={() => setSelectedResourceDetail(null)}
        onAttachToSession={handleAttachResource}
        isAttached={upcomingSession?.resource_id === selectedResourceDetail?.id}
      />

      <ReportBlockModal
        candidate={selectedCandidateForSafety}
        isOpen={Boolean(selectedCandidateForSafety)}
        onClose={() => setSelectedCandidateForSafety(null)}
        onSubmit={handleReportOrBlockSubmit}
      />

      <UpgradeLimitModal
        isOpen={isUpgradeLimitModalOpen}
        onClose={() => setIsUpgradeLimitModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />

      <PaymentQrModal
        paymentEvent={activePaymentEvent}
        isOpen={isPaymentQrOpen}
        onClose={() => setIsPaymentQrOpen(false)}
        onConfirmPayment={handleConfirmPayment}
      />

      <StartupMetricsModal
        isOpen={isStartupMetricsOpen}
        onClose={() => setIsStartupMetricsOpen(false)}
        metrics={startupMetrics}
        events={paymentEvents}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />

    </div>
  );
};
