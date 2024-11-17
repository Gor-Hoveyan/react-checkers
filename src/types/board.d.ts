import { z } from "zod";

const Board = z
  .array(
    z
      .array(
        z.object({
          color: z.enum(["black", "white"]),
          isEmpty: z.boolean().default(true),
          isHighlighted: z.boolean().default(false),
        })
      )
      .min(8)
  )
  .min(8);

export type Board = z.infer<typeof Board>;
