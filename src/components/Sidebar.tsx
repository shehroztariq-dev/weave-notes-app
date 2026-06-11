import { Link, useParams } from "react-router-dom";
import useStore from "../store/useStore";
import { PlusCircle, Moon, Sun, Sidebar as SidebarIcon } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const {
    branches,
    toggleDarkMode,
    darkMode,
    toggleSidebar,
    sidebarOpen,
    createBranch,
    selectedNoteId,
    notes,
  } = useStore();
  const { branchId } = useParams<{ branchId: string }>();
  const [newBranchName, setNewBranchName] = useState("");

  const handleCreateBranch = async () => {
    if (!newBranchName.trim() || !selectedNoteId) return;
    // Create branch from current note
    const rootNote = notes.find((n) => n.id === selectedNoteId);
    if (rootNote) {
      await createBranch(newBranchName, selectedNoteId);
      setNewBranchName("");
    }
  };

  // Build tree structure
  const tree = buildBranchTree(branches);

  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 z-10 p-1 bg-gray-200 dark:bg-gray-700 rounded">
        <SidebarIcon size={20} />
      </button>
    );
  }

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">ThoughtWeave</h1>
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
          <SidebarIcon size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1">
        <BranchTreeItem node={tree} currentBranchId={branchId} />
        <Link
          to="/"
          className={`block py-1 px-2 rounded ${!branchId ? "bg-blue-100 dark:bg-blue-900" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
          🌱 All Notes
        </Link>
      </nav>

      <div className="space-y-2">
        <input
          value={newBranchName}
          onChange={(e) => setNewBranchName(e.target.value)}
          placeholder="New branch from selected note..."
          className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
          onKeyDown={(e) => e.key === "Enter" && handleCreateBranch()}
        />
        <button
          onClick={handleCreateBranch}
          className="w-full flex items-center justify-center gap-1 text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
          <PlusCircle size={16} /> Branch
        </button>
      </div>

      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 text-sm">
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        {darkMode ? "Light" : "Dark"} Mode
      </button>
    </aside>
  );
}

// Recursive tree component
function BranchTreeItem({
  node,
  currentBranchId,
}: {
  node: any;
  currentBranchId?: string;
}) {
  if (!node) return null;
  return (
    <div className="ml-2">
      <Link
        to={`/branch/${node.id}`}
        className={`block py-1 px-2 rounded ${
          currentBranchId === node.id
            ? "bg-blue-100 dark:bg-blue-900"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}>
        🔀 {node.name}
      </Link>
      {node.children?.map((child: any) => (
        <BranchTreeItem
          key={child.id}
          node={child}
          currentBranchId={currentBranchId}
        />
      ))}
    </div>
  );
}

// Helper to build tree from flat branch list
function buildBranchTree(branches: Branch[]) {
  const map: Record<string, any> = {};
  const roots: any[] = [];
  branches.forEach((b) => {
    map[b.id] = { ...b, children: [] };
  });
  branches.forEach((b) => {
    if (b.parent_branch_id) {
      map[b.parent_branch_id]?.children.push(map[b.id]);
    } else {
      roots.push(map[b.id]);
    }
  });
  return roots.length > 0
    ? { id: "root", name: "Threads", children: roots }
    : null;
}
