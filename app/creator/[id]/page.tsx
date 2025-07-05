'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Star, Users, TrendingUp, DollarSign, CheckCircle, 
  Play, Heart, Calendar, Award, Sparkles, ChevronRight 
} from 'lucide-react'

interface InfluencerData {
  id: string
  name: string
  category: string
  followers: string
  avatar?: string
  tier: 'platinum' | 'gold' | 'silver'
  monthlyEarnings?: number
}

export default function CreatorOfferPage() {
  const params = useParams()
  const [influencer, setInfluencer] = useState<InfluencerData | null>(null)
  const [formData, setFormData] = useState({
    realName: '',
    email: '',
    phone: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    message: ''
  })

  useEffect(() => {
    // インフルエンサーデータを取得（実際はAPIから）
    const mockInfluencers: { [key: string]: InfluencerData } = {
      kemio: {
        id: 'kemio',
        name: 'kemio',
        category: 'ファッション×エンタメ',
        followers: '2.5M',
        tier: 'platinum',
        monthlyEarnings: 5100000
      },
      yuchami: {
        id: 'yuchami',
        name: 'ゆうちゃみ',
        category: 'ギャル系ファッション',
        followers: '1.8M',
        tier: 'gold',
        monthlyEarnings: 3080000
      },
      naenano: {
        id: 'naenano',
        name: 'なえなの',
        category: 'カジュアルファッション',
        followers: '2.2M',
        tier: 'gold',
        monthlyEarnings: 3500000
      }
    }
    
    const id = params.id as string
    setInfluencer(mockInfluencers[id] || null)
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 申し込み処理
    alert('申し込みを受け付けました！48時間以内にご連絡いたします。')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!influencer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const getOffer = () => {
    switch (influencer.tier) {
      case 'platinum':
        return { base: 500000, commission: 15, bonus: 1000000 }
      case 'gold':
        return { base: 300000, commission: 12, bonus: 500000 }
      case 'silver':
        return { base: 200000, commission: 10, bonus: 300000 }
    }
  }

  const offer = getOffer()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] bg-clip-text text-transparent">
              Livit Creator
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Personalized Greeting */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">特別オファー</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] bg-clip-text text-transparent">
                {influencer.name}様へ
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Livitで新しいキャリアをスタートしませんか？
            </p>

            {/* Influencer Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#FF6B9D]">{influencer.followers}</p>
                <p className="text-sm text-gray-600">フォロワー</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#C44FF1]">{influencer.category}</p>
                <p className="text-sm text-gray-600">カテゴリー</p>
              </div>
            </div>
          </div>

          {/* Personalized Offer */}
          <Card className="p-8 mb-12 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {influencer.name}様専用オファー
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-white rounded-xl">
                <DollarSign className="w-8 h-8 text-[#FF6B9D] mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">月額固定報酬</p>
                <p className="text-2xl font-bold">¥{offer.base.toLocaleString()}</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl">
                <TrendingUp className="w-8 h-8 text-[#C44FF1] mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">売上コミッション</p>
                <p className="text-2xl font-bold">{offer.commission}%</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl">
                <Award className="w-8 h-8 text-[#4ECDC4] mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">達成ボーナス</p>
                <p className="text-2xl font-bold">最大¥{offer.bonus.toLocaleString()}</p>
              </div>
            </div>

            {/* Earnings Simulation */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold mb-4">収益シミュレーション</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>月額固定報酬</span>
                  <span className="font-semibold">¥{offer.base.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>予想売上コミッション（月間売上2000万円の場合）</span>
                  <span className="font-semibold">¥{(20000000 * offer.commission / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>各種ボーナス</span>
                  <span className="font-semibold">¥200,000</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-[#FF6B9D]">
                    <span>予想月収合計</span>
                    <span>¥{(offer.base + (20000000 * offer.commission / 100) + 200000).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Exclusive Benefits */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] bg-clip-text text-transparent">
                {influencer.name}様だけの特別サポート
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">専用スタジオ完備</h3>
                    <p className="text-sm text-gray-600">
                      渋谷・原宿の最新スタジオを24時間利用可能。
                      プロの撮影機材も無償提供します。
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#C44FF1] to-[#4ECDC4] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">専属チームサポート</h3>
                    <p className="text-sm text-gray-600">
                      企画・演出・編集まで専門チームが全面サポート。
                      あなたは配信に集中できます。
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#4ECDC4] to-[#FFE66D] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">オリジナル商品開発</h3>
                    <p className="text-sm text-gray-600">
                      {influencer.name}プロデュース商品の企画・開発を
                      全面バックアップします。
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FFE66D] to-[#FF6B9D] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">フレキシブルな配信</h3>
                    <p className="text-sm text-gray-600">
                      あなたのスケジュールに合わせて配信時間を調整。
                      無理なく続けられる環境を提供します。
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Application Form */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">今すぐ申し込む</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="realName">お名前（本名）</Label>
                  <Input
                    id="realName"
                    name="realName"
                    value={formData.realName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">電話番号</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram ID</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tiktok">TikTok ID</Label>
                  <Input
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="youtube">YouTube チャンネル</Label>
                  <Input
                    id="youtube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    placeholder="チャンネルURL"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="message">メッセージ（任意）</Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="ご質問やご要望がありましたらお書きください"
                />
              </div>
              
              <div className="text-center">
                <Button type="submit" size="lg" className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] px-8">
                  申し込む
                </Button>
              </div>
            </form>
          </Card>

          {/* Success Stories */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-6">先輩クリエイターの声</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 text-left">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                  <div>
                    <p className="font-bold">ファッションインフルエンサー A様</p>
                    <p className="text-sm text-gray-600">フォロワー120万人</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">
                  「Livitは単なる販売じゃなくて、ファンとの新しいコミュニケーション。
                  月収も3倍になって、本当に始めてよかった！」
                </p>
              </Card>

              <Card className="p-6 text-left">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                  <div>
                    <p className="font-bold">ビューティーインフルエンサー B様</p>
                    <p className="text-sm text-gray-600">フォロワー85万人</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">
                  「スタッフのサポートが手厚くて、配信に集中できる環境。
                  データ分析も細かくて、どんどん改善できるのが楽しい」
                </p>
              </Card>
            </div>
          </div>

          {/* FAQ */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">よくある質問</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Q: 他のプラットフォームでの活動は続けられますか？</h3>
                <p className="text-sm text-gray-600">
                  A: はい、可能です。ただし、Livit配信の24時間前後は他社でのライブコマース配信はお控えください。
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Q: 配信頻度はどのくらい必要ですか？</h3>
                <p className="text-sm text-gray-600">
                  A: {influencer.tier === 'platinum' ? '週1回' : influencer.tier === 'gold' ? '週2回' : '週3回'}以上を推奨していますが、
                  スケジュールに合わせて調整可能です。
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Q: 商品の選定は自由にできますか？</h3>
                <p className="text-sm text-gray-600">
                  A: もちろんです。提携ブランドの中から、あなたのスタイルに合った商品を自由に選んでいただけます。
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {influencer.name}様、一緒に新しい未来を作りましょう
          </h2>
          <p className="text-lg mb-6">
            48時間以内に担当者からご連絡いたします
          </p>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>完全無料・リスクなし</span>
          </div>
        </div>
      </section>
    </div>
  )
}