'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { signUp, user, isLoading } = useAuth();
  
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleRegister = async (email: string, password: string) => {
    const { error } = await signUp(email, password);
    if (error) {
      throw new Error(error.message);
    }
    // After successful signup, the user will either be automatically logged in
    // or need to verify their email (depending on your Supabase settings)
    router.push('/login?message=Please%20check%20your%20email%20to%20verify%20your%20account');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="mt-8">
          <AuthForm 
            onSubmit={handleRegister}
            submitText="Sign Up"
            isLogin={false}
          />
        </div>
      </div>
    </div>
  );
}