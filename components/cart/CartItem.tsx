"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQty }: CartItemProps) {
  const price = item.price_retail;
  const lineTotal = price * item.qty;

  return (
    <div className="flex items-center gap-4 border-b border-border pb-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
        <Image
          src={getOptimizedUrl(item.image, 120)}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-primary">{item.name}</div>
        <div className="mt-1 text-xs uppercase tracking-widest text-text-muted">
          {item.code}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            className="rounded-full border border-border p-1 text-primary transition hover:bg-surface-2"
            onClick={() => onUpdateQty(item.product_id, item.qty - 1)}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-semibold">{item.qty}</span>
          <button
            className="rounded-full border border-border p-1 text-primary transition hover:bg-surface-2"
            onClick={() => onUpdateQty(item.product_id, item.qty + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-text-muted">
          Rs. {price.toLocaleString("en-IN")} each
        </div>
        <div className="text-sm font-semibold text-primary">
          ₹{lineTotal.toLocaleString("en-IN")}
        </div>
        <button
          className="mt-3 text-xs text-red-500 transition hover:text-red-600"
          onClick={() => onRemove(item.product_id)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
