/* تكاليف الموالح — الواجهة والتقرير (v2.0.2). الحساب كله من calc() الأصلية في core.js */
const VER='2.0.2';
/* تحميل البيانات المحفوظة — نفس مفتاح وشكل وتحويل البرنامج الأصلي (منسوخ حرفيًا) */
const SK='citrusCosts.v2';let S=_ld(SK,'citrusCosts');if(S.sar==null)S.sar=3.75;if(S.var&&S.var.some(v=>v[0]=='برتقال')){S.var=S.var.flatMap(v=>v[0]=='برتقال'?[['برتقال أبوسرة',v[1]],['برتقال بلدي',v[1]],['برتقال صيفي',v[1]]]:[v]);}if(S.variety=='برتقال')S.variety='برتقال أبوسرة';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const N=x=>'<span class="num">'+x+'</span>';
const P=x=>'<span class="num">'+f(x,1)+'%</span>';
function D(x){const m=String(x||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?m[3]+'/'+m[2]+'/'+m[1]:x}
function today(){const d=new Date();return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear()}
let ERR={},DR={};            // أخطاء المدخلات والنص المكتوب غلط — بيتحفظوا في مفتاح منفصل عشان الغلط يفضل ظاهر بعد إعادة الفتح (S نفسها فيها آخر قيمة صحيحة)
const UK='citrusCosts.v2.pending';try{const u=JSON.parse(localStorage.getItem(UK)||'null');if(u&&u.ERR&&u.DR){ERR=u.ERR;DR=u.DR}}catch(e){}
let lastT=null;
function save(){try{lastT=Date.now();localStorage.setItem(SK,JSON.stringify({ver:2,t:lastT,S}));if(Object.keys(ERR).length)localStorage.setItem(UK,JSON.stringify({ERR,DR}));else localStorage.removeItem(UK);showSaved()}catch(e){const n=$('#ls');if(n)n.textContent='تعذّر الحفظ على الجهاز (وضع التصفح الخاص؟)'}}
function showSaved(){const n=$('#ls');if(!n||!lastT)return;const d=new Date(lastT);n.textContent='آخر حفظ '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
try{const p=JSON.parse(localStorage.getItem(SK)||'null');if(p&&p.t)lastT=p.t}catch(e){}
window.addEventListener('pagehide',()=>save());document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save()});

/* ---------- المدخلات ---------- */
const FIELDS=[['sec','الأسعار'],['usd','سعر الدولار','ج'],['sar','سعر الدولار بالريال','ريال'],['raw','سعر الخام واصل المحطة','ج / كجم'],['cullP','سعر بيع الفرزة محلي','ج / كجم'],
 ['sec','الكمية والنسب'],['net','الصافي في الحاوية','كجم'],['loss','نسبة الهالك من الخام','%',1],['cull','نسبة الفرزة بعد الهالك','%',1],['pw','هالك العبوات','%',1]];
const PCT={loss:1,cull:1,pw:1};
function shown(k){const key='k:'+k;if(key in DR)return DR[key];return PCT[k]?+(S[k]*100).toFixed(4):S[k]}
function renderInputs(){let h='<div class="f full"><label>تاريخ الحساب</label><div class="in"><input type="date" data-date="1" value="'+esc(S.date)+'"></div></div>';
 FIELDS.forEach(x=>{if(x[0]=='sec'){h+='<div class="sec">'+x[1]+'</div>';return}
  h+='<div class="f"><label>'+x[1]+'</label><div class="in'+(ERR['k:'+x[0]]?' bad':'')+'"><input inputmode="decimal" data-k="'+x[0]+'" value="'+esc(shown(x[0]))+'"><span class="u">'+x[2]+'</span></div>'+(ERR['k:'+x[0]]?'<div class="emsg" data-for="k:'+x[0]+'">'+ERR['k:'+x[0]]+'</div>':'')+'</div>'});
 $('#inputs').innerHTML=h}
