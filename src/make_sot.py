# -*- coding: utf-8 -*-
"""Sinh docs/SoT_v3_SoLieuChuan.md tu cac JSON ket qua — nguon so lieu chuan duy nhat cua ban phat hanh."""
import json, os
J=lambda f: json.load(open(f))
S1,B1,B1M,B12,B3,SIM,TR,AX=[J(f) for f in ["ch1_stats.json","bt1_pertask.json","bt1_models.json",
   "ch4_bt12.json","ch4_bt3.json","ch4_sim.json","ch5_triage.json","ch4_icc_appx.json"]]
f=lambda x,d=4: f"{x:.{d}f}".replace(".",",")
P=B3["policies"]; HE=B3["H1_EffN"]; c=lambda b: next(r for r in B12["bt2_coef"] if r["bien"]==b); POL=SIM["meta"]["policies"]
L=[]; a=L.append
a("# SoT — Số liệu chuẩn của bản phát hành luận văn (sinh tự động bởi `src/make_sot.py`)\n")
a("*Không sửa tay. Chạy `bash src/run_all.sh` để tái lập. Mọi số trong docx đọc từ JSON cùng nguồn.*\n")
DL=S1["du_lieu"]; R=B12["bt2_robust_status"]
a("## 0. Dữ liệu\n")
a(f"- HeadView {DL['head_shape'][0]}×{DL['head_shape'][1]}, ItemView {DL['item_shape'][0]}×{DL['item_shape'][1]}; BT2 dùng {B12['bt2_n']['items']} dòng / {B12['bt2_n']['projects']} hồ sơ; chia 80/20 theo dự án: {B12['bt2_split']['train_items']} / {B12['bt2_split']['test_items']} dòng ({B12['bt2_split']['test_projects']} hồ sơ)")
a(f"- Kiểm tra độ vững (trạng thái trước đối soát cuối kỳ): {R['n_changed']} dòng đổi ({f(R['pct_changed'],2)}%), Q trung bình {f(R['Q_mean_changed'],1)} vs {f(R['Q_mean_unchanged'],1)}\n")
a("## 1. Chương 1\n")
pc=S1["phan_ung_canh_tranh"]
a(f"- Vi phạm SLA {S1['sla']['so_vi_pham']}/1500 = {f(S1['sla']['ty_le_vi_pham']*100,2)}%; win rate Low/Med/High = {f(pc['Low']['win']*100,2)} / {f(pc['Med']['win']*100,2)} / {f(pc['High']['win']*100,2)}% (chênh {f((pc['Low']['win']-pc['High']['win'])*100,2)} pp); markup chênh {f(S1['bien_do_markup_giua_3_muc']*100,2)} pp\n")
a("## 2. BT1\n")
t=B1M["tong_vs_congdon"]
a(f"- CV Sales {f(B1['eda'][0]['CV'],3)}; hiệp phương sai {f(B1['phan_ra_phuong_sai']['hiep_phuong_sai_%'],1)}%; r(Sales,Pricing) = {f(B1M['tuong_quan']['Sales_Days']['Pricing_Days'],3)}")
a(f"- BP p thang gốc {f(B1M['dac_ta'][0]['BP_p'],3)}; log MAE xấu đi {f((B1M['dac_ta'][1]['MAE_ngay']/B1M['dac_ta'][0]['MAE_ngay']-1)*100,1)}%")
a(f"- MAE trực tiếp {f(t['MAE_du_bao_tong'])} vs cộng dồn {f(t['MAE_cong_don_4_khau'])} — chênh {f(t['Cai_thien_%'],2)}%; TAT_pred OOF MAE {f(B12['bt1_oof']['MAE'])}, R² {f(B12['bt1_oof']['R2_oof'])}\n")
a("## 3. BT2\n")
m=B12["bt2_metrics"]
a(f"- AUC test {f(m['AUC_test'])} [{f(m['AUC_test_CI'][0])}; {f(m['AUC_test_CI'][1])}], Brier {f(m['Brier_test'])}; XGB {f(B12['bt2_xgb']['AUC_test'])}; hiệu chuẩn +{f(B12['bt2_calib']['deviation_pct'],2)}%")
for b in ["Price_Competitiveness","Supplier_SQE_Score","ATP_Stock_Available","Has_PPAP_Cert","Local_Supplier","Is_Existing_Customer","CustClass","CompInt","Pricing_Queue_Depth","TAT_pred"]:
    r=c(b); v0=B12["bt2_robust_status"]["coef_pre"][b]
    a(f"  - {b}: β = {f(r['beta_z'])} (p = {r['p']:.2e}) | trước đối soát: {f(v0['beta_z'])} (p = {v0['p']:.3f})")
