// js/utils.js
// --------------------------------------------------------
// 📘 Utilities & Helper Functions
// --------------------------------------------------------

const Utils = {
  // ----------------------------------------------------
  // 📦 Store Management
  // ----------------------------------------------------
  storeSetItems(type, list) {
    const key = `${type.toLowerCase()}Items`;
    if (Store.data[key] === undefined) {
      console.warn(`⚠️ Utils: ไม่พบ key ใน Store: ${key}`);
      return;
    }
    if (!Array.isArray(list)) list = [];

    // Freeze เพื่อ Performance แต่ต้องระวังหากต้องการแก้ค่าใน Array โดยตรง
    const optimizedList = list.map((item) => Object.freeze(item));
    Store.data[key] = optimizedList;
  },

  storeGetItems(type) {
    const key = `${type.toLowerCase()}Items`;
    return Store.data[key] || [];
  },

  // ----------------------------------------------------
  // 🛠️ General Utilities
  // ----------------------------------------------------

  /**
   * ✅ Optimized Search Logic
   * แก้ไข: ตรวจสอบทีละ Field แทนการต่อ String (String Concatenation)
   * ซึ่งช่วยลดการใช้ Memory และ CPU มหาศาลเมื่อข้อมูลเยอะ
   */
  filterLeads(list, query) {
    if (!Array.isArray(list)) return [];
    if (!query || typeof query !== "string" || query.trim() === "") return list;

    // เตรียมคำค้นหา: แยกคำ, ตัดช่องว่าง, ทำเป็นตัวเล็ก
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return list;

    return list.filter((lead) => {
      // Logic: ทุกคำค้นหา (AND) ต้องปรากฏอยู่ใน Field ใด Field หนึ่ง
      return terms.every((term) => {
        // เช็คเร็วที่สุด: เช็ค Field หลักก่อน
        if (lead.firstName && lead.firstName.toLowerCase().includes(term))
          return true;
        if (lead.phones && lead.phones.includes(term)) return true;

        // เช็ค Field รอง
        if (lead.nickName && lead.nickName.toLowerCase().includes(term))
          return true;
        if (lead.status && lead.status.toLowerCase().includes(term))
          return true;
        if (lead.province && lead.province.toLowerCase().includes(term))
          return true;

        // เช็ค Field ลึก (ถ้าจำเป็น)
        if (lead.occupation && lead.occupation.toLowerCase().includes(term))
          return true;
        if (lead.note && lead.note.toLowerCase().includes(term)) return true;

        return false; // ถ้าไม่เจอเลยในทุก Field
      });
    });
  },

  chunkArray(array, size) {
    if (!Array.isArray(array) || size <= 0) return [];
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  },

  sortData(list, key, order = "asc") {
    if (!Array.isArray(list)) return [];
    const sorted = [...list];
    sorted.sort((a, b) => {
      const A = a[key];
      const B = b[key];
      if (A === B) return 0;

      // Handle null/undefined safely
      const valA = A ?? "";
      const valB = B ?? "";

      if (!isNaN(valA) && !isNaN(valB) && valA !== "" && valB !== "") {
        return order === "asc" ? valA - valB : valB - valA;
      }
      const strResult = String(valA).localeCompare(String(valB));
      return order === "asc" ? strResult : -strResult;
    });
    return sorted;
  },

  formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  },

  generateId(prefix = "ID") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  },
};

window.Utils = Utils;
