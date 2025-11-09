// ไฟล์นี้ใช้จัดการการแจ้งเตือนภายในแอปพลิเคชัน เช่น การแสดงข้อความแจ้งเตือนเมื่อมีเหตุการณ์สำคัญเกิดขึ้น
const AppNotifications = {
  show(msg) {
    console.log("🔔 แจ้งเตือน:", msg);
  },
};
window.AppNotifications = AppNotifications;
