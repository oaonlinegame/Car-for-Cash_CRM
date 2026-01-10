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

    form: Vue.reactive(global.DataSpec.Lead.createDefault()),

    // ========================================================================
    // 2. SYSTEM INITIALIZATION (การเริ่มต้นระบบและวงจรชีวิต)
    // ========================================================================

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

    async loadAll() {
      try {
        const items = await global.Repository.leads.getAll();
        const itemsToUpdate = [];

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

        this.resetNewContractForm();

        if (global.Utils?.storeSetItems) {
          global.Utils.storeSetItems("Lead", items);
        }

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

    prepareEdit(lead) {
      if (!lead) return;
      Object.assign(LeadApp.form, lead);
      if (!Array.isArray(LeadApp.form.contracts)) {
        LeadApp.form.contracts = [];
      }
    },

    resetLeadForm() {
      if (global.Utils && global.Utils.resetForm) {
        const config = {
          occupation: "occupationOptions",
          source: "sourceOptions",
          grade: "gradeOptions",
        };

        global.Utils.resetForm(
          LeadApp.form,
          global.DataSpec.Lead.createDefault(),
          config
        );
      }

      if (global.AppState && global.AppState.leadTab) {
        global.AppState.leadTab.value = "leadInfo";
        console.log(
          "👤 LeadApp: Reset leadTab to 'leadInfo' to prevent blank screen."
        );
      }
      this.resetNewContractForm();
    },

    resetNewContractForm() {
      if (global.ContractApp) global.ContractApp.resetNewForm();
    },

    addEmptyContract() {
      if (global.ContractApp) {
        global.ContractApp.addEmpty(LeadApp.form);
        const newContractIndex = LeadApp.form.contracts.length - 1;
        if (global.AppState && global.AppState.leadTab) {
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

    handleOccupationChange(val) {
      if (
        global.MasterData &&
        typeof global.MasterData.addOption === "function"
      ) {
        global.MasterData.addOption("occupationOptions", val);
      }
    },

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
     * [แก้ไข]: ลบ id ทิ้งหากเป็น null เพื่อแก้ปัญหา DataError ของ IndexedDB
     */
    async add(formData) {
      try {
        const src = formData || LeadApp.form;

        // 1. Validation
        if (!src.firstName || src.firstName.trim() === "") {
          alert("กรุณาระบุชื่อลูกค้า หรือ ชื่อบริษัท");
          return;
        }

        // 2. Proxy Stripping
        const plainData = JSON.parse(JSON.stringify(src));

        // [CRITICAL FIX] ลบ Property 'id' ออก หากค่าเป็น null/falsy
        // เพื่อให้ Dexie/IndexedDB ทำงาน Auto Increment ได้ถูกต้อง
        if (!plainData.id) {
          delete plainData.id;
        }

        const dataToSave = {
          ...plainData,
          createDate: new Date().toLocaleDateString("th-TH"),
        };

        if (global.Utils?.generateSearchIndex) {
          dataToSave._searchIndex =
            global.Utils.generateSearchIndex(dataToSave);
        }

        // บันทึกลง DB
        const newId = await global.Repository.leads.create(dataToSave);

        // อัปเดต Store
        const itemForStore = { ...dataToSave, id: newId };
        if (global.Store && global.Store.data.leadItems) {
          global.Store.data.leadItems.push(Object.freeze(itemForStore));
        }

        LeadApp.resetLeadForm();

        if (global.AppState && global.AppState.isOpenModalLead) {
          global.AppState.isOpenModalLead.value = false;
        }

        alert("✅ บันทึกข้อมูลลูกค้าเรียบร้อยแล้ว");
      } catch (err) {
        console.error("LeadApp Add Error:", err);
        alert("❌ บันทึกไม่สำเร็จ: " + err.message);
      }
    },

    async update() {
      try {
        if (!LeadApp.form.id) return;

        const plainData = JSON.parse(JSON.stringify(LeadApp.form));
        const updatedData = { ...plainData };

        if (global.Utils?.generateSearchIndex) {
          updatedData._searchIndex =
            global.Utils.generateSearchIndex(updatedData);
        }

        await global.Repository.leads.update(LeadApp.form.id, updatedData);

        if (global.Store && global.Store.data.leadItems) {
          const list = global.Store.data.leadItems;
          const index = list.findIndex((item) => item.id === updatedData.id);
          if (index !== -1) {
            list[index] = Object.freeze(updatedData);
          }
        }

        if (global.AppState && global.AppState.isOpenModalLead) {
          global.AppState.isOpenModalLead.value = false;
        }

        alert("✅ แก้ไขข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        alert("❌ แก้ไขไม่สำเร็จ: " + err.message);
      }
    },

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

    // ✅ [NEW] ฟังก์ชันกลางสำหรับตัดสินใจว่า บันทึกใหม่ หรือ แก้ไข
    save() {
      // 1. ปิด Dialog ยืนยัน
      if (global.AppState.isOpenConfirmSaveLead) {
        global.AppState.isOpenConfirmSaveLead.value = false;
      }

      // 2. ตรวจสอบว่ามี ID หรือไม่ เพื่อเลือก Action ที่ถูกต้อง
      if (LeadApp.form.id) {
        // กรณีมี ID = แก้ไข
        this.update();
      } else {
        // กรณีไม่มี ID = สร้างใหม่
        this.add(LeadApp.form);
      }
    },
    // ฟังก์ชันเช็คซ้ำก่อนเปิด Dialog
    async checkDuplicateAndOpen() {
      try {
        // 1. เคลียร์ค่าเก่า
        global.AppState.duplicateLeads.value = [];

        // 2. ดึงข้อมูลทั้งหมดจาก Repository (แก้ไข path ให้ถูกต้อง)
        // จากเดิม: global.Repository.getAll("leads") ❌ ผิด
        // เปลี่ยนเป็น: global.Repository.leads.getAll() ✅ ถูกต้องตาม repository.js
        const allLeads = await global.Repository.leads.getAll();
        const f = this.form;

        if (allLeads && allLeads.length > 0) {
          // กรองหาตัวซ้ำ
          const duplicates = allLeads.filter((item) => {
            // ไม่นับตัวเอง (กรณีแก้ไข)
            if (f.id && item.id === f.id) return false;

            // ⚠️ แก้ไขชื่อ Field ให้ตรงกับ DataSpec.js
            // (firstName, nickName, phones, phone2)

            // เช็คชื่อ (firstName)
            const matchName =
              f.firstName &&
              item.firstName &&
              item.firstName.trim() === f.firstName.trim();

            // เช็คชื่อเล่น (nickName)
            const matchNick =
              f.nickName &&
              item.nickName &&
              item.nickName.trim() === f.nickName.trim();

            // เช็คเบอร์โทรหลัก (phones)
            const matchTel1 =
              f.phones && item.phones && item.phones.trim() === f.phones.trim();

            // เช็คเบอร์โทรสำรอง (phone2)
            const matchTel2 =
              f.phone2 && item.phone2 && item.phone2.trim() === f.phone2.trim();

            return matchName || matchNick || matchTel1 || matchTel2;
          });

          global.AppState.duplicateLeads.value = duplicates;
        }

        // 3. เปิด Dialog (Dialog จะแสดงผลต่างกันตาม duplicateLeads)
        global.AppState.isOpenConfirmSaveLead.value = true;
      } catch (error) {
        console.error("Duplicate Check Error:", error);
        // กรณี Error ให้เปิด Dialog ไปเลย เพื่อไม่ให้ User ติดขัด (Fail-safe)
        global.AppState.isOpenConfirmSaveLead.value = true;
      }
    },

    /**
     * จัดการข้อมูลซ้ำตามปุ่มที่เลือก (Update / Replace)
     * @param {string} action - คำสั่ง 'update' หรือ 'replace'
     * @param {Object} targetLead - ข้อมูล Lead เดิมที่อยู่ในระบบ
     */
    async resolveDuplicate(action, targetLead) {
      if (!targetLead || !targetLead.id) return;

      console.log(
        `🚀 Resolve Duplicate Action: [${action}] on ID: ${targetLead.id}`
      );

      // 1. ยึด ID ของตัวเดิม เพื่อให้ระบบรู้ว่าเรากำลังจะ "ทับ" ตัวนี้
      this.form.id = targetLead.id;

      // 2. แยก Logic (เตรียมไว้สำหรับคำสั่งต่อไปของคุณ)
      if (action === "update") {
        // TODO: รอคำสั่ง Logic การอัปเดตแบบละเอียด
        // เบื้องต้น: ใช้ข้อมูลฟอร์มปัจจุบัน บันทึกทับข้อมูลเดิม
        console.log("ℹ️ Mode: Update (Merge Logic Pending)");
      } else if (action === "replace") {
        // TODO: รอคำสั่ง Logic การแทนที่แบบละเอียด
        // เบื้องต้น: เขียนทับทั้งหมด
        console.log("ℹ️ Mode: Replace (Overwrite All)");
      }

      // 3. ปิด Dialog แจ้งเตือนซ้ำ
      if (global.AppState.isOpenConfirmSaveLead) {
        global.AppState.isOpenConfirmSaveLead.value = false;
      }

      // 4. สั่งบันทึกทันที (Update)
      await this.update();
    },

    /**
     * เปิดดูข้อมูลสรุป (Read-Only) เมื่อ User คลิกที่แถวรายการซ้ำ
     */
    // --------------------------------------------------------
    // 🟢 ส่วนเสริมสำหรับ Summary Dialog (วางเพิ่มตรงนี้)
    // --------------------------------------------------------

    /**
     * เปิดดูข้อมูลสรุป (Read-Only)
     */
    viewSummary(lead) {
      if (!lead) return;
      // ส่งข้อมูลเข้า State
      if (global.AppState) {
        global.AppState.summaryLead.value = lead;
        global.AppState.isOpenModalLeadSummary.value = true;
      }
    },

    /**
     * รวมหลักทรัพย์ทั้งหมด (Profile + Contracts) เพื่อแสดงในตารางเดียว
     */
    getConsolidatedAssets(lead) {
      if (!lead) return [];
      let allAssets = [];

      // 1. ดึงจาก Lead Profile
      if (Array.isArray(lead.assets)) {
        lead.assets.forEach((a) => {
          allAssets.push({
            ...a,
            _sourceType: "Profile",
            _sourceName: "ทรัพย์สินส่วนตัว",
            _color: "teal",
          });
        });
      }

      // 2. ดึงจาก Contracts
      if (Array.isArray(lead.contracts)) {
        lead.contracts.forEach((ct, index) => {
          if (Array.isArray(ct.assets)) {
            ct.assets.forEach((a) => {
              const ctName = ct.contractNo
                ? `สัญญา ${ct.contractNo}`
                : `สัญญา #${index + 1}`;
              allAssets.push({
                ...a,
                _sourceType: "Contract",
                _sourceName: ctName,
                _color: "indigo",
              });
            });
          }
        });
      }

      return allAssets;
    },

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

  global.LeadApp = LeadApp;
})(window);
