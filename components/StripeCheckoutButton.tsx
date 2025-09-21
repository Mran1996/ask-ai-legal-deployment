"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { redirectToCheckout } from "@/lib/checkout";
import type { ProductName } from "@/lib/stripe-config";
import { CreditCard, Loader2 } from "lucide-react";

interface StripeCheckoutButtonProps {
  plan: ProductName;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function StripeCheckoutButton({
  plan,
  children = "Pay & Continue",
  className,
  variant = "default",
  size = "default",
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await redirectToCheckout(plan);
    } catch (error) {
      console.error("Checkout error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Payment failed. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('publishable key is not configured')) {
          errorMessage = "Payment system is not configured. Please contact support.";
        } else if (error.message.includes('Stripe failed to load')) {
          errorMessage = "Payment system is temporarily unavailable. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
      variant={variant}
      size={size}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children}
        </>
      )}
    </Button>
  );
} 