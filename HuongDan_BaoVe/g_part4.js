// PHAN XI: doc luan van theo chuong — ba tru cot, Cong 3 buoc, danh muc bang/hinh cua ban nop
module.exports=function(G){
const {L,D,f,fs_,fp,pct,pv,n0,coef,POL,note,warn,Q,LT,AD,YN}=G;
const {C,run,p,h1,h2,h3,fx,mkTable,cap,REG}=L;
const k=[]; const B3=D.B3,S1=D.S1,SIM=D.SIM,TR=D.TR;
const cb=POL["CBPO Realistic (kẹp P5–P95)"], nA=POL["Nash A — miền tuyệt đối (kẹp)"], nB=POL["Nash B — miền tỷ lệ (kẹp)"], nC=POL["Nash C — cận dòng hàng, N thực tế (kẹp)"];
const M1=SIM.main.C1["1.0"], M2=SIM.main.C2["1.0"];

k.push(h1("PHẦN XI. ĐỌC LUẬN VĂN THEO CHƯƠNG"));
k.push(h2("XI.1. Chương 5 — ba trụ cột biện luận"));
k.push(p("Chương 5 không lặp lại kết quả mà trả lời câu hỏi “vì sao các kết quả cùng đúng”. Mỗi trụ cột dựa trên bằng chứng từ nhiều hơn một bài toán — đó là điểm mạnh nên nhấn mạnh."));
k.push(mkTable(["Trụ cột","Câu hỏi","Câu trả lời ngắn"],
 [["I — Từ BNE thuần giá đến BNE có vị thế phi giá","Vì sao A, B thất bại còn C phục hồi?",`A, B đo miền chi phí của đối thủ; giá thực phản ánh mức sẵn lòng trả của khách có tính lợi thế phi giá (tỷ lệ thắng ${pct(S1.phan_ung_canh_tranh.Low.win,0)} > 1/N; AUC không giá vẫn cao). C dùng cận từ phía cầu → kẹp ${pct(nC.clip,0)} thay vì ${pct(nA.clip,0)}/${pct(nB.clip,0)}`],
  ["II — Hội tụ của ba bài toán và mô phỏng","Vì sao giá không giải phóng hàng đợi, còn phân luồng thì có?",`Việc định giá phát sinh trước quyết định giá; giả dược tĩnh ${fs_(B3.placebo.dong_gop_dieu_tiet_pp,2)} điểm; mô phỏng: phân luồng ${fs_(M1.compare.P5_vs_P2.mean_pp,2)} điểm, λ trong giá ${fs_(M1.compare.P6_vs_P3.mean_pp,2)} điểm (C1). Giá bóng là quy tắc tiếp nhận (Talluri & van Ryzin, 2004)`],
  ["III — Dị chất B2B, ngưỡng π_SLA, kỷ luật kiểm chứng","Kết luận có điều kiện trên những gì?",`Giá vốn trải gần 40 lần → cận chung không tồn tại; giá bóng chỉ ${f(TR.lam_over_E_pct,1)}% lợi nhuận hồ sơ trung vị → đủ để xếp thứ tự, chưa đủ để từ chối; ICC ${f(B3.ab_design.ICC,2)} → phải ngẫu nhiên hóa theo hồ sơ`]],[2400,2400,4200]));
k.push(cap("Bảng 0.10: Ba trụ cột (Bảng 5.1 trong bản nộp)"));
k.push(h2("XI.2. Chương 6 — hai khung ứng dụng và bốn nguyên tắc"));
k.push(p([run("Cổng ba bước (Bảng 6.1). ",{bold:true}),run(`Bước 1: tỷ lệ thắng vượt 1/N? (có → thị trường không đối xứng thuần giá). Bước 2: bỏ toàn bộ biến giá, AUC còn cao? (có → phi giá chi phối). Bước 3: tỷ lệ kẹp khi áp công thức cân bằng có gần mức CBPO không? A ${pct(nA.clip,0)}, B ${pct(nB.clip,0)} → không đạt; C ${pct(nC.clip,0)} so với CBPO ${pct(cb.clip,0)} → đạt ngưỡng nội suy (ở N ≥ 3). Ý nghĩa: một quy trình rẻ, chạy vài giờ trên dữ liệu lịch sử, để biết mô hình cân bằng có dùng được trước khi đầu tư.`,{})]));
k.push(p([run("Khung định giá hai tầng (Bảng 6.2). ",{bold:true}),run("Tầng lõi CBPO (hiệu chuẩn, trong dải lịch sử, không phụ thuộc tham số không nhận dạng); tầng tham chiếu là giá cân bằng đặc tả C cho cơ hội có từ ba đối thủ — để người định giá đối chiếu và phát hiện khuyến nghị bất thường.",{})]));
k.push(p([run("Bốn nguyên tắc vận hành (Mục 6.3). ",{bold:true}),run("(1) Không dùng giá để điều tiết hàng đợi; (2) đặt bộ lọc phân luồng G2 tại pha Sales-WBS, chế độ xếp thứ tự; (3) dùng định giá hiệu chuẩn cho biên lợi nhuận trên hồ sơ đã xếp lịch; (4) giảm số lần làm rõ bản vẽ — đòn bẩy duy nhất giảm chính khối lượng việc.",{})]));
k.push(note("Câu kết luận nên nói khi được hỏi “bài học lớn nhất là gì”",[
  "Giá chào là đòn bẩy cho biên lợi nhuận; điều phối tiếp nhận là đòn bẩy cho năng lực; hai đòn bẩy phải đồng bộ chứ không thay thế nhau.",
  "Về phương pháp: kiểm tra giả định trước khi tin mô hình, kiểm tra ranh giới áp dụng trước khi tin công thức, đối chứng giả dược trước khi quy công cho cơ chế."]));

// danh muc bang / hinh cua ban nop: chay lai cac chuong de lay chu thich tu so dang ky
k.push(h2("XI.3. Danh mục bảng và hình của luận văn — để tra khi được hỏi"));
const nF=REG.figs.length, nT=REG.tabs.length, nFN=L.FN.list.length;
["./ch01.js","./ch02.js","./ch03.js","./ch04.js","./ch05.js","./ch06.js","./back.js"].forEach(fn=>require(require("path").join(G.SRC,fn))(L));
const figs=REG.figs.slice(nF), tabs=REG.tabs.slice(nT);
REG.figs.length=nF; REG.tabs.length=nT; L.FN.list.length=nFN;   // bo footnote cua ban nop
k.push(p("Tên mỗi bảng và hình trong luận văn đã được viết dưới dạng một thông điệp; đọc to tên bảng là cách nhanh nhất để nhớ bảng đó chứng minh điều gì."));
k.push(mkTable(["Hình","Thông điệp"],figs.map(x=>[`Hình ${x.id}`,x.text]),[1300,7700],null,true));
k.push(cap("Bảng 0.11: Các hình trong luận văn"));
k.push(mkTable(["Bảng","Thông điệp"],tabs.map(x=>[`Bảng ${x.id}`,x.text]),[1300,7700],null,true));
k.push(cap("Bảng 0.12: Các bảng trong luận văn"));
return k;
};
