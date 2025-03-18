import type { AnyZodType } from "@/lib/Types"
import { z } from "zod"

import type { Tool, ToolCallHandler } from "../Types"
import { identity } from "rambdax"




const MultiToolCommandSchema = z.object({

})


const MultiToolArgsSchema = z.object({
  command: MultiToolCommandSchema
})



// TODO: Make a union
type ToolName = string

type MultiToolOpts = {
  toolNames: ToolName[]
  model:     string
}
export class MultiTool implements Tool {
  public readonly description = 'TODO: Multitool Description'
  public readonly name        = 'MultiTool'
  public readonly argsSchema  = MultiToolArgsSchema
  public readonly handler: ToolCallHandler<AnyZodType>

  constructor(opts: MultiToolOpts) {
    this.handler = identity // FIXME: Implement MultiTool
  }

}
