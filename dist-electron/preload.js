"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  // Note CRUD
  createNote: (note) => electron.ipcRenderer.invoke("notes:create", note),
  getNote: (id) => electron.ipcRenderer.invoke("notes:get", id),
  updateNote: (id, data) => electron.ipcRenderer.invoke("notes:update", id, data),
  deleteNote: (id) => electron.ipcRenderer.invoke("notes:delete", id),
  getAllNotes: () => electron.ipcRenderer.invoke("notes:getAll"),
  getBranchNotes: (branchId) => electron.ipcRenderer.invoke("notes:getByBranch", branchId),
  // Branch CRUD
  createBranch: (branch) => electron.ipcRenderer.invoke("branches:create", branch),
  getBranchTree: () => electron.ipcRenderer.invoke("branches:getTree")
});
