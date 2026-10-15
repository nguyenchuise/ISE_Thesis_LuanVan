# -*- coding: utf-8 -*-
"""Chuong 4 — BT3: chinh sach gia, hieu chinh N, lambda(Q), gia duoc, kiem dinh H1, do nhay, A/B."""
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt, matplotlib as mpl
import statsmodels.api as sm
from scipy import stats
RED,DRED,BLUE,CYAN,GREEN,YELLOW="#CC0000","#90112C","#004774","#0093DD","#008448","#FDC300"
INK,BODY,MUTE,BORDER="#262626","#4D4D4D","#737373","#BFBFBF"
mpl.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.titleweight":"bold","axes.titlesize":11,
 "axes.labelcolor":BODY,"axes.edgecolor":BORDER,"xtick.color":MUTE,"ytick.color":MUTE,"axes.spines.top":False,
 "axes.spines.right":False,"savefig.dpi":300,"savefig.bbox":"tight","figure.facecolor":"#FFFFFF","axes.grid":True,"grid.color":"#EDEDED"})
RS=42; rng=np.random.default_rng(RS); OUT={}
s=pd.read_pickle("bt2_scored.pkl"); M=json.load(open("bt2_model.json"))
h=pd.read_csv("HeadView_Workload.csv")
FE=M["FE"]; par=M["params"]; mu=M["mu"]; sd=M["sd"]
tr=s[s.is_test==0]; te=s[s.is_test==1].reset_index(drop=True)

# ── P(Win | p) cho tung item test ──
base=np.full(len(te),par["const"])
for f in FE:
    if f!="Price_Competitiveness": base+=par[f]*((te[f].astype(float)-mu[f])/sd[f]).values
gPC=par["Price_Competitiveness"]/sd["Price_Competitiveness"]; oPC=mu["Price_Competitiveness"]
c=te["Avg_PFEP"].values.astype(float); T=te["Target_Price"].values.astype(float)
def Pwin(p): return 1/(1+np.exp(-(base+gPC*(T/p-oPC))))
def Eprofit(p): return ((p-c)*Pwin(p)).sum()
MK_P5,MK_P95=tr.Markup_Pct.quantile(.05),tr.Markup_Pct.quantile(.95); MK_MED=tr.Markup_Pct.median()
OUT["dai_markup"]={"P5":float(MK_P5),"P95":float(MK_P95),"median":float(MK_MED),"n_test":int(len(te)),
                   "n_test_proj":int(te["Project key"].nunique())}
def clip_mk(mk): return np.clip(mk,MK_P5,MK_P95)
def clip_rate(mk): return float(((mk<MK_P5)|(mk>MK_P95)).mean())

pol={}
# 1. thuc te
p_act=te.Offered_Price.values.astype(float)
real=((p_act-c)*te.Item_Win_Status.values).sum()
pol["Thực tế (thực nhận)"]={"profit":float(real),"Pwin":float(te.Item_Win_Status.mean()),"clip":0.0}
pol["Thực tế (kỳ vọng mô hình)"]={"profit":float(Eprofit(p_act)),"Pwin":float(Pwin(p_act).mean()),"clip":0.0}
OUT["hieu_chuan_tong_hop"]={"thuc_nhan":float(real),"ky_vong_tai_gia_lich_su":float(Eprofit(p_act)),
                            "lech_pct":float((Eprofit(p_act)/real-1)*100)}
# 2. cost-plus
p_cp=c*MK_MED; pol["Cost-Plus (markup trung vị)"]={"profit":float(Eprofit(p_cp)),"Pwin":float(Pwin(p_cp).mean()),"clip":0.0}
# 3. CBPO
grid=np.linspace(1.0,3.0,801)
EP=np.array([ (c*g-c)*Pwin(c*g) for g in grid ])          # (grid, n)
mk_free=grid[EP.argmax(axis=0)]
gr=grid[(grid>=MK_P5)&(grid<=MK_P95)]
EPc=np.array([ (c*g-c)*Pwin(c*g) for g in gr ]); mk_cbpo=gr[EPc.argmax(axis=0)]
pol["CBPO Realistic (kẹp P5–P95)"]={"profit":float(Eprofit(c*mk_cbpo)),"Pwin":float(Pwin(c*mk_cbpo).mean()),"clip":clip_rate(mk_free)}
pol["CBPO Optimistic (không kẹp)"]={"profit":float(Eprofit(c*mk_free)),"Pwin":float(Pwin(c*mk_free).mean()),"clip":0.0}
OUT["cbpo_free_markup_median"]=float(np.median(mk_free))

