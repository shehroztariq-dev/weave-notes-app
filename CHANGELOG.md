# Changelog

All notable changes to the Weave Notes App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-11

### Added
- **Branching Threads** - Organize notes into nested branches for exploring different thought paths
- **Markdown Support** - Full markdown editing with live preview mode
- **Wiki-Style Backlinks** - Link notes together using `[[Note Title]]` syntax for rapid navigation
- **Dark/Light Mode** - Seamless theme switching with persistent user preferences
- **Command Palette** - Keyboard-driven workflow with Ctrl+K / Cmd+K shortcut
- **Offline-First Architecture** - All notes stored locally with zero cloud dependency
- **Type-Safe Development** - Full TypeScript support for reliable development
- **Beautiful UI** - Tailwind CSS styling with responsive design
- **Production Build** - Electron builder for macOS, Windows, and Linux distributions
- **ESLint & Prettier** - Code quality and formatting tools
- **Comprehensive Documentation** - Detailed README and API documentation

### Technical Details
- React 18 with hooks for component management
- Zustand for lightweight state management
- Vite for fast development and optimized builds
- Electron 28 for cross-platform desktop application
- TypeScript strict mode for type safety
- Tailwind CSS for utility-first styling

### Developer Experience
- Hot module replacement (HMR) in development
- Type-checked builds
- Automated code formatting
- Linting with ESLint
- IPC-based main/renderer communication

## Future Versions

### Planned for v1.1.0
- SQLite database for persistent storage
- Export notes to Markdown/PDF
- Note tagging and filtering system
- Advanced search with full-text search capabilities

### Planned for v2.0.0
- Collaborative editing over local network
- Version history and undo/redo system
- Custom themes and appearance settings
- Note templates for common use cases

---

## Release Notes

### v1.0.0 Initial Release
The inaugural release of Weave Notes App marks a stable, feature-complete desktop note-taking application with all core functionality for managing interconnected thoughts through branching threads and backlinking.

**Key Milestones:**
✅ Core note management (create, read, update, delete)
✅ Branch system for organizing thought threads
✅ Markdown support with preview
✅ Backlink system with wiki-style linking
✅ Keyboard shortcuts and command palette
✅ Dark/light theme support
✅ Cross-platform support (Windows, macOS, Linux via Electron)
✅ Production-ready build system
✅ Comprehensive documentation
✅ Code quality tools (ESLint, Prettier)
