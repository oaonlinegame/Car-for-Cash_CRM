//store.js
const Store = Vue.reactive({
  leadHeaders: [
    { title: "ID", align: "start", key: "id" },
    { title: "ชื่อลูกค้า", align: "start", key: "customerName" },
    { title: "สถานะ", align: "start", key: "status" },
    { title: "เบอร์ติดต่อ", align: "start", key: "contactNo" },
    { title: "รถยนต์", align: "start", key: "vehicle" },
    { title: "วันที่สร้าง", align: "start", key: "dateCreated" },
    { title: "จัดการ", align: "center", key: "actions", sortable: false },
  ],
  leadItems: [
    {
      id: "CUST-001",
      name: "สมชาย ใจดี",
      postId: "",
      tel: "081-234-5678",
      rating: "0",
      isBlacklisted: false, // สถานะติ๊กดำ
      contracts: [
        {
          id: "MAIN-001",
          title: "จำนำทะเบียน Vigo 2.5",
          status: "Active",
          limit: 120000,
          rate: 0,

          remainingTerms: 18,
          subcontracts: [
            {
              id: "SUB-001",
              title: "Top-Up ครั้งที่ 1",
              type: "เพิ่มวงเงิน",
              amount: 20000,
              status: "Active",
            },
            {
              id: "SUB-002",
              title: "ประกันคุ้มครองสินเชื่อ",
              type: "ประกันเสริม",
              amount: 3500,
              status: "Inactive",
            },
          ],
        },
      ],
    },
    {
      id: "CUST-001",
      name: "สมชาย ใจดี",
      postId: "",
      tel: "081-234-5678",
      rating: 5,
      isBlacklisted: false, // สถานะติ๊กดำ
      subcontracts: [], // ไม่มีสัญญาย่อย
    },
  ],
});
