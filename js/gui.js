// gui.js
// --------------------------------------------------------
// 📘 ไฟล์นี้รวมฟังก์ชันที่เกี่ยวกับการจัดการ UI (User Interface)
// เช่น เปิด/ปิดเมนู, เปลี่ยนหน้า, และคำนวณค่าต่าง ๆ ของหน้า
// --------------------------------------------------------

// --------------------------------------------------------
// 🔧 ดึงเครื่องมือหลักจาก Vue (ผ่าน CDN)
// --------------------------------------------------------
// ref: ตัวแปรที่ reactive (เปลี่ยนค่าแล้ว UI อัปเดต)
// reactive: สร้าง object ที่ reactive ได้
// watch: เฝ้าดูค่าที่เปลี่ยน เพื่อทำบางอย่างอัตโนมัติ
// computed: ค่าที่คำนวณได้จากข้อมูลอื่น (auto update)
const { ref, reactive, watch, computed } = window.Vue;

// --------------------------------------------------------
// 🧰 ป้องกัน error: ถ้ายังไม่มี Utils ให้สร้าง object เปล่าไว้ก่อน
// --------------------------------------------------------
window.Utils = window.Utils || {}; // ตรวจสอบว่ามี Utils แล้วหรือยัง ถ้ายัง → สร้างใหม่

// ✅ ฟังก์ชันกรองลีด (เผื่อยังไม่มีไฟล์ utils.js จริง)
// ใช้สำหรับกรองข้อมูล lead ตามคำค้นหา (customerName, status, contactNo, vehicle)
Utils.filterLeads =
  Utils.filterLeads ||
  function (list, query) {
    if (!Array.isArray(list)) return []; // ถ้า list ไม่ใช่ array → คืน array ว่าง
    if (!query || query.trim() === "") return list; // ถ้าไม่มีคำค้น → คืนข้อมูลทั้งหมด
    const q = query.toLowerCase(); // แปลงคำค้นเป็นตัวเล็ก
    // ใช้ filter() เพื่อหาข้อมูลที่ตรงกับคำค้น
    return list.filter(
      (lead) =>
        lead.customerName?.toLowerCase().includes(q) ||
        lead.status?.toLowerCase().includes(q) ||
        lead.contactNo?.toLowerCase().includes(q) ||
        lead.vehicle?.toLowerCase().includes(q)
    );
  };

