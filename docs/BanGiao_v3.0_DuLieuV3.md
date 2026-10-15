# BÀN GIAO — LUẬN VĂN v3.0 TRÊN BỘ DỮ LIỆU V3 (15-10-2026)

**Nguồn số liệu chuẩn hiện hành: `SoT_v3_SoLieuChuan.md`** (sinh tự động bởi `src/make_sot.py`). `SoT_v2_SoLieuChuan.md` chỉ còn giá trị lịch sử.

## 1. Thay đổi dữ liệu

| Hạng mục | v2.0 (bản nháp) | v3.0 |
|---|---|---|
| HeadView | 1.500 × 29 | 1.500 × 31 (+ `Effective_Competitors_N`, `Urgency_SLA_Sensitivity`) |
| ItemView | 8.249 × 22 | 8.249 × 23 (+ `Market_Reserve_Bound`); `Item_Win_Status` đã đối soát |
| Nhãn đổi | — | 190 dòng (127 thắng→thua, 63 thua→thắng), 111 hồ sơ |
| Nhãn cũ | — | lưu ở `src/ItemView_Workload_v1_NhanTruocDoiSoat.csv` để chạy độ nhạy |

Mọi trường khác giống hệt byte-by-byte về giá trị. BT1 tái lập y nguyên.

## 2. Kết quả kiểm toán dữ liệu — PHẢI đọc trước khi bảo vệ

`src/data_audit.py` → `data_audit.json`. Đã khai báo trong luận văn (§3.1.2, §4.2.5, §5.5.1, Bảng B.3–B.5):

1. **`Effective_Competitors_N`** = ánh xạ của `Competitor_Intensity` (Low→2, Med→3, High→4 hoặc 5). Thông tin mới chỉ ở tầng High.
2. **`Urgency_SLA_Sensitivity`** khớp **100%** với `(1 + 0,5·Is_Strategic) × (1 + 0,25·1[Required_Approval_Levels ≥ 3])` → trường dẫn xuất, không có thông tin độc lập.
3. **`Market_Reserve_Bound`** ≈ 1,99 × giá vốn (CV 5,8%, tương quan 0,992). Đặc tả Nash C về cấu trúc là đặc tả tỷ lệ với δ ≈ 0,99 (so với δ_B = 0,18).
4. **190 nhãn đổi phân bố theo quy luật rõ ràng theo độ sâu hàng đợi**: mọi dòng thắng→thua có Q ≥ 6 (70/127 ở Q 21–30); mọi dòng thua→thắng có Q ≤ 8 (57/63 ở Q ≤ 5). Trên nhãn cũ, β_Queue (p = 0,060), β_TAT (dấu dương, p = 0,089) và β_CompInt (p = 0,23) **không có ý nghĩa**; trên nhãn mới cả ba có ý nghĩa ở 1%. Tức là kết luận "hàng đợi/TAT làm giảm xác suất thắng" phụ thuộc hoàn toàn vào 2,3% nhãn đã đối soát.

**Khuyến nghị:** chuẩn bị hồ sơ đối soát gốc (nhật ký ERP/CRM: ai đổi, khi nào, lý do) để trình hội đồng. Một quy trình đối soát hợp lệ có thể tạo ra quy luật này (ví dụ đơn chậm bị khách hủy sau ngày trích xuất), nhưng hội đồng sẽ hỏi. Luận văn đã báo cáo song song hai phiên bản nhãn — không nên bỏ phần này.

## 3. Đối chiếu với kỳ vọng nêu trong yêu cầu sửa (số thực tế đã chạy)

