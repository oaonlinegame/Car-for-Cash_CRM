// ไฟล์นี้ใช้จัดการ API ต่าง ๆ ที่แอปพลิเคชันต้องติดต่อสื่อสารกับเซิร์ฟเวอร์หรือบริการภายนอก หรือ import export csv json xml เป็นต้น เพื่อใช้งานร่วมกับข้อมูลภายนอก และเก็บข้อมูลที่ได้รับมาในรูปแบบที่เหมาะสมกับการใช้งานภายในแอปพลิเคชัน
const AppApi = {
  async fetchLeads() {
    console.log("ดึงข้อมูลลีดจาก API...");
  },
  exportCSV() {
    console.log("Export CSV...");
  },
  importCSV() {
    console.log("Import CSV...");
  },
};
window.AppApi = AppApi;
