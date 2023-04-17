import { z } from 'zod';

export type AddFriendValidator = z.infer<typeof addFriendValidator>;

export const addFriendValidator = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required!')
    .email('Email address is invalid. Try again!'),
});
