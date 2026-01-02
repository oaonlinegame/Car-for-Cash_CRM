// js/contract.js
(function (global) {
  "use strict";

  const ContractApp = {
    // ----------------------------------------------------
    // ✅ เพิ่มสัญญาเปล่าลงใน Lead
    // ----------------------------------------------------
    addEmpty(targetLeadForm) {
      if (!targetLeadForm) return -1;
      if (!Array.isArray(targetLeadForm.contracts)) {
        targetLeadForm.contracts = [];
      }

      // ⚠️ แก้ไข: เรียกใช้ createDefault() ให้ตรงกับ DataSpec
      if (global.DataSpec && global.DataSpec.Contract) {
        const empty = global.DataSpec.Contract.createDefault();
        targetLeadForm.contracts.push(empty);
      } else {
        console.error("❌ DataSpec.Contract not found");
        return -1;
      }

      // คำนวณ Index ใหม่
      const newIndex = targetLeadForm.contracts.length - 1;

      if (global.AppNotifications) {
        global.AppNotifications.show("เพิ่มสัญญาใหม่เรียบร้อย");
      }

      return newIndex;
    },

    // ----------------------------------------------------
    // ✅ รีเซ็ตฟอร์มสัญญาใหม่ (ถ้ามีใช้)
    // ----------------------------------------------------
    resetNewForm() {
      if (!global.AppState || !global.AppState.newContractForm) return;

      // ⚠️ แก้ไข: เรียกใช้ createDefault()
      if (global.DataSpec && global.DataSpec.Contract) {
        const empty = global.DataSpec.Contract.createDefault();
        Object.assign(global.AppState.newContractForm, empty);
      }
    },
  };

  global.ContractApp = ContractApp;
})(window);
