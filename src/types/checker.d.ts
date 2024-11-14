import { z } from "zod";

const Checker = z.object({
  color: z.enum(["white", "black"]),
  id: z.number(),
  coordinats: z.object({
    row: z.number().max(8).min(1),
    cell: z.number().max(8).min(1),
  }),
  isQueen: z.boolean(),
});

export type Checker = z.infer<typeof Checker>;
