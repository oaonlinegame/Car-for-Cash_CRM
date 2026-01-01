// js/shortcutKey.js
// --------------------------------------------------------
// ⌨️ Shortcut Key Manager
// --------------------------------------------------------
// ✅ Refactored: ตัด Engine ที่ซับซ้อนทิ้ง ใช้การเช็ค Key แบบตรงไปตรงมา
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppShortcut = {
    // เก็บ Handler ไว้
    _handler: null,

    init() {
      if (this._handler) return; // ป้องกัน Init ซ้ำ

      this._handler = (e) => {
        // 1. เช็คว่าระบบ Hotkey เปิดอยู่ไหม
        if (global.AppState && global.AppState.hotkeysEnabled.value === false)
          return;

        // 2. ถ้ากำลังพิมพ์ใน Input/Textarea ไม่ควรทำงาน (ยกเว้นบางปุ่ม)
        const tag = e.target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") return;

        // 3. Mapping ปุ่ม (Logic แบบบ้านๆ แต่อ่านง่ายและเร็ว)
        // Alt + L -> เปิด Modal Lead
        if (e.altKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          // เรียกผ่าน State โดยตรง
          if (global.AppState) global.AppState.isOpenModalLead.value = true;
          return;
        }

        // Alt + C -> ปิดเมนูทั้งหมด
        if (e.altKey && (e.key === "c" || e.key === "C")) {
          e.preventDefault();
          if (global.AppGui) global.AppGui.closeAllMenus();
          return;
        }

        // Alt + B -> เปิด Bot (ถ้ามี)
        if (e.altKey && (e.key === "b" || e.key === "B")) {
          e.preventDefault();
          if (global.AppBot) global.AppBot.autoFill();
          return;
        }

        // F1 -> Help (ตัวอย่าง)
        if (e.key === "F1") {
          e.preventDefault();
          console.log("Help Triggered");
        }
      };

      window.addEventListener("keydown", this._handler);
      console.log("⌨️ AppShortcut: Initialized (Simple Mode)");
    },

    cleanup() {
      if (this._handler) {
        window.removeEventListener("keydown", this._handler);
        this._handler = null;
      }
    },
  };

  global.AppShortcut = AppShortcut;
})(window);