# 4. hieu chinh N — 4 phuong phap
wr=tr.groupby("CompInt")["Item_Win_Status"].mean(); mkm=tr.groupby("CompInt")["Markup_Pct"].median()
chigh_cat=tr.groupby("Material_Cat")["Avg_PFEP"].quantile(.99)
trc=tr.copy(); trc["ch"]=trc.Material_Cat.map(chigh_cat)
trc["N_mom"]=(trc.ch/trc.Avg_PFEP-1)/(trc.Markup_Pct-1)
N_mom=trc.groupby("CompInt")["N_mom"].median()
N_wr=1/wr; N_exp=pd.Series({1:2,2:4,3:6})
N_hyb=2.0*(N_wr/N_wr[1])
OUT["N_calib"]={"MoM":N_mom.round(3).to_dict(),"1/WinRate":N_wr.round(3).to_dict(),
                "ChuyenGia":N_exp.to_dict(),"Lai":N_hyb.round(3).to_dict(),
                "win_rate":wr.round(4).to_dict(),"markup_median":mkm.round(4).to_dict()}
Nh=te.CompInt.map(N_hyb).values.astype(float)

# 5. Nash A (tuyet doi) va B (ty le)
ch_A=te.Material_Cat.map(chigh_cat).values.astype(float)
def nash_A(cc,N): return cc+(ch_A-cc)/N
ratio=tr.Target_Price/tr.Avg_PFEP; delta=float(ratio.std()/ratio.mean()*np.sqrt(3))
OUT["delta_B"]=delta
def nash_B(cc,N): return cc+delta*cc/N
for nm,fn in [("Nash A — miền tuyệt đối",nash_A),("Nash B — miền tỷ lệ",nash_B)]:
    pb=fn(c,Nh); mk=pb/c; mkc=clip_mk(mk)
    pol[nm+" (kẹp)"]={"profit":float(Eprofit(c*mkc)),"Pwin":float(Pwin(c*mkc).mean()),"clip":clip_rate(mk),
                      "median_mk_unclipped":float(np.median(mk)),"median_mk_clipped":float(np.median(mkc))}

# 5b. Nash C — can tren cap dong hang (Market_Reserve_Bound) va so doi thu thuc te (Effective_Competitors_N)
MRB=te.Market_Reserve_Bound.values.astype(float); NE=te.Effective_Competitors_N.values.astype(float)
def nash_C(cc,N=None): return cc+(MRB-cc)/(NE if N is None else N)
pC=nash_C(c); mkC=pC/c; mkCc=clip_mk(mkC)
pol["Nash C — cận dòng hàng, N thực tế (kẹp)"]={"profit":float(Eprofit(c*mkCc)),"Pwin":float(Pwin(c*mkCc).mean()),"clip":clip_rate(mkC),
    "median_mk_unclipped":float(np.median(mkC)),"median_mk_clipped":float(np.median(mkCc)),
    "clip_above":float((mkC>MK_P95).mean()),"clip_below":float((mkC<MK_P5).mean())}
pol["Nash C — dạng đóng thuần (không kẹp)"]={"profit":float(Eprofit(pC)),"Pwin":float(Pwin(pC).mean()),"clip":0.0,
    "median_mk_unclipped":float(np.median(mkC))}
# lai: neo can bang + tinh chinh theo ham phan hoi logistic trong vung tin cay +-5% quanh neo, giu trong [P5;P95]
TRW=0.05; lo_=np.clip(mkC*(1-TRW),MK_P5,MK_P95); hi_=np.clip(mkC*(1+TRW),MK_P5,MK_P95)
gg=np.linspace(0,1,101)[:,None]; MKg=lo_[None,:]+gg*(hi_-lo_)[None,:]
EPg=(c[None,:]*MKg-c[None,:])/(1+np.exp(-(base[None,:]+gPC*(T[None,:]/(c[None,:]*MKg)-oPC))))
mkCh=MKg[EPg.argmax(axis=0),np.arange(len(c))]
pol["Nash C + phản hồi logistic (±5% quanh neo)"]={"profit":float(Eprofit(c*mkCh)),"Pwin":float(Pwin(c*mkCh).mean()),"clip":clip_rate(mkC),
    "median_mk":float(np.median(mkCh))}
