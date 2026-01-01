// js/shortcutKey.js
// --------------------------------------------------------
// ⌨️ Shortcut Key Manager
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppShortcut = {
    _handler: null,

    init() {
      if (this._handler) return;

      this._handler = (e) => {
        if (global.AppState && global.AppState.hotkeysEnabled.value === false)
          return;

        const tag = e.target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") return;

        // Alt + L -> เปิด Modal Lead
        if (e.altKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          // ✅ Correct Architecture
          if (global.AppGui) global.AppGui.openLeadModal();
          return;
        }

        // Alt + C -> ปิดเมนูทั้งหมด
        if (e.altKey && (e.key === "c" || e.key === "C")) {
          e.preventDefault();
          if (global.AppGui) global.AppGui.closeAllMenus();
          return;
        }

        // Alt + B -> เปิด Bot
        if (e.altKey && (e.key === "b" || e.key === "B")) {
          e.preventDefault();
          // ✅ Correct Architecture
          if (global.AppGui) global.AppGui.openBotModal();
          return;
        }

        if (e.key === "F1") {
          e.preventDefault();
          console.log("Help Triggered");
        }
      };

      window.addEventListener("keydown", this._handler);
      console.log("⌨️ AppShortcut: Initialized (Architecture Fixed)");
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
