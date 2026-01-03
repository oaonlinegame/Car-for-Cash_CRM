// js/car.js
// --------------------------------------------------------
// 🚗 CAR MANAGEMENT MODULE
// --------------------------------------------------------
// โมดูลจัดการข้อมูลยานพาหนะ (Car Management)
// ทำหน้าที่จัดการ State ของข้อมูลรถยนต์, การเพิ่ม/ลบ รายการ,
// และการเชื่อมโยงกับหน้าต่างตั้งค่า (Modal) เพื่อรีเซ็ตข้อมูลเมื่อปิด
// --------------------------------------------------------

const CarApp = {
  // ========================================================================
  // 1. REACTIVE STATE (สถานะข้อมูล)
  // ========================================================================

  /**
   * เก็บข้อมูลสถานะของโมดูลรถยนต์ (Reactive State)
   * - items: รายการรถยนต์ทั้งหมดที่เพิ่มเข้ามา (Local List)
   * - form: ข้อมูลฟอร์มสำหรับเพิ่ม/แก้ไขรถยนต์ (ผูกกับ UI)
   */
  data: Vue.reactive({
    items: [],
    form: {
      brand: "",
      model: "",
      color: "",
      plate: "",
      year: "",
      // หมายเหตุ: หากมีฟิลด์อื่นๆ ที่ผูกกับ v-model เพิ่มเข้ามา
      // จะถูกจัดการโดยอัตโนมัติในขั้นตอน resetForm
    },
  }),

  // ========================================================================
  // 2. INITIALIZATION (การเริ่มต้นระบบ)
  // ========================================================================

  /**
   * เริ่มต้นการทำงานและตั้งค่า Watchers
   * @param {Object} state - Global AppState เพื่อเข้าถึงสถานะ UI
   * * การทำงาน:
   * 1. ตรวจสอบสถานะการเปิด/ปิด Modal ตั้งค่ารถยนต์ (isOpenModalCarSettings)
   * 2. เมื่อ Modal ปิดลง (isOpen == false) จะสั่งรีเซ็ตฟอร์มทันที
   * เพื่อป้องกันข้อมูลค้าง (Stale Data) ในการเปิดครั้งถัดไป
   */
  init(state) {
    if (state && state.isOpenModalCarSettings) {
      Vue.watch(state.isOpenModalCarSettings, (isOpen) => {
        if (!isOpen) {
          this.resetForm();
        }
      });
    }
  },

  // ========================================================================
  // 3. DATA MANIPULATION (การจัดการข้อมูล)
  // ========================================================================

  /**
   * เพิ่มข้อมูลรถยนต์ใหม่ลงในรายการ (Add)
   * * การทำงาน:
   * 1. คัดลอกข้อมูลจากฟอร์ม (Shallow Copy) เพื่อตัดขาดจาก Reference เดิม
   * 2. เพิ่มข้อมูลใหม่ลงใน Array items
   * 3. รีเซ็ตฟอร์มเพื่อเตรียมรับข้อมูลใหม่
   * 4. แสดงแจ้งเตือนความสำเร็จ (Notification)
   */
  add() {
    // Clone object เพื่อป้องกันปัญหา Reference Mutation
    const newItem = { ...this.data.form };

    this.data.items.push(newItem);

    // ล้างค่าฟอร์ม
    this.resetForm();

    if (window.AppNotifications) {
      AppNotifications.show("🚗 เพิ่มข้อมูลรถเรียบร้อย");
    }
  },

  /**
   * ลบรายการรถยนต์ตาม Index (Remove)
   * @param {number} index - ลำดับของรายการที่ต้องการลบ
   */
  remove(index) {
    this.data.items.splice(index, 1);
  },

  // ========================================================================
  // 4. FORM MANAGEMENT (การจัดการฟอร์ม)
  // ========================================================================

  /**
   * รีเซ็ตฟอร์มรถยนต์กลับสู่ค่าเริ่มต้น
   * ใช้ Utils.resetForm เพื่อความสะอาดของข้อมูล (Deep Clean)
   */
  resetForm() {
    // กำหนดโครงสร้างข้อมูลเริ่มต้น (Schema Definition)
    const defaultCar = {
      brand: "",
      model: "",
      color: "",
      plate: "",
      year: "",
    };

    // ใช้ Utility กลางในการรีเซ็ตค่า เพื่อให้จัดการฟิลด์ส่วนเกินได้ถูกต้อง
    if (window.Utils && window.Utils.resetForm) {
      window.Utils.resetForm(this.data.form, defaultCar);
    } else {
      // Fallback Strategy: กรณีไม่พบ Utils ให้ล้างค่าด้วยการวนลูปปกติ
      Object.keys(this.data.form).forEach((k) => (this.data.form[k] = ""));
    }
  },
};

// ส่งออกเป็น Global Object
window.CarApp = CarApp;
