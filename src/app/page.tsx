'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import SupabaseDataList from "@/components/SupabaseDataList";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkSupabaseConnection() {
      setIsLoading(true);
      try {
        // This is just a simple check to see if Supabase is connected
        // You would typically query your actual tables here
        const { data, error } = await supabase
          .from('your_table_name') // Replace with an actual table from your Supabase project
          .select('*')
          .limit(1);
        
        if (error) {
          setMessage('Connection error: ' + error.message);
        } else {
          setMessage('Successfully connected to Supabase!');
        }
      } catch (err) {
        setMessage('Connection issue: Make sure your .env.local file is set up with proper Supabase credentials');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkSupabaseConnection();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl mx-auto">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        {/* Supabase Connection Status */}
        <div className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-2">Supabase Connection Status</h2>
          {isLoading ? (
            <p className="text-sm">Checking connection...</p>
          ) : (
            <p className="text-sm">{message}</p>
          )}
          <div className="mt-4 text-xs">
            <p className="font-semibold">Next steps:</p>
            <ol className="list-decimal pl-4 mt-1">
              <li>Update your .env.local file with your Supabase credentials</li>
              <li>Create tables in your Supabase project</li>
              <li>Update the query in this component to use your actual table name</li>
            </ol>
          </div>
        </div>
        
        {/* Supabase Data List Component */}
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Example Data Component</h2>
          <SupabaseDataList />
        </div>

        <div className="w-full mt-8">
          <h2 className="text-xl font-bold mb-4">Next.js Template Info</h2>
          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                src/app/page.tsx
              </code>
              .
            </li>
            <li className="tracking-[-.01em]">
              Save and see your changes instantly.
            </li>
          </ol>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
