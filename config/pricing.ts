// Pricing configuration - easily changeable from backend
export const PRICING_PLANS = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 50,
    currency: 'ETB',
    period: 'per week',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 150,
    currency: 'ETB',
    period: 'per month',
    popular: true,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 1500,
    currency: 'ETB',
    period: 'per year',
    savings: 'Save 2 months!',
  },
]
