// components/lead/leadSummarySourceInfo.js
(function (global) {
  "use strict";

  const LeadSummarySourceInfo = {
    props: {
      lead: { type: Object, required: true },
      original: { type: Object, required: true },
    },
    template: `
        <v-card variant="outlined" rounded="xl" class="section-card section-card--lead-source mb-4">
            <v-card-title class="py-3">
                <div class="d-flex align-center">
                    <v-avatar size="32" color="purple-lighten-4" class="mr-3">
                        <v-icon size="small" icon="mdi-bullhorn-outline" color="purple-darken-3"></v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-body-1 font-weight-medium">แหล่งที่มา (Source)</div>
                        <div class="text-caption text-grey-darken-1">ช่องทาง · แคมเปญ · ผู้แนะนำ · สาขา</div>
                    </div>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4 pb-3">
                <v-row dense>
                    
                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
                            ช่องทางที่มา (Source)
                        </div>
                        <div class="text-body-1">
                            <span v-if="!original.source && lead.source"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.source }}
                            </span>
                            <span v-else-if="lead.source && original.source !== lead.source"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.source }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.source }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3 font-weight-bold">
                                {{ lead.source || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
                            แคมเปญ / กิจกรรม
                        </div>
                        <div class="text-body-1">
                            <span v-if="!original.campaign && lead.campaign"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.campaign }}
                            </span>
                            <span v-else-if="lead.campaign && original.campaign !== lead.campaign"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.campaign }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.campaign }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ lead.campaign || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
                            สาขาที่ดูแล
                        </div>
                        <div class="text-body-1">
                            <span v-if="!original.branch && lead.branch"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.branch }}
                            </span>
                            <span v-else-if="lead.branch && original.branch !== lead.branch"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.branch }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.branch }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ lead.branch || '-' }}
                            </span>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
                            ผู้แนะนำ / Ref.
                        </div>
                        <div class="text-body-1">
                            <span v-if="!original.refSource && lead.refSource"
                                class="text-green-darken-3 font-weight-bold bg-green-lighten-5 px-2 py-1 rounded d-inline-block">
                                {{ lead.refSource }}
                            </span>
                            <span v-else-if="lead.refSource && original.refSource !== lead.refSource"
                                class="d-block bg-amber-lighten-5 pa-2 rounded border border-dashed"
                                style="border-color: #ffb300 !important;">
                                <div class="text-grey-darken-1 text-decoration-line-through mb-1">
                                    {{ original.refSource }}
                                </div>
                                <div class="text-green-darken-4 font-weight-bold d-flex align-center">
                                    <v-icon color="green" size="small" class="mr-1">mdi-arrow-right</v-icon>
                                    {{ lead.refSource }}
                                </div>
                            </span>
                            <span v-else class="text-grey-darken-3">
                                {{ lead.refSource || '-' }}
                            </span>
                        </div>
                    </v-col>

                </v-row>
            </v-card-text>
        </v-card>
        `,
  };

  global.LeadSummarySourceInfo = LeadSummarySourceInfo;
})(window);
