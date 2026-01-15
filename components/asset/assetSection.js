(function (global) {
  "use strict";

  // --------------------------------------------------------
  // 🏠 ASSET SECTION COMPONENT
  // --------------------------------------------------------
  // Component สำหรับจัดการรายการสินทรัพย์ (รถยนต์, ที่ดิน, ประกัน ฯลฯ)
  // รองรับการใช้งานกับทั้ง Lead และ Contract ผ่าน Props 'owner'
  // --------------------------------------------------------

  const template = `
    <v-card variant="outlined" rounded="xl" class="section-card section-card--lead-asset">
        <v-card-title class="py-3 d-flex align-center">
            <v-avatar size="30" color="light-green-lighten-4" class="mr-3">
                <v-icon size="small" icon="mdi-shield-home-outline" color="light-green-darken-3"></v-icon>
            </v-avatar>
            <div>
                <div class="text-body-1 font-weight-medium">
                    {{ title || 'หลักทรัพย์ของลูกค้า' }} 
                    ({{ owner.assets ? owner.assets.length : 0 }})
                </div>
                <div class="text-caption text-grey-darken-1">
                    รถยนต์ · ที่ดิน · ประกัน · บำนาญ
                </div>
            </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4 pb-3">

            <div v-if="owner.assets && owner.assets.length > 0">
                <div v-for="(asset, index) in owner.assets" :key="'asset-'+index" class="mb-4">

                    <div class="d-flex align-center justify-space-between mb-2">
                        <div class="text-subtitle-2 text-light-green-darken-3 font-weight-bold ml-1">
                            <v-icon size="small" start>mdi-circle-medium</v-icon>
                            หลักทรัพย์รายการที่ {{ index + 1 }}
                        </div>
                        <v-btn icon variant="text" size="small" color="grey"
                            v-if="owner.assets.length > 0"
                            @click="AssetApp.remove(owner, index)"
                            title="ลบรายการนี้">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>

                    <v-sheet border class="pa-3 rounded-lg bg-grey-lighten-5">

                        <v-row dense class="form-row mb-2">
                            <v-col cols="12">
                                <v-select label="ประเภทหลักทรัพย์"
                                    v-model="asset.type"
                                    :items="Store.data.assetTypeOptions"
                                    density="comfortable" variant="outlined"
                                    bg-color="white" color="primary"
                                    prepend-inner-icon="mdi-shield-home-outline"
                                    hide-details="auto">
                                </v-select>
                            </v-col>
                        </v-row>

                        <div v-if="['รถยนต์', 'รถบรรทุก', 'รถตู้', 'มอเตอร์ไซค์', 'บิ๊กไบค์'].includes(asset.type)">
                            <v-row dense class="form-row">
                                <v-col cols="12" md="6">
                                    <v-combobox label="ยี่ห้อ"
                                        v-model="asset.brand"
                                        :items="Store.data.carBrandOptions"
                                        density="comfortable" variant="outlined"
                                        bg-color="white"
                                        prepend-inner-icon="mdi-watermark"
                                        hide-details="auto"
                                        placeholder="เลือกหรือพิมพ์ใหม่แล้วกด Enter"
                                        @update:model-value="(val) => { CarApp.handleBrandChange(val); AssetApp.handleBrandChange(val); }"
                                        @keyup.enter="AssetApp.handleBrandChange(asset.brand)">
                                    </v-combobox>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รุ่น (Model)" v-model="asset.model"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field label="ปีรถ" v-model="asset.year" type="number"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field label="ขนาดเครื่อง (CC)" v-model="asset.engineSize"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ราคาประเมิน" v-model="asset.value" prefix="฿"
                                        type="number" density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="เลขเครื่อง" v-model="asset.engineNo"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        prepend-inner-icon="mdi-barcode" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="เลขตัวรถ" v-model="asset.chassisNo"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        prepend-inner-icon="mdi-car-chassis" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="ลำดับ PL" v-model="asset.plSequence"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        prepend-inner-icon="mdi-format-list-numbered" hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>
                        </div>

                        <div v-if="asset.type === 'รถการเกษตร'">
                            <v-row dense class="form-row">
                                <v-col cols="12">
                                    <v-select label="ประเภทรถเกษตร" v-model="asset.subType"
                                        :items="Store.data.agriVehicleTypeOptions"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        prepend-inner-icon="mdi-tractor" hide-details="auto">
                                    </v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="รายละเอียดเพิ่มเติม (รุ่น/ปี)" v-model="asset.details"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="มูลค่า / ราคาประเมิน" v-model="asset.value" prefix="฿"
                                        type="number" density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>
                        </div>

                        <div v-if="asset.type === 'ประกัน'">
                            <v-row dense class="form-row">
                                <v-col cols="12">
                                    <v-select label="ประเภทประกัน" v-model="asset.subType"
                                        :items="Store.data.insuranceTypeOptions"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        prepend-inner-icon="mdi-file-document-check-outline" hide-details="auto">
                                    </v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="ความคุ้มครอง (ชีวิต/มะเร็ง/บ้าน)" v-model="asset.coverage"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="เบี้ยประกัน" v-model="asset.premium" prefix="฿"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ทุนประกัน" v-model="asset.value" prefix="฿"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="วันที่หมดอายุ" v-model="asset.expiryDate" type="date"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>
                        </div>

                        <div v-if="asset.type === 'บำนาญ'">
                            <v-row dense class="form-row">
                                <v-col cols="12">
                                    <v-text-field label="จำนวนเงินบำนาญ / เดือน" v-model="asset.pensionAmount" prefix="฿"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        prepend-inner-icon="mdi-bank-transfer" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="หน่วยงานต้นสังกัด" v-model="asset.details"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>
                        </div>

                        <div v-if="asset.type === 'โฉนดที่ดิน/ห้องชุด/คอนโด'">
                            <v-row dense class="form-row">
                                <v-col cols="12" md="6">
                                    <v-text-field label="เลขที่โฉนด" v-model="asset.deedNo"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        prepend-inner-icon="mdi-file-certificate" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="จำนวน ไร่/งาน/วา/ห้อง" v-model="asset.landSize"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="อำเภอ" v-model="asset.district"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="จังหวัด" v-model="asset.province"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="ราคาประเมิน" v-model="asset.value" prefix="฿"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        prepend-inner-icon="mdi-scale-balance" hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>
                        </div>

                        <div v-if="['อื่นๆ', ''].includes(asset.type)">
                            <v-row dense class="form-row">
                                <v-col cols="12">
                                    <v-textarea label="รายละเอียดหลักทรัพย์" v-model="asset.details" rows="2"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="มูลค่าประมาณ" v-model="asset.value" prefix="฿"
                                        density="comfortable" variant="outlined" bg-color="white"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>
                        </div>

                        <v-row dense class="form-row mt-2" v-if="!['อื่นๆ', ''].includes(asset.type)">
                            <v-col cols="12">
                                <v-textarea label="รายละเอียดเพิ่มเติม / หมายเหตุ (Note)" v-model="asset.note" rows="2"
                                    auto-grow density="comfortable" variant="outlined" bg-color="white"
                                    prepend-inner-icon="mdi-note-edit-outline" hide-details="auto">
                                </v-textarea>
                            </v-col>
                        </v-row>

                    </v-sheet>
                </div>
            </div>

            <v-btn block variant="tonal" color="light-green-darken-3" class="mt-3" height="48"
                style="border: 1px dashed currentColor; opacity: 0.9;"
                @click="AssetApp.add(owner)">
                <v-icon start>mdi-plus-circle-outline</v-icon>
                เพิ่มรายการหลักทรัพย์
            </v-btn>

        </v-card-text>
    </v-card>
    `;

  global.registerAssetSection = function (app) {
    app.component("asset-section", {
      template: template,
      // รับ prop 'owner' เพื่อให้ใช้ได้ทั้ง leadForm และ Contract
      // รับ prop 'title' เผื่อต้องการเปลี่ยนหัวข้อ
      props: ["owner", "title"],
      setup(props) {
        return {
          Store,
          AssetApp,
          CarApp,
        };
      },
    });
  };
})(window);
