import { render, Text } from "ink"
import { createElement } from "react"

import { View } from "./lib/View"
import { appStore } from "./lib/App"
import { eternity } from "./lib/Utils"

import { args } from "./parseArgs"


// ----------------------------------------------------------------- //
// Init
// ----------------------------------------------------------------- //

if (args.help) {
  console.log(`
    Usage: vibe [options]

    Options:
      -n=, --non-interactive="YOUR_PROMPT"  Run in non-interactive mode [UNIMPLMENTED]
      -h, --help                            Show this help message
  `)
  process.exit(0)
}




// ----------------------------------------------------------------- //
// Render CLI
// ----------------------------------------------------------------- //
const cliInterface = render(createElement(View))

// Wait for the CLI to process.exit
await eternity
