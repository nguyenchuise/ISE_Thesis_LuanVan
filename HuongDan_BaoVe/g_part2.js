// PHAN III – IV: BT2 logistic; BT3 toi uu gia, ly thuyet dau gia, gia bong, gia duoc
module.exports=function(G){
const {L,D,f,fs_,fp,pct,pv,n0,coef,POL,note,warn,Q,LT,AD,YN}=G;
const {C,run,p,h1,h2,h3,fx,mkTable,img,cap}=L;
const k=[]; const B12=D.B12,B3=D.B3,S1=D.S1,MC=D.MC,FOC=D.FOC;
const m2=B12.bt2_metrics, sp=B12.bt2_split, ab=B12.bt2_ablation, AB=n=>ab.find(r=>r.loai_nhom===n), RB=B12.bt2_robust_status;
const cb=POL["CBPO Realistic (kẹp P5–P95)"];
const gPC=coef("Price_Competitiveness"), gQ=coef("Pricing_Queue_Depth"), gT=coef("TAT_pred"), gCI=coef("CompInt"), gSQE=coef("Supplier_SQE_Score");

/* ═════════ PHẦN III ═════════ */
k.push(h1("PHẦN III. BÀI TOÁN 2 — HỒI QUY LOGISTIC VÀ XÁC SUẤT THẮNG"));
k.push(h2("III.1. Hồi quy logistic: mô hình, ước lượng, diễn giải"));
k.push(LT());
k.push(p("Khi biến phụ thuộc là nhị phân (thắng = 1, thua = 0), hồi quy tuyến tính không phù hợp vì dự báo có thể ra ngoài [0, 1]. Logistic mô hình hóa logarit tỷ số chênh (log-odds) như hàm tuyến tính, rồi đưa về xác suất qua hàm sigmoid."));
k.push(fx(["η = β₀ + Σ βₖ xₖ        ln[p/(1−p)] = η        p = 1/(1 + e^(−η))",
  "Hợp lý cực đại: ℓ(β) = Σ [yᵢ ln pᵢ + (1−yᵢ) ln(1−pᵢ)];  điều kiện bậc nhất X'(y − p) = 0 → giải bằng Newton–Raphson/IRLS",
  "Tỷ số chênh: OR = e^β — tăng x một đơn vị nhân odds thắng với OR",
  "Hiệu ứng biên lên xác suất: ∂p/∂x = β · p(1−p) — lớn nhất khi p = 0,5"]));
k.push(p("Cách đọc đúng: OR là phép NHÂN lên odds, không phải lên xác suất. OR = 2,31 nghĩa là odds thắng gấp 2,31 lần, chứ không phải xác suất gấp 2,31 lần. Khi biến đã Z-score, OR là “mỗi một độ lệch chuẩn”."));
k.push(AD());
k.push(p(`Mẫu ${n0(B12.bt2_n.items)} dòng hàng hợp lệ (loại khuyết theo danh sách), ${n0(sp.train_items)} huấn luyện / ${n0(sp.test_items)} kiểm tra (${sp.test_projects} hồ sơ). 13 biến trong 6 nhóm có cơ chế kinh tế và dấu kỳ vọng đăng ký trước (Bảng 3.4). Kết quả chính: chỉ số cạnh tranh giá β = ${fs_(gPC.beta_z,3)} (OR ${f(gPC.OR_z,2)}); điểm chất lượng NCC ${fs_(gSQE.beta_z,3)}; cường độ cạnh tranh ${fs_(gCI.beta_z,3)}; hàng đợi ${fs_(gQ.beta_z,3)}; TAT dự báo ${fs_(gT.beta_z,3)} (p = ${f(gT.p,4)}).`));
k.push(YN());
k.push(p("Mọi hệ số có ý nghĩa đều đúng dấu kỳ vọng — đây là một dạng kiểm tra tính hợp lệ của mô hình (face validity). Giá là yếu tố mạnh nhất, nhưng bốn biến năng lực nhà cung cấp cộng lại cũng rất mạnh: thị trường không cạnh tranh thuần giá."));

k.push(h2("III.2. Vì sao biến giá là T/p chứ không phải markup"));
k.push(AD());
const pvr=B12.bt2_price_var;
k.push(p(`Hai ứng viên: markup = p/c (từ giá vốn của chính doanh nghiệp) và chỉ số cạnh tranh giá r = T/p (giá mục tiêu của khách / giá chào). Markup: β = ${fs_(pvr.Markup_Pct.beta_z,4)}, p = ${f(pvr.Markup_Pct.p,3)}, AUC ${f(pvr.Markup_Pct.AUC_test,4)} — ngang mô hình không có giá. T/p: AUC ${f(pvr.Price_Competitiveness.AUC_test,4)}.`));
k.push(YN());
k.push(p("Markup không chứa thông tin thị trường vì nó gần như hằng số (cost-plus) và trong dữ liệu đã chuẩn hóa, giá chào = giá vốn × markup. Khách hàng không quan tâm giá vốn của ta; họ so giá chào với giá họ kỳ vọng — đó là T/p. Vì r = T/p là nghịch đảo giá, dấu kỳ vọng là DƯƠNG (r tăng = chào rẻ hơn tương đối = dễ thắng hơn)."));

k.push(h2("III.3. Đánh giá mô hình: AUC, Brier, pseudo R², hiệu chuẩn"));
k.push(LT());
k.push(fx(["AUC = P(điểm của một ca thắng ngẫu nhiên > điểm của một ca thua ngẫu nhiên)  — đo khả năng XẾP HẠNG",
  "Brier = (1/n) Σ (pᵢ − yᵢ)²  — đo độ chính xác của XÁC SUẤT (càng nhỏ càng tốt)",
  "McFadden R² = 1 − ℓ(β̂)/ℓ(β̂₀);  McFadden hiệu chỉnh = 1 − (ℓ − K)/ℓ₀;  Nagelkerke = Cox–Snell chuẩn hóa về [0,1]",
  "Hiệu chuẩn (calibration): trong nhóm có p dự báo ≈ 0,7 thì tỷ lệ thắng thực ≈ 70%"]));
k.push(p("Điểm khái niệm quan trọng nhất của BT2: một mô hình có thể xếp hạng tốt (AUC cao) nhưng xác suất sai mức (hiệu chuẩn kém). Vì BT3 nhân xác suất với biên lợi nhuận để tính lợi nhuận kỳ vọng, sai mức xác suất truyền thẳng sang quyết định giá — nên hiệu chuẩn là điều kiện bắt buộc, không phải trang trí."));
k.push(AD());
const cal=B12.bt2_calib;
k.push(p(`AUC kiểm tra ${f(m2.AUC_test,4)} [KTC 95% bootstrap ${f(m2.AUC_test_CI[0],4)}; ${f(m2.AUC_test_CI[1],4)}], AUC huấn luyện ${f(m2.AUC_train,4)} (không quá khớp). Brier ${f(m2.Brier_test,4)}. McFadden hiệu chỉnh ${f(m2.McFadden_adj,4)}. Hiệu chuẩn tổng hợp: dự báo ${f(cal.expected_wins_test,1)} dòng thắng so với ${cal.actual_wins_test} thực tế (+${f(cal.deviation_pct,2)}%) — lạc quan nhẹ.`));
k.push(img("FIG_4_4_Calibration_ROC.png",576)); k.push(cap("Hình 0.3: Đường cong hiệu chuẩn và ROC ngoài mẫu (Hình 4.4)"));
k.push(YN());
k.push(p(`McFadden R² khoảng 0,16 nghe có vẻ thấp nhưng KHÔNG so được với R² của OLS: McFadden 0,2–0,4 đã được coi là khớp tốt (McFadden, 1974). Hội đồng hay hỏi điểm này. Phụ lục B.1 cũng cho thấy McFadden thô và Nagelkerke tăng khi thêm biến nhiễu, chỉ bản hiệu chỉnh và BIC phản ứng đúng.`));

k.push(h2("III.4. Rò rỉ dữ liệu và phân chia theo cụm"));
k.push(LT());
k.push(p("Rò rỉ dữ liệu (data leakage) xảy ra khi thông tin của tập kiểm tra lọt vào quá trình huấn luyện, làm chỉ số tốt giả tạo. Với dữ liệu phân cụm (nhiều dòng hàng/hồ sơ), chia ngẫu nhiên theo dòng sẽ đưa các dòng của cùng hồ sơ vào cả hai tập — mô hình “nhận ra” hồ sơ chứ không học quy luật. Giải pháp: GroupShuffleSplit — toàn bộ dòng của một hồ sơ nằm trọn một phía."));
k.push(AD());
k.push(p("Ba lớp chống rò rỉ trong luận văn: (1) tách tập kiểm tra theo hồ sơ (80/20); (2) chuẩn hóa Z-score bằng thống kê của tập huấn luyện; (3) TAT_pred là dự báo ngoài lớp từ BT1."));

k.push(h2("III.5. Ablation và chuẩn so sánh XGBoost"));
k.push(AD());
k.push(mkTable(["Nhóm bị loại","AUC còn lại","Thay đổi"],ab.map(r=>[r.loai_nhom,f(r.AUC_test,4),fs_(r.delta_AUC,4)]),[3500,2700,2800]));
k.push(cap("Bảng 0.3: Ablation theo nhóm biến (Bảng 4.8)"));
k.push(p(`Ablation = loại từng nhóm biến và đo AUC giảm bao nhiêu → đóng góp của nhóm. Điểm then chốt: loại toàn bộ biến giá, AUC vẫn ${f(AB("Giá").AUC_test,4)} — yếu tố phi giá tự nó dự báo được kết quả. XGBoost (cây tăng cường gradient) đạt AUC ${f(B12.bt2_xgb.AUC_test,4)}, chỉ hơn logistic ${f((B12.bt2_xgb.AUC_test-m2.AUC_test)*1000,1)} phần nghìn — nằm trong KTC của logistic, nên không có quan hệ phi tuyến lớn bị bỏ sót; logistic được giữ vì diễn giải được và hiệu chuẩn tốt.`));

k.push(h2("III.6. Liên hệ có điều kiện, nội sinh và kiểm tra độ vững"));
k.push(LT());
k.push(p("Hệ số hồi quy trên dữ liệu quan sát là liên hệ có điều kiện (conditional association): “trong số các hồ sơ giống nhau về các biến đã kiểm soát, hồ sơ có hàng đợi sâu hơn có xác suất thắng thấp hơn”. Nó trở thành hiệu ứng nhân quả chỉ khi không còn biến ẩn ảnh hưởng đồng thời đến cả biến độc lập và kết quả. Khi tồn tại biến ẩn như vậy, biến độc lập bị nội sinh (endogeneity) và hệ số bị chệch."));
k.push(AD());
k.push(p(`β_Queue = ${fs_(gQ.beta_z,4)} và β_TAT = ${fs_(gT.beta_z,4)}. Nguồn nội sinh hợp lý: độ phức tạp không quan sát được của hồ sơ có thể vừa làm chờ lâu, vừa làm khó thắng. Kiểm tra độ vững (Mục 4.2.1): trên trạng thái đơn hàng trước bước đối soát cuối kỳ (${f(RB.pct_changed,1)}% số dòng đổi kết quả, tập trung ở hàng đợi sâu), β_Queue = ${fs_(RB.coef_pre.Pricing_Queue_Depth.beta_z,4)} (p = ${f(RB.coef_pre.Pricing_Queue_Depth.p,3)}) và β_TAT = ${fs_(RB.coef_pre.TAT_pred.beta_z,4)} (p = ${f(RB.coef_pre.TAT_pred.p,3)}) — không còn ý nghĩa.`));
k.push(YN());
k.push(p("Đây là điểm yếu số một mà hội đồng có thể khai thác, và cách đứng vững là KHÔNG chối: thừa nhận hai hệ số này là liên hệ có điều kiện, nhạy với cách chốt biến kết quả, rồi chỉ ra luận văn đã thiết kế để không phụ thuộc vào chúng — mặt phẳng chuyển pha quét k từ 0 đến 3, và quy tắc G2 vẫn vượt giả dược ngay cả khi k = 0. Đề xuất thực nghiệm ngẫu nhiên hóa thứ tự xử lý (Hướng 3, Chương 6) để nhận dạng nhân quả."));
k.push(Q("Vì sao chọn logistic chứ không phải mô hình học máy mạnh hơn?",
  `Vì đầu ra của BT2 đi vào bài toán tối ưu: cần (1) hệ số diễn giải được để kiểm tra dấu kinh tế, (2) xác suất hiệu chuẩn tốt, và (3) một hàm trơn theo giá để lấy đạo hàm và giải điều kiện bậc nhất. XGBoost chỉ hơn ${f((B12.bt2_xgb.AUC_test-m2.AUC_test)*1000,1)} phần nghìn AUC nên không đáng đánh đổi.`));
k.push(Q("AUC 0,78 có đủ tốt không?",
  "Đủ cho mục đích: theo thang thường dùng (Hosmer, Lemeshow & Sturdivant, 2013), 0,7–0,8 là phân biệt chấp nhận được, 0,8–0,9 là tốt. Quan trọng hơn với BT3 là hiệu chuẩn — sai lệch tổng hợp chỉ khoảng 3%. Ngoài ra AUC đo trên tập tách theo hồ sơ, tức ước lượng thận trọng."));
k.push(Q("Hàng đợi làm giảm xác suất thắng — anh có chắc đó là nhân quả không?",
  "Không, và luận văn không khẳng định. Đó là liên hệ có điều kiện trên dữ liệu quan sát; có thể có nội sinh từ độ phức tạp ẩn, và kết quả nhạy với cách chốt trạng thái đơn hàng. Vì vậy mô phỏng quét hệ số nhân k, kể cả k = 0, và đề xuất thực nghiệm ngẫu nhiên hóa thứ tự xử lý để nhận dạng hiệu ứng thật."));
k.push(Q("Loại bỏ theo danh sách đầy đủ có gây chệch không?",
  `Kiểm tra cho thấy tỷ lệ thắng sau khi loại (${pct(B12.bt2_n.win_rate,2)}) gần như bằng toàn bộ (${pct(S1.gia_tri.ty_le_thang_mat_hang,2)}); tỷ lệ khuyết dưới 5% và chỉ ở biến độc lập. Gán khuyết bằng mô hình sẽ thêm một tầng bất định vào chính biến giá — biến quan trọng nhất.`));

/* ═════════ PHẦN IV ═════════ */
k.push(h1("PHẦN IV. BÀI TOÁN 3 — TỐI ƯU GIÁ, LÝ THUYẾT ĐẤU GIÁ VÀ GIÁ BÓNG"));
k.push(h2("IV.1. Khung Friedman: tối đa hóa lợi nhuận kỳ vọng"));
k.push(LT());
k.push(fx(["E[π(p)] = (p − c) · P(Win | p, x)        p* = argmax_p E[π(p)]"]));
k.push(p("Đánh đổi cốt lõi: tăng giá làm tăng biên (p − c) nhưng giảm xác suất thắng. Friedman (1956) là nền móng; giới hạn của nó là coi hành vi đối thủ cố định (ngoại sinh) — đối thủ không phản ứng với chính sách mới của ta. Đây là tối ưu một phía (best-response), không phải cân bằng."));
k.push(h2("IV.2. Dẫn xuất điều kiện bậc nhất (FOC) — nên tự làm lại được trên bảng"));
k.push(LT());
k.push(fx(["Từ BT2:  η(p) = α + γ·(T/p) + x'δ ,   P = 1/(1 + e^(−η)) ,   γ = β_PC / sd_PC > 0",
  "Bước 1:  ∂η/∂p = −γT/p²     ⇒   ∂P/∂p = P(1−P)·(−γT/p²) < 0",
  "Bước 2:  ∂E[π]/∂p = P + (p − c)·∂P/∂p = P − (p − c)·P(1−P)·γT/p²",
  "Bước 3:  đặt = 0 và chia cho P > 0  ⇒   γ·T·(p − c)·(1 − P(p)) = p²",
  "p xuất hiện cả hai vế và bên trong P(p) ⇒ không có nghiệm dạng đóng ⇒ giải số (dò lưới + Brent)"]));
k.push(AD());
k.push(p(`Hai cách giải độc lập (dò lưới 60.001 điểm và thuật toán Brent trên FOC) cho sai lệch tối đa ${f(Math.max(...FOC.kiem_chung.map(r=>r.lech)),4)} USD trên 6 dòng hàng (Bảng 4.10). Đạo hàm bậc hai đổi dấu (từ ${f(FOC.phi_tuyen.max_d2,4)} xuống ${f(FOC.phi_tuyen.min_d2,4)}): hàm lồi ở giá thấp, lõm quanh cực đại → cực đại nội suy duy nhất.`));
k.push(YN());
k.push(p("Trả lời câu hỏi “hàm mục tiêu tuyến tính hay phi tuyến?”: phi tuyến, vì là tích của một hàm tuyến tính và một hàm logistic của nghịch đảo giá. Nếu tuyến tính thì không có cực đại nội suy."));
k.push(h2("IV.3. Dải kẹp [P5; P95] và CBPO Realistic"));
k.push(AD());
const dm=B3.dai_markup;
k.push(p(`Markup đề xuất được kẹp trong dải lịch sử [${f(dm.P5,4)}; ${f(dm.P95,4)}]. Lý do: mô hình logistic chỉ được học trong vùng giá đã quan sát; ra ngoài vùng đó là ngoại suy, không đáng tin. CBPO Realistic: ${fp(cb.uplift_pct,2)}, xác suất thắng ${f(POL["Thực tế (thực nhận)"].Pwin,3)} → ${f(cb.Pwin,3)}; ${pct(cb.clip,1)} dòng có nghiệm tự do nằm ngoài dải (bị kẹp). Bản không kẹp: ${fp(POL["CBPO Optimistic (không kẹp)"].uplift_pct,2)} — không dùng làm khuyến nghị.`));
k.push(YN());
k.push(p(`Hai mốc so sánh phải nói được: (1) Cost-Plus chỉ chênh ${fp(POL["Cost-Plus (markup trung vị)"].uplift_pct,2)} so với thực tế — chính sách hiện hành thực chất là cost-plus; (2) tại giá lịch sử, mô hình dự báo lợi nhuận cao hơn thực nhận ${fp(B3.hieu_chuan_tong_hop.lech_pct,2)} — mọi uplift có độ lạc quan nhẹ tương tự.`));

k.push(h2("IV.4. Lý thuyết đấu giá: giá trị riêng độc lập và cân bằng Bayesian Nash"));
k.push(LT());
k.push(p("Đấu thầu ngược (reverse auction): người mua chọn giá thấp nhất. Mô hình giá trị riêng độc lập (IPV): mỗi nhà thầu biết chi phí của mình cᵢ, chỉ biết phân phối F của chi phí đối thủ. Cân bằng Nash (Nash, 1950): không ai lợi khi đơn phương đổi chiến lược. Bayesian Nash (Harsanyi, 1967): mở rộng cho thông tin không đầy đủ — mỗi bên tối ưu kỳ vọng theo niềm tin về loại (chi phí) của đối thủ."));
k.push(fx(["Chiến lược cân bằng đối xứng (Krishna, 2009):",
  "  β*(c) = c + ∫_c^c̄ [ (1 − F(x)) / (1 − F(c)) ]^(N−1) dx  = E[ chi phí thấp nhất của N−1 đối thủ | tất cả > c ]",
  "Trường hợp đều trên [c_min , c̄]:  (1−F(x))/(1−F(c)) = (c̄ − x)/(c̄ − c)",
  "  ⇒ ∫ = (c̄ − c)/N   ⇒   β*(c) = c + (c̄ − c)/N",
  "Hai hệ quả: biên giá ∝ 1/N (độ co giãn log–log = −1) và xác suất thắng đối xứng = 1/N"]));
k.push(p("Trực giác: nhà thầu cộng vào chi phí một khoản bằng khoảng cách kỳ vọng tới đối thủ mạnh nhất; càng nhiều đối thủ, khoảng cách càng nhỏ. Đây là “bóng mờ giá” (bid shading) theo cạnh tranh."));
k.push(h2("IV.5. Ba đặc tả miền chi phí A, B, C"));
k.push(AD());
const nA=POL["Nash A — miền tuyệt đối (kẹp)"], nB=POL["Nash B — miền tỷ lệ (kẹp)"], nC=POL["Nash C — cận dòng hàng, N thực tế (kẹp)"], nCf=POL["Nash C — dạng đóng thuần (không kẹp)"], nCh=POL["Nash C + phản hồi logistic (±5% quanh neo)"], NC=B3.nashC;
k.push(mkTable(["Đặc tả","Cận trên c̄","N","Kẹp","Uplift","Bản chất"],
  [["A","P99 giá vốn trong nhóm vật liệu","Hiệu chỉnh lai",pct(nA.clip,0),fp(nA.uplift_pct,1),"Cận chung quá xa cho hàng giá vốn thấp → kẹp trần"],
   ["B",`c(1+δ), δ = ${f(B3.delta_B,3)}`,"Hiệu chỉnh lai",pct(nB.clip,0),fp(nB.uplift_pct,1),"Biên δ/N quá nhỏ → kẹp sàn"],
   ["C","Market_Reserve_Bound (cận dự trữ dòng hàng)","Thực tế từ CRM",pct(nC.clip,0),fp(nC.uplift_pct,1),`Tỷ lệ với δ_C ≈ ${f(NC.delta_C_median,2)} → nội suy ở N ≥ 3`]],
  [700,2400,1300,900,1000,2700]));
k.push(cap("Bảng 0.4: Ba đặc tả cân bằng (rút gọn từ Bảng 4.13 và 5.4)"));
k.push(YN());
k.push(p(`Bài học: thất bại của A, B không do số đối thủ (thay bằng N thực tế, A vẫn kẹp ${pct(B3.nashAB_EffN.A.clip,0)}, B ${pct(B3.nashAB_EffN.B.clip,0)}) mà do cận trên đo chi phí đối thủ, trong khi giá thực đạt được phản ánh mức sẵn lòng trả của khách hàng có tính lợi thế phi giá. C dùng cận từ phía cầu nên phục hồi. Nhưng phải nói đúng mức: C về cấu trúc là đặc tả tỷ lệ với δ lớn hơn B khoảng ${f(NC.delta_C_median/B3.delta_B,1)} lần; ở N = 2 vẫn kẹp ${pct(NC.clip_by_N["2"],0)}; và vẫn thấp hơn CBPO (dạng đóng thuần ${fp(nCf.uplift_pct,2)}, lai ${fp(nCh.uplift_pct,2)}).`));
k.push(note("Tỷ lệ kẹp biên — chỉ báo chẩn đoán rẻ và mạnh",[
  "Nếu đa số khuyến nghị bị kẹp vào biên, đầu ra do ràng buộc kỹ thuật quyết định, không do công thức.",
  "Uplift khi đó chỉ là hiệu ứng “nâng giá đồng loạt về trần” — phải kiểm bằng giả dược.",
  "Đây là bước 3 của “Cổng ba bước” (Bảng 6.1)."]));

k.push(h2("IV.6. Kiểm định H1 hai mặt và sai số chuẩn cụm"));
k.push(LT());
k.push(fx(["ln(biên giá) = a + b·ln N + u ;  H0(BNE): b = −1 ;  H0(cost-plus): b = 0",
  "Sai số chuẩn cụm: V = (X'X)⁻¹ [Σ_g X_g' u_g u_g' X_g] (X'X)⁻¹ — cho phép sai số tương quan trong cùng hồ sơ"]));
const H=B3.H1_test, HE=B3.H1_EffN;
k.push(AD());
k.push(p(`(1) Lịch sử: b = ${fs_(HE.lich_su_lnMarkup.slope,4)} (p = ${f(HE.lich_su_lnMarkup.p_vs_0,3)}) — không khác 0, bác bỏ −1 → cost-plus. (2a) Giá tối ưu FOC: b = ${fs_(HE.FOC_lnMargin.slope,3)} — bác bỏ cả 0 lẫn −1 → mô hình phản ứng đúng chiều nhưng chỉ ~${f(Math.abs(HE.FOC_lnMargin.slope)*100,0)}% độ lớn lý thuyết. (2b) Đặc tả C: b = ${fs_(HE.NashC_lnMargin.slope,3)} — gần −1 THEO ĐỊNH NGHĨA vì ln(p*/c − 1) = ln δ − ln N.`));
k.push(YN());
k.push(p("Điều hội đồng đánh giá cao: anh tự chỉ ra dòng (2b) là đồng nhất thức, không phải bằng chứng. Nếu ai đó lấy giá do công thức 1/N sinh ra rồi hồi quy theo N, đương nhiên ra −1 — đó là lập luận vòng tròn. Sai số chuẩn cụm cần thiết vì 7.519 dòng hàng nằm trong 1.475 hồ sơ, sai số trong cùng hồ sơ tương quan; bỏ qua sẽ làm SE quá nhỏ."));
k.push(img("FIG_4_6_H1_Placebo.png",576)); k.push(cap("Hình 0.4: H1 hai mặt (A) và giả dược tĩnh (B) — Hình 4.6"));

k.push(h2("IV.7. Quản trị doanh thu: giá bóng và bid-price control"));
k.push(LT());
k.push(p("Giá bóng (shadow price) của một tài nguyên = giá trị cận biên của thêm một đơn vị tài nguyên đó — trong quy hoạch tuyến tính chính là biến đối ngẫu (Lagrange multiplier). Gallego & van Ryzin (1994): giá tối ưu trong định giá động bằng chi phí biên cộng giá trị cận biên của năng lực còn lại. Talluri & van Ryzin (2004): bid-price control — chấp nhận một yêu cầu khi giá trị của nó ≥ tổng giá bóng của các tài nguyên nó tiêu thụ. Lưu ý: bid-price là quy tắc TIẾP NHẬN, không phải quy tắc giá."));
k.push(fx(["Bước 1:  P_breach(Q) = 1/(1 + e^(−(α₀ + α₁Q)))   — logit xác suất vi phạm theo độ sâu hàng đợi",
  "Bước 2:  Δ(Q) = (Q+1)·P_breach(Q+1) − Q·P_breach(Q)   — số vi phạm kỳ vọng tăng thêm khi nhận thêm 1 hồ sơ",
  "Bước 3:  λ(Q) = π_SLA · Δ(Q);   bản trọng số: λ_U(Q) = U · λ(Q)"]));
const la=B3.lambda, lb=B3.logit_breach;
k.push(AD());
k.push(p(`α₀ = ${f(lb.a0,3)}, α₁ = ${f(lb.a1,4)}; π_SLA = 0,5 × biên ${f(la.margin_item,2)} USD. λ mỗi dòng hàng: ${f(la.lam_item_Q["0"],2)} (Q=0) → ${f(la.lam_item_Q["30"],2)} USD (Q=30), trung bình ${f(la.lam_item_mean_test,2)} USD ≈ ${f(la.lam_item_mean_test/la.margin_item*100,1)}% biên. Δ(Q) là ngoại tác tắc nghẽn: nhận thêm hồ sơ làm tăng xác suất trễ của chính nó và của những hồ sơ đang chờ.`));
k.push(h2("IV.8. Kiểm chứng giả dược — trái tim phương pháp luận"));
k.push(LT());
k.push(p("Một chính sách phức tạp tốt hơn hiện trạng có thể vì cơ chế của nó, hoặc chỉ vì nó nâng mặt bằng giá. Giả dược (placebo) thay thành phần phụ thuộc trạng thái (λ(Q)) bằng hằng số có cùng trung bình (λ̄), giữ nguyên mọi thứ khác. Chênh lệch giữa hai nhánh = đóng góp riêng của cơ chế điều tiết. Đây là logic của nhóm đối chứng trong y học áp dụng vào đánh giá chính sách."));
const pl=B3.placebo;
k.push(AD());
k.push(p(`CBPO + λ(Q): ${fp(pl.cap_uplift,2)} — nhìn qua tưởng hơn CBPO ${f(pl.cap_uplift-cb.uplift_pct,2)} điểm. Giả dược λ̄: ${fp(pl.placebo_uplift,2)}. Chênh lệch ${fs_(pl.dong_gop_dieu_tiet_pp,2)} điểm (bản λ·U: ${fs_(pl.dong_gop_dieu_tiet_U_pp,2)}). Toàn bộ “lợi ích” là nâng giá đồng loạt.`));
k.push(YN());
k.push(p(`Không có giả dược, luận văn sẽ kết luận sai rằng thành phần năng lực tạo thêm lợi nhuận. Thêm nữa: trong đánh giá tĩnh, tỷ lệ vi phạm trên tập kiểm tra là ${pct(B3.static_breach.breach_rate_test,2)} dưới MỌI chính sách giá — vì giá quyết định SAU khi việc đã phát sinh. Đó là lý do cần mô phỏng liên kỳ.`));
k.push(Q("Tại sao kết quả dương duy nhất bền vững là CBPO?",
  `Vì CBPO không phụ thuộc tham số không nhận dạng được (N, họ phân phối F, cận chi phí, π_SLA). Đặc tả A đổi dấu khi N tầng thấp vượt khoảng ${f(B3.sensitivity.N_scale.find(r=>r.uplift<0).N_low-0.5,1)} hoặc đổi họ phân phối; đặc tả C đổi dấu khi N tăng 50%; chính sách có λ luôn bám giả dược. CBPO giữ ${fp(cb.uplift_pct,2)} qua mọi kịch bản (Bảng 4.15).`));
k.push(Q("Không quan sát được giá đối thủ, sao biết N?",
  "Không biết chính xác — đó là lý do luận văn hiệu chỉnh bằng bốn phương pháp và cho thấy chúng phân tán mạnh (N không được nhận dạng từ dữ liệu), rồi bổ sung N thực tế ghi trên CRM. Mọi kết luận phụ thuộc N đều có phân tích độ nhạy. Ước lượng cấu trúc (Guerre, Perrigne & Vuong, 2000) cần giá chào của tất cả bên — không có trong dữ liệu."));
k.push(Q("Vì sao không dùng đấu giá chấm điểm (Che, 1993)?",
  "Về lý thuyết đó là khung đúng cho cạnh tranh đa chiều, nhưng cần hàm điểm của khách hàng — không quan sát được trong ERP; ước lượng nó là một đề tài riêng. Luận văn đã khai báo loại trừ từ Mục 2.2.5 và đưa vào Hướng 1 của Chương 6. Đặc tả C có thể xem là một bước gần tinh thần đó, vì cận trên đến từ phía cầu."));
k.push(Q("Tỷ lệ thắng 75% ở tầng cạnh tranh thấp nói lên điều gì?",
  "Trong cân bằng đối xứng, xác suất thắng là 1/N — tối đa 50% với N = 2. Tỷ lệ thắng quan sát vượt hẳn giới hạn đó, nên thị trường không đối xứng thuần giá: doanh nghiệp có lợi thế phi giá. Đây là bước 1 của Cổng ba bước."));
return k;
};
