import { z } from 'zod';

export const articleSortByQuerySchema = z.object({
  sort_by: z.enum([
    'topic',
    'author',
    'created_at',
    'comment_count',
    'votes'
  ]).default('created_at').optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  topic: z.string().default(null).optional()
});
