(function (global) {
  "use strict";

  const LeadSummaryAssetInfo = {
    props: {
      lead: { type: Object, required: true },
      original: { type: Object, required: true },
    },
    template: `
        <v-card variant="outlined" rounded="xl" class="section-card section-card--lead-asset mb-4">
            <v-card-title class="py-3">
                <div class="d-flex align-center">
                    <v-avatar size="32" color="light-green-lighten-4" class="mr-3">
                        <v-icon size="small" icon="mdi-shield-home-outline" color="light-green-darken-3"></v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-body-1 font-weight-medium">หลักทรัพย์ของลูกค้า (Assets)</div>
                        <div class="text-caption text-grey-darken-1">รถยนต์ · ที่ดิน · ประกัน · บำนาญ</div>
                    </div>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4 pb-3">

                <div v-if="(!lead.assets || lead.assets.length === 0) && (!original.assets || original.assets.length === 0)"
                    class="text-center py-4 text-grey-lighten-1">
                    <v-icon size="40" class="mb-2">mdi-shield-off-outline</v-icon>
                    <div class="text-caption">ไม่มีข้อมูลหลักทรัพย์</div>
                </div>

                <div v-else>
                    <div v-for="(asset, index) in (lead.assets || [])" :key="'diff-asset-'+index" class="mb-4">
                        
                        <div class="d-flex align-center justify-space-between mb-2">
                            <div class="text-subtitle-2 text-light-green-darken-3 font-weight-bold ml-1 d-flex align-center">
                                <v-icon size="small" start>mdi-circle-medium</v-icon>
                                รายการที่ {{ index + 1 }} : {{ asset.type || 'ไม่ระบุประเภท' }}
                                
                                <v-chip v-if="!original.assets || !original.assets[index]" size="x-small" color="green" variant="flat" class="ml-2 font-weight-bold">NEW</v-chip>
                                <v-chip v-else-if="JSON.stringify(original.assets[index]) !== JSON.stringify(asset)" size="x-small" color="amber-darken-3" variant="flat" class="ml-2 font-weight-bold">EDITED</v-chip>
                            </div>
                        </div>

                        <v-sheet border class="pa-3 rounded-lg" :class="(!original.assets || !original.assets[index]) ? 'bg-green-lighten-5' : 'bg-grey-lighten-5'">
                            <v-row dense>
                                
                                <v-col cols="12" md="6">
                                    <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ประเภท</div>
                                    <div class="text-body-1">{{ asset.type }}</div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">มูลค่า / ราคาประเมิน</div>
                                    <div class="text-body-1 font-weight-bold text-green-darken-4">
                                        {{ diffValue(original.assets?.[index]?.value, asset.value, true) }}
                                    </div>
                                </v-col>

                                <template v-if="['รถยนต์', 'รถบรรทุก', 'รถตู้', 'มอเตอร์ไซค์', 'บิ๊กไบค์'].includes(asset.type)">
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ยี่ห้อ</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.brand, asset.brand) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">รุ่น (Model)</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.model, asset.model) }}</div>
                                    </v-col>
                                    <v-col cols="6" md="3">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ปีรถ</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.year, asset.year) }}</div>
                                    </v-col>
                                    <v-col cols="6" md="3">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">เครื่อง (CC)</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.engineSize, asset.engineSize) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">เลขเครื่อง</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.engineNo, asset.engineNo) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">เลขตัวรถ</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.chassisNo, asset.chassisNo) }}</div>
                                    </v-col>
                                    <v-col cols="12">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ลำดับ PL</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.plSequence, asset.plSequence) }}</div>
                                    </v-col>
                                </template>

                                <template v-if="asset.type === 'รถการเกษตร'">
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ประเภทรถเกษตร</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.subType, asset.subType) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">รายละเอียด (รุ่น/ปี)</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.details, asset.details) }}</div>
                                    </v-col>
                                </template>

                                <template v-if="asset.type === 'ประกัน'">
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ประเภทประกัน</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.subType, asset.subType) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">วันหมดอายุ</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.expiryDate, asset.expiryDate) }}</div>
                                    </v-col>
                                    <v-col cols="12">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ความคุ้มครอง</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.coverage, asset.coverage) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">เบี้ยประกัน</div>
                                        <div class="text-body-1">{{ diffValue(original.assets?.[index]?.premium, asset.premium, true) }}</div>
                                    </v-col>
                                </template>

                                <template v-if="asset.type === 'บำนาญ'">
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">จำนวนเงิน/เดือน</div>
                                        <div class="text-body-1">{{ diffValue(original.assets?.[index]?.pensionAmount, asset.pensionAmount, true) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">หน่วยงาน</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.details, asset.details) }}</div>
                                    </v-col>
                                </template>

                                <template v-if="asset.type === 'โฉนดที่ดิน/ห้องชุด/คอนโด'">
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">เลขที่โฉนด</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.deedNo, asset.deedNo) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ขนาด (ไร่/งาน/วา)</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.landSize, asset.landSize) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">อำเภอ</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.district, asset.district) }}</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">จังหวัด</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.province, asset.province) }}</div>
                                    </v-col>
                                </template>

                                <template v-if="['อื่นๆ', ''].includes(asset.type)">
                                    <v-col cols="12">
                                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">รายละเอียด</div>
                                        <div class="text-body-1">{{ diffText(original.assets?.[index]?.details, asset.details) }}</div>
                                    </v-col>
                                </template>

                                <v-col cols="12" v-if="asset.note || (original.assets?.[index]?.note)">
                                    <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">หมายเหตุ (Note)</div>
                                    <div class="text-body-2 bg-white pa-2 rounded border border-dashed text-grey-darken-3">
                                        {{ diffText(original.assets?.[index]?.note, asset.note) }}
                                    </div>
                                </v-col>

                            </v-row>
                        </v-sheet>
                    </div>

                    <div v-if="original.assets && original.assets.length > (lead.assets ? lead.assets.length : 0)">
                        <div class="d-flex align-center mt-6 mb-3">
                            <v-icon color="error" class="mr-2">mdi-delete-alert-outline</v-icon>
                            <span class="text-subtitle-2 font-weight-bold text-error">รายการที่ถูกลบออก (Deleted Items)</span>
                        </div>
                        <div v-for="(oldAsset, i) in original.assets.slice(lead.assets ? lead.assets.length : 0)" :key="'deleted-asset-'+i" class="mb-3">
                            <v-sheet border class="pa-3 rounded-lg bg-red-lighten-5 border-dashed" style="border-color: #ef5350 !important;">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-red-darken-4 font-weight-bold mb-1">{{ oldAsset.type }}</div>
                                        <div class="text-body-2 text-decoration-line-through text-grey-darken-2">
                                            {{ oldAsset.brand }} {{ oldAsset.model }} {{ oldAsset.details }}
                                            (฿{{ Number(oldAsset.value || 0).toLocaleString() }})
                                        </div>
                                    </div>
                                    <v-chip color="error" variant="flat" size="small" class="font-weight-bold">DELETED</v-chip>
                                </div>
                            </v-sheet>
                        </div>
                    </div>
                </div>

            </v-card-text>
        </v-card>
        `,
    methods: {
      // Helper function สำหรับแสดงข้อความ Diff (ใช้ใน Template)
      diffText(oldVal, newVal) {
        if (!oldVal && newVal) return newVal; // ใหม่
        if (oldVal && newVal && oldVal !== newVal)
          return `${oldVal} ➔ ${newVal}`; // แก้ไข
        return newVal || "-"; // เหมือนเดิม หรือ ว่าง
      },
      // Helper function สำหรับตัวเลข/เงิน
      diffValue(oldVal, newVal, isCurrency = false) {
        const format = (v) =>
          isCurrency ? "฿" + Number(v || 0).toLocaleString() : v;
        if (!oldVal && newVal) return format(newVal);
        if (oldVal && newVal && oldVal != newVal)
          return `${format(oldVal)} ➔ ${format(newVal)}`;
        return format(newVal);
      },
    },
  };

  global.LeadSummaryAssetInfo = LeadSummaryAssetInfo;
})(window);
