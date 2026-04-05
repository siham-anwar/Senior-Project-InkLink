'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const withdrawalSchema = z.object({
  amount: z.coerce
    .number()
    .min(100, { message: 'Minimum withdrawal amount is ₦100' })
    .max(999999999, { message: 'Invalid amount' }),
  method: z.enum(['chapa', 'bank_transfer']),
  accountNumber: z.string().min(10, { message: 'Invalid account number' }),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface WithdrawalFormProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  pendingBalance: number;
}

export function WithdrawalForm({
  isOpen,
  onClose,
  availableBalance,
  pendingBalance,
}: WithdrawalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: undefined,
      method: 'chapa',
      accountNumber: '',
    },
  });

  const onSubmit = async (data: WithdrawalFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Withdrawal request:', data);
      setSubmitSuccess(true);

      setTimeout(() => {
        form.reset();
        setSubmitSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Withdraw your earnings to your connected payment method
          </DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Withdrawal Requested!</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Your withdrawal request has been submitted. You&apos;ll receive your funds within 3-5 business days.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Balance Info */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Available Balance</p>
                  <p className="text-lg font-bold text-foreground">₦{availableBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Pending</p>
                  <p className="text-lg font-bold text-yellow-600">₦{pendingBalance.toLocaleString()}</p>
                </div>
              </div>

              {/* Alert */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Minimum withdrawal amount is ₦100. Funds will be transferred within 3-5 business days.
                </AlertDescription>
              </Alert>

              {/* Amount Field */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₦)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter amount"
                        type="number"
                        step="100"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum: ₦{availableBalance.toLocaleString()}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="chapa">Chapa Payment</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Account Number */}
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter account number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
