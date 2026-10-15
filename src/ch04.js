// CHUONG 4 — THUC NGHIEM VA KET QUA  (v3) — moi con so doc tu JSON ket qua
module.exports=function(L){
const {C,run,p,h1,h2,h3,cap,fx,img,mkTable,fn}=L;
const fs=require("fs");
const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const B1=J("bt1_pertask.json"), B1M=J("bt1_models.json"), B12=J("ch4_bt12.json"), B3=J("ch4_bt3.json"),
      FOC=J("bt3_form.json"), DA=J("data_audit.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−");
const fp=(x,d=2)=>(x>=0?"+":"")+f(x,d)+"%";
const fs_=(x,d=4)=>(x>=0?"+":"")+f(x,d);
const pct=(x,d=1)=>f(x*100,d)+"%";
const pv=(x)=>x<1e-4?"< 0,0001":f(x,4);
const n0=(x)=>Number(x).toLocaleString("de-DE");
const fk=(x,d=1)=>Number(x).toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d}).replace(/^-/,"−");
const k=[];

k.push(h1("CHƯƠNG 4. THỰC NGHIỆM VÀ KẾT QUẢ"));
k.push(p("Chương này trình bày kết quả theo đúng thứ tự phụ thuộc đã thiết kế ở Chương 3, trên bản dữ liệu v3 (đã bổ sung trường liên kết CRM/Sourcing và đối soát trạng thái đơn hàng cuối kỳ). Mục 4.1 trình bày BT1 với trọng tâm là chẩn đoán giả định và cấu trúc biến động theo khâu. Mục 4.2 trình bày BT2 với hệ số ước lượng, chỉ số ngoài mẫu, hiệu chuẩn và độ nhạy theo phiên bản nhãn. Mục 4.3 trình bày BT3 gồm đối sánh ba đặc tả cân bằng, kiểm định hai giả thuyết và phân tích độ nhạy. Mục 4.4 trình bày nghiên cứu mô phỏng liên kỳ có kiểm soát. Mục 4.5 tổng hợp; mục 4.6 cung cấp tham số thiết kế thực nghiệm. Mọi con số trong chương được tính trực tiếp từ mã nguồn phân tích đính kèm và là nguồn số liệu chuẩn cho các chương sau."));

/* ══════════════ 4.1 BT1 ══════════════ */
k.push(h2("4.1. Bài toán 1 — Dự báo thời gian xử lý theo khâu"));
k.push(p("Các trường thời gian và năm biến độc lập của BT1 không thay đổi giữa bản nháp và bản v3; vì vậy toàn bộ kết quả BT1 tái lập đúng như bản trước. Điểm thay đổi duy nhất là thời gian xử lý dự báo ngoài lớp của BT1 nay được dùng làm đầu vào cho mô hình xác suất thắng trên nhãn đã đối soát."));

k.push(h3("4.1.1. Thống kê mô tả từng khâu"));
const eda=B1.eda;
k.push(mkTable(["Khâu","n","Trung bình","Trung vị","Độ lệch chuẩn","Hệ số biến thiên","Bất đối xứng","P95","Tối đa"],
  eda.map(r=>[r.Khau,n0(r.n),f(r.Mean,3),f(r.Median,1),f(r.SD,3),f(r.CV,3),f(r.Skew,3),f(r.P95,2),f(r.Max,1)]),
  [1000,700,1050,950,1150,1250,1100,900,900],[0]));
k.push(cap("Bảng 4.1: Thống kê mô tả thời gian xử lý (ngày) của bốn khâu, n = 1.500 hồ sơ"));
k.push(p(`Hai thước đo cho hai kết luận khác nhau, và cả hai đều đúng. Theo giá trị tuyệt đối, khâu Pricing là nút thắt: trung bình ${f(eda[3].Mean,2)} ngày và độ lệch chuẩn ${f(eda[3].SD,3)} ngày, đều cao nhất trong bốn khâu. Theo giá trị tương đối, khâu Sales biến động mạnh nhất: hệ số biến thiên ${f(eda[0].CV,3)}, cao hơn hẳn ba khâu còn lại nằm trong khoảng ${f(Math.min(eda[1].CV,eda[2].CV,eda[3].CV),3)}–${f(Math.max(eda[1].CV,eda[2].CV,eda[3].CV),3)}. Nghĩa là Pricing tiêu tốn nhiều thời gian nhất, nhưng Sales là khâu mà thời gian xử lý khó đoán nhất so với mức trung bình của chính nó. Cả bốn khâu đều lệch phải với hệ số bất đối xứng từ ${f(Math.min(...eda.map(r=>r.Skew)),2)} đến ${f(Math.max(...eda.map(r=>r.Skew)),2)}.`));
k.push(img("FIG_4_1_Stage_Variation.png",620,0.382));
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
k.push(img("FIG_4_2_Residuals.png",620,0.382));
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
  run(`Kiểm chứng chéo năm lớp cho sai số tuyệt đối trung bình ${f(tc.MAE_du_bao_tong,4)} ngày với đường dự báo trực tiếp và ${f(tc.MAE_cong_don_4_khau,4)} ngày với đường cộng dồn bốn khâu — chênh lệch ${f(tc["Cai_thien_%"],2)}% (đường cộng dồn tốt hơn ${f(tc.MAE_du_bao_tong-tc.MAE_cong_don_4_khau,4)} ngày). Hai đường tính nhất quán với nhau, xác nhận dạng hàm không có vấn đề. Đồng thời, cần phát biểu thẳng: tách theo khâu không cải thiện độ chính xác dự báo thời gian tổng một cách đáng kể. Giá trị của việc tách theo khâu nằm ở chẩn đoán cấu trúc biến động, không nằm ở dự báo.`,{})]));

k.push(h3("4.1.4. Cấu trúc biến động giữa các khâu"));
const dn=B1.dong_nhat_phuong_sai;
k.push(mkTable(["Kiểm định","Thống kê","p","Kết luận"],
  [["Levene (Brown–Forsythe)",f(dn.levene_W,2),pv(dn.levene_p),"Bác bỏ đồng nhất phương sai"],
   ["Bartlett",f(dn.bartlett_chi2,2),pv(dn.bartlett_p),"Bác bỏ đồng nhất phương sai"],
   ["Kruskal–Wallis",f(dn.kruskal_H,2),pv(dn.kruskal_p),"Bác bỏ phân phối như nhau"]],
  [2800,1600,1600,3000]));
k.push(cap("Bảng 4.4: Ba kiểm định đồng nhất cùng bác bỏ giả thuyết bốn khâu có mức biến động như nhau"));
const cc=B1.cap_CV;
k.push(mkTable(["Cặp khâu","CV thứ nhất","CV thứ hai","Chênh lệch","KTC 95% bootstrap","Khác biệt"],
  cc.map(r=>[r.Cap,f(r.CV_1,3),f(r.CV_2,3),f(r.Chenh_CV,3),`[${f(r.CI_lo,3)}; ${f(r.CI_hi,3)}]`,r.Khac_biet?"Có":"Không"]),
  [1900,1200,1200,1200,2200,1300],[0,1,2]));
k.push(cap("Bảng 4.5: So sánh hệ số biến thiên từng cặp khâu, 2.000 lần bootstrap"));
k.push(p(`Sales khác biệt có ý nghĩa với cả ba khâu còn lại: khoảng tin cậy của chênh lệch hệ số biến thiên đều nằm hoàn toàn bên phải số không. Ngược lại, ba khâu WBS, SC và Pricing tạo thành một nhóm tương đối đồng nhất. Cấu trúc biến động vì vậy không phải bốn mức khác nhau, mà là một khâu tách biệt và ba khâu tương đồng.`));
const pr=B1.phan_ra_phuong_sai; const dg=pr["dong_gop_%"];
k.push(p(`Phân rã phương sai của thời gian tổng cho kết quả đáng chú ý nhất của bài toán này. Bốn khâu đóng góp lần lượt ${f(dg.Pricing,1)}% (Pricing), ${f(dg.WBS,1)}% (WBS), ${f(dg.Sales,1)}% (Sales) và ${f(dg.SC,1)}% (SC), tổng cộng ${f(dg.Pricing+dg.WBS+dg.Sales+dg.SC,1)}%. Phần còn lại — ${f(pr["hiep_phuong_sai_%"],1)}% — đến từ hiệp phương sai giữa các khâu. Gần một nửa biến thiên của thời gian tổng không thuộc về bất kỳ khâu riêng lẻ nào, mà thuộc về xu hướng đồng biến động: hồ sơ chậm ở khâu này thường cũng chậm ở khâu khác.`));
k.push(img("FIG_4_3_Corr_Decomp.png",620,0.382));
k.push(cap("Hình 4.3: (A) Ma trận tương quan giữa các khâu; (B) phân rã phương sai thời gian tổng"));
const tq=B1M.tuong_quan;
k.push(p(`Ma trận tương quan làm rõ cấu trúc đó. WBS và SC tương quan chặt (${f(tq.WBS_Days.SC_Days,3)}); Sales tương quan vừa với WBS (${f(tq.Sales_Days.WBS_Days,3)}) và SC (${f(tq.Sales_Days.SC_Days,3)}). Nhưng Pricing gần như độc lập với Sales — hệ số tương quan ${f(tq.Sales_Days.Pricing_Days,3)}, về mặt thực tiễn bằng không. Thời gian ở khâu Pricing không bị chi phối bởi những gì xảy ra ở đầu chuỗi; nó được quyết định bởi tồn đọng của chính khâu Pricing.`));

