/* تكاليف الموالح → الصوافي: «نسخ التكاليف للصوافي» بينسخ نص «COSTS1:…» (كل أسعار العبوات والمستلزمات والغسيل والهالك والفرزة)
   يتلصق في الصوافي ← «سعر شراء الخام للتعادل» ← «لصق من برنامج التكاليف». مش بيغيّر أي حساب ولا تخزين هنا. */
(function(){'use strict';
function code(){const s=S,o={app:'citrus-costs',v:1,t:Date.now(),S:{raw:s.raw,cullP:s.cullP,loss:s.loss,cull:s.cull,pw:s.pw,usd:s.usd,sar:s.sar,pk:s.pk,sup:s.sup,var:s.var}};
 const bytes=new TextEncoder().encode(JSON.stringify(o));let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return 'تكاليف الموالح للصوافي\nCOSTS1:'+btoa(bin)}
function fallback(txt){const ta=document.createElement('textarea');ta.value=txt;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,txt.length);let ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();return ok}
function copy(){const txt=code();window.__costsCode=txt;const done=()=>alert('اتنسخ ✓\nافتح الصوافي ← «سعر شراء الخام للتعادل» ← «التكاليف من برنامج تكاليف الموالح» والصق في الخانة ودوس «استيراد التكاليف».');
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>{fallback(txt)?done():prompt('انسخ النص ده والصقه في الصوافي:',txt)});else fallback(txt)?done():prompt('انسخ النص ده والصقه في الصوافي:',txt)}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#bToSawafi'))copy()});
window.CostsToSawafi={code};
})();
