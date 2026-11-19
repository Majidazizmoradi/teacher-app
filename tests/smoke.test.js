'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('fs'), path = require('path');
const { createApp } = require('./harness');
const fx = fs.readFileSync(path.join(__dirname, 'fixtures', 'baseline-db.json'), 'utf8');
test('همه صفحه‌ها بدون خطا ساخته می‌شوند', () => {
  const app = createApp({ db: fx });
  const views = { home: 'homeView', class: 'classView', acad: 'listView', disc: 'listView', manage: 'manageView', rep: 'repView', repText: 'repTextView', plans: 'plansView', books: 'booksView', settings: 'settingsView', att: 'attView', attC: 'attCView', sched: 'schedView', notes: 'notesView', exam: 'examView', help: 'helpView' };
  for (const [v, f] of Object.entries(views)) {
    const html = app.ev(`(()=>{cur='c1';view='${v}';rtab=0;return ${f}()})()`);
    assert.equal(typeof html, 'string', v);
    assert.ok(html.length > 50, v + ' خالی است');
    assert.ok(!/undefined|NaN|\[object/.test(html), v + ' شامل undefined/NaN است');
  }
});
test('تصویرهای گزارش (تحلیلی و فهرست) ساخته می‌شوند', async () => {
  const app = createApp({ db: fx });
  for (const [tab, it] of [[0, 0], [2, 0], [4, 1]]) {
    await app.ev(`(()=>{cur='c1';RF={sub:[],gr:[],cl:['c1'],tm:[]};syncTm();rtab=${tab};rs='s_c1_02';itype=${it};io={prog:1,disc:1,desc:1,cmp:1};lo={sort:0,mst:1,cmp:1,avg:1};view='repImg';return itype===1?drawList():drawImg()})()`);
  }
});
