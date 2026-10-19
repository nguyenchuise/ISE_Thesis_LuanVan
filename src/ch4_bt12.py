# -*- coding: utf-8 -*-
"""Chuong 4 — BT1 (hinh) va BT2 (mo hinh logistic day du, TAT du bao OOF lam bien)."""
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt, matplotlib as mpl
import statsmodels.api as sm
from scipy import stats
from sklearn.model_selection import KFold, GroupShuffleSplit
from sklearn.metrics import roc_auc_score, brier_score_loss, roc_curve
from sklearn.calibration import calibration_curve
from xgboost import XGBClassifier

RED,DRED,BLUE,CYAN,GREEN,YELLOW="#CC0000","#90112C","#004774","#0093DD","#008448","#FDC300"
INK,BODY,MUTE,BORDER="#262626","#4D4D4D","#737373","#BFBFBF"
mpl.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.titleweight":"bold",
 "axes.titlesize":11,"axes.labelcolor":BODY,"axes.edgecolor":BORDER,"xtick.color":MUTE,
 "ytick.color":MUTE,"axes.spines.top":False,"axes.spines.right":False,"savefig.dpi":300,
 "savefig.bbox":"tight","figure.facecolor":"#FFFFFF","axes.grid":True,"grid.color":"#EDEDED"})
RS=42; rng=np.random.default_rng(RS); OUT={}
h=pd.read_csv("HeadView_Workload.csv"); it=pd.read_csv("ItemView_Workload.csv")
ST=["Sales_Days","WBS_Days","SC_Days","Pricing_Days"]; SN=["Sales","WBS","SC","Pricing"]
PRED=["Required_Approval_Levels","Drawing_Clarification_Flags","Pricing_Queue_Depth",
      "Assigned_Engineer_Experience","Recent_Throughput_Rate"]
b1=json.load(open("bt1_pertask.json")); b1m=json.load(open("bt1_models.json"))

# ═════════ BT1 — HINH ═════════
# FIG 4.1: boxplot theo khau + CV
fig,ax=plt.subplots(1,2,figsize=(11,4.2))
bp=ax[0].boxplot([h[s] for s in ST],labels=SN,patch_artist=True,widths=.55,
   medianprops=dict(color=INK,lw=1.6),flierprops=dict(marker=".",ms=3,alpha=.35,color=MUTE))
for b,c in zip(bp["boxes"],[CYAN,BLUE,GREEN,RED]): b.set(facecolor=c,alpha=.55,edgecolor=c)
ax[0].set_ylabel("Ngày"); ax[0].set_title("(A) Phân phối thời gian xử lý từng khâu")
eda=pd.DataFrame(b1["eda"]); cv=eda["CV"].values
bars=ax[1].bar(SN,cv,color=[CYAN,BLUE,GREEN,RED],alpha=.85)
for b,v in zip(bars,cv): ax[1].text(b.get_x()+b.get_width()/2,v+.012,f"{v:.3f}".replace(".",","),ha="center",fontsize=9,color=INK)
ax[1].set_ylabel("Hệ số biến thiên (SD / Mean)"); ax[1].set_ylim(0,.9)
ax[1].set_title("(B) Biến động tương đối — Sales cao nhất")
plt.tight_layout(); plt.savefig("FIG_4_1_Stage_Variation.png"); plt.close()

# FIG 4.2: phan du thang goc vs log
X=sm.add_constant(h[PRED].fillna(0).astype(float)); y=h["Turnaround time"].astype(float)
m_raw=sm.OLS(y,X).fit(); m_log=sm.OLS(np.log(y.clip(lower=.1)),X).fit()
fig,ax=plt.subplots(1,2,figsize=(11,4.2))
bp_raw=sm.stats.diagnostic.het_breuschpagan(m_raw.resid,X.values)[1]; bp_log=sm.stats.diagnostic.het_breuschpagan(m_log.resid,X.values)[1]
fmt_p=lambda q:("< 0,001" if q<1e-3 else ("= "+f"{q:.3f}".replace(".",",")))
for a,(m,t,c) in zip(ax,[(m_raw,f"(A) Thang đo gốc — BP p {fmt_p(bp_raw)}"+(", phương sai đều" if bp_raw>.05 else ""),BLUE),
                          (m_log,f"(B) Sau log-transform — BP p {fmt_p(bp_log)}"+(", phương sai THAY ĐỔI" if bp_log<.05 else ""),RED)]):
    a.scatter(m.fittedvalues,m.resid,s=7,alpha=.35,color=c)
    a.axhline(0,color=INK,lw=1); a.set_xlabel("Giá trị dự báo"); a.set_ylabel("Phần dư"); a.set_title(t,fontsize=10)
