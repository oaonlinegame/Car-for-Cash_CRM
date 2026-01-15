(function (global) {
  "use strict";

  // --------------------------------------------------------
  // 🧩 FLOATING HUB COMPONENT
  // --------------------------------------------------------
  // ปุ่ม Floating Action Button (FAB) ที่ลอยอยู่มุมขวาล่าง
  // ทำหน้าที่เป็นศูนย์รวมคำสั่งด่วน (Hub) เช่น เลื่อนขึ้นบน, เพิ่มลูกค้า, AutoFill
  // --------------------------------------------------------

  const template = `
      <div style="position: fixed; bottom: 30px; right: 30px; z-index: 2000;">
        <v-menu location="top center" open-on-hover transition="slide-y-reverse-transition" :close-on-content-click="false">
  
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              color="deep-purple-darken-2"
              size="large"
              elevation="10"
              @click="handleMainClick"
            >
              <v-icon size="32">mdi-robot-angry</v-icon>
              <v-tooltip activator="parent" location="start">Auto Fill (Bot)</v-tooltip>
            </v-btn>
          </template>
  
          <div class="d-flex flex-column align-center mb-4 ga-3">
  
            <v-btn icon color="white" size="large" elevation="8" @click="scrollToTop">
              <v-icon color="grey-darken-3" size="28">mdi-arrow-up</v-icon>
              <v-tooltip activator="parent" location="start">เลื่อนขึ้นบนสุด</v-tooltip>
            </v-btn>
  
            <v-btn icon color="primary" size="large" elevation="8" @click="openAddLead">
              <v-icon size="28">mdi-plus</v-icon>
              <v-tooltip activator="parent" location="start">เพิ่มลูกค้าใหม่</v-tooltip>
            </v-btn>
  
          </div>
        </v-menu>
      </div>
    `;

  // ฟังก์ชันสำหรับลงทะเบียน Component เข้าสู่ Vue App (ถูกเรียกใช้โดย app.js)
  global.registerFloatingButton = function (app) {
    app.component("floating-hub", {
      template: template,
      setup() {
        // --- Actions & Methods ---

        // ฟังก์ชันเลื่อนหน้าจอส่วนเนื้อหา (v-card-text) ขึ้นบนสุด
        const scrollToTop = () => {
          const contentArea = document.querySelector(".v-card-text");
          if (contentArea) {
            contentArea.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          } else {
            // กรณีหาไม่เจอ ให้เลื่อน window แทน (Fallback)
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        };

        // เปิด Modal สำหรับเพิ่มลูกค้าใหม่
        const openAddLead = () => {
          // เรียกใช้ AppGui (Global Object) เพื่อเปิด Modal
          if (typeof AppGui !== "undefined") {
            AppGui.toggleMenu("isOpenModalLead");
          }
        };

        // ฟังก์ชันเมื่อกดปุ่มหลัก (เปิดหน้าต่าง Auto Fill)
        const handleMainClick = () => {
          if (typeof AppGui !== "undefined") {
            AppGui.toggleMenu("isOpenModalLeadAutoFill");
          }
        };

        return {
          scrollToTop,
          openAddLead,
          handleMainClick,
        };
      },
    });
  };
})(window);
