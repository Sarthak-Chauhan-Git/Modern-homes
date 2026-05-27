import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 pb-8 pt-28 md:pb-12 md:pt-36">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