plt.tight_layout(); plt.savefig("FIG_4_2_Residuals.png"); plt.close()

# FIG 4.3: tuong quan + phan ra phuong sai
fig,ax=plt.subplots(1,2,figsize=(11,4.2))
cm=h[ST].corr().values
im=ax[0].imshow(cm,cmap="RdBu_r",vmin=-1,vmax=1)
ax[0].set_xticks(range(4)); ax[0].set_yticks(range(4)); ax[0].set_xticklabels(SN); ax[0].set_yticklabels(SN); ax[0].grid(False)
for i in range(4):
    for j in range(4): ax[0].text(j,i,f"{cm[i,j]:.3f}".replace(".",","),ha="center",va="center",fontsize=9,
        color="white" if abs(cm[i,j])>.5 else INK)
ax[0].set_title("(A) Tương quan thời gian giữa các khâu")
dg=b1["phan_ra_phuong_sai"]["dong_gop_%"]; parts=[dg[s] for s in SN]+[b1["phan_ra_phuong_sai"]["hiep_phuong_sai_%"]]
lab=SN+["Hiệp phương sai"]; cols=[CYAN,BLUE,GREEN,RED,YELLOW]
bars=ax[1].barh(lab,parts,color=cols,alpha=.85)
for b,v in zip(bars,parts): ax[1].text(v+.6,b.get_y()+b.get_height()/2,f"{v:.1f}%".replace(".",","),va="center",fontsize=9)
ax[1].set_xlabel("% phương sai của TAT tổng"); ax[1].set_xlim(0,58); ax[1].invert_yaxis()
ax[1].set_title("(B) Phân rã phương sai — hiệp phương sai chiếm gần một nửa")
plt.tight_layout(); plt.savefig("FIG_4_3_Corr_Decomp.png"); plt.close()
print("BT1 figures OK")

# ═════════ BT2 ═════════
# TAT du bao OOF tu BT1 (5-fold) -> tranh ro ri
oof=np.zeros(len(h)); kf=KFold(5,shuffle=True,random_state=RS)
for tr,te in kf.split(X):
    oof[te]=sm.OLS(y.iloc[tr],X.iloc[tr]).fit().predict(X.iloc[te])
h["TAT_pred"]=oof
OUT["bt1_oof"]={"MAE":float(np.mean(np.abs(y-oof))),"R2_oof":float(1-((y-oof)**2).sum()/((y-y.mean())**2).sum())}

# Trang thai don hang truoc buoc doi soat cuoi ky — chi dung cho kiem tra do vung cua BT2 (Muc 4.2.1, 5.5.1)
pre=pd.read_csv("ItemView_TrangThaiTruocDoiSoat.csv")
assert (pre["Project key"].values==it["Project key"].values).all() and (pre["Material"].values==it["Material"].values).all()
it["Win_pre"]=pre["Item_Win_Status_TruocDoiSoat"].values
d=it.merge(h[["Project key","Is_Strategic","Is_Existing_Customer","Competitor_Intensity",
   "Payment_Term_Risk","Pricing_Queue_Depth","Assigned_Engineer_Experience","Customer_Class","TAT_pred",
   "Effective_Competitors_N","Urgency_SLA_Sensitivity","Turnaround time"]],
   on="Project key",how="left")
d["CompInt"]=d["Competitor_Intensity"].map({"Low":1,"Med":2,"High":3})
d["PayRisk"]=d["Payment_Term_Risk"].map({"Net30":1,"Net60":2,"Net90":3})
d["CustClass"]=d["Customer_Class"].map({"L1":1,"L2":2,"L3":3,"M1":4,"M2":5})
FE=["Price_Competitiveness","Supplier_SQE_Score","ATP_Stock_Available","Has_PPAP_Cert","Local_Supplier",
    "Is_Strategic","Is_Existing_Customer","CustClass","CompInt","PayRisk",
    "Pricing_Queue_Depth","Assigned_Engineer_Experience","TAT_pred"]
GRP={"Giá":["Price_Competitiveness"],"Năng lực NCC":["Supplier_SQE_Score","ATP_Stock_Available","Has_PPAP_Cert","Local_Supplier"],
     "Quan hệ KH":["Is_Strategic","Is_Existing_Customer","CustClass"],"Cạnh tranh":["CompInt"],
     "Rủi ro TM":["PayRisk"],"Năng lực xử lý":["Pricing_Queue_Depth","Assigned_Engineer_Experience","TAT_pred"]}
