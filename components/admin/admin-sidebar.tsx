'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Crown,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
  Landmark,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useThemeStore } from '@/app/store/theme-store'
import { useAuthStore } from '@/app/store/authstore'
import { useRouter } from 'next/navigation'

const adminLinks = [
  { href: '/admin/authors', label: 'Authors', icon: BookOpen },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/moderation', label: 'Moderation', icon: ShieldCheck },
  { href: '/admin/premium', label: 'Premium', icon: Crown },
  { href: '/admin/revenue', label: 'Revenue', icon: Landmark },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useThemeStore()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-b border-border/70 bg-[radial-gradient(circle_at_top,_rgba(139,0,0,0.14),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] dark:bg-[radial-gradient(circle_at_top,_rgba(139,0,0,0.16),_transparent_28%),linear-gradient(180deg,rgba(10,10,10,0.98),rgba(18,18,18,0.96))] lg:sticky lg:top-0 lg:h-screen lg:max-w-[300px] lg:border-b-0 lg:border-r">

      {/* HEADER */}
      <div className="border-b border-border/70 px-6 py-7">
        <Link href="/admin" className="group block">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[var(--primary-hover)] text-primary-foreground shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                InkLink
              </p>
              <h2 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                Admin Panel
              </h2>
            </div>
          </div>
        </Link>

        <Link
          href="/admin"
          className={cn(
            'mt-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all',
            pathname === '/admin'
              ? 'border-primary/30 bg-primary/10 text-primary shadow-sm'
              : 'border-border/70 bg-background/70 text-foreground/80 hover:border-primary/20 hover:bg-background hover:text-foreground',
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* NAV */}
      <div className="flex-1 px-4 py-6">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Management
        </p>

        <nav className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {adminLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-[var(--primary-hover)] text-primary-foreground shadow-lg'
                    : 'text-foreground/75 hover:bg-background/90 hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl border transition-colors',
                    isActive
                      ? 'border-white/20 bg-white/10'
                      : 'border-border/70 bg-background/80 text-primary group-hover:border-primary/20',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="border-t border-border/70 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={toggleTheme}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-4 py-3 text-sm font-bold text-foreground transition-all hover:bg-background shadow-sm"
          >
            {theme === 'dark' ? (
              <><Sun className="h-4 w-4 text-yellow-500" /> Light</>
            ) : (
              <><Moon className="h-4 w-4 text-neutral-600" /> Dark</>
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200/50 bg-red-50/50 text-red-600 transition-all hover:bg-red-50 hover:shadow-md dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/40 p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Version 2.4.0
          </p>
        </div>
      </div>
    </aside>
  )
}