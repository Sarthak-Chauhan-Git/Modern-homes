"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { createClient } from "@/lib/supabase/client";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty } = useCartStore();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price_retail * item.qty,
    0,
  );

  const proceedToCheckout = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center py-32 px-4 text-center">
        <div className="mb-6 rounded-full bg-surface-2 p-8">
          <ShoppingBag size={64} className="text-border" />
        </div>
        <h1 className="mb-4 font-display text-4xl text-primary">
          Your Cart is Empty
        </h1>
        <p className="mb-8 text-text-muted">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href="/products">
          <Button variant="primary" size="lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-24 md:py-12">
      <h1 className="mb-8 font-display text-3xl text-primary md:text-4xl">
        Your Shopping Cart
      </h1>

      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="hidden grid-cols-12 gap-4 border-b border-border pb-4 text-sm font-semibold uppercase tracking-wider text-text-muted md:grid">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="grid grid-cols-1 gap-4 py-6 md:grid-cols-12 md:items-center"
              >
                {/* Mobile: Product Header */}
                <div className="flex items-center gap-4 md:col-span-6">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-surface-2">
                    {item.image && (
                      <Image
                        src={getOptimizedUrl(item.image, 200)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product_id}`}
                      className="font-semibold text-primary hover:text-accent"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1">
                      <Badge variant="default" className="font-mono text-xs">
                        {item.code}
                      </Badge>
                    </div>
                    {/* Mobile Only Price */}
                    <div className="mt-2 text-sm font-semibold text-primary md:hidden">
                      ₹{item.price_retail.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                {/* Desktop Price */}
                <div className="hidden text-center text-primary md:col-span-2 md:block">
                  ₹{item.price_retail.toLocaleString("en-IN")}
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2 md:justify-center">
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      className="px-3 py-1 text-text-muted hover:text-primary"
                      onClick={() => {
                        if (item.qty === 1) removeItem(item.product_id);
                        else updateQty(item.product_id, item.qty - 1);
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-primary">
                      {item.qty}
                    </span>
                    <button
                      className="px-3 py-1 text-text-muted hover:text-primary disabled:opacity-50"
                      disabled={item.qty >= 99}
                      onClick={() => updateQty(item.product_id, item.qty + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Mobile Only Remove */}
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-red-500 hover:text-red-700 md:hidden"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Total & Desktop Remove */}
                <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2 md:justify-end">
                  <span className="font-bold text-accent md:w-full md:text-right">
                    ₹{(item.price_retail * item.qty).toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="hidden text-red-500 hover:text-red-700 md:block"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full flex-shrink-0 lg:w-96">
          <div className="sticky top-28 rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-6 font-display text-2xl text-primary">
              Order Summary
            </h2>

            <div className="mb-4 flex justify-between text-lg">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-bold text-primary">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mb-8 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Discounts of 5–15% will be applied at checkout based on your order
              type (Retail or Wholesale).
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="flex w-full items-center justify-center gap-2 text-xs sm:text-sm"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Button>
              <Link href="/products" className="w-full">
                <Button variant="secondary" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
