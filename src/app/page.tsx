'use client';

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        
        {/* Main content area - to be filled later */}
        <div className="min-h-[400px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Main content will be added later</p>
        </div>
      </div>
    </main>
  );
}
