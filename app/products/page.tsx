import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";
import { CATEGORY_TILES } from "@/lib/constants/categories";
import { Product } from "@/types";

export const metadata = {
  title: "Products | Modern Homes",
  description: "Browse premium sanitary ware, faucets, showers, bath fittings, and wholesale products at Modern Homes.",
  openGraph: {
    title: "Products | Modern Homes",
    description: "Shop premium sanitary ware products with retail and wholesale pricing.",
    type: "website",
  },
};

interface ProductsPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const supabase = createClient();
  const page = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 24;

  let query = supabase.from("products").select("*", { count: "exact" });

  if (searchParams.category) {
    const selectedCategory = CATEGORY_TILES.find(
      (cat) => cat.slug === searchParams.category,
    );
    query = query.eq("category", selectedCategory?.name || searchParams.category);
  }
  if (searchParams.sub_category) {
    query = query.eq("sub_category", searchParams.sub_category);
  }
  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,code.ilike.%${searchParams.search}%`);
  }
  if (searchParams.min_price) {
    query = query.gte("price_retail", searchParams.min_price);
  }
  if (searchParams.max_price) {
    query = query.lte("price_retail", searchParams.max_price);
  }
  if (searchParams.in_stock === "true") {
    query = query.eq("in_stock", true);
  }

  const sort = searchParams.sort || "newest";
  if (sort === "price_asc") {
    query = query.order("price_retail", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price_retail", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // Pagination
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
  }

  const products = (data as Product[]) || [];
  const totalCount = count || 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 pb-8 pt-28 md:pb-12 md:pt-36">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-primary md:text-5xl">Our Products</h1>
        <p className="mt-2 text-text-muted">Browse our premium collection of sanitary ware and bath fittings.</p>
      </div>

      <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12">
        <FilterSidebar />
        
        <Suspense fallback={
          <div className="flex-1">
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
             </div>
          </div>
        }>
          <ProductGrid 
            products={products} 
            currentPage={page} 
            totalCount={totalCount} 
          />
        </Suspense>
      </div>
    </div>
  );
}
