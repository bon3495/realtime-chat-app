'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { User } from '@/types/db';
import { Icons } from '@/components/Icons';

interface IFriendRequestProps {
  friend: User;
  setFriendRequests: Dispatch<SetStateAction<User[]>>;
}

const FriendRequest: FC<IFriendRequestProps> = ({
  friend,
  setFriendRequests,
}) => {
  const router = useRouter();

  const acceptFriend = async () => {
    await axios.post('/api/friends/accept', { id: friend.id });

    setFriendRequests(prev => prev.filter(user => user.id !== friend.id));
    router.refresh();
  };

  const denyFriend = async () => {
    await axios.post('/api/friends/deny', { id: friend.id });

    setFriendRequests(prev => prev.filter(user => user.id !== friend.id));
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4 " key={friend.id}>
      <Icons.UserPlus className="text-black" />
      <p className="text-lg font-medium">{friend.email}</p>
      <button
        className="grid w-8 h-8 bg-indigo-600 rounded-full hover:bg-indigo-700 place-items-center"
        aria-label="accept friend"
        onClick={acceptFriend}
      >
        <Icons.Check className="w-3/4 font-semibold text-white h-3/4" />
      </button>
      <button
        className="grid w-8 h-8 bg-red-600 rounded-full hover:bg-red-700 place-items-center"
        aria-label="deny friend"
        onClick={denyFriend}
      >
        <Icons.X className="w-3/4 font-semibold text-white h-3/4" />
      </button>
    </div>
  );
};

export default FriendRequest;
