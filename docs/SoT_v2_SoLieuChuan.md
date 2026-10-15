# NGUỒN SỐ LIỆU CHUẨN v2.0 — LUẬN VĂN LÀM LẠI THEO ĐỊNH HƯỚNG GVHD
*Chốt 17-09-2026. Thay thế `LEGACY_SoT_SoLieuChuan_v1_XGB.md` cho Chương 4–6. Mọi số đọc trực tiếp từ JSON: bt1_pertask.json, bt1_models.json, ch4_bt12.json, ch4_bt3.json, bt3_form.json.*

> Ghi chú 15-10-2026: §6 "Trạng thái file" bên dưới chụp ở thời điểm Chương 1–4. Bản hiện hành là v2.0 đầy đủ 65 trang (xem `BanGiao_HuongMoi_SauReview.md` và `00_START_HERE.md`). Mọi con số trong file này vẫn khớp với JSON do `run_all.sh` sinh lại.

## VÌ SAO CÓ v2 — khác biệt so với bản cũ
Bản cũ ước lượng P(Win) bằng XGBoost. Chương 3 mới đặc tả **logistic** (diễn giải được, hiệu chuẩn được). Toàn bộ BT3 được tái ước lượng trên logistic để nhất quán với Chương 3. **Kết luận định tính giữ nguyên 100%; con số thay đổi.**

| Chỉ số | Bản cũ (XGB) | v2.0 (logistic) | Kết luận |
|---|---|---|---|
| Tập test | 1.613 / 300 RFQ | **1.366 / 295 RFQ** (sau dropna 7.519) | — |
| CBPO Realistic | +14,2% | **+14,03%** | Giữ |
| Cost-Plus | −1,5% | **+0,89%** | Giữ (±1%) |
| Nash A | +17,2%, kẹp 85,9% | **+4,19%, kẹp 86,5%** | Giữ: artifact của kẹp |
| Nash B | −41,3%, kẹp 100% | **−29,29%, kẹp 100%** | Giữ |
| CBPO+Cap / Giả dược | +20,0 / +20,1 → −0,05pp | **+15,12 / +15,17 → −0,055pp** | Giữ |
| H1 độ dốc | −0,0464 (SE 0,031) | **−0,0075 (SE cụm 0,0063)** | Giữ: bác bỏ −1, không bác bỏ 0 |
| ICC / DEFF | 0,0494 / 1,222 | **0,1997 / 1,818** | Bảo thủ hơn |
| Hiệu chuẩn tổng hợp | −1,0% | **+2,70%** | Lạc quan nhẹ |

## 1. BT1 — thời gian xử lý theo khâu (n = 1.500)
| Khâu | Mean | Median | SD | CV | Skew | R² riêng | MAE | BP p |
|---|---|---|---|---|---|---|---|---|
| Sales | 0,959 | 0,8 | 0,729 | **0,760** | 1,086 | **0,250** | 0,509 | ≈0 |
| WBS | 1,790 | 1,7 | 0,856 | 0,478 | 1,299 | 0,572 | 0,449 | ≈0 |
| SC | 1,283 | 1,2 | 0,639 | 0,498 | 1,593 | 0,528 | 0,344 | ≈0 |
| Pricing | 2,391 | 2,1 | 1,245 | 0,521 | 1,038 | 0,431 | 0,726 | ≈0 |

- Đồng nhất phương sai: Levene p = 2,1e−109; Bartlett p = 3,1e−174; Kruskal p ≈ 0 → **BÁC BỎ**
- CV từng cặp (bootstrap 2.000): Sales khác cả 3; WBS–SC, SC–Pricing không khác; WBS–Pricing khác nhẹ
- Phân rã Var(TAT): Pricing 25,3% · WBS 12,0% · Sales 8,7% · SC 6,7% · **hiệp phương sai 47,4%**
- Tương quan: WBS–SC 0,653; Sales–WBS 0,444; Sales–SC 0,453; **Sales–Pricing −0,037**
- Đặc tả TAT tổng: **thang gốc MAE 0,8399, BP p = 0,609 (đều), skew 3,91** · log: MAE 0,9107, BP p < 0,0001 (thay đổi), skew 0,199 · **CHỌN: thang gốc + HC3**
- Tổng trực tiếp vs cộng dồn (5-fold): 0,8437 vs 0,8372 → cải thiện 0,77% (không đáng kể)
- OOF 5-fold cho BT2: MAE 0,8437; R² 0,7368
- VIF 5 biến: đều ≈ 1,00. Biến mạnh nhất cả 4 khâu: Drawing_Clarification_Flags (Pricing 0,619)

