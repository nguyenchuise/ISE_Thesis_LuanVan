> ⚠ LEGACY — KHÔNG DÙNG SỐ TRONG FILE NÀY CHO LUẬN VĂN v2.0.
> Đây là nguồn số liệu của bản v1 (BT3 dựa trên XGBoost, chốt 16-08-2026). Nguồn số liệu chuẩn hiện hành là `SoT_v2_SoLieuChuan.md`. File được giữ để tra cứu lịch sử: các kết luận định tính và khung biện luận ba trụ cột vẫn giữ nguyên, nhưng con số đã đổi (ví dụ CBPO +14,2% → +14,03%; Nash A +17,2% → +4,19%; ICC 0,0494 → 0,1997).

# NGUỒN SỐ LIỆU CHUẨN — Số liệu chuẩn luận văn
*Chốt 16-08-2026. Nguồn: HeadView_Workload.csv + ItemView_Workload.csv + mã nguồn phân tích. Cập nhật lần 7: HOÀN TẤT BIÊN TẬP HỌC THUẬT TOÀN VĂN (Chương 1–6 + phụ lục).*

## 1. Nền tảng thực tập

| Chỉ số | Giá trị chuẩn |
|---|---|
| Quy mô | 1.500 dự án / 8.249 item / 220 khách hàng (raw 11.694 → cleansed 8.249) |
| SLA | 7 ngày; breach = **565**/1.500 = 37,7% |
| Win/Loss | 5.295 Win (64,2%) / 2.954 Loss (35,8%) |
| TAT | median 6,20d; mean 6,61d; std 2,70; max 24,66d; skew 1,44 |
| Bottleneck (median) | Pricing 2,1 > WBS 1,7 > SC 1,2 > Sales 0,8 ngày |
| BT1 (T0+T2) | XGBoost R²=0,7603±0,0586; MAE_log=0,1050; Ridge R²=0,7268 |
| BT1 (T0-only) | Lasso R²=0,3635; ΔR² = **+0,3968 (~+0,40)** |
| BT2 | Logistic AUC=0,7587±0,0145; Brier=0,1994 |
| Bootstrap 1000× | AUC CI [0,7270; 0,7755] |
| Temporal Q4 | AUC=0,7644 [0,7232; 0,8021]; drift +0,76% |
| Ablation | FULL 0,7587 (29 đặc trưng) / NO_PC 0,7464 (28) / NO_PRICE 0,6926 (25) |
| Threshold | **Báo DẢI 0,10–0,20** (FN:FP=5:1) |
| CBPO (thực tập) | Actual $35.778 / CP −2,3% / Realistic +14,4% / Optimistic +39,2% |
| Nash bootstrap | p*/c: Low 1,3950 > Med 1,3928 > High 1,3912; Δ=0,38pp |
| Queue | mean 10,01; median 9; max 60; p95=23; 16/1.500 (1,1%) có Q>30 |
| TAT×WinRate | χ²=0,68; p=0,41; φ=0,009 |
| SHAP thật (TreeExplainer) | PC 0,703 > SQE 0,375 > ATP 0,243 > Existing 0,219 > PPAP 0,205 |

## 1b. Chương 3 — hiệu chỉnh và shadow price

