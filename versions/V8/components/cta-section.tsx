import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          Ready to Share Your Story?
        </h2>
        <p className="text-lg mb-8 text-balance opacity-90">
          Join thousands of writers and readers on InkLink. Start publishing today.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary-foreground text-primary rounded-lg hover:bg-secondary transition font-semibold"
        >
          Get Started Free <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  )
}
