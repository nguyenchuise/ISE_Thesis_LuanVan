# 00 — BẮT ĐẦU TẠI ĐÂY · Luận văn Thạc sĩ Chu Thái Nguyên (v3.0)

*Cập nhật 15-10-2026 (v3.0 — bộ dữ liệu v3 có trường CRM/Sourcing và nhãn đã đối soát). Đọc file này trước, sau đó đọc `docs/BanGiao_v3.0_DuLieuV3.md` và `docs/SoT_v3_SoLieuChuan.md`.*

---

## 1. Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Bản luận văn | `ChuThaiNguyen_LuanVan_v3.0.docx` / `.pdf` — ~84 trang, Chương 1–6 + TLTK (29 mục) + Phụ lục A/B/C; 12 hình, 49 bảng |
| Dữ liệu | `src/HeadView_Workload.csv` (1.500 × 31), `src/ItemView_Workload.csv` (8.249 × 23), `src/ItemView_Workload_v1_NhanTruocDoiSoat.csv` (nhãn bản nháp, dùng cho độ nhạy) |
| Mới ở v3.0 | Đặc tả Nash C (§4.3), H1 hai mặt (Bảng 4.14), λ(Q)·U, **§4.4 mô phỏng liên kỳ** (hàng đợi + phân luồng Sales-WBS, mặt phẳng chuyển pha), A/B 3 nhánh, kiểm toán dữ liệu + độ nhạy nhãn (§3.1.2, §4.2.5, Bảng B.4–B.5) |
| Nguồn số liệu | **Mọi con số ở Chương 1, 3–6, Tóm tắt, Phụ lục do JS đọc từ JSON lúc build — không gõ tay**; `docs/SoT_v3_SoLieuChuan.md` sinh tự động |
| Tái lập | `bash src/run_all.sh` (~17 phút do mô phỏng; thử nhanh `SIM_R=20 SIM_RG=5 bash src/run_all.sh`) |
| Cảnh báo liêm chính dữ liệu | Xem `docs/BanGiao_v3.0_DuLieuV3.md` §2: 190 nhãn đổi theo quy luật độ sâu hàng đợi; Urgency là trường dẫn xuất. Đã khai báo trong luận văn |

## 2. Bản đồ thư mục Drive

```
[ISE_Thesis] (thư mục gốc — 1BEsD12uWr1NbxBbbL3cqNJ2f-QlPZWmU)
├── 00_START_HERE.md                       ← file này
├── ChuThaiNguyen_LuanVan_v3.0.docx        ← (kéo thả thủ công — xem §8)
├── ChuThaiNguyen_LuanVan_v3.0.pdf         ← (kéo thả thủ công)
├── ChuThaiNguyen_LuanVan_v3.0_MaNguon.zip ← (kéo thả thủ công) toàn bộ src + JSON + PNG + CSV
├── ChuThaiNguyen_LuanVan_v1.0.docx        ← bản cũ = v2.0, giữ nguyên
├── ChuThaiNguyen_TomTatSuon_… Sep 12.docx ← file của tài khoản khác, KHÔNG động vào
├── Untitled0.ipynb                        ← notebook Colab của anh, không động vào
├── src/   (1kKeaM99SjVgsTTWJGbp_KWXwP4MUkLo3) — 25 file văn bản, đã đối chiếu kích thước byte
│   ├── HeadView_Workload.csv, ItemView_Workload.csv     ← dữ liệu đầu vào
│   ├── run_all.sh, requirements.txt, package.json       ← môi trường + chạy toàn bộ
│   ├── 10 script Python (xem §4)
│   └── build_all.js, thesis_lib.js, front.js, back.js, ch01.js … ch06.js
└── docs/  (1PjjImHwehHThnGv8egDdvjWbwylzRfLj)
    ├── SoT_v3_SoLieuChuan.md              ← NGUỒN SỐ LIỆU CHUẨN HIỆN HÀNH (sinh tự động)
    ├── BanGiao_v3.0_DuLieuV3.md           ← bàn giao v3.0 + kiểm toán dữ liệu
    ├── SoT_v2_SoLieuChuan.md              ← lỗi thời, chỉ tra lịch sử
    ├── BanGiao_HuongMoi_SauReview.md      ← bàn giao v2.0 (17-09)
    ├── ChiSoModel_va_CongThuc.md          ← R² vs R² hiệu chỉnh + công thức BT1/2/3
    └── LEGACY_SoT_SoLieuChuan_v1_XGB.md   ← chỉ để tra lịch sử, KHÔNG dùng số
```

