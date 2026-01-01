// js/dataSpec.js
// --------------------------------------------------------
// 📘 Data Specifications (แม่พิมพ์ข้อมูล)
// --------------------------------------------------------
// หน้าที่: เก็บโครงสร้างข้อมูลเริ่มต้น (Schema/Model)
// เพื่อให้ Service ต่างๆ (Lead, Contract) เรียกไปใช้
// --------------------------------------------------------

const DataSpec = {
  // ----------------------------------------------------
  // 👤 Lead Model (โครงสร้างข้อมูลลูกค้า)
  // ----------------------------------------------------
  Lead: {
    createDefault() {
      return {
        id: null,
        firstName: "",
        nickName: "",
        phones: "",
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
        contracts: [], // เก็บสัญญาเป็น Array
      };
    },
  },

  // ----------------------------------------------------
  // 📄 Contract Model (โครงสร้างข้อมูลสัญญา)
  // ----------------------------------------------------
  Contract: {
    createEmpty() {
      return {
        contractId: "",
        leadId: "",
        type: "",
        carid: "",
        carbrandid: "",
        statusAccount: "ปกติ",
        statusOverdue: 0,
        contractDate: new Date().toISOString().substr(0, 10),
        expireDate: "",
        grade: "",
        campaign: "",
        loanAmount: 0,
        approvedAmount: 0,
        interestRate: 0,
        interestType: "",
        term: 0,
        installmentAmount: 0,
        installmentVAT: 0,
        paymentDay: 1,
        paidInstallments: 0,
        remainingInstallments: 0,
        OVD: 0,
        last3Payments: [],
        lastUpdate: "",
        outstanding: 0,
        unrealized: 0,
        closeAmount: 0,
        closeDate: "",
        financeName: "",
        remark: "",
        isSubContract: false,
        assets: [],
        subContracts: [],
      };
    },
  },
};

// Export
window.DataSpec = DataSpec;
