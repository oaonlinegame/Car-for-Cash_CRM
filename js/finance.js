// js/finance.js
// --------------------------------------------------------
// 💰 Finance App (จัดการการคำนวณสินเชื่อ/การเงิน)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const FinanceApp = {
    // ----------------------------------------------------
    // ⭐ คำนวณค่างวด (ตัวอย่าง)
    // ----------------------------------------------------
    calculateInstallment(principal, rate, term) {
      if (!principal || !term) return 0;
      // Logic คำนวณดอกเบี้ย (Flat Rate / Effective Rate)
      // ตัวอย่าง Flat Rate:
      const interest = principal * (rate / 100) * (term / 12);
      const total = principal + interest;
      return Math.round(total / term);
    },

    // ----------------------------------------------------
    // ⭐ วิเคราะห์ความสามารถในการชำระหนี้ (DSR)
    // ----------------------------------------------------
    analyzeDSR(income, debt) {
      if (!income) return 0;
      return (debt / income) * 100;
    },
  };

  global.FinanceApp = FinanceApp;
})(window);
