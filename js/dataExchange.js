// js/dataExchange.js
// --------------------------------------------------------
// 🔄 Data Exchange Service (บริการแลกเปลี่ยนข้อมูล)
// --------------------------------------------------------
// หน้าที่:
// 1. ดึงข้อมูลจาก Repository
// 2. แปลงข้อมูล (JSON <-> CSV/VCF)
// 3. เรียก FileSystem เพื่อ Save/Load ไฟล์โดยตรง
// --------------------------------------------------------

(function (global) {
  "use strict";

  const DataExchange = {
    // ----------------------------------------------------
    // 📤 EXPORT FEATURE
    // ----------------------------------------------------
    async exportLeadsCSV() {
      try {
        // 1. ดึงข้อมูล
        const leads = await global.Repository.leads.getAll();
        if (leads.length === 0) {
          global.AppNotifications?.show("ไม่มีข้อมูลให้ส่งออก");
          return;
        }

        // 2. แปลงเป็น CSV
        const headers = ["ID", "ชื่อ", "เบอร์โทร", "สถานะ"];
        const rows = leads.map((l) => [
          l.id,
          `"${l.firstName} ${l.nickName || ""}"`,
          `"${l.phones}"`,
          l.status,
        ]);

        const csvContent = [
          headers.join(","),
          ...rows.map((r) => r.join(",")),
        ].join("\n");

        // 3. ส่งให้ FileSystem โดยตรง (Direct I/O)
        if (global.FileSystem) {
          global.FileSystem.download(
            "leads_export.csv",
            "\uFEFF" + csvContent,
            "text/csv"
          );
          global.AppNotifications?.show("ส่งออก CSV สำเร็จ");
        } else {
          console.error("❌ DataExchange: ไม่พบ FileSystem");
        }
      } catch (err) {
        console.error("Export Error:", err);
        global.AppNotifications?.error("เกิดข้อผิดพลาดในการส่งออก");
      }
    },

    // ----------------------------------------------------
    // 📥 IMPORT FEATURE
    // ----------------------------------------------------
    async importLeads() {
      try {
        if (!global.FileSystem) {
          throw new Error("ไม่พบ FileSystem Module");
        }

        // 1. เรียก File Picker (จัดการ Promise Wrapper เองที่นี่)
        const file = await new Promise((resolve, reject) => {
          global.FileSystem.openFilePicker(".json, .csv", (selectedFile) => {
            if (selectedFile) resolve(selectedFile);
            else reject("User Cancelled");
          });
        });

        // 2. อ่านและแปลงข้อมูล
        const text = await global.FileSystem.readAsText(file);
        let data;

        // ตรวจสอบนามสกุลไฟล์เพื่อเลือกวิธี Parse (รองรับทั้ง JSON และ CSV ในอนาคต)
        if (file.name.endsWith(".csv")) {
          // TODO: เพิ่ม Logic CSV Parse ตรงนี้ถ้าจำเป็น
          console.warn(
            "CSV Import logic is not implemented yet, trying JSON..."
          );
          data = JSON.parse(text);
        } else {
          data = JSON.parse(text);
        }

        // 3. บันทึกลง DB
        if (Array.isArray(data)) {
          for (const item of data) {
            await global.Repository.leads.create(item);
          }
        }

        global.AppNotifications?.show(
          `นำเข้าข้อมูล ${data.length} รายการสำเร็จ`
        );

        // Refresh หน้าจอ
        if (global.LeadApp) global.LeadApp.loadAll();
      } catch (err) {
        if (err !== "User Cancelled") {
          console.error("Import Error:", err);
          global.AppNotifications?.error("นำเข้าข้อมูลล้มเหลว");
        }
      }
    },
  };

  global.DataExchange = DataExchange;
})(window);
