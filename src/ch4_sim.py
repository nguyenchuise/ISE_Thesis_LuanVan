# -*- coding: utf-8 -*-
"""Muc 4.4 — Nghien cuu MO PHONG co kiem soat: hang doi Pricing + dinh gia lien ky tren 1.500 ho so thuc.
Mo phong phan thuc NEO vao quan sat: ho so giu nguyen thoi diem den, thoi gian Sales/WBS/SC; chi thoi gian CHO
tai Pricing thay doi theo co che dieu phoi. Chenh lech (DeltaW) so voi FIFO duoc cong vao TAT va do sau hang doi
QUAN SAT, nen kich ban hien trang tai lap dung du lieu (37,67% vi pham). Day la MO PHONG, khong phai bang chung nhan qua."""
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json, heapq
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt, matplotlib as mpl
import statsmodels.api as sm
from scipy import stats
RED,DRED,BLUE,CYAN,GREEN,YELLOW="#CC0000","#90112C","#004774","#0093DD","#008448","#FDC300"
INK,BODY,MUTE,BORDER="#262626","#4D4D4D","#737373","#BFBFBF"
mpl.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.titleweight":"bold","axes.titlesize":11,
 "axes.labelcolor":BODY,"axes.edgecolor":BORDER,"xtick.color":MUTE,"ytick.color":MUTE,"axes.spines.top":False,
 "axes.spines.right":False,"savefig.dpi":300,"savefig.bbox":"tight","figure.facecolor":"#FFFFFF","axes.grid":True,"grid.color":"#EDEDED"})
RS=42; OUT={}
h=pd.read_csv("HeadView_Workload.csv"); s=pd.read_pickle("bt2_scored.pkl")
M=json.load(open("bt2_model.json")); B3=json.load(open("ch4_bt3.json"))
FE=M["FE"]; par=M["params"]; mu=M["mu"]; sd=M["sd"]
SLA=7.0; MARGIN=B3["lambda"]["margin_item"]; a0,a1=B3["logit_breach"]["a0"],B3["logit_breach"]["a1"]
MK_P5,MK_P95=B3["dai_markup"]["P5"],B3["dai_markup"]["P95"]
PRED=["Required_Approval_Levels","Drawing_Clarification_Flags","Pricing_Queue_Depth","Assigned_Engineer_Experience","Recent_Throughput_Rate"]

# ── 1. Du lieu cap ho so ──
h["arr"]=(pd.to_datetime(h["Created On_1"],format="%d-%m-%y")-pd.to_datetime(h["Created On_1"],format="%d-%m-%y").min()).dt.days.astype(float)
h["pre"]=h.Sales_Days+h.WBS_Days                                         # truoc Pricing
h["resid"]=h["Turnaround time"]-h[["Sales_Days","WBS_Days","SC_Days","Pricing_Days"]].sum(axis=1)
h["post"]=h.SC_Days+h.resid                                              # sau Pricing (gom phan du ghi nhan)
X=sm.add_constant(h[PRED].fillna(0).astype(float))
mP=sm.OLS(h.Pricing_Days,X).fit(); mS=sm.OLS(h.SC_Days,X).fit()
h["Pricing_hat"]=mP.predict(X); h["post_hat"]=mS.predict(X)+h.resid.median()   # chi dung thong tin luc tiep nhan
W_TARGET_C1=float(mP.params["Pricing_Queue_Depth"]*h.Pricing_Queue_Depth.mean())          # cho do hang doi Pricing
W_TARGET_C2=float(sm.OLS(h["Turnaround time"],X).fit().params["Pricing_Queue_Depth"]*h.Pricing_Queue_Depth.mean())  # tai toan chuoi
n=len(h); key=h["Project key"].values; U=h.Urgency_SLA_Sensitivity.values.astype(float)
TAT0=h["Turnaround time"].values.astype(float); Q0=h.Pricing_Queue_Depth.values.astype(float)

