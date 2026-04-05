'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  highlighted?: boolean;
  cta: string;
  onCtaClick?: () => void;
}

export function PricingCard({
  name,
  description,
  price,
  period,
  features,
  highlighted,
  cta,
  onCtaClick,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-xl border-0 transition-all duration-300 overflow-hidden ${
        highlighted
          ? 'bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl ring-2 ring-primary/30 md:scale-105'
          : 'bg-card shadow-lg hover:shadow-xl hover:border-primary/20'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-1.5 text-xs font-semibold text-white shadow-lg">
          Most Popular
        </div>
      )}

      <div className="px-8 py-10">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">{name}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>

        {/* Price Section */}
        <div className="mt-8 flex items-baseline gap-2">
          {price === 0 ? (
            <span className="text-5xl font-bold text-foreground">Free</span>
          ) : (
            <>
              <span className="text-5xl font-bold text-primary">₦{price}</span>
              <span className="text-muted-foreground text-lg">
                /{period === 'month' ? 'month' : 'year'}
              </span>
            </>
          )}
        </div>

        {price > 0 && period === 'year' && (
          <p className="mt-3 text-sm font-medium text-primary/80">
            Save {Math.round(((price * 12 - (price * 12 * 0.917)) / (price * 12)) * 100)}% with yearly billing
          </p>
        )}

        {/* CTA Button */}
        <Button
          onClick={onCtaClick}
          className={`mt-10 w-full font-semibold shadow-lg hover:shadow-xl transition-all ${
            highlighted
              ? 'bg-primary hover:bg-primary/90 text-white'
              : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
          }`}
          size="lg"
        >
          {cta}
        </Button>

        {/* Features List */}
        <div className="mt-10 space-y-4 border-t border-border/50 pt-10">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
