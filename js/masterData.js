// js/masterData.js
// --------------------------------------------------------
// 🗃️ MASTER DATA SERVICE
// --------------------------------------------------------
// โมดูลบริหารจัดการข้อมูลตัวเลือก (Dropdown Options)
// ทำหน้าที่ซิงโครไนซ์ข้อมูลระหว่าง Memory (Store) และ Database (IndexedDB)
// เพื่อให้ข้อมูลตัวเลือกต่างๆ (เช่น อาชีพ, แหล่งที่มา) ถูกบันทึกและเรียกใช้ได้อย่างต่อเนื่อง
// --------------------------------------------------------

(function (global) {
  "use strict";

  const MasterData = {
    // ========================================================================
    // 1. DATA SYNCHRONIZATION (การซิงค์ข้อมูลเริ่มต้น)
    // ========================================================================

    /**
     * โหลดข้อมูล Master Data ทั้งหมดจาก Database ขึ้นสู่ Memory Store
     * ทำหน้าที่เป็นจุดเริ่มต้น (Entry Point) สำหรับการคืนค่าสถานะตัวเลือกต่างๆ
     *
     * ลำดับการทำงาน:
     * 1. กำหนดรายการ Key ที่ต้องการโหลด (Whitelist) เพื่อความปลอดภัย
     * 2. ตรวจสอบข้อมูลใน Database (IndexedDB)
     * 3. (Case A) หากมีข้อมูล: โหลดข้อมูลเข้าสู่ Global Store (State Hydration)
     * 4. (Case B) หากไม่มีข้อมูล: นำค่าเริ่มต้นจาก Code บันทึกลง DB (Initial Seeding)
     */
    async load() {
      try {
        console.log("⏳ MasterData: Loading options...");

        // รายชื่อ Key ที่ระบบรองรับ (ต้องตรงกับ property ใน store.js)
        const keysToLoad = [
          "occupationOptions", // ตัวเลือกอาชีพ
          "sourceOptions", // ตัวเลือกแหล่งที่มา
          "assetTypeOptions", // ประเภทหลักทรัพย์
          "carBrandOptions", // ยี่ห้อรถยนต์
          "contractTypeOptions", // ประเภทสัญญา
          "contractStatusOptions", // สถานะสัญญา
          "gradeOptions", // เกรดลูกค้า
        ];

        for (const key of keysToLoad) {
          // ตรวจสอบความสมบูรณ์ของ Store ก่อนเริ่มทำงาน
          if (!global.Store || !global.Store.data[key]) continue;

          // ดึงข้อมูลจาก Repository (IndexedDB)
          const result = await global.Repository.settings.get(key);

          if (result && Array.isArray(result.value)) {
            // กรณีพบข้อมูลเดิมในฐานข้อมูล: โหลดเข้าสู่ Memory
            console.log(
              `📥 Loaded ${key} from DB (${result.value.length} items)`
            );
            global.Store.data[key] = result.value;
          } else {
            // กรณีไม่พบข้อมูล: ใช้ค่า Default จาก Store.js แล้วบันทึกลงฐานข้อมูล
            // เพื่อให้ครั้งต่อไปมีข้อมูลชุดเดียวกัน
            const defaultData = global.Store.data[key];

            if (Array.isArray(defaultData) && defaultData.length > 0) {
              console.warn(`🌱 Seeding initial data for ${key}...`);
              await this._saveToDb(key, defaultData);
            }
          }
        }
        console.log("✅ MasterData: Sync complete.");
      } catch (err) {
        // ดักจับข้อผิดพลาดเพื่อไม่ให้กระบวนการ Boot ของแอปหยุดชะงัก
        console.error("❌ MasterData Load Error:", err);
      }
    },

    // ========================================================================
    // 2. DATA MANIPULATION (การจัดการข้อมูลตัวเลือก)
    // ========================================================================

    /**
     * เพิ่มตัวเลือกใหม่ลงในระบบ (Add Option)
     * @param {string} storeKey - ชื่อ Key ของข้อมูล (เช่น 'occupationOptions')
     * @param {string} newValue - ค่าที่ต้องการเพิ่ม
     *
     * ลำดับการทำงาน:
     * 1. ตรวจสอบความถูกต้องของ Key และค่าที่รับมา
     * 2. ตรวจสอบค่าซ้ำ (Duplicate Check) เพื่อป้องกันข้อมูลขยะ
     * 3. อัปเดต Memory Store ทันทีเพื่อให้ UI ตอบสนองรวดเร็ว (Optimistic UI)
     * 4. เรียก _saveToDb เพื่อบันทึกข้อมูลถาวร
     */
    async addOption(storeKey, newValue) {
      if (!newValue) return;
      const val = newValue.trim();

      // ตรวจสอบว่า Store มี Array รองรับหรือไม่
      if (!global.Store.data[storeKey]) global.Store.data[storeKey] = [];

      const list = global.Store.data[storeKey];

      // ป้องกันการเพิ่มข้อมูลที่ซ้ำกัน
      if (list.includes(val)) return;

      // อัปเดต State และบันทึกผล
      list.push(val);
      await this._saveToDb(storeKey, list);
      console.log(`✅ Added option to ${storeKey}`);
    },

    /**
     * ลบตัวเลือกออกจากระบบ (Remove Option)
     * @param {string} storeKey - ชื่อ Key ของข้อมูล
     * @param {number} index - ลำดับ Index ที่ต้องการลบ
     *
     * ลำดับการทำงาน:
     * 1. ตรวจสอบว่ามีข้อมูลใน Store หรือไม่
     * 2. ใช้ splice เพื่อตัดข้อมูลออกจาก Array ใน Memory
     * 3. บันทึก Array ใหม่ลงฐานข้อมูล
     */
    async removeOption(storeKey, index) {
      const list = global.Store.data[storeKey];
      if (!list) return;

      // ลบข้อมูลและอัปเดต DB
      list.splice(index, 1);
      await this._saveToDb(storeKey, list);
      console.log(`🗑️ Removed option from ${storeKey}`);
    },

    /**
     * จัดลำดับตัวเลือกใหม่ (Reorder Options)
     * ใช้สำหรับฟีเจอร์ Drag & Drop ในหน้าตั้งค่า
     * @param {string} storeKey - ชื่อ Key ของข้อมูล
     * @param {number} fromIndex - ตำแหน่งเดิม
     * @param {number} toIndex - ตำแหน่งใหม่ปลายทาง
     *
     * ลำดับการทำงาน:
     * 1. ดึงข้อมูลจาก Memory Store
     * 2. สลับตำแหน่งข้อมูลใน Array โดยตรง (In-place Mutation)
     * 3. บันทึกลำดับใหม่ลงฐานข้อมูลทันที
     */
    async reorderOption(storeKey, fromIndex, toIndex) {
      const list = global.Store.data[storeKey];
      if (!list) return;

      // ย้ายตำแหน่งข้อมูลใน Array
      const item = list.splice(fromIndex, 1)[0];
      list.splice(toIndex, 0, item);

      // บันทึกผลลัพธ์
      await this._saveToDb(storeKey, list);
      console.log(`🔄 Reordered ${storeKey}`);
    },

    // ========================================================================
    // 3. PERSISTENCE LAYER (การบันทึกข้อมูลระดับล่าง)
    // ========================================================================

    /**
     * ฟังก์ชันภายในสำหรับบันทึก Array ลง IndexedDB (Internal Helper)
     * @param {string} key - Key ที่ใช้บันทึก
     * @param {Array} listData - ข้อมูล Array ที่ต้องการบันทึก
     *
     * ความสำคัญ:
     * - ข้อมูลใน Store เป็น Vue Reactive Object (Proxy)
     * - IndexedDB ไม่สามารถบันทึก Proxy Object ได้โดยตรง (Data Clone Error)
     * - จำเป็นต้องทำ Deep Clone / Serialization เพื่อแปลงเป็น Plain JavaScript Object ก่อนบันทึก
     */
    async _saveToDb(key, listData) {
      try {
        // Serialization: ล้าง Proxy Wrapper ออกจากข้อมูล
        const plainData = JSON.parse(JSON.stringify(listData));

        // ส่งข้อมูลที่สะอาดแล้วไปยัง Repository
        await global.Repository.settings.set(key, plainData);
      } catch (err) {
        console.error(`❌ MasterData: Save failed ${key}`, err);
      }
    },
  };

  // ส่งออก MasterData เป็น Global Service
  global.MasterData = MasterData;
})(window);
