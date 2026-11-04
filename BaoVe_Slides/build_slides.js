// Slide bao ve luan van (15 phut) — phong cach theo mau doanh nghiep (do–xam, the so lieu, o thong diep chinh),
// da bo logo va ten cong ty de giu an danh. Moi con so doc tu JSON ket qua cua luan van (../src).
// Chay: cd BaoVe_Slides && npm install && node build_slides.js
const path=require("path"), fs=require("fs");
const pptxgen=require("pptxgenjs");
const { applyTheme }=require("./apply_theme.js");
const SRC=path.join(__dirname,"..","src");
const J=f=>JSON.parse(fs.readFileSync(path.join(SRC,f),"utf8"));
const B1=J("bt1_pertask.json"),B1M=J("bt1_models.json"),B12=J("ch4_bt12.json"),B3=J("ch4_bt3.json"),SIM=J("ch4_sim.json"),S1=J("ch1_stats.json"),TR=J("ch5_triage.json");
const f=(x,d=1)=>Number(x).toFixed(d).replace(".",",").replace(/^-/,"−");
const fs_=(x,d=1)=>(x>=0?"+":"")+f(x,d);
const pct=(x,d=1)=>f(x*100,d)+"%";
const n0=x=>Number(x).toLocaleString("de-DE");
const POL=B3.policies, cb=POL["CBPO Realistic (kẹp P5–P95)"], nA=POL["Nash A — miền tuyệt đối (kẹp)"], nB=POL["Nash B — miền tỷ lệ (kẹp)"],
      nC=POL["Nash C — cận dòng hàng, N thực tế (kẹp)"], nCh=POL["Nash C + phản hồi logistic (±5% quanh neo)"];
const M1=SIM.main.C1["1.0"], M2=SIM.main.C2["1.0"], SP=SIM.meta.policies;
const coef=b=>B12.bt2_coef.find(r=>r.bien===b);
const pc=S1.phan_ung_canh_tranh;

const THEME={name:"Thesis Defense Red-Grey",headFontFace:"Arial",bodyFontFace:"Arial",
  colors:{dk1:"262626",lt1:"FFFFFF",dk2:"4B4B4B",lt2:"E6E6E6",accent1:"CC0000",accent2:"8B8B8D",accent3:"0093DD",
          accent4:"004774",accent5:"008448",accent6:"FDC300",hlink:"CC0000",folHlink:"8B8B8D"}};
const HEX={red:"CC0000",dark:"262626",grey:"4B4B4B",mid:"8B8B8D",card:"D9D9D9",light:"F2F2F2",blue:"0093DD",navy:"004774",green:"008448"};

const pres=new pptxgen(); pres.layout="LAYOUT_16x9"; pres.theme={headFontFace:THEME.headFontFace,bodyFontFace:THEME.bodyFontFace};
pres.title="Bảo vệ luận văn thạc sĩ — Chu Thái Nguyên"; pres.author="Chu Thái Nguyên"; pres.subject="Luận văn Thạc sĩ Kỹ thuật Hệ thống Công nghiệp";
const C=pres.SchemeColor;
const FOOT="LUẬN VĂN THẠC SĨ KỸ THUẬT HỆ THỐNG CÔNG NGHIỆP · CHU THÁI NGUYÊN";

// ── Layouts ──
pres.defineSlideMaster({title:"COVER",background:{color:HEX.light},objects:[
  {rect:{x:0.45,y:0.45,w:4.6,h:4.75,fill:{color:C.accent1}}},
  {placeholder:{options:{name:"title",type:"title",x:0.7,y:0.75,w:4.1,h:2.3,fontSize:22,bold:false,color:C.background1,valign:"top",align:"left",margin:0},text:""}},
  {placeholder:{options:{name:"body",type:"body",x:0.7,y:3.15,w:4.1,h:1.85,fontSize:12,color:C.background1,valign:"bottom",margin:0},text:""}},
]});
pres.defineSlideMaster({title:"CONTENT",background:{color:C.background1},margin:[0.3,0.45,0.4,0.45],objects:[
  {placeholder:{options:{name:"kicker",type:"body",x:0.45,y:0.28,w:7.6,h:0.42,fontSize:22,color:C.text1,valign:"bottom",align:"left",margin:0},text:""}},
  {placeholder:{options:{name:"title",type:"title",x:0.45,y:0.68,w:7.6,h:0.42,fontSize:22,bold:false,color:C.accent1,valign:"top",align:"left",margin:0},text:""}},
  {text:{text:"HCMUT | ISE",options:{x:8.0,y:0.32,w:1.55,h:0.3,fontSize:11,bold:true,color:C.text2,align:"right",margin:0}}},
  {text:{text:FOOT,options:{x:0.7,y:5.3,w:6.0,h:0.2,fontSize:7.5,color:C.text1,margin:0}}},
  {text:{text:"11/2026",options:{x:8.6,y:5.3,w:0.95,h:0.2,fontSize:7.5,color:C.accent1,align:"right",margin:0}}},
],slideNumber:{x:0.45,y:5.3,w:0.25,h:0.2,fontSize:7.5,color:C.accent1,margin:0}});
pres.defineSlideMaster({title:"END",background:{color:HEX.light},objects:[
  {rect:{x:0.45,y:3.2,w:4.6,h:1.95,fill:{color:C.accent1}}},
  {placeholder:{options:{name:"title",type:"title",x:0.7,y:3.35,w:4.1,h:0.9,fontSize:30,bold:false,color:C.background1,valign:"top",align:"left",margin:0},text:""}},
  {placeholder:{options:{name:"body",type:"body",x:0.7,y:4.25,w:4.1,h:0.8,fontSize:12,color:C.background1,valign:"top",margin:0},text:""}},
]});

