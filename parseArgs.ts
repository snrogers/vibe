import { parseArgs } from "util";

const parseResult = parseArgs({
  allowPositionals: true,
  args: Bun.argv,
  options: {
    d:              { type: 'boolean' },
    debug:          { type: 'boolean' },
    n:              { type: 'string' },
    nonInteractive: { type: 'string' },
    h:              { type: 'boolean' },
    help:           { type: 'boolean' },
  },
  strict: true,
});

const { values } = parseResult;
export const Args = {
  debug:          values.debug          || values.d,
  nonInteractive: values.nonInteractive || values.n,
  help:           values.help           || values.h,
}
