import { eternity } from "@/lib/Utils"

/** Where the script is running */
const CWD = process.cwd()
/** Where this source file is located */
const SOURCE_FILE = new URL(import.meta.url)

export async function getVibeMd() {
  const absolutePath = `${CWD}/VIBE.md`
  const file = Bun.file(absolutePath)
  const text = await file.text().catch(() => '')
  return `
<VIBE.md>
${text}
</VIBE.md>
  `.trim()
}