| Chỉ số | Giá trị chuẩn |
|---|---|
| Win rate theo cạnh tranh | Low 0,732 · Med 0,646 · High 0,543 |
| Markup_Pct theo cạnh tranh | Low 1,2705 · Med 1,2690 · High 1,2671 (phẳng) |
| Corr(c, markup tuyệt đối) | +0,865 — **ĐỊNH NGHĨA**, xem mục 13 |
| Corr(c, Markup_Pct) | −0,001; Markup_Pct mean 1,2689 std 0,0715 |
| c_high (P99) | SST 387,34 · ST 300,58 · ALU 351,28 · PLAS 197,66 |
| Dải giá vốn tb/mặt hàng | 15,8 – 599,5 USD (căn cứ Trụ cột III, mục 5.4) |
| N — 4 phương pháp | MoM 5,63/5,63/5,67 · 1/WinRate 1,37/1,55/1,84 · Chuyên gia 2/4/6 · **Lai (CHỌN) 2,00/2,27/2,70** |
| Logit P(breach\|Q) | −1,3870 + 0,0863·Q; p = 6,6e−22 |
| Biên lợi nhuận tb/mặt hàng | $34,92–34,95 · mặt hàng tb/RFQ 5,50 |
| λ_item (π=0,50) | Q=0 $0,68 · Q=10 $1,89 · Q=20 $3,24 · Q=30 $3,91 (trần) |
| Q theo cạnh tranh / tháng | 10,21/10,10/9,63 · 9,19–10,47 |
| Lợi nhuận thực nhận/mặt hàng | mean $22,54; sd $23,70 |
| ICC / DEFF | 0,0494 / 1,222 · nhịp 153 dự án/tháng |
| Power +14,4% / WR 3pp / WR 5pp | 2,4 · 11,9 · 4,3 tháng |
| Số tầng phân bổ | 15 (166–1.117 mặt hàng) |

## 1c. Chương 4 — thực nghiệm

| Chỉ số | Giá trị chuẩn |
|---|---|
| Test set | 1.613 mặt hàng / 300 RFQ; P5=1,152 P75=1,317 P95=1,388 |
| Actual thực nhận | $35.806 (mô hình dự báo $35.442 → lệch −1,0%) |
| δ | 0,181 |
| Cost-Plus | $35.277 (−1,5%) |
| **CBPO Realistic** | **$40.901 (+14,2%)**, P(Win) 0,613, 0% kẹp |
| Nash A / B | $41.958 (+17,2%) **85,9% kẹp** / $21.033 (−41,3%) **100% kẹp** |
| Nash+Cap A / B | $42.112 (+17,6%) / $21.041 (−41,2%) |
| **CBPO + Capacity** | **$42.979 (+20,0%)**, P(Win) 0,607 |
| **GIẢ DƯỢC** | **$42.997 (+20,1%)** → điều tiết theo Q = **−0,05 pp** |
| Kiểm định markup ∝ 1/N | **−0,0464** (SE 0,0312), KTC [−0,1074; 0,0147]; H₀=−1 p≈0 BÁC BỎ; H₀=0 p=0,137 KHÔNG bác bỏ |
| Trung vị markup sau kẹp (đặc tả A) | 38,8% = đúng phân vị 95 → bằng chứng ràng buộc quyết định đầu ra |
| Sensitivity N | +22,3% → −9,5%; **đổi dấu quanh N(Low) ≈ 3,8** |
| Sensitivity họ F | Uniform +17,2% · Tam giác +5,8% · Lõm +18,8% |
| Sensitivity π_SLA | +17,2% → +18,0% · Nội sinh vs cộng thẳng −0,01% |
| Điểm cắt (chưa kẹp) | Q1 +115,4% · Q2 +66,5% · Q3 +45,3% · Q4 +23,6% · Q5 −3,0% |

## 1d. Chương 5 — thảo luận

| Chỉ số | Giá trị chuẩn |
|---|---|
| **Offered = Avg_PFEP × Markup_Pct** | **khớp 100,00%** (max lệch 0,005 USD) |
| Corr nếu markup hằng số | +1,0000 (so với +0,8652 thực tế) |
| E[Profit] trung vị mỗi RFQ | $110,7 · λ trung vị $9,62–10,40 = **9,4%** |
| RFQ dưới ngưỡng điều phối | **5/300 = 1,7%** (0,1% lợi nhuận, 0,3% khối lượng) |
| **π_SLA hòa vốn** | **5,3 × biên ≈ $186/lần vi phạm** |

## 2. Quyết định đã chốt
1–9. Nguồn số liệu chuẩn duy nhất · threshold dải · Nash claim thận trọng · SHAP thật · đánh số theo chương · màu Würth · N là tham số hiệu chỉnh · nội sinh hóa · A/B biên 5pp.
10. **Con số bền vững nhất: CBPO +14,2%.**
11. **Không tuyên bố capacity-aware vượt trội.**
12. Công bố hạn chế cấu trúc giá ở 3.1.5, 4.3, 5.5.1.
13. Định vị đóng góp: **hai khung ứng dụng** (kiểm tra khả thi BNE 3 bước + CBPO Realistic an toàn), không phải chính sách vượt trội.
14. **Khung biện luận chuẩn: hai giả thuyết H1/H2 → bác bỏ → ba trụ cột nguyên nhân.**

