import { z } from 'zod';

export const addCommentSchema = z.object({
  username: z.string().min(5),
  body: z.string().min(2)
}).transform(comment => ({
  author: comment.username,
  body: comment.body
}));
