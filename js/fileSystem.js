// fileSystem.js
// --------------------------------------------------------
// 📘 โมดูลช่วยจัดการไฟล์ (ดาวน์โหลด / เปิดไฟล์)
// --------------------------------------------------------
// หมายเหตุ:
// - ใช้เพื่อ export CSV/VCF/ZIP ออกจาก browser
// - ทำงานผ่าน Blob + <a download>
// - ไม่มี LocalStorage
// - ไม่มีการบันทึกถาวรในระบบ
// --------------------------------------------------------

const FileSystem = {
  // ----------------------------------------------------
  // 🔽 downloadBlob(content, filename, mime)
  // ฟังก์ชันดาวน์โหลดข้อมูลเป็นไฟล์
  // ----------------------------------------------------
  downloadBlob(content, filename, mime = "text/plain") {
    const blob = new Blob([content], { type: mime }); // สร้าง Blob จากข้อมูล
    const link = document.createElement("a"); // สร้างแท็ก <a> ชั่วคราว
    link.href = URL.createObjectURL(blob); // สร้าง URL ให้ Blob
    link.download = filename; // ตั้งชื่อไฟล์ดาวน์โหลด
    document.body.appendChild(link); // เพิ่มลง DOM
    link.click(); // สั่งดาวน์โหลด
    document.body.removeChild(link); // เอาลิงก์ออก
  },

  // ----------------------------------------------------
  // 📂 openFile()
  // เปิดไฟล์จากเครื่องของผู้ใช้
  // ----------------------------------------------------
  async openFile() {
    if (!window.showOpenFilePicker) {
      // ถ้า browser ไม่รองรับ
      alert("⚠️ เบราว์เซอร์นี้ไม่รองรับไฟล์ Picker");
      return "";
    }

    const [handle] = await window.showOpenFilePicker(); // ให้ผู้ใช้เลือกไฟล์
    const file = await handle.getFile(); // อ่านไฟล์
    const text = await file.text(); // แปลงเป็นข้อความ
    return text; // คืนค่าข้อความ
  },
};

// --------------------------------------------------------
// 🌍 export ออกสู่ global
// --------------------------------------------------------
window.FileSystem = FileSystem;
