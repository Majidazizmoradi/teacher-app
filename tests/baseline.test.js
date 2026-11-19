'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { createApp } = require('./harness'), snapshot = require('./snapshot');
const fxPath = path.join(__dirname, 'fixtures', 'baseline-db.json'), fxRaw = fs.readFileSync(fxPath);
const golden = JSON.parse(fs.readFileSync(path.join(__dirname, 'golden', 'baseline.golden.json'), 'utf8'));
test('داده آزمایشی دست‌نخورده است', () => {
  assert.equal(crypto.createHash('sha256').update(fxRaw).digest('hex'), golden._fixtureSha256);
});
const now = snapshot(createApp({ db: fxRaw.toString('utf8') }));
for (const k of Object.keys(golden).filter(k => k[0] !== '_')) {
  if (k === 'reports') {
    for (const r of Object.keys(golden.reports)) test('گزارش ' + r, () => assert.deepStrictEqual(now.reports[r], golden.reports[r]));
  } else test('محاسبه ' + k, () => assert.deepStrictEqual(now[k], golden[k]));
}
test('ذخیره‌سازی: load و save بدون از دست رفتن اطلاعات', () => {
  const app = createApp({ db: fxRaw.toString('utf8') });
  app.ev('save()');
  const saved = JSON.parse(app.store['daftar-class-v1']), fx = JSON.parse(fxRaw.toString('utf8'));
  const cnt = d => Object.values(d.logs).reduce((n, x) => n + Object.values(x).reduce((m, a) => m + a.length, 0), 0);
  assert.equal(saved.classes.length, fx.classes.length);
  assert.equal(saved.classes.reduce((n, c) => n + c.students.length, 0), fx.classes.reduce((n, c) => n + c.students.length, 0));
  assert.equal(cnt(saved), cnt(fx));
});
