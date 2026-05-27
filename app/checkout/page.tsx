"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/store/cartStore";
import { DiscountSettings, DiscountResult } from "@/types";
import { calculateDiscount } from "@/lib/utils/discounts";
import { OrderTypeSelector } from "@/components/checkout/OrderTypeSelector";
import { OrderReview } from "@/components/checkout/OrderReview";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

const STEPS = ["Order Type", "Review Order", "Delivery Details"];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState<"retail" | "wholesale">("retail");
  const [settings, setSettings] = useState<DiscountSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [discountResult, setDiscountResult] = useState<DiscountResult | null>(
    null,
  );

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/auth/login?redirect=/checkout");
      }
    });

    supabase
      .from("discount_settings")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        }
        setSettings((data as DiscountSettings[]) || []);
        setLoading(false);
      });
  }, [items.length, router]);

  const handleSelectType = (type: "retail" | "wholesale") => {
    setOrderType(type);
    setStep(2);
  };

  const handleConfirmReview = () => {
    const result = calculateDiscount(items, orderType, settings);
    setDiscountResult(result);
    if (result.eligible) {
      setStep(3);
    }
  };

  const handleSwitchRetail = () => {
    setOrderType("retail");
    const result = calculateDiscount(items, "retail", settings);
    setDiscountResult(result);
    setStep(3);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-24 md:py-12">
      <h1 className="mb-8 font-display text-3xl text-primary md:text-4xl">
        Checkout
      </h1>

      <div className="mb-10 flex flex-wrap items-start justify-center gap-2 md:items-center md:gap-4">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const active = step === stepNumber;
          const completed = step > stepNumber;
          return (
            <div key={label} className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                    active
                      ? "bg-accent text-white"
                      : completed
                        ? "bg-accent/25 text-accent"
                        : "bg-surface-2 text-text-muted",
                  )}
                >
                  {stepNumber}
                </span>
                <span className="max-w-20 text-center text-[10px] leading-tight text-text-muted md:block md:text-xs">
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 ? (
                <div
                  className={cn(
                    "h-px w-8 md:w-16",
                    completed ? "bg-accent" : "bg-border",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {step === 1 ? (
        <OrderTypeSelector settings={settings} onSelect={handleSelectType} />
      ) : null}

      {step === 2 ? (
        <OrderReview
          orderType={orderType}
          items={items}
          settings={settings}
          onConfirm={handleConfirmReview}
          onBack={() => setStep(1)}
          onSwitchRetail={handleSwitchRetail}
        />
      ) : null}

      {step === 3 && discountResult ? (
        <div>
          <button
            type="button"
            className="mb-6 text-sm font-medium text-accent hover:underline"
            onClick={() => setStep(2)}
          >
            ← Back to review
          </button>
          <CheckoutForm
            orderType={orderType}
            discountResult={discountResult}
            items={items}
          />
        </div>
      ) : null}
    </div>
  );
}
