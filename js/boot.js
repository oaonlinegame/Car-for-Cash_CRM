// js/boot.js
// --------------------------------------------------------
// 📘 System Boot/Initialization Logic
// --------------------------------------------------------
// ไฟล์นี้ทำหน้าที่สั่งการให้โมดูลที่เกี่ยวข้องเริ่มโหลดข้อมูล
// และตั้งค่าเริ่มต้นของระบบ (Orchestration Layer)
// --------------------------------------------------------

const AppBoot = {
  // ----------------------------------------------------
  // ⭐ initSystem()
  // ฟังก์ชันรวมการเริ่มต้นระบบทั้งหมด
  // ----------------------------------------------------
  async initSystem() {
    // คอมเมนต์: ฟังก์ชันเริ่มต้นระบบทั้งหมด

    // 1. โหลดข้อมูล Lead จาก Dexie เข้า Store (Persistence -> Memory)
    if (window.LeadApp && LeadApp.loadAll) {
      // คอมเมนต์: ตรวจสอบ LeadApp
      await LeadApp.loadAll(); // คอมเมนต์: ดึงข้อมูล Lead ทั้งหมด
    } else {
      // คอมเมนต์: ถ้าไม่พร้อม
      console.warn("⚠️ AppBoot: LeadApp.loadAll ไม่พร้อมใช้งาน"); // คอมเมนต์: แจ้งเตือน
    } // คอมเมนต์: ปิดเงื่อนไข LeadApp

    // 2. โหลด Configs (เช่น รายการอาชีพ) จาก Dexie เข้า AppState
    if (window.AppConfig && AppConfig.loadAllConfigs) {
      // คอมเมนต์: ตรวจสอบ AppConfig
      await AppConfig.loadAllConfigs(); // คอมเมนต์: โหลดค่า Configs ทั้งหมด
    } else {
      // คอมเมนต์: ถ้าไม่พร้อม
      console.warn("⚠️ AppBoot: AppConfig.loadAllConfigs ไม่พร้อมใช้งาน"); // คอมเมนต์: แจ้งเตือน
    } // คอมเมนต์: ปิดเงื่อนไข AppConfig

    // 3. Setup Computed/Watchers หลักของ UI (Filter, Pagination)
    if (window.AppGui && AppGui.setupComputed) {
      // คอมเมนต์: ตรวจสอบ AppGui
      AppGui.setupComputed(); // คอมเมนต์: ตั้งค่า Computed หลักของ UI
    } else {
      // คอมเมนต์: ถ้าไม่พร้อม
      console.warn("⚠️ AppBoot: AppGui.setupComputed ไม่พร้อมใช้งาน"); // คอมเมนต์: แจ้งเตือน
    } // คอมเมนต์: ปิดเงื่อนไข AppGui

    console.log("🚀 System Initialization Complete."); // คอมเมนต์: แจ้งเตือนการเริ่มต้นระบบเสร็จสมบูรณ์
  }, // คอมเมนต์: ปิด initSystem
}; // คอมเมนต์: ปิด AppBoot

// --------------------------------------------------------
// 🌍 สั่งให้ระบบเริ่มทำงานทันทีเมื่อโหลดไฟล์นี้
// --------------------------------------------------------
AppBoot.initSystem(); // คอมเมนต์: สั่งเริ่มทำงาน
// [หมายเหตุ] ไม่จำเป็นต้อง Export เพราะเรียกตัวเองทันที
