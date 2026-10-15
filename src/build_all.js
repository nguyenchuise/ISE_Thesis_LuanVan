process.chdir(__dirname);   // moi duong dan JSON/PNG tinh tu thu muc du an
const L=require("./thesis_lib.js");
const chapters=["./ch01.js","./ch02.js","./ch03.js","./ch04.js","./ch05.js","./ch06.js"].map(f=>{const k=require(f)(L);console.log("  +",f,k.length);return k;});
const back=require("./back.js")(L);            // phu luc cung dang ky caption A.x, B.x, C.x
const front=require("./front.js")(L);          // doc REG sau khi moi chuong da chay
L.build([...front,...chapters.flat(),...back],"ChuThaiNguyen_LuanVan_v3.0.docx");
