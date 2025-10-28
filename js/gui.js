// gui.js
// --------------------------------------------------------
// 📘 ไฟล์นี้รวมฟังก์ชันที่เกี่ยวกับการจัดการ UI (User Interface)
// เช่น เปิด/ปิดเมนู, เปลี่ยนหน้า, และคำนวณค่าต่าง ๆ ของหน้า
// --------------------------------------------------------

// ดึงเครื่องมือพื้นฐานจาก Vue (ผ่าน CDN)
// - ref: ตัวแปรที่ reactive (เปลี่ยนค่าแล้ว UI อัปเดต)
// - reactive: สร้าง object ที่ reactive ได้
// - watch: เฝ้าดูค่าที่เปลี่ยน เพื่อทำบางอย่างอัตโนมัติ
// - computed: ค่าที่คำนวณได้จากข้อมูลอื่น (auto update)
const { ref, reactive, watch, computed } = window.Vue;

// --------------------------------------------------------
// 🧩 สร้างอ็อบเจ็กต์หลักชื่อ AppGui รวมฟังก์ชันทั้งหมดไว้ในนี้
// --------------------------------------------------------
const AppGui = {
  /**
   * 🟢 ฟังก์ชัน toggleMenu:
   * ใช้เปิด/ปิดเมนูหรือโมดัลที่ต้องการ โดยส่งชื่อ key ของ state เข้าไป
   * เช่น AppGui.toggleMenu("isOpenModalLead")
   */
  toggleMenu: (key, force) => {
    // ถ้าไม่มี key ใน AppState → ไม่ทำอะไร
    if (!AppState[key]) return;

    // ถ้า force เป็น true/false → ใช้ค่านั้นเลย
    // ถ้าไม่ระบุ force → สลับค่าปัจจุบัน (เปิด/ปิด)
    AppState[key].value =
      typeof force === "boolean" ? force : !AppState[key].value;
  },

  /**
   * 🔴 ฟังก์ชัน closeAllMenus:
   * ปิดเมนูหรือโมดัลทุกตัวที่เปิดอยู่ในระบบ
   */
  closeAllMenus: () => {
    // ปิดเมนูค้นหา/กรอง
    AppGui.toggleMenu("isMenuOpenFiltesterSearch", false);
    // ปิด Modal จัดการ Lead
    AppGui.toggleMenu("isOpenModalLead", false);
  },

  /**
   * 📐 PagesComputed:
   * ฟังก์ชันสร้าง computed properties สำหรับการแบ่งหน้าและกรองข้อมูล
   */
  PagesComputed: () => {
    // ... (โค้ดเดิม)
    // ----------------------------------------------------
    // 🟡 คำนวณรายการที่จะแสดงใน "หน้าปัจจุบัน"
    // ----------------------------------------------------
    AppState.pagedLeads = computed(() => {
      const page = AppState.page.value; // หน้าปัจจุบัน
      const perPage = AppState.itemsPerPage.value; // จำนวนต่อหน้า
      const allLeads = AppState.filteredLeads.value; // รายการที่ผ่านการกรองแล้ว

      if (perPage === "All") return allLeads; // ถ้าเลือก All → แสดงทั้งหมดเลย

      // คำนวณช่วงข้อมูลที่จะตัดมาแสดง
      const numPerPage = Number(perPage);
      const start = (page - 1) * numPerPage; // เริ่ม index ของหน้า
      const end = start + numPerPage; // สิ้นสุด index ของหน้า

      // ใช้ slice() ดึงข้อมูลช่วงนั้นออกมาแสดง
      return allLeads.slice(start, end);
    });

    // ----------------------------------------------------
    // 🟡 คำนวณจำนวนหน้าทั้งหมด (ต้องใช้ filteredLeads)
    // ----------------------------------------------------
    AppState.totalPages = computed(() => {
      const totalItems = AppState.filteredLeads.value.length;
      const perPage = AppState.itemsPerPage.value;

      // ถ้าเลือก "All" หรือไม่มีรายการเลย
      if (perPage === "All" || totalItems === 0) return 1;

      const numPerPage = Number(perPage);
      return Math.ceil(totalItems / numPerPage);
    });
  },

  /**
   * 👀 setupWatchers:
   * ฟังก์ชันตั้ง "ตัวเฝ้าดู" (watchers)
   * เพื่อให้แอปตอบสนองอัตโนมัติเมื่อค่าบางตัวเปลี่ยน
   */
  setupWatchers: () => {
    // 🟡 ถ้าเปลี่ยนจำนวนต่อหน้า → กลับไปหน้า 1 ทันที
    watch(AppState.itemsPerPage, () => {
      AppState.page.value = 1;
    });

    // 🟡 ถ้าพิมพ์ค้นหา → กลับไปหน้า 1 ทันที
    watch(AppState.searchQuery, () => {
      AppState.page.value = 1;
    });

    // 🟡 ทุกครั้งที่เปลี่ยนหน้า → แสดงใน console
    watch(AppState.page, (newVal) => {
      console.log(`➡️ Page changed to: ${newVal}`);
    });
  },

  /**
   * getRatingFromEvent:
   * ฟังก์ชันช่วยเหลือสำหรับคำนวณหา "ค่าดาว" (rating) ที่ถูกคลิกจาก DOM Event
   * ใช้ในการเตรียมค่าดาวก่อนส่งไปที่ setGenericRating ในการคลิกขวา (Presentation Logic)
   * @param {Event} event - เหตุการณ์ ContextMenu (คลิกขวา)
   * @returns {Number|null} ค่าดาว (1-5) หรือ null หากหาไม่เจอ
   */
  getRatingFromEvent: (event) => {
    const ratingRootEl = event.currentTarget; // อ้างอิงถึง root element ของ v-rating
    const clickedStarEl = event.target.closest(".v-rating__item"); // ค้นหา element ดาวที่ถูกคลิกขวา

    // ถ้าไม่พบ root หรือดาวที่คลิก → คืนค่า null (ป้องกัน error)
    if (!ratingRootEl || !clickedStarEl) return null;

    // สร้าง array ของดาวทั้งหมดภายใน v-rating เพื่อหา index
    const allStars = Array.from(
      ratingRootEl.querySelectorAll(".v-rating__item")
    );
    // หา index ของดาวที่ถูกคลิก
    const index = allStars.indexOf(clickedStarEl);

    // ถ้าพบ index (ไม่เป็น -1) → คืนค่า index + 1 (เพราะ rating เริ่มจาก 1) มิฉะนั้น คืนค่า null
    return index !== -1 ? index + 1 : null;
  },
};

// ทำให้ AppGui ใช้งานได้จากทุกที่ใน window (Global Access)
window.AppGui = AppGui;