EXTRA=["Avg_PFEP","Offered_Price","Target_Price","Markup_Pct","Material_Cat","Order Quantity",
       "Market_Reserve_Bound","Effective_Competitors_N","Urgency_SLA_Sensitivity","Turnaround time","Win_pre"]
s=d[FE+["Item_Win_Status","Project key"]+EXTRA].dropna().reset_index(drop=True)
OUT["bt2_n"]={"items":int(len(s)),"projects":int(s["Project key"].nunique()),"win_rate":float(s.Item_Win_Status.mean())}
Xl=sm.add_constant(s[FE].astype(float)); yl=s["Item_Win_Status"].astype(int); g=s["Project key"].astype(str)
tr,te=next(GroupShuffleSplit(1,test_size=.2,random_state=RS).split(Xl,yl,g))
OUT["bt2_split"]={"train_items":int(len(tr)),"test_items":int(len(te)),
   "test_projects":int(s.iloc[te]["Project key"].nunique())}

# chuan hoa Z de he so so sanh duoc (fit tren train)
mu_=s[FE].iloc[tr].mean(); sd_=s[FE].iloc[tr].std().replace(0,1)
Z=(s[FE]-mu_)/sd_; Zc=sm.add_constant(Z.astype(float))
ml=sm.Logit(yl.iloc[tr],Zc.iloc[tr]).fit(disp=0)
coef=pd.DataFrame({"bien":FE,"beta_z":ml.params[FE].values,"SE":ml.bse[FE].values,
   "z":ml.tvalues[FE].values,"p":ml.pvalues[FE].values,"OR_z":np.exp(ml.params[FE].values)})
coef["nhom"]=[next(gk for gk,gv in GRP.items() if f in gv) for f in FE]
OUT["bt2_coef"]=coef.round(5).to_dict("records")

# chi so
def pseudo(m,ym,Xm):
    m0=sm.Logit(ym,np.ones((len(ym),1))).fit(disp=0); k=Xm.shape[1]-1; n=len(ym)
    ll,ll0=m.llf,m0.llf; cs=1-np.exp(2*(ll0-ll)/n)
    return {"McFadden":1-ll/ll0,"McFadden_adj":1-(ll-k)/ll0,"CoxSnell":cs,"Nagelkerke":cs/(1-np.exp(2*ll0/n)),
            "AIC":m.aic,"BIC":m.bic,"LogLik":ll,"k":k}
ptr=ml.predict(Zc.iloc[tr]); pte=ml.predict(Zc.iloc[te])
OUT["bt2_metrics"]={**{k:float(v) for k,v in pseudo(ml,yl.iloc[tr],Zc.iloc[tr]).items()},
   "AUC_train":float(roc_auc_score(yl.iloc[tr],ptr)),"Brier_train":float(brier_score_loss(yl.iloc[tr],ptr)),
   "AUC_test":float(roc_auc_score(yl.iloc[te],pte)),"Brier_test":float(brier_score_loss(yl.iloc[te],pte))}

# bootstrap CI cho AUC test
aucs=[]; yt=yl.iloc[te].values; pt=pte.values
for _ in range(1000):
    ix=rng.integers(0,len(yt),len(yt))
    if len(np.unique(yt[ix]))<2: continue
    aucs.append(roc_auc_score(yt[ix],pt[ix]))
OUT["bt2_metrics"]["AUC_test_CI"]=[float(np.quantile(aucs,.025)),float(np.quantile(aucs,.975))]

# hieu chuan: tong hop + duong cong
OUT["bt2_calib"]={"expected_wins_test":float(pte.sum()),"actual_wins_test":int(yt.sum()),
   "deviation_pct":float((pte.sum()/yt.sum()-1)*100)}
fr,mp=calibration_curve(yt,pt,n_bins=10,strategy="quantile")
fig,ax=plt.subplots(1,2,figsize=(11,4.2))
ax[0].plot([0,1],[0,1],"--",color=MUTE,lw=1); ax[0].plot(mp,fr,"o-",color=RED,lw=1.8,ms=5)
ax[0].set_xlabel("Xác suất dự báo (trung bình nhóm)"); ax[0].set_ylabel("Tỷ lệ thắng thực tế")
ax[0].set_title(f"(A) Đường cong hiệu chuẩn — Brier {OUT['bt2_metrics']['Brier_test']:.3f}".replace(".",","))
fpr,tpr,_=roc_curve(yt,pt); ax[1].plot(fpr,tpr,color=BLUE,lw=1.8); ax[1].plot([0,1],[0,1],"--",color=MUTE,lw=1)
ax[1].fill_between(fpr,tpr,alpha=.08,color=BLUE)
ax[1].set_xlabel("Tỷ lệ dương giả"); ax[1].set_ylabel("Tỷ lệ dương thật")
ax[1].set_title(f"(B) ROC ngoài mẫu — AUC {OUT['bt2_metrics']['AUC_test']:.4f}".replace(".",","))
plt.tight_layout(); plt.savefig("FIG_4_4_Calibration_ROC.png"); plt.close()