function cell(key,val,cls){const bad=ERR[key];return '<input class="'+(cls||'')+(bad?' bad':'')+'" '+(cls=='v'?'inputmode="decimal" ':'')+'data-t="'+key+'" value="'+esc(key in DR?DR[key]:val)+'">'}
function renderTables(){
 $('#pkt').innerHTML='<div class="trow th"><span>العبوة</span><span>السعر ج</span><span>الصافي كجم</span></div>'+S.pk.map((p,i)=>'<div class="trow">'+cell('pk:'+i+':0',p[0])+cell('pk:'+i+':1',p[1],'v')+cell('pk:'+i+':2',p[2],'v')+'</div>').join('');
 $('#supt').innerHTML=S.sup.map((p,i)=>'<div class="sup">'+cell('sup:'+i+':0',p[0])+cell('sup:'+i+':1',p[1],'v')+'</div>').join('')+'<div class="suptot"><span>إجمالي المستلزمات</span><span class="num" id="supTot"></span></div>';
 $('#vart').innerHTML=S.var.map((p,i)=>'<div class="sup three">'+cell('var:'+i+':0',p[0])+cell('var:'+i+':1',p[1],'v')+'<button class="x" data-dv="'+i+'" aria-label="حذف">×</button></div>').join('');
 Object.keys(ERR).filter(k=>!k.startsWith('k:')).forEach(k=>{const el=document.querySelector('[data-t="'+k+'"]');if(el)markBad(el,k)})}
function renderChips(){
 $('#vars').innerHTML=S.var.map((v,i)=>'<button class="chip'+(v[0]===S.variety?' on':'')+'" data-v="'+i+'">'+esc(v[0])+'</button>').join('')+'<button class="chip add" id="addVar">+ صنف جديد</button>';
 $('#pkgs').innerHTML=S.pk.map((p,i)=>'<button class="chip sm'+(i==S.pkg?' on':'')+'" data-p="'+i+'">'+esc(p[0])+'</button>').join('')}
function errList(){const L=[];Object.keys(ERR).forEach(k=>{const a=k.split(':');let nm;
  if(a[0]=='k')nm=RULES[a[1]][0];else if(a[0]=='pk')nm=(a[2]=='1'?'سعر ':'وزن ')+'«'+(S.pk[a[1]]||[''])[0]+'»';else if(a[0]=='sup')nm='بند «'+(S.sup[a[1]]||[''])[0]+'»';else nm='غسيل «'+(S.var[a[1]]||[''])[0]+'»';
  L.push(nm+': '+ERR[k])});return L}

