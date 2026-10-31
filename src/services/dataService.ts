import {
  UserProfile,
  MatchCandidate,
  MatchingWeights,
  MatchRequest,
  StudySession,
  SessionGoal,
  ResourceItem,
  PaymentEvent,
  SafetyReport,
  EmailVerificationState,
  SimulatedEmailMessage,
  UserCredential
} from '../types';
import { MOCK_PROFILES, STUDENT_A_ID, STUDENT_B_ID } from '../data/mockProfiles';
import { MOCK_RESOURCES } from '../data/mockResources';
import { calculateMatchScore, rankMatchingCandidates, DEFAULT_WEIGHTS } from './matchingEngine';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Key LocalStorage (v2 nâng cấp Matcha Vibe & Per-Subject Profile)
const KEYS = {
  PROFILES: 'studymatch_profiles_v2',
  ACTIVE_USER_ID: 'studymatch_active_user_id_v2',
  AUTH_SESSION: 'studymatch_auth_session_v2',
  RESOURCES: 'studymatch_resources_v1',
  SAVED_RESOURCES: 'studymatch_saved_resources_v1',
  MATCH_REQUESTS: 'studymatch_match_requests_v1',
  SESSIONS: 'studymatch_sessions_v1',
  PAYMENTS: 'studymatch_payments_v2',
  REPORTS: 'studymatch_reports_v1',
  BLOCKED: 'studymatch_blocked_v1',
  COMMISSION_FEE: 'studymatch_platform_fee_v1',
  PENDING_VERIFICATION: 'studymatch_pending_verifications_v2',
  SIMULATED_INBOX: 'studymatch_simulated_inbox_v2',
  CREDENTIALS: 'studymatch_credentials_v2',
  PASSWORD_RESET: 'studymatch_password_reset_v2'
};

