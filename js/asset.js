// js/asset.js
// --------------------------------------------------------
// 🏠 Asset App (จัดการหลักทรัพย์ค้ำประกัน)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AssetApp = {
    // ----------------------------------------------------
    // ⭐ คำนวณมูลค่ารวมของหลักทรัพย์ใน Lead (เผื่อใช้ในอนาคต)
    // ----------------------------------------------------
    calculateTotalValue(leadForm) {
      if (!leadForm || !Array.isArray(leadForm.assets)) return 0;

      // วนลูปทุกรายการเพื่อรวมมูลค่า
      return leadForm.assets.reduce((sum, asset) => {
        // แปลง string "1,000,000" ให้เป็นตัวเลข 1000000
        const val = parseFloat((asset.value || "0").replace(/,/g, ""));
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
    },

    // ----------------------------------------------------
    // ⭐ ตรวจสอบความครบถ้วนของข้อมูลหลักทรัพย์
    // ----------------------------------------------------
    validate(assetData) {
      if (!assetData.type) return "กรุณาระบุประเภทหลักทรัพย์";
      // สามารถเพิ่มเงื่อนไขอื่นๆ ได้ที่นี่
      return null; // ผ่าน
    },

    // ----------------------------------------------------
    // ✅ ADD: เพิ่มสินทรัพย์ใหม่ลงใน Lead
    // ----------------------------------------------------
    add(leadForm) {
      if (!leadForm) return;

      // 1. ตรวจสอบว่ามี Array assets หรือยัง (ถ้าไม่มีให้สร้างใหม่)
      if (!Array.isArray(leadForm.assets)) {
        leadForm.assets = [];
      }

      // 2. ตรวจสอบว่า DataSpec พร้อมใช้งานหรือไม่
      if (global.DataSpec && global.DataSpec.Asset) {
        // สร้างข้อมูลเปล่าจาก DataSpec แล้ว push เข้า Array
        leadForm.assets.push(global.DataSpec.Asset.createDefault());
        console.log("🏠 AssetApp: Added new asset item.");
      } else {
        console.error(
          "❌ Error: DataSpec.Asset not found! (กรุณาอัปเดตไฟล์ js/dataSpec.js)"
        );
      }
    },

    // ----------------------------------------------------
    // ✅ REMOVE: ลบสินทรัพย์ตาม Index
    // ----------------------------------------------------
    remove(leadForm, index) {
      if (!leadForm || !Array.isArray(leadForm.assets)) return;

      // 1. กฎ: ถ้าเหลือแค่ 1 รายการ ห้ามลบ (กันรายการหมด)
      if (leadForm.assets.length <= 1) {
        return;
      }

      // 2. ลบเลยทันที (ไม่ต้องมี confirm)
      leadForm.assets.splice(index, 1);
    },
  };

  global.AssetApp = AssetApp;
})(window);
