// js/gui.js
// --------------------------------------------------------
// 🖥️ GUI LOGIC MODULE
// --------------------------------------------------------
// โมดูลจัดการตรรกะการแสดงผล (Presentation Logic) และสถานะ UI ที่ซับซ้อน
// ทำหน้าที่ควบคุมการคำนวณข้อมูลเพื่อแสดงผล (Computed Properties),
// การตอบสนองต่อการเปลี่ยนแปลงข้อมูล (Watchers), และการจัดการสถานะการนำทาง (Navigation)
// --------------------------------------------------------

(function (global) {
  "use strict";

  // ดึงฟังก์ชันที่จำเป็นจาก Vue (ซึ่งเป็น Global Object)
  const { ref, reactive, watch, computed } = global.Vue;

  const AppGui = {
    // ตัวแปรเก็บ Timer สำหรับการหน่วงเวลาค้นหา (Debounce)
    searchDebounceTimer: null,

    // ========================================================================
    // 1. STATE MUTATION & NAVIGATION (การจัดการสถานะเมนูและการนำทาง)
    // ========================================================================

    /**
     * สลับสถานะการแสดงผลของเมนูหรือ Modal (Toggle Visibility)
     * @param {string} key - ชื่อ Key ใน AppState ที่ต้องการเปลี่ยนค่า (ต้องเป็น Boolean Ref)
     * @param {boolean} [force] - ค่าบังคับ (Optional) หากระบุจะใช้ค่านี้นำแทนการสลับ
     * ทำหน้าที่แก้ไขค่าใน AppState โดยตรงเพื่อเปิด/ปิดส่วนติดต่อผู้ใช้
     */
    toggleMenu(key, force) {
      if (!global.AppState[key]) return;
      global.AppState[key].value =
        typeof force === "boolean" ? force : !global.AppState[key].value;
    },

    /**
     * ปิดเมนูและ Modal ทั้งหมดที่มีในระบบ
     * วนลูปตรวจสอบ AppState และตั้งค่าตัวแปรที่ขึ้นต้นด้วย "is" ให้เป็น false
     * ใช้สำหรับกรณีต้องการ Reset หน้าจอหรือเมื่อกดปุ่ม ESC
     */
    closeAllMenus() {
      if (!global.AppState) return;
      Object.keys(global.AppState).forEach((key) => {
        const val = global.AppState[key];
        // ตรวจสอบว่าเป็น Ref และเป็นค่า Boolean หรือไม่
        if (key.startsWith("is") && val?.value === true) {
          val.value = false;
        }
      });
    },

    // ========================================================================
    // 2. COMPLEX UI LOGIC (ตรรกะการจัดการ UI เฉพาะทาง)
    // ========================================================================

    /**
     * เปิดแท็บสำหรับสร้างสัญญาใหม่และรีเซ็ตค่าที่เกี่ยวข้อง
     * ตั้งค่าตัวแปรสถานะใน AppState เพื่อเตรียมหน้าจอให้พร้อมสำหรับการเพิ่มข้อมูล
     */
    openContractTabPlus() {
      if (!global.AppState) return;

      // กำหนดให้แสดงแท็บ 'new' (สัญญาใหม่)
      global.AppState.contractTab.value = "new";
      global.AppState.contractInnerTab.value = "all";

      // รีเซ็ต Panel การแสดงผลให้เป็นค่าเริ่มต้นตาม Config
      if (
        global.AppConstants &&
        global.AppConstants.UI_CONFIG &&
        global.AppConstants.UI_CONFIG.DEFAULT_CONTRACT_PANELS
      ) {
        // ใช้ Array.from เพื่อสร้าง Array ใหม่ ป้องกันการแก้ไข Reference ต้นฉบับ
        global.AppState.contractPanels.value = Array.from(
          global.AppConstants.UI_CONFIG.DEFAULT_CONTRACT_PANELS
        );
      }

      // เรียกใช้ LeadApp เพื่อรีเซ็ตฟอร์มสัญญาภายใน
      if (
        global.LeadApp &&
        typeof global.LeadApp.resetNewContractForm === "function"
      ) {
        global.LeadApp.resetNewContractForm();
      }
    },

    /**
     * รีเซ็ตรายการ Panel ของสัญญาให้กลับสู่ค่าเริ่มต้น
     * ใช้เมื่อมีการเปลี่ยนสัญญาหรือต้องการคืนค่าการแสดงผล
     */
    resetContractPanels() {
      if (
        global.AppConstants &&
        global.AppConstants.UI_CONFIG &&
        global.AppConstants.UI_CONFIG.DEFAULT_CONTRACT_PANELS
      ) {
        global.AppState.contractPanels.value = Array.from(
          global.AppConstants.UI_CONFIG.DEFAULT_CONTRACT_PANELS
        );
      }
    },

    /**
     * รีเซ็ตตำแหน่ง Scroll ของ Element ที่กำหนดให้กลับไปด้านบนสุด
     * @param {HTMLElement} el - Element ที่ต้องการรีเซ็ต Scroll
     * ใช้ป้องกันข้อผิดพลาดกรณี Element ถูกทำลายไปแล้ว
     */
    resetContractScroll(el) {
      if (!el) return;
      try {
        el.scrollTop = 0;
      } catch (err) {
        console.warn("resetContractScroll error:", err);
      }
    },

    // ========================================================================
    // 3. COMPUTED LOGIC SETUP (การตั้งค่าการคำนวณข้อมูล)
    // ========================================================================

    /**
     * สร้าง Computed Properties สำหรับระบบหลัก (Main UI)
     * รับผิดชอบการกรองข้อมูล (Filtering) และการแบ่งหน้า (Pagination)
     * โดยผลลัพธ์จะถูกผูกกลับเข้าไปใน AppState เพื่อให้ View เรียกใช้
     */
    setupUIMainComputed() {
      if (!global.AppState || !global.Store) return;

      // 3.1 Filtered Leads: กรองข้อมูล Lead ตามคำค้นหา
      global.AppState.filteredLeads = computed(() => {
        // เลือกใช้คำค้นหาที่ผ่านการ Debounce แล้ว หรือคำค้นหาปัจจุบัน
        const query =
          global.AppState.searchQueryDebounced?.value !== undefined
            ? global.AppState.searchQueryDebounced.value
            : global.AppState.searchQuery.value;

        const list = global.Store.data.leadItems;

        // ใช้ Utility searchItems ในการค้นหา (ถ้ามี)
        if (global.Utils && typeof global.Utils.searchItems === "function") {
          return global.Utils.searchItems(list, query);
        }
        return list || []; // คืนค่า Array ว่างหากไม่มีข้อมูล
      });

      // 3.2 Total Pages: คำนวณจำนวนหน้าทั้งหมด
      global.AppState.totalPages = computed(() => {
        const perPage = global.AppState.itemsPerPage.value;
        const total = global.AppState.filteredLeads.value.length;

        // กรณีเลือกแสดงทั้งหมด ให้มี 1 หน้า
        if (perPage === "All") return 1;

        const num = Number(perPage);

        // ตรวจสอบและปรับเลขหน้าปัจจุบันหากเกินจำนวนหน้าที่มีจริง (Bound Check)
        if (global.AppState.page.value > Math.max(1, Math.ceil(total / num))) {
          global.AppState.page.value = 1;
        }
        return Math.max(1, Math.ceil(total / num));
      });

      // 3.3 Paged Leads: ตัดข้อมูล Lead เพื่อแสดงผลเฉพาะหน้าปัจจุบัน
      global.AppState.pagedLeads = computed(() => {
        const page = global.AppState.page.value;
        const perPage = global.AppState.itemsPerPage.value;
        const all = global.AppState.filteredLeads.value;

        // กรณีเลือกแสดงทั้งหมด อาจต้องแบ่ง Chunk เพื่อประสิทธิภาพการ Render (Virtual Scroll)
        if (perPage === "All") {
          return global.Utils && typeof global.Utils.chunkArray === "function"
            ? global.Utils.chunkArray(all, 2)
            : all;
        }

        // คำนวณ Index เริ่มต้นและสิ้นสุดสำหรับการ Slice Array
        const num = Number(perPage);
        const start = (page - 1) * num;
        const end = start + num;
        return all.slice(start, end);
      });
    },

    // ========================================================================
    // 4. REACTIVE WATCHERS (การดักจับการเปลี่ยนแปลงและ Side Effects)
    // ========================================================================

    /**
     * ตั้งค่า Watchers เพื่อตอบสนองต่อการเปลี่ยนแปลงของ State
     * จัดการ Logic ที่ไม่สามารถทำใน Computed ได้ เช่น การตั้งเวลา (Timer) หรือการเรียก Method ภายนอก
     */
    setupWatchers() {
      if (!global.AppState) return;

      // 4.1 Pagination Watcher: รีเซ็ตไปหน้า 1 เมื่อจำนวนรายการต่อหน้าเปลี่ยน
      watch(global.AppState.itemsPerPage, () => {
        global.AppState.page.value = 1;
      });

      // 4.2 Search Debounce Watcher: หน่วงเวลาการค้นหาเพื่อลดภาระการประมวลผล
      watch(global.AppState.searchQuery, (newVal) => {
        // รีเซ็ตหน้าเมื่อเริ่มพิมพ์ค้นหา
        global.AppState.page.value = 1;

        // ล้าง Timer เดิม (ถ้ามี) และเริ่มนับใหม่
        if (this.searchDebounceTimer) {
          clearTimeout(this.searchDebounceTimer);
        }
        this.searchDebounceTimer = setTimeout(() => {
          if (global.AppState.searchQueryDebounced) {
            global.AppState.searchQueryDebounced.value = newVal;
          }
        }, 250); // หน่วงเวลา 250ms
      });

      // --------------------------------------------------
      // 🧹 Auto-Reset Logic (ตรรกะการรีเซ็ตอัตโนมัติตาม Config)
      // --------------------------------------------------
      // ใช้กฎจาก AppConstants เพื่อลด Code Duplication ในการ Watch Modal แต่ละตัว
      const rules =
        global.AppConstants && global.AppConstants.UI_CONFIG
          ? global.AppConstants.UI_CONFIG.AUTO_RESET_RULES
          : null;

      if (rules) {
        rules.forEach((rule) => {
          const state = global.AppState[rule.stateKey];

          // ตรวจสอบว่า State ที่อ้างถึงมีอยู่จริง
          if (!state) {
            console.warn(`⚠️ AppGui: State '${rule.stateKey}' not found.`);
            return;
          }

          // Watch การเปลี่ยนแปลงของ State
          watch(state, (isOpen) => {
            // ทำงานเมื่อ Modal ถูกปิด (isOpen = false)
            if (!isOpen) {
              console.log(`🧹 Auto Reset: ${rule.label}`);

              // เรียกใช้ Method ของ Module ตามที่ระบุใน Config
              const targetModule = global[rule.module];
              if (
                targetModule &&
                typeof targetModule[rule.method] === "function"
              ) {
                targetModule[rule.method]();
              } else {
                console.warn(
                  `⚠️ Warning: Method ${rule.module}.${rule.method} not found`
                );
              }
            }
          });
        });
      }
    },

    // ========================================================================
    // 5. INITIALIZATION (การเริ่มต้นระบบ GUI)
    // ========================================================================

    /**
     * ฟังก์ชันหลักสำหรับเรียกใช้งานการตั้งค่าทั้งหมด
     * ควรถูกเรียกจาก App.js หรือจุด Entry Point
     */
    setupComputed() {
      this.setupUIMainComputed();
      this.setupWatchers();
    },

    /**
     * ฟังก์ชันสำหรับเลื่อนไปยัง Element ที่กำหนดภายในพื้นที่ Scroll ของ Modal
     * @param {string} targetSelector - ID หรือ Class ของเป้าหมาย
     * @param {string} containerSelector - พื้นที่ที่เป็น Scroll Container (ในที่นี้คือพื้นที่ใน Modal)
     */
    // js/gui.js
    scrollToElement(targetSelector) {
      const target = document.querySelector(targetSelector);
      // หาพื้นที่สำหรับ Scroll ของ Modal (v-card-text)
      const container = target ? target.closest(".v-card-text") : null;

      if (target && container) {
        // 1. หาความสูงจริงของส่วนหัวที่ตรึงไว้ (Sticky Header)
        const profileHeader = document.querySelector(".sticky-profile-area");
        const headerHeight = profileHeader ? profileHeader.offsetHeight : 0;

        // 2. คำนวณตำแหน่ง: (ตำแหน่งเป้าหมายเทียบกับขอบบนสุดของเอกสาร)
        // ลบด้วย (ตำแหน่งขอบบนสุดของพื้นที่ Scroll)
        // แล้วลบด้วยความสูงของส่วนหัว และระยะเผื่อ (Buffer)
        const buffer = -80;
        const targetRect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // คำนวณระยะที่ต้องเลื่อน (Scroll Top ใหม่)
        const scrollPosition =
          targetRect.top -
          containerRect.top +
          container.scrollTop -
          headerHeight -
          buffer;

        container.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    },
  };

  // ส่งออกเป็น Global Object (Pattern: Module Export)
  global.AppGui = AppGui;
})(window);
