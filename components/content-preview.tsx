import { Image } from 'lucide-react'

export function ContentPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Rich Formatting & Media Support
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Create engaging stories with our advanced editor. Add images, format text, and bring your stories to life.
            </p>
            <ul className="space-y-3">
              {['Rich text formatting', 'Image uploads', 'Code snippets', 'Tables & lists'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="h-64 md:h-80 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-border flex items-center justify-center">
            <Image size={64} className="text-primary/30" />
          </div>
        </div>
      </div>
    </section>
  )
}
