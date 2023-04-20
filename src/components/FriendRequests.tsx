'use client';

import { FC, useState } from 'react';

import { User } from '@/types/db';
import FriendRequest from '@/components/FriendRequest';

interface IFriendRequestsProps {
  incommingFriendRequests: User[];
}

const FriendRequests: FC<IFriendRequestsProps> = ({
  incommingFriendRequests,
}) => {
  const [friendRequests, setFriendRequests] = useState<User[]>(
    incommingFriendRequests
  );

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendRequests.map(friend => {
          return (
            <FriendRequest
              key={friend.id}
              friend={friend}
              setFriendRequests={setFriendRequests}
            />
          );
        })
      )}
    </>
  );
};

export default FriendRequests;
