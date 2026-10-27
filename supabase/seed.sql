-- ========================================================================
-- STUDYMATCH SEED DATA (/supabase/seed.sql)
-- 15 Standardized Academic Resources across 3 General Subjects:
-- MI1111 (Giải tích 1), MI1141 (Đại số), CH1015 (Hóa học đại cương)
-- + 8 Diverse Student Profiles (HUST, FTU, UEH)
-- ========================================================================

-- 1. RESOURCES SEED (15 TÀI LIỆU CHUẨN ĐÃ KIỂM DUYỆT BẢN QUYỀN)
INSERT INTO public.resources (id, subject, topic, resource_type, title, copyright_verified, content_markdown, formula_summary, flashcards, mini_quiz) VALUES
-- MÔN 1: MI1111 - GIẢI TÍCH 1 (5 TÀI LIỆU)
(
    '11111111-1111-1111-1111-111111111101',
    'MI1111 - Giải tích 1',
    'Giới hạn & Liên tục',
    'Ghi chú',
    'Tóm tắt các Vô cùng bé tương đương & Quy tắc L''Hôpital',
    true,
    '# Giới hạn & Tính liên tục của hàm số\n\n### 1. Vô cùng bé (VCB) tương đương khi x -> 0:\n- sin(x) ~ x\n- tan(x) ~ x\n- arcsin(x) ~ x\n- arctan(x) ~ x\n- ln(1 + x) ~ x\n- e^x - 1 ~ x\n- (1 + x)^a - 1 ~ a*x\n- 1 - cos(x) ~ x^2 / 2\n\n### 2. Định lý kẹp & Giới hạn cơ bản:\nlim (x -> 0) sin(x)/x = 1\nlim (x -> inf) (1 + 1/x)^x = e\n\n### 3. Khử dạng vô định:\nCác dạng: 0/0, inf/inf, 0 * inf, inf - inf, 1^inf, 0^0, inf^0.',
    'sin x ~ x | ln(1+x) ~ x | e^x - 1 ~ x | 1 - cos x ~ x^2/2 (khi x -> 0)',
    '[
        {"front": "Khi x -> 0, 1 - cos(x) tương đương với vô cùng bé nào?", "back": "x^2 / 2"},
        {"front": "Quy tắc L''Hôpital áp dụng cho những dạng vô định nào?", "back": "Chỉ áp dụng trực tiếp cho 0/0 và vô cùng / vô cùng"},
        {"front": "lim (x -> 0) (e^(2x) - 1) / sin(3x) bằng bao nhiêu?", "back": "2/3 (do e^(2x)-1 ~ 2x và sin(3x) ~ 3x)"}
    ]'::jsonb,
    '[
        {"question": "Khi x tiến tới 0, biểu thức ln(1 + 3x) tương đương với vô cùng bé nào?", "options": ["3x", "x", "x^3", "3x^2"], "correctIndex": 0, "explanation": "Áp dụng công thức tương đương ln(1 + u) ~ u khi u -> 0, với u = 3x ta được 3x."},
        {"question": "Giới hạn lim(x -> 0) (1 - cos(2x)) / x^2 có giá trị là:", "options": ["1", "2", "1/2", "4"], "correctIndex": 1, "explanation": "1 - cos(2x) ~ (2x)^2 / 2 = 4x^2 / 2 = 2x^2. Do đó giới hạn là 2."},
        {"question": "Điều kiện để hàm số y = f(x) liên tục tại điểm x0 là gì?", "options": ["lim(x -> x0) f(x) tồn tại", "f(x0) xác định", "lim(x -> x0) f(x) = f(x0)", "Đạo hàm f''(x0) tồn tại"], "correctIndex": 2, "explanation": "Theo định nghĩa, hàm số liên tục tại x0 khi và chỉ khi lim(x -> x0) f(x) = f(x0)."}
    ]'::jsonb
),
(
    '11111111-1111-1111-1111-111111111102',
    'MI1111 - Giải tích 1',
    'Đạo hàm & Vi phân',
    'Bài tập',
    'Khai triển Taylor - Maclaurin & Ứng dụng xấp xỉ',
    true,
    '# Khai triển Taylor & Maclaurin\n\n### Công thức tổng quát:\nf(x) = f(0) + f''(0)*x + f''''(0)/2! * x^2 + ... + f^(n)(0)/n! * x^n + o(x^n)\n\n### Ứng dụng giải giới hạn bậc cao:\nKhi các VCB cấp 1 triệt tiêu nhau, bắt buộc phải dùng khai triển Maclaurin tới cấp cần thiết.',
    'f(x) = sum(k=0..n) [f^(k)(0)/k! * x^k] + o(x^n)',
    '[
        {"front": "Khai triển Maclaurin của e^x đến cấp 3 là gì?", "back": "1 + x + x^2/2 + x^3/6 + o(x^3)"},
        {"front": "Khai triển Maclaurin của sin(x) chỉ chứa các lũy thừa chẵn hay lẻ?", "back": "Chỉ chứa các lũy thừa lẻ: x - x^3/6 + x^5/120 + ..."},
        {"front": "Phần dư Peano của khai triển cấp n được viết là gì?", "back": "o(x^n)"}
    ]'::jsonb,
    '[
        {"question": "Hệ số của x^2 trong khai triển Maclaurin của cos(x) là:", "options": ["-1/2", "1/2", "-1", "0"], "correctIndex": 0, "explanation": "cos(x) = 1 - x^2/2! + x^4/4! + ... nên hệ số là -1/2."},
        {"question": "Khi nào bắt buộc phải dùng khai triển Maclaurin thay cho VCB tương đương bậc 1?", "options": ["Mọi bài toán giới hạn", "Khi hiệu hai VCB tương đương cấp 1 triệt tiêu nhau", "Khi x tiến ra vô cùng", "Khi hàm số không khả vi"], "correctIndex": 1, "explanation": "Khi các số hạng bậc 1 trừ nhau ra 0, VCB tương đương thông thường mất thông tin, cần khai triển bậc cao hơn."}
    ]'::jsonb
),
(
    '11111111-1111-1111-1111-111111111103',
    'MI1111 - Giải tích 1',
    'Tích phân suy rộng',
    'Ghi chú',
    'Cẩm nang Phân loại & Tiêu chuẩn Hội tụ Tích phân Suy rộng',
    true,
    '# Tích phân suy rộng loại 1 & loại 2\n\n### 1. Loại 1 (Cận vô hạn: int_a^inf f(x) dx):\n- Tích phân int_1^inf (1 / x^alpha) dx: HỘI TỤ khi alpha > 1, PHÂN KỲ khi alpha <= 1.\n\n### 2. Loại 2 (Điểm kỳ dị tại cận: int_a^b f(x) dx):\n- Tích phân int_0^1 (1 / x^alpha) dx: HỘI TỤ khi alpha < 1, PHÂN KỲ khi alpha >= 1.\n\n### 3. Tiêu chuẩn so sánh giới hạn:\nXét lim (x -> inf) f(x) / g(x) = k (0 < k < inf) => int f và int g cùng tính chất.',
    'int_1^inf (1/x^a) dx hội tụ <=> a > 1 | int_0^1 (1/x^a) dx hội tụ <=> a < 1',
    '[
        {"front": "Tích phân int_1^inf (1 / x^2) dx hội tụ hay phân kỳ?", "back": "Hội tụ (do alpha = 2 > 1)"},
        {"front": "Tích phân int_0^1 (1 / sqrt(x)) dx hội tụ hay phân kỳ?", "back": "Hội tụ (do alpha = 1/2 < 1 tại điểm kỳ dị x=0)"},
        {"front": "Điểm kỳ dị của tích phân suy rộng loại 2 là gì?", "back": "Điểm mà tại đó hàm dưới dấu tích phân tiến ra vô cực"}
    ]'::jsonb,
    '[
        {"question": "Tích phân int_1^inf 1/x dx có tính chất gì?", "options": ["Hội tụ về 1", "Hội tụ về 0", "Phân kỳ", "Không xác định"], "correctIndex": 2, "explanation": "Với alpha = 1, tích phân loại 1 phân kỳ (nguyên hàm là ln|x| -> inf)."},
        {"question": "Cho f(x) ~ 1/x^3 khi x -> inf. Tích phân int_2^inf f(x) dx sẽ:", "options": ["Hội tụ", "Phân kỳ", "Bằng 0", "Chưa thể kết luận"], "correctIndex": 0, "explanation": "Do alpha = 3 > 1, theo tiêu chuẩn so sánh giới hạn tích phân hội tụ."}
    ]'::jsonb
),
(
    '11111111-1111-1111-1111-111111111104',
    'MI1111 - Giải tích 1',
    'Chuỗi số',
    'Đề ôn tập',
    'Bộ 20 Câu Hỏi Khảo sát Sự Hội tụ Chuỗi số D/Alembert & Cauchy',
    true,
    '# Khảo sát sự hội tụ của Chuỗi số dương & Chuỗi đan dấu\n\n### 1. Chuỗi Riemann (Chuỗi Dirichlet):\nsum (1 / n^alpha) hội tụ khi alpha > 1, phân kỳ khi alpha <= 1.\n\n### 2. Tiêu chuẩn D''Alembert (Tỉ số):\nlim (u_(n+1) / u_n) = L\n- L < 1: Hội tụ\n- L > 1: Phân kỳ\n- L = 1: Chưa kết luận được\n\n### 3. Tiêu chuẩn Cauchy (Căn số):\nlim root_n(u_n) = L\n\n### 4. Định lý Leibniz cho chuỗi đan dấu:\nsum (-1)^n * a_n hội tụ nếu a_n giảm dần về 0.',
    'D''Alembert: lim(u_(n+1)/u_n) = L < 1 -> Hội tụ | Cauchy: lim n_root(u_n) = L < 1 -> Hội tụ',
    '[
        {"front": "Chuỗi sum (1 / n!) hội tụ theo tiêu chuẩn nào dễ nhất?", "back": "Tiêu chuẩn D''Alembert (tỉ số bằng 1/(n+1) -> 0 < 1)"},
        {"front": "Khi tiêu chuẩn D''Alembert cho L = 1 thì cần làm gì?", "back": "Dùng tiêu chuẩn khác như Raabe, Gauss hoặc so sánh tương đương"},
        {"front": "Định lý Leibniz áp dụng cho loại chuỗi nào?", "back": "Chuỗi đan dấu có số hạng trị tuyệt đối giảm đơn điệu về 0"}
    ]'::jsonb,
    '[
        {"question": "Chuỗi sum_{n=1}^inf (n / 2^n) hội tụ hay phân kỳ?", "options": ["Hội tụ", "Phân kỳ", "Dao động", "Không tồn tại"], "correctIndex": 0, "explanation": "Áp dụng D''Alembert: lim (n+1)/(2^(n+1)) * 2^n/n = 1/2 < 1 => Hội tụ."},
        {"question": "Điều kiện cần để chuỗi số sum(u_n) hội tụ là:", "options": ["lim u_n = 0", "lim u_n = 1", "u_n > 0", "u_n tăng dần"], "correctIndex": 0, "explanation": "Nếu lim u_n != 0 thì chuỗi chắc chắn phân kỳ (đây là điều kiện cần nhưng chưa đủ)."}
    ]'::jsonb
),
(
    '11111111-1111-1111-1111-111111111105',
    'MI1111 - Giải tích 1',
    'Tích phân suy rộng',
    'Bài tập',
    'Phương pháp đổi biến và từng phần trong Tích phân suy rộng',
    true,
    '# Bài tập rèn luyện Tích phân suy rộng khó\n\nBao gồm các dạng toán chứa tham số alpha và tích phân Euler (Hàm Gamma, Beta).',
    'Gamma(p) = int_0^inf x^(p-1) * e^(-x) dx | Gamma(p+1) = p * Gamma(p)',
    '[
        {"front": "Giá trị của Gamma(1) là bao nhiêu?", "back": "1"},
        {"front": "Giá trị của Gamma(n+1) với n nguyên dương là gì?", "back": "n!"}
    ]'::jsonb,
    '[
        {"question": "Tích phân int_0^inf e^(-x) dx có giá trị là:", "options": ["1", "0", "inf", "e"], "correctIndex": 0, "explanation": "[-e^(-x)] từ 0 đến inf = 0 - (-1) = 1."}
    ]'::jsonb
),

-- MÔN 2: MI1141 - ĐẠI SỐ (5 TÀI LIỆU)
(
    '22222222-2222-2222-2222-222222222201',
    'MI1141 - Đại số',
    'Ma trận & Định thức',
    'Ghi chú',
    'Công thức tính Định thức ma trận cấp n & Ma trận nghịch đảo',
    true,
    '# Ma trận & Định thức\n\n### 1. Tính chất định thức:\n- det(AB) = det(A) * det(B)\n- det(kA) = k^n * det(A) (với A cấp n)\n- det(A^T) = det(A)\n- Đổi chỗ 2 hàng (cột) làm đổi dấu định thức.\n\n### 2. Ma trận nghịch đảo A^(-1):\n- Tồn tại khi và chỉ khi det(A) != 0\n- A^(-1) = (1 / det(A)) * C^T (trong đó C là ma trận phần phụ đại số).',
    'det(AB) = det(A)*det(B) | det(kA) = k^n * det(A) | A^(-1) = (1/det(A)) * C^T',
    '[
        {"front": "Nếu định thức của ma trận vuông A cấp 3 bằng 4, thì det(2A) bằng bao nhiêu?", "back": "2^3 * 4 = 32"},
        {"front": "Ma trận vuông có det(A) = 0 được gọi là ma trận gì?", "back": "Ma trận suy biến (không khả nghịch)"},
        {"front": "det(A^(-1)) liên hệ thế nào với det(A)?", "back": "det(A^(-1)) = 1 / det(A)"}
    ]'::jsonb,
    '[
        {"question": "Cho ma trận vuông A cấp 4 có det(A) = -3. Giá trị của det(-A) là:", "options": ["3", "-3", "12", "-12"], "correctIndex": 1, "explanation": "det(-A) = (-1)^4 * det(A) = 1 * (-3) = -3."},
        {"question": "Điều kiện cần và đủ để ma trận vuông A khả nghịch là:", "options": ["det(A) > 0", "det(A) != 0", "A là ma trận đối xứng", "rank(A) = 0"], "correctIndex": 1, "explanation": "Một ma trận vuông có ma trận nghịch đảo khi và chỉ khi định thức của nó khác 0."}
    ]'::jsonb
),
(
    '22222222-2222-2222-2222-222222222202',
    'MI1141 - Đại số',
    'Hệ phương trình tuyến tính',
    'Bài tập',
    'Phương pháp Gauss-Jordan & Định lý Kronecker-Capelli',
    true,
    '# Giải hệ phương trình tuyến tính\n\n### Định lý Kronecker - Capelli:\nHệ Ax = b có nghiệm <=> rank(A) = rank(A|b).\n- rank(A) = rank(A|b) = n (số ẩn): Hệ có nghiệm DUY NHẤT.\n- rank(A) = rank(A|b) < n: Hệ có VÔ SỐ NGHIỆM phụ thuộc vào n - r ẩn tự do.\n- rank(A) < rank(A|b): Hệ VÔ NGHIỆM.',
    'rank(A) = rank(A|b) = n: Duy nhất | < n: Vô số nghiệm | rank(A) < rank(A|b): Vô nghiệm',
    '[
        {"front": "Hệ phương trình tuyến tính thuần nhất Ax = 0 luôn có nghiệm nào?", "back": "Luôn có nghiệm tầm thường x = 0"},
        {"front": "Quy tắc Cramer chỉ áp dụng được khi nào?", "back": "Số phương trình bằng số ẩn và det(A) != 0"}
    ]'::jsonb,
    '[
        {"question": "Một hệ gồm 3 phương trình 4 ẩn số có rank(A) = rank(A|b) = 3. Số ẩn tự do là:", "options": ["0", "1", "2", "3"], "correctIndex": 1, "explanation": "Số ẩn tự do = số ẩn - hạng = 4 - 3 = 1."}
    ]'::jsonb
),
(
    '22222222-2222-2222-2222-222222222203',
    'MI1141 - Đại số',
    'Không gian vectơ',
    'Ghi chú',
    'Cơ sở, Số chiều & Tọa độ trong Không gian Vectơ R^n',
    true,
    '# Không gian vectơ con, Độc lập tuyến tính & Phụ thuộc tuyến tính\n\n### 1. Độc lập tuyến tính:\nHệ {v1, v2, ..., vk} ĐLTT <=> c1*v1 + ... + ck*vk = 0 chỉ khi c1 = ... = ck = 0.\n\n### 2. Cơ sở và số chiều:\nCơ sở là hệ ĐLTT tối đại sinh ra toàn bộ không gian. Số vectơ trong cơ sở gọi là số chiều (dim V).',
    'dim(V) = số vectơ cơ sở | rank(v1..vk) = dim(span(v1..vk))',
    '[
        {"front": "Trong R^3, tối đa có thể có bao nhiêu vectơ độc lập tuyến tính?", "back": "Tối đa 3 vectơ"},
        {"front": "Nếu một hệ vectơ chứa vectơ không 0 thì hệ đó ĐLTT hay PTTL?", "back": "Luôn phụ thuộc tuyến tính"}
    ]'::jsonb,
    '[
        {"question": "Trong không gian R^3, số chiều của không gian con sinh bởi 2 vectơ không cùng phương là:", "options": ["1", "2", "3", "Vô hạn"], "correctIndex": 1, "explanation": "Hai vectơ độc lập tuyến tính sinh ra một không gian con 2 chiều (một mặt phẳng qua gốc tọa độ)."}
    ]'::jsonb
),
(
    '22222222-2222-2222-2222-222222222204',
    'MI1141 - Đại số',
    'Ánh xạ tuyến tính',
    'Đề ôn tập',
    'Trị riêng, Vectơ riêng & Chéo hóa Ma trận (Thi Giữa Kỳ/Cuối Kỳ)',
    true,
    '# Trị riêng, Vectơ riêng & Chéo hóa ma trận\n\n### 1. Phương trình đặc trưng:\ndet(A - lambda*I) = 0\nNghiệm của phương trình là các trị riêng lambda.\n\n### 2. Vectơ riêng tương ứng:\nGiải hệ (A - lambda*I) * v = 0 để tìm không gian con riêng.\n\n### 3. Điều kiện chéo hóa:\nMa trận A cấp n chéo hóa được <=> có đủ n vectơ riêng độc lập tuyến tính.',
    'Phương trình đặc trưng: det(A - lambda*I) = 0 | A = P * D * P^(-1)',
    '[
        {"front": "Tổng các trị riêng của ma trận A bằng đại lượng nào của A?", "back": "Bằng vết của ma trận (Trace(A) = tổng các phần tử trên đường chéo chính)"},
        {"front": "Tích các trị riêng của ma trận A bằng đại lượng nào?", "back": "Bằng định thức det(A)"}
    ]'::jsonb,
    '[
        {"question": "Vết của ma trận A = [[3, 1], [0, 2]] là:", "options": ["5", "6", "1", "0"], "correctIndex": 0, "explanation": "Trace(A) = 3 + 2 = 5 (cũng chính là tổng hai trị riêng lambda1=3, lambda2=2)."}
    ]'::jsonb
),
(
    '22222222-2222-2222-2222-222222222205',
    'MI1141 - Đại số',
    'Ánh xạ tuyến tính',
    'Bài tập',
    'Dạng toàn phương và phương pháp Lagrange đưa về chính tắc',
    true,
    '# Dạng toàn phương & Định lý Sylvester\n\nCách xét dấu dạng toàn phương: xác định dương khi mọi định thức con chính > 0.',
    'Dạng toàn phương xác định dương <=> Delta_1 > 0, Delta_2 > 0, ..., Delta_n > 0',
    '[
        {"front": "Dấu hiệu Sylvester cho dạng toàn phương xác định âm là gì?", "back": "Các định thức con chính đan dấu: Delta_1 < 0, Delta_2 > 0, Delta_3 < 0, ..."}
    ]'::jsonb,
    '[
        {"question": "Dạng toàn phương Q(x, y) = x^2 + 4xy + 5y^2 có tính chất:", "options": ["Xác định dương", "Xác định âm", "Nửa xác định", "Không xác định dấu"], "correctIndex": 0, "explanation": "Q = (x + 2y)^2 + y^2 > 0 với mọi (x, y) != (0, 0), nên xác định dương."}
    ]'::jsonb
),

-- MÔN 3: CH1015 - HÓA HỌC ĐẠI CƯƠNG (5 TÀI LIỆU)
(
    '33333333-3333-3333-3333-333333333301',
    'CH1015 - Hóa học đại cương',
    'Nhiệt động học',
    'Ghi chú',
    'Nguyên lý I, II Nhiệt Động Học & Phương Trình Gibbs Delta G',
    true,
    '# Nhiệt động học hóa học\n\n### 1. Đại lượng Entanpi (Delta H):\n- Delta H < 0: Phản ứng tỏa nhiệt\n- Delta H > 0: Phản ứng thu nhiệt\n\n### 2. Thế đẳng áp Gibbs (Delta G):\nDelta G = Delta H - T * Delta S\n- Delta G < 0: Phản ứng tự diễn biến theo chiều thuận\n- Delta G = 0: Hệ đạt trạng thái cân bằng\n- Delta G > 0: Phản ứng không tự diễn biến theo chiều thuận (tự diễn biến theo chiều nghịch).',
    'Delta G = Delta H - T * Delta S | Delta G0 = -R * T * ln(K)',
    '[
        {"front": "Khi phản ứng tỏa nhiệt (Delta H < 0) và tăng độ hỗn loạn (Delta S > 0) thì Delta G như thế nào?", "back": "Delta G luôn âm ở mọi nhiệt độ, phản ứng luôn tự xảy ra"},
        {"front": "Đơn vị chuẩn của nhiệt độ T trong công thức Gibbs là gì?", "back": "Kelvin (K = độ C + 273.15)"},
        {"front": "Ở trạng thái cân bằng hóa học, biến thiên thế Gibbs Delta G bằng mấy?", "back": "Bằng 0"}
    ]'::jsonb,
    '[
        {"question": "Một phản ứng có Delta H = +40 kJ/mol và Delta S = -100 J/(mol.K). Kết luận nào đúng?", "options": ["Tự diễn biến ở nhiệt độ cao", "Tự diễn biến ở nhiệt độ thấp", "Không bao giờ tự diễn biến ở mọi nhiệt độ", "Luôn tự diễn biến"], "correctIndex": 2, "explanation": "Delta H > 0 và Delta S < 0 nên Delta G = Delta H - T*Delta S luôn > 0 ở mọi nhiệt độ T > 0 K."},
        {"question": "Biểu thức liên hệ giữa thế đẳng áp tiêu chuẩn Delta G0 và hằng số cân bằng K là:", "options": ["Delta G0 = -RT ln K", "Delta G0 = RT ln K", "Delta G0 = -nFE", "Delta G0 = Delta H + T Delta S"], "correctIndex": 0, "explanation": "Delta G0 = -RT ln K (với R = 8.314 J/(mol.K))."}
    ]'::jsonb
),
(
    '33333333-3333-3333-3333-333333333302',
    'CH1015 - Hóa học đại cương',
    'Cân bằng hóa học',
    'Bài tập',
    'Nguyên lý Chuyển dịch Cân bằng Le Chatelier & Hằng số Kc, Kp',
    true,
    '# Cân bằng hóa học & Le Chatelier\n\n### Nguyên lý chuyển dịch Le Chatelier:\nMột hệ đang ở trạng thái cân bằng nếu chịu tác động từ bên ngoài (nồng độ, nhiệt độ, áp suất) thì cân bằng sẽ chuyển dịch theo chiều làm giảm tác động đó.\n\n- Tăng nhiệt độ -> chuyển dịch theo chiều thu nhiệt (Delta H > 0).\n- Tăng áp suất -> chuyển dịch theo chiều làm giảm số mol khí.',
    'Kp = Kc * (RT)^(Delta n) | Tăng T -> chiều thu nhiệt | Tăng P -> chiều giảm mol khí',
    '[
        {"front": "Khi tăng nhiệt độ của phản ứng tỏa nhiệt, cân bằng sẽ chuyển dịch theo chiều nào?", "back": "Chuyển dịch theo chiều nghịch (chiều thu nhiệt)"},
        {"front": "Chất xúc tác có làm chuyển dịch vị trí cân bằng hóa học không?", "back": "Không, chỉ làm tăng tốc độ đạt đến trạng thái cân bằng"}
    ]'::jsonb,
    '[
        {"question": "Cho cân bằng: N2(k) + 3H2(k) <=> 2NH3(k), Delta H < 0. Để tăng hiệu suất tổng hợp NH3 cần:", "options": ["Tăng nhiệt độ và giảm áp suất", "Giảm nhiệt độ và tăng áp suất", "Tăng nhiệt độ và tăng áp suất", "Thêm chất xúc tác"], "correctIndex": 1, "explanation": "Phản ứng tỏa nhiệt (Delta H < 0) nên giảm T sẽ chuyển dịch sang chiều thuận; chiều thuận giảm số mol khí (4 -> 2) nên tăng áp suất sẽ làm cân bằng dịch chuyển sang phải."}
    ]'::jsonb
),
(
    '33333333-3333-3333-3333-333333333303',
    'CH1015 - Hóa học đại cương',
    'Động hóa học',
    'Ghi chú',
    'Tốc độ phản ứng, Bậc phản ứng & Phương trình Arrhenius',
    true,
    '# Động học hóa học\n\n### 1. Định luật tác dụng khối lượng:\nv = k * [A]^m * [B]^n (m + n là bậc phản ứng).\n\n### 2. Phương trình Arrhenius:\nk = A * e^(-Ea / (R*T))\nln(k2 / k1) = (Ea / R) * (1/T1 - 1/T2)\nTrong đó Ea là năng lượng hoạt hóa.',
    'v = k*[A]^m*[B]^n | k = A * exp(-Ea / RT) | ln(k2/k1) = Ea/R * (1/T1 - 1/T2)',
    '[
        {"front": "Chu kỳ bán hủy t_(1/2) của phản ứng bậc 1 có phụ thuộc vào nồng độ đầu không?", "back": "Không, t_(1/2) = ln(2) / k"},
        {"front": "Chất xúc tác làm tăng tốc độ phản ứng bằng cách nào?", "back": "Làm giảm năng lượng hoạt hóa Ea của phản ứng"}
    ]'::jsonb,
    '[
        {"question": "Đối với phản ứng đơn giản 2A + B -> C, biểu thức tốc độ phản ứng lý thuyết là:", "options": ["v = k [A]^2 [B]", "v = k [A] [B]", "v = k [A] [B]^2", "v = k [C] / ([A]^2 [B])"], "correctIndex": 0, "explanation": "Với phản ứng đơn giản một giai đoạn, số mũ bằng chính hệ số tỷ lượng: v = k [A]^2 [B]."}
    ]'::jsonb
),
(
    '33333333-3333-3333-3333-333333333304',
    'CH1015 - Hóa học đại cương',
    'Điện hóa học',
    'Đề ôn tập',
    'Phương Trình Nernst & Sức Điện Động của Pin Galvani',
    true,
    '# Điện hóa học & Pin Galvani\n\n### 1. Phương trình Nernst:\nE = E0 + (0.059 / n) * lg([Ox] / [Kh]) ở 25 độ C (298 K).\n\n### 2. Sức điện động chuẩn của pin:\nE0_pin = E0_catot (cực dương) - E0_anot (cực âm)\nPhản ứng xảy ra tự phát khi E_pin > 0 (Delta G = -nFE < 0).',
    'E = E0 + (0.0592 / n) * lg([Ox]/[Kh]) | E0_pin = E0_catot - E0_anot | Delta G0 = -n*F*E0_pin',
    '[
        {"front": "Ở cực Anot của pin xảy ra quá trình gì?", "back": "Quá trình oxy hóa (nhường electron)"},
        {"front": "Hằng số Faraday F có giá trị xấp xỉ bao nhiêu?", "back": "96485 C/mol (thường lấy 96500 C/mol)"}
    ]'::jsonb,
    '[
        {"question": "Pin Daniell gồm cực Zn/Zn2+ (E0 = -0.76V) và Cu/Cu2+ (E0 = +0.34V). Sức điện động chuẩn E0 của pin là:", "options": ["1.10 V", "0.42 V", "-1.10 V", "-0.42 V"], "correctIndex": 0, "explanation": "E0_pin = E0_catot (Cu) - E0_anot (Zn) = 0.34 - (-0.76) = 1.10 V."}
    ]'::jsonb
),
(
    '33333333-3333-3333-3333-333333333305',
    'CH1015 - Hóa học đại cương',
    'Điện hóa học',
    'Bài tập',
    'Bài tập Điện phân nóng chảy và Dung dịch theo Định luật Faraday',
    true,
    '# Định luật Faraday về Điện phân\n\nKhối lượng chất giải phóng ở điện cực: m = (A * I * t) / (n * F).',
    'm = (A * I * t) / (n * 96500)',
    '[
        {"front": "Điện phân dung dịch CuSO4 với điện cực trơ, tại catot thoát ra chất gì?", "back": "Kim loại Cu bám vào catot"}
    ]'::jsonb,
    '[
        {"question": "Điện phân nóng chảy NaCl thu được kim loại Na ở điện cực nào?", "options": ["Catot (-)", "Anot (+)", "Cả hai cực", "Không thu được Na"], "correctIndex": 0, "explanation": "Cation Na+ di chuyển về Catot cực âm và nhận electron: Na+ + e -> Na."}
    ]'::jsonb
);

-- ========================================================================
-- 2. SAMPLE STUDENT PROFILES (8 HỒ SƠ SINH VIÊN ĐA DẠNG NĂNG LỰC)
-- Phân bổ HUST, FTU, UEH - Có đầy đủ Sinh viên A (Mất gốc) và Sinh viên B (Săn A/A+)
-- ========================================================================

-- Lưu ý: id được gán cố định để chế độ Mock dễ dàng map với auth test
INSERT INTO public.profiles (
    id, display_name, university, is_edu_verified, priority_subject,
    weak_topics, strong_topics, self_level, learning_goal, learning_style,
    free_slots, streak_days, total_study_minutes, commitment_deposit, free_invites_used, plan_tier
) VALUES
-- SINH VIÊN A: Nguyễn Tuấn Anh - HUST (Mất gốc cục bộ, hay trì hoãn, cần tìm bạn kéo)
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Nguyễn Tuấn Anh',
    'Đại học Bách khoa Hà Nội (HUST)',
    true,
    'MI1111 - Giải tích 1',
    ARRAY['Tích phân suy rộng', 'Chuỗi số'],
    ARRAY['Giới hạn & Liên tục'],
    1, -- Mất gốc
    'Cùng giải bài tập',
    'Pomodoro yên lặng',
    ARRAY['T2_TOI', 'T4_TOI', 'T6_TOI'],
    3,
    150,
    50000,
    1,
    'free'
),
-- SINH VIÊN B: Trần Minh Đức - HUST (Khá giỏi, săn A/A+ học bổng, kèm bạn để nhớ sâu)
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Trần Minh Đức',
    'Đại học Bách khoa Hà Nội (HUST)',
    true,
    'MI1111 - Giải tích 1',
    ARRAY['Đạo hàm & Vi phân'],
    ARRAY['Tích phân suy rộng', 'Chuỗi số'],
    3, -- Khá muốn ôn sâu
    'Luyện đề đạt A/A+',
    'Thảo luận sôi nổi',
    ARRAY['T2_TOI', 'T4_TOI', 'T7_TOI'],
    12,
    720,
    50000,
    0,
    'plus'
),
-- SINH VIÊN 3: Lê Thị Mai Hương - FTU (Cơ bản Hóa học đại cương, muốn qua môn an toàn)
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Lê Thị Mai Hương',
    'Đại học Ngoại thương (FTU)',
    true,
    'CH1015 - Hóa học đại cương',
    ARRAY['Cân bằng hóa học', 'Điện hóa học'],
    ARRAY['Nhiệt động học'],
    2, -- Cơ bản
    'Ôn lý thuyết qua môn',
    'Hỏi đáp nhanh phần khó',
    ARRAY['T3_TOI', 'T5_TOI', 'CN_TOI'],
    5,
    250,
    40000,
    2,
    'sprint'
),
-- SINH VIÊN 4: Hoàng Quốc Bảo - HUST (Giỏi Hóa học đại cương, chuyên trị Điện hóa)
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Hoàng Quốc Bảo',
    'Đại học Bách khoa Hà Nội (HUST)',
    true,
    'CH1015 - Hóa học đại cương',
    ARRAY['Nhiệt động học'],
    ARRAY['Cân bằng hóa học', 'Điện hóa học', 'Động hóa học'],
    3, -- Khá ôn sâu
    'Cùng giải bài tập',
    'Thảo luận sôi nổi',
    ARRAY['T3_TOI', 'T5_TOI', 'T6_TOI'],
    9,
    480,
    50000,
    0,
    'free'
),
-- SINH VIÊN 5: Vũ Phương Linh - UEH (Đại số tuyến tính: Yếu Ma trận nghịch đảo, ĐLTT)
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Vũ Phương Linh',
    'Đại học Kinh tế TP.HCM (UEH)',
    true,
    'MI1141 - Đại số',
    ARRAY['Ma trận & Định thức', 'Không gian vectơ'],
    ARRAY['Hệ phương trình tuyến tính'],
    1, -- Mất gốc
    'Cùng giải bài tập',
    'Pomodoro yên lặng',
    ARRAY['T2_TOI', 'T4_TOI', 'CN_SANG'],
    2,
    100,
    30000,
    3, -- Đã dùng hết 3 lượt free
    'free'
),
-- SINH VIÊN 6: Phạm Đăng Khoa - HUST (Đại số đỉnh cao, master Ánh xạ & Không gian vectơ)
(
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Phạm Đăng Khoa',
    'Đại học Bách khoa Hà Nội (HUST)',
    true,
    'MI1141 - Đại số',
    ARRAY['Hệ phương trình tuyến tính'],
    ARRAY['Ma trận & Định thức', 'Không gian vectơ', 'Ánh xạ tuyến tính'],
    3,
    'Luyện đề đạt A/A+',
    'Thảo luận sôi nổi',
    ARRAY['T2_TOI', 'T4_TOI', 'T6_TOI'],
    15,
    950,
    50000,
    1,
    'plus'
),
-- SINH VIÊN 7: Đặng Thảo Vy - Gmail cá nhân (Tài khoản trải nghiệm)
(
    '77777777-7777-7777-7777-777777777777',
    'Đặng Thảo Vy',
    'Tài khoản Trải nghiệm',
    false, -- Gmail thường
    'MI1111 - Giải tích 1',
    ARRAY['Chuỗi số'],
    ARRAY['Đạo hàm & Vi phân'],
    2,
    'Cùng giải bài tập',
    'Pomodoro yên lặng',
    ARRAY['T3_CHIEU', 'T5_CHIEU', 'T7_SANG'],
    1,
    50,
    20000,
    0,
    'free'
),
-- SINH VIÊN 8: Nguyễn Hữu Trí - HUST (Ôn thi cấp tốc Giải tích 1)
(
    '88888888-8888-8888-8888-888888888888',
    'Nguyễn Hữu Trí',
    'Đại học Bách khoa Hà Nội (HUST)',
    true,
    'MI1111 - Giải tích 1',
    ARRAY['Tích phân suy rộng'],
    ARRAY['Giới hạn & Liên tục', 'Đạo hàm & Vi phân'],
    2,
    'Ôn lý thuyết qua môn',
    'Hỏi đáp nhanh phần khó',
    ARRAY['T2_TOI', 'T5_TOI', 'CN_TOI'],
    4,
    200,
    50000,
    1,
    'sprint'
)
ON CONFLICT (id) DO NOTHING;
