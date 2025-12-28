// js/config.js
// --------------------------------------------------------
// ⚙️ AppConfig: จัดการการตั้งค่าและตัวเลือกต่างๆ (Dropdowns)
// --------------------------------------------------------
// Architecture Note:
// - ทำหน้าที่ Load/Save ค่า Config ผ่าน Repository
// - ห้ามเรียก AppDexie โดยตรง ต้องผ่าน Repository.settings
// --------------------------------------------------------

const AppConfig = {
  // ----------------------------------------------------
  // ⭐ Config Keys
  // ----------------------------------------------------
  Keys: {
    OCCUPATION: "occupationItems",
    SOURCE: "sourceItems",
    BRAND: "carBrandItems",
    CAMPAIGN: "campaignItems",
    REJECT_REASON: "rejectReasonItems",
    COLOR: "carColorItems",
    FINANCE: "financeCompanyItems",

    // ✅ ครบถ้วนตามที่คุณต้องการ
    PRODUCT: "productItems",
    CROSS_SELL: "crossSellItems",
    TITLE: "titleItems",
    CAR_TYPE: "carTypeItems",
    GEARBOX: "gearboxItems",
    FUEL: "fuelItems",
  },

  // ----------------------------------------------------
  // 💾 Save Config
  // ----------------------------------------------------
  async save(key, list) {
    if (!key || !Array.isArray(list)) return;

    // 🛡️ Guard Clause: ตรวจสอบว่า Repository พร้อมใช้งานหรือไม่
    // (เปลี่ยนจากเช็ค AppDexie เป็น Repository เพื่อความถูกต้องตาม Architecture)
    if (
      typeof Repository === "undefined" ||
      typeof Repository.settings === "undefined"
    ) {
      console.warn("⚠️ AppConfig: Repository not ready, cannot save config.");
      return;
    }

    try {
      const plainList = JSON.parse(JSON.stringify(list));

      // ✅ FIX: เรียกใช้ Repository.settings.set แทน AppDexie โดยตรง
      await Repository.settings.set(key, plainList);

      console.log(`💾 AppConfig: บันทึก "${key}" สำเร็จ`);
    } catch (error) {
      console.error(`❌ AppConfig: บันทึก "${key}" พลาด`, error);
    }
  },

  // ----------------------------------------------------
  // 📂 Load Config
  // ----------------------------------------------------
  async load(key) {
    // ตรวจสอบ Global State และ Repository
    if (!key || typeof AppState === "undefined") return [];
    if (typeof Repository === "undefined") {
      console.warn("⚠️ AppConfig: Repository not ready, cannot load config.");
      return [];
    }

    try {
      // ✅ FIX: เรียกใช้ Repository.settings.get แทน AppDexie โดยตรง
      // Repository จัดการเรื่อง .value ให้แล้ว เราจะได้ array กลับมาเลย หรือ null
      const dbList = await Repository.settings.get(key);

      const defaultsObj = window.AppConfigDefaults || {};
      const defaultList = Array.isArray(defaultsObj[key])
        ? defaultsObj[key]
        : [];

      let finalList = [];

      // Merge Logic (คงเดิม)
      if (Array.isArray(dbList) && dbList.length > 0) {
        finalList = [...dbList];
        const dbSet = new Set(dbList.map((item) => String(item).trim()));
        defaultList.forEach((defItem) => {
          if (!dbSet.has(String(defItem).trim())) {
            finalList.push(defItem);
          }
        });
      } else {
        finalList = [...defaultList];
      }

      // อัปเดต State
      if (AppState[key] && AppState[key].value !== undefined) {
        AppState[key].value = Array.from(finalList);
      }

      // ถ้าข้อมูลใน DB น้อยกว่าที่ Merge ได้ (หรือไม่มีเลย) ให้บันทึกกลับลง DB
      if (!Array.isArray(dbList) || finalList.length > dbList.length) {
        await this.save(key, finalList);
      }

      return finalList;
    } catch (error) {
      console.error(`❌ AppConfig: โหลด "${key}" พลาด`, error);
      return [];
    }
  },

  // ----------------------------------------------------
  // 🔄 Load All Configs
  // ----------------------------------------------------
  async loadAllConfigs() {
    console.log("📂 AppConfig: เริ่มโหลด Configs ทั้งหมด...");

    // ใช้ Promise.all เพื่อโหลดพร้อมกัน (Performance Optimization)
    // หรือจะ await ทีละตัวก็ได้ แต่ Promise.all เร็วกว่า
    const keysToLoad = Object.values(this.Keys);

    for (const key of keysToLoad) {
      await this.load(key);
    }

    console.log("✅ AppConfig: โหลด Configs ทั้งหมดเสร็จสิ้น");
  },
};

window.AppConfig = AppConfig;
