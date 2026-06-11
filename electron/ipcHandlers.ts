import { ipcMain } from "electron";
import { v4 as uuidv4 } from "uuid";

const notesStore = new Map();
const branchesStore = new Map();

export function registerIpcHandlers() {
  ipcMain.handle("notes:create", (_, note) => {
    const id = uuidv4();
    const newNote = {
      id,
      title: note.title || "",
      content: note.content || "",
      parent_branch_id: note.parentBranchId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      branch_order: 0,
      is_branch_root: 0,
    };
    notesStore.set(id, newNote);
    return newNote;
  });

  ipcMain.handle("notes:get", (_, id) => {
    return notesStore.get(id);
  });

  ipcMain.handle("notes:update", (_, id, data) => {
    const note = notesStore.get(id);
    if (note) {
      if (data.title !== undefined) note.title = data.title;
      if (data.content !== undefined) note.content = data.content;
      note.updated_at = new Date().toISOString();
      notesStore.set(id, note);
    }
    return note;
  });

  ipcMain.handle("notes:delete", (_, id) => {
    notesStore.delete(id);
  });

  ipcMain.handle("notes:getAll", () => {
    return Array.from(notesStore.values()).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  });

  ipcMain.handle("notes:getByBranch", (_, branchId) => {
    return Array.from(notesStore.values())
      .filter((n) => n.parent_branch_id === branchId)
      .sort((a, b) => a.branch_order - b.branch_order);
  });

  ipcMain.handle("branches:create", (_, branch) => {
    const id = uuidv4();
    const newBranch = {
      id,
      name: branch.name,
      root_note_id: branch.rootNoteId,
      parent_branch_id: branch.parentBranchId || null,
      created_at: new Date().toISOString(),
    };
    branchesStore.set(id, newBranch);
    const note = notesStore.get(branch.rootNoteId);
    if (note) {
      note.is_branch_root = 1;
      notesStore.set(branch.rootNoteId, note);
    }
    return newBranch;
  });

  ipcMain.handle("branches:getTree", () => {
    return Array.from(branchesStore.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });

  ipcMain.handle("notes:clearLinks", () => {
    // Placeholder for link management
  });

  ipcMain.handle("notes:createLink", () => {
    // Placeholder for link management
  });
}
