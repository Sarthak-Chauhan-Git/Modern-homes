"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalCount: number;
}

export function ProductGrid({ products, currentPage, totalCount }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const itemsPerPage = 24;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const clearFilters = () => router.push(pathname);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (products.length === 0) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border py-32 text-center">
        <Search size={48} className="mb-4 text-border" />
        <h3 className="mb-2 font-display text-2xl text-primary">No products found</h3>
        <p className="mb-6 text-text-muted">Try adjusting your filters or search query.</p>
        <Button variant="primary" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  const startCount = (currentPage - 1) * itemsPerPage + 1;
  const endCount = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="flex-1">
      <div className="mb-6 text-sm text-text-muted">
        Showing <span className="font-semibold text-primary">{startCount}–{endCount}</span> of <span className="font-semibold text-primary">{totalCount}</span> products
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={item}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            disabled={currentPage <= 1}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", (currentPage - 1).toString());
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            Previous
          </Button>

          <span className="px-4 text-sm font-semibold text-primary">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="secondary"
            disabled={currentPage >= totalPages}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", (currentPage + 1).toString());
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
