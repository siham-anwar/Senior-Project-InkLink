'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SettingsForm } from '@/components/shared/settings-form';

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-background via-background to-secondary/10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/author/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Author Settings
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">
            Manage your profile, preferences, and monetization settings
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <SettingsForm
        onSave={(settings) => {
          console.log('[v0] Settings saved:', settings);
        }}
      />
    </div>
  );
}
