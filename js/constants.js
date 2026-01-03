// js/constants.js
// --------------------------------------------------------
// 💎 AppConstants (ค่าคงที่และการตั้งค่าพื้นฐานของระบบ)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppConstants = {
    // ----------------------------------------------------
    // 🎨 UI Theme & Colors (การตั้งค่าสีธีม)
    // ----------------------------------------------------
    THEME: {
      PRIMARY: "#1565C0",
      SECONDARY: "#424242",
      ACCENT: "#82B1FF",
      ERROR: "#FF5252",
      INFO: "#2196F3",
      SUCCESS: "#4CAF50",
      WARNING: "#FFC107",
      BACKGROUND: "#F6F7FB",
    },

    // ----------------------------------------------------
    // 📄 System Configuration (การตั้งค่าระบบ)
    // ----------------------------------------------------
    SYSTEM: {
      DEFAULT_LOCALE: "th-TH",
      CURRENCY: "THB",
      VERSION: "1.0.0",
    },

    // ----------------------------------------------------
    // 🗄️ Database Config (การตั้งค่าฐานข้อมูล)
    // ----------------------------------------------------
    DB: {
      NAME: "LeadManagerDB",
      VERSION: 3113,
    },

    // ----------------------------------------------------
    // 🖼️ UI Framework Config (การตั้งค่า Vuetify)
    // ----------------------------------------------------
    // ✅ [เพิ่มใหม่] ย้าย Config ของ Vuetify มาไว้ที่นี่เพื่อให้แก้ไขง่าย
    VUETIFY_CONFIG: {
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            colors: {
              primary: "#1565C0", // ตรงกับ THEME.PRIMARY
              secondary: "#424242", // ตรงกับ THEME.SECONDARY
              accent: "#82B1FF", // ตรงกับ THEME.ACCENT
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FFC107",
            },
          },
        },
      },
      icons: {
        defaultSet: "mdi", // ใช้ Material Design Icons
      },
    },
  };

  // ป้องกันการแก้ไขค่าโดยไม่ตั้งใจ (Immutable)
  Object.freeze(AppConstants);

  // ส่งออกเป็น Global Variable
  global.AppConstants = AppConstants;
  console.log("💎 AppConstants: Loaded");
})(window);
