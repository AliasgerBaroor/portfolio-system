import { z } from "zod";
import { ContentEntryStatus } from "@prisma/client";

export const ListContentEntriesSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.nativeEnum(ContentEntryStatus).optional(),
});

export type ListContentEntriesInput = z.infer<
    typeof ListContentEntriesSchema
>;