// utils.js
// --------------------------------------------------------
// 📘 ไฟล์นี้เก็บฟังก์ชันที่ใช้ซ้ำได้หลายจุดในระบบ เช่น การกรอง, การแปลงข้อมูล
// --------------------------------------------------------

// --------------------------------------------------------
// 🧩 อ็อบเจ็กต์หลัก Utils รวมทุกฟังก์ชันไว้ในนี้
// --------------------------------------------------------
const Utils = {
  /**
   * 🔍 ฟังก์ชัน filterLeads:
   * ฟังก์ชันกรองลีดแบบ Smart Search
   * สามารถกรองได้หลายคำพร้อมกัน เช่น "john active toyota"
   * และจะค้นหาจากหลายฟิลด์พร้อมกัน เช่น customerName, status, contactNo, vehicle, dateCreated
   */
  filterLeads(list, query) {
    if (!Array.isArray(list)) return []; // ถ้า list ไม่ใช่ array → คืน array ว่าง
    if (!query || query.trim() === "") return list; // ถ้าไม่มีคำค้น → คืนข้อมูลทั้งหมด

    // แปลงคำค้นให้เป็น array ของคำ (แยกด้วยช่องว่าง)
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    // ใช้ filter() เพื่อเลือกเฉพาะรายการที่มีคำค้นทุกคำอยู่ใน text รวมของ lead
    return list.filter((lead) => {
      // รวมค่าทุกฟิลด์สำคัญให้เป็นข้อความเดียว
      const text = [
        lead.customerName,
        lead.status,
        lead.contactNo,
        lead.vehicle,
        lead.dateCreated,
      ]
        .join(" ") // รวมเป็น string เดียว
        .toLowerCase(); // แปลงเป็นตัวพิมพ์เล็กเพื่อเทียบได้ง่าย

      // ต้องมีทุกคำ (terms.every)
      return terms.every((t) => text.includes(t));
    });
  },
};

// --------------------------------------------------------
// ✅ export ออกไปให้ไฟล์อื่นเรียกใช้ได้
// --------------------------------------------------------
window.Utils = Utils;
