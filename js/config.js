// js/config.js
// --------------------------------------------------------
// 📘 โมดูลจัดการ Configuration Lists (เช่น รายการอาชีพ, แหล่งที่มา)
// --------------------------------------------------------
// ทำหน้าที่:
// 1. โหลดค่าเริ่มต้นจาก AppConfigDefaults ผสมกับ Dexie
// 2. โหลด/บันทึกค่าลง IndexedDB (ผ่าน AppDexie.settings)
// 3. Sync ค่าที่โหลดได้กลับไปที่ AppState เพื่อให้ UI ใช้
// --------------------------------------------------------

const AppConfig = {
  // ----------------------------------------------------
  // ⭐ Config Keys (ชื่อ key ใน Dexie)
  // ----------------------------------------------------
  Keys: {
    OCCUPATION: "occupationItems", // คอมเมนต์: คีย์สำหรับรายการอาชีพ (ใช้เป็นชื่อ field ใน AppState/Dexie)
    SOURCE: "sourceItems", // คอมเมนต์: คีย์สำหรับรายการแหล่งที่มา
    // [เพิ่ม] คีย์สำหรับ Dropdown อื่นๆ ที่ต้องการบันทึก/นำเข้าในอนาคตที่นี่
  }, // คอมเมนต์: ปิด Keys

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
      // [แก้ไข] ใช้ JSON.parse(JSON.stringify(list)) เพื่อรับประกันว่าเป็น Plain Object/Array (Deep Clone)
      const plainList = JSON.parse(JSON.stringify(list)); // คอมเมนต์: สร้าง Plain Object/Array สำหรับบันทึกลง IndexedDB

      // [แก้ไข] เรียกใช้ AppDexie.settings.set แทน .save
      await AppDexie.settings.set(key, plainList); // คอมเมนต์: บันทึกรายการลงตาราง settings โดยใช้ .set
      console.log(
        `💾 AppConfig: บันทึกรายการ "${key}" สำเร็จ (${plainList.length} รายการ)`
      ); // คอมเมนต์: แสดง log การบันทึก
    } catch (error) {
      console.error(`❌ AppConfig: บันทึกรายการ "${key}" ล้มเหลว`, error); // คอมเมนต์: แสดง log เมื่อเกิด error
    } // คอมเมนต์: ปิด try/catch
  }, // คอมเมนต์: ปิดฟังก์ชัน save

  // ----------------------------------------------------
  // 📂 load(key)
  // [แก้ไขใหม่] โหลดรายการจาก Dexie ผสานกับ Default และอัปเดต AppState
  // ----------------------------------------------------
  async load(key) {
    // คอมเมนต์: ฟังก์ชันโหลดรายการจาก Dexie ผสม Default
    if (!key || typeof AppState === "undefined") return []; // คอมเมนต์: ถ้า key หรือ AppState ไม่พร้อมให้ออก
    if (
      typeof AppDexie === "undefined" ||
      typeof AppDexie.settings === "undefined"
    ) {
      // คอมเมนต์: ตรวจสอบ AppDexie
      console.warn("⚠️ AppConfig.load: AppDexie.settings ไม่พร้อมใช้งาน"); // คอมเมนต์: แจ้งเตือนถ้าไม่พร้อม
      return []; // คอมเมนต์: คืนค่า Array ว่าง
    }

    try {
      // 1. ดึงข้อมูลจาก Dexie (ถ้าไม่มีให้เป็น Array ว่าง)
      const dbResult = await AppDexie.settings.get(key);
      const dbList = Array.isArray(dbResult) ? dbResult : [];

      // 2. ดึงข้อมูลจาก Default (ถ้าไม่มีให้เป็น Array ว่าง)
      const defaultsObj = window.AppConfigDefaults || {};
      const defaultList = Array.isArray(defaultsObj[key])
        ? defaultsObj[key]
        : [];

      // 3. [สำคัญ] ผสานข้อมูล (Merge) และตัดตัวซ้ำ (Unique)
      // ใช้ Set เพื่อกรองค่าที่ซ้ำกันออกโดยอัตโนมัติ
      // เอา default ขึ้นก่อน ตามด้วย dbList (หรือสลับกันตามชอบ แต่ Set จะยึดลำดับการ add)
      const mergedSet = new Set([...defaultList, ...dbList]);
      const finalList = Array.from(mergedSet); // คอมเมนต์: แปลงกลับเป็น Array

      console.log(
        `✅ AppConfig: โหลด "${key}" (Defaults: ${defaultList.length} + DB: ${dbList.length} -> รวม: ${finalList.length})`
      );

      // 4. อัปเดต AppState (เพื่อให้ UI แสดงผล)
      if (AppState[key] && AppState[key].value !== undefined) {
        // [แก้ไข] ใช้ Array.from เพื่อบังคับสร้าง Array Reference ใหม่ให้ Vue รับรู้
        AppState[key].value = Array.from(finalList);
      }

      // 5. [Auto Sync] ถ้าจำนวนรายการที่รวมแล้ว มากกว่าใน DB แสดงว่ามี Default ที่ยังไม่ถูกบันทึก
      // ให้บันทึกกลับลง Dexie เพื่อให้ฐานข้อมูลสมบูรณ์ที่สุด
      if (finalList.length > dbList.length) {
        await this.save(key, finalList);
        console.log(
          `ℹ️ AppConfig: Auto-sync "${key}" ลง Dexie เพื่ออัปเดต Default ใหม่`
        );
      }

      return finalList; // คอมเมนต์: คืนรายการที่รวมเสร็จแล้ว
    } catch (error) {
      console.error(`❌ AppConfig: โหลดรายการ "${key}" ล้มเหลว`, error); // คอมเมนต์: แสดง error
      return []; // คอมเมนต์: คืนค่า Array ว่างในกรณี error
    }
  }, // คอมเมนต์: ปิดฟังก์ชัน load

  // ----------------------------------------------------
  // 📂 loadAllConfigs()
  // โหลด Config ที่สำคัญทั้งหมดเมื่อเริ่มระบบ
  // ----------------------------------------------------
  async loadAllConfigs() {
    // คอมเมนต์: ฟังก์ชันโหลด config ทั้งหมดเมื่อเริ่มต้นระบบ
    console.log("📂 AppConfig: เริ่มโหลด Configs ทั้งหมด..."); // คอมเมนต์: แสดง log เริ่มโหลด
    await this.load(this.Keys.OCCUPATION); // คอมเมนต์: โหลดรายการอาชีพ
    await this.load(this.Keys.SOURCE); // คอมเมนต์: โหลดรายการแหล่งที่มา
    // [เพิ่ม] โหลด config อื่นๆ ที่ต้องการเพิ่มในอนาคตที่นี่
  }, // คอมเมนต์: ปิดฟังก์ชัน loadAllConfigs
}; // คอมเมนต์: ปิด AppConfig

// --------------------------------------------------------
// 🌍 export
// --------------------------------------------------------
window.AppConfig = AppConfig; // คอมเมนต์: export AppConfig ไปสู่ global
