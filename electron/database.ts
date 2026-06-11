// In-memory database layer (simplified for now)
// In production, use better-sqlite3 or another SQL library

const notesDB: Map<string, any> = new Map();
const branchesDB: Map<string, any> = new Map();

export function initDB() {
  // Initialize empty databases
  console.log("Database initialized");
}

export { notesDB, branchesDB };

