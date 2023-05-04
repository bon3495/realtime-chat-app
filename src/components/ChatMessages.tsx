'use client';

import { FC, useRef, useState } from 'react';
import Image from 'next/image';
import format from 'date-fns/format';

import { User } from '@/types/db';
import { cn } from '@/lib/utils';
import { MessageValidator } from '@/lib/validation/message.validate';

interface IChatMessagesProps {
  initialMessages: MessageValidator[];
  sessionId: string;
  chatPartner: User;
  sessionImage: string;
}

const ChatMessages: FC<IChatMessagesProps> = ({
  initialMessages,
  sessionId,
  chatPartner,
  sessionImage,
}) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<MessageValidator[]>(initialMessages);

  const formatTime = (timestamp: number) => {
    return format(timestamp, 'HH:mm');
  };

  return (
    <div
      id="messages"
      className="flex flex-col-reverse flex-1 h-full gap-4 p-3 overflow-y-auto scrolling-touch scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;

        const hasNextMessageFromSameUser =
          messages[index]?.senderId === messages[index - 1]?.senderId;
        return (
          <div key={`${message.id}-${message.timestamp}`} id="chat-message">
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}
            >
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-indigo-600 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rouded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{' '}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={isCurrentUser ? sessionImage : chatPartner.image}
                  referrerPolicy="no-referrer"
                  alt={`Your profile picture`}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
