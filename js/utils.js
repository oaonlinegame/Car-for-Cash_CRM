// utils.js
// --------------------------------------------------------
// 📘 ไฟล์นี้เก็บฟังก์ชันที่ใช้ซ้ำหลายจุดภายในระบบ
// --------------------------------------------------------
// หมายเหตุสำคัญ:
// - ไม่มีการใช้ localStorage แล้ว
// - ใช้ Dexie เป็นตัวเก็บข้อมูลถาวร 100%
// - ฟังก์ชันกรองข้อมูล filterLeads() ถูกปรับให้รองรับ Lead แบบสั้น
// --------------------------------------------------------

// --------------------------------------------------------
// ⭐ อ็อบเจกต์ Utils รวมฟังก์ชันที่ใช้ซ้ำทั้งหมด
// --------------------------------------------------------
const Utils = {
  // ----------------------------------------------------
  // 🔍 filterLeads(list, query)
  // ฟังก์ชันกรองข้อมูล Lead แบบ Smart Search (โครงสร้างใหม่ B)
  // ----------------------------------------------------
  filterLeads(list, query) {
    if (!Array.isArray(list)) return [];
    if (!query || query.trim() === "") return list;

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    return list.filter((lead) => {
      const text = [
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
        .toLowerCase();

      return terms.every((t) => text.includes(t));
    });
  },

  // ⚡ NEW FUNCTION: chunkArray(array, size)
  // แบ่ง array ออกเป็นกลุ่มย่อยๆ (เช่น [1,2,3,4] → [[1,2], [3,4]])
  chunkArray(array, size) {
    if (!Array.isArray(array) || size <= 0) return []; // ตรวจสอบว่าเป็น Array และ size > 0

    const chunked = []; // Array สำหรับเก็บกลุ่มย่อย
    for (let i = 0; i < array.length; i += size) {
      // วนลูปตามขนาด size
      // slice เพื่อตัด array ออกเป็นกลุ่มตาม size ที่กำหนด
      chunked.push(array.slice(i, i + size)); // ตัด Array ย่อยและเพิ่มเข้า Array หลัก
    }
    return chunked; // คืนค่า Array ที่ถูกแบ่งเป็นกลุ่มแล้ว
  },

  // ----------------------------------------------------
  // 🔢 sortData(list, key, order)
  // ฟังก์ชันเรียงข้อมูล
  // ----------------------------------------------------
  sortData(list, key, order = "asc") {
    if (!Array.isArray(list)) return [];

    const sorted = [...list];

    sorted.sort((a, b) => {
      const A = a[key];
      const B = b[key];

      // ถ้าเป็นตัวเลข → เรียงแบบตัวเลข
      if (!isNaN(A) && !isNaN(B)) {
        return order === "asc" ? A - B : B - A;
      }

      // ถ้าเป็น string → ใช้ localeCompare
      const result = String(A).localeCompare(String(B));
      return order === "asc" ? result : -result;
    });

    return sorted; // คืนค่าที่เรียงแล้ว
  },

  // ----------------------------------------------------
  // 🗓️ formatDate(dateString)
  // แปลงวันที่ให้เป็นรูปแบบ DD/MM/YYYY
  // ----------------------------------------------------
  formatDate(dateString) {
    if (!dateString) return "-"; // ถ้าไม่มีค่า → แสดง "-"
    const date = new Date(dateString); // แปลงเป็น Date Object
    if (isNaN(date.getTime())) return "-"; // ถ้าค่าวันที่ผิด → แสดง "-"

    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();

    return `${d}/${m}/${y}`; // คืนค่าวันที่แบบไทยอ่านง่าย
  },

  // ----------------------------------------------------
  // 🧠 generateId(prefix)
  // สร้างรหัสไม่ซ้ำ เช่น ID_1731653920000_123
  // ----------------------------------------------------
  generateId(prefix = "ID") {
    const time = Date.now(); // เวลาเป็นมิลลิวินาที
    const rand = Math.floor(Math.random() * 1000); // เลขสุ่ม 0-999
    return `${prefix}_${time}_${rand}`; // คืนค่ารหัสที่ไม่ซ้ำ
  },
  // ⚡ NEW FUNCTION: addUniqueItemToRef(targetRef, newVal, notifyPrefix)
  // ฟังก์ชันกลาง: เพิ่มค่าใหม่เข้าไปใน Vue Ref (ที่เป็น Array) หากยังไม่มีอยู่
  // ----------------------------------------------------
  addUniqueItemToRef(targetRef, newVal, notifyPrefix = "รายการ") {
    //  ฟังก์ชันกลางสำหรับเพิ่มรายการที่ไม่ซ้ำเข้าใน Vue Ref (Array)
    const item = String(newVal || "").trim(); //  ทำความสะอาดค่าที่ผู้ใช้ป้อน
    if (
      !item ||
      !targetRef ||
      !targetRef.value ||
      !Array.isArray(targetRef.value)
    )
      return false; //  ถ้าค่าว่างหรือ targetRef ไม่ถูกต้องให้หยุดทำงาน

    const list = targetRef.value; //  ดึง Array ออกมา

    //  ตรวจสอบว่ารายการนี้มีอยู่ใน Array อยู่แล้วหรือไม่
    const exists = list.some(
      (existingItem) =>
        String(existingItem).toLowerCase() === item.toLowerCase()
    ); //  ตรวจสอบแบบไม่คำนึงถึงตัวพิมพ์เล็กใหญ่

    if (!exists) {
      //  ถ้ายังไม่มีในรายการ
      list.push(item); //  เพิ่มรายการใหม่เข้าไปใน Array
      if (window.AppNotifications && AppNotifications.show) {
        //  ถ้ามีระบบแจ้งเตือน
        AppNotifications.show(
          `✅ เพิ่ม ${notifyPrefix} "${item}" เข้าไปในตัวเลือกแล้ว`
        ); //  แจ้งเตือนผู้ใช้
      } //  ปิด if AppNotifications
      console.log(`✅ Utils: เพิ่ม ${notifyPrefix} ใหม่ "${item}"`); //  แสดง log
      return true; //  คืนค่า true (เพิ่มสำเร็จ)
    } else {
      //  ถ้ามีอยู่แล้ว
      console.log(`ℹ️ Utils: ${notifyPrefix} "${item}" มีอยู่ในรายการแล้ว`); //  แสดง log
      return false; //  คืนค่า false (ไม่ได้เพิ่ม)
    } //  ปิดเงื่อนไข exists
  }, //  ปิด addUniqueItemToRef
};

// --------------------------------------------------------
// 🌍 เผยแพร่ Utils ให้ไฟล์อื่นสามารถเรียกใช้ได้
// --------------------------------------------------------
window.Utils = Utils;
