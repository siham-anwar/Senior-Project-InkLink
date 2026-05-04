'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '../lib/cn'

/* ── tiny social icon button ─────────────────────────────────── */
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
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        'bg-foreground/[0.06] text-foreground/60',
        'hover:bg-primary/15 hover:text-primary hover:scale-110',
        'transition-all duration-300 ease-out'
      )}
    >
      {children}
    </a>
  )
}

/* ── footer ──────────────────────────────────────────────────── */
export function Footer() {
  const pathname = usePathname()
  if (pathname === '/children') return null

  const currentYear = new Date().getFullYear()

  const platformLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/library', label: 'Library' },
    { href: '/premium', label: 'Premium' },
  ]

  const companyLinks = [
    { href: '/about', label: 'About' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ]

  const creatorLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/editor', label: 'Start Writing' },
  ]

  return (
    <footer className="relative border-t border-border bg-card/60 backdrop-blur-sm">
      {/* Subtle gradient accent at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
        {/* ── Top section: logo + nav columns ──────────────── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Logo & tagline column — takes more space */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
              <img
                src="/logo3.png"
                alt="InKling Logo"
                className="h-35 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground/50">
              The modern platform where stories come alive.
              Write, read, publish, and earn — all in one place.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon href="#" label="X (Twitter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18.5 2H21l-6.6 7.6L22 22h-6.2l-4.9-6.4L5.5 22H3l7.1-8.2L2 2h6.3l4.4 5.9L18.5 2Zm-1.1 18h1.4L7.9 3.9H6.4L17.4 20Z"
                    fill="currentColor"
                  />
                </svg>
              </SocialIcon>

              <SocialIcon href="#" label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.5-.7 1.7-1.1.1-.7.4-1.1.7-1.4-2.3-.3-4.7-1.2-4.7-5.2 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.7 1.1 2.8 0 4-2.4 4.9-4.7 5.2.4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
                  />
                </svg>
              </SocialIcon>

              <SocialIcon href="#" label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM6.897 20.452H3.78V9h3.117v11.452Z"
                  />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 lg:col-span-8">
            {/* Platform */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                Platform
              </h3>
              <ul className="mt-4 space-y-3">
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/60 transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/60 transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Creators */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                Creators
              </h3>
              <ul className="mt-4 space-y-3">
                {creatorLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/60 transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────── */}
        <div className="mt-14 border-t border-border/60" />

        {/* ── Bottom bar ───────────────────────────────────── */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-foreground/40">
            © {currentYear} InKling. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-foreground/40 transition-colors hover:text-foreground/70"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-foreground/40 transition-colors hover:text-foreground/70"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
