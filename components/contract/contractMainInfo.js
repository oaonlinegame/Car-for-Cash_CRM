(function (global) {
    "use strict";

    // --------------------------------------------------------
    // 📄 CONTRACT MAIN INFO COMPONENT
    // --------------------------------------------------------
    // ปรับปรุง UI (Layered Design):
    // 1. Outer Card: bg-indigo-lighten-5 (ธีมสัญญา)
    // 2. Inner Sheet: bg-grey-lighten-5 (พื้นเทา)
    // 3. Inputs: bg-white (ช่องขาว)
    // --------------------------------------------------------

    const template = `
      <v-card :id="'section-contract-info-' + index"
          variant="outlined"
          rounded="xl"
          class="section-card section-card--contract mb-4 bg-indigo-lighten-5">
          
          <v-card-title class="py-3">
              <div class="d-flex align-center">
                  <v-avatar size="30" color="indigo-lighten-3" class="mr-3">
                      <v-icon size="small" icon="mdi-file-document-outline"
                          color="indigo-darken-1"></v-icon>
                  </v-avatar>
                  <div>
                      <div class="text-body-1 font-weight-medium">
                          ข้อมูลสัญญา
                      </div>
                      <div class="text-caption text-grey-darken-1">
                          เลขที่สัญญา · ประเภท · สถานะ · วันที่สำคัญ
                      </div>
                  </div>
              </div>
          </v-card-title>
  
          <v-divider></v-divider>
  
          <v-card-text class="pt-4 pb-3">
              
              <v-sheet border class="pa-3 rounded-lg bg-grey-lighten-5 elevation-0">
                  <v-row dense class="mb-2 form-row">
                      <v-col cols="12">
                          <v-text-field v-model="contract.contractNo" label="เลขที่สัญญา"
                              variant="outlined" bg-color="white" density="comfortable" color="primary"
                              prepend-inner-icon="mdi-pound-box" placeholder=""
                              hide-details></v-text-field>
                      </v-col>
  
                      <v-col cols="12" sm="6">
                          <v-select label="ประเภทสัญญา"
                              :items="Store.data.contractTypeOptions"
                              v-model="contract.type" variant="outlined" bg-color="white"
                              density="comfortable"
                              prepend-inner-icon="mdi-file-certificate-outline"
                              hide-details></v-select>
                      </v-col>
  
                      <v-col cols="12" sm="6">
                          <v-select label="สถานะสัญญา"
                              :items="Store.data.contractStatusOptions"
                              v-model="contract.status" variant="outlined" bg-color="white"
                              density="comfortable"
                              prepend-inner-icon="mdi-toggle-switch"
                              hide-details></v-select>
                      </v-col>
                  </v-row>
  
                  <div class="my-3"></div>
  
                  <v-row dense class="mt-2 form-row">
                      <v-col cols="12"
                          class="text-subtitle-2 font-weight-medium text-grey-darken-1 mb-1 d-flex align-center">
                          <v-icon size="small" class="mr-1"
                              icon="mdi-calendar-month-outline"></v-icon>
                          วันที่ & ข้อมูลทั่วไป
                      </v-col>
  
                      <v-col cols="12" sm="6">
                          <v-text-field type="date" label="วันที่เริ่มสัญญา"
                              v-model="contract.startDate"
                              variant="outlined" bg-color="white" density="compact"
                              prepend-inner-icon="mdi-calendar-start"
                              hide-details></v-text-field>
                      </v-col>
  
                      <v-col cols="12" sm="6">
                          <v-text-field type="number" v-model="contract.paymentDay"
                              label="วันดิวชำระ" suffix="ของเดือน" variant="outlined" bg-color="white"
                              density="compact"
                              prepend-inner-icon="mdi-bell-alert-outline"
                              hide-details></v-text-field>
                      </v-col>
  
                      <v-col cols="12" sm="6">
                          <v-combobox label="เกรดลูกค้า"
                              :items="Store.data.gradeOptions"
                              v-model="lead.grade" variant="outlined" bg-color="white"
                              density="compact"
                              prepend-inner-icon="mdi-star-circle-outline"
                              hide-details="auto" clearable
                              @change="LeadApp.handleGradeChange(lead.grade)"
                              @keyup.enter="LeadApp.handleGradeChange(lead.grade)"></v-combobox>
                      </v-col>
  
                      <v-col cols="12" sm="6">
                          <v-text-field type="date" label="วันที่ Active ล่าสุด"
                              v-model="contract.lastActiveDate"
                              variant="outlined" bg-color="white" density="compact"
                              prepend-inner-icon="mdi-clock-outline"
                              hide-details></v-text-field>
                      </v-col>
                  </v-row>
              </v-sheet>
          </v-card-text>
      </v-card>
      `;

    global.registerContractMainInfo = function (app) {
        app.component("contract-main-info", {
            template: template,
            props: ["contract", "lead", "index"],
            setup(props) {
                return {
                    Store,
                    LeadApp,
                };
            },
        });
    };
})(window);