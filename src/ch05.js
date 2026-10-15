// CHUONG 5 — THAO LUAN  (v2, so lieu tu JSON)
module.exports=function(L){
const {C,run,p,h1,h2,h3,cap,fx,mkTable,fn}=L;
const fs=require("fs"); const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const B1=J("bt1_pertask.json"),B1M=J("bt1_models.json"),B12=J("ch4_bt12.json"),B3=J("ch4_bt3.json"),TR=J("ch5_triage.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−");
const fp=(x,d=2)=>(x>=0?"+":"")+f(x,d)+"%"; const pct=(x,d=1)=>f(x*100,d)+"%";
const P=B3.policies, H=B3.H1_test, pl=B3.placebo, ab=B12.bt2_ablation, m2=B12.bt2_metrics, la=B3.lambda, dm=B3.dai_markup;
const nA=P["Nash A — miền tuyệt đối (kẹp)"], nB=P["Nash B — miền tỷ lệ (kẹp)"], cb=P["CBPO Realistic (kẹp P5–P95)"];
const tq=B1M.tuong_quan, gTAT=B12.bt2_coef.find(r=>r.bien==="TAT_pred"), wr=B3.N_calib.win_rate;
const k=[];

k.push(h1("CHƯƠNG 5. THẢO LUẬN"));
k.push(h2("5.1. Khung biện luận ba trụ cột"));
k.push(p("Chương 4 đưa tới hai kết quả kiểm định âm ở bài toán thứ ba: hệ quả so sánh tĩnh của H1 bị bác bỏ bằng kiểm định chính thức, và hệ quả kiểm định của H2 bị bác bỏ bằng kiểm chứng giả dược. Đồng thời, hai bài toán đầu cho những phát hiện về cấu trúc — biến động theo khâu, cơ chế thắng thua — mà khi đặt cạnh nhau, chúng giải thích vì sao hai giả thuyết không được dữ liệu ủng hộ. Chương này biện luận theo ba trụ cột, mỗi trụ cột là một đặc điểm cấu trúc của bối cảnh khiến một giả định nền của khung lý thuyết không được thỏa mãn."));
k.push(mkTable(["Trụ cột","Giả định bị vi phạm","Bằng chứng từ ba bài toán","Giải thích cho"],
  [["I — Cạnh tranh phi giá","Người thắng được xác định bằng giá thấp nhất",
    `Tỷ lệ thắng ${pct(wr["1"],1)} ở tầng cạnh tranh thấp vượt mức 1/N; loại toàn bộ biến giá vẫn còn AUC ${f(ab[0].AUC_test,3)}; markup không phản ứng với N`,"Bác bỏ H1"],
   ["II — Thời điểm phát sinh chi phí xử lý","Biến giá có thể điều tiết tải của nguồn lực khan hiếm",
    `Pricing độc lập với Sales (r = ${f(tq.Sales_Days.Pricing_Days,3)}); thời gian xử lý không ảnh hưởng xác suất thắng; giả dược cho ${fp(pl.dong_gop_dieu_tiet_pp,2)} điểm`,"Bác bỏ H2"],
   ["III — Phân phối chi phí B2B","Tồn tại một miền chi phí chung cho mọi đối tượng dự thầu",
    `Hai đặc tả miền chi phí thất bại đối xứng: ${pct(nA.clip,1)} kẹp trần và ${pct(nB.clip,0)} kẹp sàn`,"Củng cố trụ cột I"]],
  [1900,2300,3400,1400]));
k.push(cap("Bảng 5.1: Ba trụ cột biện luận nguyên nhân của hai kết quả kiểm định âm"));
k.push(p("Điểm khác biệt của phần biện luận này so với một thảo luận thông thường là mỗi trụ cột được chống đỡ bởi bằng chứng từ nhiều hơn một bài toán. Trụ cột II là trường hợp rõ nhất: ba phương pháp khác nhau, trên ba cấp phân tích khác nhau, cùng chỉ về một kết luận mà không bài toán nào được thiết kế để tìm ra nó."));

/* ═══ 5.2 ═══ */
k.push(h2("5.2. Trụ cột I — Cạnh tranh phi giá và giới hạn của mô hình đấu thầu thuần giá"));
k.push(p(`Ba mảnh bằng chứng độc lập cùng chỉ về một nguyên nhân. Thứ nhất, doanh nghiệp thắng ${pct(wr["1"],1)} số dòng hàng ở tầng cạnh tranh thấp và ${pct(wr["3"],1)} ở tầng cao, trong khi một nhà thầu đối xứng trong cân bằng chỉ thắng với xác suất 1/N — tối đa 50% khi N = 2. Tỷ lệ thắng quan sát vượt mức mà bất kỳ cấu hình N khả thi nào cho phép. Thứ hai, ablation ở mục 4.2.3 cho thấy khi loại toàn bộ biến giá, mô hình vẫn đạt AUC ${f(ab[0].AUC_test,4)}; các yếu tố phi giá tự chúng dự báo được kết quả ở mức có ý nghĩa thực tiễn. Thứ ba, kiểm định H1 cho độ dốc ${f(H.slope,4)} — hệ số markup không phản ứng với số đối thủ.`));
k.push(p("Ba hiện tượng này là ba triệu chứng của cùng một sai lệch đặc tả: mô hình giả định cuộc thầu được quyết định hoàn toàn bằng giá, trong khi dữ liệu cho thấy một phần đáng kể quyết định mua đến từ điểm chất lượng nhà cung cấp, tồn kho cam kết giao, chứng nhận phê duyệt mặt hàng và quan hệ hiện hữu. Khi mô hình không biết đến lợi thế phi giá, nó buộc phải quy toàn bộ tỷ lệ thắng cao vào quyền lực định giá, và đề xuất mức markup vượt xa thực tế."));
k.push(p([run("Cần phân biệt rạch ròi: ",{bold:true}),
  run("đây không phải bằng chứng lý thuyết của Krishna (2009) sai. Lý thuyết đúng trong phạm vi giả định của nó. Cái thất bại là phép ánh xạ từ lý thuyết sang bối cảnh thực nghiệm này, nơi giả định cạnh tranh thuần giá bị vi phạm ở mức có thể đo được. Khung lý thuyết đúng cho tình huống này là đấu giá chấm điểm (Che, 1993), nhưng hàm điểm của khách hàng không quan sát được trong dữ liệu ERP và việc ước lượng nó là một đề tài riêng, đã được tuyên bố ngoài phạm vi từ mục 2.2.5.",{})]));

/* ═══ 5.3 ═══ */
k.push(h2("5.3. Trụ cột II — Thời điểm phát sinh chi phí xử lý so với thời điểm quyết định giá"));
k.push(h3("5.3.1. Kênh tác động giả định không tồn tại trong quy trình thực"));
k.push(p("Giả thuyết H2 dựa trên một kênh tác động ngầm: chào giá cao hơn khi hàng đợi sâu sẽ làm giảm số hồ sơ thắng, qua đó giảm tải cho đội định giá. Kênh này không tồn tại trong quy trình thực. Công việc định giá phát sinh khi hồ sơ được đưa vào hàng đợi và được xử lý — bất kể sau đó thắng hay thua. Quyết định về giá diễn ra sau khi hồ sơ đã vào hàng đợi. Nâng giá không làm giảm khối lượng việc đã phát sinh; nó chỉ làm giảm xác suất thắng."));
k.push(p("Hệ quả về phương pháp luận: đòn bẩy phù hợp để quản lý năng lực xử lý là quyết định tiếp nhận và điều phối — hồ sơ nào được nhận, xử lý theo thứ tự nào, dành bao nhiêu công sức — chứ không phải giá. Đây chính là dạng nguyên bản của bid-price control ở Talluri và van Ryzin (2004), như đã lưu ý ở mục 2.2.4: chấp nhận một yêu cầu khi và chỉ khi giá trị của nó vượt giá bóng của tài nguyên mà nó tiêu thụ. Biến quyết định tương thích với khái niệm giá bóng trong bối cảnh này là quyết định tiếp nhận, không phải mức giá chào."));

k.push(h3("5.3.2. Ba bằng chứng hội tụ từ ba bài toán"));
k.push(p("Kết luận trên không chỉ dựa trên lập luận về quy trình. Nó được ba bài toán xác nhận độc lập, và đây là đóng góp mà cấu trúc ba bài toán của luận văn tạo ra."));
k.push(mkTable(["Bài toán","Bằng chứng","Ý nghĩa đối với kênh tác động"],
  [["BT1 — mục 4.1.4",`Thời gian khâu Pricing gần như không tương quan với thời gian khâu Sales (r = ${f(tq.Sales_Days.Pricing_Days,3)}), trong khi WBS–SC tương quan ${f(tq.WBS_Days.SC_Days,3)}`,"Hàng đợi Pricing được quyết định bởi tồn đọng của chính nó, không bởi tải ở đầu chuỗi; giá chào — quyết định ở khâu Pricing — không tác động ngược lên cái đã vào hàng đợi"],
   ["BT2 — mục 4.2.1, 4.2.3",`Thời gian xử lý dự báo có hệ số ${f(gTAT.beta_z,4)} (p = ${f(gTAT.p,3)}), dấu dương; loại nhóm năng lực xử lý làm AUC thay đổi ${(ab[5].delta_AUC>=0?"+":"")+f(ab[5].delta_AUC,4)}`,"Khách hàng không phạt phản hồi chậm bằng cách chọn đối thủ. Ngay cả khi thành phần năng lực làm giảm thời gian xử lý, lợi ích không chuyển thành xác suất thắng"],
   ["BT3 — mục 4.3.6",`Điều tiết giá theo độ sâu hàng đợi đóng góp ${fp(pl.dong_gop_dieu_tiet_pp,3)} điểm phần trăm so với nhánh giả dược`,"Trực tiếp: cơ chế không tạo giá trị đo được"]],
  [1700,3700,3600]));
k.push(cap("Bảng 5.2: Ba bằng chứng hội tụ về việc giá chào không phải đòn bẩy cho năng lực xử lý"));
k.push(p("Ba bằng chứng này thu được từ ba phương pháp khác nhau — phân tích tương quan giữa các khâu, hồi quy logistic, và đánh giá phản thực có đối chứng — trên ba cấp phân tích khác nhau. Không bài toán nào được thiết kế để kiểm tra kênh tác động của H2; chúng hội tụ về cùng một kết luận một cách độc lập. Đây là dạng bằng chứng mạnh hơn nhiều so với một kiểm định đơn lẻ."));

k.push(h3("5.3.3. Kiểm tra phương án điều phối và độ lớn của giá bóng"));
k.push(p("Nếu đòn bẩy đúng là tiếp nhận, câu hỏi tiếp theo là quy tắc tiếp nhận theo giá bóng có tạo khác biệt không. Kiểm tra trên cùng tập kiểm tra: hạ ưu tiên những hồ sơ có lợi nhuận kỳ vọng thấp hơn giá bóng của suất xử lý mà chúng chiếm."));
k.push(mkTable(["Đại lượng","Giá trị","Ghi chú"],
  [["Lợi nhuận kỳ vọng trung vị mỗi hồ sơ",`${f(TR.E_profit_median_rfq,1)} USD`,"Theo chính sách CBPO trên tập kiểm tra"],
   [`Giá bóng mỗi hồ sơ tại Q trung vị = ${f(TR.Q_median,0)}`,`${f(TR.lam_rfq_median,2)} USD`,`Bằng ${f(TR.lam_over_E_pct,1)}% lợi nhuận hồ sơ trung vị`],
   ["Số hồ sơ có lợi nhuận kỳ vọng dưới giá bóng",`${TR.n_below} / ${TR.n_rfq_test} = ${f(TR.pct_below,1)}%`,"Nhóm ứng viên hạ ưu tiên"],
   ["Phần lợi nhuận của nhóm đó",`${f(TR.profit_share_below_pct,2)}%`,"Không đáng kể"],
   ["Phần khối lượng xử lý của nhóm đó",`${f(TR.items_share_below_pct,2)}%`,"Không giải phóng được năng lực"]],
  [3600,2200,3200]));
k.push(cap("Bảng 5.3: Kiểm tra quy tắc tiếp nhận theo giá bóng — giá bóng quá nhỏ để ràng buộc bất kỳ quyết định nào"));
k.push(p(`Kết luận mạnh hơn kết luận ở Chương 4 và cần phát biểu đúng mức: ở mức hiệu chỉnh đang dùng, giá bóng của năng lực định giá nhỏ hơn một bậc độ lớn so với lợi nhuận đang tranh chấp mỗi hồ sơ. Vì vậy không cơ chế xét năng lực nào — dù cộng vào giá hay dùng làm ngưỡng tiếp nhận — có thể tạo khác biệt vật chất. Hàng đợi có ý nghĩa vận hành rõ rệt (${pct(B3.logit_breach.breach_rate,1)} hồ sơ vi phạm cam kết; hệ số Q trong hồi quy logistic có p = ${B3.logit_breach.p.toExponential(1).replace(".",",")}), nhưng quy đổi thành tiền ở mức hiệu chỉnh này thì chưa đủ lớn để thay đổi quyết định kinh tế.`));
k.push(p([run(`Kết luận này phụ thuộc vào tham số π_SLA`,{}),fn("Tham số π_SLA được hiệu chỉnh ở mức 0,50 lần biên lợi nhuận trung bình mỗi dòng hàng vì không có số liệu kế toán về chi phí thực của một lần vi phạm cam kết. Mức này là giả định bảo thủ, và toàn bộ kết luận về độ lớn của giá bóng cần được đọc như có điều kiện trên giả định đó."),
  run(`, và dẫn tới một câu hỏi định lượng cụ thể cần doanh nghiệp xác định bằng số liệu kế toán: chi phí thực của một lần vi phạm cam kết thời gian là bao nhiêu? Để giá bóng đạt ngang lợi nhuận hồ sơ trung vị — tức đủ sức ràng buộc quyết định — π_SLA phải vào khoảng ${f(TR.pi_breakeven_x_margin,1)} lần biên lợi nhuận trung bình, tương đương ${f(TR.pi_breakeven_USD,0)} USD mỗi lần trễ hạn. Con số này không phi lý nếu một lần trễ hạn làm tăng rủi ro mất quan hệ với khách hàng chiến lược; nhưng nó cần được kế toán xác nhận, không phải giả định trong một luận văn.`,{})]));

/* ═══ 5.4 ═══ */
k.push(h2("5.4. Trụ cột III — Bản chất phân phối chi phí trong phân phối vật tư B2B"));
k.push(p("Trụ cột thứ ba giải thích một hiện tượng đã ghi nhận ở mục 4.3.4: vì sao mọi nỗ lực ánh xạ miền chi phí của mô hình cân bằng sang dữ liệu thực đều dẫn tới nghiệm nằm ngoài dải hành vi quan sát. Nó củng cố trụ cột I bằng một cơ chế độc lập."));
k.push(p("Nghiệm cân bằng dạng đóng đòi hỏi một cận trên c_max xác định của miền chi phí mà từ đó chi phí của mọi đối thủ được rút ra. Trong mô hình gốc, c_max là kiến thức chung của một cuộc đấu giá đơn lẻ cho một đối tượng duy nhất. Trong phân phối vật tư công nghiệp, mỗi hồ sơ chứa nhiều dòng hàng dị chất, và giá vốn mỗi dòng hàng trải trên dải từ 15,8 đến 599,5 USD — chênh nhau gần bốn mươi lần. Không tồn tại một c_max duy nhất mô tả đồng thời cả hai đầu của dải này."));
k.push(mkTable(["Đặc tả","Cách xác định c_max","Giả định ngầm","Hệ quả trên dữ liệu"],
  [["A — Tuyệt đối theo nhóm hàng","Phân vị 99 giá vốn trong từng nhóm vật liệu","Mọi dòng hàng cùng nhóm cạnh tranh trên cùng miền chi phí",`Markup đề xuất vượt trần ở ${pct(nA.clip,1)} dòng hàng; trung vị trước kẹp ${f(nA.median_mk_unclipped,3)} so với P95 ${f(dm.P95,4)}`],
   ["B — Tỷ lệ theo dòng hàng",`c_max = c(1 + δ), δ = ${f(B3.delta_B,3)} từ độ phân tán giá mục tiêu / giá vốn`,"Độ phân tán chi phí giữa đối thủ tỷ lệ với quy mô chi phí",`Markup đề xuất xuống dưới sàn ở ${pct(nB.clip,0)} dòng hàng; trung vị ${f(nB.median_mk_unclipped,3)} so với P5 ${f(dm.P5,4)}`]],
  [1900,2400,2200,2500]));
k.push(cap("Bảng 5.4: Hai đặc tả miền chi phí và hai dạng thất bại đối xứng"));
k.push(p("Diễn giải kinh tế của cặp thất bại này là điểm cốt lõi. Nếu cạnh tranh thực sự thuần giá và các đối thủ thực sự rút chi phí từ một miền chung, thì tồn tại ít nhất một đặc tả hợp lý của miền đó cho ra nghiệm nằm trong dải hành vi quan sát — bởi chính hành vi quan sát, theo H1, là kết quả của cân bằng. Việc cả hai đặc tả đều đẩy nghiệm ra ngoài dải, theo hai hướng đối lập, cho thấy dải markup thực tế không được sinh ra từ một cơ chế cân bằng thuần giá trên một miền chi phí chung. Nó được sinh ra từ chính sách thương mại nội bộ có tính đến các yếu tố mà mô hình không chứa — đúng những yếu tố phi giá đã nhận diện ở trụ cột I."));
k.push(p("Hệ quả phương pháp luận chuyển giao được: tỷ lệ khuyến nghị bị kẹp biên là một chỉ báo chẩn đoán rẻ và nhạy. Khi một công thức lý thuyết cho đa số khuyến nghị nằm ngoài dải hành vi lịch sử, giá trị của khuyến nghị không đến từ lý thuyết mà từ ràng buộc kỹ thuật áp lên nó; mức cải thiện đo được, nếu có, phải được kiểm chứng lại bằng một chính sách đơn giản có cùng tác động trung bình. Đây chính là lý do kiểm chứng giả dược được thiết kế, và là tiêu chí thứ ba trong bộ chẩn đoán ở mục 6.2.1."));

/* ═══ 5.5 ═══ */
k.push(h2("5.5. Hạn chế"));
k.push(h3("5.5.1. Hạn chế về dữ liệu"));
k.push(p([run("Hạn chế nghiêm trọng nhất là cấu trúc ghi nhận giá. ",{bold:true}),
  run("Trong bộ dữ liệu, giá chào bằng đúng tích giá vốn với hệ số markup trên toàn bộ dòng hàng, do quy trình chuẩn hóa và ẩn danh hóa. Hệ quả: hệ số markup hầu như không mang thông tin về thị trường, và điều này được xác nhận ở mục 4.2.4 khi hệ số markup không có ý nghĩa thống kê trong mô hình xác suất thắng. Phần kết luận không bị ảnh hưởng là toàn bộ BT3, vì nó dùng chỉ số cạnh tranh giá — tỷ số giá mục tiêu trên giá chào — làm biến giá, và biến này mang thông tin thực về mặt bằng giá khách hàng kỳ vọng.",{})]));
k.push(p("Bộ dữ liệu đã trải qua bước xử lý bảo mật có tiêm nhiễu. Các độ lớn định lượng trong luận văn là độ lớn trên phiên bản đã xử lý, không phải trên dữ liệu vận hành nguyên bản. Kết luận định tính — thứ tự các khâu, dấu của kiểm định, tỷ lệ kẹp biên, cấu trúc tương quan — bền vững hơn từng con số cụ thể."));
k.push(p("Ba hạn chế còn lại đã khai báo từ đầu và được xác nhận là ràng buộc thật: không quan sát được giá chào của đối thủ, khiến N không nhận dạng được (mục 4.3.2); vùng hàng đợi sâu hơn 30 chỉ chứa khoảng 1% quan sát, buộc phải chặn trên giá bóng; và kỳ quan sát 299 ngày chưa đủ tách hiệu ứng mùa vụ."));
k.push(h3("5.5.2. Hạn chế về mô hình"));
k.push(p(`Phân tích độ nhạy ở mục 4.3.7 cho thấy hai giả định của mô hình cân bằng không trung lập: kết quả đặc tả A đảo dấu khi N tại tầng thấp vượt khoảng 3, và đảo dấu khi thay phân phối đều bằng phân phối tam giác (${fp(B3.sensitivity.F_family.Uniform,2)} thành ${fp(B3.sensitivity.F_family.Triangular,2)}). Giả định đối xứng giữa các nhà thầu bị chính dữ liệu bác bỏ nhưng không có cách khắc phục trong phạm vi thuần giá. Và quan trọng nhất, đánh giá được thực hiện tĩnh trong một kỳ: không có vòng phản hồi từ quyết định hôm nay sang trạng thái hàng đợi ngày mai, nên ngay cả khi kênh tác động của H2 tồn tại, khung đánh giá hiện tại cũng không đo được nó.`));
k.push(p(`Với BT2, mô hình logistic hơi lạc quan: dự báo cao hơn thực tế ${f(B12.bt2_calib.deviation_pct,1)}% về số dòng hàng thắng trên tập kiểm tra, và ${fp(B3.hieu_chuan_tong_hop.lech_pct,1)} về lợi nhuận tại giá lịch sử. Mọi uplift trong Chương 4 vì vậy có xu hướng lạc quan nhẹ ở mức tương tự.`));
k.push(h3("5.5.3. Hạn chế về suy luận nhân quả"));
k.push(p("Toàn bộ uplift trong luận văn là lợi nhuận kỳ vọng theo một mô hình học máy trên dữ liệu quan sát. Không có can thiệp ngẫu nhiên hóa nào được thực hiện, nên không có phát biểu nhân quả nào được chứng minh. Mô hình xác suất thắng được huấn luyện trên các mức giá lịch sử và phải ngoại suy khi chính sách đề xuất giá khác; rủi ro này được kiểm soát bằng cơ chế kẹp trong dải markup quan sát và bằng việc báo cáo tường minh tỷ lệ ngoài dải, nhưng không biện pháp nào thay thế được thực nghiệm. Thiết kế ở mục 3.6 và 4.5 là bước duy nhất chuyển các con số này thành bằng chứng."));
k.push(h3("5.5.4. Hạn chế về khái quát hóa"));
k.push(p("Nghiên cứu dựa trên một doanh nghiệp, một thị trường. Đặc điểm quyết định kết quả — lợi thế phi giá lớn, biên lợi nhuận mỗi dòng hàng nhỏ so với chi phí xử lý, khách hàng không phạt phản hồi chậm — có thể không đúng ở doanh nghiệp khác. Chính những đặc điểm đó lại là lý do khung cân bằng thuần giá không áp dụng được; ở một nhà thầu xây lắp với ít hợp đồng giá trị lớn và cạnh tranh chủ yếu bằng giá, kết luận nhiều khả năng sẽ khác. Vì vậy đóng góp khái quát được của luận văn không phải kết quả số, mà là bộ tiêu chí chẩn đoán ở Chương 6."));

/* ═══ 5.6 ═══ */
k.push(h2("5.6. Đóng góp thực chất và định vị lại"));
k.push(p("Luận văn không đưa ra được chính sách giá vượt trội dựa trên cân bằng, và không chứng minh được giá trị của định giá có xét năng lực. Định vị lại một cách trung thực, bốn đóng góp sau đứng vững."));
k.push(p([run("Đóng góp 1 — Phân rã biến động thời gian xử lý theo khâu. ",{bold:true}),
  run(`Kết quả BT1 cho ba phát hiện không tồn tại trong công trình trước: cấu trúc biến động là một khâu tách biệt và ba khâu tương đồng; ${f(B1.phan_ra_phuong_sai["hiep_phuong_sai_%"],1)}% phương sai thời gian tổng là hiệp phương sai giữa các khâu; và Pricing vận hành độc lập với đầu chuỗi. Ngoài ra, quy trình chẩn đoán giả định đã bác bỏ lựa chọn biến đổi logarit của giai đoạn trước và thay bằng thang đo gốc kèm sai số vững.`,{})]));
k.push(p([run("Đóng góp 2 — Mô hình xác suất thắng có đặc tả tường minh và hiệu chuẩn. ",{bold:true}),
  run(`AUC ngoài mẫu ${f(m2.AUC_test,3)} với sáu nhóm biến có cơ chế rõ ràng, chuẩn so sánh phi tuyến chỉ cao hơn ${f((B12.bt2_xgb.AUC_test-m2.AUC_test)*1000,1)} phần nghìn, và hai phát hiện cấu trúc: hệ số markup không phải tín hiệu giá, và thời gian xử lý không ảnh hưởng xác suất thắng.`,{})]));
k.push(p([run("Đóng góp 3 — Khung định giá theo xác suất thắng có kiểm chứng độ nhạy đầy đủ. ",{bold:true}),
  run(`Uplift kỳ vọng ${fp(cb.uplift_pct,2)}, không phụ thuộc vào bất kỳ tham số nào không nhận dạng được, kèm bản thiết kế thực nghiệm với tham số ước lượng từ dữ liệu để xác nhận.`,{})]));
k.push(p([run("Đóng góp 4 — Kết quả âm được chẩn đoán đầy đủ và kỷ luật kiểm chứng giả dược. ",{bold:true}),
  run(`Theo hiểu biết của tác giả, đây là lần đầu nghiệm cân bằng Bayesian Nash dạng đóng và giá bóng của năng lực được triển khai đồng thời trên dữ liệu báo giá B2B thực. Kết quả âm — kèm ba trụ cột nguyên nhân và điều kiện đảo chiều đã lượng hóa — có giá trị tích lũy tri thức không kém một kết quả dương. Bài học phương pháp chuyển giao được: mọi chính sách phức tạp phải được so với phiên bản đơn giản có cùng tác động trung bình; không có nhánh giả dược, kết quả thô sẽ dẫn tới kết luận rằng thành phần năng lực tạo thêm ${f(pl.cap_uplift-cb.uplift_pct,2)} điểm phần trăm lợi nhuận.`,{})]));
k.push(p(`Một hàm ý quản trị đáng lưu ý từ Bảng 4.13 dễ bị bỏ qua: chính sách cost-plus đơn giản chỉ chênh ${fp(P["Cost-Plus (markup trung vị)"].uplift_pct,2)} so với thực tế. Toàn bộ mức tinh vi mà đội định giá đang áp dụng chỉ tạo ra chưa tới 1% giá trị so với việc nhân giá vốn với một hệ số cố định. Con số này vừa cho thấy dư địa cải thiện là có thật, vừa nhắc rằng thước đo thành công của bất kỳ hệ thống định giá mới nào phải là mức vượt trên một quy tắc đơn giản, chứ không phải mức vượt trên hiện trạng.`));
return k;
};
