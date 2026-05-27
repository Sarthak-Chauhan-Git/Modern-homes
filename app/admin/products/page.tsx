"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Edit, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/constants/categories";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const fetchProducts = async () => {
    const { data, error } = await createClient().from("products").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setProducts((data as Product[]) || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !q || product.name.toLowerCase().includes(q) || product.code.toLowerCase().includes(q);
      const matchesCategory = category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    const { error } = await createClient().from("products").delete().eq("id", product.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Product deleted");
      fetchProducts();
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl text-primary">Products</h1>
          <p className="mt-1 text-text-muted">Create, edit, and remove catalogue products.</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={18} />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or code" className="rounded-lg border border-border px-4 py-2 text-sm" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-border px-4 py-2 text-sm">
            <option value="all">All Categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
            <div className="relative aspect-[4/3] bg-surface-2">
              {product.images?.[0] ? <Image src={getOptimizedUrl(product.images[0], 500)} alt={product.name} fill className="object-cover" /> : null}
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <Badge variant={product.in_stock ? "success" : "error"}>{product.in_stock ? "In stock" : "Out"}</Badge>
                {product.featured ? <Badge variant="accent">Featured</Badge> : null}
              </div>
              <div className="font-mono text-xs text-text-muted">{product.code}</div>
              <h2 className="mt-1 line-clamp-2 font-semibold text-primary">{product.name}</h2>
              <div className="mt-2 text-sm text-text-muted">{product.category}</div>
              <div className="mt-4 font-bold text-accent">Rs. {product.price_retail.toLocaleString("en-IN")}</div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/admin/products/${product.id}`} className="flex-1">
                  <Button type="button" variant="secondary" size="sm" className="w-full">
                    <Edit size={15} />
                    Edit
                  </Button>
                </Link>
                <Button type="button" variant="danger" size="sm" onClick={() => deleteProduct(product)}>
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
