import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  // Note CRUD
  createNote: (note: {
    title?: string;
    content?: string;
    parentBranchId?: string;
  }) => ipcRenderer.invoke("notes:create", note),
  getNote: (id: string) => ipcRenderer.invoke("notes:get", id),
  updateNote: (id: string, data: { title?: string; content?: string }) =>
    ipcRenderer.invoke("notes:update", id, data),
  deleteNote: (id: string) => ipcRenderer.invoke("notes:delete", id),
  getAllNotes: () => ipcRenderer.invoke("notes:getAll"),
  getBranchNotes: (branchId: string) =>
    ipcRenderer.invoke("notes:getByBranch", branchId),

  // Branch CRUD
  createBranch: (branch: {
    name: string;
    rootNoteId: string;
    parentBranchId?: string;
  }) => ipcRenderer.invoke("branches:create", branch),
  getBranchTree: () => ipcRenderer.invoke("branches:getTree"),
});
