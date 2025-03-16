# ToolService

The `ToolService` is a central module in the Vibe application, designed to manage a collection of tools that enable the Large Language Model (LLM) to interact with the external environment and perform specific tasks. These tasks include file operations (e.g., reading or writing files), network requests (e.g., HTTP calls), and command executions (e.g., running bash commands). The `ToolService` acts as a bridge between the LLM and the system's capabilities, allowing the LLM to execute actions based on user requests.

## Tool Definition

Each tool in the `ToolService` is a self-contained unit with the following components:

- **Name**: A unique string identifier for the tool (e.g., `read_file`, `curl`). This is used by the LLM to reference the tool.
- **Description**: A concise explanation of the tool's purpose, written to guide the LLM in deciding when to use it (e.g., "Read the contents of a file given its path").
- **Argument Schema**: A Zod schema defining the structure and validation rules for the tool's input arguments. This ensures that the LLM provides correctly formatted inputs (e.g., `{ file_path: z.string() }` for `read_file`).
- **Handler**: An asynchronous function that implements the tool's logic. It takes the validated arguments and returns a `ToolMessage` with the result or an error (e.g., reading a file and returning its contents).

Tools are defined in separate modules (e.g., `ReadFileTool.ts`, `CurlTool.ts`) and aggregated in the `ALL_TOOLS` array within `lib/Services/ToolService/index.ts`.

## Available Tools

The `ToolService` currently supports the following tools, each implemented in its own module:

- **`bash`**: Executes bash commands provided by the user (e.g., `ls` or `npm install`).
- **`curl`**: Performs HTTP requests with customizable methods, headers, query parameters, and bodies (e.g., fetching data from an API).
- **`project_overview`**: Generates an overview of the project's structure and contents.
- **`read_file`**: Reads and returns the contents of a specified file as a string.
- **`write_file`**: Writes provided content to a specified file.
- **`replace`**: Replaces specific content within a file.

Each tool's logic, argument schema, and handler are defined in their respective files under `lib/Services/ToolService/`.

## Integration with the Larger Application

The `ToolService` integrates with the Vibe application (a command-line tool powered by LLM agents) through the following mechanisms:

1. **Providing Tools to the LLM**:
   - The `ToolService.getTools()` function returns the `ALL_TOOLS` array.
   - These tools are converted to an OpenAI-compatible format using `openAiChatCompletionToolFromTool` (found in `Utils.ts`), which transforms the tool's name, description, and argument schema into a JSON schema.
   - The converted tools are passed to the LLM client via the `tools` parameter in chat completion requests (handled in `LlmService.streamChatCompletion` in `StreamCompletionSaga.ts`).
   - This allows the LLM to understand and select tools during a conversation.

2. **Executing Tool Calls**:
   - When the LLM decides to use a tool, it generates a `tool_call` object in its response, specifying the tool's name and arguments.
   - The application processes this in `ToolCallSaga.ts`, calling `ToolService.executeToolCall` with the `tool_call` details.
   - `executeToolCall`:
     - Retrieves the tool's handler using `getToolHandler` (in `ToolService.ts`), which maps tool names to their respective handlers.
     - Parses and validates the arguments using the tool's Zod schema.
     - Executes the handler and returns a `ToolMessage` with the result.
   - The result is added to the chat session via Redux actions (e.g., `TOOLS_COMPLETE` in `AppReducer.ts`) and sent back to the LLM for further processing.

This integration enables the LLM to dynamically interact with the environment, leveraging tools to fulfill user requests within the Vibe CLI.

## Error Handling

The `ToolService` ensures robustness with a standardized error handling mechanism, implemented via `withStandardErrorHandling` (in `withStandardErrorHandling.ts`):

- **Validation Errors**: If the LLM provides invalid arguments (per the Zod schema), a `ZodError` is caught, and a `ToolMessage` with an error message (e.g., "Error parsing arguments") is returned.
- **Tool Not Found**: If the requested tool name doesn't exist, a `ToolNotFoundError` is thrown, and a `ToolMessage` with "Tool not found" is returned.
- **General Errors**: Other exceptions during handler execution are caught, returning a `ToolMessage` with a generic error (e.g., "Internal Tool Error"). In development mode (`ENV === 'development'`), detailed error messages are included.

This wrapper ensures consistent error reporting back to the LLM and user.

## Adding New Tools

To extend the `ToolService` with a new tool:

1. **Define the Tool**:
   - Create a new module (e.g., `NewTool.ts` in `lib/Services/ToolService/`).
   - Specify the tool's `name`, `description`, `argsSchema` (using Zod), and `handler` function.
   - Example:
     ```typescript
     export const NewTool = {
       name: 'new_tool',
       description: 'Does something new.',
       argsSchema: z.object({ param: z.string() }),
       handler: async (toolCall) => { /* logic */ return { role: 'tool', tool_call_id: toolCall.id, content: 'result' }; },
     };
     ```

2. **Register the Tool**:
   - Import the tool in `lib/Services/ToolService/index.ts`.
   - Add it to the `ALL_TOOLS` array: `openAiChatCompletionToolFromTool(NewTool)`.

3. **Update Handler Mapping**:
   - In `ToolService.ts`, add a case to `getToolHandler`:
     ```typescript
     case 'new_tool':
       return NewTool.handler;
     ```

Once registered, the new tool becomes available to the LLM in chat completions.

## Architecture Summary

- **Modular Design**: Tools are standalone modules, collected in `ALL_TOOLS`, making it easy to add or modify tools.
- **Central Service**: `ToolService.ts` provides `getTools` and `executeToolCall`, serving as the entry point for tool management and execution.
- **LLM Integration**: Tools are exposed to the LLM via OpenAI-compatible schemas and executed through Redux sagas (`ChatSaga.ts`, `ToolCallSaga.ts`).
- **Error Resilience**: `withStandardErrorHandling` ensures consistent error handling across all tools.

This structure allows the `ToolService` to scalably support the LLM's interaction with the Vibe application, providing a flexible framework for task automation and environment manipulation.
