// js/app.js
const app = Vue.createApp({
  setup() {
    const { onMounted, onUnmounted, ref } = Vue;
    const searchBarRef = ref(null);

    // Initial Data Loading
    LeadApp.loadAll();
    AppGui.setupComputed();

    onMounted(() => {
      // Setup Keyboard Shortcuts
      AppShortcut.init();

      // Bind Search Ref
      AppState.searchRef.value = searchBarRef;

      console.log("🚀 App Started (Zero-Logic Hub)");
    });

    onUnmounted(() => {
      AppShortcut.cleanup();
    });

    // Return อย่างเดียว (Pass-through)
    return {
      // State
      ...AppState,

      // Data Views
      leadItems: Store.data.leadItems,
      leadHeaders: Store.data.leadHeaders,
      leadForm: LeadApp.form,

      // Actions
      addLead: LeadApp.add,
      updateLead: LeadApp.updateLead,
      deleteLead: LeadApp.deleteLead,
      addEmptyContract: LeadApp.addEmptyContract,

      // UI Actions
      toggleMenu: AppGui.toggleMenu,
      closeAllMenus: AppGui.closeAllMenus,
      openContractTabPlus: AppGui.openContractTabPlus,

      // Modules
      FileSystem,
      TestData,
      AppApi,
      CarApp,
      FinanceApp,
      LeadApp,
      AppGui,

      // Refs
      searchBarRef,
    };
  },
});

AppSetting.init(app);
app.mount("#app");
