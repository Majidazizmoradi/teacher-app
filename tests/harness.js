'use strict';
// اجرای کد داخل www/index.html در یک محیط ایزوله (بدون مرورگر) برای آزمون خودکار
process.env.TZ = 'Asia/Tehran';
const fs = require('fs'), path = require('path'), vm = require('vm');
const DEFAULT_WWW = process.env.WWW_FILE || path.join(__dirname, '..', 'www', 'index.html');
const el = () => ({ innerHTML: '', value: '', style: {}, dataset: {}, textContent: '', select() {}, setAttribute() {}, removeAttribute() {}, addEventListener() {} });
const ctx2d = () => new Proxy({}, { get: (t, k) => k === 'measureText' ? (s => ({ width: String(s).length * 12 })) : (k in t ? t[k] : () => {}), set: (t, k, v) => { t[k] = v; return true; } });
function createApp(opts = {}) {
  const html = fs.readFileSync(opts.www || DEFAULT_WWW, 'utf8');
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('inline app script not found');
  const store = {};
  if (opts.db !== undefined && opts.db !== null) store['daftar-class-v1'] = typeof opts.db === 'string' ? opts.db : JSON.stringify(opts.db);
  const nodes = {};
  const doc = {
    querySelector: q => nodes[q] || (nodes[q] = el()), querySelectorAll: () => [], documentElement: el(), body: el(),
    addEventListener() {}, hidden: false, fonts: { load: async () => {} },
    createElement: () => ({ width: 0, height: 0, getContext: () => ctx2d(), toDataURL: () => 'data:image/png;base64,AAA', toBlob: f => f({ size: 3 }) })
  };
  const sb = {
    document: doc, console, Intl, TextEncoder, setTimeout: () => 0, clearTimeout() {},
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } }
  };
  sb.window = sb; sb.scrollTo = () => {}; sb.addEventListener = () => {}; sb.File = class {};
  const ctx = vm.createContext(sb);
  // ثابت کردن زمان برای نتیجه‌های تکرارپذیر
  vm.runInContext('(()=>{const RD=Date,FIX=new RD(2026,10,15,12,0,0).getTime();globalThis.Date=class extends RD{constructor(...a){a.length?super(...a):super(FIX)}static now(){return FIX}}})()', ctx);
  vm.runInContext(m[1], ctx, { filename: 'index.html<script>' });
  return { ctx, store, nodes, ev: c => vm.runInContext(c, ctx), json: c => JSON.parse(vm.runInContext('JSON.stringify((' + c + '))', ctx)) };
}
module.exports = { createApp };