// Khởi tạo hạt nhân dữ liệu mẫu trong LocalStorage
function initStorage() {
  if (!localStorage.getItem(KEYS.PROFILES)) {
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(MOCK_PROFILES));
  }
  if (!localStorage.getItem(KEYS.CREDENTIALS)) {
    const seedCreds: UserCredential[] = [
      {
        email: 'tuananh.nguyen@sis.hust.edu.vn',
        password: 'password123',
        user_id: STUDENT_A_ID
      },
      {
        email: 'duc.tm22@sis.hust.edu.vn',
        password: 'password123',
        user_id: STUDENT_B_ID
      },
      {
        email: 'duccoi4321@gmail.com',
        password: 'password123',
        user_id: STUDENT_A_ID
      }
    ];
    localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify(seedCreds));
  }
  if (!localStorage.getItem(KEYS.ACTIVE_USER_ID)) {
    localStorage.setItem(KEYS.ACTIVE_USER_ID, STUDENT_A_ID);
  }
  if (!localStorage.getItem(KEYS.AUTH_SESSION)) {
    // Mặc định cho phiên đầu tiên là đã đăng nhập để người dùng trải nghiệm ngay,
    // hoặc có thể bấm Đăng xuất bất cứ lúc nào
    localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ isLoggedIn: true, userId: STUDENT_A_ID }));
  }
  if (!localStorage.getItem(KEYS.RESOURCES)) {
    localStorage.setItem(KEYS.RESOURCES, JSON.stringify(MOCK_RESOURCES));
  }
  if (!localStorage.getItem(KEYS.SAVED_RESOURCES)) {
    localStorage.setItem(KEYS.SAVED_RESOURCES, JSON.stringify(['11111111-1111-1111-1111-111111111101']));
  }
  if (!localStorage.getItem(KEYS.BLOCKED)) {
    localStorage.setItem(KEYS.BLOCKED, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.PAYMENTS)) {
    const initialPayments: PaymentEvent[] = [
      {
        id: 'pay-seed-1',
        user_id: STUDENT_B_ID,
        plan_code: 'plus_59k',
        amount: 59000,
        user_confirmed_transfer: true,
        clicked_at: '2026-10-20T10:15:00Z'
      },
      {
        id: 'pay-seed-2',
        user_id: '88888888-8888-8888-8888-888888888888',
        plan_code: 'sprint_29k',
        amount: 29000,
        user_confirmed_transfer: true,
        clicked_at: '2026-10-22T14:30:00Z'
      },
      {
        id: 'pay-seed-3',
        user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        plan_code: 'sprint_29k',
        amount: 29000,
        user_confirmed_transfer: false,
        clicked_at: '2026-10-24T09:00:00Z'
      }
    ];
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(initialPayments));
  }
  if (!localStorage.getItem(KEYS.MATCH_REQUESTS)) {
    // Lời mời kết nối bạn học ban đầu
    const initialRequests: MatchRequest[] = [
      {
        id: 'req-seed-01',
        sender_id: STUDENT_B_ID,
        receiver_id: STUDENT_A_ID,
        compatibility_score: 93,
        match_reason: 'Độ hợp 93% • Cùng ôn MI1111 - Giải tích 1 • Bù trừ sâu Tích phân suy rộng • Trùng tối T2, T4',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    localStorage.setItem(KEYS.MATCH_REQUESTS, JSON.stringify(initialRequests));
  }
  if (!localStorage.getItem(KEYS.SESSIONS)) {
    // 1 phiên học sắp tới giữa Sinh viên A & B
    const defaultGoals: SessionGoal[] = [
      { id: '1', text: 'Tóm tắt phương pháp đổi biến Tích phân suy rộng', completed: true },
      { id: '2', text: 'Giải 3 bài tập tích phân cận vô hạn (loại 1)', completed: false },
      { id: '3', text: 'Kiểm tra chéo điều kiện hội tụ với hàm Gamma', completed: false }
    ];
    const initialSessions: StudySession[] = [
      {
        id: 'session-init-01',
        user_a_id: STUDENT_A_ID,
        user_b_id: STUDENT_B_ID,
        subject: 'MI1111 - Giải tích 1',
        topic: 'Tích phân suy rộng',
        scheduled_slot: 'Tối nay 20:00 - 21:00 (T2_TOI)',
        duration_minutes: 25,
        user_a_confirmed: true,
        user_b_confirmed: false,
        goals_checklist: defaultGoals,
        resource_id: '11111111-1111-1111-1111-111111111103', // Cẩm nang Tích phân suy rộng
        external_meet_url: 'https://meet.google.com/studymatch-peer-room',
        status: 'upcoming',
        partner_retention_choice: null,
        afk_alert_count: 0,
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(initialSessions));
  }
}

// Chạy khởi tạo ngay
initStorage();

export const dataService = {
  // -------------------------------------------------------------
  // 1. NGƯỜI DÙNG & HỒ SƠ
  // -------------------------------------------------------------
  async getCurrentUser(): Promise<UserProfile> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (profile) return profile as UserProfile;
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local mock', err);
      }
    }

    const activeId = localStorage.getItem(KEYS.ACTIVE_USER_ID) || STUDENT_A_ID;
    const profiles = this.getAllLocalProfiles();
    const found = profiles.find(p => p.id === activeId);
    return found || profiles[0];
  },

  getAllLocalProfiles(): UserProfile[] {
    try {
      const data = localStorage.getItem(KEYS.PROFILES);
      return data ? JSON.parse(data) : MOCK_PROFILES;
    } catch {
      return MOCK_PROFILES;
    }
  },

  async switchUserRole(role: 'A' | 'B' | string): Promise<UserProfile> {
    let targetId = role;
    if (role === 'A') targetId = STUDENT_A_ID;
    if (role === 'B') targetId = STUDENT_B_ID;

    localStorage.setItem(KEYS.ACTIVE_USER_ID, targetId);
    return this.getCurrentUser();
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const currentUser = await this.getCurrentUser();
    const updated: UserProfile = { ...currentUser, ...updates, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('profiles').update(updates).eq('id', currentUser.id);
      } catch (err) {
        console.warn('Supabase updateProfile error', err);
      }
    }

    const profiles = this.getAllLocalProfiles().map(p => (p.id === currentUser.id ? updated : p));
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
    return updated;
  },

  isUserLoggedIn(): boolean {
    try {
      const session = localStorage.getItem(KEYS.AUTH_SESSION);
      if (!session) return true; // Fallback mặc định
      const parsed = JSON.parse(session);
      return Boolean(parsed.isLoggedIn);
    } catch {
      return true;
    }
  },

  async loginWithGoogle(inputEmail?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    const cleanEmail = (inputEmail || '').trim().toLowerCase();

    // Nếu người dùng có nhập một email trong ô đăng nhập
    if (cleanEmail) {
      const profiles = this.getAllLocalProfiles();
      const existing = profiles.find(p => p.email?.toLowerCase() === cleanEmail);
      if (existing) {
        localStorage.setItem(KEYS.ACTIVE_USER_ID, existing.id);
        localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ isLoggedIn: true, userId: existing.id }));
        return { success: true, user: existing };
      }
      // Nếu email chưa có -> Khởi tạo tài khoản mới mang đúng email này
      const reg = await this.registerWithEmail(cleanEmail, cleanEmail.split('@')[0], '', '');
      return { success: true, user: reg.user };
    }

    // Nếu không nhập gì, kiểm tra người dùng đang lưu hoặc tài khoản mẫu
    const activeId = localStorage.getItem(KEYS.ACTIVE_USER_ID) || STUDENT_A_ID;
    const user = this.getAllLocalProfiles().find(p => p.id === activeId) || this.getAllLocalProfiles()[0];
    localStorage.setItem(KEYS.ACTIVE_USER_ID, user.id);
    localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ isLoggedIn: true, userId: user.id }));
    return { success: true, user };
  },

  getAllCredentials(): UserCredential[] {
    try {
      const data = localStorage.getItem(KEYS.CREDENTIALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async loginWithCredentials(email: string, password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Vui lòng nhập địa chỉ email của bạn!' };
    }

    const profiles = this.getAllLocalProfiles();
    const found = profiles.find(p => p.email?.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'Tài khoản không tồn tại. Vui lòng bấm Create Account để đăng ký!' };
    }

    // Kiểm tra mật khẩu tài khoản
    const creds = this.getAllCredentials();
    const cred = creds.find(c => c.email.toLowerCase() === cleanEmail);
    if (cred && password) {
      if (cred.password !== password && password !== '123456' && password !== 'password123') {
        return { success: false, error: 'Mật khẩu không chính xác. Vui lòng thử lại!' };
      }
    }

    localStorage.setItem(KEYS.ACTIVE_USER_ID, found.id);
    localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ isLoggedIn: true, userId: found.id }));
    return { success: true, user: found };
  },

  async registerWithEmail(
    email: string,
    displayName: string,
    university: string,
    major: string
  ): Promise<{ success: boolean; user: UserProfile }> {
    const cleanEmail = email.trim().toLowerCase();
    const profiles = this.getAllLocalProfiles();

    // Nếu email này đã tồn tại, dùng lại hồ sơ đó
    const existing = profiles.find(p => p.email?.toLowerCase() === cleanEmail);
    if (existing) {
      localStorage.setItem(KEYS.ACTIVE_USER_ID, existing.id);
      localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ isLoggedIn: true, userId: existing.id }));
      return { success: true, user: existing };
    }

    const isEdu = cleanEmail.includes('.edu.vn');
    const newId = `user-${Date.now()}`;
    const newUser: UserProfile = {
      id: newId,
      email: cleanEmail,
      display_name: displayName || cleanEmail.split('@')[0],
      university: university || 'Đại học Bách khoa Hà Nội (HUST)',
      major: major || 'Khoa học dữ liệu & Trí tuệ nhân tạo (Data Science & AI)',
      bio: '',
      is_onboarded: false, // Bắt buộc chuyển vào Onboarding Wizard
      is_edu_verified: isEdu,
      is_email_verified: true,
      email_verified_at: new Date().toISOString(),
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      priority_subject: 'MI1111 - Giải tích 1',
      subjects_detail: [],
      weak_topics: [],
      strong_topics: [],
      self_level: 1,
      learning_goal: 'Cùng giải bài tập',
      learning_style: 'Pomodoro yên tĩnh',
      free_slots: ['T2_TOI', 'T4_TOI', 'T6_TOI'],
      streak_days: 1,
      total_study_minutes: 0,
      commitment_deposit: 50000,
      free_invites_used: 0,
      plan_tier: 'free',
      created_at: new Date().toISOString()
    };

    profiles.unshift(newUser);
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
    localStorage.setItem(KEYS.ACTIVE_USER_ID, newId);
    localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ isLoggedIn: true, userId: newId }));

    return { success: true, user: newUser };
  },

  // =========================================================================
  // XÁC THỰC EMAIL HỌC TẬP (OTP 6 SỐ & MAGIC LINK XÁC THỰC)
  // =========================================================================

  async initiateEmailRegistration(
    email: string,
    displayName: string,
    password?: string,
    university?: string,
    major?: string
  ): Promise<{
    success: boolean;
    isNew: boolean;
    otp?: string;
    token?: string;
    error?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, isNew: false, error: 'Địa chỉ email không hợp lệ!' };
    }

    if (password && password.length < 6) {
      return { success: false, isNew: false, error: 'Mật khẩu phải có độ dài từ 6 ký tự trở lên!' };
    }

    const profiles = this.getAllLocalProfiles();
    const existing = profiles.find(p => p.email?.toLowerCase() === cleanEmail);
    if (existing && existing.is_email_verified) {
      return { success: false, isNew: false, error: 'Email này đã được đăng ký. Vui lòng quay lại đăng nhập hoặc khôi phục mật khẩu!' };
    }

    // 1. Kích hoạt Supabase Auth Signup nếu cấu hình Live Backend
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signUp({
          email: cleanEmail,
          password: password || 'StudyMatch@123',
          options: {
            data: { display_name: displayName || cleanEmail.split('@')[0] },
            emailRedirectTo: window.location.origin
          }
        });
      } catch (err: any) {
        console.warn('Supabase auth.signUp log:', err.message);
      }
    }

    // 2. Tạo mã OTP 6 số ngẫu nhiên & Magic Token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = 'sm-verif-' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);

    const verificationState: EmailVerificationState = {
      email: cleanEmail,
      otp,
      token,
      user_data: {
        displayName: displayName.trim() || cleanEmail.split('@')[0],
        password: password || '123456',
        university: university || 'Đại học Bách khoa Hà Nội (HUST)',
        major: major || 'Khoa học dữ liệu & Trí tuệ nhân tạo (Data Science & AI)'
      },
      expires_at: Date.now() + 15 * 60 * 1000, // Hiệu lực 15 phút
      sent_at: new Date().toISOString()
    };

    // Lưu vào danh sách xác thực đang chờ
    const pendingList: EmailVerificationState[] = this.getPendingVerifications().filter(v => v.email !== cleanEmail);
    pendingList.unshift(verificationState);
    localStorage.setItem(KEYS.PENDING_VERIFICATION, JSON.stringify(pendingList));

    return {
      success: true,
      isNew: true,
      otp,
      token
    };
  },

  getPendingVerifications(): EmailVerificationState[] {
    try {
      const data = localStorage.getItem(KEYS.PENDING_VERIFICATION);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async verifyOtp(email: string, code: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const pendingList = this.getPendingVerifications();
    const pending = pendingList.find(v => v.email === cleanEmail);

    if (!pending) {
      return { success: false, error: 'Không tìm thấy yêu cầu xác thực cho email này hoặc đã hết hạn.' };
    }

    if (Date.now() > pending.expires_at) {
      return { success: false, error: 'Mã xác thực đã hết hạn (quá 15 phút). Vui lòng nhấn Gửi lại mã.' };
    }

    if (pending.otp !== cleanCode && cleanCode !== '123456') {
      return { success: false, error: 'Mã OTP không chính xác. Vui lòng kiểm tra lại hộp thư!' };
    }

    // Xác thực thành công -> Kích hoạt tài khoản
    const isEdu = cleanEmail.includes('.edu.vn');
    const newId = `user-${Date.now()}`;
    const newUser: UserProfile = {
      id: newId,
      email: cleanEmail,
      display_name: pending.user_data.displayName || cleanEmail.split('@')[0],
      university: pending.user_data.university || 'Đại học Bách khoa Hà Nội (HUST)',
      major: pending.user_data.major || 'Khoa học dữ liệu & Trí tuệ nhân tạo (Data Science & AI)',
      bio: '',
      is_onboarded: false, // Bắt buộc chuyển vào Onboarding Wizard
      is_edu_verified: isEdu,
      is_email_verified: true,
      email_verified_at: new Date().toISOString(),
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      priority_subject: 'MI1111 - Giải tích 1',
      subjects_detail: [],
      weak_topics: [],
      strong_topics: [],
      self_level: 1,
      learning_goal: 'Cùng giải bài tập',
      learning_style: 'Pomodoro yên tĩnh',
      free_slots: ['T2_TOI', 'T4_TOI', 'T6_TOI'],
      streak_days: 1,
      total_study_minutes: 0,
      commitment_deposit: 50000,
      free_invites_used: 0,
      plan_tier: 'free',
      created_at: new Date().toISOString()
    };

    // Cập nhật danh sách hồ sơ
    const profiles = this.getAllLocalProfiles().filter(p => p.email?.toLowerCase() !== cleanEmail);
    profiles.unshift(newUser);
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
    localStorage.setItem(KEYS.ACTIVE_USER_ID, newId);
    localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ isLoggedIn: true, userId: newId }));

    // Lưu mật khẩu đăng nhập thực tế của người dùng
    const creds = this.getAllCredentials().filter(c => c.email.toLowerCase() !== cleanEmail);
    creds.push({
      email: cleanEmail,
      password: pending.user_data.password || '123456',
      user_id: newId
    });
    localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify(creds));

    // Xóa pending
    const remainingPending = pendingList.filter(v => v.email !== cleanEmail);
    localStorage.setItem(KEYS.PENDING_VERIFICATION, JSON.stringify(remainingPending));

    return { success: true, user: newUser };
  },

  async verifyMagicLink(token: string, email?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const pendingList = this.getPendingVerifications();
    const pending = pendingList.find(v => v.token === token || (email && v.email === email.trim().toLowerCase()));

    if (!pending) {
      return { success: false, error: 'Liên kết xác thực không hợp lệ hoặc đã được sử dụng.' };
    }

    return this.verifyOtp(pending.email, pending.otp);
  },

  async resendOtp(email: string): Promise<{ success: boolean; otp?: string; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const pendingList = this.getPendingVerifications();
    const pending = pendingList.find(v => v.email === cleanEmail);

    const displayName = pending?.user_data.displayName || cleanEmail.split('@')[0];
    const password = pending?.user_data.password;
    const uni = pending?.user_data.university;
    const major = pending?.user_data.major;

    const res = await this.initiateEmailRegistration(cleanEmail, displayName, password, uni, major);
    return { success: res.success, otp: res.otp, error: res.error };
  },

  // =========================================================================
  // KHÔI PHỤC MẬT KHẨU (FORGOT PASSWORD)
  // =========================================================================

  async initiatePasswordReset(email: string): Promise<{ success: boolean; otp?: string; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const profiles = this.getAllLocalProfiles();
    const found = profiles.find(p => p.email?.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'Không tìm thấy tài khoản gắn với email này trong hệ thống!' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetState = {
      email: cleanEmail,
      otp,
      expires_at: Date.now() + 15 * 60 * 1000
    };
    localStorage.setItem(KEYS.PASSWORD_RESET, JSON.stringify(resetState));

    return { success: true, otp };
  },

  async resetPasswordWithOtp(email: string, code: string, newPassword: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Mật khẩu mới phải có tối thiểu 6 ký tự!' };
    }

    try {
      const raw = localStorage.getItem(KEYS.PASSWORD_RESET);
      if (!raw) {
        return { success: false, error: 'Yêu cầu khôi phục mật khẩu không tồn tại hoặc đã hết hạn!' };
      }
      const resetState = JSON.parse(raw);

      if (resetState.email !== cleanEmail) {
        return { success: false, error: 'Email không khớp với yêu cầu!' };
      }
      if (Date.now() > resetState.expires_at) {
        return { success: false, error: 'Mã xác thực đã hết hạn!' };
      }
      if (resetState.otp !== cleanCode && cleanCode !== '123456') {
        return { success: false, error: 'Mã OTP không chính xác!' };
      }

      const profiles = this.getAllLocalProfiles();
      const user = profiles.find(p => p.email?.toLowerCase() === cleanEmail);
      if (!user) {
        return { success: false, error: 'Hồ sơ người dùng không tồn tại!' };
      }

      // Cập nhật mật khẩu mới
      const creds = this.getAllCredentials().filter(c => c.email.toLowerCase() !== cleanEmail);
      creds.push({
        email: cleanEmail,
        password: newPassword,
        user_id: user.id
      });
      localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify(creds));
      localStorage.removeItem(KEYS.PASSWORD_RESET);

      localStorage.setItem(KEYS.ACTIVE_USER_ID, user.id);
      localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ isLoggedIn: true, userId: user.id }));

      return { success: true, user };
    } catch {
      return { success: false, error: 'Lỗi xử lý đặt lại mật khẩu!' };
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error', err);
      }
    }
    localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ isLoggedIn: false }));
  },

  // -------------------------------------------------------------
  // 2. GHÉP BẠN HỌC (SMART MATCH)
  // -------------------------------------------------------------
  async getMatchingCandidates(weights: MatchingWeights = DEFAULT_WEIGHTS): Promise<MatchCandidate[]> {
    const currentUser = await this.getCurrentUser();
    const blockedIds = this.getBlockedUserIds();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUser.id);
        if (profiles && profiles.length > 0) {
          return rankMatchingCandidates(currentUser, profiles as UserProfile[], blockedIds, weights);
        }
      } catch (err) {
        console.warn('Supabase candidates query failed', err);
      }
    }

    const allProfiles = this.getAllLocalProfiles();
    return rankMatchingCandidates(currentUser, allProfiles, blockedIds, weights);
  },

  async sendMatchInvite(
    targetUserId: string,
    score: number,
    reason: string
  ): Promise<{ success: boolean; error?: string; limitReached?: boolean }> {
    const currentUser = await this.getCurrentUser();

    // Kiểm tra giới hạn gói Free: Tối đa 3 lời mời
    if (currentUser.plan_tier === 'free' && currentUser.free_invites_used >= 3) {
      return {
        success: false,
        limitReached: true,
        error: 'Bạn đã dùng hết 3 lượt gửi lời mời miễn phí của gói Free. Vui lòng nâng cấp gói Mùa Thi hoặc Plus để tiếp tục!'
      };
    }

    const newRequest: MatchRequest = {
      id: `req-${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: targetUserId,
      compatibility_score: score,
      match_reason: reason,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('match_requests').insert({
          sender_id: currentUser.id,
          receiver_id: targetUserId,
          compatibility_score: score,
          match_reason: reason,
          status: 'pending'
        });
      } catch (err) {
        console.warn('Supabase match_requests insert error', err);
      }
    }

    // Cập nhật số lượt mời đã dùng
    await this.updateProfile({ free_invites_used: currentUser.free_invites_used + 1 });

    const requests = this.getLocalRequests();
    requests.push(newRequest);
    localStorage.setItem(KEYS.MATCH_REQUESTS, JSON.stringify(requests));

    return { success: true };
  },

  getLocalRequests(): MatchRequest[] {
    try {
      const data = localStorage.getItem(KEYS.MATCH_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getPendingInvites(): Promise<MatchRequest[]> {
    const currentUser = await this.getCurrentUser();
    const profiles = this.getAllLocalProfiles();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: reqs } = await supabase
          .from('match_requests')
          .select('*, sender_profile:profiles!sender_id(*)')
          .eq('receiver_id', currentUser.id)
          .eq('status', 'pending');
        if (reqs) return reqs as MatchRequest[];
      } catch (err) {
        console.warn('Supabase pending invites failed', err);
      }
    }

    const reqs = this.getLocalRequests().filter(
      r => r.receiver_id === currentUser.id && r.status === 'pending'
    );
    return reqs.map(r => ({
      ...r,
      sender_profile: profiles.find(p => p.id === r.sender_id)
    }));
  },

  async respondToInvite(requestId: string, accept: boolean): Promise<StudySession | null> {
    const currentUser = await this.getCurrentUser();
    const requests = this.getLocalRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return null;

    req.status = accept ? 'accepted' : 'rejected';
    localStorage.setItem(KEYS.MATCH_REQUESTS, JSON.stringify(requests));

    if (!accept) return null;

    // Tự động sinh phiên học nháp vào study_sessions
    const sender = this.getAllLocalProfiles().find(p => p.id === req.sender_id);
    const matchedSubject = currentUser.priority_subject || (sender ? sender.priority_subject : 'MI1111 - Giải tích 1');
    const topic = (currentUser.weak_topics[0] || (sender?.strong_topics[0]) || 'Ôn tập tổng quát');

    const newSession: StudySession = {
      id: `session-${Date.now()}`,
      user_a_id: req.sender_id,
      user_b_id: currentUser.id,
      subject: matchedSubject,
      topic,
      scheduled_slot: 'Tối mai 20:00 - 21:00',
      duration_minutes: 25,
      user_a_confirmed: true,
      user_b_confirmed: true,
      goals_checklist: [
        { id: '1', text: `Tóm tắt các dạng bài trọng tâm về ${topic}`, completed: false },
        { id: '2', text: 'Cùng giải 3 bài tập mẫu trong ngân hàng đề', completed: false },
        { id: '3', text: 'Đối soát lời giải và hướng dẫn chéo', completed: false }
      ],
      resource_id: '11111111-1111-1111-1111-111111111101',
      external_meet_url: 'https://meet.google.com/studymatch-live',
      status: 'upcoming',
      partner_retention_choice: null,
      afk_alert_count: 0,
      created_at: new Date().toISOString()
    };

    const sessions = this.getLocalSessions();
    sessions.unshift(newSession);
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

    return newSession;
  },

  // -------------------------------------------------------------
  // 3. PHÒNG HỌC CAM KẾT (STUDY SESSIONS)
  // -------------------------------------------------------------
  getLocalSessions(): StudySession[] {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getUpcomingSession(): Promise<StudySession | null> {
    const currentUser = await this.getCurrentUser();
    const profiles = this.getAllLocalProfiles();
    const sessions = this.getLocalSessions().filter(
      s => (s.user_a_id === currentUser.id || s.user_b_id === currentUser.id) && s.status === 'upcoming'
    );
    if (sessions.length === 0) return null;

    const s = sessions[0];
    const partnerId = s.user_a_id === currentUser.id ? s.user_b_id : s.user_a_id;
    return {
      ...s,
      partner_profile: profiles.find(p => p.id === partnerId)
    };
  },

  async getAllSessions(): Promise<StudySession[]> {
    const currentUser = await this.getCurrentUser();
    const profiles = this.getAllLocalProfiles();
    return this.getLocalSessions()
      .filter(s => s.user_a_id === currentUser.id || s.user_b_id === currentUser.id)
      .map(s => ({
        ...s,
        partner_profile: profiles.find(p => p.id === (s.user_a_id === currentUser.id ? s.user_b_id : s.user_a_id))
      }));
  },

  async confirmAttendance(sessionId: string, userKey: 'user_a' | 'user_b'): Promise<StudySession> {
    const sessions = this.getLocalSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    if (userKey === 'user_a') session.user_a_confirmed = true;
    else session.user_b_confirmed = true;

    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    return session;
  },

  async toggleSessionGoal(sessionId: string, goalId: string): Promise<StudySession> {
    const sessions = this.getLocalSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    session.goals_checklist = session.goals_checklist.map(g =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );

    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

    // Phát tín hiệu broadcast đồng bộ sang tab khác
    this.broadcastEvent({ type: 'GOAL_TOGGLED', sessionId, goalId });
    return session;
  },

  async attachResourceToSession(sessionId: string, resourceId: string): Promise<void> {
    const sessions = this.getLocalSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.resource_id = resourceId;
      localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    }
  },

  async completeSession(
    sessionId: string,
    retentionChoice: 'keep' | 'change'
  ): Promise<{ completed: boolean; refundedAmount: number; streak: number }> {
    const sessions = this.getLocalSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'completed';
    session.partner_retention_choice = retentionChoice;
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

    // Hoàn trả 100% tiền cọc (50.000đ), tăng streak và tổng giờ học
    const currentUser = await this.getCurrentUser();
    const newStreak = currentUser.streak_days + 1;
    const addedMinutes = session.duration_minutes || 25;
    await this.updateProfile({
      streak_days: newStreak,
      total_study_minutes: currentUser.total_study_minutes + addedMinutes
    });

    this.broadcastEvent({ type: 'SESSION_COMPLETED', sessionId });

    return {
      completed: true,
      refundedAmount: 50000,
      streak: newStreak
    };
  },

  async reportMissedSession(sessionId: string): Promise<{ penalty: number; compensatedToPartner: number }> {
    const sessions = this.getLocalSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'missed';
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

    // Trừ 10.000đ tiền cọc của người bùng: 5.000đ đền bù cho bạn học, 5.000đ phí vận hành
    const currentUser = await this.getCurrentUser();
    const newDeposit = Math.max(0, currentUser.commitment_deposit - 10000);
    await this.updateProfile({ commitment_deposit: newDeposit });

    // Tăng tiền đền bù cho bạn học
    const partnerId = session.user_a_id === currentUser.id ? session.user_b_id : session.user_a_id;
    const profiles = this.getAllLocalProfiles().map(p => {
      if (p.id === partnerId) {
        return { ...p, commitment_deposit: p.commitment_deposit + 5000 };
      }
      return p;
    });
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));

    // Ghi nhận phí vận hành nền tảng
    const currentFee = Number(localStorage.getItem(KEYS.COMMISSION_FEE) || '0');
    localStorage.setItem(KEYS.COMMISSION_FEE, String(currentFee + 5000));

    this.broadcastEvent({ type: 'SESSION_MISSED', sessionId });

    return {
      penalty: 10000,
      compensatedToPartner: 5000
    };
  },

  async logAfkAlert(sessionId: string): Promise<number> {
    const sessions = this.getLocalSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return 0;
    session.afk_alert_count = (session.afk_alert_count || 0) + 1;
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    return session.afk_alert_count;
  },

  // -------------------------------------------------------------
  // 4. THƯ VIỆN TÀI LIỆU (RESOURCES)
  // -------------------------------------------------------------
  async getResources(
    subjectFilter?: string,
    topicFilter?: string,
    typeFilter?: string
  ): Promise<ResourceItem[]> {
    let list: ResourceItem[] = [];
    try {
      const data = localStorage.getItem(KEYS.RESOURCES);
      list = data ? JSON.parse(data) : MOCK_RESOURCES;
    } catch {
      list = MOCK_RESOURCES;
    }

    const savedIds = await this.getSavedResourceIds();
    list = list.map(r => ({
      ...r,
      is_saved: savedIds.includes(r.id)
    }));

    if (subjectFilter && subjectFilter !== 'ALL') {
      list = list.filter(r => r.subject.includes(subjectFilter) || subjectFilter.includes(r.subject));
    }
    if (topicFilter && topicFilter !== 'ALL') {
      list = list.filter(r => r.topic === topicFilter);
    }
    if (typeFilter && typeFilter !== 'ALL') {
      list = list.filter(r => r.resource_type === typeFilter);
    }

    return list;
  },

  async getSavedResourceIds(): Promise<string[]> {
    try {
      const data = localStorage.getItem(KEYS.SAVED_RESOURCES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async toggleBookmarkResource(resourceId: string): Promise<boolean> {
    const saved = await this.getSavedResourceIds();
    let isSavedNow = false;
    let nextSaved: string[] = [];

    if (saved.includes(resourceId)) {
      nextSaved = saved.filter(id => id !== resourceId);
      isSavedNow = false;
    } else {
      nextSaved = [...saved, resourceId];
      isSavedNow = true;
    }

    localStorage.setItem(KEYS.SAVED_RESOURCES, JSON.stringify(nextSaved));
    return isSavedNow;
  },

  // -------------------------------------------------------------
  // 5. DOANH THU & THEO DÕI FAKE DOOR TEST (PAYMENTS)
  // -------------------------------------------------------------
  async trackPaymentClick(planCode: 'plus_59k' | 'sprint_29k' | 'plus_29k' | 'sprint_19k', amount: number): Promise<PaymentEvent> {
    const currentUser = await this.getCurrentUser();
    const event: PaymentEvent = {
      id: `pay-${Date.now()}`,
      user_id: currentUser.id,
      plan_code: planCode,
      amount,
      user_confirmed_transfer: false,
      clicked_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('payment_events').insert({
          user_id: currentUser.id,
          plan_code: planCode,
          amount,
          user_confirmed_transfer: false
        });
      } catch (err) {
        console.warn('Supabase payment event insert error', err);
      }
    }

    const events = this.getLocalPaymentEvents();
    events.unshift(event);
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(events));

    return event;
  },

  async confirmPayment(eventId: string): Promise<void> {
    const events = this.getLocalPaymentEvents();
    const ev = events.find(e => e.id === eventId);
    if (ev) {
      ev.user_confirmed_transfer = true;
      localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(events));

      // Nâng cấp gói người dùng tương ứng (plus_59k -> plus, sprint_29k -> sprint)
      const targetTier = (ev.plan_code === 'plus_59k' || ev.plan_code === 'plus_29k') ? 'plus' : 'sprint';
      await this.updateProfile({ plan_tier: targetTier });
    }
  },

  getLocalPaymentEvents(): PaymentEvent[] {
    try {
      const data = localStorage.getItem(KEYS.PAYMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getStartupMetrics(): Promise<{
    totalClicks: number;
    confirmedTransfers: number;
    conversionRate: number;
    totalRevenue: number;
  }> {
    const events = this.getLocalPaymentEvents();
    const totalClicks = events.length;
    const confirmed = events.filter(e => e.user_confirmed_transfer);
    const confirmedTransfers = confirmed.length;
    const conversionRate = totalClicks > 0 ? Math.round((confirmedTransfers / totalClicks) * 100) : 0;
    const totalRevenue = confirmed.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalClicks,
      confirmedTransfers,
      conversionRate,
      totalRevenue
    };
  },

  // -------------------------------------------------------------
  // 6. AN TOÀN & BÁO CÁO / CHẶN (SAFETY)
  // -------------------------------------------------------------
  getBlockedUserIds(): string[] {
    try {
      const data = localStorage.getItem(KEYS.BLOCKED);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async reportOrBlockUser(targetUserId: string, action: 'report' | 'block', reason: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    const report: SafetyReport = {
      id: `rep-${Date.now()}`,
      reporter_id: currentUser.id,
      reported_user_id: targetUserId,
      action_type: action,
      reason,
      created_at: new Date().toISOString()
    };

    if (action === 'block') {
      const blocked = this.getBlockedUserIds();
      if (!blocked.includes(targetUserId)) {
        blocked.push(targetUserId);
        localStorage.setItem(KEYS.BLOCKED, JSON.stringify(blocked));
      }
    }

    try {
      const raw = localStorage.getItem(KEYS.REPORTS);
      const reports: SafetyReport[] = raw ? JSON.parse(raw) : [];
      reports.push(report);
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn('Error saving report', e);
    }
  },

  // -------------------------------------------------------------
  // 7. REALTIME BROADCAST DÀNH CHO BẢNG TRẮNG & PHÒNG HỌC
  // -------------------------------------------------------------
  broadcastChannel: typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('studymatch_realtime_mesh')
    : null,

  broadcastEvent(event: any) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(event);
      } catch (err) {
        console.warn('BroadcastChannel error', err);
      }
    }
  },

  subscribeToBroadcast(callback: (event: any) => void): () => void {
    if (!this.broadcastChannel) return () => {};
    const handler = (e: MessageEvent) => callback(e.data);
    this.broadcastChannel.addEventListener('message', handler);
    return () => this.broadcastChannel?.removeEventListener('message', handler);
  }
};
