// js/contract.js
(function (global) {
  "use strict";

  const ContractApp = {
    addEmpty(targetLeadForm) {
      if (!targetLeadForm) return -1; // Return -1 ถ้าไม่มีข้อมูล
      if (!Array.isArray(targetLeadForm.contracts)) {
        targetLeadForm.contracts = [];
      }

      // สร้างสัญญาใหม่ (Business Logic ล้วนๆ)
      const empty = global.DataSpec.Contract.createEmpty();
      targetLeadForm.contracts.push(empty);

      // คำนวณ Index ใหม่
      const newIndex = targetLeadForm.contracts.length - 1;

      global.AppNotifications?.show("เพิ่มสัญญาใหม่เรียบร้อย");

      // ✅ Return Index ออกไปให้คนเรียก (UI) ตัดสินใจเองว่าจะทำอะไรต่อ
      return newIndex;
    },

    resetNewForm() {
      // ... (คงเดิม)
      if (!global.AppState || !global.AppState.newContractForm) return;
      const empty = global.DataSpec.Contract.createEmpty();
      Object.assign(global.AppState.newContractForm, empty);
    },
  };

  global.ContractApp = ContractApp;
})(window);
