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
const cliInterface = render(
  createElement(View),
  { debug: true }
)

await new Promise(resolve => setTimeout(resolve, 1000))

// Wait for the CLI to process.exit
await eternity
