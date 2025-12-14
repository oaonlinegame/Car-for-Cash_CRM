// js/setting.js
// --------------------------------------------------------
// 📘 โมดูลจัดการการตั้งค่า (Settings Logic)
// --------------------------------------------------------

const AppSetting = {
  // ----------------------------------------------------
  // ⭐ Data & Metadata
  // ----------------------------------------------------
  configOptions: [
    {
      label: "รายการอาชีพ",
      key: "occupationItems",
      icon: "mdi-briefcase-account",
    },
    { label: "แหล่งที่มา", key: "sourceItems", icon: "mdi-web" },
  ],
  newItemInput: Vue.ref(""),
  draggedIndex: Vue.ref(null),

  // ----------------------------------------------------
  // ➕ addItem(key)
  // ----------------------------------------------------
  async addItem(key) {
    const val = this.newItemInput.value;
    if (!val || !val.trim()) return;

    // Utils.handleConfigItemAdd จะจัดการ push และ save ให้
    // (push มักจะกระตุ้น UI ได้ดีกว่า แต่ถ้าอยากให้ชัวร์ที่สุดต้องแก้ Utils ด้วย แต่เบื้องต้นแค่นี้มักจะพอสำหรับ add)
    const success = await Utils.handleConfigItemAdd(
      val,
      key,
      AppState[key],
      "ตัวเลือก"
    );

    if (success) {
      this.newItemInput.value = "";
    } else {
      alert("รายการนี้มีอยู่แล้ว");
    }
  },

  // ----------------------------------------------------
  // 🗑️ deleteItem(key, index)
  // ----------------------------------------------------
  async deleteItem(key, index) {
    // [แก้ไข] สร้าง Array ใหม่ (Clone) เพื่อกระตุ้น Reactivity
    const list = [...AppState[key].value];

    // ลบออกจาก Array ใหม่
    list.splice(index, 1);

    // อัปเดตกลับไปที่ AppState (เพื่อให้ UI รู้ว่าเปลี่ยนทั้งก้อน)
    AppState[key].value = list;

    // บันทึกลง Dexie
    await AppConfig.save(key, list);

    if (window.AppNotifications) AppNotifications.show("ลบรายการเรียบร้อย");
  },

  // ----------------------------------------------------
  // 🔄 restoreDefaults(key)
  // ----------------------------------------------------
  async restoreDefaults(key) {
    if (
      !confirm(
        "ต้องการคืนค่าเริ่มต้นทั้งหมดของรายการนี้ใช่หรือไม่? ข้อมูลที่เพิ่มเองจะหายไป"
      )
    )
      return;

    const defaults = window.AppConfigDefaults
      ? window.AppConfigDefaults[key]
      : [];

    // [แก้ไข] สร้าง Array ใหม่แน่นอนจากการ parse/stringify
    const newList = JSON.parse(JSON.stringify(defaults));

    // อัปเดต AppState
    AppState[key].value = newList;

    // บันทึก
    await AppConfig.save(key, newList);

    if (window.AppNotifications)
      AppNotifications.show("คืนค่าเริ่มต้นเรียบร้อย");
  },

  // ----------------------------------------------------
  // ⭐ Drag & Drop Handlers
  // ----------------------------------------------------
  onDragStart(event, index) {
    this.draggedIndex.value = index;
    event.dataTransfer.setData("text/plain", index);
    event.currentTarget.classList.add("dragging");
  },

  onDragEnd(event) {
    this.draggedIndex.value = null;
    event.currentTarget.classList.remove("dragging");
  },

  onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  },

  // ----------------------------------------------------
  // ⭐ onDrop(event, targetIndex, key) [แก้ไขสำคัญ]
  // ----------------------------------------------------
  async onDrop(event, targetIndex, key) {
    event.preventDefault();

    const fromIndex = parseInt(event.dataTransfer.getData("text/plain"));
    const toIndex = targetIndex;

    // [แก้ไข] ดึงค่ามา Clone เป็น Array ก้อนใหม่ทันที (...)
    const list = [...AppState[key].value];

    if (fromIndex !== toIndex) {
      // สลับตำแหน่งใน Array ก้อนใหม่
      const [movedItem] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, movedItem);

      // [สำคัญ] ยัด Array ก้อนใหม่กลับเข้าไปที่ AppState
      // Vue จะเห็นว่า Reference เปลี่ยน และสั่ง Re-render หน้าจอทันที
      AppState[key].value = list;

      // บันทึกลง Dexie
      await AppConfig.save(key, list);

      if (window.AppNotifications)
        AppNotifications.show("✅ จัดลำดับรายการเรียบร้อย");
    }
  },
};

window.AppSetting = AppSetting;
