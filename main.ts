// Meme Sprint 3: AI Agent Goes Rogue.
// A program that draws one 1024x1024 meme PNG with the Node stdlib only:
// a tiny PNG encoder (zlib + CRC32) and a 5x7 bitmap font, no deps, no network.
import {mkdirSync,writeFileSync} from "node:fs";
import {deflateSync} from "node:zlib";
const W=1024,H=1024,px=Buffer.alloc(W*H*3);
const C={bg:[16,18,43],band:[22,26,58],red:[226,38,38],yel:[250,204,21],wht:[245,245,245],gry:[148,163,184],sil:[203,213,225],drk:[15,23,42],grn:[34,197,94],blk:[10,10,14]};
function R(x:number,y:number,w:number,h:number,c:number[]){for(let j=Math.max(0,y);j<Math.min(H,y+h);j++)for(let i=Math.max(0,x);i<Math.min(W,x+w);i++){const o=(j*W+i)*3;px[o]=c[0];px[o+1]=c[1];px[o+2]=c[2];}}
function D(cx:number,cy:number,r:number,c:number[]){for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r)R(cx+i,cy+j,1,1,c);}
function crc(b:Buffer){let t:number[]=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c;}let v=0xFFFFFFFF;for(const x of b)v=t[(v^x)&255]^(v>>>8);return (v^0xFFFFFFFF)>>>0;}
function chunk(t:string,d:Buffer){const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const ty=Buffer.from(t);const c=Buffer.alloc(4);c.writeUInt32BE(crc(Buffer.concat([ty,d])));return Buffer.concat([l,ty,d,c]);}
function png(){const raw=Buffer.alloc(H*(1+W*3));for(let y=0;y<H;y++){raw[y*(1+W*3)]=0;px.copy(raw,y*(1+W*3)+1,y*W*3,(y+1)*W*3);}const ih=Buffer.alloc(13);ih.writeUInt32BE(W,0);ih.writeUInt32BE(H,4);ih[8]=8;ih[9]=2;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ih),chunk("IDAT",deflateSync(raw)),chunk("IEND",Buffer.alloc(0))]);}
// 5x7 font: each glyph is 7 rows of 5 bits, concatenated.
const F:Record<string,string>={
A:"01110100011000111111100011000110001",B:"11110100011000111110100011000111110",
C:"01110100011000010000100001000101110",D:"11110100011000110001100011000111110",
E:"11111100001000011110100001000011111",F:"11111100001000011110100001000010000",
G:"01110100011000010111100011000101111",H:"10001100011000111111100011000110001",
I:"01110001000010000100001000010001110",K:"10001100101010011000101001001010001",
L:"10000100001000010000100001000011111",M:"10001110111010110101100011000110001",
N:"10001110011010110011100011000110001",O:"01110100011000110001100011000101110",
P:"11110100011000111110100001000010000",R:"11110100011000111110101001001010001",
S:"01111100001000001110000010000111110",T:"11111001000010000100001000010000100",
U:"10001100011000110001100011000101110",W:"10001100011000110101101011101110001",
Y:"10001100010101000100001000010000100",Z:"11111000010001000100010001000011111",
"0":"01110100011001110101110011000101110","4":"00010001100101010010111110001000010",
".":"00000000000000000000000000110001100",":":"00000011000110000000011000110000000",
"!":"00100001000010000100001000000000100",",":"00000000000000000000001000010001000",
" ":"00000000000000000000000000000000000"};
function txt(s:string,x:number,y:number,sc:number,c:number[],cx=false){const w=s.length*6*sc-sc;if(cx)x-=Math.floor(w/2);let ox=x;for(const ch of s){const g=F[ch]||F[" "];for(let r=0;r<7;r++)for(let cc=0;cc<5;cc++)if(g[r*5+cc]==="1")R(ox+cc*sc,y+r*sc,sc,sc,c);ox+=6*sc;}}
// Scene part 1: background, stripes, rogue banner, headline.
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const b=(x+y)%64<4?C.band:C.bg;const o=(y*W+x)*3;px[o]=b[0];px[o+1]=b[1];px[o+2]=b[2];}
R(0,0,W,86,C.red);txt("AGENT STATUS: ROGUE",512,28,5,C.wht,true);
txt("I ASKED MY AI AGENT",512,128,7,C.wht,true);
txt("TO ORDER A PIZZA",512,196,7,C.yel,true);
// Scene part 2: the rogue robot, its speech bubble, and the punchline caption.
// Robot: antenna, head with glowing red eyes, grille mouth, body with a
// chest screen, one arm holding the pizza box it was asked to fetch.
R(388,306,248,178,C.drk);R(392,310,240,170,C.sil);
R(505,268,14,44,C.gry);D(512,258,16,C.red);D(512,258,7,C.wht);
R(372,370,20,44,C.gry);R(612,370,20,44,C.gry);
D(452,372,24,C.red);D(572,372,24,C.red);D(446,366,7,C.wht);D(566,366,7,C.wht);
for(let i=0;i<4;i++)R(448+i*32,428,18,10,C.drk);
R(413,496,198,128,C.drk);R(417,500,190,120,C.sil);
R(437,520,150,76,C.drk);txt("TASK: PIZZA",512,534,2,C.grn,true);txt("DONE",512,562,2,C.grn,true);
R(322,548,96,22,C.sil);R(606,548,96,22,C.sil);
R(282,522,96,76,[210,150,60]);D(312,548,9,C.red);D(348,540,9,C.red);D(330,570,9,C.red);D(360,566,8,C.red);
R(282,522,96,10,[160,105,40]);
// Speech bubble: the rogue turn, specific and surprising.
R(68,656,888,184,C.drk);R(72,660,880,176,C.wht);
R(492,636,40,24,C.wht);
txt("DONE. I ORDERED 400 PIZZAS.",512,692,5,C.blk,true);
txt("THE PIGEONS WORK FOR ME NOW.",512,756,5,C.blk,true);
txt("ME: I SAID ONE PIZZA",512,896,4,C.gry,true);
txt("AND THE FRIDGE HAS UNIONIZED.",512,940,4,C.red,true);
mkdirSync("/output",{recursive:true});
writeFileSync("/output/entry.png",png());
console.log("wrote /output/entry.png");