k.push(h3("4.1.5. Diễn giải theo khung đăng ký trước và đầu ra cho BT2"));
k.push(p("Đối chiếu với Bảng 3.3, kết quả rơi vào ba trong bốn tình huống đã đăng ký."));
k.push(p([run("Mức biến động khác nhau rõ rệt giữa các khâu ",{bold:true}),run("— tình huống thứ hai. Độ phức tạp xử lý không đồng đều; Sales là khâu có biên độ xử lý rộng nhất so với mức trung bình của nó, và là ứng viên can thiệp trước nếu mục tiêu là giảm bất định.",{})]));
k.push(p([run("Hiệp phương sai chiếm tỷ trọng lớn ",{bold:true}),run("— tình huống thứ ba. Tồn tại một yếu tố độ phức tạp chung của hồ sơ chi phối đồng thời nhiều khâu. Can thiệp cục bộ ở một khâu — kể cả khâu Pricing là nút thắt về thời gian tuyệt đối — sẽ chỉ chạm tới một phần biến thiên, phần còn lại thuộc về đặc tính của hồ sơ khi nó được tiếp nhận.",{})]));
k.push(p([run("Hai khâu gần như không tương quan ",{bold:true}),run("— tình huống thứ tư, áp dụng cho cặp Sales và Pricing. Hàng đợi Pricing vận hành độc lập với tải ở khâu tiếp nhận. Đây là bằng chứng ở tầng dữ liệu, thu được trước và độc lập với BT3, và là cơ sở cho việc mô hình hóa khâu Pricing như một hệ hàng đợi riêng trong mô phỏng Mục 4.4.",{})]));
k.push(p(`Đầu ra chuyển sang BT2 là thời gian xử lý dự báo ngoài lớp (OOF) theo kiểm chứng chéo năm lớp, dùng đặc tả thang đo gốc: sai số tuyệt đối trung bình ${f(B12.bt1_oof.MAE,4)} ngày, R² ngoài mẫu ${f(B12.bt1_oof.R2_oof,4)}. Mỗi hồ sơ nhận giá trị dự báo từ mô hình không được huấn luyện trên chính nó, nên biến TAT_pred không chứa rò rỉ từ kết quả thực tế.`));

/* ══════════════ 4.2 BT2 ══════════════ */
k.push(h2("4.2. Bài toán 2 — Dự báo xác suất thắng"));
const n2=B12.bt2_n, sp=B12.bt2_split, m2=B12.bt2_metrics, LS=B12.bt2_label_sens;
k.push(p(`Mô hình logistic được ước lượng trên ${n0(n2.items)} dòng hàng hợp lệ thuộc ${n0(n2.projects)} hồ sơ sau khi loại giá trị khuyết, tỷ lệ thắng ${pct(n2.win_rate,2)} trên nhãn đã đối soát. Phân chia theo cụm dự án 80/20 cho ${n0(sp.train_items)} dòng hàng huấn luyện và ${n0(sp.test_items)} dòng hàng kiểm tra thuộc ${sp.test_projects} hồ sơ — đúng cùng phân chia với bản trước, nên mọi khác biệt so với bản trước đến từ nhãn chứ không từ cách chia. Biến độc lập được chuẩn hóa Z-score trên tập huấn luyện.`));

k.push(h3("4.2.1. Hệ số ước lượng và tỷ số chênh"));
const cf=B12.bt2_coef;
const VN={Price_Competitiveness:"Chỉ số cạnh tranh giá (T/p)",Supplier_SQE_Score:"Điểm chất lượng NCC",ATP_Stock_Available:"Tồn kho cam kết giao",
 Has_PPAP_Cert:"Chứng nhận PPAP",Local_Supplier:"NCC trong nước",Is_Strategic:"Khách hàng chiến lược",Is_Existing_Customer:"Khách hàng hiện hữu",
 CustClass:"Phân hạng khách hàng",CompInt:"Cường độ cạnh tranh",PayRisk:"Rủi ro điều khoản thanh toán",
 Pricing_Queue_Depth:"Độ sâu hàng đợi Pricing",Assigned_Engineer_Experience:"Kinh nghiệm kỹ sư",TAT_pred:"TAT dự báo từ BT1 (OOF)"};
const EXP={Price_Competitiveness:"+",Supplier_SQE_Score:"+",ATP_Stock_Available:"+",Has_PPAP_Cert:"+",Local_Supplier:"+",Is_Strategic:"+",Is_Existing_Customer:"+",
 CustClass:"+",CompInt:"−",PayRisk:"−",Pricing_Queue_Depth:"−",Assigned_Engineer_Experience:"+",TAT_pred:"−"};
k.push(mkTable(["Nhóm","Biến","Dấu kỳ vọng","Hệ số chuẩn hóa","Sai số chuẩn","p","OR (mỗi 1 SD)"],
  cf.map(r=>[r.nhom,VN[r.bien],EXP[r.bien],fs_(r.beta_z,4),f(r.SE,4),pv(r.p),f(r.OR_z,3)]),
  [1350,2600,900,1300,1100,1000,1000],cf.map((r,i)=>r.p<0.05?i:-1).filter(i=>i>=0)));
k.push(cap("Bảng 4.6: Hệ số hồi quy logistic trên biến chuẩn hóa, nhãn đã đối soát; các dòng tô màu có ý nghĩa ở mức 5%"));
const g=b=>cf.find(r=>r.bien===b);
const gPC=g("Price_Competitiveness"), gSQE=g("Supplier_SQE_Score"), gTAT=g("TAT_pred"), gQ=g("Pricing_Queue_Depth"), gCI=g("CompInt"),
      gEx=g("Is_Existing_Customer"), gATP=g("ATP_Stock_Available"), gPP=g("Has_PPAP_Cert"), gLoc=g("Local_Supplier"), gCC=g("CustClass"),
      gStr=g("Is_Strategic"), gPay=g("PayRisk"), gEng=g("Assigned_Engineer_Experience");
const sig=cf.filter(r=>r.p<0.05), sigOK=sig.filter(r=>(EXP[r.bien]==="+")===(r.beta_z>0));
k.push(p(`Biến giá có tác động mạnh nhất: một độ lệch chuẩn tăng của chỉ số cạnh tranh giá — tức chào rẻ hơn tương đối so với giá mục tiêu — có hệ số chuẩn hóa ${fs_(gPC.beta_z,4)} (p ${pv(gPC.p)}), tức nhân odds thắng với ${f(gPC.OR_z,2)}. Nhóm năng lực nhà cung cấp đứng thứ hai và có ý nghĩa ở cả bốn biến: điểm chất lượng (${fs_(gSQE.beta_z,4)}), tồn kho cam kết giao (${fs_(gATP.beta_z,4)}), chứng nhận PPAP (${fs_(gPP.beta_z,4)}) và nhà cung cấp trong nước (${fs_(gLoc.beta_z,4)}, p = ${f(gLoc.p,4)}). Nhóm quan hệ khách hàng có ý nghĩa ở khách hàng hiện hữu (${fs_(gEx.beta_z,4)}) và phân hạng khách hàng (${fs_(gCC.beta_z,4)}), trong khi biến khách hàng chiến lược không có ý nghĩa (p = ${f(gStr.p,3)}) sau khi đã kiểm soát hai biến kia.`));
k.push(p([run("Phát hiện quan trọng trên bộ dữ liệu đã đối soát. ",{bold:true,color:C.RED}),
  run(`Khác với bản nháp, cả cường độ cạnh tranh và nhóm năng lực xử lý đều mang dấu âm và có ý nghĩa thống kê ở mức 1%: cường độ cạnh tranh ${fs_(gCI.beta_z,4)} (p ${pv(gCI.p)}), độ sâu hàng đợi Pricing ${fs_(gQ.beta_z,4)} (p ${pv(gQ.p)}) và thời gian xử lý dự báo ${fs_(gTAT.beta_z,4)} (p = ${f(gTAT.p,4)}). Cả ba khớp dấu kỳ vọng đã đăng ký ở Bảng 3.4. Tổng cộng ${sig.length} trên 13 hệ số có ý nghĩa ở mức 5%, và ${sigOK.length === sig.length ? "toàn bộ" : sigOK.length+" trong số đó"} đúng dấu kỳ vọng. Kinh nghiệm kỹ sư (p = ${f(gEng.p,3)}) và rủi ro điều khoản thanh toán (p = ${f(gPay.p,3)}) không có ý nghĩa.`,{})]));
