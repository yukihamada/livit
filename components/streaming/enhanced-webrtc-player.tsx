'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ViewerStats {
  bitrate: number;
  frameRate: number;
  resolution: string;
  latency: number;
  bufferHealth: number;
  droppedFrames: number;
}

interface EnhancedWebRTCPlayerProps {
  streamUrl: string;
  autoPlay?: boolean;
  onPlayerReady: () => void;
  onPlayerError: (error: string) => void;
  onStatsUpdate: (stats: ViewerStats) => void;
  onViewerJoin: () => void;
  onViewerLeave: () => void;
}

export function EnhancedWebRTCPlayer({
  streamUrl,
  autoPlay = true,
  onPlayerReady,
  onPlayerError,
  onStatsUpdate,
  onViewerJoin,
  onViewerLeave
}: EnhancedWebRTCPlayerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState<'auto' | '1080p' | '720p' | '480p' | '360p'>('auto');
  const [viewerStats, setViewerStats] = useState<ViewerStats>({
    bitrate: 0,
    frameRate: 0,
    resolution: '0x0',
    latency: 0,
    bufferHealth: 100,
    droppedFrames: 0
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 2000;

  // WebRTC設定
  const rtcConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
    iceCandidatePoolSize: 10
  };

  useEffect(() => {
    if (autoPlay && streamUrl) {
      connectToStream();
    }

    return () => {
      disconnect();
    };
  }, [streamUrl, autoPlay]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const connectToStream = async () => {
    try {
      setIsConnecting(true);
      
      // PeerConnection作成
      const peerConnection = new RTCPeerConnection(rtcConfiguration);
      peerConnectionRef.current = peerConnection;

      // イベントリスナー設定
      setupPeerConnectionEvents(peerConnection);

      // リモートストリーム受信設定
      peerConnection.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
          setIsConnecting(false);
          onPlayerReady();
          onViewerJoin();
          startStatsCollection();
          reconnectAttempts.current = 0;
        }
      };

      // シグナリングサーバーに接続要求
      await requestStream();

    } catch (error) {
      console.error('Connection error:', error);
      onPlayerError('配信への接続に失敗しました');
      setIsConnecting(false);
      scheduleReconnect();
    }
  };

  const setupPeerConnectionEvents = (peerConnection: RTCPeerConnection) => {
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
      
      if (peerConnection.connectionState === 'failed' || 
          peerConnection.connectionState === 'disconnected') {
        setIsConnected(false);
        scheduleReconnect();
      }
    };

    peerConnection.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', peerConnection.iceGatheringState);
    };
  };

  const requestStream = async () => {
    if (!peerConnectionRef.current) return;

    // 受信専用のオファー作成
    const offer = await peerConnectionRef.current.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });

    await peerConnectionRef.current.setLocalDescription(offer);

    // シグナリングサーバーに視聴要求送信
    await sendSignalingMessage({
      type: 'viewer-request',
      offer: offer,
      streamUrl: streamUrl,
      quality: quality
    });
  };

  const sendSignalingMessage = async (message: any) => {
    try {
      const response = await fetch('/api/viewer-signaling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        throw new Error('Signaling failed');
      }

      const data = await response.json();
      
      // アンサーを受信した場合
      if (data.type === 'answer' && peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(data.answer);
      }
    } catch (error) {
      console.error('Signaling error:', error);
      throw error;
    }
  };

  const disconnect = () => {
    // 統計収集停止
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }

    // 再接続タイマー停止
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // PeerConnection終了
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    onViewerLeave();
  };

  const scheduleReconnect = () => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      onPlayerError('配信への再接続に失敗しました');
      return;
    }

    reconnectAttempts.current++;
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Reconnect attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS}`);
      connectToStream();
    }, RECONNECT_DELAY * reconnectAttempts.current);
  };

  const startStatsCollection = () => {
    if (!peerConnectionRef.current) return;

    statsIntervalRef.current = setInterval(async () => {
      if (!peerConnectionRef.current) return;

      try {
        const stats = await peerConnectionRef.current.getStats();
        const newStats = parseViewerStats(stats);
        setViewerStats(newStats);
        onStatsUpdate(newStats);
      } catch (error) {
        console.error('Stats collection error:', error);
      }
    }, 1000);
  };

  const parseViewerStats = (stats: RTCStatsReport): ViewerStats => {
    let bitrate = 0;
    let frameRate = 0;
    let resolution = '0x0';
    let latency = 0;
    let droppedFrames = 0;

    stats.forEach((report) => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        bitrate = report.bytesReceived ? (report.bytesReceived * 8 / 1000) : 0;
        frameRate = report.framesPerSecond || 0;
        droppedFrames = report.framesDropped || 0;
        
        if (report.frameWidth && report.frameHeight) {
          resolution = `${report.frameWidth}x${report.frameHeight}`;
        }
      }

      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        latency = report.currentRoundTripTime ? report.currentRoundTripTime * 1000 : 0;
      }
    });

    // バッファヘルス計算（簡易版）
    const bufferHealth = droppedFrames > 10 ? Math.max(0, 100 - droppedFrames) : 100;

    return {
      bitrate: Math.round(bitrate),
      frameRate: Math.round(frameRate),
      resolution,
      latency: Math.round(latency),
      bufferHealth: Math.round(bufferHealth),
      droppedFrames
    };
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const changeQuality = async (newQuality: typeof quality) => {
    setQuality(newQuality);
    
    if (isConnected && peerConnectionRef.current) {
      // 品質変更のため再接続
      disconnect();
      setTimeout(() => {
        connectToStream();
      }, 500);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.volume = volume;
                videoRef.current.muted = isMuted;
              }
            }}
          />

          {/* 接続状態オーバーレイ */}
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">配信に接続中...</p>
                {reconnectAttempts.current > 0 && (
                  <p className="text-xs mt-1">再接続試行 {reconnectAttempts.current}/{MAX_RECONNECT_ATTEMPTS}</p>
                )}
              </div>
            </div>
          )}

          {/* ライブインジケーター */}
          {isConnected && (
            <div className="absolute top-4 left-4">
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold animate-pulse">
                🔴 LIVE
              </div>
            </div>
          )}

          {/* 統計情報 */}
          {isConnected && (
            <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-xs space-y-1">
              <div>{viewerStats.resolution} | {viewerStats.frameRate}fps</div>
              <div>遅延: {viewerStats.latency}ms</div>
              <div>品質: {quality === 'auto' ? 'Auto' : quality}</div>
              {viewerStats.droppedFrames > 0 && (
                <div className="text-yellow-400">フレームドロップ: {viewerStats.droppedFrames}</div>
              )}
            </div>
          )}

          {/* コントロールオーバーレイ */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  ⏯️
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? '🔇' : '🔊'}
                </Button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={quality}
                  onChange={(e) => changeQuality(e.target.value as typeof quality)}
                  className="bg-black/50 text-white border border-white/20 rounded px-2 py-1 text-xs"
                >
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                  <option value="360p">360p</option>
                </select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? '🗗️' : '🗖️'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 接続管理ボタン */}
      {!isConnected && !isConnecting && (
        <div className="mt-4 text-center">
          <Button onClick={connectToStream}>
            配信に接続
          </Button>
        </div>
      )}

      {/* 詳細統計（デバッグ用） */}
      {process.env.NODE_ENV === 'development' && isConnected && (
        <Card className="mt-4 p-4">
          <h3 className="font-bold text-sm mb-2">配信統計</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p>ビットレート: {viewerStats.bitrate} kbps</p>
              <p>フレームレート: {viewerStats.frameRate} fps</p>
              <p>解像度: {viewerStats.resolution}</p>
            </div>
            <div>
              <p>遅延: {viewerStats.latency} ms</p>
              <p>バッファヘルス: {viewerStats.bufferHealth}%</p>
              <p>ドロップフレーム: {viewerStats.droppedFrames}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}