JSON, PNG, `bt2_scored.pkl`, `node_modules/` **không** nằm trong `src/` vì đều sinh lại được bằng `run_all.sh`. Bản đầy đủ có trong zip.

---

## 3. Cách chạy lại dự án

### Cách A — Claude Cloud session (Cowork) — khuyến nghị
1. Mở phiên mới, đính kèm `ChuThaiNguyen_LuanVan_v2.0_MaNguon.zip` vào khung chat (hoặc yêu cầu Claude tải từng file trong `src/` qua Google Drive connector).
2. Dán prompt khởi động ở §5.
3. Claude sẽ: `unzip` → `bash src/run_all.sh` → kiểm tra 9 JSON khớp `docs/SoT_v2_SoLieuChuan.md` → tiếp tục chỉnh.

### Cách B — Google Colab
```python
from google.colab import drive; drive.mount('/content/drive')
%cd "/content/drive/MyDrive/<đường dẫn tới thư mục>/src"
!node -v && python -V          # cần Node ≥ 18, Python ≥ 3.10
!bash run_all.sh
```
Lưu ý: `run_all.sh` ghi JSON/PNG/docx ngay trong `src/`. Nếu không muốn sinh file trong Drive, chép `src/` sang `/content/work` rồi chạy ở đó. Colab có thể khác phiên bản Python (3.12) — số từ mô hình học máy có thể lệch ở chữ số thập phân cuối; kết luận định tính không đổi.

### Cách C — Máy cá nhân
Tải toàn bộ `src/` về một thư mục → `bash src/run_all.sh` (Python 3.11 + Node 18+). Môi trường gốc: Python 3.11.15, Node 22, `docx@9.7.1` (đã ghim).

---

## 4. Luồng script → JSON → chương (v3.0)

| # | Script | Đầu ra | Dùng ở |
|---|---|---|---|
| 1 | `ch1_stats.py` | ch1_stats.json | Ch.1 (Bảng 1.1, 1.2 đọc JSON) |
| 2 | `data_audit.py` | data_audit.json | §3.1.2, Bảng 3.1, B.3 |
| 3 | `bt1_pertask.py` | bt1_pertask.json | §4.1 |
| 4 | `bt1_models.py` | bt1_models.json | §4.1.2–4.1.4 |
| 5 | `metric_compare.py` | metric_compare.json | Phụ lục A.2, B.1 |
| 6 | `bt3_form2.py` | bt3_form.json | §4.3.1 |
| 7 | `ch4_bt12.py` | ch4_bt12.json, bt2_model.json (có ma trận hiệp phương sai), bt2_scored.pkl, FIG_4_1…4_4 | §4.2, Bảng B.4–B.5 |
| 8 | `ch4_bt3.py` | ch4_bt3.json, FIG_4_5…4_7 | §4.3, §4.6 |
| 9 | `ch4_sim.py` | ch4_sim.json | §4.4 (≈15 phút) |
| 10 | `ch4_sim_figs.py` | FIG_4_8, FIG_4_9, ch4_sim_extra.json | §4.4 |
| 11 | `ch5_triage.py` | ch5_triage.json | §5.3.4, §6.3 |
| 12 | `ch4_icc_appx.py` | ch4_icc_appx.json | Phụ lục A.1, B.2 |
| 13 | `figs_ch1_ch3.py` | FIG_1_1, FIG_1_2, FIG_3_1 | Ch.1, Ch.3 |
| — | `node build_all.js` | ChuThaiNguyen_LuanVan_v3.0.docx | ch01–06 (+ch04_44.js) → back → front |
| — | `make_sot.py` | docs/SoT_v3_SoLieuChuan.md | tài liệu số liệu chuẩn |

**Thứ tự bắt buộc:** 7 trước 8 trước 9 (BT3 và mô phỏng đọc `bt2_scored.pkl`, `bt2_model.json`, `ch4_bt3.json`).

## 5. Prompt khởi động cho phiên Cloud mới (dán nguyên văn)

