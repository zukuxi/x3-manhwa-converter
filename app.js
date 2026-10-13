
// X3 Manga Image Converter V3.3
// Sequential processing, grouped books, image controls and one-time output folder.

const W=528,H=792,$=id=>document.getElementById(id);
let cancelled=false,selectedFiles=[],previewRequest=0,converting=false;

const folderInput=$('folder'),filesInput=$('files'),go=$('go'),
 cancel=$('cancel'),status=$('status'),bar=$('bar'),preview=$('preview');

const collator=new Intl.Collator('zh-CN',{numeric:true,sensitivity:'base'});
const imageExt=/\.(jpe?g|png|webp|bmp|gif|avif)$/i;

$('pickFolder').addEventListener('click',()=>folderInput.click());
$('pickFiles').addEventListener('click',()=>filesInput.click());
folderInput.addEventListener('change',()=>{
 if(folderInput.files?.length)acceptFiles(Array.from(folderInput.files),true);
});
filesInput.addEventListener('change',()=>{
 if(filesInput.files?.length)acceptFiles(Array.from(filesInput.files),false);
});
$('includeCover').addEventListener('change',()=>{
 renderFileStatus();renderLivePreview();
});
$('outputMode').addEventListener('change',()=>{
 updateModeUI();renderLivePreview();
});
$('depth').addEventListener('change',renderLivePreview);
$('dither').addEventListener('change',renderLivePreview);
$('contrast').addEventListener('change',renderLivePreview);

for(const id of ['brightness','ditherStrength','threshold']){
 $(id).addEventListener('input',()=>{
  const value=$(id).value;
  $(id+'Value').textContent=id==='ditherStrength'?value+'%':value;
  renderLivePreview();
 });
}

$('fromChapter').addEventListener('change',()=>{
 updateModeUI();renderLivePreview();
});
$('toChapter').addEventListener('change',()=>{
 updateModeUI();renderLivePreview();
});
$('chaptersPerBook').addEventListener('change',()=>{
 updateModeUI();renderLivePreview();
});
cancel.addEventListener('click',()=>{
 cancelled=true;
 cancel.disabled=true;
 status.textContent+='\n正在取消…';
});

updateModeUI();

function pathOf(f){return f.webkitRelativePath||f.name}
function isImage(f){
 return imageExt.test(f.name)&&(!f.type||f.type.startsWith('image/'));
}

function acceptFiles(files,fromFolder){
 if(converting)return;

 selectedFiles=files.filter(isImage)
  .sort((a,b)=>collator.compare(pathOf(a),pathOf(b)));

 if(!selectedFiles.length){
  $('fileStatus').textContent='没有找到支持的图片。请确认文件夹中有 JPG、PNG、WebP 等图片。';
  go.disabled=true;
  preview.style.display='none';
  return;
 }

 const parts=pathOf(selectedFiles[0]).split('/');
 $('bookTitle').value=(
  fromFolder&&parts.length>1
   ?parts[0]
   :selectedFiles[0].name.replace(/\.[^.]+$/,'')
 )||'漫画';

 fillChapterChoices();
 renderFileStatus();
 updateModeUI();
 renderLivePreview();
}

function isRootCover(f){
 const p=pathOf(f).split('/');
 return p[p.length-1].toLowerCase()==='cover.jpg'&&p.length===2;
}

function chapterOf(f){
 const p=pathOf(f).split('/');
 return p.length>=3
  ?p[1]
  :(p.length===2&&p[1].toLowerCase()!=='cover.jpg'
   ?p[0]:'未分章图片');
}

function getChapters(){
 return [...new Set(
  selectedFiles.filter(f=>!isRootCover(f)).map(chapterOf)
 )].sort((a,b)=>collator.compare(a,b));
}

function fillChapterChoices(){
 const chapters=getChapters();

 for(const id of ['fromChapter','toChapter']){
  const el=$(id),old=el.value;
  el.innerHTML='';
  chapters.forEach(ch=>{
   const o=document.createElement('option');
   o.value=ch;
   o.textContent=ch;
   el.appendChild(o);
  });
  if(chapters.includes(old))el.value=old;
 }

 if(chapters.length){
  $('fromChapter').value=chapters[0];
  $('toChapter').value=chapters[chapters.length-1];
 }
}

