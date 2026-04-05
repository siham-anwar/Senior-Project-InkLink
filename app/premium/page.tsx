'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingCard } from '@/components/shared/pricing-card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { pricingTiers, faqData } from '@/lib/mock-data';
import { CheckCircle2, Zap, Award, Users } from 'lucide-react';

export default function PremiumPage() {
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');

  const handleUpgradeClick = (tierId: string) => {
    console.log('Upgrade clicked for tier:', tierId);
    // In a real app, this would initiate Chapa payment
    alert(`Starting payment process for ${tierId} tier...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 inline-block bg-accent text-accent-foreground">
            <Zap className="mr-1 h-3 w-3" />
            Premium Membership
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Unlock Unlimited Stories
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Access thousands of premium stories from African writers, support your favorite authors, and enjoy an ad-free reading experience.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center items-center gap-6">
          <span className={`text-sm font-semibold transition-colors ${billingPeriod === 'month' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'month' ? 'year' : 'month')}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all shadow-sm ${
              billingPeriod === 'year'
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                billingPeriod === 'year' ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold transition-colors ${billingPeriod === 'year' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {billingPeriod === 'year' && (
              <Badge className="bg-primary/20 text-primary dark:bg-primary/30">
                Save 17%
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              name={tier.name}
              description={tier.description}
              price={billingPeriod === 'month' ? tier.monthlyPrice : tier.yearlyPrice}
              period={billingPeriod}
              features={tier.features}
              highlighted={tier.highlighted}
              cta={tier.cta}
              onCtaClick={() => handleUpgradeClick(tier.id)}
            />
          ))}
        </div>
      </div>

      {/* Features Highlights */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-4xl font-bold text-foreground">
          Why Choose InkLink Premium?
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CheckCircle2,
              title: 'Unlimited Stories',
              description: 'Access thousands of premium stories from your favorite African authors',
            },
            {
              icon: Users,
              title: 'Support Authors',
              description: 'Your subscription directly supports writers and helps them continue creating',
            },
            {
              icon: Zap,
              title: 'Ad-Free Experience',
              description: 'Enjoy seamless reading without interruptions or advertisements',
            },
            {
              icon: Award,
              title: 'Early Access',
              description: 'Get first access to new chapters and exclusive author content',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 hover:border-primary/30 transition-all shadow-sm hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-fit p-3 rounded-lg mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-primary/20 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground">Ready to explore unlimited stories?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start your 7-day free trial today. No credit card required.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all text-white"
            onClick={() => {
              handleUpgradeClick('creator');
            }}
          >
            Start Free Trial
          </Button>
        </div>
      </div>

      {/* Social Proof */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-8">Trusted by over 50,000 readers across Africa</p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: 'Stories', value: '10,000+' },
              { label: 'Authors', value: '2,500+' },
              { label: 'Readers', value: '50,000+' },
              { label: 'Countries', value: '15+' },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            All payments are secured with Chapa. Your payment information is encrypted and safe.
          </p>
        </div>
      </div>
    </div>
  );
}