OUT["nashC"]={"MRB_over_c_median_test":float(np.median(MRB/c)),"delta_C_median":float(np.median(MRB/c-1)),
   "N_values":{str(int(k)):int(v) for k,v in pd.Series(NE).value_counts().sort_index().items()},
   "mk_by_N":{str(int(k)):float(np.median(mkC[NE==k])) for k in sorted(set(NE))},
   "clip_by_N":{str(int(k)):float(((mkC[NE==k]<MK_P5)|(mkC[NE==k]>MK_P95)).mean()) for k in sorted(set(NE))},
   "trust_region":TRW}
# Nash A, B dung N thuc te (do nhay: that bai cua A/B khong do cach hieu chinh N)
for nm,fn in [("A",nash_A),("B",nash_B)]:
    pb=fn(c,NE); OUT.setdefault("nashAB_EffN",{})[nm]={"clip":clip_rate(pb/c),"median_mk":float(np.median(pb/c)),
        "uplift":float((Eprofit(c*clip_mk(pb/c))/((p_act-c)*te.Item_Win_Status.values).sum()-1)*100)}

# 6. lambda(Q)
h["breach"]=(h["Turnaround time"]>7).astype(int)
lg=sm.Logit(h.breach,sm.add_constant(h.Pricing_Queue_Depth.astype(float))).fit(disp=0)
a0,a1=lg.params["const"],lg.params["Pricing_Queue_Depth"]
OUT["logit_breach"]={"a0":float(a0),"a1":float(a1),"p":float(lg.pvalues["Pricing_Queue_Depth"]),"breach_rate":float(h.breach.mean())}
MARGIN=float((tr.Offered_Price-tr.Avg_PFEP).mean()); ITEMS_RFQ=float(len(s)/s["Project key"].nunique())
QCAP=30
def Pb(q): return 1/(1+np.exp(-(a0+a1*np.asarray(q,float))))
def lam_item(q,pi_mult=0.5):
    q=np.clip(np.asarray(q,float),0,QCAP); pi=pi_mult*MARGIN      # chan Q, KHONG chan P(Q+1)
    return pi*((q+1)*Pb(q+1)-q*Pb(q))/ITEMS_RFQ
Q=te.Pricing_Queue_Depth.values.astype(float)
OUT["lambda"]={"margin_item":MARGIN,"items_per_rfq":ITEMS_RFQ,
   "lam_item_Q":{str(q):float(lam_item(q)) for q in [0,10,20,30]},"lam_item_mean_test":float(lam_item(Q).mean())}

def cbpo_on(ceff):
    E=np.array([ (ceff*g-c)*Pwin(ceff*g) for g in gr ])       # loi nhuan tinh tren c THAT
    return ceff*gr[E.argmax(axis=0)]
lamQ=lam_item(Q); lam_bar=lamQ.mean()
p_cap=cbpo_on(c+lamQ); p_pla=cbpo_on(c+lam_bar)
pol["CBPO + Capacity λ(Q)"]={"profit":float(Eprofit(p_cap)),"Pwin":float(Pwin(p_cap).mean()),"clip":0.0}
pol["Giả dược — λ hằng số"]={"profit":float(Eprofit(p_pla)),"Pwin":float(Pwin(p_pla).mean()),"clip":0.0}
U=te.Urgency_SLA_Sensitivity.values.astype(float); lamQU=U*lamQ; lamU_bar=lamQU.mean()
p_capU=cbpo_on(c+lamQU); p_plaU=cbpo_on(c+lamU_bar)
pol["CBPO + Capacity λ(Q)·U (trọng số SLA)"]={"profit":float(Eprofit(p_capU)),"Pwin":float(Pwin(p_capU).mean()),"clip":0.0}
pol["Giả dược — λ hằng số (bản trọng số SLA)"]={"profit":float(Eprofit(p_plaU)),"Pwin":float(Pwin(p_plaU).mean()),"clip":0.0}
OUT["lambda"]["lamU_mean_test"]=float(lamU_bar); OUT["lambda"]["U_mean_test"]=float(U.mean())
# chi tieu hai chieu tren du lieu tinh: so vi pham SLA khong doi giua cac chinh sach (gia quyet dinh SAU khi ho so da vao hang doi)
br_te=(te.drop_duplicates("Project key")["Turnaround time"]>7)
OUT["static_breach"]={"n_rfq_test":int(len(br_te)),"breach_rate_test":float(br_te.mean()),
   "note":"Trong danh gia tinh mot ky, gia khong tac dong toi TAT nen ty le vi pham giong het nhau o moi chinh sach"}
for nm,fn in [("Nash A + Cap",nash_A),("Nash B + Cap",nash_B)]:
    pb=fn(c+lamQ,Nh); mkc=clip_mk(pb/c)
    pol[nm+" (kẹp)"]={"profit":float(Eprofit(c*mkc)),"Pwin":float(Pwin(c*mkc).mean()),"clip":clip_rate(pb/c)}
