// store.js
// --------------------------------------------------------
// 📘 โครงสร้างใหม่แบบรวมทุกฟังก์ชันอยู่ในอ็อบเจกต์ Store เดียว
// --------------------------------------------------------

const Store = {
  // ----------------------------------------------------
  // 🗂️ ข้อมูลหลักของระบบ (Reactive)
  // ----------------------------------------------------
  data: Vue.reactive({
    leadHeaders: [
      { title: "ID", align: "start", key: "id" },
      { title: "ชื่อลูกค้า", align: "start", key: "customerName" },
      { title: "สถานะ", align: "start", key: "status" },
      { title: "เบอร์ติดต่อ", align: "start", key: "contactNo" },
      { title: "รถยนต์", align: "start", key: "vehicle" },
      { title: "วันที่สร้าง", align: "start", key: "dateCreated" },
      { title: "จัดการ", align: "center", key: "actions", sortable: false },
    ],
    leadItems: [], // รายการ lead ทั้งหมด
  }),

  // ----------------------------------------------------
  // 💾 โหลดข้อมูลจาก Local Storage
  // ----------------------------------------------------
  loadLeadsFromStorage() {
    try {
      const saved = localStorage.getItem("leadItems");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.data.leadItems.splice(0, this.data.leadItems.length, ...parsed);
        }
      } else {
        // ถ้าไม่มีข้อมูล → สร้างข้อมูลตัวอย่าง
        this.data.leadItems.push(
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
      console.error("❌ โหลดข้อมูลจาก Local Storage ไม่สำเร็จ:", err);
    }
  },

  // ----------------------------------------------------
  // 💾 บันทึกข้อมูลลง Local Storage
  // ----------------------------------------------------
  saveLeadsToStorage() {
    try {
      localStorage.setItem("leadItems", JSON.stringify(this.data.leadItems));
    } catch (err) {
      console.error("❌ บันทึกข้อมูลลง Local Storage ไม่สำเร็จ:", err);
    }
  },

  // ----------------------------------------------------
  // 🧹 เคลียร์ข้อมูล Local Storage และรีโหลดใหม่
  // ----------------------------------------------------
  clearLeadStorage() {
    localStorage.removeItem("leadItems");
    console.log("🧹 ล้างข้อมูล leadItems แล้ว!");
    this.data.leadItems.splice(0); // ล้างข้อมูลปัจจุบัน
    this.loadLeadsFromStorage(); // โหลดตัวอย่างใหม่
  },
};

// --------------------------------------------------------
// 👀 Watcher: ถ้ามีการเปลี่ยนแปลงใน leadItems → บันทึกอัตโนมัติ
// --------------------------------------------------------
Vue.watch(
  () => Store.data.leadItems,
  () => Store.saveLeadsToStorage(),
  { deep: true }
);

// --------------------------------------------------------
// 🚀 โหลดข้อมูลทันทีตอนเริ่มต้นระบบ
// --------------------------------------------------------
Store.loadLeadsFromStorage();

// --------------------------------------------------------
// ✅ เปิดใช้งานได้จากทุกไฟล์
// --------------------------------------------------------
window.Store = Store;
