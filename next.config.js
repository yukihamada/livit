/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker本番ビルド用設定
  output: 'standalone',
  
  images: {
    domains: ['via.placeholder.com', 'localhost', 'livitnow.app', 'livitnow.jp'],
    unoptimized: false,
  },
  
  // 本番最適化設定
  experimental: {
    // optimizeCss: true, // ビルドエラーを避けるため一時無効化
  },
  
  // セキュリティヘッダー設定
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // WebRTC用設定
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;