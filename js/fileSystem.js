// js/fileSystem.js
// --------------------------------------------------------
// 💾 File System Driver (จัดการระดับ Browser)
// --------------------------------------------------------

(function (global) {
  "use strict";

  const FileSystem = {
    // ----------------------------------------------------
    // ⭐ Download Logic
    // ----------------------------------------------------
    download(filename, content, mimeType) {
      // 1. สร้าง Blob
      const blob =
        content instanceof Blob
          ? content
          : new Blob([content], { type: mimeType });

      // 2. สร้าง URL
      const url = URL.createObjectURL(blob);

      // 3. สร้าง Link ชั่วคราวแล้วกด
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // 4. Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    },

    // ----------------------------------------------------
    // ⭐ Upload Logic (File Picker)
    // ----------------------------------------------------
    openFilePicker(accept, callback) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.style.display = "none";

      input.onchange = (e) => {
        const file = e.target.files[0];
        callback(file);
      };

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    },

    // ----------------------------------------------------
    // ⭐ File Reader Helper
    // ----------------------------------------------------
    readAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    },
  };

  global.FileSystem = FileSystem;
})(window);
