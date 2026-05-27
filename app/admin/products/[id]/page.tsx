import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditProductClient } from "./EditProductClient";
import { Product } from "@/types";

export const generateMetadata = async () => ({ title: "Edit Product | Admin | Modern Homes" });

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single();
  if (!product) notFound();

  return <EditProductClient product={product as Product} />;
}
