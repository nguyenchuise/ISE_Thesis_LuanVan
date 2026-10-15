# -*- coding: utf-8 -*-
"""Hinh 4.8 va 4.9 cho Muc 4.4 — doc ket qua mo phong tu ch4_sim.json (khong chay lai mo phong)."""
import numpy as np, pandas as pd, json
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt, matplotlib as mpl
RED,DRED,BLUE,CYAN,GREEN,YELLOW="#CC0000","#90112C","#004774","#0093DD","#008448","#FDC300"
INK,BODY,MUTE,BORDER="#262626","#4D4D4D","#737373","#BFBFBF"
mpl.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.titleweight":"bold","axes.titlesize":11,
 "axes.labelcolor":BODY,"axes.edgecolor":BORDER,"xtick.color":MUTE,"ytick.color":MUTE,"axes.spines.top":False,
 "axes.spines.right":False,"savefig.dpi":300,"savefig.bbox":"tight","figure.facecolor":"#FFFFFF","axes.grid":True,"grid.color":"#EDEDED"})
S=json.load(open("ch4_sim.json")); POL=S["meta"]["policies"]
fv=lambda v,d=1:f"{v:+.{d}f}".replace(".",",")

# FIG 4.8
fig,ax=plt.subplots(1,2,figsize=(12,4.4))
b=S["main"]["C1"]["1.0"]; b2=S["main"]["C2"]["1.0"]
lab=["P1\nHiện trạng","P2\nCBPO","P3\nGiả dược","P4\nĐồng bộ","P5\nChỉ\nphân luồng","P6\nCBPO+λ·U","P7\nBiến thể G1"]
x=np.arange(len(POL)); w=.38
v1=[b["policies"][nm]["uplift_net_pct"] for nm in POL]; v2=[b2["policies"][nm]["uplift_net_pct"] for nm in POL]
ax[0].bar(x-w/2,v1,w,color=BLUE,alpha=.85,label="Hiệu chỉnh C1 (chờ tại Pricing)")
ax[0].bar(x+w/2,v2,w,color=YELLOW,alpha=.9,label="Hiệu chỉnh C2 (tải toàn chuỗi)")
for xx,v in zip(x-w/2,v1): ax[0].text(xx,v+.3,fv(v),ha="center",fontsize=7.3)
for xx,v in zip(x+w/2,v2): ax[0].text(xx,v+.3,fv(v),ha="center",fontsize=7.3)
ax[0].set_xticks(x); ax[0].set_xticklabels(lab,fontsize=7.8); ax[0].axhline(0,color=INK,lw=1)
ax[0].set_ylabel("Lợi nhuận ròng sau chi phí SLA, % so với P1"); ax[0].legend(fontsize=8,loc="upper left")
ax[0].set_ylim(0,max(v1+v2)*1.2); ax[0].set_title("(A) Lợi nhuận ròng, π_SLA = 1,0 × biên lợi nhuận")
br1=[b["policies"][nm]["breach"]*100 for nm in POL]; br2=[b2["policies"][nm]["breach"]*100 for nm in POL]
ax[1].bar(x-w/2,br1,w,color=BLUE,alpha=.85,label="C1"); ax[1].bar(x+w/2,br2,w,color=YELLOW,alpha=.9,label="C2")
for xx,v in zip(x-w/2,br1): ax[1].text(xx,v+.4,f"{v:.1f}".replace(".",","),ha="center",fontsize=7.3)
for xx,v in zip(x+w/2,br2): ax[1].text(xx,v+.4,f"{v:.1f}".replace(".",","),ha="center",fontsize=7.3)
ax[1].set_xticks(x); ax[1].set_xticklabels(lab,fontsize=7.8); ax[1].set_ylabel("Tỷ lệ vi phạm SLA 7 ngày (%)"); ax[1].legend(fontsize=8)
ax[1].set_ylim(0,max(br1+br2)*1.18); ax[1].set_title("(B) Vi phạm cam kết — chỉ phân luồng thay đổi được")
plt.tight_layout(); plt.savefig("FIG_4_8_Simulation.png"); plt.close()

# FIG 4.9 — mat phang chuyen pha: G2 (C1), G2 (C2), G1 (C1)
PH=S["phase"]; KB=PH["k_beta"]; PM=PH["pi_mult"]
fig,ax=plt.subplots(1,3,figsize=(15,4.6))
for a,(cn,key,tt) in zip(ax,[("C1","d_pp","(A) G2 đồng bộ − giả dược, C1"),("C2","d_pp","(B) G2 đồng bộ − giả dược, C2"),("C1","d_G1_pp","(C) Biến thể G1 − giả dược, C1")]):
    G=pd.DataFrame(PH["grid"][cn]); Mx=G.pivot(index="k_beta",columns="pi_mult",values=key).values
    vmax=max(abs(np.nanmin(Mx)),abs(np.nanmax(Mx)),0.5)
    im=a.imshow(Mx,cmap="RdBu",vmin=-vmax,vmax=vmax,origin="lower",aspect="auto"); a.grid(False)
    for ii in range(Mx.shape[0]):
        for jj in range(Mx.shape[1]):
            a.text(jj,ii,fv(Mx[ii,jj]),ha="center",va="center",fontsize=7.8,color="white" if abs(Mx[ii,jj])>0.6*vmax else INK)
    if key=="d_G1_pp":
        # ranh gioi doi dau: noi suy tuyen tinh theo pi tren tung hang k
        xs,ys=[],[]
        for ii in range(Mx.shape[0]):
            row=Mx[ii]
            for jj in range(len(row)-1):
                if row[jj]>0>=row[jj+1]: xs.append(jj+row[jj]/(row[jj]-row[jj+1])); ys.append(ii)
        if xs: a.plot(xs,ys,"k--",lw=1.6,label="Ranh giới đổi dấu"); a.legend(fontsize=7.5,loc="upper right")
    a.set_xticks(range(len(PM))); a.set_xticklabels([f"{v:g}".replace(".",",") for v in PM]); a.set_yticks(range(len(KB))); a.set_yticklabels([f"{v:g}".replace(".",",") for v in KB])
    a.set_xlabel("π_SLA (bội số biên lợi nhuận mỗi dòng hàng)"); a.set_ylabel("k nhân |β_TAT|, |β_Queue|")
    a.set_title(tt,fontsize=10); plt.colorbar(im,ax=a,fraction=.046,pad=.03)
plt.tight_layout(); plt.savefig("FIG_4_9_Phase.png"); plt.close()
print("FIG 4.8, 4.9 OK")

# Bo sung: ty le ho so vi pham co TAT vuot 7 ngay nhieu hon thoi gian cho trung binh co the sap xep lai
h=pd.read_csv("HeadView_Workload.csv"); t=h["Turnaround time"]; b=t[t>7]
EX={k:{"W_mean":S["calibration"][k]["W_mean"],"share_breach_beyond_W":float((b>7+S["calibration"][k]["W_mean"]).mean())} for k in ["C1","C2"]}
json.dump(EX,open("ch4_sim_extra.json","w"),indent=2); print(EX)
