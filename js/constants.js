// js/constants.js
// --------------------------------------------------------
// 💎 APP CONSTANTS MODULE
// --------------------------------------------------------
// โมดูลสำหรับจัดการค่าคงที่และการกำหนดค่าเริ่มต้นของระบบ (System Configuration)
// ทำหน้าที่เป็นแหล่งข้อมูลเดียว (Single Source of Truth) สำหรับการตั้งค่าต่าง ๆ
// เพื่อลดความซ้ำซ้อนของการระบุค่าในโค้ด (Hardcoded Values) และช่วยให้การบำรุงรักษาง่ายขึ้น
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppConstants = {
    // ========================================================================
    // 1. VISUAL THEME CONFIGURATION (การกำหนดค่าธีมและสี)
    // ========================================================================
    // กำหนดชุดสีมาตรฐานสำหรับส่วนติดต่อผู้ใช้ (UI Palette)
    // ค่าเหล่านี้จะถูกนำไป map เข้ากับ Theme System ของ Vuetify
    // เพื่อให้การแสดงผลมีความสม่ำเสมอทั่วทั้งแอปพลิเคชัน
    THEME: {
      PRIMARY: "#1565C0", // สีหลักของระบบ (ใช้สำหรับ Header, ปุ่มหลัก)
      SECONDARY: "#424242", // สีรอง (ใช้สำหรับองค์ประกอบทั่วไป)
      ACCENT: "#82B1FF", // สีเน้น (ใช้สำหรับจุดที่ต้องการดึงดูดสายตา)
      ERROR: "#FF5252", // สีแสดงสถานะข้อผิดพลาด
      INFO: "#2196F3", // สีแสดงข้อมูลสารสนเทศ
      SUCCESS: "#4CAF50", // สีแสดงสถานะการทำรายการสำเร็จ
      WARNING: "#FFC107", // สีแสดงคำเตือน
      BACKGROUND: "#F6F7FB", // สีพื้นหลังหลักของแอปพลิเคชัน
    },

    // ========================================================================
    // 2. SYSTEM METADATA (ข้อมูลจำเพาะของระบบ)
    // ========================================================================
    // ข้อมูลเชิงระบบสำหรับใช้ในการตรวจสอบเวอร์ชันและกำหนดรูปแบบท้องถิ่น (Localization)
    SYSTEM: {
      DEFAULT_LOCALE: "th-TH", // รูปแบบภาษาและภูมิภาคเริ่มต้น
      CURRENCY: "THB", // สกุลเงินหลักที่ใช้ในการคำนวณ
      VERSION: "1.0.0", // เลขเวอร์ชันปัจจุบันของแอปพลิเคชัน
    },

    // ========================================================================
    // 3. DATABASE CONFIGURATION (การตั้งค่าฐานข้อมูล)
    // ========================================================================
    // การกำหนดค่าสำหรับการเชื่อมต่อ IndexedDB ผ่าน Dexie.js
    // หมายเหตุ: การเปลี่ยนแปลง VERSION จะส่งผลให้เกิดการ Migrate Schema ใน dexie.js
    DB: {
      NAME: "LeadManagerDB", // ชื่อฐานข้อมูลภายใน Browser
      VERSION: 3113, // เวอร์ชันของ Schema (ต้องเพิ่มค่าเมื่อมีการแก้ไขโครงสร้างตาราง)
    },

    // ========================================================================
    // 4. FRAMEWORK CONFIGURATION (การตั้งค่า Vuetify)
    // ========================================================================
    // อ็อบเจกต์สำหรับส่งค่ากำหนดการเริ่มต้นไปยัง Vuetify.createVuetify()
    // ใช้ควบคุมพฤติกรรมของ Theme และชุด Icon ที่ใช้งาน
    VUETIFY_CONFIG: {
      theme: {
        defaultTheme: "light", // ธีมเริ่มต้น
        themes: {
          light: {
            colors: {
              // เชื่อมโยงค่าสีจาก THEME constant เข้าสู่ Vuetify Theme System
              primary: "#1565C0",
              secondary: "#424242",
              accent: "#82B1FF",
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FFC107",
            },
          },
        },
      },
      icons: {
        defaultSet: "mdi", // กำหนดให้ใช้ Material Design Icons เป็นค่าหลัก
      },
    },

    // ========================================================================
    // 5. UI BEHAVIOR CONFIGURATION (การตั้งค่าพฤติกรรม UI)
    // ========================================================================
    // กำหนดกฎและค่าเริ่มต้นสำหรับการทำงานของ UI Logic
    // ช่วยแยก Business Logic ออกจาก View Component
    UI_CONFIG: {
      // รายชื่อ Panel เริ่มต้นที่จะแสดงผลในหน้าสัญญา (Contract Accordion)
      // ใช้สำหรับกำหนดสถานะเริ่มต้นหรือรีเซ็ตการแสดงผล
      DEFAULT_CONTRACT_PANELS: [
        "info",
        "finance",
        "status",
        "asset",
        "history",
        "other",
      ],

      // กฎการรีเซ็ตฟอร์มอัตโนมัติ (Auto-Reset Rules)
      // ใช้โดย AppGui เพื่อตรวจสอบและสั่งรีเซ็ตข้อมูลเมื่อ Modal ถูกปิด
      // โครงสร้าง:
      // - stateKey: ตัวแปรใน AppState ที่ใช้ตรวจสอบสถานะการเปิด/ปิด
      // - module: ชื่อ Global Module ที่รับผิดชอบ
      // - method: ชื่อฟังก์ชันที่ใช้ทำการรีเซ็ต
      AUTO_RESET_RULES: [
        {
          stateKey: "isOpenModalLead",
          module: "LeadApp",
          method: "resetLeadForm",
          label: "Lead Form Closed",
        },
        {
          stateKey: "isOpenSubContractDialog",
          module: "ContractApp",
          method: "resetNewForm",
          label: "Sub-Contract Form Closed",
        },
        {
          stateKey: "isOpenModalCarSettings",
          module: "CarApp",
          method: "resetForm",
          label: "Car Setting Form Closed",
        },
      ],
    },
  };

  // ========================================================================
  // 6. IMMUTABILITY & EXPORT (การป้องกันการแก้ไขและการส่งออก)
  // ========================================================================

  // ทำการ Freeze Object เพื่อป้องกันการเปลี่ยนแปลงค่าโดยไม่ตั้งใจ (Runtime Protection)
  Object.freeze(AppConstants);

  // ส่งออกเป็น Global Variable (Pattern: Module Export)
  global.AppConstants = AppConstants;

  console.log("💎 AppConstants: Loaded and Frozen");
})(window);
