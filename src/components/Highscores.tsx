'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface HighScore {
  nickname: string;
  score: number;
}

export default function Highscores() {
  const [highscores, setHighscores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHighscores = async () => {
      try {
        setLoading(true);
        // First find the maximum score per user
        const { data: maxScores, error: maxScoresError } = await supabase
          .from('game_scores')
          .select('user_id, score')
          .order('score', { ascending: false });
        
        if (maxScoresError) throw maxScoresError;
        
        // Get unique max scores by user (keeping the highest score per user)
        const uniqueUserScores: Record<string, number> = {};
        maxScores?.forEach(item => {
          if (!uniqueUserScores[item.user_id] || item.score > uniqueUserScores[item.user_id]) {
            uniqueUserScores[item.user_id] = item.score;
          }
        });
        
        // Get user profiles for those users
        const userIds = Object.keys(uniqueUserScores);
        if (userIds.length === 0) {
          setHighscores([]);
          setLoading(false);
          return;
        }
        
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('user_id, nickname')
          .in('user_id', userIds);
          
        if (profilesError) throw profilesError;
        
        // Map profiles to scores
        const formattedData: HighScore[] = profiles?.map(profile => ({
          nickname: profile.nickname,
          score: uniqueUserScores[profile.user_id]
        })) || [];
        
        // Sort by score (highest first)
        formattedData.sort((a, b) => b.score - a.score);
        
        // Take only top 10
        setHighscores(formattedData.slice(0, 10));
      } catch (error) {
        console.error('Error fetching highscores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighscores();
  }, []);

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4 text-center">Highscores</h3>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600 border-solid"></div>
        </div>
      ) : highscores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nickname
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Points
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {highscores.map((score, index) => (
                <tr key={index} className={index < 3 ? "bg-blue-50" : ""}>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {score.nickname}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-bold">
                    {score.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No highscores yet. Be the first to play!</p>
      )}
    </div>
  );
}