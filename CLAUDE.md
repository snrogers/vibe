# Vibe Project Guidelines

## Commands
- `bun run dev`: Start development server with watch mode
- `bun run typecheck`: Run TypeScript type checking
- `bun run eslint.config.mjs`: Lint codebase with ESLint

## Code Style
- **Imports**: Group by external/internal, use type imports where applicable
- **Naming**: PascalCase for components/types, camelCase for functions/variables
- **Types**: Define in dedicated files, prefer explicit typing over inference
- **Components**: Functional components with hooks, props explicitly typed
- **Error Handling**: Use try/catch with specific error messages, custom error classes
- **Architecture**: Feature-based directories, modular exports with index.ts files
- **State Management**: Redux-like pattern with AppState, Reducers, and Sagas

## Development Notes
- Project uses TypeScript with strict mode enabled
- Ink library for terminal UI components
- State management through redux-style reducers and sagas
- External services (LLM, MCP) abstracted through service interfaces