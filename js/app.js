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
    // ดึงฟังก์ชันที่จำเป็นจาก Vue Composition API เพื่อใช้งานภายใน setup
    const { onMounted, onUnmounted, ref } = Vue;

    // สร้าง Reference สำหรับ DOM Element ของช่องค้นหา
    // เพื่อให้ระบบสามารถสั่ง Focus หรือจัดการ Event ได้โดยตรงจากฝั่ง Logic
    const searchBarRef = ref(null);

    // ========================================================================
    // 2. SYSTEM INITIALIZATION (การเริ่มต้นระบบและเชื่อมโยงโมดูล)
    // ========================================================================

    // 2.1 เตรียมการคำนวณข้อมูลสำหรับการแสดงผล (Computed Properties)
    // กำหนด Logic การกรองข้อมูล (Filtering) และการแบ่งหน้า (Pagination) ในระดับ GUI
    AppGui.setupComputed();

    // 2.2 เชื่อมโยง State กลางเข้ากับ Business Logic Modules (Dependency Injection)
    // ส่ง AppState เข้าไปในโมดูลต่างๆ เพื่อให้แต่ละส่วนสามารถตอบสนองต่อการเปลี่ยนแปลงของ UI ได้
    // เช่น การสั่งรีเซ็ตฟอร์มโดยอัตโนมัติเมื่อ Modal ถูกปิดลง
    LeadApp.init(AppState); // จัดการข้อมูลลูกค้า

    // ลงทะเบียน Components ทั่วไปที่ใช้ในแอป
    window.registerFloatingButton && window.registerFloatingButton(app); // ปุ่มลอย

    // ลงทะเบียน Components ที่เกี่ยวข้องกับ Lead
    window.registerDialogLead && window.registerDialogLead(app); // Dialog ลูกค้า
    window.registerLeadMainInfo && window.registerLeadMainInfo(app); // ข้อมูลหลักลูกค้า
    window.registerLeadContactInfo && window.registerLeadContactInfo(app); // ข้อมูลการติดต่อลูกค้า
    window.registerLeadSourceInfo && window.registerLeadSourceInfo(app); // ข้อมูลแหล่งที่มาลูกค้า
    window.registerAssetSection && window.registerAssetSection(app); // ส่วนแสดงสินทรัพย์
    window.registerLeadNoteInfo && window.registerLeadNoteInfo(app); // ข้อมูลหมายเหตุลูกค้า

    // ลงทะเบียน Components ที่เกี่ยวข้องกับ Contract
    window.registerContractMainInfo && window.registerContractMainInfo(app); // ข้อมูลหลักสัญญา

    ContractApp.init(AppState); // จัดการข้อมูลสัญญา
    CarApp.init(AppState); // จัดการข้อมูลยานพาหนะ

    // ========================================================================
    // 3. DATA BOOTSTRAPPING (การโหลดข้อมูลเริ่มต้น)
    // ========================================================================

    // 3.1 โหลดข้อมูล Master Data จาก Database ขึ้นสู่ Memory
    // เพื่อเตรียมตัวเลือกใน Dropdown ต่างๆ (เช่น รายชื่ออาชีพ, ยี่ห้อรถ) ให้พร้อมใช้งาน
    MasterData.load();

    // 3.2 โหลดข้อมูล Transactional Data
    // ดึงรายการ Lead ทั้งหมดจาก IndexedDB มาเก็บไว้ใน Global Store เพื่อแสดงผลในตารางหลัก
    LeadApp.loadAll();

    // ========================================================================
    // 4. LIFECYCLE HOOKS (การจัดการวงจรชีวิตแอปพลิเคชัน)
    // ========================================================================

    /**
     * ทำงานเมื่อ Component ถูกติดตั้งลงใน DOM เรียบร้อยแล้ว (Mounted)
     */
    onMounted(() => {
      // เริ่มต้นการดักจับปุ่มกดคีย์ลัด (Shortcut Keys) ทั่วทั้งระบบ
      AppShortcut.init();

      // บันทึก DOM Reference ของช่องค้นหาลงใน State กลาง
      // เพื่อให้โมดูลอื่น (เช่น AppShortcut) สามารถสั่ง Focus ช่องค้นหาได้ผ่านคีย์ลัด
      AppState.searchRef.value = searchBarRef;
    });

    /**
     * ทำงานเมื่อ Component กำลังจะถูกทำลาย (Unmounted)
     */
    onUnmounted(() => {
      // ถอดถอนการดักจับคีย์ลัดและคืนทรัพยากรให้กับระบบ เพื่อป้องกัน Memory Leak
      AppShortcut.cleanup();
    });

    // ========================================================================
    // 5. CONTEXT EXPOSURE (การส่งค่าออกไปให้ Template ใช้งาน)
    // ========================================================================
    // ส่วนนี้ระบุว่าตัวแปรหรือฟังก์ชันใดบ้างที่หน้า HTML (index.html) สามารถเรียกใช้ได้

    return {
      // --- 5.1 Global State (สถานะหลักของระบบ) ---
      ...AppState, // แตกตัวแปร ref ทั้งหมดใน AppState ออกมาเพื่อให้เรียกใช้ได้ทันที

      // --- 5.2 Data Views (ข้อมูลสำหรับการแสดงผล) ---
      leadItems: Store.data.leadItems, // รายการลูกค้าทั้งหมด
      leadHeaders: Store.data.leadHeaders, // หัวตารางสำหรับ v-data-table
      leadForm: LeadApp.form, // ข้อมูลในฟอร์มที่กำลังกรอกอยู่

      // --- 5.3 Domain Actions (การจัดการข้อมูลหลัก) ---
      addLead: LeadApp.add, // ฟังก์ชันเพิ่มลูกค้าใหม่
      updateLead: LeadApp.updateLead, // ฟังก์ชันแก้ไขข้อมูลลูกค้า
      deleteLead: LeadApp.deleteLead, // ฟังก์ชันลบข้อมูลลูกค้า
      addEmptyContract: LeadApp.addEmptyContract, // ฟังก์ชันเพิ่มแถวสัญญาว่าง

      // --- 5.4 UI Actions (การควบคุมหน้าจอ) ---
      toggleMenu: AppGui.toggleMenu, // ฟังก์ชันเปิด/ปิด Modals
      closeAllMenus: AppGui.closeAllMenus, // ฟังก์ชันปิดทุกหน้าต่าง
      openContractTabPlus: AppGui.openContractTabPlus, // ฟังก์ชันเปิดแท็บสัญญาใหม่

      // --- 5.5 External Modules (โมดูลสนับสนุน) ---
      // ส่ง Object ของโมดูลต่างๆ ออกไปเพื่อให้ Template สามารถเรียกใช้ Helper Functions ได้โดยตรง
      AppConstants,
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
      LogApp,

      // --- 5.6 DOM References ---
      searchBarRef, // สำหรับผูกกับ ref="searchBarRef" ใน HTML
    };
  },
});

// ========================================================================
// 6. APPLICATION MOUNTING (การติดตั้งแอปพลิเคชัน)
// ========================================================================

// กำหนดค่าเริ่มต้นให้กับ UI Framework และ Plugins (เช่น Vuetify, Scroller)
// โดยการ Inject Vue Instance เข้าไปในโมดูล Setting
AppSetting.init(app);

// ติดตั้งแอปพลิเคชันลงใน Element ID "app" ในหน้า HTML
app.mount("#app");
