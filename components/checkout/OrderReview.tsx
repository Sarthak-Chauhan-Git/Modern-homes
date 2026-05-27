"use client";

import Link from "next/link";
import { CartItem, DiscountSettings } from "@/types";
import { calculateDiscount } from "@/lib/utils/discounts";
import { Button } from "@/components/ui/Button";

interface OrderReviewProps {
  orderType: "retail" | "wholesale";
  items: CartItem[];
  settings: DiscountSettings[];
  onConfirm: () => void;
  onBack: () => void;
  onSwitchRetail: () => void;
}

export function OrderReview({
  orderType,
  items,
  settings,
  onConfirm,
  onBack,
  onSwitchRetail,
}: OrderReviewProps) {
  const discount = calculateDiscount(items, orderType, settings);

  return (
    <div>
      {!discount.eligible && orderType === "wholesale" ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">{discount.reason}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={onSwitchRetail}>
              Switch to Retail
            </Button>
            <Link href="/cart">
              <Button type="button" variant="secondary" size="sm">
                Increase Quantities
              </Button>
            </Link>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left text-xs uppercase tracking-wider text-text-muted">
              <th className="p-4">Product</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4 text-right">Unit</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const unit =
                orderType === "wholesale" ? item.price_wholesale : item.price_retail;
              return (
                <tr key={item.product_id} className="border-b border-border">
                  <td className="p-4">
                    <span className="font-mono text-xs text-accent">{item.code}</span>
                    <p className="mt-1 font-medium text-primary">{item.name}</p>
                  </td>
                  <td className="p-4 text-center">{item.qty}</td>
                  <td className="p-4 text-right">
                    ₹{unit.toLocaleString("en-IN")}
                  </td>
                  <td className="p-4 text-right font-semibold text-primary">
                    ₹{(unit * item.qty).toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-2 text-right">
        <p className="text-text-muted">
          Subtotal: ₹
          {items
            .reduce((sum, i) => {
              const price =
                orderType === "wholesale" ? i.price_wholesale : i.price_retail;
              return sum + price * i.qty;
            }, 0)
            .toLocaleString("en-IN")}
        </p>
        <p className={discount.eligible ? "text-green-700" : "text-text-muted"}>
          Discount ({discount.pct}%): −₹{discount.amount.toLocaleString("en-IN")}
        </p>
        <p className="text-2xl font-bold text-primary">
          TOTAL: ₹{discount.total.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onConfirm} disabled={!discount.eligible}>
          Confirm & Continue
        </Button>
      </div>
    </div>
  );
}