> Bạn là GVHD và đồng thời là agent thực hiện luận văn thạc sĩ ISE của tôi (Chu Thái Nguyên, HCMUT, GVHD TS. Nguyễn Vạng Phúc Nguyên). Luôn trả lời bằng tiếng Việt, giữ thuật ngữ tiếng Anh. Làm tuần tự từng chương, dừng cho tôi review.
>
> Đọc trước: `00_START_HERE.md`, `docs/BanGiao_v3.0_DuLieuV3.md`, `docs/SoT_v3_SoLieuChuan.md`, `docs/ChiSoModel_va_CongThuc.md`. Dựng lại dự án bằng `bash src/run_all.sh` và xác nhận JSON khớp SoT_v3 trước khi sửa bất cứ gì.
>
> Năm nguyên tắc bắt buộc:
> 1. **Không overclaim** — P(Win|p,x) là ước lượng thực nghiệm dạng rút gọn, không phải hậu nghiệm Bayes; best-response một phía không phải Nash; "nhất quán về chiều" không phải "đã chứng minh".
> 2. **Chỉ dùng công thức đã được chứng minh trong tài liệu**, có trích dẫn.
> 3. **Tách rõ phần thực tập (nền tảng) và phần mở rộng của luận văn.**
> 4. **Trung thực về hạn chế** — báo cáo cả kết quả âm.
> 5. **Một nguồn số liệu duy nhất** — mọi số đọc từ JSON; khi số đổi, cập nhật SoT_v2.
>
> Không bịa dữ liệu; mọi mô phỏng phải ghi rõ là mô phỏng. Giữ ẩn danh doanh nghiệp trong văn bản luận văn. Nếu tôi dán tài liệu nội bộ mật của doanh nghiệp, hãy cảnh báo.

---

## 6. Góp ý GVHD 16-09 và cách đã xử lý

| # | Góp ý | Xử lý trong v2.0 |
|---|---|---|
| 1 | Vì sao bài toán quan trọng | Ch.1 §1.2 — bốn luận cứ có số liệu (tần suất 38,6 quyết định/ngày; markup bất động 0,35 pp vs win rate 18,9 pp; 37,7% vi phạm SLA; hai bài toán chung một nguồn lực) |
| 2 | Kiểm tra phần dư, bất ổn thì transform | Ch.3 §3.2.2 quy trình 5 bước; Ch.4 §4.1.2: thang gốc BP p = 0,609 (ổn), log làm BP p < 1e−4 và MAE xấu đi 8,4% → **chọn thang gốc + HC3** |
| 3 | Standardize ≠ normalize | Ch.2 §2.1.3; dùng Z-score cho mọi hệ số |
| 4 | Dự báo TAT theo từng khâu + phân tích biến động | Ch.4 §4.1: CV Sales 0,760 cao nhất; Levene/Bartlett/Kruskal đều bác bỏ; hiệp phương sai 47,4%; Sales–Pricing r = −0,037 |
| 5 | BT2 cần hàm thắng/thua tường minh + liên hệ từng biến | Ch.3 §3.3 + Bảng 3.4 (6 nhóm, cơ chế, dấu kỳ vọng); TAT_pred dạng OOF chống rò rỉ |
| 6 | Gác BT3 | Hiểu là thứ tự: BT1/BT2 là thân bài; BT3 thu hẹp về kiểm định H1/H2 + CBPO |
| + | Dùng R² hiệu chỉnh thay R²; viết công thức BT1/2/3 | Ch.2 §2.1.5, Phụ lục A.2/B.1 (thí nghiệm biến nhiễu); công thức ở Ch.3 và `docs/ChiSoModel_va_CongThuc.md` |

---

## 7. Số liệu then chốt v3.0 (chi tiết: `docs/SoT_v3_SoLieuChuan.md`)

