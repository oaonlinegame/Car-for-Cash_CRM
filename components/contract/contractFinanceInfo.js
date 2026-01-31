(function (global) {
    "use strict";

    // --------------------------------------------------------
    // 💰 CONTRACT FINANCE INFO COMPONENT
    // --------------------------------------------------------
    // ปรับปรุง UI (Layered Design):
    // 1. Outer Card: bg-teal-lighten-5 (ธีมการเงิน)
    // 2. Inner Sheet: bg-grey-lighten-5 (พื้นเทา)
    // 3. Inputs: bg-white (ช่องขาว)
    // --------------------------------------------------------

    const template = `
      <v-card :id="'section-contract-finance-' + index"
          variant="outlined"
          rounded="xl"
          class="section-card section-card--finance mb-4 bg-teal-lighten-5">
          
          <v-card-title class="py-3">
              <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                      <v-avatar size="30" color="teal-lighten-4" class="mr-3">
                          <v-icon size="small" icon="mdi-finance"
                              color="teal-darken-3"></v-icon>
                      </v-avatar>
                      <div>
                          <div class="text-body-1 font-weight-medium">
                              การเงิน & ยอดคงเหลือ
                          </div>
                          <div class="text-caption text-grey-darken-1">
                              Outstanding · ยอดปิดบัญชี · Unrealized
                          </div>
                      </div>
                  </div>
                  
                  <v-chip size="x-small" color="teal-darken-2" variant="flat">
                      <v-icon start size="x-small"
                          icon="mdi-shield-check-outline"></v-icon>
                      ความเสี่ยงต่ำ
                  </v-chip>
              </div>
          </v-card-title>
  
          <v-divider></v-divider>
  
          <v-card-text class="pt-4 pb-3">
              
              <v-sheet border class="pa-3 rounded-lg bg-grey-lighten-5 elevation-0">
                  <v-row dense>
                      <v-col cols="12">
                          <v-text-field label="Outstanding Balance (ยอดหนี้คงเหลือ)" prefix="฿"
                              v-model.number="contract.outstandingBalance"
                              variant="outlined" bg-color="white" density="comfortable"
                              prepend-inner-icon="mdi-cash-remove" hide-details
                              type="number"></v-text-field>
                      </v-col>
  
                      <v-col cols="12">
                          <v-text-field label="ยอดปิดบัญชี (ปัจจุบัน)" prefix="฿"
                              v-model.number="contract.closingAmount"
                              variant="outlined" bg-color="white" density="comfortable"
                              prepend-inner-icon="mdi-bank-check" hide-details
                              type="number"></v-text-field>
                      </v-col>
  
                      <v-col cols="12">
                          <v-text-field label="Unrealized Amount (ดอกเบี้ยรอรับรู้)" prefix="฿"
                              v-model.number="contract.unrealizedAmount"
                              type="number"
                              variant="outlined" bg-color="white" density="comfortable"
                              prepend-inner-icon="mdi-alert-circle-outline"
                              hide-details></v-text-field>
                      </v-col>
                  </v-row>
              </v-sheet>
  
          </v-card-text>
      </v-card>
      `;

    global.registerContractFinanceInfo = function (app) {
        app.component("contract-finance-info", {
            template: template,
            props: ["contract", "index"],
        });
    };
})(window);