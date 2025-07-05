'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  overview: {
    totalViews: number;
    peakConcurrent: number;
    avgWatchTime: number;
    conversionRate: number;
    revenue: number;
    growthRate: number;
  };
  audience: {
    demographics: {
      age: { [key: string]: number };
      gender: { [key: string]: number };
      location: { [key: string]: number };
    };
    behavior: {
      returnRate: number;
      shareRate: number;
      commentRate: number;
      avgSessionTime: number;
    };
  };
  products: {
    topSelling: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
      conversionRate: number;
    }>;
    categoryPerformance: { [key: string]: number };
    cartAbandonment: number;
  };
  timeline: Array<{
    timestamp: Date;
    viewers: number;
    interactions: number;
    sales: number;
  }>;
}

interface StreamerAnalyticsProps {
  streamerId: string;
  timeRange: '1d' | '7d' | '30d' | '90d';
  onTimeRangeChange: (range: '1d' | '7d' | '30d' | '90d') => void;
}

export function StreamerAnalytics({ streamerId, timeRange, onTimeRangeChange }: StreamerAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'viewers' | 'interactions' | 'sales'>('viewers');

  useEffect(() => {
    loadAnalyticsData();
  }, [streamerId, timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // 実際の実装では API コール
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 45230,
          peakConcurrent: 2840,
          avgWatchTime: 28.5,
          conversionRate: 12.3,
          revenue: 1245800,
          growthRate: 23.5
        },
        audience: {
          demographics: {
            age: { '16-20': 35, '21-25': 42, '26-30': 18, '31+': 5 },
            gender: { 'female': 78, 'male': 20, 'other': 2 },
            location: { '東京': 25, '大阪': 15, '愛知': 8, '福岡': 6, 'その他': 46 }
          },
          behavior: {
            returnRate: 68.5,
            shareRate: 23.8,
            commentRate: 45.2,
            avgSessionTime: 34.2
          }
        },
        products: {
          topSelling: [
            { id: '1', name: 'ワンピース A', sales: 124, revenue: 245600, conversionRate: 15.2 },
            { id: '2', name: 'リップ B', sales: 89, revenue: 125300, conversionRate: 18.7 },
            { id: '3', name: 'ニット C', sales: 67, revenue: 89200, conversionRate: 12.1 }
          ],
          categoryPerformance: { 'fashion': 65, 'beauty': 28, 'lifestyle': 7 },
          cartAbandonment: 23.4
        },
        timeline: generateMockTimeline()
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Analytics data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTimeline = () => {
    const now = new Date();
    const points = timeRange === '1d' ? 24 : timeRange === '7d' ? 7 : 30;
    
    return Array.from({ length: points }, (_, i) => ({
      timestamp: new Date(now.getTime() - (points - 1 - i) * (timeRange === '1d' ? 3600000 : 86400000)),
      viewers: Math.floor(Math.random() * 3000 + 500),
      interactions: Math.floor(Math.random() * 500 + 50),
      sales: Math.floor(Math.random() * 50000 + 10000)
    }));
  };

  const formatNumber = (num: number, suffix = '') => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M${suffix}`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K${suffix}`;
    return `${num.toLocaleString()}${suffix}`;
  };

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* ヘッダーとフィルター */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📊 配信アナリティクス</h2>
        <div className="flex gap-2">
          {(['1d', '7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange(range)}
            >
              {range === '1d' ? '24時間' : 
               range === '7d' ? '7日間' : 
               range === '30d' ? '30日間' : '90日間'}
            </Button>
          ))}
        </div>
      </div>

      {/* 概要メトリクス */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-2xl mb-1">👥</div>
          <div className="text-lg font-bold">{formatNumber(analyticsData.overview.totalViews)}</div>
          <div className="text-xs text-gray-600">総視聴数</div>
          <div className="text-xs text-green-600">
            +{analyticsData.overview.growthRate}%
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-lg font-bold">{formatNumber(analyticsData.overview.peakConcurrent)}</div>
          <div className="text-xs text-gray-600">最大同時視聴</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xl mb-1">⏱️</div>
          <div className="text-lg font-bold">{analyticsData.overview.avgWatchTime}分</div>
          <div className="text-xs text-gray-600">平均視聴時間</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-lg font-bold">{analyticsData.overview.conversionRate}%</div>
          <div className="text-xs text-gray-600">コンバージョン率</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-lg font-bold">{formatCurrency(analyticsData.overview.revenue)}</div>
          <div className="text-xs text-gray-600">総売上</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xl mb-1">🔄</div>
          <div className="text-lg font-bold">{analyticsData.audience.behavior.returnRate}%</div>
          <div className="text-xs text-gray-600">リピート率</div>
        </Card>
      </div>

      {/* タイムライングラフ */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">パフォーマンス推移</h3>
          <div className="flex gap-2">
            {(['viewers', 'interactions', 'sales'] as const).map((metric) => (
              <Button
                key={metric}
                variant={selectedMetric === metric ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric(metric)}
              >
                {metric === 'viewers' ? '視聴者' : 
                 metric === 'interactions' ? '交流' : '売上'}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-1">
          {analyticsData.timeline.map((point, index) => {
            const value = point[selectedMetric];
            const maxValue = Math.max(...analyticsData.timeline.map(p => p[selectedMetric]));
            const height = (value / maxValue) * 100;

            return (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                style={{ height: `${height}%` }}
                title={`${formatNumber(value)} ${selectedMetric}`}
              />
            );
          })}
        </div>
      </Card>

      {/* 視聴者分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">👥 視聴者分析</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">年齢層</h4>
              {Object.entries(analyticsData.audience.demographics.age).map(([age, percentage]) => (
                <div key={age} className="flex items-center gap-3 mb-1">
                  <span className="text-sm w-12">{age}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm w-8">{percentage}%</span>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-semibold mb-2">性別</h4>
              {Object.entries(analyticsData.audience.demographics.gender).map(([gender, percentage]) => (
                <div key={gender} className="flex items-center gap-3 mb-1">
                  <span className="text-sm w-12">{gender}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm w-8">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">🛍️ 販売実績</h3>
          
          <div className="space-y-3">
            {analyticsData.products.topSelling.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{product.name}</div>
                  <div className="text-xs text-gray-600">
                    {product.sales}個販売 • CV率 {product.conversionRate}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{formatCurrency(product.revenue)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>カート放棄率</span>
              <span className="font-semibold">{analyticsData.products.cartAbandonment}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* インサイトと提案 */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">💡 AIインサイト</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-lg">📈</div>
              <div>
                <div className="font-semibold text-sm">最適な配信時間</div>
                <div className="text-xs text-gray-600">
                  平日19:00-21:00の視聴者が最も多く、エンゲージメントも高いです
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="text-lg">🎯</div>
              <div>
                <div className="font-semibold text-sm">商品紹介のタイミング</div>
                <div className="text-xs text-gray-600">
                  配信開始15分後に最初の商品を紹介すると売上が25%向上します
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg">🗣️</div>
              <div>
                <div className="font-semibold text-sm">エンゲージメント向上</div>
                <div className="text-xs text-gray-600">
                  Q&Aコーナーを設けると視聴時間が平均7分延長されます
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="text-lg">🔄</div>
              <div>
                <div className="font-semibold text-sm">リピーター獲得</div>
                <div className="text-xs text-gray-600">
                  次回配信予告をすることでリピート率が40%向上します
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}