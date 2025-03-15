import { generalCLIPrompt } from "./GeneralCliPrompt"
import { getVibeMd } from "./getVibeMd"

type GetPromptOpts = {

}
export async function getPrompt() {
  return [
    generalCLIPrompt,
    await getVibeMd(),
  ].join('\n\n')
}
