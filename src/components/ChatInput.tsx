'use client';

import React, { FC, TextareaHTMLAttributes, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';

import { User } from '@/types/db';
import { Icons } from '@/components/Icons';
import Button from '@/components/ui/Button';
import {
  ChatInputValidator,
  chatInputValidator,
} from '@/lib/validation/chat-input.validate';

interface IChatInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  chatPartner: User;
  chatId: string | undefined;
}

const ChatInput: FC<IChatInputProps> = ({ chatPartner, chatId }) => {
  const { handleSubmit, control, setFocus, reset } =
    useForm<ChatInputValidator>({
      resolver: zodResolver(chatInputValidator),
      defaultValues: {
        text: '',
      },
    });

  const { field } = useController({
    control,
    name: 'text',
  });

  const onSubmit = async (data: ChatInputValidator) => {
    try {
      const { text } = data;
      await axios.post('/api/message/send', {
        text,
        chatId,
      });
      reset();
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div
      className="px-6 py-6 mb-2 border-t border-gray-200 sm:mb-0"
      onClick={() => setFocus('text')}
    >
      <form
        className="relative flex items-end flex-1 gap-x-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextareaAutosize
          {...field}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 sm:py-1.5 sm:text-sm sm:leading-6 rounded-[20px] shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 overflow-hidden transition-all"
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={`Message ${chatPartner.name}`}
        />
        <Button
          variant="ghost"
          className="p-2 text-gray-900 rounded-full h-9"
          type="submit"
        >
          <Icons.Logo className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