# ablation theo nhom
abl=[]
for gk,gv in GRP.items():
    keep=[f for f in FE if f not in gv]
    mm=sm.Logit(yl.iloc[tr],sm.add_constant(Z[keep].astype(float).iloc[tr])).fit(disp=0)
    pp=mm.predict(sm.add_constant(Z[keep].astype(float).iloc[te]))
    abl.append({"loai_nhom":gk,"AUC_test":float(roc_auc_score(yt,pp)),
                "delta_AUC":float(roc_auc_score(yt,pp)-OUT["bt2_metrics"]["AUC_test"])})
OUT["bt2_ablation"]=abl

# so sanh bien gia
for pv in ["Markup_Pct","Price_Competitiveness"]:
    FEv=[pv]+[f for f in FE if f!="Price_Competitiveness"]
    Zv=(s[FEv]-s[FEv].iloc[tr].mean())/s[FEv].iloc[tr].std().replace(0,1)
    mv=sm.Logit(yl.iloc[tr],sm.add_constant(Zv.astype(float).iloc[tr])).fit(disp=0)
    OUT.setdefault("bt2_price_var",{})[pv]={"beta_z":float(mv.params[pv]),"p":float(mv.pvalues[pv]),
        "AUC_test":float(roc_auc_score(yt,mv.predict(sm.add_constant(Zv.astype(float).iloc[te]))))}

# chuan so sanh XGBoost
xg=XGBClassifier(n_estimators=300,learning_rate=.05,max_depth=4,subsample=.8,colsample_bytree=.8,
   eval_metric="logloss",random_state=RS,verbosity=0)
xg.fit(s[FE].iloc[tr],yl.iloc[tr]); px=xg.predict_proba(s[FE].iloc[te])[:,1]
OUT["bt2_xgb"]={"AUC_test":float(roc_auc_score(yt,px)),"Brier_test":float(brier_score_loss(yt,px))}

# kiem tra do vung: cung dac ta, cung phan chia, trang thai don hang truoc doi soat cuoi ky
y0=s["Win_pre"].astype(int)
m0=sm.Logit(y0.iloc[tr],Zc.iloc[tr]).fit(disp=0)
chg=(y0!=yl).values
OUT["bt2_robust_status"]={"n_changed":int(chg.sum()),"pct_changed":float(chg.mean()*100),
   "Q_mean_changed":float(s.loc[chg,"Pricing_Queue_Depth"].mean()),"Q_mean_unchanged":float(s.loc[~chg,"Pricing_Queue_Depth"].mean()),
   "AUC_test_pre":float(roc_auc_score(y0.iloc[te],m0.predict(Zc.iloc[te]))),
   "coef_pre":{f:{"beta_z":float(m0.params[f]),"p":float(m0.pvalues[f])} for f in FE}}

# luu mo hinh + tap test cho BT3
s["p_hat"]=ml.predict(Zc); s["is_test"]=0; s.loc[te,"is_test"]=1
s.to_pickle("bt2_scored.pkl")
json.dump({"params":ml.params.to_dict(),"mu":mu_.to_dict(),"sd":sd_.to_dict(),"FE":FE,
           "cov":ml.cov_params().values.tolist(),"cov_names":list(ml.cov_params().index)},open("bt2_model.json","w"),indent=1)
json.dump(OUT,open("ch4_bt12.json","w"),indent=2)

print("\nBT1 OOF: MAE %.4f R2 %.4f" % (OUT["bt1_oof"]["MAE"],OUT["bt1_oof"]["R2_oof"]))
print("BT2 n:",OUT["bt2_n"],"| split:",OUT["bt2_split"])
print(coef[["nhom","bien","beta_z","p","OR_z"]].round(4).to_string(index=False))
print({k:round(v,4) if isinstance(v,float) else v for k,v in OUT["bt2_metrics"].items()})
print("calib:",OUT["bt2_calib"]); print("xgb:",OUT["bt2_xgb"])
print(pd.DataFrame(abl).round(4).to_string(index=False))
print("price var:",OUT["bt2_price_var"])
