'use client';

import { FC, useState } from 'react';
import Link from 'next/link';

import { Icons } from '@/components/Icons';
import UnseenCounts from '@/components/ui/UnseenCounts';

interface IFriendRequestsSidebarOptionsProps {
  initialUnseenRequestCount: number;
  sessionId: string;
}

const FriendRequestsSidebarOptions: FC<IFriendRequestsSidebarOptionsProps> = ({
  initialUnseenRequestCount,
  sessionId,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState(
    initialUnseenRequestCount
  );

  return (
    <Link
      href="/dashboard/requests"
      className="flex items-center p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3"
    >
      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white transition-all">
        <Icons.User className="w-4 h-4" />
      </span>
      <span className="truncate">Friend Requests</span>

      {unseenRequestCount > 0 ? (
        <UnseenCounts>{unseenRequestCount}</UnseenCounts>
      ) : null}
    </Link>
  );
};

export default FriendRequestsSidebarOptions;