# ── 2. Du lieu cap dong hang + ham P(Win) tu BT2 ──
pidx=pd.Series(np.arange(n),index=key); s["j"]=s["Project key"].map(pidx).values
J=s.j.values.astype(int); c=s.Avg_PFEP.values.astype(float); T=s.Target_Price.values.astype(float); p_hist=s.Offered_Price.values.astype(float)
names=["const"]+FE; beta_hat=np.array([par[k] for k in names]); COV=np.array(M["cov"])
assert M["cov_names"]==names
Zfix={f:((s[f].astype(float)-mu[f])/sd[f]).values for f in FE}
iQ,iT,iP=names.index("Pricing_Queue_Depth"),names.index("TAT_pred"),names.index("Price_Competitiveness")
def base_parts(beta):
    b=np.full(len(s),beta[0])
    for k,f in enumerate(FE,1):
        if f not in ("Price_Competitiveness","Pricing_Queue_Depth","TAT_pred"): b+=beta[k]*Zfix[f]
    return b
GRID=np.linspace(MK_P5,MK_P95,96)
def evaluate(beta,dQ_rfq,dT_rfq,policy_price,lam_item=None,k_beta=1.0):
    """Tra ve (loi nhuan ky vong tung dong, gia). dQ,dT o cap ho so -> anh xa sang dong hang."""
    bQ,bT,bP=beta[iQ]*k_beta,beta[iT]*k_beta,beta[iP]
    Qd=np.maximum(s.Pricing_Queue_Depth.values+dQ_rfq[J],0); Td=s.TAT_pred.values+dT_rfq[J]
    eta0=base_parts(beta)+bQ*(Qd-mu["Pricing_Queue_Depth"])/sd["Pricing_Queue_Depth"]+bT*(Td-mu["TAT_pred"])/sd["TAT_pred"]
    g=bP/sd["Price_Competitiveness"]; o=mu["Price_Competitiveness"]
    if policy_price=="hist": p=p_hist
    else:
        ceff=c if lam_item is None else c+lam_item
        P=1/(1+np.exp(-(eta0[None,:]+g*(T[None,:]/(ceff[None,:]*GRID[:,None])-o))))
        E=(ceff[None,:]*GRID[:,None]-c[None,:])*P                       # loi nhuan tinh tren c THAT
        p=ceff*GRID[E.argmax(axis=0)]
    Pw=1/(1+np.exp(-(eta0+g*(T/p-o))))
    return (p-c)*Pw, p

