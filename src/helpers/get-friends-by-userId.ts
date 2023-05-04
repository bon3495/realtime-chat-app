import { User } from '@/types/db';
import { fetchRedis } from '@/helpers/redis';

export const getFriendsByUserId = async (userId: string) => {
  try {
    // retrieve friends for current user
    const friendIds = (await fetchRedis(
      'smembers',
      `user:${userId}:friends`
    )) as string[];

    const friends = await Promise.all(
      // missing: .sort()
      friendIds.map(friendId => {
        return fetchRedis('get', `user:${friendId}`) as Promise<string>;
      })
    );

    return friends.map(f => JSON.parse(f)) as User[];
  } catch (error) {}
};
