# LogService

The `LogService` provides centralized logging for the Vibe application, enabling consistent tracking of events, errors, and debugging information across all components. It supports monitoring and troubleshooting by recording key activities.

## Key Features

- **Centralized Logging**: Offers a single `logger` object used throughout the app (e.g., in `ToolService`, `LlmService`).
- **Log Levels**: Supports multiple levels (e.g., `info`, `warn`, `error`) to categorize log messages by severity.
- **Configurable Output**: Allows customization of log destinations and formats (e.g., console, file).

## Integration with the Application

The `LogService` is integrated via:
- **Global Access**: Exports a `logger` object imported by other modules (e.g., `ToolService.ts`, `LlmService.ts`).
- **Event Tracking**: Logs Redux actions, tool executions, and LLM interactions, visible in `DebugView.tsx` when debug mode is enabled.
- **Error Reporting**: Captures and logs errors from services, enhancing traceability.

## Usage

To log an event, import and use the `logger`:
```typescript
import { logger } from '@/lib/Services/LogService';
logger.log('info', 'Tool executed', { toolName: 'read_file' });
```

The `logger` supports methods like `log(level, message, data)`, where `data` is optional metadata.

## Configuration

Configuration is implicit but can be extended:
- **Default**: Logs to the console with a basic format (timestamp, level, message, data).
- **Custom**: Modify `LogService.ts` to adjust output (e.g., add file logging) or log level thresholds based on `V_DEBUG` from `Constants.ts`.

## Error Handling

The `LogService` is designed to be fault-tolerant:
- **Logging Failures**: Silently handles internal errors to avoid crashing the app.
- **Overflow**: Limits log storage (e.g., last 10 logs in `DebugView.tsx`) to prevent memory issues.

## Extending the Service

To enhance `LogService`:

1. **New Log Levels**: Add levels (e.g., `debug`, `trace`) in `LogService.ts`.
2. **External Integration**: Configure `logger` to send logs to external services (e.g., a monitoring tool).
3. **Custom Formats**: Update the log output format to include additional context (e.g., user ID, session ID).

This ensures the `LogService` meets evolving debugging and monitoring needs.
