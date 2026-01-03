// js/lead.js
// --------------------------------------------------------
// 👤 Lead App (Business Logic สำหรับจัดการข้อมูลลูกค้า)
// --------------------------------------------------------
// โมดูลนี้ทำหน้าที่เป็น Controller หลักสำหรับการจัดการ Lead
// รวบรวมฟังก์ชันด้าน CRUD, การจัดการ State ของฟอร์ม,
// และการซิงค์ข้อมูลระหว่าง Database (Repository) และ UI (Store)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const LeadApp = {
    // ========================================================================
    // 1. STATE MANAGEMENT (การจัดการสถานะ)
    // ========================================================================

    /**
     * สถานะ Reactive ของฟอร์ม Lead
     * ใช้สำหรับผูกข้อมูลกับหน้าจอ UI (v-model) โดยตรง
     * โครงสร้างข้อมูลเริ่มต้นถูกสร้างจาก DataSpec
     */
    form: Vue.reactive(global.DataSpec.Lead.createDefault()),

    // ========================================================================
    // 2. DATA LOADING & SYNCHRONIZATION (การโหลดและซิงค์ข้อมูล)
    // ========================================================================

    /**
     * ดึงข้อมูล Lead ทั้งหมดจากฐานข้อมูลและอัปเดตลง Store
     * รวมถึงการตั้งค่าเริ่มต้นให้กับฟอร์มตาม Master Data ที่มี
     */
    async loadAll() {
      try {
        // 1. ดึงข้อมูลดิบทั้งหมดจาก Repository (IndexedDB)
        const items = await global.Repository.leads.getAll();
        const itemsToUpdate = []; // อาร์เรย์สำหรับเก็บรายการที่ต้องซ่อมแซมข้อมูล (Self-Healing)

        // 2. กำหนดค่าเริ่มต้นให้กับฟอร์ม (Form Defaults)
        // ตรวจสอบว่ามีข้อมูล Master Data ใน Store หรือไม่
        // หากมี จะนำค่าลำดับแรกมาใช้เป็นค่าเริ่มต้นของฟอร์ม (อาชีพ)
        if (
          global.Store &&
          Array.isArray(global.Store.data.occupationOptions) &&
          global.Store.data.occupationOptions.length > 0
        ) {
          LeadApp.form.occupation = global.Store.data.occupationOptions[0];
        }

        // หากมี จะนำค่าลำดับแรกมาใช้เป็นค่าเริ่มต้นของฟอร์ม (แหล่งที่มา)
        if (
          global.Store &&
          Array.isArray(global.Store.data.sourceOptions) &&
          global.Store.data.sourceOptions.length > 0
        ) {
          LeadApp.form.source = global.Store.data.sourceOptions[0];
        }

        // รีเซ็ตฟอร์มสัญญาที่เกี่ยวข้องให้เป็นค่าเริ่มต้น
        this.resetNewContractForm();

        // 3. อัปเดตข้อมูลลง Store เพื่อแสดงผลบน UI ทันที
        // ใช้ Utils.storeSetItems เพื่อจัดการการแช่แข็งข้อมูล (Freeze) เพื่อประสิทธิภาพ
        if (global.Utils?.storeSetItems) {
          global.Utils.storeSetItems("Lead", items);
        }

        // 4. กระบวนการตรวจสอบและแก้ไขข้อมูลแบบเบื้องหลัง (Deferred Self-Healing)
        // ตรวจสอบว่ามีรายการที่ต้องอัปเดตหรือไม่ (จาก logic ก่อนหน้า)
        if (itemsToUpdate.length > 0) {
          console.log(
            `🛠️ LeadApp: Scheduled self-healing for ${itemsToUpdate.length} items (Deferred)...`
          );

          // ใช้ setTimeout เพื่อผลักภาระงานไปทำหลังจาก Main Thread ว่าง
          // ป้องกันไม่ให้ UI กระตุกขณะเริ่มระบบ
          setTimeout(async () => {
            try {
              if (global.Repository?.leads?.update) {
                // วนลูปอัปเดตข้อมูลเฉพาะส่วนที่จำเป็น (Partial Update)
                for (const item of itemsToUpdate) {
                  await global.Repository.leads.update(item.id, {
                    _searchIndex: item._searchIndex,
                  });
                }
                console.log("✅ LeadApp: Self-healing complete (Safe Patch).");
              }
            } catch (err) {
              // ดักจับข้อผิดพลาดที่ไม่ร้ายแรงเพื่อไม่ให้ระบบหยุดทำงาน
              console.warn(
                "⚠️ LeadApp: Self-healing write skipped (Non-critical):",
                err
              );
            }
          }, 2000);
        }
      } catch (err) {
        console.error("❌ Load Error:", err);
        global.AppNotifications?.show("โหลดข้อมูลไม่สำเร็จ");
      }
    },

    // ========================================================================
    // 3. DATA PERSISTENCE (การบันทึกข้อมูล - CRUD)
    // ========================================================================

    /**
     * สร้าง Lead ใหม่และบันทึกลงฐานข้อมูล
     * @param {Object} formData - ข้อมูลจากฟอร์ม (ถ้าไม่ระบุจะใช้ LeadApp.form)
     */
    async add(formData) {
      try {
        const src = formData || LeadApp.form;

        // เตรียมข้อมูลสำหรับบันทึก พร้อมระบุวันที่สร้าง
        const dataToSave = {
          ...src,
          createDate: new Date().toLocaleDateString("th-TH"),
        };

        // สร้างดัชนีการค้นหา (Search Index) เพื่อประสิทธิภาพในการกรองข้อมูล
        if (global.Utils?.generateSearchIndex) {
          dataToSave._searchIndex =
            global.Utils.generateSearchIndex(dataToSave);
        }

        // บันทึกลง Repository และรับ ID ที่ได้กลับมา
        const newId = await global.Repository.leads.create(dataToSave);

        // เตรียม object สำหรับอัปเดต Store (ต้องมี ID)
        const itemForStore = { ...dataToSave, id: newId };

        // อัปเดต Store ทันทีเพื่อให้ UI แสดงผลรายการใหม่โดยไม่ต้องโหลดซ้ำ
        if (global.Store && global.Store.data.leadItems) {
          global.Store.data.leadItems.push(Object.freeze(itemForStore));
        }

        // รีเซ็ตฟอร์มเพื่อเตรียมพร้อมสำหรับการกรอกข้อมูลถัดไป
        LeadApp.resetLeadForm();
        global.AppNotifications?.show("✅ บันทึกข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ บันทึกไม่สำเร็จ: " + err.message);
      }
    },

    /**
     * อัปเดตข้อมูล Lead ที่มีอยู่แล้ว
     * ใช้ข้อมูลจาก LeadApp.form ในการบันทึก
     */
    async update() {
      try {
        // ตรวจสอบความถูกต้องของ ID ก่อนดำเนินการ
        if (!LeadApp.form.id) return;

        const updatedData = { ...LeadApp.form };

        // สร้างดัชนีการค้นหาใหม่เพื่อให้สอดคล้องกับข้อมูลที่แก้ไข
        if (global.Utils?.generateSearchIndex) {
          updatedData._searchIndex =
            global.Utils.generateSearchIndex(updatedData);
        }

        // ส่งข้อมูลไปอัปเดตที่ Repository
        await global.Repository.leads.update(LeadApp.form.id, updatedData);

        // ค้นหาและอัปเดตข้อมูลใน Store เพื่อให้ UI เป็นปัจจุบัน
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
     * ลบข้อมูล Lead ตาม ID ที่ระบุ
     * @param {number|string} id - ID ของ Lead ที่ต้องการลบ
     */
    async delete(id) {
      try {
        if (!confirm("ยืนยันการลบข้อมูลนี้?")) return;

        // ลบข้อมูลออกจาก Repository
        await global.Repository.leads.delete(id);

        // ลบข้อมูลออกจาก Store เพื่อให้ UI อัปเดตทันที
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
    // 4. FORM MANAGEMENT (การจัดการฟอร์ม)
    // ========================================================================

    /**
     * เตรียมข้อมูลสำหรับหน้าแก้ไข (Edit Mode)
     * คัดลอกข้อมูลจาก Lead ที่เลือกมาใส่ใน Form State
     * @param {Object} lead - ข้อมูล Lead ที่ต้องการแก้ไข
     */
    prepareEdit(lead) {
      if (!lead) return;

      // คัดลอกคุณสมบัติทั้งหมดไปยัง Reactive Form
      Object.assign(LeadApp.form, lead);

      // ตรวจสอบความสมบูรณ์ของโครงสร้างข้อมูล (Contracts)
      // หากไม่มี ให้สร้างเป็น Array ว่างเพื่อป้องกัน Error ใน UI
      if (!Array.isArray(LeadApp.form.contracts)) {
        LeadApp.form.contracts = [];
      }
    },

    /**
     * รีเซ็ตฟอร์ม Lead กลับเป็นค่าเริ่มต้น
     * ใช้ Utils.resetForm เพื่อจัดการค่า Default และ Mapping กับ Master Data
     */
    resetLeadForm() {
      if (global.Utils && global.Utils.resetForm) {
        // กำหนดการจับคู่ชื่อฟิลด์กับชื่อข้อมูลใน Store
        const config = {
          occupation: "occupationOptions",
          source: "sourceOptions",
        };

        // รีเซ็ตค่าโดยใช้โครงสร้างเริ่มต้นจาก DataSpec
        global.Utils.resetForm(
          LeadApp.form,
          global.DataSpec.Lead.createDefault(),
          config
        );
      }
      // รีเซ็ตฟอร์มย่อย (สัญญา) ด้วย
      this.resetNewContractForm();
    },

    /**
     * รีเซ็ตฟอร์มสำหรับสร้างสัญญาใหม่
     * เรียกใช้ฟังก์ชันจาก ContractApp
     */
    resetNewContractForm() {
      if (global.ContractApp) global.ContractApp.resetNewForm();
    },

    /**
     * เพิ่มสัญญาเปล่าลงในฟอร์มปัจจุบัน
     * ใช้สำหรับกรณีต้องการเพิ่มสัญญาในขณะกรอกข้อมูล Lead
     */
    addEmptyContract() {
      if (global.ContractApp) global.ContractApp.addEmpty(LeadApp.form);
    },

    /**
     * จัดการเมื่อมีการเปลี่ยนแปลงค่าในช่องอาชีพ (Occupation)
     * หากเป็นค่าใหม่ จะทำการเพิ่มลงในตัวเลือก Master Data
     * @param {string} val - ค่าอาชีพที่ผู้ใช้กรอก
     */
    handleOccupationChange(val) {
      // ✅ แก้ไข: เรียก MasterData โดยตรง (Direct Dependency)
      if (
        global.MasterData &&
        typeof global.MasterData.addOption === "function"
      ) {
        global.MasterData.addOption("occupationOptions", val);
      }
    },

    // ========================================================================
    // 5. LEGACY WRAPPERS (ฟังก์ชันห่อหุ้มสำหรับการเข้ากันได้กับโค้ดเก่า)
    // ========================================================================

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