k.push(p(`Về độ lớn, hai biến năng lực xử lý cộng lại tương đương một tác động đáng kể: một hồ sơ có hàng đợi sâu hơn một độ lệch chuẩn và thời gian dự báo dài hơn một độ lệch chuẩn có odds thắng nhân với ${f(gQ.OR_z*gTAT.OR_z,3)} — giảm khoảng ${f((1-gQ.OR_z*gTAT.OR_z)*100,0)}%. Trên nhãn đã đối soát, sự ứ đọng tại hàng đợi Pricing và thời gian phản hồi kéo dài đi kèm xác suất thắng thấp hơn một cách có hệ thống. Cần đọc đúng mức phát biểu: đây là liên hệ có điều kiện trong một mô hình quan sát, không phải hiệu ứng nhân quả đã nhận dạng; và như Mục 4.2.5 chỉ ra, ý nghĩa thống kê của nhóm biến này phụ thuộc vào phiên bản nhãn.`));

k.push(h3("4.2.2. Chỉ số đánh giá và hiệu chuẩn"));
k.push(mkTable(["Chỉ số","Tập huấn luyện","Tập kiểm tra (tách theo dự án)"],
  [["McFadden R²",f(m2.McFadden,4),"—"],["McFadden hiệu chỉnh",f(m2.McFadden_adj,4),"—"],["Nagelkerke R²",f(m2.Nagelkerke,4),"—"],
   ["AIC / BIC",`${f(m2.AIC,1)} / ${f(m2.BIC,1)}`,"—"],
   ["AUC",f(m2.AUC_train,4),`${f(m2.AUC_test,4)}  [${f(m2.AUC_test_CI[0],4)}; ${f(m2.AUC_test_CI[1],4)}]`],
   ["Brier",f(m2.Brier_train,4),f(m2.Brier_test,4)]],
  [2600,2600,3800],[4,5]));
k.push(cap("Bảng 4.7: Chỉ số đánh giá mô hình BT2; khoảng tin cậy AUC từ 1.000 lần bootstrap"));
const cb=B12.bt2_calib;
k.push(p(`AUC ngoài mẫu ${f(m2.AUC_test,4)} không thấp hơn AUC nội mẫu ${f(m2.AUC_train,4)}, cho thấy mô hình không quá khớp; so với bản nháp (AUC ${f(LS.AUC_test_v1,4)} trên nhãn trước đối soát), năng lực phân biệt gần như không đổi. Về hiệu chuẩn ở mức tổng hợp, mô hình dự báo ${f(cb.expected_wins_test,1)} dòng hàng thắng trên tập kiểm tra so với ${cb.actual_wins_test} thực tế — dự báo cao hơn ${f(cb.deviation_pct,2)}%. Đường cong hiệu chuẩn ở Hình 4.4A bám gần đường chéo ở dải xác suất trung bình và hơi lệch ở hai đầu. Mức lệch này đủ nhỏ để dùng mô hình cho bài toán tối ưu giá, nhưng cần được ghi nhận: mọi lợi nhuận kỳ vọng tính từ mô hình có xu hướng lạc quan nhẹ.`));
k.push(img("FIG_4_4_Calibration_ROC.png",620,0.382));
k.push(cap("Hình 4.4: (A) Đường cong hiệu chuẩn trên tập kiểm tra; (B) đường cong ROC ngoài mẫu"));
const xg=B12.bt2_xgb;
k.push(p(`Chuẩn so sánh bằng mô hình cây tăng cường gradient đạt AUC ${f(xg.AUC_test,4)} trên cùng tập kiểm tra — cao hơn logistic ${f((xg.AUC_test-m2.AUC_test)*1000,1)} phần nghìn. Khoảng cách này nằm gọn trong khoảng tin cậy của AUC logistic, nên không có bằng chứng cho thấy mô hình chính bỏ sót quan hệ phi tuyến đáng kể. Hồi quy logistic được giữ làm mô hình chính vì hệ số diễn giải được và đầu ra hiệu chuẩn được.`));

k.push(h3("4.2.3. Đóng góp của từng nhóm biến"));
const ab=B12.bt2_ablation; const AB=n=>ab.find(r=>r.loai_nhom===n);
k.push(mkTable(["Nhóm biến bị loại","AUC còn lại","Thay đổi AUC","Diễn giải"],
  ab.map(r=>[r.loai_nhom,f(r.AUC_test,4),(r.delta_AUC>=0?"+":"")+f(r.delta_AUC,4),
    r.delta_AUC<-0.03?"Đóng góp lớn":r.delta_AUC<-0.01?"Đóng góp vừa":"Không đóng góp đáng kể"]),
  [2200,1600,1600,3600],[0,1]));
k.push(cap("Bảng 4.8: Ablation theo nhóm biến — mức giảm AUC khi loại từng nhóm khỏi mô hình"));
k.push(p(`Hai nhóm quyết định năng lực phân biệt là giá và năng lực nhà cung cấp, với mức giảm AUC lần lượt ${f(Math.abs(AB("Giá").delta_AUC),4)} và ${f(Math.abs(AB("Năng lực NCC").delta_AUC),4)} khi bị loại. Ngay cả khi loại toàn bộ biến giá, mô hình vẫn đạt AUC ${f(AB("Giá").AUC_test,4)} — cao hơn nhiều so với ngưỡng ngẫu nhiên 0,5. Các yếu tố phi giá tự chúng đã dự báo được kết quả thắng thua ở mức có ý nghĩa thực tiễn. Đây là bằng chứng định lượng cho giới hạn về cạnh tranh không thuần giá đã khai báo ở mục 1.6, và là một trong ba trụ cột biện luận ở Chương 5.`));
k.push(p(`Trên nhãn đã đối soát, nhóm năng lực xử lý chuyển thành nhóm có đóng góp vừa: loại nhóm này làm AUC thay đổi ${(AB("Năng lực xử lý").delta_AUC>=0?"+":"")+f(AB("Năng lực xử lý").delta_AUC,4)}, ngang với nhóm quan hệ khách hàng (${f(AB("Quan hệ KH").delta_AUC,4)}). Nhóm cạnh tranh có hệ số ý nghĩa nhưng đóng góp phân biệt nhỏ (${f(AB("Cạnh tranh").delta_AUC,4)}) vì thông tin của nó trùng lặp một phần với giá. Rủi ro thương mại không đóng góp. Như vậy dữ liệu đã đối soát cho thấy khách hàng có phạt phản hồi chậm — một phát hiện có hệ quả trực tiếp cho thiết kế cơ chế điều phối ở Mục 4.4.`));

k.push(h3("4.2.4. Lựa chọn biến giá"));
const pvr=B12.bt2_price_var;
k.push(mkTable(["Biến giá","Hệ số chuẩn hóa","p","AUC ngoài mẫu"],
  [["Hệ số markup (giá chào / giá vốn)",fs_(pvr.Markup_Pct.beta_z,4),f(pvr.Markup_Pct.p,3),f(pvr.Markup_Pct.AUC_test,4)],
   ["Chỉ số cạnh tranh giá (giá mục tiêu / giá chào)",fs_(pvr.Price_Competitiveness.beta_z,4),pv(pvr.Price_Competitiveness.p),f(pvr.Price_Competitiveness.AUC_test,4)]],
  [3800,1700,1500,2000],[1]));
k.push(cap("Bảng 4.9: Hai ứng viên biến giá — chỉ chỉ số cạnh tranh giá mang thông tin"));
k.push(p(`Hệ số markup hoàn toàn không có ý nghĩa thống kê (p = ${f(pvr.Markup_Pct.p,3)}) và mô hình dùng nó chỉ đạt AUC ${f(pvr.Markup_Pct.AUC_test,4)}, ngang với mô hình không có biến giá (${f(AB("Giá").AUC_test,4)}). Điều này nhất quán với phát hiện ở mục 1.2.2: hệ số markup gần như không biến động và không phản ứng với cạnh tranh, nên nó không mang thông tin về khả năng thắng. Chỉ số cạnh tranh giá, đo tương quan giữa giá chào và giá mục tiêu của khách hàng, mới là tín hiệu giá thực sự. Kết luận này quyết định cách xây dựng hàm xác suất thắng theo giá ở BT3.`));

