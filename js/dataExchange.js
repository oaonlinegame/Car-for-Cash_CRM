// js/dataExchange.js
// --------------------------------------------------------
// 🔄 Data Exchange Service (บริการแลกเปลี่ยนข้อมูล)
// --------------------------------------------------------
// หน้าที่:
// 1. ดึงข้อมูลจาก Repository
// 2. แปลงข้อมูล (JSON <-> CSV/VCF)
// 3. เรียก AppApi เพื่อส่งออก
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

        // 2. แปลงเป็น CSV (Logic การแปลงอยู่ที่นี่)
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

        // 3. ส่งให้ AppApi (เหมือน Axios.post)
        // "BOM" (\uFEFF) ช่วยให้ Excel อ่านภาษาไทยออก
        global.AppApi.send(
          "leads_export.csv",
          "\uFEFF" + csvContent,
          "text/csv"
        );

        global.AppNotifications?.show("ส่งออก CSV สำเร็จ");
      } catch (err) {
        console.error("Export Error:", err);
      }
    },

    // ----------------------------------------------------
    // 📥 IMPORT FEATURE
    // ----------------------------------------------------
    async importLeads() {
      try {
        // 1. เรียก AppApi ขอไฟล์ (เหมือน Axios.get)
        const file = await global.AppApi.fetch(".json, .csv");

        // 2. อ่านและแปลงข้อมูล
        const text = await global.FileSystem.readAsText(file);
        const data = JSON.parse(text); // สมมติว่าเป็น JSON

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
        console.error("Import Error:", err);
        global.AppNotifications?.error("นำเข้าข้อมูลล้มเหลว");
      }
    },
  };

  global.DataExchange = DataExchange;
})(window);
