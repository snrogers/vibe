import { render, Text } from "ink"
import { createElement } from "react"
import { View } from "./lib/View"

import { appStore } from "./lib/App"
import { eternity } from "./lib/Utils"


render(createElement(View))

await eternity
