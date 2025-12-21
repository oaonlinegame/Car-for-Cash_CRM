// js/gui.js
// --------------------------------------------------------
// 📘 โมดูลจัดการ UI (User Interface Logic)
// --------------------------------------------------------
// ทำหน้าที่ควบคุม:
// - toggleMenu (เปิด/ปิดเมนูหรือ modal)
// - การคำนวณ Computed Properties ต่างๆ (Filter, Pagination)
// - Logic ของหน้าบันทึกผลการโทร (Call Result)
// --------------------------------------------------------

// ดึงเครื่องมือจาก Vue
const { ref, reactive, watch, computed } = Vue;

const AppGui = {
  // ----------------------------------------------------
  // 🧠 ตัวแปรภายในของ AppGui
  // ----------------------------------------------------
  searchDebounceTimer: null,

  // ----------------------------------------------------
  // 🟢 toggleMenu(key, force)
  // ฟังก์ชันเปิด/ปิดเมนู
  // ----------------------------------------------------
  toggleMenu(key, force) {
    // คอมเมนต์: ฟังก์ชันหลักสำหรับเปิดหรือปิด Modal และ Menu ต่างๆ
    if (!AppState[key]) return; // คอมเมนต์: ถ้าไม่พบ key ใน AppState ให้หยุดทำงาน
    AppState[key].value =
      typeof force === "boolean" ? force : !AppState[key].value; // คอมเมนต์: กำหนดค่าตามที่ส่งมาหรือสลับค่าเดิม
  },

  // ----------------------------------------------------
  // 🔴 closeAllMenus()
  // ปิดทุกเมนู
  // ----------------------------------------------------
  closeAllMenus() {
    // คอมเมนต์: ฟังก์ชันสำหรับปิดหน้าต่าง Modal ทั้งหมดที่เปิดอยู่
    Object.keys(AppState).forEach((key) => {
      const val = AppState[key];
      if (key.startsWith("is") && val?.value === true) {
        val.value = false; // คอมเมนต์: ค้นหา key ที่ขึ้นต้นด้วย 'is' และปิดการทำงาน
      }
    });
  },

  // ----------------------------------------------------
  // 🆕 bindSearchRef
  // ผูก ref ช่องค้นหา
  // ----------------------------------------------------
  bindSearchRef(refInstance) {
    // คอมเมนต์: ฟังก์ชันผูก Reference ของช่อง Search จาก Template เข้ากับ AppState
    if (!refInstance || !refInstance.value) return;
    if (window.AppState && AppState.searchRef) {
      AppState.searchRef.value = refInstance.value;
    }
  },

  // ----------------------------------------------------
  // ⭐ setupUIMainComputed()
  // ตั้งค่า Computed หลัก (Search, Filter, Pagination)
  // ----------------------------------------------------
  setupUIMainComputed() {
    // 1. Filtered Leads
    AppState.filteredLeads = computed(() => {
      // คอมเมนต์: คำนวณรายการลูกค้าที่ถูกกรองตามคำค้นหา
      const query =
        AppState.searchQueryDebounced &&
        AppState.searchQueryDebounced.value !== undefined
          ? AppState.searchQueryDebounced.value
          : AppState.searchQuery.value;
      const list = Store.data.leadItems; // คอมเมนต์: ดึงข้อมูลจาก Memory Store
      return Utils.filterLeads(list, query); // คอมเมนต์: เรียกใช้ฟังก์ชันกรองจาก Utils
    });

    // 2. Total Pages
    AppState.totalPages = computed(() => {
      // คอมเมนต์: คำนวณจำนวนหน้าทั้งหมดสำหรับการแบ่งหน้า
      const perPage = AppState.itemsPerPage.value;
      const total = AppState.filteredLeads.value.length;
      if (perPage === "All") return 1;
      const num = Number(perPage);
      // คอมเมนต์: ตรวจสอบและรีเซ็ตหน้าปัจจุบันถ้าจำนวนหน้าลดลง
      if (AppState.page.value > Math.max(1, Math.ceil(total / num))) {
        AppState.page.value = 1;
      }
      return Math.max(1, Math.ceil(total / num));
    });

    // 3. Paged Leads
    AppState.pagedLeads = computed(() => {
      // คอมเมนต์: ตัดรายการลูกค้ามาแสดงเฉพาะในหน้าปัจจุบัน
      const page = AppState.page.value;
      const perPage = AppState.itemsPerPage.value;
      const all = AppState.filteredLeads.value;

      if (perPage === "All") {
        // คอมเมนต์: กรณีแสดงทั้งหมด ให้แบ่งกลุ่มละ 2 สำหรับ Grid View
        if (typeof Utils.chunkArray === "function") {
          return Utils.chunkArray(all, 2);
        }
        return all;
      }

      const num = Number(perPage);
      const start = (page - 1) * num;
      const end = start + num;
      return all.slice(start, end);
    });
  },

  // ----------------------------------------------------
  // ⭐ setupRecordCallComputed()
  // เชื่อม Main Status -> Sub Status -> Input Fields
  // (แก้ไข: ย้าย Logic หลักไปที่ LogApp และใช้ Watcher เรียกใช้งาน)
  // ----------------------------------------------------
  setupRecordCallComputed() {
    // 1. เฝ้าดู Main Status -> เพื่ออัปเดตตัวเลือก Sub Status
    watch(
      () => AppState.recordCallForm.mainStatus,
      (newVal) => {
        // คอมเมนต์: เมื่อสถานะหลักเปลี่ยน ให้เรียก Logic ใน LogApp เพื่ออัปเดตตัวเลือกย่อย
        window.LogApp.handleStatusChange(newVal);
      }
    );

    // 2. เฝ้าดู Sub Status -> เพื่ออัปเดต Input Requirements
    watch(
      () => AppState.recordCallForm.subStatus,
      (newVal) => {
        // คอมเมนต์: เมื่อสถานะย่อยเปลี่ยน ให้เรียก Logic ใน LogApp เพื่อกำหนดฟิลด์ที่ต้องแสดง
        window.LogApp.handleSubStatusChange(newVal);
      }
    );

    // 3. เฝ้าดูเหตุผลย่อย (rejectReason) เพื่อเปลี่ยนช่องกรอกตามสาเหตุจริง
    watch(
      () => AppState.recordCallForm.rejectReason,
      (newVal) => {
        // คอมเมนต์: จัดการกรณีเงื่อนไขพิเศษ เช่น การปฏิเสธเพราะเพิ่งรีไฟแนนซ์มา
        if (!newVal) return;

        const subStatus = AppState.currentSubStatusOptions.value.find(
          (s) => s.value === "incomplete"
        );
        if (subStatus && subStatus.reasons) {
          const reasonObj = subStatus.reasons.find(
            (r) => r.value === newVal || r.text === newVal
          );
          if (reasonObj) {
            // คอมเมนต์: สั่งให้ UI แสดงช่องข้อมูลเพิ่มเติมตามที่ตั้งค่าไว้
            AppState.currentInputRequirements.value = [
              "rejectReason",
              ...reasonObj.inputs,
            ];

            // คอมเมนต์: เก็บสถานะการแสดงปุ่มหรือ Action พิเศษในฟอร์ม
            AppState.recordCallForm._extraAction =
              reasonObj.extraAction || null;
          }
        }
      }
    );
  },

  // ----------------------------------------------------
  // 💾 saveRecordCallResult()
  // (ย้ายไปที่ LogApp.saveCallResult เรียบร้อยแล้ว)
  // ----------------------------------------------------

  // ----------------------------------------------------
  // 🔄 resetRecordCallForm()
  // ฟังก์ชันรีเซ็ตฟอร์มบันทึกผล
  // ----------------------------------------------------
  resetRecordCallForm() {
    // คอมเมนต์: คืนค่าฟอร์มบันทึกการโทรทั้งหมดกลับเป็นค่าเริ่มต้น
    const empty = window.LogApp.createEmpty(); // คอมเมนต์: ดึงค่าเริ่มต้นจาก LogApp
    Object.assign(AppState.recordCallForm, empty); // คอมเมนต์: คัดลอกค่าลงฟอร์ม
    console.log("🔄 AppGui: รีเซ็ตฟอร์มบันทึกการโทรสำเร็จ");
  },

  // ----------------------------------------------------
  // 🔧 Contract Tab Utilities
  // ----------------------------------------------------
  openContractTabPlus() {
    // คอมเมนต์: ฟังก์ชันเปิดหน้าสร้างสัญญาใหม่พร้อมตั้งค่า UI เริ่มต้น
    AppState.contractTab.value = "new";
    AppState.contractInnerTab.value = "all";
    AppState.contractPanels.value = [
      "info",
      "finance",
      "status",
      "asset",
      "history",
      "other",
    ];
    if (typeof LeadApp?.resetNewContractForm === "function") {
      LeadApp.resetNewContractForm();
    }
  },

  resetContractPanels() {
    // คอมเมนต์: คืนค่า Panel ในหน้าสัญญาให้กางออกทั้งหมด
    AppState.contractPanels.value = [
      "info",
      "finance",
      "status",
      "asset",
      "history",
      "other",
    ];
  },

  resetContractScroll(el) {
    // คอมเมนต์: เลื่อน Scroll กลับไปด้านบนสุดเมื่อเปลี่ยนแท็บสัญญา
    if (!el) return;
    try {
      el.scrollTop = 0;
    } catch (err) {
      console.warn("resetContractScroll():", err);
    }
  },

  // ----------------------------------------------------
  // ⭐ setupWatchers()
  // ตั้งค่า Watchers ทั่วไป (Pagination, Search)
  // ----------------------------------------------------
  setupWatchers() {
    // คอมเมนต์: เมื่อเปลี่ยนจำนวนรายการต่อหน้า ให้กลับไปเริ่มหน้า 1
    watch(AppState.itemsPerPage, () => {
      AppState.page.value = 1;
    });

    // คอมเมนต์: จัดการการค้นหาแบบ Debounce เพื่อลดภาระการประมวลผล
    watch(AppState.searchQuery, (newVal) => {
      AppState.page.value = 1;
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      this.searchDebounceTimer = setTimeout(() => {
        if (AppState.searchQueryDebounced) {
          AppState.searchQueryDebounced.value = newVal;
        }
      }, 250);
    });
  },

  // ----------------------------------------------------
  // ⭐ setupComputed()
  // ฟังก์ชันรวมที่ Boot.js จะเรียกใช้
  // ----------------------------------------------------
  setupComputed() {
    // คอมเมนต์: เริ่มต้นการทำงานของระบบ Computed และ Watcher ทั้งหมดใน GUI
    this.setupUIMainComputed(); // คอมเมนต์: ตั้งค่า Search/Filter
    this.setupWatchers(); // คอมเมนต์: ตั้งค่า Watcher
    this.setupRecordCallComputed(); // คอมเมนต์: ตั้งค่า Logic ของ Record Call
  },
};

// --------------------------------------------------------
// 🌍 Export
// --------------------------------------------------------
window.AppGui = AppGui;
