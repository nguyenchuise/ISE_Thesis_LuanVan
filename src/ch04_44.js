// MUC 4.4 — NGHIEN CUU MO PHONG HE THONG CO KIEM SOAT (doc tu ch4_sim.json)
module.exports=function(L){
const {C,run,p,h2,h3,cap,fx,img,mkTable,fn}=L;
const fs=require("fs"); const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const SIM=J("ch4_sim.json"), B12=J("ch4_bt12.json"), B3=J("ch4_bt3.json"), EX=J("ch4_sim_extra.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−");
const fs_=(x,d=2)=>(x>=0?"+":"")+f(x,d);
const fp=(x,d=2)=>fs_(x,d)+"%";
const pct=(x,d=1)=>f(x*100,d)+"%";
const pv=(x)=>x<1e-4?"< 0,0001":f(x,4);
const n0=(x)=>Number(x).toLocaleString("de-DE");
const POL=SIM.meta.policies, CAL=SIM.calibration, MT=SIM.meta;
const M1=SIM.main.C1["1.0"], M2=SIM.main.C2["1.0"];
const gb=b=>B12.bt2_coef.find(r=>r.bien===b);
const k=[];

k.push(h2("4.4. Nghiên cứu mô phỏng hệ thống có kiểm soát — điều phối hàng đợi và định giá liên kỳ"));
k.push(p([run("Lưu ý về bản chất bằng chứng. ",{bold:true,color:C.DRED}),
  run("Toàn bộ kết quả trong mục này là kết quả MÔ PHỎNG phản thực dựa trên mô hình, được thiết kế theo Mục 3.4.6. Mô phỏng dùng dữ liệu thật làm khung (1.500 hồ sơ, thời điểm tiếp nhận, thời gian từng khâu) và dùng các hệ số ước lượng từ BT1, BT2 làm quy luật phản hồi; nó không tạo ra quan sát mới và không thay thế thực nghiệm có kiểm soát ở Mục 4.6.",{})]));
k.push(p("Mục 4.3.6 đã chỉ ra giới hạn cấu trúc của đánh giá tĩnh: giá được quyết định sau khi hồ sơ đã vào hàng đợi, nên mọi chính sách giá để nguyên tỷ lệ vi phạm cam kết. Câu hỏi của mục này là: nếu giá bóng của năng lực được dùng ở đúng vị trí của nó trong quy trình — tại pha Sales-WBS, nơi quyết định hồ sơ nào được Pricing xử lý trước — thì nó có tạo ra giá trị vượt nhánh giả dược nâng giá đồng loạt hay không, và trong vùng tham số nào."));

k.push(h3("4.4.1. Hiệu chỉnh hệ hàng đợi và tái lập hiện trạng"));
k.push(mkTable(["Đại lượng","Hiệu chỉnh C1 — chờ tại Pricing","Hiệu chỉnh C2 — tải toàn chuỗi"],
  [["Mục tiêu thời gian chờ trung bình (ngày)",f(CAL.C1.W_target,3),f(CAL.C2.W_target,3)],
   ["Nguồn của mục tiêu","Hệ số Q trong hồi quy Pricing_Days × Q trung bình","Hệ số Q trong hồi quy TAT tổng × Q trung bình"],
   ["Số máy phục vụ m (kỹ sư định giá tương đương)",String(CAL.C1.m),String(CAL.C2.m)],
   ["Tỷ phần thời gian Pricing là xử lý thực κ",f(CAL.C1.kappa,2),f(CAL.C2.kappa,2)],
   ["Thời gian chờ trung bình mô phỏng dưới FIFO (ngày)",f(CAL.C1.W_mean,3),f(CAL.C2.W_mean,3)],
   ["Số hồ sơ trong hệ thống lúc tiếp nhận (mô phỏng)",f(CAL.C1.Q_mean,1),f(CAL.C2.Q_mean,1)],
   ["Tỷ lệ vi phạm hiện trạng (tái lập theo nguyên tắc neo)",pct(MT.breach_obs,2),pct(MT.breach_obs,2)]],
  [3700,2700,2600]));
k.push(cap("Bảng 4.16: Hiệu chỉnh mô hình hàng đợi Pricing cho hai kịch bản C1 và C2"));
k.push(p(`Cả hai cách hiệu chỉnh cho thời gian chờ mô phỏng khớp mục tiêu với sai lệch dưới 2%, và số hồ sơ trong hệ thống lúc tiếp nhận (${f(CAL.C1.Q_mean,1)} và ${f(CAL.C2.Q_mean,1)}) cùng bậc với độ sâu hàng đợi quan sát trung bình 10,0. Vì mô phỏng neo vào quan sát, kịch bản hiện trạng tái lập đúng tỷ lệ vi phạm ${pct(MT.breach_obs,2)}. Hai kịch bản khác nhau ở dư địa điều phối: trong C1, chỉ khoảng ${f(CAL.C1.W_target,2)} ngày thời gian chờ là có thể sắp xếp lại; trong C2, con số này là ${f(CAL.C2.W_target,2)} ngày. Thực tế vận hành nhiều khả năng nằm giữa hai kịch bản.`));

k.push(h3("4.4.2. Kết quả chính: bốn cơ chế vận hành"));
const row=(nm,M)=>{const r=M.policies[nm];return [fp(r.uplift_net_pct,2),pct(r.breach,1),n0(Math.round(r.cost))];};
const SH=["P1 Hiện trạng","P2 CBPO + FIFO","P3 Giả dược λ̄ + FIFO","P4 Đồng bộ (G2 + CBPO + λ_U(Q))","P5 Chỉ phân luồng G2 + CBPO","P6 CBPO + λ_U(Q) + FIFO","P7 Biến thể G1 + CBPO + λ_U(Q)"];
k.push(mkTable(["Cơ chế","C1: lợi nhuận ròng so với P1","C1: vi phạm SLA","C1: chi phí SLA (USD)","C2: lợi nhuận ròng so với P1","C2: vi phạm SLA"],
  POL.map((nm,i)=>[SH[i],...row(nm,M1),...row(nm,M2).slice(0,2)]),
  [2700,1300,1100,1300,1300,1100],[3]));
k.push(cap(`Bảng 4.17: Kết quả mô phỏng tại π_SLA = 1,0 × biên lợi nhuận mỗi dòng hàng, trung bình ${MT.R_main} lần lặp có bất định tham số`));
const c1=M1.compare, c2=M2.compare;
k.push(p(`Ba kết quả đọc được ngay từ Bảng 4.17. Thứ nhất, các cơ chế chỉ tác động lên giá — P2, P3, P6 — để nguyên tỷ lệ vi phạm ở ${pct(M1.policies[POL[0]].breach,2)}: đúng như nguyên tắc 2 của thiết kế, giá không giải phóng hàng đợi. Thứ hai, cơ chế đồng bộ P4 đạt lợi nhuận ròng cao nhất trong cả hai kịch bản: ${fp(M1.policies[POL[3]].uplift_net_pct,2)} so với hiện trạng trong C1 và ${fp(M2.policies[POL[3]].uplift_net_pct,2)} trong C2, đồng thời giảm tỷ lệ vi phạm xuống ${pct(M1.policies[POL[3]].breach,1)} (C1) và ${pct(M2.policies[POL[3]].breach,1)} (C2). Thứ ba, mức giảm vi phạm này khiêm tốn hơn nhiều so với mức tăng lợi nhuận: điều phối lại thứ tự xử lý chỉ sắp xếp lại một lượng thời gian chờ có hạn, trong khi ${pct(EX.C1.share_breach_beyond_W,0)} hồ sơ vi phạm vượt bảy ngày với biên lớn hơn thời gian chờ trung bình có thể sắp xếp lại ở C1 (${pct(EX.C2.share_breach_beyond_W,0)} ở C2). Muốn giảm vi phạm sâu hơn, phải giảm chính khối lượng việc — chẳng hạn số lần làm rõ bản vẽ — chứ không chỉ sắp xếp lại thứ tự.`));
k.push(mkTable(["So sánh cặp","C1: chênh lệch (điểm %)","C1: KTC 95%","C2: chênh lệch (điểm %)","C2: KTC 95%","Tỷ lệ lần lặp dương (C1 / C2)"],
  [["P4 − P3 (đồng bộ so với giả dược)",fs_(c1.P4_vs_P3.mean_pp),`[${f(c1.P4_vs_P3.CI[0])}; ${f(c1.P4_vs_P3.CI[1])}]`,fs_(c2.P4_vs_P3.mean_pp),`[${f(c2.P4_vs_P3.CI[0])}; ${f(c2.P4_vs_P3.CI[1])}]`,`${pct(c1.P4_vs_P3.share_pos,0)} / ${pct(c2.P4_vs_P3.share_pos,0)}`],
   ["P4 − P2 (đồng bộ so với CBPO tĩnh)",fs_(c1.P4_vs_P2.mean_pp),`[${f(c1.P4_vs_P2.CI[0])}; ${f(c1.P4_vs_P2.CI[1])}]`,fs_(c2.P4_vs_P2.mean_pp),`[${f(c2.P4_vs_P2.CI[0])}; ${f(c2.P4_vs_P2.CI[1])}]`,`${pct(c1.P4_vs_P2.share_pos,0)} / ${pct(c2.P4_vs_P2.share_pos,0)}`],
   ["P5 − P2 (riêng phân luồng)",fs_(c1.P5_vs_P2.mean_pp),`[${f(c1.P5_vs_P2.CI[0])}; ${f(c1.P5_vs_P2.CI[1])}]`,fs_(c2.P5_vs_P2.mean_pp),`[${f(c2.P5_vs_P2.CI[0])}; ${f(c2.P5_vs_P2.CI[1])}]`,`${pct(c1.P5_vs_P2.share_pos,0)} / ${pct(c2.P5_vs_P2.share_pos,0)}`],
   ["P6 − P3 (riêng λ động trong giá)",fs_(c1.P6_vs_P3.mean_pp),`[${f(c1.P6_vs_P3.CI[0])}; ${f(c1.P6_vs_P3.CI[1])}]`,fs_(c2.P6_vs_P3.mean_pp),`[${f(c2.P6_vs_P3.CI[0])}; ${f(c2.P6_vs_P3.CI[1])}]`,`${pct(c1.P6_vs_P3.share_pos,0)} / ${pct(c2.P6_vs_P3.share_pos,0)}`],
   ["P7 − P3 (biến thể G1 so với giả dược)",fs_(c1.P7_vs_P3.mean_pp),`[${f(c1.P7_vs_P3.CI[0])}; ${f(c1.P7_vs_P3.CI[1])}]`,fs_(c2.P7_vs_P3.mean_pp),`[${f(c2.P7_vs_P3.CI[0])}; ${f(c2.P7_vs_P3.CI[1])}]`,`${pct(c1.P7_vs_P3.share_pos,0)} / ${pct(c2.P7_vs_P3.share_pos,0)}`]],
  [2800,1200,1300,1200,1300,1200],[0]));
k.push(cap("Bảng 4.18: So sánh cặp lợi nhuận ròng sau chi phí SLA, tính bằng điểm % của lợi nhuận ròng hiện trạng, π_SLA = 1,0"));
k.push(p([run("Kết quả kiểm định H2 trong khung liên kỳ. ",{bold:true,color:C.RED}),
  run(`Cơ chế đồng bộ vượt nhánh giả dược ${fs_(c1.P4_vs_P3.mean_pp)} điểm phần trăm lợi nhuận ròng trong kịch bản thận trọng C1 và ${fs_(c2.P4_vs_P3.mean_pp)} điểm trong kịch bản C2; khoảng tin cậy 95% qua ${MT.R_main} lần lặp nằm hoàn toàn trên số không ở cả hai kịch bản, và mọi lần lặp đều cho chênh lệch dương. So với CBPO tĩnh, chênh lệch là ${fs_(c1.P4_vs_P2.mean_pp)} (C1) và ${fs_(c2.P4_vs_P2.mean_pp)} điểm (C2). Khác với đánh giá tĩnh, trong khung có vòng phản hồi hàng đợi, giá bóng của năng lực tạo ra giá trị phân biệt được với một chính sách nâng giá đồng loạt có cùng tác động trung bình.`,{})]));
k.push(p([run("Phân rã: giá trị đến từ phân luồng, không đến từ λ trong giá. ",{bold:true}),
  run(`Hai nhánh phân rã cho câu trả lời rõ ràng. Riêng phân luồng G2 (P5 so với P2, cùng không có λ trong giá) tạo ${fs_(c1.P5_vs_P2.mean_pp)} điểm (C1) và ${fs_(c2.P5_vs_P2.mean_pp)} điểm (C2). Riêng λ động trong giá khi giữ FIFO (P6 so với P3) cho ${fs_(c1.P6_vs_P3.mean_pp)} điểm ở cả hai kịch bản (trùng nhau vì khi giữ FIFO, hàng đợi không phụ thuộc cách hiệu chỉnh) — âm, đúng như kết quả tĩnh ở Mục 4.3.6, vì không có phân luồng thì hàng đợi không đổi và mô phỏng suy biến về đánh giá tĩnh. Phần chênh của P4 so với P5 (${fs_(c1.P4_vs_P5.mean_pp)} điểm ở C1) chủ yếu là hiệu ứng nâng mặt bằng giá của λ — cùng loại với chênh lệch giữa giả dược và CBPO. Kết luận: giá bóng tạo giá trị khi nó điều khiển THỨ TỰ tiếp nhận, không khi nó điều khiển MỨC giá.`,{})]));

k.push(h3("4.4.3. Cơ chế tác động: ai được rút ngắn thời gian chờ"));
const l1=M1.lane, l2=M2.lane;
k.push(mkTable(["Chỉ báo","C1","C2"],
  [["Tỷ lệ hồ sơ vào làn nhanh (còn kịp cam kết lúc tiếp nhận)",pct(l1.fast_share,1),pct(l2.fast_share,1)],
   ["Thời gian chờ trung bình: FIFO → G2 (ngày)",`${f(l1.W0,3)} → ${f(l1.W1,3)}`,`${f(l2.W0,3)} → ${f(l2.W1,3)}`],
   ["Thay đổi thời gian chờ — 25% hồ sơ giá trị kỳ vọng cao nhất (ngày)",fs_(l1.top_value_dW,3),fs_(l2.top_value_dW,3)],
   ["Thay đổi thời gian chờ — 25% hồ sơ giá trị kỳ vọng thấp nhất (ngày)",fs_(l1.low_value_dW,3),fs_(l2.low_value_dW,3)],
   ["Vi phạm SLA — hồ sơ nhạy cảm cam kết (U > 1)",`${pct(l1.breach_hiU_0,1)} → ${pct(l1.breach_hiU_1,1)}`,`${pct(l2.breach_hiU_0,1)} → ${pct(l2.breach_hiU_1,1)}`],
   ["Vi phạm SLA — hồ sơ thông thường (U = 1)",`${pct(l1.breach_loU_0,1)} → ${pct(l1.breach_loU_1,1)}`,`${pct(l2.breach_loU_0,1)} → ${pct(l2.breach_loU_1,1)}`],
   ["Thay đổi thời gian chờ trung bình — hồ sơ U > 1 (ngày)",fs_(l1.dW_hiU,3),fs_(l2.dW_hiU,3)]],
  [4600,2200,2200],[2,4]));
k.push(cap("Bảng 4.19: Phân bổ lại thời gian chờ dưới quy tắc phân luồng G2, π_SLA = 1,0"));
k.push(p(`Quy tắc G2 không làm giảm tổng khối lượng việc; nó phân bổ lại thời gian chờ. Một phần tư hồ sơ có giá trị kỳ vọng cao nhất được rút ngắn thời gian chờ ${f(Math.abs(l1.top_value_dW),2)} ngày (C1) và ${f(Math.abs(l2.top_value_dW),2)} ngày (C2), trong khi một phần tư hồ sơ giá trị thấp nhất chờ lâu hơn ${f(l1.low_value_dW,2)} và ${f(l2.low_value_dW,2)} ngày. Vì β_TAT = ${f(gb("TAT_pred").beta_z,4)} và β_Queue = ${f(gb("Pricing_Queue_Depth").beta_z,4)} đều âm, việc dời thời gian chờ từ hồ sơ giá trị thấp sang hồ sơ giá trị cao bảo vệ xác suất thắng ở nơi mỗi điểm xác suất đáng giá nhất — đây là nguồn chính của mức tăng lợi nhuận.`));
k.push(p(`Với hồ sơ nhạy cảm cam kết, kết quả tinh tế hơn và cần phát biểu chính xác. Tỷ lệ vi phạm của nhóm U > 1 giảm từ ${pct(l1.breach_hiU_0,1)} xuống ${pct(l1.breach_hiU_1,1)} (C1) và xuống ${pct(l2.breach_hiU_1,1)} (C2), nhưng thời gian chờ TRUNG BÌNH của nhóm này lại tăng nhẹ (${fs_(l1.dW_hiU,3)} và ${fs_(l2.dW_hiU,3)} ngày). Hai con số không mâu thuẫn: nhóm U > 1 gồm nhiều hồ sơ có nhiều cấp phê duyệt, thời gian xử lý dài và thường đã không còn kịp cam kết khi vào hàng đợi; quy tắc G2 ưu tiên những hồ sơ còn cứu được và đẩy những hồ sơ đã chắc chắn trễ ra sau. Như vậy cơ chế bảo vệ CAM KẾT của nhóm nhạy cảm, không rút ngắn thời gian chờ đồng loạt cho cả nhóm.`));
k.push(img("FIG_4_8_Simulation.png",640));
k.push(cap("Hình 4.8: Kết quả mô phỏng — (A) lợi nhuận ròng sau chi phí SLA; (B) tỷ lệ vi phạm cam kết theo cơ chế và kịch bản hiệu chỉnh"));
k.push(p([run("Vì sao biến thể G1 kém hơn. ",{bold:true}),
  run(`Biến thể G1 áp đúng nguyên văn quy tắc bid-price của Talluri và van Ryzin (2004) — nhận vào làn nhanh khi giá trị vượt giá bóng của suất xử lý — nhưng dùng nó cho quyết định HOÃN thay vì TỪ CHỐI. Ở π_SLA thấp, G1 vẫn vượt giả dược (${fs_(SIM.main.C1["0.5"].compare.P7_vs_P3.mean_pp)} điểm ở C1, π = 0,5); khi π_SLA tăng lên 2,0, chênh lệch này về ${fs_(SIM.main.C1["2.0"].compare.P7_vs_P3.mean_pp)} điểm và khoảng tin cậy chứa số không. Lý do là khi giá bóng lớn, G1 đẩy nhiều hồ sơ vào làn chuẩn (tỷ lệ làn nhanh giảm từ ${pct(SIM.main.C1["0.5"].lane.fast_share_G1,0)} xuống ${pct(SIM.main.C1["2.0"].lane.fast_share_G1,0)}); không như từ chối, hồ sơ bị hoãn vẫn được xử lý và vẫn chịu vi phạm — tức chi phí của chính nó tăng cùng π_SLA. Quy tắc G2 tránh được điều này vì đặt chi phí vi phạm của chính hồ sơ vào chỉ số ưu tiên. Đây là bằng chứng mô phỏng cho lưu ý ở mục 2.2.4: giá bóng không thể chuyển nguyên trạng từ quyết định tiếp nhận sang quyết định điều độ.`,{})]));

k.push(h3("4.4.4. Mặt phẳng chuyển pha theo độ nhạy thời gian và chi phí vi phạm"));
const PH=SIM.phase, G1=PH.grid.C1, G2=PH.grid.C2;
const cell=(G,kb,pm)=>G.find(r=>r.k_beta===kb&&r.pi_mult===pm);
const sigPos=G=>G.filter(r=>r.d_pp>0&&r.p<0.05).length, sigNeg=G=>G.filter(r=>r.d_pp<0&&r.p<0.05).length;
const PMs=PH.pi_mult, KBs=PH.k_beta;
const tblRows=G=>KBs.map(kb=>[`k = ${f(kb,1)}`+(kb===1?" (ước lượng BT2)":kb===0?" (không phạt chậm)":""),...PMs.map(pm=>{const c=cell(G,kb,pm);return fs_(c.d_pp,2)+(c.p<0.05?"*":"")+" / "+fs_(c.d_G1_pp,2);})]);
k.push(mkTable(["C1: hệ số nhân k cho |β_TAT|, |β_Queue|",...PMs.map(v=>`π = ${f(v,1)}`)],tblRows(G1),[2700,1260,1260,1260,1260,1260],[2]));
k.push(cap(`Bảng 4.20: Mặt phẳng chuyển pha, kịch bản C1 — chênh lệch lợi nhuận ròng so với giả dược P3 của quy tắc G2 (trước dấu /) và biến thể G1 (sau dấu /), điểm % lợi nhuận gộp kỳ vọng hiện trạng, ${PH.R} lần lặp mỗi ô; * p < 0,05 cho G2`));
k.push(img("FIG_4_9_Phase.png",640));
k.push(cap("Hình 4.9: Mặt phẳng chuyển pha theo độ nhạy thời gian (k) và chi phí vi phạm π_SLA — (A), (B) quy tắc G2 ở hai kịch bản; (C) biến thể G1 với ranh giới đổi dấu"));
const mnC1=Math.min(...G1.map(r=>r.d_pp)), mxC1=Math.max(...G1.map(r=>r.d_pp)), mnC2=Math.min(...G2.map(r=>r.d_pp)), mxC2=Math.max(...G2.map(r=>r.d_pp));
const g1neg=G1.filter(r=>r.d_G1_pp<0).length, g1pos=G1.filter(r=>r.d_G1_pp>0).length, p6neg=G1.filter(r=>r.d_P6_pp<0).length;
// nguong pi doi dau cua G1 tren tung hang k (noi suy tuyen tinh)
const thr=KBs.map(kb=>{const r=PMs.map(pm=>cell(G1,kb,pm).d_G1_pp);for(let j=0;j<r.length-1;j++){if(r[j]>0&&r[j+1]<=0){return PMs[j]+(PMs[j+1]-PMs[j])*r[j]/(r[j]-r[j+1]);}}return null;});
const thrTxt=KBs.map((kb,i)=>thr[i]===null?null:`k = ${f(kb,1)}: π* ≈ ${f(thr[i],1)}`).filter(x=>x).join("; ");
k.push(p(`Để đọc đúng mặt phẳng chuyển pha, chênh lệch được chuẩn hóa theo lợi nhuận GỘP kỳ vọng của hiện trạng (không theo lợi nhuận ròng, vốn co lại nhanh khi π_SLA lớn và làm phóng đại chênh lệch). Ba kết quả nổi bật.`));
k.push(p([run("Quy tắc G2 không có ranh giới đổi dấu. ",{bold:true}),
  run(`Trong kịch bản C1, ${sigPos(G1)} trên ${G1.length} ô cho chênh lệch dương có ý nghĩa ở mức 5%, từ ${fs_(mnC1,2)} đến ${fs_(mxC1,2)} điểm; trong C2, ${sigPos(G2)} trên ${G2.length} ô dương có ý nghĩa, từ ${fs_(mnC2,2)} đến ${fs_(mxC2,2)} điểm. Lợi ích tăng gần tuyến tính theo k: tại π = 1 trong C1, từ ${fs_(cell(G1,0,1).d_pp,2)} điểm ở k = 0 lên ${fs_(cell(G1,1,1).d_pp,2)} ở k = 1 và ${fs_(cell(G1,3,1).d_pp,2)} ở k = 3. Theo π_SLA, lợi ích tăng chậm ở π ≤ 3 rồi dốc lên ở π = 5 (tại k = 1: ${fs_(cell(G1,1,0.5).d_pp,2)} → ${fs_(cell(G1,1,3).d_pp,2)} → ${fs_(cell(G1,1,5).d_pp,2)} điểm). Ngay cả ở hàng k = 0 — thế giới mà khách hàng hoàn toàn không phạt phản hồi chậm, tương ứng kết quả BT2 trên nhãn trước đối soát — G2 vẫn dương (${fs_(cell(G1,0,0.5).d_pp,2)} đến ${fs_(cell(G1,0,5).d_pp,2)} điểm ở C1), nhờ riêng thành phần giảm chi phí vi phạm.`,{})]));
k.push(p([run("Biến thể G1 có ranh giới chuyển pha rõ rệt. ",{bold:true}),
  run(`G1 dương ở ${g1pos} ô và âm ở ${g1neg} ô trong C1. Vùng dương nằm ở góc π_SLA thấp và k cao; vùng âm ở góc π_SLA cao và k thấp. Ngưỡng π_SLA tại đó G1 đổi dấu tăng theo k (${thrTxt}). Diễn giải: khi chi phí vi phạm lớn so với lợi ích bảo vệ xác suất thắng, việc hoãn hồ sơ theo ngưỡng giá bóng tạo thêm vi phạm nhiều hơn lợi nhuận nó bảo vệ. Đây là mặt phẳng chuyển pha đúng nghĩa, và nó chỉ ra điều kiện cụ thể dưới đó ánh xạ nguyên văn bid-price control sang điều độ thất bại.`,{})]));
k.push(p([run("Tín hiệu giá động không bao giờ vượt giả dược. ",{bold:true}),
  run(`Nhánh P6 (λ động chỉ trong giá, giữ FIFO) âm so với giả dược ở ${p6neg} trên ${G1.length} ô, với mức âm tăng theo π_SLA. Kết quả này lặp lại, trên toàn mặt phẳng tham số, kết luận tĩnh của Mục 4.3.6.`,{})]));
k.push(p(`Hệ quả cho luận văn: kết luận về giá trị của cơ chế đồng bộ không phụ thuộc vào việc chấp nhận hoàn toàn kết quả đối soát nhãn — về DẤU. Về ĐỘ LỚN, lợi ích phụ thuộc mạnh vào k và vào dư địa điều phối (C1 so với C2). Hai tham số quyết định mà doanh nghiệp cần đo trực tiếp là độ nhạy thời gian thực của khách hàng — chỉ nhận dạng được bằng thực nghiệm — và chi phí kế toán của một lần vi phạm cam kết.`));

k.push(h3("4.4.5. Giới hạn của nghiên cứu mô phỏng"));
k.push(p(`Bốn giới hạn được khai báo. Thứ nhất, hệ hàng đợi là xấp xỉ một tầng: thực tế các khâu dùng chung nhân sự ở mức độ chưa đo được, nên luận văn trình bày hai kịch bản C1 và C2 thay vì một con số. Thứ hai, quy luật phản hồi P(Win) lấy từ mô hình quan sát của BT2; mô phỏng kế thừa toàn bộ giả định của nó, kể cả sự phụ thuộc vào phiên bản nhãn (Mục 4.2.5), và hệ số nhân k trong mặt phẳng chuyển pha là cách duy nhất để kiểm soát rủi ro này. Thứ ba, khoảng tin cậy phản ánh nhiễu mô phỏng và bất định ước lượng của β, không phản ánh sai lệch đặc tả của mô hình hàng đợi — các khoảng tin cậy hẹp ở Bảng 4.18 vì vậy không được đọc như độ chắc chắn về thế giới thực. Thứ tư, quy tắc G2 dùng thông tin dự báo tại thời điểm tiếp nhận; khi triển khai, chất lượng dự báo thời gian Pricing (R² ${f(J("bt1_models.json").tung_khau[3].R2,3)} ở BT1) sẽ quyết định một phần hiệu quả thực.`));
return k;
};
