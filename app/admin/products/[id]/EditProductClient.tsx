"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { ProductForm, ProductFormData } from "@/components/admin/ProductForm";
import { Product } from "@/types";

export function EditProductClient({ product }: { product: Product }) {
  const router = useRouter();

  const submit = async (data: ProductFormData) => {
    const { error } = await createClient().from("products").update(data).eq("id", product.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product updated");
    router.push("/admin/products");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-primary">Edit Product</h1>
        <p className="mt-1 text-text-muted">{product.name}</p>
      </div>
      <ProductForm initialData={product} onSubmit={submit} />
    </div>
  );
}