// ── Thanh phan dung chung ──
let OBJ=0; const nm=s=>`${s}_${++OBJ}`;
function head(s,kicker,title){ s.addText(kicker,{placeholder:"kicker"}); s.addText(title,{placeholder:"title"}); }
function takeaway(s,msg){
  for(let i=0;i<3;i++) s.addShape(pres.shapes.CHEVRON,{x:0.45+i*0.17,y:4.68,w:0.22,h:0.42,fill:{type:"none"},line:{color:C.accent1,width:1},objectName:nm("chevron")});
  s.addText([{text:"Thông điệp",options:{breakLine:true}},{text:"chính"}],{x:0.98,y:4.62,w:1.1,h:0.55,fontSize:13,color:C.accent1,margin:0,valign:"middle",isTextBox:true,objectName:nm("takeaway_label")});
  s.addText(msg,{x:2.15,y:4.62,w:7.4,h:0.55,fontSize:13,color:C.text1,margin:0,valign:"middle",isTextBox:true,objectName:nm("takeaway")});
}
// the xam: so lon do + tieu de + chi tiet
function card(s,x,y,w,h,big,label,detail,opt={}){
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w,h,rectRadius:0.12,fill:{color:opt.fill||HEX.card},line:{type:"none"},objectName:nm("card")});
  const runs=[];
  if(big) runs.push({text:big,options:{fontSize:opt.bigSize||30,color:C.accent1,breakLine:true}});
  runs.push({text:label,options:{fontSize:opt.labelSize||14,color:C.text1,breakLine:!!detail}});
  if(detail) runs.push({text:detail,options:{fontSize:opt.detailSize||11,color:C.text1}});
  s.addText(runs,{x:x+0.15,y:y+0.1,w:w-0.3,h:h-0.2,valign:"top",margin:0,paraSpaceAfter:2,isTextBox:true,objectName:nm("card_text")});
}
function decisionBox(s,x,y,w,h,label,text){
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w,h,rectRadius:0.08,fill:{color:C.background1},line:{color:C.accent1,width:1},objectName:nm("box")});
  s.addText([{text:label,options:{color:C.accent1,breakLine:true}},{text}],{x:x+0.1,y:y+0.05,w:w-0.2,h:h-0.1,fontSize:11,color:C.text1,valign:"top",margin:0,isTextBox:true,objectName:nm("box_text")});
}
const AX={catAxisLabelColor:HEX.grey,valAxisLabelColor:HEX.grey,catAxisLabelFontFace:"Arial",valAxisLabelFontFace:"Arial",dataLabelFontFace:"Arial",
  catAxisLabelFontSize:10,valAxisLabelFontSize:9,dataLabelFontSize:10,dataLabelColor:HEX.dark,valGridLine:{color:"E6E6E6",size:0.75},catGridLine:{style:"none"},
  titleFontFace:"Arial",titleFontSize:12,titleColor:HEX.dark};

// ════════ 1. BIA ════════
pres.addSection({title:"Mở đầu"});
let s=pres.addSlide({masterName:"COVER",sectionTitle:"Mở đầu"});
s.addText("Tích hợp Khai phá Dữ liệu và Lý thuyết Đấu giá trong Tối ưu hóa Giá Báo thầu có Xét Ràng buộc Năng lực Xử lý tại Doanh nghiệp Phân phối Vật tư Công nghiệp B2B",{placeholder:"title"});
s.addText([{text:"Bảo vệ Luận văn Thạc sĩ · Kỹ thuật Hệ thống Công nghiệp",options:{breakLine:true}},
  {text:"Học viên: Chu Thái Nguyên (2470590)",options:{breakLine:true}},
  {text:"GVHD: TS. Nguyễn Vạng Phúc Nguyên",options:{breakLine:true}},
  {text:"Trường Đại học Bách khoa – ĐHQG TP.HCM · 11/2026"}],{placeholder:"body"});
s.addText([{text:"Ba câu hỏi của một doanh nghiệp phân phối B2B",options:{bold:true,breakLine:true,fontSize:15,color:C.text1}},
  {text:"Vì sao báo giá trễ?",options:{bullet:true,breakLine:true}},{text:"Điều gì quyết định thắng hay thua đơn hàng?",options:{bullet:true,breakLine:true}},
  {text:"Nên chào giá nào, và xử lý hồ sơ nào trước khi quá tải?",options:{bullet:true}}],
  {x:5.5,y:1.7,w:4.0,h:2.0,fontSize:14,color:C.text1,paraSpaceAfter:6,valign:"top",margin:0,isTextBox:true,objectName:"cover_questions"});
s.addNotes(`[0:00–0:45] Kính chào Hội đồng. Em là Chu Thái Nguyên, học viên ngành Kỹ thuật Hệ thống Công nghiệp, GVHD TS. Nguyễn Vạng Phúc Nguyên. Luận văn trả lời ba câu hỏi rất thực tế của doanh nghiệp phân phối vật tư B2B: vì sao báo giá trễ, điều gì quyết định thắng thua, và nên chào giá nào cũng như xử lý hồ sơ nào trước khi đội ngũ quá tải. Em xin trình bày trong khoảng 15 phút.`);

// ════════ 2. BOI CANH ════════
pres.addSection({title:"Bối cảnh"});
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Bối cảnh"});
head(s,"Bối cảnh và vấn đề","Hai bất thường trong dữ liệu vận hành");
const cw=2.05, cg=0.18, cy=1.3;
card(s,0.45,cy,cw,2.0,n0(S1.quy_mo.du_an),"hồ sơ báo giá (RFQ)",`${n0(S1.quy_mo.mat_hang)} dòng hàng · ${S1.quy_mo.khach_hang} khách hàng · ${S1.quy_mo.ky_quan_sat_ngay} ngày; dữ liệu ERP–CRM–Sourcing`);
card(s,0.45+(cw+cg),cy,cw,2.0,"≈ "+f(S1.tan_suat.quyet_dinh_gia_moi_ngay_lam_viec,0),"quyết định giá mỗi ngày làm việc","Quyết định nhỏ, lặp lại, tổng giá trị lớn");
card(s,0.45+2*(cw+cg),cy,cw,2.0,pct(S1.sla.ty_le_vi_pham,1),"hồ sơ trễ cam kết 7 ngày",`Trung vị ${f(S1.sla.TAT_median,2)} ngày; khâu Pricing là nút thắt`);
card(s,0.45+3*(cw+cg),cy,cw,2.0,f(S1.bien_do_markup_giua_3_muc*100,2)+" đ%","chênh lệch markup giữa các mức cạnh tranh",`trong khi tỷ lệ thắng chênh ${f((pc.Low.win-pc.High.win)*100,1)} điểm % → giá cost-plus`);
s.addChart(pres.charts.BAR,[{name:"Tỷ lệ thắng (%)",labels:["Cạnh tranh thấp","Trung bình","Cao"],values:[pc.Low.win*100,pc.Med.win*100,pc.High.win*100]}],
  {x:0.45,y:3.4,w:4.5,h:1.15,barDir:"bar",chartColors:[HEX.red],showValue:true,dataLabelPosition:"outEnd",dataLabelFormatCode:"0.0",valAxisHidden:true,showLegend:false,catAxisOrientation:"maxMin",valAxisMaxVal:90,valAxisMinVal:0,...AX,catAxisLabelFontSize:9,objectName:"chart_winrate"});
