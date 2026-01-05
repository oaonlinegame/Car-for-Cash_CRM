// js/gui.js
// --------------------------------------------------------
// 🖥️ GUI LOGIC MODULE
// --------------------------------------------------------
// โมดูลจัดการตรรกะการแสดงผล (Presentation Logic) และสถานะ UI
// ทำหน้าที่ควบคุมการไหลของข้อมูลจาก Store สู่ View (Data Flow),
// คำนวณสถานะสำหรับการแสดงผล (Computed Properties),
// และจัดการ Side Effects ผ่าน Watchers
// --------------------------------------------------------

(function (global) {
  "use strict";

  // ดึงฟังก์ชันที่จำเป็นจาก Vue (Dependency Injection)
  // เพื่อใช้ในการสร้าง Reactive State และ Computed Logic
  const { ref, reactive, watch, computed } = global.Vue;

  const AppGui = {
    // ========================================================================
    // 1. INTERNAL STATE (ตัวแปรภายในสำหรับควบคุม Logic)
    // ========================================================================

    /**
     * ตัวแปรเก็บ Timer สำหรับการหน่วงเวลาค้นหา (Debounce)
     * ใช้ป้องกันการคำนวณใหม่ทุกครั้งที่ผู้ใช้กดปุ่ม (Performance Optimization)
     * ช่วยลดภาระของ Browser ในการกรองข้อมูลจำนวนมากขณะพิมพ์
     */
    searchDebounceTimer: null,

    // ========================================================================
    // 2. INITIALIZATION & REACTIVE SETUP (การเริ่มต้นระบบและผูกตรรกะ)
    // ========================================================================

    /**
     * จุดเริ่มต้น (Entry Point) สำหรับการตั้งค่า Computed และ Watchers
     * ถูกเรียกใช้จาก App.js เมื่อ Component เริ่มต้นทำงาน (Mounted)
     * เพื่อให้มั่นใจว่า State กลาง (AppState) พร้อมใช้งานแล้ว
     */
    setupComputed() {
      this.setupUIMainComputed();
      this.setupWatchers();
    },

    /**
     * สร้าง Computed Properties สำหรับระบบแสดงผลหลัก
     * จัดการ Logic การกรองข้อมูล (Filtering) และการแบ่งหน้า (Pagination)
     * โดยผูกผลลัพธ์กลับเข้าไปที่ Global AppState เพื่อให้ Template เรียกใช้ได้ทันที
     */
    setupUIMainComputed() {
      // ตรวจสอบความพร้อมของ State และ Store ก่อนดำเนินการเพื่อป้องกัน Runtime Error
      if (!global.AppState || !global.Store) {
        console.error("❌ AppGui: AppState or Store is missing during setup.");
        return;
      }

      // --------------------------------------------------
      // 2.1 Filtered Leads: กรองข้อมูล Lead ตามคำค้นหา
      // --------------------------------------------------
      global.AppState.filteredLeads = computed(() => {
        // เลือกใช้คำค้นหาที่ผ่านการหน่วงเวลา (Debounced) เพื่อลดภาระการประมวลผล
        // หากไม่มีค่า Debounced ให้ใช้ค่าปัจจุบัน (Fallback) เพื่อการตอบสนองทันทีในบางกรณี
        const query =
          global.AppState.searchQueryDebounced?.value !== undefined
            ? global.AppState.searchQueryDebounced.value
            : global.AppState.searchQuery.value;

        const list = global.Store.data.leadItems;

        // เรียกใช้ Utility searchItems เพื่อทำการค้นหาข้อมูลใน Memory
        // โดยใช้ Search Index ที่ถูกสร้างไว้ล่วงหน้า (ถ้ามี)
        if (global.Utils && typeof global.Utils.searchItems === "function") {
          return global.Utils.searchItems(list, query);
        }

        // กรณีไม่มี Utility หรือไม่มีข้อมูล ให้คืนค่า Array ว่างเพื่อความปลอดภัย
        return list || [];
      });

      // --------------------------------------------------
      // 2.2 Total Pages: คำนวณจำนวนหน้าทั้งหมด
      // --------------------------------------------------
      global.AppState.totalPages = computed(() => {
        const perPage = global.AppState.itemsPerPage.value;
        const total = global.AppState.filteredLeads.value.length;

        // กรณีเลือกแสดงทั้งหมด (All) ให้ถือว่าเป็น 1 หน้าเสมอ
        if (perPage === "All") return 1;

        const num = Number(perPage);

        // คำนวณจำนวนหน้า (ปัดเศษขึ้น)
        const pages = Math.max(1, Math.ceil(total / num));

        // ตรวจสอบ Bound Check: หากหน้าปัจจุบันเกินจำนวนหน้าที่มีจริง
        // (เช่น เปลี่ยนคำค้นหาแล้วผลลัพธ์น้อยลง) ให้รีเซ็ตกลับไปหน้า 1
        if (global.AppState.page.value > pages) {
          global.AppState.page.value = 1;
        }

        return pages;
      });

      // --------------------------------------------------
      // 2.3 Paged Leads: ตัดแบ่งข้อมูลเพื่อแสดงผลหน้าปัจจุบัน
      // --------------------------------------------------
      global.AppState.pagedLeads = computed(() => {
        const page = global.AppState.page.value;
        const perPage = global.AppState.itemsPerPage.value;
        const all = global.AppState.filteredLeads.value;

        // กรณีเลือกแสดงทั้งหมด อาจใช้การ Chunk เพื่อประสิทธิภาพการ Render (Virtual Scroll)
        // เพื่อป้องกัน DOM จำนวนมากเกินไปทำให้หน้าจอค้าง
        if (perPage === "All") {
          return global.Utils && typeof global.Utils.chunkArray === "function"
            ? global.Utils.chunkArray(all, 2)
            : all;
        }

        // คำนวณ Index เริ่มต้นและสิ้นสุดสำหรับการตัด Array (Slicing)
        const num = Number(perPage);
        const start = (page - 1) * num;
        const end = start + num;

        // คืนค่าเฉพาะข้อมูลที่จะแสดงในหน้าปัจจุบัน
        return all.slice(start, end);
      });
    },

    /**
     * ตั้งค่า Watchers เพื่อจัดการ Side Effects เมื่อ State เปลี่ยนแปลง
     * ครอบคลุมการ Pagination, Search Debounce, และ Auto-Reset Rules
     */
    setupWatchers() {
      if (!global.AppState) return;

      // --------------------------------------------------
      // 3.1 Pagination Watcher
      // --------------------------------------------------
      // รีเซ็ตไปหน้า 1 เสมอเมื่อผู้ใช้เปลี่ยนจำนวนรายการต่อหน้า (Items Per Page)
      watch(global.AppState.itemsPerPage, () => {
        global.AppState.page.value = 1;
      });

      // --------------------------------------------------
      // 3.2 Search Debounce Watcher
      // --------------------------------------------------
      // หน่วงเวลาการส่งคำค้นหาเข้าสู่ระบบ Computed
      // เพื่อไม่ให้ระบบคำนวณใหม่ทุกตัวอักษรที่พิมพ์ (พิมพ์เสร็จแล้วค่อยหา)
      watch(global.AppState.searchQuery, (newVal) => {
        // รีเซ็ตหน้าเมื่อเริ่มเงื่อนไขการค้นหาใหม่
        global.AppState.page.value = 1;

        // ล้าง Timer เดิมและเริ่มนับใหม่ (Debounce Pattern)
        if (this.searchDebounceTimer) {
          clearTimeout(this.searchDebounceTimer);
        }
        this.searchDebounceTimer = setTimeout(() => {
          // อัปเดตตัวแปร Debounced เพื่อกระตุ้น Computed Property
          if (global.AppState.searchQueryDebounced) {
            global.AppState.searchQueryDebounced.value = newVal;
          }
        }, 250); // ระยะเวลาหน่วง 250ms
      });

      // --------------------------------------------------
      // 3.3 Auto-Reset Logic
      // --------------------------------------------------
      // ระบบรีเซ็ตสถานะอัตโนมัติตาม Configuration ใน AppConstants
      // ช่วยลดการเขียน Code ซ้ำซ้อนในการดักจับการปิด Modal แต่ละตัว
      const rules =
        global.AppConstants && global.AppConstants.UI_CONFIG
          ? global.AppConstants.UI_CONFIG.AUTO_RESET_RULES
          : null;

      if (rules) {
        rules.forEach((rule) => {
          const state = global.AppState[rule.stateKey];

          // ตรวจสอบว่า State ที่ระบุใน Config มีอยู่จริงหรือไม่
          if (!state) {
            console.warn(`⚠️ AppGui: State '${rule.stateKey}' not found.`);
            return;
          }

          // Watch การเปลี่ยนแปลงของสถานะ Modal
          watch(state, (isOpen) => {
            // ทำงานเมื่อ Modal ถูกปิด (isOpen = false)
            if (!isOpen) {
              console.log(`🧹 Auto Reset: ${rule.label}`);

              // เรียกใช้ Method ของ Module เป้าหมายเพื่อเคลียร์ค่าฟอร์ม
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
    // 3. STATE MUTATION (การเปลี่ยนแปลงสถานะ UI ทั่วไป)
    // ========================================================================

    /**
     * สลับสถานะ (Toggle) ของตัวแปร Boolean ใน AppState
     * @param {string} key - ชื่อ Key ใน AppState (ต้องเป็น Ref<boolean>)
     * @param {boolean} [force] - ค่าที่ต้องการบังคับ (Optional)
     */
    toggleMenu(key, force) {
      if (!global.AppState[key]) return;
      global.AppState[key].value =
        typeof force === "boolean" ? force : !global.AppState[key].value;
    },

    /**
     * ปิดเมนูและ Modal ทั้งหมดในระบบ (Reset UI State)
     * วนลูปตรวจสอบตัวแปรที่ขึ้นต้นด้วย "is" และสั่งปิดทั้งหมด
     * ใช้สำหรับกรณีต้องการเคลียร์หน้าจอ หรือเมื่อกดปุ่ม ESC
     */
    closeAllMenus() {
      if (!global.AppState) return;
      Object.keys(global.AppState).forEach((key) => {
        const val = global.AppState[key];
        // ตรวจสอบว่าเป็น Boolean Ref และกำลังเปิดอยู่หรือไม่
        if (key.startsWith("is") && val?.value === true) {
          val.value = false;
        }
      });
    },

    // ========================================================================
    // 4. COMPLEX UI WORKFLOWS (ตรรกะ UI เฉพาะทาง)
    // ========================================================================

    /**
     * จัดการ Workflow การเปิดแท็บ "สร้างสัญญาใหม่"
     * ตั้งค่าตัวแปร State หลายตัวพร้อมกันเพื่อเตรียมหน้าจอให้พร้อม
     */
    openContractTabPlus() {
      if (!global.AppState) return;

      // 1. กำหนด Routing ของ Tab ภายในให้ชี้ไปที่หน้าสร้างใหม่
      global.AppState.contractTab.value = "new";
      global.AppState.contractInnerTab.value = "all";

      // 2. รีเซ็ต Panel การแสดงผลให้เป็นค่าเริ่มต้นตาม Config
      if (
        global.AppConstants &&
        global.AppConstants.UI_CONFIG &&
        global.AppConstants.UI_CONFIG.DEFAULT_CONTRACT_PANELS
      ) {
        // ใช้ Array.from เพื่อสร้างสำเนาข้อมูลใหม่ ป้องกันการแก้ไขต้นฉบับ
        global.AppState.contractPanels.value = Array.from(
          global.AppConstants.UI_CONFIG.DEFAULT_CONTRACT_PANELS
        );
      }

      // 3. เรียกใช้ LeadApp เพื่อรีเซ็ตฟอร์มข้อมูลภายใน (Delegation)
      // ตรวจสอบก่อนเรียกใช้เพื่อป้องกัน Error กรณี LeadApp ยังไม่โหลด
      if (
        global.LeadApp &&
        typeof global.LeadApp.resetNewContractForm === "function"
      ) {
        global.LeadApp.resetNewContractForm();
      }
    },

    /**
     * คืนค่ารายการ Panel ของสัญญาให้กลับสู่ค่าเริ่มต้น
     * ใช้เมื่อมีการเปลี่ยน Context หรือโหลดสัญญาใหม่เพื่อความสม่ำเสมอของ UI
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

    // ========================================================================
    // 5. DOM MANIPULATION & SCROLLING (การจัดการ DOM และ Scroll)
    // ========================================================================

    /**
     * เลื่อน Scroll ไปยัง Element เป้าหมาย (Smooth Scroll)
     * คำนวณระยะโดยชดเชยความสูงของ Sticky Header โดยอัตโนมัติ
     * @param {string} targetSelector - CSS Selector ของเป้าหมาย (เช่น #section-1)
     * @param {number} buffer - ระยะห่างเพิ่มเติม (Offset) เพื่อความสวยงาม
     */
    scrollToElement(targetSelector, buffer = 120) {
      const target = document.querySelector(targetSelector);
      // ค้นหา Container ที่มี Scrollbar จริง (v-card-text)
      const container = target ? target.closest(".v-card-text") : null;

      if (target && container) {
        // ตรวจสอบความสูงของ Header ที่ตรึงอยู่ (Dynamic Calculation)
        const profileHeader = document.querySelector(".sticky-profile-area");
        const headerHeight = profileHeader ? profileHeader.offsetHeight : 0;

        const targetRect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // คำนวณตำแหน่ง Scroll ใหม่:
        // (ตำแหน่งเป้าหมาย - ขอบบน Container) + Scroll ปัจจุบัน - ความสูง Header - Buffer
        const scrollPosition =
          targetRect.top -
          containerRect.top +
          container.scrollTop -
          headerHeight -
          buffer;

        // สั่งให้ Container เลื่อนไปยังตำแหน่งที่คำนวณได้
        container.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    },

    /**
     * รีเซ็ตตำแหน่ง Scroll ของ Element ให้กลับไปด้านบนสุด
     * ใช้สำหรับกรณีเปลี่ยน Tab หรือโหลดเนื้อหาใหม่ เพื่อให้ผู้ใช้เริ่มอ่านจากต้น
     * @param {HTMLElement} el - Element ที่ต้องการรีเซ็ต
     */
    resetContractScroll(el) {
      if (!el) return;
      try {
        el.scrollTop = 0;
      } catch (err) {
        console.warn("resetContractScroll error:", err);
      }
    },
  };

  // ส่งออก AppGui เป็น Global Object เพื่อให้ไฟล์อื่นเรียกใช้
  global.AppGui = AppGui;
})(window);
