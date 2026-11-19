'use strict';
// خروجی محاسبات برنامه برای مقایسه با «نسخه طلایی» (خروجی نسخه v1.0). هر تغییر ناخواسته در محاسبات را آشکار می‌کند.
module.exports = function snapshot(app) {
  const j = app.json, S = {};
  S.counts = j(`({classes:db.classes.length,students:allStu().length,days:Object.keys(db.logs).length,entries:Object.values(db.logs).reduce((n,d)=>n+Object.values(d).reduce((m,a)=>m+a.length,0),0)})`);
  S.codes = j(`Object.fromEntries(allStu().map(x=>[x.s.id,x.s.code||null]))`);
  S.avMap = j(`avMap()`);
  for (const t of [0, 1, 2]) S['mst_term' + t] = j(`Object.fromEntries(allStu().map(x=>{const r=mstOf(x.s.id,${t});return[x.s.id,{avg:r.avg,adj:r.adj,fin:r.fin,n:r.sc.length,eff:r.eff}]}))`);
  S.ranks = j(`(()=>{const m=avMap(),all=allStu();return Object.fromEntries(all.map(x=>[x.s.id,ranks(x,m,all)]))})()`);
  S.termAvg = j(`Object.fromEntries(allStu().map(x=>[x.s.id,[avgTerm(x.s.id,1),avgTerm(x.s.id,2)]]))`);
  S.exams = j(`Object.fromEntries(db.classes.map(c=>[c.id,exList(c).map(o=>({id:o.id,d:o.d,t:o.t,tp:o.tp,v:o.v,ab:o.ab}))]))`);
  S.calendar = j(`({a:JP(par('2026-03-21')),b:JP(par('2026-11-15')),c:JP(par('2027-03-20')),m1:key(jStart(1405,1)),m8:key(jStart(1405,8)),m12:key(jStart(1405,12)),lens:Array.from({length:12},(_,i)=>{const m=i+1,a=jStart(1405,m),b=m===12?jStart(1406,1):jStart(1405,m+1);return Math.round((b-a)/864e5)})})`);
  S.helpers = j(`({a:num('۱۸٫۵'),b:num('17,25'),c:num('abc')===undefined,d:num('٢٠'),e:f2(16.666666),f:nf(1234),g:f2(null),h:gradeNo('هفتم'),i:gradeNo('دوازدهم'),j:secNo({name:'هفتم ب'}),k:autoTerm('2026-11-15'),l:autoTerm('2027-03-01'),m:autoTerm('2026-09-23'),n:autoTerm('2026-12-25'),o:autoTerm('2027-01-21'),p:autoTerm('2026-10-30')})`);
  const rep = o => j(`(()=>{RF=${JSON.stringify(o.RF || { sub: [], gr: [], cl: [], tm: [] })};syncTm();rtab=${o.tab};rf=${JSON.stringify(o.rf || '')};rt=${JSON.stringify(o.rt || '')};lcid=${JSON.stringify(o.lcid || '')};lo=${JSON.stringify(o.lo || { sort: 0, mst: 0, cmp: 0, avg: 1 })};rs=${JSON.stringify(o.rs || null)};rrules=0;view='rep';repView();return {lastRows,meta,attRows}})()`);
  const E = { sub: [], gr: [], cl: [], tm: [] };
  const combos = {
    all: { RF: E },
    c1_t1: { RF: { ...E, cl: ['c1'], tm: [1] } },
    c1_t2: { RF: { ...E, cl: ['c1'], tm: [2] } },
    grade7: { RF: { ...E, gr: ['هفتم'] } },
    science: { RF: { ...E, sub: ['علوم'] } },
    c1_range: { RF: { ...E, cl: ['c1'] }, rf: '2026-10-15', rt: '2026-12-01' },
    c1_sortmst: { RF: { ...E, cl: ['c1'] }, lo: { sort: 1, mst: 1, cmp: 0, avg: 1 } },
    c2c4_list: { RF: { ...E, cl: ['c2', 'c4'] }, lcid: 'c4' }
  };
  S.reports = {};
  for (const [name, o] of Object.entries(combos)) for (const tab of [0, 1, 2, 3, 4]) S.reports[name + '/tab' + tab] = rep({ ...o, tab, rs: tab === 2 ? 's_c1_02' : null });
  S.text = j(`(()=>{RF={sub:[],gr:[],cl:['c1'],tm:[]};syncTm();rtab=4;rf='';rt='';lcid='';lo={sort:0,mst:1,cmp:0,avg:1};view='rep';repView();exportRep();const t=rtxt;view='rep';return t})()`);
  app.ev(`RF={sub:[],gr:[],cl:[],tm:[]};syncTm();rtab=0;rf='';rt='';lcid='';lo={sort:0,mst:0,cmp:0,avg:1};view='home'`);
  return S;
};
