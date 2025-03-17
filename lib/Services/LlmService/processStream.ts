// lib/Services/LlmService/processStream.ts
import type { ChatCompletionChunk } from "openai/resources"
import type { Stream } from "openai/streaming"
import { dump } from "@/lib/Utils";
import type { ChatMessage } from "@/lib/Domain/ChatSession";
import { channelFromAsyncIterable } from "@/lib/App/Utils";

type Delta = ChatCompletionChunk.Choice.Delta;
type DeltaToolCall = NonNullable<Delta['tool_calls']>[number]

export const mergeDeltas = (acc: Delta, delta: Delta): Delta => {
  // Create a deep copy of the accumulator to avoid mutations
  const sum: Delta = JSON.parse(JSON.stringify(acc));

  // Handle content concatenation
  if (delta.content !== undefined) {
    sum.content = (acc.content || '') + delta.content;
  }

  // Handle role (should only be set once, typically in the first chunk)
  if (delta.role !== undefined) {
    sum.role = delta.role;
  }

  // Handle function_call (legacy API)
  if (delta.function_call) {
    sum.function_call = sum.function_call || {};
    if (delta.function_call.name) {
      sum.function_call.name = (sum.function_call.name || '') + delta.function_call.name;
    }
    if (delta.function_call.arguments) {
      sum.function_call.arguments = (sum.function_call.arguments || '') + delta.function_call.arguments;
    }
  }

  // Handle refusal
  if (delta.refusal) {
    sum.refusal = (sum.refusal || '') + delta.refusal;
  }

  // Handle tool_calls array
  if (delta.tool_calls && delta.tool_calls.length > 0) {
    // Initialize tool_calls array if it doesn't exist
    sum.tool_calls = sum.tool_calls || [];

    // Process each tool call in the delta
    for (const toolCallDelta of delta.tool_calls) {
      // If the tool call has an index, use it to find existing tool call or create a new one
      if (toolCallDelta.index !== undefined) {
        // Find existing tool call by index
        let existingToolCall = sum.tool_calls.find(tc => tc.index === toolCallDelta.index);

        // If no matching tool call exists, create a new one at the correct index
        if (!existingToolCall) {
          // Ensure the array is long enough to hold the new tool call at the specified index
          while (sum.tool_calls.length <= toolCallDelta.index) {
            sum.tool_calls.push({
              index: sum.tool_calls.length,
              id: '',
              type: 'function' as const,
              function: { name: '', arguments: '' }
            });
          }
          existingToolCall = sum.tool_calls[toolCallDelta.index];
        }

        // Create a new copy of the existing tool call to avoid mutation
        const updatedToolCall = { ...existingToolCall };

        // Update the tool call with new delta information
        if (toolCallDelta.id) {
          updatedToolCall.id = (existingToolCall.id || '') + toolCallDelta.id;
        }

        if (toolCallDelta.type) {
          updatedToolCall.type = toolCallDelta.type;
        }

        // Handle function properties
        updatedToolCall.function = { ...(existingToolCall.function || {}) };

        if (toolCallDelta.function?.name) {
          updatedToolCall.function.name = (existingToolCall.function?.name || '') + toolCallDelta.function.name;
        }

        if (toolCallDelta.function?.arguments) {
          updatedToolCall.function.arguments = (existingToolCall.function?.arguments || '') + toolCallDelta.function.arguments;
        }

        // Replace the tool call in the array with our updated copy
        sum.tool_calls[toolCallDelta.index] = updatedToolCall;
      } else {
        // If no index is provided (shouldn't happen with OpenAI API), append to the array
        sum.tool_calls.push({
          index: sum.tool_calls.length,
          id: toolCallDelta.id || '',
          type: toolCallDelta.type || 'function',
          function: {
            name: toolCallDelta.function?.name || '',
            arguments: toolCallDelta.function?.arguments || ''
          }
        });
      }
    }
  }

  return sum;
}
