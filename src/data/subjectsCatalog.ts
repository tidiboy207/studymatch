import { SubjectCatalogItem } from '../types';

export const SUBJECTS_CATALOG: SubjectCatalogItem[] = [
  {
    code: 'MI1111',
    name: 'Giải tích 1',
    fullName: 'MI1111 - Giải tích 1',
    description: 'Học phần đại cương cốt lõi khối Kỹ thuật, tỷ lệ trượt ~25-35%',
    topics: [
      'Giới hạn & Liên tục',
      'Đạo hàm & Vi phân',
      'Tích phân suy rộng',
      'Chuỗi số'
    ]
  },
  {
    code: 'MI1141',
    name: 'Đại số',
    fullName: 'MI1141 - Đại số',
    description: 'Nền tảng toán học trừu tượng về không gian tuyến tính và ma trận',
    topics: [
      'Ma trận & Định thức',
      'Hệ phương trình tuyến tính',
      'Không gian vectơ',
      'Ánh xạ tuyến tính'
    ]
  },
  {
    code: 'IT3011',
    name: 'Cấu trúc dữ liệu & Giải thuật',
    fullName: 'IT3011 - Cấu trúc dữ liệu & Giải thuật',
    description: 'Môn học nền tảng kỹ thuật lập trình và tư duy thuật toán cốt lõi CNTT',
    topics: [
      'Mảng & Danh sách liên kết',
      'Ngăn xếp & Hàng đợi',
      'Cây nhị phân & AVL',
      'Đồ thị (BFS / DFS)',
      'Quy hoạch động'
    ]
  },
  {
    code: 'MI2020',
    name: 'Xác suất & Thống kê',
    fullName: 'MI2020 - Xác suất & Thống kê',
    description: 'Xác suất ứng dụng, thống kê mô tả và suy diễn định lượng trong AI & Kinh tế',
    topics: [
      'Xác suất cổ điển & Điều kiện',
      'Biến ngẫu nhiên & Phân phối chuẩn',
      'Ước lượng tham số',
      'Kiểm định giả thuyết',
      'Hồi quy tuyến tính'
    ]
  },
  {
    code: 'CH1015',
    name: 'Hóa học đại cương',
    fullName: 'CH1015 - Hóa học đại cương',
    description: 'Học phần cơ sở định lượng về năng lượng phản ứng, tốc độ và điện hóa',
    topics: [
      'Nhiệt động học',
      'Cân bằng hóa học',
      'Động hóa học',
      'Điện hóa học'
    ]
  },
  {
    code: 'PH1110',
    name: 'Vật lý đại cương 1',
    fullName: 'PH1110 - Vật lý đại cương 1',
    description: 'Cơ học chất điểm, cơ học vật rắn và thuyết tương đối',
    topics: [
      'Động học chất điểm',
      'Động lực học hệ chất điểm',
      'Cơ học vật rắn & Moment',
      'Dao động & Sóng cơ'
    ]
  },
  {
    code: 'EM1010',
    name: 'Kinh tế vi mô',
    fullName: 'EM1010 - Kinh tế vi mô',
    description: 'Nguyên lý kinh tế, hành vi người tiêu dùng và cấu trúc thị trường',
    topics: [
      'Cung - Cầu & Co giãn',
      'Lý thuyết tiêu dùng',
      'Chi phí sản xuất ngắn & dài hạn',
      'Thị trường cạnh tranh hoàn hảo & Độc quyền'
    ]
  }
];

export const MAJORS_CATALOG = [
  'Khoa học dữ liệu & Trí tuệ nhân tạo (Data Science & AI)',
  'Công nghệ thông tin (IT)',
  'Khoa học máy tính (Computer Science)',
  'Kỹ thuật máy tính (Computer Engineering)',
  'Kỹ thuật phần mềm (Software Engineering)',
  'Kỹ thuật điện tử & Viễn thông',
  'Kỹ thuật điều khiển & Tự động hóa',
  'Quản trị kinh doanh (Business Administration)',
  'Kinh tế quốc tế (International Economics)',
  'Tài chính - Ngân hàng (Finance & Banking)',
  'Logistics & Quản lý chuỗi cung ứng',
  'An toàn thông tin (Cybersecurity)',
  'Kỹ thuật Cơ điện tử',
  'Thương mại điện tử (E-Commerce)'
];

