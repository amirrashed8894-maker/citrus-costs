// baseline input sets (state objects S, same shape as the original app)
const DEF={net:24000,usd:52,raw:10,cullP:7,loss:0.005,cull:0.15,pw:0.005,pkg:0,variety:'برتقال أبوسرة',date:'2026-10-11',sar:3.75,
pk:[['كرتون مقفول 7 ك',20,7],['كرتون أوبن توب 7 ك',24,7],['كرتون مقفول 14 ك',42,14],['كرتون مقفول 15 ك',46,15],['صندوق بلاستيك جامبو 15 ك',22,15],['صندوق بلاستيك 8 ك',13.5,7.5]],
sup:[['باليت',400],['مناديل وبصمة',170],['كود',600],['شنمبر',85],['فحص وعينة وتخليص',293],['زوايا',80],['ستيكر فحص',18],['كمسيونجي',0],['أخرى',53]],
var:[['برتقال أبوسرة',1800],['برتقال بلدي',1800],['برتقال صيفي',1800],['ليمون',1800],['يوسفي',1800],['جريب فروت',1800]]};
const C=o=>Object.assign(JSON.parse(JSON.stringify(DEF)),o);
const sets=[
 ['default',C({})],
 ['pkg1_openTop',C({pkg:1})],
 ['pkg2_14k_usd50',C({pkg:2,usd:50.5})],
 ['pkg3_15k_raw12.75',C({pkg:3,raw:12.75,cullP:6.5})],
 ['pkg4_jumbo_loss2_cull22',C({pkg:4,loss:0.02,cull:0.22,variety:'ليمون'})],
 ['pkg5_8k_net21500_pw1.5',C({pkg:5,net:21500,pw:0.015,variety:'يوسفي'})],
 ['zero_loss_cull_pw',C({loss:0,cull:0,pw:0,raw:9})],
 ['custom_tables',(()=>{const s=C({variety:'جريب فروت',usd:48.25,sar:3.76,raw:11.4,cullP:4.2,net:22950,pkg:2});s.pk[2][1]=44.5;s.sup[0][1]=420;s.sup[7][1]=150;s.var[5][1]=2100;return s})()],
 ['high_values',C({raw:25,cullP:15,usd:61.3,cull:0.3,loss:0.035,pw:0.03,net:26000,pkg:3,variety:'برتقال صيفي'})],
 ['renamed_variety',(()=>{const s=C({});s.var[1]=['برتقال بلدي 2',1950];s.variety='برتقال بلدي 2';return s})()],
];
module.exports={DEF,sets};
