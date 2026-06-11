import { ipcMain } from "electron";
import db from "./database";
import { v4 as uuidv4 } from "uuid";

export function registerIpcHandlers() {
  // Notes
  ipcMain.handle("notes:create", (_, note) => {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO notes (id, title, content, parent_branch_id) VALUES (?, ?, ?, ?)",
    );
    stmt.run(
      id,
      note.title || "",
      note.content || "",
      note.parentBranchId || null,
    );
    return { id, ...note };
  });

  ipcMain.handle("notes:get", (_, id) => {
    return db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
  });

  ipcMain.handle("notes:update", (_, id, data) => {
    const fields = [];
    const values = [];
    if (data.title !== undefined) {
      fields.push("title = ?");
      values.push(data.title);
    }
    if (data.content !== undefined) {
      fields.push("content = ?");
      values.push(data.content);
    }
    if (fields.length > 0) {
      fields.push("updated_at = datetime('now')");
      db.prepare(`UPDATE notes SET ${fields.join(", ")} WHERE id = ?`).run(
        ...values,
        id,
      );
    }
    return db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
  });

  ipcMain.handle("notes:delete", (_, id) => {
    db.prepare("DELETE FROM notes WHERE id = ?").run(id);
  });

  ipcMain.handle("notes:getAll", () => {
    return db.prepare("SELECT * FROM notes ORDER BY updated_at DESC").all();
  });

  ipcMain.handle("notes:getByBranch", (_, branchId) => {
    return db
      .prepare(
        "SELECT * FROM notes WHERE parent_branch_id = ? ORDER BY branch_order, created_at",
      )
      .all(branchId);
  });

  // Branches
  ipcMain.handle("branches:create", (_, branch) => {
    const id = uuidv4();
    db.prepare(
      "INSERT INTO branches (id, name, root_note_id, parent_branch_id) VALUES (?, ?, ?, ?)",
    ).run(id, branch.name, branch.rootNoteId, branch.parentBranchId || null);
    // Mark the root note as branch root
    db.prepare("UPDATE notes SET is_branch_root = 1 WHERE id = ?").run(
      branch.rootNoteId,
    );
    return { id, ...branch };
  });

  ipcMain.handle("branches:getTree", () => {
    // Return all branches as flat list; frontend builds tree
    return db.prepare("SELECT * FROM branches ORDER BY created_at").all();
  });
}
