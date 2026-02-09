import { z } from 'zod';

export const updateVotesSchema = z.object({
  inc_votes: z.number()
});
