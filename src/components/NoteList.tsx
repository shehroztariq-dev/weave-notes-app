import useStore from "../store/useStore";
import type { Note } from "../types";

export default function NoteList({ notes }: { notes: Note[] }) {
  const { selectNote, selectedNoteId } = useStore();
  return (
    <ul className="space-y-1">
      {notes.map((note) => (
        <li
          key={note.id}
          onClick={() => selectNote(note.id)}
          className={`p-2 rounded cursor-pointer ${
            selectedNoteId === note.id
              ? "bg-blue-100 dark:bg-blue-900"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}>
          <div className="text-sm font-medium truncate">
            {note.title || "Untitled"}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {note.content.substring(0, 50) || "Empty note"}
          </div>
        </li>
      ))}
    </ul>
  );
}
