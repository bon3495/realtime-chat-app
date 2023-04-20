import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { User } from '@/types/db';
import FriendRequests from '@/components/FriendRequests';
import { authOptions } from '@/lib/auth';
import { fetchRedis } from '@/helpers/redis';

const page = async ({}) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const incommingSenderIds = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_request`
  )) as string[];

  const incommingFriendRequests = await Promise.all(
    incommingSenderIds.map(async id => {
      const user = await fetchRedis('get', `user:${id}`);
      const userParse = JSON.parse(user) as User;

      return userParse;
    })
  );

  return (
    <main className="pt-8">
      <h1 className="mb-8 text-5xl font-bold">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests incommingFriendRequests={incommingFriendRequests} />
      </div>
    </main>
  );
};

export default page;
