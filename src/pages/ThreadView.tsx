import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import NoteEditor from "../components/NoteEditor";
import NoteList from "../components/NoteList";

export default function ThreadView() {
  const { branchId } = useParams<{ branchId: string }>();
  const {
    notes,
    fetchNotes,
    getBranchNotes,
    selectedNoteId,
    selectNote,
    createNote,
  } = useStore();
  const [displayNotes, setDisplayNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (branchId) {
      window.api.getBranchNotes(branchId).then(setDisplayNotes);
    } else {
      fetchNotes().then(() => setDisplayNotes(notes));
    }
  }, [branchId, notes.length]);

  const handleNewNote = async () => {
    const note = await createNote(branchId);
    // Refresh
    if (branchId) {
      const updated = await window.api.getBranchNotes(branchId);
      setDisplayNotes(updated);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-72 border-r border-gray-300 dark:border-gray-700 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">{branchId ? "Branch" : "All Notes"}</h2>
          <button
            onClick={handleNewNote}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
            + Note
          </button>
        </div>
        <NoteList notes={displayNotes} />
      </div>
      <div className="flex-1 p-4">
        {selectedNoteId ? (
          <NoteEditor noteId={selectedNoteId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a note or create one
          </div>
        )}
      </div>
    </div>
  );
}
