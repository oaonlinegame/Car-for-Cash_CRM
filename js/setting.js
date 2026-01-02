// js/setting.js
// --------------------------------------------------------
// ⚙️ Application Settings & Configuration
// --------------------------------------------------------
(function (global) {
  "use strict";

  const AppSetting = {
    // ค่า Config พื้นฐาน
    theme: "light",
    language: "th",
    version: "1.0.0",

    // ----------------------------------------------------
    // 🚀 init(app): ตั้งค่า Plugins
    // ----------------------------------------------------
    init(app) {
      console.log("⚙️ AppSetting: Initializing Plugins...");

      // Virtual Scroller
      global.VueVirtualScroller?.VirtualScroller &&
        app.component(
          "virtual-scroller",
          global.VueVirtualScroller.VirtualScroller
        );

      // Vuetify
      if (global.Vuetify) {
        const vuetify = global.Vuetify.createVuetify({
          components: { ...global.Vuetify.components, ...global.Vuetify.labs },
        });
        app.use(vuetify);
      } else {
        console.error("❌ AppSetting: Vuetify library not found!");
      }
      console.log("✅ AppSetting: Plugins Loaded.");
    },

    // ----------------------------------------------------
    // 📥 load(): โหลดค่า Master Data จาก DB (ถ้ามี)
    // ----------------------------------------------------
    async load() {
      if (!global.Repository || !global.Repository.settings) return;
      if (!global.Store) return;

      try {
        // รายการ Master Data ที่ต้องการโหลด (ชื่อ Key ใน Store)
        const keysToLoad = ["occupationOptions", "assetTypeOptions"];

        for (const key of keysToLoad) {
          // ดึงจาก DB
          const dbData = await global.Repository.settings.get(key);

          // ✅ Logic: ถ้ามีใน DB -> เอามาทับ Store (ถ้าไม่มี -> ใช้ Default ใน Store ต่อไป)
          if (dbData && Array.isArray(dbData.value)) {
            global.Store.data[key] = dbData.value;
            console.log(`📥 AppSetting: Loaded '${key}' from DB`);
          }
        }
      } catch (err) {
        console.error("❌ AppSetting Load Error:", err);
      }
    },

    // ----------------------------------------------------
    // 💾 addOption(): เพิ่มตัวเลือกใหม่และบันทึกลง DB
    // ----------------------------------------------------
    async addOption(storeKey, newValue) {
      // 1. Validation
      if (!newValue || typeof newValue !== "string") return;
      const cleanValue = newValue.trim();
      if (!cleanValue) return;

      if (!global.Store || !global.Store.data[storeKey]) return;

      // 2. เช็คซ้ำ (Duplicate Check)
      if (global.Store.data[storeKey].includes(cleanValue)) return;

      // 3. อัปเดต Store (Update UI)
      const newList = [...global.Store.data[storeKey], cleanValue];
      global.Store.data[storeKey] = newList;

      // 4. บันทึกลง DB (Persistence)
      if (global.Repository && global.Repository.settings) {
        await global.Repository.settings.set(storeKey, newList);
        console.log(`💾 AppSetting: Saved '${storeKey}' to DB`);
      }
    },
  };

  global.AppSetting = AppSetting;
})(window);
