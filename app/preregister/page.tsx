'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { 
  CheckCircle, Gift, Users, Sparkles, Heart, 
  TrendingUp, ShoppingBag, Star, ChevronRight 
} from 'lucide-react'
import Link from 'next/link'

function PreRegisterContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    interests: [] as string[],
    favoriteInfluencer: ''
  })
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleInterestToggle = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter(i => i !== interest)
        : [...formData.interests, interest]
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // 送信処理
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-pink-50 flex items-center justify-center px-4">
        <Card className="max-w-lg w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">
            事前登録完了！
          </h1>
          
          <p className="text-gray-600 mb-6">
            {formData.name}様、Livitへの事前登録ありがとうございます。
            ローンチ時には優先的にご案内いたします。
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
            <h2 className="font-bold mb-4">あなたの特典</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Gift className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">初回1,000円OFFクーポン</p>
                  <p className="text-sm text-gray-600">アプリローンチ時に配布</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">VIPバッジ付与</p>
                  <p className="text-sm text-gray-600">アーリーアダプター限定</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">限定配信への優先アクセス</p>
                  <p className="text-sm text-gray-600">人気配信者の限定ライブ</p>
                </div>
              </div>
            </div>
          </div>

          <Button asChild className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1]">
            <Link href="/">
              ホームに戻る
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] bg-clip-text text-transparent">
              Livit
            </span>
          </Link>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">ステップ {step} / 3</span>
              <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      Livitに事前登録
                    </h1>
                    <p className="text-gray-600">
                      基本情報を入力してください
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="name">お名前（ニックネーム可）</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">年齢</Label>
                    <select
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="under18">18歳未満</option>
                      <option value="18-24">18-24歳</option>
                      <option value="25-34">25-34歳</option>
                      <option value="35-44">35-44歳</option>
                      <option value="over45">45歳以上</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1]">
                    次へ
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Interests */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      興味のあるカテゴリー
                    </h1>
                    <p className="text-gray-600">
                      該当するものをすべて選択してください
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'fashion', label: 'ファッション', icon: '👗' },
                      { id: 'beauty', label: 'ビューティー', icon: '💄' },
                      { id: 'lifestyle', label: 'ライフスタイル', icon: '🏠' },
                      { id: 'food', label: 'フード', icon: '🍽️' },
                      { id: 'tech', label: 'ガジェット', icon: '📱' },
                      { id: 'fitness', label: 'フィットネス', icon: '💪' },
                      { id: 'travel', label: '旅行', icon: '✈️' },
                      { id: 'pet', label: 'ペット', icon: '🐾' }
                    ].map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleInterestToggle(category.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.interests.includes(category.id)
                            ? 'border-[#FF6B9D] bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{category.icon}</div>
                        <div className="text-sm font-medium">{category.label}</div>
                      </button>
                    ))}
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1]">
                    次へ
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 3: Favorite Influencer */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      最後の質問
                    </h1>
                    <p className="text-gray-600">
                      好きなインフルエンサーを教えてください
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="favoriteInfluencer">
                      お気に入りのインフルエンサー（任意）
                    </Label>
                    <Input
                      id="favoriteInfluencer"
                      name="favoriteInfluencer"
                      value={formData.favoriteInfluencer}
                      onChange={handleChange}
                      placeholder="例：kemio、ゆうちゃみ、なえなの"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      複数いる場合はカンマで区切ってください
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h3 className="font-bold mb-3">登録特典</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        初回購入1,000円OFFクーポン
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        アーリーアダプターVIPバッジ
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        限定配信への優先アクセス権
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        新機能の先行体験
                      </li>
                    </ul>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1]">
                    登録完了
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </form>
          </Card>

          {/* Why Pre-register */}
          <div className="mt-12 text-center">
            <h2 className="text-xl font-bold mb-6">
              なぜ事前登録？
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">限定特典</h3>
                <p className="text-sm text-gray-600">
                  事前登録者だけの特別クーポンとVIPバッジ
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#C44FF1] to-[#4ECDC4] rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">先行アクセス</h3>
                <p className="text-sm text-gray-600">
                  人気配信の優先視聴権と新機能の先行体験
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#4ECDC4] to-[#FFE66D] rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">限定商品</h3>
                <p className="text-sm text-gray-600">
                  事前登録者限定の特別商品へのアクセス
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PreRegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreRegisterContent />
    </Suspense>
  )
}