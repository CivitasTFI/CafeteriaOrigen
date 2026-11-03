import { z } from "zod";

export const esquemaError = z.object({
  error: z.string(),
});

export type ErrorApi = z.infer<typeof esquemaError>;
