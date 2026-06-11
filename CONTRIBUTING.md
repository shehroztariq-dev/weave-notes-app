# Contributing to Weave Notes App

First off, thanks for your interest in contributing! 🎉

This document provides guidelines and instructions for contributing to the Weave Notes App project.

## Code of Conduct

Please be respectful and constructive in all interactions. We're committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

### Prerequisites
- Node.js 16+
- npm

### Development Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork locally
git clone https://github.com/YOUR_USERNAME/weave-notes-app.git
cd weave-notes-app

# 3. Add upstream remote
git remote add upstream https://github.com/shehroztariq-dev/weave-notes-app.git

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev
```

## Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `chore/` - Build, CI/CD, or dependency updates

### Making Changes

1. **Write clean, readable code** following the project's style
2. **Add comments** for complex logic using JSDoc format
3. **Maintain TypeScript types** - avoid `any` types
4. **Test your changes** locally before committing

### Code Style

The project uses **ESLint** and **Prettier** for consistent code formatting.

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check
npm run type-check
```

### Committing Changes

Write clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "feat: add export to PDF functionality"
git commit -m "fix: resolve backlink regex not matching titles with spaces"
git commit -m "docs: update README with API examples"

# Follow conventional commits
# Types: feat, fix, docs, style, refactor, perf, test, chore
```

## Pull Request Process

### Before Submitting

1. **Ensure your code passes all checks:**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

2. **Pull latest changes from upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

3. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting a PR

1. Go to GitHub and create a Pull Request from your fork to the main repository
2. Fill out the PR template with:
   - Clear description of changes
   - Motivation and context
   - Screenshots for UI changes (if applicable)
   - Checklist of completed items

3. Ensure CI/CD checks pass
4. Request review from maintainers

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All linting checks pass (`npm run lint`)
- [ ] TypeScript type checking passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes are documented (comments, JSDoc, README if needed)
- [ ] Commit messages are clear and descriptive

## Project Structure

```
weave-notes-app/
├── electron/           # Main process code
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── store/         # Zustand store
│   └── types.ts       # TypeScript types
├── .github/workflows/ # CI/CD configurations
├── README.md          # Project documentation
└── package.json       # Dependencies and scripts
```

## Making Changes

### Adding Features

1. **Create a new file** in the appropriate directory
2. **Export from index files** if needed
3. **Add JSDoc comments** to functions
4. **Update types** in `src/types.ts` if needed
5. **Update README** if it's a user-facing feature

### Fixing Bugs

1. **Create a test case** that demonstrates the bug
2. **Fix the bug** with minimal changes
3. **Verify the fix** doesn't break other tests
4. **Document the fix** in commit message

### Improving Documentation

- Fix typos, clarify explanations in README
- Add examples for API usage
- Document architecture decisions
- Add troubleshooting sections

## Questions or Need Help?

- Open a [GitHub Issue](https://github.com/shehroztariq-dev/weave-notes-app/issues) for questions
- Check existing issues before creating new ones
- Use descriptive titles and clear descriptions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Weave Notes App! 🙏
