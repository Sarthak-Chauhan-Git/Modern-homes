"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { ProductForm, ProductFormData } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  const submit = async (data: ProductFormData) => {
    const { error } = await createClient().from("products").insert(data);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product created");
    router.push("/admin/products");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-primary">New Product</h1>
        <p className="mt-1 text-text-muted">Add a product to the catalogue.</p>
      </div>
      <ProductForm onSubmit={submit} />
    </div>
  );
}
