// lead.js
// ------------------------------------------------------------
// 📘 โมดูล LeadApp: จัดการข้อมูลลูกค้า (Lead)
// มีหน้าที่:
// - เพิ่ม / แก้ไข / ลบข้อมูลลูกค้า
// - โหลดข้อมูลทั้งหมดจาก Dexie (AppDexie)
// - อัปเดตข้อมูลไปยัง Store (UI Memory)
// - จัดการ state ของฟอร์มที่ใช้ใน modal
// ------------------------------------------------------------

// ------------------------------------------------------------
// ⭐ 1) สร้าง State สำหรับ Lead (ฟอร์ม + ค่าตั้งต้น)
// ------------------------------------------------------------
const LeadState = {
  // ประกาศอ็อบเจกต์ LeadState สำหรับเก็บสถานะของฟอร์ม
  // ฟอร์มที่ใช้สำหรับ modal เพิ่ม/แก้ไขข้อมูล lead
  form: Vue.reactive({
    // ใช้ Vue.reactive เพื่อให้ฟอร์มนี้เป็น reactive และเชื่อมกับ input ใน template ได้
    id: null, // ID ใช้ตรวจสอบว่าเป็นโหมดเพิ่ม หรือแก้ไข (ถ้ามี ID คือโหมดแก้ไข)
    firstName: "", // ชื่อจริงของลูกค้า
    nickName: "", // ชื่อเล่นของลูกค้า
    phones: "", // เบอร์โทรศัพท์ (หลายเบอร์คั่นด้วย ,)
    address: "", // ที่อยู่ลูกค้า
    province: "", // จังหวัดที่ลูกค้าอาศัยอยู่
    postalCode: "", // รหัสไปรษณีย์
    occupation: "", // อาชีพลูกค้า
    status: "ลูกค้าใหม่", // สถานะปัจจุบันของลูกค้า (ค่าเริ่มต้น)
    isProspect: true, // สถานะว่าเป็นลูกค้าใหม่ (Prospect) หรือไม่ (ค่าเริ่มต้น)
    prospectStage: "สนใจ", // ขั้นตอนการขาย (ค่าเริ่มต้น)
    rating: 3, // คะแนนความสนใจ (1-5) (ค่าเริ่มต้น)
    note: "", // หมายเหตุเพิ่มเติมเกี่ยวกับลูกค้า
    createDate: "", // วันที่สร้าง Lead รายการนี้
  }), // จบส่วน form
}; // จบอ็อบเจกต์ LeadState

// ------------------------------------------------------------
// ⭐ 2) ฟังก์ชันรีเซ็ตฟอร์มให้ว่างทุกครั้งที่เปิด modal
// ------------------------------------------------------------
function resetLeadForm() {
  // ฟังก์ชันสำหรับตั้งค่าฟอร์มกลับไปเป็นค่าเริ่มต้น
  // เติมค่าฟอร์มใหม่ (clear + default)
  LeadState.form.id = null; // ล้าง ID
  LeadState.form.firstName = ""; // ล้างชื่อ
  LeadState.form.nickName = ""; // ล้างชื่อเล่น
  LeadState.form.phones = ""; // ล้างเบอร์โทร
  LeadState.form.address = ""; // ล้างที่อยู่
  LeadState.form.province = ""; // ล้างจังหวัด
  LeadState.form.postalCode = ""; // ล้างรหัสไปรษณีย์
  LeadState.form.occupation = ""; // ล้างอาชีพ
  LeadState.form.status = "ลูกค้าใหม่"; // ตั้งสถานะเริ่มต้น
  LeadState.form.isProspect = true; // ตั้งค่าเป็นลูกค้าใหม่เริ่มต้น
  LeadState.form.prospectStage = "สนใจ"; // ตั้งขั้นตอนการขายเริ่มต้น
  LeadState.form.rating = 3; // ตั้งคะแนนเริ่มต้น
  LeadState.form.note = ""; // ล้างหมายเหตุ
  LeadState.form.createDate = new Date().toLocaleDateString("th-TH"); // ตั้งวันที่สร้างเป็นวันที่ปัจจุบัน
} // จบฟังก์ชัน resetLeadForm

