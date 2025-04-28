'use client';

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Gallery Guess</h1>
        
        <p className="text-lg mb-8 text-gray-600">
          Test your art knowledge with paintings from the Metropolitan Museum of Art&apos;s collection. 
          Identify famous artworks, climb the levels, and compete for high scores!
        </p>
        
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
        
        <div className="flex justify-center">
          <Link 
            href={user ? "/game" : "/login"} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
          >
            {user ? "Start Playing" : "Sign In to Play"}
          </Link>
        </div>
      </div>
    </main>
  );
}
