import { api } from '@/lib/api'

export interface WalletDto {
  userId: string;
  balance: number;
  adRevenue: number;
  premiumRevenue: number;
  donationRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDto {
  _id: string;
  userId: string;
  amount: number;
  type: 'ad' | 'premium' | 'donation' | 'withdrawal';
  description: string;
  createdAt: string;
}

export const WalletService = {
  getWallet: async (): Promise<WalletDto> => {
    const res = await api.get('/wallet')
    return res.data
  },

  getTransactions: async (): Promise<TransactionDto[]> => {
    const res = await api.get('/wallet/transactions')
    return res.data
  },
}
