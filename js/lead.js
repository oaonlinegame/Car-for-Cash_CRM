// js/lead.js
// ------------------------------------------------------------
// 📘 โมดูล LeadApp: จัดการข้อมูลลูกค้า (Lead) + สัญญา (Contracts)
// ------------------------------------------------------------

const LeadApp = {
  // ----------------------------------------------------------
  // ⭐ form: ฟอร์มหลักของลูกค้า (Lead Form)
  // ----------------------------------------------------------
  form: Vue.reactive({
    id: null,
    firstName: "",
    nickName: "",
    phones: "",
    address: "",
    province: "",
    postalCode: "",
    // กำหนดค่าเริ่มต้นเป็นรายการแรกของ config (ถ้ามี)
    occupation: window.AppConfigDefaults?.occupationItems?.[0] || "",
    status: "ลูกค้าใหม่",
    isProspect: true,
    prospectStage: "สนใจ",
    rating: 3,
    note: "",
    createDate: "",
    contracts: [],
    // กำหนดค่าเริ่มต้นเป็นรายการแรกของ config (ถ้ามี)
    source: window.AppConfigDefaults?.sourceItems?.[0] || "",
  }),

  // ----------------------------------------------------------
  // ⭐ resetLeadForm()
  // รีเซ็ตฟอร์มลูกค้ากลับเป็นค่าเริ่มต้น
  // ----------------------------------------------------------
  resetLeadForm() {
    LeadApp.form.id = null;
    LeadApp.form.sourceType = "HO_LEAD";
    LeadApp.form.firstName = "";
    LeadApp.form.nickName = "";
    LeadApp.form.phones = "";
    LeadApp.form.address = "";
    LeadApp.form.province = "";
    LeadApp.form.postalCode = "";
    LeadApp.form.occupation =
      window.AppConfigDefaults?.occupationItems?.[0] || "";
    LeadApp.form.status = "ลูกค้าใหม่";
    LeadApp.form.isProspect = true;
    LeadApp.form.prospectStage = "สนใจ";
    LeadApp.form.rating = 3;
    LeadApp.form.note = "";
    LeadApp.form.createDate = new Date().toLocaleDateString("th-TH");
    LeadApp.form.contracts = [];
    LeadApp.form.source = window.AppConfigDefaults?.sourceItems?.[0] || "";
  },

  // ----------------------------------------------------------
  // ⭐ handleAddConfigItem
  // จัดการเพิ่มรายการ Config (Occupation/Source)
  // ----------------------------------------------------------
  async handleAddConfigItem(newVal, itemType) {
    const configMap = {
      occupation: {
        key: AppConfig.Keys.OCCUPATION,
        stateRef: AppState.occupationItems,
        prefix: "อาชีพ",
        formField: "occupation",
      },
      source: {
        key: AppConfig.Keys.SOURCE,
        stateRef: AppState.sourceItems,
        prefix: "แหล่งที่มา",
        formField: "source",
      },
    };

    const config = configMap[itemType];
    if (!config) {
      console.warn(
        `⚠ LeadApp.handleAddConfigItem: ไม่พบ Config Type "${itemType}"`
      );
      return;
    }

    await Utils.handleConfigItemAdd(
      newVal,
      config.key,
      config.stateRef,
      config.prefix
    );

    // อัปเดตค่าในฟอร์มให้ตรงกับที่เพิ่งเพิ่ม
    LeadApp.form[config.formField] = String(newVal || "").trim();
  },

  // ----------------------------------------------------------
  // ⭐ createEmptyContract()
  // สร้างโครงสร้างสัญญาเปล่า
  // ----------------------------------------------------------
  createEmptyContract() {
    return {
      contractId: "",
      leadId: "",
      type: "",
      carid: "",
      carbrandid: "",
      statusAccount: "ปกติ",
      statusOverdue: 0,
      contractDate: new Date().toISOString().substr(0, 10),
      expireDate: "",
      grade: "",
      campaign: "",
      loanAmount: 0,
      approvedAmount: 0,
      interestRate: 0,
      interestType: "",
      term: 0,
      installmentAmount: 0,
      installmentVAT: 0,
      paymentDay: 1,
      paidInstallments: 0,
      remainingInstallments: 0,
      OVD: 0,
      last3Payments: [],
      lastUpdate: "",
      outstanding: 0,
      unrealized: 0,
      closeAmount: 0,
      closeDate: "",
      financeName: "",
      remark: "",
      isSubContract: false,
      assets: [],
      subContracts: [],
    };
  },

  // ----------------------------------------------------------
  // ⭐ addEmptyContract()
  // เพิ่มสัญญาใหม่ในฟอร์มและเปิดแท็บ
  // ----------------------------------------------------------
  addEmptyContract() {
    const empty = LeadApp.createEmptyContract();

    if (!Array.isArray(LeadApp.form.contracts)) {
      LeadApp.form.contracts = [];
    }

    LeadApp.form.contracts.push(empty);
    const newIndex = LeadApp.form.contracts.length - 1;

    setTimeout(() => {
      if (window.AppState && AppState.leadTab) {
        AppState.leadTab.value = "contract-" + newIndex;
      }
    }, 50);

    // รีเซ็ต UI ส่วนย่อยของสัญญา
    if (window.AppState) {
      if (AppState.contractInnerTab) AppState.contractInnerTab.value = "all";
      if (AppState.contractPanels) {
        AppState.contractPanels.value = [
          "info",
          "finance",
          "status",
          "asset",
          "history",
          "other",
        ];
      }
    }

    if (window.AppNotifications)
      AppNotifications.show("เพิ่มแท็บสัญญาใหม่เรียบร้อย");
  },

  // ----------------------------------------------------------
  // ⭐ resetNewContractForm()
  // ----------------------------------------------------------
  resetNewContractForm() {
    if (!window.AppState || !AppState.newContractForm) return;
    const empty = LeadApp.createEmptyContract();
    Object.keys(empty).forEach((k) => {
      AppState.newContractForm[k] = empty[k];
    });
  },

  // ----------------------------------------------------------
  // ⭐ loadAll()
  // โหลดข้อมูลทั้งหมดจาก Dexie เข้า Store
  // ----------------------------------------------------------
  async loadAll() {
    try {
      const items = await AppDexie.lead.getAll();
      Store.setItems("Lead", items);
    } catch (err) {
      console.error("❌ LeadApp.loadAll() error:", err);
    }
  },

  // ----------------------------------------------------------
  // ⭐ add(formData)
  // เพิ่ม Lead ใหม่
  // ----------------------------------------------------------
  async add(formData) {
    try {
      const src = formData || LeadApp.form;
      const dataToSave = {
        ...src,
        id: crypto.randomUUID(),
        createDate: new Date().toLocaleDateString("th-TH"),
      };

      await AppDexie.lead.add(dataToSave);
      await LeadApp.loadAll();

      if (window.AppGui) AppGui.toggleMenu("isOpenModalLead", false);
      if (window.AppNotifications) AppNotifications.show("เพิ่ม Lead สำเร็จ");

      LeadApp.resetLeadForm();
    } catch (err) {
      console.error("❌ LeadApp.add() error:", err);
    }
  },

  // ----------------------------------------------------------
  // ⭐ update()
  // อัปเดต Lead เดิม
  // ----------------------------------------------------------
  async update() {
    try {
      if (!LeadApp.form.id) {
        console.warn("⚠ LeadApp.update() ถูกเรียก แต่ไม่มี id");
        return;
      }

      await AppDexie.lead.update(LeadApp.form.id, { ...LeadApp.form });
      await LeadApp.loadAll();

      if (window.AppGui) AppGui.toggleMenu("isOpenModalLead", false);
      if (window.AppNotifications)
        AppNotifications.show("อัปเดตข้อมูล Lead เรียบร้อย");
    } catch (err) {
      console.error("❌ LeadApp.update() error:", err);
    }
  },

  // ----------------------------------------------------------
  // ⭐ delete(id)
  // ลบ Lead
  // ----------------------------------------------------------
  async delete(id) {
    try {
      await AppDexie.lead.delete(id);
      await LeadApp.loadAll();
      if (window.AppNotifications)
        AppNotifications.show("ลบข้อมูล Lead เรียบร้อย");
    } catch (err) {
      console.error("❌ LeadApp.delete() error:", err);
    }
  },

  // ----------------------------------------------------------
  // ⭐ openEdit(lead)
  // เปิดฟอร์มแก้ไข
  // ----------------------------------------------------------
  openEdit(lead) {
    if (!lead) return;
    Object.assign(LeadApp.form, lead);
    if (!Array.isArray(LeadApp.form.contracts)) {
      LeadApp.form.contracts = [];
    }
    if (window.AppGui) AppGui.toggleMenu("isOpenModalLead", true);
  },
};

window.LeadApp = LeadApp;