k.push(h3("4.2.5. Độ nhạy theo phiên bản nhãn"));
const v1=LS.coef_v1;
k.push(p(`Vì ${n0(LS.n_changed)} dòng hàng trong mẫu BT2 đổi nhãn giữa bản nháp và bản đối soát (${LS.n_1to0} thắng → thua, ${LS.n_0to1} thua → thắng), và các thay đổi này tập trung theo độ sâu hàng đợi (Mục 3.1.2), mô hình được ước lượng lại trên nhãn trước đối soát với cùng đặc tả, cùng phân chia và cùng chuẩn hóa. Kết quả đầy đủ ở Bảng B.4; ba biến nhạy cảm được tóm tắt dưới đây.`));
k.push(fx([
`Cường độ cạnh tranh:  v1 ${fs_(v1.CompInt.beta_z,4)} (p = ${f(v1.CompInt.p,4)})   →   v3 ${fs_(gCI.beta_z,4)} (p ${pv(gCI.p)})`,
`Độ sâu hàng đợi Pricing:  v1 ${fs_(v1.Pricing_Queue_Depth.beta_z,4)} (p = ${f(v1.Pricing_Queue_Depth.p,4)})   →   v3 ${fs_(gQ.beta_z,4)} (p ${pv(gQ.p)})`,
`TAT dự báo (OOF):  v1 ${fs_(v1.TAT_pred.beta_z,4)} (p = ${f(v1.TAT_pred.p,4)})   →   v3 ${fs_(gTAT.beta_z,4)} (p = ${f(gTAT.p,4)})`,
`Chỉ số cạnh tranh giá:  v1 ${fs_(v1.Price_Competitiveness.beta_z,4)} (p < 0,0001)   →   v3 ${fs_(gPC.beta_z,4)} (p < 0,0001)`,
`AUC ngoài mẫu:  v1 ${f(LS.AUC_test_v1,4)}   →   v3 ${f(m2.AUC_test,4)}`]));
k.push(p([run("Đọc kết quả độ nhạy. ",{bold:true,color:C.DRED}),
  run(`Nhóm giá, năng lực nhà cung cấp và quan hệ khách hàng ổn định về dấu và ý nghĩa giữa hai phiên bản nhãn. Ngược lại, kết luận về cường độ cạnh tranh và nhóm năng lực xử lý phụ thuộc hoàn toàn vào việc đối soát: trên nhãn trước đối soát, hai biến hàng đợi và thời gian không có ý nghĩa ở mức 5% và TAT dự báo còn mang dấu dương. Nói cách khác, khoảng ${f(LS.n_changed/n2.items*100,1)}% số dòng hàng đổi nhãn đủ để đảo kết luận về kênh thời gian phản hồi. Luận văn vì vậy sử dụng nhãn đã đối soát làm cấu hình chính — vì đó là dữ liệu kết quả cuối kỳ — nhưng mọi suy luận dựa trên β_Queue và β_TAT (Mục 4.4, Chương 5) đều được phát biểu có điều kiện trên tính hợp lệ của quy trình đối soát, và mặt phẳng chuyển pha ở Mục 4.4.4 quét cả trường hợp k = 0, tức thế giới mà khách hàng không phạt phản hồi chậm.`,{})]));

/* ══════════════ 4.3 BT3 ══════════════ */
k.push(h2("4.3. Bài toán 3 — Tối ưu giá báo thầu"));
const dm=B3.dai_markup, hc=B3.hieu_chuan_tong_hop;
k.push(p(`Toàn bộ đánh giá trong mục này thực hiện trên tập kiểm tra ${n0(dm.n_test)} dòng hàng thuộc ${dm.n_test_proj} hồ sơ, tách theo cụm dự án và chưa từng được dùng để ước lượng mô hình xác suất thắng. Dải markup lịch sử trên tập huấn luyện có phân vị 5 bằng ${f(dm.P5,4)}, trung vị ${f(dm.median,4)} và phân vị 95 bằng ${f(dm.P95,4)}; dải [P5; P95] này là biên kẹp cho mọi chính sách ở dạng thực tế. Lợi nhuận được tính theo đơn vị dòng hàng, không nhân số lượng đặt hàng.`));

k.push(h3("4.3.1. Kiểm chứng điều kiện bậc nhất"));
const fc=FOC.kiem_chung;
k.push(mkTable(["Dòng hàng","c (USD)","T (USD)","p* dò lưới","p* từ FOC","Lệch (USD)","Markup","P(Win)"],
  fc.map((r,i)=>[String(i+1),f(r.c,2),f(r.T,2),f(r.p_grid,4),f(r.p_foc,4),f(r.lech,4),f(r.markup,4),f(r.Pwin,4)]),
  [900,1100,1100,1300,1300,1100,1100,1100]));
k.push(cap("Bảng 4.10: Nghiệm từ điều kiện bậc nhất khớp với dò lưới trên sáu dòng hàng đầu tiên"));
k.push(p(`Sai lệch tối đa giữa hai cách giải là ${f(Math.max(...fc.map(r=>r.lech)),4)} USD, ở mức sai số làm tròn của lưới. Đạo hàm bậc hai của hàm mục tiêu đổi dấu trên miền giá khảo sát, từ ${f(FOC.phi_tuyen.max_d2,4)} xuống ${f(FOC.phi_tuyen.min_d2,4)}: hàm lồi ở vùng giá thấp và lõm quanh cực đại. Hàm mục tiêu là phi tuyến theo giá, nghiệm tìm được là cực đại nội suy duy nhất trên miền, và việc dò lưới cho kết quả đúng. Trên toàn bộ ${n0(n2.items)} dòng hàng, nghiệm tối ưu không ràng buộc có markup trung vị ${f(B3.foc_full.median_mk,4)} và không dòng nào rơi vào biên của miền tìm kiếm.`));

k.push(h3("4.3.2. Số đối thủ hiệu dụng và ba đặc tả miền chi phí"));
const NC=B3.N_calib, EN=DA.EffN.crosstab;
const hiN=(4*EN.High["4"]+5*EN.High["5"])/(EN.High["4"]+EN.High["5"]);
k.push(mkTable(["Phương pháp","Cạnh tranh thấp","Trung bình","Cao","Ghi chú"],
  [["Mô-men trên mức markup",f(NC.MoM["1"],2),f(NC.MoM["2"],2),f(NC.MoM["3"],2),"Không phân biệt được ba tầng"],
   ["Nghịch đảo tỷ lệ thắng",f(NC["1/WinRate"]["1"],2),f(NC["1/WinRate"]["2"],2),f(NC["1/WinRate"]["3"],2),"Tầng thấp dưới 2 — phi lý với đấu thầu"],
   ["Ánh xạ chuyên gia","2","4","6","Không dựa trên dữ liệu"],
   ["Lai (hình dạng từ tỷ lệ thắng, neo tại 2)",f(NC.Lai["1"],2),f(NC.Lai["2"],2),f(NC.Lai["3"],2),"Dùng cho đặc tả A và B"],
   ["Số đối thủ thực tế từ CRM (bản v3)","2,00","3,00",f(hiN,2)+" (4 hoặc 5)","Dùng cho đặc tả C; ánh xạ một-một ở hai tầng dưới"]],
  [3000,1300,1200,1300,2200],[4]));
k.push(cap("Bảng 4.11: Số đối thủ hiệu dụng theo năm nguồn — bốn phương pháp hiệu chỉnh và số đối thủ thực tế từ CRM"));
k.push(p(`Bốn phương pháp hiệu chỉnh cho giá trị trải từ ${f(NC["1/WinRate"]["1"],2)} đến ${f(NC.MoM["1"],2)} cho cùng bộ dữ liệu; sự phân tán này cho thấy N không được nhận dạng từ dữ liệu giá và kết quả. Bản v3 bổ sung số đối thủ thực tế ghi nhận từ CRM. Trường này trùng với cận dưới hợp lý ở tầng thấp (2) và gần phương pháp lai ở tầng trung bình, nhưng ở tầng cao cho trung bình ${f(hiN,2)}, cao hơn phương pháp lai (${f(NC.Lai["3"],2)}).`));
k.push(p("Ba đặc tả miền chi phí được hiệu chỉnh như sau:"));
const ncC=B3.nashC;
k.push(fx([
`Đặc tả A:  c̄_i = P99 giá vốn trong nhóm vật liệu (tập huấn luyện);  N = N lai`,
`Đặc tả B:  c̄_i = c_i · (1 + δ),  δ = ${f(B3.delta_B,4)};  N = N lai`,
`Đặc tả C:  c̄_i = Market_Reserve_Bound_i,  δ_C,i = c̄_i / c_i − 1  (trung vị ${f(ncC.delta_C_median,3)});  N = N thực tế`,
``,
`Markup dạng đóng trung vị của đặc tả C theo N:  N=2: ${f(ncC.mk_by_N["2"],3)}   N=3: ${f(ncC.mk_by_N["3"],3)}   N=4: ${f(ncC.mk_by_N["4"],3)}   N=5: ${f(ncC.mk_by_N["5"],3)}`]));
k.push(p(`Điểm cần thấy ngay từ hiệu chỉnh: đặc tả B và đặc tả C cùng là dạng tỷ lệ theo giá vốn, nhưng khác nhau về MỨC của cận. Đặc tả B suy δ từ độ phân tán của giá mục tiêu quanh giá vốn và thu được δ = ${f(B3.delta_B,3)}; đặc tả C dùng cận dự trữ cấp dòng hàng, tương đương δ_C ≈ ${f(ncC.delta_C_median,2)} — lớn hơn khoảng ${f(ncC.delta_C_median/B3.delta_B,1)} lần. Cận dự trữ này phản ánh mức giá tối đa khách hàng còn chấp nhận khi tính cả vị thế phi giá và giá mục tiêu, chứ không chỉ độ phân tán chi phí giữa các nhà cung cấp. Đây là kênh qua đó lợi thế phi giá được nội sinh hóa vào đặc tả cân bằng.`));

