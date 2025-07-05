'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Play, Sparkles, ShoppingBag, Users, Heart, TrendingUp, Gift, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'

export default function LivitLandingPage() {
  const [email, setEmail] = useState('')

  const handlePreRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // 事前登録処理
    window.location.href = '/preregister?email=' + encodeURIComponent(email)
  }

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
              Livit
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">特徴</Link>
            <Link href="#influencers" className="text-gray-600 hover:text-gray-900">配信者</Link>
            <Link href="#brands" className="text-gray-600 hover:text-gray-900">ブランド</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">ログイン</Link>
            <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1]">
              今すぐ始める
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600">2025年7月 グランドローンチ</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] bg-clip-text text-transparent">
                Live it now!
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-800">
              ライブで繋がる、今すぐ買える
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Livitは、インフルエンサーとファンをリアルタイムで繋ぐ次世代ライブコマースプラットフォーム。
            AI機能とエンターテインメントを融合し、新しいショッピング体験を提供します。
          </p>

          {/* Pre-registration Form */}
          <form onSubmit={handlePreRegister} className="max-w-md mx-auto flex gap-2">
            <Input
              type="email"
              placeholder="メールアドレスを入力"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] px-6">
              事前登録
            </Button>
          </form>
          <p className="text-sm text-gray-500">
            事前登録で限定特典とアーリーアクセス権をゲット！
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8">
            <div>
              <p className="text-3xl font-bold text-[#FF6B9D]">10K+</p>
              <p className="text-sm text-gray-600">事前登録者</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#C44FF1]">50+</p>
              <p className="text-sm text-gray-600">人気配信者</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#4ECDC4]">100+</p>
              <p className="text-sm text-gray-600">提携ブランド</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] bg-clip-text text-transparent">
                革新的な機能
              </span>
            </h2>
            <p className="text-gray-600">エンターテインメントとコマースの完璧な融合</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AR試着 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">AR試着機能</h3>
              <p className="text-gray-600">
                リアルタイムで服やアクセサリーを試着。購入前に自分に合うか確認できます。
              </p>
            </div>

            {/* グループ購入 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#C44FF1] to-[#4ECDC4] rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">グループ購入</h3>
              <p className="text-gray-600">
                みんなで買うとお得！参加人数に応じて割引率がアップします。
              </p>
            </div>

            {/* ゲーミフィケーション */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FFE66D] to-[#FF6B9D] rounded-lg flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">ポイント&バッジ</h3>
              <p className="text-gray-600">
                視聴・購入・シェアでポイントゲット。レベルアップで限定特典も！
              </p>
            </div>

            {/* AIレコメンド */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4ECDC4] to-[#44A8F1] rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">AIレコメンド</h3>
              <p className="text-gray-600">
                あなたの好みを学習し、最適な商品とライブを提案します。
              </p>
            </div>

            {/* リアルタイム投票 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4ECDC4] to-[#52D98A] rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">インタラクティブ</h3>
              <p className="text-gray-600">
                投票やクイズで配信に参加。視聴者全員で作る楽しい体験。
              </p>
            </div>

            {/* 限定商品 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#C44FF1] to-[#FF6B9D] rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">限定商品</h3>
              <p className="text-gray-600">
                Livitでしか買えない限定アイテムや先行販売商品が盛りだくさん。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Influencer Section */}
      <section id="influencers" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] bg-clip-text text-transparent">
                トップインフルエンサー
              </span>
            </h2>
            <p className="text-gray-600">人気配信者が続々参加中！</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* kemio */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-400"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">kemio</h3>
                <p className="text-gray-600 mb-4">ファッション×エンタメ</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    2.5M
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    4.9
                  </span>
                </div>
              </div>
            </div>

            {/* ゆうちゃみ */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">ゆうちゃみ</h3>
                <p className="text-gray-600 mb-4">ギャル系ファッション</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    1.8M
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    4.8
                  </span>
                </div>
              </div>
            </div>

            {/* なえなの */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-400"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">なえなの</h3>
                <p className="text-gray-600 mb-4">カジュアルファッション</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    2.2M
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    4.9
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="gap-2">
              配信者として参加する
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Partners Section */}
      <section id="brands" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] bg-clip-text text-transparent">
                パートナーブランド
              </span>
            </h2>
            <p className="text-gray-600">人気ブランドが続々参加</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['COHINA', '17kg', 'SHIRO', 'rom&nd', 'CANMAKE', 'Francfranc', '3COINS', 'fifth', 'SHOPLIST', 'AWESOME STORE', 'to/one', 'LAKOLE'].map((brand) => (
              <div key={brand} className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <p className="font-semibold text-gray-700">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            今すぐLivitを始めよう
          </h2>
          <p className="text-lg mb-8 text-white/90">
            事前登録で限定特典をゲット！2025年7月のローンチをお楽しみに。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#FF6B9D] hover:bg-gray-100">
              事前登録する
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              詳しく見る
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B9D] to-[#C44FF1] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-xl font-bold">Livit</span>
              </div>
              <p className="text-gray-400 text-sm">
                Live it now! ライブで繋がる、今すぐ買える。
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サービス</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">Livitについて</Link></li>
                <li><Link href="/features" className="hover:text-white">機能紹介</Link></li>
                <li><Link href="/pricing" className="hover:text-white">料金プラン</Link></li>
                <li><Link href="/support" className="hover:text-white">サポート</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">パートナー</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/creator/apply" className="hover:text-white">配信者募集</Link></li>
                <li><Link href="/brand/partner" className="hover:text-white">ブランドパートナー</Link></li>
                <li><Link href="/affiliate" className="hover:text-white">アフィリエイト</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">会社情報</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/company" className="hover:text-white">運営会社</Link></li>
                <li><Link href="/terms" className="hover:text-white">利用規約</Link></li>
                <li><Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link></li>
                <li><Link href="/contact" className="hover:text-white">お問い合わせ</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Livit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}