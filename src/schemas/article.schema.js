import { z } from 'zod';

export const updateArticleVotesSchema = z.object({
  inc_votes: z.number()
});
