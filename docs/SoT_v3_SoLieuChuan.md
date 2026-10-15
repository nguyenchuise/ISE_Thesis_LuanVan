# SoT v3 — Số liệu chuẩn của luận văn v3.0 (sinh tự động bởi `src/make_sot.py`)

*Không sửa tay. Chạy `bash src/run_all.sh` để tái lập. Mọi số trong docx đọc từ JSON cùng nguồn.*

## 0. Dữ liệu v3

- HeadView 1500×31, ItemView 8249×23; BT2 dùng 7519 dòng / 1475 hồ sơ; chia 80/20 theo dự án: 6153 / 1366 dòng (295 hồ sơ)
- Nhãn đổi so với bản nháp: 190 dòng (2,30%; 127 thắng→thua, 63 thua→thắng); Q trung bình dòng đổi 16,2 vs 9,7; mọi 1→0 có Q ≥ 6, mọi 0→1 có Q ≤ 8
- Effective_Competitors_N: Low→2, Med→3, High→4/5 (ánh xạ từ Competitor_Intensity). Urgency_SLA_Sensitivity khớp 100% quy tắc (1 + 0,5·Is_Strategic) × (1 + 0,25·1[Required_Approval_Levels ≥ 3]). Market_Reserve_Bound = 1,988× giá vốn (CV 5,8%)

## 1. Chương 1

- Vi phạm SLA 565/1500 = 37,67%; win rate Low/Med/High = 74,94 / 62,84 / 52,84% (chênh 22,10 pp); markup chênh 0,35 pp

## 2. BT1

- CV Sales 0,760; hiệp phương sai 47,4%; r(Sales,Pricing) = -0,037
- BP p thang gốc 0,609; log MAE xấu đi 8,4%
- MAE trực tiếp 0,8437 vs cộng dồn 0,8372 — chênh 0,77%; TAT_pred OOF MAE 0,8437, R² 0,7368

## 3. BT2 (nhãn v3)

- AUC test 0,7808 [0,7579; 0,8051], Brier 0,1814; XGB 0,7837; hiệu chuẩn +3,16%
  - Price_Competitiveness: β = 0,8384 (p = 0.00e+00) | nhãn v1: 0,8948 (p = 0.000)
  - Supplier_SQE_Score: β = 0,4104 (p = 0.00e+00) | nhãn v1: 0,4521 (p = 0.000)
  - ATP_Stock_Available: β = 0,2849 (p = 0.00e+00) | nhãn v1: 0,2957 (p = 0.000)
  - Has_PPAP_Cert: β = 0,2849 (p = 0.00e+00) | nhãn v1: 0,3113 (p = 0.000)
  - Local_Supplier: β = 0,1157 (p = 1.00e-04) | nhãn v1: 0,1077 (p = 0.000)
  - Is_Existing_Customer: β = 0,2403 (p = 0.00e+00) | nhãn v1: 0,2464 (p = 0.000)
  - CustClass: β = 0,1431 (p = 0.00e+00) | nhãn v1: 0,1722 (p = 0.000)
  - CompInt: β = -0,1334 (p = 4.00e-05) | nhãn v1: -0,0390 (p = 0.233)
  - Pricing_Queue_Depth: β = -0,2220 (p = 0.00e+00) | nhãn v1: -0,0605 (p = 0.060)
  - TAT_pred: β = -0,0927 (p = 3.77e-03) | nhãn v1: 0,0556 (p = 0.089)

## 4. BT3

- CBPO Realistic (kẹp P5–P95): uplift 13,91%, kẹp 36,4%
- Nash A — miền tuyệt đối (kẹp): uplift 4,06%, kẹp 85,4%
- Nash B — miền tỷ lệ (kẹp): uplift -29,90%, kẹp 100,0%
- Nash C — cận dòng hàng, N thực tế (kẹp): uplift 10,45%, kẹp 32,4%
- Nash C — dạng đóng thuần (không kẹp): uplift 11,68%, kẹp 0,0%
- Nash C + phản hồi logistic (±5% quanh neo): uplift 12,85%, kẹp 32,4%
- CBPO + Capacity λ(Q): uplift 14,96%, kẹp 0,0%
- Giả dược — λ hằng số: uplift 15,14%, kẹp 0,0%
- CBPO + Capacity λ(Q)·U (trọng số SLA): uplift 15,09%, kẹp 0,0%
- Giả dược — λ hằng số (bản trọng số SLA): uplift 15,32%, kẹp 0,0%
- Giả dược tĩnh: λ(Q) -0,18 pp; λ(Q)·U -0,23 pp
- H1 lịch sử ln Markup: b = -0,0033 (SE 0,0024), p(b=0) = 0.169, p(b=−1) = 0
- H1 lịch sử ln(Markup−1): b = -0,0177 (SE 0,0124), p(b=0) = 0.151, p(b=−1) = 0
- H1 FOC: b = -0,3697 (SE 0,0204), p(b=0) = 0, p(b=−1) = 0
- H1 Nash C (đồng nhất thức): b = -1,1213 (SE 0,0061), p(b=0) = 0, p(b=−1) = 0
- H1 gốc (N lai): b = -0,0065, p(b=0) = 0,224

## 5. Mô phỏng Mục 4.4 (π_SLA = 1)

- C1 (m = 11, κ = 0,77, W̄ = 0,411): P4 uplift ròng 19,09%, vi phạm 36,00%; P4−P3 1,91 pp; P5−P2 2,40; P6−P3 -0,41; P7−P3 0,57
- C2 (m = 9, κ = 0,69, W̄ = 1,145): P4 uplift ròng 23,73%, vi phạm 32,21%; P4−P3 6,56 pp; P5−P2 7,10; P6−P3 -0,41; P7−P3 2,03
- Mặt phẳng chuyển pha: G2 dương ở 30/30 ô (C1); G1 âm ở 15/30 ô (C1)

## 6. A/B

- ICC lợi nhuận 0,1995, DEFF 1,818; 2 nhánh uplift 14%: 316 hồ sơ/nhánh, 4,1 tháng; 3 nhánh: 382, 7,5 tháng; guard 5 pp 3 nhánh 12,3 tháng
- Triage: λ/E trung vị 11,8%; 3,1% hồ sơ dưới giá bóng; π hòa vốn 149 USD (4,2× biên)
