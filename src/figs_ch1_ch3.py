# -*- coding: utf-8 -*-
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, json
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt, matplotlib as mpl
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
RED,DRED,BLUE,NAVY,CYAN,GREEN,GOLD,YELLOW="#CC0000","#90112C","#004774","#1F3864","#0093DD","#008448","#C8960C","#FDC300"
INK,BODY,MUTE,BORDER,LIGHT="#262626","#4D4D4D","#737373","#BFBFBF","#F7F7F7"
mpl.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.titleweight":"bold","axes.titlesize":11,
 "axes.labelcolor":BODY,"axes.edgecolor":BORDER,"xtick.color":MUTE,"ytick.color":MUTE,"axes.spines.top":False,
 "axes.spines.right":False,"savefig.dpi":300,"savefig.bbox":"tight","figure.facecolor":"#FFFFFF","axes.grid":True,"grid.color":"#EDEDED"})
h=pd.read_csv("HeadView_Workload.csv"); i=pd.read_csv("ItemView_Workload.csv")
S=json.load(open("ch1_stats.json"))

# FIG 1.1 — TAT + SLA, va trung vi tung khau
fig,ax=plt.subplots(1,2,figsize=(11,4.1))
t=h["Turnaround time"]; ax[0].hist(t,bins=40,color=BLUE,alpha=.75,edgecolor="white")
ax[0].axvline(7,color=RED,lw=2,ls="--"); ax[0].text(7.2,ax[0].get_ylim()[1]*.92,"SLA 7 ngày",color=RED,fontsize=9.5,fontweight="bold")
ax[0].axvline(t.median(),color=INK,lw=1.2,ls=":"); ax[0].text(t.median()-.3,ax[0].get_ylim()[1]*.92,f"trung vị {t.median():.2f}".replace(".",","),color=INK,fontsize=8.5,ha="right")
ax[0].set_xlabel("Thời gian xử lý (ngày)"); ax[0].set_ylabel("Số hồ sơ")
ax[0].set_title(f"(A) {int((t>7).sum())}/1.500 hồ sơ ({(t>7).mean()*100:.1f}%) vượt cam kết".replace(".1f","").replace("37.7","37,7"))
ST=["Sales_Days","WBS_Days","SC_Days","Pricing_Days"]; SN=["Sales","WBS","SC","Pricing"]
med=[h[s].median() for s in ST]; cols=[CYAN,BLUE,GREEN,RED]
bars=ax[1].bar(SN,med,color=cols,alpha=.85)
for b,v in zip(bars,med): ax[1].text(b.get_x()+b.get_width()/2,v+.05,f"{v:.1f}".replace(".",","),ha="center",fontsize=9.5,color=INK)
ax[1].set_ylabel("Trung vị (ngày)"); ax[1].set_ylim(0,2.7); ax[1].set_title("(B) Pricing là nút thắt về thời gian tuyệt đối")
plt.tight_layout(); plt.savefig("FIG_1_1_TAT_SLA_Bottleneck.png"); plt.close()

# FIG 1.2 — markup bat dong vs win rate
pc=S["phan_ung_canh_tranh"]; lv=["Low","Med","High"]; lab=["Thấp","Trung bình","Cao"]
mk=[pc[l]["markup"] for l in lv]; wr=[pc[l]["win"]*100 for l in lv]
fig,ax1=plt.subplots(figsize=(8.5,4.1)); ax2=ax1.twinx()
ax1.bar(lab,wr,color=[GREEN,BLUE,RED],alpha=.6,width=.55,label="Tỷ lệ thắng (%)")
for x_,v in zip(lab,wr): ax1.text(x_,v+1,f"{v:.1f}%".replace(".",","),ha="center",fontsize=9.5,color=INK)
ax1.set_ylabel("Tỷ lệ thắng (%)"); ax1.set_ylim(0,90)
ax2.plot(lab,mk,"o-",color=DRED,lw=2.4,ms=8,label="Hệ số markup"); ax2.set_ylim(1.20,1.34); ax2.grid(False)
for x_,v in zip(lab,mk): ax2.text(x_,v+.006,f"{v:.4f}".replace(".",","),ha="center",fontsize=9,color=DRED,fontweight="bold")
ax2.set_ylabel("Hệ số markup trung bình",color=DRED); ax2.spines["right"].set_visible(True); ax2.spines["right"].set_color(BORDER)
ax1.set_xlabel("Cường độ cạnh tranh")
ax1.set_title("Tỷ lệ thắng giảm 18,9 điểm % trong khi markup chỉ đổi 0,35 điểm %")
h1_,l1=ax1.get_legend_handles_labels(); h2_,l2=ax2.get_legend_handles_labels(); ax1.legend(h1_+h2_,l1+l2,loc="lower left",fontsize=8.5)
plt.tight_layout(); plt.savefig("FIG_1_2_Markup_vs_WinRate.png"); plt.close()

