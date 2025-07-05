'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  duration: number; // seconds
  startTime: Date;
  reward: {
    type: 'points' | 'coupon' | 'badge';
    amount: number;
    description: string;
  };
  isActive: boolean;
  hasVoted: boolean;
  selectedOption?: string;
}

interface LivePollProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  onClose: () => void;
}

export function LivePoll({ poll, onVote, onClose }: LivePollProps) {
  const [timeLeft, setTimeLeft] = useState(poll.duration);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(poll.hasVoted);
  const [animatingVotes, setAnimatingVotes] = useState<string[]>([]);

  useEffect(() => {
    if (!poll.isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [poll.isActive, timeLeft]);

  useEffect(() => {
    // 投票結果のアニメーション
    if (hasSubmitted) {
      poll.options.forEach((option, index) => {
        setTimeout(() => {
          setAnimatingVotes(prev => [...prev, option.id]);
        }, index * 200);
      });
    }
  }, [hasSubmitted, poll.options]);

  const handleVote = () => {
    if (!selectedOption || hasSubmitted || !poll.isActive) return;
    
    onVote(poll.id, selectedOption);
    setHasSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Card className="fixed bottom-4 right-4 w-80 p-4 bg-white shadow-lg border-2 border-purple-500 z-50">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="font-bold text-sm">ライブ投票</span>
          {poll.isActive && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      {/* タイマー */}
      {poll.isActive && timeLeft > 0 && (
        <div className="mb-3">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>残り時間</span>
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${(timeLeft / poll.duration) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* 質問 */}
      <h3 className="font-bold text-sm mb-3">{poll.question}</h3>

      {/* 選択肢 */}
      <div className="space-y-2 mb-4">
        {poll.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isAnimating = animatingVotes.includes(option.id);
          
          return (
            <div
              key={option.id}
              className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                hasSubmitted
                  ? 'cursor-default'
                  : 'cursor-pointer hover:border-purple-400'
              } ${
                isSelected && !hasSubmitted
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200'
              }`}
              onClick={() => {
                if (!hasSubmitted && poll.isActive) {
                  setSelectedOption(option.id);
                }
              }}
            >
              {/* 投票結果のバー */}
              {hasSubmitted && (
                <div
                  className={`absolute left-0 top-0 h-full bg-gradient-to-r from-purple-100 to-pink-100 transition-all duration-1000 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    width: `${option.percentage}%`,
                    transitionDelay: isAnimating ? '0ms' : '200ms'
                  }}
                />
              )}
              
              <div className="relative p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {!hasSubmitted && (
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  )}
                  <span className="text-sm font-medium">{option.text}</span>
                </div>
                
                {hasSubmitted && (
                  <div className="text-right">
                    <div className="text-sm font-bold">{option.percentage}%</div>
                    <div className="text-xs text-gray-500">{option.votes}票</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 投票ボタン / 結果表示 */}
      {!hasSubmitted ? (
        <Button
          onClick={handleVote}
          disabled={!selectedOption || !poll.isActive || timeLeft <= 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
        >
          {timeLeft <= 0 ? '投票終了' : '投票する'}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="text-center text-sm">
            <p className="font-semibold text-green-600">投票完了！</p>
            <p className="text-xs text-gray-500">総投票数: {totalVotes}票</p>
          </div>
          
          {/* 報酬表示 */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎁</span>
              <div className="text-sm">
                <p className="font-semibold">報酬ゲット！</p>
                <p className="text-xs">{poll.reward.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 投票終了時の最終結果 */}
      {timeLeft <= 0 && hasSubmitted && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">投票が終了しました</p>
          <div className="mt-2">
            {poll.options
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 1)
              .map((winner) => (
                <div key={winner.id} className="flex items-center justify-center gap-2">
                  <span className="text-lg">🏆</span>
                  <span className="text-sm font-bold">{winner.text}</span>
                  <span className="text-xs">({winner.percentage}%)</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  );
}