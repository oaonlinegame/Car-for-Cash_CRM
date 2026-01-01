// js/api.js
// --------------------------------------------------------
// 🌐 API Interface (ช่องทางเชื่อมต่อโลกภายนอก)
// --------------------------------------------------------
// Concept: ทำตัวเหมือน "Axios" สำหรับระบบ Offline
// หน้าที่: รับผิดชอบการ ส่งข้อมูลออก (Download) และ รับเข้า (Upload)
// ❌ ห้ามมี Logic แปลงข้อมูล (CSV/VCF) ให้ไปทำที่ DataExchange
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppApi = {
    // ----------------------------------------------------
    // 📤 SEND / POST (ส่งข้อมูลออกไปภายนอก -> Download)
    // ----------------------------------------------------
    /**
     * ส่งไฟล์ให้ผู้ใช้ดาวน์โหลด
     * @param {string} filename - ชื่อไฟล์รวมนามสกุล
     * @param {Blob|string} content - เนื้อหาไฟล์
     * @param {string} mimeType - ประเภทไฟล์ (เช่น 'text/csv')
     */
    send(filename, content, mimeType = "text/plain") {
      if (!global.FileSystem) {
        console.error("❌ AppApi: ไม่พบ FileSystem");
        return;
      }

      console.log(`🌐 AppApi: Sending file "${filename}"...`);
      global.FileSystem.download(filename, content, mimeType);
    },

    // ----------------------------------------------------
    // 📥 GET / FETCH (ดึงข้อมูลจากภายนอก -> Upload)
    // ----------------------------------------------------
    /**
     * ขอให้ผู้ใช้เลือกไฟล์ (เหมือนเปิด File Picker)
     * @param {string} accept - นามสกุลที่ยอมรับ (เช่น '.json, .csv')
     * @returns {Promise<File>}
     */
    fetch(accept = "*") {
      return new Promise((resolve, reject) => {
        if (!global.FileSystem) {
          reject("❌ AppApi: ไม่พบ FileSystem");
          return;
        }

        global.FileSystem.openFilePicker(accept, (file) => {
          if (file) {
            console.log(`🌐 AppApi: Received file "${file.name}"`);
            resolve(file);
          } else {
            reject("User cancelled");
          }
        });
      });
    },
  };

  global.AppApi = AppApi;
})(window);
