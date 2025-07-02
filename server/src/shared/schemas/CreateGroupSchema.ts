import { z } from 'zod';

export const CreateGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
});

export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
