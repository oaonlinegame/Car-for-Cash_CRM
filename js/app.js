// js/app.js
// --------------------------------------------------------
// 📘 Hub รวม State + Logic → ให้ Template ใช้ (Pure Hub Version)
// --------------------------------------------------------

// สร้าง Vue App หลัก
const app = Vue.createApp({
  // คอมเมนต์: ใช้ Vue.createApp เพื่อสร้างอินสแตนซ์ของแอป
  setup() {
    // คอมเมนต์: ฟังก์ชัน setup ของ Composition API

    const { onMounted, onUnmounted, ref } = Vue; // คอมเมนต์: ดึง lifecycle hook และ ref จาก Vue
    const searchBarRef = ref(null); // คอมเมนต์: Ref สำหรับอ้างอิงช่องค้นหาใน Template

    // ----------------------------------------------------
    // ⭐ Hotkey & Element Binding (ผูก Hotkey และเรียกฟังก์ชันผูก Ref)
    // ----------------------------------------------------
    onMounted(() => {
      // คอมเมนต์: ตอน component ถูก mount
      window.addEventListener("keydown", Hotkey.handleKeyDown); // คอมเมนต์: ให้เริ่มฟัง event กดปุ่มคีย์บอร์ด

      // คอมเมนต์: เรียกฟังก์ชันภายนอก (AppGui) เพื่อจัดการผูก ref ช่องค้นหา
      window.AppGui.bindSearchRef(searchBarRef); // คอมเมนต์: ส่ง ref ช่องค้นหาไปให้ AppGui จัดการผูกกับ AppState.searchRef
    }); // คอมเมนต์: จบ onMounted

    onUnmounted(() => {
      // คอมเมนต์: ตอน component ถูกทำลาย
      window.removeEventListener("keydown", Hotkey.handleKeyDown); // คอมเมนต์: เอา event listener ออกเพื่อไม่ให้รั่ว
    }); // คอมเมนต์: จบ onUnmounted

    // ----------------------------------------------------
    // ⭐ Return ให้ UI ใช้ (Pure Hub)
    // ----------------------------------------------------
    return {
      // คอมเมนต์: คืนค่าตัวแปรและฟังก์ชันให้ template ใช้

      // --- UI State ---
      isMenuOpenFilterSearch: AppState.isMenuOpenFilterSearch, // คอมเมนต์: เมนูตัวกรอง
      isOpenModalLead: AppState.isOpenModalLead, // คอมเมนต์: Modal เพิ่ม Lead
      isOpenSubContractDialog: AppState.isOpenSubContractDialog, // คอมเมนต์: Dialog สัญญาย่อย
      isOpenModalLeadAutoFill: AppState.isOpenModalLeadAutoFill, // คอมเมนต์: Modal Autofill
      isOpenModalLog: AppState.isOpenModalLog, // คอมเมนต์: Modal Log
      isOpenModalRecordCallResult: AppState.isOpenModalRecordCallResult, // คอมเมนต์: Modal Call Result
      isOpenModalCarSettings: AppState.isOpenModalCarSettings, // คอมเมนต์: Modal Car Settings
      isOpenModalCarPriceSelector: AppState.isOpenModalCarPriceSelector, // คอมเมนต์: Modal Car Price

      // --- Tabs & Switches ---
      leadTab: AppState.leadTab, // คอมเมนต์: แท็บใน Modal Lead
      callResultTab: AppState.callResultTab, // คอมเมนต์: แท็บใน Call Result
      carSettingTab: AppState.carSettingTab, // คอมเมนต์: แท็บใน Car Settings
      Switch_newCustomer: AppState.Switch_newCustomer, // คอมเมนต์: Switch ลูกค้าใหม่

      // --- Config Items (สำหรับ Dropdown) ---
      occupationItems: AppState.occupationItems, // คอมเมนต์: รายการอาชีพ
      sourceItems: AppState.sourceItems, // คอมเมนต์: รายการแหล่งที่มา
      isOpenModalConfigSettings: AppState.isOpenModalConfigSettings, // คอมเมนต์: Modal การตั้งค่า Config
      configSettingTab: AppState.configSettingTab, // คอมเมนต์: แท็บการตั้งค่า Config

      // --- Search ---
      searchRef: AppState.searchRef, // คอมเมนต์: Ref ช่องค้นหา (Activator)
      searchQuery: AppState.searchQuery, // คอมเมนต์: ข้อความค้นหา
      searchBarRef, // คอมเมนต์: Ref ผูกกับ Element จริง

      // --- Pagination ---
      itemsPerPage: AppState.itemsPerPage, // คอมเมนต์: จำนวนต่อหน้า
      totalPages: AppState.totalPages, // คอมเมนต์: จำนวนหน้าทั้งหมด
      page: AppState.page, // คอมเมนต์: หน้าปัจจุบัน
      pagedLeads: AppState.pagedLeads, // คอมเมนต์: ข้อมูล Lead ที่แบ่งหน้าแล้ว

      // --- Data from Store ---
      leadItems: Store.data.leadItems, // คอมเมนต์: ข้อมูลดิบจาก Store
      leadHeaders: Store.data.leadHeaders, // คอมเมนต์: หัวตาราง

      // --- Lead Logic ---
      leadForm: LeadApp.form, // คอมเมนต์: ฟอร์มข้อมูล
      LeadApp: LeadApp, // คอมเมนต์: ส่ง Object หลักไปเผื่อเรียกฟังก์ชันย่อย
      addLead: LeadApp.add, // คอมเมนต์: เรียกฟังก์ชัน add โดยตรง
      updateLead: LeadApp.update, // คอมเมนต์: เรียกฟังก์ชัน update โดยตรง
      deleteLead: LeadApp.delete, // คอมเมนต์: เรียกฟังก์ชัน delete โดยตรง
      handleAddConfigItem: LeadApp.handleAddConfigItem, // คอมเมนต์: ฟังก์ชันเพิ่ม Config

      // --- Contract Actions ---
      addEmptyContract: LeadApp.addEmptyContract, // คอมเมนต์: เพิ่มสัญญาเปล่า
      resetNewContractForm: LeadApp.resetNewContractForm, // คอมเมนต์: รีเซ็ตฟอร์มสัญญา

      // --- GUI Actions ---
      toggleMenu: AppGui.toggleMenu, // คอมเมนต์: เปิด/ปิดเมนู
      closeAllMenus: AppGui.closeAllMenus, // คอมเมนต์: ปิดทั้งหมด

      // --- Modules & Helpers ---
      FileSystem, // คอมเมนต์: จัดการไฟล์
      TestData, // คอมเมนต์: ข้อมูลทดสอบ
      AppApi, // คอมเมนต์: API นำเข้า/ส่งออก
      notify: AppNotifications.show, // คอมเมนต์: แจ้งเตือน
      AppSetting, // คอมเมนต์: การตั้งค่า

      // --- Domain Logics ---
      CarApp, // คอมเมนต์: Logic รถยนต์
      CarLogic: CarApp, // คอมเมนต์: Alias เพื่อความเข้ากันได้
      FinanceApp, // คอมเมนต์: Logic การเงิน
    }; // คอมเมนต์: จบการคืนค่าจาก setup()
  }, // คอมเมนต์: จบฟังก์ชัน setup
}); // คอมเมนต์: จบการสร้างแอป Vue.createApp

// --------------------------------------------------------
// ⭐ สั่งการโดย SystemInit
// --------------------------------------------------------

// คอมเมนต์: 1. ลงทะเบียน Component ภายนอก
window.SystemInit.registerComponents(app);

// คอมเมนต์: 2. สร้าง Vuetify และ Mount App โดยรอการโหลดข้อมูลเริ่มต้น
window.SystemInit.mountApp(app);