# ── 3. Mo hinh hang doi Pricing nhieu may, khong uu tien ngat (non-preemptive) ──
def Pb(q): return 1/(1+np.exp(-(a0+a1*np.clip(q,0,30))))
def Delta(q): q=np.clip(q,0,30); return (q+1)*Pb(q+1)-q*Pb(q)
def simulate(entry,work,m,rule="FIFO",V=None,due=None,what=None,pi_rfq=None,wbar=None,rr=None):
    """entry: thoi diem vao hang doi Pricing; work: thoi gian phuc vu. Tra ve thoi gian cho W va do sau Q luc vao."""
    order=np.argsort(entry,kind="stable"); W=np.zeros(n); Qin=np.zeros(n); lane=np.zeros(n,int)
    free=[0.0]*m; heapq.heapify(free)
    if rule=="FIFO":
        busy_until=[]                                            # de dem Q luc vao
        for j in order:
            t0=heapq.heappop(free); st=max(t0,entry[j]); W[j]=st-entry[j]; heapq.heappush(free,st+work[j])
        # Q luc vao = so ho so con trong he thong (dang cho + dang phuc vu)
        start=entry+W; fin=start+work; e_sorted=np.sort(entry); f_sorted=np.sort(fin)
        Qin=np.searchsorted(e_sorted,entry,side="left")-np.searchsorted(f_sorted,entry,side="right")
        return W,Qin.astype(float),lane
    # Hai bien the phan luong (deu khong ngat, quyet dinh tai thoi diem ho so vao hang doi Pricing sau Sales-WBS):
    #  G1 — nguong gia bong thuan (Talluri & van Ryzin, 2004) dung lam quy tac HOAN: lan nhanh neu con cuu duoc SLA
    #       va gia tri V_j >= gia bong cua suat xu ly; lan nhanh xep theo han chot (EDD), lan chuan FIFO.
    #  G2 — chi so uu tien chi phi tre (quy tac c-mu, Cox & Smith, 1961; dang ATC, Vepsalainen & Morton, 1987):
    #       I_j = [ lamU_j * Delta(Q_t) * exp(-slack_j / wbar) + r_j * wbar ] / what_j  voi ho so con cuu duoc;
    #       ho so khong con cuu duoc chi giu thanh phan xoi mon loi nhuan r_j va xep sau toan bo lan nhanh.
    i=0; t=0.0; L1=[]; L2=[]; WAIT=[]; insys=0; fin_heap=[]; idle=m
    while i<n or L1 or L2 or WAIT:
        t_next_arr=entry[order[i]] if i<n else np.inf
        t_next_fin=fin_heap[0] if fin_heap else np.inf
        if t_next_arr<=t_next_fin:
            t=t_next_arr; j=order[i]; i+=1; Qin[j]=insys; insys+=1
            salv=(t+what[j]<=due[j])
            if rule=="G1":
                lam_rfq=pi_rfq[j]*Delta(insys-1)*(what[j]/wbar)
                if salv and V[j]>=lam_rfq: heapq.heappush(L1,(due[j],t,j)); lane[j]=1
                else: heapq.heappush(L2,(t,j)); lane[j]=2
            else:
                WAIT.append(j); lane[j]=1 if salv else 2
        else:
            t=heapq.heappop(fin_heap); idle+=1; insys-=1
        while idle>0 and (L1 or L2 or WAIT):
            jj=None
            if rule=="G1":
                while L1:
                    d_,_,cand=heapq.heappop(L1)
                    if t+what[cand]<=d_: jj=cand; break
                    heapq.heappush(L2,(entry[cand],cand)); lane[cand]=2   # khong con cuu duoc -> ha uu tien
                if jj is None and L2: _,jj=heapq.heappop(L2)
            else:
                w_=np.array(WAIT); sl=due[w_]-what[w_]-t; dq=Delta(insys)
                I=np.where(sl>=0, 1e6+(pi_rfq[w_]*dq*np.exp(-np.maximum(sl,0)/wbar)+rr[w_]*wbar)/what[w_], rr[w_]*wbar/what[w_])
                k_=int(np.argmax(I)); jj=int(w_[k_]); WAIT.pop(k_)
            if jj is None: break
            W[jj]=t-entry[jj]; heapq.heappush(fin_heap,t+work[jj]); idle-=1
    return W,Qin,lane

# ── 4. Hieu chinh he hang doi (m, kappa) de thoi gian cho trung binh FIFO khop muc tieu ──
def calib(w_target,seed=7):
    rng=np.random.default_rng(seed); jit=rng.uniform(0,1,n); eps=rng.lognormal(-0.02,0.2,n)
    entry=h.arr.values+jit+h.pre.values; best=None
    for m in range(6,16):
        for kap in np.linspace(0.3,0.98,69):
            work=kap*h.Pricing_Days.values*eps
            if work.sum()/(h.arr.max()+1)/m>0.995: continue
            W,Qin,_=simulate(entry,work,m)
            err=abs(W.mean()-w_target)/w_target
            if best is None or err<best[0]: best=(err,m,kap,W.mean(),Qin.mean())
    return {"m":best[1],"kappa":float(best[2]),"W_mean":float(best[3]),"Q_mean":float(best[4]),"rel_err":float(best[0]),"W_target":w_target}
