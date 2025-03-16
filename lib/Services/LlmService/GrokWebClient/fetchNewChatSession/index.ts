
const newConversationCurl = `
curl 'https://grok.com/rest/app-chat/conversations/new' \
  -b '_ga=GA1.1.463186647.1741118462; x-anonuserid=e1632f96-2abf-4f42-b41f-3f6411e8fc0f; x-challenge=PsZSPAJWBl61%2B7wyPEUtph0zgZuPLuqb7QAoAQF0ySCpk97%2BpNY9ZnrgU0JxjOv%2FOkClIXNLntsuGXKgGiVGqix24jBN8MJO63BcxvCgGVr3bV495VM0LPID6F5qstKqE7btvYGmCNEIi8%2FlEG9k5r8094Qj26RNa04rYVQfVaalo3g8PI0%3D; x-signature=XkQ8icQf0%2B1nNX5H2RHacQCYUDMpneP405yy%2FHWQy9F2L5SVerq4E9lRktnpyxOIUiTNGISKttkpnPtzR1lXIw%3D%3D; sso=eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uX2lkIjoiMTFiY2M2YjEtZTFjNi00Y2RjLWE5MzYtNGE4NTRmYjhmNTQ5In0.XV8TO6cZlIuL9A1ojhrfDTziJ4nHDQXhNKzwpZA9k2g; sso-rw=eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uX2lkIjoiMTFiY2M2YjEtZTFjNi00Y2RjLWE5MzYtNGE4NTRmYjhmNTQ5In0.XV8TO6cZlIuL9A1ojhrfDTziJ4nHDQXhNKzwpZA9k2g; cf_clearance=P7EaYo.2uMFfKoBxSg86hDqO8MntyLTYS8rIYfx6fIA-1742112098-1.2.1.1-e62VMLQ1DQUkeHuck49yOIO4f5yR6QXE83Vl0EirV_RIYP5OLEFPcDq3eO1QKVf48poD3wHJ5X19dD8QxvWTyJ7bs3.5RGGAwyX0u8vVx.Od4HIX3K1maEoJvF4Fbfigd1Lvo9YsBRd7qOzTF.yrxHJHDatms5iPPBg2aK2xdU7HLDLYLXClkBbIHl8C8J43fPoGNv2QHuHhqFAA9DarnWWuBaEQ3qXllsuXCWJA4Vh6GC3f78R9.bvvnK8.Tb0HJgkp9pevSW0OPjYfYIt7vkes9K8gdPN5ty1AVeyJA4rpPZVimrRc8paIjIkTOwk40TVxnXAKJWHCXPUtyhxWFskhv78F1jXCM.3yIKtZrV8; _ga_8FEWB057YH=GS1.1.1742110932.53.1.1742112791.0.0.0' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'baggage: sentry-environment=production,sentry-release=inCjY-FBUPH5m3kbAjap9,sentry-public_key=b311e0f2690c81f25e2c4cf6d4f7ce1c,sentry-trace_id=a38bf89bc3414e9fb9e624f760fbf10a,sentry-sample_rate=0,sentry-sampled=false' \
  -H 'content-type: application/json' \
  -H 'origin: https://grok.com' \
  -H 'priority: u=1, i' \
  -H 'referer: https://grok.com/' \
  -H 'sec-ch-ua: "Not(A:Brand";v="99", "Brave";v="133", "Chromium";v="133"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-gpc: 1' \
  -H 'sentry-trace: a38bf89bc3414e9fb9e624f760fbf10a-bb2aee7cee9861c3-0' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36' \
  --data-raw '{"temporary":false,"modelName":"grok-3","message":"Think for a minute","fileAttachments":[],"imageAttachments":[],"disableSearch":false,"enableImageGeneration":true,"returnImageBytes":false,"returnRawGrokInXaiRequest":false,"enableImageStreaming":true,"imageGenerationCount":2,"forceConcise":false,"toolOverrides":{},"enableSideBySide":true,"isPreset":false,"sendFinalMetadata":true,"deepsearchPreset":"","isReasoning":true,"webpageUrls":[]}'
`

