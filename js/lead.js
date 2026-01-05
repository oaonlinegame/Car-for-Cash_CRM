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
     * ทำหน้าที่เป็น Data Binding Source สำหรับหน้าจอเพิ่มและแก้ไขข้อมูล
     */
    form: Vue.reactive(global.DataSpec.Lead.createDefault()),

    // ========================================================================
    // 2. SYSTEM INITIALIZATION (การเริ่มต้นระบบและวงจรชีวิต)
    // ========================================================================

    /**
     * เริ่มต้นการทำงานของโมดูลและตั้งค่า Event Watchers
     * @param {Object} state - Global AppState สำหรับตรวจสอบสถานะ UI
     *
     * วัตถุประสงค์:
     * - เพื่อผูกการทำงานระหว่างสถานะของ Modal และข้อมูลในฟอร์ม
     * - เมื่อ Modal ปิดลง (isOpen == false) ระบบจะทำการรีเซ็ตฟอร์มอัตโนมัติ
     * - ป้องกันการค้างของข้อมูล (Stale Data) เมื่อผู้ใช้เปิดหน้าต่างขึ้นมาใหม่
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
     * ดึงข้อมูล Lead ทั้งหมดจาก Local Database (IndexedDB)
     * และดำเนินการอัปเดตลงใน Global Store เพื่อแสดงผล
     *
     * ลำดับการทำงาน:
     * 1. เรียกข้อมูลทั้งหมดจาก Repository (leads.getAll)
     * 2. กำหนดค่าเริ่มต้นให้กับ Dropdown ในฟอร์ม (Occupation, Source) จาก MasterData
     * 3. รีเซ็ตฟอร์มสัญญาย่อย (Contract Form) เพื่อเตรียมความพร้อม
     * 4. อัปเดตข้อมูลลง Global Store เพื่อให้ UI ทำการ Render
     * 5. เริ่มกระบวนการตรวจสอบและซ่อมแซมข้อมูล (Self-Healing) ใน Background (ถ้าจำเป็น)
     */
    async loadAll() {
      try {
        // 1. ดึงข้อมูลดิบจาก Repository
        const items = await global.Repository.leads.getAll();
        const itemsToUpdate = []; // เก็บรายการที่ต้องซ่อมแซมโครงสร้าง

        // 2. กำหนดค่า Default Selection สำหรับ Dropdown หากมีข้อมูลใน Store
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

        // 3. รีเซ็ตฟอร์มส่วนควบ (Contract Form) ผ่าน Module ที่เกี่ยวข้อง
        this.resetNewContractForm();

        // 4. อัปเดต Store (UI Update) ผ่าน Utility
        if (global.Utils?.storeSetItems) {
          global.Utils.storeSetItems("Lead", items);
        }

        // 5. กระบวนการ Self-Healing (Background Task)
        // หน่วงเวลาทำงานเพื่อให้ UI หลัก Render เสร็จสิ้นก่อน (Performance Optimization)
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
    // 4. FORM MANAGEMENT (การจัดการสถานะฟอร์มและการเตรียมข้อมูล)
    // ========================================================================

    /**
     * เตรียมข้อมูลสำหรับการแก้ไข (Edit Mode Preparation)
     * @param {Object} lead - ข้อมูล Lead ต้นฉบับที่ต้องการแก้ไข
     *
     * วัตถุประสงค์:
     * - คัดลอกข้อมูลจาก Object ต้นฉบับลงสู่ Form State
     * - ตรวจสอบความสมบูรณ์ของโครงสร้างข้อมูล (เช่น Array contracts)
     * - เพื่อให้ UI แสดงข้อมูลเดิมก่อนที่ผู้ใช้จะทำการแก้ไข
     */
    prepareEdit(lead) {
      if (!lead) return;

      // คัดลอกข้อมูลลงฟอร์ม
      Object.assign(LeadApp.form, lead);

      // ตรวจสอบโครงสร้าง Array ของ Contracts ให้ถูกต้อง (Schema Enforcement)
      if (!Array.isArray(LeadApp.form.contracts)) {
        LeadApp.form.contracts = [];
      }
    },

    /**
     * รีเซ็ตฟอร์ม Lead กลับสู่ค่าเริ่มต้น (Reset Form)
     *
     * ลำดับการทำงาน:
     * 1. ใช้ Utils.resetForm เพื่อล้างค่าและคืนค่า Default ตาม DataSpec
     * 2. กำหนดค่า Default ให้กับ Dropdown (อาชีพ, แหล่งที่มา, เกรด) ตาม Config
     * 3. รีเซ็ตสถานะ Tab ของ UI กลับไปที่หน้าข้อมูลทั่วไป
     * 4. สั่งรีเซ็ตฟอร์มย่อย (Contract) ที่เกี่ยวข้อง
     */
    resetLeadForm() {
      if (global.Utils && global.Utils.resetForm) {
        const config = {
          occupation: "occupationOptions", // ดึงค่า Default จาก Master Data อาชีพ
          source: "sourceOptions", // ดึงค่า Default จาก Master Data แหล่งที่มา
          grade: "gradeOptions", // ดึงค่า Default จาก Master Data เกรดลูกค้า
        };

        global.Utils.resetForm(
          LeadApp.form,
          global.DataSpec.Lead.createDefault(),
          config
        );
      }

      // คืนค่าแท็บกลับไปที่หน้าข้อมูลลูกค้าเสมอเมื่อรีเซ็ต
      if (global.AppState && global.AppState.leadTab) {
        global.AppState.leadTab.value = "leadInfo";
        console.log(
          "👤 LeadApp: Reset leadTab to 'leadInfo' to prevent blank screen."
        );
      }

      // รีเซ็ตฟอร์มย่อย (Contract) ด้วย
      this.resetNewContractForm();
    },

    /**
     * สั่งรีเซ็ตฟอร์มสัญญาใหม่
     * โดยการ Delegate คำสั่งไปยัง ContractApp
     */
    resetNewContractForm() {
      if (global.ContractApp) global.ContractApp.resetNewForm();
    },

    /**
     * เพิ่มสัญญาเปล่าลงในฟอร์ม Lead ปัจจุบัน (In-Memory Operation)
     *
     * ลำดับการทำงาน:
     * 1. เรียก ContractApp เพื่อสร้าง Object สัญญาใหม่และเพิ่มลงใน Array
     * 2. ทำการสลับ Tab ใน UI ไปยังสัญญาที่เพิ่งสร้างใหม่ทันที
     * 3. ใช้ setTimeout เพื่อรอให้ Vue Render DOM ของ Tab ใหม่ให้เสร็จสมบูรณ์ก่อน
     */
    addEmptyContract() {
      if (global.ContractApp) {
        global.ContractApp.addEmpty(LeadApp.form);

        // หลังจากเพิ่มสัญญาใน Array แล้ว ให้สลับแท็บไปที่สัญญาสุดท้ายทันที
        const newContractIndex = LeadApp.form.contracts.length - 1;
        if (global.AppState && global.AppState.leadTab) {
          // ใช้ความล่าช้าเล็กน้อยเพื่อให้ Vue Render DOM ของแท็บใหม่ก่อน
          setTimeout(() => {
            global.AppState.leadTab.value = "contract-" + newContractIndex;
            console.log(
              "📑 LeadApp: Switched to new contract tab:",
              newContractIndex
            );
          }, 0);
        }
      }
    },

    /**
     * จัดการ Event เมื่อมีการเปลี่ยนข้อมูลอาชีพ (Auto-Save Master Data)
     * @param {string} val - ค่าอาชีพที่ระบุ
     * หากเป็นค่าใหม่ที่ยังไม่มีในระบบ จะทำการเพิ่มลงใน MasterData ทันที
     */
    handleOccupationChange(val) {
      if (
        global.MasterData &&
        typeof global.MasterData.addOption === "function"
      ) {
        global.MasterData.addOption("occupationOptions", val);
      }
    },

    /**
     * จัดการ Event เมื่อมีการเปลี่ยนข้อมูลเกรดลูกค้า (Auto-Save Master Data)
     * @param {string} val - ค่าเกรดที่ระบุ
     * หากเป็นค่าใหม่ที่ยังไม่มีในระบบ จะทำการเพิ่มลงใน MasterData ทันที
     */
    handleGradeChange(val) {
      if (
        val &&
        global.MasterData &&
        typeof global.MasterData.addOption === "function"
      ) {
        global.MasterData.addOption("gradeOptions", val);
        console.log("⭐ LeadApp: Auto-saved new Grade:", val);
      }
    },

    // ========================================================================
    // 5. CRUD OPERATIONS (การจัดการข้อมูล: เพิ่ม / แก้ไข / ลบ)
    // ========================================================================

    /**
     * สร้างข้อมูล Lead ใหม่และบันทึกลงฐานข้อมูล (Create)
     * @param {Object} formData - ข้อมูลจากฟอร์ม (Optional)
     *
     * ลำดับการทำงาน:
     * 1. เตรียมข้อมูล (Payload) และประทับเวลาสร้าง (createDate)
     * 2. สร้าง Search Index จากข้อมูลสำคัญเพื่อเพิ่มประสิทธิภาพการค้นหา
     * 3. บันทึกลง IndexedDB ผ่าน Repository และรอรับ ID ใหม่
     * 4. เพิ่มข้อมูลใหม่ลงใน Global Store ทันที (Optimistic Update)
     * 5. รีเซ็ตฟอร์มและแสดงการแจ้งเตือน
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
     *
     * ลำดับการทำงาน:
     * 1. ตรวจสอบความมีอยู่ของ ID (Primary Key)
     * 2. สร้าง Search Index ใหม่ตามข้อมูลล่าสุด
     * 3. ส่งคำสั่ง Update ไปยัง Repository
     * 4. ค้นหาและแทนที่ข้อมูลใน Global Store (Array Mutation)
     * 5. แสดงการแจ้งเตือนความสำเร็จ
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
     * @param {number|string} id - รหัสอ้างอิงของข้อมูลที่ต้องการลบ
     *
     * ลำดับการทำงาน:
     * 1. แสดงหน้าต่างยืนยัน (Confirmation Dialog)
     * 2. ส่งคำสั่ง Delete ไปยัง Repository
     * 3. ลบรายการออกจาก Global Store (Array Splice) เพื่ออัปเดต UI
     * 4. แสดงการแจ้งเตือนความสำเร็จ
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
    // 6. LEGACY INTERFACE (จุดเชื่อมต่อสำหรับโค้ดเก่า)
    // ========================================================================
    // Wrapper Functions เพื่อรองรับการเรียกใช้จากโค้ดส่วนอื่น
    // ที่อาจยังใช้ชื่อฟังก์ชันแบบเก่าอยู่ (Backward Compatibility)

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
