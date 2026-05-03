"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Moon, Sun, X, User, Bell, Crown, Search, Plus, BookOpen, LogOut, Shield } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useThemeStore } from "@/app/store/theme-store";
import { useAuthStore } from "@/app/store/authstore";
import { notificationsService } from "@/app/services/notifications.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    notificationsService.getUnreadCount().then(setUnreadCount);
    const interval = setInterval(
      () => notificationsService.getUnreadCount().then(setUnreadCount),
      60_000,
    );
    return () => clearInterval(interval);
  }, [user]);

  if (pathname === '/children') return null;

  const role = user?.role || 'user';
  const isAdmin = role === 'admin' || user?.email === 'admin@gmail.com';

  // This matches the structure of the previous nav links but with added Premium
  const links = role === 'child' 
    ? [
        { href: "/children", label: "Kids Mode 🎨" },
        { href: "/library", label: "My Stories" },
      ]
    : [
        { href: isAdmin ? "/admin" : "/home", label: "Home" },
        ...(isAdmin ? [{ href: "/admin", label: "Admin Panel", icon: Shield }] : []),
        { href: "/explore", label: "Explore" },
        { href: "/premium", label: "Premium", icon: Crown },
        ...(role === 'parent' ? [{ href: "/dashboard/parent", label: "Parent Dashboard 🛡️" }] : []),
        { href: "/library", label: "Library" },
        ...(user ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/editor", label: "Write" }
        ]: []),
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary flex items-center gap-2"
        >
          InkLink
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5",
                pathname === link.href ? "text-primary" : "text-foreground/80"
              )}
            >
              {link.icon && <link.icon size={16} className="text-amber-500" />}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.94 }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>

          {user && (
            <Link
              href="/notifications"
              className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40"
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
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent outline-none">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard" className="flex items-center w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <motion.button
                type="button"
                onClick={handleLogout}
                whileTap={{ scale: 0.94 }}
                className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-red-500 transition-colors hover:border-red-500/40 hover:bg-red-500/5"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            </div>
          ) : (
            <div className="hidden items-center gap-4 sm:flex">
              <Link href="/auth/login" className="text-sm font-medium text-foreground/90 hover:text-primary">Login</Link>
              <Link href="/auth/signup" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90">Signup</Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden bg-card"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 hover:bg-secondary hover:text-primary"
                >
                  {link.icon && <link.icon size={16} className="text-amber-500" />}
                  {link.label}
                </Link>
              ))}
              {user && (
                <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                  <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 hover:bg-secondary">
                    <User size={16} /> Profile
                  </Link>
                  <button onClick={() => { handleLogout(); setOpen(false); }} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 text-left w-full">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
              {!user && (
                <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                   <Link href="/auth/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-center text-sm font-medium bg-secondary">Login</Link>
                   <Link href="/auth/signup" onClick={() => setOpen(false)} className="rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-white">Signup</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
