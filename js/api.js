// js/api.js
// --------------------------------------------------------
// 🌐 API Interface (ส่วนต่อประสานสำหรับรับ-ส่งข้อมูลภายนอก)
// --------------------------------------------------------
// โมดูลนี้ทำหน้าที่เป็น Abstraction Layer สำหรับการจัดการ Input/Output
// เปรียบเสมือน HTTP Client (เช่น Axios) แต่ทำงานกับ File System ภายใน Browser
// แยก Logic การเชื่อมต่อ (I/O) ออกจากการประมวลผลข้อมูล (Data Processing)
// เพื่อให้ส่วนอื่นๆ ของระบบไม่ต้องยุ่งเกี่ยวกับการจัดการ Blob หรือ File Picker โดยตรง
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppApi = {
    // ========================================================================
    // 1. DATA EXPORT (การส่งออกข้อมูล - Download)
    // ========================================================================

    /**
     * ส่งข้อมูลออกไปยังผู้ใช้งานในรูปแบบไฟล์ (Download)
     * ทำหน้าที่เป็น Wrapper ส่งต่อคำสั่งไปยัง FileSystem Driver
     *
     * @param {string} filename - ชื่อไฟล์ปลายทางพร้อมนามสกุล
     * @param {Blob|string} content - เนื้อหาข้อมูลดิบ (Raw Data)
     * @param {string} mimeType - ชนิดของข้อมูล (MIME Type) เพื่อระบุให้ Browser ทราบ
     */
    send(filename, content, mimeType = "text/plain") {
      // ตรวจสอบความพร้อมของ Driver (FileSystem) ก่อนดำเนินการ
      // ป้องกัน Runtime Error หากโมดูล FileSystem ยังไม่ถูกโหลดหรือมีปัญหา
      if (!global.FileSystem) {
        console.error("❌ AppApi: ไม่พบ FileSystem");
        return;
      }

      console.log(`🌐 AppApi: Sending file "${filename}"...`);

      // สั่งงาน Driver ให้สร้าง Blob และ Trigger การดาวน์โหลดที่ฝั่ง Browser
      global.FileSystem.download(filename, content, mimeType);
    },

    // ========================================================================
    // 2. DATA IMPORT (การนำเข้าข้อมูล - Upload)
    // ========================================================================

    /**
     * ร้องขอข้อมูลไฟล์จากผู้ใช้งาน (File Picker)
     * ใช้งาน Promise Pattern เพื่อจัดการผลลัพธ์แบบ Asynchronous
     *
     * @param {string} accept - รูปแบบไฟล์ที่ยอมรับ (File Extensions/MIME Types) เช่น '.json, .csv'
     * @returns {Promise<File>} คืนค่าเป็น File Object เมื่อผู้ใช้เลือกไฟล์สำเร็จ
     */
    fetch(accept = "*") {
      return new Promise((resolve, reject) => {
        // ตรวจสอบ Dependency ที่จำเป็น (FileSystem) เพื่อให้มั่นใจว่าสามารถเรียกใช้ File Picker ได้
        if (!global.FileSystem) {
          reject("❌ AppApi: ไม่พบ FileSystem");
          return;
        }

        // เรียกใช้ Driver เพื่อเปิดหน้าต่างเลือกไฟล์ของ Browser
        // โดยส่ง Callback Function เข้าไปเพื่อรอรับผลลัพธ์เมื่อผู้ใช้เลือกไฟล์เสร็จสิ้น
        global.FileSystem.openFilePicker(accept, (file) => {
          if (file) {
            console.log(`🌐 AppApi: Received file "${file.name}"`);
            // ส่งคืน File Object กลับไปยังผู้เรียกใช้ (Resolver) เพื่อนำไปอ่านข้อมูลต่อ
            resolve(file);
          } else {
            // กรณีผู้ใช้ปิดหน้าต่างเลือกไฟล์โดยไม่ได้เลือก หรือเกิดข้อผิดพลาด
            reject("User cancelled");
          }
        });
      });
    },
  };

  // ส่งออก AppApi เป็น Global Object เพื่อให้โมดูลอื่น (เช่น DataExchange) เรียกใช้งานได้
  global.AppApi = AppApi;
})(window);
