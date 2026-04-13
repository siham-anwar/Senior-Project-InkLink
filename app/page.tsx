import dynamic from 'next/dynamic'
import { Navbar } from '../components/navbar'
import { Hero } from '../components/hero'
import { Footer } from '../components/footer'

const Features = dynamic(() => import('../components/features').then((m) => m.Features), {
  loading: () => <div className="h-24" />,
})
const HowItWorks = dynamic(() => import('../components/how-it-works').then((m) => m.HowItWorks), {
  loading: () => <div className="h-24" />,
})
const ContentPreview = dynamic(
  () => import('../components/content-preview').then((m) => m.ContentPreview),
  { loading: () => <div className="h-24" /> }
)
const ModerationHighlight = dynamic(
  () => import('../components/moderation-highlight').then((m) => m.ModerationHighlight),
  { loading: () => <div className="h-24" /> }
)
const Testimonials = dynamic(
  () => import('../components/testimonials').then((m) => m.Testimonials),
  { loading: () => <div className="h-24" /> }
)
const CtaSection = dynamic(
  () => import('../components/cta-section').then((m) => m.CtaSection),
  { loading: () => <div className="h-24" /> }
)

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ContentPreview />
        <ModerationHighlight />
        <Testimonials />
        <CtaSection />
      </main>

    </div>
  )
}


