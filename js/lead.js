// js/lead.js
// --------------------------------------------------------
// 👤 Lead App (Business Logic สำหรับลูกค้า)
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

    // 📥 Load: ดึงข้อมูลทั้งหมด (แก้ไข: Deferred Self-Healing แบบ Safe Patch)
    async loadAll() {
      try {
        // 1. READ ONLY: ดึงข้อมูลทั้งหมด (เร็วที่สุด)
        const items = await global.Repository.leads.getAll();
        const itemsToUpdate = [];

        // 2. COMPUTE: ตรวจสอบและเติม _searchIndex ใน Memory
        if (global.Utils && global.Utils.generateSearchIndex) {
          items.forEach((lead) => {
            if (!lead._searchIndex) {
              lead._searchIndex = global.Utils.generateSearchIndex(lead);
              itemsToUpdate.push(lead); // เก็บเข้าคิวเฉพาะ index ที่หายไป
            }
          });
        }

        // 3. UI RENDER: แสดงผลทันที (ห้ามรอ Write)
        if (global.Utils?.storeSetItems) {
          global.Utils.storeSetItems("Lead", items);
        }

        // 4. DEFERRED WRITE: Fire-and-forget (Safe Patching)
        // ใช้ setTimeout เพื่อผลักงานไปทำหลัง Main Thread ว่าง และ App Mount เสร็จแล้ว
        if (itemsToUpdate.length > 0) {
          console.log(
            `🛠️ LeadApp: Scheduled self-healing for ${itemsToUpdate.length} items (Deferred)...`
          );

          setTimeout(async () => {
            try {
              // ✅ FIX: เปลี่ยนจาก bulkUpdate (Overwrite) เป็นการวนลูป Patch ทีละรายการ
              // เพื่อให้แน่ใจว่าเราอัปเดตเฉพาะ _searchIndex และไม่ไปทับข้อมูลที่ User อาจกำลังแก้ไขอยู่
              if (global.Repository?.leads?.update) {
                for (const item of itemsToUpdate) {
                  // ส่งไป update แค่ id และ _searchIndex เท่านั้น (Partial Update)
                  await global.Repository.leads.update(item.id, {
                    _searchIndex: item._searchIndex,
                  });
                }
                console.log("✅ LeadApp: Self-healing complete (Safe Patch).");
              }
            } catch (err) {
              console.warn(
                "⚠️ LeadApp: Self-healing write skipped (Non-critical):",
                err
              );
            }
          }, 2000); // หน่วง 2 วินาที
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
        const dataToSave = {
          ...src,
          createDate: new Date().toLocaleDateString("th-TH"),
        };

        if (global.Utils?.generateSearchIndex) {
          dataToSave._searchIndex =
            global.Utils.generateSearchIndex(dataToSave);
        }

        const newId = await global.Repository.leads.create(dataToSave);
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

    // 📝 Update: แก้ไขข้อมูล
    async update() {
      try {
        if (!LeadApp.form.id) return;

        const updatedData = { ...LeadApp.form };

        if (global.Utils?.generateSearchIndex) {
          updatedData._searchIndex =
            global.Utils.generateSearchIndex(updatedData);
        }

        await global.Repository.leads.update(LeadApp.form.id, updatedData);

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

    // 🗑️ Delete: ลบข้อมูล
    async delete(id) {
      try {
        if (!confirm("ยืนยันการลบข้อมูลนี้?")) return;

        await global.Repository.leads.delete(id);

        if (global.Store && global.Store.data.leadItems) {
          const list = global.Store.data.leadItems;
          const index = list.findIndex((item) => item.id === id);

          if (index !== -1) {
            list.splice(index, 1);
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
      Object.assign(LeadApp.form, lead);

      if (!Array.isArray(LeadApp.form.contracts)) {
        LeadApp.form.contracts = [];
      }

      if (global.AppGui) {
        global.AppGui.openLeadModal();
      }
    },

    // Wrapper Functions
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
