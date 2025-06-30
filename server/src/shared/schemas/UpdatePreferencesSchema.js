import { z } from 'zod';
export const UpdatePreferencesSchema = z.array(z.object({
    cuisine: z.string(),
    points: z.number().int(),
}));
