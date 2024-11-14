import { z } from "zod";

const Board = z.array(z.array(z.enum(["black", "white"])).min(8)).min(8);

export type Board = z.infer<typeof Board>;
