// PHAN CUOI — tai lieu tham khao, phu luc
module.exports=function(L){
const {C,run,p,h1,h2,h3,cap,fx,mkTable,pb}=L;
const fs=require("fs"); const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const AX=J("ch4_icc_appx.json"),B12=J("ch4_bt12.json"),MC=J("metric_compare.json"),B3=J("ch4_bt3.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−"); const pv=(x)=>x<1e-4?"< 0,0001":f(x,4);
const k=[];

/* ═══ TAI LIEU THAM KHAO ═══ */
k.push(h1("TÀI LIỆU THAM KHẢO"));
k.push(p([run("Định dạng APA 7. Danh mục chia ba nhóm theo chủ đề, trong mỗi nhóm sắp theo thứ tự chữ cái.",{italic:true,color:C.BODY,size:24})]));
const grp=(t,items)=>{k.push(p([run(t,{bold:true,size:24})],{after:100}));
  items.forEach(s=>k.push(new L.Paragraph({alignment:L.AlignmentType.LEFT,spacing:{line:300,after:100},indent:{left:400,hanging:400},
    children:[run(s,{size:24})]})));};
grp("Nhóm A — Lý thuyết đấu giá, định giá cạnh tranh và quản trị doanh thu",[
 "Che, Y.-K. (1993). Design competition through multidimensional auctions. The RAND Journal of Economics, 24(4), 668–680.",
 "Friedman, L. (1956). A competitive bidding strategy. Operations Research, 4(1), 104–112.",
 "Gallego, G., & van Ryzin, G. (1994). Optimal dynamic pricing of inventories with stochastic demand over finite horizons. Management Science, 40(8), 999–1020.",
 "Guerre, E., Perrigne, I., & Vuong, Q. (2000). Optimal nonparametric estimation of first-price auctions. Econometrica, 68(3), 525–574.",
 "Harsanyi, J. C. (1967). Games with incomplete information played by “Bayesian” players, I–III. Part I. The basic model. Management Science, 14(3), 159–182.",
 "Krishna, V. (2009). Auction theory (2nd ed.). Academic Press.",
 "Nash, J. F. (1950). Equilibrium points in n-person games. Proceedings of the National Academy of Sciences, 36(1), 48–49.",
 "Talluri, K. T., & van Ryzin, G. J. (2004). The theory and practice of revenue management. Springer.",
 "Vickrey, W. (1961). Counterspeculation, auctions, and competitive sealed tenders. The Journal of Finance, 16(1), 8–37."]);
grp("Nhóm B — Thống kê, kinh tế lượng và thiết kế thực nghiệm",[
 "Akaike, H. (1974). A new look at the statistical model identification. IEEE Transactions on Automatic Control, 19(6), 716–723.",
 "Bartlett, M. S. (1937). Properties of sufficiency and statistical tests. Proceedings of the Royal Society of London. Series A, 160(901), 268–282.",
 "Breusch, T. S., & Pagan, A. R. (1979). A simple test for heteroscedasticity and random coefficient variation. Econometrica, 47(5), 1287–1294.",
 "Brier, G. W. (1950). Verification of forecasts expressed in terms of probability. Monthly Weather Review, 78(1), 1–3.",
 "Brown, M. B., & Forsythe, A. B. (1974). Robust tests for the equality of variances. Journal of the American Statistical Association, 69(346), 364–367.",
 "Efron, B. (1979). Bootstrap methods: Another look at the jackknife. The Annals of Statistics, 7(1), 1–26.",
 "Hosmer, D. W., Lemeshow, S., & Sturdivant, R. X. (2013). Applied logistic regression (3rd ed.). Wiley.",
 "Jarque, C. M., & Bera, A. K. (1980). Efficient tests for normality, homoscedasticity and serial independence of regression residuals. Economics Letters, 6(3), 255–259.",
 "Kruskal, W. H., & Wallis, W. A. (1952). Use of ranks in one-criterion variance analysis. Journal of the American Statistical Association, 47(260), 583–621.",
 "MacKinnon, J. G., & White, H. (1985). Some heteroskedasticity-consistent covariance matrix estimators with improved finite sample properties. Journal of Econometrics, 29(3), 305–325.",
 "McFadden, D. (1974). Conditional logit analysis of qualitative choice behavior. In P. Zarembka (Ed.), Frontiers in econometrics (pp. 105–142). Academic Press.",
 "Nagelkerke, N. J. D. (1991). A note on a general definition of the coefficient of determination. Biometrika, 78(3), 691–692.",
 "Schwarz, G. (1978). Estimating the dimension of a model. The Annals of Statistics, 6(2), 461–464.",
 "Stone, M. (1974). Cross-validatory choice and assessment of statistical predictions. Journal of the Royal Statistical Society: Series B, 36(2), 111–147.",
 "White, H. (1980). A heteroskedasticity-consistent covariance matrix estimator and a direct test for heteroskedasticity. Econometrica, 48(4), 817–838."]);
grp("Nhóm C — Khai phá dữ liệu và học máy",[
 "Brent, R. P. (1973). Algorithms for minimization without derivatives. Prentice-Hall.",
 "Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. In Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining (pp. 785–794). ACM.",
 "Wirth, R., & Hipp, J. (2000). CRISP-DM: Towards a standard process model for data mining. In Proceedings of the 4th International Conference on the Practical Applications of Knowledge Discovery and Data Mining (pp. 29–39)."]);

/* ═══ PHU LUC A ═══ */
k.push(h1("PHỤ LỤC A. KẾT QUẢ CHI TIẾT BÀI TOÁN 1"));
k.push(p("Hệ số hồi quy trên biến độc lập đã chuẩn hóa Z-score, sai số chuẩn vững HC3 trong ngoặc. Hệ số chuẩn hóa cho biết thời gian (ngày) thay đổi bao nhiêu khi biến độc lập tăng một độ lệch chuẩn."));
const PR=["Required_Approval_Levels","Drawing_Clarification_Flags","Pricing_Queue_Depth","Assigned_Engineer_Experience","Recent_Throughput_Rate"];
const VN={const:"Hằng số",Required_Approval_Levels:"Số cấp phê duyệt",Drawing_Clarification_Flags:"Số lần làm rõ bản vẽ",Pricing_Queue_Depth:"Độ sâu hàng đợi Pricing",Assigned_Engineer_Experience:"Kinh nghiệm kỹ sư",Recent_Throughput_Rate:"Năng suất gần đây"};
const ST=["Sales_Days","WBS_Days","SC_Days","Pricing_Days","Turnaround time"]; const SN=["Sales","WBS","SC","Pricing","TAT tổng"];
k.push(mkTable(["Biến","Sales","WBS","SC","Pricing","TAT tổng"],
  ["const",...PR].map(v=>[VN[v],...ST.map(s=>`${f(AX.appendix_A[s].coef[v],3)}\n(${f(AX.appendix_A[s].se_hc3[v],3)})`)])
  .concat([["R² hiệu chỉnh",...ST.map(s=>f(AX.appendix_A[s].R2_adj,3))],["AIC",...ST.map(s=>f(AX.appendix_A[s].AIC,1))],["BIC",...ST.map(s=>f(AX.appendix_A[s].BIC,1))]]),
  [2200,1360,1360,1360,1360,1360],[6,7,8]));
k.push(cap("Bảng A.1: Hệ số hồi quy chuẩn hóa từng khâu và thời gian tổng, sai số chuẩn HC3 trong ngoặc"));
k.push(p("Mọi hệ số đều có ý nghĩa ở mức 0,1% ở tất cả các khâu. Dấu nhất quán: số cấp phê duyệt, số lần làm rõ bản vẽ và độ sâu hàng đợi kéo dài thời gian; kinh nghiệm kỹ sư và năng suất gần đây rút ngắn thời gian."));

k.push(h2("A.2. Thí nghiệm thiên lệch của R² khi thêm biến nhiễu"));
k.push(p("Giữ nguyên năm biến thực chất, lần lượt thêm biến nhiễu ngẫu nhiên độc lập hoàn toàn với biến phụ thuộc. Thí nghiệm minh họa lập luận ở mục 2.1.5."));
k.push(mkTable(["Mô hình","k","R","R²","R² hiệu chỉnh","BIC","R² kiểm chứng chéo"],
  MC.bt1_r2_bias.map(r=>[r.Mo_hinh.replace("bien thuc chat","biến thực chất").replace("bien nhieu","biến nhiễu"),r.k_bien,f(r.R,4),f(r.R2,4),f(r.R2_hieu_chinh,4),f(r.BIC,1),f(r.R2_kiem_chung_cheo,4)]),
  [2600,600,1000,1000,1400,1200,1200],[4]));
k.push(cap("Bảng A.2: R² và R tăng theo biến nhiễu; R² hiệu chỉnh, BIC và kiểm chứng chéo phản ứng đúng"));

/* ═══ PHU LUC B ═══ */
k.push(h1("PHỤ LỤC B. KẾT QUẢ CHI TIẾT BÀI TOÁN 2"));
k.push(h2("B.1. Thiên lệch của pseudo R² trong hồi quy logistic"));
k.push(mkTable(["Mô hình","k","McFadden","McFadden hiệu chỉnh","Nagelkerke","BIC","AUC nội mẫu"],
  MC.bt2_pseudo_r2.map(r=>[r.Mo_hinh.replace("bien thuc chat","biến thực chất").replace("bien nhieu","biến nhiễu"),r.k_bien,f(r.McFadden_R2,4),f(r.McFadden_hieu_chinh,4),f(r.Nagelkerke_R2,4),f(r.BIC,1),f(r.AUC,4)]),
  [2600,600,1100,1500,1200,1200,1100],[2]));
k.push(cap("Bảng B.1: McFadden thô và Nagelkerke tăng theo biến nhiễu; chỉ McFadden hiệu chỉnh và BIC phản ứng đúng"));
k.push(h2("B.2. Tương quan nội cụm theo đại lượng"));
k.push(p("Hệ số tương quan nội cụm theo hồ sơ, tính bằng phân tích phương sai một chiều, cho bốn đại lượng ứng viên. Giá trị dùng trong thiết kế thực nghiệm là ICC của lợi nhuận thực nhận cho chỉ tiêu chính và ICC của chỉ báo thắng thua cho chỉ tiêu bảo vệ."));
k.push(mkTable(["Đại lượng","ICC","DEFF (m̄ = 5,10)"],
  ["profit_real","Item_Win_Status","log_profit","p_hat"].map(v=>[AX[v].label,f(AX[v].ICC,4),f(AX[v].DEFF,3)]),[4000,2500,2500],[0,1]));
k.push(cap("Bảng B.2: Tương quan nội cụm và hiệu ứng thiết kế theo đại lượng"));
k.push(h2("B.3. Mô tả biến trong mô hình xác suất thắng"));
k.push(mkTable(["Biến","Cấp","Kiểu","Mô tả"],
 [["Price_Competitiveness","Dòng hàng","Liên tục","Giá mục tiêu / giá chào; nghịch đảo giá tương đối"],
  ["Supplier_SQE_Score","Dòng hàng","Liên tục","Điểm đánh giá chất lượng nhà cung cấp"],
  ["ATP_Stock_Available","Dòng hàng","Nhị phân","Có tồn kho cam kết giao"],["Has_PPAP_Cert","Dòng hàng","Nhị phân","Có chứng nhận PPAP"],
  ["Local_Supplier","Dòng hàng","Nhị phân","Nhà cung cấp trong nước"],["Is_Strategic","Hồ sơ","Nhị phân","Khách hàng chiến lược"],
  ["Is_Existing_Customer","Hồ sơ","Nhị phân","Khách hàng hiện hữu"],["Customer_Class","Hồ sơ","Thứ bậc (5 mức)","Phân hạng khách hàng L1–M2"],
  ["Competitor_Intensity","Hồ sơ","Thứ bậc (3 mức)","Cường độ cạnh tranh Low / Med / High"],["Payment_Term_Risk","Hồ sơ","Thứ bậc (3 mức)","Net30 / Net60 / Net90"],
  ["Pricing_Queue_Depth","Hồ sơ","Đếm","Số hồ sơ đang chờ tại đội Pricing lúc tiếp nhận"],["Assigned_Engineer_Experience","Hồ sơ","Liên tục","Mức kinh nghiệm kỹ sư phụ trách"],
  ["TAT_pred","Hồ sơ","Liên tục","Thời gian xử lý dự báo từ BT1, tính ngoài lớp"]],[2600,1100,1500,3800]));
k.push(cap("Bảng B.3: Mô tả 13 biến độc lập của mô hình xác suất thắng"));

/* ═══ PHU LUC C ═══ */
k.push(h1("PHỤ LỤC C. MÃ NGUỒN VÀ TÁI LẬP KẾT QUẢ"));
k.push(p("Toàn bộ kết quả trong luận văn được tái lập bằng bộ mã nguồn Python đính kèm, chạy tuần tự trên hai tệp dữ liệu HeadView_Workload.csv và ItemView_Workload.csv. Mỗi tập lệnh xuất kết quả dạng JSON; văn bản luận văn đọc trực tiếp từ các tệp JSON này khi biên soạn, bảo đảm không có số liệu nào được nhập thủ công."));
k.push(mkTable(["Tập lệnh","Nội dung","Đầu ra"],
 [["bt1_pertask.py","EDA từng khâu; kiểm định đồng nhất phương sai; bootstrap CV; phân rã phương sai; chẩn đoán phần dư","bt1_pertask.json"],
  ["bt1_models.py","So sánh bốn đặc tả; kiểm chứng chéo tổng vs cộng dồn; hồi quy từng khâu; tương quan","bt1_models.json"],
  ["metric_compare.py","Thí nghiệm thiên lệch R² và pseudo R²; AUC ngoài mẫu","metric_compare.json"],
  ["ch4_bt12.py","TAT dự báo ngoài lớp; logistic BT2; hiệu chuẩn; ablation; chuẩn so sánh XGBoost; Hình 4.1–4.4","ch4_bt12.json, bt2_scored.pkl, bt2_model.json"],
  ["bt3_form2.py","Dẫn xuất và kiểm chứng điều kiện bậc nhất BT3","bt3_form.json"],
  ["ch4_bt3.py","Bảy chính sách giá; hiệu chỉnh N; λ(Q); giả dược; kiểm định H1; độ nhạy; thiết kế A/B; Hình 4.5–4.7","ch4_bt3.json"],
  ["ch5_triage.py","Kiểm tra quy tắc tiếp nhận; ngưỡng hòa vốn π_SLA","ch5_triage.json"],
  ["ch4_icc_appx.py","ICC theo đại lượng; hệ số đầy đủ Phụ lục A","ch4_icc_appx.json"]],[2000,4800,2200]));
k.push(cap("Bảng C.1: Bộ mã nguồn tái lập kết quả"));
k.push(p("Môi trường: Python 3.11, pandas, numpy, scipy, statsmodels, scikit-learn, xgboost 3.2, matplotlib. Hạt giống ngẫu nhiên cố định bằng 42 cho mọi bước có yếu tố ngẫu nhiên. Số liệu mô hình học máy có thể lệch nhẹ giữa các phiên bản thư viện; kết luận định tính không thay đổi."));
return k;
};
