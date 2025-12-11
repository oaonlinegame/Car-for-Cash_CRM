// js/config.js
// --------------------------------------------------------
// 📘 โมดูลจัดการ Configuration Lists (เช่น รายการอาชีพ, แหล่งที่มา)
// --------------------------------------------------------
// ทำหน้าที่:
// 1. โหลดค่าเริ่มต้นจาก Defaults (ถ้า Dexie ว่าง)
// 2. โหลด/บันทึกค่าลง IndexedDB (ผ่าน AppDexie.settings)
// 3. Sync ค่าที่โหลดได้กลับไปที่ AppState เพื่อให้ UI ใช้
// --------------------------------------------------------

const AppConfig = {
  // ----------------------------------------------------
  // ⭐ Config Keys (ชื่อ key ใน Dexie)
  // ----------------------------------------------------
  Keys: {
    OCCUPATION: "occupationItems", // คอมเมนต์: คีย์สำหรับรายการอาชีพ (ใช้เป็นชื่อ field ใน AppState/Dexie)
    // [เพิ่ม] คีย์สำหรับ Dropdown อื่นๆ ที่ต้องการบันทึก/นำเข้าในอนาคตที่นี่
  }, // คอมเมนต์: ปิด Keys

  // ----------------------------------------------------
  // ⭐ Default Data (ค่าตั้งต้น)
  // ----------------------------------------------------
  Defaults: {
    occupationItems: [
      // คอมเมนต์: รายการอาชีพเริ่มต้น
      "พนักงานบริษัท",
      "เจ้าของกิจการ",
      "ข้าราชการ/รัฐวิสาหกิจ",
      "รับจ้างทั่วไป",
      "นักเรียน/นักศึกษา",
      "เกษตรกร",
      "ว่างงาน",
    ],
  }, // คอมเมนต์: ปิด Defaults

  // ----------------------------------------------------
  // 💾 save(key, list)
  // บันทึกรายการลง Dexie
  // ----------------------------------------------------
  async save(key, list) {
    // คอมเมนต์: ฟังก์ชันบันทึกรายการ config ลง Dexie
    if (!key || !Array.isArray(list)) return; // คอมเมนต์: ถ้า key หรือ list ไม่ถูกต้องให้ออก
    if (
      typeof AppDexie === "undefined" ||
      typeof AppDexie.settings === "undefined"
    ) {
      // คอมเมนต์: ตรวจสอบ AppDexie
      console.warn("⚠️ AppConfig.save: AppDexie.settings ไม่พร้อมใช้งาน"); // คอมเมนต์: แจ้งเตือนถ้า Dexie ไม่พร้อม
      return; // คอมเมนต์: หยุดทำงาน
    } // คอมเมนต์: จบตรวจสอบ AppDexie

    try {
      await AppDexie.settings.save(key, list); // คอมเมนต์: บันทึกรายการลงตาราง settings
      console.log(
        `💾 AppConfig: บันทึกรายการ "${key}" สำเร็จ (${list.length} รายการ)`
      ); // คอมเมนต์: แสดง log การบันทึก
    } catch (error) {
      console.error(`❌ AppConfig: บันทึกรายการ "${key}" ล้มเหลว`, error); // คอมเมนต์: แสดง log เมื่อเกิด error
    } // คอมเมนต์: ปิด try/catch
  }, // คอมเมนต์: ปิดฟังก์ชัน save

  // ----------------------------------------------------
  // 📂 load(key)
  // โหลดรายการจาก Dexie และอัปเดต AppState
  // ----------------------------------------------------
  async load(key) {
    // คอมเมนต์: ฟังก์ชันโหลดรายการจาก Dexie
    if (!key || typeof AppState === "undefined") return []; // คอมเมนต์: ถ้า key หรือ AppState ไม่พร้อมให้ออก
    if (
      typeof AppDexie === "undefined" ||
      typeof AppDexie.settings === "undefined"
    ) {
      // คอมเมนต์: ตรวจสอบ AppDexie
      console.warn("⚠️ AppConfig.load: AppDexie.settings ไม่พร้อมใช้งาน"); // คอมเมนต์: แจ้งเตือนถ้า Dexie ไม่พร้อม
      return []; // คอมเมนต์: คืนค่า Array ว่าง
    } // คอมเมนต์: จบตรวจสอบ AppDexie

    let list = []; // คอมเมนต์: ตัวแปรสำหรับเก็บรายการที่โหลดได้

    try {
      const result = await AppDexie.settings.get(key); // คอมเมนต์: ดึง config จาก Dexie
      if (result && Array.isArray(result.value) && result.value.length > 0) {
        // คอมเมนต์: ถ้ามีข้อมูลใน Dexie
        list = result.value; // คอมเมนต์: ใช้ข้อมูลจาก Dexie
        console.log(
          `✅ AppConfig: โหลดรายการ "${key}" จาก Dexie สำเร็จ (${list.length} รายการ)`
        ); // คอมเมนต์: แสดง log
      } else {
        // คอมเมนต์: ถ้าไม่มีข้อมูลใน Dexie → ใช้ค่าเริ่มต้น
        list = this.Defaults[key] || []; // คอมเมนต์: ใช้ค่าเริ่มต้นจาก Defaults
        if (list.length > 0) {
          await this.save(key, list); // คอมเมนต์: บันทึกค่าเริ่มต้นลง Dexie ด้วย
          console.log(
            `ℹ️ AppConfig: ใช้ค่าเริ่มต้นสำหรับรายการ "${key}" และบันทึกลง Dexie`
          ); // คอมเมนต์: แสดง log
        } // คอมเมนต์: จบ if list.length > 0
      } // คอมเมนต์: ปิดเงื่อนไขตรวจสอบ result

      // 🔄 อัปเดต AppState
      if (AppState[key] && AppState[key].value !== undefined) {
        // คอมเมนต์: ตรวจสอบว่า key นั้นเป็น ref และมีอยู่ใน AppState
        AppState[key].value = list; // คอมเมนต์: อัปเดตค่า ref ใน AppState ด้วยรายการที่โหลดได้ (ใช้ list ได้เลยเพราะ Vue จัดการให้อยู่แล้ว)
      } // คอมเมนต์: จบ if AppState[key]

      return list; // คอมเมนต์: คืนรายการที่โหลดได้
    } catch (error) {
      console.error(`❌ AppConfig: โหลดรายการ "${key}" ล้มเหลว`, error); // คอมเมนต์: แสดง error
      return []; // คอมเมนต์: คืนค่า Array ว่างในกรณี error
    } // คอมเมนต์: ปิด try/catch
  }, // คอมเมนต์: ปิดฟังก์ชัน load

  // ----------------------------------------------------
  // 📂 loadAllConfigs()
  // โหลด Config ที่สำคัญทั้งหมดเมื่อเริ่มระบบ
  // ----------------------------------------------------
  async loadAllConfigs() {
    // คอมเมนต์: ฟังก์ชันโหลด config ทั้งหมดเมื่อเริ่มต้นระบบ
    console.log("📂 AppConfig: เริ่มโหลด Configs ทั้งหมด..."); // คอมเมนต์: แสดง log เริ่มโหลด
    await this.load(this.Keys.OCCUPATION); // คอมเมนต์: โหลดรายการอาชีพ
    // [เพิ่ม] โหลด config อื่นๆ ที่ต้องการเพิ่มในอนาคตที่นี่
  }, // คอมเมนต์: ปิดฟังก์ชัน loadAllConfigs
}; // คอมเมนต์: ปิด AppConfig

// --------------------------------------------------------
// 🌍 export
// --------------------------------------------------------
window.AppConfig = AppConfig; // คอมเมนต์: export AppConfig ไปสู่ global
