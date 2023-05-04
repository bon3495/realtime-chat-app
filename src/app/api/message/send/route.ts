import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { z, ZodError } from 'zod';

import { User } from '@/types/db';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  messageValidator,
  MessageValidator,
} from '@/lib/validation/message.validate';
import { fetchRedis } from '@/helpers/redis';

export async function POST(req: Request) {
  try {
    const body: {
      text: string;
      chatId: string;
    } = await req.json();
    const { text, chatId } = z
      .object({
        text: z.string().trim(),
        chatId: z.string().trim(),
      })
      .parse(body);

    const session = await getServerSession(authOptions);
    const [userIdOne, userIdTwo] = chatId.split('--');

    if (
      !session ||
      (session.user.id !== userIdOne && session.user.id !== userIdTwo)
    ) {
      return new Response('Unauthorized', { status: 401 });
    }

    const friendId = session.user.id === userIdOne ? userIdTwo : userIdOne;

    const friendList = (await fetchRedis(
      'smembers',
      `user:${session.user.id}:friends`
    )) as string[];
    const isFriend = friendList.includes(friendId);

    if (!isFriend) {
      return new Response('Unauthorized', { status: 401 });
    }

    const rawSender = (await fetchRedis(
      'get',
      `user:${session.user.id}`
    )) as string;

    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();
    const messageData: MessageValidator = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);
    // All valid, send the message
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response('OK', { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    if (error instanceof ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