base_p=pol["Thực tế (thực nhận)"]["profit"]
for k,v in pol.items(): v["uplift_pct"]=float((v["profit"]/base_p-1)*100)
OUT["policies"]=pol
OUT["placebo"]={"cap_uplift":pol["CBPO + Capacity λ(Q)"]["uplift_pct"],"placebo_uplift":pol["Giả dược — λ hằng số"]["uplift_pct"],
   "dong_gop_dieu_tiet_pp":pol["CBPO + Capacity λ(Q)"]["uplift_pct"]-pol["Giả dược — λ hằng số"]["uplift_pct"]}
OUT["placebo"]["capU_uplift"]=pol["CBPO + Capacity λ(Q)·U (trọng số SLA)"]["uplift_pct"]
OUT["placebo"]["placeboU_uplift"]=pol["Giả dược — λ hằng số (bản trọng số SLA)"]["uplift_pct"]
OUT["placebo"]["dong_gop_dieu_tiet_U_pp"]=OUT["placebo"]["capU_uplift"]-OUT["placebo"]["placeboU_uplift"]

# 7. kiem dinh H1: log(markup) ~ log(N)
full=s.copy(); full["N"]=full.CompInt.map(N_hyb)
Xh=sm.add_constant(np.log(full.N.astype(float))); yh=np.log(full.Markup_Pct.astype(float))
mh=sm.OLS(yh,Xh).fit(cov_type="cluster",cov_kwds={"groups":full["Project key"].astype("category").cat.codes})
b,se=mh.params.iloc[1],mh.bse.iloc[1]
OUT["H1_test"]={"slope":float(b),"SE_cluster":float(se),"CI":[float(b-1.96*se),float(b+1.96*se)],
   "t_vs_minus1":float((b+1)/se),"p_vs_minus1":float(2*(1-stats.norm.cdf(abs((b+1)/se)))),
   "t_vs_0":float(b/se),"p_vs_0":float(2*(1-stats.norm.cdf(abs(b/se)))),"n":int(len(full)),
   "BNE_du_doan_giam_pct":float((1-(N_hyb[3]/N_hyb[1])**-1)*100)}

# 7b. H1 doi chieu hai mat voi N = Effective_Competitors_N (so doi thu thuc te)
cl=full["Project key"].astype("category").cat.codes
def loglog(yv,Nv):
    mm=sm.OLS(yv,sm.add_constant(np.log(Nv))).fit(cov_type="cluster",cov_kwds={"groups":cl})
    bb,ss=float(np.asarray(mm.params)[1]),float(np.asarray(mm.bse)[1])
    return {"slope":bb,"SE_cluster":ss,"CI":[bb-1.96*ss,bb+1.96*ss],"t_vs_0":bb/ss,"p_vs_0":float(2*(1-stats.norm.cdf(abs(bb/ss)))),
            "t_vs_minus1":(bb+1)/ss,"p_vs_minus1":float(2*(1-stats.norm.cdf(abs((bb+1)/ss)))),"R2":float(mm.rsquared),"n":int(len(yv))}
NEf=full.Effective_Competitors_N.astype(float).values; cf_=full.Avg_PFEP.values.astype(float); Tf=full.Target_Price.values.astype(float)
H1E={}
H1E["lich_su_lnMarkup"]=loglog(np.log(full.Markup_Pct.astype(float).values),NEf)
H1E["lich_su_lnMargin"]=loglog(np.log(full.Markup_Pct.astype(float).values-1),NEf)
# FOC: nghiem toi uu khong rang buoc tren toan bo 7.519 dong (cung mo hinh BT2)
bf=np.full(len(full),par["const"])
for f_ in FE:
    if f_!="Price_Competitiveness": bf+=par[f_]*((full[f_].astype(float)-mu[f_])/sd[f_]).values
gF=np.linspace(1.0005,3.0,1600)
best=np.zeros(len(full)); bestv=np.full(len(full),-np.inf)
for g_ in gF:
    v=(cf_*g_-cf_)/(1+np.exp(-(bf+gPC*(Tf/(cf_*g_)-oPC)))); up=v>bestv; best[up]=g_; bestv[up]=v[up]
