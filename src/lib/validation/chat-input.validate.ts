import { z } from 'zod';

export const chatInputValidator = z.object({
  text: z.string().trim(),
});

export type ChatInputValidator = z.infer<typeof chatInputValidator>;
