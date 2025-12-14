// js/utils.js
// --------------------------------------------------------
// 📘 ไฟล์นี้เก็บฟังก์ชันที่ใช้ซ้ำหลายจุดภายในระบบ (Cleaned Version)
// --------------------------------------------------------

const Utils = {
  // ----------------------------------------------------
  // 🔍 filterLeads(list, query)
  // ฟังก์ชันกรองข้อมูล Lead แบบ Smart Search (ใช้ใน gui.js)
  // ----------------------------------------------------
  filterLeads(list, query) {
    // คอมเมนต์: ฟังก์ชันกรอง Lead
    if (!Array.isArray(list)) return []; // คอมเมนต์: ตรวจสอบ Array
    if (!query || query.trim() === "") return list; // คอมเมนต์: ถ้าไม่มี Query คืนทั้งหมด

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean); // คอมเมนต์: แยกคำค้นหา

    return list.filter((lead) => {
      // คอมเมนต์: กรองรายการ
      // รวมข้อมูลทุกฟิลด์เป็นก้อนข้อความเดียวเพื่อค้นหา
      const text = [
        // คอมเมนต์: รวมฟิลด์ Lead
        lead.firstName,
        lead.nickName,
        lead.phones,
        lead.status,
        lead.occupation,
        lead.address,
        lead.province,
        lead.postalCode,
        lead.prospectStage,
        lead.rating,
        lead.note,
        lead.createDate,
      ]
        .join(" ")
        .toLowerCase(); // คอมเมนต์: รวมเป็น String และแปลงเป็น Lowercase

      // ต้องเจอคำค้นหาครบทุกคำ (AND Logic)
      return terms.every((t) => text.includes(t)); // คอมเมนต์: ตรวจสอบว่ามีทุกคำ
    });
  },

  // ----------------------------------------------------
  // ⚡ chunkArray(array, size)
  // แบ่ง array ออกเป็นกลุ่มย่อย (ใช้สำหรับ Grid View ใน gui.js)
  // ----------------------------------------------------
  chunkArray(array, size) {
    // คอมเมนต์: ฟังก์ชันแบ่ง Array
    if (!Array.isArray(array) || size <= 0) return []; // คอมเมนต์: ตรวจสอบ Input
    const chunked = []; // คอมเมนต์: Array ผลลัพธ์
    for (let i = 0; i < array.length; i += size) {
      // คอมเมนต์: วนลูปและแบ่ง
      chunked.push(array.slice(i, i + size));
    }
    return chunked; // คอมเมนต์: คืนผลลัพธ์
  },

  // ----------------------------------------------------
  // ➕ addUniqueItemToRef(targetRef, newVal, notifyPrefix)
  // เพิ่มค่าใหม่เข้า Vue Ref Array โดยตรวจสอบค่าซ้ำก่อน (ใช้ใน handleConfigItemAdd)
  // ----------------------------------------------------
  addUniqueItemToRef(targetRef, newVal, notifyPrefix = "รายการ") {
    // คอมเมนต์: ฟังก์ชันเพิ่มรายการไม่ซ้ำ
    const item = String(newVal || "").trim(); // คอมเมนต์: จัดการ Input
    if (!item || !targetRef || !Array.isArray(targetRef.value)) return false; // คอมเมนต์: ตรวจสอบความพร้อม

    const list = targetRef.value; // คอมเมนต์: ค่า Array ปัจจุบัน
    // เช็คว่ามีอยู่แล้วหรือไม่ (Case Insensitive)
    const exists = list.some(
      // คอมเมนต์: ตรวจสอบค่าซ้ำ
      (existingItem) =>
        String(existingItem).toLowerCase() === item.toLowerCase()
    );

    if (!exists) {
      // คอมเมนต์: ถ้าไม่ซ้ำ
      list.push(item); // คอมเมนต์: เพิ่มรายการ
      if (window.AppNotifications && AppNotifications.show) {
        // คอมเมนต์: แจ้งเตือน
        AppNotifications.show(
          `✅ เพิ่ม ${notifyPrefix} "${item}" เข้าไปในตัวเลือกแล้ว`
        );
      }
      console.log(`✅ Utils: เพิ่ม ${notifyPrefix} ใหม่ "${item}"`); // คอมเมนต์: Log
      return true; // คอมเมนต์: คืนค่า True
    }
    return false; // คอมเมนต์: คืนค่า False
  },

  // ----------------------------------------------------------
  // ⭐ handleConfigItemAdd
  // ฟังก์ชันกลางสำหรับเพิ่ม Config Item ลงทั้ง AppState และ Dexie (ใช้ใน lead.js)
  // ----------------------------------------------------------
  async handleConfigItemAdd(newVal, configKey, stateRef, notifyPrefix) {
    // คอมเมนต์: ฟังก์ชันจัดการ Config Item
    // 1. เพิ่มลง AppState (UI)
    const isAdded = Utils.addUniqueItemToRef(stateRef, newVal, notifyPrefix); // คอมเมนต์: เพิ่มเข้า AppState

    // 2. ถ้าเพิ่มสำเร็จ ให้บันทึกลง Dexie (DB)
    if (isAdded && window.AppConfig && window.AppConfig.save) {
      // คอมเมนต์: ถ้าเพิ่มสำเร็จและ AppConfig พร้อม
      try {
        await AppConfig.save(configKey, stateRef.value); // คอมเมนต์: บันทึกเข้า Dexie
      } catch (error) {
        console.error(
          `❌ Utils.handleConfigItemAdd: บันทึก Config Key "${configKey}" ล้มเหลว`,
          error
        ); // คอมเมนต์: แสดง Error
      }
    }
    return isAdded; // คอมเมนต์: คืนค่าผลลัพธ์
  },
};

window.Utils = Utils; // คอมเมนต์: Export Utils
