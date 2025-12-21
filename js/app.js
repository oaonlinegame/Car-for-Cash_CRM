// js/app.js
// --------------------------------------------------------
// 📘 Hub: ศูนย์กลางเชื่อมต่อ Module เข้ากับ Vue Template
// --------------------------------------------------------
// หน้าที่:
// 1. สร้าง Vue Instance (App Root)
// 2. รวบรวม State และ Function จากไฟล์ต่างๆ ส่งเข้า Template
// 3. จัดการ Lifecycle หลัก (Mounted, Unmounted)
// --------------------------------------------------------

const app = Vue.createApp({
  setup() {
    // ดึง Composition API จาก Vue Global
    const { onMounted, onUnmounted, ref } = Vue;

    // สร้าง Ref สำหรับกล่องค้นหา (Search Input DOM)
    const searchBarRef = ref(null);

    // ----------------------------------------------------
    // ⭐ Lifecycle Hooks
    // ----------------------------------------------------
    onMounted(() => {
      // ผูก Event Listener สำหรับคีย์ลัด (Hotkeys)
      window.addEventListener("keydown", Hotkey.handleKeyDown);

      // ส่ง Ref ของกล่องค้นหาไปให้ AppGui จัดการ (เช่น สั่ง Focus)
      window.AppGui.bindSearchRef(searchBarRef);
    });

    onUnmounted(() => {
      // ลบ Event Listener เมื่อปิดแอป (Cleanup)
      window.removeEventListener("keydown", Hotkey.handleKeyDown);
    });

    // ----------------------------------------------------
    // ⭐ Return: ส่งตัวแปรและฟังก์ชันออกไปให้ HTML ใช้
    // ----------------------------------------------------
    return {
      // --- หมวด UI State (ควบคุมการเปิด/ปิดเมนู) ---
      isMenuOpenFilterSearch: AppState.isMenuOpenFilterSearch, // เมนูตัวกรอง
      isOpenModalLead: AppState.isOpenModalLead, // โมดอลลูกค้า
      isOpenSubContractDialog: AppState.isOpenSubContractDialog, // โมดอลสัญญาย่อย
      isOpenModalLeadAutoFill: AppState.isOpenModalLeadAutoFill, // โมดอล AutoFill
      isOpenModalLog: AppState.isOpenModalLog, // โมดอล Log
      isOpenModalRecordCallResult: AppState.isOpenModalRecordCallResult, // โมดอลผลการโทร
      isOpenModalCarSettings: AppState.isOpenModalCarSettings, // โมดอลตั้งค่ารถ
      isOpenModalCarPriceSelector: AppState.isOpenModalCarPriceSelector, // โมดอลเลือกราคากลาง

      // --- หมวด Tabs & Switches (ตัวเลือกหน้าจอ) ---
      leadTab: AppState.leadTab, // แท็บหลักในหน้าลูกค้า
      callResultTab: AppState.callResultTab, // แท็บผลการติดตาม
      carSettingTab: AppState.carSettingTab, // แท็บตั้งค่ารถ
      Switch_newCustomer: AppState.Switch_newCustomer, // สวิตช์ลูกค้าใหม่

      // --- หมวด Config Items (ตัวเลือก Dropdown) ---
      occupationItems: AppState.occupationItems, // รายการอาชีพ
      sourceItems: AppState.sourceItems, // รายการแหล่งที่มา
      isOpenModalConfigSettings: AppState.isOpenModalConfigSettings, // โมดอลตั้งค่า Config
      configSettingTab: AppState.configSettingTab, // แท็บในหน้า Config

      // --- หมวด Search (ระบบค้นหา) ---
      searchRef: AppState.searchRef, // ตัวแปรค้นหา (Reactive)
      searchQuery: AppState.searchQuery, // ข้อความค้นหา
      searchBarRef, // DOM Reference ของช่องค้นหา

      // --- หมวด Pagination (การแบ่งหน้า) ---
      itemsPerPage: AppState.itemsPerPage, // จำนวนรายการต่อหน้า
      totalPages: AppState.totalPages, // จำนวนหน้าทั้งหมด
      page: AppState.page, // หน้าปัจจุบัน
      pagedLeads: AppState.pagedLeads, // ข้อมูล Lead ในหน้านั้นๆ

      // --- หมวด Data Store (ข้อมูลดิบ) ---
      leadItems: Store.data.leadItems, // รายการ Lead ทั้งหมด
      leadHeaders: Store.data.leadHeaders, // หัวตาราง Lead

      // --- หมวด Lead Logic (จัดการลูกค้า) ---
      leadForm: LeadApp.form, // ฟอร์มลูกค้า (Reactive)
      LeadApp: LeadApp, // ส่ง LeadApp ไปทั้งก้อน (เผื่อใช้)
      addLead: LeadApp.add, // ฟังก์ชันเพิ่มลูกค้า
      updateLead: LeadApp.update, // ฟังก์ชันอัปเดต
      deleteLead: LeadApp.delete, // ฟังก์ชันลบ
      handleAddConfigItem: LeadApp.handleAddConfigItem, // ฟังก์ชันเพิ่มตัวเลือก Dropdown

      // --- หมวด Contract Logic (จัดการสัญญา) ---
      ContractApp: window.ContractApp, // ส่ง ContractApp
      addEmptyContract: window.ContractApp.addEmptyContract, // ฟังก์ชันเพิ่มสัญญา
      resetNewContractForm: window.ContractApp.resetNewContractForm, // ฟังก์ชันรีเซ็ตฟอร์มสัญญา

      // --- หมวด Asset Logic (จัดการสินทรัพย์) ---
      AssetApp: window.AssetApp, // ✅ ต้องเพิ่มบรรทัดนี้ เพื่อให้ HTML เรียก AssetApp.add() ได้

      // --- หมวด GUI Actions (จัดการหน้าจอทั่วไป) ---
      toggleMenu: AppGui.toggleMenu, // สลับเปิด/ปิดเมนู
      closeAllMenus: AppGui.closeAllMenus, // ปิดเมนูทั้งหมด

      // --- หมวด Modules & Helpers (เครื่องมือเสริม) ---
      FileSystem, // ระบบจัดการไฟล์
      TestData, // ข้อมูลทดสอบ
      AppApi, // API เชื่อมต่อภายนอก
      notify: AppNotifications.show, // ระบบแจ้งเตือน (Toast)
      AppSetting, // การตั้งค่าระบบ

      // --- หมวด Domain Logics อื่นๆ ---
      CarApp, // ระบบจัดการรถ
      CarLogic: CarApp, // (Alias ชื่อเดิม)
      FinanceApp, // ระบบไฟแนนซ์
    };
  },
});

// --------------------------------------------------------
// ⭐ System Init: ลงทะเบียนและเริ่มทำงาน
// --------------------------------------------------------
window.SystemInit.registerComponents(app); // ลงทะเบียน Component (ถ้ามี)
window.SystemInit.mountApp(app); // Mount ลง index.html
