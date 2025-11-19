├── index.html             ← หน้าแรก (template หลัก)
└── js/
    ├── app.js             ← ตัวหลักของ Vue (สร้าง app, mount)
    ├── store.js           ← เก็บ state กลาง เช่น leads, settings, filters
    ├── utils.js           ← ฟังก์ชันทั่วไป เช่น format เบอร์โทร, วันเวลา
    ├── api.js             ← จัดการ import/export CSV หรือจำลอง API
    ├── gui.js             ← ส่วนที่เกี่ยวกับ UI เช่น alert, confirm, snackbar
    ├── lead.js            ← logic ของ lead โดยเฉพาะ (เพิ่ม/ลบ/แก้ไข lead)
    ├── car.js             ← ฟังก์ชันจัดการข้อมูลรถยนต์
    ├── customer.js        ← ฟังก์ชันจัดการข้อมูลลูกค้า
    ├── finance.js         ← logic เกี่ยวกับการคำนวณยอดสินเชื่อ, ดอกเบี้ย
    ├── followup.js        ← ส่วนบันทึกการติดตามลูกค้า
    └── components/
        ├── LeadList.js    ← component แสดงรายชื่อ lead
        ├── LeadForm.js    ← component ฟอร์มเพิ่ม lead ใหม่
        └── CarSelector.js ← component เลือกรถ/ยี่ห้อ/รุ่น

1. Class (ใช้ใน class="...")Class คือ CSS Utility Classes ที่เป็นมาตรฐานของ Vuetify ใช้สำหรับการจัดรูปแบบที่ไม่ได้เป็นฟังก์ชันหลักของ Component และสามารถใช้ได้เกือบทุก Elementหมวดหมู่ตัวอย่าง Classใช้ทำอะไร?Spacing (ระยะห่าง)ma-5, pa-3, mx-auto, pt-0กำหนด Margin (ระยะห่างภายนอก) และ Padding (ระยะห่างภายใน) โดยใช้ตัวเลข 0-16 และทิศทาง (a, x, y, t, b, l/s, r/e)Color (สี)bg-primary, bg-error, text-successกำหนดสี พื้นหลัง (bg-) หรือสี ตัวอักษร (text-) โดยใช้สีหลักของ Theme (primary, secondary, error, success ฯลฯ)Typographytext-h4, text-caption, font-weight-boldกำหนดขนาดและรูปแบบของตัวอักษรให้เป็นไปตาม Material DesignFlexbox/Gridd-flex, justify-center, align-endใช้ควบคุมการจัดวางองค์ประกอบด้วย Flexbox/Grid (เช่น จัดให้อยู่ตรงกลาง, จัดเรียงแนวนอน)Display/Hided-none, d-sm-flex, hidden-md-and-downควบคุมการแสดงผล (เช่น ซ่อน Element หรือเปลี่ยนรูปแบบการแสดงผลตามขนาดหน้าจอ)Elevation (เงา)elevation-10, elevation-0กำหนดความลึกของเงา (มักใช้แทน Prop elevation บน Component ที่ไม่มี Prop นี้)2. Prop (ใช้เป็น Attribute นอก class="...")Prop คือ Configuration เฉพาะตัวของ Vuetify Component นั้นๆ ใช้สำหรับควบคุม พฤติกรรม หรือ รูปแบบหลัก ของ Component นั้นหมวดหมู่ตัวอย่าง Propใช้ทำอะไร? (ตัวอย่าง Component)Color (สี)color="primary", bg-color="surface"กำหนดสีหลักของ Component หรือสีพื้นหลัง เฉพาะ Component นั้นๆ (e.g., <v-btn>, <v-app-bar>)State (สถานะ)disabled, readonly, loadingควบคุมสถานะการใช้งานของ Component (e.g., <v-btn>, <v-text-field>)Size/Densitysize="x-large", density="compact"กำหนดขนาดรวมหรือความหนาแน่น/ระยะห่างในแนวตั้งของ Component (e.g., <v-btn>, <v-text-field>)Variant (รูปแบบ)variant="outlined", variant="flat"กำหนดสไตล์หลักของ Component (e.g., <v-btn>, <v-alert> ที่กำหนดว่ามีขอบ, เป็นข้อความ, หรือมีเงา)Location/Positionlocation="bottom", position="fixed"กำหนดตำแหน่งการแสดงผล (e.g., <v-app-bar>, <v-overlay>)Value/Datav-model, items, labelใช้ในการผูกข้อมูล (Data Binding) และกำหนดรายการ/ป้ายกำกับ (e.g., <v-text-field>, <v-select>)


เพื่อเพิ่มประสิทธิภาพ เราควรใช้ Dexie ในการเป็นฐานข้อมูล
และ File System Access API ในการเก็บข้อมูลทับกับของเดิม