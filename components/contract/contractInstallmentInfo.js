(function (global) {
  "use strict";

  const template = `
    <v-card v-if="contract" :id="sectionId || 'section-contract-installment-' + index" variant="outlined"
        rounded="xl" class="section-card section-card--installment mb-4">
        
        <v-card-title class="py-3">
            <div class="d-flex align-center">
                <v-avatar size="30" color="deep-purple-lighten-4" class="mr-3">
                    <v-icon size="small" icon="mdi-calendar-multiselect"
                        color="deep-purple-darken-2"></v-icon>
                </v-avatar>
                <div>
                    <div class="text-body-1 font-weight-medium">
                        รายละเอียดการผ่อนชำระ
                    </div>
                    <div class="text-caption text-grey-darken-1">
                        ค่างวด · จำนวนงวด · OVD · ยอดกู้
                    </div>
                </div>
            </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4 pb-3">
            <v-row dense class="mb-2 form-row">
                
                <v-col cols="6" sm="3">
                    <v-text-field label="ค่างวด/เดือน" prefix="฿"
                        v-model.number="contract.installmentAmount"
                        variant="outlined" density="compact"
                        prepend-inner-icon="mdi-cash-multiple"
                        hide-details type="number"></v-text-field>
                </v-col>

                <v-col cols="6" sm="3">
                    <v-text-field label="จำนวนงวดทั้งหมด" type="number"
                        v-model.number="contract.totalInstallments"
                        variant="outlined" density="compact"
                        prepend-inner-icon="mdi-counter"
                        hide-details></v-text-field>
                </v-col>

                <v-col cols="6" sm="3">
                    <v-text-field label="งวดที่ต้องจ่าย (ถึงปัจจุบัน)" type="number"
                        v-model.number="contract.installmentsDue"
                        variant="outlined" density="compact"
                        prepend-inner-icon="mdi-calendar-clock"
                        hide-details></v-text-field>
                </v-col>

                <v-col cols="6" sm="3">
                    <v-text-field label="จ่ายแล้ว (งวด)" type="number"
                        v-model.number="contract.paidInstallments"
                        variant="outlined" density="compact"
                        prepend-inner-icon="mdi-progress-check"
                        hide-details></v-text-field>
                </v-col>

                <v-col cols="6" sm="3">
                     <v-text-field label="คงเหลือ (งวด)" type="number"
                        :model-value="safeCalc(contract.totalInstallments, contract.paidInstallments)"
                        variant="filled" density="compact"
                        prepend-inner-icon="mdi-chart-donut" readonly
                        hide-details></v-text-field>
                </v-col>

                <v-col cols="6" sm="3">
                    <v-text-field label="OVD (ค้างชำระ)" type="number"
                        :model-value="safeCalc(contract.installmentsDue, contract.paidInstallments)"
                        :class="safeCalc(contract.installmentsDue, contract.paidInstallments) > 0 ? 'text-error font-weight-bold' : 'text-success'"
                        variant="filled" density="compact"
                        prepend-inner-icon="mdi-alert-circle-outline" readonly
                        hide-details></v-text-field>
                </v-col>

                <v-col cols="12" sm="3">
                    <v-text-field label="ยอดกู้ตั้งต้น" prefix="฿"
                        v-model="contract.initialAmount"
                        variant="outlined" density="compact"
                        prepend-inner-icon="mdi-cash-100"
                        hide-details></v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                    <v-text-field v-model="contract.collectionFee"
                        label="ค่าติดตามทวงถาม" prefix="฿" type="number"
                        variant="outlined" density="compact"
                        prepend-inner-icon="mdi-phone-alert-outline"
                        hide-details></v-text-field>
                </v-col>
            </v-row>

            <v-row dense class="mt-1 form-row">
                <v-col cols="12">
                    <v-textarea v-model="contract.note"
                        label="หมายเหตุ / ประวัติค่างวดย้อนหลัง"
                        rows="2" auto-grow variant="outlined" density="compact"
                        prepend-inner-icon="mdi-note-text-outline"
                        hide-details></v-textarea>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    `;

  global.registerContractInstallmentInfo = function (app) {
    app.component("contract-installment-info", {
      template: template,
      // เพิ่ม sectionId
      props: ["contract", "index", "sectionId"],
      setup() {
        const safeCalc = (a, b) => {
          return (Number(a) || 0) - (Number(b) || 0);
        };
        return { safeCalc };
      },
    });
  };
})(window);
