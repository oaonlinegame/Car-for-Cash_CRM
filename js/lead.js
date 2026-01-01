// js/lead.js
// --------------------------------------------------------
// 👤 Lead App (Business Logic สำหรับลูกค้า)
// --------------------------------------------------------
// ✅ Refactored:
// 1. Incremental Update: อัปเดต Store ทันทีหลังบันทึก (O(1)) ไม่โหลดใหม่ (O(N))
// 2. Direct State Mutation: จัดการข้อมูลใน Store โดยตรงเพื่อให้ UI ลื่นไหล
// --------------------------------------------------------

(function (global) {
  "use strict";

  const LeadApp = {
    // ผูกข้อมูลกับ DataSpec
    form: Vue.reactive(global.DataSpec.Lead.createDefault()),

    // --- Helper Methods ---
    resetLeadForm() {
      const empty = global.DataSpec.Lead.createDefault();
      Object.assign(LeadApp.form, empty);
    },

    resetNewContractForm() {
      if (global.ContractApp) global.ContractApp.resetNewForm();
    },

    addEmptyContract() {
      if (global.ContractApp) global.ContractApp.addEmpty(LeadApp.form);
    },

    // --- Core Actions (CRUD) ---

    // 📥 Load: ดึงข้อมูลทั้งหมดจาก DB ลง Store (ใช้เฉพาะตอนเปิดแอพ หรือ Refresh)
    async loadAll() {
      try {
        const items = await global.Repository.leads.getAll();
        // ใช้ Utils ช่วยจัดการ Store (Freeze Object เพื่อ Performance)
        if (global.Utils?.storeSetItems) {
          global.Utils.storeSetItems("Lead", items);
        }
      } catch (err) {
        console.error("❌ Load Error:", err);
        global.AppNotifications?.show("โหลดข้อมูลไม่สำเร็จ");
      }
    },

    // ➕ Add: เพิ่มข้อมูลใหม่ (Incremental Update)
    async add(formData) {
      try {
        const src = formData || LeadApp.form;
        // สร้าง Data Object พร้อมวันที่
        const dataToSave = {
          ...src,
          createDate: new Date().toLocaleDateString("th-TH"), // ใช้วันที่แบบไทยให้เหมือน DataSpec
        };

        // 1. บันทึกลง DB และรอรับ ID กลับมา (สำคัญมาก)
        const newId = await global.Repository.leads.create(dataToSave);

        // 2. อัปเดต Store ทันที (ไม่ต้องโหลดใหม่)
        // ต้องใส่ ID ที่ได้จาก DB กลับเข้าไปใน Object ก่อนโชว์
        const itemForStore = { ...dataToSave, id: newId };

        // Push ใส่ Store (ต้อง Freeze ตามมาตรฐาน Utils)
        if (global.Store && global.Store.data.leadItems) {
          global.Store.data.leadItems.push(Object.freeze(itemForStore));
        }

        // 3. Reset ฟอร์มและแจ้งเตือน
        LeadApp.resetLeadForm();
        global.AppNotifications?.show("✅ บันทึกข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ บันทึกไม่สำเร็จ: " + err.message);
      }
    },

    // 📝 Update: แก้ไขข้อมูล (Incremental Update)
    async update() {
      try {
        if (!LeadApp.form.id) return;

        // Clone ข้อมูลจาก Form
        const updatedData = { ...LeadApp.form };

        // 1. สั่ง DB อัปเดต
        await global.Repository.leads.update(LeadApp.form.id, updatedData);

        // 2. อัปเดต Store ทันที (In-place Replacement)
        if (global.Store && global.Store.data.leadItems) {
          const list = global.Store.data.leadItems;
          const index = list.findIndex((item) => item.id === updatedData.id);

          if (index !== -1) {
            // เปลี่ยน Object ใหม่ลงไปในตำแหน่งเดิม (Freeze ด้วย)
            list[index] = Object.freeze(updatedData);
          }
        }

        global.AppNotifications?.show("✅ แก้ไขข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ แก้ไขไม่สำเร็จ");
      }
    },

    // 🗑️ Delete: ลบข้อมูล (Incremental Update)
    async delete(id) {
      try {
        if (!confirm("ยืนยันการลบข้อมูลนี้?")) return;

        // 1. สั่ง DB ลบ
        await global.Repository.leads.delete(id);

        // 2. ลบออกจาก Store ทันที
        if (global.Store && global.Store.data.leadItems) {
          const list = global.Store.data.leadItems;
          const index = list.findIndex((item) => item.id === id);

          if (index !== -1) {
            list.splice(index, 1); // ตัดออกจาก Array
          }
        }

        global.AppNotifications?.show("🗑️ ลบข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ ลบไม่สำเร็จ");
      }
    },

    // ✏️ Open Edit: เปิดหน้าแก้ไข
    openEdit(lead) {
      if (!lead) return;

      // Copy ข้อมูลลงฟอร์ม
      Object.assign(LeadApp.form, lead);

      if (!Array.isArray(LeadApp.form.contracts)) {
        LeadApp.form.contracts = [];
      }

      // ✅ Correct Architecture: เรียกผ่าน AppGui Action
      if (global.AppGui) {
        global.AppGui.openLeadModal();
      }
    },

    // Wrapper Functions (สำหรับ Binding ใน Template)
    addLead(f) {
      return LeadApp.add(f);
    },
    updateLead() {
      return LeadApp.update();
    },
    deleteLead(id) {
      return LeadApp.delete(id);
    },
  };

  global.LeadApp = LeadApp;
})(window);
