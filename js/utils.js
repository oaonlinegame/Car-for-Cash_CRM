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

  // ----------------------------------------------------
  // 🛠️ Search Optimization Helpers (เพิ่มใหม่)
  // ----------------------------------------------------

  /**
   * ✅ สร้าง Search String ก้อนเดียว (Computed Field)
   * รวมทุกฟิลด์เป็น Text ยาวๆ ตัวพิมพ์เล็ก เก็บไว้ใน Memory/DB
   */
  generateSearchIndex(lead) {
    if (!lead) return "";

    // รวมฟิลด์ที่ต้องการค้นหา (สามารถเพิ่มลดได้ที่นี่จุดเดียว)
    const searchableFields = [
      lead.firstName,
      lead.nickName,
      lead.phones,
      lead.status,
      lead.province,
      lead.postalCode,
      lead.occupation,
      lead.note,
      // รวมชื่อสัญญา (ถ้ามี)
      (lead.contracts || []).map((c) => c.contractId).join(" "),
    ];

    // รวมเป็นก้อนเดียว + แปลงเป็นตัวเล็กทันที
    return searchableFields.join(" ").toLowerCase();
  },
  /**
   * ✅ Optimized Search Logic (แก้ไขใหม่)
   * ลดความซับซ้อนจาก O(N*M*F) เหลือ O(N*M)
   * โดยการเช็คแค่ lead._searchIndex ตัวเดียว
   */
  filterLeads(list, query) {
    if (!Array.isArray(list)) return [];
    if (!query || typeof query !== "string" || !query.trim()) return list;

    // 1. เตรียมคำค้นหา (ทำแค่ครั้งเดียวต่อการกดค้นหา)
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return list;

    return list.filter((lead) => {
      // 2. ดึง Search Index ออกมา
      // ⚠️ Fallback: ถ้าข้อมูลเก่าไม่มี _searchIndex ให้สร้างสด (กันระบบพัง)
      // แต่ประสิทธิภาพสูงสุดจะเกิดเมื่อ _searchIndex ถูกสร้างมาจาก lead.js แล้ว
      const searchTarget = lead._searchIndex || this.generateSearchIndex(lead);

      // 3. เช็คว่า "ทุกคำค้นหา" ปรากฏอยู่ใน "searchTarget" หรือไม่
      // เร็วขึ้นมากเพราะไม่ต้อง .toLowerCase() หลายรอบ
      return terms.every((term) => searchTarget.includes(term));
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
