/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    domains: [
      'images.unsplash.com',
      'rmjjqanzhlitfwqwbvrm.supabase.co',
      'via.placeholder.com',
      'localhost'
    ],
    unoptimized: true,
  },
  
  // Experimental features for Supabase
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
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
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=*, geolocation=self',
          },
        ],
      },
    ];
  },
  
  // WebRTC and media files configuration
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]',
      },
    });
    return config;
  },
};

module.exports = nextConfig;