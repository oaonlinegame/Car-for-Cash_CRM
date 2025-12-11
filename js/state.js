// state.js
// --------------------------------------------------------
// 📘 ไฟล์นี้เก็บสถานะ (State) ทั้งหมดของระบบ
// ใช้กับ Vue 3 Composition API (ref/reactive)
// ไม่มีการใช้งาน LocalStorage อีกต่อไป
// --------------------------------------------------------

// สร้างอ็อบเจกต์ AppState เก็บสถานะ UI และค่าภายในระบบ
const AppState = {
  // ------------------------------------------------------
  // 🧭 UI states: สถานะเปิด/ปิดเมนูและ modal ต่าง ๆ
  // ------------------------------------------------------
  isMenuOpenFilterSearch: Vue.ref(false), // เปิด/ปิดเมนูตัวกรองค้นหา
  isOpenModalLead: Vue.ref(false), // เปิด/ปิด modal เพิ่ม Lead
  isOpenSubContractDialog: Vue.ref(false), // เปิด/ปิด modal ย่อย สัญญา
  isOpenModalLeadAutoFill: Vue.ref(false), // เปิด/ปิด modal autofill lead
  isOpenModalLog: Vue.ref(false), // เปิด/ปิด modal บันทึกการโทร/ติดตาม
  isOpenModalRecordCallResult: Vue.ref(false), // เปิด/ปิด modal บันทึกผลการโทร
  isOpenModalCarSettings: Vue.ref(false), // เปิด/ปิด modal การตั้งค่าข้อมูลรถยนต์
  callResultTab: Vue.ref("conversation"), // แท็บของ modal บันทึกผลการโทร (conversation/result)
  carSettingTab: Vue.ref("price_list"), // แท็บของ modal การตั้งค่าข้อมูลรถยนต์ (price_list/other_settings)
  isOpenModalCarPriceSelector: Vue.ref(false), // เปิด/ปิด modal เลือกราคากลางรถยนต์
  // ------------------------------------------------------
  // 🛠️ General Utility States: ค่าสำหรับฟังก์ชันพิเศษ
  // ------------------------------------------------------
  occupationItems: Vue.ref([
    // [ใหม่] รายการอาชีพที่ใช้ใน combobox (สามารถเพิ่มเองได้)
    "พนักงานบริษัท", // อาชีพเริ่มต้น: พนักงานบริษัท
    "เจ้าของกิจการ", // อาชีพเริ่มต้น: เจ้าของกิจการ
    "ข้าราชการ/รัฐวิสาหกิจ", // อาชีพเริ่มต้น: ข้าราชการ/รัฐวิสาหกิจ
    "รับจ้างทั่วไป", // อาชีพเริ่มต้น: รับจ้างทั่วไป
    "นักเรียน/นักศึกษา", // อาชีพเริ่มต้น: นักเรียน/นักศึกษา
    "เกษตรกร", // อาชีพเริ่มต้น: เกษตรกร
    "ว่างงาน", // อาชีพเริ่มต้น: ว่างงาน
  ]), // ปิด occupationItems

  // ------------------------------------------------------
  // 🔍 Search
  // ------------------------------------------------------
  searchRef: Vue.ref(null), // อ้างอิงช่องค้นหา (ใช้เป็น activator)
  searchQuery: Vue.ref(""), // คำค้นหาในช่อง Search หลัก
  searchQueryDebounced: Vue.ref(""), // ค่าค้นหาที่ถูกหน่วงเวลา (Debounced)

  // ------------------------------------------------------
  // 🎹 Hotkey (คีย์ลัด)
  // ------------------------------------------------------
  hotkeysEnabled: Vue.ref(true), // เปิด/ปิดระบบปุ่มลัด
  hotkeyMap: Vue.reactive({
    // mapping ปุ่มลัด → action
    openLead: "Alt+L", // เปิด modal lead
    closeAll: "Alt+C", // ปิดทุกเมนู
    openBot: "Alt+B", // เปิดระบบบอท
  }),

  // ------------------------------------------------------
  // 📄 Pagination (ระบบแบ่งหน้า)
  // ------------------------------------------------------
  page: Vue.ref(1), // หน้าปัจจุบัน
  itemsPerPage: Vue.ref(10), // จำนวนรายการต่อหน้า (5,10,20 หรือ All)
  totalPages: Vue.ref(1), // จำนวนหน้าทั้งหมด
  pagedLeads: Vue.ref([]), // รายการ lead เฉพาะหน้าปัจจุบัน

  // ------------------------------------------------------
  // 📌 filteredLeads (ค่าสำหรับเก็บข้อมูลหลังกรอง)
  // หมายเหตุ: จะถูกตั้งค่าใน gui.js → setupComputed()
  // ------------------------------------------------------
  filteredLeads: Vue.ref([]), // รายการที่ผ่านการค้นหาแล้ว

  // lead dialog
  Switch_newCustomer: Vue.ref(false),
  // ------------------------------------------------------
  // 🆕 Contract Tabs (Browser-style TAB ระดับที่ 1)
  // ------------------------------------------------------
  contractTab: Vue.ref("new"), // แท็บของสัญญา (#1,#2,+) ค่าเริ่มต้น = new (แท็บ +)

  // ------------------------------------------------------
  // 🆕 Contract Inner Tabs (TAB ระดับที่ 2 → ALL/info/finance/...)
  // ------------------------------------------------------
  contractInnerTab: Vue.ref("all"), // ค่าเริ่มต้นอยู่ที่ ALL

  // ------------------------------------------------------
  // 🆕 Contract Expansion Panels (ใช้ใน TAB ALL)
  // เปิดเป็นค่าเริ่มต้นทั้งหมด แต่ผู้ใช้พับได้
  // ------------------------------------------------------
  contractPanels: Vue.ref([
    "info", // ข้อมูลสัญญา
    "finance", // การเงิน
    "status", // สถานะบัญชี
    "asset", // ทรัพย์สิน
    "history", // ประวัติย้อนหลัง
    "other", // อื่น ๆ
  ]),

  // ------------------------------------------------------
  // 🆕 ฟอร์มสัญญาใหม่ (ใช้ตอนกด TAB +)
  // ------------------------------------------------------
  newContractForm: Vue.reactive({}), // จะถูก reset ทุกครั้งเวลาเปิด TAB +

  // ------------------------------------------------------
  // 🆕 ฟังก์ชัน reset UI สัญญาทั้งหมด
  // เรียกใช้ทุกครั้งเมื่อเปิด modal lead
  // ------------------------------------------------------
  resetContractUI() {
    // รีเซ็ตแท็บสัญญาให้เปิด TAB "+"
    this.contractTab.value = this.contractTab.value = "new";

    // รีเซ็ตแท็บย่อยให้ไปที่ ALL
    this.contractInnerTab.value = "all";

    // รีเซ็ต Expansion Panels ให้เปิดทุกอันเป็นค่าเริ่มต้น
    this.contractPanels.value = [
      "info",
      "finance",
      "status",
      "asset",
      "history",
      "other",
    ];

    // ล้างฟอร์มสัญญาใหม่
    if (typeof LeadApp?.resetNewContractForm === "function") {
      LeadApp.resetNewContractForm(); // เรียกจาก LeadApp (จะเพิ่มในไฟล์ lead.js)
    }
  },
  // ⭐ แท็บของ Modal Lead (leadInfo / contracts)
  leadTab: Vue.ref("leadInfo"), // ค่าเริ่มต้นอยู่ที่แท็บข้อมูลลูกค้า
  // ⭐ แท็บของสัญญาใน Modal Lead (ใช้เก็บ contract.id) // [ใหม่] เก็บ ID ของสัญญาที่กำลังถูกเปิดอยู่
  activeContractTab: Vue.ref(null), // [ใหม่] ค่าเริ่มต้นเป็น null หรือ ID ของสัญญาแรกเมื่อเปิด Modal
  // ⭐ เมื่อเปิด modal lead ครั้งแรก → สร้างแท็บสัญญาเปล่าให้ 1 อัน
  onOpenLeadDialog() {
    // ถ้ายังไม่มีสัญญาเลย → เพิ่ม tab เปล่า 1 อัน
    if (!LeadApp.form.contracts || LeadApp.form.contracts.length === 0) {
      LeadApp.addEmptyContract(); // ← ใช้ฟังก์ชันที่มีอยู่แล้ว
    }

    // ให้ TAB ไปที่สัญญาแรกแทน leadInfo ถ้าต้องการ
    AppState.leadTab.value = "contract-0";
  },
};

// --------------------------------------------------------
// 🌍 export สู่ global ให้ไฟล์อื่นใช้งานได้
// --------------------------------------------------------
window.AppState = AppState;
