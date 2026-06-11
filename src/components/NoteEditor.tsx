import { useState, useEffect, useCallback } from "react";
import useStore from "../store/useStore";
import ReactMarkdown from "react-markdown";

export default function NoteEditor({ noteId }: { noteId: string }) {
  const { notes, updateNote, deleteNote } = useStore();
  const note = notes.find((n) => n.id === noteId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [backlinks, setBacklinks] = useState<any[]>([]);

  useEffect(() => {
    if (note) {
      window.api.getBacklinks(note.id).then(setBacklinks);
    }
  }, [note]);

  // In JSX, after title & editor:
  {
    backlinks.length > 0 && (
      <div className="mt-4 border-t pt-4">
        <h3 className="text-sm font-semibold mb-2">Backlinks</h3>
        {backlinks.map((link: any) => (
          <div
            key={link.id}
            className="text-sm text-blue-500 cursor-pointer"
            onClick={() => selectNote(link.source_note_id)}>
            {notes.find((n) => n.id === link.source_note_id)?.title ||
              "Untitled"}
          </div>
        ))}
      </div>
    );
  }

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = async () => {
    if (note) {
      await updateNote(note.id, { title, content });
    }
  };
  const processLinks = useCallback(async () => {
    if (!note) return;
    // Clear existing links for this source
    await window.api.clearLinksForNote(note.id);
    const regex = /\[\[([^\]]+)\]\]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const linkText = match[1];
      // Find target note by title (case-insensitive)
      const target = notes.find(
        (n) => n.title.toLowerCase() === linkText.toLowerCase(),
      );
      if (target && target.id !== note.id) {
        await window.api.createLink({
          sourceNoteId: note.id,
          targetNoteId: target.id,
          linkText,
        });
      }
    }
  }, [content, note, notes]);

  const handleDelete = async () => {
    if (note && confirm("Delete this note?")) {
      await deleteNote(note.id);
    }
  };

  // Trigger on content change (debounce might be better)
  useEffect(() => {
    if (note) {
      const timer = setTimeout(() => {
        processLinks();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [content]);

  if (!note) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          className="text-2xl font-bold bg-transparent outline-none flex-1"
          placeholder="Note title"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-2 py-1 rounded bg-red-500 text-white">
            Delete
          </button>
        </div>
      </div>

      {preview ? (
        <div className="flex-1 overflow-y-auto prose dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          className="flex-1 w-full resize-none bg-transparent outline-none font-mono text-sm p-2 border border-gray-300 dark:border-gray-600 rounded"
          placeholder="Start writing... (Markdown supported)"
        />
      )}
    </div>
  );
}