/* ---------- العرض المباشر ---------- */
function groups(r){return [['الخام (شامل الهالك والفرزة)',r.rawT],['العبوة',r.pkgC],['مستلزمات الإنتاج',r.supT],['تكلفة المحطة (غسيل)',r.wash]]}
function rows(r){return [['g','1) الخام'],['شراء الخام (1 طن)',r.buy],['تكلفة الهالك (فقد الوزن)',r.lossC],['تكلفة الفرزة (فرق السعر)',r.cullC],['s','إجمالي الخام',r.rawT],['g','2) العبوة'],[r.pkgName+' (شاملة هالك العبوات)',r.pkgC],['s','إجمالي العبوة',r.pkgC],['g','3) مستلزمات الإنتاج'],...S.sup.map(x=>[x[0],+x[1]]),['s','إجمالي المستلزمات',r.supT],['g','4) تكلفة المحطة'],['غسيل '+S.variety,r.wash],['s','إجمالي المحطة',r.wash]]}
function renderLive(){const E=errList(),bad=E.length>0;document.body.classList.toggle('invalid',bad);
 $('#net').innerHTML=N(f(S.net/1000,1))+' طن · الدولار '+N(f(S.usd));
 const nv=$('#notice');const vOk=S.var.some(v=>v[0]===S.variety);nv.hidden=vOk;if(!vOk)nv.innerHTML='الصنف «'+esc(S.variety)+'» مش موجود في جدول الغسيل، فالغسيل محسوب صفر. اختار صنف من فوق.';
 if(bad){$('#sum').innerHTML='<div class="lbl">تكلفة الطن الصافي ظهر الحاوية</div><div class="big"><span class="egp num">—</span></div><div class="err"><b>مفيش حساب لحد ما تصحح الخانات المعلّمة:</b><ul>'+E.map(e=>'<li>'+esc(e)+'</li>').join('')+'</ul></div>';
  ['#mojmal','#cmp','#detail'].forEach(s=>$(s).innerHTML='<h2>'+{'#mojmal':'المجمل','#cmp':'مقارنة العبوات','#detail':'التفاصيل'}[s]+'</h2><div class="hint">هيظهر بعد تصحيح المدخلات.</div>');const st=$('#supTot');if(st)st.textContent='—';return}
 const r=calc(S),u=S.usd,T=S.net/1000;window.__r=r;
 $('#sum').innerHTML='<div class="lbl">تكلفة الطن الصافي ظهر الحاوية — '+esc(S.variety)+' · '+esc(r.pkgName)+'</div><div class="big"><span class="egp num">'+f(r.ton)+'<i>ج</i></span><span class="usd num">$'+f(r.ton/u)+'</span></div>'+
  '<div class="kpis">'+
  '<div class="kpi"><span>الكيلو</span><b class="num">'+f(r.kg)+' ج</b><em class="num">$'+f(r.kg/u,3)+'</em></div>'+
  '<div class="kpi"><span>العبوة معبأة ('+f(r.pkgW,1)+' ك)</span><b class="num">'+f(r.perPkg)+' ج</b><em class="num">$'+f(r.perPkg/u,3)+'</em></div>'+
  '<div class="kpi"><span>الحاوية ('+f(T,1)+' طن)</span><b class="num">'+f(r.cont)+' ج</b><em class="num">$'+f(r.cont/u)+'</em></div>'+
  '<div class="kpi"><span>الكرتونة بالريال أرض المحطة</span><b class="num">'+f(r.perPkg/u*S.sar)+' ريال</b><em class="num">'+f(r.ton/u*S.sar)+' ريال / طن</em></div></div>';
 const G=groups(r);
 $('#mojmal').innerHTML='<h2>المجمل <small>ج / طن صافي</small></h2><div class="bar">'+G.map(g=>'<i style="width:'+(r.ton?g[1]/r.ton*100:0)+'%"></i>').join('')+'</div><div class="bk"><table>'+
  G.map((g,i)=>'<tr><td><span class="sw s'+i+'"></span>'+g[0]+'</td><td class="v">'+f(g[1])+'</td><td class="v">'+P(r.ton?g[1]/r.ton*100:0)+'</td></tr>').join('')+
  '<tr class="t"><td>الإجمالي</td><td class="v">'+f(r.ton)+'</td><td class="v">$'+f(r.ton/u)+'</td></tr></table></div>';
 $('#cmp').innerHTML='<h2>مقارنة العبوات <small>تكلفة الطن الصافي</small></h2><div class="bk"><table><tr class="h"><td>العبوة</td><td class="vh">ج / طن</td><td class="vh">$ / طن</td><td class="vh">الفرق $</td></tr>'+
  r.cmp.map((x,i)=>'<tr'+(x.n==r.pkgName?' class="sel"':'')+'><td>'+esc(x.n)+'</td><td class="v">'+f(x.v)+'</td><td class="v">'+f(x.v/u)+'</td><td class="v">'+(x.d<1e-9?'الأرخص':'+'+f(x.d))+'</td></tr>').join('')+'</table></div>';
 let b='<h2>التفاصيل <small>لكل طن صافي</small></h2><div class="bk"><table><tr class="h"><td>البند</td><td class="vh">ج / طن</td><td class="vh">$ / طن</td><td class="vh">%</td></tr>';
 rows(r).forEach(x=>{if(x[0]=='g')b+='<tr class="g"><td colspan="4">'+esc(x[1])+'</td></tr>';else{const s=x[0]=='s',n=s?x[1]:x[0],v=s?x[2]:x[1];b+='<tr'+(s?' class="s"':'')+'><td>'+esc(n)+'</td><td class="v">'+f(v)+'</td><td class="v">'+f(v/u)+'</td><td class="v">'+P(v/r.ton*100)+'</td></tr>'}});
 b+='<tr class="t"><td>إجمالي تكلفة الطن الصافي</td><td class="v">'+f(r.ton)+'</td><td class="v">'+f(r.ton/u)+'</td><td class="v">100%</td></tr></table>'+
  '<div class="hint">الخام المطلوب للحاوية '+N(f(r.rawNeed))+' كجم · هالك '+N(f(r.lossKg))+' كجم · فرزة '+N(f(r.cullKg))+' كجم · عبوات معبأة '+N(f(r.packed,0))+' · مشتراة '+N(f(r.bought,0))+'</div></div>';
 $('#detail').innerHTML=b;const st=$('#supTot');if(st)st.textContent=f(r.supT)+' ج'}
