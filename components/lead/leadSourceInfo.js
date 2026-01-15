(function (global) {
  "use strict";

  // --------------------------------------------------------
  // 📢 LEAD SOURCE INFO COMPONENT
  // --------------------------------------------------------
  // Component สำหรับจัดการข้อมูลแหล่งที่มา (Source)
  // และรายละเอียดแคมเปญต่างๆ
  // --------------------------------------------------------

  const template = `
    <v-card id="section-lead-source" variant="outlined" rounded="xl" class="section-card section-card--lead-prospect">
        <v-card-title class="py-3">
            <div class="d-flex align-center">
                <v-avatar size="30" color="amber-lighten-4" class="mr-3">
                    <v-icon size="small" icon="mdi-bullhorn-outline" color="amber-darken-3"></v-icon>
                </v-avatar>
                <div>
                    <div class="text-body-1 font-weight-medium">
                        ข้อมูลแหล่งที่มา / แคมเปญ
                    </div>
                    <div class="text-caption text-grey-darken-1">
                        ช่องทางการได้ลูกค้า · ชื่อกิจกรรมหรือแคมเปญ
                    </div>
                </div>
            </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4 pb-3">
            <v-row dense class="form-row">
                <v-col cols="12">
                    <v-select label="แหล่งที่มา" v-model="lead.source"
                        :items="Store.data.sourceOptions" density="comfortable"
                        variant="outlined" color="primary"
                        prepend-inner-icon="mdi-bullhorn-outline"
                        hide-details="auto" placeholder="ระบุที่มาของลูกค้า...">
                    </v-select>
                </v-col>
            </v-row>

            <v-row dense class="form-row mt-2"
                v-if="['Facebook Page', 'Line', 'Tiktok'].includes(lead.source)">
                <v-col cols="12">
                    <v-text-field
                        :label="lead.source === 'Line' ? 'Line ID ลูกค้า' : 'ชื่อ Account ลูกค้า (' + lead.source + ')'"
                        v-model="lead.sourceSocialName"
                        density="comfortable" variant="outlined" color="primary"
                        prepend-inner-icon="mdi-at" hide-details="auto">
                    </v-text-field>
                </v-col>
            </v-row>

            <v-row dense class="form-row mt-2"
                v-if="['ลูกค้าเก่าแนะนำ', 'เพื่อน/ญาติแนะนำ'].includes(lead.source)">
                <v-col cols="12" md="6">
                    <v-text-field label="ชื่อผู้แนะนำ"
                        v-model="lead.sourceRefName" density="comfortable"
                        variant="outlined" color="primary"
                        prepend-inner-icon="mdi-account-star"
                        hide-details="auto">
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                        :label="lead.source === 'ลูกค้าเก่าแนะนำ' ? 'เลขที่สัญญา / ทะเบียน / เบอร์โทร' : 'เบอร์โทรศัพท์ผู้แนะนำ'"
                        v-model="lead.sourceRefContact"
                        density="comfortable" variant="outlined" color="primary"
                        :prepend-inner-icon="lead.source === 'ลูกค้าเก่าแนะนำ' ? 'mdi-card-account-details-outline' : 'mdi-phone'"
                        hide-details="auto">
                    </v-text-field>
                </v-col>
            </v-row>

            <v-row dense class="form-row mt-2"
                v-if="lead.source === 'งานอีเวนต์ กิจกรรมต่างๆ'">
                <v-col cols="12" md="7">
                    <v-text-field label="ชื่องาน / สถานที่จัดกิจกรรม"
                        v-model="lead.sourceEventName" density="comfortable"
                        variant="outlined" color="primary"
                        prepend-inner-icon="mdi-map-marker-star"
                        hide-details="auto">
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                    <v-text-field type="date" label="วันที่จัดงาน"
                        v-model="lead.sourceEventDate" density="comfortable"
                        variant="outlined" color="primary" hide-details="auto">
                    </v-text-field>
                </v-col>
            </v-row>

            <v-row dense class="form-row mt-2">
                <v-col cols="12">
                    <v-textarea label="หมายเหตุเพิ่มเติมเกี่ยวกับแหล่งที่มา"
                        v-model="lead.sourceNote" rows="2" auto-grow
                        density="comfortable" variant="outlined" color="primary"
                        prepend-inner-icon="mdi-note-edit-outline"
                        hide-details="auto">
                    </v-textarea>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    `;

  global.registerLeadSourceInfo = function (app) {
    app.component("lead-source-info", {
      template: template,
      props: ["lead"], // รับค่า leadForm
      setup() {
        // ส่ง Store ออกไปเพื่อให้ Template เข้าถึง Store.data.sourceOptions ได้
        return { Store };
      },
    });
  };
})(window);
