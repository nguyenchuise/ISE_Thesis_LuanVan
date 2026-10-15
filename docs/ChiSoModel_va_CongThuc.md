# CHỈ SỐ SO SÁNH MÔ HÌNH VÀ CÔNG THỨC BA BÀI TOÁN

> Ghi chú 15-10-2026: tài liệu này viết ngày 16-09, trước khi TAT_pred (OOF) được ghép vào BT2. Công thức và lập luận vẫn đúng. Một vài con số đã được thay trong `SoT_v2_SoLieuChuan.md` — khi lệch, dùng SoT_v2. Ví dụ: AUC ngoài mẫu 0,7770 (không phải 0,7767), Brier 0,1820, Markup_Pct p = 0,749 (không phải 0,584).

Bổ sung cho `BanGiao_HuongMoi_SauReview.md`. Phản hồi hai yêu cầu của GVHD ngày 16-09-2026.

---

## 1. Yêu cầu của GVHD

1. Với mô hình hồi quy và logistic có nhiều biến độc lập, **không dùng R² để diễn giải và so sánh mô hình** vì bị thiên lệch khi số biến tăng.
2. **Viết ra công thức tường minh** của các mô hình ở BT1, BT2, BT3.

## 2. Làm rõ một điểm kỹ thuật

Hệ số tương quan bội **R = √R² là biến đổi đơn điệu của R²**, nên R bị thổi phồng đúng theo cùng một cách và **không khắc phục được thiên lệch**. Nhiều khả năng GVHD muốn nói **R² hiệu chỉnh (adjusted R²)**. Công cụ đúng là chỉ số có phạt bậc tự do (R² hiệu chỉnh, AIC, BIC) và kiểm chứng ngoài mẫu.

## 3. Bằng chứng trên dữ liệu — hồi quy (n = 1.500)

Giữ nguyên 5 biến thực chất dự báo TAT, lần lượt thêm 5/10/20/40 biến nhiễu ngẫu nhiên độc lập hoàn toàn với biến phụ thuộc:

| Mô hình | k | R | R² | R² hiệu chỉnh | AIC | BIC | R² kiểm chứng chéo |
|---|---|---|---|---|---|---|---|
| M0 — 5 biến thực chất | 5 | 0,8599 | 0,7395 | 0,7386 | 5226,29 | 5258,16 | 0,7437 |
| M1 — thêm 5 biến nhiễu | 10 | 0,8610 | 0,7412 | 0,7395 | 5226,26 | 5284,70 | 0,7440 |
| M2 — thêm 10 biến nhiễu | 15 | 0,8603 | 0,7401 | 0,7375 | 5242,61 | 5327,62 | 0,7376 |
| M3 — thêm 20 biến nhiễu | 25 | 0,8613 | 0,7418 | 0,7375 | 5252,76 | 5390,90 | 0,7372 |
| M4 — thêm 40 biến nhiễu | 45 | 0,8640 | **0,7464** | 0,7386 | 5265,89 | **5510,30** | **0,7337** |

R² tăng 0,7395 → 0,7464 và R tăng 0,8599 → 0,8640 nhờ 40 biến vô nghĩa. R² hiệu chỉnh đứng yên quanh 0,738, BIC tăng mạnh 5.258 → 5.510, R² kiểm chứng chéo giảm đều 0,7437 → 0,7337.

## 4. Bằng chứng trên dữ liệu — logistic (n = 7.519 mặt hàng)

| Mô hình | k | McFadden R² | McFadden hiệu chỉnh | Nagelkerke R² | AIC | BIC | AUC |
|---|---|---|---|---|---|---|---|
| L0 — 12 biến thực chất | 12 | 0,1663 | 0,1638 | 0,2673 | 8184,35 | 8274,38 | 0,7684 |
| L1 — thêm 10 biến nhiễu | 22 | 0,1673 | 0,1628 | 0,2689 | 8193,82 | 8353,10 | 0,7693 |
| L2 — thêm 30 biến nhiễu | 42 | **0,1698** | 0,1612 | **0,2724** | 8209,47 | **8507,26** | 0,7709 |

McFadden thô và Nagelkerke đều tăng theo biến nhiễu; chỉ McFadden hiệu chỉnh và BIC phản ứng đúng.

Ngoài mẫu, tách theo nhóm dự án chống rò rỉ (6.153 huấn luyện / 1.366 kiểm tra): **AUC = 0,7767 ; Brier = 0,1816**.

## 5. Quy tắc báo cáo đã chốt cho toàn luận văn

- **Hồi quy (BT1)**: R² hiệu chỉnh, AIC, BIC, RMSE/MAE, R² kiểm chứng chéo, VIF
- **Logistic (BT2)**: McFadden hiệu chỉnh, Nagelkerke, AIC, BIC, **AUC và Brier ngoài mẫu**
- Chia dữ liệu **theo nhóm dự án**, không chia ngẫu nhiên theo mặt hàng
- Hồi quy phải kèm chẩn đoán phần dư (Breusch–Pagan, White, Jarque–Bera) trước khi diễn giải hệ số

## 6. Công thức ba bài toán

### BT1 — Dự báo thời gian xử lý

