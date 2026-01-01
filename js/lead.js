// js/lead.js
// --------------------------------------------------------
// 👤 Lead App (Business Logic สำหรับลูกค้า)
// --------------------------------------------------------
// ✅ Refactored:
// 1. Single Source of Truth: โหลดข้อมูลจาก DB ใหม่เสมอหลัง Save/Update
// 2. Direct State Mutation: คุม UI ผ่าน AppState โดยตรง (เลิกใช้ Event Bus)
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

    // 📥 Load: ดึงข้อมูลทั้งหมดจาก DB ลง Store
    async loadAll() {
      try {
        const items = await global.Repository.leads.getAll();
        // ใช้ Utils ช่วยจัดการ Store อย่างถูกต้อง
        if (global.Utils?.storeSetItems) {
          global.Utils.storeSetItems("Lead", items);
        }
      } catch (err) {
        console.error("❌ Load Error:", err);
        global.AppNotifications?.show("โหลดข้อมูลไม่สำเร็จ");
      }
    },

    // ➕ Add: เพิ่มข้อมูลใหม่
    async add(formData) {
      try {
        const src = formData || LeadApp.form;
        // สร้าง Data Object พร้อมวันที่
        const dataToSave = {
          ...src,
          createDate: new Date().toISOString().slice(0, 10),
        };

        // 1. บันทึกลง DB (Source of Truth ที่แท้จริง)
        await global.Repository.leads.create(dataToSave);

        // 2. โหลดข้อมูลใหม่จาก DB เพื่อให้ Store อัปเดตตรงกัน (Consistency)
        // ⚠️ การ Push เองเสี่ยงข้อมูลไม่ตรงกัน จึงตัดออก
        await LeadApp.loadAll();

        // 3. Reset ฟอร์มและแจ้งเตือน
        LeadApp.resetLeadForm();
        global.AppNotifications?.show("✅ บันทึกข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ บันทึกไม่สำเร็จ: " + err.message);
      }
    },

    // 📝 Update: แก้ไขข้อมูล
    async update() {
      try {
        if (!LeadApp.form.id) return;
        const updatedData = { ...LeadApp.form };

        // 1. สั่ง DB อัปเดต
        await global.Repository.leads.update(LeadApp.form.id, updatedData);

        // 2. โหลดข้อมูลใหม่ (Sync ให้ตรงกัน)
        await LeadApp.loadAll();

        global.AppNotifications?.show("✅ แก้ไขข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ แก้ไขไม่สำเร็จ");
      }
    },

    // 🗑️ Delete: ลบข้อมูล
    async delete(id) {
      try {
        if (!confirm("ยืนยันการลบข้อมูลนี้?")) return;

        // 1. สั่ง DB ลบ
        await global.Repository.leads.delete(id);

        // 2. โหลดข้อมูลใหม่
        await LeadApp.loadAll();

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

      // ✅ ควบคุม UI ผ่าน State โดยตรง (ชัดเจนกว่า Event Bus)
      if (global.AppState) {
        global.AppState.isOpenModalLead.value = true;
      }
    },

    // Wrapper Functions (สำหรับ Binding ใน Template ถ้าจำเป็น)
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
