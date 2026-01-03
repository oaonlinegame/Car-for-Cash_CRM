// js/masterData.js
// --------------------------------------------------------
// 🗃️ MasterDataService (บริการจัดการข้อมูลตัวเลือก/Dropdown)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const MasterData = {
    // ========================================================================
    // 1. DATA LOADING (โหลดข้อมูลตัวเลือกทั้งหมด)
    // ========================================================================
    async load() {
      try {
        console.log("⏳ MasterData: Loading options...");

        // รายชื่อ Key ที่ต้องโหลด (ต้องตรงกับใน Store.data)
        const keysToLoad = [
          "occupationOptions",
          "sourceOptions",
          // เพิ่มตัวเลือกอื่นๆ ที่ต้องการโหลดที่นี่
        ];

        for (const key of keysToLoad) {
          // เรียกข้อมูลจาก Dexie ผ่าน Repository
          const result = await global.Repository.settings.get(key);

          if (result && Array.isArray(result.value)) {
            // อัปเดตลง Store
            if (global.Store && global.Store.data) {
              global.Store.data[key] = result.value;
            }
          } else {
            console.warn(`⚠️ MasterData: No data found for ${key}`);
          }
        }

        console.log("✅ MasterData: Options loaded successfully");
      } catch (err) {
        console.error("❌ MasterData Load Error:", err);
        // แจ้งเตือน Error (ถ้ามีระบบ Notification)
        if (global.AppNotification) {
          global.AppNotification.error("ไม่สามารถโหลดข้อมูลตัวเลือกได้");
        }
      }
    },

    // ========================================================================
    // 2. MANAGEMENT ACTIONS (เพิ่ม / ลบ / จัดเรียง)
    // ========================================================================

    /**
     * เพิ่มตัวเลือกใหม่
     */
    async addOption(storeKey, newValue) {
      if (!newValue || typeof newValue !== "string") return;
      if (!global.Store || !global.Store.data[storeKey]) return;

      const list = global.Store.data[storeKey];
      const valTrimmed = newValue.trim();

      // ป้องกันค่าซ้ำ
      if (list.includes(valTrimmed)) {
        if (global.AppNotification)
          global.AppNotification.warning("มีตัวเลือกนี้อยู่แล้ว");
        return;
      }

      // เพิ่มลงใน Memory (Optimistic UI)
      list.push(valTrimmed);

      // บันทึกลง DB
      await this._saveToDb(storeKey, list);
      console.log(`✅ MasterData: Added "${valTrimmed}" to ${storeKey}`);
    },

    /**
     * ลบตัวเลือก
     */
    async removeOption(storeKey, index) {
      if (!global.Store || !global.Store.data[storeKey]) return;

      const list = global.Store.data[storeKey];
      if (index < 0 || index >= list.length) return;

      // ลบออกจาก Memory
      list.splice(index, 1);

      // บันทึกลง DB
      await this._saveToDb(storeKey, list);
      console.log(`✅ MasterData: Removed item from ${storeKey}`);
    },

    /**
     * จัดเรียงลำดับ (Drag & Drop)
     */
    async reorderOption(storeKey, fromIndex, toIndex) {
      if (!global.Store || !global.Store.data[storeKey]) return;

      const list = global.Store.data[storeKey];
      if (
        fromIndex < 0 ||
        fromIndex >= list.length ||
        toIndex < 0 ||
        toIndex >= list.length
      )
        return;

      // สลับตำแหน่งใน Memory
      const item = list.splice(fromIndex, 1)[0];
      list.splice(toIndex, 0, item);

      // บันทึกลง DB
      await this._saveToDb(storeKey, list);
      console.log(`✅ MasterData: Reordered ${storeKey}`);
    },

    // ========================================================================
    // 3. PRIVATE HELPER (ฟังก์ชันช่วยบันทึก)
    // ========================================================================
    async _saveToDb(key, listData) {
      try {
        // แปลงเป็น Pure Array เพื่อความปลอดภัยก่อนบันทึก
        const plainData = JSON.parse(JSON.stringify(listData));
        await global.Repository.settings.set(key, plainData);
      } catch (err) {
        console.error(`❌ MasterData: Failed to save ${key}`, err);
        if (global.AppNotification) {
          global.AppNotification.error(`บันทึกข้อมูล ${key} ไม่สำเร็จ`);
        }
        throw err; // ส่ง Error ต่อให้คนเรียกจัดการถ้าจำเป็น
      }
    },
  };

  global.MasterData = MasterData;
})(window);
