export type PlanTier = 'free' | 'sprint' | 'plus';

export interface UserSubjectDetail {
  subject_id: string;      // VD: MI1111
  code: string;            // VD: MI1111
  name: string;            // VD: Giải tích 1
  fullName: string;        // VD: MI1111 - Giải tích 1
  proficiency: 1 | 2 | 3;  // 1 = Mất gốc / Cần kéo, 2 = Cơ bản / Rèn đề, 3 = Khá giỏi / Ôn sâu
  strong_topics: string[]; // Chủ đề nắm vững của riêng môn này
  weak_topics: string[];   // Chủ đề đang yếu của riêng môn này
}

export interface UserProfile {
  id: string;
  email?: string;          // Email Google OAuth / tài khoản (Ẩn tuyệt đối trên hồ sơ công khai)
  avatar_url?: string;     // Ảnh đại diện Google hoặc tải lên
  display_name: string;
  university: string;
  major?: string;          // Ngành học (BẮT BUỘC MỚI)
  bio?: string;            // Giới thiệu bản thân (TÍNH NĂNG MỚI)
  is_onboarded?: boolean;  // Cờ hoàn thành Onboarding lần đầu
  is_edu_verified: boolean;
  is_email_verified?: boolean; // Xác thực email chính chủ
  email_verified_at?: string;
  priority_subject: string;
  subjects_detail?: UserSubjectDetail[]; // Danh sách môn học với trình độ & điểm mạnh/yếu riêng biệt
  weak_topics: string[];
  strong_topics: string[];
  self_level: 1 | 2 | 3;   // 1 = Mất gốc, 2 = Cơ bản, 3 = Khá muốn ôn sâu (áp dụng tổng quan/fallback)
  learning_goal: string;   // 'Cùng giải bài tập' | 'Ôn lý thuyết qua môn' | 'Luyện đề đạt A/A+'
  learning_style: string;  // 'Thảo luận sôi nổi' | 'Pomodoro yên tĩnh' | 'Hỏi đáp nhanh phần khó'
  free_slots: string[];    // ["T2_TOI", "T4_TOI", "T6_TOI"]
  streak_days: number;
  total_study_minutes: number;
  commitment_deposit: number; // e.g. 50000 VNĐ
  free_invites_used: number;  // Max 3 for free tier
  plan_tier: PlanTier;
  created_at?: string;
  updated_at?: string;
}

export interface MatchScoreDetails {
  totalScore: number;
  cScore: number; // Môn học & Chủ đề bù trừ (0-100)
  tScore: number; // Lịch rảnh (0-100)
  gScore: number; // Mục tiêu (0-100)
  lScore: number; // Phong cách học (0-100)
  reason: string;
  matchedSlots: string[];
  complementaryTopics: string[];
}

export interface MatchCandidate {
  profile: UserProfile;
  scoreDetails: MatchScoreDetails;
}

export interface MatchingWeights {
  c: number; // Default 0.35
  t: number; // Default 0.30
  g: number; // Default 0.20
  l: number; // Default 0.15
}

export interface MatchRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  compatibility_score: number;
  match_reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender_profile?: UserProfile;
  receiver_profile?: UserProfile;
}

export interface SessionGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface StudySession {
  id: string;
  user_a_id: string;
  user_b_id: string;
  subject: string;
  topic: string;
  scheduled_slot: string;
  duration_minutes: 25 | 50;
  user_a_confirmed: boolean;
  user_b_confirmed: boolean;
  goals_checklist: SessionGoal[];
  resource_id: string | null;
  external_meet_url: string;
  status: 'upcoming' | 'completed' | 'missed';
  partner_retention_choice: 'keep' | 'change' | null;
  afk_alert_count: number;
  created_at: string;
  partner_profile?: UserProfile;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ResourceItem {
  id: string;
  subject: string;
  topic: string;
  resource_type: 'Ghi chú' | 'Bài tập' | 'Đề ôn tập';
  title: string;
  copyright_verified: boolean;
  content_markdown: string;
  formula_summary: string;
  flashcards: Flashcard[];
  mini_quiz: QuizQuestion[];
  created_at?: string;
  is_saved?: boolean;
}

export interface PaymentEvent {
  id: string;
  user_id: string;
  plan_code: 'plus_59k' | 'sprint_29k' | 'plus_29k' | 'sprint_19k';
  amount: number;
  user_confirmed_transfer: boolean;
  clicked_at: string;
}

export interface SafetyReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  action_type: 'report' | 'block';
  reason: string;
  created_at: string;
}

export interface SubjectCatalogItem {
  code: string;
  name: string;
  fullName: string;
  description: string;
  topics: string[];
}

export interface EmailVerificationState {
  email: string;
  otp: string;
  token: string;
  user_data: {
    displayName: string;
    university?: string;
    major?: string;
  };
  expires_at: number;
  sent_at: string;
}

export interface SimulatedEmailMessage {
  id: string;
  to: string;
  subject: string;
  sender: string;
  otp: string;
  magicLink: string;
  sentAt: string;
}