// --------------------------------------------------------
// 🧩 อ็อบเจ็กต์หลัก AppGui รวมฟังก์ชันทั้งหมดไว้ในนี้
// --------------------------------------------------------
const AppGui = {
  /**
   * 🟢 toggleMenu:
   * ใช้เปิด/ปิดเมนูหรือโมดัล โดยส่งชื่อ key ของ state เข้าไป
   * เช่น AppGui.toggleMenu("isOpenModalLead")
   */
  toggleMenu: (key, force) => {
    if (!AppState[key]) return; // ถ้าไม่มี key นี้ใน state → ไม่ทำอะไร
    AppState[key].value =
      typeof force === "boolean" ? force : !AppState[key].value; // toggle หรือบังคับค่า
  },

  /**
   * 🔴 closeAllMenus:
   * ปิดเมนูหรือโมดัลทุกตัวที่เปิดอยู่ในระบบ
   */
  closeAllMenus: () => {
    Object.keys(AppState).forEach((key) => {
      // ตรวจเฉพาะ key ที่ขึ้นต้นด้วย isMenuOpen หรือ isOpenModal
      if (
        (key.startsWith("isMenuOpen") || key.startsWith("isOpenModal")) &&
        AppState[key]?.value === true
      ) {
        AppState[key].value = false; // ปิดมันซะ
      }
    });
  },

  /**
   * 📄 PagesComputed:
   * ฟังก์ชันคำนวณค่าต่าง ๆ เกี่ยวกับการแบ่งหน้า เช่น
   * - รายการที่ผ่านการค้นหา (filteredLeads)
   * - จำนวนหน้าทั้งหมด (totalPages)
   * - ข้อมูลในแต่ละหน้า (pagedLeads)
   */
  PagesComputed: () => {
    // ----------------------------------------------------
    // ✅ 1. สร้าง filteredLeads → รายการที่ผ่านการกรอง
    // ----------------------------------------------------
    AppState.filteredLeads = computed(() => {
      const query = AppState.searchQuery?.value || ""; // ดึงค่าค้นหาจาก state
      return Utils.filterLeads(Store.leadItems, query); // ใช้ Utils.filterLeads กรองข้อมูล
    });

    // ----------------------------------------------------
    // ✅ 2. คำนวณจำนวนหน้าทั้งหมด (totalPages)
    // ----------------------------------------------------
    AppState.totalPages = computed(() => {
      const total = AppState.filteredLeads.value.length; // จำนวนรายการที่กรองได้
      const perPage = AppState.itemsPerPage.value; // จำนวนต่อหน้า (อาจเป็นตัวเลขหรือ 'All')

      if (perPage === "All") return 1; // ถ้าเลือก All → แค่หน้าเดียว
      const numPerPage = Number(perPage); // แปลงเป็นตัวเลข
      return Math.max(Math.ceil(total / numPerPage), 1); // ปัดขึ้นและกันหน้า 0
    });

    // ----------------------------------------------------
    // ✅ 3. คำนวณข้อมูลที่แสดงในแต่ละหน้า (pagedLeads)
    // ----------------------------------------------------
    AppState.pagedLeads = computed(() => {
      const page = AppState.page.value; // หน้าปัจจุบัน
      const perPage = AppState.itemsPerPage.value; // จำนวนต่อหน้า
      const allLeads = AppState.filteredLeads.value; // ลิสต์ทั้งหมดหลังกรอง

      if (perPage === "All") return allLeads; // ถ้าเลือก All → แสดงทั้งหมด

      const numPerPage = Number(perPage); // จำนวนต่อหน้า (แปลงเป็นตัวเลข)
      const start = (page - 1) * numPerPage; // index เริ่มต้น
      const end = start + numPerPage; // index สิ้นสุด
      return allLeads.slice(start, end); // ตัด array ช่วงนั้นออกมา
    });
  },

  /**
   * 👀 setupWatchers:
   * ตั้ง watch สำหรับค่าที่ต้องตอบสนองอัตโนมัติเมื่อเปลี่ยน
   * เช่น เปลี่ยนจำนวนต่อหน้า, ค้นหาใหม่, หรือเปลี่ยนหน้า
   */
  setupWatchers: () => {
    // 🟡 เมื่อเปลี่ยนจำนวนต่อหน้า → กลับหน้าแรก
    watch(AppState.itemsPerPage, (newVal) => {
      AppState.page.value = 1; // รีเซ็ตกลับหน้าแรกเสมอ
    });

    // 🟡 เมื่อค้นหาใหม่ → กลับหน้าแรก
    watch(AppState.searchQuery, () => {
      AppState.page.value = 1; // รีเซ็ตกลับหน้าแรกเสมอ
    });

    // 🟡 ทุกครั้งที่เปลี่ยนหน้า → แสดง log ใน console (debug)
    watch(AppState.page, (newVal) => {
      console.log("เปลี่ยนหน้าเป็น", newVal); // debug output
    });
  },

  /**
   * 🧩 setupComputed:
   * รวมฟังก์ชันคำนวณทั้งหมดให้เรียกจาก app.js ได้ง่าย
   * ใช้เพื่อให้ app.js ไม่ต้องเรียก PagesComputed / setupWatchers แยกกัน
   */
  setupComputed: () => {
    AppGui.PagesComputed(); // เรียกคำนวณ computed properties
    AppGui.setupWatchers(); // ตั้ง watcher ต่าง ๆ
  },
};

// --------------------------------------------------------
// ✅ export ออกไปให้ไฟล์อื่นเรียกใช้ได้ เช่น app.js
// --------------------------------------------------------
window.AppGui = AppGui;
