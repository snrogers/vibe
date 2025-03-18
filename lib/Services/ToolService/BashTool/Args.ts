import { z } from "zod";
import { zu } from "zod_utilz";

export const BashToolArgsSchema = z.object({
  command: z.string().describe("The bash command to execute."),
});

export const StringifiedBashToolArgsSchema = zu.stringToJSON().pipe(
  BashToolArgsSchema,
);
