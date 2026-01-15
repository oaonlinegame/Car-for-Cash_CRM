(function (global) {
  "use strict";

  const template = `
    <v-card variant="outlined" rounded="xl" class="section-card mb-4">
        <v-card-title class="py-3 d-flex align-center">
            <v-avatar size="30" color="orange-lighten-4" class="mr-3">
                <v-icon size="small" icon="mdi-file-document-edit-outline" color="orange-darken-3"></v-icon>
            </v-avatar>
            <div class="text-body-1 font-weight-medium">ข้อมูลหลักของสัญญา</div>
            <v-spacer></v-spacer>
            <v-chip :color="getStatusColor(contract.status)" size="small" variant="flat">
                {{ contract.status || 'รอดำเนินการ' }}
            </v-chip>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4 pb-3">
            <v-row dense class="form-row">
                <v-col cols="12" md="6">
                    <v-text-field label="เลขที่สัญญา" v-model="contract.contractNo"
                        density="comfortable" variant="outlined" color="primary"
                        prepend-inner-icon="mdi-pound" hide-details="auto"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field label="วันที่ทำสัญญา" v-model="contract.contractDate"
                        type="date" density="comfortable" variant="outlined" color="primary"
                        hide-details="auto"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select label="ประเภทสัญญา" v-model="contract.type"
                        :items="Store.data.contractTypeOptions"
                        @update:model-value="onTypeChange"
                        density="comfortable" variant="outlined" color="primary"
                        prepend-inner-icon="mdi-file-tree" hide-details="auto"></v-select>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select label="สถานะสัญญา" v-model="contract.status"
                        :items="Store.data.contractStatusOptions"
                        density="comfortable" variant="outlined" color="primary"
                        prepend-inner-icon="mdi-list-status" hide-details="auto"></v-select>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    `;

  global.registerContractMainInfo = function (app) {
    app.component("contract-main-info", {
      template: template,
      props: ["contract"], // รับ Object สัญญาแต่ละใบจาก v-for
      setup(props) {
        // --- Local Logic (พฤติกรรมเฉพาะใน Component) ---

        const getStatusColor = (status) => {
          const colors = {
            ปกติ: "success",
            ปิดบัญชี: "grey",
            ค้างชำระ: "error",
            รอดำเนินการ: "warning",
          };
          return colors[status] || "primary";
        };

        const onTypeChange = (newType) => {
          console.log(`Contract Type changed to: ${newType}`);
          // ตรงนี้สามารถใส่ Logic เพิ่มเติมได้ เช่น ถ้าเปลี่ยนประเภทให้ล้างค่าบางอย่าง
        };

        return {
          Store,
          getStatusColor,
          onTypeChange,
        };
      },
    });
  };
})(window);
