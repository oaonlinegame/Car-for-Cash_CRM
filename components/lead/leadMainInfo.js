(function (global) {
    "use strict";

    // --------------------------------------------------------
    // 👤 LEAD MAIN INFO COMPONENT
    // --------------------------------------------------------
    // ปรับปรุง UI (Layered Design):
    // 1. Outer Card: bg-blue-lighten-5 (สีธีมฟ้า)
    // 2. Inner Sheet: bg-grey-lighten-5 (สีเทาอ่อนนุ่มนวล)
    // 3. Inputs: bg-white (สีขาวโดดเด่น)
    // --------------------------------------------------------

    const template = `
      <v-card id="section-lead-main"
          variant="outlined"
          rounded="xl"
          class="section-card section-card--lead-main bg-blue-lighten-5">
          
          <v-card-title class="py-3">
              <div class="d-flex align-center">
                  <v-avatar size="30" color="blue-lighten-4" class="mr-3">
                      <v-icon size="small" icon="mdi-account-details-outline" color="blue-darken-2"></v-icon>
                  </v-avatar>
                  <div>
                      <div class="text-body-1 font-weight-medium">
                          ข้อมูลพื้นฐานลูกค้า
                      </div>
                      <div class="text-caption text-grey-darken-1">
                          ชื่อ / บริษัท · ผู้ติดต่อ · วันเกิด · สถานะลูกค้าใหม่
                      </div>
                  </div>
              </div>
          </v-card-title>
  
          <v-divider></v-divider>
  
          <v-card-text class="pt-4 pb-3">
              
              <v-sheet border class="pa-3 rounded-lg bg-grey-lighten-5 elevation-0">
                  
                  <v-row dense class="mb-2 form-row">
                      <v-col cols="12" md="6">
                          <v-text-field v-model="lead.firstName"
                              label="ชื่อ / บริษัท" density="comfortable"
                              variant="outlined" bg-color="white" color="primary"
                              prepend-inner-icon="mdi-account"
                              hide-details="auto"></v-text-field>
                      </v-col>
  
                      <v-col cols="12" md="6">
                          <v-text-field v-model="lead.ContactPerson"
                              label="ผู้ติดต่อ" density="comfortable"
                              variant="outlined" bg-color="white" color="primary"
                              prepend-inner-icon="mdi-account-tie-outline"
                              hide-details="auto"></v-text-field>
                      </v-col>
                  </v-row>
  
                  <v-row dense class="mb-2 form-row">
                      <v-col cols="12" md="6">
                          <v-text-field v-model="lead.nickName" label="ชื่อเล่น"
                              density="comfortable" variant="outlined" bg-color="white" color="primary"
                              prepend-inner-icon="mdi-account"
                              hide-details="auto"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                          <v-text-field v-model="lead.birthDate" label="วันเกิด"
                              type="date" variant="outlined" bg-color="white" density="comfortable"
                              color="primary"
                              prepend-inner-icon="mdi-cake-variant-outline"
                              hide-details="auto"></v-text-field>
                      </v-col>
                  </v-row>
  
                  <v-row dense class="form-row">
                      <v-col cols="12" md="6">
                          <v-combobox label="อาชีพ" v-model="lead.occupation"
                              :items="Store.data.occupationOptions"
                              density="comfortable" variant="outlined" bg-color="white" color="primary"
                              prepend-inner-icon="mdi-briefcase-account-outline"
                              hide-details="auto"
                              placeholder="เลือกหรือพิมพ์เพื่อเพิ่มใหม่..."
                              @change="LeadApp.handleOccupationChange(lead.occupation)"
                              @keyup.enter="LeadApp.handleOccupationChange(lead.occupation)"
                              return-object="false"></v-combobox>
                      </v-col>
  
                      <v-col cols="12" md="6">
                          <v-text-field label="รายละเอียดอาชีพ / สถานที่ทำงาน"
                              v-model="lead.occupationDetail"
                              density="comfortable" variant="outlined" bg-color="white" color="primary"
                              prepend-inner-icon="mdi-domain" hide-details="auto">
                          </v-text-field>
                      </v-col>
                  </v-row>
                  
                  <v-row dense class="mt-2 form-row">
                      <v-col cols="12" md="6" class="d-flex align-center">
                          <v-switch color="primary" inset label="ลูกค้าใหม่"
                              v-model="lead.isProspect" density="compact" hide-details></v-switch>
                      </v-col>
                  </v-row>
  
              </v-sheet>
  
          </v-card-text>
      </v-card>
      `;

    global.registerLeadMainInfo = function (app) {
        app.component("lead-main-info", {
            template: template,
            props: ["lead"],
            setup() {
                return {
                    Store,
                    LeadApp,
                };
            },
        });
    };
})(window);