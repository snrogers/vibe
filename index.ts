#!/usr/bin/env bun

import { render, Text } from "ink"
import { createElement } from "react"

import { Args } from "./parseArgs"
import { appStore } from "./lib/App"
import { eternity } from "./lib/Utils"
import { renderInkCli as initInkCli, View } from "./lib/InkCli"


if (Args.help) {
  console.log(`
    Usage: vibe [options]

    Options:
      -d,  --debug                          Enable debug mode
      -n=, --non-interactive="YOUR_PROMPT"  Run in non-interactive mode
      -h,  --help                           Show this help message
  `)
  process.exit(0)
}

initInkCli()

// ----------------------------------------------------------------- //
// Maybe Submit Prompt if Non-Interactive
// ----------------------------------------------------------------- //
if (Args.nonInteractive) {
  appStore.dispatch({ type: 'PROMPT_SUBMITTED', payload: { message: Args.nonInteractive } })
}


// Wait for the CLI to process.exit
await eternity
