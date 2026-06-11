import { ipcMain } from "electron";
import crypto from "node:crypto";
const id = crypto.randomUUID();

interface CreateNoteData {
  title?: string;
  content?: string;
  parentBranchId?: string | null;
}

interface UpdateNoteData {
  title?: string;
  content?: string;
}

interface CreateBranchData {
  name: string;
  rootNoteId: string;
  parentBranchId?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  parent_branch_id: string | null;
  created_at: string;
  updated_at: string;
  branch_order: number;
  is_branch_root: number;
}

interface Branch {
  id: string;
  name: string;
  root_note_id: string;
  parent_branch_id: string | null;
  created_at: string;
}

const notesStore = new Map<string, Note>();
const branchesStore = new Map<string, Branch>();

/**
 * Register all IPC event handlers for note and branch operations
 */
export function registerIpcHandlers() {
  // Notes handlers
  ipcMain.handle("notes:create", (_, noteData: CreateNoteData) => {
    try {
      const newNote: Note = {
        id,
        title: noteData.title || "",
        content: noteData.content || "",
        parent_branch_id: noteData.parentBranchId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        branch_order: 0,
        is_branch_root: 0,
      };
      notesStore.set(id, newNote);
      return newNote;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  });

  ipcMain.handle("notes:get", (_, id: string) => {
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

  ipcMain.handle("notes:update", (_, id: string, data: UpdateNoteData) => {
    try {
      const note = notesStore.get(id);
      if (!note) {
        throw new Error(`Note with id ${id} not found`);
      }
      if (data.title !== undefined) note.title = data.title;
      if (data.content !== undefined) note.content = data.content;
      note.updated_at = new Date().toISOString();
      notesStore.set(id, note);
      return note;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  });

  ipcMain.handle("notes:delete", (_, id: string) => {
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

  ipcMain.handle("notes:getAll", () => {
    try {
      return Array.from(notesStore.values()).sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } catch (error) {
      console.error("Error getting all notes:", error);
      throw error;
    }
  });

  ipcMain.handle("notes:getByBranch", (_, branchId: string) => {
    try {
      return Array.from(notesStore.values())
        .filter((n) => n.parent_branch_id === branchId)
        .sort((a, b) => a.branch_order - b.branch_order);
    } catch (error) {
      console.error("Error getting branch notes:", error);
      throw error;
    }
  });

  // Branches handlers
  ipcMain.handle("branches:create", (_, branchData: CreateBranchData) => {
    try {
      const newBranch: Branch = {
        id,
        name: branchData.name,
        root_note_id: branchData.rootNoteId,
        parent_branch_id: branchData.parentBranchId || null,
        created_at: new Date().toISOString(),
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

  ipcMain.handle("branches:getTree", () => {
    try {
      return Array.from(branchesStore.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error("Error getting branch tree:", error);
      throw error;
    }
  });

  ipcMain.handle("notes:clearLinks", () => {
    try {
      // Placeholder for link management
    } catch (error) {
      console.error("Error clearing links:", error);
      throw error;
    }
  });

  ipcMain.handle("notes:createLink", () => {
    try {
      // Placeholder for link management
    } catch (error) {
      console.error("Error creating link:", error);
      throw error;
    }
  });
}
