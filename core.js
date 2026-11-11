/* تكاليف الموالح — محرك الحساب.
   DEF و calc و _ld و f منسوخين حرفيًا من البرنامج الأصلي (citrus-costs، 31 أكتوبر 2026) — ممنوع تعديلهم.
   الإضافات تحت (parseNum / checkVal / toStore) بتخص قراءة المدخلات بس، ومش بتلمس طريقة الحساب. */
/*ORIG-BEGIN*/
const DEF={net:24000,usd:52,raw:10,cullP:7,loss:0.005,cull:0.15,pw:0.005,pkg:0,variety:'برتقال أبوسرة',date:'2026-10-11',sar:3.75,
pk:[['كرتون مقفول 7 ك',20,7],['كرتون أوبن توب 7 ك',24,7],['كرتون مقفول 14 ك',42,14],['كرتون مقفول 15 ك',46,15],['صندوق بلاستيك جامبو 15 ك',22,15],['صندوق بلاستيك 8 ك',13.5,7.5]],
sup:[['باليت',400],['مناديل وبصمة',170],['كود',600],['شنمبر',85],['فحص وعينة وتخليص',293],['زوايا',80],['ستيكر فحص',18],['كمسيونجي',0],['أخرى',53]],
var:[['برتقال أبوسرة',1800],['برتقال بلدي',1800],['برتقال صيفي',1800],['ليمون',1800],['يوسفي',1800],['جريب فروت',1800]]};
function calc(s){const T=s.net/1000,r={};
r.rawNeed=s.net/((1-s.loss)*(1-s.cull));r.lossKg=r.rawNeed*s.loss;r.cullKg=(r.rawNeed-r.lossKg)*s.cull;r.cullSale=r.cullKg*s.cullP;
r.buy=1000*s.raw;r.lossC=r.lossKg*s.raw/T;r.cullC=r.cullKg*(s.raw-s.cullP)/T;r.rawT=r.buy+r.lossC+r.cullC;
r.supT=s.sup.reduce((a,x)=>a+(+x[1]||0),0);const v=s.var.find(x=>x[0]===s.variety);r.wash=v?+v[1]:0;
const pc=p=>{const packed=Math.ceil(s.net/p[2]),bought=Math.ceil(packed*(1+s.pw));return{packed,bought,cost:bought*p[1]/T}};
const p=s.pk[s.pkg];const q=pc(p);r.packed=q.packed;r.bought=q.bought;r.pkgC=q.cost;r.pkgW=p[2];r.pkgName=p[0];
r.ton=r.rawT+r.pkgC+r.supT+r.wash;r.kg=r.ton/1000;r.perPkg=r.kg*p[2];r.cont=r.ton*T;
r.cmp=s.pk.map(x=>({n:x[0],v:r.rawT+r.supT+r.wash+pc(x).cost}));const mn=Math.min(...r.cmp.map(x=>x.v/s.usd));r.cmp.forEach(x=>x.d=x.v/s.usd-mn);return r}
function _ld(K,OLD){let o=null;try{const raw=localStorage.getItem(K);if(raw){const p=JSON.parse(raw);o=p&&p.S?p.S:p}else if(OLD){const r2=localStorage.getItem(OLD);if(r2)o=JSON.parse(r2)}}catch(e){o=null}
 const d=JSON.parse(JSON.stringify(DEF));if(!o||typeof o!=='object')return d;for(const k in d){if(o[k]!==undefined&&o[k]!==null&&(Array.isArray(d[k])===Array.isArray(o[k])))d[k]=o[k]}for(const k in o)if(!(k in d))d[k]=o[k];return d}
const f=(x,d=2)=>Number(x).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
/*ORIG-END*/
/* تحويل المدخل لرقم: يقبل الأرقام العربية (٠-٩ و ۰-۹) والفاصلة العشرية العربية «٫» وفاصل الآلاف «٬»؛
   الفاصلة «,» فاصل آلاف لو بعدها مجموعات من 3 أرقام (24,000)، وغير كده علامة عشرية (10,5 = 10.5). يرجّع NaN لو المدخل مش رقم. */
function parseNum(x){if(typeof x==='number')return isFinite(x)?x:NaN;
  var s=String(x==null?'':x).trim().replace(/[\u0660-\u0669]/g,function(c){return c.charCodeAt(0)-0x660}).replace(/[\u06F0-\u06F9]/g,function(c){return c.charCodeAt(0)-0x6F0})
    .replace(/\u066B/g,'.').replace(/[\u066C\s\u00A0\u202F]/g,'').replace(/[\u2212\u2013]/g,'-');
  if(s==='')return NaN;
  if(/^[-+]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s))s=s.replace(/,/g,'');
  else if(/^[-+]?\d*,\d+$/.test(s))s=s.replace(',','.');
  if(!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s))return NaN;
  return parseFloat(s)}
/* قواعد المدخلات: gt0 = أكبر من صفر، ge0 = صفر أو أكتر، pct = من 0 لأقل من 100 */
var RULES={usd:['سعر الدولار','gt0'],sar:['سعر الدولار بالريال','gt0'],raw:['سعر الخام واصل المحطة','ge0'],cullP:['سعر بيع الفرزة محلي','ge0'],net:['الصافي في الحاوية','gt0'],
  loss:['نسبة الهالك من الخام','pct'],cull:['نسبة الفرزة بعد الهالك','pct'],pw:['هالك العبوات','pct']};
/* رسالة الخطأ أو '' — opt: الخانة الفاضية = صفر (زي البرنامج الأصلي في الجداول) */
function checkVal(raw,rule,opt){var t=String(raw==null?'':raw).trim();if(t==='')return opt&&rule!=='gt0'?'':'فاضي — اكتب رقم';
  var x=parseNum(t);if(!isFinite(x))return 'مكتوب غلط';
  if(rule==='gt0'&&!(x>0))return 'لازم يكون أكبر من صفر';
  if(rule==='ge0'&&x<0)return 'مينفعش يكون بالسالب';
  if(rule==='pct'&&(x<0||x>=100))return 'لازم تكون صفر أو أكتر، وأقل من 100';
  return ''}
/* القيمة اللي بتتخزن في S بنفس شكل البرنامج الأصلي: (+قيمة||0) والنسب ÷ 100 */
function toStore(raw,pct){var t=String(raw==null?'':raw).trim();var x=t===''?0:parseNum(t);return pct?(x||0)/100:(x||0)}
var CORE={DEF:DEF,calc:calc,_ld:_ld,f:f,parseNum:parseNum,RULES:RULES,checkVal:checkVal,toStore:toStore};
if(typeof module!=='undefined')module.exports=CORE;
