// gui.js
// --------------------------------------------------------
// 📘 ฟังก์ชันที่เกี่ยวกับการจัดการ UI (User Interface)
// เช่น เปิด/ปิดเมนู, เปลี่ยนหน้า, และคำนวณค่าต่าง ๆ ของหน้า
// --------------------------------------------------------

const { ref, reactive, watch, computed } = window.Vue; // ดึงเครื่องมือจาก Vue มาใช้

// --------------------------------------------------------
// 🧩 อ็อบเจ็กต์หลัก AppGui รวมฟังก์ชัน UI ทั้งหมด
// --------------------------------------------------------
const AppGui = {
  // ----------------------------------------------------
  // 🟢 toggleMenu: เปิด/ปิดเมนูหรือ modal ตามชื่อ key
  // ----------------------------------------------------
  toggleMenu(key, force) {
    if (!AppState[key]) return; // ถ้าไม่มี key นั้นใน AppState → ออก
    AppState[key].value =
      typeof force === "boolean" ? force : !AppState[key].value; // สลับสถานะหรือกำหนดตาม force
  },

  // ----------------------------------------------------
  // 🔴 closeAllMenus: ปิดทุกเมนูและ modal ที่เปิดอยู่
  // ----------------------------------------------------
  closeAllMenus: () => {
    Object.keys(AppState).forEach((key) => {
      // วนทุก key ใน AppState
      if (
        (key.startsWith("isMenuOpen") || key.startsWith("isOpenModal")) &&
        AppState[key]?.value === true // ถ้าเมนู/โมดัลนั้นเปิดอยู่
      ) {
        AppState[key].value = false; // ปิดเมนู/โมดัลนั้น
      }
    });
  },

  // ----------------------------------------------------
  // 📄 PagesComputed: ฟังก์ชันคำนวณข้อมูลการแบ่งหน้าและการกรอง
  // ----------------------------------------------------
  PagesComputed: () => {
    // ✅ 1. รายการที่ผ่านการกรอง
    AppState.filteredLeads = computed(() => {
      // รายการลีดที่กรองแล้ว
      const query = AppState.searchQuery?.value || ""; // ดึงคำค้นจาก state
      return Utils.filterLeads(Store.data.leadItems, query); // ใช้ฟังก์ชันกรองภายใน
    });

    // ✅ 2. คำนวณจำนวนหน้าทั้งหมด
    AppState.totalPages = computed(() => {
      // จำนวนหน้าทั้งหมด
      const total = AppState.filteredLeads.value.length; // จำนวนรายการที่กรองแล้ว
      const perPage = AppState.itemsPerPage.value; // จำนวนต่อหน้า
      if (perPage === "All") return 1; // แสดงทั้งหมดถ้าเลือก All
      const num = Number(perPage); // แปลงเป็นตัวเลข
      return Math.max(Math.ceil(total / num), 1); // คำนวณจำนวนหน้า
    });

    // ✅ 3. ดึงรายการเฉพาะหน้าปัจจุบัน
    AppState.pagedLeads = computed(() => {
      // รายการลีดในหน้าปัจจุบัน
      const page = AppState.page.value; // หน้าปัจจุบัน
      const perPage = AppState.itemsPerPage.value; // จำนวนต่อหน้า
      const all = AppState.filteredLeads.value; // รายการที่กรองแล้วทั้งหมด
      if (perPage === "All") return all; // แสดงทั้งหมดถ้าเลือก All
      const num = Number(perPage); // แปลงเป็นตัวเลข
      const start = (page - 1) * num; // ตำแหน่งเริ่มต้น
      const end = start + num; // ตำแหน่งสิ้นสุด
      return all.slice(start, end); // ตัดเอาเฉพาะหน้าปัจจุบัน
    });
  },

  // ----------------------------------------------------
  // 👀 setupWatchers: เฝ้าดูค่าที่เปลี่ยนแปลงอัตโนมัติ
  // ----------------------------------------------------
  setupWatchers: () => {
    watch(AppState.itemsPerPage, () => (AppState.page.value = 1)); // เปลี่ยนจำนวนต่อหน้า → กลับหน้าแรก
    watch(AppState.searchQuery, () => (AppState.page.value = 1)); // ค้นหาใหม่ → กลับหน้าแรก
    watch(AppState.page, (n) => console.log("เปลี่ยนหน้าเป็น:", n)); // debug log
  },

  // ----------------------------------------------------
  // 🧩 setupComputed: รวม computed และ watchers ให้ app.js เรียกง่าย
  // ----------------------------------------------------
  setupComputed: () => {
    AppGui.PagesComputed(); // ตั้ง computed
    AppGui.setupWatchers(); // ตั้ง watchers
  },
};

// --------------------------------------------------------
// ✅ export ออกไปให้ไฟล์อื่นเรียกใช้ได้
// --------------------------------------------------------
window.AppGui = AppGui;
