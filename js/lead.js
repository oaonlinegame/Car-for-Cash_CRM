// ------------------------------------------------------------
// 📘 โมดูล LeadApp: จัดการข้อมูลลูกค้า (Lead)
// ทำหน้าที่:
// - ฟอร์ม lead (เพิ่ม/แก้ไข)
// - บันทึกลง Dexie
// - โหลดข้อมูลทั้งหมด
// - รีเซ็ตค่าเมื่อเปิด/ปิดฟอร์ม
// - รองรับระบบสัญญา (contracts)
// ------------------------------------------------------------

const LeadApp = {
  // ------------------------------------------------------------
  // ⭐ form: ฟอร์มข้อมูล Lead หลัก (Reactive)
  // ย้ายมาจาก LeadState เพื่อให้เหลือ Global เดียว = LeadApp
  // ------------------------------------------------------------
  form: Vue.reactive({
    id: null, // ไอดีของ Lead (ใช้ตรวจสอบว่าแก้ไขหรือเพิ่มใหม่)
    firstName: "", // ชื่อ-นามสกุล
    nickName: "", // ชื่อเล่น
    phones: "", // เบอร์โทรหลายเบอร์ (คั่นด้วย ,)
    address: "", // ที่อยู่
    province: "", // จังหวัด
    postalCode: "", // รหัสไปรษณีย์
    occupation: "", // อาชีพ
    status: "ลูกค้าใหม่", // สถานะลูกค้า
    isProspect: true, // ลูกค้าใหม่ (true) หรือไม่
    prospectStage: "สนใจ", // ขั้นตอนของ Prospect ปัจจุบัน
    rating: 3, // คะแนน (1–5)
    note: "", // หมายเหตุเพิ่มเติม
    createDate: "", // วันที่สร้าง Lead (กำหนดตอนบันทึก)
    contracts: [], // รายการสัญญาของลูกค้า (รองรับหลายสัญญา)
  }),

  // ------------------------------------------------------------
  // ⭐ resetLeadForm()
  // รีเซ็ตฟอร์ม Lead ทั้งหมดกลับเป็นค่าเริ่มต้น
  // เรียกใช้เมื่อเปิด modal ใหม่ หรือหลังเพิ่มเสร็จ
  // ------------------------------------------------------------
  resetLeadForm() {
    this.form.id = null; // ล้าง ID
    this.form.firstName = ""; // ล้างชื่อ
    this.form.nickName = ""; // ล้างชื่อเล่น
    this.form.phones = ""; // ล้างเบอร์โทร
    this.form.address = ""; // ล้างที่อยู่
    this.form.province = ""; // ล้างจังหวัด
    this.form.postalCode = ""; // ล้างรหัสไปรษณีย์
    this.form.occupation = ""; // ล้างอาชีพ
    this.form.status = "ลูกค้าใหม่"; // รีเซ็ตสถานะเริ่มต้น
    this.form.isProspect = true; // รีเซ็ตลูกค้าใหม่
    this.form.prospectStage = "สนใจ"; // รีเซ็ตขั้นตอน
    this.form.rating = 3; // รีเซ็ตคะแนนเริ่มต้น
    this.form.note = ""; // ล้างหมายเหตุ
    this.form.createDate = new Date().toLocaleDateString("th-TH"); // ตั้งวันที่ใหม่
    this.form.contracts = []; // ล้างรายการสัญญาทั้งหมด
  },

  // ------------------------------------------------------------
  // ⭐ loadAll()
  // โหลดรายการ Lead ทั้งหมดจาก IndexedDB (Dexie)
  // แล้วอัปเดตไปยัง Store เพื่อให้ UI แสดงผล
  // ------------------------------------------------------------
  async loadAll() {
    try {
      const items = await AppDexie.lead.getAll(); // ดึงข้อมูลทั้งหมดจาก IndexedDB
      Store.setItems("Lead", items); // ส่งข้อมูลให้ Store (UI)
    } catch (err) {
      console.error("❌ loadAll() error:", err); // แสดง error
    }
  },

  // ------------------------------------------------------------
  // ⭐ add()
  // เพิ่มลูกค้าใหม่ลงฐานข้อมูล Dexie
  // ------------------------------------------------------------
  async add() {
    try {
      const data = {
        ...this.form, // คัดลอกข้อมูลจากฟอร์มทั้งหมด
        id: crypto.randomUUID(), // สร้าง ID ใหม่แบบ UUID
        createDate: new Date().toLocaleDateString("th-TH"), // วันที่สร้าง
      };

      await AppDexie.lead.add(data); // บันทึกลง IndexedDB
      await this.loadAll(); // โหลดข้อมูลใหม่ (refresh UI)
      AppGui.toggleMenu("isOpenModalLead", false); // ปิดหน้าต่าง modal
      AppNotifications.show("เพิ่ม Lead สำเร็จ"); // แจ้งเตือน

      this.resetLeadForm(); // เคลียร์ฟอร์มสำหรับครั้งถัดไป
    } catch (err) {
      console.error("❌ add() error:", err); // แสดง error
    }
  },

  // ------------------------------------------------------------
  // ⭐ update()
  // แก้ไขข้อมูล Lead ที่มีอยู่
  // ------------------------------------------------------------
  async update() {
    try {
      // ❗ ต้องมี ID ก่อนถึงจะอัปเดตได้
      if (!this.form.id) {
        console.warn("⚠ update() เรียกแต่ไม่มี ID");
        return;
      }

      await AppDexie.lead.update(this.form.id, { ...this.form }); // บันทึกลง Dexie
      await this.loadAll(); // อัปเดต UI
      AppGui.toggleMenu("isOpenModalLead", false); // ปิด modal
      AppNotifications.show("อัปเดตข้อมูลเรียบร้อย"); // แจ้งเตือน
    } catch (err) {
      console.error("❌ update() error:", err); // แสดง error
    }
  },

  // ------------------------------------------------------------
  // ⭐ delete(id)
  // ลบลูกค้าออกจาก Dexie
  // ------------------------------------------------------------
  async delete(id) {
    try {
      await AppDexie.lead.delete(id); // ลบข้อมูลตาม ID
      await this.loadAll(); // โหลดใหม่เพื่อ refresh UI
      AppNotifications.show("ลบข้อมูลแล้ว"); // แจ้งเตือน
    } catch (err) {
      console.error("❌ delete() error:", err); // แสดง error
    }
  },

  // ------------------------------------------------------------
  // ⭐ openEdit(lead)
  // โหลดข้อมูล Lead เดิมเข้า form เพื่อแก้ไข
  // ------------------------------------------------------------
  openEdit(lead) {
    Object.assign(this.form, lead); // คัดลอกข้อมูลทั้งหมดมาใส่ฟอร์ม
    AppGui.toggleMenu("isOpenModalLead", true); // เปิด modal แก้ไข
  },
  // --------------------------------------------------------
  // 🆕 createEmptyContract()
  // สร้างโครงสัญญาใหม่ตาม DataSpec (เวอร์ชันเต็ม)
  // --------------------------------------------------------
  createEmptyContract() {
    return {
      contractId: "", // รหัสสัญญา
      leadId: "", // FK → Lead.id
      type: "", // ประเภทสินเชื่อ
      carid: "", // รหัสรถ
      carbrandid: "", // รหัสยี่ห้อรถ
      statusAccount: "", // สถานะบัญชี
      statusOverdue: 0, // จำนวนงวดค้าง
      contractDate: "", // วันที่ทำสัญญา
      expireDate: "", // วันที่ครบสัญญา
      grade: "", // เกรดลูกค้า
      campaign: "", // แคมเปญ
      loanAmount: 0, // ยอดขอสินเชื่อ
      approvedAmount: 0, // ยอดอนุมัติ
      interestRate: 0, // ดอกเบี้ย %
      interestType: "", // ประเภทดอกเบี้ย
      term: 0, // จำนวนงวด
      installmentAmount: 0, // ค่างวดต่อเดือน
      installmentVAT: 0, // VAT ของค่างวด
      paymentDay: 1, // วันชำระประจำเดือน
      paidInstallments: 0, // งวดที่ชำระแล้ว
      remainingInstallments: 0, // งวดคงเหลือ
      OVD: 0, // overdue
      last3Payments: [], // สถานะย้อนหลัง 3 เดือน
      lastUpdate: "", // วันที่อัปเดตล่าสุด
      outstanding: 0, // หนี้คงเหลือ
      unrealized: 0, // ดอกเบี้ยค้างรับ
      closeAmount: 0, // ยอดปิดบัญชี
      closeDate: "", // วันที่ปิดบัญชี
      financeName: "", // ชื่อไฟแนนซ์
      remark: "", // หมายเหตุ
      isSubContract: false, // เป็นสัญญาย่อยหรือไม่
      assets: [], // รายการทรัพย์สิน เช่น รถ/ที่ดิน
      subContracts: [], // สัญญาย่อย
    };
  },

  // --------------------------------------------------------
  // 🆕 resetNewContractForm()
  // รีเซ็ตฟอร์มสัญญาใหม่ (ใช้ตอนกด TAB +)
  // --------------------------------------------------------
  resetNewContractForm() {
    const empty = this.createEmptyContract(); // สร้างสัญญาใหม่แบบว่าง
    Object.keys(empty).forEach((k) => {
      AppState.newContractForm[k] = empty[k]; // ใส่ลง newContractForm
    });
  },

  // --------------------------------------------------------
  // 🆕 addContractFromNewForm()
  // เพิ่มสัญญาใหม่เข้า leadForm
  // --------------------------------------------------------
  addContractFromNewForm() {
    if (!LeadState.form.contracts) {
      LeadState.form.contracts = []; // ถ้ายังไม่มี array → สร้างใหม่
    }

    // ยัดฟอร์มใหม่ลง contracts
    LeadState.form.contracts.push(
      JSON.parse(JSON.stringify(AppState.newContractForm))
    );

    // หลังเพิ่มเสร็จ → reset ฟอร์มใหม่ทันที
    this.resetNewContractForm();

    // เปลี่ยน ContractTab ไปที่สัญญาชุดล่าสุด
    AppState.contractTab.value = LeadState.form.contracts.length - 1;

    AppNotifications.show("เพิ่มสัญญาสำเร็จ");
  },

  // --------------------------------------------------------
  // 🆕 editContract(index)
  // โหลดสัญญาเก่ามาแก้ไขใน newContractForm
  // --------------------------------------------------------
  editContract(index) {
    if (!LeadState.form.contracts || !LeadState.form.contracts[index]) return;

    const data = LeadState.form.contracts[index];

    Object.keys(data).forEach((k) => {
      AppState.newContractForm[k] = data[k]; // โหลดข้อมูลเก่ามาแก้
    });

    // เปิดแท็บสัญญาที่ต้องการแก้ไข
    AppState.contractTab.value = index;

    // ไปหน้า ALL
    AppState.contractInnerTab.value = "all";

    // เปิด Panels ทั้งหมด
    AppState.contractPanels.value = [
      "info",
      "finance",
      "status",
      "asset",
      "history",
      "other",
    ];
  },

  // --------------------------------------------------------
  // 🆕 deleteContract(index)
  // ลบสัญญาออกจาก leadForm
  // --------------------------------------------------------
  deleteContract(index) {
    if (!LeadState.form.contracts) return;
    LeadState.form.contracts.splice(index, 1);

    AppNotifications.show("ลบสัญญาแล้ว");

    // ถ้าลบจนเหลือ 0 → ไป TAB "+"
    if (LeadState.form.contracts.length === 0) {
      AppState.contractTab.value = "new";
    } else {
      AppState.contractTab.value = 0;
    }
  },

  // ------------------------------------------------------------
  // ⭐ addEmptyContract()
  // เพิ่ม Tab สัญญาใหม่แบบ Browser Style
  // 1. สร้าง Object สัญญาเปล่า
  // 2. ยัดใส่ Array contracts
  // 3. สั่งให้หน้าจอเด้งไปหา Tab ใหม่ทันที
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // ⭐ addEmptyContract() [ปรับปรุงใหม่]
  // เพิ่ม Tab สัญญาใหม่แบบ Browser Style
  // 1. สร้าง Object สัญญาเปล่า
  // 2. ยัดใส่ Array contracts
  // 3. สั่งให้หน้าจอเด้งไปหา Tab ใหม่ทันที
  // ------------------------------------------------------------
  addEmptyContract() {
    // [ถาวร] 1. สร้างสัญญาเปล่าตามโครงสร้าง DataSpec
    const empty = this.createEmptyContract();

    // [ถาวร] 2. ตรวจสอบว่ามี array contracts หรือยัง ถ้าไม่มีให้สร้างใหม่
    if (!this.form.contracts) {
      this.form.contracts = [];
    }

    // [ถาวร] 3. เพิ่มสัญญาใหม่เข้า array (Tab จะงอกออกมาเองตาม v-for ใน html)
    this.form.contracts.push(empty);

    // [ถาวร] 4. คำนวณ index ของสัญญาตัวใหม่ (ตัวสุดท้าย)
    const newIndex = this.form.contracts.length - 1;

    // [ถาวร] 5. สั่งให้ UI กระโดดไปที่ Tab ใหม่ทันที (Browser feel)
    // ต้องใช้ setTimeout เล็กน้อยเพื่อให้ Vue Render Tab เสร็จก่อนค่อยย้าย
    setTimeout(() => {
      AppState.leadTab.value = "contract-" + newIndex;
    }, 50);

    // [ถาวร] 6. ตั้งค่า Tab ย่อยภายในให้เป็นหน้า ALL (ภาพรวม)
    AppState.contractInnerTab.value = "all";

    // [ถาวร] 7. เปิด Panels ทั้งหมดรอไว้
    AppState.contractPanels.value = [
      "info",
      "finance",
      "status",
      "asset",
      "history",
      "other",
    ];

    // [ถาวร] แจ้งเตือนผู้ใช้
    AppNotifications.show("เพิ่มแท็บสัญญาใหม่เรียบร้อย");
  },

  // --------------------------------------------------------
  // 🆕 createEmptyContract()
  // สร้างโครงสัญญาใหม่ตาม DataSpec (เวอร์ชันเต็ม)
  // --------------------------------------------------------
  createEmptyContract() {
    return {
      contractId: "", // รหัสสัญญา (ว่างไว้เพื่อให้ Tab แสดงว่า 'สัญญาใหม่')
      leadId: "", // FK → Lead.id
      type: "", // ประเภทสินเชื่อ
      carid: "", // รหัสรถ
      carbrandid: "", // รหัสยี่ห้อรถ
      statusAccount: "ปกติ", // สถานะบัญชีเริ่มต้น
      statusOverdue: 0, // จำนวนงวดค้าง
      contractDate: new Date().toISOString().substr(0, 10), // วันที่ทำสัญญา (default วันนี้)
      expireDate: "", // วันที่ครบสัญญา
      grade: "", // เกรดลูกค้า
      campaign: "", // แคมเปญ
      loanAmount: 0, // ยอดขอสินเชื่อ
      approvedAmount: 0, // ยอดอนุมัติ
      interestRate: 0, // ดอกเบี้ย %
      interestType: "", // ประเภทดอกเบี้ย
      term: 0, // จำนวนงวด
      installmentAmount: 0, // ค่างวดต่อเดือน
      installmentVAT: 0, // VAT ของค่างวด
      paymentDay: 1, // วันชำระประจำเดือน
      paidInstallments: 0, // งวดที่ชำระแล้ว
      remainingInstallments: 0, // งวดคงเหลือ
      OVD: 0, // overdue
      last3Payments: [], // สถานะย้อนหลัง 3 เดือน
      lastUpdate: "", // วันที่อัปเดตล่าสุด
      outstanding: 0, // หนี้คงเหลือ
      unrealized: 0, // ดอกเบี้ยค้างรับ
      closeAmount: 0, // ยอดปิดบัญชี
      closeDate: "", // วันที่ปิดบัญชี
      financeName: "", // ชื่อไฟแนนซ์
      remark: "", // หมายเหตุ
      isSubContract: false, // เป็นสัญญาย่อยหรือไม่
      assets: [], // รายการทรัพย์สิน เช่น รถ/ที่ดิน
      subContracts: [], // สัญญาย่อย
    };
  },

  // ... (โค้ดส่วน createEmptyContract และอื่นๆ คงเดิม) ...

  // --------------------------------------------------------
  // 🆕 createEmptyContract()
  // สร้างโครงสัญญาใหม่ตาม DataSpec (เวอร์ชันเต็ม)
  // --------------------------------------------------------
  createEmptyContract() {
    return {
      contractId: "", // รหัสสัญญา (ว่างไว้เพื่อให้ Tab แสดงว่า 'สัญญาใหม่')
      leadId: "", // FK → Lead.id
      type: "", // ประเภทสินเชื่อ
      carid: "", // รหัสรถ
      carbrandid: "", // รหัสยี่ห้อรถ
      statusAccount: "ปกติ", // สถานะบัญชีเริ่มต้น
      statusOverdue: 0, // จำนวนงวดค้าง
      contractDate: new Date().toISOString().substr(0, 10), // วันที่ทำสัญญา (default วันนี้)
      expireDate: "", // วันที่ครบสัญญา
      grade: "", // เกรดลูกค้า
      campaign: "", // แคมเปญ
      loanAmount: 0, // ยอดขอสินเชื่อ
      approvedAmount: 0, // ยอดอนุมัติ
      interestRate: 0, // ดอกเบี้ย %
      interestType: "", // ประเภทดอกเบี้ย
      term: 0, // จำนวนงวด
      installmentAmount: 0, // ค่างวดต่อเดือน
      installmentVAT: 0, // VAT ของค่างวด
      paymentDay: 1, // วันชำระประจำเดือน
      paidInstallments: 0, // งวดที่ชำระแล้ว
      remainingInstallments: 0, // งวดคงเหลือ
      OVD: 0, // overdue
      last3Payments: [], // สถานะย้อนหลัง 3 เดือน
      lastUpdate: "", // วันที่อัปเดตล่าสุด
      outstanding: 0, // หนี้คงเหลือ
      unrealized: 0, // ดอกเบี้ยค้างรับ
      closeAmount: 0, // ยอดปิดบัญชี
      closeDate: "", // วันที่ปิดบัญชี
      financeName: "", // ชื่อไฟแนนซ์
      remark: "", // หมายเหตุ
      isSubContract: false, // เป็นสัญญาย่อยหรือไม่
      assets: [], // รายการทรัพย์สิน เช่น รถ/ที่ดิน
      subContracts: [], // สัญญาย่อย
    };
  },
};

// ------------------------------------------------------------
// 🌍 Export ออกแบบ Global เดียว (ตามกติกาของคุณ)
// ------------------------------------------------------------
window.LeadApp = LeadApp; // ✔ มี Global เดียวเท่านั้น
