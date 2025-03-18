# InkCLI Module

The `InkCLI` module is a key part of the Vibe application, responsible for rendering the command-line interface (CLI) using the [Ink library](https://github.com/vadimdemedes/ink). It provides a collection of React components and utilities to display chat messages, handle user input, and manage the layout of the CLI. This README is designed to help an AI Coding Agent understand and work with this module in the Vibe codebase.

## Purpose

The `InkCLI` module creates an interactive CLI for the Vibe application, enabling users to:
- Communicate with an AI assistant by typing prompts.
- View chat messages (e.g., user inputs, AI responses, system messages).
- Access debug information when needed.

It uses Ink, a React-based library, to render the interface in the terminal.

## Integration with the Application

The `InkCLI` module connects to the broader Vibe application in these ways:

- **Redux State Management**: It accesses the application state (e.g., chat messages, debug mode) using the `useAppSelector` hook from `lib/App/AppProvider.tsx`. This hook pulls data from the Redux store defined in `lib/App/AppStore.ts`.
- **Event Dispatching**: Components like `InputField` dispatch Redux actions (e.g., `PROMPT_SUBMITTED`) to trigger application logic, such as sending a prompt to the AI. These actions are handled by sagas in `lib/App/Saga/`.
- **Component Composition**: The main `View` component combines other components (e.g., `Message`, `InputField`, `FKeyBar`) to build the full CLI interface.

## Components

Here's a detailed breakdown of each component in the `lib/InkCLI` directory:

### View.tsx

- **Role**: The main entry point of the `InkCLI` module, exported via `index.ts`.
- **What It Does**: Renders the entire CLI layout, including:
  - A `Static` component (from Ink) to show the chat history with `Message` components.
  - A `MessagePartial` component when there's a streaming AI response (e.g., `completionDelta` from the Redux state).
  - The `InputField` for user input.
  - The `FKeyBar` for function key shortcuts.
- **Key Imports**: Uses `useAppSelector` to get state, `useTerminalDimensions` for layout sizing, and Ink components like `Box` and `Text`.

### InputField.tsx

- **Role**: Manages user input in the CLI.
- **Sub-Components**:
  - **LiveInputField**: Used when the terminal supports raw mode. It:
    - Tracks input in a `textInput` state.
    - Handles keypresses (e.g., Enter to submit, Backspace to delete) via `useInput` from Ink.
    - Dispatches `PROMPT_SUBMITTED` to the Redux store when Enter is pressed.
  - **DummyInputField**: Shown when raw mode isn't supported (e.g., in non-TTY environments), displaying a "Input Disabled" message.
- **Logic**: Uses `useStdin` to check if raw mode is available and switches between the two sub-components.

### FKeyBar.tsx

- **Role**: Displays a bar with function key shortcuts.
- **What It Does**: Renders static labels like `(F1)Help` and `(F2)Inspector` in a styled `Box`. Currently, it's a visual placeholder—key functionality isn't implemented here.
- **Styling**: Uses Ink's `borderStyle` and `borderColor` for a cyan-bordered look.

### useTerminalDimensions.ts

- **Role**: A custom React hook to track the terminal's size (columns and rows).
- **What It Does**: 
  - Uses `useStdout` from Ink to get the terminal's stdout object.
  - Updates state with `stdout.columns` and `stdout.rows` on resize events.
  - Throws an error if size isn't available (e.g., non-TTY environments).
- **Usage**: Used in `View.tsx` and `Message.tsx` to adjust layout dynamically.

### MessagePartial.tsx

- **Role**: Shows a partial AI response during streaming.
- **What It Does**: 
  - Takes a `partial` prop (a `ChatCompletionChunk.Choice.Delta` from OpenAI).
  - Displays the streaming content with a yellow cursor (`▋`) to indicate it's in progress.
- **Styling**: Uses a yellow border and badge (`🤖 AI`) for visual distinction.

### Message.tsx

- **Role**: Renders individual chat messages based on their role (e.g., `user`, `assistant`, `system`, `tool`).
- **What It Does**:
  - Uses `getRoleStyle` to apply role-specific styling (e.g., green for `user`, yellow for `assistant`).
  - Sub-components like `UserMessageView` and `AssistantMessageView` handle specific roles.
  - Supports tool calls in `AssistantMessageView` by showing `tool_calls` data.
- **Key Features**: Memoized with `memo` for performance, adjusts width using `useTerminalDimensions`.

### DebugView.tsx

- **Role**: Displays debug information when `debugMode` is enabled in the Redux state.
- **What It Does**:
  - Shows three views: `state` (Redux state), `events` (event log), and `logs` (application logs from `LogService`).
  - Switches views with Ctrl+1, Ctrl+2, Ctrl+3 (listener setup is incomplete).
  - Updates logs every second via `useEffect`.
- **Usage**: Rendered in `View.tsx` conditionally based on `debugMode`.

### ConfirmationModal.tsx

- **Role**: Intended to confirm tool calls (e.g., `TOOL_CONFIRMED` events).
- **What It Does**: 
  - Displays the last message and prompts for confirmation (Enter to confirm, any key to cancel).
  - Dispatches `TOOL_CONFIRMED` with `isConfirmed` payload.
- **Status**: Implementation is incomplete—lacks full integration with tool call workflows.

### Frame.tsx

- **Role**: A utility component for wrapping content in a styled box.
- **What It Does**: 
  - Applies a yellow `round` border and padding using Ink's `Box`.
  - Accepts props like `height` and passes others to `Box`.
- **Usage**: Used in `Message.tsx`, `DebugView.tsx`, and `ConfirmationModal.tsx` for consistent framing.

### MessageList.tsx

- **Role**: An unused component (not imported in `View.tsx`).
- **What It Does**: 
  - Was meant to render a list of messages (last 10) and a `DebugView` side-by-side.
  - May be deprecated or intended for future use.
- **Note**: Ignore this for now unless directed to integrate it.

### index.ts

- **Role**: Exports the `View` component as the module's public interface.

## Usage

To use the `InkCLI` module in the Vibe application:

1. **Import and Render**:
   ```tsx
   import { render } from 'ink';
   import { View } from './lib/InkCLI';

   render(<View />);
   ```

This is done in `index.ts` at the project root.

## Setup Requirements:
- Ensure the Redux store (`appStore` from `lib/App/AppStore.ts`) is initialized.
- Wrap the app with `AppProvider` from `lib/App/AppProvider.tsx` if not already done (handled in `index.ts`).

## Customization
You can tweak the `InkCLI` module like this:

- **Styling**: Change colors or borders in `Message.tsx` (e.g., `getRoleStyle`) or `Frame.tsx`.
- **Function Keys**: Edit `FKeyBar.tsx` to add new shortcuts (e.g., `(F3)Debug`) and implement their logic in `View.tsx`.
- **Input Behavior**: Modify `InputField.tsx` to add new key handlers (e.g., Ctrl+C to exit) in the `useInput` callback.

## Error Handling
- **InputField**: Falls back to `DummyInputField` if raw mode isn't supported, showing "Input Disabled".
- **useTerminalDimensions**: Throws an error if terminal size isn't available, which may crash the app if uncaught.

## Extending the Module
To add new features:

### New Components:
- Create a new `.tsx` file in `lib/InkCLI/`.
- Add it to `View.tsx` (e.g., `<NewComponent />`).
- Export it in `index.ts` if needed externally.

### Custom Hooks:
- Write hooks like `useTerminalDimensions.ts` in the same directory.
- Use them in components for new functionality (e.g., `useKeyListener` for shortcuts).

### Styling:
- Leverage Ink's props (e.g., `borderStyle`, `color`) to enhance visuals.
- Test changes in a terminal to ensure readability.
- Document any new additions in this README for clarity.

## Prerequisites
- **Ink**: Installed via `package.json` (`ink@^5.2.0`). Check Ink docs for setup.
- **React**: Uses React 18 (via `package.json`). Familiarity with React components and hooks is required.
- **Redux**: Relies on `@reduxjs/toolkit` and `redux-saga` for state and side effects. See `lib/App/` for details.

## Running the Application
To see the `InkCLI` module in action:

```bash
bun run index.ts
```

This starts the Vibe CLI, where you can type prompts and view responses.

## Directory Structure
Here's what each file in `lib/InkCLI/` does:

- `InputField.tsx`: Handles user input with live or dummy modes.
- `FKeyBar.tsx`: Shows function key shortcuts visually.
- `useTerminalDimensions.ts`: Hook for terminal size tracking.
- `MessagePartial.tsx`: Displays streaming AI responses.
- `View.tsx`: Main component assembling the CLI.
- `MessageList.tsx`: Unused message list (possibly deprecated).
- `Message.tsx`: Renders styled chat messages by role.
- `index.ts`: Exports `View` as the module's entry point.
- `DebugView.tsx`: Shows debug info when enabled.
- `ConfirmationModal.tsx`: Partially implemented tool confirmation UI.
- `Frame.tsx`: Utility for bordered content boxes.

This structure guides you through the module's codebase.
