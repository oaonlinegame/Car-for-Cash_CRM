// gui.js
// --------------------------------------------------------
// 📘 โมดูลจัดการ UI (User Interface Logic)
// --------------------------------------------------------
// ทำหน้าที่ควบคุม:
// - toggleMenu (เปิด/ปิดเมนูหรือ modal)
// - closeAllMenus (ปิดเมนูทั้งหมด)
// - pagination / chunking (แบ่งหน้า / จัดกลุ่มข้อมูล)
// - filteredLeads / pagedLeads (ข้อมูลหลังกรอง + เฉพาะหน้า)
// --------------------------------------------------------

// ดึง Composition API จาก Vue
const { ref, reactive, watch, computed } = Vue; // ดึงเครื่องมือจาก Vue

// --------------------------------------------------------
// ⭐ อ็อบเจกต์ AppGui รวมฟังก์ชัน UI ทั้งหมด
// --------------------------------------------------------
const AppGui = {
  // ----------------------------------------------------
  // 🧠 ตัวแปรภายในของ AppGui สำหรับ debounce การค้นหา
  // ----------------------------------------------------
  searchDebounceTimer: null, // ใช้เก็บ timer ของ setTimeout สำหรับดีเลย์การค้นหา

  // ----------------------------------------------------
  // 🟢 toggleMenu(key, force)
  // ฟังก์ชันเปิด/ปิด modal หรือเมนูโดยใช้ชื่อใน AppState
  // ----------------------------------------------------
  toggleMenu(key, force) {
    if (!AppState[key]) return; // ถ้าไม่พบ key ใน state ให้หยุดทำงานทันที
    AppState[key].value =
      typeof force === "boolean"
        ? force // ถ้า force เป็น boolean → ใช้ค่าที่ส่งมา
        : !AppState[key].value; // ถ้าไม่ใช่ → สลับค่า (เปิดเป็นปิด / ปิดเป็นเปิด)
  },

  // ----------------------------------------------------
  // 🔴 closeAllMenus()
  // ปิดทุกเมนูและทุก modal ที่เปิดอยู่
  // ----------------------------------------------------
  closeAllMenus() {
    Object.keys(AppState).forEach((key) => {
      const val = AppState[key]; // ดึงค่า state ของ key นั้น
      if (key.startsWith("is") && val?.value === true) {
        // ถ้า key ขึ้นต้นด้วย is และค่าเป็น true แสดงว่าเปิดอยู่
        val.value = false; // ให้ปิดเมนูหรือ modal นั้น
      }
    });
  },

  // ----------------------------------------------------
  // ⭐ setupUIMainComputed()
  // ฟังก์ชันตั้งค่า Computed หลักทั้งหมดของ UI (Filter, Page, Chunking)
  // ----------------------------------------------------
  setupUIMainComputed() {
    // --------------------------------------------------
    // 🔍 1) filteredLeads → ใช้ Utils.filterLeads กรองข้อมูล (เฝ้าดู Store.data.leadItems)
    // --------------------------------------------------
    AppState.filteredLeads = computed(() => {
      const query =
        AppState.searchQueryDebounced &&
        AppState.searchQueryDebounced.value !== undefined
          ? AppState.searchQueryDebounced.value // ถ้ามีค่าค้นหาที่ผ่าน debounce แล้ว → ใช้ตัวนี้
          : AppState.searchQuery.value; // ถ้าไม่มี (กรณีสำรอง) → ใช้คำค้นหาปกติ
      const list = Store.data.leadItems; // ดึงรายการ lead ทั้งหมดจาก Store (จุดเฝ้าดูหลัก)
      return Utils.filterLeads(list, query); // คืนรายการที่ผ่านการกรองตามคำค้นหา
    });

    // --------------------------------------------------
    // 📄 2) totalPages → จำนวนหน้าทั้งหมด
    // --------------------------------------------------
    AppState.totalPages = computed(() => {
      const perPage = AppState.itemsPerPage.value; // จำนวนต่อหน้าที่ผู้ใช้เลือก
      const total = AppState.filteredLeads.value.length; // จำนวนรายการที่ผ่านการกรองทั้งหมด

      if (perPage === "All") return 1; // ถ้าเลือก All → ให้มีหน้าเดียวเสมอ

      const num = Number(perPage); // แปลงค่าจำนวนต่อหน้าเป็นตัวเลข
      // ถ้าหน้าปัจจุบันเกินจำนวนหน้าทั้งหมด → ให้กลับไปหน้า 1
      if (AppState.page.value > Math.max(1, Math.ceil(total / num))) {
        AppState.page.value = 1;
      }

      return Math.max(1, Math.ceil(total / num)); // คืนค่าจำนวนหน้าขั้นต่ำ 1 หน้าเสมอ
    });

    // --------------------------------------------------
    // 📃 3) pagedLeads → ตัดข้อมูลเฉพาะหน้าปัจจุบัน / จัดกลุ่ม 2 คอลัมน์
    // --------------------------------------------------
    AppState.pagedLeads = computed(() => {
      const page = AppState.page.value; // หน้าปัจจุบัน
      const perPage = AppState.itemsPerPage.value; // จำนวนต่อหน้า (5,10,20 หรือ All)
      const all = AppState.filteredLeads.value; // รายการหลังกรองทั้งหมด

      // ✅ กรณีเลือก All → จัดกลุ่มข้อมูลเป็นคู่ (Row ละ 2 items) เพื่อรองรับ 2 คอลัมน์ Grid Virtual Scroll
      if (perPage === "All") {
        if (typeof Utils.chunkArray === "function") {
          return Utils.chunkArray(all, 2); // แบ่งข้อมูลเป็นคู่ (Row ละ 2 items)
        }
        return all; // กรณีสำรอง: ถ้าฟังก์ชัน chunkArray ยังไม่โหลด
      }

      const num = Number(perPage); // จำนวนรายการต่อหน้าในรูปตัวเลข
      const start = (page - 1) * num; // index เริ่มต้นของหน้าปัจจุบัน
      const end = start + num; // index สุดท้าย (ไม่รวม) ของหน้าปัจจุบัน

      return all.slice(start, end); // คืนเฉพาะรายการที่อยู่ในช่วงของหน้านั้นเท่านั้น
    });
  },

  // ----------------------------------------------------
  // 🆕 openContractTabPlus()
  // ฟังก์ชันเปิด TAB "+" ของสัญญา
  // เรียกทุกครั้งที่ต้องเพิ่มสัญญาใหม่
  // ----------------------------------------------------
  openContractTabPlus() {
    // ย้ายไป TAB "new"
    AppState.contractTab.value = "new";

    // reset TAB ย่อยให้ไปหน้า ALL
    AppState.contractInnerTab.value = "all";

    // reset Panels ให้เปิดหมด (ค่าเริ่มต้น)
    AppState.contractPanels.value = [
      "info",
      "finance",
      "status",
      "asset",
      "history",
      "other",
    ];

    // สั่งให้ LeadApp เคลียร์ฟอร์มสัญญาใหม่
    if (typeof LeadApp?.resetNewContractForm === "function") {
      LeadApp.resetNewContractForm();
    }
  },

  // ----------------------------------------------------
  // 🆕 resetContractPanels()
  // ใช้เมื่อเปิด dialog ใหม่ เพื่อป้องกัน Vuetify จำสถานะ panel เก่า
  // ----------------------------------------------------
  resetContractPanels() {
    AppState.contractPanels.value = [
      "info",
      "finance",
      "status",
      "asset",
      "history",
      "other",
    ];
  },

  // ----------------------------------------------------
  // 🆕 resetContractScroll(el)
  // รีเซ็ต scrollTop ของพื้นที่สัญญา
  // ต้องเรียกหลัง nextTick เพื่อให้ DOM ขึ้นก่อน
  // ----------------------------------------------------
  resetContractScroll(el) {
    if (!el) return; // ถ้าไม่มี element → หยุด
    try {
      el.scrollTop = 0; // ตั้ง scroll ให้กลับไปบนสุด
    } catch (err) {
      console.warn("resetContractScroll():", err);
    }
  },

  // ----------------------------------------------------
  // ⭐ setupWatchers()
  // ฟังก์ชันเฝ้าดูค่าที่สำคัญ และจัดการรีเซ็ตหน้า / debounce
  // ----------------------------------------------------
  setupWatchers() {
    // 🔁 เมื่อผู้ใช้เปลี่ยนจำนวนรายการต่อหน้า → กลับไปหน้าแรก
    watch(AppState.itemsPerPage, () => {
      AppState.page.value = 1; // รีเซ็ตหน้ากลับไป 1 ทุกครั้งที่เปลี่ยน per page
    });

    // 🔍 เมื่อผู้ใช้พิมพ์ในช่องค้นหา → debounce ก่อนเซ็ตจริง
    watch(
      AppState.searchQuery, // เฝ้าดูค่าค้นหาหลักที่ช่อง Search
      (newVal) => {
        AppState.page.value = 1; // ทุกครั้งที่ค้นหาใหม่ ให้กลับไปหน้าแรกเสมอ

        // ถ้ามี timer debounce ตัวเก่าอยู่ → เคลียร์ก่อนเพื่อไม่ให้ยิงซ้อน
        if (this.searchDebounceTimer) {
          clearTimeout(this.searchDebounceTimer); // ล้าง timer เดิมออก
        }

        // ตั้ง timer ใหม่เพื่อหน่วงการอัปเดต searchQueryDebounced
        this.searchDebounceTimer = setTimeout(() => {
          if (AppState.searchQueryDebounced) {
            AppState.searchQueryDebounced.value = newVal; // เซ็ตค่าค้นหาที่ผ่าน debounce แล้ว
          }
        }, 250); // ดีเลย์ 250ms เพื่อลดการกรองบ่อยเกินไป (ทุก key ที่พิมพ์)
      }
    );

    // 🧪 debug → แสดงใน console เมื่อมีการเปลี่ยนหน้า
    watch(AppState.page, (p) => {
      console.log("📄 เปลี่ยนหน้าเป็น:", p); // แสดงหน้าปัจจุบันใน console
    });
  },

  // ----------------------------------------------------
  // ⭐ setupComputed()
  // ฟังก์ชันรวมการตั้งค่า computed & watcher ไว้เรียกจาก app.js
  // ----------------------------------------------------
  setupComputed() {
    this.setupUIMainComputed(); // <--- เปลี่ยนการเรียก PagesComputed() เป็น setupUIMainComputed()
    this.setupWatchers(); // ตั้ง watcher ให้ทำงานต่อเนื่องเวลาผู้ใช้เปลี่ยนค่า
  },
};

// --------------------------------------------------------
// 🌍 export AppGui ไปที่ window ให้ไฟล์อื่นใช้งานได้
// --------------------------------------------------------
window.AppGui = AppGui; // ผูก AppGui กับ window เพื่อให้ไฟล์อื่นและ template เรียกใช้ได้