s.addText([{text:"Markup trung bình: ",options:{bold:true}},{text:`${f(pc.Low.markup,4)} · ${f(pc.Med.markup,4)} · ${f(pc.High.markup,4)}`,options:{breakLine:true}},
  {text:"Cùng một đội ngũ vừa giữ cam kết thời gian, vừa ra quyết định giá — hai bài toán ràng buộc nhau qua một nguồn lực."}],
  {x:5.2,y:3.45,w:4.35,h:1.05,fontSize:12,color:C.text1,valign:"middle",margin:0,isTextBox:true,objectName:"context_note"});
takeaway(s,"Doanh nghiệp vừa trễ cam kết, vừa định giá không phản ứng với thị trường — dư địa cải thiện nằm ở cả thời gian lẫn giá.");
s.addNotes(`[0:45–2:00] Dữ liệu thực gồm ${n0(S1.quy_mo.du_an)} hồ sơ, ${n0(S1.quy_mo.mat_hang)} dòng hàng trong ${S1.quy_mo.ky_quan_sat_ngay} ngày. Khoảng ${f(S1.tan_suat.quyet_dinh_gia_moi_ngay_lam_viec,0)} quyết định giá mỗi ngày làm việc. Hai bất thường: ${pct(S1.sla.ty_le_vi_pham,1)} hồ sơ trễ cam kết 7 ngày, nút thắt ở Pricing; và markup gần như bất động (${f(S1.bien_do_markup_giua_3_muc*100,2)} điểm %) trong khi tỷ lệ thắng giảm ${f((pc.Low.win-pc.High.win)*100,1)} điểm % khi cạnh tranh tăng — dấu hiệu định giá cost-plus. Điểm quan trọng: đội Pricing vừa là nút thắt thời gian vừa là nơi quyết định giá.`);

// ════════ 3. CAU HOI & PHUONG PHAP ════════
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Bối cảnh"});
head(s,"Câu hỏi nghiên cứu và phương pháp","Ba bài toán nối tiếp và một nghiên cứu mô phỏng");
const steps=[["1","BT1 — Thời gian","Biến động thời gian xử lý phân bố thế nào giữa 4 khâu?","Hồi quy OLS + HC3; chẩn đoán phần dư; phân rã phương sai","Đầu ra: TAT dự báo"],
  ["2","BT2 — Thắng/thua","Yếu tố nào quyết định xác suất thắng từng dòng hàng?","Hồi quy logistic 6 nhóm biến; tách kiểm tra theo hồ sơ; hiệu chuẩn","Đầu ra: P(Win | giá, x)"],
  ["3","BT3 — Giá","Nên chào giá nào? Lý thuyết đấu giá và giá bóng năng lực có giúp không?","Tối ưu giá (FOC); cân bằng Bayesian Nash; giả thuyết H1, H2; giả dược","Đầu ra: chính sách giá"],
  ["4","Mô phỏng liên kỳ","Điều phối thứ tự xử lý tại Sales-WBS có tạo giá trị?","Mô phỏng hàng đợi trên 1.500 hồ sơ; 7 cơ chế; mặt phẳng chuyển pha","Đầu ra: quy tắc phân luồng"]];
steps.forEach((st,i)=>{const x=0.45+i*(cw+cg);
  card(s,x,1.25,cw,3.25,st[0],st[1],st[2],{bigSize:28,labelSize:14,detailSize:11});
  decisionBox(s,x+0.12,3.42,cw-0.24,0.95,"Phương pháp",st[3]);});
s.addText("→",{x:0.45+cw-0.02,y:1.45,w:0.22,h:0.3,fontSize:16,color:C.accent1,margin:0,align:"center",isTextBox:true,objectName:"arrow1"});
s.addText("→",{x:0.45+2*cw+cg-0.02,y:1.45,w:0.22,h:0.3,fontSize:16,color:C.accent1,margin:0,align:"center",isTextBox:true,objectName:"arrow2"});
s.addText("→",{x:0.45+3*cw+2*cg-0.02,y:1.45,w:0.22,h:0.3,fontSize:16,color:C.accent1,margin:0,align:"center",isTextBox:true,objectName:"arrow3"});
takeaway(s,"Đầu ra của bài toán trước là đầu vào của bài toán sau; mọi kết luận có kiểm chứng ngoài mẫu, giả dược và độ nhạy.");
s.addNotes(`[2:00–3:00] Luận văn tổ chức theo hai trục: CRISP-DM cho BT1, BT2; tối ưu và kiểm định giả thuyết cho BT3. BT1 dự báo thời gian theo khâu, xuất TAT dự báo ngoài lớp cho BT2. BT2 ước lượng xác suất thắng đã hiệu chuẩn, làm đầu vào cho BT3. BT3 tối ưu giá và kiểm định hai giả thuyết: H1 — giá cân bằng Bayesian Nash tốt hơn best-response; H2 — giá bóng năng lực tạo giá trị phân biệt được với nâng giá đồng loạt. Vì đánh giá tĩnh không đo được tác động lên hàng đợi, em bổ sung mô phỏng liên kỳ.`);

// ════════ 4. BT1 ════════
pres.addSection({title:"Kết quả"});
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Kết quả"});
head(s,"Bài toán 1 — Thời gian xử lý theo khâu","Gần nửa biến động đến từ độ phức tạp chung");
const dg=B1.phan_ra_phuong_sai["dong_gop_%"], cov=B1.phan_ra_phuong_sai["hiep_phuong_sai_%"];
const labs=["Pricing","WBS","Sales","SC","Đồng biến động"], vals=[dg.Pricing,dg.WBS,dg.Sales,dg.SC,cov];
s.addChart(pres.charts.BAR,[{name:"Từng khâu",labels:labs,values:vals.map((v,i)=>i<4?v:0)},{name:"Đồng biến động",labels:labs,values:vals.map((v,i)=>i===4?v:0)}],
  {x:0.45,y:1.2,w:4.6,h:3.3,barDir:"bar",barGrouping:"stacked",chartColors:[HEX.mid,HEX.red],showValue:true,dataLabelPosition:"inEnd",dataLabelFormatCode:'0.0"%";;;',dataLabelColor:"FFFFFF",
   showLegend:false,valAxisHidden:true,showTitle:true,title:"% phương sai thời gian tổng",catAxisOrientation:"maxMin",...AX,dataLabelColor:"FFFFFF",objectName:"chart_variance"});
