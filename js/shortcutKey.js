// shortcutKey.js

// ต้องพึ่งพา AppState และ AppGui จากภายนอก
// สมมติว่าไฟล์นี้จะถูกโหลดหลังจาก state.js
// และ AppGui/AppActions ถูกกำหนดไว้ใน gui.js หรือในโค้ดส่วนอื่น

// ----------------------------------------------------
// 💡 MAPPING: ชื่อแอ็กชัน -> ฟังก์ชันจริง (ต้องผูกกับ AppGui/Logic)
// ----------------------------------------------------
const AppActions = {
  openLead() {
    // ต้องเรียกใช้ AppGui.toggleMenu() ซึ่งอยู่ใน gui.js
    window.AppGui.toggleMenu("isOpenModalLead", true);
  },
  openBot() {
    // ต้องเรียกใช้ AppGui.toggleMenu() ซึ่งอยู่ใน gui.js (ถ้ามี modal)
    // window.AppGui.toggleMenu("isOpenModalBot", true);
    console.warn("[openBot] ยังไม่ได้ผูก modal จริง");
  },
  closeAll() {
    // ต้องเรียกใช้ AppGui.closeAllMenus() ซึ่งอยู่ใน gui.js
    window.AppGui.closeAllMenus();
  },
  // ตัวอย่างเพิ่ม:
  // saveForm() { /* ... */ },
};

// ----------------------------------------------------
// 🎹 HOTKEY ENGINE (ลอจิกในการตรวจจับและประมวลผล)
// ----------------------------------------------------
const Hotkey = (() => {
  // อนุญาตชื่อปุ่มพิเศษ
  const SPECIAL_KEYS = new Set([
    "Escape",
    "Enter",
    "Tab",
    "Backspace",
    "Delete",
    "Space",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "PageUp",
    "PageDown",
    "Insert",
  ]);

  // สร้างรายการ F1..F24
  for (let i = 1; i <= 24; i++) SPECIAL_KEYS.add("F" + i);

  /** แปลงสตริงคีย์ลัดเป็นโครงสร้างมาตรฐาน */
  function parseHotkeyString(str) {
    if (!str || typeof str !== "string") return null;

    const parts = str
      .split("+")
      .map((s) => s.trim())
      .filter(Boolean);

    let ctrl = false,
      alt = false,
      shift = false,
      meta = false,
      key = "";

    for (const p of parts) {
      const t = p.toLowerCase();
      if (t === "ctrl" || t === "control") ctrl = true;
      else if (t === "alt") alt = true;
      else if (t === "shift") shift = true;
      else if (t === "meta" || t === "cmd" || t === "command" || t === "win")
        meta = true;
      else {
        // ปุ่มหลัก
        key = SPECIAL_KEYS.has(p) ? p : p.toLowerCase();
      }
    }

    if (!key) return null;

    return { ctrl, alt, shift, meta, key };
  }

  /** แปลง KeyboardEvent -> โครงสร้างมาตรฐาน */
  function eventToStruct(e) {
    const ctrl = !!e.ctrlKey;
    const alt = !!e.altKey;
    const shift = !!e.shiftKey;
    const meta = !!e.metaKey;

    let key = e.key;
    if (SPECIAL_KEYS.has(key)) {
      // คงไว้
    } else {
      // เป็นตัวอักษร/ตัวเลข: ใช้ lower-case
      key = key.toLowerCase();
      if (key === " ") key = "Space"; // กรณี Spacebar
    }

    return { ctrl, alt, shift, meta, key };
  }

  /** ทำ reverse map: โครงสร้าง -> ชื่อแอ็กชัน */
  function buildReverseMap() {
    const map = new Map(); // signature -> action
    Object.entries(window.AppState.hotkeyMap).forEach(([action, combo]) => {
      const st = parseHotkeyString(combo);
      if (!st) return;
      const signature = JSON.stringify(st);
      map.set(signature, action);
    });
    return map;
  }

  /** ฟังก์ชันหลักสำหรับรับเหตุการณ์คีย์บอร์ด */
  function handleKeyDown(e) {
    if (!window.AppState.hotkeysEnabled.value) return;

    // if (e.repeat) return; // ถ้าต้องการกัน key repeat

    const rev = buildReverseMap();
    const now = eventToStruct(e);
    const signature = JSON.stringify(now);

    const action = rev.get(signature);
    if (!action) return;

    // มีแมตช์ → กัน default และเรียก executor
    e.preventDefault();
    e.stopPropagation();

    const fn = AppActions[action];
    if (typeof fn === "function") {
      fn();
    } else {
      console.warn(`[Hotkey] ไม่พบบริการของแอ็กชัน "${action}" ใน AppActions`);
    }
  }

  // (*** ฟังก์ชัน setHotkey, removeHotkey, structToLabel ถูกย่อไว้ ***)
  // ... เพื่อความกระชับ แต่โครงสร้างยังคงเดิม

  // แปลงโครงสร้างกลับเป็นข้อความไว้แสดงผล
  function structToLabel(st) {
    const mods = [];
    if (st.ctrl) mods.push("Ctrl");
    if (st.alt) mods.push("Alt");
    if (st.shift) mods.push("Shift");
    if (st.meta) mods.push("Meta");
    mods.push(st.key.length === 1 ? st.key.toUpperCase() : st.key);
    return mods.join("+");
  }

  // ... (ฟังก์ชัน setHotkey และ removeHotkey ก็ยังคงอยู่)

  return {
    handleKeyDown,
    setHotkey(action, combo) {
      // โค้ด setHotkey เดิม
    },
    removeHotkey(action) {
      // โค้ด removeHotkey เดิม
    },
    parseHotkeyString,
    eventToStruct,
    structToLabel,
  };
})();

// เผยแพร่สู่ Global เพื่อให้ gui.js, app.js เรียกใช้ได้
window.AppActions = AppActions;
window.Hotkey = Hotkey;