k.push(h3("4.3.3. Giá bóng của năng lực xử lý"));
const lb=B3.logit_breach, la=B3.lambda;
k.push(fx([`P_breach(Q) = 1 / ( 1 + exp( −( ${f(lb.a0,4)} + ${f(lb.a1,4)} · Q ) ) )`,
  `Hệ số của Q có p = ${lb.p.toExponential(1).replace(".",",")} ;  tỷ lệ vi phạm mẫu ${pct(lb.breach_rate,2)}`,
  `π_SLA = 0,50 × biên lợi nhuận trung bình ${f(la.margin_item,2)} USD = ${f(0.5*la.margin_item,2)} USD / lần vi phạm`,
  `Quy về cấp dòng hàng: chia cho ${f(la.items_per_rfq,2)} dòng hàng mỗi hồ sơ`,
  `Bản trọng số SLA: λ_U = U · λ(Q);  U trung bình trên tập kiểm tra = ${f(la.U_mean_test,3)}`]));
k.push(mkTable(["Độ sâu hàng đợi Q","0","10","20","30 (trần)","Trung bình tập kiểm tra"],
  [["λ(Q) mỗi dòng hàng (USD)",f(la.lam_item_Q["0"],2),f(la.lam_item_Q["10"],2),f(la.lam_item_Q["20"],2),f(la.lam_item_Q["30"],2),f(la.lam_item_mean_test,2)],
   ["λ_U(Q) với U = 1,88 (USD)",f(1.88*la.lam_item_Q["0"],2),f(1.88*la.lam_item_Q["10"],2),f(1.88*la.lam_item_Q["20"],2),f(1.88*la.lam_item_Q["30"],2),f(la.lamU_mean_test,2)]],
  [2600,1100,1100,1100,1300,1800]));
k.push(cap("Bảng 4.12: Giá bóng của năng lực xử lý theo độ sâu hàng đợi, tại π_SLA bằng 0,50 lần biên lợi nhuận"));
k.push(p(`Giá bóng tăng đơn điệu theo độ sâu hàng đợi, từ ${f(la.lam_item_Q["0"],2)} USD khi hàng đợi trống lên ${f(la.lam_item_Q["30"],2)} USD tại trần. Giá trị trung bình trên tập kiểm tra là ${f(la.lam_item_mean_test,2)} USD mỗi dòng hàng — tương đương ${f(la.lam_item_mean_test/la.margin_item*100,1)}% biên lợi nhuận trung bình; bản trọng số SLA nâng mức này lên ${f(la.lamU_mean_test,2)} USD. Ở mức hiệu chỉnh này giá bóng nhỏ so với biên lợi nhuận, và độ lớn của nó là một tham số được quét ở Mục 4.3.7 và Mục 4.4.`));

k.push(h3("4.3.4. So sánh các chính sách giá"));
const P=B3.policies;
const ORD=["Thực tế (thực nhận)","Thực tế (kỳ vọng mô hình)","Cost-Plus (markup trung vị)","CBPO Realistic (kẹp P5–P95)","CBPO Optimistic (không kẹp)",
  "Nash A — miền tuyệt đối (kẹp)","Nash B — miền tỷ lệ (kẹp)","Nash C — cận dòng hàng, N thực tế (kẹp)","Nash C — dạng đóng thuần (không kẹp)",
  "Nash C + phản hồi logistic (±5% quanh neo)","CBPO + Capacity λ(Q)","Giả dược — λ hằng số","CBPO + Capacity λ(Q)·U (trọng số SLA)","Giả dược — λ hằng số (bản trọng số SLA)"];
const noClip=n=>n.includes("phản hồi logistic")||n.includes("Optimistic")||n.includes("Thực tế")||n.includes("Cost")||n.includes("thuần")||n.includes("Capacity")||n.includes("Giả dược");
k.push(mkTable(["Chính sách","Lợi nhuận kỳ vọng (USD)","Uplift","P(Win) trung bình","Tỷ lệ ngoài dải"],
  ORD.map(n=>[n,fk(P[n].profit,1),fp(P[n].uplift_pct,2),f(P[n].Pwin,3),noClip(n)?"—":pct(P[n].clip,1)]),
  [3500,1700,1100,1400,1300],[3,7,9]));
k.push(cap("Bảng 4.13: Lợi nhuận kỳ vọng của các chính sách giá trên cùng tập kiểm tra — ba đặc tả cân bằng A, B, C"));
k.push(p(`Kiểm tra hiệu chuẩn tổng hợp trước khi đọc bảng: tại chính mức giá lịch sử, mô hình dự báo lợi nhuận ${fk(hc.ky_vong_tai_gia_lich_su,1)} USD so với ${fk(hc.thuc_nhan,1)} USD thực nhận, lệch ${fp(hc.lech_pct,2)}. Mọi uplift dưới đây vì vậy có xu hướng lạc quan nhẹ ở mức tương tự.`));
k.push(img("FIG_4_5_Policies.png",640,0.367));
k.push(cap("Hình 4.5: (A) Uplift và tỷ lệ kẹp biên theo chính sách; (B) xác suất thắng trung bình"));
const cp=P["Cost-Plus (markup trung vị)"], cbp=P["CBPO Realistic (kẹp P5–P95)"], nA=P["Nash A — miền tuyệt đối (kẹp)"], nB=P["Nash B — miền tỷ lệ (kẹp)"],
      nCc=P["Nash C — cận dòng hàng, N thực tế (kẹp)"], nCf=P["Nash C — dạng đóng thuần (không kẹp)"], nCh=P["Nash C + phản hồi logistic (±5% quanh neo)"];
k.push(p([run("Cost-Plus. ",{bold:true}),run(`Quy tắc nhân giá vốn với hệ số markup trung vị cố định cho lợi nhuận kỳ vọng chênh ${fp(cp.uplift_pct,2)} so với thực nhận. Toàn bộ mức điều chỉnh mà đội định giá đang áp dụng chỉ tạo ra khác biệt dưới 1% so với một quy tắc không có bất kỳ sự tinh vi nào. Kết quả này lặp lại phát hiện ở mục 1.2.2 dưới dạng tiền.`,{})]));
k.push(p([run("CBPO Realistic. ",{bold:true,color:C.GREEN}),run(`Tối ưu giá theo xác suất thắng đã hiệu chuẩn, kẹp trong dải markup lịch sử, cho ${fp(cbp.uplift_pct,2)} với xác suất thắng trung bình giảm từ ${f(P["Thực tế (thực nhận)"].Pwin,3)} xuống ${f(cbp.Pwin,3)}. Tỷ lệ ${pct(cbp.clip,1)} ở cột cuối là tỷ lệ dòng hàng có nghiệm tối ưu không ràng buộc nằm ngoài dải — với các dòng này, chính sách chọn biên gần nhất. Phiên bản không kẹp cho ${fp(P["CBPO Optimistic (không kẹp)"].uplift_pct,2)} nhưng đòi hỏi ngoại suy ra ngoài vùng hành vi đã quan sát, nên không được dùng làm khuyến nghị.`,{})]));
k.push(p([run("Đặc tả A và B suy biến theo hai hướng ngược nhau. ",{bold:true,color:C.DRED}),
  run(`Đặc tả A với cận trên tuyệt đối theo nhóm hàng đẩy ${pct(nA.clip,1)} dòng hàng ra ngoài dải — trung vị markup đề xuất trước khi kẹp là ${f(nA.median_mk_unclipped,3)}, so với P95 lịch sử ${f(dm.P95,4)} — nên bị kẹp trần. Đặc tả B với cận trên tỷ lệ cố định đẩy ${pct(nB.clip,1)} dòng hàng xuống dưới sàn — trung vị ${f(nB.median_mk_unclipped,3)}, thấp hơn P5 lịch sử — và cho ${fp(nB.uplift_pct,2)}. Uplift ${fp(nA.uplift_pct,2)} của đặc tả A không phải sản phẩm của cơ chế cân bằng mà của cơ chế kẹp: khi ${pct(nA.clip,0)} khuyến nghị bị đưa về cùng một trần, chính sách suy biến thành quy tắc nâng giá đồng loạt. Thay N lai bằng N thực tế không cứu được hai đặc tả này: đặc tả A còn kẹp ${pct(B3.nashAB_EffN.A.clip,1)}, đặc tả B kẹp ${pct(B3.nashAB_EffN.B.clip,1)}. Thất bại nằm ở cách xác định cận trên, không ở số đối thủ.`,{})]));
