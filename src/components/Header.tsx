'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Gallery Guess
          </Link>
          
          <nav>
            <ul className="flex space-x-4">
              {user ? (
                <>
                  <li>
                    <Link 
                      href="/game"
                      className="text-blue-600 hover:underline"
                    >
                      Play Game
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-600">
                      {user.profile?.nickname || user.email}
                    </span>
                  </li>
                  <li>
                    <button 
                      onClick={() => signOut()}
                      className="text-blue-600 hover:underline"
                    >
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/login" 
                      className="text-blue-600 hover:underline"
                    >
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/register" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}