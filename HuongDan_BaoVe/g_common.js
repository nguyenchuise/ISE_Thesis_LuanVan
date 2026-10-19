// Tien ich chung cho tai lieu huong dan bao ve — doc so lieu tu JSON cua luan van
const path=require("path"), fs=require("fs");
const SRC=path.join(__dirname,"..","src");
const L=require(path.join(SRC,"thesis_lib.js"));
const {C,run,Paragraph,TextRun,AlignmentType}=L;
const J=f=>JSON.parse(fs.readFileSync(path.join(SRC,f),"utf8"));
const D={B1:J("bt1_pertask.json"),B1M:J("bt1_models.json"),B12:J("ch4_bt12.json"),B3:J("ch4_bt3.json"),SIM:J("ch4_sim.json"),
  TR:J("ch5_triage.json"),AX:J("ch4_icc_appx.json"),S1:J("ch1_stats.json"),MC:J("metric_compare.json"),FOC:J("bt3_form.json"),EX:J("ch4_sim_extra.json")};
const f=(x,d=2)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−");
const fs_=(x,d=2)=>(x>=0?"+":"")+f(x,d);
const fp=(x,d=2)=>fs_(x,d)+"%";
const pct=(x,d=1)=>f(x*100,d)+"%";
const pv=x=>x<1e-4?"< 0,0001":f(x,4);
const n0=x=>Number(x).toLocaleString("de-DE");
const coef=b=>D.B12.bt2_coef.find(r=>r.bien===b);
const POL=D.B3.policies;
// khoi "Ghi nho" (nen xanh nhat, chu thuong — khong dung phong mono)
const note=(title,lines)=>new Paragraph({alignment:AlignmentType.LEFT,spacing:{before:100,after:140,line:300},
  shading:{type:"clear",fill:"EEF5EC"},border:{left:{style:"single",size:18,color:C.GREEN}},indent:{left:160,right:80},
  children:[new TextRun({text:title,bold:true,font:L.FONT,size:24,color:C.GREEN}),
    ...lines.flatMap(t=>[new TextRun({break:1}),new TextRun({text:"▸ "+t,font:L.FONT,size:23,color:C.INK})])]});
// khoi canh bao (nen do nhat)
const warn=(title,lines)=>new Paragraph({alignment:AlignmentType.LEFT,spacing:{before:100,after:140,line:300},
  shading:{type:"clear",fill:"FDEEEE"},border:{left:{style:"single",size:18,color:C.RED}},indent:{left:160,right:80},
  children:[new TextRun({text:title,bold:true,font:L.FONT,size:24,color:C.RED}),
    ...lines.flatMap(t=>[new TextRun({break:1}),new TextRun({text:"▸ "+t,font:L.FONT,size:23,color:C.INK})])]});
// hoi — dap
const Q=(q,a)=>[
  new Paragraph({spacing:{before:160,after:60},keepNext:true,children:[new TextRun({text:"Hỏi: ",bold:true,font:L.FONT,size:24,color:C.BLUE}),new TextRun({text:q,bold:true,italics:true,font:L.FONT,size:24,color:C.INK})]}),
  new Paragraph({alignment:AlignmentType.JUSTIFIED,spacing:{after:120,line:330},indent:{left:360},
    children:[new TextRun({text:"Gợi ý trả lời: ",bold:true,font:L.FONT,size:24,color:C.GREEN}),new TextRun({text:a,font:L.FONT,size:24,color:C.INK})]})];
// tieu muc 4 lop: Ly thuyet / Ap dung / Y nghia
const lbl=(t,c)=>new Paragraph({spacing:{before:120,after:40},keepNext:true,children:[new TextRun({text:t,bold:true,font:L.FONT,size:24,color:c||C.DRED})]});
const LT=()=>lbl("① Lý thuyết",C.BLUE), AD=()=>lbl("② Áp dụng trong luận văn",C.DRED), YN=()=>lbl("③ Ý nghĩa và cách diễn giải",C.GREEN);
module.exports={L,D,f,fs_,fp,pct,pv,n0,coef,POL,note,warn,Q,LT,AD,YN,SRC};
