import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/providers/theme-provider'
import { SonnerRoot } from '../components/sonner-root'
import { THEME_STORAGE_SCRIPT } from "../lib/theme-script";
import { AuthSessionBootstrap } from '../components/auth-session-bootstrap'
import { RoleGuard } from '../components/role-guard'
import { AppShell } from '@/components/app-shell'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'InkLink – Writing Platform',
  description: 'InkLink is a modern writing platform for readers and creators.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={inter.variable}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_STORAGE_SCRIPT }}
        />
      </head>
      <body className="font-sans flex flex-col min-h-screen">
        <ThemeProvider>
          <AuthSessionBootstrap />
          <RoleGuard />
          <AppShell>{children}</AppShell>
          <SonnerRoot />
        </ThemeProvider>
      </body>
    </html>
  )
}


// Updated documentation for clarity
