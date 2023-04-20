import { getServerSession } from 'next-auth';
import { z, ZodError } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { fetchRedis } from '@/helpers/redis';

export async function POST(req: Request) {
  try {
    const body: { id: string } = await req.json();

    const { id: idToAccept } = z
      .object({
        id: z.string().trim(),
      })
      .parse(body);

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    // const isAlreadyFriend = await fetchRedis(
    //   'sismember',
    //   `user:${session.user.id}:friends`,
    //   idToAccept
    // );

    // const hasFriendRequest = await fetchRedis(
    //   'sismember',
    //   `user:${session.user.id}:incoming_friend_request`,
    //   idToAccept
    // );

    const [isAlreadyFriend, hasFriendRequest] = await Promise.all([
      fetchRedis('sismember', `user:${session.user.id}:friends`, idToAccept),
      fetchRedis(
        'sismember',
        `user:${session.user.id}:incoming_friend_request`,
        idToAccept
      ),
    ]);

    if (isAlreadyFriend) {
      return new Response('Already friends', { status: 400 });
    }

    if (!hasFriendRequest) {
      return new Response('No friend request', { status: 400 });
    }

    await Promise.all([
      db.sadd(`user:${session.user.id}:friends`, idToAccept),
      db.sadd(`user:${idToAccept}:friends`, session.user.id),
      db.srem(`user:${session.user.id}:incoming_friend_request`, idToAccept),
    ]);

    return new Response('OK', { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}
