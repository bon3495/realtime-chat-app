import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { IMessage, User } from '@/types/db';
import ChatInput from '@/components/ChatInput';
import ChatMessages from '@/components/ChatMessages';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  messageArrayValidator,
  MessageValidator,
} from '@/lib/validation/message.validate';
import { fetchRedis } from '@/helpers/redis';

const CHAT_ID = 'chatId';

async function getChatMessages(chatId: string): Promise<MessageValidator[]> {
  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map(message => JSON.parse(message) as IMessage);
    const reversedDbMessages = dbMessages.reverse();
    return messageArrayValidator.parse(reversedDbMessages);
  } catch (error) {
    notFound();
  }
}

interface IChatPageProps {
  params: Record<typeof CHAT_ID, string> | null;
}

const page = async ({ params }: IChatPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();
  const { chatId } = params || {};
  const { user } = session;

  const [userIdOne, userIdTwo] = chatId?.split('--') as [string, string];

  if (user.id !== userIdOne && user.id !== userIdTwo) notFound();

  const chatPartnerId = user.id === userIdOne ? userIdTwo : userIdOne;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;
  const initialMessages = await getChatMessages(chatId || '');

  return (
    <main className="flex flex-col flex-1 h-full">
      <div className="flex justify-between h-20 px-6 border-b-2 border-gray-200 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 h-8 sm:w-12 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image || ''}
                alt={`${chatPartner.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center text-xl">
              <span className="mr-3 font-semibold text-gray-700">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <ChatMessages
          initialMessages={initialMessages}
          sessionId={session.user.id}
          sessionImage={session.user.image || ''}
          chatPartner={chatPartner}
        />
        <ChatInput chatPartner={chatPartner} chatId={chatId} />
      </div>
    </main>
  );
};

export default page;