function getOrderedFiles(){
 const all=selectedFiles.slice()
  .sort((a,b)=>collator.compare(pathOf(a),pathOf(b)));

 const i=all.findIndex(isRootCover);
 let cover=null;

 if(i>=0)cover=all.splice(i,1)[0];

 return $('includeCover').checked&&cover?[cover,...all]:all;
}

function renderFileStatus(){
 const cover=selectedFiles.find(isRootCover),chapters=getChapters();

 $('fileStatus').textContent=
  '已读取 '+selectedFiles.length+' 张图片，识别到 '+chapters.length+' 个章节文件夹。\n'+
  (chapters.length===1&&chapters[0]==='未分章图片'
   ?'⚠ 未能识别章节路径，分章模式不可用。请检查目录结构或更换浏览器。\n'
   :'')+
  (cover
   ?'找到根目录 Cover.jpg。'+
    ($('includeCover').checked?'将放在整部合并模式的第一页。':'封面不会加入。')
   :'未找到根目录 Cover.jpg。')+
  '\n章节和图片按自然数字顺序排列。';

 go.disabled=!getOrderedFiles().length;
}

function updateModeUI(){
 const mode=$('outputMode').value;

 $('rangeFields').style.display=mode==='range'?'flex':'none';
 $('batchFields').style.display=mode==='batch'?'flex':'none';

 $('modeHint').textContent=mode==='merge'
  ?'整部合并：所有章节图片会合并成一个 XTC/XTCH 文件。'
  :mode==='chapter'
   ?'逐章读取图片，完成一本后自动继续下一章。支持时可选择一次输出文件夹自动保存；否则最后下载一个 ZIP。'
   :mode==='range'
    ?'范围模式：选择起止章节，将范围内章节合并为一本。'
    :'分组模式：连续每 N 章生成一本独立 XTC/XTCH，最后不足 N 章也会生成一本。支持时可选择一次输出文件夹自动保存全部成品。';
}

function setStatus(s,p){
 status.textContent=s;
 if(p!=null)bar.style.width=Math.max(0,Math.min(100,p))+'%';
}

