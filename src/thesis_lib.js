// Thu vien sinh luan van v2 — footnote, so trang, so dang ky hinh/bang
const fs=require("fs");
const D=require("docx");
const {Document,Packer,Paragraph,TextRun,HeadingLevel,AlignmentType,Table,TableRow,TableCell,
  WidthType,ShadingType,BorderStyle,ImageRun,TableOfContents,PageBreak,Footer,PageNumber,
  FootnoteReferenceRun,convertMillimetersToTwip}=D;
const C={RED:"CC0000",DRED:"90112C",BLUE:"004774",CYAN:"0093DD",GREEN:"008448",
  YELLOW:"FDC300",INK:"262626",BODY:"4D4D4D",MUTE:"737373",BORDER:"BFBFBF",LIGHT:"F5F5F5"};
const FONT="Times New Roman", MONO="Consolas";
const REG={figs:[],tabs:[]};          // so dang ky caption
const FN={list:[]};                    // footnotes
const run=(t,o={})=>new TextRun({text:t,font:o.mono?MONO:FONT,size:o.size||26,
  color:o.color||C.INK,bold:!!o.bold,italics:!!o.italic});
const fn=(text)=>{FN.list.push(text); return new FootnoteReferenceRun(FN.list.length);};
const p=(t,o={})=>new Paragraph({alignment:o.align||AlignmentType.JUSTIFIED,
  spacing:{line:360,after:o.after??120},children:Array.isArray(t)?t:[run(t,o)]});
const h1=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,pageBreakBefore:true,
  spacing:{before:0,after:240},children:[run(t,{size:30,bold:true,color:C.RED})]});
const h1n=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:0,after:240},
  children:[run(t,{size:30,bold:true,color:C.RED})]});
const h2=(t)=>new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:240,after:120},
  children:[run(t,{size:27,bold:true,color:C.INK})]});
const h3=(t)=>new Paragraph({heading:HeadingLevel.HEADING_3,spacing:{before:180,after:100},
  children:[run(t,{size:26,bold:true,italics:true,color:C.BODY})]});
const cap=(t)=>{
  const m=t.match(/^(Hình|Bảng)\s+([0-9A-Z]+\.[0-9]+):\s*(.*)$/);
  if(m){ (m[1]==="Hình"?REG.figs:REG.tabs).push({id:m[2],text:m[3]}); }
  return new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:60,after:200},
    children:[run(t,{size:22,italic:true,color:C.BODY})]});
};
const center=(t,o={})=>new Paragraph({alignment:AlignmentType.CENTER,
  spacing:{after:o.after??80},children:[run(t,{size:o.size||26,bold:!!o.bold,
  color:o.color||C.INK,italic:!!o.italic})]});
const fx=(lines)=>new Paragraph({alignment:AlignmentType.LEFT,spacing:{before:80,after:100,line:280},
  shading:{type:ShadingType.CLEAR,fill:"F2F6F9"},
  border:{left:{style:BorderStyle.SINGLE,size:14,color:C.BLUE},top:{style:BorderStyle.SINGLE,size:2,color:"DCE6EE"},
    bottom:{style:BorderStyle.SINGLE,size:2,color:"DCE6EE"},right:{style:BorderStyle.SINGLE,size:2,color:"DCE6EE"}},
  indent:{left:120,right:60},
  children:lines.flatMap((l,i)=>[...(i?[new TextRun({break:1})]:[]),new TextRun({text:l,font:MONO,size:17,color:C.INK})])});
const path=require("path");
const img=(f,w,r)=>new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:40},
  children:[new ImageRun({type:"png",data:fs.readFileSync(path.isAbsolute(f)?f:path.join(__dirname,f)),transformation:{width:w,height:Math.round(w*r)}})]});
const pb=()=>new Paragraph({children:[new PageBreak()]});
const CM={top:60,bottom:60,left:100,right:100};
function mkTable(hd,rows,w,hl,left){
  const bd={style:BorderStyle.SINGLE,size:4,color:C.BORDER}; const bs={top:bd,bottom:bd,left:bd,right:bd};
  const head=new TableRow({tableHeader:true,children:hd.map((t,k)=>new TableCell({
    width:{size:w[k],type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:C.RED},margins:CM,borders:bs,
    children:[new Paragraph({alignment:AlignmentType.CENTER,children:[run(t,{size:22,bold:true,color:"FFFFFF"})]})]}))});
  const body=rows.map((r,ri)=>new TableRow({children:r.map((t,ci)=>new TableCell({
    width:{size:w[ci],type:WidthType.DXA},
    shading:{type:ShadingType.CLEAR,fill:(hl&&hl.includes(ri))?"FFF3F3":(ri%2?C.LIGHT:"FFFFFF")},margins:CM,borders:bs,
    children:[new Paragraph({alignment:(ci===0||left)?AlignmentType.LEFT:AlignmentType.CENTER,
      children:String(t).split("\n").map((q,qi)=>new TextRun({text:q,font:/[=^√Σ∂]/.test(q)?MONO:FONT,size:22,color:C.INK,break:qi?1:0}))})]}))}));
  return new Table({columnWidths:w,width:{size:w.reduce((a,b)=>a+b,0),type:WidthType.DXA},rows:[head,...body]});
}
function build(kids,outFile){
  const footnotes={};
  FN.list.forEach((t,i)=>{footnotes[i+1]={children:[new Paragraph({children:[new TextRun({text:t,font:FONT,size:20,color:C.INK})]})]};});
  const doc=new Document({features:{updateFields:true},footnotes,
    styles:{default:{document:{run:{font:FONT,size:26,color:C.INK}}}},
    sections:[{properties:{page:{size:{width:convertMillimetersToTwip(210),height:convertMillimetersToTwip(297)},
        margin:{top:convertMillimetersToTwip(20),bottom:convertMillimetersToTwip(20),
          left:convertMillimetersToTwip(30),right:convertMillimetersToTwip(20)}}},
      footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,
        children:[new TextRun({children:[PageNumber.CURRENT],font:FONT,size:22,color:C.MUTE})]})]})},
      children:kids}]});
  return Packer.toBuffer(doc).then(b=>{fs.writeFileSync(outFile,b);console.log("OK —",outFile,b.length,"bytes",
    "| hình:",REG.figs.length,"| bảng:",REG.tabs.length,"| footnote:",FN.list.length);});
}
module.exports={C,FONT,MONO,REG,FN,run,fn,p,h1,h1n,h2,h3,cap,center,fx,img,pb,mkTable,build,
  Paragraph,TextRun,PageBreak,TableOfContents,AlignmentType,HeadingLevel};
