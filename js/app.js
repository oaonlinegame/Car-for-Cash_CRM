// js/app.js
// --------------------------------------------------------
// 📘 Hub: ศูนย์กลางเชื่อมต่อ Module เข้ากับ Vue Template
// --------------------------------------------------------
// หน้าที่ถาวร:
// 1. สร้าง Vue Instance
// 2. เชื่อมต่อ (Map) Singleton Services เข้ากับ Template
// 3. ห้ามมี Business Logic ใดๆ ในไฟล์นี้เด็ดขาด
// --------------------------------------------------------

const app = Vue.createApp({
  setup() {
    const { onMounted, onUnmounted, ref } = Vue;
    const searchBarRef = ref(null);

    // คอมเมนต์: เมื่อ Component ถูกติดตั้ง (Lifecycle Hook)
    onMounted(() => {
      // คอมเมนต์: ลงทะเบียนเหตุการณ์กดคีย์บอร์ดสำหรับคีย์ลัด (Delegate ไปยัง Hotkey System)
      window.addEventListener("keydown", Hotkey.handleKeyDown);

      // คอมเมนต์: ผูก Reference ช่องค้นหากับระบบ GUI (Delegate ไปยัง AppGui)
      window.AppGui.bindSearchRef(searchBarRef);
    });

    // คอมเมนต์: เมื่อ Component ถูกทำลาย (Lifecycle Hook)
    onUnmounted(() => {
      // คอมเมนต์: ยกเลิกการลงทะเบียนเหตุการณ์คีย์บอร์ด
      window.removeEventListener("keydown", Hotkey.handleKeyDown);
    });

    // ------------------------------------------------------------------------
    // 🔌 Return Context to Template
    // ------------------------------------------------------------------------
    return {
      // ========================================================
      // 🏗️ Core Services (Singleton Objects)
      // ========================================================
      Utils: window.Utils,
      AppState: window.AppState,
      AppApi: window.AppApi,
      AppGui: window.AppGui,
      AppBot: window.AppBot,
      AppSetting: window.AppSetting,
      FileSystem: window.FileSystem,

      // ========================================================
      // 🧠 Business Logic Services
      // ========================================================
      LeadApp: window.LeadApp,
      ContractApp: window.ContractApp,
      LogApp: window.LogApp,
      AssetApp: window.AssetApp,
      CarApp: window.CarApp,
      CarLogic: window.CarApp, // คอมเมนต์: Alias เพื่อรองรับโค้ดเก่าใน HTML
      TestData: window.TestData,

      // ========================================================
      // 🤝 Helper Delegates (ส่งต่องานไปยัง Service โดยตรง)
      // ========================================================
      // คอมเมนต์: ส่งต่อการเพิ่ม Config Item ไปยัง AppSetting (ย้าย Logic ออกจาก app.js แล้ว)
      handleAddConfigItem: (val, type) =>
        window.AppSetting.handleQuickAdd(val, type),

      // คอมเมนต์: ส่งต่อการบันทึกผลการโทรไปยัง LogApp
      saveRecordCallResult: () => window.LogApp.saveCallResult(),

      // คอมเมนต์: ส่งต่อการรีเซ็ตฟอร์มไปยัง AppGui
      resetRecordCallForm: () => window.AppGui.resetRecordCallForm(),

      // คอมเมนต์: ฟังก์ชันเปิด/ปิดเมนูผ่าน AppGui
      toggleMenu: window.AppGui.toggleMenu,
      closeAllMenus: window.AppGui.closeAllMenus,

      // คอมเมนต์: ระบบแจ้งเตือน
      notify: window.AppNotifications.show,

      // ========================================================
      // 🖼️ UI State & Data Binding (เชื่อมต่อ AppState เข้า Template)
      // ========================================================

      // --- Search & Pagination ---
      searchRef: AppState.searchRef,
      searchQuery: AppState.searchQuery,
      searchBarRef,
      itemsPerPage: AppState.itemsPerPage,
      totalPages: AppState.totalPages,
      page: AppState.page,
      pagedLeads: AppState.pagedLeads,

      // --- Tabs State ---
      leadTab: AppState.leadTab,
      callResultTab: AppState.callResultTab,
      carSettingTab: AppState.carSettingTab,
      configSettingTab: AppState.configSettingTab,
      Switch_newCustomer: AppState.Switch_newCustomer,

      // --- Modal State (Boolean) ---
      isMenuOpenFilterSearch: AppState.isMenuOpenFilterSearch,
      isOpenModalLead: AppState.isOpenModalLead,
      isOpenSubContractDialog: AppState.isOpenSubContractDialog,
      isOpenModalLeadAutoFill: AppState.isOpenModalLeadAutoFill,
      isOpenModalLog: AppState.isOpenModalLog,
      isOpenModalRecordCallResult: AppState.isOpenModalRecordCallResult,
      isOpenModalCarSettings: AppState.isOpenModalCarSettings,
      isOpenModalCarPriceSelector: AppState.isOpenModalCarPriceSelector,
      isOpenModalConfigSettings: AppState.isOpenModalConfigSettings,

      // --- Form Data Binding ---
      recordCallForm: AppState.recordCallForm,
      currentSubStatusOptions: AppState.currentSubStatusOptions,
      currentInputRequirements: AppState.currentInputRequirements,
      leadForm: window.LeadApp.form, // ผูกกับ Reactive Form ของ LeadApp โดยตรง
      addLead: window.LeadApp.add, // ผูกฟังก์ชัน add

      // --- Data Store Access ---
      leadItems: Store.data.leadItems,
      leadHeaders: Store.data.leadHeaders,

      // ========================================================
      // ⚙️ Configuration Items (Dropdown Lists from AppState)
      // ========================================================
      occupationItems: AppState.occupationItems,
      sourceItems: AppState.sourceItems,
      callStatusConfig: AppState.callStatusConfig,
      rejectReasonItems: AppState.rejectReasonItems,
      productItems: AppState.productItems,
      crossSellItems: AppState.crossSellItems,
      titleItems: AppState.titleItems,
      carTypeItems: AppState.carTypeItems,
      gearboxItems: AppState.gearboxItems,
      fuelItems: AppState.fuelItems,
      carBrandItems: AppState.carBrandItems,
      campaignItems: AppState.campaignItems,

      // --- Static Configs ---
      leadStatusItems: AppState.leadStatusItems,
      prospectStageItems: AppState.prospectStageItems,
      ratingItems: AppState.ratingItems,
      loanTypeItems: AppState.loanTypeItems,
      accountStatusFilterItems: AppState.accountStatusFilterItems,
      contractStatusItems: AppState.contractStatusItems,
      assetTypeItems: AppState.assetTypeItems,
      insuranceTypeItems: AppState.insuranceTypeItems,
      insuranceVehicleTypeItems: AppState.insuranceVehicleTypeItems,
      contractTypeItems: AppState.contractTypeItems,
      gradeItems: AppState.gradeItems,
      sortKeyItems: AppState.sortKeyItems,
    };
  },
});

// คอมเมนต์: ลงทะเบียนส่วนประกอบและเริ่มต้นการทำงานของแอปพลิเคชัน
window.SystemInit.registerComponents(app);
window.SystemInit.mountApp(app);
