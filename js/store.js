// store.js
// --------------------------------------------------------
// 📘 ไฟล์นี้ใช้เก็บข้อมูลหลักของระบบ (Store)
// เช่น รายการลีด, หัวตาราง, และค่าตั้งต้นต่าง ๆ
// --------------------------------------------------------

const Store = Vue.reactive({
  // ----------------------------------------------------
  // 🧾 กำหนดหัวตารางข้อมูลของ Lead
  // ----------------------------------------------------
  leadHeaders: [
    { title: "ID", align: "start", key: "id" },
    { title: "ชื่อลูกค้า", align: "start", key: "customerName" },
    { title: "สถานะ", align: "start", key: "status" },
    { title: "เบอร์ติดต่อ", align: "start", key: "contactNo" },
    { title: "รถยนต์", align: "start", key: "vehicle" },
    { title: "วันที่สร้าง", align: "start", key: "dateCreated" },
    { title: "จัดการ", align: "center", key: "actions", sortable: false },
  ],

  // ----------------------------------------------------
  // 📋 รายการ Lead ทั้งหมด
  // ----------------------------------------------------
  leadItems: [], // เริ่มต้นเป็นค่าว่าง (จะโหลดจาก Local Storage)
});

// --------------------------------------------------------
// 🧠 ฟังก์ชันช่วย: โหลดข้อมูลจาก Local Storage
// --------------------------------------------------------
function loadLeadsFromStorage() {
  try {
    // ดึงข้อมูลจาก localStorage ตาม key ที่กำหนด
    const saved = localStorage.getItem("leadItems");
    if (saved) {
      // ถ้ามีข้อมูล → แปลงกลับเป็น object แล้วใส่ลงใน Store
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        Store.leadItems.splice(0, Store.leadItems.length, ...parsed); // อัปเดตค่าทั้งหมดใน reactive array
      }
    } else {
      // ถ้าไม่มีข้อมูล → สร้างข้อมูลตัวอย่างเริ่มต้น
      Store.leadItems.push(
        {
          id: 1,
          customerName: "John Doe",
          status: "Active",
          contactNo: "123-456-7890",
          vehicle: "Toyota Camry",
          dateCreated: "2025-11-01",
        },
        {
          id: 2,
          customerName: "Jane Smith",
          status: "Inactive",
          contactNo: "987-654-3210",
          vehicle: "Honda Civic",
          dateCreated: "2025-11-02",
        }
      );
    }
  } catch (err) {
    console.error("โหลดข้อมูลจาก Local Storage ไม่สำเร็จ:", err);
  }
}

// --------------------------------------------------------
// 💾 ฟังก์ชันช่วย: บันทึกข้อมูลลง Local Storage
// --------------------------------------------------------
function saveLeadsToStorage() {
  try {
    // แปลง array เป็น string แล้วบันทึกลง localStorage
    localStorage.setItem("leadItems", JSON.stringify(Store.leadItems));
  } catch (err) {
    console.error("บันทึกข้อมูลลง Local Storage ไม่สำเร็จ:", err);
  }
}

// --------------------------------------------------------
// 👀 Watcher: เมื่อ leadItems มีการเปลี่ยนแปลง → บันทึกอัตโนมัติ
// --------------------------------------------------------
Vue.watch(
  () => Store.leadItems, // ตัวที่เฝ้าดู (reactive)
  () => {
    saveLeadsToStorage(); // เมื่อเปลี่ยน → เรียกฟังก์ชันบันทึก
  },
  { deep: true } // ต้องใช้ deep เพราะ leadItems เป็น array ของ object
);

// --------------------------------------------------------
// 🚀 เรียกโหลดข้อมูลจาก Local Storage ทันทีเมื่อเริ่มต้นระบบ
// --------------------------------------------------------
loadLeadsFromStorage();

// --------------------------------------------------------
// ✅ เผย Store ออกสู่ Global เพื่อให้ไฟล์อื่นเรียกใช้ได้
// --------------------------------------------------------
window.Store = Store;