OUT["foc_full"]={"median_mk":float(np.median(best)),"corner_hi":float((best>=gF[-1]-1e-9).mean()),"corner_lo":float((best<=gF[0]+1e-9).mean())}
H1E["FOC_lnMargin"]=loglog(np.log(best-1),NEf)
mkCf=(cf_+(full.Market_Reserve_Bound.values.astype(float)-cf_)/NEf)/cf_
H1E["NashC_lnMargin"]=loglog(np.log(mkCf-1),NEf)
# phan ra dong nhat thuc cho Nash C: ln(mkC-1) = ln(MRB/c-1) - ln N  => b = -1 + cov(ln delta, ln N)/var(ln N)
ld=np.log(full.Market_Reserve_Bound.values.astype(float)/cf_-1); lN=np.log(NEf)
H1E["NashC_identity"]={"cov_term":float(np.cov(ld,lN)[0,1]/np.var(lN,ddof=1)),"note":"do doc = -1 + cov(ln delta_i, ln N)/var(ln N) theo dinh nghia"}
H1E["median_by_N"]={str(int(k)):{"mk_obs":float(np.median(full.Markup_Pct.values[NEf==k])),"mk_foc":float(np.median(best[NEf==k])),
    "mk_nashC":float(np.median(mkCf[NEf==k])),"n":int((NEf==k).sum())} for k in sorted(set(NEf))}
OUT["H1_EffN"]=H1E

# 8. do nhay
sens={}
sens["N_scale"]=[]
for f in [0.5,0.75,1.0,1.5,2.0,2.5]:
    mk=clip_mk(nash_A(c,Nh*f)/c); sens["N_scale"].append({"factor":f,"N_low":float(N_hyb[1]*f),
        "uplift":float((Eprofit(c*mk)/base_p-1)*100),"clip":clip_rate(nash_A(c,Nh*f)/c)})
# ho phan phoi F: tam giac tren [P1,P99] mode=median, tinh beta so
def beta_tri(cc,N,lo,hi,mode):
    out=np.empty_like(cc)
    for i,(ci,l,u,m_) in enumerate(zip(cc,lo,hi,mode)):
        if ci>=u: out[i]=ci; continue
        x=np.linspace(ci,u,400)
        def F(v):
            v=np.clip(v,l,u)
            return np.where(v<m_,(v-l)**2/((u-l)*(m_-l)+1e-12),1-(u-v)**2/((u-l)*(u-m_)+1e-12))
        S=((1-F(x))/(1-F(np.array([ci]))+1e-12))**(N[i]-1)
        out[i]=ci+np.trapezoid(S,x)
    return out
lo_cat=tr.groupby("Material_Cat")["Avg_PFEP"].quantile(.01); md_cat=tr.groupby("Material_Cat")["Avg_PFEP"].median()
lo=te.Material_Cat.map(lo_cat).values.astype(float); md=te.Material_Cat.map(md_cat).values.astype(float)
p_tri=beta_tri(c,Nh,lo,ch_A,md); mk_tri=clip_mk(p_tri/c)
sens["F_family"]={"Uniform":pol["Nash A — miền tuyệt đối (kẹp)"]["uplift_pct"],
   "Triangular":float((Eprofit(c*mk_tri)/base_p-1)*100),"clip_tri":clip_rate(p_tri/c)}
sens["pi_SLA"]=[]
for pm in [0.25,0.5,1.0,2.0,5.3]:
    lq=lam_item(Q,pm); pc=cbpo_on(c+lq); pp=cbpo_on(c+lq.mean())
    sens["pi_SLA"].append({"pi_mult":pm,"cap_uplift":float((Eprofit(pc)/base_p-1)*100),
        "placebo_uplift":float((Eprofit(pp)/base_p-1)*100)})
sens["N_scale_C"]=[]
for f in [0.5,0.75,1.0,1.5,2.0]:
    mk=nash_C(c,NE*f)/c; sens["N_scale_C"].append({"factor":f,"uplift":float((Eprofit(c*clip_mk(mk))/base_p-1)*100),
        "uplift_free":float((Eprofit(c*mk)/base_p-1)*100),"clip":clip_rate(mk)})
sens["MRB_scale_C"]=[]
for f in [0.8,0.9,1.0,1.1,1.2]:
    pz=c+(c+(MRB-c)*f-c)/NE; mk=pz/c
    sens["MRB_scale_C"].append({"factor":f,"uplift":float((Eprofit(c*clip_mk(mk))/base_p-1)*100),"uplift_free":float((Eprofit(pz)/base_p-1)*100),"clip":clip_rate(mk)})
