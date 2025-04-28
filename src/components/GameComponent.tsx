'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { MetPainting, getRandomPainting, getQuizOptions, formatPaintingDetails } from '@/utils/metApi';
import { supabase } from '@/utils/supabase';

export default function GameComponent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentPainting, setCurrentPainting] = useState<MetPainting | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Start a new game
  const startGame = async () => {
    setLoading(true);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    
    try {
      await loadNextPainting();
    } catch {
      setError('Failed to start game. Please try again.');
      setGameStarted(false);
      setLoading(false);
    }
  };

  // Load the next painting for the game
  const loadNextPainting = async () => {
    setLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    
    try {
      const painting = await getRandomPainting();
      setCurrentPainting(painting);
      
      const quizOptions = await getQuizOptions(painting);
      setOptions(quizOptions);
      
      setLoading(false);
    } catch {
      setError('Failed to load painting. Please try again.');
      setLoading(false);
    }
  };

  // Handle option selection
  const handleOptionSelect = async (option: string) => {
    if (selectedOption || !currentPainting) return;
    
    setSelectedOption(option);
    const correctAnswer = formatPaintingDetails(currentPainting);
    const correct = option === correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      // Increase score
      setScore(prevScore => prevScore + 1);
      
      // Wait 2 seconds before loading the next painting
      setTimeout(() => {
        loadNextPainting();
      }, 2000);
    } else {
      // Game over
      setGameOver(true);
      
      // Save the score to Supabase if user is logged in
      if (user) {
        try {
          await supabase.from('game_scores').insert({
            user_id: user.id,
            score: score,
            played_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error('Failed to save score:', err);
        }
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {!gameStarted ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Gallery Guess</h1>
          <p className="mb-6 text-gray-600">
            Test your art knowledge! Guess the artist, name, and year of the painting to advance to the next level.
          </p>
          <button
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Start Game
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mt-4"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Gallery Guess</h2>
            <div className="text-xl font-semibold">Score: {score}</div>
          </div>
          
          {currentPainting && (
            <div className="mb-8">
              <div className="aspect-w-16 aspect-h-9 mb-4 relative h-96">
                <Image
                  src={currentPainting.primaryImage}
                  alt="Mystery painting"
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain rounded-lg shadow-lg"
                />
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Who created this artwork, what is it called, and when was it made?</h3>
              
              <div className="grid gap-3">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={selectedOption !== null}
                    className={`p-3 rounded-lg border text-left ${
                      selectedOption === option
                        ? option === formatPaintingDetails(currentPainting)
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : selectedOption && option === formatPaintingDetails(currentPainting)
                        ? 'bg-green-100 border-green-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {isCorrect === true && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                  Correct! Loading next painting...
                </div>
              )}
              
              {isCorrect === false && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
                  Incorrect! The correct answer was {formatPaintingDetails(currentPainting)}.
                </div>
              )}
              
              {gameOver && (
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
                  <p className="mb-4">Your score: {score}</p>
                  <button
                    onClick={startGame}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}