## 3. Lỗi proposal V1.6 cần sửa (checklist — dùng khi cập nhật proposal)
- [ ] Bảng 2: "533/1.500" → 565/1.500
- [ ] Phụ lục B Bảng B1 hàng TAT → dùng Bảng B.1 tính lại
- [ ] Caption Hình 5: "ΔR² ≈ +0,04" → +0,40
- [ ] Threshold 0,21 → dải 0,10–0,20
- [ ] §4.2.1: "hạ ngưỡng cải thiện Recall_Loss" là NGƯỢC CHIỀU
- [ ] §4.2: thống nhất số Bảng 10 vs văn bản
- [ ] Định vị doanh nghiệp: "phân phối vật tư liên kết (fastener) & MRO công nghiệp B2B"

## 8–11. Phát hiện Chương 1–4
Hàm chi phí ngưỡng gần phẳng; hạ ngưỡng → Recall_Loss GIẢM (0,030/0,081/0,536). Kiểm định bác bỏ hệ quả của H1, không bác bỏ cost-plus. Giả dược bác bỏ H2: −0,05pp. Cân bằng thuần giá chạm biên (85,9%/100%).

## 12. Ba trụ cột biện luận nguyên nhân (Chương 5 — khung đã chốt)
- **Trụ cột I — Cạnh tranh phi giá (§5.2, bác bỏ H1).** Win 64,2% >> 1/N; NO_PRICE AUC 0,6926; tổng |SHAP| phi giá vượt biến giá. Khung đúng về lý thuyết là scoring auction (Che 1993), ngoài phạm vi vì hàm điểm không quan sát được.
- **Trụ cột II — Thời điểm phát sinh chi phí xử lý (§5.3, bác bỏ H2).** Công việc định giá phát sinh khi hồ sơ VÀO hàng đợi, TRƯỚC quyết định giá → chào giá cao không giảm tải. Đòn bẩy đúng là tiếp nhận/điều phối (bid-price control, Talluri & van Ryzin 2004). Nhưng triage cũng không đáng kể (5/300 = 1,7%) vì λ nhỏ hơn một bậc độ lớn so với lợi nhuận RFQ.
- **Trụ cột III — Phân phối chi phí B2B (§5.4, củng cố trụ cột I).** Không tồn tại một c_high duy nhất khi giá vốn trải 15,8–599,5 USD. Hai đặc tả thất bại ĐỐI XỨNG: A kẹp trần 85,9% (trung vị sau kẹp = đúng P95 = 38,8% → đầu ra do ràng buộc quyết định, nên +17,2% là artifact của kẹp biên); B kẹp sàn 100%. Nếu cạnh tranh thực sự thuần giá thì phải tồn tại ít nhất một đặc tả cho nghiệm nội suy — việc cả hai đều trượt ra ngoài theo hai hướng ngược nhau là bằng chứng chống lại cơ chế cân bằng thuần giá.

## 13. Hạn chế nghiêm trọng nhất — cấu trúc ghi nhận giá
Offered_Price = Avg_PFEP × Markup_Pct khớp 100%. Tương quan +0,865 là ĐỊNH NGHĨA. Phần KHÔNG bị ảnh hưởng: kiểm định 4.3 (dùng Markup_Pct). Dữ liệu cũng đã qua tiêm nhiễu → kết luận ĐỊNH TÍNH bền vững hơn con số.

