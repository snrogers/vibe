import { z } from "zod";
import zu from "zod_utilz";


export const CurlArgumentsSchema = z.object({
  url:          z.string(),
  method:       z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']),
  headers:      z.record(z.string()).optional(),
  query_params: z.record(z.string()).optional(),
  body:         z.string().optional(),
});

export const StringifiedCurlArgumentsSchema = zu.stringToJSON().pipe(CurlArgumentsSchema);
