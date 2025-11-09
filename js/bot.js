// bot.js
// ไฟล์นี่ใช้เพื่อจัดการการทำงานแบบอันโนมัติในการ กรอกข้อมูล หรือ ดึงข้อมูลจาก API ต่าง ๆ
const AppBot = {
  autoFill() {
    console.log("กรอกข้อมูลอัตโนมัติ...");
  },
  fetchAutoData() {
    console.log("ดึงข้อมูลจากระบบอัตโนมัติ...");
  },
};
window.AppBot = AppBot;
