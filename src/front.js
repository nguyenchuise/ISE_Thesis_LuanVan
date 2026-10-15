// PHAN DAU — bia, cam doan, tom tat, muc luc, viet tat, danh sach hinh/bang (goi SAU khi cac chuong da chay)
module.exports=function(L){
const {C,run,p,h1n,center,mkTable,pb,REG,Paragraph,TableOfContents,AlignmentType,HeadingLevel}=L;
const fs=require("fs"); const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const B1=J("bt1_pertask.json"),B12=J("ch4_bt12.json"),B3=J("ch4_bt3.json"),SIM=J("ch4_sim.json"),S1=J("ch1_stats.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−"); const fp=(x,d=2)=>(x>=0?"+":"")+f(x,d)+"%"; const pct=(x,d=1)=>f(x*100,d)+"%";
const P=B3.policies,cb=P["CBPO Realistic (kẹp P5–P95)"],pl=B3.placebo,H=B3.H1_test,m2=B12.bt2_metrics,ab=B12.bt2_ablation;
const nA=P["Nash A — miền tuyệt đối (kẹp)"],nB=P["Nash B — miền tỷ lệ (kẹp)"],nC=P["Nash C — cận dòng hàng, N thực tế (kẹp)"],nCh=P["Nash C + phản hồi logistic (±5% quanh neo)"];
const HE=B3.H1_EffN, g=b=>B12.bt2_coef.find(r=>r.bien===b), POL=SIM.meta.policies, M1=SIM.main.C1["1.0"], M2=SIM.main.C2["1.0"];
const fs_=(x,d=2)=>(x>=0?"+":"")+f(x,d); const e=(x,d=2)=>(x>=0?"+":"")+Number(x).toFixed(d);
const PC=S1.phan_ung_canh_tranh, gapW=(PC.Low.win-PC.High.win)*100;
const HEAD=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{after:240},children:[run(t,{size:30,bold:true,color:C.RED})]});
const k=[];

/* BIA */
k.push(center("ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH",{bold:true}),center("TRƯỜNG ĐẠI HỌC BÁCH KHOA",{bold:true}),
  center("KHOA CƠ KHÍ — BỘ MÔN KỸ THUẬT HỆ THỐNG CÔNG NGHIỆP",{bold:true,after:600}),center("─────────────────────────────",{color:C.MUTE,after:600}),
  center("LUẬN VĂN THẠC SĨ",{bold:true,size:30,after:400}),
  center("ỨNG DỤNG KHAI PHÁ DỮ LIỆU TRONG DỰ BÁO THỜI GIAN XỬ LÝ VÀ TỐI ƯU HÓA GIÁ BÁO THẦU TẠI DOANH NGHIỆP PHÂN PHỐI VẬT TƯ CÔNG NGHIỆP B2B",{bold:true,size:30,color:C.RED,after:240}),
  center("Application of Data Mining to Turnaround-Time Prediction and Competitive Bid Price Optimisation in B2B Industrial Distribution",{size:24,color:C.BODY,after:700}),
  center("─────────────────────────────",{color:C.MUTE,after:700}),
  center("Chuyên ngành: Kỹ thuật Hệ thống Công nghiệp",{after:120}),center("Giảng viên hướng dẫn: TS. Nguyễn Vạng Phúc Nguyên",{after:120}),
  center("Học viên thực hiện: Chu Thái Nguyên — MSSV: 2470590",{after:900}),center("Tp. Hồ Chí Minh, tháng 10 năm 2026",{size:24,color:C.BODY}),pb());

/* CAM DOAN */
k.push(HEAD("LỜI CAM ĐOAN"));
k.push(p("Tôi cam đoan luận văn này là công trình nghiên cứu độc lập của tôi dưới sự hướng dẫn của TS. Nguyễn Vạng Phúc Nguyên. Toàn bộ số liệu được trích xuất từ cơ sở dữ liệu ERP của doanh nghiệp nghiên cứu, liên kết với phân hệ CRM và Sourcing, đã qua xử lý bảo mật theo yêu cầu của doanh nghiệp, và mọi kết quả phân tích được tái lập bằng mã nguồn đính kèm. Các kết quả ở Mục 4.4 là kết quả mô phỏng và được ghi rõ như vậy."));
k.push(p("Tôi cam đoan đã báo cáo đầy đủ cả những kết quả không ủng hộ giả thuyết nghiên cứu ban đầu, cùng các hạn chế của phương pháp và dữ liệu. Mọi tham khảo từ công trình của tác giả khác đều được trích dẫn đầy đủ."));
k.push(p("Tp. Hồ Chí Minh, tháng 10 năm 2026",{align:AlignmentType.RIGHT}),p("Chu Thái Nguyên",{align:AlignmentType.RIGHT,bold:true}),pb());

