# -*- coding: utf-8 -*-
"""Kiem toan bo du lieu v3 (ban trich xuat lai): truong moi, quan he voi truong cu, nhan da doi soat.
Dung cho Muc 3.1.2, Bang 3.1, Phu luc B.3."""
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json
h=pd.read_csv("HeadView_Workload.csv"); i=pd.read_csv("ItemView_Workload.csv")
v1=pd.read_csv("ItemView_Workload_v1_NhanTruocDoiSoat.csv")
O={"shape":{"head":list(h.shape),"item":list(i.shape)}}

# 1. Effective_Competitors_N theo Competitor_Intensity
ct=pd.crosstab(h.Competitor_Intensity,h.Effective_Competitors_N)
O["EffN"]={"crosstab":{r:{str(c):int(ct.loc[r,c]) for c in ct.columns} for r in ["Low","Med","High"]},
           "mean":float(h.Effective_Competitors_N.mean()),"values":sorted(int(x) for x in h.Effective_Competitors_N.unique())}

# 2. Urgency_SLA_Sensitivity va quy tac tai lap
rule=(1+0.5*h.Is_Strategic)*(1+0.25*(h.Required_Approval_Levels>=3))
O["Urgency"]={"values":{f"{k:.2f}":int(v) for k,v in h.Urgency_SLA_Sensitivity.value_counts().sort_index().items()},
   "mean":float(h.Urgency_SLA_Sensitivity.mean()),
   "rule_match_frac":float((np.abs(rule-h.Urgency_SLA_Sensitivity)<0.006).mean()),
   "rule":"(1 + 0,5·Is_Strategic) × (1 + 0,25·1[Required_Approval_Levels ≥ 3])"}

# 3. Market_Reserve_Bound so voi gia von, gia muc tieu, gia chao
r=i.Market_Reserve_Bound/i.Avg_PFEP; rt=(i.Market_Reserve_Bound/i.Target_Price).dropna()
O["MRB"]={"mean":float(i.Market_Reserve_Bound.mean()),"min":float(i.Market_Reserve_Bound.min()),"max":float(i.Market_Reserve_Bound.max()),
   "ratio_c_mean":float(r.mean()),"ratio_c_sd":float(r.std()),"ratio_c_cv":float(r.std()/r.mean()),
   "ratio_c_p5":float(r.quantile(.05)),"ratio_c_p95":float(r.quantile(.95)),
   "ratio_T_mean":float(rt.mean()),"corr_c":float(np.corrcoef(i.Market_Reserve_Bound,i.Avg_PFEP)[0,1]),
   "n_below_offer":int((i.Market_Reserve_Bound<i.Offered_Price).sum()),
   "delta_implied_median":float((r-1).median())}

# 4. Nhan Item_Win_Status: v1 (truoc doi soat) so voi v3
assert (v1["Project key"].values==i["Project key"].values).all()
a=v1.Item_Win_Status_v1.values; b=i.Item_Win_Status.values
O["labels"]={"n_changed":int((a!=b).sum()),"pct_changed":float((a!=b).mean()*100),
   "n_1to0":int(((a==1)&(b==0)).sum()),"n_0to1":int(((a==0)&(b==1)).sum()),
   "win_rate_v1":float(a.mean()),"win_rate_v3":float(b.mean()),
   "projects_touched":int(i.loc[a!=b,"Project key"].nunique())}
m=i.merge(h[["Project key","Pricing_Queue_Depth","Turnaround time"]],on="Project key",how="left")
m["chg"]=(a!=b)
O["labels"]["Q_mean_changed"]=float(m.loc[m.chg,"Pricing_Queue_Depth"].mean())
O["labels"]["Q_mean_unchanged"]=float(m.loc[~m.chg,"Pricing_Queue_Depth"].mean())
O["labels"]["Q_min_1to0"]=int(m.loc[(a==1)&(b==0),"Pricing_Queue_Depth"].min())
O["labels"]["Q_max_0to1"]=int(m.loc[(a==0)&(b==1),"Pricing_Queue_Depth"].max())
O["labels"]["TAT_mean_1to0"]=float(m.loc[(a==1)&(b==0),"Turnaround time"].mean())
O["labels"]["TAT_mean_0to1"]=float(m.loc[(a==0)&(b==1),"Turnaround time"].mean())

json.dump(O,open("data_audit.json","w"),indent=2,ensure_ascii=False)
for k,v in O.items(): print(k,v)
