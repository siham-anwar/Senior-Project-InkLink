'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

interface PricingTier {
  name: 'Weekly' | 'Monthly' | 'Annual';
  currentPrice: number;
  newPrice: number;
}

export default function PremiumPage() {
  const [pricing, setPricing] = useState<PricingTier[]>([
    { name: 'Weekly', currentPrice: 249.99, newPrice: 249.99 },
    { name: 'Monthly', currentPrice: 999.99, newPrice: 999.99 },
    { name: 'Annual', currentPrice: 9999.99, newPrice: 9999.99 },
  ]);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const handlePriceChange = (index: number, newPrice: string) => {
    const updatedPricing = [...pricing];
    updatedPricing[index].newPrice = parseFloat(newPrice) || 0;
    setPricing(updatedPricing);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      const updatedPricing = pricing.map((tier) => ({
        ...tier,
        currentPrice: tier.newPrice,
      }));
      setPricing(updatedPricing);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const hasChanges = pricing.some((tier) => tier.currentPrice !== tier.newPrice);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-20">
        <div className="w-full px-6 py-8 max-w-full">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Premium Subscription</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage subscription pricing tiers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-12 max-w-full">
        <div className="max-w-4xl">
          {/* Info Section */}
          <div className="mb-12 p-6 rounded-xl border border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Subscription Pricing Configuration
            </h2>
            <p className="text-muted-foreground text-sm">
              Update the pricing for each subscription tier. Changes will be applied to new subscriptions immediately.
            </p>
          </div>

          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {pricing.map((tier, index) => (
              <div
                key={tier.name}
                className="rounded-xl border border-border bg-card p-6"
              >
                {/* Tier Name */}
                <h3 className="text-xl font-bold text-foreground mb-6">
                  {tier.name}
                </h3>

                {/* Current Price */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-muted-foreground uppercase block mb-2">
                    Current Price
                  </label>
                  <p className="text-3xl font-bold text-accent">
                    {tier.currentPrice.toFixed(2)} ETB
                  </p>
                </div>

                {/* Price Input */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-muted-foreground uppercase block mb-2">
                    New Price
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">ETB</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={tier.newPrice}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Change Indicator */}
                {tier.currentPrice !== tier.newPrice && (
                  <div className="mb-6 p-3 rounded-lg bg-accent/10 border border-accent/30">
                    <p className="text-xs text-accent font-medium">
                      Change: {(tier.newPrice - tier.currentPrice).toFixed(2)} ETB
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between gap-4">
            <div>
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-accent">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Pricing updated successfully!</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === 'saving'}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                saveStatus === 'saving'
                  ? 'bg-accent/50 text-background cursor-not-allowed'
                  : hasChanges
                  ? 'bg-accent hover:bg-accent/90 text-background cursor-pointer'
                  : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
              }`}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Summary Section */}
          <div className="mt-12 p-6 rounded-xl border border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
            <div className="space-y-3">
              {pricing.map((tier) => (
                <div key={tier.name} className="flex items-center justify-between pb-3 border-b border-border last:border-b-0">
                  <span className="text-muted-foreground">{tier.name} Plan</span>
                  <span className="font-semibold text-foreground">{tier.currentPrice.toFixed(2)} ETB</span>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
