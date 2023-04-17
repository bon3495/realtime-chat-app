import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  AddFriendValidator,
  addFriendValidator,
} from '@/lib/validation/add-friend';
import { fetchRedis } from '@/helpers/redis';

export async function POST(req: Request) {
  try {
    const body: AddFriendValidator = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse({
      email: body.email,
    });

    const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`);
    if (!idToAdd) {
      return new Response('This person does not exist', { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response('You cannot add yourself as a friend', {
        status: 400,
      });
    }

    // Check if user is already added
    const isAlreadyAdded = await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_request`,
      session.user.id
    );

    if (isAlreadyAdded) {
      throw new Response('Already added this user', { status: 400 });
    }

    // Check if user is already added
    const isAlreadyFriends = await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      throw new Response('Already friends with this user', { status: 400 });
    }

    // valid request, send friend request
    db.sadd(`user:${idToAdd}:incoming_friend_request`, session.user.id);

    return new Response('OK', { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}
