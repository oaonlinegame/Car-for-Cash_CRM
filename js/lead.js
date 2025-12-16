// js/lead.js
// ------------------------------------------------------------
// 📘 โมดูล LeadApp: จัดการข้อมูลลูกค้า (Lead) + สัญญา (Contracts) + สินทรัพย์ (Assets)
// ------------------------------------------------------------
// ทำหน้าที่:
// - เก็บสถานะฟอร์ม (form) ของลูกค้า
// - จัดการ CRUD (Create, Read, Update, Delete) กับ Dexie
// - จัดการ Logic ของสัญญา (Contracts) และสินทรัพย์ (Assets)
// ------------------------------------------------------------

const LeadApp = {
  // ----------------------------------------------------------
  // ⭐ form: ฟอร์มหลักของลูกค้า (Lead Form)
  // ----------------------------------------------------------
  // ใช้ Vue.reactive เพื่อให้ UI อัปเดตทันทีเมื่อค่าเปลี่ยน
  // ----------------------------------------------------------
  form: Vue.reactive({
    id: null, //    รหัส Lead (ถ้ามี = แก้ไข, ถ้า null = สร้างใหม่)
    firstName: "", //    ชื่อลูกค้า / บริษัท
    nickName: "", //    ชื่อเล่น / ผู้ติดต่อ
    phones: "", //    เบอร์โทรศัพท์หลัก
    phone2: "", //      เบอร์โทรศัพท์สำรอง
    address: "", //    ที่อยู่
    province: "", //    จังหวัด
    postalCode: "", //    รหัสไปรษณีย์
    occupation: "", //    อาชีพ (จะถูกเซ็ตค่าเริ่มต้นใน resetLeadForm)
    status: "ลูกค้าใหม่", //    สถานะลูกค้า (Default: ลูกค้าใหม่)
    isProspect: false, //    เป็นผู้มุ่งหวังหรือไม่ (True = ยังไม่มีสัญญา)
    prospectStage: "สนใจ", //    ขั้นตอนการขาย
    rating: 3, //    เกรดลูกค้า (1-5)
    note: "", //    หมายเหตุเพิ่มเติม
    createDate: "", //    วันที่สร้างข้อมูล
    contracts: [], //    รายการสัญญาที่ผูกกับลูกค้านี้
    source: "", //    แหล่งที่มา (จะถูกเซ็ตค่าเริ่มต้นใน resetLeadForm)
    assets: [], //      Array เก็บรายการสินทรัพย์หลายรายการ
  }),

  // ----------------------------------------------------------
  // [ใหม่] ⭐ subContractForm: ฟอร์มสำหรับสัญญาย่อย (แยกจากสัญญาหลัก)
  // ----------------------------------------------------------
  subContractForm: Vue.reactive({}),

  // ----------------------------------------------------------
  // [ใหม่] ⭐ openSubContractDialog()
  // เปิด Dialog สัญญาย่อยพร้อมรีเซ็ตค่า
  // ----------------------------------------------------------
  openSubContractDialog() {
    // 1. สร้างสัญญาเปล่า
    const empty = this.createEmptyContract();

    // 2. ระบุว่าเป็นสัญญาย่อย
    empty.isSubContract = true;

    // 3. รีเซ็ตค่าลงในฟอร์ม (ลบ key เก่าก่อน แล้ว assign ใหม่)
    Object.keys(this.subContractForm).forEach(
      (k) => delete this.subContractForm[k]
    );
    Object.assign(this.subContractForm, empty);

    // 4. เปิด Dialog ผ่าน AppGui
    if (window.AppGui) {
      AppGui.toggleMenu("isOpenSubContractDialog", true);
    }
  },

  // ----------------------------------------------------------
  // ⭐ createEmptyAsset()
  // สร้างโครงสร้าง Object สำหรับสินทรัพย์เปล่า (รองรับทุกประเภทใน Object เดียว)
  // ----------------------------------------------------------
  createEmptyAsset() {
    return {
      assetId: crypto.randomUUID(), //    สร้าง ID เฉพาะของสินทรัพย์
      type: "รถยนต์", //    ค่าเริ่มต้นประเภทสินทรัพย์

      // --- กลุ่มยานยนต์ (รถยนต์, มอไซค์, รถบรรทุก, รถเพื่อการเกษตร) ---
      brand: "", //    ยี่ห้อ
      model: "", //    รุ่น
      year: null, //    ปีรถ
      engineNo: "", //    เลขเครื่อง
      chassisNo: "", //    เลขตัวถัง
      cc: "", // ขนาดเครื่องยนต์ / แรงม้า
      carPrice: null, // ราคารถตอนซื้อ (Purchase Price)
      weight: null, //    น้ำหนัก (กก.) สำหรับรถบรรทุก/การเกษตร
      appraisedValue: null, //    ราคาประเมิน
      regDate: null, //    วันจดทะเบียน
      possessionDate: null, //    วันครอบครองเล่ม
      closeAmountOther: null, //    ยอดปิดบัญชีจากที่อื่น

      // --- กลุ่มโฉนด ---
      deedNumber: "",
      area: null,
      district: "",
      landProvince: "",

      // --- กลุ่มบำนาญ/ประกัน ---
      insuranceType: "ประกันรถ", //    ประเภทประกัน (ประกันรถ / ประกันอื่น)
      insuranceVehicleType: "", //    ประเภทรถที่ทำประกัน (เช่น รถเก๋ง, กระบะ)
      pensionAmount: null, //    จำนวนเงินบำนาญ
      coverageDate: null, //    วันที่หมดความคุ้มครอง (เฉพาะประกันรถ)
      desiredCoverage: "", //    ความต้องการลูกค้า (กรณีประกันอื่น)
      insuranceCapital: null, //    ทุนประกัน
      insurancePremium: null, //    ค่าเบี้ยประกัน
    };
  },

  // ----------------------------------------------------------
  // ⭐ addEmptyAsset()
  // เพิ่มรายการสินทรัพย์เปล่าลงในฟอร์ม
  // ----------------------------------------------------------
  addEmptyAsset() {
    //    ตรวจสอบว่ามี Array assets หรือไม่ ถ้าไม่มีให้สร้างใหม่
    if (!Array.isArray(LeadApp.form.assets)) {
      LeadApp.form.assets = [];
    }
    //    สร้างสินทรัพย์เปล่าและเพิ่มลงใน Array
    LeadApp.form.assets.push(LeadApp.createEmptyAsset());
  },

  // ----------------------------------------------------------
  // ⭐ removeAsset(index)
  // ลบสินทรัพย์ตามตำแหน่ง Index
  // ----------------------------------------------------------
  removeAsset(index) {
    if (Array.isArray(LeadApp.form.assets)) {
      //    ตัดรายการออกจาก Array ตาม Index
      LeadApp.form.assets.splice(index, 1);
      //    แจ้งเตือนผู้ใช้
      if (window.AppNotifications)
        AppNotifications.show("ลบรายการสินทรัพย์เรียบร้อย");
    }
  },

  // ----------------------------------------------------------
  // ⭐ resetLeadForm()
  // รีเซ็ตฟอร์มลูกค้ากลับเป็นค่าเริ่มต้น (และสร้างสินทรัพย์รอไว้ 1 รายการ)
  // ----------------------------------------------------------
  resetLeadForm() {
    //    ล้างค่า ID เพื่อเริ่มโหมดสร้างใหม่
    LeadApp.form.id = null;

    //    ล้างข้อมูล Text Field ทั่วไป
    LeadApp.form.firstName = "";
    LeadApp.form.nickName = "";
    LeadApp.form.phones = "";
    LeadApp.form.phone2 = ""; //    ล้างเบอร์ 2
    LeadApp.form.address = "";
    LeadApp.form.province = "";
    LeadApp.form.postalCode = "";

    //    ดึงค่าอาชีพแรกสุดจาก AppState (ถ้ามี) มาเป็นค่าเริ่มต้น
    const currentOccupations = window.AppState?.occupationItems?.value || [];
    LeadApp.form.occupation =
      currentOccupations.length > 0 ? currentOccupations[0] : "";

    //    รีเซ็ตสถานะเป็นค่าเริ่มต้น
    LeadApp.form.status = "ลูกค้าใหม่";
    LeadApp.form.isProspect = false;
    LeadApp.form.prospectStage = "สนใจ";
    LeadApp.form.rating = 3;
    LeadApp.form.note = "";
    LeadApp.form.createDate = new Date().toLocaleDateString("th-TH"); //    ใช้วันที่ปัจจุบัน
    LeadApp.form.contracts = []; //    ล้างสัญญา

    //    ดึงค่าแหล่งที่มาแรกสุดจาก AppState (ถ้ามี) มาเป็นค่าเริ่มต้น
    const currentSources = window.AppState?.sourceItems?.value || [];
    LeadApp.form.source = currentSources.length > 0 ? currentSources[0] : "";

    //    [สำคัญ] สร้างสินทรัพย์เปล่า 1 รายการรอไว้เลย ให้พร้อมกรอกทันที
    LeadApp.form.assets = [LeadApp.createEmptyAsset()];

    //    รีเซ็ตแท็บให้กลับไปหน้าแรก (ข้อมูลลูกค้า)
    if (window.AppState) {
      AppState.leadTab.value = "leadInfo";
    }

    console.log("🔄 LeadApp: รีเซ็ตฟอร์มเป็นค่าเริ่มต้นเรียบร้อย");
  },

  // ----------------------------------------------------------
  // ⭐ openNew()
  // สั่งรีเซ็ตค่าก่อนเปิด Modal เสมอ (ใช้กับปุ่ม "เพิ่ม Lead")
  // ----------------------------------------------------------
  openNew() {
    //    เรียกฟังก์ชันรีเซ็ตค่า
    this.resetLeadForm();

    //    สั่งเปิด Modal ผ่าน AppGui
    if (window.AppGui) {
      window.AppGui.toggleMenu("isOpenModalLead", true);
    }
  },

  // ----------------------------------------------------------
  // ⭐ handleAddConfigItem(newVal, itemType)
  // จัดการเพิ่มรายการ Config ใหม่ (เช่น อาชีพ, แหล่งที่มา) จากหน้า UI
  // ----------------------------------------------------------
  async handleAddConfigItem(newVal, itemType) {
    //    กำหนดค่า Config ของแต่ละประเภท
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

    //    เรียก Utils เพื่อเพิ่มรายการและบันทึก
    await Utils.handleConfigItemAdd(
      newVal,
      config.key,
      config.stateRef,
      config.prefix
    );

    //    อัปเดตค่าในฟอร์มทันที
    LeadApp.form[config.formField] = String(newVal || "").trim();
  },

  // ----------------------------------------------------------
  // ⭐ createEmptyContract()
  // สร้างโครงสร้าง Object สำหรับสัญญาเปล่า
  // ----------------------------------------------------------
  createEmptyContract() {
    return {
      contractId: "", //    เลขที่สัญญา
      leadId: "", //    รหัส Lead
      type: "", //    ประเภทสัญญา
      carid: "", //    รหัสรถ
      carbrandid: "", //    รหัสยี่ห้อ
      statusAccount: "ปกติ", //    สถานะบัญชี
      statusOverdue: 0, //    งวดค้างชำระ
      contractDate: new Date().toISOString().substr(0, 10), //    วันทำสัญญา
      expireDate: "", //    วันหมดอายุ
      grade: "", //    เกรดลูกค้า
      campaign: "", //    แคมเปญ
      loanAmount: 0, //    ยอดจัด
      approvedAmount: 0, //    ยอดอนุมัติ
      interestRate: 0, //    ดอกเบี้ย
      interestType: "", //    ประเภทดอกเบี้ย
      term: 0, //    จำนวนงวด
      installmentAmount: 0, //    ค่างวด
      installmentVAT: 0, //    ภาษี
      paymentDay: 1, //    วันครบกำหนดจ่าย
      paidInstallments: 0, //    จ่ายแล้ว
      expectedInstallments: 0, //  งวดที่ควรชำระถึงปัจจุบัน
      remainingInstallments: 0, //    คงเหลือ
      OVD: 0, //    ค้างชำระ (งวด)
      last3Payments: [], //    ประวัติการจ่าย
      lastUpdate: "", //    อัปเดตล่าสุด
      outstanding: 0, //    ยอดหนี้คงเหลือ
      unrealized: 0, //  ดอกผลรอตัดบัญชี
      // unrealized: 0, //    ดอกผลรอตัดบัญชี (ซ้ำ ลบออกหนึ่งบรรทัดได้ถ้าต้องการ)
      closeAmount: 0, //    ยอดปิดบัญชี
      closeDate: "", //    วันที่ปิดบัญชี
      financeName: "", //    ไฟแนนซ์
      remark: "", //    หมายเหตุ
      isSubContract: false, //    เป็นสัญญาย่อยหรือไม่
      assets: [this.createEmptyAsset()], //    ทรัพย์สินค้ำประกัน
      subContracts: [], //    สัญญาย่อย
    };
  },

  // ----------------------------------------------------------
  // ⭐ addEmptyContract()
  // เพิ่มสัญญาเปล่าลงในฟอร์ม Lead และย้าย Tab
  // ----------------------------------------------------------
  addEmptyContract() {
    const empty = LeadApp.createEmptyContract(); //    สร้างสัญญาเปล่า

    if (!Array.isArray(LeadApp.form.contracts)) {
      LeadApp.form.contracts = [];
    }

    LeadApp.form.contracts.push(empty); //    เพิ่มเข้า Array
    const newIndex = LeadApp.form.contracts.length - 1;

    //    ย้าย Tab ไปที่สัญญาใหม่ (หน่วงเวลาเล็กน้อยเพื่อให้ Render ทัน)
    setTimeout(() => {
      if (window.AppState && AppState.leadTab) {
        AppState.leadTab.value = "contract-" + newIndex;
      }
    }, 50);

    //    รีเซ็ต UI ย่อยของสัญญา
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

    //    แจ้งเตือน
    if (window.AppNotifications)
      AppNotifications.show("เพิ่มแท็บสัญญาใหม่เรียบร้อย");
  },

  // ----------------------------------------------------------
  // ⭐ resetNewContractForm()
  // รีเซ็ตฟอร์มสัญญาใหม่ (สำหรับ Tab "+")
  // ----------------------------------------------------------
  resetNewContractForm() {
    if (!window.AppState || !AppState.newContractForm) return;
    const empty = LeadApp.createEmptyContract();
    //    คัดลอกค่าจากสัญญาเปล่าไปใส่
    Object.keys(empty).forEach((k) => {
      AppState.newContractForm[k] = empty[k];
    });
  },

  // ----------------------------------------------------------
  // ⭐ loadAll()
  // โหลดข้อมูล Lead ทั้งหมดจาก Dexie เข้าสู่ Store
  // ----------------------------------------------------------
  async loadAll() {
    try {
      const items = await AppDexie.lead.getAll(); //    อ่านจาก DB
      Store.setItems("Lead", items); //    ใส่ Store
    } catch (err) {
      console.error("❌ LeadApp.loadAll() error:", err);
    }
  },

  // ----------------------------------------------------------
  // ⭐ add(formData)
  // เพิ่ม Lead ใหม่ลงฐานข้อมูล
  // ----------------------------------------------------------
  async add(formData) {
    try {
      const src = formData || LeadApp.form; //    เอาข้อมูลจากฟอร์ม
      const dataToSave = {
        ...src,
        id: crypto.randomUUID(), //    สร้าง ID ใหม่
        createDate: new Date().toLocaleDateString("th-TH"), //    วันที่สร้าง
      };

      await AppDexie.lead.add(dataToSave); //    บันทึก
      await LeadApp.loadAll(); //    โหลดข้อมูลใหม่

      //    ปิด Modal และแจ้งเตือน
      if (window.AppGui) AppGui.toggleMenu("isOpenModalLead", false);
      if (window.AppNotifications) AppNotifications.show("เพิ่ม Lead สำเร็จ");

      LeadApp.resetLeadForm(); //    รีเซ็ตฟอร์ม
    } catch (err) {
      console.error("❌ LeadApp.add() error:", err);
    }
  },

  // ----------------------------------------------------------
  // ⭐ update()
  // อัปเดตข้อมูล Lead เดิม
  // ----------------------------------------------------------
  async update() {
    try {
      if (!LeadApp.form.id) {
        console.warn("⚠ LeadApp.update() ถูกเรียก แต่ไม่มี id");
        return;
      }

      await AppDexie.lead.update(LeadApp.form.id, { ...LeadApp.form }); //    อัปเดตลง DB
      await LeadApp.loadAll(); //    โหลดข้อมูลใหม่

      if (window.AppGui) AppGui.toggleMenu("isOpenModalLead", false);
      if (window.AppNotifications)
        AppNotifications.show("อัปเดตข้อมูล Lead เรียบร้อย");
    } catch (err) {
      console.error("❌ LeadApp.update() error:", err);
    }
  },

  // ----------------------------------------------------------
  // ⭐ delete(id)
  // ลบข้อมูล Lead
  // ----------------------------------------------------------
  async delete(id) {
    try {
      await AppDexie.lead.delete(id); //    ลบจาก DB
      await LeadApp.loadAll(); //    โหลดข้อมูลใหม่
      if (window.AppNotifications)
        AppNotifications.show("ลบข้อมูล Lead เรียบร้อย");
    } catch (err) {
      console.error("❌ LeadApp.delete() error:", err);
    }
  },

  // ----------------------------------------------------------
  // ⭐ openEdit(lead)
  // เปิดฟอร์มแก้ไข (ดึงข้อมูลมาใส่)
  // ----------------------------------------------------------
  openEdit(lead) {
    if (!lead) return;

    //    คัดลอกข้อมูลมาใส่ฟอร์ม
    Object.assign(LeadApp.form, lead);

    //    ตรวจสอบและซ่อมแซมข้อมูลสินทรัพย์ถ้าเป็นข้อมูลเก่า
    if (!Array.isArray(LeadApp.form.assets)) {
      LeadApp.form.assets = [];
    }

    //    ตรวจสอบและซ่อมแซมข้อมูลสัญญา
    if (!Array.isArray(LeadApp.form.contracts)) {
      LeadApp.form.contracts = [];
    }

    //    เปิด Modal
    if (window.AppGui) AppGui.toggleMenu("isOpenModalLead", true);
  },
};

// --------------------------------------------------------
// 🌍 Export ออกสู่ Global
// --------------------------------------------------------
window.LeadApp = LeadApp;
