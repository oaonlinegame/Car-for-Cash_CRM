// js/lead.js
// ------------------------------------------------------------
// 📘 โมดูล LeadApp: จัดการข้อมูลลูกค้า (Lead Management)
// ------------------------------------------------------------

const LeadApp = {
  // เก็บข้อมูลฟอร์ม (Reactive)
  form: Vue.reactive({
    id: null,
    firstName: "",
    nickName: "",
    phones: "",
    phone2: "",
    address: "",
    province: "",
    postalCode: "",
    occupation: "",
    status: "ลูกค้าใหม่",
    isProspect: false,
    prospectStage: "สนใจ",
    rating: 3,
    note: "",
    createDate: "",
    contracts: [],
    source: "",
    assets: [], // เก็บรายการทรัพย์สิน
  }),

  // ----------------------------------------------------------
  // ⭐ createEmpty()
  // หน้าที่: สร้าง Object ข้อมูล Lead เปล่า พร้อมค่าเริ่มต้น
  // ----------------------------------------------------------
  createEmpty() {
    return {
      id: crypto.randomUUID(),
      firstName: "",
      nickName: "",
      phones: "",
      phone2: "",
      address: "",
      province: "",
      postalCode: "",
      occupation: "",
      status: "ลูกค้าใหม่",
      isProspect: false,
      prospectStage: "สนใจ",
      rating: 3,
      note: "",
      createDate: new Date().toLocaleDateString("th-TH"),
      contracts: [],
      source: "",
      // ✅ สร้างสินทรัพย์เปล่า 1 รายการทันที (เรียก AssetApp)
      assets: [window.AssetApp.createEmpty()],
    };
  },

  // ----------------------------------------------------------
  // ⭐ resetLeadForm()
  // หน้าที่: รีเซ็ตฟอร์มเป็นค่าเริ่มต้น
  // ----------------------------------------------------------
  resetLeadForm() {
    const empty = this.createEmpty();
    Object.assign(this.form, empty);

    if (window.AppState) AppState.leadTab.value = "leadInfo";
    console.log("🔄 LeadApp: รีเซ็ตฟอร์มเรียบร้อย");
  },

  // ----------------------------------------------------------
  // ⭐ openNew()
  // หน้าที่: เปิดหน้าสร้างลูกค้าใหม่
  // ----------------------------------------------------------
  openNew() {
    this.resetLeadForm();
    if (window.AppGui) window.AppGui.toggleMenu("isOpenModalLead", true);
  },

  // ----------------------------------------------------------
  // ⭐ loadAll, add, update, delete (CRUD)
  // ----------------------------------------------------------
  async loadAll() {
    if (window.AppDexie) {
      const items = await AppDexie.lead.getAll();
      Store.setItems("Lead", items);
    }
  },

  async add(formData) {
    const data = { ...formData, id: crypto.randomUUID() };
    await AppDexie.lead.add(data);
    await this.loadAll();
    if (window.AppGui) AppGui.toggleMenu("isOpenModalLead", false);
    this.resetLeadForm();
  },

  // ฟังก์ชันอื่นๆ (update, delete, etc.) คงเดิม...
  async update() {
    /* ...เหมือนเดิม... */
  },
  async delete(id) {
    /* ...เหมือนเดิม... */
  },

  openEdit(lead) {
    Object.assign(this.form, lead);
    // กัน Error กรณีข้อมูลเก่าไม่มี Array
    if (!Array.isArray(this.form.assets)) this.form.assets = [];
    if (!Array.isArray(this.form.contracts)) this.form.contracts = [];
    if (window.AppGui) AppGui.toggleMenu("isOpenModalLead", true);
  },
};

window.LeadApp = LeadApp;