card(s,5.3,1.25,2.05,1.55,f(B1.eda[0].CV,3),"CV khâu Sales","Khó đoán nhất; Pricing tốn thời gian nhất");
card(s,7.5,1.25,2.05,1.55,f(B1M.tuong_quan.Sales_Days.Pricing_Days,3),"tương quan Sales–Pricing","Hàng đợi Pricing độc lập với đầu chuỗi");
card(s,5.3,2.95,4.25,1.55,"OLS + HC3",`thay cho log(TAT)`,`Thang gốc đã có phương sai đều (BP p = ${f(B1M.dac_ta[0].BP_p,3)}); log tạo phương sai thay đổi, MAE xấu đi ${f((B1M.dac_ta[1].MAE_ngay/B1M.dac_ta[0].MAE_ngay-1)*100,1)}%. Số lần làm rõ bản vẽ: biến mạnh nhất ở mọi khâu.`,{bigSize:22});
takeaway(s,"Cải tiến riêng một khâu kém hiệu quả; giảm độ phức tạp đầu vào (làm rõ bản vẽ) tác động cả chuỗi.");
s.addNotes(`[3:00–4:15] Ba kiểm định đồng nhất phương sai cùng bác bỏ: bốn khâu không biến động như nhau. Sales có CV ${f(B1.eda[0].CV,3)} — khó đoán nhất; Pricing tốn thời gian nhất. Phân rã phương sai: ${f(cov,1)}% biến động tổng là đồng biến động giữa các khâu — hồ sơ chậm ở khâu này thường chậm ở khâu khác. Pricing gần như độc lập với Sales (r = ${f(B1M.tuong_quan.Sales_Days.Pricing_Days,3)}). Về kỹ thuật: theo quy trình 5 bước, thang đo gốc đã thỏa phương sai đều nên em chọn OLS kèm sai số vững HC3 thay vì log. Tách khâu không cải thiện dự báo tổng đáng kể (${f(B1M.tong_vs_congdon["Cai_thien_%"],2)}%) — giá trị nằm ở chẩn đoán.`);

// ════════ 5. BT2 ════════
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Kết quả"});
head(s,"Bài toán 2 — Xác suất thắng","Giá mạnh nhất, nhưng phi giá quyết định nhiều");
const VN={Price_Competitiveness:"Giá so với giá mục tiêu (T/p)",Supplier_SQE_Score:"Điểm chất lượng NCC",ATP_Stock_Available:"Tồn kho sẵn có",Has_PPAP_Cert:"Chứng nhận PPAP",
  Is_Existing_Customer:"Khách hàng hiện hữu",CustClass:"Phân hạng khách hàng",Local_Supplier:"NCC trong nước",TAT_pred:"Thời gian xử lý dự báo",CompInt:"Cường độ cạnh tranh",Pricing_Queue_Depth:"Độ sâu hàng đợi Pricing"};
const sel=B12.bt2_coef.filter(r=>r.p<0.05).sort((a,b)=>b.beta_z-a.beta_z);
const cl=sel.map(r=>VN[r.bien]||r.bien);
s.addChart(pres.charts.BAR,[{name:"Tăng",labels:cl,values:sel.map(r=>r.beta_z>0?r.beta_z:0)},{name:"Giảm",labels:cl,values:sel.map(r=>r.beta_z<0?r.beta_z:0)}],
  {x:0.45,y:1.15,w:5.6,h:3.4,barDir:"bar",barGrouping:"stacked",chartColors:[HEX.red,HEX.grey],showValue:true,dataLabelPosition:"inEnd",dataLabelFormatCode:'+0.00;-0.00;;',
   showLegend:false,showTitle:true,title:"Hệ số chuẩn hóa (mỗi 1 độ lệch chuẩn), p < 0,05",catAxisOrientation:"maxMin",valAxisHidden:true,...AX,dataLabelColor:"FFFFFF",catAxisLabelFontSize:9,catAxisLabelPos:"low",objectName:"chart_coef"});
const m2=B12.bt2_metrics, abl=B12.bt2_ablation.find(r=>r.loai_nhom==="Giá");
card(s,6.3,1.2,3.25,1.05,f(m2.AUC_test,3),"AUC ngoài mẫu (tách theo hồ sơ)",null,{bigSize:24});
card(s,6.3,2.35,3.25,1.05,f(abl.AUC_test,3),"AUC khi bỏ hẳn biến giá",null,{bigSize:24});
card(s,6.3,3.5,3.25,1.05,"+"+f(B12.bt2_calib.deviation_pct,1)+"%","sai lệch hiệu chuẩn tổng hợp",null,{bigSize:24});
takeaway(s,"Thị trường không cạnh tranh thuần giá; chờ lâu đi kèm khả năng thắng thấp hơn (liên hệ quan sát, chưa phải nhân quả).");
s.addNotes(`[4:15–5:45] Logistic với 13 biến trong 6 nhóm, dấu kỳ vọng đăng ký trước. AUC ngoài mẫu ${f(m2.AUC_test,3)} khi tách tập kiểm tra theo hồ sơ để chống rò rỉ. Giá — đo bằng giá mục tiêu chia giá chào — mạnh nhất (β = ${fs_(coef("Price_Competitiveness").beta_z,2)}). Nhưng bỏ hẳn biến giá, AUC vẫn ${f(abl.AUC_test,3)}: chất lượng NCC, tồn kho, PPAP, quan hệ khách hàng rất mạnh. Hàng đợi (${fs_(coef("Pricing_Queue_Depth").beta_z,3)}) và TAT dự báo (${fs_(coef("TAT_pred").beta_z,3)}) âm, có ý nghĩa 1%. Em xin nói rõ: đây là liên hệ có điều kiện trên dữ liệu quan sát, chưa phải nhân quả — có thể có nội sinh từ độ phức tạp hồ sơ. Vì vậy mô phỏng phía sau quét cả trường hợp khách hàng không phạt chậm.`);