function safeName(s){
 return (s||'漫画').replace(/[\\/:*?"<>|]/g,'_').trim()||'漫画';
}

function downloadBlob(blob,name){
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;
 a.download=name;
 document.body.appendChild(a);
 a.click();
 a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30000);
}

function yieldUI(){
 return new Promise(r=>setTimeout(r,0));
}

function getGroups(){
 const mode=$('outputMode').value;
 const files=getOrderedFiles();
 const chapters=getChapters();

 if((mode==='chapter'||mode==='range'||mode==='batch')&&
    (chapters.length===0||
     (chapters.length===1&&chapters[0]==='未分章图片'))){
  throw new Error('没有识别到章节文件夹。请重新选择包含章节子文件夹的漫画总文件夹。');
 }

 function makeChapter(name,chapterFiles){
  return {
   name,
   files:chapterFiles.filter(f=>!isRootCover(f))
    .sort((a,b)=>collator.compare(pathOf(a),pathOf(b)))
  };
 }

 const chapterGroups=chapters.map(name=>makeChapter(
  name,files.filter(f=>!isRootCover(f)&&chapterOf(f)===name)
 )).filter(ch=>ch.files.length>0);

 const cover=files.find(isRootCover);

 if(mode==='merge'){
  const segments=[];
  if($('includeCover').checked&&cover){
   segments.push({name:'封面',files:[cover]});
  }
  segments.push(...chapterGroups);

  return [{
   name:safeName($('bookTitle').value||'漫画'),
   chapters:segments,
   files:segments.flatMap(ch=>ch.files)
  }];
 }

 if(mode==='range'){
  let start=chapters.indexOf($('fromChapter').value);
  let end=chapters.indexOf($('toChapter').value);

  if(start<0||end<0)throw new Error('请先选择起始章节和结束章节。');
  if(start>end)[start,end]=[end,start];

  const selectedNames=new Set(chapters.slice(start,end+1));
  const selected=chapterGroups.filter(ch=>selectedNames.has(ch.name));

  return [{
   name:safeName(
    ($('bookTitle').value||'漫画')+'_'+chapters[start]+'-'+chapters[end]
   ),
   chapters:selected,
   files:selected.flatMap(ch=>ch.files)
  }];
 }

 if(mode==='batch'){
  const size=Math.max(1,Number($('chaptersPerBook').value)||5);
  const title=safeName($('bookTitle').value||'漫画');
  const groups=[];

  for(let i=0;i<chapterGroups.length;i+=size){
   const selected=chapterGroups.slice(i,i+size);

   groups.push({
    name:safeName(
     title+'_'+String(i+1).padStart(3,'0')+'-'+
     String(i+selected.length).padStart(3,'0')
    ),
    chapters:selected,
    files:selected.flatMap(ch=>ch.files)
   });
  }

  return groups;
 }

 return chapterGroups.map(ch=>({
  name:safeName(ch.name),
  files:ch.files
 }));
}

async function makeBook(
 group,depth,algo,contrast,brightness,ditherStrength,threshold,bookTitle,onProgress
){
 const pages=[];
 const chapters=group.chapters||[{name:group.name,files:group.files}];
 const totalFiles=Math.max(1,chapters.reduce((n,ch)=>n+ch.files.length,0));
 let doneFiles=0,cursorY=0,canvas,ctx;

 function newPage(){
  canvas=document.createElement('canvas');
  canvas.width=W;
  canvas.height=H;
  ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,W,H);
  cursorY=0;
 }

 async function emitPage(){
  const gray=canvasToGray(canvas);
  const processed=dither(
   gray,W,H,algo,depth,contrast,brightness,ditherStrength,threshold
  );

  pages.push(depth===2?packXTH(processed,W,H):packXTG(processed,W,H));

  canvas.width=1;
  canvas.height=1;
  newPage();

  if(pages.length%2===0)await yieldUI();
 }

 newPage();

 for(const chapter of chapters){
  if(cancelled)throw new Error('已取消');

  for(const file of chapter.files){
   if(cancelled)throw new Error('已取消');

   const img=await loadImage(file);
   const scaledHeight=Math.max(1,Math.round(img.naturalHeight*W/img.naturalWidth));
   let offset=0;

   // 逐张图、逐页面拼接；不创建整章超长画布。
   while(offset<scaledHeight){
    if(cancelled){
     img.src='';
     throw new Error('已取消');
    }

    const chunk=Math.min(H-cursorY,scaledHeight-offset);
    const sourceY=offset*img.naturalHeight/scaledHeight;
    const sourceEnd=(offset+chunk)*img.naturalHeight/scaledHeight;

    ctx.drawImage(
     img,0,sourceY,img.naturalWidth,sourceEnd-sourceY,0,cursorY,W,chunk
    );

    cursorY+=chunk;
    offset+=chunk;

    if(cursorY===H)await emitPage();
   }

   img.src='';
   doneFiles++;
   onProgress?.(doneFiles,totalFiles,file);
   await yieldUI();
  }

  // 每章结束时补白；下一章从新页面开始。
  if(cursorY>0)await emitPage();
  await yieldUI();
 }

 if(pages.length===0){
  newPage();
  await emitPage();
 }

 const pageCount=pages.length;
 const data=buildBook(pages,depth===2,bookTitle);

 // 生成容器后清空页面缓存，减少下一本的内存占用。
 pages.length=0;
 if(canvas){
  canvas.width=1;
  canvas.height=1;
 }
 ctx=null;
 canvas=null;

 return {data,pages:pageCount,files:group.files.length};
}

function contrastGray(gray,mode){
 const factors={
  none:1,
  light:1.10,
  medium:1.25,
  strong:1.45,
  maximum:1.70
 };

 const factor=factors[mode]??1;
 if(factor===1)return new Uint8Array(gray);

 const out=new Uint8Array(gray.length);

 for(let i=0;i<gray.length;i++){
  out[i]=Math.max(
   0,
   Math.min(255,Math.round((gray[i]-127.5)*factor+127.5))
  );
 }

 return out;
}