function renderAll(){renderChips();renderInputs();renderTables();renderLive();showSaved();$('#ver').textContent='· v'+VER}

/* ---------- الأحداث ---------- */
function setErr(key,msg,raw){if(msg){ERR[key]=msg;DR[key]=raw}else{delete ERR[key];delete DR[key]}}
function markBad(el,key){const isK=!!el.dataset.k,box=isK?el.parentNode:el,anchor=isK?box:el.parentNode,scope=isK?box.parentNode:anchor.parentNode;
 box.classList.toggle('bad',!!ERR[key]);scope.querySelectorAll('.emsg[data-for="'+key+'"]').forEach(m=>m.remove());
 if(ERR[key]){const m=document.createElement('div');m.className='emsg';m.dataset.for=key;m.textContent=ERR[key];anchor.insertAdjacentElement('afterend',m)}}
document.addEventListener('input',e=>{const t=e.target;
 if(t.dataset.date){S.date=t.value;save();return}
 if(t.dataset.k){const k=t.dataset.k,key='k:'+k,msg=checkVal(t.value,RULES[k][1]);setErr(key,msg,t.value);if(!msg)S[k]=toStore(t.value,PCT[k]);markBad(t,key);save();renderLive();return}
 if(t.dataset.t){const [a,i,j]=t.dataset.t.split(':'),row=S[a][+i];if(!row)return;
  if(j=='0'){const old=row[0];row[0]=t.value;if(a=='var'&&S.variety==old)S.variety=t.value;save();renderLive();return}
  const rule=(a=='pk'&&j=='2')?'gt0':'ge0',msg=checkVal(t.value,rule,true);setErr(t.dataset.t,msg,t.value);if(!msg)row[+j]=toStore(t.value);markBad(t,t.dataset.t);save();renderLive()}});
document.addEventListener('change',e=>{const t=e.target;
 if(t.dataset.t&&t.dataset.t.endsWith(':0')){renderChips();return}
 const key=t.dataset.k?'k:'+t.dataset.k:t.dataset.t;if(!key||ERR[key])return;if(String(t.value).trim()==='')return;const x=parseNum(t.value);if(isFinite(x)&&String(x)!==t.value.trim())t.value=String(x)});
function blocked(){const E=errList();if(!E.length)return false;alert('صحّح الخانات دي الأول:\n• '+E.join('\n• '));return true}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
 if(t.dataset.v!=null){S.variety=S.var[+t.dataset.v][0];save();renderChips();renderLive()}
 else if(t.dataset.p!=null){S.pkg=+t.dataset.p;save();renderChips();renderLive()}
 else if(t.id=='addVar'||t.id=='bAddVar'){const nm=(prompt('اسم الصنف الجديد:','صنف جديد')||'').trim();if(!nm)return;S.var.push([nm,1800]);S.variety=nm;save();renderAll()}
 else if(t.dataset.dv!=null){const i=+t.dataset.dv,nm=S.var[i][0];if(!confirm('حذف صنف «'+nm+'» من جدول الغسيل؟'))return;S.var.splice(i,1);
  Object.keys(ERR).filter(k=>k.startsWith('var:')).forEach(k=>{delete ERR[k];delete DR[k]});if(S.variety==nm&&S.var.length)S.variety=S.var[0][0];save();renderAll()}
 else if(t.id=='bReset'){if(!confirm('ترجع للأرقام الأصلية؟ كل أرقامك هتتمسح.'))return;S=JSON.parse(JSON.stringify(DEF));ERR={};DR={};save();renderAll()}
 else if(t.id=='bReport'){if(blocked())return;openRep()}
 else if(t.id=='bPrint'||t.id=='rPrint'){if(blocked())return;buildPages();$('#rep').hidden=false;fit();setTimeout(()=>window.print(),350)}
 else if(t.id=='bShare'||t.id=='rShare'){if(blocked())return;sharePdf()}
 else if(t.id=='rClose'){$('#rep').hidden=true;document.body.style.overflow=''}});
