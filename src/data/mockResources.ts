import { ResourceItem } from '../types';

export const MOCK_RESOURCES: ResourceItem[] = [
  // --- MI1111 - GIẢI TÍCH 1 (5 TÀI LIỆU) ---
  {
    id: '11111111-1111-1111-1111-111111111101',
    subject: 'MI1111 - Giải tích 1',
    topic: 'Giới hạn & Liên tục',
    resource_type: 'Ghi chú',
    title: 'Tóm tắt các Vô cùng bé tương đương & Quy tắc L\'Hôpital',
    copyright_verified: true,
    content_markdown: `### 1. Bảng Vô cùng bé (VCB) tương đương khi x → 0
- $\\sin x \\sim x$
- $\\tan x \\sim x$
- $\\arcsin x \\sim x$
- $\\arctan x \\sim x$
- $\\ln(1 + x) \\sim x$
- $e^x - 1 \\sim x$
- $(1 + x)^\\alpha - 1 \\sim \\alpha x$
- $1 - \\cos x \\sim \\frac{x^2}{2}$

### 2. Định lý kẹp và các Giới hạn quan trọng
- $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$
- $\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e$
- $\\lim_{x \\to 0} (1 + x)^{1/x} = e$

### 3. Quy tắc L'Hôpital
Áp dụng cho các dạng vô định $\\left[\\frac{0}{0}\\right]$ và $\\left[\\frac{\\infty}{\\infty}\\right]$:
$$\\lim_{x \\to x_0} \\frac{f(x)}{g(x)} = \\lim_{x \\to x_0} \\frac{f'(x)}{g'(x)}$$
*Lưu ý:* Bắt buộc kiểm tra điều kiện hàm số có đạo hàm và mẫu $g'(x) \\neq 0$.`,
    formula_summary: 'sin x ~ x | ln(1+x) ~ x | e^x - 1 ~ x | 1 - cos x ~ x²/2 (khi x → 0)',
    flashcards: [
      { front: 'Khi x → 0, biểu thức 1 - cos(x) tương đương với vô cùng bé nào?', back: 'x² / 2' },
      { front: 'Quy tắc L\'Hôpital áp dụng trực tiếp cho những dạng vô định nào?', back: 'Chỉ áp dụng trực tiếp cho dạng 0/0 và ∞/∞' },
      { front: 'lim (x → 0) (e^(2x) - 1) / sin(3x) bằng bao nhiêu?', back: '2/3 (vì e^(2x)-1 ~ 2x và sin(3x) ~ 3x)' }
    ],
    mini_quiz: [
      {
        question: 'Khi x tiến tới 0, biểu thức ln(1 + 3x) tương đương với vô cùng bé nào?',
        options: ['3x', 'x', 'x³', '3x²'],
        correctIndex: 0,
        explanation: 'Áp dụng công thức tương đương ln(1 + u) ~ u khi u → 0, với u = 3x ta được 3x.'
      },
      {
        question: 'Giới hạn lim(x → 0) (1 - cos(2x)) / x² có giá trị là:',
        options: ['1', '2', '1/2', '4'],
        correctIndex: 1,
        explanation: '1 - cos(2x) ~ (2x)² / 2 = 4x² / 2 = 2x². Do đó giới hạn là 2.'
      },
      {
        question: 'Điều kiện để hàm số y = f(x) liên tục tại điểm x₀ là gì?',
        options: ['lim(x → x₀) f(x) tồn tại', 'f(x₀) xác định', 'lim(x → x₀) f(x) = f(x₀)', 'Đạo hàm f\'(x₀) tồn tại'],
        correctIndex: 2,
        explanation: 'Theo định nghĩa toán học, hàm số liên tục tại x₀ khi và chỉ khi lim(x → x₀) f(x) = f(x₀).'
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    subject: 'MI1111 - Giải tích 1',
    topic: 'Đạo hàm & Vi phân',
    resource_type: 'Bài tập',
    title: 'Khai triển Taylor - Maclaurin & Ứng dụng xấp xỉ',
    copyright_verified: true,
    content_markdown: `### Công thức Khai triển Maclaurin với phần dư Peano
$$f(x) = f(0) + f'(0)x + \\frac{f''(0)}{2!}x^2 + \\dots + \\frac{f^{(n)}(0)}{n!}x^n + o(x^n)$$

### Các khai triển kinh điển:
- $e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots + o(x^n)$
- $\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots$
- $\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\dots$
- $\\ln(1 + x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\dots$`,
    formula_summary: 'f(x) = ∑ f^(k)(0)/k! * x^k + o(x^n)',
    flashcards: [
      { front: 'Khai triển Maclaurin của e^x đến cấp 3 là gì?', back: '1 + x + x²/2 + x³/6 + o(x³)' },
      { front: 'Khai triển Maclaurin của sin(x) chỉ chứa lũy thừa chẵn hay lẻ?', back: 'Chỉ chứa các lũy thừa lẻ: x - x³/6 + x⁵/120 - ...' },
      { front: 'Phần dư Peano của khai triển cấp n được viết thế nào?', back: 'o(xⁿ) khi x → 0' }
    ],
    mini_quiz: [
      {
        question: 'Hệ số của x² trong khai triển Maclaurin của cos(x) là:',
        options: ['-1/2', '1/2', '-1', '0'],
        correctIndex: 0,
        explanation: 'cos(x) = 1 - x²/2! + x⁴/4! + ... nên hệ số của x² là -1/2.'
      },
      {
        question: 'Khi nào bắt buộc phải dùng khai triển Maclaurin thay cho VCB tương đương bậc 1?',
        options: ['Mọi bài toán giới hạn', 'Khi hiệu hai VCB tương đương cấp 1 triệt tiêu nhau', 'Khi x tiến ra vô cùng', 'Khi hàm số không liên tục'],
        correctIndex: 1,
        explanation: 'Khi các số hạng bậc 1 trừ nhau ra 0, phương pháp VCB tương đương thông thường mất thông tin, cần khai triển bậc cao hơn.'
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    subject: 'MI1111 - Giải tích 1',
    topic: 'Tích phân suy rộng',
    resource_type: 'Ghi chú',
    title: 'Cẩm nang Phân loại & Tiêu chuẩn Hội tụ Tích phân Suy rộng',
    copyright_verified: true,
    content_markdown: `### 1. Tích phân suy rộng loại 1 (Cận vô hạn $\\int_a^\\infty f(x)dx$)
Chuẩn Riemann: $\\int_1^\\infty \\frac{1}{x^\\alpha} dx$:
- HỘI TỤ khi $\\alpha > 1$
- PHÂN KỲ khi $\\alpha \\le 1$

### 2. Tích phân suy rộng loại 2 (Kỳ dị tại cận $\\int_a^b f(x)dx$)
Chuẩn Riemann: $\\int_0^1 \\frac{1}{x^\\alpha} dx$:
- HỘI TỤ khi $\\alpha < 1$
- PHÂN KỲ khi $\\alpha \\ge 1$

### 3. Tiêu chuẩn so sánh giới hạn
Nếu $\\lim_{x \\to \\infty} \\frac{f(x)}{g(x)} = k$ ($0 < k < \\infty$) thì $\\int f$ và $\\int g$ cùng tính chất hội tụ hay phân kỳ.`,
    formula_summary: '∫₁^∞ (1/x^α) dx hội tụ ⇔ α > 1 | ∫₀¹ (1/x^α) dx hội tụ ⇔ α < 1',
    flashcards: [
      { front: 'Tích phân ∫₁^∞ (1 / x²) dx hội tụ hay phân kỳ?', back: 'Hội tụ (do α = 2 > 1)' },
      { front: 'Tích phân ∫₀¹ (1 / √x) dx hội tụ hay phân kỳ?', back: 'Hội tụ (do α = 1/2 < 1 tại điểm kỳ dị x = 0)' },
      { front: 'Điểm kỳ dị của tích phân suy rộng loại 2 là điểm nào?', back: 'Điểm mà tại đó hàm dưới dấu tích phân tiến ra vô cực' }
    ],
    mini_quiz: [
      {
        question: 'Tích phân suy rộng ∫₁^∞ 1/x dx có tính chất gì?',
        options: ['Hội tụ về 1', 'Hội tụ về 0', 'Phân kỳ', 'Không xác định'],
        correctIndex: 2,
        explanation: 'Với α = 1, tích phân suy rộng loại 1 phân kỳ (nguyên hàm là ln|x| → ∞).'
      },
      {
        question: 'Cho f(x) ~ 1/x³ khi x → ∞. Tích phân ∫₂^∞ f(x) dx sẽ:',
        options: ['Hội tụ', 'Phân kỳ', 'Bằng 0', 'Không kết luận được'],
        correctIndex: 0,
        explanation: 'Do α = 3 > 1, theo tiêu chuẩn so sánh giới hạn tích phân hội tụ.'
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    subject: 'MI1111 - Giải tích 1',
    topic: 'Chuỗi số',
    resource_type: 'Đề ôn tập',
    title: 'Bộ 20 Câu Hỏi Khảo sát Sự Hội tụ Chuỗi số D\'Alembert & Cauchy',
    copyright_verified: true,
    content_markdown: `### 1. Chuỗi số dương và Tiêu chuẩn D'Alembert
Xét $\\lim_{n \\to \\infty} \\frac{u_{n+1}}{u_n} = L$:
- $L < 1$: Chuỗi hội tụ
- $L > 1$: Chuỗi phân kỳ
- $L = 1$: Chưa có kết luận

### 2. Tiêu chuẩn căn Cauchy
Xét $\\lim_{n \\to \\infty} \\sqrt[n]{u_n} = L$ (kết luận tương tự D'Alembert).

### 3. Chuỗi đan dấu & Tiêu chuẩn Leibniz
Chuỗi $\\sum (-1)^n a_n$ hội tụ nếu dãy $\{a_n\}$ giảm ngặt và $\\lim_{n \\to \\infty} a_n = 0$.`,
    formula_summary: 'D\'Alembert: lim(u_n+1 / u_n) = L < 1 → Hội tụ | Leibniz: a_n giảm về 0 → Hội tụ',
    flashcards: [
      { front: 'Chuỗi ∑ (1 / n!) hội tụ theo tiêu chuẩn nào đơn giản nhất?', back: 'Tiêu chuẩn D\'Alembert (tỉ số 1/(n+1) → 0 < 1)' },
      { front: 'Khi áp dụng D\'Alembert mà ra L = 1 thì cần làm gì?', back: 'Chuyển sang tiêu chuẩn Raabe, tích phân hoặc so sánh tương đương' },
      { front: 'Định lý Leibniz được áp dụng cho loại chuỗi nào?', back: 'Chuỗi đan dấu có số hạng dương giảm dần về 0' }
    ],
    mini_quiz: [
      {
        question: 'Chuỗi số ∑_{n=1}^∞ (n / 2ⁿ) hội tụ hay phân kỳ?',
        options: ['Hội tụ', 'Phân kỳ', 'Dao động', 'Không tồn tại'],
        correctIndex: 0,
        explanation: 'Áp dụng D\'Alembert: lim (n+1)/2^(n+1) * 2^n/n = 1/2 < 1 => Hội tụ.'
      },
      {
        question: 'Điều kiện cần để chuỗi số ∑ u_n hội tụ là:',
        options: ['lim u_n = 0', 'lim u_n = 1', 'u_n > 0', 'u_n tăng dần'],
        correctIndex: 0,
        explanation: 'Nếu lim u_n ≠ 0 thì chuỗi chắc chắn phân kỳ (điều kiện cần của chuỗi hội tụ).'
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    subject: 'MI1111 - Giải tích 1',
    topic: 'Tích phân suy rộng',
    resource_type: 'Bài tập',
    title: 'Phương pháp đổi biến và từng phần trong Tích phân suy rộng',
    copyright_verified: true,
    content_markdown: `### Bài toán tích phân suy rộng chứa tham số & hàm Gamma
- Định nghĩa hàm Gamma: $\\Gamma(p) = \\int_0^\\infty x^{p-1} e^{-x} dx$ ($p > 0$)
- Tính chất: $\\Gamma(p+1) = p \\Gamma(p)$, đặc biệt với $n \\in \\mathbb{N}^*$: $\\Gamma(n+1) = n!$`,
    formula_summary: 'Γ(p) = ∫₀^∞ x^(p-1) e^(-x) dx | Γ(n+1) = n!',
    flashcards: [
      { front: 'Giá trị của Γ(1) bằng bao nhiêu?', back: '1' },
      { front: 'Giá trị của Γ(4) là mấy?', back: '3! = 6' }
    ],
    mini_quiz: [
      {
        question: 'Tích phân suy rộng ∫₀^∞ e^(-x) dx có giá trị là:',
        options: ['1', '0', '∞', 'e'],
        correctIndex: 0,
        explanation: '[-e^(-x)] từ 0 đến ∞ = 0 - (-1) = 1.'
      }
    ]
  },

  // --- MI1141 - ĐẠI SỐ (5 TÀI LIỆU) ---
  {
    id: '22222222-2222-2222-2222-222222222201',
    subject: 'MI1141 - Đại số',
    topic: 'Ma trận & Định thức',
    resource_type: 'Ghi chú',
    title: 'Công thức tính Định thức ma trận cấp n & Ma trận nghịch đảo',
    copyright_verified: true,
    content_markdown: `### 1. Tính chất định thức
- $\\det(AB) = \\det(A) \\cdot \\det(B)$
- $\\det(kA) = k^n \\det(A)$ ($A$ cấp $n$)
- $\\det(A^T) = \\det(A)$
- Đổi chỗ 2 hàng hoặc 2 cột làm đổi dấu định thức.

### 2. Ma trận nghịch đảo $A^{-1}$
Tồn tại khi và chỉ khi $\\det(A) \\neq 0$:
$$A^{-1} = \\frac{1}{\\det(A)} C^T$$
Trong đó $C$ là ma trận các phần phụ đại số $C_{ij} = (-1)^{i+j} M_{ij}$.`,
    formula_summary: 'det(AB) = det(A)det(B) | det(kA) = kⁿ det(A) | A⁻¹ = (1/det A) * C^T',
    flashcards: [
      { front: 'Nếu định thức của ma trận vuông A cấp 3 bằng 4, thì det(2A) bằng bao nhiêu?', back: '2³ * 4 = 32' },
      { front: 'Ma trận vuông có det(A) = 0 được gọi là gì?', back: 'Ma trận suy biến (không khả nghịch)' },
      { front: 'det(A⁻¹) liên hệ thế nào với det(A)?', back: 'det(A⁻¹) = 1 / det(A)' }
    ],
    mini_quiz: [
      {
        question: 'Cho ma trận vuông A cấp 4 có det(A) = -3. Giá trị của det(-A) là:',
        options: ['3', '-3', '12', '-12'],
        correctIndex: 1,
        explanation: 'det(-A) = (-1)⁴ * det(A) = 1 * (-3) = -3.'
      },
      {
        question: 'Điều kiện cần và đủ để ma trận vuông A có ma trận nghịch đảo là:',
        options: ['det(A) > 0', 'det(A) ≠ 0', 'A đối xứng', 'rank(A) = 0'],
        correctIndex: 1,
        explanation: 'Ma trận vuông khả nghịch khi và chỉ khi định thức của nó khác 0.'
      }
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    subject: 'MI1141 - Đại số',
    topic: 'Hệ phương trình tuyến tính',
    resource_type: 'Bài tập',
    title: 'Phương pháp Gauss-Jordan & Định lý Kronecker-Capelli',
    copyright_verified: true,
    content_markdown: `### Định lý Kronecker-Capelli
Hệ phương trình $Ax = b$ có nghiệm khi và chỉ khi $\\text{rank}(A) = \\text{rank}(A|b) = r$.
- $r = n$ (số ẩn): Hệ có NGHIỆM DUY NHẤT.
- $r < n$: Hệ có VÔ SỐ NGHIỆM (phụ thuộc vào $n - r$ ẩn tự do).
- $\\text{rank}(A) < \\text{rank}(A|b)$: Hệ VÔ NGHIỆM.`,
    formula_summary: 'rank(A) = rank(A|b) = n: Duy nhất | < n: Vô số nghiệm | rank(A) < rank(A|b): Vô nghiệm',
    flashcards: [
      { front: 'Hệ thuần nhất Ax = 0 luôn có nghiệm nào?', back: 'Luôn có nghiệm tầm thường x = 0' },
      { front: 'Quy tắc Cramer áp dụng được khi nào?', back: 'Số phương trình bằng số ẩn và det(A) ≠ 0' }
    ],
    mini_quiz: [
      {
        question: 'Một hệ gồm 3 phương trình 4 ẩn số có rank(A) = rank(A|b) = 3. Số ẩn tự do là:',
        options: ['0', '1', '2', '3'],
        correctIndex: 1,
        explanation: 'Số ẩn tự do = số ẩn - hạng = 4 - 3 = 1.'
      }
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    subject: 'MI1141 - Đại số',
    topic: 'Không gian vectơ',
    resource_type: 'Ghi chú',
    title: 'Cơ sở, Số chiều & Tọa độ trong Không gian Vectơ R^n',
    copyright_verified: true,
    content_markdown: `### 1. Độc lập tuyến tính (ĐLTT) & Phụ thuộc tuyến tính (PTTL)
Hệ $\{v_1, v_2, \\dots, v_k\}$ ĐLTT nếu $\\sum c_i v_i = 0 \\iff c_1 = c_2 = \\dots = c_k = 0$.

### 2. Cơ sở và số chiều
- Cơ sở là hệ ĐLTT sinh ra toàn bộ không gian.
- Số vectơ trong cơ sở là số chiều $\\dim(V)$.`,
    formula_summary: 'dim(V) = số vectơ cơ sở | rank({v1..vk}) = dim(span)',
    flashcards: [
      { front: 'Trong không gian R³, tối đa có bao nhiêu vectơ độc lập tuyến tính?', back: 'Tối đa 3 vectơ' },
      { front: 'Nếu một hệ vectơ chứa vectơ không 0 thì hệ đó có tính chất gì?', back: 'Luôn phụ thuộc tuyến tính' }
    ],
    mini_quiz: [
      {
        question: 'Trong R³, số chiều của không gian con sinh bởi 2 vectơ không cùng phương là:',
        options: ['1', '2', '3', 'Vô hạn'],
        correctIndex: 1,
        explanation: 'Hai vectơ độc lập tuyến tính sinh ra không gian con 2 chiều (mặt phẳng qua gốc tọa độ).'
      }
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    subject: 'MI1141 - Đại số',
    topic: 'Ánh xạ tuyến tính',
    resource_type: 'Đề ôn tập',
    title: 'Trị riêng, Vectơ riêng & Chéo hóa Ma trận (Thi Giữa Kỳ/Cuối Kỳ)',
    copyright_verified: true,
    content_markdown: `### 1. Phương trình đặc trưng
$$\\det(A - \\lambda I) = 0$$
Nghiệm của phương trình là các trị riêng $\\lambda_i$.

### 2. Vectơ riêng
Giải hệ thuần nhất $(A - \\lambda I)v = 0$ để tìm không gian vectơ riêng.

### 3. Điều kiện chéo hóa
Ma trận $A$ cấp $n$ chéo hóa được khi và chỉ khi có đủ $n$ vectơ riêng độc lập tuyến tính.`,
    formula_summary: 'det(A - λI) = 0 | A = P * D * P⁻¹',
    flashcards: [
      { front: 'Tổng các trị riêng của ma trận A bằng đại lượng nào?', back: 'Bằng Trace(A) - vết của ma trận' },
      { front: 'Tích các trị riêng của ma trận A bằng đại lượng nào?', back: 'Bằng định thức det(A)' }
    ],
    mini_quiz: [
      {
        question: 'Vết của ma trận A = [[3, 1], [0, 2]] là:',
        options: ['5', '6', '1', '0'],
        correctIndex: 0,
        explanation: 'Trace(A) = 3 + 2 = 5 (cũng chính là tổng hai trị riêng).'
      }
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222205',
    subject: 'MI1141 - Đại số',
    topic: 'Ánh xạ tuyến tính',
    resource_type: 'Bài tập',
    title: 'Dạng toàn phương và phương pháp Lagrange đưa về chính tắc',
    copyright_verified: true,
    content_markdown: `### Tiêu chuẩn Sylvester xét dấu dạng toàn phương:
- Xác định dương $\\iff \\Delta_1 > 0, \\Delta_2 > 0, \\dots, \\Delta_n > 0$.
- Xác định âm $\\iff \\Delta_1 < 0, \\Delta_2 > 0, \\Delta_3 < 0, \\dots$ (đan dấu bắt đầu từ âm).`,
    formula_summary: 'Dương: mọi Δ_k > 0 | Âm: đan dấu Δ₁ < 0, Δ₂ > 0, Δ₃ < 0...',
    flashcards: [
      { front: 'Dấu hiệu Sylvester cho dạng toàn phương xác định âm là gì?', back: 'Các định thức con chính đan dấu: âm, dương, âm, dương...' }
    ],
    mini_quiz: [
      {
        question: 'Dạng toàn phương Q(x, y) = x² + 4xy + 5y² có tính chất:',
        options: ['Xác định dương', 'Xác định âm', 'Nửa xác định', 'Không xác định dấu'],
        correctIndex: 0,
        explanation: 'Q = (x + 2y)² + y² > 0 với mọi (x, y) ≠ (0, 0) nên xác định dương.'
      }
    ]
  },

  // --- CH1015 - HÓA HỌC ĐẠI CƯƠNG (5 TÀI LIỆU) ---
  {
    id: '33333333-3333-3333-3333-333333333301',
    subject: 'CH1015 - Hóa học đại cương',
    topic: 'Nhiệt động học',
    resource_type: 'Ghi chú',
    title: 'Nguyên lý I, II Nhiệt Động Học & Phương Trình Gibbs Delta G',
    copyright_verified: true,
    content_markdown: `### 1. Entanpi $\\Delta H$ và Entropi $\\Delta S$
- $\\Delta H < 0$: Phản ứng tỏa nhiệt.
- $\\Delta H > 0$: Phản ứng thu nhiệt.
- $\\Delta S$: Đo độ hỗn loạn của hệ.

### 2. Thế đẳng áp Gibbs (Năng lượng tự do)
$$\\Delta G = \\Delta H - T\\Delta S$$
- $\\Delta G < 0$: Phản ứng tự diễn biến theo chiều thuận.
- $\\Delta G = 0$: Hệ đạt trạng thái cân bằng.
- $\\Delta G > 0$: Không tự diễn biến theo chiều thuận.`,
    formula_summary: 'ΔG = ΔH - T*ΔS | ΔG° = -RT ln K',
    flashcards: [
      { front: 'Khi phản ứng tỏa nhiệt (ΔH < 0) và tăng độ hỗn loạn (ΔS > 0) thì ΔG thế nào?', back: 'ΔG luôn âm ở mọi nhiệt độ, phản ứng luôn tự xảy ra' },
      { front: 'Đơn vị chuẩn của nhiệt độ T trong phương trình Gibbs là gì?', back: 'Kelvin (K = °C + 273.15)' },
      { front: 'Ở trạng thái cân bằng hóa học, biến thiên thế Gibbs ΔG bằng mấy?', back: 'Bằng 0' }
    ],
    mini_quiz: [
      {
        question: 'Một phản ứng có ΔH = +40 kJ/mol và ΔS = -100 J/(mol.K). Kết luận nào đúng?',
        options: ['Tự diễn biến ở nhiệt độ cao', 'Tự diễn biến ở nhiệt độ thấp', 'Không bao giờ tự diễn biến ở mọi nhiệt độ', 'Luôn tự diễn biến'],
        correctIndex: 2,
        explanation: 'ΔH > 0 và ΔS < 0 nên ΔG = ΔH - T*ΔS luôn > 0 ở mọi nhiệt độ T > 0 K.'
      },
      {
        question: 'Biểu thức liên hệ giữa thế đẳng áp tiêu chuẩn ΔG° và hằng số cân bằng K là:',
        options: ['ΔG° = -RT ln K', 'ΔG° = RT ln K', 'ΔG° = -nFE', 'ΔG° = ΔH + TΔS'],
        correctIndex: 0,
        explanation: 'ΔG° = -RT ln K (với R = 8.314 J/(mol.K)).'
      }
    ]
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    subject: 'CH1015 - Hóa học đại cương',
    topic: 'Cân bằng hóa học',
    resource_type: 'Bài tập',
    title: 'Nguyên lý Chuyển dịch Cân bằng Le Chatelier & Hằng số Kc, Kp',
    copyright_verified: true,
    content_markdown: `### Nguyên lý chuyển dịch Le Chatelier
Một hệ đang ở trạng thái cân bằng nếu chịu tác động từ bên ngoài (nồng độ, nhiệt độ, áp suất) thì cân bằng sẽ chuyển dịch theo chiều làm giảm tác động đó.

- Tăng nhiệt độ: Cân bằng chuyển dịch theo chiều THU NHIỆT ($\\Delta H > 0$).
- Tăng áp suất: Cân bằng chuyển dịch theo chiều GIẢM SỐ MOL KHÍ.`,
    formula_summary: 'Kp = Kc * (RT)^(Δn) | Tăng T → chiều thu nhiệt | Tăng P → chiều giảm mol khí',
    flashcards: [
      { front: 'Khi tăng nhiệt độ của phản ứng tỏa nhiệt, cân bằng dịch chuyển theo chiều nào?', back: 'Chiều nghịch (chiều thu nhiệt để hạ nhiệt độ)' },
      { front: 'Chất xúc tác có làm chuyển dịch vị trí cân bằng hóa học không?', back: 'Không, chỉ làm tăng tốc độ đạt đến trạng thái cân bằng' }
    ],
    mini_quiz: [
      {
        question: 'Cho cân bằng: N₂(k) + 3H₂(k) ⇌ 2NH₃(k), ΔH < 0. Để tăng hiệu suất NH₃ cần:',
        options: ['Tăng nhiệt độ và giảm áp suất', 'Giảm nhiệt độ và tăng áp suất', 'Tăng nhiệt độ và tăng áp suất', 'Thêm chất xúc tác'],
        correctIndex: 1,
        explanation: 'Phản ứng tỏa nhiệt nên giảm T làm cân bằng dịch chuyển theo chiều thuận; chiều thuận giảm số mol khí (4 → 2) nên tăng áp suất dịch chuyển sang phải.'
      }
    ]
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    subject: 'CH1015 - Hóa học đại cương',
    topic: 'Động hóa học',
    resource_type: 'Ghi chú',
    title: 'Tốc độ phản ứng, Bậc phản ứng & Phương trình Arrhenius',
    copyright_verified: true,
    content_markdown: `### 1. Định luật tác dụng khối lượng
$$v = k [A]^m [B]^n$$
Tổng $m + n$ là bậc của phản ứng.

### 2. Phương trình Arrhenius
$$k = A \\cdot e^{-\\frac{E_a}{RT}}$$
$$\\ln \\frac{k_2}{k_1} = \\frac{E_a}{R} \\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)$$
Trong đó $E_a$ là năng lượng hoạt hóa.`,
    formula_summary: 'v = k[A]^m[B]^n | k = A exp(-Ea / RT) | ln(k2/k1) = Ea/R * (1/T1 - 1/T2)',
    flashcards: [
      { front: 'Chu kỳ bán hủy t_(1/2) của phản ứng bậc 1 có phụ thuộc nồng độ đầu không?', back: 'Không, t_(1/2) = ln(2) / k' },
      { front: 'Chất xúc tác làm tăng tốc độ phản ứng bằng cơ chế nào?', back: 'Làm giảm năng lượng hoạt hóa Ea của phản ứng' }
    ],
    mini_quiz: [
      {
        question: 'Đối với phản ứng đơn giản 2A + B → C, biểu thức tốc độ phản ứng là:',
        options: ['v = k [A]² [B]', 'v = k [A] [B]', 'v = k [A] [B]²', 'v = k [C] / ([A]² [B])'],
        correctIndex: 0,
        explanation: 'Với phản ứng đơn giản một giai đoạn, số mũ bằng chính hệ số tỷ lượng: v = k [A]² [B].'
      }
    ]
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    subject: 'CH1015 - Hóa học đại cương',
    topic: 'Điện hóa học',
    resource_type: 'Đề ôn tập',
    title: 'Phương Trình Nernst & Sức Điện Động của Pin Galvani',
    copyright_verified: true,
    content_markdown: `### 1. Phương trình Nernst ở 25°C
$$E = E^0 + \\frac{0.059}{n} \\log \\frac{[\\text{Ox}]}{[\\text{Kh}]}$$

### 2. Sức điện động của pin
$$E_{\\text{pin}}^0 = E_{\\text{catot}}^0 - E_{\\text{anot}}^0$$
$$\\Delta G^0 = -n F E_{\\text{pin}}^0$$`,
    formula_summary: 'E = E° + (0.059/n) log([Ox]/[Kh]) | E°_pin = E°_catot - E°_anot | ΔG° = -nFE°',
    flashcards: [
      { front: 'Ở cực Anot của pin xảy ra quá trình gì?', back: 'Quá trình oxy hóa (nhường electron)' },
      { front: 'Hằng số Faraday F có giá trị xấp xỉ bao nhiêu?', back: '96485 C/mol (thường lấy 96500 C/mol)' }
    ],
    mini_quiz: [
      {
        question: 'Pin Daniell gồm cực Zn/Zn²⁺ (E⁰ = -0.76V) và Cu/Cu²⁺ (E⁰ = +0.34V). E⁰ của pin là:',
        options: ['1.10 V', '0.42 V', '-1.10 V', '-0.42 V'],
        correctIndex: 0,
        explanation: 'E⁰_pin = E⁰_catot (Cu) - E⁰_anot (Zn) = 0.34 - (-0.76) = 1.10 V.'
      }
    ]
  },
  {
    id: '33333333-3333-3333-3333-333333333305',
    subject: 'CH1015 - Hóa học đại cương',
    topic: 'Điện hóa học',
    resource_type: 'Bài tập',
    title: 'Bài tập Điện phân nóng chảy và Dung dịch theo Định luật Faraday',
    copyright_verified: true,
    content_markdown: `### Định luật Faraday về điện phân
$$m = \\frac{A \\cdot I \\cdot t}{n \\cdot F}$$
- $m$: Khối lượng chất thoát ra (g)
- $A$: Khối lượng mol nguyên tử (g/mol)
- $I$: Cường độ dòng điện (A)
- $t$: Thời gian điện phân (giây)
- $n$: Số electron trao đổi
- $F$: 96500 C/mol`,
    formula_summary: 'm = (A * I * t) / (n * 96500)',
    flashcards: [
      { front: 'Điện phân dung dịch CuSO₄ với điện cực trơ, tại catot thoát ra chất gì?', back: 'Kim loại Cu bám vào catot' }
    ],
    mini_quiz: [
      {
        question: 'Điện phân nóng chảy NaCl thu được kim loại Na ở điện cực nào?',
        options: ['Catot (-)', 'Anot (+)', 'Cả hai cực', 'Không thu được Na'],
        correctIndex: 0,
        explanation: 'Cation Na⁺ di chuyển về Catot cực âm và nhận electron: Na⁺ + e⁻ → Na.'
      }
    ]
  }
];
