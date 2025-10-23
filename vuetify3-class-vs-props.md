
# สรุป Vuetify 3: อะไรใช้ **props** อะไรใช้ **class** (ฉบับจำง่าย)

> แนวคิดเร็ว ๆ:  
> - **props** = ตัวเลือกของ **คอมโพเนนต์ Vuetify** (เช่น `<v-btn>`, `<v-card>`) มีผลกับธีม/โทเคน อัปเดตตามรีแอคทีฟได้ดี  
> - **class** = ยูทิลิตี้สไตล์ที่ติดกับ **ทุกแท็ก** (ทั้ง `<div>` ปกติและคอมโพเนนต์) ดีสำหรับเลย์เอาท์/เว้นระยะ/การจัดตำแหน่ง

---

## ใช้ **props** เมื่อไหร่?
- ต้องการสี/สไตล์ที่ **ผูกกับธีม** และเปลี่ยนพร้อมโหมด (light/dark) ได้
- ต้องการสไตล์ที่ขึ้นกับ **องค์ความรู้ของคอมโพเนนต์** (เช่น `variant` ของปุ่ม, `density` ของแท็บ, `elevation` ของการ์ด)
- ต้องการ **ตรวจสอบค่า** (type-safe) และ **อัปเดตแบบ reactive** ได้ง่าย (เช่น `:color="isError ? 'error' : 'primary'"`)

### Props ที่พบบ่อย (จำชุดนี้ไว้ก่อน)
- `color="primary|secondary|success|warning|error|info|..."`
- `variant="elevated|flat|tonal|outlined|text|plain"`
- `density="compact|comfortable|default"`
- `elevation="0..24"`
- `rounded` / `rounded="0|sm|md|lg|xl|pill|circle"`
- `loading` (มีวงกลมโหลด) / `disabled`
- `ripple` (เช่น `:ripple="false"` บนปุ่มเมททีเรียล)
- ขนาด/มิติที่คอมโพเนนต์รองรับ เช่น `size="small|default|large"` หรือ `width/height` (ขึ้นกับชนิดคอมโพเนนต์)
- ไอคอนบนคอมโพเนนต์: เช่น `<v-btn prepend-icon="mdi-plus">`, `<v-text-field prepend-inner-icon="mdi-magnify">`
- เฉพาะคอมโพเนนต์:
  - **`v-app-bar`**: `color`, `elevation`, `flat`, `density`, `height`, `scroll-behavior` ฯลฯ  
  - **`v-card`**: `variant`, `elevation`, `rounded`, `image`  
  - **`v-text-field`**: `variant`, `density`, `clearable`, `hide-details`, `type`, `append-inner-icon`, `prepend-inner-icon`  
  - **`v-container/v-row/v-col` (Grid)**: `fluid` (บน container), `cols|sm|md|lg|xl` (บน col), `offset`, `order`, `align`, `justify` (บน row) ฯลฯ

---

## ใช้ **class** เมื่อไหร่?
- จัด **เลย์เอาท์/เว้นระยะ/ตำแหน่ง** เร็ว ๆ โดยไม่ไปยุ่งกับ logic ของคอมโพเนนต์
- ใช้กับ **แท็กปกติ** (`div`, `span`) หรือ **ผสมกับคอมโพเนนต์** เพื่อปรับจูนละเอียด
- ต้องการสไตล์สากลที่คุ้นเคย (flex, spacing, text align, width/height, visibility)

### ชุด **utility classes** ที่ใช้บ่อยใน Vuetify 3
- **Spacing (ระยะห่าง)**  
  `ma-*, pa-*` (margin/padding) + ทิศทาง `t, b, l, r, x, y` เช่น:  
  `pa-4`, `px-2`, `mt-3`, `mx-auto`
- **Display & Flex**  
  `d-flex`, `d-inline-flex`, `d-none`  
  `flex-column`, `flex-row`, `flex-wrap`  
  `align-start|center|end`, `justify-start|center|end|space-between|space-around`
- **Size (ขนาด)**  
  `w-100`, `w-auto`, `h-100`, `h-auto`, บางโปรเจ็กต์มี `w-50` ฯลฯ
- **Typography (ตัวอักษร)**  
  `text-h1..h6`, `text-subtitle-1/2`, `text-body-1/2`, `text-caption`, `text-button`  
  `text-start|center|end`, `text-uppercase|lowercase|capitalize`, `font-weight-bold`
- **Color (สีตัวอักษร/พื้นหลัง)**  
  `text-primary`, `text-error`, `bg-primary`, `bg-surface` *(ขึ้นกับธีม/โทเคนที่โปรเจ็กต์เปิดใช้)*
- **Rounded (มุมโค้ง)**  
  `rounded-0`, `rounded`, `rounded-sm|md|lg|xl`, `rounded-pill`, `rounded-circle`
- **Elevation (เงา)**  
  `elevation-0` ถึง `elevation-24`
- **Position (ตำแหน่ง)**  
  `position-relative|absolute|fixed`, `top-0`, `right-0`, `bottom-0`, `left-0`
- **Visibility**  
  `overflow-hidden|auto`, `opacity-0..100` *(ขึ้นกับการตั้งค่าโปรเจ็กต์)*

> หมายเหตุ: รายการ class อาจต่างกันเล็กน้อยตามเวอร์ชัน/การตั้งค่า build ของโปรเจ็กต์คุณ แต่อย่างน้อย **spacing/display/flex/typography/elevation/rounded** คือใช้ได้ชัวร์ ๆ

---

## เทียบเคียงแบบเร็ว: **Props vs Class**

