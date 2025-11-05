// app.js
// --------------------------------------------------------
// 📘 ไฟล์นี้เป็นศูนย์กลาง (Hub) ของระบบ Vue 3 + Vuetify
// ใช้รวมทุกโมดูล (state, gui, store, shortcutKey ฯลฯ) เข้าด้วยกัน
// โดยไม่ได้เป็นผู้เรียกใช้ฟังก์ชันโดยตรง แต่เปิดให้ Vue instance เข้าถึงได้ทั้งหมด
// --------------------------------------------------------

// ✅ สร้าง Vue Application หลัก
const app = window.Vue.createApp({
  setup() {
    // ----------------------------------------------------
    // 📦 ดึงฟังก์ชันที่จำเป็นจาก Vue (ผ่าน global)
    // ----------------------------------------------------
    const { onMounted, onUnmounted } = window.Vue; // ฟังก์ชัน lifecycle ของ Vue

    // ----------------------------------------------------
    // ⚙️ เรียกใช้ setupComputed() เพื่อกำหนด computed และ watchers ต่าง ๆ
    // ----------------------------------------------------
    AppGui.setupComputed(); // เรียกให้ระบบคำนวณค่าหน้า, กรองข้อมูล และเฝ้าดูการเปลี่ยนแปลง

    // ----------------------------------------------------
    // ⌨️ ตั้ง event listener สำหรับ Hotkey (คีย์ลัด)
    // ----------------------------------------------------
    onMounted(() => {
      // เมื่อ component ถูก mount → เริ่มฟังปุ่มคีย์ลัด
      window.addEventListener("keydown", Hotkey.handleKeyDown, true);
    });

    onUnmounted(() => {
      // เมื่อ component ถูกถอด → ยกเลิกฟังปุ่มคีย์ลัด
      window.removeEventListener("keydown", Hotkey.handleKeyDown, true);
    });

    // ----------------------------------------------------
    // 🎯 คืนค่าทุก state / computed / action ที่ต้องใช้ใน Template
    // ----------------------------------------------------
    return {
      // ------------------------------------------------
      // 🧭 State พื้นฐานจาก AppState
      // ------------------------------------------------
      isMenuOpenFiltesterSearch: AppState.isMenuOpenFiltesterSearch, // สถานะเปิด/ปิดเมนูค้นหาขั้นสูง
      isOpenModalLead: AppState.isOpenModalLead, // สถานะเปิด/ปิด modal lead
      searchRef: AppState.searchRef, // ตัวอ้างอิงของช่องค้นหา (ไว้ใช้กับ v-menu)
      leadTab: AppState.leadTab, // แท็บปัจจุบันใน modal lead
      page: AppState.page, // หน้าปัจจุบันของ pagination
      itemsPerPage: AppState.itemsPerPage, // จำนวนรายการต่อหน้า (หรือ 'All')
      searchQuery: AppState.searchQuery, // ✅ เพิ่มบรรทัดนี้: ข้อความในช่องค้นหาหลัก (v-model)

      // ------------------------------------------------
      // 📄 Computed (ค่าที่คำนวณอัตโนมัติ)
      // ------------------------------------------------
      pagedLeads: AppState.pagedLeads, // รายการลีดในหน้าปัจจุบัน (หลังกรอง + แบ่งหน้า)
      totalPages: AppState.totalPages, // จำนวนหน้าทั้งหมด

      // ------------------------------------------------
      // 🧩 Actions (ฟังก์ชันที่ใช้ใน template)
      // ------------------------------------------------
      toggleMenu: AppGui.toggleMenu, // ฟังก์ชันเปิด/ปิดเมนูหรือ modal ตามชื่อ key

      // ------------------------------------------------
      // 💾 Store (ข้อมูลจำลอง / master data)
      // ------------------------------------------------
      leadHeaders: Store.leadHeaders, // หัวตารางของข้อมูล lead
      leadItems: Store.leadItems, // รายการ lead ทั้งหมดจาก store

      // ------------------------------------------------
      // 🎹 Hotkey (ระบบคีย์ลัด)
      // ------------------------------------------------
      setHotkey: Hotkey.setHotkey, // ฟังก์ชันเพิ่ม/แก้คีย์ลัด
      removeHotkey: Hotkey.removeHotkey, // ฟังก์ชันลบคีย์ลัด
    };
  },
});

// --------------------------------------------------------
// 🎨 สร้าง Vuetify instance จาก global แล้วผูกกับ Vue app
// --------------------------------------------------------
const vuetify = window.Vuetify.createVuetify(); // สร้าง instance ของ Vuetify

// --------------------------------------------------------
// 🚀 Mount แอปหลักเข้ากับ #app ใน index.html
// --------------------------------------------------------
app.use(vuetify).mount("#app"); // ใช้ Vuetify แล้ว mount เข้ากับ DOM จริง
