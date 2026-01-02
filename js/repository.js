// js/repository.js
// --------------------------------------------------------
// 🏭 Repository Layer (ตัวจัดการข้อมูลกลาง)
// --------------------------------------------------------
// หน้าที่: รับคำสั่งจาก Service -> สั่งงาน Dexie -> คืนค่ากลับ
// เปรียบเสมือน "Backend API" ที่คั่นกลาง
// --------------------------------------------------------

(function (global) {
  "use strict";

  const Repository = {
    // ====================================================
    // 👤 LEADS REPOSITORY
    // ====================================================
    leads: {
      // --------------------------------------------------
      // นับจำนวน Lead ทั้งหมดใน DB
      // --------------------------------------------------
      async count() {
        try {
          return await global.AppDexie.leads.count();
        } catch (err) {
          AppNotifications?.error("นับจำนวน Lead ไม่สำเร็จ");
          throw err;
        }
      },
      // --------------------------------------------------
      // ดึง Lead ตามหน้า (pagination จริง)
      // --------------------------------------------------
      async getChunk(page, perPage) {
        try {
          const limit = Number(perPage);
          const offset = (page - 1) * limit;

          return await global.AppDexie.leads
            .offset(offset)
            .limit(limit)
            .toArray();
        } catch (err) {
          AppNotifications?.error("โหลดข้อมูล Lead ตามหน้าไม่สำเร็จ");
          throw err;
        }
      },

      // ดึงทั้งหมด
      async getAll() {
        return await global.AppDexie.leads.toArray();
      },

      // ดึงตาม ID
      async getById(id) {
        return await global.AppDexie.leads.get(id);
      },

      // เพิ่มข้อมูล
      async create(data) {
        // คืนค่าเป็น ID ที่เพิ่งสร้าง
        return await global.AppDexie.leads.add(data);
      },

      // อัปเดตข้อมูล
      async update(id, data) {
        return await global.AppDexie.leads.update(id, data);
      },

      // ✅ [เพิ่มใหม่] Bulk Update สำหรับ Self-Healing (Performance Optimized)
      // ใช้ bulkPut เพื่อบันทึกทับข้อมูลเดิมทีละหลายรายการ (Idempotent)
      async bulkUpdate(items) {
        if (!Array.isArray(items) || items.length === 0) return;
        try {
          return await global.AppDexie.leads.bulkPut(items);
        } catch (err) {
          console.error("🏭 Repository: Bulk Update Failed", err);
          // ไม่ throw error ต่อ เพื่อไม่ให้กระทบ UI flow หลัก
        }
      },

      // ลบข้อมูล
      async delete(id) {
        return await global.AppDexie.leads.delete(id);
      },

      // ล้างทั้งหมด (ถ้ามี)
      async clear() {
        return await global.AppDexie.leads.clear();
      },
    },

    // ====================================================
    // 📞 LOGS REPOSITORY (ตัวอย่างสำหรับ log.js)
    // ====================================================
    logs: {
      async add(logData) {
        return await global.AppDexie.logs.add(logData);
      },
      async getByLeadId(leadId) {
        return await global.AppDexie.logs
          .where("leadId")
          .equals(leadId)
          .toArray();
      },
    },
    // ====================================================
    // ⚙️ SETTINGS / MASTER DATA REPOSITORY
    // ====================================================
    //  ส่วนจัดการ Settings / Master Data
    settings: {
      async get(key) {
        // คืนค่าเป็น Object { key: "...", value: [...] }
        return await global.AppDexie.settings.get(key);
      },
      async set(key, value) {
        // บันทึกทับ (Upsert)
        return await global.AppDexie.settings.put({ key, value });
      },
    },
  };

  // สามารถเพิ่ม contracts: { ... } ได้ในอนาคต

  // Export ให้ Service เรียกใช้
  global.Repository = Repository;
  console.log("🏭 Repository: Ready");
})(window);
