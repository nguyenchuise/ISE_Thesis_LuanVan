// PHAN DAU — bia, cam doan, tom tat, muc luc, viet tat, danh sach hinh/bang (goi SAU khi cac chuong da chay)
module.exports=function(L){
const {C,run,p,h1n,center,mkTable,pb,REG,Paragraph,TableOfContents,AlignmentType,HeadingLevel}=L;
const fs=require("fs"); const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const B1=J("bt1_pertask.json"),B12=J("ch4_bt12.json"),B3=J("ch4_bt3.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−"); const fp=(x,d=2)=>(x>=0?"+":"")+f(x,d)+"%"; const pct=(x,d=1)=>f(x*100,d)+"%";
const P=B3.policies,cb=P["CBPO Realistic (kẹp P5–P95)"],pl=B3.placebo,H=B3.H1_test,m2=B12.bt2_metrics,ab=B12.bt2_ablation;
const nA=P["Nash A — miền tuyệt đối (kẹp)"],nB=P["Nash B — miền tỷ lệ (kẹp)"];
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
  center("Học viên thực hiện: Chu Thái Nguyên — MSSV: 2470590",{after:900}),center("Tp. Hồ Chí Minh, tháng 9 năm 2026",{size:24,color:C.BODY}),pb());

/* CAM DOAN */
k.push(HEAD("LỜI CAM ĐOAN"));
k.push(p("Tôi cam đoan luận văn này là công trình nghiên cứu độc lập của tôi dưới sự hướng dẫn của TS. Nguyễn Vạng Phúc Nguyên. Toàn bộ số liệu được trích xuất từ cơ sở dữ liệu ERP của doanh nghiệp nghiên cứu, đã qua xử lý bảo mật theo yêu cầu của doanh nghiệp, và mọi kết quả phân tích được tái lập bằng mã nguồn đính kèm."));
k.push(p("Tôi cam đoan đã báo cáo đầy đủ cả những kết quả không ủng hộ giả thuyết nghiên cứu ban đầu, cùng các hạn chế của phương pháp và dữ liệu. Mọi tham khảo từ công trình của tác giả khác đều được trích dẫn đầy đủ."));
k.push(p("Tp. Hồ Chí Minh, tháng 9 năm 2026",{align:AlignmentType.RIGHT}),p("Chu Thái Nguyên",{align:AlignmentType.RIGHT,bold:true}),pb());

/* TOM TAT */
k.push(HEAD("TÓM TẮT"));
k.push(p("Luận văn nghiên cứu quy trình báo giá tại một doanh nghiệp phân phối vật tư liên kết và MRO công nghiệp theo mô hình B2B, trên dữ liệu ERP gồm 1.500 hồ sơ báo giá với 8.249 dòng hàng thuộc 220 khách hàng trong kỳ 299 ngày. Bối cảnh nghiên cứu có hai bất thường: 37,7% hồ sơ vi phạm cam kết phản hồi bảy ngày với nút thắt ở khâu định giá, và hệ số markup gần như bất động (biên độ 0,35 điểm phần trăm) trong khi tỷ lệ thắng biến thiên 18,9 điểm phần trăm theo cường độ cạnh tranh. Ba bài toán được đặt ra theo thứ tự phụ thuộc: dự báo thời gian xử lý theo khâu, dự báo xác suất thắng, và tối ưu giá báo thầu."));
k.push(p(`Với bài toán thứ nhất, luận văn tách dự báo theo bốn khâu và phân tích cấu trúc biến động. Ba kiểm định đồng nhất phương sai cùng bác bỏ giả thuyết bốn khâu biến động như nhau; khâu Sales tách biệt với hệ số biến thiên ${f(B1.eda[0].CV,3)}, ba khâu còn lại tương đồng. ${f(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"],1)}% phương sai thời gian tổng là hiệp phương sai giữa các khâu, cho thấy một yếu tố độ phức tạp chung. Quy trình chẩn đoán giả định bác bỏ biến đổi logarit của công trình trước: thang đo gốc đã thỏa phương sai đều, logarit tạo ra phương sai thay đổi và làm sai số xấu đi 8,4%; đặc tả được chọn là thang gốc kèm sai số vững HC3.`));
k.push(p(`Với bài toán thứ hai, hồi quy logistic trên sáu nhóm biến có cơ chế kinh tế tường minh đạt AUC ngoài mẫu ${f(m2.AUC_test,3)} [${f(m2.AUC_test_CI[0],3)}; ${f(m2.AUC_test_CI[1],3)}] khi tách theo cụm dự án. Ba phát hiện cấu trúc: hệ số markup không phải tín hiệu giá; loại toàn bộ biến giá vẫn còn AUC ${f(ab[0].AUC_test,3)} nên cạnh tranh không thuần giá; và thời gian xử lý không ảnh hưởng xác suất thắng.`));
k.push(p(`Với bài toán thứ ba, hai giả thuyết mở rộng được kiểm định chính thức và đều bị bác bỏ. H1 — chính sách cân bằng Bayesian Nash tốt hơn best-response — bị bác bỏ: độ dốc markup theo số đối thủ là ${f(H.slope,4)} so với −1 theo lý thuyết, và hai đặc tả miền chi phí kẹp biên ${pct(nA.clip,0)} và ${pct(nB.clip,0)}. H2 — giá bóng của năng lực cải thiện lợi nhuận — bị bác bỏ bằng kiểm chứng giả dược: điều tiết theo hàng đợi đóng góp ${fp(pl.dong_gop_dieu_tiet_pp,2)} điểm phần trăm. Kết quả dương duy nhất là khung định giá theo xác suất thắng đã hiệu chuẩn, uplift kỳ vọng ${fp(cb.uplift_pct,2)} bền vững qua mọi phân tích độ nhạy.`));
k.push(p("Nguyên nhân được biện luận theo ba trụ cột: cạnh tranh phi giá, thời điểm phát sinh chi phí xử lý trước quyết định giá, và bản chất phân phối chi phí B2B. Trụ cột thứ hai được ba bài toán xác nhận độc lập. Đóng góp của luận văn là hai khung ứng dụng — cổng ba bước kiểm tra tính khả thi của mô hình cân bằng, và khung định giá theo xác suất thắng — cùng ba nguyên tắc vận hành: không dùng giá chào để điều tiết hàng đợi kỹ thuật; kiểm soát cam kết thời gian bằng bộ lọc tiếp nhận tại pha Sales-WBS; dùng định giá có hiệu chuẩn xác suất để tối ưu biên lợi nhuận."));
k.push(p([run("Từ khóa: ",{bold:true}),run("Khai phá dữ liệu, Dự báo thời gian xử lý, Phân tích biến động theo khâu, Hồi quy logistic, Xác suất thắng thầu, Định giá đấu thầu cạnh tranh, Cân bằng Bayesian Nash, Giá bóng năng lực, Kiểm chứng giả dược, Phân phối vật tư công nghiệp B2B.",{})]));
k.push(pb());

