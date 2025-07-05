'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UserStats {
  points: number;
  level: number;
  experiencePoints: number;
  experienceToNext: number;
  badges: Badge[];
  streak: number;
  totalWatchTime: number;
  totalPurchases: number;
  totalShares: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: {
    points: number;
    badge?: Badge;
  };
  isNew?: boolean;
}

interface GamificationSystemProps {
  userId: string;
  isVisible: boolean;
  onClose: () => void;
}

export function GamificationSystem({ userId, isVisible, onClose }: GamificationSystemProps) {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 2450,
    level: 8,
    experiencePoints: 750,
    experienceToNext: 1000,
    badges: [],
    streak: 7,
    totalWatchTime: 1440, // minutes
    totalPurchases: 12,
    totalShares: 28
  });

  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    loadUserStats();
    loadRecentAchievements();
  }, [userId]);

  const loadUserStats = async () => {
    // 実際の実装では API コール
    const mockBadges: Badge[] = [
      {
        id: 'first-viewer',
        name: '初心者',
        description: '初回視聴完了',
        icon: '👶',
        rarity: 'common',
        unlockedAt: new Date('2024-12-01')
      },
      {
        id: 'regular-viewer',
        name: '常連',
        description: '10回視聴達成',
        icon: '⭐',
        rarity: 'rare',
        unlockedAt: new Date('2024-12-15')
      },
      {
        id: 'fashionista',
        name: 'ファッショニスタ',
        description: 'ファッションカテゴリで5回購入',
        icon: '👗',
        rarity: 'epic',
        unlockedAt: new Date('2024-12-20')
      }
    ];

    setUserStats(prev => ({ ...prev, badges: mockBadges }));
  };

  const loadRecentAchievements = async () => {
    const mockAchievements: Achievement[] = [
      {
        id: 'week-streak',
        title: '7日連続視聴',
        description: '1週間連続でライブを視聴しました',
        icon: '🔥',
        reward: { points: 100 },
        isNew: true
      },
      {
        id: 'social-butterfly',
        title: 'ソーシャルバタフライ',
        description: '10回シェアを達成',
        icon: '🦋',
        reward: { 
          points: 200,
          badge: {
            id: 'social-master',
            name: 'シェアマスター',
            description: '多くの人にLivitを広めた',
            icon: '📢',
            rarity: 'rare'
          }
        },
        isNew: true
      }
    ];

    setRecentAchievements(mockAchievements);
  };

  const getLevelInfo = () => {
    const levels = [
      { level: 1, title: 'ビギナー', minExp: 0 },
      { level: 2, title: 'ウォッチャー', minExp: 100 },
      { level: 3, title: 'ファン', minExp: 300 },
      { level: 4, title: 'サポーター', minExp: 600 },
      { level: 5, title: 'エンスージアスト', minExp: 1000 },
      { level: 6, title: 'コレクター', minExp: 1500 },
      { level: 7, title: 'インフルエンサー', minExp: 2100 },
      { level: 8, title: 'アンバサダー', minExp: 2800 },
      { level: 9, title: 'レジェンド', minExp: 3600 },
      { level: 10, title: 'マスター', minExp: 4500 }
    ];

    return levels.find(l => l.level === userStats.level) || levels[0];
  };

  const getProgressPercentage = () => {
    return (userStats.experiencePoints / userStats.experienceToNext) * 100;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const claimAchievement = (achievementId: string) => {
    const achievement = recentAchievements.find(a => a.id === achievementId);
    if (!achievement) return;

    // ポイント追加
    setUserStats(prev => ({
      ...prev,
      points: prev.points + achievement.reward.points
    }));

    // バッジ追加
    if (achievement.reward.badge) {
      setUserStats(prev => ({
        ...prev,
        badges: [...prev.badges, achievement.reward.badge!]
      }));
    }

    // 達成通知を削除
    setRecentAchievements(prev => prev.filter(a => a.id !== achievementId));
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 3000);
  };

  if (!isVisible) return null;

  return (
    <>
      <Card className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">🎮 マイプロフィール</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          {/* ユーザーレベル */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="text-3xl">🏆</div>
              <div>
                <h3 className="font-bold text-lg">Level {userStats.level}</h3>
                <p className="text-sm text-gray-600">{getLevelInfo().title}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-bold text-lg text-purple-600">{userStats.points.toLocaleString()}</p>
                <p className="text-xs text-gray-600">ポイント</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>経験値</span>
                <span>{userStats.experiencePoints} / {userStats.experienceToNext}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold text-lg">{userStats.streak}</div>
              <div className="text-xs text-gray-600">連続視聴日数</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">⏰</div>
              <div className="font-bold text-lg">{Math.floor(userStats.totalWatchTime / 60)}h</div>
              <div className="text-xs text-gray-600">総視聴時間</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🛍️</div>
              <div className="font-bold text-lg">{userStats.totalPurchases}</div>
              <div className="text-xs text-gray-600">購入回数</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">📤</div>
              <div className="font-bold text-lg">{userStats.totalShares}</div>
              <div className="text-xs text-gray-600">シェア回数</div>
            </div>
          </div>

          {/* 新しい達成項目 */}
          {recentAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3">🎉 新しい達成項目</h3>
              <div className="space-y-2">
                {recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-green-600 font-semibold">
                          +{achievement.reward.points}ポイント
                          {achievement.reward.badge && ' + バッジ'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => claimAchievement(achievement.id)}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        受取
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* バッジコレクション */}
          <div>
            <h3 className="font-bold mb-3">🏅 バッジコレクション</h3>
            {userStats.badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {userStats.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`text-center p-3 rounded-lg ${getRarityColor(badge.rarity)}`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="font-bold text-xs">{badge.name}</div>
                    <div className="text-xs opacity-75">{badge.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                まだバッジがありません<br />
                ライブを視聴してバッジをゲットしよう！
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* 達成通知 */}
      {showAchievement && (
        <div className="fixed top-4 right-4 z-60 bg-green-500 text-white p-4 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎉</span>
            <span className="font-bold">達成項目をゲット！</span>
          </div>
        </div>
      )}

      {/* レベルアップ通知 */}
      {showLevelUp && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-lg shadow-xl text-center animate-pulse">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold mb-1">レベルアップ！</h2>
            <p className="text-lg">Level {userStats.level}</p>
            <p className="text-sm opacity-90">{getLevelInfo().title}</p>
          </div>
        </div>
      )}
    </>
  );
}