import { z } from 'zod';
export const UpdateGroupSchema = z.object({
    name: z.string().min(1).trim(),
});
