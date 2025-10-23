// gui.js
// ฟังก์ชันช่วย (GUI actions)

// ดึงฟังก์ชันที่จำเป็นจาก Vue CDN มาใช้งาน
const { ref, reactive, watch, computed } = window.Vue;

// ---------- ส่วนควบคุมเมนู/โมดัล/ตรรกะหน้าเว็บ ----------
const AppGui = {
  // ฟังก์ชันสลับสถานะ (เปิด/ปิด) ของเมนูหรือโมดัล
  toggleMenu: (key, force) => {
    // ตรวจสอบว่า key (ชื่อตัวแปรใน AppState) มีอยู่หรือไม่
    if (!AppState[key]) return;

    // ตั้งค่าสถานะใหม่: ถ้ามีการกำหนด 'force' ให้ใช้ค่านั้น (true/false)
    // ถ้าไม่มี 'force' ให้สลับค่าปัจจุบัน (true เป็น false, false เป็น true)
    AppState[key].value =
      typeof force === "boolean" ? force : !AppState[key].value;
  },
  // ปิดทุก State ที่ขึ้นต้นด้วย 'isMenuOpen' หรือ 'isOpenModal'
  closeAllMenus: () => {
    // วนลูปผ่านทุก Key ใน AppState
    Object.keys(AppState).forEach((key) => {
      // ตรวจสอบเฉพาะตัวแปรที่เป็นสถานะเปิด-ปิดเมนู/โมดัล
      if (key.startsWith("isMenuOpen") || key.startsWith("isOpenModal")) {
        // ถ้าตัวแปรนั้นมีอยู่และสถานะเป็น 'เปิด' (true)
        if (AppState[key] && AppState[key].value === true) {
          // ตั้งค่าให้เป็น 'ปิด' (false)
          AppState[key].value = false;
        }
      }
    });
  },
  //------------------------------------------

  // -------- ควบคุมการจัดการหน้า page และ Watchers ---------------
  // ฟังก์ชันตั้งค่าตัวแปรที่คำนวณอัตโนมัติ (Computed Properties)
  setupComputed: () => {
    // 1. คำนวณจำนวนหน้าทั้งหมด (totalPages)
    // ผลลัพธ์จะถูกเก็บไว้ใน AppState.totalPages
    AppState.totalPages = computed(() => {
      const total = Store.leadItems.length; // ดึงจำนวนรายการ Lead ทั้งหมด ที่มีอยู่ใน
      const perPage = AppState.itemsPerPage.value; // จำนวนรายการที่แสดงต่อหน้า
      // สูตรคำนวณ: ปัดขึ้น (จำนวนรวม / ต่อหน้า) และต้องมีอย่างน้อย 1 หน้า
      const pages = Math.max(Math.ceil(total / perPage), 1);
      console.log("📄 totalPages:", pages);
      return pages; // ส่งคืนจำนวนหน้าทั้งหมด
    });

    // 2. คำนวณรายการ Lead ที่ถูกแบ่งหน้าแล้ว (pagedLeads)
    // ผลลัพธ์คืออาร์เรย์ของรายการ Lead เฉพาะหน้าที่กำลังดูอยู่
    AppState.pagedLeads = computed(() => {
      const page = AppState.page.value; // เลขหน้าปัจจุบัน
      const perPage = AppState.itemsPerPage.value; // จำนวนรายการต่อหน้า
      // คำนวณดัชนีเริ่มต้น: (เลขหน้า - 1) * จำนวนต่อหน้า
      // เช่น หน้า 1: (1-1)*10 = 0. หน้า 2: (2-1)*10 = 10
      const start = (page - 1) * perPage;
      // คำนวณดัชนีสิ้นสุด: ดัชนีเริ่มต้น + จำนวนต่อหน้า
      const end = start + perPage;
      // ใช้ .slice() เพื่อตัดข้อมูลออกมาเฉพาะส่วนที่ต้องการแสดงในหน้านี้
      const sliced = Store.leadItems.slice(start, end);
      console.log("🟢 pagedLeads:", sliced);
      return sliced; // ส่งคืนรายการ Lead สำหรับหน้านี้เท่านั้น
    });
  },
  //------------------------------------------------------------
};

// export แบบ global ให้ส่วนอื่นของแอปเข้าถึงได้
window.AppGui = AppGui;

// *** AppActions และ Hotkey ถูกย้ายไปอยู่ shortcutKey.js แล้ว ***
