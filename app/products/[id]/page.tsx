import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ImageGallery } from "@/components/products/ImageGallery";
import { ProductActions } from "@/components/products/ProductActions";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { Product } from "@/types";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, code, category, description")
    .eq("id", params.id)
    .single();

  if (!product) {
    return { title: "Product Not Found | Modern Homes" };
  }
  return {
    title: `${product.name} (${product.code}) | Modern Homes`,
    description: `${product.description || product.name} - ${product.category}. Shop at Modern Homes for the best prices.`,
    openGraph: {
      title: `${product.name} | Modern Homes`,
      description: product.description || `Shop ${product.name} at Modern Homes.`,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = "retail";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile) role = profile.role;
  }

  const { data: product, error } = await supabase.from("products").select("*").eq("id", params.id).single();

  if (error || !product) {
    notFound();
  }

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  const specs = (product.specs as Record<string, string>) || {};

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Left: Image Gallery */}
        <div>
          <ImageGallery images={product.images || []} productName={product.name} />
        </div>

        {/* Right: Product Info */}
        <div>
          <Badge variant="accent" className="font-mono text-sm shadow-sm">{product.code}</Badge>
          <h1 className="mt-4 font-display text-3xl text-primary md:text-4xl">{product.name}</h1>
          <p className="mt-2 text-text-muted">{product.category} {product.sub_category && `— ${product.sub_category}`}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-body text-3xl font-bold text-accent">₹{product.price_retail.toLocaleString("en-IN")}</span>
            <span className="mb-1 text-lg text-text-muted line-through">₹{product.price_mrp.toLocaleString("en-IN")}</span>
          </div>

          {role === "wholesale" && (
            <div className="mt-2 rounded-md bg-surface-2 p-3 text-sm text-text-muted">
              Wholesale Price: <span className="font-bold text-primary">₹{product.price_wholesale.toLocaleString("en-IN")}</span> <br />
              <span className="text-xs">(Minimum order quantity: {product.min_qty_wholesale} units)</span>
            </div>
          )}

          <div className="mt-6">
            {product.in_stock ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="error">Out of Stock</Badge>
            )}
          </div>

          <hr className="my-8 border-border" />

          {/* Specs */}
          {Object.keys(specs).length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 font-display text-xl text-primary">Specifications</h3>
              <div className="divide-y divide-border rounded-lg border border-border">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex px-4 py-3 text-sm">
                    <span className="w-1/3 font-semibold text-primary">{key}</span>
                    <span className="w-2/3 text-text-muted">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ProductActions product={product as Product} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="mb-8 font-display text-3xl text-primary">Related Products</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p as Product} showWholesale={role === "wholesale"} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
