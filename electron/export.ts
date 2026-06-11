import { dialog, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import db from "./database";

export async function exportNoteAsMarkdown(win: BrowserWindow, noteId: string) {
  const note = db
    .prepare("SELECT title, content FROM notes WHERE id = ?")
    .get(noteId) as any;
  if (!note) return;

  const { filePath } = await dialog.showSaveDialog(win, {
    defaultPath: `${note.title || "untitled"}.md`,
    filters: [{ name: "Markdown", extensions: ["md"] }],
  });
  if (filePath) {
    fs.writeFileSync(filePath, note.content);
  }
}

export async function exportNoteAsPDF(win: BrowserWindow, noteId: string) {
  // Simple: convert markdown to HTML then use Electron's printToPDF
  const note = db
    .prepare("SELECT title, content FROM notes WHERE id = ?")
    .get(noteId) as any;
  if (!note) return;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${note.title}</title></head><body>${markdownToHTML(note.content)}</body></html>`;

  const { filePath } = await dialog.showSaveDialog(win, {
    defaultPath: `${note.title || "untitled"}.pdf`,
    filters: [{ name: "PDF", extensions: ["pdf"] }],
  });
  if (filePath) {
    const pdfWin = new BrowserWindow({ show: false });
    await pdfWin.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
    );
    const pdfData = await pdfWin.webContents.printToPDF({
      printBackground: true,
    });
    fs.writeFileSync(filePath, pdfData);
    pdfWin.close();
  }
}

function markdownToHTML(md: string): string {
  // Use a simple conversion or a library; for MVP, wrap in <pre>
  return `<pre>${md.replace(/</g, "&lt;")}</pre>`;
}