sens["pi_SLA_U"]=[]
for pm in [0.25,0.5,1.0,2.0,5.0]:
    lq=U*lam_item(Q,pm); pc=cbpo_on(c+lq); pp=cbpo_on(c+lq.mean())
    sens["pi_SLA_U"].append({"pi_mult":pm,"cap_uplift":float((Eprofit(pc)/base_p-1)*100),"placebo_uplift":float((Eprofit(pp)/base_p-1)*100)})
OUT["sensitivity"]=sens

# 9. thiet ke A/B: ICC, DEFF, MDE
s["profit_real"]=(s.Offered_Price-s.Avg_PFEP)*s.Item_Win_Status
gp=s.groupby("Project key")["profit_real"]; k_=gp.ngroups; n_=len(s); m_=n_/k_
msb=gp.mean().var(ddof=1)*m_; msw=((s.profit_real-gp.transform("mean"))**2).sum()/(n_-k_)
icc=(msb-msw)/(msb+(m_-1)*msw); deff=1+(m_-1)*icc
sig=s.profit_real.std(ddof=1); mu_p=s.profit_real.mean()
za,zb=1.96,0.84
def n_items(delta): return 2*((za+zb)*sig/delta)**2*deff
ab={"ICC":float(icc),"m_bar":float(m_),"DEFF":float(deff),"sigma_profit_item":float(sig),"mean_profit_item":float(mu_p),
    "proj_per_month":float(len(h)/(299/30.4))}
for lab,d_ in [("uplift_14pct",0.14*mu_p),("uplift_10pct",0.10*mu_p),("uplift_5pct",0.05*mu_p)]:
    ni=n_items(d_); ab[lab]={"n_items_per_arm":float(ni),"n_proj_per_arm":float(ni/m_),"months":float(2*ni/m_/ab["proj_per_month"])}
wr_=s.Item_Win_Status.mean()
gw=s.groupby("Project key")["Item_Win_Status"]; msbw=gw.mean().var(ddof=1)*m_
msww=((s.Item_Win_Status-gw.transform("mean"))**2).sum()/(n_-k_)
icc_w=(msbw-msww)/(msbw+(m_-1)*msww); deff_w=1+(m_-1)*icc_w
ab["ICC_win"]=float(icc_w); ab["DEFF_win"]=float(deff_w)
for pp_ in [0.03,0.05]:
    ni=2*((za+zb)**2)*wr_*(1-wr_)/pp_**2*deff_w
    ab[f"guard_wr_{int(pp_*100)}pp"]={"n_items_per_arm":float(ni),"n_proj_per_arm":float(ni/m_),"months":float(2*ni/m_/ab["proj_per_month"])}
# thiet ke 3 nhanh: doi chung (hien trang), CBPO/Nash C, gia duoc nang gia deu — hai so sanh voi doi chung, Bonferroni alpha/2
za3=stats.norm.ppf(1-0.05/4)
for lab,d_ in [("uplift_14pct",0.14*mu_p),("uplift_8pct",0.08*mu_p),("uplift_5pct",0.05*mu_p)]:
    ni=2*((za3+zb)*sig/d_)**2*deff
    ab.setdefault("three_arm",{})[lab]={"n_items_per_arm":float(ni),"n_proj_per_arm":float(ni/m_),"months":float(3*ni/m_/ab["proj_per_month"])}
for pp_ in [0.03,0.05]:
    ni=2*((za3+zb)**2)*wr_*(1-wr_)/pp_**2*deff_w
    ab["three_arm"][f"guard_wr_{int(pp_*100)}pp"]={"n_items_per_arm":float(ni),"n_proj_per_arm":float(ni/m_),"months":float(3*ni/m_/ab["proj_per_month"])}
OUT["ab_design"]=ab

json.dump(OUT,open("ch4_bt3.json","w"),indent=2)

# ── HINH ──
# FIG 4.5 policies
names=["Thực tế (thực nhận)","Cost-Plus (markup trung vị)","CBPO Realistic (kẹp P5–P95)","Nash A — miền tuyệt đối (kẹp)",
       "Nash B — miền tỷ lệ (kẹp)","Nash C — cận dòng hàng, N thực tế (kẹp)","CBPO + Capacity λ(Q)","Giả dược — λ hằng số"]
