import { put, take } from "../Utils"

export function * EventLogSaga() {
  while (true) {
    const event = yield * take('*')
    const { type } = event
    if (type === 'CHAT_COMPLETION_STREAM_PARTIAL') continue

    yield * put({ type: 'EVENT_LOG', payload: { event } })
  }
}
