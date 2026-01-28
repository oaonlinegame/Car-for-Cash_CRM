(function (window) {
  "use strict";

  // ใช้ Backtick (`) เพื่อรองรับ Template หลายบรรทัด
  // แก้ไข: ใช้ Tag ปิดเต็มรูปแบบ (เช่น </v-text-field>) เพื่อป้องกันปัญหา HTML Parser
  const template = `
    <v-card style="backdrop-filter: blur(8px); background-color: rgba(255,255,255,0.95); overflow-x: hidden;">
        <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-filter-cog-outline</v-icon>
            ตัวกรองและการจัดเรียงข้อมูล Lead
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pt-4 pb-3">
            <v-container fluid class="pa-0">
                <v-row dense>
                    <v-col cols="12" sm="6" md="4">
                        <div class="text-subtitle-2 font-weight-medium mb-2 text-primary">
                            <v-icon size="small" class="mr-1">mdi-account-details-outline</v-icon>
                            ตัวกรองลูกค้า
                        </div>

                        <v-select 
                            label="สถานะลูกค้า"
                            :items="['ลูกค้าใหม่', 'ลูกค้าเช่าซื้อ', 'ลูกค้าจำนำทะเบียน', 'ติดตาม', 'ไม่สนใจ']"
                            density="compact" 
                            variant="outlined"
                            prepend-inner-icon="mdi-toggle-switch-outline" 
                            hide-details="auto"
                            class="mb-3">
                        </v-select>

                        <v-select 
                            label="คะแนน (Rating)" 
                            :items="[5, 4, 3, 2, 1]" 
                            density="compact"
                            variant="outlined" 
                            prepend-inner-icon="mdi-star-outline" 
                            hide-details="auto"
                            class="mb-3">
                        </v-select>

                        <v-select 
                            label="ขั้นตอนการขาย (Prospect Stage)"
                            :items="['สนใจ', 'รอเสนอ', 'รอเอกสาร', 'ปิดการขาย']" 
                            density="compact"
                            variant="outlined" 
                            prepend-inner-icon="mdi-progress-clock"
                            hide-details="auto" 
                            class="mb-3">
                        </v-select>

                        <v-switch 
                            label="เฉพาะลูกค้าใหม่ (ไม่เคยมีสัญญา)" 
                            color="primary" 
                            inset
                            hide-details>
                        </v-switch>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <div class="text-subtitle-2 font-weight-medium mb-2 text-teal-darken-1">
                            <v-icon size="small" class="mr-1">mdi-finance</v-icon>
                            ตัวกรองสัญญาและการเงิน
                        </div>

                        <v-select 
                            label="ประเภทสินเชื่อ"
                            :items="['จำนำทะเบียน', 'เช่าซื้อ', 'บำนาญ', 'โฉนดที่ดิน', 'อื่น ๆ']"
                            density="compact" 
                            variant="outlined"
                            prepend-inner-icon="mdi-file-document-edit-outline" 
                            hide-details="auto"
                            class="mb-3">
                        </v-select>

                        <v-select 
                            label="สถานะบัญชี"
                            :items="['ปกติ', 'ค้างชำระ', 'ปิดบัญชี', 'ฟ้องร้อง']" 
                            density="compact"
                            variant="outlined" 
                            prepend-inner-icon="mdi-alert-circle-outline"
                            hide-details="auto" 
                            class="mb-3">
                        </v-select>

                        <v-divider class="my-3"></v-divider>

                        <div class="text-subtitle-2 font-weight-medium mb-2 text-orange-darken-1">
                            <v-icon size="small" class="mr-1">mdi-car-side</v-icon>
                            ตัวกรองข้อมูลรถยนต์
                        </div>

                        <v-select 
                            v-model="selectedBrands"
                            label="ยี่ห้อรถ (Brand)"
                            :items="['Toyota', 'Honda', 'Isuzu', 'Nissan', 'Mazda', 'Mitsubishi']"
                            density="compact" 
                            variant="outlined" 
                            prepend-inner-icon="mdi-car-info"
                            hide-details="auto" 
                            class="mb-3" 
                            clearable 
                            multiple 
                            chips>
                            
                            <template v-slot:selection="{ item, index }">
                                <v-chip v-if="index < 2" size="x-small" color="primary" variant="flat">
                                    {{ item.title }}
                                </v-chip>
                                <span v-if="index === 2" class="text-caption text-grey ml-2">
                                    (+{{ selectedBrands.length - 2 }} others)
                                </span>
                            </template>
                        </v-select>

                        <v-text-field 
                            label="รุ่นรถ (Model) - พิมพ์เอง" 
                            density="compact"
                            variant="outlined" 
                            prepend-inner-icon="mdi-car-side" 
                            hide-details="auto"
                            class="mb-3" 
                            clearable>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <div class="text-subtitle-2 font-weight-medium mb-2 text-indigo-darken-1">
                            <v-icon size="small" class="mr-1">mdi-sort-ascending</v-icon>
                            ลำดับการจัดเรียง (Drag & Drop)
                        </div>

                        <v-btn size="small" variant="elevated" color="indigo-darken-1"
                            prepend-icon="mdi-plus" class="mb-3" block>
                            เพิ่มเงื่อนไขการเรียง
                        </v-btn>

                        <v-list density="compact" class="rounded-lg pa-0"
                            style="border: 1px solid #ddd; background: #fff;">
                            <v-list-item class="py-1" style="border-bottom: 1px solid #eee;">
                                <template #prepend>
                                    <v-icon color="grey-darken-1" class="mr-2"
                                        style="cursor: grab;">mdi-drag</v-icon>
                                </template>
                                <v-list-item-title class="text-caption font-weight-medium">
                                    #1 คะแนนลูกค้า (Rating)
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-caption text-indigo-darken-2">
                                    เรียงจาก: **มากไปน้อย**
                                </v-list-item-subtitle>
                                <template #append>
                                    <v-btn icon="mdi-swap-vertical" size="x-small" variant="text"
                                        color="indigo-darken-2" title="สลับทิศทาง (Asc/Desc)"></v-btn>
                                    <v-btn icon="mdi-close-circle-outline" size="x-small" variant="text"
                                        color="error" title="ลบเงื่อนไข"></v-btn>
                                </template>
                            </v-list-item>

                            <v-list-item class="py-1">
                                <template #prepend>
                                    <v-icon color="grey-darken-1" class="mr-2"
                                        style="cursor: grab;">mdi-drag</v-icon>
                                </template>
                                <v-list-item-title class="text-caption font-weight-medium">
                                    #2 วันที่สร้าง Lead (Create Date)
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-caption text-indigo-darken-2">
                                    เรียงจาก: **น้อยไปมาก**
                                </v-list-item-subtitle>
                                <template #append>
                                    <v-btn icon="mdi-swap-vertical" size="x-small" variant="text"
                                        color="indigo-darken-2" title="สลับทิศทาง (Asc/Desc)"></v-btn>
                                    <v-btn icon="mdi-close-circle-outline" size="x-small" variant="text"
                                        color="error" title="ลบเงื่อนไข"></v-btn>
                                </template>
                            </v-list-item>
                        </v-list>

                        <v-select 
                            label="เลือกคีย์สำหรับเพิ่ม"
                            :items="['ชื่อลูกค้า', 'วันที่สร้าง', 'คะแนนลูกค้า', 'ยอดหนี้คงเหลือ', 'สถานะสัญญา']"
                            density="compact" 
                            variant="outlined" 
                            prepend-inner-icon="mdi-key-variant"
                            hide-details="auto" 
                            class="mt-4">
                        </v-select>
                    </v-col>
                </v-row>

                <v-row dense class="mt-2">
                    <v-col cols="12" sm="6">
                        <v-range-slider 
                            label="ช่วงราคารถ (Appraised Value)" 
                            :min="0" :max="3000000"
                            thumb-label="always" 
                            step="50000" 
                            color="orange-darken-1"
                            track-color="orange-lighten-3" 
                            prepend-icon="mdi-cash-multiple" 
                            hide-details
                            class="pt-4">
                        </v-range-slider>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-range-slider 
                            label="งวดค้างชำระ (OVD)" 
                            :min="0" :max="12"
                            thumb-label="always" 
                            step="1" 
                            color="red-darken-1"
                            track-color="red-lighten-3" 
                            thumb-size="16"
                            prepend-icon="mdi-progress-clock" 
                            hide-details 
                            class="pt-4">
                        </v-range-slider>
                    </v-col>
                </v-row>

                <v-row dense class="mt-2">
                    <v-col cols="12">
                        <v-range-slider 
                            label="ช่วงยอดหนี้คงเหลือ (Outstanding Balance)" 
                            :min="0"
                            :max="5000000" 
                            thumb-label="always" 
                            step="10000" 
                            color="teal-darken-1"
                            track-color="teal-lighten-3" 
                            prepend-icon="mdi-currency-usd" 
                            hide-details
                            class="pt-4">
                        </v-range-slider>
                    </v-col>
                </v-row>

                <v-row dense class="mt-2">
                    <v-col cols="12">
                        <v-range-slider 
                            label="ช่วงยอดเงินคงเหลือรับ (Unrealized Amount)" 
                            :min="0"
                            :max="1000000" 
                            thumb-label="always" 
                            step="10000" 
                            color="green-darken-1"
                            track-color="green-lighten-3" 
                            prepend-icon="mdi-cash-plus" 
                            hide-details
                            class="pt-4">
                        </v-range-slider>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-4">
            <v-btn variant="text" color="error" prepend-icon="mdi-eraser-variant" @click="emit('reset')">
                ล้างตัวกรอง
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="emit('close')">
                ยกเลิก
            </v-btn>
            <v-btn color="primary" variant="flat" prepend-icon="mdi-magnify-scan" @click="emit('search')">
                ค้นหา/กรอง
            </v-btn>
        </v-card-actions>
    </v-card>
    `;

  // ฟังก์ชันสำหรับลงทะเบียน Component
  window.registerFilterSearchPanel = function (app) {
    app.component("filter-search-panel", {
      template: template,
      emits: ["close", "search", "reset"],
      setup(props, { emit }) {
        const selectedBrands = Vue.ref([]);
        return {
          selectedBrands,
          emit,
        };
      },
    });
  };
})(window);
