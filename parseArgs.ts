import { parseArgs } from "util";

const parseResult = parseArgs({
  allowPositionals: true,
  args: Bun.argv,
  options: {
    nonInteractive: { type: 'string' },
    n:              { type: 'string' },
    help: { type: 'boolean' },
    h:    { type: 'boolean' },
  },
  strict: true,
});

const { values } = parseResult;
export const args = {
  nonInteractive: values.nonInteractive || values.n,
  help:           values.help           || values.h,
}