/* TOM TAT */
k.push(HEAD("TÓM TẮT"));
k.push(p(`Luận văn nghiên cứu quy trình báo giá tại một doanh nghiệp phân phối vật tư liên kết và MRO công nghiệp theo mô hình B2B, trên dữ liệu ERP gồm 1.500 hồ sơ báo giá với 8.249 dòng hàng thuộc 220 khách hàng trong kỳ 299 ngày, có liên kết với phân hệ CRM và Sourcing; tỷ lệ thắng cấp dòng hàng là ${pct(S1.gia_tri.ty_le_thang_mat_hang,2)}. Bối cảnh có hai bất thường: ${pct(S1.sla.ty_le_vi_pham,2)} hồ sơ vi phạm cam kết phản hồi bảy ngày với nút thắt ở khâu định giá, và hệ số markup gần như bất động (biên độ ${f(S1.bien_do_markup_giua_3_muc*100,2)} điểm phần trăm) trong khi tỷ lệ thắng biến thiên ${f(gapW,1)} điểm phần trăm theo cường độ cạnh tranh. Ba bài toán được đặt ra theo thứ tự phụ thuộc — dự báo thời gian xử lý theo khâu, dự báo xác suất thắng, tối ưu giá báo thầu — và được bổ sung một nghiên cứu mô phỏng liên kỳ có kiểm soát.`));
k.push(p(`Bài toán thứ nhất: ba kiểm định đồng nhất phương sai cùng bác bỏ giả thuyết bốn khâu biến động như nhau; Sales tách biệt với hệ số biến thiên ${f(B1.eda[0].CV,3)}; ${f(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"],1)}% phương sai thời gian tổng là hiệp phương sai giữa các khâu. Quy trình chẩn đoán giả định bác bỏ biến đổi logarit và chọn thang đo gốc kèm sai số vững HC3; thời gian dự báo ngoài lớp được chuyển sang bài toán thứ hai.`));
k.push(p(`Bài toán thứ hai: hồi quy logistic trên sáu nhóm biến đạt AUC ngoài mẫu ${f(m2.AUC_test,3)} [${f(m2.AUC_test_CI[0],3)}; ${f(m2.AUC_test_CI[1],3)}] khi tách theo cụm dự án. Ngoài giá (β = ${fs_(g("Price_Competitiveness").beta_z,3)}) và năng lực nhà cung cấp, cường độ cạnh tranh (${fs_(g("CompInt").beta_z,3)}), độ sâu hàng đợi (${fs_(g("Pricing_Queue_Depth").beta_z,3)}) và thời gian xử lý dự báo (${fs_(g("TAT_pred").beta_z,3)}) đều âm, có ý nghĩa ở mức 1% — là liên hệ có điều kiện trên dữ liệu quan sát, chưa phải hiệu ứng nhân quả đã nhận dạng.`));
k.push(p(`Bài toán thứ ba: giả thuyết cân bằng H1 bị bác bỏ — giá lịch sử là cost-plus tĩnh (độ dốc ${fs_(HE.lich_su_lnMarkup.slope,4)}), giá tối ưu từ mô hình phản ứng với số đối thủ theo độ co giãn ${fs_(HE.FOC_lnMargin.slope,2)} thay vì −1. Hai đặc tả cân bằng thuần giá A, B suy biến (kẹp ${pct(nA.clip,0)} và ${pct(nB.clip,0)}), trong khi đặc tả C dùng cận dự trữ cấp dòng hàng và số đối thủ thực tế phục hồi tính nội suy (kẹp ${pct(nC.clip,0)}, uplift ${fp(nC.uplift_pct,2)}), nhưng vẫn thấp hơn khung tối ưu theo xác suất thắng đã hiệu chuẩn (uplift ${fp(cb.uplift_pct,2)}). Giá bóng năng lực dùng làm tín hiệu giá không vượt giả dược trên dữ liệu tĩnh (${fs_(pl.dong_gop_dieu_tiet_pp,2)} điểm). Mô phỏng liên kỳ trên 1.500 hồ sơ thực cho thấy khi cùng giá bóng đó được dùng làm tiêu chí phân luồng tại pha Sales-WBS, cơ chế đồng bộ vượt giả dược ${fs_(M1.compare.P4_vs_P3.mean_pp,2)} đến ${fs_(M2.compare.P4_vs_P3.mean_pp,2)} điểm phần trăm lợi nhuận ròng sau chi phí cam kết và giảm vi phạm xuống ${pct(M1.policies[POL[3]].breach,1)} – ${pct(M2.policies[POL[3]].breach,1)}; toàn bộ giá trị đến từ phân luồng.`));
k.push(p("Kết quả được biện luận theo ba trụ cột: sự phục hồi của cân bằng khi nội sinh hóa lợi thế phi giá; sự hội tụ của ba bài toán và mô phỏng về vai trò của giá bóng như quy tắc điều phối tiếp nhận; và tính dị chất của danh mục B2B cùng kỷ luật kiểm chứng giả dược và thiết kế phân cụm. Đóng góp ứng dụng gồm cổng ba bước kiểm tra và hiệu chỉnh mô hình cân bằng, khung định giá xác suất thắng hiệu chuẩn có neo cân bằng, bộ lọc phân luồng theo giá bóng tại pha Sales-WBS, và thiết kế thực nghiệm A/B ba nhánh."));
k.push(p([run("Từ khóa: ",{bold:true}),run("Khai phá dữ liệu, Dự báo thời gian xử lý, Hồi quy logistic, Xác suất thắng thầu, Cân bằng Bayesian Nash, Giá bóng năng lực, Bid-price control, Mô phỏng hàng đợi, Kiểm chứng giả dược, Phân phối vật tư công nghiệp B2B.",{})]));
k.push(pb());

