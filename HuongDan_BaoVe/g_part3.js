// PHAN V – X: mo phong, thiet ke thuc nghiem, CRISP-DM va IE, diem yeu, bo cau hoi, tra cuu
module.exports=function(G){
const {L,D,f,fs_,fp,pct,pv,n0,coef,POL,note,warn,Q,LT,AD,YN}=G;
const {C,run,p,h1,h2,h3,fx,mkTable,img,cap}=L;
const k=[]; const SIM=D.SIM,B3=D.B3,B12=D.B12,B1=D.B1,B1M=D.B1M,S1=D.S1,TR=D.TR,AX=D.AX,EX=D.EX;
const POLS=SIM.meta.policies, CAL=SIM.calibration, M1=SIM.main.C1["1.0"], M2=SIM.main.C2["1.0"], A=B3.ab_design, A3=A.three_arm;
const cb=POL["CBPO Realistic (kẹp P5–P95)"], RB=B12.bt2_robust_status, gQ=coef("Pricing_Queue_Depth"), gT=coef("TAT_pred");
const cell=(cn,kb,pm)=>SIM.phase.grid[cn].find(r=>r.k_beta===kb&&r.pi_mult===pm);

/* ═════════ PHẦN V ═════════ */
k.push(h1("PHẦN V. NGHIÊN CỨU MÔ PHỎNG — HÀNG ĐỢI, QUY TẮC ƯU TIÊN, MẶT PHẲNG CHUYỂN PHA"));
k.push(h2("V.1. Vì sao cần mô phỏng"));
k.push(p("Đánh giá tĩnh định giá từng dòng hàng trên trạng thái hàng đợi đã xảy ra; nó không thể đo tác động của một chính sách lên thứ tự xử lý và thời gian chờ của các hồ sơ đến sau. Mô phỏng rời rạc theo sự kiện (discrete-event simulation — DES) là công cụ chuẩn của IE cho câu hỏi “nếu vận hành theo quy tắc khác thì hệ thống sẽ ra sao” khi không thể thử trực tiếp."));
k.push(h2("V.2. Kiến thức hàng đợi cần nắm"));
k.push(LT());
k.push(fx(["Ký hiệu Kendall:  M/G/m — đến Poisson (M), thời gian phục vụ tổng quát (G), m máy song song",
  "Hệ số sử dụng:   ρ = λ·E[S] / m   (phải < 1 thì hệ ổn định)",
  "Định luật Little: L = λ·W   — số trong hệ = tốc độ đến × thời gian trong hệ (đúng cho mọi kỷ luật phục vụ)",
  "Kỷ luật không ngắt (non-preemptive): hồ sơ đang xử lý không bị chen ngang",
  "Định luật bảo toàn (Kleinrock): với hệ bảo toàn công việc, đổi thứ tự không đổi tổng công việc chờ —",
  "  chỉ PHÂN BỔ LẠI thời gian chờ giữa các hồ sơ"]));
k.push(AD());
k.push(p(`Tốc độ đến ≈ ${f(S1.quy_mo.du_an/S1.quy_mo.ky_quan_sat_ngay,2)} hồ sơ/ngày; Pricing trung bình ${f(B1.eda[3].Mean,2)} ngày → theo Little, số hồ sơ trong khâu Pricing ≈ ${f(S1.quy_mo.du_an/S1.quy_mo.ky_quan_sat_ngay*B1.eda[3].Mean,1)}, cùng bậc với độ sâu hàng đợi quan sát trung bình 10. Định luật bảo toàn giải thích vì sao phân luồng giảm vi phạm khiêm tốn: nó không giảm tổng công việc, chỉ dời thời gian chờ từ hồ sơ này sang hồ sơ khác.`));
k.push(h2("V.3. Thiết kế mô phỏng: neo vào quan sát, hai hiệu chỉnh, CRN, bất định tham số"));
k.push(LT());
k.push(p("Bốn kỹ thuật làm nên độ tin cậy của mô phỏng:"));
k.push(p([run("Neo vào quan sát (anchored counterfactual). ",{bold:true}),run("Phát lại đúng 1.500 hồ sơ thật; chỉ thời gian chờ Pricing thay đổi. Kết quả phản thực = giá trị quan sát + (chờ dưới chính sách − chờ dưới FIFO). Nhờ vậy kịch bản hiện trạng tái lập chính xác dữ liệu (37,67% vi phạm), và mô phỏng chỉ đóng vai trò tạo chênh lệch.",{})]));
k.push(p([run("Hai cách hiệu chỉnh (C1, C2). ",{bold:true}),run(`Tham số (m, κ) chọn để thời gian chờ FIFO khớp mục tiêu: C1 lấy phần thời gian Pricing quy được cho hàng đợi (${f(CAL.C1.W_target,3)} ngày, m = ${CAL.C1.m}, κ = ${f(CAL.C1.kappa,2)}) — cận dưới thận trọng; C2 lấy phần thời gian tổng quy được cho tải (${f(CAL.C2.W_target,3)} ngày, m = ${CAL.C2.m}, κ = ${f(CAL.C2.kappa,2)}) — cận trên.`,{})]));
k.push(p([run("Số ngẫu nhiên chung (CRN). ",{bold:true}),run("Mọi chính sách dùng cùng chuỗi ngẫu nhiên trong mỗi lần lặp. Vì Var(X − Y) = Var X + Var Y − 2Cov(X,Y), CRN làm Cov lớn nên chênh lệch giữa hai chính sách được ước lượng rất chính xác — đó là lý do khoảng tin cậy hẹp.",{})]));
k.push(p([run("Bất định tham số. ",{bold:true}),run(`Mỗi lần lặp rút lại bộ hệ số BT2 từ phân phối chuẩn nhiều chiều với ma trận hiệp phương sai ước lượng; ${SIM.meta.R_main} lần lặp. Kết quả vì vậy phản ánh cả sai số ước lượng của β_TAT, β_Queue.`,{})]));
k.push(h2("V.4. Bảy cơ chế và hai quy tắc phân luồng"));
k.push(LT());
k.push(fx(["Quy tắc cμ (Cox & Smith, 1961): phục vụ theo thứ tự giảm dần của c/w (chi phí chờ / thời gian xử lý)",
  "Quy tắc ATC (Vepsalainen & Morton, 1987): I = (ω/w)·exp(−max(d − w − t, 0)/(K·w̄))",
  "G1 — ngưỡng giá bóng thuần: vào làn nhanh nếu còn kịp SLA và U·E[π] ≥ giá bóng suất xử lý",
  "G2 — chỉ số chi phí trễ: I = [λ_U(Q_t)·exp(−độ dư thời gian / w̄) + r·w̄] / ŵ với hồ sơ còn kịp;",
  "       hồ sơ đã chắc chắn trễ chỉ giữ thành phần xói mòn lợi nhuận r và xếp sau"]));
k.push(p("Trực giác G2: ưu tiên hồ sơ (i) nhạy cảm cam kết và đang sát hạn (thành phần λ_U·exp), (ii) có lợi nhuận bị xói mòn nhanh khi chờ (r, tính từ β_TAT, β_Queue), (iii) xử lý nhanh (chia cho ŵ — tinh thần cμ). Hồ sơ đã chắc chắn trễ bị đẩy ra sau vì cứu chúng không còn tránh được vi phạm."));
k.push(AD());
k.push(mkTable(["Cơ chế","C1: lợi nhuận ròng vs P1","C1: vi phạm","C2: lợi nhuận ròng vs P1","C2: vi phạm"],
  POLS.map(nm=>[nm,fp(M1.policies[nm].uplift_net_pct,2),pct(M1.policies[nm].breach,1),fp(M2.policies[nm].uplift_net_pct,2),pct(M2.policies[nm].breach,1)]),
  [3400,1500,1100,1500,1100]));
k.push(cap("Bảng 0.5: Kết quả mô phỏng tại π_SLA = 1 (Bảng 4.17)"));
k.push(YN());
k.push(p(`P4 − P3 (đồng bộ − giả dược): ${fs_(M1.compare.P4_vs_P3.mean_pp,2)} điểm (C1), ${fs_(M2.compare.P4_vs_P3.mean_pp,2)} điểm (C2). Phân rã: riêng phân luồng P5 − P2 = ${fs_(M1.compare.P5_vs_P2.mean_pp,2)} (C1); riêng λ động trong giá P6 − P3 = ${fs_(M1.compare.P6_vs_P3.mean_pp,2)} → giá trị đến hoàn toàn từ phân luồng. Vi phạm chỉ giảm xuống ${pct(M1.policies[POLS[3]].breach,1)}–${pct(M2.policies[POLS[3]].breach,1)} vì ${pct(EX.C1.share_breach_beyond_W,0)} hồ sơ vi phạm vượt 7 ngày nhiều hơn phần chờ có thể sắp xếp lại (C1) — muốn giảm sâu phải giảm khối lượng việc.`));
k.push(note("Tại sao biến thể G1 thất bại khi π_SLA cao",[
  "Bid-price gốc là quy tắc TỪ CHỐI: từ chối giải phóng năng lực.",
  "Trong báo giá, doanh nghiệp thường HOÃN chứ không từ chối: hồ sơ bị hoãn vẫn được xử lý và vẫn chịu vi phạm.",
  "Khi giá bóng lớn, G1 hoãn nhiều hồ sơ → tự tạo thêm vi phạm; G2 đưa chi phí vi phạm của chính hồ sơ vào chỉ số nên tránh được.",
  "Thứ tự xây dựng (G1 trước, G2 sau khi thấy G1 thất bại) đã được khai báo trong Mục 3.4.6 — hãy nói thẳng nếu bị hỏi."]));
k.push(h2("V.5. Mặt phẳng chuyển pha"));
k.push(LT());
k.push(p("“Mặt phẳng chuyển pha” (regime/phase diagram) quét hai tham số không chắc chắn và vẽ dấu/độ lớn của kết quả trên lưới, để thấy kết luận đúng trong vùng nào. Ở đây: k nhân |β_TAT|, |β_Queue| (độ nhạy thời gian của khách) và π_SLA (chi phí một lần vi phạm)."));
k.push(img("FIG_4_9_Phase.png",576)); k.push(cap("Hình 0.5: Mặt phẳng chuyển pha (Hình 4.9)"));
k.push(YN());
k.push(p(`G2 dương ở mọi ô (C1 từ ${fs_(Math.min(...SIM.phase.grid.C1.map(r=>r.d_pp)),2)} đến ${fs_(Math.max(...SIM.phase.grid.C1.map(r=>r.d_pp)),2)} điểm), kể cả k = 0 (${fs_(cell("C1",0,1).d_pp,2)} ở π = 1) — tức bền vững về DẤU kể cả khi khách hàng không phạt chậm. G1 có ranh giới đổi dấu thật: dương ở π thấp/k cao, âm ở π cao/k thấp (${SIM.phase.grid.C1.filter(r=>r.d_G1_pp<0).length}/30 ô âm). Đây là cách mô phỏng “trả lời” điểm yếu nội sinh của BT2.`));
k.push(Q("Mô phỏng có phải bằng chứng không?",
  "Không phải bằng chứng nhân quả. Nó là bằng chứng định hướng có điều kiện trên các giả định của mô hình: hàng đợi một tầng, quy luật phản hồi từ BT2, hai cách hiệu chỉnh. Khoảng tin cậy chỉ phản ánh nhiễu mô phỏng và bất định β, không phản ánh sai lệch đặc tả. Vai trò của nó là chọn chính sách đáng thử nghiệm và xác định tham số cần đo."));
k.push(Q("Khoảng tin cậy hẹp như vậy có đáng ngờ không?",
  "Hẹp là do số ngẫu nhiên chung (CRN): mọi chính sách chạy trên cùng chuỗi ngẫu nhiên nên phần nhiễu chung triệt tiêu khi lấy chênh lệch. Điều đó đúng về kỹ thuật, nhưng không nói gì về độ đúng của mô hình — nên luận văn trình bày hai kịch bản C1, C2 và mặt phẳng chuyển pha thay vì một con số."));
k.push(Q("Vì sao giá không ảnh hưởng hàng đợi trong mô phỏng?",
  "Vì công việc định giá phát sinh khi hồ sơ được tiếp nhận, trước quyết định giá; thắng hay thua thì Pricing vẫn phải làm. Đây là giả định được giữ tường minh để mô phỏng kiểm tra đúng lập luận Trụ cột II."));

/* ═════════ PHẦN VI ═════════ */
k.push(h1("PHẦN VI. THIẾT KẾ THỰC NGHIỆM A/B THEO CỤM"));
k.push(LT());
k.push(fx(["ICC (ANOVA một chiều) = (MSB − MSW) / (MSB + (m̄ − 1)·MSW)",
  "Hiệu ứng thiết kế:  DEFF = 1 + (m̄ − 1)·ICC   → cỡ mẫu hiệu dụng = n / DEFF",
  "Cỡ mẫu mỗi nhánh:   n = 2·(z_{1−α/2} + z_{1−β})²·σ² / δ² × DEFF",
  "MDE = (z_{1−α/2} + z_{1−β})·σ·√(2·DEFF/n)",
  "Ba nhánh, hai so sánh với đối chứng → Bonferroni: α/2 cho mỗi so sánh"]));
k.push(AD());
k.push(p(`Ngẫu nhiên hóa theo HỒ SƠ (không thể chào hai chính sách giá cho các dòng của cùng một báo giá). ICC lợi nhuận = ${f(A.ICC,4)}, m̄ = ${f(A.m_bar,2)} → DEFF = ${f(A.DEFF,3)}: mỗi dòng hàng chỉ mang khoảng ${f(100/A.DEFF,0)}% thông tin. Uplift 14%: hai nhánh cần ${n0(Math.round(A.uplift_14pct.n_proj_per_arm))} hồ sơ/nhánh (${f(A.uplift_14pct.months,1)} tháng); ba nhánh cần ${n0(Math.round(A3.uplift_14pct.n_proj_per_arm))} hồ sơ/nhánh (${f(A3.uplift_14pct.months,1)} tháng). Chỉ tiêu bảo vệ tỷ lệ thắng (biên 5 điểm, ba nhánh): ${f(A3.guard_wr_5pp.months,1)} tháng.`));
k.push(YN());
k.push(p("Ba nhánh = đối chứng (hiện trạng) + can thiệp (CBPO có neo C) + giả dược (nâng giá đồng loạt cùng tác động trung bình). Nhánh giả dược đắt về thời gian nhưng bắt buộc — bài học của Mục 4.3.6. Chỉ tiêu bảo vệ (guardrail) là tỷ lệ thắng, với biên không thua kém đăng ký trước."));
k.push(Q("Vì sao không ngẫu nhiên hóa theo dòng hàng để có nhiều mẫu hơn?",
  "Không khả thi về vận hành (một báo giá gửi đi như một chỉnh thể) và sai về thống kê: dòng hàng cùng hồ sơ tương quan (ICC ≈ 0,2), nên coi chúng độc lập sẽ đánh giá thấp phương sai gần một nửa và cho p-value quá nhỏ."));

/* ═════════ PHẦN VII ═════════ */
k.push(h1("PHẦN VII. CRISP-DM VÀ VỊ TRÍ CỦA LUẬN VĂN TRONG NGÀNH IE"));
k.push(p("CRISP-DM (Wirth & Hipp, 2000) gồm 6 pha: hiểu nghiệp vụ → hiểu dữ liệu → chuẩn bị dữ liệu → mô hình hóa → đánh giá → triển khai. Nó bao trọn BT1, BT2. Nhưng BT3 và mô phỏng (dẫn xuất cân bằng, giá bóng, đánh giá phản thực, thiết kế thực nghiệm) không thuộc pha nào của CRISP-DM — chúng thuộc vận trù học và kinh tế lượng. Vì vậy luận văn tổ chức theo hai trục chồng lên nhau (Hình 0.1)."));
k.push(mkTable(["Mảng kiến thức IE/ISE","Xuất hiện ở đâu trong luận văn"],
  [["Thống kê ứng dụng & kinh tế lượng","OLS, HC3, chẩn đoán phần dư, logistic, sai số chuẩn cụm, nội sinh (BT1, BT2, H1)"],
   ["Khai phá dữ liệu / học máy","CRISP-DM, kiểm chứng chéo, chống rò rỉ, ablation, XGBoost, hiệu chuẩn"],
   ["Vận trù học / tối ưu","Tối ưu giá phi tuyến, điều kiện bậc nhất, giải số Brent, giá bóng (đối ngẫu)"],
   ["Lý thuyết trò chơi / đấu giá","Bayesian Nash, Krishna (2009), số đối thủ hiệu dụng"],
   ["Quản trị doanh thu","Gallego & van Ryzin (1994), bid-price control (Talluri & van Ryzin, 2004)"],
   ["Lý thuyết hàng đợi & điều độ","M/G/m, định luật Little, quy tắc cμ, ATC, kỷ luật không ngắt"],
   ["Mô phỏng","Mô phỏng rời rạc theo sự kiện, CRN, hiệu chỉnh, phân tích chế độ"],
   ["Thiết kế thực nghiệm (DOE)","ICC, DEFF, MDE, phân tầng, Bonferroni, giả dược, guardrail"]],[3000,6000]));
k.push(cap("Bảng 0.6: Luận văn chạm tới những mảng nào của IE/ISE"));

/* ═════════ PHẦN VIII ═════════ */
k.push(h1("PHẦN VIII. ĐIỂM YẾU CỦA LUẬN VĂN VÀ CÁCH ĐỨNG VỮNG"));
k.push(p("Nguyên tắc chung: hội đồng không đánh rớt vì luận văn có hạn chế, mà vì học viên không thấy hoặc che hạn chế. Với mỗi điểm yếu dưới đây, hãy (1) thừa nhận rõ, (2) nói luận văn đã làm gì để kiểm soát, (3) nói cần gì tiếp theo."));
k.push(warn("1. Kênh thời gian phản hồi (β_Queue, β_TAT) là liên hệ có điều kiện và nhạy với cách chốt kết quả",[
  `Thừa nhận: nội sinh từ độ phức tạp ẩn; trên trạng thái trước đối soát (${f(RB.pct_changed,1)}% dòng đổi, tập trung ở hàng đợi sâu) hai hệ số không còn ý nghĩa.`,
  "Đã kiểm soát: kiểm tra độ vững được báo cáo (Mục 4.2.1, 5.5.1); mặt phẳng chuyển pha quét k từ 0; G2 vẫn dương khi k = 0.",
  "Cần làm: lưu hồ sơ đối soát trạng thái đơn hàng để trình khi được hỏi; thực nghiệm ngẫu nhiên hóa thứ tự xử lý."]));
k.push(warn("2. Dữ liệu đã chuẩn hóa/ẩn danh; giá chào = giá vốn × markup",[
  "Thừa nhận: markup không mang thông tin thị trường; con số tuyệt đối kém bền hơn kết luận định tính.",
  "Đã kiểm soát: dùng T/p làm biến giá (mang thông tin về giá khách kỳ vọng); báo cáo kết luận định tính."]));
k.push(warn("3. Các trường liên kết có quan hệ chặt với trường cũ",[
  "Effective_Competitors_N trùng Competitor_Intensity ở tầng thấp và trung bình (2, 3); chỉ tầng cao tách 4/5.",
  "Urgency_SLA_Sensitivity là chỉ số thiết kế từ Is_Strategic và số cấp phê duyệt — không mang thông tin độc lập; được dùng làm TRỌNG SỐ chi phí vi phạm, không làm biến giải thích.",
  "Market_Reserve_Bound ≈ 1,99 × giá vốn (biến thiên nhỏ) — vì vậy đặc tả C về cấu trúc là đặc tả tỷ lệ; đã nói rõ ở Mục 5.2.3."]));
k.push(warn("4. N không được nhận dạng; mô phỏng là mô hình; một doanh nghiệp",[
  "N: bốn phương pháp phân tán → độ nhạy đầy đủ; CBPO không phụ thuộc N.",
  "Mô phỏng: hai kịch bản C1/C2, đọc như khoảng định hướng.",
  "Khái quát hóa: đóng góp chuyển giao được là quy trình chẩn đoán (Cổng 3 bước), không phải con số."]));
k.push(warn("5. Minh bạch về công cụ hỗ trợ trong quá trình làm luận văn",[
  "Nếu luận văn có dùng công cụ AI hỗ trợ viết mã, phân tích hoặc soạn thảo, hãy tra quy định hiện hành của trường/khoa về sử dụng AI và khai báo theo đúng quy định (ví dụ một mục trong Lời cam đoan hoặc Phụ lục C).",
  "Khi được hỏi, trả lời trung thực về cách anh đã dùng công cụ, và chứng tỏ anh hiểu, kiểm chứng và chịu trách nhiệm với từng bước — đó chính là mục đích của tài liệu này.",
  "Tránh mọi câu trả lời mâu thuẫn với Lời cam đoan; nếu Lời cam đoan hiện chưa phản ánh đúng thực tế, nên điều chỉnh với GVHD trước khi nộp."]));

/* ═════════ PHẦN IX ═════════ */
k.push(h1("PHẦN IX. BỘ CÂU HỎI PHẢN BIỆN TỔNG HỢP"));
k.push(h2("IX.1. Câu hỏi tổng quát"));
k.push(...Q("Đóng góp mới của luận văn là gì, nói trong một câu?",
  "Trên dữ liệu báo giá B2B thực, luận văn cho thấy giá bóng của năng lực chỉ tạo giá trị khi dùng để điều phối thứ tự tiếp nhận chứ không khi gắn vào giá chào, và cân bằng thuần giá chỉ áp dụng được khi miền chi phí được định nghĩa từ phía cầu ở cấp dòng hàng — kèm một quy trình kiểm chứng (giả dược, tỷ lệ kẹp, độ nhạy) để phát hiện những điều đó."));
k.push(...Q("Nếu chỉ được giữ một kết quả, anh giữ kết quả nào?",
  `CBPO ${fp(cb.uplift_pct,2)}: dương, bền vững qua mọi phân tích độ nhạy, không phụ thuộc tham số không nhận dạng được, và có bản thiết kế A/B sẵn để xác nhận.`));
k.push(...Q("Hai giả thuyết H1, H2 kết luận thế nào?",
  `H1 bị bác bỏ: hành vi lịch sử là cost-plus (b ≈ 0); giá tối ưu phản ứng với N nhưng yếu (b = ${fs_(B3.H1_EffN.FOC_lnMargin.slope,2)}); đặc tả cân bằng tốt nhất vẫn thua CBPO. H2: bác bỏ ở dạng tín hiệu giá (giả dược); được ủng hộ có điều kiện trong mô phỏng ở dạng quy tắc phân luồng.`));
k.push(...Q("Vì sao gọi là “kết quả âm có giá trị”?",
  "Vì nó được chẩn đoán đầy đủ: biết vì sao thất bại (ba trụ cột), điều kiện đảo chiều (N, π_SLA, k), và một bộ tiêu chí để nghiên cứu sau kiểm tra trước khi đầu tư. Kết quả âm có chẩn đoán tích lũy tri thức; kết quả dương chưa kiểm chứng thì không."));
k.push(h2("IX.2. Câu hỏi kỹ thuật thống kê"));
k.push(...Q("Breusch–Pagan và White khác gì nhau?",
  "BP hồi quy bình phương phần dư theo các biến độc lập — phát hiện phương sai thay đổi tuyến tính theo X. White thêm bình phương và tích chéo — tổng quát hơn, không cần giả định dạng. Trên thang gốc cả hai đều không bác bỏ."));
k.push(...Q("HC3 khác HC0 thế nào?",
  "HC0 dùng eᵢ² trực tiếp; HC3 chia cho (1 − hᵢᵢ)², phạt điểm đòn bẩy cao, nên ít bị đánh giá thấp phương sai ở mẫu hữu hạn (MacKinnon & White, 1985)."));
k.push(...Q("R² hiệu chỉnh có thể âm không?",
  "Có, khi mô hình giải thích kém hơn mức kỳ vọng do ngẫu nhiên với số biến đó. Nó không phải bình phương của đại lượng nào."));
k.push(...Q("AUC có bị ảnh hưởng bởi tỷ lệ thắng (mất cân bằng lớp) không?",
  "AUC không phụ thuộc ngưỡng và ít nhạy với mất cân bằng; nhưng Brier và hiệu chuẩn thì có. Vì vậy luận văn báo cáo cả ba."));
k.push(...Q("Vì sao dùng bootstrap cho khoảng tin cậy AUC?",
  "Phân phối mẫu của AUC không có dạng đóng đơn giản; bootstrap (1.000 lần lấy mẫu lại) cho khoảng tin cậy thực nghiệm mà không cần giả định phân phối."));
k.push(...Q("Sai số chuẩn cụm khác HC3 ra sao?",
  "HC3 cho phép phương sai khác nhau giữa quan sát nhưng giả định chúng độc lập. Sai số chuẩn cụm cho phép thêm tương quan trong cùng cụm (hồ sơ) — cần khi nhiều dòng hàng thuộc một hồ sơ."));
k.push(...Q("Nếu bỏ TAT_pred khỏi BT2 thì sao?",
  `Nhóm năng lực xử lý (hàng đợi, kinh nghiệm, TAT_pred) khi bị loại làm AUC giảm ${f(Math.abs(B12.bt2_ablation.find(r=>r.loai_nhom==="Năng lực xử lý").delta_AUC),4)} — đóng góp vừa. TAT_pred là cầu nối BT1 → BT2; bỏ nó thì BT1 không còn vai trò đầu vào.`));
k.push(h2("IX.3. Câu hỏi về tối ưu và lý thuyết"));
k.push(...Q("Hãy viết điều kiện bậc nhất của bài toán giá.",
  "E[π] = (p − c)P(p). Đạo hàm: P + (p − c)P(1−P)(−γT/p²) = 0. Chia cho P: γT(p − c)(1 − P) = p². Vì P phụ thuộc p, phương trình ẩn → giải số. Đạo hàm bậc hai đổi dấu → phi tuyến, có cực đại nội suy duy nhất trên miền."));
k.push(...Q("Vì sao phải kẹp trong [P5; P95]?",
  "Mô hình xác suất thắng chỉ được học trong vùng giá đã quan sát; ra ngoài là ngoại suy. Kẹp giữ khuyến nghị trong vùng mô hình đáng tin, và báo cáo tỷ lệ kẹp cho biết đầu ra do công thức hay do ràng buộc quyết định."));
k.push(...Q("Best-response khác cân bằng Nash thế nào?",
  "Best-response tối ưu trước hành vi lịch sử của đối thủ (coi là cố định). Cân bằng Nash: mỗi bên tối ưu đồng thời trước chiến lược cân bằng của bên kia — hành vi đối thủ là nội sinh. CBPO là best-response một phía, không phải Nash; luận văn không gọi nó là Nash."));
k.push(...Q("P(Win|p,x) có phải xác suất hậu nghiệm Bayes không?",
  "Không. Đó là ước lượng thực nghiệm dạng rút gọn từ hồi quy logistic, không phải hậu nghiệm của một mô hình Bayes. Chữ “Bayesian” chỉ xuất hiện trong “Bayesian Nash” — khái niệm cân bằng với thông tin không đầy đủ."));
k.push(...Q("Giá bóng trong luận văn có phải biến đối ngẫu của một bài toán quy hoạch không?",
  "Về tinh thần là có (giá trị cận biên của năng lực), nhưng luận văn không giải bài toán quy hoạch tuyến tính; λ(Q) được xây từ ngoại tác tắc nghẽn: số vi phạm kỳ vọng tăng thêm khi nhận thêm một hồ sơ, nhân với chi phí một lần vi phạm."));
k.push(...Q("π_SLA lấy ở đâu?",
  `Không có số liệu kế toán, nên hiệu chỉnh 0,5 lần biên lợi nhuận và quét từ 0,25 đến 5 lần. Ngưỡng hòa vốn để giá bóng ngang lợi nhuận hồ sơ trung vị là khoảng ${f(TR.pi_breakeven_USD,0)} USD (${f(TR.pi_breakeven_x_margin,1)} lần biên) — tham số doanh nghiệp cần xác định.`));
k.push(h2("IX.4. Câu hỏi về dữ liệu và ứng dụng"));
k.push(...Q("Bộ dữ liệu được lấy và xử lý thế nào?",
  `Trích từ ERP, liên kết CRM và Sourcing; 11.694 bản ghi thô → ${n0(S1.quy_mo.mat_hang)} hợp lệ sau loại trùng, thiếu khóa, trạng thái không xác định; đã ẩn danh hóa và tiêm nhiễu theo yêu cầu bảo mật; BT2 loại khuyết còn ${n0(B12.bt2_n.items)} dòng. Biến kết quả theo trạng thái đơn hàng cuối kỳ.`));
k.push(...Q("Doanh nghiệp nên làm gì ngày mai?",
  "Bốn việc theo Bảng 6.3: chạy A/B ba nhánh cho định giá hiệu chuẩn; thí điểm bộ lọc phân luồng G2 ở chế độ xếp thứ tự tại pha Sales-WBS; xác định chi phí kế toán của một lần trễ hạn và đo độ nhạy thời gian của khách; giảm số lần làm rõ bản vẽ ở khâu tiếp nhận."));
k.push(...Q("Vì sao bộ lọc đặt ở pha Sales-WBS?",
  "Vì đó là điểm cuối cùng trước khi hồ sơ vào hàng đợi Pricing — sau đó không còn đòn bẩy nào chạm được vào thời gian chờ. Sales cũng là khâu biến động tương đối cao nhất, nơi phân loại hồ sơ theo độ phức tạp có giá trị nhất."));
k.push(...Q("Mô hình triển khai thế nào trong thực tế?",
  "Giữ vai trò hỗ trợ quyết định: người định giá có quyền ghi đè và mọi lần ghi đè được ghi nhận; quy tắc phân tích đăng ký trước; huấn luyện lại định kỳ và theo dõi chỉ số ổn định; lưu vết dữ liệu trạng thái đơn hàng."));

/* ═════════ PHẦN X ═════════ */
k.push(h1("PHẦN X. BẢNG TRA CỨU NHANH VÀ THUẬT NGỮ"));
k.push(h2("X.1. Những con số cần thuộc"));
const nC=POL["Nash C — cận dòng hàng, N thực tế (kẹp)"];
k.push(mkTable(["Nội dung","Giá trị"],
 [["Quy mô","1.500 hồ sơ × 31 trường; 8.249 dòng hàng × 23 trường; 220 khách; 299 ngày"],
  ["Vi phạm SLA 7 ngày",`${S1.sla.so_vi_pham}/1.500 = ${pct(S1.sla.ty_le_vi_pham,2)}; TAT trung vị ${f(S1.sla.TAT_median,2)} ngày`],
  ["Tỷ lệ thắng; chênh thấp–cao",`${pct(S1.gia_tri.ty_le_thang_mat_hang,2)}; ${f((S1.phan_ung_canh_tranh.Low.win-S1.phan_ung_canh_tranh.High.win)*100,2)} điểm % (markup chỉ ${f(S1.bien_do_markup_giua_3_muc*100,2)} điểm %)`],
  ["BT1",`CV Sales ${f(B1.eda[0].CV,3)}; hiệp phương sai ${f(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"],1)}%; r(Sales,Pricing) ${f(B1M.tuong_quan.Sales_Days.Pricing_Days,3)}; BP p gốc ${f(B1M.dac_ta[0].BP_p,3)}; hai đường tính chênh ${f(B1M.tong_vs_congdon["Cai_thien_%"],2)}%`],
  ["BT2",`AUC ${f(B12.bt2_metrics.AUC_test,4)}; Brier ${f(B12.bt2_metrics.Brier_test,4)}; β giá ${fs_(coef("Price_Competitiveness").beta_z,3)}; β hàng đợi ${fs_(gQ.beta_z,3)}; β TAT ${fs_(gT.beta_z,3)}; AUC không giá ${f(B12.bt2_ablation[0].AUC_test,3)}`],
  ["BT3 chính sách",`CBPO ${fp(cb.uplift_pct,2)} (kẹp ${pct(cb.clip,0)}); Nash A/B kẹp ${pct(POL["Nash A — miền tuyệt đối (kẹp)"].clip,0)}/${pct(POL["Nash B — miền tỷ lệ (kẹp)"].clip,0)}; Nash C kẹp ${pct(nC.clip,0)}, ${fp(nC.uplift_pct,2)}`],
  ["H1",`Lịch sử b = ${fs_(B3.H1_EffN.lich_su_lnMarkup.slope,4)}; FOC b = ${fs_(B3.H1_EffN.FOC_lnMargin.slope,3)}; Nash C b = ${fs_(B3.H1_EffN.NashC_lnMargin.slope,3)} (đồng nhất thức)`],
  ["H2 tĩnh (giả dược)",`λ(Q) ${fs_(B3.placebo.dong_gop_dieu_tiet_pp,2)} điểm; λ(Q)·U ${fs_(B3.placebo.dong_gop_dieu_tiet_U_pp,2)} điểm`],
  ["Mô phỏng (π = 1)",`P4 − P3: ${fs_(M1.compare.P4_vs_P3.mean_pp,2)} (C1) / ${fs_(M2.compare.P4_vs_P3.mean_pp,2)} (C2) điểm; vi phạm ${pct(M1.policies[POLS[3]].breach,1)} / ${pct(M2.policies[POLS[3]].breach,1)}`],
  ["A/B",`ICC ${f(A.ICC,3)}, DEFF ${f(A.DEFF,2)}; 3 nhánh: ${n0(Math.round(A3.uplift_14pct.n_proj_per_arm))} hồ sơ/nhánh, ${f(A3.uplift_14pct.months,1)} tháng`]],[2600,6400]));
k.push(cap("Bảng 0.7: Bảng tra số liệu then chốt"));
k.push(h2("X.2. Thuật ngữ Anh – Việt"));
k.push(mkTable(["Thuật ngữ","Nghĩa ngắn gọn"],
 [["Heteroskedasticity","Phương sai sai số thay đổi theo quan sát"],["Robust (HC3) standard error","Sai số chuẩn vững với phương sai thay đổi"],
  ["Leverage","Đòn bẩy — mức ảnh hưởng tiềm năng của một quan sát lên đường hồi quy"],["Out-of-fold (OOF)","Dự báo cho quan sát từ mô hình không huấn luyện trên nó"],
  ["Data leakage","Rò rỉ dữ liệu — thông tin kiểm tra lọt vào huấn luyện"],["Calibration","Hiệu chuẩn — xác suất dự báo khớp tần suất thực"],
  ["Ablation","Loại từng nhóm biến để đo đóng góp"],["Endogeneity","Nội sinh — biến độc lập tương quan với sai số do biến ẩn"],
  ["Conditional association","Liên hệ có điều kiện — chưa phải nhân quả"],["Best-response","Tối ưu một phía trước hành vi đối thủ cố định"],
  ["Bayesian Nash equilibrium","Cân bằng khi mỗi bên tối ưu theo niềm tin về loại của đối thủ"],["Bid shading","Cộng thêm vào chi phí trong giá chào, giảm khi cạnh tranh tăng"],
  ["Shadow price","Giá bóng — giá trị cận biên của một đơn vị tài nguyên"],["Bid-price control","Nhận yêu cầu khi giá trị ≥ tổng giá bóng tài nguyên tiêu thụ"],
  ["Placebo arm","Nhánh giả dược — cùng tác động trung bình, bỏ cơ chế"],["Common random numbers","Số ngẫu nhiên chung — giảm phương sai khi so sánh chính sách"],
  ["Design effect (DEFF)","Hệ số thổi phồng cỡ mẫu do phân cụm"],["Minimum detectable effect","Hiệu ứng nhỏ nhất phát hiện được với công suất cho trước"],
  ["Guardrail metric","Chỉ tiêu bảo vệ — không được xấu đi quá biên cho phép"],["Phase / regime diagram","Mặt phẳng chuyển pha — kết luận theo vùng tham số"]],[3300,5700]));
k.push(cap("Bảng 0.8: Thuật ngữ"));
k.push(h2("X.3. Bản đồ mã nguồn → mục luận văn"));
k.push(mkTable(["Tập lệnh","Làm gì","Mục"],
 [["ch1_stats.py","Thống kê nền, mô tả dữ liệu","1.2, 3.1, B.3"],["bt1_pertask.py","EDA khâu, kiểm định đồng nhất, bootstrap CV, phân rã phương sai, chẩn đoán phần dư","4.1"],
  ["bt1_models.py","4 đặc tả, hai đường tính, hồi quy từng khâu","4.1.2–4.1.4"],["metric_compare.py","Thí nghiệm biến nhiễu R² / pseudo R²","A.2, B.1"],
  ["bt3_form2.py","Kiểm chứng FOC bằng dò lưới và Brent","4.3.1"],["ch4_bt12.py","TAT_pred OOF, logistic, hiệu chuẩn, ablation, XGBoost, kiểm tra độ vững","4.2"],
  ["ch4_bt3.py","Chính sách giá, Nash A/B/C, λ, giả dược, H1, độ nhạy, A/B","4.3, 4.6"],["ch4_sim.py, ch4_sim_figs.py","Mô phỏng hàng đợi, 7 cơ chế, mặt phẳng chuyển pha","4.4"],
  ["ch5_triage.py","Độ lớn giá bóng, ngưỡng hòa vốn","5.3.4"],["ch4_icc_appx.py","ICC, hệ số Phụ lục A","A.1, B.2, 4.6"],["figs_ch1_ch3.py","Hình 1.1, 1.2, 3.1","1, 3"]],[2600,4700,1700]));
k.push(cap("Bảng 0.9: Mã nguồn và mục tương ứng"));
k.push(p("Gợi ý luyện tập cuối cùng: mở từng tập lệnh, đọc khối chú thích đầu file, chạy lại bằng bash run_all.sh, rồi đối chiếu một con số trong JSON với một câu trong luận văn. Làm được điều này cho 10 con số quan trọng nhất ở Bảng 0.7 là đủ tự tin trả lời câu hỏi “anh tính con số này thế nào?”."));
return k;
};
