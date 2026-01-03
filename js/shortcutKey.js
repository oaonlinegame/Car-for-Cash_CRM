// js/shortcutKey.js
// --------------------------------------------------------
// ⌨️ Shortcut Key System (ระบบจัดการคีย์ลัด)
// --------------------------------------------------------
// โมดูลนี้ทำหน้าที่ดักจับเหตุการณ์การกดแป้นพิมพ์ (Keyboard Events)
// และแปลงปุ่มที่กดให้เป็นการกระทำ (Action) ภายในแอปพลิเคชัน
// ช่วยเพิ่มความเร็วในการทำงานของผู้ใช้ (Productivity)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppShortcut = {
    // ========================================================================
    // 1. STATE & LISTENER MANAGEMENT (จัดการสถานะและ Event Listener)
    // ========================================================================

    /**
     * ตัวแปรเก็บฟังก์ชัน Handler เพื่อใช้สำหรับถอนการติดตั้ง (Cleanup)
     * ป้องกันการสร้าง Listener ซ้ำซ้อน (Memory Leak Prevention)
     */
    activeListener: null,

    /**
     * เริ่มต้นระบบคีย์ลัด
     * ทำการผูก (Bind) Event Listener เข้ากับ window
     * ควรเรียกใช้เมื่อแอปพลิเคชันเริ่มทำงาน (Mounted)
     */
    init() {
      // ตรวจสอบว่ามี Listener เดิมอยู่หรือไม่ ถ้ามีให้ลบออกก่อน
      if (this.activeListener) {
        this.cleanup();
      }

      // สร้างฟังก์ชัน Handler และผูก context
      this.activeListener = this.handleKeydown.bind(this);

      // เริ่มดักจับเหตุการณ์ keydown ที่ระดับ window
      window.addEventListener("keydown", this.activeListener);
      console.log("⌨️ Shortcut: Activated");
    },

    /**
     * ยกเลิกระบบคีย์ลัด
     * ถอด Event Listener ออกจาก window
     * ควรเรียกใช้เมื่อปิดแอปพลิเคชันหรือเปลี่ยนหน้า (Unmounted)
     */
    cleanup() {
      if (this.activeListener) {
        window.removeEventListener("keydown", this.activeListener);
        this.activeListener = null;
        console.log("⌨️ Shortcut: Deactivated");
      }
    },

    // ========================================================================
    // 2. EVENT HANDLER (ตรรกะการตรวจสอบปุ่มกด)
    // ========================================================================

    /**
     * ฟังก์ชันหลักสำหรับประมวลผลเมื่อมีการกดปุ่ม
     * @param {KeyboardEvent} e - เหตุการณ์การกดปุ่ม
     */
    handleKeydown(e) {
      // ตรวจสอบความปลอดภัย: หากระบบยังไม่พร้อม ให้ข้ามการทำงาน
      if (!global.AppState || !global.AppGui) return;

      const key = e.key.toLowerCase();
      const isAlt = e.altKey;
      const isCtrl = e.ctrlKey;

      // --------------------------------------------------
      // 🛑 GLOBAL ACTIONS (คำสั่งทั่วไป)
      // --------------------------------------------------

      // ปุ่ม ESC: ปิดเมนูและ Dialog ทั้งหมด
      // ช่วยให้ผู้ใช้สามารถยกเลิกการกระทำหรือออกจากหน้าจอต่างๆ ได้ทันที
      if (e.key === "Escape") {
        global.AppGui.closeAllMenus();
        return;
      }

      // ปุ่ม / (Slash) หรือ Ctrl+K: โฟกัสช่องค้นหา
      // ช่วยให้ผู้ใช้เริ่มค้นหาข้อมูลได้โดยไม่ต้องใช้เมาส์คลิก
      if (
        (key === "/" && !e.target.matches("input, textarea")) ||
        (isCtrl && key === "k")
      ) {
        e.preventDefault(); // ป้องกันการพิมพ์ '/' ลงในหน้าจอปกติ

        // ตรวจสอบว่ามีการอ้างอิง Element ช่องค้นหาอยู่หรือไม่
        if (global.AppState.searchRef && global.AppState.searchRef.value) {
          global.AppState.searchRef.value.focus();
        }
        return;
      }

      // --------------------------------------------------
      // ⚡ ALT + KEY COMMANDS (คำสั่งลัดด้วยปุ่ม Alt)
      // --------------------------------------------------

      if (isAlt) {
        switch (key) {
          // [Alt + N]: สร้าง Lead ใหม่ (New)
          case "n":
            e.preventDefault();
            global.AppGui.toggleMenu("isOpenModalLead", true);
            // รีเซ็ตฟอร์มให้พร้อมกรอกข้อมูลใหม่
            if (global.LeadApp) global.LeadApp.resetLeadForm();
            break;

          // [Alt + S]: บันทึกข้อมูล (Save)
          // ตรวจสอบบริบทว่ากำลังเปิดฟอร์มอยู่หรือไม่ ถ้าใช่ให้ทำการบันทึก
          case "s":
            e.preventDefault();
            if (
              global.AppState.isOpenModalLead &&
              global.AppState.isOpenModalLead.value
            ) {
              // ตรวจสอบว่าเป็นโหมดแก้ไขหรือสร้างใหม่ (เช็ค ID)
              if (global.LeadApp.form.id) {
                global.LeadApp.update();
              } else {
                global.LeadApp.add();
              }
            }
            break;

          // [Alt + C]: เพิ่มสัญญา (Contract)
          case "c":
            e.preventDefault();
            // เปิดแท็บสัญญาและเตรียมฟอร์มเปล่า
            global.AppGui.openContractTabPlus();
            break;

          // [Alt + L]: (Reserved)
          // ตามที่ระบุใน Index.html อาจใช้สำหรับการนำทางหรือการจัดการ Lead
          case "l":
            e.preventDefault();
            console.log("Shortcut Alt+L Triggered");
            break;
        }
      }
    },
  };

  // ส่งออก AppShortcut เป็น Global Object
  global.AppShortcut = AppShortcut;
})(window);
