// js/store.js
// --------------------------------------------------------
// 🗄️ Global Store (ศูนย์กลางข้อมูลหลักของระบบ)
// --------------------------------------------------------

(function (global) {
  "use strict";

  // ========================================================================
  // 1. DATA STRUCTURE (โครงสร้างข้อมูล)
  // ========================================================================

  /**
   * ข้อมูลหลักที่ใช้ในระบบ (Reactive State)
   */
  const data = Vue.reactive({
    // --- Main Data (ข้อมูลหลัก) ---
    leadItems: [], // รายการ Lead ทั้งหมด

    // --- Master Data (ข้อมูลตัวเลือกต่างๆ) ---
    occupationOptions: [], // ตัวเลือกอาชีพ
    sourceOptions: [], // ตัวเลือกแหล่งที่มา

    // เพิ่ม Metadata สำหรับจัดการ Dropdown
    // เพื่อให้หน้าจอ "จัดการตัวเลือก" รู้ว่าจะต้องแสดง Tab อะไรบ้าง
    dropdownMasterList: [
      {
        key: "occupationOptions",
        title: "อาชีพ",
        icon: "mdi-briefcase-account",
      },
      {
        key: "sourceOptions",
        title: "แหล่งที่มา",
        icon: "mdi-bullhorn",
      },
    ],

    // --- UI Configuration (การตั้งค่าตารางแสดงผล) ---
    leadHeaders: [
      { title: "ชื่อ-นามสกุล", key: "name", align: "start" },
      { title: "เบอร์โทร", key: "tel", align: "start" },
      { title: "อาชีพ", key: "occupation", align: "start" },
      { title: "วันที่สร้าง", key: "createDate", align: "center" },
      { title: "จัดการ", key: "actions", align: "end", sortable: false },
    ],

    contractHeaders: [
      { title: "เลขที่สัญญา", key: "contractNo", align: "start" },
      { title: "วันที่ทำสัญญา", key: "signDate", align: "start" },
      { title: "ยอดจัด", key: "financeAmount", align: "end" },
      { title: "สถานะ", key: "status", align: "center" },
    ],
  });

  // ========================================================================
  // 2. STORE EXPORT (การส่งออก Store)
  // ========================================================================

  const Store = {
    data,
  };

  global.Store = Store;
})(window);
