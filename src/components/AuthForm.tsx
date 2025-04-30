'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthFormProps {
  onSubmit: (email: string, password: string, nickname?: string) => Promise<void>;
  submitText: string;
  isLogin?: boolean;
}

export default function AuthForm({ onSubmit, submitText, isLogin = false }: AuthFormProps) {
  const { checkNicknameUniqueness } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Nickname validation state
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  
  // Debounce nickname check to avoid too many API calls
  useEffect(() => {
    if (!nickname || isLogin) {
      setIsNicknameAvailable(null);
      setNicknameError(null);
      return;
    }
    
    const nicknameTimeout = setTimeout(async () => {
      try {
        setIsCheckingNickname(true);
        const available = await checkNicknameUniqueness(nickname);
        setIsNicknameAvailable(available);
        if (!available) {
          setNicknameError('This nickname is already taken');
        } else {
          setNicknameError(null);
        }
      } catch {
        setNicknameError('Error checking nickname availability');
      } finally {
        setIsCheckingNickname(false);
      }
    }, 500);
    
    return () => clearTimeout(nicknameTimeout);
  }, [nickname, isLogin, checkNicknameUniqueness]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // For registration, validate nickname before submission
    if (!isLogin && (nicknameError || !isNicknameAvailable)) {
      setError('Please choose an available nickname');
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        await onSubmit(email, password);
      } else {
        await onSubmit(email, password, nickname);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={loading}
        />
      </div>

      {!isLogin && (
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium">
            Nickname
          </label>
          <div className="relative">
            <input
              id="nickname"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                nicknameError 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : isNicknameAvailable 
                    ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              } rounded-md shadow-sm focus:outline-none`}
              disabled={loading}
            />
            {isCheckingNickname && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-600 border-solid"></div>
              </div>
            )}
            {!isCheckingNickname && isNicknameAvailable === true && nickname && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {nicknameError && (
            <p className="mt-1 text-xs text-red-600">{nicknameError}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">This will be displayed to other users</p>
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={loading || (!isLogin && !!nickname && (isCheckingNickname || isNicknameAvailable === false))}
      >
        {loading ? 'Loading...' : submitText}
      </button>

      {isLogin ? (
        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-500">
            Register
          </a>
        </p>
      ) : (
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:text-indigo-500">
            Login
          </a>
        </p>
      )}
    </form>
  );
}