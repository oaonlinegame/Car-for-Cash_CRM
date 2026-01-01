// js/store.js
// --------------------------------------------------------
// 📘 Data Store (คลังข้อมูลในหน่วยความจำ)
// --------------------------------------------------------
// ✅ State Only: เก็บเฉพาะตัวแปร ไม่เก็บ Logic/Function
// --------------------------------------------------------

const Store = {
  // ----------------------------------------------------
  // ⭐ ตัวเก็บข้อมูล (ใช้ shallowReactive เพื่อความเร็วสูงสุด)
  // ----------------------------------------------------
  data: Vue.shallowReactive({
    // ข้อมูลหลักของระบบ (Domain Entities)
    leadItems: [], // รายการลูกค้า (Leads)
    carItems: [], // รายการรถยนต์
    financeItems: [], // รายการข้อมูลการเงิน
    logItems: [], // รายการประวัติการทำงาน (Logs)

    // ข้อมูลการตั้งค่าและรายงาน
    reportItems: [],
    settingsItems: [],

    // หัวตารางสำหรับแสดงผล (Table Headers)
    leadHeaders: [
      { title: "ID", key: "id", align: "start" },
      { title: "ชื่อลูกค้า", key: "customerName", align: "start" },
      { title: "สถานะ", key: "status", align: "start" },
      { title: "เบอร์", key: "contactNo", align: "start" },
      { title: "รถ", key: "vehicle", align: "start" },
      { title: "วันที่สร้าง", key: "dateCreated", align: "start" },
    ],
  }),
};

// ส่งออก Store
window.Store = Store;