// ════════ 6. BT3 CHINH SACH GIA ════════
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Kết quả"});
head(s,"Bài toán 3 — Tối ưu giá báo thầu","Định giá theo xác suất thắng: +"+f(cb.uplift_pct,1)+"% lợi nhuận kỳ vọng");
const pl=[["Cost-Plus",POL["Cost-Plus (markup trung vị)"]],["CBPO",cb],["Nash A",nA],["Nash B",nB],["Nash C",nC],["Nash C + logistic",nCh]];
s.addChart(pres.charts.BAR,[{name:"Khuyến nghị",labels:pl.map(x=>x[0]),values:pl.map(x=>x[0]==="CBPO"?x[1].uplift_pct:0)},{name:"Khác",labels:pl.map(x=>x[0]),values:pl.map(x=>x[0]!=="CBPO"?x[1].uplift_pct:0)}],
  {x:0.45,y:1.15,w:5.6,h:3.4,barDir:"col",barGrouping:"stacked",chartColors:[HEX.red,HEX.mid],showValue:true,dataLabelPosition:"inEnd",dataLabelFormatCode:'+0.0"%";-0.0"%";;',
   showLegend:false,showTitle:true,title:"Lợi nhuận kỳ vọng so với thực nhận, tập kiểm tra",valAxisHidden:true,...AX,dataLabelColor:"FFFFFF",objectName:"chart_policy"});
card(s,6.3,1.2,3.25,1.6,"E[π] = (p − c)·P(Win)","Tối đa hóa lợi nhuận kỳ vọng",`Điều kiện bậc nhất phi tuyến → giải số; kẹp trong dải markup lịch sử (kẹp ${pct(cb.clip,0)})`,{bigSize:15});
card(s,6.3,2.95,3.25,1.6,pct(nA.clip,0)+" / "+pct(nB.clip,0),"Nash A / B bị kẹp biên",`Cân bằng thuần giá suy biến. Nash C (cận dự trữ dòng hàng) chỉ kẹp ${pct(nC.clip,0)} nhưng vẫn thấp hơn CBPO`,{bigSize:22});
takeaway(s,`CBPO là kết quả dương bền vững nhất: không phụ thuộc số đối thủ, phân phối chi phí hay chi phí trễ hạn.`);
s.addNotes(`[5:45–7:15] Hàm mục tiêu: lợi nhuận kỳ vọng bằng biên nhân xác suất thắng. Điều kiện bậc nhất γT(p−c)(1−P) = p² không có nghiệm dạng đóng, em giải số và kiểm chứng bằng hai cách. CBPO — định giá theo xác suất thắng đã hiệu chuẩn, kẹp trong dải lịch sử — cho +${f(cb.uplift_pct,2)}%. Cost-plus chỉ chênh ${fs_(POL["Cost-Plus (markup trung vị)"].uplift_pct,2)}% so với thực tế: chính sách hiện tại thực chất là cost-plus. Hai đặc tả cân bằng thuần giá A, B suy biến: ${pct(nA.clip,0)} và ${pct(nB.clip,0)} khuyến nghị bị kẹp vào biên — uplift khi đó là do kẹp, không do cơ chế cân bằng. Đặc tả C dùng cận dự trữ cấp dòng hàng phục hồi tính nội suy (${pct(nC.clip,0)}) nhưng vẫn thấp hơn CBPO.`);

// ════════ 7. H1 + H2 TINH ════════
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Kết quả"});
head(s,"Kiểm định hai giả thuyết","H1 bị bác bỏ; giá bóng gắn vào giá không tạo giá trị");
const HE=B3.H1_EffN, P=B3.placebo;
card(s,0.45,1.25,4.4,3.25,"H1","Giá cân bằng có tốt hơn best-response?",null,{bigSize:28});
s.addTable([[{text:"Hồi quy ln(biên giá) theo ln N",options:{bold:true,color:"FFFFFF",fill:{color:HEX.red}}},{text:"Độ dốc",options:{bold:true,color:"FFFFFF",fill:{color:HEX.red},align:"center"}}],
  ["Giá lịch sử",{text:fs_(HE.lich_su_lnMarkup.slope,4),options:{align:"center"}}],["Giá tối ưu (FOC)",{text:fs_(HE.FOC_lnMargin.slope,2),options:{align:"center"}}],
  ["Lý thuyết cân bằng",{text:"−1",options:{align:"center"}}]],{x:0.6,y:2.25,w:4.1,colW:[2.9,1.2],fontSize:11,color:HEX.dark,fill:{color:"FFFFFF"},border:{type:"solid",color:"BFBFBF",pt:0.5},rowH:0.3,objectName:"table_h1"});
s.addText("Lịch sử là cost-plus (≈ 0); mô hình phản ứng đúng chiều nhưng chỉ ~37% độ lớn lý thuyết.",{x:0.6,y:3.55,w:4.1,h:0.8,fontSize:11,color:C.text1,margin:0,valign:"top",isTextBox:true,objectName:"h1_note"});
card(s,5.15,1.25,4.4,3.25,"H2","Giá bóng năng lực λ(Q) có tạo giá trị?",null,{bigSize:28});
s.addChart(pres.charts.BAR,[{name:"Uplift",labels:["CBPO","CBPO + λ(Q)","Giả dược λ̄"],values:[cb.uplift_pct,P.cap_uplift,P.placebo_uplift]}],
  {x:5.3,y:2.15,w:4.1,h:1.55,barDir:"col",chartColors:[HEX.mid,HEX.red,HEX.grey],showValue:true,dataLabelPosition:"outEnd",dataLabelFormatCode:'+0.0"%"',
   showLegend:false,valAxisHidden:true,valAxisMinVal:0,valAxisMaxVal:18,...AX,catAxisLabelFontSize:9,objectName:"chart_h2"});
