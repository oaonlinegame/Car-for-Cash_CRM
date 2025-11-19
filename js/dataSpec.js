// dataSpec.js
// --------------------------------------------------------
// 📘 โมดูล DataSpec
// ใช้เก็บสเปกโครงสร้างข้อมูลหลักของระบบ Lead Manager (CRM + Finance)
// --------------------------------------------------------
// ✅ แนวคิดตรงตามโครงสร้างระบบ:
// - ทุกอย่างอยู่ในอ็อบเจกต์ชื่อเดียวกับไฟล์ (DataSpec)
// - ไม่สร้างตัวแปรลอย
// - app.js เป็นศูนย์กลางรวมทุกโมดูล (Hub)
// --------------------------------------------------------

const DataSpec = {
  // ----------------------------------------------------
  // 🧩 Lead (ข้อมูลลูกค้า)
  // ----------------------------------------------------
  Lead: {
    id: "string", // รหัสลีด (Primary Key)
    status: "string", // สถานะลีดเช่น ลูกค้้าใหม่ ลูกค้าเช่าซื้อ ลูกค้าจำนำทะเบียน other
    firstName: "string", // ชื่อเต็ม (รวมชื่อและนามสกุล)
    nickName: "string", // ชื่อเล่น
    personalConnects: "array<string>", // รายชื่อผู้ติดต่อส่กรณีเป็นนิติบุคคล
    phones: "array<string>", // เบอร์โทรหลายเบอร์
    phonePersonalConnects: "array<string>", // เบอร์โทรของผู้ติดต่อกรณีเป็นนิติบุคคล
    birthDate: "date", // วันเกิด (ใช้ขายประกัน/วิเคราะห์อายุ)
    occupation: "string", // อาชีพ
    source: "string", // แหล่งที่มา เช่น Facebook, Line, Walk-in
    address: "string", // ที่อยู่ เต็มรูปแบบ
    province: "string", // จังหวัด
    postalCode: "string", // รหัสไปรษณีย์
    createDate: "date", // วันที่สร้างลีด
    updateDate: "date", // วันที่อัปเดตล่าสุด
    note: "string", // หมายเหตุทั่วไป
    rating: "number | ''", // คะแนนเฉลี่ย (ระบบจะคำนวณจาก log)
    blacklist: "boolean | ''", // สถานะ blacklist (ติดลบ/ไม่ติดลบ)
    isProspect: "boolean", // [ใหม่] true = ยังไม่เคยมีสัญญา (ลูกค้าใหม่)
    prospectStage: "string", // [ใหม่] ขั้นตอนในกระบวนการขาย เช่น 'สนใจ', 'รอเสนอ', 'รอเอกสาร'
    contracts: ["number"], // รายการสัญญา (สินเชื่อ/ไฟแนนซ์)
    remark: "string", // หมายเหตุเพิ่มเติม
  },

  // ----------------------------------------------------
  // 💼 Contract (สัญญาหลัก)
  // ----------------------------------------------------
  Contract: {
    contractId: "string", // รหัสสัญญา
    leadId: "string", // เชื่อมกับ Lead.id
    type: "string", // ประเภทสินเชื่อ เช่น 'จำนำทะเบียน' 'เช่าซื้อ' 'โฉนดที่ดิน' 'บำนาญ'
    carid: "string", // รหัสรถ (ถ้ามี)
    carbrandid: "string", // รหัสยี่ห้อรถ (ถ้ามี)
    statusAccount: "string", // สถานะบัญชี เช่น 'ค้างชำระ', 'ปิดบัญชี', 'ฟ้องร้อง'
    statusOverdue: "number", // จำนวนงวดที่ค้าง เช่น 0=ปกติ, 1=ค้าง 1 งวด 2=ค้าง 2 งวด
    contractDate: "date", // วันที่เกิดสัญญา
    expireDate: "date", // วันที่ครบสัญญา
    grade: "string", // เกรดลูกค้า
    campaign: "string", // แคมเปญของสัญญา
    loanAmount: "number", // วงเงินที่ขอ
    approvedAmount: "number", // วงเงินอนุมัติ
    interestRate: "number", // ดอกเบี้ย (%)
    interestType: "string", // ประเภทดอกเบี้ย เช่น ลดต้นลดดอก, ดอกเบี้ยคงที่
    term: "number", // จำนวนงวดทั้งหมด (เดือน)
    installmentAmount: "number", // ค่างวดต่อเดือนรวม VAT
    installmentVAT: "number", // VAT ของค่างวด
    paymentDay: "number", // วันที่ต้องจ่ายในแต่ละเดือน (1–31)
    paidInstallments: "number", // จำนวนงวดที่ชำระแล้ว
    remainingInstallments: "number", // จำนวนงวดคงเหลือ
    OVD: "number", // งวดที่ค้างชำระ (Overdue)
    last3Payments: "array<string>", // สถานะย้อนหลัง 3 เดือน เช่น [1,0,1]
    lastUpdate: "date", // วันที่อัปเดตสถานะล่าสุด
    outstanding: "number", // ยอดหนี้คงเหลือ
    unrealized: "number", // ดอกเบี้ยค้างรับ
    closeAmount: "number", // ยอดปิดบัญชี
    closeDate: "date", // วันที่ปิดบัญชี
    financeName: "string", // ชื่อไฟแนนซ์
    remark: "string", // หมายเหตุ
    isSubContract: "boolean", // true = เป็นสัญญาย่อย [ใหม่]
    assets: "array<Asset>", // ✅ รวมทรัพย์สินทุกชนิด (รถ, ที่ดิน, บ้าน ฯลฯ)
    subContracts: "array<SubContract>", // สัญญาย่อย (มีโครงสร้างเหมือน Contract)
    remark: ["number"], // หมายเหตุเพิ่มเติม
  },

  // ----------------------------------------------------
  // 🏡 Asset (ทรัพย์สินหลักประกันของสัญญา)
  // ----------------------------------------------------
  Asset: {
    // ------------------------------------------------
    // 🚗 ประเภท: รถยนต์ (Vehicle)
    // ------------------------------------------------
    Vehicle: {
      assetId: "string", // รหัสหลักประกัน (รถ)
      contractId: "string", // เชื่อมกับสัญญา
      type: "string", // ประเภทรถ เช่น เก๋ง, กระบะ, ตู้
      brand: "string", // ยี่ห้อ
      model: "string", // รุ่น
      subModel: "string", // รุ่นย่อย
      year: "number", // ปีรถ
      licensePlate: "string", // ทะเบียน
      color: "string", // สี
      carFirstPrice: "number", // ราคาซื้อขายแรกเข้า
      carPrice: "number", // ราคาในรายการ
      appraisedValue: "number", // ราคาประเมินจริง
      mileage: "number", // เลขไมล์
      dataSource: "string", // แหล่งข้อมูลรถ เช่น 'manual', 'priceList'
      channelMergeNode: "string", // รหัสรุ่นจากฐานราคารถกลาง
      remark: "string", // หมายเหตุ
    },

    // ------------------------------------------------
    // 🏡 ประเภท: โฉนดที่ดิน (Land Title Deed)
    // ------------------------------------------------
    Land: {
      assetId: "string", // รหัสหลักประกัน (ที่ดิน)
      contractId: "string", // เชื่อมกับสัญญา
      type: "string", // ประเภท เช่น โฉนด, น.ส.3ก, ภบท.5
      deedNumber: "string", // เลขที่โฉนด
      surveyNo: "string", // เลขที่ระวาง / สำรวจ
      landNumber: "string", // หมายเลขที่ดิน
      titleOwner: "string", // ชื่อเจ้าของกรรมสิทธิ์
      province: "string", // จังหวัด
      district: "string", // อำเภอ
      subDistrict: "string", // ตำบล
      areaRai: "number", // พื้นที่ (ไร่)
      areaNgan: "number", // พื้นที่ (งาน)
      areaSquareWa: "number", // พื้นที่ (ตารางวา)
      totalArea: "number", // พื้นที่รวม (ตารางเมตร)
      appraisedValue: "number", // ราคาประเมิน (บาท)
      marketValue: "number", // ราคาตลาด (บาท)
      usageType: "string", // การใช้ประโยชน์ เช่น ที่อยู่อาศัย, พาณิชย์
      coordinate: "string", // พิกัด (latitude, longitude)
      landDocPath: "string", // เอกสารแนบ (สำเนาโฉนด)
      remark: "string", // หมายเหตุ
    },
  },

  // ----------------------------------------------------
  // 💰 ตารางราคารถกลาง (CarPriceList)
  // ----------------------------------------------------
  CarPriceList: {
    id: "string", // รหัสรายการราคารถ
    brand: "string", // ยี่ห้อ เช่น Toyota
    model: "string", // รุ่นหลัก เช่น Camry
    subModel: "string", // รุ่นย่อย เช่น 2.0G AT
    year: "number", // ปีผลิต
    marketPrice: "number", // ราคาตลาดเฉลี่ย
    minPrice: "number", // ราคาต่ำสุด
    maxPrice: "number", // ราคาสูงสุด
    source: "string", // แหล่งข้อมูล เช่น one2car, kaidee
    vinPattern: "string", // รหัส VIN ที่ใช้จับคู่
    matchScore: "number", // คะแนนความใกล้เคียงจาก n8n
    syncAt: "datetime", // วันที่ดึงข้อมูลราคารถล่าสุด
    remark: "string", // หมายเหตุ
  },

  // ----------------------------------------------------
  // 📄 SubContract (เหมือน Contract แต่ไม่มี subContracts)
  // ----------------------------------------------------
  SubContract: {
    subId: "string", // รหัสสัญญาย่อย
    parentContractId: "string", // อ้างถึงสัญญาหลัก
    // ใช้ฟิลด์เหมือน Contract ทั้งหมด แต่ไม่มี subContracts[]
  },

  // ----------------------------------------------------
  // 📞 Log (บันทึกการติดต่อ / การโทร / การติดตามลูกค้า)
  // ----------------------------------------------------
  log: {
    id: "string", // รหัส log
    leadId: "string", // รหัสลีดที่เกี่ยวข้อง
    contractId: "string", // รหัสสัญญาที่เกี่ยวข้อง (ถ้ามี)
    loanTypePresented: "string", // ประเภทสินเชื่อที่นำเสนอ (ถ้ามี)
    assertsedOffered: "string", // หลักประกันที่เสนอ (ถ้ามี)
    type: "string", // ประเภท log เช่น 'การโทร', 'นัดหมาย'
    title: "string", // หัวข้อย่อ เช่น 'โทรติดต่อลูกค้า'
    description: "string", // รายละเอียด
    dateTime: "datetime", // วันที่และเวลา
    createdBy: "string", // ผู้สร้าง log
    createdAt: "datetime", // วันที่สร้าง
    updatedAt: "datetime", // วันที่แก้ไขล่าสุด
    dateAppointment: "datetime", // วันที่นัดหมาย (ถ้ามี)
    contactStatus: "string", // สถานะการติดต่อ เช่น 'ติดต่อได้', 'ติดต่อไม่ได้'
    callStatus: "string", // สถานะการโทร เช่น 'ไม่รับสาย', 'สายไม่ว่าง', 'ปิดเครื่อง', 'รับสาย'
    interestStatus: "string", // สถานะความสนใจ เช่น 'สนใจ', 'รอดู', 'ไม่สนใจ'
    interestLevel: "number", // ระดับความสนใจ (1–5 ดาว)
    processStage: "string", // อยู่ในกระบวนการใด เช่น 'นำเสนอ', 'เสนออนุมัติ', 'ปิดการขาย'
    priceProposed: "number", // ราคาที่เสนอ
    loanAmountProposed: "number", // วงเงินสินเชื่อที่เสนอ
    percentAmountProposed: "number", // เปอร์เซ็นต์ที่เสนอ
    monthsProposed: "number", // จำนวนเดือนที่เสนอ
    step1Installments: "number", // ค่างวด Step ที่ 1
    step2Installments: "number", // ค่างวด Step ที่ 2
    step1Months: "number", // งวด Step ที่ 1
    step2Months: "number", // งวด Step ที่ 2
    expenses1: "number", // ค่าใช้จ่ายเบื้องต้น
    expenses2: "number", // ค่าใช้จ่ายเพิ่มเติม
    expenses3: "number", // ค่าใช้จ่ายอื่น ๆ
    expenses1Detail: "string", // รายละเอียดค่าใช้จ่ายเบื้องต้น
    expenses2Detail: "string", // รายละเอียดค่าใช้จ่ายเพิ่มเติม
    expenses3Detail: "string", // รายละเอียดค่าใช้จ่ายอื่น ๆ
    followUpDate: "datetime", // วันที่ติดตามผลครั้งถัดไป
    customerResponse: "string", // คำตอบของลูกค้า
    nextAction: "string", // การดำเนินการต่อ เช่น 'โทรติดตาม'
    logRating: "number | ''", // คะแนน rating ต่อครั้ง (1–5 ดาว)
    logBlacklist: "boolean | ''", // สถานะ blacklist ต่อครั้ง (ติดลบ/ไม่ติดลบ)
    remark: "string", // หมายเหตุเพิ่มเติม
  },
};

// --------------------------------------------------------
// ✅ เผยแพร่ให้ระบบอื่น (เช่น app.js) เข้าถึงได้ทั่วทั้งระบบ
// --------------------------------------------------------
window.DataSpec = DataSpec;
