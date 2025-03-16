import { generalCLIPrompt } from "./GeneralCliPrompt"
import { getProjectOverview } from "./getProjectOverview"
import { getVibeMd } from "./getVibeMd"

type GetPromptOpts = {

}
export async function getPrompt() {
  return [
    generalCLIPrompt,
    await getProjectOverview(),
    await getVibeMd(),
  ].join('\n\n')
}
