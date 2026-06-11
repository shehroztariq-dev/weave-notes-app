import { useState, useEffect } from "react";
import useStore from "../store/useStore";
import ReactMarkdown from "react-markdown";

export default function NoteEditor({ noteId }: { noteId: string }) {
  const { notes, updateNote, deleteNote } = useStore();
  const note = notes.find((n) => n.id === noteId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);

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

  const handleDelete = async () => {
    if (note && confirm("Delete this note?")) {
      await deleteNote(note.id);
    }
  };

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
