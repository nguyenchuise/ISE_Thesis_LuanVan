# BÀN GIAO — LUẬN VĂN v2.0 HOÀN CHỈNH (17-09-2026)

**Nguồn số liệu chuẩn hiện hành: `SoT_v2_SoLieuChuan.md`.** File `LEGACY_SoT_SoLieuChuan_v1_XGB.md` chỉ còn giá trị lịch sử (số BT3 từ pipeline XGBoost, đã bị thay).

## 1. Trạng thái
`ChuThaiNguyen_LuanVan_v2.0.docx` — **65 trang, HOÀN CHỈNH**: bìa · cam đoan · tóm tắt · abstract · mục lục (TOC field) · viết tắt (3 nhóm) · danh sách 10 hình · danh sách 41 bảng · Chương 1–6 · tài liệu tham khảo (27 mục, 3 nhóm, APA 7) · Phụ lục A/B/C · 6 footnote · số trang chân trang.

**Mọi con số trong Chương 4–6, Tóm tắt, Phụ lục đều do file JS đọc từ JSON lúc biên soạn — không gõ tay.** Đổi kết quả → chạy lại `node build_all.js` là bảng đổi theo.

Kèm `ChuThaiNguyen_LuanVan_v2.0_MaNguon.zip` (script Python, JSON kết quả, hình PNG, bộ sinh docx).

## 2. Kiến trúc đã chốt (theo góp ý GVHD 16-09)
- BT1/BT2 là **thân bài** (Ch.3 §3.2–3.3, Ch.4 §4.1–4.2). BT3 giữ ở mức kiểm định giả thuyết H1/H2, phạm vi thu hẹp, nằm sau.
- Tên đề tài mới: *Ứng dụng Khai phá Dữ liệu trong Dự báo Thời gian Xử lý và Tối ưu hóa Giá Báo thầu tại Doanh nghiệp Phân phối Vật tư Công nghiệp B2B*.
- Chương 2 hai nhánh: §2.1 nền tảng thống kê (Gauss–Markov, BP/White/JB, HC3, standardize≠normalize, logistic, R² thiên lệch, Levene/Bartlett/KW) · §2.2 lý thuyết đấu giá · §2.3 CRISP-DM + trục 2 · §2.4 ma trận định vị.
- Chương 3: quy trình 5 bước chẩn đoán giả định (Bảng 3.2); khung diễn giải **đăng ký trước** (Bảng 3.3); 6 nhóm biến BT2 với dấu kỳ vọng (Bảng 3.4); FOC BT3; bộ chỉ số (Bảng 3.5).
- Chương 5: ba trụ cột; **§5.3.2 mới — ba bằng chứng hội tụ từ ba bài toán** (Bảng 5.2).
- Chương 6: cổng 3 bước (Bảng 6.1), khung CBPO an toàn (Bảng 6.2), 3 nguyên tắc vận hành, 4 khuyến nghị (Bảng 6.3).

## 3. Các phát hiện đã giải quyết trong lần này
| Phát hiện | Cách giải quyết |
|---|---|
| Ch.3 đặc tả logistic, BT3 cũ dùng XGBoost | Tái ước lượng toàn bộ BT3 trên logistic. Kết luận định tính giữ nguyên; số đổi (bảng đối chiếu trong SoT_v2) |
| Ch.3 hứa TAT dự báo làm biến BT2, chưa chạy | Đã chạy OOF 5-fold, ghép vào BT2. Kết quả: β +0,056, p 0,089, **dấu ngược kỳ vọng** → thành bằng chứng cho trụ cột II |
| ICC cũ 0,05 không tái lập được | Tính trên 4 đại lượng (0,18–0,26, Bảng B.2); dùng ICC lợi nhuận (0,20) cho chỉ tiêu chính, ICC thắng/thua (0,18) cho guard; footnote giải thích |
| Ch.1 ghi "trung vị 2,39" (thực là mean) | Sửa: trung vị 2,1/1,7/1,2/0,8; mean ghi kèm |
| Ch.1 "8.300 quyết định/năm" | Sửa: 8.249 trong 299 ngày ≈ 10.000/năm |
| Ch.3 trích dẫn "kết quả Chương 4" | Đổi thành "đăng ký trước" |
| λ(Q=30) < λ(Q=20) do chặn Q trước sai phân | Sửa: chặn Q, không chặn P(Q+1) → 0,73/2,05/3,50/4,23 đơn điệu |
| Hình 1.1/1.2 đảo thứ tự | Đã đổi |
| Dấu trừ ASCII từ JSON | f() chuyển thành dấu trừ Unicode |

## 4. Điểm cần anh chuẩn bị giải thích với GVHD
1. **BT3 vẫn giữ** dù thầy nói "gác": hiểu là thứ tự làm việc; CBPO đã cam kết trong proposal; H1/H2 thu hẹp phạm vi.
2. **Log-transform bị bác bỏ**: thầy dặn "bất ổn thì transform" — làm đúng quy trình thầy dạy (kiểm tra trước), nhưng thang gốc đã ổn, log mới tạo bất ổn. Bảng 4.2 + Hình 4.2.
3. **Tách khâu không cải thiện dự báo** (0,77%): giá trị là chẩn đoán. Nói thẳng ở §4.1.3.
4. **ICC mới lớn hơn cũ 4 lần** → A/B cần lâu hơn (guard 3pp: 18,7 tháng).
5. **BT2 hơi lạc quan** (+3,95% số thắng, +2,7% lợi nhuận tại giá lịch sử) — đã khai báo ở §4.2.2, §5.5.2.

## 5. Việc còn lại trước khi nộp
- [ ] Mở file trong Word → chuột phải Mục lục → Update Field
- [ ] Rà trích dẫn Nhóm B–C (số trang) lần cuối
- [ ] Đánh version theo yêu cầu GVHD: v2.0 = bản sau review 16-09
- [ ] Nếu GVHD chấp thuận: cân nhắc tách BT1 thành bài báo hội nghị
