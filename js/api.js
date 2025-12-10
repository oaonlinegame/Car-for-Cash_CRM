// api.js
// --------------------------------------------------------
// 📘 โมดูล API สำหรับ Import / Export ข้อมูล
// --------------------------------------------------------
// หมายเหตุ:
// - ใช้ Dexie (AppDexie) เป็นที่เก็บข้อมูลถาวร
// - Store = UI layer, ใช้แสดงผลเท่านั้น
// - ไม่มี LocalStorage แล้ว
// - ฟังก์ชัน Export ใช้ข้อมูลจาก Store.data.*
// - ฟังก์ชัน Import จะบันทึกข้อมูลลง Dexie แล้ว reload UI
// --------------------------------------------------------

const AppApi = {
  // ----------------------------------------------------
  // ⭐ createCsvString(data)
  // แปลง Array → CSV string
  // ----------------------------------------------------
  createCsvString(data) {
    // คอมเมนต์: ฟังก์ชันแปลง Array → CSV string
    if (!Array.isArray(data) || data.length === 0) return ""; // คอมเมนต์: ถ้าไม่มีข้อมูลคืนสตริงว่าง

    const headers = Object.keys(data[0]); // คอมเมนต์: เอาชื่อฟิลด์เป็น header
    const rows = [headers.join(",")]; // คอมเมนต์: เริ่มต้นด้วย header

    data.forEach((item) => {
      // คอมเมนต์: วนลูปแต่ละรายการ
      const line = headers.map((h) => JSON.stringify(item[h] ?? "")).join(","); // คอมเมนต์: แปลงค่าเป็น JSON string แล้วรวมเป็นบรรทัด
      rows.push(line); // คอมเมนต์: เพิ่มบรรทัดข้อมูล
    }); // คอมเมนต์: จบลูป

    return rows.join("\n"); // คอมเมนต์: รวมเป็น CSV เดียว
  }, // คอมเมนต์: ปิด createCsvString

  // ----------------------------------------------------
  // ⭐ parseCsvFile(file)
  // อ่านไฟล์ CSV → Array Object
  // ----------------------------------------------------
  async parseCsvFile(file) {
    // คอมเมนต์: ฟังก์ชันอ่านไฟล์ CSV
    const text = await file.text(); // คอมเมนต์: อ่านทั้งหมดเป็นข้อความ
    const lines = text.split(/\r?\n/).filter(Boolean); // คอมเมนต์: แยกบรรทัดและกรองบรรทัดว่าง

    if (lines.length < 2) return []; // คอมเมนต์: ถ้าไม่มีข้อมูลเลย

    const headers = lines[0].split(","); // คอมเมนต์: อ่าน header

    return lines.slice(1).map((line) => {
      // คอมเมนต์: วนลูปบรรทัดข้อมูล
      const cols = line.split(","); // คอมเมนต์: แยกคอลัมน์
      const obj = {}; // คอมเมนต์: อ็อบเจ็กต์ผลลัพธ์
      headers.forEach((h, i) => {
        // คอมเมนต์: วนลูปหัวคอลัมน์
        obj[h] = cols[i]?.replace(/^"|"$/g, "") ?? ""; // คอมเมนต์: ลบ "" และใส่ค่าลงในอ็อบเจ็กต์
      }); // คอมเมนต์: จบลูปหัวคอลัมน์
      return obj; // คอมเมนต์: คืนอ็อบเจ็กต์
    }); // คอมเมนต์: จบลูปบรรทัดข้อมูล
  }, // คอมเมนต์: ปิด parseCsvFile

  // ----------------------------------------------------
  // ⭐ importLeadCsv(file)
  // นำเข้า Lead CSV แบบ 6 ฟิลด์ → บันทึกลง Dexie
  // ----------------------------------------------------
  async importLeadCsv(file) {
    // คอมเมนต์: ฟังก์ชันนำเข้า Lead CSV
    const rows = await this.parseCsvFile(file); // คอมเมนต์: แปลง CSV → Array

    if (!rows.length) {
      // คอมเมนต์: ถ้าไม่มีข้อมูล
      alert("⚠️ ไฟล์ Lead ไม่มีข้อมูล"); // คอมเมนต์: แจ้งเตือนผู้ใช้
      return; // คอมเมนต์: หยุดทำงาน
    } // คอมเมนต์: จบ if

    // ล้าง Dexie ก่อน import ใหม่ (ถ้าต้องการให้รวม ให้ลบส่วนนี้)
    await AppDexie.clearLeads(); // คอมเมนต์: ล้างข้อมูล Lead เดิมใน Dexie

    // เพิ่มทีละแถวลง Dexie
    for (const row of rows) {
      // คอมเมนต์: วนลูปเพิ่มข้อมูลทีละแถว
      await AppDexie.addLead({
        // คอมเมนต์: เพิ่ม Lead เข้า Dexie
        customerName: row.customerName || "", // คอมเมนต์: ชื่อลูกค้า
        contactNo: row.contactNo || "", // คอมเมนต์: เบอร์ติดต่อ
        status: row.status || "", // คอมเมนต์: สถานะ
        vehicle: row.vehicle || "", // คอมเมนต์: ข้อมูลรถ
        dateCreated: row.dateCreated || "", // คอมเมนต์: วันที่สร้าง
      }); // คอมเมนต์: ปิด addLead
    } // คอมเมนต์: จบลูป

    await AppDexie.loadAllToStore(); // คอมเมนต์: sync UI

    alert(`✅ นำเข้า Lead สำเร็จ (${rows.length} รายการ)`); // คอมเมนต์: แจ้งเตือนความสำเร็จ
  }, // คอมเมนต์: ปิด importLeadCsv

  // ----------------------------------------------------
  // ⭐ handleImportLead()
  // เปิด Dialog ให้เลือกไฟล์ CSV
  // ----------------------------------------------------
  handleImportLead() {
    // คอมเมนต์: ฟังก์ชันจัดการการนำเข้า Lead
    const input = document.createElement("input"); // คอมเมนต์: สร้าง input file
    input.type = "file"; // คอมเมนต์: กำหนดชนิดเป็นไฟล์
    input.accept = ".csv"; // คอมเมนต์: รับเฉพาะไฟล์ CSV

    input.onchange = (e) => {
      // คอมเมนต์: เมื่อมีการเลือกไฟล์
      const file = e.target.files[0]; // คอมเมนต์: ดึงไฟล์ที่เลือกมา
      if (file) this.importLeadCsv(file); // คอมเมนต์: เรียก import
    }; // คอมเมนต์: ปิด onchange

    input.click(); // คอมเมนต์: เปิด dialog
  }, // คอมเมนต์: ปิด handleImportLead

  // ----------------------------------------------------
  // ⭐ exportLeadCsv()
  // ส่งออก Lead (CSV) จาก Store.data.leadItems
  // ----------------------------------------------------
  exportLeadCsv() {
    // คอมเมนต์: ฟังก์ชันส่งออก Lead เป็น CSV
    const list = Store.data.leadItems; // คอมเมนต์: ข้อมูล UI
    if (!list.length) {
      // คอมเมนต์: ถ้าไม่มีข้อมูล
      alert("⚠️ ไม่มีข้อมูล Lead ให้ส่งออก"); // คอมเมนต์: แจ้งเตือน
      return; // คอมเมนต์: หยุดทำงาน
    } // คอมเมนต์: จบ if

    const csv = this.createCsvString(list); // คอมเมนต์: แปลง CSV
    const filename = `lead_${new Date().toISOString().slice(0, 10)}.csv`; // คอมเมนต์: สร้างชื่อไฟล์

    FileSystem.downloadBlob(csv, filename, "text/csv"); // คอมเมนต์: ดาวน์โหลดไฟล์

    alert("✅ ส่งออก Lead CSV สำเร็จ"); // คอมเมนต์: แจ้งเตือน
  }, // คอมเมนต์: ปิด exportLeadCsv

  // ----------------------------------------------------
  // ⭐ exportVcf()
  // ส่งออกเบอร์โทรเป็นไฟล์ .vcf (ใช้ในมือถือ)
  // ----------------------------------------------------
  sanitizePhone(raw) {
    // คอมเมนต์: ฟังก์ชันทำความสะอาดเบอร์โทร
    return String(raw || "").replace(/[^\d+]/g, ""); // คอมเมนต์: ลบอักขระที่ไม่ใช่ตัวเลข
  }, // คอมเมนต์: ปิด sanitizePhone

  splitName(fullname) {
    // คอมเมนต์: ฟังก์ชันแยกชื่อนามสกุล
    const parts = fullname.trim().split(/\s+/); // คอมเมนต์: แยกด้วยช่องว่าง
    return {
      // คอมเมนต์: คืนค่าชื่อต้นและนามสกุล
      first: parts[0] || "", // คอมเมนต์: ชื่อต้น
      last: parts.slice(1).join(" "), // คอมเมนต์: นามสกุล
    }; // คอมเมนต์: ปิด return
  }, // คอมเมนต์: ปิด splitName

  createVcfEntry(item) {
    // คอมเมนต์: ฟังก์ชันสร้างรายการ VCF
    const { first, last } = this.splitName(item.customerName); // คอมเมนต์: แยกชื่อ
    const tel = this.sanitizePhone(item.contactNo); // คอมเมนต์: ทำความสะอาดเบอร์โทร

    return [
      // คอมเมนต์: คืนค่า VCF string
      "BEGIN:VCARD", // คอมเมนต์: เริ่มต้น VCard
      "VERSION:3.0", // คอมเมนต์: เวอร์ชั่น
      `N:${last};${first};;;`, // คอมเมนต์: นามสกุลและชื่อ
      `FN:${first} ${last}`.trim(), // คอมเมนต์: ชื่อเต็ม
      tel ? `TEL;TYPE=CELL:${tel}` : "", // คอมเมนต์: เบอร์โทร
      `UID:${item.id}`, // คอมเมนต์: UID
      "END:VCARD", // คอมเมนต์: จบ VCard
    ].join("\r\n"); // คอมเมนต์: รวมเป็น String
  }, // คอมเมนต์: ปิด createVcfEntry

  exportVcf() {
    // คอมเมนต์: ฟังก์ชันส่งออก VCF
    const list = Store.data.leadItems; // คอมเมนต์: ข้อมูล Lead ทั้งหมด

    if (!list.length) {
      // คอมเมนต์: ถ้าไม่มีข้อมูล
      alert("⚠️ ไม่มีข้อมูล Lead สำหรับ VCF"); // คอมเมนต์: แจ้งเตือน
      return; // คอมเมนต์: หยุดทำงาน
    } // คอมเมนต์: จบ if

    const vcf = list.map((l) => this.createVcfEntry(l)).join("\n"); // คอมเมนต์: สร้าง VCF ทั้งหมด
    const filename = `lead_${new Date().toISOString().slice(0, 10)}.vcf`; // คอมเมนต์: สร้างชื่อไฟล์

    FileSystem.downloadBlob(vcf, filename, "text/vcard"); // คอมเมนต์: ดาวน์โหลดไฟล์

    alert("📱 ส่งออก VCF สำเร็จ"); // คอมเมนต์: แจ้งเตือน
  }, // คอมเมนต์: ปิด exportVcf

  // ----------------------------------------------------
  // ⭐ exportZipAll()
  // ส่งออก ZIP ที่มีไฟล์ CSV ของโมดูลต่าง ๆ
  // ----------------------------------------------------
  async exportZipAll() {
    // คอมเมนต์: ฟังก์ชันส่งออก ZIP
    if (typeof JSZip === "undefined") {
      // คอมเมนต์: ถ้า JSZip ยังไม่โหลด
      alert("❌ ต้องโหลด JSZip ก่อน"); // คอมเมนต์: แจ้งเตือน
      return; // คอมเมนต์: หยุดทำงาน
    } // คอมเมนต์: จบ if

    const zip = new JSZip(); // คอมเมนต์: สร้างอ็อบเจ็กต์ ZIP

    // ✔ เพิ่มเฉพาะข้อมูล Lead (โมดูลอื่นยังไม่เปิดใช้งาน)
    const leadCsv = this.createCsvString(Store.data.leadItems); // คอมเมนต์: สร้าง CSV ของ Lead
    zip.file("lead.csv", leadCsv); // คอมเมนต์: เพิ่มไฟล์ CSV ลง ZIP

    const blob = await zip.generateAsync({ type: "blob" }); // คอมเมนต์: สร้าง Blob ของ ZIP
    const filename = `export_all_${new Date().toISOString().slice(0, 10)}.zip`; // คอมเมนต์: สร้างชื่อไฟล์

    FileSystem.downloadBlob(blob, filename, "application/zip"); // คอมเมนต์: ดาวน์โหลดไฟล์

    alert("🎉 ส่งออก ZIP สำเร็จ"); // คอมเมนต์: แจ้งเตือน
  }, // คอมเมนต์: ปิด exportZipAll

  // ----------------------------------------------------
  // 🆕 autoExportLeads()
  // ฟังก์ชันสำหรับการบันทึกไฟล์สำรองอัตโนมัติ (Placeholder)
  // ----------------------------------------------------
  async autoExportLeads() {
    // คอมเมนต์: [ชั่วคราว] ฟังก์ชันนี้จะถูกเรียกใช้ทุกครั้งที่มีการบันทึกข้อมูล
    console.log("💾 autoExportLeads(): เรียกใช้ฟังก์ชันสำรองข้อมูลอัตโนมัติ"); // คอมเมนต์: แสดง log ว่ามีการเรียกใช้
    // ภายหลังจะเพิ่มโค้ด: // คอมเมนต์: โครงสร้างโค้ดสำหรับอนาคต
    // 1. โหลด File Handle จาก AppDexie.handle.load('lead-backup'); // คอมเมนต์: โหลด File Handle
    // 2. ตรวจสอบสิทธิ์ด้วย verifyPermission(handle); // คอมเมนต์: ตรวจสอบสิทธิ์การเขียนทับ
    // 3. ถ้าผ่าน → สร้าง ZIP จาก Store.data.leadItems // คอมเมนต์: สร้างไฟล์สำรอง
    // 4. บันทึกทับไฟล์เดิมด้วย fileHandle.createWritable(); // คอมเมนต์: เขียนทับไฟล์เดิม
  }, // คอมเมนต์: ปิด autoExportLeads
}; // คอมเมนต์: ปิด AppApi

// --------------------------------------------------------
// 🌍 export ออกสู่ระบบ
// --------------------------------------------------------
window.AppApi = AppApi; // คอมเมนต์: Export AppApi
