// CHUONG 2 — TONG QUAN TAI LIEU VA DINH VI NGHIEN CUU  (Run 2)
module.exports=function(L){
const {C,run,p,h1,h2,h3,cap,fx,mkTable}=L;
const k=[];

k.push(h1("CHƯƠNG 2. TỔNG QUAN TÀI LIỆU VÀ ĐỊNH VỊ NGHIÊN CỨU"));
k.push(p("Chương này tổng quan nền tảng lý thuyết theo hai nhánh tương ứng với cấu trúc ba bài toán đã nêu ở Chương 1. Nhánh thứ nhất là nền tảng thống kê và học máy phục vụ hai bài toán dự báo; nhánh thứ hai là lý thuyết định giá đấu thầu cạnh tranh phục vụ bài toán tối ưu giá. Mục 2.3 trình bày quy trình khai phá dữ liệu được kế thừa làm khung tổ chức công việc, và mục 2.4 định vị nghiên cứu đồng thời phát biểu chính xác khoảng trống."));

/* ══════════ 2.1 ══════════ */
k.push(h2("2.1. Nền tảng phương pháp cho hai bài toán dự báo"));
k.push(p("Phần này trình bày cơ sở thống kê cho BT1 và BT2. Trọng tâm không đặt ở việc liệt kê thuật toán mà ở ba vấn đề quyết định tính hợp lệ của kết luận: các giả định mà mô hình hồi quy đòi hỏi, cách phát hiện và xử lý khi giả định bị vi phạm, và bộ chỉ số cho phép so sánh mô hình một cách không thiên lệch khi số biến độc lập lớn."));

k.push(h3("2.1.1. Mô hình hồi quy tuyến tính và bốn giả định Gauss–Markov"));
k.push(p("Mô hình hồi quy tuyến tính bội biểu diễn biến phụ thuộc như một tổ hợp tuyến tính của các biến độc lập cộng với sai số ngẫu nhiên. Ước lượng bình phương nhỏ nhất thông thường (Ordinary Least Squares — OLS) cho nghiệm dạng đóng, nhưng tính chất tốt nhất của nghiệm này chỉ thành lập khi bốn giả định được thỏa mãn."));
k.push(fx([
"Mô hình:        y_i = β_0 + Σ_{k=1..K} β_k · x_ki + ε_i ,  i = 1…n",
"Dạng ma trận:   y = Xβ + ε",
"Nghiệm OLS:     β̂ = (X'X)^-1 X'y",
"",
"Bốn giả định Gauss–Markov:",
"  (G1) Đặc tả đúng:            E[ε | X] = 0",
"  (G2) Phương sai không đổi:   Var(ε_i | X) = σ²  ∀i",
"  (G3) Không tự tương quan:    Cov(ε_i , ε_j) = 0  ∀ i≠j",
"  (G4) Không đa cộng tuyến:    rank(X) = K + 1"]));
k.push(p("Theo định lý Gauss–Markov, khi bốn giả định trên thỏa mãn thì ước lượng OLS là ước lượng tuyến tính không chệch có phương sai nhỏ nhất. Giả định bổ sung về phân phối chuẩn của sai số không cần cho tính không chệch, nhưng cần cho tính hợp lệ của các kiểm định t và F ở cỡ mẫu hữu hạn. Đây là điểm phân biệt quan trọng: vi phạm giả định phân phối chuẩn không làm hệ số ước lượng bị chệch, nhưng làm sai lệch suy luận thống kê về hệ số đó."));

k.push(h3("2.1.2. Chẩn đoán vi phạm giả định và biện pháp khắc phục"));
k.push(p("Giả định bị vi phạm phổ biến nhất trong dữ liệu vận hành là giả định phương sai sai số không đổi. Biểu hiện điển hình là biểu đồ phần dư theo giá trị dự báo có dạng loe hình phễu: biên độ phần dư mở rộng dần khi giá trị dự báo tăng. Tài liệu cung cấp hai kiểm định chính thức cho hiện tượng này."));
k.push(fx([
"Kiểm định Breusch–Pagan (Breusch & Pagan, 1979):",
"  Hồi quy e_i² theo biến độc lập; thống kê LM = n · R²_aux ~ χ²(K)",
"  H0: phương sai sai số không đổi",
"",
"Kiểm định White (White, 1980):",
"  Hồi quy e_i² theo biến độc lập, bình phương và tích chéo",
"  Không đòi hỏi dạng cụ thể của phương sai thay đổi",
"",
"Kiểm định Jarque–Bera (1980) — tính chuẩn của phần dư:",
"  JB = (n/6) · [ S² + (K−3)²/4 ]  ~  χ²(2)",
"  với S là hệ số bất đối xứng, K là hệ số nhọn"]));
k.push(p("Khi phát hiện vi phạm, tài liệu đưa ra hai nhóm biện pháp có bản chất khác nhau, và việc chọn sai nhóm là một lỗi thường gặp."));
k.push(mkTable(
  ["Nhóm biện pháp","Nội dung","Điều kiện áp dụng phù hợp"],
  [
    ["Biến đổi biến phụ thuộc","Lấy logarit, căn bậc hai, hoặc biến đổi Box–Cox để ổn định phương sai","Khi phương sai tăng theo giá trị kỳ vọng theo quan hệ nhân; đồng thời làm giảm bất đối xứng"],
    ["Sai số chuẩn vững","Giữ nguyên thang đo, thay ma trận hiệp phương sai của hệ số bằng ước lượng vững với phương sai thay đổi (White, 1980; MacKinnon & White, 1985)","Khi hệ số ước lượng vẫn đáng tin nhưng suy luận thống kê cần điều chỉnh; không làm thay đổi thang đo kết quả"],
    ["Mô hình tuyến tính tổng quát","Dùng họ phân phối phù hợp với biến phụ thuộc dương lệch phải, chẳng hạn họ Gamma với hàm liên kết logarit","Khi biến phụ thuộc có bản chất dương và phương sai tỷ lệ với bình phương trung bình"],
  ],[2100,3900,3000]));
k.push(cap("Bảng 2.1: Ba nhóm biện pháp xử lý vi phạm giả định và điều kiện áp dụng"));
k.push(p("Ước lượng sai số chuẩn vững dạng HC3 được MacKinnon và White (1985) khuyến nghị cho cỡ mẫu hữu hạn nhờ tính chất mẫu nhỏ tốt hơn các biến thể HC0 đến HC2:"));
k.push(fx([
"HC3:  Var(β̂) = (X'X)^-1 · [ Σ_i  e_i² / (1 − h_ii)² · x_i x_i' ] · (X'X)^-1",
"",
"      h_ii = phần tử đường chéo của ma trận chiếu H = X (X'X)^-1 X'"]));
k.push(p("Điểm cần nhấn mạnh về mặt phương pháp luận: hai nhóm biện pháp đầu không thay thế được nhau. Biến đổi biến phụ thuộc xử lý bất đối xứng và quan hệ nhân, còn sai số chuẩn vững xử lý suy luận thống kê. Áp dụng biến đổi khi vấn đề thực là bất đối xứng của phần dư chứ không phải phương sai thay đổi có thể làm tình trạng xấu đi thay vì tốt lên. Luận văn sẽ kiểm chứng điểm này bằng dữ liệu thực tại Chương 4."));

k.push(h3("2.1.3. Chuẩn hóa dữ liệu: standardize khác normalize"));
k.push(p("Hai phép biến đổi này thường bị dùng lẫn trong tài liệu ứng dụng, nhưng chúng phục vụ hai mục đích khác nhau và cho kết quả khác nhau."));
k.push(fx([
"Standardize (chuẩn hóa Z-score):",
"    z_k = ( x_k − mean(x_k) ) / sd(x_k)     →  trung bình 0, độ lệch chuẩn 1",
"    Miền giá trị không bị chặn; giữ nguyên hình dạng phân phối",
"",
"Normalize (co giãn Min–Max):",
"    x'_k = ( x_k − min(x_k) ) / ( max(x_k) − min(x_k) )  →  miền [0, 1]",
"    Bị chi phối mạnh bởi giá trị ngoại lai ở hai đầu"]));
k.push(p("Với mô hình hồi quy có hệ số cần diễn giải, phép chuẩn hóa Z-score là lựa chọn phù hợp vì nó cho phép so sánh trực tiếp độ lớn các hệ số giữa những biến có đơn vị đo khác nhau: hệ số chuẩn hóa cho biết biến phụ thuộc thay đổi bao nhiêu khi biến độc lập thay đổi một độ lệch chuẩn. Phép co giãn Min–Max phù hợp hơn cho các thuật toán cần đầu vào bị chặn, chẳng hạn mạng nơ-ron với hàm kích hoạt bão hòa. Trong bối cảnh dữ liệu vận hành có ngoại lai — thời gian xử lý tối đa đạt 24,66 ngày so với trung vị 6,20 ngày — phép co giãn Min–Max sẽ dồn đại đa số quan sát vào một khoảng rất hẹp và làm mất khả năng phân biệt."));

k.push(h3("2.1.4. Hồi quy logistic cho bài toán phân loại nhị phân"));
k.push(p("Khi biến phụ thuộc là nhị phân, hồi quy tuyến tính không còn phù hợp vì giá trị dự báo có thể nằm ngoài khoảng đơn vị và giả định phương sai không đổi bị vi phạm theo cấu trúc. Hồi quy logistic khắc phục bằng cách mô hình hóa logarit tỷ số chênh như một hàm tuyến tính của các biến độc lập (Hosmer, Lemeshow & Sturdivant, 2013)."));
k.push(fx([
"Chỉ số tuyến tính:   η_i = β_0 + Σ_{k=1..K} β_k · x_ki",
"Hàm liên kết logit:  ln[ p_i / (1 − p_i) ] = η_i",
"Xác suất:            p_i = P(Y_i = 1 | x_i) = 1 / ( 1 + exp(−η_i) )",
"",
"Ước lượng hợp lý cực đại:",
"    ℓ(β) = Σ_i [ y_i · ln(p_i) + (1 − y_i) · ln(1 − p_i) ]",
"    β̂ = argmax_β  ℓ(β)     (giải bằng Newton–Raphson hoặc IRLS)",
"",
"Diễn giải hệ số — tỷ số chênh:",
"    OR_k = exp(β_k)"]));
k.push(p("Một đặc điểm của hồi quy logistic cần lưu ý khi mô hình được dùng làm đầu vào cho bài toán tối ưu: xác suất dự báo phải được hiệu chuẩn, nghĩa là trong nhóm các quan sát có xác suất dự báo xấp xỉ một giá trị nào đó, tỷ lệ thực tế xảy ra sự kiện phải xấp xỉ đúng giá trị ấy. Một mô hình có khả năng phân biệt tốt nhưng hiệu chuẩn kém vẫn cho thứ hạng đúng nhưng cho mức xác suất sai, và khi nhân với biên lợi nhuận để tính lợi nhuận kỳ vọng thì sai số này truyền thẳng sang quyết định giá."));

k.push(h3("2.1.5. Chỉ số so sánh mô hình khi số biến độc lập lớn"));
k.push(p("Hệ số xác định R² có một tính chất khiến nó không dùng được để so sánh các mô hình khác số biến: R² không bao giờ giảm khi thêm biến, kể cả biến hoàn toàn không mang thông tin. Nguyên nhân nằm trong định nghĩa — thêm một cột vào ma trận thiết kế chỉ có thể làm tổng bình phương phần dư giảm đi hoặc giữ nguyên."));
k.push(p([run("Cần nói rõ một điểm kỹ thuật thường bị bỏ qua: ",{}),
  run("hệ số tương quan bội R = √R² là biến đổi đơn điệu của R², nên R bị thổi phồng đúng theo cùng một cách và không khắc phục được thiên lệch này",{bold:true,color:C.DRED}),
  run(". Công cụ đúng là các chỉ số có phạt bậc tự do và kiểm chứng ngoài mẫu.",{})]));
k.push(fx([
"R² hiệu chỉnh:     R²_adj = 1 − [ (1 − R²)(n − 1) ] / (n − K − 1)",
"AIC  (Akaike, 1974):   AIC = n · ln(SSE/n) + 2(K + 1)",
"BIC  (Schwarz, 1978):  BIC = n · ln(SSE/n) + (K + 1) · ln(n)",
"VIF (đa cộng tuyến):   VIF_k = 1 / (1 − R²_k)",
"",
"Với hồi quy logistic — các pseudo R²:",
"  McFadden (1974):    R²_McF = 1 − ℓ(β̂) / ℓ(β̂_0)",
"  McFadden h.chỉnh:   R²_adj = 1 − ( ℓ(β̂) − K ) / ℓ(β̂_0)",
"  Cox–Snell:          R²_CS  = 1 − exp[ 2( ℓ_0 − ℓ ) / n ]",
"  Nagelkerke (1991):  R²_N   = R²_CS / ( 1 − exp(2 ℓ_0 / n) )",
"  Brier (1950):       BS     = (1/n) Σ_i ( p_i − y_i )²"]));
k.push(p("Ngoài các chỉ số nội mẫu, kiểm chứng chéo (Stone, 1974) cung cấp ước lượng năng lực khái quát hóa và về nguyên tắc không thể bị thổi phồng bằng cách thêm biến. Trong bối cảnh dữ liệu có cấu trúc phân cụm — nhiều dòng hàng cùng thuộc một hồ sơ RFQ — việc phân chia phải thực hiện theo cụm dự án thay vì ngẫu nhiên theo dòng hàng, nếu không thông tin của cùng một hồ sơ sẽ xuất hiện đồng thời ở tập huấn luyện và tập kiểm tra, gây rò rỉ dữ liệu và làm chỉ số tốt lên một cách giả tạo."));

k.push(h3("2.1.6. So sánh mức biến động giữa nhiều nhóm"));
k.push(p("Để trả lời câu hỏi mức biến động thời gian xử lý giữa các khâu có như nhau hay không, cần kiểm định đồng nhất phương sai. Tài liệu cung cấp ba công cụ với độ vững khác nhau trước vi phạm giả định phân phối chuẩn."));
k.push(mkTable(
  ["Kiểm định","Giả thuyết không","Đặc điểm"],
  [
    ["Bartlett","Phương sai các nhóm bằng nhau","Công suất cao nhưng rất nhạy với vi phạm phân phối chuẩn"],
    ["Levene / Brown–Forsythe","Phương sai các nhóm bằng nhau","Dùng độ lệch tuyệt đối quanh trung vị; vững trước lệch chuẩn (Brown & Forsythe, 1974)"],
    ["Kruskal–Wallis","Phân phối các nhóm như nhau","Kiểm định phi tham số dựa trên hạng; không đòi hỏi phân phối chuẩn"],
  ],[2300,2700,4000]));
k.push(cap("Bảng 2.2: Ba kiểm định đồng nhất phương sai và điều kiện sử dụng"));
k.push(p("Khi so sánh mức biến động giữa các nhóm có trung bình khác nhau đáng kể, độ lệch chuẩn tuyệt đối không phải thước đo phù hợp vì nó tỷ lệ với thang đo. Hệ số biến thiên, định nghĩa là tỷ số giữa độ lệch chuẩn và trung bình, cho phép so sánh biến động tương đối giữa các nhóm có thang đo khác nhau. Khoảng tin cậy cho chênh lệch hệ số biến thiên giữa hai nhóm có thể xây dựng bằng phương pháp bootstrap khi phân phối lý thuyết không sẵn có."));
k.push(p("Ngoài ra, khi biến tổng là tổng của nhiều thành phần, phương sai của tổng phân rã thành tổng phương sai từng thành phần cộng với hai lần tổng các hiệp phương sai. Tỷ trọng của thành phần hiệp phương sai trong tổng cho biết mức độ đồng biến động giữa các khâu, một thông tin không thể suy ra từ việc phân tích riêng lẻ từng khâu:"));
k.push(fx(["Var( Σ_s T_s ) = Σ_s Var(T_s) + 2 · Σ_{s<t} Cov(T_s , T_t)"]));

/* ══════════ 2.2 ══════════ */
k.push(h2("2.2. Nền tảng lý thuyết định giá đấu thầu cạnh tranh"));
k.push(p("Nhánh lý thuyết thứ hai phục vụ bài toán thứ ba. Các công trình dưới đây tạo thành một bậc thang: mỗi bậc nới lỏng một giả định của bậc trước, đổi lại đòi hỏi thêm dữ liệu hoặc thêm cấu trúc mô hình."));

k.push(h3("2.2.1. Friedman (1956) — định giá đấu thầu theo best-response"));
k.push(p("Friedman (1956) đặt nền móng cho định giá đấu thầu cạnh tranh bằng một ý tưởng đơn giản mà bền vững: người chào giá chọn mức giá tối đa hóa lợi nhuận kỳ vọng, trong đó lợi nhuận kỳ vọng là tích của biên lợi nhuận và xác suất thắng ở mức giá đó."));
k.push(fx([
"p* = argmax_p  ( p − c ) · P(Win | p, x)",
"",
"c = chi phí biên đầy đủ ;  p = giá chào",
"P(Win | p, x) = xác suất thắng ước lượng từ dữ liệu lịch sử"]));
k.push(p([run("Giới hạn cấu trúc của khung này cần được nêu rõ vì nó là điểm khởi đầu cho toàn bộ phần mở rộng của luận văn: ",{}),
  run("P(Win | p, x) được ước lượng từ hành vi đối thủ đã quan sát trong quá khứ và mặc nhiên coi hành vi đó bất biến trước chính sách giá mới của doanh nghiệp",{bold:true}),
  run(". Nói cách khác, môi trường cạnh tranh được xử lý như ngoại sinh. Đây là mô hình tối ưu một phía, không phải mô hình cân bằng.",{})]));

k.push(h3("2.2.2. Từ best-response đến cân bằng: Vickrey, Harsanyi và Nash"));
k.push(p("Vickrey (1961) là công trình đầu tiên mô hình hóa đấu thầu kín như một trò chơi có luật rõ ràng, trong đó mỗi bên chào giá dựa trên giá trị riêng của mình và quy tắc trao thầu được công bố trước. Nash (1950) cung cấp khái niệm cân bằng: một tổ hợp chiến lược mà tại đó không bên nào có lợi khi đơn phương thay đổi chiến lược của mình. Harsanyi (1967) mở rộng khái niệm này sang trường hợp thông tin không đầy đủ, khi mỗi bên biết giá trị riêng của mình nhưng chỉ biết phân phối giá trị của đối thủ."));
k.push(fx([
"Cân bằng Bayesian Nash — điều kiện định nghĩa:",
"    β_i* ∈ argmax_{β_i}  E[ u_i(β_i , β_{−i}*) | c_i ]   ∀i",
"",
"Mỗi bên tối ưu ĐỒNG THỜI trước chiến lược cân bằng của bên còn lại,",
"thay vì trước hành vi lịch sử của họ."]));
k.push(p("Khác biệt so với khung Friedman nằm ở chỗ này: trong khung cân bằng, hành vi đối thủ là nội sinh — nó được suy ra từ chính bài toán tối ưu của đối thủ, chứ không lấy từ dữ liệu quá khứ."));

k.push(h3("2.2.3. Krishna (2009) — nghiệm dạng đóng và hai hệ quả kiểm chứng được"));
k.push(p("Krishna (2009) tổng hợp và trình bày nghiệm cân bằng dạng đóng cho đấu thầu với giá trị riêng tư độc lập. Với bài toán đấu thầu ngược, trong đó bên chào giá thấp nhất thắng, chiến lược cân bằng có dạng:"));
k.push(fx([
"β*(c) = c + ∫_c^(c_max) [ (1 − F(x)) / (1 − F(c)) ]^(N−1) dx",
"",
"Trường hợp chi phí phân phối đều trên [c_min , c_max]:",
"    β*(c) = c + ( c_max − c ) / N",
"",
"Diễn giải xác suất: biên giá = kỳ vọng chi phí thấp nhất trong",
"N − 1 đối thủ, với điều kiện tất cả đều cao hơn c."]));
k.push(p("Nghiệm này sinh ra hai hệ quả so sánh tĩnh có thể kiểm định trực tiếp trên dữ liệu. Thứ nhất, biên giá giảm khi số đối thủ tăng, với độ co giãn của logarit markup theo logarit số đối thủ xấp xỉ âm một trong trường hợp phân phối đều. Thứ hai, trong trạng thái cân bằng đối xứng, mỗi bên thắng với xác suất bằng một chia cho số đối thủ. Hai hệ quả này là cơ sở cho giả thuyết H1 đã phát biểu ở mục 1.5."));

k.push(h3("2.2.4. Nhánh Revenue Management và giá bóng của năng lực"));
k.push(p("Nhánh lý thuyết thứ hai xử lý câu hỏi định giá khi năng lực phục vụ hữu hạn. Gallego và van Ryzin (1994) chứng minh rằng giá tối ưu trong bài toán định giá động phản ánh giá trị cận biên của một đơn vị năng lực còn lại, chứ không chỉ phản ánh chi phí biên của sản phẩm."));
k.push(fx([
"Gallego & van Ryzin (1994):",
"    p*(t, C) = c + ∂V(t, C) / ∂C",
"    V(t, C) = hàm giá trị khi còn thời gian t và năng lực C",
"",
"Talluri & van Ryzin (2004) — bid-price control, dạng vận hành:",
"    Chấp nhận yêu cầu khi và chỉ khi   r ≥ Σ_j  a_j · λ_j",
"",
"    r = giá trị yêu cầu ; a_j = lượng tài nguyên j mà nó tiêu thụ",
"    λ_j = giá bóng của tài nguyên j"]));
k.push(p("Điểm quan trọng về mặt vận hành: cơ chế bid-price control ở dạng nguyên bản là một quy tắc về quyết định TIẾP NHẬN, không phải quy tắc về mức giá. Nó trả lời câu hỏi có nên nhận yêu cầu này hay không, chứ không trả lời câu hỏi nên chào bao nhiêu. Việc chuyển khái niệm giá bóng từ biến quyết định tiếp nhận sang biến quyết định giá là một bước ánh xạ cần được kiểm chứng chứ không được mặc nhiên thừa nhận. Giả thuyết H2 ở mục 1.5 chính là phát biểu kiểm định được của bước ánh xạ này."));

k.push(h3("2.2.5. Hai hướng được khai báo loại trừ khỏi phạm vi"));
k.push(p("Hai nhánh lý thuyết sau đây phù hợp về mặt khái niệm với bài toán nhưng không khả thi với dữ liệu hiện có. Việc khai báo tường minh nhằm xác định rõ ranh giới phạm vi nghiên cứu."));
k.push(p([run("Đấu giá chấm điểm (Che, 1993). ",{bold:true}),
  run("Che (1993) mở rộng khung đấu thầu sang cạnh tranh đa chiều, trong đó người mua công bố một hàm điểm kết hợp giá và các thuộc tính chất lượng, và bên thắng là bên tối đa hóa điểm chứ không phải bên có giá thấp nhất. Đây là khung đúng về mặt lý thuyết cho bối cảnh có lợi thế phi giá. Luận văn không theo đuổi hướng này vì hàm điểm của khách hàng không quan sát được trong dữ liệu ERP, và việc ước lượng nó là một đề tài riêng.",{})]));
k.push(p([run("Ước lượng cấu trúc phi tham số (Guerre, Perrigne & Vuong, 2000). ",{bold:true}),
  run("Phương pháp này cho phép nghịch đảo từ phân phối giá chào quan sát được ra phân phối chi phí tiềm ẩn của các bên tham gia, theo công thức c = b − (1 − G(b)) / ((N − 1) · g(b)), trong đó G và g là hàm phân phối và mật độ của giá chào. Điều kiện tiên quyết là quan sát được giá chào của toàn bộ các bên tham gia. Dữ liệu của nghiên cứu này chỉ ghi nhận giá chào của doanh nghiệp và kết quả thắng thua, nên hướng này không khả thi.",{})]));

/* ══════════ 2.3 ══════════ */
k.push(h2("2.3. Quy trình khai phá dữ liệu làm khung tổ chức công việc"));
k.push(p("Về mặt tổ chức công việc, luận văn kế thừa quy trình CRISP-DM (Wirth & Hipp, 2000) đã được sử dụng trong công trình nghiên cứu trước đó của tác giả. Quy trình gồm sáu pha: hiểu bài toán nghiệp vụ, hiểu dữ liệu, chuẩn bị dữ liệu, mô hình hóa, đánh giá, và triển khai."));
k.push(p("Cần nêu rõ một giới hạn về phạm vi áp dụng của quy trình này. CRISP-DM được thiết kế cho chu trình khai phá dữ liệu, phù hợp trọn vẹn với BT1 và BT2. Tuy nhiên bốn công việc cốt lõi của bài toán thứ ba — dẫn xuất nghiệm cân bằng, xây dựng giá bóng của năng lực, đánh giá phản thực giữa các chính sách giá, và thiết kế thực nghiệm có kiểm soát — không thuộc bất kỳ pha nào của CRISP-DM. Chúng thuộc phạm vi vận trù học và kinh tế lượng ứng dụng."));
k.push(p("Vì vậy luận văn tổ chức công việc theo hai trục chồng lên nhau: trục thứ nhất là sáu pha CRISP-DM phục vụ hai bài toán dự báo, trục thứ hai là chuỗi công việc lý thuyết và thực nghiệm phục vụ bài toán tối ưu giá. Đầu ra đã hiệu chuẩn của trục thứ nhất — xác suất thắng — là đầu vào trực tiếp của trục thứ hai. Cách tổ chức này giữ được tính liên tục với công trình trước, đồng thời không ép các công việc mới vào một khung không được thiết kế cho chúng."));

/* ══════════ 2.4 ══════════ */
k.push(h2("2.4. Định vị nghiên cứu và phát biểu khoảng trống"));
k.push(p("Bảng dưới đây định vị luận văn trên hai chiều: mức độ nội sinh hóa hành vi đối thủ và mức độ xử lý ràng buộc năng lực. Mỗi ô ghi công trình đại diện và điều kiện dữ liệu mà nó đòi hỏi."));
k.push(mkTable(
  ["","Không xét ràng buộc năng lực","Có xét ràng buộc năng lực"],
  [
    ["Hành vi đối thủ ngoại sinh","Friedman (1956) — best-response trên xác suất thắng ước lượng từ lịch sử.\nĐiều kiện: chỉ cần dữ liệu thắng/thua của chính doanh nghiệp.\n→ NỀN TẢNG KẾ THỪA","Gallego & van Ryzin (1994); Talluri & van Ryzin (2004) — định giá và tiếp nhận có xét giá trị cận biên của năng lực.\nĐiều kiện: đo được năng lực và chi phí tắc nghẽn.\n→ TRỤC GIẢ THUYẾT H2"],
    ["Hành vi đối thủ nội sinh","Krishna (2009) — nghiệm cân bằng dạng đóng.\nĐiều kiện: biết phân phối chi phí và số đối thủ.\n→ TRỤC GIẢ THUYẾT H1","Ô còn trống trong tài liệu ở bối cảnh phân phối công nghiệp B2B.\nĐiều kiện: đồng thời cả hai nhóm trên.\n→ VỊ TRÍ CỦA LUẬN VĂN"],
  ],[1900,3550,3550],[1]));
k.push(cap("Bảng 2.3: Ma trận định vị nghiên cứu theo hai chiều nội sinh hóa cạnh tranh và ràng buộc năng lực"));
k.push(p("Phát biểu chính xác khoảng trống, tách thành ba mệnh đề tương ứng ba bài toán."));
k.push(p([run("Với BT1, ",{bold:true}),
  run("tài liệu về dự báo thời gian xử lý trong chuỗi quy trình dịch vụ tập trung vào dự báo thời gian tổng. Việc phân rã biến động theo từng khâu và diễn giải cấu trúc biến động đó như một chỉ báo về mức độ ổn định của tổ chức và độ phức tạp của hồ sơ chưa được khai thác trong bối cảnh quy trình báo giá B2B.",{})]));
k.push(p([run("Với BT2, ",{bold:true}),
  run("các nghiên cứu dự báo thắng thua thường dừng ở năng lực phân biệt, đo bằng diện tích dưới đường cong ROC. Khi mô hình được dùng làm đầu vào cho bài toán tối ưu giá, yêu cầu về hiệu chuẩn xác suất và về đặc tả tường minh cơ chế từng nhóm biến trở thành điều kiện bắt buộc, nhưng ít được báo cáo đầy đủ.",{})]));
k.push(p([run("Với BT3, ",{bold:true}),
  run("hai nhánh lý thuyết định giá cân bằng và quản trị năng lực đã phát triển độc lập và đều có nền tảng vững. Theo hiểu biết của tác giả, chưa có công trình nào triển khai đồng thời cả hai trên dữ liệu báo giá B2B thực và đối chiếu chúng với chính sách hiện hành bằng một quy trình đánh giá thống nhất. Đây là ô còn trống ở góc dưới bên phải của Bảng 2.3.",{})]));
k.push(p("Cần phát biểu thận trọng về kỳ vọng. Việc một ô còn trống trong ma trận định vị không tự động có nghĩa là lấp ô đó sẽ cho kết quả tốt hơn. Điều kiện dữ liệu mà mỗi nhánh lý thuyết đòi hỏi — đặc biệt là việc biết phân phối chi phí và số đối thủ — có thể không được thỏa mãn trong bối cảnh nghiên cứu. Luận văn vì vậy đặt hai giả thuyết H1 và H2 ở dạng kiểm định được, chứ không giả định trước rằng chúng đúng."));

return k;
};
