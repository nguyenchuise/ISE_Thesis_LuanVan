# -*- coding: utf-8 -*-
"""Chung minh vi sao R^2 bi thien khi them bien, va bo chi so thay the.
BT1: hoi quy tuyen tinh. BT2: hoi quy logistic (pseudo R^2)."""
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json
import statsmodels.api as sm
from sklearn.model_selection import KFold, GroupShuffleSplit
from sklearn.metrics import roc_auc_score, brier_score_loss

rng = np.random.default_rng(42)
h = pd.read_csv("HeadView_Workload.csv")
OUT = {}

# ══════════ PHAN A — BT1: R^2 vs R^2 hieu chinh ══════════
y = h["Turnaround time"].astype(float)
CORE = ["Required_Approval_Levels","Drawing_Clarification_Flags","Pricing_Queue_Depth",
        "Assigned_Engineer_Experience","Recent_Throughput_Rate"]
base = h[CORE].fillna(0).astype(float).copy()

def do_fit(Xd):
    X = sm.add_constant(Xd)
    m = sm.OLS(y, X).fit()
    kf = KFold(5, shuffle=True, random_state=42); r2cv=[]
    for tr,te in kf.split(X):
        mm = sm.OLS(y.iloc[tr], X.iloc[tr]).fit()
        pred = mm.predict(X.iloc[te]); res = y.iloc[te]-pred
        r2cv.append(1 - (res**2).sum()/((y.iloc[te]-y.iloc[tr].mean())**2).sum())
    return {"k_bien":Xd.shape[1], "R":float(np.sqrt(max(m.rsquared,0))),
            "R2":float(m.rsquared), "R2_hieu_chinh":float(m.rsquared_adj),
            "AIC":float(m.aic), "BIC":float(m.bic),
            "R2_kiem_chung_cheo":float(np.mean(r2cv)),
            "RMSE":float(np.sqrt(np.mean(m.resid**2)))}

rows=[]; Xd = base.copy()
rows.append({"Mo_hinh":"M0 — 5 bien thuc chat", **do_fit(Xd)})
# them dan bien NHIEU NGAU NHIEN — khong mang thong tin nao
for k,n in enumerate([5,10,20,40], start=1):
    Xn = base.copy()
    for j in range(n):
        Xn[f"noise_{j}"] = rng.normal(size=len(h))
    rows.append({"Mo_hinh":f"M{k} — 5 bien + {n} bien nhieu", **do_fit(Xn)})
A = pd.DataFrame(rows)
OUT["bt1_r2_bias"] = A.round(4).to_dict("records")

# ══════════ PHAN B — BT2: logistic va cac pseudo R^2 ══════════
i = pd.read_csv("ItemView_Workload.csv")
d = i.merge(h[["Project key","Customer_Class","Is_Strategic","Is_Existing_Customer",
               "Competitor_Intensity","Payment_Term_Risk","Pricing_Queue_Depth",
               "Assigned_Engineer_Experience"]], on="Project key", how="left")
d["CompInt"] = d["Competitor_Intensity"].map({"Low":1,"Med":2,"High":3})
d["PayRisk"] = d["Payment_Term_Risk"].map({"Net30":1,"Net60":2,"Net90":3})
FEAT = ["Markup_Pct","Price_Competitiveness","Supplier_SQE_Score","ATP_Stock_Available",
        "Has_PPAP_Cert","Local_Supplier","Is_Strategic","Is_Existing_Customer",
        "CompInt","PayRisk","Pricing_Queue_Depth","Assigned_Engineer_Experience"]
sub = d[FEAT + ["Item_Win_Status","Project key"]].dropna()
Xl = sm.add_constant(sub[FEAT].astype(float)); yl = sub["Item_Win_Status"].astype(int)

def logit_metrics(Xm, ym, ten):
    m = sm.Logit(ym, Xm).fit(disp=0)
    n = len(ym); k = Xm.shape[1]-1
    m0 = sm.Logit(ym, np.ones((n,1))).fit(disp=0)
    ll, ll0 = m.llf, m0.llf
    mcf   = 1 - ll/ll0
    mcf_a = 1 - (ll-k)/ll0                      # McFadden hieu chinh
    cox   = 1 - np.exp(2*(ll0-ll)/n)
    nag   = cox / (1 - np.exp(2*ll0/n))
    p = m.predict(Xm)
    return {"Mo_hinh":ten,"k_bien":k,"LogLik":float(ll),
            "McFadden_R2":float(mcf),"McFadden_hieu_chinh":float(mcf_a),
            "CoxSnell_R2":float(cox),"Nagelkerke_R2":float(nag),
            "AIC":float(m.aic),"BIC":float(m.bic),
            "AUC":float(roc_auc_score(ym,p)),"Brier":float(brier_score_loss(ym,p))}

rowsB=[logit_metrics(Xl, yl, "L0 — 12 bien thuc chat")]
for k,n in enumerate([10,30], start=1):
    Xn = Xl.copy()
    for j in range(n): Xn[f"noise_{j}"] = rng.normal(size=len(Xn))
    rowsB.append(logit_metrics(Xn, yl, f"L{k} — 12 bien + {n} bien nhieu"))
B = pd.DataFrame(rowsB)
OUT["bt2_pseudo_r2"] = B.round(4).to_dict("records")

# AUC ngoai mau, tach theo nhom du an (chong ro ri)
g = sub["Project key"].astype(str)
tr,te = next(GroupShuffleSplit(1,test_size=.2,random_state=42).split(Xl,yl,g))
mtr = sm.Logit(yl.iloc[tr], Xl.iloc[tr]).fit(disp=0)
pte = mtr.predict(Xl.iloc[te])
OUT["bt2_ngoai_mau"] = {"AUC_ngoai_mau":float(roc_auc_score(yl.iloc[te],pte)),
    "Brier_ngoai_mau":float(brier_score_loss(yl.iloc[te],pte)),
    "n_train":int(len(tr)),"n_test":int(len(te))}

json.dump(OUT, open("metric_compare.json","w"), indent=2)
print("PHAN A — BT1: khi them bien NHIEU vao mo hinh")
print(A[["Mo_hinh","k_bien","R","R2","R2_hieu_chinh","AIC","BIC","R2_kiem_chung_cheo"]].round(4).to_string(index=False))
print("\nPHAN B — BT2: logistic")
print(B[["Mo_hinh","k_bien","McFadden_R2","McFadden_hieu_chinh","Nagelkerke_R2","AIC","BIC","AUC"]].round(4).to_string(index=False))
print("\nNgoai mau (tach theo du an):", {k:round(v,4) if isinstance(v,float) else v
      for k,v in OUT["bt2_ngoai_mau"].items()})