/* ABSTRACT */
k.push(HEAD("ABSTRACT"));
k.push(p(`This thesis studies the request-for-quotation process of a B2B industrial fastener and MRO distributor using ERP data linked to CRM and Sourcing modules (1,500 quotations, 8,249 line items, 220 customers, 299 days). Stage-level analysis rejects homogeneous variation across four stages; ${Number(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"]).toFixed(1)}% of total-TAT variance is inter-stage covariance, and residual diagnostics favour raw-scale OLS with HC3 errors over a log transform. A logistic win model reaches out-of-sample AUC ${Number(m2.AUC_test).toFixed(3)}; competition (${e(g("CompInt").beta_z,3)}), Pricing queue depth (${e(g("Pricing_Queue_Depth").beta_z,3)}) and predicted turnaround time (${e(g("TAT_pred").beta_z,3)}) are negative and significant at 1%; these are conditional associations in observational data, not identified causal effects. The equilibrium hypothesis is rejected: historical markups are static cost-plus (slope ${e(HE.lich_su_lnMarkup.slope,4)}) and model-optimal prices respond to N with elasticity ${e(HE.FOC_lnMargin.slope,2)} rather than −1. Pure-price Bayesian Nash specifications A and B degenerate (${(nA.clip*100).toFixed(0)}% and ${(nB.clip*100).toFixed(0)}% clipped), whereas specification C, built on an item-level reserve bound and actual competitor counts, restores interior solutions (${(nC.clip*100).toFixed(0)}% clipped, ${e(nC.uplift_pct,2)}% uplift) yet remains below calibrated win-probability pricing (${e(cb.uplift_pct,2)}%). A capacity shadow price used as a price signal does not beat a constant-markup placebo on static data. A controlled multi-period queueing simulation anchored on the 1,500 real quotations shows that the same shadow price, used for priority gating at the Sales-WBS stage, beats the placebo by ${e(M1.compare.P4_vs_P3.mean_pp,2)} to ${e(M2.compare.P4_vs_P3.mean_pp,2)} percentage points of SLA-adjusted net profit and lowers SLA breaches to ${(M1.policies[POL[3]].breach*100).toFixed(1)}–${(M2.policies[POL[3]].breach*100).toFixed(1)}%; all value comes from gating, none from the price term. Bid price is the lever for margin; admission sequencing is the lever for capacity.`));
k.push(pb());

/* MUC LUC */
k.push(HEAD("MỤC LỤC"),new TableOfContents("Mục lục",{hyperlink:true,headingStyleRange:"1-3"}),
  new Paragraph({alignment:AlignmentType.CENTER,children:[run("(Nhấn chuột phải vào mục lục → Update Field trong Word để cập nhật số trang)",{size:20,italic:true,color:C.MUTE})]}),pb());

