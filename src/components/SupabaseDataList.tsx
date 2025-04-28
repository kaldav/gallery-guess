'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

type DataItem = {
  id: number;
  name: string;
  created_at: string;
  // Add more fields based on your table schema
};

export default function SupabaseDataList() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Replace 'your_table_name' with your actual table
        const { data, error } = await supabase
          .from('your_table_name')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setData(data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading data...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Data from Supabase</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No data found. Make sure you have created a table in your Supabase project and updated the table name in this component.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.id} className="border-b pb-2">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}