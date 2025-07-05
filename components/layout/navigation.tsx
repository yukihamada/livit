'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Play, 
  Store, 
  User,
  Search,
  TrendingUp
} from 'lucide-react'

const navItems = [
  {
    label: 'ホーム',
    href: '/home',
    icon: Home,
  },
  {
    label: 'ライブ',
    href: '/live',
    icon: Play,
  },
  {
    label: 'ショップ',
    href: '/shop',
    icon: Store,
  },
  {
    label: 'トレンド',
    href: '/trending',
    icon: TrendingUp,
  },
  {
    label: 'プロフィール',
    href: '/profile',
    icon: User,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function SideNavigation() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-card/50 border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">メニュー</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Categories */}
      <div className="p-6 border-t">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">カテゴリー</h3>
        <div className="space-y-2">
          {['コスメ', 'ファッション', 'グルメ', '雑貨', 'テック'].map((category) => (
            <Link
              key={category}
              href={`/category/${category}`}
              className="block px-3 py-1 text-sm rounded hover:bg-muted transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Live Status */}
      <div className="mt-auto p-6 border-t">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-primary rounded-full live-pulse" />
          <span className="text-muted-foreground">12 ライブ配信中</span>
        </div>
      </div>
    </aside>
  )
}