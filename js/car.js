// js/car.js
// --------------------------------------------------------
// 📘 โมดูลจัดการข้อมูลรถยนต์ (CarApp)
// --------------------------------------------------------

const CarApp = {
  data: Vue.reactive({
    items: [],
    form: {
      brand: "",
      model: "",
      color: "",
      plate: "",
      year: "",
    },
  }),

  // 💰 selectPrice
  selectPrice(price) {
    console.log("💰 CarApp: เลือกราคา", price);
    // อาจจะมีการบันทึกลงตัวแปร form หรือคำนวณต่อที่นี่
    // แต่ "ห้าม" สั่งปิดหน้าจอที่นี่
  },

  add() {
    const newItem = { ...this.data.form };
    this.data.items.push(newItem);
    Object.keys(this.data.form).forEach((key) => {
      this.data.form[key] = "";
    });
    if (window.AppNotifications)
      AppNotifications.show("🚗 เพิ่มข้อมูลรถเรียบร้อย");
  },

  remove(index) {
    this.data.items.splice(index, 1);
    if (window.AppNotifications) AppNotifications.show("🗑️ ลบข้อมูลรถสำเร็จ");
  },
};

window.CarApp = CarApp;
