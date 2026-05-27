"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { CATEGORY_TILES, SUB_CATEGORIES } from "@/lib/constants/categories";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentQueryString = searchParams.toString();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPriceInput, setMinPriceInput] = useState(searchParams.get("min_price") || "");
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get("max_price") || "");

  const category = searchParams.get("category") || "";
  const subCategory = searchParams.get("sub_category") || "";
  const inStock = searchParams.get("in_stock") === "true";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    const params = new URLSearchParams(currentQueryString);
    setSearch(params.get("search") || "");
    setMinPriceInput(params.get("min_price") || "");
    setMaxPriceInput(params.get("max_price") || "");
  }, [currentQueryString]);

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(currentQueryString);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      if (!("page" in updates)) {
        params.delete("page");
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [currentQueryString, pathname, router]
  );

  const updateFilter = useCallback(
    (key: string, value: string | null) => updateFilters({ [key]: value }),
    [updateFilters],
  );

  const applyTextFilters = () => {
    updateFilters({
      search: search.trim() || null,
      min_price: minPriceInput || null,
      max_price: maxPriceInput || null,
    });
  };

  const clearFilters = () => {
    router.push(pathname);
    setSearch("");
    setMinPriceInput("");
    setMaxPriceInput("");
  };

  const selectedCategoryName = CATEGORY_TILES.find((c) => c.slug === category)?.name || "";
  const availableSubCategories = selectedCategoryName ? SUB_CATEGORIES[selectedCategoryName] || [] : [];

  const renderSidebarContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Search</h3>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            applyTextFilters();
          }}
        >
        <div className="relative">
          <input
            type="text"
            placeholder="Name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-4 py-2 pl-10 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
        <Button type="submit" variant="secondary" size="sm" className="w-full">
          Search
        </Button>
        </form>
      </div>

      {/* Category */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Category</h3>
        <div className="space-y-2">
          {CATEGORY_TILES.map((cat) => (
            <label key={cat.slug} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={category === cat.slug}
                onChange={() => {
                  updateFilters({ category: cat.slug, sub_category: null });
                }}
                className="text-accent focus:ring-accent"
              />
              <span className={category === cat.slug ? "font-semibold text-primary" : "text-text-muted hover:text-primary"}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sub Category */}
      {availableSubCategories.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Sub Category</h3>
          <div className="space-y-2">
            {availableSubCategories.map((sub) => (
              <label key={sub} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="sub_category"
                  checked={subCategory === sub}
                  onChange={() => updateFilter("sub_category", sub)}
                  className="text-accent focus:ring-accent"
                />
                <span className={subCategory === sub ? "font-semibold text-primary" : "text-text-muted hover:text-primary"}>
                  {sub}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Price (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="text-text-muted">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <Button type="button" variant="secondary" size="sm" className="mt-3 w-full" onClick={applyTextFilters}>
          Apply Price
        </Button>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => updateFilter("in_stock", e.target.checked ? "true" : null)}
            className="rounded text-accent focus:ring-accent"
          />
          <span className="font-semibold text-primary">In Stock Only</span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Sort By</h3>
        <select
          value={sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <Button variant="secondary" className="w-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="mb-6 md:hidden">
        <Button variant="secondary" className="flex w-full items-center justify-center gap-2" onClick={() => setMobileOpen(true)}>
          <Filter size={18} /> Filter & Sort
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 md:block">
        <div className="sticky top-28">
          {renderSidebarContent()}
        </div>
      </aside>

      {/* Mobile Slide-up Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl tracking-wider text-primary">Filters</h2>
                <button onClick={() => setMobileOpen(false)} className="rounded-full p-2 hover:bg-surface-2">
                  <X size={20} />
                </button>
              </div>
              {renderSidebarContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
