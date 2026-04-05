'use client';

import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AuthorSettings {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  language: 'en' | 'am';
  notificationsEnabled: boolean;
  emailUpdates: boolean;
  privateAccount: boolean;
}

interface SettingsFormProps {
  initialSettings?: Partial<AuthorSettings>;
  onSave?: (settings: AuthorSettings) => void;
}

export function SettingsForm({ initialSettings, onSave }: SettingsFormProps) {
  const [settings, setSettings] = useState<AuthorSettings>({
    firstName: 'Almaz',
    lastName: 'Tekle',
    email: 'almaz@inklink.com',
    bio: 'Ethiopian author passionate about digital publishing',
    language: 'en',
    notificationsEnabled: true,
    emailUpdates: true,
    privateAccount: false,
    ...initialSettings,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof AuthorSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaved(true);
    onSave?.(settings);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {saved && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-400">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Information */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-card to-card/50">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your author profile details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">First Name</label>
              <Input
                value={settings.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <Input
                value={settings.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input value={settings.email} disabled className="mt-2 bg-muted" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Bio</label>
            <Textarea
              value={settings.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell your readers about yourself..."
              className="mt-2 resize-none"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Preferences */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-card to-card/50">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your language and notification settings</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Preferred Language</label>
            <Select value={settings.language} onValueChange={(value: any) => handleChange('language', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="am">Amharic (አማርኛ)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">
                Enable notifications
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailUpdates}
                onChange={(e) => handleChange('emailUpdates', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">
                Receive email updates about my stories
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privateAccount}
                onChange={(e) => handleChange('privateAccount', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">
                Make my account private
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Monetization Settings */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-card to-card/50">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
          <CardTitle>Monetization</CardTitle>
          <CardDescription>Manage your payment and earning preferences</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Alert className="border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              Payment method: Chapa (Connected)
            </AlertDescription>
          </Alert>

          <div className="pt-4 space-y-2">
            <p className="text-sm font-medium text-foreground">Earnings Settings</p>
            <p className="text-sm text-muted-foreground">
              Adjust how your stories are monetized and set your preferred payout schedule.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-2 sticky bottom-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-lg"
          size="lg"
        >
          <Save className="h-5 w-5" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
