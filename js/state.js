// state.js
// ไฟล์นี้เก็บตัวแปรสถานะ (State) ทั่วไปของแอปพลิเคชันที่สามารถเปลี่ยนแปลงและติดตามได้ (Reactive State)

// สร้าง Object ชื่อ AppState สำหรับเก็บสถานะทั้งหมด
const AppState = {
  // -------------------------
  // UI states (สถานะของส่วนติดต่อผู้ใช้)
  // -------------------------
  isMenuOpenFiltesterSearch: Vue.ref(false), // สถานะการเปิด/ปิดเมนูค้นหาและกรอง (Ref: Vue.ref(false))
  isOpenModalLead: Vue.ref(false), // สถานะการเปิด/ปิด Modal/Popup สำหรับจัดการ Lead (Ref: Vue.ref(false))
  searchRef: Vue.ref(null), // ตัวแปร Ref สำหรับอ้างอิงถึง Element ใน DOM (มักใช้กับ <v-text-field> หรือ Input)
  leadTab: Vue.ref("basic"), // Tab ที่กำลังถูกเลือกในส่วนของ Lead (เช่น "basic", "detail")
  searchQuery: Vue.ref(""), // ตัวแปรเก็บคำค้นหา

  // -------------------------
  // Hotkeys (ปุ่มลัด)
  // -------------------------
  hotkeysEnabled: Vue.ref(true), // สถานะการเปิด/ปิดการใช้งานปุ่มลัดทั้งหมด (Ref: Vue.ref(true))
  // Map/รายการปุ่มลัดและคำสั่งที่กำหนดไว้ (Reactive: Vue.reactive({ ... }))
  hotkeyMap: Vue.reactive({
    openBot: "Alt+B", // ปุ่มลัดสำหรับเปิดบอท
    openLead: "Alt+L", // ปุ่มลัดสำหรับเปิดหน้าจัดการ Lead
    closeAll: "Alt+C", // ปุ่มลัดสำหรับปิดเมนู/โมดัลทั้งหมด
    // สามารถเพิ่มปุ่มลัดอื่น ๆ ได้ที่นี่ เช่น saveForm: "Ctrl+S"
  }),
  // -------------------------

  // ตัวจัดการเกี่ยวกับ page (Pagination States)
  // -------------------------
  page: Vue.ref(1), // หน้าปัจจุบันที่กำลังแสดงอยู่ (ค่าเริ่มต้นคือ หน้า 1)
  itemsPerPage: Vue.ref("All"), // จำนวนรายการ/การ์ด ที่จะแสดงในหนึ่งหน้า (ผูกกับ v-select ใน UI)
};

// ทำให้ AppState สามารถเข้าถึงได้จากทุกที่ใน window (Global Access)
window.AppState = AppState;
