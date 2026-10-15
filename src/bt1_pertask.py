# -*- coding: utf-8 -*-
"""BT1 theo goc nhin cua GVHD: EDA tung khau -> phan tich variation -> chan doan phan du."""
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json
from scipy import stats
import statsmodels.api as sm

h = pd.read_csv("HeadView_Workload.csv")
ST = ["Sales_Days","WBS_Days","SC_Days","Pricing_Days"]
OUT = {}

# ── 1. EDA tung khau: central tendency + variability ──
rows=[]
for s in ST:
    x = h[s].dropna().astype(float)
    rows.append({"Khau":s.replace("_Days",""), "n":len(x),
        "Mean":x.mean(), "Median":x.median(), "SD":x.std(ddof=1),
        "CV":x.std(ddof=1)/x.mean(), "IQR":x.quantile(.75)-x.quantile(.25),
        "Skew":stats.skew(x), "Kurt":stats.kurtosis(x),
        "P95":x.quantile(.95), "Max":x.max()})
eda = pd.DataFrame(rows)
OUT["eda"] = eda.round(4).to_dict("records")

# ── 2. Kiem dinh variation co GIONG NHAU giua 4 khau khong ──
grp = [h[s].dropna().astype(float).values for s in ST]
lev = stats.levene(*grp, center="median")          # Brown-Forsythe
bart = stats.bartlett(*grp)
kw  = stats.kruskal(*grp)
OUT["dong_nhat_phuong_sai"] = {
    "levene_W": float(lev.statistic), "levene_p": float(lev.pvalue),
    "bartlett_chi2": float(bart.statistic), "bartlett_p": float(bart.pvalue),
    "kruskal_H": float(kw.statistic), "kruskal_p": float(kw.pvalue)}

# so sanh tung cap CV bang bootstrap
rng = np.random.default_rng(42); pairs=[]
for a in range(4):
    for b in range(a+1,4):
        xa, xb = grp[a], grp[b]
        cva, cvb = xa.std(ddof=1)/xa.mean(), xb.std(ddof=1)/xb.mean()
        d = np.array([ (lambda u,v: u.std(ddof=1)/u.mean() - v.std(ddof=1)/v.mean())(
              rng.choice(xa,len(xa),True), rng.choice(xb,len(xb),True)) for _ in range(2000)])
        pairs.append({"Cap":f"{ST[a][:-5]} vs {ST[b][:-5]}","CV_1":cva,"CV_2":cvb,
            "Chenh_CV":cva-cvb,"CI_lo":np.quantile(d,.025),"CI_hi":np.quantile(d,.975),
            "Khac_biet":bool(np.quantile(d,.025)>0 or np.quantile(d,.975)<0)})
OUT["cap_CV"] = pd.DataFrame(pairs).round(4).to_dict("records")

# ── 3. Phan ra phuong sai: bao nhieu % bien thien tong den tu tung khau ──
tot = h[ST].sum(axis=1)
OUT["phan_ra_phuong_sai"] = {
    "Var_tong": float(tot.var(ddof=1)),
    "Tong_var_tung_khau": float(sum(h[s].var(ddof=1) for s in ST)),
    "dong_gop_%": {s.replace("_Days",""): float(h[s].var(ddof=1)/tot.var(ddof=1)*100) for s in ST},
    "hiep_phuong_sai_%": float((tot.var(ddof=1)-sum(h[s].var(ddof=1) for s in ST))/tot.var(ddof=1)*100)}

# ── 4. Chan doan phan du: hoi quy TAT tong, kiem dinh phuong sai thay doi ──
X = h[["Required_Approval_Levels","Drawing_Clarification_Flags","Pricing_Queue_Depth",
       "Assigned_Engineer_Experience","Recent_Throughput_Rate"]].fillna(0).astype(float)
y = h["Turnaround time"].astype(float)
Xc = sm.add_constant(X)
m_raw = sm.OLS(y, Xc).fit()
m_log = sm.OLS(np.log(y.clip(lower=0.1)), Xc).fit()
def chan_doan(m, ten):
    bp = sm.stats.diagnostic.het_breuschpagan(m.resid, m.model.exog)
    wh = sm.stats.diagnostic.het_white(m.resid, m.model.exog)
    jb = stats.jarque_bera(m.resid)
    return {"mo_hinh":ten,"R2":float(m.rsquared),
            "BP_LM":float(bp[0]),"BP_p":float(bp[1]),
            "White_LM":float(wh[0]),"White_p":float(wh[1]),
            "JB":float(jb.statistic),"JB_p":float(jb.pvalue),
            "Skew_resid":float(stats.skew(m.resid))}
OUT["chan_doan_phan_du"] = [chan_doan(m_raw,"TAT nguyen goc"), chan_doan(m_log,"log(TAT)")]

json.dump(OUT, open("bt1_pertask.json","w"), indent=2)
print(eda.round(3).to_string(index=False)); print()
print("Levene p = %.3e | Bartlett p = %.3e | Kruskal p = %.3e" % (
    lev.pvalue, bart.pvalue, kw.pvalue)); print()
print(pd.DataFrame(pairs).round(3).to_string(index=False)); print()
print("Dong gop phuong sai:", {k:round(v,1) for k,v in OUT["phan_ra_phuong_sai"]["dong_gop_%"].items()},
      "| hiep phuong sai %:", round(OUT["phan_ra_phuong_sai"]["hiep_phuong_sai_%"],1)); print()
for r in OUT["chan_doan_phan_du"]:
    print("%-16s R2=%.3f  BP p=%.2e  White p=%.2e  JB p=%.2e  skew=%.2f" % (
        r["mo_hinh"],r["R2"],r["BP_p"],r["White_p"],r["JB_p"],r["Skew_resid"]))
