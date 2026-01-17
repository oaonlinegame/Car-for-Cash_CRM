(function (global) {
  "use strict";

  const template = `
    <v-card :id="'section-contract-info-' + index" variant="outlined" rounded="xl"
        class="section-card section-card--contract mb-4">
        
        <v-card-title class="py-3">
            <div class="d-flex align-center">
                <v-avatar size="30" color="indigo-lighten-4" class="mr-3">
                    <v-icon size="small" icon="mdi-file-document-outline"
                        color="indigo-darken-2"></v-icon>
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
            <v-row dense class="mb-2 form-row">
                <v-col cols="12">
                    <v-text-field v-model="contract.contractNo" label="เลขที่สัญญา"
                        variant="outlined" density="comfortable" color="primary"
                        prepend-inner-icon="mdi-pound-box" placeholder=""
                        hide-details></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-select label="ประเภทสัญญา"
                        :items="Store.data.contractTypeOptions"
                        v-model="contract.type" variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-file-certificate-outline"
                        hide-details></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-select label="สถานะสัญญา"
                        :items="Store.data.contractStatusOptions"
                        v-model="contract.status" variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-toggle-switch"
                        hide-details></v-select>
                </v-col>
            </v-row>

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
                        variant="outlined" density="compact"
                        prepend-inner-icon="mdi-calendar-start"
                        hide-details></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field type="number" v-model="contract.paymentDay"
                        label="วันดิวชำระ" suffix="ของเดือน" variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-bell-alert-outline"
                        hide-details></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-combobox label="เกรดลูกค้า"
                        :items="Store.data.gradeOptions"
                        v-model="lead.grade" variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-star-circle-outline"
                        hide-details="auto" clearable
                        @change="LeadApp.handleGradeChange(lead.grade)"
                        @keyup.enter="LeadApp.handleGradeChange(lead.grade)"></v-combobox>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field type="date" label="วันที่ Active ล่าสุด"
                        v-model="contract.lastActiveDate"
                        variant="outlined" density="compact"
                        prepend-inner-icon="mdi-clock-outline"
                        hide-details></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    `;

  global.registerContractMainInfo = function (app) {
    app.component("contract-main-info", {
      template: template,
      // รับค่า contract (Object), lead (Object) และ index
      props: ["contract", "lead", "index"],
      setup(props) {
        // ดึง Global References มาใช้งานใน Template
        return {
          Store,
          LeadApp,
        };
      },
    });
  };
})(window);
