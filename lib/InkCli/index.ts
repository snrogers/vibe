import { render, type Instance as InkInstance } from "ink"
import { createElement } from "react"
import { View } from "./View"

export { View } from "./View"

let inkInstance: InkInstance

export function renderInkCli() {
  return inkInstance ??= render(createElement(View))
}
