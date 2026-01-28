(function (global) {
  const { computed } = Vue;

  // 1. สร้าง Configuration Object เก็บไว้เฉยๆ ก่อน
  const DialogAutoFillComponent = {
    name: "dialog-autofill",
    template: `
            <v-dialog v-model="isOpenModalLeadAutoFill" max-width="600px">
                <v-card>
                    <v-card-title class="bg-deep-purple text-white d-flex align-center">
                        <v-icon start>mdi-refresh-auto</v-icon>
                        เพิ่มข้อมูล Autofill
                        <v-spacer></v-spacer>
                        <v-btn icon variant="text" @click="close">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-alert type="info" variant="tonal" class="mb-3" density="compact">
                            วางข้อมูลดิบที่นี่ ระบบจะแยกแยะให้อัตโนมัติ
                        </v-alert>
                        <v-textarea 
                            v-model="localText" 
                            label="วางข้อมูล (Paste Here)" 
                            rows="6"
                            variant="outlined"
                            auto-grow
                        ></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="grey" variant="text" @click="close">ยกเลิก</v-btn>
                        <v-btn color="deep-purple" variant="flat" @click="process">ประมวลผล</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        `,
    setup() {
      console.log("tessssssssssssssssssssss");

      // Logic เชื่อมต่อ State กลาง (ตามที่คุยกันรอบที่แล้ว)
      const localIsOpen = computed({
        get: () => global.AppState.isOpenModalLeadAutoFill,
        set: (val) => {
          global.AppState.isOpenModalLeadAutoFill = val;
        },
      });

      const localText = computed({
        get: () => global.AppState.autofillText,
        set: (val) => {
          global.AppState.autofillText = val;
        },
      });

      const close = () => {
        localIsOpen.value = false;
      };

      const process = () => {
        // ส่ง Event หรือเรียก Logic กลาง
        console.log("Processing Autofill...");
        // ตัวอย่าง: global.DataExchange.parse(localText.value);
        localIsOpen.value = false;
      };

      return { localIsOpen, localText, close, process };
    },
  };

  // 2. ฝากไว้ที่ Global Window (เพื่อให้ app.js มองเห็น)
  // ไม่เรียก app.component() ที่นี่แล้ว เพื่อแก้ปัญหา Error
  global.DialogAutoFill = DialogAutoFillComponent;
})(window);
