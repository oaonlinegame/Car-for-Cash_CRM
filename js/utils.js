// js/utils.js
// --------------------------------------------------------
// 🛠️ UTILITIES MODULE
// --------------------------------------------------------
// โมดูลรวบรวมฟังก์ชันอรรถประโยชน์ (Helper Functions)
// ที่ถูกเรียกใช้งานร่วมกันจากหลายส่วนของระบบ (Cross-Cutting Concerns)
// ทำหน้าที่จัดการการแสดงผล, การจัดการข้อมูลเชิงโครงสร้าง,
// และระบบการค้นหาข้อมูลภายใน Memory
// --------------------------------------------------------

(function (global) {
  "use strict";

  const Utils = {
    // ========================================================================
    // 1. DATA FORMATTING (การจัดรูปแบบข้อมูลเพื่อการแสดงผล)
    // ========================================================================

    /**
     * แปลงรูปแบบวันที่จาก String หรือ Date Object ให้เป็นรูปแบบภาษาไทย
     * * @param {string|Date} dateStr - ข้อมูลวันที่ที่ต้องการแปลง
     * @returns {string} วันที่ในรูปแบบ "dd/mm/yyyy" หรือ "-" หากข้อมูลไม่ถูกต้อง
     * * การทำงาน:
     * 1. ตรวจสอบความมีอยู่ของข้อมูล (Existence Check)
     * 2. แปลงข้อมูลเข้าสู่ Date Object และตรวจสอบความถูกต้อง (Validity Check)
     * 3. คืนค่าวันที่ตาม Locale "th-TH" เพื่อแสดงผลใน UI
     */
    formatDate(dateStr) {
      if (!dateStr) return "-";
      try {
        const d = new Date(dateStr);
        // ตรวจสอบว่าค่าที่ได้เป็น NaN หรือไม่ (Invalid Date)
        if (isNaN(d.getTime())) return "-";

        return d.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch (e) {
        // กรณีเกิดข้อผิดพลาดในการแปลงข้อมูล ให้คืนค่า Default
        return "-";
      }
    },

    /**
     * แปลงข้อมูลตัวเลขให้เป็นรูปแบบเงินตรา (Currency) พร้อมทศนิยม 2 ตำแหน่ง
     * * @param {number|string} val - ค่าตัวเลขที่ต้องการแปลง
     * @returns {string} ตัวเลขในรูปแบบ "x,xxx.xx" หรือ "0.00"
     * * การทำงาน:
     * 1. ตรวจสอบค่า Null, Undefined หรือ String ว่าง
     * 2. แปลงค่าเป็น Number type เพื่อป้องกัน Runtime Error ใน Intl.NumberFormat
     * 3. ใช้ Intl.NumberFormat เพื่อจัดการ Separator ตามมาตรฐานไทย
     */
    formatMoney(val) {
      if (val === "" || val === null || val === undefined) return "0.00";

      const num = Number(val);
      if (isNaN(num)) return "0.00";

      return new Intl.NumberFormat("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    },

    // ========================================================================
    // 2. DATA MANIPULATION (การจัดการโครงสร้างข้อมูล)
    // ========================================================================

    /**
     * แบ่ง Array ขนาดใหญ่เป็น Array ย่อย (Chunks) ตามขนาดที่กำหนด
     * มักใช้สำหรับการจัดการ Pagination หรือ Grid Layout
     * * @param {Array} arr - Array ต้นทาง
     * @param {number} size - ขนาดของแต่ละ Chunk
     * @returns {Array[]} Array ที่บรรจุ Array ย่อย
     */
    chunkArray(arr, size) {
      if (!Array.isArray(arr)) return [];

      const results = [];
      for (let i = 0; i < arr.length; i += size) {
        // ตัดข้อมูลตามช่วง (Slice) และเพิ่มลงในผลลัพธ์
        results.push(arr.slice(i, i + size));
      }
      return results;
    },

    /**
     * รีเซ็ตข้อมูลในฟอร์ม (Reactive Object) ให้กลับสู่ค่าเริ่มต้นอย่างสมบูรณ์ (Deep Reset)
     * ฟังก์ชันนี้ออกแบบมาเพื่อจัดการปัญหา State ตกค้างใน Vue Reactive Object
     * * @param {Object} targetForm - Object ปลายทางที่เป็น Reactive Form
     * @param {Object} defaultData - Object ต้นแบบที่เก็บค่าเริ่มต้น (Default State)
     * @param {Object} config - การตั้งค่าเพิ่มเติมสำหรับ Field พิเศษ (เช่น Dropdown)
     * * กลไกการทำงาน (Aggressive Cleanup):
     * 1. Iteration 1: วนลูป Key ทั้งหมดที่มีอยู่ใน targetForm ปัจจุบัน
     * - หาก Key นั้นมีอยู่ใน defaultData -> รีเซ็ตค่าตาม default
     * - หาก Key นั้น "ไม่มี" ใน defaultData (Stray Key) -> ล้างค่าทิ้ง ("")
     * เพื่อป้องกันฟิลด์ขยะที่เกิดจากการผูก v-model ผิดพลาดตกค้างในระบบ
     * * 2. Iteration 2: วนลูป Key ทั้งหมดใน defaultData
     * - หาก Key ใดขาดหายไปจาก targetForm -> สร้างเพิ่มและกำหนดค่าเริ่มต้น
     * เพื่อประกันโครงสร้างข้อมูล (Schema Integrity)
     * * 3. Configuration Handling: กำหนดค่าเริ่มต้นสำหรับ Dropdown จาก Store
     * - หากมีการระบุ config mapping จะดึงค่าแรกจาก Store มาเป็น Default Selection
     */
    resetForm(targetForm, defaultData, config = {}) {
      if (!targetForm || !defaultData) return;

      // 1. ล้างค่าเดิมและกำจัด Key ส่วนเกิน (Stray Keys Cleanup)
      Object.keys(targetForm).forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(defaultData, k)) {
          // คืนค่าเริ่มต้นตาม Data Spec
          targetForm[k] = defaultData[k];
        } else {
          // กำจัดข้อมูลขยะที่ไม่อยู่ใน Spec (Sanitization)
          targetForm[k] = "";
        }
      });

      // 2. เติม Key ที่ขาดหายไป (Schema Enforcement)
      Object.keys(defaultData).forEach((k) => {
        if (!Object.prototype.hasOwnProperty.call(targetForm, k)) {
          targetForm[k] = defaultData[k];
        }
      });

      // 3. ตั้งค่าเริ่มต้นสำหรับ UI Controls พิเศษ (Smart Defaults)
      Object.keys(config).forEach((field) => {
        const storeKey = config[field];
        // ตรวจสอบว่ามีข้อมูลใน Global Store หรือไม่ ก่อนทำการ Assign
        if (global.Store && global.Store.data[storeKey]?.length > 0) {
          targetForm[field] = global.Store.data[storeKey][0];
        }
      });

      console.log("🛠️ Utils: Deep Clean executed.");
    },

    // ========================================================================
    // 3. SEARCH ENGINE (ระบบค้นหาข้อมูลภายใน)
    // ========================================================================

    /**
     * สร้าง String Index สำหรับการค้นหา (Pre-computed Index)
     * ช่วยเพิ่มประสิทธิภาพการค้นหาโดยไม่ต้องวน Loop Property ทุกตัวขณะค้นหาจริง
     * * @param {Object} item - Object ข้อมูลต้นทาง (เช่น Lead)
     * @returns {string} String ที่รวมข้อมูลสำคัญคั่นด้วย Space และเป็นตัวพิมพ์เล็ก
     */
    generateSearchIndex(item) {
      if (!item) return "";

      // ระบุฟิลด์ที่ต้องการนำมาสร้าง Index
      const parts = [
        item.name,
        item.tel,
        item.idCard,
        item.licensePlate,
        item.brand,
        item.model,
        item.color,
      ];

      // กรองค่าว่างออก, รวมเป็น String เดียว, และแปลงเป็น Lowercase
      return parts
        .filter((v) => v)
        .join(" ")
        .toLowerCase();
    },

    /**
     * ฟังก์ชันค้นหาข้อมูลอเนกประสงค์ (Unified Search)
     * รองรับการค้นหาทั้งแบบระบุ Key, แบบใช้ Index, และแบบ Full Scan
     * * @param {Array} items - ข้อมูลทั้งหมดที่ต้องการค้นหา
     * @param {string} searchTerm - คำค้นหา
     * @param {Array|null} keys - รายชื่อ Key ที่ต้องการเจาะจงค้นหา (Optional)
     * @returns {Array} ผลลัพธ์ที่ตรงกับเงื่อนไข
     */
    searchItems(items, searchTerm, keys = null) {
      // Validation: ตรวจสอบ input และกรณีไม่มีคำค้นหา ให้คืนค่าทั้งหมด
      if (!items) return [];
      if (!searchTerm) return items;

      const lowerTerm = searchTerm.toLowerCase().trim();

      return items.filter((item) => {
        // Strategy 1: ค้นหาแบบเจาะจง Key (Specific Field Search)
        // ใช้เมื่อต้องการความแม่นยำสูงในฟิลด์ที่กำหนด
        if (keys && keys.length > 0) {
          return keys.some((k) => {
            const val = item[k];
            return val && String(item[k]).toLowerCase().includes(lowerTerm);
          });
        }

        // Strategy 2: ค้นหาจาก Search Index (Optimized Search)
        // ใช้ฟิลด์ _searchIndex ที่สร้างเตรียมไว้ (ถ้ามี) เพื่อความรวดเร็ว
        if (item._searchIndex) {
          return item._searchIndex.includes(lowerTerm);
        }

        // Strategy 3: ค้นหาทุก Property (Full Object Scan)
        // กรณีไม่มี Index และไม่ระบุ Key (Cost สูงสุด แต่ครอบคลุมที่สุด)
        return Object.values(item).some(
          (val) => val && String(val).toLowerCase().includes(lowerTerm)
        );
      });
    },

    // ========================================================================
    // 4. SYSTEM INTEGRATION (การเชื่อมต่อกับระบบหลัก)
    // ========================================================================

    /**
     * อัปเดตข้อมูลลงใน Global Store
     * ทำหน้าที่เป็น Bridge ระหว่าง Logic Layer และ State Management Layer
     * * @param {string} key - ชื่อหมวดหมู่ข้อมูล (เช่น 'Lead', 'Contract')
     * @param {Array} items - รายการข้อมูลที่ต้องการอัปเดต
     * * ข้อกำหนด:
     * - ชื่อ Property ใน Store ต้องเป็นรูปแบบ lowercaseKey + 'Items' (เช่น leadItems)
     * - ข้อมูลที่ถูกเก็บจะถูก Freeze (Object.freeze) เพื่อป้องกันการแก้ไขโดยตรง (Immutability)
     */
    storeSetItems(key, items) {
      if (!global.Store) return;

      const storeKey = key.toLowerCase() + "Items";

      // ตรวจสอบว่า Store มีโครงสร้างรองรับ key นี้หรือไม่
      if (Array.isArray(global.Store.data[storeKey])) {
        global.Store.data[storeKey] = items.map((i) => Object.freeze(i));
      }
    },
  };

  // ส่งออก Utils เป็น Global Object เพื่อให้ไฟล์อื่นเรียกใช้
  global.Utils = Utils;
})(window);
