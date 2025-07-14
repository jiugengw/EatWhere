// // server/src/shared/schemas/CuisineQuerySchema.ts
// import { z } from 'zod';
// import { CUISINES } from '../../recommendations/types.js';

// export const CuisineQuerySchema = z.object({
//   cuisine: z.enum(CUISINES as [string, ...string[]], {
//     required_error: 'Cuisine parameter is required',
//     invalid_type_error: `Cuisine must be one of: ${CUISINES.join(', ')}`
//   }),
//   limit: z.string()
//     .optional()
//     .transform(val => val ? parseInt(val, 10) : 5)
//     .refine(val => val && val > 0 && val <= 20, {
//       message: 'Limit must be between 1 and 20'
//     })
// });

// export type CuisineQueryInput = z.infer<typeof CuisineQuerySchema>;