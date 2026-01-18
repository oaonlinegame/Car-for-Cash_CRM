// js/lead.js
// --------------------------------------------------------
// 👤 LEAD MANAGEMENT MODULE
// --------------------------------------------------------
// โมดูลหลักสำหรับจัดการ Business Logic ของข้อมูลลูกค้า (Leads)
// ปรับปรุง: แยก Logic การสร้างสัญญาไปไว้ที่ ContractApp
// --------------------------------------------------------

(function (global) {
  "use strict";

  const LeadApp = {
    // ========================================================================
    // 1. REACTIVE STATE
    // ========================================================================

    form: Vue.reactive(global.DataSpec.Lead.createDefault()),

    // ========================================================================
    // 2. SYSTEM INITIALIZATION
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
    // 3. INTERNAL HELPERS (ฟังก์ชันช่วยทำงานภายใน)
    // ========================================================================

    /**
     * 🛠️ Helper: เตรียมข้อมูลสำหรับบันทึก
     */
    _prepareDataForSave(sourceData, isNew = false) {
      // 1. Deep Clone
      const plainData = JSON.parse(JSON.stringify(sourceData));

      // 2. Manage Main ID
      if (isNew) {
        if (!plainData.id) delete plainData.id;
        plainData.createDate = new Date().toLocaleDateString("th-TH");
      }

      // 3. จัดการ Assets (Lead Assets)
      if (Array.isArray(plainData.assets)) {
        plainData.assets = plainData.assets.filter(
          (a) => a && typeof a === "object"
        );

        plainData.assets.forEach((asset, index) => {
          if (plainData.id) {
            asset.leadId = plainData.id;
          }
          if (!asset.assetId) {
            asset.assetId = Date.now() + "-" + index;
          }
        });
      }

      // 4. Search Index
      if (global.Utils?.generateSearchIndex) {
        plainData._searchIndex = global.Utils.generateSearchIndex(plainData);
      }

      return plainData;
    },

    /**
     * 🛠️ Helper: ซิงค์ข้อมูลลง Global Store
     */
    _syncToStore(item, action) {
      if (!global.Store || !global.Store.data.leadItems) return;

      const list = global.Store.data.leadItems;

      if (action === "add") {
        list.push(Object.freeze(item));
      } else if (action === "update") {
        const index = list.findIndex((x) => x.id === item.id);
        if (index !== -1) list[index] = Object.freeze(item);
      } else if (action === "delete") {
        const index = list.findIndex((x) => x.id === item);
        if (index !== -1) list.splice(index, 1);
      }
    },

    /**
     * 🛠️ Helper: จัดการ UI หลังบันทึกสำเร็จ
     */
    _finalizeAction(closeModal = true) {
      if (closeModal && global.AppState && global.AppState.isOpenModalLead) {
        global.AppState.isOpenModalLead.value = false;
      }
    },

    // ========================================================================
    // 4. DATA LOADING
    // ========================================================================

    async loadAll() {
      try {
        const items = await global.Repository.leads.getAll();

        // ตั้งค่า Default Options
        if (global.Store?.data) {
          if (global.Store.data.occupationOptions?.length > 0) {
            LeadApp.form.occupation = global.Store.data.occupationOptions[0];
          }
          if (global.Store.data.sourceOptions?.length > 0) {
            LeadApp.form.source = global.Store.data.sourceOptions[0];
          }
        }

        // รีเซ็ตฟอร์มสัญญาเริ่มต้น
        this.resetNewContractForm();

        if (global.Utils?.storeSetItems) {
          global.Utils.storeSetItems("Lead", items);
        }
      } catch (err) {
        console.error("❌ Load Error:", err);
        global.AppNotifications?.show("โหลดข้อมูลไม่สำเร็จ");
      }
    },

    // ========================================================================
    // 5. FORM MANAGEMENT
    // ========================================================================

    prepareEdit(lead) {
      if (!lead) return;
      Object.assign(LeadApp.form, lead);
      if (!Array.isArray(LeadApp.form.contracts)) {
        LeadApp.form.contracts = [];
      }
    },

    openEdit(lead) {
      this.prepareEdit(lead);
      if (global.AppState?.isOpenModalLead) {
        global.AppState.isOpenModalLead.value = true;
      }
    },

    resetLeadForm() {
      // รีเซ็ตข้อมูล Lead
      if (global.Utils?.resetForm) {
        global.Utils.resetForm(
          LeadApp.form,
          global.DataSpec.Lead.createDefault(),
          {
            occupation: "occupationOptions",
            source: "sourceOptions",
            grade: "gradeOptions",
          }
        );
      }

      // รีเซ็ต Tab กลับไปหน้าแรก
      if (global.AppState?.leadTab) {
        global.AppState.leadTab.value = "leadInfo";
      }

      // รีเซ็ตข้อมูลสัญญาใหม่ (Delegate ไปที่ ContractApp)
      this.resetNewContractForm();
    },

    // --------------------------------------------------------
    // ✅ MODIFIED: เชื่อมต่อกับ ContractApp ใหม่
    // --------------------------------------------------------

    resetNewContractForm() {
      // เรียกใช้ resetForm ของ ContractApp (ถ้ามี)
      if (
        global.ContractApp &&
        typeof global.ContractApp.resetForm === "function"
      ) {
        global.ContractApp.resetForm();
      }
    },

    addEmptyContract() {
      if (
        global.ContractApp &&
        typeof global.ContractApp.addToLead === "function"
      ) {
        // 1. ให้ ContractApp จัดการเพิ่มข้อมูลลงใน Array
        const newIndex = global.ContractApp.addToLead(LeadApp.form);

        // 2. จัดการเปลี่ยน Tab ไปยังสัญญาใหม่ (UI Logic)
        if (newIndex !== -1 && global.AppState?.leadTab) {
          setTimeout(() => {
            global.AppState.leadTab.value = "contract-" + newIndex;
          }, 50);
        }
      } else {
        console.warn("⚠️ ContractApp not found or incomplete.");
      }
    },

    handleOccupationChange(val) {
      if (global.MasterData?.addOption) {
        global.MasterData.addOption("occupationOptions", val);
      }
    },

    handleGradeChange(val) {
      if (val && global.MasterData?.addOption) {
        global.MasterData.addOption("gradeOptions", val);
      }
    },

    // ========================================================================
    // 6. CRUD OPERATIONS
    // ========================================================================

    async add(formData) {
      try {
        const src = formData || LeadApp.form;
        if (!src.firstName || src.firstName.trim() === "") {
          alert("กรุณาระบุชื่อลูกค้า");
          return;
        }

        const dataToSave = this._prepareDataForSave(src, true);

        // บันทึกลง DB
        const newId = await global.Repository.leads.create(dataToSave);

        // อัปเดต leadId กลับเข้าไปใน assets
        if (dataToSave.assets && dataToSave.assets.length > 0) {
          dataToSave.assets.forEach((a) => (a.leadId = newId));
          await global.Repository.leads.update(newId, {
            assets: dataToSave.assets,
          });
        }

        // Update Store & UI
        const itemForStore = { ...dataToSave, id: newId };
        this._syncToStore(itemForStore, "add");
        this.resetLeadForm();
        this._finalizeAction(true);
        alert("✅ บันทึกข้อมูลเรียบร้อย");
      } catch (err) {
        console.error("Add Error:", err);
        alert("❌ " + err.message);
      }
    },

    async update() {
      try {
        if (!LeadApp.form.id) return;

        const updatedData = this._prepareDataForSave(LeadApp.form, false);

        await global.Repository.leads.update(LeadApp.form.id, updatedData);
        this._syncToStore(updatedData, "update");
        this._finalizeAction(true);
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
        this._syncToStore(id, "delete");
        global.AppNotifications?.show("🗑️ ลบข้อมูลเรียบร้อย");
      } catch (err) {
        console.error(err);
        global.AppNotifications?.show("❌ ลบไม่สำเร็จ");
      }
    },

    // ========================================================================
    // 7. UTILITY & LEGACY INTERFACE
    // ========================================================================

    save() {
      if (global.AppState.isOpenConfirmSaveLead) {
        global.AppState.isOpenConfirmSaveLead.value = false;
      }
      if (LeadApp.form.id) {
        this.update();
      } else {
        this.add(LeadApp.form);
      }
    },

    async checkDuplicateAndOpen() {
      try {
        global.AppState.duplicateLeads.value = [];
        const allLeads = await global.Repository.leads.getAll();
        const f = this.form;

        if (allLeads && allLeads.length > 0) {
          const duplicates = allLeads.filter((item) => {
            if (f.id && item.id === f.id) return false;

            const matchName =
              f.firstName &&
              item.firstName &&
              item.firstName.trim() === f.firstName.trim();
            const matchNick =
              f.nickName &&
              item.nickName &&
              item.nickName.trim() === f.nickName.trim();
            const matchTel1 =
              f.phones && item.phones && item.phones.trim() === f.phones.trim();
            const matchTel2 =
              f.phone2 && item.phone2 && item.phone2.trim() === f.phone2.trim();

            return matchName || matchNick || matchTel1 || matchTel2;
          });

          global.AppState.duplicateLeads.value = duplicates;
        }
        global.AppState.isOpenConfirmSaveLead.value = true;
      } catch (error) {
        console.error("Duplicate Check Error:", error);
        global.AppState.isOpenConfirmSaveLead.value = true;
      }
    },

    async resolveDuplicate(action, targetLead) {
      if (!targetLead || !targetLead.id) return;
      console.log(`🚀 Resolve Duplicate: [${action}] ID: ${targetLead.id}`);

      this.form.id = targetLead.id;

      if (global.AppState.isOpenConfirmSaveLead) {
        global.AppState.isOpenConfirmSaveLead.value = false;
      }

      await this.update();
    },

    viewSummary(lead) {
      if (!lead) return;
      if (global.AppState) {
        global.AppState.summaryLead.value = lead;
        global.AppState.isOpenModalLeadSummary.value = true;
      }
    },

    getConsolidatedAssets(lead) {
      if (!lead) return [];
      const safeAssets = [];
      const isValidAsset = (a) =>
        a && typeof a === "object" && !Array.isArray(a);

      try {
        if (Array.isArray(lead.assets)) {
          lead.assets.forEach((a) => {
            if (isValidAsset(a)) {
              safeAssets.push({
                ...a,
                _sourceType: "Profile",
                _sourceName: "ทรัพย์สินส่วนตัว",
                _color: "teal",
              });
            }
          });
        }
        if (Array.isArray(lead.contracts)) {
          lead.contracts.forEach((ct, i) => {
            if (ct && Array.isArray(ct.assets)) {
              ct.assets.forEach((a) => {
                if (isValidAsset(a)) {
                  const ctName = ct.contractNo || `สัญญา #${i + 1}`;
                  safeAssets.push({
                    ...a,
                    _sourceType: "Contract",
                    _sourceName: ctName,
                    _color: "indigo",
                  });
                }
              });
            }
          });
        }
      } catch (e) {
        console.warn("⚠️ Safe Asset Warning:", e);
      }
      return safeAssets;
    },

    async openSummaryBeforeUpdate() {
      if (!this.form.id) return this.add(this.form);
      if (!global.AppState?.isOpenModalLeadSummary) return this.update();

      try {
        const rawData = await global.Repository.leads.getById(this.form.id);
        if (!rawData) return this.update();

        if (Array.isArray(rawData.assets)) {
          rawData.assets = rawData.assets.filter(
            (item) => item && typeof item === "object"
          );
        }
        if (Array.isArray(rawData.contracts)) {
          rawData.contracts.forEach((ct) => {
            if (ct && Array.isArray(ct.assets)) {
              ct.assets = ct.assets.filter(
                (item) => item && typeof item === "object"
              );
            }
          });
        }

        const cleanData = JSON.parse(JSON.stringify(rawData));
        global.AppState.summaryLead.value = cleanData;
        global.AppState.isOpenModalLeadSummary.value = true;
      } catch (err) {
        this.update();
      }
    },

    // Short Aliases
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
