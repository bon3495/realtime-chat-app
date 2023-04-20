'use client';

import { ButtonHTMLAttributes, FC, useState } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

import { Icons } from '@/components/Icons';
import Button from '@/components/ui/Button';

interface ISignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<ISignOutButtonProps> = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      toast.error('There was a problem signing out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button {...props} onClick={handleSignOut} variant="ghost">
      {isLoading ? (
        <Icons.Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icons.LogOut className="w-4 h-4" />
      )}
    </Button>
  );
};

export default SignOutButton;
