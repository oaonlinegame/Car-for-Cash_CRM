// app.js (เวอร์ชันแนะนำบน CDN)
const app = window.Vue.createApp({
  setup() {
    const { onMounted, onUnmounted } = window.Vue;
    // ลบ 'computed' ออกจาก Destructuring เนื่องจากย้ายไป gui.js แล้ว
    // เรียกใช้ AppGui.setupComputed() เพื่อกำหนด computed properties ใน AppState
    AppGui.setupComputed();

    onMounted(() => {
      window.addEventListener("keydown", Hotkey.handleKeyDown, true); // เรียกใช้ฟังค์ัชั่นเพื่อรอกดคีย์ลัด
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", Hotkey.handleKeyDown, true);
    });

    return {
      // state
      isMenuOpenFiltesterSearch: AppState.isMenuOpenFiltesterSearch, // เกี่ยวกับการ xxx
      isOpenModalLead: AppState.isOpenModalLead, // เกี่ยวกับการเปิดปิด modal
      searchRef: AppState.searchRef, // ตัวแปรจัดการเกี่ยวกับ search
      leadTab: AppState.leadTab, // xxx
      page: AppState.page,
      itemsPerPage: AppState.itemsPerPage,

      // ใช้ computed properties ที่ถูกกำหนดไว้ใน AppState (จาก AppGui.setupComputed)
      pagedLeads: AppState.pagedLeads,
      totalPages: AppState.totalPages,

      // actions
      toggleMenu: AppGui.toggleMenu,

      // store
      leadHeaders: Store.leadHeaders, // หัวตารางหน้าแรก
      leadItems: Store.leadItems, // ข้อมูลในส่วนของ lead

      // optional: เผย helper ให้หน้า Settings เรียกใช้
      setHotkey: Hotkey.setHotkey,
      removeHotkey: Hotkey.removeHotkey,
    };
  },
});

// สร้าง vuetify instance จาก global
const vuetify = window.Vuetify.createVuetify();

// ผูก Vuetify แล้วค่อย mount
app.use(vuetify).mount("#app");