short=["Thực tế","Cost-Plus","CBPO","Nash A","Nash B","Nash C","CBPO+Cap","Giả dược"]
up=[pol[n]["uplift_pct"] for n in names]; cl=[pol[n]["clip"] for n in names]
cols=[MUTE,BODY,GREEN,RED,DRED,YELLOW,BLUE,CYAN]
fig,ax=plt.subplots(1,2,figsize=(12,4.4))
bars=ax[0].bar(short,up,color=cols,alpha=.88)
for b_,v,cr in zip(bars,up,cl):
    xx=b_.get_x()+b_.get_width()/2
    ax[0].text(xx,v+(1.0 if v>=0 else -2.6),f"{v:+.1f}%".replace(".",","),ha="center",fontsize=8.2,color=INK)
    if cr>0: ax[0].text(xx,v+(4.2 if v>=0 else -5.6),f"kẹp {cr*100:.0f}%",ha="center",fontsize=7.3,color=DRED if cr>.5 else BODY,fontweight="bold")
ax[0].set_ylim(min(up)-8,max(up)+9)
ax[0].axhline(0,color=INK,lw=1); ax[0].set_ylabel("Uplift so với thực nhận (%)"); ax[0].set_title("(A) Lợi nhuận kỳ vọng và tỷ lệ kẹp biên")
ax[0].tick_params(axis="x",labelsize=8)
pw=[pol[n]["Pwin"] for n in names]
ax[1].bar(short,pw,color=cols,alpha=.88); ax[1].axhline(pol[names[0]]["Pwin"],color=RED,ls="--",lw=1.2,label="Tỷ lệ thắng thực tế")
ax[1].set_ylabel("Xác suất thắng trung bình"); ax[1].set_ylim(0,.9); ax[1].legend(fontsize=8); ax[1].tick_params(axis="x",labelsize=8)
ax[1].set_title("(B) Đánh đổi giữa biên lợi nhuận và tỷ lệ thắng")
plt.tight_layout(); plt.savefig("FIG_4_5_Policies.png"); plt.close()

# FIG 4.6 H1 hai mat + placebo
fig,ax=plt.subplots(1,2,figsize=(12,4.4))
mb=H1E["median_by_N"]; Ns=np.array(sorted(int(k) for k in mb))
obs=np.array([mb[str(n)]["mk_obs"]-1 for n in Ns]); foc=np.array([mb[str(n)]["mk_foc"]-1 for n in Ns]); nc=np.array([mb[str(n)]["mk_nashC"]-1 for n in Ns])
ax[0].plot(Ns,obs,"o-",color=RED,lw=2,ms=7,label=f"Lịch sử: b = {H1E['lich_su_lnMargin']['slope']:+.3f}".replace(".",","))
ax[0].plot(Ns,foc,"s-",color=GREEN,lw=2,ms=6,label=f"Tối ưu FOC: b = {H1E['FOC_lnMargin']['slope']:+.3f}".replace(".",","))
ax[0].plot(Ns,nc,"^-",color=YELLOW,lw=2,ms=6,label=f"Nash C: b = {H1E['NashC_lnMargin']['slope']:+.3f}".replace(".",","))
ax[0].plot(Ns,nc[0]*Ns[0]/Ns,"--",color=BLUE,lw=1.4,label="Tham chiếu ∝ 1/N (b = −1)")
ax[0].set_xscale("log"); ax[0].set_yscale("log"); ax[0].set_xticks(Ns); ax[0].set_xticklabels([str(n) for n in Ns])
ax[0].set_xlabel("Số đối thủ thực tế N (thang log)"); ax[0].set_ylabel("Biên tương đối p/c − 1 (trung vị, thang log)"); ax[0].legend(fontsize=7.8)
ax[0].set_title("(A) Kiểm định H1 đối chiếu hai mặt")
lab2=["CBPO","CBPO+λ(Q)","Giả dược","CBPO+λ(Q)·U","Giả dược U"]
v2=[pol["CBPO Realistic (kẹp P5–P95)"]["uplift_pct"],pol["CBPO + Capacity λ(Q)"]["uplift_pct"],pol["Giả dược — λ hằng số"]["uplift_pct"],
    pol["CBPO + Capacity λ(Q)·U (trọng số SLA)"]["uplift_pct"],pol["Giả dược — λ hằng số (bản trọng số SLA)"]["uplift_pct"]]
bars=ax[1].bar(lab2,v2,color=[GREEN,BLUE,CYAN,DRED,"#E8A0A0"],alpha=.88)
for b_,v in zip(bars,v2): ax[1].text(b_.get_x()+b_.get_width()/2,v+.3,f"{v:+.2f}%".replace(".",","),ha="center",fontsize=8.5,color=INK)
ax[1].set_ylabel("Uplift (%)"); ax[1].tick_params(axis="x",labelsize=8.2); ax[1].set_ylim(0,max(v2)*1.18)
ax[1].set_title(f"(B) Giả dược tĩnh: λ(Q) {OUT['placebo']['dong_gop_dieu_tiet_pp']:+.2f} pp; λ(Q)·U {OUT['placebo']['dong_gop_dieu_tiet_U_pp']:+.2f} pp".replace(".",","),fontsize=10)
plt.tight_layout(); plt.savefig("FIG_4_6_H1_Placebo.png"); plt.close()

