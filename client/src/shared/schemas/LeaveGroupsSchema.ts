import { z } from 'zod';

export const LeaveGroupsSchema = z.object({
  groupIds: z
    .array(z.string().min(1, 'Group ID cannot be empty'))
    .min(1, 'At least one group must be selected'),
});