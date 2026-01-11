// js/asset.js
// --------------------------------------------------------
// 🚗 ASSET MANAGEMENT MODULE (Hardened Version)
// --------------------------------------------------------
// โมดูลสำหรับจัดการตรรกะของหลักทรัพย์ (Asset Business Logic)
// ปรับปรุง: เพิ่มระบบ Null Safety ป้องกันแอปพังจากข้อมูลเสีย
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AssetApp = {
    // ========================================================================
    // 1. DATA COMPUTATION (การคำนวณข้อมูล)
    // ========================================================================

    /**
     * คำนวณยอดรวมราคาประเมินของหลักทรัพย์ทั้งหมดในรายการ
     * @param {Object} target - อ็อบเจ็กต์ที่มีอาเรย์ assets (เช่น leadForm หรือ contract)
     * @returns {number} ผลรวมของมูลค่าทรัพย์สินทั้งหมด
     */
    calculateTotalValue(target) {
      // Safety Check: ถ้าไม่มี target หรือ assets ไม่ใช่อาเรย์ ให้คืนค่า 0
      if (!target || !Array.isArray(target.assets)) return 0;

      return target.assets.reduce((sum, asset) => {
        // ✅ [FIX] ป้องกัน Error ถ้า asset เป็น null/undefined
        if (!asset) return sum;

        // แปลงค่าเงิน (ลบ comma ออก)
        // ใช้ String() ครอบเพื่อป้องกันกรณี value เป็น null/undefined ในระดับ property
        const valStr = String(asset.value || "0").replace(/,/g, "");
        const val = parseFloat(valStr);

        // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
    },

    // ========================================================================
    // 2. MASTER DATA INTEGRATION (การเชื่อมโยงข้อมูลหลัก)
    // ========================================================================

    /**
     * จัดการการเปลี่ยนแปลงยี่ห้อรถและบันทึกข้อมูลใหม่ลงในฐานข้อมูล
     * @param {string} newValue - ชื่อยี่ห้อรถที่ผู้ใช้เลือกหรือพิมพ์เพิ่ม
     */
    handleBrandChange(newValue) {
      if (!newValue) return;

      if (global.MasterData && global.MasterData.addOption) {
        global.MasterData.addOption("carBrandOptions", newValue);
      }
    },

    // ========================================================================
    // 3. COLLECTION MANIPULATION (การจัดการรายการทรัพย์สิน)
    // ========================================================================

    /**
     * เพิ่มรายการหลักทรัพย์ใหม่ลงในอาเรย์เป้าหมาย
     * @param {Object} target - อ็อบเจ็กต์ที่ต้องการเพิ่มทรัพย์สิน
     */
    add(target) {
      if (!target) return;

      // ถ้าไม่มี key assets ให้สร้างอาเรย์เปล่ารอไว้
      if (!Array.isArray(target.assets)) {
        target.assets = [];
      }

      // สร้างข้อมูลใหม่จาก DataSpec
      if (global.DataSpec && global.DataSpec.Asset) {
        // กรองค่า null ออกก่อนเพิ่ม (Cleanup on Add)
        target.assets = target.assets.filter((a) => a);

        target.assets.push(global.DataSpec.Asset.createDefault());
      }
    },

    /**
     * ลบรายการหลักทรัพย์ออกจากอาเรย์ตามลำดับที่ระบุ
     * @param {Object} target - อ็อบเจ็กต์ที่ต้องการลบทรัพย์สิน
     * @param {number} index - ลำดับของทรัพย์สินในอาเรย์
     */
    remove(target, index) {
      if (!target || !Array.isArray(target.assets)) return;

      // ✅ [FIX] กรองข้อมูลเสียออกก่อนเริ่มการลบ เพื่อความแม่นยำของ Index
      // หมายเหตุ: การทำแบบนี้ Index อาจเปลี่ยน แต่ปลอดภัยกว่า
      // แต่ในบริบทนี้เราจะเช็คแค่ตอนเข้าถึงข้อมูล

      // กรณีเหลือรายการเดียว (หรือน้อยกว่า) -> ให้รีเซ็ตค่าแทนการลบ
      if (target.assets.length <= 1) {
        if (global.DataSpec && global.DataSpec.Asset) {
          // ถ้าตัวที่ 0 เป็น null ให้สร้างใหม่ทับลงไปเลย
          if (!target.assets[0]) {
            target.assets[0] = global.DataSpec.Asset.createDefault();
          } else {
            // ถ้ามีตัวตน ให้ล้างค่าข้างใน
            Object.assign(
              target.assets[0],
              global.DataSpec.Asset.createDefault()
            );
          }
        }
        return;
      }

      // ลบรายการออกตามปกติ
      target.assets.splice(index, 1);
    },
  };

  global.AssetApp = AssetApp;
})(window);
