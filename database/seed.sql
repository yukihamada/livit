-- Livit デモデータ投入スクリプト
-- デモ用のサンプルデータを投入します

-- デモユーザー作成（実際の環境では認証システムから作成されます）
-- これはテスト用のプロファイルデータのみ

-- インフルエンサー/配信者のプロファイル
INSERT INTO public.profiles (id, username, display_name, avatar_url, bio, is_streamer, follower_count) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'aika_beauty', '愛香', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', 'コスメ大好き💄 毎週火・木・土 20時〜配信中！', true, 28500),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'yuki_fashion', 'ゆき', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop', 'ファッション配信者 | トレンドをお届け✨', true, 45200),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'riku_tech', 'りく', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', 'ガジェット系配信者📱 最新テクノロジーをレビュー', true, 32100),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'miu_lifestyle', 'みう', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', 'ライフスタイル全般をお届け🌿', true, 52300)
ON CONFLICT (id) DO NOTHING;

-- 商品データ投入
INSERT INTO public.products (seller_id, category_id, name, description, price, original_price, discount_percentage, image_urls, stock_quantity) VALUES
-- コスメ商品
('d290f1ee-6c54-4b01-90e6-d701748f0851', (SELECT id FROM categories WHERE slug = 'beauty'), 
 'マットリップティント 5色セット', 
 '落ちにくい！発色抜群のリップティント。全5色のお得なセット。', 
 2980, 3980, 25, 
 ARRAY['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'],
 50),

('d290f1ee-6c54-4b01-90e6-d701748f0851', (SELECT id FROM categories WHERE slug = 'beauty'), 
 'グロウハイライター', 
 '自然なツヤ感を演出。微細パールで上品な仕上がり。', 
 1980, 2480, 20, 
 ARRAY['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop'],
 30),

-- ファッション商品
('d290f1ee-6c54-4b01-90e6-d701748f0852', (SELECT id FROM categories WHERE slug = 'fashion'), 
 'オーバーサイズニット', 
 '今季トレンドのゆったりシルエット。全4色展開。', 
 4980, 6980, 29, 
 ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop'],
 20),

('d290f1ee-6c54-4b01-90e6-d701748f0852', (SELECT id FROM categories WHERE slug = 'fashion'), 
 'プリーツスカート', 
 '動くたびに揺れる美しいプリーツ。オフィスにも◎', 
 3980, 5480, 27, 
 ARRAY['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop'],
 15),

-- ガジェット商品
('d290f1ee-6c54-4b01-90e6-d701748f0853', (SELECT id FROM categories WHERE slug = 'electronics'), 
 'ワイヤレスイヤホン Pro', 
 'ノイズキャンセリング搭載。最大30時間再生。', 
 8980, 12980, 31, 
 ARRAY['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop'],
 10),

('d290f1ee-6c54-4b01-90e6-d701748f0853', (SELECT id FROM categories WHERE slug = 'electronics'), 
 'スマートウォッチ', 
 '健康管理から通知確認まで。防水仕様。', 
 19800, 29800, 34, 
 ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'],
 8),

-- ホーム・生活商品
('d290f1ee-6c54-4b01-90e6-d701748f0854', (SELECT id FROM categories WHERE slug = 'home'), 
 'アロマディフューザー', 
 'タイマー付き。7色LEDライト搭載。', 
 3480, 4980, 30, 
 ARRAY['https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=400&h=400&fit=crop'],
 25),

('d290f1ee-6c54-4b01-90e6-d701748f0854', (SELECT id FROM categories WHERE slug = 'home'), 
 '収納ボックス 3個セット', 
 '折りたたみ可能。おしゃれな北欧デザイン。', 
 2980, 3980, 25, 
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'],
 40);

-- ライブストリームデータ
INSERT INTO public.live_streams (host_id, title, description, thumbnail_url, category, status, scheduled_start, actual_start, viewer_count, peak_viewers) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 
 '【限定】新作コスメ先行販売！スペシャル特価', 
 '今夜限りの特別価格！人気リップの新色を先行公開します💄', 
 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
 'コスメ', 'live', 
 NOW() - INTERVAL '30 minutes', 
 NOW() - INTERVAL '30 minutes', 
 2847, 3200),

('d290f1ee-6c54-4b01-90e6-d701748f0852', 
 '秋冬トレンドファッション特集', 
 '今季マストバイアイテムをご紹介！コーデ提案も🧥', 
 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
 'ファッション', 'scheduled', 
 NOW() + INTERVAL '2 hours', 
 NULL, 
 0, 0),

('d290f1ee-6c54-4b01-90e6-d701748f0853', 
 '最新ガジェットレビュー生配信', 
 '話題の新製品を実機レビュー！質問も受付中📱', 
 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop',
 'ガジェット', 'live', 
 NOW() - INTERVAL '15 minutes', 
 NOW() - INTERVAL '15 minutes', 
 1523, 1800),

('d290f1ee-6c54-4b01-90e6-d701748f0854', 
 'おうち時間を快適に！便利グッズ紹介', 
 'インテリアから収納まで、暮らしが楽しくなるアイテム🏠', 
 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=600&fit=crop',
 'ライフスタイル', 'ended', 
 NOW() - INTERVAL '2 days', 
 NOW() - INTERVAL '2 days', 
 0, 4521);

-- ストリーム商品関連付け
INSERT INTO public.stream_products (stream_id, product_id, special_price, sold_count) VALUES
((SELECT id FROM live_streams WHERE title LIKE '%新作コスメ%'), 
 (SELECT id FROM products WHERE name LIKE '%リップティント%'), 
 2480, 42),

((SELECT id FROM live_streams WHERE title LIKE '%新作コスメ%'), 
 (SELECT id FROM products WHERE name LIKE '%グロウハイライター%'), 
 1580, 28),

((SELECT id FROM live_streams WHERE title LIKE '%ガジェットレビュー%'), 
 (SELECT id FROM products WHERE name LIKE '%ワイヤレスイヤホン%'), 
 7980, 15),

((SELECT id FROM live_streams WHERE title LIKE '%ガジェットレビュー%'), 
 (SELECT id FROM products WHERE name LIKE '%スマートウォッチ%'), 
 16800, 8);

-- フォロー関係のサンプル
INSERT INTO public.follows (follower_id, following_id) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0851')
ON CONFLICT DO NOTHING;