import { PWD } from "@/lib/Constants"

const d = true // FIXME:
const platform = process.platform


export async function getEnvironmentDetails() {
  return `
    Here is useful information about the environment you are running in:

    <env>
      Working directory: ${PWD}
      Is directory a git repo: ${d ? 'Yes' : 'No'}
      Platform: ${platform}
      Today's date: ${new Date().toLocaleDateString()}
    </env>
  `.trim()
}