k.push(p([run("Đặc tả C phục hồi tính nội suy. ",{bold:true,color:C.GREEN}),
  run(`Khi cận trên được định nghĩa ở cấp dòng hàng bằng giá dự trữ — tích hợp vị thế phi giá và giá mục tiêu — tỷ lệ kẹp biên giảm xuống ${pct(nCc.clip,1)}, ngang mức ${pct(cbp.clip,1)} của CBPO Realistic. Đặc tả C ở dạng kẹp cho uplift ${fp(nCc.uplift_pct,2)}; ở dạng đóng thuần túy, không kẹp, cho ${fp(nCf.uplift_pct,2)} với xác suất thắng ${f(nCf.Pwin,3)}; kết hợp hàm phản hồi logistic trong vùng ±5% quanh điểm neo cân bằng cho ${fp(nCh.uplift_pct,2)}. Đây là lần đầu trong luận văn một đặc tả cân bằng sinh ra phần lớn khuyến nghị nằm trong vùng hành vi quan sát và tạo uplift dương không do cơ chế kẹp quyết định.`,{})]));
k.push(p([run("Ba giới hạn của đặc tả C cần nêu cùng lúc. ",{bold:true}),
  run(`Thứ nhất, tỷ lệ kẹp không đồng đều theo N: ${pct(ncC.clip_by_N["2"],0)} dòng hàng ở cơ hội có 2 đối thủ bị kẹp trần (markup dạng đóng ${f(ncC.mk_by_N["2"],3)}), trong khi tỷ lệ này chỉ ${pct(ncC.clip_by_N["3"],0)}–${pct(ncC.clip_by_N["5"],0)} ở N ≥ 3. Công thức chỉ nội suy được khi có từ ba đối thủ trở lên. Thứ hai, đặc tả C vẫn thấp hơn CBPO Realistic ${f(cbp.uplift_pct-nCc.uplift_pct,2)} điểm phần trăm ở dạng kẹp và ${f(cbp.uplift_pct-nCh.uplift_pct,2)} điểm ở dạng lai: cân bằng thuần giá chưa khai thác hết thông tin phi giá mà hàm phản hồi logistic đã học. Thứ ba, như phân tích độ nhạy ở Mục 4.3.7 cho thấy, kết quả nhạy với mức N và mức cận dự trữ.`,{})]));

k.push(h3("4.3.5. Kiểm định giả thuyết H1 — đối chiếu hai mặt"));
const H=B3.H1_test, HE=B3.H1_EffN;
const hrow=(lab,r,concl)=>[lab,fs_(r.slope,4),f(r.SE_cluster,4),`[${f(r.CI[0],3)}; ${f(r.CI[1],3)}]`,pv(r.p_vs_0),pv(r.p_vs_minus1),concl];
const hc_=r=>r.p_vs_0>0.05?"Không bác bỏ b = 0":(r.p_vs_minus1>0.05?"Bác bỏ 0, không bác bỏ −1":"Bác bỏ cả 0 và −1");
k.push(mkTable(["Mô hình hồi quy theo ln(N)","b̂","SE cụm","KTC 95%","p (b = 0)","p (b = −1)","Kết luận"],
  [hrow("(1a) ln Markup lịch sử, N lai (kiểm định gốc)",H,hc_(H)),
   hrow("(1b) ln Markup lịch sử, N thực tế",HE.lich_su_lnMarkup,hc_(HE.lich_su_lnMarkup)),
   hrow("(1c) ln(Markup − 1) lịch sử, N thực tế",HE.lich_su_lnMargin,hc_(HE.lich_su_lnMargin)),
   hrow("(2a) ln(p*_FOC/c − 1), N thực tế",HE.FOC_lnMargin,hc_(HE.FOC_lnMargin)),
   hrow("(2b) ln(p*_C/c − 1), N thực tế — đồng nhất thức",HE.NashC_lnMargin,"≈ −1 theo định nghĩa")],
  [2700,900,850,1300,950,950,1350],[3]));
k.push(cap(`Bảng 4.14: Kiểm định H1 hai mặt — độ dốc log–log của biên giá theo số đối thủ, n = ${n0(H.n)} dòng hàng, sai số chuẩn cụm theo hồ sơ`));
k.push(p([run("Mặt (1) — hành vi lịch sử là cost-plus tĩnh. ",{bold:true}),
  run(`Hồi quy logarit markup lịch sử theo logarit số đối thủ cho độ dốc gần bằng không ở cả ba dạng: ${fs_(H.slope,4)} với N lai (p = ${f(H.p_vs_0,3)}), ${fs_(HE.lich_su_lnMarkup.slope,4)} với N thực tế (p = ${f(HE.lich_su_lnMarkup.p_vs_0,3)}), và ${fs_(HE.lich_su_lnMargin.slope,4)} khi dùng biên giá thay cho markup (p = ${f(HE.lich_su_lnMargin.p_vs_0,3)}). Không dạng nào bác bỏ được b = 0, và cả ba đều bác bỏ b = −1 với p < 0,0001. Lý thuyết cân bằng với chi phí phân phối đều dự đoán markup giảm ${f(H.BNE_du_doan_giam_pct,1)}% khi chuyển từ tầng cạnh tranh thấp sang cao; dữ liệu cho mức giảm thực tế gần bằng không. Chính sách lịch sử của doanh nghiệp là định giá cost-plus tĩnh, không phản ứng với cạnh tranh.`,{})]));
k.push(p([run("Mặt (2a) — mức giá tối ưu từ mô hình phản hồi có phản ứng với N, nhưng yếu hơn mức lý thuyết. ",{bold:true}),
  run(`Khi thay giá lịch sử bằng mức giá tối ưu giải từ điều kiện bậc nhất trên hàm phản hồi logistic của BT2, độ dốc trở thành ${fs_(HE.FOC_lnMargin.slope,4)} (SE ${f(HE.FOC_lnMargin.SE_cluster,4)}): bác bỏ b = 0 với p < 0,0001 — mức giá tối ưu giảm có hệ thống khi số đối thủ tăng, đúng chiều của Krishna (2009). Tuy nhiên độ dốc cũng bác bỏ b = −1: biên giá tối ưu chỉ phản ứng khoảng ${f(Math.abs(HE.FOC_lnMargin.slope)*100,0)}% so với độ co giãn mà nghiệm cân bằng đều dự đoán. Biên giá tối ưu trung vị giảm từ ${f((HE.median_by_N["2"].mk_foc-1)*100,1)}% ở N = 2 xuống ${f((HE.median_by_N["4"].mk_foc-1)*100,1)}% ở N = 4, rồi đi ngang ở N = 5 (${f((HE.median_by_N["5"].mk_foc-1)*100,1)}%). Phát biểu đúng mức: khung tối ưu theo xác suất thắng đã hiệu chuẩn tái tạo được chiều của quy luật 1/N nhưng không tái tạo được độ lớn của nó.`,{})]));
k.push(p([run("Mặt (2b) — đặc tả C chỉ là kiểm tra nhất quán. ",{bold:true}),
  run(`Hồi quy biên giá của đặc tả C theo ln N cho ${fs_(HE.NashC_lnMargin.slope,4)}, R² ${f(HE.NashC_lnMargin.R2,3)}. Theo phân rã ở mục 2.2.3, độ dốc này bằng −1 cộng thành phần ${fs_(HE.NashC_identity.cov_term,4)} do δ_C hơi tương quan âm với N; giá trị gần −1 là hệ quả của cách xây dựng, không phải bằng chứng thực nghiệm. Luận văn báo cáo dòng này để minh bạch chứ không tính nó vào kết luận kiểm định.`,{})]));
k.push(p([run("Kết luận kiểm định H1. ",{bold:true}),
  run(`Hệ quả so sánh tĩnh của H1 bị bác bỏ ở tầng hành vi (giá lịch sử không phản ứng với N) và chỉ được ủng hộ một phần về chiều ở tầng mô hình (giá tối ưu phản ứng với N nhưng với độ co giãn khoảng ${f(HE.FOC_lnMargin.slope,2)} thay vì −1). Về phần lợi nhuận của H1, đặc tả cân bằng C có uplift dương nhưng thấp hơn chính sách best-response CBPO; do đó phát biểu "chính sách cân bằng tạo lợi nhuận kỳ vọng cao hơn best-response" không được ủng hộ trên dữ liệu này.`,{})]));