CAL={"C1":calib(W_TARGET_C1),"C2":calib(W_TARGET_C2)}
OUT["calibration"]=CAL; print("calibration",CAL)

# gia tri ky vong moi ho so (dung de phan luong) — CBPO tai dac trung quan sat
ep0,_=evaluate(beta_hat,np.zeros(n),np.zeros(n),"cbpo")
Erfq=np.bincount(J,weights=ep0,minlength=n); has=np.bincount(J,minlength=n)>0
Erfq[~has]=np.median(Erfq[has]); V=U*Erfq
LAM_STATIC=float(np.mean(0.5*MARGIN*Delta(s.Pricing_Queue_Depth.values)/(len(s)/s["Project key"].nunique())))

POL=["P1 Hiện trạng (giá lịch sử + FIFO)","P2 CBPO + FIFO","P3 Giả dược λ̄ + FIFO",
     "P4 Đồng bộ: phân luồng G2 + CBPO + λ(Q)·U","P5 Chỉ phân luồng G2 + CBPO","P6 CBPO + λ(Q)·U + FIFO",
     "P7 Biến thể G1 (ngưỡng giá bóng) + CBPO + λ(Q)·U"]
# toc do xoi mon loi nhuan theo thoi gian cho (USD/ngay) — dao ham E[pi] theo W tai gia CBPO, dac trung quan sat
def erosion_rate(beta,mu_srv,k_beta=1.0):
    ep,p=evaluate(beta,np.zeros(n),np.zeros(n),"cbpo",None,k_beta)
    Pw=np.where(p>c,ep/(p-c),0.0)
    dEdW=(p-c)*Pw*(1-Pw)*(beta[iT]*k_beta/sd["TAT_pred"]+beta[iQ]*k_beta*mu_srv/sd["Pricing_Queue_Depth"])
    r=-np.bincount(J,weights=dEdW,minlength=n); r[~has]=np.median(r[has]); return np.maximum(r,0)
def one_rep(rep,cal,pi_mult,k_beta=1.0,draw_beta=True):
    rng=np.random.default_rng(1000+rep)
    jit=rng.uniform(0,1,n); eps=rng.lognormal(-0.02,0.2,n)
    beta=rng.multivariate_normal(beta_hat,COV) if draw_beta else beta_hat
    m,kap=cal["m"],cal["kappa"]; work=kap*h.Pricing_Days.values*eps; what=kap*h.Pricing_hat.values
    entry=h.arr.values+jit+h.pre.values; due=h.arr.values+jit+SLA-h.post_hat.values
    wbar=work.mean(); mu_srv=m/wbar
    pi=pi_mult*MARGIN; pi_rfq=pi*U
    W0,Q0s,_=simulate(entry,work,m)
    rr=erosion_rate(beta_hat,mu_srv,k_beta)                      # doanh nghiep dung uoc luong diem cho quy tac
    W1,Q1s,lane=simulate(entry,work,m,rule="G2",due=due,what=what,pi_rfq=pi_rfq,wbar=wbar,rr=rr)
    W2,_,lane2=simulate(entry,work,m,rule="G1",V=V,due=due,what=what,pi_rfq=pi_rfq,wbar=wbar)
    dW=W1-W0; dQ=dW*mu_srv; dW2=W2-W0; dQ2=dW2*mu_srv; z=np.zeros(n)
    TAT1=TAT0+dW
    lam_dyn_item=(pi*Delta(Q0[J]+dQ[J])*U[J])/(len(s)/s["Project key"].nunique())
    lam_dyn_fifo=(pi*Delta(Q0[J])*U[J])/(len(s)/s["Project key"].nunique())
    lam_bar=np.full(len(s),lam_dyn_fifo.mean())
    lam_dyn_g1=(pi*Delta(Q0[J]+dQ2[J])*U[J])/(len(s)/s["Project key"].nunique())
    res={}
    for nm,(dq,dt,pp,lam) in zip(POL,[(z,z,"hist",None),(z,z,"cbpo",None),(z,z,"cbpo",lam_bar),
                                       (dQ,dW,"cbpo",lam_dyn_item),(dQ,dW,"cbpo",None),(z,z,"cbpo",lam_dyn_fifo),
                                       (dQ2,dW2,"cbpo",lam_dyn_g1)]):
        ep,_=evaluate(beta,dq,dt,pp,lam,k_beta)
        tat=TAT0+dt; br=tat>SLA
        G=ep.sum(); cost=(pi*U*br).sum()
        res[nm]={"G":G,"cost":cost,"net":G-cost,"breach":br.mean(),"breach_U":(U*br).sum()/U.sum(),
                 "tat_mean":tat.mean(),"tat_p90":np.quantile(tat,.9)}
    hiU=U>1.0
    res["_lane"]={"fast_share":float((lane==1).mean()),"W0":float(W0.mean()),"W1":float(W1.mean()),
        "dW_hiU":float(dW[hiU].mean()),"dW_loU":float(dW[~hiU].mean()),
        "breach_hiU_0":float((TAT0[hiU]>SLA).mean()),"breach_hiU_1":float((TAT1[hiU]>SLA).mean()),
        "breach_loU_0":float((TAT0[~hiU]>SLA).mean()),"breach_loU_1":float((TAT1[~hiU]>SLA).mean()),
        "fast_share_G1":float((lane2==1).mean()),"W2":float(W2.mean()),
        "top_value_dW":float(dW[Erfq>=np.quantile(Erfq,.75)].mean()),"low_value_dW":float(dW[Erfq<=np.quantile(Erfq,.25)].mean())}
    return res

