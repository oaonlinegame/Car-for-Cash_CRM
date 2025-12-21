// js/app.js
// --------------------------------------------------------
// 📘 Hub: ศูนย์กลางเชื่อมต่อ Module เข้ากับ Vue Template
// --------------------------------------------------------

const app = Vue.createApp({
  setup() {
    const { onMounted, onUnmounted, ref } = Vue;
    const searchBarRef = ref(null);

    onMounted(() => {
      window.addEventListener("keydown", Hotkey.handleKeyDown);
      window.AppGui.bindSearchRef(searchBarRef);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", Hotkey.handleKeyDown);
    });

    // ------------------------------------------------------------------------
    // ⭐ ฟังก์ชันช่วยเพิ่มตัวเลือก Dropdown (เรียกจาก index.html)
    // ------------------------------------------------------------------------
    const handleAddConfigItem = async (val, type) => {
      if (!val) return;
      const text = String(val).trim();
      if (!text) return;

      let targetRef = null;
      let configKey = "";
      let label = "";

      // กำหนดค่าตาม type ที่ส่งมาจาก HTML
      if (type === "occupation") {
        targetRef = AppState.occupationItems;
        configKey = "occupationItems";
        label = "อาชีพ";
      } else if (type === "source") {
        targetRef = AppState.sourceItems;
        configKey = "sourceItems";
        label = "แหล่งที่มา";
      }
      // สามารถเพิ่มเคสอื่นๆ ได้ที่นี่

      if (targetRef && configKey) {
        // เรียกใช้ Utils เพื่อเพิ่มค่าและบันทึกลง Dexie
        await Utils.handleConfigItemAdd(text, configKey, targetRef, label);
      }
    };

    return {
      // --- [สำคัญ] ส่งออก Utils และ AppState ให้ HTML เรียกใช้ได้โดยตรง ---
      Utils: window.Utils,
      AppState: window.AppState,
      handleAddConfigItem, // ✅ เพิ่มฟังก์ชันนี้เพื่อให้ HTML เรียกใช้ได้

      // --- หมวด UI State ---
      isMenuOpenFilterSearch: AppState.isMenuOpenFilterSearch,
      isOpenModalLead: AppState.isOpenModalLead,
      isOpenSubContractDialog: AppState.isOpenSubContractDialog,
      isOpenModalLeadAutoFill: AppState.isOpenModalLeadAutoFill,
      isOpenModalLog: AppState.isOpenModalLog,
      isOpenModalRecordCallResult: AppState.isOpenModalRecordCallResult,
      isOpenModalCarSettings: AppState.isOpenModalCarSettings,
      isOpenModalCarPriceSelector: AppState.isOpenModalCarPriceSelector,
      isOpenModalConfigSettings: AppState.isOpenModalConfigSettings,

      // --- หมวด Tabs ---
      leadTab: AppState.leadTab,
      callResultTab: AppState.callResultTab,
      carSettingTab: AppState.carSettingTab,
      configSettingTab: AppState.configSettingTab,
      Switch_newCustomer: AppState.Switch_newCustomer,

      // --- หมวด Config Items (Dropdowns) ---
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
      campaignItems: AppState.campaignItems, // เพิ่มแคมเปญ

      // [เพิ่มเติม] รายการใหม่ที่ส่งออกไป
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

      // --- หมวด Form Data & Computed (Record Call) ---
      recordCallForm: AppState.recordCallForm,
      currentSubStatusOptions: AppState.currentSubStatusOptions,
      currentInputRequirements: AppState.currentInputRequirements,
      saveRecordCallResult: () => AppGui.saveRecordCallResult(),
      resetRecordCallForm: () => AppGui.resetRecordCallForm(),

      // --- หมวด Search ---
      searchRef: AppState.searchRef,
      searchQuery: AppState.searchQuery,
      searchBarRef,

      // --- หมวด Pagination ---
      itemsPerPage: AppState.itemsPerPage,
      totalPages: AppState.totalPages,
      page: AppState.page,
      pagedLeads: AppState.pagedLeads,

      // --- หมวด Data Store ---
      leadItems: Store.data.leadItems,
      leadHeaders: Store.data.leadHeaders,

      // --- หมวด Logic & Tools ---
      leadForm: LeadApp.form,
      LeadApp: LeadApp,
      addLead: LeadApp.add,
      ContractApp: window.ContractApp,
      AssetApp: window.AssetApp,
      AppApi,
      AppGui,
      toggleMenu: AppGui.toggleMenu,
      closeAllMenus: AppGui.closeAllMenus,
      FileSystem,
      TestData,
      notify: AppNotifications.show,
      AppSetting,
      CarApp,
      CarLogic: CarApp,
      AppBot: window.AppBot,
    };
  },
});

window.SystemInit.registerComponents(app);
window.SystemInit.mountApp(app);