/* VIET TAT */
k.push(HEAD("DANH MỤC TỪ VIẾT TẮT VÀ KÝ HIỆU"));
k.push(mkTable(["Ký hiệu","Tiếng Anh","Nghĩa trong luận văn"],
 [["A. NGHIỆP VỤ","",""],["B2B","Business-to-Business","Quan hệ thương mại giữa doanh nghiệp với doanh nghiệp"],
  ["RFQ","Request for Quotation","Yêu cầu báo giá — đơn vị phân tích cấp hồ sơ"],["SLA","Service Level Agreement","Cam kết mức dịch vụ; ở đây là 7 ngày"],
  ["TAT","Turnaround Time","Thời gian từ tiếp nhận đến gửi báo giá"],["MRO","Maintenance, Repair and Operations","Vật tư bảo trì, sửa chữa, vận hành"],
  ["WBS","Work Breakdown Structure","Khâu phân rã cấu trúc công việc"],["ERP","Enterprise Resource Planning","Hệ thống hoạch định nguồn lực doanh nghiệp"],
  ["PFEP","Plan for Every Part","Avg_PFEP là biến đại diện chi phí biên, ký hiệu c"],["ATP","Available-to-Promise","Tồn kho cam kết giao được"],
  ["PPAP","Production Part Approval Process","Chứng nhận phê duyệt mặt hàng sản xuất"],
  ["B. THỐNG KÊ VÀ HỌC MÁY","",""],["OLS","Ordinary Least Squares","Bình phương nhỏ nhất thông thường"],
  ["HC3","Heteroskedasticity-Consistent (type 3)","Sai số chuẩn vững với phương sai thay đổi"],["BP","Breusch–Pagan","Kiểm định phương sai sai số không đổi"],
  ["JB","Jarque–Bera","Kiểm định tính chuẩn"],["CV","Coefficient of Variation","Hệ số biến thiên = SD / Mean"],
  ["VIF","Variance Inflation Factor","Hệ số phóng đại phương sai"],["AIC / BIC","Akaike / Bayesian Information Criterion","Tiêu chí thông tin"],
  ["AUC","Area Under the ROC Curve","Diện tích dưới đường cong ROC"],["OR","Odds Ratio","Tỷ số chênh"],["OOF","Out-of-Fold","Dự báo ngoài lớp trong kiểm chứng chéo"],
  ["ICC / DEFF","Intra-class Correlation / Design Effect","Tương quan nội cụm / hiệu ứng thiết kế"],["MDE","Minimum Detectable Effect","Hiệu ứng tối thiểu phát hiện được"],
  ["C. ĐỊNH GIÁ VÀ VẬN TRÙ","",""],["CBPO","Competitive Bidding Price Optimisation","Khung tối ưu giá theo xác suất thắng (Friedman, 1956)"],
  ["BNE","Bayesian Nash Equilibrium","Cân bằng Bayesian Nash"],["FOC","First-Order Condition","Điều kiện bậc nhất"],
  ["P(Win | p, x)","—","Xác suất thắng tại giá p với đặc trưng x — ước lượng thực nghiệm dạng rút gọn, không phải hậu nghiệm Bayes"],
  ["β*(c)","—","Chiến lược cân bằng theo chi phí c"],["N","—","Số đối thủ hiệu dụng — tham số hiệu chỉnh"],
  ["λ(Q)","—","Giá bóng của năng lực xử lý tại độ sâu hàng đợi Q"],["π_SLA","—","Chi phí một lần vi phạm cam kết thời gian"],
  ["c, p, T, r","—","Giá vốn, giá chào, giá mục tiêu, r = T/p (chỉ số cạnh tranh giá)"],
  ["c̄_i / MRB","Market Reserve Bound","Cận trên giá dự trữ cấp dòng hàng — dùng trong đặc tả Nash C"],
  ["U","Urgency_SLA_Sensitivity","Hệ số nhạy cảm cam kết thời gian của hồ sơ"],["λ_U(Q)","—","Giá bóng có trọng số nhạy cảm cam kết = U · λ(Q)"],
  ["ATC","Apparent Tardiness Cost","Quy tắc ưu tiên chi phí trễ (Vepsalainen & Morton, 1987)"],["G1 / G2","—","Hai quy tắc phân luồng trong mô phỏng: ngưỡng giá bóng / chỉ số ưu tiên chi phí trễ"],
  ["C1 / C2","—","Hai kịch bản hiệu chỉnh hàng đợi: chờ tại Pricing / tải toàn chuỗi"]],
 [1700,3200,4100],[0,11,24]));
k.push(pb());

/* DANH SACH HINH / BANG */
k.push(HEAD("DANH SÁCH HÌNH"));
k.push(mkTable(["Hình","Tên hình"],REG.figs.map(x=>[`Hình ${x.id}`,x.text]),[1400,7600],null,true),pb());
k.push(HEAD("DANH SÁCH BẢNG"));
k.push(mkTable(["Bảng","Tên bảng"],REG.tabs.map(x=>[`Bảng ${x.id}`,x.text]),[1400,7600],null,true));
return k;
};
