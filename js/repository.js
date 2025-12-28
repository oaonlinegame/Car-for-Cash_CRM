// js/repository.js
// --------------------------------------------------------
// 📘 Repository: ศูนย์กลางการจัดการข้อมูล (The Gatekeeper)
// --------------------------------------------------------
// หน้าที่:
// 1. จัดการ CRUD (Create, Read, Update, Delete) กับ AppDexie
// 2. เป็นจุดเดียวที่อนุญาตให้คุยกับ DB (Service อื่นห้ามข้ามหัว)
// 3. ทำหน้าที่เป็น Bridge ให้กับ Legacy Code
// --------------------------------------------------------

(function (global) {
  "use strict";

  // ตรวจสอบ DB Instance
  if (typeof global.AppDexie === "undefined") {
    console.error("❌ Repository Error: AppDexie not found.");
    return;
  }

  const db = global.AppDexie;

  // ========================================================
  // 🏗️ Main Repository
  // ========================================================
  const Repository = {
    // 1. Leads (ลูกค้า)
    leads: {
      async getAll() {
        // ดึงข้อมูลทั้งหมด (เรียงจากใหม่ไปเก่า)
        return await db.leads.reverse().toArray();
      },
      async getById(id) {
        return await db.leads.get(Number(id));
      },
      async add(data) {
        // เพิ่ม Timestamp อัตโนมัติถ้าไม่มี
        const payload = {
          ...data,
          createDate: data.createDate || new Date().toISOString(),
        };
        return await db.leads.add(payload);
      },
      async update(id, changes) {
        return await db.leads.update(Number(id), changes);
      },
      async delete(id) {
        return await db.leads.delete(Number(id));
      },
      async clear() {
        return await db.leads.clear();
      },
    },

    // 2. Settings (การตั้งค่า)
    settings: {
      async get(key) {
        const result = await db.settings.get(key);
        return result ? result.value : null;
      },
      async set(key, value) {
        return await db.settings.put({ key, value });
      },
      async delete(key) {
        return await db.settings.delete(key);
      },
    },

    // 3. Contracts (สัญญา)
    contracts: {
      async getAll() {
        return await db.contracts.reverse().toArray();
      },
      async getByLeadId(leadId) {
        return await db.contracts.where("leadId").equals(leadId).toArray();
      },
      async add(data) {
        return await db.contracts.add(data);
      },
      async update(id, changes) {
        return await db.contracts.update(Number(id), changes);
      },
    },

    // 4. Logs (บันทึกกิจกรรม)
    logs: {
      async add(logData) {
        const payload = {
          ...logData,
          timestamp: new Date().toISOString(),
        };
        return await db.logs.add(payload);
      },
      async getByLeadId(leadId) {
        return await db.logs.where("leadId").equals(leadId).reverse().toArray();
      },
    },

    // 5. Cars (ยานพาหนะ)
    cars: {
      async getAll() {
        return await db.cars.toArray();
      },
      async add(data) {
        return await db.cars.add(data);
      },
    },
  };

  // ========================================================
  // 🌉 Legacy Bridge (Backward Compatibility)
  // ========================================================
  // ส่วนนี้ช่วยให้ไฟล์เก่า (เช่น lead.js) ที่เรียก AppDexie.lead.xxx()
  // ยังทำงานได้ โดยเราจะ Redirect คำสั่งเหล่านั้นมาที่ Repository แทน
  // --------------------------------------------------------

  // จำลอง Object .lead ให้เหมือนกับที่ไฟล์เก่าคาดหวัง
  db.lead = {
    getAll: Repository.leads.getAll,
    add: Repository.leads.add,
    update: Repository.leads.update,
    delete: Repository.leads.delete,
    clear: Repository.leads.clear,
  };

  // จำลอง Object .settings_wrapper (เผื่อมีไฟล์ไหนหลงเรียก)
  db.settings_wrapper = Repository.settings;

  // Export Repository
  global.Repository = Repository;

  console.log("✅ Repository Initialized (with Legacy Bridge)");
})(window);
