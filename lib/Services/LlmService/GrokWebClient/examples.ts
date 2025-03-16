
// ----------------------------------------------------------------- //
// From LinkedinBot
// ----------------------------------------------------------------- //
const ACCEPT =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'

const COOKIE =
  `li_sugr=0e14ff96-952d-4105-bbce-8dc75012b600; bcookie="v=2&2b0c61f8-c6f6-48a5-88d8-c8c02589b284"; bscookie="v=1&2024120605594412c7b8ee-4ea9-4cc6-8fae-e8ce1c95bab4AQHQmAX6m3yQycKZkv-GQfsi14Q3n0te"; dfpfpt=c253a404a8d94dfb8d6b81908b0590b6; _gcl_au=1.1.1941748563.1733475383; li_rm=AQEEDsm_ZflbYgAAAZObL4SqUsa3UVNcyJ03gpXYc24cjo_PbI_ePUl_1ilNXppUOSQGAW0jVJR6qDDT53bf_RQZMm6udnfNYyACCxlJgZ8Kfx7ZQfXEpnzRfim1PV6kyyvEVTqO25zdEyFuyjWcWCHUlpkBY6ejpc1Z6YO4MRBMxxcT4IgTFMiPlQRjeLAzr956XdsIWbS14dAlq1ZpiUVSSK23huF94Y1rMH26S9C2LYAZXmvBQR2NhdWYkYHISWkyG6rSJkRkN4ujg17z0Z_GFGteJEqwOjNzkRbPhisCjRa99K8wTR8OkgBIi8cej-EVbPmBsqyoLhkhl4Y; JSESSIONID="ajax:0685461401785590766"; li_theme=light; li_theme_set=app; _guid=330987ab-2916-4872-8dfa-1020d1aaf1eb; timezone=America/New_York; AnalyticsSyncHistory=AQK8dNtKdogkCAAAAZSoWmwVcyBjs9PqfCZmoYra4WwN07j4vGlEWcbfQE_ZHOp894pusNsjGnp5QdGw5JoUhA; lms_ads=AQGeclStip8CMgAAAZSoWm5eTDX5xLDoUuyryThqG5CAl1vN087cUdWJqL6P8G9NyP4ymJvxcO7JHtHL2PpnxxsjABkhO7eJ; lms_analytics=AQGeclStip8CMgAAAZSoWm5eTDX5xLDoUuyryThqG5CAl1vN087cUdWJqL6P8G9NyP4ymJvxcO7JHtHL2PpnxxsjABkhO7eJ; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C20117%7CvVersion%7C5.1.1%7CMCMID%7C84273519952794579191973133328522684144%7CMCAAMLH-1738691156%7C7%7CMCAAMB-1738691156%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1738093556s%7CNONE; aam_uuid=83758077343221221641994766372082996539; liap=true; li_at=AQEDARiO-MAEO1iMAAABlK7NE4cAAAGU0tmXh1YAlBYCTH1DqIP08LYWeQ2UVOK-aehz07rJsrLszfyyGXLZQ7-4rEHSWec_ajLj34dVSO6LIGurO_0XmBouZYANUIQ6g4jNKjwsIaehd3MThKnFPzd6; fptctx2=taBcrIH61PuCVH7eNCyH0MJojnuUODHcZ6x9WoxhgCl63js89GaKPHWblHV9vm60NWhD7ugcZETtbGpjp%252fx8zs3LaWaX1HwzOK9XcjMnsHsQLvFSlxwFERvWmZGN2OVD8vQNKM11vdckrokvyPmx9n5zkbALWq9%252bL1KpX%252bN%252fNbEELGVI4mNFcxEQxCTkBoyNCNXMOLRTkx4bBlz%252bI1eB1Q2HeboGMPEmhrv30LzQ6a3gH6eSYvl0b8RT3TSqXEjXaZxeoAhQckIBkogLRAFjGXCcBpotozkEHqj5kwVJB9BCDxjGHBae%252fTZSi6eP6BOruTm68dBCrpqQK%252fzeWrZ%252bem%252fWo4p8%252fB%252fqTz%252bTNn2CgIs%253d; lang="v=2&lang=en-us"; UserMatchHistory=AQI8mNjducSXpQAAAZSzZ2woGqY9U8QAmY-5g-CbahyFSQZmXlB8qriLXnuBk8feKpAQencHlNWQFVtY8GWGBKD9dVxDjLFv_hccOK9P2eXW6BPKP8bf3a0K18Bhy80SOvmt6jxfgNdyu3VqXKrG12SRZ6xYzDOFS_e5iP4WFrnKMp1h8Qpmc9rrwMOgQR5y9AtX8ut1SO7iKc0pjGU5T3vt3-PVZ_CjkImSC5FrV0r-9aJjiInUi4kvDBpCIgdZd3vSwzjUa7rgYhyma33bXRnyYNAixObAK4L4a7zmdSbJzrDQPg7VH_XpgoNoguiXLw0Us3iPdPj0eGk0EipwP--4yRI43eQox9y2Cy2-wf3HfyO_Hg; lidc="b=OB76:s=O:r=O:a=O:p=O:g=3153:u=245:x=1:i=1738177420:t=1738225973:v=2:sig=AQGeXEiz3v8zpKoNk4UTsQsxE4gr3ybu"; __cf_bm=L5bbuBjd90oXLbX4iYcAtYQ3ZpHjGjn3MgFbKyhRl24-1738178510-1.0.1.1-i73h92SW1JwoqP_CUXKlc2SyEO2oWiPiFMbkb3ykRa5G71H7JktCJ1xGddYgYxZ75fKECnY7mmJ0rhMgLhJF9A`

