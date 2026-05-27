"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/components/ui/Button";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems());
  const subtotal = useCartStore((s) => s.getSubtotal("retail"));
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <div className="text-lg font-semibold text-primary">
                  Your Cart
                </div>
                <div className="text-xs uppercase tracking-widest text-text-muted">
                  {totalItems} items
                </div>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-2 text-text-muted transition hover:bg-surface-2 hover:text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <div className="rounded-full bg-surface-2 p-6 text-text-muted">
                    <ShoppingBag size={28} />
                  </div>
                  <div className="text-base font-semibold text-primary">
                    Your cart is empty
                  </div>
                  <p className="text-sm text-text-muted">
                    Explore our premium range to start adding products.
                  </p>
                  <Link href="/products" onClick={closeCart}>
                    <Button size="sm" variant="secondary">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <CartItem
                    key={item.product_id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQty={updateQty}
                  />
                ))
              )}
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between text-sm font-semibold text-primary">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="mt-2 text-xs text-amber-600">
                Discounts applied at checkout based on order type.
              </p>
              <div className="mt-4 grid gap-3">
                <Link href="/cart" onClick={closeCart}>
                  <Button variant="secondary" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full">Checkout</Button>
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
