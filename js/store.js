// store.js
// --------------------------------------------------------
// 📘 Store เวอร์ชันกลางแท้จริง — ไม่ผูกกับข้อมูลเฉพาะโมดูลใด ๆ
// ใช้เป็นแหล่งเก็บสถานะกลาง + จัดการ LocalStorage
// --------------------------------------------------------
//
// 🧭 ตัวอย่างการใช้งาน:
//
// 🔹 โหลดข้อมูลจาก LocalStorage
//    Store.loadLocalStorage('Lead')             // โหลดเฉพาะ Lead
//
// 🔹 อัปเดตข้อมูลและบันทึกลง LocalStorage
//    Store.updateLocalStorage('Lead', newData)  // บันทึกข้อมูลใหม่
//
// 🔹 เคลียร์ข้อมูล
//    Store.clearLocalStorage('Lead')            // ล้างข้อมูล Lead ทั้งหมด
//
// 🔹 โหลดข้อมูลทั้งหมด (พร้อม fallback)
//    Store.loadAllFromStorage()                 // โหลดทุกโมดูลพร้อมข้อมูลตัวอย่าง
//
// 🔹 โครงสร้างโมดูลที่รองรับ:
//    - Lead
//    - Car
//    - Finance
//    - Log
//    - Report
//    - Settings  ← ✅ เพิ่มใหม่ต้องทำแบบนี้ด้วย
//
// --------------------------------------------------------

const Store = {
  // ----------------------------------------------------
  // 🗂️ โครงสร้างข้อมูลหลัก (Reactive)
  // ----------------------------------------------------
  data: Vue.reactive({
    // 🔹 เก็บข้อมูลตัวอย่างไว้ภายใน Store เอง
    ExampleData: {
      Lead: [
        {
          id: 1,
          customerName: "John Doe",
          status: "Active",
          contactNo: "123-456-7890",
          vehicle: "Toyota Camry",
          dateCreated: "2025-11-01",
        },
        {
          id: 2,
          customerName: "Jane Smith",
          status: "Inactive",
          contactNo: "987-654-3210",
          vehicle: "Honda Civic",
          dateCreated: "2025-11-02",
        },
      ],
      Car: [],
      Finance: [],
      Log: [],
      Report: [],
      Settings: [],
    },

    // 🔹 ตัวแปรหลักในระบบ (Reactive)
    leadHeaders: [],
    leadItems: [],
    carItems: [],
    financeItems: [],
    logItems: [],
    reportItems: [],
    settings: [],
  }),

  // --------------------------------------------------------
  // 📥 โหลดข้อมูลจาก Local Storage
  // --------------------------------------------------------
  loadLocalStorage(type, fallbackData = []) {
    try {
      const key = `${type.toLowerCase()}Items`;
      const saved = localStorage.getItem(key);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.data[key].splice(0, this.data[key].length, ...parsed);
          console.log(`📥 โหลดข้อมูล ${key} จาก Local Storage สำเร็จ`);
          return;
        }
      }

      // 🔹 ใช้ fallback (ข้อมูลตัวอย่าง)
      if (Array.isArray(fallbackData) && fallbackData.length > 0) {
        this.data[key].splice(0, this.data[key].length, ...fallbackData);
        console.log(`📦 ใช้ข้อมูลตัวอย่างแทน (${type})`);
      }
    } catch (err) {
      console.error(`❌ loadLocalStorage(${type}) ไม่สำเร็จ:`, err);
    }
  },

  // --------------------------------------------------------
  // 💾 บันทึกข้อมูลลง Local Storage
  // --------------------------------------------------------
  saveLocalStorage(type) {
    try {
      const key = `${type.toLowerCase()}Items`;
      const dataToSave = this.data[key] || [];
      localStorage.setItem(key, JSON.stringify(dataToSave));
      console.log(`💾 บันทึกข้อมูล ${key} เรียบร้อย`);
    } catch (err) {
      console.error(`❌ saveLocalStorage(${type}) ไม่สำเร็จ:`, err);
    }
  },

  // --------------------------------------------------------
  // 🔁 อัปเดตข้อมูลและบันทึก (ฟังก์ชันกลาง)
  // --------------------------------------------------------
  updateLocalStorage(type, newData) {
    try {
      const key = `${type.toLowerCase()}Items`;
      if (!Array.isArray(newData)) {
        console.warn(`⚠️ updateLocalStorage(${type}): newData ไม่ใช่ Array`);
        return;
      }

      this.data[key].splice(0, this.data[key].length, ...newData);
      localStorage.setItem(key, JSON.stringify(newData));
      console.log(`✅ updateLocalStorage(${type}) สำเร็จ`);
    } catch (err) {
      console.error(`❌ updateLocalStorage(${type}) ล้มเหลว:`, err);
    }
  },

  // --------------------------------------------------------
  // 🧹 เคลียร์ข้อมูลใน Local Storage
  // --------------------------------------------------------
  clearLocalStorage(type) {
    try {
      const key = `${type.toLowerCase()}Items`;
      localStorage.removeItem(key);
      this.data[key].splice(0);
      console.log(`🧹 เคลียร์ข้อมูล ${key} เรียบร้อย`);
    } catch (err) {
      console.error(`❌ clearLocalStorage(${type}) ไม่สำเร็จ:`, err);
    }
  },

  // --------------------------------------------------------
  // 🚀 โหลดข้อมูลทั้งหมด (พร้อม fallback ตัวอย่าง)
  // --------------------------------------------------------
  loadAllFromStorage() {
    // ✅ เพิ่ม Settings เข้าในโมดูลที่โหลดด้วย
    const modules = ["Lead", "Car", "Finance", "Log", "Report", "Settings"];
    modules.forEach((m) => this.loadLocalStorage(m, this.data.ExampleData[m]));
  },
};

// --------------------------------------------------------
// 👀 Watchers — บันทึกอัตโนมัติเมื่อข้อมูลเปลี่ยน
// --------------------------------------------------------
["Lead", "Car", "Finance", "Log", "Report", "Settings"].forEach((type) => {
  Vue.watch(
    () => Store.data[`${type.toLowerCase()}Items`],
    () => Store.saveLocalStorage(type),
    { deep: true }
  );
});

// --------------------------------------------------------
// 🚀 โหลดข้อมูลทั้งหมดตอนเริ่มระบบ
// --------------------------------------------------------
Store.loadAllFromStorage();

// --------------------------------------------------------
// ✅ เปิดใช้งานทั่วระบบ
// --------------------------------------------------------
window.Store = Store;
