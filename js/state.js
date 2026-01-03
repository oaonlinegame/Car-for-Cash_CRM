// js/state.js
// --------------------------------------------------------
// 📘 UI State Container (ตัวแปรสถานะ UI เท่านั้น)
// --------------------------------------------------------

const AppState = {
  // ------------------------------------------------------
  // 🧭 สถานะการแสดงผล (เปิด/ปิด Modals และ Menus)
  // ------------------------------------------------------
  isMenuOpenFilterSearch: Vue.ref(false), // เมนูตัวกรองค้นหา
  isOpenModalLead: Vue.ref(false), // หน้าต่างเพิ่ม/แก้ไข Lead
  isOpenSubContractDialog: Vue.ref(false), // หน้าต่างสัญญาย่อย
  isOpenModalLeadAutoFill: Vue.ref(false), // หน้าต่าง Autofill ข้อมูล
  isOpenModalLog: Vue.ref(false), // หน้าต่างบันทึก Log
  isOpenModalRecordCallResult: Vue.ref(false), // หน้าต่างบันทึกผลการโทร
  isOpenModalCarSettings: Vue.ref(false), // หน้าต่างตั้งค่ารถยนต์
  isOpenModalCarPriceSelector: Vue.ref(false), // หน้าต่างเลือกราคากลาง

  // ------------------------------------------------------
  // 📋 สถานะ Dialog และ Dropdown ต่างๆ
  // ------------------------------------------------------
  manageDropdownDialog: Vue.ref(false), // ✅ ต้องใช้ Vue.ref() เพื่อให้ Toggle ได้
  manageDropdownTab: Vue.ref("occupationOptions"), // แท็บในหน้าจัดการรายการดรอปดาวน์
  tempDropdownInput: Vue.ref(""), // ข้อความในช่องกรอกเพิ่มรายการดรอปดาวน์
  draggedItemIndex: Vue.ref(null), // ดัชนีของรายการที่กำลังถูกลาก

  // ------------------------------------------------------
  // 📑 สถานะแท็บและการนำทาง (Tabs & Navigation)
  // ------------------------------------------------------
  leadTab: Vue.ref("leadInfo"), // แท็บหลักในหน้าต่าง Lead (ข้อมูลลูกค้า / สัญญา)
  activeContractTab: Vue.ref(null), // ID ของสัญญาที่กำลังดูอยู่
  callResultTab: Vue.ref("conversation"), // แท็บในหน้าบันทึกผลการโทร
  carSettingTab: Vue.ref("price_list"), // แท็บในหน้าตั้งค่ารถยนต์

  // สถานะแท็บย่อยของสัญญา (Contract Inner Tabs)
  contractTab: Vue.ref("new"), // แท็บสัญญา เช่น #1, #2, หรือ new (สร้างใหม่)
  contractInnerTab: Vue.ref("all"), // แท็บย่อยภายในสัญญา เช่น info, finance
  contractPanels: Vue.ref([
    // รายชื่อ Panel ที่เปิดอยู่ (Expansion Panels)
    "info",
    "finance",
    "status",
    "asset",
    "history",
    "other",
  ]),

  // ------------------------------------------------------
  // 📝 ฟอร์มชั่วคราว (Temporary Form State)
  // ------------------------------------------------------
  newContractForm: Vue.reactive({}), // เก็บข้อมูลฟอร์มสัญญาใหม่ (ชั่วคราว)
  Switch_newCustomer: Vue.ref(false), // สวิตช์เลือกสถานะลูกค้าใหม่ใน Dialog

  // ------------------------------------------------------
  // 🔍 สถานะการค้นหา (Search State)
  // ------------------------------------------------------
  searchRef: Vue.ref(null), // อ้างอิง Element ช่องค้นหา
  searchQuery: Vue.ref(""), // คำค้นหาปัจจุบัน
  searchQueryDebounced: Vue.ref(""), // คำค้นหาที่ผ่านการหน่วงเวลา (Debounce) แล้ว

  // ------------------------------------------------------
  // 📄 สถานะการแบ่งหน้า (Pagination) [ปรับปรุงใหม่]
  // ------------------------------------------------------
  page: Vue.ref(1), // หน้าปัจจุบัน
  itemsPerPage: Vue.ref(10), // จำนวนรายการต่อหน้า
  totalPages: Vue.ref(1), // จำนวนหน้าทั้งหมด
  totalItems: Vue.ref(0), // ✅ [เพิ่มใหม่] เก็บจำนวนรายการทั้งหมดใน DB (เพื่อนับหน้า)

  // ข้อมูลผลลัพธ์ที่คำนวณแล้ว (ถูกจัดการโดย gui.js)
  pagedLeads: Vue.ref([]), // รายการ Lead ในหน้าปัจจุบัน
  filteredLeads: Vue.ref([]), // รายการ Lead ทั้งหมดที่ผ่านการกรอง (อาจไม่ได้ใช้แล้ว แต่เก็บไว้กัน Error)

  // ------------------------------------------------------
  // 🎹 สถานะระบบ (System State)
  // ------------------------------------------------------
  hotkeysEnabled: Vue.ref(true), // เปิด/ปิด การใช้งานคีย์ลัด
  hotkeyMap: Vue.reactive({
    // การจับคู่ปุ่มคีย์ลัด
    openLead: "Alt+L",
    closeAll: "Alt+C",
    openBot: "Alt+B",
  }),
};

// ส่งออกให้ไฟล์อื่นเรียกใช้ได้ผ่าน window
window.AppState = AppState;
