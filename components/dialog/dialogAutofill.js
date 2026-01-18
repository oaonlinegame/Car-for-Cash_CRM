(function (global) {
  "use strict";

  const template = `
    <v-dialog v-model="isOpen" max-width="600" scrollable>
      <v-card rounded="xl">
        <v-card-title class="bg-grey-lighten-4 py-3">
            <span class="font-weight-bold text-primary">
                <v-icon start>mdi-robot</v-icon> Smart Autofill
            </span>
            <v-spacer></v-spacer>
            <v-btn icon variant="text" @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
            <v-alert color="info" variant="tonal" class="mb-4" density="compact">
                วางข้อความจากแชทลูกค้า (ชื่อ, เบอร์, ทะเบียนรถ) เพื่อให้ระบบแยกข้อมูลอัตโนมัติ
            </v-alert>

            <v-textarea
                v-model="inputText"
                label="วางข้อความที่นี่"
                rows="5" variant="outlined" auto-grow
                placeholder="ตัวอย่าง: สนใจกู้เงินครับ นายมีชัย ใจดี 081-234-5678 ขับรถเก๋ง กก 8888 ปี 2021"
            ></v-textarea>

            <v-expand-transition>
                <div v-if="parsedData.hasData" class="mt-3 pa-3 border rounded bg-grey-lighten-5">
                    <div class="text-caption font-weight-bold mb-2">ข้อมูลที่พบ:</div>
                    <v-row dense>
                         <v-col cols="12" v-if="parsedData.names.length > 0">
                            <v-select v-model="parsedData.selectedName" :items="parsedData.names" label="ชื่อลูกค้า" density="compact" variant="outlined" bg-color="white" hide-details></v-select>
                         </v-col>
                         <v-col cols="6" v-if="parsedData.phone">
                            <v-text-field v-model="parsedData.phone" label="เบอร์โทร" density="compact" variant="outlined" bg-color="white" hide-details></v-text-field>
                         </v-col>
                         <v-col cols="6" v-if="parsedData.idCard">
                            <v-text-field v-model="parsedData.idCard" label="บัตรประชาชน" density="compact" variant="outlined" bg-color="white" hide-details></v-text-field>
                         </v-col>
                         <v-col cols="6" v-if="parsedData.carPlate">
                            <v-text-field v-model="parsedData.carPlate" label="ทะเบียนรถ" density="compact" variant="outlined" bg-color="white" hide-details></v-text-field>
                         </v-col>
                         <v-col cols="6" v-if="parsedData.carYear">
                            <v-text-field v-model="parsedData.carYear" label="ปีรถ" density="compact" variant="outlined" bg-color="white" hide-details></v-text-field>
                         </v-col>
                    </v-row>
                </div>
            </v-expand-transition>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3">
            <v-btn variant="text" @click="clear">ล้างค่า</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="elevated" :disabled="!parsedData.hasData" @click="confirm">
                <v-icon start>mdi-check</v-icon> ยืนยันนำเข้า
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  `;

  global.registerDialogAutofill = function (app) {
    app.component("dialog-autofill", {
      template: template,
      setup() {
        const { ref, watch, reactive, computed } = Vue;
        const inputText = ref("");

        const parsedData = reactive({
          hasData: false,
          phone: "",
          idCard: "",
          carPlate: "",
          carYear: "",
          names: [],
          selectedName: "",
        });

        // ✅ [แก้ไขจุดนี้] ใส่ตัวกันเหนียว (Defensive Check)
        // ถ้า AppState.isAutofillDialogOpen ไม่มีอยู่จริง ให้คืนค่า false ไปก่อน ไม่ให้พัง
        const isOpen = computed({
          get: () => {
            if (global.AppState && global.AppState.isAutofillDialogOpen) {
              return global.AppState.isAutofillDialogOpen.value;
            }
            return false; // กันตาย
          },
          set: (val) => {
            if (global.AppState && global.AppState.isAutofillDialogOpen) {
              global.AppState.isAutofillDialogOpen.value = val;
            } else {
              console.warn("⚠️ AppState.isAutofillDialogOpen missing!");
            }
          },
        });

        watch(inputText, (val) => {
          if (global.AutofillApp) {
            const res = global.AutofillApp.parse(val);
            Object.assign(parsedData, res);
          }
        });

        const confirm = () => {
          if (global.AutofillApp) {
            global.AutofillApp.applyToForm(parsedData);
            isOpen.value = false;
            inputText.value = "";
          }
        };

        const clear = () => {
          inputText.value = "";
          parsedData.hasData = false;
        };
        const close = () => (isOpen.value = false);

        return { isOpen, inputText, parsedData, confirm, clear, close };
      },
    });
  };
})(window);
