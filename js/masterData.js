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
    // 1. DATA SYNCHRONIZATION (การซิงค์ข้อมูลเมื่อเริ่มต้นระบบ)
    // ========================================================================

    /**
     * โหลดข้อมูล Master Data ทั้งหมดจาก Database ขึ้นสู่ Memory Store
     * * กระบวนการทำงาน (Logic Flow):
     * 1. ระบุรายการ Key ที่ต้องการโหลด (Whitelist)
     * 2. วนลูปตรวจสอบข้อมูลใน Database ทีละรายการ
     * 3. (Case A - Data Exists): หากพบข้อมูลใน DB ให้นำมาทับค่าใน Store ทันที
     * 4. (Case B - Data Missing): หากไม่พบข้อมูล (เช่น เปิดใช้งานครั้งแรก)
     * ให้นำค่า Default จาก Store ไปบันทึกลง DB (Data Seeding)
     */
    async load() {
      try {
        console.log("⏳ MasterData: Loading options...");

        // รายชื่อ Key ที่ระบบรองรับ (ต้องสอดคล้องกับ Store)
        const keysToLoad = [
          "occupationOptions",
          "sourceOptions",
          "assetTypeOptions",
        ];

        for (const key of keysToLoad) {
          // ตรวจสอบความพร้อมของ Store ก่อนดำเนินการป้องกัน Error
          if (!global.Store || !global.Store.data[key]) continue;

          // ดึงข้อมูลจาก Repository
          const result = await global.Repository.settings.get(key);

          if (result && Array.isArray(result.value)) {
            // กรณีพบข้อมูลเดิม: โหลดเข้าสู่ Memory (State Hydration)
            console.log(
              `📥 Loaded ${key} from DB (${result.value.length} items)`
            );
            global.Store.data[key] = result.value;
          } else {
            // กรณีไม่พบข้อมูล: สร้างข้อมูลตั้งต้น (Initial Seeding)
            const defaultData = global.Store.data[key];

            if (Array.isArray(defaultData) && defaultData.length > 0) {
              console.warn(`🌱 Seeding initial data for ${key}...`);
              await this._saveToDb(key, defaultData);
            }
          }
        }
        console.log("✅ MasterData: Sync complete.");
      } catch (err) {
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
     * * การทำงาน:
     * 1. ตรวจสอบค่าซ้ำ (Duplicate Check) เพื่อป้องกันข้อมูลขยะ
     * 2. อัปเดต Memory (Push to Array) เพื่อให้ UI เปลี่ยนแปลงทันที
     * 3. บันทึกลง Storage เพื่อความคงทนของข้อมูล
     */
    async addOption(storeKey, newValue) {
      if (!newValue) return;
      const val = newValue.trim();

      // ตรวจสอบโครงสร้าง Array ปลายทาง
      if (!global.Store.data[storeKey]) global.Store.data[storeKey] = [];

      const list = global.Store.data[storeKey];

      // ป้องกันการบันทึกค่าซ้ำ
      if (list.includes(val)) return;

      // อัปเดต State และ Database
      list.push(val);
      await this._saveToDb(storeKey, list);
      console.log(`✅ Added option to ${storeKey}`);
    },

    /**
     * ลบตัวเลือกออกจากระบบ (Remove Option)
     * @param {string} storeKey - ชื่อ Key ของข้อมูล
     * @param {number} index - ลำดับที่ต้องการลบ
     */
    async removeOption(storeKey, index) {
      const list = global.Store.data[storeKey];
      if (!list) return;

      // ลบจาก Memory และบันทึกผล
      list.splice(index, 1);
      await this._saveToDb(storeKey, list);
      console.log(`🗑️ Removed option from ${storeKey}`);
    },

    /**
     * จัดลำดับตัวเลือกใหม่ (Reorder Options)
     * ใช้สำหรับ Drag & Drop ในหน้าตั้งค่า
     * @param {string} storeKey - ชื่อ Key ของข้อมูล
     * @param {number} fromIndex - ตำแหน่งเดิม
     * @param {number} toIndex - ตำแหน่งใหม่
     */
    async reorderOption(storeKey, fromIndex, toIndex) {
      const list = global.Store.data[storeKey];
      if (!list) return;

      // สลับตำแหน่งข้อมูลใน Array (In-place Mutation)
      const item = list.splice(fromIndex, 1)[0];
      list.splice(toIndex, 0, item);

      // บันทึกลำดับใหม่ลง DB
      await this._saveToDb(storeKey, list);
      console.log(`🔄 Reordered ${storeKey}`);
    },

    // ========================================================================
    // 3. PERSISTENCE LAYER (การบันทึกข้อมูลระดับล่าง)
    // ========================================================================

    /**
     * ฟังก์ชันภายในสำหรับบันทึก Array ลง IndexedDB
     * @param {string} key - Key ที่ใช้บันทึก
     * @param {Array} listData - ข้อมูล Array ที่ต้องการบันทึก
     * * ความสำคัญ:
     * - ต้องทำการ Deep Clone ข้อมูลก่อนส่งให้ Repository
     * - เพื่อตัด Reference จาก Reactive State ของ Vue
     * - ป้องกัน Proxy Object Error เมื่อบันทึกลง IndexedDB
     */
    async _saveToDb(key, listData) {
      try {
        // Serialization เพื่อล้าง Proxy Wrapper
        const plainData = JSON.parse(JSON.stringify(listData));
        await global.Repository.settings.set(key, plainData);
      } catch (err) {
        console.error(`❌ MasterData: Save failed ${key}`, err);
      }
    },
  };

  // ส่งออก MasterData เป็น Global Service
  global.MasterData = MasterData;
})(window);
