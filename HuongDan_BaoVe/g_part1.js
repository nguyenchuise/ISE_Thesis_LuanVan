// PHAN 0 – II: ban do luan van, boi canh IE, nen tang thong ke BT1
module.exports=function(G){
const {L,D,f,fs_,fp,pct,pv,n0,coef,POL,note,warn,Q,LT,AD,YN}=G;
const {C,run,p,h1,h2,h3,fx,mkTable,img,cap}=L;
const k=[]; const B1=D.B1,B1M=D.B1M,S1=D.S1,B12=D.B12,B3=D.B3,SIM=D.SIM;
const pc=S1.phan_ung_canh_tranh, cb=POL["CBPO Realistic (kẹp P5–P95)"], M1=SIM.main.C1["1.0"], M2=SIM.main.C2["1.0"];

/* ═════════ PHẦN 0 ═════════ */
k.push(h1("PHẦN 0. CÁCH DÙNG TÀI LIỆU VÀ BẢN ĐỒ LUẬN VĂN"));
k.push(h2("0.1. Tài liệu này dùng để làm gì"));
k.push(p("Tài liệu được viết để anh đọc hiểu toàn bộ luận văn từ gốc: mỗi phương pháp được trình bày theo ba lớp — ① lý thuyết (trực giác trước, công thức sau), ② cách nó được áp dụng vào dữ liệu của luận văn kèm con số thật, và ③ ý nghĩa — tức điều mà con số đó cho phép và không cho phép kết luận. Cuối mỗi phần là các câu hỏi hội đồng hay hỏi kèm gợi ý trả lời. Mọi con số trong tài liệu được đọc tự động từ cùng các tệp JSON sinh ra luận văn, nên khớp tuyệt đối với bản nộp."));
k.push(note("Lộ trình đọc gợi ý (khoảng 10–12 buổi)",[
  "Buổi 1: Phần 0 và Phần I — nắm mạch lập luận và bối cảnh. Tự trình bày lại bằng lời trong 2 phút.",
  "Buổi 2–3: Phần II (BT1) — hồi quy, chẩn đoán phần dư, HC3, phân rã phương sai.",
  "Buổi 4–5: Phần III (BT2) — logistic, AUC, hiệu chuẩn, rò rỉ dữ liệu, nội sinh.",
  "Buổi 6–7: Phần IV (BT3) — tối ưu giá, điều kiện bậc nhất, lý thuyết đấu giá, giá bóng, giả dược.",
  "Buổi 8: Phần V (mô phỏng) — hàng đợi, quy tắc ưu tiên, mặt phẳng chuyển pha.",
  "Buổi 9: Phần VI–VII — thiết kế thực nghiệm, CRISP-DM và vị trí của IE.",
  "Buổi 10–12: Phần VIII–X — điểm yếu, bộ câu hỏi phản biện, bảng tra số liệu. Tập trả lời thành tiếng."]));

k.push(h2("0.2. Mạch lập luận của luận văn trong một trang"));
k.push(p(`Câu chuyện của luận văn có thể kể trong năm bước, và hội đồng sẽ đánh giá anh trước hết ở việc anh kể được mạch này một cách tự nhiên:`));
k.push(p([run("Bước 1 — Vấn đề. ",{bold:true}),run(`Doanh nghiệp phân phối vật tư B2B xử lý ${n0(S1.quy_mo.du_an)} hồ sơ báo giá (RFQ) với ${n0(S1.quy_mo.mat_hang)} dòng hàng trong ${S1.quy_mo.ky_quan_sat_ngay} ngày. Có hai bất thường: ${pct(S1.sla.ty_le_vi_pham,2)} hồ sơ vi phạm cam kết 7 ngày, và hệ số markup gần như không đổi (biên độ ${f(S1.bien_do_markup_giua_3_muc*100,2)} điểm %) dù tỷ lệ thắng giảm ${f((pc.Low.win-pc.High.win)*100,1)} điểm % khi cạnh tranh tăng.`,{})]));
k.push(p([run("Bước 2 — BT1 (thời gian). ",{bold:true}),run(`Biến động thời gian không đồng đều giữa 4 khâu; ${f(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"],1)}% phương sai tổng là đồng biến động giữa các khâu; Pricing là nút thắt và độc lập với khâu đầu. BT1 xuất thời gian dự báo (TAT_pred) cho BT2.`,{})]));
k.push(p([run("Bước 3 — BT2 (thắng/thua). ",{bold:true}),run(`Logistic dự báo xác suất thắng với AUC ngoài mẫu ${f(B12.bt2_metrics.AUC_test,3)}; giá quan trọng nhất nhưng yếu tố phi giá rất mạnh; hàng đợi và thời gian phản hồi có liên hệ âm với xác suất thắng (có điều kiện, chưa phải nhân quả).`,{})]));
k.push(p([run("Bước 4 — BT3 (giá). ",{bold:true}),run(`Tối ưu giá theo xác suất thắng (CBPO) cho ${fp(cb.uplift_pct,2)} lợi nhuận kỳ vọng. Cân bằng Bayesian Nash thuần giá (A, B) thất bại; đặc tả C phục hồi nhưng vẫn thua CBPO. Giá bóng năng lực gắn vào giá không tạo giá trị (giả dược).`,{})]));
k.push(p([run("Bước 5 — Mô phỏng và kết luận. ",{bold:true}),run(`Cùng giá bóng đó, dùng để XẾP THỨ TỰ xử lý tại pha Sales-WBS, vượt giả dược ${fs_(M1.compare.P4_vs_P3.mean_pp,2)} đến ${fs_(M2.compare.P4_vs_P3.mean_pp,2)} điểm % lợi nhuận ròng trong mô phỏng. Kết luận: giá là đòn bẩy cho biên lợi nhuận; điều phối tiếp nhận là đòn bẩy cho năng lực.`,{})]));
k.push(img("FIG_3_1_Methodology.png",576)); k.push(cap("Hình 0.1: Khung phương pháp của luận văn (Hình 3.1 trong bản nộp)"));

k.push(h2("0.3. Bài trình bày 2 phút (thuộc lòng ý, không thuộc lòng chữ)"));
k.push(note("Khung 2 phút",[
  `Vấn đề: báo giá B2B tần suất cao (≈ ${f(S1.tan_suat.quyet_dinh_gia_moi_ngay_lam_viec,0)} quyết định giá/ngày làm việc), ${pct(S1.sla.ty_le_vi_pham,1)} hồ sơ trễ SLA, markup không phản ứng với cạnh tranh.`,
  "Câu hỏi: thời gian biến động ở đâu (BT1), cái gì quyết định thắng (BT2), nên chào giá nào và năng lực ảnh hưởng ra sao (BT3).",
  "Phương pháp: CRISP-DM cho BT1–BT2; tối ưu giá + lý thuyết đấu giá + quản trị doanh thu cho BT3; mô phỏng hàng đợi cho phần liên kỳ; mọi kết luận có kiểm chứng ngoài mẫu, giả dược và độ nhạy.",
  `Kết quả: CBPO ${fp(cb.uplift_pct,1)}; cân bằng thuần giá thất bại; giá bóng chỉ có giá trị khi dùng để phân luồng.`,
  "Đóng góp: cổng 3 bước kiểm tra mô hình cân bằng; khung định giá hiệu chuẩn; nguyên tắc tách đòn bẩy giá và đòn bẩy điều phối; thiết kế A/B 3 nhánh.",
  "Giới hạn: một doanh nghiệp, dữ liệu quan sát, mô phỏng là bằng chứng định hướng; cần thực nghiệm để khẳng định nhân quả."]));

/* ═════════ PHẦN I ═════════ */
k.push(h1("PHẦN I. BỐI CẢNH VÀ CÁCH NHÌN CỦA KỸ THUẬT HỆ THỐNG CÔNG NGHIỆP"));
k.push(h2("I.1. Quy trình báo giá là một hệ thống sản xuất dịch vụ"));
k.push(LT());
k.push(p("Trong Kỹ thuật Hệ thống Công nghiệp (IE/ISE), một quy trình được nhìn như hệ thống gồm dòng vào (arrivals), các trạm xử lý (servers/stations) có năng lực hữu hạn, hàng đợi (queues) giữa các trạm, và chỉ tiêu đầu ra (throughput, thời gian chu kỳ, tỷ lệ đáp ứng cam kết). Ba công cụ nền tảng của IE xuất hiện xuyên suốt luận văn: thống kê và dự báo (để đo và giải thích biến động), vận trù học (để tối ưu quyết định), và mô phỏng/thiết kế thực nghiệm (để đánh giá chính sách trước khi triển khai)."));
k.push(AD());
k.push(p(`Mỗi hồ sơ RFQ đi qua bốn khâu tuần tự: Sales tiếp nhận → WBS phân rã kỹ thuật → Pricing tính giá → Supply Chain kiểm tra nguồn cung. Thời gian tổng (TAT — turnaround time) có trung vị ${f(S1.sla.TAT_median,2)} ngày, phân vị 90 là ${f(S1.sla.TAT_p90,2)} ngày; cam kết SLA là 7 ngày. Khâu Pricing có trung bình ${f(B1.eda[3].Mean,2)} ngày — dài nhất — và chính là nơi ra quyết định giá. Đây là điểm mấu chốt: nguồn lực khan hiếm về thời gian và nguồn lực ra quyết định giá là cùng một đội ngũ.`));
k.push(YN());
k.push(p("Nhìn bằng lăng kính IE, luận văn không chỉ là một bài toán học máy dự báo, mà là bài toán thiết kế hệ thống ra quyết định: dự báo (BT1, BT2) cung cấp đầu vào cho tối ưu (BT3), và tối ưu phải tôn trọng ràng buộc năng lực của hệ thống (giá bóng, mô phỏng hàng đợi). Đây là câu trả lời cho câu hỏi “luận văn này thuộc ngành IE ở điểm nào?”."));
k.push(h2("I.2. Hai bất thường làm nên tính cấp thiết"));
k.push(mkTable(["Cường độ cạnh tranh","Số dòng hàng","Markup trung bình","Tỷ lệ thắng"],
  [["Thấp",n0(pc.Low.n),f(pc.Low.markup,4),pct(pc.Low.win,2)],["Trung bình",n0(pc.Med.n),f(pc.Med.markup,4),pct(pc.Med.win,2)],["Cao",n0(pc.High.n),f(pc.High.markup,4),pct(pc.High.win,2)]],
  [2600,1800,2300,2300]));
k.push(cap("Bảng 0.1: Markup bất động trong khi tỷ lệ thắng biến thiên mạnh (Bảng 1.2 trong bản nộp)"));
k.push(p(`Diễn giải: nếu doanh nghiệp định giá có tính đến cạnh tranh, markup phải thấp hơn khi nhiều đối thủ. Dữ liệu cho thấy markup gần như hằng số — đây là dấu hiệu của định giá cost-plus (giá = giá vốn × hệ số cố định). Hai khả năng mở ra: doanh nghiệp đang để lại biên lợi nhuận ở nhóm ít cạnh tranh, hoặc mất đơn có thể thắng ở nhóm cạnh tranh cao. Phân định hai khả năng đó là lý do của BT3.`));
k.push(Q("Vì sao bài toán này xứng đáng là đề tài thạc sĩ chứ không chỉ là việc tác nghiệp?",
  `Vì ba lý do: (1) đây là quyết định lặp lại tần suất cao — khoảng ${f(S1.tan_suat.quyet_dinh_gia_moi_ngay_lam_viec,1)} quyết định giá mỗi ngày làm việc — nên cải thiện nhỏ mỗi quyết định nhân lên thành giá trị lớn; (2) có hai bất thường đo được (markup bất động, ${pct(S1.sla.ty_le_vi_pham,1)} vi phạm SLA); (3) hai bài toán thời gian và giá ràng buộc nhau qua cùng một nguồn lực, nên không thể giải riêng — đó là khoảng trống mà tài liệu chưa xử lý trên dữ liệu B2B thực.`));
k.push(Q("Đơn vị phân tích của từng bài toán là gì và vì sao?",
  `BT1 ở cấp hồ sơ (thời gian là thuộc tính của cả hồ sơ, n = ${n0(S1.quy_mo.du_an)}); BT2 và BT3 ở cấp dòng hàng (thắng/thua và giá được ghi cho từng mặt hàng). Vì trung bình ${f(S1.quy_mo.mat_hang_tb_moi_du_an,2)} dòng hàng/hồ sơ, các dòng cùng hồ sơ không độc lập — nên phải tách tập kiểm tra theo hồ sơ, dùng sai số chuẩn cụm, và ngẫu nhiên hóa theo hồ sơ trong A/B.`));

/* ═════════ PHẦN II ═════════ */
k.push(h1("PHẦN II. BÀI TOÁN 1 — HỒI QUY, CHẨN ĐOÁN GIẢ ĐỊNH VÀ PHÂN TÍCH BIẾN ĐỘNG"));
k.push(h2("II.1. Hồi quy tuyến tính OLS và định lý Gauss–Markov"));
k.push(LT());
k.push(p("Hồi quy tuyến tính mô hình hóa biến phụ thuộc y như tổ hợp tuyến tính của các biến độc lập cộng nhiễu. Ước lượng bình phương nhỏ nhất (OLS) chọn hệ số sao cho tổng bình phương phần dư nhỏ nhất, cho nghiệm dạng đóng."));
k.push(fx(["y = Xβ + ε        β̂ = (X'X)⁻¹ X'y        phần dư e = y − Xβ̂",
  "Gauss–Markov: nếu (G1) E[ε|X] = 0, (G2) Var(ε|X) = σ²I, (G3) không tự tương quan, (G4) X đủ hạng",
  "thì β̂ là BLUE — ước lượng tuyến tính không chệch có phương sai nhỏ nhất."]));
k.push(p("Trực giác cần nhớ: giả định phân phối chuẩn KHÔNG cần cho tính không chệch của hệ số; nó chỉ cần cho tính đúng của kiểm định t, F ở mẫu nhỏ. Còn phương sai không đều (vi phạm G2) không làm hệ số chệch, nhưng làm sai số chuẩn — và do đó p-value — sai."));
k.push(AD());
k.push(p(`TAT tổng được hồi quy theo 5 biến quan sát được lúc tiếp nhận: số cấp phê duyệt, số lần làm rõ bản vẽ, độ sâu hàng đợi Pricing, kinh nghiệm kỹ sư, năng suất gần đây. R² = ${f(B1.chan_doan_phan_du[0].R2,3)}; VIF của cả 5 biến xấp xỉ 1 nên không có đa cộng tuyến. Biến làm rõ bản vẽ có hệ số lớn nhất ở mọi khâu (Pricing: ${f(B1M.tung_khau[3].He_so,3)} ngày/lần).`));
k.push(YN());
k.push(p("Hệ số là “ngày tăng thêm khi biến tăng một đơn vị, giữ các biến khác cố định”. Khi biến đã chuẩn hóa Z-score (Phụ lục A), hệ số là “ngày tăng thêm khi biến tăng một độ lệch chuẩn” — so sánh được giữa các biến khác đơn vị."));

k.push(h2("II.2. Chẩn đoán phần dư: Breusch–Pagan, White, Jarque–Bera"));
k.push(LT());
k.push(fx(["Breusch–Pagan: hồi quy e² theo X → LM = n·R²_phụ ~ χ²(K);  H0: phương sai đều",
  "White: hồi quy e² theo X, X², tích chéo → không cần giả định dạng của phương sai thay đổi",
  "Jarque–Bera: JB = (n/6)·[S² + (K−3)²/4] ~ χ²(2);  S = độ lệch, K = độ nhọn;  H0: phần dư chuẩn"]));
k.push(p("Hình ảnh trực quan: vẽ phần dư theo giá trị dự báo. Nếu đám điểm loe ra như cái phễu, phương sai tăng theo mức dự báo — đó là phương sai thay đổi (heteroskedasticity). Nếu đám điểm cân đối nhưng có đuôi dài một phía, đó là phần dư lệch (skewness) — một vấn đề khác."));
k.push(AD());
const ct=B1.chan_doan_phan_du, dt=B1M.dac_ta;
k.push(mkTable(["Thang đo","BP p","White p","Độ lệch phần dư","MAE (ngày)"],
  [["TAT gốc",f(ct[0].BP_p,3),f(ct[0].White_p,3),f(ct[0].Skew_resid,2),f(dt[0].MAE_ngay,4)],
   ["log(TAT)",pv(ct[1].BP_p),pv(ct[1].White_p),f(ct[1].Skew_resid,2),f(dt[1].MAE_ngay,4)]],[2400,1500,1500,1900,1700]));
k.push(cap("Bảng 0.2: Thang gốc thỏa phương sai đều; log làm xuất hiện phương sai thay đổi"));
k.push(img("FIG_4_2_Residuals.png",576)); k.push(cap("Hình 0.2: Phần dư thang gốc (A) không có dạng phễu; sau log (B) xuất hiện phễu"));
k.push(YN());
k.push(p(`Đây là một điểm “ăn điểm” trước hội đồng vì nó cho thấy anh làm theo quy trình chứ không theo thói quen. GVHD dặn “phần dư bất ổn thì transform”. Luận văn kiểm tra TRƯỚC: thang gốc đã có phương sai đều (BP p = ${f(ct[0].BP_p,3)}); vấn đề thật là phần dư lệch (độ lệch ${f(ct[0].Skew_resid,2)}). Lấy log sửa được độ lệch nhưng lại TẠO RA phương sai thay đổi và làm MAE xấu đi ${f((dt[1].MAE_ngay/dt[0].MAE_ngay-1)*100,1)}%. Vì vậy chọn thang gốc + sai số chuẩn vững HC3.`));

k.push(h2("II.3. Sai số chuẩn vững HC3 và các phương án xử lý khác"));
k.push(LT());
k.push(fx(["Var_HC3(β̂) = (X'X)⁻¹ [ Σᵢ eᵢ² / (1 − hᵢᵢ)² · xᵢxᵢ' ] (X'X)⁻¹",
  "hᵢᵢ = đòn bẩy (leverage) của quan sát i — phần tử đường chéo của H = X(X'X)⁻¹X'"]));
k.push(p("HC3 (MacKinnon & White, 1985) giữ nguyên hệ số OLS, chỉ sửa ma trận phương sai để suy luận đúng khi phương sai không đều hoặc phần dư không chuẩn. Chia cho (1−h)² phạt mạnh các điểm đòn bẩy cao, nên HC3 có tính chất mẫu hữu hạn tốt hơn HC0–HC2. Ba nhóm biện pháp khi giả định bị vi phạm: (1) biến đổi biến phụ thuộc (log, Box–Cox) — đổi thang đo và mô hình; (2) sai số vững — giữ thang đo, sửa suy luận; (3) GLM (ví dụ Gamma–log) — đổi giả định phân phối."));
k.push(AD());
k.push(p(`Bốn đặc tả được so sánh (Bảng 4.2): OLS gốc, OLS log, OLS + HC3, GLM Gamma. OLS + HC3 có MAE thấp nhất (${f(dt[2].MAE_ngay,4)}) và thỏa phương sai đều; GLM Gamma có MAE ${f(dt[3].MAE_ngay,4)} và phương sai không đều.`));
k.push(YN());
k.push(p("Hệ quả thực tiễn: dự báo TAT nằm đúng đơn vị “ngày” mà quản lý hiểu được, không cần chuyển ngược từ log (vốn gây chệch khi lấy exp của trung bình log)."));
k.push(Q("Phần dư không chuẩn (JB bác bỏ) thì kết quả có còn tin được không?",
  `Có, với hai lý do. Thứ nhất, tính không chệch của OLS không cần phân phối chuẩn. Thứ hai, với n = 1.500, định lý giới hạn trung tâm làm phân phối của hệ số xấp xỉ chuẩn; và HC3 bảo vệ suy luận trước cả phương sai không đều lẫn phần dư lệch. Ngoài ra luận văn đánh giá bằng sai số ngoài mẫu (kiểm chứng chéo 5 lớp), không phụ thuộc giả định phân phối.`));
k.push(Q("Tại sao không dùng log như công trình trước?",
  `Vì chẩn đoán bác bỏ nó: log làm Breusch–Pagan từ p = ${f(ct[0].BP_p,3)} thành p < 0,0001 và MAE xấu đi ${f((dt[1].MAE_ngay/dt[0].MAE_ngay-1)*100,1)}%. Log phù hợp khi phương sai tăng theo mức kỳ vọng (quan hệ nhân); ở đây vấn đề là đuôi lệch, không phải phễu.`));

k.push(h2("II.4. Chuẩn hóa (standardize) khác co giãn (normalize)"));
k.push(LT());
k.push(fx(["Z-score:   z = (x − mean) / sd   → trung bình 0, độ lệch chuẩn 1; không bị chặn",
  "Min–Max:   x' = (x − min) / (max − min)  → [0,1]; nhạy với ngoại lai ở hai đầu"]));
k.push(AD());
k.push(p(`Luận văn dùng Z-score cho mọi hệ số cần so sánh (BT1 Phụ lục A, BT2 Bảng 4.6). Với BT2, trung bình và độ lệch chuẩn được tính CHỈ trên tập huấn luyện rồi áp cho tập kiểm tra — nếu tính trên toàn bộ dữ liệu sẽ rò rỉ thông tin tập kiểm tra. TAT có giá trị lớn nhất ${f(S1.sla.TAT_max,2)} ngày so với trung vị ${f(S1.sla.TAT_median,2)}; Min–Max sẽ dồn đa số quan sát vào một khoảng hẹp.`));

k.push(h2("II.5. R², R² hiệu chỉnh, AIC, BIC và kiểm chứng chéo"));
k.push(LT());
k.push(fx(["R² = 1 − SSE/SST  (không bao giờ giảm khi thêm biến)",
  "R²_adj = 1 − (1 − R²)(n − 1)/(n − K − 1)",
  "AIC = n·ln(SSE/n) + 2(K+1)        BIC = n·ln(SSE/n) + (K+1)·ln n",
  "Kiểm chứng chéo k lớp: chia dữ liệu k phần, lần lượt giữ 1 phần để đánh giá"]));
k.push(p("Lưu ý kỹ thuật hay bị hỏi: hệ số tương quan bội R = √R² là biến đổi đơn điệu của R², nên bị thổi phồng y hệt R² khi thêm biến. Công cụ đúng là chỉ số có phạt số biến (R²_adj, AIC, BIC) hoặc đánh giá ngoài mẫu."));
k.push(AD());
const mc=D.MC.bt1_r2_bias;
k.push(p(`Phụ lục A.2 làm một thí nghiệm có kiểm soát: thêm 5, 10, 20, 40 biến nhiễu ngẫu nhiên. R² tăng từ ${f(mc[0].R2,4)} lên ${f(mc[mc.length-1].R2,4)}; R² hiệu chỉnh gần như đứng yên (${f(mc[0].R2_hieu_chinh,4)} → ${f(mc[mc.length-1].R2_hieu_chinh,4)}); BIC tăng ${f(mc[0].BIC,0)} → ${f(mc[mc.length-1].BIC,0)}; R² kiểm chứng chéo giảm ${f(mc[0].R2_kiem_chung_cheo,4)} → ${f(mc[mc.length-1].R2_kiem_chung_cheo,4)}.`));
k.push(YN());
k.push(p("Đây là bằng chứng thực nghiệm cho yêu cầu của GVHD: không dùng R² để so sánh mô hình khác số biến. Câu nói gọn: “R² thưởng cho độ phức tạp, BIC và kiểm chứng chéo phạt nó.”"));

k.push(h2("II.6. So sánh mức biến động giữa các khâu"));
k.push(LT());
k.push(fx(["Hệ số biến thiên CV = SD / Mean  (biến động tương đối, so sánh được giữa thang khác nhau)",
  "Bartlett: kiểm định phương sai bằng nhau, rất nhạy với phi chuẩn",
  "Levene / Brown–Forsythe: dùng |x − trung vị| → vững trước phi chuẩn",
  "Kruskal–Wallis: kiểm định phi tham số dựa trên hạng — phân phối các nhóm như nhau?",
  "Bootstrap (Efron, 1979): lấy mẫu lại có hoàn lại 2.000 lần để dựng khoảng tin cậy cho chênh lệch CV"]));
k.push(AD());
const dn=B1.dong_nhat_phuong_sai, eda=B1.eda;
k.push(p(`Ba kiểm định cùng bác bỏ (Levene W = ${f(dn.levene_W,1)}, Bartlett χ² = ${f(dn.bartlett_chi2,1)}, Kruskal H = ${f(dn.kruskal_H,1)}, đều p < 0,0001). CV: Sales ${f(eda[0].CV,3)}, WBS ${f(eda[1].CV,3)}, SC ${f(eda[2].CV,3)}, Pricing ${f(eda[3].CV,3)}. Bootstrap cho thấy Sales khác cả ba khâu còn lại; ba khâu kia gần như đồng nhất.`));
k.push(YN());
k.push(p("Hai thước đo, hai kết luận, cả hai đều đúng: Pricing tốn thời gian nhất (tuyệt đối), Sales khó đoán nhất (tương đối). Cấu trúc là “một khâu tách biệt + ba khâu tương đồng”. Lý do dùng cả ba kiểm định: nếu chỉ dùng Bartlett, hội đồng có thể bác vì dữ liệu lệch; khi cả kiểm định vững và phi tham số đều bác bỏ, kết luận không phụ thuộc giả định."));

k.push(h2("II.7. Phân rã phương sai và ý nghĩa hiệp phương sai"));
k.push(LT());
k.push(fx(["Var(T_Sales + T_WBS + T_SC + T_Pricing) = Σ Var(T_s) + 2 Σ_{s<t} Cov(T_s , T_t)"]));
k.push(AD());
const dg=B1.phan_ra_phuong_sai["dong_gop_%"], tq=B1M.tuong_quan;
k.push(p(`Bốn khâu đóng góp riêng ${f(dg.Pricing,1)}% (Pricing), ${f(dg.WBS,1)}% (WBS), ${f(dg.Sales,1)}% (Sales), ${f(dg.SC,1)}% (SC); phần còn lại ${f(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"],1)}% là hiệp phương sai. Tương quan WBS–SC = ${f(tq.WBS_Days.SC_Days,3)}, nhưng Sales–Pricing = ${f(tq.Sales_Days.Pricing_Days,3)}.`));
k.push(YN());
k.push(p("Gần nửa biến thiên không thuộc khâu nào mà thuộc về “độ phức tạp chung của hồ sơ” — hồ sơ chậm ở khâu này thường chậm ở khâu khác. Hệ quả quản trị: cải tiến cục bộ một khâu chỉ chạm một phần biến động; can thiệp hiệu quả hơn là ở đầu vào (ví dụ giảm số lần làm rõ bản vẽ). Riêng Pricing gần như không tương quan với Sales: hàng đợi Pricing do tồn đọng của chính nó quyết định — cơ sở để mô phỏng Pricing như một hàng đợi riêng ở Mục 4.4."));

k.push(h2("II.8. Hai đường tính TAT và dự báo ngoài lớp (OOF)"));
k.push(LT());
k.push(p("Dự báo ngoài lớp (out-of-fold): chia dữ liệu 5 lớp; giá trị dự báo cho mỗi hồ sơ lấy từ mô hình được huấn luyện trên 4 lớp KHÔNG chứa hồ sơ đó. Nhờ vậy khi đưa TAT_pred làm biến cho BT2, nó không mang thông tin từ chính kết quả của hồ sơ — tránh rò rỉ dữ liệu (data leakage)."));
k.push(AD());
const tc=B1M.tong_vs_congdon;
k.push(p(`Đường trực tiếp có MAE ${f(tc.MAE_du_bao_tong,4)} ngày; đường cộng dồn 4 mô hình khâu có MAE ${f(tc.MAE_cong_don_4_khau,4)} ngày — chênh ${f(tc["Cai_thien_%"],2)}%. TAT_pred OOF có MAE ${f(B12.bt1_oof.MAE,4)}, R² ngoài mẫu ${f(B12.bt1_oof.R2_oof,4)}.`));
k.push(YN());
k.push(p("Phát biểu thẳng (và nên chủ động nói trước khi bị hỏi): tách theo khâu KHÔNG cải thiện dự báo tổng một cách đáng kể. Giá trị của nó nằm ở chẩn đoán — biết biến động đến từ đâu và cả 4 mô hình khâu đều có phương sai thay đổi (bị che khi cộng gộp)."));
k.push(Q("Nếu tách khâu chỉ cải thiện 0,77% thì làm để làm gì?",
  "Mục tiêu của tách khâu là chẩn đoán, không phải dự báo. Nó trả lời câu hỏi mà mô hình tổng không trả lời được: biến động nằm ở đâu (Sales khó đoán nhất), các khâu đồng biến động ra sao (47,4% hiệp phương sai), và Pricing có độc lập không (có). Hai đường tính nhất quán cũng là một kiểm tra dạng hàm."));
k.push(Q("Vì sao TAT_pred phải là dự báo chứ không phải TAT thực tế?",
  "Vì tại thời điểm ra quyết định giá, TAT thực tế của hồ sơ chưa xảy ra. Dùng TAT thực là dùng thông tin tương lai, làm mô hình tốt giả tạo và không triển khai được. Thêm vào đó, TAT_pred phải là OOF để không chứa thông tin từ chính kết quả của hồ sơ đó."));
k.push(Q("Khung diễn giải đăng ký trước (Bảng 3.3) có ý nghĩa gì?",
  "Nó chốt trước cách hiểu từng kịch bản kết quả (biến động đồng đều → vấn đề hệ thống; khác nhau → độ phức tạp không đều; hiệp phương sai lớn → yếu tố chung; không tương quan → độc lập) để tránh diễn giải hậu nghiệm theo hướng có lợi. Đây là tinh thần pre-registration trong nghiên cứu thực nghiệm."));
return k;
};
