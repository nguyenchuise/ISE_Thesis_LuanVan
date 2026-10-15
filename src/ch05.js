// CHUONG 5 — THAO LUAN  (v3, so lieu tu JSON)
module.exports=function(L){
const {C,run,p,h1,h2,h3,cap,fx,mkTable,fn}=L;
const fs=require("fs"); const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const B1=J("bt1_pertask.json"),B1M=J("bt1_models.json"),B12=J("ch4_bt12.json"),B3=J("ch4_bt3.json"),TR=J("ch5_triage.json"),
      SIM=J("ch4_sim.json"),DA=J("data_audit.json"),AX=J("ch4_icc_appx.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−");
const fs_=(x,d=2)=>(x>=0?"+":"")+f(x,d);
const fp=(x,d=2)=>fs_(x,d)+"%"; const pct=(x,d=1)=>f(x*100,d)+"%";
const P=B3.policies, H=B3.H1_test, HE=B3.H1_EffN, pl=B3.placebo, m2=B12.bt2_metrics, la=B3.lambda, dm=B3.dai_markup, LS=B12.bt2_label_sens;
const ab=B12.bt2_ablation, AB=n=>ab.find(r=>r.loai_nhom===n);
const nA=P["Nash A — miền tuyệt đối (kẹp)"], nB=P["Nash B — miền tỷ lệ (kẹp)"], cb=P["CBPO Realistic (kẹp P5–P95)"],
      nC=P["Nash C — cận dòng hàng, N thực tế (kẹp)"], nCf=P["Nash C — dạng đóng thuần (không kẹp)"], nCh=P["Nash C + phản hồi logistic (±5% quanh neo)"];
const tq=B1M.tuong_quan, g=b=>B12.bt2_coef.find(r=>r.bien===b), wr=(()=>{const S1=JSON.parse(require("fs").readFileSync("ch1_stats.json","utf8")).phan_ung_canh_tranh;return {"1":S1.Low.win,"2":S1.Med.win,"3":S1.High.win};})(), NC=B3.nashC;
const POL=SIM.meta.policies, M1=SIM.main.C1["1.0"], M2=SIM.main.C2["1.0"], G1=SIM.phase.grid.C1;
const cell=(kb,pm)=>G1.find(r=>r.k_beta===kb&&r.pi_mult===pm);
const k=[];

k.push(h1("CHƯƠNG 5. THẢO LUẬN"));
k.push(h2("5.1. Khung biện luận ba trụ cột"));
k.push(p("Chương 4 đưa tới một bức tranh có cả kết quả âm lẫn kết quả dương, và giá trị của chương này nằm ở việc giải thích vì sao chúng cùng đúng. Ở tầng cân bằng, hai đặc tả thuần giá A và B suy biến, nhưng đặc tả C — khi nội sinh hóa cận dự trữ cấp dòng hàng — phục hồi tính nội suy. Ở tầng năng lực, giá bóng gắn vào giá chào không tạo giá trị trên dữ liệu tĩnh, nhưng cùng giá bóng đó, dùng làm tiêu chí phân luồng tại pha Sales-WBS, tạo giá trị trong mô phỏng liên kỳ. Ba trụ cột dưới đây biện luận ba cặp kết quả này; mỗi trụ cột được chống đỡ bởi bằng chứng từ nhiều hơn một bài toán."));
k.push(mkTable(["Trụ cột","Câu hỏi biện luận","Bằng chứng chính","Kết luận"],
  [["I — Từ BNE thuần giá đến BNE có vị thế phi giá","Vì sao A, B thất bại còn C phục hồi?",
    `A, B kẹp ${pct(nA.clip,0)} / ${pct(nB.clip,0)}; C kẹp ${pct(nC.clip,0)} ≈ CBPO ${pct(cb.clip,0)}; δ_C ≈ ${f(NC.delta_C_median,2)} so với δ_B = ${f(B3.delta_B,2)}; tỷ lệ thắng ${pct(wr["1"],0)} > 1/N`,"Lợi thế phi giá phải được nội sinh hóa vào miền chi phí"],
   ["II — Hội tụ của ba bài toán và mô phỏng","Vì sao giá không giải phóng hàng đợi, còn phân luồng thì có?",
    `Pricing độc lập với Sales (r = ${f(tq.Sales_Days.Pricing_Days,3)}); β_Queue = ${f(g("Pricing_Queue_Depth").beta_z,3)}, β_TAT = ${f(g("TAT_pred").beta_z,3)}; giả dược tĩnh ${fs_(pl.dong_gop_dieu_tiet_pp,2)} pp; mô phỏng P4 − P3 = ${fs_(M1.compare.P4_vs_P3.mean_pp,2)} đến ${fs_(M2.compare.P4_vs_P3.mean_pp,2)} pp`,"Giá bóng là quy tắc điều phối tiếp nhận, không phải quy tắc giá"],
   ["III — Dị chất B2B, ngưỡng π_SLA và kỷ luật kiểm chứng","Kết luận có điều kiện trên những gì?",
    `Giá vốn trải gần 40 lần; δ_C ổn định nhưng N=2 kẹp ${pct(NC.clip_by_N["2"],0)}; mặt phẳng chuyển pha; ICC ${f(B3.ab_design.ICC,3)}, DEFF ${f(B3.ab_design.DEFF,2)}`,"Mọi khuyến nghị phải qua giả dược và thực nghiệm phân cụm"]],
  [1900,2000,3500,1600]));
k.push(cap("Bảng 5.1: Ba trụ cột biện luận cho các kết quả của Chương 4"));

/* ═══ 5.2 ═══ */
k.push(h2("5.2. Trụ cột I — Từ thất bại của BNE thuần giá đến sự phục hồi khi nội sinh hóa cận dự trữ và lợi thế phi giá"));
k.push(h3("5.2.1. Ba triệu chứng của cạnh tranh không thuần giá"));
k.push(p(`Ba mảnh bằng chứng độc lập cùng chỉ về một nguyên nhân. Thứ nhất, doanh nghiệp thắng ${pct(wr["1"],1)} số dòng hàng ở tầng cạnh tranh thấp và ${pct(wr["3"],1)} ở tầng cao, trong khi một nhà thầu đối xứng trong cân bằng chỉ thắng với xác suất 1/N — tối đa 50% khi N = 2, và số đối thủ thực tế từ CRM ở tầng thấp đúng bằng 2. Thứ hai, ablation ở mục 4.2.3 cho thấy khi loại toàn bộ biến giá, mô hình vẫn đạt AUC ${f(AB("Giá").AUC_test,4)}. Thứ ba, hành vi định giá lịch sử không phản ứng với số đối thủ: độ dốc ${fs_(HE.lich_su_lnMarkup.slope,4)} (p = ${f(HE.lich_su_lnMarkup.p_vs_0,3)}).`));
k.push(p("Ba hiện tượng này là ba triệu chứng của cùng một sai lệch đặc tả: mô hình đấu thầu thuần giá giả định cuộc thầu được quyết định hoàn toàn bằng giá, trong khi dữ liệu cho thấy một phần đáng kể quyết định mua đến từ điểm chất lượng nhà cung cấp, tồn kho cam kết giao, chứng nhận PPAP, nhà cung cấp trong nước và quan hệ hiện hữu. Khi mô hình không biết đến lợi thế phi giá, nó buộc phải quy toàn bộ tỷ lệ thắng cao vào quyền lực định giá."));
k.push(h3("5.2.2. Vì sao đặc tả A và B thất bại theo hai hướng đối xứng"));
k.push(p(`Đặc tả A đặt cận trên tuyệt đối theo nhóm vật liệu, nên với dòng hàng giá vốn thấp trong một nhóm có đuôi dài, khoảng cách tới cận rất lớn và markup đề xuất vượt trần (${pct(nA.clip,0)} bị kẹp, trung vị trước kẹp ${f(nA.median_mk_unclipped,3)}). Đặc tả B đặt cận tỷ lệ với δ suy từ độ phân tán chi phí giữa các nhà cung cấp (${f(B3.delta_B,3)}), nên biên giá cân bằng chỉ còn δ/N — quá nhỏ — và mọi khuyến nghị rơi dưới sàn. Cả hai cùng sai ở một điểm: chúng đo miền chi phí của ĐỐI THỦ, trong khi mức giá mà doanh nghiệp đạt được trong thực tế phản ánh mức giá mà KHÁCH HÀNG chấp nhận khi đã tính lợi thế phi giá. Thay N lai bằng N thực tế không cứu được A và B (kẹp ${pct(B3.nashAB_EffN.A.clip,0)} và ${pct(B3.nashAB_EffN.B.clip,0)}), xác nhận rằng vấn đề nằm ở cận trên chứ không ở số đối thủ.`));
k.push(h3("5.2.3. Đặc tả C: phục hồi tính nội suy và cái giá phải trả"));
k.push(p(`Đặc tả C thay cận trên bằng giá dự trữ cấp dòng hàng — Market_Reserve_Bound — là đại lượng tích hợp giá mục tiêu và vị thế phi giá. Kết quả là tỷ lệ kẹp giảm xuống ${pct(nC.clip,1)}, ngang CBPO, và uplift ${fp(nC.uplift_pct,2)} ở dạng kẹp, ${fp(nCf.uplift_pct,2)} ở dạng đóng thuần túy, ${fp(nCh.uplift_pct,2)} khi kết hợp hàm phản hồi logistic. Về mặt diễn giải, đây là bước chuyển từ "cân bằng trên chi phí của đối thủ" sang "cân bằng trên mức sẵn lòng trả của khách hàng có điều chỉnh theo lợi thế phi giá" — gần với tinh thần của đấu giá chấm điểm (Che, 1993) hơn là đấu thầu thuần giá, dù luận văn không ước lượng hàm điểm.`));
k.push(p([run("Cần phát biểu đúng mức về sự phục hồi này, vì ba lý do. ",{bold:true,color:C.DRED}),
  run(`Thứ nhất, về cấu trúc, đặc tả C là một đặc tả tỷ lệ với δ_C,i = Market_Reserve_Bound_i / c_i − 1, trung vị ${f(NC.delta_C_median,3)}, và tỷ số này rất ổn định (hệ số biến thiên ${f(DA.MRB.ratio_c_cv*100,1)}%); nói cách khác, sự khác biệt quyết định giữa B và C là MỨC của δ, lớn hơn khoảng ${f(NC.delta_C_median/B3.delta_B,1)} lần. Thành công của C vì vậy là bằng chứng rằng cận trên phải được hiệu chỉnh từ phía cầu, chứ chưa phải bằng chứng rằng cơ chế cân bằng chi phối hành vi thị trường. Thứ hai, công thức chỉ nội suy được khi N ≥ 3: với N = 2, ${pct(NC.clip_by_N["2"],0)} khuyến nghị vẫn bị kẹp trần. Thứ ba, ngay cả ở dạng tốt nhất, C vẫn thấp hơn CBPO; và quy luật 1/N chỉ xuất hiện trong giá do mô hình sinh ra (độ dốc FOC ${fs_(HE.FOC_lnMargin.slope,3)}) chứ không trong hành vi quan sát. Kết luận của trụ cột I: lý thuyết Krishna (2009) không sai, nhưng phép ánh xạ sang bối cảnh B2B chỉ khả thi khi miền chi phí được định nghĩa ở cấp dòng hàng và chứa thông tin phi giá.`,{})]));

/* ═══ 5.3 ═══ */
k.push(h2("5.3. Trụ cột II — Sự hội tụ của ba bài toán và mô phỏng: giá bóng là quy tắc điều phối, không phải quy tắc giá"));
k.push(h3("5.3.1. Vì sao hàng đợi và thời gian phản hồi làm giảm xác suất thắng"));
k.push(p(`Trên nhãn đã đối soát, BT2 cho β_Queue = ${f(g("Pricing_Queue_Depth").beta_z,4)} và β_TAT = ${f(g("TAT_pred").beta_z,4)}, cả hai có ý nghĩa ở mức 1%. Cơ chế kinh tế hợp lý: trong cạnh tranh B2B lặp lại, báo giá đến muộn bị so với báo giá của đối thủ đã đến trước, khách hàng đã có điểm neo giá và đôi khi đã chốt. Thời gian phản hồi vì vậy là một thuộc tính phi giá của báo giá, cùng loại với tồn kho cam kết giao hay chứng nhận — và nó nối trực tiếp trụ cột II với trụ cột I.`));
k.push(p(`Tuy vậy, cần nhắc lại điều kiện đã nêu ở Mục 4.2.5: trên nhãn trước đối soát, hai hệ số này không có ý nghĩa và TAT dự báo còn mang dấu dương; ${LS.n_changed} dòng hàng đổi nhãn, tập trung theo độ sâu hàng đợi, đủ để đảo kết luận. Vì vậy luận văn phát biểu: dữ liệu đã đối soát ỦNG HỘ kênh thời gian phản hồi; độ tin cậy của phát biểu này gắn với độ tin cậy của quy trình đối soát, và chỉ thực nghiệm mới nhận dạng được hiệu ứng nhân quả.`));
k.push(h3("5.3.2. Vì sao chỉ tăng giá ở cuối quy trình không giải phóng được hàng đợi"));
k.push(p("Giả thuyết H2 ở dạng tín hiệu giá dựa trên một kênh tác động ngầm: chào giá cao hơn khi hàng đợi sâu sẽ làm giảm số hồ sơ thắng, qua đó giảm tải cho đội định giá. Kênh này không tồn tại trong quy trình thực. Công việc định giá phát sinh khi hồ sơ được đưa vào hàng đợi và được xử lý — bất kể sau đó thắng hay thua; quyết định về giá diễn ra sau khi hồ sơ đã vào hàng đợi. Nâng giá không làm giảm khối lượng việc đã phát sinh; nó chỉ làm giảm xác suất thắng."));
k.push(mkTable(["Nguồn","Bằng chứng","Ý nghĩa đối với kênh tác động"],
  [["BT1 — mục 4.1.4",`Pricing gần như không tương quan với Sales (r = ${f(tq.Sales_Days.Pricing_Days,3)}), trong khi WBS–SC tương quan ${f(tq.WBS_Days.SC_Days,3)}`,"Hàng đợi Pricing được quyết định bởi tồn đọng của chính nó; nó là một nút thắt riêng có thể điều phối"],
   ["BT2 — mục 4.2.1, 4.2.5",`β_Queue = ${f(g("Pricing_Queue_Depth").beta_z,3)}, β_TAT = ${f(g("TAT_pred").beta_z,3)} trên nhãn đối soát; nhóm năng lực xử lý đóng góp ${f(AB("Năng lực xử lý").delta_AUC,4)} AUC`,"Rút ngắn thời gian chờ có kênh để chuyển thành xác suất thắng (có điều kiện trên nhãn)"],
   ["BT3 — mục 4.3.6",`Giả dược tĩnh: λ(Q) ${fs_(pl.dong_gop_dieu_tiet_pp,2)} pp, λ(Q)·U ${fs_(pl.dong_gop_dieu_tiet_U_pp,2)} pp; vi phạm SLA không đổi dưới mọi chính sách giá`,"Giá bóng gắn vào giá không chạm được vào hàng đợi"],
   ["Mô phỏng — mục 4.4.2",`P6 − P3 (λ động chỉ trong giá) = ${fs_(M1.compare.P6_vs_P3.mean_pp,2)} pp; P5 − P2 (chỉ phân luồng) = ${fs_(M1.compare.P5_vs_P2.mean_pp,2)} pp (C1)`,"Giá trị đến từ thứ tự tiếp nhận, không từ mức giá"]],
  [1700,3900,3400]));
k.push(cap("Bảng 5.2: Bốn bằng chứng hội tụ — giá chào không phải đòn bẩy cho năng lực, phân luồng tiếp nhận mới là đòn bẩy"));
k.push(h3("5.3.3. Vì sao phải đồng bộ giá bóng với bộ lọc phân luồng tại pha Sales-WBS"));
k.push(p(`Đây đúng là bản chất của bid-price control ở Talluri và van Ryzin (2004): giá bóng là ngưỡng cho quyết định tiếp nhận một yêu cầu tiêu thụ tài nguyên khan hiếm, không phải một cấu phần của giá bán. Mô phỏng ở Mục 4.4 bổ sung hai điều mà lý thuyết gốc không nói. Thứ nhất, vị trí đặt quyết định: bộ lọc phải nằm ở pha Sales-WBS, trước khi hồ sơ vào hàng đợi Pricing — vì sau đó, như BT3 cho thấy, không còn đòn bẩy nào chạm được vào thời gian chờ. Thứ hai, dạng của quy tắc: trong quy trình báo giá, doanh nghiệp hiếm khi từ chối báo giá, nên hành động thực tế là HOÃN chứ không phải TỪ CHỐI. Áp nguyên văn ngưỡng giá bóng cho quyết định hoãn (biến thể G1) chỉ hiệu quả ở π_SLA thấp và mất hiệu quả khi π_SLA tăng (${fs_(SIM.main.C1["2.0"].compare.P7_vs_P3.mean_pp,2)} pp ở π = 2, C1), vì hồ sơ bị hoãn vẫn phải gánh vi phạm. Quy tắc G2 — chỉ số ưu tiên dạng ATC với trọng số λ_U(Q) — khắc phục điều này và vượt giả dược ở mọi mức π trong bảng kết quả chính.`));
k.push(p(`Sự đồng bộ có nghĩa là mỗi đòn bẩy làm đúng việc của nó: bộ lọc phân luồng quyết định thứ tự và mức ưu tiên dựa trên giá bóng và độ nhạy cam kết; khung định giá theo xác suất thắng quyết định mức giá trên hồ sơ đã được xếp lịch. Phân rã P4 − P3 thành phần phân luồng (≈ P5 − P2) và phần λ động trong giá (≈ P6 − P3) cho thấy toàn bộ giá trị ròng của cơ chế đến từ phần thứ nhất.`));
k.push(h3("5.3.4. Độ lớn của giá bóng và ngưỡng hòa vốn"));
k.push(mkTable(["Đại lượng","Giá trị","Ghi chú"],
  [["Lợi nhuận kỳ vọng trung vị mỗi hồ sơ",`${f(TR.E_profit_median_rfq,1)} USD`,"Theo chính sách CBPO trên tập kiểm tra"],
   [`Giá bóng mỗi hồ sơ tại Q trung vị = ${f(TR.Q_median,0)}`,`${f(TR.lam_rfq_median,2)} USD`,`Bằng ${f(TR.lam_over_E_pct,1)}% lợi nhuận hồ sơ trung vị`],
   ["Số hồ sơ có lợi nhuận kỳ vọng dưới giá bóng",`${TR.n_below} / ${TR.n_rfq_test} = ${f(TR.pct_below,1)}%`,"Ứng viên từ chối nếu dùng bid-price thuần"],
   ["Phần lợi nhuận / khối lượng của nhóm đó",`${f(TR.profit_share_below_pct,2)}% / ${f(TR.items_share_below_pct,2)}%`,"Từ chối không giải phóng đáng kể năng lực"],
   ["π_SLA hòa vốn để giá bóng ngang lợi nhuận hồ sơ trung vị",`${f(TR.pi_breakeven_USD,0)} USD ≈ ${f(TR.pi_breakeven_x_margin,1)} × biên`,"Cần số liệu kế toán xác nhận"]],
  [3600,2400,3000]));
k.push(cap("Bảng 5.3: Độ lớn của giá bóng — đủ để xếp thứ tự, chưa đủ để từ chối"));
k.push(p(`Bảng 5.3 giải thích vì sao luận văn khuyến nghị phân luồng chứ không khuyến nghị từ chối: ở mức hiệu chỉnh hiện tại, giá bóng chỉ bằng ${f(TR.lam_over_E_pct,1)}% lợi nhuận hồ sơ trung vị, nên quy tắc từ chối thuần túy gần như không loại hồ sơ nào (${f(TR.pct_below,1)}%). Nhưng để xếp THỨ TỰ, độ lớn tuyệt đối không quan trọng bằng độ lớn tương đối giữa các hồ sơ — và chính khác biệt về giá trị kỳ vọng, độ nhạy cam kết và thời gian còn lại tới hạn chót là thứ quy tắc G2 khai thác.`));

/* ═══ 5.4 ═══ */
k.push(h2("5.4. Trụ cột III — Bản chất dị chất của danh mục B2B, ngưỡng chuyển pha của π_SLA và kỷ luật kiểm chứng"));
k.push(h3("5.4.1. Dị chất của danh mục vật tư"));
k.push(p("Nghiệm cân bằng dạng đóng đòi hỏi một cận trên xác định của miền chi phí. Trong phân phối vật tư công nghiệp, mỗi hồ sơ chứa nhiều dòng hàng dị chất, và giá vốn mỗi dòng hàng trải từ khoảng 16 đến khoảng 600 USD — chênh nhau gần bốn mươi lần. Không tồn tại một c_max duy nhất mô tả đồng thời cả hai đầu của dải này; đặc tả A thất bại vì cố dùng một cận chung cho cả nhóm vật liệu. Bài học chuyển giao được là mọi mô hình cân bằng cho danh mục B2B phải được vận hành ở cấp dòng hàng — điều mà đặc tả C làm được nhờ trường cận dự trữ từ phân hệ Sourcing."));
k.push(mkTable(["Đặc tả","Cách xác định c̄","Giả định ngầm","Hệ quả trên dữ liệu"],
  [["A — Tuyệt đối theo nhóm hàng","Phân vị 99 giá vốn trong từng nhóm vật liệu","Mọi dòng hàng cùng nhóm cạnh tranh trên cùng miền chi phí",`Kẹp ${pct(nA.clip,1)}; trung vị trước kẹp ${f(nA.median_mk_unclipped,3)} > P95 ${f(dm.P95,4)}`],
   ["B — Tỷ lệ cố định",`c̄ = c(1 + δ), δ = ${f(B3.delta_B,3)}`,"Độ phân tán chi phí giữa đối thủ tỷ lệ với quy mô chi phí",`Kẹp ${pct(nB.clip,0)}; trung vị ${f(nB.median_mk_unclipped,3)} < P5 ${f(dm.P5,4)}`],
   ["C — Cận dự trữ cấp dòng hàng",`c̄_i = Market_Reserve_Bound_i (δ_C ≈ ${f(NC.delta_C_median,2)}), N thực tế`,"Cận phản ánh mức sẵn lòng trả có tính vị thế phi giá",`Kẹp ${pct(nC.clip,1)}; nội suy ở N ≥ 3; N = 2 kẹp ${pct(NC.clip_by_N["2"],0)}`]],
  [1900,2500,2300,2300]));
k.push(cap("Bảng 5.4: Ba đặc tả miền chi phí — hai dạng thất bại đối xứng và một dạng phục hồi"));
k.push(h3("5.4.2. Ngưỡng chuyển pha của π_SLA và của độ nhạy thời gian"));
const g1neg=G1.filter(r=>r.d_G1_pp<0).length;
k.push(p(`Mặt phẳng chuyển pha ở Mục 4.4.4 cho thấy giá trị của cơ chế đồng bộ là hàm của hai tham số mà dữ liệu hiện có không nhận dạng chắc chắn. Với quy tắc G2, lợi ích luôn dương nhưng độ lớn tăng gần tuyến tính theo k — độ nhạy thời gian của khách hàng: trong kịch bản C1 tại π = 1, từ ${fs_(cell(0,1).d_pp,2)} điểm ở k = 0 lên ${fs_(cell(1,1).d_pp,2)} ở k = 1 và ${fs_(cell(3,1).d_pp,2)} ở k = 3; và tăng nhanh hơn khi π_SLA vượt khoảng 3 lần biên lợi nhuận (tại k = 1: ${fs_(cell(1,0.5).d_pp,2)} ở π = 0,5, ${fs_(cell(1,5).d_pp,2)} ở π = 5). Với biến thể G1, chuyển pha là đổi dấu thực sự: ${g1neg} trên ${G1.length} ô âm, tập trung ở vùng π_SLA cao và k thấp. Ngưỡng hòa vốn của giá bóng ở Bảng 5.3 (khoảng ${f(TR.pi_breakeven_x_margin,1)} lần biên) nằm trong vùng chuyển tiếp này: dưới ngưỡng, giá bóng chỉ đủ để xếp thứ tự; trên ngưỡng, nó bắt đầu đủ lớn để biện minh cho từ chối có lý do — nhưng khi đó, quy tắc phải tính chi phí vi phạm của chính hồ sơ bị hoãn, nếu không sẽ rơi vào vùng âm của G1.`));
k.push(h3("5.4.3. Kỷ luật kiểm chứng giả dược và thiết kế phân cụm"));
k.push(p(`Bài học phương pháp quan trọng nhất của luận văn được củng cố, chứ không bị thay thế, bởi kết quả mô phỏng. Không có nhánh giả dược, đánh giá tĩnh sẽ kết luận rằng thành phần năng lực tạo thêm ${f(pl.cap_uplift-cb.uplift_pct,2)} điểm phần trăm lợi nhuận — trong khi toàn bộ là hiệu ứng nâng giá. Trong mô phỏng, chính nhánh giả dược P3 và hai nhánh phân rã P5, P6 cho phép quy công chính xác cho phân luồng thay vì cho λ trong giá. Mọi chính sách phức tạp phải được so với phiên bản đơn giản có cùng tác động trung bình.`));
k.push(p(`Về thiết kế thực nghiệm, tương quan nội cụm ${f(B3.ab_design.ICC,3)} của lợi nhuận theo hồ sơ cho hiệu ứng thiết kế ${f(B3.ab_design.DEFF,2)}; ICC của xác suất thắng dự báo còn cao hơn (${f(AX.p_hat.ICC,3)}). Ngẫu nhiên hóa ở cấp dòng hàng sẽ đánh giá thấp phương sai gần một nửa và cho kết luận sai về ý nghĩa thống kê. Thiết kế ba nhánh với ngẫu nhiên hóa theo hồ sơ, phân tầng theo phân hạng khách hàng và cường độ cạnh tranh, là điều kiện tối thiểu để chuyển các con số mô phỏng thành bằng chứng.`));

/* ═══ 5.5 ═══ */
k.push(h2("5.5. Hạn chế"));
k.push(h3("5.5.1. Hạn chế về dữ liệu"));
k.push(p([run("Phiên bản nhãn và các trường dẫn xuất. ",{bold:true}),
  run(`Hạn chế quan trọng nhất của bản v3 là sự phụ thuộc của kết luận về kênh thời gian phản hồi vào ${DA.labels.n_changed} nhãn đã đối soát, phân bố theo quy luật gắn với độ sâu hàng đợi. Ngoài ra, hai trong ba trường bổ sung có quan hệ gần như tất định với trường cũ: Effective_Competitors_N trùng Competitor_Intensity ở hai tầng dưới, và Urgency_SLA_Sensitivity tái lập được ${f(DA.Urgency.rule_match_frac*100,0)}% từ Is_Strategic và số cấp phê duyệt. Các trường này vì vậy làm rõ cách mã hóa, nhưng không bổ sung nhiều thông tin độc lập; riêng Market_Reserve_Bound mang thông tin mới về mức cận, dù tỷ số với giá vốn rất ổn định.`,{})]));
k.push(p([run("Cấu trúc ghi nhận giá. ",{bold:true}),
  run("Giá chào bằng đúng tích giá vốn với hệ số markup trên toàn bộ dòng hàng, do quy trình chuẩn hóa và ẩn danh hóa; hệ số markup hầu như không mang thông tin về thị trường (mục 4.2.4). Bộ dữ liệu đã qua xử lý bảo mật có tiêm nhiễu; kết luận định tính bền vững hơn từng con số cụ thể.",{})]));
k.push(p("Các hạn chế đã khai báo từ đầu vẫn là ràng buộc thật: không quan sát được giá chào của đối thủ; vùng hàng đợi sâu hơn 30 chỉ chứa khoảng 1% quan sát; kỳ quan sát 299 ngày chưa đủ tách hiệu ứng mùa vụ."));
k.push(h3("5.5.2. Hạn chế về mô hình"));
k.push(p(`Đặc tả A đảo dấu khi N tại tầng thấp vượt khoảng ${f(B3.sensitivity.N_scale.find(r=>r.uplift<0).N_low-0.5,1)} và khi thay họ phân phối (${fp(B3.sensitivity.F_family.Uniform,2)} thành ${fp(B3.sensitivity.F_family.Triangular,2)}); đặc tả C đảo dấu khi N tăng 50%. Giả định đối xứng giữa các nhà thầu bị chính dữ liệu bác bỏ. Với BT2, mô hình logistic hơi lạc quan: dự báo cao hơn thực tế ${f(B12.bt2_calib.deviation_pct,1)}% về số dòng hàng thắng và ${fp(B3.hieu_chuan_tong_hop.lech_pct,1)} về lợi nhuận tại giá lịch sử.`));
k.push(p("Mô hình mô phỏng là xấp xỉ một tầng của hệ thống nhiều khâu; hai kịch bản hiệu chỉnh C1 và C2 cho kết quả chênh nhau hơn ba lần, và khoảng tin cậy của mô phỏng không bao gồm sai lệch đặc tả của mô hình hàng đợi. Mọi con số ở Mục 4.4 phải được đọc như cận dưới và cận trên của một khoảng định hướng, không như dự báo điểm."));
k.push(h3("5.5.3. Hạn chế về suy luận nhân quả"));
k.push(p("Toàn bộ uplift trong luận văn — kể cả kết quả mô phỏng — là lợi nhuận kỳ vọng theo mô hình trên dữ liệu quan sát. Không có can thiệp ngẫu nhiên hóa nào được thực hiện, nên không có phát biểu nhân quả nào được chứng minh. Đặc biệt, β_TAT và β_Queue là hệ số có điều kiện trong mô hình quan sát; nếu hồ sơ phức tạp vừa chờ lâu vừa khó thắng vì một lý do không quan sát được, mô phỏng sẽ đánh giá quá cao lợi ích của phân luồng. Thiết kế ở mục 3.6 và 4.6 là bước duy nhất chuyển các con số này thành bằng chứng."));
k.push(h3("5.5.4. Hạn chế về khái quát hóa"));
k.push(p("Nghiên cứu dựa trên một doanh nghiệp, một thị trường. Đặc điểm quyết định kết quả — lợi thế phi giá lớn, biên lợi nhuận mỗi dòng hàng nhỏ so với chi phí xử lý, danh mục dị chất — có thể không đúng ở doanh nghiệp khác. Vì vậy đóng góp khái quát được của luận văn không phải kết quả số, mà là bộ tiêu chí chẩn đoán và quy trình kiểm chứng ở Chương 6."));

/* ═══ 5.6 ═══ */
k.push(h2("5.6. Đóng góp thực chất và định vị lại"));
k.push(p("Định vị lại một cách trung thực, năm đóng góp sau đứng vững."));
k.push(p([run("Đóng góp 1 — Phân rã biến động thời gian xử lý theo khâu. ",{bold:true}),
  run(`Cấu trúc biến động là một khâu tách biệt và ba khâu tương đồng; ${f(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"],1)}% phương sai thời gian tổng là hiệp phương sai; Pricing vận hành độc lập với đầu chuỗi; quy trình chẩn đoán đã bác bỏ biến đổi logarit và thay bằng thang đo gốc kèm sai số vững HC3.`,{})]));
k.push(p([run("Đóng góp 2 — Mô hình xác suất thắng có đặc tả tường minh, hiệu chuẩn và độ nhạy theo nhãn. ",{bold:true}),
  run(`AUC ngoài mẫu ${f(m2.AUC_test,3)} với sáu nhóm biến có cơ chế rõ ràng; trên nhãn đã đối soát, mọi hệ số có ý nghĩa đều đúng dấu kỳ vọng, kể cả cạnh tranh, hàng đợi và thời gian phản hồi; kèm phân tích độ nhạy cho thấy chính xác kết luận nào phụ thuộc vào đối soát.`,{})]));
k.push(p([run("Đóng góp 3 — Khung định giá theo xác suất thắng có kiểm chứng độ nhạy đầy đủ. ",{bold:true}),
  run(`Uplift kỳ vọng ${fp(cb.uplift_pct,2)}, không phụ thuộc vào tham số nào không nhận dạng được.`,{})]));
k.push(p([run("Đóng góp 4 — Ranh giới áp dụng của mô hình cân bằng. ",{bold:true}),
  run("Đối sánh ba đặc tả cho thấy BNE thuần giá suy biến trên danh mục B2B, và chỉ phục hồi tính nội suy khi cận trên được định nghĩa ở cấp dòng hàng từ phía cầu; kiểm định H1 hai mặt phân tách rõ hành vi cost-plus của doanh nghiệp với tính chất so sánh tĩnh của mô hình.",{})]));
k.push(p([run("Đóng góp 5 — Giá bóng đúng vị trí: từ tín hiệu giá sang quy tắc phân luồng. ",{bold:true}),
  run(`Theo hiểu biết của tác giả, đây là lần đầu giá bóng của năng lực định giá được đánh giá đồng thời ở dạng tín hiệu giá (tĩnh, có giả dược) và dạng quy tắc phân luồng (mô phỏng liên kỳ, có giả dược và phân rã) trên dữ liệu báo giá B2B. Kết quả tách bạch: dạng thứ nhất không tạo giá trị, dạng thứ hai vượt giả dược ${fs_(M1.compare.P4_vs_P3.mean_pp,2)} đến ${fs_(M2.compare.P4_vs_P3.mean_pp,2)} điểm phần trăm lợi nhuận ròng trong mô phỏng.`,{})]));
k.push(p(`Một hàm ý quản trị dễ bị bỏ qua từ Bảng 4.13: chính sách cost-plus đơn giản chỉ chênh ${fp(P["Cost-Plus (markup trung vị)"].uplift_pct,2)} so với thực tế. Toàn bộ mức tinh vi mà đội định giá đang áp dụng tạo ra chưa tới 1% giá trị so với việc nhân giá vốn với một hệ số cố định; thước đo thành công của bất kỳ hệ thống mới nào phải là mức vượt trên một quy tắc đơn giản và trên nhánh giả dược, chứ không phải mức vượt trên hiện trạng.`));
return k;
};
