# -*- coding: utf-8 -*-
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json
s=pd.read_pickle("bt2_scored.pkl"); B3=json.load(open("ch4_bt3.json")); h=pd.read_csv("HeadView_Workload.csv")
te=s[s.is_test==1].copy()
te["E_profit"]=(te.Offered_Price-te.Avg_PFEP)*te.p_hat
r=te.groupby("Project key").agg(E=("E_profit","sum"),n=("E_profit","size"),Q=("Pricing_Queue_Depth","first"))
a0,a1=B3["logit_breach"]["a0"],B3["logit_breach"]["a1"]; MARGIN=B3["lambda"]["margin_item"]
Pb=lambda q:1/(1+np.exp(-(a0+a1*np.clip(q,0,30))))
Dl=lambda q:(np.clip(q,0,30)+1)*Pb(np.clip(q,0,30)+1)-np.clip(q,0,30)*Pb(np.clip(q,0,30))
pi=0.5*MARGIN; r["lam_rfq"]=pi*Dl(r.Q.astype(float))
below=r[r.E<r.lam_rfq]
O={"n_rfq_test":int(len(r)),"E_profit_median_rfq":float(r.E.median()),"lam_rfq_median":float(r.lam_rfq.median()),
   "lam_over_E_pct":float(r.lam_rfq.median()/r.E.median()*100),
   "n_below":int(len(below)),"pct_below":float(len(below)/len(r)*100),
   "profit_share_below_pct":float(below.E.sum()/r.E.sum()*100),"items_share_below_pct":float(below.n.sum()/r.n.sum()*100),
   "pi_breakeven_USD":float(r.E.median()/Dl(float(r.Q.median()))),"Q_median":float(r.Q.median())}
O["pi_breakeven_x_margin"]=O["pi_breakeven_USD"]/MARGIN
json.dump(O,open("ch5_triage.json","w"),indent=2)
for k,v in O.items(): print("%-26s %s" % (k, round(v,3) if isinstance(v,float) else v))
