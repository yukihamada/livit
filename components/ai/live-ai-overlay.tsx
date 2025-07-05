'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ARTryOn } from './ar-try-on';
import { RecommendationEngine } from './recommendation-engine';
import { Product } from '@/types/common';

interface LiveAIOverlayProps {
  streamId: string;
  products: Product[];
  currentProduct?: Product;
  onProductSelect: (product: Product) => void;
  onPurchase: (product: Product) => void;
}

export function LiveAIOverlay({
  streamId,
  products,
  currentProduct,
  onProductSelect,
  onPurchase
}: LiveAIOverlayProps) {
  const [showARTryOn, setShowARTryOn] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  useEffect(() => {
    // ライブ配信中のAIインサイトを生成
    generateAIInsights();
  }, [currentProduct, streamId]);

  const generateAIInsights = async () => {
    if (!currentProduct) return;

    // AI分析によるインサイト生成（シミュレーション）
    const insights = [
      `この商品は過去30日で${Math.floor(Math.random() * 1000 + 500)}回視聴されています`,
      `同じカテゴリの商品と比べて${Math.floor(Math.random() * 30 + 10)}%高い関心度`,
      `${currentProduct.category === 'clothing' ? 'Sサイズ' : currentProduct.category === 'makeup' ? '01番カラー' : 'ゴールド'}が最も人気です`,
      `視聴者の${Math.floor(Math.random() * 40 + 60)}%がこの価格帯を好みます`
    ];

    setAiInsights(insights);
  };

  const handleARCapture = (imageData: string) => {
    setCapturedImages(prev => [...prev, imageData]);
    
    // 撮影した画像をSNSシェア用に保存
    const link = document.createElement('a');
    link.download = `vibe-tryson-${Date.now()}.png`;
    link.href = imageData;
    link.click();
  };

  const canTryOn = currentProduct && 
    ['clothing', 'accessories', 'makeup'].includes(currentProduct.category);

  return (
    <div className="absolute top-4 right-4 w-80 space-y-4 z-10">
      {/* AI インサイトパネル */}
      <Card className="p-4 bg-white/90 backdrop-blur-sm">
        <h3 className="font-bold text-sm mb-2">🤖 AIインサイト</h3>
        <div className="space-y-1 text-xs text-gray-600">
          {aiInsights.map((insight, index) => (
            <p key={index}>• {insight}</p>
          ))}
        </div>
      </Card>

      {/* 現在の商品情報 */}
      {currentProduct && (
        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="flex gap-3">
            <img
              src={currentProduct.imageUrl}
              alt={currentProduct.name}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm line-clamp-2">{currentProduct.name}</h3>
              <p className="text-xs text-gray-600">{currentProduct.brand}</p>
              <p className="font-bold text-sm">¥{(currentProduct.price || currentProduct.originalPrice || 0).toLocaleString()}</p>
              
              <div className="flex gap-2 mt-2">
                {canTryOn && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowARTryOn(true)}
                    className="text-xs px-2 py-1"
                  >
                    AR試着
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => onPurchase(currentProduct)}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  購入
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* レコメンデーション */}
      {showRecommendations && (
        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">関連商品</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRecommendations(false)}
              className="text-xs"
            >
              ✕
            </Button>
          </div>
          
          <RecommendationEngine
            context="live"
            currentProduct={currentProduct}
            maxItems={3}
            onProductClick={onProductSelect}
          />
        </Card>
      )}

      {/* 撮影した画像プレビュー */}
      {capturedImages.length > 0 && (
        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <h3 className="font-bold text-sm mb-2">📸 撮影した画像</h3>
          <div className="grid grid-cols-2 gap-2">
            {capturedImages.slice(-4).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`試着画像 ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-2 text-xs"
            onClick={() => {
              // SNSシェア機能
              const shareText = `Livitで試着してみました！ #Livit #ライブコマース #AR試着`;
              const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
              window.open(shareUrl, '_blank');
            }}
          >
            SNSでシェア
          </Button>
        </Card>
      )}

      {/* AR試着モーダル */}
      {showARTryOn && currentProduct && canTryOn && (
        <ARTryOn
          product={currentProduct}
          onClose={() => setShowARTryOn(false)}
          onCapture={handleARCapture}
        />
      )}

      {/* AIアシスタントボタン */}
      <Button
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        onClick={() => {
          // AIチャットボット起動
          console.log('AIアシスタント起動');
        }}
      >
        🤖 AIアシスタント
      </Button>
    </div>
  );
}