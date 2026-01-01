// js/log.js
// --------------------------------------------------------
// 📞 Log App (จัดการประวัติการติดต่อ/ติดตาม)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const LogApp = {
    // ----------------------------------------------------
    // ⭐ บันทึกการโทร
    // ----------------------------------------------------
    async addCallLog(leadId, result, note) {
      const logEntry = {
        leadId: leadId,
        action: "Call",
        result: result, // รับสาย, ไม่รับ, ตัดสาย
        note: note,
        timestamp: new Date().toISOString(),
      };

      // บันทึกลง Dexie (ต้องมีตาราง logs ใน dexie.js)
      // await global.AppDexie.logs.add(logEntry);
      console.log("📝 บันทึก Log:", logEntry);

      if (global.AppNotifications) {
        global.AppNotifications.show("บันทึกผลการติดตามแล้ว");
      }
    },
  };

  global.LogApp = LogApp;
})(window);