# FIG 4.7 do nhay
fig,ax=plt.subplots(1,2,figsize=(12,4.4))
ns=pd.DataFrame(sens["N_scale"]); ax[0].plot(ns.factor,ns.uplift,"o-",color=RED,lw=2,ms=6,label="Nash A (N lai × hệ số)")
nsc=pd.DataFrame(sens["N_scale_C"]); ax[0].plot(nsc.factor,nsc.uplift,"^-",color=YELLOW,lw=2,ms=6,label="Nash C kẹp (N thực tế × hệ số)")
ax[0].plot(nsc.factor,nsc.uplift_free,"^--",color="#B08800",lw=1.4,ms=5,label="Nash C không kẹp")
ax[0].axhline(0,color=INK,lw=1); ax[0].axhline(pol["CBPO Realistic (kẹp P5–P95)"]["uplift_pct"],color=GREEN,ls="--",lw=1.4,label="CBPO (không phụ thuộc N)")
ax[0].set_xlabel("Hệ số nhân lên số đối thủ N"); ax[0].set_ylabel("Uplift (%)"); ax[0].legend(fontsize=7.8)
ax[0].set_title("(A) Độ nhạy theo số đối thủ")
ps=pd.DataFrame(sens["pi_SLA"]); ax[1].plot(ps.pi_mult,ps.cap_uplift,"o-",color=BLUE,lw=2,ms=6,label="CBPO + λ(Q)")
ax[1].plot(ps.pi_mult,ps.placebo_uplift,"s--",color=CYAN,lw=1.6,ms=5,label="Giả dược")
pu=pd.DataFrame(sens["pi_SLA_U"]); ax[1].plot(pu.pi_mult,pu.cap_uplift,"o-",color=DRED,lw=2,ms=6,label="CBPO + λ(Q)·U")
ax[1].plot(pu.pi_mult,pu.placebo_uplift,"s--",color="#E8A0A0",lw=1.6,ms=5,label="Giả dược U")
ax[1].set_xscale("log"); ax[1].set_xlabel("π_SLA (bội số biên lợi nhuận trung bình)"); ax[1].set_ylabel("Uplift (%)"); ax[1].legend(fontsize=7.8)
ax[1].set_title("(B) Độ nhạy theo π_SLA — đánh giá tĩnh một kỳ")
plt.tight_layout(); plt.savefig("FIG_4_7_Sensitivity.png"); plt.close()

print("HIEU CHUAN:",{k:round(v,2) for k,v in OUT["hieu_chuan_tong_hop"].items()})
print("DAI MARKUP:",{k:round(v,4) if isinstance(v,float) else v for k,v in OUT["dai_markup"].items()})
print("\nCHINH SACH:")
for k,v in pol.items(): print("  %-34s profit %9.1f  uplift %+6.2f%%  Pwin %.3f  clip %.3f" % (k,v["profit"],v["uplift_pct"],v["Pwin"],v["clip"]))
print("\nN:",OUT["N_calib"]); print("delta_B:",round(delta,4))
print("lambda:",OUT["lambda"]); print("placebo:",OUT["placebo"])
print("H1:",{k:(round(v,4) if isinstance(v,float) else v) for k,v in OUT["H1_test"].items()})
for k_,v_ in H1E.items(): print("H1E",k_,{kk:(round(vv,4) if isinstance(vv,float) else vv) for kk,vv in v_.items()} if isinstance(v_,dict) else v_)
print("nashC:",OUT["nashC"]); print("nashAB_EffN:",OUT["nashAB_EffN"]); print("foc_full:",OUT["foc_full"])
print("sens N C:",sens["N_scale_C"]); print("sens MRB:",sens["MRB_scale_C"]); print("sens piU:",sens["pi_SLA_U"])
print("sens N:",[(r["N_low"],round(r["uplift"],1),round(r["clip"],2)) for r in sens["N_scale"]])
print("sens F:",sens["F_family"]); print("sens pi:",[(r["pi_mult"],round(r["cap_uplift"],2),round(r["placebo_uplift"],2)) for r in sens["pi_SLA"]])
print("A/B:",json.dumps(ab,indent=0)[:1500])
