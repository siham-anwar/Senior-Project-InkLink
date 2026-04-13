"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Moon, Sun, X, User, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useThemeStore } from "@/app/store/theme-store";
import { useAuthStore } from "@/app/store/authstore";
import { notificationsService } from "@/app/services/notifications.service";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const user = useAuthStore((s) => s.user);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    notificationsService.getUnreadCount().then(setUnreadCount);
    const interval = setInterval(
      () => notificationsService.getUnreadCount().then(setUnreadCount),
      60_000, // refresh every 60 s
    );
    return () => clearInterval(interval);
  }, [user]);

  if (pathname === '/children') return null;

  const role = user?.role || 'user';

  const links = role === 'child' 
    ? [
        { href: "/children", label: "Kids Mode 🎨" },
        { href: "/library", label: "My Stories" },
      ]
    : [
        { href: "/home", label: "My Readings" },
        { href: "/explore", label: "Explore" },
        ...(role === 'parent' ? [{ href: "/dashboard/parent", label: "Parent Control 🛡️" }] : []),
        { href: "/library", label: "Library" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/editor", label: "Write" }
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          InkLink
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <motion.button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            whileTap={{ scale: 0.94 }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.button>

          {user && (
            <Link
              href="/notifications"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <User className="h-4 w-4" />
              <span>{user.username || 'Profile'}</span>
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-foreground/90 hover:text-primary"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/auth/signup"
                  className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
                >
                  Signup
                </Link>
              </motion.div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <motion.button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            whileTap={{ scale: 0.94 }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.button>

          {user && (
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium",
                    "text-foreground/90 hover:bg-card hover:text-primary",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                {user ? (
                  <>
                    <Link
                      href="/notifications"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-card"
                    >
                      <Bell className="h-4 w-4" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-card"
                    >
                      Profile ({user.username})
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-center text-sm font-medium hover:bg-card"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-white"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
