import { Shield } from 'lucide-react'

export function ModerationHighlight() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="h-64 md:h-80 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-border flex items-center justify-center">
            <Shield size={64} className="text-primary/30" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Safe Community
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              We take community safety seriously. Our moderation system ensures a positive experience for all users.
            </p>
            <ul className="space-y-3">
              {['Content moderation', 'User safety tools', 'Report system', 'Community guidelines'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