function brightnessGray(gray,brightness){
 const amount=Number(brightness)||0;
 if(amount===0)return new Uint8Array(gray);

 const out=new Uint8Array(gray.length);

 for(let i=0;i<gray.length;i++){
  out[i]=Math.max(0,Math.min(255,gray[i]+amount*2));
 }

 return out;
}

function dither(
 gray,w,h,mode,depth,contrast='none',brightness=0,ditherStrength=100,threshold=128
){
 // 处理顺序：对比度 → 亮度 → 抖动量化。
 const contrasted=contrastGray(gray,contrast);
 const adjusted=brightnessGray(contrasted,brightness);
 const a=new Float32Array(adjusted);
 const matrix=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
 const clamp=v=>Math.max(0,Math.min(255,v));

 const binaryThreshold=Math.max(
  0,Math.min(255,Number(threshold)||128)
 );
 const strength=Math.max(
  0,Math.min(100,Number(ditherStrength)||0)
 )/100;

 const quantize=v=>{
  v=clamp(v);

  if(depth!==2)return v<binaryThreshold?0:255;

  return v<42.5?0:v<127.5?85:v<212.5?170:255;
 };

 for(let y=0;y<h;y++){
  for(let x=0;x<w;x++){
   const i=y*w+x;
   const old=clamp(a[i]);

   if(mode==='ordered'){
    const step=depth===2?85:255;
    const bias=((matrix[y&3][x&3]+0.5)/16-0.5)*step*strength;
    a[i]=quantize(old+bias);
    continue;
   }

   const value=quantize(old);
   a[i]=value;

   if(mode==='none'||strength===0)continue;

   const error=(old-value)*strength;

   const add=(xx,yy,weight,divisor)=>{
    if(xx>=0&&xx<w&&yy<h){
     a[yy*w+xx]+=error*weight/divisor;
    }
   };

   if(mode==='atkinson'){
    add(x+1,y,1,8);
    add(x+2,y,1,8);
    add(x-1,y+1,1,8);
    add(x,y+1,1,8);
    add(x+1,y+1,1,8);
    add(x,y+2,1,8);
   }else if(mode==='sierra-lite'){
    add(x+1,y,2,4);
    add(x-1,y+1,1,4);
    add(x,y+1,1,4);
   }else{
    add(x+1,y,7,16);
    add(x-1,y+1,3,16);
    add(x,y+1,5,16);
    add(x+1,y+1,1,16);
   }
  }
 }

 return Uint8Array.from(a,v=>Math.round(clamp(v)));
}

function packXTG(px,w,h){
 const rb=Math.ceil(w/8),data=new Uint8Array(rb*h);

 for(let y=0;y<h;y++){
  for(let x=0;x<w;x++){
   if(px[y*w+x]>=128){
    data[y*rb+(x>>3)]|=0x80>>(x&7);
   }
  }
 }

 return makePage('XTG\0',w,h,data);
}

function packXTH(px,w,h){
 const cb=Math.ceil(h/8),plane=cb*w;
 const p0=new Uint8Array(plane),p1=new Uint8Array(plane);

 for(let x=0;x<w;x++){
  const off=(w-1-x)*cb;

  for(let y=0;y<h;y++){
   const p=px[y*w+x],v=p>=212?0:p>=127?1:p>=42?2:3;
   const idx=off+(y>>3),bit=7-(y&7);

   if(v&1)p0[idx]|=1<<bit;
   if(v&2)p1[idx]|=1<<bit;
  }
 }

 const data=new Uint8Array(plane*2);
 data.set(p0);
 data.set(p1,plane);

 return makePage('XTH\0',w,h,data);
}

function makePage(magic,w,h,data){
 const out=new Uint8Array(22+data.length),v=new DataView(out.buffer);

 for(let i=0;i<4;i++)out[i]=magic.charCodeAt(i);

 v.setUint16(4,w,true);
 v.setUint16(6,h,true);
 out[8]=0;
 out[9]=0;
 v.setUint32(10,data.length,true);

 out.set(data,22);
 out.set(md5(data).slice(0,8),14);

 return out;
}

