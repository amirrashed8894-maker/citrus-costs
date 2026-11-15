// يثبت القيم الافتراضية الجديدة، وإن البيانات المحفوظة من نسخة قديمة ما بتتكتبش فوقها
const C=require('../core.js');let ok=true;const log=(p,m)=>{if(!p)ok=false;console.log((p?'PASS ':'FAIL ')+m)};

const D=C.DEF;
log(D.pk[0][1]===23 && D.pk[0][2]===7, 'DEF pk مقفول 7ك 23/7');
log(D.pk[1][1]===32 && D.pk[1][2]===7, 'DEF pk أوبن توب 7ك 32/7');
log(D.pk[2][1]===56 && D.pk[2][2]===14, 'DEF pk مقفول 14ك 56/14');
log(D.pk[3][1]===61 && D.pk[3][2]===15, 'DEF pk مقفول 15ك 61/15');
log(D.pk[4][1]===18 && D.pk[4][2]===15, 'DEF pk جامبو 15ك 18/15');
log(D.pk[5][1]===13.5 && D.pk[5][2]===7.5, 'DEF pk بلاستيك 8ك 13.5/7.5 unchanged');
log(D.sup[0][1]===520, 'DEF sup باليت 520');
log(D.sup[1][1]===170, 'DEF sup مناديل 170 unchanged');
log(D.sup[2][1]===300, 'DEF sup كود 300');
log(D.sup[3][1]===85, 'DEF sup شنمبر 85 unchanged');
log(D.sup[4][1]===293, 'DEF sup فحص 293 unchanged');
log(D.sup[5][1]===100, 'DEF sup زوايا 100');
log(D.sup[6][1]===30, 'DEF sup ستيكر 30');
log(D.sup[7][1]===0, 'DEF sup كمسيونجي 0 unchanged');
log(D.sup[8][1]===0, 'DEF sup أخرى 0');
log(D.sup.reduce((a,x)=>a+x[1],0)===1498, 'DEF sup total 1498');
log(D.var[0][0]==='برتقال أبوسرة تلوين' && D.var[0][1]===2500, 'DEF wash أبوسرة تلوين 2500');
log(D.variety==='برتقال أبوسرة تلوين', 'DEF selected variety matches first wash row');
log(D.var[1][0]==='برتقال بلدي' && D.var[1][1]===1800, 'DEF other varieties unchanged');
log(D.net===24000 && D.usd===52 && D.raw===10 && D.sar===3.75, 'DEF other scalar fields unchanged');

// saved user data from old version must win over new defaults
const oldS={
  net:24000,usd:52,raw:10,cullP:7,loss:0.005,cull:0.15,pw:0.005,pkg:0,
  variety:'برتقال أبوسرة تلوين',date:'2026-11-14',
  pk:[['كرتون مقفول 7 ك',23,7],['كرتون أوبن توب 7 ك',32,7],['كرتون مقفول 14 ك',56,14],['كرتون مقفول 15 ك',61,15],['صندوق بلاستيك جامبو 15 ك',18,15],['صندوق بلاستيك 8 ك',13.5,7.5]],
  sup:[['باليت',520],['مناديل وبصمة',170],['كود',300],['شنمبر',85],['فحص وعينة وتخليص',293],['زوايا',100],['ستيكر فحص',30],['كمسيونجي',0],['أخرى',0]],
  var:[['برتقال أبوسرة تلوين',2500],['برتقال بلدي',1800],['برتقال صيفي',1800],['ليمون',1800],['يوسفي',1800],['جريب فروت',1800]]
};
const store={'citrusCosts.v2':JSON.stringify({ver:2,t:1730000000000,S:oldS})};
global.localStorage={getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}};
const loaded=C._ld('citrusCosts.v2','citrusCosts');
log(JSON.stringify(loaded.pk)===JSON.stringify(oldS.pk), '_ld keeps saved pk array');
log(JSON.stringify(loaded.sup)===JSON.stringify(oldS.sup), '_ld keeps saved sup array');
log(JSON.stringify(loaded.var)===JSON.stringify(oldS.var), '_ld keeps saved var array');
log(loaded.variety===oldS.variety && loaded.date===oldS.date, '_ld keeps saved variety and date');

// old defaults saved on a previous version must NOT be overwritten by new DEF
const legacyS={
  net:21500,usd:50,raw:11,cullP:6,loss:0.01,cull:0.2,pw:0.01,pkg:2,
  variety:'ليمون',date:'2026-10-11',sar:3.75,
  pk:[['كرتون مقفول 7 ك',20,7],['كرتون أوبن توب 7 ك',24,7],['كرتون مقفول 14 ك',42,14],['كرتون مقفول 15 ك',46,15],['صندوق بلاستيك جامبو 15 ك',22,15],['صندوق بلاستيك 8 ك',13.5,7.5]],
  sup:[['باليت',400],['مناديل وبصمة',170],['كود',600],['شنمبر',85],['فحص وعينة وتخليص',293],['زوايا',80],['ستيكر فحص',18],['كمسيونجي',0],['أخرى',53]],
  var:[['برتقال أبوسرة',1800],['برتقال بلدي',1800],['برتقال صيفي',1800],['ليمون',1800],['يوسفي',1800],['جريب فروت',1800]]
};
store['citrusCosts.v2']=JSON.stringify({ver:2,t:1,S:legacyS});
const kept=C._ld('citrusCosts.v2','citrusCosts');
log(kept.pk[0][1]===20 && kept.sup[0][1]===400 && kept.sup[8][1]===53, '_ld does not overwrite old saved prices with new defaults');
log(kept.var[0][0]==='برتقال أبوسرة' && kept.var[0][1]===1800 && kept.variety==='ليمون', '_ld keeps old variety names and selection');
log(kept.net===21500 && kept.usd===50 && kept.pkg===2, '_ld keeps other saved scalars');

// field the user never had is filled from new defaults (sar missing)
const noSar={...legacyS};delete noSar.sar;
store['citrusCosts.v2']=JSON.stringify({ver:2,t:1,S:noSar});
const filled=C._ld('citrusCosts.v2','citrusCosts');
log(filled.sar===3.75 && filled.pk[0][1]===20, '_ld fills missing keys from DEF and keeps saved pk');

// no saved data -> new defaults
delete store['citrusCosts.v2'];
const fresh=C._ld('citrusCosts.v2','citrusCosts');
log(fresh.pk[0][1]===23 && fresh.sup[2][1]===300 && fresh.var[0][1]===2500, 'fresh load uses new defaults');

process.exit(ok?0:1);
