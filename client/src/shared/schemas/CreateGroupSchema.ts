import { z } from 'zod';

export const CreateGroupSchema = z.object({
  name: z.string().trim().min(1, 'Group name is required'),
});

export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