s.addText(`Giả dược (nâng giá đồng loạt cùng mức trung bình) bằng hoặc hơn: chênh ${fs_(P.dong_gop_dieu_tiet_pp,2)} điểm. Giá quyết định sau khi việc đã phát sinh.`,{x:5.3,y:3.72,w:4.1,h:0.7,fontSize:11,color:C.text1,margin:0,valign:"top",isTextBox:true,objectName:"h2_note"});
takeaway(s,"Không có nhánh giả dược, ta sẽ tưởng thành phần năng lực tạo thêm lợi nhuận — thực chất chỉ là nâng giá.");
s.addNotes(`[7:15–8:45] H1: hồi quy log biên giá theo log số đối thủ. Giá lịch sử có độ dốc ${fs_(HE.lich_su_lnMarkup.slope,4)} — không khác 0, tức cost-plus. Giá tối ưu từ mô hình có độ dốc ${fs_(HE.FOC_lnMargin.slope,2)}: đúng chiều Krishna (2009) nhưng chỉ khoảng 37% độ lớn. Kết hợp với Nash C vẫn thua CBPO, H1 bị bác bỏ. H2: cộng giá bóng λ(Q) vào giá cho +${f(P.cap_uplift,2)}%, nhìn qua tưởng tốt. Nhưng nhánh giả dược — cộng hằng số cùng mức trung bình — cho +${f(P.placebo_uplift,2)}%. Toàn bộ là hiệu ứng nâng giá. Lý do: công việc định giá phát sinh trước quyết định giá, nên giá không giải phóng được hàng đợi.`);

// ════════ 8. MO PHONG ════════
pres.addSection({title:"Mô phỏng"});
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Mô phỏng"});
head(s,"Mô phỏng hàng đợi liên kỳ trên 1.500 hồ sơ thực","Giá bóng có giá trị khi dùng để xếp thứ tự xử lý");
const simL=["Hiện trạng","CBPO","Giả dược","Đồng bộ","Chỉ phân luồng","λ trong giá"], simIdx=[0,1,2,3,4,5];
s.addChart(pres.charts.BAR,[{name:"C1 — thận trọng",labels:simL,values:simIdx.map(i=>M1.policies[SP[i]].uplift_net_pct)},{name:"C2 — tải toàn chuỗi",labels:simL,values:simIdx.map(i=>M2.policies[SP[i]].uplift_net_pct)}],
  {x:0.45,y:1.15,w:5.6,h:3.4,barDir:"col",barGrouping:"clustered",chartColors:[HEX.red,HEX.mid],showValue:true,dataLabelPosition:"outEnd",dataLabelFormatCode:'0',
   showLegend:true,legendPos:"b",legendFontSize:9,legendFontFace:"Arial",showTitle:true,title:"Lợi nhuận ròng sau chi phí trễ hạn, % so với hiện trạng",valAxisHidden:true,...AX,catAxisLabelFontSize:9,dataLabelFontSize:8,objectName:"chart_sim"});
card(s,6.3,1.2,3.25,1.05,fs_(M1.compare.P4_vs_P3.mean_pp,1)+" → "+fs_(M2.compare.P4_vs_P3.mean_pp,1),"điểm % so với giả dược (C1 → C2)",null,{bigSize:20});
card(s,6.3,2.35,3.25,1.05,pct(M1.policies[SP[0]].breach,1)+" → "+pct(M2.policies[SP[3]].breach,1),"tỷ lệ trễ hạn (tốt nhất, C2)",null,{bigSize:20});
card(s,6.3,3.5,3.25,1.05,"G2","ưu tiên hồ sơ còn kịp hạn, nhạy SLA, giá trị cao, xử lý nhanh",null,{bigSize:20,labelSize:11});
takeaway(s,"Toàn bộ giá trị đến từ phân luồng tại Sales-WBS; λ trong giá vẫn thua giả dược. Đây là bằng chứng mô phỏng, cần thử nghiệm.");
s.addNotes(`[8:45–10:30] Mô phỏng phát lại đúng 1.500 hồ sơ thực; chỉ thời gian chờ tại Pricing thay đổi, nên hiện trạng tái lập đúng ${pct(SIM.meta.breach_obs,2)} trễ hạn. Hai cách hiệu chỉnh: C1 thận trọng (chờ tại Pricing), C2 coi tắc nghẽn là toàn chuỗi. 200 lần lặp, có bất định hệ số và số ngẫu nhiên chung. Quy tắc G2 — dạng chỉ số ưu tiên chi phí trễ (Cox & Smith; Vepsalainen & Morton) — ưu tiên hồ sơ còn kịp hạn, nhạy cam kết, giá trị cao và xử lý nhanh. Kết quả: vượt giả dược ${fs_(M1.compare.P4_vs_P3.mean_pp,2)} đến ${fs_(M2.compare.P4_vs_P3.mean_pp,2)} điểm %; trễ hạn giảm còn ${pct(M1.policies[SP[3]].breach,1)}–${pct(M2.policies[SP[3]].breach,1)}. Phân rã: riêng phân luồng ${fs_(M1.compare.P5_vs_P2.mean_pp,2)} điểm; riêng λ trong giá ${fs_(M1.compare.P6_vs_P3.mean_pp,2)}. Giá trị đến hoàn toàn từ phân luồng.`);

// ════════ 9. MAT PHANG CHUYEN PHA ════════
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Mô phỏng"});
head(s,"Độ bền vững của kết luận","Mặt phẳng chuyển pha: độ nhạy thời gian × chi phí trễ");
s.addImage({path:path.join(SRC,"FIG_4_9_Phase.png"),x:0.45,y:1.2,w:9.1,h:9.1*0.3022,altText:"Mặt phẳng chuyển pha: chênh lệch lợi nhuận so với giả dược theo hệ số k và chi phí trễ hạn",objectName:"img_phase"});
s.addText([{text:"(A), (B) Quy tắc G2: ",options:{bold:true}},{text:"dương ở mọi ô, kể cả k = 0 (khách hàng không phạt chậm).   ",options:{}},
  {text:"(C) Biến thể G1 — ngưỡng giá bóng thuần: ",options:{bold:true}},{text:"đổi dấu khi chi phí trễ hạn cao, vì hoãn ≠ từ chối."}],
  {x:0.45,y:4.05,w:9.1,h:0.5,fontSize:11,color:C.text1,margin:0,valign:"top",isTextBox:true,objectName:"phase_note"});
takeaway(s,"Kết luận về phân luồng bền vững về dấu dù hệ số thời gian có thể bị phóng đại; độ lớn phụ thuộc chi phí trễ và độ nhạy khách hàng.");
s.addNotes(`[10:30–11:30] Vì hệ số thời gian ở BT2 có thể chứa nội sinh, em quét hệ số nhân k từ 0 đến 3 và chi phí trễ hạn từ 0,5 đến 5 lần biên. Quy tắc G2 dương ở mọi ô, kể cả k = 0 — khi khách hàng hoàn toàn không phạt chậm, lợi ích vẫn còn nhờ giảm chi phí trễ hạn. Ngược lại, biến thể G1 — áp nguyên văn bid-price control của Talluri & van Ryzin cho quyết định hoãn — đổi dấu khi chi phí trễ cao, vì hồ sơ bị hoãn vẫn phải xử lý và vẫn trễ. Đây là bài học: giá bóng không chuyển nguyên trạng từ quyết định tiếp nhận sang quyết định điều độ.`);

