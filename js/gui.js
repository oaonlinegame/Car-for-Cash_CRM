// gui.js
// --------------------------------------------------------
// 📘 ฟังก์ชันที่เกี่ยวกับการจัดการ UI (User Interface)
// เช่น เปิด/ปิดเมนู, เปลี่ยนหน้า, และคำนวณค่าต่าง ๆ ของหน้า
// --------------------------------------------------------

const { ref, reactive, watch, computed } = window.Vue; // ดึงเครื่องมือจาก Vue

// --------------------------------------------------------
// 🧩 อ็อบเจ็กต์หลัก AppGui รวมฟังก์ชัน UI ทั้งหมด
// --------------------------------------------------------
const AppGui = {
  // ----------------------------------------------------
  // 🟢 toggleMenu: เปิด/ปิดเมนูหรือ modal ตามชื่อ key
  // ----------------------------------------------------
  toggleMenu(key, force) {
    if (!AppState[key]) return;
    AppState[key].value =
      typeof force === "boolean" ? force : !AppState[key].value;
  },

  // ----------------------------------------------------
  // 🔴 closeAllMenus: ปิดทุกเมนูและ modal ที่เปิดอยู่
  // ----------------------------------------------------
  closeAllMenus: () => {
    Object.keys(AppState).forEach((key) => {
      if (
        (key.startsWith("isMenuOpen") || key.startsWith("isOpenModal")) &&
        AppState[key]?.value === true
      ) {
        AppState[key].value = false;
      }
    });
  },

  // ----------------------------------------------------
  // 📄 PagesComputed: ฟังก์ชันคำนวณข้อมูลการแบ่งหน้าและการกรอง
  // ----------------------------------------------------
  PagesComputed: () => {
    // ✅ 1. รายการที่ผ่านการกรอง
    AppState.filteredLeads = computed(() => {
      const query = AppState.searchQuery?.value || "";
      return Utils.filterLeads(Store.data.leadItems, query);
    });

    // ✅ 2. คำนวณจำนวนหน้าทั้งหมด
    AppState.totalPages = computed(() => {
      const total = AppState.filteredLeads.value.length;
      const perPage = AppState.itemsPerPage.value;
      if (perPage === "All") return 1;
      const num = Number(perPage);
      return Math.max(Math.ceil(total / num), 1);
    });

    // ✅ 3. ดึงรายการเฉพาะหน้าปัจจุบัน
    AppState.pagedLeads = computed(() => {
      const page = AppState.page.value;
      const perPage = AppState.itemsPerPage.value;
      const all = AppState.filteredLeads.value;
      if (perPage === "All") return all;
      const num = Number(perPage);
      const start = (page - 1) * num;
      const end = start + num;
      return all.slice(start, end);
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
    AppGui.PagesComputed();
    AppGui.setupWatchers();
  },
};

// --------------------------------------------------------
// ✅ export ออกไปให้ไฟล์อื่นเรียกใช้ได้
// --------------------------------------------------------
window.AppGui = AppGui;
