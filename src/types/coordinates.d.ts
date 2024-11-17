import { z } from "zod";

const Coordinates = z.object({
  row: z.number().min(0).max(7),
  cell: z.number().min(0).max(7),
  id: z.number(),
});

export type Coordinates = z.infer<typeof Coordinates>;
