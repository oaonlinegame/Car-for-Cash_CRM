// js/dexie.js
// --------------------------------------------------------
// 📘 Dexie Storage Layer (Cleaned Version)
// --------------------------------------------------------

const AppDexie = (() => {
  // ------------------------------------------------------
  // ⭐ สร้างฐานข้อมูล Dexie
  // ------------------------------------------------------
  const db = new Dexie("LeadManagerDB");

  // ------------------------------------------------------
  // ⭐ กำหนด Schema
  // ------------------------------------------------------
  db.version(2).stores({
    leads: "++id, firstName, phones, status, province, postalCode, createDate",
    settings: "key", // ตารางสำหรับเก็บ Config
  });

  const leadTable = db.leads;
  const settingsTable = db.settings;

  // ------------------------------------------------------
  // ⭐ Lead API
  // ------------------------------------------------------
  const lead = {
    async add(data) {
      return await leadTable.add(data);
    },
    async update(id, patch) {
      return await leadTable.update(id, patch);
    },
    async delete(id) {
      return await leadTable.delete(id);
    },
    async getAll() {
      return await leadTable.toArray();
    },
    async clear() {
      return await leadTable.clear();
    },
  };

  // ------------------------------------------------------
  // ⭐ Settings API (ตัด delete ออก)
  // ------------------------------------------------------
  const settings = {
    // บันทึกหรืออัปเดตค่า (Upsert)
    async set(key, value) {
      return await settingsTable.put({ key, value });
    },
    // ดึงค่า
    async get(key) {
      const result = await settingsTable.get(key);
      return result ? result.value : null;
    },
  };

  // ------------------------------------------------------
  // ⭐ Export
  // ------------------------------------------------------
  return {
    lead,
    settings,
    db,
  };
})();

window.AppDexie = AppDexie;
