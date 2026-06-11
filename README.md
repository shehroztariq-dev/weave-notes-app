# Weave Notes App 🧵

A powerful, feature-rich desktop note-taking application built with Electron and React. Weave lets you organize your thoughts with branching note threads, markdown support, and intelligent backlinking—all offline and locally stored.

> **Perfect for:** Research, brainstorming, knowledge management, and organizing complex ideas into interconnected threads.

## ✨ Features

- **🧠 Branching Threads** - Organize notes into nested branches to explore different thought paths
- **📝 Markdown Support** - Full markdown editing with live preview mode
- **🔗 Wiki-Style Backlinks** - Link notes together using `[[Note Title]]` syntax
- **🌓 Dark/Light Mode** - Seamless theme switching with persistent preferences
- **⚡ Command Palette** - Keyboard-driven workflow (Ctrl+K / Cmd+K)
- **💾 Offline-First** - All notes stored locally, zero cloud dependency
- **⚙️ Type-Safe** - Built with TypeScript for reliable development
- **🎨 Beautiful UI** - Tailwind CSS with responsive design

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/weave-notes-app.git
cd weave-notes-app

# Install dependencies
npm install

# Start development server (Vite + Electron)
npm run dev
```

The app will open automatically with hot-reload enabled.

## 🏗️ Building for Production

```bash
# Build and package for distribution
npm run build

# Preview the build locally
npm run preview
```

The distributable app will be in `dist-electron/`.

## 📂 Project Structure

```
weave-notes-app/
├── electron/                 # Electron main process
│   ├── main.ts              # App entry point & window creation
│   ├── preload.ts           # IPC bridge for renderer → main
│   ├── ipcHandlers.ts       # IPC event handlers
│   └── database.ts          # In-memory data store
├── src/                     # React application
│   ├── App.tsx              # Root component & router
│   ├── main.tsx             # React entry point
│   ├── types.ts             # TypeScript interfaces
│   ├── store/
│   │   └── useStore.ts      # Zustand state management
│   ├── components/
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── NoteEditor.tsx   # Note editing interface
│   │   ├── NoteList.tsx     # List of notes
│   │   └── CommandPalette.tsx # Command palette
│   └── pages/
│       └── ThreadView.tsx   # Main view for displaying notes
├── public/                  # Static assets
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, React Router |
| **State** | Zustand (lightweight store) |
| **Desktop** | Electron 28, Vite |
| **Styling** | Tailwind CSS, PostCSS |
| **Icons** | Lucide React |
| **Build** | Vite, esbuild, electron-builder |

## 🎮 Usage

### Creating Notes
- Use **Ctrl/Cmd + K** to open the command palette
- Select "Create new note"
- Start typing in the editor with markdown support

### Creating Branches
1. Select a note in the editor
2. In the sidebar, enter a branch name
3. Click the "Branch" button to create a new thought thread

### Linking Notes
- Use `[[Note Title]]` syntax in your content
- Linked notes appear as backlinks below your current note
- Click backlinks to quickly navigate between related notes

### Dark Mode
- Toggle dark/light mode from the sidebar
- Your preference is saved locally

### Command Palette (Ctrl/Cmd + K)
- **Search notes** - Find by title or content
- **Create new note** - Quickly add a note
- **Refresh notes** - Reload all notes from storage

## 📋 API Reference

### IPC Events (Renderer ↔ Main)

The app communicates between renderer and main processes via IPC:

```typescript
// Notes
window.api.createNote(data)          // Create a new note
window.api.getNote(id)               // Fetch single note
window.api.updateNote(id, data)      // Update note
window.api.deleteNote(id)            // Delete note
window.api.getAllNotes()             // Fetch all notes
window.api.getBranchNotes(branchId)  // Get notes in a branch

// Branches
window.api.createBranch(data)        // Create a branch
window.api.getBranchTree()           // Get branch tree structure
```

## 🏗️ Architecture Notes

### State Management
- **Zustand Store** (`src/store/useStore.ts`): Centralized state for notes, branches, UI state
- Minimal boilerplate, excellent TypeScript support, no provider hell

### Data Flow
1. **Renderer** (React components) dispatches actions via Zustand
2. **Store** communicates with **Main Process** via IPC
3. **Main Process** handles persistence and returns data
4. **Store** updates state, components re-render

### Persistence
- Currently uses in-memory storage (Maps)
- Can be upgraded to better-sqlite3 for persistent storage
- All data is local—zero network calls

## 🚀 Future Enhancements

- [ ] SQLite database for persistent storage
- [ ] Export notes to Markdown/PDF
- [ ] Note tagging and filtering
- [ ] Collaborative editing (local network)
- [ ] Version history & undo/redo
- [ ] Advanced search with filters
- [ ] Custom themes

## 📝 Development

### Code Style
- TypeScript strict mode enabled
- ESLint for linting
- Prettier for code formatting

### Running Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

**Shehroz Tariq**
- GitHub: [@shehroztariq-dev](https://github.com/shehroztariq-dev)

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI components powered by [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- State management with [Zustand](https://github.com/pmndrs/zustand)
