// app.js
// --------------------------------------------------------
// 📘 Hub รวม State + Logic → ให้ Template ใช้
// --------------------------------------------------------

// สร้าง Vue App หลัก
const app = Vue.createApp({
  //   ใช้ Vue.createApp เพื่อสร้างอินสแตนซ์ของแอป
  setup() {
    //   ฟังก์ชัน setup ของ Composition API

    // ----------------------------------------------------
    // ⭐ โหลดข้อมูล Lead จาก Dexie → Store เมื่อเริ่มระบบ
    // ----------------------------------------------------
    LeadApp.loadAll(); //   ดึงข้อมูลทั้งหมดจาก Dexie แล้วใส่ใน Store

    // ----------------------------------------------------
    // ⭐ Setup pagination + search
    // ----------------------------------------------------
    AppGui.setupComputed(); //   ตั้งค่า computed สำหรับ filteredLeads / totalPages / pagedLeads

    const { onMounted, onUnmounted, ref } = Vue; //   ดึง lifecycle hook และ ref จาก Vue

    // สร้าง Ref ภายใน Vue สำหรับอ้างอิงถึงช่องค้นหา
    const searchBarRef = ref(null); //   [ใหม่] Ref สำหรับอ้างอิงช่องค้นหาใน Template

    // ⭐ Hotkey
    onMounted(() => {
      //   ตอน component ถูก mount
      window.addEventListener("keydown", Hotkey.handleKeyDown); //   ให้เริ่มฟัง event กดปุ่มคีย์บอร์ด

      // ตั้งค่า AppState.searchRef ให้ชี้ไปที่ ref ของช่องค้นหาจริง ๆ
      if (AppState.searchRef) {
        AppState.searchRef.value = searchBarRef; //   ผูก ref จาก template เข้า AppState
      }
    });
    onUnmounted(
      () =>
        //   ตอน component ถูกทำลาย
        window.removeEventListener("keydown", Hotkey.handleKeyDown) //   เอา event listener ออกเพื่อไม่ให้รั่ว (memory leak)
    );

    // ----------------------------------------------------
    // ⭐ Return ให้ UI ใช้
    // ----------------------------------------------------
    return {
      //   คืนค่าตัวแปรและฟังก์ชันให้ template ใช้

      // UI State
      isMenuOpenFilterSearch: AppState.isMenuOpenFilterSearch, //   สถานะเปิด/ปิดเมนู filter search
      isOpenModalLead: AppState.isOpenModalLead, //   สถานะเปิด/ปิด modal เพิ่ม lead
      isOpenSubContractDialog: AppState.isOpenSubContractDialog, // dialog สัญญาย่อย
      isOpenModalLeadAutoFill: AppState.isOpenModalLeadAutoFill, // modal autofill lead
      isOpenModalLog: AppState.isOpenModalLog, // modal บันทึกการโทร/ติดตาม
      leadTab: AppState.leadTab, //แท็บของ Modal Lead (leadInfo / contracts)
      isOpenModalRecordCallResult: AppState.isOpenModalRecordCallResult, // modal บันทึกผลการโทร
      callResultTab: AppState.callResultTab, // แท็บของ modal บันทึกผลการโทร (conversation/result)
      Switch_newCustomer: AppState.Switch_newCustomer, //เลือกว่าจะเป็นเป็นลุกค้าใหม่หรือไม่ lead dialog
      isOpenModalCarSettings: AppState.isOpenModalCarSettings, // สถานะเปิด/ปิด modal การตั้งค่าข้อมูลรถยนต์
      carSettingTab: AppState.carSettingTab, // แท็บของ modal การตั้งค่าข้อมูลรถยนต์ (price_list/other_settings)
      isOpenModalCarPriceSelector: AppState.isOpenModalCarPriceSelector, // modal เลือกราคากลางรถยนต์

      // Search
      searchRef: AppState.searchRef, // ref ของช่อง search สำหรับผูกกับ v-menu activator
      searchQuery: AppState.searchQuery, //  ข้อความที่ใช้ค้นหา lead
      searchBarRef, // Ref ที่ใช้ผูกกับ v-text-field ใน Template

      // Pagination
      itemsPerPage: AppState.itemsPerPage, //   จำนวนรายการต่อหน้า (5,10,20,All)
      totalPages: AppState.totalPages, //   จำนวนหน้าทั้งหมดที่คำนวณจาก filteredLeads
      page: AppState.page, //   หน้าปัจจุบันของ pagination
      pagedLeads: AppState.pagedLeads, //   รายการ lead ที่จะถูกแสดงในหน้านั้น (หลัง search+slice แล้ว)

      // Data
      leadItems: Store.data.leadItems, //   รายการ lead ทั้งหมดจาก Store (ดิบ)
      leadHeaders: Store.data.leadHeaders, //   header ของตาราง lead (ถ้ามีใช้ในที่อื่น)

      // Lead Logic
      leadForm: LeadApp.form, //   ฟอร์มของ lead ที่ใช้ใน modal
      addLead: LeadApp.add, //   ฟังก์ชันเพิ่ม lead ใหม่ (เรียกผ่าน LeadApp)
      updateLead: LeadApp.updateLead, //   ฟังก์ชันอัปเดตข้อมูล lead
      deleteLead: LeadApp.deleteLead, //   ฟังก์ชันลบ lead

      // ---------- Contract Actions ----------
      addEmptyContract: LeadApp.addEmptyContract, //   ฟังก์ชันเพิ่มสัญญาเปล่าให้ lead ปัจจุบัน
      resetNewContractForm: LeadApp.resetNewContractForm, //

      // GUI
      toggleMenu: AppGui.toggleMenu, //   ฟังก์ชันเปิด/ปิดเมนู/โมดอล ตาม key ที่ส่งเข้าไป
      closeAllMenus: AppGui.closeAllMenus, //   ฟังก์ชันปิดทุกเมนู/โมดอล

      // File Export / Import
      FileSystem, //   อ็อบเจกต์ที่จัดการดาวน์โหลดไฟล์ CSV/ZIP/VCF
      TestData, //   โมดูลสร้างข้อมูลทดสอบ (เช่น generate1000)
      AppApi, //   โมดูลจัดการ Import/Export ผ่าน API/ไฟล์

      // Notifications
      notify: AppNotifications.show, //   ฟังก์ชันแจ้งเตือนข้อความในระบบ

      // Car Logic (เปลี่ยนจาก CarLogic เป็น CarApp)
      CarApp, // คอมเมนต์: ส่งออก CarApp ให้ HTML เรียกใช้ได้ (รวม Logic และ State รถยนต์)

      // Finance Logic (เพิ่ม FinanceApp)
      FinanceApp, // คอมเมนต์: ส่งออก FinanceApp ให้ HTML เรียกใช้ได้ (รวม Logic และ State สินเชื่อ)
    }; //   จบการคืนค่าจาก setup()
  }, //   จบฟังก์ชัน setup
}); //   จบการสร้างแอป Vue.createApp

// --------------------------------------------------------
// ⭐ ลงทะเบียน Virtual Scroller ให้ใช้แท็ก <virtual-scroller> ใน Template
// --------------------------------------------------------
if (window.VueVirtualScroller && window.VueVirtualScroller.VirtualScroller) {
  //   เช็คว่ามีไลบรารี VueVirtualScroller ถูกโหลดแล้วหรือไม่
  app.component(
    //   ลงทะเบียน component ระดับ global ให้แอปนี้ใช้ได้ทุกที่
    "virtual-scroller", //   ชื่อแท็กที่ใช้ใน template คือ <virtual-scroller>
    window.VueVirtualScroller.VirtualScroller //   ชี้ไปที่ component VirtualScroller จากไลบรารี
  ); //   จบคำสั่ง component()
} //   จบ if เช็คไลบรารี

// ⭐ mount Vue
const vuetify = Vuetify.createVuetify({
  components: {
    ...Vuetify.components, // คอมโพเนนต์หลัก
    ...Vuetify.labs, // คอมโพเนนต์ Labs ทั้งหมด
  },
});
app.use(vuetify).mount("#app"); //   ผูก Vuetify กับแอป และ mount ลง div#app
