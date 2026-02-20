"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, CheckCircle2, CreditCard, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/auth-context";
import { donationGuestSchema, donationLoggedInSchema, formatCurrency } from "@/lib/data";
import type { Hostel } from "@/lib/data";

const presetAmounts = [5000, 10000, 25000, 50000];

interface DonationModalProps {
  hostel: Hostel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonationModal({ hostel, open, onOpenChange }: DonationModalProps) {
  const { user, role } = useAuth();
  const isLoggedIn = role !== "GUEST" && user !== null;
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const schema = isLoggedIn ? donationLoggedInSchema : donationGuestSchema;
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      ...(isLoggedIn ? {} : { donor_name: "", donor_phone: "", donor_email: "" }),
    },
  });

  function handleAmountSelect(amount: number) {
    setSelectedAmount(amount);
    form.setValue("amount", amount);
    setStep(2);
  }

  function handleCustomAmount() {
    const amount = form.getValues("amount");
    if (amount >= 1000) {
      setSelectedAmount(amount);
      setStep(2);
    }
  }

  function onSubmit() {
    setStep(isLoggedIn ? 3 : 3);
  }

  function handlePayment() {
    setStep(4);
  }

  function handleClose() {
    setStep(1);
    setSelectedAmount(null);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Heart className="h-5 w-5 text-primary" />
            {step === 4 ? "Thank You!" : `Donate to ${hostel.name}`}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Amount Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose an amount to donate
            </p>
            <div className="grid grid-cols-2 gap-3">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className={
                    selectedAmount === amount
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                  onClick={() => handleAmountSelect(amount)}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Custom Amount (MMK)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  min={1000}
                  onChange={(e) =>
                    form.setValue("amount", Number(e.target.value))
                  }
                />
                <Button
                  onClick={handleCustomAmount}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum: 1,000 MMK
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Donor Info */}
        {step === 2 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="rounded-lg border border-border bg-secondary/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">Donating</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(selectedAmount || 0)}
                </p>
              </div>

              {isLoggedIn ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Donating as:</p>
                  <div className="rounded-lg border border-border p-3">
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name={"donor_name" as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"donor_phone" as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="09-XXXXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"donor_email" as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Email (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue to Payment
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            </form>
          </Form>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary/50 p-3 text-center">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(selectedAmount || 0)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Select a payment method
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handlePayment}
                className="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary"
              >
                <Smartphone className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-foreground">KBZPay</p>
                  <p className="text-xs text-muted-foreground">
                    Pay with KBZPay mobile wallet
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={handlePayment}
                className="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary"
              >
                <CreditCard className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Wave Money</p>
                  <p className="text-xs text-muted-foreground">
                    Pay with Wave Money
                  </p>
                </div>
              </button>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Donation Successful!
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your donation of{" "}
                <span className="font-medium text-primary">
                  {formatCurrency(selectedAmount || 0)}
                </span>{" "}
                to {hostel.name} has been received.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              You will receive a notification when your donation is distributed.
            </p>
            <Button
              onClick={handleClose}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
