// CHUONG 6 — KET LUAN VA HUONG PHAT TRIEN  (v2)
module.exports=function(L){
const {C,run,p,h1,h2,h3,cap,mkTable,fn}=L;
const fs=require("fs"); const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const B1=J("bt1_pertask.json"),B1M=J("bt1_models.json"),B12=J("ch4_bt12.json"),B3=J("ch4_bt3.json"),TR=J("ch5_triage.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−"); const fp=(x,d=2)=>(x>=0?"+":"")+f(x,d)+"%"; const pct=(x,d=1)=>f(x*100,d)+"%";
const P=B3.policies,H=B3.H1_test,pl=B3.placebo,ab=B12.bt2_ablation,m2=B12.bt2_metrics,A=B3.ab_design,wr=B3.N_calib.win_rate;
const nA=P["Nash A — miền tuyệt đối (kẹp)"],nB=P["Nash B — miền tỷ lệ (kẹp)"],cb=P["CBPO Realistic (kẹp P5–P95)"],tq=B1M.tuong_quan;
const k=[];

k.push(h1("CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN"));
k.push(h2("6.1. Kết luận theo ba câu hỏi nghiên cứu"));
k.push(p([run("Về BT1. ",{bold:true}),run(`Biến động thời gian xử lý phân bố không đồng nhất giữa bốn khâu: Sales biến động tương đối cao nhất (hệ số biến thiên ${f(B1.eda[0].CV,3)}) và cũng là khâu mô hình giải thích kém nhất (R² ${f(B1M.tung_khau[0].R2,3)}); ba khâu còn lại tạo thành một nhóm tương đồng. ${f(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"],1)}% phương sai của thời gian tổng là hiệp phương sai giữa các khâu — tồn tại một yếu tố độ phức tạp chung của hồ sơ. Pricing, dù là nút thắt về thời gian tuyệt đối, vận hành gần như độc lập với đầu chuỗi (r = ${f(tq.Sales_Days.Pricing_Days,3)}). Về đặc tả, quy trình chẩn đoán đã bác bỏ biến đổi logarit và xác lập thang đo gốc kèm sai số chuẩn vững HC3.`,{})]));
k.push(p([run("Về BT2. ",{bold:true}),run(`Xác suất thắng được dự báo với AUC ngoài mẫu ${f(m2.AUC_test,3)}, chi phối bởi chỉ số cạnh tranh giá và năng lực nhà cung cấp. Ba phát hiện cấu trúc: hệ số markup không phải tín hiệu giá; loại toàn bộ biến giá vẫn còn AUC ${f(ab[0].AUC_test,3)} nên cạnh tranh không thuần giá; và thời gian xử lý không ảnh hưởng tới xác suất thắng.`,{})]));
k.push(p([run("Về BT3. ",{bold:true}),run(`Cả hai giả thuyết mở rộng đều bị bác bỏ. H1: độ dốc markup theo số đối thủ là ${f(H.slope,4)} so với −1 theo lý thuyết, và hai đặc tả cân bằng kẹp biên ${pct(nA.clip,0)} và ${pct(nB.clip,0)}. H2: điều tiết giá theo hàng đợi đóng góp ${fp(pl.dong_gop_dieu_tiet_pp,2)} điểm phần trăm so với giả dược. Kết quả dương duy nhất và bền vững là khung định giá theo xác suất thắng đã hiệu chuẩn, uplift kỳ vọng ${fp(cb.uplift_pct,2)}, không phụ thuộc vào tham số nào không nhận dạng được.`,{})]));
k.push(p("Tổng hợp lại, ba bài toán hội tụ về một kết luận không bài toán nào được thiết kế để tìm ra: trong bối cảnh này, giá chào không phải đòn bẩy phù hợp để quản lý năng lực xử lý. Kết luận đó, cùng chẩn đoán ba trụ cột ở Chương 5, là nền của hai khung ứng dụng dưới đây."));

k.push(h2("6.2. Hai khung ứng dụng cấu thành đóng góp thực chất"));
k.push(h3("6.2.1. Cổng ba bước kiểm tra tính khả thi của mô hình cân bằng"));
k.push(p("Chi phí lớn nhất của nghiên cứu này không nằm ở dẫn xuất nghiệm cân bằng — phần đó có sẵn trong tài liệu — mà ở việc phát hiện quá muộn rằng giả định nền không được thỏa mãn. Ba kiểm tra sau phát hiện đúng vấn đề đó, thực hiện trong vài giờ trên dữ liệu lịch sử, không cần dữ liệu bổ sung. Chúng được đề xuất như cổng sàng lọc bắt buộc trước khi triển khai bất kỳ khung định giá nào dựa trên lý thuyết đấu giá."));
k.push(mkTable(["Bước","Kiểm tra","Tiêu chí dừng","Kết quả trên dữ liệu luận văn"],
  [["1","Đối chiếu tỷ lệ thắng với giới hạn đối xứng 1/N","Tỷ lệ thắng vượt 1/N một cách hệ thống → thị trường không đối xứng thuần giá",`${pct(wr["1"],1)} ở tầng thấp so với tối đa 50% → KHÔNG ĐẠT`],
   ["2","Ablation loại toàn bộ biến giá","AUC còn cao hơn rõ rệt 0,50 → yếu tố phi giá chi phối",`AUC ${f(ab[0].AUC_test,4)} → KHÔNG ĐẠT`],
   ["3","Tỷ lệ khuyến nghị bị kẹp biên khi áp công thức","Đa số bị kẹp → đầu ra do ràng buộc quyết định, không do công thức",`${pct(nA.clip,1)} kẹp trần; ${pct(nB.clip,0)} kẹp sàn → KHÔNG ĐẠT`]],
  [600,2600,3200,2600]));
k.push(cap("Bảng 6.1: Cổng ba bước kiểm tra tính khả thi của mô hình cân bằng trước khi triển khai"));
k.push(p("Quy tắc sử dụng: chỉ cần một bước không đạt là đủ để kết luận mô hình cân bằng thuần giá chưa sẵn sàng cho bối cảnh đang xét. Cả ba tiêu chí đều là so sánh nội tại trên chính dữ liệu của đơn vị áp dụng, nên khung khái quát được sang bối cảnh khác mà không phụ thuộc vào con số của doanh nghiệp nào."));

k.push(h3("6.2.2. Khung định giá theo xác suất thắng đã hiệu chuẩn"));
k.push(p(`Trong các chính sách được đánh giá, duy nhất chính sách tối ưu giá theo xác suất thắng có hiệu chuẩn cho mức cải thiện vừa dương, vừa bền vững qua toàn bộ phân tích độ nhạy, vừa không phụ thuộc tham số không nhận dạng được. Tính "an toàn" của khung có nội dung kỹ thuật cụ thể.`));
k.push(mkTable(["Thuộc tính","Nội dung","Bằng chứng"],
  [["Không phụ thuộc tham số không nhận dạng được","Không cần hiệu chỉnh N, đặc tả miền chi phí, hay chi phí vi phạm SLA","Uplift không đổi qua mọi kịch bản ở Bảng 4.14"],
   ["Xác suất được hiệu chuẩn",`Sai lệch tổng hợp tại giá lịch sử ${fp(B3.hieu_chuan_tong_hop.lech_pct,1)}; đường cong hiệu chuẩn bám đường chéo`,"Mục 4.2.2 và 4.3.4"],
   ["Khuyến nghị nằm trong dải hành vi quan sát",`Giá đề xuất kẹp trong [P5; P95] markup lịch sử; tỷ lệ ngoài dải ${pct(cb.clip,0)} được báo cáo tường minh`,`So với ${pct(nA.clip,0)} và ${pct(nB.clip,0)} của hai đặc tả cân bằng`],
   ["Mô hình diễn giải được","Hồi quy logistic với hệ số có dấu đúng kỳ vọng; chuẩn so sánh phi tuyến không vượt trội","Bảng 4.6 và mục 4.2.2"]],
  [2600,3600,2800]));
k.push(cap("Bảng 6.2: Bốn thuộc tính làm nên tính an toàn của khung định giá theo xác suất thắng"));
k.push(p([run(`Cần phát biểu đúng mức về con số ${fp(cb.uplift_pct,2)}: `,{bold:true}),
  run("đây là lợi nhuận kỳ vọng theo mô hình trên tập kiểm tra, không phải hiệu ứng nhân quả đã đo. Nó trở thành bằng chứng chỉ sau thực nghiệm ngẫu nhiên hóa ở mục 4.5, và thực nghiệm đó bắt buộc có nhánh giả dược — vì bài học từ mục 4.3.6 là một uplift dương chưa đủ để quy công cho cơ chế.",{})]));

k.push(h2("6.3. Khuyến nghị vận hành cho doanh nghiệp phân phối vật tư B2B"));
k.push(p("Khuyến nghị xuất phát từ nguyên tắc phân tách đòn bẩy, là hệ quả trực tiếp của trụ cột II: trong quy trình báo giá B2B, giá chào và tải của hàng đợi kỹ thuật là hai bài toán khác nhau, phát sinh ở hai thời điểm khác nhau, và phải được điều khiển bằng hai đòn bẩy khác nhau."));
k.push(p([run("Nguyên tắc 1 — Không dùng giá chào để gánh việc điều tiết hàng đợi kỹ thuật. ",{bold:true,color:C.RED}),
  run(`Công việc định giá phát sinh khi hồ sơ được tiếp nhận, trước quyết định giá. Nâng giá khi hàng đợi sâu không giảm việc đã phát sinh, chỉ giảm xác suất thắng. Ba bằng chứng hội tụ ở Bảng 5.2 — Pricing độc lập với Sales, khách hàng không phạt phản hồi chậm, giả dược cho ${fp(pl.dong_gop_dieu_tiet_pp,2)} điểm — cùng nói rằng kênh tác động không tồn tại. Mọi biến thể công thức giá có gắn hệ số hàng đợi nên được loại khỏi lộ trình triển khai.`,{})]));
k.push(p([run("Nguyên tắc 2 — Kiểm soát cam kết thời gian bằng bộ lọc tiếp nhận đặt tại pha Sales-WBS. ",{bold:true,color:C.RED}),
  run("Đòn bẩy tương thích với khái niệm giá bóng là quyết định tiếp nhận và điều phối, đúng dạng nguyên bản của bid-price control. Vị trí đặt bộ lọc có ý nghĩa quyết định: phải nằm ở pha Sales-WBS — bước tiếp nhận và phân rã cấu trúc công việc — trước khi hồ sơ được đẩy vào hàng đợi Pricing. Kết quả BT1 củng cố điều này: Sales là khâu có biến động tương đối cao nhất và khó dự báo nhất, tức là điểm mà việc phân loại hồ sơ theo độ phức tạp tạo giá trị lớn nhất. Bộ lọc gồm ba việc: phân loại hồ sơ theo giá trị kỳ vọng và độ phức tạp tại điểm tiếp nhận; đặt mức công sức định giá tương xứng thay vì xử lý đồng đều; hạ ưu tiên hoặc từ chối có lý do những hồ sơ mà giá trị kỳ vọng không bù được suất xử lý.",{})]));
k.push(p([run("Nguyên tắc 3 — Dùng khung định giá theo xác suất thắng để tối ưu biên lợi nhuận. ",{bold:true,color:C.RED}),
  run("Sau khi hàng đợi được điều tiết bằng đòn bẩy tiếp nhận, bài toán giá thu về đúng phạm vi của nó: tối đa hóa biên lợi nhuận kỳ vọng trên các hồ sơ đã nhận. Sự phân tách này làm việc đánh giá trở nên khả thi: hai đòn bẩy có hai chỉ tiêu riêng — bộ lọc đo bằng tỷ lệ vi phạm cam kết, khung định giá đo bằng biên lợi nhuận — thay vì buộc một biến quyết định phải tối ưu đồng thời hai mục tiêu xung đột.",{})]));
k.push(p(`Cần nêu thẳng giới hạn của Nguyên tắc 2 ở mức hiệu chỉnh hiện tại: chỉ ${TR.n_below}/${TR.n_rfq_test} hồ sơ (${f(TR.pct_below,1)}%) có lợi nhuận kỳ vọng thấp hơn giá bóng. Nếu chi phí vi phạm đúng bằng mức giả định thì bộ lọc gần như không loại hồ sơ nào. Khuyến nghị chính xác là: xây bộ lọc như cấu phần quy trình và cơ chế đo lường, nhưng chỉ kích hoạt ngưỡng loại bỏ sau khi doanh nghiệp xác định chi phí thực của một lần vi phạm — ngưỡng hòa vốn khoảng ${f(TR.pi_breakeven_USD,0)} USD, tương đương ${f(TR.pi_breakeven_x_margin,1)} lần biên lợi nhuận trung bình mỗi dòng hàng.`));
k.push(mkTable(["Thứ tự","Khuyến nghị","Cơ sở","Mức chắc chắn"],
  [["1","Chạy thực nghiệm A/B cho khung định giá theo xác suất thắng, kèm nhánh đối chứng nâng giá đều",`Uplift ${fp(cb.uplift_pct,0)} ổn định qua mọi độ nhạy; giả dược cho thấy nhánh đối chứng là bắt buộc`,"Cao — thiết kế sẵn sàng"],
   ["2","Thiết lập bộ lọc tiếp nhận tại pha Sales-WBS; xác định chi phí thực của một lần vi phạm bằng số liệu kế toán",`Đòn bẩy đúng là tiếp nhận; ngưỡng hòa vốn ${f(TR.pi_breakeven_USD,0)} USD quyết định khi nào kích hoạt`,"Cao về cơ sở; tham số cần doanh nghiệp xác nhận"],
   ["3","Giảm số lần làm rõ bản vẽ ở khâu tiếp nhận","Biến có hệ số lớn nhất ở cả bốn khâu (Bảng 4.3) — một đòn bẩy vận hành duy nhất","Trung bình — cần kiểm chứng quy trình"],
   ["4","Không triển khai định giá cân bằng thuần giá; không gắn hệ số hàng đợi vào công thức giá",`Cả ba bước Bảng 6.1 không đạt; kết quả đảo dấu khi N vượt khoảng 3`,"Cao — bằng chứng nhất quán"]],
  [700,3300,3300,1700]));
k.push(cap("Bảng 6.3: Khuyến nghị triển khai theo thứ tự ưu tiên"));
k.push(p("Ba nguyên tắc tổ chức đi kèm: mô hình giữ vai trò hỗ trợ quyết định, người phụ trách định giá được quyền ghi đè và mọi lần ghi đè được ghi nhận; quy tắc phân tích được đăng ký trước khi bắt đầu thực nghiệm; hệ thống được huấn luyện lại định kỳ và theo dõi bằng chỉ số ổn định."));

k.push(h2("6.4. Hướng nghiên cứu tiếp theo"));
k.push(p([run("Hướng 1 — Đấu giá chấm điểm. ",{bold:true}),run("Trực tiếp nhất vì tấn công đúng nguyên nhân ở trụ cột I. Khung Che (1993) cho phép giải lại cân bằng trên không gian điểm thay vì không gian giá; dữ liệu thắng thua cùng bộ đặc trưng phi giá hiện có đủ để ước lượng một hàm điểm rút gọn.",{})]));
k.push(p([run("Hướng 2 — Mô phỏng rời rạc có vòng phản hồi. ",{bold:true}),run("Khung tĩnh một kỳ không đo được lợi ích liên kỳ của điều tiết năng lực. Một mô hình mô phỏng với hàng đợi, tỷ lệ đến, năng lực và quy tắc tiếp nhận sẽ đánh giá đồng thời lợi nhuận và vi phạm cam kết, và kiểm tra trực tiếp lập luận ở mục 5.3.1.",{})]));
k.push(p([run("Hướng 3 — Thu thập giá chào đối thủ. ",{bold:true}),run("Hướng ước lượng cấu trúc bị loại vì dữ liệu, không vì phương pháp. Nếu doanh nghiệp thiết lập được quy trình ghi nhận giá đối thủ qua phản hồi khách hàng sau khi trượt thầu, phân phối chi phí có thể ước lượng phi tham số và N có thể nhận dạng thay vì hiệu chỉnh.",{})]));
k.push(p([run("Hướng 4 — Mô hình theo khâu có cấu trúc chung. ",{bold:true}),run(`Tỷ trọng hiệp phương sai ${f(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"],1)}% gợi ý một mô hình nhân tố chung cho bốn khâu — chẳng hạn mô hình phương trình đồng thời hoặc mô hình đa biến — sẽ mô tả cấu trúc tốt hơn bốn hồi quy độc lập.`,{})]));
k.push(p([run("Hướng 5 — Tối ưu ở cấp giỏ hàng. ",{bold:true}),run("Luận văn định giá từng dòng hàng độc lập, trong khi khách hàng quyết định trên toàn hồ sơ. Bài toán tối ưu có ràng buộc ở cấp hồ sơ gần với thực tế thương mại hơn.",{})]));

k.push(h2("6.5. Lời kết"));
k.push(p("Hai giả thuyết mở rộng của luận văn không được dữ liệu ủng hộ. Điều thu được thay vào đó là hiểu biết chính xác về lý do, thu từ ba bài toán hội tụ: thị trường này không cạnh tranh thuần giá, khách hàng không phạt phản hồi chậm, và năng lực định giá chưa phải nút thắt kinh tế ở mức chi phí đang được ghi nhận. Mỗi kết luận đi kèm bằng chứng định lượng, điều kiện đảo chiều, và một bộ tiêu chí để nghiên cứu sau kiểm tra trước khi đầu tư."));
k.push(p("Trong nghiên cứu ứng dụng, một kết quả âm được chẩn đoán kỹ có giá trị không kém một kết quả dương chưa được kiểm chứng. Đóng góp bền vững nhất của nghiên cứu này nằm ở kỷ luật phương pháp: kiểm tra giả định trước khi tin mô hình, kiểm tra ranh giới áp dụng trước khi tin công thức, đối chứng bằng giả dược trước khi quy công cho cơ chế, và báo cáo trung thực cả những con số không ủng hộ giả thuyết của chính mình."));
return k;
};
