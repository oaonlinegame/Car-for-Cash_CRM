// js/gui.js
// --------------------------------------------------------
// 📘 โมดูลจัดการ UI (User Interface Logic)
// --------------------------------------------------------
// ทำหน้าที่ควบคุม:
// - toggleMenu (เปิด/ปิดเมนูหรือ modal)
// - การคำนวณ Computed Properties ต่างๆ (Filter, Pagination)
// - Logic ของหน้าบันทึกผลการโทร (Call Result) **[เพิ่มใหม่]**
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
    if (!AppState[key]) return;
    AppState[key].value =
      typeof force === "boolean" ? force : !AppState[key].value;
  },

  // ----------------------------------------------------
  // 🔴 closeAllMenus()
  // ปิดทุกเมนู
  // ----------------------------------------------------
  closeAllMenus() {
    Object.keys(AppState).forEach((key) => {
      const val = AppState[key];
      if (key.startsWith("is") && val?.value === true) {
        val.value = false;
      }
    });
  },

  // ----------------------------------------------------
  // 🆕 bindSearchRef
  // ผูก ref ช่องค้นหา
  // ----------------------------------------------------
  bindSearchRef(refInstance) {
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
      const query =
        AppState.searchQueryDebounced &&
        AppState.searchQueryDebounced.value !== undefined
          ? AppState.searchQueryDebounced.value
          : AppState.searchQuery.value;
      const list = Store.data.leadItems;
      return Utils.filterLeads(list, query);
    });

    // 2. Total Pages
    AppState.totalPages = computed(() => {
      const perPage = AppState.itemsPerPage.value;
      const total = AppState.filteredLeads.value.length;
      if (perPage === "All") return 1;
      const num = Number(perPage);
      if (AppState.page.value > Math.max(1, Math.ceil(total / num))) {
        AppState.page.value = 1;
      }
      return Math.max(1, Math.ceil(total / num));
    });

    // 3. Paged Leads
    AppState.pagedLeads = computed(() => {
      const page = AppState.page.value;
      const perPage = AppState.itemsPerPage.value;
      const all = AppState.filteredLeads.value;

      if (perPage === "All") {
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
  // [ใหม่] Logic สำหรับหน้าบันทึกผลการติดต่อ
  // เชื่อม Main Status -> Sub Status -> Input Fields
  // ----------------------------------------------------
  setupRecordCallComputed() {
    // 1. เฝ้าดู Main Status -> เพื่ออัปเดตตัวเลือก Sub Status
    watch(
      () => AppState.recordCallForm.mainStatus,
      (newVal) => {
        // เคลียร์ค่า Sub Status เดิมทิ้งก่อน
        AppState.recordCallForm.subStatus = null;

        if (!newVal) {
          AppState.currentSubStatusOptions.value = [];
          return;
        }

        // ค้นหากลุ่ม Config ที่ตรงกับ Main Status
        const group = AppState.callStatusConfig.value.find(
          (g) => g.value === newVal
        );

        // อัปเดตตัวเลือกสถานะย่อย
        if (group && group.sub) {
          AppState.currentSubStatusOptions.value = group.sub;
        } else {
          AppState.currentSubStatusOptions.value = [];
        }
        console.log(
          "✅ GUI: อัปเดตสถานะย่อยเป็น",
          AppState.currentSubStatusOptions.value
        );
      }
    );

    // 2. เฝ้าดู Sub Status -> เพื่ออัปเดต Input Requirements
    watch(
      () => AppState.recordCallForm.subStatus,
      (newVal) => {
        if (!newVal) {
          AppState.currentInputRequirements.value = [];
          return;
        }

        // ค้นหา Object ของ Sub Status ที่เลือก
        const options = AppState.currentSubStatusOptions.value;
        const selected = options.find((s) => s.value === newVal);

        // อัปเดตรายการ Input ที่ต้องแสดง
        if (selected && selected.inputs) {
          AppState.currentInputRequirements.value = selected.inputs;
        } else {
          AppState.currentInputRequirements.value = [];
        }
      }
    );
    //3. เฝ้าดูเหตุผลย่อย (rejectReason) เพื่อเปลี่ยนช่องกรอกตามสาเหตุจริง
    watch(
      () => AppState.recordCallForm.rejectReason,
      (newVal) => {
        if (!newVal) return;

        // ค้นหาข้อมูลเหตุผลจาก config
        const subStatus = AppState.currentSubStatusOptions.value.find(
          (s) => s.value === "incomplete"
        );
        if (subStatus && subStatus.reasons) {
          const reasonObj = subStatus.reasons.find(
            (r) => r.value === newVal || r.text === newVal
          );
          if (reasonObj) {
            // สั่งให้ UI แสดงช่องข้อมูลตามที่กำหนดไว้ใน inputs ของแต่ละเหตุผล
            AppState.currentInputRequirements.value = [
              "rejectReason",
              ...reasonObj.inputs,
            ];

            // เก็บสถานะปุ่มพิเศษ (เช่น ปุ่มเพิ่มสัญญาย่อย)
            AppState.recordCallForm._extraAction =
              reasonObj.extraAction || null;
          }
        }
      }
    );
  },

  // ----------------------------------------------------
  // 💾 saveRecordCallResult()
  // [ใหม่] ฟังก์ชันบันทึกผลการติดต่อ
  // ----------------------------------------------------
  saveRecordCallResult() {
    const form = AppState.recordCallForm;

    // Validation อย่างง่าย
    if (!form.mainStatus || !form.subStatus) {
      alert("กรุณาระบุสถานะหลักและสถานะย่อยให้ครบถ้วน");
      return;
    }

    // จำลองการบันทึก (Log ลง Console)
    const logData = {
      ...form,
      timestamp: new Date().toISOString(),
    };
    console.log("💾 บันทึก Log การติดต่อ:", logData);

    // แจ้งเตือน
    if (window.AppNotifications) {
      AppNotifications.show("✅ บันทึกผลการติดต่อเรียบร้อยแล้ว");
    }

    // ปิด Modal
    this.toggleMenu("isOpenModalRecordCallResult", false);

    // รีเซ็ตฟอร์ม (ถ้าต้องการ)
    this.resetRecordCallForm();
  },

  // ----------------------------------------------------
  // 🔄 resetRecordCallForm()
  // [ใหม่] ฟังก์ชันรีเซ็ตฟอร์มบันทึกผล
  // ----------------------------------------------------
  resetRecordCallForm() {
    Object.assign(AppState.recordCallForm, {
      mainStatus: null,
      subStatus: null,
      appointmentDate: "",
      appointmentTime: "",
      note: "",
      location: "",
      receiverName: "",
      phoneBack: "",
      rejectReason: null,
      amount: null,
      contractId: "",
      product: null,
      offerAmount: null,
      interestRate: null,
      responseLevel: 3,
      crossSellProduct: null,
      crossSellNote: "",
      isCreateNewLead: false,
    });
  },

  // ----------------------------------------------------
  // 🔧 Contract Tab Utilities
  // ----------------------------------------------------
  openContractTabPlus() {
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
    // เมื่อเปลี่ยนจำนวนต่อหน้า -> กลับหน้า 1
    watch(AppState.itemsPerPage, () => {
      AppState.page.value = 1;
    });

    // Debounce Search
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
    this.setupUIMainComputed(); // ตั้งค่า Search/Filter
    this.setupWatchers(); // ตั้งค่า Watcher
    this.setupRecordCallComputed(); //  ตั้งค่า Logic ของ Record Call
  },
};

// --------------------------------------------------------
// 🌍 Export
// --------------------------------------------------------
window.AppGui = AppGui;
