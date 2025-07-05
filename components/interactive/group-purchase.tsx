'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PriceTier {
  participants: number;
  discount: number;
  price: number;
}

interface GroupPurchase {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  tiers: PriceTier[];
  currentParticipants: number;
  maxParticipants: number;
  timeRemaining: number; // seconds
  isActive: boolean;
  hasJoined: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  joinedAt: Date;
}

interface GroupPurchaseProps {
  groupPurchase: GroupPurchase;
  onJoin: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  onPurchase: (groupId: string) => void;
}

export function GroupPurchase({
  groupPurchase,
  onJoin,
  onLeave,
  onPurchase
}: GroupPurchaseProps) {
  const [timeLeft, setTimeLeft] = useState(groupPurchase.timeRemaining);
  const [currentTier, setCurrentTier] = useState<PriceTier | null>(null);
  const [nextTier, setNextTier] = useState<PriceTier | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    if (!groupPurchase.isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [groupPurchase.isActive, timeLeft]);

  useEffect(() => {
    updateTiers();
    loadParticipants();
  }, [groupPurchase.currentParticipants, groupPurchase.tiers]);

  const updateTiers = () => {
    const { currentParticipants, tiers, originalPrice } = groupPurchase;
    
    // 現在の適用ティア
    const applicableTiers = tiers
      .filter(tier => currentParticipants >= tier.participants)
      .sort((a, b) => b.discount - a.discount);
    
    const current = applicableTiers[0] || null;
    setCurrentTier(current);

    // 次のティア
    const nextTiers = tiers
      .filter(tier => currentParticipants < tier.participants)
      .sort((a, b) => a.participants - b.participants);
    
    const next = nextTiers[0] || null;
    setNextTier(next);
  };

  const loadParticipants = () => {
    // 実際の実装では API コール
    const mockParticipants: Participant[] = Array.from(
      { length: Math.min(groupPurchase.currentParticipants, 10) },
      (_, i) => ({
        id: `user-${i}`,
        name: `ユーザー${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        joinedAt: new Date(Date.now() - i * 60000)
      })
    );
    setParticipants(mockParticipants);
  };

  const getCurrentPrice = () => {
    if (!currentTier) return groupPurchase.originalPrice;
    return Math.floor(groupPurchase.originalPrice * (1 - currentTier.discount / 100));
  };

  const getDiscountAmount = () => {
    return groupPurchase.originalPrice - getCurrentPrice();
  };

  const getProgressPercentage = () => {
    if (!nextTier) return 100;
    return (groupPurchase.currentParticipants / nextTier.participants) * 100;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 300) return 'text-green-600'; // 5分以上
    if (timeLeft > 60) return 'text-yellow-600';  // 1分以上
    return 'text-red-600'; // 1分未満
  };

  return (
    <Card className="p-4 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">👥</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">グループ購入</h3>
          <p className="text-sm text-gray-600">みんなで買うとお得！</p>
        </div>
        {groupPurchase.isActive && (
          <div className="text-right">
            <div className={`font-mono font-bold ${getTimeColor()}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500">残り時間</div>
          </div>
        )}
      </div>

      {/* 商品情報 */}
      <div className="flex gap-3 mb-4">
        <img
          src={groupPurchase.productImage}
          alt={groupPurchase.productName}
          className="w-16 h-16 object-cover rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
          }}
        />
        <div className="flex-1">
          <h4 className="font-semibold line-clamp-2">{groupPurchase.productName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-purple-600">
              ¥{getCurrentPrice().toLocaleString()}
            </span>
            {currentTier && currentTier.discount > 0 && (
              <>
                <span className="text-sm line-through text-gray-500">
                  ¥{groupPurchase.originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {currentTier.discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 参加者数と進捗 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            参加者数: {groupPurchase.currentParticipants}人
          </span>
          {nextTier && (
            <span className="text-sm text-purple-600">
              あと{nextTier.participants - groupPurchase.currentParticipants}人で
              {nextTier.discount}% OFF
            </span>
          )}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* ティアマイルストーン */}
        <div className="flex justify-between text-xs text-gray-600">
          {groupPurchase.tiers.map((tier, index) => (
            <div
              key={index}
              className={`text-center ${
                groupPurchase.currentParticipants >= tier.participants
                  ? 'text-purple-600 font-bold'
                  : ''
              }`}
            >
              <div>{tier.participants}人</div>
              <div>{tier.discount}% OFF</div>
            </div>
          ))}
        </div>
      </div>

      {/* 参加者アバター */}
      {participants.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">参加者</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowParticipants(!showParticipants)}
              className="text-xs"
            >
              {showParticipants ? '隠す' : 'すべて見る'}
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            {participants.slice(0, showParticipants ? participants.length : 6).map((participant) => (
              <img
                key={participant.id}
                src={participant.avatar}
                alt={participant.name}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                title={participant.name}
              />
            ))}
            {!showParticipants && participants.length > 6 && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                +{participants.length - 6}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 割引効果 */}
      {currentTier && currentTier.discount > 0 && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <div>
              <p className="font-semibold text-green-800">
                ¥{getDiscountAmount().toLocaleString()} お得！
              </p>
              <p className="text-xs text-green-600">
                通常価格から {currentTier.discount}% 割引適用中
              </p>
            </div>
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div className="space-y-2">
        {!groupPurchase.hasJoined ? (
          <Button
            onClick={() => onJoin(groupPurchase.id)}
            disabled={!groupPurchase.isActive || timeLeft <= 0}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
          >
            {timeLeft <= 0 ? '募集終了' : 'グループに参加'}
          </Button>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={() => onPurchase(groupPurchase.id)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500"
            >
              ¥{getCurrentPrice().toLocaleString()} で購入
            </Button>
            {onLeave && (
              <Button
                onClick={() => onLeave(groupPurchase.id)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                グループから退出
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 注意事項 */}
      <div className="mt-3 text-xs text-gray-500 space-y-1">
        <p>• グループ購入は時間制限があります</p>
        <p>• 最小催行人数に達しない場合はキャンセルされます</p>
        <p>• 決済は個別に行われます</p>
      </div>

      {/* 成功エフェクト */}
      {nextTier && groupPurchase.currentParticipants >= nextTier.participants && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-yellow-400 opacity-20 animate-pulse rounded-lg" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-4xl animate-bounce">🎉</div>
          </div>
        </div>
      )}
    </Card>
  );
}