# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Environment

### Node.js Version Requirement
This project requires Node.js version 20.19+ or 22.12+ due to Vite 7.x requirements. If using nvm:
```bash
nvm use 22
# or set as default
nvm alias default 22
```

### Development Commands
```bash
# Start development server (runs on http://localhost:5173/)
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Lint code
npm run lint

# Preview production build locally
npm run preview
```

## Project Architecture

### Technology Stack
- **Framework**: React 19.1.1 with TypeScript 5.9.3
- **Build Tool**: Vite 7.1.7 with @vitejs/plugin-react (uses Babel for Fast Refresh)
- **Linting**: ESLint 9.36.0 with TypeScript ESLint and React-specific plugins

### TypeScript Configuration
The project uses a project reference setup with three TypeScript configs:
- `tsconfig.json` - Root configuration referencing app and node configs
- `tsconfig.app.json` - Application code configuration (src/)
  - Target: ES2022
  - Module: ESNext with bundler resolution
  - Strict mode enabled with additional linting flags
  - JSX: react-jsx (automatic runtime)
- `tsconfig.node.json` - Build tool configuration (Vite config files)

### ESLint Configuration
Located in `eslint.config.js` using the new flat config format:
- Extends: JS recommended, TypeScript recommended, React Hooks recommended-latest, React Refresh Vite config
- Ignores: `dist/` folder
- Targets: `**/*.{ts,tsx}` files
- Globals: Browser environment

### Entry Points
- `index.html` - Root HTML file (standard Vite setup)
- `src/main.tsx` - Application entry point, renders App component with React StrictMode
- `src/App.tsx` - Main application component

### Current Project State
This is a fresh Vite + React + TypeScript project initialized from the official template. The codebase currently contains only the default Vite template boilerplate with a simple counter component in `App.tsx`.
