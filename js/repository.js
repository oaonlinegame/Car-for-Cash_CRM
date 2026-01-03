// js/repository.js
// --------------------------------------------------------
// 🏭 Repository Layer (เลเยอร์จัดการการเข้าถึงข้อมูล)
// --------------------------------------------------------
// ทำหน้าที่เป็น Abstraction Layer คั่นกลางระหว่าง Business Logic และ Database (Dexie)
// รับผิดชอบการแปลงคำสั่ง CRUD เป็น Query ของ IndexedDB
// ช่วยให้สามารถเปลี่ยน Database Driver ได้ง่ายในอนาคตโดยไม่กระทบ Logic หลัก
// --------------------------------------------------------

(function (global) {
  "use strict";

  const Repository = {
    // ========================================================================
    // 1. LEADS REPOSITORY (จัดการข้อมูลลูกค้า)
    // ========================================================================
    leads: {
      // --------------------------------------------------
      // READ OPERATIONS (การอ่านข้อมูล)
      // --------------------------------------------------

      /**
       * ดึงข้อมูล Lead รายการเดียวระบุตาม ID
       * ใช้สำหรับโหลดข้อมูลเพื่อนำไปแก้ไขหรือแสดงรายละเอียด
       */
      async getById(id) {
        return await global.AppDexie.leads.get(id);
      },

      /**
       * ดึงข้อมูล Lead ทั้งหมดจากฐานข้อมูล
       * ใช้สำหรับการโหลดข้อมูลเริ่มต้น (Initial Load) ลงใน Store
       */
      async getAll() {
        return await global.AppDexie.leads.toArray();
      },

      /**
       * นับจำนวนรายการ Lead ทั้งหมดที่มีอยู่ในระบบ
       * ใช้สำหรับคำนวณจำนวนหน้า (Total Pages) ในระบบ Pagination
       */
      async count() {
        try {
          return await global.AppDexie.leads.count();
        } catch (err) {
          global.AppNotifications?.error("นับจำนวน Lead ไม่สำเร็จ");
          throw err;
        }
      },

      /**
       * ดึงข้อมูล Lead บางส่วนตามหน้า (Server-side/DB-side Pagination)
       * ช่วยลดภาระหน่วยความจำกรณีที่มีข้อมูลจำนวนมาก
       * @param {number} page - หมายเลขหน้าปัจจุบัน
       * @param {number} perPage - จำนวนรายการต่อหน้า
       */
      async getChunk(page, perPage) {
        try {
          const limit = Number(perPage);
          const offset = (page - 1) * limit;

          // ใช้ offset และ limit ของ Dexie เพื่อดึงข้อมูลเฉพาะส่วนที่ต้องการ
          return await global.AppDexie.leads
            .offset(offset)
            .limit(limit)
            .toArray();
        } catch (err) {
          global.AppNotifications?.error("โหลดข้อมูล Lead ตามหน้าไม่สำเร็จ");
          throw err;
        }
      },

      // --------------------------------------------------
      // WRITE OPERATIONS (การเขียนข้อมูล)
      // --------------------------------------------------

      /**
       * สร้างรายการ Lead ใหม่
       * คืนค่า Primary Key (ID) ที่ถูกสร้างโดย Auto Increment
       */
      async create(data) {
        return await global.AppDexie.leads.add(data);
      },

      /**
       * อัปเดตข้อมูล Lead เดิมที่มีอยู่แล้ว
       * @param {number|string} id - รหัสอ้างอิงของข้อมูล
       * @param {Object} data - ข้อมูลบางส่วนหรือทั้งหมดที่ต้องการแก้ไข
       */
      async update(id, data) {
        return await global.AppDexie.leads.update(id, data);
      },

      /**
       * อัปเดตข้อมูลจำนวนมากพร้อมกัน (Bulk Operation)
       * ใช้สำหรับกระบวนการ Self-Healing หรือ Migration ข้อมูล
       * ใช้ bulkPut เพื่อประสิทธิภาพ (Performance Optimized) และความเป็น Idempotent
       * @param {Array} items - รายการข้อมูลที่ต้องการบันทึกทับ
       */
      async bulkUpdate(items) {
        if (!Array.isArray(items) || items.length === 0) return;
        try {
          return await global.AppDexie.leads.bulkPut(items);
        } catch (err) {
          // ดักจับ Error เพื่อป้องกันไม่ให้กระบวนการหลัก (Main Thread) หยุดทำงาน
          // เนื่องจากมักใช้ในกระบวนการ Background Task
          console.error("🏭 Repository: Bulk Update Failed", err);
        }
      },

      /**
       * ลบข้อมูล Lead ตาม ID
       */
      async delete(id) {
        return await global.AppDexie.leads.delete(id);
      },

      /**
       * ลบข้อมูล Lead ทั้งหมดในตาราง
       * ใช้สำหรับการรีเซ็ตระบบหรือล้างข้อมูลทดสอบ
       */
      async clear() {
        return await global.AppDexie.leads.clear();
      },
    },

    // ========================================================================
    // 2. LOGS REPOSITORY (จัดการข้อมูลบันทึกเหตุการณ์)
    // ========================================================================
    logs: {
      /**
       * บันทึก Log ใหม่ลงฐานข้อมูล
       */
      async add(logData) {
        return await global.AppDexie.logs.add(logData);
      },

      /**
       * ดึงประวัติ Log ทั้งหมดของ Lead รายหนึ่ง
       * ใช้ Index 'leadId' เพื่อความรวดเร็วในการค้นหา
       */
      async getByLeadId(leadId) {
        return await global.AppDexie.logs
          .where("leadId")
          .equals(leadId)
          .toArray();
      },
    },

    // ========================================================================
    // 3. SETTINGS REPOSITORY (จัดการการตั้งค่าและ Master Data)
    // ========================================================================
    settings: {
      /**
       * ดึงค่าการตั้งค่าตาม Key ที่ระบุ
       * @returns {Object} { key: "name", value: [...] }
       */
      async get(key) {
        return await global.AppDexie.settings.get(key);
      },

      /**
       * บันทึกหรืออัปเดตการตั้งค่า (Upsert)
       * เก็บข้อมูลในรูปแบบ Key-Value Pair
       */
      async set(key, value) {
        return await global.AppDexie.settings.put({ key, value });
      },
    },
  };

  // ========================================================================
  // 4. MODULE EXPORT
  // ========================================================================

  // ส่งออก Repository เป็น Global Object เพื่อให้ Service เรียกใช้งาน
  global.Repository = Repository;
  console.log("🏭 Repository: Ready");
})(window);