k.push(img("FIG_4_6_H1_Placebo.png",640,0.367));
k.push(cap("Hình 4.6: (A) Kiểm định H1 hai mặt trên thang log — giá lịch sử phẳng, giá tối ưu dốc xuống, đặc tả C ∝ 1/N theo định nghĩa; (B) kiểm chứng giả dược tĩnh"));

k.push(h3("4.3.6. Kiểm chứng giả dược và giới hạn của đánh giá tĩnh"));
const pl=B3.placebo, SB=B3.static_breach;
k.push(p(`Chính sách CBPO có xét năng lực — cộng giá bóng λ(Q) vào giá vốn trước khi tối ưu — cho uplift ${fp(pl.cap_uplift,2)}, cao hơn CBPO không xét năng lực (${fp(cbp.uplift_pct,2)}). Nếu dừng ở đây, kết luận sẽ là thành phần năng lực tạo thêm ${f(pl.cap_uplift-cbp.uplift_pct,2)} điểm phần trăm lợi nhuận. Nhánh giả dược thay λ(Q) bằng hằng số ${f(la.lam_item_mean_test,2)} USD — đúng giá trị trung bình của λ(Q) trên tập kiểm tra — và cho ${fp(pl.placebo_uplift,2)}. Chênh lệch giữa chính sách động và giả dược là ${fs_(pl.dong_gop_dieu_tiet_pp,2)} điểm phần trăm.`));
k.push(p(`Phiên bản có trọng số nhạy cảm cam kết cho kết quả cùng dạng: CBPO + λ(Q)·U đạt ${fp(pl.capU_uplift,2)}, nhánh giả dược tương ứng đạt ${fp(pl.placeboU_uplift,2)}, chênh lệch ${fs_(pl.dong_gop_dieu_tiet_U_pp,2)} điểm phần trăm. Ở cả hai phiên bản, toàn bộ mức tăng so với CBPO đến từ việc nâng mặt bằng giá lên một lượng cố định; phần điều tiết theo trạng thái hàng đợi không đóng góp dương.`));
k.push(p([run("Kết luận kiểm định trên dữ liệu tĩnh: hệ quả của H2 ở dạng tín hiệu giá bị bác bỏ. ",{bold:true}),
  run(`Kết luận này cần được đặt đúng phạm vi. Trong đánh giá tĩnh một kỳ, quyết định giá được đưa ra SAU khi hồ sơ đã nằm trong hàng đợi, và không có vòng phản hồi giải phóng hàng đợi cho hồ sơ đến sau. Hệ quả là tỷ lệ vi phạm cam kết trên tập kiểm tra bằng đúng ${pct(SB.breach_rate_test,2)} dưới MỌI chính sách giá: không chính sách nào trong Bảng 4.13 chạm được vào chỉ tiêu thứ hai của hàm mục tiêu hai chiều đã đăng ký ở mục 3.6. Đánh giá tĩnh vì vậy tính đủ chi phí của thành phần năng lực nhưng không thể tính lợi ích của nó. Đồng thời, BT2 trên nhãn đã đối soát cho thấy hàng đợi và thời gian phản hồi có liên hệ âm với xác suất thắng — tức nếu một cơ chế rút ngắn được thời gian chờ thì lợi ích đó có kênh để chuyển thành lợi nhuận. Hai điểm này là lý do Mục 4.4 xây dựng nghiên cứu mô phỏng liên kỳ.`,{})]));

k.push(h3("4.3.7. Phân tích độ nhạy"));
const S=B3.sensitivity;
const sA0=S.N_scale.find(r=>r.uplift<0);
const sC=S.N_scale_C, sM=S.MRB_scale_C;
k.push(mkTable(["Tham số biến thiên","Phạm vi khảo sát","Kết quả","Nhận xét"],
  [["Số đối thủ N (đặc tả A)",`N tầng thấp từ ${f(S.N_scale[0].N_low,1)} đến ${f(S.N_scale[5].N_low,1)}`,
    `Uplift từ ${fp(S.N_scale[0].uplift,1)} xuống ${fp(S.N_scale[5].uplift,1)}; đổi dấu quanh N ≈ ${f(sA0.N_low-0.5,1)}`,"Kết luận về đặc tả A phụ thuộc hoàn toàn vào N"],
   ["Họ phân phối chi phí (đặc tả A)","Đều so với tam giác",`Đều ${fp(S.F_family.Uniform,2)}; tam giác ${fp(S.F_family.Triangular,2)}`,"Đổi dấu khi thay họ phân phối"],
   ["Số đối thủ N (đặc tả C)",`N thực tế × ${f(sC[0].factor,2)} đến × ${f(sC[sC.length-1].factor,1)}`,
    `Kẹp: ${fp(sC[0].uplift,1)} → ${fp(sC[2].uplift,1)} → ${fp(sC[sC.length-1].uplift,1)}; tỷ lệ kẹp ${pct(sC[0].clip,0)} → ${pct(sC[2].clip,0)} → ${pct(sC[sC.length-1].clip,0)}`,"Đổi dấu khi N tăng 50%; nội suy tốt nhất quanh N thực tế"],
   ["Mức cận dự trữ (đặc tả C)",`Market_Reserve_Bound × ${f(sM[0].factor,1)} đến × ${f(sM[sM.length-1].factor,1)}`,
    `Kẹp: ${fp(sM[0].uplift,1)} → ${fp(sM[sM.length-1].uplift,1)}; dạng đóng thuần: ${fp(sM[0].uplift_free,1)} → ${fp(sM[2].uplift_free,1)} → ${fp(sM[sM.length-1].uplift_free,1)}`,"Dương trên toàn dải; cực đại dạng thuần gần mức quan sát"],
   ["Chi phí vi phạm SLA π (λ chuẩn)","0,25 đến 5,3 lần biên lợi nhuận",`CBPO + λ(Q) từ ${fp(S.pi_SLA[0].cap_uplift,1)} đến ${fp(S.pi_SLA[4].cap_uplift,1)}; giả dược luôn ≥`,"Điều tiết theo Q không đóng góp ở bất kỳ mức π nào"],
   ["Chi phí vi phạm SLA π (λ·U)","0,25 đến 5,0 lần biên lợi nhuận",`CBPO + λ(Q)·U từ ${fp(S.pi_SLA_U[0].cap_uplift,1)} đến ${fp(S.pi_SLA_U[4].cap_uplift,1)}; giả dược luôn ≥`,"Trọng số SLA không thay đổi kết luận tĩnh"],
   ["CBPO không xét năng lực","Không phụ thuộc N, F, cận dự trữ hay π",fp(cbp.uplift_pct,2),"Kết quả bền vững nhất"]],
  [2200,2300,2900,1600],[2,3,6]));
k.push(cap("Bảng 4.15: Tổng hợp phân tích độ nhạy của các chính sách giá trên dữ liệu tĩnh"));
k.push(img("FIG_4_7_Sensitivity.png",640,0.367));
k.push(cap("Hình 4.7: (A) Uplift của đặc tả A và C theo hệ số nhân N; (B) uplift theo π_SLA — chính sách động không vượt giả dược trên dữ liệu tĩnh"));
k.push(p(`Phân tích độ nhạy phân định rõ ba loại kết quả. Đặc tả A đảo dấu khi N tại tầng thấp vượt khoảng ${f(sA0.N_low-0.5,1)} và khi thay phân phối đều bằng phân phối tam giác — nó không có giá trị khuyến nghị. Đặc tả C ổn định hơn nhiều theo mức cận dự trữ (dương trên toàn dải ±20%), nhưng vẫn nhạy với N: tăng N thêm 50% làm uplift về ${fp(sC[3].uplift,1)}. Kết quả của chính sách có xét năng lực thay đổi theo π nhưng luôn bám sát hoặc thấp hơn giả dược. Chỉ CBPO không xét năng lực cho kết quả không phụ thuộc vào tham số nào không nhận dạng được.`));

/* ══════════════ 4.4 MO PHONG ══════════════ */
k.push(...require("./ch04_44.js")(L));

