import { chromium } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

const pages = [
  { name: 'landing', path: '/', title: 'ランディングページ' },
  { name: 'login', path: '/login', title: 'ログインページ' },
  { name: 'signup', path: '/signup', title: 'サインアップページ' },
  { name: 'home', path: '/home', title: 'ホームページ' },
  { name: 'live-list', path: '/live', title: 'ライブ配信一覧' },
  { name: 'live-detail', path: '/live/1', title: 'ライブ配信詳細' },
  { name: 'shop', path: '/shop', title: 'ショップページ' },
  { name: 'product-detail', path: '/products/1', title: '商品詳細ページ' },
  { name: 'trending', path: '/trending', title: 'トレンドページ' },
  { name: 'profile', path: '/profile', title: 'プロフィールページ' },
];

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const screenshotDir = path.join(process.cwd(), 'screenshots');
  await fs.mkdir(screenshotDir, { recursive: true });
  
  const results = [];
  
  for (const pageInfo of pages) {
    console.log(`Capturing ${pageInfo.name}...`);
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`http://localhost:3000${pageInfo.path}`, {
        waitUntil: 'networkidle',
      });
      
      // Wait for animations to complete
      await page.waitForTimeout(1000);
      
      const filename = `${pageInfo.name}-${viewport.name}.png`;
      const filepath = path.join(screenshotDir, filename);
      
      await page.screenshot({
        path: filepath,
        fullPage: true,
      });
      
      results.push({
        page: pageInfo.title,
        path: pageInfo.path,
        viewport: viewport.name,
        filename,
      });
    }
  }
  
  await browser.close();
  return results;
}

async function generateReport(results: any[]) {
  const reportPath = path.join(process.cwd(), 'screenshots', 'report.html');
  
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Livit スクリーンショットレポート</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    .page-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .viewport-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .screenshot {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .screenshot img {
      width: 100%;
      height: auto;
      display: block;
    }
    .screenshot-label {
      background: #f8f9fa;
      padding: 8px 12px;
      font-weight: 500;
      text-align: center;
      border-top: 1px solid #ddd;
    }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .status.complete {
      background-color: #d4edda;
      color: #155724;
    }
    .summary {
      background-color: #e9ecef;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .summary-item {
      background: white;
      padding: 15px;
      border-radius: 4px;
      text-align: center;
    }
    .summary-number {
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
    }
  </style>
</head>
<body>
  <h1>Livit スクリーンショットレポート</h1>
  <p>生成日時: ${new Date().toLocaleString('ja-JP')}</p>
  
  <div class="summary">
    <h2>概要</h2>
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-number">${pages.length}</div>
        <div>ページ数</div>
      </div>
      <div class="summary-item">
        <div class="summary-number">${viewports.length}</div>
        <div>ビューポート</div>
      </div>
      <div class="summary-item">
        <div class="summary-number">${results.length}</div>
        <div>総スクリーンショット数</div>
      </div>
      <div class="summary-item">
        <div class="summary-number">✓</div>
        <div>ステータス: 完了</div>
      </div>
    </div>
  </div>
  
  ${pages.map(pageInfo => `
    <div class="page-section">
      <h2>${pageInfo.title}</h2>
      <p>パス: <code>${pageInfo.path}</code> <span class="status complete">実装済み</span></p>
      <div class="viewport-grid">
        ${viewports.map(viewport => {
          const result = results.find(r => 
            r.page === pageInfo.title && r.viewport === viewport.name
          );
          return `
            <div class="screenshot">
              <img src="${result?.filename}" alt="${pageInfo.title} - ${viewport.name}">
              <div class="screenshot-label">
                ${viewport.name.toUpperCase()} (${viewport.width}x${viewport.height})
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('')}
  
  <div class="page-section">
    <h2>実装機能一覧</h2>
    <ul>
      <li>✅ ランディングページ（自動リダイレクト付き）</li>
      <li>✅ ユーザー認証（ログイン/サインアップ）</li>
      <li>✅ Supabase統合</li>
      <li>✅ ライブ配信機能（一覧・詳細表示）</li>
      <li>✅ リアルタイムチャット</li>
      <li>✅ 商品一覧・検索・フィルタリング</li>
      <li>✅ 商品詳細ページ</li>
      <li>✅ カート機能</li>
      <li>✅ トレンドページ</li>
      <li>✅ プロフィール・注文履歴</li>
      <li>✅ レスポンシブデザイン（デスクトップ/タブレット/モバイル）</li>
      <li>✅ E2Eテスト（Playwright）</li>
      <li>✅ CI/CDパイプライン（GitHub Actions）</li>
    </ul>
  </div>
  
  <div class="page-section">
    <h2>テスト結果</h2>
    <p>E2Eテストが実装されており、以下の項目をカバーしています：</p>
    <ul>
      <li>ホームページナビゲーション</li>
      <li>認証フロー（ログイン/サインアップ）</li>
      <li>ライブ配信の表示と操作</li>
      <li>商品の検索・フィルタリング</li>
      <li>カートへの追加</li>
      <li>レスポンシブ表示の確認</li>
    </ul>
    <p><code>npm run test:e2e</code> で全テストを実行できます。</p>
  </div>
</body>
</html>
  `;
  
  await fs.writeFile(reportPath, html);
  console.log(`Report generated at: ${reportPath}`);
}

async function main() {
  try {
    console.log('Starting screenshot capture...');
    const results = await captureScreenshots();
    
    console.log('\nGenerating report...');
    await generateReport(results);
    
    console.log('\n✅ All screenshots captured and report generated successfully!');
    console.log(`📁 Screenshots saved in: ${path.join(process.cwd(), 'screenshots')}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();