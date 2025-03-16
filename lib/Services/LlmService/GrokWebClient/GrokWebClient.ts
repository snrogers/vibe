import { createEventSource } from "eventsource-client"

console.log('starting')
// exit process if we're not executing this file directly
if (process.argv[1] !== __filename) {
  console.log('exiting')
  process.exit(0)
}

const NEW_CONVERSATION_URL = 'https://grok.com/rest/app-chat/conversations/new'
const HEADERS = {
  "accept":              "*/*",
  "accept-language":     "en-US,en;q=0.9",
  "baggage":             "sentry-environment=production,sentry-release=inCjY-FBUPH5m3kbAjap9,sentry-public_key=b311e0f2690c81f25e2c4cf6d4f7ce1c,sentry-trace_id=a38bf89bc3414e9fb9e624f760fbf10a,sentry-sample_rate=0,sentry-sampled=false",
  "content-type":        "application/json",
  "origin":              "https://grok.com",
  "priority":            "u=1, i",
  "referer":             "https://grok.com/",
  "sec-ch-ua":           "\"Not(A:Brand\";v=\"99\", \"Brave\";v=\"133\", \"Chromium\";v=\"133\"",
  "sec-ch-ua-mobile":   "?0",
  "sec-ch-ua-platform": "\"macOS\"",
  "sec-fetch-dest":     "empty",
  "sec-fetch-mode":     "cors",
  "sec-fetch-site":     "same-origin",
  "sec-gpc":            "1",
  "sentry-trace":       "a38bf89bc3414e9fb9e624f760fbf10a-bb2aee7cee9861c3-0",
  "user-agent":         "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
}



console.log('just a fetch')
const response = await fetch(NEW_CONVERSATION_URL, {
  method: 'GET',
  headers: HEADERS,
})

console.log(await response.text())



// console.log('creating event source')
// const es = createEventSource({
//   headers: HEADERS,
//   url:     NEW_CONVERSATION_URL,
// })
// 
// console.log('listening')
// for await (const event of es) {
//   console.log(event)
// }
// 
// console.log('closing')
// es.close()
