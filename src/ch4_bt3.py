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
for nm,fn in [("Nash A + Cap",nash_A),("Nash B + Cap",nash_B)]:
    pb=fn(c+lamQ,Nh); mkc=clip_mk(pb/c)
    pol[nm+" (kẹp)"]={"profit":float(Eprofit(c*mkc)),"Pwin":float(Pwin(c*mkc).mean()),"clip":clip_rate(pb/c)}
base_p=pol["Thực tế (thực nhận)"]["profit"]
for k,v in pol.items(): v["uplift_pct"]=float((v["profit"]/base_p-1)*100)
OUT["policies"]=pol
OUT["placebo"]={"cap_uplift":pol["CBPO + Capacity λ(Q)"]["uplift_pct"],"placebo_uplift":pol["Giả dược — λ hằng số"]["uplift_pct"],
   "dong_gop_dieu_tiet_pp":pol["CBPO + Capacity λ(Q)"]["uplift_pct"]-pol["Giả dược — λ hằng số"]["uplift_pct"]}

# 7. kiem dinh H1: log(markup) ~ log(N)
full=s.copy(); full["N"]=full.CompInt.map(N_hyb)
Xh=sm.add_constant(np.log(full.N.astype(float))); yh=np.log(full.Markup_Pct.astype(float))
mh=sm.OLS(yh,Xh).fit(cov_type="cluster",cov_kwds={"groups":full["Project key"].astype("category").cat.codes})
b,se=mh.params.iloc[1],mh.bse.iloc[1]
OUT["H1_test"]={"slope":float(b),"SE_cluster":float(se),"CI":[float(b-1.96*se),float(b+1.96*se)],
   "t_vs_minus1":float((b+1)/se),"p_vs_minus1":float(2*(1-stats.norm.cdf(abs((b+1)/se)))),
   "t_vs_0":float(b/se),"p_vs_0":float(2*(1-stats.norm.cdf(abs(b/se)))),"n":int(len(full)),
   "BNE_du_doan_giam_pct":float((1-(N_hyb[3]/N_hyb[1])**-1)*100)}

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
OUT["ab_design"]=ab

json.dump(OUT,open("ch4_bt3.json","w"),indent=2)

# ── HINH ──
# FIG 4.5 policies
names=["Thực tế (thực nhận)","Cost-Plus (markup trung vị)","CBPO Realistic (kẹp P5–P95)","Nash A — miền tuyệt đối (kẹp)",
       "Nash B — miền tỷ lệ (kẹp)","CBPO + Capacity λ(Q)","Giả dược — λ hằng số"]
short=["Thực tế","Cost-Plus","CBPO","Nash A","Nash B","CBPO+Cap","Giả dược"]
up=[pol[n]["uplift_pct"] for n in names]; cl=[pol[n]["clip"] for n in names]
cols=[MUTE,BODY,GREEN,RED,DRED,BLUE,CYAN]
fig,ax=plt.subplots(1,2,figsize=(11.5,4.3))
bars=ax[0].bar(short,up,color=cols,alpha=.88)
for b_,v,cr in zip(bars,up,cl):
    xx=b_.get_x()+b_.get_width()/2
    ax[0].text(xx,v+(1.0 if v>=0 else -2.6),f"{v:+.1f}%".replace(".",","),ha="center",fontsize=8.5,color=INK)
    if cr>0.5: ax[0].text(xx,v+(4.2 if v>=0 else -5.6),f"kẹp {cr*100:.0f}%",ha="center",fontsize=7.5,color=DRED,fontweight="bold")
ax[0].set_ylim(-36,22)
ax[0].axhline(0,color=INK,lw=1); ax[0].set_ylabel("Uplift so với thực nhận (%)"); ax[0].set_title("(A) Lợi nhuận kỳ vọng theo chính sách")
ax[0].tick_params(axis="x",labelsize=8.5)
pw=[pol[n]["Pwin"] for n in names]
ax[1].bar(short,pw,color=cols,alpha=.88); ax[1].axhline(pol[names[0]]["Pwin"],color=RED,ls="--",lw=1.2,label="Tỷ lệ thắng thực tế")
ax[1].set_ylabel("Xác suất thắng trung bình"); ax[1].set_ylim(0,.85); ax[1].legend(fontsize=8); ax[1].tick_params(axis="x",labelsize=8.5)
ax[1].set_title("(B) Đánh đổi: uplift đi kèm giảm tỷ lệ thắng")
plt.tight_layout(); plt.savefig("FIG_4_5_Policies.png"); plt.close()

