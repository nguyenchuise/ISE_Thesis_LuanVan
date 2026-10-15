# -*- coding: utf-8 -*-
"""BT3 — dan xuat va kiem chung dieu kien bac nhat cho bai toan toi uu gia.
Bien gia trong mo hinh: r = Target_Price / Offered_Price  (nghich dao gia)."""
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json, statsmodels.api as sm
from scipy.optimize import brentq

i=pd.read_csv("ItemView_Workload.csv"); h=pd.read_csv("HeadView_Workload.csv")
d=i.merge(h[["Project key","Is_Strategic","Is_Existing_Customer","Competitor_Intensity"]],
          on="Project key",how="left")
d["CompInt"]=d["Competitor_Intensity"].map({"Low":1,"Med":2,"High":3})
FE=["Price_Competitiveness","Supplier_SQE_Score","ATP_Stock_Available","Has_PPAP_Cert",
    "Is_Strategic","Is_Existing_Customer","CompInt"]
s=d[FE+["Item_Win_Status","Avg_PFEP","Target_Price"]].dropna().reset_index(drop=True)
X=sm.add_constant(s[FE].astype(float)); y=s["Item_Win_Status"].astype(int)
m=sm.Logit(y,X).fit(disp=0); gam=float(m.params["Price_Competitiveness"])
OUT={"gamma_r":gam,"p_value":float(m.pvalues["Price_Competitiveness"]),
     "dinh_nghia_r":"r = Target_Price / Offered_Price (max lech 0,0005)"}
print("gamma_r = %+.4f (p = %.2e). r la NGHICH DAO gia nen dP/dp < 0 — dung chieu kinh te.\n" % (
    gam, m.pvalues["Price_Competitiveness"]))

def giai(k):
    row=s.iloc[k]; c=float(row["Avg_PFEP"]); T=float(row["Target_Price"])
    xb=float(m.params["const"]+sum(m.params[q]*row[q] for q in FE if q!="Price_Competitiveness"))
    P =lambda p: 1/(1+np.exp(-(xb+gam*(T/p))))
    pi=lambda p: (p-c)*P(p)
    g=np.linspace(c*1.0005,c*3.0,60001); p_g=g[int(np.argmax([pi(v) for v in g]))]
    # FOC:  gamma*T*(p-c)*(1-P(p)) = p^2
    foc=lambda p: gam*T*(p-c)*(1-P(p)) - p**2
    try: p_f=brentq(foc,c*1.0005,c*3.0)
    except Exception: p_f=float("nan")
    return dict(c=c,T=T,p_grid=float(p_g),p_foc=float(p_f),lech=float(abs(p_g-p_f)),
                markup=float(p_g/c),Pwin=float(P(p_g)),Eprofit=float(pi(p_g)))

rows=[giai(k) for k in range(6)]
R=pd.DataFrame(rows); OUT["kiem_chung"]=R.round(6).to_dict("records")
print("Kiem chung nghiem giai tich (FOC) vs do luoi — 6 mat hang dau:")
print(R.round(4).to_string(index=False))
print("\nSai lech lon nhat giua FOC va do luoi: %.2e USD" % R["lech"].max())

# do cong cua ham muc tieu quanh cuc dai
k=0; row=s.iloc[k]; c=float(row["Avg_PFEP"]); T=float(row["Target_Price"])
xb=float(m.params["const"]+sum(m.params[q]*row[q] for q in FE if q!="Price_Competitiveness"))
P=lambda p:1/(1+np.exp(-(xb+gam*(T/p)))); pi=lambda p:(p-c)*P(p)
hh=1e-3; xs=np.linspace(c*1.05,c*2.5,800)
d2=[(pi(v+hh)-2*pi(v)+pi(v-hh))/hh**2 for v in xs]
OUT["phi_tuyen"]={"doi_dau":bool(min(d2)<0<max(d2)),"min_d2":float(min(d2)),"max_d2":float(max(d2))}
print("Dao ham bac hai doi dau tren mien gia: %s (min %.4f, max %.4f)" % (
    OUT["phi_tuyen"]["doi_dau"], min(d2), max(d2)))
print("=> Ham muc tieu PHI TUYEN, lom quanh cuc dai, khong co nghiem dang dong -> giai so.")
json.dump(OUT,open("bt3_form.json","w"),indent=2)
