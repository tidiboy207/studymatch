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
  }
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

export const LEARNING_GOALS = [
  'Cùng giải bài tập',
  'Ôn lý thuyết qua môn',
  'Luyện đề đạt A/A+'
];

export const LEARNING_STYLES = [
  'Thảo luận sôi nổi',
  'Pomodoro yên lặng',
  'Hỏi đáp nhanh phần khó'
];

export const SELF_LEVELS = [
  { level: 1, title: 'Mất gốc', desc: 'Bị hổng bài tập, sợ bài khó, cần người kéo' },
  { level: 2, title: 'Cơ bản', desc: 'Nắm được lý thuyết, cần rèn tốc độ giải đề' },
  { level: 3, title: 'Khá muốn ôn sâu', desc: 'Muốn luyện đề A/A+ và giảng giải cho bạn' }
] as const;
