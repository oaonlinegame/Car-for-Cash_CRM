// ------------------------------------------------------------ // คอมเมนต์: เส้นคั่นส่วนหัวของไฟล์
// 📘 โมดูล LeadApp: จัดการข้อมูลลูกค้า (Lead) + สัญญา (Contracts) // คอมเมนต์: อธิบายหน้าที่หลักของโมดูลนี้
// ------------------------------------------------------------ // คอมเมนต์: ปิดส่วนหัวของคำอธิบาย

const LeadApp = {
  // คอมเมนต์: ประกาศอ็อบเจ็กต์หลัก LeadApp สำหรับเก็บฟอร์มและฟังก์ชันทั้งหมด

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนฟอร์มหลัก
  // ⭐ form: ฟอร์มหลักของลูกค้า (Lead Form)                  // คอมเมนต์: ส่วนเก็บข้อมูลฟอร์ม Lead
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อฟอร์มหลัก
  form: Vue.reactive({
    // คอมเมนต์: ใช้ Vue.reactive เพื่อให้ผูกกับ UI แบบสองทางได้

    id: null, // คอมเมนต์: ไอดีของ Lead ใช้เช็คว่าเป็นเพิ่มใหม่หรือแก้ไข
    firstName: "", // คอมเมนต์: ชื่อ-นามสกุลลูกค้า หรือชื่อบริษัท
    nickName: "", // คอมเมนต์: ชื่อเล่น หรือชื่อผู้ติดต่อหลัก
    phones: "", // คอมเมนต์: เบอร์โทรหลายเบอร์คั่นด้วยจุลภาค
    address: "", // คอมเมนต์: ที่อยู่หลักของลูกค้า
    province: "", // คอมเมนต์: จังหวัดของลูกค้า
    postalCode: "", // คอมเมนต์: รหัสไปรษณีย์
    occupation: "", // คอมเมนต์: อาชีพลูกค้า
    status: "ลูกค้าใหม่", // คอมเมนต์: สถานะลูกค้า เริ่มต้นเป็นลูกค้าใหม่
    isProspect: true, // คอมเมนต์: true = ลูกค้าใหม่ที่ยังไม่เคยทำสัญญา
    prospectStage: "สนใจ", // คอมเมนต์: ขั้นตอนในกระบวนการขายเริ่มต้นเป็น “สนใจ”
    rating: 3, // คอมเมนต์: คะแนนประเมินลูกค้าเบื้องต้น 1–5
    note: "", // คอมเมนต์: หมายเหตุเพิ่มเติมเกี่ยวกับลูกค้า
    createDate: "", // คอมเมนต์: วันที่สร้าง Lead จะเซ็ตตอนบันทึก
    contracts: [], // คอมเมนต์: อาร์เรย์เก็บรายการสัญญาของลูกค้ารายนี้
  }), // คอมเมนต์: ปิดอ็อบเจ็กต์ form

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนรีเซ็ตฟอร์ม
  // ⭐ resetLeadForm()                                         // คอมเมนต์: ฟังก์ชันรีเซ็ตฟอร์มลูกค้า
  // รีเซ็ตฟอร์มลูกค้ากลับเป็นค่าเริ่มต้น                   // คอมเมนต์: อธิบายสั้น ๆ ว่าทำอะไร
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ resetLeadForm
  resetLeadForm() {
    // คอมเมนต์: ประกาศฟังก์ชันรีเซ็ตฟอร์ม Lead

    LeadApp.form.id = null; // คอมเมนต์: ล้างค่า id ให้เป็น null
    LeadApp.form.firstName = ""; // คอมเมนต์: ล้างชื่อ-นามสกุล
    LeadApp.form.nickName = ""; // คอมเมนต์: ล้างชื่อเล่น
    LeadApp.form.phones = ""; // คอมเมนต์: ล้างเบอร์โทรทั้งหมด
    LeadApp.form.address = ""; // คอมเมนต์: ล้างที่อยู่
    LeadApp.form.province = ""; // คอมเมนต์: ล้างจังหวัด
    LeadApp.form.postalCode = ""; // คอมเมนต์: ล้างรหัสไปรษณีย์
    LeadApp.form.occupation = ""; // คอมเมนต์: ล้างอาชีพ
    LeadApp.form.status = "ลูกค้าใหม่"; // คอมเมนต์: เซ็ตสถานะกลับเป็นลูกค้าใหม่
    LeadApp.form.isProspect = true; // คอมเมนต์: เซ็ตให้เป็นลูกค้าใหม่
    LeadApp.form.prospectStage = "สนใจ"; // คอมเมนต์: เซ็ตขั้นตอนกลับเป็น “สนใจ”
    LeadApp.form.rating = 3; // คอมเมนต์: เซ็ตคะแนนกลับเป็น 3 ดาว
    LeadApp.form.note = ""; // คอมเมนต์: ล้างหมายเหตุ
    LeadApp.form.createDate = new Date().toLocaleDateString("th-TH"); // คอมเมนต์: เซ็ตวันที่สร้างเป็นวันนี้
    LeadApp.form.contracts = []; // คอมเมนต์: ล้างรายการสัญญาทั้งหมด
  }, // คอมเมนต์: ปิดฟังก์ชัน resetLeadForm

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนสร้างสัญญาเปล่า
  // ⭐ createEmptyContract()                                   // คอมเมนต์: ฟังก์ชันสร้างโครงสัญญาเปล่า
  // สร้างโครงสัญญาเปล่า 1 อัน (ใช้เป็น template ของ TAB ใหม่) // คอมเมนต์: ใช้เวลาจะเพิ่มสัญญาใหม่
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ createEmptyContract
  createEmptyContract() {
    // คอมเมนต์: ประกาศฟังก์ชันสร้างสัญญาเปล่า

    return {
      // คอมเมนต์: คืนค่าเป็นอ็อบเจกต์สัญญาเปล่า 1 ชุด
      contractId: "", // คอมเมนต์: รหัสสัญญา (ว่าง = สัญญาใหม่)
      leadId: "", // คอมเมนต์: รหัสลูกค้าที่สัญญานี้สังกัด
      type: "", // คอมเมนต์: ประเภทสินเชื่อ เช่น จำนำทะเบียน
      carid: "", // คอมเมนต์: รหัสรถถ้ามีระบบรถแยก
      carbrandid: "", // คอมเมนต์: รหัสยี่ห้อรถถ้ามี
      statusAccount: "ปกติ", // คอมเมนต์: สถานะบัญชีเริ่มต้นเป็นปกติ
      statusOverdue: 0, // คอมเมนต์: จำนวนงวดที่ค้างชำระเริ่มต้น 0
      contractDate: new Date().toISOString().substr(0, 10), // คอมเมนต์: วันที่ทำสัญญาเริ่มต้นเป็นวันนี้ (รูปแบบ YYYY-MM-DD)
      expireDate: "", // คอมเมนต์: วันที่ครบสัญญา
      grade: "", // คอมเมนต์: เกรดลูกค้า
      campaign: "", // คอมเมนต์: ชื่อแคมเปญ
      loanAmount: 0, // คอมเมนต์: ยอดขอสินเชื่อ
      approvedAmount: 0, // คอมเมนต์: ยอดอนุมัติสินเชื่อ
      interestRate: 0, // คอมเมนต์: อัตราดอกเบี้ย %
      interestType: "", // คอมเมนต์: ประเภทดอกเบี้ย เช่น flat หรือ effective
      term: 0, // คอมเมนต์: จำนวนงวดทั้งหมด
      installmentAmount: 0, // คอมเมนต์: ค่างวดที่ต้องจ่ายต่อเดือน
      installmentVAT: 0, // คอมเมนต์: VAT ของค่างวด
      paymentDay: 1, // คอมเมนต์: วันที่ต้องชำระในแต่ละเดือน (1–31)
      paidInstallments: 0, // คอมเมนต์: จำนวนงวดที่จ่ายแล้ว
      remainingInstallments: 0, // คอมเมนต์: จำนวนงวดคงเหลือ
      OVD: 0, // คอมเมนต์: จำนวนงวดที่ค้างชำระ (Overdue)
      last3Payments: [], // คอมเมนต์: สถานะชำระย้อนหลัง 3 เดือน
      lastUpdate: "", // คอมเมนต์: วันที่อัปเดตข้อมูลล่าสุด
      outstanding: 0, // คอมเมนต์: ยอดหนี้คงเหลือ
      unrealized: 0, // คอมเมนต์: ดอกเบี้ยค้างรับ
      closeAmount: 0, // คอมเมนต์: ยอดปิดบัญชี
      closeDate: "", // คอมเมนต์: วันที่ปิดบัญชี
      financeName: "", // คอมเมนต์: ชื่อไฟแนนซ์
      remark: "", // คอมเมนต์: หมายเหตุของสัญญา
      isSubContract: false, // คอมเมนต์: true = เป็นสัญญาย่อย
      assets: [], // คอมเมนต์: รายการทรัพย์สินหลักประกัน
      subContracts: [], // คอมเมนต์: รายการสัญญาย่อย
    }; // คอมเมนต์: ปิดอ็อบเจกต์ที่คืนค่า
  }, // คอมเมนต์: ปิดฟังก์ชัน createEmptyContract

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนเพิ่มสัญญาใหม่
  // ⭐ addEmptyContract()                                      // คอมเมนต์: ฟังก์ชันเพิ่มสัญญาใหม่แบบ Browser TAB
  // เพิ่มสัญญาใหม่ 1 อัน + กระโดดไป TAB นั้น (Browser Style) // คอมเมนต์: ทำให้รู้สึกเหมือนเปิดแท็บใหม่ใน browser
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ addEmptyContract
  addEmptyContract() {
    // คอมเมนต์: ประกาศฟังก์ชันเพิ่มสัญญาใหม่ 1 แท็บ

    const empty = LeadApp.createEmptyContract(); // คอมเมนต์: สร้างสัญญาเปล่าจาก template

    if (!Array.isArray(LeadApp.form.contracts)) {
      // คอมเมนต์: ถ้า contracts ยังไม่ใช่ array ให้สร้างใหม่
      LeadApp.form.contracts = []; // คอมเมนต์: เซ็ต contracts เป็นอาร์เรย์ว่าง
    } // คอมเมนต์: ปิดเงื่อนไขตรวจสอบ contracts

    LeadApp.form.contracts.push(empty); // คอมเมนต์: เพิ่มสัญญาใหม่เข้าไปในรายการ

    const newIndex = LeadApp.form.contracts.length - 1; // คอมเมนต์: หา index ของสัญญาตัวใหม่ (ตัวสุดท้าย)

    setTimeout(() => {
      // คอมเมนต์: ใช้ setTimeout เพื่อให้ Vue render TAB ให้ทันก่อนเปลี่ยนค่า
      if (window.AppState && AppState.leadTab) {
        // คอมเมนต์: เช็คว่ามีตัวแปร leadTab ให้ใช้งาน
        AppState.leadTab.value = "contract-" + newIndex; // คอมเมนต์: เซ็ต v-model ของ v-tabs ให้ไปที่แท็บสัญญาใหม่
      } // คอมเมนต์: ปิด if ตรวจสอบ AppState.leadTab
    }, 50); // คอมเมนต์: ดีเลย์ 50ms เพื่อความชัวร์ในการ render

    if (window.AppState && AppState.contractInnerTab) {
      // คอมเมนต์: ถ้ามีตัวแปรแท็บย่อยของสัญญา
      AppState.contractInnerTab.value = "all"; // คอมเมนต์: เซ็ตแท็บย่อยด้านในให้เริ่มที่ ALL
    } // คอมเมนต์: ปิด if contractInnerTab

    if (window.AppState && AppState.contractPanels) {
      // คอมเมนต์: ถ้ามีตัวแปร panels ของสัญญา
      AppState.contractPanels.value = [
        // คอมเมนต์: เซ็ตให้ panels ทั้งหมดเปิดอยู่
        "info", // คอมเมนต์: panel ข้อมูลสัญญา
        "finance", // คอมเมนต์: panel การเงิน
        "status", // คอมเมนต์: panel สถานะบัญชี
        "asset", // คอมเมนต์: panel ทรัพย์สินหลักประกัน
        "history", // คอมเมนต์: panel ประวัติย้อนหลัง
        "other", // คอมเมนต์: panel อื่น ๆ
      ]; // คอมเมนต์: ปิดอาร์เรย์รายชื่อ panels
    } // คอมเมนต์: ปิด if contractPanels

    if (window.AppNotifications && AppNotifications.show) {
      // คอมเมนต์: ถ้ามีระบบแจ้งเตือน
      AppNotifications.show("เพิ่มแท็บสัญญาใหม่เรียบร้อย"); // คอมเมนต์: แจ้งเตือนผู้ใช้ว่ามีการเพิ่มสัญญาใหม่แล้ว
    } // คอมเมนต์: ปิด if AppNotifications
  }, // คอมเมนต์: ปิดฟังก์ชัน addEmptyContract

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนรีเซ็ตฟอร์มสัญญาใหม่
  // ⭐ resetNewContractForm()                                  // คอมเมนต์: ฟังก์ชันรีเซ็ตฟอร์มสัญญาใน AppState
  // ใช้ซิงก์สัญญาเปล่าไปที่ AppState.newContractForm (ถ้ามี) // คอมเมนต์: ใช้ตอนต้องการเคลียร์ฟอร์มสัญญาแบบแยก
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ resetNewContractForm
  resetNewContractForm() {
    // คอมเมนต์: ประกาศฟังก์ชันรีเซ็ตฟอร์มสัญญาใน AppState

    if (!window.AppState || !AppState.newContractForm) {
      // คอมเมนต์: ถ้าไม่มี AppState.newContractForm ให้หยุดทำงาน
      return; // คอมเมนต์: ออกจากฟังก์ชันทันที
    } // คอมเมนต์: ปิด if ตรวจสอบ AppState.newContractForm

    const empty = LeadApp.createEmptyContract(); // คอมเมนต์: สร้างสัญญาเปล่ามาเป็นต้นแบบ

    Object.keys(empty).forEach((k) => {
      // คอมเมนต์: วนทุก key ของอ็อบเจกต์สัญญาเปล่า
      AppState.newContractForm[k] = empty[k]; // คอมเมนต์: คัดลอกค่าจาก empty ไปเก็บที่ newContractForm
    }); // คอมเมนต์: ปิดการวนลูป Object.keys
  }, // คอมเมนต์: ปิดฟังก์ชัน resetNewContractForm

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนโหลดข้อมูลจาก Dexie
  // ⭐ loadAll()                                               // คอมเมนต์: ฟังก์ชันโหลด Lead ทั้งหมดจาก IndexedDB
  // โหลด Lead ทั้งหมดจาก Dexie → Store เพื่อแสดงใน UI       // คอมเมนต์: ใช้ตอนเริ่มระบบหรือหลังจากมีการแก้ไขข้อมูล
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ loadAll
  async loadAll() {
    // คอมเมนต์: ประกาศฟังก์ชัน async สำหรับโหลดข้อมูลทั้งหมด

    try {
      // คอมเมนต์: ใช้ try/catch เพื่อดัก error
      const items = await AppDexie.lead.getAll(); // คอมเมนต์: ดึง Lead ทั้งหมดจากตาราง leads ใน Dexie
      Store.setItems("Lead", items); // คอมเมนต์: ส่งข้อมูลเข้า Store เพื่อให้ UI ใช้งาน
    } catch (err) {
      // คอมเมนต์: ถ้ามี error เกิดขึ้น
      console.error("❌ LeadApp.loadAll() error:", err); // คอมเมนต์: แสดง error ใน console เพื่อ debug
    } // คอมเมนต์: ปิด try/catch
  }, // คอมเมนต์: ปิดฟังก์ชัน loadAll

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนเพิ่ม Lead ใหม่
  // ⭐ add(formData)                                           // คอมเมนต์: ฟังก์ชันเพิ่ม Lead ใหม่
  // เพิ่มลูกค้าใหม่ลง Dexie + รีเฟรช UI                      // คอมเมนต์: ใช้ตอนกดปุ่มบันทึกในโหมดเพิ่มใหม่
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ add
  async add(formData) {
    // คอมเมนต์: ประกาศฟังก์ชัน async สำหรับเพิ่ม Lead

    try {
      // คอมเมนต์: ใช้ try/catch ป้องกัน error
      const src = formData || LeadApp.form; // คอมเมนต์: ถ้าส่ง formData มาให้ใช้ตัวนั้น ไม่งั้นใช้ฟอร์มหลักใน LeadApp

      const dataToSave = {
        // คอมเมนต์: เตรียมอ็อบเจกต์สำหรับบันทึกลงฐานข้อมูล
        ...src, // คอมเมนต์: คัดลอกทุกฟิลด์จากฟอร์ม
        id: crypto.randomUUID(), // คอมเมนต์: สร้างไอดีใหม่แบบสุ่ม UUID
        createDate: new Date().toLocaleDateString("th-TH"), // คอมเมนต์: กำหนดวันที่สร้างเป็นวันนี้
      }; // คอมเมนต์: ปิดอ็อบเจกต์ dataToSave

      await AppDexie.lead.add(dataToSave); // คอมเมนต์: บันทึกข้อมูล Lead ใหม่ลง Dexie
      await LeadApp.loadAll(); // คอมเมนต์: โหลดข้อมูลใหม่ทั้งหมดเพื่อให้ UI อัปเดต

      if (window.AppGui && AppGui.toggleMenu) {
        // คอมเมนต์: ถ้ามีโมดูล AppGui และฟังก์ชัน toggleMenu
        AppGui.toggleMenu("isOpenModalLead", false); // คอมเมนต์: ปิด dialog เพิ่ม/แก้ไข Lead
      } // คอมเมนต์: ปิด if ตรวจสอบ AppGui

      if (window.AppNotifications && AppNotifications.show) {
        // คอมเมนต์: ถ้ามีระบบแจ้งเตือน
        AppNotifications.show("เพิ่ม Lead สำเร็จ"); // คอมเมนต์: แจ้งเตือนว่าบันทึกสำเร็จ
      } // คอมเมนต์: ปิด if AppNotifications

      LeadApp.resetLeadForm(); // คอมเมนต์: รีเซ็ตฟอร์มเตรียมไว้ใช้รอบต่อไป
    } catch (err) {
      // คอมเมนต์: ถ้ามี error เกิดขึ้นระหว่างบันทึก
      console.error("❌ LeadApp.add() error:", err); // คอมเมนต์: แสดงข้อความ error ใน console
    } // คอมเมนต์: ปิด try/catch
  }, // คอมเมนต์: ปิดฟังก์ชัน add

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนอัปเดต Lead
  // ⭐ update()                                                // คอมเมนต์: ฟังก์ชันอัปเดต Lead เดิม
  // แก้ไขข้อมูล Lead เดิมใน Dexie                            // คอมเมนต์: ใช้ตอนแก้ไขข้อมูลแล้วกดบันทึก
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ update
  async update() {
    // คอมเมนต์: ประกาศฟังก์ชัน async สำหรับอัปเดต Lead

    try {
      // คอมเมนต์: ใช้ try/catch ป้องกัน error
      if (!LeadApp.form.id) {
        // คอมเมนต์: ถ้าไม่มี id แสดงว่าไม่รู้จะแก้ตัวไหน
        console.warn("⚠ LeadApp.update() ถูกเรียก แต่ไม่มี id"); // คอมเมนต์: แจ้งเตือนนักพัฒนาใน console
        return; // คอมเมนต์: หยุดทำงานไม่ทำต่อ
      } // คอมเมนต์: ปิด if ตรวจสอบ id

      await AppDexie.lead.update(LeadApp.form.id, { ...LeadApp.form }); // คอมเมนต์: ส่งข้อมูลฟอร์มไปอัปเดตใน Dexie
      await LeadApp.loadAll(); // คอมเมนต์: โหลดข้อมูลใหม่ทั้งหมดให้ UI อัปเดต

      if (window.AppGui && AppGui.toggleMenu) {
        // คอมเมนต์: ถ้ามี AppGui
        AppGui.toggleMenu("isOpenModalLead", false); // คอมเมนต์: ปิด dialog แก้ไข Lead
      } // คอมเมนต์: ปิด if AppGui

      if (window.AppNotifications && AppNotifications.show) {
        // คอมเมนต์: ถ้ามีระบบแจ้งเตือน
        AppNotifications.show("อัปเดตข้อมูล Lead เรียบร้อย"); // คอมเมนต์: แจ้งเตือนว่าการแก้ไขสำเร็จ
      } // คอมเมนต์: ปิด if AppNotifications
    } catch (err) {
      // คอมเมนต์: ถ้าเกิด error ระหว่างอัปเดต
      console.error("❌ LeadApp.update() error:", err); // คอมเมนต์: แสดง error ใน console
    } // คอมเมนต์: ปิด try/catch
  }, // คอมเมนต์: ปิดฟังก์ชัน update

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนลบ Lead
  // ⭐ delete(id)                                              // คอมเมนต์: ฟังก์ชันลบ Lead ตาม id
  // ลบ Lead ออกจาก Dexie ตาม id                               // คอมเมนต์: ใช้ตอนผู้ใช้สั่งลบลูกค้า
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ delete
  async delete(id) {
    // คอมเมนต์: ประกาศฟังก์ชัน async สำหรับลบ Lead

    try {
      // คอมเมนต์: ใช้ try/catch ดัก error
      await AppDexie.lead.delete(id); // คอมเมนต์: ลบข้อมูล Lead จาก Dexie ตาม id ที่ส่งมา
      await LeadApp.loadAll(); // คอมเมนต์: โหลดข้อมูลใหม่ให้ตารางอัปเดต

      if (window.AppNotifications && AppNotifications.show) {
        // คอมเมนต์: ถ้ามีระบบแจ้งเตือน
        AppNotifications.show("ลบข้อมูล Lead เรียบร้อย"); // คอมเมนต์: แจ้งเตือนว่าลบแล้ว
      } // คอมเมนต์: ปิด if AppNotifications
    } catch (err) {
      // คอมเมนต์: ถ้าเกิด error ระหว่างลบ
      console.error("❌ LeadApp.delete() error:", err); // คอมเมนต์: แสดง error ใน console
    } // คอมเมนต์: ปิด try/catch
  }, // คอมเมนต์: ปิดฟังก์ชัน delete

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วนเปิดฟอร์มแก้ไข Lead
  // ⭐ openEdit(lead)                                          // คอมเมนต์: ฟังก์ชันโหลด Lead เดิมเข้า form
  // โหลดข้อมูล Lead เดิมเข้า form เพื่อแก้ไข                 // คอมเมนต์: ใช้ตอนกดแก้ไขจากรายการ
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ openEdit
  openEdit(lead) {
    // คอมเมนต์: ประกาศฟังก์ชันสำหรับเตรียมฟอร์มแก้ไข Lead

    if (!lead) {
      // คอมเมนต์: ถ้าไม่ได้ส่งอ็อบเจกต์ lead เข้ามา
      console.warn("⚠ LeadApp.openEdit() ไม่ได้รับอ็อบเจกต์ lead"); // คอมเมนต์: แจ้งเตือนใน console
      return; // คอมเมนต์: หยุดทำงาน
    } // คอมเมนต์: ปิด if ตรวจสอบ lead

    Object.assign(LeadApp.form, lead); // คอมเมนต์: คัดลอกทุกฟิลด์จาก lead เข้าไปในฟอร์มหลัก

    if (!Array.isArray(LeadApp.form.contracts)) {
      // คอมเมนต์: ถ้า contracts ยังไม่ใช่อาร์เรย์
      LeadApp.form.contracts = []; // คอมเมนต์: ให้เป็นอาร์เรย์ว่างเพื่อป้องกัน error
    } // คอมเมนต์: ปิด if ตรวจสอบ contracts

    if (window.AppGui && AppGui.toggleMenu) {
      // คอมเมนต์: ถ้ามี AppGui
      AppGui.toggleMenu("isOpenModalLead", true); // คอมเมนต์: เปิด dialog แก้ไข Lead
    } // คอมเมนต์: ปิด if AppGui
  }, // คอมเมนต์: ปิดฟังก์ชัน openEdit

  // ---------------------------------------------------------- // คอมเมนต์: เส้นคั่นส่วน Alias ฟังก์ชันเก่า
  // ⭐ addLead / updateLead / deleteLead                       // คอมเมนต์: alias ไว้กันโค้ดเก่าเรียก
  // ---------------------------------------------------------- // คอมเมนต์: ปิดหัวข้อ alias
  addLead(formData) {
    // คอมเมนต์: alias เรียกไปที่ LeadApp.add
    return LeadApp.add(formData); // คอมเมนต์: ส่งต่อไปใช้ฟังก์ชัน add จริง
  }, // คอมเมนต์: ปิดฟังก์ชัน addLead

  updateLead() {
    // คอมเมนต์: alias เรียกไปที่ LeadApp.update
    return LeadApp.update(); // คอมเมนต์: ส่งต่อไปใช้ฟังก์ชัน update จริง
  }, // คอมเมนต์: ปิดฟังก์ชัน updateLead

  deleteLead(id) {
    // คอมเมนต์: alias เรียกไปที่ LeadApp.delete
    return LeadApp.delete(id); // คอมเมนต์: ส่งต่อไปใช้ฟังก์ชัน delete จริง
  }, // คอมเมนต์: ปิดฟังก์ชัน deleteLead
}; // คอมเมนต์: ปิดอ็อบเจกต์ LeadApp

// ------------------------------------------------------------ // คอมเมนต์: เส้นคั่นส่วน export
// 🌍 Export LeadApp เป็น Global ให้ไฟล์อื่นใช้งาน            // คอมเมนต์: ผูก LeadApp เข้ากับ window
// ------------------------------------------------------------ // คอมเมนต์: ปิดหัวข้อ export
window.LeadApp = LeadApp; // คอมเมนต์: ทำให้ LeadApp ใช้ได้จาก index.html และ app.js
