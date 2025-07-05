'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ARTryOnProps {
  product: {
    id: string;
    name: string;
    category: 'clothing' | 'accessories' | 'makeup';
    modelUrl?: string;
    colors?: string[];
  };
  onClose: () => void;
  onCapture?: (imageData: string) => void;
}

export function ARTryOn({ product, onClose, onCapture }: ARTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [arEnabled, setArEnabled] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');

  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsLoading(false);
    } catch (error) {
      console.error('カメラアクセスエラー:', error);
      setIsLoading(false);
    }
  };

  const enableAR = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setArEnabled(true);
    
    // MediaPipeやTensorFlow.jsを使った顔認識・ポーズ検出の実装
    // 実際の実装では外部ライブラリを使用
    try {
      // シミュレーション：実際の商品をオーバーレイ
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const renderFrame = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // AR試着エフェクトの描画
          renderTryOnEffect(ctx, canvas.width, canvas.height);
          
          if (arEnabled) {
            requestAnimationFrame(renderFrame);
          }
        };
        
        renderFrame();
      }
    } catch (error) {
      console.error('AR初期化エラー:', error);
    }
  };

  const renderTryOnEffect = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    switch (product.category) {
      case 'clothing':
        renderClothingOverlay(ctx, width, height);
        break;
      case 'accessories':
        renderAccessoryOverlay(ctx, width, height);
        break;
      case 'makeup':
        renderMakeupOverlay(ctx, width, height);
        break;
    }
  };

  const renderClothingOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 服装の3Dモデル描画シミュレーション
    ctx.fillStyle = selectedColor || '#ff6b9d';
    ctx.globalAlpha = 0.7;
    
    // ボディ検出位置に服を描画（シミュレーション）
    const bodyX = width * 0.3;
    const bodyY = height * 0.3;
    const bodyWidth = width * 0.4;
    const bodyHeight = height * 0.5;
    
    ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);
    ctx.globalAlpha = 1;
  };

  const renderAccessoryOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // アクセサリーオーバーレイ
    ctx.fillStyle = selectedColor || '#ffd700';
    ctx.globalAlpha = 0.8;
    
    // 顔検出位置にアクセサリーを描画
    const faceX = width * 0.4;
    const faceY = height * 0.2;
    
    ctx.beginPath();
    ctx.arc(faceX, faceY, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const renderMakeupOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // メイクアップエフェクト
    ctx.fillStyle = selectedColor || '#ff69b4';
    ctx.globalAlpha = 0.6;
    
    // 唇の位置に色を適用
    const lipX = width * 0.5;
    const lipY = height * 0.4;
    
    ctx.fillRect(lipX - 30, lipY - 5, 60, 10);
    ctx.globalAlpha = 1;
  };

  const captureImage = () => {
    if (!canvasRef.current) return;
    
    const imageData = canvasRef.current.toDataURL('image/png');
    onCapture?.(imageData);
  };

  const toggleAR = () => {
    if (arEnabled) {
      setArEnabled(false);
    } else {
      enableAR();
    }
  };

  return (
    <Card className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">バーチャル試着</h2>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">{product.name}</h3>
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 mb-4">
              <span className="text-sm">カラー:</span>
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="w-full h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className={`w-full h-96 object-cover ${arEnabled ? 'opacity-50' : ''}`}
                autoPlay
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                className={`absolute top-0 left-0 w-full h-full ${
                  arEnabled ? 'block' : 'hidden'
                }`}
              />
            </>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={toggleAR}
            disabled={isLoading}
            className="flex-1"
          >
            {arEnabled ? 'AR終了' : 'AR試着開始'}
          </Button>
          
          {arEnabled && (
            <Button
              onClick={captureImage}
              variant="outline"
              className="flex-1"
            >
              写真撮影
            </Button>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>• カメラへのアクセスを許可してください</p>
          <p>• 顔や身体全体が画面に収まるようにしてください</p>
          <p>• 明るい場所での使用を推奨します</p>
        </div>
      </div>
    </Card>
  );
}