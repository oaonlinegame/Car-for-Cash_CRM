// js/store.js
// --------------------------------------------------------
// 🗄️ GLOBAL STORE MODULE
// --------------------------------------------------------
// โมดูลเก็บข้อมูลกลางของระบบ (Centralized State Store)
// ทำหน้าที่เก็บรักษาสถานะข้อมูล (State Persistence) ใน Memory
// เพื่อให้ทุกส่วนของแอปพลิเคชันเข้าถึงข้อมูลเดียวกัน (Single Source of Truth)
// --------------------------------------------------------

(function (global) {
  "use strict";

  // ========================================================================
  // 1. REACTIVE STATE CONTAINER (พื้นที่เก็บข้อมูลแบบ Reactive)
  // ========================================================================

  const data = Vue.reactive({
    // ----------------------------------------------------
    // 1.1 Transactional Data (ข้อมูลธุรกรรมหลัก)
    // ----------------------------------------------------
    /**
     * รายการข้อมูล Lead ทั้งหมดที่โหลดจาก Database
     * ใช้สำหรับแสดงผลในตารางและคำนวณ Pagination
     */
    leadItems: [],

    // ----------------------------------------------------
    // 1.2 Master Data (ข้อมูลตัวเลือกมาตรฐาน)
    // ----------------------------------------------------
    // ข้อมูลเหล่านี้จะถูกโหลดจาก Database หรือใช้ค่า Default ที่กำหนดไว้ที่นี่
    // เพื่อใช้สร้างตัวเลือกใน Dropdown List ต่างๆ ของฟอร์ม

    // รายชื่ออาชีพสำหรับเลือกในฟอร์ม Lead
    occupationOptions: [
      "พนักงานบริษัท",
      "ข้าราชการ/รัฐวิสาหกิจ",
      "เจ้าของกิจการ",
      "ค้าขาย/อาชีพอิสระ",
      "เกษตรกร",
      "รับจ้างทั่วไป",
    ],

    sourceOptions: [
      "Facebook Page",
      "Walk-in (หน้าร้าน)",
      "ลูกค้าเก่าแนะนำ",
      "เพื่อน/ญาติแนะนำ",
      "Google Search",
      "Line",
      "Tiktok",
      "ใบปลิว/ป้ายโฆษณา",
      "งานอีเวนต์ กิจกรรมต่างๆ",
      "อื่นๆ",
    ],

    // ประเภททรัพย์สินสำหรับค้ำประกัน
    assetTypeOptions: [
      "รถยนต์",
      "รถบรรทุก",
      "รถการเกษตร",
      "รถตู้",
      "มอเตอร์ไซค์",
      "บิ๊กไบค์",
      "โฉนดที่ดิน/ห้องชุด/คอนโด",
      "ประกัน",
      "บำนาญ",
      "อื่นๆ",
    ],
    carBrandOptions: [
      "Toyota",
      "Honda",
      "Isuzu",
      "Nissan",
      "Mitsubishi",
      "Mazda",
      "Ford",
      "Suzuki",
      "MG",
      "BMW",
      "Benz",
      "Yamaha",
      "Honda Moto",
    ],
    // --- Master Data สำหรับสัญญา ---
    contractTypeOptions: [
      "จำนำทะเบียน",
      "เช่าซื้อ",
      "บำนาญ",
      "โฉนดที่ดิน",
      "ประกัน",
      "เช่าซื้อมอเตอร์ไซค์",
      "จำนำทะเบียนมอเตอร์ไซค์",
    ],
    contractStatusOptions: ["Active", "Closed", "Early", "Legal"],

    gradeOptions: [
      "L1",
      "L2",
      "L3",
      "L4",
      "L5",
      "L6",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "X1",
      "X2",
      "X3",
      "K1",
      "K2",
      "K3",
      "K4",
      "K5",
      "R",
      "R1",
      "R2",
      "R3",
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "D1",
      "D2",
      "D3",
      "D4",
      "D5",
      "D6",
    ],

    // ----------------------------------------------------
    // 1.3 UI Configuration (การตั้งค่าการแสดงผล)
    // ----------------------------------------------------

    /**
     * รายการเมนูสำหรับหน้าจัดการ Dropdown (Settings Page)
     * ใช้สำหรับสร้างแท็บและระบุ Key ที่ต้องการแก้ไข
     */
    dropdownMasterList: [
      {
        key: "occupationOptions",
        title: "อาชีพ",
        icon: "mdi-briefcase-account",
      },
      { key: "sourceOptions", title: "แหล่งที่มา", icon: "mdi-bullhorn" },
      {
        key: "assetTypeOptions",
        title: "ประเภทหลักทรัพย์",
        icon: "mdi-shield-home",
      },
      { key: "carBrandOptions", title: "ยี่ห้อรถ", icon: "mdi-car-multiple" },
      {
        key: "insuranceTypeOptions",
        title: "ประเภทประกัน",
        icon: "mdi-file-document-check",
      },
      {
        key: "agriVehicleTypeOptions",
        title: "ประเภทรถเกษตร",
        icon: "mdi-tractor",
      },
      {
        key: "contractTypeOptions",
        title: "ประเภทสัญญา",
        icon: "mdi-file-certificate-outline",
      },
      {
        key: "contractStatusOptions",
        title: "สถานะสัญญา",
        icon: "mdi-toggle-switch",
      },
      { key: "gradeOptions", title: "เกรดลูกค้า", icon: "mdi-star-circle" },
    ],

    /**
     * คำอธิบายคอลัมน์ของตาราง Lead (Data Table Headers)
     * ระบุชื่อฟิลด์, การจัดตำแหน่ง และการเรียงลำดับ
     */
    leadHeaders: [
      { title: "ชื่อ-นามสกุล", key: "name", align: "start" },
      { title: "เบอร์โทร", key: "tel", align: "start" },
      { title: "อาชีพ", key: "occupation", align: "start" },
      { title: "วันที่สร้าง", key: "createDate", align: "center" },
      { title: "จัดการ", key: "actions", align: "end", sortable: false },
    ],

    /**
     * คำอธิบายคอลัมน์ของตารางสัญญา (Contract Table Headers)
     */
    contractHeaders: [
      { title: "เลขที่สัญญา", key: "contractNo", align: "start" },
      { title: "วันที่ทำสัญญา", key: "signDate", align: "start" },
      { title: "ยอดจัด", key: "financeAmount", align: "end" },
      { title: "สถานะ", key: "status", align: "center" },
    ],
  });

  // ========================================================================
  // 2. MODULE EXPORT (การส่งออกโมดูล)
  // ========================================================================

  const Store = { data };
  global.Store = Store;
})(window);
