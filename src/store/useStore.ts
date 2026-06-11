import { create } from "zustand";
import type { Note, Branch } from "../types"; // We'll define types in shared

interface AppState {
  // Data
  notes: Note[];
  branches: Branch[];
  selectedNoteId: string | null;
  selectedBranchId: string | null;

  // UI
  darkMode: boolean;
  commandPaletteOpen: boolean;
  sidebarOpen: boolean;

  // Actions
  fetchNotes: () => Promise<void>;
  fetchBranches: () => Promise<void>;
  selectNote: (id: string) => void;
  createNote: (parentBranchId?: string) => Promise<Note>;
  updateNote: (
    id: string,
    data: { title?: string; content?: string },
  ) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  createBranch: (
    name: string,
    rootNoteId: string,
    parentBranchId?: string,
  ) => Promise<void>;
  toggleDarkMode: () => void;
  toggleCommandPalette: () => void;
  toggleSidebar: () => void;
}

const useStore = create<AppState>((set, get) => ({
  notes: [],
  branches: [],
  selectedNoteId: null,
  selectedBranchId: null,
  darkMode: true,
  commandPaletteOpen: false,
  sidebarOpen: true,

  fetchNotes: async () => {
    const notes = await window.api.getAllNotes();
    set({ notes });
  },
  fetchBranches: async () => {
    const branches = await window.api.getBranchTree();
    set({ branches });
  },
  selectNote: (id) => set({ selectedNoteId: id }),
  createNote: async (parentBranchId) => {
    const note = await window.api.createNote({ parentBranchId });
    await get().fetchNotes();
    set({ selectedNoteId: note.id });
    return note;
  },
  updateNote: async (id, data) => {
    await window.api.updateNote(id, data);
    await get().fetchNotes();
  },
  deleteNote: async (id) => {
    await window.api.deleteNote(id);
    set({ selectedNoteId: null });
    await get().fetchNotes();
  },
  createBranch: async (name, rootNoteId, parentBranchId) => {
    await window.api.createBranch({ name, rootNoteId, parentBranchId });
    await get().fetchBranches();
  },
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export default useStore;
