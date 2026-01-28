// components/lead/leadSummaryContactInfo.js
(function (global) {
  "use strict";

  const LeadSummaryContactInfo = {
    props: {
      lead: { type: Object, required: true },
      original: { type: Object, required: true },
    },
    template: `
        <v-card variant="outlined" rounded="xl" class="section-card section-card--lead-contact mb-4">
            <v-card-title class="py-3">
                <div class="d-flex align-center">
                    <v-avatar size="32" color="teal-lighten-4" class="mr-3">
                        <v-icon size="small" icon="mdi-phone-message-outline" color="teal-darken-3"></v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-body-1 font-weight-medium">ช่องทางการติดต่อ</div>
                        <div class="text-caption text-grey-darken-1">เบอร์โทร · LINE · Facebook · ที่อยู่</div>
                    </div>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4 pb-3">
                <v-row dense>
                    
                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
                            เบอร์โทรศัพท์ (หลัก)
                        </div>
                        <div class="text-body-1 font-weight-bold">
                            <span v-if="!original.phones && lead.phones"
                                class="text-green-darken-3 bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.phones }}
                            </span>
                            <span v-else-if="lead.phones && original.phones !== lead.phones"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.phones }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.phones }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.phones || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
                            เบอร์โทรศัพท์ (สำรอง)
                        </div>
                        <div class="text-body-1">
                            <span v-if="!original.phone2 && lead.phone2"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.phone2 }}
                            </span>
                            <span v-else-if="lead.phone2 && original.phone2 !== lead.phone2"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.phone2 }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.phone2 }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.phone2 || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">Line ID</div>
                        <div class="text-body-1">
                            <span v-if="!original.lineId && lead.lineId"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.lineId }}
                            </span>
                            <span v-else-if="lead.lineId && original.lineId !== lead.lineId"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.lineId }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.lineId }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.lineId || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">Facebook</div>
                        <div class="text-body-1">
                            <span v-if="!original.facebook && lead.facebook"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.facebook }}
                            </span>
                            <span v-else-if="lead.facebook && original.facebook !== lead.facebook"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.facebook }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.facebook }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.facebook || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">ที่อยู่ปัจจุบัน</div>
                        <div class="text-body-1" style="line-height: 1.6;">
                            <span v-if="!original.address && lead.address"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.address }}
                            </span>
                            <span v-else-if="lead.address && original.address !== lead.address"
                                class="d-block bg-amber-lighten-5 pa-3 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-2">
                                    {{ original.address }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-start">
                                    <v-icon color="green" size="small" class="mr-2 mt-1">mdi-arrow-right</v-icon>
                                    {{ lead.address }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.address || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">บุคคลอ้างอิง</div>
                        <div class="text-body-1">
                            <span v-if="!original.refName && lead.refName"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.refName }}
                            </span>
                            <span v-else-if="lead.refName && original.refName !== lead.refName"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.refName }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.refName }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.refName || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
                            เบอร์โทรบุคคลอ้างอิง
                        </div>
                        <div class="text-body-1">
                            <span v-if="!original.refPhone && lead.refPhone"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.refPhone }}
                            </span>
                            <span v-else-if="lead.refPhone && original.refPhone !== lead.refPhone"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.refPhone }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.refPhone }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ original.refPhone || '-' }}
                            </span>
                        </div>
                    </v-col>

                </v-row>
            </v-card-text>
        </v-card>
        `,
  };

  global.LeadSummaryContactInfo = LeadSummaryContactInfo;
})(window);
