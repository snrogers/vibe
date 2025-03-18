# LlmService

The `LlmService` is a core component of the Vibe application, responsible for managing interactions with Large Language Models (LLMs). It handles generating prompts, sending requests to LLMs, and processing their responses, enabling the application to leverage LLM capabilities for tasks like code generation, project management, and task automation.

## Key Features

- **Prompt Generation**: Creates system prompts and user messages tailored for LLM interactions (e.g., via `Prompt/getPrompt.ts`).
- **Request Handling**: Sends requests to LLM providers and manages the communication flow, including streaming responses where supported.
- **Response Processing**: Interprets LLM responses and integrates them into the application's workflow, such as updating the chat session.

## Integration with the Application

The `LlmService` connects with other parts of the Vibe application through:

- **Redux Sagas**: Uses sagas like `ChatSaga.ts` and `StreamCompletionSaga.ts` to manage asynchronous LLM interactions, dispatching actions to update the app state.
- **Tool Integration**: Collaborates with the `ToolService` to pass available tools to the LLM via the `tools` parameter in chat completion requests, enabling tool-assisted conversations.
- **State Management**: Updates the Redux store with LLM responses (e.g., via `CHAT_COMPLETION_SUCCESS`), which are then reflected in the UI through components like `MessageList.tsx`.

## Usage

To interact with the `LlmService`, you typically dispatch a Redux action like `PROMPT_SUBMITTED` with a user prompt. This triggers a saga that:

1. Calls `LlmService` to generate a prompt (e.g., via `getPrompt.ts`).
2. Sends the request to the LLM provider (configured via environment variables like `DEEPSEEK_API_KEY` or `GROK_API_KEY`).
3. Streams or processes the response, updating the chat session in the Redux store.

Example flow:
```typescript
appStore.dispatch({ type: 'PROMPT_SUBMITTED', payload: { prompt: 'Generate a function' } });
```

## Error Handling

The `LlmService` includes robust error handling:
- **Network Errors**: Logs failures (e.g., via `logger` from `LogService`) and dispatches `CHAT_COMPLETION_FAILURE` with the error details.
- **Invalid Responses**: Filters out malformed LLM responses, logging issues and returning a fallback message to the user.
- **Configuration Errors**: Checks for missing API keys or invalid settings, surfacing errors through the UI.

Errors are typically logged and, where appropriate, displayed to the user via the CLI interface.

## Adding New Functionalities

To extend the `LlmService`:

1. **Modify Prompts**: Update `Prompt/getPrompt.ts` to adjust the system prompt or add new prompt templates.
2. **Support New LLMs**: Extend `LlmService.ts` to integrate additional LLM providers (e.g., by adding new API clients or modifying request logic).
3. **Enhance Processing**: Add custom response parsing or filtering in `LlmService.ts` to handle specific use cases.

This flexibility ensures the `LlmService` can adapt to new LLM providers or application requirements.
