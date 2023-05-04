import { z } from 'zod';

export const messageValidator = z.object({
  id: z.string().trim(),
  senderId: z.string().trim(),
  text: z.string().trim(),
  timestamp: z.number(),
});

export const messageArrayValidator = z.array(messageValidator);

export type MessageValidator = z.infer<typeof messageValidator>;
