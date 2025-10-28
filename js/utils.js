// utils.js
// --------------------------------------------------------
// 📘 ไฟล์นี้รวบรวม "ฟังก์ชันช่วยเหลือ" (Utility functions)
// เช่น ฟังก์ชันค้นหาคำ (fuzzy match), ฟังก์ชันแยกคำ,
// และฟังก์ชันกรองข้อมูลต่าง ๆ ให้ไฟล์อื่นเรียกใช้ได้สะดวก
// --------------------------------------------------------

const Utils = {
  /**
   * 🔍 ฟังก์ชันตรวจสอบว่า "ข้อความ text" ตรงกับ "คำค้น query" หรือไม่
   * แบบ fuzzy คือ "ตัวอักษรเรียงตามลำดับ" ก็ถือว่าตรง เช่น:
   *  - "jn" จะตรงกับ "John"
   *  - "smc" จะตรงกับ "สมชาย"
   */
  isFuzzyMatch: (text, query) => {
    // ถ้าไม่มี text หรือ query ให้ตอบ false ทันที
    if (!text || !query) return false;

    // แปลงข้อความทั้งหมดเป็นตัวพิมพ์เล็ก เพื่อไม่ให้สนใจตัวพิมพ์ใหญ่/เล็ก
    const normalizedText = String(text).toLowerCase();
    const normalizedQuery = query.toLowerCase();

    // ถ้าเจอคำค้นอยู่ในข้อความแบบตรง ๆ เช่น includes() → ผ่านเลย
    if (normalizedText.includes(normalizedQuery)) return true;

    // 🔠 ถ้าไม่เจอแบบตรง ๆ → ตรวจแบบ fuzzy
    // ตัวอักษรของ query ต้องเรียงอยู่ใน text แม้จะไม่ติดกันก็ได้
    let index = -1; // เก็บตำแหน่งตัวอักษรล่าสุดที่เจอใน text
    for (let i = 0; i < normalizedQuery.length; i++) {
      const char = normalizedQuery[i]; // ตัวอักษรปัจจุบันที่กำลังตรวจ
      index = normalizedText.indexOf(char, index + 1); // หาในข้อความ
      if (index === -1) return false; // ถ้าไม่เจอ → ไม่ตรงแน่
    }
    return true; // ถ้าเจอครบทุกตัว → ตรง
  },

  /**
   * 🧠 ฟังก์ชันแยกคำค้นออกเป็น "คำ ๆ" เพื่อเอาไปกรองข้อมูลทีละคำ
   * เช่น ผู้ใช้พิมพ์ "toyota สมชาย 2024"
   * จะถูกแยกเป็น ["toyota", "สมชาย", "2024"]
   */
  splitKeywords: (query) => {
    if (!query) return []; // ถ้าไม่มีคำค้นเลย ให้ส่งกลับ array ว่าง
    return query
      .toLowerCase() // แปลงเป็นพิมพ์เล็ก
      .split(/\s+/) // แยกด้วยช่องว่าง (space)
      .map((kw) => kw.trim()) // ตัดช่องว่างหน้าหลังออก
      .filter(Boolean); // เอาเฉพาะคำที่ไม่ว่างเปล่า
  },

  /**
   * 🔍 ฟังก์ชันกรองรายการ leads ทั้งหมดตามคำค้นที่พิมพ์
   * ใช้ fuzzy match เปรียบเทียบในแต่ละช่อง เช่นชื่อ, เบอร์โทร, รถ, สถานะ ฯลฯ
   * @param {Array} items - รายการ leads ทั้งหมด
   * @param {String} query - คำค้นจากช่อง search
   * @returns {Array} รายการ leads ที่ตรงกับคำค้น
   */
  filterLeads: (items, query) => {
    // ถ้าไม่มีคำค้น → แสดงทั้งหมดเลย
    if (!query) {
      console.log("🔍 Utils.filterLeads: No query, returning all items.");
      return items;
    }

    // แยกคำค้นออกเป็น keyword ย่อย ๆ
    const keywords = Utils.splitKeywords(query);

    // ใช้ filter() วนเช็คทุก lead ทีละตัว
    const filtered = items.filter((item) => {
      // ต้องตรงกับ "ทุกคำค้น" (ใช้ every)
      return keywords.every((kw) => {
        return (
          Utils.isFuzzyMatch(item.customerName, kw) || // ชื่อลูกค้า
          Utils.isFuzzyMatch(item.contactNo, kw) || // เบอร์โทร
          Utils.isFuzzyMatch(item.vehicle, kw) || // ยี่ห้อรถ
          Utils.isFuzzyMatch(item.status, kw) || // สถานะ
          Utils.isFuzzyMatch(item.address, kw) || // ที่อยู่
          Utils.isFuzzyMatch(item.dateCreated, kw) // วันที่สร้างข้อมูล
        );
      });
    });

    console.log(
      `🔍 Utils.filterLeads: Found ${filtered.length} items for query "${query}"`
    );

    // ส่งผลลัพธ์กลับไป
    return filtered;
  },
};

// --------------------------------------------------------
// ✅ ประกาศให้ Utils ใช้งานได้จากทุกไฟล์ (เป็น global)
// เช่น ในไฟล์อื่นสามารถเรียก Utils.filterLeads() ได้เลย
// --------------------------------------------------------
window.Utils = Utils;