- **BT1:** không đổi — CV Sales 0,760 · hiệp phương sai 47,4% · r(Sales, Pricing) = −0,037 · hai đường tính chênh 0,77% (0,8437 vs 0,8372)
- **BT2 (nhãn v3):** AUC test 0,7808 [0,7579; 0,8051] · β PC +0,838 · CompInt −0,133 · Queue −0,222 · TAT_pred −0,093 (p 0,0038) · **trên nhãn v1 ba hệ số sau không có ý nghĩa**
- **BT3:** CBPO +13,91% (kẹp 36,4%) · Nash A/B kẹp 85% / 100% · **Nash C kẹp 32,4%, +10,45% (thuần +11,68%, lai +12,85%)** · H1 lịch sử b ≈ 0; FOC b = −0,37; Nash C b = −1,12 (đồng nhất thức) · giả dược tĩnh −0,18 / −0,23 pp
- **Mô phỏng §4.4 (π_SLA = 1):** P4 − P3 = +1,91 pp (C1) / +6,56 pp (C2) · vi phạm 37,67% → 36,0% / 32,2% · giá trị đến từ phân luồng G2; G1 đổi dấu ở 15/30 ô
- **A/B:** ICC 0,1995 (DEFF 1,818) · 2 nhánh: 316 hồ sơ/nhánh, 4,1 tháng · 3 nhánh: 382 hồ sơ/nhánh, 7,5 tháng; guard 5 pp 12,3 tháng

## 8. Việc còn lại

- [ ] **Kéo thả thủ công 3 file nhị phân vào thư mục gốc**: `…v2.0.docx`, `…v2.0.pdf`, `…v2.0_MaNguon.zip` (connector Drive không tải được file nhị phân lớn)
- [ ] Mở docx trong Word → chuột phải Mục lục → **Update Field** (cập nhật số trang)
- [ ] Rà trích dẫn Nhóm B–C (số trang/volume) lần cuối
- [ ] Đánh version theo yêu cầu GVHD: v2.0 = bản sau review 16-09
- [ ] Chuẩn bị giải thích với GVHD 5 điểm:
  1. BT3 vẫn giữ (hiểu "gác" là thứ tự; CBPO đã cam kết trong proposal; H1/H2 thu hẹp)
  2. Log-transform bị bác bỏ đúng theo quy trình thầy dạy (Bảng 4.2, Hình 4.2)
  3. Tách khâu không cải thiện dự báo (0,77%) — giá trị là chẩn đoán
  4. ICC mới lớn gấp 4 lần bản cũ → A/B cần lâu hơn (guard 3 pp: 18,7 tháng)
  5. BT2 hơi lạc quan (+3,95% số thắng; +2,7% lợi nhuận tại giá lịch sử) — đã khai báo §4.2.2, §5.5.2
- [ ] (Tùy chọn) Tách BT1 thành bài báo hội nghị nếu GVHD đồng ý

---

## 9. KHÔNG đề xuất lại (đã cân nhắc và loại)

| Hướng | Lý do loại |
|---|---|
| GPV (giá trị pipeline) làm trục chính | Không phải trục đã thống nhất với GVHD |
| Câu chuyện "dữ liệu làm giàu" (enriched dataset) không có thật | **Bịa dữ liệu — vi phạm liêm chính học thuật.** Mọi mô phỏng phải khai báo là mô phỏng |
| Log-transform cho BT1 | Bị chính chẩn đoán phần dư bác bỏ (§4.1.2) |
| Markup_Pct làm biến giá ở BT2/BT3 | Không mang thông tin (p 0,749); dùng Price_Competitiveness |
| `bt3_form.py` cũ | Đã thay bằng `bt3_form2.py`; bản cũ ghi đè bt3_form.json bằng đặc tả Markup_Pct sai |
| Tuyên bố CBPO+Capacity "vượt trội" | Giả dược cho thấy toàn bộ mức tăng là nâng giá đồng loạt |
| Gọi P(Win) là "Bayesian posterior" hoặc best-response là "Nash" | Overclaim (nguyên tắc 1) |

---

## 10. Bảo mật

- Văn bản luận văn gọi đơn vị nghiên cứu là "một doanh nghiệp phân phối vật tư liên kết và MRO công nghiệp B2B" — giữ ẩn danh.
- Hai CSV là dữ liệu đã chuẩn hóa / ẩn danh hóa / tiêm nhiễu theo yêu cầu doanh nghiệp. Không đưa thêm tài liệu nội bộ mật vào workspace cá nhân; nếu cần, cảnh báo trước.
- Thư mục Drive này chỉ chia sẻ trong phạm vi anh kiểm soát.
