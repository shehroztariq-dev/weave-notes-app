import { useState, useEffect, useRef } from "react";
import useStore from "../store/useStore";

export default function CommandPalette() {
  const {
    commandPaletteOpen,
    toggleCommandPalette,
    createNote,
    notes,
    selectNote,
    fetchNotes,
  } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      inputRef.current?.focus();
      setQuery("");
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!commandPaletteOpen) return null;

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.content.toLowerCase().includes(query.toLowerCase()),
  );

  const actions = [
    {
      label: "Create new note",
      action: () => {
        createNote();
        toggleCommandPalette();
      },
    },
    {
      label: "Refresh notes",
      action: () => {
        fetchNotes();
        toggleCommandPalette();
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30"
      onClick={toggleCommandPalette}>
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes or type a command..."
          className="w-full p-4 text-lg bg-transparent outline-none border-b border-gray-200 dark:border-gray-700"
        />
        <div className="max-h-64 overflow-y-auto p-2">
          {query && filteredNotes.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 uppercase px-2 py-1">
                Notes
              </div>
              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    selectNote(note.id);
                    toggleCommandPalette();
                  }}>
                  {note.title || "Untitled"}
                </button>
              ))}
            </div>
          )}
          <div className="text-xs text-gray-400 uppercase px-2 py-1 mt-2">
            Commands
          </div>
          {actions.map((action) => (
            <button
              key={action.label}
              className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={action.action}>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
