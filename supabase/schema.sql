-- ========================================================================
-- STUDYMATCH DATABASE SCHEMA (SUPABASE POSTGRESQL + RLS)
-- Project: StudyMatch - Peer Learning & Commitment Study Room
-- Target Audience: University Students (HUST, FTU, UEH, etc.)
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- Lưu trữ hồ sơ học tập và trạng thái cam kết kỷ luật của sinh viên
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    university TEXT NOT NULL DEFAULT 'Đại học Bách khoa Hà Nội (HUST)',
    is_edu_verified BOOLEAN NOT NULL DEFAULT false,
    priority_subject TEXT NOT NULL DEFAULT 'MI1111 - Giải tích 1',
    weak_topics TEXT[] NOT NULL DEFAULT '{}',
    strong_topics TEXT[] NOT NULL DEFAULT '{}',
    self_level INT NOT NULL DEFAULT 1 CHECK (self_level IN (1, 2, 3)), -- 1 = Mất gốc, 2 = Cơ bản, 3 = Khá muốn ôn sâu
    learning_goal TEXT NOT NULL DEFAULT 'Cùng giải bài tập', -- 'Cùng giải bài tập' | 'Ôn lý thuyết qua môn' | 'Luyện đề đạt A/A+'
    learning_style TEXT NOT NULL DEFAULT 'Thảo luận sôi nổi', -- 'Thảo luận sôi nổi' | 'Pomodoro yên lặng' | 'Hỏi đáp nhanh phần khó'
    free_slots TEXT[] NOT NULL DEFAULT '{"T2_TOI", "T4_TOI", "T6_TOI"}', -- Mã ca: T2_SANG, T2_CHIEU, T2_TOI, ...
    streak_days INT NOT NULL DEFAULT 0,
    total_study_minutes INT NOT NULL DEFAULT 0,
    commitment_deposit INT NOT NULL DEFAULT 50000, -- Số dư Quỹ Cam Kết Kỷ Luật (VNĐ)
    free_invites_used INT NOT NULL DEFAULT 0, -- Số lời mời đã gửi (tối đa 3 cho Free tier)
    plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'sprint', 'plus')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Bảo mật thông tin: Không lưu email/số điện thoại công khai trong bảng profiles
COMMENT ON TABLE public.profiles IS 'Hồ sơ người dùng StudyMatch. Tuyệt đối ẩn email và số điện thoại trên public view.';

-- 2. RESOURCES TABLE
-- Thư viện 15+ tài liệu chuẩn hóa Giải tích 1, Đại số, Hóa học đại cương
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('Ghi chú', 'Bài tập', 'Đề ôn tập')),
    title TEXT NOT NULL,
    copyright_verified BOOLEAN NOT NULL DEFAULT true,
    content_markdown TEXT NOT NULL,
    formula_summary TEXT NOT NULL,
    flashcards JSONB NOT NULL DEFAULT '[]'::jsonb, -- Mảng [{front: text, back: text}]
    mini_quiz JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Mảng [{question: text, options: text[], correctIndex: int, explanation: text}]
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. SAVED RESOURCES TABLE (Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_resources (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, resource_id)
);

-- 4. MATCH REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.match_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    compatibility_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    match_reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. STUDY SESSIONS TABLE (Phòng học cam kết)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    scheduled_slot TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 25 CHECK (duration_minutes IN (25, 50)),
    user_a_confirmed BOOLEAN NOT NULL DEFAULT false,
    user_b_confirmed BOOLEAN NOT NULL DEFAULT false,
    goals_checklist JSONB NOT NULL DEFAULT '[
        {"id": "1", "text": "Tóm tắt định lý và công thức trọng tâm", "completed": false},
        {"id": "2", "text": "Giải xong 3 bài tập mẫu tự luyện", "completed": false},
        {"id": "3", "text": "Đối chiếu kết quả và giảng giải chéo phần vướng", "completed": false}
    ]'::jsonb,
    resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    external_meet_url TEXT DEFAULT 'https://meet.google.com/new',
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'missed')),
    partner_retention_choice TEXT DEFAULT NULL CHECK (partner_retention_choice IN ('keep', 'change', null)),
    afk_alert_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PAYMENT EVENTS TABLE (Đo lường Fake Door Test)
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_code TEXT NOT NULL CHECK (plan_code IN ('plus_29k', 'sprint_19k')),
    amount INT NOT NULL,
    user_confirmed_transfer BOOLEAN NOT NULL DEFAULT false,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. SAFETY REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.safety_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('report', 'block')),
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Bất kỳ ai đăng nhập cũng có thể xem hồ sơ học tập của bạn học (trừ dữ liệu nhạy cảm)
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Profiles: Chỉ chính chủ mới được sửa hồ sơ cá nhân
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Resources: Mọi người dùng đều có thể đọc tài liệu học tập
CREATE POLICY "Resources are readable by everyone"
ON public.resources FOR SELECT
TO authenticated, anon
USING (true);

-- Saved resources: Người dùng xem và lưu tài liệu của riêng mình
CREATE POLICY "Users manage their saved resources"
ON public.saved_resources FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Match requests: Chỉ người gửi hoặc người nhận mới xem và tương tác
CREATE POLICY "Users view involved match requests"
ON public.match_requests FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create match requests"
ON public.match_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can update match requests"
ON public.match_requests FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id);

-- Study sessions: Người trong phòng học mới có quyền xem và cập nhật
CREATE POLICY "Users can view their study sessions"
ON public.study_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Users can update their study sessions"
ON public.study_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "System or user can create study sessions"
ON public.study_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Payment events: Người dùng ghi nhận và xem giao dịch của mình
CREATE POLICY "Users manage their payment events"
ON public.payment_events FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Safety reports: Người dùng tạo báo cáo và xem báo cáo do mình tạo
CREATE POLICY "Users manage their safety reports"
ON public.safety_reports FOR ALL
TO authenticated
USING (auth.uid() = reporter_id)
WITH CHECK (auth.uid() = reporter_id);

-- Trigger tự động kiểm tra .edu.vn khi tạo tài khoản
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_email TEXT;
    is_edu BOOLEAN;
BEGIN
    user_email := new.email;
    is_edu := (user_email ILIKE '%.edu.vn%');
    
    INSERT INTO public.profiles (id, display_name, university, is_edu_verified)
    VALUES (
        new.id,
        COALESPE(new.raw_user_meta_data->>'full_name', split_part(user_email, '@', 1)),
        CASE WHEN is_edu THEN 'Đại học Bách khoa Hà Nội' ELSE 'Tài khoản Trải nghiệm' END,
        is_edu
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào auth.users (khi chạy trên Supabase thật)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
