/* ==========================================================================
   sfx.js — مشغّل أصوات بسيط يعتمد فقط على واجهة Audio القياسية في المتصفح
   لا يحتاج أي مكتبة خارجية أو تثبيت.

   طريقة الاستخدام داخل React (مضافة مسبقاً في HSEJourney.browser.jsx):
       SFX.play("correct");   // يُشغّل assets/sfx/correct.mp3
       SFX.play("wrong");     // يُشغّل assets/sfx/wrong.mp3
       SFX.play("unlock");    // يُشغّل assets/sfx/unlock.mp3
       SFX.play("complete");  // يُشغّل assets/sfx/complete.mp3

   إذا لم يوجد الملف الصوتي المطلوب في assets/sfx بعد (المجلد فارغ افتراضياً)،
   ستفشل المحاولة بصمت (تُطبع رسالة تحذير في console فقط) دون أن تُعطّل اللعبة.
   بمجرد وضع ملفات .mp3 الحقيقية بنفس الأسماء داخل assets/sfx، ستعمل تلقائياً
   دون أي تعديل إضافي على الكود.
   ========================================================================== */

const SFX = {
  _cache: {},
  _enabled: true,

  _files: {
    correct: "./assets/sfx/correct.mp3",
    wrong: "./assets/sfx/wrong.mp3",
    unlock: "./assets/sfx/unlock.mp3",
    complete: "./assets/sfx/complete.mp3",
  },

  play(name) {
    if (!this._enabled) return;
    const src = this._files[name];
    if (!src) return;

    try {
      // إعادة استخدام عنصر Audio نفسه إن وُجد مسبقاً في الذاكرة المؤقتة
      let audio = this._cache[name];
      if (!audio) {
        audio = new Audio(src);
        audio.volume = 0.55;
        this._cache[name] = audio;
      } else {
        audio.currentTime = 0; // إعادة الصوت لبدايته لو كان لا يزال يُشغَّل
      }
      audio.play().catch(() => {
        // يحدث هذا غالباً إذا كان الملف غير موجود بعد في assets/sfx
        console.warn(`SFX: تعذّر تشغيل "${name}" — تأكد من وجود الملف في assets/sfx/${name}.mp3`);
      });
    } catch (e) {
      console.warn("SFX error:", e);
    }
  },

  // لإيقاف كل الأصوات من واجهة اللعبة (زر كتم اختياري)
  toggle(enabled) {
    this._enabled = enabled;
  },
};