function md5(input){
 // 修正 MD5 轮移位表，确保页面校验值计算正确。
 const K=new Uint32Array(64);
 const S=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21];

 for(let i=0;i<64;i++){
  K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296)>>>0;
 }

 const len=input.length,bitLen=len*8;
 const total=((len+9+63)>>6)<<6;
 const msg=new Uint8Array(total);

 msg.set(input);
 msg[len]=128;

 const mdv=new DataView(msg.buffer);
 mdv.setUint32(total-8,bitLen>>>0,true);
 mdv.setUint32(total-4,Math.floor(bitLen/4294967296),true);

 let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;

 for(let o=0;o<total;o+=64){
  const M=new Uint32Array(16),dv=new DataView(msg.buffer,o,64);

  for(let i=0;i<16;i++)M[i]=dv.getUint32(i*4,true);

  let a=a0,b=b0,c=c0,d=d0;

  for(let i=0;i<64;i++){
   let f,g;

   if(i<16){
    f=(b&c)|(~b&d);
    g=i;
   }else if(i<32){
    f=(d&b)|(~d&c);
    g=(5*i+1)%16;
   }else if(i<48){
    f=b^c^d;
    g=(3*i+5)%16;
   }else{
    f=c^(b|~d);
    g=(7*i)%16;
   }

   const s=i<16?S[i%4]:i<32?S[4+i%4]:i<48?S[8+i%4]:S[12+i%4];
   const z=(a+f+K[i]+M[g])|0;
   const r=(z<<s)|(z>>>(32-s));

   a=d;
   d=c;
   c=b;
   b=(b+r)|0;
  }

  a0=(a0+a)|0;
  b0=(b0+b)|0;
  c0=(c0+c)|0;
  d0=(d0+d)|0;
 }

 const out=new Uint8Array(16),dv=new DataView(out.buffer);
 [a0,b0,c0,d0].forEach((v,i)=>dv.setUint32(i*4,v,true));

 return out;
}

function buildBook(pages,is2,title){
 if(pages.length>65535){
  throw new Error('页面数量超过 XTC 容器可表示的上限（65535 页）。');
 }

 const metaOff=56,indexOff=312,dataOff=indexOff+pages.length*16;
 const total=dataOff+pages.reduce((n,p)=>n+p.length,0);
 const out=new Uint8Array(total),v=new DataView(out.buffer);
 const magic=is2?'XTCH':'XTC\0';

 for(let i=0;i<4;i++)out[i]=magic.charCodeAt(i);

 v.setUint16(4,1,true);
 v.setUint16(6,pages.length,true);
 v.setUint32(8,0x01000100,true);
 v.setUint32(12,1,true);
 v.setBigUint64(16,BigInt(metaOff),true);
 v.setBigUint64(24,BigInt(indexOff),true);
 v.setBigUint64(32,BigInt(dataOff),true);
 v.setBigUint64(40,0n,true);
 v.setBigUint64(48,0n,true);

 out.set(new TextEncoder().encode(title).slice(0,127),metaOff);

 let pos=dataOff;

 pages.forEach((p,i)=>{
  const e=indexOff+i*16;
  v.setBigUint64(e,BigInt(pos),true);
  v.setUint32(e+8,p.length,true);
  v.setUint16(e+12,W,true);
  v.setUint16(e+14,H,true);
  out.set(p,pos);
  pos+=p.length;
 });

 return out;
}

function loadImage(file){
 return new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(file),img=new Image();

  img.onload=()=>{
   URL.revokeObjectURL(url);
   resolve(img);
  };

  img.onerror=()=>{
   URL.revokeObjectURL(url);
   reject(new Error('无法读取图片：'+file.name));
  };

  img.src=url;
 });
}

function canvasToGray(canvas){
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const im=ctx.getImageData(0,0,W,H),gray=new Uint8Array(W*H);

 for(let i=0,j=0;i<im.data.length;i+=4,j++){
  gray[j]=Math.round(
   .299*im.data[i]+.587*im.data[i+1]+.114*im.data[i+2]
  );
 }

 return gray;
}

