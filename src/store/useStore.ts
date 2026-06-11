import { create } from "zustand";

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface NotesState {
  notes: Note[];
  addNote: (content: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  addNote: (content) =>
    set((state) => ({
      notes: [
        {
          id: `${Date.now()}`,
          content,
          createdAt: new Date().toLocaleString(),
        },
        ...state.notes,
      ],
    })),
}));
