'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { signIn, user, isLoading } = useAuth();
  
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) {
      throw new Error(error.message);
    }
    // The router redirect will happen automatically thanks to the useEffect
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8">
          <AuthForm 
            onSubmit={handleLogin}
            submitText="Sign In"
            isLogin={true}
          />
        </div>
      </div>
    </div>
  );
}