export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_branch_id: string | null;
  branch_order: number;
  is_branch_root: number;
}

export interface Branch {
  id: string;
  name: string;
  root_note_id: string;
  parent_branch_id: string | null;
  created_at: string;
}

// Add to src/vite-env.d.ts
interface Window {
  api: {
    createNote: (data: any) => Promise<Note>;
    getNote: (id: string) => Promise<Note>;
    updateNote: (id: string, data: any) => Promise<Note>;
    deleteNote: (id: string) => Promise<void>;
    getAllNotes: () => Promise<Note[]>;
    getBranchNotes: (branchId: string) => Promise<Note[]>;
    createBranch: (data: any) => Promise<any>;
    getBranchTree: () => Promise<Branch[]>;
  };
}
