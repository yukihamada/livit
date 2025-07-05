'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Product } from '@/types/common';

interface UserBehavior {
  viewedProducts: string[];
  purchasedProducts: string[];
  categories: string[];
  priceRange: [number, number];
  viewingTime: { [productId: string]: number };
  searchHistory: string[];
}

interface RecommendationEngineProps {
  userId?: string;
  currentProduct?: Product;
  context: 'homepage' | 'product' | 'live' | 'cart';
  maxItems?: number;
  onProductClick: (product: Product) => void;
}

export function RecommendationEngine({
  userId,
  currentProduct,
  context,
  maxItems = 6,
  onProductClick
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [userId, currentProduct, context]);

  const loadRecommendations = async () => {
    setLoading(true);
    
    try {
      // ユーザー行動データの取得
      const behavior = await fetchUserBehavior(userId);
      setUserBehavior(behavior);
      
      // レコメンデーションアルゴリズムの実行
      const recs = await generateRecommendations(behavior, currentProduct, context);
      setRecommendations(recs.slice(0, maxItems));
    } catch (error) {
      console.error('レコメンデーション生成エラー:', error);
      // フォールバック：人気商品を表示
      const fallback = await getFallbackRecommendations();
      setRecommendations(fallback.slice(0, maxItems));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBehavior = async (userId?: string): Promise<UserBehavior> => {
    if (!userId) {
      return getDefaultBehavior();
    }
    
    // 実際の実装では API コール
    return {
      viewedProducts: ['1', '2', '3'],
      purchasedProducts: ['1'],
      categories: ['fashion', 'beauty'],
      priceRange: [1000, 10000],
      viewingTime: { '1': 120, '2': 80, '3': 200 },
      searchHistory: ['ワンピース', 'リップ', '韓国ファッション']
    };
  };

  const getDefaultBehavior = (): UserBehavior => ({
    viewedProducts: [],
    purchasedProducts: [],
    categories: [],
    priceRange: [0, 50000],
    viewingTime: {},
    searchHistory: []
  });

  const generateRecommendations = async (
    behavior: UserBehavior,
    product?: Product,
    context: string = 'homepage'
  ): Promise<Product[]> => {
    // 複数のアルゴリズムを組み合わせたハイブリッドレコメンデーション
    const algorithms = [
      () => collaborativeFiltering(behavior),
      () => contentBasedFiltering(behavior, product),
      () => popularityBasedRecommendation(),
      () => contextualRecommendation(context, behavior)
    ];

    const results = await Promise.all(algorithms.map(algo => algo()));
    
    // 重み付きスコアで統合
    const weightedResults = combineResults(results, context);
    
    return weightedResults;
  };

  const collaborativeFiltering = async (behavior: UserBehavior): Promise<Product[]> => {
    // 協調フィルタリング：類似ユーザーの購買履歴から推薦
    const mockProducts: Product[] = [
      {
        id: 'cf1',
        name: 'おすすめワンピース',
        price: 5980,
        imageUrl: '/images/dress1.jpg',
        category: 'clothing',
        brand: 'COHINA',
        tags: ['ワンピース', '小柄', 'デート'],
        rating: 4.5,
        salesCount: 1200
      },
      {
        id: 'cf2',
        name: '人気リップ',
        price: 1980,
        imageUrl: '/images/lip1.jpg',
        category: 'makeup',
        brand: 'rom&nd',
        tags: ['リップ', 'K-Beauty', 'マット'],
        rating: 4.7,
        salesCount: 3400
      }
    ];
    
    return mockProducts;
  };

  const contentBasedFiltering = async (behavior: UserBehavior, product?: Product): Promise<Product[]> => {
    // コンテンツベース：商品特徴から類似商品を推薦
    if (!product) return [];
    
    const mockSimilarProducts: Product[] = [
      {
        id: 'cb1',
        name: `${product.brand}の類似商品`,
        price: (product.price || product.originalPrice || 1000) * 0.8,
        imageUrl: '/images/similar1.jpg',
        category: product.category,
        brand: product.brand,
        tags: product.tags,
        rating: 4.3,
        salesCount: 800
      }
    ];
    
    return mockSimilarProducts;
  };

  const popularityBasedRecommendation = async (): Promise<Product[]> => {
    // 人気度ベース：トレンド商品を推薦
    const mockTrendingProducts: Product[] = [
      {
        id: 'pop1',
        name: 'トレンドニット',
        price: 7200,
        imageUrl: '/images/knit1.jpg',
        category: 'clothing',
        brand: '17kg',
        tags: ['ニット', '韓国', 'トレンド'],
        rating: 4.6,
        salesCount: 2100
      },
      {
        id: 'pop2',
        name: 'バズコスメ',
        price: 2800,
        imageUrl: '/images/cosmetic1.jpg',
        category: 'makeup',
        brand: 'CANMAKE',
        tags: ['プチプラ', 'バズ', 'アイシャドウ'],
        rating: 4.4,
        salesCount: 5600
      }
    ];
    
    return mockTrendingProducts;
  };

  const contextualRecommendation = async (context: string, behavior: UserBehavior): Promise<Product[]> => {
    // コンテキストベース：状況に応じた推薦
    const contextMap: { [key: string]: Product[] } = {
      homepage: [
        {
          id: 'ctx1',
          name: 'おすすめの新作',
          price: 4500,
          imageUrl: '/images/new1.jpg',
          category: 'clothing',
          brand: 'fifth',
          tags: ['新作', 'ベーシック'],
          rating: 4.2,
          salesCount: 450
        }
      ],
      live: [
        {
          id: 'ctx2',
          name: 'ライブ限定商品',
          price: 3200,
          imageUrl: '/images/live1.jpg',
          category: 'makeup',
          brand: 'Fujiko',
          tags: ['限定', 'ライブ特価'],
          rating: 4.8,
          salesCount: 1800
        }
      ],
      product: [],
      cart: [
        {
          id: 'ctx3',
          name: 'よく一緒に購入される商品',
          price: 1500,
          imageUrl: '/images/bundle1.jpg',
          category: 'accessories',
          brand: 'AWESOME STORE',
          tags: ['アクセサリー', 'セット購入'],
          rating: 4.1,
          salesCount: 900
        }
      ]
    };
    
    return contextMap[context] || [];
  };

  const combineResults = (results: Product[][], context: string): Product[] => {
    // 重み付きスコアリング
    const weights = {
      collaborative: 0.3,
      content: 0.25,
      popularity: 0.25,
      contextual: 0.2
    };
    
    const allProducts = results.flat();
    const productScores = new Map<string, number>();
    
    allProducts.forEach((product, index) => {
      const algorithmIndex = Math.floor(index / (allProducts.length / results.length));
      const weight = Object.values(weights)[algorithmIndex] || 0.1;
      
      const currentScore = productScores.get(product.id) || 0;
      const newScore = currentScore + (weight * (product.rating || 0) * Math.log((product.salesCount || 0) + 1));
      
      productScores.set(product.id, newScore);
    });
    
    // 重複除去とスコア順ソート
    const uniqueProducts = Array.from(new Set(allProducts.map(p => p.id)))
      .map(id => allProducts.find(p => p.id === id)!)
      .sort((a, b) => (productScores.get(b.id) || 0) - (productScores.get(a.id) || 0));
    
    return uniqueProducts;
  };

  const getFallbackRecommendations = async (): Promise<Product[]> => {
    // フォールバック：エラー時の代替推薦
    return [
      {
        id: 'fallback1',
        name: '人気商品',
        price: 3980,
        imageUrl: '/images/fallback1.jpg',
        category: 'clothing',
        brand: 'SHOPLIST',
        tags: ['人気', 'プチプラ'],
        rating: 4.0,
        salesCount: 1000
      }
    ];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: maxItems }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getTitle = () => {
    switch (context) {
      case 'homepage': return 'あなたにおすすめ';
      case 'product': return '関連商品';
      case 'live': return 'ライブ中のおすすめ';
      case 'cart': return 'よく一緒に購入される商品';
      default: return 'おすすめ商品';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{getTitle()}</h2>
        <Button variant="ghost" size="sm">
          すべて見る →
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.map((product) => (
          <Card
            key={product.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onProductClick(product)}
          >
            <div className="aspect-square bg-gray-100 rounded-t-lg mb-2">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-t-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
            </div>
            <div className="p-3 space-y-1">
              <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
              <p className="text-xs text-gray-600">{product.brand}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">¥{(product.price || product.originalPrice || 0).toLocaleString()}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>⭐</span>
                  <span className="ml-1">{product.rating || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {userBehavior && (
        <div className="text-xs text-gray-500 mt-4">
          <p>
            {userBehavior.categories.length > 0 && 
              `よく見るカテゴリ: ${userBehavior.categories.join(', ')}`
            }
          </p>
        </div>
      )}
    </div>
  );
}