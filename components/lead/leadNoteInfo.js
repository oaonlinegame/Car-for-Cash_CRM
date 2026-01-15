(function (global) {
  "use strict";

  // --------------------------------------------------------
  // 📝 LEAD NOTE & RATING COMPONENT
  // --------------------------------------------------------
  // Component สำหรับจัดการหมายเหตุเพิ่มเติมและการให้คะแนนลูกค้า
  // (ใช้ Vue 3 Fragment: มี Root Element ได้มากกว่า 1 ตัว)
  // --------------------------------------------------------

  const template = `
    <v-card id="section-lead-note" variant="outlined" rounded="xl" class="section-card section-card--lead-note">
        <v-card-title class="py-3">
            <div class="d-flex align-center">
                <v-avatar size="30" color="blue-grey-lighten-4" class="mr-3">
                    <v-icon size="small" icon="mdi-note-text-outline" color="blue-grey-darken-2"></v-icon>
                </v-avatar>
                <div>
                    <div class="text-body-1 font-weight-medium">
                        หมายเหตุเพิ่มเติม
                    </div>
                    <div class="text-caption text-grey-darken-1">
                        บันทึกสิ่งที่ควรรู้เกี่ยวกับลูกค้ารายนี้
                    </div>
                </div>
            </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4 pb-3">
            <v-row dense class="form-row">
                <v-col cols="12">
                    <v-textarea v-model="lead.note" label="หมายเหตุ"
                        auto-grow rows="2" density="comfortable"
                        variant="outlined"
                        prepend-inner-icon="mdi-pencil-outline"
                        hide-details="auto"></v-textarea>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <v-row dense class="form-row mt-2">
        <v-col cols="12" class="d-flex align-center bg-grey-lighten-5 rounded px-3 py-1"
            style="border: 1px dashed #ddd;">
            <span class="text-body-2 font-weight-bold text-grey-darken-2 mr-3">
                <v-icon start color="amber-darken-2">mdi-star-circle-outline</v-icon>
                ให้คะแนนลูกค้า (Rating):
            </span>

            <v-rating v-model="lead.rating" color="amber"
                active-color="amber-darken-2" hover
                density="compact"></v-rating>

            <span class="text-caption text-grey ml-2">
                ({{ lead.rating }} / 5)
            </span>
        </v-col>
    </v-row>
    `;

  global.registerLeadNoteInfo = function (app) {
    app.component("lead-note-info", {
      template: template,
      props: ["lead"], // รับค่า leadForm
      setup() {
        return {};
      },
    });
  };
})(window);
