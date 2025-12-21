// js/state.js
// --------------------------------------------------------
// 📘 ไฟล์นี้เก็บสถานะ (State) ทั้งหมดของระบบ
// --------------------------------------------------------

const AppState = {
  // --- UI States ---
  isMenuOpenFilterSearch: Vue.ref(false),
  isOpenModalLead: Vue.ref(false),
  isOpenSubContractDialog: Vue.ref(false),
  isOpenModalLeadAutoFill: Vue.ref(false),
  isOpenModalLog: Vue.ref(false),
  isOpenModalRecordCallResult: Vue.ref(false),
  isOpenModalCarSettings: Vue.ref(false),
  isOpenModalCarPriceSelector: Vue.ref(false),
  isOpenModalConfigSettings: Vue.ref(false),

  // --- Tabs ---
  callResultTab: Vue.ref("status"),
  carSettingTab: Vue.ref("price_list"),
  configSettingTab: Vue.ref("occupationItems"),
  leadTab: Vue.ref("leadInfo"),
  contractTab: Vue.ref("new"),
  contractInnerTab: Vue.ref("all"),
  contractPanels: Vue.ref([
    "info",
    "finance",
    "status",
    "asset",
    "history",
    "other",
  ]),

  // --- Forms ---
  recordCallForm: Vue.reactive({
    mainStatus: null,
    subStatus: null,
    appointmentDate: "",
    appointmentTime: "",
    note: "",
    location: "",
    receiverName: "",
    phoneBack: "",
    rejectReason: null,
    amount: null,
    contractId: "",
    product: null,
    offerAmount: null,
    interestRate: null,
    responseLevel: 3,
    crossSellProduct: null,
    crossSellNote: "",
    isCreateNewLead: false,
  }),

  newContractForm: Vue.reactive({}),

  // ========================================================
  // ⭐ Config Holders (รอรับค่าจาก boot.js)
  // ========================================================
  // หมวดรถยนต์
  carBrandItems: Vue.ref([]),
  carTypeItems: Vue.ref([]),
  gearboxItems: Vue.ref([]),
  fuelItems: Vue.ref([]),

  campaignItems: Vue.ref([]), // คอมเมนต์: รายการแคมเปญ
  carColorItems: Vue.ref([]), // คอมเมนต์: รายการสีรถ
  financeCompanyItems: Vue.ref([]), // คอมเมนต์: รายการไฟแนนซ์

  // หมวดลูกค้า
  titleItems: Vue.ref([]),
  leadStatusItems: Vue.ref([]),
  prospectStageItems: Vue.ref([]),
  ratingItems: Vue.ref([]),
  occupationItems: Vue.ref([]),
  sourceItems: Vue.ref([]),

  // หมวดสัญญาและการเงิน
  loanTypeItems: Vue.ref([]),
  contractTypeItems: Vue.ref([]),
  contractStatusItems: Vue.ref([]),
  accountStatusFilterItems: Vue.ref([]),
  gradeItems: Vue.ref([]),
  sortKeyItems: Vue.ref([]),

  // หมวดสินทรัพย์
  assetTypeItems: Vue.ref([]),
  insuranceTypeItems: Vue.ref([]),
  insuranceVehicleTypeItems: Vue.ref([]),

  // หมวดผลิตภัณฑ์และการขาย
  productItems: Vue.ref([]),
  crossSellItems: Vue.ref([]),
  rejectReasonItems: Vue.ref([]),
  callStatusConfig: Vue.ref([]),

  // --- Helper Computed ---
  currentSubStatusOptions: Vue.ref([]),
  currentInputRequirements: Vue.ref([]),

  // --- Search & Pagination ---
  searchRef: Vue.ref(null),
  searchQuery: Vue.ref(""),
  searchQueryDebounced: Vue.ref(""),
  hotkeysEnabled: Vue.ref(true),
  hotkeyMap: Vue.reactive({
    openLead: "Alt+L",
    closeAll: "Alt+C",
    openBot: "Alt+B",
  }),
  page: Vue.ref(1),
  itemsPerPage: Vue.ref(10),
  totalPages: Vue.ref(1),
  pagedLeads: Vue.ref([]),
  filteredLeads: Vue.ref([]),
  Switch_newCustomer: Vue.ref(false),

  // --- Methods ---
  resetContractUI() {
    this.contractTab.value = "new";
    this.contractInnerTab.value = "all";
    this.contractPanels.value = [
      "info",
      "finance",
      "status",
      "asset",
      "history",
      "other",
    ];
    if (typeof LeadApp?.resetNewContractForm === "function") {
      LeadApp.resetNewContractForm();
    }
  },
  onOpenLeadDialog() {
    if (!LeadApp.form.contracts || LeadApp.form.contracts.length === 0) {
      LeadApp.addEmptyContract();
    }
    AppState.leadTab.value = "contract-0";
  },
};

window.AppState = AppState;
