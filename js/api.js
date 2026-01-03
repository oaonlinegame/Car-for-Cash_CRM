// js/api.js
// --------------------------------------------------------
// 🌐 API Interface (ส่วนต่อประสานสำหรับรับ-ส่งข้อมูลผ่าน Network)
// --------------------------------------------------------
// หน้าที่: จัดการ HTTP Request (GET, POST, PUT, DELETE)
// หมายเหตุ: ปัจจุบันเป็นเพียงโครงร่าง (Stub) สำหรับรองรับการเชื่อมต่อ Server ในอนาคต
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppApi = {
    // Config สำหรับ API Endpoint (ตัวอย่าง)
    baseUrl: "",
    headers: {
      "Content-Type": "application/json",
    },

    /**
     * ส่งคำขอข้อมูล (GET)
     * @param {string} endpoint - URL ปลายทาง
     */
    async get(endpoint) {
      console.log(`🌐 API GET: ${endpoint}`);
      // return fetch(this.baseUrl + endpoint); // รอ Implement จริง
      return Promise.resolve(null);
    },

    /**
     * ส่งข้อมูลไปบันทึก (POST)
     * @param {string} endpoint - URL ปลายทาง
     * @param {object} data - ข้อมูลที่จะส่ง
     */
    async post(endpoint, data) {
      console.log(`🌐 API POST: ${endpoint}`, data);
      // return fetch(this.baseUrl + endpoint, { method: 'POST', body: JSON.stringify(data) });
      return Promise.resolve({ success: true });
    },

    // สามารถเพิ่ม PUT, DELETE, PATCH ได้ตามต้องการ
  };

  global.AppApi = AppApi;
})(window);