def run_block(cal,pi_mult,R,k_beta=1.0):
    reps=[one_rep(r,cal,pi_mult,k_beta) for r in range(R)]
    tab={}
    for nm in POL:
        net=np.array([r[nm]["net"] for r in reps]); base=np.array([r[POL[0]]["net"] for r in reps])
        tab[nm]={k:float(np.mean([r[nm][k] for r in reps])) for k in ["G","cost","net","breach","breach_U","tat_mean","tat_p90"]}
        tab[nm]["uplift_net_pct"]=float(np.mean((net/base-1)*100))
    def paired(a,b):
        # mean_pp: diem % cua loi nhuan RONG hien trang; mean_ppG: diem % cua loi nhuan GOP ky vong hien trang (on dinh khi pi lon)
        d=np.array([(r[a]["net"]-r[b]["net"])/r[POL[0]]["net"]*100 for r in reps])
        dG=np.array([(r[a]["net"]-r[b]["net"])/r[POL[0]]["G"]*100 for r in reps])
        dU=np.array([r[a]["net"]-r[b]["net"] for r in reps])
        t=dG.mean()/(dG.std(ddof=1)/np.sqrt(len(dG))) if dG.std(ddof=1)>0 else np.inf
        return {"mean_pp":float(d.mean()),"mean_ppG":float(dG.mean()),"mean_USD":float(dU.mean()),"sd":float(dG.std(ddof=1)),
                "CI":[float(np.quantile(d,.025)),float(np.quantile(d,.975))],"CI_G":[float(np.quantile(dG,.025)),float(np.quantile(dG,.975))],
                "t":float(t),"p":float(2*(1-stats.t.cdf(abs(t),len(dG)-1))),"share_pos":float((dG>0).mean())}
    cmp={"P4_vs_P3":paired(POL[3],POL[2]),"P4_vs_P2":paired(POL[3],POL[1]),"P5_vs_P2":paired(POL[4],POL[1]),
         "P6_vs_P3":paired(POL[5],POL[2]),"P4_vs_P5":paired(POL[3],POL[4]),"P7_vs_P3":paired(POL[6],POL[2])}
    lane={k:float(np.mean([r["_lane"][k] for r in reps])) for k in reps[0]["_lane"]}
    return {"policies":tab,"compare":cmp,"lane":lane,"R":R,"pi_mult":pi_mult,"k_beta":k_beta}