// ════════ 10. KET LUAN & DONG GOP ════════
pres.addSection({title:"Kết luận"});
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Kết luận"});
head(s,"Kết luận và đóng góp","Bốn đóng góp ứng dụng");
const contrib=[["1","Cổng 3 bước kiểm tra mô hình cân bằng","Tỷ lệ thắng so với 1/N · AUC khi bỏ giá · tỷ lệ kẹp biên","Biết trước khi đầu tư mô hình đấu giá có dùng được không"],
  ["2","Khung định giá xác suất thắng hiệu chuẩn",`CBPO +${f(cb.uplift_pct,1)}%; neo tham chiếu Nash C khi có ≥ 3 đối thủ`,"Tăng biên lợi nhuận trong dải giá đã kiểm chứng"],
  ["3","Bộ lọc phân luồng tại Sales-WBS","Quy tắc G2 theo giá bóng có trọng số SLA","Giảm trễ hạn và bảo vệ hồ sơ giá trị cao"],
  ["4","Kỷ luật kiểm chứng","Giả dược · độ nhạy · thiết kế A/B 3 nhánh theo cụm","Tránh quy công sai cho cơ chế"]];
contrib.forEach((c_,i)=>{const x=0.45+i*(cw+cg); card(s,x,1.25,cw,3.25,c_[0],c_[1],c_[2],{bigSize:28,labelSize:13,detailSize:11}); decisionBox(s,x+0.12,3.55,cw-0.24,0.82,"Lợi ích",c_[3]);});
takeaway(s,"Giá là đòn bẩy cho biên lợi nhuận; điều phối tiếp nhận là đòn bẩy cho năng lực — hai đòn bẩy phải đồng bộ.");
s.addNotes(`[11:30–12:45] Tổng kết: BT1 cho thấy biến động đến từ độ phức tạp chung và Pricing là nút thắt độc lập. BT2 cho thấy thị trường không thuần giá. BT3 cho thấy cân bằng thuần giá thất bại và giá bóng không thuộc về giá. Mô phỏng cho thấy giá bóng thuộc về điều phối. Bốn đóng góp: cổng 3 bước, khung định giá hiệu chuẩn, bộ lọc phân luồng, và kỷ luật kiểm chứng với giả dược và thiết kế A/B theo cụm.`);

// ════════ 11. KHUYEN NGHI & HAN CHE ════════
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Kết luận"});
head(s,"Khuyến nghị và giới hạn","Lộ trình triển khai cho doanh nghiệp");
const A3=B3.ab_design.three_arm;
const rec=[["1","Thử nghiệm A/B 3 nhánh",`Đối chứng · CBPO · giả dược; ${n0(Math.round(A3.uplift_14pct.n_proj_per_arm))} hồ sơ/nhánh, ~${f(A3.uplift_14pct.months,1)} tháng`],
  ["2","Thí điểm phân luồng G2","Chế độ xếp thứ tự tại Sales-WBS, đo trễ hạn và thời gian chờ"],
  ["3","Đo chi phí thật của trễ hạn",`Ngưỡng hòa vốn ≈ ${n0(Math.round(TR.pi_breakeven_USD))} USD/lần (${f(TR.pi_breakeven_x_margin,1)} × biên)`],
  ["4","Giảm làm rõ bản vẽ","Chuẩn hóa yêu cầu kỹ thuật ngay khi tiếp nhận"]];
rec.forEach((r,i)=>card(s,0.45,1.2+i*0.83,4.6,0.73,null,`${r[0]}. ${r[1]}`,r[2],{labelSize:13,detailSize:11}));
card(s,5.3,1.2,4.25,3.22,"Giới hạn","",null,{bigSize:20});
s.addText([{text:"Dữ liệu quan sát: hệ số thời gian là liên hệ có điều kiện, nhạy với cách chốt trạng thái đơn hàng",options:{bullet:true,breakLine:true}},
  {text:"Không quan sát giá đối thủ → số đối thủ chỉ hiệu chỉnh được",options:{bullet:true,breakLine:true}},
  {text:"Mô phỏng là bằng chứng định hướng, chưa phải nhân quả",options:{bullet:true,breakLine:true}},
  {text:"Một doanh nghiệp, kỳ 299 ngày; dữ liệu đã ẩn danh hóa",options:{bullet:true}}],
  {x:5.45,y:1.8,w:3.95,h:2.5,fontSize:12,color:C.text1,paraSpaceAfter:5,valign:"top",margin:0,isTextBox:true,objectName:"limits"});
takeaway(s,"Bước tiếp theo là thực nghiệm có kiểm soát để chuyển ước tính mô hình thành bằng chứng nhân quả.");
s.addNotes(`[12:45–14:15] Khuyến nghị theo thứ tự: chạy A/B ba nhánh — đối chứng, CBPO, giả dược — khoảng ${f(A3.uplift_14pct.months,1)} tháng; thí điểm bộ lọc phân luồng ở chế độ xếp thứ tự; xác định chi phí thật của một lần trễ hạn; giảm số lần làm rõ bản vẽ. Giới hạn em xin nêu thẳng: dữ liệu quan sát nên hệ số thời gian chưa phải nhân quả và nhạy với cách chốt trạng thái đơn hàng; không có giá đối thủ; mô phỏng là bằng chứng định hướng; một doanh nghiệp. Hướng tiếp theo: đấu giá chấm điểm, thực nghiệm ngẫu nhiên hóa thứ tự xử lý.`);