document.addEventListener('change',e=>{if(e.target.id=='rMode'){REPMODE=e.target.value;buildPages();fit()}});

/* ---------- التقرير ---------- */
let REPMODE='full';
function reportHtml(){const r=calc(S),u=S.usd,T=S.net/1000,G=groups(r),pages=REPMODE=='full'?2:1;
 const head=t=>'<div class="ph"><div><h1>'+t+'</h1><div class="meta">تاريخ الحساب <span class="ltr">'+esc(D(S.date))+'</span> — '+esc(S.variety)+' — '+esc(r.pkgName)+' — الحاوية <span class="ltr">'+f(T,1)+'</span> طن صافي — الدولار <span class="ltr">'+f(S.usd)+'</span> ج — <span class="ltr">'+f(S.sar)+'</span> ريال</div></div><span class="tag">تكاليف الموالح</span></div>';
 const code=REPMODE=='full'?'RT-20261028-010':'RT-20261028-011';const foot=p=>'<div class="pf"><span class="ltr">'+code+'</span><span>التكلفة للمنتج محمّلًا على الحاوية في المحطة، بدون نقل للميناء أو شحن. طُبع <span class="ltr">'+today()+'</span></span><span>صفحة '+p+' من '+pages+'</span></div>';
 const R6=(n,v,cls)=>'<tr'+(cls?' class="'+cls+'"':'')+'><td>'+esc(n)+'</td><td class="n">'+f(v)+'</td><td class="n">'+f(v/u)+'</td><td class="n">'+f(v*T)+'</td><td class="n">'+f(v*T/u)+'</td><td class="n">'+f(v/r.ton*100,1)+'%</td></tr>';
 const p1='<div class="page"><div class="pc p1">'+head('تكلفة طن '+esc(S.variety)+' الصافي ظهر الحاوية')+
 '<h3>الملخص</h3><div class="rsum"><div class="m main"><span>تكلفة الطن الصافي</span><b>'+f(r.ton)+' ج</b><em>$'+f(r.ton/u)+'</em><small>الخام + العبوة + المستلزمات + الغسيل ÷ الطن الصافي</small></div>'+
 '<div class="m"><span>الكيلو</span><b>'+f(r.kg)+' ج</b><em>$'+f(r.kg/u,3)+'</em><small>تكلفة الطن ÷ 1000 كجم</small></div>'+
 '<div class="m"><span>العبوة معبأة ('+f(r.pkgW,1)+' ك)</span><b>'+f(r.perPkg)+' ج</b><em>$'+f(r.perPkg/u)+'</em><small>الكيلو × '+f(r.pkgW,1)+' كجم</small></div>'+
 '<div class="m"><span>الحاوية ('+f(T,1)+' طن)</span><b>'+f(r.cont)+' ج</b><em>$'+f(r.cont/u)+'</em><small>الطن × '+f(T,1)+' طن صافي</small></div></div>'+
 '<div class="rsar"><span>تكلفة الكرتونة بالريال أرض المحطة</span><b>'+f(r.perPkg/u*S.sar)+' ريال</b><span class="sep">|</span><b>'+f(r.ton/u*S.sar)+' ريال / طن</b><em>= تكلفة العبوة ($'+f(r.perPkg/u,3)+') × '+f(S.sar)+' ريال للدولار</em></div>'+
 '<h3>المجمل</h3><table class="rt"><thead><tr><th>المجموعة</th><th>ج / طن</th><th>$ / طن</th><th>ج / حاوية</th><th>$ / حاوية</th><th>%</th></tr></thead><tbody>'+
 G.map(g=>R6(g[0],g[1])).join('')+R6('الإجمالي',r.ton,'gt')+'</tbody></table><div class="note">الأربع مجموعات مجموعها = تكلفة الطن الصافي ظهر الحاوية.</div>'+
 '<h3>مقارنة العبوات — تكلفة الطن الصافي</h3><table class="rt"><thead><tr><th>العبوة</th><th>ج / طن</th><th>$ / طن</th><th>ريال / عبوة</th><th>الفرق عن الأرخص $</th></tr></thead><tbody>'+
 r.cmp.map((x,i)=>'<tr'+(x.n==r.pkgName?' class="sel"':'')+'><td>'+esc(x.n)+'</td><td class="n">'+f(x.v)+'</td><td class="n">'+f(x.v/u)+'</td><td class="n">'+f(x.v/1000*S.pk[i][2]/u*S.sar)+'</td><td class="n">'+(x.d<1e-9?'الأرخص':'+'+f(x.d))+'</td></tr>').join('')+
 '</tbody></table><div class="note">الفرق محسوب بالدولار للطن مقارنة بأرخص عبوة؛ كل العبوات بنفس الخام والمستلزمات والغسيل.'+(pages>1?' التفاصيل في الصفحة التالية.':'')+'</div></div>'+foot(1)+'</div>';
 if(pages==1)return [p1];
 let d='';rows(r).forEach(x=>{if(x[0]=='g')d+='<tr class="gh"><td colspan="6">'+esc(x[1])+'</td></tr>';else{const s=x[0]=='s';d+=R6(s?x[1]:x[0],s?x[2]:x[1],s?'st':'')}});
 const p2='<div class="page"><div class="pc">'+head('تفاصيل تكلفة طن '+esc(S.variety)+' والحاوية')+
 '<h3>التفاصيل</h3><table class="rt"><thead><tr><th>البند</th><th>ج / طن</th><th>$ / طن</th><th>ج / حاوية</th><th>$ / حاوية</th><th>%</th></tr></thead><tbody>'+d+
 '<tr class="gt"><td>إجمالي تكلفة الطن الصافي</td><td class="n">'+f(r.ton)+'</td><td class="n">'+f(r.ton/u)+'</td><td class="n">'+f(r.cont)+'</td><td class="n">'+f(r.cont/u)+'</td><td class="n">100%</td></tr></tbody></table>'+
 '<div class="note">الإجمالي = الخام + العبوة + المستلزمات + غسيل المحطة، لكل طن صافي داخل العبوات؛ الحاوية = الطن × '+f(T,1)+' طن.</div>'+
 '<h3>الكميات للحاوية</h3><table class="rt q"><tbody><tr><td>الصافي في العبوات</td><td class="q2"><span class="ltr">'+f(S.net,0)+'</span> كجم</td><td>الخام المطلوب</td><td class="q2"><span class="ltr">'+f(r.rawNeed)+'</span> كجم</td></tr><tr><td>الهالك</td><td class="q2"><span class="ltr">'+f(r.lossKg)+'</span> كجم</td><td>الفرزة للمحلي</td><td class="q2"><span class="ltr">'+f(r.cullKg)+'</span> كجم</td></tr><tr><td>قيمة بيع الفرزة</td><td class="q2"><span class="ltr">'+f(r.cullSale)+'</span> ج</td><td>وزن العبوة</td><td class="q2"><span class="ltr">'+f(r.pkgW,1)+'</span> كجم</td></tr><tr><td>العبوات المعبأة</td><td class="q2"><span class="ltr">'+f(r.packed,0)+'</span></td><td>العبوات المطلوب شراؤها</td><td class="q2"><span class="ltr">'+f(r.bought,0)+'</span></td></tr></tbody></table>'+
 '<div class="note">العبوات المعبأة = الصافي ÷ وزن العبوة مقرّب لأعلى؛ المشتراة = المعبأة × (1 + <span class="ltr">'+f(S.pw*100,1)+'%</span>) مقرّب لأعلى.</div>'+
 '<h3>طريقة الحساب</h3><ul><li>الخام المطلوب = الصافي ÷ ((1 − الهالك <span class="ltr">'+f(S.loss*100,1)+'%</span>) × (1 − الفرزة <span class="ltr">'+f(S.cull*100,1)+'%</span>)).</li><li>تكلفة الفرزة = وزنها × (سعر الخام '+f(S.raw)+' − سعر بيعها '+f(S.cullP)+').</li><li>سعر الخام واصل المحطة، فلا يوجد بند نقل خام.</li><li>التكلفة للمنتج محمّلًا على الحاوية في المحطة، بدون نقل للميناء أو شحن.</li></ul></div>'+foot(2)+'</div>';
 return [p1,p2]}
