import { getTranscript, type ChatSession } from "@/lib/Domain/ChatSession"
import { StreamCompletionSaga } from "./StreamCompletionSaga"
import { call, put } from "../Utils"
import { getSystemPrompt } from "@/lib/Services/LlmService/Prompt/getPrompt"


const COMPACTION_PROMPT = `
You are an AI assistant tasked with summarizing conversations.
You will receive a transcript of a conversation between a user and an assistant, formatted with "User:", "Assistant:", "Tool:" etc. labels.
Generate a short summary in a few sentences that captures the main points, including any important details, questions, or tasks discussed.
This summary will be used to continue the conversation in a new session, so ensure it includes all relevant information for maintaining context.
`


function getResumeSessionPrompt(str: string) {
  return `
    You are an AI assistant continuing a previous conversation.
    Here is a summary of the conversation so far:

    <summary>
    ${str}
    </summary>

    Please respond to the user's next inputs, maintaining the context and continuity of the discussion.
  `
}


// ----------------------------------------------------------------- //
// Saga
// ----------------------------------------------------------------- //
type CompactionSagaOtps = {
  session: ChatSession
}
export function * CompactionSaga(opts: CompactionSagaOtps) {
  const { session } = opts

  yield * put({ type: 'CHAT_COMPACTION_STARTED' })

  const sessionTranscript = getTranscript(session)

  // TODO: Either add a `silent` flag or make a separate saga
  //       that doesn't show the partial response as its building
  const response = yield * StreamCompletionSaga({
    chatSession: {
      messages: [
        { role: 'system', content: COMPACTION_PROMPT },
        { role: 'user',   content: sessionTranscript },
      ]
    }
  })

  const summary             = response.assistantMessage.content
  const resumeSessionPrompt = getResumeSessionPrompt(summary)
  const systemPrompt        = yield * call(getSystemPrompt)

  const compactedChatSession: ChatSession = {
    ...session,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: summary },
      { role: 'system', content: resumeSessionPrompt },
    ]
  }

  yield * put({ type: 'CHAT_COMPACTION_SUCCESS', payload: { compactedChatSession } })
}
