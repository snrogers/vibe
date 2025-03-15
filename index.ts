import { render, Text } from "ink"
import { createElement } from "react"

import { View } from "./lib/View"
import { appStore } from "./lib/App"
import { eternity } from "./lib/Utils"

import { Args } from "./parseArgs"


// ----------------------------------------------------------------- //
// Init
// ----------------------------------------------------------------- //

if (Args.help) {
  console.log(`
    Usage: vibe [options]

    Options:
      -d, --debug                           Enable debug mode [UNIMPLMENTED]
      -n=, --non-interactive="YOUR_PROMPT"  Run in non-interactive mode [UNIMPLMENTED]
      -h, --help                            Show this help message
  `)
  process.exit(0)
}




// ----------------------------------------------------------------- //
// Render CLI
// ----------------------------------------------------------------- //
const cliInterface = render(createElement(View))

await new Promise(resolve => setTimeout(resolve, 1000))

appStore.dispatch({
  "type": "PROMPT_SUBMITTED",
  "payload": {
    "prompt": "yo what's up? I'd like you to try out your bash tool by calling `ls` and tell me what you see!"
  }
})

// Wait for the CLI to process.exit
await eternity
