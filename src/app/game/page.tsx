'use client';

import { useAuth } from "@/context/AuthContext";
import GameComponent from "@/components/GameComponent";
import ScoreHistory from "@/components/ScoreHistory";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GamePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }

  // Only show game if user is authenticated
  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <>
          <GameComponent />
          <ScoreHistory />
        </>
      ) : (
        <div className="text-center py-10">
          <p>Please log in to play the game</p>
        </div>
      )}
    </div>
  );
}