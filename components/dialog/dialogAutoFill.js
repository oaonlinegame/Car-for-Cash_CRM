// components/dialog/dialogAutoFill.js
(function (window) {
  "use strict";

  const template = `
    <v-dialog v-model="isOpen" max-width="700" scrollable>
        <v-card class="rounded-xl"
            style="height: 90vh; display: flex; flex-direction: column; overflow: hidden; background: #fff;">

            <v-card-title class="py-3 px-5 d-flex align-center justify-space-between flex-shrink-0"
                style="border-bottom: 1px solid rgba(0,0,0,0.08); background: #fff; z-index: 10;">
                <div class="d-flex align-center">
                    <v-avatar size="34" color="deep-purple-darken-2" class="mr-3">
                        <v-icon color="white">mdi-auto-upload</v-icon>
                    </v-avatar>
                    <span class="text-body-1 font-weight-medium">เพิ่มข้อมูล Auto fill</span>
                </div>
                <v-btn icon variant="text" density="compact" @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="px-4 py-4 flex-grow-1" style="overflow-y: auto; background: #fafafa;">
                <v-textarea 
                    v-model="inputData"
                    label="วางข้อมูลที่ต้องการ Auto fill ที่นี่"
                    placeholder="สามารถ copy จากโปรแกรม AS400 แล้ววางที่นี้ได้เลย..."
                    rows="25" 
                    auto-grow 
                    variant="outlined" 
                    density="comfortable"
                    prepend-inner-icon="mdi-text-box-multiple-outline" 
                    hide-details
                    class="h-100">
                </v-textarea>
            </v-card-text>

            <v-card-actions class="py-3 px-4 flex-shrink-0"
                style="background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); border-top: 1px solid rgba(0,0,0,0.05);">
                <v-spacer></v-spacer>
                <v-btn variant="text" color="grey-darken-1" @click="close">
                    ยกเลิก
                </v-btn>
                <v-btn color="deep-purple-darken-2" variant="flat" @click="handleSave" :disabled="!inputData">
                    บันทึก
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
  `;

  window.registerDialogAutoFill = function (app) {
    app.component("dialog-auto-fill", {
      template: template,
      setup() {
        const { ref, computed } = Vue;

        // เชื่อมต่อกับ AppState
        const isOpen = computed({
          get: () => window.AppState.isOpenModalLeadAutoFill.value,
          set: (val) => {
            window.AppState.isOpenModalLeadAutoFill.value = val;
          },
        });

        // Local state สำหรับข้อมูล Input
        const inputData = ref("");

        const close = () => {
          isOpen.value = false;
          // inputData.value = ""; // Optional: Clear data on close
        };

        const handleSave = () => {
          if (window.AppBot) {
            window.AppBot.autoFill(inputData.value);
            close();
            inputData.value = ""; // Clear after save
          } else {
            console.error("AppBot module not found");
          }
        };

        return {
          isOpen,
          inputData,
          close,
          handleSave,
        };
      },
    });
  };
})(window);
