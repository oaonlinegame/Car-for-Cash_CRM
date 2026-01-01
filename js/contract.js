// js/contract.js
// --------------------------------------------------------
// 📜 Contract App
// --------------------------------------------------------

(function (global) {
  "use strict";

  const ContractApp = {
    addEmpty(targetLeadForm) {
      if (!targetLeadForm) return;
      if (!Array.isArray(targetLeadForm.contracts)) {
        targetLeadForm.contracts = [];
      }

      // สร้างสัญญาใหม่
      const empty = global.DataSpec.Contract.createEmpty();
      targetLeadForm.contracts.push(empty);

      // คำนวณ Index ใหม่
      const newIndex = targetLeadForm.contracts.length - 1;

      // ✅ ใช้ nextTick: รอให้ Vue อัปเดต DOM เสร็จก่อน แล้วค่อยเปลี่ยน Tab
      // ต้องเรียกผ่าน Vue global เพราะเราไม่มี instance ตรงนี้
      Vue.nextTick(() => {
        if (global.AppState && global.AppState.leadTab) {
          global.AppState.leadTab.value = "contract-" + newIndex;
        }
      });

      // รีเซ็ต UI
      if (global.AppState) {
        if (global.AppState.contractInnerTab)
          global.AppState.contractInnerTab.value = "all";
      }

      global.AppNotifications?.show("เพิ่มสัญญาใหม่เรียบร้อย");
    },

    resetNewForm() {
      if (!global.AppState || !global.AppState.newContractForm) return;
      const empty = global.DataSpec.Contract.createEmpty();
      Object.assign(global.AppState.newContractForm, empty);
    },
  };

  global.ContractApp = ContractApp;
})(window);
