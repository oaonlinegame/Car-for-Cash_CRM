// js/config.js

const AppConfig = {
  // ----------------------------------------------------
  // ⭐ Config Keys (เพิ่มให้ครบทุกตัวแปร)
  // ----------------------------------------------------
  Keys: {
    OCCUPATION: "occupationItems",
    SOURCE: "sourceItems",
    BRAND: "carBrandItems",
    CAMPAIGN: "campaignItems",
    REJECT_REASON: "rejectReasonItems",
    COLOR: "carColorItems",
    FINANCE: "financeCompanyItems",

    // ✅ เพิ่มใหม่ให้ครบ
    PRODUCT: "productItems",
    CROSS_SELL: "crossSellItems",
    TITLE: "titleItems",
    CAR_TYPE: "carTypeItems",
    GEARBOX: "gearboxItems",
    FUEL: "fuelItems",
  },

  // ... (ฟังก์ชัน save และ load คงเดิม ไม่ต้องแก้) ...
  async save(key, list) {
    if (!key || !Array.isArray(list)) return;
    if (
      typeof AppDexie === "undefined" ||
      typeof AppDexie.settings === "undefined"
    )
      return;
    try {
      const plainList = JSON.parse(JSON.stringify(list));
      await AppDexie.settings.set(key, plainList);
      console.log(`💾 AppConfig: บันทึก "${key}" สำเร็จ`);
    } catch (error) {
      console.error(`❌ AppConfig: บันทึก "${key}" พลาด`, error);
    }
  },

  async load(key) {
    if (!key || typeof AppState === "undefined") return [];
    if (typeof AppDexie === "undefined") return [];
    try {
      const dbResult = await AppDexie.settings.get(key);
      const dbList = Array.isArray(dbResult) ? dbResult : [];
      const defaultsObj = window.AppConfigDefaults || {};
      const defaultList = Array.isArray(defaultsObj[key])
        ? defaultsObj[key]
        : [];

      let finalList = [];
      if (dbList.length > 0) {
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

      if (AppState[key] && AppState[key].value !== undefined) {
        AppState[key].value = Array.from(finalList);
      }
      if (finalList.length > dbList.length) {
        await this.save(key, finalList);
      }
      return finalList;
    } catch (error) {
      console.error(`❌ AppConfig: โหลด "${key}" พลาด`, error);
      return [];
    }
  },

  // ----------------------------------------------------
  // 📂 loadAllConfigs()
  // ✅ แก้ไข: สั่งโหลดให้ครบทุกตัวแปร
  // ----------------------------------------------------
  async loadAllConfigs() {
    console.log("📂 AppConfig: เริ่มโหลด Configs ทั้งหมด...");

    // กลุ่มเดิม
    await this.load(this.Keys.OCCUPATION);
    await this.load(this.Keys.SOURCE);
    await this.load(this.Keys.BRAND);
    await this.load(this.Keys.CAMPAIGN);
    await this.load(this.Keys.REJECT_REASON);
    await this.load(this.Keys.COLOR);
    await this.load(this.Keys.FINANCE);

    // ✅ กลุ่มใหม่ (ต้องสั่งโหลด ไม่งั้นมันจะไม่ดึงจาก DB)
    await this.load(this.Keys.PRODUCT);
    await this.load(this.Keys.CROSS_SELL);
    await this.load(this.Keys.TITLE);
    await this.load(this.Keys.CAR_TYPE);
    await this.load(this.Keys.GEARBOX);
    await this.load(this.Keys.FUEL);
  },
};

window.AppConfig = AppConfig;
