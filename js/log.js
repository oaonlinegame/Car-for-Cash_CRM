// js/log.js
// --------------------------------------------------------
// 📘 LogApp: ศูนย์กลางจัดการสถานะการโทรและประวัติการติดต่อ (Call Logic Central)
// --------------------------------------------------------

const LogApp = {
  // ----------------------------------------------------
  // ⭐ createEmpty(): สร้าง Object Log ใหม่ตามโครงสร้าง DataSpec
  // ----------------------------------------------------
  createEmpty(leadId = null) {
    // คอมเมนต์: ฟังก์ชันสร้างอ็อบเจ็กต์บันทึกการโทรเริ่มต้น
    return {
      id: crypto.randomUUID(), // คอมเมนต์: สร้าง ID แบบสุ่มสำหรับ Log
      leadId: leadId, // คอมเมนต์: เชื่อมโยงกับ ID ของลูกค้า
      mainStatus: null, // คอมเมนต์: สถานะหลัก (pending, contacted, etc.)
      subStatus: null, // คอมเมนต์: สถานะย่อยตามกลุ่มสถานะหลัก
      rejectReason: null, // คอมเมนต์: สาเหตุที่ปฏิเสธ (ถ้ามี)
      financeName: "", // คอมเมนต์: ชื่อไฟแนนซ์เดิมกรณีรีไฟแนนซ์
      appointmentDate: "", // คอมเมนต์: วันนัดหมายหรือวันเริ่มรีไฟแนนซ์
      appointmentTime: "", // คอมเมนต์: เวลานัดหมาย
      offerAmount: null, // คอมเมนต์: ยอดวงเงินที่เสนอให้ลูกค้า
      closeAmount: null, // คอมเมนต์: ยอดปิดบัญชีเดิมจากที่อื่น
      note: "", // คอมเมนต์: บันทึกรายละเอียดเชิงลึกจากการสนทนา
      timestamp: new Date().toISOString(), // คอมเมนต์: วันเวลาที่บันทึกข้อมูล
      responseLevel: 3, // คอมเมนต์: ระดับความสนใจ (1-5 ดาว)
      isCreateNewLead: false, // คอมเมนต์: สถานะการสร้างลีดใหม่จากโอกาสขาย
    };
  },

  // ----------------------------------------------------
  // ⭐ handleStatusChange(): จัดการเมื่อมีการเปลี่ยนสถานะหลัก
  // ----------------------------------------------------
  handleStatusChange(newStatus) {
    // คอมเมนต์: ฟังก์ชันจัดการเมื่อผู้ใช้เปลี่ยนสถานะหลักใน UI
    AppState.recordCallForm.subStatus = null; // คอมเมนต์: รีเซ็ตสถานะย่อยทุกครั้งที่เปลี่ยนสถานะหลัก

    if (!newStatus) {
      AppState.currentSubStatusOptions.value = []; // คอมเมนต์: ล้างตัวเลือกถ้าไม่มีค่า
      return;
    }

    // คอมเมนต์: ค้นหากลุ่ม Config จาก AppState ที่ตรงกับสถานะหลักที่เลือก
    const config = AppState.callStatusConfig.value;
    const group = config.find((g) => g.value === newStatus);

    // คอมเมนต์: อัปเดตรายการตัวเลือกสถานะย่อยเพื่อแสดงใน Dropdown
    AppState.currentSubStatusOptions.value = group ? group.sub : [];
    console.log(`📡 LogApp: อัปเดตตัวเลือกสถานะย่อยสำหรับกลุ่ม ${newStatus}`); // คอมเมนต์: บันทึก Log การทำงาน
  },

  // ----------------------------------------------------
  // ⭐ handleSubStatusChange(): จัดการเมื่อเปลี่ยนสถานะย่อย
  // ----------------------------------------------------
  handleSubStatusChange(newSubStatus) {
    // คอมเมนต์: ฟังก์ชันจัดการเมื่อเปลี่ยนสถานะย่อยเพื่อกำหนดฟิลด์ที่ต้องกรอก
    if (!newSubStatus) {
      AppState.currentInputRequirements.value = []; // คอมเมนต์: ล้างค่าถ้าไม่มีการเลือก
      return;
    }

    // คอมเมนต์: หาค่า Config ของสถานะย่อยที่เลือกปัจจุบัน
    const options = AppState.currentSubStatusOptions.value;
    const selected = options.find((s) => s.value === newSubStatus);

    // คอมเมนต์: กำหนดรายการ Input ที่ UI ต้องแสดงตามเงื่อนไขที่ตั้งไว้ใน ConfigData
    AppState.currentInputRequirements.value =
      selected && selected.inputs ? selected.inputs : [];
  },

  // ----------------------------------------------------
  // 💾 saveCallResult(): ประมวลผลและบันทึกข้อมูลการโทร
  // ----------------------------------------------------
  async saveCallResult() {
    // คอมเมนต์: ฟังก์ชันบันทึกผลการติดต่อลงระบบ
    const form = AppState.recordCallForm;

    // คอมเมนต์: ตรวจสอบข้อมูลบังคับเบื้องต้น
    if (!form.mainStatus || !form.subStatus) {
      alert("⚠️ กรุณาระบุสถานะหลักและสถานะย่อยให้ครบถ้วน"); // คอมเมนต์: แจ้งเตือนผู้ใช้
      return;
    }

    // [ชั่วคราว] เตรียมข้อมูลเพื่อบันทึกลงฐานข้อมูล Dexie ในอนาคต
    const logData = {
      ...JSON.parse(JSON.stringify(form)), // คอมเมนต์: คัดลอกข้อมูลฟอร์ม
      timestamp: new Date().toISOString(), // คอมเมนต์: ประทับเวลาปัจจุบัน
    };

    console.log("💾 LogApp: บันทึกข้อมูล Log สำเร็จ:", logData); // คอมเมนต์: แสดงข้อมูลใน Console

    // คอมเมนต์: เรียกใช้ระบบแจ้งเตือน Global
    if (window.AppNotifications) {
      AppNotifications.show("✅ บันทึกผลการติดต่อเรียบร้อยแล้ว");
    }

    // คอมเมนต์: สั่งปิด Modal ผ่าน AppGui
    if (window.AppGui) {
      AppGui.toggleMenu("isOpenModalRecordCallResult", false);
      AppGui.resetRecordCallForm(); // คอมเมนต์: ล้างข้อมูลฟอร์มเพื่อเตรียมรับสายถัดไป
    }
  },
};

// --------------------------------------------------------
// 🌍 Export ออกสู่ Global
// --------------------------------------------------------
window.LogApp = LogApp;
