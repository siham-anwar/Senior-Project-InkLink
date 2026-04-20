export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Create Account',
      description: 'Sign up and set up your author profile in seconds.',
    },
    {
      number: '2',
      title: 'Write Your Story',
      description: 'Use our powerful editor to write and format your content.',
    },
    {
      number: '3',
      title: 'Share & Publish',
      description: 'Publish your work and share it with the world.',
    },
    {
      number: '4',
      title: 'Grow Your Audience',
      description: 'Engage with readers and grow your community.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-center text-sm">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 -right-4 w-8 h-1 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
