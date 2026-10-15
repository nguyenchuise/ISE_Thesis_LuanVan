# -*- coding: utf-8 -*-
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json, statsmodels.api as sm
s=pd.read_pickle("bt2_scored.pkl"); h=pd.read_csv("HeadView_Workload.csv")
s["profit_real"]=(s.Offered_Price-s.Avg_PFEP)*s.Item_Win_Status
s["log_profit"]=np.log1p(s.profit_real.clip(lower=0))
def icc(v):
    g=s.groupby("Project key")[v]; k=g.ngroups; n=len(s); m=n/k
    msb=g.mean().var(ddof=1)*m; msw=((s[v]-g.transform("mean"))**2).sum()/(n-k)
    return float((msb-msw)/(msb+(m-1)*msw)), float(m)
O={}
for v,lab in [("profit_real","Lợi nhuận thực nhận"),("Item_Win_Status","Chỉ báo thắng/thua"),("log_profit","log(1+lợi nhuận)"),("p_hat","Xác suất thắng dự báo")]:
    i,m=icc(v); O[v]={"label":lab,"ICC":i,"DEFF":1+(m-1)*i}
    print("%-26s ICC %.4f  DEFF %.3f" % (lab,i,1+(m-1)*i))

# Phu luc A: he so day du tung khau voi HC3
PRED=["Required_Approval_Levels","Drawing_Clarification_Flags","Pricing_Queue_Depth","Assigned_Engineer_Experience","Recent_Throughput_Rate"]
X=h[PRED].fillna(0).astype(float); Z=(X-X.mean())/X.std(); Zc=sm.add_constant(Z)
A={}
for s_ in ["Sales_Days","WBS_Days","SC_Days","Pricing_Days","Turnaround time"]:
    m=sm.OLS(h[s_].astype(float),Zc).fit(cov_type="HC3")
    A[s_]={"coef":m.params.round(4).to_dict(),"se_hc3":m.bse.round(4).to_dict(),"p":m.pvalues.round(4).to_dict(),
           "R2":float(m.rsquared),"R2_adj":float(m.rsquared_adj),"AIC":float(m.aic),"BIC":float(m.bic)}
O["appendix_A"]=A
json.dump(O,open("ch4_icc_appx.json","w"),indent=2)
print("\nPhu luc A (he so chuan hoa, SE HC3) — TAT tong:")
t=A["Turnaround time"]
for kk in ["const"]+PRED: print("  %-30s %8.4f  (%.4f)  p=%.4f" % (kk,t["coef"][kk],t["se_hc3"][kk],t["p"][kk]))