a("")
a("## 4. BT3\n")
for k in ["CBPO Realistic (kẹp P5–P95)","Nash A — miền tuyệt đối (kẹp)","Nash B — miền tỷ lệ (kẹp)","Nash C — cận dòng hàng, N thực tế (kẹp)",
          "Nash C — dạng đóng thuần (không kẹp)","Nash C + phản hồi logistic (±5% quanh neo)","CBPO + Capacity λ(Q)","Giả dược — λ hằng số",
          "CBPO + Capacity λ(Q)·U (trọng số SLA)","Giả dược — λ hằng số (bản trọng số SLA)"]:
    a(f"- {k}: uplift {f(P[k]['uplift_pct'],2)}%, kẹp {f(P[k]['clip']*100,1)}%")
a(f"- Giả dược tĩnh: λ(Q) {f(B3['placebo']['dong_gop_dieu_tiet_pp'],2)} pp; λ(Q)·U {f(B3['placebo']['dong_gop_dieu_tiet_U_pp'],2)} pp")
for k,lab in [("lich_su_lnMarkup","H1 lịch sử ln Markup"),("lich_su_lnMargin","H1 lịch sử ln(Markup−1)"),("FOC_lnMargin","H1 FOC"),("NashC_lnMargin","H1 Nash C (đồng nhất thức)")]:
    r=HE[k]; a(f"- {lab}: b = {f(r['slope'])} (SE {f(r['SE_cluster'])}), p(b=0) = {r['p_vs_0']:.3g}, p(b=−1) = {r['p_vs_minus1']:.3g}")
a(f"- H1 gốc (N lai): b = {f(B3['H1_test']['slope'])}, p(b=0) = {f(B3['H1_test']['p_vs_0'],3)}\n")
a("## 5. Mô phỏng Mục 4.4 (π_SLA = 1)\n")
for cn in ["C1","C2"]:
    M=SIM["main"][cn]["1.0"]; cal=SIM["calibration"][cn]
    a(f"- {cn} (m = {cal['m']}, κ = {f(cal['kappa'],2)}, W̄ = {f(cal['W_mean'],3)}): P4 uplift ròng {f(M['policies'][POL[3]]['uplift_net_pct'],2)}%, vi phạm {f(M['policies'][POL[3]]['breach']*100,2)}%; "
      f"P4−P3 {f(M['compare']['P4_vs_P3']['mean_pp'],2)} pp; P5−P2 {f(M['compare']['P5_vs_P2']['mean_pp'],2)}; P6−P3 {f(M['compare']['P6_vs_P3']['mean_pp'],2)}; P7−P3 {f(M['compare']['P7_vs_P3']['mean_pp'],2)}")
a(f"- Mặt phẳng chuyển pha: G2 dương ở {sum(1 for r in SIM['phase']['grid']['C1'] if r['d_pp']>0)}/30 ô (C1); G1 âm ở {sum(1 for r in SIM['phase']['grid']['C1'] if r['d_G1_pp']<0)}/30 ô (C1)\n")
a("## 6. A/B\n")
A=B3["ab_design"]
a(f"- ICC lợi nhuận {f(A['ICC'])}, DEFF {f(A['DEFF'],3)}; 2 nhánh uplift 14%: {A['uplift_14pct']['n_proj_per_arm']:.0f} hồ sơ/nhánh, {f(A['uplift_14pct']['months'],1)} tháng; 3 nhánh: {A['three_arm']['uplift_14pct']['n_proj_per_arm']:.0f}, {f(A['three_arm']['uplift_14pct']['months'],1)} tháng; guard 5 pp 3 nhánh {f(A['three_arm']['guard_wr_5pp']['months'],1)} tháng")
a(f"- Triage: λ/E trung vị {f(TR['lam_over_E_pct'],1)}%; {f(TR['pct_below'],1)}% hồ sơ dưới giá bóng; π hòa vốn {TR['pi_breakeven_USD']:.0f} USD ({f(TR['pi_breakeven_x_margin'],1)}× biên)")
os.makedirs("../docs",exist_ok=True)
open("../docs/SoT_v3_SoLieuChuan.md","w").write("\n".join(L)+"\n"); print("\n".join(L))
