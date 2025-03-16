import { z } from "zod";
import zu from "zod_utilz";


export const CurlArgumentsSchema = z.object({
  url:          z.string()
                 .describe('The URL to make the request to.'),
  method:       z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
                 .describe('The HTTP method to use (e.g., GET, POST, PUT, DELETE).'),
  headers:      z.record(z.string()).optional()
                 .describe('Optional headers to include in the request (e.g., {"Authorization": "Bearer token"}).'),
  query_params: z.record(z.string()).optional()
                 .describe('Optional query parameters to append to the URL (e.g., {"key": "value"}).'),
  body:         z.string().optional()
                 .describe('Optional request body for methods like POST or PUT (e.g., a JSON string).'),
}).describe('Arguments for the CurlTool.');

export const StringifiedCurlArgumentsSchema = zu.stringToJSON().pipe(CurlArgumentsSchema);
