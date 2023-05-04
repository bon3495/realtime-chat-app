'use client';

import { FC, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { IMessage, User } from '@/types/db';
import SidebarChatItem from '@/components/SidebarChatItem';

interface ISidebarChatListProps {
  listData: User[];
  userId: string;
}

const SidebarChatList: FC<ISidebarChatListProps> = ({
  listData = [],
  userId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages(prev => {
        return prev.filter(msg => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {listData.map(item => {
        return (
          <SidebarChatItem
            friend={item}
            key={item.id}
            unseenMessages={unseenMessages}
            userId={userId}
          />
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
