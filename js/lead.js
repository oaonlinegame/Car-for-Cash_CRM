// js/lead.js
// --------------------------------------------------------
// 👤 LEAD MANAGEMENT MODULE
// --------------------------------------------------------
// โมดูลหลักสำหรับจัดการ Business Logic ของข้อมูลลูกค้า (Leads)
// ทำหน้าที่ควบคุม State ของฟอร์ม, การรับส่งข้อมูลกับ Repository,
// และการซิงโครไนซ์ข้อมูลไปยัง Global Store เพื่อการแสดงผล
// --------------------------------------------------------

(function (global) {
  "use strict";

  const LeadApp = {
    // ========================================================================
    // 1. REACTIVE STATE (สถานะของข้อมูลที่ผูกกับ UI)
    // ========================================================================

    /**
     * ตัวแปร Reactive สำหรับเก็บข้อมูลฟอร์มลูกค้า
     * โครงสร้างข้อมูลถูกกำหนดโดย DataSpec.Lead.createDefault()
     * ใช้สำหรับผูกกับ v-model ในหน้าจอเพิ่ม/แก้ไขข้อมูลโดยตรง
     */
    form: Vue.reactive(global.DataSpec.Lead.createDefault()),

    // ========================================================================
    // 2. SYSTEM INITIALIZATION (การเริ่มต้นระบบและ Event Listeners)
    // ========================================================================

    /**
     * เริ่มต้นการทำงานของโมดูลและตั้งค่า Watchers
     * @param {Object} state - Global AppState ที่ใช้ตรวจสอบสถานะ UI (เช่น Modal Open/Close)
     * * การทำงาน:
     * 1. ตรวจสอบว่า state และ property ที่จำเป็นมีอยู่จริง
     * 2. ผูก Watcher เข้ากับสถานะการเปิด Modal (isOpenModalLead)
     * 3. เมื่อ Modal ถูกปิด (isOpen == false) จะสั่งรีเซ็ตฟอร์มทันที
     * เพื่อป้องกันข้อมูลค้าง (Stale Data) ในการใช้งานครั้งถัดไป
     */
    init(state) {
      if (state && state.isOpenModalLead) {
        Vue.watch(state.isOpenModalLead, (isOpen) => {
          if (!isOpen) {
            console.log("👤 LeadApp: Modal closed. Resetting form...");
            this.resetLeadForm();
          }
        });
      }
    },

    // ========================================================================
    // 3. DATA LOADING & SYNCHRONIZATION (การโหลดและซิงค์ข้อมูล)
    // ========================================================================

    /**
     * โหลดข้อมูล Lead ทั้งหมดจาก Local Database (IndexedDB)
     * และนำไปอัปเดตลงใน Global Store เพื่อแสดงผล
     * * กระบวนการทำงาน:
     * 1. ดึงข้อมูลทั้งหมดจาก Repository
     * 2. กำหนดค่าเริ่มต้นให้กับ Dropdown ในฟอร์ม (Occupation, Source)
     * โดยดึงค่าแรกจาก Master Data ใน Store (ถ้ามี)
     * 3. รีเซ็ตฟอร์มสัญญา (Sub-form) เพื่อความสะอาดของ State
     * 4. อัปเดตข้อมูลลง Store ผ่าน Utils.storeSetItems
     * 5. (Optional) ตรวจสอบและซ่อมแซมข้อมูล (Self-Healing) ใน Background
     * หากพบรายการที่ต้องแก้ไขโครงสร้าง
     */
    async loadAll() {
      try {
        // 1. ดึงข้อมูลดิบจาก Repository
        const items = await global.Repository.leads.getAll();
        const itemsToUpdate = []; // เก็บรายการที่ต้องซ่อมแซมโครงสร้าง (ถ้ามี)

        // 2. กำหนดค่า Default Selection สำหรับ Dropdown
        if (
          global.Store &&
          Array.isArray(global.Store.data.occupationOptions) &&
          global.Store.data.occupationOptions.length > 0
        ) {
          LeadApp.form.occupation = global.Store.data.occupationOptions[0];
        }

        if (
          global.Store &&
          Array.isArray(global.Store.data.sourceOptions) &&
          global.Store.data.sourceOptions.length > 0
        ) {
          LeadApp.form.source = global.Store.data.sourceOptions[0];
        }

        // 3. รีเซ็ตฟอร์มส่วนควบ (Contract Form)
        this.resetNewContractForm();

        // 4. อัปเดต Store (UI Update)
        if (global.Utils?.storeSetItems) {
          global.Utils.storeSetItems("Lead", items);
        }

        // 5. กระบวนการ Self-Healing (Background Task)
        // ทำงานหลังจากโหลดเสร็จ 2 วินาที เพื่อไม่ให้กระทบ Performance แรกเริ่ม
        if (itemsToUpdate.length > 0) {
          setTimeout(async () => {
            try {
              if (global.Repository?.leads?.update) {
                for (const item of itemsToUpdate) {
                  await global.Repository.leads.update(item.id, {
                    _searchIndex: item._searchIndex,
                  });
                }
                console.log("✅ LeadApp: Self-healing complete.");
              }
            } catch (err) {
              console.warn("⚠️ LeadApp: Self-healing write skipped:", err);
            }
          }, 2000);
        }
      } catch (err) {
        console.error("❌ Load Error:", err);
        global.AppNotifications?.show("โหลดข้อมูลไม่สำเร็จ");
      }
    },

    // ========================================================================
    // 4. CRUD OPERATIONS (การจัดการข้อมูล: เพิ่ม / แก้ไข / ลบ)
    // ========================================================================

    /**
     * สร้างข้อมูล Lead ใหม่และบันทึกลงฐานข้อมูล
     * @param {Object} formData - ข้อมูลจากฟอร์ม (Optional: หากไม่ระบุจะใช้ this.form)
     * * การทำงาน:
     * 1. เตรียมข้อมูล (Payload Construction) และประทับเวลาสร้าง (createDate)
     * 2. สร้าง Search Index สำหรับการค้นหาแบบรวดเร็ว
     * 3. บันทึกลง IndexedDB ผ่าน Repository และรอรับ ID ใหม่
     * 4. เพิ่มข้อมูลใหม่ลงใน Global Store ทันที (Optimistic UI Update)
     * โดยไม่ต้องโหลดข้อมูลใหม่ทั้งหมด
     * 5. รีเซ็ตฟอร์มเมื่อเสร็จสิ้น
     */
    async add(formData) {
      try {
        const src = formData || LeadApp.form;

        const dataToSave = {
          ...src,
          createDate: new Date().toLocaleDateString("th-TH"),
        };

        // สร้าง Index สำหรับการค้นหา
        if (global.Utils?.generateSearchIndex) {
          dataToSave._searchIndex =
            global.Utils.generateSearchIndex(dataToSave);
        }

        // บันทึกลง DB
        const newId = await global.Repository.leads.create(dataToSave);

        // อัปเดต Store (ต้องแนบ ID ที่ได้จาก DB กลับไปด้วย)
        const itemForStore = { ...dataToSave, id: newId };
        if (global.Store && global.Store.data.leadItems) {
          global.Store.data.leadItems.push(Object.freeze(itemForStore));
        }

        LeadApp.resetLeadForm();
        global.AppNotifications?.show("✅ บันทึกข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ บันทึกไม่สำเร็จ: " + err.message);
      }
    },

    /**
     * ปรับปรุงข้อมูล Lead ที่มีอยู่ (Update)
     * * การทำงาน:
     * 1. ตรวจสอบว่ามี ID หรือไม่ (Safety Check)
     * 2. สร้างข้อมูลใหม่และอัปเดต Search Index
     * 3. ส่งคำสั่ง Update ไปยัง Repository
     * 4. ค้นหาและแทนที่ข้อมูลเดิมใน Global Store (Array Mutation)
     * เพื่อให้หน้าจอแสดงข้อมูลล่าสุดทันที
     */
    async update() {
      try {
        if (!LeadApp.form.id) return;

        const updatedData = { ...LeadApp.form };

        if (global.Utils?.generateSearchIndex) {
          updatedData._searchIndex =
            global.Utils.generateSearchIndex(updatedData);
        }

        // อัปเดต DB
        await global.Repository.leads.update(LeadApp.form.id, updatedData);

        // อัปเดต Store
        if (global.Store && global.Store.data.leadItems) {
          const list = global.Store.data.leadItems;
          const index = list.findIndex((item) => item.id === updatedData.id);
          if (index !== -1) {
            list[index] = Object.freeze(updatedData);
          }
        }

        global.AppNotifications?.show("✅ แก้ไขข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ แก้ไขไม่สำเร็จ");
      }
    },

    /**
     * ลบข้อมูล Lead ตาม ID (Delete)
     * * การทำงาน:
     * 1. แสดงหน้าต่างยืนยัน (Confirmation Dialog)
     * 2. ส่งคำสั่ง Delete ไปยัง Repository
     * 3. ลบรายการออกจาก Global Store array (Array Splice)
     */
    async delete(id) {
      try {
        if (!confirm("ยืนยันการลบข้อมูลนี้?")) return;

        await global.Repository.leads.delete(id);

        if (global.Store && global.Store.data.leadItems) {
          const list = global.Store.data.leadItems;
          const index = list.findIndex((item) => item.id === id);

          if (index !== -1) {
            list.splice(index, 1);
          }
        }

        global.AppNotifications?.show("🗑️ ลบข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ ลบไม่สำเร็จ");
      }
    },

    // ========================================================================
    // 5. FORM MANAGEMENT & HELPERS (การจัดการสถานะฟอร์ม)
    // ========================================================================

    /**
     * เตรียมข้อมูลสำหรับการแก้ไข (Edit Mode Preparation)
     * นำข้อมูล Lead ที่เลือกมาใส่ลงใน Form State
     * @param {Object} lead - ข้อมูล Lead ต้นฉบับ
     */
    prepareEdit(lead) {
      if (!lead) return;

      // คัดลอกข้อมูลลงฟอร์ม
      Object.assign(LeadApp.form, lead);

      // ตรวจสอบโครงสร้าง Array ของ Contracts ให้ถูกต้อง
      if (!Array.isArray(LeadApp.form.contracts)) {
        LeadApp.form.contracts = [];
      }
    },

    /**
     * รีเซ็ตฟอร์ม Lead กลับสู่ค่าเริ่มต้น (Reset Form)
     * ใช้ Utils.resetForm เพื่อล้างค่าตกค้างทั้งหมด
     * และตั้งค่า Default สำหรับ Dropdown จาก Config
     */
    resetLeadForm() {
      if (global.Utils && global.Utils.resetForm) {
        const config = {
          occupation: "occupationOptions",
          source: "sourceOptions",
        };

        global.Utils.resetForm(
          LeadApp.form,
          global.DataSpec.Lead.createDefault(),
          config
        );
      }
      // รีเซ็ตฟอร์มย่อย (Contract) ด้วย
      this.resetNewContractForm();
    },

    /**
     * สั่งรีเซ็ตฟอร์มสัญญาใหม่ (ผ่าน ContractApp)
     */
    resetNewContractForm() {
      if (global.ContractApp) global.ContractApp.resetNewForm();
    },

    /**
     * เพิ่มสัญญาเปล่าลงในฟอร์ม Lead ปัจจุบัน
     */
    addEmptyContract() {
      if (global.ContractApp) global.ContractApp.addEmpty(LeadApp.form);
    },

    /**
     * จัดการ Event เมื่อมีการเปลี่ยนอาชีพ หรือพิมพ์อาชีพใหม่
     * หากเป็นอาชีพใหม่ ระบบจะบันทึกลง Master Data โดยอัตโนมัติ
     * @param {string} val - ค่าอาชีพที่เลือกหรือพิมพ์
     */
    handleOccupationChange(val) {
      if (
        global.MasterData &&
        typeof global.MasterData.addOption === "function"
      ) {
        global.MasterData.addOption("occupationOptions", val);
      }
    },

    // ========================================================================
    // 6. LEGACY INTERFACE (จุดเชื่อมต่อสำหรับโค้ดเก่า)
    // ========================================================================
    // Wrapper Functions เพื่อรองรับการเรียกใช้จากโค้ดส่วนอื่น
    // ที่อาจยังใช้ชื่อฟังก์ชันแบบเก่าอยู่

    addLead(f) {
      return LeadApp.add(f);
    },
    updateLead() {
      return LeadApp.update();
    },
    deleteLead(id) {
      return LeadApp.delete(id);
    },
  };

  // ส่งออก LeadApp เป็น Global Object
  global.LeadApp = LeadApp;
})(window);
