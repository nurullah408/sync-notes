import { z } from "zod";

export const SerializedInternalLinkNodeSchema = z.object({
  type: z.literal("internal-link"),
  version: z.number(),
  noteId: z.string().min(1),
});
