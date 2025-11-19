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
    if (!Array.isArray(data) || data.length === 0) return ""; // ถ้าไม่มีข้อมูลคืนสตริงว่าง

    const headers = Object.keys(data[0]); // เอาชื่อฟิลด์เป็น header
    const rows = [headers.join(",")]; // เริ่มต้นด้วย header

    data.forEach((item) => {
      const line = headers.map((h) => JSON.stringify(item[h] ?? "")).join(",");
      rows.push(line); // เพิ่มบรรทัดข้อมูล
    });

    return rows.join("\n"); // รวมเป็น CSV เดียว
  },

  // ----------------------------------------------------
  // ⭐ parseCsvFile(file)
  // อ่านไฟล์ CSV → Array Object
  // ----------------------------------------------------
  async parseCsvFile(file) {
    const text = await file.text(); // อ่านทั้งหมดเป็นข้อความ
    const lines = text.split(/\r?\n/).filter(Boolean); // แยกบรรทัด

    if (lines.length < 2) return []; // ถ้าไม่มีข้อมูลเลย

    const headers = lines[0].split(","); // อ่าน header

    return lines.slice(1).map((line) => {
      const cols = line.split(","); // แยกคอลัมน์
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = cols[i]?.replace(/^"|"$/g, "") ?? ""; // ลบ ""
      });
      return obj; // คืนอ็อบเจ็กต์
    });
  },

  // ----------------------------------------------------
  // ⭐ importLeadCsv(file)
  // นำเข้า Lead CSV แบบ 6 ฟิลด์ → บันทึกลง Dexie
  // ----------------------------------------------------
  async importLeadCsv(file) {
    const rows = await this.parseCsvFile(file); // แปลง CSV → Array

    if (!rows.length) {
      alert("⚠️ ไฟล์ Lead ไม่มีข้อมูล");
      return;
    }

    // ล้าง Dexie ก่อน import ใหม่ (ถ้าต้องการให้รวม ให้ลบส่วนนี้)
    await AppDexie.clearLeads();

    // เพิ่มทีละแถวลง Dexie
    for (const row of rows) {
      await AppDexie.addLead({
        customerName: row.customerName || "",
        contactNo: row.contactNo || "",
        status: row.status || "",
        vehicle: row.vehicle || "",
        dateCreated: row.dateCreated || "",
      });
    }

    await AppDexie.loadAllToStore(); // sync UI

    alert(`✅ นำเข้า Lead สำเร็จ (${rows.length} รายการ)`);
  },

  // ----------------------------------------------------
  // ⭐ handleImportLead()
  // เปิด Dialog ให้เลือกไฟล์ CSV
  // ----------------------------------------------------
  handleImportLead() {
    const input = document.createElement("input"); // สร้าง input file
    input.type = "file";
    input.accept = ".csv";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) this.importLeadCsv(file); // เรียก import
    };

    input.click(); // เปิด dialog
  },

  // ----------------------------------------------------
  // ⭐ exportLeadCsv()
  // ส่งออก Lead (CSV) จาก Store.data.leadItems
  // ----------------------------------------------------
  exportLeadCsv() {
    const list = Store.data.leadItems; // ข้อมูล UI
    if (!list.length) {
      alert("⚠️ ไม่มีข้อมูล Lead ให้ส่งออก");
      return;
    }

    const csv = this.createCsvString(list); // แปลง CSV
    const filename = `lead_${new Date().toISOString().slice(0, 10)}.csv`;

    FileSystem.downloadBlob(csv, filename, "text/csv"); // ดาวน์โหลดไฟล์

    alert("✅ ส่งออก Lead CSV สำเร็จ");
  },

  // ----------------------------------------------------
  // ⭐ exportVcf()
  // ส่งออกเบอร์โทรเป็นไฟล์ .vcf (ใช้ในมือถือ)
  // ----------------------------------------------------
  sanitizePhone(raw) {
    return String(raw || "").replace(/[^\d+]/g, "");
  },

  splitName(fullname) {
    const parts = fullname.trim().split(/\s+/);
    return {
      first: parts[0] || "",
      last: parts.slice(1).join(" "),
    };
  },

  createVcfEntry(item) {
    const { first, last } = this.splitName(item.customerName);
    const tel = this.sanitizePhone(item.contactNo);

    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${last};${first};;;`,
      `FN:${first} ${last}`.trim(),
      tel ? `TEL;TYPE=CELL:${tel}` : "",
      `UID:${item.id}`,
      "END:VCARD",
    ].join("\r\n");
  },

  exportVcf() {
    const list = Store.data.leadItems;

    if (!list.length) {
      alert("⚠️ ไม่มีข้อมูล Lead สำหรับ VCF");
      return;
    }

    const vcf = list.map((l) => this.createVcfEntry(l)).join("\n");
    const filename = `lead_${new Date().toISOString().slice(0, 10)}.vcf`;

    FileSystem.downloadBlob(vcf, filename, "text/vcard");

    alert("📱 ส่งออก VCF สำเร็จ");
  },

  // ----------------------------------------------------
  // ⭐ exportZipAll()
  // ส่งออก ZIP ที่มีไฟล์ CSV ของโมดูลต่าง ๆ
  // ----------------------------------------------------
  async exportZipAll() {
    if (typeof JSZip === "undefined") {
      alert("❌ ต้องโหลด JSZip ก่อน");
      return;
    }

    const zip = new JSZip();

    // ✔ เพิ่มเฉพาะข้อมูล Lead (โมดูลอื่นยังไม่เปิดใช้งาน)
    const leadCsv = this.createCsvString(Store.data.leadItems);
    zip.file("lead.csv", leadCsv);

    const blob = await zip.generateAsync({ type: "blob" });
    const filename = `export_all_${new Date().toISOString().slice(0, 10)}.zip`;

    FileSystem.downloadBlob(blob, filename, "application/zip");

    alert("🎉 ส่งออก ZIP สำเร็จ");
  },
};

// --------------------------------------------------------
// 🌍 export ออกสู่ระบบ
// --------------------------------------------------------
window.AppApi = AppApi;
