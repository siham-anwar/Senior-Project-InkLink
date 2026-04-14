import { Star } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Author',
      content: 'InkLink helped me reach thousands of readers. The community is supportive and the platform is easy to use.',
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Reader',
      content: 'I discovered amazing stories on InkLink. The recommendation system is incredibly accurate.',
      rating: 5,
    },
    {
      name: 'Elena Rodriguez',
      role: 'Author',
      content: 'Publishing my work here was the best decision. I found my audience and made real connections.',
      rating: 5,
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
          Loved by Creators & Readers
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="p-8 rounded-lg bg-background border border-border hover:shadow-lg transition">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
