// example.js
// 🔰 คู่มือรวมทุกอย่างของ Vue 3 แบบง่าย ๆ สำหรับใช้ในโปรเจกต์จริง (แนวคุณ)
// เหมาะกับคนที่ "ขี้ลืม" หรือไม่ได้เขียนโค้ดบ่อย ๆ แต่ต้องทำงานกับ Vue + Vuetify แบบหลายไฟล์
// เขียนให้จำง่าย อ่านเองทีหลังก็เข้าใจได้เลย

// -------------------------------
// 1️⃣ ตัวแปรพื้นฐานใน Vue 3 Composition API
// -------------------------------

// ✅ ref ใช้กับตัวแปรธรรมดา เช่น ตัวเลข ข้อความ true/false
const counter = Vue.ref(0); // ตัวเลข
const name = Vue.ref("สมชาย"); // ข้อความ
const loading = Vue.ref(false); // boolean

// ใช้ใน template ได้เลย เช่น {{ counter }} หรือ v-model="name"
// แต่ถ้าใช้งานใน JS ต้องใส่ .value เช่น counter.value++

// ✅ reactive ใช้กับ object หรือ array ที่มีหลายค่า
const user = Vue.reactive({
  name: "มาลี",
  age: 30,
});

const items = Vue.reactive([
  { id: 1, title: "A" },
  { id: 2, title: "B" },
]);

// ข้อดี: ไม่ต้อง .value เวลาใช้งาน (ต่างจาก ref)
user.age++; // ได้เลย
items.push({ id: 3, title: "C" });

// -------------------------------
// 2️⃣ ฟังก์ชันและวิธีการส่งค่าไปใช้งานใน Vue
// -------------------------------

// 📌 แนะนำให้รวมทุกอย่างไว้ใน object ใหญ่ เช่น:
const Example = {
  count: Vue.ref(0),

  user: Vue.reactive({
    name: "ลูกค้าใหม่",
    phone: "",
  }),

  increase() {
    this.count.value++;
  },

  reset() {
    this.count.value = 0;
    this.user.name = "";
    this.user.phone = "";
  },
};

// 📌 แล้วให้ app.js ดึงเข้าไปใน setup ได้เลย
// return { Example } แล้วใน template ใช้ได้หมดเลย เช่น
// {{ Example.count }}
// @click="Example.increase()"

// -------------------------------
// 3️⃣ ถ้าอยากใช้ร่วมกันหลายไฟล์
// -------------------------------

// ❌ อย่าสร้างตัวแปรหรือฟังก์ชันลอย ๆ
// ✅ ให้ wrap ด้วยชื่อ object เหมือนด้านบน เช่น Finance, Store, Lead

// ✅ แล้วให้ทุกไฟล์โหลดก่อน app.js ใน <script>
// ✅ app.js จะเป็นตัวรวมทุกอย่างเข้า Vue โดยผ่าน setup()

// -------------------------------
// 4️⃣ โครงสร้างแบบแนะนำ
// -------------------------------

/*
index.html
├── <script src="vue">
├── <script src="vuetify">
├── <script src="store.js">     ← state กลาง เช่น theme, user
├── <script src="finance.js">   ← ฟังก์ชันสินเชื่อ เช่น calculateLoan()
├── <script src="lead.js">      ← ฟังก์ชันเกี่ยวกับข้อมูลลูกค้า
├── <script src="gui.js">       ← UI เช่น ปิดเมนู, เปลี่ยนสี
└── <script src="app.js">       ← boot Vue + รวมทุกอย่าง
*/

// -------------------------------
// 5️⃣ Vue Template ใช้ยังไง?
// -------------------------------

/*
<v-text-field v-model="Example.user.phone" label="เบอร์โทรลูกค้า"></v-text-field>
<v-btn @click="Example.increase()">เพิ่ม</v-btn>
<p>ยอด: {{ Example.count }}</p>
*/

// -------------------------------
// ✅ สรุปจำง่ายสุด
// -------------------------------

/*
ref = ใช้กับ ตัวเลข, string, true/false → ต้องใช้ .value
reactive = ใช้กับ object/array หลายค่า → ไม่ต้อง .value

ให้ wrap ทุกอย่างไว้ใน object ชื่อเดียวกับไฟล์
app.js เอามาใช้โดย return { Finance, Lead, Store }
ใน template ใช้แบบ dot เช่น {{ Finance.loan }}
*/

// 🎁 พิเศษ: ถ้าอยาก debug
// console.log(Example.user.name)
// หรือดูใน DevTools > Vue ก็ดีมาก
