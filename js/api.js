// api.js
// --------------------------------------------------------
// 📘 โมดูลจัดการการแลกเปลี่ยนข้อมูลภายนอก (Import / Export / ZIP)
// ทำงานร่วมกับ Store เวอร์ชันกลาง (ที่มี ExampleData ภายใน)
// --------------------------------------------------------
//
// 🧭 ตัวอย่างการใช้งาน:
//
// 🔹 Import (CSV เดียว)
//    AppApi.handleImport('Lead')             // นำเข้าเฉพาะ Lead
//    AppApi.handleImport('Settings')         // นำเข้าเฉพาะ Settings
//
// 🔹 Import หลายไฟล์พร้อมกัน (All CSV)
//    AppApi.handleImportAll()                // เลือก CSV หลายไฟล์ (lead.csv, car.csv, finance.csv, log.csv, report.csv, settings.csv)
//
// 🔹 Import ZIP เดียว (แตกไฟล์อัตโนมัติ)
//    AppApi.importZipAll()                   // เลือก ZIP ที่มีไฟล์ครบ (lead.csv, car.csv, finance.csv, log.csv, report.csv, settings.csv)
//
// 🔹 Export CSV
//    AppApi.handleExport('Lead')             // ส่งออกข้อมูล Lead เป็น CSV
//    AppApi.handleExport('Settings')         // ส่งออกข้อมูล Settings เป็น CSV
//
// 🔹 Export ZIP รวมทั้งหมด
//    AppApi.exportZipAll()                   // ส่งออกข้อมูลทั้งหมดเป็น ZIP เดียว
//
// ⚙️ หมายเหตุ: ต้องมี JSZip โหลดไว้ก่อนใช้งาน (เพิ่มใน index.html)
//    <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
//
// --------------------------------------------------------

