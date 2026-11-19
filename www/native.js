/* پل اتصال به امکانات اندروید (فقط داخل APK فعال می‌شود) */
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var P = C.Plugins || {};

  function toBase64(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(String(r.result).split(',')[1]); };
      r.onerror = rej;
      r.readAsDataURL(blob);
    });
  }
  async function cacheFile(name, blob) {
    var data = await toBase64(blob);
    var r = await P.Filesystem.writeFile({ path: name, data: data, directory: 'CACHE' });
    return r.uri;
  }

  /* باز کردن PDF با برنامه‌های نصب‌شده روی گوشی */
  window.openBook = async function (id) {
    var b = db.books.find(function (x) { return x.id === id; });
    try {
      var f = await idbDo('readonly', function (st) { return st.get(id); });
      if (!f) { bmsg = 'فایل پیدا نشد.'; render(); return; }
      var uri = await cacheFile('book-' + id + '.pdf', f);
      if (P.FileOpener) await P.FileOpener.open({ filePath: uri, contentType: 'application/pdf' });
      else await P.Share.share({ title: b ? b.name : 'PDF', files: [uri] });
      bmsg = '';
    } catch (e) {
      bmsg = 'باز کردن فایل ممکن نشد. ' + ((e && e.message) || '');
    }
    render();
  };

  /* ارسال یا ذخیره تصویر گزارش */
  window.shareImg = async function () {
    var m = document.querySelector('#imsg');
    if (!rblob) { if (m) m.textContent = 'تصویر هنوز آماده نیست.'; return; }
    try {
      var uri = await cacheFile('report-' + Date.now() + '.png', rblob);
      await P.Share.share({ title: 'گزارش', files: [uri] });
    } catch (e) {
      if (m && !/cancel/i.test((e && e.message) || '')) m.textContent = 'ارسال ممکن نشد.';
    }
  };

  /* ارسال پشتیبان به تلگرام، ایمیل و ... */
  window.shareBackup = async function () {
    var t = JSON.stringify(Object.assign({}, db, { lock: undefined }));
    try { await P.Share.share({ title: 'پشتیبان دفتر کلاس', text: t }); } catch (e) {}
  };

  /* دکمه برگشت اندروید و قفل هنگام رفتن به پس‌زمینه */
  if (P.App) {
    P.App.addListener('backButton', function () {
      if (locked && db.lock) { P.App.exitApp(); return; }
      if (dp) { dpClose(); return; }
      if (pk) { pkClose(); return; }
      if (wp !== null || wd) { closeW(); return; }
      if (ed) { closeEd(); return; }
      if (sid) { closeS(); return; }
      if (view !== 'home') { back(); return; }
      P.App.exitApp();
    });
    P.App.addListener('appStateChange', function (s) { if (!s.isActive) lockNow(); });
  }
})();
