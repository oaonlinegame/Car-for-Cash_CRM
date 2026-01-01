// js/setting.js
// --------------------------------------------------------
// ⚙️ Application Settings & Configuration
// --------------------------------------------------------
// หน้าที่:
// 1. เก็บการตั้งค่าระบบ (Config)
// 2. ตั้งค่า Plugins (Vuetify, VirtualScroller) ผ่าน init(app)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppSetting = {
    // กำหนดค่าเริ่มต้น (ป้องกันค่าว่าง)
    theme: "light",
    language: "th",
    version: "1.0.0",
    // ----------------------------------------------------
    // 🚀 init(app): ฟังก์ชันสำหรับ Bootstrap Plugins ต่างๆ
    // ----------------------------------------------------
    init(app) {
      console.log("⚙️ AppSetting: Initializing Plugins...");

      // 1. ลงทะเบียน Virtual Scroller (ใช้ Short-circuit && แทน if)
      global.VueVirtualScroller?.VirtualScroller &&
        app.component(
          "virtual-scroller",
          global.VueVirtualScroller.VirtualScroller
        );

      // 2. สร้างและตั้งค่า Vuetify
      // ตรวจสอบว่า Vuetify โหลดมาเรียบร้อยแล้ว
      if (global.Vuetify) {
        const vuetify = global.Vuetify.createVuetify({
          components: {
            ...global.Vuetify.components,
            ...global.Vuetify.labs,
          },
          // สามารถเพิ่ม theme หรือ defaults อื่นๆ ได้ที่นี่
        });

        // 3. ใช้งาน Vuetify กับ App
        app.use(vuetify);
      } else {
        console.error("❌ AppSetting: Vuetify library not found!");
      }

      console.log("✅ AppSetting: Plugins Loaded.");
    },
  };

  // Export สู่ Global
  global.AppSetting = AppSetting;
})(window);
