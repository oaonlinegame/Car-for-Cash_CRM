// components/lead/leadSummaryBasicInfo.js
(function (global) {
  "use strict";

  const LeadSummaryBasicInfo = {
    // รับ Props 2 ตัว: lead (ข้อมูลใหม่/ที่กำลังแก้ไข), original (ข้อมูลเดิม)
    props: {
      lead: { type: Object, required: true },
      original: { type: Object, required: true },
    },
    template: `
        <v-card variant="outlined" rounded="xl" class="section-card section-card--lead-main mb-4">
            <v-card-title class="py-3">
                <div class="d-flex align-center">
                    <v-avatar size="32" color="blue-lighten-4" class="mr-3">
                        <v-icon size="small" icon="mdi-account-details-outline" color="blue-darken-2"></v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-body-1 font-weight-medium">ข้อมูลพื้นฐานลูกค้า</div>
                        <div class="text-caption text-grey-darken-1">ชื่อ / บริษัท · ผู้ติดต่อ · วันเกิด · คะแนน</div>
                    </div>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4 pb-3">
                <v-row dense>
                    
                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
                            ชื่อ-นามสกุล / บริษัท
                        </div>
                        <div class="text-body-1">
                            <span v-if="!original.firstName && lead.firstName"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.firstName }}
                            </span>
                            <span v-else-if="lead.firstName && original.firstName !== lead.firstName"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.firstName }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.firstName }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.firstName || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ผู้ติดต่อ</div>
                        <div class="text-body-1">
                            <span v-if="!original.ContactPerson && lead.ContactPerson"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.ContactPerson }}
                            </span>
                            <span v-else-if="lead.ContactPerson && original.ContactPerson !== lead.ContactPerson"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.ContactPerson }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.ContactPerson }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.ContactPerson || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="6" md="3">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ชื่อเล่น</div>
                        <div class="text-body-1">
                            <span v-if="!original.nickName && lead.nickName"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.nickName }}
                            </span>
                            <span v-else-if="lead.nickName && original.nickName !== lead.nickName"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.nickName }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.nickName }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.nickName || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="6" md="3">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">วันเกิด</div>
                        <div class="text-body-1">
                            <span v-if="!original.birthDate && lead.birthDate"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.birthDate }}
                            </span>
                            <span v-else-if="lead.birthDate && original.birthDate !== lead.birthDate"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.birthDate }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.birthDate }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.birthDate || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">อาชีพ</div>
                        <div class="text-body-1">
                            <span v-if="!original.occupation && lead.occupation"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.occupation }}
                            </span>
                            <span v-else-if="lead.occupation && original.occupation !== lead.occupation"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.occupation }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.occupation }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.occupation || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
                            คะแนนลูกค้า (Rating)
                        </div>
                        <div>
                            <span v-if="!original.rating && lead.rating"
                                class="d-inline-flex align-center text-green-darken-3 font-weight-bold bg-green-lighten-5 px-3 py-1 rounded">
                                <v-rating :model-value="lead.rating" color="amber-darken-2"
                                    density="compact" size="small" half-increments readonly></v-rating>
                                <span class="ml-2">({{ lead.rating }})</span>
                            </span>

                            <span v-else-if="lead.rating !== undefined && original.rating !== lead.rating"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="d-flex align-center text-grey mb-1">
                                    <span class="text-caption mr-2 text-decoration-line-through">
                                        เดิม: {{ original.rating || 0 }}
                                    </span>
                                    <v-rating :model-value="original.rating" color="grey-lighten-1" 
                                        density="compact" size="x-small" half-increments readonly></v-rating>
                                </div>
                                <div class="d-flex align-center text-green-darken-4 font-weight-bold">
                                    <v-icon color="green" size="small" class="mr-2">mdi-arrow-right</v-icon>
                                    <v-rating :model-value="lead.rating" color="amber-darken-2"
                                        density="compact" size="small" half-increments readonly></v-rating>
                                    <span class="ml-2">({{ lead.rating }})</span>
                                </div>
                            </span>

                            <span v-else class="d-flex align-center">
                                <v-rating :model-value="original.rating" color="amber-darken-2"
                                    density="compact" size="small" half-increments readonly></v-rating>
                                <span class="ml-2 text-grey-darken-3">
                                    ({{ original.rating || 0 }})
                                </span>
                            </span>
                        </div>
                    </v-col>

                </v-row>
            </v-card-text>
        </v-card>
        `,
  };

  // ส่งออกเป็น Global เพื่อให้ app.js เรียกใช้ได้
  global.LeadSummaryBasicInfo = LeadSummaryBasicInfo;
})(window);
