import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/providers/theme-provider'
import { SonnerRoot } from '../components/sonner-root'
import { THEME_STORAGE_SCRIPT } from "../lib/theme-script";
import { AuthSessionBootstrap } from '../components/auth-session-bootstrap'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'InkLink – Writing Platform',
  description: 'InkLink is a modern writing platform for readers and creators.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_STORAGE_SCRIPT }}
        />
      </head>
      <body className="font-sans flex flex-col min-h-screen">
        <ThemeProvider>
          <AuthSessionBootstrap />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <SonnerRoot />
        </ThemeProvider>
      </body>
    </html>
  )
}

