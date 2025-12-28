// js/dataExchange.js
// --------------------------------------------------------
// 📘 DataExchange: โมดูลจัดการการนำเข้า/ส่งออกข้อมูล
// --------------------------------------------------------
// หน้าที่:
// - แปลงข้อมูลระหว่าง Object <-> CSV/VCF/JSON
// - อ่านไฟล์ที่ผู้ใช้อัปโหลด (Parsing)
// - เรียก FileSystem เพื่อดาวน์โหลดไฟล์
// - ⚠️ ห้ามบันทึกลง Dexie เอง (ส่งข้อมูลกลับให้ Service/Repository จัดการ)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const DataExchange = {
    // ========================================================
    // 🛠️ CSV Utilities (เครื่องมือจัดการ CSV)
    // ========================================================

    /**
     * แปลง Array of Objects เป็น CSV String
     * @param {Array} data - ข้อมูลที่จะแปลง
     * @returns {string} - ข้อความรูปแบบ CSV
     */
    toCSV(data) {
      if (!Array.isArray(data) || data.length === 0) return "";

      // ดึง Header จาก Key ของ Object ตัวแรก
      const headers = Object.keys(data[0]);

      // สร้างบรรทัด Header
      const rows = [headers.join(",")];

      // วนลูปสร้างบรรทัดข้อมูล
      data.forEach((item) => {
        const line = headers
          .map((header) => {
            // แปลงค่าเป็น String และ Escape เครื่องหมาย "
            let val = item[header] ?? "";
            return JSON.stringify(val);
          })
          .join(",");
        rows.push(line);
      });

      return rows.join("\n");
    },

    /**
     * อ่านไฟล์ CSV และแปลงกลับเป็น Array of Objects
     * @param {File} file - ไฟล์ที่ผู้ใช้อัปโหลด
     * @returns {Promise<Array>} - ข้อมูลที่แปลงเสร็จแล้ว
     */
    async parseCSV(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const text = e.target.result;
          const lines = text.split(/\r?\n/).filter(Boolean); // ตัดบรรทัดว่างทิ้ง

          if (lines.length < 2) {
            resolve([]); // ถ้ามีแต่ Header หรือว่างเปล่า
            return;
          }

          const headers = lines[0].split(",");
          const result = lines.slice(1).map((line) => {
            const cols = line.split(",");
            const obj = {};
            headers.forEach((h, i) => {
              // ลบเครื่องหมาย " หัวท้ายออก
              obj[h] = cols[i]?.replace(/^"|"$/g, "") ?? "";
            });
            return obj;
          });

          resolve(result);
        };

        reader.onerror = () => reject(new Error("อ่านไฟล์ล้มเหลว"));
        reader.readAsText(file);
      });
    },

    // ========================================================
    // 📱 VCF Utilities (สำหรับ Contact มือถือ)
    // ========================================================

    /**
     * สร้าง VCF String สำหรับ 1 รายการ
     * @param {Object} item - ข้อมูล Lead (ต้องมี customerName, contactNo)
     * @returns {string} - VCard Format
     */
    createVcfEntry(item) {
      // Helper: แยกชื่อ-นามสกุล
      const parts = (item.customerName || "").trim().split(/\s+/);
      const first = parts[0] || "Unknown";
      const last = parts.slice(1).join(" ");

      // Helper: คลีนเบอร์โทร
      const tel = (item.contactNo || "").replace(/[^\d+]/g, "");

      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${last};${first};;;`,
        `FN:${first} ${last}`.trim(),
        tel ? `TEL;TYPE=CELL:${tel}` : "",
        `UID:${item.id || crypto.randomUUID()}`, // ใช้ UUID ถ้ามี หรือสุ่มใหม่
        "END:VCARD",
      ].join("\r\n");
    },

    /**
     * แปลงรายการ Lead ทั้งหมดเป็น VCF ไฟล์เดียว
     * @param {Array} list - รายการ Lead
     * @returns {string} - VCF Content
     */
    toVCF(list) {
      return list.map((item) => this.createVcfEntry(item)).join("\n");
    },

    // ========================================================
    // 📤 Export Actions (เรียกใช้งานจาก UI)
    // ========================================================

    /**
     * ส่งออก Lead เป็นไฟล์ CSV
     * @param {Array} data - ข้อมูล Lead จาก Store หรือ Repository
     */
    exportLeadsToCSV(data) {
      if (!data || !data.length) {
        global.AppNotification?.error("⚠️ ไม่มีข้อมูลสำหรับการส่งออก");
        return;
      }

      const csvContent = this.toCSV(data);
      const fileName = `leads_${new Date().toISOString().slice(0, 10)}.csv`;

      // เรียกใช้ FileSystem เพื่อดาวน์โหลด
      if (global.FileSystem) {
        global.FileSystem.downloadBlob(csvContent, fileName, "text/csv");
        global.AppNotification?.success("✅ ส่งออก CSV สำเร็จ");
      } else {
        console.error("❌ FileSystem module not found");
      }
    },

    /**
     * ส่งออก Lead เป็นไฟล์ VCF (Contact)
     * @param {Array} data - ข้อมูล Lead
     */
    exportLeadsToVCF(data) {
      if (!data || !data.length) {
        global.AppNotification?.error("⚠️ ไม่มีข้อมูลสำหรับการส่งออก");
        return;
      }

      const vcfContent = this.toVCF(data);
      const fileName = `leads_${new Date().toISOString().slice(0, 10)}.vcf`;

      if (global.FileSystem) {
        global.FileSystem.downloadBlob(vcfContent, fileName, "text/vcard");
        global.AppNotification?.success("📱 ส่งออก VCF สำเร็จ");
      }
    },

    // ========================================================
    // 📥 Import Actions (UI เรียก -> Parse -> ส่งคืน Data)
    // ========================================================

    /**
     * จัดการการเลือกไฟล์และอ่านข้อมูล (ไม่ Save ลง DB เอง)
     * @param {Function} callback - ฟังก์ชันที่จะรับข้อมูลไปทำต่อ (เช่น Repository.import)
     */
    triggerImportCSV(callback) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          // 1. อ่านและแปลงไฟล์
          const rawData = await this.parseCSV(file);

          console.log(
            `📂 DataExchange: อ่านไฟล์สำเร็จ ${rawData.length} รายการ`
          );

          // 2. ส่งข้อมูลกลับไปให้ Controller/Service จัดการต่อ (ตามที่ตกลงว่าจะข้ามส่วน Dexie ในไฟล์นี้)
          if (typeof callback === "function") {
            callback(rawData);
          }
        } catch (error) {
          console.error("❌ Import Error:", error);
          global.AppNotification?.error("อ่านไฟล์ CSV ล้มเหลว");
        }
      };

      input.click();
    },
  };

  // Export สู่ Global
  global.DataExchange = DataExchange;

  // Backward Compatibility (เผื่อไฟล์เก่าเรียก AppApi)
  global.AppApi = DataExchange;
})(window);
