// X3 Manga Image Converter V2.5. Local-only browser processing; stitch vertical strips across source images.
const W=528,H=792,$=id=>document.getElementById(id);
let cancelled=false, selectedFiles=[];
const folderInput=$('folder'), filesInput=$('files'), go=$('go'), cancel=$('cancel'), status=$('status'), bar=$('bar'), preview=$('preview');
const collator=new Intl.Collator('zh-CN',{numeric:true,sensitivity:'base'}), imageExt=/\.(jpe?g|png|webp|bmp|gif|avif)$/i;
$('pickFolder').addEventListener('click',()=>folderInput.click());
$('pickFiles').addEventListener('click',()=>filesInput.click());
folderInput.addEventListener('change',()=>{if(folderInput.files?.length)acceptFiles(Array.from(folderInput.files),true)});
filesInput.addEventListener('change',()=>{if(filesInput.files?.length)acceptFiles(Array.from(filesInput.files),false)});
$('includeCover').addEventListener('change',renderFileStatus);
$('outputMode').addEventListener('change',updateModeUI);
$('zipBatch').addEventListener('change',updateModeUI);
$('fromChapter').addEventListener('change',updateModeUI); $('toChapter').addEventListener('change',updateModeUI);
cancel.addEventListener('click',()=>{cancelled=true;cancel.disabled=true;status.textContent+='\n正在取消…'});
function pathOf(f){return f.webkitRelativePath||f.name}
function isImage(f){return imageExt.test(f.name)&&(!f.type||f.type.startsWith('image/'))}
function acceptFiles(files,fromFolder){
 selectedFiles=files.filter(isImage).sort((a,b)=>collator.compare(pathOf(a),pathOf(b)));
 if(!selectedFiles.length){$('fileStatus').textContent='没有找到支持的图片。请确认文件夹中有 JPG、PNG、WebP 等图片。';go.disabled=true;return}
 const parts=pathOf(selectedFiles[0]).split('/');
 $('bookTitle').value=(fromFolder&&parts.length>1?parts[0]:selectedFiles[0].name.replace(/\.[^.]+$/,''))||'漫画';
 preview.style.display='none'; fillChapterChoices(); renderFileStatus(); updateModeUI();
}
function isRootCover(f){const p=pathOf(f).split('/');return p[p.length-1].toLowerCase()==='cover.jpg'&&p.length===2}
function chapterOf(f){const p=pathOf(f).split('/');return p.length>=3?p[1]:(p.length===2&&p[1].toLowerCase()!=='cover.jpg'?p[0]:'未分章图片')}
function getChapters(){return [...new Set(selectedFiles.filter(f=>!isRootCover(f)).map(chapterOf))].sort((a,b)=>collator.compare(a,b))}
function fillChapterChoices(){const chapters=getChapters();for(const id of ['fromChapter','toChapter']){const el=$(id),old=el.value;el.innerHTML='';chapters.forEach(ch=>{const o=document.createElement('option');o.value=ch;o.textContent=ch;el.appendChild(o)});if(chapters.includes(old))el.value=old;}if(chapters.length){$('fromChapter').value=chapters[0];$('toChapter').value=chapters[chapters.length-1]}}
function getOrderedFiles(){const all=selectedFiles.slice().sort((a,b)=>collator.compare(pathOf(a),pathOf(b))),i=all.findIndex(isRootCover);let cover=null;if(i>=0)cover=all.splice(i,1)[0];return $('includeCover').checked&&cover?[cover,...all]:all}
function renderFileStatus(){const cover=selectedFiles.find(isRootCover),chapters=getChapters();$('fileStatus').textContent='已读取 '+selectedFiles.length+' 张图片，识别到 '+chapters.length+' 个章节文件夹。\n'+(chapters.length===1&&chapters[0]==='未分章图片'?'⚠ 未能识别章节路径，分章模式不可用。请检查目录结构或更换浏览器。\n':'')+(cover?'找到根目录 Cover.jpg。'+($('includeCover').checked?'将放在整部合并模式的第一页。':'封面不会加入。'):'未找到根目录 Cover.jpg。')+'\n章节和图片按自然数字顺序排列。';go.disabled=!getOrderedFiles().length;}
function updateModeUI(){const mode=$('outputMode').value; $('rangeFields').style.display=mode==='range'?'flex':'none';$('zipFields').style.display=mode==='chapter'?'block':'none';$('modeHint').textContent=mode==='merge'?'整部合并：所有章节图片会合并成一个 XTC/XTCH 文件。':mode==='chapter'?'分章模式：每个章节文件夹单独生成一本；默认每 5 本打包一个 ZIP。开始前请确认识别到的章节数量正确。':'范围模式：选择起止章节，将范围内章节合并为一本。';}
function setStatus(s,p){status.textContent=s;if(p!=null)bar.style.width=Math.max(0,Math.min(100,p))+'%'}
function safeName(s){return (s||'漫画').replace(/[\\/:*?"<>|]/g,'_').trim()||'漫画'}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
function yieldUI(){return new Promise(r=>setTimeout(r,0))}
function getGroups() {
  const mode = $('outputMode').value;
  const files = getOrderedFiles();
  const chapters = getChapters();
  if ((mode === 'chapter' || mode === 'range') &&
      (chapters.length === 0 || (chapters.length === 1 && chapters[0] === '未分章图片'))) {
    throw new Error('没有识别到章节文件夹。请重新选择包含章节子文件夹的漫画总文件夹。');
  }
  function makeChapter(name, chapterFiles) {
    return { name, files: chapterFiles.filter(f => !isRootCover(f))
      .sort((a, b) => collator.compare(pathOf(a), pathOf(b))) };
  }
  const chapterGroups = chapters.map(name => makeChapter(name,
    files.filter(f => !isRootCover(f) && chapterOf(f) === name)
  )).filter(ch => ch.files.length > 0);
  const cover = files.find(isRootCover);
  if (mode === 'merge') {
    const segments = [];
    if ($('includeCover').checked && cover) segments.push({ name: '封面', files: [cover] });
    segments.push(...chapterGroups);
    return [{ name: safeName($('bookTitle').value || '漫画'), chapters: segments,
      files: segments.flatMap(ch => ch.files) }];
  }
  if (mode === 'range') {
    let start = chapters.indexOf($('fromChapter').value);
    let end = chapters.indexOf($('toChapter').value);
    if (start < 0 || end < 0) throw new Error('请先选择起始章节和结束章节。');
    if (start > end) [start, end] = [end, start];
    const selectedNames = new Set(chapters.slice(start, end + 1));
    const selected = chapterGroups.filter(ch => selectedNames.has(ch.name));
    return [{ name: safeName(($('bookTitle').value || '漫画') + '_' + chapters[start] + '-' + chapters[end]),
      chapters: selected, files: selected.flatMap(ch => ch.files) }];
  }
  return chapterGroups.map(ch => ({ name: safeName(ch.name), files: ch.files }));
}

async function makeBook(group, depth, algo, bookTitle, onProgress) {
  const pages = [];
  const chapters = group.chapters || [{ name: group.name, files: group.files }];
  let planned = 0;
  // 预估页数时按章节分别向上取整，章节之间不共用页面。
  for (const chapter of chapters) {
    let chapterHeight = 0;
    for (const file of chapter.files) {
      if (cancelled) throw new Error('已取消');
      const img = await loadImage(file);
      chapterHeight += Math.max(1, Math.round(img.naturalHeight * W / img.naturalWidth));
      img.src = '';
      await yieldUI();
    }
    planned += Math.max(1, Math.ceil(chapterHeight / H));
  }
  planned = Math.max(1, planned);
  let done = 0, cursorY = 0, canvas, ctx, currentFile = null;
  function newPage() {
    canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); cursorY = 0;
  }
  async function emitPage(file) {
    const gray = canvasToGray(canvas);
    const processed = dither(gray, W, H, algo, depth);
    pages.push(depth === 2 ? packXTH(processed, W, H) : packXTG(processed, W, H));
    if (!preview.dataset.shown) {
      preview.src = canvas.toDataURL('image/png'); preview.style.display = 'block'; preview.dataset.shown = '1';
    }
    done++; onProgress?.(done, planned, file || currentFile);
    canvas.width = 1; canvas.height = 1; newPage();
    if (done % 2 === 0) await yieldUI();
  }
  newPage();
  for (const chapter of chapters) {
    if (cancelled) throw new Error('已取消');
    for (const file of chapter.files) {
      if (cancelled) throw new Error('已取消');
      currentFile = file;
      const img = await loadImage(file);
      const scaledHeight = Math.max(1, Math.round(img.naturalHeight * W / img.naturalWidth));
      let offset = 0;
      // 逐张图、逐页面拼接；不创建整章超长画布。
      while (offset < scaledHeight) {
        if (cancelled) throw new Error('已取消');
        const chunk = Math.min(H - cursorY, scaledHeight - offset);
        const sourceY = offset * img.naturalHeight / scaledHeight;
        const sourceEnd = (offset + chunk) * img.naturalHeight / scaledHeight;
        ctx.drawImage(img, 0, sourceY, img.naturalWidth, sourceEnd - sourceY,
          0, cursorY, W, chunk);
        cursorY += chunk; offset += chunk;
        if (cursorY === H) await emitPage(file);
      }
      img.src = ''; await yieldUI();
    }
    // 每章结束时才补白；下一章一定从新页开始。
    if (cursorY > 0) await emitPage(currentFile);
    await yieldUI();
  }
  if (pages.length === 0) { newPage(); await emitPage(currentFile); }
  const data = buildBook(pages, depth === 2, bookTitle);
  return { data, pages: pages.length, files: group.files.length };
}

function dither(gray,w,h,mode,depth){const a=new Float32Array(gray);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,old=a[i],v=depth===2?(old<42?0:old<127?85:old<212?170:255):(mode==='none'?(old<128?0:255):(old<128?0:255));a[i]=v;if(mode==='none')continue;const e=old-v;if(mode==='atkinson'){const add=(xx,yy,k=1)=>{if(xx>=0&&xx<w&&yy<h)a[yy*w+xx]+=e*k/8};add(x+1,y);add(x+2,y);add(x-1,y+1);add(x,y+1);add(x+1,y+1);add(x,y+2)}else{const add=(xx,yy,k)=>{if(xx>=0&&xx<w&&yy<h)a[yy*w+xx]+=e*k/16};add(x+1,y,7);add(x-1,y+1,3);add(x,y+1,5);add(x+1,y+1,1)}}return Uint8Array.from(a,v=>Math.max(0,Math.min(255,Math.round(v))))}
function packXTG(px,w,h){const rb=Math.ceil(w/8),data=new Uint8Array(rb*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(px[y*w+x]>=128)data[y*rb+(x>>3)]|=0x80>>(x&7);return makePage('XTG\0',w,h,data)}
function packXTH(px,w,h){const cb=Math.ceil(h/8),plane=cb*w,p0=new Uint8Array(plane),p1=new Uint8Array(plane);for(let x=0;x<w;x++){const off=(w-1-x)*cb;for(let y=0;y<h;y++){const p=px[y*w+x],v=p>=212?0:p>=127?1:p>=42?2:3,idx=off+(y>>3),bit=7-(y&7);if(v&1)p0[idx]|=1<<bit;if(v&2)p1[idx]|=1<<bit}}const data=new Uint8Array(plane*2);data.set(p0);data.set(p1,plane);return makePage('XTH\0',w,h,data)}
function makePage(magic,w,h,data){const out=new Uint8Array(22+data.length),v=new DataView(out.buffer);for(let i=0;i<4;i++)out[i]=magic.charCodeAt(i);v.setUint16(4,w,true);v.setUint16(6,h,true);out[8]=0;out[9]=0;v.setUint32(10,data.length,true);out.set(data,22);out.set(md5(data).slice(0,8),14);return out}
function md5(input){const K=new Uint32Array(64),S=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21];for(let i=0;i<64;i++)K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296)>>>0;const len=input.length,bitLen=len*8,total=((len+9+63)>>6)<<6,msg=new Uint8Array(total);msg.set(input);msg[len]=128;const mdv=new DataView(msg.buffer);mdv.setUint32(total-8,bitLen>>>0,true);mdv.setUint32(total-4,Math.floor(bitLen/4294967296),true);let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;for(let o=0;o<total;o+=64){const M=new Uint32Array(16),dv=new DataView(msg.buffer,o,64);for(let i=0;i<16;i++)M[i]=dv.getUint32(i*4,true);let a=a0,b=b0,c=c0,d=d0;for(let i=0;i<64;i++){let f,g;if(i<16){f=(b&c)|(~b&d);g=i}else if(i<32){f=(d&b)|(~d&c);g=(5*i+1)%16}else if(i<48){f=b^c^d;g=(3*i+5)%16}else{f=c^(b|~d);g=(7*i)%16}const s=i<16?S[i%4]:i<32?S[4+i%4]:i<48?S[8+i%4]:S[12+i%4],z=(a+f+K[i]+M[g])|0,r=(z<<s)|(z>>>(32-s));a=d;d=c;c=b;b=(b+r)|0}a0=(a0+a)|0;b0=(b0+b)|0;c0=(c0+c)|0;d0=(d0+d)|0}const out=new Uint8Array(16),dv=new DataView(out.buffer);[a0,b0,c0,d0].forEach((v,i)=>dv.setUint32(i*4,v,true));return out}
function buildBook(pages,is2,title){if(pages.length>65535)throw new Error('页面数量超过 XTC 容器可表示的上限（65535 页）。');const metaOff=56,indexOff=312,dataOff=indexOff+pages.length*16,total=dataOff+pages.reduce((n,p)=>n+p.length,0),out=new Uint8Array(total),v=new DataView(out.buffer),magic=is2?'XTCH':'XTC\0';for(let i=0;i<4;i++)out[i]=magic.charCodeAt(i);v.setUint16(4,1,true);v.setUint16(6,pages.length,true);v.setUint32(8,0x01000100,true);v.setUint32(12,1,true);v.setBigUint64(16,BigInt(metaOff),true);v.setBigUint64(24,BigInt(indexOff),true);v.setBigUint64(32,BigInt(dataOff),true);v.setBigUint64(40,0n,true);v.setBigUint64(48,0n,true);out.set(new TextEncoder().encode(title).slice(0,127),metaOff);let pos=dataOff;pages.forEach((p,i)=>{const e=indexOff+i*16;v.setBigUint64(e,BigInt(pos),true);v.setUint32(e+8,p.length,true);v.setUint16(e+12,W,true);v.setUint16(e+14,H,true);out.set(p,pos);pos+=p.length});return out}
function loadImage(file){return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('无法读取图片：'+file.name))};img.src=url})}
function canvasToGray(canvas){const ctx=canvas.getContext('2d',{willReadFrequently:true}),im=ctx.getImageData(0,0,W,H),gray=new Uint8Array(W*H);for(let i=0,j=0;i<im.data.length;i+=4,j++)gray[j]=Math.round(.299*im.data[i]+.587*im.data[i+1]+.114*im.data[i+2]);return gray}

