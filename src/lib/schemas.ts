import { z } from "zod";

export const indexSearchSchema = z.object({
  view: z.enum(["calendar", "list"]).catch("calendar"),
});
