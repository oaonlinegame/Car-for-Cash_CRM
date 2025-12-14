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
    OCCUPATION: "occupationItems", // คอมเมนต์: คีย์สำหรับรายการอาชีพ
    SOURCE: "sourceItems", // คอมเมนต์: คีย์สำหรับรายการแหล่งที่มา
  },

  // ----------------------------------------------------
  // 💾 save(key, list)
  // บันทึกรายการลง Dexie
  // ----------------------------------------------------
  async save(key, list) {
    if (!key || !Array.isArray(list)) return;
    if (
      typeof AppDexie === "undefined" ||
      typeof AppDexie.settings === "undefined"
    ) {
      console.warn("⚠️ AppConfig.save: AppDexie.settings ไม่พร้อมใช้งาน");
      return;
    }

    try {
      // ใช้ JSON.parse/stringify เพื่อ Deep Clone ป้องกัน Reference ติด
      const plainList = JSON.parse(JSON.stringify(list));

      // บันทึกรายการลงตาราง settings
      await AppDexie.settings.set(key, plainList);
      console.log(
        `💾 AppConfig: บันทึกรายการ "${key}" สำเร็จ (${plainList.length} รายการ)`
      );
    } catch (error) {
      console.error(`❌ AppConfig: บันทึกรายการ "${key}" ล้มเหลว`, error);
    }
  },

  // ----------------------------------------------------
  // 📂 load(key)
  // [แก้ไขใหม่] โหลดโดยยึด "ลำดับจาก Dexie" เป็นหลัก (User Priority)
  // ----------------------------------------------------
  async load(key) {
    if (!key || typeof AppState === "undefined") return [];
    if (
      typeof AppDexie === "undefined" ||
      typeof AppDexie.settings === "undefined"
    ) {
      console.warn("⚠️ AppConfig.load: AppDexie.settings ไม่พร้อมใช้งาน");
      return [];
    }

    try {
      // 1. ดึงข้อมูลจาก Dexie (User Data + User Order)
      const dbResult = await AppDexie.settings.get(key);
      const dbList = Array.isArray(dbResult) ? dbResult : [];

      // 2. ดึงข้อมูลจาก Default (System Data)
      const defaultsObj = window.AppConfigDefaults || {};
      const defaultList = Array.isArray(defaultsObj[key])
        ? defaultsObj[key]
        : [];

      let finalList = [];

      if (dbList.length > 0) {
        // ✅ กรณีมีข้อมูลใน DB (User เคยบันทึกแล้ว):
        // ให้ยึด "ลำดับ" จาก DB เป็นหลักก่อนเลย
        finalList = [...dbList];

        // ตรวจสอบว่ามี Default ตัวใหม่ๆ ที่ User ยังไม่มีหรือไม่? (ถ้ามีให้ต่อท้าย)
        // สร้าง Set ของ DB เพื่อให้เช็คง่ายๆ
        const dbSet = new Set(dbList.map((item) => String(item).trim()));

        defaultList.forEach((defItem) => {
          if (!dbSet.has(String(defItem).trim())) {
            finalList.push(defItem); // เติม Default ใหม่ต่อท้าย
          }
        });
      } else {
        // ✅ กรณีไม่มีใน DB เลย (ใช้งานครั้งแรก): ใช้ Default ทั้งหมดตามลำดับเดิม
        finalList = [...defaultList];
      }

      console.log(
        `✅ AppConfig: โหลด "${key}" (DB Base) -> รวม: ${finalList.length} รายการ`
      );

      // 4. อัปเดต AppState
      if (AppState[key] && AppState[key].value !== undefined) {
        // สร้าง Array ใหม่เพื่อกระตุ้น Vue Reactivity
        AppState[key].value = Array.from(finalList);
      }

      // 5. [Auto Sync] บันทึกกลับลง Dexie เพื่อให้ฐานข้อมูลเป็นปัจจุบันที่สุด
      if (finalList.length > dbList.length) {
        await this.save(key, finalList);
      }

      return finalList;
    } catch (error) {
      console.error(`❌ AppConfig: โหลดรายการ "${key}" ล้มเหลว`, error);
      return [];
    }
  },

  // ----------------------------------------------------
  // 📂 loadAllConfigs()
  // โหลด Config ทั้งหมดเมื่อเริ่มระบบ
  // ----------------------------------------------------
  async loadAllConfigs() {
    console.log("📂 AppConfig: เริ่มโหลด Configs ทั้งหมด...");
    await this.load(this.Keys.OCCUPATION);
    await this.load(this.Keys.SOURCE);
  },
};

// --------------------------------------------------------
// 🌍 export
// --------------------------------------------------------
window.AppConfig = AppConfig;