export const UNIVERSITIES_CATALOG = [
  'Đại học Bách khoa Hà Nội (HUST)',
  'Đại học Ngoại thương (FTU)',
  'Đại học Kinh tế Quốc dân (NEU)',
  'Đại học Quốc gia Hà Nội (VNU-HN)',
  'Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
  'Đại học Bách khoa - ĐHQG TP.HCM (HCMUT)',
  'Đại học Kinh tế TP.HCM (UEH)',
  'Đại học Công nghệ Thông tin - ĐHQG TP.HCM (UIT)',
  'Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (HCMUS)',
  'Đại học FPT',
  'Đại học RMIT Việt Nam',
  'Đại học Cần Thơ (CTU)',
  'Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE)'
];

export interface SlotDefinition {
  code: string;
  dayLabel: string;
  shiftLabel: string;
  timeRange: string;
}

export const DAYS_OF_WEEK = [
  { key: 'T2', label: 'Thứ 2' },
  { key: 'T3', label: 'Thứ 3' },
  { key: 'T4', label: 'Thứ 4' },
  { key: 'T5', label: 'Thứ 5' },
  { key: 'T6', label: 'Thứ 6' },
  { key: 'T7', label: 'Thứ 7' },
  { key: 'CN', label: 'Chủ Nhật' },
];

export const SHIFTS = [
  { key: 'SANG', label: 'Sáng', time: '08:00 - 11:30' },
  { key: 'CHIEU', label: 'Chiều', time: '14:00 - 17:30' },
  { key: 'TOI', label: 'Tối', time: '19:30 - 22:00' },
];

export function getSlotLabel(code: string): string {
  const parts = code.split('_');
  if (parts.length !== 2) return code;
  const day = DAYS_OF_WEEK.find(d => d.key === parts[0])?.label || parts[0];
  const shift = SHIFTS.find(s => s.key === parts[1])?.label || parts[1];
  return `${day} (${shift})`;
}

/**
 * Sinh câu tóm tắt lịch rảnh tự nhiên (Natural language availability summary)
 * Ví dụ: "Rảnh tối Thứ 2, Thứ 4 và chiều Chủ Nhật."
 */
export function getAvailabilitySummary(slots: string[]): string {
  if (!slots || slots.length === 0) {
    return 'Chưa thiết lập lịch rảnh cố định';
  }

  // Nhóm theo ca (Sáng, Chiều, Tối)
  const shiftMap: Record<string, string[]> = {
    TOI: [],
    CHIEU: [],
    SANG: []
  };

  slots.forEach(slot => {
    const [day, shift] = slot.split('_');
    const dayObj = DAYS_OF_WEEK.find(d => d.key === day);
    if (dayObj && shiftMap[shift]) {
      shiftMap[shift].push(dayObj.label);
    }
  });

  const phrases: string[] = [];

  const shiftLabels: Record<string, string> = {
    TOI: 'tối',
    CHIEU: 'chiều',
    SANG: 'sáng'
  };

  ['TOI', 'CHIEU', 'SANG'].forEach(key => {
    const days = shiftMap[key];
    if (days && days.length > 0) {
      if (days.length === 1) {
        phrases.push(`${shiftLabels[key]} ${days[0]}`);
      } else {
        const last = days[days.length - 1];
        const rest = days.slice(0, -1).join(', ');
        phrases.push(`${shiftLabels[key]} ${rest} & ${last}`);
      }
    }
  });

  if (phrases.length === 0) {
    return `Rảnh ${slots.length} ca trong tuần`;
  }

  if (phrases.length === 1) {
    return `Rảnh ${phrases[0]}.`;
  }

  const lastPhrase = phrases.pop();
  return `Rảnh ${phrases.join(', ')} và ${lastPhrase}.`;
}

export const LEARNING_GOALS = [
  'Cùng giải bài tập',
  'Ôn lý thuyết qua môn',
  'Luyện đề đạt A/A+'
];

export const LEARNING_STYLES = [
  'Thảo luận sôi nổi',
  'Pomodoro yên tĩnh',
  'Hỏi đáp nhanh phần khó'
];

export const SELF_LEVELS = [
  { level: 1, title: 'Mất gốc', desc: 'Bị hổng bài tập, sợ bài khó, cần người kéo' },
  { level: 2, title: 'Cơ bản', desc: 'Nắm được lý thuyết, cần rèn tốc độ giải đề' },
  { level: 3, title: 'Khá muốn ôn sâu', desc: 'Muốn luyện đề A/A+ và giảng giải cho bạn' }
] as const;
