// js/contract.js
// --------------------------------------------------------
// 📜 CONTRACT MANAGEMENT MODULE
// --------------------------------------------------------
// โมดูลจัดการตรรกะของสัญญา (Contract Business Logic)
// แยกออกมาจาก LeadApp เพื่อลดความซ้ำซ้อนและจัดการ State ได้ดีขึ้น
// --------------------------------------------------------

(function (global) {
  "use strict";

  // ดึง dependencies ที่จำเป็น
  const { reactive, watch } = Vue;

  const ContractApp = {
    // ========================================================================
    // 1. REACTIVE STATE (สร้าง State เป็นของตัวเอง)
    // ========================================================================
    // ใช้สำหรับเก็บข้อมูลฟอร์มสัญญาใหม่ หรือสถานะการทำงานภายใน
    state: reactive({
      isExpanded: false,
      activeTab: 0,
    }),

    // ฟอร์มสำหรับ "สัญญาใหม่" (ย้ายมาจัดการที่นี่แทน AppState)
    form: reactive(global.DataSpec.Contract.createDefault()),

    // ========================================================================
    // 2. INITIALIZATION
    // ========================================================================
    init(state) {
      // ยังคงรับ state มาเพื่อดู Trigger การเปิดปิด Modal ได้เหมือนเดิม
      if (state && state.isOpenSubContractDialog) {
        watch(state.isOpenSubContractDialog, (isOpen) => {
          if (!isOpen) {
            console.log("📄 ContractApp: Dialog closed. Cleaning up...");
            this.resetForm();
          }
        });
      }
    },

    // ========================================================================
    // 3. LOGIC (ย้ายการทำงานจาก LeadApp มาไว้ที่นี่)
    // ========================================================================

    /**
     * เพิ่มสัญญาเปล่าลงใน Lead Form
     * @param {Object} targetLeadForm - Object ของ Lead ที่ต้องการเพิ่มสัญญา
     * @returns {Number} Index ของสัญญาที่เพิ่งเพิ่ม
     */
    addToLead(targetLeadForm) {
      if (!targetLeadForm) return -1;

      // ตรวจสอบความถูกต้องของ Array
      if (!Array.isArray(targetLeadForm.contracts)) {
        targetLeadForm.contracts = [];
      }

      // สร้างข้อมูลสัญญาใหม่จาก DataSpec
      const newContract = global.DataSpec.Contract.createDefault();

      // เพิ่มลงใน Array (Vue จะอัปเดต UI ให้อัตโนมัติเพราะ targetLeadForm เป็น Reactive)
      const newLength = targetLeadForm.contracts.push(newContract);

      console.log("✅ ContractApp: Added new contract to lead.");
      return newLength - 1; // คืนค่า Index ล่าสุด
    },

    /**
     * รีเซ็ตฟอร์มสัญญา (ใช้ form ของตัวเองในไฟล์นี้)
     */
    resetForm() {
      if (global.Utils && global.Utils.resetForm) {
        // รีเซ็ตค่าใน this.form ของตัวเอง
        global.Utils.resetForm(
          this.form,
          global.DataSpec.Contract.createDefault()
        );
      }
    },

    // ========================================================================
    // 4. COMPATIBILITY & ALIASES (ส่วนที่ขาดไป)
    // ========================================================================

    /**
     * ✅ FIX BUG: สร้าง Alias ชื่อ resetNewForm
     * เพื่อให้ไฟล์ gui.js เรียกใช้ได้โดยไม่ Error (เพราะของเก่าเรียกชื่อนี้)
     */
    resetNewForm() {
      this.resetForm();
    },
  };

  // ส่งออกเป็น Global Object
  global.ContractApp = ContractApp;
})(window);
