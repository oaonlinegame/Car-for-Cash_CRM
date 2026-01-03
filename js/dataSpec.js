// js/dataSpec.js
// --------------------------------------------------------
// 📊 DATA SPECIFICATION MODULE
// --------------------------------------------------------
// โมดูลกำหนดโครงสร้างข้อมูล (Data Schema Definition)
// ทำหน้าที่ระบุรูปแบบมาตรฐานของ Object ที่ใช้ในระบบ (Model Factory)
// เพื่อให้การสร้างข้อมูลใหม่มีโครงสร้างที่ถูกต้องและครบถ้วนเสมอ
// --------------------------------------------------------

(function (global) {
  "use strict";

  const DataSpec = {
    // ========================================================================
    // 1. LEAD MODEL (ข้อมูลลูกค้า)
    // ========================================================================

    Lead: {
      /**
       * สร้าง Object ข้อมูล Lead เริ่มต้น (Default State)
       * @returns {Object} โครงสร้างข้อมูลลูกค้าที่ว่างเปล่าพร้อมใช้งาน
       */
      createDefault() {
        return {
          id: null, // Primary Key (Auto-Increment จาก IndexedDB)

          // --- Basic Info ---
          firstName: "", // ชื่อจริง
          lastName: "", // นามสกุล (ถ้ามีแยก)
          nickName: "", // ชื่อเล่น
          birthDate: "", // วันเกิด
          idCard: "", // เลขบัตรประชาชน
          occupation: "", // อาชีพ (ผูกกับ Master Data)
          occupationDetail: "", // [NEW] รายละเอียดอาชีพ / สถานที่ทำงาน

          // --- Contact Info ---
          phones: "", // เบอร์โทรศัพท์หลัก
          phone2: "", // [NEW] เบอร์โทรศัพท์สำรอง
          lineId: "", // Line ID
          facebook: "", // Facebook Account
          address: "", // ที่อยู่ปัจจุบัน

          // [NEW] ข้อมูลบุคคลอ้างอิง
          refName: "", // ชื่อบุคคลอ้างอิง
          refPhone: "", // เบอร์โทรบุคคลอ้างอิง

          // --- Source Info ---
          source: "", // แหล่งที่มา (ผูกกับ Master Data)
          sourceNote: "", // หมายเหตุแหล่งที่มา
          sourceSocialName: "", // ชื่อบัญชี Social (FB, Line, Tiktok)
          sourceRefName: "", // ชื่อผู้แนะนำ
          sourceRefContact: "", // เบอร์โทร หรือ เลขสัญญา ผู้แนะนำ
          sourceEventName: "", // ชื่องาน Event
          sourceEventDate: "", // วันที่จัดงาน
          isProspect: true, // สถานะเป็นลูกค้าใหม่ (true) หรือลูกค้าเก่า (false)

          createDate: null, // วันที่สร้างรายการ
          note: "", // บันทึกเพิ่มเติม (หมายเหตุลูกค้า)

          contracts: [], // Array เก็บรายการสัญญา (Sub-Contract)

          // --- Assets (หลักทรัพย์) ---
          // [UPDATED] เริ่มต้นด้วยรถยนต์ 1 คันทันที (เรียกใช้ Asset.createDefault)
          assets: [DataSpec.Asset.createDefault()],
          //  คะแนนลูกค้า (0-5)
          rating: 0,

          _searchIndex: "", // String สำหรับ Index การค้นหา (Generated)
        };
      },
    },

    // ========================================================================
    // 2. CONTRACT MODEL (ข้อมูลสัญญา)
    // ========================================================================

    Contract: {
      /**
       * สร้าง Object ข้อมูล Contract เริ่มต้น
       * @returns {Object} โครงสร้างข้อมูลสัญญาพร้อมวันที่ปัจจุบัน
       */
      createDefault() {
        return {
          contractId: "", // รหัสสัญญา (เช่น LN-2024-XXXX)
          contractNo: "", // เลขที่สัญญาจริง (ถ้ามี)
          signDate: new Date().toISOString().substr(0, 10), // วันที่ทำสัญญา (Default: วันนี้)

          // --- Finance Info ---
          financeAmount: 0, // ยอดจัดไฟแนนซ์
          interestRate: 0, // อัตราดอกเบี้ย
          terms: 0, // จำนวนงวด
          installment: 0, // ค่างวดต่อเดือน

          // --- Status ---
          status: "Draft", // สถานะสัญญาเริ่มต้น

          // --- Relations ---
          leadId: null, // Foreign Key อ้างอิง Lead
          guarantorId: null, // Foreign Key อ้างอิง ผู้ค้ำ (ถ้ามี)
        };
      },
    },

    // ========================================================================
    // 3. ASSET MODEL (ข้อมูลหลักทรัพย์)
    // ========================================================================

    Asset: {
      /**
       * สร้าง Object ข้อมูล Asset เริ่มต้น
       * @returns {Object} โครงสร้างข้อมูลหลักทรัพย์
       */
      createDefault() {
        return {
          // [UPDATED] เปลี่ยนค่าเริ่มต้นเป็น "รถยนต์" ตามที่ต้องการ
          type: "รถยนต์",
          subType: "", // ประเภทย่อย (เช่น ประกันชีวิต, รถไถ)

          // --- Common Fields ---
          details: "", // รายละเอียดทั่วไป
          value: "", // ราคาประเมิน / ทุนประกัน / มูลค่า
          note: "", // [NEW] หมายเหตุเพิ่มเติม

          // --- Car Specific ---
          brand: "", // ยี่ห้อ
          model: "", // รุ่น
          year: "", // ปี
          engineSize: "", // ขนาดเครื่อง (CC)
          engineNo: "", // เลขเครื่อง
          chassisNo: "", // เลขตัวถัง
          plSequence: "", // ลำดับ PL

          // --- Land Specific ---
          deedNo: "", // เลขที่โฉนด
          landSize: "", // ขนาด (ไร่/งาน/วา)
          province: "", // จังหวัด
          district: "", // อำเภอ

          // --- Insurance Specific ---
          coverage: "", // ความคุ้มครอง
          premium: "", // เบี้ยประกัน
          expiryDate: "", // วันหมดอายุ

          // --- Pension Specific ---
          pensionAmount: "", // ยอดเงินบำนาญต่อเดือน
        };
      },
    },
  };

  // ส่งออก DataSpec เป็น Global Object
  global.DataSpec = DataSpec;
})(window);
