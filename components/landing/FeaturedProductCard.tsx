"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";
import { useCartStore } from "@/lib/store/cartStore";

interface FeaturedProductCardProps {
  product: Product;
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      code: product.code,
      name: product.name,
      image: product.images?.[0] || "",
      price_mrp: Number(product.price_mrp),
      price_retail: Number(product.price_retail),
      price_wholesale: Number(product.price_wholesale),
      min_qty_wholesale: Number(product.min_qty_wholesale),
      qty: 1,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        <Image
          src={getOptimizedUrl(product.images?.[0] || "", 600)}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-4 space-y-2">
        <div className="text-xs uppercase tracking-widest text-accent">
          {product.code}
        </div>
        <div className="line-clamp-2 text-sm font-semibold text-primary">
          {product.name}
        </div>
        <div className="text-xs text-text-muted line-through">
          ₹{Number(product.price_mrp).toLocaleString("en-IN")}
        </div>
        <div className="text-base font-semibold text-accent">
          ₹{Number(product.price_retail).toLocaleString("en-IN")}
        </div>
        <Button className="w-full" size="sm" onClick={handleAdd}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
