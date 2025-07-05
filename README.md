# Livit - 次世代ライブコマースプラットフォーム

LivitはZ世代向けの革新的なライブコマースプラットフォームです。リアルタイムストリーミング、インタラクティブショッピング、AI機能を統合し、新しいオンラインショッピング体験を提供します。

## 🚀 機能

- **超低遅延ライブストリーミング**: WebRTCベースの配信システム
- **リアルタイムチャット**: Supabase Realtimeによる即座のコミュニケーション
- **インタラクティブ機能**: 投票、グループ購入、ゲーミフィケーション
- **AI対応コンポーネント**: AR試着、レコメンデーションエンジン（実装準備済み）
- **モバイルレスポンシブ**: すべてのデバイスで最適化された体験

## 🛠 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, React 18
- **スタイリング**: Tailwind CSS, Radix UI
- **バックエンド**: Supabase (認証、データベース、リアルタイム)
- **配信**: WebRTC
- **状態管理**: Zustand
- **デプロイ**: Vercel

## 📦 インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/livit.git
cd livit/web

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してSupabaseの認証情報を設定
```

## 🔧 環境変数

`.env`ファイルに以下の環境変数を設定してください：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 💾 データベースセットアップ

1. Supabaseプロジェクトを作成
2. `database/schema.sql`をSupabaseのSQLエディタで実行
3. `database/seed.sql`でデモデータを投入（オプション）

## 🏃‍♂️ 開発

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プロダクション実行
npm start

# リント
npm run lint

# 型チェック
npm run type-check
```

## 🚀 デプロイ

このプロジェクトはVercelでの自動デプロイが設定されています。

```bash
# Vercelへデプロイ
vercel

# プロダクションデプロイ
vercel --prod
```

GitHubのmainブランチにプッシュすると自動的にデプロイされます。

## 📱 主要ページ

- `/` - ランディングページ
- `/home` - ホーム（ライブ配信一覧）
- `/live/[id]` - ライブ配信視聴ページ
- `/studio` - 配信スタジオ
- `/shop` - ショップページ
- `/profile` - ユーザープロフィール

## 🧪 テスト

```bash
# E2Eテスト実行
npm run test:e2e

# E2Eテスト（UIモード）
npm run test:e2e:ui
```

## 📝 ライセンス

MIT

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを作成して変更内容を説明してください。

## 📞 サポート

問題が発生した場合は、[GitHub Issues](https://github.com/yourusername/livit/issues)でお知らせください。