## 14. Khung ứng dụng chốt cho Chương 6
**Khung 1 — Kiểm tra tính khả thi của BNE, ba bước (Bảng 6.1).** (1) Đối chiếu tỷ lệ thắng với 1/N → 64,2% vs tối đa 50% = KHÔNG ĐẠT. (2) Ablation loại biến giá → AUC 0,6926 = KHÔNG ĐẠT. (3) Tỷ lệ khuyến nghị kẹp biên → 85,9%/100% = KHÔNG ĐẠT. Quy tắc: một bước không đạt là đủ để dừng.
**Khung 2 — CBPO Realistic +14,2% "an toàn" (Bảng 6.2).** Bốn thuộc tính: không phụ thuộc tham số không nhận dạng được (N, miền chi phí, π_SLA); hiệu chuẩn tại giá lịch sử lệch −1,0%; khuyến nghị nằm trong dải hành vi quan sát; không ngoại suy ngoài vùng dữ liệu.
**Ba nguyên tắc quản trị (§6.3).** (1) KHÔNG dùng giá chào để điều tiết hàng đợi kỹ thuật. (2) Kiểm soát SLA bằng bộ lọc tiếp nhận (admission control / triage) đặt tại **pha Sales-WBS**, trước khi hồ sơ vào hàng đợi Pricing; chỉ kích hoạt ngưỡng loại bỏ sau khi doanh nghiệp xác định chi phí thực một lần vi phạm SLA (hòa vốn ≈ $186). (3) Dùng CBPO có hiệu chuẩn xác suất để tối ưu biên lợi nhuận trên các hồ sơ đã nhận. Hai đòn bẩy — hai chỉ tiêu riêng (SLA vs biên lợi nhuận).

## 15. TRẠNG THÁI HOÀN TẤT (bản biên tập học thuật, cập nhật lần 7)
**ChuThaiNguyen_LuanVan_ThacSi.docx — 63 trang, HOÀN CHỈNH:**
- Trang bìa · Lời cam đoan · Tóm tắt (đã viết lại theo khung H1/H2) · Mục lục (TOC field) · Danh mục viết tắt (4 nhóm) · Danh sách hình (23) · Danh sách bảng (19)
- Chương 1–6 · Tài liệu tham khảo 3 nhóm (28 mục) · Phụ lục A (Bảng A.1 + Hình A.1–A.6) · Phụ lục B (Bảng B.1 + Hình B.2)
- 23 hình + 19 bảng, tất cả có caption, đánh số đúng thứ tự xuất hiện; mọi bảng ≤ 9.000 twips khớp lề
- Cấu trúc Chương 5: 5.1 khung ba trụ cột (Bảng 5.1) · 5.2 Trụ cột I · 5.3 Trụ cột II (Bảng 5.2) · 5.4 Trụ cột III (Bảng 5.3) · 5.5 Hạn chế · 5.6 Đóng góp
- Cấu trúc Chương 6: 6.1 Kết luận · 6.2 Hai khung ứng dụng (Bảng 6.1, 6.2) · 6.3 Khuyến nghị vận hành (3 nguyên tắc + Bảng 6.3) · 6.4 Hướng nghiên cứu · 6.5 Lời kết
- **Rà soát biên tập:** 0 từ khóa công cụ/phát triển phần mềm còn sót; 0 tên file, đường dẫn hay tên nhóm; 0 placeholder; 0 tham chiếu chéo treo (mọi "mục x.y" đều trỏ tới tiêu đề tồn tại); toàn bộ đoạn tự sự đã chuyển sang ngôi thứ ba khách quan

**ChuThaiNguyen_LuanVan_Pipeline.ipynb — 45 cell, hợp lệ, chạy sạch 0 lỗi:**
- Chặn double noise-injection · verify derivation bằng công cụ tính toán ký hiệu · SHAP thật · giả dược · kiểm chứng cấu trúc giá + triage + π hòa vốn
- Cell đối chiếu số liệu chuẩn: 51 chỉ số (40 PASS / 11 WARN / 0 FAIL); 11 WARN đều là chỉ số từ mô hình học máy, do khác phiên bản thư viện

**LƯU Ý CÒN LẠI:** Số liệu Chương 4–5 chốt từ môi trường phân tích của tác giả (sklearn 1.8/numpy 2.4/xgboost 3.2) → môi trường khác có thể lệch ±1pp ở chỉ số từ mô hình. Cần rà trích dẫn Nhóm B–C (volume/trang) trước bản nộp; Perakis & Sood (2006) cần xác nhận khoảng trang.
