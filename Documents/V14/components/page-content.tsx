'use client'

import { Navbar } from './navbar'
import { Hero } from './hero'
import { Features } from './features'
import { HowItWorks } from './how-it-works'
import { ContentPreview } from './content-preview'
import { ModerationHighlight } from './moderation-highlight'
import { Testimonials } from './testimonials'
import { CtaSection } from './cta-section'
import { Footer } from './footer'

export function PageContent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ContentPreview />
        <ModerationHighlight />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
