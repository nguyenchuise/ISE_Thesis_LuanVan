# 00 — BẮT ĐẦU TẠI ĐÂY · Luận văn Thạc sĩ Chu Thái Nguyên (v2.0)

*Cập nhật 15-10-2026. Đây là file bàn giao cho phiên làm việc mới (Claude Cloud session, Colab, hoặc máy cá nhân). Đọc file này trước, sau đó đọc `docs/SoT_v2_SoLieuChuan.md`.*

---

## 1. Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Bản luận văn | `ChuThaiNguyen_LuanVan_v2.0.docx` — 65 trang, **hoàn chỉnh** Chương 1–6 + Tài liệu tham khảo (27 mục, APA 7) + Phụ lục A/B/C |
| Thành phần | Bìa · cam đoan · Tóm tắt · Abstract · Mục lục (TOC field) · viết tắt · danh sách 10 hình · danh sách 41 bảng · 6 footnote · số trang |
| Nguồn số liệu | **Mọi con số ở Chương 4–6, Tóm tắt, Phụ lục do JS đọc từ JSON lúc build — không gõ tay** |
| Tái lập | `bash run_all.sh` từ 2 CSV → 9 JSON + 10 PNG + docx. Đã kiểm chứng clean-room: JSON byte-identical, văn bản docx giống hệt, ~40 giây |
| Bản trên Drive `ChuThaiNguyen_LuanVan_v1.0.docx` | Văn bản **giống hệt v2.0** (chỉ được mở-lưu lại trong Word). Không mất chỉnh sửa nào. Không xóa / không ghi đè |
| Tên đề tài | *Ứng dụng Khai phá Dữ liệu trong Dự báo Thời gian Xử lý và Tối ưu hóa Giá Báo thầu tại Doanh nghiệp Phân phối Vật tư Công nghiệp B2B* |
| GVHD | TS. Nguyễn Vạng Phúc Nguyên · HCMUT · ngành Kỹ thuật Hệ thống Công nghiệp · MSSV 2470590 |

---

## 2. Bản đồ thư mục Drive