| ต้องการทำอะไร | **ใช้ props** (ถ้าทำกับคอมโพเนนต์) | **ใช้ class** (ถ้าต้องการจูนเลย์เอาท์/ทุกแท็ก) |
|---|---|---|
| กำหนดสีธีมให้ปุ่ม/การ์ด | `<v-btn color="primary">` | `text-primary`, `bg-primary` (บน wrapper/แท็กทั่วไป) |
| เปลี่ยนสไตล์ปุ่ม | `variant="tonal|outlined|text|flat|elevated"` | (ไม่แนะนำใช้ class แทน variant) |
| ความแน่น/สูงของคอมโพเนนต์ | `density="compact"` | ปรับ margin/padding นอกคอมโพเนนต์ด้วย `ma-*/pa-*` |
| มุมโค้งของการ์ด | `rounded="lg"` | `rounded-lg` บน wrapper หรือเสริมบนตัวคอมโพเนนต์ |
| เงา | `elevation="8"` | `elevation-8` |
| ไอคอนบนปุ่ม/อินพุต | `prepend-icon`, `append-icon`, `prepend-inner-icon` | วาง `<v-icon>` เอง + ตำแหน่งด้วย flex class |
| จัดวางกลางแนวนอน | (ขึ้นกับคอมโพเนนต์ เช่น `block`+`class="mx-auto"`) | `d-flex justify-center` หรือ `mx-auto` |
| Grid (คอลัมน์) | `<v-col :md="6" :lg="4">` | ใช้ grid props เป็นหลัก คลาสใช้เสริมเว้นระยะ |
| ซ่อน/แสดงเป็นบล็อก/อินไลน์ | – | `d-none`, `d-flex`, `d-inline-flex` |
| ตัวอักษร/หัวเรื่อง | – | `text-h5 text-center font-weight-bold` |

---

## สูตรจำง่าย
1. **สี/สไตล์ที่เป็น “ภาษาของคอมโพเนนต์” = ใช้ `props`** (color/variant/density/elevation/rounded)
2. **เลย์เอาท์/เว้นระยะ/ตำแหน่ง/การจัดเรียง = ใช้ `class`**
3. **Grid**: ใช้ **props** (`cols|sm|md|lg|xl`, `align`, `justify`) เป็นหลัก แล้วค่อยเติม **class** เพื่อเก็บงานให้เรียบ
4. ถ้าเป็น **แท็กธรรมดา** (ไม่ใช่ v-*) ก็ **ต้องใช้ class** สิครับ
5. ถ้าต้องการ **reactive + ควบคุมธีมที่ถูกต้อง** ให้ไปทาง **props** ก่อน

---

## ตัวอย่างสั้น ๆ เทียบให้เห็นภาพ

### 1) ปุ่ม (Button)
```html
<!-- เน้นธีม/เมททีเรียล: ใช้ props -->
<v-btn color="primary" variant="tonal" density="comfortable" rounded="lg" elevation="6">
  บันทึก
</v-btn>

<!-- เน้นเลย์เอาท์รอบ ๆ: ใช้ class -->
<div class="d-flex justify-end mt-4">
  <v-btn color="primary">บันทึก</v-btn>
</div>
```

### 2) การ์ด (Card)
```html
<!-- สไตล์การ์ดด้วย props -->
<v-card variant="elevated" elevation="8" rounded="xl" class="pa-4">
  <v-card-title class="text-h6 font-weight-bold">รายละเอียดลูกค้า</v-card-title>
  <v-card-text>...</v-card-text>
</v-card>

<!-- เสริมเลย์เอาท์ด้วย class -->
<v-card class="mt-6 pa-4 elevation-6 rounded-lg">
  <v-card-text class="d-flex align-center justify-space-between">
    <span class="text-subtitle-1">สถานะ</span>
    <v-chip color="success" variant="tonal">อนุมัติ</v-chip>
  </v-card-text>
</v-card>
```

### 3) ช่องค้นหา (Text Field ใน App Bar)
```html
<v-app-bar color="primary" density="comfortable">
  <v-container fluid class="pa-0">
    <v-row class="ma-0 align-center">
      <v-col cols="12" md="6" class="mx-auto">
        <v-text-field
          variant="solo"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          placeholder="ค้นหา..."
          hide-details
          class="bg-surface rounded-lg"
        />
      </v-col>
    </v-row>
  </v-container>
</v-app-bar>
```

### 4) Grid (Container/Row/Col)
```html
<v-container fluid>
  <v-row align="center" justify="space-between" class="gap-4">
    <v-col cols="12" md="6">
      <v-card class="pa-4">ซ้าย</v-card>
    </v-col>
    <v-col cols="12" md="5">
      <v-card class="pa-4">ขวา</v-card>
    </v-col>
  </v-row>
</v-container>
```

---

## ข้อควรระวัง
- อย่าซ้อน **props** กับ **class** ที่ทำหน้าที่เดียวกันจน **ขัดกันเอง** (เช่น `rounded="lg"` พร้อม `rounded-sm` บน class เดียวกัน)
- Utility class บางตัวอาจ **ต่างกันเล็กน้อยตามโปรเจ็กต์/เวอร์ชัน** → ถ้าไม่ติด ให้ยึด `spacing/display/flex/typography/elevation/rounded` เป็นมาตรฐาน
- ถ้าอยากให้ **ธีม/โทนสี** ทำงานถูกต้อง (โดยเฉพาะ dark mode) เลือก **props** ก่อน แล้วค่อยเติม class เฉพาะเลย์เอาท์

---

## สรุปสั้นที่สุด (One-liner)
- **สไตล์เชิงธีมของคอมโพเนนต์ = props**  
- **เลย์เอาท์/เว้นระยะ/การจัดวาง = class**
