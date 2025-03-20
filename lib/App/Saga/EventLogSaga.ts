import { put, take, takeEvery } from "../Utils"
import { logger } from "@/lib/Services/LogService";
import { V_DEBUG } from "../../Constants";
import type { AppEvent } from "../AppEvent";


let eventCount = 0;

/**
 * EventLogSaga - Captures all Redux events, logs them, and puts them in the event log
 * for debugging purposes
 */
export function* EventLogSaga(event: AppEvent) {
  try {
    // TODO: do we even use 'KEY_INPUT'?
    if (event.type === 'KEY_INPUT') return
    // Skip stream partial events unless in debug mode
    if (event.type === 'CHAT_COMPLETION_STREAM_PARTIAL' && !V_DEBUG) return;

    eventCount++;

    // Log the event to our Logger service
    logger.logEvent(event);

    // ----------------------------------------------------------------- //
    // After this, we're doing client-side loggin which involves
    // filtering and stuff.
    // ----------------------------------------------------------------- //

    // Skip events we don't want to put in the redux store event log
    // This helps keep the UI clean and prevents memory issues
    const type = event?.type;
    if (!type) return;

    // Skip 'EVENT_LOG' events to prevent infinite loops
    if (type === 'EVENT_LOG') return;

    // Add event to the Redux store event log
    yield * put({
      type: 'EVENT_LOG',
      payload: { event }
    });

    // Periodically log stats
    if (eventCount % 100 === 0 && V_DEBUG) {
      logger.log('debug', `EventLogSaga has processed ${eventCount} events`);
    }
  } catch (error) {
    logger.log('error', 'Error in EventLogSaga', error);
    console.error("Error in EventLogSaga:", error);
  }
}

export function * WatchEventLogSaga() {
  logger.log('info', 'WatchEventLogSaga started');
  yield * takeEvery('*', EventLogSaga);
}
