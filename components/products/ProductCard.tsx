"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store/cartStore";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
  showWholesale?: boolean;
}

export function ProductCard({ product, showWholesale }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      product_id: product.id,
      code: product.code,
      name: product.name,
      image: product.images[0] || "",
      price_mrp: product.price_mrp,
      price_retail: product.price_retail,
      price_wholesale: product.price_wholesale,
      min_qty_wholesale: product.min_qty_wholesale,
      qty: 1,
    });

    toast.success("Added to cart");
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
          {product.images?.[0] ? (
            <Image
              src={getOptimizedUrl(product.images[0], 400)}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted">
              No Image
            </div>
          )}

          {/* Overlays */}
          <div className="absolute left-3 top-3">
            <Badge variant="default" className="font-mono text-xs opacity-90 shadow-sm backdrop-blur-md">
              {product.code}
            </Badge>
          </div>

          {!product.in_stock && (
            <div className="absolute right-0 top-3 rounded-l-md bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-1 text-xs text-text-muted">
            {product.category}
          </div>
          <h3 className="mb-4 line-clamp-2 font-body text-base font-semibold text-primary">
            {product.name}
          </h3>

          <div className="mt-auto">
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-accent">
                ₹{product.price_retail.toLocaleString("en-IN")}
              </span>
              <span className="mb-0.5 text-sm text-text-muted line-through">
                ₹{product.price_mrp.toLocaleString("en-IN")}
              </span>
            </div>

            {showWholesale && (
              <div className="mt-1 text-sm text-text-muted">
                Wholesale: <span className="font-semibold">₹{product.price_wholesale.toLocaleString("en-IN")}</span> 
                <span className="text-xs"> (min {product.min_qty_wholesale})</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Action Section */}
      <div className="p-5 pt-0">
        <Button
          variant="primary"
          className="w-full text-sm"
          disabled={!product.in_stock}
          onClick={handleAddToCart}
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
      </div>
    </motion.div>
  );
}
