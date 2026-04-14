import { Pen, Users, BookOpen, Zap } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Pen,
      title: 'Easy Publishing',
      description: 'Write and publish your stories in minutes with our intuitive editor.',
    },
    {
      icon: Users,
      title: 'Build Community',
      description: 'Connect with readers and other writers who love your work.',
    },
    {
      icon: BookOpen,
      title: 'Discover Content',
      description: 'Find millions of stories across all genres and categories.',
    },
    {
      icon: Zap,
      title: 'Grow Your Audience',
      description: 'Reach new readers and grow your fanbase organically.',
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
          Everything You Need to Succeed
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="p-6 rounded-lg bg-background border border-border hover:border-primary transition">
                <Icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