```
[ISE_Thesis] (thư mục gốc — 1BEsD12uWr1NbxBbbL3cqNJ2f-QlPZWmU)
├── 00_START_HERE.md                       ← file này
├── ChuThaiNguyen_LuanVan_v2.0.docx        ← (kéo thả thủ công — xem §8)
├── ChuThaiNguyen_LuanVan_v2.0.pdf         ← (kéo thả thủ công)
├── ChuThaiNguyen_LuanVan_v2.0_MaNguon.zip ← (kéo thả thủ công) toàn bộ src + JSON + PNG + CSV
├── ChuThaiNguyen_LuanVan_v1.0.docx        ← bản cũ = v2.0, giữ nguyên
├── ChuThaiNguyen_TomTatSuon_… Sep 12.docx ← file của tài khoản khác, KHÔNG động vào
├── Untitled0.ipynb                        ← notebook Colab của anh, không động vào
├── src/   (1kKeaM99SjVgsTTWJGbp_KWXwP4MUkLo3) — 25 file văn bản, đã đối chiếu kích thước byte
│   ├── HeadView_Workload.csv, ItemView_Workload.csv     ← dữ liệu đầu vào
│   ├── run_all.sh, requirements.txt, package.json       ← môi trường + chạy toàn bộ
│   ├── 10 script Python (xem §4)
│   └── build_all.js, thesis_lib.js, front.js, back.js, ch01.js … ch06.js
└── docs/  (1PjjImHwehHThnGv8egDdvjWbwylzRfLj)
    ├── SoT_v2_SoLieuChuan.md              ← NGUỒN SỐ LIỆU CHUẨN HIỆN HÀNH
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
3. Claude sẽ: `unzip` → `bash run_all.sh` → kiểm tra 9 JSON khớp `docs/SoT_v2_SoLieuChuan.md` → tiếp tục chỉnh.

### Cách B — Google Colab
```python
from google.colab import drive; drive.mount('/content/drive')
%cd "/content/drive/MyDrive/<đường dẫn tới thư mục>/src"
!node -v && python -V          # cần Node ≥ 18, Python ≥ 3.10
!bash run_all.sh
```
Lưu ý: `run_all.sh` ghi JSON/PNG/docx ngay trong `src/`. Nếu không muốn sinh file trong Drive, chép `src/` sang `/content/work` rồi chạy ở đó. Colab có thể khác phiên bản Python (3.12) — số từ mô hình học máy có thể lệch ở chữ số thập phân cuối; kết luận định tính không đổi.

### Cách C — Máy cá nhân
Tải toàn bộ `src/` về một thư mục → `bash run_all.sh` (Python 3.11 + Node 18+). Môi trường gốc: Python 3.11.15, Node 22, `docx@9.7.1` (đã ghim).

---

## 4. Luồng script → JSON → chương

| # | Script | Đầu ra | Dùng ở |
|---|---|---|---|
| 1 | `ch1_stats.py` | ch1_stats.json | Ch.1 (số ở Ch.1 đang gõ tay — đã đối chiếu) |
| 2 | `bt1_pertask.py` | bt1_pertask.json | Ch.4 §4.1, Tóm tắt, Ch.5–6 |
| 3 | `bt1_models.py` | bt1_models.json | Ch.4 §4.1.2–4.1.4 |
| 4 | `metric_compare.py` | metric_compare.json | Phụ lục A.2, B.1 |
| 5 | `bt3_form2.py` | bt3_form.json | Ch.4 §4.3.1 (FOC) |
| 6 | `ch4_bt12.py` | ch4_bt12.json, bt2_model.json, bt2_scored.pkl, FIG_4_1…4_4 | Ch.4 §4.2, BT3 dùng pkl |
| 7 | `ch4_bt3.py` | ch4_bt3.json, FIG_4_5…4_7 | Ch.4 §4.3–4.5, Ch.5–6 |
| 8 | `ch5_triage.py` | ch5_triage.json | Ch.5 §5.3.3, Ch.6 §6.3 |
| 9 | `ch4_icc_appx.py` | ch4_icc_appx.json | Phụ lục A.1, B.2 |
| 10 | `figs_ch1_ch3.py` | FIG_1_1, FIG_1_2, FIG_3_1 | Ch.1, Ch.3 |
| — | `node build_all.js` | ChuThaiNguyen_LuanVan_v2.0.docx | ch01–06 → back → **front chạy cuối** (để danh sách hình/bảng lấy đủ từ sổ đăng ký caption) |

**Thứ tự bắt buộc:** 6 trước 7 (BT3 đọc `bt2_scored.pkl`). Caption phải đúng dạng `Hình x.y: …` / `Bảng x.y: …` để tự vào danh sách. Footnote dùng `fn("…")` trong mảng run.

---

## 5. Prompt khởi động cho phiên Cloud mới (dán nguyên văn)

> Bạn là GVHD và đồng thời là agent thực hiện luận văn thạc sĩ ISE của tôi (Chu Thái Nguyên, HCMUT, GVHD TS. Nguyễn Vạng Phúc Nguyên). Luôn trả lời bằng tiếng Việt, giữ thuật ngữ tiếng Anh. Làm tuần tự từng chương, dừng cho tôi review.
>
> Đọc trước: `00_START_HERE.md`, `docs/SoT_v2_SoLieuChuan.md`, `docs/BanGiao_HuongMoi_SauReview.md`, `docs/ChiSoModel_va_CongThuc.md`. Dựng lại dự án bằng `bash run_all.sh` và xác nhận JSON khớp SoT_v2 trước khi sửa bất cứ gì.
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

## 7. Số liệu then chốt (chi tiết: `docs/SoT_v2_SoLieuChuan.md`)

- **BT1:** OLS thang gốc + HC3 · CV Sales 0,760 · hiệp phương sai 47,4% · Sales–Pricing r = −0,037 · tách khâu cải thiện MAE chỉ 0,77% (giá trị là chẩn đoán, không phải dự báo)
- **BT2:** logistic 13 biến Z / 6 nhóm · GroupShuffleSplit theo dự án · **AUC test 0,7770 [0,7528; 0,8020] · Brier 0,1820** · biến giá = Price_Competitiveness (= Target/Offered); Markup_Pct p = 0,749 · TAT_pred p = 0,089, dấu ngược kỳ vọng · XGBoost chỉ +0,005 AUC
- **BT3:** E[π] = (p−c)·P(Win|p,x); FOC γ·T·(p−c)·(1−P) = p², phi tuyến · **CBPO +14,03%** · Nash A/B kẹp 86,5% / 100% · H1 độ dốc −0,0075 (SE cụm 0,0063) → bác bỏ −1, không bác bỏ 0 · giả dược −0,055 pp → bác bỏ H2
- **A/B:** ICC lợi nhuận 0,1997 (DEFF 1,818), ICC thắng/thua 0,18 cho guard · uplift 14%: 311 RFQ/nhánh, 4,1 tháng · guard 3 pp: 18,7 tháng

---

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