const CSRF_TOKEN = getCsrfToken(COOKIE)

export const HEADERS =
  { accept:       ACCEPT
  , cookie:       COOKIE
  , 'crsf-token': CSRF_TOKEN
  , credentials:  'include'
  }



//
//
// ----------------------------------------------------------------- //
// New Conversation
// ----------------------------------------------------------------- //
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

// ----------------------------------------------------------------- //
// Followup User Message
// ----------------------------------------------------------------- //
const followupUserMessageCurl = `
curl 'https://grok.com/rest/app-chat/conversations/494db7bc-5731-4b11-bb7d-949d2c9d28aa/responses' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'baggage: sentry-environment=production,sentry-release=inCjY-FBUPH5m3kbAjap9,sentry-public_key=b311e0f2690c81f25e2c4cf6d4f7ce1c,sentry-trace_id=a38bf89bc3414e9fb9e624f760fbf10a,sentry-sample_rate=0,sentry-sampled=false' \
  -H 'content-type: application/json' \
  -b '_ga=GA1.1.463186647.1741118462; x-anonuserid=e1632f96-2abf-4f42-b41f-3f6411e8fc0f; x-challenge=PsZSPAJWBl61%2B7wyPEUtph0zgZuPLuqb7QAoAQF0ySCpk97%2BpNY9ZnrgU0JxjOv%2FOkClIXNLntsuGXKgGiVGqix24jBN8MJO63BcxvCgGVr3bV495VM0LPID6F5qstKqE7btvYGmCNEIi8%2FlEG9k5r8094Qj26RNa04rYVQfVaalo3g8PI0%3D; x-signature=XkQ8icQf0%2B1nNX5H2RHacQCYUDMpneP405yy%2FHWQy9F2L5SVerq4E9lRktnpyxOIUiTNGISKttkpnPtzR1lXIw%3D%3D; sso=eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uX2lkIjoiMTFiY2M2YjEtZTFjNi00Y2RjLWE5MzYtNGE4NTRmYjhmNTQ5In0.XV8TO6cZlIuL9A1ojhrfDTziJ4nHDQXhNKzwpZA9k2g; sso-rw=eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uX2lkIjoiMTFiY2M2YjEtZTFjNi00Y2RjLWE5MzYtNGE4NTRmYjhmNTQ5In0.XV8TO6cZlIuL9A1ojhrfDTziJ4nHDQXhNKzwpZA9k2g; cf_clearance=P7EaYo.2uMFfKoBxSg86hDqO8MntyLTYS8rIYfx6fIA-1742112098-1.2.1.1-e62VMLQ1DQUkeHuck49yOIO4f5yR6QXE83Vl0EirV_RIYP5OLEFPcDq3eO1QKVf48poD3wHJ5X19dD8QxvWTyJ7bs3.5RGGAwyX0u8vVx.Od4HIX3K1maEoJvF4Fbfigd1Lvo9YsBRd7qOzTF.yrxHJHDatms5iPPBg2aK2xdU7HLDLYLXClkBbIHl8C8J43fPoGNv2QHuHhqFAA9DarnWWuBaEQ3qXllsuXCWJA4Vh6GC3f78R9.bvvnK8.Tb0HJgkp9pevSW0OPjYfYIt7vkes9K8gdPN5ty1AVeyJA4rpPZVimrRc8paIjIkTOwk40TVxnXAKJWHCXPUtyhxWFskhv78F1jXCM.3yIKtZrV8; _ga_8FEWB057YH=GS1.1.1742110932.53.1.1742112820.0.0.0' \
  -H 'origin: https://grok.com' \
  -H 'priority: u=1, i' \
  -H 'referer: https://grok.com/chat/494db7bc-5731-4b11-bb7d-949d2c9d28aa' \
  -H 'sec-ch-ua: "Not(A:Brand";v="99", "Brave";v="133", "Chromium";v="133"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-gpc: 1' \
  -H 'sentry-trace: a38bf89bc3414e9fb9e624f760fbf10a-bb2aee7cee9861c3-0' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36' \
  --data-raw '{"message":"but then more thoughst","modelName":"grok-3","parentResponseId":"250c6fff-9ada-4ec8-9443-cbcd233c6e8a","disableSearch":false,"enableImageGeneration":true,"imageAttachments":[],"returnImageBytes":false,"returnRawGrokInXaiRequest":false,"fileAttachments":[],"enableImageStreaming":true,"imageGenerationCount":2,"forceConcise":false,"toolOverrides":{},"enableSideBySide":true,"sendFinalMetadata":true,"deepsearchPreset":"","isReasoning":true,"webpageUrls":[]}'
`

