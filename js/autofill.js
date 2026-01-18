// js/autofill.js
(function (global) {
  "use strict";

  const AutofillApp = {
    // --------------------------------------------------------
    // 1. ส่วนวิเคราะห์ข้อความ (Parser)
    // --------------------------------------------------------
    parse(text) {
      const result = {
        hasData: false,
        phone: "",
        idCard: "",
        carPlate: "",
        carYear: "",
        names: [],
        selectedName: "",
      };

      if (!text) return result;

      // 1. หาเบอร์โทร
      const phoneMatch = text.match(/0\d{2}[-\s]?\d{3}[-\s]?\d{4}/);
      if (phoneMatch) result.phone = phoneMatch[0].replace(/[-\s]/g, "");

      // 2. หาเลขบัตรประชาชน
      const idMatch =
        text.match(/\d{1}[-\s]?\d{4}[-\s]?\d{5}[-\s]?\d{2}[-\s]?\d{1}/) ||
        text.match(/\d{13}/);
      if (idMatch) result.idCard = idMatch[0].replace(/[-\s]/g, "");

      // 3. หาปีรถ (19xx, 20xx, 25xx)
      const yearMatch = text.match(/(19|20|25)\d{2}/);
      if (yearMatch) result.carYear = yearMatch[0];

      // 4. หาทะเบียนรถ
      const plateMatch = text.match(/[ก-ฮ]{1,2}\s?\d{1,4}/);
      if (plateMatch) result.carPlate = plateMatch[0];

      // 5. หาชื่อ (ดักจับคำนำหน้า)
      const lines = text.split(/\r?\n/);
      lines.forEach((line) => {
        if (line.match(/^(นาย|นาง|น\.ส\.|นางสาว|คุณ|ด\.ช\.|ด\.ญ\.)/)) {
          result.names.push(line.trim());
        }
      });

      // ถ้าหาชื่อไม่เจอ ลองเอาบรรทัดแรกที่ยาวพอสมควร
      if (result.names.length === 0 && lines.length > 0) {
        const first = lines.find(
          (l) => l.trim().length > 5 && l.trim().length < 40,
        );
        if (first) result.names.push(first.trim());
      }

      // เซตค่า Default ชื่อแรก
      if (result.names.length > 0) result.selectedName = result.names[0];

      // สรุปสถานะ
      result.hasData = !!(
        result.phone ||
        result.idCard ||
        result.carPlate ||
        result.carYear ||
        result.names.length > 0
      );

      return result;
    },

    // --------------------------------------------------------
    // 2. ส่วนเติมข้อมูลลงฟอร์ม (Injector)
    // --------------------------------------------------------
    applyToForm(data) {
      // เช็คว่า LeadApp พร้อมไหม
      if (!global.LeadApp || !global.LeadApp.form) {
        global.AppNotification.error("ไม่พบฟอร์มสำหรับเติมข้อมูล");
        return;
      }

      const form = global.LeadApp.form;
      let count = 0;

      // เติมเบอร์โทร
      if (data.phone) {
        form.phones = data.phone;
        count++;
      }

      // เติมบัตรประชาชน
      if (data.idCard) {
        form.idCard = data.idCard;
        count++;
      }

      // เติมชื่อ (แยกนามสกุลแบบง่าย)
      if (data.selectedName) {
        const parts = data.selectedName.split(/\s+/);
        if (parts.length > 1) {
          form.firstName = parts[0];
          form.lastName = parts.slice(1).join(" ");
        } else {
          form.firstName = data.selectedName;
        }
        count++;
      }

      // เติมข้อมูลรถ (ถ้ามี)
      if (data.carPlate || data.carYear) {
        // สร้าง Asset เปล่าถ้ายังไม่มี
        if (!form.assets || form.assets.length === 0) {
          if (global.DataSpec)
            form.assets = [global.DataSpec.Asset.createDefault()];
          else form.assets = [{}];
        }

        const car = form.assets[0];
        if (data.carYear) {
          car.year = data.carYear;
          count++;
        }
        if (data.carPlate) {
          // เติมลงใน Note หรือ Details
          car.details = (car.details || "") + " ทะเบียน: " + data.carPlate;
          count++;
        }
      }

      if (count > 0) {
        global.AppNotification.success(`เติมข้อมูลแล้ว ${count} จุด`);

        // เปิดหน้า Add Lead อัตโนมัติ (ถ้ายังไม่เปิด)
        if (global.AppState) global.AppState.isDialogLeadOpen.value = true;
      } else {
        global.AppNotification.warning("ไม่พบข้อมูลใหม่");
      }
    },
  };

  global.AutofillApp = AutofillApp;
})(window);