# ── 5. Ket qua chinh: hai cach hieu chinh, pi_SLA = 1,0 x bien loi nhuan (moc trung tam), R = 200 ──
import os; R_MAIN=int(os.environ.get("SIM_R",200))
OUT["main"]={cn:{str(pm):run_block(CAL[cn],pm,R_MAIN) for pm in [0.5,1.0,2.0]} for cn in ["C1","C2"]}
for cn in ["C1","C2"]:
    for pm in ["0.5","1.0","2.0"]:
        b=OUT["main"][cn][pm]; print(f"\n== {cn} pi={pm}  lane={ {k:round(v,3) for k,v in b['lane'].items()} }")
        for nm in POL:
            r=b["policies"][nm]; print("  %-44s net %9.1f  up %+6.2f%%  breach %.4f  cost %8.1f" % (nm,r["net"],r["uplift_net_pct"],r["breach"],r["cost"]))
        for kk,v in b["compare"].items(): print("   ",kk,{a:(round(x,3) if isinstance(x,float) else [round(y,3) for y in x]) for a,x in v.items()})

# ── 6. Mat phang chuyen pha: |beta_TAT|, |beta_Q| nhan k  x  pi_SLA ──
KB=[0.0,0.5,1.0,1.5,2.0,3.0]; PM=[0.5,1.0,2.0,3.0,5.0]; R_GRID=int(os.environ.get("SIM_RG",30))
grid={}
for cn in ["C1","C2"]:
    grid[cn]=[]
    for kb in KB:
        for pm in PM:
            b=run_block(CAL[cn],pm,R_GRID,kb); c_=b["compare"]["P4_vs_P3"]
            grid[cn].append({"k_beta":kb,"pi_mult":pm,"d_pp":c_["mean_ppG"],"CI":c_["CI_G"],"p":c_["p"],"d_USD":c_["mean_USD"],
                "breach_P4":b["policies"][POL[3]]["breach"],"breach_P3":b["policies"][POL[2]]["breach"],
                "d_gate_pp":b["compare"]["P5_vs_P2"]["mean_ppG"],"d_G1_pp":b["compare"]["P7_vs_P3"]["mean_ppG"],
                "d_P6_pp":b["compare"]["P6_vs_P3"]["mean_ppG"]})
OUT["phase"]={"k_beta":KB,"pi_mult":PM,"R":R_GRID,"grid":grid,
   "beta_TAT":float(par["TAT_pred"]),"beta_Q":float(par["Pricing_Queue_Depth"])}
OUT["meta"]={"W_target_C1":W_TARGET_C1,"W_target_C2":W_TARGET_C2,"n_rfq":int(n),"n_items":int(len(s)),"SLA":SLA,
   "breach_obs":float((TAT0>SLA).mean()),"margin_item":MARGIN,"lam_static":LAM_STATIC,"R_main":R_MAIN,
   "U_hi_share":float((U>1).mean()),"policies":POL,
   "note":"Mo phong phan thuc neo vao quan sat; gia khong tac dong toi hang doi (cong viec phat sinh truoc quyet dinh gia)."}
json.dump(OUT,open("ch4_sim.json","w"),indent=2,ensure_ascii=False)

# Hinh 4.8 va 4.9 duoc ve boi ch4_sim_figs.py (doc ch4_sim.json)
print("\nPHASE C1:",[(g["k_beta"],g["pi_mult"],round(g["d_pp"],2),round(g["p"],3)) for g in grid["C1"]])
print("PHASE C2:",[(g["k_beta"],g["pi_mult"],round(g["d_pp"],2),round(g["p"],3)) for g in grid["C2"]])
