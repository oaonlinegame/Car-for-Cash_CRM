(function (global) {
  "use strict";

  // --------------------------------------------------------
  // 📞 LEAD CONTACT INFO COMPONENT
  // --------------------------------------------------------
  // Component สำหรับจัดการช่องทางการติดต่อ (เบอร์โทร, Line, FB, ที่อยู่)
  // --------------------------------------------------------

  const template = `
    <v-card id="section-lead-contact" variant="outlined" rounded="xl" class="section-card section-card--lead-contact">
        <v-card-title class="py-3">
            <div class="d-flex align-center">
                <v-avatar size="30" color="teal-lighten-4" class="mr-3">
                    <v-icon size="small" icon="mdi-phone-message-outline" color="teal-darken-3"></v-icon>
                </v-avatar>
                <div>
                    <div class="text-body-1 font-weight-medium">
                        ช่องทางการติดต่อ
                    </div>
                    <div class="text-caption text-grey-darken-1">
                        เบอร์โทร · LINE · Facebook · ที่อยู่
                    </div>
                </div>
            </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4 pb-3">

            <v-row dense class="mb-2 form-row">
                <v-col cols="12" md="6">
                    <v-text-field label="เบอร์โทรศัพท์ (หลัก)"
                        v-model="lead.phones" density="comfortable"
                        variant="outlined" color="primary"
                        prepend-inner-icon="mdi-phone-outline"
                        hide-details="auto">
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field label="เบอร์โทรศัพท์ (สำรอง)"
                        v-model="lead.phone2" density="comfortable"
                        variant="outlined" color="primary"
                        prepend-inner-icon="mdi-phone-plus-outline"
                        hide-details="auto">
                    </v-text-field>
                </v-col>
            </v-row>

            <v-row dense class="mb-2 form-row">
                <v-col cols="12" md="6">
                    <v-text-field label="LINE ID" v-model="lead.lineId"
                        density="comfortable" variant="outlined" color="primary"
                        prepend-inner-icon="mdi-chat-processing-outline"
                        hide-details="auto"></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field label="Facebook" v-model="lead.facebook"
                        density="comfortable" variant="outlined" color="primary"
                        prepend-inner-icon="mdi-facebook"
                        hide-details="auto"></v-text-field>
                </v-col>
            </v-row>

            <v-row dense class="mb-2 form-row">
                <v-col cols="12" md="6">
                    <v-text-field label="ชื่อบุคคลอ้างอิง / ติดต่อฉุกเฉิน"
                        v-model="lead.refName" density="comfortable"
                        variant="outlined" color="primary"
                        prepend-inner-icon="mdi-account-alert-outline"
                        hide-details="auto">
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field label="เบอร์โทรบุคคลอ้างอิง"
                        v-model="lead.refPhone" density="comfortable"
                        variant="outlined" color="primary"
                        prepend-inner-icon="mdi-phone-alert-outline"
                        hide-details="auto">
                    </v-text-field>
                </v-col>
            </v-row>

            <v-row dense class="form-row">
                <v-col cols="12">
                    <v-textarea v-model="lead.address"
                        label="ที่อยู่ปัจจุบัน / ที่อยู่ตามทะเบียนบ้าน"
                        auto-grow rows="2" density="comfortable"
                        variant="outlined" color="primary"
                        prepend-inner-icon="mdi-map-marker-outline"
                        hide-details="auto"></v-textarea>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    `;

  global.registerLeadContactInfo = function (app) {
    app.component("lead-contact-info", {
      template: template,
      props: ["lead"], // รับค่า Object ลูกค้าเข้ามาแก้ไข
      setup() {
        return {};
      },
    });
  };
})(window);