function shrink(root){root.querySelectorAll('.page').forEach(pg=>{const pc=pg.querySelector('.pc');pc.style.transform='';pc.style.width='';const avail=1123-36-62;let h=pc.offsetHeight;if(h>avail){let s=Math.max(0.55,avail/h);pc.style.width=(706/s)+'px';h=pc.offsetHeight;s=Math.max(0.55,avail/h);pc.style.width=(706/s)+'px';pc.style.transformOrigin='top right';pc.style.transform='scale('+s+')'}})}
function buildPages(){$('#rep').hidden=false;$('#pages').innerHTML=reportHtml().map(p=>'<div class="pagewrap">'+p+'</div>').join('');shrink($('#pages'))}
function fit(){document.querySelectorAll('.pagewrap').forEach(w=>{const pg=w.firstChild,s=Math.min(1,w.clientWidth/794);pg.style.transform='scale('+s+')';w.style.height=(1123*s)+'px'})}
window.addEventListener('resize',()=>{if(!$('#rep').hidden)fit()});
function openRep(){buildPages();$('#rep').hidden=false;$('#rep').scrollTop=0;document.body.style.overflow='hidden';fit()}
let libs=null;function loadLibs(){if(libs)return libs;libs=Promise.all(['html2canvas.min.js','jspdf.umd.min.js'].map(s=>new Promise((ok,no)=>{const e=document.createElement('script');e.src=s;e.onload=ok;e.onerror=no;document.head.appendChild(e)})));return libs}
function makePdf(){const wasHidden=$('#rep').hidden;
 const holder=document.createElement('div');holder.style.cssText='position:fixed;left:-10000px;top:0;width:794px';holder.innerHTML=reportHtml().join('');document.body.appendChild(holder);shrink(holder);
 return loadLibs().then(()=>document.fonts?document.fonts.ready:null).then(()=>{const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true}),pgs=holder.querySelectorAll('.page');let ch=Promise.resolve();
  pgs.forEach((p,i)=>{ch=ch.then(()=>html2canvas(p,{scale:2,backgroundColor:'#fff',useCORS:true,logging:false}).then(c=>{if(i)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',0,0,210,297)}))});
  return ch.then(()=>{holder.remove();if(wasHidden)$('#rep').hidden=true;return pdf})}).catch(e=>{holder.remove();throw e})}
function fname(){return 'تكاليف_الموالح_'+String(S.variety).replace(/\s+/g,'_')+'_'+String(D(S.date)||today()).replace(/\//g,'-')+'.pdf'}
function sharePdf(){$('#busy').hidden=false;makePdf().then(pdf=>{const blob=pdf.output('blob'),name=fname();window.__lastPdf={size:blob.size,name:name};
  let file=null;try{file=new File([blob],name,{type:'application/pdf'})}catch(e){}
  if(file&&navigator.canShare&&navigator.canShare({files:[file]})){$('#busy').hidden=true;return navigator.share({files:[file],title:name.replace('.pdf',''),text:'تقرير '+name.replace(/_/g,' ').replace('.pdf','')}).catch(()=>{})}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);$('#busy').hidden=true})
 .catch(e=>{$('#busy').hidden=true;alert('ماقدرتش أجهز الـ PDF: '+e)})}
window.CCAPP={setMode:m=>{REPMODE=m},makePdf,state:()=>S,render:renderAll,calc:()=>calc(S),reportHtml};
renderAll();
