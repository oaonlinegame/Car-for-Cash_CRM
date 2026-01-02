// js/dexie.js
// --------------------------------------------------------
// 🗄️ Database Configuration (ตั้งค่าฐานข้อมูล)
// --------------------------------------------------------
// หน้าที่: สร้าง Connection และกำหนด Schema เท่านั้น
// ❌ ห้ามใส่ Logic การเพิ่ม/ลบ/แก้ไข ข้อมูลที่นี่
// --------------------------------------------------------

(function (global) {
  "use strict";

  // 1. สร้าง Instance
  const db = new Dexie("LeadManagerDB");

  // 2. กำหนด Schema (Table Structure)
  // หมายเหตุ: ++id คือ Auto Increment
  db.version(3112).stores({
    leads: "++id, firstName, phones, status, province, postalCode, createDate",
    logs: "++id, leadId, action, timestamp", // เพิ่มเผื่อไว้สำหรับ log.js
  });

  // 3. Export ตัว DB Instance ออกไปให้ Repository ใช้
  global.AppDexie = db;

  console.log("🗄️ AppDexie: Database Initialized");
})(window);
