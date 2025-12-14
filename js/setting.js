// js/setting.js
// --------------------------------------------------------
// 📘 โมดูลจัดการการตั้งค่า (Settings Logic)
// --------------------------------------------------------

const AppSetting = {
  // ----------------------------------------------------
  // ⭐ Data & Metadata
  // ----------------------------------------------------
  // รายการ Config ที่ให้เลือกแก้ไขได้
  configOptions: [
    {
      label: "รายการอาชีพ",
      key: "occupationItems",
      icon: "mdi-briefcase-account",
    },
    { label: "แหล่งที่มา", key: "sourceItems", icon: "mdi-web" },
  ],
  newItemInput: Vue.ref(""), // ตัวแปรสำหรับ input เพิ่มค่าใหม่
  draggedIndex: Vue.ref(null), // [ใหม่] Index ของรายการที่กำลังลาก

  // ----------------------------------------------------
  // ➕ addItem(key)
  // ----------------------------------------------------
  async addItem(key) {
    // คอมเมนต์: ฟังก์ชันเพิ่มรายการใหม่
    const val = this.newItemInput.value; // คอมเมนต์: ดึงค่าจาก input
    if (!val || !val.trim()) return; // คอมเมนต์: ถ้าค่าว่างให้ออก

    // คอมเมนต์: ใช้ Utils ช่วยเพิ่ม (จะเช็คซ้ำและ save ให้)
    const success = await Utils.handleConfigItemAdd(
      val,
      key,
      AppState[key],
      "ตัวเลือก"
    );

    if (success) {
      // คอมเมนต์: ถ้าเพิ่มสำเร็จ
      this.newItemInput.value = ""; // คอมเมนต์: ล้างช่องกรอก
    } else {
      // คอมเมนต์: ถ้าเพิ่มไม่สำเร็จ (ซ้ำ)
      alert("รายการนี้มีอยู่แล้ว"); // คอมเมนต์: แจ้งเตือน
    }
  },

  // ----------------------------------------------------
  // 🗑️ deleteItem(key, index)
  // ----------------------------------------------------
  async deleteItem(key, index) {
    // คอมเมนต์: ฟังก์ชันลบรายการ
    const list = AppState[key].value; // คอมเมนต์: ดึงรายการปัจจุบัน
    // คอมเมนต์: ลบออกจาก Array
    list.splice(index, 1);

    // คอมเมนต์: บันทึกลง Dexie
    await AppConfig.save(key, list);

    if (window.AppNotifications) AppNotifications.show("ลบรายการเรียบร้อย"); // คอมเมนต์: แจ้งเตือน
  },

  // ----------------------------------------------------
  // 🔄 restoreDefaults(key)
  // ----------------------------------------------------
  async restoreDefaults(key) {
    // คอมเมนต์: ฟังก์ชันคืนค่าเริ่มต้น
    if (
      !confirm(
        "ต้องการคืนค่าเริ่มต้นทั้งหมดของรายการนี้ใช่หรือไม่? ข้อมูลที่เพิ่มเองจะหายไป"
      )
    )
      return; // คอมเมนต์: ยืนยันก่อน

    const defaults = window.AppConfigDefaults
      ? window.AppConfigDefaults[key]
      : []; // คอมเมนต์: ดึงค่า Default

    // คอมเมนต์: รีเซ็ตค่าใน AppState (Deep Clone)
    AppState[key].value = JSON.parse(JSON.stringify(defaults));

    // คอมเมนต์: บันทึกลง Dexie
    await AppConfig.save(key, AppState[key].value);

    if (window.AppNotifications)
      AppNotifications.show("คืนค่าเริ่มต้นเรียบร้อย"); // คอมเมนต์: แจ้งเตือน
  },

  // ----------------------------------------------------
  // ⭐ onDragStart(event, index) [ใหม่]
  // เริ่มต้นการลาก
  // ----------------------------------------------------
  onDragStart(event, index) {
    // คอมเมนต์: ตั้งค่าเมื่อเริ่มลาก
    this.draggedIndex.value = index; // คอมเมนต์: เก็บ Index ที่กำลังลาก
    event.dataTransfer.setData("text/plain", index); // คอมเมนต์: เก็บ Index ลง DataTransfer
    event.currentTarget.classList.add("dragging"); // คอมเมนต์: เพิ่ม Class ให้ตัวที่ถูกลาก
  },

  // ----------------------------------------------------
  // ⭐ onDragEnd(event) [ใหม่]
  // สิ้นสุดการลาก
  // ----------------------------------------------------
  onDragEnd(event) {
    // คอมเมนต์: ทำความสะอาดเมื่อหยุดลาก
    this.draggedIndex.value = null; // คอมเมนต์: ล้าง Index ที่ลาก
    event.currentTarget.classList.remove("dragging"); // คอมเมนต์: ลบ Class ที่ถูกลาก
  },

  // ----------------------------------------------------
  // ⭐ onDragOver(event) [ใหม่]
  // ป้องกันการทำงาน Default เพื่อให้วางได้
  // ----------------------------------------------------
  onDragOver(event) {
    // คอมเมนต์: อนุญาตให้วาง
    event.preventDefault(); // คอมเมนต์: หยุดการทำงาน Default (สำคัญมาก)
    event.dataTransfer.dropEffect = "move"; // คอมเมนต์: ตั้ง Drop Effect
  },

  // ----------------------------------------------------
  // ⭐ onDrop(event, targetIndex, key) [ใหม่]
  // เมื่อปล่อยรายการลงบนตำแหน่งใหม่
  // ----------------------------------------------------
  async onDrop(event, targetIndex, key) {
    // คอมเมนต์: จัดการเมื่อวาง
    event.preventDefault(); // คอมเมนต์: หยุดการทำงาน Default

    const fromIndex = parseInt(event.dataTransfer.getData("text/plain")); // คอมเมนต์: ดึง Index ต้นทาง
    const toIndex = targetIndex; // คอมเมนต์: Index ปลายทาง
    const list = AppState[key].value; // คอมเมนต์: ดึงรายการปัจจุบัน

    if (fromIndex !== toIndex) {
      // คอมเมนต์: ถ้าต้นทางไม่เท่าปลายทาง
      const [movedItem] = list.splice(fromIndex, 1); // คอมเมนต์: ลบรายการต้นทาง (และเก็บไว้)
      list.splice(toIndex, 0, movedItem); // คอมเมนต์: แทรกรายการที่ตำแหน่งใหม่

      // คอมเมนต์: บันทึกการเปลี่ยนแปลงลง Dexie
      await AppConfig.save(key, list);

      if (window.AppNotifications)
        AppNotifications.show("✅ จัดลำดับรายการเรียบร้อย"); // คอมเมนต์: แจ้งเตือน
    }
  },
};

window.AppSetting = AppSetting;
