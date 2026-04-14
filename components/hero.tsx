'use client'

import { ArrowRight, PenTool } from 'lucide-react'

export function Hero() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-white to-red-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-red-950/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">
              Read. Write. Get Paid.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              A platform where writers publish, readers engage, and quality content earns rewards.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => window.location.href = '/auth/signup'}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition font-semibold flex items-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <a
                href="#how-it-works"
                className="px-8 py-3 border border-border rounded-lg hover:bg-secondary transition font-semibold"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Background circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl"></div>
              
              {/* Pen icon with animation */}
              <div className="relative z-10 animate-bounce">
                <div className="relative">
                  {/* Decorative rings */}
                  <div className="absolute inset-0 border-2 border-primary/20 rounded-full w-56 h-56"></div>
                  <div className="absolute inset-4 border-2 border-primary/10 rounded-full w-48 h-48"></div>
                  
                  {/* Main pen icon */}
                  <div className="flex items-center justify-center">
                    <PenTool size={80} className="text-primary stroke-1" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
