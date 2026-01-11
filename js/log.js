// js/log.js
(function (global) {
  "use strict";

  const LogApp = {
    // ----------------------------------------------------
    // ⭐ เปิดหน้าต่างบันทึก Log (UI Trigger)
    // ----------------------------------------------------
    openAdd(lead) {
      console.log("📝 Open Log Modal for:", lead);

      // 1. (Optional) คุณอาจจะอยากเก็บ lead ปัจจุบันลง State เพื่อแสดงชื่อใน Modal
      // if (global.AppState) global.AppState.currentLogLead = lead;

      // 2. สั่งเปิด Modal ผ่าน AppGui
      if (global.AppGui) {
        global.AppGui.toggleMenu("isOpenModalLog", true);
      } else {
        console.error("❌ AppGui not found");
      }
    },

    // ----------------------------------------------------
    // ⭐ บันทึกการโทร (Logic)
    // ----------------------------------------------------
    async addCallLog(leadId, result, note) {
      const logEntry = {
        leadId: leadId,
        action: "Call",
        result: result,
        note: note,
        timestamp: new Date().toISOString(),
      };

      // บันทึกลง Dexie (ถ้ามี)
      // await global.AppDexie.logs.add(logEntry);

      console.log("✅ Saved Log:", logEntry);

      if (global.AppNotifications) {
        global.AppNotifications.show("บันทึกผลการติดตามแล้ว");
      }
    },
  };

  global.LogApp = LogApp;
})(window);
