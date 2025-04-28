'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { signUp, user, isLoading } = useAuth();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleRegister = async (email: string, password: string) => {
    try {
      const { error } = await signUp(email, password);
      if (error) {
        throw new Error(error.message);
      }
      // Instead of redirecting, set the registration success state
      setRegistrationSuccess(true);
    } catch (error: Error | unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(errorMessage);
    }
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
        
        {registrationSuccess ? (
          <div className="mt-8 text-center">
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Registration Successful</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Please check your email to confirm your account before logging in.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <AuthForm 
              onSubmit={handleRegister}
              submitText="Sign Up"
              isLogin={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}