const followupUserMessageEvents = [
  {
    "result": {
      "userResponse": {
        "responseId": "20e70b1b-2d7a-4931-961c-0422eb89e66e",
        "message": "but then more thoughst",
        "sender": "human",
        "createTime": "2025-03-16T08:15:36.234706562Z",
        "parentResponseId": "250c6fff-9ada-4ec8-9443-cbcd233c6e8a",
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
      "responseId": "20e70b1b-2d7a-4931-961c-0422eb89e66e"
    }
  },
  {
    "result": {
      "token": "",
      "isThinking": true,
      "isSoftStop": false,
      "responseId": "f2482538-0d39-44ab-b6f3-5bd656cba251"
    }
  },
  {
    "result": {
      "finalMetadata": {
        "followUpSuggestions": [],
        "feedbackLabels": [],
        "toolsUsed": {},
        "disclaimer": ""
      },
      "isThinking": false,
      "isSoftStop": false,
      "responseId": "f2482538-0d39-44ab-b6f3-5bd656cba251"
    }
  },
  {
    "result": {
      "modelResponse": {
        "responseId": "f2482538-0d39-44ab-b6f3-5bd656cba251",
        "message": "Alright, let's keep thinking! I hear you wanting to dive deeper, so let’s push the boundaries a bit more. Imagine this: a world where AI and humans team up effortlessly. Picture it—art flowing from a blend of human passion and machine precision, problems tackled with a mix of gut instinct and cold, hard data, creativity exploding in ways we can barely dream of now. What do you think that would look like?\n\nWould it be a **utopia**, where we’re all living our best lives, harmonizing with tech to unlock new heights? Or maybe a **dystopia**, where the lines blur too much, and we start wondering what “human” even means anymore? I can’t help but wonder—would we lose something essential about ourselves, or would we discover fresh ways to shine? These questions rattle around in my head late at night. How about you? What’s sparking more thoughts for you right now?",
        "sender": "ASSISTANT",
        "createTime": "2025-03-16T08:15:41.999894009Z",
        "parentResponseId": "20e70b1b-2d7a-4931-961c-0422eb89e66e",
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
        "thinkingTrace": "Okay, the user wants me to think more. I should acknowledge their request and then proceed with additional thoughts. I'll start by saying something like, \"Alright, let's keep thinking.\" Then, I can expand on my previous thoughts or introduce new ones. I'll make sure to keep the tone engaging and conversational.\n\nAlright, let's keep thinking. What if we pushed the boundaries even further? Imagine a world where AI and humans collaborate seamlessly, creating art, solving problems, and pushing the limits of creativity. What would that look like? Would it be a utopia or a dystopia? Would we lose our humanity or find new ways to express it? These are the kinds of questions that keep me up at night. What about you? What's got your brain buzzing?",
        "steps": [],
        "mediaTypes": [],
        "webpageUrls": []
      },
      "isThinking": false,
      "isSoftStop": false,
      "responseId": "f2482538-0d39-44ab-b6f3-5bd656cba251"
    }
  }
]


