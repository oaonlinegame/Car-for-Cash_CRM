// components/lead/leadSummaryNoteInfo.js
(function (global) {
  "use strict";

  const LeadSummaryNoteInfo = {
    props: {
      lead: { type: Object, required: true },
      original: { type: Object, required: true },
    },
    template: `
        <v-card variant="outlined" rounded="xl" class="section-card section-card--lead-note mb-4">
            <v-card-title class="py-3">
                <div class="d-flex align-center">
                    <v-avatar size="32" color="amber-lighten-4" class="mr-3">
                        <v-icon size="small" icon="mdi-note-text-outline" color="amber-darken-4"></v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-body-1 font-weight-medium">หมายเหตุ (Notes)</div>
                        <div class="text-caption text-grey-darken-1">บันทึกเพิ่มเติม · ข้อควรระวัง</div>
                    </div>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4 pb-3">
                
                <div v-if="!original.note && lead.note">
                    <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">บันทึกข้อความ</div>
                    <v-sheet color="green-lighten-5" class="pa-3 rounded border border-dashed text-green-darken-4"
                        style="border-color: #2e7d32 !important;">
                        <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="green-darken-3" class="mr-2">mdi-plus-circle-outline</v-icon>
                            <span class="font-weight-bold text-caption">เพิ่มใหม่ (New)</span>
                        </div>
                        <div style="white-space: pre-wrap; line-height: 1.6;">{{ lead.note }}</div>
                    </v-sheet>
                </div>

                <div v-else-if="lead.note && original.note !== lead.note">
                    <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">บันทึกข้อความ</div>
                    
                    <v-sheet color="grey-lighten-4" class="pa-3 rounded border border-dashed mb-2" 
                        style="opacity: 0.7;">
                        <div class="text-caption text-grey-darken-1 text-decoration-line-through mb-1">ข้อความเดิม:</div>
                        <div class="text-grey-darken-1 text-decoration-line-through" 
                            style="white-space: pre-wrap; font-size: 0.9em;">{{ original.note }}</div>
                    </v-sheet>

                    <v-sheet color="amber-lighten-5" class="pa-3 rounded border border-dashed text-brown-darken-4"
                         style="border-color: #ff8f00 !important;">
                         <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="amber-darken-4" class="mr-2">mdi-pencil-outline</v-icon>
                            <span class="font-weight-bold text-caption text-amber-darken-4">แก้ไขเป็น (Changed To)</span>
                        </div>
                        <div style="white-space: pre-wrap; line-height: 1.6;">{{ lead.note }}</div>
                    </v-sheet>
                </div>

                <div v-else-if="lead.note">
                    <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">บันทึกข้อความ</div>
                    <v-sheet color="grey-lighten-5" class="pa-3 rounded border text-grey-darken-3">
                        <div style="white-space: pre-wrap; line-height: 1.6;">{{ lead.note }}</div>
                    </v-sheet>
                </div>

                <div v-else class="text-center py-4 text-grey-lighten-1">
                    <v-icon size="40" class="mb-2">mdi-note-off-outline</v-icon>
                    <div class="text-caption">ไม่มีบันทึกเพิ่มเติม</div>
                </div>

            </v-card-text>
        </v-card>
        `,
  };

  global.LeadSummaryNoteInfo = LeadSummaryNoteInfo;
})(window);