# FIG 3.1 — khung phuong phap ba bai toan + hai truc
fig,ax=plt.subplots(figsize=(15.6,8.0)); ax.set_xlim(0,100); ax.set_ylim(3.4,33.4); ax.axis("off"); ax.grid(False)
def box(x,y,w,h_,fc,ec,lw=1.3,z=3,r=0.5): ax.add_patch(FancyBboxPatch((x,y),w,h_,boxstyle=f"round,pad=0.18,rounding_size={r}",fc=fc,ec=ec,lw=lw,zorder=z))
def txt(x,y,s,sz=9,c=INK,b=False): ax.text(x,y,s,ha="center",va="center",fontsize=sz,color=c,fontweight="bold" if b else "normal",linespacing=1.5,zorder=6)
box(3,27.6,94,4.4,"#262626","#262626",1.4,2,0.6)
txt(50,29.8,"Bài toán nghiệp vụ:  báo giá B2B — 37,7% vi phạm SLA 7 ngày  &  hệ số markup không phản ứng với cạnh tranh",10.2,"#FFFFFF",True)
box(3,17.0,94,8.6,"#FFFFFF",NAVY,1.8,2,0.6); box(3,22.6,94,3.0,NAVY,NAVY,1.6,3,0.6)
txt(50,24.1,"TRỤC 1 — KHAI PHÁ DỮ LIỆU  ·  sáu pha CRISP-DM  ·  BT1 và BT2",10.4,"#FFFFFF",True)
PH=[("Business\nUnderstanding",NAVY),("Data\nUnderstanding",BLUE),("Data\nPreparation",GREEN),("Modeling",GOLD),("Evaluation &\nDiagnostics",RED),("Deployment",DRED)]
w6,g6=14.2,1.36
for j,(nm,c) in enumerate(PH):
    x=4.5+j*(w6+g6); box(x,17.8,w6,4.2,LIGHT,c,1.2,4); txt(x+w6/2,19.9,nm,8.2,BODY)
    if j<5: ax.add_patch(FancyArrowPatch((x+w6+.15,19.9),(x+w6+g6-.15,19.9),arrowstyle="-|>",mutation_scale=10,color=MUTE,lw=1.1,zorder=6))
txt(50,16.0,"Đầu ra trục 1:  TAT dự báo theo khâu (BT1)  →  làm biến của BT2  →  P(Win | p, x) đã hiệu chuẩn (BT2)",8.6,NAVY,True)
ax.add_patch(FancyArrowPatch((50,15.2),(50,13.6),arrowstyle="-|>",mutation_scale=14,color=MUTE,lw=1.6,zorder=6))
box(3,5.0,94,8.4,"#FFFFFF",RED,1.8,2,0.6); box(3,10.4,94,3.0,RED,RED,1.6,3,0.6)
txt(50,11.9,"TRỤC 2 — TỐI ƯU GIÁ VÀ KIỂM ĐỊNH GIẢ THUYẾT  ·  BT3",10.4,"#FFFFFF",True)
EX=[(4.5,"Khung CBPO","Tối ưu (p−c)·P(Win|p,x)\ngiải số theo FOC"),(28.3,"Chính sách cân bằng — H1","β*(c) theo Krishna (2009)\nhiệu chỉnh N, kiểm định log–log"),
    (52.1,"Giá bóng năng lực — H2","λ(Q) từ ngoại tác nghẽn\nkiểm chứng giả dược"),(75.9,"Đánh giá & độ nhạy","Cùng tập kiểm tra tách theo dự án\nN, họ F, π_SLA; thiết kế A/B")]
for x,t1,t2 in EX:
    box(x,5.6,20.6,4.4,LIGHT,RED,1.2,4); txt(x+10.3,8.9,t1,9.0,INK,True); txt(x+10.3,7.0,t2,7.6,BODY)
plt.tight_layout(); plt.savefig("FIG_3_1_Methodology.png"); plt.close()
from PIL import Image
for fn_ in ["FIG_1_1_TAT_SLA_Bottleneck.png","FIG_1_2_Markup_vs_WinRate.png","FIG_3_1_Methodology.png"]:
    im=Image.open(fn_); print(fn_, im.size, round(im.size[1]/im.size[0],4))
