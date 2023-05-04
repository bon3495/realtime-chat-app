'use client';

import { FC, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/Button';
import {
  AddFriendValidator,
  addFriendValidator,
} from '@/lib/validation/add-friend';

interface IAddFriendButtonProps {}

const AddFriendButton: FC<IAddFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<AddFriendValidator>({
    resolver: zodResolver(addFriendValidator),
    defaultValues: {
      email: '',
    },
  });

  const addFriend = async (data: AddFriendValidator) => {
    try {
      const { email } = data;
      const { email: validatedEmail } = addFriendValidator.parse({ email });

      await axios.post('/api/friends/add', {
        email: validatedEmail,
      });

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError('email', {
          message: error.response?.data,
        });
      }
    }
  };

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(addFriend)}>
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by E-mail
      </label>
      <div className="flex gap-4 mt-2">
        <input
          {...register('email')}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none transition-all"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
      {errors.email && (
        <span className="block mt-1 text-xs text-red-600">
          {errors.email.message}
        </span>
      )}
      {showSuccessState && (
        <span className="block mt-1 text-xs text-green-600">
          Friend request sent!
        </span>
      )}
    </form>
  );
};

export default AddFriendButton;
