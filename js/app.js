// app.js
// --------------------------------------------------------
// 📘 Hub รวม State + Logic → ให้ Template ใช้
// --------------------------------------------------------

// สร้าง Vue App หลัก                                                   // คอมเมนต์: สร้างตัวแอป Vue หลัก
const app = Vue.createApp({
  // คอมเมนต์: ใช้ Vue.createApp เพื่อสร้างอินสแตนซ์ของแอป
  setup() {
    // คอมเมนต์: ฟังก์ชัน setup ของ Composition API

    // ----------------------------------------------------
    // ⭐ โหลดข้อมูล Lead จาก Dexie → Store เมื่อเริ่มระบบ
    // ----------------------------------------------------
    LeadApp.loadAll(); // คอมเมนต์: ดึงข้อมูลทั้งหมดจาก Dexie แล้วใส่ใน Store

    // ----------------------------------------------------
    // ⭐ Setup pagination + search
    // ----------------------------------------------------
    AppGui.setupComputed(); // คอมเมนต์: ตั้งค่า computed สำหรับ filteredLeads / totalPages / pagedLeads

    const { onMounted, onUnmounted } = Vue; // คอมเมนต์: ดึง lifecycle hook จาก Vue

    // ⭐ Hotkey
    onMounted(() => window.addEventListener("keydown", Hotkey.handleKeyDown)); // คอมเมนต์: ตอน component ถูก mount ให้เริ่มฟัง event กดปุ่มคีย์บอร์ด
    onUnmounted(
      () =>
        // คอมเมนต์: ตอน component ถูกทำลาย
        window.removeEventListener("keydown", Hotkey.handleKeyDown) // คอมเมนต์: เอา event listener ออกเพื่อไม่ให้รั่ว (memory leak)
    );

    // ----------------------------------------------------
    // ⭐ Return ให้ UI ใช้
    // ----------------------------------------------------
    return {
      // คอมเมนต์: คืนค่าตัวแปรและฟังก์ชันให้ template ใช้

      // UI State
      isMenuOpenFilterSearch: AppState.isMenuOpenFilterSearch, // คอมเมนต์: สถานะเปิด/ปิดเมนู filter search
      isOpenModalLead: AppState.isOpenModalLead, // คอมเมนต์: สถานะเปิด/ปิด modal เพิ่ม lead
      leadTab: AppState.leadTab, //แท็บของ Modal Lead (leadInfo / contracts)
      Switch_newCustomer: AppState.Switch_newCustomer, //เลือกว่าจะเป็นเป็นลุกค้าใหม่หรือไม่ lead dialog

      // Search
      searchRef: AppState.searchRef, // คอมเมนต์: ref ของช่อง search สำหรับผูกกับ v-menu activator
      searchQuery: AppState.searchQuery, // คอมเมนต์: ข้อความที่ใช้ค้นหา lead

      // Pagination
      itemsPerPage: AppState.itemsPerPage, // คอมเมนต์: จำนวนรายการต่อหน้า (5,10,20,All)
      totalPages: AppState.totalPages, // คอมเมนต์: จำนวนหน้าทั้งหมดที่คำนวณจาก filteredLeads
      page: AppState.page, // คอมเมนต์: หน้าปัจจุบันของ pagination
      pagedLeads: AppState.pagedLeads, // คอมเมนต์: รายการ lead ที่จะถูกแสดงในหน้านั้น (หลัง search+slice แล้ว)

      // Data
      leadItems: Store.data.leadItems, // คอมเมนต์: รายการ lead ทั้งหมดจาก Store (ดิบ)
      leadHeaders: Store.data.leadHeaders, // คอมเมนต์: header ของตาราง lead (ถ้ามีใช้ในที่อื่น)

      // Lead Logic
      leadForm: LeadApp.form, // คอมเมนต์: ฟอร์มของ lead ที่ใช้ใน modal
      addLead: () => LeadApp.addLead(), // คอมเมนต์: ฟังก์ชันเพิ่ม lead ใหม่ (เรียกผ่าน LeadApp)
      updateLead: LeadApp.updateLead, // คอมเมนต์: ฟังก์ชันอัปเดตข้อมูล lead
      deleteLead: LeadApp.deleteLead, // คอมเมนต์: ฟังก์ชันลบ lead

      // GUI
      toggleMenu: AppGui.toggleMenu, // คอมเมนต์: ฟังก์ชันเปิด/ปิดเมนู/โมดอล ตาม key ที่ส่งเข้าไป
      closeAllMenus: AppGui.closeAllMenus, // คอมเมนต์: ฟังก์ชันปิดทุกเมนู/โมดอล

      // File Export / Import
      FileSystem, // คอมเมนต์: อ็อบเจกต์ที่จัดการดาวน์โหลดไฟล์ CSV/ZIP/VCF
      TestData, // คอมเมนต์: โมดูลสร้างข้อมูลทดสอบ (เช่น generate1000)
      AppApi, // คอมเมนต์: โมดูลจัดการ Import/Export ผ่าน API/ไฟล์

      // Notifications
      notify: AppNotifications.show, // คอมเมนต์: ฟังก์ชันแจ้งเตือนข้อความในระบบ
    }; // คอมเมนต์: จบการคืนค่าจาก setup()
  }, // คอมเมนต์: จบฟังก์ชัน setup
}); // คอมเมนต์: จบการสร้างแอป Vue.createApp

// --------------------------------------------------------
// ⭐ ลงทะเบียน Virtual Scroller ให้ใช้แท็ก <virtual-scroller> ใน Template
// --------------------------------------------------------
if (window.VueVirtualScroller && window.VueVirtualScroller.VirtualScroller) {
  // คอมเมนต์: เช็คว่ามีไลบรารี VueVirtualScroller ถูกโหลดแล้วหรือไม่
  app.component(
    // คอมเมนต์: ลงทะเบียน component ระดับ global ให้แอปนี้ใช้ได้ทุกที่
    "virtual-scroller", // คอมเมนต์: ชื่อแท็กที่ใช้ใน template คือ <virtual-scroller>
    window.VueVirtualScroller.VirtualScroller // คอมเมนต์: ชี้ไปที่ component VirtualScroller จากไลบรารี
  ); // คอมเมนต์: จบคำสั่ง component()
} // คอมเมนต์: จบ if เช็คไลบรารี

// ⭐ mount Vue
const vuetify = Vuetify.createVuetify(); // คอมเมนต์: สร้างอินสแตนซ์ Vuetify
app.use(vuetify).mount("#app"); // คอมเมนต์: ผูก Vuetify กับแอป และ mount ลง div#app
