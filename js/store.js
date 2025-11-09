// store.js
// --------------------------------------------------------
// 📘 โครงสร้างใหม่แบบรวมทุกฟังก์ชันอยู่ในอ็อบเจกต์ Store เดียว
// --------------------------------------------------------

const Store = {
  // ----------------------------------------------------
  // 🗂️ ข้อมูลหลักของระบบ (Reactive)
  // ----------------------------------------------------
  data: Vue.reactive({
    leadHeaders: [], // หัวตารางของข้อมูล lead ที่เก็บเป็น array เก็บลง csv ไฟล์ใช้ตอน import/export
    leadItems: [], // รายการ lead ทั้งหมด
  }),

  // --------------------------------------------------------
  // 💾 โหลดข้อมูลจาก Local Storage
  // --------------------------------------------------------
  loadLeadsFromStorage() {
    try {
      const saved = localStorage.getItem("leadItems"); // 🔹 ดึงข้อมูลจาก storage
      if (saved) {
        const parsed = JSON.parse(saved); // 🔹 แปลง string → object
        if (Array.isArray(parsed)) {
          // 🔹 ล้างของเก่าแล้วใส่ข้อมูลใหม่
          this.data.leadItems.splice(0, this.data.leadItems.length, ...parsed);
          console.log("🔄 โหลดข้อมูล lead จาก Local Storage เรียบร้อยแล้ว");
        }
      } else {
        // 🔹 ถ้ายังไม่มีข้อมูล → สร้างข้อมูลตัวอย่างใหม่
        this.data.leadItems.splice(0); // ล้างของเก่า
        // เพิ่มข้อมูลตัวอย่าง
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
        console.log(
          "📦 ไม่มีข้อมูลใน Local Storage — สร้างข้อมูลตัวอย่างใหม่แล้ว"
        );
      }
    } catch (err) {
      console.error("❌ โหลดข้อมูลจาก Local Storage ไม่สำเร็จ:", err);
    }
  },

  // --------------------------------------------------------
  // 🧹 เคลียร์ข้อมูลใน Local Storage และรีโหลดใหม่
  // --------------------------------------------------------
  clearLeadStorage() {
    try {
      // 🔹 ลบข้อมูลใน localStorage ออกทั้งหมด
      localStorage.removeItem("leadItems");
      console.log("🧹 เคลียร์ข้อมูล leadItems ใน Local Storage เรียบร้อยแล้ว!");

      // 🔹 ล้างข้อมูลใน Store ปัจจุบัน
      this.data.leadItems.splice(0);

      // 🔹 โหลดข้อมูลตัวอย่างใหม่เข้าระบบ
      this.loadLeadsFromStorage();

      // 🔹 รีเฟรชหน้าเว็บเพื่อให้ Vue อัปเดต UI
      location.reload();
    } catch (err) {
      console.error("❌ ไม่สามารถเคลียร์ Local Storage ได้:", err);
    }
  },

  // --------------------------------------------------------
  // 💾 บันทึกข้อมูลลง Local Storage
  // --------------------------------------------------------
  saveLeadsToStorage() {
    try {
      localStorage.setItem("leadItems", JSON.stringify(this.data.leadItems)); // 🔹 แปลงและบันทึกข้อมูล
      console.log("💾 บันทึกข้อมูล leadItems ลง Local Storage แล้ว");
    } catch (err) {
      console.error("❌ บันทึกข้อมูลลง Local Storage ไม่สำเร็จ:", err);
    }
  },

  // --------------------------------------------------------
  // 🧹 เคลียร์ข้อมูลใน Local Storage และรีโหลดใหม่
  // --------------------------------------------------------
  clearLeadStorage() {
    try {
      // 🔹 ลบข้อมูลใน localStorage ออกทั้งหมด
      localStorage.removeItem("leadItems");
      console.log("🧹 เคลียร์ข้อมูล leadItems ใน Local Storage เรียบร้อยแล้ว!");

      // 🔹 ล้างข้อมูลใน Store ปัจจุบัน
      this.data.leadItems.splice(0);

      // 🔹 โหลดข้อมูลตัวอย่างใหม่เข้าระบบ
      this.loadLeadsFromStorage();

      // 🔹 รีเฟรชหน้าเว็บเพื่อให้ Vue อัปเดต UI
      location.reload();
    } catch (err) {
      console.error("❌ ไม่สามารถเคลียร์ Local Storage ได้:", err);
    }
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
