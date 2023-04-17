'use client';

import { FC, useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { IconGoogle } from '@/assets/icons';

interface ILoginPageProps {}

const LoginPage: FC<ILoginPageProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Create a function handle login google with next-auth/react
   */
  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      // display error message to user
      toast.error('Something went wrong with your login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            LOGO
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <Button
            isLoading={isLoading}
            type="button"
            className="w-full max-w-sm mx-auto"
            onClick={handleLoginWithGoogle}
          >
            {isLoading ? null : <IconGoogle />}
            <span>Google</span>
          </Button>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
