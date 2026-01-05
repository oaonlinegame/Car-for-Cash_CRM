// js/constants.js
// --------------------------------------------------------
// 💎 APP CONSTANTS MODULE
// --------------------------------------------------------
// โมดูลสำหรับจัดการค่าคงที่และการกำหนดค่าเริ่มต้นของระบบ (System Configuration)
// ทำหน้าที่เป็นแหล่งข้อมูลเดียว (Single Source of Truth) เพื่อลดความซ้ำซ้อนของการระบุค่าในโค้ด
// ช่วยให้การบำรุงรักษาและแก้ไขพารามิเตอร์หลักของระบบทำได้จากจุดเดียว
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppConstants = {
    // ========================================================================
    // 1. VISUAL THEME CONFIGURATION (การกำหนดค่าธีมและสีหลักของ UI)
    // ========================================================================
    // ชุดสีมาตรฐานสำหรับส่วนติดต่อผู้ใช้ที่ใช้ร่วมกับระบบ Theme ของ Vuetify

    THEME: {
      PRIMARY: "#1565C0", // สีหลักของระบบ สำหรับ Header และปุ่มการดำเนินการหลัก
      SECONDARY: "#424242", // สีรองสำหรับองค์ประกอบทั่วไป
      ACCENT: "#82B1FF", // สีเน้นสำหรับการดึงดูดสายตาในจุดสำคัญ
      ERROR: "#FF5252", // สีแสดงสถานะข้อผิดพลาดหรือการแจ้งเตือนเชิงลบ
      INFO: "#2196F3", // สีแสดงข้อมูลทั่วไปหรือสารสนเทศ
      SUCCESS: "#4CAF50", // สีแสดงสถานะการทำรายการสำเร็จ
      WARNING: "#FFC107", // สีแสดงคำเตือนที่ควรระวัง
      BACKGROUND: "#F6F7FB", // สีพื้นหลังหลักของแอปพลิเคชัน
    },

    // ========================================================================
    // 2. STICKY TARGETS (การระบุตำแหน่งอ้างอิงสำหรับการเลื่อนหน้าจอ)
    // ========================================================================
    // กำหนด ID ของ Section ต่างๆ เพื่อใช้ในระบบนำทางภายในหน้าจอ (Scrolling System)
    // ป้องกันการระบุชื่อ ID ซ้ำซ้อนในไฟล์ HTML และไฟล์ Logic

    STICKY_TARGETS: {
      // --- หมวดหมู่ข้อมูลลูกค้า (Lead Sections) ---
      LEAD_MAIN: "section-lead-main", // ข้อมูลพื้นฐานและอาชีพ
      LEAD_CONTACT: "section-lead-contact", // ข้อมูลการติดต่อและที่อยู่
      LEAD_SOURCE: "section-lead-source", // แหล่งที่มาของลูกค้า
      LEAD_ASSET: "section-lead-asset", // รายการหลักทรัพย์เบื้องต้น
      LEAD_NOTE: "section-lead-note", // บันทึกเพิ่มเติม

      // --- หมวดหมู่ข้อมูลสัญญา (Contract Sections) ---
      CONTRACT_INFO: "section-contract-info", // รายละเอียดเลขที่และประเภทสัญญา
      CONTRACT_INSTALLMENT: "section-contract-installment", // รายละเอียดการผ่อนชำระ
      CONTRACT_FINANCE: "section-contract-finance", // ยอดคงเหลือและการเงิน
      CONTRACT_ASSET: "section-contract-asset", // หลักทรัพย์ค้ำประกันสัญญา
      CONTRACT_SUB: "section-contract-sub", // รายการสัญญาย่อยที่เกี่ยวข้อง

      // --- หมวดหมู่สัญญาย่อย (Sub-Contract Sections) ---
      SUBCONTRACT_INFO: "section-subcontract-info", // ข้อมูลสัญญาย่อย
      SUBCONTRACT_INSTALLMENT: "section-subcontract-installment", // การผ่อนชำระสัญญาย่อย
      SUBCONTRACT_FINANCE: "section-subcontract-finance", // การเงินสัญญาย่อย
    },

    // ========================================================================
    // 3. SYSTEM METADATA (ข้อมูลคุณลักษณะของระบบ)
    // ========================================================================

    SYSTEM: {
      DEFAULT_LOCALE: "th-TH", // รูปแบบภาษาและภูมิภาคสำหรับการจัดรูปแบบวันที่และตัวเลข
      CURRENCY: "THB", // สกุลเงินหลักที่ใช้ในการประมวลผล
      VERSION: "1.0.0", // เลขเวอร์ชันของแอปพลิเคชันสำหรับตรวจสอบการอัปเดต
    },

    // ========================================================================
    // 4. DATABASE CONFIGURATION (การตั้งค่าฐานข้อมูลภายใน)
    // ========================================================================

    DB: {
      NAME: "LeadManagerDB", // ชื่อฐานข้อมูล IndexedDB ใน Browser
      VERSION: 3113, // เวอร์ชันของ Schema เพื่อจัดการการทำ Database Migration
    },

    // ========================================================================
    // 5. FRAMEWORK CONFIGURATION (การกำหนดค่าเริ่มต้นของ Vuetify)
    // ========================================================================

    VUETIFY_CONFIG: {
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            colors: {
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
        defaultSet: "mdi", // กำหนดชุดไอคอนมาตรฐานเป็น Material Design Icons
      },
    },

    // ========================================================================
    // 6. UI BEHAVIOR CONFIGURATION (การกำหนดพฤติกรรมการแสดงผล)
    // ========================================================================

    UI_CONFIG: {
      // รายการ Panel มาตรฐานที่ต้องเปิดแสดงผลในหน้าจอสัญญา
      DEFAULT_CONTRACT_PANELS: [
        "info",
        "finance",
        "status",
        "asset",
        "history",
        "other",
      ],

      // ระยะการเลื่อนหน้าจอ (Offset) เพื่อหลบส่วนหัวที่ตรึงไว้ (Sticky Header)
      SCROLL_OFFSETS: {
        LEAD_TOP: 80, // สำหรับส่วนบนสุดของข้อมูลลูกค้า
        LEAD_SECTION: 0, // สำหรับ Section ย่อยภายในข้อมูลลูกค้า
        CONTRACT_DEFAULT: 120, // สำหรับส่วนข้อมูลสัญญาที่มี Header ซ้อนหลายชั้น
      },

      // กฎการรีเซ็ตข้อมูลอัตโนมัติเมื่อสถานะ UI เปลี่ยนแปลง (เช่น เมื่อปิด Modal)
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
  // 7. MODULE PROTECTION & EXPORT
  // ========================================================================

  // ป้องกันการแก้ไขค่าคงที่หลังจากโหลดระบบ (Immutability Protection)
  Object.freeze(AppConstants);

  // ส่งออกเป็น Global Variable เพื่อให้ทุกโมดูลเข้าถึงได้
  global.AppConstants = AppConstants;

  console.log("💎 AppConstants: Loaded and Frozen");
})(window);
