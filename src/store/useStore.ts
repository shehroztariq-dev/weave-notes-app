import { create } from "zustand";
import type { Note, Branch } from "../types";

interface AppState {
  notes: Note[];
  branches: Branch[];
  selectedNoteId: string | null;
  selectedBranchId: string | null;

  darkMode: boolean;
  commandPaletteOpen: boolean;
  sidebarOpen: boolean;

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

/**
 * Main application store using Zustand
 * Manages all global state: notes, branches, UI preferences
 */
const useStore = create<AppState>((set, get) => ({
  notes: [],
  branches: [],
  selectedNoteId: null,
  selectedBranchId: null,
  darkMode: true,
  commandPaletteOpen: false,
  sidebarOpen: true,

  /**
   * Fetches all notes from the main process via IPC
   */
  fetchNotes: async () => {
    try {
      const notes = await window.api.getAllNotes();
      set({ notes });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      throw error;
    }
  },

  /**
   * Fetches all branches from the main process via IPC
   */
  fetchBranches: async () => {
    try {
      const branches = await window.api.getBranchTree();
      set({ branches });
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      throw error;
    }
  },

  /**
   * Sets the currently selected note ID
   */
  selectNote: (id) => set({ selectedNoteId: id }),

  /**
   * Creates a new note and fetches updated notes list
   */
  createNote: async (parentBranchId) => {
    try {
      const note = await window.api.createNote({ parentBranchId });
      await get().fetchNotes();
      set({ selectedNoteId: note.id });
      return note;
    } catch (error) {
      console.error("Failed to create note:", error);
      throw error;
    }
  },

  /**
   * Updates an existing note with new data
   */
  updateNote: async (id, data) => {
    try {
      await window.api.updateNote(id, data);
      await get().fetchNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
      throw error;
    }
  },

  /**
   * Deletes a note and clears selection
   */
  deleteNote: async (id) => {
    try {
      await window.api.deleteNote(id);
      set({ selectedNoteId: null });
      await get().fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  },

  /**
   * Creates a new branch with the given name and root note
   */
  createBranch: async (name, rootNoteId, parentBranchId) => {
    try {
      await window.api.createBranch({ name, rootNoteId, parentBranchId });
      await get().fetchBranches();
    } catch (error) {
      console.error("Failed to create branch:", error);
      throw error;
    }
  },

  /**
   * Toggles between dark and light mode
   */
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  /**
   * Opens/closes the command palette
   */
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  /**
   * Toggles sidebar visibility
   */
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export default useStore;
