// js/constants.js
// --------------------------------------------------------
// 🏛️ CONSTANTS: ค่าคงที่และข้อมูลตั้งต้นทั้งระบบ (System Dictionary)
// --------------------------------------------------------
// หน้าที่:
// 1. เก็บ Enum สถานะต่างๆ (ห้าม Hardcode String ในไฟล์อื่น)
// 2. เก็บ Default Config (รวมจาก configData.js เดิม)
// 3. เป็น Single Source of Truth ของระบบ
// --------------------------------------------------------

(function (global) {
  "use strict";

  const CONSTANTS = {
    // ========================================================
    // 💾 DATABASE CONFIG
    // ========================================================
    TABLES: {
      LEAD: "leads",
      CONTRACT: "contracts",
      CAR: "cars",
      LOG: "logs",
      SETTING: "settings",
    },

    // ========================================================
    // 🔑 CONFIG KEYS (สำหรับ Dexie Settings)
    // ========================================================
    CONFIG_KEYS: {
      OCCUPATION: "occupationItems",
      SOURCE: "sourceItems",
      BRAND: "carBrandItems",
      CAMPAIGN: "campaignItems",
      REJECT_REASON: "rejectReasonItems",
      COLOR: "carColorItems",
      FINANCE: "financeCompanyItems",
      PRODUCT: "productItems",
      CROSS_SELL: "crossSellItems",
      TITLE: "titleItems",
      CAR_TYPE: "carTypeItems",
      GEARBOX: "gearboxItems",
      FUEL: "fuelItems",
    },

    // ========================================================
    // 🚦 LEAD STATUS (สถานะลูกค้า)
    // ========================================================
    LEAD_STATUS: {
      NEW: "ลูกค้าใหม่",
      HIRE_PURCHASE: "ลูกค้าเช่าซื้อ",
      PLEDGE: "ลูกค้าจำนำทะเบียน",
      FOLLOW_UP: "ติดตาม",
      NOT_INTERESTED: "ไม่สนใจ",
    },

    // ========================================================
    // 🎯 PROSPECT STAGE (ขั้นตอนการขาย)
    // ========================================================
    PROSPECT_STAGE: {
      INTERESTED: "สนใจ",
      OFFER_WAITING: "รอเสนอ",
      DOCS_WAITING: "รอเอกสาร",
      CLOSED: "ปิดการขาย",
    },

    // ========================================================
    // 📜 CONTRACT STATUS (สถานะสัญญา)
    // ========================================================
    CONTRACT_STATUS: {
      ACTIVE: "Active",
      CLOSED: "Closed",
      EARLY: "Early",
      NON_ACTIVE: "Non-Active",
    },

    // ========================================================
    // 🏡 ASSET TYPE (ประเภทหลักทรัพย์)
    // ========================================================
    ASSET_TYPE: {
      CAR: "รถยนต์",
      MOTORCYCLE: "มอเตอร์ไซค์",
      BIGBIKE: "รถบิ๊กไบค์",
      VAN: "รถตู้",
      TRUCK: "รถบรรทุก",
      AGRI: "รถเพื่อการเกษตร",
      LAND: "โฉนด",
      PENSION: "บำนาญ",
      INSURANCE: "ประกัน",
    },

    // ========================================================
    // 📦 DEFAULT LISTS (ย้ายมาจาก configData.js)
    // ========================================================
    DEFAULTS: {
      productItems: [
        "จำนำทะเบียน",
        "เช่าซื้อ",
        "รีไฟแนนซ์",
        "สินเชื่อบุคคล",
        "สินเชื่อบ้าน/ที่ดิน",
      ],
      crossSellItems: [
        "ประกันภัยรถยนต์",
        "พ.ร.บ.",
        "สินเชื่อรถคันอื่น",
        "ซื้อรถใหม่",
        "บัตรเครดิต",
        "ประกันชีวิต",
      ],
      titleItems: ["นาย", "นาง", "นางสาว", "บจก.", "หจก.", "ดร.", "ร.ต.อ."],
      leadStatusItems: [
        "ลูกค้าใหม่",
        "ลูกค้าเช่าซื้อ",
        "ลูกค้าจำนำทะเบียน",
        "ติดตาม",
        "ไม่สนใจ",
      ],
      ratingItems: [5, 4, 3, 2, 1],
      carTypeItems: [
        "เก๋ง (Sedan)",
        "กระบะ (Pickup)",
        "รถอเนกประสงค์ (SUV/PPV)",
        "รถตู้ (Van)",
        "มอเตอร์ไซค์",
      ],
      gearboxItems: ["อัตโนมัติ (Auto)", "ธรรมดา (Manual)"],
      fuelItems: [
        "ดีเซล",
        "เบนซิน",
        "ไฟฟ้า (EV)",
        "ไฮบริด (Hybrid)",
        "NGV",
        "LPG",
      ],
      carBrandItems: [
        "Toyota",
        "Honda",
        "Isuzu",
        "Mitsubishi",
        "Ford",
        "Mazda",
        "Nissan",
        "Suzuki",
        "MG",
        "BYD",
        "BMW",
        "Benz",
      ],
      assetTypeItems: [
        "รถยนต์",
        "มอเตอร์ไซค์",
        "รถตู้",
        "รถบรรทุก",
        "รถเพื่อการเกษตร",
        "โฉนด",
        "บำนาญ",
        "ประกัน",
      ],
      insuranceTypeItems: ["ประกันรถ", "ประกันอื่น"],
      contractTypeItems: [
        "จำนำทะเบียน",
        "เช่าซื้อ",
        "บำนาญ",
        "โฉนดที่ดิน",
        "ประกัน",
      ],
      accountStatusFilterItems: ["ปกติ", "ค้างชำระ", "ปิดบัญชี", "ฟ้องร้อง"],
      occupationItems: [
        "พนักงานบริษัท",
        "เจ้าของกิจการ",
        "ข้าราชการ",
        "รับจ้างทั่วไป",
        "เกษตรกร",
        "ว่างงาน",
      ],
      sourceItems: [
        "Facebook",
        "Line",
        "เดินเข้าร้าน",
        "เว็บไซต์",
        "พนักงานแนะนำ",
      ],
      rejectReasonItems: [
        "ดอกเบี้ยแพง",
        "วงเงินน้อย",
        "มีที่อื่นแล้ว",
        "ติด Blacklist",
        "เอกสารไม่พร้อม",
      ],
      campaignItems: [
        "โปรโมชั่นประจำเดือน",
        "ลูกค้าเก่าแนะนำ",
        "Motor Show",
        "Walk-in หน้าร้าน",
        "Facebook Ads",
      ],
      financeCompanyItems: [
        "ธนาคารกรุงศรี",
        "ธนาคารทิสโก้",
        "เงินติดล้อ",
        "สมหวัง",
        "ศรีสวัสดิ์",
      ],
    },

    // ========================================================
    // 💬 MESSAGES (ข้อความแจ้งเตือนมาตรฐาน)
    // ========================================================
    MSG: {
      SAVE_SUCCESS: "✅ บันทึกข้อมูลเรียบร้อยแล้ว",
      SAVE_ERROR: "❌ เกิดข้อผิดพลาดในการบันทึก",
      DELETE_SUCCESS: "🗑️ ลบข้อมูลเรียบร้อยแล้ว",
      VALIDATE_NAME: "กรุณาระบุชื่อลูกค้า",
      CONFIRM_DELETE: "คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?",
      LOAD_ERROR: "⚠️ ไม่สามารถโหลดข้อมูลได้",
    },
  };

  // 🔒 Freeze Object เพื่อป้องกันการเผลอไปแก้ไขค่าทีหลัง
  Object.freeze(CONSTANTS);

  // Export เข้าสู่ Window
  global.CONSTANTS = CONSTANTS;

  console.log("✅ System Constants Loaded (Merged ConfigData & DataSpec)");
})(window);
