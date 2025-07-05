'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Heart, Gift, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface ChatMessage {
  id: string
  user_id: string
  username: string
  avatar?: string
  message: string
  timestamp: string
  is_system?: boolean
  gift_type?: string
}

interface LiveChatProps {
  streamId: string
  className?: string
}

export function LiveChat({ streamId, className }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<number>(0)
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<any>(null)
  const { user, isAuthenticated } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    setupRealtimeChat()
    loadRecentMessages()

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe()
      }
    }
  }, [streamId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const setupRealtimeChat = async () => {
    try {
      const channel = supabase.channel(`chat:${streamId}`, {
        config: { presence: { key: user?.id || 'anonymous' } }
      })

      // 新しいチャットメッセージを受信
      channel.on('broadcast', { event: 'new_message' }, ({ payload }: { payload: any }) => {
        setMessages(prev => [...prev, payload])
      })

      // プレゼンス監視（オンラインユーザー数）
      channel.on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        setOnlineUsers(Object.keys(presenceState).length)
      })

      channel.on('presence', { event: 'join' }, ({ newPresences }: { newPresences: any }) => {
        console.log('ユーザーが参加:', newPresences)
      })

      channel.on('presence', { event: 'leave' }, ({ leftPresences }: { leftPresences: any }) => {
        console.log('ユーザーが退出:', leftPresences)
      })

      await channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          
          // プレゼンス開始
          if (user) {
            await channel.track({
              user_id: user.id,
              username: user.username,
              joined_at: new Date().toISOString()
            })
          }
        }
      })

      channelRef.current = channel

    } catch (error) {
      console.error('チャット接続エラー:', error)
    }
  }

  const loadRecentMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          user_id,
          message,
          created_at,
          users (
            username,
            avatar_url
          )
        `)
        .eq('stream_id', streamId)
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) throw error

      const formattedMessages: ChatMessage[] = data.map((msg: any) => ({
        id: msg.id,
        user_id: msg.user_id,
        username: msg.users?.username || 'Anonymous',
        avatar: msg.users?.avatar_url,
        message: msg.message,
        timestamp: msg.created_at
      }))

      setMessages(formattedMessages)

    } catch (error) {
      console.error('メッセージ読み込みエラー:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !isAuthenticated || isSending) return

    setIsSending(true)

    try {
      const messageData = {
        id: `${Date.now()}-${user!.id}`,
        stream_id: streamId,
        user_id: user!.id,
        username: user!.username,
        avatar: user!.avatar,
        message: newMessage.trim(),
        timestamp: new Date().toISOString()
      }

      // データベースに保存
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          stream_id: streamId,
          user_id: user!.id,
          message: newMessage.trim()
        })

      if (error) throw error

      // リアルタイムブロードキャスト
      if (channelRef.current) {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'new_message',
          payload: messageData
        })
      }

      setNewMessage('')

    } catch (error) {
      console.error('メッセージ送信エラー:', error)
    } finally {
      setIsSending(false)
    }
  }

  const sendGift = async (giftType: string) => {
    if (!isAuthenticated) return

    try {
      const giftMessage = {
        id: `gift-${Date.now()}-${user!.id}`,
        stream_id: streamId,
        user_id: user!.id,
        username: user!.username,
        avatar: user!.avatar,
        message: `${getGiftEmoji(giftType)} ${user!.username}さんが${getGiftName(giftType)}を送りました！`,
        timestamp: new Date().toISOString(),
        gift_type: giftType
      }

      if (channelRef.current) {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'new_message',
          payload: giftMessage
        })
      }

    } catch (error) {
      console.error('ギフト送信エラー:', error)
    }
  }

  const getGiftEmoji = (type: string) => {
    const emojis = {
      heart: '💖',
      star: '⭐',
      gift: '🎁',
      crown: '👑'
    }
    return emojis[type as keyof typeof emojis] || '💖'
  }

  const getGiftName = (type: string) => {
    const names = {
      heart: 'ハート',
      star: 'スター',
      gift: 'ギフト',
      crown: 'クラウン'
    }
    return names[type as keyof typeof names] || 'ハート'
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">ライブチャット</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span>{isConnected ? '接続中' : '切断'}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{onlineUsers}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* メッセージ表示エリア */}
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-2">
                <Avatar className="w-6 h-6 shrink-0">
                  {message.avatar ? (
                    <img src={message.avatar} alt={message.username} />
                  ) : (
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 w-full h-full flex items-center justify-center text-white text-xs">
                      {message.username[0]?.toUpperCase()}
                    </div>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.timestamp), { 
                        addSuffix: true, 
                        locale: ja 
                      })}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 break-words ${message.gift_type ? 'text-purple-600 font-medium' : 'text-gray-700'}`}>
                    {message.message}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* ギフトボタン */}
        {isAuthenticated && (
          <div className="flex space-x-1">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => sendGift('heart')}
              className="flex-1"
            >
              💖
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => sendGift('star')}
              className="flex-1"
            >
              ⭐
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => sendGift('gift')}
              className="flex-1"
            >
              🎁
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => sendGift('crown')}
              className="flex-1"
            >
              👑
            </Button>
          </div>
        )}

        {/* メッセージ入力 */}
        {isAuthenticated ? (
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="メッセージを入力..."
              disabled={!isConnected || isSending}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim() || !isConnected || isSending}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              チャットに参加するには<br />ログインが必要です
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}