go.addEventListener('click',async()=>{
 if(!selectedFiles.length)return;cancelled=false;go.disabled=true;cancel.disabled=false;preview.style.display='none';delete preview.dataset.shown;bar.style.width='0%';
 const depth=Number($('depth').value),algo=$('dither').value,mode=$('outputMode').value,batch=$('zipBatch').value;
 try{
  if(mode==='chapter'&&typeof JSZip==='undefined')throw new Error('ZIP 组件加载失败，请检查网络后刷新页面。');
  const groups=getGroups().filter(g=>g.files.length);if(!groups.length)throw new Error('所选范围内没有图片。');
  if(mode!=='chapter'){
   const g=groups[0];setStatus('准备转换：'+g.name,0);const result=await makeBook(g,depth,algo,g.name,(done,total,file)=>setStatus('正在转换：'+g.name+'\n当前图片：'+file.name+'\n本书页面：'+done+'/'+total,Math.min(94,94*done/total)));
   setStatus('正在封装文件…',96);downloadBlob(new Blob([result.data],{type:'application/octet-stream'}),g.name+(depth===2?'.xtch':'.xtc'));
   setStatus('转换完成！\n图片：'+result.files+' 张\nX3 页面：'+result.pages+' 页\n文件大小：'+(result.data.length/1024/1024).toFixed(2)+' MB\n已触发下载。',100);
  }else{
   let batchZip=null,batchCount=0,batchNum=0,completed=0,totalPages=0;const batchSize=batch==='none'?1:Number(batch);const ext=depth===2?'.xtch':'.xtc';
   for(let i=0;i<groups.length;i++){
    if(cancelled)throw new Error('已取消');const g=groups[i];setStatus('正在转换章节 '+(i+1)+'/'+groups.length+'：'+g.name,100*i/groups.length);
    const result=await makeBook(g,depth,algo,g.name,(done,total,file)=>setStatus('章节 '+(i+1)+'/'+groups.length+'：'+g.name+'\n当前图片：'+file.name+'\n本章页面：'+done+'/'+total,100*(i+done/Math.max(1,total))/groups.length));
    totalPages+=result.pages;completed++;
    if(batch==='none'){downloadBlob(new Blob([result.data],{type:'application/octet-stream'}),g.name+ext);await new Promise(r=>setTimeout(r,500));}
    else {if(!batchZip)batchZip=new JSZip();batchZip.file(g.name+ext,result.data);batchCount++;if(batchCount===batchSize||i===groups.length-1){batchNum++;setStatus('正在压缩第 '+batchNum+' 个 ZIP（'+batchCount+' 本）…',100*completed/groups.length);const blob=await batchZip.generateAsync({type:'blob',compression:'STORE'},m=>setStatus('正在压缩 ZIP… '+Math.round(m.percent)+'%',100*completed/groups.length));downloadBlob(blob,safeName($('bookTitle').value||'漫画')+'_第'+batchNum+'包_'+batchCount+'本.zip');batchZip=null;batchCount=0;await new Promise(r=>setTimeout(r,700));}}
    await yieldUI();
   }
   setStatus('全部完成！\n章节数：'+completed+' 本\n总 X3 页面：'+totalPages+' 页\n输出：'+(batch==='none'?'每章单独下载':('每 '+batch+' 本左右一个 ZIP'))+'\n如果浏览器询问是否允许多个下载，请选择允许。',100);
  }
 }catch(e){setStatus('转换失败：'+(e?.message||e),0);console.error(e)}finally{go.disabled=!getOrderedFiles().length;cancel.disabled=true;}
});
