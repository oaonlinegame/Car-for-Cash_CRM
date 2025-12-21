// js/asset.js
// --------------------------------------------------------
// 📘 AssetApp: จัดการ Logic ข้อมูลสินทรัพย์ (Domain Logic)
// --------------------------------------------------------
// หน้าที่:
// - สร้าง Object สินทรัพย์เปล่า (Factory Function)
// - จัดการเพิ่ม/ลบ สินทรัพย์ใน Array (Helper Methods)
// --------------------------------------------------------

const AssetApp = {
  // ----------------------------------------------------
  // ⭐ createEmpty()
  // หน้าที่: สร้าง Object สินทรัพย์เปล่า
  // ----------------------------------------------------
  createEmpty() {
    return {
      assetId: crypto.randomUUID(), // สร้าง ID ใหม่
      type: "รถยนต์", // ค่าเริ่มต้น

      // --- ข้อมูลกลุ่มยานยนต์ ---
      brand: "",
      model: "",
      year: null,
      engineNo: "",
      chassisNo: "",
      cc: "",
      carPrice: null,
      weight: null,
      appraisedValue: null,
      regDate: null,
      possessionDate: null,
      closeAmountOther: null,

      // --- ข้อมูลกลุ่มที่ดิน ---
      deedNumber: "",
      area: null,
      district: "",
      landProvince: "",

      // --- ข้อมูลกลุ่มประกัน/บำนาญ ---
      insuranceType: "ประกันรถ",
      insuranceVehicleType: "",
      coverageDate: null,
      desiredCoverage: "",
      insuranceCapital: null,
      insurancePremium: null,
      pensionAmount: null,
    };
  },

  // ----------------------------------------------------
  // ⭐ add(targetList)
  // หน้าที่: เพิ่มสินทรัพย์เปล่าลงในรายการที่ระบุ
  // ----------------------------------------------------
  add(targetList) {
    if (Array.isArray(targetList)) {
      targetList.push(this.createEmpty());
    }
  },

  // ----------------------------------------------------
  // ⭐ remove(targetList, index)
  // หน้าที่: ลบสินทรัพย์ออกจากรายการตาม Index
  // ----------------------------------------------------
  remove(targetList, index) {
    if (Array.isArray(targetList) && index >= 0 && index < targetList.length) {
      targetList.splice(index, 1);
    }
  },
};

window.AssetApp = AssetApp;