# FIG 4.6 H1 test + placebo
fig,ax=plt.subplots(1,2,figsize=(11.5,4.3))
gm=full.groupby("N")["Markup_Pct"].agg(["median","mean"]).reset_index()
ax[0].plot(gm.N,gm["median"],"o-",color=RED,lw=2,ms=7,label="Markup trung vị quan sát")
Nl=np.linspace(gm.N.min(),gm.N.max(),50); ax[0].plot(Nl,gm["median"].iloc[0]*(gm.N.iloc[0]/Nl),"--",color=BLUE,lw=1.6,label="Dự đoán BNE (∝ 1/N)")
ax[0].set_xlabel("Số đối thủ hiệu dụng N (hiệu chỉnh lai)"); ax[0].set_ylabel("Hệ số markup"); ax[0].legend(fontsize=8.5)
ax[0].set_title(f"(A) Kiểm định H1 — độ dốc {b:+.4f} so với −1".replace(".",","))
lab2=["CBPO\n(không λ)","CBPO + Cap\nλ(Q) động","Giả dược\nλ hằng số"]
v2=[pol["CBPO Realistic (kẹp P5–P95)"]["uplift_pct"],pol["CBPO + Capacity λ(Q)"]["uplift_pct"],pol["Giả dược — λ hằng số"]["uplift_pct"]]
bars=ax[1].bar(lab2,v2,color=[GREEN,BLUE,CYAN],alpha=.88)
for b_,v in zip(bars,v2): ax[1].text(b_.get_x()+b_.get_width()/2,v+.4,f"{v:+.2f}%".replace(".",","),ha="center",fontsize=9,color=INK)
ax[1].set_ylabel("Uplift (%)"); ax[1].set_title(f"(B) Giả dược — điều tiết theo Q đóng góp {OUT['placebo']['dong_gop_dieu_tiet_pp']:+.2f} pp".replace(".",","))
plt.tight_layout(); plt.savefig("FIG_4_6_H1_Placebo.png"); plt.close()

# FIG 4.7 do nhay
fig,ax=plt.subplots(1,2,figsize=(11.5,4.3))
ns=pd.DataFrame(sens["N_scale"]); ax[0].plot(ns.N_low,ns.uplift,"o-",color=RED,lw=2,ms=6)
ax[0].axhline(0,color=INK,lw=1); ax[0].axhline(pol["CBPO Realistic (kẹp P5–P95)"]["uplift_pct"],color=GREEN,ls="--",lw=1.4,label="CBPO (không phụ thuộc N)")
ax[0].set_xlabel("N tại tầng cạnh tranh thấp"); ax[0].set_ylabel("Uplift Nash A (%)"); ax[0].legend(fontsize=8.5)
ax[0].set_title("(A) Độ nhạy theo số đối thủ hiệu dụng")
ps=pd.DataFrame(sens["pi_SLA"]); ax[1].plot(ps.pi_mult,ps.cap_uplift,"o-",color=BLUE,lw=2,ms=6,label="CBPO + Cap λ(Q)")
ax[1].plot(ps.pi_mult,ps.placebo_uplift,"s--",color=CYAN,lw=1.6,ms=5,label="Giả dược")
ax[1].set_xscale("log"); ax[1].set_xlabel("π_SLA (bội số biên lợi nhuận trung bình)"); ax[1].set_ylabel("Uplift (%)"); ax[1].legend(fontsize=8.5)
ax[1].set_title("(B) Độ nhạy theo chi phí vi phạm SLA — hai đường trùng nhau")
plt.tight_layout(); plt.savefig("FIG_4_7_Sensitivity.png"); plt.close()

print("HIEU CHUAN:",{k:round(v,2) for k,v in OUT["hieu_chuan_tong_hop"].items()})
print("DAI MARKUP:",{k:round(v,4) if isinstance(v,float) else v for k,v in OUT["dai_markup"].items()})
print("\nCHINH SACH:")
for k,v in pol.items(): print("  %-34s profit %9.1f  uplift %+6.2f%%  Pwin %.3f  clip %.3f" % (k,v["profit"],v["uplift_pct"],v["Pwin"],v["clip"]))
print("\nN:",OUT["N_calib"]); print("delta_B:",round(delta,4))
print("lambda:",OUT["lambda"]); print("placebo:",OUT["placebo"])
print("H1:",{k:(round(v,4) if isinstance(v,float) else v) for k,v in OUT["H1_test"].items()})
print("sens N:",[(r["N_low"],round(r["uplift"],1),round(r["clip"],2)) for r in sens["N_scale"]])
print("sens F:",sens["F_family"]); print("sens pi:",[(r["pi_mult"],round(r["cap_uplift"],2),round(r["placebo_uplift"],2)) for r in sens["pi_SLA"]])
print("A/B:",{k:(round(v,4) if isinstance(v,float) else {kk:round(vv,1) for kk,vv in v.items()}) for k,v in ab.items()})
