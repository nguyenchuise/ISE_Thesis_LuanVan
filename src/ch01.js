// CHUONG 1 — GIOI THIEU  (Run 1)
module.exports=function(L){
const {C,run,p,h1,h2,h3,cap,center,mkTable,fn,img}=L;
const fs=require("fs"); const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const S=J("ch1_stats.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−");
const pct=(x,d=2)=>f(x*100,d)+"%";
const n0=(x)=>Number(x).toLocaleString("de-DE");
const Q=S.quy_mo, SL=S.sla, PC=S.phan_ung_canh_tranh, MK=S.markup, TS=S.tan_suat;
const gapW=(PC.Low.win-PC.High.win)*100, gapM=S.bien_do_markup_giua_3_muc*100;
const k=[];

/* ═══════════ CHƯƠNG 1 ═══════════ */
k.push(h1("CHƯƠNG 1. GIỚI THIỆU"));

k.push(h2("1.1. Bối cảnh ngành và doanh nghiệp nghiên cứu"));
k.push(p("Phân phối vật tư công nghiệp là mắt xích trung gian giữa nhà sản xuất linh kiện và các doanh nghiệp sản xuất. Đặc trưng của ngành là danh mục hàng hóa rất rộng nhưng giá trị đơn vị nhỏ, biên lợi nhuận mỏng, và cạnh tranh diễn ra trên từng đơn hàng riêng lẻ thay vì trên hợp đồng dài hạn. Doanh nghiệp trong ngành không cạnh tranh bằng sản phẩm độc quyền mà bằng năng lực đáp ứng: báo giá nhanh, đúng chủng loại, bảo đảm nguồn cung và giữ được mức giá hợp lý."));
k.push(p([run("Nghiên cứu này thực hiện trên dữ liệu vận hành của một doanh nghiệp phân phối vật tư liên kết (fastener)",{}),fn("Vật tư liên kết gồm bu-lông, đai ốc, vít, chốt, vòng đệm và các chi tiết ghép nối cơ khí tiêu chuẩn; đặc trưng là danh mục rất rộng, giá trị đơn vị thấp và được mua lặp lại theo lô."),run(" và vật tư bảo trì — sửa chữa — vận hành (MRO) công nghiệp theo mô hình B2B tại Việt Nam. Quy trình cốt lõi tạo doanh thu của doanh nghiệp là quy trình báo giá: khách hàng gửi yêu cầu báo giá (Request for Quotation — RFQ), hồ sơ đi qua bốn khâu xử lý tuần tự gồm Sales tiếp nhận, WBS phân rã cấu hình kỹ thuật, Pricing tính giá và Supply Chain kiểm tra nguồn cung, sau đó báo giá được gửi lại cho khách hàng và chờ kết quả thắng hoặc thua.",{})]));
k.push(p("Mỗi hồ sơ RFQ vì vậy đồng thời là một đơn vị công việc nội bộ và một cơ hội kinh doanh. Doanh nghiệp chịu hai ràng buộc đối lập trên cùng một hồ sơ: cam kết thời gian phản hồi (Service Level Agreement — SLA) bảy ngày làm việc, và yêu cầu giữ biên lợi nhuận trong bối cảnh khách hàng luôn có phương án so sánh từ nhà cung cấp khác."));

k.push(h2("1.2. Ý nghĩa và tính cấp thiết của bài toán nghiên cứu"));
k.push(p("Mục này trả lời câu hỏi nền tảng: vì sao bài toán báo giá B2B xứng đáng là đối tượng của một nghiên cứu khoa học, thay vì chỉ là một công việc tác nghiệp thường nhật. Bốn luận cứ dưới đây đều được kiểm chứng trực tiếp trên dữ liệu vận hành của doanh nghiệp trong kỳ quan sát 299 ngày."));

k.push(h3("1.2.1. Đây là quyết định lặp lại với tần suất cao"));
k.push(p([run(`Quyết định định giá trong phân phối công nghiệp không phải quyết định chiến lược hiếm gặp mà là quyết định tác nghiệp tần suất cao. Trong kỳ quan sát, doanh nghiệp xử lý ${n0(Q.du_an)} hồ sơ RFQ chứa ${n0(Q.mat_hang)} dòng hàng cho ${Q.khach_hang} khách hàng — trung bình ${f(Q.du_an_moi_thang,1)} hồ sơ mỗi tháng và gần ${Math.round(TS.quyet_dinh_gia_moi_ngay_lam_viec)} quyết định giá mỗi ngày làm việc`,{}),fn(`Tính theo ${Q.ky_quan_sat_ngay} ngày lịch quy đổi 5/7 thành khoảng ${Math.round(Q.ky_quan_sat_ngay*5/7)} ngày làm việc; ${n0(Q.mat_hang)} / ${Math.round(Q.ky_quan_sat_ngay*5/7)} ≈ ${f(TS.quyet_dinh_gia_moi_ngay_lam_viec,1)}.`),run(".",{})]));
k.push(mkTable(
  ["Chỉ tiêu","Giá trị","Ý nghĩa"],
  [
    ["Số hồ sơ RFQ trong kỳ",n0(Q.du_an),"Đơn vị công việc và đơn vị cơ hội kinh doanh"],
    ["Số dòng hàng cần định giá",n0(Q.mat_hang),"Mỗi dòng là một quyết định giá độc lập"],
    ["Số khách hàng",String(Q.khach_hang),"Danh mục khách hàng đủ rộng để quan hệ phi giá có vai trò"],
    ["Số mặt hàng trung bình mỗi hồ sơ",f(Q.mat_hang_tb_moi_du_an,2),"Một hồ sơ là một giỏ hàng, không phải một sản phẩm"],
    ["Nhịp độ tiếp nhận",`${f(Q.du_an_moi_thang,1)} hồ sơ / tháng`,"Tải công việc ổn định, có thể dự báo"],
    ["Tần suất quyết định giá",`${f(TS.quyet_dinh_gia_moi_ngay_lam_viec,1)} quyết định / ngày làm việc`,"Vượt xa khả năng cân nhắc kỹ lưỡng thủ công"],
    ["Biên lợi nhuận trung bình mỗi mặt hàng",`${f(S.gia_tri.bien_lo_i_nhuan_tb_moi_mat_hang_USD,2)} USD`,"Giá trị mỗi quyết định nhỏ, nhưng tổng tích lũy lớn"],
    ["Tỷ lệ thắng cấp dòng hàng",pct(S.gia_tri.ty_le_thang_mat_hang,2),"Theo trạng thái đơn hàng cuối kỳ"],
  ],[3100,2200,3700]));
k.push(cap("Bảng 1.1: Quy mô và nhịp độ của quyết định định giá trong kỳ quan sát"));
k.push(p(`Cấu trúc này — tần suất cao, giá trị mỗi quyết định nhỏ, tổng tích lũy lớn — chính là dạng bài toán mà hệ thống hỗ trợ ra quyết định dựa trên dữ liệu tạo ra giá trị lớn nhất. Một cải thiện nhỏ trên mỗi quyết định, nhân với ${n0(Q.mat_hang)} quyết định trong kỳ ${Q.ky_quan_sat_ngay} ngày — tương đương khoảng ${n0(Math.round(Q.mat_hang/Q.ky_quan_sat_ngay*365/100)*100)} quyết định mỗi năm — trở thành khác biệt đáng kể ở cấp doanh nghiệp. Ngược lại, chính tần suất này khiến việc cân nhắc thủ công từng trường hợp là bất khả thi trên thực tế.`));

k.push(h3("1.2.2. Quyết định giá hiện hành gần như không phản ứng với cường độ cạnh tranh"));
k.push(p("Đây là bất thường có giá trị nghiên cứu rõ rệt nhất trong dữ liệu. Nếu chính sách giá của doanh nghiệp có tính đến bối cảnh cạnh tranh, hệ số markup phải thấp hơn ở những cơ hội nhiều đối thủ và cao hơn ở những cơ hội ít đối thủ. Dữ liệu cho thấy điều ngược lại: hệ số markup gần như bất động trong khi kết quả thắng thua biến thiên rất mạnh."));
k.push(mkTable(
  ["Cường độ cạnh tranh","Số mặt hàng","Hệ số markup trung bình","Tỷ lệ thắng"],
  [
    ["Thấp (Low)",n0(PC.Low.n),f(PC.Low.markup,4),pct(PC.Low.win)],
    ["Trung bình (Med)",n0(PC.Med.n),f(PC.Med.markup,4),pct(PC.Med.win)],
    ["Cao (High)",n0(PC.High.n),f(PC.High.markup,4),pct(PC.High.win)],
    ["Biên độ chênh lệch","—",`${f(gapM,2)} điểm phần trăm`,`${f(gapW,2)} điểm phần trăm`],
  ],[2400,1700,2600,2300],[3]));
k.push(cap("Bảng 1.2: Hệ số markup gần như bất động trong khi tỷ lệ thắng biến thiên mạnh theo cạnh tranh"));
k.push(p(`Đọc dòng cuối của bảng: khi chuyển từ nhóm cạnh tranh thấp sang nhóm cạnh tranh cao, tỷ lệ thắng giảm ${f(gapW,2)} điểm phần trăm, trong khi hệ số markup chỉ thay đổi ${f(gapM,2)} điểm phần trăm. Nói cách khác, biến động của kết quả lớn gấp khoảng ${Math.round(gapW/gapM/10)*10} lần biến động của biến quyết định. Toàn bộ hệ số markup của doanh nghiệp nằm trong một dải rất hẹp, với hệ số biến thiên chỉ ${f(MK.cv*100,2)}% quanh giá trị trung bình ${f(MK.mean,4)}.`));
k.push(p("Hiện tượng này dẫn tới hai khả năng, và cả hai đều đáng được nghiên cứu. Khả năng thứ nhất là doanh nghiệp đang bỏ lại biên lợi nhuận trên bàn ở những cơ hội ít cạnh tranh, nơi khách hàng sẵn sàng chấp nhận mức giá cao hơn. Khả năng thứ hai là doanh nghiệp đang mất những cơ hội có thể thắng ở nhóm cạnh tranh cao, nơi một mức giảm giá nhỏ đủ để đảo chiều kết quả. Việc phân định hai khả năng này bằng dữ liệu là một trong những mục tiêu của luận văn."));

k.push(img("FIG_1_2_Markup_vs_WinRate.png",520,0.4752));
k.push(cap("Hình 1.1: Tỷ lệ thắng giảm mạnh theo cạnh tranh trong khi hệ số markup gần như bất động"));
k.push(h3("1.2.3. Cam kết thời gian phản hồi đang bị vi phạm ở mức đáng kể"));
k.push(p(`Song song với bài toán giá là bài toán thời gian. Doanh nghiệp cam kết phản hồi trong bảy ngày làm việc, nhưng ${SL.so_vi_pham} trên ${n0(Q.du_an)} hồ sơ — tương đương ${pct(SL.ty_le_vi_pham)} — vượt ngưỡng này. Thời gian xử lý trung vị là ${f(SL.TAT_median,2)} ngày, tức chỉ còn biên an toàn ${f(7-SL.TAT_median,2)} ngày so với cam kết; phân vị 90 đạt ${f(SL.TAT_p90,2)} ngày, vượt cam kết gần ba ngày.`));
k.push(p("Phân rã thời gian xử lý theo bốn khâu cho thấy nút thắt nằm ở khâu Pricing với trung vị 2,1 ngày, cao hơn WBS (1,7 ngày), Supply Chain (1,2 ngày) và Sales (0,8 ngày); theo giá trị trung bình, thứ tự này không đổi (2,39 / 1,79 / 1,28 / 0,96 ngày). Đáng chú ý, đây cũng chính là khâu thực hiện quyết định định giá. Nghĩa là nguồn lực khan hiếm về thời gian và nguồn lực ra quyết định về giá là cùng một nguồn lực."));

k.push(img("FIG_1_1_TAT_SLA_Bottleneck.png",620,0.3657));
k.push(cap("Hình 1.2: (A) Phân phối thời gian xử lý so với cam kết 7 ngày; (B) trung vị thời gian từng khâu"));
k.push(h3("1.2.4. Hai bài toán ràng buộc lẫn nhau qua cùng một nguồn lực"));
k.push(p("Ba luận cứ trên hội tụ thành lý do khiến bài toán này có ý nghĩa khoa học chứ không chỉ là vấn đề tác nghiệp: tốc độ phản hồi và chất lượng định giá cạnh tranh nhau trên cùng một năng lực xử lý hữu hạn. Rút ngắn thời gian bằng cách xử lý nhanh hơn có nguy cơ làm giảm chất lượng phân tích giá; ngược lại, phân tích giá kỹ lưỡng hơn làm kéo dài hàng đợi và tăng vi phạm cam kết."));
k.push(p("Một nghiên cứu chỉ tối ưu thời gian mà bỏ qua giá, hoặc chỉ tối ưu giá mà bỏ qua ràng buộc năng lực, sẽ không mô tả đúng đánh đổi mà doanh nghiệp thực sự đối mặt. Đây chính là khoảng trống mà luận văn hướng tới: xử lý hai bài toán trong cùng một khung phân tích, trên cùng một bộ dữ liệu, với cùng một quy trình kiểm chứng."));
k.push(p("Về mặt học thuật, bài toán còn có giá trị ở chỗ nó là một trường hợp kiểm nghiệm cho việc chuyển giao các mô hình lý thuyết sang bối cảnh vận hành thực. Tài liệu về định giá đấu thầu cạnh tranh đã có nền tảng vững từ Friedman (1956), nhưng phần lớn nghiên cứu thực nghiệm tập trung vào các cuộc thầu giá trị lớn, ít lần lặp, trong khi bối cảnh phân phối công nghiệp có đặc điểm ngược hẳn. Việc kiểm chứng ranh giới áp dụng của các mô hình này trong bối cảnh tần suất cao, giá trị nhỏ, cạnh tranh đa chiều là đóng góp có tính khái quát."));

k.push(h2("1.3. Nền tảng đã có và giới hạn của nền tảng đó"));
k.push(p("Luận văn kế thừa trực tiếp từ công trình nghiên cứu độc lập trước đó của tác giả trên cùng bộ dữ liệu, trong đó ba bài toán đã được thiết lập và giải quyết ở mức độ mô tả và dự báo. Việc phân định rạch ròi phần đã có và phần mở rộng là nguyên tắc xuyên suốt của luận văn này."));
k.push(mkTable(
  ["Bài toán","Nội dung đã thực hiện","Giới hạn cần khắc phục"],
  [
    ["BT1 — Dự báo thời gian xử lý","Hồi quy thời gian xử lý tổng theo hai bộ đặc trưng; xác định giá trị gia tăng của thông tin phát sinh ở giai đoạn sau","Chỉ dự báo thời gian tổng; chưa tách theo từng khâu nên không chẩn đoán được nguồn gốc biến động; chưa kiểm tra giả định hồi quy"],
    ["BT2 — Dự báo thắng/thua","Phân loại kết quả thắng thua trên bộ đặc trưng thương mại và kỹ thuật","Chưa phát biểu tường minh hàm thắng/thua và cơ chế liên hệ với từng biến; chưa hiệu chuẩn xác suất; chưa báo cáo chỉ số ngoài mẫu đúng cách"],
    ["BT3 — Tối ưu giá báo thầu","Khung tối ưu giá theo xác suất thắng, dạng best-response một phía (Friedman, 1956)","Coi hành vi đối thủ là ngoại sinh; không có ràng buộc năng lực xử lý; chưa kiểm định giả thuyết một cách chính thức"],
  ],[2100,3400,3500]));
k.push(cap("Bảng 1.3: Ranh giới giữa nền tảng đã có và phần cần mở rộng"));
k.push(p("Cần nêu rõ một giới hạn chung của cả ba bài toán ở giai đoạn trước: kết luận được rút ra bằng cách so sánh mô tả giữa các kịch bản, không phải bằng kiểm định giả thuyết đã đăng ký trước. Một kết luận không thể bị bác bỏ thì không tạo ra tri thức tích lũy. Việc chuyển từ so sánh mô tả sang kiểm định giả thuyết là thay đổi phương pháp luận quan trọng nhất của luận văn so với nền tảng đã có."));

k.push(h2("1.4. Khoảng trống nghiên cứu"));
k.push(p([run("Khoảng trống 1 — Biến động thời gian xử lý chưa được phân rã theo nguồn gốc. ",{bold:true,color:C.RED}),
  run("Dự báo thời gian tổng cho biết hồ sơ mất bao lâu, nhưng không cho biết biến động đến từ đâu. Trong khi đó, chính cấu trúc biến động theo khâu mới là thông tin cần thiết để quyết định can thiệp ở đâu: nếu bốn khâu có mức biến động tương đương thì vấn đề mang tính hệ thống và thuộc về năng lực tổ chức; nếu biến động khác nhau rõ rệt giữa các khâu thì vấn đề nằm ở độ phức tạp không đồng đều của hồ sơ và thời điểm tiếp nhận.",{})]));
k.push(p([run("Khoảng trống 2 — Hàm thắng/thua chưa được đặc tả tường minh. ",{bold:true,color:C.RED}),
  run("Một mô hình phân loại có thể cho kết quả dự báo tốt mà vẫn không giải thích được cơ chế. Để mô hình dự báo thắng thua trở thành đầu vào hợp lệ cho bài toán định giá, cần phát biểu rõ dạng hàm, hàm liên kết, và cơ chế kinh tế qua đó từng nhóm biến tác động lên xác suất thắng.",{})]));
k.push(p([run("Khoảng trống 3 — Định giá và ràng buộc năng lực xử lý được xử lý tách rời. ",{bold:true,color:C.RED}),
  run("Khung tối ưu giá hiện có coi năng lực xử lý là không giới hạn, trong khi dữ liệu cho thấy khâu Pricing là nút thắt và 37,67% hồ sơ vi phạm cam kết. Chưa có nghiên cứu nào trên bối cảnh này đặt hai bài toán vào cùng một hàm mục tiêu.",{})]));

k.push(h2("1.5. Mục tiêu và câu hỏi nghiên cứu"));
k.push(p("Luận văn đặt ra ba câu hỏi nghiên cứu tương ứng với ba bài toán, được sắp theo thứ tự phụ thuộc: đầu ra của bài toán trước là đầu vào của bài toán sau."));
k.push(mkTable(
  ["Bài toán","Câu hỏi nghiên cứu","Đầu ra kỳ vọng"],
  [
    ["BT1","Biến động thời gian xử lý phân bố như thế nào giữa bốn khâu, và cấu trúc biến động đó nói lên điều gì về mức độ ổn định của tổ chức và độ phức tạp của hồ sơ?","Mô hình dự báo thời gian từng khâu và thời gian tổng; chẩn đoán nguồn gốc biến động"],
    ["BT2","Xác suất thắng của một dòng hàng được xác định bởi những yếu tố nào, và các yếu tố phi giá đóng góp tới mức nào so với yếu tố giá?","Mô hình xác suất thắng có hiệu chuẩn, có đặc tả tường minh và diễn giải được"],
    ["BT3","Mức giá nào tối đa hóa lợi nhuận kỳ vọng khi đã biết xác suất thắng, và ràng buộc năng lực xử lý ảnh hưởng thế nào tới mức giá đó?","Khung định giá theo xác suất thắng; đánh giá vai trò của ràng buộc năng lực"],
  ],[900,4400,3700]));
k.push(cap("Bảng 1.4: Ba bài toán nghiên cứu và quan hệ phụ thuộc giữa chúng"));
k.push(p("Riêng với bài toán thứ ba, luận văn phát biểu hai giả thuyết kiểm định được, nhằm chuyển việc đánh giá khung định giá mở rộng từ so sánh mô tả sang kiểm định thống kê chính thức. Phạm vi của hai giả thuyết này giới hạn trong BT3 và không áp dụng cho BT1 hay BT2."));
k.push(p([run("Giả thuyết H1 — giả thuyết giá cân bằng. ",{bold:true}),
  run("Chính sách giá xây dựng trên nghiệm cân bằng Bayesian Nash dạng đóng tạo ra lợi nhuận kỳ vọng cao hơn có ý nghĩa so với chính sách best-response một phía. Hệ quả so sánh tĩnh có thể kiểm định: biên giá tỷ lệ nghịch với số đối thủ, tức độ co giãn của logarit biên giá theo logarit số đối thủ xấp xỉ âm một. Hệ quả này được kiểm định theo hai mặt: trên hành vi định giá lịch sử của doanh nghiệp, và trên mức giá do mô hình tối ưu sinh ra.",{})]));
k.push(p([run("Giả thuyết H2 — giả thuyết giá bóng của năng lực. ",{bold:true}),
  run("Việc đưa giá bóng (shadow price) của năng lực xử lý vào giá chào cải thiện đồng thời lợi nhuận và mức tuân thủ cam kết thời gian. Hệ quả có thể kiểm định: thành phần điều tiết theo độ sâu hàng đợi đóng góp một phần dương và phân biệt được với một chính sách nâng giá đồng loạt có cùng tác động trung bình. Vì đánh giá tĩnh một kỳ không có vòng phản hồi từ quyết định hôm nay sang hàng đợi ngày mai, H2 được kiểm định thêm trong một nghiên cứu mô phỏng liên kỳ có kiểm soát (Mục 4.4), nơi giá bóng được dùng đồng thời làm tín hiệu giá và làm tiêu chí phân luồng tại pha Sales-WBS.",{})]));

k.push(h2("1.6. Phạm vi, giả định và giới hạn khai báo trước"));
k.push(p("Ba giới hạn sau được khai báo ngay từ đầu vì chúng chi phối phạm vi hiệu lực của mọi kết luận trong luận văn."));
k.push(p([run("Thứ nhất, không quan sát được giá chào của đối thủ. ",{bold:true}),
  run("Dữ liệu chỉ ghi nhận giá chào của doanh nghiệp và kết quả thắng thua, không ghi nhận mức giá mà đối thủ đưa ra. Hệ quả là các phương pháp ước lượng cấu trúc phi tham số nhằm khôi phục phân phối chi phí tiềm ẩn của đối thủ không khả thi, và mọi ước lượng về số đối thủ hiệu dụng đều là hiệu chỉnh chứ không phải nhận dạng.",{})]));
k.push(p([run("Thứ hai, cạnh tranh không thuần giá. ",{bold:true}),
  run("Quyết định mua của khách hàng chịu ảnh hưởng của các yếu tố phi giá như điểm chất lượng nhà cung cấp, tình trạng tồn kho cam kết giao, chứng nhận phê duyệt mặt hàng và quan hệ khách hàng hiện hữu. Luận văn mô hình hóa các yếu tố này như biến điều kiện, không mô hình hóa hàm điểm của khách hàng.",{})]));
k.push(p([run("Thứ ba, dữ liệu đã qua xử lý bảo mật. ",{bold:true}),
  run("Bộ dữ liệu đã trải qua bước chuẩn hóa và ẩn danh hóa theo yêu cầu bảo mật của doanh nghiệp. Do đó các kết luận định tính — thứ tự các khâu, dấu của hệ số, cấu trúc biến động — bền vững hơn từng con số tuyệt đối cụ thể. Mọi phát biểu định lượng trong luận văn được hiểu trong phạm vi bộ dữ liệu này.",{})]));
k.push(p([run("Thứ tư, dữ liệu liên kết đa phân hệ. ",{bold:true}),
  run("Ngoài các trường ERP, bộ dữ liệu chứa ba trường liên kết từ phân hệ CRM và Sourcing — số đối thủ thực tế của cơ hội, chỉ số nhạy cảm cam kết thời gian, và cận trên giá dự trữ cấp dòng hàng — cùng trạng thái thắng/thua theo trạng thái đơn hàng cuối kỳ. Định nghĩa và cách dùng từng trường được trình bày ở Mục 3.1.",{})]));
k.push(p("Về phạm vi không gian và thời gian, nghiên cứu dựa trên một doanh nghiệp, một thị trường, kỳ quan sát 299 ngày. Phần mô phỏng ở Mục 4.4 là mô phỏng phản thực dựa trên mô hình, không phải dữ liệu quan sát. Việc khái quát hóa sang doanh nghiệp khác cần được kiểm tra lại bằng chính bộ tiêu chí chẩn đoán mà luận văn đề xuất."));

k.push(h2("1.7. Đóng góp kỳ vọng"));
k.push(p("Luận văn hướng tới năm đóng góp, sắp theo mức độ chắc chắn giảm dần."));
k.push(p([run("Đóng góp 1 — Phân rã biến động thời gian xử lý theo khâu. ",{bold:true}),
  run("Chuyển từ dự báo thời gian tổng sang phân tích cấu trúc biến động giữa bốn khâu, cho phép xác định khâu nào bất ổn định nhất và mức độ đồng biến động giữa các khâu. Đây là thông tin cần thiết để thiết kế can thiệp vận hành, và chưa tồn tại trong nền tảng đã có.",{})]));
k.push(p([run("Đóng góp 2 — Đặc tả tường minh và hiệu chuẩn mô hình xác suất thắng. ",{bold:true}),
  run("Phát biểu rõ dạng hàm, hàm liên kết và cơ chế kinh tế của từng nhóm biến, kèm hiệu chuẩn xác suất và báo cáo chỉ số ngoài mẫu theo quy tắc chống rò rỉ dữ liệu. Mô hình khi đó mới đủ điều kiện làm đầu vào cho bài toán định giá.",{})]));
k.push(p([run("Đóng góp 3 — Khung định giá theo xác suất thắng có kiểm chứng. ",{bold:true}),
  run("Xây dựng và đánh giá khung tối ưu giá trên cơ sở xác suất thắng đã hiệu chuẩn, kèm phân tích độ nhạy đầy đủ và khai báo tường minh phạm vi ngoại suy.",{})]));
k.push(p([run("Đóng góp 4 — Kiểm định ranh giới áp dụng của mô hình cân bằng. ",{bold:true}),
  run("Kiểm định hai giả thuyết mở rộng bằng phương pháp thống kê chính thức và kiểm chứng giả dược, qua đó xác định điều kiện mà dưới đó các mô hình lý thuyết đấu giá áp dụng được hoặc không áp dụng được trong bối cảnh phân phối công nghiệp — gồm việc đối sánh ba đặc tả miền chi phí A, B và C.",{})]));
k.push(p([run("Đóng góp 5 — Mô phỏng điều phối liên kỳ và mặt phẳng chuyển pha. ",{bold:true}),
  run("Xây dựng mô hình mô phỏng hàng đợi và định giá neo vào 1.500 hồ sơ thực, so sánh bốn cơ chế vận hành có nhánh giả dược, và xác định vùng tham số — độ nhạy thời gian của khách hàng và chi phí vi phạm cam kết — trong đó phân luồng theo giá bóng tại pha Sales-WBS tạo ra giá trị vượt nhánh nâng giá đồng loạt.",{})]));

k.push(h2("1.8. Cấu trúc luận văn"));
k.push(p("Chương 2 tổng quan tài liệu theo hai nhánh: nền tảng thống kê và học máy cho bài toán dự báo, và nền tảng lý thuyết định giá đấu thầu cạnh tranh; đồng thời định vị khoảng trống nghiên cứu. Chương 3 trình bày phương pháp, gồm quy trình khai phá dữ liệu, đặc tả toán học của ba mô hình, quy tắc chẩn đoán giả định và bộ chỉ số đánh giá. Chương 4 trình bày kết quả thực nghiệm cho cả ba bài toán, nghiên cứu mô phỏng có kiểm soát (Mục 4.4), tổng hợp và tham số thiết kế thực nghiệm. Chương 5 thảo luận nguyên nhân của các kết quả và các hạn chế. Chương 6 kết luận, rút ra khung ứng dụng và khuyến nghị vận hành."));

return k;
};