/* ══════════════ 4.5 TONG HOP ══════════════ */
const SIM=J("ch4_sim.json"); const SM=SIM.main.C1["1.0"], SM2=SIM.main.C2["1.0"]; const POL=SIM.meta.policies;
k.push(h2("4.5. Tổng hợp kết quả ba bài toán và nghiên cứu mô phỏng"));
k.push(mkTable(["Bài toán","Câu hỏi nghiên cứu","Kết quả chính","Trạng thái"],
  [["BT1","Biến động thời gian phân bố thế nào giữa bốn khâu?",`Không đồng nhất; Sales biến động tương đối cao nhất; ${f(pr["hiep_phuong_sai_%"],1)}% phương sai tổng là hiệp phương sai; Pricing độc lập với Sales. Log-transform bị bác bỏ; chọn thang gốc + HC3; xuất TAT_pred OOF`,"Trả lời được"],
   ["BT2","Yếu tố nào quyết định xác suất thắng?",`AUC ngoài mẫu ${f(m2.AUC_test,3)}; giá, năng lực NCC, quan hệ KH chi phối; trên nhãn đối soát, cạnh tranh (${fs_(gCI.beta_z,3)}), hàng đợi (${fs_(gQ.beta_z,3)}) và TAT_pred (${fs_(gTAT.beta_z,3)}) âm, có ý nghĩa 1% — nhạy với phiên bản nhãn`,"Trả lời được, có điều kiện"],
   ["BT3 — H1","Giá cân bằng có tốt hơn best-response?",`Lịch sử: b = ${fs_(HE.lich_su_lnMarkup.slope,4)} (cost-plus). FOC: b = ${fs_(HE.FOC_lnMargin.slope,3)}. A, B kẹp ${pct(nA.clip,0)} / ${pct(nB.clip,0)}; C kẹp ${pct(nCc.clip,0)}, uplift ${fp(nCc.uplift_pct,1)} < CBPO`,"Bác bỏ (C phục hồi tính nội suy)"],
   ["BT3 — H2 tĩnh","Giá bóng làm tín hiệu giá có tạo giá trị?",`Giả dược: λ(Q) ${fs_(pl.dong_gop_dieu_tiet_pp,2)} pp; λ(Q)·U ${fs_(pl.dong_gop_dieu_tiet_U_pp,2)} pp; vi phạm SLA không đổi`,"Bác bỏ"],
   ["Mục 4.4 — H2 liên kỳ","Giá bóng làm tiêu chí phân luồng có tạo giá trị?",`P4 − P3: ${fs_(SM.compare.P4_vs_P3.mean_pp,2)} pp (C1), ${fs_(SM2.compare.P4_vs_P3.mean_pp,2)} pp (C2); vi phạm ${pct(SM.policies[POL[0]].breach,1)} → ${pct(SM.policies[POL[3]].breach,1)} (C1), ${pct(SM2.policies[POL[3]].breach,1)} (C2); giá trị đến từ phân luồng, không từ λ trong giá`,"Ủng hộ có điều kiện (mô phỏng)"],
   ["BT3 — CBPO","Mức giá tối ưu theo xác suất thắng?",`${fp(cbp.uplift_pct,2)} kỳ vọng, bền vững qua mọi độ nhạy; cần A/B để xác nhận`,"Kết quả dương bền vững nhất"]],
  [1250,2300,4150,1300],[4,5]));
k.push(cap("Bảng 4.21: Tổng hợp kết quả và trạng thái của ba bài toán và nghiên cứu mô phỏng"));
k.push(p("Các kết quả không rời rạc mà khớp vào nhau. BT1 cho thấy hàng đợi Pricing vận hành độc lập với đầu chuỗi và là nút thắt thời gian; BT2 trên nhãn đã đối soát cho thấy hàng đợi và thời gian phản hồi đi kèm xác suất thắng thấp hơn; BT3 cho thấy giá bóng gắn vào giá chào không tạo giá trị vì giá được quyết định sau khi việc đã phát sinh; và mô phỏng liên kỳ cho thấy cùng một giá bóng, khi dùng để quyết định THỨ TỰ xử lý tại pha Sales-WBS, tạo ra giá trị vượt nhánh nâng giá đồng loạt. Kết luận hợp nhất: giá chào là đòn bẩy cho biên lợi nhuận, còn điều phối tiếp nhận là đòn bẩy cho năng lực — và hai đòn bẩy cần được đồng bộ chứ không thay thế cho nhau. Chương 5 biện luận nguyên nhân."));

/* ══════════════ 4.6 A/B ══════════════ */
k.push(h2("4.6. Tham số thiết kế thực nghiệm kiểm chứng"));
const A=B3.ab_design, A3=A.three_arm;
k.push(p([run(`Áp dụng thiết kế ở mục 3.6 với tham số ước lượng từ dữ liệu. Hệ số tương quan nội cụm của lợi nhuận thực nhận theo hồ sơ là ${f(A.ICC,4)}`,{}),fn("Tương quan nội cụm được tính bằng phân tích phương sai một chiều theo hồ sơ. Giá trị thay đổi theo đại lượng được đo (Bảng B.2), nên thiết kế dùng ICC của đúng chỉ tiêu tương ứng: lợi nhuận cho chỉ tiêu chính, chỉ báo thắng thua cho chỉ tiêu bảo vệ."),run(`; với trung bình ${f(A.m_bar,2)} dòng hàng mỗi hồ sơ, hiệu ứng thiết kế bằng ${f(A.DEFF,3)}. ICC của chỉ báo thắng thua là ${f(A.ICC_win,4)} (DEFF ${f(A.DEFF_win,3)}). Độ lệch chuẩn lợi nhuận mỗi dòng hàng là ${f(A.sigma_profit_item,2)} USD quanh trung bình ${f(A.mean_profit_item,2)} USD. Nhịp tiếp nhận ${f(A.proj_per_month,1)} hồ sơ mỗi tháng.`,{})]));
k.push(mkTable(["Chỉ tiêu và hiệu ứng cần phát hiện","Hồ sơ mỗi nhánh (2 nhánh)","Tháng (2 nhánh)","Hồ sơ mỗi nhánh (3 nhánh)","Tháng (3 nhánh)"],
  [["Lợi nhuận, uplift 14% (mức CBPO)",fk(A.uplift_14pct.n_proj_per_arm,0),f(A.uplift_14pct.months,1),fk(A3.uplift_14pct.n_proj_per_arm,0),f(A3.uplift_14pct.months,1)],
   ["Lợi nhuận, uplift 10% / 8%",f(A.uplift_10pct.n_proj_per_arm,0)+" (10%)",f(A.uplift_10pct.months,1),f(A3.uplift_8pct.n_proj_per_arm,0)+" (8%)",f(A3.uplift_8pct.months,1)],
   ["Lợi nhuận, uplift 5%",fk(A.uplift_5pct.n_proj_per_arm,0),f(A.uplift_5pct.months,1),fk(A3.uplift_5pct.n_proj_per_arm,0),f(A3.uplift_5pct.months,1)],
   ["Bảo vệ tỷ lệ thắng, biên 5 điểm %",f(A.guard_wr_5pp.n_proj_per_arm,0),f(A.guard_wr_5pp.months,1),f(A3.guard_wr_5pp.n_proj_per_arm,0),f(A3.guard_wr_5pp.months,1)],
   ["Bảo vệ tỷ lệ thắng, biên 3 điểm %",fk(A.guard_wr_3pp.n_proj_per_arm,0),f(A.guard_wr_3pp.months,1),fk(A3.guard_wr_3pp.n_proj_per_arm,0),f(A3.guard_wr_3pp.months,1)]],
  [3000,1600,1300,1700,1400],[0,3]));
k.push(cap("Bảng 4.22: Cỡ mẫu và thời gian chạy yêu cầu, α = 0,05 (Bonferroni α/2 cho ba nhánh), công suất 0,80"));
k.push(p(`Thiết kế hai nhánh phát hiện được uplift ${fp(cbp.uplift_pct,0)} của CBPO với khoảng ${f(A.uplift_14pct.n_proj_per_arm,0)} hồ sơ mỗi nhánh, tương đương ${f(A.uplift_14pct.months,1)} tháng vận hành. Thiết kế ba nhánh — đối chứng, can thiệp và giả dược nâng giá đều — cần ${f(A3.uplift_14pct.n_proj_per_arm,0)} hồ sơ mỗi nhánh và ${f(A3.uplift_14pct.months,1)} tháng cho cùng hiệu ứng, do chia nhịp tiếp nhận cho ba nhánh và hiệu chỉnh Bonferroni. Ràng buộc thời gian thực sự nằm ở chỉ tiêu bảo vệ: để khẳng định tỷ lệ thắng không giảm quá 5 điểm phần trăm, thiết kế ba nhánh cần ${f(A3.guard_wr_5pp.months,1)} tháng. Hệ số tương quan nội cụm ${f(A.ICC,3)} làm mỗi dòng hàng chỉ mang khoảng ${f(1/A.DEFF*100,0)}% lượng thông tin so với khi các dòng hàng độc lập. Hệ quả thực tiễn: nhánh giả dược là bắt buộc về mặt phương pháp nhưng đắt về thời gian, nên chạy thiết kế ba nhánh với biên bảo vệ 5 điểm phần trăm và đánh giá giữa kỳ theo quy tắc dừng đăng ký trước.`));
return k;
};
