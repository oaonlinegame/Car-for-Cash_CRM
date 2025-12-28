// js/dexie.js
// --------------------------------------------------------
// 📘 Dexie Storage Layer (Database Definition Only)
// --------------------------------------------------------
// หน้าที่: ประกาศโครงสร้าง Schema และ Version ของ DB เท่านั้น
// ข้อห้าม: ห้ามมี Business Logic หรือ CRUD Function ในไฟล์นี้
// --------------------------------------------------------

(function (global) {
  "use strict";

  // 1. ตรวจสอบ Dependencies
  if (typeof Dexie === "undefined") {
    console.error("❌ Critical Error: Dexie Library not loaded.");
    return;
  }

  console.log("💽 Initializing Database Schema...");

  // 2. สร้างฐานข้อมูล Dexie Instance
  const db = new Dexie("LeadManagerDB");

  // 3. กำหนด Schema (Version 311)
  db.version(311).stores({
    leads: "++id, firstName, phones, status, province, postalCode, createDate",
    settings: "key",
    logs: "++id, leadId, actionType, timestamp",
    contracts: "++id, contractId, leadId, statusAccount",
    cars: "++id, brand, model, plate",
  });

  // 4. Export Instance
  // ส่งออกเฉพาะตัว DB Instance เปล่าๆ ให้ Repository ไปจัดการต่อ
  global.AppDexie = db;

  console.log("✅ Dexie DB Schema Initialized (v311)");
})(window);