// 预览只取第一张图片；宽度超过 528 才缩小，不向上放大。
// 只显示顶部 792 像素，不拼接下一张图片。
async function renderLivePreview(){
 if(converting)return;

 const request=++previewRequest;
 const previewStatus=$('previewStatus');

 if(!selectedFiles.length){
  preview.style.display='none';
  if(previewStatus){
   previewStatus.textContent='选择漫画文件夹后，这里会自动显示预览。';
  }
  return;
 }

 preview.style.display='block';
 if(previewStatus)previewStatus.textContent='正在生成第一页预览……';

 const depth=Number($('depth').value);
 const algo=$('dither').value;
 const contrast=$('contrast').value;
 const brightness=Number($('brightness').value);
 const ditherStrength=Number($('ditherStrength').value);
 const threshold=Number($('threshold').value);

 const canvas=document.createElement('canvas');
 canvas.width=W;
 canvas.height=H;

 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 ctx.fillStyle='#fff';
 ctx.fillRect(0,0,W,H);

 let img=null;

 try{
  let firstFile=null;

  try{
   const groups=getGroups().filter(g=>g.files.length);

   if(groups.length){
    const group=groups[0];
    const chapter=(group.chapters&&group.chapters.length)
     ?group.chapters[0]
     :group;

    if(chapter.files&&chapter.files.length){
     firstFile=chapter.files[0];
    }
   }
  }catch(err){
   console.warn('无法按分组获取预览图片，改用已选图片顺序：',err);
  }

  if(!firstFile){
   const files=getOrderedFiles().filter(f=>!isRootCover(f));
   firstFile=files[0]||getOrderedFiles()[0]||null;
  }

  if(!firstFile){
   if(previewStatus)previewStatus.textContent='没有可用于预览的图片。';
   preview.style.display='none';
   return;
  }

  if(request!==previewRequest)return;

  img=await loadImage(firstFile);

  if(request!==previewRequest)return;

  const scale=Math.min(1,W/img.naturalWidth);
  const drawW=Math.max(1,Math.round(img.naturalWidth*scale));
  const drawH=Math.max(1,Math.round(img.naturalHeight*scale));

  ctx.drawImage(img,0,0,drawW,drawH);

  if(request!==previewRequest)return;

  updateConvertedPreview(
   canvas,depth,algo,contrast,brightness,ditherStrength,threshold
  );

  if(previewStatus){
   previewStatus.textContent='预览已更新：仅使用第一张图片，显示顶部 X3 页面范围。';
  }

 }catch(e){
  if(request===previewRequest){
   console.warn('预览生成失败：',e);

   if(previewStatus){
    previewStatus.textContent='预览生成失败：'+
     (e&&e.message?e.message:'请重新选择图片或刷新页面。');
   }
  }
 }finally{
  if(img)img.src='';
  canvas.width=1;
  canvas.height=1;
 }
}

function updateConvertedPreview(
 sourceCanvas,depth,algo,contrast,brightness,ditherStrength,threshold
){
 const gray=canvasToGray(sourceCanvas);
 const processed=dither(
  gray,W,H,algo,depth,contrast,brightness,ditherStrength,threshold
 );

 const out=document.createElement('canvas');
 out.width=W;
 out.height=H;

 const ctx=out.getContext('2d'),im=ctx.createImageData(W,H);

 for(let i=0,j=0;i<processed.length;i++,j+=4){
  const v=processed[i];
  im.data[j]=v;
  im.data[j+1]=v;
  im.data[j+2]=v;
  im.data[j+3]=255;
 }

 ctx.putImageData(im,0,0);
 preview.src=out.toDataURL('image/png');
 preview.style.display='block';
 preview.dataset.shown='1';
}

