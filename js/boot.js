// js/boot.js
// --------------------------------------------------------
// 📘 System Boot/Initialization Logic
// --------------------------------------------------------
// ไฟล์นี้ทำหน้าที่สั่งการให้โมดูลที่เกี่ยวข้องเริ่มโหลดข้อมูล
// และตั้งค่าเริ่มต้นของระบบ (Orchestration Layer)
// --------------------------------------------------------

const AppBoot = {
  // ----------------------------------------------------
  // ⭐ performInitialization()
  // ฟังก์ชันรวมการเริ่มต้นระบบทั้งหมด
  // ----------------------------------------------------
  async performInitialization() {
    // คอมเมนต์: ฟังก์ชันเริ่มต้นระบบทั้งหมด (ชื่อใหม่)

    // 1. โหลดข้อมูล Lead จาก Dexie เข้า Store (Persistence -> Memory)
    if (window.LeadApp && LeadApp.loadAll) {
      // คอมเมนต์: ตรวจสอบ LeadApp
      await LeadApp.loadAll(); // คอมเมนต์: ดึงข้อมูล Lead ทั้งหมด (รอให้เสร็จ)
    } else {
      // คอมเมนต์: ถ้าไม่พร้อม
      console.warn("⚠️ AppBoot: LeadApp.loadAll ไม่พร้อมใช้งาน"); // คอมเมนต์: แจ้งเตือน
    } // คอมเมนต์: ปิดเงื่อนไข LeadApp

    // 2. โหลด Configs (เช่น รายการอาชีพ) จาก Dexie เข้า AppState
    if (window.AppConfig && AppConfig.loadAllConfigs) {
      // คอมเมนต์: ตรวจสอบ AppConfig
      await AppConfig.loadAllConfigs(); // คอมเมนต์: โหลดค่า Configs ทั้งหมด (รอให้เสร็จ)
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
  }, // คอมเมนต์: ปิด performInitialization
}; // คอมเมนต์: ปิด AppBoot

// --------------------------------------------------------
// 🌍 สั่งให้ระบบเริ่มทำงานและเก็บ Promise ไว้ใน Global
// --------------------------------------------------------
window.AppInitPromise = AppBoot.performInitialization(); // คอมเมนต์: สั่งเริ่มทำงานและเก็บ Promise ไว้ใน Global
// [หมายเหตุ] ไม่จำเป็นต้อง Export AppBoot เพราะเรียกใช้ผ่าน Promise แทน
