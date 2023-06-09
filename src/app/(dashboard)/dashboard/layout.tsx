import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import FriendRequestsSidebarOptions from '@/components/FriendRequestsSidebarOptions';
import { Icon, Icons } from '@/components/Icons';
import SidebarChatList from '@/components/SidebarChatList';
import SignOutButton from '@/components/SignOutButton';
import { authOptions } from '@/lib/auth';
import { getFriendsByUserId } from '@/helpers/get-friends-by-userId';
import { fetchRedis } from '@/helpers/redis';

type SidebarOptions = {
  id: number;
  name: string;
  href: string;
  icon: Icon;
};

const sidebarOptions: SidebarOptions[] = [
  {
    id: 1,
    name: 'Add Friend',
    href: '/dashboard/add',
    icon: 'UserPlus',
  },
];

interface ILayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: ILayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const friends = (await getFriendsByUserId(session.user.id)) || [];

  const unseenRequestCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_request`
    )) as string[]
  ).length;

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col w-full h-full max-w-xs px-6 overflow-y-auto bg-white border-r border-gray-200 grow gap-y-5">
        <Link href="/dashboard" className="flex items-center h-16 shrink-0">
          <Icons.Logo className="w-auto h-8 text-indigo-600" />
        </Link>
        {friends?.length > 0 ? (
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Your Chats
          </div>
        ) : null}

        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col flex-1 gap-y-7">
            <li>
              <SidebarChatList listData={friends} userId={session.user.id} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>

              <ul role="list" className="mt-2 -mx-2 space-y-1">
                {sidebarOptions.map(option => {
                  const Icon = Icons[option.icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="flex gap-3 p-2 text-sm font-semibold leading-6 text-gray-700 transition-all rounded-md hover:text-indigo-600 hover:bg-gray-50 group"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 border flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium bg-white transition-all">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}

                <li>
                  <FriendRequestsSidebarOptions
                    initialUnseenRequestCount={unseenRequestCount}
                    sessionId={session.user.id}
                  />
                </li>
              </ul>
            </li>

            <li className="flex items-center mt-auto -mx-6">
              <div className="flex items-center flex-1 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 gap-x-4">
                <div className="relative w-8 h-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ''}
                    alt="Your profile picture"
                  />
                </div>
                <span className="sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
                <SignOutButton className="ml-auto" />
              </div>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default Layout;
