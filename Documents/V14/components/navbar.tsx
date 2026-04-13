'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from './providers/theme-provider'

function MobileMenu({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className="md:hidden pb-4 space-y-2">
      <a href="#features" className="block px-4 py-2 hover:bg-secondary rounded">
        Features
      </a>
      <a href="#how-it-works" className="block px-4 py-2 hover:bg-secondary rounded">
        How it Works
      </a>
      <button
        onClick={toggleTheme}
        className="w-full text-left px-4 py-2 hover:bg-secondary rounded transition-colors flex items-center gap-2"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>
      <a
        href="/auth/login"
        className="block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary-hover transition text-center"
      >
        Login
      </a>
    </div>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">InkLink</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-foreground hover:text-primary transition">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition">
              How it Works
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a
              href="/auth/login"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition"
            >
              Login
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && mounted && (
          <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        )}
      </div>
    </nav>
  )
}
