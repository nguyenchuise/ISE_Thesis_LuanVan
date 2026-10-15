// CHUONG 3 — PHUONG PHAP NGHIEN CUU  (Run 3)
module.exports=function(L){
const {C,run,p,h1,h2,h3,cap,fx,mkTable,fn,img}=L;
const fs=require("fs"); const J=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const DA=J("data_audit.json"), B12=J("ch4_bt12.json");
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−");
const k=[];

k.push(h1("CHƯƠNG 3. PHƯƠNG PHÁP NGHIÊN CỨU"));
k.push(p("Chương này trình bày phương pháp cho ba bài toán đã phát biểu ở mục 1.5. Mục 3.1 mô tả dữ liệu và quy trình chuẩn bị chung. Ba mục tiếp theo trình bày đặc tả toán học và quy trình phân tích của từng bài toán, theo đúng thứ tự phụ thuộc: đầu ra của BT1 là đầu vào của BT2, và đầu ra của BT2 là đầu vào của BT3. Mục 3.4 kết thúc bằng thiết kế nghiên cứu mô phỏng liên kỳ (Mục 3.4.6), phần phương pháp cho Mục 4.4. Mục 3.5 chốt bộ chỉ số đánh giá áp dụng thống nhất cho toàn luận văn; mục 3.6 trình bày thiết kế thực nghiệm kiểm chứng."));

k.push(img("FIG_3_1_Methodology.png",640,0.5097));
k.push(cap("Hình 3.1: Khung phương pháp — trục khai phá dữ liệu theo CRISP-DM cho BT1 và BT2, trục tối ưu giá và kiểm định giả thuyết cho BT3"));
/* ══════════ 3.1 ══════════ */
k.push(h2("3.1. Dữ liệu và quy trình chuẩn bị"));

k.push(h3("3.1.1. Nguồn dữ liệu và cấu trúc hai cấp"));
k.push(p("Dữ liệu trích xuất từ hệ thống hoạch định nguồn lực doanh nghiệp (ERP) của đơn vị nghiên cứu, gồm hai bảng ở hai cấp phân tích khác nhau và liên kết với nhau qua khóa dự án. Luận văn sử dụng bản trích xuất lại (bản v3), trong đó mỗi bảng được bổ sung các trường liên kết từ phân hệ quản trị quan hệ khách hàng (CRM) và phân hệ tìm nguồn (Sourcing), cùng trạng thái đơn hàng đã đối soát cuối kỳ."));
k.push(mkTable(
  ["Bảng","Cấp phân tích","Quy mô","Nhóm biến chính","Trường bổ sung ở bản v3"],
  [
    ["HeadView","Hồ sơ RFQ (dự án)",`${DA.shape.head[0].toLocaleString("de-DE")} bản ghi × ${DA.shape.head[1]} trường`,"Thời gian xử lý từng khâu và thời gian tổng; đặc điểm khách hàng; cường độ cạnh tranh; độ sâu hàng đợi; kinh nghiệm kỹ sư phụ trách","Effective_Competitors_N — số đối thủ thực tế tham gia cơ hội (CRM)\nUrgency_SLA_Sensitivity — hệ số nhạy cảm cam kết thời gian (CRM)"],
    ["ItemView","Dòng hàng trong hồ sơ",`${DA.shape.item[0].toLocaleString("de-DE")} bản ghi × ${DA.shape.item[1]} trường`,"Giá vốn, hệ số markup, giá chào, giá mục tiêu; thuộc tính nhà cung cấp; kết quả thắng/thua từng dòng","Market_Reserve_Bound — cận trên giá dự trữ cấp dòng hàng (Sourcing)\nItem_Win_Status — trạng thái thắng/thua đã đối soát cuối kỳ"],
  ],[1150,1450,1600,2500,2300]));
k.push(cap("Bảng 3.1: Cấu trúc hai cấp của bộ dữ liệu nghiên cứu (bản v3) và các trường bổ sung"));
k.push(p("Cấu trúc hai cấp này quyết định cách phân chia dữ liệu và cách chọn đơn vị phân tích cho từng bài toán. BT1 làm việc ở cấp hồ sơ vì thời gian xử lý là thuộc tính của cả hồ sơ, không của từng dòng hàng. BT2 và BT3 làm việc ở cấp dòng hàng vì kết quả thắng thua và quyết định giá được ghi nhận cho từng mặt hàng. Trung bình mỗi hồ sơ chứa 5,50 dòng hàng, nghĩa là các quan sát ở cấp dòng hàng không độc lập với nhau — chúng phân cụm theo hồ sơ."));

k.push(h3("3.1.2. Làm sạch dữ liệu và xử lý giá trị khuyết"));
k.push(p("Bộ dữ liệu thô gồm 11.694 bản ghi dòng hàng, sau khi loại các bản ghi trùng lặp, bản ghi thiếu khóa liên kết và bản ghi có trạng thái mua hàng không xác định còn 8.249 bản ghi hợp lệ. Về giá trị khuyết, hai trường có tỷ lệ khuyết đáng kể là điểm chất lượng nhà cung cấp (412 bản ghi, 5,0%) và chỉ số cạnh tranh về giá (329 bản ghi, 4,0%); các trường còn lại đầy đủ."));
k.push(p([run("Luận văn xử lý giá trị khuyết bằng cách loại bỏ theo danh sách đầy đủ",{}),fn("Loại bỏ theo danh sách đầy đủ (listwise deletion) được chọn thay cho gán khuyết vì tỷ lệ khuyết dưới 5% và hai trường khuyết đều là biến độc lập; gán khuyết bằng mô hình sẽ đưa thêm một tầng bất định vào chính biến giá — biến quan trọng nhất của BT2."),run(` cho mô hình BT2, giữ lại ${B12.bt2_n.items.toLocaleString("de-DE")} dòng hàng thuộc ${B12.bt2_n.projects.toLocaleString("de-DE")} hồ sơ. Lựa chọn này được kiểm tra về tính không chọn lọc: tỷ lệ thắng trên tập sau khi loại là ${f(B12.bt2_n.win_rate*100,2)}%, so với ${f(DA.labels.win_rate_v3*100,2)}% trên toàn bộ dữ liệu — chênh lệch ${f(Math.abs(B12.bt2_n.win_rate-DA.labels.win_rate_v3)*100,2)} điểm phần trăm cho thấy việc khuyết dữ liệu không tương quan hệ thống với biến kết quả. Ba trường bổ sung của bản v3 không có giá trị khuyết.`,{})]));
k.push(p([run("Khai báo về phiên bản dữ liệu và kiểm toán trường bổ sung. ",{bold:true,color:C.DRED}),
  run(`Trước khi sử dụng, ba trường bổ sung được kiểm toán đối chiếu với các trường sẵn có, và kết quả cần được khai báo vì nó quyết định cách diễn giải các mô hình dùng chúng. Thứ nhất, Effective_Competitors_N là ánh xạ một-một từ Competitor_Intensity ở tầng thấp và trung bình (Low → 2, Med → 3) và tách tầng cao thành hai giá trị (4 hoặc 5); do đó nó chứa thông tin mới chủ yếu ở tầng cạnh tranh cao. Thứ hai, Urgency_SLA_Sensitivity nhận bốn giá trị và trùng khớp ${f(DA.Urgency.rule_match_frac*100,0)}% với quy tắc ${DA.Urgency.rule} — tức là một trường dẫn xuất từ hai trường đã có, không mang thông tin độc lập. Thứ ba, Market_Reserve_Bound tương quan ${f(DA.MRB.corr_c,3)} với giá vốn và bằng trung bình ${f(DA.MRB.ratio_c_mean,3)} lần giá vốn (hệ số biến thiên của tỷ số chỉ ${f(DA.MRB.ratio_c_cv*100,1)}%); mọi giá chào lịch sử đều nằm dưới cận này.`,{})]));
k.push(p([run(`Về nhãn kết quả, so với bản nháp trước đối soát, ${DA.labels.n_changed} trên ${DA.shape.item[0].toLocaleString("de-DE")} dòng hàng (${f(DA.labels.pct_changed,2)}%, thuộc ${DA.labels.projects_touched} hồ sơ) đổi trạng thái: ${DA.labels.n_1to0} dòng từ thắng sang thua và ${DA.labels.n_0to1} dòng từ thua sang thắng; tỷ lệ thắng chung đổi từ ${f(DA.labels.win_rate_v1*100,2)}% sang ${f(DA.labels.win_rate_v3*100,2)}%. Các thay đổi này không phân bố ngẫu nhiên: dòng hàng đổi nhãn có độ sâu hàng đợi trung bình ${f(DA.labels.Q_mean_changed,1)} so với ${f(DA.labels.Q_mean_unchanged,1)} ở dòng không đổi; mọi dòng chuyển thắng → thua có độ sâu hàng đợi từ ${DA.labels.Q_min_1to0} trở lên, mọi dòng chuyển thua → thắng có độ sâu hàng đợi không quá ${DA.labels.Q_max_0to1}.`,{}),
  fn("Một quy trình đối soát hợp lệ có thể sinh ra cấu trúc như vậy — chẳng hạn khi các đơn hàng chậm phản hồi bị khách hàng hủy sau thời điểm trích xuất bản nháp. Tuy nhiên, vì các biến hàng đợi và thời gian xử lý chính là biến được kiểm định ở BT2, luận văn không coi việc đối soát là trung lập: mọi kết luận về hai biến này được báo cáo song song trên cả hai phiên bản nhãn (Mục 4.2.5, Bảng B.4), và hồ sơ đối soát gốc cần được lưu kèm luận văn để hội đồng kiểm tra."),
  run(" Hệ quả phương pháp: mọi kết luận phụ thuộc vào biến hàng đợi và thời gian xử lý trong mô hình xác suất thắng được báo cáo kèm phân tích độ nhạy theo phiên bản nhãn.",{})]));
k.push(p([run("Khai báo bắt buộc về xử lý bảo mật. ",{bold:true,color:C.DRED}),
  run("Bộ dữ liệu đã trải qua bước chuẩn hóa và ẩn danh hóa theo yêu cầu của doanh nghiệp, gồm băm định danh khách hàng, thêm nhiễu có kiểm soát vào trường thời gian, và xáo trộn nhẹ hệ số markup. Hệ quả cần nêu rõ ở mọi phát biểu định lượng: các kết luận định tính — thứ tự các khâu, dấu của hệ số, cấu trúc biến động, chiều của tương quan — bền vững hơn từng con số tuyệt đối cụ thể.",{})]));

k.push(h3("3.1.3. Xây dựng đặc trưng"));
k.push(p("Ngoài các trường có sẵn, luận văn xây dựng thêm ba nhóm đặc trưng. Nhóm thứ nhất là các chỉ số tổng hợp về độ phức tạp hồ sơ, thu được bằng phân tích thành phần chính trên ba biến số cấp phê duyệt, số lần làm rõ bản vẽ và độ sâu hàng đợi. Nhóm thứ hai là các đặc trưng lịch sử khách hàng, tính từ các hồ sơ phát sinh trước thời điểm của hồ sơ đang xét. Nhóm thứ ba là các đặc trưng vị thế giá trong nhóm hàng."));
k.push(p([run("Nguyên tắc chống rò rỉ khi xây dựng đặc trưng lịch sử: ",{bold:true}),
  run("mọi đặc trưng tính từ lịch sử chỉ được sử dụng thông tin phát sinh nghiêm ngặt trước thời điểm tạo hồ sơ đang xét. Với đặc trưng tỷ lệ thắng lịch sử của khách hàng, chỉ tính khi khách hàng đã có tối thiểu ba hồ sơ trước đó, để tránh ước lượng không ổn định trên mẫu quá nhỏ.",{})]));

k.push(h3("3.1.4. Quy tắc phân chia dữ liệu"));
k.push(p("Vì các dòng hàng phân cụm theo hồ sơ, phân chia ngẫu nhiên theo dòng hàng sẽ đưa các dòng của cùng một hồ sơ vào cả tập huấn luyện lẫn tập kiểm tra. Khi đó mô hình học được đặc điểm riêng của hồ sơ từ tập huấn luyện và áp dụng lại cho chính hồ sơ ấy ở tập kiểm tra, làm các chỉ số đánh giá tốt lên một cách giả tạo."));
k.push(p("Luận văn áp dụng quy tắc phân chia theo cụm dự án cho toàn bộ các mô hình ở cấp dòng hàng: toàn bộ dòng hàng của một hồ sơ nằm trọn trong một tập, tỷ lệ 80% huấn luyện và 20% kiểm tra. Với các mô hình ở cấp hồ sơ, áp dụng kiểm chứng chéo năm lớp thông thường."));

/* ══════════ 3.2 ══════════ */
k.push(h2("3.2. Bài toán 1 — Phương pháp dự báo thời gian xử lý"));

k.push(h3("3.2.1. Đặc tả mô hình theo khâu và mô hình tổng"));
k.push(p("Khác biệt chính so với công trình trước là luận văn dự báo thời gian của từng khâu trước, sau đó mới xét thời gian tổng theo hai đường tính độc lập. Cách làm này cho phép trả lời một câu hỏi mà mô hình thời gian tổng không trả lời được: biến động của thời gian xử lý bắt nguồn từ khâu nào."));
k.push(fx([
"Chuẩn hóa biến độc lập (Z-score):",
"    z_kj = ( x_kj − mean(x_k) ) / sd(x_k)",
"",
"Mô hình cho từng khâu — bốn mô hình độc lập:",
"    T_sj = β_0s + Σ_{k=1..K} β_ks · z_kj + ε_sj",
"    s ∈ { Sales, WBS, SC, Pricing } ,  j = 1…1500",
"",
"Thời gian tổng — hai đường tính đối chiếu chéo:",
"    (a) cộng dồn:    TAT_j = Σ_s T̂_sj",
"    (b) trực tiếp:   TAT_j = β_0 + Σ_k β_k · z_kj + ε_j"]));
k.push(p("Bộ biến độc lập gồm năm biến quan sát được tại thời điểm tiếp nhận hồ sơ: số cấp phê duyệt yêu cầu, số lần làm rõ bản vẽ, độ sâu hàng đợi của đội định giá, mức kinh nghiệm của kỹ sư được phân công, và năng suất xử lý gần đây của bộ phận. Kiểm tra đa cộng tuyến cho hệ số phóng đại phương sai của cả năm biến đều xấp xỉ 1,00, nên không cần loại biến nào."));
k.push(p("Hai đường tính thời gian tổng không nhằm mục đích chọn ra đường tốt hơn, mà nhằm kiểm tra tính nhất quán. Nếu hai đường cho kết quả chênh lệch lớn thì một trong hai đặc tả có vấn đề về dạng hàm."));

k.push(h3("3.2.2. Quy trình chẩn đoán giả định và lựa chọn đặc tả"));
k.push(p("Theo yêu cầu về tính hợp lệ đã trình bày ở mục 2.1.2, luận văn không diễn giải hệ số hồi quy trước khi kiểm tra giả định. Quy trình gồm năm bước, áp dụng thống nhất cho cả mô hình từng khâu lẫn mô hình tổng."));
k.push(mkTable(
  ["Bước","Nội dung","Công cụ","Tiêu chí quyết định"],
  [
    ["1","Kiểm tra phương sai sai số không đổi","Breusch–Pagan và White","p > 0,05 ở cả hai kiểm định thì chấp nhận giả định"],
    ["2","Kiểm tra tính chuẩn của phần dư","Jarque–Bera và hệ số bất đối xứng","Bất đối xứng lớn cần xử lý, nhưng bằng biện pháp khác với bước 1"],
    ["3","So sánh bốn đặc tả cạnh tranh","Thang đo gốc; logarit; thang gốc kèm sai số vững HC3; mô hình tuyến tính tổng quát họ Gamma","Chọn theo sai số dự báo kèm mức độ thỏa mãn giả định, không chọn theo R² đơn thuần"],
    ["4","Kiểm tra đa cộng tuyến","Hệ số phóng đại phương sai","VIF < 5 thì chấp nhận"],
    ["5","Kiểm chứng ngoài mẫu","Kiểm chứng chéo năm lớp","Báo cáo sai số tuyệt đối trung bình theo đơn vị ngày"],
  ],[600,2500,2800,3100]));
k.push(cap("Bảng 3.2: Quy trình năm bước chẩn đoán giả định và chọn đặc tả cho BT1"));
k.push(p([run("Điểm cần nêu trước về mặt phương pháp: ",{bold:true}),
  run("bước 3 được thiết kế để phân biệt hai vấn đề thường bị đồng nhất. Phương sai sai số thay đổi và phần dư bất đối xứng là hai hiện tượng khác nhau, đòi hỏi hai biện pháp khác nhau. Biến đổi logarit xử lý quan hệ nhân và bất đối xứng; sai số chuẩn vững xử lý suy luận thống kê khi phương sai không đồng nhất. Áp dụng biến đổi cho một vấn đề không phải của nó có thể làm kết quả xấu đi. Kết quả của bước kiểm tra này được trình bày tại mục 4.1.",{})]));

k.push(h3("3.2.3. Phân tích cấu trúc biến động giữa các khâu"));
k.push(p("Sau khi có mô hình từng khâu, luận văn phân tích cấu trúc biến động theo ba hướng bổ sung cho nhau."));
k.push(p([run("Hướng thứ nhất — so sánh mức biến động tương đối. ",{bold:true}),
  run("Vì bốn khâu có thời gian trung bình khác nhau đáng kể, việc so sánh độ lệch chuẩn tuyệt đối không phù hợp. Luận văn dùng hệ số biến thiên, và xây dựng khoảng tin cậy cho chênh lệch hệ số biến thiên giữa từng cặp khâu bằng phương pháp bootstrap với 2.000 lần lấy mẫu lại.",{})]));
k.push(p([run("Hướng thứ hai — kiểm định đồng nhất phương sai. ",{bold:true}),
  run("Áp dụng đồng thời ba kiểm định Levene dạng Brown–Forsythe, Bartlett và Kruskal–Wallis. Việc dùng cả ba nhằm bảo đảm kết luận không phụ thuộc vào giả định phân phối chuẩn, vì kiểm định Bartlett rất nhạy với vi phạm giả định này.",{})]));
k.push(p([run("Hướng thứ ba — phân rã phương sai của thời gian tổng. ",{bold:true}),
  run("Tính tỷ trọng đóng góp của từng khâu và của thành phần hiệp phương sai vào phương sai thời gian tổng, theo công thức đã nêu ở mục 2.1.6. Tỷ trọng hiệp phương sai lớn hàm ý tồn tại một yếu tố chung chi phối đồng thời nhiều khâu.",{})]));
k.push(p("Khung diễn giải được đăng ký trước khi xem kết quả, nhằm tránh diễn giải hậu nghiệm theo hướng có lợi:"));
k.push(mkTable(
  ["Kết quả quan sát","Diễn giải tương ứng"],
  [
    ["Mức biến động giữa bốn khâu tương đương nhau","Mức độ ổn định của tổ chức là đồng đều giữa các khâu; nguồn biến động mang tính hệ thống chứ không cục bộ"],
    ["Mức biến động khác nhau rõ rệt giữa các khâu","Độ phức tạp xử lý không đồng đều; khâu có biến động cao là khâu có biên độ xử lý rộng nhất và là ứng viên can thiệp trước"],
    ["Hiệp phương sai chiếm tỷ trọng lớn","Tồn tại yếu tố độ phức tạp chung của hồ sơ chi phối đồng thời nhiều khâu; can thiệp cục bộ ở một khâu sẽ kém hiệu quả"],
    ["Hai khâu gần như không tương quan","Hai khâu vận hành độc lập; hàng đợi của khâu này không bị chi phối bởi tải của khâu kia"],
  ],[3900,5100]));
k.push(cap("Bảng 3.3: Khung diễn giải đăng ký trước cho phân tích biến động theo khâu"));

/* ══════════ 3.3 ══════════ */
k.push(h2("3.3. Bài toán 2 — Phương pháp dự báo thắng/thua"));

k.push(h3("3.3.1. Đặc tả hàm thắng/thua"));
k.push(p("Biến phụ thuộc là nhị phân ở cấp dòng hàng. Mỗi dòng hàng là một quan sát có ngữ cảnh riêng về giá, nhà cung cấp và khách hàng, nên bài toán thuộc loại phân loại có giám sát, không phải dự báo chuỗi thời gian. Đây là điểm cần nêu rõ vì hai lớp bài toán này đòi hỏi phương pháp và chỉ số đánh giá hoàn toàn khác nhau."));
k.push(p("Mô hình chính là hồi quy logistic, vì hệ số của nó diễn giải được và đầu ra là xác suất có thể hiệu chuẩn — hai điều kiện bắt buộc khi mô hình làm đầu vào cho bài toán tối ưu giá. Một mô hình cây tăng cường gradient được huấn luyện song song chỉ với vai trò chuẩn so sánh năng lực phân biệt; nếu chuẩn so sánh vượt trội đáng kể thì đó là dấu hiệu mô hình chính bỏ sót quan hệ phi tuyến cần bổ sung."));
k.push(fx([
"Hàm thắng/thua:",
"    Y_i = 1  nếu dòng hàng i thắng thầu",
"    Y_i = 0  nếu thua",
"",
"Chỉ số tuyến tính và hàm liên kết logit:",
"    η_i = β_0 + Σ_{k=1..K} β_k · x_ki",
"    ln[ p_i / (1 − p_i) ] = η_i",
"    p_i = P(Y_i = 1 | x_i) = 1 / ( 1 + exp(−η_i) )",
"",
"Ước lượng hợp lý cực đại:",
"    ℓ(β) = Σ_i [ y_i · ln(p_i) + (1 − y_i) · ln(1 − p_i) ]",
"    β̂ = argmax_β  ℓ(β)",
"",
"Diễn giải hệ số:   OR_k = exp(β_k)"]));

k.push(h3("3.3.2. Sáu nhóm biến và cơ chế kinh tế"));
k.push(p("Việc đưa một biến vào mô hình cần có lý do kinh tế, không chỉ vì biến đó sẵn có trong dữ liệu. Bảng dưới đây liệt kê sáu nhóm biến kèm cơ chế mà qua đó mỗi nhóm tác động lên xác suất thắng, và dấu kỳ vọng của hệ số."));
k.push(mkTable(
  ["Nhóm biến","Biến cụ thể","Cơ chế tác động","Dấu kỳ vọng"],
  [
    ["Giá","Price_Competitiveness","Mức giá chào so với giá mục tiêu của khách hàng; chào rẻ hơn kỳ vọng làm tăng khả năng được chọn","Dương (biến là nghịch đảo giá)"],
    ["Năng lực nhà cung cấp","Supplier_SQE_Score, ATP_Stock_Available, Has_PPAP_Cert, Local_Supplier","Chất lượng, khả năng giao ngay, chứng nhận và vị trí địa lý làm giảm rủi ro nguồn cung phía khách hàng","Dương"],
    ["Quan hệ khách hàng","Is_Strategic, Is_Existing_Customer, Customer_Class","Chi phí chuyển đổi nhà cung cấp và lịch sử hợp tác tạo lợi thế không liên quan tới giá","Dương"],
    ["Cạnh tranh","Competitor_Intensity","Số lượng và mức độ quyết liệt của đối thủ trên cùng cơ hội","Âm"],
    ["Rủi ro thương mại","Payment_Term_Risk","Điều khoản thanh toán kéo dài làm giảm mức hấp dẫn của hồ sơ đối với bên bán và có thể đi kèm khách hàng rủi ro hơn","Âm"],
    ["Năng lực xử lý","Pricing_Queue_Depth, Assigned_Engineer_Experience, TAT dự báo từ BT1","Hàng đợi sâu và kỹ sư ít kinh nghiệm kéo dài thời gian phản hồi, làm giảm khả năng thắng","Âm với hàng đợi và TAT"],
  ],[1700,2700,3200,1400]));
k.push(cap("Bảng 3.4: Sáu nhóm biến trong mô hình xác suất thắng, cơ chế tác động và dấu kỳ vọng"));
k.push(p([run("Điểm nối giữa BT1 và BT2. ",{bold:true,color:C.RED}),
  run("Nhóm biến thứ sáu chứa giá trị thời gian xử lý DỰ BÁO từ BT1, không phải thời gian xử lý thực tế. Lý do là tại thời điểm ra quyết định giá, thời gian xử lý thực tế của hồ sơ chưa xảy ra và do đó chưa quan sát được. Đưa thời gian thực tế vào mô hình sẽ tạo rò rỉ dữ liệu từ tương lai và làm chỉ số đánh giá mất ý nghĩa. Đây là cơ chế khiến BT1 trở thành đầu vào bắt buộc của BT2 chứ không phải một bài toán song song độc lập.",{})]));
k.push(p([run("Cảnh báo về lựa chọn biến giá. ",{bold:true,color:C.DRED}),
  run("Trong dữ liệu tồn tại hai ứng viên cho vai trò tín hiệu giá là hệ số markup và chỉ số cạnh tranh về giá. Hai biến này không tương đương: hệ số markup được tính từ giá vốn của chính doanh nghiệp và không chứa thông tin về mặt bằng giá thị trường, trong khi chỉ số cạnh tranh về giá đo tương quan giữa giá chào và giá mục tiêu của khách hàng. Luận văn dùng chỉ số cạnh tranh về giá làm biến giá, và trình bày bằng chứng thực nghiệm cho lựa chọn này tại mục 4.2.",{})]));

k.push(h3("3.3.3. Hiệu chuẩn xác suất và quy trình kiểm tra"));
k.push(p("Vì đầu ra của BT2 được nhân với biên lợi nhuận để tính lợi nhuận kỳ vọng ở BT3, mô hình phải cho mức xác suất đúng chứ không chỉ cho thứ hạng đúng. Luận văn kiểm tra hiệu chuẩn theo hai cách bổ sung nhau."));
k.push(p("Cách thứ nhất là đường cong hiệu chuẩn: chia tập kiểm tra thành các nhóm theo xác suất dự báo, so sánh xác suất dự báo trung bình với tỷ lệ thắng thực tế trong từng nhóm. Mô hình hiệu chuẩn tốt cho các điểm nằm gần đường chéo. Cách thứ hai là kiểm tra ở mức tổng hợp: so sánh tổng lợi nhuận kỳ vọng mà mô hình dự báo tại chính mức giá lịch sử với tổng lợi nhuận thực nhận. Sai lệch nhỏ ở mức tổng hợp là điều kiện cần để mô hình dùng được cho bài toán tối ưu giá."));

/* ══════════ 3.4 ══════════ */
k.push(h2("3.4. Bài toán 3 — Phương pháp tối ưu giá báo thầu"));

k.push(h3("3.4.1. Khung tối ưu theo xác suất thắng"));
k.push(p("Khung cơ sở kế thừa từ Friedman (1956) và được vận hành hóa trên xác suất thắng đã hiệu chuẩn từ BT2. Ký hiệu c là giá vốn đầy đủ của dòng hàng, p là giá chào, T là giá mục tiêu của khách hàng, và r = T/p là chỉ số cạnh tranh về giá."));
k.push(fx([
"Xác suất thắng theo giá — thừa hưởng từ BT2:",
"    η(p) = α + γ · ( T / p ) + x'δ",
"    P(Win | p, x) = 1 / ( 1 + exp(−η(p)) )",
"",
"Đạo hàm của xác suất theo giá:",
"    ∂P/∂p = P · (1 − P) · ( −γ · T / p² )",
"    Với γ > 0 thì ∂P/∂p < 0 — đúng chiều kinh tế",
"",
"Hàm mục tiêu — lợi nhuận kỳ vọng:",
"    E[π(p)] = ( p − c ) · P(Win | p, x)",
"    p* = argmax_p  ( p − c ) · P(Win | p, x)"]));

k.push(h3("3.4.2. Điều kiện bậc nhất và tính phi tuyến của bài toán"));
k.push(p("Lấy đạo hàm hàm mục tiêu theo giá và cho bằng không, thu được điều kiện bậc nhất. Do xác suất thắng là hàm logistic của nghịch đảo giá, điều kiện này không giải được ra nghiệm dạng đóng."));
k.push(fx([
"∂E[π]/∂p = P + ( p − c ) · P · (1 − P) · ( −γ·T / p² ) = 0",
"",
"Chia hai vế cho P và sắp xếp lại:",
"    γ · T · ( p − c ) · ( 1 − P(p) ) = p²",
"",
"Nghiệm p* nằm ẩn trong phương trình → giải bằng phương pháp số."]));
k.push(p("Luận văn giải bằng hai cách độc lập và đối chiếu chéo: dò lưới trên miền giá với bước nhỏ, và giải phương trình điều kiện bậc nhất bằng thuật toán Brent. Việc hai cách cho cùng nghiệm là bằng chứng rằng nghiệm tìm được là cực đại toàn cục trên miền khảo sát chứ không phải cực trị địa phương."));
k.push(p([run("Trả lời câu hỏi về dạng hàm: ",{bold:true}),
  run("hàm mục tiêu là phi tuyến theo giá. Bằng chứng là đạo hàm bậc hai của hàm mục tiêu đổi dấu trên miền giá khảo sát — hàm lồi ở vùng giá thấp và lõm quanh điểm cực đại. Một hàm tuyến tính theo giá sẽ có đạo hàm bậc hai bằng không ở mọi điểm và không tồn tại cực đại nội suy. Kết quả kiểm chứng trình bày tại mục 4.3.",{})]));

k.push(h3("3.4.3. Chính sách giá cân bằng và kiểm định giả thuyết H1"));
k.push(p("Chính sách cân bằng được xây dựng theo nghiệm dạng đóng của Krishna (2009) đã trình bày ở mục 2.2.3. Việc triển khai đòi hỏi hai tham số không quan sát trực tiếp được: cận trên của miền chi phí và số đối thủ hiệu dụng."));
k.push(p("Luận văn đối sánh ba đặc tả cho cận trên của miền chi phí, khác nhau ở cấp độ và nguồn thông tin dùng để xác định c̄_i."));
k.push(fx([
"Đặc tả A — cận tuyệt đối theo nhóm vật liệu, N hiệu chỉnh lai:",
"    p*_A,i = c_i + ( P99_cat(c) − c_i ) / N_hyb(tầng)",
"Đặc tả B — cận tỷ lệ cố định, δ từ độ phân tán T/c:",
"    p*_B,i = c_i + δ · c_i / N_hyb(tầng) ,   δ = CV(T/c) · √3",
"Đặc tả C — cận dự trữ cấp dòng hàng, số đối thủ thực tế (bản v3):",
"    p*_C,i = c_i + ( Market_Reserve_Bound_i − c_i ) / Effective_Competitors_N_i",
"",
"Mọi đặc tả được đánh giá ở hai dạng: kẹp trong [P5 ; P95] markup lịch sử,",
"và dạng đóng thuần (không kẹp); báo cáo tỷ lệ khuyến nghị nằm ngoài dải."]));
k.push(p("Ngoài ba đặc tả thuần, luận văn đánh giá một dạng lai cho đặc tả C: lấy giá cân bằng làm điểm neo và tìm mức giá tối đa hóa lợi nhuận kỳ vọng theo hàm phản hồi logistic của BT2 trong vùng tin cậy ±5% quanh điểm neo (vẫn trong dải lịch sử). Dạng lai này không còn là nghiệm cân bằng thuần, và được báo cáo tách biệt."));
k.push(p("Số đối thủ hiệu dụng được hiệu chỉnh bằng bốn phương pháp độc lập — phương pháp mô-men trên mức markup, suy từ tỷ lệ thắng theo quan hệ cân bằng đối xứng, ánh xạ theo đánh giá chuyên gia, và phương pháp lai kết hợp hình dạng từ tỷ lệ thắng với mức neo từ ánh xạ chuyên gia. Việc dùng bốn phương pháp không nhằm chọn ra phương pháp đúng mà nhằm đo độ rộng của khoảng bất định: nếu bốn phương pháp cho kết quả phân tán mạnh thì tham số này không được nhận dạng từ dữ liệu, và mọi kết luận phụ thuộc vào nó phải được kèm phân tích độ nhạy."));
k.push(p([run("Hệ quả kiểm định được của H1 — kiểm định đối chiếu hai mặt. ",{bold:true}),
  run("Hệ quả so sánh tĩnh của nghiệm cân bằng là độ co giãn của biên giá theo số đối thủ bằng âm một. Luận văn kiểm định hệ quả này trên hai loại mức giá có bản chất khác nhau, với sai số chuẩn cụm theo hồ sơ.",{})]));
k.push(fx([
"Mặt (1) — hành vi lịch sử:   ln(Markup_i) = a + b · ln(N_i) + u_i     (và ln(Markup_i − 1))",
"    H0(cost-plus): b = 0     H0(BNE): b = −1",
"",
"Mặt (2) — giá do mô hình sinh ra:",
"    (2a) Tối ưu FOC:   ln( p*_FOC,i / c_i − 1 ) = a + b · ln(N_i) + u_i",
"    (2b) Đặc tả C:     ln( p*_C,i  / c_i − 1 ) = a + b · ln(N_i) + u_i",
"",
"N_i = Effective_Competitors_N ;  n = 7.519 dòng hàng ;  SE cụm theo hồ sơ"]));
k.push(p([run("Cần đọc đúng nội dung thông tin của từng mặt. ",{bold:true,color:C.DRED}),
  run("Mặt (1) là kiểm định thực nghiệm về hành vi của doanh nghiệp. Mặt (2a) là kiểm định về tính chất so sánh tĩnh của mô hình phản hồi đã ước lượng: N không có mặt trong công thức giá, mà tác động qua hệ số cạnh tranh của hàm logistic, nên độ dốc là kết quả có nội dung — nhưng là nội dung về mô hình, không phải về thị trường. Mặt (2b) chỉ là kiểm tra tính nhất quán nội tại: theo mục 2.2.3, độ dốc bằng −1 + cov(ln δ_i, ln N_i)/var(ln N_i) theo định nghĩa, nên kết quả gần −1 không được tính là bằng chứng cho H1.",{})]));
k.push(p([run("Kiểm định gốc (giữ nguyên từ bản trước để so sánh). ",{bold:true}),
  run("Thay vì kiểm định trực tiếp giả thuyết về lợi nhuận, luận văn kiểm định hệ quả so sánh tĩnh của nghiệm cân bằng: với chi phí phân phối đều, logarit của hệ số markup giảm tuyến tính theo logarit của số đối thủ với độ dốc xấp xỉ âm một. Mô hình kiểm định là hồi quy log–log của hệ số markup theo số đối thủ hiệu dụng, và giả thuyết không được đặt ở hai mức: độ dốc bằng âm một theo lý thuyết cân bằng, và độ dốc bằng không theo giả thuyết định giá cost-plus.",{})]));

k.push(h3("3.4.4. Giá bóng của năng lực xử lý và kiểm định giả thuyết H2"));
k.push(p("Giá bóng của năng lực xử lý được xây dựng từ ngoại tác tắc nghẽn: việc nhận thêm một hồ sơ vào hàng đợi làm tăng xác suất vi phạm cam kết thời gian cho các hồ sơ đang chờ. Mức tăng này được quy ra tiền theo chi phí của một lần vi phạm."));
k.push(fx([
"Bước 1 — ước lượng xác suất vi phạm theo độ sâu hàng đợi:",
"    P_breach(Q) = 1 / ( 1 + exp( −( α₀ + α₁ · Q ) ) )",
"",
"Bước 2 — ngoại tác tắc nghẽn, sai phân bậc nhất:",
"    Δ(Q) = (Q+1) · P_breach(Q+1) − Q · P_breach(Q)",
"",
"Bước 3 — quy ra tiền:",
"    λ(Q) = π_SLA · Δ(Q)",
"    với π_SLA là chi phí một lần vi phạm cam kết thời gian"]));
k.push(p("Phiên bản có trọng số nhạy cảm cam kết nhân giá bóng với hệ số Urgency_SLA_Sensitivity của hồ sơ, phản ánh việc một lần trễ hạn với khách hàng chiến lược hoặc hồ sơ nhiều cấp phê duyệt đắt hơn một lần trễ hạn thông thường:"));
k.push(fx(["λ_U,j(Q) = U_j · π_SLA · Δ(Q) ,     U_j = Urgency_SLA_Sensitivity_j ∈ { 1,00 ; 1,25 ; 1,50 ; 1,88 }",
  "Giả dược tương ứng:  λ̄_U = trung bình của λ_U,j(Q) trên tập kiểm tra, cộng như một hằng số"]));
k.push(p([run("Hai lựa chọn thiết kế cần khai báo",{}),fn("Tham số δ của đặc tả B được hiệu chỉnh từ hệ số biến thiên của tỷ số giá mục tiêu trên giá vốn nhân với √3: với phân phối đều trên [a, b], hệ số biến thiên bằng (b − a) / (√3 · (a + b)), nên nửa độ rộng tương đối của miền là CV · √3. Kết quả δ ≈ 0,181."),run(". Thứ nhất, giá bóng được chặn trên tại mức độ sâu hàng đợi mà từ đó dữ liệu trở nên thưa, nhằm tránh ngoại suy vào vùng ít quan sát. Thứ hai, luận văn triển khai hai dạng chính sách để so sánh: cộng thẳng giá bóng vào giá chào, và nội sinh hóa giá bóng vào chi phí trước khi áp công thức định giá. Hai dạng này khác nhau về mặt lý thuyết và chênh lệch giữa chúng là một phần của phân tích độ nhạy.",{})]));

k.push(h3("3.4.5. Kiểm chứng giả dược"));
k.push(p("Một chính sách phức tạp có thể cho kết quả tốt hơn hiện trạng vì cơ chế mà nó đề xuất, hoặc đơn giản vì nó nâng mặt bằng giá lên. Nếu không tách hai nguồn này, không thể quy công cho cơ chế được thiết kế."));
k.push(p("Luận văn áp dụng kiểm chứng giả dược theo nguyên tắc sau: xây dựng một nhánh đối chứng trong đó thành phần giá bóng phụ thuộc hàng đợi được thay bằng một hằng số có cùng giá trị trung bình, giữ nguyên mọi thành phần còn lại. Hai nhánh khi đó có cùng tác động trung bình lên mặt bằng giá nhưng khác nhau ở chỗ có hay không có điều tiết theo trạng thái hàng đợi. Chênh lệch kết quả giữa hai nhánh chính là đóng góp riêng của cơ chế điều tiết."));
k.push(p([run("Đây là yêu cầu bắt buộc, không phải bước kiểm tra tùy chọn. ",{bold:true}),
  run("Mọi phát biểu về giá trị của thành phần xét năng lực trong luận văn đều được đặt sau kết quả của kiểm chứng này.",{})]));

k.push(h3("3.4.6. Thiết kế nghiên cứu mô phỏng liên kỳ có kiểm soát"));
k.push(p("Đánh giá ở các mục 3.4.1–3.4.5 là đánh giá tĩnh một kỳ: mỗi dòng hàng được định giá độc lập, trên trạng thái hàng đợi đã quan sát. Khung này có một điểm mù cấu trúc — quyết định giá diễn ra SAU khi hồ sơ đã nằm trong hàng đợi, và không có vòng phản hồi từ quyết định hôm nay sang hàng đợi của hồ sơ đến sau. Vì vậy nó không thể đo lợi ích của một cơ chế điều phối tác động lên thứ tự xử lý. Mục 4.4 lấp khoảng trống này bằng một mô hình mô phỏng rời rạc theo sự kiện, với bốn nguyên tắc thiết kế được cố định trước khi chạy."));
k.push(p([run("Nguyên tắc 1 — Neo vào quan sát. ",{bold:true}),
  run("Mô phỏng phát lại đúng 1.500 hồ sơ thực: thời điểm tiếp nhận, thời gian Sales, WBS và Supply Chain giữ nguyên như dữ liệu; chỉ thời gian chờ tại khâu Pricing thay đổi theo cơ chế điều phối. Gọi W_j^FIFO và W_j^π là thời gian chờ của hồ sơ j dưới quy tắc vào trước phục vụ trước và dưới cơ chế π trên cùng chuỗi số ngẫu nhiên. Đại lượng phản thực được tính bằng cách cộng chênh lệch vào giá trị QUAN SÁT: TAT_j^π = TAT_j^obs + (W_j^π − W_j^FIFO), và độ sâu hàng đợi tương đương Q_j^π = Q_j^obs + μ·(W_j^π − W_j^FIFO), với μ là tốc độ phục vụ của đội Pricing. Nhờ đó kịch bản hiện trạng tái lập chính xác dữ liệu, và mô phỏng chỉ đóng vai trò tạo ra chênh lệch phản thực.",{})]));
k.push(p([run("Nguyên tắc 2 — Giá không tác động lên hàng đợi. ",{bold:true}),
  run("Công việc định giá phát sinh khi hồ sơ được tiếp nhận, trước quyết định giá; do đó trong mô phỏng, chính sách giá chỉ thay đổi xác suất thắng chứ không thay đổi khối lượng việc. Đây là giả định đã nêu ở mục 2.2.4, được giữ tường minh để mô phỏng kiểm tra đúng lập luận đó thay vì giả định ngược lại.",{})]));
k.push(p([run("Nguyên tắc 3 — Hai cách hiệu chỉnh hàng đợi. ",{bold:true}),
  run("Khâu Pricing được mô hình hóa như hệ m máy phục vụ song song, không ngắt, với thời gian phục vụ bằng κ lần thời gian Pricing quan sát nhân nhiễu log-chuẩn. Tham số (m, κ) được hiệu chỉnh để thời gian chờ trung bình dưới FIFO khớp một mục tiêu. Hiệu chỉnh C1 lấy mục tiêu là phần thời gian Pricing quy được cho hàng đợi theo hồi quy BT1 (hệ số của Q nhân Q trung bình); hiệu chỉnh C2 lấy phần thời gian TỔNG quy được cho tải hàng đợi, tức coi tắc nghẽn là hiện tượng toàn chuỗi. C1 là cận dưới thận trọng, C2 là cận trên của dư địa điều phối.",{})]));
k.push(p([run("Nguyên tắc 4 — Đánh giá có giả dược và bất định tham số. ",{bold:true}),
  run("Mỗi lần lặp rút lại bộ hệ số BT2 từ phân phối chuẩn nhiều chiều với ma trận hiệp phương sai ước lượng, nên kết quả phản ánh cả bất định ước lượng của β_TAT và β_Queue, không chỉ nhiễu mô phỏng. Mọi cơ chế dùng chung chuỗi số ngẫu nhiên; so sánh là so sánh cặp qua 200 lần lặp.",{})]));
k.push(p("Bốn cơ chế chính, hai nhánh phân rã và một biến thể được so sánh:"));
k.push(fx([
"P1  Hiện trạng: giá lịch sử (thực chất cost-plus) + FIFO",
"P2  CBPO Realistic + FIFO",
"P3  Giả dược: CBPO trên c + λ̄ (hằng số) + FIFO",
"P4  Đồng bộ: phân luồng G2 tại pha Sales-WBS + CBPO trên c + λ_U(Q) động",
"P5  Phân rã: chỉ phân luồng G2 + CBPO (không cộng λ vào giá)",
"P6  Phân rã: CBPO + λ_U(Q) động + FIFO (chỉ tín hiệu giá)",
"P7  Biến thể: phân luồng G1 (ngưỡng giá bóng thuần) + CBPO + λ_U(Q)"]));
k.push(p("Hai quy tắc phân luồng được so sánh, và trình tự xây dựng chúng cần khai báo để minh bạch bậc tự do của người nghiên cứu: G1 được thiết kế trước; G2 được bổ sung sau khi chạy thử sơ bộ cho thấy G1 mất hiệu quả khi π_SLA cao, và cả hai được báo cáo đầy đủ trong Mục 4.4. G1 là ánh xạ trực tiếp của bid-price control: hồ sơ vào làn nhanh nếu còn kịp cam kết và giá trị kỳ vọng có trọng số U_j·E[π_j] không thấp hơn giá bóng của suất xử lý mà nó chiếm; làn nhanh xếp theo hạn chót, làn chuẩn theo FIFO. G2 là chỉ số ưu tiên chi phí trễ dạng ATC (mục 2.2.4), trong đó giá bóng có trọng số λ_U,j(Q_t) đóng vai trò trọng số của chi phí vi phạm, cộng thêm tốc độ xói mòn lợi nhuận r_j do chờ — tính từ β_TAT và β_Queue của BT2:"));
k.push(fx([
"Hồ sơ còn kịp cam kết (d_j − ŵ_j − t ≥ 0):",
"    I_j(t) = [ λ_U,j(Q_t) · exp( −(d_j − ŵ_j − t) / w̄ ) + r_j · w̄ ] / ŵ_j",
"Hồ sơ không còn kịp:   I_j(t) = r_j · w̄ / ŵ_j      (luôn xếp sau làn nhanh)",
"",
"r_j = − Σ_{i∈j} (p_i − c_i) · P_i (1 − P_i) · ( β_TAT/sd_TAT + β_Q · μ / sd_Q )",
"ŵ_j, d_j: thời gian Pricing và hạn chót DỰ BÁO tại thời điểm tiếp nhận (không dùng thông tin tương lai)"]));
k.push(p("Chỉ tiêu đánh giá là lợi nhuận ròng đã điều chỉnh chi phí cam kết: tổng lợi nhuận kỳ vọng trừ π_SLA · U_j cho mỗi hồ sơ vi phạm. Mặt phẳng chuyển pha được quét trên lưới hai chiều: hệ số nhân k ∈ {0; 0,5; 1; 1,5; 2; 3} áp đồng thời cho |β_TAT| và |β_Queue|, và π_SLA ∈ {0,5; 1; 2; 3; 5} lần biên lợi nhuận trung bình mỗi dòng hàng."));

/* ══════════ 3.5 ══════════ */
k.push(h2("3.5. Bộ chỉ số đánh giá và quy tắc báo cáo"));
k.push(p("Theo lập luận đã trình bày ở mục 2.1.5, hệ số xác định R² và hệ số tương quan bội R đều không dùng được để so sánh các mô hình khác số biến. Luận văn chốt bộ chỉ số sau và áp dụng thống nhất cho mọi bảng kết quả."));
k.push(mkTable(
  ["Loại mô hình","Chỉ số bắt buộc báo cáo","Chỉ số quyết định khi so sánh"],
  [
    ["Hồi quy (BT1)","R² hiệu chỉnh; AIC; BIC; sai số tuyệt đối trung bình và căn bậc hai sai số bình phương trung bình theo đơn vị ngày; VIF","R² kiểm chứng chéo và sai số ngoài mẫu"],
    ["Logistic (BT2)","McFadden hiệu chỉnh; Nagelkerke; AIC; BIC; diện tích dưới đường cong ROC; điểm Brier","Diện tích dưới đường cong ROC và điểm Brier trên tập kiểm tra tách theo cụm dự án"],
    ["Chính sách giá (BT3)","Lợi nhuận kỳ vọng; tỷ lệ thắng; tỷ lệ khuyến nghị bị kẹp biên","Chênh lệch so với nhánh giả dược, không phải chênh lệch so với hiện trạng"],
    ["Mô phỏng liên kỳ (Mục 4.4)","Lợi nhuận ròng sau chi phí SLA; tỷ lệ vi phạm; thời gian chờ theo nhóm hồ sơ","Chênh lệch cặp so với nhánh giả dược qua 200 lần lặp có bất định tham số"],
  ],[1700,4100,3200]));
k.push(cap("Bảng 3.5: Bộ chỉ số đánh giá áp dụng thống nhất cho ba bài toán"));
k.push(p("Ba quy tắc báo cáo đi kèm. Thứ nhất, mọi mô hình ở cấp dòng hàng phải báo cáo chỉ số trên tập kiểm tra tách theo cụm dự án, không chỉ báo cáo chỉ số nội mẫu. Thứ hai, mọi mô hình hồi quy phải kèm kết quả chẩn đoán giả định trước khi diễn giải hệ số. Thứ ba, mọi chính sách giá phải báo cáo tỷ lệ khuyến nghị nằm ngoài dải hành vi lịch sử, vì tỷ lệ này cho biết đầu ra đang do công thức quyết định hay do ràng buộc kỹ thuật quyết định."));

/* ══════════ 3.6 ══════════ */
k.push(h2("3.6. Thiết kế thực nghiệm kiểm chứng"));
k.push(p("Toàn bộ đánh giá ở Chương 4 là đánh giá phản thực dựa trên mô hình, không phải bằng chứng nhân quả. Để chuyển các con số này thành bằng chứng, cần một thực nghiệm có kiểm soát. Mục này trình bày thiết kế của thực nghiệm đó, với tham số ước lượng từ chính dữ liệu nghiên cứu."));
k.push(p([run("Đơn vị ngẫu nhiên hóa. ",{bold:true}),
  run("Ngẫu nhiên hóa ở cấp hồ sơ RFQ chứ không ở cấp dòng hàng, vì một hồ sơ được gửi cho khách hàng như một chỉnh thể và việc áp hai chính sách giá khác nhau cho các dòng hàng trong cùng một hồ sơ là không khả thi về mặt vận hành.",{})]));
k.push(p([run("Hiệu ứng thiết kế. ",{bold:true}),
  run("Do ngẫu nhiên hóa theo cụm, cỡ mẫu hiệu dụng nhỏ hơn cỡ mẫu danh nghĩa. Hệ số hiệu chỉnh được tính theo hệ số tương quan nội cụm và số quan sát trung bình mỗi cụm.",{})]));
k.push(fx([
"Hiệu ứng thiết kế:",
"    DEFF = 1 + ( m̄ − 1 ) · ICC",
"    m̄ = số dòng hàng trung bình mỗi hồ sơ ;  ICC = tương quan nội cụm",
"",
"Hiệu ứng tối thiểu phát hiện được:",
"    MDE = ( z_{1−α/2} + z_{1−β} ) · σ · √( 2 · DEFF / n )"]));
k.push(p([run("Phân tầng và chỉ tiêu bảo vệ. ",{bold:true}),
  run("Phân bổ ngẫu nhiên có phân tầng theo tổ hợp phân hạng khách hàng và cường độ cạnh tranh, nhằm bảo đảm hai nhánh cân bằng trên các chiều quan trọng. Ngoài chỉ tiêu chính là lợi nhuận, thực nghiệm theo dõi một chỉ tiêu bảo vệ là tỷ lệ thắng, với biên không thua kém được đăng ký trước.",{})]));
k.push(p([run("Hai yêu cầu thiết kế được đăng ký trước. ",{bold:true,color:C.RED}),
  run("Thứ nhất, hàm mục tiêu phải là hàm hai chiều gồm cả lợi nhuận và số lần vi phạm cam kết thời gian, vì đánh giá chỉ theo lợi nhuận sẽ tính đủ chi phí nhưng bỏ sót lợi ích của thành phần xét năng lực. Thứ hai, thiết kế phải có một nhánh giả dược cộng hằng số, để tách hiệu ứng cơ chế khỏi hiệu ứng nâng giá. Do đó thiết kế đề xuất gồm ba nhánh: đối chứng (hiện trạng), can thiệp (định giá theo xác suất thắng, kết hợp bộ lọc phân luồng nếu được triển khai), và giả dược nâng giá đồng loạt có cùng tác động trung bình; hai phép so sánh với đối chứng được hiệu chỉnh Bonferroni. Tham số cụ thể của thiết kế, ước lượng từ dữ liệu, được trình bày tại mục 4.6.",{})]));

return k;
};
