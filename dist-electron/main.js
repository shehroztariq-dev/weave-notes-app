"use strict";
const electron = require("electron");
const path = require("node:path");
function initDB() {
  console.log("Database initialized");
}
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const native = {
  randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
const notesStore = /* @__PURE__ */ new Map();
const branchesStore = /* @__PURE__ */ new Map();
function registerIpcHandlers() {
  electron.ipcMain.handle("notes:create", (_, noteData) => {
    try {
      const id = v4();
      const newNote = {
        id,
        title: noteData.title || "",
        content: noteData.content || "",
        parent_branch_id: noteData.parentBranchId || null,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString(),
        branch_order: 0,
        is_branch_root: 0
      };
      notesStore.set(id, newNote);
      return newNote;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("notes:get", (_, id) => {
    try {
      const note = notesStore.get(id);
      if (!note) {
        throw new Error(`Note with id ${id} not found`);
      }
      return note;
    } catch (error) {
      console.error("Error getting note:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("notes:update", (_, id, data) => {
    try {
      const note = notesStore.get(id);
      if (!note) {
        throw new Error(`Note with id ${id} not found`);
      }
      if (data.title !== void 0) note.title = data.title;
      if (data.content !== void 0) note.content = data.content;
      note.updated_at = (/* @__PURE__ */ new Date()).toISOString();
      notesStore.set(id, note);
      return note;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("notes:delete", (_, id) => {
    try {
      const exists = notesStore.has(id);
      if (!exists) {
        throw new Error(`Note with id ${id} not found`);
      }
      notesStore.delete(id);
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("notes:getAll", () => {
    try {
      return Array.from(notesStore.values()).sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } catch (error) {
      console.error("Error getting all notes:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("notes:getByBranch", (_, branchId) => {
    try {
      return Array.from(notesStore.values()).filter((n) => n.parent_branch_id === branchId).sort((a, b) => a.branch_order - b.branch_order);
    } catch (error) {
      console.error("Error getting branch notes:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("branches:create", (_, branchData) => {
    try {
      const id = v4();
      const newBranch = {
        id,
        name: branchData.name,
        root_note_id: branchData.rootNoteId,
        parent_branch_id: branchData.parentBranchId || null,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      branchesStore.set(id, newBranch);
      const note = notesStore.get(branchData.rootNoteId);
      if (note) {
        note.is_branch_root = 1;
        notesStore.set(branchData.rootNoteId, note);
      }
      return newBranch;
    } catch (error) {
      console.error("Error creating branch:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("branches:getTree", () => {
    try {
      return Array.from(branchesStore.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error("Error getting branch tree:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("notes:clearLinks", () => {
  });
  electron.ipcMain.handle("notes:createLink", () => {
  });
}
let mainWindow = null;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}
electron.app.whenReady().then(() => {
  initDB();
  registerIpcHandlers();
  createWindow();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
