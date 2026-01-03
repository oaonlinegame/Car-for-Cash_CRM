// js/app.js
// --------------------------------------------------------
// 🚀 Application Entry Point (จุดเริ่มต้นของแอปพลิเคชัน)
// --------------------------------------------------------

const app = Vue.createApp({
  setup() {
    // ========================================================================
    // 1. INITIALIZATION & DEPENDENCIES
    // ========================================================================
    const { onMounted, onUnmounted, ref } = Vue;
    const searchBarRef = ref(null);

    // ========================================================================
    // 2. DATA LOADING
    // ========================================================================

    // เริ่มกระบวนการโหลดข้อมูล Lead
    LeadApp.loadAll();

    // เริ่มต้นระบบการคำนวณค่าต่างๆ ของ GUI
    AppGui.setupComputed();
    // โหลดข้อมูล Master Data ทั้งหมด
    MasterData.load();

    // ========================================================================
    // 3. LIFECYCLE HOOKS
    // ========================================================================

    onMounted(() => {
      AppShortcut.init(); // เริ่มต้นระบบคีย์ลัดเมื่อแอปถูกเมานต์
      AppState.searchRef.value = searchBarRef; // ผูก Ref ของ Search Ba
      AppShortcut.cleanup(); // ถอนการติดตั้งระบบคีย์ลัดเมื่อแอปถูกยกเลิกการเมานต์
    });

    // ========================================================================
    // 4. CONTEXT EXPOSURE
    // ========================================================================

    return {
      // --- Global State ---
      ...AppState,

      // --- Data Views ---
      leadItems: Store.data.leadItems,
      leadHeaders: Store.data.leadHeaders,
      leadForm: LeadApp.form,

      // --- Domain Actions ---
      addLead: LeadApp.add,
      updateLead: LeadApp.updateLead,
      deleteLead: LeadApp.deleteLead,
      addEmptyContract: LeadApp.addEmptyContract,

      // --- UI Actions ---
      toggleMenu: AppGui.toggleMenu,
      closeAllMenus: AppGui.closeAllMenus,
      openContractTabPlus: AppGui.openContractTabPlus,

      // --- External Modules ---
      FileSystem,
      TestData,
      Store,
      CarApp,
      FinanceApp,
      LeadApp,
      AssetApp,
      AppGui,
      Utils,
      AppSetting,
      MasterData,
      AppBot,
      AppApi,

      // --- References ---
      searchBarRef,
    };
  },
});

// ========================================================================
// 5. APPLICATION MOUNTING
// ========================================================================
// เริ่มต้น Vuetify ผ่าน AppSetting (ส่วนนี้ยังต้องใช้ AppSetting อยู่ถูกต้องแล้ว)
AppSetting.init(app);

app.mount("#app");
