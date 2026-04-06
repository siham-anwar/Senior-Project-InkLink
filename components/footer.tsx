'use client'

import Link from 'next/link'
import { cn } from '../lib/cn'

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]',
        'hover:scale-[1.03] transition'
      )}
    >
      {children}
    </a>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold tracking-tight">InkLink</div>
            <div className="mt-2 text-sm text-[color:var(--foreground)]/70">
              A modern, content-focused writing platform.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--foreground)]/70">
            <Link href="/about" className="hover:text-[var(--foreground)] transition">
              About
            </Link>
            <Link href="/privacy" className="hover:text-[var(--foreground)] transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--foreground)] transition">
              Terms
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <SocialIcon href="#" label="X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M18.5 2H21l-6.6 7.6L22 22h-6.2l-4.9-6.4L5.5 22H3l7.1-8.2L2 2h6.3l4.4 5.9L18.5 2Zm-1.1 18h1.4L7.9 3.9H6.4L17.4 20Z"
                  fill="currentColor"
                />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.5-.7 1.7-1.1.1-.7.4-1.1.7-1.4-2.3-.3-4.7-1.2-4.7-5.2 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.7 1.1 2.8 0 4-2.4 4.9-4.7 5.2.4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
                />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M6.94 6.5A1.94 1.94 0 1 1 6.94 2.6a1.94 1.94 0 0 1 0 3.9ZM3.9 21.4h6.1V8.5H3.9v12.9ZM13.2 8.5h5.9v1.8h.1c.8-1.4 2.2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.7v6.7h-6.1v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v6h-6.1V8.5Z"
                />
              </svg>
            </SocialIcon>
          </div>
        </div>

        <div className="mt-10 text-xs text-[color:var(--foreground)]/60">
          © {new Date().getFullYear()} InkLink. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

