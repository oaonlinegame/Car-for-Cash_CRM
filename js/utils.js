// js/utils.js
// --------------------------------------------------------
// 🛠️ Utilities (ฟังก์ชันเครื่องมือและตัวช่วยทั่วไป)
// --------------------------------------------------------
// รวบรวมฟังก์ชันที่เป็น Pure Function หรือ Helper
// ที่ไม่มี State ของตัวเอง และสามารถเรียกใช้ได้จากทุกโมดูล
// แบ่งกลุ่มตามลักษณะการใช้งาน: Formatting, Logic, Object Manipulation
// --------------------------------------------------------

(function (global) {
  "use strict";

  const Utils = {
    // ========================================================================
    // 1. FORMATTING HELPERS (การจัดรูปแบบข้อมูล)
    // ========================================================================

    /**
     * แปลงวันที่เป็นรูปแบบภาษาไทย (DD/MM/YYYY)
     * ใช้สำหรับแสดงผลวันที่ในตารางหรือรายงาน
     * @param {string|Date} dateStr - วันที่ที่ต้องการแปลง
     * @returns {string} วันที่ในรูปแบบ 31/01/2024 หรือ "-" หากไม่มีข้อมูล
     */
    formatDate(dateStr) {
      if (!dateStr) return "-";
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "-";
        // ใช้ toLocaleDateString เพื่อรองรับรูปแบบท้องถิ่น
        return d.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch (e) {
        return "-";
      }
    },

    /**
     * จัดรูปแบบตัวเลขเป็นสกุลเงิน (มีลูกน้ำคั่นและทศนิยม 2 ตำแหน่ง)
     * ใช้แสดงยอดเงินในสัญญาหรือราคาสินค้า
     * @param {number|string} val - ค่าเงินที่ต้องการจัดรูปแบบ
     * @returns {string} เช่น "1,000.00"
     */
    formatMoney(val) {
      if (val === "" || val === null || val === undefined) return "0.00";
      const num = Number(val);
      if (isNaN(num)) return "0.00";

      // ใช้ Intl.NumberFormat เพื่อประสิทธิภาพและความถูกต้องตามหลักสากล
      return new Intl.NumberFormat("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    },

    // ========================================================================
    // 2. SEARCH & FILTER LOGIC (ตรรกะการค้นหาและกรองข้อมูล)
    // ========================================================================

    /**
     * สร้าง String สำหรับ Index การค้นหา (Search Index)
     * นำค่าจากทุกฟิลด์สำคัญมาต่อกันเป็นข้อความเดียวเพื่อความเร็วในการค้นหา
     * @param {Object} item - อ็อบเจกต์ข้อมูล (เช่น Lead)
     * @returns {string} ข้อความยาวรวมข้อมูลสำคัญ (Case Insensitive)
     */
    generateSearchIndex(item) {
      if (!item) return "";
      // เลือกฟิลด์หลักที่ผู้ใช้มักใช้ค้นหา
      // การรวมฟิลด์เหล่านี้ไว้ล่วงหน้าช่วยลด Load เวลาพิมพ์ค้นหา (O(1) lookup-like)
      const parts = [
        item.name,
        item.tel,
        item.idCard,
        item.licensePlate,
        item.brand,
        item.model,
        item.color,
      ];
      // กรองค่าว่างออกและแปลงเป็นตัวพิมพ์เล็กทั้งหมด
      return parts
        .filter((v) => v)
        .join(" ")
        .toLowerCase();
    },

    /**
     * กรองรายการ Lead ตามคำค้นหา
     * ใช้ _searchIndex ที่สร้างไว้ล่วงหน้าเพื่อประสิทธิภาพ
     * @param {Array} list - รายการข้อมูลทั้งหมด
     * @param {string} query - คำค้นหาจากผู้ใช้
     * @returns {Array} รายการที่ตรงกับคำค้นหา
     */
    filterLeads(list, query) {
      if (!list) return [];
      if (!query) return list; // หากไม่มีคำค้นหา ให้คืนค่าทั้งหมด

      // แปลงคำค้นหาเป็นตัวพิมพ์เล็กเพื่อเปรียบเทียบแบบ Case Insensitive
      const q = query.toLowerCase().trim();

      // ใช้ Index ที่สร้างไว้แล้ว (Pre-computed Index) แทนการวนเช็คทุกฟิลด์
      return list.filter((item) => {
        return item._searchIndex && item._searchIndex.includes(q);
      });
    },

    // ========================================================================
    // 3. OBJECT & ARRAY MANIPULATION (การจัดการอ็อบเจกต์และอาร์เรย์)
    // ========================================================================

    /**
     * แบ่ง Array ออกเป็นกลุ่มย่อย (Chunks)
     * จำเป็นสำหรับการแสดงผลแบบ Grid หรือ Virtual Scroller ที่ต้องการแถวละหลายรายการ
     * @param {Array} arr - อาร์เรย์ต้นฉบับ
     * @param {number} size - ขนาดของแต่ละกลุ่ม (เช่น 2 สำหรับ 2 คอลัมน์)
     * @returns {Array[]} อาร์เรย์ซ้อนอาร์เรย์ (Matrix)
     */
    chunkArray(arr, size) {
      if (!Array.isArray(arr)) return [];
      const results = [];
      // วนลูปตัดข้อมูลทีละส่วนตามขนาดที่กำหนด
      for (let i = 0; i < arr.length; i += size) {
        results.push(arr.slice(i, i + size));
      }
      return results;
    },

    /**
     * รีเซ็ตค่าใน Reactive Form ให้เป็นค่าเริ่มต้น
     * รองรับการ Mapping ค่าเริ่มต้นแบบพิเศษ (เช่น เลือก Master Data ตัวแรก)
     * @param {Object} targetForm - อ็อบเจกต์ปลายทาง (Reactive)
     * @param {Object} defaultData - ข้อมูลต้นแบบ (Default)
     * @param {Object} [config] - การตั้งค่าเพิ่มเติม { fieldName: "storeKey" }
     */
    resetForm(targetForm, defaultData, config = {}) {
      // 1. คืนค่าพื้นฐานทั้งหมดจาก Default Data
      Object.keys(targetForm).forEach((k) => {
        if (k in defaultData) {
          targetForm[k] = defaultData[k];
        }
      });

      // 2. จัดการค่าพิเศษตาม Config (เช่น Dropdown ที่ต้องเลือกค่าแรกเสมอ)
      // ช่วยลดภาระผู้ใช้ไม่ต้องเลือกค่าเดิมซ้ำๆ
      Object.keys(config).forEach((field) => {
        const storeKey = config[field];
        // ตรวจสอบว่า Store มีข้อมูลตัวเลือกหรือไม่
        if (
          global.Store &&
          global.Store.data[storeKey] &&
          global.Store.data[storeKey].length > 0
        ) {
          // กำหนดค่าแรกของ List ให้เป็นค่าเริ่มต้น
          targetForm[field] = global.Store.data[storeKey][0];
        }
      });
    },

    // ========================================================================
    // 4. STORE HELPERS (ตัวช่วยจัดการ Store)
    // ========================================================================

    /**
     * บันทึกรายการลง Store อย่างปลอดภัย
     * ทำการ Freeze Object เพื่อลดภาระของ Vue Reactivity System (Performance Optimization)
     * เหมาะสำหรับข้อมูลขนาดใหญ่ที่ไม่ต้องการแก้ไขบ่อย (Read-heavy)
     * @param {string} key - ชื่อ Key ใน Store (เช่น 'Lead' -> leadItems)
     * @param {Array} items - ข้อมูลที่ต้องการบันทึก
     */
    storeSetItems(key, items) {
      if (!global.Store) return;

      // สร้างชื่อตัวแปรใน Store ตาม Convention (เช่น Lead -> leadItems)
      const storeKey = key.toLowerCase() + "Items";

      if (Array.isArray(global.Store.data[storeKey])) {
        // ใช้ Object.freeze เพื่อบอก Vue ว่าไม่ต้อง Track การเปลี่ยนแปลงภายใน Object นี้
        // ช่วยลด Memory Usage และเพิ่มความเร็วในการ Render List
        global.Store.data[storeKey] = items.map((i) => Object.freeze(i));
      }
    },
  };

  // ส่งออก Utils เป็น Global Object
  global.Utils = Utils;
})(window);
