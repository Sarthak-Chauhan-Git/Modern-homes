"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      code: product.code,
      name: product.name,
      image: product.images[0] || "",
      price_mrp: product.price_mrp,
      price_retail: product.price_retail,
      price_wholesale: product.price_wholesale,
      min_qty_wholesale: product.min_qty_wholesale,
      qty,
    });
    toast.success(`${qty} item(s) added to cart`);
    setQty(1);
  };

  const whatsappMessage = encodeURIComponent(`Hi, I would like to enquire about this product:\nName: ${product.name}\nCode: ${product.code}\nLink: ${typeof window !== 'undefined' ? window.location.href : ''}`);
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || '911234567890'}?text=${whatsappMessage}`;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-md border border-border bg-surface-2 p-1">
          <button
            className="flex h-10 w-10 items-center justify-center rounded text-text-muted transition hover:bg-white hover:text-primary disabled:opacity-50"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus size={16} />
          </button>
          <span className="flex h-10 w-12 items-center justify-center font-semibold text-primary">
            {qty}
          </span>
          <button
            className="flex h-10 w-10 items-center justify-center rounded text-text-muted transition hover:bg-white hover:text-primary disabled:opacity-50"
            disabled={qty >= 99}
            onClick={() => setQty((q) => Math.min(99, q + 1))}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          className="flex-1"
          disabled={!product.in_stock}
          onClick={handleAdd}
        >
          {product.in_stock ? (
            <>
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </Button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center rounded-md bg-[#25D366] px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-[#20bd5a]"
        >
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  );
}