```
Chuẩn hóa (standardize):
    z_kj = ( x_kj - mean(x_k) ) / sd(x_k)

Mô hình từng khâu (bốn mô hình độc lập):
    T_sj = β_0s + Σ_{k=1..K} β_ks · z_kj + ε_sj ,  s ∈ {Sales, WBS, SC, Pricing}

Thời gian tổng — hai đường tính đối chiếu chéo:
    (a) cộng dồn:   TAT_j = Σ_s T̂_sj
    (b) trực tiếp:  TAT_j = β_0 + Σ_k β_k · z_kj + ε_j

Phân rã phương sai:
    Var(TAT) = Σ_s Var(T_s) + 2 · Σ_{s<t} Cov(T_s, T_t)

Sai số chuẩn vững HC3:
    Var_HC3(β̂) = (X'X)^-1 [ Σ_i e_i^2/(1-h_ii)^2 · x_i x_i' ] (X'X)^-1
```

Đặc tả chọn: **OLS thang đo gốc + HC3**, không log-transform (xem mục 4.1.2 luận văn).

### BT2 — Dự báo thắng/thua

```
Hàm thắng/thua:   Y_i = 1 nếu mặt hàng i thắng ;  Y_i = 0 nếu thua

Chỉ số tuyến tính và hàm liên kết logit:
    η_i = β_0 + Σ_{k=1..K} β_k · x_ki
    P(Y_i = 1 | x_i) = 1 / ( 1 + exp(-η_i) )
    ln[ p_i / (1 - p_i) ] = η_i

Diễn giải:   OR_k = exp(β_k)

Ước lượng hợp lý cực đại:
    β̂ = argmax_β  Σ_i [ y_i·ln(p_i) + (1 - y_i)·ln(1 - p_i) ]
```

Đây là **bài toán phân loại có giám sát**, không phải dự báo chuỗi thời gian — mỗi mặt hàng là một quan sát độc lập có ngữ cảnh riêng.

Sáu nhóm biến và cơ chế:

| Nhóm | Biến | Cơ chế |
|---|---|---|
| Giá | Price_Competitiveness | Chào rẻ hơn kỳ vọng → thắng cao hơn |
| Năng lực NCC | Supplier_SQE_Score, ATP_Stock_Available, Has_PPAP_Cert, Local_Supplier | Giảm rủi ro phía khách |
| Quan hệ KH | Is_Strategic, Is_Existing_Customer, Customer_Class | Chi phí chuyển đổi, lịch sử hợp tác |
| Cạnh tranh | Competitor_Intensity | Nhiều đối thủ → xác suất thắng giảm |
| Rủi ro thương mại | Payment_Term_Risk | Điều khoản dài → kém hấp dẫn |
| Năng lực xử lý | Pricing_Queue_Depth, Assigned_Engineer_Experience, **TAT dự báo từ BT1** | Phản hồi chậm → bất lợi |

**Điểm nối BT1 → BT2**: dùng TAT **dự báo** từ BT1, không dùng TAT thực tế — vì tại thời điểm quyết định giá, TAT thực tế chưa quan sát được. Dùng TAT thực tế sẽ gây rò rỉ dữ liệu.

### BT3 — Tối ưu giá báo thầu (CBPO)

```
Ký hiệu:  c = giá vốn (Avg_PFEP) ; p = giá chào ; T = Target_Price
          r = T / p  (biến Price_Competitiveness)

Xác suất thắng theo giá — thừa hưởng từ BT2:
    η(p) = α + γ·(T/p) + x'δ ,        γ = +9,9665
    P(Win | p, x) = 1 / ( 1 + exp(-η(p)) )

Đạo hàm — âm, đúng chiều kinh tế:
    ∂P/∂p = P·(1-P)·( -γ·T / p^2 )  <  0

Hàm mục tiêu:
    E[π(p)] = (p - c) · P(Win | p, x)
    p* = argmax_p  (p - c) · P(Win | p, x)

Điều kiện bậc nhất:
    ∂E[π]/∂p = P + (p-c)·P·(1-P)·(-γ·T/p^2) = 0
  ⟺  γ · T · (p - c) · (1 - P(p)) = p^2

Nghiệm p* nằm ẩn → giải bằng phương pháp số.
```

**Trả lời câu hỏi tuyến tính hay phi tuyến của GVHD: PHI TUYẾN.** Đạo hàm bậc hai của E[π(p)] đổi dấu trên miền giá (+0,0038 xuống −0,0436) — hàm lồi ở vùng giá thấp, lõm quanh cực đại. Không có nghiệm dạng đóng.

Kiểm chứng trên 6 mặt hàng: nghiệm từ FOC khớp dò lưới, **sai lệch tối đa 0,0033 USD**.

## 7. Phát hiện quan trọng về biến giá

- `Markup_Pct` **không dùng được** làm tín hiệu giá: hệ số logit +0,190, p = 0,584 — không có ý nghĩa thống kê. (Mô hình v2 có TAT_pred: β_z 0,009, p 0,749 — xem SoT_v2.)
- `Price_Competitiveness` = **Target_Price / Offered_Price** (xác minh trên dữ liệu: lệch tối đa 0,0005). Hệ số +9,967, p = 1,57 × 10⁻¹⁵⁷. Vì là nghịch đảo giá nên hệ số dương mang nghĩa giá chào thấp → xác suất thắng cao, đúng chiều kinh tế.

## 8. Tài liệu và mã nguồn

- `ChuThaiNguyen_ChiSoModel_CongThuc_v1.docx` — bản trình bày cho GVHD, 3 trang
- `metric_compare.py` — chứng minh thiên lệch R²/R, pseudo R² logistic, AUC/Brier ngoài mẫu
- `bt3_form2.py` — dẫn xuất và kiểm chứng điều kiện bậc nhất BT3
- `bt1_pertask.py`, `bt1_models.py` — phân tích BT1 theo khâu
