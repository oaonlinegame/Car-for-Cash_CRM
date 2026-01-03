// js/app.js
// --------------------------------------------------------
// 🚀 APPLICATION ENTRY POINT
// --------------------------------------------------------
// จุดเริ่มต้นหลักของแอปพลิเคชัน (Main Entry Point)
// ทำหน้าที่รวบรวมโมดูลต่างๆ (Modules Aggregation),
// จัดการวงจรชีวิตของแอปพลิเคชัน (Lifecycle Management),
// และเชื่อมโยงสถานะ (State Wiring) เข้ากับส่วนติดต่อผู้ใช้ (UI)
// --------------------------------------------------------

const app = Vue.createApp({
  setup() {
    // ========================================================================
    // 1. CORE DEPENDENCIES & REFERENCES
    // ========================================================================

    // ดึงฟังก์ชันที่จำเป็นจาก Vue Composition API
    const { onMounted, onUnmounted, ref } = Vue;

    // สร้าง Reference สำหรับ DOM Element (ช่องค้นหา)
    // ใช้สำหรับจัดการ Focus หรือ Event Programmatically
    const searchBarRef = ref(null);

    // ========================================================================
    // 2. SERVICE INITIALIZATION (การเริ่มต้นบริการและเชื่อมโยงระบบ)
    // ========================================================================

    // 2.1 เริ่มต้นระบบคำนวณค่าทาง GUI (Computed Properties)
    // ตั้งค่าตัวแปร Computed ต่างๆ เช่น Pagination, Filtered Lists
    AppGui.setupComputed();

    // 2.2 เชื่อมโยง State กลางเข้ากับ Business Logic Modules (Dependency Injection)
    // ส่ง AppState เข้าไปเพื่อให้โมดูลต่างๆ สามารถตอบสนองต่อการเปลี่ยนแปลงของ UI ได้
    // เช่น การรีเซ็ตฟอร์มเมื่อ Modal ถูกปิด
    // หมายเหตุ: เรียกใช้ฟังก์ชัน init โดยตรง (Assumed modules are loaded)
    LeadApp.init(AppState);
    ContractApp.init(AppState);
    CarApp.init(AppState);

    // ========================================================================
    // 3. DATA BOOTSTRAPPING (การโหลดข้อมูลเริ่มต้น)
    // ========================================================================

    // 3.1 เริ่มกระบวนการโหลดข้อมูล Master Data
    // โหลดตัวเลือกต่างๆ (Dropdowns) เช่น อาชีพ, แหล่งที่มา, ประเภทรถ
    MasterData.load();

    // 3.2 เริ่มกระบวนการโหลดข้อมูล Transactional Data
    // โหลดรายการ Lead ทั้งหมดจาก Database ลงสู่ Store
    LeadApp.loadAll();

    // ========================================================================
    // 4. LIFECYCLE HOOKS (การจัดการวงจรชีวิตแอปพลิเคชัน)
    // ========================================================================

    /**
     * ทำงานเมื่อ Component ถูกติดตั้งลงใน DOM เรียบร้อยแล้ว (Mounted)
     */
    onMounted(() => {
      // เริ่มต้นระบบคีย์ลัด (Shortcut System)
      AppShortcut.init();

      // เชื่อมโยง DOM Reference เข้ากับ State กลาง
      // เพื่อให้ Logic ภายนอกสามารถเข้าถึง Element ช่องค้นหาได้
      AppState.searchRef.value = searchBarRef;
    });

    /**
     * ทำงานเมื่อ Component กำลังจะถูกทำลาย (Unmounted)
     */
    onUnmounted(() => {
      // ยกเลิกระบบคีย์ลัดและคืนทรัพยากร (Cleanup)
      AppShortcut.cleanup();
    });

    // ========================================================================
    // 5. CONTEXT EXPOSURE (การส่งค่าออกไปให้ Template ใช้งาน)
    // ========================================================================

    return {
      // --- 5.1 Global State (สถานะรวมของระบบ) ---
      ...AppState,

      // --- 5.2 Data Views (ข้อมูลสำหรับการแสดงผล) ---
      leadItems: Store.data.leadItems, // รายการ Lead
      leadHeaders: Store.data.leadHeaders, // หัวตาราง
      leadForm: LeadApp.form, // ฟอร์ม Lead ปัจจุบัน

      // --- 5.3 Domain Actions (การกระทำเกี่ยวกับข้อมูลหลัก) ---
      addLead: LeadApp.add,
      updateLead: LeadApp.updateLead,
      deleteLead: LeadApp.deleteLead,
      addEmptyContract: LeadApp.addEmptyContract,

      // --- 5.4 UI Actions (การควบคุมหน้าจอ) ---
      toggleMenu: AppGui.toggleMenu,
      closeAllMenus: AppGui.closeAllMenus,
      openContractTabPlus: AppGui.openContractTabPlus,

      // --- 5.5 External Modules (โมดูลภายนอกที่เรียกใช้ใน Template) ---
      FileSystem,
      TestData,
      Store,
      CarApp,
      FinanceApp,
      LeadApp,
      AssetApp,
      AppGui,
      Utils,
      AppSetting,
      MasterData,
      AppBot,
      AppApi,

      // --- 5.6 DOM References ---
      searchBarRef,
    };
  },
});

// ========================================================================
// 6. APPLICATION MOUNTING (การติดตั้งแอปพลิเคชัน)
// ========================================================================

// กำหนดค่าเริ่มต้นให้กับ UI Framework (Vuetify, Plugins)
AppSetting.init(app);

// ติดตั้งแอปพลิเคชันลงใน Element #app
app.mount("#app");
