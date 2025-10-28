// app.js (เวอร์ชันแนะนำบน CDN)
const app = window.Vue.createApp({
  setup() {
    const { onMounted, onUnmounted } = window.Vue;

    // เรียกใช้ AppGui.PagesComputed() เพื่อกำหนด computed properties ใน AppState
    AppGui.PagesComputed();

    // เรียกใช้ AppGui.setupWatchers() เพื่อตั้งค่าตัวติดตามการเปลี่ยนแปลง (Watcher)
    // สำหรับการรีเซ็ตหน้าเมื่อมีการค้นหาหรือเปลี่ยนจำนวนรายการต่อหน้า
    AppGui.setupWatchers();

    onMounted(() => {
      // ตั้งค่า Event Listener สำหรับปุ่มลัด (Hotkeys)
      window.addEventListener("keydown", Hotkey.handleKeyDown, true);
    });

    onUnmounted(() => {
      // ล้าง Event Listener เมื่อ Component ถูกทำลาย
      window.removeEventListener("keydown", Hotkey.handleKeyDown, true);
    });

    //-----------------------------------------------------------------------------------------

    //-----------------------------------------------------------------------------------------

    return {
      // state (ตัวแปรสถานะที่ใช้ใน Template)
      isMenuOpenFiltesterSearch: AppState.isMenuOpenFiltesterSearch, // สถานะเปิด/ปิดเมนูค้นหาและตัวกรอง
      isOpenModalLead: AppState.isOpenModalLead, // สถานะเปิด/ปิด Modal จัดการ Lead
      searchRef: AppState.searchRef, // ตัวแปร Ref สำหรับอ้างอิง Element ค้นหา
      leadTab: AppState.leadTab, // Tab ที่กำลังถูกเลือก
      page: AppState.page, // หน้าปัจจุบัน
      itemsPerPage: AppState.itemsPerPage, // จำนวนรายการต่อหน้า
      searchInput: AppState.searchQuery, // คำค้นหาปัจจุบัน

      // Computed properties (ค่าที่คำนวณอัตโนมัติ)
      pagedLeads: AppState.pagedLeads, // รายการ Lead สำหรับหน้าที่กำลังแสดง (ถูกกรองและแบ่งหน้าแล้ว)
      totalPages: AppState.totalPages, // จำนวนหน้าทั้งหมด

      // actions (ฟังก์ชันสำหรับควบคุม UI)
      toggleMenu: AppGui.toggleMenu,
      getRatingFromEvent: window.AppGui.getRatingFromEvent, // 🎯 แก้ไข: ดึงจาก gui.js

      // store (ข้อมูลหลัก)
      leadHeaders: Store.leadHeaders, // หัวตารางหน้าแรก
      leadItems: Store.leadItems, // ข้อมูลในส่วนของ lead

      // business logic
      // Expose ฟังก์ชัน Generic ใหม่
      getGenericStarColor: window.LeadLogic.getGenericStarColor,
      setGenericRating: window.LeadLogic.setGenericRating,

      // optional: เผย helper ให้หน้า Settings เรียกใช้
      setHotkey: Hotkey.setHotkey,
      removeHotkey: Hotkey.removeHotkey,

      //-------------------------------------------------------------------------------
    };
  },
});

// สร้าง vuetify instance จาก global
const vuetify = window.Vuetify.createVuetify();

// ผูก Vuetify กับ app
app.use(vuetify);

// Mount app เข้ากับ #app
app.mount("#app");
