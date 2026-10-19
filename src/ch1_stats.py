# -*- coding: utf-8 -*-
"""So lieu nen cho Chuong 1 — quy mo, ap luc SLA, dac diem quyet dinh gia."""
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json
h=pd.read_csv("HeadView_Workload.csv"); i=pd.read_csv("ItemView_Workload.csv")
O={}

# quy mo va nhip do
h["dt"]=pd.to_datetime(h["Created On_1"],format="%d-%m-%y",errors="coerce")
span=(h["dt"].max()-h["dt"].min()).days
O["quy_mo"]={"du_an":int(len(h)),"mat_hang":int(len(i)),
    "khach_hang":int(h["Cust. Name"].nunique()),
    "ky_quan_sat_ngay":int(span),"du_an_moi_thang":float(len(h)/(span/30.4)),
    "mat_hang_tb_moi_du_an":float(len(i)/len(h))}

# ap luc SLA
tat=h["Turnaround time"].astype(float)
O["sla"]={"nguong_ngay":7,"so_vi_pham":int((tat>7).sum()),
    "ty_le_vi_pham":float((tat>7).mean()),
    "TAT_median":float(tat.median()),"TAT_mean":float(tat.mean()),
    "TAT_p90":float(tat.quantile(.90)),"TAT_max":float(tat.max())}

# gia tri thuong mai
i["gia_tri"]=i["Offered_Price"]*i["Order Quantity"]
w=i[i["Item_Win_Status"]==1]
O["gia_tri"]={"tong_chao_USD":float(i["gia_tri"].sum()),
    "tong_thang_USD":float(w["gia_tri"].sum()),
    "ty_le_thang_mat_hang":float(i["Item_Win_Status"].mean()),
    "gia_tri_tb_moi_du_an_USD":float(i.groupby("Project key")["gia_tri"].sum().mean()),
    "bien_lo_i_nhuan_tb_moi_mat_hang_USD":float((i["Offered_Price"]-i["Avg_PFEP"]).mean())}

# quyet dinh gia co phan ung voi canh tranh khong
m=i.merge(h[["Project key","Competitor_Intensity"]],on="Project key",how="left")
g=m.groupby("Competitor_Intensity").agg(
    markup=("Markup_Pct","mean"), win=("Item_Win_Status","mean"), n=("Markup_Pct","size"))
O["phan_ung_canh_tranh"]=g.round(4).to_dict("index")
O["bien_do_markup_giua_3_muc"]=float(g["markup"].max()-g["markup"].min())

# muc do phan tan cua quyet dinh gia
O["markup"]={"mean":float(i["Markup_Pct"].mean()),"sd":float(i["Markup_Pct"].std()),
    "cv":float(i["Markup_Pct"].std()/i["Markup_Pct"].mean()),
    "p5":float(i["Markup_Pct"].quantile(.05)),"p95":float(i["Markup_Pct"].quantile(.95))}

# tan suat quyet dinh
O["tan_suat"]={"quyet_dinh_gia_moi_thang":float(len(i)/(span/30.4)),
    "quyet_dinh_gia_moi_ngay_lam_viec":float(len(i)/(span*5/7))}

# mo ta bo du lieu va cac truong lien ket CRM/Sourcing (Bang 3.1, Muc 3.1.3, Bang B.3, Muc 4.3.2)
ct=pd.crosstab(h.Competitor_Intensity,h.Effective_Competitors_N)
r=i.Market_Reserve_Bound/i.Avg_PFEP
O["du_lieu"]={"head_shape":list(h.drop(columns=["dt"]).shape),"item_shape":list(i.drop(columns=["gia_tri"]).shape),
  "EffN_mean":float(h.Effective_Competitors_N.mean()),
  "EffN_by_intensity":{lv:{str(c):int(ct.loc[lv,c]) for c in ct.columns} for lv in ["Low","Med","High"]},
  "Urgency_values":{f"{k:.2f}":int(v) for k,v in h.Urgency_SLA_Sensitivity.value_counts().sort_index().items()},
  "Urgency_mean":float(h.Urgency_SLA_Sensitivity.mean()),
  "MRB_min":float(i.Market_Reserve_Bound.min()),"MRB_max":float(i.Market_Reserve_Bound.max()),
  "MRB_ratio_c_mean":float(r.mean()),"MRB_ratio_c_cv":float(r.std()/r.mean()),
  "MRB_n_below_offer":int((i.Market_Reserve_Bound<i.Offered_Price).sum())}
json.dump(O,open("ch1_stats.json","w"),indent=2)
for k,v in O.items():
    print(f"\n[{k}]")
    if isinstance(v,dict):
        for a,b in v.items(): print(f"  {a}: {round(b,4) if isinstance(b,(int,float)) else b}")
    else: print(" ",v)
