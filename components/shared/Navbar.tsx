"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import {
  ChevronDown,
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { cn } from "@/lib/utils/cn";
import { CATEGORY_TILES } from "@/lib/constants/categories";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", mega: true },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [accountLabel, setAccountLabel] = useState<string | null>(null);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setAccountLabel(user?.user_metadata?.full_name || user?.email || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setAccountLabel(user?.user_metadata?.full_name || user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await createClient().auth.signOut();
    setAccountLabel(null);
    window.location.href = "/";
  };

  useEffect(() => {
    return scrollY.on("change", (latest) => setScrolled(latest > 20));
  }, [scrollY]);

  return (
    <header className="fixed top-0 z-50 w-full">
      <nav
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-white/90 shadow-lg backdrop-blur"
            : "bg-white/40 backdrop-blur",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.16em] text-primary md:text-2xl md:tracking-[0.25em]"
          >
            MODERN HOMES
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) =>
              link.mega ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium uppercase tracking-widest text-primary hover:text-accent">
                    {link.label}
                    <ChevronDown size={16} className="opacity-60" />
                  </button>
                  <AnimatePresence>
                    {megaOpen ? (
                      <motion.div
                        className="fixed left-1/2 top-[50vh] w-[min(92vw,980px)] rounded-2xl border border-border bg-white p-6 shadow-2xl before:absolute before:-top-[50vh] before:left-0 before:h-[50vh] before:w-full before:-z-10 before:bg-transparent"
                        initial={{ opacity: 0, x: "-50%", y: "-40%" }}
                        animate={{ opacity: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, x: "-50%", y: "-40%" }}
                      >
                        <div className="flex flex-wrap justify-center gap-6">
                          {CATEGORY_TILES.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              className="group flex w-40 cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20"
                            >
                              <div className="relative aspect-square w-full overflow-hidden">
                                <Image
                                  src={getOptimizedUrl(cat.image, 400)}
                                  alt={cat.name}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                              </div>
                              <div className="flex flex-1 items-center justify-center border-t border-border/30 p-4">
                                <span className="text-center text-xs font-bold uppercase tracking-widest text-primary transition-colors duration-300 group-hover:text-accent">
                                  {cat.name}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium uppercase tracking-widest text-primary transition hover:text-accent"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <button
              className="relative rounded-full p-2 text-primary transition hover:bg-surface-2"
              onClick={openCart}
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {mounted && totalItems > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              ) : null}
            </button>
            {mounted && accountLabel ? (
              <div className="flex items-center gap-3">
                <span className="max-w-[150px] truncate text-xs font-semibold text-primary" title={accountLabel}>
                  {accountLabel}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary transition hover:border-accent hover:text-accent"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary transition hover:border-accent hover:text-accent"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="rounded-full p-2 text-primary transition hover:bg-surface-2 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white p-5 sm:p-6"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg tracking-[0.14em] sm:text-xl sm:tracking-[0.2em]">
                  MODERN HOMES
                </span>
                <button
                  className="rounded-full p-2 text-primary transition hover:bg-surface-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {navLinks.map((link) =>
                  link.mega ? (
                    <div key={link.label}>
                      <button
                        className="flex w-full items-center justify-between text-left text-sm font-semibold uppercase tracking-widest text-primary"
                        onClick={() => setShowCategories((prev) => !prev)}
                      >
                        {link.label}
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition",
                            showCategories ? "rotate-180" : "",
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {showCategories ? (
                          <motion.div
                            className="mt-3 grid gap-3"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            {CATEGORY_TILES.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/products?category=${cat.slug}`}
                                className="rounded-lg border border-border px-3 py-2 text-sm text-primary"
                                onClick={() => setMobileOpen(false)}
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block text-sm font-semibold uppercase tracking-widest text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>

              <div className="mt-10 flex gap-3">
                <button
                  className="flex-1 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary"
                  onClick={() => {
                    setMobileOpen(false);
                    openCart();
                  }}
                >
                  Cart
                </button>
                {mounted && accountLabel ? (
                  <button
                    type="button"
                    className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-white"
                    onClick={logout}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
              {mounted && accountLabel ? (
                <p className="mt-3 truncate text-center text-xs text-text-muted" title={accountLabel}>
                  {accountLabel}
                </p>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
