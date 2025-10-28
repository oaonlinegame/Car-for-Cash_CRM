// lead.js
// --------------------------------------------------------
// 📘 โมดูลนี้จัดการ business logic ของลีด (Lead)
// และฟังก์ชันทั่วไปสำหรับการจัดการ Rating/Blacklist ใน Object ใดๆ
// --------------------------------------------------------

const LeadLogic = {
  /**
   * getStarColor:
   * (ฟังก์ชันเฉพาะสำหรับ Lead เก่า - เก็บไว้เพื่ออ้างอิง)
   * ใช้กำหนดสีของดาวใน v-rating บน UI
   */
  getStarColor: (lead) => {
    return LeadLogic.getGenericStarColor(lead, "isBlacklisted");
  },

  /**
   * getGenericStarColor:
   * ใช้กำหนดสีของดาวใน v-rating บน UI สำหรับ Object และ Field ใดๆ
   * กติกา:
   * - ถ้า object[isBlacklistedField] เป็น true ใช้ "black"
   * - ถ้า object[isBlacklistedField] เป็น false ใช้ "yellow"
   * @param {Object} item - อ็อบเจ็กต์ข้อมูลใดๆ
   * @param {String} isBlacklistedField - ชื่อ Field ของสถานะ Blacklist ใน Object นั้น
   * @returns {String} ค่าสีสำหรับ active-color
   */
  getGenericStarColor: (item, isBlacklistedField) => {
    // ใช้ Ternary Operator คืนค่า "black" ถ้าถูก blacklist หรือ "yellow" ถ้าไม่ถูก
    return item[isBlacklistedField] ? "black" : "yellow";
  },

  /**
   * setLeadRating:
   * (ฟังก์ชันเฉพาะสำหรับ Lead เก่า - ถูกแทนที่ด้วย setGenericRating)
   * ฟังก์ชันรวมสำหรับจัดการการคลิกทุกประเภท
   */
  setLeadRating: (lead, newRating, isBlacklist) => {
    LeadLogic.setGenericRating(
      lead,
      newRating,
      isBlacklist,
      "rating",
      "isBlacklisted"
    );
  },

  /**
   * setGenericRating:
   * ฟังก์ชันรวมทั่วไปสำหรับจัดการการคลิกทุกประเภท (ซ้าย, เปลี่ยนค่า, ขวา) ใน Object ใดๆ
   * - อัปเดต Field rating และ isBlacklisted ที่กำหนดโดยชื่อ Field
   * @param {Object} item - อ็อบเจ็กต์ข้อมูลใดๆ ที่มี Field สำหรับ rating และ Blacklist
   * @param {Number|null} newRating - คะแนนดาวใหม่ (1 ถึง 5) ที่ถูกคำนวณมาจาก UI แล้ว
   * @param {Boolean} isBlacklist - สถานะที่ต้องการให้เป็น Blacklist (true) หรือไม่ (false)
   * @param {String} ratingField - ชื่อ Field สำหรับเก็บค่า Rating ใน Object นั้น
   * @param {String} isBlacklistedField - ชื่อ Field สำหรับเก็บสถานะ Blacklist ใน Object นั้น
   */
  setGenericRating: (
    item,
    newRating,
    isBlacklist,
    ratingField,
    isBlacklistedField
  ) => {
    // ถ้า newRating เป็น null (กรณีคลิกขวาแต่ไม่โดนดาว) → หยุดทำงาน
    if (newRating === null) return;

    // อัปเดตคะแนนของ object โดยแปลงเป็นตัวเลข
    item[ratingField] = Number(newRating);
    // กำหนดสถานะ Blacklist ตามค่าที่ส่งมาจาก HTML
    item[isBlacklistedField] = isBlacklist;
  },
};

// ทำให้ LeadLogic ใช้งานได้จากทุกที่ใน window (Global Access)
window.LeadLogic = LeadLogic;
