"use strict";
const electron = require("electron");
const path = require("node:path");
const crypto = require("node:crypto");
function initDB() {
  console.log("Database initialized");
}
const id = crypto.randomUUID();
const notesStore = /* @__PURE__ */ new Map();
const branchesStore = /* @__PURE__ */ new Map();
function registerIpcHandlers() {
  electron.ipcMain.handle("notes:create", (_, noteData) => {
    try {
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
  electron.ipcMain.handle("notes:get", (_, id2) => {
    try {
      const note = notesStore.get(id2);
      if (!note) {
        throw new Error(`Note with id ${id2} not found`);
      }
      return note;
    } catch (error) {
      console.error("Error getting note:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("notes:update", (_, id2, data) => {
    try {
      const note = notesStore.get(id2);
      if (!note) {
        throw new Error(`Note with id ${id2} not found`);
      }
      if (data.title !== void 0) note.title = data.title;
      if (data.content !== void 0) note.content = data.content;
      note.updated_at = (/* @__PURE__ */ new Date()).toISOString();
      notesStore.set(id2, note);
      return note;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("notes:delete", (_, id2) => {
    try {
      const exists = notesStore.has(id2);
      if (!exists) {
        throw new Error(`Note with id ${id2} not found`);
      }
      notesStore.delete(id2);
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
