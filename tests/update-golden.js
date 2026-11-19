'use strict';
// فقط وقتی عمداً می‌خواهید «نتیجه درست» را عوض کنید اجرا شود (npm run golden). به‌صورت خودکار اجرا نمی‌شود.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
require('./make-fixtures.js');
const { createApp } = require('./harness'), snapshot = require('./snapshot');
const fxPath = path.join(__dirname, 'fixtures', 'baseline-db.json'), fxRaw = fs.readFileSync(fxPath);
const app = createApp({ db: fxRaw.toString('utf8') });
const g = snapshot(app);
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
g._fixtureSha256 = crypto.createHash('sha256').update(fxRaw).digest('hex');
g._baselineWwwSha256 = sha(path.join(__dirname, '..', 'www', 'index.html'));
g._note = 'نتیجه طلایی نسخه v1.0-baseline. بدون تأیید عوض نشود.';
fs.mkdirSync(path.join(__dirname, 'golden'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'golden', 'baseline.golden.json'), JSON.stringify(g));
console.log('golden written. sections:', Object.keys(g).length, '| report snapshots:', Object.keys(g.reports).length);
