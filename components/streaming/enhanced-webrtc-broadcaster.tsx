'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StreamConfig {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    frameRate: { ideal: number };
    facingMode?: string;
  };
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
    sampleRate: number;
  };
}

interface StreamStats {
  bitrate: number;
  frameRate: number;
  resolution: string;
  latency: number;
  packetLoss: number;
  viewers: number;
}

interface EnhancedWebRTCBroadcasterProps {
  streamKey: string;
  onStreamStart: () => void;
  onStreamEnd: () => void;
  onError: (error: string) => void;
  onStatsUpdate: (stats: StreamStats) => void;
}

export function EnhancedWebRTCBroadcaster({
  streamKey,
  onStreamStart,
  onStreamEnd,
  onError,
  onStatsUpdate
}: EnhancedWebRTCBroadcasterProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [streamConfig, setStreamConfig] = useState<StreamConfig>({
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30 }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000
    }
  });
  const [streamStats, setStreamStats] = useState<StreamStats>({
    bitrate: 0,
    frameRate: 0,
    resolution: '0x0',
    latency: 0,
    packetLoss: 0,
    viewers: 0
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebRTC設定
  const rtcConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // TURN サーバーも実際の環境では必要
    ],
    iceCandidatePoolSize: 10
  };

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: streamConfig.video,
        audio: streamConfig.audio
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Media initialization error:', error);
      onError('カメラ・マイクへのアクセスに失敗しました');
      throw error;
    }
  };

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(rtcConfiguration);
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // ICE候補をシグナリングサーバーに送信
        sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
      
      if (peerConnection.connectionState === 'connected') {
        setIsConnecting(false);
        setIsStreaming(true);
        onStreamStart();
        startStatsCollection();
      } else if (peerConnection.connectionState === 'failed') {
        onError('配信接続に失敗しました');
        stopStreaming();
      }
    };

    return peerConnection;
  };

  const startStreaming = async () => {
    try {
      setIsConnecting(true);

      // メディア初期化
      const stream = await initializeMedia();
      
      // PeerConnection作成
      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;

      // ローカルストリームを追加
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // オファー作成
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false
      });

      await peerConnection.setLocalDescription(offer);

      // シグナリングサーバーにオファー送信
      await sendSignalingMessage({
        type: 'offer',
        offer: offer,
        streamKey: streamKey
      });

    } catch (error) {
      console.error('Streaming start error:', error);
      onError('配信開始に失敗しました');
      setIsConnecting(false);
    }
  };

  const stopStreaming = () => {
    // 統計収集停止
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }

    // PeerConnection終了
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // ローカルストリーム停止
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    setIsStreaming(false);
    setIsConnecting(false);
    onStreamEnd();
  };

  const sendSignalingMessage = async (message: any) => {
    // 実際の実装ではWebSocketやHTTPでシグナリングサーバーに送信
    try {
      const response = await fetch('/api/signaling', {
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
      onError('シグナリングエラーが発生しました');
    }
  };

  const startStatsCollection = () => {
    if (!peerConnectionRef.current) return;

    statsIntervalRef.current = setInterval(async () => {
      if (!peerConnectionRef.current) return;

      try {
        const stats = await peerConnectionRef.current.getStats();
        const newStats = parseWebRTCStats(stats);
        setStreamStats(newStats);
        onStatsUpdate(newStats);
      } catch (error) {
        console.error('Stats collection error:', error);
      }
    }, 1000);
  };

  const parseWebRTCStats = (stats: RTCStatsReport): StreamStats => {
    let bitrate = 0;
    let frameRate = 0;
    let resolution = '0x0';
    let latency = 0;
    let packetLoss = 0;

    stats.forEach((report) => {
      if (report.type === 'outbound-rtp' && report.mediaType === 'video') {
        bitrate = report.bytesSent ? (report.bytesSent * 8 / 1000) : 0;
        frameRate = report.framesPerSecond || 0;
        
        if (report.frameWidth && report.frameHeight) {
          resolution = `${report.frameWidth}x${report.frameHeight}`;
        }
      }

      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        latency = report.currentRoundTripTime ? report.currentRoundTripTime * 1000 : 0;
      }

      if (report.type === 'transport') {
        const packetsLost = report.packetsLost || 0;
        const packetsSent = report.packetsSent || 0;
        if (packetsSent > 0) {
          packetLoss = (packetsLost / packetsSent) * 100;
        }
      }
    });

    return {
      bitrate: Math.round(bitrate),
      frameRate: Math.round(frameRate),
      resolution,
      latency: Math.round(latency),
      packetLoss: Math.round(packetLoss * 100) / 100,
      viewers: streamStats.viewers // 外部から更新される
    };
  };

  const updateStreamConfig = (newConfig: Partial<StreamConfig>) => {
    setStreamConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const switchCamera = async () => {
    if (!localStreamRef.current) return;

    try {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      const currentFacingMode = videoTrack.getSettings().facingMode;
      const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

      // 新しいビデオストリームを取得
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          ...streamConfig.video,
          facingMode: newFacingMode
        },
        audio: false
      });

      const newVideoTrack = newStream.getVideoTracks()[0];
      
      // PeerConnectionのトラックを置き換え
      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(newVideoTrack);
        }
      }

      // 古いトラックを停止
      videoTrack.stop();
      
      // 新しいトラックをローカルストリームに追加
      localStreamRef.current.removeTrack(videoTrack);
      localStreamRef.current.addTrack(newVideoTrack);

      // ビデオ要素を更新
      if (videoRef.current) {
        videoRef.current.srcObject = localStreamRef.current;
      }

    } catch (error) {
      console.error('Camera switch error:', error);
      onError('カメラの切り替えに失敗しました');
    }
  };

  return (
    <div className="space-y-4">
      {/* プレビュー画面 */}
      <Card className="p-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* オーバーレイ情報 */}
          <div className="absolute top-4 left-4 space-y-2">
            {isStreaming && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold animate-pulse">
                🔴 LIVE
              </div>
            )}
            
            <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
              {streamStats.resolution} | {streamStats.frameRate}fps
            </div>
          </div>

          {/* 統計情報 */}
          {isStreaming && (
            <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-xs space-y-1">
              <div>ビットレート: {streamStats.bitrate} kbps</div>
              <div>遅延: {streamStats.latency} ms</div>
              <div>パケットロス: {streamStats.packetLoss}%</div>
              <div>視聴者数: {streamStats.viewers}人</div>
            </div>
          )}
        </div>
      </Card>

      {/* コントロールパネル */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* 配信コントロール */}
          <div className="flex gap-2">
            <Button
              onClick={isStreaming ? stopStreaming : startStreaming}
              disabled={isConnecting}
              className={isStreaming ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              {isConnecting ? '接続中...' : isStreaming ? '配信停止' : '配信開始'}
            </Button>
            
            {isStreaming && (
              <>
                <Button variant="outline" onClick={toggleCamera}>
                  📷 カメラ
                </Button>
                <Button variant="outline" onClick={toggleMicrophone}>
                  🎤 マイク
                </Button>
                <Button variant="outline" onClick={switchCamera}>
                  🔄 カメラ切替
                </Button>
              </>
            )}
          </div>

          {/* 品質設定 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">解像度</label>
              <select
                value={`${streamConfig.video.width.ideal}x${streamConfig.video.height.ideal}`}
                onChange={(e) => {
                  const [width, height] = e.target.value.split('x').map(Number);
                  updateStreamConfig({
                    video: {
                      ...streamConfig.video,
                      width: { ideal: width },
                      height: { ideal: height }
                    }
                  });
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
                disabled={isStreaming}
              >
                <option value="1920x1080">1080p (1920x1080)</option>
                <option value="1280x720">720p (1280x720)</option>
                <option value="854x480">480p (854x480)</option>
                <option value="640x360">360p (640x360)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">フレームレート</label>
              <select
                value={streamConfig.video.frameRate.ideal}
                onChange={(e) => {
                  updateStreamConfig({
                    video: {
                      ...streamConfig.video,
                      frameRate: { ideal: Number(e.target.value) }
                    }
                  });
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
                disabled={isStreaming}
              >
                <option value="60">60 FPS</option>
                <option value="30">30 FPS</option>
                <option value="24">24 FPS</option>
                <option value="15">15 FPS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">音質</label>
              <select
                value={streamConfig.audio.sampleRate}
                onChange={(e) => {
                  updateStreamConfig({
                    audio: {
                      ...streamConfig.audio,
                      sampleRate: Number(e.target.value)
                    }
                  });
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
                disabled={isStreaming}
              >
                <option value="48000">48 kHz (高品質)</option>
                <option value="44100">44.1 kHz (標準)</option>
                <option value="22050">22 kHz (省帯域)</option>
              </select>
            </div>
          </div>

          {/* 音声設定 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={streamConfig.audio.echoCancellation}
                onChange={(e) => {
                  updateStreamConfig({
                    audio: {
                      ...streamConfig.audio,
                      echoCancellation: e.target.checked
                    }
                  });
                }}
                disabled={isStreaming}
              />
              <span className="text-sm">エコーキャンセレーション</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={streamConfig.audio.noiseSuppression}
                onChange={(e) => {
                  updateStreamConfig({
                    audio: {
                      ...streamConfig.audio,
                      noiseSuppression: e.target.checked
                    }
                  });
                }}
                disabled={isStreaming}
              />
              <span className="text-sm">ノイズ抑制</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={streamConfig.audio.autoGainControl}
                onChange={(e) => {
                  updateStreamConfig({
                    audio: {
                      ...streamConfig.audio,
                      autoGainControl: e.target.checked
                    }
                  });
                }}
                disabled={isStreaming}
              />
              <span className="text-sm">自動ゲイン調整</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}