// ------------------------------------------------------------
// ⭐ 3) โมดูล LeadApp (ตัวจริงของระบบจัดการ Lead)
// ------------------------------------------------------------
const LeadApp = {
  // ประกาศอ็อบเจกต์ LeadApp ซึ่งเป็นตัวควบคุมหลัก
  state: LeadState, // ผูก LeadState เข้ากับ App เพื่อให้ template เข้าถึงฟอร์มได้โดยตรง

  // --------------------------------------------------------
  // 📌 loadAll(): โหลดข้อมูลทั้งหมดจาก IndexedDB (Dexie) // [ถาวร] ฟังก์ชันโหลดข้อมูล Lead ทั้งหมดจากฐานข้อมูล
  // --------------------------------------------------------
  async loadAll() {
    // ฟังก์ชันโหลดข้อมูล Lead ทั้งหมด
    try {
      // เริ่มบล็อก try-catch สำหรับจัดการ Error
      const items = await AppDexie.lead.getAll(); // ดึงข้อมูล Lead ทั้งหมดจาก Dexie
      Store.setItems("Lead", items); // ส่งรายการข้อมูลที่ได้เข้า Store เพื่ออัปเดต UI
    } catch (err) {
      // ถ้ามี Error เกิดขึ้น
      console.error("❌ loadAll() error:", err); // แสดง Error ใน Console
    } // จบบล็อก try-catch
  }, // จบฟังก์ชัน loadAll

  // --------------------------------------------------------
  // 📌 add(): เพิ่มลูกค้าคนใหม่ // [ถาวร] ฟังก์ชันสำหรับเพิ่ม Lead รายการใหม่
  // --------------------------------------------------------
  async add() {
    // ฟังก์ชันสำหรับเพิ่ม Lead ใหม่
    try {
      // เริ่มบล็อก try-catch
      const data = {
        // สร้าง Object ข้อมูลสำหรับบันทึก
        ...LeadState.form, // คัดลอกข้อมูลทั้งหมดจากฟอร์ม
        id: crypto.randomUUID(), // สร้าง ID แบบ UUID ใหม่ (ไม่ซ้ำ)
        createDate: new Date().toLocaleDateString("th-TH"), // ตั้งวันที่สร้างเป็นวันที่ปัจจุบัน
      }; // จบการสร้าง Object data

      await AppDexie.lead.add(data); // บันทึกข้อมูลใหม่ลงใน IndexedDB ผ่าน Dexie
      await this.loadAll(); // เรียกโหลดข้อมูลทั้งหมดใหม่เพื่ออัปเดต Store และ UI
      AppGui.toggleMenu("isOpenModalLead", false); // เรียกฟังก์ชันปิด modal Lead
      AppNotifications.show("เพิ่ม Lead สำเร็จ"); // แสดงข้อความแจ้งเตือนว่าเพิ่มสำเร็จ

      resetLeadForm(); // เรียกฟังก์ชันล้างค่าในฟอร์ม
    } catch (err) {
      // ถ้ามี Error
      console.error("❌ add() error:", err); // แสดง Error
    } // จบบล็อก try-catch
  }, // จบฟังก์ชัน add

  // --------------------------------------------------------
  // 📌 update(): อัปเดตข้อมูลลูกค้าคนเดิม // [ถาวร] ฟังก์ชันสำหรับแก้ไข Lead ที่มีอยู่
  // --------------------------------------------------------
  async update() {
    // ฟังก์ชันสำหรับอัปเดต Lead ที่มีอยู่
    try {
      // เริ่มบล็อก try-catch
      if (!LeadState.form.id) {
        // ตรวจสอบว่ามี ID ของ Lead ที่ต้องการแก้ไขหรือไม่
        console.warn("⚠ update() เรียกแต่ไม่มี ID"); // แจ้งเตือนถ้าไม่มี ID
        return; // หยุดการทำงาน
      } // จบเงื่อนไขตรวจสอบ ID

      await AppDexie.lead.update(LeadState.form.id, { ...LeadState.form }); // อัปเดตข้อมูลใน Dexie โดยใช้ ID และข้อมูลในฟอร์ม
      await this.loadAll(); // โหลดข้อมูลใหม่เพื่ออัปเดต UI
      AppGui.toggleMenu("isOpenModalLead", false); // ปิด modal
      AppNotifications.show("อัปเดตข้อมูลเรียบร้อย"); // แจ้งเตือน
    } catch (err) {
      // ถ้ามี Error
      console.error("❌ update() error:", err); // แสดง Error
    } // จบบล็อก try-catch
  }, // จบฟังก์ชัน update

  // --------------------------------------------------------
  // 📌 delete(id): ลบข้อมูลลูกค้า // [ถาวร] ฟังก์ชันสำหรับลบ Lead ออกจากฐานข้อมูล
  // --------------------------------------------------------
  async delete(id) {
    // ฟังก์ชันสำหรับลบ Lead
    try {
      // เริ่มบล็อก try-catch
      await AppDexie.lead.delete(id); // สั่ง Dexie ให้ลบ Lead ตาม ID
      await this.loadAll(); // โหลดข้อมูลใหม่เพื่อลบรายการออกจาก UI
      AppNotifications.show("ลบข้อมูลแล้ว"); // แจ้งเตือน
    } catch (err) {
      // ถ้ามี Error
      console.error("❌ delete() error:", err); // แสดง Error
    } // จบบล็อก try-catch
  }, // จบฟังก์ชัน delete

  // --------------------------------------------------------
  // 📌 openEdit(lead): ดึงข้อมูลลงฟอร์มเพื่อนแก้ไข // [ถาวร] ฟังก์ชันสำหรับเปิด Modal แก้ไข
  // --------------------------------------------------------
  openEdit(lead) {
    // ฟังก์ชันสำหรับเตรียมข้อมูล Lead ในฟอร์มเพื่อแก้ไข
    Object.assign(LeadState.form, lead); // คัดลอกคุณสมบัติทั้งหมดจาก Lead ที่ส่งมาลงใน LeadState.form
    AppGui.toggleMenu("isOpenModalLead", true); // เปิด modal สำหรับแก้ไข
  }, // จบฟังก์ชัน openEdit
}; // จบอ็อบเจกต์ LeadApp

// ------------------------------------------------------------
// 🌍 4) Export ให้ไฟล์อื่นเรียกใช้ได้ // [ถาวร] ส่วนสำหรับส่งออกโมดูล
// ------------------------------------------------------------
window.LeadApp = LeadApp; // ผูก LeadApp เข้ากับ window (ตัวจริงที่ App.js ควรเรียกใช้)
window.LeadLogic = LeadApp; // [ถาวร] ผูก LeadLogic เข้ากับ window (ชื่อเผื่อไว้สำหรับโค้ดเดิมที่อาจเรียกใช้)
window.LeadState = LeadState; // [ถาวร] ผูก LeadState เข้ากับ window (เพื่อให้ template เข้าถึงฟอร์มได้)
