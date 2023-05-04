'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IMessage, User } from '@/types/db';
import UnseenCounts from '@/components/ui/UnseenCounts';
import { chatHrefConstructor } from '@/lib/utils';

interface ISidebarChatItemProps {
  friend: User;
  unseenMessages: IMessage[];
  userId: string;
}

const SidebarChatItem: FC<ISidebarChatItemProps> = ({
  friend,
  unseenMessages,
  userId,
}) => {
  const unseenMessagesCount = unseenMessages.filter(
    unseenMsg => unseenMsg.senderId === friend.id
  ).length;

  return (
    <li>
      <Link
        href={`/dashboard/chat/${chatHrefConstructor(userId, friend.id)}`}
        className="flex items-center gap-3 p-2 text-sm font-semibold leading-6 text-gray-700 transition-all rounded-md hover:text-indigo-600 hover:bg-gray-50 group"
      >
        <span className="relative w-8 h-8 bg-gray-50">
          <Image
            fill
            referrerPolicy="no-referrer"
            className="rounded-full"
            src={friend.image || ''}
            alt="Your profile picture"
          />
        </span>
        <span className="truncate">{friend.name}</span>

        {unseenMessagesCount > 0 ? (
          <UnseenCounts>{unseenMessagesCount}</UnseenCounts>
        ) : null}
      </Link>
    </li>
  );
};

export default SidebarChatItem;
