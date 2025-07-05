import { Header } from '@/components/layout/header'
import { BottomNavigation, SideNavigation } from '@/components/layout/navigation'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNavigation />
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <BottomNavigation />
    </div>
  )
}