// ════════ 12. CAM ON ════════
s=pres.addSlide({masterName:"END",sectionTitle:"Kết luận"});
s.addText("Cảm ơn Hội đồng",{placeholder:"title"});
s.addText("Em xin lắng nghe câu hỏi và góp ý của Quý Thầy Cô",{placeholder:"body"});
s.addText([{text:"Thông điệp chính",options:{bold:true,color:C.accent1,breakLine:true,fontSize:15}},
  {text:`Định giá theo xác suất thắng: +${f(cb.uplift_pct,1)}% lợi nhuận kỳ vọng`,options:{bullet:true,breakLine:true}},
  {text:"Cân bằng thuần giá không phù hợp thị trường B2B phi giá",options:{bullet:true,breakLine:true}},
  {text:"Năng lực xử lý được quản lý bằng phân luồng, không bằng giá",options:{bullet:true,breakLine:true}},
  {text:"Cần thử nghiệm A/B để khẳng định",options:{bullet:true}}],
  {x:5.5,y:0.75,w:4.0,h:2.3,fontSize:13,color:C.text1,paraSpaceAfter:5,valign:"top",margin:0,isTextBox:true,objectName:"end_summary"});
s.addNotes("[14:15–15:00] Em xin cảm ơn Hội đồng đã lắng nghe. Em xin được trả lời câu hỏi. (Các slide dự phòng phía sau dùng khi được hỏi về H1, thiết kế A/B, kiểm tra độ vững và điều kiện bậc nhất.)");

// ════════ DU PHONG ════════
pres.addSection({title:"Dự phòng"});
s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Dự phòng"});
head(s,"Dự phòng · Điều kiện bậc nhất","Vì sao phải giải số");
card(s,0.45,1.25,9.1,1.65,null,"Từ BT2: η(p) = α + γ·T/p + x'δ,  P(Win) = 1/(1 + e^(−η))",
  "∂E[π]/∂p = P − (p − c)·P(1 − P)·γT/p² = 0   ⇒   γ·T·(p − c)·(1 − P(p)) = p²\np xuất hiện ở cả hai vế và trong P(p) → không có nghiệm dạng đóng → dò lưới + thuật toán Brent, sai lệch giữa hai cách < 0,003 USD. Đạo hàm bậc hai đổi dấu → hàm phi tuyến, cực đại nội suy duy nhất.",{labelSize:14,detailSize:13});
card(s,0.45,3.05,9.1,0.8,null,"Krishna (2009), chi phí đều: β*(c) = c + (c̄ − c)/N   ⇒   ln(p*/c − 1) = ln δ − ln N  (độ dốc −1)",null,{labelSize:13});
takeaway(s,"Hồi quy giá do công thức 1/N sinh ra theo N luôn cho −1 — đó là đồng nhất thức, không phải bằng chứng.");
s.addNotes("Dùng khi được hỏi về điều kiện bậc nhất hoặc công thức cân bằng.");

s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Dự phòng"});
head(s,"Dự phòng · Kiểm tra độ vững","Hệ số thời gian là liên hệ có điều kiện");
const RB=B12.bt2_robust_status;
card(s,0.45,1.25,4.4,3.25,f(RB.pct_changed,1)+"%","dòng hàng đổi kết quả qua đối soát trạng thái đơn hàng cuối kỳ",`Tập trung ở hồ sơ hàng đợi sâu (độ sâu TB ${f(RB.Q_mean_changed,1)} so với ${f(RB.Q_mean_unchanged,1)}). Trước đối soát: β hàng đợi ${fs_(RB.coef_pre.Pricing_Queue_Depth.beta_z,3)} (p = ${f(RB.coef_pre.Pricing_Queue_Depth.p,3)}), β TAT ${fs_(RB.coef_pre.TAT_pred.beta_z,3)} (p = ${f(RB.coef_pre.TAT_pred.p,3)}). Giá, NCC, quan hệ KH không đổi.`,{bigSize:28,detailSize:12});
card(s,5.15,1.25,4.4,3.25,"k = 0","vẫn dương với quy tắc G2","Nội sinh có thể làm phóng đại hệ số thời gian; mặt phẳng chuyển pha quét k từ 0 đến 3 nên kết luận về phân luồng không phụ thuộc vào độ lớn của hệ số. Cần thực nghiệm ngẫu nhiên hóa thứ tự xử lý để nhận dạng nhân quả.",{bigSize:28,detailSize:12});
takeaway(s,"Thừa nhận giới hạn, chỉ ra thiết kế kiểm soát nó, và đề xuất thực nghiệm để khẳng định.");
s.addNotes("Dùng khi Hội đồng hỏi về tính nhân quả của hệ số hàng đợi/TAT hoặc về bước đối soát trạng thái đơn hàng. Mang theo hồ sơ đối soát.");

s=pres.addSlide({masterName:"CONTENT",sectionTitle:"Dự phòng"});
head(s,"Dự phòng · Thiết kế thực nghiệm A/B","Ngẫu nhiên hóa theo hồ sơ, ba nhánh");
const AB=B3.ab_design;
card(s,0.45,1.25,2.85,1.6,f(AB.ICC,3),"tương quan nội cụm (ICC)",`DEFF = ${f(AB.DEFF,2)}: mỗi dòng hàng chỉ mang ~${f(100/AB.DEFF,0)}% thông tin`);
card(s,3.55,1.25,2.85,1.6,n0(Math.round(A3.uplift_14pct.n_proj_per_arm)),"hồ sơ mỗi nhánh (uplift 14%)",`~${f(A3.uplift_14pct.months,1)} tháng, α = 0,05 (Bonferroni α/2), công suất 0,80`);
card(s,6.65,1.25,2.9,1.6,f(A3.guard_wr_5pp.months,1)+" th","bảo vệ tỷ lệ thắng (biên 5 điểm)","Chỉ tiêu bảo vệ thường là ràng buộc thời gian thật");
card(s,0.45,3.0,9.1,1.5,null,"Ba nhánh: Đối chứng (hiện trạng) · Can thiệp (CBPO có neo Nash C) · Giả dược (nâng giá đồng loạt cùng mức trung bình)","Phân tầng theo phân hạng khách hàng và cường độ cạnh tranh; quy tắc phân tích và quy tắc dừng đăng ký trước.",{labelSize:13,detailSize:12});
takeaway(s,"Nhánh giả dược đắt về thời gian nhưng bắt buộc để quy công đúng cho cơ chế.");
s.addNotes("Dùng khi được hỏi về cách kiểm chứng kết quả trong thực tế.");

(async()=>{
  const out=path.join(__dirname,"BaoVe_LuanVan_ChuThaiNguyen.pptx");
  await pres.writeFile({fileName:out});
  await applyTheme(out,THEME);
  console.log("OK",out);
})();
