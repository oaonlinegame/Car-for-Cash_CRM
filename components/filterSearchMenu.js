(function (global) {
  const FilterSearchMenu = {
    // รับค่า modelValue (เปิด/ปิด) และ activator (ตัวอ้างอิงตำแหน่ง)
    props: ["modelValue", "activator"],
    emits: ["update:modelValue"],
    setup(props, { emit }) {
      // ดึง Global Helpers มาใช้
      const AppGui = window.AppGui;

      // Log เพื่อยืนยันการโหลด
      console.log("✅ FilterSearchMenu (Full UI + Grade Logic Fixed) Loaded");

      return {
        AppGui,
      };
    },
    template: `
      <v-menu
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :activator="activator"
        :close-on-content-click="false"
        :open-on-click="false"
        location="bottom center"
        :offset="[20, 5]"
        width="1300"
        max-width="1300"
        transition="slide-y-transition"
        z-index="3000"
      >
        <v-card
          class="rounded-xl"
          elevation="16"
          style="overflow: hidden; max-height: 92vh; display: flex; flex-direction: column;"
        >
          <v-toolbar
            color="indigo-darken-3"
            density="comfortable"
            flat
            style="flex-shrink: 0;"
          >
            <v-icon class="ml-4 mr-3" color="white" size="large"
              >mdi-tune-variant</v-icon
            >
            <v-toolbar-title class="text-h6 font-weight-bold text-white">
              Lead Organizer Pro
              <span
                class="text-caption font-weight-regular opacity-80 ml-2 hidden-sm-and-down"
              >
                | ระบบจัดลำดับและค้นหาลูกค้าอัจฉริยะ
              </span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="white"
              prepend-icon="mdi-bookmark-multiple-outline"
              class="mr-2 hidden-xs text-none"
            >
              โหลดสูตร (Presets)
            </v-btn>
            <v-btn
              icon
              variant="text"
              @click="$emit('update:modelValue', false)"
            >
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text
            class="pa-0 flex-grow-1 scrollable-content"
            style="background-color: #FAFAFA; overflow-y: auto; overflow-x: hidden;"
          >
            <v-container fluid class="pa-6">
              <v-row>
                <v-col cols="12" md="4" class="pr-md-4 mb-4 mb-md-0">
                  <div class="d-flex align-center mb-4">
                    <v-avatar size="36" color="grey-lighten-3" class="mr-3">
                      <v-icon color="grey-darken-2" size="small"
                        >mdi-filter-check-outline</v-icon
                      >
                    </v-avatar>
                    <div>
                      <div
                        class="text-subtitle-1 font-weight-bold text-grey-darken-3"
                      >
                        1. คัดกรอง (Scope Filter)
                      </div>
                      <div class="text-caption text-grey">
                        เลือกกลุ่มเป้าหมายที่ต้องการค้นหา
                      </div>
                    </div>
                  </div>

                  <v-card
                    variant="outlined"
                    class="bg-white mb-3 rounded-lg"
                    style="border: 2px solid #E0E0E0;"
                  >
                    <v-card-text class="pa-4">
                      <div
                        class="text-caption font-weight-bold mb-3 text-indigo-darken-2 d-flex align-center"
                      >
                        <v-icon size="small" class="mr-1"
                          >mdi-account-group</v-icon
                        >
                        กลุ่มเป้าหมายและสถานะ
                      </div>

                      <v-select
                        label="สถานะลูกค้า"
                        :items="['ทั้งหมด', 'ลูกค้าใหม่', 'ลูกค้าเก่า', 'ลูกค้าติดตาม', 'ไม่สนใจ', 'ลูกค้าเช่าซื้อ', 'ลูกค้าจำนำทะเบียน']"
                        multiple
                        chips
                        closable-chips
                        density="compact"
                        variant="outlined"
                        hide-details
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-account-circle"
                        class="mb-3"
                        placeholder="เลือกสถานะ"
                      >
                      </v-select>

                      <v-select
                        label="ขั้นตอนการขาย (Stage)"
                        :items="['ทั้งหมด', 'สนใจ', 'กำลังตัดสินใจ', 'รอเสนอ', 'รออนุมัติ', 'รอเอกสาร', 'ปิดการขาย', 'ไม่สนใจ']"
                        multiple
                        chips
                        closable-chips
                        density="compact"
                        variant="outlined"
                        hide-details
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-progress-clock"
                        class="mb-3"
                        placeholder="เลือกขั้นตอน"
                      >
                      </v-select>

                      <v-select
                        label="สาขา / พื้นที่"
                        :items="['ทั้งหมด', 'สาขาท่าข้าม', 'สาขาอินทร์บุรี', 'สาขาบางระจัน', 'สาขาบางปะหัน', 'สาขาผักไห่']"
                        multiple
                        chips
                        closable-chips
                        density="compact"
                        variant="outlined"
                        hide-details
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-map-marker"
                        class="mb-3"
                        placeholder="เลือกสาขา"
                      >
                      </v-select>

                      <v-divider class="my-4"></v-divider>

                      <div
                        class="text-caption font-weight-bold mb-3 text-teal-darken-2 d-flex align-center"
                      >
                        <v-icon size="small" class="mr-1"
                          >mdi-file-document-outline</v-icon
                        >
                        ข้อมูลผลิตภัณฑ์และเกรด
                      </div>

                      <v-select
                        label="ประเภทสินเชื่อ"
                        :items="['ทั้งหมด', 'จำนำทะเบียน', 'เช่าซื้อ', 'บำนาญ', 'โฉนดที่ดิน', 'สินเชื่อเงินสด', 'อื่นๆ']"
                        multiple
                        chips
                        closable-chips
                        density="compact"
                        variant="outlined"
                        hide-details
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-file-document-edit-outline"
                        class="mb-3"
                        placeholder="เลือกประเภทสินเชื่อ"
                      >
                      </v-select>

                      <v-select
                        label="แหล่งที่มาลูกค้า (Source)"
                        :items="['ทั้งหมด', 'lead', 'walkin', 'Line', 'facebook', 'tiktok', 'อื่นๆ']"
                        multiple
                        chips
                        closable-chips
                        density="compact"
                        variant="outlined"
                        hide-details
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-file-document-edit-outline"
                        class="mb-3"
                        placeholder="เลือกประเภทสินเชื่อ"
                      >
                      </v-select>

                      <v-select
                        label="ประเภทรถ"
                        :items="['ทั้งหมด', 'รถยนต์', 'รถบรรทุก', 'รถการเกาตร', 'รถมอไซด์', 'อื่นๆ']"
                        multiple
                        chips
                        closable-chips
                        density="compact"
                        variant="outlined"
                        hide-details
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-file-document-edit-outline"
                        class="mb-3"
                        placeholder="เลือกประเภทสินเชื่อ"
                      >
                      </v-select>

                      <v-select
                        label="ยี่ห้อรถ (Brand)"
                        :items="['ทั้งหมด', 'Toyota', 'Honda', 'Isuzu', 'Nissan', 'Mitsubishi', 'Mazda', 'Ford', 'MG', 'Suzuki']"
                        multiple
                        chips
                        closable-chips
                        density="compact"
                        variant="outlined"
                        hide-details
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-car"
                        class="mb-3"
                        placeholder="เลือกยี่ห้อรถ"
                      >
                      </v-select>

                      <div
                        class="bg-orange-lighten-5 pa-3 rounded-lg mb-3 border dashed"
                        style="border-color: #FFE0B2 !important;"
                      >
                        <div
                          class="text-caption font-weight-bold text-orange-darken-4 mb-2"
                        >
                          <v-icon size="x-small" class="mr-1"
                            >mdi-star-circle</v-icon
                          >
                          เกรดและคะแนน
                        </div>

                        <v-select
                          label="กลุ่มเกรด (Grade)"
                          :items="['ทั้งหมด', 'H', 'L', 'X', 'T', 'K', 'R', 'D', 'M', 'ปรับปรุงโครงสร้างหนี้', 'ไม่มีเกรด']"
                          multiple
                          chips
                          closable-chips
                          density="compact"
                          variant="outlined"
                          bg-color="white"
                          hide-details
                          class="mb-3"
                          placeholder="เลือกเกรด (H, L, X...)"
                        >
                        </v-select>

                        <div
                          class="d-flex justify-space-between text-caption text-grey-darken-2 mb-1 px-1"
                        >
                          <span>คะแนน (Score)</span>
                          <span class="font-weight-bold text-orange-darken-3"
                            >เลือกช่วง: 0 - 6</span
                          >
                        </div>
                        <v-range-slider
                          density="compact"
                          thumb-label="always"
                          step="1"
                          :min="0"
                          :max="6"
                          color="orange-darken-2"
                          track-color="orange-lighten-3"
                          hide-details
                          class="mx-1 mt-3"
                          :model-value="[0, 6]"
                        >
                        </v-range-slider>
                      </div>

                      <v-divider class="my-4"></v-divider>

                      <div
                        class="text-caption font-weight-bold mb-3 text-green-darken-2 d-flex align-center"
                      >
                        <v-icon size="small" class="mr-1"
                          >mdi-cash-multiple</v-icon
                        >
                        เงื่อนไขการเงิน
                      </div>

                      <div class="text-caption text-grey-darken-1 mb-2">
                        ช่วงราคารถ (Appraised Value)
                      </div>
                      <div class="px-2">
                        <v-range-slider
                          density="compact"
                          thumb-label="always"
                          color="orange"
                          track-color="orange-lighten-4"
                          hide-details
                          class="mb-4"
                          step="50000"
                          :min="0"
                          :max="3000000"
                          :model-value="[0, 3000000]"
                        >
                        </v-range-slider>
                      </div>

                      <div class="text-caption text-grey-darken-1 mb-2">
                        ช่วงยอดหนี้คงเหลือ (Outstanding)
                      </div>
                      <div class="px-2">
                        <v-range-slider
                          density="compact"
                          thumb-label="always"
                          color="indigo"
                          track-color="indigo-lighten-4"
                          hide-details
                          class="mb-4"
                          step="10000"
                          :min="0"
                          :max="5000000"
                          :model-value="[0, 5000000]"
                        >
                        </v-range-slider>
                      </div>

                      <div class="text-caption text-grey-darken-1 mb-2">
                        งวดค้างชำระ (OVD)
                      </div>
                      <div class="px-2">
                        <v-slider
                          thumb-label="always"
                          step="1"
                          max="12"
                          min="0"
                          hide-details
                          color="red-darken-1"
                          track-color="red-lighten-4"
                          thumb-color="red-darken-2"
                          class="mb-4"
                        >
                          <template v-slot:prepend>
                            <v-chip
                              size="x-small"
                              color="success"
                              variant="flat"
                              >0</v-chip
                            >
                          </template>
                          <template v-slot:append>
                            <v-chip size="x-small" color="error" variant="flat"
                              >12+</v-chip
                            >
                          </template>
                        </v-slider>
                      </div>

                      <v-divider class="my-4"></v-divider>

                      <div
                        class="text-caption font-weight-bold mb-3 text-purple-darken-2 d-flex align-center"
                      >
                        <v-icon size="small" class="mr-1">mdi-tune</v-icon>
                        เงื่อนไขพิเศษ
                      </div>

                      <v-switch
                        label="เฉพาะที่มีเบอร์โทรศัพท์"
                        density="compact"
                        color="success"
                        hide-details
                        inset
                        class="mb-2"
                      >
                      </v-switch>

                      <v-switch
                        label="ลูกค้าที่ยังไม่เคยติดต่อ"
                        density="compact"
                        color="warning"
                        hide-details
                        inset
                        class="mb-2"
                      >
                      </v-switch>

                      <v-switch
                        label="เฉพาะลูกค้าใหม่ (ไม่เคยมีสัญญา)"
                        density="compact"
                        color="info"
                        hide-details
                        inset
                        class="mb-2"
                      >
                      </v-switch>

                      <v-switch
                        label="เฉพาะลูกค้าตัวเอง"
                        density="compact"
                        color="info"
                        hide-details
                        inset
                      >
                      </v-switch>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col
                  cols="12"
                  md="8"
                  class="border-s pl-md-6"
                  style="border-color: #EEEEEE;"
                >
                  <div class="d-flex align-center justify-space-between mb-4">
                    <div class="d-flex align-center">
                      <v-avatar size="36" color="indigo-lighten-5" class="mr-3">
                        <v-icon color="indigo" size="small"
                          >mdi-sort-variant</v-icon
                        >
                      </v-avatar>
                      <div>
                        <div
                          class="text-subtitle-1 font-weight-bold text-indigo-darken-4"
                        >
                          2. จัดลำดับ (Priority Strategy)
                        </div>
                        <div class="text-caption text-grey">
                          กำหนดลำดับชั้นการจัดเรียง (Multi-Level Sorting)
                        </div>
                      </div>
                    </div>
                    <v-btn
                      size="small"
                      color="indigo"
                      variant="flat"
                      prepend-icon="mdi-plus"
                      class="text-none"
                    >
                      เพิ่ม Layer
                    </v-btn>
                  </div>

                  <v-alert
                    type="info"
                    variant="tonal"
                    density="compact"
                    class="mb-4"
                    border="start"
                  >
                    <div class="text-caption">
                      <v-icon size="small" class="mr-1"
                        >mdi-lightbulb-on-outline</v-icon
                      >
                      <strong>วิธีใช้:</strong> ข้อมูลจะถูกเรียงตาม Layer 1 ก่อน
                      → Layer 2 → Layer 3 → Layer 4... เรื่อยๆ
                    </div>
                  </v-alert>

                  <v-card
                    class="mb-3 rounded-lg elevation-2 layer-card"
                    style="border-left: 6px solid #6200EA;"
                  >
                    <div class="pa-3">
                      <div
                        class="d-flex justify-space-between align-center mb-3"
                      >
                        <div class="d-flex align-center">
                          <v-icon color="grey" class="mr-2 cursor-grab"
                            >mdi-drag-vertical</v-icon
                          >
                          <v-chip
                            size="small"
                            color="deep-purple-accent-4"
                            class="mr-2 font-weight-bold"
                            label
                          >
                            <v-icon start size="small"
                              >mdi-numeric-1-circle</v-icon
                            >
                            Layer 1
                          </v-chip>
                          <span class="text-body-2 font-weight-bold"
                            >จัดกลุ่มหลัก (Primary Grouping)</span
                          >
                        </div>
                        <v-btn
                          icon="mdi-close"
                          size="x-small"
                          variant="text"
                          color="grey"
                        ></v-btn>
                      </div>

                      <v-select
                        model-value="ขั้นตอนการขาย (Stage)"
                        :items="['ขั้นตอนการขาย (Stage)', 'เกรดลูกค้า (Rating)', 'ยี่ห้อรถ (Brand)', 'ประเภทสัญญา', 'สถานะบัญชี', 'จังหวัด']"
                        density="compact"
                        variant="outlined"
                        hide-details
                        bg-color="white"
                        prepend-inner-icon="mdi-format-list-group"
                        class="mb-3"
                      >
                      </v-select>

                      <div
                        class="bg-deep-purple-lighten-5 pa-3 rounded-lg border"
                        style="border-color: #D1C4E9 !important; border-style: dashed !important;"
                      >
                        <div
                          class="text-caption text-deep-purple mb-2 d-flex align-center"
                        >
                          <v-icon size="small" class="mr-1"
                            >mdi-gesture-tap-hold</v-icon
                          >
                          <b>ลำดับความสำคัญในกลุ่ม</b> (ลากชิปเพื่อเปลี่ยนลำดับ)
                        </div>
                        <div class="d-flex flex-wrap gap-2">
                          <v-chip
                            size="small"
                            color="success"
                            class="cursor-grab font-weight-medium"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 1.
                            ปิดการขาย
                          </v-chip>
                          <v-chip
                            size="small"
                            color="info"
                            class="cursor-grab font-weight-medium"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 2.
                            รออนุมัติ
                          </v-chip>
                          <v-chip
                            size="small"
                            color="warning"
                            class="cursor-grab font-weight-medium"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 3. สนใจ
                          </v-chip>
                          <v-chip
                            size="small"
                            color="orange"
                            class="cursor-grab font-weight-medium"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 4.
                            รอเอกสาร
                          </v-chip>
                          <v-chip
                            size="small"
                            color="grey"
                            class="cursor-grab font-weight-medium"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 5.
                            อื่นๆ
                          </v-chip>
                        </div>
                      </div>
                    </div>
                  </v-card>

                  <v-card
                    class="mb-3 rounded-lg elevation-1 layer-card"
                    style="border-left: 6px solid #FF6F00;"
                  >
                    <div class="pa-3">
                      <div
                        class="d-flex justify-space-between align-center mb-3"
                      >
                        <div class="d-flex align-center">
                          <v-icon color="grey" class="mr-2 cursor-grab"
                            >mdi-drag-vertical</v-icon
                          >
                          <v-chip
                            size="small"
                            color="orange-darken-3"
                            class="mr-2 font-weight-bold"
                            label
                          >
                            <v-icon start size="small"
                              >mdi-numeric-2-circle</v-icon
                            >
                            Layer 2
                          </v-chip>
                          <span class="text-body-2 font-weight-bold ml-2"
                            >ลำดับเกรด (Grade Priority)</span
                          >
                        </div>
                        <v-btn
                          icon="mdi-close"
                          size="x-small"
                          variant="text"
                          color="grey"
                        ></v-btn>
                      </div>

                      <div
                        class="bg-orange-lighten-5 pa-3 rounded-lg border mb-3"
                        style="border-color: #FFE0B2 !important; border-style: dashed !important;"
                      >
                        <div
                          class="d-flex justify-space-between align-center mb-2"
                        >
                          <div
                            class="text-caption text-orange-darken-4 d-flex align-center"
                          >
                            <v-icon size="small" class="mr-1"
                              >mdi-gesture-tap-hold</v-icon
                            >
                            <b>Step 1: เรียงความสำคัญกลุ่มเกรด</b>
                            (ซ้าย=สำคัญสุด)
                          </div>
                          <v-btn
                            size="x-small"
                            variant="text"
                            color="orange-darken-4"
                            class="px-0"
                          >
                            รีเซ็ตค่าเดิม
                          </v-btn>
                        </div>

                        <div class="d-flex flex-wrap gap-2 align-center">
                          <v-chip
                            size="small"
                            color="deep-orange"
                            class="cursor-grab elevation-1"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 1. H
                          </v-chip>
                          <v-chip
                            size="small"
                            color="orange-darken-1"
                            class="cursor-grab elevation-1"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 2. L
                          </v-chip>
                          <v-chip
                            size="small"
                            color="amber-darken-2"
                            class="cursor-grab elevation-1"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 3. X
                          </v-chip>
                          <v-chip
                            size="small"
                            color="blue-grey"
                            class="cursor-grab elevation-1"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 4. T
                          </v-chip>
                          <v-chip
                            size="small"
                            color="grey"
                            class="cursor-grab elevation-1"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-drag</v-icon> 5. K
                          </v-chip>
                        </div>
                      </div>

                      <v-row dense align="center">
                        <v-col cols="12" sm="5">
                          <div
                            class="text-caption font-weight-bold text-grey-darken-2 mb-1"
                          >
                            Step 2: เรียงระดับภายใน (Level)
                          </div>
                        </v-col>
                        <v-col cols="12" sm="7">
                          <v-btn-toggle
                            mandatory
                            color="orange-darken-3"
                            variant="outlined"
                            density="compact"
                            class="w-100 d-flex"
                            divided
                          >
                            <v-btn class="flex-grow-1" value="desc">
                              <v-icon start size="small"
                                >mdi-sort-numeric-descending</v-icon
                              >
                              <span>6 → 1 (มากไปน้อย)</span>
                            </v-btn>
                            <v-btn class="flex-grow-1" value="asc">
                              <v-icon start size="small"
                                >mdi-sort-numeric-ascending</v-icon
                              >
                              <span>1 → 6 (น้อยไปมาก)</span>
                            </v-btn>
                          </v-btn-toggle>
                          <div class="text-caption text-grey mt-1">
                            *เช่น ถ้าเลือก "มากไปน้อย": กลุ่ม H จะเรียง H6,
                            H5...H1 แล้วค่อยขึ้นกลุ่มถัดไป
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>

                  <v-card
                    class="mb-3 rounded-lg elevation-1 layer-card"
                    style="border-left: 6px solid #2962FF;"
                  >
                    <div class="pa-3">
                      <div
                        class="d-flex justify-space-between align-center mb-2"
                      >
                        <div class="d-flex align-center">
                          <v-icon color="grey" class="mr-2 cursor-grab"
                            >mdi-drag-vertical</v-icon
                          >
                          <v-chip
                            size="small"
                            color="blue-accent-4"
                            class="mr-2 font-weight-bold"
                            label
                          >
                            <v-icon start size="small"
                              >mdi-numeric-3-circle</v-icon
                            >
                            Layer 3
                          </v-chip>
                          <span class="text-body-2 font-weight-bold"
                            >เรียงตัวเลข (Numeric Sort)</span
                          >
                        </div>
                        <v-btn
                          icon="mdi-close"
                          size="x-small"
                          variant="text"
                          color="grey"
                        ></v-btn>
                      </div>

                      <v-row dense align="center">
                        <v-col cols="12" sm="7">
                          <v-select
                            model-value="คะแนนประเมิน (Rating Score)"
                            :items="['คะแนนประเมิน (Rating Score)', 'จำนวนครั้งที่ติดต่อ', 'ยอดหนี้คงเหลือ', 'ยอดเงินเหลือรับ', 'อายุลูกค้า', 'ปีรถยนต์', 'ราคาประเมินรถ', 'งวดค้างชำระ (OVD)']"
                            density="compact"
                            variant="outlined"
                            hide-details
                            bg-color="white"
                            prepend-inner-icon="mdi-pound"
                          >
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="5">
                          <v-btn-toggle
                            mandatory
                            color="primary"
                            variant="outlined"
                            class="w-100 d-flex"
                            density="compact"
                            divided
                          >
                            <v-btn class="flex-grow-1" value="desc">
                              <span class="text-caption mr-1 hidden-xs"
                                >มาก→น้อย</span
                              >
                              <v-icon size="small"
                                >mdi-sort-numeric-descending</v-icon
                              >
                            </v-btn>
                            <v-btn class="flex-grow-1" value="asc">
                              <span class="text-caption mr-1 hidden-xs"
                                >น้อย→มาก</span
                              >
                              <v-icon size="small"
                                >mdi-sort-numeric-ascending</v-icon
                              >
                            </v-btn>
                          </v-btn-toggle>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>

                  <v-card
                    class="mb-3 rounded-lg elevation-1 layer-card"
                    style="border-left: 6px solid #00BFA5;"
                  >
                    <div class="pa-3">
                      <div
                        class="d-flex justify-space-between align-center mb-2"
                      >
                        <div class="d-flex align-center">
                          <v-icon color="grey" class="mr-2 cursor-grab"
                            >mdi-drag-vertical</v-icon
                          >
                          <v-chip
                            size="small"
                            color="teal-accent-4"
                            class="mr-2 font-weight-bold"
                            label
                          >
                            <v-icon start size="small"
                              >mdi-numeric-4-circle</v-icon
                            >
                            Layer 4
                          </v-chip>
                          <span class="text-body-2 font-weight-bold"
                            >เรียงตามวันที่ (Date Sort)</span
                          >
                        </div>
                        <v-btn
                          icon="mdi-close"
                          size="x-small"
                          variant="text"
                          color="grey"
                        ></v-btn>
                      </div>

                      <v-row dense align="center">
                        <v-col cols="12" sm="7">
                          <v-select
                            model-value="วันที่อัปเดตล่าสุด"
                            :items="['วันที่อัปเดตล่าสุด', 'วันที่สร้าง Lead', 'วันที่โทรล่าสุด', 'วันเกิดลูกค้า', 'วันที่ทำสัญญา', 'วันครบกำหนดชำระ']"
                            density="compact"
                            variant="outlined"
                            hide-details
                            bg-color="white"
                            prepend-inner-icon="mdi-calendar-clock"
                          >
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="5">
                          <v-btn-toggle
                            mandatory
                            color="teal"
                            variant="outlined"
                            class="w-100 d-flex"
                            density="compact"
                            divided
                          >
                            <v-btn class="flex-grow-1" value="desc">
                              <span class="text-caption mr-1 hidden-xs"
                                >ล่าสุด</span
                              >
                              <v-icon size="small"
                                >mdi-sort-calendar-descending</v-icon
                              >
                            </v-btn>
                            <v-btn class="flex-grow-1" value="asc">
                              <span class="text-caption mr-1 hidden-xs"
                                >เก่าสุด</span
                              >
                              <v-icon size="small"
                                >mdi-sort-calendar-ascending</v-icon
                              >
                            </v-btn>
                          </v-btn-toggle>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>

                  <v-card
                    class="mb-3 rounded-lg elevation-1 layer-card"
                    style="border-left: 6px solid #7B1FA2;"
                  >
                    <div class="pa-3">
                      <div
                        class="d-flex justify-space-between align-center mb-2"
                      >
                        <div class="d-flex align-center">
                          <v-icon color="grey" class="mr-2 cursor-grab"
                            >mdi-drag-vertical</v-icon
                          >
                          <v-chip
                            size="small"
                            color="purple-darken-2"
                            class="mr-2 font-weight-bold"
                            label
                          >
                            <v-icon start size="small"
                              >mdi-numeric-5-circle</v-icon
                            >
                            Layer 5
                          </v-chip>
                          <span class="text-body-2 font-weight-bold"
                            >เรียงตามตัวอักษร (A-Z)</span
                          >
                        </div>
                        <v-btn
                          icon="mdi-close"
                          size="x-small"
                          variant="text"
                          color="grey"
                        ></v-btn>
                      </div>

                      <v-row dense align="center">
                        <v-col cols="12" sm="7">
                          <v-select
                            model-value="ชื่อลูกค้า"
                            :items="['ชื่อลูกค้า', 'จังหวัด / ที่อยู่', 'รุ่นรถ (Model)', 'อาชีพ', 'ชื่อผู้แนะนำ']"
                            density="compact"
                            variant="outlined"
                            hide-details
                            bg-color="white"
                            prepend-inner-icon="mdi-format-text"
                          >
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="5">
                          <v-btn-toggle
                            mandatory
                            color="purple"
                            variant="outlined"
                            class="w-100 d-flex"
                            density="compact"
                            divided
                          >
                            <v-btn class="flex-grow-1" value="asc">
                              <span class="text-caption mr-1 hidden-xs"
                                >ก→ฮ</span
                              >
                              <v-icon size="small"
                                >mdi-sort-alphabetical-ascending</v-icon
                              >
                            </v-btn>
                            <v-btn class="flex-grow-1" value="desc">
                              <span class="text-caption mr-1 hidden-xs"
                                >ฮ→ก</span
                              >
                              <v-icon size="small"
                                >mdi-sort-alphabetical-descending</v-icon
                              >
                            </v-btn>
                          </v-btn-toggle>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>

                  <v-card
                    class="mb-3 rounded-lg elevation-1 layer-card"
                    style="border-left: 6px solid #FF3D00;"
                  >
                    <div class="pa-3">
                      <div
                        class="d-flex justify-space-between align-center mb-2"
                      >
                        <div class="d-flex align-center">
                          <v-icon color="grey" class="mr-2 cursor-grab"
                            >mdi-drag-vertical</v-icon
                          >
                          <v-chip
                            size="small"
                            color="deep-orange-accent-3"
                            class="mr-2 font-weight-bold"
                            label
                          >
                            <v-icon start size="small"
                              >mdi-numeric-6-circle</v-icon
                            >
                            Layer 6
                          </v-chip>
                          <span class="text-body-2 font-weight-bold"
                            >เงื่อนไขพิเศษ (Special)</span
                          >
                        </div>
                        <v-btn
                          icon="mdi-close"
                          size="x-small"
                          variant="text"
                          color="grey"
                        ></v-btn>
                      </div>

                      <v-row dense align="center">
                        <v-col cols="12" sm="8">
                          <v-select
                            model-value="สุ่มลำดับ (Random Shuffle)"
                            :items="['สุ่มลำดับ (Random Shuffle)', 'ลูกค้าที่ยังไม่เคยติดต่อก่อน', 'วันเกิดใกล้ที่สุดก่อน', 'ระยะทางใกล้สาขา']"
                            density="compact"
                            variant="outlined"
                            hide-details
                            bg-color="white"
                            prepend-inner-icon="mdi-creation"
                          >
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-btn
                            block
                            color="deep-orange-lighten-4"
                            variant="flat"
                            class="text-deep-orange-darken-4 text-none"
                            size="small"
                          >
                            <v-icon start size="small"
                              >mdi-shuffle-variant</v-icon
                            >
                            สุ่มใหม่
                          </v-btn>
                        </v-col>
                      </v-row>
                      <div
                        class="text-caption text-grey mt-2 d-flex align-center"
                      >
                        <v-icon size="small" class="mr-1"
                          >mdi-information-outline</v-icon
                        >
                        ใช้สำหรับกรณีค่าเท่ากัน หรือต้องการกระจายรายชื่อ
                      </div>
                    </div>
                  </v-card>

                  <v-card
                    variant="outlined"
                    color="grey"
                    class="text-center pa-4 cursor-pointer hover-effect rounded-lg border"
                    style="border-style: dashed !important; border-width: 2px !important;"
                  >
                    <v-icon color="grey-darken-1" size="large"
                      >mdi-plus-circle-outline</v-icon
                    >
                    <div
                      class="mt-2 text-subtitle-2 text-grey-darken-2 font-weight-medium"
                    >
                      เพิ่มเงื่อนไขการเรียง (Add Layer 7+)
                    </div>
                    <div class="text-caption text-grey">
                      คลิกเพื่อเพิ่มชั้นการเรียงเพิ่มเติม
                    </div>
                  </v-card>

                  <v-card
                    variant="tonal"
                    color="blue-grey-lighten-5"
                    class="mt-4 rounded-lg"
                  >
                    <div class="pa-3">
                      <div class="d-flex align-center mb-2">
                        <v-icon
                          size="small"
                          color="blue-grey-darken-2"
                          class="mr-2"
                          >mdi-eye-check-outline</v-icon
                        >
                        <span
                          class="text-subtitle-2 font-weight-bold text-blue-grey-darken-3"
                        >
                          ตัวอย่างผลลัพธ์การจัดเรียง
                        </span>
                      </div>
                      <div
                        class="text-caption text-blue-grey-darken-2 font-mono"
                        style="line-height: 1.8;"
                      >
                        <div class="mb-1">
                          📊 <strong>กลุ่ม: ปิดการขาย</strong>
                        </div>
                        <div class="ml-4 mb-1">└─ ⭐⭐⭐⭐⭐ (5 ดาว - Hot)</div>
                        <div class="ml-8 mb-1">
                          └─ ติดต่อ 5 ครั้ง → อัปเดต 28 ม.ค. 2026 → นายสมชาย
                          ใจดี
                        </div>
                        <div class="ml-8 mb-1">
                          └─ ติดต่อ 3 ครั้ง → อัปเดต 27 ม.ค. 2026 → นางสมหญิง
                          รักดี
                        </div>
                        <div class="ml-4 mb-1">└─ ⭐⭐⭐⭐ (4 ดาว)</div>
                        <div class="ml-8 mb-2">
                          └─ ติดต่อ 2 ครั้ง → อัปเดต 26 ม.ค. 2026 → นายสมศักดิ์
                          มั่นคง
                        </div>
                        <div class="mb-1">
                          📊 <strong>กลุ่ม: รออนุมัติ</strong>
                        </div>
                        <div class="ml-4 text-grey">...และต่อไปเรื่อยๆ</div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions
            class="pa-4 bg-white"
            style="flex-shrink: 0; box-shadow: 0 -4px 12px rgba(0,0,0,0.08);"
          >
            <div class="d-flex flex-column mr-4 hidden-xs">
              <span class="text-caption text-grey">พบข้อมูล (Leads)</span>
              <span
                class="text-h6 font-weight-bold text-indigo"
                style="line-height: 1;"
              >
                1,254
                <span class="text-caption text-grey font-weight-regular"
                  >รายการ</span
                >
              </span>
            </div>

            <v-divider vertical class="mx-4 hidden-xs"></v-divider>

            <v-chip
              size="small"
              color="blue-grey"
              variant="outlined"
              class="mr-2 hidden-sm-and-down"
            >
              <v-icon start size="small">mdi-layers-triple-outline</v-icon>
              Active Layers: 2
            </v-chip>

            <v-spacer></v-spacer>

            <v-btn
              variant="text"
              color="error"
              prepend-icon="mdi-eraser"
              class="mr-2"
            >
              ล้างค่า
            </v-btn>

            <v-btn
              variant="outlined"
              color="grey-darken-1"
              @click="$emit('update:modelValue', false)"
              class="mr-2"
            >
              ยกเลิก
            </v-btn>

            <v-btn
              color="indigo-darken-3"
              size="large"
              variant="flat"
              class="px-8 rounded-lg elevation-4"
            >
              <v-icon start>mdi-magnify-scan</v-icon>
              ค้นหาและจัดเรียง
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    `,
  };

  // Global Registration Function
  global.registerFilterSearchMenu = function (app) {
    app.component("filter-search-menu", FilterSearchMenu);
  };
})(window);
