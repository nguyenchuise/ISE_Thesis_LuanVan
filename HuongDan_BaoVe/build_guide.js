// Bien soan "Tai lieu hieu sau va chuan bi bao ve luan van" — chay: node HuongDan_BaoVe/build_guide.js
const path=require("path");
const G=require("./g_common.js");
const {L}=G; const {C,center,pb,Paragraph,TableOfContents,AlignmentType,run,p,HeadingLevel}=L;
process.chdir(G.SRC);   // de img() tim duoc FIG_*.png
const front=[
  center("TÀI LIỆU HIỂU SÂU VÀ CHUẨN BỊ BẢO VỆ LUẬN VĂN THẠC SĨ",{bold:true,size:32,color:C.RED,after:300}),
  center("Ứng dụng Khai phá Dữ liệu trong Dự báo Thời gian Xử lý và Tối ưu hóa Giá Báo thầu tại Doanh nghiệp Phân phối Vật tư Công nghiệp B2B",{size:26,italic:true,after:500}),
  center("Lý thuyết — Áp dụng — Ý nghĩa — Câu hỏi phản biện",{bold:true,size:26,after:300}),
  center("Ngành Kỹ thuật Hệ thống Công nghiệp · Học viên Chu Thái Nguyên",{size:24,after:200}),
  center("Tài liệu học tập cá nhân — không nộp kèm luận văn",{size:22,italic:true,color:C.MUTE,after:600}),
  p("Mọi con số trong tài liệu được đọc tự động từ các tệp kết quả JSON của luận văn (thư mục src), nên khớp với bản nộp. Các bảng và hình được đánh số riêng (Bảng 0.x, Hình 0.x) để không lẫn với số bảng, số hình trong luận văn; khi trích dẫn trước hội đồng, hãy dùng số trong luận văn được ghi kèm trong ngoặc."),
  pb(),
  new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{after:240},children:[run("MỤC LỤC",{size:30,bold:true,color:C.RED})]}),
  new TableOfContents("Mục lục",{hyperlink:true,headingStyleRange:"1-2"}),
  new Paragraph({alignment:AlignmentType.CENTER,children:[run("(Trong Word: nhấp phải vào mục lục → Update Field để hiện số trang)",{size:20,italic:true,color:C.MUTE})]}),
];
const body=[...require("./g_part1.js")(G),...require("./g_part2.js")(G),...require("./g_part3.js")(G),...require("./g_part4.js")(G)].flat(Infinity);
L.build([...front,...body],path.join(__dirname,"HuongDan_HieuSau_BaoVe_LuanVan.docx"));
