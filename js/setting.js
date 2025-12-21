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
    { label: "ชื่อแคมเปญ", key: "campaignItems", icon: "mdi-bullhorn" },
    { label: "ยี่ห้อรถ", key: "carBrandItems", icon: "mdi-car" },
    { label: "ประเภทรถ", key: "carTypeItems", icon: "mdi-car-convertible" },
    { label: "สีรถ", key: "carColorItems", icon: "mdi-palette" },
    { label: "เชื้อเพลิง", key: "fuelItems", icon: "mdi-gas-station" },
    { label: "ระบบเกียร์", key: "gearboxItems", icon: "mdi-car-shift-pattern" },
    { label: "ไฟแนนซ์", key: "financeCompanyItems", icon: "mdi-bank" },
    {
      label: "เหตุผลปฏิเสธ",
      key: "rejectReasonItems",
      icon: "mdi-alert-circle",
    },
    { label: "สินค้าหลัก", key: "productItems", icon: "mdi-package-variant" },
    { label: "สินค้าขายพ่วง", key: "crossSellItems", icon: "mdi-basket-plus" },
    { label: "คำนำหน้าชื่อ", key: "titleItems", icon: "mdi-account-box" },
  ],
  newItemInput: Vue.ref(""),
  draggedIndex: Vue.ref(null),

  // ----------------------------------------------------
  // ⚡ handleQuickAdd(val, type) [เพิ่มใหม่]
  // รับหน้าที่ตัดสินใจว่า type ไหนคือ Config ตัวไหน (ย้าย Logic มาที่นี่)
  // ----------------------------------------------------
  // ----------------------------------------------------
  // ⚡ handleQuickAdd(val, type) [อัปเดต: รองรับทุก Dropdown]
  // ----------------------------------------------------
  async handleQuickAdd(val, type) {
    const text = String(val || "").trim();
    if (!text) return;

    let targetRef = null;
    let configKey = "";
    let label = "";

    // --- 1. หมวดข้อมูลลูกค้า & ลีด ---
    if (type === "occupation") {
      targetRef = window.AppState.occupationItems;
      configKey = "occupationItems";
      label = "อาชีพ";
    } else if (type === "source") {
      targetRef = window.AppState.sourceItems;
      configKey = "sourceItems";
      label = "แหล่งที่มา";
    } else if (type === "campaign") {
      targetRef = window.AppState.campaignItems;
      configKey = "campaignItems";
      label = "แคมเปญ";
    } else if (type === "product") {
      targetRef = window.AppState.productItems;
      configKey = "productItems";
      label = "สินค้า";
    } else if (type === "crossSell") {
      targetRef = window.AppState.crossSellItems;
      configKey = "crossSellItems";
      label = "สินค้าขายพ่วง";
    } else if (type === "title") {
      targetRef = window.AppState.titleItems;
      configKey = "titleItems";
      label = "คำนำหน้าชื่อ";
    }

    // --- 2. หมวดยานพาหนะ (Asset / Car Settings) ---
    else if (type === "carBrand") {
      targetRef = window.AppState.carBrandItems;
      configKey = "carBrandItems";
      label = "ยี่ห้อรถ";
    } else if (type === "carType") {
      targetRef = window.AppState.carTypeItems;
      configKey = "carTypeItems";
      label = "ประเภทรถ";
    } else if (type === "fuel") {
      targetRef = window.AppState.fuelItems;
      configKey = "fuelItems";
      label = "เชื้อเพลิง";
    } else if (type === "gearbox") {
      targetRef = window.AppState.gearboxItems;
      configKey = "gearboxItems";
      label = "ระบบเกียร์";
    }

    // --- 3. หมวดบันทึกผล (Call Result) ---
    else if (type === "rejectReason") {
      targetRef = window.AppState.rejectReasonItems;
      configKey = "rejectReasonItems";
      label = "เหตุผลที่ปฏิเสธ";
    }

    // ถ้าจับคู่ได้ ให้ส่งต่อให้ Utils จัดการบันทึก
    if (targetRef && configKey) {
      await window.Utils.handleConfigItemAdd(text, configKey, targetRef, label);
    }
  },

  // ----------------------------------------------------
  // ➕ addItem(key) (สำหรับหน้าตั้งค่าหลัก)
  // ----------------------------------------------------
  async addItem(key) {
    const val = this.newItemInput.value;
    if (!val || !val.trim()) return;

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
    const list = [...AppState[key].value];
    list.splice(index, 1);
    AppState[key].value = list;
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
    const newList = JSON.parse(JSON.stringify(defaults));
    AppState[key].value = newList;
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

  async onDrop(event, targetIndex, key) {
    event.preventDefault();
    const fromIndex = parseInt(event.dataTransfer.getData("text/plain"));
    const toIndex = targetIndex;
    const list = [...AppState[key].value];

    if (fromIndex !== toIndex) {
      const [movedItem] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, movedItem);
      AppState[key].value = list;
      await AppConfig.save(key, list);
      if (window.AppNotifications)
        AppNotifications.show("✅ จัดลำดับรายการเรียบร้อย");
    }
  },
};

window.AppSetting = AppSetting;
