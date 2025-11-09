// utils.js
// --------------------------------------------------------
// 📘 ไฟล์นี้เก็บฟังก์ชันที่ใช้ซ้ำได้หลายจุดในระบบ เช่น การกรอง, เรียงลำดับ, จัดรูปแบบข้อมูล และการจัดการ localStorage
// --------------------------------------------------------

// --------------------------------------------------------
// 🧩 อ็อบเจ็กต์หลัก Utils รวมทุกฟังก์ชันไว้ในนี้
// --------------------------------------------------------
const Utils = {
  // ----------------------------------------------------
  // 🔍 ฟังก์ชัน filterLeads:
  // ฟังก์ชันกรองลีดแบบ Smart Search
  // สามารถกรองได้หลายคำพร้อมกัน เช่น "john active toyota"
  // และจะค้นหาจากหลายฟิลด์พร้อมกัน เช่น customerName, status, contactNo, vehicle, dateCreated
  // ----------------------------------------------------
  filterLeads(list, query) {
    if (!Array.isArray(list)) return []; // ถ้า list ไม่ใช่ array → คืน array ว่าง
    if (!query || query.trim() === "") return list; // ถ้าไม่มีคำค้น → คืนข้อมูลทั้งหมด

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean); // แปลงข้อความเป็น array คำค้น

    return list.filter((lead) => {
      const text = [
        lead.customerName,
        lead.status,
        lead.contactNo,
        lead.vehicle,
        lead.dateCreated,
      ] // รวมทุกฟิลด์ที่สำคัญ
        .join(" ") // รวมเป็นสตริงเดียว
        .toLowerCase(); // แปลงเป็นตัวพิมพ์เล็กเพื่อเปรียบเทียบ

      return terms.every((t) => text.includes(t)); // ต้องมีทุกคำในข้อความ
    });
  },
  // ----------------------------------------------------
  // 🧮 ฟังก์ชัน getFilteredLeads:
  // ใช้กรองข้อมูลลีดแบบสมาร์ต (เชื่อมกับ Store และ AppState)
  // ----------------------------------------------------
  getFilteredLeads() {
    const query = AppState.searchQuery?.value || ""; // ดึงคำค้นจาก state
    return Utils.filterLeads(Store.data.leadItems, query); // ใช้ฟังก์ชันกรองภายใน
  },

  // ----------------------------------------------------
  // 🧮 ฟังก์ชัน sortData:
  // ฟังก์ชันเรียงข้อมูลตาม key และลำดับที่กำหนด (asc หรือ desc)
  // ใช้ซ้ำได้ทุกที่
  // ----------------------------------------------------
  sortData(list, key, order = "asc") {
    if (!Array.isArray(list)) return []; // ถ้าไม่ใช่ array → คืน array ว่าง

    const sorted = [...list]; // คัดลอกข้อมูลออกมา (กันเปลี่ยนของเดิม)

    sorted.sort((a, b) => {
      const valA = a[key]; // ค่าของ A
      const valB = b[key]; // ค่าของ B

      const strA = typeof valA === "string" ? valA.toLowerCase() : valA; // ถ้าเป็นข้อความให้แปลงเป็นตัวเล็ก
      const strB = typeof valB === "string" ? valB.toLowerCase() : valB; // เช่นเดียวกัน

      if (typeof strA === "number" && typeof strB === "number") {
        return order === "asc" ? strA - strB : strB - strA; // ถ้าเป็นตัวเลข เรียงตามลำดับที่กำหนด
      }

      const result = String(strA).localeCompare(String(strB)); // ถ้าเป็นข้อความใช้ localeCompare
      return order === "asc" ? result : -result; // สลับทิศทางถ้า desc
    });

    return sorted; // คืนค่าข้อมูลที่เรียงแล้ว
  },

  // ----------------------------------------------------
  // 🗓️ ฟังก์ชัน formatDate:
  // ฟังก์ชันจัดรูปแบบวันที่ให้อ่านง่าย
  // เช่น แปลงจาก "2025-11-05T10:00:00Z" → "05/11/2025 17:00"
  // ----------------------------------------------------
  formatDate(dateString) {
    if (!dateString) return "-"; // ถ้าไม่มีค่า → คืน "-"
    const date = new Date(dateString); // แปลง string เป็น Date object
    if (isNaN(date.getTime())) return "-"; // ถ้าไม่ใช่วันที่จริง → คืน "-"

    const y = date.getFullYear(); // ปี
    const m = String(date.getMonth() + 1).padStart(2, "0"); // เดือน (0-based)
    const d = String(date.getDate()).padStart(2, "0"); // วัน
    const h = String(date.getHours()).padStart(2, "0"); // ชั่วโมง
    const min = String(date.getMinutes()).padStart(2, "0"); // นาที

    return `${d}/${m}/${y} ${h}:${min}`; // คืนรูปแบบวันที่แบบไทยอ่านง่าย
  },

  // ----------------------------------------------------
  // 🧠 ฟังก์ชัน generateId:
  // ใช้สร้างรหัสไม่ซ้ำ เช่น ID_1730792045123_451
  // ----------------------------------------------------
  generateId(prefix = "ID") {
    const time = Date.now(); // เวลา ณ ปัจจุบัน (ms)
    const rand = Math.floor(Math.random() * 1000); // ตัวเลขสุ่ม 0–999
    return `${prefix}_${time}_${rand}`; // รวมเป็น ID สุดท้าย
  },

  // ----------------------------------------------------
  // 💾 ฟังก์ชัน saveToStorage:
  // ใช้บันทึกข้อมูลลง localStorage แบบปลอดภัย
  // ----------------------------------------------------
  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value)); // แปลงข้อมูลเป็น JSON แล้วเก็บ
      console.log(`✅ บันทึกข้อมูล "${key}" เรียบร้อยแล้ว`);
    } catch (err) {
      console.error("❌ บันทึกข้อมูลลง localStorage ไม่สำเร็จ:", err); // แสดง error ถ้าเกิดปัญหา
    }
  },

  // ----------------------------------------------------
  // 📂 ฟังก์ชัน loadFromStorage:
  // ใช้โหลดข้อมูลจาก localStorage (ถ้าไม่มีจะคืนค่า fallback)
  // ----------------------------------------------------
  loadFromStorage(key, fallback = null) {
    try {
      const saved = localStorage.getItem(key); // ดึงข้อมูลจาก localStorage
      if (!saved) return fallback; // ถ้าไม่มี → คืน fallback
      return JSON.parse(saved); // แปลง string → object แล้วคืนค่า
    } catch (err) {
      console.error("❌ โหลดข้อมูลจาก localStorage ไม่สำเร็จ:", err); // แสดง error ถ้าโหลดไม่ได้
      return fallback; // คืนค่า fallback แทน
    }
  },
};

// --------------------------------------------------------
// ✅ export ออกไปให้ไฟล์อื่นเรียกใช้ได้
// --------------------------------------------------------
window.Utils = Utils; // เผยแพร่ Utils ให้เรียกได้ทั่วระบบ
