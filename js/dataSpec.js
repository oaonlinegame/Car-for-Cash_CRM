// js/dataSpec.js
(function (global) {
  "use strict";

  const DataSpec = {
    // ----------------------------------------------------
    // 👤 Lead Model (ข้อมูลลูกค้า)
    // ----------------------------------------------------
    Lead: {
      createDefault() {
        // ✅ เตรียมสินทรัพย์เริ่มต้น 1 รายการ (เพื่อให้กรอกได้เลย)
        let defaultAssets = [];

        // ตรวจสอบเพื่อความปลอดภัย (เรียกฟังก์ชัน Asset.createDefault)
        if (global.DataSpec && global.DataSpec.Asset) {
          defaultAssets.push(global.DataSpec.Asset.createDefault());
        }

        return {
          id: null,
          firstName: "",
          nickName: "",
          phones: "",
          birthDate: "",
          address: "",
          province: "",
          postalCode: "",
          occupation: "",
          status: "ลูกค้าใหม่",
          isProspect: true,
          prospectStage: "สนใจ",
          rating: 3,
          note: "",
          createDate: new Date().toLocaleDateString("th-TH"),

          contracts: [],
          assets: defaultAssets, // ✅ เริ่มต้นด้วย 1 รายการเสมอ
        };
      },
    },

    // ----------------------------------------------------
    // 🏠 Asset Model (ข้อมูลสินทรัพย์)
    // ----------------------------------------------------
    Asset: {
      createDefault() {
        return {
          type: "รถยนต์",
          details: "",
          value: "",
          owner: "ชื่อลูกค้า",
        };
      },
    },

    // ----------------------------------------------------
    // 📝 Contract Model (ข้อมูลสัญญา)
    // ----------------------------------------------------
    Contract: {
      createDefault() {
        return {
          contractId: "",
          financeType: "จำนำเล่ม",
          principal: 0,
          interestRate: 0,
          totalInstallment: 0,
          terms: 12,
          installmentPerMonth: 0,
          startDate: new Date().toISOString().substr(0, 10),
          status: "รออนุมัติ",
        };
      },
    },
  };

  global.DataSpec = DataSpec;
})(window);
