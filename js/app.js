// js/app.js
// --------------------------------------------------------
// 📘 Hub: ศูนย์กลางเชื่อมต่อ Module เข้ากับ Vue Template
// --------------------------------------------------------

const app = Vue.createApp({
  setup() {
    const { onMounted, onUnmounted, ref } = Vue;
    const searchBarRef = ref(null);

    // คอมเมนต์: เมื่อ Component ถูกติดตั้ง
    onMounted(() => {
      // คอมเมนต์: ลงทะเบียนเหตุการณ์กดคีย์บอร์ดสำหรับคีย์ลัด
      window.addEventListener("keydown", Hotkey.handleKeyDown);
      // คอมเมนต์: ผูก Reference ช่องค้นหากับระบบ GUI
      window.AppGui.bindSearchRef(searchBarRef);
    });

    // คอมเมนต์: เมื่อ Component ถูกทำลาย
    onUnmounted(() => {
      window.removeEventListener("keydown", Hotkey.handleKeyDown);
    });

    // ------------------------------------------------------------------------
    // ⭐ ฟังก์ชันช่วยเพิ่มตัวเลือก Dropdown (เรียกจาก index.html)
    // ------------------------------------------------------------------------
    const handleAddConfigItem = async (val, type) => {
      // คอมเมนต์: ฟังก์ชันรับค่าจากช่อง Combobox เพื่อบันทึกเป็นตัวเลือกถาวร
      if (!val) return;
      const text = String(val).trim();
      if (!text) return;

      let targetRef = null;
      let configKey = "";
      let label = "";

      // คอมเมนต์: กำหนดค่าตามชนิดข้อมูลที่ส่งมาจาก HTML
      if (type === "occupation") {
        targetRef = AppState.occupationItems;
        configKey = "occupationItems";
        label = "อาชีพ";
      } else if (type === "source") {
        targetRef = AppState.sourceItems;
        configKey = "sourceItems";
        label = "แหล่งที่มา";
      }

      if (targetRef && configKey) {
        // คอมเมนต์: เรียกใช้ Utils เพื่อเพิ่มค่าและบันทึกลงฐานข้อมูล Dexie
        await Utils.handleConfigItemAdd(text, configKey, targetRef, label);
      }
    };

    return {
      // --- [สำคัญ] ส่งออก Utils และ AppState ให้ HTML เรียกใช้ได้โดยตรง ---
      Utils: window.Utils,
      AppState: window.AppState,
      handleAddConfigItem,

      // --- หมวด UI State (Modal เปิด/ปิด) ---
      isMenuOpenFilterSearch: AppState.isMenuOpenFilterSearch,
      isOpenModalLead: AppState.isOpenModalLead,
      isOpenSubContractDialog: AppState.isOpenSubContractDialog,
      isOpenModalLeadAutoFill: AppState.isOpenModalLeadAutoFill,
      isOpenModalLog: AppState.isOpenModalLog,
      isOpenModalRecordCallResult: AppState.isOpenModalRecordCallResult,
      isOpenModalCarSettings: AppState.isOpenModalCarSettings,
      isOpenModalCarPriceSelector: AppState.isOpenModalCarPriceSelector,
      isOpenModalConfigSettings: AppState.isOpenModalConfigSettings,

      // --- หมวด Tabs (การเปลี่ยนหน้าภายใน) ---
      leadTab: AppState.leadTab,
      callResultTab: AppState.callResultTab,
      carSettingTab: AppState.carSettingTab,
      configSettingTab: AppState.configSettingTab,
      Switch_newCustomer: AppState.Switch_newCustomer,

      // --- หมวด Config Items (รายการตัวเลือกใน Dropdown) ---
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

      // --- หมวดข้อมูลเพิ่มเติม ---
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

      // --- หมวด Form Data & Logic (การบันทึกผลการโทร) ---
      recordCallForm: AppState.recordCallForm,
      currentSubStatusOptions: AppState.currentSubStatusOptions,
      currentInputRequirements: AppState.currentInputRequirements,
      // ✅ เปลี่ยนไปเรียกใช้ผ่าน LogApp แทน GUI
      saveRecordCallResult: () => window.LogApp.saveCallResult(),
      resetRecordCallForm: () => AppGui.resetRecordCallForm(),

      // --- หมวดการค้นหาและแบ่งหน้า (Search & Pagination) ---
      searchRef: AppState.searchRef,
      searchQuery: AppState.searchQuery,
      searchBarRef,
      itemsPerPage: AppState.itemsPerPage,
      totalPages: AppState.totalPages,
      page: AppState.page,
      pagedLeads: AppState.pagedLeads,

      // --- หมวดรายการข้อมูล (Data Store) ---
      leadItems: Store.data.leadItems,
      leadHeaders: Store.data.leadHeaders,

      // --- หมวด Modules & Logic (ตัวจัดการระบบ) ---
      leadForm: LeadApp.form,
      LeadApp: LeadApp,
      addLead: LeadApp.add,
      ContractApp: window.ContractApp,
      LogApp: window.LogApp, // คอมเมนต์: ส่งออก LogApp ใหม่
      AssetApp: window.AssetApp,
      AppApi: window.AppApi,
      AppGui: window.AppGui,
      toggleMenu: AppGui.toggleMenu,
      closeAllMenus: AppGui.closeAllMenus,
      FileSystem: window.FileSystem,
      TestData: window.TestData,
      notify: window.AppNotifications.show,
      AppSetting: window.AppSetting,
      CarApp: window.CarApp,
      CarLogic: window.CarApp,
      AppBot: window.AppBot,
    };
  },
});

// คอมเมนต์: ลงทะเบียนส่วนประกอบและเริ่มต้นการทำงานของแอปพลิเคชัน
window.SystemInit.registerComponents(app);
window.SystemInit.mountApp(app);
