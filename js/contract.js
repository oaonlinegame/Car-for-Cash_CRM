// js/contract.js
// --------------------------------------------------------
// 📜 CONTRACT MANAGEMENT MODULE
// --------------------------------------------------------
// โมดูลจัดการตรรกะของสัญญา (Contract Business Logic)
// ควบคุมวงจรชีวิตของฟอร์มสัญญา, การเพิ่มสัญญาใหม่,
// และการรีเซ็ตค่าสถานะเมื่อ UI มีการเปลี่ยนแปลง
// --------------------------------------------------------

(function (global) {
  "use strict";

  const ContractApp = {
    // ========================================================================
    // 1. INITIALIZATION & LIFECYCLE (การเริ่มต้นและวงจรชีวิต)
    // ========================================================================

    /**
     * เริ่มต้นโมดูลและตั้งค่า Event Listener
     * @param {Object} state - Global AppState
     * * การทำงาน:
     * - ตรวจสอบสถานะของ Dialog สร้างสัญญา (isOpenSubContractDialog)
     * - เมื่อ Dialog ถูกปิด (isOpen == false) จะสั่งรีเซ็ตฟอร์มทันที
     * - ป้องกันข้อมูลค้าง (Stale State) เมื่อเปิด Dialog ครั้งถัดไป
     */
    init(state) {
      if (state && state.isOpenSubContractDialog) {
        Vue.watch(state.isOpenSubContractDialog, (isOpen) => {
          if (!isOpen) {
            console.log("📄 ContractApp: Dialog closed. Cleaning up...");
            this.resetNewForm();
          }
        });
      }
    },

    // ========================================================================
    // 2. DATA MANIPULATION (การจัดการข้อมูลสัญญา)
    // ========================================================================

    /**
     * เพิ่มสัญญาเปล่าลงในฟอร์ม Lead (Nested Data Structure)
     * @param {Object} targetLeadForm - Object ของ Lead ที่ต้องการเพิ่มสัญญา
     * * การทำงาน:
     * 1. ตรวจสอบว่ามี Array contracts หรือไม่ หากไม่มีให้สร้างใหม่
     * 2. สร้าง Default Contract Object จาก DataSpec
     * 3. เพิ่มลงใน Array เพื่อให้ UI แสดงรายการสัญญาใหม่
     */
    addEmpty(targetLeadForm) {
      if (!targetLeadForm) return;

      // Ensure data integrity
      if (!Array.isArray(targetLeadForm.contracts)) {
        targetLeadForm.contracts = [];
      }

      targetLeadForm.contracts.push(global.DataSpec.Contract.createDefault());
    },

    // ========================================================================
    // 3. FORM STATE MANAGEMENT (การจัดการสถานะฟอร์ม)
    // ========================================================================

    /**
     * รีเซ็ตฟอร์มสร้างสัญญาใหม่ (New Contract Form) ให้กลับสู่ค่าเริ่มต้น
     * * เทคนิค:
     * - ใช้ `Utils.resetForm` แทนการ Assign ค่าตรงๆ
     * - เพื่อทำการ Deep Clean และจัดการ Reactive Properties ได้อย่างสมบูรณ์
     * - ป้องกันปัญหาฟิลด์ค้างหรือสถานะไม่ถูกต้อง
     */
    resetNewForm() {
      // ตรวจสอบความพร้อมของ State และ Dependencies
      if (!global.AppState || !global.AppState.newContractForm) return;

      if (global.DataSpec && global.DataSpec.Contract && global.Utils) {
        // เรียกใช้ Utility กลางเพื่อรีเซ็ตข้อมูลตาม Schema มาตรฐาน
        global.Utils.resetForm(
          global.AppState.newContractForm,
          global.DataSpec.Contract.createDefault()
        );
      }
    },
  };

  // ส่งออก ContractApp เป็น Global Object
  global.ContractApp = ContractApp;
})(window);
