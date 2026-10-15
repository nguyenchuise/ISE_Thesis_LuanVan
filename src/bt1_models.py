# -*- coding: utf-8 -*-
"""So sanh dac ta mo hinh cho BT1 va hoi quy rieng tung khau."""
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json
import statsmodels.api as sm
from scipy import stats
from sklearn.model_selection import KFold

h = pd.read_csv("HeadView_Workload.csv")
ST = ["Sales_Days","WBS_Days","SC_Days","Pricing_Days"]
PRED = ["Required_Approval_Levels","Drawing_Clarification_Flags","Pricing_Queue_Depth",
        "Assigned_Engineer_Experience","Recent_Throughput_Rate"]
X = sm.add_constant(h[PRED].fillna(0).astype(float))
OUT={}

# ── A. Bon dac ta cho TAT tong ──
y = h["Turnaround time"].astype(float)
spec=[]
def ghi(ten, m, fitted, resid):
    bp = sm.stats.diagnostic.het_breuschpagan(resid, X.values)
    jb = stats.jarque_bera(resid)
    mae = np.mean(np.abs(y - fitted))
    spec.append({"Dac_ta":ten,"MAE_ngay":mae,
        "BP_p":float(bp[1]),"JB_p":float(jb.pvalue),"Skew_resid":float(stats.skew(resid)),
        "Phuong_sai_deu": bool(bp[1]>0.05), "Phan_du_chuan": bool(jb.pvalue>0.05)})
m1=sm.OLS(y,X).fit();                       ghi("OLS thang do goc", m1, m1.fittedvalues, m1.resid)
m2=sm.OLS(np.log(y.clip(lower=.1)),X).fit();ghi("OLS tren log(TAT)", m2, np.exp(m2.fittedvalues), m2.resid)
m3=sm.OLS(y,X).fit(cov_type="HC3");         ghi("OLS + sai so vung HC3", m3, m3.fittedvalues, m3.resid)
m4=sm.GLM(y,X,family=sm.families.Gamma(sm.families.links.Log())).fit()
ghi("GLM Gamma, lien ket log", m4, m4.fittedvalues, m4.resid_deviance)
OUT["dac_ta"]=pd.DataFrame(spec).round(4).to_dict("records")

# ── B. Kiem chung ngoai mau 5-fold: tong truc tiep vs cong don tung khau ──
kf=KFold(5,shuffle=True,random_state=42); a=[];b=[]
for tr,te in kf.split(X):
    a.append(np.mean(np.abs(y.iloc[te]-sm.OLS(y.iloc[tr],X.iloc[tr]).fit().predict(X.iloc[te]))))
    pred=np.zeros(len(te))
    for s in ST:
        ys=h[s].astype(float)
        pred+=sm.OLS(ys.iloc[tr],X.iloc[tr]).fit().predict(X.iloc[te]).values
    b.append(np.mean(np.abs(y.iloc[te].values-pred)))
OUT["tong_vs_congdon"]={"MAE_du_bao_tong":float(np.mean(a)),"SD":float(np.std(a)),
    "MAE_cong_don_4_khau":float(np.mean(b)),"SD_congdon":float(np.std(b)),
    "Cai_thien_%":float((np.mean(a)-np.mean(b))/np.mean(a)*100)}

# ── C. Hoi quy rieng tung khau ──
per=[]
for s in ST:
    ys=h[s].astype(float); m=sm.OLS(ys,X).fit()
    bp=sm.stats.diagnostic.het_breuschpagan(m.resid,X.values)
    top=m.params.drop("const").abs().idxmax()
    per.append({"Khau":s.replace("_Days",""),"R2":float(m.rsquared),
        "MAE_ngay":float(np.mean(np.abs(ys-m.fittedvalues))),
        "BP_p":float(bp[1]),"Phuong_sai_deu":bool(bp[1]>0.05),
        "Bien_manh_nhat":top,"He_so":float(m.params[top])})
OUT["tung_khau"]=pd.DataFrame(per).round(4).to_dict("records")

# ── D. Tuong quan giua cac khau ──
OUT["tuong_quan"]=h[ST].corr().round(3).to_dict()

json.dump(OUT,open("bt1_models.json","w"),indent=2)
print("A. DAC TA MO HINH — TAT tong"); print(pd.DataFrame(spec).round(4).to_string(index=False))
print("\nB. Du bao TONG truc tiep MAE = %.4f | Cong don 4 khau MAE = %.4f | cai thien %.2f%%" % (
    np.mean(a), np.mean(b), OUT["tong_vs_congdon"]["Cai_thien_%"]))
print("\nC. HOI QUY RIENG TUNG KHAU"); print(pd.DataFrame(per).round(4).to_string(index=False))
print("\nD. TUONG QUAN GIUA CAC KHAU"); print(h[ST].corr().round(3).to_string())
