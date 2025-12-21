// js/boot.js

const AppBoot = {
  async performInitialization() {
    // 1. โหลดข้อมูล Lead
    if (window.LeadApp && LeadApp.loadAll) {
      await LeadApp.loadAll();
    }

    // 2. โหลด Configs จาก Dexie (ที่เป็นตัวแก้ไขได้)
    if (window.AppConfig && AppConfig.loadAllConfigs) {
      await AppConfig.loadAllConfigs();
    }

    // 3. โหลด Config Static (เฉพาะตัวที่ "แก้ไขไม่ได้" / "ไม่ต้องเซฟลง DB")
    if (window.AppState && window.AppConfigDefaults) {
      const defs = AppConfigDefaults;
      const state = AppState;

      const loadStatic = (key) => {
        if (defs[key] && state[key]) {
          state[key].value = defs[key];
        }
      };

      // ✅ เหลือไว้เฉพาะตัวที่ระบบ Fix มา ไม่ต้องแก้ไข
      loadStatic("callStatusConfig");
      loadStatic("leadStatusItems");
      loadStatic("prospectStageItems");
      loadStatic("ratingItems");
      loadStatic("loanTypeItems");
      loadStatic("accountStatusFilterItems");
      loadStatic("contractStatusItems");
      loadStatic("assetTypeItems");
      loadStatic("insuranceTypeItems");
      loadStatic("insuranceVehicleTypeItems");
      loadStatic("contractTypeItems");
      loadStatic("gradeItems");
      loadStatic("sortKeyItems");

      // ❌ คอมเมนต์ออกให้หมด เพราะพวกนี้เราโหลดผ่าน AppConfig (ข้อ 2) แล้ว
      // ถ้าไม่เอาออก มันจะเอาค่า Default มาทับค่าใน DB ที่เราเพิ่งโหลดมาครับ

      /*
      loadStatic("rejectReasonItems");
      loadStatic("productItems");
      loadStatic("crossSellItems");
      loadStatic("titleItems");
      loadStatic("carTypeItems");
      loadStatic("gearboxItems");
      loadStatic("fuelItems");
      loadStatic("carBrandItems");
      loadStatic("campaignItems");
      loadStatic("financeCompanyItems");
      loadStatic("carColorItems");
      loadStatic("occupationItems");
      loadStatic("sourceItems");
      */

      console.log("✅ AppBoot: โหลด Static Configs เรียบร้อย");
    }

    // 4. Setup Computed UI
    if (window.AppGui && AppGui.setupComputed) {
      AppGui.setupComputed();
    }

    // 5. Setup Record Call Logic
    if (window.AppGui && AppGui.setupRecordCallComputed) {
      AppGui.setupRecordCallComputed();
    }

    console.log("🚀 System Initialization Complete.");
  },
};

window.AppInitPromise = AppBoot.performInitialization();
