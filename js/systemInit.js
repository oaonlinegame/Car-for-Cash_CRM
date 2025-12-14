// js/systemInit.js
// --------------------------------------------------------
// 📘 System Initialization Logic
// --------------------------------------------------------
// ทำหน้าที่:
// 1. ลงทะเบียน Component ภายนอก (Virtual Scroller)
// 2. สร้าง Vuetify Instance
// 3. จัดการ Mount Vue App โดยรอ AppInitPromise
// --------------------------------------------------------

const SystemInit = {
  // ----------------------------------------------------
  // ⭐ registerComponents(app)
  // ลงทะเบียน Component ภายนอกเข้า Vue App
  // ----------------------------------------------------
  registerComponents(app) {
    // คอมเมนต์: ฟังก์ชันลงทะเบียน Component ภายนอก
    if (
      window.VueVirtualScroller &&
      window.VueVirtualScroller.VirtualScroller
    ) {
      // คอมเมนต์: ตรวจสอบไลบรารี Virtual Scroller
      app.component(
        // คอมเมนต์: ลงทะเบียน component ระดับ global
        "virtual-scroller", // คอมเมนต์: ชื่อแท็กที่ใช้ใน template
        window.VueVirtualScroller.VirtualScroller // คอมเมนต์: ชี้ไปที่ component จริง
      ); // คอมเมนต์: จบคำสั่ง component()
      console.log("✅ Component: Virtual Scroller Registered."); // คอมเมนต์: แสดง log
    } // คอมเมนต์: จบ if
  },

  // ----------------------------------------------------
  // ⭐ createVuetifyInstance()
  // สร้าง Vuetify Instance
  // ----------------------------------------------------
  createVuetifyInstance() {
    // คอมเมนต์: ฟังก์ชันสร้าง Vuetify Instance
    const vuetify = Vuetify.createVuetify({
      // คอมเมนต์: สร้าง Vuetify
      components: {
        // คอมเมนต์: รวม components ที่จำเป็น
        ...Vuetify.components, // คอมเมนต์: components หลัก
        ...Vuetify.labs, // คอมเมนต์: components Labs ทั้งหมด
      }, // คอมเมนต์: จบ components
    }); // คอมเมนต์: จบ createVuetify
    return vuetify; // คอมเมนต์: คืนค่า Instance
  },

  // ----------------------------------------------------
  // ⭐ mountApp(app)
  // จัดการการ Mount Vue App โดยรอ AppInitPromise
  // ----------------------------------------------------\
  mountApp(app) {
    // คอมเมนต์: ฟังก์ชันจัดการการ Mount App
    const vuetify = this.createVuetifyInstance(); // คอมเมนต์: สร้าง Vuetify Instance

    if (window.AppInitPromise) {
      // คอมเมนต์: ถ้ามี Promise จาก boot.js
      window.AppInitPromise.then(() => {
        // คอมเมนต์: เมื่อโหลดข้อมูลเสร็จ
        app.use(vuetify).mount("#app"); // คอมเมนต์: Mount Vue App
        console.log("🚀 Vue Mounted after System Initialization."); // คอมเมนต์: แสดง log การ mount
      }).catch((err) => {
        // คอมเมนต์: ดักจับ error ในการโหลดข้อมูล
        console.error("❌ App Initialization Failed before Mount:", err); // คอมเมนต์: แสดง error
        app.use(vuetify).mount("#app"); // คอมเมนต์: Mount ต่อไปในกรณีที่เกิด error
      }); // คอมเมนต์: จบ Promise
    } else {
      // คอมเมนต์: กรณี AppInitPromise ไม่มี (ป้องกันการติดค้าง)
      app.use(vuetify).mount("#app"); // คอมเมนต์: Mount ทันที
      console.warn(
        "⚠️ App mounted without waiting for AppInitPromise. Check boot.js."
      ); // คอมเมนต์: แสดง log เตือน
    } // คอมเมนต์: จบ if
  },
};

// --------------------------------------------------------
// 🌍 Export ให้ไฟล์อื่นเรียกใช้
// --------------------------------------------------------
window.SystemInit = SystemInit; // คอมเมนต์: Export SystemInit