## 2. BT2 — logistic (7.519 dòng / 1.475 RFQ; train 6.153 / test 1.366 @ 295 RFQ)
- Win rate 64,46%. Biến chuẩn hóa Z. 13 biến, 6 nhóm, gồm TAT_pred (OOF)
- **AUC test 0,7770 [0,7528; 0,8020]; Brier 0,1820**; AUC train 0,7696
- McFadden 0,1669; McF hiệu chỉnh 0,1637; Nagelkerke 0,2680; AIC 6.682,4; BIC 6.776,5
- Hiệu chuẩn tổng hợp: dự báo 898,1 vs thực 864 thắng → **+3,95%**
- XGBoost chuẩn so sánh: AUC 0,7818 (chỉ +0,005) → logistic đủ
- OR theo 1 SD: Price_Competitiveness **2,447** (p<1e−4) · SQE 1,572 · PPAP 1,365 · ATP 1,344 · Existing 1,279 · CustClass 1,188 · Local 1,114
- Không ý nghĩa: CompInt −0,039 (p 0,23) · Queue −0,061 (p 0,060) · Engineer +0,031 (p 0,31) · PayRisk (p 0,85) · **TAT_pred +0,056 (p 0,089, dấu ngược kỳ vọng)**
- Ablation ΔAUC: Giá **−0,0695** (còn 0,7074) · NCC −0,0550 · QHKH −0,0115 · Cạnh tranh −0,0005 · Rủi ro 0 · **Năng lực xử lý +0,0001**
- Biến giá: Markup_Pct β 0,009 p 0,749 AUC 0,7077 · **Price_Competitiveness = Target/Offered** (lệch max 0,0005) β 0,895 p<1e−130 AUC 0,7770

## 3. BT3 — trên tập test 1.366 dòng
- Dải markup train: P5 1,1529 · median 1,2674 · P95 1,3863
- Thực nhận **30.047,3 USD**; kỳ vọng tại giá lịch sử 30.858,1 (+2,70%)
- **FOC**: γ_r = +9,9665; nghiệm FOC vs dò lưới lệch max 0,0033 USD; đạo hàm 2 đổi dấu (+0,0038 → −0,0436) → **phi tuyến**

| Chính sách | Profit | Uplift | P(Win) | Ngoài dải |
|---|---|---|---|---|
| Cost-Plus | 30.315,4 | +0,89% | 0,655 | — |
| **CBPO Realistic** | **34.264,4** | **+14,03%** | 0,593 | 33,0% |
| CBPO Optimistic | 35.575,7 | +18,40% | 0,558 | — |
| Nash A (kẹp) | 31.306,4 | +4,19% | 0,530 | **86,5%** (mk trước kẹp median 1,690) |
| Nash B (kẹp) | 21.246,9 | −29,29% | 0,801 | **100%** (mk median 1,081) |
| CBPO + Cap λ(Q) | 34.589,1 | +15,12% | 0,583 | — |
| **Giả dược λ̄** | 34.605,7 | +15,17% | 0,583 | — |
| → điều tiết theo Q | | **−0,055 pp** | | |

- N 4 phương pháp (Low/Med/High): MoM 6,91/6,89/6,87 · 1/WR 1,36/1,52/1,82 · Chuyên gia 2/4/6 · **Lai 2,00/2,24/2,68** (chọn)
- Win rate train: 0,7349 / 0,6560 / 0,5490 · Markup median: 1,2658 / 1,2687 / 1,2660
- δ (đặc tả B) = 0,1812
- Logit breach: −1,3870 + 0,0863·Q (p 6,6e−22); breach 37,7%
- π_SLA = 0,5 × 35,01 = 17,51 USD; items/RFQ 5,10; **λ_item: Q0 0,73 · Q10 2,05 · Q20 3,50 · Q30 4,23**; mean test 2,05 (5,9% biên)
- **H1**: b̂ = −0,0075, SE cụm 0,0063, KTC [−0,0200; 0,0049]; t vs −1 = 156,6 (p<1e−4, BÁC BỎ); t vs 0 = −1,19 (p 0,234, KHÔNG bác bỏ); BNE dự đoán giảm 25,3%
- Độ nhạy N (Nash A): N_low 1,0→+7,4% · 1,5→+5,9 · 2,0→+4,2 · 3,0→+0,1 · 4,0→−4,2 · 5,0→−7,9; **đổi dấu quanh N ≈ 3**
- Họ F: Đều +4,19% · **Tam giác −0,26%** (kẹp 73%)
- π_SLA ×0,25/0,5/1/2/5,3: Cap +14,6/15,1/15,8/16,4/12,1 · Giả dược +14,6/15,2/16,0/16,8/13,7 → **luôn bám nhau**

## 4. Thiết kế A/B (ước lượng từ dữ liệu)
- ICC lợi nhuận/RFQ **0,1997**; m̄ 5,10; **DEFF 1,818**; σ_item 23,64; mean 22,66; 152,5 RFQ/tháng
- Uplift 14%: 1.583 dòng / **311 RFQ mỗi nhánh / 4,1 tháng**
- Uplift 10%: 3.103 / 609 / 8,0 tháng · Uplift 5%: 12.410 / 2.435 / 31,9 tháng
- Guard WR 5pp: 2.612 / 513 / **6,7 tháng** · Guard WR 3pp: 7.257 / 1.424 / **18,7 tháng**

## 5. Chuỗi nhân quả ba bài toán → Chương 5
BT1: Pricing độc lập Sales (r = −0,037) → BT2: khách không phạt chậm (ΔAUC +0,0001; TAT_pred p 0,089 dấu +) → BT3: điều tiết giá theo Q = −0,055pp. **Giá không phải đòn bẩy cho năng lực xử lý.**

## 6. Trạng thái file
`ChuThaiNguyen_LuanVan_v2.0.docx` — 38 trang, Chương 1–4. Hình 4.1–4.7, Bảng 4.1–4.16. Mọi số trong Ch.4 đọc từ JSON lúc build, không gõ tay.
