'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';

interface GameScore {
  id: string;
  user_id: string;
  score: number;
  played_at: string;
}

export default function ScoreHistory() {
  const { user } = useAuth();
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const fetchScores = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('game_scores')
          .select('*')
          .eq('user_id', user.id)
          .order('played_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setScores(data || []);
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h3 className="text-xl font-semibold mb-4">Your Score History</h3>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600 border-solid"></div>
        </div>
      ) : scores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scores.map((score) => (
                <tr key={score.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(score.played_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {score.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No game history yet. Start playing to record scores!</p>
      )}
    </div>
  );
}