// oldimport.js
// --------------------------------------------------------
// 📘 โมดูลช่วยนำเข้าข้อมูลเวอร์ชันเก่าจากไฟล์ CSV (leads.csv + log.csv)
// ใช้สำหรับย้ายข้อมูลจากระบบเก่ามาเก็บในโครงสร้างใหม่ของโปรเจกต์
// --------------------------------------------------------

// --------------------------------------------------------
// 🧩 อ็อบเจ็กต์หลัก OldImport รวมฟังก์ชันนำเข้าข้อมูลเก่า
// --------------------------------------------------------
const OldImport = {
  // ------------------------------------------------------
  // 🧾 parseCsv: แปลงข้อความ CSV ให้เป็นอาร์เรย์ของอ็อบเจ็กต์
  // ------------------------------------------------------
  parseCsv(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== ""); // ตัดบรรทัดว่างออก
    if (lines.length < 2) return []; // ถ้ามีแค่ header หรือไม่มีข้อมูล → คืน []

    const headers = lines[0].split(",").map((h) => h.trim()); // หัวคอลัมน์
    const rows = lines.slice(1); // บรรทัดข้อมูล

    return rows.map((line) => {
      const cols = line.split(","); // แยกคอลัมน์ตามคอมม่า
      const obj = {}; // อ็อบเจ็กต์ผลลัพธ์
      headers.forEach((h, idx) => {
        obj[h] = (cols[idx] || "").replace(/^"|"$/g, "").trim(); // ลบ " และ trim ช่องว่าง
      });
      return obj; // คืนอ็อบเจ็กต์ 1 แถว
    });
  },

  // ------------------------------------------------------
  // 🧩 mapLegacyLeadRow: แปลง 1 แถวจาก leads.csv (เวอร์ชันเก่า) → โครงสร้าง Lead ใหม่
  // ------------------------------------------------------
  mapLegacyLeadRow(row) {
    return {
      id: row.id || row.ID || undefined, // ไอดีเดิม (ถ้ามี)
      firstName: row.customerName || row.name || "", // ชื่อลูกค้าเก่า → firstName ใหม่
      nickName: row.nickName || "", // ชื่อเล่น (ถ้ามี)
      phones: row.contactNo || row.phone || "", // เบอร์โทร
      status: row.status || "ลูกค้าใหม่", // สถานะ
      vehicle: row.vehicle || row.car || "", // ข้อมูลรถ (แบบสั้น)
      address: row.address || "", // ที่อยู่
      province: row.province || "", // จังหวัด
      postalCode: row.postalCode || "", // รหัสไปรษณีย์
      occupation: row.occupation || "", // อาชีพ
      source: row.source || "", // แหล่งที่มา
      prospectStage: row.prospectStage || "สนใจ", // ขั้นตอนการขาย
      rating: row.rating || "", // คะแนน
      note: row.note || "", // หมายเหตุ
      isProspect: row.isProspect === "false" ? false : true, // ค่า default เป็นลูกค้าใหม่
      dateCreated: row.dateCreated || row.createdAt || "", // วันที่สร้างจากระบบเก่า
      contracts: [], // เตรียมอาร์เรย์สัญญา (จะผูกจาก log ภายหลัง)
    };
  },

  // ------------------------------------------------------
  // 🧩 parseLeadsCSV: อ่าน leads.csv (เวอร์ชันเก่า) แล้วแปลงเป็น array ของ lead ใหม่
  // ------------------------------------------------------
  parseLeadsCSV(csvText) {
    const rawRows = this.parseCsv(csvText); // ใช้ parseCsv แปลงข้อความ
    return rawRows.map((row) => this.mapLegacyLeadRow(row)); // map แถว → โครงสร้างใหม่
  },

  // ------------------------------------------------------
  // 🧩 mapLegacyLogRow: แปลง 1 แถวจาก log.csv (เวอร์ชันเก่า) → โครงสร้าง Log ใหม่ (เบื้องต้น)
  // ------------------------------------------------------
  mapLegacyLogRow(row) {
    return {
      id: row.id || undefined, // ไอดี log เดิม (ถ้ามี)
      leadKey: row.leadKey || row.leadId || "", // ใช้เชื่อมกับ lead
      note: row.note || row.remark || "", // โน้ต/บันทึก
      actionType: row.actionType || "call", // ประเภทเหตุการณ์
      createdAt: row.createdAt || row.date || "", // วันที่บันทึก
      lastActive: row.lastActive || "", // ใช้เติมให้สัญญาในภายหลัง
    };
  },

  // ------------------------------------------------------
  // 🧩 parseLogsCSV: อ่าน log.csv แล้วแปลงเป็น array ของ log
  // ------------------------------------------------------
  parseLogsCSV(csvText) {
    const rawRows = this.parseCsv(csvText); // แปลงด้วย parseCsv
    return rawRows.map((row) => this.mapLegacyLogRow(row)); // คืน array log
  },

  // ------------------------------------------------------
  // 🧩 buildLeadKey: สร้าง key สำหรับใช้เชื่อม lead ↔ log / contract
  // ------------------------------------------------------
  buildLeadKey(row) {
    const name = (row.customerName || row.name || "").trim(); // ชื่อลูกค้า
    const phone = (row.contactNo || row.phone || "").trim(); // เบอร์โทร
    return `${name}|${phone}`; // รวมเป็น key เดียว
  },

  // ------------------------------------------------------
  // 🧩 attachContractAndVehicle: ผูกข้อมูลสัญญา + รถ ให้กับ lead แต่ละตัว (จากแถว leads.csv)
  // ------------------------------------------------------
  attachContractAndVehicle(lead, row) {
    const contract = {
      contractNo: row.contractNo || "", // เลขที่สัญญา
      type: row.contractType || "", // ประเภทสัญญา
      amount: Number(row.amount || 0), // วงเงิน
      term: Number(row.term || 0), // ระยะเวลาผ่อน
      status: row.contractStatus || "", // สถานะสัญญา
      vehicle: {
        brand: row.carBrand || "", // ยี่ห้อรถ
        model: row.carModel || "", // รุ่นรถ
        plateNo: row.plateNo || "", // ทะเบียน
      },
      lastUpdate: row.lastUpdate || "", // วันที่อัปเดตล่าสุด
    };

    if (!Array.isArray(lead.contracts)) {
      lead.contracts = []; // ถ้าไม่มี contracts ให้สร้างใหม่
    }
    lead.contracts.push(contract); // เพิ่มสัญญาเข้าไปใน lead
  },

  // ------------------------------------------------------
  // 🧩 importLegacyLeadsCSV: รับ leads.csv (เนื้อหาเป็น string) → คืน array ของ lead ใหม่
  //   และถ้ามี Store อยู่ จะอัปเดต Store ด้วย
  // ------------------------------------------------------
  importLegacyLeadsCSV(leadCsvText) {
    const rows = this.parseCsv(leadCsvText); // แปลงข้อความ CSV เป็น array raw
    const byKey = new Map(); // ใช้ Map เก็บ lead ตาม key

    rows.forEach((row) => {
      const key = this.buildLeadKey(row); // สร้าง key จากชื่อ+เบอร์
      if (!byKey.has(key)) {
        // ถ้ายังไม่มี lead ตัวนี้ใน Map
        const lead = this.mapLegacyLeadRow(row); // แปลง row → lead ใหม่
        lead.contracts = []; // เตรียมอาร์เรย์สัญญา
        byKey.set(key, lead); // เก็บลง Map
      }
      const lead = byKey.get(key); // ดึง lead ตาม key
      this.attachContractAndVehicle(lead, row); // ผูกสัญญาและรถตามข้อมูลแถว
    }); // จบวนแถว

    const newLeads = Array.from(byKey.values()); // แปลง Map เป็นอาร์เรย์

    if (window.Store && typeof Store.setItems === "function") {
      // ถ้า Store พร้อมใช้งาน
      Store.setItems("Lead", newLeads); // อัปเดต Lead เข้า Store (ข้อมูลใน IndexedDB จะจัดการแยกต่างหาก)
    } else {
      // ถ้า Store ยังไม่พร้อม
      console.warn("⚠️ ไม่พบ Store.setItems (Lead)"); // แจ้งเตือนนักพัฒนา
    } // จบ if Store

    return newLeads; // คืนค่าอาร์เรย์ Lead ที่นำเข้าได้
  }, // ปิดฟังก์ชัน importLegacyLeadsCSV

  // ------------------------------------------------------
  // 🧰 หรือต้องสร้างสัญญาตาม log.csv (ถ้ายังไม่มี) และอัปเดตค่าในสัญญา
  // ------------------------------------------------------
  attachLogsToLeads(leads, logs) {
    const byKey = new Map(); // Map สำหรับ lead ตาม key
    leads.forEach((lead) => {
      const key = `${lead.firstName || ""}|${lead.phones || ""}`; // key จาก lead ใหม่
      byKey.set(key, lead); // เซต mapping
    });

    logs.forEach((row) => {
      const key = row.leadKey || ""; // key ที่ได้จาก log
      const lead = byKey.get(key); // หา lead ที่ตรงกับ key
      if (!lead) return; // ถ้าไม่พบ → ข้าม

      if (!Array.isArray(lead.logs)) {
        lead.logs = []; // ถ้า lead ยังไม่มี logs ให้สร้าง array ใหม่
      }

      lead.logs.push({
        id: row.id || undefined, // id ของ log
        note: row.note || "", // เนื้อหาบันทึก
        actionType: row.actionType || "call", // ประเภทเหตุการณ์
        createdAt: row.createdAt || "", // เวลาที่สร้าง log
        lastActive: row.lastActive || "", // เวลา active ล่าสุด
      });
    });

    return leads; // คืน leads ที่ถูกผูก log แล้ว
  },

  // ------------------------------------------------------
  // 🧩 importLegacyLogsCSV: นำเข้า log.csv และผูกกับ Lead
  // ------------------------------------------------------
  importLegacyLogsCSV(logCsvText) {
    const rows = this.parseCsv(logCsvText); // แปลง CSV → rows
    const logs = rows.map((row) => this.mapLegacyLogRow(row)); // map เป็นโครงสร้าง log ใหม่

    // [เบื้องต้น] ยังไม่ผูกกลับเข้า lead ที่อยู่ใน Store โดยตรง
    // สามารถใช้ attachLogsToLeads ร่วมกับ Store.data.leadItems ภายหลังได้

    if (window.Store && typeof Store.setItems === "function") {
      // ถ้า Store พร้อมใช้งาน
      Store.setItems("Log", logs); // อัปเดต Log เข้า Store (ข้อมูลถาวรค่อยเชื่อม IndexedDB ภายหลัง)
      Store.setItems("Lead", leads); // อัปเดต Lead กลับเข้า Store (กรณีมี auto-create)
    } else {
      // ถ้า Store ยังไม่พร้อม
      console.warn("⚠️ ไม่พบ Store.setItems (Log/Lead)"); // แจ้งเตือนนักพัฒนา
    } // จบ if Store

    return { logs, leads }; // คืนผลที่นำเข้าแล้ว
  }, // ปิดฟังก์ชัน importLegacyLogsCSV

  // ------------------------------------------------------
  // 🧩 importLegacyBundle: รับ leads.csv + log.csv (เนื้อหา string) แล้ว import ทั้งคู่
  // ------------------------------------------------------
  importLegacyBundle(leadCsvText, logCsvText) {
    const leads = this.importLegacyLeadsCSV(leadCsvText); // นำเข้า leads ก่อน
    const { logs } = this.importLegacyLogsCSV(logCsvText); // ตามด้วยล็อกเพื่อเติมสัญญา/สถานะ

    // [ชั่วคราว] ถ้าต้องการกรอง ExampleData ออก ให้ปลดคอมเมนต์ด้านล่าง   // คอมเมนต์ถาวร
    /*
    const filteredLeads = leads.filter(ld => !(ld.firstName === "John Doe" || ld.firstName === "Jane Smith")); // กรองตัวอย่าง
    if (window.Store && typeof Store.setItems === "function") {                       // ตรวจ Store
      Store.setItems("Lead", filteredLeads);                    // เซฟเฉพาะข้อมูลจริงเข้า Store
    }                                                                     // จบ if
    */ // ปิดบล็อกกรอง

    return { leads, logs }; // คืนผลรวม
  }, // ปิดฟังก์ชัน importLegacyBundle
}; // ปิดอ็อบเจกต์ OldImport

// --------------------------------------------------------
// ✅ export OldImport เป็น global
// --------------------------------------------------------
window.OldImport = OldImport; // เปิดให้ไฟล์อื่นเรียกใช้ได้