/* ABSTRACT */
k.push(HEAD("ABSTRACT"));
k.push(p(`This thesis studies the request-for-quotation process of a B2B industrial fastener and MRO distributor using ERP data of 1,500 quotations, 8,249 line items and 220 customers over 299 days. Three dependent problems are addressed: stage-level turnaround-time prediction, win-probability prediction, and competitive bid price optimisation. Stage-level analysis rejects homogeneous variation across the four stages; the Sales stage is distinct (coefficient of variation ${Number(B1.eda[0].CV).toFixed(3)}) and ${Number(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"]).toFixed(1)}% of total-TAT variance is inter-stage covariance. Residual diagnostics reject the log transformation used previously in favour of raw-scale OLS with HC3 robust errors. A logistic win model achieves out-of-sample AUC ${Number(m2.AUC_test).toFixed(3)} under project-level splitting and shows that markup carries no price signal, non-price factors alone reach AUC ${Number(ab[0].AUC_test).toFixed(3)}, and processing time does not affect win probability. Two extension hypotheses are formally tested and rejected: a closed-form Bayesian Nash pricing policy (markup elasticity to N of ${Number(H.slope).toFixed(4)} versus −1; ${(nA.clip*100).toFixed(0)}% and ${(nB.clip*100).toFixed(0)}% of recommendations clipped) and a capacity shadow-price adjustment (placebo-controlled contribution of ${Number(pl.dong_gop_dieu_tiet_pp).toFixed(2)} percentage points). The only robust positive result is calibrated win-probability pricing at ${Number(cb.uplift_pct).toFixed(2)}% expected uplift. The findings converge on one conclusion: bid price is not the appropriate lever for managing processing capacity. Contributions are a three-step feasibility gate for equilibrium pricing models and an operating principle separating admission control at the Sales-WBS stage from margin optimisation through calibrated pricing.`));
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
  ["c, p, T, r","—","Giá vốn, giá chào, giá mục tiêu, r = T/p (chỉ số cạnh tranh giá)"]],
 [1700,3200,4100],[0,11,24]));
k.push(pb());

/* DANH SACH HINH / BANG */
k.push(HEAD("DANH SÁCH HÌNH"));
k.push(mkTable(["Hình","Tên hình"],REG.figs.map(x=>[`Hình ${x.id}`,x.text]),[1400,7600],null,true),pb());
k.push(HEAD("DANH SÁCH BẢNG"));
k.push(mkTable(["Bảng","Tên bảng"],REG.tabs.map(x=>[`Bảng ${x.id}`,x.text]),[1400,7600],null,true));
return k;
};