const AppApi = {
  // --------------------------------------------------------
  // 🧱 ฟังก์ชันกลาง (Core Utilities)
  // --------------------------------------------------------

  // ----------------------------------------------------
  // 🔹 createCsvString: แปลง Array ของอ็อบเจกต์ → ข้อความ CSV (ใช้ตอน Export)
  // ----------------------------------------------------
  createCsvString(data) {
    const headers = Object.keys(data[0]); // ดึงหัวคอลัมน์ (key) จากแถวแรกเพื่อใช้เป็น header
    const csvRows = [
      // สร้างอาร์เรย์เก็บแต่ละบรรทัดของ CSV
      headers.join(","), // บรรทัดแรกเป็นหัวคอลัมน์ คั่นด้วยคอมม่า
      ...data.map(
        (
          row // วนแต่ละแถวข้อมูลเพื่อแปลงเป็นสตริง CSV
        ) =>
          headers // ใช้ลำดับคอลัมน์ตาม headers ที่กำหนด
            .map((field) => JSON.stringify(row[field] ?? "")) // ใส่ค่าแต่ละฟิลด์ หากว่างให้เป็นสตริงว่าง และครอบด้วย JSON.stringify เพื่อหนีอักขระพิเศษ/คอมม่า
            .join(",") // รวมคอลัมน์ในหนึ่งแถวด้วยคอมม่า
      ),
    ];
    return csvRows.join("\n"); // รวมทุกบรรทัดด้วยขึ้นบรรทัดใหม่แล้วคืนค่าเป็นสตริง
  },

  // ----------------------------------------------------
  // 🔹 downloadBlob: ดาวน์โหลดข้อมูล Blob เป็นไฟล์ (รองรับ CSV/ZIP ตาม MIME)
  // ----------------------------------------------------
  downloadBlob(content, filename, mime = "text/csv;charset=utf-8;") {
    const blob = new Blob([content], { type: mime }); // สร้าง Blob จากเนื้อหาและชนิดไฟล์ที่กำหนด
    const link = document.createElement("a"); // สร้างแท็ก <a> ชั่วคราวสำหรับดาวน์โหลดไฟล์
    link.href = URL.createObjectURL(blob); // สร้าง URL ชี้ไปยัง Blob ที่เพิ่งสร้าง
    link.download = filename; // ตั้งชื่อไฟล์ปลายทาง
    document.body.appendChild(link); // เพิ่มลิงก์ลง DOM เพื่อให้คลิกได้
    link.click(); // สั่งคลิกลิงก์เพื่อเริ่มดาวน์โหลด
    document.body.removeChild(link); // ลบลิงก์ออกจาก DOM เพื่อความสะอาด
  },

  // ----------------------------------------------------
  // 🔹 parseCsvFile: อ่านไฟล์ CSV แล้วแปลงเป็น Array ของ Object (ใช้ตอน Import)
  // ----------------------------------------------------
  async parseCsvFile(file) {
    const text = await file.text(); // อ่านไฟล์เป็นสตริง (รองรับไฟล์ขนาดเล็กถึงปานกลาง)
    const lines = text.split(/\r?\n/).filter(Boolean); // แยกบรรทัดด้วย \n หรือ \r\n และตัดบรรทัดว่างออก
    if (lines.length < 2) return []; // ถ้ามีน้อยกว่า 2 บรรทัด แปลว่าไม่มีข้อมูล (มีแต่ header หรือว่างเปล่า)
    const headers = lines[0].split(",").map((h) => h.trim()); // แยกหัวคอลัมน์จากบรรทัดแรกและ trim ช่องว่าง
    return lines.slice(1).map((line) => {
      // วนทุกบรรทัดตั้งแต่บรรทัดที่สองเป็นต้นไป
      const values = line.split(",").map((v) => v.replace(/^"|"$/g, "")); // แยกคอลัมน์ด้วยคอมม่า และลบ " หัว-ท้าย ที่ครอบค่า
      return headers.reduce((obj, key, i) => {
        // รวม headers กับ values เป็นอ็อบเจกต์เดียว
        obj[key] = values[i] ?? ""; // หากไม่มีค่า ให้เป็นสตริงว่างแทน
        return obj; // คืนอ็อบเจกต์สะสม
      }, {}); // ค่าเริ่มต้นของอ็อบเจกต์สะสม
    });
  },

  // --------------------------------------------------------
  // 🧩 ชั้นตรรกะต่อโมดูล (Module Logic)
  // --------------------------------------------------------

  // ----------------------------------------------------
  // 📤 exportModule: ส่งออกข้อมูลของโมดูลเดียวเป็น CSV
  // ----------------------------------------------------
  exportModule(type) {
    try {
      // ครอบด้วย try/catch เพื่อกัน error ระหว่างทำงาน
      const map = {
        // สร้างแผนที่เชื่อมชื่อโมดูลกับแหล่งข้อมูลใน Store
        Lead: Store.data.leadItems, // ข้อมูล Lead จาก Store
        Car: Store.data.carItems, // ข้อมูล Car จาก Store
        Finance: Store.data.financeItems, // ข้อมูล Finance จาก Store
        Log: Store.data.logItems, // ข้อมูล Log จาก Store
        Report: Store.data.reportItems, // ข้อมูล Report จาก Store
        Settings: Store.data.settings, // ข้อมูล Settings จาก Store
      };
      const dataset = map[type]; // ดึงข้อมูลตามโมดูลที่ระบุ
      if (!dataset || dataset.length === 0) {
        // ตรวจว่ามีข้อมูลให้ส่งออกหรือไม่
        alert(`⚠️ ไม่มีข้อมูล ${type} สำหรับส่งออก`); // แจ้งเตือนหากไม่มีข้อมูล
        return; // ยุติการทำงานหากไม่มีข้อมูล
      }
      const filename = `${type.toLowerCase()}_${new Date() // สร้างชื่อไฟล์จากชื่อโมดูลและวันที่
        .toISOString()
        .slice(0, 10)}.csv`;
      const csv = this.createCsvString(dataset); // แปลงข้อมูลเป็นข้อความ CSV ด้วยฟังก์ชันกลาง
      this.downloadBlob(csv, filename); // ดาวน์โหลดเป็นไฟล์ CSV
      console.log(`✅ ส่งออกข้อมูล ${type} เรียบร้อยแล้ว`); // Log ความสำเร็จ
    } catch (err) {
      // ดักจับความผิดพลาด
      console.error(`❌ exportModule(${type}) ล้มเหลว:`, err); // แสดง error ใน console
      alert(`❌ ไม่สามารถส่งออกข้อมูล ${type} ได้`); // แจ้งเตือนผู้ใช้
    }
  },

  // ----------------------------------------------------
  // 📥 importModule: นำเข้า CSV ของโมดูลเดียว
  // ----------------------------------------------------
  async importModule(type, file) {
    try {
      // ครอบด้วย try/catch เพื่อความปลอดภัย
      const data = await this.parseCsvFile(file); // อ่านและแปลงไฟล์ CSV เป็น array ของอ็อบเจกต์
      if (!Array.isArray(data) || data.length === 0) {
        // ตรวจว่ามีข้อมูลหรือไม่
        alert(`⚠️ ไฟล์ ${file?.name || "(ไม่ทราบชื่อ)"} ไม่มีข้อมูล`); // แจ้งเตือนถ้าไฟล์ว่าง
        return; // ยุติการทำงาน
      }
      Store.updateLocalStorage(type, data); // อัปเดตข้อมูลไปยัง Store + LocalStorage ด้วยฟังก์ชันกลาง
      alert(`✅ นำเข้าข้อมูล ${type} สำเร็จ (${data.length} แถว)`); // แจ้งเตือนความสำเร็จ
    } catch (err) {
      // ดักจับความผิดพลาด
      console.error(`❌ importModule(${type}) ล้มเหลว:`, err); // แสดง error ใน console
      alert(`❌ ไม่สามารถนำเข้าข้อมูล ${type} ได้`); // แจ้งเตือนผู้ใช้
    }
  },

  // --------------------------------------------------------
  // ⚙️ ชั้นปฏิบัติการ (Operation Layer) — เรียกจากปุ่ม/เมนูใน UI
  // --------------------------------------------------------

  // ----------------------------------------------------
  // 📤 handleExport: ส่งออก CSV (เลือกโมดูลเดียว หรือทั้งหมด)
  // ----------------------------------------------------
  handleExport(type = "All") {
    try {
      // ครอบด้วย try/catch
      const modules = ["Lead", "Car", "Finance", "Log", "Report", "Settings"]; // รายชื่อโมดูลทั้งหมดที่รองรับ
      if (type === "All") {
        // หากสั่งส่งออกทั้งหมด
        alert("📤 เริ่มส่งออกข้อมูลทั้งหมด..."); // แจ้งเริ่มงาน
        modules.forEach((m) => this.exportModule(m)); // วนส่งออกทีละโมดูล
        alert("✅ ส่งออกข้อมูลทั้งหมดเรียบร้อยแล้ว"); // แจ้งสำเร็จ
        return; // จบการทำงาน
      }
      this.exportModule(type); // หากระบุโมดูลเดียว ให้ส่งออกเฉพาะโมดูลนั้น
    } catch (err) {
      // ดักจับความผิดพลาด
      console.error("❌ handleExport ล้มเหลว:", err); // แสดง error
      alert("❌ ไม่สามารถส่งออกข้อมูลได้"); // แจ้งผู้ใช้
    }
  },

  // ----------------------------------------------------
  // 📦 exportZipAll: ส่งออกข้อมูลทุกโมดูลเป็นไฟล์ ZIP เดียว
  // ----------------------------------------------------
  async exportZipAll() {
    try {
      // ครอบด้วย try/catch
      if (typeof JSZip === "undefined") {
        // ตรวจสอบว่ามีไลบรารี JSZip หรือไม่
        alert("⚠️ ต้องโหลด JSZip ก่อนใช้งาน exportZipAll()"); // แจ้งเตือนหากยังไม่โหลด
        return; // ยุติการทำงาน
      }
      const zip = new JSZip(); // สร้างอ็อบเจกต์ ZIP ใหม่
      const modules = ["Lead", "Car", "Finance", "Log", "Report", "Settings"]; // รายชื่อโมดูลทั้งหมด
      modules.forEach((m) => {
        // วนทุกโมดูล
        const data = Store.data[`${m.toLowerCase()}Items`] || []; // ดึงข้อมูลตามคีย์มาตรฐาน *Items
        if (data.length) {
          // ถ้ามีข้อมูล
          const csv = this.createCsvString(data); // แปลงข้อมูลเป็น CSV
          zip.file(`${m.toLowerCase()}.csv`, csv); // เพิ่มไฟล์ CSV ของโมดูลนี้ลง ZIP
        }
      });
      const blob = await zip.generateAsync({ type: "blob" }); // สร้าง ZIP เป็น Blob (แบบ Async)
      const zipName = `export_all_${new Date().toISOString().slice(0, 10)}.zip`; // ตั้งชื่อไฟล์ ZIP ตามวันที่
      this.downloadBlob(blob, zipName, "application/zip"); // ดาวน์โหลด ZIP ที่สร้าง
      alert("✅ ส่งออกข้อมูลทั้งหมดเป็น ZIP เรียบร้อยแล้ว"); // แจ้งผู้ใช้ว่าสำเร็จ
    } catch (err) {
      // ดักจับความผิดพลาด
      console.error("❌ exportZipAll() ล้มเหลว:", err); // แสดง error
      alert("❌ ไม่สามารถส่งออก ZIP ได้"); // แจ้งผู้ใช้
    }
  },

  // ----------------------------------------------------
  // 📥 handleImport: นำเข้า CSV (ระบุมอดูลเดียว หรือสั่งไปทำแบบ All)
  // ----------------------------------------------------
  async handleImport(type, file = null) {
    try {
      // ครอบด้วย try/catch
      if (type === "All") {
        // หากต้องการนำเข้าหลายไฟล์พร้อมกัน
        this.handleImportAll(); // เรียกฟังก์ชันรวมไฟล์ CSV หลายไฟล์
        return; // จบการทำงาน
      }
      if (!file) {
        // หากยังไม่ได้ส่งไฟล์เข้ามา
        const input = document.createElement("input"); // สร้าง input file
        input.type = "file"; // กำหนดชนิดเป็นไฟล์
        input.accept = ".csv"; // จำกัดให้เลือกเฉพาะ .csv
        input.onchange = (e) => this.importModule(type, e.target.files[0]); // เมื่อเลือกไฟล์แล้วให้ import ทันที
        input.click(); // เปิด dialog ให้ผู้ใช้เลือกไฟล์
        return; // จบการทำงาน (รอผู้ใช้เลือกไฟล์)
      }
      await this.importModule(type, file); // หากมีไฟล์แล้ว นำเข้าโมดูลตามประเภทที่ระบุ
    } catch (err) {
      // ดักจับความผิดพลาด
      console.error(`❌ handleImport(${type}) ล้มเหลว:`, err); // แสดง error
      alert("❌ ไม่สามารถนำเข้าข้อมูลได้"); // แจ้งผู้ใช้
    }
  },

  // ----------------------------------------------------
  // 📥 handleImportAll: นำเข้า CSV หลายไฟล์พร้อมกัน (ตรวจครบ)
  // ----------------------------------------------------
  handleImportAll() {
    try {
      // ครอบด้วย try/catch
      alert(
        "📥 กรุณาเลือก CSV ของทุกโมดูล (Lead, Car, Finance, Log, Report, Settings)"
      ); // แจ้งผู้ใช้ก่อนเริ่ม
      const input = document.createElement("input"); // สร้าง input file
      input.type = "file"; // ตั้งชนิดเป็นไฟล์
      input.multiple = true; // เปิดโหมดเลือกหลายไฟล์
      input.accept = ".csv"; // จำกัดเฉพาะไฟล์ CSV
      input.onchange = async (e) => {
        // เมื่อผู้ใช้เลือกไฟล์เสร็จ
        const files = Array.from(e.target.files); // ดึงรายการไฟล์ทั้งหมด
        const expected = [
          // รายชื่อไฟล์ที่คาดหวังว่าควรมีครบ
          "lead.csv",
          "car.csv",
          "finance.csv",
          "log.csv",
          "report.csv",
          "settings.csv",
        ];
        const fileMap = Object.fromEntries(
          // สร้างแผนที่ชื่อไฟล์ → ไฟล์
          files.map((f) => [f.name.toLowerCase(), f]) // แปลงชื่อไฟล์เป็นตัวพิมพ์เล็กเพื่อเทียบได้แน่นอน
        );
        const missing = expected.filter((f) => !fileMap[f]); // ตรวจสอบไฟล์ที่ขาดหาย
        if (missing.length > 0) {
          // หากยังขาด
          alert(`⚠️ ยังขาดไฟล์:\n${missing.join("\n")}`); // แจ้งผู้ใช้รายการที่ขาด
          return; // ยุติการทำงาน
        }
        for (const filename of expected) {
          // วนตามลำดับที่คาดหวัง
          const file = fileMap[filename]; // ดึงไฟล์ตามชื่อ
          const base = filename.split(".")[0]; // ตัดนามสกุลออก
          const type = base.charAt(0).toUpperCase() + base.slice(1); // แปลงชื่อไฟล์ให้เป็นชื่อโมดูล (เช่น lead → Lead)
          await this.importModule(type, file); // เรียกนำเข้าโมดูลที่สอดคล้องกับไฟล์
        }
        alert("✅ นำเข้าข้อมูลทั้งหมดเรียบร้อยแล้ว"); // แจ้งสำเร็จเมื่อทำครบทั้งหมด
      };
      input.click(); // เปิด dialog ให้เลือกไฟล์
    } catch (err) {
      // ดักจับความผิดพลาด
      console.error("❌ handleImportAll() ล้มเหลว:", err); // แสดง error
      alert("❌ ไม่สามารถนำเข้าข้อมูลทั้งหมดได้"); // แจ้งผู้ใช้
    }
  },

  // ----------------------------------------------------
  // 📦 importZipAll: นำเข้าข้อมูลทั้งหมดจาก ZIP เดียว (แตกไฟล์อัตโนมัติ)
  // ----------------------------------------------------
  async importZipAll() {
    try {
      // ครอบด้วย try/catch
      if (typeof JSZip === "undefined") {
        // ตรวจสอบ JSZip โหลดหรือยัง
        alert("⚠️ ต้องโหลด JSZip ก่อนใช้งาน importZipAll()"); // แจ้งเตือนหากไม่พร้อม
        return; // ยุติการทำงาน
      }
      const input = document.createElement("input"); // สร้าง input file
      input.type = "file"; // ตั้งชนิดเป็นไฟล์
      input.accept = ".zip"; // จำกัดให้เลือกเฉพาะไฟล์ ZIP
      input.onchange = async (e) => {
        // เมื่อผู้ใช้เลือกไฟล์แล้ว
        const file = e.target.files[0]; // ดึงไฟล์แรก
        if (!file) {
          // หากไม่ได้เลือกไฟล์
          alert("⚠️ ยังไม่ได้เลือกไฟล์ ZIP"); // แจ้งเตือน
          return; // ยุติการทำงาน
        }
        const zip = await JSZip.loadAsync(file); // โหลด ZIP เข้าเมมโมรี
        const required = [
          // รายชื่อไฟล์ที่จำเป็นต้องมีใน ZIP
          "lead.csv",
          "car.csv",
          "finance.csv",
          "log.csv",
          "report.csv",
          "settings.csv",
        ];
        for (const name of required) {
          // วนตรวจไฟล์ที่ต้องมี
          if (!zip.files[name]) {
            // ถ้าไม่มีไฟล์นี้ใน ZIP
            alert(`⚠️ ZIP นี้ขาดไฟล์: ${name}`); // แจ้งเตือนว่าขาดไฟล์
            return; // ยุติการทำงาน
          }
        }
        for (const name of required) {
          // วนแตกไฟล์และนำเข้า
          const text = await zip.files[name].async("string"); // อ่านเนื้อหาไฟล์ CSV เป็นสตริง
          const tmpFile = new File([text], name, { type: "text/csv" }); // สร้างวัตถุ File จำลองเพื่อใช้ workflow เดิม
          const base = name.split(".")[0]; // ตัดนามสกุลออกจากชื่อไฟล์
          const type = base.charAt(0).toUpperCase() + base.slice(1); // แปลงเป็นชื่อโมดูล (เช่น lead → Lead)
          await this.importModule(type, tmpFile); // นำเข้าข้อมูลของโมดูลนั้น
        }
        alert("✅ นำเข้าข้อมูลทั้งหมดจาก ZIP สำเร็จแล้ว"); // แจ้งสำเร็จเมื่อทำครบ
      };
      input.click(); // เปิด dialog ให้เลือกไฟล์ ZIP
    } catch (err) {
      // ดักจับความผิดพลาด
      console.error("❌ importZipAll() ล้มเหลว:", err); // แสดง error
      alert("❌ ไม่สามารถนำเข้าข้อมูล ZIP ได้"); // แจ้งผู้ใช้
    }
  },
};

// --------------------------------------------------------
// ✅ เปิดใช้งานได้ทั่วระบบ (ทำให้โมดูลนี้เข้าถึงได้ผ่าน window.AppApi)
// --------------------------------------------------------
window.AppApi = AppApi; // ผูกอ็อบเจกต์ AppApi เข้ากับ window เพื่อให้เรียกใช้จากไฟล์อื่นง่าย
