'use strict';
// ساخت داده آزمایشی ثابت (با تولیدکننده عدد تصادفی دانه‌دار؛ هر بار دقیقاً همان خروجی)
const fs = require('fs'), path = require('path');
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = mulberry32(20261115), rnd = n => Math.floor(R() * n), pad = (n, l = 2) => String(n).padStart(l, '0');
const addDays = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const fathers = ['اکبر', 'حسن', 'محمود', 'رضا', 'مهدی', 'حمید', 'جواد', 'سعید', 'کاظم', 'ناصر'];
const L = {
  c1: ['علی رضایی', 'سارا احمدی', 'رضا کریمی', 'مریم حسینی', 'علی رضایی', 'نیما صادقی', 'زهرا موسوی', 'امیر محمدی', 'هانیه قاسمی', 'پارسا جلالی'],
  c2: ['محمد نوری', 'فاطمه رحیمی', 'حسین اکبری', 'نرگس فرهادی', 'سینا یوسفی', 'الهام کاظمی', 'کیان عباسی', 'ملیکا سلطانی'],
  c4: ['دانیال بهرامی', 'یاسمن حیدری', 'آرمین زارعی', 'ترانه شریفی', 'بهنام قربانی', 'سحر مرادی']
};
const students = (cid, names, pre) => names.map((n, i) => ({ id: 's_' + cid + '_' + pad(i + 1), pid: pre + pad(i + 1), name: n, father: fathers[i % fathers.length], sid: '', phone: '', note: '' }));
const s1 = students('c1', L.c1, 'p1_');
const classes = [
  { id: 'c1', name: 'هفتم الف', sub: 'ریاضی', grade: 'هفتم', yr: '۱۴۰۵-۱۴۰۶', sch: 'شهید بهشتی', tch: 'احمدی', fin: 'غیرنهایی', students: s1 },
  { id: 'c2', name: 'هفتم ب', sub: 'ریاضی', grade: 'هفتم', yr: '۱۴۰۵-۱۴۰۶', sch: 'شهید بهشتی', tch: 'احمدی', fin: 'غیرنهایی', students: students('c2', L.c2, 'p2_') },
  { id: 'c3', name: 'هفتم الف', sub: 'علوم', grade: 'هفتم', yr: '۱۴۰۵-۱۴۰۶', sch: 'شهید بهشتی', tch: 'کریمی', fin: 'غیرنهایی', students: s1.map((s, i) => Object.assign({}, s, { id: 's_c3_' + pad(i + 1) })) },
  { id: 'c4', name: 'هشتم الف', sub: 'ریاضی', grade: 'هشتم', yr: '۱۴۰۵-۱۴۰۶', sch: 'شهید بهشتی', tch: 'احمدی', fin: 'نهایی', students: students('c4', L.c4, 'p4_') }
];
const dates = [];
for (let d = '2026-09-27'; d <= '2026-12-24'; d = addDays(d, 3)) dates.push(d);
for (let d = '2027-02-02'; d <= '2027-05-12'; d = addDays(d, 3)) dates.push(d);
const logs = {}; let eid = 0;
const push = (date, sid, e) => { (logs[date] = logs[date] || {}); (logs[date][sid] = logs[date][sid] || []).push(Object.assign({ id: 'e' + pad(++eid, 5), n: '' }, e)); };
const DISC = [['منفی', 'b'], ['مثبت', 'g'], ['سروصدا کردن', 'b'], ['تشویقی', 'g'], ['اخراج از کلاس', 'b']];
const exN = { c1: 0, c2: 0, c3: 0, c4: 0 };
dates.forEach((date, i) => {
  const tm = date < '2027-01-20' ? 1 : 2;
  classes.forEach((c, ci) => {
    if ((i + ci) % 2) return;
    const T = () => (R() < 0.8 ? { tm } : {});
    c.students.forEach(s => {
      const r = R(), t = r < 0.08 ? ['غایب', 'b'] : r < 0.14 ? ['تأخیر', 'i'] : ['حاضر', 'g'];
      push(date, s.id, Object.assign({ t: t[0], k: t[1], s: 'd', att: 1 }, T()));
    });
    if (i % 7 === ci % 7) {
      const n = ++exN[c.id], ex = 'ex_' + c.id + '_' + n, type = n % 2 ? 'امتحان کتبی' : 'پرسش شفاهی';
      c.students.forEach(s => push(date, s.id, R() < 0.06 ? { t: type, k: 'b', s: 'a', tm, ex, tp: 'فصل ' + n, ab: 1 } : { t: type, k: 'n', s: 'a', tm, ex, tp: 'فصل ' + n, sc: 8 + rnd(25) / 2 }));
    }
    if (i % 11 === 5) for (let q = 0; q < 3; q++) push(date, c.students[rnd(c.students.length)].id, Object.assign({ t: 'تحقیق', k: 'n', s: 'a', sc: 10 + rnd(11) }, T()));
    if (i % 6 === 1) for (let q = 0; q < 2; q++) push(date, c.students[rnd(c.students.length)].id, Object.assign({ t: 'مشارکت در کلاس', k: 'g', s: 'a' }, T()));
    if (i % 5 === 2) { const d = DISC[rnd(DISC.length)]; push(date, c.students[rnd(c.students.length)].id, Object.assign({ t: d[0], k: d[1], s: 'd' }, T())); }
  });
});
// حالت‌های مرزی: دو پرسش بدون شناسه امتحان در یک روز با مبحث‌های مختلف (باید دو ستون جدا بشوند)
push('2026-10-12', s1[0].id, { t: 'پرسش', k: 'n', s: 'a', tm: 1, sc: 15, tp: 'الف' });
push('2026-10-12', s1[1].id, { t: 'پرسش', k: 'n', s: 'a', tm: 1, sc: 12, tp: 'ب' });
const db = {
  classes, logs, v2: 1, term: 1, theme: 'light', fs: 'm', mx: 20, defs: {},
  acts: { a: ['پرسش', 'امتحان کتبی', 'کنفرانس', 'کار کلاسی', 'تحقیق', 'مشارکت در کلاس', 'امتحان پایانی'].map(l => ({ l, k: l === 'مشارکت در کلاس' ? 'g' : 'n' })), d: DISC.map(a => ({ l: a[0], k: a[1] })) },
  rules: { pts: { 'غایب': -0.5, 'تأخیر': -0.25, 'منفی': -0.5, 'اخراج از کلاس': -1, 'سروصدا کردن': -0.25, 'مثبت': 0.25, 'تشویقی': 0.5, 'مشارکت در کلاس': 0.25, 'تحقیق': 0.5, 'امتحان کتبی': -2 } }, // قانون امتحان فقط برای آزمون است: غایب در امتحان نباید کسر شود
  teachers: [{ id: 't1', name: 'احمدی', phone: '', field: 'ریاضی', note: '' }, { id: 't2', name: 'کریمی', phone: '', field: 'علوم', note: '' }],
  periods: [{ from: '08:00', to: '08:45' }, { from: '08:50', to: '09:35' }, { from: '09:50', to: '10:35' }],
  sched: [{ id: 'w1', day: 0, per: 1, cid: 'c1', sub: '', mig: 1 }, { id: 'w2', day: 0, per: 2, cid: 'c3', sub: '', mig: 1 }, { id: 'w3', day: 2, per: 1, cid: 'c4', sub: '', mig: 1 }],
  plans: [{ id: 'pl1', type: 'y', cid: 'c1', rows: [{ m: 'مهر', title: 'فصل ۱', n: '8', goal: 'آشنایی', method: 'پرسش و پاسخ', eval: 'کتبی' }] }, { id: 'pl2', type: 'd', cid: 'c1', date: '2026-10-05', dur: '45', topic: 'معادله' }],
  notes: [{ id: 'n1', cid: 'c1', text: 'یادداشت آزمایشی', date: '2026-10-01' }],
  books: [{ id: 'b1', name: 'کتاب ریاضی', size: 1234, cid: 'c1', kind: 'کتاب', d: '2026-10-01' }]
};
const out = path.join(__dirname, 'fixtures', 'baseline-db.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(db));
if (require.main === module) console.log('fixture written:', out, Math.round(fs.statSync(out).size / 1024) + ' KB', '| entries:', eid);
module.exports = db;