| Nội dung | Kỳ vọng trong yêu cầu | Kết quả thực tế (đã dùng trong luận văn) |
|---|---|---|
| Chênh lệch hai đường tính §4.1.3 | 0,77% | **0,77%** (0,8437 vs 0,8372) ✔ |
| β Price_Competitiveness | +0,8335 | **+0,8384** |
| β Competitor_Intensity | −0,0903, p = 0,0052 | **−0,1334, p < 0,0001** |
| β Pricing_Queue_Depth | −0,2018 | **−0,2220, p < 0,0001** |
| β TAT_pred | −0,0927, p = 0,0036 | **−0,0927, p = 0,0038** |
| Split | 6.153 / 1.366 / 295 | **6.153 / 1.366 / 295** ✔ |
| Nash C tỷ lệ kẹp | ~34,9% | **32,4%** (CBPO 36,4%) |
| Nash C uplift dạng đóng thuần | +8,02% | **+11,68%** (kẹp +10,45%; lai logistic +12,85%) |
| H1 lịch sử | b ≈ −0,0075, p > 0,20 | **−0,0065 (N lai, p = 0,224); −0,0033 (N thực tế, p = 0,169)** |
| H1 FOC | b ≈ −0,85 đến −1,10 | **b = −0,370** (bác bỏ cả 0 và −1) — *không đạt kỳ vọng* |
| H1 Nash C | b ≈ −0,85 đến −1,10 | **b = −1,121** — nhưng là **đồng nhất thức** (≈ −1 theo định nghĩa công thức), không phải bằng chứng; đã khai báo |
| Mô phỏng: P4 vượt giả dược | +3,8 đến +4,5 pp | **+1,91 pp (C1) đến +6,56 pp (C2)** ở π_SLA = 1; P4 vượt CBPO tĩnh +4,44 pp (C1) |
| Vi phạm SLA dưới cơ chế đồng bộ | < 22% | **36,0% (C1) – 32,2% (C2)** — *không đạt*; 85% hồ sơ vi phạm vượt 7 ngày với biên lớn hơn thời gian chờ có thể sắp xếp lại |

Không có tham số mô phỏng nào được chỉnh để đạt con số kỳ vọng. Quy tắc phân luồng G1 (ngưỡng giá bóng thuần) được thử trước; khi thấy nó đổi dấu ở π_SLA cao, quy tắc G2 (chỉ số ATC, có cơ sở lý thuyết Cox & Smith 1961, Vepsalainen & Morton 1987) được bổ sung — **cả hai đều được báo cáo** (P4 và P7) để không che giấu bậc tự do của nhà nghiên cứu.

## 4. Cấu trúc mới

- **§4.4 (mới)** Mô phỏng liên kỳ: 4.4.1 hiệu chỉnh C1/C2 · 4.4.2 bảy cơ chế · 4.4.3 ai được rút ngắn chờ · 4.4.4 mặt phẳng chuyển pha · 4.4.5 giới hạn. Tổng hợp → §4.5, A/B → §4.6 (2 và 3 nhánh).
- Bảng 4.11 (N, thêm dòng CRM) · Bảng 4.13 (A, B, C, λ, λ·U) · Bảng 4.14 (H1 hai mặt) · Bảng 4.16–4.20 (mô phỏng) · Bảng B.4–B.5 (độ nhạy nhãn).
- Chương 5: ba trụ cột theo yêu cầu. Chương 6: Bảng 6.1 (A, B không đạt bước 3; C đạt), Bảng 6.2, 6.3 (A/B 3 nhánh + phân luồng G2 + giảm làm rõ bản vẽ).
- Công thức (ô fx) chuyển sang Times New Roman để hiển thị đủ dấu tiếng Việt; bảng ngắn không bị cắt trang; tỷ lệ ảnh đọc từ PNG.

## 5. Việc còn lại
- [ ] Mở docx trong Word → chuột phải Mục lục → Update Field.
- [ ] Chuẩn bị hồ sơ đối soát nhãn (mục 2.4 ở trên).
- [ ] Xác nhận với doanh nghiệp nguồn gốc 3 trường bổ sung (đặc biệt Urgency là trường dẫn xuất).
- [ ] Trình GVHD phần mô phỏng §4.4 như *bằng chứng định hướng*, không phải kết quả thực nghiệm.
