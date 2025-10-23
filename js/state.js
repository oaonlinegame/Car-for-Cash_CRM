// state.js
const AppState = {
  // UI states
  isMenuOpenFiltesterSearch: Vue.ref(false),
  isOpenModalLead: Vue.ref(false),

  searchRef: Vue.ref(null),
  leadTab: Vue.ref("basic"),

  // Hotkeys
  hotkeysEnabled: Vue.ref(true),
  hotkeyMap: Vue.reactive({
    openBot: "Alt+B",
    openLead: "Alt+L",
    closeAll: "Alt+C",
    // เพิ่มได้ เช่น saveForm: "Ctrl+S"
  }),

  // ตัวจัดการเกี่ยวกับ page
  page: Vue.ref(1), // หน้าปัจจุบัน
  itemsPerPage: Vue.ref(10), // จำนวนการ์ดต่อหน้า (ถูก bind กับ v-select)
  totalPages: Vue.ref(1), // จำนวนหน้าทั้งหมด
  pagedLeads: Vue.ref([]), //
};

window.AppState = AppState;
