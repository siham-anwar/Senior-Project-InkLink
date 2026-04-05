// Mock data for demo purposes
// In production, this would be replaced with real API calls

export interface Story {
  id: string;
  title: string;
  views: number;
  likes: number;
  reviews: number;
  premiumReaders: number;
  revenue: number;
  isPremium: boolean;
  status: 'draft' | 'published' | 'rejected';
  createdAt: Date;
  publishedAt?: Date;
}

export interface EarningRecord {
  date: Date;
  amount: number;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  description: string;
}

export interface AuthorData {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  totalStories: number;
  totalViews: number;
  totalFollowers: number;
  totalEarnings: number;
  currentMonthEarnings: number;
  pendingBalance: number;
  availableForWithdrawal: number;
}

// Mock author data
export const mockAuthor: AuthorData = {
  id: 'author_1',
  name: 'Nezif Tayib',
  email: 'nezif@inklink.com',
  bio: 'Award-winning Ethiopian author specializing in contemporary fiction and historical narratives. Passionate about sharing authentic African stories with the world.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nezif',
  totalStories: 8,
  totalViews: 45230,
  totalFollowers: 1240,
  totalEarnings: 12450,
  currentMonthEarnings: 2180,
  pendingBalance: 450,
  availableForWithdrawal: 8200,
};

// Mock stories
export const mockStories: Story[] = [
  {
    id: 'story_1',
    title: 'The Midnight Market',
    views: 8340,
    likes: 562,
    reviews: 124,
    premiumReaders: 340,
    revenue: 3400,
    isPremium: true,
    status: 'published',
    createdAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-02-01'),
  },
  {
    id: 'story_2',
    title: 'Echoes of Home',
    views: 6250,
    likes: 420,
    reviews: 89,
    premiumReaders: 210,
    revenue: 2100,
    isPremium: true,
    status: 'published',
    createdAt: new Date('2024-02-10'),
    publishedAt: new Date('2024-03-01'),
  },
  {
    id: 'story_3',
    title: 'Desert Dreams',
    views: 5120,
    likes: 340,
    reviews: 76,
    premiumReaders: 180,
    revenue: 1800,
    isPremium: true,
    status: 'published',
    createdAt: new Date('2024-03-05'),
    publishedAt: new Date('2024-03-20'),
  },
  {
    id: 'story_4',
    title: 'The Coffee Ceremony',
    views: 3890,
    likes: 290,
    reviews: 62,
    premiumReaders: 120,
    revenue: 1200,
    isPremium: true,
    status: 'published',
    createdAt: new Date('2024-04-01'),
    publishedAt: new Date('2024-04-10'),
  },
  {
    id: 'story_5',
    title: 'Voices Unheard',
    views: 12450,
    likes: 980,
    reviews: 245,
    premiumReaders: 520,
    revenue: 5200,
    isPremium: true,
    status: 'published',
    createdAt: new Date('2023-11-20'),
    publishedAt: new Date('2023-12-05'),
  },
  {
    id: 'story_6',
    title: 'A New Beginning',
    views: 4320,
    likes: 310,
    reviews: 71,
    premiumReaders: 95,
    revenue: 950,
    isPremium: false,
    status: 'published',
    createdAt: new Date('2024-04-15'),
    publishedAt: new Date('2024-04-20'),
  },
  {
    id: 'story_7',
    title: 'The Heritage Collection',
    views: 2890,
    likes: 180,
    reviews: 45,
    premiumReaders: 0,
    revenue: 0,
    isPremium: false,
    status: 'draft',
    createdAt: new Date('2024-04-25'),
  },
  {
    id: 'story_8',
    title: 'Mountain Whispers',
    views: 3560,
    likes: 250,
    reviews: 58,
    premiumReaders: 135,
    revenue: 1350,
    isPremium: true,
    status: 'published',
    createdAt: new Date('2024-03-15'),
    publishedAt: new Date('2024-04-01'),
  },
];

// Mock earning records for the last 12 months
export const mockEarningHistory: EarningRecord[] = [
  { date: new Date(2023, 4), amount: 450 },
  { date: new Date(2023, 5), amount: 620 },
  { date: new Date(2023, 6), amount: 580 },
  { date: new Date(2023, 7), amount: 890 },
  { date: new Date(2023, 8), amount: 1200 },
  { date: new Date(2023, 9), amount: 1450 },
  { date: new Date(2023, 10), amount: 1890 },
  { date: new Date(2023, 11), amount: 2340 },
  { date: new Date(2024, 0), amount: 1750 },
  { date: new Date(2024, 1), amount: 1920 },
  { date: new Date(2024, 2), amount: 2100 },
  { date: new Date(2024, 3), amount: 2180 },
];

// Mock transaction history
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    date: new Date(2024, 2, 15),
    amount: 5000,
    status: 'completed',
    method: 'Chapa',
    description: 'Withdrawal from account',
  },
  {
    id: 'txn_2',
    date: new Date(2024, 1, 28),
    amount: 3500,
    status: 'completed',
    method: 'Chapa',
    description: 'Withdrawal from account',
  },
  {
    id: 'txn_3',
    date: new Date(2024, 0, 10),
    amount: 4200,
    status: 'completed',
    method: 'Chapa',
    description: 'Withdrawal from account',
  },
];

// Pricing tiers for the premium page
export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Reader',
    description: 'Access to free stories and basic features',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Access to all free stories',
      'Rate and review stories',
      'Save favorites',
      'Reading history',
      'Basic recommendations',
    ],
    cta: 'Get Started',
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Support your favorite authors and unlock exclusive content',
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      'Everything in Free',
      'Access to 80% of premium stories',
      'Early access to new chapters',
      'Support creators directly',
      'Creator updates & messages',
      'Ad-free reading experience',
      'Offline reading (limited)',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
  },
  {
    id: 'premium',
    name: 'Premium Plus',
    description: 'Unlimited access to all stories and exclusive features',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      'Everything in Creator',
      'Unlimited premium stories',
      'Text-to-speech narration',
      'Advanced recommendations',
      'Multiple reading devices',
      'Offline reading (unlimited)',
      'Priority customer support',
      'Exclusive member events',
    ],
    cta: 'Start Free Trial',
  },
];

// FAQ data
export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period, and you will not be charged again.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept payments through Chapa, which supports all major payment methods including cards, mobile money, and bank transfers.',
  },
  {
    question: 'Can I switch between plans?',
    answer:
      'Absolutely! You can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes, both Creator and Premium Plus plans offer a 7-day free trial. No credit card required to start.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 7-day money-back guarantee if you are not satisfied with your subscription. Contact our support team for more information.',
  },
  {
    question: 'How does offline reading work?',
    answer:
      'With Creator and Premium Plus plans, you can download stories to read offline. Downloaded content is available for 30 days and requires periodic online verification.',
  },
];
