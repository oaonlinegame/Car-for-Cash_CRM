// ------------------------------------------------------------ //  เส้นคั่นส่วนหัวของไฟล์
// 📘 โมดูล LeadApp: จัดการข้อมูลลูกค้า (Lead) + สัญญา (Contracts) //  อธิบายหน้าที่หลักของโมดูลนี้
// ------------------------------------------------------------ //  ปิดส่วนหัวของคำอธิบาย

const LeadApp = {
  //  ประกาศอ็อบเจ็กต์หลัก LeadApp สำหรับเก็บฟอร์มและฟังก์ชันทั้งหมด

  // ---------------------------------------------------------- //  เส้นคั่นส่วนฟอร์มหลัก
  // ⭐ form: ฟอร์มหลักของลูกค้า (Lead Form)                  //  ส่วนเก็บข้อมูลฟอร์ม Lead
  // ---------------------------------------------------------- //  ปิดหัวข้อฟอร์มหลัก
  form: Vue.reactive({
    //  ใช้ Vue.reactive เพื่อให้ผูกกับ UI แบบสองทางได้

    id: null, //  ไอดีของ Lead ใช้เช็คว่าเป็นเพิ่มใหม่หรือแก้ไข
    firstName: "", //  ชื่อ-นามสกุลลูกค้า หรือชื่อบริษัท
    nickName: "", //  ชื่อเล่น หรือชื่อผู้ติดต่อหลัก
    phones: "", //  เบอร์โทรหลายเบอร์คั่นด้วยจุลภาค
    address: "", //  ที่อยู่หลักของลูกค้า
    province: "", //  จังหวัดของลูกค้า
    postalCode: "", //  รหัสไปรษณีย์
    occupation: "", //  อาชีพลูกค้า
    status: "ลูกค้าใหม่", //  สถานะลูกค้า เริ่มต้นเป็นลูกค้าใหม่
    isProspect: true, //  true = ลูกค้าใหม่ที่ยังไม่เคยทำสัญญา
    prospectStage: "สนใจ", //  ขั้นตอนในกระบวนการขายเริ่มต้นเป็น “สนใจ”
    rating: 3, //  คะแนนประเมินลูกค้าเบื้องต้น 1–5
    note: "", //  หมายเหตุเพิ่มเติมเกี่ยวกับลูกค้า
    createDate: "", //  วันที่สร้าง Lead จะเซ็ตตอนบันทึก
    contracts: [], //  อาร์เรย์เก็บรายการสัญญาของลูกค้ารายนี้
  }), //  ปิดอ็อบเจ็กต์ form

  // ---------------------------------------------------------- //  เส้นคั่นส่วนรีเซ็ตฟอร์ม
  // ⭐ resetLeadForm()                                         //  ฟังก์ชันรีเซ็ตฟอร์มลูกค้า
  // รีเซ็ตฟอร์มลูกค้ากลับเป็นค่าเริ่มต้น                   //  อธิบายสั้น ๆ ว่าทำอะไร
  // ---------------------------------------------------------- //  ปิดหัวข้อ resetLeadForm
  resetLeadForm() {
    //  ประกาศฟังก์ชันรีเซ็ตฟอร์ม Lead

    LeadApp.form.id = null; //  ล้างค่า id ให้เป็น null
    LeadApp.form.firstName = ""; //  ล้างชื่อ-นามสกุล
    LeadApp.form.nickName = ""; //  ล้างชื่อเล่น
    LeadApp.form.phones = ""; //  ล้างเบอร์โทรทั้งหมด
    LeadApp.form.address = ""; //  ล้างที่อยู่
    LeadApp.form.province = ""; //  ล้างจังหวัด
    LeadApp.form.postalCode = ""; //  ล้างรหัสไปรษณีย์
    LeadApp.form.occupation = ""; //  ล้างอาชีพ
    LeadApp.form.status = "ลูกค้าใหม่"; //  เซ็ตสถานะกลับเป็นลูกค้าใหม่
    LeadApp.form.isProspect = true; //  เซ็ตให้เป็นลูกค้าใหม่
    LeadApp.form.prospectStage = "สนใจ"; //  เซ็ตขั้นตอนกลับเป็น “สนใจ”
    LeadApp.form.rating = 3; //  เซ็ตคะแนนกลับเป็น 3 ดาว
    LeadApp.form.note = ""; //  ล้างหมายเหตุ
    LeadApp.form.createDate = new Date().toLocaleDateString("th-TH"); //  เซ็ตวันที่สร้างเป็นวันนี้
    LeadApp.form.contracts = []; //  ล้างรายการสัญญาทั้งหมด
  }, //  ปิดฟังก์ชัน resetLeadForm

  // ---------------------------------------------------------- //  เส้นคั่นส่วนสร้างสัญญาเปล่า
  // ⭐ createEmptyContract()                                   //  ฟังก์ชันสร้างโครงสัญญาเปล่า
  // สร้างโครงสัญญาเปล่า 1 อัน (ใช้เป็น template ของ TAB ใหม่) //  ใช้เวลาจะเพิ่มสัญญาใหม่
  // ---------------------------------------------------------- //  ปิดหัวข้อ createEmptyContract
  createEmptyContract() {
    //  ประกาศฟังก์ชันสร้างสัญญาเปล่า

    return {
      //  คืนค่าเป็นอ็อบเจกต์สัญญาเปล่า 1 ชุด
      contractId: "", //  รหัสสัญญา (ว่าง = สัญญาใหม่)
      leadId: "", //  รหัสลูกค้าที่สัญญานี้สังกัด
      type: "", //  ประเภทสินเชื่อ เช่น จำนำทะเบียน
      carid: "", //  รหัสรถถ้ามีระบบรถแยก
      carbrandid: "", //  รหัสยี่ห้อรถถ้ามี
      statusAccount: "ปกติ", //  สถานะบัญชีเริ่มต้นเป็นปกติ
      statusOverdue: 0, //  จำนวนงวดที่ค้างชำระเริ่มต้น 0
      contractDate: new Date().toISOString().substr(0, 10), //  วันที่ทำสัญญาเริ่มต้นเป็นวันนี้ (รูปแบบ YYYY-MM-DD)
      expireDate: "", //  วันที่ครบสัญญา
      grade: "", //  เกรดลูกค้า
      campaign: "", //  ชื่อแคมเปญ
      loanAmount: 0, //  ยอดขอสินเชื่อ
      approvedAmount: 0, //  ยอดอนุมัติสินเชื่อ
      interestRate: 0, //  อัตราดอกเบี้ย %
      interestType: "", //  ประเภทดอกเบี้ย เช่น flat หรือ effective
      term: 0, //  จำนวนงวดทั้งหมด
      installmentAmount: 0, //  ค่างวดที่ต้องจ่ายต่อเดือน
      installmentVAT: 0, //  VAT ของค่างวด
      paymentDay: 1, //  วันที่ต้องชำระในแต่ละเดือน (1–31)
      paidInstallments: 0, //  จำนวนงวดที่จ่ายแล้ว
      remainingInstallments: 0, //  จำนวนงวดคงเหลือ
      OVD: 0, //  จำนวนงวดที่ค้างชำระ (Overdue)
      last3Payments: [], //  สถานะชำระย้อนหลัง 3 เดือน
      lastUpdate: "", //  วันที่อัปเดตข้อมูลล่าสุด
      outstanding: 0, //  ยอดหนี้คงเหลือ
      unrealized: 0, //  ดอกเบี้ยค้างรับ
      closeAmount: 0, //  ยอดปิดบัญชี
      closeDate: "", //  วันที่ปิดบัญชี
      financeName: "", //  ชื่อไฟแนนซ์
      remark: "", //  หมายเหตุของสัญญา
      isSubContract: false, //  true = เป็นสัญญาย่อย
      assets: [], //  รายการทรัพย์สินหลักประกัน
      subContracts: [], //  รายการสัญญาย่อย
    }; //  ปิดอ็อบเจกต์ที่คืนค่า
  }, //  ปิดฟังก์ชัน createEmptyContract

  // ---------------------------------------------------------- //  เส้นคั่นส่วนเพิ่มสัญญาใหม่
  // ⭐ addEmptyContract()                                      //  ฟังก์ชันเพิ่มสัญญาใหม่แบบ Browser TAB
  // เพิ่มสัญญาใหม่ 1 อัน + กระโดดไป TAB นั้น (Browser Style) //  ทำให้รู้สึกเหมือนเปิดแท็บใหม่ใน browser
  // ---------------------------------------------------------- //  ปิดหัวข้อ addEmptyContract
  addEmptyContract() {
    //  ประกาศฟังก์ชันเพิ่มสัญญาใหม่ 1 แท็บ

    const empty = LeadApp.createEmptyContract(); //  สร้างสัญญาเปล่าจาก template

    if (!Array.isArray(LeadApp.form.contracts)) {
      //  ถ้า contracts ยังไม่ใช่ array ให้สร้างใหม่
      LeadApp.form.contracts = []; //  เซ็ต contracts เป็นอาร์เรย์ว่าง
    } //  ปิดเงื่อนไขตรวจสอบ contracts

    LeadApp.form.contracts.push(empty); //  เพิ่มสัญญาใหม่เข้าไปในรายการ

    const newIndex = LeadApp.form.contracts.length - 1; //  หา index ของสัญญาตัวใหม่ (ตัวสุดท้าย)

    setTimeout(() => {
      //  ใช้ setTimeout เพื่อให้ Vue render TAB ให้ทันก่อนเปลี่ยนค่า
      if (window.AppState && AppState.leadTab) {
        //  เช็คว่ามีตัวแปร leadTab ให้ใช้งาน
        AppState.leadTab.value = "contract-" + newIndex; //  เซ็ต v-model ของ v-tabs ให้ไปที่แท็บสัญญาใหม่
      } //  ปิด if ตรวจสอบ AppState.leadTab
    }, 50); //  ดีเลย์ 50ms เพื่อความชัวร์ในการ render

    if (window.AppState && AppState.contractInnerTab) {
      //  ถ้ามีตัวแปรแท็บย่อยของสัญญา
      AppState.contractInnerTab.value = "all"; //  เซ็ตแท็บย่อยด้านในให้เริ่มที่ ALL
    } //  ปิด if contractInnerTab

    if (window.AppState && AppState.contractPanels) {
      //  ถ้ามีตัวแปร panels ของสัญญา
      AppState.contractPanels.value = [
        //  เซ็ตให้ panels ทั้งหมดเปิดอยู่
        "info", //  panel ข้อมูลสัญญา
        "finance", //  panel การเงิน
        "status", //  panel สถานะบัญชี
        "asset", //  panel ทรัพย์สินหลักประกัน
        "history", //  panel ประวัติย้อนหลัง
        "other", //  panel อื่น ๆ
      ]; //  ปิดอาร์เรย์รายชื่อ panels
    } //  ปิด if contractPanels

    if (window.AppNotifications && AppNotifications.show) {
      //  ถ้ามีระบบแจ้งเตือน
      AppNotifications.show("เพิ่มแท็บสัญญาใหม่เรียบร้อย"); //  แจ้งเตือนผู้ใช้ว่ามีการเพิ่มสัญญาใหม่แล้ว
    } //  ปิด if AppNotifications
  }, //  ปิดฟังก์ชัน addEmptyContract

  // ---------------------------------------------------------- //  เส้นคั่นส่วนรีเซ็ตฟอร์มสัญญาใหม่
  // ⭐ resetNewContractForm()                                  //  ฟังก์ชันรีเซ็ตฟอร์มสัญญาใน AppState
  // ใช้ซิงก์สัญญาเปล่าไปที่ AppState.newContractForm (ถ้ามี) //  ใช้ตอนต้องการเคลียร์ฟอร์มสัญญาแบบแยก
  // ---------------------------------------------------------- //  ปิดหัวข้อ resetNewContractForm
  resetNewContractForm() {
    //  ประกาศฟังก์ชันรีเซ็ตฟอร์มสัญญาใน AppState

    if (!window.AppState || !AppState.newContractForm) {
      //  ถ้าไม่มี AppState.newContractForm ให้หยุดทำงาน
      return; //  ออกจากฟังก์ชันทันที
    } //  ปิด if ตรวจสอบ AppState.newContractForm

    const empty = LeadApp.createEmptyContract(); //  สร้างสัญญาเปล่ามาเป็นต้นแบบ

    Object.keys(empty).forEach((k) => {
      //  วนทุก key ของอ็อบเจกต์สัญญาเปล่า
      AppState.newContractForm[k] = empty[k]; //  คัดลอกค่าจาก empty ไปเก็บที่ newContractForm
    }); //  ปิดการวนลูป Object.keys
  }, //  ปิดฟังก์ชัน resetNewContractForm

  // ---------------------------------------------------------- //  เส้นคั่นส่วนโหลดข้อมูลจาก Dexie
  // ⭐ loadAll()                                               //  ฟังก์ชันโหลด Lead ทั้งหมดจาก IndexedDB
  // โหลด Lead ทั้งหมดจาก Dexie → Store เพื่อแสดงใน UI       //  ใช้ตอนเริ่มระบบหรือหลังจากมีการแก้ไขข้อมูล
  // ---------------------------------------------------------- //  ปิดหัวข้อ loadAll
  async loadAll() {
    //  ประกาศฟังก์ชัน async สำหรับโหลดข้อมูลทั้งหมด

    try {
      //  ใช้ try/catch เพื่อดัก error
      const items = await AppDexie.lead.getAll(); //  ดึง Lead ทั้งหมดจากตาราง leads ใน Dexie
      Store.setItems("Lead", items); //  ส่งข้อมูลเข้า Store เพื่อให้ UI ใช้งาน
    } catch (err) {
      //  ถ้ามี error เกิดขึ้น
      console.error("❌ LeadApp.loadAll() error:", err); //  แสดง error ใน console เพื่อ debug
    } //  ปิด try/catch
  }, //  ปิดฟังก์ชัน loadAll

  // ---------------------------------------------------------- //  เส้นคั่นส่วนเพิ่ม Lead ใหม่
  // ⭐ add(formData)                                           //  ฟังก์ชันเพิ่ม Lead ใหม่
  // เพิ่มลูกค้าใหม่ลง Dexie + รีเฟรช UI                      //  ใช้ตอนกดปุ่มบันทึกในโหมดเพิ่มใหม่
  // ---------------------------------------------------------- //  ปิดหัวข้อ add
  async add(formData) {
    //  ประกาศฟังก์ชัน async สำหรับเพิ่ม Lead

    try {
      //  ใช้ try/catch ป้องกัน error
      const src = formData || LeadApp.form; //  ถ้าส่ง formData มาให้ใช้ตัวนั้น ไม่งั้นใช้ฟอร์มหลักใน LeadApp

      const dataToSave = {
        //  เตรียมอ็อบเจกต์สำหรับบันทึกลงฐานข้อมูล
        ...src, //  คัดลอกทุกฟิลด์จากฟอร์ม
        id: crypto.randomUUID(), //  สร้างไอดีใหม่แบบสุ่ม UUID
        createDate: new Date().toLocaleDateString("th-TH"), //  กำหนดวันที่สร้างเป็นวันนี้
      }; //  ปิดอ็อบเจกต์ dataToSave

      await AppDexie.lead.add(dataToSave); //  บันทึกข้อมูล Lead ใหม่ลง Dexie
      await LeadApp.loadAll(); //  โหลดข้อมูลใหม่ทั้งหมดเพื่อให้ UI อัปเดต

      if (window.AppGui && AppGui.toggleMenu) {
        //  ถ้ามีโมดูล AppGui และฟังก์ชัน toggleMenu
        AppGui.toggleMenu("isOpenModalLead", false); //  ปิด dialog เพิ่ม/แก้ไข Lead
      } //  ปิด if ตรวจสอบ AppGui

      if (window.AppNotifications && AppNotifications.show) {
        //  ถ้ามีระบบแจ้งเตือน
        AppNotifications.show("เพิ่ม Lead สำเร็จ"); //  แจ้งเตือนว่าบันทึกสำเร็จ
      } //  ปิด if AppNotifications

      LeadApp.resetLeadForm(); //  รีเซ็ตฟอร์มเตรียมไว้ใช้รอบต่อไป
    } catch (err) {
      //  ถ้ามี error เกิดขึ้นระหว่างบันทึก
      console.error("❌ LeadApp.add() error:", err); //  แสดงข้อความ error ใน console
    } //  ปิด try/catch
  }, //  ปิดฟังก์ชัน add

  // ---------------------------------------------------------- //  เส้นคั่นส่วนอัปเดต Lead
  // ⭐ update()                                                //  ฟังก์ชันอัปเดต Lead เดิม
  // แก้ไขข้อมูล Lead เดิมใน Dexie                            //  ใช้ตอนแก้ไขข้อมูลแล้วกดบันทึก
  // ---------------------------------------------------------- //  ปิดหัวข้อ update
  async update() {
    //  ประกาศฟังก์ชัน async สำหรับอัปเดต Lead

    try {
      //  ใช้ try/catch ป้องกัน error
      if (!LeadApp.form.id) {
        //  ถ้าไม่มี id แสดงว่าไม่รู้จะแก้ตัวไหน
        console.warn("⚠ LeadApp.update() ถูกเรียก แต่ไม่มี id"); //  แจ้งเตือนนักพัฒนาใน console
        return; //  หยุดทำงานไม่ทำต่อ
      } //  ปิด if ตรวจสอบ id

      await AppDexie.lead.update(LeadApp.form.id, { ...LeadApp.form }); //  ส่งข้อมูลฟอร์มไปอัปเดตใน Dexie
      await LeadApp.loadAll(); //  โหลดข้อมูลใหม่ทั้งหมดให้ UI อัปเดต

      if (window.AppGui && AppGui.toggleMenu) {
        //  ถ้ามี AppGui
        AppGui.toggleMenu("isOpenModalLead", false); //  ปิด dialog แก้ไข Lead
      } //  ปิด if AppGui

      if (window.AppNotifications && AppNotifications.show) {
        //  ถ้ามีระบบแจ้งเตือน
        AppNotifications.show("อัปเดตข้อมูล Lead เรียบร้อย"); //  แจ้งเตือนว่าการแก้ไขสำเร็จ
      } //  ปิด if AppNotifications
    } catch (err) {
      //  ถ้าเกิด error ระหว่างอัปเดต
      console.error("❌ LeadApp.update() error:", err); //  แสดง error ใน console
    } //  ปิด try/catch
  }, //  ปิดฟังก์ชัน update

  // ---------------------------------------------------------- //  เส้นคั่นส่วนลบ Lead
  // ⭐ delete(id)                                              //  ฟังก์ชันลบ Lead ตาม id
  // ลบ Lead ออกจาก Dexie ตาม id                               //  ใช้ตอนผู้ใช้สั่งลบลูกค้า
  // ---------------------------------------------------------- //  ปิดหัวข้อ delete
  async delete(id) {
    //  ประกาศฟังก์ชัน async สำหรับลบ Lead

    try {
      //  ใช้ try/catch ดัก error
      await AppDexie.lead.delete(id); //  ลบข้อมูล Lead จาก Dexie ตาม id ที่ส่งมา
      await LeadApp.loadAll(); //  โหลดข้อมูลใหม่ให้ตารางอัปเดต

      if (window.AppNotifications && AppNotifications.show) {
        //  ถ้ามีระบบแจ้งเตือน
        AppNotifications.show("ลบข้อมูล Lead เรียบร้อย"); //  แจ้งเตือนว่าลบแล้ว
      } //  ปิด if AppNotifications
    } catch (err) {
      //  ถ้าเกิด error ระหว่างลบ
      console.error("❌ LeadApp.delete() error:", err); //  แสดง error ใน console
    } //  ปิด try/catch
  }, //  ปิดฟังก์ชัน delete

  // ---------------------------------------------------------- //  เส้นคั่นส่วนเปิดฟอร์มแก้ไข Lead
  // ⭐ openEdit(lead)                                          //  ฟังก์ชันโหลด Lead เดิมเข้า form
  // โหลดข้อมูล Lead เดิมเข้า form เพื่อแก้ไข                 //  ใช้ตอนกดแก้ไขจากรายการ
  // ---------------------------------------------------------- //  ปิดหัวข้อ openEdit
  openEdit(lead) {
    //  ประกาศฟังก์ชันสำหรับเตรียมฟอร์มแก้ไข Lead

    if (!lead) {
      //  ถ้าไม่ได้ส่งอ็อบเจกต์ lead เข้ามา
      console.warn("⚠ LeadApp.openEdit() ไม่ได้รับอ็อบเจกต์ lead"); //  แจ้งเตือนใน console
      return; //  หยุดทำงาน
    } //  ปิด if ตรวจสอบ lead

    Object.assign(LeadApp.form, lead); //  คัดลอกทุกฟิลด์จาก lead เข้าไปในฟอร์มหลัก

    if (!Array.isArray(LeadApp.form.contracts)) {
      //  ถ้า contracts ยังไม่ใช่อาร์เรย์
      LeadApp.form.contracts = []; //  ให้เป็นอาร์เรย์ว่างเพื่อป้องกัน error
    } //  ปิด if ตรวจสอบ contracts

    if (window.AppGui && AppGui.toggleMenu) {
      //  ถ้ามี AppGui
      AppGui.toggleMenu("isOpenModalLead", true); //  เปิด dialog แก้ไข Lead
    } //  ปิด if AppGui
  }, //  ปิดฟังก์ชัน openEdit

  // ---------------------------------------------------------- //  เส้นคั่นส่วน Alias ฟังก์ชันเก่า
  // ⭐ addLead / updateLead / deleteLead                       //  alias ไว้กันโค้ดเก่าเรียก
  // ---------------------------------------------------------- //  ปิดหัวข้อ alias
  addLead(formData) {
    //  alias เรียกไปที่ LeadApp.add
    return LeadApp.add(formData); //  ส่งต่อไปใช้ฟังก์ชัน add จริง
  }, //  ปิดฟังก์ชัน addLead

  updateLead() {
    //  alias เรียกไปที่ LeadApp.update
    return LeadApp.update(); //  ส่งต่อไปใช้ฟังก์ชัน update จริง
  }, //  ปิดฟังก์ชัน updateLead

  deleteLead(id) {
    //  alias เรียกไปที่ LeadApp.delete
    return LeadApp.delete(id); //  ส่งต่อไปใช้ฟังก์ชัน delete จริง
  }, //  ปิดฟังก์ชัน deleteLead

  // ---------------------------------------------------------- //  เส้นคั่นส่วนจัดการอาชีพ (Occupation)
  // ⭐ handleAddOccupation(newVal)                             //  ฟังก์ชันจัดการเมื่อผู้ใช้พิมพ์และกด Enter
  // ใช้เพิ่มอาชีพใหม่เข้าในรายการ (Wrapper)                    //  เรียกใช้ฟังก์ชันกลางจาก Utils
  // ---------------------------------------------------------- //  ปิดหัวข้อ handleAddOccupation
  handleAddOccupation(newVal) {
    //  ประกาศฟังก์ชันสำหรับเพิ่มอาชีพ
    //  เรียกใช้ฟังก์ชันกลางใน Utils เพื่อเพิ่มรายการอาชีพ
    Utils.addUniqueItemToRef(AppState.occupationItems, newVal, "อาชีพ"); //  เรียก Utils เพื่อเพิ่มใน AppState.occupationItems
    LeadApp.form.occupation = String(newVal || "").trim(); //  เซ็ตค่าในฟอร์มให้ตรงกับค่าที่เลือก/เพิ่ม
  }, //  ปิดฟังก์ชัน handleAddOccupation
}; //  ปิดอ็อบเจกต์ LeadApp

// ------------------------------------------------------------ //  เส้นคั่นส่วน export
// 🌍 Export LeadApp เป็น Global ให้ไฟล์อื่นใช้งาน            //  ผูก LeadApp เข้ากับ window
// ------------------------------------------------------------ //  ปิดหัวข้อ export
window.LeadApp = LeadApp; //  ทำให้ LeadApp ใช้ได้จาก index.html และ app.js
