'use client';

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Highscores from "@/components/Highscores";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center max-w-4xl mx-auto">
        {/* Cover Image Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-12 shadow-xl">
          <div className="aspect-[16/9] relative">
            <Image 
              src="/cover-image.svg"
              alt="Gallery Guess - Test your art knowledge"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/50 to-transparent flex flex-col items-start justify-center p-8 md:p-12">
              <div className="max-w-xl text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Gallery Guess</h1>
                <p className="text-lg md:text-xl mb-6 text-white/90 drop-shadow">
                  Test your knowledge of the world's greatest artworks from the Metropolitan Museum collection
                </p>
                <Link 
                  href={user ? "/game" : "/login"} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium inline-block transition-all duration-200 hover:scale-105"
                >
                  {user ? "Start Playing" : "Sign In to Play"}
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <div className="bg-gray-50 rounded-lg p-6 shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">How to play</h2>
            <ul className="text-left space-y-3">
              <li className="flex items-start">
                <span className="mr-2 font-bold text-blue-600">1.</span>
                <span>A random painting from the Metropolitan Museum of Art will be displayed.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-blue-600">2.</span>
                <span>Select the correct title of the painting from multiple choices.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-blue-600">3.</span>
                <span>Every correct guess increases your score by 1 point.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-blue-600">4.</span>
                <span>One wrong guess ends the game. How many paintings can you identify?</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Highscores Section */}
        <div className="mb-12">
          <Highscores />
        </div>
      </div>
    </main>
  );
}
