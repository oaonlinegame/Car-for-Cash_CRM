(function (global) {
    "use strict";

    // --------------------------------------------------------
    // 📝 LEAD NOTE & RATING COMPONENT
    // --------------------------------------------------------
    // ปรับปรุง UI:
    // 1. รวม Note และ Rating ไว้ใน Card เดียวกัน
    // 2. ใช้ Layered Design: Outer Blue-Grey -> Inner Grey -> White Input
    // --------------------------------------------------------

    const template = `
      <v-card id="section-lead-note"
          variant="outlined"
          rounded="xl"
          class="section-card section-card--lead-note bg-blue-grey-lighten-5">
          
          <v-card-title class="py-3">
              <div class="d-flex align-center">
                  <v-avatar size="30" color="blue-grey-lighten-4" class="mr-3">
                      <v-icon size="small" icon="mdi-note-text-outline" color="blue-grey-darken-2"></v-icon>
                  </v-avatar>
                  <div>
                      <div class="text-body-1 font-weight-medium">
                          หมายเหตุ & คะแนนลูกค้า
                      </div>
                      <div class="text-caption text-grey-darken-1">
                          บันทึกสิ่งที่ควรรู้เกี่ยวกับลูกค้ารายนี้
                      </div>
                  </div>
              </div>
          </v-card-title>
  
          <v-divider></v-divider>
  
          <v-card-text class="pt-4 pb-3">
              
              <v-sheet border class="pa-3 rounded-lg bg-grey-lighten-5 elevation-0">
                  
                  <v-row dense class="form-row">
                      <v-col cols="12">
                          <v-textarea v-model="lead.note" label="หมายเหตุเพิ่มเติม"
                              auto-grow rows="3" density="comfortable"
                              variant="outlined" bg-color="white" color="blue-grey"
                              prepend-inner-icon="mdi-pencil-outline"
                              hide-details="auto"></v-textarea>
                      </v-col>
                  </v-row>
  
                  <v-row dense class="mt-2 align-center">
                      <v-col cols="12">
                          <v-sheet class="d-flex align-center bg-white rounded px-3 py-2 border" elevation="0">
                              <span class="text-body-2 font-weight-bold text-grey-darken-2 mr-3 d-flex align-center">
                                  <v-icon start color="amber-darken-2" size="small">mdi-star-circle-outline</v-icon>
                                  ให้คะแนน (Rating):
                              </span>
  
                              <v-rating v-model="lead.rating" color="amber"
                                  active-color="amber-darken-2" hover
                                  density="compact" size="small"></v-rating>
  
                              <v-spacer></v-spacer>
                              
                              <span class="text-caption text-grey font-weight-bold bg-grey-lighten-4 px-2 py-1 rounded">
                                  {{ lead.rating || 0 }} / 5
                              </span>
                          </v-sheet>
                      </v-col>
                  </v-row>
  
              </v-sheet>
          </v-card-text>
      </v-card>
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