const newConversationEvents = [
  {
    "result": {
      "conversation": {
        "conversationId": "494db7bc-5731-4b11-bb7d-949d2c9d28aa",
        "title": "New conversation",
        "starred": false,
        "createTime": "2025-03-16T08:13:39.326021Z",
        "modifyTime": "2025-03-16T08:13:39.326021Z",
        "systemPromptName": "",
        "temporary": false,
        "mediaTypes": []
      }
    }
  },
  {
    "result": {
      "response": {
        "userResponse": {
          "responseId": "f985b43a-dc0f-4d89-bfa3-fd41edceda11",
          "message": "Think for a minute",
          "sender": "human",
          "createTime": "2025-03-16T08:13:39.330787157Z",
          "manual": false,
          "partial": false,
          "shared": false,
          "query": "",
          "queryType": "",
          "webSearchResults": [],
          "xpostIds": [],
          "xposts": [],
          "generatedImageUrls": [],
          "imageAttachments": [],
          "fileAttachments": [],
          "cardAttachmentsJson": [],
          "fileUris": [],
          "fileAttachmentsMetadata": [],
          "isControl": false,
          "steps": [],
          "mediaTypes": [],
          "webpageUrls": []
        },
        "isThinking": false,
        "isSoftStop": false,
        "responseId": "f985b43a-dc0f-4d89-bfa3-fd41edceda11"
      }
    }
  },
  {
    "result": {
      "response": {
        "token": "Alright",
        "isThinking": true,
        "isSoftStop": false,
        "responseId": "250c6fff-9ada-4ec8-9443-cbcd233c6e8a"
      }
    }
  },
  {
    "result": {
      "response": {
        "finalMetadata": {
          "followUpSuggestions": [],
          "feedbackLabels": [],
          "toolsUsed": {},
          "disclaimer": ""
        },
        "isThinking": false,
        "isSoftStop": false,
        "responseId": "250c6fff-9ada-4ec8-9443-cbcd233c6e8a"
      }
    }
  },
  {
    "result": {
      "response": {
        "modelResponse": {
          "responseId": "250c6fff-9ada-4ec8-9443-cbcd233c6e8a",
          "message": "Hey there! I’ve taken a moment to think, as you asked. So, what’s on your mind? I’m all ears and ready to dive into whatever you’d like to talk about!",
          "sender": "ASSISTANT",
          "createTime": "2025-03-16T08:13:42.616542628Z",
          "parentResponseId": "f985b43a-dc0f-4d89-bfa3-fd41edceda11",
          "manual": false,
          "partial": false,
          "shared": false,
          "query": "",
          "queryType": "",
          "webSearchResults": [],
          "xpostIds": [],
          "xposts": [],
          "generatedImageUrls": [],
          "imageAttachments": [],
          "fileAttachments": [],
          "cardAttachmentsJson": [],
          "fileUris": [],
          "fileAttachmentsMetadata": [],
          "isControl": false,
          "thinkingTrace": "Alright, the user is asking me to think for a minute. That's a bit unusual, but I'll play along. I can use this time to consider various aspects of the conversation or the user's intent. Maybe they're testing my ability to handle pauses or delays in the interaction. Or perhaps they just need a moment to gather their thoughts. Either way, I'll respond in a way that acknowledges the request and keeps the conversation open. I could say something like, \"Sure, take your time,\" or \"I'm here when you're ready.\" But I should also consider the tone and context of the conversation. Since the user is asking me to think, I could also add a playful or humorous element to my response. For example, I could say, \"Thinking... thinking... got it. What's on your mind?\" This keeps the interaction light and engaging. I'll go with that approach.\n\nThinking... thinking... got it. What's on your mind?",
          "steps": [],
          "mediaTypes": [],
          "webpageUrls": []
        },
        "isThinking": false,
        "isSoftStop": false,
        "responseId": "250c6fff-9ada-4ec8-9443-cbcd233c6e8a"
      }
    }
  },
  {
    "result": {
      "title": {
        "newTitle": "\"Think for a Minute\" Reflection"
      }
    }
  }
]