go.addEventListener('click',async()=>{
 if(!selectedFiles.length||converting)return;

 cancelled=false;
 converting=true;
 previewRequest++;
 go.disabled=true;
 cancel.disabled=false;
 bar.style.width='0%';

 const depth=Number($('depth').value);
 const algo=$('dither').value;
 const contrast=$('contrast').value;
 const brightness=Number($('brightness').value);
 const ditherStrength=Number($('ditherStrength').value);
 const threshold=Number($('threshold').value);
 const mode=$('outputMode').value;

 try{
  const groups=getGroups().filter(g=>g.files.length);
  if(!groups.length)throw new Error('所选范围内没有图片。');

  const multipleBooks=(mode==='chapter'||mode==='batch');
  let outputDir=null,zipFallback=null;

  if(multipleBooks){
   if(typeof window.showDirectoryPicker==='function'){
    try{
     outputDir=await window.showDirectoryPicker({mode:'readwrite'});
    }catch(err){
     if(err&&err.name==='AbortError'){
      throw new Error('已取消选择输出文件夹，尚未开始转换。');
     }
     throw err;
    }
   }else{
    if(typeof JSZip==='undefined'){
     throw new Error('ZIP 组件加载失败，无法自动打包。请检查网络后刷新页面。');
    }

    zipFallback=new JSZip();
    setStatus(
     '当前浏览器不支持选择输出文件夹，将在全部转换完成后下载一个 ZIP。',
     0
    );
   }
  }

  if(!multipleBooks){
   const g=groups[0];
   setStatus('准备转换：'+g.name,0);

   const result=await makeBook(
    g,depth,algo,contrast,brightness,ditherStrength,threshold,g.name,
    (done,total,file)=>setStatus(
     '正在转换：'+g.name+'\n当前图片：'+file.name+
     '\n本书图片：'+done+'/'+total,
     Math.min(94,94*done/total)
    )
   );

   setStatus('正在保存文件…',96);

   downloadBlob(
    new Blob([result.data],{type:'application/octet-stream'}),
    g.name+(depth===2?'.xtch':'.xtc')
   );

   setStatus(
    '转换完成！\n图片：'+result.files+' 张\nX3 页面：'+result.pages+
    ' 页\n文件大小：'+(result.data.length/1024/1024).toFixed(2)+
    ' MB\n已触发下载。',
    100
   );

  }else{
   let completed=0,totalPages=0,totalFiles=0;
   const ext=depth===2?'.xtch':'.xtc';

   for(let i=0;i<groups.length;i++){
    if(cancelled)throw new Error('已取消');

    const g=groups[i];

    setStatus(
     '正在生成第 '+(i+1)+'/'+groups.length+' 本：'+g.name,
     100*i/groups.length
    );

    let result=await makeBook(
     g,depth,algo,contrast,brightness,ditherStrength,threshold,g.name,
     (done,total,file)=>setStatus(
      '正在生成第 '+(i+1)+'/'+groups.length+' 本：'+g.name+
      '\n当前图片：'+file.name+
      '\n本书图片：'+done+'/'+total,
      100*(i+done/Math.max(1,total))/groups.length
     )
    );

    totalPages+=result.pages;
    totalFiles+=result.files;
    completed++;

    if(outputDir){
     const handle=await outputDir.getFileHandle(g.name+ext,{create:true});
     const writable=await handle.createWritable();
     await writable.write(result.data);
     await writable.close();
    }else{
     zipFallback.file(g.name+ext,result.data);
    }

    result.data=null;
    result=null;
    await yieldUI();
   }

   if(zipFallback){
    setStatus('全部章节已转换，正在生成单个 ZIP…',96);

    const blob=await zipFallback.generateAsync(
     {type:'blob',compression:'STORE'},
     m=>setStatus(
      '正在打包 ZIP… '+Math.round(m.percent)+'%',
      96+4*m.percent/100
     )
    );

    downloadBlob(
     blob,
     safeName($('bookTitle').value||'漫画')+'_全部章节.zip'
    );

    zipFallback=null;
   }

   setStatus(
    '全部完成！\n生成文件：'+completed+' 本\n章节图片：'+
    totalFiles+' 张\n总 X3 页面：'+totalPages+' 页\n'+
    (outputDir
     ?'已自动保存到你选择的文件夹。'
     :'已触发一次 ZIP 下载。'),
    100
   );
  }

 }catch(e){
  setStatus('转换失败：'+(e?.message||e),0);
  console.error(e);
 }finally{
  converting=false;
  go.disabled=!getOrderedFiles().length;
  cancel.disabled=true;
 }
});
