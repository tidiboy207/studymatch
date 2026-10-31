import { UserProfile } from '../types';

export const STUDENT_A_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
export const STUDENT_B_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: STUDENT_A_ID,
    email: 'tuananh.nguyen@sis.hust.edu.vn',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    display_name: 'Nguyễn Tuấn Anh',
    university: 'Đại học Bách khoa Hà Nội (HUST)',
    major: 'Khoa học dữ liệu & Trí tuệ nhân tạo (Data Science & AI)',
    bio: 'Mình là sinh viên năm 2 ngành Data Science & AI. Thích học nhóm, giải bài tập và trao đổi kiến thức. Đang tìm bạn ôn Giải tích và Xác suất cùng nhau!',
    is_onboarded: true,
    is_edu_verified: true,
    priority_subject: 'MI1111 - Giải tích 1',
    subjects_detail: [
      {
        subject_id: 'MI1111',
        code: 'MI1111',
        name: 'Giải tích 1',
        fullName: 'MI1111 - Giải tích 1',
        proficiency: 1, // Mất gốc
        strong_topics: ['Giới hạn & Liên tục'],
        weak_topics: ['Tích phân suy rộng', 'Chuỗi số']
      },
      {
        subject_id: 'MI2020',
        code: 'MI2020',
        name: 'Xác suất & Thống kê',
        fullName: 'MI2020 - Xác suất & Thống kê',
        proficiency: 2, // Cơ bản
        strong_topics: ['Xác suất cổ điển & Điều kiện'],
        weak_topics: ['Ước lượng tham số', 'Kiểm định giả thuyết']
      }
    ],
    weak_topics: ['Tích phân suy rộng', 'Chuỗi số'],
    strong_topics: ['Giới hạn & Liên tục'],
    self_level: 1, // Mất gốc
    learning_goal: 'Cùng giải bài tập',
    learning_style: 'Pomodoro yên tĩnh',
    free_slots: ['T2_TOI', 'T4_TOI', 'T6_TOI'],
    streak_days: 3,
    total_study_minutes: 150,
    commitment_deposit: 50000,
    free_invites_used: 1,
    plan_tier: 'free',
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: STUDENT_B_ID,
    email: 'duc.tm22@sis.hust.edu.vn',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    display_name: 'Trần Minh Đức',
    university: 'Đại học Bách khoa Hà Nội (HUST)',
    major: 'Khoa học máy tính (Computer Science)',
    bio: 'Sinh viên năm 3 K67 Khoa học máy tính. Đam mê thuật toán, sẵn sàng giảng giải chi tiết các phần tích phân suy rộng và chuỗi số cho bạn học.',
    is_onboarded: true,
    is_edu_verified: true,
    priority_subject: 'MI1111 - Giải tích 1',
    subjects_detail: [
      {
        subject_id: 'MI1111',
        code: 'MI1111',
        name: 'Giải tích 1',
        fullName: 'MI1111 - Giải tích 1',
        proficiency: 3, // Khá giỏi ôn sâu
        strong_topics: ['Tích phân suy rộng', 'Chuỗi số'],
        weak_topics: ['Đạo hàm & Vi phân']
      },
      {
        subject_id: 'IT3011',
        code: 'IT3011',
        name: 'Cấu trúc dữ liệu & Giải thuật',
        fullName: 'IT3011 - Cấu trúc dữ liệu & Giải thuật',
        proficiency: 3,
        strong_topics: ['Mảng & Danh sách liên kết', 'Cây nhị phân & AVL', 'Quy hoạch động'],
        weak_topics: ['Đồ thị (BFS / DFS)']
      }
    ],
    weak_topics: ['Đạo hàm & Vi phân'],
    strong_topics: ['Tích phân suy rộng', 'Chuỗi số'],
    self_level: 3, // Khá muốn ôn sâu
    learning_goal: 'Luyện đề đạt A/A+',
    learning_style: 'Thảo luận sôi nổi',
    free_slots: ['T2_TOI', 'T4_TOI', 'T7_TOI'],
    streak_days: 12,
    total_study_minutes: 720,
    commitment_deposit: 50000,
    free_invites_used: 0,
    plan_tier: 'plus',
    created_at: '2026-09-15T10:00:00Z'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    email: 'huong.ltm@ftu.edu.vn',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    display_name: 'Lê Thị Mai Hương',
    university: 'Đại học Ngoại thương (FTU)',
    major: 'Kinh tế quốc tế (International Economics)',
    bio: 'Năm 2 FTU, đang ôn luyện các môn khoa học cơ bản và Kinh tế vi mô. Tìm bạn học nghiêm túc cùng bật cam Pomodoro quán cà phê.',
    is_onboarded: true,
    is_edu_verified: true,
    priority_subject: 'CH1015 - Hóa học đại cương',
    subjects_detail: [
      {
        subject_id: 'CH1015',
        code: 'CH1015',
        name: 'Hóa học đại cương',
        fullName: 'CH1015 - Hóa học đại cương',
        proficiency: 2,
        strong_topics: ['Nhiệt động học'],
        weak_topics: ['Cân bằng hóa học', 'Điện hóa học']
      },
      {
        subject_id: 'EM1010',
        code: 'EM1010',
        name: 'Kinh tế vi mô',
        fullName: 'EM1010 - Kinh tế vi mô',
        proficiency: 3,
        strong_topics: ['Cung - Cầu & Co giãn', 'Lý thuyết tiêu dùng'],
        weak_topics: ['Thị trường cạnh tranh hoàn hảo & Độc quyền']
      }
    ],
    weak_topics: ['Cân bằng hóa học', 'Điện hóa học'],
    strong_topics: ['Nhiệt động học'],
    self_level: 2,
    learning_goal: 'Ôn lý thuyết qua môn',
    learning_style: 'Hỏi đáp nhanh phần khó',
    free_slots: ['T3_TOI', 'T5_TOI', 'CN_TOI'],
    streak_days: 5,
    total_study_minutes: 250,
    commitment_deposit: 40000,
    free_invites_used: 2,
    plan_tier: 'sprint',
    created_at: '2026-10-05T14:20:00Z'
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    email: 'bao.hq@sis.hust.edu.vn',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    display_name: 'Hoàng Quốc Bảo',
    university: 'Đại học Bách khoa Hà Nội (HUST)',
    major: 'Kỹ thuật Hóa học & Công nghệ vật liệu',
    bio: 'K66 Bách khoa, đã qua Hóa học đại cương điểm A. Muốn tìm bạn cùng ôn thêm các môn toán kỹ thuật và kèm ngược lại phần Hóa.',
    is_onboarded: true,
    is_edu_verified: true,
    priority_subject: 'CH1015 - Hóa học đại cương',
    subjects_detail: [
      {
        subject_id: 'CH1015',
        code: 'CH1015',
        name: 'Hóa học đại cương',
        fullName: 'CH1015 - Hóa học đại cương',
        proficiency: 3,
        strong_topics: ['Cân bằng hóa học', 'Điện hóa học', 'Động hóa học'],
        weak_topics: ['Nhiệt động học']
      }
    ],
    weak_topics: ['Nhiệt động học'],
    strong_topics: ['Cân bằng hóa học', 'Điện hóa học', 'Động hóa học'],
    self_level: 3,
    learning_goal: 'Cùng giải bài tập',
    learning_style: 'Thảo luận sôi nổi',
    free_slots: ['T3_TOI', 'T5_TOI', 'T6_TOI'],
    streak_days: 9,
    total_study_minutes: 480,
    commitment_deposit: 50000,
    free_invites_used: 0,
    plan_tier: 'free',
    created_at: '2026-09-20T09:10:00Z'
  },
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    email: 'linh.vp@ueh.edu.vn',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    display_name: 'Vũ Phương Linh',
    university: 'Đại học Kinh tế TP.HCM (UEH)',
    major: 'Tài chính - Ngân hàng (Finance & Banking)',
    bio: 'Sinh viên năm 1 UEH. Đang gặp khó khăn ở phần Ma trận và Không gian vectơ trong Đại số tuyến tính. Cần tìm đồng đội kéo môn!',
    is_onboarded: true,
    is_edu_verified: true,
    priority_subject: 'MI1141 - Đại số',
    subjects_detail: [
      {
        subject_id: 'MI1141',
        code: 'MI1141',
        name: 'Đại số',
        fullName: 'MI1141 - Đại số',
        proficiency: 1,
        strong_topics: ['Hệ phương trình tuyến tính'],
        weak_topics: ['Ma trận & Định thức', 'Không gian vectơ']
      }
    ],
    weak_topics: ['Ma trận & Định thức', 'Không gian vectơ'],
    strong_topics: ['Hệ phương trình tuyến tính'],
    self_level: 1,
    learning_goal: 'Cùng giải bài tập',
    learning_style: 'Pomodoro yên tĩnh',
    free_slots: ['T2_TOI', 'T4_TOI', 'CN_SANG'],
    streak_days: 2,
    total_study_minutes: 100,
    commitment_deposit: 30000,
    free_invites_used: 3, // Dùng hết 3 lượt để kích hoạt popup nâng cấp
    plan_tier: 'free',
    created_at: '2026-10-10T11:00:00Z'
  },
  {
    id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    email: 'khoa.pd@sis.hust.edu.vn',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    display_name: 'Phạm Đăng Khoa',
    university: 'Đại học Bách khoa Hà Nội (HUST)',
    major: 'Công nghệ thông tin (IT)',
    bio: 'Thủ khoa giải tích đầu vào, GPA 3.82. Rất thích giải thích toán trừu tượng bằng trực quan hình học. Cùng nhau săn A+ nhé!',
    is_onboarded: true,
    is_edu_verified: true,
    priority_subject: 'MI1141 - Đại số',
    subjects_detail: [
      {
        subject_id: 'MI1141',
        code: 'MI1141',
        name: 'Đại số',
        fullName: 'MI1141 - Đại số',
        proficiency: 3,
        strong_topics: ['Ma trận & Định thức', 'Không gian vectơ', 'Ánh xạ tuyến tính'],
        weak_topics: ['Hệ phương trình tuyến tính']
      },
      {
        subject_id: 'IT3011',
        code: 'IT3011',
        name: 'Cấu trúc dữ liệu & Giải thuật',
        fullName: 'IT3011 - Cấu trúc dữ liệu & Giải thuật',
        proficiency: 3,
        strong_topics: ['Đồ thị (BFS / DFS)', 'Quy hoạch động'],
        weak_topics: ['Cây nhị phân & AVL']
      }
    ],
    weak_topics: ['Hệ phương trình tuyến tính'],
    strong_topics: ['Ma trận & Định thức', 'Không gian vectơ', 'Ánh xạ tuyến tính'],
    self_level: 3,
    learning_goal: 'Luyện đề đạt A/A+',
    learning_style: 'Thảo luận sôi nổi',
    free_slots: ['T2_TOI', 'T4_TOI', 'T6_TOI'],
    streak_days: 15,
    total_study_minutes: 950,
    commitment_deposit: 50000,
    free_invites_used: 1,
    plan_tier: 'plus',
    created_at: '2026-09-10T08:30:00Z'
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    email: 'thaovy.dang@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    display_name: 'Đặng Thảo Vy',
    university: 'Tài khoản Trải nghiệm',
    major: 'Quản trị kinh doanh (Business Administration)',
    bio: 'Tự học ôn thi chứng chỉ và củng cố toán giải tích đại cương. Thích không gian học lofi ấm cúng, hẹn giờ Pomodoro cùng nhau.',
    is_onboarded: true,
    is_edu_verified: false, // Gmail thường
    priority_subject: 'MI1111 - Giải tích 1',
    subjects_detail: [
      {
        subject_id: 'MI1111',
        code: 'MI1111',
        name: 'Giải tích 1',
        fullName: 'MI1111 - Giải tích 1',
        proficiency: 2,
        strong_topics: ['Đạo hàm & Vi phân'],
        weak_topics: ['Chuỗi số']
      }
    ],
    weak_topics: ['Chuỗi số'],
    strong_topics: ['Đạo hàm & Vi phân'],
    self_level: 2,
    learning_goal: 'Cùng giải bài tập',
    learning_style: 'Pomodoro yên tĩnh',
    free_slots: ['T3_CHIEU', 'T5_CHIEU', 'T7_SANG'],
    streak_days: 1,
    total_study_minutes: 50,
    commitment_deposit: 20000,
    free_invites_used: 0,
    plan_tier: 'free',
    created_at: '2026-10-18T16:00:00Z'
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    email: 'tri.nh@sis.hust.edu.vn',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    display_name: 'Nguyễn Hữu Trí',
    university: 'Đại học Bách khoa Hà Nội (HUST)',
    major: 'Kỹ thuật Cơ điện tử',
    bio: 'Năm 2 Cơ điện tử. Cần cải thiện điểm Giữa kỳ Giải tích 1. Học kỳ này quyết tâm đổi vận GPA!',
    is_onboarded: true,
    is_edu_verified: true,
    priority_subject: 'MI1111 - Giải tích 1',
    subjects_detail: [
      {
        subject_id: 'MI1111',
        code: 'MI1111',
        name: 'Giải tích 1',
        fullName: 'MI1111 - Giải tích 1',
        proficiency: 2,
        strong_topics: ['Giới hạn & Liên tục', 'Đạo hàm & Vi phân'],
        weak_topics: ['Tích phân suy rộng']
      }
    ],
    weak_topics: ['Tích phân suy rộng'],
    strong_topics: ['Giới hạn & Liên tục', 'Đạo hàm & Vi phân'],
    self_level: 2,
    learning_goal: 'Ôn lý thuyết qua môn',
    learning_style: 'Hỏi đáp nhanh phần khó',
    free_slots: ['T2_TOI', 'T5_TOI', 'CN_TOI'],
    streak_days: 4,
    total_study_minutes: 200,
    commitment_deposit: 50000,
    free_invites_used: 1,
    plan_tier: 'sprint',
    created_at: '2026-10-12T13:45:00Z'
  }
];
