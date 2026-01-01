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

    // 📥 Load: ดึงข้อมูลทั้งหมด (แก้ไข)
    async loadAll() {
      try {
        const items = await global.Repository.leads.getAll();

        // ✅ [PERFORMANCE FIX] Hydration Loop
        // เติม _searchIndex ให้ข้อมูลทุกตัวใน Memory ทันทีที่โหลดเสร็จ
        // ทำให้ข้อมูลเก่าใน DB ที่ยังไม่มีฟิลด์นี้ สามารถค้นหาได้เร็วทันที
        if (global.Utils && global.Utils.generateSearchIndex) {
          items.forEach((lead) => {
            if (!lead._searchIndex) {
              lead._searchIndex = global.Utils.generateSearchIndex(lead);
            }
          });
        }

        if (global.Utils?.storeSetItems) {
          global.Utils.storeSetItems("Lead", items);
        }
      } catch (err) {
        console.error("❌ Load Error:", err);
        global.AppNotifications?.show("โหลดข้อมูลไม่สำเร็จ");
      }
    },

    // ➕ Add: เพิ่มข้อมูลใหม่ (แก้ไข)
    async add(formData) {
      try {
        const src = formData || LeadApp.form;
        const dataToSave = {
          ...src,
          createDate: new Date().toLocaleDateString("th-TH"), // (เดี๋ยวค่อยแก้เรื่อง Date ในหัวข้อถัดไป)
        };

        // ✅ สร้าง Search Index ก่อนบันทึกลง DB
        if (global.Utils?.generateSearchIndex) {
          dataToSave._searchIndex =
            global.Utils.generateSearchIndex(dataToSave);
        }

        const newId = await global.Repository.leads.create(dataToSave);

        // อัปเดต Store (ต้องมี _searchIndex ด้วย)
        const itemForStore = { ...dataToSave, id: newId };

        if (global.Store && global.Store.data.leadItems) {
          global.Store.data.leadItems.push(Object.freeze(itemForStore));
        }

        LeadApp.resetLeadForm();
        global.AppNotifications?.show("✅ บันทึกข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ บันทึกไม่สำเร็จ: " + err.message);
      }
    },

    // 📝 Update: แก้ไขข้อมูล (แก้ไข)
    async update() {
      try {
        if (!LeadApp.form.id) return;

        const updatedData = { ...LeadApp.form };

        // ✅ คำนวณ Search Index ใหม่ เพราะข้อมูล (เช่น ชื่อ/สถานะ) อาจเปลี่ยนไป
        if (global.Utils?.generateSearchIndex) {
          updatedData._searchIndex =
            global.Utils.generateSearchIndex(updatedData);
        }

        await global.Repository.leads.update(LeadApp.form.id, updatedData);

        // อัปเดต Store
        if (global.Store && global.Store.data.leadItems) {
          const list = global.Store.data.leadItems;
          const index = list.findIndex((item) => item.id === updatedData.id);
          if (index !== -1) {
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
