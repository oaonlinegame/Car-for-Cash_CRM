// js/setting.js
// --------------------------------------------------------
// ⚙️ AppSetting (การตั้งค่าเริ่มต้นของระบบ UI/Framework)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const AppSetting = {
    /**
     * เริ่มต้น Plugin และตั้งค่า UI Framework
     */
    init(vueApp) {
      if (!vueApp) {
        console.error("❌ AppSetting: ไม่พบ Vue Instance");
        return;
      }

      console.log("⚙️ AppSetting: Initializing system...");

      // 1. Vuetify Setup
      if (
        global.Vuetify &&
        global.AppConstants &&
        global.AppConstants.VUETIFY_CONFIG
      ) {
        const vuetify = Vuetify.createVuetify(
          global.AppConstants.VUETIFY_CONFIG
        );
        vueApp.use(vuetify);
      } else {
        console.warn("⚠️ AppSetting: Vuetify or Config missing");
      }

      // 2. Virtual Scroller
      if (global.VueVirtualScroller) {
        vueApp.use(global.VueVirtualScroller);
      }

      console.log("✅ AppSetting: System Initialized");
    },
  };

  global.AppSetting = AppSetting;
})(window);
