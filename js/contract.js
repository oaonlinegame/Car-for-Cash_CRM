// js/contract.js
// --------------------------------------------------------
// 📘 ContractApp: ระบบจัดการสัญญา (Contract Management System)
// --------------------------------------------------------

const ContractApp = {
  // ----------------------------------------------------
  // ⭐ State: พื้นที่เก็บข้อมูลชั่วคราว
  // ----------------------------------------------------
  subContractForm: Vue.reactive({}),

  // ----------------------------------------------------
  // ⭐ createEmpty(isSub)
  // ฟังก์ชันสร้าง Object สัญญาเปล่า
  // ----------------------------------------------------
  createEmpty(isSub = false) {
    // ดึงฟังก์ชันสร้างสินทรัพย์จาก AssetApp (ถ้ามี)
    const createAsset = window.AssetApp
      ? window.AssetApp.createEmpty
      : () => ({});

    return {
      contractId: "",
      leadId: "",
      isSubContract: isSub,

      // --- ข้อมูลทั่วไป ---
      type: "จำนำทะเบียน", // ตั้งค่า Default ให้มีค่า
      statusAccount: "Active",
      statusOverdue: 0,
      grade: "A",
      campaign: "",

      // --- วันที่ ---
      contractDate: new Date().toISOString().slice(0, 10),
      expireDate: "",
      lastUpdate: new Date().toISOString().slice(0, 10),
      paymentDay: 1,
      closeDate: "",

      // --- การเงิน ---
      loanAmount: 0,
      approvedAmount: 0,
      interestRate: 0,
      interestType: "Flat",
      term: 12,
      installmentAmount: 0,
      installmentVAT: 0,

      // --- ยอดคงเหลือ ---
      paidInstallments: 0,
      expectedInstallments: 0,
      remainingInstallments: 12,
      outstanding: 0,
      unrealized: 0,
      closeAmount: 0,
      OVD: 0,
      last3Payments: [],

      financeName: "",
      remark: "",

      // --- ความสัมพันธ์ ---
      // ✅ สร้าง Array พร้อมสินทรัพย์เปล่า 1 รายการทันที
      assets: [createAsset()],
      subContracts: [],
    };
  },

  // ----------------------------------------------------
  // ⭐ addEmptyContract()
  // ฟังก์ชันเพิ่มสัญญาเปล่าลงในฟอร์มลูกค้าปัจจุบัน
  // ----------------------------------------------------
  addEmptyContract() {
    // ตรวจสอบความพร้อมของ LeadApp
    if (!window.LeadApp || !window.LeadApp.form) {
      console.warn("⚠️ LeadApp not ready");
      return;
    }

    // ✅ แก้ไข: เรียกผ่าน ContractApp โดยตรง (ป้องกัน Error: this.createEmpty is not a function)
    const empty = ContractApp.createEmpty();

    // ตรวจสอบ Array สัญญา
    if (!Array.isArray(LeadApp.form.contracts)) {
      LeadApp.form.contracts = [];
    }

    // เพิ่มสัญญาใหม่
    LeadApp.form.contracts.push(empty);

    // คำนวณ Index และย้าย Tab
    const newIndex = LeadApp.form.contracts.length - 1;
    setTimeout(() => {
      if (window.AppState && AppState.leadTab) {
        AppState.leadTab.value = "contract-" + newIndex;
      }
    }, 50);

    // แจ้งเตือน
    if (window.AppNotifications) {
      AppNotifications.show("✅ เพิ่มแท็บสัญญาใหม่เรียบร้อย");
    }
  },

  // ----------------------------------------------------
  // ⭐ openSubContractDialog()
  // เปิดหน้าต่างเพิ่มสัญญาย่อย
  // ----------------------------------------------------
  openSubContractDialog() {
    // ✅ แก้ไข: เรียกผ่าน ContractApp โดยตรง
    const empty = ContractApp.createEmpty(true);

    // รีเซ็ตฟอร์ม
    Object.keys(ContractApp.subContractForm).forEach(
      (k) => delete ContractApp.subContractForm[k]
    );
    Object.assign(ContractApp.subContractForm, empty);

    if (window.AppGui) {
      AppGui.toggleMenu("isOpenSubContractDialog", true);
    }
  },

  // รีเซ็ตฟอร์มสัญญาใหม่ (ถ้ามีใช้)
  resetNewContractForm() {
    if (!window.AppState || !AppState.newContractForm) return;
    const empty = ContractApp.createEmpty();
    Object.keys(empty).forEach((k) => {
      AppState.newContractForm[k] = empty[k];
    });
  },
};

// ส่งออกให้ Window เรียกใช้ได้ทั่วโลก
window.ContractApp = ContractApp;
