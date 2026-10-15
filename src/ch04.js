// CHUONG 4 — THUC NGHIEM VA KET QUA  (Run 4) — moi con so doc tu JSON ket qua
module.exports=function(L){
const {C,run,p,h1,h2,h3,cap,fx,img,mkTable,fn}=L;
const fs=require("fs");
const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const B1=J("bt1_pertask.json"), B1M=J("bt1_models.json"), B12=J("ch4_bt12.json"), B3=J("ch4_bt3.json"),
      FOC=J("bt3_form.json"), MC=J("metric_compare.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−");
const fp=(x,d=2)=>(x>=0?"+":"")+f(x,d)+"%";
const pct=(x,d=1)=>f(x*100,d)+"%";
const pv=(x)=>x<1e-4?"< 0,0001":f(x,4);
const D="";
const k=[];

k.push(h1("CHƯƠNG 4. THỰC NGHIỆM VÀ KẾT QUẢ"));
k.push(p("Chương này trình bày kết quả của ba bài toán theo đúng thứ tự phụ thuộc đã thiết kế ở Chương 3. Mục 4.1 trình bày BT1 với trọng tâm là chẩn đoán giả định và cấu trúc biến động theo khâu. Mục 4.2 trình bày BT2 với hệ số ước lượng, chỉ số ngoài mẫu và hiệu chuẩn. Mục 4.3 trình bày BT3 gồm so sánh chính sách giá, kiểm định hai giả thuyết và phân tích độ nhạy. Mục 4.4 tổng hợp; mục 4.5 cung cấp tham số thiết kế thực nghiệm. Mọi con số trong chương được tính trực tiếp từ mã nguồn phân tích đính kèm và là nguồn số liệu chuẩn cho các chương sau."));

/* ══════════════ 4.1 BT1 ══════════════ */
k.push(h2("4.1. Bài toán 1 — Dự báo thời gian xử lý theo khâu"));

k.push(h3("4.1.1. Thống kê mô tả từng khâu"));
const eda=B1.eda;
k.push(mkTable(["Khâu","n","Trung bình","Trung vị","Độ lệch chuẩn","Hệ số biến thiên","Bất đối xứng","P95","Tối đa"],
  eda.map(r=>[r.Khau,r.n,f(r.Mean,3),f(r.Median,1),f(r.SD,3),f(r.CV,3),f(r.Skew,3),f(r.P95,2),f(r.Max,1)]),
  [1000,700,1050,950,1150,1250,1100,900,900],[0]));
k.push(cap("Bảng 4.1: Thống kê mô tả thời gian xử lý (ngày) của bốn khâu, n = 1.500 hồ sơ"));
k.push(p(`Hai thước đo cho hai kết luận khác nhau, và cả hai đều đúng. Theo giá trị tuyệt đối, khâu Pricing là nút thắt: trung bình ${f(eda[3].Mean,2)} ngày và độ lệch chuẩn ${f(eda[3].SD,3)} ngày, đều cao nhất trong bốn khâu. Theo giá trị tương đối, khâu Sales biến động mạnh nhất: hệ số biến thiên ${f(eda[0].CV,3)}, cao hơn hẳn ba khâu còn lại nằm trong khoảng ${f(eda[1].CV,3)}–${f(eda[3].CV,3)}. Nghĩa là Pricing tiêu tốn nhiều thời gian nhất, nhưng Sales là khâu mà thời gian xử lý khó đoán nhất so với mức trung bình của chính nó. Cả bốn khâu đều lệch phải với hệ số bất đối xứng từ ${f(eda[3].Skew,2)} đến ${f(eda[2].Skew,2)}.`));
k.push(img(D+"FIG_4_1_Stage_Variation.png",620,0.382));
k.push(cap("Hình 4.1: (A) Phân phối thời gian xử lý từng khâu; (B) hệ số biến thiên — Sales cao nhất"));

k.push(h3("4.1.2. Chẩn đoán giả định và lựa chọn đặc tả"));
k.push(p("Áp dụng quy trình năm bước ở mục 3.2.2 cho mô hình thời gian tổng. Bốn đặc tả cạnh tranh được so sánh trên cùng bộ biến độc lập."));
const dt=B1M.dac_ta;
k.push(mkTable(["Đặc tả","MAE (ngày)","Breusch–Pagan p","Phương sai đều","Bất đối xứng phần dư","Phần dư chuẩn"],
  dt.map(r=>[r.Dac_ta.replace("thang do goc","thang đo gốc").replace("tren","trên").replace("sai so vung","sai số vững").replace("lien ket","liên kết"),
    f(r.MAE_ngay,4),pv(r.BP_p),r.Phuong_sai_deu?"Có":"Không",f(r.Skew_resid,3),r.Phan_du_chuan?"Có":"Không"]),
  [2500,1200,1500,1300,1500,1000],[0,2]));
k.push(cap("Bảng 4.2: So sánh bốn đặc tả mô hình thời gian tổng — thang đo gốc thỏa giả định phương sai đều"));
k.push(p([run("Kết quả này bác bỏ lựa chọn của công trình trước. ",{bold:true,color:C.DRED}),
  run(`Trên thang đo gốc, kiểm định Breusch–Pagan cho p = ${f(dt[0].BP_p,3)} và kiểm định White cho p = ${f(B1.chan_doan_phan_du[0].White_p,3)} — giả định phương sai sai số không đổi được chấp nhận ở cả hai kiểm định. Sau khi lấy logarit biến phụ thuộc, cả hai kiểm định đều bác bỏ giả định với p < 0,0001, và sai số dự báo tăng từ ${f(dt[0].MAE_ngay,4)} lên ${f(dt[1].MAE_ngay,4)} ngày, tức xấu đi ${f((dt[1].MAE_ngay/dt[0].MAE_ngay-1)*100,1)}%. Biến đổi logarit — vốn được chọn ở giai đoạn trước để ổn định phương sai — thực chất đã tạo ra phương sai thay đổi ở nơi trước đó không có.`,{})]));
k.push(p(`Vấn đề thật của mô hình không nằm ở phương sai mà ở phân phối phần dư: hệ số bất đối xứng ${f(dt[0].Skew_resid,2)} và kiểm định Jarque–Bera bác bỏ tính chuẩn với p < 0,0001. Logarit khắc phục được điều này — bất đối xứng giảm còn ${f(dt[1].Skew_resid,3)} — nhưng với cái giá là vi phạm giả định khác. Đúng như đã lập luận ở mục 3.2.2, hai vấn đề này đòi hỏi hai biện pháp khác nhau. Luận văn chọn đặc tả thang đo gốc kèm sai số chuẩn vững HC3: hệ số ước lượng không đổi, sai số dự báo tốt nhất, giả định phương sai đều được thỏa mãn, và suy luận thống kê về hệ số được bảo vệ trước vi phạm tính chuẩn.`));
k.push(img(D+"FIG_4_2_Residuals.png",620,0.382));
k.push(cap("Hình 4.2: Phần dư theo giá trị dự báo — (A) thang đo gốc không có dạng phễu; (B) sau log-transform xuất hiện dạng phễu"));

k.push(h3("4.1.3. Mô hình từng khâu và đối chiếu hai đường tính"));
const tk=B1M.tung_khau;
k.push(mkTable(["Khâu","R²","MAE (ngày)","Breusch–Pagan p","Phương sai đều","Biến mạnh nhất","Hệ số"],
  tk.map(r=>[r.Khau,f(r.R2,3),f(r.MAE_ngay,3),pv(r.BP_p),r.Phuong_sai_deu?"Có":"Không",r.Bien_manh_nhat,f(r.He_so,3)]),
  [1000,800,1100,1500,1300,2300,1000]));
k.push(cap("Bảng 4.3: Hồi quy riêng từng khâu — cả bốn khâu đều có phương sai thay đổi dù thời gian tổng thì không"));
k.push(p(`Ba quan sát từ Bảng 4.3. Thứ nhất, khả năng giải thích khác nhau rõ rệt giữa các khâu: WBS đạt R² = ${f(tk[1].R2,3)} và SC đạt ${f(tk[2].R2,3)}, trong khi Sales chỉ đạt ${f(tk[0].R2,3)}. Khâu có hệ số biến thiên cao nhất cũng là khâu mô hình giải thích kém nhất — biến động của Sales phần lớn không được năm biến độc lập nắm bắt. Thứ hai, cả bốn mô hình từng khâu đều có phương sai thay đổi với p < 0,0001, trong khi mô hình thời gian tổng thì không. Việc cộng gộp bốn khâu đã che mất hiện tượng này, và đây là một luận cứ thống kê mạnh cho việc phân tích theo khâu. Thứ ba, số lần làm rõ bản vẽ là biến có hệ số lớn nhất ở cả bốn khâu, với tác động mạnh nhất tại Pricing (${f(tk[3].He_so,3)} ngày mỗi lần làm rõ) — một đòn bẩy vận hành duy nhất tác động lên toàn bộ chuỗi.`));
const tc=B1M.tong_vs_congdon;
k.push(p([run("Đối chiếu hai đường tính thời gian tổng. ",{bold:true}),
  run(`Kiểm chứng chéo năm lớp cho sai số tuyệt đối trung bình ${f(tc.MAE_du_bao_tong,4)} ngày với đường dự báo trực tiếp và ${f(tc.MAE_cong_don_4_khau,4)} ngày với đường cộng dồn bốn khâu — chênh lệch ${f(tc["Cai_thien_%"],2)}%. Hai đường tính nhất quán với nhau, xác nhận dạng hàm không có vấn đề. Đồng thời, cần phát biểu thẳng: tách theo khâu không cải thiện độ chính xác dự báo thời gian tổng một cách đáng kể. Giá trị của việc tách theo khâu nằm ở chẩn đoán cấu trúc biến động, không nằm ở dự báo.`,{})]));

k.push(h3("4.1.4. Cấu trúc biến động giữa các khâu"));
const dn=B1.dong_nhat_phuong_sai;
k.push(mkTable(["Kiểm định","Thống kê","p","Kết luận"],
  [["Levene (Brown–Forsythe)",f(dn.levene_W,2),"< 0,0001","Bác bỏ đồng nhất phương sai"],
   ["Bartlett",f(dn.bartlett_chi2,2),"< 0,0001","Bác bỏ đồng nhất phương sai"],
   ["Kruskal–Wallis",f(dn.kruskal_H,2),"< 0,0001","Bác bỏ phân phối như nhau"]],
  [2800,1600,1600,3000]));
k.push(cap("Bảng 4.4: Ba kiểm định đồng nhất cùng bác bỏ giả thuyết bốn khâu có mức biến động như nhau"));
const cc=B1.cap_CV;
k.push(mkTable(["Cặp khâu","CV thứ nhất","CV thứ hai","Chênh lệch","KTC 95% bootstrap","Khác biệt"],
  cc.map(r=>[r.Cap,f(r.CV_1,3),f(r.CV_2,3),f(r.Chenh_CV,3),`[${f(r.CI_lo,3)}; ${f(r.CI_hi,3)}]`,r.Khac_biet?"Có":"Không"]),
  [1900,1200,1200,1200,2200,1300],[0,1,2]));
k.push(cap("Bảng 4.5: So sánh hệ số biến thiên từng cặp khâu, 2.000 lần bootstrap"));
k.push(p(`Sales khác biệt có ý nghĩa với cả ba khâu còn lại: khoảng tin cậy của chênh lệch hệ số biến thiên đều nằm hoàn toàn bên phải số không. Ngược lại, ba khâu WBS, SC và Pricing tạo thành một nhóm tương đối đồng nhất — WBS và SC không khác biệt, SC và Pricing không khác biệt, chỉ WBS và Pricing khác biệt nhẹ. Cấu trúc biến động vì vậy không phải bốn mức khác nhau, mà là một khâu tách biệt và ba khâu tương đồng.`));
const pr=B1.phan_ra_phuong_sai; const dg=pr["dong_gop_%"];
k.push(p(`Phân rã phương sai của thời gian tổng cho kết quả đáng chú ý nhất của bài toán này. Bốn khâu đóng góp lần lượt ${f(dg.Pricing,1)}% (Pricing), ${f(dg.WBS,1)}% (WBS), ${f(dg.Sales,1)}% (Sales) và ${f(dg.SC,1)}% (SC), tổng cộng ${f(dg.Pricing+dg.WBS+dg.Sales+dg.SC,1)}%. Phần còn lại — ${f(pr["hiep_phuong_sai_%"],1)}% — đến từ hiệp phương sai giữa các khâu. Gần một nửa biến thiên của thời gian tổng không thuộc về bất kỳ khâu riêng lẻ nào, mà thuộc về xu hướng đồng biến động: hồ sơ chậm ở khâu này thường cũng chậm ở khâu khác.`));
k.push(img(D+"FIG_4_3_Corr_Decomp.png",620,0.382));
k.push(cap("Hình 4.3: (A) Ma trận tương quan giữa các khâu; (B) phân rã phương sai thời gian tổng"));
const tq=B1M.tuong_quan;
k.push(p(`Ma trận tương quan làm rõ cấu trúc đó. WBS và SC tương quan chặt (${f(tq.WBS_Days.SC_Days,3)}); Sales tương quan vừa với WBS (${f(tq.Sales_Days.WBS_Days,3)}) và SC (${f(tq.Sales_Days.SC_Days,3)}). Nhưng Pricing gần như độc lập với Sales — hệ số tương quan ${f(tq.Sales_Days.Pricing_Days,3)}, về mặt thực tiễn bằng không. Thời gian ở khâu Pricing không bị chi phối bởi những gì xảy ra ở đầu chuỗi; nó được quyết định bởi tồn đọng của chính khâu Pricing.`));

k.push(h3("4.1.5. Diễn giải theo khung đăng ký trước"));
k.push(p("Đối chiếu với Bảng 3.3, kết quả rơi vào ba trong bốn tình huống đã đăng ký."));
k.push(p([run("Mức biến động khác nhau rõ rệt giữa các khâu ",{bold:true}),run("— tình huống thứ hai. Độ phức tạp xử lý không đồng đều; Sales là khâu có biên độ xử lý rộng nhất so với mức trung bình của nó, và là ứng viên can thiệp trước nếu mục tiêu là giảm bất định.",{})]));
k.push(p([run("Hiệp phương sai chiếm tỷ trọng lớn ",{bold:true}),run("— tình huống thứ ba. Tồn tại một yếu tố độ phức tạp chung của hồ sơ chi phối đồng thời nhiều khâu. Can thiệp cục bộ ở một khâu — kể cả khâu Pricing là nút thắt về thời gian tuyệt đối — sẽ chỉ chạm tới một phần biến thiên, phần còn lại thuộc về đặc tính của hồ sơ khi nó được tiếp nhận.",{})]));
k.push(p([run("Hai khâu gần như không tương quan ",{bold:true}),run("— tình huống thứ tư, áp dụng cho cặp Sales và Pricing. Hàng đợi Pricing vận hành độc lập với tải ở khâu tiếp nhận. Đây là bằng chứng ở tầng dữ liệu, thu được trước và độc lập với BT3, và sẽ được nhắc lại khi diễn giải kết quả của giả thuyết H2.",{})]));

/* ══════════════ 4.2 BT2 ══════════════ */
k.push(h2("4.2. Bài toán 2 — Dự báo xác suất thắng"));
const n2=B12.bt2_n, sp=B12.bt2_split, m2=B12.bt2_metrics;
k.push(p(`Mô hình logistic được ước lượng trên ${n2.items.toLocaleString("vi")} dòng hàng thuộc ${n2.projects.toLocaleString("vi")} hồ sơ sau khi loại giá trị khuyết, tỷ lệ thắng ${pct(n2.win_rate,2)}. Phân chia theo cụm dự án cho ${sp.train_items.toLocaleString("vi")} dòng hàng huấn luyện và ${sp.test_items.toLocaleString("vi")} dòng hàng kiểm tra thuộc ${sp.test_projects} hồ sơ. Biến độc lập được chuẩn hóa Z-score trên tập huấn luyện. Thời gian xử lý dự báo từ BT1 được tính ngoài mẫu theo năm lớp trước khi ghép vào, với sai số ${f(B12.bt1_oof.MAE,4)} ngày và R² ngoài mẫu ${f(B12.bt1_oof.R2_oof,4)}.`));

k.push(h3("4.2.1. Hệ số ước lượng và tỷ số chênh"));
const cf=B12.bt2_coef;
const VN={Price_Competitiveness:"Chỉ số cạnh tranh giá (T/p)",Supplier_SQE_Score:"Điểm chất lượng NCC",ATP_Stock_Available:"Tồn kho cam kết giao",
 Has_PPAP_Cert:"Chứng nhận PPAP",Local_Supplier:"NCC trong nước",Is_Strategic:"Khách hàng chiến lược",Is_Existing_Customer:"Khách hàng hiện hữu",
 CustClass:"Phân hạng khách hàng",CompInt:"Cường độ cạnh tranh",PayRisk:"Rủi ro điều khoản thanh toán",
 Pricing_Queue_Depth:"Độ sâu hàng đợi Pricing",Assigned_Engineer_Experience:"Kinh nghiệm kỹ sư",TAT_pred:"TAT dự báo từ BT1"};
k.push(mkTable(["Nhóm","Biến","Hệ số chuẩn hóa","Sai số chuẩn","p","OR (mỗi 1 SD)"],
  cf.map(r=>[r.nhom,VN[r.bien],f(r.beta_z,4),f(r.SE,4),pv(r.p),f(r.OR_z,3)]),
  [1500,2900,1400,1200,1100,1000],cf.map((r,i)=>r.p<0.05?i:-1).filter(i=>i>=0)));
k.push(cap("Bảng 4.6: Hệ số hồi quy logistic trên biến chuẩn hóa; các dòng tô màu có ý nghĩa ở mức 5%"));
const gPC=cf.find(r=>r.bien==="Price_Competitiveness"), gSQE=cf.find(r=>r.bien==="Supplier_SQE_Score"), gTAT=cf.find(r=>r.bien==="TAT_pred"),
      gQ=cf.find(r=>r.bien==="Pricing_Queue_Depth"), gCI=cf.find(r=>r.bien==="CompInt"), gEx=cf.find(r=>r.bien==="Is_Existing_Customer");
k.push(p(`Biến giá có tác động mạnh nhất: một độ lệch chuẩn tăng của chỉ số cạnh tranh giá — tức chào rẻ hơn tương đối so với giá mục tiêu — nhân odds thắng với ${f(gPC.OR_z,2)}. Đứng thứ hai là điểm chất lượng nhà cung cấp với OR ${f(gSQE.OR_z,2)}, tiếp theo là chứng nhận PPAP, tồn kho cam kết giao và khách hàng hiện hữu (OR ${f(gEx.OR_z,2)}). Dấu của mọi hệ số có ý nghĩa đều đúng với dấu kỳ vọng ở Bảng 3.4.`));
k.push(p([run("Ba biến không có ý nghĩa cần được nêu rõ thay vì bỏ qua. ",{bold:true}),
  run(`Cường độ cạnh tranh có hệ số ${f(gCI.beta_z,4)} với p = ${f(gCI.p,3)} — đúng dấu âm nhưng không phân biệt được với không sau khi đã kiểm soát giá và các yếu tố phi giá. Độ sâu hàng đợi có hệ số ${f(gQ.beta_z,4)}, p = ${f(gQ.p,3)}, gần ngưỡng nhưng chưa đạt. Đáng chú ý nhất là thời gian xử lý dự báo: hệ số ${f(gTAT.beta_z,4)}, p = ${f(gTAT.p,3)}, dấu dương trái với kỳ vọng và không có ý nghĩa. Trong bộ dữ liệu này, hồ sơ được dự báo xử lý chậm hơn không có xác suất thắng thấp hơn. Kết quả này nhất quán với phát hiện ở giai đoạn trước rằng thời gian phản hồi và kết quả thắng thua không liên hệ với nhau, và sẽ có hệ quả trực tiếp khi đánh giá giả thuyết H2.`,{})]));

k.push(h3("4.2.2. Chỉ số đánh giá và hiệu chuẩn"));
k.push(mkTable(["Chỉ số","Tập huấn luyện","Tập kiểm tra (tách theo dự án)"],
  [["McFadden R²",f(m2.McFadden,4),"—"],["McFadden hiệu chỉnh",f(m2.McFadden_adj,4),"—"],["Nagelkerke R²",f(m2.Nagelkerke,4),"—"],
   ["AIC / BIC",`${f(m2.AIC,1)} / ${f(m2.BIC,1)}`,"—"],
   ["AUC",f(m2.AUC_train,4),`${f(m2.AUC_test,4)}  [${f(m2.AUC_test_CI[0],4)}; ${f(m2.AUC_test_CI[1],4)}]`],
   ["Brier",f(m2.Brier_train,4),f(m2.Brier_test,4)]],
  [2600,2600,3800],[4,5]));
k.push(cap("Bảng 4.7: Chỉ số đánh giá mô hình BT2; khoảng tin cậy AUC từ 1.000 lần bootstrap"));
const cb=B12.bt2_calib;
k.push(p(`AUC ngoài mẫu ${f(m2.AUC_test,4)} không thấp hơn AUC nội mẫu, cho thấy mô hình không quá khớp. Về hiệu chuẩn ở mức tổng hợp, mô hình dự báo ${f(cb.expected_wins_test,1)} dòng hàng thắng trên tập kiểm tra so với ${cb.actual_wins_test} thực tế — dự báo cao hơn ${f(cb.deviation_pct,2)}%. Đường cong hiệu chuẩn ở Hình 4.4A bám gần đường chéo ở dải xác suất trung bình và hơi lệch ở hai đầu. Mức lệch này đủ nhỏ để dùng mô hình cho bài toán tối ưu giá, nhưng cần được ghi nhận: mọi lợi nhuận kỳ vọng tính từ mô hình có xu hướng lạc quan nhẹ.`));
k.push(img(D+"FIG_4_4_Calibration_ROC.png",620,0.382));
k.push(cap("Hình 4.4: (A) Đường cong hiệu chuẩn trên tập kiểm tra; (B) đường cong ROC ngoài mẫu"));
const xg=B12.bt2_xgb;
k.push(p(`Chuẩn so sánh bằng mô hình cây tăng cường gradient đạt AUC ${f(xg.AUC_test,4)} trên cùng tập kiểm tra — cao hơn logistic ${f((xg.AUC_test-m2.AUC_test)*1000,1)} phần nghìn. Khoảng cách này nằm gọn trong khoảng tin cậy của AUC logistic, nên không có bằng chứng cho thấy mô hình chính bỏ sót quan hệ phi tuyến đáng kể. Hồi quy logistic được giữ làm mô hình chính vì hệ số diễn giải được và đầu ra hiệu chuẩn được.`));

k.push(h3("4.2.3. Đóng góp của từng nhóm biến"));
const ab=B12.bt2_ablation;
k.push(mkTable(["Nhóm biến bị loại","AUC còn lại","Thay đổi AUC","Diễn giải"],
  ab.map(r=>[r.loai_nhom,f(r.AUC_test,4),(r.delta_AUC>=0?"+":"")+f(r.delta_AUC,4),
    r.delta_AUC<-0.05?"Đóng góp lớn":r.delta_AUC<-0.01?"Đóng góp vừa":"Không đóng góp đáng kể"]),
  [2200,1600,1600,3600],[0,1]));
k.push(cap("Bảng 4.8: Ablation theo nhóm biến — mức giảm AUC khi loại từng nhóm khỏi mô hình"));
k.push(p(`Hai nhóm quyết định kết quả là giá và năng lực nhà cung cấp, với mức giảm AUC lần lượt ${f(Math.abs(ab[0].delta_AUC),4)} và ${f(Math.abs(ab[1].delta_AUC),4)} khi bị loại. Đáng chú ý là ngay cả khi loại toàn bộ biến giá, mô hình vẫn đạt AUC ${f(ab[0].AUC_test,4)} — cao hơn nhiều so với ngưỡng ngẫu nhiên 0,5. Các yếu tố phi giá tự chúng đã dự báo được kết quả thắng thua ở mức có ý nghĩa thực tiễn. Đây là bằng chứng định lượng đầu tiên cho giới hạn về cạnh tranh không thuần giá đã khai báo ở mục 1.6, và sẽ là một trong ba trụ cột biện luận ở Chương 5.`));
k.push(p(`Ba nhóm còn lại — cạnh tranh, rủi ro thương mại và năng lực xử lý — đóng góp không đáng kể vào năng lực phân biệt của mô hình. Với nhóm năng lực xử lý, mức thay đổi AUC là ${(ab[5].delta_AUC>=0?"+":"")+f(ab[5].delta_AUC,4)}: khách hàng trong bộ dữ liệu này không phạt nhà cung cấp phản hồi chậm bằng cách chọn đối thủ. Phát hiện này quan trọng cho BT3.`));

k.push(h3("4.2.4. Lựa chọn biến giá"));
const pvr=B12.bt2_price_var;
k.push(mkTable(["Biến giá","Hệ số chuẩn hóa","p","AUC ngoài mẫu"],
  [["Hệ số markup (giá chào / giá vốn)",f(pvr.Markup_Pct.beta_z,4),f(pvr.Markup_Pct.p,3),f(pvr.Markup_Pct.AUC_test,4)],
   ["Chỉ số cạnh tranh giá (giá mục tiêu / giá chào)",f(pvr.Price_Competitiveness.beta_z,4),"< 0,0001",f(pvr.Price_Competitiveness.AUC_test,4)]],
  [3800,1700,1500,2000],[1]));
k.push(cap("Bảng 4.9: Hai ứng viên biến giá — chỉ chỉ số cạnh tranh giá mang thông tin"));
k.push(p(`Hệ số markup hoàn toàn không có ý nghĩa thống kê (p = ${f(pvr.Markup_Pct.p,3)}) và mô hình dùng nó chỉ đạt AUC ${f(pvr.Markup_Pct.AUC_test,4)}, ngang với mô hình không có biến giá. Điều này nhất quán với phát hiện ở mục 1.2.2: hệ số markup gần như không biến động và không phản ứng với cạnh tranh, nên nó không mang thông tin về khả năng thắng. Chỉ số cạnh tranh giá, đo tương quan giữa giá chào và giá mục tiêu của khách hàng, mới là tín hiệu giá thực sự. Kết luận này quyết định cách xây dựng hàm xác suất thắng theo giá ở BT3.`));

/* ══════════════ 4.3 BT3 ══════════════ */
k.push(h2("4.3. Bài toán 3 — Tối ưu giá báo thầu"));
const dm=B3.dai_markup, hc=B3.hieu_chuan_tong_hop;
k.push(p(`Toàn bộ đánh giá trong mục này thực hiện trên tập kiểm tra ${dm.n_test.toLocaleString("vi")} dòng hàng thuộc ${dm.n_test_proj} hồ sơ, tách theo cụm dự án và chưa từng được dùng để ước lượng mô hình xác suất thắng. Dải markup lịch sử trên tập huấn luyện có phân vị 5 bằng ${f(dm.P5,4)}, trung vị ${f(dm.median,4)} và phân vị 95 bằng ${f(dm.P95,4)}; dải [P5; P95] này là biên kẹp cho mọi chính sách. Lợi nhuận được tính theo đơn vị dòng hàng, không nhân số lượng đặt hàng.`));

k.push(h3("4.3.1. Kiểm chứng điều kiện bậc nhất"));
const fc=FOC.kiem_chung;
k.push(mkTable(["Dòng hàng","c (USD)","T (USD)","p* dò lưới","p* từ FOC","Lệch (USD)","Markup","P(Win)"],
  fc.map((r,i)=>[String(i+1),f(r.c,2),f(r.T,2),f(r.p_grid,4),f(r.p_foc,4),f(r.lech,4),f(r.markup,4),f(r.Pwin,4)]),
  [900,1100,1100,1300,1300,1100,1100,1100]));
k.push(cap("Bảng 4.10: Nghiệm từ điều kiện bậc nhất khớp với dò lưới trên sáu dòng hàng đầu tiên"));
k.push(p(`Sai lệch tối đa giữa hai cách giải là ${f(Math.max(...fc.map(r=>r.lech)),4)} USD, ở mức sai số làm tròn của lưới. Đạo hàm bậc hai của hàm mục tiêu đổi dấu trên miền giá khảo sát, từ ${f(FOC.phi_tuyen.max_d2,4)} xuống ${f(FOC.phi_tuyen.min_d2,4)}: hàm lồi ở vùng giá thấp và lõm quanh cực đại. Hàm mục tiêu là phi tuyến theo giá, nghiệm tìm được là cực đại nội suy duy nhất trên miền, và việc dò lưới cho kết quả đúng.`));

k.push(h3("4.3.2. Hiệu chỉnh số đối thủ hiệu dụng"));
const NC=B3.N_calib;
k.push(mkTable(["Phương pháp","Cạnh tranh thấp","Trung bình","Cao","Ghi chú"],
  [["Mô-men trên mức markup",f(NC.MoM["1"],2),f(NC.MoM["2"],2),f(NC.MoM["3"],2),"Không phân biệt được ba tầng"],
   ["Nghịch đảo tỷ lệ thắng",f(NC["1/WinRate"]["1"],2),f(NC["1/WinRate"]["2"],2),f(NC["1/WinRate"]["3"],2),"Tầng thấp dưới 2 — phi lý với đấu thầu"],
   ["Ánh xạ chuyên gia","2","4","6","Không dựa trên dữ liệu"],
   ["Lai (hình dạng từ tỷ lệ thắng, neo tại 2)",f(NC.Lai["1"],2),f(NC.Lai["2"],2),f(NC.Lai["3"],2),"Được chọn làm cấu hình cơ sở"]],
  [3000,1300,1200,1000,2500],[3]));
k.push(cap("Bảng 4.11: Bốn phương pháp hiệu chỉnh N cho khoảng rộng — tham số không được nhận dạng từ dữ liệu"));
k.push(p(`Bốn phương pháp cho giá trị trải từ ${f(NC["1/WinRate"]["1"],2)} đến ${f(NC.MoM["3"],2)} cho cùng bộ dữ liệu. Phương pháp mô-men cho N gần ${f(NC.MoM["2"],1)} ở cả ba tầng vì hệ số markup không khác nhau giữa các tầng — nó không mang thông tin về cạnh tranh. Phương pháp nghịch đảo tỷ lệ thắng cho N dưới 2 ở tầng thấp, điều không thể xảy ra trong đấu thầu có ít nhất hai bên. Bản thân sự phân tán này là một kết quả: tham số N không được nhận dạng từ dữ liệu quan sát, và mọi kết luận phụ thuộc vào nó phải đi kèm phân tích độ nhạy. Phương pháp lai được chọn vì giữ được hình dạng giảm dần theo cạnh tranh từ dữ liệu, đồng thời neo mức tuyệt đối ở giá trị tối thiểu hợp lý.`));

k.push(h3("4.3.3. Giá bóng của năng lực xử lý"));
const lb=B3.logit_breach, la=B3.lambda;
k.push(fx([`P_breach(Q) = 1 / ( 1 + exp( −( ${f(lb.a0,4)} + ${f(lb.a1,4)} · Q ) ) )`,
  `Hệ số của Q có p = ${lb.p.toExponential(1).replace(".",",")} ;  tỷ lệ vi phạm mẫu ${pct(lb.breach_rate,1)}`,
  `π_SLA = 0,50 × biên lợi nhuận trung bình ${f(la.margin_item,2)} USD = ${f(0.5*la.margin_item,2)} USD / lần vi phạm`,
  `Quy về cấp dòng hàng: chia cho ${f(la.items_per_rfq,2)} dòng hàng mỗi hồ sơ`]));
k.push(mkTable(["Độ sâu hàng đợi Q","0","10","20","30 (trần)"],
  [["λ mỗi dòng hàng (USD)",f(la.lam_item_Q["0"],2),f(la.lam_item_Q["10"],2),f(la.lam_item_Q["20"],2),f(la.lam_item_Q["30"],2)]],
  [3000,1500,1500,1500,1500]));
k.push(cap("Bảng 4.12: Giá bóng của năng lực xử lý theo độ sâu hàng đợi, tại π_SLA bằng 0,50 lần biên lợi nhuận"));
k.push(p(`Giá bóng tăng đơn điệu theo độ sâu hàng đợi, từ ${f(la.lam_item_Q["0"],2)} USD khi hàng đợi trống lên ${f(la.lam_item_Q["30"],2)} USD tại trần. Giá trị trung bình trên tập kiểm tra là ${f(la.lam_item_mean_test,2)} USD mỗi dòng hàng — tương đương ${f(la.lam_item_mean_test/la.margin_item*100,1)}% biên lợi nhuận trung bình. Con số này nhỏ, và độ lớn của nó sẽ là một phần của biện luận ở Chương 5.`));

k.push(h3("4.3.4. So sánh các chính sách giá"));
const P=B3.policies; const ORD=["Thực tế (thực nhận)","Thực tế (kỳ vọng mô hình)","Cost-Plus (markup trung vị)","CBPO Realistic (kẹp P5–P95)",
  "CBPO Optimistic (không kẹp)","Nash A — miền tuyệt đối (kẹp)","Nash B — miền tỷ lệ (kẹp)","CBPO + Capacity λ(Q)","Giả dược — λ hằng số"];
k.push(mkTable(["Chính sách","Lợi nhuận kỳ vọng (USD)","Uplift","P(Win) trung bình","Tỷ lệ ngoài dải"],
  ORD.map(n=>[n,f(P[n].profit,1),fp(P[n].uplift_pct,2),f(P[n].Pwin,3),n.includes("Optimistic")||n.includes("Thực tế")||n.includes("Cost")?"—":pct(P[n].clip,1)]),
  [3300,1800,1200,1500,1200],[3,7,8]));
k.push(cap("Bảng 4.13: Lợi nhuận kỳ vọng của các chính sách giá trên cùng tập kiểm tra"));
k.push(p(`Kiểm tra hiệu chuẩn tổng hợp trước khi đọc bảng: tại chính mức giá lịch sử, mô hình dự báo lợi nhuận ${f(hc.ky_vong_tai_gia_lich_su,1)} USD so với ${f(hc.thuc_nhan,1)} USD thực nhận, lệch ${fp(hc.lech_pct,2)}. Mọi uplift dưới đây vì vậy có xu hướng lạc quan nhẹ ở mức tương tự.`));
k.push(img(D+"FIG_4_5_Policies.png",640,0.367));
k.push(cap("Hình 4.5: (A) Uplift theo chính sách; (B) xác suất thắng trung bình — uplift đi kèm giảm tỷ lệ thắng"));
const cp=P["Cost-Plus (markup trung vị)"], cb_=P["CBPO Realistic (kẹp P5–P95)"], nA=P["Nash A — miền tuyệt đối (kẹp)"], nB=P["Nash B — miền tỷ lệ (kẹp)"];
k.push(p([run("Cost-Plus. ",{bold:true}),run(`Quy tắc nhân giá vốn với hệ số markup trung vị cố định cho lợi nhuận kỳ vọng chênh ${fp(cp.uplift_pct,2)} so với thực nhận. Toàn bộ mức điều chỉnh mà đội định giá đang áp dụng chỉ tạo ra khác biệt dưới 1% so với một quy tắc không có bất kỳ sự tinh vi nào. Kết quả này lặp lại phát hiện ở mục 1.2.2 dưới dạng tiền.`,{})]));
k.push(p([run("CBPO Realistic. ",{bold:true,color:C.GREEN}),run(`Tối ưu giá theo xác suất thắng đã hiệu chuẩn, kẹp trong dải markup lịch sử, cho ${fp(cb_.uplift_pct,2)} với xác suất thắng trung bình giảm từ ${f(P["Thực tế (thực nhận)"].Pwin,3)} xuống ${f(cb_.Pwin,3)}. Tỷ lệ ${pct(cb_.clip,1)} ở cột cuối là tỷ lệ dòng hàng có nghiệm tối ưu không ràng buộc nằm ngoài dải — với các dòng này, chính sách chọn biên gần nhất. Phiên bản không kẹp cho ${fp(P["CBPO Optimistic (không kẹp)"].uplift_pct,2)} nhưng đòi hỏi ngoại suy ra ngoài vùng hành vi đã quan sát, nên không được dùng làm khuyến nghị.`,{})]));
k.push(p([run("Hai đặc tả cân bằng thất bại theo hai hướng ngược nhau. ",{bold:true,color:C.DRED}),
  run(`Đặc tả A với cận trên tuyệt đối theo nhóm hàng đẩy ${pct(nA.clip,1)} dòng hàng vượt trần và bị kẹp lại; trung vị markup đề xuất trước khi kẹp là ${f(nA.median_mk_unclipped,3)}, so với P95 lịch sử ${f(dm.P95,4)}. Đặc tả B với cận trên tỷ lệ theo giá vốn đẩy ${pct(nB.clip,1)} dòng hàng xuống dưới sàn — trung vị markup đề xuất ${f(nB.median_mk_unclipped,3)}, thấp hơn P5 lịch sử. Không đặc tả nào sinh ra mức giá nội suy nằm trong vùng hành vi quan sát được. Uplift ${fp(nA.uplift_pct,2)} của đặc tả A vì vậy không phải sản phẩm của cơ chế cân bằng mà của cơ chế kẹp: khi ${pct(nA.clip,0)} khuyến nghị bị đưa về cùng một trần, chính sách suy biến thành quy tắc nâng giá đồng loạt.`,{})]));

k.push(h3("4.3.5. Kiểm định giả thuyết H1"));
const H=B3.H1_test;
k.push(fx([`Mô hình:   ln(Markup_Pct_i) = a + b · ln(N_i) + u_i ,   n = ${H.n.toLocaleString("vi")}`,
  `Sai số chuẩn cụm theo hồ sơ.  H0(BNE): b = −1 ;  H0(cost-plus): b = 0`,
  ``,
  `b̂ = ${f(H.slope,4)}   SE = ${f(H.SE_cluster,4)}   KTC 95% = [${f(H.CI[0],4)}; ${f(H.CI[1],4)}]`,
  `Kiểm định b = −1:  t = ${f(H.t_vs_minus1,1)} ,  p < 0,0001   →  BÁC BỎ`,
  `Kiểm định b = 0:   t = ${f(H.t_vs_0,2)} ,  p = ${f(H.p_vs_0,3)}   →  KHÔNG BÁC BỎ`]));
k.push(p(`Lý thuyết cân bằng với chi phí phân phối đều dự đoán hệ số markup giảm ${f(H.BNE_du_doan_giam_pct,1)}% khi chuyển từ tầng cạnh tranh thấp sang cao. Dữ liệu cho độ dốc ${f(H.slope,4)} — đúng dấu âm, nhưng độ lớn chưa bằng 1% mức lý thuyết yêu cầu và không phân biệt được với không về mặt thống kê. Hành vi định giá quan sát được tuân theo nguyên tắc cost-plus và không phản ứng có ý nghĩa với cường độ cạnh tranh.`));
k.push(p([run("Kết luận kiểm định: hệ quả so sánh tĩnh của giả thuyết H1 bị bác bỏ. ",{bold:true}),
  run("Kết hợp với kết quả mục 4.3.4 — không đặc tả cân bằng nào sinh ra mức giá nội suy — bằng chứng thực nghiệm không ủng hộ giả thuyết H1. Nguyên nhân được biện luận tại Chương 5.",{})]));
k.push(img(D+"FIG_4_6_H1_Placebo.png",640,0.374));
k.push(cap("Hình 4.6: (A) Markup quan sát gần như phẳng theo N trong khi cân bằng dự đoán giảm; (B) kiểm chứng giả dược"));

k.push(h3("4.3.6. Kiểm chứng giả dược và giả thuyết H2"));
const pl=B3.placebo;
k.push(p(`Chính sách CBPO có xét năng lực — cộng giá bóng λ(Q) vào giá vốn trước khi tối ưu — cho uplift ${fp(pl.cap_uplift,2)}, cao hơn CBPO không xét năng lực (${fp(cb_.uplift_pct,2)}). Nếu dừng ở đây, kết luận sẽ là thành phần năng lực tạo thêm ${f(pl.cap_uplift-cb_.uplift_pct,2)} điểm phần trăm lợi nhuận.`));
k.push(p(`Nhánh giả dược thay λ(Q) bằng hằng số ${f(la.lam_item_mean_test,2)} USD — đúng giá trị trung bình của λ(Q) trên tập kiểm tra — và giữ nguyên mọi thứ khác. Nhánh này cho uplift ${fp(pl.placebo_uplift,2)}. Chênh lệch giữa chính sách động và giả dược là ${fp(pl.dong_gop_dieu_tiet_pp,2)} điểm phần trăm, về mặt thực tiễn bằng không.`));
k.push(p([run("Kết luận kiểm định: hệ quả kiểm định của giả thuyết H2 bị bác bỏ. ",{bold:true}),
  run("Toàn bộ mức tăng của chính sách có xét năng lực đến từ việc nâng mặt bằng giá lên một lượng cố định, không đến từ việc điều tiết theo trạng thái hàng đợi. Cơ chế được thiết kế không tạo ra giá trị có thể đo được so với phiên bản đơn giản hóa có cùng tác động trung bình.",{})]));
k.push(p("Cần nêu thêm hai ràng buộc của kết luận này. Thứ nhất, chỉ tiêu lợi nhuận kỳ vọng không đo được lợi ích vận hành mà thành phần năng lực nhắm tới — giảm vi phạm cam kết thời gian — nên đánh giá này tính đủ chi phí nhưng chưa tính lợi ích. Thứ hai, kết quả BT2 ở mục 4.2.3 cho thấy khách hàng không phạt phản hồi chậm, nên ngay cả khi thành phần năng lực làm giảm thời gian xử lý, lợi ích đó cũng không chuyển thành xác suất thắng cao hơn trong bộ dữ liệu này. Cả hai điểm được phát triển ở Chương 5."));

k.push(h3("4.3.7. Phân tích độ nhạy"));
const S=B3.sensitivity;
k.push(mkTable(["Tham số biến thiên","Phạm vi khảo sát","Kết quả","Nhận xét"],
  [["Số đối thủ N (đặc tả A)",`N tầng thấp từ ${f(S.N_scale[0].N_low,1)} đến ${f(S.N_scale[5].N_low,1)}`,
    `Uplift từ ${fp(S.N_scale[0].uplift,1)} xuống ${fp(S.N_scale[5].uplift,1)}; đổi dấu quanh N ≈ ${f(S.N_scale.find(r=>r.uplift<0).N_low-0.5,1)}`,"Kết luận về đặc tả A phụ thuộc hoàn toàn vào N"],
   ["Họ phân phối chi phí (đặc tả A)","Đều so với tam giác",`Đều ${fp(S.F_family.Uniform,2)}; tam giác ${fp(S.F_family.Triangular,2)}`,"Đổi dấu khi thay họ phân phối"],
   ["Chi phí vi phạm SLA π","0,25 đến 5,3 lần biên lợi nhuận",`CBPO + Cap từ ${fp(S.pi_SLA[0].cap_uplift,1)} đến ${fp(S.pi_SLA[3].cap_uplift,1)}; giả dược bám sát ở mọi mức`,"Điều tiết theo Q không đóng góp ở bất kỳ mức π nào"],
   ["CBPO không xét năng lực","Không phụ thuộc N, F hay π",fp(cb_.uplift_pct,2),"Kết quả bền vững duy nhất"]],
  [2300,2300,2700,1700],[3]));
k.push(cap("Bảng 4.14: Tổng hợp phân tích độ nhạy"));
k.push(img(D+"FIG_4_7_Sensitivity.png",640,0.374));
k.push(cap("Hình 4.7: (A) Uplift đặc tả A theo N; (B) uplift theo π_SLA — chính sách động và giả dược trùng nhau"));
k.push(p(`Phân tích độ nhạy phân định rõ hai loại kết quả. Kết quả của đặc tả cân bằng A đảo dấu khi N tại tầng thấp vượt khoảng ${f(S.N_scale.find(r=>r.uplift<0).N_low-0.5,1)}, nằm ngay trong dải mà ánh xạ chuyên gia đề xuất, và đảo dấu khi thay phân phối đều bằng phân phối tam giác. Kết quả của chính sách có xét năng lực thay đổi theo π nhưng luôn bám sát giả dược, nghĩa là thay đổi đó đến từ mức nâng giá trung bình chứ không từ cơ chế. Chỉ CBPO không xét năng lực cho kết quả không phụ thuộc vào tham số nào không nhận dạng được.`));

/* ══════════════ 4.4 ══════════════ */
k.push(h2("4.4. Tổng hợp kết quả ba bài toán"));
k.push(mkTable(["Bài toán","Câu hỏi nghiên cứu","Kết quả chính","Trạng thái"],
  [["BT1","Biến động thời gian phân bố thế nào giữa bốn khâu?",`Không đồng nhất; Sales biến động tương đối cao nhất; ${f(pr["hiep_phuong_sai_%"],1)}% phương sai tổng là hiệp phương sai; Pricing độc lập với Sales. Log-transform bị bác bỏ; chọn thang gốc + HC3`,"Trả lời được"],
   ["BT2","Yếu tố nào quyết định xác suất thắng?",`AUC ngoài mẫu ${f(m2.AUC_test,3)}; giá và năng lực NCC chi phối; loại giá vẫn còn AUC ${f(ab[0].AUC_test,3)}; thời gian xử lý không ảnh hưởng`,"Trả lời được"],
   ["BT3 — H1","Giá cân bằng có tốt hơn best-response?",`Độ dốc ${f(H.slope,4)} so với −1; hai đặc tả cân bằng kẹp biên ${pct(nA.clip,0)} và ${pct(nB.clip,0)}`,"Bác bỏ"],
   ["BT3 — H2","Giá bóng năng lực có cải thiện lợi nhuận?",`Giả dược: điều tiết theo Q đóng góp ${fp(pl.dong_gop_dieu_tiet_pp,2)} điểm phần trăm`,"Bác bỏ"],
   ["BT3 — CBPO","Mức giá tối ưu theo xác suất thắng?",`${fp(cb_.uplift_pct,2)} kỳ vọng, bền vững qua mọi độ nhạy; cần A/B để xác nhận`,"Kết quả dương duy nhất"]],
  [1200,2500,4000,1300],[2,3]));
k.push(cap("Bảng 4.15: Tổng hợp kết quả và trạng thái của ba bài toán"));
k.push(p("Ba bài toán không cho ba kết quả rời rạc. Kết quả BT1 cho thấy hàng đợi Pricing vận hành độc lập với đầu chuỗi; kết quả BT2 cho thấy khách hàng không phản ứng với thời gian xử lý; và kết quả BT3 cho thấy điều tiết giá theo hàng đợi không tạo giá trị. Ba phát hiện này, thu được từ ba phương pháp khác nhau trên ba cấp phân tích, cùng chỉ về một kết luận: trong bối cảnh này, giá chào không phải đòn bẩy phù hợp để quản lý năng lực xử lý. Chương 5 biện luận nguyên nhân."));

/* ══════════════ 4.5 ══════════════ */
k.push(h2("4.5. Tham số thiết kế thực nghiệm kiểm chứng"));
const A=B3.ab_design;
k.push(p([run(`Áp dụng thiết kế ở mục 3.6 với tham số ước lượng từ dữ liệu. Hệ số tương quan nội cụm của lợi nhuận thực nhận theo hồ sơ là ${f(A.ICC,4)}`,{}),fn("Tương quan nội cụm được tính bằng phân tích phương sai một chiều theo hồ sơ. Giá trị thay đổi theo đại lượng được đo — từ 0,18 với chỉ báo thắng thua tới 0,26 với xác suất thắng dự báo (Bảng B.2) — nên thiết kế dùng ICC của đúng chỉ tiêu tương ứng: lợi nhuận cho chỉ tiêu chính, chỉ báo thắng thua cho chỉ tiêu bảo vệ."),run(`; với trung bình ${f(A.m_bar,2)} dòng hàng mỗi hồ sơ, hiệu ứng thiết kế bằng ${f(A.DEFF,3)}. Độ lệch chuẩn lợi nhuận mỗi dòng hàng là ${f(A.sigma_profit_item,2)} USD quanh trung bình ${f(A.mean_profit_item,2)} USD. Nhịp tiếp nhận ${f(A.proj_per_month,1)} hồ sơ mỗi tháng.`,{})]));
k.push(mkTable(["Chỉ tiêu và hiệu ứng cần phát hiện","Dòng hàng mỗi nhánh","Hồ sơ mỗi nhánh","Thời gian chạy (tháng)"],
  [["Lợi nhuận, uplift 14% (mức CBPO)",f(A.uplift_14pct.n_items_per_arm,0),f(A.uplift_14pct.n_proj_per_arm,0),f(A.uplift_14pct.months,1)],
   ["Lợi nhuận, uplift 10%",f(A.uplift_10pct.n_items_per_arm,0),f(A.uplift_10pct.n_proj_per_arm,0),f(A.uplift_10pct.months,1)],
   ["Lợi nhuận, uplift 5%",f(A.uplift_5pct.n_items_per_arm,0),f(A.uplift_5pct.n_proj_per_arm,0),f(A.uplift_5pct.months,1)],
   ["Bảo vệ tỷ lệ thắng, biên 5 điểm %",f(A.guard_wr_5pp.n_items_per_arm,0),f(A.guard_wr_5pp.n_proj_per_arm,0),f(A.guard_wr_5pp.months,1)],
   ["Bảo vệ tỷ lệ thắng, biên 3 điểm %",f(A.guard_wr_3pp.n_items_per_arm,0),f(A.guard_wr_3pp.n_proj_per_arm,0),f(A.guard_wr_3pp.months,1)]],
  [3600,1800,1800,1800],[0,3]));
k.push(cap("Bảng 4.16: Cỡ mẫu và thời gian chạy yêu cầu, α = 0,05, công suất 0,80, hai nhánh"));
k.push(p(`Phát hiện ở mức uplift ${fp(cb_.uplift_pct,0)} của CBPO cần khoảng ${f(A.uplift_14pct.n_proj_per_arm,0)} hồ sơ mỗi nhánh, tương đương ${f(A.uplift_14pct.months,1)} tháng vận hành. Nhưng ràng buộc thời gian thực sự nằm ở chỉ tiêu bảo vệ: để khẳng định tỷ lệ thắng không giảm quá 5 điểm phần trăm cần ${f(A.guard_wr_5pp.months,1)} tháng, và với biên 3 điểm phần trăm cần ${f(A.guard_wr_3pp.months,1)} tháng. Hệ số tương quan nội cụm ${f(A.ICC,3)} làm hiệu ứng thiết kế gần bằng ${f(A.DEFF,1)}, nghĩa là mỗi dòng hàng chỉ mang khoảng ${f(1/A.DEFF*100,0)}% lượng thông tin so với khi các dòng hàng độc lập. Thiết kế phân tầng theo phân hạng khách hàng và cường độ cạnh tranh, cùng nhánh giả dược bắt buộc, giữ nguyên như đã đăng ký ở mục 3.6.`));

return k;
};
